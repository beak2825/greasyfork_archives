// ==UserScript==
// @name         Youtube skip 1 hour
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        *://*.youtube.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/12194/Youtube%20skip%201%20hour.user.js
// @updateURL https://update.greasyfork.org/scripts/12194/Youtube%20skip%201%20hour.meta.js
// ==/UserScript==


var checkList = ["1 hour", "10 hour"];

function checkTitle(){
    var videoTitle = document.querySelector(".watch-title").title;
    for (i = 0; i < checkList.length; i++){
        console.log(videoTitle.toLowerCase(), checkList[i].toLowerCase());
        
        if (videoTitle.toLowerCase().indexOf(checkList[i].toLowerCase()) > -1){
            var nextVideoHref = $($(".related-list-item")[0]).find("a")[0].href;
            window.location = nextVideoHref;
            break;
        }
    }
}

checkTitle();

var mutationObvserver = window.WebKitMutationObserver || window.MutationObserver;
//called everytime the dom changes
var observer = new mutationObvserver(function(mutations) {
    for (i = 0; i < mutations.length; i++) {
    	var changedClasses = mutations[i].target.className;
        //console.log(changedClasses)
        if (!changedClasses && changedClasses.toString().indexOf("watch") > -1) {
            checkTitle();
            break;
        }
    }
});

observer.observe(document, {subtree: true, attributes: true});