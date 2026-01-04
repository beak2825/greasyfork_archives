// ==UserScript==
// @name         ハーメルン　しおり一覧ページで読んでないのを色付け＆変形
// @namespace    https://greasyfork.org/ja/users/942894
// @version      2024-04-05
// @description  しおり一覧ページで読んでないのを色付け
// @author       _Hiiji
// @match        *://syosetu.org/?mode=siori2_view*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=32&domain=syosetu.org
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491713/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%81%97%E3%81%8A%E3%82%8A%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A7%E8%AA%AD%E3%82%93%E3%81%A7%E3%81%AA%E3%81%84%E3%81%AE%E3%82%92%E8%89%B2%E4%BB%98%E3%81%91%EF%BC%86%E5%A4%89%E5%BD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/491713/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%81%97%E3%81%8A%E3%82%8A%E4%B8%80%E8%A6%A7%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A7%E8%AA%AD%E3%82%93%E3%81%A7%E3%81%AA%E3%81%84%E3%81%AE%E3%82%92%E8%89%B2%E4%BB%98%E3%81%91%EF%BC%86%E5%A4%89%E5%BD%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ▼▼▼▼▼▼▼▼▼▼通常・夜間モードの色▼▼▼▼▼▼▼▼▼▼

    const coler = ["#FFAAAA", "#550000"];

    // ▲▲▲▲▲▲▲▲▲▲通常・夜間モードの色▲▲▲▲▲▲▲▲▲▲

    function siori_henkei(){
        const element_th1 = document.createElement("th");
        const element_th2 = document.createElement("th");
        element_th1.setAttribute('class','custumT1');
        node_th.setAttribute('class','custumT2');
        element_th2.setAttribute('class','custumT3');

        node_th.parentNode.insertBefore(element_th1,node_th);
        node_th.parentNode.appendChild(element_th2);
        const node_span = node_table.getElementsByTagName("span");
        for(let i = 0; i < node_td.length; i++)
        {
            const element_td1 = document.createElement("td");
            const element_td2 = document.createElement("td");
            node_td[i].setAttribute('class','custumT1');
            element_td1.setAttribute('class','custumT2');
            element_td2.setAttribute('class','custumT3');
            node_td[i].parentNode.appendChild(element_td1);
            node_td[i].parentNode.appendChild(element_td2);
            element_td1.appendChild(node_td[i].getElementsByTagName("a")[0]);
            element_td2.appendChild(node_span[i]);
            node_span[i].querySelector("a:last-child").insertAdjacentElement("afterend", document.createElement("br"),)
            node_td[i].innerHTML = node_td[i].innerHTML.replace("&nbsp;&nbsp;","");
        }
        for (const val of node_table.getElementsByClassName("custumT1")) {val.setAttribute('width','20em');}
        for (const val of node_table.getElementsByClassName("custumT2")) {val.setAttribute('valign','top');}
        for (const val of node_table.getElementsByClassName("custumT3")) {val.setAttribute('width','150em');}
    }

    function siori_irotuke(){
        const ShioriNow = node_table.querySelectorAll("tr > td:nth-of-type(3) > span > a:nth-of-type(1)");
        const ShioriAll = node_table.querySelectorAll("tr > td:nth-of-type(3) > span > a:nth-of-type(2)");
        const update = node_table.querySelectorAll("tr > td:nth-of-type(3) > span");
        let coler_C = coler[0];
        if(document.querySelector("body.night")){coler_C = coler[1];}
        for(let i = 0; i < ShioriAll.length; i++)
        {
           // console.log(ShioriNow[i].href);
           // console.log(ShioriAll[i].href);
           // console.log(update[i].parentNode.getAttribute('style'));
            if(ShioriNow[i].href !== ShioriAll[i].href)
            {update[i].parentNode.setAttribute('style', 'background-color: '+coler_C+';');}
           // console.log(update[i].parentNode.getAttribute('style'));
        }
    }

    const node_table = document.getElementsByClassName("mytable1")[0];
    const node_th = node_table.getElementsByTagName("th")[0];
    const node_td_C = node_table.getElementsByTagName("td");
    const node_td = Array.from(node_td_C);
    const Link = node_table.getElementsByTagName("a");
    // しおりの形を変える
    siori_henkei();
    // しおりが最新話に挟まってない場合　赤背景に
    siori_irotuke();
    // リンクを全部新しいタブで開くように
    for (const val of Link) {val.target = "_blank";}
})();