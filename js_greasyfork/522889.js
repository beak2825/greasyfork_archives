// ==UserScript==
// @name         图怪兽 高清无水印下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持 图怪兽 高清无水印下载
// @author       Freer
// @homepageURL  https://xn--6oq72ry9d5zx.com
// @match        *://ue.818ps.com/v4/*
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01AKUdEM1qP6BQVaYhT_!!6000000005487-2-tps-512-512.png
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522889/%E5%9B%BE%E6%80%AA%E5%85%BD%20%E9%AB%98%E6%B8%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522889/%E5%9B%BE%E6%80%AA%E5%85%BD%20%E9%AB%98%E6%B8%85%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
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
            left: '72px',
            bottom: '68px',
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
            if(!urlPramas.upicId){
                layer.msg('模板未保存，请先保存');
                doSubmit = false;
                return false;
            }
            let url = 'https://818ps.com/api/user-get-templ?picId='+urlPramas.picId+'&upicId='+urlPramas.upicId+'&version_id=undefined';
            fetch(url,{credentials: 'include'})
				.then(response => response.json())
				.then(res => {
					console.log(res);
					fetch('https://xn--6oq72ry9d5zx.com/api/tuguaishou/youhouCreate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                content: JSON.stringify(res),
                                page: getNowPage()
                            })
                            })
                            .then(response => response.json())
                            .then(data => {
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
					doSubmit = false;
				})
				.catch(error => {
					console.error('Error:', error);
					doSubmit = false;
				});
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
            const pageBox = document.querySelector('.pageNum span');
            if(!pageBox){
                return 1;
            }
            return pageBox.textContent.replace("页面", "").trim().split('/')[0];
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
})();