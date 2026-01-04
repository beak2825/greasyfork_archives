// ==UserScript==
// @name         设计去水印增强版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  整合稿定设计去水印和一键高清下载功能
// @author       Combined by Claude
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @grant        unsafeWindow
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01AKUdEM1qP6BQVaYhT_!!6000000005487-2-tps-512-512.png
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523654/%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523654/%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 去水印功能
    const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        set(value) {
            if (value.startsWith('data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAzMDAgMjUwIiBmaWxsPSJub25lIi')) {
                console.log('拦截水印SVG:', value);
                return;
            }
            originalSetSrc.call(this, value);
        },
    });

    // 创建UI容器
    const container = createEl('div', {
        attributes: {
            id: 'gd-enhanced',
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

    // 添加按钮
    const btnContainer = createEl('div', {
        append: true,
        parent: container
    });

    // 高清下载按钮
    createEl('a', {
        attributes: {
            id: 'downSubmit',
            class: 'layui-btn layui-btn-danger',
            href: 'javascript:void(0)',
            onclick: 'getTemplDate()'
        },
        styles: {
            padding: '0',
            width: '100%',
            marginBottom: '2px'
        },
        content: '高清下载',
        append: true,
        parent: btnContainer
    });

    // 清屏按钮
    createEl('a', {
        attributes: {
            id: 'clearScreen',
            class: 'layui-btn layui-btn-normal',
            href: 'javascript:void(0)'
        },
        styles: {
            padding: '0',
            width: '100%',
            margin: '0'
        },
        content: '清屏',
        append: true,
        parent: btnContainer
    });

    // 添加清屏功能
    let isHidden = false;
    document.getElementById('clearScreen').addEventListener('click', function() {
        const elementsToToggle = [
            ...document.querySelectorAll('.resource-station, .right-panel, .main__bottom, .dui-noob-guide-index')
        ];

        if (!isHidden) {
            elementsToToggle.forEach(element => {
                if (element) element.style.display = 'none';
            });
            this.textContent = '恢复';
        } else {
            elementsToToggle.forEach(element => {
                if (element) element.style.display = '';
            });
            this.textContent = '清屏';
        }
        isHidden = !isHidden;
    });

    // 加载layui
    const website = 'https://xn--6oq72ry9d5zx.com';
    createEl('link', {
        attributes: {
            rel: 'stylesheet',
            href: `${website}/static/layui/css/layui.css`
        },
        append: true,
        parent: document.head
    });

    createEl('script', {
        attributes: {
            charset: 'utf8',
            src: `${website}/static/layui/layui.all.js`
        },
        append: true,
        parent: document.body
    });

    // 添加下载相关函数
    createEl('script', {
        attributes: {
            type: 'text/javascript',
        },
        content: `
            var doSubmit = false;
            function getTemplDate(){
                if(doSubmit) return;
                doSubmit = true;
                
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
                        alert(e.message);
                        doSubmit = false;
                    });
            }

            function getUrlParams(url) {
                const urlObj = new URL(url);
                const params = new URLSearchParams(urlObj.search);
                const paramsObj = {};
                for (const [key, value] of params.entries()) {
                    paramsObj[key] = paramsObj[key] === undefined ? value : 
                        Array.isArray(paramsObj[key]) ? [...paramsObj[key], value] : 
                        [paramsObj[key], value];
                }
                return paramsObj;
            }

            function getNowPage(){
                const pageBox = document.querySelector('.dbu-page-indicator');
                if(!pageBox) return 1;
                const titleElement = document.querySelector('.dbu-page-indicator__button__title');
                const spanElement = titleElement.querySelector('span');
                return spanElement.textContent.trim().split('/')[0];
            }
        `,
        append: true,
        parent: document.body
    });

    // 工具函数
    function createEl(tagName, options = {}) {
        const el = document.createElement(tagName);
        
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

        if (options.content !== undefined) {
            if (typeof options.content === 'string') {
                el.textContent = options.content;
            } else if (options.content instanceof Node) {
                el.appendChild(options.content);
            } else if (Array.isArray(options.content)) {
                options.content.forEach(child => el.appendChild(child));
            } else if (typeof options.content === 'function') {
                options.content(el);
            }
        }

        if (options.styles) {
            Object.assign(el.style, options.styles);
        }

        if (options.append && options.parent) {
            options.parent.appendChild(el);
        }

        return el;
    }
})(); 