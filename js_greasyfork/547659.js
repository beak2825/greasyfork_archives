// ==UserScript==
// @name        YouTube enable fullscreen scroll
// @description Removes YouTube's fullscreen scroll disabling, i.e. you can scroll to the comments again in fullscreen.   
// @version     1.0.1
// @grant       none
// @namespace   https://lampe2020.de/
// @license     WTFPL
// @include     https://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/547659/YouTube%20enable%20fullscreen%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/547659/YouTube%20enable%20fullscreen%20scroll.meta.js
// ==/UserScript==

(()=>{
    const undeprecate = ()=>document.body.querySelectorAll("*").forEach(e => e.removeAttribute("deprecate-fullerscreen-ui"));
    document.addEventListener('DOMContentLoaded', undeprecate);
    document.addEventListener('load', undeprecate);
    document.addEventListener('fullscreenchange', undeprecate);
    undeprecate();
    console.info('%cLampe2020\'s fullscreen scroll undeprecation script is deprecated in favor of %chttps://update.greasyfork.org/scripts/547663/YouTube%20Restore%20Fullscreen%20Scrolling.user.js %c\n Yes, I know this sounds dumb, but the other script is better. ', 'font-size:2em;background-color:lightgreen;color:black;', 'font-size:2em;background-color:lightgreen;color:blue;', 'font-size:1em;background-color:lightgreen;color:black;');
})();