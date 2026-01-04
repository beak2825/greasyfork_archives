// ==UserScript==
// @name        My Nintendo Store ソフトページにメーカーのソフト一覧へのリンクを追加 nintendo.co.jp
// @namespace   Violentmonkey Scripts
// @match     https://store-jp.nintendo.com/list/software/*
// @exclude \^https://store-jp\.nintendo\.com/list/software/\?.+$\
// @grant       none
// @version     1.03.1
// @author      Als323
// @license MIT
// @description 2024/03/03 15:50:28
// @downloadURL https://update.greasyfork.org/scripts/488034/My%20Nintendo%20Store%20%E3%82%BD%E3%83%95%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%AE%E3%82%BD%E3%83%95%E3%83%88%E4%B8%80%E8%A6%A7%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0%20nintendocojp.user.js
// @updateURL https://update.greasyfork.org/scripts/488034/My%20Nintendo%20Store%20%E3%82%BD%E3%83%95%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%AE%E3%82%BD%E3%83%95%E3%83%88%E4%B8%80%E8%A6%A7%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0%20nintendocojp.meta.js
// ==/UserScript==

const product_detail_table = document.querySelector('table.productDetail--spec');
let tr_list = product_detail_table.querySelectorAll('tr');
let maker_td, maker_name;
let maker_link;

let maker_link_create = function () {
    for (tr of tr_list) {
        let th = tr.querySelector('th');
        if (th.textContent === 'メーカー') {
            maker_td = tr.querySelector('td');
            maker_name = maker_td.textContent;
            let params = new URLSearchParams();
            params.set('q', maker_name);
            let aLink = document.createElement('a');
            aLink.href = `/list/software/?${params.toString()}`;
            aLink.style.color = '#0086e6';
            aLink.textContent = maker_td.textContent;
            maker_td.textContent = ''; //クリア
            maker_td.append(aLink);
            console.log(`リンク生成:${maker_name}`);
        }
    }

}
if (product_detail_table) {
    maker_link_create();
}