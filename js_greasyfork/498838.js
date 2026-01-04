// ==UserScript==
// @name         Fetch Top Banner Info
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  Fetch Top Banner Info on Double Click
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oppoer.me
// @grant        none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498838/Fetch%20Top%20Banner%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/498838/Fetch%20Top%20Banner%20Info.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // This will hold the element that we are currently highlighting
    let highlightedElement = null;
    // Create a blue overlay
    let overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';
    overlay.style.zIndex = '9998';
    overlay.style.pointerEvents = 'none'; // Let mouse events pass through

    document.body.appendChild(overlay);

    // Function to handle the data extraction and display
    function fetchBannerData(event) {
        event.preventDefault(); // Prevent any default action such as link navigation
        var firstHeroBanner = event.target.closest('.aem-Grid.aem-Grid--12 .hero-banner.aem-GridColumn.aem-GridColumn--default--12');

        if (firstHeroBanner) {
            var pictureElement = firstHeroBanner.querySelector('picture');
            var result = '';

            if (pictureElement) {
                var sourceElements = pictureElement.querySelectorAll('source');

                sourceElements.forEach(source => {
                    if (source.getAttribute('type') !== 'image/webp') {
                        result += source.getAttribute('srcset') + '\n';
                    }
                });
            } else {
                alert('未找到 <picture> 元素');
            }

            var imgElement = firstHeroBanner.querySelector('img.hero-banner-img-bg');
            if (imgElement) {
                result += '\n' + imgElement.getAttribute('src');
            } else {
                alert('未找到 <img class="hero-banner-img-bg"> 元素');
            }

            // 创建弹窗元素
            var popup = document.createElement('div');
            popup.classList.add('popup');
            popup.style.whiteSpace = 'pre-wrap'; // 保持文本排版
            popup.style.textAlign = 'left'; // 左对齐
            popup.textContent = result + '\n结果已复制到粘贴板！';

            // 创建确定按钮
            var closeButton = document.createElement('button');
            closeButton.textContent = '确定';

            // 将确定按钮添加到弹窗中
            popup.appendChild(closeButton);

            // 将弹窗添加到页面中
            document.body.appendChild(popup);

            // 定时2秒后关闭弹窗
            setTimeout(function () {
                popup.style.display = 'none';
            }, 2000);

            // 点击确定按钮关闭弹窗
            closeButton.addEventListener('click', function () {
                popup.style.display = 'none';
            });

            copyToClipboard(result);
        } else {
            alert('未找到 .hero-banner 元素');
        }
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to highlight element on mouseover
    function highlightElement(event) {
        let target = event.target.closest('.aem-Grid.aem-Grid--12 .hero-banner.aem-GridColumn.aem-GridColumn--default--12');
        if (target) {
            if (highlightedElement !== target) {
                highlightedElement = target;
                let rect = target.getBoundingClientRect();
                overlay.style.width = rect.width + 'px';
                overlay.style.height = rect.height + 'px';
                overlay.style.top = rect.top + 'px';
                overlay.style.left = rect.left + 'px';
                overlay.style.display = 'block';
            }
        } else {
            highlightedElement = null;
            overlay.style.display = 'none';
        }
    }

    // Add event listener for mouseover and double click on the document
    document.addEventListener('mouseover', highlightElement, true);
    document.addEventListener('dblclick', function(event) {
        var target = event.target.closest('.aem-Grid.aem-Grid--12 .hero-banner.aem-GridColumn.aem-GridColumn--default--12');
        if (target) {
            fetchBannerData(event);
        }
    }, true);

    // Ensure that click events do not propagate to prevent accidental navigation
    document.addEventListener('click', function(event) {
        if (event.target.closest('.aem-Grid.aem-Grid--12 .hero-banner.aem-GridColumn.aem-GridColumn--default--12')) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);

    // CSS styles for the popup
    var styles = document.createElement('style');
    styles.innerHTML = `
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff200;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            text-align: center;
        }

        .popup button {
            margin-top: 10px;
        }
    `;
    document.head.appendChild(styles);
})();