// ==UserScript==
// @name         Aceable Autoanswer and video player script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  an autoanswer script for questions, pages, going next
// @author       Created by DudeUnoob on github: https://github.com/DudeUnoob
// @match        https://driving.aceable.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @exclude      https://driving.aceable.com/acetest/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472147/Aceable%20Autoanswer%20and%20video%20player%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/472147/Aceable%20Autoanswer%20and%20video%20player%20script.meta.js
// ==/UserScript==

setInterval(() => {

 if(document.getElementById("arrow-next").disabled == false){
   document.getElementById("arrow-next").click()
 }

 if(document.querySelector(".vjs-big-play-button")){
     console.log("lol")
    document.querySelector(".vjs-big-play-button").click()
    }

async function autoAnswerQuestions() {
  const answerButtonList = document.querySelector(".gritCourseflowNode__answerButtonList");

  for (const answerButton of answerButtonList.querySelectorAll(".gritCourseflowNode__answerButtonListItem > button")) {

    answerButton.click();
  }

    setTimeout(() => {
    document.querySelector("[courseflow-forward]").click();}, 200)

  await waitUntilCheckAnswerButtonIsEnabled();

  // Click the "next" button.
  setTimeout(() => {
  document.getElementById("arrow-next").click();}, 300)

}

async function waitUntilCheckAnswerButtonIsEnabled() {

}

autoAnswerQuestions();


}, 500)