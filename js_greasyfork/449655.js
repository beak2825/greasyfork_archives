// ==UserScript==
// @name         Export history from OFE NN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Exports history from NN OFE page
// @author       ksuszka
// @license      WTFPL
// @match        https://nserwis.nn.pl/pensiondetails*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nn.pl
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/449655/Export%20history%20from%20OFE%20NN.user.js
// @updateURL https://update.greasyfork.org/scripts/449655/Export%20history%20from%20OFE%20NN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Loading export script...');

    let operationHistory = {};
    let header = [];
    const refreshDisplay = function () {
        $("#exportOperationHistoryBtn").text(`Export ${Object.keys(operationHistory).length} operations to clipboard`);
    };

    // Intercept XHR requests and gather operations history
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("load", function() {
                try {
                    $(this.responseText).find("thead tr").each((i,e)=>{
                        let ths = $(e).find("th");
                        let newHeader = Array.from(ths).map(th => $(th).find("*").addBack(th).contents().filter(function(){
                            return this.nodeType == 3 && this.nodeValue.trim().length > 0;
                        }).map(function() { return this.nodeValue.trim(); })[0] || "unknown" );
                        if (JSON.stringify(newHeader) !== JSON.stringify(header)) {
                            header = newHeader;
                            console.log("header:", header);
                        }
                    });
                    let found = false;
                    $(this.responseText).find("tbody tr").each((i,e)=>{
                        //                    console.log($(e));
                        let tds = $(e).find("td");
                        let rowId = Array.from(tds).map(td => td.innerText).join("#");
                        operationHistory[rowId] = tds;
                        found = true;
                    });
                    if (found) {
                        refreshDisplay();
                    }
                } catch (error) {
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    $('<button/>', {
        text: "Clear operation history",
        id: 'clearOperationHistoryBtn',
        click: function () {
            operationHistory = {};
            header = [];
            refreshDisplay();
        }
    }).appendTo("body");


    $('<button/>', {
        text: "Export to clipboard",
        id: 'exportOperationHistoryBtn',
        click: function () {
            $("#exportOperationHistoryBtn").text("Loading...");
            var plain = header.join("\t")+ "\n";
            var htmlTable = document.createElement('table');
            var appendElement = (parent, type) => {
                var el = document.createElement(type);
                parent.appendChild(el);
                return el;
            };
            var tr = appendElement(htmlTable, 'tr');
            header.forEach(e => {
                appendElement(tr, 'th').innerText = e;
            });

            Object.values(operationHistory).forEach(row=> {
                plain += Array.from(row).map(td => td.innerText).join("\t") + "\n";
                var tr = appendElement(htmlTable, 'tr');
                Array.from(row).map(td => td.innerText).forEach(e => {
                    appendElement(tr, 'td').innerText = e;
                });
            });
            console.log(plain);
            document.addEventListener('copy', function(e){
                e.clipboardData.setData('text/plain', plain);
                e.clipboardData.setData('text/html', htmlTable.outerHTML);
                e.preventDefault(); // default behaviour is to copy any selected text
                $("#exportOperationHistoryBtn").text("Loaded to clipboard");
            }, {once: true});
            document.execCommand('copy');
        }
    }).appendTo("body");
    $('<button/>', {
        text: "Export myfund to clipboard",
        id: 'exportOperationHistoryToMyFundBtn',
        click: function () {
            $("#exportOperationHistoryToMyFundBtn").text("Loading...");
            var plain = "";

            Object.values(operationHistory).forEach(row=> {
                const [dateRaw, nameRaw, sumRaw, interestRaw, feeRaw, valueRaw, priceRaw, unitsRaw, unitsSumRaw] = Array.from(row).map(td => td.innerText);
                const date = dateRaw.split(".");
                const units = parseFloat(unitsRaw.replace(",", "."));
                const operationType = units < 0 ? "SPRZEDAŻ" : "KUPNO";
                const price = priceRaw.replace(",", ".").replace("zł", "[PLN]");
                const fee = feeRaw.replace(",", ".").replace("zł", "[PLN]");
                const description = /^\d/.test(nameRaw) ? "Składka za okres " + nameRaw : nameRaw;
                plain += `${date[2]}-${date[1]}-${date[0]};OFE NN (dawniej ING);${operationType};${Math.abs(units)};${price};${fee};1;0;${description}\n`;
            });
            console.log(plain);
            document.addEventListener('copy', function(e){
                e.clipboardData.setData('text/plain', plain);
                e.preventDefault(); // default behaviour is to copy any selected text
                $("#exportOperationHistoryToMyFundBtn").text("Loaded to clipboard");
            }, {once: true});
            document.execCommand('copy');
        }
    }).appendTo("body");
    refreshDisplay();
})();