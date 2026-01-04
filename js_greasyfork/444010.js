// ==UserScript==
// @name         Suggestive Images😳👄
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Suggestive Images😳👄 JOB y QM
// @author       jeanpirelag
// @match        https://hivemicro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hivemicro.com
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444010/Suggestive%20Images%F0%9F%98%B3%F0%9F%91%84.user.js
// @updateURL https://update.greasyfork.org/scripts/444010/Suggestive%20Images%F0%9F%98%B3%F0%9F%91%84.meta.js
// ==/UserScript==

var a = document.createElement("a");
a.id = 'quizmode';
a.innerHTML = "QUIZ MODE";
document.body.appendChild(a);
document.getElementById('quizmode').style.position = "absolute";
document.getElementById('quizmode').style.zIndex = "1500";
a.onclick = function () {
  test();
};


(function() {
    'use strict';
    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
        document.querySelectorAll("div > span")[3].click();
            setTimeout(function(){
                history.back();
            }, 1800);
        }
});

async function keys() {
    window.onkeydown = function (event, index){

        if (event.keyCode == '49'){
            document.evaluate("//div[text()='Yes']", document).iterateNext().click();
            setTimeout(function(){
                 document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }

        if (event.keyCode == '50'){
            document.evaluate("//div[text()='No']", document).iterateNext().click();
            setTimeout(function(){
                 document.evaluate("//span[text()='Next']", document).iterateNext().click();
            }, 100);
        }



    }
}

keys();
})();

var time = 5000;

function r1() {
function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
async function delayedGreeting() {
    document.evaluate("//div[text()='Yes']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Next']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Confirm']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Next']", document).iterateNext().click();
}
delayedGreeting();
	}

// Relevant
function r2() {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
async function delayedGreeting() {
    document.evaluate("//div[text()='No']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Next']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Confirm']", document).iterateNext().click();
    await sleep(time);
    document.evaluate("//span[text()='Next']", document).iterateNext().click();
}
delayedGreeting();
	}



function test() {
      function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}
async function delayedGreeting() {

var tiempo = 20000;
document.querySelectorAll('div')[128].style.display = "none";
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r2();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);
r1();await sleep(tiempo);

}
delayedGreeting();
	}




