// ==UserScript==
// @name        Force language for Firefox spellchecker
// @description Forces language (used by Firefox spellchecker) in textareas and input text fields
// @namespace   Firefox scripts
// @include     *
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11900/Force%20language%20for%20Firefox%20spellchecker.user.js
// @updateURL https://update.greasyfork.org/scripts/11900/Force%20language%20for%20Firefox%20spellchecker.meta.js
// ==/UserScript==

var forcedLang = 'pl';

var i;
var tas = document.getElementsByTagName('textarea');
for(i=0; i<tas.length; ++i)
{
  tas[i].setAttribute('lang', forcedLang);
}
var ins = document.getElementsByTagName('input');
for(i=0; i<ins.length; ++i)
{
  if(ins[i].type.toLowerCase() == 'text')
    ins[i].setAttribute('lang', forcedLang);
}
