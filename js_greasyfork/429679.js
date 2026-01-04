
// ==UserScript==
// @name         ZhiHu Style Adjust
// @namespace    https://www.zhihu.com/
// @version      0.1
// @description  改善知乎在宽大屏幕上的阅读体验
// @author       DistantSaviour_caofs
// @match        https://www.zhihu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429679/ZhiHu%20Style%20Adjust.user.js
// @updateURL https://update.greasyfork.org/scripts/429679/ZhiHu%20Style%20Adjust.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fontFamily = localStorage.getItem('font-family') || 'sans';
    let fontSize = Number(localStorage.getItem('font-size')) || 20;
    //右侧div是否隐藏，默认是不隐藏的
    let rightDivVisible = false;

    let customFont = localStorage.getItem('custom-font') || `'方正悠宋 GBK 508R', serif`
    //字体格式
    function fontFamilyPropertyValue() {
        if (fontFamily === 'custom'){
            return customFont;
        }
        if (fontFamily === 'serif'){
            return `'Source Serif', 'Noto Serif', 'Source Han Serif SC', 'Noto Serif CJK SC', serif`;
        }else{
            return `'Source Sans', 'Noto Sans', 'Source Han Sans SC', 'Noto Sans CJK SC', sans-serif`;
        }
    }
    //字体大小
    function fontSizePropertyValue() {
        return `${fontSize}px`;
    }

    // language=css
    const css = `
        :root {
            --font-family: ${fontFamilyPropertyValue()};
            --font-size: ${fontSizePropertyValue()};

            font-family: var(--font-family) !important;
            font-size: var(--font-size) !important;
            line-height: 2 !important;
        }

        body {
            font-family: unset;
            line-height: unset;
            font-size: unset;
        }

        .Button {
            font-size: unset;
        }
        .ContentItem-title{
            font-size: unset;
        }

        div.CommentItemV2{
            font-size: unset;
        }



        /* Control */
        #control-button {
            position: fixed;
            top: 80px;
            right: 0;
            width: 48px;
            height: 48px;

            font-size: 18px;
            font-family: sans-serif;
            line-height: 48px;
            text-align: center;

            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            border-right: 0;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
            cursor: pointer;
            user-select: none;
        }

        #control-panel {
            position: fixed;
            top: 120px;
            left: 50%;
            width: 320px;
            margin-left: -160px;

            font-size: 16px;
            font-family: sans-serif;

            display: none;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            user-select: none;
        }

        #control-panel .control-title {
            display: flex;
            height: 40px;
            border-bottom: 1px solid #CCCCCC;
        }

        #control-panel .control-title-text {
            line-height: 40px;
            flex: 1;
            padding-left: 8px;
        }

        #control-panel #control-close {
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 24px;
            border-left: 1px solid #CCCCCC;
            cursor: pointer;
        }

        #control-panel .control-font-family-item {
            height: 32px;
            line-height: 32px;
            text-align: center;
            margin: 8px;
            border: 1px solid #CCCCCC;
            cursor: pointer;
        }

        #control-panel #control-font-family-custom {
            margin-bottom: 0;
        }

        #control-panel #control-font-family-custom-input {
            margin-top: 0;
            border-top: 0;
            cursor: unset;
        }

        #control-panel #control-font-family-custom-input input {
            font-family: monospace;
            font-size: 0.8em;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 8px;
            margin: 0;
            border: 0;
        }

        #control-panel .control-font-size {
            height: 32px;
            line-height: 32px;
            margin: 8px;
            border: 1px solid #CCCCCC;
            display: flex;
        }

        #control-panel .control-font-size-action {
            height: 32px;
            width: 32px;
            text-align: center;
            cursor: pointer;
        }

        #control-panel #control-font-size-decrease {
            border-right: 1px solid #CCCCCC;
        }

        #control-panel #control-font-size-increase {
            border-left: 1px solid #CCCCCC;
        }

        #control-panel #control-font-size-value {
            flex: 1;
            text-align: center;
        }
    `;

    function addStyles() {
        //         知乎主页
        if(document.getElementsByClassName("Topstory-container")[0]){
            document.getElementsByClassName("Topstory-container")[0].style.setProperty("width","90%");
            //Topstory-mainColumn
            document.getElementsByClassName("Topstory-mainColumn")[0].style.setProperty("width","70%");
        }else{//知乎问题主页
            //Question-main
            document.getElementsByClassName("Question-main")[0].style.setProperty("width","90%");
            //ListShortcut
            document.getElementsByClassName("Question-mainColumn")[0].style.width='90%';
            window.onload = function(){
                document.getElementsByClassName("ContentItem-actions Sticky RichContent-actions is-fixed is-bottom")[0].style.width='66%';
            }
        }
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }


    function addControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'control-addon';
        panel.id = 'control-panel';
        // language=html
        panel.innerHTML = `
            <div class="control-title">
                <span class="control-title-text">阅读设置</span>
                <div id="control-close">&times;</div>
            </div>
            <div class="control-font-family">
                <div class="control-font-family-item" id="control-div-right-visible">隐藏右侧列表</div>
                <div class="control-font-family-item" id="control-font-family-serif">有衬线（思源宋体）</div>
                <div class="control-font-family-item" id="control-font-family-sans">无衬线（思源黑体）</div>
                <div class="control-font-family-item" id="control-font-family-custom">自定义</div>
                <div class="control-font-family-item" id="control-font-family-custom-input">
                    <input type="text" />
                </div>
            </div>
            <div class="control-font-size">
                <div class="control-font-size-action" id="control-font-size-decrease">－</div>
                <span id="control-font-size-value">${fontSizePropertyValue()}</span>
                <div class="control-font-size-action" id="control-font-size-increase">＋</div>
            </div>
        `;

        const button = document.createElement('div');
        button.className = 'control-addon';
        button.id = 'control-button';
        button.textContent = 'Aa';

        document.body.appendChild(panel);
        document.body.appendChild(button);

        function updateFontSize(delta) {
            fontSize += delta;
            localStorage.setItem('font-size', fontSize);

            const propertyValue = fontSizePropertyValue();
            document.documentElement.style.setProperty('--font-size', propertyValue);
            document.getElementById('control-font-size-value').innerText = propertyValue;
        }

        function updateFontFamily(family) {
            fontFamily = family;
            localStorage.setItem('font-family', fontFamily);

            document.documentElement.style.setProperty('--font-family', fontFamilyPropertyValue());
            document.querySelectorAll('.control-font-family-item').forEach(el => el.style.background = 'none');
            document.getElementById(`control-font-family-${family}`).style.background = '#CCCCCC';
        }
//隐藏右侧div
        function visibleRightDiv(){
            if(rightDivVisible){
                rightDivVisible = false;
                if(document.getElementsByClassName("Topstory-container")[0]){//主页
                    document.getElementsByClassName("GlobalSideBar GlobalSideBar--old")[0].hidden=rightDivVisible;
                    //Topstory-mainColumn
                    document.getElementsByClassName("Topstory-mainColumn")[0].style.setProperty("width","70%");
                }else{//问题页面
                    document.getElementsByClassName("Question-sideColumn Question-sideColumn--sticky")[0].hidden=rightDivVisible;
                    //Topstory-mainColumn
                    document.getElementsByClassName("Question-mainColumn")[0].style.width='90%';
                    document.getElementsByClassName("ContentItem-actions Sticky RichContent-actions is-fixed is-bottom")[0].style.width='67%';
                }
                document.getElementById("control-div-right-visible").innerText="隐藏右侧列表";
            }else {
                rightDivVisible = true;
                if(document.getElementsByClassName("Topstory-container")[0]){//主页
                    document.getElementsByClassName("GlobalSideBar GlobalSideBar--old")[0].hidden=rightDivVisible;
                    //Topstory-mainColumn
                    document.getElementsByClassName("Topstory-mainColumn")[0].style.setProperty("width","100%");
                }else{//问题页面
                    document.getElementsByClassName("Question-sideColumn Question-sideColumn--sticky")[0].hidden=rightDivVisible;
                    //Topstory-mainColumn
                    document.getElementsByClassName("Question-mainColumn")[0].style.width='100%';
                    //ContentItem-actions Sticky RichContent-actions is-fixed is-bottom
                    document.getElementsByClassName("ContentItem-actions Sticky RichContent-actions is-fixed is-bottom")[0].style.width='90%';
                }
                document.getElementById("control-div-right-visible").innerText="显示右侧列表";
            }
        }

        updateFontSize(0);
        updateFontFamily(fontFamily);

        document.addEventListener('click', function (event) {
            let target = event.target;
            if (!target instanceof HTMLElement) {
                return;
            }

            switch (target.id) {
                case 'control-button':
                    panel.style.display = 'block';
                    break;
                case 'control-close':
                    panel.style.display = 'none';
                    break;
                case 'control-font-family-serif':
                    updateFontFamily('serif');
                    break;
                case 'control-font-family-sans':
                    updateFontFamily('sans');
                    break;
                case 'control-font-family-custom':
                    updateFontFamily('custom');
                    break;
                case 'control-font-size-decrease':
                    updateFontSize(-1);
                    break;
                case 'control-font-size-increase':
                    updateFontSize(1);
                    break;
                case 'control-div-right-visible':
                    visibleRightDiv();
                    break;

            }
        });

        const input = panel.querySelector('#control-font-family-custom-input input');
        input.value = customFont;
        input.addEventListener('input', function (event) {
            let target = event.target;
            if (!target instanceof HTMLInputElement) {
                return;
            }

            customFont = target.value;
            localStorage.setItem('custom-font', customFont);

            if (fontFamily === 'custom'){
                document.documentElement.style.setProperty('--font-family', customFont);
            }
        })
    }

    // 添加样式
    addStyles();
    //增加控制面板
    addControlPanel();
})();