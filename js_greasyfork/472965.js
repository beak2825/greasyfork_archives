// ==UserScript==
// @name         Ziovanni
// @namespace    ziovanni.zero.torn
// @version      0.2
// @description  itemmarket tracker
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472965/Ziovanni.user.js
// @updateURL https://update.greasyfork.org/scripts/472965/Ziovanni.meta.js
// ==/UserScript==

let apis = ['']; // API keys
let checkTime = 1000;  // check time in miliseconds


let url = window.location.href;



let apiindex = -1;
let itemindex = -1;

let container = `<div id="ziovannicontainer"><div>`;

let itemid = localStorage.ziovanni || "[]";
itemid = JSON.parse(itemid);

let items = {};

GM_addStyle(
    `
    #ziovannicontainer {
        position: absolute;
        
        left: 0;
        top: 10%;
        font-size: 20px;
        max-height: 100%;
        overflow-y: scroll;
        
    }

    #ziovannicontainer::-webkit-scrollbar {
        display:none;
        }
    `
);

function insertAdd(){
    if ($('#additem').length > 0){
        setTimeout(insertAdd, 300);
        return;
    }
    url = window.location.href;

    $('.content-title > h4').append(`<input type="Submit" value="Add Item" class="torn-btn" id="additem">`);
    $('#additem').on('click', function(){
        let currentList = localStorage.ziovanni || "[]";
        currentList = JSON.parse(currentList);

        let itemIid = url.split("type=")[1];
        if (currentList.includes(itemIid)){
            $("#additem").attr("value", "Already Added!");

        }
        else{
            currentList.push(itemIid);
            $("#additem").attr("value", `Added ${itemIid}`);

        }

        localStorage.ziovanni = JSON.stringify(currentList);
        

    })

}



if (url.includes("p=shop&type=")){
    setInterval(insertAdd, 500);
    // insertAdd();

}

function getItemId() {
    itemindex++;
    if (itemindex >= itemid.length) {
        itemindex = 0;
    }

    return itemid[itemindex];

}

async function insert() {
    if ($("#ziovannicontainer").length > 0){
       
        return;

    }
    $("body").append(container);
    let api = getAPI();
    let itemss = await $.getJSON(`https://api.torn.com/torn/?selections=items&key=${api}`);

    for (let iid in itemss.items) {
        items[iid] = itemss.items[iid].name;
    }

    

    // setInterval(checkPrice, 3000);
}

async function checkPrice() {

    if (itemid.length == 0){
        return;
    }
    let item = getItemId();
    let price = await getPrice(item);

    if ($(`#itemzio-${item}`).length > 0) {
        $(`#itemziomarket-${item}`).html("$" + price[1].toLocaleString("en-US"));
        $(`#itemziobazaar-${item}`).html("$" + price[0].toLocaleString("en-US"));
    }
    else {
        let box = `<a href="https://www.torn.com/imarket.php#/p=shop&type=${item}" target="_blank">
        <div id="itemzio-${item}">
        ${items[item]}
        <p>IMarket: <span id="itemziomarket-${item}">$${price[1].toLocaleString("en-US")}</span></p>
        <p>Bazaar: <span id="itemziobazaar-${item}">$${price[0].toLocaleString("en-US")}</span></p>
      </div>
      </a>
      <br>
      
        `;

        $(`#ziovannicontainer`).append(box);


    }

}

async function getPrice(i) {
    let api = getAPI();
    let link = `https://api.torn.com/market/${i}?selections=bazaar,itemmarket&key=${api}`;

    console.log(link);



    let responseJ = await $.getJSON(link);

  

    let bazaarPrice = -1;
    let itemPrice = -1;

    if (responseJ.bazaar) {
        bazaarPrice = responseJ.bazaar[0].cost;
    }
    if (responseJ.itemmarket) {
        bazaarPrice = responseJ.itemmarket[0].cost;
    }

    return [bazaarPrice, itemPrice];


}


$(document).on('keypress', async function (e) {
    if (e.which == 113) {
        // $('.content').append(container);
        insert();

    }
    if (e.which == 114) {
        // $('.content').append(container);
        checkPrice();

    }
});

setInterval(insert, 300);
setInterval(checkPrice, checkTime);




function getAPI() {
    apiindex++;
    if (apiindex >= apis.length) {
        apiindex = 0;
    }
    return apis[apiindex];
}

