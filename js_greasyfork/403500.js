// ==UserScript==
// @name         オンライン欄増殖
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/sp*
// @exclude      *.x-feeder.info/*/settings/**
// @require      https://greasyfork.org/scripts/396472-yaju1919/code/yaju1919.js?version=802405
// @require      https://greasyfork.org/scripts/388005-managed-extensions/code/Managed_Extensions.js?version=720959
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM.cookie
// @downloadURL https://update.greasyfork.org/scripts/403500/%E3%82%AA%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E6%AC%84%E5%A2%97%E6%AE%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403500/%E3%82%AA%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E6%AC%84%E5%A2%97%E6%AE%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const deleteSid = () => GM.cookie.delete({ name:'sid'});
    const setSid = s => {
        GM.cookie.set({
            hostOnly: true,
            httpOnly: true,
            name: "sid",
            path: location.pathname,
            value: s
        });
    };
    const setName = s => {
        GM.cookie.set({
            hostOnly: true,
            name: "name",
            path: location.pathname,
            value: s
        });
    };
    var h_input, input_bool, input_time, r2, input_now;
    win.Managed_Extensions["オンライン欄増殖"] = {
        config: ()=>{
            const h = $("<div>");
            h_input = $("<div>").appendTo(h);
            input_time = yaju1919.addInputNumber(h_input,{
                title: "リクエスト間隔[秒]",
                max: 10,
                min: 0,
                value: 0.3,
                save: "wait"
            });
            h.append("<br>");
            yaju1919.addInputText(h,{
                title: "名前",
                change: function(v){
                    if(v) setName(v);
                }
            });
            h.append("<br>");
            input_now = yaju1919.addInputText(h,{
                placeholder: "今なにしてる？",
                save: "now"
            });
            h.append("<br>");
            /*yaju1919.addInputBool(h,{
                title: "オンライン欄更新停止", // 自分が重くなるのを防ぐ
                change: function(v){
                    if(v) {
                        r2 = unsafeWindow.refreshOnlineUsersView;
                        unsafeWindow.refreshOnlineUsersView = () => {};
                    }
                    else {
                        if(r2){
                            unsafeWindow.refreshOnlineUsersView = r2;
                        }
                    }
                }
            });
            h.append("<br>");*/
            h.append("<br>");
            input_bool = yaju1919.addInputBool(h,{
                title: "run",
                change: function(v){
                    if(v) main();
                }
            });
            return h;
        },
    };
    const main = () => {
        deleteSid();
        GM.xmlHttpRequest({
            method: "GET",
            url: location.href,
            onload: r => {
                if(!input_bool()) return;
                var hds = r.responseHeaders;
                var m = hds.match(/sid/);
                if(!m) return console.error("sidが見つかりませんでした。"); // sidが無い
                var sid = hds.slice(m.index + 4).match(/[0-9a-zA-Z]+/)[0];
                setSid(sid);
                //--- syncMyStatus
                $.post(location.pathname + 'update_status.php', {
                    'is_mobile': 0,
                    'status': 0,
                    'status_text': input_now(),
                    'now_broadcasting': 0
                });
                //---
                setTimeout(main, input_time() * 1000);
            },
        });
    };
})();