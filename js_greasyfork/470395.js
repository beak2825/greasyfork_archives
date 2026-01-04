// ==UserScript==
// @name 百度网盘直链助手
// @namespace  mogu
// @description 百度网盘直链提取配合IDM下载
// @version 0.0.10
// @include https://pan.baidu.com/disk/*
// @connect baidu.com
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @license GPL
// @namespace https://greasyfork.org/scripts/470395
// @downloadURL https://update.greasyfork.org/scripts/470395/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/470395/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function AddElement() {
    if (document.getElementById("MGDown") === null) {
        const newbutton = document.createElement("button");
        newbutton.id = "MGDown";
        newbutton.className = "u-button nd-file-list-toolbar-action-item u-button--primary";
        newbutton.style.marginRight = "8px";
        newbutton.innerText = "MGDown";
        document.querySelector("div.wp-s-agile-tool-bar__header").prepend(newbutton);
    } else {
        setTimeout(() => {
            AddElement();
        }, 100);
    }
}
AddElement();
document.getElementById("MGDown").addEventListener("click", () => {
    let list = document.getElementsByClassName("wp-s-pan-table__body-row mouse-choose-item selected");
    if (list.length == 0) {
        list = document.getElementsByClassName("wp-s-file-grid-list__item text-center cursor-p mouse-choose-item is-checked");
        if (list.length == 0) {
            list = document.getElementsByClassName("wp-s-file-contain-list__item text-center cursor-p mouse-choose-item is-checked");
            if (list.length == 0) {
                alert("请选择单个文件");
            }
        }
    }
    if (list.length === 1) {
        let fid = list[0].getAttribute("data-id");
        if(fid == null || fid == ""){
            alert("获取文件信息失败");
        } else {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://pan.baidu.com/api/filemetas?dlink=1&clienttype=8&fsids=[\"" + fid + "\"]",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: (response) => {
                    const jsondata = JSON.parse(response.responseText);
                    if (jsondata.info === undefined || jsondata.info.length === 0 || jsondata.info[0].dlink === undefined || jsondata.info[0].dlink === "") {
                        alert("获取下载地址失败");
                    } else {
                        let path = jsondata.info[0].path;
                        let ua = navigator.userAgent;
                        GM_xmlhttpRequest({
                            "url": "http://pan.baidu.com/rest/2.0/xpan/file?method=locatedownload&tls=1&app_id=250528&es=1&esl=1&ver=4.0&dtype=3&err_ver=1.0&ehps=0&open_pflag=0&clienttype=8&channel=0&version=7.35.1.2&vip=2&wp_retry_num=2&tdt=1&gsl=0&gtchannel=0&gtrate=0&revision=0&path=" + encodeURIComponent(path),
                            "method": "GET",
                            "responseType": "json",
                            "headers": {
                                "User-Agent": "Mo;DL"
                            },
                            "onload": r => {
                                var dl = r.response.urls
                                if (dl == undefined || dl.length == 0 || dl == ""){
                                    GM_xmlhttpRequest({
                                        "url": "http://pan.baidu.com/rest/2.0/xpan/file?method=locatedownload&tls=1&app_id=250528&es=1&esl=1&ver=4.0&dtype=3&err_ver=1.0&ehps=0&open_pflag=0&clienttype=8&channel=0&version=7.35.1.2&vip=2&wp_retry_num=2&tdt=1&gsl=0&gtchannel=0&gtrate=0&caller=netprinter&path=" + encodeURIComponent(path),
                                        "method": "GET",
                                        "responseType": "json",
                                        "headers": {
                                            "User-Agent": "Mo;DL"
                                        },
                                        "onload": r => {
                                            var dl = r.response.urls
                                            if (dl == undefined || dl.length == 0 || dl == ""){
                                                alert("获取失败");
                                            } else {
                                                var dlink = r.response.urls[0].url
                                                if (dlink == undefined || dlink.length == 0 || dlink == "") {
                                                    alert("获取下载地址失败");
                                                } else {
                                                    console.log(dlink)
                                                    r.response.hasOwnProperty("client_ip") && GM_setClipboard(dlink, "text");
                                                    alert("已复制到粘贴板 UA:Mo;DL");
                                                }
                                            }
                                        },
                                        onerror: () => {
                                            alert("网络错误");
                                        }
                                    });
                                } else {
                                    var dlink = r.response.urls[0].url
                                    if (dlink == undefined || dlink.length == 0 || dlink == "") {
                                        GM_xmlhttpRequest({
                                            "url": "http://pan.baidu.com/rest/2.0/xpan/file?method=locatedownload&caller=netprinter&path=" + encodeURIComponent(path),
                                            "method": "GET",
                                            "responseType": "json",
                                            "headers": {
                                                "User-Agent": "Mo;DL"
                                            },
                                            "onload": r => {
                                                var dl = r.response.urls
                                                if (dl == undefined || dl.length == 0 || dl == ""){
                                                    alert("获取失败");
                                                } else {
                                                    var dlink = r.response.urls[0].url
                                                    if (dlink == undefined || dlink.length == 0 || dlink == "") {
                                                        alert("获取下载地址失败");
                                                    } else {
                                                        console.log(dlink)
                                                        r.response.hasOwnProperty("client_ip") && GM_setClipboard(dlink, "text");
                                                        alert("已复制到粘贴板 UA:Mo;DL");
                                                    }
                                                }
                                            },
                                            onerror: () => {
                                                alert("网络错误");
                                            }
                                        });
                                    } else {
                                        console.log(dlink)
                                        r.response.hasOwnProperty("client_ip") && GM_setClipboard(dlink, "text");
                                        alert("已复制到粘贴板 UA:Mo;DL");
                                    }
                                }
                            },
                            onerror: () => {
                                alert("网络错误");
                            }
                        });
                    }
                },
                onerror: () => {
                    alert("网络错误");
                }
            });
        }
    }
});