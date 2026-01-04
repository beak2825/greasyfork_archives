// ==UserScript==
// @name        My Nintendo Store ソフトページ 日本語非対応ソフトを目立たせる store-jp.nintendo.com
// @namespace   Violentmonkey Scripts
// @match       https://store-jp.nintendo.com/list/software/*
// @grant       none
// @version     1.01
// @author      Als323
// @license MIT
// @description 2024/2/26 21:47:38
// @downloadURL https://update.greasyfork.org/scripts/488383/My%20Nintendo%20Store%20%E3%82%BD%E3%83%95%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E9%9D%9E%E5%AF%BE%E5%BF%9C%E3%82%BD%E3%83%95%E3%83%88%E3%82%92%E7%9B%AE%E7%AB%8B%E3%81%9F%E3%81%9B%E3%82%8B%20store-jpnintendocom.user.js
// @updateURL https://update.greasyfork.org/scripts/488383/My%20Nintendo%20Store%20%E3%82%BD%E3%83%95%E3%83%88%E3%83%9A%E3%83%BC%E3%82%B8%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E9%9D%9E%E5%AF%BE%E5%BF%9C%E3%82%BD%E3%83%95%E3%83%88%E3%82%92%E7%9B%AE%E7%AB%8B%E3%81%9F%E3%81%9B%E3%82%8B%20store-jpnintendocom.meta.js
// ==/UserScript==
const body = document.querySelector('body');
const product_detail = document.querySelector('.productDetail--contents');
const product_desc = document.querySelector('.productDetail--catchphrase__longDescription');
const no_jp_caution = document.createElement('div');
no_jp_caution.id = 'no_jp_caution'
no_jp_caution.innerHTML = `<h2>日本語に対応していません</h2>
<p>このソフトは日本語に対応しておりません。ご購入される前に、対応言語のリストをご確認ください。</p>
<style>
#no_jp_caution{border: solid 4px #d20313;
margin-top:36px;
padding:15px}
#no_jp_caution h2{font-size: 20px;
    color:#d20313;
    font-weight: 700;
    overflow-wrap: break-word;
    word-break: break-all;}
</style>`

// 日本語非対応タイトルを目立たせる
if (product_desc.textContent.includes('※本作は日本語に対応しておりません')) {
    product_detail.prepend(no_jp_caution);
    product_desc.innerHTML = product_desc.innerHTML.replace('※本作は日本語に対応しておりません<br><br>', '');
}