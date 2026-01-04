// ==UserScript==
// @name         Dune Csv Export
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  Downloading the queries csv export for free subscription users
// @author       lulu
// @match        https://dune.com/queries*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dune.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/478062/Dune%20Csv%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/478062/Dune%20Csv%20Export.meta.js
// ==/UserScript==

function getElementByXpath(path){
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function getNextButton(){
    let pageBar = getElementByXpath('//*[@id="results"]/div/div[2]/div/div/div[2]/ul/li[3]/ul');
    var nbli = pageBar.lastChild;
    var nb = nbli.childNodes;
    return nb[0];


}

function getHeaders(table){
    const headers = [];
    $.each($(table).find("thead").find("tr").find("th"), function (key, val2) {
        headers[key] = $(val2).text(); //$(val2).find("div").text();
    });
    return headers;
}

async function getCurrentTableValues(){
    const maxAttempts = 100; // Adjust as needed - determines maximum wait time.  50 attempts * 100ms = 5 seconds
    let attempt = 0;
    let table = null;
    const values = [];

    while (attempt < maxAttempts) {
        table = getElementByXpath('//*[@id="results"]/div/div[2]/div/div/div[1]/table');
        if (table !== null && table !== undefined ) { // check for both null and undefined
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempt++;
    }
    if (table === null || table === undefined ) { // check for both null and undefined
        console.log("Table collect faild after 100 attempts, Returning Empty!");
        return values;
    }

    $.each($(table).find("tbody tr"), function(rowIndex, rowElement) {
        const row = [];
        $.each($(rowElement).find("td"), function(cellIndex, cellElement) {
            const cellValue = $(cellElement).find("div").first().text();
            row.push(cellValue.trim());
        });

        values.push(row);
    });

    return values;
}

async function collect_pages(){
    let table = getElementByXpath('//*[@id="results"]/div/div[2]/div/div/div[1]/table');
    let custom_limit = document.getElementById("customRowLimit").value;
    const limit = (str => str.trim() === '' ? null : parseInt(str))(custom_limit);

    let hasNextPage = true;
    let collectedData = [];
    do {
        const currValues = await getCurrentTableValues();
        collectedData.push(...currValues);

        const nextButton = getNextButton();
        hasNextPage = Boolean(
            nextButton &&
            !$(nextButton).is(":disabled") &&
            !nextButton.disabled
        );

        if (!$(nextButton).is(":disabled") && nextButton != null){
            $(nextButton).trigger("click");
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        if (limit != null && collectedData.length >= limit) {
            break
        }

    } while (hasNextPage)

    const headers = getHeaders(table);
    download_csv(headers, collectedData);
}

function escapeCsvValue(value) {
    if (typeof value !== 'string') value = String(value);
    value = value.replace(/"/g, '""');
    return `"${value}"`;
}

function download_csv(headers, rows) {
    let csvHeaders = (headers.join(",") + "\n").replace("#", "x");
    let csvRows = rows.map(row => row.map(escapeCsvValue).join(",")).join("\n");
    let csvButton = document.getElementById("csvDownloadBTN");
    let custom_name = document.getElementById("customNameCsvFileFree").value;


    var downloadBtn = document.createElement("a");
    downloadBtn.href = "data:text/csv;charset=utf-8,"+encodeURI(csvHeaders+csvRows);
    downloadBtn.target = "_blank";

    if (custom_name.length > 1) {
        downloadBtn.download = custom_name+".csv";
    } else {
        let url = window.location.href;

        downloadBtn.download = "query_"+url.split("queries/")[1].replace("/", "_")+".csv"
    }

    downloadBtn.click();

    csvButton.disabled = false;


}


async function collectCsv() {
    let csvButton = document.getElementById("csvDownloadBTN");
    csvButton.disabled = "disabled";

    let nextButton = getNextButton();
    if (nextButton == null || !nextButton.disabled){
        await collect_pages();
    } else {
        // go to first
        let firstPageBtn = getElementByXpath('//*[@id="results"]/div/div[2]/div/div/div[2]/ul/li[3]/ul/li[2]/button'); //('//*[@id="results"]/div/div[2]/div/div[2]/ul/li[3]/button');
        if (firstPageBtn != null && !$(firstPageBtn).is(":disabled")){
            $(firstPageBtn).trigger("click");
            await new Promise(resolve => setTimeout(resolve, 5));
            await collect_pages();

        } else {
            await collect_pages();
        }
    }

}

function changeCsvButton(){
    // console.log("DS RUNNING");

    let csvButton = getElementByXpath('//*[@id="results"]/div/div[1]/div/a[1]');
    if (csvButton != null){

        var csv_btn_element = document.createElement("button");
        csv_btn_element.innerHTML = "Download CSV";
        csv_btn_element.className = "IconButton_iconButton__bWEeL buttonThemes_button__dGQts buttonThemes_theme-secondary__4HFHN IconButton_size-M__BKA_b";
        csv_btn_element.onclick = collectCsv;
        csv_btn_element.id = "csvDownloadBTN";

        var inp_element = document.createElement('input');
        inp_element.className = "IconButton_iconButton___v3YQ buttonThemes_button__jfRFC buttonThemes_theme-tertiary__v7VoN IconButton_size-M__FIXfN";
        inp_element.id = "customNameCsvFileFree";
        inp_element.placeholder = "Custom filename";

        var limit_inp_element = document.createElement('input');
        limit_inp_element.className = "IconButton_iconButton___v3YQ buttonThemes_button__jfRFC buttonThemes_theme-tertiary__v7VoN IconButton_size-M__FIXfN";
        limit_inp_element.id = "customRowLimit";
        limit_inp_element.placeholder = "Limit Csv Rows";
        limit_inp_element.type = 'number';
        limit_inp_element.min = '0';

        getElementByXpath('//*[@id="results"]/div/div[1]/div[1]').appendChild(inp_element);
        getElementByXpath('//*[@id="results"]/div/div[1]/div[1]').appendChild(limit_inp_element);
        getElementByXpath('//*[@id="results"]/div/div[1]/div[1]').appendChild(csv_btn_element);


        //console.log("");

    } else {
        setTimeout(()=>{
            changeCsvButton();
        }, 1000)
    }
}


(function() {
    'use strict';
    $(document).ready ( function(){
        changeCsvButton();
    });
})();