// ==UserScript==
// @name         batchPrintInvoice
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  batch Print Invoice
// @author       You
// @match        https://www.einvoice.nat.gov.tw/APB2BGVAN/Agency/AgencyInvoiceQuery*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461529/batchPrintInvoice.user.js
// @updateURL https://update.greasyfork.org/scripts/461529/batchPrintInvoice.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(() => {

        var h2 = $('h2');
        h2.append(`
        <button type="button" id="autoPrint">列印</button>

    `)

        $('#autoPrint').click(function() {
            var numbers = autoSort();
            autoPrint(numbers);
        });

    }, 2000);

    function clickPrintButton() {
        $('a:contains("下載電子發票證明聯")').get(0).click();
    }

    function autoSort() {

        var numbers = [];

        $('#tblData tbody tr').each((index, ele) => {

            var row = $(ele);



            var number = {};
            number.originId = row.attr("id").replace("row", "");
            number.number = row.find('input[name*=".invoiceNumber"]').val();
            number.date = row.find('input[name*=".invoceDateStr"]').val();
            number.sellerId = row.find('input[name*=".sellerId"]').val();
            number.sortKey = `${number.sellerId}_${number.date}_${number.number}`;
            numbers.push(number);

        });


        numbers = numbers.sort(function(a, b) {
            var sortA = a.sortKey.toUpperCase(); // ignore upper and lowercase
            var sortB = b.sortKey.toUpperCase(); // ignore upper and lowercase
            if (sortA < sortB) {
                return -1;
            }
            if (sortA > sortB) {
                return 1;
            }
            return 0;
        });


        var mapping = {};
        numbers.forEach(function(number, index) {
            number.id = index;
            mapping[number.number] = index;

        });
        console.log(numbers);

        $('#tblData tbody tr').each((index, ele) => {

            var row = $(ele);



            var number = {};
            number.number = row.find('input[name*=".invoiceNumber"]').val();
            number.originId = row.attr("id").replace("row", "");
            number.id = mapping[number.number];

            row.attr("id", `row${number.id}`);

            row.find('input[type="checkbox"]').attr("index", number.id);
            row.find('input').each((index1, ele1) => {

                var input = $(ele1);

                var originName = input.attr("name");
                if (originName) {
                    var newName = originName.replace(`resultLstDataPage[${number.originId}]`, `resultLstDataPage[${number.id}]`);

                    if (originName != newName) {
                        input.attr("name", newName);
                        //console.log(`${originName} => ${newName}`);
                    }
                }

                var originId = input.attr("id");
                if (originId) {
                    var newId = originId.replace(`sellerDownloadForm_resultLstDataPage_${number.originId}__`, `sellerDownloadForm_resultLstDataPage_${number.id}__`);

                    if (originId != newId) {
                        input.attr("id", newId);
                        //console.log(`${originId} => ${newId}`);
                    }
                }

            });

        });



        return numbers;

    }

    function autoPrint(numbers) {
        var i = 1;

        while (numbers.length > 0) {
            var targetArray = [];
            for (var j = 0; j < 9; j++) {
                if (numbers.length > 0) {
                    targetArray.push(numbers.shift());
                }
            }

            console.log(targetArray);
            console.log(numbers);

            (function(i, numbers) {
                setTimeout(() => {

                    checkNumber(numbers);

                }, 25 * 1000 * (i));
            }(i, targetArray));

            i++;
        }

    }

    function checkNumber(numbers) {
        $('a:contains("取消全選")').get(0).click();

        setTimeout(() => {
            for (var number of numbers) {
                $(`#row${number.id}`).find('input[type="checkbox"]').click();

                console.log(number);



            }
            clickPrintButton();
        }, 2000);
    }


})();