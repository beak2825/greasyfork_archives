// ==UserScript==
// @name         Twitter www
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  www
// @author       eggplants
// @homepage     https://github.com/eggplants
// @include      https://twitter.com/*
// @exclude      https://twitter.com/compose/tweet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431906/Twitter%20www.user.js
// @updateURL https://update.greasyfork.org/scripts/431906/Twitter%20www.meta.js
// ==/UserScript==

setInterval(()=>{
    document.querySelectorAll('span').forEach(
        x=>{
            if (typeof(x.innerText)==="string"){
                x.innerText="ｗ".repeat(x.innerText.length)
               }
            }
        )
    }, 500
)