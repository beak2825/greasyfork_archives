// ==UserScript==
// @name         【夸克百科】编辑增强
// @namespace    http://tampermonkey.net/
// @version      2025/11/26-20:37:34
// @description  【夸克百科】编辑增强!
// @author       You
// @match        https://baike.quark.cn/editor/create?model=*
// @match        https://baike.quark.cn/editor/create?model=*
// @match        https://baike.quark.cn/dashboard/contents
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/498586/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E7%BC%96%E8%BE%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/498586/%E3%80%90%E5%A4%B8%E5%85%8B%E7%99%BE%E7%A7%91%E3%80%91%E7%BC%96%E8%BE%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 总容器元素ID
    const createMainElementSelector = "#main-add-div";
    const createMainElementId = "main-add-div";
    // 编辑器元素
    const editorApplicationSelector = "body div.app section main div.content-body div.baike-editor div div.editor-application";
    // logo元素
    const logoWrapSelector = ".header-section .logo-wrap";



    //*************************************************************************************
    //----------------------------------------全局辅助函数
    //*************************************************************************************
    // 右下按键样式
    // 使用您提供的模板（稍作改进）
    function addButton(innerHTML, bottom, right, where, onClick) {
        var mybutton = document.createElement("div");
        where.appendChild(mybutton);
        mybutton.id = "editor-btn-" + innerHTML;
        mybutton.innerHTML = innerHTML;
        mybutton.style.position = "fixed";
        mybutton.style.bottom = bottom;
        mybutton.style.right = right;
        mybutton.style.width = "50px";
        mybutton.style.height = "45px";
        mybutton.style.background = "#00FF00";
        mybutton.style.opacity = "0.85";
        mybutton.style.color = "white";
        mybutton.style.textAlign = "center";
        mybutton.style.lineHeight = "45px";
        mybutton.style.fontSize = "30px";
        mybutton.style.cursor = "pointer";
        mybutton.style.zIndex = "999999";
        mybutton.style.borderRadius = "8px";
        mybutton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        mybutton.style.transition = "all 0.3s";

        // 悬停效果
        mybutton.onmouseover = () => {
            mybutton.style.opacity = "1";
            mybutton.style.transform = "scale(1.05)";
        }
        mybutton.onmouseout = () => {
            mybutton.style.opacity = "0.85";
            mybutton.style.transform = "scale(1)";
        }

        mybutton.onclick = onClick;
    }

    // 使用模板（稍作改进）
    function createMainElement() {
        let hasTag = document?.querySelector(createMainElementSelector);
        if(hasTag){
            return;
        }

        // 创建body下div容器
        const mainDiv = document.createElement("div");
        mainDiv.id = createMainElementId;
        document.body.appendChild(mainDiv);
    }

    // 监听元素出现并执行回调
    function watchElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) return callback(element);
        console.log('callback(element)');

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        return observer;
    }


    // 监听元素变化并执行回调
    const observeElement = (selector, callback, options = {childList: true, subtree: true}) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const observer = new MutationObserver(callback);
        observer.observe(el, options);
        return observer;
    };

    // 监听属性变化
    const observeAttribute = (selector, attribute, callback) => {
        return observeElement(selector, callback, {
            attributes: true,
            attributeFilter: [attribute],
            subtree: true
        });
    };

    //*************************************************************************************
    //----------------------------------------编辑页面函数
    //*************************************************************************************


    // 将模块下面的按钮置于顶层
    function checkAndBringToFront() {
        const buttonsWrap = document.querySelector("div.modal-add-common-imagetext > div.add-imagetext-type1 > div.buttons-wrap");
        if (buttonsWrap) {
            buttonsWrap.style.position = "absolute";
            buttonsWrap.style.top = "0";
            buttonsWrap.style.left = "0";
            buttonsWrap.style.zIndex = "9999";
        }
    }

    // 提交按钮修改
    function createFloatingButton() {
        // 找到需要悬浮的按钮
        var submitButton = document.querySelector(logoWrapSelector);

        if (submitButton) {
            submitButton.remove();
        }
    }

    // 原有空格修改，以免影响 ctrl+f 功能
    function createBasicSpace() {
        // 神总结
        var spanSzj = document.querySelector('*[data-testid="cangjie-placeholder"]');
        if (spanSzj) {
            spanSzj.innerText = spanSzj.innerText.trim();
        }

        // 参考资料
        var spanRef = document.querySelectorAll('.references .reference-item');
        spanRef.forEach(function(item) {
            // 找到包含空格和点的文本节点
            const textNodes = item.querySelectorAll('a.url-link');
            textNodes.forEach(function(link) {
                // 获取a标签后面的兄弟节点
                let nextSibling = link.nextSibling;

                while(nextSibling) {
                    if (nextSibling.nodeType === Node.TEXT_NODE) {
                        // 移除所有空格
                        nextSibling.textContent = nextSibling.textContent.replace(/\s+/g, '');
                    }
                    nextSibling = nextSibling.nextSibling;
                }
            });
        });

    }


    // 页面滚动按钮
    function addEditorControlButtons() {
        // 获取编辑器元素
        const editor = document.querySelector(editorApplicationSelector);
        if (!editor) {
            console.error("编辑器元素未找到");
            return;
        }

        // 创建"回顶"按钮 - 滚动到编辑器顶部▲🔼⬆🔝⏏⬆️⏏️
        createMainElement();
        if(!document.querySelector("#editor-btn-🔝")){
            addButton("🔝", "80px", "90px", document.querySelector(createMainElementSelector), function() {
                editor.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }


        // 创建"到底"按钮 - 滚动到编辑器底部🔚
        createMainElement();
        if(!document.querySelector("#editor-btn-🔚")){
            addButton("🔚", "80px", "20px", document.querySelector(createMainElementSelector), function() {
                editor.scrollTo({ top: editor.scrollHeight, behavior: 'smooth' });
            });
        }

    }

    // 模块查看
    function findAndToggleModule() {
        // 获取所有具有data-module-id属性的元素
        // const modules = document.querySelectorAll('*[data-module-id] div[class*="card-inner"]');
        const modules = document.querySelectorAll('*[data-module-type="imagetextlist"], *[data-module-type="commonmedia"]');
        let currentIndex = -1; // 当前高亮模块的索引

        // 如果页面中没有找到模块，则不执行后续操作
        if (modules.length === 0) return;

        // 高亮显示当前模块的函数
        function highlightModule(index) {
            // 移除之前的高亮样式
            modules.forEach(module => {
                module.parentNode.style.outline = '';
            });

            // 应用新的高亮样式
            if (index >= 0 && index < modules.length) {
                const module = modules[index].parentNode;
                module.style.outline = '3px solid #ff0000';
                module.style.outlineOffset = '2px'; // 添加偏移使效果更明显
                module.setAttribute('highlighted', 'true');

                module.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        // 按钮点击事件处理函数
        function handleModuleNavigation() {
            // 计算下一个模块的索引（循环）
            currentIndex = (currentIndex + 1) % modules.length;
            console.log(currentIndex)

            // 高亮并滚动到对应模块
            highlightModule(currentIndex);

            let module_tag = document.querySelector('#editor-btn-module');
            module_tag.innerHTML = ` ${currentIndex + 1}/${modules.length}`;

            // 返回更新后的按钮文本
            return ` ${currentIndex + 1}/${modules.length}`;
        }

        // 如果存在则删除
        let module_tag = document.querySelector('#editor-btn-module');
        if (module_tag) {
            module_tag.remove();
        };

        // 创建导航按钮
        let moduleButton = document.createElement("div");

        moduleButton.id = "editor-btn-module";
        moduleButton.innerHTML = `0/${modules.length}`;
        moduleButton.style.position = "fixed";
        moduleButton.style.bottom = '140px';
        moduleButton.style.right = '20px';
        moduleButton.style.width = "120px";
        moduleButton.style.height = "45px";
        moduleButton.style.background = "#CC00CC";
        moduleButton.style.opacity = "0.85";
        moduleButton.style.color = "white";
        moduleButton.style.textAlign = "center";
        moduleButton.style.lineHeight = "45px";
        moduleButton.style.fontSize = "30px";
        moduleButton.style.cursor = "pointer";
        moduleButton.style.zIndex = "999999";
        moduleButton.style.borderRadius = "8px";
        moduleButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        moduleButton.style.transition = "all 0.3s";
        moduleButton.style.padding = '0 15px';

        // 悬停效果
        moduleButton.onmouseover = () => {
            moduleButton.style.opacity = "1";
            moduleButton.style.transform = "scale(1.05)";
        }
        moduleButton.onmouseout = () => {
            moduleButton.style.opacity = "0.85";
            moduleButton.style.transform = "scale(1)";
        }

        moduleButton.onclick = handleModuleNavigation;

        createMainElement();
        document.querySelector("#main-add-div").appendChild(moduleButton);



    }


    // 下载图片
    function downloadBackgroundImages() {
        var posterImages = document.querySelectorAll('div.poster-image');

        posterImages.forEach(function(posterImage) {
            var backgroundImageStyle = window.getComputedStyle(posterImage).backgroundImage;
            var imageUrl = backgroundImageStyle.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

            // 发起请求下载图片
            var xhr = new XMLHttpRequest();
            xhr.open('GET', imageUrl, true);
            xhr.responseType = 'blob'; // 设置响应类型为 Blob
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var blobUrl = URL.createObjectURL(xhr.response); // 创建临时 URL
                    var link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = imageUrl.split('/').pop(); // 使用图片 URL 的最后一部分作为文件名
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl); // 释放临时 URL
                }
            };
            xhr.send();
        });
    }

    // 显示图片、参考资料数量
    function createContentStatsHeader() {
        // 显示图片数量
        let main = document.querySelector("div.content-section > div.main-body");

        // 图片、图册中的图片数量
        function numCanSee_imgTag() {
            let image_card_list = main?.querySelectorAll('div[class="image-card-wrap"]');

            let image_num_imgTag = 0;

            if (image_card_list) {
                image_card_list.forEach((image_card) => {
                    let image_num_this = 0;

                    let image_num_this_many = image_card.querySelector("div.poster-wrap > div.image-number");
                    if (image_num_this_many) {
                        image_num_this = image_num_this_many.textContent.trim().replace(/^x/,'').replace(/张$/,'');
                        // 将字符串转换为数字
                        image_num_this = parseInt(image_num_this, 10);
                    }
                    else{
                        image_num_this = 1;
                    }

                    image_num_imgTag = image_num_imgTag + image_num_this;

                });
            }
            // 返回计算所得的总数
            return image_num_imgTag;
        }


        // 表格中的图片数量
        function numCanSee_tableTag() {
            let table_card_list = main?.querySelectorAll('div[class="table-baike-wrap"]');

            let table_num_imgTag = 0;

            if (table_card_list) {

                table_card_list.forEach((table_card) => {
                    let image_num_this = 0;

                    let image_num_this_many = table_card.querySelectorAll("div.table-image-wrap > div.poster-wrap > div.poster-image");
                    if (image_num_this_many) {
                        image_num_this += image_num_this_many.length;
                    }
                    else{
                        image_num_this += 0;
                    }

                    table_num_imgTag = table_num_imgTag + image_num_this;

                });
            }
            // 返回计算所得的总数
            return table_num_imgTag;
        }


        // 模板中的图片数量
        function numCanSee_modeTag() {
            let mode_card_list = main?.querySelectorAll('div[class="imagetextlist-card-inner"]');
            let mode_num_imgTag = 0;

            if (mode_card_list) {
                mode_card_list.forEach((mode_card) => {
                    let mode_num_this = 0;

                    let mode_type_tag = mode_card.querySelector('div[class*="card-content-type"]');
                    let mode_type = mode_type_tag.classList.value;
                    switch (mode_type) {
                        case 'card-content-type1':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        case 'card-content-type2':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        case 'card-content-type3':
                            mode_num_this = mode_type_tag.querySelectorAll('div[class="cardinfo-image"]').length;
                            break;
                        default:
                            mode_num_this += 0;
                    }

                    mode_num_imgTag = mode_num_imgTag + mode_num_this;
                });
            }
            // 返回计算所得的总数
            return mode_num_imgTag;
        }


        // 参考资料数量
        function numCanSee_referencesTag() {
            // 显示参考资料数量
            let references = document.querySelector("div.content-section > div.references");

            let references_list = references?.querySelectorAll('div[class="reference-item"]');

            let references_num = references_list?.length;

            // 返回计算所得的总数
            return references_num;
        }


        // 信息栏数量简洁版本 - 只输出最终统计
        function numCanSee_basicTag() {
            let basics = document.querySelectorAll(".basic-info .temp-info-box .info-item, .basic-info .extra-info-box *[data-handler-id]");
            let hasTrueCount = 0; // 至少有一个true的元素数量
            let noTrueCount = 0; // 没有true的元素数量
            let totalElements = basics.length;

            basics.forEach(element => {
                try {
                    const reactKey = Object.keys(element).find(key => key.startsWith('__reactProps'));
                    if (!reactKey) {
                        noTrueCount++; // 没有React属性，算作没有true
                        return;
                    }

                    const reactProps = element[reactKey];
                    const targetPath = reactProps?.children?.props?.children?.[2]?.props?.info?.value ||
                          reactProps?.children?.props?.children?.props?.info?.value ||
                          reactProps?.children?.props?.info?.value ||
                          reactProps?.props?.info?.value ||
                          reactProps?.info?.value;

                    let hasTrueInThisElement = false;
                    let hasFalseInThisElement = false;
                    let hasOtherInThisElement = false;

                    if (targetPath && Array.isArray(targetPath)) {
                        targetPath.forEach(item => {
                            if (item?.valid === true) {
                                hasTrueInThisElement = true;
                            } else if (item?.valid === false) {
                                hasFalseInThisElement = true;
                            } else if (item?.valid !== undefined) {
                                hasOtherInThisElement = true;
                            }
                        });
                    }

                    // 如果这个元素中至少有一个true，就计数
                    if (hasTrueInThisElement) {
                        hasTrueCount++;
                    } else {
                        noTrueCount++;
                    }

                } catch (error) {
                    noTrueCount++; // 出错也算作没有true
                }
            });

            //             console.log('=== 最终统计 ===');
            //             console.log(`至少有一个 true 的元素数量: ${hasTrueCount}`);
            //             console.log(`没有 true 的元素数量: ${noTrueCount}`);
            //             console.log(`总元素数量: ${totalElements}`);
            //             console.log(`有 true 的元素占比: ${((hasTrueCount / totalElements) * 100).toFixed(1)}%`);
            return hasTrueCount;
        }


        // 信息栏数量
        let basic_num_all = numCanSee_basicTag();

        let image_num_all = numCanSee_imgTag() + numCanSee_tableTag() + numCanSee_modeTag();
        let image_num_mode = numCanSee_modeTag();
        let image_num_table = numCanSee_tableTag();
        let references_num_all = numCanSee_referencesTag();


        //显示

        let num_tag = document.querySelector('#data-count');
        if (num_tag) {
            num_tag.remove();
        };


        // 创建悬浮窗口
        const countDiv = document.createElement("div");

        countDiv.id = 'data-count';
        countDiv.style.position = 'fixed';
        countDiv.style.top = '100px';
        countDiv.style.right = '20px';
        countDiv.style.width = '120px';
        countDiv.style.backgroundColor = '#fff';
        countDiv.style.border = '1px solid #ccc';
        countDiv.style.borderRadius = '5px';
        countDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        countDiv.style.zIndex = '9999';
        countDiv.style.fontFamily = 'Arial, sans-serif';

        // 标题栏
        const titleBar = document.createElement('div');
        titleBar.style.padding = '10px';
        titleBar.style.borderBottom = '1px solid #eee';
        titleBar.style.fontWeight = 'bold';
        titleBar.textContent = '词条数据统计';
        countDiv.appendChild(titleBar);

        // 内容区域
        const content = document.createElement('div');
        content.id = 'data-count-content';
        content.style.padding = '10px';


        // 计数显示-信息栏
        const basicCountDisplay = document.createElement('div');
        basicCountDisplay.id = 'data-count-basic';
        basicCountDisplay.textContent = `信息栏：${basic_num_all}`;
        content.appendChild(basicCountDisplay);

        // 计数显示-图片数
        const imgCountDisplay = document.createElement('div');
        imgCountDisplay.id = 'data-count-img';
        imgCountDisplay.textContent = `图片数：${image_num_all}`;
        content.appendChild(imgCountDisplay);

        // 计数显示-图片分辨率统计
        const imgPxDisplay = document.createElement('div');
        imgPxDisplay.id = 'data-count-img';
        imgPxDisplay.textContent = `图片比：${image_num_all}`;
        content.appendChild(imgPxDisplay);

        // 计数显示-模板数
        const modCountDisplay = document.createElement('div');
        modCountDisplay.id = 'data-count-mod';
        modCountDisplay.textContent = `模板数：${image_num_mode}`;
        content.appendChild(modCountDisplay);

        // 计数显示-参考数
        const refCountDisplay = document.createElement('div');
        refCountDisplay.id = 'data-count-ref';
        refCountDisplay.textContent =`参考数：${references_num_all}`;
        content.appendChild(refCountDisplay);

        countDiv.appendChild(content);
        createMainElement();
        document.querySelector("#main-add-div").appendChild(countDiv);
    }



    // 获取图片分辨率
    function createImageSize(imageUrl) {
        // 获取图片尺寸
        function getImageSize(imageUrl) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = function() {
                    resolve({
                        width: this.width,
                        height: this.height
                    });
                };
                img.onerror = reject;
                img.src = imageUrl;
            });
        }

        // 获取图片标签
        function getImageElement() {
            // 获取所有包含背景图片的元素
            const cardModes = document.querySelectorAll('.cardinfo-image'); // 模块中的图片
            const cardImg = document.querySelectorAll('.poster-image'); // 概述图封面、正文单图、图册封面
            const cardAlbum = document.querySelectorAll('.image-face'); // 编辑图册页面

            const cards = [...cardModes, ...cardImg, ...cardAlbum].filter(Boolean);

            cards.forEach(card => {
                // console.log('card:', card);
                // 跳过已经处理过的卡片
                if (card.dataset.imgSizeProcessed) return;

                let sizeLabel = card.querySelector('.img-size-label');
                if (!sizeLabel) {
                    sizeLabel = document.createElement('div');
                    sizeLabel.className = 'img-size-label';
                    sizeLabel.style.position = 'absolute';
                    sizeLabel.style.top = '10px';
                    sizeLabel.style.left = '10px';
                    sizeLabel.style.color = 'rgba(255, 255, 255, 0.8)';
                    sizeLabel.style.padding = '2px 5px';
                    sizeLabel.style.borderRadius = '3px';
                    sizeLabel.style.fontFamily = 'Arial, sans-serif';
                    sizeLabel.style.fontSize = '14px';
                    if (getComputedStyle(card).position === 'static') {
                        card.style.position = 'relative';
                    }
                    // ...样式设置

                    // 添加防重标记后再插入DOM
                    card.dataset.imgSizeProcessed = 'true';
                    card.appendChild(sizeLabel);
                } else {
                    card.dataset.imgSizeProcessed = 'true';
                }

                // 检查是否需要修改position
                if (getComputedStyle(card).position === 'static') {
                    card.dataset.originalPosition = 'static'; // 保存原始值
                    card.style.position = 'relative';
                }

                let element = card;

                // 获取背景图片URL
                const style = window.getComputedStyle(element);
                const backgroundImage = style.backgroundImage;
                const imageUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');


                if (imageUrl) {

                    getImageSize(imageUrl)
                        .then(size => {
                        console.log('图片尺寸:', imageUrl, size);
                        // 这里可以继续处理

                        try {

                            // 使用requestAnimationFrame避免频繁更新
                            requestAnimationFrame(() => {
                                if (sizeLabel) {
                                    sizeLabel.textContent = `${size.width}×${size.height}`;
                                    sizeLabel.style.backgroundColor = (size.width >= 400 && size.height >= 400)
                                        ? '#28a745' : '#dc3545';
                                }
                            });
                        } catch (error) {
                            console.error('获取图片尺寸失败:', error);
                        }

                        return size;
                    })
                        .catch(error => {
                        console.error('图片加载失败:', error);
                    });




                }

            });
        }
        getImageElement()

        // 显示图片尺寸
        function createImageElement() {

        }

    }

    // 主监听函数_createImageSize
    const initObservers_createImageSize = () => {
        console.log('监听启动:initObservers_createImageSize');
        createImageSize();

        // 监听基础摘要区域变化
        const initObservers_createImageSize_basicSummaryAlbum = 'body > div.app > section > main > div > div > div > div > div.content-section > div.base-lemma > div.basic-summary-album > div';
        //         watchElement(initObservers_createImageSize_basicSummaryAlbum,
        //                      observeElement(initObservers_createImageSize_basicSummaryAlbum, createImageSize)
        //                     );

        watchElement(
            initObservers_createImageSize_basicSummaryAlbum,
            (element) => {
                observeElement(initObservers_createImageSize_basicSummaryAlbum, createImageSize);
            }
        );

        // 监听抽屉打开状态变化
        // 打开
        // class="bkea-drawer bkea-drawer-bottom bkea-drawer-open no-mask drawer-common no-mask"
        // 关闭
        // class="bkea-drawer bkea-drawer-bottom no-mask drawer-common no-mask"
        const initObservers_createImageSize_editAlbum = 'body > div > div.bkea-drawer';
        //         observeElement(initObservers_createImageSize_editAlbum, () => {
        //             const drawer = document.querySelector(initObservers_createImageSize_editAlbum);
        //             if (drawer?.classList.contains('bkea-drawer-open')) {
        //                 createImageSize();
        //                 observeElement('body > div > div > div > div > div > div > div > div.drawer-content-wrap > div.content-images-wrap > div > div', createImageSize);
        //             }
        //         });
        watchElement(
            initObservers_createImageSize_basicSummaryAlbum,
            (element1) => {
                observeElement(initObservers_createImageSize_editAlbum, () => {
                    const drawer = document.querySelector(initObservers_createImageSize_editAlbum);
                    if (drawer?.classList.contains('bkea-drawer-open')) {
                        createImageSize();
                        const initObservers_createImageSize_editAlbum_c = 'body > div > div > div > div > div > div > div > div.drawer-content-wrap > div.content-images-wrap > div > div';
                        //observeElement(initObservers_createImageSize_editAlbum_c, createImageSize);
                        watchElement(
                            initObservers_createImageSize_editAlbum_c,
                            (element2) => {
                                observeElement(initObservers_createImageSize_editAlbum_c, createImageSize);
                            }
                        );
                    }
                });
            }
        );


        // 监听data-zoom元素下子元素变化
        //         observeElement('body > div.app > section > main > div > div > div > div > div.content-section > div.main-body > div > div > div[data-zoom]', (mutations) => {
        //             for (const mutation of mutations) {
        //                 if (mutation.type === 'childList' &&
        //                     (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
        //                     createImageSize();
        //                     break;
        //                 }
        //             }
        //         }, {childList: true});


        const initObservers_createImageSize_mainBody = 'body > div.app > section > main > div > div > div > div > div.content-section > div.main-body > div > div > div[data-zoom]';

        //         watchElement(
        //             initObservers_createImageSize_mainBody,
        //             (element2) => {
        //                 observeElement(initObservers_createImageSize_mainBody, createImageSize);
        //             }
        //         );

        // 监听所有poster-image的style变化
        observeAttribute('div[data-cangjie-void] div > div > div > div.poster-wrap > div.poster-image', 'style', createImageSize);
    };


    // 创建图片查按钮
    function initImageChecker() {
        // 创建检查按钮
        const checkBtn = document.createElement('button');
        checkBtn.textContent = '检查图片';
        Object.assign(checkBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            width: "120px",
        });

        // 创建图片查看器
        const viewer = document.createElement('div');
        const imgElement = document.createElement('img');
        const prevArrow = document.createElement('div');
        const nextArrow = document.createElement('div');
        const closeBtn = document.createElement('div');
        const indexDisplay = document.createElement('div');
        const locateBtn = document.createElement('button'); // 新增定位按钮

        // 样式配置
        Object.assign(viewer.style, {
            display: 'none',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: '10000',
            cursor: 'pointer'
        });

        Object.assign(imgElement.style, {
            maxWidth: '90vw',
            maxHeight: '90vh',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        });

        // 箭头样式
        const arrowStyle = {
            position: 'absolute',
            top: '50%',
            fontSize: '50px',
            color: 'white',
            cursor: 'pointer',
            transform: 'translateY(-50%)'
        };
        Object.assign(prevArrow.style, { ...arrowStyle, left: '20px' });
        Object.assign(nextArrow.style, { ...arrowStyle, right: '20px' });
        prevArrow.innerHTML = '&#10094;';
        nextArrow.innerHTML = '&#10095;';

        // 关闭按钮
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '40px',
            color: 'white',
            cursor: 'pointer'
        });
        closeBtn.innerHTML = '&times;';

        // 索引显示
        Object.assign(indexDisplay.style, {
            position: 'absolute',
            bottom: '60px', // 调整位置为定位按钮腾出空间
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '20px'
        });

        // 定位按钮样式
        Object.assign(locateBtn.style, {
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
        });
        locateBtn.textContent = '定位图片';

        // 组装组件
        viewer.append(prevArrow, nextArrow, closeBtn, imgElement, indexDisplay, locateBtn);
        createMainElement();
        document.querySelector("#main-add-div").append(checkBtn, viewer);

        // 状态管理
        let currentImageIndex = 0;
        let imageSources = [];
        let imageElements = []; // 存储对应的DOM元素
        let isLoading = false; // 跟踪图片加载状态

        // 提取背景图片URL
        function extractBackgroundUrl(element) {
            const bg = element.style.backgroundImage;
            const match = bg.match(/url\(["']?(.*?)["']?\)/);
            return match ? match[1] : null;
        }

        // 动态获取React属性并提取图片URL
        function extractImageUrlsFromReactProps(element) {
            // 动态获取React属性
            const reactPropKeys = Object.keys(element).filter(key => key.startsWith('__reactProps'));
            if (reactPropKeys.length === 0) {
                console.error('找不到React属性');
                return [];
            }

            // 尝试从所有找到的React属性中提取图片URL
            const urls = [];
            reactPropKeys.forEach(propKey => {
                try {
                    const images = element[propKey]?.children?.props?.children?.props?.node?.data?.metadata?.images;
                    if (Array.isArray(images)) {
                        images.forEach(img => {
                            if (img.url) {
                                urls.push(img.url);
                            }
                        });
                    }
                } catch (e) {
                    console.warn(`提取${propKey}时出错:`, e);
                }
            });

            return urls;
        }

        // 图片显示控制
        function showImage(index) {
            if (index < 0 || index >= imageSources.length) return;

            // 如果正在加载，不执行切换
            if (isLoading) return;

            currentImageIndex = index;
            indexDisplay.textContent = `${index + 1} / ${imageSources.length}`;

            // 设置加载状态
            isLoading = true;

            // 预加载图片
            const tempImg = new Image();
            tempImg.onload = () => {
                imgElement.src = imageSources[index];
                isLoading = false;
            };
            tempImg.onerror = () => {
                isLoading = false;
                console.error('图片加载失败:', imageSources[index]);
            };
            tempImg.src = imageSources[index];
        }

        // 定位到当前图片
        function locateCurrentImage() {
            if (imageElements[currentImageIndex]) {
                imageElements[currentImageIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // 添加高亮效果
                const element = imageElements[currentImageIndex];
                const originalBorder = element.style.border;
                element.style.border = '3px solid red';
                element.style.transition = 'border 0.3s';

                setTimeout(() => {
                    element.style.border = originalBorder || '';
                }, 2000);
            }
        }

        // 键盘事件处理
        function handleKeydown(e) {
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            if (e.key === 'Escape') closeViewer();
        }

        // 关闭查看器
        function closeViewer() {
            viewer.style.display = 'none';
            document.removeEventListener('keydown', handleKeydown);
        }

        // 事件绑定
        checkBtn.addEventListener('click', () => {
            // 重置状态
            imageSources = [];
            imageElements = [];

            // 从传统元素获取背景图片
            const traditionalElements = document.querySelectorAll('.cardinfo-image, .poster-image, .image-face');
            traditionalElements.forEach(element => {
                const url = extractBackgroundUrl(element);
                if (url) {
                    imageSources.push(url);
                    imageElements.push(element);
                }
            });

            // 从React元素获取图片URL
            const albumElements = document.querySelectorAll('[data-testid="image_album"]');
            albumElements.forEach(element => {
                const urls = extractImageUrlsFromReactProps(element);
                urls.forEach(url => {
                    imageSources.push(url);
                    imageElements.push(element);
                });
            });

            // 合并并去重
            const uniqueSources = [];
            const uniqueElements = [];
            const seen = new Set();

            imageSources.forEach((url, index) => {
                if (!seen.has(url)) {
                    seen.add(url);
                    uniqueSources.push(url);
                    uniqueElements.push(imageElements[index]);
                }
            });

            imageSources = uniqueSources;
            imageElements = uniqueElements;

            if (!imageSources.length) {
                const notification = document.createElement('div');
                notification.textContent = '没有图片！';
                notification.style.position = 'fixed';
                notification.style.top = '50%';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                notification.style.color = 'white';
                notification.style.padding = '50px 100px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '1000';
                notification.style.fontSize = '26px';
                createMainElement();
                document.querySelector("#main-add-div").appendChild(notification);

                setTimeout(() => {
                    notification.style.transition = 'opacity 0.5s';
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        document.querySelector("#main-add-div").removeChild(notification);
                    }, 500);
                }, 1000);
                return;
            }

            viewer.style.display = 'block';
            showImage(0);
            document.addEventListener('keydown', handleKeydown);
        });

        prevArrow.addEventListener('click', e => {
            e.stopPropagation();
            showImage(currentImageIndex - 1);
        });

        nextArrow.addEventListener('click', e => {
            e.stopPropagation();
            showImage(currentImageIndex + 1);
        });

        closeBtn.addEventListener('click', closeViewer);
        viewer.addEventListener('click', e => e.target === viewer && closeViewer());
        locateBtn.addEventListener('click', locateCurrentImage); // 绑定定位按钮事件
    }



    // 检查文本内容中的特定词
    function checkContent() {
        // 配置区域：方便维护的特定词列表和豁免规则
        const wordRules = [
            {
                original: "香港",
                replacement: "中国香港",
                exemptions: ["中国香港", "香港特区", "香港特别行政区"] // 豁免词，不会触发替换
            },
            {
                original: "台湾",
                replacement: "中国台湾",
                exemptions: ["中国台湾", "台湾省"]
            },
            {
                original: "澳门",
                replacement: "中国澳门",
                exemptions: ["中国澳门", "澳门特区", "澳门特别行政区"]
            },
            {
                original: "文革",
                replacement: "“文革”",
                exemptions: ["“文革”", "‘文革’"]
            },
            {
                original: "文化大革命",
                replacement: "“文化大革命”",
                exemptions: ["“文化大革命”", "‘文化大革命’"]
            },
            {
                original: "【【",
                replacement: "",
                exemptions: []
            },
            {
                original: "】】",
                replacement: "",
                exemptions: ["【【角色介绍】】"]
            },
            {
                original: "【【角色介绍】】",
                replacement: "",
                exemptions: []
            },
            {
                original: ",",
                replacement: "，",
                exemptions: [
                    "[0-9]\s?,",// 数字之后
                    "[a-zA-Z]\s?,",// 英文之后
                    "[a-zA-Z]\.？,",// 生物，命名者及年(Gray, 1849)，L.，1753
                ] // 支持正则表达式，匹配数字或英文之间的逗号
            },
            {
                original: ".",
                replacement: "。",
                exemptions: [
                    "[0-9]\s?\.", "^[0-9]\.$",// 数字之后
                    "[a-zA-Z]\s?\.",// 英文之后
                ] // 支持正则表达式，匹配数字或英文之间的逗号
            },
            {
                original: "词条",
                replacement: "",
                exemptions: ["词条概述", "词条内容", "概括一下词条"]
            },
            // 可以继续添加更多规则
        ];

        // 检查间隔（毫秒）
        const CHECK_INTERVAL = 3000;

        // 存储当前找到的特定词
        let foundWords = [];
        let checkTimer = null;

        // 创建悬浮窗口
        function createFloatingWindow() {
            // 存在则退出
            if(document.querySelector("#vocab-checker-floating-window")){
                return;
            }

            const floatingDiv = document.createElement('div');
            floatingDiv.id = 'vocab-checker-floating-window';
            floatingDiv.style.position = 'fixed';
            floatingDiv.style.bottom = '200px';
            floatingDiv.style.right = '20px';
            floatingDiv.style.width = '120px';
            floatingDiv.style.backgroundColor = '#fff';
            floatingDiv.style.border = '1px solid #ccc';
            floatingDiv.style.borderRadius = '5px';
            floatingDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            floatingDiv.style.zIndex = '9999';
            floatingDiv.style.fontFamily = 'Arial, sans-serif';

            // 标题栏
            const titleBar = document.createElement('div');
            titleBar.style.padding = '10px';
            titleBar.style.borderBottom = '1px solid #eee';
            titleBar.style.fontWeight = 'bold';
            titleBar.textContent = '特定词检查';
            floatingDiv.appendChild(titleBar);

            // 内容区域
            const content = document.createElement('div');
            content.id = 'vocab-checker-content';
            content.style.padding = '10px';

            // 计数显示
            const countDisplay = document.createElement('div');
            countDisplay.id = 'vocab-checker-count';
            countDisplay.textContent = '特定词：0个';
            content.appendChild(countDisplay);

            // 按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.marginTop = '5px';

            // 重新检查按钮
            const recheckButton = document.createElement('button');
            recheckButton.textContent = '🔄';
            recheckButton.style.fontSize = "20px";
            recheckButton.addEventListener('click', performCheck);
            buttonContainer.appendChild(recheckButton);

            content.appendChild(buttonContainer);
            floatingDiv.appendChild(content);

            createMainElement();
            document.querySelector("#main-add-div").appendChild(floatingDiv);
        }

        // 检查特定词
        function checkForSpecificWords() {
            foundWords = [];

            // 要检查的内容区域选择器
            const contentSelectors = [
                '.content-section .basic-summary',
                '.content-section .sm-summary',
                '.content-section .basic-info',
                '.content-section .main-body'
            ];

            // 要排除的内容区域选择器（可配置）
            const excludeSelectors = [
                '*[data-testid="list-symbol"]', // 排除正文中的有序目录
                // 可以继续添加更多排除规则
            ];

            // 遍历所有内容区域
            contentSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // 检查当前元素是否应该被排除
                    let shouldExclude = false;

                    // 检查元素是否匹配排除选择器
                    for (const excludeSelector of excludeSelectors) {
                        // 如果元素本身匹配排除选择器，或者包含匹配排除选择器的元素
                        if (element.matches(excludeSelector) || element.querySelector(excludeSelector)) {
                            shouldExclude = true;
                            break;
                        }
                    }

                    if (!shouldExclude) {
                        // 检查文本内容
                        checkTextContent(element.textContent, element);
                    }
                });
            });

            // 更新显示
            updateDisplay();
        }

        // 检查文本内容中的特定词（支持正则豁免）
        function checkTextContent(text, element) {
            wordRules.forEach(rule => {
                // 检查是否包含原始词
                if (text.includes(rule.original)) {
                    // 检查豁免规则（支持正则表达式）
                    let shouldCheck = false;

                    // 如果存在豁免规则，需要检查是否有未豁免的情况
                    if (rule.exemptions && rule.exemptions.length > 0) {
                        // 查找所有原始词出现的位置
                        const originalWord = rule.original;
                        let startIndex = 0;
                        let foundPositions = [];

                        // 获取所有原始词出现的位置
                        while ((startIndex = text.indexOf(originalWord, startIndex)) !== -1) {
                            foundPositions.push(startIndex);
                            startIndex += originalWord.length;
                        }

                        // 检查每个出现的位置是否被豁免
                        for (const position of foundPositions) {
                            let isExemptAtPosition = false;

                            for (const exemption of rule.exemptions) {
                                try {
                                    // 尝试作为正则表达式匹配整个文本
                                    const regex = new RegExp(exemption, 'g');
                                    let match;
                                    while ((match = regex.exec(text)) !== null) {
                                        // 检查当前原始词位置是否在豁免匹配的范围内
                                        if (position >= match.index && position < match.index + match[0].length) {
                                            isExemptAtPosition = true;
                                            break;
                                        }
                                    }
                                    if (isExemptAtPosition) break;
                                } catch (e) {
                                    // 如果正则表达式无效，回退到普通字符串匹配
                                    if (text.includes(exemption)) {
                                        // 对于字符串匹配，检查当前原始词是否在豁免字符串中
                                        let exemptionIndex = 0;
                                        while ((exemptionIndex = text.indexOf(exemption, exemptionIndex)) !== -1) {
                                            if (position >= exemptionIndex && position < exemptionIndex + exemption.length) {
                                                isExemptAtPosition = true;
                                                break;
                                            }
                                            exemptionIndex += exemption.length;
                                        }
                                        if (isExemptAtPosition) break;
                                    }
                                }
                            }

                            // 如果发现有一个位置的原始词没有被豁免，就标记为需要检查
                            if (!isExemptAtPosition) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    } else {
                        // 没有豁免规则，直接检查
                        shouldCheck = true;
                    }

                    if (shouldCheck) {
                        // 避免重复添加相同的词
                        const existingWord = foundWords.find(item =>
                                                             item.word === rule.original && item.element === element
                                                            );

                        if (!existingWord) {
                            foundWords.push({
                                word: rule.original,
                                replacement: rule.replacement,
                                element: element
                            });
                        }
                    }
                }
            });
        }

        // 响应式 Canvas
        function createTextCanvas(text, options = {}) {
            const {
                fontSize = 16,
                fontFamily = 'Arial',
                color = '#000',
                maxWidth = 300,
                padding = 10
            } = options;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置字体进行测量
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textWidth = ctx.measureText(text).width;

            // 计算 canvas 尺寸
            const actualWidth = Math.min(textWidth + padding * 2, maxWidth);
            const actualHeight = fontSize + padding * 2;

            canvas.width = actualWidth;
            canvas.height = actualHeight;

            // 重新设置上下文
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'middle';

            // 绘制文本（居中）
            const x = padding;
            const y = actualHeight / 2;

            ctx.fillText(text, x, y);

            return canvas;
        }

        // 更新显示
        function updateDisplay() {
            const countDisplay = document.getElementById('vocab-checker-count');
            if (countDisplay) {
                countDisplay.textContent = `特定词：${foundWords.length}个`;


                // 如果有找到特定词，添加详细信息
                if (foundWords.length > 0) {
                    let details = document.getElementById('vocab-checker-details');
                    if (!details) {
                        details = document.createElement('div');
                        details.id = 'vocab-checker-details';
                        details.style.marginTop = '10px';
                        details.style.maxHeight = '200px';
                        details.style.overflowY = 'auto';
                        countDisplay.parentNode.insertBefore(details, countDisplay.nextSibling);
                    }

                    details.innerHTML = '';

                    // 使用Set去重（基于词和元素）
                    const uniqueWords = [];
                    const seen = new Set();

                    foundWords.forEach(item => {
                        const key = `${item.word}-${item.element}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            uniqueWords.push(item);
                        }
                    });

                    foundWords = uniqueWords;

                    uniqueWords.forEach((item, index) => {
                        const wordInfo = document.createElement('div');
                        wordInfo.style.marginBottom = '5px';
                        wordInfo.style.fontSize = '16px';

                        const text = item.word;

                        // 使用 canvas 避免影响 ctrl+f 功能
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // 设置字体样式
                        ctx.font = '16px Arial';
                        ctx.fillStyle = 'red';

                        // 测量文本宽度
                        const textMetrics = ctx.measureText(text);
                        const textWidth = textMetrics.width;
                        const textHeight = parseInt(ctx.font, 10);

                        // 设置 canvas 尺寸
                        canvas.width = textWidth + 20;
                        canvas.height = textHeight + 8;

                        // 重新设置字体
                        ctx.font = '16px Arial';
                        ctx.fillStyle = 'red';

                        // 绘制文本
                        ctx.fillText(text, 10, textHeight + 3);

                        wordInfo.appendChild(canvas);
                        details.appendChild(wordInfo);
                    });
                } else {
                    // 移除详细信息显示
                    const details = document.getElementById('vocab-checker-details');
                    if (details) details.remove();
                }
            }
        }

        // 执行检查（供外部调用）
        function performCheck() {
            checkForSpecificWords();
        }

        // 初始化函数
        function init() {
            // 创建悬浮窗口
            createFloatingWindow();

            // 初始检查特定词
            performCheck();

            // 设置定时检查
            checkTimer = setInterval(performCheck, CHECK_INTERVAL);

            // 监听内容变化（使用MutationObserver）
            const observer = new MutationObserver(function(mutations) {
                // 当内容发生变化时执行检查
                performCheck();
            });

            // 配置观察选项
            const observerConfig = {
                childList: true,
                subtree: true,
                characterData: true
            };

            // 观察所有内容区域
            const contentSelectors = [
                '.content-section .basic-summary',
                '.content-section .sm-summary',
                '.content-section .basic-info',
                '.content-section .main-body'
            ];

            contentSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    observer.observe(element, observerConfig);
                });
            });
        }

        init();
    }



    //*************************************************************************************
    //----------------------------------------列表页面函数
    //*************************************************************************************
    //待审核
    //https://baike.quark.cn/api/lemma/list?status=my_pending_list&page=1&size=1000

    //已通过
    //https://baike.quark.cn/api/lemma/list?status=my_passed_list&page=1&size=1000

    //未通过
    //https://baike.quark.cn/api/lemma/list?status=my_not_passed_list&page=1&size=1000

    // 获取词条列表
    function getAllList(status) {

        async function fetchData(url) {
            const response = await fetch(url);
            const { data, metadata } = await response.json();
            return { data, metadata };
        }

        function convertToCSV(data) {
            const headers = [
                "revision_id",
                "lemma_id",
                "lemma_name",
                "sense_id",
                "lemma_sense",
                "created_user_id",
                "created_by",
                "audit_user_id",
                "audit_nickname",
                "submit_time",
                "audit_time",
                "audit_status",
                "audit_remark",
                "customize_audit_remark",
                "user_task_id",
                "title",
                "notpass_status",
                "publish_status"
            ];
            let csvContent = headers.join(',') + '\n';

            data.forEach(entry => {
                const values = headers.map(header => {
                    if (header === "audit_nickname" && !entry.hasOwnProperty(header)) {
                        return "";
                    }
                    return typeof entry[header] === 'string' ? `"${entry[header]}"` : entry[header];
                }).join(',');
                csvContent += values + '\n';
            });

            return csvContent;
        }

        async function downloadCSV(csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        async function fetchAndDownloadData(status, pageSize) {
            let page = 1;
            let maxPage = 1;
            let allData = [];

            do {
                const url = `https://baike.quark.cn/api/lemma/list?status=${status}&page=${page}&size=${pageSize}`;
                const { data, metadata } = await fetchData(url);

                if (metadata.total > 0) {
                    if (metadata.page === 1) {
                        maxPage = Math.ceil(metadata.total / metadata.size);
                    }

                    allData = allData.concat(data);
                    page++;
                } else {
                    console.log('No data found.');
                }
            } while (page <= maxPage);

            if (allData.length > 0) {
                const csvContent = convertToCSV(allData);
                await downloadCSV(csvContent);
            } else {
                console.log('No data to download.');
            }
        }

        // 设置状态
        // const status = 'my_pending_list'; // 待审核
        // const status = 'my_passed_list'; // 已通过
        // const status = 'my_not_passed_list'; // 未通过

        const pageSize = 1000; // 设置每页数据量
        fetchAndDownloadData(status, pageSize);
    }


    // 获取词条列表
    async function getAllList_error() {
        // 定义获取数据的函数
        async function fetchData(url) {
            const response = await fetch(url);
            const { data, metadata } = await response.json();
            return { data, metadata };
        }

        // 定义转换数据为CSV格式的函数
        function convertToCSV(data) {
            const headers = [
                "revision_id",
                "lemma_id",
                "lemma_name",
                "sense_id",
                "lemma_sense",
                "created_user_id",
                "created_by",
                "audit_user_id",
                "audit_nickname",
                "submit_time",
                "audit_time",
                "audit_status",
                "audit_remark",
                "customize_audit_remark",
                "user_task_id",
                "title",
                "notpass_status",
                "publish_status",
                "rego_url"
            ];
            let csvContent = headers.join(',') + '\n';

            data.forEach(entry => {
                const values = headers.map(header => {
                    if (header === "audit_nickname" && !entry.hasOwnProperty(header)) {
                        return "";
                    }
                    return typeof entry[header] === 'string' ? `"${entry[header]}"` : entry[header];
                }).join(',');
                csvContent += values + '\n';
            });

            return csvContent;
        }

        // 定义下载CSV文件的函数
        async function downloadCSV(csvContent) {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }

        // 定义获取并处理数据的函数
        async function getAndProcessData() {
            const pageSize = 1000;

            // 获取每个状态的数据
            const pendingData = await fetchAndAggregateData('my_pending_list', pageSize);
            const passedData = await fetchAndAggregateData('my_passed_list', pageSize);
            const notPassedData = await fetchAndAggregateData('my_not_passed_list', pageSize);

            // 创建一个用于快速查找最新提交时间的映射表
            const latestSubmitTimeMap = new Map();

            // 填充映射表
            [...pendingData, ...passedData].forEach(entry => {
                const existingEntry = latestSubmitTimeMap.get(entry.lemma_id);
                if (!existingEntry || new Date(entry.submit_time) > new Date(existingEntry.submit_time)) {
                    latestSubmitTimeMap.set(entry.lemma_id, entry);
                }
            });

            // 过滤不需要的数据
            const filteredNotPassedData = notPassedData.filter(entry => {
                if (entry.lemma_id) {
                    const latestEntry = latestSubmitTimeMap.get(entry.lemma_id);
                    if (latestEntry && new Date(latestEntry.submit_time) > new Date(entry.submit_time)) {
                        return false;
                    }
                } else {
                    // 如果没有lemma_id，则使用lemma_name和lemma_sense进行比较
                    const matchingEntry = [...pendingData, ...passedData].find(e =>
                                                                               e.lemma_name === entry.lemma_name && e.sense_id === entry.sense_id && new Date(e.submit_time) > new Date(entry.submit_time)
                                                                              );
                    return !matchingEntry;
                }
                return true;
            });

            // 生成rego_url
            filteredNotPassedData.forEach(entry => {
                // if (entry.lemma_id) {
                entry.rego_url = `https://baike.quark.cn/editor/create?model=edit&lemma_id=${encodeURIComponent(entry.lemma_id)}&lemma_name=${encodeURIComponent(entry.lemma_name)}&sense_id=${encodeURIComponent(entry.sense_id)}&sense_name=${encodeURIComponent(entry.sense_id)}&revision_id=${encodeURIComponent(entry.revision_id)}`;
                // }
            });

            // 如果有数据则转换为CSV并下载
            if (filteredNotPassedData.length > 0) {
                const csvContent = convertToCSV(filteredNotPassedData);
                await downloadCSV(csvContent);
            } else {
                console.log('没有可下载的数据。');
            }
        }

        // 定义获取指定状态数据的函数
        async function fetchAndAggregateData(status, pageSize) {
            let page = 1;
            let maxPage = 1;
            let allData = [];

            do {
                const url = `https://baike.quark.cn/api/lemma/list?status=${status}&page=${page}&size=${pageSize}`;
                const { data, metadata } = await fetchData(url);

                if (metadata.total > 0) {
                    if (metadata.page === 1) {
                        maxPage = Math.ceil(metadata.total / metadata.size);
                    }

                    allData = allData.concat(data);
                    page++;
                } else {
                    console.log(`未找到状态为: ${status} 的数据。`);
                }
            } while (page <= maxPage);

            return allData;
        }

        // 调用函数获取并处理数据
        await getAndProcessData();
    }


    // 草稿
    //https://baike.quark.cn/editor/create?model=edit
    //&lemma_id=66485075171820
    //&lemma_name=%E5%BC%82%E6%AD%A5%E7%94%B5%E6%9C%BA
    //&sense_id=80573458527809
    //&sense_name=%E6%84%9F%E5%BA%94%E7%94%B5%E5%8A%A8%E6%9C%BA
    //&revision_id=443722396032171







    //*************************************************************************************
    //*************************************************************************************
    //----------------------------------------页面
    //*************************************************************************************
    //*************************************************************************************
    // 页面类型判断函数
    function getPageType() {
        const url = window.location.href;

        if (/baike\.quark\.cn\/editor\/create\?model=.+/.test(url)) {
            // 词条编辑页面https://baike.quark.cn/editor/create?model=*
            return 'editor';
        } else if (url.includes('baike.quark.cn/dashboard/contents')) {
            // 词条列表页面https://baike.quark.cn/dashboard/contents
            return 'dashboard';
        }

        return 'other';
    }


    // 词条编辑页面逻辑
    function initEditorPage() {
        console.log('词条编辑页面');

        // 删除空格
        setTimeout(() => {
            createBasicSpace();
        }, 2000);

        // 使用js将模块下面的按钮置于顶层
        setInterval(() => {
            checkAndBringToFront();
        }, 1000);

        // 提交按钮修改
        watchElement(logoWrapSelector, (editorApp) => {
            console.log('logo元素加载完成');
            watchElement(createMainElementSelector, (mainElement) => {
                console.log('主容器元素加载完成');
                createFloatingButton();
            });
        });

        // 页面滚动按钮
        watchElement(editorApplicationSelector, (editorApp) => {
            console.log('编辑器应用元素加载完成');
            watchElement(createMainElementSelector, (mainElement) => {
                console.log('主容器元素加载完成');
                addEditorControlButtons();
            });
        });

        // 显示图片、参考资料数量
        setInterval(() => {
            createContentStatsHeader();
        }, 1000);

        // 初始化图片
        watchElement(editorApplicationSelector, (editorApp) => {
            console.log('编辑器应用元素加载完成');
            watchElement(createMainElementSelector, (mainElement) => {
                console.log('主容器元素加载完成');
                initImageChecker();
            });
        });


        // 寻找并跳转模块
        setInterval(() => {
            findAndToggleModule();
        }, 1000);

        // 初始化监听createImageSize
        setTimeout(() => {
            initObservers_createImageSize()
        }, 2000);


        // 检查文本内容中的特定词
        watchElement(editorApplicationSelector, (editorApp) => {
            console.log('编辑器应用元素加载完成');
            watchElement(createMainElementSelector, (mainElement) => {
                console.log('主容器元素加载完成');
                checkContent();
            });
        });



    }

    // 词条列表页面逻辑
    function initDashboardPage() {
        console.log('词条列表页面');

        addButton("待审", "120px", "10px", document.querySelector("body"), function() {
            getAllList('my_pending_list');
        });
        addButton("通过", "70px", "10px", document.querySelector("body"), function() {
            getAllList('my_passed_list');
        });
        addButton("未通", "20px", "10px", document.querySelector("body"), function() {
            getAllList('my_not_passed_list');
        });

        addButton("-", "220px", "10px", document.querySelector("body"), function() {
            getAllList_error();
        });
    }


    // 主函数
    function main() {
        const pageType = getPageType();

        switch(pageType) {
            case 'editor':
                initEditorPage();
                break;
            case 'dashboard':
                initDashboardPage();
                break;
            default:
                // 不在目标页面，不执行任何操作
                break;
        }
    }

    // 运行主函数
    main();

    // 监听URL变化（如果是单页应用）
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            main();
        }
    }).observe(document, { subtree: true, childList: true });





})();