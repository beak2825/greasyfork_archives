// ==UserScript==
// @name         Duolingo Assistant
// @version      1.0.3
// @description  Duolingo Lesson Assistant
// @author       eterNEETy
// @namespace    https://greasyfork.org/users/292830
// @match        https://www.duolingo.com/*
// @icon         https://cdn.jim-nielsen.com/ios/512/duolingo-2019-01-02.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425733/Duolingo%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/425733/Duolingo%20Assistant.meta.js
// ==/UserScript==
// jshint esversion: 6


// p = document.querySelector('div[data-test="challenge-translate-prompt"]').textContent;
// c = a.challenges.find(x => x.prompt === p);
// if (c!=undefined) {
//   s = c.correctSolutions[0];
//   document.querySelector('textarea[data-test="challenge-translate-input"]').value = s;
// } else {
//  c = a.adaptiveChallenges.find(x => x.prompt === p);
//  if (c!=undefined) {
//    s = c.correctSolutions[0];
//    document.querySelector('textarea[data-test="challenge-translate-input"]').value = s;
//  }
// }

const highlightAbleType = ["characterIntro", "characterSelect", "form", "select", "selectPronunciation"];
const copySolutionType = ["translate", "name"];
const copyPromptType = ["listenTap", "listen"];

let q = {
  'cnt': {
    'characterMatch': 'div[data-test="challenge challenge-characterMatch"]',
    'judge': 'div[data-test="challenge challenge-judge"]',
    'characterIntro': 'div[data-test="challenge challenge-characterIntro"]',
    'characterSelect': 'div[data-test="challenge challenge-characterSelect"]',
    'form': 'div[data-test="challenge challenge-form"]',
    'select': 'div[data-test="challenge challenge-select"]',
    'selectPronunciation': 'div[data-test="challenge challenge-selectPronunciation"]',
  },
  'card': {
    'characterIntro': 'div[data-test="challenge-choice"]',
    'characterSelect': 'div[data-test="challenge-choice-card"]',
    'form': 'div[data-test="challenge-judge-text"]',
    'select': 'div[data-test="challenge-choice-card"]',
    'selectPronunciation': 'div[data-test="challenge-judge-text"]',
  }
}



// ---------------------------------------------------------

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// ---------------------------------------------------------

// =========================================================

function doCallback(callback=false) {
    if (typeof callback == "function") {
        callback();
    }
}
function checkExist(query,qid=0,hidden_ok=false) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (hidden_ok) {
            el_exist = true;
        } else if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function checkEl(query,qid=0,callback=false,hidden_ok=false) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        console.log("checkEl: "+query+"["+qid+"]");
        if (checkExist(query,qid,hidden_ok)) {
            if (hidden_ok) {
                clearInterval(loop_checkEl);
                doCallback(callback);
            } else if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                doCallback(callback);
            } else {
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 300);
}

// =========================================================


let data;
let data_id;

const color = ['#CC0000', '#FF9900', 'yellow', '#66FF33', '#0099FF', '#FF33CC', '#9900CC', 'gray', 'black'];


function highlightAnswer(data_type, qid) {
  let init_highlightAnswer = function() {
    const el_container = document.querySelector(q.cnt[data_type]);
    const el_cards = el_container.querySelectorAll(q.card[data_type]);
    const el_card = el_cards[qid];
    el_card.style.color = "red";
    el_card.style.fontWeight = "bold";
    const el_spans = el_card.querySelectorAll("span");
    for (let i = 0; i < el_spans.length; i++) {
      const el_span = el_spans[i];
      el_span.style.color = "red";
      el_span.style.fontWeight = "bold";
    }
  }
  checkEl(q.cnt[data_type],0,init_highlightAnswer);
}

function copyAnswer(answer) {
  copyToClipboard(answer.replace(".","").replace("。","").replace("?","").replace("？","").replace("!","").replace("！",""));
}

function editData(d) {
  data = d;
  if (data.adaptiveChallenges != undefined) {
    if (data.adaptiveChallenges.length>0) {
      data.challenges.splice(data.adaptiveChallenges.length*-1, data.adaptiveChallenges.length);
      data.challenges = data.challenges.concat(data.adaptiveChallenges);
    }
  }
  console.log(data);
}

function main(first_question=false) {
  // console.log("copyAnswer");
  let data_question;
  // console.log(data);
  if (first_question) {
    data_id = 0;
  }
  data_question = data.challenges[data_id];
  console.log(data_id);
  if (data_question != undefined) {
    if (copySolutionType.indexOf(data_question.type) >= 0) {
      copyAnswer(data_question.correctSolutions[0]);
    } else if (copyPromptType.indexOf(data_question.type) >= 0) {
      copyAnswer(data_question.prompt);
    } else if (data_question.type == "characterMatch") {
      let init_characterMatch = function() {
        let el_cnt_characterMatch = document.querySelector(q.cnt.characterMatch);
        let el_buttons = el_cnt_characterMatch.querySelectorAll('button');
        for (let i = 0; i < el_buttons.length; i++) {
          const el_button = el_buttons[i];
          const txt_button = el_button.textContent;
          for (let ii = 0; ii < data_question.pairs.length; ii++) {
            const data_pair = data_question.pairs[ii];
            if (data_pair.character == txt_button || data_pair.transliteration == txt_button) {
              el_button.parentElement.style.backgroundColor = color[ii];
              break;
            }
          }
        }
      } 
      checkEl(q.cnt.characterMatch,0,init_characterMatch);
    } else if (highlightAbleType.indexOf(data_question.type) >= 0) {
      highlightAnswer(data_question.type, data_question.correctIndex);
    } else if (data_question.type == "completeReverseTranslation") {
      let data_solution = "";
      for (let i = 0; i < data_question.displayTokens.length; i++) {
        const data_token = data_question.displayTokens[i];
        if (data_question.displayTokens[i].isBlank) {
          data_solution += data_question.displayTokens[i].text;
        }
      }
      copyAnswer(data_solution);
    } else if (data_question.type == "judge") {
      let init_judge = function() {
        let el_cnt_judge = document.querySelector(q.cnt.judge);
        let el_cards = el_cnt_judge.querySelectorAll('div[data-test="challenge-judge-text"]');
        for (let i = 0; i < data_question.correctIndices.length; i++) {
          const data_correct_id = data_question.correctIndices[i];
          let el_card = el_cards[data_correct_id];
          el_card.style.color = "red";
        }
      }
      checkEl(q.cnt.judge,0,init_judge);
    } else {
      let data_type = 'data_question.type: ' + data_question.type;
      console.log(data_type);
      copyToClipboard(data_type);
    }
  }
}

function listenNetwork() {
  console.log("listenNetwork");
  let origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      if (this.responseURL.indexOf("sessions")>=0) {
        const sessions_data = JSON.parse(this.responseText);
        if (sessions_data.challenges != undefined) {
          console.log(JSON.parse(this.responseText));
          editData(JSON.parse(this.responseText));
          main(true);
        } else {
          copyToClipboard("clear");
        }
      } else if (this.responseURL.indexOf("challenge_response/batch")>=0) {
        data_id += 1;
        main();
      }
    });
    origOpen.apply(this, arguments);
  };
};

(function() {
  'use strict';

  // Your code here...
  listenNetwork();
  // if (window.location.pathname.indexOf("/skill") === 0) {
  //   // console.log("skill dayo");
  // }
})();