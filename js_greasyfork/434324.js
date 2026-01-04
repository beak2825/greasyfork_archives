// ==UserScript==
// @name         pumpkin google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change background to pumpkin
// @author       Jill, Megan, and Candice
// @match        https://www.google.com/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434324/pumpkin%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/434324/pumpkin%20google.meta.js
// ==/UserScript==


window.addEventListener('load', function(){
    const searchIcon = document.querySelector(".QCzoEc");
    searchIcon.querySelector("svg").outerHTML = `<img src="https://img.icons8.com/ios/30/000000/ghost--v2.png"/>`
    document.querySelector('body').style.backgroundImage = "url('https://images.unsplash.com/photo-1539748591053-468160dcdb61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1134&q=80')"
    document.querySelector('.RNNXgb').style.background= "linear-gradient(90deg, #fcff9e 0%, #c67700 100%)";
    document.querySelector(".gLFyf").style.color = "#219ebc";
    document.querySelector('.goxjub').outerHTML = '<img src="https://img.icons8.com/ios/30/000000/cute-monster.png"/>';
}, false)
