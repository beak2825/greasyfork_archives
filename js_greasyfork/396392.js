// ==UserScript==
// @name         CSV-export för Handelsbanken
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Lägger in en knapp för CSV-export bredvid knappen för excel-export i kontoöversikterna
// @author       Oscar Jonsson
// @match        https://secure.handelsbanken.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396392/CSV-export%20f%C3%B6r%20Handelsbanken.user.js
// @updateURL https://update.greasyfork.org/scripts/396392/CSV-export%20f%C3%B6r%20Handelsbanken.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var iframe,iframeDocument;
    var observer,observerDiv;

    if (window == window.parent) //not inside iframe
      var waitForIframeInterval=setInterval(checkForIframe, 500);

    function checkForIframe(mutationsList, observer) {
        iframe=document.querySelector('iframe[title="Kontotransaktioner"]');
        if (iframe) {//transactions-iframe has been loaded into dom
            clearInterval(waitForIframeInterval);
            var span=document.createElement("SPAN");
            var a=document.createElement("A");
            a.textContent="Exportera till CSV";
            span.appendChild(a);
            a.href="#";
            console.log("iframeadded");

            var icon=document.createElement("IMG");
            icon.src="https://image.flaticon.com/icons/png/512/180/180855.png";
            icon.style.cursor="pointer";
            span.appendChild(icon)
            icon.style.width="20px";

            iframe.onload=iframeLoaded;
            observer.disconnect();
            function iframeLoaded() {
                console.log("iframeloaded");
                iframeDocument=window.iframeDocument=iframe.contentDocument;
                var exportDiv=iframeDocument.querySelector('.printIcon.excelAndPrintHeader');
                if (exportDiv) {//iframeLoaded might have been called buecause it was actually Unloaded
                    exportDiv.insertBefore(span, exportDiv.firstChild);
                    span.addEventListener("click",csvClick);
                }

            }
        }
    }


    function csvClick(e) {
        var accountSel=iframeDocument.getElementById("Konto");
        var clearing=iframeDocument.evaluate('//td[.="Clearingnummer:"]/following-sibling::td',iframeDocument, null, XPathResult.ANY_TYPE, null).iterateNext().innerText;
        var account=accountSel.options[accountSel.selectedIndex].innerText;
        var fromDate=iframeDocument.getElementById("DATUM_FROM").value;
        var toDate=iframeDocument.getElementById("DATUM_TOM").value;
        var fileName="Transaktioner Handelsbanken "+clearing+"-"+account+" "+fromDate+" - "+toDate+".csv";

        var output=clearing+"-"+account+"\nReskontradatum;Transaktionsdatum;Text;Belopp;Saldo\n";
        var transactionsTable=iframeDocument.querySelectorAll("body > form > table")[5];
        var rows=transactionsTable.rows;
        for (var i=1; i<rows.length; i++) {
            var rowcells=rows[i].cells;
            for (var j=0; j<9; j+=2) {
                if (rowcells[j])
                    output+=rowcells[j].innerText;
                if (j<8)
                    output+=";";
            }
            if (i<rows.length-1)
                output+="\n";
        }

        download(fileName,output);
        e.preventDefault();
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