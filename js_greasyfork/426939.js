// ==UserScript==
// @name         Hide emmet top bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Alt H
// @author       You
// @match      *://*/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426939/Hide%20emmet%20top%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/426939/Hide%20emmet%20top%20bar.meta.js
// ==/UserScript==

(function() {



document.addEventListener('keydown', logKey);

function logKey(e) {

if(e.code==='KeyH'&&e.altKey)
{

    document.querySelector("body > div.emmet-re-view > div.emmet-re-view__header > div > div.emmet-re-view__carbon").style.display='none'
    const eldisplay = document.querySelector("body > div.emmet-re-view > div.emmet-re-view__header > div").style.display
document.querySelector("body > div.emmet-re-view > div.emmet-re-view__header > div").style.display =  eldisplay === 'none' ? 'flex' : 'none';

console.log(document.querySelector("body > div.emmet-re-view > div.emmet-re-view__header > div").style.display)
}

}
window.addEventListener('beforeunload', function (e) {
document.removeEventListener('keydown', logKey);
});


})();