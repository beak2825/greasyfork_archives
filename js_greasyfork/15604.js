// ==UserScript==
// @name        Gray and centered HTML pages
// @description Makes HTML pages easy to read by setting the body to center, the background color to gray and the font size to 16pt.
// @namespace   hugsmile.eu
// @include     *.html
// @include     *htm
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15604/Gray%20and%20centered%20HTML%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/15604/Gray%20and%20centered%20HTML%20pages.meta.js
// ==/UserScript==

(function () {
    function addCss(cssString) { 
        var head = document.getElementsByTagName('head')[0]; 
        if(head){
            var newCss = document.createElement('style'); 
            newCss.type = "text/css"; 
            newCss.innerHTML = cssString; 
            head.appendChild(newCss);
        }
    }
    var script = document.getElementsByTagName('script')[0];
    if(!script){
        addCss ('body { width: 50%;  margin: 0 auto; background-color: gray; font-size: 16pt;}');
    }
})();