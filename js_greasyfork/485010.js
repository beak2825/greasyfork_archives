// ==UserScript==
// @name         Shoptet [FrameStar] - vychytávky detailu faktury
// @namespace    http://framestar.cz/
// @version      1.2
// @description  zobrazení informace ke spotřební dani
// @author       Jiri Poucek
// @match        */admin/faktura-detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medovinarna.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485010/Shoptet%20%5BFrameStar%5D%20-%20vychyt%C3%A1vky%20detailu%20faktury.user.js
// @updateURL https://update.greasyfork.org/scripts/485010/Shoptet%20%5BFrameStar%5D%20-%20vychyt%C3%A1vky%20detailu%20faktury.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var m = $("meta[name='author']");
    if (m == null || m.length !=1) return;
    if (m.attr("content")!="Shoptet.cz") return;

    var dest = $('.grid.grid--3.grid--v2form');
    if (dest == null || dest.length == 0)
        alert("Chyba: cílový element nenalezen.");
    var orderIdInput = $("input[name='orderCode']");
    if (orderIdInput == null || orderIdInput.length == 0)
        alert("Chyba: nenalezeno orderId.");
    var orderId = orderIdInput.val();
    if (orderId == null || orderId.length == 0)
        alert("Chyba: neplatné orderId.");
    if ($(".customer-contact-inner").html().indexOf("Velkoobchodní odběratel") >= 0)
        {
            //alert("VO");
            var urlCustoms = 'https://www.medovinarna.cz/_ajax/Order/GetCustomsDetails?';

            //customs
            $.ajax({

                // Our sample url to make request
                url: urlCustoms + 'orderId=' + orderId,

                // Type of Request
                type: "GET",

                // Function to call when to
                // request is ok
                success: function (data) {
                    //let x = JSON.stringify(data);
                    if (data.length > 0)
                        dest.append("<div>" + data + "</div>");
                },

                // Error handling
                error: function (error) {
                    console.log(`Error ${error}`);
                    alert("Chyba načtení přehledu spotřební daně");
                }
            });
        }
})();