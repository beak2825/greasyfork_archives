// ==UserScript==
// @name         Bilibili 笔记功能扩展
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  恢复Bilibili笔记中被隐藏的功能
// @author       as042971
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440331/Bilibili%20%E7%AC%94%E8%AE%B0%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/440331/Bilibili%20%E7%AC%94%E8%AE%B0%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

class XMLHttp {
    request = function (param) { };
    response = function (param) { };
    filterData = function(args, data) { return data };
}
//拦截XMLHttpRequest
(function() {
    'use strict';
    const initXMLHttpRequest = function(http) {
        let open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            let send = this.send;
            let _this = this;
            let post_data = [];
            this.send = function (...data) {
                post_data = http.filterData(args, data);
                return send.apply(_this, data);
            };
            // 请求前拦截
            http.request(args);

            this.addEventListener(
                "readystatechange",
                function () {
                    if (this.readyState === 4) {
                        let config = {
                            url: args[1],
                            status: this.status,
                            method: args[0],
                            data: post_data,
                        };
                        // 请求后拦截
                        http.response({ config, response: this.response });
                    }
                },
                false
            );
            return open.apply(this, args);
        };
    }

    const injectPostMsg = function(raw_str, customTitle, customAbstract) {
        let params = new URLSearchParams(raw_str);
        if (customAbstract) {
            params.set('summary', customAbstract);
        }
        if (customTitle) {
            params.set('title', customTitle);
        }
        params.set('cls', '0');
        return params.toString();
    }

    const inject = function(toolbar) {
        let quill = document.querySelector('.ql-container').__quill;
        let icons = quill.constructor.import('ui/icons');
        // Align
        let alignIcons = icons.align;
        let span = document.createElement('select');
        span.setAttribute('class', 'ql-align ql-bar');
        span.setAttribute('labeltooltip','对齐方式');
        [false, 'center', 'right', 'justify'].forEach(value => {
            const option = document.createElement('option');
            if (value === false) {
                option.setAttribute('selected', 'selected');
            } else {
                option.setAttribute('value', value);
            }
            span.appendChild(option);
        });
        toolbar.insertBefore(span, toolbar.childNodes[toolbar.childNodes.length-2]);
        let Picker = quill.constructor.import('ui/icon-picker');
        let picker = new Picker(span, alignIcons);
        picker.update();
        quill.theme.pickers.push(picker);
        quill.getModule('toolbar').attach(span);

        // Buttons
        let exButtons = [
            {id: 'link', icon: icons.link, tooltip: '标记为链接'},
            {id: 'video', icon: icons.video, tooltip: '嵌入视频'},
            {id: 'code-block', icon: icons.code, tooltip: '标记为代码块'}
        ];
        exButtons.forEach(input =>{
            let button = document.createElement('button');
            button.setAttribute('class', 'ql-' + input.id + ' ql-bar');
            button.setAttribute('type', 'button');
            button.setAttribute('labeltooltip', input.tooltip);
            button.innerHTML = input.icon;
            toolbar.insertBefore(button, toolbar.childNodes[toolbar.childNodes.length-1]);
            quill.getModule("toolbar").attach(button);
        });

        // abstract
        let noteModifyContainer = document.createElement('div');
        noteModifyContainer.setAttribute('style', 'margin:0 10px 10px');
        let noteTitle = document.createElement('input');
        noteTitle.setAttribute('style', 'width:100%');
        noteTitle.setAttribute('placeholder', '自定义笔记生成专栏的标题...');
        let noteAbstract = document.createElement('textarea');
        noteAbstract.setAttribute('rows', '3');
        noteAbstract.setAttribute('style', 'width:100%');
        noteAbstract.setAttribute('placeholder', '自定义笔记发布时评论区显示的内容...');
        noteModifyContainer.appendChild(noteTitle);
        noteModifyContainer.appendChild(noteAbstract);
        toolbar.parentNode.insertBefore(noteModifyContainer, toolbar.nextSibling);

        // inject message
        let http = new XMLHttp();
        http.filterData = (args, data) => {
            if (args[0]=='POST' && args[1]=='https://api.bilibili.com/x/note/add') {
                data[0] = injectPostMsg(data[0], noteTitle.value, noteAbstract.value);
            }
            return data;
        }
        initXMLHttpRequest(http);
    };
    let app = document.getElementById('app');
    let observerOptions = {
      childList: true,
      attributes: false,
      subtree: true
    };
    let observer = new MutationObserver((mutation_records) => {
        let toolbar = document.querySelector('.ql-toolbar');
        if (toolbar && toolbar.id != 'hidden-toolbar') {
            inject(toolbar);
            observer.disconnect();
        }
    });
    observer.observe(app, observerOptions);
})();
