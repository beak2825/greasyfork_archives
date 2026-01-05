// ==UserScript==
// @name            HF News Auto Fill
// @namespace       Snorlax
// @description     Fills out textarea with the form
// @include         http://www.hackforums.net/showthread.php?tid=4992602*
// @include         http://hackforums.net/showthread.php?tid=4992602*
// @version         1.2
// @downloadURL https://update.greasyfork.org/scripts/13974/HF%20News%20Auto%20Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/13974/HF%20News%20Auto%20Fill.meta.js
// ==/UserScript==

text = "[b][color=#00BFFF]Briefly describe the event:[/color][/b]\n[b][color=#00BFFF]Why is it newsworthy:[/color][/b]\n[b][color=#00BFFF]Any important links:[/color][/b]";
    
document.getElementById('message').value = text;