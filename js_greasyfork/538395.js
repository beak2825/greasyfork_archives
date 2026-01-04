// ==UserScript==
// @name         Amazon退货页面多功能增强脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  结合沟通检测、联系买家新标签页打开、买家意见复制三大功能，提升效率！
// @author       祀尘
// @match        https://sellercentral.amazon.com/gp/returns*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538395/Amazon%E9%80%80%E8%B4%A7%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538395/Amazon%E9%80%80%E8%B4%A7%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /********************** 1. 沟通检测 ************************/
    let processing = false;
    let shouldStop = false;
    let iframe = null;

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function addControlButton() {
        if (document.querySelector('#bornoon-check-button')) return;

        const btn = document.createElement('button');
        btn.id = 'bornoon-check-button';
        btn.textContent = '检测沟通状态';
        Object.assign(btn.style, {
            position: 'fixed',
            top: '50%',
            right: '30px',
            transform: 'translateY(-50%)',
            zIndex: '9999',
            padding: '10px 16px',
            fontSize: '14px',
            backgroundColor: '#0077cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        });

        btn.addEventListener('click', async () => {
            if (!processing) {
                shouldStop = false;
                btn.textContent = '停止检测';
                await processOrders(() => {
                    btn.textContent = '检测沟通状态';
                });
            } else {
                shouldStop = true;
                btn.textContent = '检测沟通状态';
            }
        });

        document.body.appendChild(btn);
    }

    async function processOrders(onFinish) {
        if (processing) return;
        processing = true;

        const orderRows = Array.from(document.querySelectorAll('kat-table-row.manage-returns-table-row'));
        const tasks = [];

        for (const row of orderRows) {
            if (row.dataset.bornoonChecked) continue;
            row.dataset.bornoonChecked = 'true';

            const orderLink = row.querySelector('a[href*="/order/"]');
            const historyLink = row.querySelector('a[href*="/messaging/inbox"]');
            if (!orderLink || !historyLink) continue;

            const orderId = orderLink.textContent.trim();
            const targetCol = historyLink.closest('.col');
            if (!targetCol) continue;

            const statusEl = document.createElement('div');
            statusEl.textContent = '查询中...';
            targetCol.insertAdjacentElement('beforebegin', statusEl);
            tasks.push({ orderId, statusEl });
        }

        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        for (const task of tasks) {
            if (shouldStop) break;
            const isContacted = await checkViaIframe(task.orderId);
            task.statusEl.textContent = isContacted ? '沟通过' : '未沟通';
            task.statusEl.style.backgroundColor = isContacted ? '#dc3545' : '#17a2b8';
            task.statusEl.style.color = 'white';
            task.statusEl.style.fontSize = '13px';
            task.statusEl.style.padding = '2px 6px';
            task.statusEl.style.borderRadius = '12px';
            task.statusEl.style.display = 'inline-block';
            task.statusEl.style.marginTop = '2px';
            task.statusEl.style.float = 'right';
            task.statusEl.style.maxWidth = '80px';
            task.statusEl.style.textAlign = 'center';
            task.statusEl.style.whiteSpace = 'nowrap';
            await delay(100);
        }

        processing = false;
        onFinish();
    }

    function checkViaIframe(orderId) {
        return new Promise((resolve) => {
            const searchUrl = `https://sellercentral.amazon.com/messaging/inbox?fi=search&ss=${orderId}`;
            iframe.src = searchUrl;

            let startTime = Date.now();
            let resolved = false;

            const checkInterval = setInterval(() => {
                try {
                    const currentUrl = iframe.contentWindow.location.href;
                    if (currentUrl.includes('cc=') && currentUrl.includes(orderId)) {
                        clearInterval(checkInterval);
                        resolved = true;
                        resolve(true);
                    } else if (Date.now() - startTime > 3000) {
                        clearInterval(checkInterval);
                        resolved = true;
                        resolve(false);
                    }
                } catch (err) {
                    clearInterval(checkInterval);
                    resolved = true;
                    resolve(true);
                }
            }, 800);

            setTimeout(() => {
                if (!resolved) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 4000);
        });
    }

    /********************** 2. 联系买家按钮改新标签页 ************************/
    const marketplaceId = 'ATVPDKIKX0DER';

    function bindContactBuyerButton(button) {
        if (button.dataset.bound) return;
        button.dataset.bound = 'true';

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();

            let orderBlock = button.closest('kat-table-row');
            if (!orderBlock) return;

            let orderIdLink = orderBlock.querySelector('a[href*="/order/"]');
            let orderId = orderIdLink?.href.match(/order\/([\d\-]+)/)?.[1];
            let buyerLabel = orderBlock.querySelector('kat-label.item-details-text-break-word label span.text');
            let buyerId = buyerLabel?.innerText.trim();

            if (!orderId || !buyerId) return;

            const newUrl = `https://sellercentral.amazon.com/messaging/contact/returns?buyerID=${encodeURIComponent(buyerId)}&custType=buyer&isMYR=1&marketplaceId=${marketplaceId}&orderID=${encodeURIComponent(orderId)}`;
            window.open(newUrl, '_blank');
        }, true);
    }

    function scanAllContactButtons() {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent.trim() === '联系买家') {
                bindContactBuyerButton(button);
            }
        });
    }

    const observer1 = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'BUTTON' && node.textContent.trim() === '联系买家') {
                        bindContactBuyerButton(node);
                    }
                    node.querySelectorAll?.('button').forEach(button => {
                        if (button.textContent.trim() === '联系买家') {
                            bindContactBuyerButton(button);
                        }
                    });
                }
            });
        }
    });

    observer1.observe(document.body, { childList: true, subtree: true });

    /********************** 3. 添加“复制买家意见”按钮 ************************/
    function addCopyButtons() {
        document.querySelectorAll('.customer-comment').forEach(function(commentElem) {
            if (commentElem.dataset.copyAdded) return;
            const commentText = commentElem.innerText.trim();
            const row = commentElem.closest('kat-table-row');
            const buyerNameElem = row.querySelector('.list-returns-row-cell.div1 .item-details-text-break-word .text');
            const buyerName = buyerNameElem ? buyerNameElem.innerText.trim() : '';

            const btn = document.createElement('button');
            btn.textContent = '复制';
            btn.style.marginLeft = '4px';
            btn.style.fontSize = '12px';
            btn.style.padding = '2px 6px';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.backgroundColor = '#0077cc'; // 蓝色背景
            btn.style.color = '#fff'; // 白色文字
            btn.style.cursor = 'pointer';
            btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)';


            btn.addEventListener('click', function() {
                const textToCopy = buyerName + '\n' + commentText;
                navigator.clipboard.writeText(textToCopy).then(function() {
                    const tip = document.createElement('span');
                    tip.textContent = ' 已复制';
                    tip.style.color = 'green';
                    tip.style.marginLeft = '4px';
                    btn.parentNode.insertBefore(tip, btn.nextSibling);
                    setTimeout(() => tip.remove(), 500);
                }).catch(function() {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        const tip = document.createElement('span');
                        tip.textContent = ' 已复制';
                        tip.style.color = 'green';
                        tip.style.marginLeft = '4px';
                        btn.parentNode.insertBefore(tip, btn.nextSibling);
                        setTimeout(() => tip.remove(), 500);
                    } catch (err) {
                        console.error('复制失败:', err);
                    }
                    document.body.removeChild(textarea);
                });
            });

            commentElem.parentElement.appendChild(btn);
            commentElem.dataset.copyAdded = 'true';
        });
    }

    const observer2 = new MutationObserver(addCopyButtons);
    observer2.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(() => {
            addControlButton();
            scanAllContactButtons();
            addCopyButtons();
        }, 1000);
    });
})();
