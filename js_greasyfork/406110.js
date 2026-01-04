// ==UserScript==
// @name        调用 Aria2 下载比特球云盘文件
// @namespace   Bitqiu Export downloads to Aria2 RPC
// @version     0.5
// @author      Knect
// @description 调用 Aria2 下载比特球云盘文件。苦于无人开发，故自己瞎几把写了个自用。
// @license     GPL-3.0 License
// @match       https://pan.bitqiu.com/*
// @require     https://cdn.jsdelivr.net/npm/toastify-js
// @resource css https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_addElement
// @grant       GM_getResourceText
// @connect     localhost
// @connect     127.0.0.1
// @connect     10.1.1.5
// @connect     192.168.1.10
// @downloadURL https://update.greasyfork.org/scripts/406110/%E8%B0%83%E7%94%A8%20Aria2%20%E4%B8%8B%E8%BD%BD%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/406110/%E8%B0%83%E7%94%A8%20Aria2%20%E4%B8%8B%E8%BD%BD%E6%AF%94%E7%89%B9%E7%90%83%E4%BA%91%E7%9B%98%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

//###### 请在上方加入一行 "// @connect 【你的 Aria2 RPC 地址】"，已有例子，请照着写。本地运行忽略此条。######

(function () {
    'use strict';
    var RPC_URL = "http://127.0.0.1:6800/jsonrpc"; // 改成 Aria2 RPC 的地址，一般只需修改 IP/域名 部分
    var RPC_TOKEN = "123456789"; // 改成 Aria2 RPC 的密钥
    var PARAMS = "?method=aria2.addUri&id=foo&params="; // 一般无需修改

    GM_addElement('script', {
        src: 'https://cdn.jsdelivr.net/npm/toastify-js',
        type: 'text/javascript'
    })

    GM_addStyle(GM_getResourceText("css"))

    setTimeout(function () {
        go();
    }, 1000)

    var oldURL = document.URL;
    var newURL = document.URL;

    setInterval(function () {
        if (isUrlChanged()) {
            setTimeout(() => {
                go();
            }, 1000);
        }
    }, 50);

    function isUrlChanged() {
        newURL = document.URL;
        if (newURL != oldURL) {
            oldURL = newURL;
            return true;
        }
        return false;
    }

    function go() {

        var Aria2Btn = $('span:contains("下载")').last().parent().clone();
        Aria2Btn.addClass("aria2-btn");
        Aria2Btn.find('span')[0].innerText = "Aria2";

        var FileCount = $(".name-wrap").length;

        for (let n = 0; n < FileCount; n++) {
            if ($(".name-wrap").eq(n).find("use").attr("xlink:href") == "#icon-icon-folder") {
                continue;
            } else {
                var NewBtn = Aria2Btn.clone();
                $(".name-wrap").eq(n).parent().siblings().filter(".operation").prepend(NewBtn);
            }
        }

        $(".aria2-btn").click(function () {

            var data_index = $(this).parent().parent().attr("data-index");
            var fid = App.$vue.$store.getters["filelist/fileList"][data_index].resourceId;

            $.ajax({
                type: "POST",
                url: "https://pan.bitqiu.com/download/getUrl",
                dataType: "text",
                data: "fileIds=" + fid + "&org_channel=default%7Cdefault%7Cdefault",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                error: function () {
                    //alert("获取下载地址出错，请尝试刷新页面或重新登陆。");
                    Toastify({
                        text: "获取下载地址出错，请尝试刷新页面或重新登陆。",
                        duration: 3000
                    }).showToast();
                },
                success: function (data) {
                    var jsondata = JSON.parse(data);
                    var url = jsondata.data.url;
                    var ua = navigator.userAgent;
                    callAria2(url, ua);
                },
                failure: function () {
                    //alert("获取下载地址出错，请尝试刷新页面或重新登陆。");
                    Toastify({
                        text: "获取下载地址出错，请尝试刷新页面或重新登陆。",
                        duration: 3000
                    }).showToast();
                }
            })
        })

        function callAria2(url, ua) {

            var data = "[\"token:" + RPC_TOKEN + "\", [\"" + url + "\"], {\"header\":[\"User-Agent: " + ua + "\"]}]";

            GM_xmlhttpRequest({
                url: RPC_URL + PARAMS + btoa(data),
                method: 'GET',
                onerror: function (response) {
                    console.log(response);
                    //alert("调用失败，请检查你的相关配置，尝试刷新页面或重新登陆。");
                    Toastify({
                        text: "调用失败，请检查你的相关配置，尝试刷新页面或重新登陆。",
                        duration: 3000
                    }).showToast();
                },
                onload: function (response) {
                    console.log(response);
                    if (response.status == "200") {
                        Toastify({
                            text: "调用 Aria2 下载成功！",
                            duration: 3000
                        }).showToast();
                    }
                }
            });
        }
    }
})();