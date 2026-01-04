// ==UserScript==
// @name         稿定设计 一键高清无水印下载
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  🔥【2025.1.22】稿定设计去水印 + 一键高清无水印原下载、支持长图、无需截图直接导出
// @author       Freer
// @homepageURL  https://xn--6oq72ry9d5zx.com
// @match        *://www.gaoding.com/editor/design*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01AKUdEM1qP6BQVaYhT_!!6000000005487-2-tps-512-512.png
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522098/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%20%E4%B8%80%E9%94%AE%E9%AB%98%E6%B8%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522098/%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%20%E4%B8%80%E9%94%AE%E9%AB%98%E6%B8%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const website = 'https://xn--6oq72ry9d5zx.com';
    createEl('link', {
        attributes:{
            rel: 'stylesheet',
            href: `${website}/static/layui/css/layui.css`
        },
        append: true,
        parent: document.head
    });
    const layuiDom = createEl('script', {
        attributes:{
            charset: 'utf8',
            src: `${website}/static/layui/layui.all.js`
        },
        append: true,
        parent: document.body
    });

    const container = createEl('div', {
        attributes:{
            id: 'freer',
        },
        styles: {
            position: 'fixed',
            left: '0',
            bottom: '0',
            width: '72px',
            overflow: 'hidden',
            'z-index': 9999
        },
        append: true,
        parent: document.body
    });

    const freerBody = createEl('div', {
        styles: {
        },
        append: true,
        parent: container
    });
    const goDown = createEl('a', {
        attributes:{
            id: 'downSubmit',
            class: 'layui-btn layui-btn-danger',
            href: 'javascript:void(0)',
            onclick: "getTemplDate()"
        },
        styles: {
            padding: '0',
            width: '100%'
        },
        content: '高清下载',
        append: true,
        parent: freerBody
    });

    const goHome = createEl('a', {
        attributes:{
            class: 'layui-btn layui-btn-normal',
            href: 'javascript:void(0)',
        },
        styles: {
            padding: '0',
            width: '100%',
            margin: '0'
        },
        content: '插件主页',
        append: true,
        parent: freerBody
    });
    createEl('script', {
        attributes:{
            type: 'text/javascript',
        },
        content: `
        var doSubmit = false;
        function getTemplDate(){
            if(doSubmit == true){
                return;
            }
            doSubmit = true;
            console.log(window.location.href);
            let urlPramas = getUrlParams(window.location.href);
            if(!urlPramas.mode || urlPramas.mode != 'user'){
                layer.msg('模板未保存，请先保存');
                doSubmit = false;
                return false;
            }
            let url = 'https://www.gaoding.com/api/tb-dam/v2/editors/materials/'+urlPramas.id+'/info';
            window.__apiService.instance._basicRequest({url:url})
                .then(function(res){
                    if(res.status == 200){
                        console.log(res.data.content_url)
                        fetch('https://xn--6oq72ry9d5zx.com/api/gaoding/youhouCreate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                link: res.data.content_url,
                                page: getNowPage()
                            })
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                window.open(data.data.url, '_blank');
                                layer.open({
                                    title: '提示',
                                    btn: ['下载图片'],
                                    content: data.msg,
                                    yes: function(index, layero){
                                        window.open(data.data.url, '_blank');
                                    }
                                });
                                doSubmit = false;
                            })
                            .catch(error => console.error('Error:', error));
                    }
                })
                .catch(function(e){
                    alert(e.message)
                    doSubmit = false;
                })
        }
        function getUrlParams(url) {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const paramsObj = {};
            for (const [key, value] of params.entries()) {
                if (paramsObj[key] === undefined) {
                    paramsObj[key] = value;
                } else if (Array.isArray(paramsObj[key])) {
                    paramsObj[key].push(value);
                } else {
                    paramsObj[key] = [paramsObj[key], value];
                }
            }
            return paramsObj;
        }
        function getNowPage(){
            const pageBox = document.querySelector('.dbu-page-indicator');
            if(!pageBox){
                return 1;
            }
            const titleElement = document.querySelector('.dbu-page-indicator__button__title');
            const spanElement = titleElement.querySelector('span');
            return spanElement.textContent.trim().split('/')[0];
        }
        `,
        append: true,
        parent: document.body
    });
    layuiDom.addEventListener('load', ()=>{first()});
    goHome.addEventListener('click', gohome);
    function first(){
        if(localStorage.getItem('openFirst') == 'true') return;
        layer.open({
            title: '提示',
            content: '欢迎使用本插件，该插件仅供学习使用，商用请支持正版。<br /><font color="red">插件按钮在页面左下角</font>',
            yes: function(index, layero){
                localStorage.setItem('openFirst', true);
                layer.close(index);
            }
        });
    }
    function getTemplDate(){
        //window.__apiService.instance._basicRequest({url:'https://www.gaoding.com/api/tb-dam/v2/editors/materials/30801822060751027/info'})
    }
    function gohome(){
        window.open(website, '_blank');
    }
    function createEl(tagName, options = {}) {
        const el = document.createElement(tagName);

        // 设置属性
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                if (key === 'class') {
                    el.classList.add(...value.split(' '));
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        el.dataset[dataKey] = dataValue;
                    });
                } else {
                    el.setAttribute(key, value);
                }
            });
        }

        // 设置内容
        if (options.content !== undefined) {
            if (typeof options.content === 'string') {
                el.textContent = options.content;
            } else if (options.content instanceof Node) {
                el.appendChild(options.content);
            } else if (Array.isArray(options.content)) {
                options.content.forEach(child => el.appendChild(child));
            } else if (typeof options.content === 'function') {
                options.content(el); // 假设这是一个渲染函数，接收新创建的元素作为参数
            }
        }

        // 设置样式
        if (options.styles) {
            Object.assign(el.style, options.styles);
        }

        // 自动追加到父元素
        if (options.append && options.parent) {
            options.parent.appendChild(el);
        }

        return el;
    }
    function getUrlParams(url) {
        const urlObj = new URL(url);
        const params = new URLSearchParams(urlObj.search);
        const paramsObj = {};
        for (const [key, value] of params.entries()) {
            if (paramsObj[key] === undefined) {
                paramsObj[key] = value;
            } else if (Array.isArray(paramsObj[key])) {
                paramsObj[key].push(value);
            } else {
                paramsObj[key] = [paramsObj[key], value];
            }
        }
        return paramsObj;
    }
    const blockedImageReplacement = 'data:image/webp;base64,UklGRpYAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAA/A/iWkAANwAP7lagAAUFNBSU4AAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQoAAAAAAAMAAAAAj/wAAAAAAAAOEJJTQRDAAAAAAAOUGJlVwEQAAYAAAAAAAA=';
    const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set(value) {
            if (value.startsWith('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAzMDAgMjUwIiBmaWxsPSJub25lIi')) {
            console.log('Intercepted SVG:', value);
            originalSetSrc.call(this, blockedImageReplacement);
            return;
            }
            originalSetSrc.call(this, value);
        },
    });
})();