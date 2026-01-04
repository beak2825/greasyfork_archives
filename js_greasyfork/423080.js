// ==UserScript==
// @name         USfood unit price calculation
// @namespace    http://shakingcrab.com/
// @version      0.1.2
// @description  Calculate unit price and show it
// @author       Yihui Liu
// @match        https://lma.a0.usfoods.com/list/*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/423080/USfood%20unit%20price%20calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/423080/USfood%20unit%20price%20calculation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function() {
        document.querySelectorAll('.prod-icons #productAmt').forEach(function(obj) {
            let children = obj.childNodes;
            let casePrice = 0;
            let caseAmount = 0;
            let amountUnit = '';
            children.forEach(function(child) {
                let nodeName = child.nodeName;
                if (nodeName == 'SPAN') {
                    // case price or each price
                    let spanData = child.innerText;
                    let unit = spanData.match(/([a-zA-Z]+)/)[0];
                    if (unit != 'NO') {
                        if (unit != 'EA') {
                            let matchResult = spanData.match(/[0-9]+.*[0-9]+/);
                            if (matchResult != null) {
                                casePrice = Number(matchResult[0]);
                            }
                        }
                    } else {
                        console.log('no price');
                        casePrice = 0;
                    }
                    //console.log('span: ' + child.innerText);
                }
                if (nodeName == '#text') {
                    // case status
                    let data = child.data;
                    let amountResult = data.match(/([0-9]+)\/*([0-9]+)*/);
                    amountUnit = data.match(/([a-zA-Z]+)/)[0];
                    caseAmount = Number(amountResult[1]) * (amountResult[2] != undefined ? Number(amountResult[2]) : 1);
                    //console.log('text: ' + child.data);
                }
            });
            let unitPrice = Math.round((casePrice / caseAmount) * 100) / 100;
            let divExists = false;
            children.forEach(function(child) {
                let nodeName = child.nodeName;
                if (nodeName == 'DIV') {
                    child.innerHTML = '$' + unitPrice + '/' + amountUnit;
                    divExists = true;
                }
            });
            if (!divExists) {
                let resultElement = document.createElement('DIV');
                resultElement.innerHTML = '$' + unitPrice + '/' + amountUnit;
                obj.appendChild(resultElement);
            }
        });
    }, 1000);
})();
