// ==UserScript==
// @name         keep connect Google colab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  keep connect Google colab in long time
// @author       BennyShi
// @match        https://colab.research.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395932/keep%20connect%20Google%20colab.user.js
// @updateURL https://update.greasyfork.org/scripts/395932/keep%20connect%20Google%20colab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        if(Array.from(document.getElementById("connect").children[0].children[2].innerHTML).splice(3,4).toString() === '重,新,连,接'){
            document.getElementById("connect").children[0].children[2].click()
        }
    },1000)
})();