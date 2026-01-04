// ==UserScript==
// @name         Userscript Manager Detection
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A Code Snippet for detecting if the script is being ran in an Userscript Manager.
// @author       Taureon
// @include      *
// @grant        none
// @license      Unlicense
// ==/UserScript==

// Detect GreaseMonkey API objects
//data type: boolean
//true = It is being ran in an Userscript Manager
//false = It is being ran as a bookmarklet or it is being ran in an Userscript Manager that does not have GreaseMonkey API objects
var isInUserscriptContext = typeof GM === 'object' || typeof GM_info === 'object';

//example of using it
//alert(isInUserscriptContext ? 'I am being ran in an Userscript' : 'I am not being ran in an Userscript');