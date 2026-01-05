// ==UserScript==
// @name       priberam_nocopyright.tamper.js
// @version    0.75
// @description  Disable copyright notes in oncopy event
// @include      http://www.priberam.pt/*
// @author Thorsten Albrecht
// @copyright  2014, Thorsten Albrecht
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/4015
// @downloadURL https://update.greasyfork.org/scripts/3743/priberam_nocopyrighttamperjs.user.js
// @updateURL https://update.greasyfork.org/scripts/3743/priberam_nocopyrighttamperjs.meta.js
// ==/UserScript==   

//Changes
//- Migration to greasyfork

//Test if user script works (display a test button)
/*
$(document).ready(function() {
    $('body').append('<input type="button" value="Testbutton" id="testbutton">')    
    $("#testbutton").css("position", "fixed").css("top", 0).css("left", 0);
});
*/

//24.02.2014 disabling the addLink function to remove copyright notes on copy/paste
//beide Einträge sind wichtig
$(function(){
    function addLink(){}
    document.documentElement.oncopy = addLink;
});
