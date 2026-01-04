// ==UserScript==
// @author      @shinzan
// @description This script will automatically redeem your points at the Altador Cup Staff Tournament Prize Shop.
// @include     http://www.neopets.com/altador/colosseum/staff*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @name        StaffTournamentAuto
// @namespace   shinzan@clraik
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/383204/StaffTournamentAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/383204/StaffTournamentAuto.meta.js
// ==/UserScript==

//=== DONT TOUCH
const validItemsStaff = [79978, 79977, 79976, 79974, 79975, 79969, 79990, 79991, 79989, 79988, 79987, 79994, 79996, 79995, 79986, 79993, 79992, 79982, 79985, 79979, 79981, 79980, 79984, 79983, 79972, 79971, 79970, 79973];
const page = location.pathname || "";
let domainUrl, refererUrl, ck_ref, data, img_obj, item_price, item_name, org_src, total = 0;

//=== CHANGE THESE
const itemID = 79978;
let quantity = 1000;
const min = 700, max = 1200; // 1000 = 1 second.
//===

(function () {

if (typeof $ === 'undefined') $ = unsafeWindow.$;
if (typeof GM_xmlhttpRequest === 'undefined') GM_xmlhttpRequest = GM.xmlHttpRequest;

let load = 'https://s-media-cache-ak0.pinimg.com/originals/d8/a7/4c/d8a74c822c7f417a185d9d66e3875a60.gif';

domainUrl = `${page}api_staff.phtml`;
ck_ref = `ck=${/Input\['ck'\] = "(\w+)"/i.exec(document.documentElement.innerHTML)[1]}`;
data = `action=prizing&method=ajax&${ck_ref}&id=${itemID}`;
img_obj = $(`#prize-item-${itemID} img`);
item_price = parseInt($(`#prize-item-${itemID} span.price`).text());
item_name = $(`#prize-item-${itemID} span.name`).text();
org_src = $(img_obj).attr('src');

const rm = function () { return Math.floor(Math.random() * (max - min + 1)) + min; };

const onLoad = function (response = '{status : false, message : "default response"}') {
    $(img_obj).attr('src', org_src);
    var obj = JSON.parse(response.response);

    if(obj.status === 'success'){
        if(quantity > 0){
            if(++total < quantity) {
                setTimeout(function(){redeem();}, rm());
            }else{
                alert("script finished");
            }
        }else{
            if(parseInt(obj.points) > 0){
                setTimeout(function(){redeem();}, rm());
            }else{
                alert("we ran out of points");
            }
        }
    }else{
        alert(`something went wrong: ${obj.message}`);
    }
}

function redeem(){
    if (item_price > unsafeWindow.ACStaff._shopPoints) {
        alert(`We don't have enough points to buy ${item_name} we have: ${unsafeWindow.ACStaff._shopPoints} points and we need: ${item_price} points.`);
        return;
    }
    $(img_obj).attr('src', load);
    GM_xmlhttpRequest({
        method: "POST",
        url: domainUrl,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Referer': `http://www.neopets.com${page}`
        },
        onload: onLoad
    });
};

if(validItemsStaff.indexOf(itemID) === -1){
    alert(`itemID = ${itemID} is not for Staff Tournament please check`);
    throw `itemID = ${itemID} is not for Staff Tournament please check`;
}else{
    setTimeout(redeem(), 500);
}
})();