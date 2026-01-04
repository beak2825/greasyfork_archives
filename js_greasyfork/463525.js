// ==UserScript==
// @name         arXiv论文一键翻译
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  arXiv论文一键翻译| arXiv paper one-click translation
// @author       xx025
// @homepage     https://github.com/xx025/strawberry
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463525/arXiv%E8%AE%BA%E6%96%87%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/463525/arXiv%E8%AE%BA%E6%96%87%E4%B8%80%E9%94%AE%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==


let templates = [
    {
        name: '有道arxiv翻译[推荐]',
        url: `https://fanyi.youdao.com/trans/#/home?keyfrom=fanyiweb&url=%s&type=undefined`,
        need_arg: 'source_url'
    },
    {
        name: '有道翻译',
        url: `http://webtrans.yodao.com/webTransPc/index.html#/?url=%s&from=auto&to=auto&type=1`,
        need_arg: 'html_url'
    },
    // {
    //     name: '百度翻译',
    //     url: `https://fanyi.baidu.com/transpage?query=%s&source=url&ie=utf8&from=auto&to=zh&render=1`,
    //     need_arg: 'html_url'
    // }
];



(function () {
    'use strict';

    function generate_url(Ourl, template) {
        let value = ''
        let base_url = template.url
        if (template.need_arg == 'source_url') {
            value = Ourl.source_url
        }
        else if (template.need_arg == 'html_url') {
            value = Ourl.html_url
        }
        return base_url.replace(/%s/g, value);
    }

    function create_Ourl(url) {

        // url_demo='https://arxiv.org/abs/2203.01927'
        // html_url_demo=`https://ar5iv.labs.arxiv.org/html/2203.01927`
        let Ourl = Object()
        Ourl.source_url = url
        Ourl.html_url = `https://ar5iv.labs.arxiv.org/html/${url.split('/').pop()}`
        return Ourl
    }


    function insert_html(name, url) {

        // 获取要在其后添加新元素的元素
        const list = document.querySelector(".full-text ul");
        // 点击下载按钮，在新标签中打开
        list.querySelector('.abs-button.download-pdf').target = '_blank'
        // 创建新的 li 元素
        const newLi = document.createElement("li");
        newLi.style.color = "black";
        // 创建 a 元素，并设置其 href 和 class 属性
        const newLink = document.createElement("a");
        newLink.href = url;
        newLink.className = "abs-button download-format";
        newLink.target = "_blank";// 在新标签中打开链接
        newLink.style.color = "#8cbd18";
        // 设置 a 元素的文本内容
        const linkText = document.createTextNode(name);
        newLink.appendChild(linkText);
        // 将 a 元素添加到新的 li 元素中
        newLi.appendChild(newLink);
        // 将新的 li 元素添加到列表中
        list.appendChild(newLi);
    }


    let Ourl = create_Ourl(window.location.href)
    for (let template of templates) {
        let url = generate_url(Ourl, template)
        insert_html(template.name, url)
    }

})();