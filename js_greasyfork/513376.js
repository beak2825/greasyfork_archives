// ==UserScript==
// @name         TEMU 批量打印物流单号
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  支持虚拟列表智能滚动勾选，精准提取物流单号，生成条形码打印（双列表管理：待揽收订单列表+打印物流单号列表，支持手动勾选非待揽收订单，按钮隐藏时自动重置列表）
// @match        *://*.kuajingmaihuo.com/*
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513376/TEMU%20%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/513376/TEMU%20%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%89%A9%E6%B5%81%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logisticsNumbers = new Set();
    const checkedPendingOrderIds = new Set(); // 待揽收订单列表（用于快速勾选按钮显示）
    const printOrderIds = new Set(); // 打印物流单号列表（用于打印按钮显示）
    let isDetectionActive = false;
    let hasDetectedData = false;
    let lastTargetBtnExists = false;
    let isProcessing = false; // 防止重复点击
    let isChecking = false; // 防止勾选按钮重复点击

    /* ========== 提取数字部分 ========== */
    function extractNumbers(text) {
        const numbers = text.replace(/[^0-9]/g, '');
        return numbers || text;
    }

    /* ========== 检查数据条数 ========== */
    function hasDataRecords() {
        const totalTextElement = document.querySelector('.PGT_totalText_5-117-0');
        if (totalTextElement) {
            const match = totalTextElement.textContent.trim().match(/共有\s*(\d+)\s*条/);
            if (match) return parseInt(match[1], 10) > 0;
        }
        return document.querySelectorAll('tr.TB_tr_5-117-0').length > 0;
    }

    /* ========== 检查当前可见区域的订单状态 ========== */
    function checkVisibleOrders() {
        const rows = document.querySelectorAll('tr.TB_tr_5-117-0');

        let pendingCount = 0;
        let otherStatusCount = 0;

        rows.forEach(row => {
            const statusElements = row.querySelectorAll('span, div');
            const statusTexts = Array.from(statusElements).map(el => el.textContent.trim());

            if (statusTexts.includes('待快递揽收')) {
                pendingCount++;
            } else {
                // 只要不是"待快递揽收"，就算其他状态
                // 由于我们查询的是 tr.TB_tr_5-117-0（订单行），所以这里统计的都是有效订单
                otherStatusCount++;
            }
        });

        return {
            pendingCount,
            otherStatusCount,
            hasOtherStatus: otherStatusCount > 0
        };
    }

    /* ========== 获取订单的唯一标识 ========== */
    function getOrderId(row) {
        // 尝试从物流单号获取唯一标识
        const divs = row.querySelectorAll('div');
        let labelDiv = Array.from(divs).find(d => d.textContent.trim() === '物流单号：');
        if (labelDiv && labelDiv.nextElementSibling) {
            const span = labelDiv.nextElementSibling.querySelector('span');
            if (span) return span.textContent.trim();
        }
        return null;
    }

    /* ========== 检查订单是否为待揽收状态 ========== */
    function isPendingPickup(row) {
        const statusElements = row.querySelectorAll('span, div');
        const statusTexts = Array.from(statusElements).map(el => el.textContent.trim());
        return statusTexts.includes('待快递揽收');
    }

    /* ========== 获取当前已勾选的待揽收订单数量（使用全局状态） ========== */
    function getCheckedPendingCount() {
        return checkedOrderIds.size;
    }

    /* ========== 更新按钮文本显示数量 ========== */
    function updateButtonTexts() {
        const checkBtn = document.querySelector('#tm-check-pending-btn');
        const printBtn = document.querySelector('#tm-print-logistics-btn');

        // 快速勾选按钮显示：待揽收订单数量
        const pendingCount = checkedPendingOrderIds.size;
        if (checkBtn) {
            const baseText = '快速勾选待揽收订单';
            checkBtn.textContent = pendingCount > 0 ? `${baseText} (${pendingCount})` : baseText;
        }

        // 打印按钮显示：需要生成条码的数量（打印列表）
        const printCount = printOrderIds.size;
        if (printBtn) {
            const baseText = '批量打印物流单号';
            printBtn.textContent = printCount > 0 ? `${baseText} (${printCount})` : baseText;
        }
    }

    /* ========== 取消所有已勾选的复选框 ========== */
    function uncheckAllCheckboxes() {
        const checkedBoxes = document.querySelectorAll('tr.TB_tr_5-117-0 input[type="checkbox"]:checked');
        let uncheckedCount = 0;

        checkedBoxes.forEach(checkbox => {
            const row = checkbox.closest('tr.TB_tr_5-117-0');
            if (row) {
                const customCheckbox = row.querySelector('.CBX_square_5-117-0');
                if (customCheckbox) {
                    customCheckbox.click();
                    uncheckedCount++;
                }
            }
        });

        // 清空两个列表
        checkedPendingOrderIds.clear();
        printOrderIds.clear();
        console.log(`取消勾选了 ${uncheckedCount} 个复选框，已清空两个列表`);
        return uncheckedCount;
    }

    /* ========== 自动勾选逻辑并返回找到的数量（跳过已勾选，更新两个列表） ========== */
    function autoCheckPendingPickup() {
        const allElements = document.querySelectorAll('span, div');
        const pendingSpans = Array.from(allElements).filter(el => el.textContent.trim() === '待快递揽收');

        let foundCount = 0;
        pendingSpans.forEach(el => {
            const row = el.closest('tr.TB_tr_5-117-0');
            if (row) {
                const nativeCheckbox = row.querySelector('input[type="checkbox"]');
                const customCheckbox = row.querySelector('.CBX_square_5-117-0');

                // 获取订单ID
                const orderId = getOrderId(row);

                // 关键修改：只勾选未勾选的订单
                if (nativeCheckbox && !nativeCheckbox.checked && customCheckbox && orderId) {
                    customCheckbox.click();
                    // 待揽收订单同时添加到两个列表
                    checkedPendingOrderIds.add(orderId);
                    printOrderIds.add(orderId);
                    foundCount++;
                }
            }
        });

        return foundCount;
    }

    /* ========== 同步单号状态（从打印列表获取） ========== */
    function syncAllCheckboxStates() {
        // 直接使用打印列表，不依赖 DOM
        logisticsNumbers.clear();
        printOrderIds.forEach(orderId => {
            logisticsNumbers.add(orderId);
        });
        console.log(`从打印列表同步了 ${logisticsNumbers.size} 个物流单号`);
    }

    /* ========== 生成和打印条形码 ========== */
    function generateAndPrintBarcodes(numbers) {
        if (!numbers.length) {
            alert('未找到已勾选的订单，请先使用"快速勾选待揽收订单"按钮或手动勾选订单。');
            return;
        }

        const barcodeElements = numbers.map(n => {
            const numPart = extractNumbers(n);
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            try {
                JsBarcode(svg, numPart, {
                    format: "CODE128",
                    width: 2.7,
                    height: 60,
                    displayValue: false,
                    margin: 0,
                    marginTop: 2,
                    marginBottom: 0
                });
                return `<div class="label"><div class="barcode-wrapper"><div class="barcode-container">${svg.outerHTML}</div><div class="tracking-number">${n}</div></div></div>`;
            } catch (e) {
                console.error('生成条形码失败:', e);
                return `<div class="label"><div style="text-align:center;padding:10px;">${n}</div></div>`;
            }
        }).join('');

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                @page { size: 70mm 20mm; margin: 0; }
                body { margin: 0; padding: 0; }
                .label {
                    width: 70mm;
                    height: 20mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    page-break-after: always;
                    overflow: hidden;
                }
                .barcode-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                    width: 100%;
                    height: 100%;
                    padding: 1mm;
                }
                .barcode-container {
                    width: 66mm;
                    height: 10mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .tracking-number {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    height: 10mm;
                    line-height: 10mm;
                    width: 66mm;
                }
                .label svg {
                    max-width: 100%;
                    height: auto;
                    max-height: 9mm;
                }
            </style>
        </head>
        <body>${barcodeElements}</body>
        </html>`;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;';
        document.body.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        // 使用requestAnimationFrame确保DOM渲染完成
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();

                // 短暂延迟后移除iframe
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 1000);
            });
        });
    }

    /* ========== 智能DOM更新等待 ========== */
    function waitForDOMStable(timeout = 300) {
        return new Promise((resolve) => {
            let timer = null;
            const observer = new MutationObserver(() => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 50); // 50ms内无变化认为DOM稳定
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });

            // 超时保护
            setTimeout(() => {
                observer.disconnect();
                resolve();
            }, timeout);
        });
    }

    /* ========== 从顶部开始扫描并勾选（跳过已勾选） ========== */
    async function smartScrollFromTop(maxScrollAttempts = 30) {
        console.log('开始从顶部智能扫描...');

        // 1. 先滚动到页面顶部
        window.scrollTo(0, 0);
        await waitForDOMStable(200);

        let scrollAttempts = 0;
        let totalFoundCount = 0;

        // 2. 处理顶部可见区域（跳过已勾选）
        let foundCount = autoCheckPendingPickup();
        totalFoundCount += foundCount;
        console.log(`顶部区域: 找到 ${foundCount} 个未勾选的"待快递揽收"订单`);

        // 3. 向下滚动，直到遇到非"待快递揽收"订单
        while (scrollAttempts < maxScrollAttempts) {
            // 检查当前区域订单状态
            const status = checkVisibleOrders();

            // 如果发现其他状态的订单，说明"待快递揽收"区域已经结束
            if (status.hasOtherStatus && scrollAttempts > 0) {
                console.log(`发现非"待快递揽收"订单，停止滚动`);
                break;
            }

            // 滚动一小段距离
            window.scrollBy(0, 600);
            scrollAttempts++;

            // 等待DOM稳定
            await waitForDOMStable(120);

            // 尝试勾选当前可见区域的"待快递揽收"（跳过已勾选）
            foundCount = autoCheckPendingPickup();
            totalFoundCount += foundCount;

            if (foundCount > 0) {
                console.log(`第${scrollAttempts}次滚动: 找到 ${foundCount} 个未勾选的"待快递揽收"订单`);
            } else {
                console.log(`第${scrollAttempts}次滚动: 未找到新的未勾选"待快递揽收"订单`);
                // 未找到新订单，再检查一次是否有其他状态订单
                const recheckStatus = checkVisibleOrders();
                if (recheckStatus.hasOtherStatus || recheckStatus.pendingCount === 0) {
                    console.log('确认已超出"待快递揽收"区域，停止滚动');
                    break;
                }
            }

            // 检查是否已到底部
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100) {
                console.log('已滚动到页面底部');
                break;
            }
        }

        console.log(`扫描完成，共滚动 ${scrollAttempts} 次，本次新勾选 ${totalFoundCount} 个"待快递揽收"订单`);
        return totalFoundCount;
    }

    /* ========== 创建按钮组及核心逻辑 ========== */
    function insertButtons() {
        const targetBtn = document.querySelector('button[data-tracking-id="l3iN2mOKj28lEbBM"]');
        const targetBtnExists = !!targetBtn;
        let checkBtn = document.querySelector('#tm-check-pending-btn');
        let printBtn = document.querySelector('#tm-print-logistics-btn');

        if (targetBtnExists !== lastTargetBtnExists) {
            if (targetBtnExists) {
                isDetectionActive = true;
                hasDetectedData = false;
            } else {
                isDetectionActive = false;
                if (checkBtn) checkBtn.remove();
                if (printBtn) printBtn.remove();
                // 按钮隐藏时重置两个列表
                checkedPendingOrderIds.clear();
                printOrderIds.clear();
                logisticsNumbers.clear();
                console.log('按钮已隐藏，已重置所有列表');
            }
            lastTargetBtnExists = targetBtnExists;
        }

        if (!targetBtnExists || !isDetectionActive || hasDetectedData) return;

        if (hasDataRecords()) {
            hasDetectedData = true;
            isDetectionActive = false;

            // 创建按钮容器
            let btnContainer = document.querySelector('#tm-btn-container');
            if (!btnContainer) {
                btnContainer = document.createElement('div');
                btnContainer.id = 'tm-btn-container';
                btnContainer.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 30%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 9999;
                `;
                document.body.appendChild(btnContainer);
            }

            // 按钮通用样式
            const buttonStyle = `
                min-width: 160px;
                height: 30px;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: all 0.2s;
                white-space: nowrap;
                padding: 0 15px;
            `;

            // 创建【快速勾选待揽收订单】按钮
            if (!checkBtn) {
                checkBtn = document.createElement('button');
                checkBtn.id = 'tm-check-pending-btn';
                checkBtn.textContent = '快速勾选待揽收订单';
                checkBtn.style.cssText = buttonStyle + 'background-color: #407cff;';

                checkBtn.addEventListener('mouseenter', () => {
                    checkBtn.style.backgroundColor = '#2b5cd9';
                    checkBtn.style.transform = 'translateY(-1px)';
                });

                checkBtn.addEventListener('mouseleave', () => {
                    checkBtn.style.backgroundColor = '#407cff';
                    checkBtn.style.transform = 'translateY(0)';
                });

                // 勾选按钮点击事件
                checkBtn.addEventListener('click', async () => {
                    if (isChecking) {
                        console.log('正在勾选中，请稍候...');
                        return;
                    }

                    isChecking = true;
                    const originalText = checkBtn.textContent;

                    try {
                        console.log('=== 开始快速勾选流程（跳过已勾选） ===');

                        // 获取勾选前的数量
                        const beforeCount = checkedPendingOrderIds.size;
                        console.log(`勾选前已有 ${beforeCount} 个订单被勾选`);

                        // 滚动到顶部
                        window.scrollTo(0, 0);
                        await waitForDOMStable(200);

                        // 使用从顶部开始的智能滚动逻辑（自动跳过已勾选）
                        const newFoundCount = await smartScrollFromTop();

                        // 回到顶部
                        window.scrollTo(0, 0);
                        await waitForDOMStable(100);

                        // 更新按钮显示
                        updateButtonTexts();

                        // 获取勾选后的数量
                        const afterCount = checkedPendingOrderIds.size;

                        if (newFoundCount === 0) {
                            if (afterCount > 0) {
                                checkBtn.textContent = `已全部勾选 (${afterCount})`;
                            } else {
                                alert('未找到"待快递揽收"的订单，请确认页面是否有符合条件的单号。');
                                checkBtn.textContent = originalText;
                            }
                        } else {
                            checkBtn.textContent = `新增${newFoundCount}个订单 (共${afterCount}个)`;
                            console.log(`=== 勾选完成，新增 ${newFoundCount} 个订单，共 ${afterCount} 个订单 ===`);
                        }

                        // 2秒后恢复按钮文本
                        setTimeout(() => {
                            updateButtonTexts();
                        }, 2000);

                    } catch (error) {
                        console.error('勾选过程中出错:', error);
                        alert('勾选过程中发生错误，请刷新页面重试。');
                        checkBtn.textContent = originalText;
                    } finally {
                        isChecking = false;
                    }
                });

                btnContainer.appendChild(checkBtn);
            }

            // 创建【批量打印物流单号】按钮
            if (!printBtn) {
                printBtn = document.createElement('button');
                printBtn.id = 'tm-print-logistics-btn';
                printBtn.textContent = '批量打印物流单号';
                printBtn.style.cssText = buttonStyle + 'background-color: #407cff;';

                printBtn.addEventListener('mouseenter', () => {
                    printBtn.style.backgroundColor = '#2b5cd9';
                    printBtn.style.transform = 'translateY(-1px)';
                });

                printBtn.addEventListener('mouseleave', () => {
                    printBtn.style.backgroundColor = '#407cff';
                    printBtn.style.transform = 'translateY(0)';
                });

                // 打印按钮点击事件
                printBtn.addEventListener('click', async () => {
                    if (isProcessing) {
                        console.log('正在处理中，请稍候...');
                        return;
                    }

                    isProcessing = true;
                    const originalText = printBtn.textContent;

                    try {
                        console.log('=== 开始批量打印流程 ===');

                        // 同步所有已勾选的单号
                        syncAllCheckboxStates();

                        // 立即处理打印
                        const numbers = Array.from(logisticsNumbers).filter(n => n);
                        if (numbers.length === 0) {
                            alert('未找到已勾选的订单，请先使用"快速勾选待揽收订单"按钮或手动勾选订单。');
                            return;
                        }

                        console.log(`=== 找到 ${numbers.length} 个物流单号，开始生成条形码 ===`);
                        generateAndPrintBarcodes(numbers);

                        // 更新按钮文本显示生成数量
                        printBtn.textContent = `已生成${numbers.length}个快递条码`;

                        // 3秒后恢复按钮文本
                        setTimeout(() => {
                            updateButtonTexts();
                        }, 3000);

                    } catch (error) {
                        console.error('打印过程中出错:', error);
                        alert('打印过程中发生错误，请刷新页面重试。');
                        printBtn.textContent = originalText;
                    } finally {
                        isProcessing = false;
                    }
                });

                btnContainer.appendChild(printBtn);
            }

            // 初始更新按钮文本
            updateButtonTexts();
        }
    }

    // 监听页面变化
    const observer = new MutationObserver(() => {
        insertButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 监听用户手动勾选/取消勾选，同步更新两个列表
    document.addEventListener('click', (e) => {
        // 检查是否点击了复选框
        const customCheckbox = e.target.closest('.CBX_square_5-117-0');
        if (customCheckbox) {
            // 延迟执行以确保 DOM 更新完成
            setTimeout(() => {
                const row = customCheckbox.closest('tr.TB_tr_5-117-0');
                if (row) {
                    const nativeCheckbox = row.querySelector('input[type="checkbox"]');
                    const orderId = getOrderId(row);
                    const isPending = isPendingPickup(row);

                    if (orderId) {
                        if (nativeCheckbox && nativeCheckbox.checked) {
                            // 勾选操作
                            if (isPending) {
                                // 待揽收订单：添加到两个列表
                                checkedPendingOrderIds.add(orderId);
                                printOrderIds.add(orderId);
                                console.log(`手动勾选【待揽收】订单: ${orderId}, 待揽收数量: ${checkedPendingOrderIds.size}, 打印数量: ${printOrderIds.size}`);
                            } else {
                                // 非待揽收订单：只添加到打印列表
                                printOrderIds.add(orderId);
                                console.log(`手动勾选【非待揽收】订单: ${orderId}, 打印数量: ${printOrderIds.size}`);
                            }
                        } else {
                            // 取消勾选操作
                            if (isPending) {
                                checkedPendingOrderIds.delete(orderId);
                            }
                            printOrderIds.delete(orderId);
                            console.log(`取消勾选订单: ${orderId}, 待揽收数量: ${checkedPendingOrderIds.size}, 打印数量: ${printOrderIds.size}`);
                        }
                        updateButtonTexts();
                    }
                }
            }, 50);
        }
    }, true);

    // 单独监听复选框变化以更新按钮文本
    setInterval(() => {
        const checkBtn = document.querySelector('#tm-check-pending-btn');
        const printBtn = document.querySelector('#tm-print-logistics-btn');
        if (checkBtn || printBtn) {
            updateButtonTexts();
        }
    }, 500); // 每500毫秒更新一次按钮文本

    // 初始执行
    insertButtons();

    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl + P 快捷键 - 打印
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            const printBtn = document.querySelector('#tm-print-logistics-btn');
            if (printBtn) {
                printBtn.click();
            }
        }
        // Ctrl + Shift + C 快捷键 - 勾选
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            const checkBtn = document.querySelector('#tm-check-pending-btn');
            if (checkBtn) {
                checkBtn.click();
            }
        }
    });

    console.log('TEMU批量打印物流单号脚本已加载 (双列表版v4.2)');
    console.log('快捷键: Ctrl+Shift+C = 快速勾选 | Ctrl+P = 批量打印');
    console.log('核心功能: 双列表独立管理 - 待揽收订单列表 + 打印物流单号列表');
    console.log('特性: ✅待揽收自动勾选 ✅非待揽收手动勾选打印 ✅独立数量显示 ✅按钮隐藏时自动重置');
    console.log('按钮显示: 【快速勾选】显示待揽收数量 | 【批量打印】显示打印列表数量');
})();