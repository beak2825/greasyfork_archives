// ==UserScript==
// @name         ov-chip saldo checker onthoudt chipkaart nummer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script dat je ingevoerde ov-chipkaart nummer onthoudt zodat je het bij een volgend bezoek uit een dropdown kan selecteren. Werkt alleen voor de Nederlandse ov-chipkaarten.
//               !!! gebruik dit script niet op een publieke computer want je ov chip nummer moet prive blijven.
// @author       You
// @match        https://www.ov-chipkaart.nl/home.htm
// @include      https://www.ov-chipkaart.nl/home.htm
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36470/ov-chip%20saldo%20checker%20onthoudt%20chipkaart%20nummer.user.js
// @updateURL https://update.greasyfork.org/scripts/36470/ov-chip%20saldo%20checker%20onthoudt%20chipkaart%20nummer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var LOCALSTORAGE_KEY = "ovchip.nl.tamper.ovhistory";
    var STORAGE_SEPERATOR = ',';

    var event = new CustomEvent("input", {
        //needed to trigger the dispathEvent:
        detail: {
            time: new Date(),
        },
        bubbles: true,
        cancelable: true
    });

    //add and fill the dropdown:
    var knownOvNrs = getKnownOvNrs();
    if (knownOvNrs.length > 0) {
        $('#saldocheckerlink div.module-creditCheckerLink')
            .prepend('<select id="ov-history" class="wm-field-list wm-field-dropdown"><option value="">Kies...</option></select>')
            .change(function() {
                var selectedValue = $("option:selected", this).val();
                fillInputs(selectedValue);
            });

        knownOvNrs.forEach(function(currentValue, index, arr) {
            $('#ov-history').append(new Option(currentValue, currentValue));
        });
    }

    //attach onFormSubmit
    $('#saldocheckerlink form').submit(function() {
        var inputs = $("input[type=text]", this);

        var valueJoined = "";
        for (var i = 0; i < inputs.length; i++) {
            if (valueJoined.length > 0) {
                valueJoined += ' ';
            }
            valueJoined += $(inputs[i]).val();
        }

        //add to localStorage if needed
        var existingOvNrs = getKnownOvNrs();
        if (valueJoined && existingOvNrs.indexOf(valueJoined) === -1) {
            //add if not found:
            existingOvNrs.push(valueJoined);
            localStorage.setItem(LOCALSTORAGE_KEY, existingOvNrs.join(STORAGE_SEPERATOR));
            console.log('Added: ', valueJoined);
        }
    });

    function fillInputs(value) {
        if (value) {
            var ovchip = value.split(' ');
            if (ovchip.length != 4) {
                console.log('ERROR: ov-chip value does not contain 4 parts: ' + value);
            } else {
                var inputs = $('#saldocheckerlink .module-creditCheckerLink form input[type=text]');
                for (var i = 0; i < ovchip.length; i++) {
                    $(inputs[i]).val(ovchip[i]);
                    inputs[i].dispatchEvent(event);
                }
            }
        }
    }

    //the localstorage value as array:
    function getKnownOvNrs() {
        var value = localStorage.getItem(LOCALSTORAGE_KEY);
        if (value !== null) {
            return value.split(STORAGE_SEPERATOR);
        }
        return [];
    }
})();