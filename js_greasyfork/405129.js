// ==UserScript==
// @name         Importazione prodotto Amazon
// @namespace    https://andrealazzarotto.com
// @version      1.0
// @description  Automatizza l'inserimento dei prodotti
// @author       Andrea Lazzarotto
// @match        https://www.amazon.it/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/405129/Importazione%20prodotto%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/405129/Importazione%20prodotto%20Amazon.meta.js
// ==/UserScript==


function kickstart() {
    var token = "5f397183b9d344e5f77535fd172155ed0";
    var username = "g2b";
    var title = $('#title').text().trim();
    var asin = $("input#ASIN").val();
    var price = parseFloat($("#newBuyBoxPrice, #priceblock_ourprice").text().trim().replace(/\./g, '').replace(',', '.'));
    var description = $('#feature-bullets').text().trim();
    var images = {
        "1": $("#imgTagWrapperId img").attr("src"),
    };
    var result = {
        token: token,
        username: username,
        titolo: title,
        asin: asin,
        prezzo: price,
        amazon_descrizione: description,
        images: images,
    };

    $.ajax({
        type: 'POST',
        url: 'https://asin.g2b.it/api/addAsin.php',
        data: JSON.stringify(result),
        success: function(data) {
            alert('Aggiunto con successo!');
            console.log(data);
        },
        error: function() {
            alert("ERROR");
        },
        contentType: "application/json",
        dataType: 'json'
    });
}

(function() {
    'use strict';

    var wrapper = $("<div></div>").css({
        'position': 'fixed',
        'left': '1rem',
        'bottom': '1rem',
        'z-index': 99999,
    }).appendTo('body');

    console.log(wrapper);

    var start_button = $("<button>Aggiungi alla lista</button>").click(kickstart);

    start_button.css({
        'font-size': '2rem',
        'font-weight': 'bold',
    }).appendTo(wrapper);
})();