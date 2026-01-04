// ==UserScript==
// @name         PAWS OC Payouts
// @namespace    http://lonerider543.pythonanywhere.com/
// @version      1.1
// @description  Helper for OC payouts
// @author       lonerider543
// @match        https://www.torn.com/factions.php*
// @downloadURL https://update.greasyfork.org/scripts/458279/PAWS%20OC%20Payouts.user.js
// @updateURL https://update.greasyfork.org/scripts/458279/PAWS%20OC%20Payouts.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('.content-title').append('<div id="lone_links"></div>');
    $('#lone_links').append('<span id="lone_data_load" style="margin:5px; text-decoration:underline; cursor:pointer;">Banker - Load Data</span><br><br><input id="lone_data_input" style="width:200px; margin:5px;"></input>');
    $('#lone_data_load').on('click', function() {
        let data_input = $('#lone_data_input').val();
        let data = JSON.parse(data_input);

        $('#money').find('.depositor').each(function() {
            let name = $(this).find('.honor-text').text();
            let money = 0;
            if (name in data.money) {
                money = data.money[name];
            }
            if (money != 0) {
                $(this).find("input[data-type=money]").val(money)
            }
        });
    });
});