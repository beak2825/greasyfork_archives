// ==UserScript==
// @name            HF News Auto Fill
// @namespace       Snorlax
// @description     Fills out textarea with the form
// @include         https://www.hackforums.net/showthread.php?tid=5470739*
// @include         https://hackforums.net/showthread.php?tid=5470739*
// @version         1.2
// @downloadURL https://update.greasyfork.org/scripts/31261/HF%20News%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/31261/HF%20News%20Auto%20Fill.meta.js
// ==/UserScript==

text = "[b][color=#00e4ff]Briefly describe the event:[/color][/b]\n[b][color=#00e4ff]Any important links:[/color][/b]";
    
document.getElementById('message').value = text;