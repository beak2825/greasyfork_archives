// ==UserScript==
// @name         CSDN文章优化打印
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  优化CSDN文章页面用于打印，移除不必要元素并自动调用打印功能，解决第一页空白问题
// @author       Sherry
// @match        *://*.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-end
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C.3iWufqIms_ccabhKcsM4GgHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529957/CSDN%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/529957/CSDN%E6%96%87%E7%AB%A0%E4%BC%98%E5%8C%96%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function(){
    'use strict';
    
    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'csdn-print-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            cursor: move;
            width: 150px;
            box-sizing: content-box;
        `;
        
        const title = document.createElement('div');
        title.textContent = '📄 CSDN打印优化';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            color: #333;
            cursor: move;
        `;
        
        const optimizeBtn = document.createElement('button');
        optimizeBtn.textContent = '🖨️ 优化并打印';
        optimizeBtn.style.cssText = `
            background-color: #0066cc;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            width: calc(100% - 10px);
            box-sizing: border-box;
        `;
        optimizeBtn.onclick = function() {
            optimizePage(true);
        };
        
        const optimizeOnlyBtn = document.createElement('button');
        optimizeOnlyBtn.textContent = '✨ 仅优化页面';
        optimizeOnlyBtn.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            width: calc(100% - 10px);
            box-sizing: border-box;
        `;
        optimizeOnlyBtn.onclick = function() {
            optimizePage(false);
        };
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '🔄 恢复原页面';
        resetBtn.style.cssText = `
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            margin: 5px;
            cursor: pointer;
            width: calc(100% - 10px);
            box-sizing: border-box;
        `;
        resetBtn.onclick = function() {
            location.reload();
        };
        
        panel.appendChild(title);
        panel.appendChild(optimizeBtn);
        panel.appendChild(optimizeOnlyBtn);
        panel.appendChild(resetBtn);
        
        document.body.appendChild(panel);
        
        // 添加拖拽功能
        makeDraggable(panel);
    }
    
    // 使元素可拖拽
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        element.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // 不应用任何缩放调整，直接使用原始计算
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // 设置元素的新位置
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }
        
        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // 优化页面函数
    function optimizePage(autoPrint = true) {
        // 移除不必要元素
        var articleBox = $("div.article_content");
        articleBox.removeAttr("style");
        $(".hide-preCode-bt").parents(".author-pjw").show();
        $(".hide-preCode-bt").parents("pre").removeClass("set-code-hide");
        $(".hide-preCode-bt").parents(".hide-preCode-box").hide().remove();
        $("#btn-readmore").parent().remove();
        $("#side").remove();
        $(".csdn-side-toolbar, .template-box, .blog-footer-bottom, .left-toolbox, .toolbar-inside").remove();
        $(".comment-box, .recommend-box, .more-toolbox, .article-info-box, .column-group-item").remove();
        $("aside, .tool-box, .recommend-nps-box, .skill-tree-box").remove();
        
        // 修复布局
        $("main").css({
            'display': 'block',  // 改为block而不是content
            'float': 'none',     // 改为none而不是left
            'margin': '0 auto',  // 居中显示
            'padding': '20px'    // 添加内边距
        });
        
        $("#mainBox").width("100%");
        
        // 修复可能导致第一页空白的问题
        $("body").css({
            'margin': '0',
            'padding': '0',
            'zoom': '0.8',
            'overflow': 'visible'
        });
        
        // 确保文章内容从第一页开始
        $("article").css({
            'page-break-before': 'avoid',
            'margin-top': '0'
        });
        
        // 移除可能导致空白页的元素
        $(".first-page-break").remove();
        
        // 确保控制面板样式不受页面优化影响
        const panel = document.getElementById('csdn-print-panel');
        if (panel) {
            panel.style.width = '150px';
            panel.style.boxSizing = 'content-box';
            panel.style.fontSize = '14px';
            panel.style.zoom = '1.25'; // 抵消页面缩放对面板的影响
            
            // 重置按钮样式
            const buttons = panel.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.width = 'calc(100% - 10px)';
                button.style.boxSizing = 'border-box';
                button.style.margin = '5px';
                button.style.padding = '5px 10px';
            });
            
            // 重新绑定拖拽事件
            makeDraggable(panel);
        }
        
        // 如果需要自动打印
        if (autoPrint) {
            // 临时隐藏控制面板
            panel.style.display = 'none';
            
            // 延迟调用打印功能，确保样式已应用
            setTimeout(function() {
                window.print();
                // 打印完成后显示控制面板
                setTimeout(function() {
                    panel.style.display = 'block';
                }, 1000);
            }, 500);
        }
    }
    
    // 等待页面加载完成后创建控制面板
    setTimeout(function() {
        createControlPanel();
    }, 1000);
})();
