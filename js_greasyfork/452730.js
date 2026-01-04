// ==UserScript==
// @name         ACL Printing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Printing for ACLs
// @author       Hayden Lindsey 10/08/2022
// @match        http://sortcenter-menu-na.amazon.com/containerization/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452730/ACL%20Printing.user.js
// @updateURL https://update.greasyfork.org/scripts/452730/ACL%20Printing.meta.js
// ==/UserScript==
/*globals printLabelManager*/

(function() {
    'use strict';
    var url = document.URL;
    if(url == "http://sortcenter-menu-na.amazon.com/containerization/printLabel")
    {
        console.log(document.URL);
        var printlist = [];
        addelements();
    }
    else
    {
        console.log("2");
        console.log(printlist);
    }
    ///////////ADD ELEMENTS/////////////
    function addelements()
    {
        console.log("addelements");
        //margin top right bottom left
        //style.width/height = "auto";
        var place = document.getElementById("sd_input").parentElement;
        var printta = document.createElement("textarea");
        printta.setAttribute("id", "printta");
        printta.style.margin = "0px 6px 0px 6px";
        printta.innerHTML = "Pallets";

        var printerip = document.createElement("input");
        printerip.setAttribute("type", "text");
        printerip.setAttribute("id", "printerip");
        printerip.style.margin = "0px 6px 0px 6px";
        printerip.value = "Printer IP address";

        var printbutton = document.createElement("button");
        printbutton.setAttribute("id", "printb");
        printbutton.innerHTML = "Print";
        printbutton.addEventListener("click", printpallets);

        place.appendChild(printta);
        insertAfter(printta, printerip);
        insertAfter(printerip, printbutton);
    }
    var printcount = 0;
    function printpallets()
    {
        var sdi = document.getElementById("sd_input");
        var pip = document.getElementById("printerip");
        var splitta = document.getElementById("printta").value.split(/\r?\n/);
        printlist.push(splitta);//adds every line frmo textarea to list split by newline
        console.log("1");
        console.log(printlist);
        print();
        function print()
        {
            if(printcount < splitta.length)
            {
                sdi.value = splitta[printcount];//sets textbox value to list[printcount]
                printcount++;
                sdi.dispatchEvent(new KeyboardEvent('keypress', {'keyCode':13} ));//clicks enter on textbox
                setTimeout(function(){
                    sdi.value = pip.value;// sets textbox value to printerIP
                },500);
                setTimeout(function(){
                    sdi.dispatchEvent(new KeyboardEvent('keypress', {'keyCode':13} ));//clicks enter on textbox
                },800);
                setTimeout(function(){
                    printLabelManager.beginPrintLabel();
                     print();
                },1500);
            }
            else if (printcount>=splitta.length)
            {
                console.log("Done");
                printcount = 0;
                printlist = [];
            }
        }
    }
    function setNativeValue(element, value)
    {
        let lastValue = element.value;
        element.value = value;
        let event = new Event("change", { target: element, bubbles: true });

        event.simulated = true;
        let tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }
    function insertAfter(referenceNode, newNode)
    {
        // console.log("insertafter");
        // console.log("r: ", referenceNode);
        // console.log(newNode);
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
})();