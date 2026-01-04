// ==UserScript==
// @name         超星网盘直链生成 - Optimized
// @namespace    NEKO_CXNDDL
// @version      1.2.1
// @description  添加更多功能
// @author       NekoRectifier
// @match        https://pan-yz.chaoxing.com/
// @match        https://i.chaoxing.com/base?t=*
// @match        https://pan-yz.chaoxing.com/external/m/file/*
// @license      MIT
// @icon         https://pan-yz.chaoxing.com/favicon.ico
// @require      https://cdn.bootcss.com/clipboard.js/1.5.16/clipboard.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/447810/%E8%B6%85%E6%98%9F%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E7%94%9F%E6%88%90%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/447810/%E8%B6%85%E6%98%9F%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E7%94%9F%E6%88%90%20-%20Optimized.meta.js
// ==/UserScript==

//=============== CUSTOM VARIABLES ================

var aria_url = "http://127.0.0.1:6800/jsonrpc"
var aria_method = "POST"

//=============== CUSTOM VARIABLES ================

function log(content) {
    console.log(content);
}

function copyToClipboard(str) {
    $(".cdd_download")[0].setAttribute("data-clipboard-text", str)
    var clipboard = new Clipboard(".cdd_download");
    clipboard.on('success', function (e) {
        console.log('复制成功！');
    });

    clipboard.on('error', function (e) {
        console.log('复制失败！');
    });
}

function download_aria(url, name) {
    var req =
    {
        id: '',
        jsonrpc: '2.0',
        method: 'aria2.addUri',
        params: [
            [url],
            {
                out: name,
                header: [
                    'referer: https://i.chaoxing.com'
                ]
            }
        ]
    };

    $.ajax({
        url: aria_url,
        type: aria_method,
        crossDomain: true,
        processData: false,
        data: JSON.stringify(req),
        contentType: 'application/json',

        success: function (msg) {
            console.log(msg);
        },
        error: function (e) {
            // maybe there's other types of errors, but they cannot be tested so far... 
            if (e.status == 0) {
                alert('Aria2 服务端未启动');
            } else {
                alert('Aria2 RPC 连接失败，检查 Token 及端口设置');
            }
        }
    })
}

function createButton(type) {
    var download_btn = document.createElement("button");
    download_btn.innerText = "下载 / 复制";
    download_btn.setAttribute("class", "mdui-btn cdd_download");
    download_btn.setAttribute("data-clipboard-text", "");
    download_btn.setAttribute('data-clipboard-action', 'copy');

    if (type == 1) {
        // external version 
        download_btn.setAttribute("id", "ex_copy_btn");
        download_btn.setAttribute("style",
            "margin-left:8px; background-color: #4CAF50; position: absolute; left:35%; margin-top:16px"
        );
    } else {
        download_btn.setAttribute("id", "direct_download");
        download_btn.setAttribute("onclick", "res.copy_direct_url();");
        download_btn.setAttribute("style", "margin-left:8px; background-color: #4CAF50; float: center");
    }

    return download_btn;
}

function accquire_actual_url(filenode) {
    var failedFilenames = new Array();
    var failedUrlsAmount = 0;
    var succeededUrls = new Array();
    var succeededFilenames = new Array();
    var succeededUrlsAmount = 0;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
        "get",
        "https://pan-yz.chaoxing.com/external/m/file/" + filenode['id'],
        false
    );
    xmlHttp.send();

    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        succeededUrls[succeededUrlsAmount] =
            xmlHttp.responseText.match(/https:\/\/d0.*(?=')/)[0].replace(/(?<=fn=).*/, filenode["name"]);
        succeededFilenames[succeededUrlsAmount] = filenode["name"];
        succeededUrlsAmount++;
    } else {
        failedFilenames[failedUrlsAmount] = filenode["name"];
        failedUrlsAmount = failedUrlsAmount + 1;
    }

    if (succeededUrlsAmount > 0) {

        if (succeededUrlsAmount > 1) {
            //multi file downloads
            for (var i = 0; i < succeededUrlsAmount; i++) {
                download_aria(succeededUrls[i], succeededFilenames[i])
            }
        } else {
            //single file
            download_aria(succeededUrls[0], succeededFilenames[0])
        }

        alert('链接已复制；\nAria2 下载已开始');
        copyToClipboard(succeededUrls);
    }
    if (failedUrlsAmount > 0) {
        alert(
            failedFilenames.toString() + " 等文件请求直链失败！（不支持文件夹）"
        );
        //TODO more friendiler failed prompt
    }

    return succeededUrls, succeededFilenames;
}


//main entry
(function () { 
    "use strict";
    console.clear();
    $("head").append($(`<link rel="stylesheet" href="https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css" />`));

    var div = document.getElementsByClassName("ypActionBar")[0];
    var href = window.location.href;

    if (div) {
        div.append(createButton(0));

        res.copy_direct_url = function () {

            if (res.choosedlen > 0) {
                for (var filenode in res.choosed) {
                    accquire_actual_url(res.choosed[filenode])
                }
            } else {
                alert('请选中文件后再点击下载按钮');
            }
        };

    } else if (href.indexOf("pan-yz.chaoxing.com/external") != -1) {
        log("currently in external sharing page");

        $(".wid500").append(createButton(1));

        $("#ex_copy_btn").click(function(event) {
            var file_node_obj =
            {
                id: href.substring(href.lastIndexOf('/') + 1),
                name: $("#name").text()
            }

            accquire_actual_url(file_node_obj);
        });
        
    } else {
        console.log("没有抓取到div");
    }
})();

$(document).ready(function () { })
