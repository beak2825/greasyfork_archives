// ==UserScript==
// @name         AO3: Replace words
// @namespace    https://greasyfork.org/en/users/65036
// @version      2.0
// @changelog    simplified script, automatically replaces old words w/o having to press a button, clarified directions
// @description  replace old words with new words
// @author       romantium
// @include https://mopoga.com/play-degrees-of-lewdity/
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
// @downloadURL https://update.greasyfork.org/scripts/439647/AO3%3A%20Replace%20words.user.js
// @updateURL https://update.greasyfork.org/scripts/439647/AO3%3A%20Replace%20words.meta.js
// ==/UserScript==
 
var replaced = $("body").html()
.replace(/Robin/g,'Punz')
.replace(/Whitney/g,'Sapnap')
.replace(/Eden/g,'Corpse')
.replace(/Kylar/g,'Wilbur')
.replace(/Avery/g,'Techno')
.replace(/Black Wolf/g,'Fundy')
.replace(/Bailey/g,'George')
.replace(/River/g,'Niki')
.replace(/Mason/g,'Bad')
.replace(/Morgan/g,'GeorgeHD')
.replace(/Niki/g,'Michael')
.replace(/Remy/g,'Puffy')
.replace(/Leighton/g,'Sam')
.replace(/Landry/g,'Tina')
.replace(/Sam/g,'Alyssa')
.replace(/Briar/g,'Quackity')
.replace(/Harper/g,'Jschlatt')
.replace(/Jordan/g,'Callahan')
.replace(/Darryl/g,'Philza')
.replace(/Charlie/g,'Eret')
.replace(/Sydney/g,'Karl')
.replace(/Alex/g,'Foolish')
;$("body").html(replaced);