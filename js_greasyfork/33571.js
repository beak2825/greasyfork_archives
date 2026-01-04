// ==UserScript==
// @name         status quo
// @namespace    https://seans.site/
// @version      1.0
// @description  Reduce Twitter's character limit because change is frightening and bigger numbers are intimidating.
// @author       Sean S. LeBlanc
// @match        https://twitter.com/
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/33571/status%20quo.user.js
// @updateURL https://update.greasyfork.org/scripts/33571/status%20quo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var maxCharacters = 70;

    var tweetCharCount = document.querySelector('#timeline > div.timeline-tweet-box > div > form > div.TweetBoxToolbar > div.TweetBoxToolbar-tweetButton.tweet-button > span');
    var countStyle = window.getComputedStyle(tweetCharCount);
    var newCount = document.createElement("p");
    newCount.innerText = maxCharacters;
    newCount.style.cssText = countStyle.cssText;
    tweetCharCount.style.visibility = "hidden";
    tweetCharCount.insertAdjacentElement('afterend', newCount);
    var tweetLength = 0;
    var charactersLeft = maxCharacters;
    $(document).on("input", '#tweet-box-home-timeline', function(event){
        var tweetBox = event.currentTarget.childNodes[0];
        if(tweetBox.innerText.length > maxCharacters){
            var t=document.createTextNode(tweetBox.innerText.substr(0,maxCharacters));
            tweetBox.innerText = "";
            //selection code adapted from: https://stackoverflow.com/questions/17497661/insert-text-before-and-after-selection-in-a-contenteditable
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                var range = sel.getRangeAt(0);
                var startNode = range.startContainer;
                var startOffset = range.startOffset;
                var boundaryRange = range.cloneRange();
                boundaryRange.collapse(false);
                boundaryRange.setStart(startNode, startOffset);
                boundaryRange.collapse(true);
                boundaryRange.insertNode(t);
                range.setStartAfter(t);
                range.setEndAfter(t);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
        tweetLength = tweetBox.innerText.length;
        charactersLeft = maxCharacters - tweetLength;
        newCount.innerText = charactersLeft.toString(10);
    });
})();