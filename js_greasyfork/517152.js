// ==UserScript==
// @name         移动端网页元素替换与编辑工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  替换网页中的图片为本地或指定链接图片，支持缩放、推动和编辑，保持原始比例，支持隐藏/显示按钮
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/517152/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%9B%BF%E6%8D%A2%E4%B8%8E%E7%BC%96%E8%BE%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/517152/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E6%9B%BF%E6%8D%A2%E4%B8%8E%E7%BC%96%E8%BE%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isButtonVisible = GM_getValue('buttonVisible', true);

    GM_addStyle(`
        .edit-tools-btn {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #90EE90; 
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 22px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 99999;
        }
        .edit-tools-menu {
            display: none;
            position: fixed;
            top: 60px;
            left: 10px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 99999;
        }
        .edit-tools-menu.active {
            display: block;
        }
        .hidden {
            display: none !important;
        }
    `);

    const button = document.createElement('div');
    button.className = 'edit-tools-btn';
    button.innerText = '🎶';
    document.body.appendChild(button);

    const menu = document.createElement('div');
    menu.className = 'edit-tools-menu';
    menu.innerHTML = `
        <button id="start-edit">开始编辑</button>
        <button id="end-edit">结束编辑</button>
        <button id="replace-img">替换为本地图片</button>
        <button id="replace-to-url">替换为指定图片</button>
        <button id="end-edit-hide">结束编辑并隐藏按钮</button>
    `;
    document.body.appendChild(menu);

    if (!isButtonVisible) {
        button.classList.add('hidden');
    }

    GM_registerMenuCommand(isButtonVisible ? '隐藏小圆按钮' : '显示小圆按钮', toggleButtonVisibility);

    function toggleButtonVisibility() {
        if (button.classList.contains('hidden')) {
            button.classList.remove('hidden');
            isButtonVisible = true;
        } else {
            button.classList.add('hidden');
            isButtonVisible = false;
        }
        GM_setValue('buttonVisible', isButtonVisible);
        GM_registerMenuCommand(isButtonVisible ? '隐藏小圆按钮' : '显示小圆按钮', toggleButtonVisibility);
    }

    button.addEventListener('click', toggleMenu);

    function toggleMenu() {
        menu.classList.toggle('active');
    }

    let isEditing = false;
    let selectedElement = null;

    document.getElementById('start-edit').addEventListener('click', function() {
        isEditing = true;
        document.body.addEventListener('click', selectElement);
    });

    document.getElementById('end-edit').addEventListener('click', function() {
        endEditing();
    });

    document.getElementById('replace-img').addEventListener('click', function() {
        if (selectedElement && selectedElement.tagName.toLowerCase() === 'img') {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';

            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.src = e.target.result;

                        img.onload = function() {
                            const originalWidth = img.width;
                            const originalHeight = img.height;
                            const aspectRatio = originalWidth / originalHeight;

                            const containerWidth = selectedElement.offsetWidth;
                            const containerHeight = selectedElement.offsetHeight;

                            let newWidth = containerWidth;
                            let newHeight = containerWidth / aspectRatio;

                            if (newHeight > containerHeight) {
                                newHeight = containerHeight;
                                newWidth = containerHeight * aspectRatio;
                            }

                            selectedElement.src = e.target.result;
                            selectedElement.style.width = `${newWidth}px`;
                            selectedElement.style.height = `${newHeight}px`;

                            selectedElement.classList.remove('editable');
                            selectedElement = null;
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });

            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        } else {
            alert('请先选择一个图片元素');
        }
    });

    document.getElementById('replace-to-url').addEventListener('click', function() {
        const imageUrl = 'https://s21.ax1x.com/2025/03/27/pED5A3D.jpg'; // 指定的图片链接
        if (selectedElement && selectedElement.tagName.toLowerCase() === 'img') {
            const img = new Image();
            img.src = imageUrl;

            img.onload = function() {
                const originalWidth = img.width;
                const originalHeight = img.height;
                const aspectRatio = originalWidth / originalHeight;

                const containerWidth = selectedElement.offsetWidth;
                const containerHeight = selectedElement.offsetHeight;

                let newWidth = containerWidth;
                let newHeight = containerWidth / aspectRatio;

                if (newHeight > containerHeight) {
                    newHeight = containerHeight;
                    newWidth = containerHeight * aspectRatio;
                }

                selectedElement.src = imageUrl;
                selectedElement.style.width = `${newWidth}px`;
                selectedElement.style.height = `${newHeight}px`;

                selectedElement.classList.remove('editable');
                selectedElement = null;
            };
        } else {
            alert('请先选择一个图片元素');
        }
    });

    document.getElementById('end-edit-hide').addEventListener('click', function() {
        endEditing();
        toggleButtonVisibility();
    });

    function endEditing() {
        isEditing = false;
        document.body.removeEventListener('click', selectElement);
        if (selectedElement) {
            selectedElement.classList.remove('editable');
            selectedElement = null;
        }
        menu.classList.remove('active'); // 收起菜单
    }

    function selectElement(e) {
        if (isEditing) {
            const element = e.target;
            if (element !== button && element !== menu && !element.classList.contains('edit-tools-btn')) {
                if (selectedElement) {
                    selectedElement.classList.remove('editable');
                }
                if (element.tagName.toLowerCase() === 'img') {
                    selectedElement = element;
                    selectedElement.classList.add('editable');
                } else {
                    alert('请选择一个图片元素');
                }
            }
        }
    }
})();
