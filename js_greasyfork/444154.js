// ==UserScript==
// @name         チュウニズム購入上限変更
// @namespace    twitter.com/to_ku_me
// @version      0.2.1
// @description  自由に値を入力して購入できます
// @author       とくめいっ！
// @include      https://new.chunithm-net.com/chuni-mobile/html/mobile/netStore/currencyExchange*
// @exclude      https://new.chunithm-net.com/chuni-mobile/html/mobile/netStore/currencyExchangeConfirm*
// @icon         https://new.chunithm-net.com/chuni-mobile/html/mobile/images/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444154/%E3%83%81%E3%83%A5%E3%82%A6%E3%83%8B%E3%82%BA%E3%83%A0%E8%B3%BC%E5%85%A5%E4%B8%8A%E9%99%90%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/444154/%E3%83%81%E3%83%A5%E3%82%A6%E3%83%8B%E3%82%BA%E3%83%A0%E8%B3%BC%E5%85%A5%E4%B8%8A%E9%99%90%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

let li = [...document.getElementsByName("exchange_num")];

for (let i =0;i<li.length;i++){

    let inp = document.createElement("input");
    inp.name = "exchange_num";
    li[i].after(inp);
    li[i].remove();

}

let li2 = [...document.getElementsByClassName("btn_exchange_item_off")];
console.log(li2);


for (let i =0;i<li2.length;i++){
    let inp = document.createElement("button");
    inp.className = "btn_exchange_item_on";
    inp.style.border = "none";
    inp.style.outline = "none";
    li2[i].after(inp);
    li2[i].remove();
}


// let li_ = [20,30,50,70,90,99];

// for (let i =0;i<li.length;i++){

//     for (let n = 0;n<li_.length;n++){
// let op1 = document.createElement("option");
//         op1.text = li_[n];
//         op1.value = li_[n];
// li[i].appendChild(op1);
//     }


// }
