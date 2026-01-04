// ==UserScript==
// @name        Google News Dark Night Mode Theme - rough 
// @namespace   english
// @description Google News Dark Night Mode Theme - currently undergoing build
// @include     http*://*news.google*
// @version     1.2
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372111/Google%20News%20Dark%20Night%20Mode%20Theme%20-%20rough.user.js
// @updateURL https://update.greasyfork.org/scripts/372111/Google%20News%20Dark%20Night%20Mode%20Theme%20-%20rough.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                            html{    filter: invert(89%)hue-rotate(180deg)contrast(110%);}img{    filter: invert(110%)hue-rotate(180deg);}    ';
document.getElementsByTagName('head')[0].appendChild(style);



