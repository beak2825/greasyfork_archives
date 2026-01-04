// ==UserScript==
// @name         Pastoral Competitive Programming
// @namespace    https://nebocco.hatenablog.com/
// @version      0.1
// @description  cow barks on submissing code to calm you down
// @author       nebocco
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428399/Pastoral%20Competitive%20Programming.user.js
// @updateURL https://update.greasyfork.org/scripts/428399/Pastoral%20Competitive%20Programming.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let player = new Audio('https://dl.dropboxusercontent.com/s/51m5y7rts3f53kl/holstein-cow-mooing-1.mp3');
    let form = document.querySelector('form.form-code-submit');
    let button = document.querySelector('#submit');
    button.style.display = "none";
    let dummyButton = document.createElement("button");
    dummyButton.setAttribute('type', 'button');
    dummyButton.setAttribute('class', 'btn btn-primary');
    dummyButton.textContent = "提出";
    button.parentNode.insertBefore(dummyButton, button);
    dummyButton.addEventListener("click", function(){
      console.log("clicked!");
      player.play();
      setTimeout(() => { button.click(); }, 2000);
    });
})();