// ==UserScript==
// @name         I want mo scrubs
// @namespace    https://synthetic.garden
// @version      0.2
// @description  A scrub is the act of skipping through a track for free
// @author       Twilight Sparkle
// @match        https://soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/465360/I%20want%20mo%20scrubs.user.js
// @updateURL https://update.greasyfork.org/scripts/465360/I%20want%20mo%20scrubs.meta.js
// ==/UserScript==

(function() {
    let shadowJsonp;
    let false_push;

    let push = function(c) {
        console.log(c)
        try{
           let scrubBlocker;
           if((scrubBlocker = Object.entries(c[1]).filter(m => m[1].toString().includes('shouldBlockScrubbing:'))).length) {
                console.log("replacing scrub blocker", scrubBlocker[0][0]);
                c[1][scrubBlocker[0][0]] = (function (e,t,n) {
                    e.exports = {shouldBlockScrubbing: (x)=>false, pauseAndPromptSignup: (x)=>false} // TODO: automatically generate instead of hardcoding, just in case
                })
                console.log(c[scrubBlocker[0][0]])
           }
        } catch(e) {debugger;console.error(e)}
        return (false_push?false_push:Array.prototype.push).bind(shadowJsonp)(c);
    }
    push.bind = ()=>{} // sigil of protection. this function is never called but if you remove this line it breaks

    Object.defineProperty(window, 'webpackJsonp', {
        set: function(wpJp) {
            if(wpJp?.length === 0 && !wpJp?.fuck) {
                Object.defineProperty(wpJp, 'push', {
                    set: function(f) {
                        false_push = f
                    }, get: ()=>push
                });
                wpJp.fuck = true
            }
            shadowJsonp = wpJp;
        },
        get: () => shadowJsonp
    })
})();