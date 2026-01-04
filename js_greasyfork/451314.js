// ==UserScript==
// @name         微软文档中英文切换
// @version      1.3
// @description  在微软文档的右侧加一个快速切换中英文的按钮
// @match        https://*.microsoft.com/zh-cn/*
// @match        https://*.microsoft.com/zh-CN/*
// @match        https://*.microsoft.com/en-us/*
// @match        https://*.microsoft.com/zh-tw/*
// @icon         https://www.microsoft.com/favicon.ico
// @run-at       document-body
// @namespace    https://greasyfork.org/users/728259
// @downloadURL https://update.greasyfork.org/scripts/451314/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%B8%AD%E8%8B%B1%E6%96%87%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/451314/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E4%B8%AD%E8%8B%B1%E6%96%87%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    var href = window.location.href;
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.top = '25vh';
    div.style.right = '0';

    var button = document.createElement('button');
    button.type='button';
    button.style.height = '2.5em';
    button.style.width = '5em';
    button.style.opacity = '0.4';
    button.style.borderStyle = 'none';

    if(href.match(/\/en-us\//i)){
        button.innerText = '中文';
        button.onclick = () => {
            window.location.href = href.replace(/\/en-us\//i, "/zh-cn/");
        };
    }
    else if (href.match(/\/zh-cn\//i))
    {
        button.innerText = '英文';
        button.onclick = () => {
            window.location.href = href.replace(/\/zh-cn\//i, "/en-us/");
        };
    }
    else if (href.match(/\/zh-tw\//i))
    {
        button.innerText = '英文';
        button.onclick = () => {
            window.location.href = href.replace(/\/zh-tw\//i, "/en-us/");
        };
    }

    div.appendChild(button);
    document.body.appendChild(div);
})();