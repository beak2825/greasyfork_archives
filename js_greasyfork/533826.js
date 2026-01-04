// ==UserScript==
// @name         HUST统一身份认证验证码识别脚本 (omggif + Tesseract.js)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动处理指定页面上的动画 GIF 验证码并尝试填充输入框 (使用 omggif，增加跳帧处理，同步显示处理的 GIF)
// @match        https://pass.hust.edu.cn/cas/login*
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/omggif@1.0.10/omggif.min.js
// @grant        GM_xmlhttpRequest
// @connect      * // Required by omggif/GM_xmlhttpRequest for fetching
// @license MIT
// @author       Your Name
// @downloadURL https://update.greasyfork.org/scripts/533826/HUST%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%E8%84%9A%E6%9C%AC%20%28omggif%20%2B%20Tesseractjs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533826/HUST%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB%E8%84%9A%E6%9C%AC%20%28omggif%20%2B%20Tesseractjs%29.meta.js
// ==/UserScript==

/* global GifReader, Tesseract */

(function() {
    'use strict';

    // --- 配置 ---
    const captchaImageSelector = '#codeImage'; // <-- 重要：验证码图片的 CSS 选择器
    const captchaInputSelector = '#code'; // <-- 重要：验证码输入框的 CSS 选择器
    const imageWidth = 90; // 验证码图片宽度 (gifler 会用 canvas 尺寸，但我们处理时需要)
    const imageHeight = 58; // 验证码图片高度
    const framesToExtract = 4; // 要抽取的最大帧数
    const frameSkipInterval = 0; // <-- 新增：每次读取后跳过的帧数 (0 表示不跳过)
    // --- 配置结束 ---

    // 存储临时的 Blob URL，以便后续释放
    let currentBlobUrl = null;
    // 存储 MutationObserver 实例
    let observerInstance = null;

    async function initialize() {
        const img = document.querySelector(captchaImageSelector);
        const input = document.querySelector(captchaInputSelector);

        if (!img) {
            console.error('未找到验证码图片元素，选择器:', captchaImageSelector);
            return;
        }
        if (!input) {
            console.error('未找到验证码输入框元素，选择器:', captchaInputSelector);
            return;
        }

        // 定义 process 函数，接收 observer
        const process = async (obs) => { // 接收 observer
            // 强制设置图片显示尺寸
            img.width = imageWidth;
            img.height = imageHeight;
            console.log('图像显示尺寸已设置/确认:', img.width, 'x', img.height);
             try {
                // 调用使用 omggif 的处理函数，传递 observer
                await processGifCaptchaWithOmggif(img, input, obs);
            } catch (error) {
                 console.error('处理验证码过程中发生错误:', error);
            }
        };

        // 创建 MutationObserver 实例
        observerInstance = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    const newSrc = img.getAttribute('src');
                    // 检查是否是我们自己设置的 blob URL，如果是，则忽略
                    if (newSrc && newSrc.startsWith('blob:')) {
                        console.log('检测到 src 更改为 blob URL，由脚本设置，忽略。');
                        return;
                    }
                    console.log('检测到验证码图片 src 更改 (非脚本设置)，准备重新处理...');
                    // 移除旧的调试画布（如果存在）
                    const oldDebugCanvas = document.getElementById('omggif-debug-canvas');
                    if (oldDebugCanvas) {
                        oldDebugCanvas.remove();
                    }
                    // 释放旧的 Blob URL (如果存在且不是当前 src)
                    if (currentBlobUrl && currentBlobUrl !== newSrc) {
                        console.log('释放旧的 Blob URL:', currentBlobUrl);
                        URL.revokeObjectURL(currentBlobUrl);
                        currentBlobUrl = null;
                    }
                    // 传递 observer 给 process
                    setTimeout(() => process(observerInstance), 500); // 延迟处理
                }
            });
        });

        // 开始观察 img 元素
        observerInstance.observe(img, { attributes: true });

        // 初始处理
        if (img.complete && img.naturalHeight !== 0 && img.src && !img.src.startsWith('blob:')) {
             console.log('图像已加载，准备初始处理...');
             setTimeout(() => process(observerInstance), 200); // 传递 observer
        } else if (img.src && !img.src.startsWith('blob:')) {
             console.log('图像 src 存在但未加载完成，等待 onload...');
             img.onload = () => {
                 // 确保 onload 不是由 blob URL 触发的
                 if (img.src && !img.src.startsWith('blob:')) {
                     console.log('图像加载完成 (onload).');
                     setTimeout(() => process(observerInstance), 200); // 传递 observer
                 } else {
                     console.log('图像 onload 触发，但 src 是 blob URL，忽略处理。');
                 }
             };
             img.onerror = () => console.error('加载验证码图片失败。');
        } else if (img.src && img.src.startsWith('blob:')) {
             console.log("图片 src 是 blob URL，可能由之前的脚本运行设置，等待外部更改...");
             // 如果初始是 blob URL，我们可能需要释放它，但要小心，
             // 也许它就是当前有效的，等待外部刷新触发 observer
             // currentBlobUrl = img.src; // 假设它是当前的
        } else {
             console.log("图片 src 为空，等待 src 设置...");
        }
    }


    // ... existing processSingleFrame function ...
    function processSingleFrame(canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let imageData;
        try {
            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.error('获取 ImageData 时出错:', e);
             try {
                 const tempCanvas = document.createElement('canvas');
                 tempCanvas.width = canvas.width;
                 tempCanvas.height = canvas.height;
                 tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
                 imageData = tempCanvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
                 console.log('通过临时 Canvas 成功获取 ImageData');
             } catch (e2) {
                 console.error('尝试通过临时 Canvas 获取 ImageData 仍失败:', e2);
                 return null;
             }
        }
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        const FG = 0; // 前景色 (黑)
        const BG = 255; // 背景色 (白)

        // 1. 阈值分割二值化
        const bgThreshold = 254; // 可以调整这个阈值
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // 计算灰度值 (简单平均)
            // const gray = (r + g + b) / 3;
            data[i + 3] = 255; // Alpha
            // 判断是否接近白色背景
            if (r > bgThreshold && g > bgThreshold && b > bgThreshold) {
                data[i] = data[i + 1] = data[i + 2] = BG; // White
            } else {
                data[i] = data[i + 1] = data[i + 2] = FG; // Black
            }
        }

        // Helper function to get pixel value (assuming grayscale/binary)
        const getPixel = (d, w, h, x, y) => { // Added height param 'h'
            if (x < 0 || x >= w || y < 0 || y >= h) return BG; // Treat out of bounds as background
            return d[(y * w + x) * 4]; // Check Red channel
        };

        // Helper function to set pixel value
        const setPixel = (d, w, x, y, value) => {
            const i = (y * w + x) * 4;
            if (i >= 0 && i < d.length - 3) { // Bounds check
                d[i] = d[i + 1] = d[i + 2] = value;
                d[i + 3] = 255; // Ensure alpha is opaque
            }
        };

        // Create copies for processing stages
        const originalData = new Uint8ClampedArray(data); // Keep original binary data
        const processedData = new Uint8ClampedArray(data); // Data to be modified

        // 2. 腐蚀 (Erosion) - 2x2 structuring element
        // If any neighbor in the original binary image is background (BG), set pixel in processedData to background (BG)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let isBoundary = false;
                for (let ny = -1; ny <= 0; ny++) {
                    for (let nx = -1; nx <= 0; nx++) {
                        // Check neighbors in the original binarized data
                        if (getPixel(originalData, width, height, x + nx, y + ny) === BG) {
                            isBoundary = true;
                            break;
                        }
                    }
                    if (isBoundary) break;
                }
                if (isBoundary) {
                    // Set pixel to background in the processed data
                    setPixel(processedData, width, x, y, BG);
                } else {
                    // Keep original foreground pixel if no background neighbors
                    setPixel(processedData, width, x, y, FG); // FG is 0
                }
            }
        }

        // Create a copy after erosion before dilation
        const erodedData = new Uint8ClampedArray(processedData);

        // 3. 膨胀 (Dilation) - 2x2 structuring element (applied on eroded data)
        // If any neighbor in the eroded image is foreground (FG), set pixel in processedData to foreground (FG)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let hasFgNeighbor = false;
                for (let ny = -1; ny <= 0; ny++) {
                    for (let nx = -1; nx <= 0; nx++) {
                        // Check neighbors in the eroded data
                        if (getPixel(erodedData, width, height, x + nx, y + ny) === FG) {
                            hasFgNeighbor = true;
                            break;
                        }
                    }
                    if (hasFgNeighbor) break;
                }
                if (hasFgNeighbor) {
                    // Set pixel to foreground in the final processed data
                    setPixel(processedData, width, x, y, FG);
                } else {
                     // Keep original background pixel from eroded data if no foreground neighbors
                    setPixel(processedData, width, x, y, getPixel(erodedData, width, height, x, y));
                }
            }
        }


        // 将最终处理结果 (膨胀后的) 写回原始 imageData
        imageData.data.set(processedData);

        // 更新 canvas 显示 (可选，主要为了返回正确的 ImageData)
        ctx.putImageData(imageData, 0, 0);
        return imageData; // 返回处理后的 ImageData
    }

    // ... existing mergeFrames function ...
    function mergeFrames(processedFramesData, width, height) {
        const mergedCanvas = document.createElement('canvas');
        mergedCanvas.width = width;
        mergedCanvas.height = height;
        const mergedCtx = mergedCanvas.getContext('2d');
        const mergedImageData = mergedCtx.createImageData(width, height);
        const mergedData = mergedImageData.data;

        // Initialize merged canvas to white
        for (let i = 0; i < mergedData.length; i += 4) {
            mergedData[i] = mergedData[i + 1] = mergedData[i + 2] = 255; // RGB White
            mergedData[i + 3] = 255; // Alpha Opaque
        }

        // Overlay black pixels from processed frames
        processedFramesData.forEach(frameData => {
            if (!frameData) return; // Skip if frame processing failed
            const data = frameData.data;
            for (let i = 0; i < data.length; i += 4) {
                // If pixel in frame is black (data[i] === 0), make corresponding pixel in mergedData black
                if (data[i] === 0) { // Check only Red channel, as we made it B&W
                    mergedData[i] = mergedData[i + 1] = mergedData[i + 2] = 0; // RGB Black
                }
            }
        });

        mergedCtx.putImageData(mergedImageData, 0, 0);
        console.log('帧合并完成');
        return mergedCanvas;
    }


    // 使用 omggif 处理 GIF 验证码
    async function processGifCaptchaWithOmggif(img, input, observer) { // 接收 observer
        console.log('开始使用 omggif 处理 GIF 验证码...');
        const originalSrc = img.src; // 保存原始 src 以供请求
        if (!originalSrc) {
            console.error("验证码图片 src 为空，无法处理。");
            return;
        }
        if (typeof GifReader === 'undefined') {
            console.error("omggif 库未加载！");
            return;
        }
        if (typeof GM_xmlhttpRequest === 'undefined') {
             console.error("GM_xmlhttpRequest 未定义，无法获取 GIF 数据。请检查 @grant 设置。");
             return;
        }
        if (!observer) {
            console.error("MutationObserver 实例未传递，无法安全更新图片 src。");
            return;
        }

        try {
            // 1. 使用 GM_xmlhttpRequest 获取 GIF 数据
            const gifData = await new Promise((resolve, reject) => {
                console.log(`尝试使用 GM_xmlhttpRequest 获取图像: ${originalSrc}`);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: originalSrc, // 使用原始 src 请求
                    responseType: 'arraybuffer', // Crucial for binary data
                    timeout: 10000, // 设置 10 秒超时
                    onload: function(response) {
                        if (response.status === 200 && response.response) {
                            console.log('GM_xmlhttpRequest 成功获取 GIF 数据');
                            resolve(response.response);
                        } else {
                            console.error(`GM_xmlhttpRequest 获取失败: status=${response.status}`);
                            reject(new Error(`获取 GIF 失败: ${response.statusText || response.status}`));
                        }
                    },
                    onerror: function(response) {
                        console.error('GM_xmlhttpRequest 发生错误:', response);
                        reject(new Error('GM_xmlhttpRequest 请求错误'));
                    },
                    ontimeout: function() {
                        console.error('GM_xmlhttpRequest 请求超时');
                        reject(new Error('GM_xmlhttpRequest 请求超时'));
                    }
                });
            });

            // --- 更新图片显示 ---
            let newBlobUrl = null;
            try {
                const blob = new Blob([gifData], { type: 'image/gif' });
                newBlobUrl = URL.createObjectURL(blob);
                console.log('创建新的 Blob URL:', newBlobUrl);

                // 暂停观察
                observer.disconnect();
                console.log('MutationObserver 已暂停');

                // 释放旧的 Blob URL (如果存在)
                if (currentBlobUrl) {
                    console.log('释放之前的 Blob URL:', currentBlobUrl);
                    URL.revokeObjectURL(currentBlobUrl);
                }

                // 更新图片 src
                img.src = newBlobUrl;
                currentBlobUrl = newBlobUrl; // 保存新的 URL
                console.log('验证码图片 src 已更新为 Blob URL');

            } catch (blobError) {
                console.error("创建 Blob URL 或更新 src 时出错:", blobError);
                // 即使出错，也要尝试恢复观察
            } finally {
                // 恢复观察
                observer.observe(img, { attributes: true });
                console.log('MutationObserver 已恢复');
            }
            // --- 更新图片显示结束 ---


            // 2. 使用 omggif 解析 (使用获取到的 gifData)
            const reader = new GifReader(new Uint8Array(gifData));
            const numFrames = reader.numFrames();
            const width = reader.width;
            const height = reader.height;
            console.log(`GIF 解析成功: ${width}x${height}, ${numFrames} 帧`);

            if (width !== imageWidth || height !== imageHeight) {
                console.warn(`警告: GIF 实际尺寸 (${width}x${height}) 与配置尺寸 (${imageWidth}x${imageHeight}) 不符。将使用实际尺寸。`);
            }
             if (numFrames === 0) {
                 console.error("omggif 未能解码任何帧。处理中止。");
                 return;
             }


            // 3. 选择并处理帧 (跳帧逻辑)
            const selectedFrameIndices = [];
            for (let i = 0; i < numFrames && selectedFrameIndices.length < framesToExtract; i += (frameSkipInterval + 1)) {
                 selectedFrameIndices.push(i);
            }
            if (selectedFrameIndices.length === 0 && numFrames > 0) {
                selectedFrameIndices.push(0);
            }

            console.log(`计划处理 ${selectedFrameIndices.length} 帧 (跳帧间隔 ${frameSkipInterval})，索引: ${selectedFrameIndices.join(', ')}`);

            const processedFramesData = [];
            const frameCanvas = document.createElement('canvas');
            frameCanvas.width = width;
            frameCanvas.height = height;
            const frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true });
            let frameImageData = frameCtx.createImageData(width, height); // 初始化

            for (const frameIndex of selectedFrameIndices) {
                try {
                    const currentFrameInfo = reader.frameInfo(frameIndex);
                    // 确保 ImageData 尺寸与当前帧匹配
                    if (frameImageData.width !== currentFrameInfo.width || frameImageData.height !== currentFrameInfo.height) {
                         console.warn(`帧 ${frameIndex} 尺寸 (${currentFrameInfo.width}x${currentFrameInfo.height}) 与预期 (${frameImageData.width}x${frameImageData.height}) 不符，重新创建 ImageData`);
                         frameImageData = frameCtx.createImageData(currentFrameInfo.width, currentFrameInfo.height);
                         // 调整 Canvas 尺寸以匹配，确保 putImageData 不出错
                         frameCanvas.width = currentFrameInfo.width;
                         frameCanvas.height = currentFrameInfo.height;
                    }

                    reader.decodeAndBlitFrameRGBA(frameIndex, frameImageData.data);
                    frameCtx.putImageData(frameImageData, 0, 0);
                    // 传递实际尺寸给 processSingleFrame
                    const processedData = processSingleFrame(frameCanvas);
                    if (processedData) {
                        processedFramesData.push(processedData);
                    } else {
                         console.warn(`第 ${frameIndex} 帧处理失败，跳过。`);
                    }
                } catch (frameError) {
                    console.error(`处理第 ${frameIndex} 帧时出错:`, frameError);
                }
            }


            if (processedFramesData.length === 0) {
                console.error("所有选定帧都处理失败或未选择任何帧。");
                return;
            }
            console.log(`成功处理了 ${processedFramesData.length} 帧。`);

            // 4. 合并处理后的帧 (使用实际的 width, height)
            const mergedCanvas = mergeFrames(processedFramesData, width, height);

            // --- 可选调试 ---
            const oldDebugCanvas = document.getElementById('omggif-debug-canvas');
            if (oldDebugCanvas) {
                oldDebugCanvas.remove();
            }
            const debugCanvas = document.createElement('canvas');
            debugCanvas.id = 'omggif-debug-canvas';
            debugCanvas.width = mergedCanvas.width;
            debugCanvas.height = mergedCanvas.height;
            debugCanvas.getContext('2d').drawImage(mergedCanvas, 0, 0);
            debugCanvas.style.border = '2px solid blue';
            debugCanvas.style.position = 'fixed';
            debugCanvas.style.top = '10px';
            debugCanvas.style.right = '10px';
            debugCanvas.style.zIndex = '99999';
            debugCanvas.style.backgroundColor = 'white';
            document.body.appendChild(debugCanvas);
            console.log('合并后的调试画布已添加/更新 (omggif)。');
            // --- 调试结束 ---

            // 5. Tesseract OCR
            console.log('开始 Tesseract 识别...');
            const worker = await Tesseract.createWorker('eng', 1, {
                 logger: m => { if(m.status === 'recognizing text') console.log(`识别进度: ${(m.progress * 100).toFixed(0)}%`) },
            });

            await worker.setParameters({
                tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
            });

            const { data: { text } } = await worker.recognize(mergedCanvas);
            await worker.terminate();

            console.log('Tesseract 原始结果:', text);
            const recognizedText = text.replace(/[^a-zA-Z0-9]/g, '');
            const expectedLength = 4;

            if (recognizedText.length === expectedLength) {
                console.log('识别文本 (清理后):', recognizedText);
                input.value = recognizedText;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                console.log('验证码已填充。');
            } else {
                console.warn(`OCR 结果长度 (${recognizedText.length}) 不符预期 (${expectedLength}): "${recognizedText}" (原始: "${text.trim()}")`);
            }

        } catch (error) {
            console.error('处理 GIF 验证码 (omggif) 的主流程中发生错误:', error);
             const debugCanvas = document.getElementById('omggif-debug-canvas');
             if (debugCanvas) {
                 debugCanvas.remove();
             }
             // 如果出错时 Blob URL 已创建但未赋给 currentBlobUrl，尝试释放
             if (typeof newBlobUrl === 'string' && newBlobUrl !== currentBlobUrl) {
                 console.log("尝试释放在错误处理中创建的 Blob URL:", newBlobUrl);
                 URL.revokeObjectURL(newBlobUrl);
             }
        }
    }


    // --- 脚本入口 ---
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 2000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 2000));
    }

})();