// ==UserScript==
// @name         LEKI PODPOWIEDZ
// @namespace    http://tampermonkey.net/
// @version      2024-11-09
// @description  Skrypt ten pokazuje jakie firmy sa producentami lekow dotepnych w dropdown w systemie do wystawiania recept
// @author       You
// @match        https://www.google.com/*
// @match        https://www.google.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.3/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/500503/LEKI%20PODPOWIEDZ.user.js
// @updateURL https://update.greasyfork.org/scripts/500503/LEKI%20PODPOWIEDZ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery.noConflict();
    console.log("Start");
    var LEKI_URL = 'http://localhost:9000/Downloads/leki.json';

    function myFunction() {
        // Declare variables
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("filtr");
        filter = input.value.toUpperCase().split(" ");

        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            var td1 = tr[i].getElementsByTagName("td")[1];
            var td3 = tr[i].getElementsByTagName("td")[3];

            if (td1 || td3) {
                txtValue = td1.innerText + td3.innerText;
                const index = filter.every(v => txtValue.toUpperCase().indexOf(v) > -1);

                if (index) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    function addStyle(styleText) {
        let s = document.createElement('style')
        s.appendChild(document.createTextNode(styleText))
        document.getElementsByTagName('head')[0].appendChild(s)
    }

    console.log("After addstyle");

    addStyle(`.ui-dialog {
	min-width: 800px;
    height: auto;
	z-index: 1000;
}`);
    addStyle(`.ui-dialog .ui-dialog-title {
	width:94%
}`);
    addStyle(`.ui-dialog .ui-dialog-content {
	background: white;
}`);

console.log("After addstyle2");
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id = 'cssId';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://code.jquery.com/ui/1.13.3/themes/smoothness/jquery-ui.css';
    link.media = 'all';
    head.appendChild(link);

    console.log("After append css");


    function executeRest() {
        console.log("executing rest");
        const newDiv = document.createElement('div');
        newDiv.id = "dialogbox";
        document.body.appendChild(newDiv);

        console.log("before $");
        jQuery("#dialogbox").dialog({
            autoOpen:false,
            title:"Podpowiedz",
            width:400,
            height:400,
            position: { my: 'left top', at: 'left+50 top+50'},
            resizable: true,
            closeText: "",
            open: function() {
                jQuery(this).closest(".ui-dialog")
                    .find(".ui-dialog-titlebar-close")
                    .removeClass("ui-dialog-titlebar-close")
                    .html("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'></span>");
            }
        }).dialog( "open" );

        console.log("Will create XMLHttpRequest");
        var req = new XMLHttpRequest();
        console.log("1");

        function createCallback(x) {
            console.log("This is createCallback");
            return function (x) {
                console.log("This is onreadystatechange");
                if (req.readyState == 4 && req.status == 200) {

                    //console.log();
                    var leki = JSON.parse(req.responseText);
                    var wynik = leki.data.filter((e) => e.nazwaWyswietlana != '');


                    var table = '<p><input id="filtr" style="width: 750px" placeholder="Search for names.."/></p><table id="myTable">';

                    wynik.forEach(
                        function(lek) {
                            var counter = 0;
                            lek.opakowania.filter((op) => op.nazwaWyswietlana != '').forEach(
                                function(op) {
                                    table+='<tr>'+'<td>'+counter++ + ' </td><td style="width:40%"> ' + lek.nazwaWyswietlana + ' </td><td style="width:20%"> ' + op.nazwaWyswietlana + ' </td><td> ' + op.podmiotOdpowiedzialny + ' </td></tr>';
                                });
                        });
                    table += '</table>';

                    jQuery("#dialogbox").html(table);
                    jQuery("#filtr").on("keyup", myFunction);
                    return true;
                }
            };
        }

        console.log("2");
        req.open('POST', LEKI_URL, true);
        console.log("3");
        req.onprogress = () => {
            console.log("LOADING", req.readyState); // readyState will be 3
        };

        req.onload = () => {
            console.log("DONE", req.readyState); // readyState will be 4
        };

        req.onreadystatechange = createCallback(req);

        console.log("4");
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        console.log("5");

        let params = {
            "nazwaLeku": "beta",
            "substancjaCzynna": null,
            "wskazanie": null,
            "refundacja": false,
            "parametryStronicowania": null,
            "isSesjaWizytyPacjent": true
        };
        req.send(JSON.stringify(params));
        console.log("XMLHttpRequest sent");

    }

    console.log("before execute rest");

    executeRest();

    console.log("after execute rest");
})();