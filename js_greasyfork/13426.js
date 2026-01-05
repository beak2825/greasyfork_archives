// ==UserScript==
// @name         Marcheaza filmele cu TS
// @namespace    http://torrentsmd.com/
// @version      1.2
// @description  marcheaza cu rosu filmele cu audio telesync
// @author       drakulaboy
// @include      *torrentsmd.*/browse.php*
// @include      *torrentsmd.*/search.php*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.4.js
// @downloadURL https://update.greasyfork.org/scripts/13426/Marcheaza%20filmele%20cu%20TS.user.js
// @updateURL https://update.greasyfork.org/scripts/13426/Marcheaza%20filmele%20cu%20TS.meta.js
// ==/UserScript==
/* jshint -W097 */
$(function() {
var header = document.querySelectorAll('.tableTorrents > tbody > tr:nth-child(1) > td.colhead')[1];
if (header) {
    var listItem = document.createElement('a');
    var text = 'Marchează TS';
    var clicker = document.createElement('button');
    clicker.onclick = function(ajaxrequest) {
        var items = $('.tableTorrents > tbody > tr > td:nth-child(2) > a').filter(":contains('BDRip'), :contains('DVDRip'), :contains('HDTVRip'), :contains('TVRip'), :contains('WEBRip'), :contains('WEB-DL')");
        Array.prototype.forEach.call(items, function(el, i) {
           //setTimeout(function() {
                function request() {
                    $.ajax({
                        url: el,
                        type: 'GET',
                    }).done(function(responseText) {
                        var titlu = responseText.match(/Denumire<\/b>:(.*)</)[1];
                        var audio = responseText.match(/(с TS|Звук с TS|есть реклама|o voce|одноголосое|хардсаб|două voci|звук с TS|китайские субтитры)/);
                        if (audio) {
                            $(el).css('color', 'red');
                        }
                        console.log('Denumire: ' + titlu);
                        console.log('Azvucika: ' + audio);
                        console.log('***********************************');
                    });
                }
                request();
            //}, 100 + (i * 500));
        });
        return false;
    };
    clicker.setAttribute('style', 'font-size: 80%; cursor: pointer;');
    clicker.setAttribute('title', 'Marchează filmele cu audio TeleSync');
    clicker.innerHTML = text;
    listItem.appendChild(clicker);
    header.appendChild(listItem);
}
});