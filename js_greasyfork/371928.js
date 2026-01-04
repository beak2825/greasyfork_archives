// ==UserScript==
// @name         Codeexpander-Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  [codeexpander]
// @author       You
// @match        https://gist.github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371928/Codeexpander-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/371928/Codeexpander-Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const update = () => {
       const fileNames = document.getElementsByClassName('css-truncate-target');
       const description = document.getElementsByClassName('description');
       const description02 = document.getElementsByClassName('repository-meta-content');
       const description03 = document.querySelectorAll("#gist-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content.gist-content > div > div[itemprop='about']");
       for(var i = 0; i < fileNames.length; i++) {
           fileNames[i].textContent = fileNames[i].textContent.split("&env")[0];
           fileNames[i].textContent = fileNames[i].textContent.split("|-|&tag=")[0] ? fileNames[i].textContent.split("|-|&tag=")[0] : "No Description";
       }
       for(var j = 0; j < description.length; j++) {
           description[j].textContent = description[j].textContent.split("|-|&tag=")[0].trim() ? description[j].textContent.split("|-|&tag=")[0] : "No Description";
       }
       for(var k = 0; k < description02.length; k++) {
           description02[k].textContent = description02[k].textContent.split("|-|&tag=")[0].trim() ? description02[k].textContent.split("|-|&tag=")[0] : "No Description";
       }
       for(var h = 0; h < description03.length; h++) {
           description03[h].textContent = description03[h].textContent.split("|-|&tag=")[0].trim() ? description03[h].textContent.split("|-|&tag=")[0] : "No Description";
       }
    };
    update();
    window.addEventListener("click", function (event) {
        setTimeout(()=> { update(); } , 1000);
    });
})();