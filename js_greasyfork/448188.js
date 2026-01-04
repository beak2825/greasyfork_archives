// ==UserScript==
// @name         Shoptet [FrameStar] - vychytávky detailu objednávky
// @namespace    http://framestar.cz/
// @version      1.9
// @description  zvýraznění odlišné doručovací adresy, produkty s více kusy
// @author       Jiri Poucek
// @match        */admin/objednavky-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448188/Shoptet%20%5BFrameStar%5D%20-%20vychyt%C3%A1vky%20detailu%20objedn%C3%A1vky.user.js
// @updateURL https://update.greasyfork.org/scripts/448188/Shoptet%20%5BFrameStar%5D%20-%20vychyt%C3%A1vky%20detailu%20objedn%C3%A1vky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    $(document).ready(function(){
        // ZVYRAZNENI DORUCOVACI ADRESY ODLISNE OD FAKTURACNI
        var sa = $("#shipping-address");
        if (sa !== null)
        {
            var p = sa.find("p");
            if (p.text() != 'Stejná jako fakturační') sa.css("border", "solid 2px green");
        }

        var li = $('div.grid.grid--4.overview-detail');

        // UPOZORNĚNÍ NA OBJEDNÁVKU S VÍCE KUSY U POLOŽEK, ZOBRAZENÍ CELKOVÉHO POČTU POLOŽEK
        var items = $("#t1 table.v2table tbody tr td:nth-child(6)");
        var c = 0; var multi = false;
        items.each(function( index ) {
            var it = $(items[index]);
            var span = it.find("span");
            if (span.length == 0) span = it;
            var str = $(span).text().trim();
            if (!str.endsWith("ks") && !str.endsWith("pcs")) return;
            var subStr = str.match(/\d+/);
            if (subStr == null) return;
            var i = parseInt(subStr);
            c += i;
            if (i > 1) { multi = true; }
        });
        //li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9'>Celkem: " + c + "ks</label></div>");
        if (multi) {
            li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9'><strong>Pozor: Obsahuje položky s více kusy.</strong></label></div>");}

        var box = false;
        var items2 = $($("table.v2table.checkbox-table")[0]).find("tbody tr td:nth-child(4)");
        items2.each(function( index ) {
            var it = $(items2[index]);
            var span = it.find("a");
            if (span.length == 0) span = it;
            var str = $(span).text();
            if (str.includes("karton")) { box = true; it.css("border", "1px solid green");}

            span = it.find("span.grey");
            if (span.length != 0) {
                str = $(span).text();
                if (str.includes("Obsahuje")) { box = true; it.css("border", "1px solid orange");}
            }
        });

        if (box) {
            li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9' style='white-space: normal;'><strong>Pozor: Obsahuje celé kartony nebo kolekce položek. </strong></label></div>");}


        // ODRAZKY V POLOZCE SETU
        var items3 = $("#t1 table.v2table tbody tr td:nth-child(4) a span.grey");
        items3.each(function( index ) {
            var it = $(items3[index]);
            var html = it.html();
            if (html.indexOf("Obsahuje :") >= 0) it.html(html.replace("Obsahuje :", "Obsahuje:<br/>")
                                                         .replace("Výrobce:", "<br/>Výrobce:")
                                                         .replaceAll(" x\n", "x ")
                                                         .replaceAll(', ', '<br/>'));
        });

        // UPOZORNENI NA KOMENTARE
        var infos = false;
        var comm = $("#comments+div");
        if (comm.length > 0)
            if (comm.hasClass("v2tableWrapper")) infos = true;

        var txt = $("textarea[name='shopRemark']");
        if (txt.length > 0)
            if (txt.val().length > 0) infos = true;
        if (infos) li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9' style='white-space: normal;'><strong>Přečti si komentář nebo poznámku dole !!</strong></label></div>");

        // ODKAZ NA PREDCHOZI OBJEDNAVKY
        var email = $($("table#t-order-contact > tbody > tr > td#customer-contact > div.customer-contact-inner > div > br+span a")[0]).text();
        $("table#t-order-contact > tbody > tr > td#billing-address").append($("<p><a target='_blank' href='/admin/prehled-objednavek/?f[email]=" + email +"'>Předchozí objednávky</a></p>"));

        // pribalove letaky
        var urlLeaflet = 'https://www.medovinarna.cz/_ajax/Order/GetLeafletInfo?';
        var params = '';
        var items4 = $($("table.v2table.checkbox-table")[0]).find("tbody tr td:nth-child(2)");
        items4.each(function( index ) {
            var it = $(items4[index]);
            var span = it.find("a");
            if (span.length == 1) {
                var str = $(span).text();
                params += "itemId=" + str + "&";
            }
        });

        $.ajax({

            // Our sample url to make request
            url: urlLeaflet + params,

            // Type of Request
            type: "GET",

            // Function to call when to
            // request is ok
            success: function (data) {
                if (data.length > 0)
                    li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9' style='white-space: normal;'>" + data + "</label></div>");
            },

            // Error handling
            error: function (error) {
                console.log(`Error ${error}`);
                alert("Chyba načtení seznamu příbalových letáků");
            }
        });

        if ($(".customer-contact-inner").html().indexOf("Velkoobchodní odběratel") >= 0)
        {
            //alert("VO");
            var urlCustoms = 'https://www.medovinarna.cz/_ajax/Order/GetCustomsInfo?';

            //customs
            $.ajax({

                // Our sample url to make request
                url: urlCustoms + 'orderId=' + $("#order-header h1 strong").text(),

                // Type of Request
                type: "GET",

                // Function to call when to
                // request is ok
                success: function (data) {
                    //let x = JSON.stringify(data);
                    if (data.length > 0)
                        li.append("<div class='grid grid--gap-xs'><label class='small-15 medium-12 large-9' style='white-space: normal;'>" + data + "</label></div>");
                },

                // Error handling
                error: function (error) {
                    console.log(`Error ${error}`);
                    alert("Chyba načtení přehledu spotřební daně");
                }
            });
        }
    });
})();