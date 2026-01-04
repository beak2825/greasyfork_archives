// ==UserScript==
// @name         netacad script
// @namespace    http://lkov.tk/
// @version      1.1
// @description  skript na vyplnovani netacad linux testu
// @author       @sirluky
// @include      https://content.netdevgroup.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381359/netacad%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/381359/netacad%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
function r(){

fetch(`https://api.jsonbin.io/b/5ca52dba34241f2ab5e1ba79`).then(e => e.json()).then(unparseddata => {
const parsedData = unparseddata;
//parsedData.push(prompt("zadejte ziskany kod"))
/**
 * @param {*} n question number
 * return string with answer
 */

function start(){
document.querySelectorAll("#tour2 > .ndg-menu-btn").forEach( async function (e) {await setTimeout(()=>{},1000);e.click();})
  let phase = 0;
    runForAll()
  function runForAll(){
    setTimeout(e => {
      let question = getQuestion(phase)
      let answers = findAnswer(question, parsedData);
      answers.forEach(answer => {
        checkAnswer(phase, answer)
      })
      if (question) {
        phase++;
        setTimeout(e => {
          runForAll()
        }, 300);
      }
    }, 300)
  }

}
function getQuestion(n) {
  return document.querySelectorAll(".panel-body")[n].querySelector("div").innerText
}
function checkAnswer(n,text){
  let list = []
  document.querySelectorAll(".panel-body")[n].querySelectorAll(".answer_container div").forEach((e,index) => list.push([e.innerText,index]))
  list = list.filter(e => e[0] === text);
  // list = list.length > 0 ? true :false;
  console.log(list)
  if(list.length > 0){
    console.log(list[0][1])
    document.querySelectorAll(".panel-body")[n].querySelectorAll(".answer_container div")[list[0][1]].parentElement.parentElement.childNodes[1].checked = true
  } else {
    document.querySelectorAll(".panel-body")[n].style.background = "mistyrose"
  }
  return list;
}

//question to select
function findAnswer(toFind, myData) {
  let ans = myData.filter(e => e.question === toFind.slice(0, e.question.length));
  if(ans.length > 0){
  return ans[0].answers;
  } else{
    return []
  }
}
start()
// document.querySelectorAll(".panel-body")[n].querySelector("answer_container div")

/*

parsing from https://www.ccna7.com/linux-essentials/linux-essentials-chapter-2-exam/
*/



//quesetion
// document.querySelectorAll("ol>li")[0 /* question number */ ].querySelectorAll("h3")[1].innerText
//answers
// document.querySelectorAll("ol>li")[0 /* question number */ ].querySelectorAll("span")[0].innerText
})
} r()
})();