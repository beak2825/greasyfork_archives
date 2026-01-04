// ==UserScript==
// @name         CSDN快捷工具
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  csde 快捷复制、不带版权文字、查看全文等功能
// @author       昊色居士
// @match        *.csdn.net/*
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497778/CSDN%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/497778/CSDN%E5%BF%AB%E6%8D%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {

    /**
     * 复制事件
     */
    function copy_event(button_doc, code_dom) {
        const codeText = code_dom.innerText;
        navigator.clipboard.writeText(codeText)
            .then(()=> {
                button_doc.setAttribute("data-title", "复制成功！")
                setTimeout(()=> button_doc.setAttribute("data-title", "点我复制"), 1000)
            })
            .catch(err => {
                alert("复制失败！");
                console.error("复制失败:", err);
            });
    }

    // 允许不登录复制
    document.querySelector("#content_views").style.setProperty('user-select', 'text', 'important')
    for (const e of document.querySelectorAll('#content_views pre')) {
        e.style.setProperty('user-select', 'text', 'important')
    }
    for (const e of document.querySelectorAll('#content_views pre code')) {
        e.style.setProperty('user-select', 'text', 'important')
    }
    $("#content_views").unbind()

    // 复制不带版权
    var copy_element = document.querySelector('main .blog-content-box')
    csdn.copyright.init(copy_element, '')

    // 登录后复制按钮 data-title 改成随便复制并删除点击事件

    document.querySelectorAll('#content_views pre').forEach(
        doc => {
            let button_doc = doc.querySelector(".hljs-button")
            let code_doc = doc.querySelector("code")

            button_doc.setAttribute("data-title", "点我复制")
            code_doc.setAttribute("onclick", undefined)
            button_doc.setAttribute("onclick", undefined)
            button_doc.onclick = () => copy_event(button_doc, code_doc)
        }
    )

    // 不关注博主即可看全文
    $(".hide-article-box").hide()
    $("div.article_content").removeAttr("style")
})();