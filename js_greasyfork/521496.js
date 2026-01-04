// ==UserScript==
// @name         sweetSend
// @namespace    omni
// @author       omni
// @version      0.1
// @description  Отправка конфет из почты
// @include      https://www.heroeswm.ru/sms.php?sms_id*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521496/sweetSend.user.js
// @updateURL https://update.greasyfork.org/scripts/521496/sweetSend.meta.js
// ==/UserScript==

unsafeWindow.send = function(i, nick, sign) {
    let xhr = new XMLHttpRequest();
    let body = "id=" + i + "&nick=" + encodeURIComponent(nick) + "&gold=0&sendtype=1&dtime=0&rep_price=0&art_id=&sign=" + sign;
    xhr.open("POST", '/art_transfer.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function() {getInv()};
}

function get_hwm(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
}

let sweetUrl = ["konf2025a", "konf2025b", "konf2025c", "konf2025g"];
let sweetImg = ["/i/artifacts/2012/konf2012a_b.png", "/i/artifacts/2012/konf2012b_b.png", "/i/artifacts/2012/konf2012c_b.png", "/i/artifacts/2012/konfeta_grinch_b.png"];


let el = document.querySelectorAll("li");

let j = 0;
for (let i = 0; i < el.length; i++) {
    if (el[i].innerHTML.includes("sms-create")) {
        j = i;
    }
}
let nick = el[j - 3].innerHTML.match(/>([^<]+)<\/a>/)[1];
let div = unsafeWindow.document.createElement('div');
div.setAttribute('id', 'test');
document.querySelectorAll("li")[j].before(div);
getInv();

function getInv() {
    let sweetId = [-1, -1, -1, -1];
    let sweetCount = [0, 0, 0, 0];
    let str = "Передать:<BR>";
    let inv = get_hwm("/inventory.php");
    let ids = Array.from(inv.matchAll(/\]\['id'\] = ([0-9]+)/g))
    let dur = Array.from(inv.matchAll(/\]\['durability1'\] = ([0-9]+)/g))
    let sign = inv.match(/sign=([^"|']+)/)[1];
    let s = inv.match(/([0-9+])..'art_id'. = 'konf2025a'/);
    if (s != null) {
        sweetId[0] = Number(ids[Number(s[1])][1]);
        sweetCount[0] = Number(dur[Number(s[1])][1]);
    }
    s = inv.match(/([0-9+])..'art_id'. = 'konf2025b'/);
    if (s != null) {
        sweetId[1] = Number(ids[Number(s[1])][1]);
        sweetCount[1] = Number(dur[Number(s[1])][1]);
    }
    s = inv.match(/([0-9+])..'art_id'. = 'konf2025c'/);
    if (s != null) {
        sweetId[2] = Number(ids[Number(s[1])][1]);
        sweetCount[2] = Number(dur[Number(s[1])][1]);
    }
    s = inv.match(/([0-9+])..'art_id'. = 'konf2025g'/);
    if (s != null) {
        sweetId[3] = Number(ids[Number(s[1])][1]);
        sweetCount[3] = Number(dur[Number(s[1])][1]);
    }

    for (let i = 0; i < sweetUrl.length; i++) {
        if (sweetId[i] >= 0) {
            str += "<img align='absmiddle' style = 'cursor:pointer' onclick = 'send(" + sweetId[i] + ", \"" + nick + "\", \"" + sign + "\")' width = '30px' src = '" + sweetImg[i] + "'>(" + sweetCount[i] + ") | ";
        }
    }
    document.querySelector("#test").innerHTML = str;
}

