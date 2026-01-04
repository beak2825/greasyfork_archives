// ==UserScript==
// @name         [BETA]Cookie Editor EX
// @namespace    http://tampermonkey.net/
// @version      0.1
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
// @grant        GM.cookie
// @downloadURL https://update.greasyfork.org/scripts/405302/%5BBETA%5DCookie%20Editor%20EX.user.js
// @updateURL https://update.greasyfork.org/scripts/405302/%5BBETA%5DCookie%20Editor%20EX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addBtn = (h, title, func) => { // ボタンを作成する関数
        return $("<button>").text(title).click(func).appendTo(h);
    }
    const addCheckbox = (h, title) => { // チェックボックスを作成する関数
        h.append('<input type="checkbox">').append(`${title}<br>`);
        return h.find("input").last();
    }
    const toBool = (data) => { // Boolean型に変換する関数
        return data.toLowerCase() === "true";
    }
    const setVal = (h, valArr, boolArr) => { // input要素の値をセットする関数
        valArr.forEach((v, i) => h.eq(i).val(decodeURIComponent(v)));
        boolArr.forEach((v, i) => h.eq(i + 6).prop("checked", toBool(v))); // チェックボックスは6番目からなのでiに6を足す
    }
    const setCookie = (dataObj) => {
        if (dataObj.name === "") return;
        GM.cookie.set({
            expirationDate: new Date().getTime() + (60 * 60 * 24 * 1000 * dataObj.expirationDate),
            domain: dataObj.domain,
            httpOnly: dataObj.httpOnly,
            secure: dataObj.secure,
            name: dataObj.name,
            path: dataObj.path,
            sameSite: dataObj.sameSite,
            value: dataObj.value,
            hostOnly: dataObj.hostOnly,
        });
    }
    const getAllCookie = h => { // 引数に渡した要素にサイト内のCookieを表示する関数
        GM.cookie.list({}).then(d => {
            h.empty();
            h.append(`Cookieの数 : ${d.length}個`);
            if (d.length === 0) {
                h.append("<br>Cookieが見つかりませんでした");
                return;
            }
            d.forEach(v => {
                let arr = [];
                for (let k in v) arr.push(`${k} : ${v[k]}`);
                let cookieText = arr.join("\n");
                yaju1919.addInputText(h, {
                    readonly: true,
                    textarea: true,
                    value: cookieText,
                    width: "100%",
                });
                // Cookieが表示されたtextareaがフォーカスされたらCookieの情報を各input要素に入力
                let elm = h.find("textarea").last();
                elm.focus(() => {
                    let obj = {};
                    elm.val().split("\n").forEach(v => obj[v.split(" : ")[0]] = v.split(" : ")[1]);
                    setVal(h.parent().find("input"), [obj.name, obj.value, obj.domain, obj.path, 0, obj.sameSite], [obj.hostOnly, obj.secure, obj.httpOnly]);
                });
                //------------------------------------------------------------------------------
            });
            h.append("<br>");
        });
    }
    const setConfig = () => {
        const h = $("<div>");
        const h2 = $("<div>").appendTo(h);
        addBtn(h, "Cookie取得", () => getAllCookie(h2));
        addBtn(h, "Cookie全削除", () => {
            GM.cookie.list({}).then(d => d.forEach(v => GM.cookie.delete({
                name: v.name,
            })));
            if (h.find("textarea").length !== 0) setTimeout(() => getAllCookie(h2), 100); // Cookie情報の更新
        });
        addBtn(h, "表示クリア", () => h2.empty());
        h.append("<br><br>");
        addBtn(h, "編集", () => {
            let inputElm = h.find("input");
            let keys = ["name", "value", "domain", "path", "expirationDate", "sameSite", "hostOnly", "secure", "httpOnly"];
            let inputValObj = {};
            inputElm.each((i, e) => {
                if (keys[i] === "name" || keys[i] === "value") inputValObj[keys[i]] = encodeURIComponent(e.value);
                else if (i < 6) inputValObj[keys[i]] = e.value;
                else inputValObj[keys[i]] = e.checked;
            });
            setCookie(inputValObj);
            if (h.find("textarea").length !== 0) getAllCookie(h2); // Cookie情報の更新
        });
        addBtn(h, "削除", () => {
            GM.cookie.delete({
                name: h.find("input").eq(0).val(),
            });
            if (h.find("textarea").length !== 0) getAllCookie(h2); // Cookie情報の更新
        });
        addBtn(h, "クリア", () => setVal(h.find("input"), ["", "", "", "", 0, "unspecified"], ["false", "false", "false"]));
        // 入力欄やチェックボックスなどの追加 //////////////////////////////
        yaju1919.addInputText(h, {
            title: "名前",
            placeholder: "Cookieの名前を入力",
            save: "AM_cookieName",
            width: "100%",
        });
        yaju1919.addInputText(h, {
            title: "値",
            placeholder: "Cookieの値を入力",
            save: "AM_cookieValue",
            width: "100%",
            hankaku: false,
        });
        yaju1919.addInputText(h, {
            title: "ドメイン",
            placeholder: "ドメインを入力",
            save: "AM_cookieDomain",
            width: "100%",
        });
        yaju1919.addInputText(h, {
            title: "パス",
            placeholder: "パスを入力",
            save: "AM_cookiePath",
            width: "100%",
        });
        yaju1919.addInputNumber(h, {
            title: "有効期限",
            placeholder: "Cookieの有効期限を入力",
            save: "AM_cookieExpireDays",
            width: "100%",
            value: 0,
            min: Number.NEGATIVE_INFINITY,
            max: Infinity,
        });
        yaju1919.addInputText(h, {
            title: "SameSite",
            placeholder: "SameSiteを入力",
            save: "AM_cookieSameSite",
            width: "100%",
            change: () => { // SameSiteの入力欄が空なら既定値に戻す
                if (h.find("input").eq(5).val() === "") setTimeout(() => h.find("input").eq(5).val("unspecified"));
            }
        });
        h.append("<br>");
        addCheckbox(h, "ホストのみ");
        addCheckbox(h, "安全");
        addCheckbox(h, "HTTPのみ");
        ////////////////////////////////////////////////////////////////////
        return h;
    }
    win.Managed_Extensions["Cookie Editor EX"] = {
        config: setConfig,
        tag: "実用的",
    }
})();