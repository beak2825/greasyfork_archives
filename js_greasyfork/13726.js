// ==UserScript==
// @name         Zoe B Cullen 1
// @version      0.1
// @description  Zoe B Cullen - Working Relationship 6
// @author       saqfish
// @match        https://www.mturkcontent.com/dynami*
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @namespace https://greasyfork.org/users/13769
// @downloadURL https://update.greasyfork.org/scripts/13726/Zoe%20B%20Cullen%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13726/Zoe%20B%20Cullen%201.meta.js
// ==/UserScript==

 $('.panel-body').hide();
 $('#Survey > fieldset > fieldset').hide();

$('div.panel-heading').click(function() {
    
    if($('.panel-body').is(":visible")){
        $('.panel-body').hide();
        $('#Survey > fieldset > fieldset').hide();
    }else{
        $('.panel-body').show();
        $('#Survey > fieldset > fieldset').show();
    }
});