// ==UserScript==
// @name         AnimeGoHelper[U2快速订阅]
// @namespace    https://github.com/deqxj00/AnimeGoHelper#u2
// @version      0.20
// @description  AnimeGo的WebAPI调用插件,能快速添加下载项目,配置筛选规则。
// @author       DeQxJ00
// @match        https://u2.dmhy.org/*
// @icon         https://u2.dmhy.org/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465463/AnimeGoHelper%5BU2%E5%BF%AB%E9%80%9F%E8%AE%A2%E9%98%85%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/465463/AnimeGoHelper%5BU2%E5%BF%AB%E9%80%9F%E8%AE%A2%E9%98%85%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let path = window.location.pathname;
    //Tampermonkey的存储三个值
    var apipath = "http://youraddress.local/api";
    var token = "your_animego_token";
    var passkey = "u2_passkey";
    var tokensha256 = "";
    if (GM_getValue("apipath") == null || GM_getValue("apipath") == undefined || GM_getValue("apipath") == "undefined"|| GM_getValue("apipath") == ""){
        GM_setValue("apipath",apipath);
    }else{
        apipath = GM_getValue("apipath");
    }
    if (GM_getValue("token") == null || GM_getValue("token") == undefined || GM_getValue("token") == "undefined"|| GM_getValue("token") == ""){
        GM_setValue("token",token);
    }else{
        token = GM_getValue("token");
    }
    if (GM_getValue("passkey") == null || GM_getValue("passkey") == undefined || GM_getValue("passkey") == "undefined"|| GM_getValue("passkey") == ""){
        GM_setValue("passkey",passkey);
    }else{
        passkey = GM_getValue("passkey");
    }

    if(apipath == "http://youraddress.local/api" || token == "your_animego_token" || passkey == "u2_passkey"){
        GM_notification({
            text: "请到TamperMonkey的存储中修改保存三个值",
            title: "AnimeGoHelper[U2快速订阅] 设置修改提醒",
            onclick: () => {
                if(apipath == "http://youraddress.local/api")
                {
                    var param = prompt("请输入apipath参数(此参数为AnimeGo的webapi地址)：",apipath);
                    if(param != null){
                        apipath = param;
                        GM_setValue("apipath",apipath);
                    }
                }
                if(token == "your_animego_token")
                {
                    var param2 = prompt("请输入token参数(此参数为AnimeGo的webapi的验证token)：",token);
                    if(param2 != null){
                        token = param2;
                        GM_setValue("token",token);
                    }
                }
                if(passkey == "u2_passkey")
                {
                    var param3 = prompt("请输入passkey参数(此参数为U2的torrent的passkey)：",passkey);
                    if(param3 != null){
                        passkey = param3;
                        GM_setValue("passkey",passkey);
                    }
                }
            }
        });
    }
    GM_registerMenuCommand('修改需要输入的参数', function() {
        var param = prompt("请输入apipath参数(此参数为AnimeGo的webapi地址)：",apipath);
        if(param != null){
            apipath = param;
            GM_setValue("apipath",apipath);
        }
        var param2 = prompt("请输入token参数(此参数为AnimeGo的webapi的验证token)：",token);
        if(param2 != null){
            token = param2;
            GM_setValue("token",token);
        }
        var param3 = prompt("请输入passkey参数(此参数为U2的torrent的passkey)：",passkey);
        if(param3 != null){
            passkey = param3;
            GM_setValue("passkey",passkey);
        }
    });
    digestMessage(token).then(
        (digestHex) => {
            if (token !== '') {
                tokensha256 = digestHex;
            }
        }
    );
    let alist = document.getElementsByTagName("a");
    console.log(alist.length);
    if(path.includes("/details.php")){
        var downloadtr = document.getElementsByClassName('rowfollow')[0];
        var aid = 0;
        var downloadurl = downloadtr.children[1].href;
        var title = document.getElementsByTagName('h1')[0].innerText;
        for ( i = 0; i < alist.length; i++) {
            a = alist[i];
            if (a.href !== null && a.href !== undefined && a.href !== "undefined" && a.href.includes("anidb.net")) {
                aid = a.href.replace("http://", "").replace("https://", "").replace("anidb.net/","");
            }
        }
        downloadtr.lastChild.insertAdjacentHTML('afterend', ` <a onclick="window.GoClick('${downloadurl}','${aid}','${title}')"><b>[GO]</b></a>`);
    }
    if(path.includes("/torrents.php")){
        for (var i = 0; i < alist.length; i++) {
            var a = alist[i];
            if (a.href !== null && a.href !== undefined && a.href !== "undefined" && a.href.includes("anidb.net")) {
                aid = a.href.replace("http://", "").replace("https://", "").replace("anidb.net/","");
                downloadurl = "";
                title = "";

                let alist2 = a.parentNode.parentNode.parentNode.getElementsByTagName("a");
                for (var j = 0; j < alist2.length; j++) {
                    var a2 = alist2[j];
                    if (a2.href !== null && a2.href !== undefined && a2.href !== "undefined" && a2.href.includes("details.php")) {
                        title = a2.innerText;
                    }
                    if (a2.href !== null && a2.href !== undefined && a2.href !== "undefined" && a2.href.includes("download.php")) {
                        downloadurl = a2.href+"&passkey="+passkey;
                    }
                }
                a.insertAdjacentHTML('afterend', `<a onclick="window.GoClick('${downloadurl}','${aid}','${title}')">[GO]</a>`);
            }
        }
    }
    function toast(msg) {
        GM_notification({
            text: msg,
            title: "AnimeGoHelper[U2快速订阅]",
            timeout: 3000,
            //onclick: () => alert('I was clicked!')
        });
    }
    async function digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    unsafeWindow.GoClick = function (download_url,aid,title){
        var _data = JSON.stringify({
            "source": "u2",
            "data": [
                {
                    "url": download_url,
                    "info":{"title":title,"anidb_id":aid}
                }
            ],
        });
        GM_xmlhttpRequest({
            method: 'POST',
            url: apipath + "/download",
            data: _data,
            headers: {
                'Access-Key': tokensha256,
                'Content-Type': 'application/json'
            },
            onerror: response => {
                console.log('onerror');
                toast('[api地址不正确] error')
            },
            ontimeout: response => {
                console.log('ontimeout');
            },
            onloadend: response => {
                console.log('onloadend');
            },
            onload: response => {
                //console.log(response.status);
                if (response.status == 200) {
                    var resp = JSON.parse(response.responseText);
                    if (resp === null || resp === undefined || resp === 'undefined') {
                        toast(title + '\r\n[resp is null or undefined]');
                    } else {
                        var code = resp.code;
                        if (code === 200 || code === '200') {
                            toast(resp.msg);
                        } else {
                            toast(title + '\r\n[json code error] code:' + resp.code + ',msg:' + resp.msg);
                        }
                    }
                } else {
                    toast(title + '\r\n[http request error] ' + response.status)
                }
            }
        });
    }
})();