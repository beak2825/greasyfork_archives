// ==UserScript==
// @name         E-hentai Image-Viewer
// @namespace    http://tampermonkey.net/
// @version      20240519
// @description  view image conveniently
// @author       You
// @match        https://e-hentai.org/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        unsafeWindow
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491546/E-hentai%20Image-Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/491546/E-hentai%20Image-Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let arrDoms = document.querySelectorAll(".gdtm");

    // create menu
    let id_menu = "menu";
    let id_new_tab = "new_tab";
    let id_show_directly = "show_directly";
    let id_download = "download";
    let menu_width = 0;
    let menu_height = 0;
    {
        let rect = arrDoms[1].getBoundingClientRect();
        menu_width = rect.width;
        menu_height = rect.height;

        // let menu_style = `style = "width: ${width}px; height: ${height}px;"`;
        let button_sytle = ` style = "display:block; width:${menu_width}px; height:${
        menu_height / 3
        }px;line-height:${menu_height / 3}px;font-size: 12px; "`;

        document.querySelector("body").insertAdjacentHTML(
            "beforeend",
            `
        <div class="menu" id=${id_menu}>
            <div><button id="${id_new_tab}" ${button_sytle}>新标签页中打开</a></div>
            <div><button id="${id_show_directly}" ${button_sytle}>直接显示</a></div>
            <div><button id="${id_download}" ${button_sytle}>下载</a></div>
    </div>
        `
        );
    }

    let menu = document.querySelector("#" + id_menu);

    let menu_new_tab = document.querySelector("#" + id_new_tab);
    let menu_show_directly = document.querySelector("#" + id_show_directly);
    let menu_download = document.querySelector("#" + id_download);

    menu.style.display = "none";
    menu.style.position = "absolute";
    menu.style.top = 0;
    menu.style.left = 0;
    menu.style.width = String(menu_width) + "px";
    menu.style.height = String(menu_height) + "px";
    menu.style.backgroundColor = "gainsboro";
    menu.style.opacity = 0.7;

    async function SetSrc() {
        let parent = menu.parentNode;
        if (!parent.getAttribute("src")) {
            let url = parent.querySelector("a").href;

            let img_url = await fetchImageSrc(url);
            parent.setAttribute("src", String(img_url));

            return img_url;
        }

        return parent.getAttribute("src");
    }

    menu_new_tab.onclick = async function () {
        let img_url = await SetSrc();
        if (img_url) {
            // console.log("menu_new_tab" + img_url);
            window.open(img_url);
        }
    };

    // create hint
    let idHint = "hintEle";
    {
        let maxHeight = parseInt(window.innerHeight * 0.7);
        let maxWidth = window.innerWidth;
        let url = "";

        // ‘beforeend’：插入元素内部的最后一个子节点之后。
        document.querySelector("body").insertAdjacentHTML(
            "beforeend",
            `
        <img src="${url}";
        id = "${idHint}";
        style="
            max-width: ${maxWidth}px;
            max-height: ${maxHeight}px;
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 999;
            display: none;
        ">
        `
        );
    }

    let hintEle = document.querySelector("#" + idHint);
    hintEle.onload = function()
    {
         hintEle.style.display = "block";
         let left = parseInt(hintEle.style.left);
         let offset = window.innerWidth < hintEle.offsetWidth + left ? -(hintEle.offsetWidth + left - window.innerWidth): 0;
        //console.log(`hintEle.style.width: ${hintEle.style.width}, window.innerWidth: ${window.innerWidth}`);
       // console.log(`left: ${left}, offset: ${offset}, left+= offset: ${left + offset}`);
         left += offset;

         hintEle.style.left = String(left) + "px";
    }

    menu_show_directly.onclick = async function () {
        let img_url = await SetSrc();

        show_hint();
    };

    function show_hint() {
        if (menu.parentNode.getAttribute("src")) {
            hintEle.src = menu.parentNode.getAttribute("src");
        }
    }

    // add handlers
    for (let dom of arrDoms) {
            dom.onmouseover = function () {
            dom.style.backgroundColor = "black";

            let rect = this.getBoundingClientRect();
            hintEle.style.top = String(rect.bottom + window.scrollY) + "px";
            hintEle.style.left = String(rect.left + window.scrollX ) + "px";

            dom.style.position = "relative";
            dom.appendChild(menu);
            menu.style.display = "block";

            if (dom.getAttribute("src")) {
                /*hintEle.style.display = "block";
      hintEle.src = dom.getAttribute("src");*/
                show_hint();
            }
        }; // if (!menu.src)

        dom.onmouseout = function () {
            dom.style.backgroundColor = "";
            hintEle.style.display = "none";
            menu.style.display = "none";
        };
    }

    // 创建一个异步函数来获取网页内容
    async function fetchImageSrc(url) {
        try {
            // 使用 Fetch API 发起请求
            const response = await fetch(url);

            // 确认响应状态为成功
            if (!response.ok) {
                throw new Error("请求图片失败");
            }

            // 解析响应的 HTML 内容
            const html = await response.text();

            // 创建一个虚拟 DOM 对象
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // 获取指定元素的内容
            const imgUrl = doc.querySelector("#i3 img").src;

            // 返回获取到的图片 URL
            console.log("fetchImageSrc: 获取图片地址成功");
            return imgUrl;
        } catch (error) {
            console.error("在进行获取页面的时候, 发生了这样的问题:", error);
            return null;
        }
    }

    /*
// 调用函数并处理结果
fetchImageSrc()
  .then((imgUrl) => {
    if (imgUrl) {
      console.log("The image URL is:", imgUrl);
    } else {
      console.log("Failed to retrieve image URL.");
    }
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });
*/


    menu_download.onclick = async function () {
        let img_url = await SetSrc();
        GM_download(img_url, "pic"+String(Math.ceil(Math.random()*10000)));
    };

})();