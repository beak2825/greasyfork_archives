// ==UserScript==
// @name         No Confirm Item Send
// @namespace    noconfirm.item.send
// @version      0.4
// @description  item no confirm send
// @author       nao
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501722/No%20Confirm%20Item%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/501722/No%20Confirm%20Item%20Send.meta.js
// ==/UserScript==

let step = 0;

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

async function send0(e){
    step = 0;
    let parent = $(e).parents("li[data-item]");
    let itemId = $(parent).attr("data-item");
    

    
    

    let userID = $($("input[id^='ac-search-']", $(parent))).attr("value").replace(" ", "+");
    let amount = $("li.act > div.cont-wrap > div.action-wrap.send-act > form > div.amount-wrap.left > div.input-money-group.no-max-value.success > input:nth-child(1)").attr("value");

    await $.post(`https://www.torn.com/item.php?rfcv=${getRFC()}`,{
        step: "sendItemAction",
        itemID: itemId,
        userID: userID,
        tag: "",
        amount: amount

    },function(response){
        response = JSON.parse(response);
        $("#wai-action-desc", $(parent)).html(response.text);
        if (response.success){
            
            step = response.itemID;
        }
        setTimeout(function(){
            $(e).attr("disabled", false);
        },400);

    });

}

async function send(e, xid){
    step = 0;
    
    let parent = $(e).parents(".cont-wrap");

    

    let userID = $($("input[id^='ac-search-']", $(parent))).attr("value").split(" ")[1].slice(1,-1);
    let amount = $("li.act > div.cont-wrap > div.action-wrap.send-act > form > div.amount-wrap.left > div.input-money-group.no-max-value.success > input:nth-child(1)").attr("value");

    await $.post(`https://www.torn.com/item.php?rfcv=${getRFC()}`,{
        step: "sendItemAction",
        confirm: 1,
        XID: xid,
        userID: userID,
        tag: "",
        amount: amount

    },function(response){
        response = JSON.parse(response);
        $("#wai-action-desc", $(parent)).html(response.text);
        setTimeout(function(){
            $(e).attr("disabled", false);
        },500);

    });
}


$(document).on("click","input[value='SEND']",async function(e){
    $(this).attr("disabled", true);
    // alert();
    if (step == 0){
        await send0($(this));
    }
    else{
        
        await send($(this), step);
    }
    
    return false;

});