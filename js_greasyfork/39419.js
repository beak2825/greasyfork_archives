// ==UserScript==
// @name         おが～チャット改善
// @name:ja      おが～チャット改善
// @name:en      OChatBetter
// @namespace    http://tampermonkey.net/ochatbetter
// @version      0.3
// @description     OGARio の chat 表示を改善します
// @description:ja  OGARio の chat 表示を改善します
// @description:en  OGARio chat change for the better
// @author       tannichi
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39419/%E3%81%8A%E3%81%8C%EF%BD%9E%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/39419/%E3%81%8A%E3%81%8C%EF%BD%9E%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var global = window; // unsafeWindow;
    var my = {
        "name": "OChatBetter",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
    };
    var stat = {
    };
    var cfg= {}, cfg_org = {
        "emphasis_bgcolor": "rgba(128,128,128,0.9)", // 履歴強調の背景色
        "emphasis_time": 5000,	// 強調時間[ミリ秒]
        "histhide_time": 10000, // 履歴を消去する時間[ミリ秒]
        "scroll_dulation": 200, // 履歴スクロール完了期間[ミリ秒]
    };
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("top5-hud")){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for OGARio load");
            return;
        }
        // 念のため、もう１wait入れる
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize(){
        //$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        cfg = cfg_org;
        global[my.name] = {my:my, stat:stat, cfg:cfg};
        stat.obs_hist = new MutationObserver((mutations) => {
            my.log("hist changed");
            mutations.forEach((mutation) => {
                my.hist_add(mutation.addedNodes);
            });
        });
        stat.obs_hist.observe($("#chat-box").get(0), {"childList": true});
        stat.obs_inpt = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName !== 'style'){
                    return;
                }
                var displayValue = mutation.target.style.display;
                //my.log("input changed display="+ displayValue);
                if(displayValue === "block"){
                    my.inpt_show();
                }else if(displayValue === "none"){
                    my.inpt_hide();
                }
            });
        });
        stat.obs_inpt.observe($("#message-box").get(0), {"attributes": true});
    }

    my.hist_add = function(nodes){
        my.hist_show(true);
        nodes.forEach((node_elem) => {
            var node = $(node_elem);
            if(node.hasClass("message")){
                var bgOrg = node.css("background-color");
                node.css("background-color", cfg.emphasis_bgcolor);
                setTimeout(function(){
                    node.css("background-color", bgOrg);
                }, cfg.emphasis_time);
            }
        });
        // スクロール調整
        var chat_box = $("#chat-box");
        chat_box.perfectScrollbar("update");
        chat_box.animate({"scrollTop": chat_box.prop("scrollHeight")}, cfg.scroll_dulation);
        //chat_box.prop("scrollTop", chat_box.prop("scrollHeight"));
    };
    my.hist_show = function(withTimer){
        // タイマーを止める
        if(stat.histhide_timeID){
            clearTimeout(stat.histhide_timeID);
            stat.histhide_timeID = null;
        }
        var displayValue = $("#chat-box").css("display");
        if(displayValue === "none"){
            stat.histhide_enable = true;
            $("#chat-box").show();
        }
        if(stat.histhide_enable && withTimer){
            stat.histhide_timeID = setTimeout(function(){
                $("#chat-box").hide();
                stat.histhide_enable = false;
            }, cfg.histhide_time);
        }
    };
    my.inpt_show = function(){
        my.hist_show(false);
    };
    my.inpt_hide = function(){
         $("#chat-box").hide();
    };
})();
