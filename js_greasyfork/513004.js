// ==UserScript==
// @name         粤语划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  快捷粤语翻译查询
// @author       口吃者
// @match        http://*/*
// @include      https://*/*
// @include      file:///*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shyyp.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @require      https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513004/%E7%B2%A4%E8%AF%AD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/513004/%E7%B2%A4%E8%AF%AD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==
const shyypTokenUrl = 'https://shyyp.net/api/gqgq2';
const shyypLongScriptUrl = 'https://shyyp.net/romanizer';//长文注音
const shyypConvertUrl = 'https://shyyp.net/translator';//粤普转换
const shyypSingleWorldUrl = 'https://shyyp.net/w/';
const shyypIconUrl = 'https://img.picui.cn/free/2024/10/25/671b96c09fe69.png'
const shyypIconMosaicUrl = 'https://img.picui.cn/free/2024/10/25/671b96c14d5cc.png'
const shyypIconOnlyHeadUrl = 'https://img.picui.cn/free/2024/10/25/671b96c1c28f3.png'
const yueyuemaoSingleWordUrl = 'https://www.yueyumao.com/detail/';
const yueyuemaoPhraseUrl = 'https://www.yueyumao.com/search.php?q=';
const yueyuemaoLongScriptUrl = 'https://www.yueyumao.com/';
const yueyuemaoIconCat01 = 'https://img.picui.cn/free/2024/10/26/671cb240d0071.png';
const yueyuemaoIconCat02 = 'https://img.picui.cn/free/2024/10/26/671cb240cf59a.png';
const yueyuemaoIconCat03 = 'https://img.picui.cn/free/2024/10/26/671cb240c851a.png';
const moreIconUrl = 'https://img.picui.cn/free/2024/10/26/671c6876ed78d.png';
let textEncry = '';
let selected;// 当前选中文本
let pageX;// 图标显示的 X 坐标
let pageY;// 图标显示的 Y 坐标
const dragFluctuation = 4;// 当拖动多少像素以上时不触发查询
const zIndex = '2147473647'; // 渲染图层
/**鼠标拖动*/
class Drag {
    constructor(element) {
        this.dragging = false;
        this.startDragTime = 0;
        this.stopDragTime = 0;
        this.mouseDownPositionX = 0;
        this.mouseDownPositionY = 0;
        this.elementOriginalLeft = parseInt(element.style.left);
        this.elementOriginalTop = parseInt(element.style.top);
        this.backAndForthLeftMax = 0;
        this.backAndForthTopMax = 0;
        this.element = element;

        // 绑定事件处理函数
        // 事件处理函数由dom元素调用，一般是指向dom元素，强制绑定到Drag类上
        this.startDrag = this.startDrag.bind(this);
        this.dragElement = this.dragElement.bind(this);
        this.stopDrag = this.stopDrag.bind(this);

        // 添加鼠标事件监听器
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.element.addEventListener('mousedown', this.startDrag);
    }

    detachEventListeners() {
        window.removeEventListener('mousemove', this.dragElement);
        window.removeEventListener('mouseup', this.stopDrag);
    }

    startDrag(e) {
        //阻止默认鼠标事件，比如选中文字
        e.preventDefault();
        this.dragging = true;
        this.startDragTime = new Date().getTime();
        this.mouseDownPositionX = e.clientX;
        this.mouseDownPositionY = e.clientY;
        this.elementOriginalLeft = parseInt(this.element.style.left);
        this.elementOriginalTop = parseInt(this.element.style.top);
        this.backAndForthLeftMax = 0;
        this.backAndForthTopMax = 0;

        // 设置全局鼠标事件
        window.addEventListener('mousemove', this.dragElement);
        window.addEventListener('mouseup', this.stopDrag);
        log('startDrag');
    }

    stopDrag(e) {
        e.preventDefault();
        this.dragging = false;
        this.stopDragTime = new Date().getTime();
        this.detachEventListeners();
        log('stopDrag');
    }

    dragElement(e) {
        log('dragging');
        if (!this.dragging) {
            return;
        }
        e.preventDefault();

        // 移动元素
        this.element.style.left = `${this.elementOriginalLeft + (e.clientX - this.mouseDownPositionX)}px`;
        this.element.style.top = `${this.elementOriginalTop + (e.clientY - this.mouseDownPositionY)}px`;

        // 获取最大移动距离
        let left = Math.abs(this.elementOriginalLeft - parseInt(this.element.style.left));
        let top = Math.abs(this.elementOriginalTop - parseInt(this.element.style.top));

        //更新最大移动距离
        if (left > this.backAndForthLeftMax) {
            this.backAndForthLeftMax = left;
        }
        if (top > this.backAndForthTopMax) {
            this.backAndForthTopMax = top;
        }
        log('dragElement');
    }
}
(function() {
    'use strict';
    const icon = document.createElement('tr-icon');// 翻译图标
    icon.id = 'cantonese_translate';
    icon.style.cssText = 'display: none;top: 186px;left: 37px;position: absolute;z-index: 2147473647;cursor:move;';
    const imgShyyp = getImg(shyypIconUrl, 'shyyp', '羊羊粤语-长文注音');
    const imgShyyp01 = getImg(shyypIconMosaicUrl, 'shyyp01', '羊羊粤语-单字查询');
    const imgShyyp02 = getImg(shyypIconOnlyHeadUrl, 'shyyp03', '羊羊粤语-粤普转换');
    const imgYueyuemao = getImg(yueyuemaoIconCat01, 'yueyuemao', '粤语猫-长文注音');
    const imgYueyuemao01 = getImg(yueyuemaoIconCat02, 'yueyuemao01', '粤语猫-单字查询');
    const imgYueyuemao02 = getImg(yueyuemaoIconCat03, 'yueyuemao02', '粤语猫-关联词组');
    const ifMore = getImg(moreIconUrl, 'more', '更多-折叠其后功能)');
    const iconsArray = [
        {id:1, iconEle: imgShyyp, name: imgShyyp.getAttribute('title'), mouseupFuc: longscriptPopup}, 
        {id:2, iconEle: imgShyyp01, name: imgShyyp01.getAttribute('title'), mouseupFuc: singleWorldPopup},
        {id:3, iconEle: imgShyyp02, name: imgShyyp02.getAttribute('title'), mouseupFuc: toMandarionOrCantonese}, 
        {id:7, iconEle: ifMore, name: ifMore.getAttribute('title'), mouseupFuc: showMore},
        {id:4, iconEle: imgYueyuemao, name: imgYueyuemao.getAttribute('title'), mouseupFuc: longscriptQueryYueYueMao}, 
        {id:5, iconEle: imgYueyuemao01, name: imgYueyuemao01.getAttribute('title'), mouseupFuc: singleWordQueryYueYueMao}, 
        {id:6, iconEle: imgYueyuemao02, name: imgYueyuemao02.getAttribute('title'), mouseupFuc: phraseCorrelationYueYueMao}
    ];
    const sortOrder = GM_getValue('sortOrder', iconsArray.map(icon => icon.id));
    const hideConfig = GM_getValue('hideConfig', {});
    const customIcons = getCustomMadeIconArray(sortOrder);
    let isIconImgMore = false;
    customIcons.forEach(iconCustom => {
        const iconEleNew = iconCustom.iconEle;
        iconEleNew.addEventListener('mouseup', iconCustom.mouseupFuc);
        if (isIconImgMore) {
            iconEleNew.setAttribute('is-more', 'true');
        }
        if (iconCustom.id === 7) {
            isIconImgMore = true;
        }
        if (!hideConfig[iconCustom.id]) {
            icon.appendChild(iconEleNew);
        }
    });

    // 绑定图标拖动事件
    const iconDrag = new Drag(icon);
    //区分拖动和点击事件，有足够位移才触发窗口事件
    document.body.appendChild(icon);
    // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
    document.addEventListener('mouseup', showIcon);
    // 选中变化事件
    document.addEventListener('selectionchange', showIcon);
    document.addEventListener('touchend', showIcon);
    //粤普转换自动化操作
    window.onload = () =>{
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('selectedText', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("#stage0");
            textareaEle.value = selected;
        } ,shyypConvertUrl)
        checkUrlAndExecute(async function auto() {
            selected = await GM.getValue('selectedText', '');
            await new Promise(resolve => setTimeout(resolve, 200));
            var textareaEle = document.querySelector("#hanzi_string");
            textareaEle.value = selected;
            await new Promise(resolve => setTimeout(resolve, 200));
            var butttonSubmit = document.querySelector("#form_1 button");
            butttonSubmit.click();
        } ,yueyuemaoLongScriptUrl)
    }
    const listItems = customIcons.map((icon, index) => (
        `
        <li data-index="${index}" draggable="true">
            ${icon.name}
            <input data-id="${icon.id}" type="checkbox" ${hideConfig[icon.id] ? '' : 'checked'}>
        </li>`
    )).join('');
    GM_registerMenuCommand("功能定制化", function() {
        Swal.fire({
            title: '个性化',
            html: `
                <div id="swIconDiv" style="max-height: 300px; overflow: auto;">
                    <ul id="iconList" style="list-style-type:none; margin:0; padding:20px;">
                        ${listItems}
                    </ul>
                </div>
                <p style="font-size: small;color: #A7A7A7">拖动调整顺序,确认后刷新生效</p>
                `,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            denyButtonText: `重置`,
            didOpen: () => {
                // 在弹窗完全打开后初始化拖放功能
                const iconList = document.getElementById('iconList');

                iconList.addEventListener('dragstart', dragStartHandler);
                iconList.addEventListener('drop', dropHandler);
                iconList.addEventListener('dragover', dragOverHandler);

                // 在拖动结束时移除样式
                iconList.addEventListener('dragend', dragEndHandler);

                // 设置可拖动属性
                Array.from(iconList.children).forEach(item => {
                    item.draggable = true;
                });
            },
            willClose: () => {
                // 在关闭前清除事件监听器以防止内存泄漏
                const iconList = document.getElementById('iconList');
                iconList.removeEventListener('dragstart', dragStartHandler);
                iconList.removeEventListener('drop', dropHandler);
                iconList.removeEventListener('dragover', dragOverHandler);
                iconList.removeEventListener('dragend', dragEndHandler);
            },
            preConfirm: () => {
                document.querySelectorAll('#iconList input').forEach(hideInput => {
                    if (!hideInput.checked) {
                        hideConfig[parseInt(hideInput.getAttribute('data-id'))] = true;
                    }else {
                        delete hideConfig[parseInt(hideInput.getAttribute('data-id'))];
                    }
                });
                GM_setValue('hideConfig', hideConfig);
                return {
                    updatedIcons: customIcons.slice() // 返回修改后的图标数组副本
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const ids = result.value.updatedIcons.map(({id}) => id);
                GM_setValue('sortOrder', ids);
                console.log(result.value.updatedIcons); // 打印调整后的图标顺序
            } else if (result.isDenied) {
                GM_setValue('sortOrder', iconsArray.map(icon => icon.id));
                GM_setValue('hideConfig', {});
            }
        });
    });


    var cssText = `
        #cantonese_translate img:hover{
            cursor:pointer;
        }
        #cantonese_translate img:hover{
            border:1px solid #1ABB27
        }
        #cantonese_translate img{
            cursor:pointer;
            display:inline-block;
            width:20px;
            height:20px;
            border:1px solid #dfe1e5;
            border-radius:4px;
            background-color:rgba(255,255,255,1);
            padding:2px;
            margin:0;
            margin-right:5px;
            box-sizing:content-box;vertical-align:middle
        }
        #iconList li:hover{
            cursor:pointer;
            border:1px solid #1ABB27;
        }
        #swIconDiv + p:hover{
            background-color: lightgoldenrodyellow;
            font-weight:bold;
        }
    `
    GMaddStyle(cssText);
    /*  获取长文注音路径参数x请求的json*/
    function createMutationJson(srcValue) {
        const queryTemplate = `mutation Submit($src: String!){ submitSrc(src: $src) }`;
        const variables = { src: srcValue };
        const query = `{"query":"${queryTemplate}","variables":${JSON.stringify(variables)}}`;
        return JSON.parse(query);
    }
    async function sendPostRequest(url, data) {
        const body = JSON.stringify(data);
        const headers = new Headers({
            'Content-Type': 'application/json'
        });
        const options = {
            method: 'POST',
            headers,
            body
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    }
    function sendPostRequestWithGM(url, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }
    /* 长文获取整页html,目前不需要 */
    async function sendGetRequestHtml(urlBase, param) {
        const url = new URL(urlBase);
        url.searchParams.set('x', param);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            return htmlContent;
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    }
    function getImg(src01, alt01, title01, options = {}) {
        // 创建一个新的 img 元素
        const img = document.createElement('img');
        // 设置 img 元素的基本属性
        img.src = src01;
        img.alt = alt01;
        img.title = title01;
        // 设置额外的属性
        if (options.width) {
            img.width = options.width;
        }
        if (options.height) {
            img.height = options.height;
        }
        if (options.className) {
            img.className = options.className;
        }
        if (options.style) {
            Object.keys(options.style).forEach(key => {
                img.style[key] = options.style[key];
            });
        }
        // 返回创建的 img 元素
        return img;
    }
    /** 弹出居中窗口 */
    function popupCenter(url, title = '_blank', w, h) {
        // 检查参数有效性
        if (!url || typeof url !== 'string') {
            console.error('Invalid URL provided');
            return null;
        }

        // 设置默认标题和窗口尺寸
        title = title || '_blank';
        w = Math.min(w, screen.availWidth);
        h = Math.min(h, screen.availHeight);

        // 计算居中位置
        let x = (screen.availWidth - w) / 2;
        let y = (screen.availHeight - h) / 2;

        // 确保窗口不会超出屏幕边界
        x = Math.max(x, 0);
        y = Math.max(y, 0);

        // 打开新窗口
        let win;
        try {
            win = window.open(url, title, `width=${w},height=${h},left=${x},top=${y}`);
            if (win) {
                win.focus();
                let closeNewWindow =  window.addEventListener('focus', function() {
                    win.close();
                    window.removeEventListener('focus', closeNewWindow);
                });
            } else {
                throw new Error('Failed to open the window');
            }
        } catch (e) {
            console.error('Error opening the window:', e);
        }

        return win;
    }
    /**显示 icon*/
    function showIcon(e) {
        log('showIcon event:', e);
        let offsetX = -100; // 横坐标翻译图标偏移
        let offsetY = -40; // 纵坐标翻译图标偏移
        // 更新翻译图标 X、Y 坐标
        if (e.pageX && e.pageY) { // 鼠标
            log('mouse pageX/Y');
            pageX = e.pageX;
            pageY = e.pageY;
        }
        if (e.changedTouches) { // 触屏
            if (e.changedTouches.length > 0) { // 多点触控选取第 1 个
                log('touch pageX/Y');
                pageX = e.changedTouches[0].pageX;
                pageY = e.changedTouches[0].pageY;
                // 触屏修改翻译图标偏移（Android、iOS 选中后的动作菜单一般在当前文字顶部，翻译图标则放到底部）
                offsetX = -26; // 单个翻译图标块宽度
                offsetY = 16 * 3; // 一般字体高度的 3 倍，距离系统自带动作菜单、选择光标太近会导致无法点按
            }
        }
        log(`selected:${selected}, pageX:${pageX}, pageY:${pageY}`)
        if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon)) { // 点击了翻译图标
            e.preventDefault();
            return;
        }
        selected = window.getSelection().toString().trim(); // 当前选中文本
        GM_setValue('selectedText', selected);
        log(`selected:${selected}, icon display:${icon.style.display}`);
        if (selected && icon.style.display != 'block' && pageX && pageY) { // 显示翻译图标
            log('show icon');
            icon.style.top = `${pageY + offsetY}px`;
            icon.style.left = `${pageX + offsetX}px`;
            icon.style.display = 'block';
            // 兼容部分 Content Security Policy
            icon.style.position = 'absolute';
            icon.style.zIndex = zIndex;
        } else if (!selected) { // 隐藏翻译图标
            log('hide icon');
            hideIcon();
        }
    }
    /**隐藏 icon*/
    function hideIcon() {
        icon.style.display = 'none';
        pageX = 0;
        pageY = 0;
        icon.querySelectorAll('img[is-more]').forEach(ele => {
            ele.style.display = 'none';
        });
    }
    /* 长文注音弹出 */
    async function longscriptPopup(){
        try {
            const response = await sendPostRequestWithGM(shyypTokenUrl, createMutationJson(selected));
            textEncry = response.data.submitSrc;
            console.log(textEncry);
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(`${shyypLongScriptUrl}?x=${textEncry}`, '长文注音', 1024, 800);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    /* 单字弹出 */
    async function singleWorldPopup(){
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(`${shyypSingleWorldUrl}${selected}`, '单字查询', 1024, 800);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    /* 粤普转换弹出 */
    async function toMandarionOrCantonese(){
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(shyypConvertUrl, '粤普转换', 1024, 800);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    /* 粤粤猫 单字查询 */
    async function singleWordQueryYueYueMao(){
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(`${yueyuemaoSingleWordUrl}${selected}.html`, '单字查询', 1024, 800);
            }
        } catch(error) {}
    }
    /* 粤粤猫 长文注音 */
    async function longscriptQueryYueYueMao(){
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(yueyuemaoLongScriptUrl, '长文注音', 1024, 800);
            }
        } catch(error) {}
    }

    /* 粤粤猫 关联词组 */
    async function phraseCorrelationYueYueMao(){
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            if (iconDrag.backAndForthLeftMax <= dragFluctuation && iconDrag.backAndForthTopMax <= dragFluctuation) {
                popupCenter(`${yueyuemaoPhraseUrl}${selected}`, '长文注音', 1024, 800);
            }
        } catch(error) {}
    }
    /* 新窗口自动化操作 */
    function checkUrlAndExecute(customFunction, targetUrl) {
        // 获取当前页面的完整URL
        const currentUrl = window.location.href;
        
        // 检查当前URL是否与目标URL相等
        if (currentUrl === targetUrl) {
            // 如果URL匹配，则执行自定义函数
            customFunction();
        }
    }
    /* 返回定制化顺序的图标数组 */
    function getCustomMadeIconArray(defaultOrder) {
        // 根据 defaultOrder 排序图标数组
        console.log(defaultOrder)
        //排序逻辑是通过比较 a 和 b 的 id 在 defaultOrder 数组中的索引来决定的,与id大小无关
        const sortedIcons = iconsArray.filter(icon => defaultOrder.includes(icon.id))
                                 .sort((a, b) => defaultOrder.indexOf(a.id) - defaultOrder.indexOf(b.id));
        return sortedIcons;
    }
    /* 更多 */
    function showMore() {
        icon.querySelectorAll('img[is-more]').forEach(ele => {
            if (ele.style.display == 'inline-block') {
                ele.style.display = 'none';
            } else {
                ele.style.display = 'inline-block';
            }
        });
    }
    function arrayMove(arr, fromIndex, toIndex) {
        const element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
        return arr;
    }
/*     function setupIconList() {
        const sortOrder = GM_getValue('sortOrder', iconsArray.map(icon => icon.id));
        const hideConfig = GM_getValue('hideConfig', {});

        const icons = getCustomMadeIconArray(sortOrder);

        // 清空现有的图标列表
        document.querySelectorAll('.icon-item').forEach(ele => ele.remove());

        // 重新渲染图标列表
        icons.forEach((icon, index) => {
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';

            const upButton = document.createElement('button');
            upButton.textContent = '⬆️';
            upButton.onclick = function() {
                if (index > 0) {
                    const newIcons = arrayMove(icons, index, index - 1);
                    const newSortOrder = newIcons.map(i => i.id);
                    GM_setValue('sortOrder', newSortOrder);
                    setupIconList(); // 重新设置图标列表
                }
            };

            const downButton = document.createElement('button');
            downButton.textContent = '⬇️';
            downButton.onclick = function() {
                if (index < icons.length - 1) {
                    const newIcons = arrayMove(icons, index, index + 1);
                    const newSortOrder = newIcons.map(i => i.id);
                    GM_setValue('sortOrder', newSortOrder);
                    setupIconList(); // 重新设置图标列表
                }
            };

            const toggleVisibilityButton = document.createElement('button');
            toggleVisibilityButton.textContent = hideConfig[icon.id] ? '显示' : '隐藏';
            toggleVisibilityButton.onclick = function() {
                if (toggleVisibilityButton.textContent === '隐藏') {
                    hideConfig[icon.id] = true;
                    toggleVisibilityButton.textContent = '显示';
                } else {
                    delete hideConfig[icon.id];
                    toggleVisibilityButton.textContent = '隐藏';
                }
                GM_setValue('hideConfig', hideConfig);
                setupIconList(); // 重新设置图标列表
            };

            const iconLabel = document.createElement('span');
            iconLabel.className = 'icon-name';
            iconLabel.textContent = icon.name;

            iconItem.appendChild(upButton);
            iconItem.appendChild(downButton);
            iconItem.appendChild(toggleVisibilityButton);
            iconItem.appendChild(iconLabel);

            document.body.appendChild(iconItem);
        });
    } */
    function swapIcons(index1, index2) {
        // 获取图标列表
        if(index1 === index2){
            return;
        }
        if(index1 > index2){
            swapIcons(index2, index1);
            return;
        }
        const iconList = document.getElementById('iconList');
        // 根据data-index获取图标元素
        const icon1 = iconList.querySelector(`[data-index="${index1}"]`);
        const icon2 = iconList.querySelector(`[data-index="${index2}"]`);
        if (!icon1 || !icon2) {
            console.error('Invalid index provided.');
            return;
        }
        // 获取两个图标在父节点中的位置
        const parent = icon1.parentNode;
/*             const index1Pos = Array.from(parent.children).indexOf(icon1);
        const index2Pos = Array.from(parent.children).indexOf(icon2); */
        let tempIcon1Next = icon1.nextSibling;
        // 交换它们的位置
        parent.insertBefore(icon1, icon2.nextSibling);
        parent.insertBefore(icon2, tempIcon1Next);

    }
    // 初始化拖放功能
    const dragStartHandler = function(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
    };

    const dropHandler = function(e) {
        e.preventDefault(); // 阻止默认行为

        // 获取当前拖动元素的新位置
        const newIndex = e.target.closest('li') ? e.target.closest('li').dataset.index : e.target.children.length - 1;
        const oldIndexStr = e.dataTransfer.getData('text/plain');
        const oldIndex = parseInt(oldIndexStr);

        if (newIndex === oldIndex) return;

        // 更新 DOM 中的列表项
        const itemToMove = this.querySelector(`li[data-index="${oldIndex}"]`);

        // 确保在正确的位置插入或移除元素
        swapIcons(newIndex, oldIndex);

        // 更新 icons 数组中的顺序
        const temp = customIcons[newIndex];
        customIcons[newIndex] = customIcons[oldIndex];
        customIcons[oldIndex] = temp;

        // 更新列表项的 data-index 属性
        for (let i = 0; i < customIcons.length; i++) {
            const listItem = this.querySelector(`#iconList :nth-child(${i+1})`);
            listItem.dataset.index = i.toString();
        }
    };

    const dragOverHandler = function(e) { 
        e.preventDefault(); 
        e.currentTarget.classList.add('drag-over');
    };

    const dragEndHandler = function(e) { 
        e.currentTarget.classList.remove('drag-over');
    };
})();
/**日志输出*/
function log(...args) {
    const debug = false;
    if (!debug) {
        return;
    }
    if (args) {
        for (let i = 0; i < args.length; i++) {
            console.log(args[i]);
        }
    }
}
function GMaddStyle(css){
    var myStyle = document.createElement('style');
    myStyle.textContent = css;
    var doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
}