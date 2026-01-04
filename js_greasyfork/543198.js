// ==UserScript==
// @name         SearchNixOS-LogoCustom
// @namespace    https://github.com/Rikka-Sei/SearchNixOS-LogoCustom
// @version      2025-10-08
// @description  因为骄傲月太长，Logo设计又不好看，为了真正的平等包容，实现了自定义图标的功能。
// @author       Rikki
// @match        https://search.nixos.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nixos.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @resource     bootstrapCSS https://search.nixos.org/bootstrap.min.css
// @run-at       document-start
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/543198/SearchNixOS-LogoCustom.user.js
// @updateURL https://update.greasyfork.org/scripts/543198/SearchNixOS-LogoCustom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文档加载前就注入CSS隐藏logo和添加Bootstrap样式
    const styleId = 'SearchNixOS-LogoCustom-style';
    GM_addStyle(`
        #${styleId} .logo {
            opacity: 0 !important;
            visibility: hidden !important;
        }
        /* 自定义弹窗样式 */
        .logo-custom-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            background: white;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 3px 9px rgba(0,0,0,0.5);
            width: 300px;
        }
        .logo-custom-modal .modal-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .logo-custom-modal .modal-footer {
            border-top: 1px solid #eee;
            padding-top: 15px;
            margin-top: 15px;
            text-align: right;
        }
        .logo-custom-modal .btn {
            display: inline-block;
            padding: 4px 12px;
            margin-bottom: 0;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            vertical-align: middle;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: #333;
            background-color: #f5f5f5;
            text-shadow: 0 1px 1px rgba(255,255,255,0.75);
        }
        .logo-custom-modal .btn-primary {
            color: white;
            background-color: #006dcc;
            border-color: #04c;
        }
        .logo-custom-modal .btn-danger {
            color: white;
            background-color: #da4f49;
            border-color: #bd362f;
        }
        /* 遮罩层样式 */
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 99998;
        }
    `);

    // 创建自定义弹窗函数
    function showLogoCustomModal() {
        // 创建遮罩层
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'logo-custom-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3>自定义图标设置</h3>
            </div>
            <div class="modal-body">
                <p>请选择要执行的操作：</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary change-logo">修改图标</button>
                <button class="btn btn-danger reset-logo">重置图标</button>
            </div>
        `;

        // 添加到文档
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // 关闭弹窗函数
        function closeModal() {
            modal.remove();
            backdrop.remove();
            document.removeEventListener('keydown', handleKeyDown);
        }

        // 键盘ESC键关闭
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }

        // 修改图标按钮事件
        modal.querySelector('.change-logo').addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const newLogoSrc = event.target.result;
                    GM_setValue('customLogo', newLogoSrc);
                    const logo = document.querySelector('.logo');
                    if (logo) {
                        logo.src = newLogoSrc;
                    }
                    closeModal();
                };
                reader.readAsDataURL(file);
            };
            
            input.click();
        });

        // 重置图标按钮事件
        modal.querySelector('.reset-logo').addEventListener('click', function() {
            GM_setValue('customLogo', null);
            const logo = document.querySelector('.logo');
            if (logo) {
                logo.src = logo.dataset.originalSrc || logo.src;
            }
            closeModal();
        });

        // 点击遮罩层关闭
        backdrop.addEventListener('click', closeModal);
        
        // 监听ESC键
        document.addEventListener('keydown', handleKeyDown);

        // 阻止模态框内部点击事件冒泡
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // 等待页面完全加载
    window.addEventListener('load', function() {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        // 保存原始logo地址
        logo.dataset.originalSrc = logo.src;

        // 移除之前添加的隐藏样式
        const styleElement = document.querySelector(`style[id="${styleId}"]`);
        if (styleElement) {
            styleElement.remove();
        }

        // 检查是否有存储的自定义logo
        const customLogo = GM_getValue('customLogo');
        if (customLogo) {
            logo.src = customLogo;
        }

        // 修改右键菜单事件
        logo.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showLogoCustomModal();
        });
    });
})();