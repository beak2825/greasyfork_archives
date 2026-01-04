// ==UserScript==
// @name         Count the Loot
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  Dog shit way to see quickly amount of loot someone's received on Evil Eye loot council site
// @author       sheetee
// @match        https://htl.nu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436009/Count%20the%20Loot.user.js
// @updateURL https://update.greasyfork.org/scripts/436009/Count%20the%20Loot.meta.js
// ==/UserScript==
'use strict';
let table = document.getElementsByClassName('t-Report-report')[0];
let tableContainer = document.getElementsByClassName('t-ContentBlock-body')[0];
if(table){

    window.addEventListener('load', function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const observer = new MutationObserver(function(mutation){
            if (mutation[mutation.length - 1]) {
                console.log('mutation!', mutation);
                table = document.getElementsByClassName('t-Report-report')[0];
                fuckThePolice();
            }
        });
        observer.observe(tableContainer, {
            attributes: true,
            subtree: true
        });
    });
}

const fuckThePolice = function() {
    const raiderArray = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
        raiderArray.push({name: row.cells[1].getElementsByTagName("a")[0].innerHTML, count: 0})
        for (var j = 3, col; col = row.cells[j]; j++){
            let spanEl = col.getElementsByTagName("span").length;
            raiderArray[i].count += spanEl;
        }
        row.cells[1].innerHTML = row.cells[1].getElementsByTagName("a")[0].outerHTML + '<div style="color:red;font-size:16px;margin:5px;display:inline-block;text-align:center;">' + raiderArray[i].count + '</div>';
    }
}