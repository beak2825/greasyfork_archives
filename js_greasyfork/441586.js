// ==UserScript==
// @name         Semantle Enhancements
// @namespace    http://c9a.dev/
// @version      0.5.2
// @description  Add a little pizzazz to Semantle
// @author       Ell Bradshaw
// @match        https://semantle.com/*
// @match        https://semantle.novalis.org/*
// @icon         https://www.google.com/s2/favicons?domain=novalis.org
// @require      https://cdn.jsdelivr.net/npm/d3@7.3.0/dist/d3.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441586/Semantle%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/441586/Semantle%20Enhancements.meta.js
// ==/UserScript==

/* globals d3 */
/* global Semantle guesses guessed */

const head = document.querySelector('head');
const styles = document.createElement('style');
styles.innerHTML = `;
.cloud {
  display: flex;
  flex-direction: column;
}
.cloud .row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.cloud .word {
  margin: 0px 5px;
}
`;
head.appendChild(styles);

let guessTable;
let gameNum;
let chartParts = {};
let similarityValues;
let xScale, yScale;
let xAxis, yAxis;
let focusedWord = null;

// This does negatives like I want
function round(num, digits) {
  const mult = 10**digits;
  return Math.floor(num*mult)/mult;
}

function magRound(num) {
  const magnitude = Math.floor(Math.log10(num));
  return round(num, -magnitude);
}

class Cloud {
  constructor(insertPoint, waypoints, { scale, width }) {
    this.waypoints = waypoints;
    this.scale = scale;
    this.width = width;
    this.minSize = 12;
    this.div = document.createElement('div');
    this.div.setAttribute('class', 'cloud');
    this.insertPoint = insertPoint
    this.insertPoint.parentNode.insertBefore(this.div, this.insertPoint);

    this.words = d3.select(this.div);
  }

  getSize(similarity) {
    return this.minSize + similarity*this.scale
  }

  getWordsPerLine(guess) {
    const guessSize = this.getSize(guess.similarity);
    const estimatedWordsPerLine = this.width/(guessSize*5);
    const wordsPerLine = Math.max(magRound(estimatedWordsPerLine), 10);
    //console.log("Words per line: ", guessSize, estimatedWordsPerLine, wordsPerLine);
    return wordsPerLine;
  }

  update(guesses, lastGuess) {
    const [closest, top10, top1000] = this.waypoints;
    guesses.sort((a, b) => b.similarity - a.similarity);

    const groups = [];

    // determine breaks
    let nextBreak = 1000;
    let curWords = [];
    let wordsPerLine = this.getWordsPerLine(guesses[0]);
    let breakSize = 1;
    for(const guess of guesses) {
      const guessSize = this.getSize(guess.similarity);
      let niceBreak = false;
      if(guess.closeness && guess.closeness < nextBreak) {
        niceBreak = (curWords.length > wordsPerLine/3) || curWords[0] && curWords[0].closeness === 1000;
        const pos = 1000-guess.closeness;
        breakSize = 10**(Math.floor(Math.log10(pos)));
        nextBreak = 1000 - (Math.floor(pos/breakSize)+1)*breakSize;
          console.log('next break:', nextBreak)
      } else if(guess.similarity < top1000 && nextBreak !== null) {
        niceBreak = true;
        nextBreak = null;
      }
      if(niceBreak || curWords.length > wordsPerLine) {
        groups.push(curWords);
        wordsPerLine = this.getWordsPerLine(guess);
        curWords = [];
      }
      curWords.push(guess);
    }
    if(curWords.length) { groups.push(curWords); }
    groups.reverse()
    const self = this;
    const rows = this.words
      .selectAll('div.row')
      .data(groups)
      .join(enter => enter.append('div').attr('class', 'row'))
        .selectAll('div.word')
        .data(g => g, d => d.order)
        .join(
          enter => enter.append('div')
          .attr('class', 'word')
          .text(d => d.closeness === 1000 ? `🎉🏆${d.guess}🏆🎉` : d.guess)
        )
        .style('font-size', d => self.getSize(d.similarity) + 'px')
        .style('color', d => d.order === lastGuess ? 'red' : d.closeness ? `rgb(0,${d.closeness/1000*96+31},0)` : `rgb(${d.similarity/100*255},0,0)`)
        .style('font-weight', d => d.order === lastGuess ? 'bold' : 'normal');
   }
}

class Chart {
  constructor(insertPoint, waypoints) {
    this.waypoints = waypoints;
    this.div = document.createElement('div');
    this.insertPoint = insertPoint
    this.insertPoint.parentNode.insertBefore(this.div, this.insertPoint);

    this.height = 200;
    this.margin = 20;

    const chart = d3.select(this.div).append('svg')
      .style('width', '100%')
      .attr('height', this.height);
    window.chart = chart;

    // TODO: Not const?;
    const width = this.div.querySelector('svg').clientWidth;

    this.guesses = chart.append('g');
    this.max = chart.append('g');
    this.avg = chart.append('g');
    this.labels = chart.append('g').attr('fill', 'rgba(255,255,255,0.2)');
    this.xAxis = chart.append('g');
    this.yAxis = chart.append('g');

    yScale = d3.scaleLinear().domain([-10,100]).range([this.height-this.margin*2,this.margin]);
    // TODO: Shrink as we keep guessing;
    xScale = d3.scaleLinear().domain([0,200]).range([this.margin*2,width-this.margin]);

    xAxis = d3.axisBottom(xScale);
    yAxis = d3.axisLeft(yScale).ticks(5);

    const addTitle = (text, rotate) => (axis) => {
      const bbox = axis.node().getBBox();
      const textElm = axis
        .append('text')
        .text(text)
        .attr('text-anchor','middle')
        .attr('dominant-baseline', 'hanging')
        .attr('fill', 'black');

      if(rotate) {
        textElm
          .attr('writing-mode','vertical-rl')
          .attr('y',bbox.y + bbox.height/2)
          .attr('x',-bbox.width);
      } else {
        textElm
          .attr('x',bbox.x + bbox.width/2)
          .attr('y',bbox.height);
      }
    };

    this.xAxis
      .attr('transform', `translate(0,${yScale.range()[0]})`)
      .call(xAxis)
      .call(addTitle('Guesses'));
    this.yAxis
      .attr('transform', `translate(${xScale.range()[0]},0)`)
      .call(yAxis)
      .call(addTitle('Closeness', true));

    this.annotations = chart.append('g')
      .selectAll('line')
      .data(this.waypoints)
      .join('line')
      .attr('stroke', 'gray')
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', `${xScale(0.4) - xScale(0)} ${xScale(0.6) - xScale(0)}`)
      .attr('x1', xScale.range()[0])
      .attr('x2', xScale.range()[1])
      .attr('y1', yScale)
      .attr('y2', yScale);
  }

  insert(insertPoint = null) {
      if(insertPoint) { this.insertPoint = insertPoint }
      this.insertPoint.parentNode.insertBefore(this.div, this.insertPoint)
  }

  update(guesses, lastGuess, reinsertPoint = null) {
    if(reinsertPoint) {
        this.insert(reinsertPoint)
    }
    guesses.sort((a, b) => a.order - b.order);

    const players = new Set(guesses.map(g => g.player))
    const color = d3.scaleOrdinal(players, d3.schemeCategory10)

    if(guesses.length > xScale.domain()[1]) {
      while(guesses.length > xScale.domain()[1]) {
        xScale.domain([xScale.domain()[0], xScale.domain()[1]+10]);
      }
      this.xAxis.call(xAxis);
    }

    this.guesses
      .selectAll('circle')
      .data(guesses, d => d.order)
      .join(enter => enter.append('circle')
        .attr('alt', d => d.guess)
      )
      .attr('cx', d => xScale(d.order))
      .attr('cy', d => yScale(d.similarity))
      .attr('r', d => d.order === lastGuess ? 4 : 2 )
      .attr('fill', d => color(d.player))
      .attr('stroke', d => d.order === lastGuess ? 'red' : 'none')
      .attr('strokeWidth', '0.5px')

    this.max
      .selectAll('circle')
      .data(guesses, d => d.order)
      .join(enter => enter.append('circle')
        .attr('alt', d => d.guess)
        .attr('r', "1px")
        .attr('fill', 'green')
      )
      .attr('cx', d => xScale(d.order))
      .attr('cy', d => yScale(d.max));

    let avg = movingAveragePoints(guesses.map(g => g.similarity), 12);
    this.avg
      .selectAll('path')
      .data([avg])
      .join('path')
      .attr('d', d3.line(d => xScale(d[0]), d => yScale(d[1])))
      .attr('stroke', 'purple')
      .attr('opacity', '0.5')
      .attr('fill', 'none')
      .attr('stroke-width', '2px');

    const valueLabels = ['Closest', 'Top 10', 'Top 1000'];
    const valueComment = (idx) => {
      switch(idx) {
        case 0:
          return guesses.find(g => g.closeness === 999) ? '✔' : '';
        case 1:
          return `(${guesses.filter(g => g.closeness >= 990).length})`;
        case 2:
          return `(${guesses.filter(g => g.closeness).length})`;
      }
    };

    this.labels
      .selectAll('text')
      .data(this.waypoints)
      .join(enter => enter.append('text')
        .attr('color', 'darkgray')
        .attr('font-size', '8pt')
        .attr('background', 'rgba(0,0,0,0.1)')
      )
      .attr('x', xScale(1))
      .attr('y', d => yScale(d+2))
      .text((_, i) => `${valueLabels[i]} ${valueComment(i)}`);
  }
}

async function waitFor(f, check=null, delay=10) {
    if(typeof check === "number") { delay = check; check = null }
    let result;
    try {
        result = f();
    } catch(e) {}

    if(result && (!check || check(result))) {
      return result
    }

    await new Promise(resolve => setTimeout(resolve, delay))
    return waitFor(f, check, delay*2)
}

function manageDayStore() {
  //storeDay();
  const queryParams = new URLSearchParams(window.location.search);
  /*
  let loadDay = queryParams.get('day');

  if(loadDay) {
    let oldGuesses = window.localStorage.getItem(`guesses.${loadDay}`);
    if(oldGuesses) {
      console.log(`Loading day ${loadDay}`);
      const guessData = JSON.parse(oldGuesses);
      // We just saved it above, so we're safe to overwrite;
      window.localStorage.setItem('puzzleNumber', loadDay);
      window.localStorage.setItem('guesses', oldGuesses);
      window.localStorage.setItem('winState', Number(guessData[0][0]) === 100 ? 1 : -1);

      secret = secretWords[loadDay].toLowerCase();
      try {
        similarityStory = await Semantle.getSimilarityStory(secret);
        document.getElementById('similarity-story').innerHTML = `;
Today is puzzle number <b>${puzzleNumber}</b>. The nearest word has a similarity of;
<b>${(similarityStory.top * 100).toFixed(2)}</b>, the tenth-nearest has a similarity of;
${(similarityStory.top10 * 100).toFixed(2)} and the one thousandth nearest word has a;
similarity of ${(similarityStory.rest * 100).toFixed(2)}.;
`;
      } catch(e) {
        // Whatevs;
      }

      guesses.length = 0;
      let lastGuess = null;
      for(guess of guessData) {
        if(!lastGuess || lastGuess[3] < guess[3]) {
          lastGuess = guess;
        }
        guesses.push(guess);
        guessed.add(guess[1]);
      }
      console.log(guesses);
      guessCount = guessed.size;
      latestGuess = lastGuess[1];

      similarityValues.then(function() {
        document.getElementById('guess').value = latestGuess;
        document.getElementById('guess-btn').click();
      });
    }
  }
  */
}

function getParts(refElm = null) {
  if(!refElm) { refElm = document }
  const parts = refElm.querySelectorAll('app-game > div > div > div > div, app-archive-game > div > div > div')
  return parts;
}


(async function() {
  'use strict';

  // For bookmarklet
  let d3Ready = Promise.resolve();
  if(typeof d3 === 'undefined') {
      (function() {
          var script = document.createElement("script");
          script.async = true;
          script.src = "https://cdn.jsdelivr.net/npm/d3@7.3.0/dist/d3.min.js";
          script.charset = "utf-8";
          document.body.appendChild(script);
      })();
      d3Ready = new Promise(resolve => {
        function checkReady() {
            if(typeof d3 === 'undefined') {
                setTimeout(checkReady, 100);
            } else {
                resolve();
            }
        }
        checkReady();
      });
  }
  await d3Ready;

  // Wait for loading indicator to go away
  const input = await waitFor(() => document.querySelector('app-inputs input'), elm => elm.placeholder && !elm.placeholder.startsWith("Loading"))
  console.log(input, input.placeholder)

  guessTable = await waitFor(() => document.querySelector('app-guesses'));
  const [similarityStory, gameTitle, playField, ...rest] = getParts()

  similarityValues = new Promise(async resolve => {
    if(similarityStory.innerText) {
        return resolve(parseSimilarity(similarityStory));
    }

    const similarityUpdate = new MutationObserver(function() {
      resolve(parseSimilarity(similarityStory));
    });
    similarityUpdate.observe(similarityStory, {childList: true});
  });

  gameNum = Number(gameTitle.innerText.split('#')[1])

  manageDayStore()

  const waypoints = await similarityValues;
  const tableParts = await waitFor(() => guessTable.querySelectorAll('app-guesses div.text-slate-900'), (elm) => elm.length > 0)
  const lastWord = await waitFor(() => tableParts[1].querySelector('a'))

  console.log(waypoints, tableParts, lastWord, gameNum)

  const cloud = new Cloud(gameTitle, waypoints, {
      scale: 1/6,
      width: 800
  });
  const chart = new Chart(gameTitle, waypoints);
  async function update(newTarget = null) {
    //storeDay();
    console.log('Update!', newTarget)
    await new Promise(resolve => setTimeout(resolve, 200));
    const [guesses, lastGuess] = parseGuesses();
    if(!guessTable) { guessTable = await waitFor(() => document.querySelector('app-guesses')); }
    chart.update(guesses, lastGuess, newTarget);
    cloud.update(guesses, lastGuess, newTarget);
  }
  const tableUpdate = new MutationObserver(function() { update() });
  tableUpdate.observe(tableParts[2], {childList: true});
  tableUpdate.observe(lastWord, {attributes: true});
  const containerUpdate = new MutationObserver(function(updates) {
      const parts = getParts(updates[0].target)
      update(parts[1])
  })
  containerUpdate.observe(document.querySelector('app-game, app-archive-game').parentNode, {childList: true});
  update();
})();

function zipObject(keys, values) {
  return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
}

function parseSimilarity(story) {
  const storyNumbers = story.innerText.match(/\d+(\.\d+)?/g).map(parseFloat);
  return storyNumbers.slice(1);
}


function storeDay() {
  const guesses = window.localStorage.getItem('guesses');
  const day = window.localStorage.getItem('puzzleNumber');
  // comment this line out if you don't want to be storing history;
  window.localStorage.setItem(`guesses.${day}`, guesses);
}

// from https://observablehq.com/@d3/moving-average;
function movingAverage(values, N) {
  let i = 0;
  let sum = 0;
  const means = new Float64Array(values.length).fill(NaN);
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
  sum += values[i];
  }
  for (let n = values.length; i < n; ++i) {
  sum += values[i];
  means[i] = sum / N;
  sum -= values[i - N + 1];
  }
  return means;
}
function movingAveragePoints(values, N) {
  // TODO: Should this be floor? are we off-by-one?;
  return Array.from(movingAverage(values, N))
    .map((v, i) => Number.isNaN(v) ? false : [i-Math.floor(N/2), v])
    .filter(v => v);
}

function parseGuesses() {
  const game = JSON.parse(window.localStorage.getItem(`game_en_${gameNum}`))
  /*
  const guesses = game.guesses.map(
    row => zipObject(
      ['similarity','guess','closeness','order'],
      row.map((v, i) => i === 1 ? v : Number(v))
    )
  );

  let lastGuess = document.querySelector('#guesses td').innerText;
  lastGuess = lastGuess ? parseInt(lastGuess) : null;
*/

  let guesses = game.guesses;
  if(!guesses.find(g => g.guess === game.recentGuess.guess)) {
      guesses.append(game.recentGuess)
  }
  guesses = guesses.map(g => ({
      guess: g.guess,
      order: g.guessNumber,
      similarity: g.initialSimilarity,
      closeness: g.proximity.shouldShow && g.proximity.value,
      player: g.userName,
  }));
  const lastGuess = game.recentGuess.guessNumber;
  guesses.sort((a, b) => a.order - b.order);

  let max = 0;
  guesses.forEach(g => {
    const val = Number(g.similarity);
    if(val > max) { max = val }
    g.max = max;
  });

  return [guesses, lastGuess];
}