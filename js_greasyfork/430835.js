// ==UserScript==
// @name         BGDC Better Google Docs Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Better Google Docs Comments
// @author       Maxence Delattre
// @match        https://docs.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430835/BGDC%20Better%20Google%20Docs%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/430835/BGDC%20Better%20Google%20Docs%20Comments.meta.js
// ==/UserScript==

var jQueryScript = document.createElement('script');
jQueryScript.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js');
document.head.appendChild(jQueryScript);

var intervalId ;
var runEverySecond = function(){
    var css = $(".docos-anchoreddocoview").css("width")
    if(css){
        $(".docos-anchoreddocoview").css("width", "auto");

        var content = $(".docos-replyview-body").text()
        const matches = content.matchAll("```");
        for (const match of matches) {
            console.log(match);
            console.log(match.index)
        }
        //var newContent = $(".docos-replyview-body").text(newContent);
        clearInterval(intervalId);
    }
};

window.addEventListener("load", function(){
    intervalId = setInterval(runEverySecond,1000);
});

