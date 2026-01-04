// ==UserScript==
// @name         カスタムくん
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  入力欄に改行で区切って文字列を入力して「実行」ボタンをクリックすると文字列の中からランダムで一つ投稿してくれます。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @match        http://drrrkari.com/room/
// @match        http://www.3751chat.com/ChatRoom*
// @match        https://pictsense.com/*
// @match        http://www.himachat.com/
// @match        https://discord.com/*
// @match        https://*.open2ch.net/*
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=755144
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/401927/%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%8F%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/401927/%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%8F%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const yaju1919 = yaju1919_library;
    const addBtn = (h, title, func) => { // ボタンを追加する関数
        return $("<button>").text(title).click(func).appendTo(h);
    }
    const randStr = (count, table) => { // ランダムな文字列を返す関数
        // https://qiita.com/fukasawah/items/db7f0405564bdc37820e
        return Array.from(Array(count)).map(() => table[Math.floor(Math.random() * table.length)]).join("");
    }
    let inputText, exeBtn, btn_flag = false;
    win.Managed_Extensions["カスタムくん"] = {
        config: say => {
            const h = $("<div>");
            inputText = yaju1919.appendInputText(h, {
                placeholder: "改行で区切って入力",
                save: "inputText",
                width: "90%",
                textarea: true,
                hankaku: false
            });
            exeBtn = addBtn(h, "実行", () => main(say));
            addBtn(h, "クリア", () => h.find("textarea").val(""));
            addBtn(h, "簡単入力", () => {
                let arr = [];
                for (let i = 0; i < 5; i++) {
                    arr.push(randStr(10, "0123456789"));
                }
                const text = arr.join("\n");
                h.find("textarea").val(text)
            });
            return h;
        }
    }
    const main = say => {
        const text = yaju1919.rand(inputText().split("\n"));
        exeBtn.prop("disabled", true);
        say(text);
        setTimeout(() => exeBtn.prop("disabled", false), 3000);
    }
})();