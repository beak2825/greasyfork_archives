// ==UserScript==
// @name         自由帳定期作成(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Feederチャットの自由帳を定期的に作り続けるスクリプトです。
// @author       You
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=798050
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/402585/%E8%87%AA%E7%94%B1%E5%B8%B3%E5%AE%9A%E6%9C%9F%E4%BD%9C%E6%88%90%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402585/%E8%87%AA%E7%94%B1%E5%B8%B3%E5%AE%9A%E6%9C%9F%E4%BD%9C%E6%88%90%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 自由帳を作成する関数
    const addNote = (title, text, password, folderId) => {
        if (title === "") return; // titleが空なら処理を中断
        let elm_flag = $("#folder_navi_area").length !== 0; // 既に自由帳を開いているか
        if (!elm_flag) toggleSubContents(1); // 自由帳を開く
        createNote(title, password, password, folderId);
        setTimeout(() => { // 自由帳の編集
            $("#note_contents").text(text);
            $("#note_save_button").click();
        }, 750);
        if (!elm_flag) setTimeout(() => toggleSubContents(1), 800); // 最初に自由帳を開いていなかったら閉じる
    }
    //---------------------
    const addBtn = (h, title, func) => { // ボタンを作成する関数
        return $("<button>").text(title).click(func).appendTo(h);
    }
    const getInputVal = (h) => { // 引数に渡した要素内の入力欄の値をtextarea要素とinput要素に分けて連想配列で返す関数
        let inputElmObj = {}
        let inputVal = [];
        if (h.find("textarea").length !== 0) {
            h.find("textarea").each((i, e) => inputVal.push(e.value));
            inputElmObj.textarea = inputVal;
            inputVal = [];
        }
        if (h.find("input").length !== 0) {
            h.find("input").each((i, e) => inputVal.push(e.value));
            inputElmObj.input = inputVal;
        }
        return inputElmObj;
    }
    const setInputVal = (h, inputValArr, textareaValArr) => { // 引数に渡した要素内の入力欄の値をセットする関数
        if (h.find("textarea").length !== 0 && h.find("textarea").length === textareaValArr.length) h.find("textarea").each((i, e) => e.value = textareaValArr[i]);
        if (h.find("input").length !== 0 && h.find("input").length === inputValArr.length) h.find("input").each((i, e) => e.value = inputValArr[i]);
    }
    const h = $("<div>").css({
        "background-color": "gray",
        "border": "3px solid black",
        "border-radius": "10px",
    }).prependTo("#main_right").append("<h1>自由帳定期作成</h1><br>");
    let si; // siはsetIntervalのidを格納する変数
    yaju1919.addInputBool(h, {
        title: "定期作成",
        value: false,
        change: () => {
            setTimeout(() => {
                let valObj = getInputVal(h);
                if (valObj.input.length === 1) return;
                const createInterval = valObj.input[1];
                const noteTitle = valObj.input[3];
                const noteText = valObj.textarea[0];
                const notePassword = valObj.input[4];
                const noteFolderId = valObj.input[2];
                clearInterval(si);
                if (!h.find("input").eq(0).prop("checked")) return;
                si = setInterval(() => addNote(noteTitle, noteText, notePassword, noteFolderId), createInterval * 1000);
            });
        },
    });
    addBtn(h, "作成", () => { // 自由帳を作成
        let valObj = getInputVal(h);
        const noteTitle = valObj.input[3];
        const noteText = valObj.textarea[0];
        const notePassword = valObj.input[4];
        const noteFolderId = valObj.input[2];
        addNote(noteTitle, noteText, notePassword, noteFolderId);
    });
    addBtn(h, "クリア", () => setInputVal(h, ["on", 15, 0, "Hello, World!", ""], [""])); // 入力欄をクリア
    addBtn(h, "簡単入力", () => setInputVal(h, ["on", 15, 0, "Hello, World!", ""], ["Hello, World!\nHello, World!\nHello, World!"])); // 入力欄にサンプルテキストを入力
    yaju1919.addInputNumber(h, {
        title: "作成間隔",
        placeholder: "自由帳の作成間隔を入力(単位:秒)",
        save: "AM_createInterval",
        width: "100%",
        value: 15,
        min: 15,
        max: Infinity,
    });
    yaju1919.addInputNumber(h, {
        title: "フォルダID",
        placeholder: "作成先のフォルダIDを入力(空の場合は0)",
        save: "AM_folderId",
        width: "100%",
        value: 0,
        min: 0,
        max: Infinity,
    });
    yaju1919.addInputText(h, {
        title: "タイトル",
        placeholder: "自由帳のタイトルを入力",
        save: "AM_noteTitle",
        width: "100%",
        value: "Hello, World!",
        hankaku: false,
        change: () => { // タイトルの入力欄が空なら既定値に戻す
            if (h.find("input").eq(3).val() === "") setTimeout(() => h.find("input").eq(3).val("Hello, World!"));
        },
    });
    yaju1919.addInputText(h, {
        title: "パスワード",
        placeholder: "自由帳のパスワードを入力",
        save: "AM_notePassword",
        width: "100%",
    });
    yaju1919.addInputText(h, {
        title: "本文",
        placeholder: "自由帳の本文を入力",
        save: "AM_noteText",
        width: "100%",
        textarea: true,
        hankaku: false,
    });
})();