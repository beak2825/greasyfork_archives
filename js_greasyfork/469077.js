// ==UserScript==
// @name         F@ckCFP front
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  f@ck up invoices!
// @author       cyf-gh
// @match        https://inv-veri.chinatax.gov.cn/*
// @icon         https://www.google.com/s2/favicons?domain=chinatax.gov.cn
// @grant        none
// @license MIT
// @require1      https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/469077/F%40ckCFP%20front.user.js
// @updateURL https://update.greasyfork.org/scripts/469077/F%40ckCFP%20front.meta.js
// ==/UserScript==

/*setTimeout(function(){
        document.getElementById('fpdm').value='021001900105';
        document.getElementById('fphm').value='29925962';
        document.getElementById('kprq').value='20220602';
        document.getElementById('kjje').value='285609';
        setTimeout(function(){
            document.getElementById('fphm').click();
        },"2000");
        },"2000");*/


(function () {
    'use strict';
    var ws = {};
    function CreateWS() {
        ws = new WebSocket("ws://127.0.0.1:12888");
        ws.onopen = wsOnOpen;
        ws.onmessage = wsOnMessage;
        ws.onclose = wsOnClose;
    };
    CreateWS();
    //建立连接事件
    function wsOnOpen() {
    };
    //监听事件
    function wsOnMessage(event) {
        //监听来自客户端的数据
        //event.data
        var cfp = JSON.parse(event.data);
        switch (cfp.cmd) {
            case "check":
                document.getElementById('checkfp').click();
                break;
            case "yzm":
                ws.send("yzminfo_____" + document.getElementById('yzminfo').innerHTML);
                ws.send(document.getElementById('yzm_img').src);
                break;
            case "fill_form":
                document.getElementById('fpdm').value = cfp.fpdm;
                document.getElementById('fpdm').focus();
                document.getElementById('fphm').value = cfp.fphm;
                document.getElementById('fphm').focus();
                document.getElementById('kprq').value = cfp.kprq;
                document.getElementById('kprq').focus();
                document.getElementById('kjje').value = document.getElementById('context').innerHTML == "校验码：" ? cfp.jym : cfp.kjje;
                document.getElementById('kjje').focus();
                document.getElementById('yzm').value = cfp.yzm;
                document.getElementById('kjje').focus();
                setTimeout(function () {
                    document.getElementById('fphm').click();
                    document.getElementById('fphm').focus();
                }, 1000);
                setTimeout(function () {
                    document.getElementById('kprq').click();
                    document.getElementById('kprq').focus();
                }, 500);
                break;
            case "refresh":
                //document.getElementById('closebt').click();
                window.open('https://inv-veri.chinatax.gov.cn/', '_blank'); window.setTimeout(function () { this.close(); }, 1000)
                //history.go(0);
                break;
            case "printf":
                html2canvas(document.body, {}).then(function (canvas) {
                    var imgUrl = canvas.toDataURL();
                    ws.send(imgUrl);
                });
                break;
            case "printa":
                if (document.getElementById('print_area') != null) {
                    html2canvas(document.body, {}).then(function (canvas) {
                        var imgUrl = canvas.toDataURL();
                        ws.send(imgUrl);
                    });
                } else {
                    ws.send("null");
                }
                break;
        }

    };

    function wsOnClose() {
        setTimeout(function () {
            CreateWS();
        }, "2000");
    };
    // Your code here...
})();