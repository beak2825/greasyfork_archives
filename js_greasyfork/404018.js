// ==UserScript==
// @name         マルチポスト
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  複数のルームに一斉投稿する荒らしツールです。
// @author       You
// @match        *.x-feeder.info/*/
// @match        *.x-feeder.info/*/sp/
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/387509-yaju1919-library/code/yaju1919_library.js?version=755144
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404018/%E3%83%9E%E3%83%AB%E3%83%81%E3%83%9D%E3%82%B9%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/404018/%E3%83%9E%E3%83%AB%E3%83%81%E3%83%9D%E3%82%B9%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var yaju1919 = yaju1919_library;
    var g_inputQ, g_inputName, g_inputText, g_inputSpecial, g_status;
    function addBtn(h, title, func){
        return $("<button>").text(title).click(func).appendTo(h);
    };
    win.Managed_Extensions["マルチポスト"] = {
        config: ()=>{
            const h = $("<div>");
            g_inputQ = yaju1919.appendInputText(h,{
                title: "ルーム検索クエリ",
                value: " ",
                save: 'q',
            });
            h.append("<br>");
            g_inputName = yaju1919.appendInputText(h,{
                title: "名前",
                save: 'g_inputName',
            });
            h.append("<br>");
            g_inputText = yaju1919.appendInputText(h,{
                title: "投稿内容",
                save: 'g_inputText',
                textarea: true,
            });
            g_inputSpecial = yaju1919.appendCheckButton(h,{
                title: "重要投稿",
                save: 'g_inputSpecial',
            });
            h.append("<br>");
            addBtn(h,"投稿開始",multiPost);
            g_status = $("<div>").appendTo(h);
            return h;
        },
    };
    //------------------
    function toParamStr(json){
        var ar = [];
        for(var k in json) ar.push([k,json[k]].join('='));
        return ar.join('&');
    }
    function post(url, json, callback){
        GM.xmlHttpRequest({
            method: "POST",
            url: url,
            data: toParamStr(json),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-type":"charset=utf-8"
            },
            onload: function(res) {
                if(res.readyState === 4 && res.status === 200) console.warn("成功");
                else console.error("失敗");
                if(callback) callback(res.responseText);
            }
        });
    }
    function multiPost(num,max){
        if(isNaN(num)) num = 1;
        if(num === max) return;
        post("https://www.x-feeder.info/search_room.php",{
            query: g_inputQ(),
            public_or_private: "public",
            online_users_num: "include_0",
            page: num
        },r=>{
            var urls = r.match(/https:\/\/www[12]\.x-feeder\.info\/[A-Za-z0-9_]+/g);
            console.log(yaju1919.getTime());
            console.log(urls);
            if(!urls) return g_status.text(`not found (${yaju1919.getTime()})`);
            urls.map((v,i)=>setTimeout(send(v),i * 500));
            var m = r.match(/paging\([0-9]+\)/g);
            if(!m) return g_status.text("page 1 / 1");
            var maxPage = m.map(v=>Number(v.match(/[0-9]+/))).reduce((a,b)=>a>b?a:b);
            g_status.text(`page ${num} / ${maxPage}`);
            setTimeout(()=>multiPost(++num,maxPage), urls.length * 500); // 投稿頻度
        });
    }
    function send(url){
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: () => {
                post(url+"/post_feed.php",{
                    name: g_inputName(),
                    comment: g_inputText(),
                    is_special: g_inputSpecial() ? 1 : 0,
                    category_id: 0
                });
            }
        });
    }
})();