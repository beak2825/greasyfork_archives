// ==UserScript==
// @name The West Script Button
// @namespace *
// @include http*://*.the-west.*/game.php*
// @name Tool
// @description Useful tools for The West!
// @version	1
// @author Stewue
// @downloadURL https://update.greasyfork.org/scripts/19011/The%20West%20Script%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/19011/The%20West%20Script%20Button.meta.js
// ==/UserScript==

$(document).ready(function()
{
var newfunction = String(EscapeWindow.open);
newfunction = 'EscapeWindow.open='+newfunction+';';
newfunction = newfunction.replace(/\.setSize\(240\,325\)/g, ".setSize(240, 365)");
newfunction = newfunction.replace(/window\.open\(Game\.forumURL,'wnd'\+\(new Date\)\.getTime\(\)\);/g, "(window.open(Game.forumURL, 'wnd' + new Date).getTime());}],['Script', function() {TheWestApi.open();");
eval(newfunction);
window.setTimeout("$('#ui_scripts').css({'display' : 'none'});", 10000);
}); 