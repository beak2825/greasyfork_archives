// ==UserScript==
// @name         Old Reddit Expando Click Anywhere
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Expand the video or image content by clicking on the free space around the post
// @description  instead of pixel hunting for the expand button. Adds some styles.
// @author       atcw
// @match        https://old.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/477388/Old%20Reddit%20Expando%20Click%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/477388/Old%20Reddit%20Expando%20Click%20Anywhere.meta.js
// ==/UserScript==


let debug = false;

let customCSS = '.thing {border: 1px red dashed;} div.thing:hover {background-color: #FAFAFA;}';
GM_addStyle(customCSS);


(function() {
    'use strict';

    log('Starting RedditExpando ' + new Date());

    document.addEventListener('DOMContentLoaded', (event) => {
        document.querySelectorAll(".thing").forEach(
            function(el){
                var thing = el;
                thing.addEventListener(

                    'click', function(event) {
                        //short circuits so we dont click expando twice - let native bubbling handle it
                        if(event.target == el.querySelector("div.expando-button")){ //not .expanded
                            return;
                        }
                        if(event.target.classList.contains("arrow")){ //not the up/down vote arrows
                            return;
                        }
                        if(el.querySelector(".expando .media-preview")?.contains(event.target)){ //not the expando-content itself
                            return;
                        }
                        if(el.querySelector(".expando form")?.contains(event.target)){ //not the expando-content itself (text-post)
                            return;
                        }
                        if(event.target.tagName == "A"){ //save etc -- needs uppercase
                            return;
                        }
                        if(window.getSelection() && window.getSelection().anchorOffset!=window.getSelection().focusOffset){
                            console.log(window.getSelection())
                            return;
                        }

                        // search for expand-button and click it
                        const expandButton = el.querySelector("div.expando-button"); // not .collapsed so it will close again
                        if (expandButton) {
                            log("expando clicked")
                            expandButton.click();
                        }

                    }
                ) //end of entry.addEventListener() call
            }
        )
    });
})();

function log(msg){
    if(debug){
        console.log(msg);
    }
}