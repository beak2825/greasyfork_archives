// ==UserScript==
// @name         Instagram easy play
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  easy play for instagram
// @author       You
// @match        https://www.instagram.com/reel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476824/Instagram%20easy%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/476824/Instagram%20easy%20play.meta.js
// ==/UserScript==

(function() {
    'use strict';

const btn = $(`
<span class="_aamy">
   <div>
      <div aria-disabled="false" role="button" style="cursor: pointer;" tabindex="0">
         <div class="x1i10hfl x6umtig x1b1mbwd xaqea5y xav7gou x9f619 xe8uvvx xdj266r x11i5rnm xat24cr x1mh8g0r x16tdsg8 x1hl2dhg xggy1nq x1a2a7pz x6s0dn4 xjbqb8w x1ejq31n xd10rxx x1sy0etr x17r0tee x1ypdohk x78zum5 xl56j7k x1y1aw1k x1sxyh0 xwib8y2 xurb0ha xcdnw81" role="button" tabindex="0">
            <div class="x6s0dn4 x78zum5 xdt5ytf xl56j7k">
               <svg fill="rgb(0,0,0)" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" stroke="rgb(0,0,0)">
                <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="SVGRepo_iconCarrier"> <g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/> <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/> </g> </g>
               </svg>
            </div>
         </div>
      </div>
   </div>
</span>`).click(function() {
    let vid = $('video')

    const muteBtn = $(`svg[aria-label="Audo is muted."]`).parents('button')

    if (muteBtn.length) {
        muteBtn[0].click()
    }

    vid[0].currentTime = 0;
    
    vid[0].play();
});

waitForElm().then(() => {
    $(`svg[aria-label="Save"]`).parents('section')[0].append(btn[0])
});
})();

function waitForElm() {
    return new Promise(resolve => {
        if ($(`svg[aria-label="Save"]`).length) {
            return resolve();
        }

        const observer = new MutationObserver(mutations => {
            if ($(`svg[aria-label="Save"]`).length) {
                observer.disconnect();
                resolve();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}