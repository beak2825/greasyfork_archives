// ==UserScript==
// @name         BeautyLeg 图片增强
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description        支持 BeautyLeg 网站。提供导航增强、图片放大显示、一键打包下载、页面快速跳转、错误检测提示等功能。优化浏览体验，支持竖向图片排列，自动显示高清原图。
// @description:zh-CN  支持 BeautyLeg 网站。提供导航增强、图片放大显示、一键打包下载、页面快速跳转、错误检测提示等功能。优化浏览体验，支持竖向图片排列，自动显示高清原图。
// @description:zh-HK  支持 BeautyLeg 網站。提供導航增強、圖片放大顯示、一鍵打包下載、頁面快速跳轉、錯誤檢測提示等功能。優化瀏覽體驗，支持豎向圖片排列，自動顯示高清原圖。
// @description:zh-TW  支持 BeautyLeg 網站。提供導航增強、圖片放大顯示、一鍵打包下載、頁面快速跳轉、錯誤檢測提示等功能。優化瀏覽體驗，支持豎向圖片排列，自動顯示高清原圖。
// @description:en     Enhanced BeautyLeg website experience. Features: navigation enhancement, image enlargement, one-click ZIP download, quick page jumping, error detection. Optimized browsing with vertical image layout and automatic high-resolution display.
// @author             GangPeter
// @match              http://www.beautyleg.com/photo/show.php*
// @match              https://www.beautyleg.com/photo/show.php*
// @icon               http://www.beautyleg.com/image/BEAUTYLEG.gif
// @license            MIT
// @antifeature        none
// @require            https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/540303/BeautyLeg%20%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/540303/BeautyLeg%20%E5%9B%BE%E7%89%87%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 no 参数
    function getCurrentNo() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('no')) || 1;
    }

    // 检测页面是否显示错误信息
    function isPageError() {
        const pageText = document.body.innerText || document.body.textContent;
        return pageText.includes('錯誤:') && pageText.includes('資料庫中找不到指定的相冊');
    }

    // 将缩略图直接显示为大图并改为竖向排列
    function enlargeImages() {
        // 查找所有包含图片的链接
        const imageLinks = document.querySelectorAll('a[href*="/album/"]');
        
        console.log(`找到 ${imageLinks.length} 个图片链接`);
        
        // 创建竖向排列的容器
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 20px;
            width: 100%;
            margin: 0 auto;
        `;
        
        // 找到原始的图片表格容器
        const originalTable = document.querySelector('table.table_all');
        if (originalTable) {
            // 将新容器插入到原表格前面
            originalTable.parentNode.insertBefore(imageContainer, originalTable);
            // 隐藏原始表格
            originalTable.style.display = 'none';
        }
        
        imageLinks.forEach((link, index) => {
            const img = link.querySelector('img[src*="/thumb/"]');
            if (img) {
                // 获取大图路径
                const largeImageUrl = link.href;
                
                console.log(`处理第 ${index + 1} 张图片:`);
                console.log(`缩略图: ${img.src}`);
                console.log(`大图: ${largeImageUrl}`);
                
                // 创建新的图片元素
                const newImg = document.createElement('img');
                newImg.src = largeImageUrl;  // 直接使用大图
                newImg.alt = img.alt || '美腿图片';
                
                // 设置图片样式 - 显示原始大小
                newImg.style.cssText = `
                    width: auto;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                    cursor: default;
                `;
                
                // 创建图片包装器
                const imageWrapper = document.createElement('div');
                imageWrapper.style.cssText = `
                    width: 100%;
                    text-align: center;
                    margin-bottom: 10px;
                    overflow-x: auto;
                `;
                
                imageWrapper.appendChild(newImg);
                imageContainer.appendChild(imageWrapper);
                
                // 阻止原链接跳转
                link.onclick = (e) => {
                    e.preventDefault();
                    return false;
                };
            }
        });
        
        console.log(`✅ 成功创建了 ${imageLinks.length} 张大图的竖向排列`);
    }

    // 一键下载所有图片为ZIP
    async function downloadAllImages() {
        // 获取所有图片链接
        const imageLinks = document.querySelectorAll('a[href*="/album/"]');
        const imageUrls = Array.from(imageLinks).map(link => link.href);
        
        if (imageUrls.length === 0) {
            showCustomAlert('没有找到可下载的图片！', 'warning');
            return;
        }

        // 显示下载进度弹窗
        showDownloadProgress(imageUrls.length);
        
        try {
            const zip = new JSZip();
            const currentNo = getCurrentNo();
            
            // 下载每张图片并添加到zip
            for (let i = 0; i < imageUrls.length; i++) {
                const url = imageUrls[i];
                const filename = `${String(i + 1).padStart(3, '0')}.jpg`; // 001.jpg, 002.jpg...
                
                try {
                    updateDownloadProgress(i + 1, imageUrls.length, `正在下载: ${filename}`);
                    
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const blob = await response.blob();
                    zip.file(filename, blob);
                    
                    console.log(`✅ 已下载: ${filename}`);
                } catch (error) {
                    console.error(`❌ 下载失败: ${filename}`, error);
                    // 继续下载其他图片，不中断整个过程
                }
            }
            
            updateDownloadProgress(imageUrls.length, imageUrls.length, '正在生成ZIP文件...');
            
            // 生成ZIP文件
            const zipBlob = await zip.generateAsync({type: 'blob'});
            
            // 创建下载链接
            const downloadUrl = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `BeautyLeg_No${currentNo}_${imageUrls.length}pics.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // 清理内存
            URL.revokeObjectURL(downloadUrl);
            
            closeDownloadProgress();
            showCustomAlert(`✅ 下载完成！<br>文件名: BeautyLeg_No${currentNo}_${imageUrls.length}pics.zip`, 'info');
            
        } catch (error) {
            console.error('下载过程中发生错误:', error);
            closeDownloadProgress();
            showCustomAlert('下载过程中发生错误，请重试！', 'error');
        }
    }

    // 显示下载进度弹窗
    function showDownloadProgress(total) {
        const progressDialog = document.createElement('div');
        progressDialog.id = 'download-progress';
        progressDialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            padding: 30px;
            min-width: 400px;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        
        progressDialog.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333;">
                正在下载图片...
            </div>
            <div style="background: #f0f0f0; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
                <div id="progress-bar" style="background: #4CAF50; height: 8px; width: 0%; transition: width 0.3s ease;"></div>
            </div>
            <div id="progress-text" style="color: #666; font-size: 14px;">
                准备下载 ${total} 张图片...
            </div>
        `;
        
        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.id = 'download-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(progressDialog);
    }

    // 更新下载进度
    function updateDownloadProgress(current, total, message) {
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar && progressText) {
            const percentage = (current / total) * 100;
            progressBar.style.width = percentage + '%';
            progressText.textContent = `${message} (${current}/${total})`;
        }
    }

    // 关闭下载进度弹窗
    function closeDownloadProgress() {
        const progressDialog = document.getElementById('download-progress');
        const overlay = document.getElementById('download-overlay');
        
        if (progressDialog) progressDialog.remove();
        if (overlay) overlay.remove();
    }

    // 创建自定义弹窗
    function showCustomAlert(message, type = 'info') {
        // 移除已存在的弹窗
        const existingAlert = document.querySelector('#custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 创建弹窗容器
        const alertBox = document.createElement('div');
        alertBox.id = 'custom-alert';
        alertBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            padding: 24px;
            min-width: 300px;
            max-width: 400px;
            text-align: center;
            font-family: Arial, sans-serif;
            animation: alertFadeIn 0.3s ease-out;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes alertFadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        if (!document.querySelector('#alert-styles')) {
            style.id = 'alert-styles';
            document.head.appendChild(style);
        }

        // 创建图标
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 48px;
            margin-bottom: 16px;
        `;
        
        if (type === 'warning') {
            icon.innerHTML = '!';
            icon.style.cssText += `
                color: #f39c12;
                background: #fff3cd;
                border: 3px solid #f39c12;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                line-height: 54px;
                margin: 0 auto 16px auto;
                font-weight: bold;
            `;
        } else if (type === 'error') {
            icon.innerHTML = '×';
            icon.style.cssText += `
                color: #e74c3c;
                background: #f8d7da;
                border: 3px solid #e74c3c;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                line-height: 54px;
                margin: 0 auto 16px auto;
                font-weight: bold;
            `;
        } else {
            icon.innerHTML = 'i';
            icon.style.cssText += `
                color: #3498db;
                background: #d1ecf1;
                border: 3px solid #3498db;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                line-height: 54px;
                margin: 0 auto 16px auto;
                font-weight: bold;
            `;
        }

        // 创建消息文本
        const messageText = document.createElement('div');
        messageText.innerHTML = message;
        messageText.style.cssText = `
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
            line-height: 1.5;
        `;

        // 创建确认按钮
        const okButton = document.createElement('button');
        okButton.innerHTML = '确定';
        okButton.style.cssText = `
            background: #3498db;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 10px 24px;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;

        okButton.onmouseover = () => {
            okButton.style.background = '#2980b9';
        };
        okButton.onmouseout = () => {
            okButton.style.background = '#3498db';
        };

        // 关闭弹窗函数
        const closeAlert = () => {
            // 避免重复关闭
            if (!alertBox.parentNode || alertBox.dataset.closing === 'true') {
                return;
            }
            
            // 标记正在关闭
            alertBox.dataset.closing = 'true';
            
            // 立即移除遮罩层
            if (overlay.parentNode) overlay.remove();
            
            // 直接设置弹窗样式进行快速淡出
            alertBox.style.transition = 'all 0.2s ease-out';
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            // 短时间后移除元素
            setTimeout(() => {
                if (alertBox.parentNode) {
                    alertBox.remove();
                }
            }, 200);
        };

        // 点击确定按钮关闭弹窗
        okButton.onclick = closeAlert;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            animation: overlayFadeIn 0.3s ease-out;
        `;

        // 点击遮罩层关闭弹窗
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                closeAlert();
            }
        };



        // 组装弹窗
        alertBox.appendChild(icon);
        alertBox.appendChild(messageText);
        alertBox.appendChild(okButton);

        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(alertBox);

        // 3秒后自动关闭
        setTimeout(() => {
            if (document.querySelector('#custom-alert')) {
                closeAlert();
            }
        }, 3000);
    }

    // 创建导航按钮
    function createNavigationButtons() {
        const currentNo = getCurrentNo();
        const hasError = isPageError();
        
        // 统计图片总数
        const totalImages = document.querySelectorAll('a[href*="/album/"]').length;
        console.log(`📊 检测到 ${totalImages} 张图片`);
        
        // 创建按钮容器
        const navContainer = document.createElement('div');
        navContainer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;

        // 创建上一个按钮
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '← 上一个';
        prevButton.style.cssText = `
            padding: 12px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            min-width: 100px;
        `;
        
        prevButton.onmouseover = () => {
            prevButton.style.background = '#45a049';
            prevButton.style.transform = 'scale(1.05)';
        };
        prevButton.onmouseout = () => {
            prevButton.style.background = '#4CAF50';
            prevButton.style.transform = 'scale(1)';
        };

        // 创建下一个按钮
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '→ 下一个';
        nextButton.style.cssText = `
            padding: 12px 16px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.3s ease;
            min-width: 100px;
        `;
        
        nextButton.onmouseover = () => {
            nextButton.style.background = '#1976D2';
            nextButton.style.transform = 'scale(1.05)';
        };
        nextButton.onmouseout = () => {
            nextButton.style.background = '#2196F3';
            nextButton.style.transform = 'scale(1)';
        };

        // 创建页码显示
        const pageInfo = document.createElement('div');
        if (hasError) {
            pageInfo.innerHTML = `第 ${currentNo} 页<br><span style="color: #ff6b6b;">页面不存在</span><br><span style="color: #ffd700;">📊 共 0 张图片</span>`;
        } else {
            pageInfo.innerHTML = `第 ${currentNo} 页<br><span style="color: #87CEEB;">📊 共 ${totalImages} 张图片</span>`;
        }
        pageInfo.style.cssText = `
            text-align: center;
            color: white;
            font-size: 12px;
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            margin: 5px 0;
            line-height: 1.4;
        `;

        // 创建页面跳转输入框
        const jumpContainer = document.createElement('div');
        jumpContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            margin: 10px 0;
        `;

        const jumpInput = document.createElement('input');
        jumpInput.type = 'number';
        jumpInput.placeholder = '页码';
        jumpInput.min = '1';
        jumpInput.style.cssText = `
            width: 50px;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
            background: white;
            color: #333;
        `;

        const jumpButton = document.createElement('button');
        jumpButton.innerHTML = '跳转';
        jumpButton.style.cssText = `
            padding: 6px 12px;
            background: #9C27B0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            transition: background 0.3s ease;
        `;

        jumpButton.onmouseover = () => {
            jumpButton.style.background = '#7B1FA2';
        };
        jumpButton.onmouseout = () => {
            jumpButton.style.background = '#9C27B0';
        };

        // 跳转功能
        const handleJump = () => {
            const targetPage = parseInt(jumpInput.value);
            if (isNaN(targetPage) || targetPage < 1) {
                showCustomAlert('请输入有效的页码（大于0的数字）！', 'warning');
                return;
            }
            
            if (targetPage === currentNo) {
                showCustomAlert('您已经在第' + targetPage + '页了！', 'info');
                return;
            }
            
            // 跳转到指定页面
            window.location.href = `show.php?no=${targetPage}`;
        };

        jumpButton.onclick = handleJump;

        // 支持回车键跳转
        jumpInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                handleJump();
            }
        };

        jumpContainer.appendChild(jumpInput);
        jumpContainer.appendChild(jumpButton);

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        if (hasError || totalImages === 0) {
            downloadButton.innerHTML = '📦 无图片';
            downloadButton.disabled = true;
            downloadButton.style.cssText = `
                padding: 12px 16px;
                background: #999;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: not-allowed;
                font-size: 14px;
                font-weight: bold;
                min-width: 100px;
                margin-top: 10px;
                opacity: 0.6;
            `;
        } else {
            downloadButton.innerHTML = `📦 下载全部 (${totalImages})`;
            downloadButton.style.cssText = `
                padding: 12px 16px;
                background: #FF6B35;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                min-width: 100px;
                margin-top: 10px;
            `;
        }
        
        // 只有在有图片的情况下才添加悬停效果和点击事件
        if (!hasError && totalImages > 0) {
            downloadButton.onmouseover = () => {
                downloadButton.style.background = '#E55A2B';
                downloadButton.style.transform = 'scale(1.05)';
            };
            downloadButton.onmouseout = () => {
                downloadButton.style.background = '#FF6B35';
                downloadButton.style.transform = 'scale(1)';
            };

            downloadButton.onclick = () => {
                downloadAllImages();
            };
        }

        // 添加点击事件
        prevButton.onclick = () => {
            if (currentNo > 1) {
                window.location.href = `show.php?no=${currentNo - 1}`;
            } else {
                showCustomAlert('已经是第一页了！', 'warning');
            }
        };

        nextButton.onclick = () => {
            if (hasError) {
                // 错误页面时提供更多选择
                showCustomAlert(
                    `第 ${currentNo} 页不存在！<br><br>` +
                    `页面编号可能不连续，你可以：<br><br>` +
                    `<button onclick="window.location.href='show.php?no=${currentNo + 1}'" style="background:#4CAF50;color:white;border:none;padding:8px 16px;border-radius:4px;margin:5px;cursor:pointer;">继续尝试下一页</button><br>` +
                    `<button onclick="window.location.href='show.php?no=${currentNo - 1}'" style="background:#FF6B35;color:white;border:none;padding:8px 16px;border-radius:4px;margin:5px;cursor:pointer;">返回上一页</button>`,
                    'warning'
                );
            } else {
                window.location.href = `show.php?no=${currentNo + 1}`;
            }
        };

        // 如果是第一页，禁用上一个按钮
        if (currentNo <= 1) {
            prevButton.style.opacity = '0.5';
            prevButton.style.cursor = 'not-allowed';
        }

        // 如果页面显示错误，禁用下一个按钮
        if (hasError) {
            nextButton.style.opacity = '0.5';
            nextButton.style.cursor = 'not-allowed';
            nextButton.style.background = '#666';
        }

        // 组装容器
        navContainer.appendChild(prevButton);
        navContainer.appendChild(pageInfo);
        navContainer.appendChild(nextButton);
        navContainer.appendChild(jumpContainer);
        navContainer.appendChild(downloadButton);

        // 添加到页面
        document.body.appendChild(navContainer);

        // 如果检测到错误页面，显示提醒弹窗
        if (hasError) {
            setTimeout(() => {
                showCustomAlert(
                    `第 ${currentNo} 页不存在！<br><br>` +
                    `这可能是因为页面编号不连续，<br>` +
                    `你可以尝试跳转到其他页面或返回上一页。<br><br>` +
                    `<button onclick="window.location.href='show.php?no=${currentNo + 1}'" style="background:#9C27B0;color:white;border:none;padding:8px 16px;border-radius:4px;margin:3px;cursor:pointer;">尝试+1页</button><br>` +
                    `<button onclick="window.location.href='show.php?no=${currentNo - 1}'" style="background:#FF6B35;color:white;border:none;padding:8px 16px;border-radius:4px;margin:3px;cursor:pointer;">返回上一页</button>`,
                    'warning'
                );
            }, 1000); // 延迟1秒显示，让页面加载完成
        }

        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentNo > 1) {
                window.location.href = `show.php?no=${currentNo - 1}`;
            } else if (e.key === 'ArrowRight' && !hasError) {
                window.location.href = `show.php?no=${currentNo + 1}`;
            }
        });
    }

    // 等待页面加载完成后创建按钮和放大图片
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createNavigationButtons();
            enlargeImages();
        });
    } else {
        createNavigationButtons();
        enlargeImages();
    }

})(); 