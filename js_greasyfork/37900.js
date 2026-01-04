// ==UserScript==
// @name           9gag.com video controls on hover (including Firefox new Tab fix)
// @namespace      exzentrik.net
// @description    Show video controls on mouse hover, fixes the Firefox-Issue of opening an empty new tab on click. 
// @include        https://9gag.com/*
// @grant          none
// @version        0.0.2
// @downloadURL https://update.greasyfork.org/scripts/37900/9gagcom%20video%20controls%20on%20hover%20%28including%20Firefox%20new%20Tab%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/37900/9gagcom%20video%20controls%20on%20hover%20%28including%20Firefox%20new%20Tab%20fix%29.meta.js
// ==/UserScript==

document.onmouseover = function(e){
 if (e.target.tagName == 'VIDEO'){
  e.target.setAttribute("controls", true);
  e.target.parentNode.parentNode.removeAttribute("target");
 }
};