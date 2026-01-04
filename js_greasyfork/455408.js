// ==UserScript==
// @name         copy youtube video current time url(in right click menu)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  use it in right click menu
// @author       You
// @include      https://www.youtube.com/watch?v=*
// @include      https://www.youtube.com/watch?app=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ik4.es
// @run-at       context-menu
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455408/copy%20youtube%20video%20current%20time%20url%28in%20right%20click%20menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455408/copy%20youtube%20video%20current%20time%20url%28in%20right%20click%20menu%29.meta.js
// ==/UserScript==

(function() {
    var url= window.location.href;
    url=url.replace('https://www.youtube.com/watch?v=', 'https://youtu.be/');
    var time= document.getElementById("movie_player").getCurrentTime();
    time=~~time;
    let text = url.concat('?t=',time);
    copyContent(text);

})();

async function copyContent(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
        /* Resolved - text copied to clipboard successfully */
    } catch (err) {
        console.error('Failed to copy: ', err);
        /* Rejected - text failed to copy to the clipboard */
    }
}
