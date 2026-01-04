// ==UserScript==
// @name         YouTube - Ad Skip Revamped
// @version      0.1
// @description  Skips and removes ads on YouTube automatically, combine this with ublock origin
// @author       Sadulisten
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/803561
// @downloadURL https://update.greasyfork.org/scripts/430658/YouTube%20-%20Ad%20Skip%20Revamped.user.js
// @updateURL https://update.greasyfork.org/scripts/430658/YouTube%20-%20Ad%20Skip%20Revamped.meta.js
// ==/UserScript==

const equalText1 = "Skip Ads";
const equalText2 = "Skip Ad";

const callback = function(mutationsList, observer) {
    if (mutationsList.Length < 1) return;

    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList'
            && document.getElementsByClassName("ytp-ad-skip-button").length > 0)
        {
            skipAd(false);
            return;
        }
        //else
        //{
        //    console.log("some other uninteresting mutation happened");
        //    debugger;
        //}

    }
};
const observer = new MutationObserver(callback);
const config = { attributes: false, childList: true, subtree: true };

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

function skipAd(firstTime = false){
    console.log("Tried to skip a ad");
    if(document.getElementsByClassName("ytp-ad-skip-button").length > 0){
        if(document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText1 || document.getElementsByClassName("ytp-ad-skip-button")[0].childNodes[0].textContent === equalText2){
            document.getElementsByClassName("ytp-ad-skip-button")[0].click();
        }
        else
        {
            if (firstTime == false)
            {
                // skipAd was triggered by the mutation callback
                // but no adblock button could be found
                // figure this out
                debugger;
            }
        }
    }
}

(function() {
    'use strict';
    addNewStyle('.ytp-ad-overlay-slot {display:none !important;}');
    skipAd(true); // Call this for good measure cause why not, maybe the mutation callback doesnt get initialized fast enough

    let observeElement = document.getElementById('container');
    if (observeElement == null)
    {
        debugger;
    }

    observer.observe(observeElement, config);
})();