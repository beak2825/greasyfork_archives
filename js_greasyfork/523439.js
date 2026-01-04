// ==UserScript==
// @name         🏆 网页继续教育万能自动播放视频倍数，支持国家开放大学|成人本科｜电中｜学起｜弘成｜继续教育｜教师｜会计｜医生｜华医网|好医生|公需课｜专业课｜网课等均部分支持需要尝试
// @namespace    一只蚂蚁而已
// @version      2.1.4
// @license      MIT
// @description  支持国家开放大学、成人本科、继续教育、教师、会计、医生等平台的视频自动播放和倍速控制。
// @author       各种继续教育学习
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523439/%F0%9F%8F%86%20%E7%BD%91%E9%A1%B5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%B8%87%E8%83%BD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%EF%BC%8C%E6%94%AF%E6%8C%81%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%7C%E6%88%90%E4%BA%BA%E6%9C%AC%E7%A7%91%EF%BD%9C%E7%94%B5%E4%B8%AD%EF%BD%9C%E5%AD%A6%E8%B5%B7%EF%BD%9C%E5%BC%98%E6%88%90%EF%BD%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BD%9C%E6%95%99%E5%B8%88%EF%BD%9C%E4%BC%9A%E8%AE%A1%EF%BD%9C%E5%8C%BB%E7%94%9F%EF%BD%9C%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A5%BD%E5%8C%BB%E7%94%9F%7C%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BD%9C%E4%B8%93%E4%B8%9A%E8%AF%BE%EF%BD%9C%E7%BD%91%E8%AF%BE%E7%AD%89%E5%9D%87%E9%83%A8%E5%88%86%E6%94%AF%E6%8C%81%E9%9C%80%E8%A6%81%E5%B0%9D%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/523439/%F0%9F%8F%86%20%E7%BD%91%E9%A1%B5%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%B8%87%E8%83%BD%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E6%95%B0%EF%BC%8C%E6%94%AF%E6%8C%81%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%7C%E6%88%90%E4%BA%BA%E6%9C%AC%E7%A7%91%EF%BD%9C%E7%94%B5%E4%B8%AD%EF%BD%9C%E5%AD%A6%E8%B5%B7%EF%BD%9C%E5%BC%98%E6%88%90%EF%BD%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%EF%BD%9C%E6%95%99%E5%B8%88%EF%BD%9C%E4%BC%9A%E8%AE%A1%EF%BD%9C%E5%8C%BB%E7%94%9F%EF%BD%9C%E5%8D%8E%E5%8C%BB%E7%BD%91%7C%E5%A5%BD%E5%8C%BB%E7%94%9F%7C%E5%85%AC%E9%9C%80%E8%AF%BE%EF%BD%9C%E4%B8%93%E4%B8%9A%E8%AF%BE%EF%BD%9C%E7%BD%91%E8%AF%BE%E7%AD%89%E5%9D%87%E9%83%A8%E5%88%86%E6%94%AF%E6%8C%81%E9%9C%80%E8%A6%81%E5%B0%9D%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.hasVideoControlScriptRun) {
        return;
    }
    window.hasVideoControlScriptRun = true;

    let currentRate = 1.0;
    let isMinimized = false;
    let isClosed = false;
    let modal;

    function setPlaybackRate(rate) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.playbackRate = rate;
            video.muted = true; // 自动静音
            if (!video.playing) {
                video.play().catch(err => {});
            }
        });
    }

    function checkAndPlayVideo() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.paused &&!video.ended) {
                video.play().catch(err => {});
            }
        });
    }

    function observeVideoChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    setPlaybackRate(currentRate);
                    checkAndPlayVideo();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function createControlModal() {
        const modal = document.createElement('div');
        modal.id = 'videoControlModal';
        modal.style.position = 'fixed';
        modal.style.left = '10px';
        modal.style.top = '10px';
        modal.style.backgroundColor = '#ffffff';
        modal.style.padding = '15px';
        modal.style.zIndex = '1000';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        modal.style.width = '280px';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.border = '1px solid #e0e0e0';
        modal.style.transition = 'all 0.3s ease';
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        }, 10);

        const title = document.createElement('h3');
        title.textContent = '视频倍速控制';
        title.style.margin = '0 0 15px 0';
        title.style.textAlign = 'center';
        title.style.color = '#333333';
        title.style.fontSize = '18px';
        modal.appendChild(title);

        const rateInput = document.createElement('input');
        rateInput.type = 'number';
        rateInput.min = '0.1';
        rateInput.max = '16';
        rateInput.step = '0.1';
        rateInput.value = currentRate;
        rateInput.style.width = '100%';
        rateInput.style.padding = '8px';
        rateInput.style.marginBottom = '10px';
        rateInput.style.border = '1px solid #e0e0e0';
        rateInput.style.borderRadius = '5px';
        rateInput.style.fontSize = '14px';
        rateInput.style.outline = 'none';
        rateInput.style.transition = 'border-color 0.3s ease';
        rateInput.addEventListener('focus', () => {
            rateInput.style.borderColor = '#007bff';
        });
        rateInput.addEventListener('blur', () => {
            rateInput.style.borderColor = '#e0e0e0';
        });
        modal.appendChild(rateInput);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = '设置倍速';
        confirmButton.style.width = '100%';
        confirmButton.style.padding = '8px';
        confirmButton.style.marginBottom = '10px';
        confirmButton.style.backgroundColor = '#007bff';
        confirmButton.style.color = '#ffffff';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.fontSize = '14px';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.transition = 'background-color 0.3s ease';
        confirmButton.onclick = function() {
            const newRate = parseFloat(rateInput.value);
            if (newRate >= 0.1 && newRate <= 16) {
                currentRate = newRate;
                setPlaybackRate(currentRate);
            } else {
                alert('倍速必须在 0.1 到 16 之间');
            }
        };
        confirmButton.addEventListener('mouseenter', () => {
            confirmButton.style.backgroundColor = '#0056b3';
        });
        confirmButton.addEventListener('mouseleave', () => {
            confirmButton.style.backgroundColor = '#007bff';
        });
        modal.appendChild(confirmButton);

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = isMinimized? '恢复' : '最小化';
        minimizeButton.style.width = '48%';
        minimizeButton.style.marginRight = '4%';
        minimizeButton.style.padding = '8px';
        minimizeButton.style.backgroundColor = '#6c757d';
        minimizeButton.style.color = '#ffffff';
        minimizeButton.style.border = 'none';
        minimizeButton.style.borderRadius = '5px';
        minimizeButton.style.fontSize = '14px';
        minimizeButton.style.cursor = 'pointer';
        minimizeButton.style.transition = 'background-color 0.3s ease';
        minimizeButton.onclick = function() {
            isMinimized =!isMinimized;
            if (isMinimized) {
                modal.style.height = '50px';
                modal.style.overflow = 'hidden';
                minimizeButton.textContent = '恢复';
            } else {
                modal.style.height = 'auto';
                modal.style.overflow = 'visible';
                minimizeButton.textContent = '最小化';
            }
        };
        minimizeButton.addEventListener('mouseenter', () => {
            minimizeButton.style.backgroundColor = '#5a6268';
        });
        minimizeButton.addEventListener('mouseleave', () => {
            minimizeButton.style.backgroundColor = '#6c757d';
        });
        modal.appendChild(minimizeButton);

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.width = '48%';
        closeButton.style.padding = '8px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = '#ffffff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.fontSize = '14px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.transition = 'background-color 0.3s ease';
        closeButton.onclick = function() {
            isClosed = true;
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        };
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.backgroundColor = '#c82333';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.backgroundColor = '#dc3545';
        });
        modal.appendChild(closeButton);

        const infoText = document.createElement('p');
        infoText.style.marginTop = '13px';
        infoText.style.fontSize = '13px';
        infoText.style.color = '#666666';
        infoText.innerHTML = `
            <strong>提示：</strong><br>
            1. 倍速范围：0.1x - 16x<br>
            2. 部分平台可能不支持倍速播放（设置强制倍数）<br>
            3. 视频会自动尝试播放自带静音<br>
            4. 按F2键可快速显示/隐藏控制面板<br>
            5. 需要进行托管（帮忙学习）的可以联系<id="studyLink" style="color: red; text-decoration: none;">study-088</a><br>
            <div style="text-align: center;"><a href="https://h5.lot-ml.com/ProductEn/Index/58a898ab0af57327" style="color: blue; text-decoration: none;">超值流量卡免费申请包邮代到家!</a></div>
        `;
        modal.appendChild(infoText);

        const tipLabel = document.createElement('div');
        tipLabel.textContent = '脚本并不适用所有的网页，自行尝试使用！   感谢理解！';
        tipLabel.style.textAlign = 'center'; 
        tipLabel.style.marginTop = '10px'; 
        tipLabel.style.fontSize = '14px'; 
        tipLabel.style.color = '#666666'; 
        tipLabel.style.fontWeight = 'bold'; 
        modal.appendChild(tipLabel); 

        return modal;
    }

    function toggleModal() {
        if (!modal) return;
        
        if (modal.style.display === 'none' || modal.style.display === '') {
            modal.style.display = 'block';
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.transform = 'translateY(0)';
            }, 10);
            isClosed = false;
        } else {
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            isClosed = true;
        }
    }

    function init() {
        if (document.querySelector('#videoControlModal')) {
            return;
        }

        modal = createControlModal();
        document.body.appendChild(modal);

        setPlaybackRate(currentRate);
        observeVideoChanges();
        setInterval(checkAndPlayVideo, 1000);
        
        // Add F2 key listener
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F2') {
                toggleModal();
            }
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();