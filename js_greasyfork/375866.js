// ==UserScript==
// @name         Amazon.co.jp検索非表示
// @namespace    https://www.amazon.co.jp/b/
// @version      1.5.1
// @description  Amazon.co.jpの検索で任意の商品やスポンサープロダクトなどを非表示。コマンド「Kindle注文済みスキャン」で注文済みを非表示にもできます
// @match        https://www.amazon.co.jp/s?*
// @match        https://www.amazon.co.jp/s/*
// @match        https://www.amazon.co.jp/*/s?*
// @match        https://www.amazon.co.jp/*/s/*
// @match        https://www.amazon.co.jp/b?*
// @match        https://www.amazon.co.jp/b/*
// @match        https://www.amazon.co.jp/*/b?*
// @match        https://www.amazon.co.jp/*/b/*
// @match        https://www.amazon.co.jp/gp/search*
// @match        https://www.amazon.co.jp/gp/browse.html*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @author       nanashi <welcometikyu-stayhome@yahoo.co.jp>
// @downloadURL https://update.greasyfork.org/scripts/375866/Amazoncojp%E6%A4%9C%E7%B4%A2%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/375866/Amazoncojp%E6%A4%9C%E7%B4%A2%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // 設定
    const MAX_CROWLS = 4;							// Kindle注文済みスキャン時の最大同時クロール数
    const CROWL_INTERVAL = 1000;					// クロールの最低間隔（ミリ秒）
    const DEFAULT_CACHE_TIME = 100*24*60*60*1000;	// キャッシュ管理でのデフォルト削除基準（最終参照からのミリ秒）
    const SESSION_CACHE_TIME = 1 * 60 * 1000;		// 再スキャン禁止時間（ミリ秒）。個別で設定される
    const POP_TIME = 2700;							// ポップアップの表示時間（ミリ秒）
    const POP_DELAY = 500;							// 細切れになりがちなポップアップをまとめるためのディレイ時間（ミリ秒）
    const KAKUSU_BUTTON_TEXT = "[非表示]";			// 非表示設定ボタンのテキスト
    const SAKURA_LINK_TEXT = "[サクラ]";			// サクラチェッカーへのリンクテキスト
    const KEEPA_LINK_TEXT = "[keepa]";			// keepaへのリンクテキスト

    // フレーム内（iframeなど）なら終了
    if(window != window.parent){
        return;
    }

    // 検索上部や検索内の広告非表示用のCSSセレクタ
    // 2024年12月、使われていない古いものもあったので整理
    const advertisement_css_selector =
          "#search div[data-asin=\"\"][data-uuid] div[id*=\"CardInstance\"], " +
          "#search div[data-asin=\"\"] div[data-uuid] div[id*=\"CardInstance\"], " +
          "#search div[data-asin=\"\"][data-uuid] div[cel_widget_id*=\"VIDEO_SINGLE_PRODUCT\"], " +
          "#search div[data-asin=\"\"] div[data-uuid] div[cel_widget_id*=\"VIDEO_SINGLE_PRODUCT\"]";

    // FEATURED ADVISER（おすすめ的なもの）の非表示用のCSSセレクタ
    // 2024年12月、使われていない古いものもあったので整理
    const featured_adviser_css_selector =
          "#search div[data-asin=\"\"][data-uuid] div.celwidget[cel_widget_id*=\"FEATURED_ASINS_LIST\"]," +
          "#search div[data-asin=\"\"] div[data-uuid] div.celwidget[cel_widget_id*=\"FEATURED_ASINS_LIST\"]";

    // 1-Click購入ボタンの非表示用のCSSセレクタ
    // 誤爆防止のためセレクタを長めに指定してる
    const oneclick_button_css_selector =
          "#search div[data-asin] span[class*=\"oneclick\"][class*=\"button\"]," +
          "#search div[data-asin] span[class*=\"oneclick\"][class*=\"button\"] + div[class*=\"micro\"]," +
          "#search div[data-asin] span[class*=\"oneclick\"][class*=\"button\"] + br + div[class*=\"micro\"]," +
          "#search div[data-asin] span[class*=\"preorder\"][class*=\"button\"]," +
          "#search div[data-asin] span[class*=\"preorder\"][class*=\"button\"] + div[class*=\"micro\"]," +
          "#search div[data-asin] span[class*=\"preorder\"][class*=\"button\"] + br + div[class*=\"micro\"]," +
          "#search div[data-asin] span[data-action=\"post-button-action\"]," +
          "#search div[data-asin] span[data-action=\"post-button-action\"] + div[class*=\"micro\"]," +
          "#search div[data-asin] span[data-action=\"post-button-action\"] + br + div[class*=\"micro\"]";
    const oneclick_button_css_selector_old =
          "#search-results li[data-asin] > div.s-item-container > div.a-fixed-left-grid div.a-col-right:last-child > div.a-row:last-child > div.a-column.a-span7:first-child > div.a-row > span[class*=\"button\"]:only-child," +
          "#search-results li[data-asin] > div.s-item-container > div.a-fixed-left-grid div.a-col-right:last-child > div.a-row:last-child > div.a-column.a-span7:first-child > div.a-row > span[class*=\"small\"]:only-child";

    // カートへ入れるボタンの非表示用のCSSセレクタ
    const cart_button_css_selector =
          "#search div[data-asin] span[data-component-type$=\"cart-container-component\"]," +
          "#search div[data-asin] div[data-csa-c-content-id*=\"s-search-add-to-cart-action\"]";

    // スタイルシートを一括追加
    GM_addStyle(
        // ポップアップ用のスタイルシート（Amazon側の命名と被らないようにダサいローマ字命名）
        "#oshirase-outer{" +
        "  position: fixed;" +
        "  top: 16px;" +
        "  left: 16px;" +
        "  padding: 0;" +
        "  border: 0;" +
        "  z-index: 9999;" +
        "}" +
        ".oshirase-pop, .oshirase-pop-large{" +
        "  display: table;" +
        "  color: black;" +
        "  line-height: 1.5em;" +
        "  margin-top: 0.25em;" +
        "  padding: 0.3em;" +
        "  background-color: white;" +
        "  border: 4px solid #090;" +
        "  border-radius: 4px;" +
        "  box-shadow: 0px 0px 4px 2px rgba(0,128,0,0.3);" +
        "}" +
        ".oshirase-pop{" +
        "  font-size: 16px;" +
        "}" +
        ".oshirase-pop-large{" +
        "  font-size: 28px;" +
        "}" +

        // 非表示、次に非表示、KDP疑いのスタイルシート
        ".kakusu{" +
        "  display: none !important;"+
        "}" +
        ".kakusu-temp, .kakusu-bought, .kakusu-kdp{" +
        "  display:inline-block;" +
        "}" +
        ".kakusu-temp > div, .kakusu-bought > div, .kakusu-kdp > div{" +
        "  border: 1px solid #00f !important;" +
        "  opacity: 0.5;" +
        "  padding: 0 1px;" +
        "}" +
        ".kakusu-temp::before, .kakusu-bought::before, .kakusu-kdp::before{" +
        "  position: absolute;" +
        "  right: 0;" +
        "  top: 0;" +
        "  padding: 0.25em;" +
        "}" +
        ".kakusu-temp::before{" +
        "  content: \"次回から非表示\";" +
        "  color: #fff;" +
        "  background-color: #000;" +
        "}" +
        ".kakusu-bought::before{" +
        "  content: \"注文済み\";" +
        "  color: #fff;" +
        "  background-color: #00f;" +
        "}" +
        ".kakusu-kdp::before{" +
        "  content: \"KDP疑い\";" +
        "  color: #fff;" +
        "  background-color: #08f;" +
        "}" +

        // スポンサープロダクト非表示用のスタイルシート
        ".kakusu-sp{display: none !important;}" +

        // コンフィグ設定用のスタイルシート
        "#config-kakusu-cache, #config-setting{" +
        "  font-size: 14px;" +
        "  line-height: 18px;" +
        "  margin-top: 0.25em;" +
        "  padding: 1em;" +
        "  background-color: #efe;" +
        "  border: 4px solid #090;" +
        "  border-radius: 4px;" +
        "  box-shadow: 0px 0px 4px 2px rgba(0,128,0,0.3);" +
        "}" +
        "#config-kakusu-cache-textarea1{" +
        "  width: 100%;" +
        "  height: 256px;" +
        "  display: block;" +
        "}" +
        "#config-kakusu-cache-textarea2{" +
        "  width: 100%;" +
        "  height: 192px;" +
        "  display: block;" +
        "}" +
        "#config-kakusu-cache button{" +
        "  margin: 0.25em 0;" +
        "  padding: 0.25em;" +
        "}" +
        "#config-setting label{" +
        "  display: inline;" +
        "  padding: 0 0 0 0.25em;" +
        "  font-weight: normal;" +
        "}" +

        // 「出品者Amazon.co.jpを選択」ボタン関連
        "#seller_only_amazon > button{" +
        "  border-radius: 5px;" +
        "  padding: 4px;" +
        "  border: 2px solid #aaa;" +
        "  background: #eee;" +
        "  color: #000;" +
        "}" +
        "#seller_only_amazon.hikaru > button{" +
        "  border: 2px solid #a00 !important;" +
        "  background: #f00 !important;" +
        "  color: #fff !important;" +
        "}" +

        // 2019年3月頃からのAmazon側のスタイルシートに少し手を加える
        "span[data-component-type$=\"-search-results\"] div[data-asin]," +
        "span[data-component-type$=\"-search-results\"] div[data-asin] div[class*=\"-col-inner\"] > div{" +
        "  position: relative;" +
        "}" +

        // 検索上部や検索内の広告非表示
        (!localStorage.getItem("ADVERTISEMENT_SPACE_VISIBLE")
         ? advertisement_css_selector + "{" +
           "  display: none;" +
           "  opacity: 0.5;" +
           "}"
         : "") +

        // FEATURED ADVISER（おすすめ的なもの）の非表示
        (!localStorage.getItem("FEATURED_ADVISER_VISIBLE")
         ? featured_adviser_css_selector + "{" +
           "  display: none;" +
           "  opacity: 0.5;" +
           "}"
         : "") +

        // 「1-Click購入ボタン」および「カートへ入れるボタン」の非表示
        (!localStorage.getItem("ONECLICK_BUTTON_VISIBLE")
         ? oneclick_button_css_selector + "{" +
           "  visibility: hidden;" + // display:noneで消すと要素を詰める再描写が少し気になるのでvisibility:hiddenにした
           "}" +
           oneclick_button_css_selector_old + "{" +
           "  display: none;" +
           "}" +
           cart_button_css_selector + "{" +
           "  display: none;" +
           "}"
         : "")
    );

    // 確認モード用スタイルシート
    const visible_style =
          ".kakusu, .kakusu-sp{" +
          "  display:inline-block !important;" +
          "  opacity: 0.5 !important;" +
          "}" +
          ".kakusu > div{" +
          "  border: 1px solid #00f !important;" +
          "}" +
          advertisement_css_selector + "{" +
          "  display: block !important;" +
          "}" +
          featured_adviser_css_selector + "{" +
          "  display: inline !important;" +
          "}" +
          oneclick_button_css_selector + "{" +
          "  visibility: visible !important;" +
          "}" +
          oneclick_button_css_selector_old + "{" +
          "  display: inline-block;" +
          "}" +
          cart_button_css_selector + "{" +
          "  display: inline;" +
          "}";

    ////////////////////////////////
    // Promiseを使ったsleep関数。async関数内でawaitを付けてコールする
    const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));

    ////////////////////////////////
    // 要素の削除
    const removeElement = (e) => {
        if(e && e.parentNode) e.parentNode.removeChild(e);
    };

    ////////////////////////////////
    // ページ内から検索結果のリストを取得
    const getLIST = () => document.querySelectorAll('li[data-asin], span[data-component-type$="-search-results"] > div > div[data-asin]');

    ////////////////////////////////
    // ASINと見られる文字列をサニタイズ（空白や改行があるかもしれないので念のため）
    const sanitizeASIN = (asin) => {
        const a = String(asin).match(/[0-9A-Za-z]{10}/);
        if(!a) return null;
        return a[0];
    };

    ////////////////////////////////
    // 非表示キャッシュ（localStorageを使用）
    const setHideCcahe = (asin) => localStorage.setItem("NGASIN" + asin, String(Date.now()));
    const getHideCcahe = (asin) => Number(localStorage.getItem("NGASIN" + asin));
    const removeHideCcahe = (asin) => localStorage.removeItem("NGASIN" + asin);
    const clearHideCcahe = () => {
        const rx = /^NGASIN[0-9A-Za-z]{10}$/;
        for(const key in localStorage){
            if(rx.test(key)){
                localStorage.removeItem(key);
            }
        }
    };
    const expirationLocalCache = (cache_time) => {
        if(!cache_time){
            cache_time = DEFAULT_CACHE_TIME;
        }else{
            cache_time = Number(cache_time);
            if(cache_time < 0) cache_time = 0;
        }
        const deadline = Date.now() - cache_time;
        let cache_count = 0;
        let remove_count = 0;
        let remove_asins = [];
        const slice_begin = "NGASIN".length; // 接頭文字の長さ
        for(const key in localStorage){
            if(/^NGASIN[0-9A-Za-z]{10}$/.test(key)){
                cache_count++;
                if(Number(localStorage.getItem(key)) <= deadline){
                    localStorage.removeItem(key);
                    remove_count++;
                    remove_asins.push(key.slice(slice_begin));
                }
            }else if(/^NGASIN/.test(key)){ // ゴミの可能性があるので削除
                localStorage.removeItem(key);
            }
        }
        setRemoveUndoCache(remove_asins);
        return [cache_count, remove_count]; // キャッシュ数(削除前)と削除数を返す
    };

    ////////////////////////////////
    // スキャン済みキャッシュ（sessionStorageなのでブラウザのタブを閉じると消える。また他のタブと共有もされない）
    const setScannedCache = (asin) => sessionStorage.setItem("SCANNED" + asin, String(Date.now()));
    const getScannedCache = (asin) => Number(sessionStorage.getItem("SCANNED" + asin));
    const removeScannedCache = (asin) => sessionStorage.removeItem("SCANNED" + asin);
    const clearScannedCache = () => {
        for(const key in sessionStorage){
            if(/^SCANNED[0-9A-Za-z]{10}$/.test(key)){
                sessionStorage.removeItem(key);
            }
        }
    };
    const expirationSessionCache = () => {
        const deadline = Date.now() - SESSION_CACHE_TIME;
        for(const key in sessionStorage){
            if(/^SCANNED[0-9A-Za-z]{10}$/.test(key) && Number(sessionStorage.getItem(key)) <= deadline){
                sessionStorage.removeItem(key);
            }
        }
    };

    ////////////////////////////////
    // Undoキャッシュ（sessionStorageなのでブラウザのタブを閉じると消える。また他のタブと共有もされない）
    const clearUndoCache = () => {
        sessionStorage.removeItem("HIDE_UNDO_CACHE");
        sessionStorage.removeItem("REMOVE_UNDO_CACHE");
    };
    const setHideUndoCache = (asins) => {
        clearUndoCache();
        sessionStorage.setItem("HIDE_UNDO_CACHE", asins.join(","));
    };
    const getHideUndoCache = () => {
        const s = sessionStorage.getItem("HIDE_UNDO_CACHE");
        if(!s) return [];
        return s.split(",");
    };
    const setRemoveUndoCache = (asins) => {
        clearUndoCache();
        sessionStorage.setItem("REMOVE_UNDO_CACHE", asins.join(","));
    };
    const getRemoveUndoCache = () => {
        const s = sessionStorage.getItem("REMOVE_UNDO_CACHE");
        if(!s) return [];
        return s.split(",");
    };

    ////////////////////////////////
    // ポップアップなどを表示する場所（#oshirase-outer）のエレメント取得。なければ作成もする
    const getElementOshiraseOuter = () => {
        let outer = document.getElementById("oshirase-outer");
        // outer部分がなければ作成
        if(!outer){
            outer = document.createElement("div");
            outer.setAttribute("id", "oshirase-outer");
            document.getElementsByTagName("body")[0].appendChild(outer);
        }
        return outer;
    };

    ////////////////////////////////
    // ポップアップ用の要素作成
    const createPopupElement = (class_name, default_text) => {
        const e = document.createElement("div");
        if(class_name) e.classList.add(class_name);
        if(default_text) e.textContent = default_text;
        const outer = getElementOshiraseOuter();
        outer.appendChild(e);
        return e;
    };

    ////////////////////////////////
    // 要素をフェードアウトさせながら削除
    const fadeoutElement = (e) => {
        if(!e) return;
        setTimeout(async ()=>{
            const start_time = Date.now();
            const num = 10;
            const wait_time = 20;
            let i = 0;
            while(i < num){
                const f = ((num-1-i)/num).toFixed(5);
                e.style.opacity = f;
                e.style.transform = "scaleY(" + f + ")";
                await sleep(wait_time);
                i++;
                const skip = Math.floor((Date.now()-start_time)/wait_time) - i;
                if(skip > 0) i += skip;
            }
            removeElement(e);
        }, POP_TIME);
    };

    ////////////////////////////////
    // 上のcreatePopupElementとfadeoutElementで簡易ポップアップ表示
    const popup = (text, large) => fadeoutElement(createPopupElement(large?"oshirase-pop-large":"oshirase-pop", text));

    ////////////////////////////////
    // hideNGASIN()によるポップアップが細切れになってしまうので、少し遅延させてまとめて表示させる
    // 以下はクロージャになっているので注意
    const popupDelay4hideNGASIN = (() => {
        let hide_count_total = 0;
        let sp_count_total = 0;
        const exec = () => {
            if(hide_count_total > 0){
                let result_str = hide_count_total + "件非表示";
                if(sp_count_total > 0) result_str += "(スポンサープロダクト" + sp_count_total + "件)";
                popup(result_str);
            }
            hide_count_total = 0;
            sp_count_total = 0;
        };
        return ((hide_count, sp_count)=>{
            if(hide_count > 0 || sp_count > 0){
                hide_count_total += hide_count;
                sp_count_total += sp_count;
                setTimeout(exec, POP_DELAY);
            }
        });
    })();

    ////////////////////////////////
    // 非表示のメインとなる関数
    // キャッシュデータに基づいてNG ASINを非表示（MutationObserver対応）
    const hideMain = (records) => {
        let li_list = [];
        // 引数recordsが有効ならMutationObserverで呼び出されたとして処理
        if(records){
            for(const record of records){
                if(record.type == "childList" && record.target){
                    for(const node of record.target.querySelectorAll('li[data-asin],data[data-asin],div[data-asin]')){
                        if(sanitizeASIN(node.getAttribute("data-asin")) && !node.getAttribute("kakusuflag")){
                            node.setAttribute("kakusuflag", "1");
                            li_list.push(node);
                        }
                    }
                }
            }
        }else{
            li_list = getLIST(); // ページ内からリストを取得
        }

        // 「出品者Amazon.co.jpを選択」ボタンを追加
        operateOnlyAmazonButton();

        // 対象が0個なら終了
        if(li_list.length == 0){
            return;
        }

        const b_sponcer_product_hide = !localStorage.getItem("SPONSOR_PRODUCT_VISIBLE");// スポンサープロダクト非表示フラグ
        const b_kakusu_button_visible = !localStorage.getItem("KAKUSU_BUTTON_HIDE");// 非表示設定ボタン表示フラグ
        const b_sakura_link_visible = !localStorage.getItem("SAKURA_LINK_HIDE");// サクラチェッカーリンク表示フラグ
        const b_keepa_link_visible = !localStorage.getItem("KEEPA_LINK_HIDE");// keepaリンク表示フラグ
        const b_price_emphasis = !localStorage.getItem("PRICE_EMPHASIS_OFF");// 価格強調フラグ

        // [サクラ][keepa][非表示]のテンプレート。これのコピー（クローン）を作って追加する
        let node_template = null;
        let node_template_sakura = null;
        let node_template_keepa = null;
        if(b_sakura_link_visible || b_kakusu_button_visible){
            node_template = document.createElement("span");
            node_template.setAttribute("kakusu", "outer");
            node_template.style = "position:absolute;right:0;bottom:-4px;";
            if(b_sakura_link_visible){
                let anode = null;
                anode = document.createElement("a");
                anode.classList.add("a-size-small");
                anode.setAttribute("href", "javascript:void(0);");
                anode.setAttribute("target", "_blank");
                anode.setAttribute("kakusu", "sakura");
                anode.setAttribute("title", "サクラチェッカーでサクラ度確認");
                anode.textContent = SAKURA_LINK_TEXT;
                node_template.appendChild(anode);
            }
            if(b_keepa_link_visible){
                let anode = null;
                anode = document.createElement("a");
                anode.classList.add("a-size-small");
                anode.setAttribute("href", "javascript:void(0);");
                anode.setAttribute("target", "_blank");
                anode.setAttribute("kakusu", "keepa");
                anode.setAttribute("title", "keepaで価格推移確認");
                anode.textContent = KEEPA_LINK_TEXT;
                node_template.appendChild(anode);
            }
            if(b_kakusu_button_visible){
                let anode = null;
                anode = document.createElement("a");
                anode.classList.add("a-size-small");
                anode.setAttribute("href", "javascript:void(0);");
                anode.setAttribute("kakusu", "config");
                anode.setAttribute("title", "表示/非表示の切替");
                anode.textContent = KAKUSU_BUTTON_TEXT;
                node_template.appendChild(anode);
            }
            node_template_sakura = node_template.querySelector('a[kakusu="sakura"]');
            node_template_keepa = node_template.querySelector('a[kakusu="keepa"]');
        }

        // メインループ
        let hide_count = 0;
        let sp_count = 0;
        for(const li of li_list){
            const asin = sanitizeASIN(li.getAttribute("data-asin"));
            if(!asin) continue;
            li.setAttribute("kakusuflag", "2"); // 処理済みフラグ
            if(b_sponcer_product_hide && li.querySelector('*[class*="sponsored"],*[data-component-type*="sponsored"]')){
                // スポンサープロダクトの非表示
                li.classList.add("kakusu-sp");
                hide_count++;
                sp_count++;
            }else if(getHideCcahe(asin)){
                // 非表示設定されているものを非表示
                setHideCcahe(asin); // キャッシュの最終参照時刻更新
                li.classList.add("kakusu");
                hide_count++;
            }else{
                li.classList.remove("kakusu");
                li.classList.remove("kakusu-sp");
            }
            li.classList.remove("kakusu-temp");
            li.classList.remove("kakusu-bought");
            li.classList.remove("kakusu-kdp");

            // [サクラ][keepa][非表示]を追加する
            if(b_sakura_link_visible || b_kakusu_button_visible){
                const target_node = li.querySelector('div.sg-col-inner > div');
                if(target_node && !target_node.querySelector('span[kakusu="outer"]')){ // すでにある場合は追加しない
                    // URL設定（コピー前のテンプレート側を弄っている。その方がコードが簡略になるため）
                    if(b_sakura_link_visible && node_template_sakura){
                        node_template_sakura.setAttribute("href", "https://sakura-checker.jp/search/" + asin + "/");
                    }
                    if(b_keepa_link_visible && node_template_keepa){
                        node_template_keepa.setAttribute("href", "https://keepa.com/#!product/5-" + asin);
                    }
                    // テンプレートをコピーして追加
                    target_node.appendChild(node_template.cloneNode(true));
                    // ここで[非表示]ボタンのクリック処理も追加するつもりだったが、他のイベント処理で消えることがあったので別のやり方にする
                }
            }

            // 目立たない文字色にされている価格やポイントを分かりやすく強調する
            // （kindle unlimited対象だと通常価格が目立たなくされていることがある）
            if(b_price_emphasis){
                for(const span of li.querySelectorAll('div.a-row > span')){
                    let m = span.innerHTML.match(/^(\s*または.*?)(￥[0-9][0-9,]*)(\s*で購入.*)$/);
                    if(m){
                        span.innerHTML = m[1] + "<span style=\"color:#B12704!important;font-size:120%!important;\">" + m[2] + "</span>" + m[3];
                        continue;
                    }
                    m = span.innerHTML.match(/^(\s*Amazon\s*ポイント\s*[:：]\s*)([1-9][0-9,]*\s*pt\s*\([0-9,\.]+[%％]\))(\s*)$/i);
                    if(m){
                        span.innerHTML = m[1] + "<span style=\"color:#B12704!important;\">" + m[2] + "</span>" + m[3];
                        continue;
                    }
                }
            }
        }

        // ポップアップを遅延表示
        popupDelay4hideNGASIN(hide_count, sp_count);
    };

    ////////////////////////////////
    // クリック時のイベント処理（「非表示設定」をクリックした際の処理）
    if(!localStorage.getItem("KAKUSU_BUTTON_HIDE")){ // 非表示設定ボタンが非表示なら不要な処理
        document.addEventListener("click", ((event) => {
            // 「非表示設定」をクリックしたか判定
            const e = event.target;
            if(e.getAttribute("kakusu") != "config") return true;

            // 親要素を巡っていき、最初に見つけたdata-asinのASINを使う
            let li = e.parentNode;
            let asin = null;
            while(li){
                asin = sanitizeASIN(li.getAttribute("data-asin"));
                if(asin) break;
                li = li.parentNode;
            }
            if(!asin) return true;

            // 表示/非表示を切り替える
            if(!getHideCcahe(asin)){
                setHideCcahe(asin); // キャッシュ更新（最終参照時刻を更新）
                li.classList.add("kakusu-temp"); // すぐ消さずに仮置き状態
                setHideUndoCache([asin]);
            } else {
                removeHideCcahe(asin);
                li.classList.remove("kakusu");
                li.classList.remove("kakusu-temp");
                li.classList.remove("kakusu-bought");
                li.classList.remove("kakusu-kdp");
                li.classList.remove("kakusu-sp");
                clearUndoCache();
            }
            event.preventDefault(); // ページ遷移無効
            return false;
        }), false);
    }

    ////////////////////////////////
    // 表示中の商品を全て非表示設定する
    const hideAll = () => {
        let hide_asins = [];
        for(const li of getLIST()){
            const asin = sanitizeASIN(li.getAttribute("data-asin"));
            if(asin && !getHideCcahe(asin)){
                setHideCcahe(asin); // 非表示キャッシュに追加
                li.classList.add("kakusu-temp");
                hide_asins.push(asin);
            }
        }
        setHideUndoCache(hide_asins);
        popup(hide_asins.length + "件が次回から非表示"); // ポップ表示
    };

    ////////////////////////////////
    // スキャンして購入済みASINをキャッシュに保存
    const scanBought = async () => {
        // 検索結果のリストを取得
        const li_list = getLIST();
        if(li_list.length == 0){
            popup("検索結果がありません", true);
            return;
        }

        // スキャン済みキャッシュの中から期限切れのものを削除（sessionStorageなので消えてることが多い）
        expirationSessionCache();

        // KDP疑いを含めるか？のフラグ
        const b_perhaps_kdp_hide = !!localStorage.getItem("PERHAPSKDP_HIDE");

        // クロールリスト作成
        let crawl_asins = [];
        let skip_count = 0;
        for(const li of li_list){
            const asin = sanitizeASIN(li.getAttribute("data-asin"));
            if(!asin) continue;
            if(getHideCcahe(asin)){
                setHideCcahe(asin); // キャッシュ更新（最終参照時刻を更新）
            }else if(getScannedCache(asin)){
                skip_count++;
            }else if(window.getComputedStyle(li).display == "none"){
                // すでに非表示（他のスクリプトで消された可能性）
            }else{
                crawl_asins.push(asin); // クロール対象
            }
        }

        const prog = createPopupElement("oshirase-pop-large", "-"); // 進捗をポップアップでお知らせする部分
        let bought_asins = [];
        let kdp_asins = [];
        let scanned_asins = [];
        let error_asins = [];
        let last_crawl_time = 0;
        while(1){
            // 残り0個になったら終了
            const remain = crawl_asins.length;
            if(remain <= 0) break;
            prog.textContent = crawl_asins[0] + "あたりをスキャン中(残り" + remain + ")";

            // 前回との間隔がCROWL_INTERVALより短い場合はスリープする
            let now_time = Date.now();
            const sleep_time = last_crawl_time + CROWL_INTERVAL - now_time;
            if(sleep_time > 0){
                await sleep(sleep_time);
                now_time = Date.now();
            }
            last_crawl_time = now_time;

            // crawl_asinsからASINをMAX_CROWLS個取り出しクロール
            let task_list = [];
            for(let i = 0; i < MAX_CROWLS && crawl_asins.length > 0; i++){
                const asin = crawl_asins.shift();
                task_list.push(
                    fetch("https://www.amazon.co.jp/dp/" + asin, {
                        credentials: "include",
                        referrerPolicy: "no-referrer"
                    }).then((response) => {
                        if(!response.ok) throw Error(response.statusText);
                        return response.text();
                    }).then((text) => {
                        if(/id="e?booksInstantOrderUpdate_feature_div"/.test(text)){ // kindle本のページか確認
                            if(/\sid="e?booksInstantOrderUpdate"/.test(text)){
                                setHideCcahe(asin); // 非表示キャッシュに追加
                                bought_asins.push(asin);
                            }else if(b_perhaps_kdp_hide && !(/>\s*(出版社|Publisher)/.test(text))){ // 出版社がないものをKDP疑いと簡易的に判定（英語表示ではPublisher）
                                setHideCcahe(asin); // 非表示キャッシュに追加
                                kdp_asins.push(asin);
                            }else{
                                setScannedCache(asin); // スキャン済みキャッシュに追加
                                scanned_asins.push(asin);
                            }
                        }else{ // Kindle本以外（[まとめ買い]も含まれる。[まとめ買い]は新刊が追加される可能性があるので自動で非表示にしない）
                            setScannedCache(asin); // スキャン済みキャッシュに追加
                            scanned_asins.push(asin);
                        }
                    }).catch((error) => {
                        console.error(error);
                        error_asins.push(asin);
                    })
                )
            }
            // awaitで待つ
            await Promise.all(task_list);
        }
        let result_str = "スキャン終了<br>" + (bought_asins.length + kdp_asins.length) + "件をキャッシュに追加";
        if(b_perhaps_kdp_hide) result_str += "(うち" + kdp_asins.length + "件がKDP疑い)";
        if(skip_count > 0) result_str += "<br>" + skip_count + "件はスキャンしたばかりなのでスキップ";
        if(error_asins.length > 0) result_str += "<br>" + error_asins.length + "件がエラーになりました";
        setHideUndoCache(bought_asins.concat(kdp_asins, scanned_asins))
        prog.innerHTML = result_str;

        // 非表示処理をする
        for(const li of getLIST()){
            const asin = sanitizeASIN(li.getAttribute("data-asin"));
            if(!asin) continue;
            if(bought_asins.includes(asin)){
                li.classList.add("kakusu-bought");
            }else if(kdp_asins.includes(asin)){
                li.classList.add("kakusu-kdp");
            }
        }
        fadeoutElement(prog); // 進捗のポップアップをフェードアウトしながら削除
    };

    ////////////////////////////////
    // スキャンや全部非表示による非表示をUndo（取り消し）
    // NGASIN管理の「○日以上参照のないものを削除」のUndoも行う
    const undo = () => {
        let pop_text = "";
        const hide_undo_asins = getHideUndoCache();
        const remove_undo_asins = getRemoveUndoCache();
        if(hide_undo_asins.length <= 0 && remove_undo_asins.length <= 0){
            pop_text = "Undo情報なし";
        }else{
            // 非表示キャッシュを元に戻す
            for(const asin of hide_undo_asins){
                removeHideCcahe(asin);
                removeScannedCache(asin);
            }
            for(const asin of remove_undo_asins){
                setHideCcahe(asin);
            }
            // 非表示を取りやめ
            const li_list = getLIST();
            if(li_list.length > 0){
                for(const li of li_list){
                    const asin = sanitizeASIN (li.getAttribute("data-asin"));
                    if(asin && hide_undo_asins.includes(asin)){
                        li.classList.remove("kakusu");
                        li.classList.remove("kakusu-temp");
                        li.classList.remove("kakusu-bought");
                        li.classList.remove("kakusu-kdp");
                    }
                }
            }
            pop_text = "Undo終了(";
            if(hide_undo_asins.length){
                pop_text += hide_undo_asins.length + "件の非表示をキャンセル";
            }
            if(hide_undo_asins.length > 0 && remove_undo_asins.length > 0){
                pop_text += ", ";
            }
            if(remove_undo_asins.length > 0){
                pop_text += remove_undo_asins.length + "件のNGASINを復帰";
            }
            pop_text += ")";
        }
        clearUndoCache();

        // ポップ表示
        popup(pop_text);
    };

    ////////////////////////////////
    // 非表示/確認。トグル動作
    const displayHide = () => {
        const e = document.getElementById("kakusu-visible");
        let pop_text = "";
        if(!e){
            // スタイルシートを追加してこちらを優先させる
            const head = document.getElementsByTagName("head")[0];
            if(!head) return;
            pop_text = "確認モード";
            const style = document.createElement("style");
            style.setAttribute("id", "kakusu-visible");
            style.setAttribute("type", "text/css");
            style.innerHTML = visible_style;
            head.appendChild(style);
        }else{
            // スタイルシートを削除してデフォルトに戻す
            removeElement(e);
            pop_text = "非表示モード";
            // kakusu-temp、kakusu-bought、kakusu-kdpなどの仮置きをkakusuにする
            const btemps = Array.from(document.getElementsByClassName("kakusu-temp"))
            .concat(Array.from(document.getElementsByClassName("kakusu-bought")))
            .concat(Array.from(document.getElementsByClassName("kakusu-kdp")));
            for(const btemp of btemps){
                btemp.classList.add("kakusu");
                btemp.classList.remove("kakusu-temp");
                btemp.classList.remove("kakusu-bought");
                btemp.classList.remove("kakusu-kdp");
            }
        }
        // ポップ表示
        popup(pop_text, true);
    };

    ////////////////////////////////
    // 各種設定（スポンサープロダクトやFEATURED ADVISERの表示設定、スキャン時のKDP扱いなど）
    const configSetting = () => {
        let config = document.getElementById("config-setting");
        if(config) return; // すでに表示されいてる

        // ダイアログ部分作成
        config = document.createElement("div");
        config.id = "config-setting";

        // キャプション
        const caption1 = document.createElement("span");
        caption1.innerHTML = "【各種設定】<br/> <br/>";

        // ON/OFFのチェックボックス作成（最近はinput要素をformで囲わなくても大丈夫らしい）
        const cahnge_chkbox = (id, keyname) => {
            if(document.getElementById(id).checked){
                localStorage.setItem(keyname, "1");
            }else{
                localStorage.removeItem(keyname);
            }
            popup("設定を変更しました");
        };
        const create_chkbox = (id, keyname, html) => {
            const div = document.createElement("div");
            const chkbox = document.createElement("input");
            chkbox.type = "checkbox";
            chkbox.id = id;
            chkbox.checked = !!localStorage.getItem(keyname);
            chkbox.addEventListener("change", () => cahnge_chkbox(id, keyname) );
            div.appendChild(chkbox);
            const chkbox_label = document.createElement("label");
            chkbox_label.htmlFor = id;
            chkbox_label.innerHTML = html;
            div.appendChild(chkbox_label);
            return div;
        };
        const chkbox_sp = create_chkbox("config-setting-sp", "SPONSOR_PRODUCT_VISIBLE", "スポンサープロダクトの<strong>非表示をやらない</strong>");
        const chkbox_ad = create_chkbox("config-setting-ad", "ADVERTISEMENT_SPACE_VISIBLE", "検索内の広告の<strong>非表示をやらない</strong>");
        const chkbox_fa = create_chkbox("config-setting-fa", "FEATURED_ADVISER_VISIBLE", "「おすすめ」や「もう一度買う」などの<strong>非表示をやらない</strong>");
        const chkbox_oneclick = create_chkbox("config-setting-oneclick", "ONECLICK_BUTTON_VISIBLE", "「1-Click購入」や「カートへ入れる」ボタンの<strong>非表示をやらない</strong>");
        const chkbox_price = create_chkbox("config-setting-price", "PRICE_EMPHASIS_OFF", "目立たない価格やポイントの<strong>強調をやらない</strong>");
        const chkbox_kdp = create_chkbox("config-setting-kdp", "PERHAPSKDP_HIDE", "Kindle注文済みスキャンにKDP疑いを<strong>含める</strong><br/>※青空文庫などをKDP疑いと誤判定するので注意");
        const chkbox_sakura = create_chkbox("config-setting-sakura", "SAKURA_LINK_HIDE", "[サクラ]リンクを<strong>表示しない</strong>");
        const chkbox_keepa = create_chkbox("config-setting-keepa", "KEEPA_LINK_HIDE", "[keepa]リンクを<strong>表示しない</strong>");
        const chkbox_kakusu = create_chkbox("config-setting-kakusu", "KAKUSU_BUTTON_HIDE", "[非表示]ボタンを<strong>表示しない</strong>");
        const chkbox_onlyamazon = create_chkbox("config-setting-onlyamazon", "ONLYAMAZON_BUTTON_HIDE", "「出品者Amazon.co.jpを選択」ボタンを<strong>表示しない</strong>");

        // ダイアログを閉じるボタン
        const button_close = document.createElement("button");
        button_close.type = "button";
        button_close.textContent = "閉じる";
        button_close.addEventListener("click", (event) => {
            removeElement(document.getElementById("config-setting"));
        });

        // 作成した要素を追加していく
        config.appendChild(caption1);
        config.appendChild(chkbox_sp);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_ad);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_fa);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_oneclick);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_price);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_kdp);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_sakura);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_keepa);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_kakusu);
        config.appendChild(document.createElement("br"));
        config.appendChild(chkbox_onlyamazon);
        config.appendChild(document.createElement("br"));
        config.appendChild(button_close);

        // #oshirase-outerに追加
        const outer = getElementOshiraseOuter();
        outer.appendChild(config);
    };

    ////////////////////////////////
    // NGASIN管理
    const configHideCcahe = () => {
        let config = document.getElementById("config-kakusu-cache");
        if(config) return; // すでに表示されいてる

        // 要素作成
        config = document.createElement("div");
        config.id = "config-kakusu-cache";
        // キャプション部分
        const caption1 = document.createElement("span");
        const caption2 = document.createElement("span");
        caption1.textContent = "非表示中のASIN一覧（コピペで手動エクスポート）";
        caption2.textContent = "追加するASIN（インポートの代わり）";
        // テキストエリア
        const texta1 = document.createElement("textarea");
        const texta2 = document.createElement("textarea");
        texta1.id = "config-kakusu-cache-textarea1";
        texta2.id = "config-kakusu-cache-textarea2";
        // 追加ボタン
        const button_add = document.createElement("button");
        button_add.type = "button";
        button_add.textContent = "上記ASINを追加";
        // 古いキャッシュ削除ボタンと日数セレクト
        const select_expiration = document.createElement("select");
        select_expiration.id = "config-select-expiration";
        const select_option1 = document.createElement("option");
        const select_option2 = document.createElement("option");
        const select_option3 = document.createElement("option");
        const select_option4 = document.createElement("option");
        const select_option5 = document.createElement("option");
        select_option1.setAttribute("value", "7");
        select_option2.setAttribute("value", "30");
        select_option3.setAttribute("value", "100");
        select_option4.setAttribute("value", "365");
        select_option5.setAttribute("value", "1000");
        select_option1.textContent = "7日";
        select_option2.textContent = "30日";
        select_option3.textContent = "100日";
        select_option4.textContent = "365日";
        select_option5.textContent = "1000日";
        select_expiration.appendChild(select_option1);
        select_expiration.appendChild(select_option2);
        select_expiration.appendChild(select_option3);
        select_expiration.appendChild(select_option4);
        select_expiration.appendChild(select_option5);
        select_expiration.options[2].selected = true;
        const button_expiration = document.createElement("button");
        button_expiration.textContent = "以上参照のないものを削除";
        // 閉じるボタン
        const button_close = document.createElement("button");
        button_close.type = "button";
        button_close.textContent = "閉じる";

        // キャッシュのキーからASINを抽出してテキストエリアに列挙
        let str_asins = "";
        const slice_begin = "NGASIN".length; // 接頭文字の長さ
        for(const key in localStorage){
            if(/^NGASIN[0-9A-Za-z]{10}$/.test(key)){
                str_asins += key.slice(slice_begin) + "\n";
            }
        }
        texta1.value = str_asins;
        texta1.readOnly = true;
        // テキストエリアにフォーカスが当たったとき全選択
        texta1.addEventListener("focus", () => {
            texta1.select();
        });

        // 追加ボタンの関数（テキストエリアのASINをキャッシュに追加）
        button_add.addEventListener("click", (event) => {
            const config = document.getElementById("config-kakusu-cache");
            const texta2 = document.getElementById("config-kakusu-cache-textarea2");
            if(!config || !texta2){
                removeElement(texta2);
                removeElement(config);
                return;
            }
            let add_count = 0;
            for(const asin of texta2.value.split(/\s+/)){
                if(/^[0-9A-Za-z]{10}$/.test(asin)){
                    setHideCcahe(asin);
                    add_count++;
                }
            }
            removeElement(texta2);
            removeElement(config);

            // ポップ表示
            popup(add_count + "件追加（もしくはタイムスタンプを更新）しました", true);
        });
        // 古いキャッシュ削除ボタンの関数
        button_expiration.addEventListener("click", (event) => {
            const config = document.getElementById("config-kakusu-cache");
            if(!config) return;
            const select = document.getElementById("config-select-expiration");
            const select_value = (select) ? Number(select.value) : 100;
            const cache_time = (select_value >= 0) ? select_value * 24 * 60 * 60 * 1000 : DEFAULT_CACHE_TIME;
            console.log("デバッグ！" + cache_time);
            const result = expirationLocalCache(cache_time);
            removeElement(config);

            // ポップ表示
            popup(result[0] + "件のキャッシュのうち" + result[1] + "件を削除", true);
        });
        // 閉じるボタンの関数（ダイアログを閉じる）
        button_close.addEventListener("click", (event) => {
            removeElement(document.getElementById("config-kakusu-cache"));
        });

        // 作成した要素を追加していく
        config.appendChild(caption1);
        config.appendChild(texta1);
        config.appendChild(select_expiration);
        config.appendChild(button_expiration);
        config.appendChild(document.createElement("br"));
        config.appendChild(document.createElement("br"));
        config.appendChild(caption2);
        config.appendChild(texta2);
        config.appendChild(button_add);
        config.appendChild(document.createElement("br"));
        config.appendChild(document.createElement("br"));
        config.appendChild(button_close);
        // #oshirase-outerに追加
        const outer = getElementOshiraseOuter();
        outer.appendChild(config);
    };

    ////////////////////////////////
    // ローカルストレージのキャッシュを全表示（デバッグ用）
    const viewLS = () => {
        const lag2str = (t) => {
            if(t<0) return "未来";
            const col = (t >= DEFAULT_CACHE_TIME) ? '<span style="color:red">' : '<span>';
            t = Math.floor(t / 1000);
            const sec = t % 60;
            t = Math.floor(t / 60);
            const min = t % 60;
            t = Math.floor(t / 60);
            const hour = t % 24;
            t = Math.floor(t / 24);
            const day = t;
            return col +
                (day>0?day+"日":"") +
                (hour>0?hour+"時間":"") +
                (min>0?min+"分":"") +
                (sec>0?sec+"秒":"") +
                "前</span>";
        }
        let items = [];
        const slice_begin = "NGASIN".length;
        for(const key in localStorage){
            if(/^NGASIN[0-9A-Za-z]{10}$/.test(key)){
                const asin = key.slice(slice_begin);
                items.push({"asin": asin, "timestamp": Number(localStorage.getItem(key))});
            }
        }
        items.sort((a,b)=>{
            if(a.timestamp > b.timestamp) return 1;
            if(a.timestamp < b.timestamp) return -1;
            if(a.asin > b.asin) return 1;
            if(a.asin < b.asin) return -1;
            return 0;
        });
        let str = Object.keys(items).length + "件<br/>";
        const now_time = Date.now();
        for(const item of items){
            str += item.asin + " : " + item.timestamp + "（" + lag2str(now_time-item.timestamp) + "）<a target=\"_blank\" href=\"https://www.amazon.co.jp/dp/" + item.asin + "\">link</a><br/>";
        }
        document.getElementsByTagName("body")[0].innerHTML = str;
    };

    ////////////////////////////////
    // 「出品者Amazon.co.jpを選択」ボタンをサイドバーに追加
    // URL末尾に&emi=AN1VRQENFRJN5を追加するだけの簡単なもの
    const operateOnlyAmazonButton = () => {
        // ボタンを表示しないフラグが立っていたら終了
        if(localStorage.getItem("ONLYAMAZON_BUTTON_HIDE")) return;

        // 現在のURLにAN1VRQENFRJN5があるかのフラグ
        const bAmazonSeller = !!(/AN1VRQENFRJN5/.test(location.href));

        // すでにボタンがある場合は終了
        const already = document.getElementById("seller_only_amazon");
        if(already){
            if(bAmazonSeller){
                already.classList.add("hikaru");
            }else{
                already.classList.remove("hikaru");
            }
            return;
        }

        // 追加場所を取得。なければ終了する。
        // 「通常配送料無料」「明日までにお届け」を目印にしている。これがあるとデジタル商品（kindleなど）ではない。
        let parent = null, reference = null;
        reference = document.querySelector("#primeRefinements,#deliveryRefinements");
        if(reference){
            parent = reference.parentNode;
        }else{
            // Amazon側のバグなのか「通常配送料無料」が表示されないことがある
            // その場合はフィルタの項目を見てデジタル商品の判定をする
            // 「購入オプション」「海外配送」「在庫状況」があればデジタル商品に非ず
            reference = document.querySelector("#filters,#s-refinements");
            if(reference && reference.querySelector("#p_n_is_sns_available-title,#p_n_shipping_option-bin-title,#p_n_availability-title")){
                parent = reference.parentNode;
            }
        }
        if(!parent) return;

        // 要素作成
        const area = document.createElement("div");
        area.id = "seller_only_amazon";
        area.style ="margin-bottom:1.0em;";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "出品者Amazon.co.jpを選択";
        button.title = "URLに&emi=AN1VRQENFRJN5を追加します";
        button.addEventListener("click", (event) => {
            // クリック時の処理
            // 通常は&emi=AN1VRQENFRJN5を追加するが、 選択中は選択解除を試みる（解除が無理なら諦める）
            if(/p_6%3AAN1VRQENFRJN5[&%]/.test(location.href)){
                location.href = location.href.replace(/p_6%3AAN1VRQENFRJN5([&%])/, "$1");
            }else{
                location.href = location.href + "&emi=AN1VRQENFRJN5";
            }
        });
        area.appendChild(button);
        if(bAmazonSeller){
            area.classList.add("hikaru");
        }else{
            area.classList.remove("hikaru");
        }

        // 作成した要素を先頭に追加
        parent.insertBefore(area, parent.firstElementChild);
    };



    // DOM変更の監視対象を取得。なければ終了
    // 動的に更新されるため監視が必要
    let target = document.getElementById("search-main-wrapper"); // URLのパスが/sの場合（旧UIだが今でもたまに出現）
    if(!target) target = document.getElementById("mainResults"); // URLのパスが/bの場合（旧UIだが今でもたまに出現）
    if(!target) target = document.getElementById("search"); // 2019年3月頃からのUI
    if(!target){
        GM_registerMenuCommand("対象ページではないです", (()=>{}));
        GM_registerMenuCommand("各種設定", configSetting);
        GM_registerMenuCommand("NGASIN管理", configHideCcahe);
        return;
    }
    // DOM監視開始
    (new MutationObserver(hideMain)).observe(target, {childList:true, subtree:true});

    // メニューコマンドに登録
    GM_registerMenuCommand("非表示/確認", displayHide);
    GM_registerMenuCommand("Kindle注文済みスキャン", scanBought);
    GM_registerMenuCommand("全部非表示", hideAll);
    GM_registerMenuCommand("Undo", undo);
    GM_registerMenuCommand("各種設定", configSetting);
    GM_registerMenuCommand("NGASIN管理", configHideCcahe);
    //GM_registerMenuCommand("NGASIN一覧表示", viewLS);
    //GM_registerMenuCommand("注文済みキャッシュ消去", clearHideCcahe);
    //GM_registerMenuCommand("スキャン済みキャッシュ消去", clearScannedCache);

    // 非表示処理
    hideMain(null);
})();