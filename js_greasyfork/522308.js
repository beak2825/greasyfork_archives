// ==UserScript==
// @name         复制网址
// @namespace    https://greasyfork.org/users/1171320
// @version        1.10
// @description  将当前网站标题+链接复制到剪贴板，方便保存。title + url
// @author         yzcjd
// @author2       ChatGPT 辅助
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @run-at       document-end
// @match        *://*/*
// @exclude      *://*/*.ipynb
// @grant        GM_addStyle
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522308/%E5%A4%8D%E5%88%B6%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/522308/%E5%A4%8D%E5%88%B6%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

// 立即执行函数避免污染全局
(function () {
    "use strict";

    addStyle();
    addBtn();

    let isClicking = false; // 防止过快重复点击
    document.getElementById("copyBtn").addEventListener("click", function () {
        if (!isClicking) {
            copy();
            isClicking = true;
            setTimeout(() => {
                isClicking = false;
            }, 2000);
        }
    });

    const result = {
        flag: true,  // 标志位
        url: document.URL, // 当前网页链接
        title: document.title, // 当前网页标题
        text: "", // 生成的 markdown 链接
    };

    const removeParamPattern = /\?.*/;  // 用于移除URL中的参数
    function removeParam(url) {
        return url.replace(removeParamPattern, "");
    }

    const urlMap = {
        "mp.weixin.qq.com": function (result) {
            const name = document.querySelector("#profileBt a")?.textContent.trim();
            result.title = `${result.title}_${name}_微信公众号`;
        },

        "blog.csdn.net/": function (result) {
            result.title = result.title.replace(/\(.*?\)/, "").trim();  // 去掉CSDN的提示
            result.title = result.title.replace(/CSDN博客.*/, "CSDN博客");
            if (result.url.match(/blog.csdn.net\/.*?\/category_*/)) {
                result.title = `==分类专栏==: ${result.title}`;
            } else {
                result.url = result.url.split("?")[0]; // 去掉查询参数
            }
        },

        "toutiao.com/article/": function (result) {
            const author = document.querySelector("a.user-name")?.textContent;
            result.title = `${result.title}-【${author}】-文章`;
        },

        "bilibili.com/video/": function (result) {
            result.flag = false;
            const author = document.querySelector(".up-name")?.textContent.trim();
            result.title = `${result.title}-【${author}】`;
        },

        // 添加更多网址处理...
    };

    function copy() {
        let isFound = false;
        for (let urlPattern in urlMap) {
            const reg = new RegExp(urlPattern, "i");
            if (reg.test(result.url)) {
                const handler = urlMap[urlPattern];
                if (handler) {
                    handler(result);
                }
                isFound = true;
                break;
            }
        }

        if (result.flag) {
            result.url = removeParam(result.url);
        }

        result.text = `${result.title} ${result.url} `;

        // 复制到剪贴板
        handleCopy(result.text);

        // 修改按钮样式
        const copyBtn = document.getElementById("copyBtn");
        copyBtn.style.background = "green";
        copyBtn.textContent = "copy";
        setTimeout(() => {
            copyBtn.style.background = "#f5f5f5";
            copyBtn.textContent = "copy";
        }, 2000);
    }

    function addStyle() {
        const buttonStyle = `
            .layui-btn {
                display: inline-block;
                height: 80px;
                line-height: 20px;
                padding: 0px 0px;
                background: #f5f5f5;
                color: #000;
                border-radius: 6px;
                border: 1px solid #ccc;
                cursor: pointer;
                font-size: 12px;
                transform: scale(0.9)
            }
            .layui-btn-sm {
                height: 20px;
                line-height: 20px;
                padding: 0px 0px;
                font-size: 12px;
            }
        `;
        GM_addStyle(buttonStyle);
    }

    function addBtn() {
        const button = document.createElement("button");
        button.id = "copyBtn";
        button.textContent = "copy";
        button.style.cssText = "top: 100px; right: 10px; position: fixed; z-index: 1000; cursor: pointer; background: #f5f5f5; width: 40px;";
        button.classList.add("layui-btn", "layui-btn-sm");

        document.body.appendChild(button);
    }

    function handleCopy(text) {
        const inputNode = document.createElement("input");
        inputNode.value = text;
        document.body.appendChild(inputNode);
        inputNode.select();
        document.execCommand("copy");
        inputNode.remove();
    }
})();
