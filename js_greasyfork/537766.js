// ==UserScript==
// @name        2025知网批量下载 (带计数器版)
// @namespace   CNKI PreciseDOM
// @match       *://119.45.237.51/*
// @match       *://119.45.145.238/*
// @match       *://kns.cnki.net/*
// @match        */kns8s/*
// @grant       none
// @version     2.5
// @author      原作者Cowvirgina, Optimized by AI
// @description 优化了跨页加载时按钮消失的问题，修复了卡死和jQuery依赖问题，精确匹配截图所示DOM结构。批量下载检索目录文献。
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537766/2025%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%28%E5%B8%A6%E8%AE%A1%E6%95%B0%E5%99%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537766/2025%E7%9F%A5%E7%BD%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%28%E5%B8%A6%E8%AE%A1%E6%95%B0%E5%99%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions ---

    // Function to inject CSS
    function addCss(cssString) {
        const style = document.createElement('style');
        style.textContent = cssString;
        document.head.appendChild(style);
    }

    // Function to create a temporary message box
    function createTempMessage(text, duration) {
        // Remove any existing temporary messages to avoid clutter
        document.querySelectorAll('.temp-message-box').forEach(box => box.remove());

        const messageBox = document.createElement('div');
        messageBox.className = 'temp-message-box'; // Add a class for easy selection/removal
        messageBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-size: 16px;
            text-align: center;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
            max-width: 80%; /* Prevent box from being too wide */
        `;
        messageBox.textContent = text;
        document.body.appendChild(messageBox);

        // Fade out and remove after duration
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(messageBox)) {
                    document.body.removeChild(messageBox);
                }
            }, 500); // Match transition duration
        }, duration);
    }

    // Function for non-blocking delay
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // --- Inject initial CSS ---
    addCss(`
        #hello-box {
            display: none; /* Hide initially */
            opacity: 0; /* Start transparent for fade-in */
            transition: opacity 0.3s ease-in-out; /* Add transition for fade */
            position: absolute;
            top: 30px; /* Adjusted position relative to batchOpsBox */
            right: 0; /* Adjusted position relative to batchOpsBox */
            height: auto; /* Adjust height based on content */
            width: 280px; /* Slightly wider */
            padding: 10px; /* Increased padding */
            line-height: 1.5; /* Better line height */
            white-space: normal; /* Allow text wrapping */
            border: 1px solid rgb(214, 214, 214);
            background-color: rgba(255, 0, 0, 0.9); /* More opaque red */
            color: white; /* Text color */
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3); /* Add subtle shadow */
            z-index: 1000; /* Ensure it's above other content */
            pointer-events: none; /* Allow clicks to pass through */
        }
         #hello-box p {
             margin: 0; /* Remove default paragraph margin */
             text-align: center;
             font-size: 14px; /* Slightly smaller font */
             overflow-wrap: break-word;
         }
         #new_downbutton {
            float: left;
            height: 22px;
            padding: 2px 10px;
            line-height: 22px;
            white-space: nowrap;
            border: 1px solid #d6d6d6;
            background-color: #ff0000; /* Solid red */
            color: white; /* White text */
            cursor: pointer;
            margin-left: 10px; /* Add some space from other buttons */
         }
         #new_downbutton:hover {
             background-color: #cc0000; /* Darker red on hover */
         }
         .download-counter {
            position: fixed; /* 固定位置 */
            bottom: 20px; /* 距离页面底部20px */
            right: 20px; /* 距离页面右侧20px */
            background-color: rgba(0, 0, 0, 0.7); /* 半透明黑色背景 */
            color: white; /* 白色文字 */
            padding: 10px 15px; /* 内边距 */
            border-radius: 5px; /* 圆角 */
            z-index: 9999; /* 确保在其他元素之上 */
            font-size: 14px; /* 字体大小 */
            box-shadow: 1px 1px 3px rgba(0,0,0,0.3); /* 阴影效果 */
            pointer-events: none; /* 允许鼠标事件穿透，不影响点击下方的页面元素 */
            min-width: 120px; /* 最小宽度，避免内容变化时抖动 */
            text-align: center; /* 文本居中 */
        }
    `);


    // --- Main Logic - Use interval to check for elements ---
    // Keep interval running to detect page content updates
    let intervalID = setInterval(() => {
        const batchOpsBox = document.querySelector("#batchOpsBox");
        // Use a more specific selector to find the tbody within #gridTable based on the screenshot
        const tableBody = document.querySelector("#gridTable table.result-table-list tbody");
        const existingButton = document.getElementById('new_downbutton'); // Use getElementById for slight performance gain

        // Condition: batchOpsBox and tableBody must exist, AND our button must NOT exist.
        // This handles initial page load and subsequent dynamic page updates.
        if (batchOpsBox && tableBody && !existingButton) {
            console.log("知网批量下载脚本: Found necessary elements and button is missing. Adding button.");

            // --- Add button and explanation ---
            const button = document.createElement('a');
            button.id = 'new_downbutton';
            button.textContent = '批量下载PDF'; // Changed text to be clearer

            const hello_box = document.createElement('div');
            hello_box.id = "hello-box"; // Make sure ID is set for CSS and JS
            const hello_p = document.createElement('p');
            hello_p.innerHTML = "<b>批量下载说明：</b><br>" +
                                "1. 脚本仅处理**当前页面**显示的文献。<br>" + // Emphasize current page
                                "2. 点击按钮后，脚本会模拟点击每篇文献的下载链接。<br>" +
                                "3. **浏览器可能会阻止弹出窗口，请允许知网页面弹出新窗口！**<br>" + // More emphasis
                                "4. 每次下载之间会有短暂延迟（约15秒），请耐心等待。<br>" +
                                "5. 脚本完成后会提示，但实际下载进度请查看浏览器下载管理器。<br>" +
                                "6. 翻页后按钮会自动重新出现。"; // Added note about pagination

            // Append explanation box and text
            // We need to make batchOpsBox position relative for absolute positioning of hello_box
            // Check if it already has a position style before overriding
            if (!batchOpsBox.style.position || batchOpsBox.style.position === 'static') {
                 batchOpsBox.style.position = 'relative';
            }
            // Check if hello_box might be lingering from a previous dynamic update that wasn't a full replace
             const oldHelloBox = document.getElementById('hello-box');
             if(oldHelloBox && oldHelloBox.parentElement === batchOpsBox) {
                 batchOpsBox.removeChild(oldHelloBox); // Remove old one if it exists and is in the right place
             }
            batchOpsBox.appendChild(hello_box);
            hello_box.appendChild(hello_p);


            // --- Replace jQuery with native JS for mouse events ---
            // Add mouseover/mouseout listeners to show/hide the explanation box
            button.addEventListener('mouseover', () => {
                const targetBox = document.getElementById("hello-box");
                 if (targetBox) {
                     targetBox.style.display = 'block'; // First make it visible
                     // Use a small delay before setting opacity to allow display change to register
                     setTimeout(() => {
                         targetBox.style.opacity = '1'; // Then fade in
                     }, 10); // A small delay like 10ms is often enough
                 }
            });

            button.addEventListener('mouseout', () => {
                 const targetBox = document.getElementById("hello-box");
                 if (targetBox) {
                     targetBox.style.opacity = '0'; // Start fade-out
                     // Hide completely after transition
                     setTimeout(() => {
                          // Only hide if opacity is still 0 (means fade-out completed or wasn't interrupted)
                          if (window.getComputedStyle(targetBox).opacity === '0') {
                              targetBox.style.display = 'none';
                          }
                     }, 300); // Match CSS transition duration
                 }
            });
            // --- End of jQuery replacement ---

            // Append the button to the batch operations box
            batchOpsBox.appendChild(button);

            // --- Download Logic ---
            button.addEventListener('click', async () => { // Made the click handler async
                // Find operat cells within the *current* tableBody
                const operatCells = tableBody.querySelectorAll('tr > td.operat');
                 if (operatCells.length === 0) {
                    createTempMessage("当前页面未找到任何文献条目。", 3000);
                    return;
                }

                // Collect all valid download links first
                const downloadLinks = [];
                operatCells.forEach(cell => {
                    // Use the precise selector based on the screenshot relative to the cell
                    const downloadLink = cell.querySelector("a.downloadlink.icon-download");
                     // Add a fallback selector if the precise one fails
                    const fallbackLink = cell.querySelector("a.downloadlink");

                    let linkToUse = downloadLink || fallbackLink; // Prefer the precise selector

                     // Check if link element exists AND has a valid href (not empty or just void)
                    if (linkToUse && linkToUse.href && linkToUse.href !== '' && linkToUse.href !== 'javascript:void(0);') {
                        downloadLinks.push(linkToUse.href);
                    } else {
                         // Log if a potential download cell doesn't have a valid link
                         console.warn("知网批量下载脚本: Found operat cell without a valid download link:", cell);
                    }
                });

                if (downloadLinks.length === 0) {
                    createTempMessage(`在当前页面 ${operatCells.length} 个条目中未找到有效的下载链接。`, 4000);
                    return;
                }

                createTempMessage(`准备开始下载，预计下载文章共 ${downloadLinks.length} 篇。请检查并允许浏览器弹出窗口！`, 6000);

                // --- 添加计数窗口 ---
                // 移除可能残留的上一次的计数窗口
                document.querySelectorAll('.download-counter').forEach(box => box.remove());

                const downloadCounterBox = document.createElement('div');
                downloadCounterBox.className = 'download-counter';
                downloadCounterBox.textContent = `下载进度: 0 / ${downloadLinks.length}`; // 初始化文本
                document.body.appendChild(downloadCounterBox);
                // --- 计数窗口添加完毕 ---


                // Loop through collected links and trigger download with delay
                let downloadedCount = 0; // 计数器变量
                for (const linkHref of downloadLinks) {
                    downloadedCount++; // 每尝试下载一次，计数器加1

                    // --- 更新计数窗口文本 ---
                    downloadCounterBox.textContent = `下载进度: ${downloadedCount} / ${downloadLinks.length}`;
                    // --- 计数窗口文本更新完毕 ---

                    console.log(`尝试下载 (${downloadedCount}/${downloadLinks.length}): ${linkHref}`);
                    // createTempMessage(`正在尝试下载 (${downloadedCount}/${downloadLinks.length})...`, 1500); // 如果觉得临时提示和计数窗口重复，可以注释或移除这行

                    window.open(linkHref, '_blank');

                    if (downloadedCount < downloadLinks.length) {
                         await delay(8000); // 8 seconds delay between opens
                    }
                }

                // --- 下载循环结束，处理计数窗口 ---
                // 最后更新一次文本，显示完成状态
                downloadCounterBox.textContent = `下载完成: ${downloadLinks.length} / ${downloadLinks.length}`;
                // 或者显示一个完成消息
                // downloadCounterBox.textContent = `批量下载完成！`;


                createTempMessage(`脚本执行完成！已尝试触发 ${downloadLinks.length} 篇文献下载。请检查浏览器下载管理器。`, 7000);
                 console.log("知网批量下载脚本: Batch download process finished.");

                // --- 移除计数窗口 ---
                // 在最终提示显示一段时间后移除计数窗口
                 setTimeout(() => {
                     if (document.body.contains(downloadCounterBox)) {
                         document.body.removeChild(downloadCounterBox);
                     }
                 }, 3000); // 例如等待3秒后移除
                // --- 计数窗口移除完毕 ---

            }); // End of button click event listener

        }
        // If condition is not met, the interval simply finishes this cycle and waits for the next tick.
        // It will keep checking until the page is closed or navigated away from.

    }, 1000); // Check every 1 second

    // Optional: Clear interval when the window/page is unloaded (less critical now that it doesn't block)
    // window.addEventListener('beforeunload', () => {
    //     clearInterval(intervalID);
    // });

})();