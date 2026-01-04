// ==UserScript==
// @name         Steamlvlbot
// @version      0.21
// @description  Bot that will buy set of card.
// @author       Zeper
// @match        https://steamlvlup.com/
// @match        https://steamlvlup.com/inventory
// @grant        none
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369568/Steamlvlbot.user.js
// @updateURL https://update.greasyfork.org/scripts/369568/Steamlvlbot.meta.js
// ==/UserScript==

var NeverStop = false;
if(localStorage.NeverStop === undefined) {localStorage.setItem("NeverStop", false);} else {NeverStop = JSON.parse(localStorage.getItem("NeverStop"));}

if(localStorage.PREV_USER_BALANCE === undefined) {} else {if(localStorage.PREV_USER_BALANCE != USER_BALANCE){localStorage.removeItem("PREV_USER_BALANCE");}else{localStorage.removeItem("PREV_USER_BALANCE");if(NeverStop){localStorage.setItem("IsBotOn", false);console.log("User balance same as previous, bot can't purchase... the bot will shutdown");}}}

var IsDebug = false;
if(localStorage.IsDebug === undefined) {localStorage.setItem("IsDebug", false);} else {IsDebug = JSON.parse(localStorage.getItem("IsDebug"));}

var IsCustom = false;
if(localStorage.IsCustom === undefined) {localStorage.setItem("IsCustom", false);} else {IsCustom = JSON.parse(localStorage.getItem("IsCustom"));}

var CustomName = "";
if(localStorage.CustomName === undefined) {localStorage.setItem("CustomName", "");} else {if(localStorage.CustomName.length > 0) {CustomName = escape(escape(localStorage.getItem("CustomName")));}}
if (IsDebug) {console.log("CustomName escaped twice:"+CustomName);}

var CustomHide = false;
if(localStorage.CustomHide === undefined) {localStorage.setItem("CustomHide", false);} else {CustomHide = JSON.parse(localStorage.getItem("CustomHide"));}

var IsBotOn = false;
if(localStorage.IsBotOn === undefined) {localStorage.setItem("IsBotOn", false);} else {IsBotOn = JSON.parse(localStorage.getItem("IsBotOn"));}

var GoodPrice = 230;
if(localStorage.GoodPrice === undefined) {localStorage.setItem("GoodPrice", 230);} else {GoodPrice = JSON.parse(localStorage.getItem("GoodPrice"));}

var AutoWithdraw = false;
if(localStorage.AutoWithdraw === undefined) {localStorage.setItem("AutoWithdraw", false);} else {AutoWithdraw = JSON.parse(localStorage.getItem("AutoWithdraw"));}

var DoWithdraw = false;
if(localStorage.DoWithdraw === undefined) {localStorage.setItem("DoWithdraw", false);} else {DoWithdraw = JSON.parse(localStorage.getItem("DoWithdraw"));}

var xhr = new XMLHttpRequest();

function check() {
    if (IsCustom) {xhr.open('GET', "https://steamlvlup.com/shop/items?page=0&hide_exist="+CustomHide+"&page_size=10&name="+CustomName, true);}
    else {xhr.open('GET', "https://steamlvlup.com/shop/items?page=0&hide_exist=true&page_size=1337&sort_by=price&sort_type=asc", true);}
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("Looking for cards");
            var response = JSON.parse(xhr.responseText);
            if (response.count > 0) {
                if (IsDebug){console.log(response);}
                console.log("Set of card found");
                if (IsCustom) {
                    if (response.items["0"].set_price <= GoodPrice){
                        if (response.items["0"].count > 0) {
                            if (response.items["0"].bg_lvl < 5 || !CustomHide) {
                                console.log("Good price found for "+unescape(response.items["0"].name)+" at "+response.items["0"].set_price+" gems with "+response.items["0"].count+" in stock");
                                if (USER_BALANCE < response.items["0"].set_price){console.log("Price seems too hight for actual balance ("+USER_BALANCE+"), trying to buy anyway");}
                                BuyBadge(response.items["0"].appid,response.items["0"].border,response.items["0"].set_price);
                            } else {console.log("Set found but badge lvl is already max");}
                        } else {console.log("at a good price but not in stock");}
                    } else {console.log("but at a price too high");}
                } else {
                    if (response.items["0"].set_price <= GoodPrice && response.items["0"].bg_lvl < 5){
                        console.log("Good price found for "+unescape(response.items["0"].name)+" at "+response.items["0"].set_price+" gems");
                        if (USER_BALANCE < response.items["0"].set_price){console.log("Price seems too hight for actual balance ("+USER_BALANCE+"), trying to buy anyway");}
                        BuyBadge(response.items["0"].appid,response.items["0"].border,response.items["0"].set_price);
                    } else {console.log("No set of card found at a good price that you don't already own");}}
            } else {if(IsCustom) {console.log("No Set found, try another CustomName");} else {console.log("No Set found");}}
        }
    }
}

function BuyBadge(badge, border, price){
    if (badge && border >= 0){
        var csrf = document.getElementsByName("csrf-token")[0].content;
        xhr.open('POST', "https://steamlvlup.com/buy/badge", true);
        xhr.setRequestHeader('X-CSRF-TOKEN', csrf);
        xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8");
        var data = "appid="+badge.toString()+"&border="+border.toString();
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (IsDebug){console.log(response);}
                var purchaseSuccess = response.success
                if (purchaseSuccess){
                    console.log("Purchase Success !");
                    update_balance(price, 'dec');
                    if (AutoWithdraw) {window.location = window.location.origin+"/inventory";localStorage.setItem("DoWithdraw", true);} else {window.location.reload(true);}
                } else {
                    console.log("Purchase Failed ("+response.msg+")");
                    localStorage.setItem("PREV_USER_BALANCE", USER_BALANCE);
                    console.log("Reloading to update user balance");
                    window.location.reload(true);
                }
            }
        }
    }
}

function withdraw(){
    xhr.open('GET', "https://steamlvlup.com/inventory/load?appid=&hide_un=false", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("Loading inventory");
            var response = JSON.parse(xhr.responseText);
            if (IsDebug){console.log(response);}
            if (response.success && response.count > 0){
				localStorage.setItem("DoWithdraw", false);
                console.log("Withdraw all inventory");
                WS = new WebSocket(HOST + '?token=' + TOKEN + '&timestamp=' + TIMESTAMP + '&steamid=' + STEAMID);
                WS.onopen = function() {
                    var count_sel = document.getElementsByClassName('inv_item');
                    var Msg = {};
                    Msg.token = T_TOKEN;
                    Msg.command = "withdraw";
                    Msg.stockid = local_stockid;
                    var items = [];
                    if(count_sel.length>0){for(var i=0; i<count_sel.length; i++){items[i]=count_sel[i].dataset.id;}}
                    Msg.items = items;
                    WS.send(JSON.stringify(Msg));
                    console.log("Steam Offer sent !");
                    window.location = window.location.origin;
                };
            } else {console.log("Inventory empty");window.location.reload(true);}
        }
    }
}

if (IsBotOn) {
    if (window.location.href == window.location.origin+"/"){
        InitShop();
    }

    if (window.location.href == window.location.origin+"/inventory" && DoWithdraw){
        withdraw();
    }
}

function InitShop(){
    if (IsBotOn) {
        check();
        setTimeout(function () {InitShop();},30000);
    }
}