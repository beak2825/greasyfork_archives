// ==UserScript==
// @icon  https://www.kuaishou.com/favicon.ico
// @name  快手弹幕语音助手_纯净聊天室版
// @namespace  [url=mailto:1031993596@qq.com]1031993596@qq.com[/url]
// @author 文超
// @description  获取快手弹幕转语音 朗读弹幕
// @match  https://live.kuaishou.com/u/*
// @version  1.2
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378579/%E5%BF%AB%E6%89%8B%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B_%E7%BA%AF%E5%87%80%E8%81%8A%E5%A4%A9%E5%AE%A4%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/378579/%E5%BF%AB%E6%89%8B%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E5%8A%A9%E6%89%8B_%E7%BA%AF%E5%87%80%E8%81%8A%E5%A4%A9%E5%AE%A4%E7%89%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setInterval(DelayGet, 100); //定时器 1s 10次=1000ms/100
    document.documentElement.webkitRequestFullscreen(); //chrome 全屏
    var LastLiNum = 0;

    //删除无用元素 延时点击流程
    setTimeout(function() {

        //删除无用元素
        var tmp_elm = document.getElementsByClassName("more-recommend-live"); //移除更多推荐
        DelDiv();
        tmp_elm = document.getElementsByClassName("work-list");
        DelDiv();
        tmp_elm = document.getElementsByClassName("sidebar simple login"); //移除顶部LOGO
        DelDiv();
        tmp_elm = document.getElementsByClassName("header-placeholder"); //移除顶栏
        DelDiv();
        tmp_elm = document.getElementsByClassName("live-user");
        DelDiv();
        tmp_elm = document.getElementsByClassName("live-detail-player-container");
        DelDiv();
        tmp_elm = document.getElementsByClassName("live-detail-container ps ps--theme_default");
        DelDiv();
        tmp_elm = document.getElementsByClassName("loading animate end invisible");
        DelDiv();
        tmp_elm = document.getElementsByClassName("resize-triggers");
        DelDiv();
        tmp_elm = document.getElementsByClassName("feed-sidebar"); //修改聊天室宽度
        tmp_elm[0].style.top = "0px";
        tmp_elm[0].style.width = "100%";
        tmp_elm = document.getElementsByClassName("pl-textarea textarea"); //修改打字栏宽度
        tmp_elm[0].style.width = "100%";

        console.log("********");
        /*DelDiv();getAttribute("")
        var tmp_elm = document.getElementsByClassName("loading animate end invisible");
        DelDiv();*/
        function DelDiv() {
            while (tmp_elm.length > 0) {
                tmp_elm[0].parentNode.removeChild(tmp_elm[0]);
            }
        }

        //模拟点击流程
        document.getElementsByClassName("theater-icon")[0].click(); //快手剧场模式
    },
    10000);

    //弹幕转语音
    function DelayGet() {
        //console.log("======================================");
        var LiaoTianUl = document.getElementsByClassName("chat-info");

        for (var i = LastLiNum; i < LiaoTianUl.length; i++) {
            var tmp_Username = LiaoTianUl[i].getElementsByClassName("username");
            var tmp_Username_Text = tmp_Username[0].innerText;
            Username_make(); //用户名处理
            var tmp_Data = LiaoTianUl[i].innerText;
            var tmp_Text = tmp_Data.replace(tmp_Username[0].innerText, "");
            var tmp_All = '';
            tmp_Text_make(); //弹幕内容处理
            if (tmp_Text.search("点亮了") != -1) {
                tmp_All = '感谢 ' + tmp_Username_Text + '点亮小红心';
            } else if (tmp_Text.search("送") != -1) {
                tmp_All = '感谢 ' + tmp_Username_Text + '送的礼物';
            } else if (tmp_Text === '一') {
                tmp_All = tmp_Username_Text + '扣一';
            } else {
                tmp_All = tmp_Username_Text + ' 说  ' + tmp_Text;
            }

            //输出控制台
            var tmp_Num = LastLiNum + i;
            console.log(tmp_Num + "----------");
            console.log(tmp_All);

            //文字转TTS语音
            var tts = new SpeechSynthesisUtterance(tmp_All);
            tts.rate = 1.1;
            window.speechSynthesis.speak(tts);

            //var src='http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text='+tmp_Data;
            //window.open(src, '_blank').location;
        }
        LastLiNum = LiaoTianUl.length;

        //刷新网页
        if (LastLiNum > 200) {
            window.location.reload(true);
        }

        //修改弹幕字体尺寸
        var k;
        var tmp_elm = document.getElementsByClassName("chat-info"); //单行弹幕
        for (k = 0; k < tmp_elm.length; k++) {
            tmp_elm[k].style.lineHeight = "50px";
        }
        tmp_elm = document.getElementsByClassName("username"); //弹幕用户名
        for (k = 0; k < tmp_elm.length; k++) {
            tmp_elm[k].style.fontSize = "40px";
        }
        tmp_elm = document.getElementsByClassName("comment"); //弹幕文本内容
        for (k = 0; k < tmp_elm.length; k++) {
            tmp_elm[k].style.fontSize = "40px";
        }

        function Username_make() { //用户名处理 去掉名字中特殊符号
            tmp_Username_Text = tmp_Username_Text.replace(/[0-9]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[😀😃😄😁😆😅😂🤣☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[△▽○◇□☆▷◁♤♡♢♧▲▼●◆■★▶◀♠♥♦♣☼☽♀☺◐☑√✔☜☝☞㏂☀☾♂☹◑☒×✘☚☟☛㏘▪•‥…▁▂▃▄▅▆▇█∷※░▒▓▏▎▍▌▋▊▉]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[♩♪♫♬§〼◎¤۞℗®©♭♯♮‖¶卍卐▬〓℡™㏇☌☍☋☊㉿◮◪◔◕@㈱№♈♉♊♋♌♎♏♐♑♓♒♍]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[↖↑↗▨▤▧◤㊤◥☴☲☷←㊣→▩▦▥㊧㊥㊨☳☯☱↙↓↘▫◈▣◣㊦◢☶☵☰↕↔⊱⋛⋌⋚⊰¬￢▔†‡]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[*＊✲❈❉✿❀❃❁☸✖✚✪❤ღ❦❧ி₪✎✍✌✁✄☁☂☃☄♨☇☈☡➷⊹✉☏]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/[@$&☢✈♟♙〠☣☠۩♜♖✙☭☄♨❂✟♞♘☤☪☮☥♝♗☦〄➹☧♛♕☨☩ஐ☫♚♔☬☎]/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/丨/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/：/g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/ /g, '');
            tmp_Username_Text = tmp_Username_Text.replace(/，/g, '');
        } //用户名处理
        function tmp_Text_make() { //弹幕内容处理
            tmp_Text = tmp_Text.replace(/1/g, '一');
            tmp_Text = tmp_Text.replace(/2/g, '二');
            tmp_Text = tmp_Text.replace(/3/g, '三');
            tmp_Text = tmp_Text.replace(/4/g, '四');
            tmp_Text = tmp_Text.replace(/5/g, '五');
            tmp_Text = tmp_Text.replace(/6/g, '六');
            tmp_Text = tmp_Text.replace(/7/g, '七');
            tmp_Text = tmp_Text.replace(/8/g, '八');
            tmp_Text = tmp_Text.replace(/9/g, '九');

        } //弹幕内容处理
    }

})();