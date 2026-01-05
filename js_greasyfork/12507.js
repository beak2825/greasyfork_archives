// ==UserScript==
// @name         Reddit Vote and Comment Fuzzer
// @namespace    http://kmcdeals.com
// @version      1.1
// @description  Fuzzes comments (on your front page) for a specific subreddit
// @author       Kmc - admin@kmcdeals.com
// @match        *://*.reddit.com/
// @match        *://*.reddit.com/r/all/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12507/Reddit%20Vote%20and%20Comment%20Fuzzer.user.js
// @updateURL https://update.greasyfork.org/scripts/12507/Reddit%20Vote%20and%20Comment%20Fuzzer.meta.js
// ==/UserScript==

//configurables - all selections are random

    //list of words that replace the subs below - separate subreddits with ; (eg. "videos;unexpected;wtf")
var subReplacementList = "videos",
    
    //subreddit(s) that get replaced with the above list - separate multiple subreddits with ; (eg. "unexpectedjihad;unexpectedcena;unexpected")
    subsToReplace = "unexpectedjihad;unexpectedcena",
    
    maxScore = 3700,
    minScore = 1700,

    maxCommentNum = 2500,
    minCommentNum = 700,

    maxTime = 15,
    minTime = 4;


//in case of an error, here are the default values
/*
var subReplacementList = "videos",
    
    subsToReplace = "unexpectedjihad;unexpectedcena",
    
    maxScore = 3700,
    minScore = 1700,

    maxCommentNum = 2500,
    minCommentNum = 700,

    maxTime = 15,
    minTime = 4;

*/


//ignore everything below here

fuzzScores();
function fuzzScores() {
    if(typeof subReplacementList === "undefined" || typeof subsToReplace === "undefined" || typeof maxScore === "undefined" || typeof minScore === "undefined" || typeof maxCommentNum === "undefined" || typeof minCommentNum === "undefined" || typeof maxTime === "undefined" || typeof minTime === "undefined") return alert("Reddit Vote and Comment Fuzzer:\n\nOne or more of the variables are undefined. Make sure there are 7 in total!");
    
    var subElements = document.querySelectorAll('.link .entry .tagline .subreddit');

    for (i = 0; i < subElements.length; i++) {
       
        var subsToReplaceArr = subsToReplace.split(";");
        
        for (j = 0; j < subsToReplaceArr.length; j++) {
            var subHref = subElements[i].href.toLowerCase();

            if (subHref.indexOf(subsToReplaceArr[j].toLowerCase()) > -1 && subElements[i].className.indexOf('kmc-fuzzed') == -1) {
                subElements[i].className += " kmc-fuzzed";

                var randScore = Math.floor(Math.random() * (maxScore - minScore) + minScore) - 1;
                var randCommentNum = Math.floor(Math.random() * (maxCommentNum - minCommentNum) + minCommentNum);
                var randTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);

                var scoreElement = subElements[i].parentElement.parentElement.parentElement.querySelectorAll('.midcol .score');
                var commentElement = subElements[i].parentElement.parentElement.parentElement.querySelector('.buttons .first .comments');
                var timeElement = subElements[i].parentElement.parentElement.parentElement.querySelector('.entry .tagline .live-timestamp');


                var subsArr = subReplacementList.split(";");
                var randSub = subsArr[Math.floor(Math.random() * subsArr.length)];



                if (subElements[i].innerHTML != null && randSub != null) {
                    subElements[i].innerHTML = "/r/" + randSub;
                }

                if (scoreElement != null) {
                    for (v = 0; v < scoreElement.length; v++) {
                        scoreElement[v].innerHTML = randScore;
                        randScore++;
                    }
                }

                if (commentElement != null) {
                    commentElement.innerHTML = randCommentNum + " comments";
                }

                if (timeElement != null) {
                    timeElement.outerHTML = '<time class="live-timestamp">' + randTime + ' hours ago</time>';
                }
            }
        }
    }
}


var mutationObvserver = window.WebKitMutationObserver || window.MutationObserver;
//called everytime the dom changes
var observer = new mutationObvserver(function(mutations) {
    for (i = 0; i < mutations.length; i++) {
    	//this seemed to be the best way to check if RES loaded a new page
    	if (mutations[i].target.id.match(/([A-Za-z-])+/g) == "page-") {
            fuzzScores();
    	}
    }
});

observer.observe(document, {subtree: true, attributes: true});