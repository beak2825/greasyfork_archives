// ==UserScript==
// @name         批量图片提取与下载
// @namespace    http://tampermonkey.net/
// @version      1.5.3
// @description  提取图片后支持全选、取消全选、一键下载全部图片和下载选中图片为 ZIP 文件，UI 美化版，带链接输入界面。
// @author       vicwang
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521722/%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96%E4%B8%8E%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521722/%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E6%8F%90%E5%8F%96%E4%B8%8E%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '0';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    buttonContainer.style.borderRadius = '0 0 10px 10px';
    buttonContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    buttonContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    buttonContainer.style.opacity = '0';
    buttonContainer.style.transform = 'translateY(-100%)';
    document.body.appendChild(buttonContainer);

    // 创建“开始”按钮
    const startButton = document.createElement('button');
    startButton.textContent = '输入图片链接';
    startButton.style.padding = '8px 16px';
    startButton.style.backgroundColor = '#007BFF';
    startButton.style.color = '#fff';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.fontSize = '14px';
    startButton.style.fontWeight = '500';
    startButton.style.transition = 'background-color 0.3s ease';
    buttonContainer.appendChild(startButton);

    // 创建“提取”按钮
    const extractButton = document.createElement('button');
    extractButton.textContent = '提取网页图片';
    extractButton.style.padding = '8px 16px';
    extractButton.style.backgroundColor = '#28A745';
    extractButton.style.color = '#fff';
    extractButton.style.border = 'none';
    extractButton.style.borderRadius = '5px';
    extractButton.style.cursor = 'pointer';
    extractButton.style.fontSize = '14px';
    extractButton.style.fontWeight = '500';
    extractButton.style.transition = 'background-color 0.3s ease';
    buttonContainer.appendChild(extractButton);

    // 按钮悬停效果
    const setHoverEffect = (button, hoverColor) => {
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = hoverColor;
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = button === startButton ? '#007BFF' : '#28A745';
        });
    };

    setHoverEffect(startButton, '#0056b3');
    setHoverEffect(extractButton, '#218838');

    // 鼠标移动到网页顶部时显示按钮
    const showButtons = () => {
        buttonContainer.style.opacity = '1';
        buttonContainer.style.transform = 'translateY(0)';
    };

    // 鼠标离开网页顶部时隐藏按钮
    const hideButtons = () => {
        buttonContainer.style.opacity = '0';
        buttonContainer.style.transform = 'translateY(-100%)';
    };

    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        if (e.clientY <= 50) { // 鼠标靠近顶部 50px 时显示按钮
            showButtons();
        } else {
            hideButtons();
        }
    });

    // 点击“开始”按钮
    startButton.addEventListener('click', () => {
        // 创建模态对话框
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modal.style.zIndex = '10000';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        document.body.appendChild(modal);

        // 创建对话框内容
        const dialog = document.createElement('div');
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        dialog.style.width = '400px';
        dialog.style.maxWidth = '90%';
        modal.appendChild(dialog);

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '请输入图片链接';
        title.style.marginTop = '0';
        title.style.fontSize = '18px';
        title.style.color = '#333';
        dialog.appendChild(title);

        // 创建输入框
        const inputBox = document.createElement('textarea');
        inputBox.placeholder = '每行一个链接';
        inputBox.style.width = '100%';
        inputBox.style.height = '150px';
        inputBox.style.padding = '10px';
        inputBox.style.border = '1px solid #ccc';
        inputBox.style.borderRadius = '5px';
        inputBox.style.fontSize = '14px';
        inputBox.style.marginBottom = '15px';
        inputBox.style.boxSizing = 'border-box';
        dialog.appendChild(inputBox);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.gap = '10px';
        dialog.appendChild(buttonContainer);

        // 创建确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.textContent = '确认';
        confirmButton.style.padding = '8px 16px';
        confirmButton.style.backgroundColor = '#28A745';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.fontSize = '14px';
        confirmButton.style.transition = 'background-color 0.3s ease';
        buttonContainer.appendChild(confirmButton);

        // 确认按钮悬停效果
        setHoverEffect(confirmButton, '#218838');

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#FF4C4C';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '14px';
        cancelButton.style.transition = 'background-color 0.3s ease';
        buttonContainer.appendChild(cancelButton);

        // 取消按钮悬停效果
        setHoverEffect(cancelButton, '#cc0000');

        // 确认按钮点击事件
        confirmButton.addEventListener('click', () => {
            const links = inputBox.value.split('\n').map(link => link.trim()).filter(link => link);
            if (links.length === 0) {
                alert('请输入至少一个有效链接');
                return;
            }
            modal.remove(); // 关闭对话框
            processLinks(links); // 处理链接
        });

        // 取消按钮点击事件
        cancelButton.addEventListener('click', () => {
            modal.remove(); // 关闭对话框
        });
    });

    // 点击“提取”按钮
    extractButton.addEventListener('click', () => {
        // 提取当前网页中的所有图片
        const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
        if (images.length === 0) {
            alert('当前网页未找到图片');
            return;
        }
        processLinks(images); // 处理图片链接
    });

    // 处理链接
    function processLinks(links) {
        // 创建图片展示容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        container.style.overflowY = 'scroll';
        container.style.zIndex = '10000';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '15px';
        container.style.padding = '20px';
        container.style.boxSizing = 'border-box';
        document.body.appendChild(container);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.position = 'fixed';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.zIndex = '10001';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#FF4C4C';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '8px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        closeButton.style.fontSize = '14px';
        closeButton.style.fontWeight = '500';
        closeButton.style.transition = 'background-color 0.3s ease';
        container.appendChild(closeButton);

        // 关闭按钮悬停效果
        setHoverEffect(closeButton, '#cc0000');

        closeButton.addEventListener('click', () => {
            container.remove();
        });

        // 图片列表
        const imageList = links;
        const selectedImages = new Set(); // 记录选中的图片

        // 显示所有图片
        const imageElements = [];
        imageList.forEach((src, index) => {
            const imgWrapper = document.createElement('div');
            imgWrapper.style.flex = '1 1 calc(25% - 15px)';
            imgWrapper.style.display = 'flex';
            imgWrapper.style.alignItems = 'center';
            imgWrapper.style.justifyContent = 'center';
            imgWrapper.style.backgroundColor = '#fff';
            imgWrapper.style.borderRadius = '8px';
            imgWrapper.style.overflow = 'hidden';
            imgWrapper.style.position = 'relative';
            imgWrapper.style.cursor = 'pointer';
            imgWrapper.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';

            // 图片悬停效果
            imgWrapper.addEventListener('mouseenter', () => {
                imgWrapper.style.transform = 'scale(1.02)';
                imgWrapper.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
            });
            imgWrapper.addEventListener('mouseleave', () => {
                imgWrapper.style.transform = 'scale(1)';
                imgWrapper.style.boxShadow = 'none';
            });

            const img = document.createElement('img');
            img.src = src;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.alt = '图片';

            // 选中效果
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
            overlay.style.display = 'none';
            overlay.style.borderRadius = '8px';
            imgWrapper.appendChild(overlay);

            imgWrapper.appendChild(img);
            container.appendChild(imgWrapper);
            imageElements.push({ src, wrapper: imgWrapper, overlay });

            // 点击图片进行选中/取消
            imgWrapper.addEventListener('click', () => {
                if (selectedImages.has(src)) {
                    selectedImages.delete(src);
                    overlay.style.display = 'none';
                } else {
                    selectedImages.add(src);
                    overlay.style.display = 'block';
                }
            });
        });

        // 全选按钮
        const selectAllButton = document.createElement('button');
        selectAllButton.textContent = '全选';
        selectAllButton.style.position = 'fixed';
        selectAllButton.style.bottom = '100px';
        selectAllButton.style.right = '20px';
        selectAllButton.style.zIndex = '10001';
        selectAllButton.style.padding = '10px 20px';
        selectAllButton.style.backgroundColor = '#007BFF';
        selectAllButton.style.color = '#fff';
        selectAllButton.style.border = 'none';
        selectAllButton.style.borderRadius = '8px';
        selectAllButton.style.cursor = 'pointer';
        selectAllButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        selectAllButton.style.fontSize = '14px';
        selectAllButton.style.fontWeight = '500';
        selectAllButton.style.transition = 'background-color 0.3s ease';
        container.appendChild(selectAllButton);

        // 全选按钮悬停效果
        setHoverEffect(selectAllButton, '#0056b3');

        selectAllButton.addEventListener('click', () => {
            imageElements.forEach(({ src, overlay }) => {
                selectedImages.add(src);
                overlay.style.display = 'block';
            });
        });

        // 取消全选按钮
        const deselectAllButton = document.createElement('button');
        deselectAllButton.textContent = '取消全选';
        deselectAllButton.style.position = 'fixed';
        deselectAllButton.style.bottom = '60px';
        deselectAllButton.style.right = '20px';
        deselectAllButton.style.zIndex = '10001';
        deselectAllButton.style.padding = '10px 20px';
        deselectAllButton.style.backgroundColor = '#FF5722';
        deselectAllButton.style.color = '#fff';
        deselectAllButton.style.border = 'none';
        deselectAllButton.style.borderRadius = '8px';
        deselectAllButton.style.cursor = 'pointer';
        deselectAllButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        deselectAllButton.style.fontSize = '14px';
        deselectAllButton.style.fontWeight = '500';
        deselectAllButton.style.transition = 'background-color 0.3s ease';
        container.appendChild(deselectAllButton);

        // 取消全选按钮悬停效果
        setHoverEffect(deselectAllButton, '#e64a19');

        deselectAllButton.addEventListener('click', () => {
            imageElements.forEach(({ src, overlay }) => {
                selectedImages.delete(src);
                overlay.style.display = 'none';
            });
        });

        // 下载选中图片按钮
        const downloadSelectedButton = document.createElement('button');
        downloadSelectedButton.textContent = '下载选中图片（ZIP）';
        downloadSelectedButton.style.position = 'fixed';
        downloadSelectedButton.style.bottom = '20px';
        downloadSelectedButton.style.right = '20px';
        downloadSelectedButton.style.zIndex = '10001';
        downloadSelectedButton.style.padding = '10px 20px';
        downloadSelectedButton.style.backgroundColor = '#28A745';
        downloadSelectedButton.style.color = '#fff';
        downloadSelectedButton.style.border = 'none';
        downloadSelectedButton.style.borderRadius = '8px';
        downloadSelectedButton.style.cursor = 'pointer';
        downloadSelectedButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        downloadSelectedButton.style.fontSize = '14px';
        downloadSelectedButton.style.fontWeight = '500';
        downloadSelectedButton.style.transition = 'background-color 0.3s ease';
        container.appendChild(downloadSelectedButton);

        // 下载按钮悬停效果
        setHoverEffect(downloadSelectedButton, '#218838');

        downloadSelectedButton.addEventListener('click', async () => {
            if (selectedImages.size === 0) {
                alert('请先选择图片！');
                return;
            }

            const zip = new JSZip();
            const selectedArray = Array.from(selectedImages);

            for (let i = 0; i < selectedArray.length; i++) {
                const src = selectedArray[i];
                const filename = `image_${i + 1}.${src.split('.').pop().split('?')[0]}`;
                const response = await fetch(src);
                const blob = await response.blob();
                zip.file(filename, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'selected_images.zip';
            link.click();
        });
    }
})();