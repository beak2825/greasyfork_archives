// ==UserScript==
// @name         Stock Vault
// @namespace    vaultstock.nao.zero
// @version      0.3
// @description  Use Stock Market as a vault
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503911/Stock%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/503911/Stock%20Vault.meta.js
// ==/UserScript==

let stocks = {};
let stockId = {};

function insert() {
    let current = localStorage.stockVault;
    let symbols = [];
    if ($("ul[class^='stock_']").length == 0) {
        setTimeout(insert, 500);
        return;
    }
    $("ul[class^='stock_']").each(function () {
        let sym = $("img", $(this)).attr("src").split("logos/")[1].split(".svg")[0];
        symbols.push(sym);
        // console.log($(this));
        stockId[sym] = $(this).attr("id");
        stocks[sym] = $("div[class^='price_']", $(this));



    });
    let container = `<div>
        <select name="stock" id="stockid"><option value=""></option>`;
    for (let sy of symbols) {
        if (current && current == sy) {
            container += `<option value="${sy}" selected="selected">${sy}</option>`;

        }
        else {
            container += `<option value="${sy}">${sy}</option>`;
        }

    }

    container += `</select>
        <button id="vaultall" class="torn-btn">Vault</button>
        <input type=number" placeholder="Amount" id="sellval">
        <button id="sellamt" class="torn-btn">Withdraw</button></div>
        <span id="responseStock"></span>`;

    $("#stockmarketroot").prepend(container);
    $("#stockid").change(updateStock);
    $("#vaultall").on("click", vault);
    $("#sellamt").on("click", withdraw);
    $("#sellval").on("keyup", updateKMB);




}

function updateStock() {
    // console.log(getPrice($("#stockid").attr("value")));
    localStorage.stockVault = $("#stockid").attr("value");

}

function getPrice(id) {
    return parseFloat($(stocks[id]).text());
}

function vault() {
    let symb = localStorage.stockVault;
    let money = parseInt(document.getElementById('user-money').getAttribute('data-money'));
    let price = getPrice(symb);
    let amt = Math.floor(money / price);

    $.post(`https://www.torn.com/page.php?sid=StockMarket&step=buyShares&rfcv=${getRFC()}`,
        {
            stockId: stockId[symb],
            amount: amt,

        }, function (response) {
            // response = JSON.parse(response);

            $("#responseStock").html(response.success ? "Vaulted" : "Failed");
            $("#responseStock").css("color", response.success ? "green" : "red");


        });

}

function updateKMB(){
    let val = $("#sellval").attr("value").toLowerCase();
    val = val.replace("k", "000").replace("m", "000000").replace("b", "000000000");
    $("#sellval").attr("value", val);

}

function withdraw() {
    let symb = localStorage.stockVault;
    let val = parseFloat(($("#sellval").attr("value")))/0.999;
    let price = getPrice(symb);
    let amt = Math.ceil(val/price);
    console.log(val, price, amt);
    $.post(`https://www.torn.com/page.php?sid=StockMarket&step=sellShares&rfcv=${getRFC()}`,
        {
            stockId: stockId[symb],
            amount: amt,

        }, function (response) {
            // response = JSON.parse(response);

            $("#responseStock").html(response.success ? "Withdrawn" : "Failed");
            $("#responseStock").css("color", response.success ? "green" : "red");


        });

}

function getRFC() {
    var rfc = $.cookie('rfc_v');
    if (!rfc) {
        var cookies = document.cookie.split('; ');
        for (var i in cookies) {
            var cookie = cookies[i].split('=');
            if (cookie[0] == 'rfc_v') {
                return cookie[1];
            }
        }
    }
    return rfc;
}

insert();