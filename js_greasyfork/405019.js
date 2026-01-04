// ==UserScript==
// @name         Ready for Take off
// @namespace    el_professor_takeoff
// @version      0.1.1
// @description  Make foreign stock available on travel page
// @author       El_Profesor
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      alwaysdata.net
// @downloadURL https://update.greasyfork.org/scripts/405019/Ready%20for%20Take%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/405019/Ready%20for%20Take%20off.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sortFunction(a, b) {
        if (a['price'] === b['price']) {
            return 0;
        }
        else {
            return (a['price'] < b['price']) ? -1 : 1;
        }
    }

    const formatter = new Intl.NumberFormat('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits: 0});

    GM_addStyle('#takeoffWrapper { background: #fff; width: 100%; float: left; margin-top: 25px; border-radius: 5px;}');
    GM_addStyle('#takeoff{ padding: 10px;}');
    GM_addStyle('#takeoff h3{ padding: 10px; margin-bottom: 0;}');
    GM_addStyle('#takeoff small{ display: block; text-align: right; margin-bottom:5px; font-style: italic;}');
    GM_addStyle('.travel-table  { padding: 10px; }');
    GM_addStyle('.travel-table table { width: 100%; }');
    GM_addStyle('.travel-table tr { border-top: 1px solid #000;}');
    GM_addStyle('.travel-table tr:first-child { border-top: 0;}');
    GM_addStyle('.travel-table tr:nth-child(even) { background-color: #f1f1f1;}');
    GM_addStyle('.travel-table th,  .travel-table td { width: 33%; padding: 5px 0 !important;}');
    GM_addStyle('.travel-table th { font-weight: 900;  }');
    GM_addStyle('.travel-table td { font-weight: 300; }');
    GM_addStyle('.travel-table .to-right {text-align: right; }');
    GM_addStyle('.travel-table .to-left {text-align: left; }');
    GM_addStyle('.arson{ padding: 10px;}');
    GM_addStyle('#takeoffWrapper .footer { width:100%; font-weight: 600; text-align: center; background: #272B30; color: #fff; padding: 5px; border-radius: 0 0 5px 5px;}');
    GM_addStyle('#takeoffWrapper .footer a{  color: #fff;}');
    GM_addStyle('#takeoff * {box-sizing: border-box}');
    GM_addStyle('.tab {float: left;border: 1px solid #ccc;background-color: #f1f1f1;width: 30%;}');
    GM_addStyle('.tab button {display: block;background-color: inherit;color: black;padding: 22px 16px;width: 100%;border: none;outline: none;text-align: left;cursor: pointer;transition: 0.3s;}');
    GM_addStyle('.tab button:hover {background-color: #ddd;}');
    GM_addStyle('.tab button.active {background-color: #ccc;}');
    GM_addStyle('.tabcontent {float: left;padding: 10px;width: 70%;border-left: none;}');

    if (window.location.href == 'https://www.torn.com/travelagency.php') {
        $('.content-wrapper').append('<div id="takeoffWrapper"><div id="takeoff"><div class="tab">' +
            '<button id="defaultOpen" class="tablinks" setid="Mexico">Mexico</button>' +
            '<button class="tablinks" setid="Caymanislands">Cayman Islands</button>' +
            '<button class="tablinks" setid="Canada">Canada</button>' +
            '<button class="tablinks" setid="Hawaii">Hawaii</button>' +
            '<button class="tablinks" setid="Unitedkingdom">United Kingdom</button>' +
            '<button class="tablinks" setid="Argentina">Argentina</button>' +
            '<button class="tablinks" setid="Switzerland">Switzerland</button>' +
            '<button class="tablinks" setid="Japan">Japan</button>' +
            '<button class="tablinks" setid="China">China</button>' +
            '<button class="tablinks" setid="Uae">UAE</button>' +
            '<button class="tablinks" setid="Southafrica">South Africa</button>' +
            '</div>' +
            '<div id="Mexico" class="tabcontent"><h3>Mexico</h3></div>' +
            '<div id="Caymanislands" class="tabcontent"><h3>Cayman Islands</h3></div>' +
            '<div id="Canada" class="tabcontent"><h3>Canada</h3></div>' +
            '<div id="Hawaii" class="tabcontent"><h3>Hawaii</h3></div>' +
            '<div id="Unitedkingdom" class="tabcontent"><h3>United Kingdom</h3></div>' +
            '<div id="Argentina" class="tabcontent"><h3>Argentina</h3></div>' +
            '<div id="Switzerland" class="tabcontent"><h3>Switzerland</h3></div>' +
            '<div id="Japan" class="tabcontent"><h3>Japan</h3></div>' +
            '<div id="China" class="tabcontent"><h3>China</h3></div>' +
            '<div id="Uae" class="tabcontent"><h3>UAE</h3></div>' +
            '<div id="Southafrica" class="tabcontent"><h3>South Africa</h3></div></div>' +
            '<div class="clear arson">This add-on uses data from Stocks abroad open database please <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16163704&b=0&a=0" target="_blank">check the thread</a> and see how we can all benefit'+
            'please download for even more accurate data</div><div class="footer">Sponsored by <a href="https://italianlotto.eu">ITALIAN LOTTO</a></div></div>');


        $('.tablinks').click(function (evt) {
            var cityName = $(this).attr('setid');
            var i, tabcontent, tablinks;
            tabcontent = $(".tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = $(".tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            $('#' + cityName).css('display', 'block');
            evt.currentTarget.className += " active";

            if (cityName == 'Caymanislands')
                cityName = 'cayman';

            if (cityName == 'Unitedkingdom')
                cityName = 'uk';
            if (cityName == 'Southafrica')
                cityName = 'south-africa';

            $('.raceway.' + cityName.toLowerCase()).trigger('click');
        });

        $('#defaultOpen').trigger('click');

        var content;
        var mexico = [];
        var southafrica = [];
        var argentina = [];
        var canada = [];
        var switzerland = [];
        var unitedkingdom = [];
        var china = [];
        var japan = [];
        var hawaii = [];
        var uae = [];
        var caymanislands = [];

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://yata.alwaysdata.net/bazaar/abroad/export/",
            onload: function (response) {
                content = $.parseJSON(response.responseText);
                var items = content.stocks;

                items.forEach(function (item) {
                    if (item.country_name == 'Mexico')
                        mexico[item.item_id] = item;
                    if (item.country_name == 'South Africa')
                        southafrica[item.item_id] = item;
                    if (item.country_name == 'Argentina')
                        argentina[item.item_id] = item;
                    if (item.country_name == 'Canada')
                        canada[item.item_id] = item;
                    if (item.country_name == 'Switzerland')
                        switzerland[item.item_id] = item;
                    if (item.country_name == 'United Kingdom')
                        unitedkingdom[item.item_id] = item;
                    if (item.country_name == 'China')
                        china[item.item_id] = item;
                    if (item.country_name == 'Japan')
                        japan[item.item_id] = item;
                    if (item.country_name == 'Hawaii')
                        hawaii[item.item_id] = item;
                    if (item.country_name == 'UAE')
                        uae[item.item_id] = item;
                    if (item.country_name == 'Cayman Islands')
                        caymanislands[item.item_id] = item;
                });

                mexico.sort(sortFunction);
                caymanislands.sort(sortFunction);
                southafrica.sort(sortFunction);
                argentina.sort(sortFunction);
                canada.sort(sortFunction);
                switzerland.sort(sortFunction);
                unitedkingdom.sort(sortFunction);
                china.sort(sortFunction);
                japan.sort(sortFunction);
                hawaii.sort(sortFunction);
                uae.sort(sortFunction);
                caymanislands.sort(sortFunction);
                var mexicoTable = '<div id="mexicoTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right last">Stock</th></tr>';
                mexico.forEach(function (item) {
                    mexicoTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                mexicoTable += '</table></div>';
                var caymanislandsTable = '<div id="caymanislandsTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                caymanislands.forEach(function (item) {
                    caymanislandsTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                caymanislandsTable += '</table></div>';
                var canadaTable = '<div id="canadaTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                canada.forEach(function (item) {
                    canadaTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                caymanislandsTable += '</table></div>';
                var hawaiiTable = '<div id="hawaiiTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                hawaii.forEach(function (item) {
                    hawaiiTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                hawaiiTable += '</table></div>';
                var unitedkingdomTable = '<div id="unitedkingdomTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                unitedkingdom.forEach(function (item) {
                    unitedkingdomTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                unitedkingdomTable += '</table></div>';
                var argentinaTable = '<div id="argentinaTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                argentina.forEach(function (item) {
                    argentinaTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                argentinaTable += '</table></div>';
                var switzerlandTable = '<div id="switzerlandTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                switzerland.forEach(function (item) {
                    switzerlandTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                switzerlandTable += '</table></div>';
                var japanTable = '<div id="japanTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                japan.forEach(function (item) {
                    japanTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                japanTable += '</table></div>';
                var chinaTable = '<div id="chinaTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                china.forEach(function (item) {
                    chinaTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                chinaTable += '</table></div>';
                var uaeTable = '<div id="uaeTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                uae.forEach(function (item) {
                    uaeTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                uaeTable += '</table></div>';
                var southafricaTable = '<div id="southafricaTable" class="travel-table"><table><tr><th class="to-left">Item</th><th class="to-right">Price</th><th class="to-right">Stock</th></tr>';
                southafrica.forEach(function (item) {
                    southafricaTable += '<tr><td>' + item.item_name + '</td><td class="to-right">' + formatter.format(item.abroad_cost) + '</td><td class="to-right">' + item.abroad_quantity + '</td>';
                });
                southafricaTable += '</table></div>';

                $('#Mexico').append(mexicoTable);
                $('#Caymanislands').append(caymanislandsTable);
                $('#Canada').append(canadaTable);
                $('#Hawaii').append(hawaiiTable);
                $('#Unitedkingdom').append(unitedkingdomTable);
                $('#Argentina').append(argentinaTable);
                $('#Switzerland').append(switzerlandTable);
                $('#Japan').append(japanTable);
                $('#China').append(chinaTable);
                $('#Uae').append(uaeTable);
                $('#Southafrica').append(southafricaTable);
            }
        });
    };

})();