// ==UserScript==
// @name         Shopify Shipping labels
// @version      1.5
// @description  Generates shipping labels
// @author       Apina-32
// @match        https://juhiksentarrakauppa-fi.myshopify.com/admin/*
// @icon         https://www.google.com/s2/favicons?domain=myshopify.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        window.close
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_notification
// @namespace https://greasyfork.org/users/779688
// @downloadURL https://update.greasyfork.org/scripts/431378/Shopify%20Shipping%20labels.user.js
// @updateURL https://update.greasyfork.org/scripts/431378/Shopify%20Shipping%20labels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const csvSeparator = ',';


    let menu = GM_registerMenuCommand("Download", getOrderIds);
    let menu3 = GM_registerMenuCommand("Generate File", download_csv_file);
    let currentUrl = window.location.href;

    function matchRule(str, rule) {
        var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }

    if(matchRule(window.location.href, "https://juhiksentarrakauppa-fi.myshopify.com/admin/orders/*") && GM_getValue("run", "") == "active") {
        window.setTimeout(getAddresses, 2000);
        window.setTimeout(function(){location.reload();}, 30000);
    }

    function getAddresses(){
        try{
            let array = document.querySelector(".aG2SI").children[0].children[0].innerText.split("\n");
            array.pop();
            array.pop();
            let id = document.querySelector(".Polaris-Header-Title_2qj8j").innerText;
            array.push(id);
            let adr = JSON.parse(GM_getValue("Addresses", "[]"));
            adr.push([array]);
            console.log(adr);
            console.log(document.querySelector(".aG2SI").children[0].children[0].innerText);
            GM_setValue("Addresses", JSON.stringify(adr));
            window.close();
        }
        catch(e){
            console.log(e);
            window.setTimeout(getAddresses, 500);
        }
    }

    //create a user-defined function to download CSV file
    function download_csv_file() {
        let csvData = [['Name', 'Street', 'ZipCode', 'ID']];
        let data = JSON.parse(GM_getValue("Addresses", "[]"))
        data.forEach(i => {
            let name = formatName(i[0][0]);
            let street = formatStreet(i[0][1]);
            let zip = i[0][2].toUpperCase();
            let id = i[0][3].slice(1);
            csvData.push([name, street, zip, id]);
            /*
        const PADDING = 30;
        const ADRPERROW = 3;
        let csvData = undefined;
        let data = JSON.parse(GM_getValue("Addresses", "[]"))
        data.forEach(i => {
             if(csvData == undefined){
                csvData = [[i[0][0].padEnd(PADDING, ' ')],[i[0][1].padEnd(PADDING, ' ')],[i[0][2].padEnd(PADDING, ' ')]];
                 return;
            }
            console.log(csvData[csvData.length-3][0].length);
            if(csvData[csvData.length-3][0].length >= ADRPERROW*PADDING){
                csvData.push([i[0][0].padEnd(PADDING, ' ')],[i[0][1].padEnd(PADDING, ' ')],[i[0][2].padEnd(PADDING, ' ')]);
                return;
            }
            csvData[csvData.length-3][0] += (i[0][0].padEnd(PADDING, ' '));
            csvData[csvData.length-2][0] += (i[0][1].padEnd(PADDING, ' '));
            csvData[csvData.length-1][0] += (i[0][2].padEnd(PADDING, ' '));*/
        });
        console.log(csvData);

        //define the heading for each row of the data
        var csv = '';

        //merge the data with CSV
        csvData.forEach(function(row) {
            csv += row.join(csvSeparator);
            csv += "\n";
        });

        //display the created CSV data on the web browser
        //document.write(csv);


        var hiddenElement = document.createElement('a');
        //hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        csv = "\ufeff" + csv; // Add utf BOM mark
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';

        //provide the name for the CSV file to be downloaded
        hiddenElement.download = 'Shipping labels.csv';
        hiddenElement.click();
    }

    //document.querySelector("._1daZ2").children[0].children[0].innerText

    function getOrderIds(){
        var aTags = document.getElementsByTagName("span");
        var searchText = "Valitse Tilaus";
        var ids = [];

        for (let i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
                let elem = aTags[i].parentElement.children[0].children[0].children[0];
                if(elem.getAttribute('aria-checked') != 'true') continue;
                //ids.push(elem.id.split('/')[4]);
                let link = aTags[i].parentElement.parentElement.parentElement.parentElement.parentElement.children[1].children[0].href;
                console.log(link);
                ids.push(link);
            }
        }
        console.log(ids);
        GM_setValue("Addresses", JSON.stringify([]));
        GM_setValue("run", "active");

        let i = 0;
        function openLinks(){
            console.log(JSON.parse(GM_getValue("Addresses", "[]")));
            console.log(i);
            if(JSON.parse(GM_getValue("Addresses", "[]")).length == ids.length) {
                GM_setValue("run", "");
                GM_notification({
                    text: "Download Ready!",
                    title: "Shopify",
                    timeout: 20000
                });
                download_csv_file();
                return;
            }
            else if(JSON.parse(GM_getValue("Addresses", "[]")).length == i){
                GM_openInTab(ids[i], true);
                i++;
            }
            window.setTimeout(openLinks, 500);
        }
        openLinks();
    }

    const formatStreet = text => {
        let i = 0;
        if(text.includes(',')) return text.replace(',', "");
        text = Array.from(text);
        let numberPassed = 0;
        text[0] = text[0].toUpperCase();
        while(i < text.length) {
            let char = text[i];
            //console.log(i + " | " + text[i] + " | " + char + " | " + text.join(''));
            if(!isNaN(char) && char != ' ') {
                if(numberPassed == 0) numberPassed = i;
                if(isNaN(text[i-1]) && text[i-1] != ' ') {
                    text.splice(i, 0, ' ')
                    //i++
                }
            }
            else if(isNaN(char) && char != ' ') {
                if(!isNaN(text[i-1]) && text[i-1] != ' ') {
                    text.splice(i, 0, ' ')
                    //i++
                }
            }
            i++;
        };
        text = text.join('');
        text = text.substr(0, numberPassed) + text.slice(numberPassed).toUpperCase();

        if(text.slice(numberPassed).includes("AS")) text = text.substr(0, numberPassed) + text.slice(numberPassed).replace("AS", "as.");
        else if(text.slice(numberPassed).includes("As")) text = text.substr(0, numberPassed) + text.slice(numberPassed).replace("As", "as.");
        else if(text.slice(numberPassed).includes("as")) text = text.substr(0, numberPassed) + text.slice(numberPassed).replace("as", "as.");
        //console.log(text);
        return text;
    };

    const formatName = name => {
        if(Array.from(name).includes(' ')) name = name[0].toUpperCase() + name.substr(1, name.indexOf(' ')) + name[name.indexOf(' ') + 1].toUpperCase() + name.substr(name.indexOf(' ') + 2);
        return name;
    };

})();