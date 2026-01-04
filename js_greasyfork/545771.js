// ==UserScript==
// @name         GiteeTree
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gitee目录树生成与卡片化分享
// @author       Azad-sl
// @match        https://gitee.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @connect      gitee.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @resource     fontAwesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
// @license      MIT
// @homepageURL  https://gitee.com/azad-sl/GiteeTree
// @supportURL  https://gitee.com/azad-sl/GiteeTree/issues
// @downloadURL https://update.greasyfork.org/scripts/545771/GiteeTree.user.js
// @updateURL https://update.greasyfork.org/scripts/545771/GiteeTree.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        .gitee-tree-btn {
            background-color: #4CAF50 !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-weight: 500 !important;
            display: inline-flex !important;
            align-items: center !important;
            transition: background-color 0.2s !important;
            font-size: 14px !important;
            height: 32px !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
        }
        .gitee-tree-btn:hover {
            background-color: #3d8b40 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        }
        .gitee-tree-btn-fixed {
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            z-index: 9999 !important;
        }
        .gitee-tree-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        .gitee-tree-modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 20px;
            border-radius: 16px;
            width: 90%;
            max-width: 900px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 768px) {
            .gitee-tree-modal-content {
                width: 95%;
                max-width: 95%;
                margin: 10% auto;
                padding: 15px;
            }
        }
        @media (max-width: 480px) {
            .gitee-tree-modal-content {
                width: 98%;
                max-width: 98%;
                margin: 15% auto;
                padding: 10px;
            }
        }
        .gitee-tree-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .gitee-tree-modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a202c;
            display: flex;
            align-items: center;
        }
        .gitee-tree-close {
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        .gitee-tree-close:hover {
            color: #667eea;
        }
        .gitee-tree-logo {
            width: 28px;
            height: 28px;
            margin-right: 10px;
            fill: #c71d23;
            display: inline-block;
            vertical-align: middle;
        }
        .gitee-tree-input-field {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            width: 100%;
            margin-bottom: 10px;
        }
        .gitee-tree-input-field:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .gitee-tree-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            cursor: pointer;
        }
        .gitee-tree-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .gitee-tree-btn-secondary {
            background: rgba(255, 255, 255, 0.9);
            color: #4b5563;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            margin-right: 8px;
            margin-bottom: 8px;
        }
        .gitee-tree-btn-secondary:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-1px);
        }
        .gitee-tree-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }
        .gitee-tree-result-container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            padding: 1.5rem;
            margin-top: 1.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .gitee-tree-directory-tree-container {
            background: rgba(249, 250, 251, 0.8);
            border-radius: 8px;
            padding: 1rem;
            max-height: 400px;
            overflow-y: auto;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            line-height: 1.6;
        }
        .gitee-tree-advanced-options {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 16px;
            margin-top: 16px;
            margin-bottom: 16px;
        }
        .gitee-tree-advanced-options-title {
            font-weight: 600;
            margin-bottom: 12px;
            color: #4b5563;
            display: flex;
            align-items: center;
        }
        .gitee-tree-advanced-options-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
        }
        .gitee-tree-option-group {
            display: flex;
            flex-direction: column;
        }
        .gitee-tree-option-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 6px;
        }
        .gitee-tree-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .gitee-tree-loader {
            width: 40px;
            height: 40px;
            position: relative;
        }
        .gitee-tree-loader-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #667eea;
            animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .gitee-tree-loader-circle:nth-child(2) {
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
            border-top-color: #764ba2;
            animation-delay: 0.2s;
        }
        .gitee-tree-loader-circle:nth-child(3) {
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
            border-top-color: #9f7aea;
            animation-delay: 0.4s;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .gitee-tree-loader-text {
            margin-top: 1rem;
            color: #6b7280;
            font-size: 0.875rem;
        }
        .gitee-tree-loader-dots {
            display: inline-flex;
            gap: 4px;
        }
        .gitee-tree-loader-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #667eea;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .gitee-tree-loader-dot:nth-child(1) { animation-delay: -0.32s; }
        .gitee-tree-loader-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        .gitee-tree-error-section {
            margin-top: 1rem;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            padding: 1rem;
            color: #c33;
        }
        .gitee-tree-flex {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }
        .gitee-tree-dropdown {
            position: relative;
            display: inline-block;
        }
        .gitee-tree-dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 120px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
            border-radius: 8px;
            overflow: hidden;
        }
        .gitee-tree-dropdown-content a {
            color: #333;
            padding: 8px 12px;
            text-decoration: none;
            display: block;
        }
        .gitee-tree-dropdown-content a:hover {
            background-color: #f1f1f1;
        }
        .gitee-tree-dropdown:hover .gitee-tree-dropdown-content {
            display: block;
        }

        .gitee-tree-mac-button-red {
            background-color: #ff5f57 !important;
        }
        .gitee-tree-mac-button-yellow {
            background-color: #ffbd2e !important;
        }
        .gitee-tree-mac-button-green {
            background-color: #28ca42 !important;
        }

        .gitee-tree-mac-card {
            background: linear-gradient(145deg, #2d3748, #1a202c);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            width: 400px;
            max-width: 90%;
            margin: 0 auto;
        }
        .gitee-tree-mac-header {
            background: linear-gradient(145deg, #4a5568, #2d3748);
            padding: 10px 16px; 
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .gitee-tree-mac-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        .gitee-tree-mac-content {
            padding: 20px; 
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        .gitee-tree-mac-info {
            flex: 1;
            color: #e2e8f0;
        }
        .gitee-tree-mac-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #f7fafc;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        .gitee-tree-mac-desc {
            font-size: 0.875rem;
            color: #cbd5e0;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .gitee-tree-mac-stats {
            display: flex;
            gap: 16px;
            font-size: 0.875rem;
        }

        .gitee-tree-gitee-card {
            background: #ffffff;
            border: 1px solid #d0d7de;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            width: 400px;
            max-width: 90%;
            margin: 0 auto;
        }
        .gitee-tree-gitee-header {
            background: #f6f8fa;
            padding: 10px 16px; 
            border-bottom: 1px solid #d0d7de;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .gitee-tree-gitee-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #0969da;
            display: flex;
            align-items: center;
        }
        .gitee-tree-gitee-badge {
            background: #ddf4ff;
            color: #0969da;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            margin-left: auto;
        }
        .gitee-tree-gitee-content {
            padding: 16px;
            display: flex;
            gap: 20px;
        }
        .gitee-tree-gitee-info {
            flex: 1;
        }
        .gitee-tree-gitee-desc {
            color: #656d76;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .gitee-tree-gitee-stats {
            display: flex;
            gap: 16px;
            font-size: 0.875rem;
            color: #656d76;
        }

        .gitee-tree-material-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
            width: 400px;
            max-width: 90%;
            margin: 0 auto;
        }
        .gitee-tree-material-content {
            padding: 20px; 
        }
        .gitee-tree-material-top {
            display: flex;
            gap: 20px;
            align-items: flex-start;
            margin-bottom: 16px; 
        }
        .gitee-tree-material-info {
            flex: 1;
        }
        .gitee-tree-material-title {
            font-size: 1.5rem;
            font-weight: 400;
            color: #202124;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        .gitee-tree-material-desc {
            color: #5f6368;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .gitee-tree-material-divider {
            height: 1px;
            background: #e8eaed;
            margin: 16px 0; 
        }
        .gitee-tree-material-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #5f6368;
        }
        .gitee-tree-material-stats-left {
            display: flex;
            gap: 20px;
        }

        .gitee-tree-modern-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            color: white;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            width: 400px;
            max-width: 90%;
            margin: 0 auto;
        }
        .gitee-tree-modern-content {
            padding: 20px 28px; 
        }
        .gitee-tree-modern-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        .gitee-tree-modern-desc {
            opacity: 0.9;
            margin-bottom: 20px; 
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        .gitee-tree-modern-footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .gitee-tree-modern-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .gitee-tree-modern-stat {
            opacity: 0.9;
            font-size: 0.9rem;
        }

        .gitee-tree-qr-container {
            background: white;
            padding: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .gitee-tree-mac-tree-container {
            background: linear-gradient(145deg, #2d3748, #1a202c);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            width: 900px;
            color: #e2e8f0;
        }
        .gitee-tree-mac-tree-header {
            background: linear-gradient(145deg, #4a5568, #2d3748);
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .gitee-tree-mac-tree-content {
            padding: 20px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            line-height: 1.6;
            white-space: pre;
            overflow: visible;
            font-size: 14px;
        }
        .gitee-tree-token-status {
            margin-top: 8px;
            color: #28a745;
            font-size: 0.875rem;
            display: none;
        }
        .gitee-tree-token-status.active {
            display: block;
        }
        .fas, .far, .fab {
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
    `);
    
    function createTreeButton() {
        const treeButton = document.createElement('button');
        treeButton.className = 'gitee-tree-btn gitee-tree-btn-fixed';
        treeButton.innerHTML = '<i class="fas fa-tree"></i> GiteeTree';
        treeButton.title = '生成Gitee项目目录树';
        document.body.appendChild(treeButton);
        treeButton.addEventListener('click', openTreeModal);
    }
    function createTreeModal() {
        const modal = document.createElement('div');
        modal.className = 'gitee-tree-modal';
        modal.id = 'giteeTreeModal';
        const modalContent = document.createElement('div');
        modalContent.className = 'gitee-tree-modal-content';
        const modalHeader = document.createElement('div');
        modalHeader.className = 'gitee-tree-modal-header';
        const modalTitle = document.createElement('h2');
        modalTitle.className = 'gitee-tree-modal-title';
        modalTitle.innerHTML = `
            <svg class="gitee-tree-logo" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z" fill="currentColor"></path>
            </svg>
            GiteeTree - Gitee目录树生成与卡片化分享
        `;
        const closeButton = document.createElement('span');
        closeButton.className = 'gitee-tree-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', closeTreeModal);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        const modalBody = document.createElement('div');
        modalBody.className = 'gitee-tree-modal-body';
        modalBody.innerHTML = `
            <div class="gitee-tree-section">
                <details>
                    <summary class="cursor-pointer flex justify-between items-center text-lg font-semibold text-gray-700 hover:text-gray-900 transition duration-200">
                        <span><i class="fas fa-key mr-2"></i>API 访问令牌设置</span>
                        <i class="fas fa-chevron-down transform transition-transform duration-200"></i>
                    </summary>
                    <div class="mt-4 space-y-4 pt-4 border-t border-gray-100">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gitee 个人访问令牌</label>
                            <div class="flex space-x-2">
                                <input type="password" id="giteeTreeTokenInput" placeholder="输入你的 Gitee 个人访问令牌" class="flex-1 gitee-tree-input-field">
                                <button id="giteeTreeSaveTokenBtn" class="gitee-tree-btn-secondary">保存</button>
                            </div>
                        </div>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p class="text-sm text-blue-700">
                                <i class="fas fa-info-circle mr-2"></i>
                                <strong>如何获取访问令牌：</strong><br>
                                请访问 <a href="https://gitee.com/profile/personal_access_tokens" target="_blank" class="font-semibold underline hover:text-blue-800">Gitee 个人访问令牌页面 <i class="fas fa-external-link-alt text-xs"></i></a> 生成新令牌，确保勾选 <code class="bg-blue-100 px-1 rounded">user_info</code> 和 <code class="bg-blue-100 px-1 rounded">projects</code> 权限。
                            </p>
                        </div>
                        <div id="giteeTreeTokenStatus" class="gitee-tree-token-status">
                            <div class="flex items-center space-x-2 text-green-600">
                                <i class="fas fa-check-circle"></i>
                                <span class="text-sm">访问令牌已保存</span>
                            </div>
                        </div>
                    </div>
                </details>
            </div>
            <div class="gitee-tree-section">
                <h2 class="gitee-tree-section-title">
                    <i class="fas fa-tools mr-2"></i>项目地址
                </h2>
                <div class="space-y-4">
                    <input type="text" id="giteeTreeProjectInput" placeholder="例如：gitee.com/owner/repo 或 owner/repo" class="gitee-tree-input-field">
                    <div class="gitee-tree-advanced-options">
                        <div class="gitee-tree-advanced-options-title">
                            <i class="fas fa-cog mr-2"></i>高级选项
                        </div>
                        <div class="gitee-tree-advanced-options-content">
                            <div class="gitee-tree-option-group">
                                <label class="gitee-tree-option-label">目录深度</label>
                                <select id="giteeTreeDepthSelect" class="gitee-tree-input-field">
                                    <option value="1">1层（仅根目录）</option>
                                    <option value="2">2层</option>
                                    <option value="3">3层</option>
                                    <option value="4">4层</option>
                                    <option value="5">5层</option>
                                    <option value="0">全部（无限制）</option>
                                </select>
                            </div>
                            <div class="gitee-tree-option-group">
                                <label class="gitee-tree-option-label">显示内容</label>
                                <select id="giteeTreeViewTypeSelect" class="gitee-tree-input-field">
                                    <option value="all">完整视图（文件和文件夹）</option>
                                    <option value="folders">仅文件夹</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="gitee-tree-flex">
                        <button id="giteeTreeGenerateDirBtn" class="gitee-tree-btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <i class="fas fa-folder-tree"></i>
                            <span>生成目录树</span>
                        </button>
                        <button id="giteeTreeGenerateCardBtn" class="gitee-tree-btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <i class="fas fa-id-card"></i>
                            <span>生成分享卡片</span>
                        </button>
                    </div>
                </div>
                <div id="giteeTreeDirLoadingSection" class="gitee-tree-loader-container" style="display: none;">
                    <div class="gitee-tree-loader">
                        <div class="gitee-tree-loader-circle"></div>
                        <div class="gitee-tree-loader-circle"></div>
                        <div class="gitee-tree-loader-circle"></div>
                    </div>
                    <div class="gitee-tree-loader-text">
                        正在获取项目目录结构
                        <div class="gitee-tree-loader-dots">
                            <div class="gitee-tree-loader-dot"></div>
                            <div class="gitee-tree-loader-dot"></div>
                            <div class="gitee-tree-loader-dot"></div>
                        </div>
                    </div>
                </div>
                <div id="giteeTreeDirResultSection" style="display: none;">
                    <div class="gitee-tree-result-container">
                        <div class="gitee-tree-flex justify-between items-start mb-4 gap-4">
                            <h3 class="text-lg font-semibold text-gray-700">
                                <i class="fas fa-folder-tree mr-2"></i>项目目录树
                            </h3>
                            <div class="gitee-tree-flex">
                                <button id="giteeTreeCopyTextBtn" class="gitee-tree-btn-secondary">
                                    <i class="fas fa-copy mr-1"></i>复制文本
                                </button>
                                <button id="giteeTreeCopyMarkdownBtn" class="gitee-tree-btn-secondary">
                                    <i class="fas fa-code mr-1"></i>复制Markdown
                                </button>
                                <button id="giteeTreeDownloadImageBtn" class="gitee-tree-btn-secondary">
                                    <i class="fas fa-image mr-1"></i>导出图片
                                </button>
                                <div class="gitee-tree-dropdown">
                                    <button id="giteeTreeDownloadScriptBtn" class="gitee-tree-btn-secondary">
                                        <i class="fas fa-file-code mr-1"></i>下载脚本 <i class="fas fa-caret-down ml-1"></i>
                                    </button>
                                    <div class="gitee-tree-dropdown-content">
                                        <a id="giteeTreeDownloadBatBtn" href="#">Windows (.bat)</a>
                                        <a id="giteeTreeDownloadShBtn" href="#">Linux/Mac (.sh)</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="giteeTreeDirectoryTreeContainer" class="gitee-tree-directory-tree-container"></div>
                    </div>
                </div>
                <div id="giteeTreeCardLoadingSection" class="gitee-tree-loader-container" style="display: none;">
                    <div class="gitee-tree-loader">
                        <div class="gitee-tree-loader-circle"></div>
                        <div class="gitee-tree-loader-circle"></div>
                        <div class="gitee-tree-loader-circle"></div>
                    </div>
                    <div class="gitee-tree-loader-text">
                        正在生成项目分享卡片
                        <div class="gitee-tree-loader-dots">
                            <div class="gitee-tree-loader-dot"></div>
                            <div class="gitee-tree-loader-dot"></div>
                            <div class="gitee-tree-loader-dot"></div>
                        </div>
                    </div>
                </div>
                <div id="giteeTreeCardResultSection" style="display: none;">
                    <div class="gitee-tree-result-container">
                        <div class="gitee-tree-flex justify-between items-start mb-4 gap-4">
                            <h3 class="text-lg font-semibold text-gray-700">
                                <i class="fas fa-id-card mr-2"></i>项目分享卡片
                            </h3>
                            <div class="gitee-tree-flex">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">卡片风格</label>
                                    <select id="giteeTreeCardStyleSelect" class="gitee-tree-input-field text-sm">
                                        <option value="mac">macOS 风格</option>
                                        <option value="gitee">Gitee 风格</option>
                                        <option value="material">Material 风格</option>
                                        <option value="modern">现代风格</option>
                                    </select>
                                </div>
                                <button id="giteeTreeDownloadCardBtn" class="gitee-tree-btn-secondary self-end">
                                    <i class="fas fa-download mr-1"></i>下载卡片
                                </button>
                            </div>
                        </div>
                        <div class="flex justify-center">
                            <div id="giteeTreeShareCardContainer" class="w-full max-w-md"></div>
                        </div>
                    </div>
                </div>
                <div id="giteeTreeErrorSection" class="gitee-tree-error-section" style="display: none;">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle text-red-600 text-xl mr-3"></i>
                        <div>
                            <h3 class="text-lg font-semibold text-red-800">获取失败</h3>
                            <p class="text-red-600 mt-1" id="giteeTreeErrorMessage"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        initializeEventListeners();
    }
    function initializeEventListeners() {
        document.getElementById('giteeTreeSaveTokenBtn').addEventListener('click', () => {
            const token = document.getElementById('giteeTreeTokenInput').value.trim();
            if (token) {
                localStorage.setItem('gitee_token', token);
                document.getElementById('giteeTreeTokenStatus').classList.add('active');
                document.getElementById('giteeTreeGenerateDirBtn').disabled = false;
                document.getElementById('giteeTreeGenerateCardBtn').disabled = false;
            }
        });
        document.getElementById('giteeTreeGenerateDirBtn').addEventListener('click', async () => {
            const input = document.getElementById('giteeTreeProjectInput').value.trim();
            if (!input) {
                showError('请输入项目地址或路径');
                return;
            }
            const depth = parseInt(document.getElementById('giteeTreeDepthSelect').value);
            const viewType = document.getElementById('giteeTreeViewTypeSelect').value;
            try {
                const { owner, repo } = parseProjectPath(input);
                document.getElementById('giteeTreeDirLoadingSection').style.display = 'flex';
                document.getElementById('giteeTreeDirResultSection').style.display = 'none';
                document.getElementById('giteeTreeErrorSection').style.display = 'none';
                const [projectInfo, directory] = await Promise.all([
                    getProjectInfo(owner, repo),
                    getProjectDirectoryRecursive(owner, repo, '', 0, depth)
                ]);
                currentProjectInfo = projectInfo;
                currentDirectoryItems = directory;
                fullDirectoryTree = `${projectInfo.name}\n${generateDirectoryTreeText(directory, '', 'all')}`;
                currentDirectoryTree = `${projectInfo.name}\n${generateDirectoryTreeText(directory, '', viewType)}`;
                document.getElementById('giteeTreeDirectoryTreeContainer').innerHTML = `<pre>${currentDirectoryTree}</pre>`;
                document.getElementById('giteeTreeDirLoadingSection').style.display = 'none';
                document.getElementById('giteeTreeDirResultSection').style.display = 'block';
            } catch (error) {
                showError(error.message);
            }
        });
        document.getElementById('giteeTreeGenerateCardBtn').addEventListener('click', async () => {
            const input = document.getElementById('giteeTreeProjectInput').value.trim();
            if (!input) {
                showError('请输入项目地址或路径');
                return;
            }
            try {
                const { owner, repo } = parseProjectPath(input);
                document.getElementById('giteeTreeCardLoadingSection').style.display = 'flex';
                document.getElementById('giteeTreeCardResultSection').style.display = 'none';
                document.getElementById('giteeTreeErrorSection').style.display = 'none';
                currentProjectInfo = await getProjectInfo(owner, repo);
                const container = document.getElementById('giteeTreeShareCardContainer');
                container.innerHTML = '';
                const card = generateShareCard(currentProjectInfo, selectedCardStyle);
                container.appendChild(card);
                document.getElementById('giteeTreeCardLoadingSection').style.display = 'none';
                document.getElementById('giteeTreeCardResultSection').style.display = 'block';
            } catch (error) {
                showError(error.message);
            }
        });
        document.getElementById('giteeTreeCopyTextBtn').addEventListener('click', () => {
            if (currentDirectoryTree) {
                GM_setClipboard(currentDirectoryTree);
                showButtonFeedback(document.getElementById('giteeTreeCopyTextBtn'));
            }
        });
        document.getElementById('giteeTreeCopyMarkdownBtn').addEventListener('click', () => {
            if (currentDirectoryTree) {
                const markdown = `\`\`\`\n${currentDirectoryTree}\`\`\``;
                GM_setClipboard(markdown);
                showButtonFeedback(document.getElementById('giteeTreeCopyMarkdownBtn'));
            }
        });
        document.getElementById('giteeTreeDownloadImageBtn').addEventListener('click', async () => {
            if (!fullDirectoryTree || !currentProjectInfo) return;
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            const macTreeContainer = document.createElement('div');
            macTreeContainer.className = 'gitee-tree-mac-tree-container';
            const macHeader = document.createElement('div');
            macHeader.className = 'gitee-tree-mac-tree-header';
            macHeader.innerHTML = `
                <div class="gitee-tree-mac-button gitee-tree-mac-button-red"></div>
                <div class="gitee-tree-mac-button gitee-tree-mac-button-yellow"></div>
                <div class="gitee-tree-mac-button gitee-tree-mac-button-green"></div>
                <div style="margin-left: 10px; display: flex; align-items: center;">
                    <svg class="gitee-tree-logo" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z" fill="currentColor"></path>
                    </svg>
                    <span style="color: #f7fafc; font-weight: 600;">${currentProjectInfo.full_name}</span>
                </div>
            `;
            const macContent = document.createElement('div');
            macContent.className = 'gitee-tree-mac-tree-content';
            macContent.textContent = fullDirectoryTree;
            macTreeContainer.appendChild(macHeader);
            macTreeContainer.appendChild(macContent);
            tempContainer.appendChild(macTreeContainer);
            document.body.appendChild(tempContainer);
            try {
                const contentHeight = macContent.scrollHeight;
                macTreeContainer.style.height = (contentHeight + 80) + 'px'; // 80px是头部高度
                const canvas = await html2canvas(macTreeContainer, {
                    backgroundColor: null,
                    scale: 2,
                    height: contentHeight + 80,
                    windowHeight: contentHeight + 80
                });
                const link = document.createElement('a');
                link.download = `${currentProjectInfo.full_name.replace('/', '-')}-directory.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showButtonFeedback(document.getElementById('giteeTreeDownloadImageBtn'), '已下载！');
            } catch (error) {
                console.error('生成图片失败:', error);
            } finally {
                document.body.removeChild(tempContainer);
            }
        });
        document.getElementById('giteeTreeDownloadBatBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentDirectoryItems || !currentProjectInfo) return;
            let scriptContent = `@echo off\necho Creating directory structure for ${currentProjectInfo.full_name}\necho.\n`;
            function generateBatScript(items, path = '') {
                items.forEach(item => {
                    const itemPath = path ? `${path}\\${item.name}` : item.name;
                    if (item.type === 'dir') {
                        scriptContent += `mkdir "${itemPath}"\n`;
                        if (item.children && item.children.length > 0) {
                            generateBatScript(item.children, itemPath);
                        }
                    } else {
                        scriptContent += `echo. > "${itemPath}"\n`;
                    }
                });
            }
            generateBatScript(currentDirectoryItems);
            scriptContent += `\necho Directory structure created successfully!\npause`;
            const blob = new Blob([scriptContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${currentProjectInfo.full_name.replace('/', '-')}-structure.bat`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
        document.getElementById('giteeTreeDownloadShBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentDirectoryItems || !currentProjectInfo) return;
            let scriptContent = `#!/bin/bash\necho "Creating directory structure for ${currentProjectInfo.full_name}"\necho\n`;
            function generateShScript(items, path = '') {
                items.forEach(item => {
                    const itemPath = path ? `${path}/${item.name}` : item.name;
                    if (item.type === 'dir') {
                        scriptContent += `mkdir -p "${itemPath}"\n`;
                        if (item.children && item.children.length > 0) {
                            generateShScript(item.children, itemPath);
                        }
                    } else {
                        scriptContent += `touch "${itemPath}"\n`;
                    }
                });
            }
            generateShScript(currentDirectoryItems);
            scriptContent += `\necho "Directory structure created successfully!"`;
            const blob = new Blob([scriptContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${currentProjectInfo.full_name.replace('/', '-')}-structure.sh`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
        document.getElementById('giteeTreeDownloadCardBtn').addEventListener('click', async () => {
            if (!currentProjectInfo) return;
            try {
                const cardElement = document.querySelector('#giteeTreeShareCardContainer > div');
                const canvas = await html2canvas(cardElement, {
                    backgroundColor: null,
                    scale: 2
                });
                const link = document.createElement('a');
                link.download = `${currentProjectInfo.full_name.replace('/', '-')}-card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('生成卡片图片失败:', error);
            }
        });
        document.getElementById('giteeTreeCardStyleSelect').addEventListener('change', (e) => {
            selectedCardStyle = e.target.value;
            if (currentProjectInfo) {
                const container = document.getElementById('giteeTreeShareCardContainer');
                container.innerHTML = '';
                const card = generateShareCard(currentProjectInfo, selectedCardStyle);
                container.appendChild(card);
            }
        });
        document.getElementById('giteeTreeProjectInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('giteeTreeGenerateDirBtn').click();
            }
        });
        document.querySelector('details').addEventListener('toggle', function() {
            const icon = this.querySelector('i.fa-chevron-down');
            if (this.open) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }
    function openTreeModal() {
        const modal = document.getElementById('giteeTreeModal');
        if (!modal) {
            createTreeModal();
            setTimeout(() => {
                document.getElementById('giteeTreeModal').style.display = 'block';
                const savedToken = localStorage.getItem('gitee_token');
                if (savedToken) {
                    document.getElementById('giteeTreeTokenInput').value = savedToken;
                    document.getElementById('giteeTreeTokenStatus').classList.add('active');
                    document.getElementById('giteeTreeGenerateDirBtn').disabled = false;
                    document.getElementById('giteeTreeGenerateCardBtn').disabled = false;
                }
                const pathParts = window.location.pathname.split('/').filter(part => part);
                if (pathParts.length >= 2) {
                    const owner = pathParts[0];
                    const repo = pathParts[1];
                    document.getElementById('giteeTreeProjectInput').value = `${owner}/${repo}`;
                }
            }, 100);
        } else {
            modal.style.display = 'block';
        }
    }
    function closeTreeModal() {
        document.getElementById('giteeTreeModal').style.display = 'none';
    }
    function showError(message) {
        document.getElementById('giteeTreeErrorMessage').textContent = message;
        document.getElementById('giteeTreeDirLoadingSection').style.display = 'none';
        document.getElementById('giteeTreeCardLoadingSection').style.display = 'none';
        document.getElementById('giteeTreeDirResultSection').style.display = 'none';
        document.getElementById('giteeTreeCardResultSection').style.display = 'none';
        document.getElementById('giteeTreeErrorSection').style.display = 'block';
    }
    function showButtonFeedback(button, text = '已复制！') {
        const originalContent = button.innerHTML;
        button.innerHTML = `<i class="fas fa-check mr-1"></i>${text}`;
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.disabled = false;
        }, 1500);
    }
    function parseProjectPath(input) {
        input = input.replace(/^https?:\/\//, '');
        input = input.replace(/^gitee\.com\//, '');
        input = input.replace(/\/$/, '');
        const parts = input.split('/');
        if (parts.length !== 2) {
            throw new Error('请输入正确的项目路径，格式：owner/repo');
        }
        return { owner: parts[0], repo: parts[1] };
    }
    async function getProjectInfo(owner, repo) {
        const savedToken = localStorage.getItem('gitee_token');
        if (!savedToken) {
            throw new Error('请先设置 Gitee 访问令牌');
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://gitee.com/api/v5/repos/${owner}/${repo}`,
                headers: {
                    'Authorization': `token ${savedToken}`,
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        if (response.status === 401) {
                            reject(new Error('访问令牌无效或已过期，请重新设置'));
                        } else if (response.status === 403) {
                            reject(new Error('访问令牌权限不足，请确保已勾选相应权限'));
                        } else if (response.status === 404) {
                            reject(new Error('项目不存在或无权访问'));
                        } else {
                            reject(new Error(`获取项目信息失败 (${response.status})`));
                        }
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }
    async function getProjectDirectoryRecursive(owner, repo, path = '', depth = 0, maxDepth = 0) {
        if (maxDepth > 0 && depth >= maxDepth) {
            return [];
        }
        const savedToken = localStorage.getItem('gitee_token');
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`,
                headers: {
                    'Authorization': `token ${savedToken}`,
                    'Accept': 'application/json'
                },
                onload: async function(response) {
                    if (response.status === 200) {
                        const items = JSON.parse(response.responseText);
                        for (const item of items) {
                            if (item.type === 'dir') {
                                item.children = await getProjectDirectoryRecursive(owner, repo, item.path, depth + 1, maxDepth);
                            }
                        }
                        resolve(items);
                    } else {
                        resolve([]);
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }
    function generateDirectoryTreeText(items, prefix = '', viewType = 'all') {
        let text = '';
        items.forEach((item, index) => {
            if (viewType === 'folders' && item.type !== 'dir') {
                return;
            }
            const isLast = index === items.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const icon = item.type === 'dir' ? '📁' : '📄';
            text += `${prefix}${connector}${icon} ${item.name}\n`;
            if (item.type === 'dir' && item.children && item.children.length > 0) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                text += generateDirectoryTreeText(item.children, newPrefix, viewType);
            }
        });
        return text;
    }
    function generateShareCard(projectInfo, style) {
        const cardDiv = document.createElement('div');
        const giteeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        giteeIcon.setAttribute('viewBox', '0 0 1024 1024');
        giteeIcon.setAttribute('width', '16');
        giteeIcon.setAttribute('height', '16');
        giteeIcon.classList.add('gitee-tree-logo');
        const giteePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        giteePath.setAttribute('d', 'M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z');
        giteePath.setAttribute('fill', 'currentColor');
        giteeIcon.appendChild(giteePath);

        switch(style) {
            case 'mac':
                cardDiv.className = 'gitee-tree-mac-card';
                cardDiv.innerHTML = `
                    <div class="gitee-tree-mac-header">
                        <div class="gitee-tree-mac-button gitee-tree-mac-button-red"></div>
                        <div class="gitee-tree-mac-button gitee-tree-mac-button-yellow"></div>
                        <div class="gitee-tree-mac-button gitee-tree-mac-button-green"></div>
                    </div>
                    <div class="gitee-tree-mac-content">
                        <div class="gitee-tree-mac-info">
                            <h3 class="gitee-tree-mac-title"></h3>
                            <p class="gitee-tree-mac-desc">${projectInfo.description || '暂无描述'}</p>
                            <div class="gitee-tree-mac-stats">
                                <span><i class="fas fa-star text-yellow-400 mr-1"></i>${projectInfo.stargazers_count || 0}</span>
                                <span><i class="fas fa-code-branch text-green-400 mr-1"></i>${projectInfo.forks_count || 0}</span>
                                <span><i class="fas fa-circle text-blue-400 mr-1 text-xs"></i>${projectInfo.language || '未知'}</span>
                            </div>
                        </div>
                        <div class="gitee-tree-qr-container">
                            <div id="giteeTreeQrcode"></div>
                        </div>
                    </div>
                `;
                const macTitle = cardDiv.querySelector('.gitee-tree-mac-title');
                macTitle.appendChild(giteeIcon.cloneNode(true));
                macTitle.appendChild(document.createTextNode(projectInfo.full_name));
                break;

            case 'gitee':
                cardDiv.className = 'gitee-tree-gitee-card';
                cardDiv.innerHTML = `
                    <div class="gitee-tree-gitee-header">
                        <h3 class="gitee-tree-gitee-title"></h3>
                        <span class="gitee-tree-gitee-badge">Public</span>
                    </div>
                    <div class="gitee-tree-gitee-content">
                        <div class="gitee-tree-gitee-info">
                            <p class="gitee-tree-gitee-desc">${projectInfo.description || '暂无描述'}</p>
                            <div class="gitee-tree-gitee-stats">
                                <span><i class="fas fa-star mr-1"></i>${projectInfo.stargazers_count || 0}</span>
                                <span><i class="fas fa-code-branch mr-1"></i>${projectInfo.forks_count || 0}</span>
                                <span><i class="fas fa-circle mr-1 text-xs"></i>${projectInfo.language || '未知'}</span>
                            </div>
                        </div>
                        <div class="gitee-tree-qr-container">
                            <div id="giteeTreeQrcode"></div>
                        </div>
                    </div>
                `;
                const giteeTitle = cardDiv.querySelector('.gitee-tree-gitee-title');
                giteeTitle.appendChild(giteeIcon.cloneNode(true));
                giteeTitle.appendChild(document.createTextNode(projectInfo.full_name));
                break;

            case 'material':
                cardDiv.className = 'gitee-tree-material-card';
                cardDiv.innerHTML = `
                    <div class="gitee-tree-material-content">
                        <div class="gitee-tree-material-top">
                            <div class="gitee-tree-material-info">
                                <h3 class="gitee-tree-material-title"></h3>
                                <p class="gitee-tree-material-desc">${projectInfo.description || '暂无描述'}</p>
                            </div>
                            <div class="gitee-tree-qr-container">
                                <div id="giteeTreeQrcode"></div>
                            </div>
                        </div>
                        <div class="gitee-tree-material-divider"></div>
                        <div class="gitee-tree-material-stats">
                            <div class="gitee-tree-material-stats-left">
                                <span><i class="fas fa-star mr-2"></i>${projectInfo.stargazers_count || 0}</span>
                                <span><i class="fas fa-code-branch mr-2"></i>${projectInfo.forks_count || 0}</span>
                            </div>
                            <span><i class="fas fa-circle mr-2 text-xs"></i>${projectInfo.language || '未知'}</span>
                        </div>
                    </div>
                `;
                const materialTitle = cardDiv.querySelector('.gitee-tree-material-title');
                materialTitle.appendChild(giteeIcon.cloneNode(true));
                materialTitle.appendChild(document.createTextNode(projectInfo.full_name));
                break;

            case 'modern':
                cardDiv.className = 'gitee-tree-modern-card';
                cardDiv.innerHTML = `
                    <div class="gitee-tree-modern-content">
                        <div>
                            <h3 class="gitee-tree-modern-title"></h3>
                            <p class="gitee-tree-modern-desc">${projectInfo.description || '暂无描述'}</p>
                        </div>
                        <div class="gitee-tree-modern-footer">
                            <div class="gitee-tree-modern-stats">
                                <div class="gitee-tree-modern-stat"><i class="fas fa-star mr-2"></i>${projectInfo.stargazers_count || 0} Stars</div>
                                <div class="gitee-tree-modern-stat"><i class="fas fa-code-branch mr-2"></i>${projectInfo.forks_count || 0} Forks</div>
                                <div class="gitee-tree-modern-stat"><i class="fas fa-circle mr-2 text-xs"></i>${projectInfo.language || '未知'}</div>
                            </div>
                            <div class="gitee-tree-qr-container">
                                <div id="giteeTreeQrcode"></div>
                            </div>
                        </div>
                    </div>
                `;
                const modernTitle = cardDiv.querySelector('.gitee-tree-modern-title');
                modernTitle.appendChild(giteeIcon.cloneNode(true));
                modernTitle.appendChild(document.createTextNode(projectInfo.full_name));
                break;
        }

        setTimeout(() => {
            const qrcodeDiv = cardDiv.querySelector('#giteeTreeQrcode');
            if (qrcodeDiv) {
                new QRCode(qrcodeDiv, {
                    text: projectInfo.html_url,
                    width: 96,
                    height: 96,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100);

        return cardDiv;
    }
    let savedToken = localStorage.getItem('gitee_token') || '';
    let selectedCardStyle = 'mac';
    let currentDirectoryTree = '';
    let currentProjectInfo = null;
    let currentDirectoryItems = [];
    let fullDirectoryTree = '';
    window.addEventListener('load', () => {
        setTimeout(() => {
            createTreeButton();
            window.addEventListener('click', (e) => {
                const modal = document.getElementById('giteeTreeModal');
                if (e.target === modal) {
                    closeTreeModal();
                }
            });
        }, 1000);
    });
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(createTreeButton, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();