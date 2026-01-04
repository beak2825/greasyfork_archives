// ==UserScript==
// @name         Amazon.co.jpの商品ページに各種リンク追加
// @namespace    https://www.amazon.co.jp/dp/
// @version      1.14
// @description  Amazon.co.jpの商品ページに固定URL、サクラチェッカー、keepaなどのリンクを追加します
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/gp/product/*
// @match        https://www.amazon.co.jp/*/ASIN/*
// @match        https://www.amazon.co.jp/product-reviews/*
// @match        https://www.amazon.co.jp/*/product-reviews/*
// @match        https://www.amazon.co.jp/kindle-dbs/product/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440936/Amazoncojp%E3%81%AE%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E5%90%84%E7%A8%AE%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/440936/Amazoncojp%E3%81%AE%E5%95%86%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E5%90%84%E7%A8%AE%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // フレーム内（iframeなど）なら終了
    if(window != window.parent) return;

    // 外部リンクのアイコンをスタイルシートで設定（クラス名は衝突を避けるためにわざとダサくしてる）
    GM_addStyle(
        ".gaiburinku::after{" +
        "    content: url(\'data:image/gif;base64,R0lGODlhDAAMAIABADMzM////yH5BAEAAAEALAAAAAAMAAwAAAIajB+gmgvnookPrVYnw3Dr/nnWI4JlSDlaahQA\');" +
        "    opacity: 0.7;" +
        "    margin-left: 2px;" +
        "}"
    );

    // メイン関数
    const mainFunction = () => {
        // すでに追加済みなら終了
        if(document.getElementById("various_links")) return;

        // ASIN取得
        let asin = null;
        let element_asin = document.getElementById("ASIN");
        if(element_asin){
            let t = String(element_asin.getAttribute("value")).match(/[0-9A-Za-z]{10}/);
            if(t) asin = t[0];
        }
        if(!asin){
            let t = location.href.match(/\/(dp|gp\/product|kindle\-dbs\/product|product-reviews|ASIN)\/([0-9A-Za-z]{10})/i);
            if(t) asin = t[2];
        }
        if(!asin) return;

        // 追加先取得（querySelectorを使うなら一括でも良いのだが、セレクタの優先順がよく分からないのでこうした）
        const csslist = ["#Northstar-Buybox", " #mobile_buybox_feature_div", "#buybox", "#cm_cr-buy_box", "#quick-buy-widget", "#a-page #hulk_buy_box, #a-page div.atf-dp > div.atf-dp-content > div.atf-dp-action"];
        let element_buybox = null;
        for(let i=0; i < csslist.length; i++){
            element_buybox = document.querySelector(csslist[i]);
            if(element_buybox) break;
        }
        if(!element_buybox) return;

        // 追加要素の外枠作成
        const div_outer = document.createElement("div");
        div_outer.id = "various_links";
        div_outer.style.marginTop = "0.5em";
        div_outer.style.marginBottom = "0.5em";
        div_outer.style.textAlign = "left";

        // リンクを作成して追加していく関数
        const createLinkElement = (url, text, bExternal) => {
            const d = document.createElement("div");
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.textContent = text;
            if(bExternal){
                a.setAttribute("target", "_blank");
                a.setAttribute("class", "gaiburinku");
            }
            d.appendChild(a);
            div_outer.appendChild(d);
        };

        // 固定URL
        createLinkElement("https://www.amazon.co.jp/dp/" + asin + "/", "固定URL", false);
        // 販売元Amazon.co.jpを優先（固定URLにsmid=AN1VRQENFRJN5を付けたもの）
        createLinkElement("https://www.amazon.co.jp/dp/" + asin + "/?smid=AN1VRQENFRJN5", "商品URL(販売Amazon優先)", false);
        // サクラチェッカー
        createLinkElement("https://sakura-checker.jp/search/" + asin + "/", "サクラチェッカーで検索", true);
        // keepa
        createLinkElement("https://keepa.com/#!product/5-" + asin, "keepaで検索", true);
        // キンセリで検索（kindle用としてKindle本のページの場合だけ表示する）
        if(document.querySelector("*[id*=\"booksInstantOrderUpdate\"],#cm_cr-buy_box a[href^=\"/\"][href*=\"-ebook/dp\"]")){
            createLinkElement("https://www.listasin.net/kndlsl/asins/" + asin, "キンセリで検索", true);
        }

        // 作成した要素を追加
        element_buybox.parentNode.insertBefore(div_outer, element_buybox.nextElementSibling);
    };

    // 動的更新の監視対象
    const desktop_buybox = document.querySelector("#dsv_buybox_desktop, #desktop_buybox_feature_div, #desktop_buybox, #combinedBuyBox, #Northstar-Buybox, #mobile_buybox_feature_div");
    if(desktop_buybox){
        (new MutationObserver(mainFunction)).observe(desktop_buybox, {childList:true});
    }

    // 初回実行
    mainFunction();
})();