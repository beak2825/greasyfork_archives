// ==UserScript==
// @name         Com'Count
// @version      1.0.2
// @description  Permet de changer manuellement le nombre de messages non lus.
// @author       MockingJay
// @match        https://www.dreadcast.net/Main
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      http://creativecommons.org/licenses/by-nc-nd/4.0/
// @namespace https://greasyfork.org/users/30975
// @downloadURL https://update.greasyfork.org/scripts/395938/Com%27Count.user.js
// @updateURL https://update.greasyfork.org/scripts/395938/Com%27Count.meta.js
// ==/UserScript==

$(document).ready(function() {

    $("#zone_messagerie > .grid.grid-title > .icon").before('<div class="comcount btnTxt link" id="comcountInc" style="top: 1px;"><p>+1</p></div>');
    $("#comcountInc").after('<div class="comcount btnTxt link" id="comcountRes" style="top: 15px;"><p>0</p></div>');
    $("#comcountRes").after('<div class="comcount btnTxt link" id="comcountDec" style="top: 29px;"><p>-1</p></div>');

    $(".comcount").css({
        display: "block",
        position: "absolute",
        left: "-16px",
        width: "10px",
        height: "10px",
        padding: "0",
    });
    $(".comcount > p").css({
        "line-height": "12px",
        "font-size": "10px",
        margin: "0",
    });

    $("#comcountInc").click(function() {
        $("#zone_messagerie").trigger({ type: "nouveauMessage", quantity: 1})
    });
    $("#comcountRes").click(function() {
        $("#zone_messagerie").trigger({ type: "nouveauMessage", quantity: -parseInt($("#zone_messagerie > .grid > .icon > .nbrmessage").text()||0)})
    });
    $("#comcountDec").click(function() {
        $("#zone_messagerie").trigger({ type: "nouveauMessage", quantity: -1})
    });

});