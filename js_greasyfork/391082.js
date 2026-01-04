// ==UserScript==
// @name                  Website helper
// @name:zh-CN            网站好帮手
// @name:zh-TW            网站好帮手
// @namespace             https://github.com/kingphoenix2000/tampermonkey_scripts
// @supportURL            https://github.com/kingphoenix2000/tampermonkey_scripts
// @version               0.2.0
// @author                浴火凤凰(QQ:307053741,油猴脚本讨论QQ群:194885662)
// @description           This script provides a series of small tools to speed up the speed of your visit to the website and improve your work efficiency.
// @description:zh-CN     本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @description:zh-TW     本脚本提供了一系列小工具，在您访问互联网网站的时候加快您访问网站的速度和提高您的工作效率。包括删除服务器重定向(支持全网网站)
// @homepage              https://blog.csdn.net/kingwolf_javascript/
// @include               *
// @grant                 GM_getValue
// @grant                 GM_setValue
// @grant                 GM_registerMenuCommand
// @grant                 GM_setClipboard
// @noframes
// @note                  2020-04-10：添加删除服务器跳转功能。
// @note                  2020-04-12：修改域名解析函数。
// @note                  2020-04-19：增加 回到顶部 功能。
// @note                  2021-09-03：增加 Ctrl+单击 可 复制网页标题和域名 功能。查看当前页面收到了哪些Message消息。
// @downloadURL https://update.greasyfork.org/scripts/391082/Website%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/391082/Website%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.addEventListener("click", function (e) {
        if (e.ctrlKey == true) {
            let title = document.title;
            let domain = location.hostname;
            let str = title + " | " + domain;
            GM_setClipboard(str);
        }
    }, false);
    window.addEventListener("message", function (e) { console.groupCollapsed("当前页面收到Message消息："); console.log(e); console.groupEnd(); }, false);

    let div1 = document.createElement("div");
    div1.id = "returnToTop";
    div1.innerHTML = "回到顶部";
    div1.style.cssText = "display:none;font-size:15px;padding: 10px;bottom: 5px;right: 5px;z-index: 1000;background-color: gray;position: fixed;border-radius: 25px;text-align: center;cursor: pointer;color: #fff;";
    div1.onclick = function () { scrollTo(0, 0); }
    let height = document.documentElement.scrollHeight;
    if (height > 2000) { div1.style.display = "block"; }
    document.body.appendChild(div1);


    let WebSite = JSON.parse(GM_getValue("Phoenix_City_WebSite", false));
    // console.log(WebSite);
    let redirect_URL_list = [];
    if (WebSite) {
        //以下代码为升级版本的兼容性代码
        if (!WebSite.Redirect_URL_List) {
            for (let domain in WebSite) {
                let links = WebSite[domain].removeURLList;
                for (let i = 0; i < links.length; i++) {
                    let url = links[i];
                    if (!redirect_URL_list.includes(url)) {
                        redirect_URL_list.push(url);
                    }
                }
            }
            WebSite = {};
            WebSite.Redirect_URL_List = redirect_URL_list;
            console.log(WebSite);
            GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
        }
    }
    else {
        WebSite = {};
        WebSite.Redirect_URL_List = redirect_URL_list;
    }
    console.log(WebSite);

    let num = 0;
    function removeRedirectURL(msg, links) {
        let len1 = WebSite.Redirect_URL_List.length;
        for (let i = 0; i < links.length; i++) {
            let href = links[i].getAttribute("href");
            if (href.startsWith("http")) {
                for (let j = 0; j < len1; j++) {
                    const url = WebSite.Redirect_URL_List[j];
                    if (href.startsWith(url)) {
                        href = href.replace(url, '');
                        href = decodeURIComponent(href);
                        break;
                    }
                }
                for (let j = 0; j < len1; j++) {
                    const url = WebSite.Redirect_URL_List[j];
                    if (href.startsWith(url)) {
                        href = href.replace(url, '');
                        href = decodeURIComponent(href);
                        break;
                    }
                }
                for (let j = 0; j < len1; j++) {
                    const url = WebSite.Redirect_URL_List[j];
                    if (href.startsWith(url)) {
                        href = href.replace(url, '');
                        href = decodeURIComponent(href);
                        break;
                    }
                }
                if (href.startsWith("http")) {
                    links[i].href = href;
                }
                else {
                    console.log("发现类似重定向，实际上不是重定向的网址： ", links[i].href);
                }
            }
        }
        num = num + links.length;
        // console.log(msg, "目前已经删除重定向的链接数：", num);
    }
    //首先删除已经加载的超链接的重定向
    removeRedirectURL("页面初始化阶段-->", document.links);


    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var mutationObserver = new MutationObserver(function (mutations, instance) {
        //console.log(instance);
        mutations.forEach(function (mutation) {
            let addedNodes = mutation.addedNodes;
            if (addedNodes.length > 0) {
                addedNodes.forEach(function (node) {
                    if (node.nodeType == 1) {
                        removeRedirectURL("页面链接动态加载阶段-->", node.querySelectorAll("a"));
                    }
                });
            }
        });
    });

    // 开始监听页面根元素 HTML 变化。
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    GM_registerMenuCommand("添加重定向链接", () => {
        let url = prompt("链接必须以http或者https开头，并且带有？和=\n类似于：https://link.zhihu.com/?target=", "");
        if (url) {
            if (WebSite.Redirect_URL_List.includes(url)) {
                console.log(`要添加的重定向URL：${url}已经存在。`);
            }
            else {
                WebSite.Redirect_URL_List.push(url);
                GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
                console.log(`重定向URL：${url} 添加成功。`);
            }
        }
    });
    GM_registerMenuCommand("删除重定向链接", () => {
        let url = prompt("链接必须以http或者https开头，并且带有？和=\n类似于：https://link.zhihu.com/?target=", "");
        if (url) {
            let index = WebSite.Redirect_URL_List.indexOf(url);
            if (index == -1) {
                console.log(`找不到要删除的重定向URL：${url}。`);
            }
            else {
                WebSite.Redirect_URL_List.splice(index, 1);
                GM_setValue("Phoenix_City_WebSite", JSON.stringify(WebSite));
                console.log(`重定向URL：${url} 删除成功。`);
            }
        }
    });

})();
