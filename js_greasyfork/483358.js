// ==UserScript==
// @name         NicoNicoDic Product Link
// @version      0.40
// @description  Display product link on NicoNicoDic product articles
// @match        https://dic.nicovideo.jp/i/*
// @match        https://dic.nicovideo.jp/r/i/*
// @grant        none
// @license        MIT
// @namespace https://greasyfork.org/users/1078666
// @downloadURL https://update.greasyfork.org/scripts/483358/NicoNicoDic%20Product%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/483358/NicoNicoDic%20Product%20Link.meta.js
// ==/UserScript==
// Create a link element to access the product page

(function() {
    'use strict';

// Get the product ID from the URL
let id = location.pathname;

// Remove the lower part of the URL if any
id = id.replace(/\/\d+$/, "");

// Split the ID by slash and get the last element
id = id.split("/").pop();

// Check if the ID is valid
let regex = /^(az[A-Z0-9]{10}|an\d+|dw\d+|ga\d+|gg[\w-]+|ip\d+|it2\d+|nc\d+|nd[\w-]+|pa\d+|ys[\w-]+)$/;
if (regex.test(id)) {
    // Create a new element to display the product link
    let productDiv = document.createElement("div");
    productDiv.id = "productDiv";
    productDiv.style.margin = "10px";
    productDiv.style.padding = "10px";
    productDiv.style.border = "1px solid #ccc";
    productDiv.style.backgroundColor = "#fff";

    // Create an anchor element to link to the product page
    let productLink = document.createElement("a");
    productLink.id = "productLink";
    productLink.target = "_blank";

    // Determine the product type and link based on the ID
    let productType = id.slice(0, 2);
    let productId = id.slice(2);
    switch (productType) {
        case "az": // Amazon
            productLink.href = "https://www.amazon.co.jp/dp/" + productId;
            productLink.textContent = "Amazonでこの商品を見る";
            break;
        case "an": // Animate
            productLink.href = "https://www.animate-onlineshop.jp/pn/pd/" + productId + "/";
            productLink.textContent = "アニメイトでこの商品を見る";
            break;
        case "ys": { // Yahoo! Shopping
            let ysId = productId.split("_").join("/");
            productLink.href = "https://store.shopping.yahoo.co.jp/" + ysId;
            productLink.textContent = "Yahoo!ショッピングでこの商品を見る";
            break;
        }
        case "dw": // Dwango
            productLink.textContent = "ドワンゴジェイピーの商品です";
            break;
        case "ga": // Mobile Game
            productLink.textContent = "携帯ゲーム百選の商品です";
            break;
        case "gg": // JAPANCOOL.ASIA
            productLink.textContent = "JAPANCOOL.ASIA（ググッドёモール）の商品です";
            break;
        case "ip": // Idol
            productLink.textContent = "アイドルがイッパイの商品です";
            break;
        case "it": {// iTunes
            let itId = productId.slice(1);
            productLink.href = "https://music.apple.com/album/" + itId;
            productLink.textContent = "Apple Music (iTunes store) でこの商品を見る";
            break;
        }
        case "nc": // NicoNico Channel
            productLink.textContent = "ニコニコチャンネルのコンテンツです";
            break;
        case "nd": // NicoNico Direct
            productLink.textContent = "ニコニコ直販の商品です";
            break;
        case "pa": // Ticket Pia
            productLink.textContent = "チケットぴあの商品です";
            break;
        default:
            productLink.textContent = "不明な商品です";
    }

    // Append the productLink to the productDiv
    productDiv.appendChild(productLink);

    // Insert the productDiv after the heading element
    let heading = document.querySelector("h1");
    heading.parentNode.insertBefore(productDiv, heading.nextSibling);
} else {
    // Display an error message
    alert("無効なIDです。");
}

})();
