// ==UserScript==
// @name         ASA Resume Compiler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract your sailing resume from ASA website!
// @author       You
// @match        https://members.asa.com/voyage_log.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asa.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476659/ASA%20Resume%20Compiler.user.js
// @updateURL https://update.greasyfork.org/scripts/476659/ASA%20Resume%20Compiler.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let progressIndicatorItem = document.createElement("span");
    let buttonItem = document.createElement("button");

    function updateProgressIndicator(msg) {
        progressIndicatorItem.innerHTML = "&nbsp;&nbsp;" + msg;
    }

    function createDownloadButtonAndProgressIndicator() {
        let containerDiv = document.getElementsByClassName("theme-showcase")[0];
        let newItem = document.createElement("div");
        buttonItem.appendChild(document.createTextNode("Generate resume"));

        newItem.appendChild(buttonItem);
        newItem.appendChild(progressIndicatorItem);
        containerDiv.prepend(newItem);
    }
   

    function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }



    function parseUsDate(dt) {
        let dateElements = dt.split("/");
        let dateStr = dateElements[2] + "-" + dateElements[0] + "-" + dateElements[1];
        let dateObj = Date.parse(dateStr);
        return dateObj;
    }

    function compareBySortField(b, a) {
        if (a.sortField < b.sortField) {
            return -1;
        }
        if (a.sortField > b.sortField) {
            return 1;
        }
        return 0;
    }

    function createTableHtml(allEntries) {
        for (let i=0; i<allEntries.length; i++) {
            let record = allEntries[i];
            if (record.DepartureDate == null || record.DeparetureDate == "") record.DepartureDate = new Date();
            record.sortField = parseUsDate(record.DepartureDate);
        }

        allEntries.sort(compareBySortField);


        let b = "<h3>Sailing Resume</h3>";
        b+= ("<h1>" + document.getElementsByClassName("user-info-name")[0].innerText + "</h1>");
        b+= "<table border=1><thead><th>#</th><th>Departure date</th><th>Duration (days)</th><th>Distance (nm.)</th><th>Role</th><th>Vessel</th><th>Type</th><th>Length (ft.)</th><th>Owner</th></thead>";

        for (let i=0; i<allEntries.length; i++) {
            let record = allEntries[i];
            b += "<tr>";
            b += ("<td>" + (i+1) + "</td>");
            b += ("<td>" + record.DepartureDate + "</td>");
            b += ("<td>" + record.DaysAboard + "</td>");
            b += ("<td>" + record.Distance + "</td>");
            b += ("<td>" + record.ServedAs + "</td>");
            b += ("<td>" + record.Vessel + "</td>");
            b += ("<td>" + record.VesselType + "</td>");
            b += ("<td>" + record.VesselLength + "</td>");
            b += ("<td>" + record.VesselOwner + "</td>");
            b += "</tr>";
        }
        b += "</table>";
        return b;

    }

    //Click links programmatically and collect data
    //note that page is not reloaded on click
    async function clickAllLinks() {
        updateProgressIndicator("Starting...");

        //get response from the same page but without being post processed by JS
        const htmlOnlyResponse = await fetch("https://members.asa.com/voyage_log.php#");
        let htmlOnlyText = await htmlOnlyResponse.text();

        updateProgressIndicator("Fetched data...");

        let parser = new DOMParser();
        var htmlOnlyDoc = parser.parseFromString(htmlOnlyText, "text/html");
        let allTrs = htmlOnlyDoc.getElementsByClassName("jq_dataTableResults")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");



        let allEntries = [];
        let allKeys = {};

        for (let i=0; i<allTrs.length; i++) {

            updateProgressIndicator("Processing entry " + (i+1) + "...");

            let href = "https://members.asa.com/" + allTrs[i].getElementsByTagName("td")[0].getElementsByTagName("a")[0].getAttribute("href");

            const formResponse = await fetch(href);
            let formText = await formResponse.text();
            let parser = new DOMParser();
            var formDoc = parser.parseFromString(formText, "text/html");

            let nextRecord = {};

            let inputs = formDoc.querySelectorAll("input.form-control");
            inputs.forEach((nextInput) => {
                let nextKey = nextInput.getAttribute("id");
                let nextValue = nextInput.value;
                allKeys[nextKey]=1;
                nextRecord[nextKey]=nextValue;

            });
            allEntries.push(nextRecord);
        }

        updateProgressIndicator("Creating the output...");

        let txt = createTableHtml(allEntries);
        download("sailing_resume.html",txt);

        updateProgressIndicator("Done!");
        console.log(allKeys);

    }

    buttonItem.onclick = clickAllLinks;
    createDownloadButtonAndProgressIndicator();
    
})();