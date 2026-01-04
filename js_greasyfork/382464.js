// ==UserScript==
// @name         5連投(Feederチャット)
// @namespace    https://greasyfork.org/users/297030
// @version      4.4
// @description  任意文字列を任意間隔で連投してくれるスクリプトを追加します。
// @author       You
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=798050
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/382464/5%E9%80%A3%E6%8A%95%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382464/5%E9%80%A3%E6%8A%95%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addBtn = (h, title, func) => { // ボタンを追加する関数
        return $("<button>").text(title).click(func).appendTo(h);
    }
    const h = $("<div>").css({
        "background-color": "darkgray",
        "border": "3px solid gray",
        "border-radius": "10px",
    }).prependTo("#main_right").append("<h1>5連投</h1><br>");
    let oldPostText, btn_flag;
    addBtn(h, "実行", () => { // 入力欄の内容を連投
        if (btn_flag) return;
        const oldNewActiveForm = newActiveForm; // 現在の投稿入力欄の行数
        const oldInputText = $(`#${newActiveForm}`).val(); // 現在の投稿内容入力欄の内容
        const postInterval = h.find("input").val();
        const totalPostTime = (postInterval * 5000) + 5000; // 実行ボタンの硬直時間
        // 重複と空を削除した配列を作成
        let array = [];
        h.find("textarea").each((i, e) => {
            array.push(e.value);
        });
        array = array.filter((x, i, self) => {
            return self.indexOf(x) === i;
        }).filter(v => v);
        //-----------------------------
        h.find("textarea").each((i, e) => {
            if (e.value === "" || e.value === oldPostText || $("#post_form_name").val() === "") return;
            btn_flag = true;
            // 連投が終わって5秒後にbtn_flagをfalseにする
            if (i + 1 === array.length) {
                setTimeout(() => {
                    btn_flag = false;
                }, totalPostTime);
            }
            //-------------------------------------------
            setTimeout(() => {
                if (newActiveForm === "post_form_single") $("#input_type").click(); // 投稿内容入力欄が一行なら複数行に変える
                $(`#${newActiveForm}`).val(e.value);
                $("#post_btn").click();
                // 投稿内容入力欄を元に戻す
                if (oldNewActiveForm !== newActiveForm) $("#input_type").click();
                $(`#${newActiveForm}`).val(oldInputText);
                //-------------------------
            }, (postInterval * 1000) * (i + 1));
            oldPostText = e.value;
        });
    });
    addBtn(h, "クリア", () => { // 入力欄をクリア
        if (btn_flag) return;
        h.find("textarea").each((i, e) => {
            e.value = "";
        });
    });
    addBtn(h, "簡単入力", () => { // 入力欄にサンプルテキストを入力
        if (btn_flag) return;
        h.find("textarea").each((i, e) => {
            e.value = `Hello World!${i+1}\nHello World!${i+1} BR`;
        });
    });
    yaju1919.addInputNumber(h, {
        title: "投稿間隔",
        placeholder: "投稿間隔を入力(単位:秒)",
        save: "AM_postInterval",
        width: "100%",
        value: 1,
        min: 0,
        max: Infinity,
    });
    h.append("<br>");
    let elm;
    for (let i = 0; i < 5; i++) { // 連投内容の入力欄
        elm = yaju1919.addInputText(h, {
            placeholder: `${i+1}投目の内容`,
            save: `AM_inputContText${i+1}`,
            width: "100%",
            textarea: true,
            hankaku: false,
        });
    }
    h.append("<br>");
})();