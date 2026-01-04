// ==UserScript==
// @name         翻译插件——去除换行（改）
// @namespace    2240726829@qq.com
// @version      1.0.5
// @description  在谷歌翻译、百度翻译、网易有道翻译、腾讯翻译君的页面上增加了一个“自动/禁止格式化”按钮，用来自动移除从PDF等复制过来的文本中包含的换行、回车；优化连字符问题
// @author       caiguang1997
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/
// @match        https://fanyi.qq.com/*
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @icon         https://translate.google.cn/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/402321/%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%E2%80%94%E2%80%94%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/402321/%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%E2%80%94%E2%80%94%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

// Convert string to web element
function parseDom(arg) {
    var d = document.createElement('div');
    d.innerHTML = arg;
    return d.firstChild;
}

const GOOGLE_TRANSLATE_CN = "translate.google.cn";
const GOOGLE_TRANSLATE = "translate.google.com";
const BAIDU_FANYI = "fanyi.baidu.com";
const YOUDAO_FANYI = "fanyi.youdao.com";
const QQ_FANYI = "fanyi.qq.com";

const FORMAT_CN = "自动格式化";

// Get source input element
function getInputElement(host) {
    const idDict = {
        [GOOGLE_TRANSLATE_CN]: "source",
        [GOOGLE_TRANSLATE]: "source",
        [BAIDU_FANYI]: "baidu_translate_input",
        [YOUDAO_FANYI]: "inputOriginal"
    }

    if(host===QQ_FANYI)
    {
        return document.querySelector("body > div.layout-container > div.textpanel > div.textpanel-container.clearfix > div.textpanel-source.active > div.textpanel-source-textarea > textarea");
    }
    else
    {
        const id = idDict[host];
        return document.getElementById(id);
    }
}

// Format code
function format(elemnt) {
    var txt = elemnt.value;

    //第一步：连字符与换行连用表示单词拼接
    txt = txt.replace(/-\n/g,"");

    //第二步：将(前面一个符号为非句号、问号、感叹号、分号、冒号、换行的)换行符替换为空格
    txt = txt.replace(/(?<![\.?!;:\n])\n/g," ");

    //第三步：上一步可能会增添多余空格，因此，多空格替换为单空格
    txt = txt.replace(/ +/g," ");

    //第四步：将(前面一个符号为句号、问号、感叹号、分号、冒号、换行的)换行符替换为双回车
    txt = txt.replace(/(?<=[\.?!;:])\n+/g,"\n\n");

    elemnt.value = txt;
}

// Create new button
function createButton(host) {
    const elemnt = getInputElement(host);
    var new_button = null;
    switch(host) {
        case GOOGLE_TRANSLATE_CN:
        case GOOGLE_TRANSLATE:
            var FORMAT = "自动格式化";
            var buttonHtml = "<div id='my_format' class='tlid-input-button input-button header-button tlid-input-button-docs text-icon' role='tab' tabindex='-1'><div class='text'>" + FORMAT + "</div></div>"
            new_button = parseDom(buttonHtml);
            new_button.onclick = function() {
                if(document.getElementById('my_format').innerText==="自动格式化") {
                    document.getElementById('my_format').innerText = "禁止格式化";

                    format(elemnt);

                    elemnt.onchange = function () {
                        format(elemnt);
                    }
                }
                else{
                    document.getElementById('my_format').innerText = "自动格式化";
                    elemnt.onchange = function () {};
                }
            };
            break;
        case BAIDU_FANYI:
            var baidu_fanyi_css = "text-align: center; margin-left: 14px; width: 106px; height: 30px; line-height: 30px; font-size: 14px; color: #4395ff; letter-spacing: 2px; background-color: #f9f9f9; border: 1px solid #4395ff; border-radius: 3px";
            new_button = parseDom(`<a id='my_format' href="javascript:" style="${baidu_fanyi_css}">${FORMAT_CN}</a>`);
            new_button.onclick = function() {
                if(document.getElementById('my_format').innerText==="自动格式化") {
                    document.getElementById('my_format').innerText = "禁止格式化";

                    var translate_button = document.querySelector("#translate-button");

                    format(elemnt);
                    translate_button.click();

                    elemnt.onchange = function () {
                        format(elemnt);
                        translate_button.click();
                    }
                }
                else{
                    document.getElementById('my_format').innerText = "自动格式化";
                    elemnt.onchange = function () {};
                }
            };
            break;
        case YOUDAO_FANYI:
            new_button = parseDom(`<a id='my_format' class="fanyi__operations--man clog-js" data-clog="AT_BUTTON_CLICK" data-pos="web.i.top" id="transMan" href="javascript:;"> ${FORMAT_CN} </a>`);
            new_button.onclick = function() {
                if(document.getElementById('my_format').innerText==="自动格式化") {
                    document.getElementById('my_format').innerText = "禁止格式化";

                    var translate_button = document.querySelector("#transMachine");

                    format(elemnt);
                    translate_button.click();

                    elemnt.onchange = function () {
                        format(elemnt);
                        translate_button.click();
                    }
                }
                else{
                    document.getElementById('my_format').innerText = "自动格式化";
                    elemnt.onchange = function () {};
                }
            };
            break;
        case QQ_FANYI:
            new_button = parseDom(`<div id='my_format' class="language-translate-button" node-type="translate_button">${FORMAT_CN}</div>`);
            new_button.onclick = function() {
                if(document.getElementById('my_format').innerText==="自动格式化") {
                    document.getElementById('my_format').innerText = "禁止格式化";

                    var translate_button = document.querySelector("#language-button-group-translate > div");

                    format(elemnt);
                    translate_button.click();

                    elemnt.onchange = function () {
                        format(elemnt);
                        translate_button.click();
                    }
                }
                else{
                    document.getElementById('my_format').innerText = "自动格式化";
                    elemnt.onchange = function () {};
                }
            };
            break;
        default: break;
    }
    return new_button;
}

// Get container
function getContainer(host) {
    var container = null;
    switch(host) {
        case GOOGLE_TRANSLATE_CN:
        case GOOGLE_TRANSLATE:
            container = document.querySelector("body > div.container > div.frame > div.page.tlid-homepage.homepage.translate-text > div.input-button-container > div")
            break;
        case BAIDU_FANYI:
            container = document.querySelector("#main-outer > div > div > div.translate-wrap > div.trans-operation-wrapper.clearfix > div.trans-operation.clearfix");
            break;
        case YOUDAO_FANYI:
            container = document.querySelector("body > div.fanyi > div.fanyi__operations > div.fanyi__operations--left");
            break;
        case QQ_FANYI:
            container = document.querySelector("body > div.layout-container > div.language > div.language-container.clearfix");
            break;
        default: break;
    }
    return container;
}

// Run from this
(function() {
    var host = window.location.host;
    var new_button = createButton(host);
    var container = getContainer(host);
    container.appendChild(new_button);
})();