// ==UserScript==
// @name         Whalinvest - Export csv des trades
// @namespace    Whalinvest
// @version      0.1.5
// @description  Exporter les trades Whalinvest en csv
// @author       Exa
// @match        https://app.whalinvest.com/*
// @icon         https://www.google.com/s2/favicons?domain=whalinvest.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436592/Whalinvest%20-%20Export%20csv%20des%20trades.user.js
// @updateURL https://update.greasyfork.org/scripts/436592/Whalinvest%20-%20Export%20csv%20des%20trades.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENTRYPOINT = "https://api.whalinvest.com/"
    let trades = []
    let token = getCookie("appWhalinvestSession")
    let nbTradesMax = 0

    setTimeout(function(){
        setInterval(()=> {
            if(document.getElementById("exportFiltres") === null && document.getElementById("nbElementExport") === null && window.location.href.match("/transactions") != null){
                getNbTradesMax()
                    .then(() => {
                    createRowFilters()
                    createButtonExport()

                    $("#exportCsvButton").click(function() {
                        exportTrades()
                    });
                })
            }},2500);
    }, 4000);

    function getNbTradesMax(){
        let url = ENTRYPOINT + "transaction/list"

        return $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function(data){
                nbTradesMax = data.data.total
            }
        })
    }

    function createRowFilters(){
        let row = document.createElement('div')
        row.setAttribute('class', 'row mb-2 mt-2')
        row.setAttribute('id', 'exportFiltres')

        let numberSelect = createNumberSelectFilter()
        let labelSelect = document.createElement('label')
        labelSelect.textContent = "Eléments à exporter"
        let divSelectNumber = document.createElement('div')
        divSelectNumber.setAttribute('class', 'col-12 col-sm-4 mb-1 mb-sm-0')

        divSelectNumber.appendChild(labelSelect)
        divSelectNumber.appendChild(numberSelect)
        row.appendChild(divSelectNumber)

        const elementParent = $('.card-title')[0]

        elementParent.after(row)
    }

    function createNumberSelectFilter(){
        let select = document.createElement('select')
        select.setAttribute('class', 'form-select small-select-width')
        select.setAttribute('id', 'nbElementExport')

        select.add(createOptionForSelect("20", 20))
        select.add(createOptionForSelect("100", 100))
        select.add(createOptionForSelect("500", 500))
        select.add(createOptionForSelect("1000", 1000))
        select.add(createOptionForSelect("10000", 10000))
        select.add(createOptionForSelect("Tous", nbTradesMax))

        return select
    }

    function createExclusionFilter(){
        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
    }

    function createOptionForSelect(text, value){
        let newOption = document.createElement("option")
        newOption.text = text
        newOption.value = value

        return newOption
    }

    function createButtonExport(){
        let button = document.createElement('button')
        button.setAttribute('class', 'btn btn-primary')
        button.setAttribute('type', 'button')
        button.setAttribute('id', 'exportCsvButton')
        button.textContent = "Exporter mes trades en csv"

        document.getElementById('exportFiltres').after(button)
    }

    function exportCsvFromJson(trades){
        const csv = convertJsonToCsv(trades)
        var dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);

        if (!window.navigator.msSaveOrOpenBlob){
            const hiddenLinkElement = document.createElement('a');
            hiddenLinkElement.href = dataStr
            hiddenLinkElement.setAttribute('target', '_blank');
            hiddenLinkElement.setAttribute('download', 'export.csv');
            document.body.appendChild(hiddenLinkElement);
            hiddenLinkElement.click();
            hiddenLinkElement.remove();
        }
    }

    function exportTrades(){
        let url = ENTRYPOINT + "transaction/list"

        const nbElementsAExporter = document.getElementById('nbElementExport').value

        if(nbElementsAExporter > 0){
            url += "?page=0&limit=" + nbElementsAExporter
        }

        $.ajax({
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            success: function(data){
                trades = data.data.items
                let formattedTrades = []
                trades.forEach((element) => {
                    formattedTrades.push(getFormattedTrade(element))
                })
                exportCsvFromJson(formattedTrades)
            }
        })
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function convertJsonToCsv(json) {
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(json[0])
        const csv = [
            header.join(';'), // header row first
            ...json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
        ].join('\r\n')

        return csv
    }

    function getFormattedTrade(trade){
        let pair = ""
        let totalBought = 0
        let totalSold = 0
        let fees = 0
        let prixMoyenAchat = 0
        let prixVente = 0
        let produitPrixMoyen = 0
        let valeurVente = 0
        let farmedAmount = 0
        let profite = 0
        let prixMoyenFarme = 0
        let feesVente = 0
        let totalFees = 0
        let dateAchat = '';
        let dateVente = '';

        trade.orders.forEach((order, index) => {
            pair = order.pair
            if(order.side === 'buy'){
                totalBought += order.amount
                produitPrixMoyen += (order.cost + order.fees)
                fees += order.fees
                dateAchat = order.closedAt
            }
            if(order.side === 'sell'){
                totalSold += order.amount
                fees += order.fees
                prixVente = order.price
                valeurVente = order.cost
                feesVente = order.fees
                dateVente = order.closedAt
            }
        })

        prixMoyenAchat = produitPrixMoyen / totalBought

        if(trade.farmedAmount > 0){
            let valeurAchatFarm = prixMoyenAchat * trade.farmedAmount
            let prixFarm = prixVente * trade.farmedAmount
            let facture = (prixFarm - valeurAchatFarm) * 0.24

            prixMoyenFarme = (facture + valeurAchatFarm + feesVente) / trade.farmedAmount
        }

        totalFees = fees + feesVente

        let options = {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        }

        if(dateAchat !== ''){
          dateAchat = Intl.DateTimeFormat("fr-FR", options).format(new Date(dateAchat))
        }
        
        if(dateVente !== ''){
            dateVente = Intl.DateTimeFormat("fr-FR", options).format(new Date(dateVente))
        }


        return {
            pair: pair,
            dateAchat: dateAchat,
            dateVente: dateVente,
            totalBought: totalBought.toString().replace('.', ','),
            totalSold: totalSold.toString().replace('.', ','),
            prixMoyenAchat: prixMoyenAchat.toString().replace('.', ','),
            valeurVente: valeurVente.toString().replace('.', ','),
            prixVente: prixVente.toString().replace('.', ','),
            farmedAmount: trade.farmedAmount.toString().replace('.', ','),
            profits: trade.profite.toString().replace('.', ','),
            prixMoyenFarmeAvecFacture: prixMoyenFarme.toFixed(6).toString().replace('.', ','),
            totalFrais: totalFees.toString().replace('.', ',')
        }
    }
})();