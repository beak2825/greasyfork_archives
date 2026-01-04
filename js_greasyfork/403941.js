// ==UserScript==
// @name         Cookie Editor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  サイト内のCookieを編集できるようになるスクリプトです。
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
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=798050
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/403988/Cookie%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/403988/Cookie%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // カスタマイズ領域
    const cookieInfoColor = "lightyellow"; // Cookie情報の色
    //-----------------
    // Cookieをセットする関数。「feederチャット - sidを変える」(https://greasyfork.org/ja/scripts/402949)というスクリプトからお借りしました。
    function setCookie(c_name, value, expiredays) {
        // pathの指定
        var path = location.pathname;
        // pathをフォルダ毎に指定する場合のIE対策
        var paths = new Array();
        paths = path.split("/");
        if (paths[paths.length - 1] != "") {
            paths[paths.length - 1] = "";
            path = paths.join("/");
        }
        // 有効期限の日付
        var extime = new Date().getTime();
        var cltime = new Date(extime + (60 * 60 * 24 * 1000 * expiredays));
        var exdate = cltime.toUTCString();
        // クッキーに保存する文字列を生成
        var s = "";
        s += c_name + "=" + encodeURIComponent(value); // 値はエンコードしておく
        s += "; path=" + path;
        if (expiredays) {
            s += "; expires=" + exdate + "; ";
        } else {
            s += "; ";
        }
        // クッキーに保存
        document.cookie = s;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------
    const addBtn = (h, title, func) => { // ボタンを追加する関数
        return $("<button>").text(title).click(func).appendTo(h);
    };
    let inputCookieName, inputCookieValue, inputCookieExpireDays, si; // siはsetIntervalのidを格納する変数
    const setConfig = () => {
        const h = $("<div>");
        let oldCookies;
        let cookieInfo = $("<div>").css("color", cookieInfoColor).appendTo(h); // サイト内のCookieを表示する要素
        inputCookieName = yaju1919.addInputText(h, {
            title: "Cookieの名前",
            placeholder: "Cookieの名前を入力",
            save: "AM_inputCookieName",
            width: "90%",
        });
        inputCookieValue = yaju1919.addInputText(h, {
            title: "Cookieの値",
            placeholder: "Cookieの値を入力",
            save: "AM_inputCookieValue",
            width: "90%",
        });
        inputCookieExpireDays = yaju1919.addInputNumber(h, {
            title: "Cookieの有効期限",
            placeholder: "Cookieの有効期限を入力",
            save: "AM_inputCookieExpireDays",
            width: "90%",
            value: 0,
            min: Number.NEGATIVE_INFINITY,
            max: Infinity,
        });
        const cookieInfoLoad = () => { // Cookieを取得
            if (oldCookies === document.cookie) return;
            cookieInfo.empty().text(`Cookie : ${document.cookie.split(";").length}個`);
            let activeElm = document.activeElement;
            let cookies = document.cookie;
            let cookieInfoElm;
            oldCookies = cookies;
            cookies.split(";").forEach(v => {
                cookieInfoElm = yaju1919.addInputText(cookieInfo, {
                    readonly: true,
                    textarea: true,
                    value: v === "" ? "Cookieが見つかりませんでした。" : v,
                    width: "100%",
                });
                let elm = h.find("textarea").last();
                elm.focus(() => { // フォーカスされた要素に表示されているCookieの名前と値を入力欄に入力
                    if (elm.val() === "Cookieが見つかりませんでした。") return;
                    elm.val().split("=").forEach((v, i) => {
                        h.find("input").eq(i).val(decodeURIComponent(v));
                    });
                });
            });
            activeElm.focus();
        }
        addBtn(h, "編集", () => {
            const cookieName = inputCookieName();
            const cookieValue = inputCookieValue();
            const cookieExpireDays = inputCookieExpireDays();
            setCookie(cookieName, cookieValue, cookieExpireDays);
            cookieInfoLoad();
        });
        addBtn(h, "Cookie全削除", () => {
            let cookies = document.cookie;
            cookies.split("; ").forEach(v => {
                setCookie(v.replace(/=.*/, ""), "", -1);
                cookieInfoLoad();
            });
        });
        addBtn(h, "ページリロード", () => {
            location.reload();
        });
        // Cookieを1秒間隔で取得
        clearInterval(si);
        si = setInterval(() => {
            cookieInfoLoad();
        }, 1000);
        //----------------------
        cookieInfoLoad(); // 起動時にCookieを取得
        return h;
    }
    win.Managed_Extensions["Cookie Editor"] = {
        config: setConfig,
        tag: "実用的",
    }
})();