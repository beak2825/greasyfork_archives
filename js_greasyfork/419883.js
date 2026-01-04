// ==UserScript==
// @name         拡張機能マネージャー[ARCHIVE]
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ユーザーによる動的な設定が必要な複数のユーザースクリプトを管理します。
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
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=722017
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419883/%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%5BARCHIVE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/419883/%E6%8B%A1%E5%BC%B5%E6%A9%9F%E8%83%BD%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%5BARCHIVE%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const yaju1919 = yaju1919_library;
    //-------サイト別グローバル空間にjQueryを読み込む-------------------------------------------------------------------------------------------------------------------------
    switch(yaju1919.getDomain(location.href)){
        case "pictsense.com":
            yaju1919.get("https://code.jquery.com/jquery-3.3.1.min.js",{
                success: r => win.eval(r),
                fail: r => console.warn("jQueryの読み込みに失敗しました")
            });
            break;
        case "3751chat.com":
            yaju1919.get("https://code.jquery.com/jquery-3.3.1.min.js",{
                success: r => win.eval(r),
                fail: r => console.warn("jQueryの読み込みに失敗しました")
            });
            break;
        case "discord.com":
            yaju1919.get("https://code.jquery.com/jquery-3.3.1.min.js",{
                success: r => win.eval(r),
                fail: r => console.warn("jQueryの読み込みに失敗しました")
            });
            break;
    }
    //--------------------------------------------------------------------------------------------------------------------------------
    const main = () => {
        const font="white", // 文字色
              back="rgba( 0, 0, 0, 0.7 )"; // 背景色
        //------holder要素-----------------------------------------------------------------------------------------------------------------------
        let toggle_flag;
        const toggle = () => {
            toggle_flag = !toggle_flag;
            parent_holder.css({
                left: toggle_flag ? 0 : -parent_holder.width()*1.4,
            });
        };
        const toggle_btn = $("<button>",{text:"拡張機能"}).appendTo($("body"))
        .css({
            backgroundColor:"blue",
            color:"yellow",
            position: "fixed",
            zIndex: 364364,
            left: 0,
            top: 0,
        }).click(toggle);
        const parent_holder = $("<div>",{text:"拡張機能マネージャー"}).appendTo($("body")).css({
            padding: "1em",
            color: font,
            backgroundColor: back,
            position: "fixed",
            zIndex: 114514,
            top: 0,
            height: "100vh",
            width: "22em",
            maxWidth: "90vw",
            transition: "all .5s",
            overflow: "scroll",
            "text-align": "left",
            fontSize: "1em"
        });
        parent_holder.css("left",-parent_holder.width()*1.4);
        //--------------------------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------------------------------------------------------
        //-------サイト別改変-------------------------------------------------------------------------------------------------------------------------
        let say;
        switch(yaju1919.getDomain(location.href)){
            case "x-feeder.info":
                say = str => {
                    if(!str.length) return;
                    if(str.length > 1000) return;
                    $.post(location.origin + location.pathname.match(/\/[^\/]*\//)[0] + "post_feed.php",{
                        name: $("#post_form_name").val(),
                        comment: str,
                        is_special: 0,
                        category_id: 0
                    });
                };
                break;
            case "pictsense.com":
                say = str => {
                    if(!str.length) return;
                    if(str.length > 200) return;
                    $("#chatText").val(str);
                    $("#chatText").next().click();
                };
                break;
            case "drrrkari.com":
                say = str => {
                    if(!str.length) return;
                    $(".inputarea").find("textarea").val(str);
                    $(".submit").find("input").click();
                };
                break;
            case "himachat.com":
                say = str => {
                    if(!str.length) return;
                    if(str.length > 150) return;
                    $(".formbar").val(str);
                    $(".formbar").next().click();
                };
                break;
            case "3751chat.com":
                say = str => {
                    if(!str.length) return;
                    if(str.length > 1000) return;
                    $("#chat").val(str);
                    $("#chat").next().click();
                };
                break;
            case "discord.com":
                {
                    let input_authorization = yaju1919.appendInputText(parent_holder.append("<br>"),{
                        title: "authorization",
                        explain: "発言に必要なキー（必須）",
                        save: "authorization"
                    });
                    say = str => {
                        if(!str.length) return;
                        if(str.length > 1000) return;
                        const room_id = location.href.match(/([0-9]+)\/([0-9]+)/)[2];
                        const url = `https://discordapp.com/api/v6/channels/${room_id}/messages`;
                        yaju1919.post(url,{
                            headers: {
                                authorization: input_authorization()
                            },
                            type: "application/json",
                            json: {
                                content: str,
                                tts: false,
                            },
                            success: r => console.log("成功"),
                            fail: r => console.warn("失敗"),
                        });
                    };
                }
                break;
            case "open2ch.net":
                toggle_btn.css("left", "10em");
                say = str => {
                    $("#MESSAGE").val(str);
                    $("#submit_button").click();
                };
                break;
        }
        //--------------------------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------------------
        const getType = yaju1919.getType;
        const configList = {};
        const tagList = {};
        const addTagList = ({key,tag}={}) => {
            if(getType(key) !== "String") return;
            if(!tagList[tag]) tagList[tag] = [];
            tagList[tag].push(key);
            list_tag[tag] = tag;
        };
        const ALL_SIGN = "すべて";
        const addConfigList = ({key,config,tag}={}) => {
            if(configList[key]) return;
            if(getType(config) !== "Function") return;
            configList[key] = config;
            list_Individual[key] = key;
            addTagList({key:key,tag:ALL_SIGN});
            if(getType(tag) === "String") addTagList({key:key,tag:tag});
            else if(getType(tag) === "Array"){
                for(const v of tag) addTagList({key:key,tag:v});
            }
        };
        const updateSelect = () => {
            const keys = Object.keys(configList);
            for(const k in win.Managed_Extensions){
                if(keys.indexOf(k)!==-1) continue;
                const now = win.Managed_Extensions[k];
                switch(getType(now)){
                    case "Function":
                        addConfigList({key:k,config:now});
                        break;
                    case "Object":
                        now.key = k;
                        addConfigList(now);
                        break;
                }
            }
            select.trigger('update');
        };
        const list_Individual = {
            "▼拡張機能を選択": null
        };
        const h_1 = $("<div>").appendTo(parent_holder);
        yaju1919.appendSelect(h_1,{
            list: list_Individual,
            width: "90%",
            change: v => {
                main_holder.empty();
                if(!v) return;
                main_holder.append(configList[v](say));
                h_2.find("select").val(null);
            },
        });
        const list_tag = {
            "▼タグから選択": null
        };
        const h_2 = $("<div>").appendTo(parent_holder);
        yaju1919.appendSelect(h_2,{
            list: list_tag,
            width: "90%",
            change: v => {
                main_holder.empty();
                if(!v) return;
                let i = 0;
                for(const k of tagList[v]) {
                    $("<div>",{text:`${++i}. ${k}`}).appendTo(main_holder).append(configList[k](say));
                    main_holder.append("<br><br>");
                }
                h_1.find("select").val(null);
            },
        });
        const main_holder = $("<div>").appendTo(parent_holder.append("<br>"));
        const select = parent_holder.find("select");
        select.click(updateSelect);
        setTimeout(updateSelect,2000);
        parent_holder.children().each((i,e)=>$(e).append("<br>"));
    };
    const observe = () => { // jQueryが読み込まれるまで待つ
        if(win.$) main();
        else setTimeout(observe,2000);;
    };
    setTimeout(observe,2000);
})();