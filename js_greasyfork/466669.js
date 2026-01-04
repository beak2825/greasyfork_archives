// ==UserScript==
// @name         Iran
// @namespace    zero.items.torn
// @version      0.3
// @description  Adds buttons to send items
// @author       -zero [2669774]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466669/Iran.user.js
// @updateURL https://update.greasyfork.org/scripts/466669/Iran.meta.js
// ==/UserScript==

var user = `<input type='text' name='user-id' id='zero-user' class='zero-input' placeholder='User Id'>`;
var weapon = `<form><input type='button' class='torn-btn' id='wepSub'  value='Send'><input type='text'id='weaponSub' name='weapon-id' class='zero-input' placeholder='Weapon Id'></form>`;
var armor = `<form><input type='button' class='torn-btn' id='arSub'  value='Send'><input type='text' name='armor-id' id='armorSub' class='zero-input' placeholder='Armor Id'></form>`;
var item1 = `<form><input type='button' id='isub' class='torn-btn'  value='Send'><input type='text' id='itemz' name='item-id' class='zero-input' placeholder='Item Id'> Amount: <input type='text' id='amount-i' class='zero-input' value=1></form>`;
var item2=`<form><input type='button' id='iisub' class='torn-btn'  value='Send'><input type='text' id='itemzz' name='item2-id' class='zero-input' placeholder='Item Id'> Amount: <input type='text' id='amount-iz' class='zero-input' value=1></form>`;
var message = `<input type='text' name='user-id' id='zero-message' class='zero-input' placeholder='Message' value=''>`;
var result =`<div id='zero-response'></div>`;

GM_addStyle(`
            .zero-input {
	border-radius: 5px;
	height: 14px;
	width: 215px;
	padding: 4px 21px 4px 10px;
	background-color: var(--autocomplete-background-color);
	color: var(--autocomplete-color);
    margin:5px;
}

#zero-response{
color:white;
margin:5px;
}
            `
           );


function insert(){
    if ($('#loadoutsRoot').length > 0){
        $('#loadoutsRoot').append(user);
        $('#loadoutsRoot').append(weapon);
        $('#loadoutsRoot').append(armor);
        $('#loadoutsRoot').append(item1);
        $('#loadoutsRoot').append(item2);
        $('#loadoutsRoot').append(message);
        $('#loadoutsRoot').append(result);

        $('#wepSub').on('click', sendW);
        $('#arSub').on('click', sendA);
        $('#isub').on('click', sendI);
        $('#iisub').on('click', sendI2);


    }
    else{
        setTimeout(insert, 500);
    }
}

function sendW(){

    var userId = $('#zero-user').attr('value');
    var id = $('#weaponSub').attr('value');
    var msg = $('#zero-message').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        confirm:"1",
        XID:id,
        userID:userId,
        tag:msg,
        amount:"1"},function(result){
        result = JSON.parse(result);
        $('#zero-response').html(result.text);
    })

}
function sendA(){

    var userId = $('#zero-user').attr('value');
    var id = $('#weaponSub').attr('value');
    var msg = $('#zero-message').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        confirm:"1",
        XID:id,
        userID:userId,
        tag:msg,
        amount:"1"},function(result){
        result = JSON.parse(result);
        $('#zero-response').html(result.text);
    })

}
function send(a,b){

    var userId = $('#zero-user').attr('value');
    var id = $('#weaponSub').attr('value');
    var msg = $('#zero-message').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        confirm:"1",
        XID:b,
        userID:userId,
        tag:msg,
        amount:a},function(result){
        result = JSON.parse(result);
        $('#zero-response').html(result.text);
    })
}
function sendI(){

    var userId = $('#zero-user').attr('value');
    var amount = $('#amount-i').attr('value');
    var msg = $('#zero-message').attr('value');
    var id = $('#itemz').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        tag:msg,
        userID:userId,
        amount:"1",
        itemID:id
    },function(result){
        result = JSON.parse(result);
        if (result.success){
            var ixid = result.itemID;
            send(amount, ixid);
        }
        else{
            $('#zero-response').html(result.text);
        }
    })

}

function insertXID(){
    $('ul[id$="-items"] > li').each(function(){
        var xid = $(this).attr('data-armoryid') || $(this).attr('data-item');
        if (xid){
            var butt = `<button class='torn-btn' id='${xid}-zero'>Copy XID</button>`;
            if ($(`#${xid}-zero`,$(this)).length == 0){
                $(this).append(butt);
                $(`#${xid}-zero`).on('click',function(){copy(xid)});
            }
        }
    })

}

function copy(x){
    navigator.clipboard
        .writeText(x)
        .then(() => {
        $('#zero-response').html('Copied! '+x);
    })
        .catch(() => {
        alert("something went wrong");
    });
}

function sendI2(){

    var userId = $('#zero-user').attr('value');
    var amount = $('#amount-iz').attr('value');
    var msg = $('#zero-message').attr('value');
    var id = $('#itemzz').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        tag:msg,
        userID:userId,
        amount:"1",
        itemID:id
    },function(result){
        result = JSON.parse(result);
        if (result.success){
            var ixid = result.itemID;
            send(amount, ixid);
        }
        else{
            $('#zero-response').html(result.text);
        }
    })

}
(function() {
    insert();
    setInterval(insertXID,400);
})();

