// ==UserScript==
// @name         Amazon.co.jp裏でリロードしてkindleセール情報を追加
// @namespace    https://www.amazon.co.jp/kindle-dbs/manga-store/?node=5363409051
// @description  裏でリロードを繰り返してランダムで表示されるセール情報を追加していきます
// @version      1.0.2
// @include      https://www.amazon.co.jp/kindle-dbs/manga-store/*node=5363409051*
// @include      https://www.amazon.co.jp/*b*node=2275256051*
// @include      https://www.amazon.co.jp/*b*node=2410280051*
// @include      https://www.amazon.co.jp/*b*node=2292699051*
// @include      https://www.amazon.co.jp/*b*node=2450063051*
// @include      https://www.amazon.co.jp/*b*node=2291476051*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377171/Amazoncojp%E8%A3%8F%E3%81%A7%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89%E3%81%97%E3%81%A6kindle%E3%82%BB%E3%83%BC%E3%83%AB%E6%83%85%E5%A0%B1%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/377171/Amazoncojp%E8%A3%8F%E3%81%A7%E3%83%AA%E3%83%AD%E3%83%BC%E3%83%89%E3%81%97%E3%81%A6kindle%E3%82%BB%E3%83%BC%E3%83%AB%E6%83%85%E5%A0%B1%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 設定
    const END_NOTFOUND_COUNT = 30;			// 未発見がこの回数続いたら終了
    const RELOAD_SLEEP = 1000;				// リロードまでの最低スリープ時間（ミリ秒）
    const RELOAD_SLEEP_EXTENSION = 4000;	// 未発見時にスリープ時間に加算する（ミリ秒）
    const POP_TIME = 5000;					// ポップアップが消えるまでの時間
    const TARGET_SELECTOR = "#a-page div.msw-page, #merchandised-content";
    const LIST_SELECTOR = "#a-page div.msw-page div.a-section.msw-shoveler, #merchandised-content > div[id^=\"carousel\"], #merchandised-content > div[id*=\"Carousel\"] , #merchandised-content > div.a-row";

    // セール情報部分の要素を取得。該当ページであるか確認
    const target_node = document.querySelector(TARGET_SELECTOR);
    if(!target_node || !target_node.querySelector(LIST_SELECTOR)){
        console.log("Kindleセール追加：該当ページではない、もしくはセール情報部分を取得できなかった");
        return;
    }

    // 変数
    const domParser = new DOMParser(); // DOMParserオブジェクト
    const RELOAD_URL = location.href;
    let bool_doing = false; // 多重実行防止用のフラグ

    // ポップアップ用のスタイルシート（Amazon側の命名と被らないようにローマ字のダサい命名）
    GM_addStyle(
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
        "  font-size: 18px;" +
        "}" +
        ".oshirase-pop-large{" +
        "  font-size: 28px;" +
        "}"
    );
    // 追加ボタンのスタイルシート（Amazon側の命名と被らないようにローマ字のダサい命名）
    GM_addStyle(
        "#tuika-botan-waku{" +
        "  background-color:#666;" +
        "  text-align:center;" +
        "}" +
        "#tuika-botan{" +
        "  margin:0.5em auto;" +
        "  padding:0.25em 2em;" +
        "  font-size:large;" +
        "}"
    );

    // 下の方にボタンを付ける（実行関数の追加はこのスクリプトの最後で）
    const button_outer = document.createElement("div");
    button_outer.id = "tuika-botan-waku";
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "裏でリロードして追加";
    button.id = "tuika-botan";
    button_outer.appendChild(button);
    target_node.parentNode.insertBefore(button_outer, target_node.nextSibling);

    ////////////////////////////////
    // Promiseを使ったsleep関数。async関数内でawaitを付けて使う
    const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));

    ////////////////////////////////
    // 要素削除
    const removeElement = (e) => {
        if(e && e.parentNode) e.parentNode.removeChild(e);
    };

    ////////////////////////////////
    // ポップアップ用の要素作成
    const createPopupElement = (className, default_text) => {
        let outer = document.getElementById("oshirase-outer");
        // outer部分がなければ生成
        if(!outer){
            outer = document.createElement('div');
            outer.setAttribute("id", "oshirase-outer");
            document.getElementsByTagName('body')[0].appendChild(outer);
        }
        const e = document.createElement('div');
        if(className) e.classList.add(className);
        if(default_text) e.textContent = default_text;
        outer.appendChild(e);
        return e;
    };

    ////////////////////////////////
    // 要素をフェードアウトさせながら削除
    const fadeoutElement = (e) => {
        if(!e) return;
        setTimeout(async ()=>{
            for(let i = 15; i > 0; --i){
                e.style.opacity = (i/16.0).toFixed(5);
                e.style.transform = "scaleY(" + (i/16.0).toFixed(5) + ")";
                await sleep(10);
            }
            removeElement(e);
        }, POP_TIME);
    };

    ////////////////////////////////
    // 要素内のリンクターゲットを全て_blankにする
    const linktarget2blank = (node) => {
        if(!node || !node.getElementsByTagName) return;
        for(const a of Array.from(node.getElementsByTagName("A"))){
            a.setAttribute("target", "_blank");
        }
        return node;
    };

    ////////////////////////////////
    // 裏でリロードを繰り返してセール情報を追加していく関数
    const backgroundReload = async () => {
        // 進捗のポップ表示部分
        const prog = createPopupElement("oshirase-pop");

        // 多重実行防止
        if(bool_doing){
            prog.textContent = "前回の処理が終了していません";
            fadeoutElement(prog);
            return true;
        }
        bool_doing = true;
        button.disabled = true; // ボタンを押せなくする

        // 現在表示中のセールリスト取得
        const title_collection = new Set(); // セールタイトルコレクション
        const current_sale_list = target_node.querySelectorAll(LIST_SELECTOR);
        if(current_sale_list.length <= 0){
            prog.textContent = "セールリストの取得に失敗";
            bool_doing = false;
            button.disabled = false;
            fadeoutElement(prog);
            return true;
        }

        // 現在表示中のセールタイトルが既知でなければリストに追加
        for(const e of current_sale_list){
            const he = e.querySelector("h1,h2,h3");
            if(he){
                const sale_title = he.textContent;
                if(!title_collection.has(sale_title)){
                    title_collection.add(sale_title);
                }
            }
            linktarget2blank(e); // ついでにリンクターゲットも変更
        }

        // fetchで繰り返し読みに行く
        let nofound_count = 0;
        let reload_count = 0;
        while(nofound_count < END_NOTFOUND_COUNT){
            // スリープする時間計算
            let sleep_time = 0;
            if(reload_count > 0){
                sleep_time += RELOAD_SLEEP;
                if(nofound_count > 0){
                    sleep_time += RELOAD_SLEEP_EXTENSION;
                }
            }

            reload_count++;

            // 進捗表示
            prog.textContent = "裏で読み取り中 " + reload_count + "回目 未発見連続" + nofound_count + "回(連続" + END_NOTFOUND_COUNT + "回で終了)" + ((sleep_time>0)?" sleep"+sleep_time/1000.0+"秒":"");

            // スリープ
            if(sleep_time > 0) await sleep(sleep_time);

            // fetchで読みに行く
            let found_sale_num = 0;
            await fetch(RELOAD_URL, {
                credentials: "include",
                referrerPolicy: "no-referrer",
                cache: "no-store",
            }).then((response) => {
                if(!response.ok) throw Error(response.statusText);
                return response.text();
            }).then((text) => {
                const html = domParser.parseFromString(text, "text/html");
                const sale_list = html.querySelectorAll(LIST_SELECTOR);
                for(const e of sale_list){
                    // 既知ではないセールタイトルならリストに追加
                    const he = e.querySelector("h1,h2,h3");
                    if(he){
                        const sale_title = he.textContent;
                        if(!title_collection.has(sale_title)){
                            title_collection.add(sale_title);
                            let c = e.cloneNode(true);
                            linktarget2blank(c);
                            target_node.appendChild(c);
                            found_sale_num++;
                        }
                    }
                }
            }).catch((error) => {
                console.error(error);
            })

            // 未発見のカウント
            if(found_sale_num <= 0){
                nofound_count++;
            }else{
                nofound_count = 0;
            }
        }
        prog.textContent = "実行終了";
        bool_doing = false;
        button.disabled = false;
        fadeoutElement(prog); // フェードアウトしながら削除
        return true;
    };

    // メニューコマンドに登録
    GM_registerMenuCommand("裏でリロードして追加", backgroundReload);

    // 下のボタンにも登録
    button.addEventListener('click', backgroundReload);

    // 現在表示分のリンクターゲットを変更する
    linktarget2blank(target_node);
})();