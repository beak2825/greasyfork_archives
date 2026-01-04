// ==UserScript==
// @name         Twitter Without Panels
// @version      20240831
// @description  Remove Trending ("What's Happening") and Follow Suggestions ("You Might Like") and Subscribe To Premium panels on Twitter
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       documnet-idle
// @license       MIT
// @namespace https://greasyfork.org/users/1309250
// @downloadURL https://update.greasyfork.org/scripts/506114/Twitter%20Without%20Panels.user.js
// @updateURL https://update.greasyfork.org/scripts/506114/Twitter%20Without%20Panels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(removeBatch,300); //i coudln't get MutationObserver or waitForKeyElements to work so while(true) it is

   // removeBatch()

    function removeBatch(){
        //removeTrending() //apparently this one just removes itself??
        //removeFollowSuggestions() //and the follow suggestions are the same css as the premium ad
        removePremiumAd()
    }

    function removeTrending(){
        const elements = document.getElementsByClassName('css-175oi2r r-1adg3ll r-1ny4l3l')
        if (elements){
            for (let i=0; i<elements.length; i++){
                elements[i].remove(); //removes element itself
            }
        }
    }

    function removeFollowSuggestions(){
        const elements = document.getElementsByClassName('css-175oi2r r-kemksi r-1kqtdi0 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x')
        if (elements){
            for (let i=0; i<elements.length; i++){
                elements[i].remove(); //removes element itself
            }
        }
    }

    function removePremiumAd(){
        const elements = document.getElementsByClassName('css-175oi2r r-kemksi r-1kqtdi0 r-1867qdf r-1phboty r-rs99b7 r-1ifxtd0 r-1udh08x')
        if (elements){
            for (let i=0; i<elements.length; i++){
                elements[i].remove(); //removes element itself
            }
        }
    }
})();