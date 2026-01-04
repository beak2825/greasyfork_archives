// ==UserScript==
// @name         TC Essential
// @namespace    tcessential.zero.torn
// @version      0.1
// @description  Tc essential modified
// @author       -zero [2669774]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472603/TC%20Essential.user.js
// @updateURL https://update.greasyfork.org/scripts/472603/TC%20Essential.meta.js
// ==/UserScript==

let api = '3nTeRY0uRAp1K3y';

let noOfEcx = 1;
let noOfLolli = 1;

const user = `<input type='text' name='user-id' id='zero-user' class='zero-input' placeholder='User Id'>`;
const armor = `<input type='button' class='torn-btn zerosender' value="Armor">`;
const lolli = `<input type='button' class='torn-btn zerosender' value='Lolli'>`;
const ecx = `<input type='button' class='torn-btn zerosender' value='Xtacy'>`;
const mac = `<input type='button' class='torn-btn zerosender' value='Macana'>`;

const message = `<input type='text' name='user-id' id='zero-message' class='zero-input' placeholder='Message' value=''>`;
const result =`<div id='zero-response'></div>`;

let macanas = [];
let armors = [];
let lollisn = 0;
let ecxn = 0;


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
        initialize();
        $('#loadoutsRoot').append(user);
        $('#loadoutsRoot').append(message);

        $('#loadoutsRoot').append(armor);
        $('#loadoutsRoot').append(mac);
        $('#loadoutsRoot').append(lolli);
        $('#loadoutsRoot').append(ecx);
        $('#loadoutsRoot').append(result);

        $('.zerosender').on("click", function(){
            let id = $(this).attr("value");
            console.log(id);

            if (id == "Macana"){
                sendW();

            }
            if (id == "Armor"){
                sendA();
            }
            if (id == "Lolli"){
                sendI(noOfLolli, 310);
                
            }
            if (id == "Xtacy"){
                sendI(noOfEcx, 197);
            }


        })



    }
    else{
        setTimeout(insert, 500);
    }
}

function sendW(){

    if (macanas.length == 0){
        alert("No macana left!");
        return;

    }
    let userId = $('#zero-user').attr('value');
    let id = macanas[0];
    let msg = $('#zero-message').attr('value');
    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        confirm:"1",
        XID:id,
        userID:userId,
        tag:msg,
        amount:"1"},function(result){
        result = JSON.parse(result);
        $('#zero-response').html(result.text);
    });

}
function sendA(){
    if (armors.length == 0){
        alert("No armors left!");
        return;

    }

    let userId = $('#zero-user').attr('value');
    let id = armors[0];
    let msg = $('#zero-message').attr('value');
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

function sendI(amount, id){
    if (id==310 && amount > lollisn){
        alert("No lollipop!");
        return;
    }
    if (id==197 && amount > ecxn){
        console.log(amount +" + "+ ecxn)
        alert("No xtacy!");
        return;
    }

    let userId = $('#zero-user').attr('value');
    let msg = $('#zero-message').attr('value');

    $.post('item.php?rfcv=undefined', {
        step:"sendItemAction",
        tag:msg,
        userID:userId,
        amount:"1",
        itemID:id
    },function(result){
        result = JSON.parse(result);
        if (result.success){
            let ixid = result.itemID;
            send(amount, ixid);
        }
        else{
            $('#zero-response').html(result.text);
        }
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

// function insertXID(){
//     $('ul[id$="-items"] > li').each(function(){
//         let xid = $(this).attr('data-armoryid') || $(this).attr('data-item');
//         if (xid){
//             let butt = `<button class='torn-btn' id='${xid}-zero'>Copy XID</button>`;
//             if ($(`#${xid}-zero`,$(this)).length == 0){
//                 $(this).append(butt);
//                 $(`#${xid}-zero`).on('click',function(){copy(xid)});
//             }
//         }
//     })

// }

// function copy(x){
//     navigator.clipboard
//         .writeText(x)
//         .then(() => {
//         $('#zero-response').html('Copied! '+x);
//     })
//         .catch(() => {
//         alert("something went wrong");
//     });
// }

// function sendI2(){

//     let userId = $('#zero-user').attr('value');
//     let amount = $('#amount-iz').attr('value');
//     let msg = $('#zero-message').attr('value');
//     let id = $('#itemzz').attr('value');
//     $.post('item.php?rfcv=undefined', {
//         step:"sendItemAction",
//         tag:msg,
//         userID:userId,
//         amount:"1",
//         itemID:id
//     },function(result){
//         result = JSON.parse(result);
//         if (result.success){
//             let ixid = result.itemID;
//             send(amount, ixid);
//         }
//         else{
//             $('#zero-response').html(result.text);
//         }
//     })

// }

function initialize(){
    fetch(`https://api.torn.com/user/?selections=inventory&key=${api}`).then(async response => {
        let resJ = await response.json();

        for (let item of resJ.inventory){
            if (item["name"] == "Macana"){
                macanas.push(itemp["UID"]);
            }
            if (item["name"] == "Full Body Armor"){
                armors.push(item["UID"]);
            }
            if (item["name"] == "Ecstasy"){
                ecxn = item["quantity"];
            }
            if (item["name"] == "Lollipop"){
                lollisn = item["quantity"];
            }
        }

    });

}
(function() {
    insert();
    
})();

