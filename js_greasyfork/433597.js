// ==UserScript==
// @name         Whalinvest - Wallet
// @namespace    Whalinvest
// @version      0.7
// @description  Whalinvest bag calculator
// @author       Sigri44
// @match        https://app.whalinvest.com/bag*
// @icon         https://www.google.com/s2/favicons?domain=whalinvest.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/433597/Whalinvest%20-%20Wallet.user.js
// @updateURL https://update.greasyfork.org/scripts/433597/Whalinvest%20-%20Wallet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        //getBagValue()
        getExchangeRates()
        markBuySellBot()
    }, 4000);

    function getBagValue(exchangeRates){

        let bagTotal = 0

        let table = $('.col-sm-12.col-md-9').find('.row').find('.col-sm-12').find('.row')
        let navbar = $('.row.mb-3.mt-3').find('.col-12').find('.btn.btn-primary.ms-2')

        table.find('span.align-middle.fw-bold.ms-2').each(function (key, value) {
            const regex = /(\d+(?:\.\d{1,2})?)/

            let bagBrut = value.textContent
            let bagPrice = parseFloat(bagBrut.match(regex)[0])

            bagTotal += bagPrice
        })

        let navbarHtml = '<span class="align-middle fw-bold ms-2 h5">Valeur total des sacs : ' + bagTotal.toFixed(2) + '$</span>'
        navbar.after(navbarHtml)

        // APR Performance
        let monthEarning = parseFloat($('h5.mb-0.fw-bold').text().replace('$',''))
        let cardBox = $('.card.card-dark.p-2.text-center').children().children().last()

        if (bagTotal != 0) {
            let monthRewards = monthEarning / bagTotal * 100
            let dayOfMonth = new Date().getDate();
            let dailyApr = parseFloat(monthRewards / dayOfMonth).toFixed(2)
            let annualApr = parseFloat(dailyApr * 365).toFixed(2)
            let monthlyApr = parseFloat(annualApr / 12).toFixed(2)

            let boxHtml = '<hr><h5 class="mb-0">Rendement :</h5>'
            boxHtml += '<h5 class="mb-0 fw-bold">Journalier : ' + dailyApr + '%</h5>'
            boxHtml += '<h5 class="mb-0 fw-bold">Mensuel : ' + monthlyApr + '%</h5>'
            boxHtml += '<h5 class="mb-0 fw-bold">Annuel : ' + annualApr + '%</h5>'
            cardBox.after(boxHtml)
        }

        // Next invoice amount
        //const forexUsdEur = exchangeRates['rates']['EUR']
        //let invoiceAmountUsd = monthEarning * 0.2
        //let invoiceAmountEur = invoiceAmountUsd * forexUsdEur
        //let invoiceHtml = '<hr><h5 class="mb-0">Prochaine facture :</h5>'
        //invoiceHtml += '<h5 class="mb-0 fw-bold">' + invoiceAmountUsd.toFixed(2) + '$ ~ ' + invoiceAmountEur.toFixed(2) + '€</h5>'
        //cardBox.after(invoiceHtml)
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

    function getExchangeRates() {
        const ENDPOINT_EXCHANGE_RATES = 'https://api.whalinvest.com/exchange-rates'

        $.ajax({
            url: ENDPOINT_EXCHANGE_RATES,
            success: function(data){
                getBagValue(data)
            }
        })
    }
})();