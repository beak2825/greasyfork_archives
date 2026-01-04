// ==UserScript==
// @name         Custom GitLab Style
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Custom GitLab Style!
// @author       Sean
// @match        http://192.168.0.200*
// @match        http://192.168.0.200/*
// @match        http://192.168.0.200/fe3project*
// @icon         http://192.168.0.200/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.min.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @resource     ElementCSS https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466841/Custom%20GitLab%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/466841/Custom%20GitLab%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 注入样式：改变容器宽度,项目描述多行展示
    let injectStyle = ".group-list-tree .group-row-contents .description p { white-space: normal; } .container-limited.limit-container-width { max-width: 1400px } .limit-container-width .info-well {max-width: none;}";

    injectStyle += ".container-fluid.container-limited.limit-container-width .file-holder.readme-holder.limited-width-container .file-content {max-width: none;}"
    injectStyle += 'button:focus {outline-color: transparent !important;}'
    // 添加注入样式
    let extraStyleElement = document.createElement("style");
    extraStyleElement.innerHTML = injectStyle;
    document.head.appendChild(extraStyleElement);

    const fontUrl = 'https://element.eleme.io/2.11/static/element-icons.535877f.woff';

    // 添加样式规则，将字体应用到指定元素上
    GM_addStyle(`
        @font-face {
            font-family: element-icons;
            src: url(${fontUrl}) format("woff");
        }
    `);

    GM_addStyle(GM_getResourceText('ElementCSS'));

    // 改变列表打开链接方式,改为新窗口打开
    let change = false;
    let tryTimes = 3;

    function changeOpenType() {
        if(!change){
            setTimeout(()=> {
                let links = document.querySelectorAll('.description a');
                if(links.length) {
                    for(let i = 0, l = links.length; i < l; i++) {
                        links[i].target = "_blank";
                        if(i === l - 1) {
                            change = true;
                        }
                    }
                } else {
                    changeOpenType();
                }
            }, 1000);
        }
    }

    function stopLinkProp() {
        setTimeout(()=> {
            const links = document.querySelectorAll('.description a');
            for(let i = 0, l = links.length; i < l; i++) {
                links[i].addEventListener('click', ()=> {
                    event.stopPropagation();
                });
            }
        }, 1000);
    }

    window.onload = ()=> {

        var targetDiv = document.querySelector('section');

        if(targetDiv) {
            // 创建一个 Mutation Observer 实例
            var observer = new MutationObserver(function(mutations) {
                // 在这里处理 div 子元素的变化
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes && mutation.addedNodes.length) {
                        change = false;
                        changeOpenType();

                        stopLinkProp();
                    }
                });
            });

            // 配置 Mutation Observer
            var config = { childList: true, subtree: true };

            // 开始观察目标 div 元素
            observer.observe(targetDiv, config);
        }

        const placeholder = document.createElement('div');

        // 创建 Vue 实例并挂载到页面
        const vueInstance = new Vue({
            el: placeholder,
            methods: {
                // 进入管理平台 code pipeline
                manage() {
                    window.open('http://192.168.219.170/code-pipeline')
                }
            },
            template: `<div id="my-ext" style="margin-top:4px;">
              <el-tooltip content="进入 Code Pipeline 管理平台" placement="top" effect="light">
                <el-button type="primary" icon="el-icon-attract" size="small" circle @click="manage"></el-button>
              </el-tooltip>
            </div>`
        });

        // 将占位元素追加到 body 元素中
        document.querySelector('.title-container').appendChild(vueInstance.$el);

        // 修改 placehodler
        const listInput = document.getElementById('group-filter-form-field');
        const listInput2 = document.getElementById('project-filter-form-field');

        if(listInput) {
            listInput.setAttribute("placeholder", "按项目名称、日期、开发者搜索，关键字≥3");
            listInput.style.width = '305px';
        }
        if(listInput2) {
            listInput2.setAttribute("placeholder", "按项目名称、日期、开发者搜索，关键字≥3");
            listInput2.style.width = '305px';
        }
    };

})();