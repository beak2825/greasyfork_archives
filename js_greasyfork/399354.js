// ==UserScript==
// @name         Amazon Prime Now Checker
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  Amazon Prime Now delivery checker
// @author       MadMattax
// @match        https://primenow.amazon.it/checkout/*
// @match        https://primenow.amazon.fr/checkout/*
// @match        https://primenow.amazon.es/checkout/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/399354/Amazon%20Prime%20Now%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/399354/Amazon%20Prime%20Now%20Checker.meta.js
// ==/UserScript==

//$("#delivery-slot-panel-continue-button").click()

(function() {
    'use strict';
    var deliveryMessage = checkAvailableDelivery();
    setupVariables()
    var pageRefreshTimer = false;
    var debugStatus = false;

    var beepAudio = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU1LjEyLjEwMAAAAAAAAAAAAAAA//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAAcAAAAIAAAOsAA4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxjo6Ojo6Ojo6Ojo6OqqqqqqqqqqqqqqqqqsfHx8fHx8fHx8fHx+Pj4+Pj4+Pj4+Pj4+P///////////////9MYXZmNTUuMTIuMTAwAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQRAAAAn4Tv4UlIABEwirzpKQADP4RahmJAAGltC3DIxAAFDiMVk6QoFERQGCTCMA4AwLOADAtYEAMBhy4rBAwIwDhtoKAgwoxw/DEQOB8u8McQO/1Agr/5SCDv////xAGBOHz4IHAfBwEAQicEAQBAEAAACqG6IAQBAEAwSIEaNHOiAUCgkJ0aOc/a6MUCgEAQDBJAuCAIQ/5cEAQOCcHAx1g+D9YPyjvKHP/E7//5QEP/+oEwf50FLgApF37Dtz3P3m1lX6yGruoixd2POMuGLxAw8AIonkGyqamRBNxHfz+XRzy1rMP1JHVDJocoFL/TTKBUe2ShqdPf+YGleouMo9zk////+r33///+pZgfb/8a5U/////9Sf////KYMp0GWFNICTXh3idEiGwVhUEjLrJkSkJ9JcGvMy4Fzg2i7UOZrE7tiDDeiZEaRTUYEfrGTUtFAeEuZk/7FC84ZrS8klnutKezTqdbqPe6Dqb3Oa//X6v///qSJJ//yybf/yPQ/nf///+VSZIqROCBrFtJgH2YMHSguW4yRxpcpql//uSZAuAAwI+Xn9iIARbC9v/57QAi/l7b8w1rdF3r239iLW6ayj8ou6uPlwdQyxrUkTzmQkROoskl/SWBWDYC1wAsGxFnWiigus1Jj/0kjgssSU1b/qNhHa2zMoot9NP/+bPzpf8p+h3f//0B4KqqclYxTrTUZ3zbNIfbxuNJtULcX62xPi3HUzD1JU8eziFTh4Rb/WYiegGIF+CeiYkqat+4UAIWat/6h/Lf/qSHs3Olz+s9//dtEZx6JLV6jFv/7//////+xeFoqoJYEE6mhA6ygs11CpXJhA8rSSQbSlMdVU6QHKSR0ewsQ3hy6jawJa7f+oApSwfBIr/1AxAQf/8nBuict8y+dE2P8ikz+Vof/0H4+k6tf0f/6v6k/////8qKjv/1BIam6gCYQjpRBQav4OKosXVrPwmU6KZNlen6a6MB5cJshhL5xsjwZrt/UdFMJkPsOkO0Qp57smlUHeDBT/+swC8hDfv8xLW50u/1r//s3Ol/V9v///S/////yYSf/8YN5mYE2RGrWXGAQDKHMZIOYWE0kNTx5qkxvtMjP/7kmQOAAMFXl5582t2YYvrnz5qbowhfX/sQa3xf6+u/Pi1uiPOmcKJXrOF5EuhYkF1Bbb/3EAiuOWJocX9kycBtMDLId5o7P+pMDYRv1/mDdaP8ul39X1X5IDHrt1o///9S/////85KVVbuCOQNeMpICJ81DqHDGVCurLAa/0EKVUsmzQniQzJVY+w7Nav+kDexOCEgN7iPiImyBmYImrmgCQAcVltnZv2IQsAXL9vqLPlSb+Qk3/6K3MFb+v//b+n////+UJW//Sc1mSKuyRZwAEkXLIQJXLBl6otp8KPhiYHYh+mEAoE+gTBfJgeNItsdG6GYPP/1FkQFHsP3IOPLtavWEOGMf/WThMwEWCpNm6y/+Y+s//OH/1/u/OGX////6v////+bCSoHMzMgsoTebSaIjVR6lKPpG7rCYWmN+jRhtGuXiHi57E0XETEM7EAUl/9IdINsg8wIAAQBmS8ipal6wx8BnH//UYhNzT9L8lH51v6m//u3IhI1r9aP///V/////0iQ//pC87YAWAKKWAQA67PwQ2iCdsikVY4Ya//+5JkC4ADTmzX+01rcFLry/8+DW/OgbNV7NINwQ6e7nTWtXLHHhydAAxwZFU1lQttM3pgMwP6lqdB/rIgABAaxBRnKSLo/cB2hFDz/9MxDiD2l6yh9RTflZKf1Jfr/RfkQYWtL6P///V/////w/icFn///7lAwJp2IBpQ4NESCKe1duJchO8QoLN+zCtDqky4WiQ5rhbUb9av+oQljfDBZdPstVJJFIMSgXUXu39EFGQG//JZus//OG/6X6Lc4l/////t/////Kx4LWYoAQABgwQAGWtOU1f5K1pzNGDvYsecfuce4LdBe8iBuZmBmVdZJVAmuCk8tt/qOi8Ax4QjgywDYEMM0dkkUkqQ1gGCpaf/nTgoQH36vpkMflE7/KRj+k/0n5DiDPS+3///qf////7JizRCya////WaGLygCl0lqppwAH1n/pGM6MCPFK7JP2qJpsz/9EfgHUN4bYUo8kVfxZDd/9ZqXSi31/WXW51D+ZG37/pNycMDbnf///+JaiWbxwJAADEAgAWBoRJquMpaxJQFeTcU+X7VxL3MGIJe//uSZBAABBVs0ftaa3BCS+udTaVvjLV5W+w1rdk5r6x89rW+Bx4xGI3LIG/dK42coANwBynnsZ4f//+t3GfrnRJKgCTLdi1m1ZprMZymUETN4tj3+//9FQEMDmX9L5qVmlaiKVfx3FJ/mH5dfphw6b////60P////qWkMQEfIZq////sMESP4H4fCE0SSBAnknkX+pZzSS2dv1KPN/6hdAJUhIjzKL1L2sDqST/+gwF//ir8REf5h35f2bmDz3//////////jAGKcREwKMQI+VWsj7qNCFp0Zk9ibgh82rKj/JEIFmShuSZMMxk6Jew7BLOh/6wWk1EaAK4nJszopGpdUYh9EYN2/0zQYYnhvJt1j1+pPzpr/TKHXs3z6WdE1N0pm/o///9f/////MpkiIiBeCALJpkgpbKFme7rvPs1/vwM0yWmeNn75xH/+BkEIWITktZ+ijXEi//nC8XQ8v9D5wez86Xv6SL/Lv5ePcrIOl////1/////84bPG1/BwAHSMrAmlSw9S3OfrGMy51bTgmVmHAFtAmCmRg2s1LzmAP/7kmQSgAM9Xs5rM2twXG2Z70IKbg09fT2nva3xgq/mtRe1ui8AFVGaC/9EawNnhihesNgE5E6kir3GVFlof+tEQEpf/rMH50lv5WPH6k2+XX4JUKRpn9Xq//+7f////x3CyAX/4LIzvDgdgAEbFbAc0rGqTO2p1zoKA22l8tFMiuo2RRBOMzZv+mUA2MiAyglI3b9ZwZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");



function checkAvailableDelivery(){
    var deliveryElement = null;
    try{
        deliveryElement = document.getElementsByClassName("a-section a-spacing-none a-padding-small")[0].innerText;
    }catch(e){
        deliveryMessage = null;
    }
    if (deliveryElement != null){
        return true;
    }else{
        return deliveryElement;
    }
}


if(deliveryMessage != true){
    availableDelivery();
}else{
    noAvailableDelivery();
}



//const deliveryText = "Tutte le finestre di consegna restanti per oggi e domani non sono attualmente disponibili. Nuove finestre verranno rese disponibili durante la giornata.";


function getTimeNow(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time
}


function noAvailableDelivery(){
    console.log("Nessun Orario Disponibile Alle:   " + getTimeNow());
    createGui()

    var refreshTime = GM_getValue( "refreshTime", 0);

    pageRefresh(refreshTime);
}

function availableDelivery(){
    console.log("Finestre Disponibili alle: "+ getTimeNow());
    createGui();
    var refreshStatus = GM_getValue( "refreshStatus", false);
    if (refreshStatus == false){
        return false;
    }
    beepSound(2, beepAudio);
    pageRefresh(4);
}
function beepSound(seconds, snd2){
   window.setInterval(function(){
    snd2.play();
      }, seconds*1000);
}



function pageRefresh(seconds){
   var currentRefreshStatus = GM_getValue( "refreshStatus", 0);
    if (currentRefreshStatus == true){
        pageRefreshTimer = setTimeout(function(){ location.reload(true); }, seconds*1000);
   }
   else if (currentRefreshStatus == false){
       clearTimeout(pageRefreshTimer)
       //return "ACTIVE";
   }

}


function createGui(){
    var currentRefreshTimer = GM_getValue( "refreshTime", true);

    var deliveryHeading = $("#delivery-slot .pn-panel-heading-container");
    var refreshStatusText = getRefreshStatusText();

    deliveryHeading.append('<h2>Refresh Timer: <span id="refreshTime">' + currentRefreshTimer + '</span> sec    <button id="increseTimer">+</button>    <button id="decreaseTimer">-</button></h2>');
    deliveryHeading.append('<h2>Refresh Status: <button id="refreshStatus" type="button">'+ refreshStatusText +'</button> <button id="testAudio" type="button">Test Audio ♪</button></h2>');
    debugStatus ? deliveryHeading.append('<h2>Auto Order: <button id="autoOrderStatus" type="button"></button> Cart Changes: <span id="cartChangeText"></span><button id="saveCartStatus" type="button"></button></h2>') : false;

    $("#testAudio").click(function(){beepAudio.play()});


    changeButtonColor($("#refreshStatus"));

    displayAutoOrderButton($("#autoOrderStatus"));
    displaySaveCartButton($("#saveCartStatus"));
    checkCartChange();

    $("#saveCartStatus").click(function(){changeCartStatus(this);});
    $("#autoOrderStatus").click(function(){changeAutoOrderStatus(); displayAutoOrderButton(this);});
    $("#refreshStatus").click(function(){changeRefreshStatus(); $(this).html(getRefreshStatusText()); changeButtonColor(this); pageRefresh(GM_getValue("refreshTime", true));});
    $("#increseTimer").click(function(){var newRefreshTimer = changeRefreshTimer("increase", 1); $("#refreshTime").html(newRefreshTimer)});
    $("#decreaseTimer").click(function(){var newRefreshTimer = changeRefreshTimer("decrease", 1); $("#refreshTime").html(newRefreshTimer)});

}


function changeRefreshTimer(action_type, value){
    var currentRefreshTimer = GM_getValue( "refreshTime", true);
    if (currentRefreshTimer > 0){
       if(action_type == "increase"){
           currentRefreshTimer = currentRefreshTimer + value;
           GM_setValue( "refreshTime", currentRefreshTimer );
           return currentRefreshTimer;
       }
       if(action_type == "decrease"){
           currentRefreshTimer = currentRefreshTimer - value;
           GM_setValue( "refreshTime", currentRefreshTimer );
           return currentRefreshTimer;
       }

    }

}


function getRefreshStatusText(){
   var currentRefreshStatus = GM_getValue( "refreshStatus", 0);
    if (currentRefreshStatus == false){
        return "INACTIVE";
   }
   else if (currentRefreshStatus == true){
       return "ACTIVE";
   }
}

function changeRefreshStatus(){
   var currentRefreshStatus = GM_getValue( "refreshStatus", 0)
   if (currentRefreshStatus == true){
       GM_setValue( "refreshStatus", false );
       return false;
   }
   else if (currentRefreshStatus == false){
       GM_setValue( "refreshStatus", true );
       return true;
   }
 }



function changeButtonColor(button_elem){
   var currentRefreshStatus = GM_getValue( "refreshStatus", 0);
    if (currentRefreshStatus == true){
       $(button_elem).css('color','green');
        //pageRefresh(1);
   }
   else if (currentRefreshStatus == false){
       $(button_elem).css('color','red');
   }
}

function displayAutoOrderButton(button_el){
   var currentAutoOrderStatus = GM_getValue( "autoOrderStatus", 0);
    if (currentAutoOrderStatus == true){
       $(button_el).css('color','green');
       $(button_el).html("ACTIVE")
   }
   else if (currentAutoOrderStatus == false){
       $(button_el).css('color','red');
       $(button_el).html("INACTIVE");
   }
}

function changeAutoOrderStatus(){
   var currentAutoOrderStatus = GM_getValue( "autoOrderStatus", 0);
    if (currentAutoOrderStatus == true){
        GM_setValue( "autoOrderStatus", false );
   }
   else if (currentAutoOrderStatus == false){
            GM_setValue( "autoOrderStatus", true );
   }


}

function setupVariables(){
        var setupStatus = GM_getValue( "setupStatus", false);
        if (setupStatus != true){
            debugStatus ? console.log("Setup Variables") : false;
            GM_setValue( "refreshTime", 10 );
            GM_setValue( "refreshStatus", true );
            GM_setValue( "autoOrderStatus", false );
            GM_setValue( "cartStatus", false );
            GM_setValue( "setupStatus", true );
        }
}


function retriveCartState(){
    var cartStatus = false;
    $.ajax("/cart/ajax", {
                    method: "GET",
                    timeout: 3E3,
                    async: false,
                    success: function(result, e) {
                        var cartItemList = result.activeItemList;
                        var elementList = cartItemList.map(function(item){return {"ASIN" : item.ASIN, "itemID": item.itemID, "quantity" : item.quantity}});
                        var cartTotal = $("#checkout-total-price-field")[0].innerText.replace(/[^0-9,-]+/g,"").replace(',', '.');
                        debugStatus ? console.log(cartTotal) : false;
                        var datetime = new Date();

                        cartStatus = {"savedTime": datetime.getTime(), "cartTotal" : parseFloat(cartTotal), "totalQuantity": result.cartSummary.totalQuantity, "cartItemList": elementList};
                        //GM_setValue( "cartStatus", cartStatus );
                        //displaySaveCartButton(button_el);

                        //return cartStatus;
                    },
                    error: function(result, e, c) {
                        //d.trigger("navCartTotalQuantityEvent", 0)
                    }
                })
    return cartStatus;
}
function saveCartState(button_el){
    var newCartStatus = retriveCartState();
    GM_setValue( "cartStatus", newCartStatus );
    displaySaveCartButton(button_el);


}


function displaySaveCartButton(button_el){
        var cartCurrentStatus = GM_getValue( "cartStatus", false);
        if (cartCurrentStatus != false){
           $(button_el).text("❌");
        }else{
           $(button_el).text("💾");

        }
}



function changeCartStatus(button_el){
    var cartCurrentStatus = GM_getValue( "cartStatus", false);
        if (cartCurrentStatus == false){
           saveCartState(button_el);
        }else{
         GM_deleteValue( "cartStatus");
         displaySaveCartButton(button_el);
        }
}

function checkCartChange(){
       var cartCurrentStatus = GM_getValue( "cartStatus", false);
       var cartChangeText = $("#cartChangeText");
       if (cartCurrentStatus != false){
         var cartNewStatus = retriveCartState();
           var priceChange = cartNewStatus.totalQuantity - cartCurrentStatus.totalQuantity;
           if(priceChange != 0){
            cartChangeText.text(priceChange + " €  ");
           }else{
           cartChangeText.text();

           }
       }
}

function displayCartChange(){
     var cartChangeText = $("#cartChangeText");

}

})();