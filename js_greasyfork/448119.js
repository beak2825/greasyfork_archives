// ==UserScript==
// @name         ttv EmoteRacer autoplay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automatically play the game
// @author       You
// @match        *://emote-racer.herokuapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=herokuapp.com
// @grant        none
// @license MIT 
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448119/ttv%20EmoteRacer%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/448119/ttv%20EmoteRacer%20autoplay.meta.js
// ==/UserScript==

/* eslint-disable */

let callback = null;

let getEmoteName=(e,t) => (window.getEmotes().forEach(function(n){e==n.id&&(t=n.name)}),t)


const addEventListener = HTMLElement.prototype.addEventListener;

HTMLElement.prototype.addEventListener = function (type, listener, options) {
    if (type === 'keypress') {
        callback = listener;
    }
    addEventListener.call(this, type, listener, options);
};

document.addEventListener("DOMContentLoaded", () => {
    let init = false;
    setInterval(() => {
        let element = document.getElementsByClassName("emote-img")
        if(element.constructor == HTMLCollection && element[0] && !init ) {
            init = true
            let txtinput = document.getElementsByClassName("inputEmote")[0];
            let firstid = element[0].src.split("/").reverse()[1];
            let name = getEmoteName(firstid)
            txtinput.value = name
            setTimeout(() => {
                callback.call(null, {key:"Enter"})
            }, 1000)
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === "attributes") {
                        let target = mutation.target
                        let emoteid =  element[0].src.split("/").reverse()[1];
                        let name = getEmoteName(emoteid)
                        txtinput.value = name
                        setTimeout(() => {
                            callback.call(null, {key:"Enter"})
                        }, 1000)
                    }
                });
            });
            observer.observe(element[0], {
                attributes: true,
                childList: true,
                characterData: true
            });
        }
    })
})