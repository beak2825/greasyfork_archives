// ==UserScript==
// @name         Roblox Dominus Spoof buyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  trick someone into thinking you bought a dominus
// @author       namesnipes
// @match        https://www.roblox.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/29331/Roblox%20Dominus%20Spoof%20buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/29331/Roblox%20Dominus%20Spoof%20buyer.meta.js
// ==/UserScript==
//GM_setValue('hi',false);
function hihi() {
    try{
        let a = document.getElementsByTagName("a"),
            i = 0;
        while (a[i++].innerText != "Buy Now"){}
        var button = (--i, a[i]);
        console.log(button);
        button.addEventListener('click', sleep, false);
    }
    catch(err)
    {}
    setTimeout(hihi, 500);
}
function lol(){
    console.log('item is owned');
    var test = document.getElementsByClassName('text-label')[0];
    var divider = '<div class="divider">&nbsp;</div>';
    var labelcheck = '<div class="label-checkmark"><span class="icon-checkmark-white-bold"></span></div>';
    var dateSpan = document.createElement('span').innerHTML = '<span> Item Owned (1)</span>';
    test.insertAdjacentHTML('afterend', dateSpan);
    test.insertAdjacentHTML('afterend', labelcheck);
    test.insertAdjacentHTML('afterend', divider);
    var robux = document.getElementById("nav-robux-amount").innerHTML = "189k+";
    var robux2 = document.getElementById("nav-robux-balance").innerHTML = "189,603 ROBUX";
}
function sleep(){
    GM_setValue('hi', true);
    console.log('set gm to true');
    setTimeout(function() {
        gotitem();
    }, (1 * 1500));
}
function gotitem(){
    if(GM_getValue('hi') === true){
        console.log('gm is true');
        lol();
    }
    else{
        console.log('gmvalue not true');
    }
}
function fireflowerbutton() {
    var button = document.getElementsByClassName("action-button")[0];
    button.innerHTML = '';
    var createbutton = document.createElement("button").innerHTML = `<button type="button" class="btn-fixed-width-lg btn-primary-lg PurchaseButton" data-button-type="main" data-button-action="get" data-expected-price="0" data-bc-requirement="0" data-product-id="210120" data-item-id="1144544" data-item-name="Fire Flower" data-asset-type="TShirt" data-expected-currency="1" data-expected-seller-id="40609" data-seller-name="MettanAtem" data-userasset-id=""> Buy </button>`;
    button.insertAdjacentHTML("afterbegin", createbutton);
}
function start() {
    var robux = document.getElementById("nav-robux-amount");
    var robux2 = document.getElementById("nav-robux-balance");
    var message = document.getElementById("modal-dialog");
    var moremessage = message.getElementsByClassName("modal-message")[0];
    var picture = document.getElementsByClassName("modal-thumb")[0];
    var buyitem = document.getElementsByClassName("modal-title")[0];
    var buybutton = document.getElementById("confirm-btn");
    var footer = document.getElementsByClassName("modal-footer text-footer")[0];
    footer.style.display = null;
    footer.innerHTML = `Your balance after this transaction will be <span class="icon-robux-gray-16x16"></span>189,603</div>`;
    buybutton.innerHTML = "Buy Now";
    buyitem.innerHTML = "Buy Item";
    try{
        picture.src = "https://t6.rbxcdn.com/bfe43bebfa4a2d1f575ea24312e76e63";
    }
    catch(err){
        console.log("couldnt do picture");
    }
    moremessage.innerHTML = "Would you like to buy the Hat: <span class='font-bold'>Dominus Aureus</span> from Valuize for <span class='icon-robux-16x16'></span><span class='text-robux'>555,555</span>?";
    if(GM_getValue('hi') === false){
        robux.innerHTML = "745k+";
        robux2.innerHTML = "745,158 ROBUX";
    }

    function check() {
        if($('#simplemodal-container').length >0 ){
            document.getElementById("simplemodal-container").style.height = "494px";
            document.getElementById("simplemodal-container").style.top = "138px";
        }
        else {
        }

    }   setInterval(check, 100);
    setTimeout(start, 0);
}

start();
hihi();
gotitem();
fireflowerbutton();