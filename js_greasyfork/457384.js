// ==UserScript==
// @name         tenpo ko(host)
// @namespace    https://cohost.org/two/tagged/userscripts
// @version      0.2.2
// @description  adds tenpo ko emojis to cohost post/comment timestamps
// @author       @two
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @run-at       document-end
// @license      i'm not going to stop you
// @downloadURL https://update.greasyfork.org/scripts/457384/tenpo%20ko%28host%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457384/tenpo%20ko%28host%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            let parentele = mutation.target.parentElement.parentElement
            let ele = mutation.target.parentElement
            //parentele on post/comment timestamps is a <time> element, and ele is an <a> containing the timestamp text
            //so calculations are done on parentele and edits on ele
            if(ele.tagName=="TIME"){
                parentele=ele;
                //...but this ensures the script works if the order of elements is ever swapped
                //(also makes it work for the Cohost Corner timestamp, which has them in the other order)
            };
            //console.log(mutation);
            if(parentele.tagName=="TIME"){
                let thetimestamp = new Date(parentele.dateTime);
                //this is how you're meant to do it right?
                let thehours = thetimestamp.getUTCHours();
                if(thehours<6){
                    ele.innerText+=" 🔥";
                }else if(thehours<12){
                    ele.innerText+=" ☁";
                }else if(thehours<18){
                    ele.innerText+=" 💧";
                }else if(thehours<24){
                    //redundant check but avoids adding 🌱 when something goes wrong
                    ele.innerText+=" 🌱";
                };
            };
        };
    };
    let observer = new MutationObserver(callback);
    observer.observe(document,{characterData:true,subtree:true});
    //only the timestamp change events are characterData mutations. its very convenient
    //(so far as I can tell anyway)
})();