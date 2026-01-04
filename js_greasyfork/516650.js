// ==UserScript==
// @name         Fullscreen 제발
// @name:kim
// @match  *://*/*
// @version      0.2
// @description A simple float button for entering fullscreen.
// @description:kim
// @noframes
// @license CC0
// @namespace https://greasyfork.org/users/123506
// @downloadURL https://update.greasyfork.org/scripts/516650/Fullscreen%20%EC%A0%9C%EB%B0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/516650/Fullscreen%20%EC%A0%9C%EB%B0%9C.meta.js
// ==/UserScript==
'use strict';
document.body.insertAdjacentHTML("afterbegin",'<div id="b0n" style="background-color: transparent; position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; opacity: 0; z-index: 2147483647"><svg width="24" height="24" style="margin: auto;"><path d="M7,14L5,14v5h5v-2L7,17v-3zM5,10h2L7,7h3L10,5L5,5v5zM17,17h-3v2h5v-5h-2v3zM14,5v2h3v3h2L19,5h-5z"/></svg></div>');
var btn=document.getElementById("b0n");
var reF=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;
var action=function(){
    reF.call(document.documentElement);
    btn.remove();
}
btn.onclick=action;