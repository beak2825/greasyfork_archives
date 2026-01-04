// ==UserScript==
// @name         Cypher's ghost ryuryu 写真图
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  页面重新布局，直接下载最大图，解决图片http的请求问题
// @author       SilvioDe
// @match        https://ryuryu.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ryuryu.tw
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.js
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/458679/Cypher%27s%20ghost%20ryuryu%20%E5%86%99%E7%9C%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458679/Cypher%27s%20ghost%20ryuryu%20%E5%86%99%E7%9C%9F%E5%9B%BE.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';

    console.error('\t\t\t\t\t\t!!!local loaded')
    let srcs = ""

    function getImages() {
        let imgPart = ""
        imgPart += $("h1")[0].innerHTML + "<br>"
        for (let i of $(".kg-image")) {
            let src = i.srcset.split(",").pop().replace("http", "https")
            src = src.split(" ")[1]
            srcs += src + "\n"
            imgPart += `<img src=${src} class="normal" onclick='this.className=picSizeChange(this.className)'>`

        }
        return imgPart
    }

    function createWindow(data, width = 1920, height = 1400, left = 0) {
        if (!data) {
            return
        }
        let myWinodw = window.open("", "_self", `width=${width},height=${height},left=${left}`, true)
        myWinodw.document.write(`<script>
            function picSizeChange(name) {
                console.log(name)
                if (name != "normal") {
                    return "normal"
                } else {
                    return "bigpic"
                }
            }
        </script>`)
        myWinodw.document.write(data)
        myWinodw.document.write(`<style>
            img {
                display: inline;
                height: 50%;
                padding: 10px
            }
            .bigpic {
                height: 100%;
            }
            </style>`)


        myWinodw.document.close()
    }

    //复制全部的url到迅雷
    function downloadAllPic(text) {
        GM_setClipboard(text, "text")
        //3秒后，自动复制标题名称到剪贴板
        setTimeout(() => {
            GM_setClipboard($("h1")[0].innerText, "text")
        }, 3000)
        //点击标题自动复制名称到剪贴板
        $("h1").click(function () {
            GM_setClipboard($(this)[0].innerText, "text")
        })
    }

    // downloadAllPic(srcs)
    if (location.href != "https://ryuryu.tw/" && location.href.length > 30) {
        console.log(location.href.length)
        createWindow(getImages(), 1920, 1400, 500)
    } else {
        console.error(location.href.length)
    }


})();