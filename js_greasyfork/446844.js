// ==UserScript==
// @name         Gram Jam Word Checker
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.0
// @description  checks words against the gram jam word dictionary to make sure they are playable words
// @author       FXZFun
// @match        https://gramjam.app/
// @match        https://gram-jam.vercel.app/
// @match        https://gram-jam-english.vercel.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gramjam.app
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446844/Gram%20Jam%20Word%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/446844/Gram%20Jam%20Word%20Checker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var words = [];
 
    // get wordlist
    fetch("/words.json").then(r => r.json().then(j => words = j))
 
    // create wordlist
    var l = document.createElement("div");
    l.style = "position: fixed; left: 10px; bottom: 50px";
    l.classList = "fxzfun-wordlist";
 
    // create searchbox
    var i = document.createElement("input");
    i.id = "fxzfunSearch";
    i.placeholder = "Check Word";
    i.style = "position: fixed; left: 10px; bottom: 10px";
    i.onkeyup = function () {
        if (words.includes(i.value)) i.style.color = "green";
        else i.style.color = "red";
 
        if (i.value.endsWith("+")) {
            var matchingWords = words.filter(_ => _.includes(i.value.slice(0, i.value.length - 1))).sort((a,b) => a.length - b.length).slice(0, 10);
            document.querySelector(".fxzfun-wordlist").innerHTML = "<p>" + matchingWords.join("</p><p>") + "</p>";
        } else if (i.value.startsWith("+")) {
            var matchingWords2 = words.filter(_ => _.startsWith(i.value.slice(1))).sort((a,b) => a.length - b.length).slice(0, 10);
            document.querySelector(".fxzfun-wordlist").innerHTML = "<p>" + matchingWords2.join("</p><p>") + "</p>";
        } else {
            document.querySelector(".fxzfun-wordlist").innerHTML = "";
        }
    }
 
    var bootstrap = setInterval(() => {
        if (document.getElementById("fxzfunSearch") == null) {
            document.body.appendChild(i);
            document.body.appendChild(l);
            document.onkeydown = (e) => { if (i != document.activeElement) i.focus(); }
        } else {
            clearInterval(bootstrap);
        }
    }, 500);
})();
