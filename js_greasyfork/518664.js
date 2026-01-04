// ==UserScript==
// @name         适用AI的LaTeX公式格式转换工具
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将LaTeX公式格式转换为Markdown格式
// @author       榛铭
// @match        https://tongyi.aliyun.com/qianwen/*
// @match        https://chat.openai.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://chatgpt.com/**
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518664/%E9%80%82%E7%94%A8AI%E7%9A%84LaTeX%E5%85%AC%E5%BC%8F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/518664/%E9%80%82%E7%94%A8AI%E7%9A%84LaTeX%E5%85%AC%E5%BC%8F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
    
    // 添加 Font Awesome
    document.head.appendChild(Object.assign(document.createElement('link'), {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    }));
 
    // 添加基础样式
    GM_addStyle(`
        #formula-converter {
            position: fixed;
            top: 20vh;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            width: 500px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            transition: width 0.3s ease, height 0.3s ease, padding 0.3s ease;
        }
        #formula-converter textarea {
            width: 100%;
            height: 150px;
            margin: 10px 0;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
        }
        #formula-converter button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        #formula-converter button:hover {
            background: #45a049;
        }
        #formula-converter .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        #formula-converter .minimize-btn {
            background: none;
            border: none;
            color: #666;
            padding: 8px;
            margin: 0;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #formula-converter .minimize-btn:hover {
            background: #f0f0f0;
            color: #333;
        }
        #formula-converter .output {
            margin-top: 10px;
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
        }
        #formula-converter.minimized {
            width: 48px;
            height: 48px;
            padding: 0;
            border-radius: 50%;
            border: none;
        }
        #formula-converter.minimized .converter-content,
        #formula-converter.minimized .header span { 
            display: none; 
        }
        #formula-converter.minimized .minimize-btn {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border-radius: 50%;
        }
        .toast {
            position: fixed;
            bottom: 80px;
            right: 20px;
            padding: 10px 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 4px;
            display: none;
            z-index: 10000;
        }
    `);
 
    // 创建转换器界面
    const converterHTML = `
        <div id="formula-converter">
            <div class="header">
                <span>公式转换工具</span>
                <button class="minimize-btn" title="最小化/展开">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
            <div class="converter-content">
                <textarea placeholder="在此输入带有公式的文本..."></textarea>
                <div class="button-group">
                    <button class="convert-btn" title="转换LaTeX公式">
                        <i class="fas fa-exchange-alt"></i>
                        转换
                    </button>
                    <button class="copy-btn" title="复制转换结果">
                        <i class="fas fa-copy"></i>
                        复制结果
                    </button>
                    <button class="clear-btn" title="清空入">
                        <i class="fas fa-trash"></i>
                        清空
                    </button>
                </div>
                <div class="output"></div>
            </div>
            <div class="toast">已复制到剪贴板！</div>
        </div>
    `;
 
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', converterHTML);
 
    // 获取元素
    const elements = {
        converter: document.getElementById('formula-converter'),
        minimizeBtn: document.querySelector('#formula-converter .minimize-btn'),
        textarea: document.querySelector('#formula-converter textarea'),
        convertBtn: document.querySelector('#formula-converter .convert-btn'),
        copyBtn: document.querySelector('#formula-converter .copy-btn'),
        output: document.querySelector('#formula-converter .output'),
        toast: document.querySelector('#formula-converter .toast'),
        clearBtn: document.querySelector('#formula-converter .clear-btn')
    };
 
    // 初始化为最小化状态
    elements.converter.classList.add('minimized');
    elements.minimizeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512" width="24" height="24">
            <g>
                <g>
                    <path style="fill:#5596FB;" d="M441,61H341c-5.522,0-10,4.478-10,10s4.478,10,10,10h100c5.514,0,10,4.486,10,10v220     c0,5.514-4.486,10-10,10H71c-5.514,0-10-4.486-10-10V91c0-5.514,4.486-10,10-10h100c5.522,0,10-4.478,10-10s-4.478-10-10-10H71     c-16.542,0-30,13.458-30,30v220c0,16.542,13.458,30,30,30h370c16.542,0,30-13.458,30-30V91C471,74.458,457.542,61,441,61z"/>
                    <path style="fill:#5596FB;" d="M181,246h-20c-5.522,0-10,4.478-10,10s4.478,10,10,10h20c5.522,0,10-4.478,10-10     S186.522,246,181,246z"/>
                    <path style="fill:#5596FB;" d="M161,206c-5.522,0-10,4.478-10,10s4.478,10,10,10h20c5.522,0,10-4.478,10-10s-4.478-10-10-10H161z"/>
                    <path style="fill:#5596FB;" d="M121,206c5.522,0,10-4.478,10-10s-4.478-10-10-10H91c-5.522,0-10,4.478-10,10v80     c0,5.522,4.478,10,10,10h30c5.522,0,10-4.478,10-10s-4.478-10-10-10h-20v-20h20c5.522,0,10-4.478,10-10s-4.478-10-10-10h-20v-20     H121z"/>
                    <path style="fill:#5596FB;" d="M221,286c5.522,0,10-4.478,10-10v-35c0-8.271,6.729-15,15-15s15,6.729,15,15v35     c0,5.522,4.478,10,10,10s10-4.478,10-10v-35c0-8.271,6.729-15,15-15s15,6.729,15,15v35c0,5.522,4.478,10,10,10s10-4.478,10-10     v-35c0-19.299-15.701-35-35-35c-9.786,0-18.642,4.042-25,10.539c-10.807-11.043-26.954-13.371-40-7.159V206     c0-5.522-4.478-10-10-10s-10,4.478-10,10v70C211,281.522,215.478,286,221,286z"/>
                    <path style="fill:#5596FB;" d="M358.574,275.749c13.646,13.646,35.849,13.646,49.497,0c3.905-3.905,3.905-10.237,0-14.143     c-3.906-3.904-10.236-3.904-14.143,0c-5.846,5.85-15.363,5.849-21.213,0c-5.849-5.849-5.849-15.364-0.001-21.213     c5.85-5.849,15.366-5.848,21.214,0c3.906,3.904,10.236,3.904,14.143,0c3.905-3.905,3.905-10.237,0-14.143     c-13.647-13.646-35.851-13.646-49.498,0C344.927,239.897,344.927,262.103,358.574,275.749z"/>
                    <path style="fill:#5596FB;" d="M407,154l-32,24c-3.443,2.583-4.848,7.079-3.487,11.162c1.361,4.084,5.183,6.838,9.487,6.838h40     c5.522,0,10-4.478,10-10s-4.478-10-10-10h-10l8-6c7.514-5.636,12-14.607,12-24c0-16.542-13.458-30-30-30s-30,13.458-30,30     c0,5.522,4.478,10,10,10s10-4.478,10-10c0-5.514,4.486-10,10-10s10,4.486,10,10C411,149.131,409.505,152.121,407,154z"/>
                </g>
                <g>
                    <path style="fill:#283954;" d="M461,21H349.28C345.152,9.361,334.036,1,321,1H191c-13.036,0-24.152,8.361-28.28,20H51     C23.43,21,1,43.43,1,71v260c0,27.57,22.43,50,50,50h61.461l-28.055,91.178C78.466,491.485,92.875,511,113.079,511h18.149     c13.253,0,24.775-8.511,28.673-21.178L165.693,471h180.614l5.792,18.822c3.897,12.667,15.42,21.178,28.673,21.178h18.149     c20.199,0,34.614-19.511,28.673-38.822L399.539,381H461c27.57,0,50-22.43,50-50V71C511,43.43,488.57,21,461,21z M191,21h130     c5.514,0,10,4.486,10,10v40c0,5.514-4.486,10-10,10H191c-5.514,0-10-4.486-10-10V31C181,25.486,185.486,21,191,21z M131.229,491     h-18.149c-6.734,0-11.537-6.504-9.558-12.941L133.386,381h39.074c-3.407,11.073-28.244,91.793-31.674,102.941     C139.487,488.163,135.646,491,131.229,491z M318.615,381l9.231,30H184.155l9.231-30H318.615z M171.847,451l6.154-20h155.999     l6.154,20H171.847z M408.479,478.059c1.979,6.436-2.822,12.941-9.558,12.941h-18.149c-4.417,0-8.259-2.837-9.558-7.059     c-3.43-11.148-28.267-91.868-31.674-102.941h39.074L408.479,478.059z M491,331c0,16.542-13.458,30-30,30     c-49.548,0-84.553,0-135,0c-17.513,0-263.04,0-275,0c-16.542,0-30-13.458-30-30V71c0-16.542,13.458-30,30-30h110v30     c0,16.542,13.458,30,30,30h130c16.542,0,30-13.458,30-30V41h110c16.542,0,30,13.458,30,30V331z"/>
                </g>
            </g>
        </svg>
    `;
 
    // 转换函数
    function convertFormula(text) {
        return text
            .replace(/\\\((.+?)\\\)/g, '$$$1$')
            .replace(/(\s*)\\\[([\s\S]*?)\\\]/g, (_, indent, formula) => 
                `${indent}$$${formula.trim()}$$`
            );
    }
 
    // 显示提示
    const showToast = () => {
        elements.toast.style.display = 'block';
        setTimeout(() => elements.toast.style.display = 'none', 2000);
    };
 
    // 事件监听
    elements.minimizeBtn.addEventListener('click', () => {
        const isMinimized = elements.converter.classList.toggle('minimized');
        elements.minimizeBtn.innerHTML = isMinimized 
            ? `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512" width="24" height="24">
                <g>
                    <g>
                        <path style="fill:#5596FB;" d="M441,61H341c-5.522,0-10,4.478-10,10s4.478,10,10,10h100c5.514,0,10,4.486,10,10v220     c0,5.514-4.486,10-10,10H71c-5.514,0-10-4.486-10-10V91c0-5.514,4.486-10,10-10h100c5.522,0,10-4.478,10-10s-4.478-10-10-10H71     c-16.542,0-30,13.458-30,30v220c0,16.542,13.458,30,30,30h370c16.542,0,30-13.458,30-30V91C471,74.458,457.542,61,441,61z"/>
                        <path style="fill:#5596FB;" d="M181,246h-20c-5.522,0-10,4.478-10,10s4.478,10,10,10h20c5.522,0,10-4.478,10-10     S186.522,246,181,246z"/>
                        <path style="fill:#5596FB;" d="M161,206c-5.522,0-10,4.478-10,10s4.478,10,10,10h20c5.522,0,10-4.478,10-10s-4.478-10-10-10H161z"/>
                        <path style="fill:#5596FB;" d="M121,206c5.522,0,10-4.478,10-10s-4.478-10-10-10H91c-5.522,0-10,4.478-10,10v80     c0,5.522,4.478,10,10,10h30c5.522,0,10-4.478,10-10s-4.478-10-10-10h-20v-20h20c5.522,0,10-4.478,10-10s-4.478-10-10-10h-20v-20     H121z"/>
                        <path style="fill:#5596FB;" d="M221,286c5.522,0,10-4.478,10-10v-35c0-8.271,6.729-15,15-15s15,6.729,15,15v35     c0,5.522,4.478,10,10,10s10-4.478,10-10v-35c0-8.271,6.729-15,15-15s15,6.729,15,15v35c0,5.522,4.478,10,10,10s10-4.478,10-10     v-35c0-19.299-15.701-35-35-35c-9.786,0-18.642,4.042-25,10.539c-10.807-11.043-26.954-13.371-40-7.159V206     c0-5.522-4.478-10-10-10s-10,4.478-10,10v70C211,281.522,215.478,286,221,286z"/>
                        <path style="fill:#5596FB;" d="M358.574,275.749c13.646,13.646,35.849,13.646,49.497,0c3.905-3.905,3.905-10.237,0-14.143     c-3.906-3.904-10.236-3.904-14.143,0c-5.846,5.85-15.363,5.849-21.213,0c-5.849-5.849-5.849-15.364-0.001-21.213     c5.85-5.849,15.366-5.848,21.214,0c3.906,3.904,10.236,3.904,14.143,0c3.905-3.905,3.905-10.237,0-14.143     c-13.647-13.646-35.851-13.646-49.498,0C344.927,239.897,344.927,262.103,358.574,275.749z"/>
                        <path style="fill:#5596FB;" d="M407,154l-32,24c-3.443,2.583-4.848,7.079-3.487,11.162c1.361,4.084,5.183,6.838,9.487,6.838h40     c5.522,0,10-4.478,10-10s-4.478-10-10-10h-10l8-6c7.514-5.636,12-14.607,12-24c0-16.542-13.458-30-30-30s-30,13.458-30,30     c0,5.522,4.478,10,10,10s10-4.478,10-10c0-5.514,4.486-10,10-10s10,4.486,10,10C411,149.131,409.505,152.121,407,154z"/>
                    </g>
                    <g>
                        <path style="fill:#283954;" d="M461,21H349.28C345.152,9.361,334.036,1,321,1H191c-13.036,0-24.152,8.361-28.28,20H51     C23.43,21,1,43.43,1,71v260c0,27.57,22.43,50,50,50h61.461l-28.055,91.178C78.466,491.485,92.875,511,113.079,511h18.149     c13.253,0,24.775-8.511,28.673-21.178L165.693,471h180.614l5.792,18.822c3.897,12.667,15.42,21.178,28.673,21.178h18.149     c20.199,0,34.614-19.511,28.673-38.822L399.539,381H461c27.57,0,50-22.43,50-50V71C511,43.43,488.57,21,461,21z M191,21h130     c5.514,0,10,4.486,10,10v40c0,5.514-4.486,10-10,10H191c-5.514,0-10-4.486-10-10V31C181,25.486,185.486,21,191,21z M131.229,491     h-18.149c-6.734,0-11.537-6.504-9.558-12.941L133.386,381h39.074c-3.407,11.073-28.244,91.793-31.674,102.941     C139.487,488.163,135.646,491,131.229,491z M318.615,381l9.231,30H184.155l9.231-30H318.615z M171.847,451l6.154-20h155.999     l6.154,20H171.847z M408.479,478.059c1.979,6.436-2.822,12.941-9.558,12.941h-18.149c-4.417,0-8.259-2.837-9.558-7.059     c-3.43-11.148-28.267-91.868-31.674-102.941h39.074L408.479,478.059z M491,331c0,16.542-13.458,30-30,30     c-49.548,0-84.553,0-135,0c-17.513,0-263.04,0-275,0c-16.542,0-30-13.458-30-30V71c0-16.542,13.458-30,30-30h110v30     c0,16.542,13.458,30,30,30h130c16.542,0,30-13.458,30-30V41h110c16.542,0,30,13.458,30,30V331z"/>
                    </g>
                </g>
            </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                <path fill="currentColor" d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
               </svg>`;
    });
 
    elements.convertBtn.addEventListener('click', () => {
        elements.output.textContent = convertFormula(elements.textarea.value);
    });
 
    elements.copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.output.textContent)
            .then(showToast)
            .catch(() => alert('复制失败，请手动复制'));
    });
 
    elements.clearBtn.addEventListener('click', () => {
        elements.textarea.value = '';
    });
})();