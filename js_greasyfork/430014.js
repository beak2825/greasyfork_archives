// ==UserScript==
// @name         AO3: Replace words17
// @namespace    https://greasyfork.org/en/users/798115
// @version      1.7
// @changelog    simplified script, automatically replaces old words w/o having to press a button, clarified directions
// @description  replace old words with new words
// @author       Zatzu
// @include      /https?://archiveofourown\.org/works/\d+/
// @grant        none
// @directions   'old word' is the word you want to replace
//               'new word' is the word you want to see instead
//               save script after editing, then refresh to see new words
//               you can add as many replacement instances as you'd like
//               important! - everything is case sensitive
//
//               example: change american spelling 'realize' to british spelling 'realise'
//
//               var replaced = $("body").html()
//               .replace(/realize/g,'realise')
//               ;$("body").html(replaced);
//
// @downloadURL https://update.greasyfork.org/scripts/430014/AO3%3A%20Replace%20words17.user.js
// @updateURL https://update.greasyfork.org/scripts/430014/AO3%3A%20Replace%20words17.meta.js
// ==/UserScript==

var replaced = $("body").html()
.replace(/Dean/g,'Diluc')
.replace(/Winchester/g,'Ragnvindr')
.replace(/Castiel/g,'Zhongli')
;$("body").html(replaced);