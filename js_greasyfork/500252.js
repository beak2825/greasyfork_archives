// ==UserScript==
// @name         ハーメルン　お気に入りに使用中のタグ一覧
// @namespace    https://greasyfork.org/ja/users/942894
// @version      20240711
// @description  「お気に入り分類タグ変更」のページで使用中のタグ一覧を表示する（大文字小文字などの表記ゆれは個別に表示される）
// @author       _Hiiji
// @match        *://syosetu.org/?mode=favo_category_edit
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=32&domain=syosetu.org
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500252/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E3%81%AB%E4%BD%BF%E7%94%A8%E4%B8%AD%E3%81%AE%E3%82%BF%E3%82%B0%E4%B8%80%E8%A6%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/500252/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%81%8A%E6%B0%97%E3%81%AB%E5%85%A5%E3%82%8A%E3%81%AB%E4%BD%BF%E7%94%A8%E4%B8%AD%E3%81%AE%E3%82%BF%E3%82%B0%E4%B8%80%E8%A6%A7.meta.js
// ==/UserScript==

(function (document) {
    'use strict';

    // 読み込み間隔（ms）　503エラーが出るようだったら増やす
    const loading_interval = 100;

    const collect_page = function (page_num) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.open("GET", "/?mode=favo&word=&gensaku=&type=&page=" + page_num, true);
        xhr.timeout = 600000; // 1分でタイムアウト
        xhr.onload = () => {
            if(xhr.status >= 400 && xhr.status < 600) {
                // 400～599エラーの時
                page_list[page_num - 1] = page_num + "ページ "+xhr.status+"エラー";
            } else {
                // 各お気に入りページからタグを収集
                const section_a = xhr.responseXML.querySelectorAll("div.section3 > p > a");
                for (const val of section_a) {
                    if (!val.href.indexOf("https://syosetu.org/?mode=favo&word=")) {
                        // タグリストに挿入
                        tag_name_list.push(val.textContent);
                    }
                }
                page_list[page_num - 1] = page_num + "ページ 完了";
            }
            complete_flag -= 1;
            span_update();
        }
        xhr.onerror = () => {
            page_list[page_num - 1] = page_num + "ページ エラー";
            complete_flag -= 1;
            span_update();
        }
        xhr.onabort = () => {
            page_list[page_num - 1] = page_num + "ページ 中断";
            complete_flag -= 1;
            span_update();
        }
        xhr.ontimeout = () => {
            page_list[page_num - 1] = page_num + "ページ タイムアウト";
            complete_flag -= 1;
            span_update();
        }
        xhr.send();
    }
    const span_update = function () {
        element_span.innerHTML = page_list.join('<br>');
        // 全部終わったら
        if (complete_flag === 0) {
            // 被りを削除
            tag_name_list = [...new Set(tag_name_list)];
            // 数字・アルファベット・ひらがなカタカナ・漢字順にソートする
            tag_name_list.sort((a, b) => { return a.localeCompare(b, 'ja'); });
            // htmlタグを追加
            for (let i = 0; i < tag_name_list.length; i++) {
                tag_name_list[i] = '<a href="./?mode=favo&word=' + tag_name_list[i] + '&gensaku=">' + tag_name_list[i] + '</a>';
            }
            // element_tdに挿入
            element_td.innerHTML = tag_name_list.join('　');
        }
    }
    const add_style = function () {
        const css = `#form1 a {display:inline-block;}`;
        const elsement_style = document.createElement("style");
        elsement_style.appendChild(document.createTextNode(css));
        document.head.appendChild(elsement_style);
    }

    add_style();
    let page_list = new Array;
    let tag_name_list = new Array;
    let complete_flag = 0;
    // お気に入りページの枚数を調べる
    const xhr = new XMLHttpRequest();
    xhr.responseType = "document";
    xhr.open("GET", "/?mode=favo", true);
    xhr.timeout = 600000; // 1分でタイムアウト
    xhr.onload = () => {
        if(xhr.status >= 400 && xhr.status < 600) {
            // 400～599エラーの時
            element_td.innerHTML = xhr.status+"エラー";
        } else {
            // お気に入りページの枚数を調べる
            const conut_word = xhr.responseXML.querySelector("div.heading > h2").innerText.replace("一覧：", "").replace("件", "");
            const conut_page = Math.ceil(conut_word / 10);
            complete_flag = conut_page;
            for (let i = 1; i < conut_page + 1; i++) {
                // 各お気に入りページからタグを収集
                page_list.push(i + "ページ 待機");
                // 同時に沢山アクセスすると503エラーが出るのでアクセス開始時間をずらす
                setTimeout(() => {
                    page_list[i - 1] = i + "ページ 開始";
                    span_update();
                    collect_page(i);
                },loading_interval * (i - 1));
            }
        }
    }
    xhr.onerror = () => { console.log("エラー"); }
    xhr.onabort = () => { console.log("中断"); }
    xhr.ontimeout = () => { console.log("タイムアウト"); }
    xhr.send();

    const table_body = document.querySelector("#form1 > div > table > tbody");
    const element_tr = document.createElement("tr");
    const element_th = document.createElement("th");
    const element_td = document.createElement("td");
    const element_span = document.createElement("span");

    element_th.innerText = "お気に入りに使用中のタグ一覧"

    element_th.appendChild(document.createElement("br"));
    element_th.appendChild(document.createElement("br"));
    element_th.appendChild(element_span);
    element_tr.appendChild(element_th);
    element_tr.appendChild(element_td);
    table_body.appendChild(element_tr);

})(document);
