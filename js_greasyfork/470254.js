// ==UserScript==
// @license MIT
// @name         focusSearch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  focus search input
// @author       Chris
// @match        *://*/*
// @icon         https://img1.imgtp.com/2023/06/06/b6fHuJNi.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470254/focusSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/470254/focusSearch.meta.js
// ==/UserScript==

(function(){
    var key = 's'
    var only = false

    var searchInputDom = document.querySelector(`input`)
    var focus = function(event){
        event.key === key?searchInputDom.focus():false;
    }
    var removeFocus = function(){
        window.removeEventListener('keyup', focus)
    }

    searchInputDom.addEventListener('focus', removeFocus);
    searchInputDom.addEventListener('blur', function(){
        only?false:window.addEventListener('keyup', focus);
    });
    window.addEventListener('keyup', focus)
})()
