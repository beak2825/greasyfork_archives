// ==UserScript==
// @name         Audioverse Audio Follow Along
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  Follows along the verse being read in AudioVerse.org
// @author       Sameh Faragllah
// @match        https://www.audioverse.org/en/bibles/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audioverse.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489613/Audioverse%20Audio%20Follow%20Along.user.js
// @updateURL https://update.greasyfork.org/scripts/489613/Audioverse%20Audio%20Follow%20Along.meta.js
// ==/UserScript==

(function() {
    //'use strict';
var tot;
var textCount;
var ind;
var totArr = [];
var lastVerse = null;
    // Your code here...
    var myinterval = setInterval(function(){
        var bar = document.querySelector('[aria-label="miniplayer"]');
        var text = document.querySelector('[class*="transcript_text"]');
        if(bar!=null && text!=null) {
            var curr = bar.children[1].children[1].children[0].textContent;
            tot = bar.children[1].children[1].children[2].textContent;
            var curr1 = parseInt(curr.split(":")[0]);
            var curr2 = parseInt(curr.split(":")[1]);
            curr = curr1*60.0 + curr2*1.0 - 4.5;
            var tot1 = parseInt(tot.split(":")[0]);
            var tot2 = parseInt(tot.split(":")[1]);
            tot = tot1*60.0 + tot2*1.0-4;
            var textArray = Array.from(document.querySelector('[class*="transcript_text"]').children);
            textCount = 0;
            textArray.forEach((item) => {
                textCount += item.textContent.length;
                totArr.push(textCount);
            });
            var progress = Math.floor(curr/tot*textCount);
            ind = totArr.findIndex(element => element > progress);
            if(lastVerse!=null) {
                lastVerse.style.backgroundColor = "";
            }
            textArray[ind].style.backgroundColor = "Gainsboro";
            lastVerse = textArray[ind];
        }
    },400);
})();