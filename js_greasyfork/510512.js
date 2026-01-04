// ==UserScript==
// @name         不要画像削除（アリババ用）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  アリババで類似商品やオススメ商品の画像を削除し、ダウンロード時の商品見極めを簡略化。スクロールする前に全画像をロード。
// @license      MIT
// @match        https://detail.1688.com/offer/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510512/%E4%B8%8D%E8%A6%81%E7%94%BB%E5%83%8F%E5%89%8A%E9%99%A4%EF%BC%88%E3%82%A2%E3%83%AA%E3%83%90%E3%83%90%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/510512/%E4%B8%8D%E8%A6%81%E7%94%BB%E5%83%8F%E5%89%8A%E9%99%A4%EF%BC%88%E3%82%A2%E3%83%AA%E3%83%90%E3%83%90%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadImages() {
        document.querySelectorAll('.content-detail img[data-lazyload-src]').forEach(function(img) {
            const originalWidth = img.style.width;
            const originalHeight = img.style.height;

            img.src = img.getAttribute('data-lazyload-src');
            img.removeAttribute('data-lazyload-src');

            img.style.width = originalWidth || 'auto';
            img.style.height = originalHeight || 'auto';
            img.style.opacity = '1';
            img.style.visibility = 'visible';
        });
    }

    function disableScrollHandlers() {
        window.onscroll = null;
        document.onscroll = null;
        window.addEventListener('scroll', function(event) {
        }, true);
    }

    window.addEventListener('load', function() {
        loadImages();
        disableScrollHandlers();
    });

    let isScriptActive = false;
    let isHighlightActive = true;

    const selectorsToRemove = [
        '.sdmap-dynamic-offer-list',
        '.od-pc-offer-recommend',
        '.od-pc-offer-combi-recommend',
        '.od-pc-offer-top-sales',
        '.cht-recommends-detail',
        '.m-auto',
        '.activity-banner-img',
        'div[data-darksite-inline-background-image]',
        'div[style*="background-color: #ffffff;"]',
        'div[id="hd_0_container_0"] > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2)',
        'div[align="hunpi-bf-3690"][style*="width: 790px;"]',
        'a[href^="http://detail.1688.com/offer/"]',
        'div[style*="border-radius: 30px"][style*="width: 60px"][style*="height: 60px"]',
        'map',
        'area[href]',
        'div[style*="width: 164px;"][style*="height: 108px;"][style*="position: absolute;"][style*="top: 22px;"][style*="right: -82px;"][style*="z-index: 1;"]',
        'div[style*="height: 82px;"][style*="width: 162px;"]',
        'img[style*="height: 14px"][style*="margin: 0px"][style*="padding: 0px"]',
    ];

    function removeElements() {
        if (!isScriptActive) return;

        const tables = document.querySelectorAll('table[border="0"]');
        tables.forEach((table) => {
            const productImages = table.querySelectorAll('.desc-img-loaded');
            let shouldRemoveTable = false;

            productImages.forEach((img) => {
                const width = img.offsetWidth;
                if (width <= 301) {
                    shouldRemoveTable = true;
                }
            });

            if (shouldRemoveTable) {
                table.remove();
            }
        });

        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (!element.closest('div.sku-item-wrapper') && !element.closest('div[style="width: 790px; position: relative;"]')) {
                    element.remove();
                }
            });
        });

        const descImages = document.querySelectorAll('.desc-img-loaded');
        descImages.forEach((img) => {
            const width = img.offsetWidth;
            const height = img.offsetHeight;
            if (width <= 200 && height <= 200) {
                img.remove();
            }
        });

        const specialDivs = document.querySelectorAll('div[style*="background: url"][style*="width: 164px"][style*="height: 108px"]');
        specialDivs.forEach((div) => {
            div.remove();
        });

        const toggleButton = document.getElementById('toggleButton');
        toggleButton.innerText = '削除済み';
        toggleButton.style.backgroundColor = '#B0BEC5';
        toggleButton.style.cursor = 'default';
        toggleButton.disabled = true;
    }

    function highlightElements() {
        if (!isHighlightActive) return;

        const tables = document.querySelectorAll('table[border="0"]');
        tables.forEach((table) => {
            const productImages = table.querySelectorAll('.desc-img-loaded');
            let shouldHighlightTable = false;

            productImages.forEach((img) => {
                const width = img.offsetWidth;
                if (width <= 301) {
                    shouldHighlightTable = true;
                }
            });

            if (shouldHighlightTable) {
                table.style.position = 'relative';
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                overlay.style.pointerEvents = 'none';
                overlay.classList.add('highlight-overlay');
                table.appendChild(overlay);
            }
        });

        selectorsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (!element.classList.contains('highlight-overlay')) {
                    element.style.position = 'relative';
                    const overlay = document.createElement('div');
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    overlay.style.pointerEvents = 'none';
                    overlay.classList.add('highlight-overlay');
                    element.appendChild(overlay);
                }
            });
        });

        const imgElements = document.querySelectorAll('img[usemap]');
        imgElements.forEach((imgElement) => {
            if (!imgElement.classList.contains('highlight-overlay')) {
                imgElement.style.position = 'relative';
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.3)';
                overlay.style.pointerEvents = 'none';
                overlay.classList.add('highlight-overlay');
                imgElement.appendChild(overlay);
            }
        });

        highlightMapAreas();
    }

    function highlightMapAreas() {
        const areas = document.querySelectorAll('area[href]');
        areas.forEach((area) => {
            const coords = area.coords.split(',').map(Number);
            const img = document.querySelector(`img[usemap="#${area.parentElement.name}"]`);

            if (img && coords.length === 4) {
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = `${coords[1]}px`;
                overlay.style.left = `${coords[0]}px`;
                overlay.style.width = `${coords[2] - coords[0]}px`;
                overlay.style.height = `${coords[3] - coords[1]}px`;
                overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                overlay.style.pointerEvents = 'none';
                overlay.classList.add('highlight-overlay');
                img.parentElement.appendChild(overlay);
            }
        });
    }

    function removeHighlight() {
        const overlays = document.querySelectorAll('.highlight-overlay');
        overlays.forEach(overlay => {
            overlay.remove();
        });
    }

    function toggleScript() {
        isScriptActive = !isScriptActive;
        const toggleButton = document.getElementById('toggleButton');

        if (isScriptActive) {
            removeElements();
        }
    }

    function toggleHighlight() {
        isHighlightActive = !isHighlightActive;
        const highlightButton = document.getElementById('highlightButton');

        if (isHighlightActive) {
            highlightButton.innerText = 'ハイライト停止';
            highlightElements();
        } else {
            highlightButton.innerText = 'ハイライト開始';
            removeHighlight();
        }
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'toggleButton';
        button.innerText = '画像を削除';
        button.style.position = 'fixed';
        button.style.bottom = '70px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'not-allowed';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.disabled = true;

        button.addEventListener('click', toggleScript);

        document.body.appendChild(button);
    }

    function createHighlightButton() {
        const button = document.createElement('button');
        button.id = 'highlightButton';
        button.innerText = 'ハイライト停止';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#FF9800';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'not-allowed';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.fontSize = '14px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.disabled = true;

        button.addEventListener('click', toggleHighlight);

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        highlightElements();
        const toggleButton = document.getElementById('toggleButton');
        const highlightButton = document.getElementById('highlightButton');

        toggleButton.disabled = false;
        toggleButton.style.cursor = 'pointer';

        highlightButton.disabled = false;
        highlightButton.style.cursor = 'pointer';
    });

    createToggleButton();
    createHighlightButton();
})();
