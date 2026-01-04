// ==UserScript==
// @name         asmr.one文件下载
// @namespace    文件下载
// @version      0.3
// @license MIT License
// @description 文件下载脚本
// @author       Namishibuki
// @match        https://www.asmr.one/work/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/444302/asmrone%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444302/asmrone%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        /////
        var XhrObj = {}
        var RJcode = window.location.href.slice(window.location.href.indexOf('RJ') + 2, window.location.href.length);//获取RJ号
        console.log(RJcode, 44444444)
        var div = document.createElement("DIV");
        div.innerHTML = "下载";
        div.id = "addDiv";
        //创建
        div.style.cssText =
            "color: #ffffff;font-size: 14px;z-index: 1000;width: 60px;height: 32px;background: #00bcd4;position: relative;left: 227px;top: -31px;display: flex;align-items: center;justify-content: space-around;border-radius: 3px;box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);";
        //插入元素
        document.getElementsByClassName('q-pa-sm')[0].appendChild(div);
        /////
        var token = "Bearer " + localStorage.getItem("jwt-token").slice(localStorage.getItem("jwt-token").indexOf('|') + 1, localStorage.getItem("jwt-token").length)//获取令牌
        console.log(token, 99999999)
        //调用后台接口
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.asmr.one/api/tracks/" + RJcode,
            headers: {
                "authorization": token
            },
            onload: function (e) {
                console.log(JSON.parse(e.responseText), 77999)
                XhrObj = JSON.parse(e.responseText)
            }
        })
        //创建递归函数
        var RecursionFun = function (obj, name) {
            obj.forEach(e => {
                if (e.type == "folder" && e.title == name) {
                    e.children.forEach(e1 => {
                        if (e1.type !== "folder") {
                            console.log(e1.mediaDownloadUrl)
                            GM_download(e1.mediaDownloadUrl, e1.title)
                        }else{
                            alert('当前目录下没有文件')
                        }
                    })
                }
                // if (e.type !== "folder") {
                //     //全部链接输出
                //     console.log(e.mediaDownloadUrl)
                // }
                if (e.children) {
                    RecursionFun(e.children, name)
                }
            })
        }
        div.onclick = function () {
            if (document.getElementsByClassName("q-breadcrumbs").length > 0) {
                var FlieNameArr = document.getElementsByClassName("q-breadcrumbs")[0].innerText.split("\n/\nfolder\n")
                var LastName = FlieNameArr[FlieNameArr.length - 1]//获取最后一个文件夹的名称在对象里进行匹配
                RecursionFun(XhrObj, LastName)

            } else {
                alert('请打开任意文件夹')
            }
            // console.log(document.getElementsByClassName("q-breadcrumbs")[0].innerText, 789987777)

        }
    }

    // Your code here...
})();