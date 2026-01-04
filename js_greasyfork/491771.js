// ==UserScript==
// @name         自定义字体渲染
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自定义网页上的字体渲染效果。
// @author       Your name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/491771/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/491771/%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建用户界面元素
    var uiContainer = document.createElement('div');
    uiContainer.id = 'fontRendererUI';
    uiContainer.style.position = 'fixed';
    uiContainer.style.bottom = '20px';
    uiContainer.style.right = '20px';
    uiContainer.style.backgroundColor = '#333'; // Dark background color
    uiContainer.style.color = '#fff'; // White text color
    uiContainer.style.padding = '10px';
    uiContainer.style.border = '1px solid #ccc';
    uiContainer.style.borderRadius = '5px';
    uiContainer.innerHTML = `
        <span id="closeButton" style="position: absolute; top: 5px; right: 5px; cursor: pointer; color: #fff; font-size: 20px;">×</span>
        <h2 style="cursor: move;">自定义字体渲染设置</h2>
        <label for="fontSize">字体大小：</label>
        <input type="range" id="fontSize" min="10" max="30" step="1" value="${GM_getValue('fontSize', 14)}"><br>
        <label for="fontColor">字体颜色：</label>
        <input type="color" id="fontColor" value="${GM_getValue('fontColor', '#ffffff')}"><br>
        <label for="bgColor">背景颜色：</label>
        <input type="color" id="bgColor" value="${GM_getValue('bgColor', '#333333')}"><br>
        <label for="fontFamily">字体样式：</label>
        <select id="fontFamily">
            <option value="微软雅黑">微软雅黑</option>
            <option value="宋体">宋体</option>
            <option value="楷体">楷体</option>
            <option value="仿宋">仿宋</option>
            <option value="黑体">黑体</option>
        </select>
        <br>
        <label for="lineHeight">行高：</label>
        <input type="range" id="lineHeight" min="1" max="3" step="0.1" value="${GM_getValue('lineHeight', 1.5)}"><br>
        <label for="letterSpacing">字间距：</label>
        <input type="range" id="letterSpacing" min="-0.2" max="0.2" step="0.01" value="${GM_getValue('letterSpacing', 0)}"><br>
        <label for="textShadow">文字阴影：</label>
        <input type="text" id="textShadow" placeholder="X轴偏移量 Y轴偏移量 模糊距离 颜色" value="${GM_getValue('textShadow', '2px 2px 4px #000000')}"><br>
        <label for="fontWeight">字体粗细：</label>
        <select id="fontWeight">
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
        </select>
        <br>
        <label for="textDecoration">文字装饰：</label>
        <select id="textDecoration">
            <option value="none">无</option>
            <option value="underline">下划线</option>
            <option value="overline">上划线</option>
            <option value="line-through">删除线</option>
        </select>
        <br>
        <label for="textAlign">文字对齐：</label>
        <select id="textAlign">
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
        </select>
        <br>
        <label for="textTransform">文字转换：</label>
        <select id="textTransform">
            <option value="none">无</option>
            <option value="uppercase">大写</option>
            <option value="lowercase">小写</option>
            <option value="capitalize">首字母大写</option>
        </select>
        <br>
        <label for="textIndent">文字缩进：</label>
        <input type="number" id="textIndent" min="0" max="50" step="1" value="${GM_getValue('textIndent', 0)}"><br>
        <label for="wordSpacing">单词间距：</label>
        <input type="number" id="wordSpacing" min="-5" max="5" step="0.1" value="${GM_getValue('wordSpacing', 0)}"><br>
        <label for="textAlignLast">段落最后行对齐：</label>
        <select id="textAlignLast">
            <option value="auto">自动</option>
            <option value="start">开始</option>
            <option value="end">结束</option>
            <option value="left">左对齐</option>
            <option value="right">右对齐</option>
            <option value="center">居中</option>
            <option value="justify">两端对齐</option>
        </select>
        <br>
        <label for="wordBreak">单词断行：</label>
        <select id="wordBreak">
            <option value="normal">正常</option>
            <option value="break-all">强制换行</option>
        </select>
        <br>
        <label for="whiteSpace">空白处理：</label>
        <select id="whiteSpace">
            <option value="normal">正常</option>
            <option value="nowrap">不换行</option>
            <option value="pre">保留空白</option>
            <option value="pre-line">合并空白</option>
            <option value="pre-wrap">保留空白并换行</option>
        </select>
        <br>
        <label for="overflow">溢出处理：</label>
        <select id="overflow">
            <option value="visible">可见</option>
            <option value="hidden">隐藏</option>
            <option value="scroll">滚动</option>
            <option value="auto">自动</option>
        </select>
        <br>
        <label for="transform">元素变换：</label>
        <select id="transform">
            <option value="none">无</option>
            <option value="rotate(45deg)">旋转45度</option>
            <option value="scale(1.5)">缩放1.5倍</option>
            <option value="skew(30deg)">倾斜30度</option>
            <option value="translate(50px, 50px)">平移50像素</option>
        </select>
        <br>
        <label for="visibility">可见性：</label>
        <select id="visibility">
            <option value="visible">可见</option>
            <option value="hidden">隐藏</option>
        </select>
        <br>
        <label for="cursor">鼠标样式：</label>
        <select id="cursor">
            <option value="default">默认</option>
            <option value="pointer">指针</option>
            <option value="crosshair">十字线</option>
            <option value="wait">等待</option>
            <option value="text">文本</option>
            <option value="move">移动</option>
            <option value="not-allowed">不允许</option>
        </select>
        <br>
        <label for="zIndex">层级：</label>
        <input type="number" id="zIndex" min="0" max="9999" step="1" value="${GM_getValue('zIndex', 9999)}"><br>
        <button id="applyButton">应用</button>
    `;
    document.body.appendChild(uiContainer);

    // Apply button click event listener
    document.getElementById('applyButton').addEventListener('click', applyFontStyles);

    // Font styles function
    function applyFontStyles() {
        var fontSize = document.getElementById('fontSize').value;
        var fontColor = document.getElementById('fontColor').value;
        var bgColor = document.getElementById('bgColor').value;
        var fontFamily = document.getElementById('fontFamily').value;
        var lineHeight = document.getElementById('lineHeight').value;
        var letterSpacing = document.getElementById('letterSpacing').value;
        var textShadow = document.getElementById('textShadow').value;
        var fontWeight = document.getElementById('fontWeight').value;
        var textDecoration = document.getElementById('textDecoration').value;
        var textAlign = document.getElementById('textAlign').value;
        var textTransform = document.getElementById('textTransform').value;
        var textIndent = document.getElementById('textIndent').value;
        var wordSpacing = document.getElementById('wordSpacing').value;
        var textAlignLast = document.getElementById('textAlignLast').value;
        var wordBreak = document.getElementById('wordBreak').value;
        var whiteSpace = document.getElementById('whiteSpace').value;
        var overflow = document.getElementById('overflow').value;
        var transform = document.getElementById('transform').value;
        var visibility = document.getElementById('visibility').value;
        var cursor = document.getElementById('cursor').value;
        var zIndex = document.getElementById('zIndex').value;

        var styles = `
            font-size: ${fontSize}px;
            color: ${fontColor};
            background-color: ${bgColor};
            font-family: ${fontFamily};
            line-height: ${lineHeight};
            letter-spacing: ${letterSpacing}em;
            text-shadow: ${textShadow};
            font-weight: ${fontWeight};
            text-decoration: ${textDecoration};
            text-align: ${textAlign};
            text-transform: ${textTransform};
            text-indent: ${textIndent}px;
            word-spacing: ${wordSpacing}px;
            text-align-last: ${textAlignLast};
            word-break: ${wordBreak};
            white-space: ${whiteSpace};
            overflow: ${overflow};
            transform: ${transform};
            visibility: ${visibility};
            cursor: ${cursor};
            z-index: ${zIndex};
        `;

        // Apply styles to all text elements on the page
        var textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, div, li, td, th');
        textElements.forEach(function(elem) {
            elem.style.cssText = styles;
        });

        // Save styles to GM storage
        GM_setValue('fontSize', fontSize);
        GM_setValue('fontColor', fontColor);
        GM_setValue('bgColor', bgColor);
        GM_setValue('fontFamily', fontFamily);
        GM_setValue('lineHeight', lineHeight);
        GM_setValue('letterSpacing', letterSpacing);
        GM_setValue('textShadow', textShadow);
        GM_setValue('fontWeight', fontWeight);
        GM_setValue('textDecoration', textDecoration);
        GM_setValue('textAlign', textAlign);
        GM_setValue('textTransform', textTransform);
        GM_setValue('textIndent', textIndent);
        GM_setValue('wordSpacing', wordSpacing);
        GM_setValue('textAlignLast', textAlignLast);
        GM_setValue('wordBreak', wordBreak);
        GM_setValue('whiteSpace', whiteSpace);
        GM_setValue('overflow', overflow);
        GM_setValue('transform', transform);
        GM_setValue('visibility', visibility);
        GM_setValue('cursor', cursor);
        GM_setValue('zIndex', zIndex);
    }

    // Close button click event listener
    document.getElementById('closeButton').addEventListener('click', function() {
        uiContainer.style.display = 'none';
    });

    // Drag and drop functionality
    var isDragging = false;
    var initialX;
    var initialY;
    var offsetX = 0;
    var offsetY = 0;
    uiContainer.querySelector('h2').addEventListener('mousedown', function(e) {
        isDragging = true;
        initialX = e.clientX - offsetX;
        initialY = e.clientY - offsetY;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            offsetX = e.clientX - initialX;
            offsetY = e.clientY - initialY;
            uiContainer.style.left = offsetX + 'px';
            uiContainer.style.top = offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

})();