// ==UserScript==
// @name         Jikfebi Market Stalk origin
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  added requested features and fixed bugs
// @author       -zero [2669774]
// @match        https://www.torn.com/market_check.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461328/Jikfebi%20Market%20Stalk%20origin.user.js
// @updateURL https://update.greasyfork.org/scripts/461328/Jikfebi%20Market%20Stalk%20origin.meta.js
// ==/UserScript==


var api = "zyX1sCNSS5q0xxVL"; //API HERE




// ---- DO NOT CHANGE ANYTHING BELOW THIS ------------

var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');

var firstrun = true;
var itemPrices = {};
var wind;
var program;
var stop = false;
var checkFlower = true;
var checkPlush = true;
var curList = [];
var inventory = {};
var inin;
var checkBazaar = true;
var checkIm = true;
var minAm = 0;

async function initialize(){
    $('#spaceItems').html("");
    stop = false;
    alert('Started Checking !!');

    var resp = await $.getJSON("https://api.torn.com/torn/?selections=items&key="+api);
    console.log(resp);
    for (var item in resp.items){
        inventory[item] = 0;
        if (resp.items[item].type == "Plushie"){
            if (resp.items[item].market_value > 0 && !resp.items[item].name.includes("Dong") && !resp.items[item].name.includes("Bunch") &&!resp.items[item].name.includes("Rose")){
                itemPrices[item] = [resp.items[item].market_value, resp.items[item].name, "P"];
            }

        }
        if (resp.items[item].type == "Flower"){
            if (resp.items[item].market_value > 0 && !resp.items[item].name.includes("Dong") && !resp.items[item].name.includes("Bunch") &&!resp.items[item].name.includes("Rose")){
                itemPrices[item] = [resp.items[item].market_value, resp.items[item].name, "F"];
            }

        }
    }

    minAm = $('#minAm').val() || 0;
    console.log("Initialized..")
    checkInventory();

    check();

}
async function checkInventory() {
    var invent =await $.getJSON("https://api.torn.com/user/?selections=inventory&key="+api);
    for (var idata in invent.inventory){

        inventory[invent.inventory[idata].ID] = invent.inventory[idata].quantity;
    }

}

function updatePlush(){
    if (document.getElementById('plushCheck').checked){
        checkPlush = true;
        console.log('checked plush');
    }
    else{
        checkPlush = false;
        console.log('unchecked plush');
    }
}
function updateFlow(){
    if (document.getElementById('flowCheck').checked){
        checkFlower = true;
        console.log('checked flow');
    }
    else{
        checkFlower = false;
        console.log('unchecked flow');
    }
}

function updateBazaar(){
    if (document.getElementById('bazaarCheck').checked){
        checkBazaar = true;
        console.log('checked bazaar');
    }
    else{
        checkBazaar = false;
        console.log('unchecked baz');
    }

}

function updateIm(){
    if (document.getElementById('imarketCheck').checked){
        checkIm = true;
        console.log('checked im');
    }
    else{
        checkIm = false;
        console.log('unchecked im');
    }

}

async function check(){
    console.log("Checking..")
    if (stop){
        return;
    }
    for (var id in itemPrices){
        if (itemPrices[id][2] == "F" && checkFlower == false){
            continue;
        }
        if (itemPrices[id][2] == "P" && checkPlush == false){
            continue;
        }
        var checkss = [];
        if (checkBazaar){
            checkss.push('bazaar');
        }
        if (checkIm){
            checkss.push('itemmarket');
        }
        var allCheck = checkss.join(',');
        var priceData = await $.getJSON("https://api.torn.com/market/"+id+"?selections=bazaar,itemmarket&key="+api);
        if (stop){
            return;
        }
        console.log(priceData);
        console.log("Item Market: "+priceData.itemmarket[0].cost+" Bazaar: "+priceData.bazaar[0].cost+" Value: "+itemPrices[id][0]);


        if (priceData.itemmarket[0].cost <= itemPrices[id][0] || priceData.bazaar[0].cost <= itemPrices[id][0]){
            var bazOritem;
            var tcol;
            var quan;

            var link = "https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname="+itemPrices[id][1].split(' ').join('+');
            var minP;


            if (priceData.itemmarket[0].cost < priceData.bazaar[0].cost){
                bazOritem = 'I';
                minP = priceData.itemmarket[0].cost;
                quan = priceData.itemmarket[0].quantity;
                tcol = 'grey';
            }
            else{
                bazOritem = 'B';
                minP = priceData.bazaar[0].cost;
                quan = priceData.bazaar[0].quantity;
                tcol = 'red';
            }

            if (bazOritem == 'B' && !checkBazaar){
                continue;
            }
            if (bazOritem == 'I' && !checkIm){
                continue;
            }

            if (quan < minAm){
                continue;
            }
            var linkbutton = `<div id="zero-content-${id}"><a id="${id}-zero" class="zeroLinks" href=${link} target=${id} style="color:${tcol}">${bazOritem} ${itemPrices[id][1]} ${minP}</a><div id="${id}-span" style="font-size: 12px">Owned: ${inventory[id]}</div></div>`;


            if ($("#"+id+"-zero").length == 0){
                $("#spaceItems").append(linkbutton);
                if (!firstrun){
                    audio.play();
                }
            }
            else{
                var newP = bazOritem+" "+itemPrices[id][1]+" "+ minP;
                var datn = `<a id="${id}-zero" class="zeroLinks" href=${link} target=${id} style="color:${tcol}">${bazOritem} ${itemPrices[id][1]} ${minP}</a><div id="${id}-span" style="font-size: 12px">Owned: ${inventory[id]}`;

                $("zero-content-"+id).html(datn);
                
            }

            /*  wind = window.open("https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname="+itemPrices[id][1], id);
            window.blur();
            return; */
        }
        else{
            if ($("#"+id+"-zero").length > 0){
                $("#zero-content-"+id).remove();
            }
        }


    }
    firstrun = false;


}

function insert(){
    const button = `<button id = "checkItems">Start Checking!</button>`;
    const ex = `<button id = "exitItems">Stop Checking!</button>`;
    const space = `<span id="spaceItems"></span`;
    var checkPlushie = `<laber for='plushie'>Plushies: </label><input type = "checkbox" id = 'plushCheck' name='plushie' checked>`;
    var checkFlower = `<laber for='flower'> Flowers: </label><input type = "checkbox" id = 'flowCheck' name='flower' checked>`;

    var checkBazaar = `<laber for='bazaar'> Bazaar: </label><input type = "checkbox" id = 'bazaarCheck' name='bazaar' checked>`;
    var checkIm = `<laber for='imarket'> ItemM: </label><input type = "checkbox" id = 'imarketCheck' name='imarket' checked>`;

    var minAmount = '<input type="text" id="minAm">';


    if ($('.content-title > h4').length>0 && $('#checkItems').length == 0){
        document.title = "Market Zero";
        $(".error-404").html("");
        $(".error-404").append(space);
        $('.content-title > h4').html("Market Check");
        $('.content-title > h4').append(button);
        $('.content-title > h4').append(ex);
        $('.content-title > h4').append(checkPlushie);
        $('.content-title > h4').append(checkFlower);
        $('.content-title > h4').append(checkBazaar);
        $('.content-title > h4').append(checkIm);
        $('.content-title > h4').append(minAmount);

        $('#plushCheck').on('click',updatePlush);
        $('#flowCheck').on('click',updateFlow);
        $('#bazaarCheck').on('click',updateBazaar);
        $('#imarketCheck').on('click',updateIm);
        $('div[id^=zero-content]').css('color','var(--content-title-color)');
        // $('.content-title > h4').append(space);

        $('#spaceItems').css("display", "grid");
        $('#spaceItems').css("font-size", "24px");
        $('#spaceItems').css("grid-template-columns", "1fr 1fr 1fr");
        $('#spaceItems').css("grid-gap", "30px");

        $('.zeroLinks').css("color", "red");

        $("#checkItems").on("click", start);
        $("#exitItems").on("click", exit);
    }
    else{
        setTimeout(insert, 1000);
    }

}

async function start(){
    var tim = 1;
    if (checkFlower && checkPlush){
        tim = 2;
    }
    await initialize();

    program = setInterval(check, 15000*tim);
    inin = setInterval(checkInventory, 60000);

}
function exit(){
    clearInterval(program);
    clearInterval(inin);
    stop = true;
    throw 'Program Ended';
}
insert();
/*
$(document).on('keypress',async function(e) {



    if(e.which == 113) {

        await initialize();

        setInterval(check, 30000);
    }
});
*/