// ==UserScript==
// @name         Youtube Comment Analysis
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  API, NLP, Word Cloud, AFINN Sentiment, Gender, Timeline, Growth, LLM etc WIP
// @author       Your Name
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3-cloud/1.2.7/d3.layout.cloud.min.js
// @resource     stopwords https://raw.githubusercontent.com/stopwords-iso/stopwords-iso/master/stopwords-iso.json
// @resource     afinn https://gist.githubusercontent.com/thorn-cell/f46c2937b758385daca19bb1a078fa81/raw/169501526bc1c9dd1c76dda6e659c2e1bb19d010/gistfile1.txt
// @connect      googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/500626/Youtube%20Comment%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/500626/Youtube%20Comment%20Analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //const API_KEY = 'AIzaSyAmXbP9ojtSfOqiEcbyl7Sbp_pn4nIP2pA';
    const API_KEY = 'AIzaSyBPdAZENonapCKJ37XScR80aXfpJwWABnA';
    //JwWABnA work
    let lastUrl = location.href;
    let totalComments = 0;
    let fetchedComments = 0;
    let comments = null;
    const genderWords = { 'she': 'f', 'her': 'f', 'hers': 'f', 'herself': 'f', 'woman': 'f', 'women': 'f', 'girl': 'f', 'girls': 'f',
                         'mother': 'f', 'mothers': 'f', 'mom': 'f', 'moms': 'f', 'mum': 'f', 'mums': 'f', 'female': 'f', 'females': 'f',
                         'wife': 'f', 'wives': 'f', 'daughter': 'f', 'daughters': 'f', 'girlfriend': 'f', 'girlfriends': 'f',
                         'sister': 'f', 'sisters': 'f', 'lady': 'f', 'ladies': 'f', 'he': 'm', 'him': 'm', 'his': 'm', 'himself': 'm',
                         'man': 'm', 'men': 'm', 'boy': 'm', 'boys': 'm', 'dude': 'm', 'dudes': 'm', 'father': 'm', 'fathers': 'm',
                         'dad': 'm', 'dads': 'm', 'daddy': 'm', 'daddies': 'm', 'male': 'm', 'males': 'm', 'husband': 'm',
                         'husbands': 'm', 'hubby': 'm', 'son': 'm', 'sons': 'm', 'brother': 'm', 'brothers': 'm', 'gentleman': 'm',
                         'gentlemen': 'm', 'guy': 'm', 'guys': 'm', 'boyfriend': 'm', 'boyfriends': 'm', 'king': 'm' };

   function getVideoId() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('v');
   }

async function fetchVideoDetails(videoId) {
   const url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoId}&part=snippet,statistics`;
   return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
         method: 'GET',
         url: url,
         onload: function(response) {
            if (response.status === 200) {
               const data = JSON.parse(response.responseText);
               if (data.items.length > 0) {
                  resolve({
                     statistics: data.items[0].statistics,
                     title: data.items[0].snippet.title
                  });
               } else {
                  reject('Video not found');
               }
            } else {
               reject('Failed to fetch video details');
            }
         },
         onerror: function() {
            reject('Network error');
         }
      });
   });
}

   async function fetchComments(videoId, pageToken = '') {
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&part=snippet,replies&maxResults=100&pageToken=${pageToken}`;
      return new Promise((resolve, reject) => {
         GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
               if (response.status === 200) {
                  resolve(JSON.parse(response.responseText));
               } else {
                  reject('Failed to fetch comments');
               }
            },
            onerror: function() {
               reject('Network error');
            }
         });
      });
   }

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '')
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/"/g, '')
        .replace(/'/g, '');
}

async function loadAllComments(videoId) {
   try {
      const videoDetails = await fetchVideoDetails(videoId);
      totalComments = videoDetails.statistics.commentCount || 0;
      let comments = [];
      let pageToken = '';
      while (true) {
         const response = await fetchComments(videoId, pageToken);
         const items = response.items || [];
         items.forEach(item => {
            const topLevelComment = item.snippet.topLevelComment.snippet;
            comments.push({
               text: escapeHtml(topLevelComment.textOriginal),
               date: topLevelComment.publishedAt,
               likes: topLevelComment.likeCount
            });
            if (item.replies && item.replies.comments) {
               item.replies.comments.forEach(reply => {
                  comments.push({
                     text: escapeHtml(reply.snippet.textOriginal),
                     date: reply.snippet.publishedAt,
                     likes: reply.snippet.likeCount
                  });
               });
            }
         });
         fetchedComments += items.length + items.reduce((count, item) => count + (item.replies ? item.replies.comments.length : 0), 0);
         updateProgress();
         pageToken = response.nextPageToken;
         if (!pageToken) {
            break;
         }
      }
      return { comments, title: videoDetails.title };
   } catch (error) {
      console.error('Error fetching comments:', error);
      return { comments: [], title: 'Unknown' };
   }
}

function addAIAnalysisButton(videoTitle) {
    let aiButton = document.createElement('button');
    aiButton.textContent = 'Query LLM?';
    aiButton.id = 'ai-analysis-button';
    aiButton.style.cssText = `
        margin: 5px auto;
        display: block;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 500;
        font-family: Roboto, Arial, sans-serif;
        color: #fff;
        background-color: #ffffff25;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        position: relative;
  `;
   let aicolorLine = document.createElement('div');
    aicolorLine.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 80%;
        margin-left: 10%;
        height: 1px;
        background: #f7b167;
   `;
    aiButton.appendChild(aicolorLine);
    aiButton.onmouseover = function() {
        aiButton.style.backgroundColor = '#ffffff50';
    };
    aiButton.onmouseout = function() {
        aiButton.style.backgroundColor = '#ffffff25';
    };
    aiButton.onclick = () => performAIAnalysis(videoTitle);

    let timecontainer = document.querySelector('#comment-timeline');
    if (timecontainer) {
        timecontainer.parentElement.insertBefore(aiButton, timecontainer.nextSibling);
    }
}

async function performAIAnalysis(videoTitle) {
    if (!comments) {
        console.error("Comments not loaded yet");
        return;
    }
    let topLikedComments = getTopLikedComments(comments);
    let sentimentAnalysis = await analyzeSentimentWithLLM(topLikedComments, videoTitle);
    displaySentimentAnalysis(sentimentAnalysis);
}

function getTopLikedComments(comments, n = 25) {
   return comments.sort((a, b) => b.likes - a.likes).slice(0, n);
}

async function analyzeSentimentWithLLM(comments, videoTitle) {
    const GOOGLE_API_KEY = 'AIzaSyA7WruojHp97I0geCazy8wQjFG-5obBEsw';
    const commentTexts = comments.map(c => c.text).join('\n\n');
    console.log("topliked:", commentTexts);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Provide a two-sentence analysis of the comments on this video titled "${videoTitle}", detailing all emotions, sentiments, attitudes, and ideas. heres the comments: "${commentTexts}."`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 256
                }
            })
        });

        const data = await response.json();

        // Check if the response contains an error
        if (data.error) {
            console.error('Error analyzing sentiment with Gemini:', data.error);
            return 'Error analyzing sentiment';
        }

        // Gemini's response structure
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error analyzing sentiment with Gemini:', error);
        return 'Error analyzing sentiment';
    }
}

function displaySentimentAnalysis(analysis) {
   let analysisDiv = document.createElement('div');
   analysisDiv.id = 'sentiment-analysis';
   analysisDiv.style.cssText = `
      margin: 10px auto;
      padding: 0px;
      background-color: #00000000;
      color: #f7b167;
      max-width: 800px;
      z-index: 9999;
   `;
   analysisDiv.innerHTML = `<p style="text-align: center; font-size: 16px;">${analysis}</p>`;
   let checkaibutton = document.querySelector('#ai-analysis-button');
   if (checkaibutton) {
      checkaibutton.parentElement.insertBefore(analysisDiv, checkaibutton.nextSibling);
   }
}

   function updateProgress() {
      let progressElement = document.querySelector('#progress-div');
      if (progressElement) {
         const progress = (fetchedComments / totalComments) * 100;
         const cappedProgress = Math.min(Math.round(progress), 100);
         progressElement.textContent = `${cappedProgress}% (${fetchedComments} / ${totalComments})`;
      }
   }

   function countWords(comments, stopwords) {
      let wordCount = {};
      comments.forEach(comment => {
         let words = comment.text.toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopwords.includes(word));
         words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
         });
      });
      return wordCount;
   }

   function getTopWords(wordCount, topN) {
      return Object.entries(wordCount)
         .sort(([, a], [, b]) => b - a)
         .slice(0, topN)
         .map(([word, count]) => ({
            word,
            count
         }));
   }

   function getTopAfinnWords(wordCount, afinn, topN) {
      let afinnWords = {};
      for (let word in wordCount) {
         if (afinn[word] !== undefined) {
            afinnWords[word] = wordCount[word];
         }
      }
      return Object.entries(afinnWords)
         .sort(([, a], [, b]) => b - a)
         .slice(0, topN)
         .map(([word, count]) => ({
            word,
            count,
            score: afinn[word]
         }));
   }

   function displayTopWords(topWords, topAfinnWords, sentimentScores, afinn) {
      const {
         positive,
         negative
      } = sentimentScores;
      const emoji = (positive + negative) > 0 ? '😊' : (positive + negative) < 0 ? '😞' : '😐';
      const sentimentColor = (positive + negative) > 0 ? '#559900' : (positive + negative) < 0 ? '#cc0000' : 'white';
      const genderWordsSet = new Set(Object.keys(genderWords));
      let resultDiv = document.createElement('div');
      resultDiv.id = 'result-div';
      resultDiv.style.cssText = `
        color: white;
        background-color: #00000000;
        border: 1px solid #00000000;
        padding: 0px;
        margin-top: 5px;
        z-index: 9999;
     `;
      const topWordsList = topWords.slice(0, 15).map(({
         word,
         count
      }) => {
         const isInAfinn = afinn[word.toLowerCase()] !== undefined;
         const gender = genderWords[word.toLowerCase()];
         let color = 'white'; // default color
         if (isInAfinn) {
            const score = afinn[word.toLowerCase()];
            color = score > 0 ? '#559900' : '#cc0000';
            return `<div style="display: inline-block; margin-right: 10px; color: ${color};">${word}: ${count} (${score})</div>`;
         } else if (gender) {
            color = gender === 'f' ? '#ff66cc' : '#3399ff';
         }
         return `<div style="display: inline-block; margin-right: 10px; color: ${color};">${word}: ${count}</div>`;
      }).join('');
      resultDiv.innerHTML = `
        <div style="text-align: center; white-space: nowrap;">
        <h4 style="display: inline-block; margin-right: 10px;">Top 15 Words:</h4>
        ${topWordsList}
        </div>
        <h3 style="text-align: center; margin-top: 5px; white-space: nowrap;">
        <span style="color: white;">Sentiment Scores:</span>
        <span style="color: #559900;">${positive}</span>
        <span style="color: white;"> / </span>
        <span style="color: #cc0000;">${negative}</span>
        </h3>`;
      // <h4>Top 15 AFINN Words:</h4>
      // <ul style="list-style-type: none; padding-left: 0;">
      // ${topAfinnWords.map(({ word, count, score }) => `<li style="color: ${score > 0 ? 'green' : 'red'};">${word}: ${count} (${score})</li>`).slice(0, 15).join('')}
      // </ul>
      // Insert the result div right below the start button
      //let progdiv = document.querySelector('#progress-div');
      //if (progdiv) {
      //   progdiv.parentElement.insertBefore(resultDiv, progdiv.nextSibling);
      //}
      let cloudDiv = document.querySelector('#word-cloud-container');
      if (cloudDiv) {
         cloudDiv.parentElement.insertBefore(resultDiv, cloudDiv.nextSibling);
      }
      // Append the emoji next to the comment count and button
      let countElement = document.querySelector('#count .count-text');
      if (countElement && !countElement.querySelector('.emoji')) {
         let emojiSpan = document.createElement('span');
         emojiSpan.className = 'emoji';
         emojiSpan.textContent = ` ${emoji}`;
         //countElement.appendChild(emojiSpan);
      }
   }

   function createWordCloud(wordCount) {
      let wordArray = Object.entries(wordCount)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 1000)
         .map(([word, count]) => ({
            text: word,
            size: count
         }));
      let container = document.createElement('div');
      container.id = 'word-cloud-container';
      container.style.cssText = `
        margin-top: 10px;
        z-index: 9999;
        width: 100%;
        height: 200px;
        background-color: #00000000;
        position: relative;
     `;
      let progdiv = document.querySelector('#progress-div');
      if (progdiv) {
          progdiv.parentElement.insertBefore(container, progdiv.nextSibling);
      }
      const width = container.clientWidth;
      const height = 200;
      const maxCount = Math.max(...wordArray.map(word => word.size));
      const maxFontSize = 80;
      const afinnJSON = GM_getResourceText('afinn');
      const afinn = JSON.parse(afinnJSON);
      const layout = d3.layout.cloud()
         .size([width, height])
         .words(wordArray)
         .padding(5)
         .rotate(() => 0)
         .fontSize(d => {
            const fontSize = d.size === maxCount ? maxFontSize : Math.round((d.size / maxCount) * maxFontSize);
            return fontSize;
         })
         .on('end', draw);
      layout.start();

      function draw(words) {
         const svg = d3.select(container).append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background-color', '#00000000');
         svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`)
            .selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', d => {
               if (genderWords[d.text.toLowerCase()]) {
                  return genderWords[d.text.toLowerCase()] === 'f' ? '#ff66cc' : '#3399ff';
               }
               if (afinn[d.text]) {
                  return afinn[d.text] > 0 ? '#559900' : '#cc0000';
               }
               return 'white';
            })
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
      }
   }

function createCommentTimeline(comments, graphgrowth = false) {
   if (!comments.length) {
      console.error("No comments available to plot.");
      return;
   }

   let dates = comments.map(comment => new Date(comment.date));
   let minDate = new Date(Math.min(...dates));
   let maxDate = new Date(Math.max(...dates));
   let timeDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
   let useMinutely = timeDiff < 1;

   function roundDate(date) {
      if (useMinutely) {
         return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
      } else {
         return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      }
   }

   function dateToKey(date) {
      if (useMinutely) {
         return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
      } else {
         return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      }
   }

   function keyToDate(key) {
      let [year, month, day, hour, minute] = key.split('-').map(Number);
      return new Date(year, month, day, hour, minute || 0);
   }

   let dateCounts = comments.reduce((counts, comment) => {
      let date = roundDate(new Date(comment.date));
      let key = dateToKey(date);
      counts[key] = (counts[key] || 0) + 1;
      return counts;
   }, {});
   let currentDate = roundDate(minDate);
   let roundedMaxDate = roundDate(maxDate);
   let cumulativeSum = 0;
   let normalData = [];
   let growthData = [];
   while (currentDate <= roundedMaxDate) {
      let key = dateToKey(currentDate);
      let count = dateCounts[key] || 0;
      cumulativeSum += count;
      normalData.push({
         date: keyToDate(key),
         count: count
      });
      growthData.push({
         date: keyToDate(key),
         count: cumulativeSum
      });
      if (useMinutely) {
         currentDate.setMinutes(currentDate.getMinutes() + 1);
      } else {
         currentDate.setHours(currentDate.getHours() + 1);
      }
   }
   normalData.sort((a, b) => a.date - b.date);
   growthData.sort((a, b) => a.date - b.date);
   console.log("Timeline Data:", normalData);
   console.log("Growth Data:", growthData);

   let containertime = document.createElement('div');
   containertime.id = 'comment-timeline';
   containertime.style.cssText = `
      position: relative;
      width: 100%;
      height: 250px;
      background-color: transparent;
      z-index: 9999;
   `;
   let progdiv = document.querySelector('#progress-div');
   if (progdiv) {
      progdiv.parentElement.insertBefore(containertime, progdiv.nextSibling);
   }
   let svg = d3.select('#comment-timeline').append('svg')
      .attr('width', '100%')
      .attr('height', '100%');
   let margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 40
   };
   let width = parseInt(svg.style('width')) - margin.left - margin.right;
   let height = parseInt(svg.style('height')) - margin.top - margin.bottom;

   // Define scales
   let x = d3.scaleTime().domain(d3.extent(normalData, d => d.date)).range([0, width]);
   let yNormal = d3.scaleLinear().domain([0, Math.ceil(d3.max(normalData, d => d.count))]).range([height, 0]);
   let yGrowth = d3.scaleLinear().domain([0, Math.ceil(d3.max(growthData, d => d.count))]).range([height, 0]);

   // Define lines
   let normalLine = d3.line()
      .x(d => x(d.date))
      .y(d => yNormal(d.count));
   let growthLine = d3.line()
      .x(d => x(d.date))
      .y(d => yGrowth(d.count));

   let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

   function customTimeFormat(date) {
      const formatMonth = d3.timeFormat("%b");
      const formatDay = d3.timeFormat("%-d");
      const formatHour = d3.timeFormat("%-I");
      const formatMinute = d3.timeFormat("%M");
      const formatAMPM = d3.timeFormat("%p");
      const formatYear = d3.timeFormat("%Y");

      if (date.getMonth() === 0 && date.getDate() === 1) {
         return formatYear(date);
      } else if (date.getHours() === 0 && date.getMinutes() === 0) {
         return `${formatMonth(date)} ${formatDay(date)}`;
      } else if (date.getMinutes() === 0 || !useMinutely) {
         return `${formatHour(date)}${formatAMPM(date).toLowerCase()}`;
      } else {
         return `${formatHour(date)}:${formatMinute(date)}${formatAMPM(date).toLowerCase()}`;
      }
   }

   let xAxis = g.append('g')
       .attr('class', 'axis axis--x')
       .attr('transform', `translate(0,${height})`)
       .call(d3.axisBottom(x).tickFormat(customTimeFormat));

function wholeNumberTicks(scale) {
    const ticks = scale.ticks();
    return ticks.filter(tick => Number.isInteger(tick) && tick !== 0);
}

let yAxisNormal = g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(yNormal)
        .tickValues(wholeNumberTicks(yNormal))
        .tickFormat(d3.format('d')));

let yAxisGrowth = g.append('g')
    .attr('class', 'axis axis--y axis--right')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(yGrowth)
        .tickValues(wholeNumberTicks(yGrowth))
        .tickFormat(d3.format('d')));

   // Style axes
   xAxis.selectAll('path').style('stroke', '#aaaaaa');
   xAxis.selectAll('line').style('stroke', '#aaaaaa');
   xAxis.selectAll('text').style('fill', '#aaaaaa');
   yAxisNormal.selectAll('path').style('stroke', '#aaaaaa');
   yAxisNormal.selectAll('line').style('stroke', '#aaaaaa');
   yAxisNormal.selectAll('text').style('fill', 'white');
   yAxisGrowth.selectAll('path').style('stroke', '#aaaaaa');
   yAxisGrowth.selectAll('line').style('stroke', '#aaaaaa');
   yAxisGrowth.selectAll('text').style('fill', '#8531ff');

   // Draw lines
   g.append('path')
      .datum(normalData)
      .attr('class', 'line')
      .attr('d', normalLine)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5);
   if (graphgrowth) {
      g.append('path')
         .datum(growthData)
         .attr('class', 'growth-line')
         .attr('d', growthLine)
         .attr('fill', 'none')
         .attr('stroke', '#8531ff')
         .attr('stroke-width', 1.5);
   }
}

   function calculateSentiment(comments, afinn) {
      let totalScore = 0;
      let positiveScore = 0;
      let negativeScore = 0;
      comments.forEach(comment => {
         let words = comment.text.toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
         words.forEach(word => {
            if (afinn[word] !== undefined) {
               totalScore += afinn[word];
               if (afinn[word] > 0) {
                  positiveScore += afinn[word];
               } else if (afinn[word] < 0) {
                  negativeScore += afinn[word];
               }
            }
         });
      });
      return {
         total: totalScore,
         positive: positiveScore,
         negative: negativeScore
      };
   }

   async function main() {
      const videoId = getVideoId();
      if (!videoId) {
         alert('No video ID found');
         return;
      }
      removeExistingResults();
      const stopwordsJSON = GM_getResourceText('stopwords');
      const stopwords = JSON.parse(stopwordsJSON)['en'];
      const afinnJSON = GM_getResourceText('afinn');
      const afinn = JSON.parse(afinnJSON);
      let progressDiv = document.createElement('div');
      progressDiv.id = 'progress-div';
      progressDiv.textContent = 'Fetching..';
      progressDiv.style.cssText = `
        margin: 5px auto;
        display: block;
        text-align: center;
        color: #aaaaaa;
        background-color: #00000000;
        padding: 0px;
        margin-top: 2px;
        z-index: 9999;
     `;
      let startButton = document.querySelector('#analyze-button');
      if (startButton) {
         startButton.parentElement.insertBefore(progressDiv, startButton.nextSibling);
      }
   const { comments: loadedComments, title } = await loadAllComments(videoId);
   comments = loadedComments;
   let topLikedComments = getTopLikedComments(comments);
   let wordCount = countWords(comments, stopwords);
   let topWords = getTopWords(wordCount, 15);
   let topAfinnWords = getTopAfinnWords(wordCount, afinn, 15);
   let sentimentScores = calculateSentiment(comments, afinn);
   createCommentTimeline(comments, true);
   createWordCloud(wordCount);
   addAIAnalysisButton(title);
   }

   function removeExistingResults() {
      let resultDiv = document.querySelector('#result-div');
      if (resultDiv) {
         resultDiv.remove();
      }
      let wordCloudCanvas = document.querySelector('#word-cloud-container');
      if (wordCloudCanvas) {
         wordCloudCanvas.remove();
      }
      let progressDiv = document.querySelector('#progress-div');
      if (progressDiv) {
         progressDiv.remove();
      }
      let comtimelineDiv = document.querySelector('#comment-timeline');
      if (comtimelineDiv) {
         comtimelineDiv.remove();
      }
      let aianalsisbuttondiv = document.querySelector('#ai-analysis-button');
      if (aianalsisbuttondiv) {
         aianalsisbuttondiv.remove();
      }
      let sentanaldiv = document.querySelector('#sentiment-analysis');
      if (sentanaldiv) {
         sentanaldiv.remove();
      }
      fetchedComments = 0;
      totalComments = 0;
      comments = null;
   }

   function addButtonAndStartScript() {
      let countElement = document.querySelector('#above-the-fold');
      if (countElement && !document.querySelector('#analyze-button')) {
         let checkboxChecked = GM_getValue('checkboxChecked', false);
         let checkboxContainer = document.createElement('div');
         checkboxContainer.id = 'checkbox-container';
         checkboxContainer.style.cssText = `
            text-align: center;
            margin: 10px 0 2px;
        `;
         let checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.id = 'run-main-checkbox';
         checkbox.checked = checkboxChecked;
         checkbox.style.cssText = `
            transform: scale(0.75);
            filter: saturate(0);
            margin: 0;
        `;
         let checkboxLabel = document.createElement('label');
         checkboxLabel.textContent = 'Autorun';
         checkboxLabel.setAttribute('for', 'run-main-checkbox');
         checkboxLabel.style.cssText = `
            margin-left: 2px;
            color: #545454;
        `;
         checkboxContainer.appendChild(checkbox);
         checkboxContainer.appendChild(checkboxLabel);
         let startButton = document.createElement('button');
         startButton.textContent = 'Analyze Comments';
         startButton.id = 'analyze-button';
         startButton.style.cssText = `
            margin: 0 auto;
            display: block;
            margin-top: 0px;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 500;
            font-family: Roboto, Arial, sans-serif;
            color: #fff;
            background-color: #ffffff25;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            position: relative;
        `;
         let colorLine = document.createElement('div');
         colorLine.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80%;
            margin-left: 10%;
            height: 1px;
            background: linear-gradient(to right, #cc0000 0%, #cc0000 20%, #559900 20%, #559900 40%, #ff66cc 40%, #ff66cc 60%, #3399ff 60%, #3399ff 80%, #8531ff 80%, #8531ff 100%);
        `;
         startButton.appendChild(colorLine);
         startButton.onmouseover = function() {
            startButton.style.backgroundColor = '#ffffff50';
         };
         startButton.onmouseout = function() {
            startButton.style.backgroundColor = '#ffffff25';
         };
         countElement.appendChild(checkboxContainer);
         countElement.appendChild(startButton);
         checkbox.addEventListener('change', function() {
            checkboxChecked = checkbox.checked;
            GM_setValue('checkboxChecked', checkboxChecked);
         });
         if (checkboxChecked) {
            console.log('Checkbox checked. Running main()...');
            setTimeout(main, 5000);
         }
         startButton.onclick = main;
      }
   }

   function observeDOM() {
      const observer = new MutationObserver((mutations) => {
         let disconnected = false;
         for (let mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
               addButtonAndStartScript();
               if (fetchedComments > 0) {
                  observer.disconnect();
                  disconnected = true;
                  break;
               }
            }
         }
         if (!disconnected) {
            setTimeout(() => {
               observer.disconnect();
            }, 10000);
         }
      });
      observer.observe(document.body, {
         childList: true,
         subtree: true
      });
   }

   function runMainIfChecked() {
      let checkboxElement = document.querySelector('#run-main-checkbox');
      if (checkboxElement && checkboxElement.checked) {
         main();
      }
   }

   function checkUrlChange() {
      const observer = new MutationObserver(() => {
         if (isYouTubeWatchPage(location.href) && lastUrl !== location.href) {
            lastUrl = location.href;
            removeExistingResults();
            setTimeout(runMainIfChecked, 5000);
         }
      });
      observer.observe(document.body, {
         childList: true,
         subtree: true
      });
   }

   function isYouTubeWatchPage(url) {
      const pattern = /^https:\/\/(www\.)?youtube\.com\/watch\?v=/;
      return pattern.test(url);
   }

   window.addEventListener('beforeunload', () => {
      removeExistingResults();
   });

   observeDOM();
   checkUrlChange();
   addButtonAndStartScript();
})();