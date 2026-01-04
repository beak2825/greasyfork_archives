// ==UserScript==
// @name         新道Vbse3.6福州工商学院文件地址自动替换按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手动替换很麻烦，点个按钮方便一下
// @author       DTEmiemie
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444610/%E6%96%B0%E9%81%93Vbse36%E7%A6%8F%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E6%96%87%E4%BB%B6%E5%9C%B0%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/444610/%E6%96%B0%E9%81%93Vbse36%E7%A6%8F%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E6%96%87%E4%BB%B6%E5%9C%B0%E5%9D%80%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //创建按钮
    let btn = document.createElement("button")
    btn.innerHTML = "点我替换"
    btn.onclick = function(){
        let fileList = document.querySelectorAll("ul.files>li")
        let fileLink = document.querySelectorAll("ul.files>li>a")
        let fileCounts = fileList.length
        //操作
        replacelink()
        // alert("总共有" + fileCounts + "个文件" + "\n" + test())
        //--函数区域--
        function replacelink(){
            let i = 0
            let originLink = ""
            for (i=0;i<fileLink.length;i++){
                fileLink[i].href = fileLink[i].href.replace(/192.168.4.11:8080/,"222.76.119.161:8087")
            }
        }
        function test(){
                let message = ""
                let i=0
                for (i=0;i<fileList.length;i++){
                    message = message + "\n" + fileList[i].title + "：" + fileLink[i].href +"\n"
                }
                return message
        }
    }
    // 加载完页面后插入按钮
    window.onload = function(){
        document.getElementsByClassName("files")[0].append(btn)
    }
})();
