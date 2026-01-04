// ==UserScript==
// @name         Sales Navigator Addon
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Get Sales Navigator Links
// @author       Odahviing
// @match        https://www.linkedin.com/sales/lists/company/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389385/Sales%20Navigator%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/389385/Sales%20Navigator%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.URL.indexOf('sortCriteria') < 0) return;
    addOption();
})();

var allCompanies = [];
var allItems = [];

let COMPANYPAGE = `https://www.linkedin.com/sales/company/{0}/people`;

function addOption() {
    let listItem = document.getElementsByClassName('button--unstyled lists-nav__edit-list-button')[0];
    let newButton = document.createElement('button');
    newButton.innerHTML = 'Extract';
    newButton.id = 'extract_button';
    newButton.type = 'button';
    listItem.outerHTML += newButton.outerHTML;
    document.getElementById('extract_button').addEventListener('click', getAllPages);
}

async function getAllPages(){
    let pageAmount = document.getElementsByClassName('artdeco-table-numeric-pagination')[0].getElementsByTagName('li').length;
    console.log(`Detecting ${pageAmount} Pages`);

    for (let pageIndex = 0 ; pageIndex < pageAmount; pageIndex++)
    {
        let pageToSearch = pageIndex == 0 ?
            document.URL : document.URL.replace('sortCriteria=CREATED_TIME', `page=${pageIndex + 1}&sortCriteria=CREATED_TIME`);
        console.log(`Working on Page: ${pageToSearch}`);
        let pageObject = await sendRequst(pageToSearch);
        let item = pageObject.getElementsByTagName('code')[8];
        let jsonItem = divToJson(item);
        for (let index = 0; index < jsonItem.elements.length; index++) {
            let entityUrn = jsonItem.elements[index].entityUrn;
            entityUrn = entityUrn.substring(23);
            allCompanies.push(entityUrn);
        }
    }

    console.log(`Got ${allCompanies.length} Comapnies`);

    for (let i = 0 ; i < allCompanies.length; i++) {
        let pageToSearch = COMPANYPAGE.replace('{0}', allCompanies[i]);
        console.log(`Reading data for company: ${pageToSearch}`);
        let result = await sendRequst(pageToSearch);
        await sleep(10000);
        let item = result.getElementsByTagName('code')[12];
        let jsonItem = divToJson(item);

        if (!jsonItem.website) {
            i = i - 1;
            continue;
        }

        allItems.push(jsonItem.website);
    }

    console.log(allItems.join('\n'));
}

function divToJson(elem) {
    return JSON.parse(elem.innerHTML);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendRequst(url) {
    return new Promise(function (fulfill, reject){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url , true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send();
        xhttp.onreadystatechange = function () {
          if(xhttp.readyState === 4 && xhttp.status === 200) {
              var div = document.createElement('div');
              div.id = "req_id";
              div.innerHTML = xhttp.responseText;
              return fulfill(div);
          }
        };
    });
}