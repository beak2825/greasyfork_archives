// ==UserScript==
// @name         ニコニコ大百科　掲示板　抽出
// @namespace    https://greasyfork.org/ja/users/942894
// @version      20240718
// @description  自分の書き込みを抽出
// @author       _Hiiji
// @match        *://dic.nicovideo.jp/b/a/
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=16&domain=dic.nicovideo.jp
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493858/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BF%E3%80%80%E6%8A%BD%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493858/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%80%E6%8E%B2%E7%A4%BA%E6%9D%BF%E3%80%80%E6%8A%BD%E5%87%BA.meta.js
// ==/UserScript==

(function (document) {
    'use strict';
    // ▼▼▼▼▼初期値▼▼▼▼▼

    let start = 1; // 掲示板の最初のページ
    let interval = 100; // 掲示板のページ数
    const Load_Timeout = 30000; //30秒間通信して取得できなかったらタイムアウトする

    // ▲▲▲▲▲初期値▲▲▲▲▲

    const exclusion = function () {
        // console.log("削除ボタン押した");
        const node_dl = document.querySelectorAll("dl");
        if (!node_dl.length) {
            // console.log("削除する物がない");
            return;
        }
        for (let val of node_dl) { val.remove(); }
        // console.log("削除した");
    }

    const updateValue = function () {
        start = Number(element_input1.value);
        interval = Number(element_input2.value);
        element_p1.textContent = begin_number(start) + " - " + end_number(start, interval);
    }

    const update_url_id = function (option_num) {
        P_url = "/b/a/" + encodeURIComponent(DataList[option_num][0]) + "/";
        myID = DataList[option_num][2];
        console.log(P_url);
        element_a2.href = "/id/" + DataList[option_num][1];
        element_a2.textContent = element_a2.href;
    }

    const begin_number = function (start, interval) { return Number(start * 30 - 29); }
    // const end_number = function(start,interval) {return Number(start*30-29+interval*30-1);}
    const end_number = function (start, interval) { return Number((start + interval - 1) * 30); }
    // return Number(start*30+interval*30-30);
    // return Number((start+interval-1)*30);

    const Load_page = function () {
        let start_num;
        for (let i = 0; i < interval; i++) {
            const element_dl = document.createElement("dl");
            start_num = begin_number(Number(start + i));
            element_dl.setAttribute("style", "text-align: left;");
            element_dl.id = "dl_" + start_num;
            content.appendChild(element_dl);

            // console.log(i + "番目の枠作成");
            Load_res(element_dl, start_num);
        }
    }

    const Load_res = function (element_dl, start_num) {
        const Load_url = P_url + start_num + "-";
        const element_a = document.createElement("a");
        element_a.target = "_blank";
        element_a.textContent = "[" + start_num + "-" + Number(start_num + 29) + "]";
        element_a.href = Load_url;
        element_dl.appendChild(element_a);
        element_dl.appendChild(document.createElement("br"));
        // console.log("[" + start_num + "-" + Number(start_num + 29) + "]");

        const element_span = document.createElement("span");
        element_span.textContent = "Now Loading...";
        element_dl.appendChild(element_span);

        const xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.open("GET", Load_url, true);
        xhr.timeout = Load_Timeout;
        xhr.onload = () => {
            element_span.remove();
            const restxt = xhr.responseXML;
            // エラーだったらその内容を書く
            if (xhr.status >= 400 && xhr.status <= 599) {
                element_dl.innerHTML += "※ " + xhr.status + "エラー！！ ※\n";
            // 「dl」内に子要素が存在しているなら、レスがあるので読み込む
            } else if (restxt.querySelector("#bbs > div.st-bbs-contents > dl").childElementCount) {
                const int_reshead = restxt.querySelectorAll("#bbs > div.st-bbs-contents > dl > dt.st-bbs_reshead");
                const int_resbody = restxt.querySelectorAll("#bbs > div.st-bbs-contents > dl > dd.st-bbs_resbody");
                const int_res_reaction = restxt.querySelectorAll("#bbs > div.st-bbs-contents > dl > dd[id^='bbs_res_reaction_']");
                for (let i = 0; i < int_reshead.length; i++) {
                    if (int_reshead[i].getAttribute("data-id_hash") === myID) {
                        element_dl.innerHTML += int_reshead[i].outerHTML;
                        element_dl.innerHTML += int_resbody[i].outerHTML;
                        element_dl.innerHTML += int_res_reaction[i].outerHTML;
                    }
                }
            // 「dl」内に子要素が存在しないなら、レス無し
            } else {
                element_dl.innerHTML += "※ まだレスがありません！！ ※\n";
            }
        }
        xhr.onerror = () => { element_span.remove(); element_dl.innerHTML += "※ 接続エラー！！ ※\n"; }
        xhr.onabort = () => { element_span.remove(); element_dl.innerHTML += "※ 中断されました！！ ※\n"; }
        xhr.ontimeout = () => { element_span.remove(); element_dl.innerHTML += "※ タイムアウトしました！！ ※\n"; }
        xhr.send();
    }

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // 　　　　　　　ここまで関数
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

    // 別のスクリプトで作ったグローバル変数を取得
    const DataList = Tampermonkey_niconico_my_res_ID_list;
    let P_url = "/b/a/" + encodeURIComponent(DataList[0][0]) + "/";
    let myID = DataList[0][2];

    const content = document.querySelector("div.content");
    // 中身の削除
    while (content.firstChild) { content.removeChild(content.firstChild); }
    // サイドバーの削除
    document.getElementById("contents").removeChild(document.getElementById("right-column"));
    content.removeAttribute("style");

    const element_form = document.createElement("form");

    const element_select = document.createElement("select");
    element_select.name = "P_select";
    element_select.id = "P_select";
    element_select.setAttribute("autofocus", "");
    for (let i = 0; i < DataList.length; i++) {
        const element_option = document.createElement("option");
        element_option.value = i;
        element_option.innerText = DataList[i][0];
        element_select.appendChild(element_option);
    }
    element_select.addEventListener('change', function () { update_url_id(element_select.value); });

    const element_input1 = document.createElement("input");
    element_input1.type = "number";
    element_input1.value = start;
    element_input1.name = "start";
    element_input1.id = "start";
    element_input1.min = 1;
    element_input1.max = 143165577;// 4294967295 / 30 ＝ 143165576.5 ≒ 143165577
    element_input1.addEventListener('change', function () { updateValue() });

    const element_input2 = document.createElement("input");
    element_input2.type = "number";
    element_input2.value = interval;
    element_input2.name = "interval";
    element_input2.id = "interval";
    element_input2.min = 1;
    element_input2.max = 10000;
    element_input2.addEventListener('change', function () { updateValue() });

    const element_input3 = document.createElement("input");
    element_input3.type = "button";
    element_input3.value = "読み込み";
    element_input3.addEventListener('click', function () { Load_page() });

    const element_input4 = document.createElement("input");
    element_input4.type = "button";
    element_input4.value = "削除";
    element_input4.addEventListener('click', function () { exclusion() });

    const element_p1 = document.createElement("p");
    element_p1.id = "begin-end_text";
    element_p1.textContent = begin_number(start) + " - " + end_number(start, interval);

    const element_p2 = document.createElement("p");
    element_p2.id = "Link_box";
    element_p2.innerText = "全てのページが「※ まだレスがありません！！ ※」になった場合、記事名が変わっている可能性があります。\n右のリンクから記事に行けるので記事名を確認してください。";

    const element_a2 = document.createElement("a");
    element_a2.id = "Link";
    element_a2.target = "_blank";
    element_a2.href = "/id/" + DataList[0][1];
    element_a2.textContent = element_a2.href;
    element_form.appendChild(element_select);
    element_form.appendChild(document.createElement("br"));
    element_form.appendChild(element_input1);
    element_form.appendChild(element_input2);
    element_form.appendChild(element_input3);
    element_form.appendChild(element_input4);
    element_form.appendChild(document.createElement("br"));
    element_form.appendChild(element_p1);
    element_form.appendChild(element_p2);
    element_p2.appendChild(element_a2);
    content.appendChild(element_form);
})(document);
