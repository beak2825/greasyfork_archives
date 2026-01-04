// ==UserScript==
// @name         kktix Summarize: Autocheck all checkboxes
// @namespace    kktix checkbox
// @version      1
// @description  automatically check  boxes 
// @author       You
// @match        https://kktix.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468770/kktix%20Summarize%3A%20Autocheck%20all%20checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/468770/kktix%20Summarize%3A%20Autocheck%20all%20checkboxes.meta.js
// ==/UserScript==

var person_agree_terms = document.getElementById("person_agree_terms");
person_agree_terms.checked = true;