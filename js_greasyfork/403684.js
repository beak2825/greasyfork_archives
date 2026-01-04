// ==UserScript==
// @name         佐々木bot
// @namespace    http://tampermonkey.net/
// @version      0.7
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
// @downloadURL https://update.greasyfork.org/scripts/403684/%E4%BD%90%E3%80%85%E6%9C%A8bot.user.js
// @updateURL https://update.greasyfork.org/scripts/403684/%E4%BD%90%E3%80%85%E6%9C%A8bot.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function setCookie(c_name,value,expiredays){
        // pathの指定
        var path = location.pathname;
        // pathをフォルダ毎に指定する場合のIE対策
        var paths = new Array();
        paths = path.split("/");
        if(paths[paths.length-1] != ""){
            paths[paths.length-1] = "";
            path = paths.join("/");
        }
        // 有効期限の日付
        var extime = new Date().getTime();
        var cltime = new Date(extime + (60*60*24*1000*expiredays));
        var exdate = cltime.toUTCString();
        // クッキーに保存する文字列を生成
        var s = "";
        s += c_name + "=" + value;// 値はエンコードしない
        s += "; path=" + path;
        if(expiredays){
            s += "; expires=" +exdate+"; ";
        }else{
            s += "; ";
        }
        // クッキーに保存
        document.cookie=s;
    }
    var input_time_min, input_time_max, atrandom_flag, run_flag, btn_holder;
    win.Managed_Extensions["佐々木bot"] = {
        config: ()=>{
            const h = $("<div>");
            $("<div>").text("メッセ送信間隔[秒]").appendTo(h);
            input_time_min = yaju1919.addInputNumber(h,{
                placeholder: "最小",
                min: 10,
                max: 500,
                value: 30,
                save: 'min',
                int: true
            });
            $("<div>").text("～").appendTo(h);
            input_time_max = yaju1919.addInputNumber(h,{
                placeholder: "最大",
                min: 10,
                max: 500,
                value: 60,
                save: 'max',
                int: true
            });
            h.append("<br>");
            atrandom_flag = yaju1919.addInputBool(h,{
                title: "無差別モード",
            });
            h.append("<br>");
            h.append("<br>");
            btn_holder = $("<div>").appendTo(h);
            run_flag = yaju1919.addInputBool(btn_holder,{
                title: "run",
                change: function(v){
                    if(v) main();
                }
            });
            return h;
        },
    };
    //------------------
    const _ = str => {
        console.warn(`${str} ${yaju1919.getTime()}`);
    };
    let cnt = 0,
        cnt_sid = 0;
    const main = () => {
        setCookie("sid",'',0);
        if(cnt++ % 3){
            main2();
            setTimeout(main, yaju1919.randInt(input_time_min(),input_time_max()) * 1000);
        }
        else {
            GM.xmlHttpRequest({
                method: "GET",
                url: location.href,
                onload: r => {
                    if(!run_flag()) return;
                    var hds = r.responseHeaders;
                    var m = hds.match(/sid/);
                    if(!m) return _("sidが見つかりませんでした。"); // sidが無い
                    _(`${++cnt_sid}回目 sidを新規発行しました。`);
                    var sid = hds.slice(m.index + 4).match(/[0-9a-zA-Z]+/)[0];
                    setCookie("sid",sid,0);
                    main2();
                    setTimeout(main, yaju1919.randInt(input_time_min(),input_time_max()) * 1000);
                },
            });
        }
    };
    let targetId, ignore = [], exp = 0, level2exp = 10;
    function main2(){
        var ids = Object.keys(unsafeWindow.onlineUsers);
        if(ids.filter(v=>all_ids.indexOf(v)===-1).length) selectNewTarget();
        if(targetId){
            if(ids.indexOf(targetId) === -1) {
                selectNewTarget();
            }
        }
        else {
            selectNewTarget();
        }
        var level;
        if(exp === 0) level = 1;
        else if(exp < level2exp) level = 2;
        else if(exp < level2exp * 2) level = 3;
        else {
            selectNewTarget();
        }
        exp++;
        if(!targetId) return _("送る相手が存在しない");
        sendMessage(getIdiomLevel(level),targetId);
    }
    const all_ids = [];
    function selectNewTarget(){
        if(targetId) ignore.push(targetId);
        targetId = null;
        var myId = unsafeWindow.sessionId;
        var ids = Object.keys(unsafeWindow.onlineUsers);
        var select_ids = ids.filter(v=>{
            if(v === myId) return;
            if(ignore.indexOf(v) !== -1 && atrandom_flag() === false) return;
            if(unsafeWindow.onlineUsers[v].name.indexOf("きょーた") !== -1) return;
            return v;
        });
        if(!ids.length) {
            _("botを停止させます。");
            return btn_holder.find("button").click().trigger('change');
        }
        const first_ids = [];
        ids.forEach(function(v){
            if(all_ids.indexOf(v) === -1) {
                first_ids.push(v);
                all_ids.push(v);
            }
        });
        targetId = first_ids.length ? yaju1919.randArray(first_ids) : yaju1919.randArray(select_ids);
        idiom_log = [];
        exp = 0;
        level2exp = yaju1919.randInt(5,10);
    }
    function sendMessage(str,id){
        if(!str || !id) return;
        $.post(location.href + "message.php",{
            receiver_id: id,
            receiver_name: '',
            message_body: str.split('').join('\0'),
            hide_name: 0,
        });
        _(`${id} に送信 ${str}`);
    }
    const GOBI = '#heart#';
    const idiom = { // 出会い厨語録
        1: [ // 序盤
            "こんにちは　かわいいね",
        ].concat(new Array(50).fill().map(v=>"女の子？")),
        2: [ // 中盤
            "男の子？",
            "何歳？",
            "気になった",
            "名前は？けんた",
            "下の名前は？",
            "どこ住んでる？愛知です",
            "愛知県の21歳です"+GOBI,
            "彼女欲しいです"+GOBI,
            "僕と付き合おう"+GOBI,
            "付き合って"+GOBI,
            "付き合おう"+GOBI,
            "僕と結婚してくれる？",
            "胸何カップ？",
            "付き合って？",
            "彼氏欲しいよね？",
            "好き",
            GOBI,
        ],
        3: [ // 終盤
            "好き",
            GOBI,
            "何で嫌？",
            "お願い",
            "気持ちよくするから",
            "気持ちよくするからだめ？",
            "セックスしない？",
            "せっくすしよ"+GOBI,
            "SEXしよ"+GOBI,
            "Ｈしよ",
            "僕の童貞を奪ってください"+GOBI,
            "乳首舐めていい？",
            "妊娠させていい？",
        ]
    }
    let idiom_log = [], level = 0;
    function getIdiomLevel(level){
        idiom_log.unshift(yaju1919.randArray(idiom[String(level)].filter(v=>idiom_log.indexOf(v)===-1)));
        return idiom_log[0].replace(GOBI, yaju1919.randArray(["❤️","♡","♥"]));
    }
})();