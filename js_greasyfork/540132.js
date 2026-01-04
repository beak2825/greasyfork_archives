// ==UserScript==
// @name         福利吧百家姓暗号转换器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动识别页面中的福利吧百家姓暗号并转换为磁力链接
// @author       MR.Z
// @match        https://fuliba2023.net/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/540132/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E6%9A%97%E5%8F%B7%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540132/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E6%9A%97%E5%8F%B7%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

// ==UserScript==
// @name        百家姓暗号
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description 识别和转换网页中的"百家姓暗号"
// @license    MIT
// ==/UserScript==

(function() {
    'use strict';

    // 百家姓映射表
    const surnameMap = {
        "赵":"0", "钱":"1", "孙":"2", "李":"3", "周":"4", "吴":"5", "郑":"6", "王":"7", "冯":"8", "陈":"9",
        "褚":"a", "卫":"b", "蒋":"c", "沈":"d", "韩":"e", "杨":"f", "朱":"g", "秦":"h", "尤":"i", "许":"j",
        "何":"k", "吕":"l", "施":"m", "张":"n", "孔":"o", "曹":"p", "严":"q", "华":"r", "金":"s", "魏":"t",
        "陶":"u", "姜":"v", "戚":"w", "谢":"x", "邹":"y", "喻":"z", "福":"A", "水":"B", "窦":"C", "章":"D",
        "云":"E", "苏":"F", "潘":"G", "葛":"H", "奚":"I", "范":"J", "彭":"K", "郎":"L", "鲁":"M", "韦":"N",
        "昌":"O", "马":"P", "苗":"Q", "凤":"R", "花":"S", "方":"T", "俞":"U", "任":"V", "袁":"W", "柳":"X",
        "唐":"Y", "罗":"Z", "薛":".", "伍":"-", "余":"_", "米":"+", "贝":"=", "姚":"/", "孟":"?", "顾":"#",
        "尹":"%", "江":"&", "钟":"*"
    };

    // 获取评论区元素
    function findCommentContainer() {
        // 常见评论区选择器
        const commentSelectors = [
            '#comments',
            '#comment',
            '.comments',
            '.comment',
            '.comment-list',
            '.comment-section',
            '.comment-container',
            '.comment-area',
            '.article-comments',
            '.post-comments'
        ];
        
        for (const selector of commentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }
        return document.body; // 如果找不到则返回整个body
    }

    // 自动扫描页面文本节点
    function scanTextNodes() {
        console.log('开始扫描页面文本节点...');
        const commentContainer = findCommentContainer();
        const walker = document.createTreeWalker(
            commentContainer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 跳过script、style、textarea等元素
                    if (node.parentNode.nodeName === 'SCRIPT' || 
                        node.parentNode.nodeName === 'STYLE' ||
                        node.parentNode.nodeName === 'TEXTAREA' ||
                        node.parentNode.nodeName === 'INPUT' ||
                        node.parentNode.hasAttribute('data-surname-ignore')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 检查是否已处理过
                    if (node.parentNode.hasAttribute('data-surname-processed')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        let foundCount = 0;
        while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            if (text.length === 0) continue;

            console.log('扫描到文本:', text.substring(0, 50) + (text.length > 50 ? '...' : ''));
            
            if (isSurnameCode(text)) {
                console.log('发现百家姓暗号:', text);
                foundCount++;
                processSurnameCode(node, text);
            }
        }
        console.log(`扫描完成，共发现${foundCount}处百家姓暗号`);
    }

    // 检查是否是百家姓暗号
    function isSurnameCode(text) {
        // 检查是否包含至少3个百家姓字符，提高准确性
        let surnameCount = 0;
        const surnames = Object.keys(surnameMap);
        
        for (const surname of surnames) {
            if (text.includes(surname)) {
                surnameCount++;
                if (surnameCount >= 3) {
                    return true;
                }
            }
        }
        return false;
    }

    // 处理找到的百家姓暗号
    function processSurnameCode(textNode, text) {
        // 双重检查是否已经处理过
        if (textNode.parentNode.hasAttribute('data-surname-processed') ||
            textNode.parentNode.querySelector('button[data-surname-button]')) {
            return;
        }
        
        const span = document.createElement('span');
        span.textContent = text;
        
        const button = document.createElement('button');
        button.textContent = '识别暗号';
        button.setAttribute('data-surname-button', 'true');
        button.style.cssText = `
            margin-left: 8px;
            padding: 4px 12px;
            font-size: 13px;
            font-weight: 500;
            color: #fff;
            background-color: #4a6cf7;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            min-width: 80px;
            min-height: 32px;
        `;

        // 移动端样式调整
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            @media (max-width: 768px) {
                button[data-surname-button] {
                    padding: 8px 16px;
                    font-size: 15px;
                    min-width: 90px;
                    min-height: 36px;
                }
                
                div[data-surname-toast] {
                    font-size: 16px;
                    padding: 16px 28px;
                    bottom: 30px;
                    max-width: 80%;
                }
            }
        `;
        document.head.appendChild(mobileStyle);
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#3a5ce9';
            button.style.transform = 'translateY(-1px)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#4a6cf7';
            button.style.transform = 'none';
        });
        
        // 创建美观的提示函数
        function showToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.setAttribute('data-surname-toast', 'true');
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #4a6cf7;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                white-space: nowrap;
            `;
            document.body.appendChild(toast);
            
            // 显示动画
            setTimeout(() => {
                toast.style.opacity = '1';
            }, 10);
            
            // 3秒后自动消失
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }

        button.addEventListener('click', function() {
            const magnetLink = 'magnet:?xt=urn:btih:' + encodeToCipher(text);
            GM_setClipboard(magnetLink);
            showToast('磁力链接已复制');
        });

        const wrapper = document.createElement('span');
        wrapper.setAttribute('data-surname-processed', 'true');
        wrapper.appendChild(span);
        wrapper.appendChild(button);
        
        textNode.parentNode.replaceChild(wrapper, textNode);
    }

    // 转换函数
    function encodeToCipher(text) {
        const chars = text.split('');
        let result = '';
        for(let i = 0; i < chars.length; i++) {
            const cipher = getValueByKey(surnameMap, chars[i]);
            result += cipher || '';
        }
        return result;
    }

    function getValueByKey(obj, key) {
        for(let k in obj) {
            if(k === key) {
                return obj[k];
            }
        }
        return '';
    }

    // 初始化扫描 - 优化性能版本
    let isScanning = false;
    let scanQueue = [];
    let debounceTimer;

    function throttledScan() {
        if (isScanning) {
            return;
        }

        isScanning = true;
        const startTime = performance.now();
        
        // 每次最多处理50个节点
        const nodesToProcess = scanQueue.splice(0, 50);
        for (const node of nodesToProcess) {
            // 跳过已处理的节点
            if (node.parentNode && node.parentNode.hasAttribute('data-surname-processed')) {
                continue;
            }
            
            const text = node.nodeValue.trim();
            if (text.length > 0 && isSurnameCode(text)) {
                processSurnameCode(node, text);
            }
        }

        isScanning = false;
        console.log(`扫描完成，耗时${(performance.now() - startTime).toFixed(2)}ms`);

        if (scanQueue.length > 0) {
            setTimeout(throttledScan, 100);
        }
    }

    function handleMutations(mutations) {
        // 暂停期间不处理
        if (!observer) return;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const walker = document.createTreeWalker(
                            node,
                            NodeFilter.SHOW_TEXT,
                            {
                                acceptNode: function(n) {
                                    // 跳过已处理节点
                                    if (processedNodes.has(n)) {
                                        return NodeFilter.FILTER_REJECT;
                                    }
                                    if (n.parentNode.nodeName === 'SCRIPT' || 
                                        n.parentNode.nodeName === 'STYLE' ||
                                        n.parentNode.nodeName === 'TEXTAREA' ||
                                        n.parentNode.nodeName === 'INPUT') {
                                        return NodeFilter.FILTER_REJECT;
                                    }
                                    return NodeFilter.FILTER_ACCEPT;
                                }
                            },
                            false
                        );

                        let textNode;
                        while (textNode = walker.nextNode()) {
                            // 检查是否已存在相同内容的按钮
                            if (!textNode.parentNode.querySelector('button[data-surname-button]')) {
                                scanQueue.push(textNode);
                            }
                        }
                    }
                });
            }
        });

        // 防抖处理
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(throttledScan, 300); // 缩短防抖时间
    }

    // 延迟初始化扫描
    setTimeout(() => {
        try {
            console.log('开始初始扫描...');
            const initialWalker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        if (node.parentNode.nodeName === 'SCRIPT' || 
                            node.parentNode.nodeName === 'STYLE' ||
                            node.parentNode.nodeName === 'TEXTAREA' ||
                            node.parentNode.nodeName === 'INPUT') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            let initialNode;
            while (initialNode = initialWalker.nextNode()) {
                scanQueue.push(initialNode);
            }
            
            throttledScan();

            // 监听DOM变化，使用防抖
            const observer = new MutationObserver(handleMutations);
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        } catch (e) {
            console.error('初始化扫描出错:', e);
        }
    }, 2000); // 延长初始延迟
})();
