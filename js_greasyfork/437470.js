// ==UserScript==
// @name         users-trades-avg-calc
// @namespace    https://wallex.ir/
// @version      1.1
// @description  calculate avg of orders in users-trades
// @author       amiwrpremium
// @include      https://wallex.ir/app/new-user-trades*
// @icon         https://www.google.com/s2/favicons?domain=wallex.ir
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437470/users-trades-avg-calc.user.js
// @updateURL https://update.greasyfork.org/scripts/437470/users-trades-avg-calc.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function main() {
        let tbody = document.getElementsByClassName('table table-hover')[0].getElementsByTagName('tbody')[0]
        let trs = Array.from(tbody.getElementsByTagName('tr')).slice(1)

        let total_dealt_qty = 0
        let total_total_sum = 0
        let total_buyer_fee = 0
        let total_seller_fee = 0


        function numberWithCommas(x) {
            let parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }

        for (let i = 0; i < trs.length; i++) {
            let dealt_qty = parseFloat((trs[i].getElementsByTagName('td')[5].innerText).replaceAll(',', ''))
            let total_sum = parseFloat((trs[i].getElementsByTagName('td')[6].innerText).replaceAll(',', ''))
            let buyer_fee = parseFloat((trs[i].getElementsByTagName('td')[7].innerText).replaceAll(',', ''))
            let seller_fee = parseFloat((trs[i].getElementsByTagName('td')[8].innerText).replaceAll(',', ''))

            total_dealt_qty += dealt_qty
            total_total_sum += total_sum
            total_buyer_fee += buyer_fee
            total_seller_fee += seller_fee
        }

        let average_price = parseFloat((total_total_sum / total_dealt_qty).toFixed(2))

        // let header = document.querySelector('#pjax-container > section.content > div > div > div > div.box-header')
        //
        // let total_dealt_qty_element = document.createElement('h4')
        // total_dealt_qty_element.className = 'inline pull-left'
        // total_dealt_qty_element.style = 'padding-left: 10px; padding-right: 10px'
        // total_dealt_qty_element.innerText = `مقدار معامله شده: ${numberWithCommas(total_dealt_qty.toFixed(6))}`
        //
        // let total_total_sum_element = document.createElement('h4')
        // total_total_sum_element.className = 'inline pull-left'
        // total_total_sum_element.style = 'padding-left: 10px; padding-right: 10px'
        // total_total_sum_element.innerText = `جمع کل: ${numberWithCommas(parseFloat(total_total_sum.toFixed(6)))}`
        //
        // let total_buyer_fee_element = document.createElement('h4')
        // total_buyer_fee_element.className = 'inline pull-left'
        // total_buyer_fee_element.style = 'padding-left: 10px; padding-right: 10px'
        // total_buyer_fee_element.innerText = `کارمزد خریدار: ${numberWithCommas(parseFloat(total_buyer_fee.toFixed(6)))}`
        //
        // let total_seller_fee_element = document.createElement('h4')
        // total_seller_fee_element.className = 'inline pull-left'
        // total_seller_fee_element.style = 'padding-left: 10px; padding-right: 10px'
        // total_seller_fee_element.innerText = `کارمزد فروشنده: ${numberWithCommas(parseFloat(total_seller_fee.toFixed(6)))}`
        //
        // let average_price_element = document.createElement('h4')
        // average_price_element.className = 'inline pull-left'
        // average_price_element.style = 'padding-left: 10px; padding-right: 10px'
        // average_price_element.innerText = `میانگین: ${numberWithCommas(parseFloat(average_price.toFixed(6)))}`

        // header.appendChild(total_dealt_qty_element)
        // header.appendChild(total_total_sum_element)
        // header.appendChild(total_buyer_fee_element)
        // header.appendChild(total_seller_fee_element)
        // header.appendChild(average_price_element)

        tbody.insertRow(0).innerHTML =
            '<tr>\n' +
            '<th> </th>\n' +
            '<th>نایس</th>\n' +
            '<th>نایس</th>\n' +
            '<th>نایس</th>\n' +
            '<th>نایس</th>\n' +
            `<th>${numberWithCommas(total_dealt_qty.toFixed(6))}</th>\n` +
            `<th>${numberWithCommas(parseFloat(total_total_sum.toFixed(6)))}</th>\n` +
            `<th>${numberWithCommas(parseFloat(total_buyer_fee.toFixed(6)))}</th>\n` +
            `<th>${numberWithCommas(parseFloat(total_seller_fee.toFixed(6)))}</th>\n` +
            `<th>میانگین: ${numberWithCommas(parseFloat(average_price.toFixed(6)))}</th>\n` +
            '</tr>'

    }

    let a = document.querySelector('#app > aside > section > ul > li:nth-child(1) > a > span');
    if ((a.innerText === "سفارش ها") || (a.innerText === "داشبورد")) {
        main()
    }
    else {
        console.log('Not Sbaqeri')
    }
})();