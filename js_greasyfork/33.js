// ==UserScript==
// @name            Wikipedia+1
// @namespace       http://mozilla.status.net/loucypher
// @description     Add Google+1 button to Wikipedia articles
// @author          LouCypher
// @license         public domain
// @include         http://*.wikipedia.org/wiki/*
// @exclude         http://*.wikipedia.org/wiki/Talk:*
// @version 0.0.1.20140630034959
// @downloadURL https://update.greasyfork.org/scripts/33/Wikipedia%2B1.user.js
// @updateURL https://update.greasyfork.org/scripts/33/Wikipedia%2B1.meta.js
// ==/UserScript==

let isArticle = wrappedJSObject.wgIsArticle;
if (!isArticle) return;
let script = document.createElement("script");
script.type = "text/javascript";
script.src = "http://apis.google.com/js/plusone.js";
document.querySelector("head").appendChild(script);
let body = document.querySelector("#content > #bodyContent");
let div = body.insertBefore(document.createElement("div"), body.firstChild);
div.style.cssFloat = "right";
div.appendChild(document.createElement("g:plusone"));
