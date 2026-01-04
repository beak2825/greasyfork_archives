// ==UserScript==
// @name         Auto Webpage2PDF-Bali
// @namespace    http://tampermonkey.net/
// @version      3.2.3
// @license      Bali
// @description  在网页右侧显示可拖拽按钮，点击后全自动将整个网页完整内容保存为PDF文件，特别优化表格、图片、代码等格式
// @author       Bali
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546466/Auto%20Webpage2PDF-Bali.user.js
// @updateURL https://update.greasyfork.org/scripts/546466/Auto%20Webpage2PDF-Bali.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDragging = false;
    let dragStartY = 0;
    let buttonStartY = 0;

    // 创建打印按钮
    function createPrintButton() {
        const button = document.createElement('div');
        button.id = 'pdf-print-button';
        button.innerHTML = '📄<br>PDF';

        // 从localStorage获取保存的位置，默认50%
        const savedTop = localStorage.getItem('pdf-button-top') || '50%';

        // 按钮样式
        button.style.cssText = `
            position: fixed;
            top: ${savedTop};
            right: 10px;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: grab;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
            font-family: Arial, sans-serif;
        `;

        // 鼠标悬停效果
        button.addEventListener('mouseenter', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(-50%) scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!isDragging) {
                this.style.transform = 'translateY(-50%) scale(1)';
                this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }
        });

        // 拖拽功能
        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDragging = true;
            dragStartY = e.clientY;
            buttonStartY = parseInt(this.style.top) || window.innerHeight / 2;

            this.style.cursor = 'grabbing';
            this.style.transform = 'translateY(-50%) scale(0.95)';
            this.style.transition = 'none';

            // 添加全局鼠标事件监听
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        function handleMouseMove(e) {
            if (!isDragging) return;

            const deltaY = e.clientY - dragStartY;
            let newTop = buttonStartY + deltaY;

            // 限制按钮在窗口范围内
            const minTop = 30; // 按钮半径
            const maxTop = window.innerHeight - 30;
            newTop = Math.max(minTop, Math.min(maxTop, newTop));

            button.style.top = newTop + 'px';
        }

        function handleMouseUp(e) {
            if (!isDragging) return;

            const dragDistance = Math.abs(e.clientY - dragStartY);

            // 如果拖拽距离很小，视为点击事件
            if (dragDistance < 5) {
                // 恢复样式并触发PDF生成
                button.style.cursor = 'grab';
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.transition = 'all 0.3s ease';

                // 延迟执行PDF生成，确保样式恢复
                setTimeout(() => {
                    generatePDF();
                }, 100);
            } else {
                // 保存新位置到localStorage
                const currentTop = button.style.top;
                const topPercent = (parseInt(currentTop) / window.innerHeight * 100).toFixed(1) + '%';
                localStorage.setItem('pdf-button-top', topPercent);

                button.style.cursor = 'grab';
                button.style.transform = 'translateY(-50%) scale(1)';
                button.style.transition = 'all 0.3s ease';
            }

            isDragging = false;

            // 移除全局事件监听
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return button;
    }

    // 生成文件名（年月日时分秒格式）
    function generateFileName() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }

    // 获取页面标题（用于文件名前缀）
    function getPageTitle() {
        let title = document.title || 'webpage';
        // 清理文件名中的非法字符
        title = title.replace(/[<>:"/\\|?*]/g, '_');
        // 限制长度
        if (title.length > 50) {
            title = title.substring(0, 50);
        }
        return title;
    }

    // 显示状态提示
    function showStatusMessage(message, type = 'info') {
        const status = document.createElement('div');
        status.id = 'pdf-status-message';
        status.innerHTML = message;

        const bgColor = type === 'success' ? 'rgba(76, 175, 80, 0.9)' :
                       type === 'error' ? 'rgba(244, 67, 54, 0.9)' :
                       'rgba(33, 150, 243, 0.9)';

        status.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        if (!document.getElementById('pdf-animations')) {
            const animations = document.createElement('style');
            animations.id = 'pdf-animations';
            animations.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(animations);
        }

        document.body.appendChild(status);
        return status;
    }

    // 移除状态提示
    function hideStatusMessage() {
        const status = document.getElementById('pdf-status-message');
        if (status) {
            status.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => status.remove(), 300);
        }
    }

    // 优化页面格式用于PDF生成
    function optimizePageForPDF() {
        // 创建样式元素来优化PDF显示
        const pdfStyle = document.createElement('style');
        pdfStyle.id = 'pdf-optimization-style';
        pdfStyle.textContent = `
            /* 表格优化 */
            table {
                border-collapse: collapse !important;
                width: 100% !important;
                margin: 10px 0 !important;
                border: 2px solid #000 !important;
                background-color: #ffffff !important;
            }
            table th {
                border: 1px solid #000 !important;
                padding: 8px !important;
                background-color: #f2f2f2 !important;
                font-weight: bold !important;
                text-align: center !important;
                font-size: 12px !important;
                color: #000 !important;
            }
            table td {
                border: 1px solid #000 !important;
                padding: 8px !important;
                vertical-align: top !important;
                text-align: left !important;
                font-size: 11px !important;
                color: #000 !important;
                background-color: #ffffff !important;
            }
            /* 图片优化 */
            img {
                max-width: 100% !important;
                height: auto !important;
                display: block !important;
                margin: 10px auto !important;
                border: 1px solid #ddd !important;
            }
            /* 代码块优化 */
            pre, code {
                font-family: 'Courier New', monospace !important;
                background-color: #f5f5f5 !important;
                border: 1px solid #ddd !important;
                padding: 10px !important;
                margin: 10px 0 !important;
                border-radius: 4px !important;
                font-size: 10px !important;
                line-height: 1.4 !important;
                color: #000 !important;
            }
            /* 文本优化 */
            h1, h2, h3, h4, h5, h6 {
                color: #000 !important;
                margin-top: 20px !important;
                margin-bottom: 10px !important;
                font-weight: bold !important;
            }
            p {
                color: #000 !important;
                line-height: 1.5 !important;
                margin: 10px 0 !important;
            }
            a {
                color: #0066cc !important;
                text-decoration: underline !important;
            }
            /* 隐藏脚本元素 */
            #pdf-print-button, #pdf-status-message, #word-save-button, #word-status-message {
                display: none !important;
            }
        `;

        document.head.appendChild(pdfStyle);
        return pdfStyle;
    }

    // 使用html2canvas和jsPDF生成PDF（完整网页内容，格式优化）
    async function generatePDFWithLibraries() {
        try {
            // 动态加载html2canvas和jsPDF库
            await loadLibrary('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            await loadLibrary('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

            const { jsPDF } = window.jspdf;

            // 应用PDF优化样式
            const pdfStyle = optimizePageForPDF();

            // 获取整个文档的尺寸
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );

            const documentWidth = Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.clientWidth,
                document.documentElement.scrollWidth,
                document.documentElement.offsetWidth
            );

            // 生成整个网页的canvas
            const canvas = await html2canvas(document.body, {
                height: documentHeight,
                width: documentWidth,
                useCORS: true,
                scale: 1,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                scrollX: 0,
                scrollY: 0,
                windowWidth: documentWidth,
                windowHeight: documentHeight,
                foreignObjectRendering: true,
                removeContainer: true
            });

            // 移除PDF优化样式
            if (pdfStyle && pdfStyle.parentNode) {
                pdfStyle.parentNode.removeChild(pdfStyle);
            }

            // 创建PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');

            // 计算PDF页面尺寸
            const pdfWidth = 210; // A4宽度 (mm)
            const pdfHeight = 297; // A4高度 (mm)
            const margin = 10; // 页边距 (mm)
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = pdfHeight - (margin * 2);

            // 计算图片在PDF中的尺寸
            const imgWidth = contentWidth;
            const imgHeight = (canvas.height * contentWidth) / canvas.width;

            // 如果图片高度小于一页，直接添加
            if (imgHeight <= contentHeight) {
                pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            } else {
                // 需要分页处理
                let remainingHeight = imgHeight;
                let yPosition = 0;
                let pageNumber = 0;

                while (remainingHeight > 0) {
                    if (pageNumber > 0) {
                        pdf.addPage();
                    }

                    const currentPageHeight = Math.min(contentHeight, remainingHeight);
                    const sourceY = (yPosition * canvas.height) / imgHeight;
                    const sourceHeight = (currentPageHeight * canvas.height) / imgHeight;

                    // 创建当前页面的canvas片段
                    const pageCanvas = document.createElement('canvas');
                    const pageCtx = pageCanvas.getContext('2d');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sourceHeight;

                    pageCtx.drawImage(
                        canvas,
                        0, sourceY, canvas.width, sourceHeight,
                        0, 0, canvas.width, sourceHeight
                    );

                    const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
                    pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, currentPageHeight);

                    remainingHeight -= contentHeight;
                    yPosition += contentHeight;
                    pageNumber++;
                }
            }

            // 生成文件名并自动保存
            const timestamp = generateFileName();
            const pageTitle = getPageTitle();
            const fileName = `${pageTitle}_${timestamp}.pdf`;

            // 直接保存，不弹出对话框
            pdf.save(fileName);

            return true;
        } catch (error) {
            console.error('PDF生成失败:', error);
            return false;
        }
    }

    // 动态加载外部库
    function loadLibrary(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 主要的PDF生成函数（完整网页内容）
    async function generatePDF() {
        const statusMsg = showStatusMessage('🔄 正在生成完整网页PDF，请稍候...', 'info');

        try {
            // 使用html2canvas + jsPDF方法（完整网页内容）
            const success = await generatePDFWithLibraries();

            if (success) {
                hideStatusMessage();
                showStatusMessage('✅ 完整网页PDF已自动保存到下载文件夹！', 'success');
                setTimeout(hideStatusMessage, 3000);
            } else {
                throw new Error('PDF生成失败');
            }
        } catch (error) {
            console.error('PDF生成失败:', error);
            hideStatusMessage();
            showStatusMessage('❌ PDF生成失败，请检查网络连接后重试', 'error');
            setTimeout(hideStatusMessage, 4000);
        }
    }

    // 初始化脚本
    function init() {
        // 检查是否已经存在按钮
        if (document.getElementById('pdf-print-button')) {
            return;
        }

        // 创建并添加按钮（拖拽和点击功能已内置）
        const printButton = createPrintButton();
        document.body.appendChild(printButton);

        // 添加键盘快捷键 Ctrl+Shift+P
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                generatePDF();
            }
        });

        console.log('完整网页PDF自动保存器已加载 - 点击右侧按钮或按 Ctrl+Shift+P 生成完整网页PDF');
        console.log('按钮支持拖拽：长按鼠标左键可上下移动位置');
        console.log('功能说明：将捕获整个网页的完整内容，包括需要滚动才能看到的部分');
        console.log('格式优化：自动优化表格边框、图片大小、代码块样式，确保PDF显示效果最佳');
    }

    // 等待页面完全加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 处理动态加载的页面
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();
