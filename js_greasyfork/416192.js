// ==UserScript==
// @name         回车去除
// @description  自动移除从PDF等复制的文本中包含的换行符，支持谷歌翻译，百度翻译，有道翻译，DeepL翻译，必应翻译，腾讯翻译君
// @version      3.1
// @author       Pencilheart
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/
// @match        https://www.deepl.com/translator
// @match        https://cn.bing.com/translator/*
// @match        https://fanyi.qq.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg==
// @namespace https://greasyfork.org/users/703434
// @downloadURL https://update.greasyfork.org/scripts/416192/%E5%9B%9E%E8%BD%A6%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/416192/%E5%9B%9E%E8%BD%A6%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

javascript: document.getElementsByTagName('textarea')[0].addEventListener('input',
    function () 
    {
        var txt = "";
        txt = document.getElementsByTagName('textarea')[0].value;
        for (var i = 0; i < txt.length; i++) 
        {
            if (txt.indexOf("\n"))
            txt = txt.replace(/(?<![\.?!;:\n])\n/g," ");
        }
        document.getElementsByTagName('textarea')[0].value = txt;
    }
);

