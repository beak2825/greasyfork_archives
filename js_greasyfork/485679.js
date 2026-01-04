// ==UserScript==
// @name         Pexels合集下载器
// @namespace    Tampermonkey Scripts
// @version      1.3
// @description  下载Pexels图片合集
// @author       FOX
// @match        https://www.pexels.com/zh-cn/collections/*
// @match        https://www.pexels.com/collections/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485679/Pexels%E5%90%88%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485679/Pexels%E5%90%88%E9%9B%86%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let downloadedCount = 0;
    let totalImages = 0;
    let progressBarContainer, progressBarFill, progressText, progressTitle;
    let isDragging = false;
    let startOffsetX = 0;
    let startOffsetY = 0;

    function getCollectionTitle() {
        const collectionTitleElement = document.querySelector('.Text_text__D8yqX.Text_size-h60__tkvRy.Text_size-h28-mobile__p1MpK.Text_weight-semibold__GaFnn.Text_color-midnight2C343E__iCo4Q.spacing_noMargin__F5u9R.Text_center__q4tcr');
        let collectionTitle = collectionTitleElement ? collectionTitleElement.textContent.trim() : 'Unknown_Collection';
        // 替换掉文件名中不允许的字符
        collectionTitle = collectionTitle.replace(/[\W_]+/g, "_");
        return collectionTitle;
    }

    function updateProgressText() {
        if (progressText) {
            progressText.textContent = `当前进度：${downloadedCount}/${totalImages}`;
            progressBarFill.style.width = totalImages > 0 ? `${(downloadedCount / totalImages) * 100}%` : '0%'; // 更新进度条宽度

            // 检查下载是否完成
            if (downloadedCount >= totalImages) {
                // 设置2秒后自动关闭进度条
                setTimeout(() => {
                    if (progressBarContainer && progressBarContainer.parentNode) {
                        progressBarContainer.parentNode.removeChild(progressBarContainer);
                    }
                }, 2000); // 2秒后执行
            }
        }
    }

    function downloadImage(url, name) {
        GM_download({
            url: url,
            name: name,
            onerror: function (error) {
                console.error(`Download failed:`, error);
                downloadedCount++;
                updateProgressText();
            },
            ontimeout: function () {
                console.error(`Download timed out:`, url);
                downloadedCount++;
                updateProgressText();
            },
            onload: function () {
                downloadedCount++;
                updateProgressText();
            }
        });
    }

    function getImageUrls() {
        const downloadButtons = document.querySelectorAll('.Button_button__RDDf5.spacing_noMargin__F5u9R..spacing_pr20__ZH8T3..spacing_pl20__MrrA1.DownloadButton_downloadButton__0aNOo.DownloadButton_fullButtonOnDesktop__EWWUC.Button_clickable__DqoNe.Button_white__OVsmf.Link_link__Ime8c.spacing_noMargin__F5u9R');
        totalImages = downloadButtons.length;
        return Array.from(downloadButtons).map(button => {
            const thumbUrl = button.getAttribute('href');
            if (thumbUrl) {
                const photoIdMatch = thumbUrl.match(/photo-(\d+)/i);
                if (photoIdMatch && photoIdMatch[1]) {
                    return `https://images.pexels.com/photos/${photoIdMatch[1]}/pexels-photo-${photoIdMatch[1]}.jpeg`;
                }
            }
            return null;
        }).filter(url => url !== null);
    }

    function startDownloadProcess() {
        // 确保所有图片加载完毕后再开始下载
        autoScroll(() => {
            const imageUrls = getImageUrls();
            totalImages = imageUrls.length;
            updateProgressText();
            const collectionName = getCollectionTitle(); // 获取合集名称
            imageUrls.forEach((url, index) => {
                // 包含合集名称在文件名中
                setTimeout(() => downloadImage(url, `${collectionName}-${index + 1}.jpg`), index * 1000);
            });
        });
    }

    function autoScroll(callback) {
        const intervalDelay = 350;
        const pauseDuration = 2000;
        const scrollIncrement = 100; // 每次循环时增加的额外滚动量
        let lastScrollHeight = 0;
        let sameScrollCounter = 0; // 计数器，用于跳过因内容加载导致的滚动高度不变
        let incrementalScrollDistance = window.innerHeight; // 开始时等于一个窗口的高度

        const scrollInterval = setInterval(() => {
            const currentScrollHeight = document.documentElement.scrollHeight;
            window.scrollBy(0, incrementalScrollDistance);

            if (currentScrollHeight === lastScrollHeight) {
                sameScrollCounter++;
            } else {
                sameScrollCounter = 0; // 如果检测到滚动高度改变，重置计数器
                incrementalScrollDistance += scrollIncrement; // 增加滚动距离
            }

            if (sameScrollCounter >= 3) { // 如果连续3次滚动高度未改变，则认为已到达底部
                clearInterval(scrollInterval);
                setTimeout(() => {
                    window.scrollTo(0, 0); // 返回顶部
                    if (typeof callback === "function") {
                        callback();
                    }
                }, pauseDuration);
            }

            lastScrollHeight = currentScrollHeight; // 更新最后的滚动高度
        }, intervalDelay);
    }

    // 添加下载按钮
    function addProgressBar() {
        progressBarContainer = document.createElement('div');
        Object.assign(progressBarContainer.style, {
            position: 'fixed',
            bottom: '50px', // 距离底部的像素
            right: '5px', // 距离右侧的像素
            backgroundColor: 'rgba(0,125,250,0.7)', // 0.7的半透明色
            borderRadius: '10px',
            padding: '10px',
            width: '480px', // 进度条宽度
            height: '65px', // 进度条高度
            zIndex: '9999',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            color: 'white', // 进度条文字颜色
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            lineHeight: '1.4',
            cursor: 'move' // 添加拖动样式
        });

        progressTitle = document.createElement('div');
        progressTitle.textContent = `正在下载合集：${getCollectionTitle()}`;
        progressBarContainer.appendChild(progressTitle);

        progressText = document.createElement('div');
        progressText.textContent = '当前进度：0%';
        progressBarContainer.appendChild(progressText);

        const progressBarBackground = document.createElement('div');
        Object.assign(progressBarBackground.style, {
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)', //进度槽背景色
            borderRadius: '5px',
            margin: '5px 0'
        });
        progressBarContainer.appendChild(progressBarBackground);

        progressBarFill = document.createElement('div');
        Object.assign(progressBarFill.style, {
            height: '5px',
            width: '0%',
            backgroundColor: '#1afff7', // 进度线条色
            borderRadius: '5px',
            transition: 'width 0.5s ease-in-out'
        });
        progressBarBackground.appendChild(progressBarFill);

        const movableText = document.createElement('div');
        movableText.textContent = '（进度条可移动）';
        Object.assign(movableText.style, {
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '13px',
            padding: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: 'white'
        });
        progressBarContainer.appendChild(movableText);


        progressBarContainer.addEventListener('mousedown', startDragging);

        document.body.appendChild(progressBarContainer);
    }

    function startDragging(event) {
        isDragging = true;
        startOffsetX = event.clientX - progressBarContainer.offsetLeft;
        startOffsetY = event.clientY - progressBarContainer.offsetTop;

        document.addEventListener('mousemove', dragProgressBar);
        document.addEventListener('mouseup', stopDragging);
    }

    function dragProgressBar(event) {
        if (isDragging) {
            const offsetX = event.clientX - startOffsetX;
            const offsetY = event.clientY - startOffsetY;
            progressBarContainer.style.left = offsetX + 'px';
            progressBarContainer.style.top = offsetY + 'px';
        }
    }

    function stopDragging() {
        isDragging = false;

        document.removeEventListener('mousemove', dragProgressBar);
        document.removeEventListener('mouseup', stopDragging);
    }

    function addDownloadButton() {
        const userInfoElement = document.querySelector('.Page_users__MM9S2.Flex_flex__3z447.spacing_noMargin__F5u9R.spacing_mmb30__tk52K.spacing_tmb30__r_auH');
        if (userInfoElement) {
            const downloadBtnContainer = document.createElement('div');
            downloadBtnContainer.style.display = 'inline-flex';
            downloadBtnContainer.style.alignItems = 'center';
            downloadBtnContainer.style.marginLeft = '10px';

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载合集';
            downloadBtn.id = 'downloadBtn';
            Object.assign(downloadBtn.style, {
                fontSize: '16px',
                color: 'white',
                background: '#05a081',
                border: 'none',
                borderRadius: '30px',
                height: '45px',
                width: '100px',
                cursor: 'pointer',
                padding: '8px 15px',
                margin: '0 10px'
            });

            downloadBtnContainer.appendChild(downloadBtn);
            userInfoElement.parentNode.insertBefore(downloadBtnContainer, userInfoElement.nextSibling);

            downloadBtn.addEventListener('click', () => {
                addProgressBar();
                startDownloadProcess();
            });
        } else {
            console.error('User information element not found.');
        }
    }

    function checkAndInsertButton() {
        if (!document.getElementById('downloadBtn')) {
            addDownloadButton();
        }
    }

    setInterval(checkAndInsertButton, 1000);
})();
