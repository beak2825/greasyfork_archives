// ==UserScript==
// @name         Processon-SVG2PNG辅助器
// @namespace    https://www.processon.com/
// @version      0.3.3
// @description  svg转png
// @author       Aasee
// @match        https://www.processon.com/diagraming/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.processon.com/
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/canvg@3.0.10/lib/umd.js
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/503160/Processon-SVG2PNG%E8%BE%85%E5%8A%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503160/Processon-SVG2PNG%E8%BE%85%E5%8A%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保 canvg 已加载
    if (typeof canvg === 'undefined') {
        console.error('canvg is not loaded');
        return;
    }

    // 创建按钮容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '70px';
    container.style.right = '10px';
    container.style.zIndex = '1000';

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '下载图表';
    mainButton.style.width = '150px';
    mainButton.style.height = '50px';
    mainButton.style.padding = '10px';
    mainButton.style.backgroundColor = '#007bff';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '5px';
    mainButton.style.cursor = 'pointer';
    mainButton.style.transition = 'all 0.3s ease';
    mainButton.style.position = 'relative';

    // 创建下拉菜单
    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.left = '0';
    dropdown.style.width = '100%';
    dropdown.style.display = 'none';
    dropdown.style.flexDirection = 'column';
    dropdown.style.gap = '5px';
    dropdown.style.marginTop = '5px';
    dropdown.style.transition = 'all 0.3s ease';
    dropdown.style.zIndex = '1001';

    // 创建PNG选项
    const pngOption = document.createElement('button');
    pngOption.textContent = '下载为PNG';
    pngOption.style.width = '100%';
    pngOption.style.height = '40px';
    pngOption.style.padding = '5px';
    pngOption.style.backgroundColor = '#007bff';
    pngOption.style.color = 'white';
    pngOption.style.border = 'none';
    pngOption.style.borderRadius = '5px';
    pngOption.style.cursor = 'pointer';
    pngOption.style.opacity = '0.9';

    // 创建SVG选项
    const svgOption = document.createElement('button');
    svgOption.textContent = '下载为SVG';
    svgOption.style.width = '100%';
    svgOption.style.height = '40px';
    svgOption.style.padding = '5px';
    svgOption.style.backgroundColor = '#28a745';
    svgOption.style.color = 'white';
    svgOption.style.border = 'none';
    svgOption.style.borderRadius = '5px';
    svgOption.style.cursor = 'pointer';
    svgOption.style.opacity = '0.9';

    // 拖动状态和位置偏移
    let offsetX, offsetY, startX, startY, isDragging = false;

    // 记录拖动状态和鼠标起始位置
    mainButton.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startY = e.clientY;
        isDragging = false;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        e.preventDefault();
    });

    function onMouseMove(e) {
        if (isDragging || Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
            isDragging = true;
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
        }
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // 点击显示/隐藏菜单
    let isMenuVisible = false;

    function toggleMenu() {
        if (isMenuVisible) {
            dropdown.style.display = 'none';
            mainButton.style.borderRadius = '5px';
        } else {
            dropdown.style.display = 'flex';
            mainButton.style.borderRadius = '5px 5px 0 0';
        }
        isMenuVisible = !isMenuVisible;
    }

    mainButton.addEventListener('click', function(e) {
        if (isDragging) return;
        toggleMenu();
    });

    // 点击其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target) && isMenuVisible) {
            toggleMenu();
        }
    });

    // 获取SVG内容实际包围盒
    function getSVGBoundingBox(svgElement) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const elements = svgElement.querySelectorAll('*');
        elements.forEach(el => {
            if (typeof el.getBBox === 'function') {
                try {
                    const bbox = el.getBBox();
                    if (bbox.width && bbox.height) {
                        minX = Math.min(minX, bbox.x);
                        minY = Math.min(minY, bbox.y);
                        maxX = Math.max(maxX, bbox.x + bbox.width);
                        maxY = Math.max(maxY, bbox.y + bbox.height);
                    }
                } catch (e) {}
            }
        });
        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            // fallback
            return {minX: 0, minY: 0, width: 1000, height: 1000};
        }
        return {minX, minY, width: maxX - minX, height: maxY - minY};
    }

    // 修改水印文字并移除根style属性，保证SVG完整显示
    function modifyWatermark(svgContent, userInput) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;

        // 移除根节点 style 属性
        svgElement.removeAttribute('style');

        // 修改水印文字
        const textElements = svgDoc.querySelectorAll('text');
        textElements.forEach(textElement => {
            if (textElement.textContent.includes('ProcessOn.com免费流程图')) {
                textElement.textContent = userInput;
            }
        });

        // 获取原始尺寸并去除单位
        let width = svgElement.getAttribute('width');
        let height = svgElement.getAttribute('height');
        if (width) width = width.replace(/[^\d.]/g, '');
        if (height) height = height.replace(/[^\d.]/g, '');

        // 如果没有width/height，尝试从viewBox获取
        let viewBox = svgElement.getAttribute('viewBox');
        if ((!width || !height) && viewBox) {
            const vb = viewBox.split(/\s+|,/);
            if (vb.length === 4) {
                width = width || vb[2];
                height = height || vb[3];
            }
        }

        // fallback
        if (!width) width = 1000;
        if (!height) height = 1000;

        // 强制viewBox从0,0开始
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svgElement.setAttribute('width', width);
        svgElement.setAttribute('height', height);

        return new XMLSerializer().serializeToString(svgDoc.documentElement);
    }

    // PNG下载功能
    pngOption.addEventListener('click', function() {
        if (isDragging) return;
        try {
            var selectConfirm = confirm("是否修改为指定名字");
            var userInput = "";
            if(selectConfirm == true){
                userInput = prompt("请输入所需要的内容:", "");
            }
            const divElement = document.querySelector('.water_perview');

            if (!divElement) {
                alert('No SVG element found.');
                return;
            }

            const svgContent = divElement.querySelector('svg').outerHTML.replace(/&nbsp;/g, '&#160;');
            const modifiedSvgString = modifyWatermark(svgContent, userInput);
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(modifiedSvgString, 'image/svg+xml');
            const svgElement = svgDoc.documentElement;

            const canvas = document.createElement('canvas');
            let width = svgElement.getAttribute('width');
            canvas.width = width;
            let height = svgElement.getAttribute('height');
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            canvg.Canvg.fromString(ctx, modifiedSvgString).start();

            const pngData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngData;
            link.download = 'image.png';
            link.click();
            toggleMenu(); // 下载后关闭菜单

        } catch (error) {
            console.error('Error converting SVG to PNG:', error);
            alert('An error occurred while converting SVG to PNG.');
        }
    });

    // SVG下载功能
    svgOption.addEventListener('click', function() {
        if (isDragging) return;
        try {
            var selectConfirm = confirm("是否修改为指定名字");
            var userInput = "";
            if(selectConfirm == true){
                userInput = prompt("请输入所需要的内容:", "");
            }
            const divElement = document.querySelector('.water_perview');
            if (!divElement) {
                alert('No SVG element found.');
                return;
            }

            const svgContent = divElement.querySelector('svg').outerHTML.replace(/&nbsp;/g, '&#160;');
            const modifiedSvgString = modifyWatermark(svgContent, userInput);
            const blob = new Blob([modifiedSvgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'diagram.svg';
            link.click();
            URL.revokeObjectURL(url);
            toggleMenu(); // 下载后关闭菜单
        } catch (error) {
            console.error('Error downloading SVG:', error);
            alert('An error occurred while downloading SVG.');
        }
    });

    // 组装界面
    dropdown.appendChild(pngOption);
    dropdown.appendChild(svgOption);
    mainButton.appendChild(dropdown);
    container.appendChild(mainButton);
    document.body.appendChild(container);
})();
