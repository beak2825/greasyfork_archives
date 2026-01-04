// ==UserScript==
// @name         Lewdle - Word Reveal Hack
// @namespace    q1k
// @version      1.1.1
// @description  This script adds an element to the bottom of the page with the daily word. Simply hover & click it and the daily word is revealed. Always "guess" the word on the first try and impress your friends.
// @author       q1k
// @match        *://www.lewdlegame.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439934/Lewdle%20-%20Word%20Reveal%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439934/Lewdle%20-%20Word%20Reveal%20Hack.meta.js
// ==/UserScript==

function findElement(selector) {
    return new Promise(function(resolve) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(function(mutations) {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

var mydiv = document.createElement("div");
mydiv.setAttribute("id","word-reveal");
var styles = document.createElement("style");
styles.innerHTML="body{overflow:auto;} .testAd, .versionNumMain{display:none;} .mainKeyboard{height:100%;} html,body{height:100%;} #root{display:flex;flex-direction:column;height:100%;} #word-reveal{order:3;user-select:none;text-align:center;line-height:1.5em;background:#555;color:#555;} #word-reveal:hover{color:white;} .game-id{display:none;}";

document.body.appendChild(styles);

findElement("#root .testMain").then(function(el){
    el.closest("#root").appendChild(mydiv);
});

mydiv.addEventListener('click',function(e){
    mydiv.textContent = "Today's word: " + atob(JSON.parse(localStorage.currentTarget)).toUpperCase();
});

mydiv.innerHTML = "Click to reveal today's word";

