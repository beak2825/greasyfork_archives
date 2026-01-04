// ==UserScript==
// @name         Print labels Cliniccare Zebra
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Printing patient labels from cliniccare on Zebra printer
// @author       You
// @match        *://login.cliniccare.dk/*
// @grant        GM_xmlhttpRequest
// @license      GNU GPLv3
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/473356/Print%20labels%20Cliniccare%20Zebra.user.js
// @updateURL https://update.greasyfork.org/scripts/473356/Print%20labels%20Cliniccare%20Zebra.meta.js
// ==/UserScript==

// @require      https://hudkraeftklinikken.dk/external/BrowserPrint-3.1.250.min.js
// @require      https://hudkraeftklinikken.dk/external-Zebra-1.1.250.min.js



/* globals dymo */

(function() {

    var btn = document.createElement( 'input' );

    btn.setAttribute( 'value', 'Print label' );
    btn.setAttribute( 'type', 'button' );


    // append at end
    if(document.getElementById( 'ctl00_MainContent_CName' ) != null){
        var tableRef = document.getElementById( 'ctl00_MainContent_CName' ).parentNode.parentNode.parentNode.parentNode;
        var newRow = tableRef.insertRow();
        var newCell = newRow.insertCell(0);
        newCell.appendChild(btn);
        //--- Activate the newly added button.
        btn.addEventListener (
            "click", ButtonClickAction, false
        );

        var div = document.createElement('div');
        var htmlString = '<div id="label_printer_status"><p>Status på printer: <span id="label_printer_status_text"></span></p></div>';
        div.innerHTML = htmlString.trim();
        var newRow2 = tableRef.insertRow();
        var newCell2 = newRow2.insertCell(0);
        newCell2.appendChild(div);

    }

    function ButtonClickAction (zEvent) {
        /*--- For our dummy action, we'll just add a line of text to the top
            of the screen.
        */
        var name = document.getElementById('ctl00_MainContent_CName').value;
        var cpr = document.getElementById('ctl00_MainContent_CSocialN').value + '-' + document.getElementById('ctl00_MainContent_CSocialN2').value;
        var cprWODash = document.getElementById('ctl00_MainContent_CSocialN').value + document.getElementById('ctl00_MainContent_CSocialN2').value;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '-' + mm + '-' + yyyy;


        var codeToWrite = 'CT~~CD,~CC^~CT~^XA~TA000~JSN^LT0^MNW^MTD^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ^XA^MMT^PW631^LL0432^LS0^FO192,32^GFA,04992,04992,00052,:Z64:eJztlcFr21Ycx39Pivo0OqKYRZiAExnvEnoY2U2wYkuHkB0ViFgOGTWjMNhJhm3OwUYvMaWmh3V/wGBlp922Y07tEwR8KSyX3loq3MvYYdFgUA00v/2eJRsHUtHdevBX4knvwe99/NXv93sGWGqppZZaaqk3ybx2da005ta1q3ppzO61q7XSGOf/c7RQu2MeOOHHdFSJnMpfo9fdjlWN/umXBX2hj/Uh1OvDcZ2xNX3caOjD4Vg/LQlZcfE6d5zO8y87nK+t3L3R3SD82w1exnGZog9i5DRsxnb0htLQGWu8x0o5664ZXVid77t9zj846qAf8uLrjYuSGN3VT/HHK8j5FPfX640GsGFD/72Ms1tzj86dvW9+2NvlvFO72+1WzKd7R0dlfr7aVraH9VufPDg9ZezXn8c/ffjopjI4U0pCNH/d9T3HNO/RUeRW9jtuZ9/UyD4t48zE1AHDRx0vqdL8yMFxgHBKuIOvKwHBFZK9DQdmDnLO9lvFXFV5Ay211LsnDTTiH5jOuuZo4OEMPN93Pc2RB7Fn+o62AmseTnwPfOww2WMGM5iYGKx5MzZYKmdpSwxSNQYGsNMSTFkF28ZGepLCE6ZMO8u4sCKRWRcWTSySWhyHUEQZTQgHCFqCV6tg1yCgIlFFQkGeDQZuLzIj3lKnnHjKYQXHBsJWFbBXoW0wW2VxwUkkByHa39ZJaiRTDu9RPuXg0VCj7NCAwIIelfeUgx6gqSZNSCUnwQE9Ngs/yMHtbRXatqTZBSezGPRJZpF/pR98pkB5SOOCIzLCbXoS3IadTagVnAw5tyFtwkRy0pyzNSg4MEmBSyfIeR/0gjOxOPQgCyG8g34KjjWa+wkgPiRREkBQm3Nw+0YTmhNotpDzWHIoM36Z+4lhbMOruL7IERYPMwgFWAL9CIskUOVVgfkhflCpRAkRKekiZ0dy/M9kzMOHmB9oTTAaOTiTflQhOZcprjH1jzP4KG5POar4U8b89lJyLIExJDV+fDn1QwX6ISIxRMTp+TH0gkBWQ40KIWMGl1hvaCvn3L9c4KAf/IO4geVgt9uLfkYiqvQlx0KEdV/knNez/IwA6w36QeEn/25MyPw0H6Mz5JyKnPNqlp/vANMPcXtnkRMJmZ/Qwhvzc5JzjHl+nmLHHJIk6MHxVQ4WAaZo2j8iz8+sDkjOedS+Ugc8jPzevN5YiJwq1ltScJ5LP5QHm1f8tDA/arqV1zXOFuoa++cMlGldr7JFzqx/MumH5fWG/eO/2P082PQToM+OsX/os94CB31PjLipzs8DXMM+FWIgkhbmSRHpKtRxnHM0xyS+bzqm5pnEMwEH0NwDzfV9zcdzxwPie+vEkyOsy3NpqaXeef0HYqrIVQ==:64B4';
        codeToWrite = codeToWrite + '^FT597,328^A0I,51,50^FH\^FDCPR:^FS';
        codeToWrite = codeToWrite + '^FT469,328^A0I,51,50^FH\^FD' + cpr + '^FS';
        codeToWrite = codeToWrite + '^FT597,250^A0I,51,50^FH\^FDNavn:^FS';
        codeToWrite = codeToWrite + '^FT469,249^A0I,45,45^FH\^FD' + name + '^FS';
        codeToWrite = codeToWrite + '^FT597,157^A0I,51,50^FH\^FDDato:^FS';
        codeToWrite = codeToWrite + '^FT469,157^A0I,51,50^FH\^FD' + today + '^FS';
        codeToWrite = codeToWrite + '^FT28,200^BQN,2,6';
        codeToWrite = codeToWrite + '^FH\^FDMA,{"patientId":' + cprWODash + '}^FS';
        codeToWrite = codeToWrite + '^PQ1,0,1,Y^XZ';
        writeToSelectedPrinter(codeToWrite);
        return false;
    }

    //Handle label printer status
    var selected_label_device;
    var selected_zebra_device;
    //Get the default device from the application as a first step. Discovery takes longer to complete.
    BrowserPrint.getDefaultDevice("printer", function(device)
                                  {
        //Add device to list of devices and to html select element
        selected_label_device = device;
        selected_zebra_device = new Zebra.Printer(device);
        var intervalId = window.setInterval(function(){
            selected_zebra_device.getStatus().then(function (status) {
                var span = document.getElementById("label_printer_status_text");
                span.innerHTML = '';
                var b = document.createElement("b");
                var text = document.createTextNode(status.getMessage());
                b.appendChild(text);
                span.appendChild(b);
            });
        }, 1000);

    }, function(error){
        var span = document.getElementById("label_printer_status_text");
        span.innerHTML = '';
        var b = document.createElement("b");
        var text = document.createTextNode("Printer ikke forbundet");
        b.appendChild(text);
        span.appendChild(b);
    });
    function writeToSelectedPrinter(dataToWrite)
    {
        if(selected_label_device){
            selected_label_device.send(dataToWrite, undefined, errorCallback);
        }else{
            alert('Kan ikke printe da label printer ikke er forbundet.')
        }
    }
    var errorCallback = function(errorMessage){
        alert("Error from printer: " + errorMessage);
    }


})();


