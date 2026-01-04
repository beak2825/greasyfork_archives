// ==UserScript==
// @name        LearnedLeague Utility
// @namespace   Violentmonkey Scripts
// @match       https://*.learnedleague.com/viewtopic.php*
// @match       https://*.learnedleague.com/question.php*
// @match       https://*.learnedleague.com/match.php*
// @match       https://*.learnedleague.com/mini/match.php*
// @match       https://*.learnedleague.com/oneday.php*
// @grant       none
// @version     1.5.2
// @author      BlumE
// @license     MIT
// @description Utility for learnedleague.com: load your answers inline with questions, link to questions from forum threads, copy OP forum post template, see your placement in One Days if you had different correct or moneyed
// @downloadURL https://update.greasyfork.org/scripts/446639/LearnedLeague%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/446639/LearnedLeague%20Utility.meta.js
// ==/UserScript==

let processFunction;
if (window.location.pathname === "/question.php") {
  processFunction = handleQuestionPage;
} else if (window.location.pathname === "/viewtopic.php") {
  processFunction = handleMessageBoardTopicPage;
} else if (window.location.pathname === "/match.php") {
  processFunction = handleMatchPage;
} else if (window.location.pathname === "/mini/match.php") {
  processFunction = handleMiniMatchPage;
} else if (window.location.pathname === "/oneday.php") {
  processFunction = handleOneDayPage;
} else {
  return;
}

// If page is still loading, queue function for when it is done
if (document.readyState !== "loading") {
  processFunction();
} else {
  document.addEventListener('DOMContentLoaded', processFunction);
}


function handleQuestionPage() {
  let answerDiv = document.querySelector('#xyz > span');
  if (!answerDiv) return;

  const statsDiv = document.querySelector('#main > div > div.indivqContent > div > div:nth-child(5) > div');
  if (!statsDiv) return;

  const [leagueNumber, matchDayNumber, questionNumber] = window.location.search.slice(1).split('&');
  if (!(leagueNumber && matchDayNumber && questionNumber)) return;

  if (document.getElementsByClassName('res_table').length > 0) {
    // Only add "Your Answer" section if page has the results box that indicates you participated
    appendYourAnswerDiv(statsDiv, leagueNumber, matchDayNumber, questionNumber);
  }
  appendCopyTemplateDiv(statsDiv, leagueNumber, matchDayNumber, questionNumber, answerDiv)
}

function handleMessageBoardTopicPage() {
  addLinkToQuestionPage();
}

/**
 * Adds a button to load your answers and includes them next to the correct answer
 * Handles the different kind of match pages
 */
function handleMatchPage() {
  const queryTerm = window.location.search.substring(1);
  if (queryTerm.startsWith('id=')){
    addLinkToLoadMatchAnswersSpecificMatch();
  } else if (queryTerm.indexOf('_Div_') !== -1) {
    addLinkToLoadMatchAnswersSpecificDivision();
  } else {
    addLinkToLoadMatchAnswers();
  }
}


/**
 * Adds a button to load your answers and includes them next to the correct answer
 * Handles the different kind of mini match pages
 */
function handleMiniMatchPage() {
  const queryTerm = window.location.search.substring(1);
  if (queryTerm.startsWith('id=')){
    addLinkToLoadMiniMatchAnswersSpecificMatch();
  } else {
    let [mini_league_name, match_day_number, group_number] =  queryTerm.split('&');
    if (group_number) {
      addLinkToLoadMiniMatchAnswersSpecificGroup();
    } else {
      addLinkToLoadMiniMatchAnswers();
    }
  }
}


/**
 * Adds a link on forum topics that include the proper LL question header.
 * e.g. LL83 MD9Q6 (KINGSTON) to the question page.
 */
function addLinkToQuestionPage() {
  const reLeagueNumber = /[Ll][Ll](\d+)/;
  const reMatchDayNumber = /[Mm][Dd](\d+)/;
  const reQuestionNumber = /[Qq](\d+)/;

  let postHeader = document.querySelector("#pageheader a");
  if (postHeader) {
    let postName = postHeader.innerHTML;
    let leagueNumber = reLeagueNumber.exec(postName);
    let matchDayNumber = reMatchDayNumber.exec(postName);
    let questionNumber = reQuestionNumber.exec(postName);

    if (leagueNumber && matchDayNumber && questionNumber) {
      let linkURL = `/question.php?${leagueNumber[1]}&${matchDayNumber[1]}&${questionNumber[1]}`
      let newLink = document.createElement('a');
      newLink.href = linkURL;
      newLink.title = "Link";
      newLink.text = " Link >>";
      newLink.style = "border-bottom: dotted 1px;color: #336666;"
      postHeader.parentElement.appendChild(newLink);
    }
  }
}

/**
 * Adds a button to load your answer for the given question
 */
function appendYourAnswerDiv(statsDiv, leagueNumber, matchDayNumber, questionNumber) {
  let answerHeader = document.createElement('h3');
  answerHeader.innerHTML = "<i>Your</i> Answer";
  let answerLinkDiv = document.createElement('div');
  answerLinkDiv.style = "margin-bottom:1.5em;margin-left:0.5em;";
  let answerToggle = document.createElement('a');
  answerToggle.id = "answerToggle";
  answerToggle.innerHTML = 'Click here to reveal';
  answerToggle.href = `javascript:RemoveContent('answerToggle');javascript:InsertContent('answerValue')`;
  answerToggle.onclick = function () {fillInMyAnswer(leagueNumber, matchDayNumber, questionNumber);};

  let answerValue = document.createElement('p');
  answerValue.id = "answerValue";
  answerValue.style = "display:none";
  answerValue.innerHTML = `<i>Loading...</i>`;

  answerLinkDiv.appendChild(answerToggle);
  answerLinkDiv.appendChild(answerValue);
  statsDiv.appendChild(answerHeader);
  statsDiv.appendChild(answerLinkDiv);
}

/**
 * Adds a button to copy a template for a question to your clipboard for use in a new
 * forum post including the post subject and a nicely formatted body with the question text
 * included.
 */
function appendCopyTemplateDiv(statsDiv, leagueNumber, matchDayNumber, questionNumber, answerDiv) {
  let answer = answerDiv.textContent.trim();
  let postSubject = `LL${leagueNumber} MD${matchDayNumber}Q${questionNumber} (${answer})`;
  let postBody = templateBody();
  let postContent = postSubject + "\\n" + postBody;
  let templateHeader = document.createElement('h3');
  templateHeader.innerHTML = "Forum Post Template";
  let templateCopyDiv = document.createElement('div');
  templateCopyDiv.style = "margin-bottom:1.5em;margin-left:0.5em;";
  let templateCopy = document.createElement('a');
  templateCopy.id = "subjectToggle";
  templateCopy.innerHTML = "Click here to copy template to clipboard";
  templateCopy.href = `javascript:navigator.clipboard.writeText("${postContent}")`;

  templateCopyDiv.appendChild(templateCopy);
  statsDiv.appendChild(templateHeader);
  statsDiv.appendChild(templateCopyDiv);
}

/**
 * Processes the body of the question to transform any special symbols or formatting to something the message board
 * system recognizes
 */
function templateBody() {
  let questionDiv = document.querySelector('.indivqQuestion');
  let answerDiv = document.querySelector('#xyz > span');
  let answer = answerDiv.textContent.trim();
  let postBody = `[quote="Question"]${questionDiv.innerHTML.trim()}[/quote] Answer: [spoiler]${answer}[/spoiler]`;

  let template = document.createElement('template');
  template.innerHTML = postBody;

  let content = [...template.content.childNodes].map(node => processNode(node)).join("");
  content = content.replace(/"/g, '\\\"');
  return content;
}

function processNode(node) {
  let val;
  if (node.hasChildNodes()) {
    val = [...node.childNodes].map(node => processNode(node)).join("");
  } else {
    val = node.textContent;
  }
  if (node.nodeType === node.TEXT_NODE) {
    return val
  } else {
    const equivalentElements = ['b', 'i', 'u'];
    if (equivalentElements.indexOf(node.localName) !== -1) {
      return `[${node.localName}]${val}[/${node.localName}]`;
    } else if (node.localName === 'em') {
      return `[i]${val}[/i]`;
    } else if (node.localName === 'a') {
      return `[url=${node.href}]${val}[/url]`;
    } else if (node.localName === 'br') {
      return '\\n'
    } else if (node.localName === 'sup') {
      const superscriptMap = new Map([['0', '⁰'], ['1', '¹'], ['2', '²'], ['3', '³'], ['4', '⁴'], ['5', '⁵'], ['6', '⁶'], ['7', '⁷'], ['8', '⁸'],
                                      ['9', '⁹'], ['+', '⁺'], ['-', '⁻'], ['=', '⁼'], ['(', '⁽'], [')', '⁾'], ['n', 'ⁿ'], ['i', 'ⁱ']]);
      if ([...val].every(char => superscriptMap.has(char))) {
        return [...val].map(char => superscriptMap.get(char)).join('');
      } else if (
        node.children.length === 1
        && equivalentElements.indexOf(node.firstChild.localName) !== -1
        && node.firstChild.children.length === 0
        && [...node.firstChild.textContent].every(char => superscriptMap.has(char))
      ) {
        // Handle edge case of <sup><i>123</i></sup>
        return `[${node.firstChild.localName}]${[...node.firstChild.textContent].map(char => superscriptMap.get(char)).join('')}[/${node.firstChild.localName}]`;
      } else {
        return "^" + val;
      }
    } else if (node.localName === 'sub') {
      const subscriptMap = new Map([['0', '₀'], ['1', '₁'], ['2', '₂'], ['3', '₃'], ['4', '₄'], ['5', '₅'], ['6', '₆'], ['7', '₇'], ['8', '₈'],
                                    ['9', '₉'], ['+', '₊'], ['-', '₋'], ['=', '₌'], ['(', '₍'], [')', '₎'], ['a', 'ₐ'], ['e', 'ₑ'], ['o', 'ₒ'],
                                    ['x', 'ₓ'], ['h', 'ₕ'], ['k', 'ₖ'], ['l', 'ₗ'], ['m', 'ₘ'], ['n', 'ₙ'], ['p', 'ₚ'], ['s', 'ₛ'], ['t', 'ₜ'], ['ə', 'ₔ']]);
      if ([...val].every(char => subscriptMap.has(char))) {
        return [...val].map(char => subscriptMap.get(char)).join('');
      } else if (
        node.children.length === 1
        && equivalentElements.indexOf(node.firstChild.localName) !== -1
        && node.firstChild.children.length === 0
        && [...node.firstChild.textContent].every(char => superscriptMap.has(char))
      ) {
        // Handle edge case of <sub><i>123</i></sub>
        return `[${node.firstChild.localName}]${[...node.firstChild.textContent].map(char => subscriptMap.get(char)).join('')}[/${node.firstChild.localName}]`;
      } else {
        return "_" + val + "_";
      }
    } else {
      console.log('unknown node ', node);
      return val;
    }
  }
}

function fillInMyAnswer(seasonNumber, matchDayNumber, questionNumber) {
  queryPastAnswers(seasonNumber, matchDayNumber).then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");
    // Hopefully this remains consistent
    const answerQuery = `table.qtable > tbody > tr:nth-child(${parseInt(questionNumber) + 1}) > td:nth-child(3)`;
    const answerNode = doc.querySelector(answerQuery);
    let answerValue = document.getElementById('answerValue');
    if (!answerNode) {
      answerValue.innerHTML = 'Failed to retrieve';
    } else {
      answerValue.innerHTML = answerNode.innerHTML;

    }
  }).catch(function (err) {
    let answerValue = document.getElementById('answerValue');
    answerValue.innerHTML = 'Failed to retrieve ' + err;
  })
}

function queryPastAnswers(leagueNumber, matchDayNumber) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", onload);
    req.open("POST", "/thorsten/pastanswers.php");
    req.onload = function () {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      } else {
        reject({
          status: req.status,
          statusText: req.statusText
        });
      }
    };
    req.onerror = function () {
      reject({
        status: req.status,
        statusText: req.statusText
      });
    };
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    req.send(`season=${leagueNumber}&matchday=${matchDayNumber}`);
  })
}

function addLinkToLoadMatchAnswersSpecificMatch() {
  let parentDiv = document.querySelector('.QTable').parentElement
  let answerLinkDiv = document.createElement('div');
  answerLinkDiv.style = "margin-bottom:1.0em";
  let answerToggle = document.createElement('a');
  answerToggle.id = "answerToggle";
  answerToggle.innerHTML = 'Click here to reveal your answers';
  answerToggle.href = `javascript:RemoveContent('answerToggle')`;

  const questionLink = new URL(document.querySelector('.ind-Numb2 a').href);
  const [leagueNumber, matchDayNumber, questionNumber] = questionLink.search.slice(1).split('&');

  answerToggle.onclick = function () {fillInMyMatchAnswersSpecificMatch(leagueNumber, matchDayNumber);};

  let answerLoadingProgress = document.createElement('p');
  answerLoadingProgress.id = "answerLoadingProgress";
  answerLoadingProgress.hidden = true;
  answerLoadingProgress.innerHTML = `<i>Loading...</i>`;

  answerLinkDiv.appendChild(answerToggle);
  answerLinkDiv.appendChild(answerLoadingProgress);
  parentDiv.prepend(answerLinkDiv);
}

function fillInMyMatchAnswersSpecificMatch(leagueNumber, matchDayNumber) {
  const answerLoadingProgress = document.querySelector('#answerLoadingProgress')
  answerLoadingProgress.hidden = false;
  queryPastAnswers(leagueNumber, matchDayNumber).then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");
    const answerTable = doc.querySelector(`table.qtable`);
    if (!answerTable) {
      answerLoadingProgress.innerHTML = '<i>Failed to retrieve</i>';
    } else {
      let matchTable = document.querySelector(`table.QTable`);
      // Fill in your answers next to actual answers
      for (let i = 1; i <= 6; i++) {
        let yourAnswer = answerTable.rows[i].cells[2].innerHTML;
        let resultImgSrc = answerTable.rows[i].cells[3].firstChild.src;
        matchTable.rows[i].cells[1].innerHTML += `<div><i>${yourAnswer}</i> <img src="${resultImgSrc}" style="height: 12px"></img></div>`;
      }
      answerLoadingProgress.hidden = true;
    }
  }).catch(function (err) {
    console.log(err);
  })
}

function addLinkToLoadMatchAnswersSpecificDivision() {
  let parentDiv = document.querySelector('.qacontainer').parentElement
  let answerLinkDiv = document.createElement('div');
  answerLinkDiv.style = "margin-bottom:1.0em";
  let answerToggle = document.createElement('a');
  answerToggle.id = "answerToggle";
  answerToggle.innerHTML = 'Click here to reveal your answers';
  answerToggle.href = `javascript:RemoveContent('answerToggle')`;

  const questionLink = new URL(document.querySelector('.qaqnumber a').href);
  const [leagueNumber, matchDayNumber, questionNumber] = questionLink.search.slice(1).split('&');

  answerToggle.onclick = function () {fillInMyMatchAnswersSpecificDivision(leagueNumber, matchDayNumber);};

  let answerLoadingProgress = document.createElement('p');
  answerLoadingProgress.id = "answerLoadingProgress";
  answerLoadingProgress.hidden = true;
  answerLoadingProgress.innerHTML = `<i>Loading...</i>`;

  answerLinkDiv.appendChild(answerToggle);
  answerLinkDiv.appendChild(answerLoadingProgress);
  parentDiv.insertBefore(answerLinkDiv, document.querySelector('#lft > div:nth-child(3)'));
}

function fillInMyMatchAnswersSpecificDivision(leagueNumber, matchDayNumber) {
  const answerLoadingProgress = document.querySelector('#answerLoadingProgress')
  answerLoadingProgress.hidden = false;
  queryPastAnswers(leagueNumber, matchDayNumber).then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");
    const answerTable = doc.querySelector(`table.qtable`);
    const answerDivs = document.querySelector(`#lft > div:nth-child(5)`);
    if (!answerTable) {
      answerLoadingProgress.innerHTML = '<i>Failed to retrieve</i>';
    } else {
      // Fill in your answers next to actual answers
      for (let i = 1; i <= 6; i++) {
        let yourAnswer = answerTable.rows[i].cells[2].innerHTML;
        let resultImgSrc = answerTable.rows[i].cells[3].firstChild.src;
        answerDivs.children[i-1].innerHTML += `<div><i>${yourAnswer}</i> <img src="${resultImgSrc}" style="height: 12px"></img></div>`;
      }
      answerLoadingProgress.hidden = true;
    }
  }).catch(function (err) {
    console.log(err);
  })
}


function addLinkToLoadMatchAnswers() {
  let parentDiv = document.querySelector('#lft > div.yellolbl').parentElement
  let answerLinkDiv = document.createElement('div');
  answerLinkDiv.style = "margin-bottom:1.0em";
  let answerToggle = document.createElement('a');
  answerToggle.id = "answerToggle";
  answerToggle.innerHTML = 'Click here to include your answers';
  answerToggle.href = `javascript:RemoveContent('answerToggle')`;

  const questionLink = new URL(document.querySelector('#lft > div.ind-boxATbl > div:nth-child(1) > span > a').href);
  const [leagueNumber, matchDayNumber, questionNumber] = questionLink.search.slice(1).split('&');

  answerToggle.onclick = function () {fillInMyMatchAnswers(leagueNumber, matchDayNumber);};

  let answerLoadingProgress = document.createElement('p');
  answerLoadingProgress.id = "answerLoadingProgress";
  answerLoadingProgress.hidden = true;
  answerLoadingProgress.innerHTML = `<i>Loading...</i>`;

  answerLinkDiv.appendChild(answerToggle);
  answerLinkDiv.appendChild(answerLoadingProgress);
  parentDiv.insertBefore(answerLinkDiv, document.querySelector('#lft > div.yellolbl'));
}

function fillInMyMatchAnswers(leagueNumber, matchDayNumber) {
  const answerLoadingProgress = document.querySelector('#answerLoadingProgress')
  answerLoadingProgress.hidden = false;
  queryPastAnswers(leagueNumber, matchDayNumber).then(function (response) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");
    const answerTable = doc.querySelector(`table.qtable`);
    const answerDivs = document.querySelectorAll('.indivqAnswerwrapper');
    if (!answerTable) {
      answerLoadingProgress.innerHTML = '<i>Failed to retrieve</i>';
    } else {
      let matchTable = document.querySelector(`table.QTable`);
      // Fill in your answers next to actual answers
      for (let i = 1; i <= 6; i++) {
        let yourAnswer = answerTable.rows[i].cells[2].innerHTML;
        let resultImgSrc = answerTable.rows[i].cells[3].firstChild.src;
        answerDivs[i-1].children[1].innerHTML += `<div style="color: #293A55; font-weight: 400"><i>${yourAnswer}</i> <img src="${resultImgSrc}" style="height: 12px"></img></div>`;
      }
      answerLoadingProgress.hidden = true;
    }
  }).catch(function (err) {
    console.log(err);
  })
}


function addLinkToLoadMiniMatchAnswersSpecificMatch() {
  addLinkToLoadMatchAnswersSpecificMatch();
}

function addLinkToLoadMiniMatchAnswersSpecificGroup() {
  addLinkToLoadMatchAnswersSpecificDivision();
}

function addLinkToLoadMiniMatchAnswers() {
  addLinkToLoadMatchAnswers();
}

function queryOneDay(oneDayId) {
  return new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", onload);
    req.open("POST", `/oneday/results.php?${oneDayId}&12`);
    req.onload = function () {
      if (req.status >= 200 && req.status < 300) {
        resolve(req.response);
      } else {
        reject({
          status: req.status,
          statusText: req.statusText
        });
      }
    };
    req.onerror = function () {
      reject({
        status: req.status,
        statusText: req.statusText
      });
    };
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    req.send();
  })
}

function bisect(arr, value) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (typeof(arr[mid]) == 'undefined' || arr[mid] <= value) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function makeElement(elementType, className, innerHTML, colspan) {
  element = document.createElement(elementType);
  if (className) {
    element.className = className;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (colspan) {
    element.setAttribute("colspan", colspan);
  }

  return element
}

function createTheorycraftForm(oneDayId) {
  let existingDiv = document.getElementById('theorycraftDiv');
  if (existingDiv) {
    // Toggle display of theorycraft div
    existingDiv.style.display = existingDiv.style.display === 'none' ? '' : 'none';
    return
  }
  queryOneDay(oneDayId).then(function (response) {
    const questionCount = 12;
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, "text/html");
    const table = doc.querySelector('.tbl_q > tbody')

    const correctPct = Array(questionCount);
    const incorrectPct = Array(questionCount);
    const moneyPct = Array(questionCount);


    let row;
    for (let i = 0; i < questionCount; i++) {
      row = table.children[i+1].children;
      correctPct[i] = Number(row[1].textContent);
      incorrectPct[i] = 100 - correctPct[i];
      moneyPct[i] = Number(row[2].textContent);
    }


    const maxScore = incorrectPct.toSorted().slice(questionCount - 5, questionCount).reduce((a,b) => a+b) + 15*questionCount;

    const percentiles = doc.querySelectorAll('.pctile > tbody > tr');
    const percentileValues = Array(99);
    let percentile, points;
    for (let i = 0; i < percentiles.length; i++) {
      if (!percentiles[i].children.length) continue;
      percentile = Number(percentiles[i].children[0].textContent);
      if (!percentile) continue;
      points = Number(percentiles[i].children[1].textContent);
      percentileValues[percentile-1] = points;
    }
    const cleanPercentileValues = percentileValues.filter(x => typeof x !== 'undefined');

    function updateTheoryCraftForm(e) {
      let questionCorrect, questionMoneyed, questionValue, score;
      let totalScore = 0;
      let numberCorrect = 0;
      for (let i = 0; i < questionCount; i++) {
        questionCorrect = document.getElementById(`q${i+1}c`).checked;
        questionMoneyed = document.getElementById(`q${i+1}m`).checked;

        questionValue = document.getElementById(`q${i+1}v`);
        score = questionCorrect * (15 + questionMoneyed * incorrectPct[i]);
        questionValue.innerHTML = questionCorrect * (15 + questionMoneyed * incorrectPct[i]);
        if (questionCorrect && questionMoneyed) questionValue.className = 'omg u bb';
        else if (questionCorrect) questionValue.className = 'omg bb';
        else if (questionMoneyed) questionValue.className = 'omr bb';
        else questionValue.className = 'om bb';
        totalScore += score;
        numberCorrect += questionCorrect;
      }
      document.getElementById(`tcPoints`).innerHTML = totalScore;
      document.getElementById(`tcNumberCorrect`).innerHTML = numberCorrect;
      let calculatedPercentile = percentileValues.indexOf(cleanPercentileValues[bisect(cleanPercentileValues, totalScore)-1]) + 1;
      document.getElementById(`tcPercentile`).innerHTML = calculatedPercentile;
    }

    let theorycraftDiv = document.createElement('div');
    theorycraftDiv.id = 'theorycraftDiv';
    theorycraftDiv.classList.add('pctile_container');
    theorycraftDiv.innerHTML = `<h2>Theorycrafting</h2>`
    let innerDiv = document.createElement('div');
    innerDiv.style = "overflow-x:auto;";
    theorycraftDiv.appendChild(innerDiv);
    theorycraftDiv.appendChild(document.createElement('br'));

    let theorycraftTable = document.createElement('table');
    theorycraftTable.id = "theorycraft";
    theorycraftTable.className = 'std';
    theorycraftTable.style = "width:98%";

    let thead = document.createElement('thead');
    let tr1 = document.createElement('tr');
    tr1.bgcolor = "#f6f7f2";
    tr1.innerHTML = `\
      <td class="std-head-mid">&nbsp;</td>
      <td class="std-head-mid">&nbsp;</td>
      <td class="std-head-mid">1</td>
      <td class="std-head-mid">2</td>
      <td class="std-head-mid">3</td>
      <td class="std-head-mid">4</td>
      <td class="std-head-mid">5</td>
      <td class="std-head-mid">6</td>
      <td class="std-head-mid">7</td>
      <td class="std-head-mid">8</td>
      <td class="std-head-mid">9</td>
      <td class="std-head-mid">10</td>
      <td class="std-head-mid">11</td>
      <td class="std-head-mid">12</td>
      <td class="std-head-mid" style="border-left:1px solid lavender;">#c</td>
      <td class="std-head-mid">Points</td>
      <td class="std-head-mid">%ile</td>`
    thead.appendChild(tr1);

    let tr2 = document.createElement('tr');
    tr2.bgcolor = "#ffffff";
    tr2.innerHTML = `\
      <td class="std-head-mid" colspan="2">% incorrect:</td>
      <td class="std-head-mid">${incorrectPct[0]}</td>
      <td class="std-head-mid">${incorrectPct[1]}</td>
      <td class="std-head-mid">${incorrectPct[2]}</td>
      <td class="std-head-mid">${incorrectPct[3]}</td>
      <td class="std-head-mid">${incorrectPct[4]}</td>
      <td class="std-head-mid">${incorrectPct[5]}</td>
      <td class="std-head-mid">${incorrectPct[6]}</td>
      <td class="std-head-mid">${incorrectPct[7]}</td>
      <td class="std-head-mid">${incorrectPct[8]}</td>
      <td class="std-head-mid">${incorrectPct[9]}</td>
      <td class="std-head-mid">${incorrectPct[10]}</td>
      <td class="std-head-mid">${incorrectPct[11]}</td>
      <td class="std-head-mid">&nbsp;</td>
      <td colspan="2" class="std-head-mid" style="font-size:0.85em;font-family:" lato',="" sans-serif;="" '=""><i>${maxScore} (max)</i></td>
      <td class="std-head-mid">&nbsp;</td>`
    thead.appendChild(tr2);

    let tr3 = document.createElement('tr');
    tr3.bgcolor = "#ffffff";
    let correctHeader = makeElement('td', 'std-head-mid omg', 'correct', '2');
    correctHeader.addEventListener('click', e => {[...document.getElementsByClassName('correctCheckbox')].forEach(x => x.checked = !x.checked); updateTheoryCraftForm(e)});
    tr3.appendChild(correctHeader);

    let correctCheckbox, correctCheckboxContainer;
    for (let i = 0; i < questionCount; i++) {
      correctCheckboxContainer = document.createElement('td');
      correctCheckboxContainer.className = "std-head-mid";
      correctCheckbox = document.createElement('input');
      correctCheckbox.id = `q${i+1}c`;
      correctCheckbox.classList.add('correctCheckbox');
      correctCheckbox.type = 'checkbox';
      correctCheckbox.style = 'appearance:auto;opacity:1;height:17px;width:17px;'
      correctCheckbox.addEventListener('input', updateTheoryCraftForm);
      correctCheckboxContainer.appendChild(correctCheckbox);

      tr3.appendChild(correctCheckboxContainer);
    }
    tr3.appendChild(makeElement('td', 'std-head-mid omg', '&nbsp;'));
    tr3.appendChild(makeElement('td', 'std-head-mid omg', undefined, "2"));
    tr3.appendChild(makeElement('td', 'std-head-mid omg', '&nbsp;'));
    thead.appendChild(tr3);


    let tr4 = document.createElement('tr');
    tr4.bgcolor = "#ffffff";
    let moneyedHeader = makeElement('td', 'std-head-mid u', 'moneyed', '2');
    moneyedHeader.addEventListener('click', e => {[...document.getElementsByClassName('moneyCheckbox')].forEach(x => x.checked = !x.checked); updateTheoryCraftForm(e)});
    tr4.appendChild(moneyedHeader);

    let moneyCheckbox, moneyCheckboxContainer;
    for (let i = 0; i < questionCount; i++) {
      moneyCheckboxContainer = document.createElement('td');
      moneyCheckboxContainer.className = "std-head-mid";
      moneyCheckbox = document.createElement('input');
      moneyCheckbox.id = `q${i+1}m`;
      moneyCheckbox.classList.add('moneyCheckbox');
      moneyCheckbox.type = 'checkbox';
      moneyCheckbox.style = 'appearance:auto;opacity:1;height:17px;width:17px;';
      moneyCheckbox.addEventListener('input', updateTheoryCraftForm);
      moneyCheckboxContainer.appendChild(moneyCheckbox);
      tr4.appendChild(moneyCheckboxContainer);
    }
    tr4.appendChild(makeElement('td', 'std-head-mid omg', '&nbsp;'));
    tr4.appendChild(makeElement('td', 'std-head-mid omg', undefined, "2"));
    tr4.appendChild(makeElement('td', 'std-head-mid omg', '&nbsp;'));
    thead.appendChild(tr4);

    let tbody = document.createElement('tbody');
    tbody.innerHTML = `
    <tr style="" class="">
      <td class="std-midleft" style="width:40px;padding-top:6px;border-bottom:1px solid lavender "></td>
      <td class="std-midleft" style="width:100px;padding-top:6px;border-bottom:1px solid lavender "></td>
      <td id="q1v" class="om bb">0</td>
      <td id="q2v" class="om bb">0</td>
      <td id="q3v" class="om bb">0</td>
      <td id="q4v" class="om bb">0</td>
      <td id="q5v" class="om bb">0</td>
      <td id="q6v" class="om bb">0</td>
      <td id="q7v" class="om bb">0</td>
      <td id="q8v" class="om bb">0</td>
      <td id="q9v" class="om bb">0</td>
      <td id="q10v" class="om bb">0</td>
      <td id="q11v" class="om bb">0</td>
      <td id="q12v" class="om bb">0</td>
      <td id="tcNumberCorrect" class="oc">0</td>
      <td id="tcPoints" class="ot">0</td>
      <td id="tcPercentile" class="ot">1</td>
    </tr>`;
    theorycraftTable.appendChild(thead);
    theorycraftTable.appendChild(tbody);
    innerDiv.appendChild(theorycraftTable);
    const container = document.getElementById('profilesdivcontainer');
    container.insertBefore(theorycraftDiv, container.firstChild);

    // If we have our results here, prefill the theorycraft form with our results
    let resultsH2 = document.evaluate("//h2[contains(., ' Results')]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
    if (resultsH2) {
      // there's probably a better way to accomplish this
      let yourAnswers = [...resultsH2.parentElement.children[1].children[0].children[1].children[0].children].slice(2, questionCount+2)
      for (let i = 0; i < questionCount; i++) {
        if (yourAnswers[i].classList.contains('omg')) {
          document.getElementById(`q${i+1}c`).checked = true;
        }
        if (yourAnswers[i].classList.contains('omr') || yourAnswers[i].classList.contains('u')) {
          document.getElementById(`q${i+1}m`).checked = true;
        }
      }
      updateTheoryCraftForm();
    }
  }).catch(function (err) {
    console.log(err);
  })
}

function handleOneDayPage() {
  let profilesTabs = document.getElementById('profilestabs');
  let theoryButtonContainer = document.createElement('li');
  let theoryButton = document.createElement('a');
  theoryButton.textContent = 'tc';
  theoryButton.id = 'theorycraftButton';
  const oneDayId = document.location.search.slice(1);
  theoryButton.onclick = function () {createTheorycraftForm(oneDayId);};

  theoryButtonContainer.appendChild(theoryButton);
  profilesTabs.appendChild(theoryButtonContainer);
}
