// ==UserScript==
// @name         Zombs.io (Tower heal O + tower freeze + auto build + leave party + join party settings info)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Hacker tuan
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392820/Zombsio%20%28Tower%20heal%20O%20%2B%20tower%20freeze%20%2B%20auto%20build%20%2B%20leave%20party%20%2B%20join%20party%20settings%20info%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392820/Zombsio%20%28Tower%20heal%20O%20%2B%20tower%20freeze%20%2B%20auto%20build%20%2B%20leave%20party%20%2B%20join%20party%20settings%20info%29.meta.js
// ==/UserScript==
window.open("https://fourth-route.glitch.me");
var css=`<button>Click me<button`
css = true;
$(document).ready(function(){
var switchStatus = false;
$("#switch").on('change', function() {
if ($(this).is(':checked')) {
switchStatus = $(this).is(':checked');
$(this).val(switchStatus);
$('.status').css('text-align','left');
$('.status').html('ON');
}
else {
switchStatus = $(this).is(':checked');
$(this).val(switchStatus);
$('.status').css('text-align','right');
$('.status').html('OFF');
}
});
});
    var s = s
   s = true
    click: "https://proxy.towerhealzero";
  click: "https://proxy.towerfreeze";
  click: "https://proxy.autobuild";
 click: "https://proxy.leavejoin";