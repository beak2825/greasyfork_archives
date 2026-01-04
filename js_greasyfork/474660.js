// ==UserScript==
// @name         Simplify Amazon URLs
// @name:ja      AmazonのURLをシンプルにする
// @name:es      Simplificar las URL de Amazon
// @name:zh-CN   简化 Amazon 的 URL
// @namespace    https://x.com/mana2hoshi/
// @version      1.0
// @description  This script replaces Amazon URLs with a simple format: https://www.amazon.*/dp/[ASIN]
// @description:ja このスクリプトはAmazonのURLを https://www.amazon.*/dp/ [ASIN]というシンプルなものに置き換えます。
// @description:es Este script reemplaza las URL de Amazon con un formato simple: https://www.amazon.*/dp/[ASIN]
// @description:zh-cn 此脚本将亚马逊网址替换为简单的格式：https://www.amazon.*/dp/[ASIN]
// @license MIT
// @author       Manatsu
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amzn.com/*/dp/*
// @match        https://www.amazon.co.uk/*/dp/*
// @match        https://www.amazon.de/*/dp/*
// @match        https://www.amazon.fr/*/dp/*
// @match        https://www.amazon.it/*/dp/*
// @match        https://www.amazon.ca/*/dp/*
// @match        https://www.amazon.com.mx/*/dp/*
// @match        https://www.amazon.es/*/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.in/*/dp/*
// @match        https://www.amazon.com.br/*/dp/*
// @match        https://www.amazon.nl/*/dp/*
// @match        https://www.amazon.com.au/*/dp/*
// @match        https://www.amazon.ae/*/dp/*
// @match        https://www.amazon.eg/*/dp/*
// @match        https://www.amazon.pl/*/dp/*
// @match        https://www.amazon.se/*/dp/*
// @match        https://www.amazon.sg/*/dp/*
// @match        https://www.amazon.com.tr/*/dp/*
// @match        https://www.amazon.cn/*/dp/*
// @match        https://www.amazon.sa/*/dp/*
// @match        https://www.amazon.com.be/*/dp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474660/Simplify%20Amazon%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/474660/Simplify%20Amazon%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ページのURLを取得
    var currentUrl = window.location.href;

    // 正規表現を使用してASINを抽出
    var asinMatch = currentUrl.match(/\/dp\/([A-Za-z0-9]+)/);

    if (asinMatch && asinMatch[1]) {
        // ASINを取得
        var asin = asinMatch[1];

        // Amazonの国別ドメインを取得
        var amazonDomainMatch = currentUrl.match(/https:\/\/www\.amazon\.(.*?)\//);
        if (amazonDomainMatch && amazonDomainMatch[1]) {
            var amazonDomain = amazonDomainMatch[1];

            // 新しいURLを生成
            var newUrl = 'https://www.amazon.' + amazonDomain + '/dp/' + asin;

            // 新しいURLにリダイレクト
            window.location.href = newUrl;
        }
    }
})();
