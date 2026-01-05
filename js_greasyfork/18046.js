// ==UserScript==
// @name        Bum Marks
// @namespace   lexscript
// @description Changes Cutie Marks into Bum Marks
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18046/Bum%20Marks.user.js
// @updateURL https://update.greasyfork.org/scripts/18046/Bum%20Marks.meta.js
// ==/UserScript==

//document.querySelectorAll("input[value='Cutie Marks']")[0].value = "Bum Marks"
a = document.getElementsByTagName('body')[0];
a.innerHTML = a.innerHTML.replace(new RegExp("Cutie Mark", 'g'), "Bum Mark");