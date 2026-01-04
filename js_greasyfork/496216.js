// ==UserScript==
// @name         更好用的脚本！控制页面的图片显示与隐藏
// @version      6.2
// @description  稳定版图片隐藏/显示工具，解决错位问题，确保所有图片显示控制按钮，图片消失时自动清理控制元素
// @author       hulada
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-body
// @namespace https://greasyfork.org/users/1043548
// @downloadURL https://update.greasyfork.org/scripts/496216/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84%E8%84%9A%E6%9C%AC%EF%BC%81%E6%8E%A7%E5%88%B6%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E4%B8%8E%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496216/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84%E8%84%9A%E6%9C%AC%EF%BC%81%E6%8E%A7%E5%88%B6%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA%E4%B8%8E%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    let active = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0, startTime = 0;

    window.imgHidenSet = null;
    window.imgShownSet = null;

    let yanEmoji = ["（‐＾▽＾‐）"];
    let randomNumSet;

    // 存储所有图片元素及其对应的控制按钮和轮廓
    let imageControls = new Map();
    let imageOutlines = new Map();
    let mouseTimers = new Map();

    // 自动隐藏延迟时间（毫秒）
    const AUTO_HIDE_DELAY = 500;

    // 简单的节流函数
    function throttle(func, delay) {
        let timeout;
        return function(...args) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    func.apply(this, args);
                    timeout = null;
                }, delay);
            }
        };
    }

    let toggleSingleImage = function(img, button, outline) {
        if (img.style.visibility === 'hidden' || img.style.visibility === '') {
            img.style.visibility = 'visible';
            img.style.transition = 'filter 0.6s ease';
            img.style.filter = 'none';
            outline.style.display = 'none';
            button.innerText = '隐';
            button.title = '点击隐藏图片';
        } else {
            img.style.visibility = 'hidden';
            img.style.transition = 'filter 0.6s ease';
            img.style.filter = 'blur(14px)';
            outline.style.display = 'block';
            button.innerText = '显';
            button.title = '点击显示图片';
        }
    };

    let startAutoHideTimer = function(button, outline) {
        clearAutoHideTimer(button);
        mouseTimers.set(button, setTimeout(() => {
            button.style.opacity = '0.35';
            outline.style.opacity = '0.35';
        }, AUTO_HIDE_DELAY));
    };

    let clearAutoHideTimer = function(button) {
        if (mouseTimers.has(button)) {
            clearTimeout(mouseTimers.get(button));
            mouseTimers.delete(button);
        }
    };

    let createImageOutline = function(img) {
        if (imageOutlines.has(img)) return imageOutlines.get(img);

        let outline = document.createElement('div');
        outline.style.position = 'absolute';
        outline.style.zIndex = '999998';
        outline.style.border = '2px dashed rgba(128, 128, 128, 0.6)';
        outline.style.pointerEvents = 'none';
        outline.style.transition = 'opacity 0.3s ease';
        outline.style.display = 'none';

        document.body.appendChild(outline);
        imageOutlines.set(img, outline);
        return outline;
    };

    // 清理已消失的图片控制元素
    let cleanupOrphanedControls = function() {
        const controlsToRemove = [];
        const outlinesToRemove = [];

        // 检查每个图片是否仍然存在且可见
        imageControls.forEach((button, img) => {
            if (!img || !img.isConnected || img.offsetWidth === 0 || img.offsetHeight === 0) {
                controlsToRemove.push(img);
            }
        });

        // 清理孤立的控制元素
        controlsToRemove.forEach(img => {
            const button = imageControls.get(img);
            const outline = imageOutlines.get(img);

            if (button) {
                // 清理定时器
                clearAutoHideTimer(button);

                // 移除DOM元素
                if (button.parentNode) {
                    button.parentNode.removeChild(button);
                }
                imageControls.delete(img);
            }

            if (outline) {
                if (outline.parentNode) {
                    outline.parentNode.removeChild(outline);
                }
                imageOutlines.delete(img);
            }
        });
    };

    // 简化的位置更新（包含清理功能）
    let updatePositions = throttle(function() {
        // 先清理孤立的控制元素
        cleanupOrphanedControls();

        imageControls.forEach((button, img) => {
            if (!img || !img.isConnected) return;

            const rect = img.getBoundingClientRect();
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            // 检查图片是否仍然可见
            if (rect.width === 0 || rect.height === 0 || img.offsetWidth === 0 || img.offsetHeight === 0) {
                return;
            }

            // 更新按钮位置
            button.style.left = (rect.left + scrollX + 8) + 'px';
            button.style.top = (rect.top + scrollY + 8) + 'px';

            // 更新轮廓位置
            const outline = imageOutlines.get(img);
            if (outline) {
                outline.style.left = (rect.left + scrollX - 3) + 'px';
                outline.style.top = (rect.top + scrollY - 3) + 'px';
                outline.style.width = (rect.width + 4) + 'px';
                outline.style.height = (rect.height + 4) + 'px';
            }
        });
    }, 200);

    let createImageControlButton = function(img) {
        if (imageControls.has(img)) return;

        let button = document.createElement('div');
        button.innerText = '显';
        button.title = '点击隐藏图片';

        let outline = createImageOutline(img);

        // 样式设置
        button.style.position = 'absolute';
        button.style.zIndex = '999999';
        button.style.padding = '4px 8px';
        button.style.background = 'rgba(96, 96, 96, 0.8)';
        button.style.border = '1px solid rgba(128, 128, 128, 0.9)';
        button.style.color = 'rgba(240, 240, 240, 1)';
        button.style.fontSize = '12px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.lineHeight = '1.2';
        button.style.textAlign = 'center';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '4px';
        button.style.transition = 'opacity 0.3s ease';
        button.style.userSelect = 'none';

        // 初始位置
        updatePositions();

        // 事件处理
        button.addEventListener('mouseenter', function() {
            clearAutoHideTimer(button);
            button.style.opacity = '1';
            button.style.background = 'rgba(128, 128, 128, 0.9)';
            outline.style.opacity = '1';
        });

        button.addEventListener('mouseleave', function() {
            startAutoHideTimer(button, outline);
            button.style.background = 'rgba(96, 96, 96, 0.8)';
            outline.style.opacity = '0.3';
        });

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSingleImage(img, button, outline);
            clearAutoHideTimer(button);
            button.style.opacity = '1';
        });

        document.body.appendChild(button);
        imageControls.set(img, button);

        // 初始状态
        if (img.style.visibility !== 'hidden') {
            img.style.visibility = 'hidden';
            img.style.transition = 'filter 0.6s ease';
            img.style.filter = 'blur(14px)';
            outline.style.display = 'block';
        }

        startAutoHideTimer(button, outline);
    };

    // 查找所有图片
    let findAllImages = function() {
        let images = [];

        // 标准图片
        document.querySelectorAll('img').forEach(img => {
            if (!imageControls.has(img) && img.offsetWidth > 0 && img.offsetHeight > 0) {
                images.push(img);
            }
        });

        return images;
    };

    let imgHiden = function() {
        const images = findAllImages();
        images.forEach(img => {
            createImageControlButton(img);
        });

        // 更新所有位置并清理孤立的控制元素
        updatePositions();
    };

    let imgShown = function() {
        imageControls.forEach((button, img) => {
            img.style.visibility = 'visible';
            img.style.filter = 'none';
            if (button.parentNode) {
                button.parentNode.removeChild(button);
            }
        });

        imageOutlines.forEach((outline) => {
            if (outline.parentNode) {
                outline.parentNode.removeChild(outline);
            }
        });

        mouseTimers.forEach(timer => clearTimeout(timer));
        mouseTimers.clear();
        imageControls.clear();
        imageOutlines.clear();
    };

    // 启动位置更新监听
    let startPositionUpdates = function() {
        // 监听滚动
        window.addEventListener('scroll', updatePositions, { passive: true });
        // 监听窗口大小变化
        window.addEventListener('resize', updatePositions, { passive: true });
        // 监听图片加载
        document.addEventListener('load', function(e) {
            if (e.target.tagName === 'IMG') {
                setTimeout(updatePositions, 100);
            }
        }, true);
    };

    let handleButtonClick = function() {
        if (window.imgHidenSet === null) {
            clearInterval(window.imgShownSet);
            window.imgShownSet = null;
            startPositionUpdates();
            imgHiden();
            saveStorageList();
            window.imgHidenSet = setInterval(imgHiden, 500);
        } else {
            clearInterval(window.imgHidenSet);
            window.imgHidenSet = null;
            imgShown();
            deleteStorageList();
            window.imgShownSet = setInterval(imgShown, 500);
        }
    };

    let noDetectStorageList = function() {
        if (localStorage.getItem('nopicValueList') !== null) {
            let valueList = localStorage.getItem('nopicValueList').split(',');
            if (valueList.indexOf(location.host) === -1) return true;
        } else {
            localStorage.setItem('nopicValueList', ['fxalll']);
            return true;
        }
        return false;
    };

    let saveStorageList = function() {
        if (noDetectStorageList()) {
            let valueList = localStorage.getItem('nopicValueList').split(',');
            if (!valueList.includes(location.host)) {
                valueList.push(location.host);
                localStorage.setItem('nopicValueList', valueList);
            }
        }
    };

    let deleteStorageList = function() {
        if (!noDetectStorageList()) {
            let valueList = localStorage.getItem('nopicValueList').split(',');
            valueList = valueList.filter(value => value !== location.host);
            localStorage.setItem('nopicValueList', valueList);
        }
    };

    // 初始化
    if (!noDetectStorageList()) {
        startPositionUpdates();
        imgHiden();
        window.imgHidenSet = setInterval(imgHiden, 500);
    }

    let button = document.createElement('div');
    button.innerText = "◀";
    button.setAttribute("id", "myButton");
    button.style.color = "#555";
    button.style.padding = "10px 15px";
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.left = "3px";
    button.style.textAlign = "center";
    button.style.alignContent = "center";
    button.style.background = "rgba(128, 128, 128, 0.4)";
    button.style.borderRadius = "15px";
    button.style.border = "2px solid rgba(128, 128, 128, 0.7)";
    button.style.cursor = "pointer";
    button.style.transform = "translate3d(30%,0,0)";
    button.style.transition = "all 0.1s ease, backdrop-filter 0.4s ease, background 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease";
    button.style.backdropFilter = "blur(15px) saturate(1.2)";
    button.style.webkitBackdropFilter = "blur(15px) saturate(1.2)";
    button.style.userSelect = "none";
    button.style.zIndex = "999999999999";

    button.addEventListener('mouseover', mouseover);
    button.addEventListener('mouseout', mouseout);
    button.addEventListener('mousedown', dragStart, false);

    function mouseover() {
        button.style.boxShadow = "0 0 20px rgba(128, 128, 128, 0.8)";
        button.style.background = "rgba(160, 160, 160, 0.8)";
        button.style.color = "#fff";
        button.style.border = "2px solid rgba(200, 200, 200, 1)";
        button.style.backdropFilter = "blur(20px) saturate(1.5)";
        button.style.webkitBackdropFilter = "blur(20px) saturate(1.5)";
        button.innerText = "图片显隐";
        button.style.transform = "translateX(0px)";
        setTranslate(0+"%",currentY+"px",button);
    }

    function mouseout() {
        button.style.boxShadow = '';
        button.style.background = "rgba(128, 128, 128, 0.3)";
        button.style.color = "#555";
        button.style.border = "2px solid rgba(128, 128, 128, 0.6)";
        button.style.backdropFilter = "blur(15px) saturate(1.2)";
        button.style.webkitBackdropFilter = "blur(15px) saturate(1.2)";
        button.innerText = "◀";
        button.style.transform = "translateX(30%)";
        setTranslate(30+"%",currentY+"px",button);
    }

    function dragStart(e) {
        startTime = e.timeStamp;
        initialX = e.clientX;
        initialY = e.clientY - yOffset;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd, false);
        e.preventDefault();
        randomNumSet = Math.round(Math.random()*(yanEmoji.length-1));
    }

    function dragEnd(e) {
        if (startTime) {
            let diffTime = e.timeStamp - startTime;
            diffTime < 150 && handleButtonClick();
            startTime = 0;
        }
        initialX = currentX;
        initialY = currentY;
        mouseout();
        document.removeEventListener('mousemove', drag);
    }

    function drag(e) {
        changeFace(randomNumSet,button);
        button.style.color = "#fff";
        button.style.border = "4px dashed rgba(128, 128, 128, 0.8)";
        button.style.background = "rgba(100, 100, 100, 0.6)";
        button.style.backdropFilter = "blur(25px) saturate(1.8)";
        button.style.webkitBackdropFilter = "blur(25px) saturate(1.8)";
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX+"px", currentY+"px", button);
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + ", " + yPos + ", 0)";
    }

    function changeFace(randomNum,el) {
        el.innerText = yanEmoji[randomNum];
    }

    document.body.appendChild(button);
})();