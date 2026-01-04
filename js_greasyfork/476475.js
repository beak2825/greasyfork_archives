// ==UserScript==
// @name         unlock lpsg videos
// @namespace    MBing
// @version      7.0
// @description  unlock lpsg video access. may need to manually switch video format since I can't figure that part out. Also load all images ASAP instead of having to scroll to them. Also added a button on top left to hide user info, so you can browse the page more quickly.
// @author       MBing
// @match        https://www.lpsg.com/threads*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lpsg.com
// @grant        none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/476475/unlock%20lpsg%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/476475/unlock%20lpsg%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 控制是否继续切换后缀
    let shouldContinue = true;
    var volume=0.05;
    var autoSwitchInterval=2500

    //创建放按钮的区域
    createControlDiv();
    //替换不能播放的视频
    replaceUnplayableVideos();
    //第三个标题栏
    createSkipInfoLabel();
    //增加纯文字页自动翻页选择框
    createCheckboxToAutoJumpTextOnlyPage();
    //增加向前翻页选择框
    createCheckboxToAutoJumpBackward();
    //增加隐藏纯文字帖子按钮
    createCheckboxToHideTextOnlyPost();
    //第一个标题栏
    createUserInfoLabel();
    //增加隐藏用户信息按钮
    createCheckboxToHideUserInfo();
    //点击空白处折叠div
    createCheckboxToFoldDiv();
    //第二个标题栏
    createPicLabel();
    //把附件的图片改为全部显示而非填满
    createCheckboxToChangeAttaImgDisplay();
    //每行显示一张图片
    createCheckboxToDisplayOnePicPerLine();
    //限制图片最大大小
    createCheckboxToLimitImgSize();
    //滚动到最后时自动跳转到下一页
    //scrollToNextPage();





    //点击空白处折叠div
    function createCheckboxToFoldDiv(){
        /* ----------- 常量与工具 ----------- */
        const STORAGE_KEY = 'TM_messageFoldEnabled';
        const ORIGINAL_HEIGHT = 'data-original-height';

        /* 读取开关状态 */
        let enabled = localStorage.getItem(STORAGE_KEY) === 'true';

        /* ----------- 创建固定 checkbox ----------- */
        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'fold-div-checkbox';
        checkbox.style.marginLeft = '5px';
        checkbox.checked = enabled;

        // 创建复选框标签
        const label = document.createElement('label');
        label.htmlFor = 'fold-div-checkbox';
        label.textContent = 'Click Empty Space Below To Collapse Post';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);


        /* ----------- 折叠/恢复单个节点 ----------- */
        function fold(inner) {
            if (inner.classList.contains('folded')) return;// 已折叠
            const content = inner.querySelector('.message-content.js-messageContent');

            /* 记录原始高度 */
            if (!inner.hasAttribute(ORIGINAL_HEIGHT)) {
                inner.setAttribute(ORIGINAL_HEIGHT, window.getComputedStyle(inner).height);
            }

            inner.style.height = '500px';
            inner.style.backgroundColor = '#6ba65e59';
            //inner.style.backgroundColor = '#fff';
            inner.style.overflowY = 'hidden';
            if (content) content.style.overflowY = 'hidden';
            inner.classList.add('folded');
            inner.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function restore(inner) {
            if (!inner.classList.contains('folded')) return;
            const content = inner.querySelector('.message-content.js-messageContent');

            inner.style.height = inner.getAttribute(ORIGINAL_HEIGHT) || '';
            inner.style.backgroundColor = '';
            inner.style.overflowY = '';
            if (content) content.style.overflowY = '';
            inner.classList.remove('folded');
        }

        /* ----------- 绑定 / 解绑 ----------- */
        function bindToggle(inner) {
            if (inner._foldClickHandler) return; // 已绑定
            const handler = function (ev) {
                if (ev.target !== inner) return;
                if (inner.classList.contains('folded')) {
                    restore(inner);
                } else {
                    fold(inner);
                }
            };
            inner.addEventListener('click', handler);
            inner._foldClickHandler = handler;
        }

        function unbindToggle(inner) {
            if (!inner._foldClickHandler) return;
            inner.removeEventListener('click', inner._foldClickHandler);
            delete inner._foldClickHandler;
            restore(inner);
        }

        /* ----------- 全量启用 / 禁用 ----------- */
        function enableFeature() {
            document.querySelectorAll('.message-inner').forEach(bindToggle);
        }

        function disableFeature() {
            document.querySelectorAll('.message-inner').forEach(unbindToggle);
        }

        /* ----------- 动态节点支持 ----------- */
        const mo = new MutationObserver(() => {
            if (!enabled) return;
            document.querySelectorAll('.message-inner:not([data-toggle-ready])')
                .forEach(bindToggle);
        });

        /* ----------- 开关变化处理 ----------- */
        checkbox.addEventListener('change', () => {
            enabled = checkbox.checked;
            localStorage.setItem(STORAGE_KEY, enabled);
            if (enabled) {
                enableFeature();
                mo.observe(document.body, { childList: true, subtree: true });
            } else {
                mo.disconnect();
                disableFeature();
                document.querySelectorAll('.message-inner').forEach(unbindToggle);
            }
        });

        /* ----------- 初始化 ----------- */
        if (enabled) {
            enableFeature();
            mo.observe(document.body, { childList: true, subtree: true });
        }
    }



    //创建放按钮的区域
    function createControlDiv(){
        /*
        // 创建一个固定在左上角的div
        const controlDiv = document.createElement('div');
        controlDiv.id = 'custom-control-div';
        controlDiv.style.position = 'fixed';
        controlDiv.style.top = '5px';
        controlDiv.style.left = '5px';
        controlDiv.style.zIndex = '9999';
        controlDiv.style.padding = '5px';
        controlDiv.style.border = '1px solid #ccc';
        controlDiv.style.borderRadius = '5px';
        controlDiv.style.fontSize = '14px';
        controlDiv.style.backgroundColor = '#a18705';
        controlDiv.style.color = 'white';
        // 将div添加到页面中
        document.body.appendChild(controlDiv);
*/



        // 创建一个折叠的 div
        const foldableDiv = document.createElement('div');
        foldableDiv.id = 'foldableDiv';
        foldableDiv.style.transition = 'height 0.5s ease'; // 平滑过渡效果
        foldableDiv.style.overflow = 'hidden'; // 隐藏超出部分
        foldableDiv.style.cursor = 'pointer'; // 鼠标指针样式
        //foldableDiv.style.height = '30px'; // 默认高度为 30px，作为提示区域
        foldableDiv.style.position = 'fixed';
        foldableDiv.style.top = '5px';
        foldableDiv.style.left = '5px';
        foldableDiv.style.maxWidth = '250px';
        foldableDiv.style.zIndex = '999';
        foldableDiv.style.padding = '8px';
        foldableDiv.style.border = '1px solid #ccc';
        foldableDiv.style.borderRadius = '5px';
        foldableDiv.style.fontSize = '14px';
        foldableDiv.style.fontWeight = 'bold';
        foldableDiv.style.backgroundColor = '#a18705';
        foldableDiv.style.color = 'white';

        // 创建内容
        const controlDiv = document.createElement('div');
        controlDiv.id = 'custom-control-div';
        //controlDiv.style.padding = '5px';
        controlDiv.style.display = 'none'; // 默认隐藏内容
        //controlDiv.textContent = '这是折叠的内容，鼠标悬停时显示。';

        // 创建提示区域
        const hint = document.createElement('div');
        //hint.style.padding = '5px';
        hint.style.textAlign = 'center';
        hint.style.color = 'white';
        //hint.style.fontWeight = 'bold';
        hint.textContent = 'Extra Enhancements';

        // 将内容和提示区域添加到折叠的 div 中
        foldableDiv.appendChild(controlDiv);
        foldableDiv.appendChild(hint);

        // 将折叠的 div 添加到页面中
        document.body.appendChild(foldableDiv);

        // 鼠标悬停时展开
        foldableDiv.addEventListener('mouseover', () => {
            foldableDiv.style.height = 'auto'; // 展开
            controlDiv.style.display = 'block'; // 显示内容
            hint.style.display = 'none'; // 隐藏提示区域
        });

        // 鼠标移开时折叠
        foldableDiv.addEventListener('mouseout', () => {
            //foldableDiv.style.height = '30px'; // 折叠
            controlDiv.style.display = 'none'; // 隐藏内容
            hint.style.display = 'block'; // 显示提示区域
        });
    }

    //限制图片最大大小
    function createCheckboxToLimitImgSize(){

        // 用于存储用户的选择状态
        const maxImgWidthKey = 'maxImgWidthKey';

        // 检查localStorage中是否存在maxImgWidthKey变量，若不存在则初始化为""
        if (localStorage.getItem(maxImgWidthKey) === null) {
            localStorage.setItem(maxImgWidthKey, '');
        }

        // 创建一个标签
        const label = document.createElement('label');
        label.textContent = 'Pic Max Width:';
        label.style.marginLeft = '27px';

        // 创建一个输入框
        const input = document.createElement('input');
        input.id = 'max-width-input';
        input.type = 'text';
        input.style.width = '50px';
        input.style.marginLeft = '5px';
        input.style.background = 'transparent'; // 透明背景
        input.style.border = 'none'; // 移除边框
        input.style.borderBottom = '1px solid #fff'; // 下划线样式
        input.style.outline = 'none'; // 移除焦点时的边框
        input.style.color = '#4f4e4e'; // 输入文字颜色
        input.style.fontWeight = 'bold';
        //input.style.fontSize = '14px'; // 字体大小
        input.style.textAlign = 'center'; // 文字居中
        input.addEventListener('change', function() {
            const value = input.value.trim();
            const images = document.querySelectorAll('.message-cell.message-cell--main img:not(.smilie)');
            //const images = document.querySelectorAll('.bbImageWrapper.js-lbImage img');
            if (value === '') {
                // 如果输入框为空，移除最大宽度限制
                images.forEach(img => img.style.maxWidth = '');
                localStorage.setItem(maxImgWidthKey, value);
            } else if (!isNaN(value) && value > 0) {
                // 如果输入的是数字，设置最大宽度
                images.forEach(img => img.style.maxWidth = value + 'px');
                localStorage.setItem(maxImgWidthKey, value);
                console.log("改变了图片最大尺寸");
            } else {
                // 如果输入的不是数字，清除输入框
                input.value = '';
            }
        });

        // 初始状态设置
        input.value=getMaxImgWidth();
        // 创建一个 change 事件
        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        // 触发 change 事件
        input.dispatchEvent(changeEvent);

        // 动态获取最大宽度
        function getMaxImgWidth() {
            return localStorage.getItem(maxImgWidthKey);
        }

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(label);
        containerDiv.appendChild(input);
        controlDiv.appendChild(containerDiv);
    }

    //第一个标题栏
    function createUserInfoLabel(){

        // 创建复选框标签
        const label = document.createElement('label');
        label.textContent = 'User Info Area';
        label.style.color = '#ffee9d'; // 输入文字颜色


        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);
    }

    //第二个标题栏
    function createPicLabel(){

        // 创建复选框标签
        const label = document.createElement('label');
        label.textContent = 'Better Pic Display';
        label.style.color = '#ffee9d'; // 输入文字颜色


        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);
    }


    //第三个标题栏
    function createSkipInfoLabel(){

        // 创建复选框标签
        const label = document.createElement('label');
        label.textContent = 'Skip Useless Stuff';
        label.style.color = '#ffee9d'; // 输入文字颜色


        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);
    }
    //每行显示一张图片
    function createCheckboxToDisplayOnePicPerLine(){

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'one-pic-per-line-checkbox';
        checkbox.style.marginLeft = '5px';

        // 创建复选框标签
        const label = document.createElement('label');
        label.htmlFor = 'one-pic-per-line-checkbox';
        label.textContent = 'One Pic Per Line';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);


        // 为复选框添加事件监听
        checkbox.addEventListener('change', function() {
            switchPicDisplayState();
            if (this.checked) {
                displayOnePic();//勾选每行一张图
            } else {
                displayMultiPics();//取消勾选恢复原状
            }
        });

        // 用于存储用户的选择状态
        const onePicKey = 'onePicKey';

        // 初始状态设置
        if (getOnePicState()) {
            checkbox.checked = true;
            displayOnePic();
        } else {
            checkbox.checked = false;
        }

        // 动态获取当前是否显示大图
        function getOnePicState() {
            return localStorage.getItem(onePicKey) === 'true';
        }

        // 动态切换是否显示大图
        function switchPicDisplayState(){
            const newState = !getOnePicState(); // 获取新的状态
            // 更新本地存储
            localStorage.setItem(onePicKey, newState.toString());
        }


        // 勾选时，把媒体改成display：block
        function displayOnePic(){
            //document.querySelectorAll('.bbImageWrapper, .bbMediaWrapper').forEach(function (el) {
            document.querySelectorAll('.bbImageWrapper,.inserted-img, .bbImage, .bbMediaWrapper').forEach(function (el) {
                el.style.display = 'block';
            });
        }

        // 取消勾选时，把媒体改成display：inline-block
        function displayMultiPics(){
            //document.querySelectorAll('.bbImageWrapper, .bbMediaWrapper').forEach(function (el) {
            document.querySelectorAll('.bbImageWrapper,.inserted-img, .bbImage, .bbMediaWrapper').forEach(function (el) {
                el.style.display = 'inline-block';
            });
        }
    }


    //把附件的图片改为全部显示而非填满
    function createCheckboxToChangeAttaImgDisplay(){
        /*
        //显示所有附件图片全部内容
        // 获取所有 .file-preview img 元素
        const images = document.querySelectorAll('.file-preview img');
        // 遍历并修改 object-fit 属性
        images.forEach(img => {
            img.style.objectFit = 'contain';
        });
        */


        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'attachment-pic-checkbox';
        checkbox.style.marginLeft = '5px';

        // 创建复选框标签
        const label = document.createElement('label');
        label.htmlFor = 'attachment-pic-checkbox';
        label.textContent = 'Enlarge Attachment Pics';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);


        // 为复选框添加事件监听
        checkbox.addEventListener('change', function() {
            switchBigPreviewState();
            if (this.checked) {
                displayBigPreview();//勾选展示大图
            } else {
                delBigPreview();//取消勾选删除大图
            }
        });

        // 用于存储用户的选择状态
        const bigPreviewKey = 'bigPreviewKey';

        // 初始状态设置
        if (getBigPreviewState()) {
            checkbox.checked = true;
            displayBigPreview();
        } else {
            checkbox.checked = false;
        }

        // 动态获取当前是否显示大图
        function getBigPreviewState() {
            return localStorage.getItem(bigPreviewKey) === 'true';
        }

        // 动态切换是否显示大图
        function switchBigPreviewState(){
            const newState = !getBigPreviewState(); // 获取新的状态
            // 更新本地存储
            localStorage.setItem(bigPreviewKey, newState.toString());
        }


        // 勾选时，为每个section中的a元素创建img并插入
        function displayBigPreview(){

            const insertedImgs=document.querySelectorAll('img.inserted-img');
            if(insertedImgs.length > 0){
                insertedImgs.forEach(img => {
                    img.style.display = '';
                });
            }else{
                document.querySelectorAll('section.message-attachments').forEach(section => {
                    section.querySelectorAll('a.file-preview.js-lbImage').forEach(link => {
                        const img = document.createElement('img');
                        img.src = link.href;
                        img.alt = 'Inserted Image';
                        let maxWidth = localStorage.getItem("maxImgWidthKey");
                        if (maxWidth !== null && maxWidth !="") {
                            img.style.maxWidth = maxWidth+"px"; // 设置图片宽度，可根据需要调整
                        }
                        img.style.height = 'auto';
                        img.style.margin = '5px';
                        img.classList.add('inserted-img'); // 添加标记类名方便后续删除
                        section.appendChild(img);
                    });
                });

            }
            const attaList = document.querySelectorAll('ul.attachmentList');
            attaList.forEach(atta => {
                atta.style.display = 'none';
            });
        }

        // 取消勾选时，删除所有标记的img元素
        function delBigPreview(){
            document.querySelectorAll('img.inserted-img').forEach(img => {
                img.style.display = 'none';
            });
            const attaList = document.querySelectorAll('ul.attachmentList');
            attaList.forEach(atta => {
                atta.style.display = '';
            });
        }
    }

    //隐藏用户信息的部分
    function createCheckboxToHideUserInfo(){
        // 用于存储用户的选择状态
        const hideUserInfoKey = 'hideUserInfo';

        // 动态获取当前的隐藏状态
        function getIsUserInfoHidden() {
            return localStorage.getItem(hideUserInfoKey) === 'true';
        }

        // 动态切换当前的隐藏状态
        function switchIsUserInfoHidden(){
            const newState = !getIsUserInfoHidden(); // 获取新的状态
            // 更新本地存储
            localStorage.setItem(hideUserInfoKey, newState.toString());
        }

        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hide-userinfo';
        checkbox.style.marginLeft = '5px';

        // 创建复选框标签
        const label = document.createElement('label');
        label.htmlFor = 'hide-userinfo';
        label.textContent = 'Hide User Info';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);


        // 为复选框添加事件监听
        checkbox.addEventListener('change', function() {
            toggleVisibility();
        });

        // 初始状态设置
        if (getIsUserInfoHidden()) {
            checkbox.checked = true;
            document.querySelectorAll('.message-userExtras').forEach(element => {
                element.style.display = 'none';
            });
        } else {
            checkbox.checked = false;
        }



        // 切换隐藏状态的函数
        function toggleVisibility() {
            const newState = !getIsUserInfoHidden(); // 获取新的状态
            // 更新本地存储
            localStorage.setItem(hideUserInfoKey, newState.toString());
            // 更新元素的显示状态
            document.querySelectorAll('.message-userExtras').forEach(element => {
                element.style.display = newState ? 'none' : '';
            });
        }

    }





    //用于控制向前跳还是向后跳
    function createCheckboxToAutoJumpBackward(){
        // 检查localStorage中是否存在autoJumpBackward变量，若不存在则初始化为false
        if (localStorage.getItem('autoJumpBackward') === null) {
            localStorage.setItem('autoJumpBackward', 'false');
        }

        // 创建一个勾选框
        const checkbox2 = document.createElement('input');
        checkbox2.type = 'checkbox';
        checkbox2.id = 'autoJumpBackward';
        checkbox2.style.marginLeft = '5px';

        // 根据localStorage的值设置勾选框的初始状态
        if (localStorage.getItem('autoJumpBackward') === 'true') {
            checkbox2.checked = true;
        } else {
            checkbox2.checked = false;
        }

        // 创建一个标签用于描述勾选框
        const label2 = document.createElement('label');
        label2.htmlFor = 'autoJumpBackward';
        label2.textContent = 'Skip Backward';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');
        containerDiv.id = 'autoJumpContainer';
        containerDiv.style.marginLeft = '10px';

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox2);
        containerDiv.appendChild(label2);
        controlDiv.appendChild(containerDiv);

        // 添加事件监听器，更新localStorage的值
        checkbox2.addEventListener('change', function() {
            localStorage.setItem('autoJumpBackward', this.checked ? 'true' : 'false');
        });
    }



    //用于控制是否跳转纯文字页面
    function createCheckboxToAutoJumpTextOnlyPage(){
        // 检查localStorage中是否存在autoJumpTextOnlyPage变量，若不存在则初始化为false
        if (localStorage.getItem('autoJumpTextOnlyPage') === null) {
            localStorage.setItem('autoJumpTextOnlyPage', 'false');
        }

        // 创建一个勾选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autoJumpCheckbox';
        checkbox.style.marginLeft = '5px';

        // 根据localStorage的值设置勾选框的初始状态
        if (localStorage.getItem('autoJumpTextOnlyPage') === 'true') {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        // 创建一个标签用于描述勾选框
        const label = document.createElement('label');
        label.htmlFor = 'autoJumpCheckbox';
        label.textContent = 'Autoskip Textonly Pages';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');
        containerDiv.id = 'autoJumpcontainer2';
        containerDiv.style.marginLeft = '10px';

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.appendChild(containerDiv);

        // 添加事件监听器，更新localStorage的值
        checkbox.addEventListener('change', function() {
            localStorage.setItem('autoJumpTextOnlyPage', this.checked ? 'true' : 'false');
        });

    }









    //隐藏没有图片或视频的post
    function createCheckboxToHideTextOnlyPost(){

        // 用于存储用户的选择状态
        const hideTextOnlyKey = 'hideTextOnlyPost';

        // 检查localStorage中是否存在autoJumpTextOnlyPage变量，若不存在则初始化为false
        if (localStorage.getItem(hideTextOnlyKey) === null) {
            localStorage.setItem(hideTextOnlyKey, 'false');
        }

        // 创建一个勾选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'hideTextOnlyPostCheckbox';
        checkbox.style.marginLeft = '5px';

        // 根据localStorage的值设置勾选框的初始状态
        if (getTextIsHidden()) {
            checkbox.checked = true;
            HideTextOnlyPosts();
        } else {
            checkbox.checked = false;
            ShowAllPosts();
        }

        // 创建一个标签用于描述勾选框
        const label = document.createElement('label');
        label.htmlFor = 'hideTextOnlyPostCheckbox';
        label.textContent = 'Hide Textonly Post';

        // 创建一个div装他们
        const containerDiv = document.createElement('div');

        // 将复选框和标签添加到div中
        const controlDiv = document.getElementById('custom-control-div');
        const subDiv = document.getElementById('autoJumpcontainer2');
        containerDiv.appendChild(checkbox);
        containerDiv.appendChild(label);
        controlDiv.insertBefore(containerDiv, subDiv);

        // 添加事件监听器，更新localStorage的值
        checkbox.addEventListener('change', function() {
            toggleTextOnlyPost();
        });

        // 动态获取当前的隐藏状态
        function getTextIsHidden() {
            return localStorage.getItem(hideTextOnlyKey) === 'true';
        }

        // 切换隐藏状态的函数
        function toggleTextOnlyPost() {
            const newState = !getTextIsHidden(); // 获取新的状态

            // 更新本地存储
            localStorage.setItem(hideTextOnlyKey, newState.toString());

            // 更新元素的显示状态
            if(newState){
                HideTextOnlyPosts();
            }else{
                ShowAllPosts();
            }
        }

        //隐藏只有文字的帖子
        function HideTextOnlyPosts() {
            //显示额外选项
            const container = document.getElementById('autoJumpContainer');
            container.style.display = '';
            const container2 = document.getElementById('autoJumpcontainer2');
            container2.style.display = '';

            // 获取所有符合条件的article元素
            const articles = document.querySelectorAll('article.message.message--post.js-post.js-inlineModContainer');
            var textPostCount=0;
            var nonTextPostCount=0;

            articles.forEach(article => {
                // 获取每个article中的message-content元素
                const content = article.querySelector('.message-content.js-messageContent');
                if (content) {
                    // 检查message-content中是否存在video元素
                    const hasVideo = content.querySelector('video') !== null;

                    // 检查message-content中是否存在iframe元素
                    const hasIframe = content.querySelector('iframe') !== null;

                    // 检查message-content中是否存在非emoji的img元素
                    var hasValidImage = Array.from(content.querySelectorAll('img')).some(img => {
                        // 检查img元素的class属性是否包含"emoji"字样
                        return !img.className.includes('smilie');
                    });


                    //如果想连图片也跳过，用下面这句
                    //hasValidImage=false;

                    // 如果没有视频且没有非emoji的图片，则隐藏整个article
                    if (!hasVideo && !hasValidImage&& !hasIframe) {
                        textPostCount+=1;
                        article.style.display = 'none';
                    }else{
                        nonTextPostCount+=1;
                    }
                }
            });
            //如果是纯文字页面，自动跳转下一页
            if(nonTextPostCount==0){
                setTimeout(autoClickNextPage, 1000);
            }
            console.log("隐藏了"+textPostCount+"篇");
        }

        //显示所有帖子
        function ShowAllPosts() {
            //隐藏额外选项
            const container = document.getElementById('autoJumpContainer');
            container.style.display = 'none';
            const container2 = document.getElementById('autoJumpcontainer2');
            container2.style.display = 'none';
            // 获取所有符合条件的article元素
            const articles = document.querySelectorAll('article.message.message--post.js-post.js-inlineModContainer');
            articles.forEach(article => {
                article.style.display = '';
            });
        }

        // 自动跳转下一页
        function autoClickNextPage() {
            // 获取勾选框
            const checkbox = document.getElementById('autoJumpCheckbox');
            if (!checkbox) {
                console.warn('未找到勾选框，脚本无法运行。');
                return;
            }
            const checkbox2 = document.getElementById('autoJumpBackward');
            if (!checkbox2) {
                console.warn('未找到往前翻勾选框，脚本无法运行。');
                return;
            }

            // 如果勾选框被选中
            if (checkbox.checked) {
                // 查找页面上第一个class="pageNav-jump pageNav-jump--next"的<a>元素
                var nextLink;
                if(checkbox2.checked){
                    nextLink = document.querySelector('a.pageNav-jump.pageNav-jump--prev');
                }else{
                    nextLink = document.querySelector('a.pageNav-jump.pageNav-jump--next');
                }
                if (nextLink) {
                    console.log('自动点击下一页按钮');
                    nextLink.click(); // 模拟点击
                } else {
                    console.warn('未找到下一页按钮');
                }
            }
        }
    }








    //替换视频的部分
    function replaceUnplayableVideos(){
        var easterEggPoster = document.getElementsByClassName("video-easter-egg-poster");
        var videoDiv=[];
        var imageUrl;
        var newDiv;
        var baseVideoUrl;

        if(easterEggPoster.length==0){
            //console.log("官方时间，无需替换");
            //把官方时间的视频放大然后静音
            enlargeAndMuteVideo();
            return;
        }else if(easterEggPoster.length>5){
            autoSwitchInterval=5000;
        }


        //替换预览照片为视频播放器
        for (let i=easterEggPoster.length-1;i>-1;i--){
            let videoUrl
            imageUrl =easterEggPoster[i].children[0].src;
            videoUrl=imageUrl.replace("attachments/posters","video").replace("/lsvideo/thumbnails","lsvideo/videos").replace(".jpg",".mp4");


            videoDiv[i]=`<video onloadstart="this.volume=${volume}" style="width:800px; max-height: 750px;" controls=\"\" data-xf-init=\"video-init\" data-poster=\"${imageUrl}\" class=\"\" style=\"\" poster=\"${imageUrl}\"><source data-src=\"${videoUrl}\" src=\"${videoUrl}\"><div class=\"bbMediaWrapper-fallback\">Your browser is not able to display this video.</div></video>`;

            //videoDiv[i]=`<video controls=\"\" data-xf-init=\"video-init\" data-poster=\"${imageUrl}\" class=\"\" style=\"\" poster=\"${imageUrl}\"><source data-src=\"${videoUrl}\" src=\"${videoUrl}\"><div class=\"bbMediaWrapper-fallback\">Your browser is not able to display this video.</div></video>`;


            newDiv = document.createElement("div");
            newDiv.setAttribute("class","newVideoDiv");
            newDiv.innerHTML=videoDiv[i];
            easterEggPoster[i].parentElement.parentElement.append(newDiv);
            //console.log("正在插入第几条："+i+",url："+videoUrl)
            easterEggPoster[i].parentElement.parentElement.append(createButton("mov",i));
            easterEggPoster[i].parentElement.parentElement.append(createButton("m4v",i));
            easterEggPoster[i].parentElement.parentElement.append(createButton("mp4",i));
        }

        //删除easterEggPoster
        for (let i=easterEggPoster.length-1;i>-1;i--){
            easterEggPoster[i].parentElement.parentElement.removeChild(easterEggPoster[i].parentElement);
        }

        //删除video-easter-egg-blocker
        var easterEggBlocker = document.getElementsByClassName("video-easter-egg-blocker");
        for (let i=easterEggBlocker.length-1;i>-1;i--){
            easterEggBlocker[i].parentElement.removeChild(easterEggBlocker[i]);
        }

        //删除video-easter-egg-overlay
        var easterEggOverlay = document.getElementsByClassName("video-easter-egg-overlay");
        for (let i=easterEggOverlay.length-1;i>-1;i--){
            easterEggOverlay[i].parentElement.removeChild(easterEggOverlay[i]);
        }

        /**
    //调小音量
    var allVideoPlayers = document.getElementsByTagName('video');
    for (let i=allVideoPlayers.length-1;i>-1;i--){
        allVideoPlayers[i].volume = volume;
    }
**/

        //把官方时间的视频放大然后静音
        enlargeAndMuteVideo();

        // 延时后开始检查视频
        setTimeout(checkVideosAndUpdate, autoSwitchInterval);
    }

    //创建按钮
    function createButton(format,entryId){
        var inp;
        inp = document.createElement("input");
        inp.type = "button";
        inp.value = format;
        inp.id = entryId;
        inp.addEventListener('click', function () {
            //点击任何手动切换后缀按钮，即停止自动切换后缀
            shouldContinue = false;
            //console.log('停止切换后缀');
            //切换后缀
            var oldUrl = document.getElementsByClassName("newVideoDiv")[this.id].innerHTML;
            document.getElementsByClassName("newVideoDiv")[this.id].innerHTML=oldUrl.replaceAll("mp4",format).replaceAll("m4v",format).replaceAll("mov",format);
        });
        return inp;
    }


    // 定义一个函数，用于遍历所有 video 元素并检查其 readyState
    function checkVideosAndUpdate() {
        // 如果点击了停止按钮，则不再继续执行
        if (!shouldContinue) return;

        // 获取页面上所有的 video 元素
        const videoElements = document.querySelectorAll('video');

        let allLoaded = true;
        let failCount=0;
        // 遍历所有 video 元素
        videoElements.forEach(videoElement => {
            // 获取当前视频的 readyState
            const state = videoElement.readyState;

            // 如果视频的 readyState 不是 4（HAVE_ENOUGH_DATA），说明视频还没有加载完成
            if (state !== 4) {
                failCount+=1;
                allLoaded = false;

                // 获取视频中的所有 source 标签
                const sources = videoElement.querySelectorAll('source');
                sources.forEach(source => {
                    // 获取当前 source 的 src 和 data-src 属性
                    const currentSrc = source.src || source.getAttribute('data-src');

                    // 根据原视频格式替换为对应的新格式
                    let newSrc = currentSrc;
                    if (currentSrc.endsWith('.mp4')) {
                        newSrc = currentSrc.replace('.mp4', '.mov');
                    } else if (currentSrc.endsWith('.mov')) {
                        newSrc = currentSrc.replace('.mov', '.m4v');
                    } else if (currentSrc.endsWith('.m4v')) {
                        newSrc = currentSrc.replace('.m4v', '.mp4');
                    }

                    // 更新 source 的 src 和 data-src 属性为新的链接
                    //console.log(`替换视频链接: ${currentSrc} 为 ${newSrc}`);
                    source.src = newSrc;
                    source.setAttribute('data-src', newSrc);
                });

                // 重新加载视频
                videoElement.load();
            }
        });

        // 如果还有未加载完成的 video，则延时 2 秒再次执行
        if (!allLoaded) {
            //console.log(failCount+"条视频加载失败，稍后切换后缀重试");
            setTimeout(checkVideosAndUpdate, autoSwitchInterval);
        } else {
            //console.log("所有视频都已加载完成！");
        }
    }

    //把官方时间的视频放大然后静音
    function enlargeAndMuteVideo(){
        // 获取页面上所有的 video 元素
        const videos = document.querySelectorAll('video');
        var count=0;
        videos.forEach(video => {
            const parent = video.parentElement;

            // 检查父元素的 className 是否不是 'newVideoDiv'
            if (parent.className !== 'newVideoDiv') {
                count+=1;
                // 设置 video 的样式
                video.style.width = '800px';
                video.style.maxHeight = '750px';

                // 设置 video 的音量为 0
                video.volume = volume;

                // 将 video 提升到父元素的同级位置，并放在父元素前面
                parent.before(video);
                parent.remove();
            }
        });
        console.log("放大了"+count+"个视频");

        //把包着video的div的宽度也设置大点
        const elements = document.querySelectorAll('div.bbMediaWrapper.bbMediaWrapper--inline');
        elements.forEach(el => {
            el.style.width = '800px';
        });

    }


    //滚动到最后自动换页
    function scrollToNextPage(){
        let timeoutId = null; // 用于存储定时器的ID

        window.addEventListener('scroll', function() {
            // 清除之前的定时器
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // 获取页面的总高度
            var totalHeight = document.documentElement.scrollHeight;
            // 获取当前窗口的高度
            var windowHeight = window.innerHeight;
            // 获取当前滚动的位置
            var scrollPosition = window.pageYOffset + windowHeight;

            // 判断是否滚动到页面底部
            if (scrollPosition >= totalHeight) {
                // 设置一个定时器，在等待后点击下一页
                timeoutId = setTimeout(autoClickNextPage, 1000);
            }
        });

        // 自动跳转下一页
        function autoClickNextPage() {
            const checkbox2 = document.getElementById('autoJumpBackward');
            if (!checkbox2) {
                console.warn('未找到往前翻勾选框，脚本无法运行。');
                return;
            }

            // 查找页面上第一个class="pageNav-jump pageNav-jump--next"的<a>元素
            var nextLink;
            if(checkbox2.checked){
                nextLink = document.querySelector('a.pageNav-jump.pageNav-jump--prev');
            }else{
                nextLink = document.querySelector('a.pageNav-jump.pageNav-jump--next');
            }
            if (nextLink) {
                console.log('自动点击下一页按钮');
                nextLink.click(); // 模拟点击
            } else {
                console.warn('未找到下一页按钮');
            }

        }
    }
})();