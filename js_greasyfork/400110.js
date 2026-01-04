// ==UserScript==
// @name         Scavenge Script - Plemiona dla zdrojka
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/game.php*mode=scavenge*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400110/Scavenge%20Script%20-%20Plemiona%20dla%20zdrojka.user.js
// @updateURL https://update.greasyfork.org/scripts/400110/Scavenge%20Script%20-%20Plemiona%20dla%20zdrojka.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scavengeState = {};
    if(typeof sessionStorage.scavengeState != "undefined") {
        scavengeState = JSON.parse(sessionStorage.scavengeState);
    } else {
        scavengeState.units = [];
    }

    $('.unitsInput').each(function() {
        $(this).after($('<input type="checkbox" data-unit="'+ $(this).attr('name') +'"/>'));
    });

    var input = $('<input/>', {id: 'scavengeAuto', type: 'submit', value: 'Start', style:'width:100%;'});
    var select = $('<select/>', {id: 'scavengeLimit', style:'width:100%;'});
    var options = {11200: '2800 - 8h', 8000: '2000 - 6h', 4800: '1200 - 4h', 1900: '475 - 2h', 560: '140 - 1h'};
    $.each(options, function(k,v) {
        $('<option/>', {value: k, text: v}).appendTo(select);
    });

    if(scavengeState.limit) {
        $(select).val(scavengeState.limit);
    } else {
        $(select).val(11200);
    }

    $('table.candidate-squad-widget th:last').after($('<th/>'));
    $('table.candidate-squad-widget td:last').after($('<td/>').append(input).append(select));

    var limit = () => { return parseInt($(select).val()); };
    var getMultiplier = () => { return Array(null, 7.5, 3, 1.5, 1)[$('.scavenge-option .free_send_button:not(.btn-disabled)').length]; };
    var getCap = (unit) => { return {spear: 25, sword: 15, axe: 10, archer:10, light: 80, marcher: 50, heavy: 50, knight: 100}[unit]; };


    function processOne(scavenge_option) {
        if(scavenge_option.length) {
            var cap = 0;
            $('input[data-unit]:checked').each(function(k,v) {
                var units = parseInt($(this).siblings('.units-entry-all').text().replace('(', '').replace(')', ''));
                cap += units * getCap($(this).attr('data-unit'));
            });

            var sum = 0;
            $('input[data-unit]:checked').each(function(k,v) {
                var input = $(this).siblings('.unitsInput');
                var units = parseInt($(this).siblings('.units-entry-all').text().replace('(', '').replace(')', ''));
                var calculated = Math.ceil(units*((limit()*getMultiplier()/cap)));
                var value = (calculated < units) ? calculated : units;

                $(input).val(value).trigger('change');
                sum += value;
            });
            if(sum >= 10) {
                $('.free_send_button', scavenge_option).click();
                setTimeout(function() {
                    processOne($('.scavenge-option .free_send_button:not(.btn-disabled):last').parents('.scavenge-option'));
                }, 350);
            }
        }
    }

    processOne($('.scavenge-option .free_send_button:not(.btn-disabled):last').parents('.scavenge-option'));

    $(scavengeState.units).each(function() {
        $('input[data-unit="'+this+'"]').prop('checked', true);
    });

    function parseData() {
        sessionStorage.scavengeState = JSON.stringify(scavengeState);
    }


    $(select).bind('change', function() {
        scavengeState.limit = $(this).val();
        parseData();
    });


    $('input[data-unit]').bind('input', function() {
        var data = $(this).attr('data-unit');
        var index = scavengeState.units.indexOf(data);
        if (index !== -1) {
            scavengeState.units.splice(index, 1);
        } else {
            scavengeState.units.push(data);
        }

        parseData();
    });

    $(input).bind('click', function(e) {
        processOne($('.scavenge-option .free_send_button:not(.btn-disabled):last').parents('.scavenge-option'));
    });
})();