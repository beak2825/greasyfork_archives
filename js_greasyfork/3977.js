// ==UserScript==
// @name       Orion Blog Extra
// @namespace  http://devtest.co.nz/
// @version    0.1
// @description  This very simple script will look for an element with an id of "userscript" and it will insert the contents exactly as is inside a script tag, then append the script to the body. This allows you to enter javascript in a plain text widget, which will get applied to the page. Neat!
// @include      http://blogs/*
// @copyright  2014+, You
// @downloadURL https://update.greasyfork.org/scripts/3977/Orion%20Blog%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/3977/Orion%20Blog%20Extra.meta.js
// ==/UserScript==
var el = document.createElement('script');
el.innerHTML = document.getElementById('userscript').innerHTML;
document.getElementById('userscript').style.display = "none";
document.body.appendChild(el);
