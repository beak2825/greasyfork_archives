// ==UserScript==
// @name         中财学位论文系统一键预加载 | 下载PDF格式
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  一键预加载⚡ | 下载PDF格式📄 | 下载高清版本🖨
// @author       kano jim
// @match        http://10.13.65.3/pdfindex1.jsp?fid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=65.3
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539127/%E4%B8%AD%E8%B4%A2%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E9%A2%84%E5%8A%A0%E8%BD%BD%20%7C%20%E4%B8%8B%E8%BD%BDPDF%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539127/%E4%B8%AD%E8%B4%A2%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E9%A2%84%E5%8A%A0%E8%BD%BD%20%7C%20%E4%B8%8B%E8%BD%BDPDF%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // 配置部分：请根据你的需求修改以下变量
    // =========================================================

    // 每次调用omg函数之间的延迟（毫秒）。
    const CALL_DELAY_MS = 20; // 20 milliseconds

    // jspdf库的CDN地址
    const JSPDF_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

    // 检查图片URL时，如果发现缺失，在触发预加载后再次检查的延迟（毫秒）。
    const RECHECK_DELAY_MS = 2000; // 2 seconds

    // 检查链接时，如果反复缺失，最大重试次数，防止无限循环
    const MAX_LINK_CHECK_ATTEMPTS = 50;

    // =========================================================
    // 脚本核心逻辑 (注入到页面)
    // =========================================================

    // 创建一个script元素，用于将代码注入到网页的全局上下文中
    const script = document.createElement('script');

    // 设置script的内容。这段代码将在网页的全局上下文中执行，
    // 因此可以直接访问 'omg' 函数并操作DOM。
    script.textContent = `
        (async function() { // Use async IIFE to allow top-level await

            // 从外部作用域获取配置变量
            const callDelay = ${CALL_DELAY_MS};
            const jspdfCdnUrl = '${JSPDF_CDN_URL}';
            const recheckDelay = ${RECHECK_DELAY_MS};
            const maxLinkCheckAttempts = ${MAX_LINK_CHECK_ATTEMPTS};

            let maxPageIndex = 40; // 默认值, 以防无法从 'sum' 元素获取

            /**
             * 获取并设置最大页码 (maxPageIndex)
             */
            function getAndSetMaxPageIndex() {
                const sumElement = document.getElementById('sum');
                if (sumElement && sumElement.value) {
                    const parsedSum = parseInt(sumElement.value, 10);
                    if (!isNaN(parsedSum) && parsedSum > 0) {
                        maxPageIndex = parsedSum - 1;
                        console.log('油猴脚本（注入）：已从页面获取最大页数并减1：', maxPageIndex);
                    } else {
                        console.warn('油猴脚本（注入）：未能从"sum"元素获取到有效的页数，将使用默认值', maxPageIndex);
                    }
                } else {
                    console.warn('油猴脚本（注入）：未找到id为"sum"的元素或其值为空，将使用默认值', maxPageIndex);
                }
            }

            /**
             * 检查所有 .fwr_page_box 元素是否包含有效的图片URL。
             * @returns {boolean} 如果所有图片URL都存在则返回 true, 否则返回 false.
             */
            function checkAllLinksPresent() {
                const fwrPageBoxes = document.querySelectorAll('.fwr_page_box');
                if (fwrPageBoxes.length === 0) {
                    console.warn('油猴脚本（注入）：未找到任何 .fwr_page_box 元素。');
                    return false;
                }
                for (const box of fwrPageBoxes) {
                    const img = box.querySelector('img.fwr_page_bg_image');
                    // 检查img元素是否存在，src是否有效，以及图片是否已加载完成 (img.complete)
                    if (!img || !img.src || img.src.includes('about:blank') || !img.complete) {
                        return false; // 发现一个没有图片URL、URL为空或图片未加载的box
                    }
                }
                console.log('油猴脚本（注入）：所有 .fwr_page_box 都包含有效且已加载的图片。');
                return true;
            }

            /**
             * 为 omg 函数执行循环预加载过程。
             * @param {HTMLElement} [btn] - 可选参数，一个按钮元素，用于更新其状态和文本。
             * @param {boolean} [isFinalState=true] - 如果为 true, 完成后按钮将被永久禁用并变灰。
             */
            const preloadOmgPages = async (btn, isFinalState = true) => {
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = '预加载中...';
                }

                getAndSetMaxPageIndex();

                if (typeof omg === 'function') {
                    console.log('油猴脚本（注入）：开始循环调用omg函数，实际最大页数：', maxPageIndex);

                    if (maxPageIndex < 1) {
                         if (btn) btn.textContent = '预加载完成 (无循环)';
                         if (btn && isFinalState) {
                             btn.disabled = true;
                             btn.style.backgroundColor = '#d3d3d3';
                             btn.style.cursor = 'not-allowed';
                         }
                         return;
                    }

                    for (let i = 1; i <= maxPageIndex; i++) {
                        if (btn) btn.textContent = \`预加载中... (\${i}/\${maxPageIndex})\`;
                        console.log(\`油猴脚本（注入）：正在调用 omg(\${i})\`);
                        try {
                            omg(i);
                            await new Promise(resolve => setTimeout(resolve, callDelay));
                        } catch (e) {
                            console.error(\`油猴脚本（注入）：调用 omg(\${i}) 时发生错误:\`, e);
                        }
                    }
                    console.log('油猴脚本（注入）：omg函数循环调用完成。');
                } else {
                    console.error('油猴脚本（注入）：未找到网页中的omg函数。请确保它已加载。');
                    alert('未找到omg函数，无法预加载。');
                }

                if (btn && isFinalState) {
                    btn.textContent = '预加载完成';
                    btn.disabled = true;
                    btn.style.backgroundColor = '#d3d3d3';
                    btn.style.cursor = 'not-allowed';
                }
            };

            /**
             * [MODIFIED] 检查链接并在需要时进行预加载，增加了智能轮询机制。
             * @param {HTMLElement} btn - 触发操作的按钮。
             * @returns {Promise<boolean>} - 如果所有链接都准备就绪则为 True, 否则为 false。
             */
            const checkLinksAndPreloadIfNeeded = async (btn) => {
                btn.disabled = true;
                btn.textContent = '检查链接中...';
                let allLinksPresent = false;
                let attempts = 0;

                while (!allLinksPresent && attempts < maxLinkCheckAttempts) {
                    allLinksPresent = checkAllLinksPresent();

                    if (allLinksPresent) {
                        break; // 链接已就绪，退出循环
                    }

                    // 如果链接不完整
                    console.log(\`油猴脚本（注入）：链接或图片加载不完整。尝试次数: \${attempts + 1}\`);

                    // 【新逻辑】如果不是第一次尝试，则先进行轮询检测
                    if (attempts > 0) {
                        console.log('油猴脚本（注入）：非首次尝试，进入15秒轮询检测...');
                        let pollingSuccessful = false;
                        for (let i = 0; i < 15; i++) {
                            btn.textContent = \`检测链接中 (轮询 \${i + 1}/15)...\`;
                            await new Promise(resolve => setTimeout(resolve, 1000)); // 间隔1秒

                            if (checkAllLinksPresent()) {
                                console.log('油猴脚本（注入）：轮询检测成功！链接已就绪。');
                                allLinksPresent = true;
                                pollingSuccessful = true;
                                break; // 成功，退出轮询
                            }
                        }

                        // 如果轮询成功，外层 while 循环将在下一次检查时退出
                        if (pollingSuccessful) {
                            continue;
                        }
                    }

                    // 如果是首次尝试，或轮询失败，则执行完整的预加载
                    console.log('油猴脚本（注入）：首次尝试或轮询失败，开始执行预加载...');
                    await preloadOmgPages(btn, false); // 传入 false 防止过早改变最终状态
                    await new Promise(resolve => setTimeout(resolve, recheckDelay)); // 预加载后等待一段时间再检查

                    attempts++;
                }

                if (!allLinksPresent) {
                    console.error(\`油猴脚本（注入）：经过 \${maxLinkCheckAttempts} 次尝试后，链接依然不完整。\`);
                }

                return allLinksPresent;
            };

            /**
             * [REVISED] 从已加载的<img>元素中直接提取图像数据并生成PDF文件。
             * 此函数会动态加载 jspdf 库来确保其可用性。
             * @param {HTMLElement} btn - 要更新的按钮元素。
             * @param {boolean} disableOnComplete - 完成后是否永久禁用按钮。
             */
            const processAndGeneratePdf = async (btn, disableOnComplete) => {
                btn.disabled = true;
                btn.textContent = '正在生成PDF...';

                // 获取页面上所有已加载的图片元素
                const imageElements = Array.from(document.querySelectorAll('.fwr_page_box img.fwr_page_bg_image'))
                    .filter(img => img && img.src && !img.src.includes('about:blank') && img.complete);

                if (imageElements.length === 0) {
                    alert('未找到任何已加载的图片。请先使用“预加载所有页面”功能，或等待当前页面图片加载完成。');
                    if(btn) {
                        btn.disabled = false;
                        btn.textContent = disableOnComplete ? '下载PDF (默认清晰度)' : '自定义清晰度下载';
                        btn.style.backgroundColor = disableOnComplete ? '#28a745' : '#fd7e14';
                    }
                    return;
                }

                console.log(\`油猴脚本（注入）：成功获取到 \${imageElements.length} 个已加载的图片元素。\`);

                try {
                    // [FIX] 动态加载 jspdf 库
                    await new Promise((resolve, reject) => {
                        if (window.jspdf) return resolve();
                        console.log('油猴脚本（注入）：正在加载 jspdf 库...');
                        const jspdfScript = document.createElement('script');
                        jspdfScript.src = jspdfCdnUrl;
                        jspdfScript.onload = () => {
                            console.log('油猴脚本（注入）：jspdf 库已加载。');
                            resolve();
                        };
                        jspdfScript.onerror = () => {
                            console.error('油猴脚本（注入）：jspdf 库加载失败！');
                            reject(new Error('jspdf library failed to load.'));
                        };
                        document.head.appendChild(jspdfScript);
                    });


                    console.log('油猴脚本（注入）：开始从图片元素生成PDF...');
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({
                        orientation: 'p',
                        unit: 'pt',
                        format: 'a4'
                    });
                    const pageWidth = doc.internal.pageSize.getWidth();


                    for (let i = 0; i < imageElements.length; i++) {
                        btn.textContent = \`正在生成PDF... (\${i + 1}/\${imageElements.length})\`;
                        const imgElement = imageElements[i];

                        try {
                            // 使用 canvas 将加载的图像转换为 data URL
                            const canvas = document.createElement('canvas');
                            canvas.width = imgElement.naturalWidth;
                            canvas.height = imgElement.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(imgElement, 0, 0, imgElement.naturalWidth, imgElement.naturalHeight);
                            // 使用 JPEG 格式以获得更小的文件大小
                            const base64Image = canvas.toDataURL('image/jpeg', 0.95);

                            const ratio = pageWidth / imgElement.naturalWidth;
                            const pageHeight = imgElement.naturalHeight * ratio;

                            // 对于第一页之后的内容，添加新页面
                            if (i > 0) {
                                doc.addPage();
                            }

                            // 将图像添加到当前页面
                            doc.setPage(i + 1);
                            doc.addImage(base64Image, 'JPEG', 0, 0, pageWidth, pageHeight);

                        } catch (e) {
                            console.error(\`油猴脚本（注入）：处理第 \${i + 1} 张图片时发生错误:\`, e);
                        }
                    }

                    const infoNameElement = document.getElementById('infoname');
                    const filename = (infoNameElement && infoNameElement.value) ? infoNameElement.value.trim() : 'downloaded_document';
                    doc.save(\`\${filename}.pdf\`);
                    console.log('油猴脚本（注入）：PDF文件已成功生成并下载。');

                } catch (e) {
                    console.error('油猴脚本（注入）：生成PDF时发生严重错误:', e);
                    alert('生成PDF时发生严重错误，请查看控制台了解详情。');
                } finally {
                    if (btn) {
                        if (disableOnComplete) {
                            btn.textContent = 'PDF生成完成';
                            btn.disabled = true;
                            btn.style.backgroundColor = '#d3d3d3';
                            btn.style.cursor = 'not-allowed';
                        } else {
                            btn.textContent = '自定义清晰度下载';
                            btn.disabled = false;
                            btn.style.backgroundColor = '#fd7e14'; // 恢复原始颜色
                            btn.style.cursor = 'pointer';
                        }
                    }
                }
            };

            /**
             * Downloads images and generates a PDF file.
             * @param {HTMLElement} btn - The button element to update.
             * @param {number} scale - The image scale for quality.
             * @param {boolean} disableOnComplete - Whether to disable the button permanently after completion.
             */
            const processAndGenerateHDPdf = async (btn, scale, disableOnComplete) => {
                btn.disabled = true;
                btn.textContent = '正在生成PDF...';

                const imageUrls = Array.from(document.querySelectorAll('.fwr_page_box img.fwr_page_bg_image'))
                    .map(img => img.src)
                    .filter(src => src && !src.includes('about:blank'));

                console.log(\`油猴脚本（注入）：成功获取到 \${imageUrls.length} 个图片URL。\`);

                const modifiedImageUrls = imageUrls.map(url => url.replace(/scale=[^&]*f/g, \`scale=\${scale}f\`));

                try {
                    await new Promise((resolve, reject) => {
                        if (window.jspdf) return resolve();
                        const jspdfScript = document.createElement('script');
                        jspdfScript.src = jspdfCdnUrl;
                        jspdfScript.onload = resolve;
                        jspdfScript.onerror = reject;
                        document.head.appendChild(jspdfScript);
                    });

                    console.log('油猴脚本（注入）：jspdf 库已加载。开始下载图片并添加到PDF...');
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    const pageWidth = doc.internal.pageSize.getWidth();

                    for (let i = 0; i < modifiedImageUrls.length; i++) {
                        btn.textContent = \`正在生成PDF... (\${i + 1}/\${modifiedImageUrls.length})\`;
                        const imgUrl = modifiedImageUrls[i];
                        try {
                            const response = await fetch(imgUrl);
                            if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
                            const blob = await response.blob();

                            const base64Image = await new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });

                            const img = new Image();
                            await new Promise(resolve => { img.onload = resolve; img.src = base64Image; });

                            const ratio = pageWidth / img.width;
                            if (i > 0) doc.addPage();
                            doc.addImage(base64Image, 'PNG', 0, 0, pageWidth, img.height * ratio);
                        } catch (e) {
                            console.error(\`油猴脚本（注入）：下载或处理图片 \${imgUrl} 时发生错误:\`, e);
                        }
                    }

                    const infoNameElement = document.getElementById('infoname');
                    const filename = (infoNameElement && infoNameElement.value) ? infoNameElement.value.trim() : 'downloaded_document';
                    doc.save(\`\${filename}.pdf\`);
                    console.log('油猴脚本（注入）：PDF文件已成功生成并下载。');

                } catch (e) {
                    console.error('油猴脚本（注入）：生成PDF时发生严重错误:', e);
                    alert('生成PDF时发生严重错误，请查看控制台了解详情。');
                } finally {
                    if (btn) {
                        if (disableOnComplete) {
                            btn.textContent = 'PDF生成完成';
                            btn.disabled = true;
                            btn.style.backgroundColor = '#d3d3d3';
                            btn.style.cursor = 'not-allowed';
                        } else {
                            btn.textContent = '自定义清晰度下载';
                            btn.disabled = false;
                            btn.style.backgroundColor = '#fd7e14'; // Restore original color
                            btn.style.cursor = 'pointer';
                        }
                    }
                }
            };



            // --- DOM 操作: 添加按钮 ---
            const fixedButtonContainer = document.createElement('div');
            fixedButtonContainer.id = 'cufem-pdf-tools-container';
            fixedButtonContainer.style.cssText = \`
                position: fixed; bottom: 0; left: 0; width: 100%;
                background-color: transparent; padding: 10px 0;
                text-align: center; z-index: 9999;
            \`;
            document.body.appendChild(fixedButtonContainer);

            // --- 按钮样式 ---
            const buttonBaseStyle = \`
                color: white; padding: 8px 15px; border: none; border-radius: 5px;
                text-decoration: none; margin: 0 5px; cursor: pointer;
                transition: background-color 0.3s ease; display: inline-block;
                font-size: 14px;
            \`;

            // 按钮 1: 预加载所有页面
            const preloadButton = document.createElement('button');
            preloadButton.textContent = '预加载所有页面';
            preloadButton.style.cssText = buttonBaseStyle + 'background-color: #007bff;';
            preloadButton.onmouseover = function() { if(!this.disabled) this.style.backgroundColor = '#0056b3'; };
            preloadButton.onmouseout = function() { if(!this.disabled) this.style.backgroundColor = '#007bff'; };
            preloadButton.onclick = () => preloadOmgPages(preloadButton, true);
            fixedButtonContainer.appendChild(preloadButton);

            // 按钮 2: 生成默认清晰度的PDF
            const generatePdfButton = document.createElement('button');
            generatePdfButton.textContent = '下载PDF (默认清晰度)';
            generatePdfButton.style.cssText = buttonBaseStyle + 'background-color: #28a745;';
            generatePdfButton.onmouseover = function() { if(!this.disabled) this.style.backgroundColor = '#218838'; };
            generatePdfButton.onmouseout = function() { if(!this.disabled) this.style.backgroundColor = '#28a745'; };
            generatePdfButton.onclick = async () => {
                const linksReady = await checkLinksAndPreloadIfNeeded(generatePdfButton);
                if (linksReady) {
                    await processAndGeneratePdf(generatePdfButton, true);
                } else {
                    alert('未能获取到所有链接，请尝试手动预加载，或刷新页面后重试。');
                    generatePdfButton.textContent = '下载PDF (默认清晰度)';
                    generatePdfButton.disabled = false;
                }
            };
            fixedButtonContainer.appendChild(generatePdfButton);

            // 按钮 3: 生成自定义清晰度的PDF
            const customPdfButton = document.createElement('button');
            customPdfButton.textContent = '高清PDF下载（非必要慎用）';
            customPdfButton.style.cssText = buttonBaseStyle + 'background-color: #fd7e14;';
            customPdfButton.onmouseover = function() { if(!this.disabled) this.style.backgroundColor = '#e36d0a'; };
            customPdfButton.onmouseout = function() { if(!this.disabled) this.style.backgroundColor = '#fd7e14'; };
            customPdfButton.onclick = async () => {
                let scaleX = prompt('请输入一个正整数作为图片清晰度。建议输入3~5，数字越大越清晰，但下载也越慢。清晰度5已经很细腻了。', '3');
                while (scaleX !== null && (isNaN(parseInt(scaleX, 10)) || parseInt(scaleX, 10) <= 0)) {
                    scaleX = prompt('无效输入。请输入一个正整数：', '3');
                }
                if (scaleX === null) return;

                console.log(\`用户请求的清晰度为: \${scaleX}。注意：当前脚本版本将使用已加载的图片，此设置可能不会按预期生效。\`);

                const linksReady = await checkLinksAndPreloadIfNeeded(customPdfButton);
                if (linksReady) {
                    await processAndGenerateHDPdf(customPdfButton, parseInt(scaleX, 10), false);
                } else {
                    alert('未能获取到所有链接，请尝试手动预加载，或刷新页面后重试。');
                    customPdfButton.textContent = '自定义清晰度下载';
                    customPdfButton.disabled = false;
                }
            };
            fixedButtonContainer.appendChild(customPdfButton);

            getAndSetMaxPageIndex();
        })();
    `;

    document.head.appendChild(script);

})();
