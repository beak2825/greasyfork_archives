// ==UserScript==
// @name         拡張機能マネージャー
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  ユーザーによる動的な設定が必要な複数のユーザースクリプトを管理します。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/*
// @match        http://drrrkari.com/room/
// @match        http://www.3751chat.com/ChatRoom*
// @match        https://pictsense.com/*
// @match        http://www.himachat.com/
// @match        https://discord.com/*
// @match        https://*.open2ch.net/*
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasyfork.org/scripts/419945-global-managedextensions/code/Global_ManagedExtensions.js?version=889360
// @require      https://greasyfork.org/scripts/419888-antimatterx/code/antimatterx.js?version=889299
// @require      https://greasyfork.org/scripts/417889-sendmessage/code/sendMessage.js?version=876786
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419946/%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/419946/%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC.meta.js
// ==/UserScript==

(function(unsafeWindow) {
    'use strict';
    /*-------------------------------------------------- カスタマイズ領域 --------------------------------------------------*/
    var fontColor = "white", // 文字色
        backgroundColor = "rgba(0, 0, 0, 0.7)"; // 背景色
    /*------------------------------------------------------------------------------------------------------------------*/
    var $ = window.$,
        amx = window.antimatterx,
        sendMessage = window.sendMessage;
    //--------------------------------------------------
    var h = $("<div>").css({
            position: "fixed",
            zIndex: "99999",
            top: "0",
            left: "0",
            display: "inline-block"
        }).appendTo("body"),
        container = $("<div>").text("拡張機能マネージャー").css({
            padding: "1em",
            paddingTop: "3em",
            color: fontColor,
            backgroundColor: backgroundColor,
            width: "22em",
            height: "100vh",
            maxWidth: "90vw",
            overflow: "scroll",
            textAlign: "left",
            fontSize: "1em"
        }).appendTo(h),
        toggleBtn = $(amx.addInputBool(h[0], {
            title: "拡張機能",
            insertBefore: true,
            change: function(flag) {
                h.css("left", flag ? 0 : -h.width() * 1.4);
            }
        })).css({
            position: "fixed",
            left: "0",
            maxWidth: "100%"
        }),
        selectHolder = $("<div>").appendTo(container).after("<br>"),
        content = $("<div>").appendTo(container);
    h.css({
        transition: "all .5s",
        left: -h.width() * 1.4
    });
    //--------------------------------------------------
    function getList() { // Global_ManagedExtensionsからリストを取得する
        var exts = unsafeWindow.Global_ManagedExtensions,
            configList = {}, // 初期化関数のリスト
            extList = { // 拡張機能のリスト
                "▼拡張機能を選択": null
            },
            tagList = { // タグ付けされた拡張機能のリスト
                "▼タグから選択": null,
                "すべて": Object.keys(exts)
            };
        Object.keys(exts).forEach(function(k) {
            configList[k] = (amx.isType(exts[k], "Function") ? exts[k] :
                amx.isType(exts[k], "Object") && amx.isType(exts[k].config, "Function") ? exts[k].config :
                undefined);
            extList[k] = k;
            if (!amx.isType(exts[k], "Object")) return;
            var tag = exts[k].tag;
            if (amx.isType(tag, "String")) tagList[tag] = (tagList[tag] || []).concat([k]);
            amx.initType(tag, []).forEach(function(v) {
                tagList[v] = (tagList[v] || []).concat([k]);
            });
        });
        Object.keys(tagList).forEach(function(k) {
            if (amx.isType(tagList[k], "Array")) tagList[k] = JSON.stringify(tagList[k]);
        });
        return {
            configList: configList,
            extList: extList,
            tagList: tagList
        };
    };
    var lists = getList();

    function updateSelect() {
        var nowLists = getList();
        Object.keys(nowLists.configList).forEach(function(k) {
            lists.configList[k] = nowLists.configList[k];
            lists.extList[k] = nowLists.extList[k];
        });
        Object.keys(nowLists.tagList).forEach(function(k) {
            lists.tagList[k] = nowLists.tagList[k];
        });
        selectHolder.find("select").each(function(i, e) {
            amx.triggerEvent(e, "updateselect");
        });
    };
    amx.addSelect(selectHolder[0], {
        list: lists.extList,
        width: "90%",
        change: function(v) {
            content.empty();
            if (/^(|null)$/.test(v)) return;
            var config = lists.configList[v];
            if (config !== undefined) content.append(config(sendMessage));
            selectHolder.find("select").last().val(null);
        }
    });
    amx.addSelect(selectHolder[0], {
        list: lists.tagList,
        width: "90%",
        change: function(v) {
            content.empty();
            if (/^(|null)$/.test(v)) return;
            JSON.parse(v).forEach(function(k, i) {
                var config = lists.configList[k];
                if (config !== undefined) $("<div>").text(++i + ". " + k).appendTo(content).append(config(sendMessage)).after("<br><br>");
            });
            selectHolder.find("select").first().val(null);
        }
    });
    selectHolder.find("select").on("click mouseover", updateSelect);
    updateSelect();
    //--------------------------------------------------
})(this.unsafeWindow || window);