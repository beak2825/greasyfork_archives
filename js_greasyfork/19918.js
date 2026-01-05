// ==UserScript==
// @name         RAIN @ GSW login page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make webpage look more interesting
// @author       Jonathan Hobbs
// @match        https://rain.gsw.edu/
// @match        https://gsw.gabest.usg.edu/pls/B420/twbkwbis.P_WWWLogin
// @match        https://gsw.gabest.usg.edu/pls/B420/twbkwbis.P_ValLogin
// @match        https://gsw.gabest.usg.edu/pls/B420/zwbkreid.P_ReturnId
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/19918/RAIN%20%40%20GSW%20login%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/19918/RAIN%20%40%20GSW%20login%20page.meta.js
// ==/UserScript==

var bg_div = $('body');
if(bg_div.length == 1) {
    bg_div.css({
        'color' : '#FFFFFF',
        'background-repeat' : 'no-repeat', 
        'background-size' : 'cover',
        'background-image' : 'url(http://revelwallpapers.net/d/343443536D6C36317272716F6837716730474B64313943327A74686565773D3D/umbrella-in-the-summer-rain.jpg)'
    });
}
var form_div = $('table.infotexttable');
if(form_div.length == 1) {
    form_div.css({
        'background-color' : 'transparent',
        'color' : '#FFFFFF',
        'font-size' : '100%',
        'border-color' : 'white',
        'border-width' : 'thin'
    });
}