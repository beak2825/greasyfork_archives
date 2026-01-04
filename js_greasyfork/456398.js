// ==UserScript==
// @name         GPT Comment Detector
// @namespace    https://example.com/
// @version      0.1
// @description  Identify AI-generated comments on Hacker News
// @author       chryzsh
// @match        https://news.ycombinator.com/*
// @grant        none
// @connect      huggingface.co
// @grant         GM.xmlHttpRequest
// @grant		unsafeWindow
// @sandbox		JavaScript
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456398/GPT%20Comment%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/456398/GPT%20Comment%20Detector.meta.js
// ==/UserScript==

// Set a threshold for the minimum probability that a comment is AI-generated
const AI_THRESHOLD = 0.99;
const PROBABLE_THRESHOLD = 0.7;
const TOKEN_THRESHOLD = 200; //4 characters are about 50 tokens, which is when the detector model because reliable

// put all comments into a NodeList
const comments = document.querySelectorAll('.comment');

// regex to remove whitespaces
const whitespaceRegex = /\s+/g;

//regex to remove "reply" at the end of comments
const replyRegex = /\breply\b\s*/g;

// kick off the program
main();

function main() {
  // loop over each comment
  comments.forEach((comment) => {
    // add an onclick for each comment
    comment.addEventListener('click', function () {
      // trim commments for whitespaces and test length for each comment
      testLength(comment);
    });
  });
};

// Trim and test the length of comments
function testLength(comment) {
  var text = comment.textContent;

  // trim whitespaces and shit from the end first - dont do this on the comment object itself, just a variable
  text = comment.textContent.trim();
  text = comment.textContent.replace(whitespaceRegex, " ");

  // remove "reply" from the end
  text = comment.textContent.replace(replyRegex, "");

  // test the length first so we don't run detection on too short comments
  if (text.length < TOKEN_THRESHOLD) {
    comment.style.border = '1px solid gray';
    comment.innerHTML += `<div style="color: gray; font-weight: bold;">Insufficient data to assess if AI generated</div>`;
  }
  else {
    // run AI detection and add comment based on the result
    detectAI(comment.textContent, function (result) {
      addComment(result, comment);
    });

  }
}

// Add comment
function addComment(result, comment) {
  var json = JSON.parse(result);
  var fakeProbability = json.fake_probability;
  var realProbability = json.real_probability;
  var formattedNumberAI = (fakeProbability * 100).toFixed(3);
  var formattedNumberHuman = (realProbability * 100).toFixed(3);

  // most comments will not be AI (hopefully) so start with testing that
  if (fakeProbability < PROBABLE_THRESHOLD) { //assume not AI if lower than 0.7 on the AI-meter
    comment.style.border = '1px solid green';
    comment.innerHTML += `<div style="color: green; font-weight: bold;">Definitely human - human probability ${formattedNumberHuman}</div>`;
  }
  // If the probability is above the threshold, label the comment as AI-generated
  else if (fakeProbability > PROBABLE_THRESHOLD) { // possibly AI
    if (fakeProbability > AI_THRESHOLD) { //definitely AI

      comment.style.border = '1px solid red';
      comment.innerHTML += `<div style="color: red; font-weight: bold;">Definitely AI - AI probability ${formattedNumberAI}</div>`;
    }
    else {
      comment.style.border = '1px solid yellow';
      comment.innerHTML += `<div style="color: yellow; font-weight: bold;">Possibly AI - AI probability ${formattedNumberAI}</div>`;
    }
  }
};

// Run AI detection
function detectAI(input, callback) {
  var detectorUrlWithInput = "https://huggingface.co/openai-detector?" + input
  GM.xmlHttpRequest({
    method: "GET",
    url: detectorUrlWithInput,
    headers: {
      "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
      "Content-Type": "application/x-www-form-urlencoded"
    },

    onload: function (response) {
      var responseParsed = [response.responseText].join("\n");
      callback(responseParsed);
    }
  });
}
