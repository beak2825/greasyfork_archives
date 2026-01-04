// ==UserScript==
// @name         Whalinvest -TEST
// @namespace    Whalinvest
// @version      0.6
// @description  Whalinvest bag calculator
// @author       Surtout Sigri44 & un peu empiresailor :)
// @match        https://app.whalinvest.com/bag*
// @icon         https://www.google.com/s2/favicons?domain=whalinvest.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433775/Whalinvest%20-TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/433775/Whalinvest%20-TEST.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        getBagValue()
        markBuySellBot()
    }, 4000);


    function getBagValue(){
        let bagTotal = 0

        let table = $('.col-sm-12.col-md-9').find('.row').find('.col-sm-12').find('.row')
        let navbar = $('.row.mb-3.mt-3').find('.col-12').find('.btn.btn-primary.ms-2')

        table.find('span.align-middle.fw-bold.ms-2').each(function (key, value) {
            const regex = /(\d+(?:\.\d{1,2})?)/

            let bagBrut = value.textContent
            let bagPrice = parseFloat(bagBrut.match(regex)[0])

            bagTotal += bagPrice
        })

        let navbarHtml = '<span class="align-middle fw-bold ms-2 h5">Total bag price : (' + bagTotal.toFixed(2) + '$)</span>'
        navbar.after(navbarHtml)

        // APR Performance
        let monthEarning = parseFloat($('h5.mb-0.fw-bold').text().replace('$',''))
        let monthRewards = monthEarning / bagTotal * 100
        let dayOfMonth = new Date().getDate();
        let dailyApr = parseFloat(monthRewards / dayOfMonth).toFixed(2)
        let annualApr = parseFloat(dailyApr * 365).toFixed(2)
        let monthlyApr = parseFloat(annualApr / 12).toFixed(2)

        let cardBox = $('.card.card-dark.p-2.text-center').children()
        let boxHtml = '<hr><h5 class="mb-0">APR Performance :</h5>'
        boxHtml += '<h5 class="mb-0 fw-bold">Journalier : ' + dailyApr + '%</h5>'
        boxHtml += '<h5 class="mb-0 fw-bold">Mensuel : ' + monthlyApr + '%</h5>'
        boxHtml += '<h5 class="mb-0 fw-bold">Annuel : ' + annualApr + '%</h5>'
        cardBox.after(boxHtml)

        // Next invoice amount
        let invoiceAmount = monthEarning * 0.2 / 1.155527


        // Set endpoint and your access key
        const access_key = '826e548dd1e2abb36a20d0dead86c573';
        const from = 'USD';
        const to = 'EUR';
        let amount = invoiceAmount;
        const url = `https://api.exchangeratesapi.io/v1/convert?access_key=${ access_key }&from=${ from }&to=${ to }&amount=${ amount }`;

        // Get the most recent exchange rates via the "latest" endpoint:
        fetch(url)
            .then(response => response.json())
            .then(data => {

            amount = data.result
        });

        let invoiceHtml = '<hr><h5 class="mb-0">Prochaine facture :</h5>'
        invoiceHtml += '<h5 class="mb-0 fw-bold">' + amount.toFixed(2) + '€</h5>'
        cardBox.after(invoiceHtml)
    }

    function markBuySellBot(){
        let table = $('.col-sm-12.col-md-9').find('.row').find('.col-sm-12.mt-2').find('.row')

        table.find('span.ms-2.align-middle').each(function (key, value) {
            const buyRegex = /achat$/
            const sellRegex = /vendre$/

            let text = value.innerHTML
            let matchBuy = text.match(buyRegex)
            let matchSell = text.match(sellRegex)

            if (matchBuy) {
                $(this).parent().parent().parent().parent().css("background-color", "#599959");
            } else if (matchSell) {
                $(this).parent().parent().parent().parent().css("background-color", "#bb5959");
            }
        })
    }
})();