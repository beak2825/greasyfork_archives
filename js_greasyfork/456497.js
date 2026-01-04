// ==UserScript==
// @name         Bilibili专栏原图链接提取
// @namespace    https://github.com/hui-shao
// @version      0.2
// @description  PC端B站专栏图片默认是经压缩过的webp。点击悬浮按钮，即可获取哔哩哔哩专栏中所有原图的直链，然后你可以使用其它工具批量下载原图。
// @author       Hui-Shao
// @license      GPLv3
// @match        https://www.bilibili.com/read/cv*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456497/Bilibili%E4%B8%93%E6%A0%8F%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456497/Bilibili%E4%B8%93%E6%A0%8F%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        var button = document.createElement("button");
        button.id = "btn001";
        button.textContent = "提取链接";
        button.className = "toolbar-item";
        button.style.borderRadius= "6px"
        button.style.marginLeft = "10%";
        button.style.height = "40px";
        button.style.width = "80%";
        button.style.backgroundColor = "#76EEC6";
        button.onclick = function () {
            urlGet(1);
            urlGet(2);
        };
        document.querySelector(".side-toolbar").appendChild(button);
    }

    function urlGet(mode){
        let selector_t,attribute_t;
        if(mode == 1){
            selector_t = "#article-content img[data-src].normal-img";
            attribute_t = "data-src";
        }
        else if(mode == 2){
            selector_t = "#article-content p.normal-img img";
            attribute_t = "src";
        }
        else{
            alert("传入模式参数错误！");
            return;
        }

        let img_list = document.querySelectorAll(selector_t);
        console.debug(img_list);
        if (img_list.length <= 0){
            alert("【模式" + mode +"】\n\n (°Д°)\n在正文中似乎并没有获取到图片……");
            return;
        }
        let url_list = [];
        for (let item of img_list){
            let text = item.getAttribute(attribute_t);
            text = location.protocol + text.match(/(\S*)@.*/)[1];
            url_list.push(text);
        }
        console.debug(url_list);
        let reply = confirm("【模式" + mode +"】\n\n(￣▽￣)~*\n共获取到了 "+ url_list.length +" 个URL，是否下载URL信息？");
        if (reply){
            let url_str = "";
            for (let per_url of url_list){
                url_str += per_url + "\n";
            }
            download_txt("bili_img_urls",url_str);
        }
    }

    function download_txt(filename, text) {
        console.debug("[Script] Start Download.");
        let pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        pom.click();
    }

    document.onreadystatechange = ()=>{
        if(document.readyState == "complete") {
            console.debug("[Script] Document Complete.");
            createButton();
        }
    };

})();