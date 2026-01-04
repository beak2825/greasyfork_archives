// ==UserScript==
// @name         urlBoost
// @namespace    http://tampermonkey.net/
// @namespace  https://coderschool.cn
// @version      0.32
// @description  对网页的通用增强
// @author       yuexiaojun
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @include            *
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @require      https://update.greasyfork.org/scripts/496027/1382726/zenyBoost.js
// @downloadURL https://update.greasyfork.org/scripts/496025/urlBoost.user.js
// @updateURL https://update.greasyfork.org/scripts/496025/urlBoost.meta.js
// ==/UserScript==


// 调用函数
// openNewWindowWithText();


(function() {
    'use strict';

    // Your code here
    $(function(){
		var target = ".mt-4 h1";
        var download_url_copy = "download-url-copy";
		var copyData = "[{title}]({url})".format({url: document.location, title: $(target).text()});
        ///log(copyData);
		//nextUrl = "{url}?p={p}&ps={ps}".format({url: p_, p:page+1, ps: pageSize});

		//把girlsXpath的href取出来，合并
		var girlsXpath = '.mt-4 h1';
        var ahref=$(girlsXpath).map(function(){
			return $(this).attr("href");
		}).get().join(",");
        var girls = document.location + ',' + ahref;
        ///log(girls);

        //$(target).after("<a target='_blank' class='download-url-copy' data-href='" + girls + "' href='javascript: void(0);'>打包打包</a>");
        //$(target).append("<a target='_blank' class='download-url-copy' data-href='" + copyData + "' href='javascript: void(0);'> &hearts;</a>");
        $(document).on('click', '.download-url-copy', function(e) {
                e.preventDefault();
                GM_setClipboard($(this).data('href'));
                GM_notification({
                    title: '提示',
                    text: '下载地址复制成功！',
                    timeout: 1000});
            });

        //$(document).keypress(function(event){
        //    alert(event.which);
        //    if(event.which == 115){}
        //});

        function getLink(target){
            var target = ".mt-4 h1";
            return $(target).text();
        }
    function GenLink(){
    {
                //GM_setClipboard($('.'+download_url_copy).data('href'));
        var title = "";
        for(var k in [".mt-4 h1"])
        {
            title = $(target).text();
            if(k.length != 0)
                break;
        }
        if(title.length == 0)
            title = $('title').text()
                GM_setClipboard("[{title}]({url})".format({url: document.location, title: title}));
                GM_notification({
                    title: '提示',
                    text: '下载地址复制成功！',
                    timeout: 1000});
            }
    }
    function clearCookies(){
        document.cookie="";
        GM_notification({
                    title: '提示',
                    text: 'Cookies清除成功！',
                    timeout: 1000});
    }
    function GetCookies(){
    {
                //var cookies = document.cookie;
                GM_setClipboard(document.cookie);
                GM_notification({
                    title: '提示',
                    text: 'Cookies复制成功！',
                    timeout: 1000});
            }
    }
    function onAltQ() {
        alert("Alt Q pressed!");
    }
    function CopyCss(){
        openNewWindowWithText(copyElementWithStyles());
        //alert("copy css");
    }
    var nexts = ['下一页', '下一节', '下一章'];
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        // Use https://blog.csdn.net/zs_life/article/details/90522440
        if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 70) { // Ctrl + shift + f
            evt.preventDefault();
            // onAltQ();
            GenLink();
        }
        else if (evt.ctrlKey && evt.shiftKey && evt.altKey && evt.keyCode == 67) { // Ctrl + shift + alt + c
            evt.preventDefault();
            GetCookies();
        }
        else if (evt.ctrlKey && evt.shiftKey && evt.keyCode == 67) { // Ctrl + shift + alt + c
            evt.preventDefault();
            CopyCss();
        }
        else if (evt.ctrlKey && evt.shiftKey && evt.altKey && evt.keyCode == 88) { // Ctrl + shift + alt + x
            evt.preventDefault();
            clearCookies();
            log(evt.key);
        }
        else if (evt.ctrlKey && evt.shiftKey && evt.altKey && evt.keyCode == 67) { // Ctrl + shift + alt + c
            evt.preventDefault();
            alert("Ctrl + shift + alt + c: get cookies\nCtrl + shift + alt + x: clear cookies\nCtrl + shift + f: generate link");
            log(evt.key);
        }
        else if (evt.ctrlKey && evt.keyCode == 39){
            for (var _ in nexts){
                _ = nexts[_]
                var n = $("a:contains('" + _ + "')");
                if (n.length>0){
                    evt.preventDefault();
                    n[0].click();
                    break;
                }
            }
        }
    }

    document.addEventListener('keydown', onKeydown, true);


    });

})();

function getAppliedStyles(elem) {
    const styles = window.getComputedStyle(elem);
    let styleString = "";
    for (let i = 0; i < styles.length; i++) {
        const styleName = styles[i];
        const styleValue = styles.getPropertyValue(styleName);
        styleString += `${styleName}: ${styleValue}; `;
    }
    return styleString;
}

function copyElementWithStyles_1() {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
        console.warn('No element is selected.');
        return;
    }

    // 获取选择的第一个 Range
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");

    container.appendChild(range.cloneContents());

    // 遍历容器中的所有元素并内联样式
    const elements = container.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        elem.style.cssText = getAppliedStyles(elem);
        alert(elem.style.cssText);
    }

    // 创建一个 textarea 元素用于复制操作
    const textarea = document.createElement("textarea");
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    return container.innerHTML;

    textarea.value = container.innerHTML;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    console.log('Selected element\'s HTML and CSS has been copied to the clipboard.');
}

function copyElementWithStyles_2() {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
        alert('No selection found.');
        return;
    }

    // 获取选中内容的第一个 Range
    const range = selection.getRangeAt(0);
    const container = document.createElement('div');

    // 克隆选中的内容
    container.appendChild(range.cloneContents());

    // 应用所有计算后的 CSS 样式到克隆的内容
    const elements = container.getElementsByTagName('*');
    Array.prototype.forEach.call(elements, function(node) {
        const computedStyle = window.getComputedStyle(node);
        let style = '';
        for (let prop of computedStyle) {
            style += `${prop}: ${computedStyle.getPropertyValue(prop)};`;
        }
        node.style.cssText = style;
    });
        const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.value = container.innerHTML;
    // alert(container.innerHTML);

        // 执行复制操作
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }

    return container.innerHTML;
}

function copyElementWithStyles_3(){
    const selection = window.getSelection();
    if (!selection.rangeCount) {
        alert('No selection found.');
        return;
    }

    // 获取选中内容的第一个 Range
    const range = selection.getRangeAt(0);
    const container = document.createElement('div');

    // 克隆选中的内容
    container.appendChild(range.cloneContents());

    // 获取并复制所有相关的 CSS 样式
    const styleSheets = document.styleSheets;
    const cssRules = [];
    const containerElements = container.querySelectorAll('*');

    Array.prototype.forEach.call(styleSheets, (styleSheet) => {
        try {
            if (styleSheet.cssRules) {
                Array.prototype.forEach.call(styleSheet.cssRules, (rule) => {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        Array.prototype.forEach.call(containerElements, (elem) => {
                            if (elem.matches(rule.selectorText)) {
                                cssRules.push(rule.cssText);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.log('Cannot read the css rules from: ', styleSheet.href, e);
        }
    });

    // 创建一个 style 元素并将所有相关 CSS 规则添加到其中
    const styleEl = document.createElement('style');
    styleEl.textContent = cssRules.join(' ');
    container.insertBefore(styleEl, container.firstChild);

    // 创建一个 textarea 来复制内容
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.value = container.innerHTML;
    textarea.select();

    // 执行复制操作
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.error('Oops, unable to copy', err);
    }

    document.body.removeChild(textarea);
    alert('Copied HTML and CSS to clipboard');
    return container.innerHTML;
}



function getAllCssProperties(element) {
    const style = window.getComputedStyle(element);
    const properties = {};
    var r = '';

    // 遍历计算后的样式对象
    for (let i = 0; i < style.length; i++) {
        const propName = style[i];
        properties[propName] = style.getPropertyValue(propName);
        r = r + propName + ': ' + style.getPropertyValue(propName) + ';\n';
    }

    console.log(r);
    return r;
    return properties;
}


function getElementsFromSelection() {
    const selection = window.getSelection();
    const elements = new Set();  // 使用 Set 来避免重复元素

    if (!selection.rangeCount) return [];  // 如果没有选区，则返回空数组

    // 遍历所有的 Range
    for (let i = 0; i < selection.rangeCount; ++i) {
        const range = selection.getRangeAt(i);
        const documentFragment = range.cloneContents();  // 获取 Range 的文档片段
        const childNodes = documentFragment.querySelectorAll("*");  // 提取所有元素

        // 将所有元素添加到 Set 中，自动去重
        childNodes.childElements.forEach(elem => elements.add(elem));
    }

    // 将 Set 转换为 Array 并返回
    return Array.from(elements);
}



function copyElementWithStyles(){
    // const selection = window.getSelection();
    const selectedElements = getElementsFromSelection();


    for (let i = 0; i < selectedElements.rangeCount; ++i) {
        var csss = getAllCssProperties(selectedElements[i]);
        selectedElements[i].innerHtml;
        alert(csss);
        break;
    }

    // 获取选中内容的第一个 Range
    // const range = document.getElementById('artibody');
}