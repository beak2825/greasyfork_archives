// ==UserScript==
// @name         Address Autocomplete
// @namespace    http://tampermonkey.net/
// @version      0.1b
// @description  Adds an autocomplete search to client edit
// @author       Tyler
// @match        https://my.serviceautopilot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=serviceautopilot.com
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @require https://update.greasyfork.org/scripts/541933/1620646/Autocomplete%20Radar%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/541934/Address%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/541934/Address%20Autocomplete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $building;
    var $dropdown;
    $(document).arrive("#divPersonalInfo", function() {
        $('head').append('<link rel="stylesheet" href="https://js.radar.com/v4.5.3/radar.css" type="text/css" />');
        $("#divPersonalInfo").prepend(`
        <div style="display:flex"><div id='autocomplete' style="min-width:60%" /><select id='names' /></div>
        <table style="width:100%">
        <tr>
        <td><p id="tpEmail" /></td>
        <td><p id="tpPhones" /></td>
        <td><p id="tpNames" /></td>
        <td><p id="tpAddress" /></td>
        <td><p id="tpPostal" /></td>
        <td><p id="tpCity" /></td>
        <td><p id="tpState" /></td>
        </tr>
        </table>
            `);
        $("#names").hide();
        $("#names").on('change', function() {
            updateOutput( this.value );
        });
        function updateOutput(i) {
            var phones = "";
            var emails = "";
            var altNames = "";
            $.each($building.current_residents[i].phones, function() {
                phones += this.line_type + ": " + this.phone_number + "<br>";
            });
            $.each($building.current_residents[i].alternate_names, function() {
                altNames += this + "<br>";
            });
            $.each($building.current_residents[i].emails, function() {
                emails += this + "<br>";
            });
            if (phones) {
            $("#tpPhones").html(phones);
            }
            if (emails) {
            $("#tpEmail").html(emails);
            }
            $("#tpNames").html($building.current_residents[i].name + "<br>" + altNames);
            $("#tpAddress").html($building.street_line_1);
            $("#tpPostal").html($building.postal_code);
            $("#tpCity").html($building.city);
            $("#tpState").html($building.state_code);
        }
        Radar.initialize('prj_test_pk_afd5db0c60ad858793300b0cf6c2d135b47d705a');

        Radar.ui.autocomplete({
            container: 'autocomplete',
            countryCode: 'US',
            onSelection: (address) => {
                // do something with selected address
                //$('[data-bind="value: Address"]').val(address.number + " " +address.street);
                //$('[data-bind*="value: PostalCode"]').val(address.postalCode);
                //$('[data-bind*="value: City"]').val(address.city);
                //$('[data-bind*="value: City"]').focus();
                const query = new URLSearchParams({
                    street_line_1: address.number + " " + address.street,
                    street_line_2: '',
                    city: address.city,
                    postal_code: address.postalCode,
                    state_code: address.state,
                    country_code: address.country
                }).toString();

                $.ajax({
                    url: `https://api.trestleiq.com/3.1/location?${query}`,
                    type: "GET",
                    headers: {
                        'x-api-key': "WoiuA6fyhU94enywIoi4X6l8rmchDKHL8XnxM57n",
                        'accept': 'application/json'
                    },
                    success: function(result) {
                        $building = result;
                        console.log($building);
                        $("#names").empty();
                        $.each($building.current_residents, function(i) {
                            $("#names").append($("<option />").text(this.name).val(i));
                        });
                        $("#names").show();
                        updateOutput(0);
                    }
                });

            },
        });
    });
})();