// ==UserScript==
// @name         One Bazaar Modified
// @namespace    tenren_quickbazaar
// @version      1.2.3
// @description  Quick Bazaar Buy
// @author       nao, modified by Tenren
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518875/One%20Bazaar%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/518875/One%20Bazaar%20Modified.meta.js
// ==/UserScript==
 
let percentage = 20;
 
 
 
let done = [];
 
let itemsdata = [];
let bought=[];
 
function update() {
    let content = ``;
    for (let val of itemsdata){
        if (!bought.includes(val[2])){
            content += (val[1]);
        }
    }
    $("#itemList").html(content);
    $(".itembuynao").off("click");
    $(".itembuynao").on("click", async function () {
        let iid = $(this).attr("id");
        let iitemid = $(this).attr("itemid");
        let iamount = $(this).attr("amount");
        let iuid = $(this).attr("userid");
        let ip = $(this).attr("price");
 
        await buy(iuid, iid, iitemid, iamount, ip);
    });
}
 
function insert() {
    let cont = `<div id="displayContainer" style="
        display: grid;
        grid-template-columns: 55% auto;
        background: rgb(160 160 160);
        height: 25vh;
        color: yellow;
        border-radius: 5px;
        padding: 5px;
        z-index: 10;
 
        ::-webkit-scrollbar {
            width: 5px;
        }

        ::-webkit-scrollbar-track {
            border-radius: 8px;
            background-color: #e7e7e7;
            border: 1px solid #cacaca;
        }
 
        ::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background-color: #3b9ab7;
        }
    ">
    <div id="itemList" style=" overflow-y: scroll;">
        </div>
    <div id = "actionsHistory" style=" overflow-y: scroll;">
        <p class="actionsElement">{result}</p>
        </div>`;
 
    if ($("div[class^='topSection']").length == 0) {
        setTimeout(insert, 300);
        return;
    }
 
    if ($("#displayContainer").length == 0) {
        $(".content-wrapper").prepend(cont);
    }
}
 
 
async function buy(userid, id, itemid, amount, price) {
    await $.post(`https://www.torn.com/bazaar.php?sid=bazaarData&step=buyItem&rfcv=${getRFC()}`, {
        userID: userid,
        id: id,
        itemid: itemid,
        amount: amount,
        price: price,
        beforeval: price * amount
 
    }, function (response) {
        console.log(response);
        response = JSON.parse(response);
        console.log(response);
        addResult(response.text, response.success ? "green" : "red");
        if (response.success && response.text.includes("bought")){
            $(`#${id}`).remove();
            bought.push(id);
        }
    })
 
}
 
function addResult(resultMsg, rescol) {
    let curtime = $(".server-date-time").html().split("-")[0];
    let resmsg = `<p style="color: ${rescol}">${curtime} ${resultMsg}</p>`;
    $("#actionsHistory").prepend(resmsg);
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
 
if (window.location.href.includes("userId")){

    insert();
    const { fetch: origFetch } = window;
    window.fetch = async (...args) => {
        console.log("onebazaar called with args:", args);
 
        const response = await origFetch(...args);
 
        /* work with the cloned response in a separate promise chain -- could use the same chain with `await`. */
 
        if (response.url && response.url.includes('/bazaar.php?sid=bazaarData&step=getBazaarItems')) {
            let clonedResponse = response.clone();
            let clonedJ = await clonedResponse.json();
            let uid = clonedJ.ID;
 
            // console.log("userid" + uid);
 
            for (let item of clonedJ.list) {
                let id = item.bazaarID;
 
                let itemid = item.ID;
                let amount = item.amount;
                let price = item.price;
                let mv = item.averageprice;
                let isBlockedForBuying = item.isBlockedForBuying;
                let name = item.name;
                // console.log(item);
 
                if (!isBlockedForBuying && parseInt(price) <= (100 - percentage) / 100 * mv && !done.includes(id)) {
                    let con = `<button style="color:white; margin:2px; padding:10px; height:auto; line-height:normal" class="itembuynao torn-btn" userid=${uid} id=${id} itemid=${itemid} amount=${amount} price=${price}>${name} ($${price.toLocaleString()})<br/>${amount} - $${(price * amount).toLocaleString()}</button>`;
 
                    while ($("#itemList").length == 0) {
                        console.log("itemlist");
                    }
                    done.push(id);
                    itemsdata.push([parseInt(mv - price), con, id]);
                }
            }
        }
        itemsdata = itemsdata.sort(function (a, b) {
            return b[0] - a[0];
        });
        update();

        return response;
    };
 
}