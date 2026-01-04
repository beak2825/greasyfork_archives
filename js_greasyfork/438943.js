// ==UserScript==
// @name         Youtube - No scroll to top on timestamps
// @namespace    q1k
// @version      1.3
// @description  Prevent Youtube scrolling to top when clicking timestamps in description or comments
// @author       q1k
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438943/Youtube%20-%20No%20scroll%20to%20top%20on%20timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/438943/Youtube%20-%20No%20scroll%20to%20top%20on%20timestamps.meta.js
// ==/UserScript==

var seconds=0;

function timestampToSeconds(t){
    let parts = t.split(':').reverse();
    if (parts.length<2){ return false; }
    seconds = 0;
    for(let i=0; i<parts.length; i++){
        switch (i) {
            case 0: seconds += (+parts[i]); break;
            case 1: seconds += (+parts[i])*60; break;
            case 2: seconds += (+parts[i])*60*60; break;
            case 3: seconds += (+parts[i])*60*60*24; break;
        }
    }
    return Number.isInteger(seconds);
}

document.addEventListener("click", function(e){
    if(e.target.tagName=="A"){
        if(timestampToSeconds(e.target.innerText)){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            movie_player.seekTo(seconds);
            return;
        }
    } else if(e.target.closest("a#endpoint")){/*chapters*/
        if(timestampToSeconds(e.target.closest("a#endpoint").querySelector("#details #time").innerText)){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            movie_player.seekTo(seconds);
            return;
        }
    }
}, {capture: true} );

