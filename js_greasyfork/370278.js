// ==UserScript==
// @name         Blockchain Cuties Gas Price Tracker
// @version      0.81
// @description  a small script for Blockchain Cuties to provide an up to date info on Gas Prices
// @author       VeRychard  <me@verychard.com>
// @icon         http://hyperfocus.net/darkcuties_logo.png
// @match        https://blockchaincuties.co/*
// @match        https://blockchaincuties.com/*
// @grant        none
// @namespace https://greasyfork.org/users/193828
// @downloadURL https://update.greasyfork.org/scripts/370278/Blockchain%20Cuties%20Gas%20Price%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/370278/Blockchain%20Cuties%20Gas%20Price%20Tracker.meta.js
// ==/UserScript==
// @require http://code.jquery.com/jquery-latest.js
(function() {
    'use strict';
    var safeLow = '';
    var standard = '';
    var currentDateTime = '';
    var lastUpdated = '';
    function getGasPrice() {
        $.ajax({
            url: 'https://ethgasstation.info/json/ethgasAPI.json',
            type: 'GET',
            success: function(res) {
                safeLow = res.safeLow / 10;
                standard = res.average / 10;
                currentDateTime = new Date();
                lastUpdated = ("0"+currentDateTime.getHours()).slice(-2) + ":"+ ("0"+currentDateTime.getMinutes()).slice(-2) + ":" + ("0"+currentDateTime.getSeconds()).slice(-2);
                if($('.etherGasPrices').length === 0) {
                    $('body').append('<div class="etherGasPrices" style="height: 150px;position:fixed;right: 20px;top: calc(50% - 75px);width: 160px;padding: 15px;color: #CBCBCB;background: rgba(89, 89, 89, .5);border-radius: 5px;"><h3>Ξ Gas Price</h3><div class="safeLow">SafeLow: <span id="slVal">' + safeLow + '</span></div><div class="average">Standard: <span id="stVal">' + standard + '</span></div><div class="gasUpdated text-center">'+lastUpdated+'</div></div>');
                }else{
                 $('#slVal').val(safeLow);
                 $('#stVal').val(standard);
                 $('.gasUpdated').val(lastUpdated);
                }
            }});
    }
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

   window.addEventListener("load", function(event) {
        getGasPrice();
    });
})();