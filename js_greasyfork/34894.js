// ==UserScript==
// @name         EX煎蛋
// @namespace    https://greasyfork.org/zh-CN/scripts/34894
// @version      2.1.1
// @description  煎蛋直接显示原图，GIF(MP4)自动加载，吐槽自动加载，页面重新排版，全屏双列排版（左侧图片右侧吐槽），适配新版PC端
// @author       dazzulay
// @license       MIT
// @match        *://*.jandan.net/*
// @run-at        document-body
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/34894/EX%E7%85%8E%E8%9B%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/34894/EX%E7%85%8E%E8%9B%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置菜单
    // 默认设置
    const defaultSettings = {
        autoLoadImages: true,
        autoLoadComments: true,
        wideScreenLayout: true
    };

    // 获取当前设置
    function getSettings() {
        return {
            autoLoadImages: GM_getValue('autoLoadImages', defaultSettings.autoLoadImages),
            autoLoadComments: GM_getValue('autoLoadComments', defaultSettings.autoLoadComments),
            wideScreenLayout: GM_getValue('wideScreenLayout', defaultSettings.wideScreenLayout)
        };
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue('autoLoadImages', settings.autoLoadImages);
        GM_setValue('autoLoadComments', settings.autoLoadComments);
        GM_setValue('wideScreenLayout', settings.wideScreenLayout);
    }

    // 创建设置面板
    function createSettingsPanel() {
        const settings = getSettings();

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '5px';
        panel.style.padding = '15px';
        panel.style.zIndex = '9999';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.width = '250px';

        const title = document.createElement('h3');
        title.textContent = 'EX煎蛋设置';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.color = '#333';
        panel.appendChild(title);

        // 自动加载图片选项
        const imageCheckbox = createCheckbox(
            'autoLoadImages',
            '自动加载原图',
            settings.autoLoadImages
        );
        panel.appendChild(imageCheckbox);

        // 自动加载吐槽选项
        const commentCheckbox = createCheckbox(
            'autoLoadComments',
            '自动加载吐槽',
            settings.autoLoadComments
        );
        panel.appendChild(commentCheckbox);

        // 宽屏双列排版选项
        const layoutCheckbox = createCheckbox(
            'wideScreenLayout',
            '全屏双列排版',
            settings.wideScreenLayout
        );
        panel.appendChild(layoutCheckbox);

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.style.marginTop = '15px';
        saveButton.style.padding = '5px 10px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '3px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = function() {
            const newSettings = {
                autoLoadImages: document.getElementById('autoLoadImages').checked,
                autoLoadComments: document.getElementById('autoLoadComments').checked,
                wideScreenLayout: document.getElementById('wideScreenLayout').checked
            };
            saveSettings(newSettings);
            //panel.style.display = 'none';
            applySettings(newSettings);
            panel.remove();
        };
        panel.appendChild(saveButton);

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginLeft = '10px';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            // panel.style.display = 'none';
            panel.remove();
        };
        panel.appendChild(closeButton);

        document.body.appendChild(panel);
        return panel;
    }

    // 创建复选框元素
    function createCheckbox(id, label, checked) {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.style.marginRight = '8px';

        const labelElement = document.createElement('label');
        labelElement.htmlFor = id;
        labelElement.textContent = label;
        labelElement.style.cursor = 'pointer';

        container.appendChild(checkbox);
        container.appendChild(labelElement);

        return container;
    }

    // 应用设置（这里只是示例，实际功能需要根据你的需求实现）
    function applySettings(settings) {
        // 这里添加根据设置改变页面行为的代码
        // 例如：
        // if (settings.autoLoadImages) { ... }
        // if (settings.autoLoadComments) { ... }
        // if (settings.wideScreenLayout) { ... }
        window.location.reload()
    }


    // 注册Tampermonkey菜单命令
    GM_registerMenuCommand('打开设置', function() {
        const panel = createSettingsPanel();
        panel.style.display = 'block';
    });


    const settings = getSettings()


    // 目标css
    let targetClass = '.comment-row.p-2';
    let imgContainerClass = '.img-container';
    let commentFuncClass = '.comment-func';

    // 观察变动的节点
    function obbody(){
        // 选择需要观察变动的节点
        const targetNode = document.body;

        // 观察器的配置（需要观察什么变动）
        const config = {
            childList: true, // 观察该元素的子元素新增或者删除
            subtree: true, //该元素的所有子元素新增或者删除
        };

        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            mutationsList.forEach((mutation) => {
                // console.log(mutation)

                // 检查所有新增的节点
                mutation.addedNodes.forEach((node) => {
                    // 如果是元素节点（而不是文本节点等）
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查当前节点是否匹配目标选择器
                        if (node.matches(targetClass)) {
                            handleTargetElement(node);
                        }
                        // 检查当前节点的所有子元素（包括深层嵌套）
                        const nestedTargets = node.querySelectorAll(targetClass);
                        nestedTargets.forEach(handleTargetElement);
                    }
                });

                // 处理img
                if (settings.autoLoadImages) {
                    if (mutation.target.matches(imgContainerClass)){
                        let element = mutation.target;
                        if(mutation.addedNodes.length > 0){
                            changeImg(element)
                        }
                    }
                }
            });
        };

        // 创建一个观察器实例并传入回调函数
        const ob = new MutationObserver(callback);
        // 开始观察目标节点
        ob.observe(targetNode, config);
    }
    obbody()


    // 先运行一次，防止后台打开标签页
    let targets = document.querySelectorAll(targetClass);
    targets.forEach(handleTargetElement);

    // 处理targetClass
    function handleTargetElement(tagert) {
        if (settings.autoLoadImages) {
            loadImg(tagert)
        }

        if (settings.autoLoadComments) {
            loadTucao(tagert)
        }
    }

    // 监听滚动加载图片
    function loadImg(target){
        let imgContainers = target.querySelectorAll(imgContainerClass)
        imgContainers.forEach((element) => {
            // 要执行的方法
            function handleCommentFuncAppear(element) {
                // 在这里添加你的逻辑

                let imglink = element.querySelector('.img-link')
                if (imglink) {
                    let base = imglink
                    if(!imglink.parentElement.matches(imgContainerClass)){
                        base = imglink.parentElement
                    }
                    let newImg = document.createElement('img');
                    newImg.className = 'exjdimg';
                    newImg.style.display = 'none';
                    base.after(newImg);

                    let video = document.createElement('video');
                    video.controls = true;
                    video.autoplay = true;
                    video.loop = true;
                    video.muted = true;
                    video.className = 'exjdvideo';
                    video.style.display = 'none';
                    newImg.after(video);
                }
            }

            // 设置Intersection Observer
            const ob = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        handleCommentFuncAppear(entry.target);
                        // 如果需要只执行一次，可以取消观察
                        ob.unobserve(entry.target);
                        ob.disconnect();
                    }
                });
            }, {
                threshold: 0
            });

            ob.observe(element);
        })
    }

    // 替换图片
    function changeImg(element){
        let imglink = element.querySelector('.img-link')
        if(!imglink) return;

        let imglinkHref = imglink.getAttribute('href');
        if(!imglinkHref) return;


        // 隐藏图片
        let img = element.querySelectorAll('img');
        img.forEach(item => {
            item.style.setProperty('display', 'none', 'important');
        })

        // 隐藏overlay
        let gifOverlay = element.querySelectorAll('.gif-overlay');
        gifOverlay.forEach(item => {
            item.style.setProperty('display', 'none', 'important');
        })

        // 隐藏视频
        let video = element.querySelectorAll('video');
        video.forEach(item => {
            item.style.setProperty('display', 'none', 'important');
        })


        if (imglinkHref.toLowerCase().endsWith('.mp4')) {
            // 视频
            let exjdvideo = element.querySelector('.exjdvideo');
            if(exjdvideo){
                exjdvideo.setAttribute('src', imglink);
                exjdvideo.style.setProperty('display', '');
            }
        }else{
            // 图片
            let exjdimg = element.querySelector('.exjdimg');
            if(exjdimg){
                exjdimg.setAttribute('src', imglink);
                exjdimg.style.setProperty('display', '');
            }
        }

    }

    const observerMapTucao = new WeakMap();

    // 监听滚动加载吐槽
    function loadTucao(target){
        let element = target.querySelector(commentFuncClass);

        // 要执行的方法
        function handleCommentFuncAppear(element) {
            // 在这里添加你的逻辑
            const targetSpan = element.querySelector('span:nth-child(3)');
            if (targetSpan) {
                let cucao = element.parentElement.querySelector('.tucao-container');
                if (!cucao) {
                    //console.log('找到目标 span，模拟点击:', targetSpan);
                    targetSpan.click(); // 触发点击事件
                }
            } else {
                //console.warn('未找到 span:nth-child(3)', element);
            }
        }

        // 设置Intersection Observer
        if (element) {
            if (!observerMapTucao.has(element)) {
                observerMapTucao.set(element, new Set());
                const ob = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            handleCommentFuncAppear(entry.target);
                            // 如果需要只执行一次，可以取消观察
                            //ob.unobserve(entry.target);
                            //ob.disconnect();
                        }
                    });
                }, {
                    threshold: 0
                });
                ob.observe(element);
            }
        }
    }

    // 宽屏双列排版
    if (settings.wideScreenLayout) {
        GM_addStyle(`
.wrapper{
    max-width: 100%;
}
.container{
    max-width: 100%;
}

.container main{
    width: auto;
    flex: 1;
}

.container aside{
    width: 20%;
    min-width: 200px;
}

.comment-row.p-2,
#comments .comment-row.p-2 > div{
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    width: 100%;
}

.comment-row.p-2 > .comment-meta,
#comments .comment-row.p-2 > div > .comment-meta {
    width: 50%;
    order: 1;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
}

.dark-model  .comment-row.p-2 > .comment-meta,
.dark-model  #comments .comment-row.p-2 > div > .comment-meta {
    background-color: var(--bs-body-bg);
}

.comment-row.p-2 > .comment-content,
#comments .comment-row.p-2 > div > .comment-content {
    width: 50%;
    order: 3;
    position: sticky;
    top: 35px;
}

.comment-row.p-2 > .comment-func,
#comments .comment-row.p-2 > div > .comment-func {
    width: 50%;
    order: 2;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
}

.dark-model  .comment-row.p-2 > .comment-func,
.dark-model #comments .comment-row.p-2 > div > .comment-func {
    background-color: var(--bs-body-bg);
}

.comment-row.p-2 > .tucao-container,
#comments .comment-row.p-2 > div > .tucao-container {
    width: 50%;
    order: 4;
    position: sticky;
    top: 35px;
    max-height: calc(100vh - 35px);
    overflow-y: auto;
}

.tucao-popup{
    z-index:5;
}
    `)
    }



})();