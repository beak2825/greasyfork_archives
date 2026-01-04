// ==UserScript==
// @name         Nordea Anpassad CSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lägger in en extra exporteringsknapp som också kan exportera transaktioner till CSV, men denna är formaterad anorlunda. Framförallt så är kontonummer med.
// @author       Oscar Jonsson
// @match        https://internetbanken.privat.nordea.se/nsp/core*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396553/Nordea%20Anpassad%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/396553/Nordea%20Anpassad%20CSV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sparaSomFilP=document.evaluate("//p[contains(text(),'Spara som fil')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();
    if (sparaSomFilP) {
        var customCSV_A=document.createElement("A");
        customCSV_A.textContent="Anpassad CSV";
        customCSV_A.href="#";
        customCSV_A.addEventListener("click", downloadCustomCSV);
        sparaSomFilP.appendChild(document.createTextNode(' \xa0 '));
        sparaSomFilP.appendChild(customCSV_A);
    }
    function downloadCustomCSV(e) {
        e.preventDefault();
        var accountSelect=document.getElementById("transactionaccount")
        var account=accountSelect.options[accountSelect.selectedIndex].textContent.split("    ")[1];
        var output=account+"\nDatum;Text;Kategori;Belopp;Saldo\n";
        var table=document.getElementById("transactionstable");
        var rows=table.rows;
        for (var i=2; i<rows.length; i++) {
            var cells=rows[i].cells;
            output+=cells[1].textContent.trim()+";"+cells[2].textContent.trim()+";"+cells[3].textContent.trim()+";"+cells[4].textContent.trim()+";"+cells[5].textContent.trim();
            if (i<rows.length-2)
                output+="\n";
        }
        var fromDate=document.getElementById("transactionfromdate").value;
        var toDate=document.getElementById("transactiontodate").value;
        var filename="Transaktioner Nordea "+account+" ("+fromDate+" - "+toDate+").csv";
        download(filename,output);
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

})();