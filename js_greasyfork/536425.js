// ==UserScript==
// @name          kone 썸네일 + 댓글 개선
// @namespace     http://tampermonkey.net/
// @version       6.0
// @description   마우스 오버시 썸네일 표시 + 댓글 자동 확장
// @author        김머시기
// @match         https://kone.gg/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/536425/kone%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%2B%20%EB%8C%93%EA%B8%80%20%EA%B0%9C%EC%84%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/536425/kone%20%EC%8D%B8%EB%84%A4%EC%9D%BC%20%2B%20%EB%8C%93%EA%B8%80%20%EA%B0%9C%EC%84%A0.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    let thumbSize = await GM_getValue('thumbSize', 400);
    let autoSlide = await GM_getValue('autoSlide', false);
    const MenuID = [null, null];
    const initializedLinks = new WeakSet();

    function updateMenu() {
        if (MenuID[1]) GM_unregisterMenuCommand(MenuID[1]);
        MenuID[1] = GM_registerMenuCommand(
            `자동 슬라이드　: ${autoSlide === false ? '꺼짐' : `${(autoSlide / 1000).toFixed(1)}초`}`,
            async () => {
                const states = [false, 1500, 2500, 3500];
                let idx = states.indexOf(autoSlide);
                autoSlide = states[(idx + 1) % states.length];
                await GM_setValue('autoSlide', autoSlide);
                updateMenu();
            },
            { autoClose: false }
        );

        if (MenuID[0]) GM_unregisterMenuCommand(MenuID[0]);
        MenuID[0] = GM_registerMenuCommand(
            `썸네일 크기　　: ${thumbSize}px`,
            async () => {
                const sizes = [200, 320, 400, 480, 720];
                let idx = sizes.indexOf(thumbSize);
                thumbSize = sizes[(idx + 1) % sizes.length];
                await GM_setValue('thumbSize', thumbSize);
                updateMenu();
            },
            { autoClose: false }
        );
    }

    updateMenu();

    const previewBox = document.createElement('div');
    const previewImage = document.createElement('img');
    let currentIframe = null;
    let hoverId = 0;
    let currentIndex = 0;
    let imageList = [];
    let isPreviewVisible = false;
    let hoverTimer = null;
    let autoSlideTimer = null;

    Object.assign(previewBox.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'none',
        border: '1px solid #ccc',
        background: '#fff',
        padding: '4px',
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        borderRadius: '6px'
    });

    Object.assign(previewImage.style, {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        display: 'block'
    });

    previewBox.appendChild(previewImage);
    document.body.appendChild(previewBox);

    function applySize() {
        previewBox.style.maxWidth = thumbSize + 'px';
        previewBox.style.maxHeight = thumbSize + 'px';
        previewImage.style.maxWidth = thumbSize + 'px';
        previewImage.style.maxHeight = thumbSize + 'px';
    }

    function updateImage() {
        if (imageList.length > 0) {
            previewImage.src = imageList[currentIndex];
            previewBox.style.display = 'block';
        } else {
            hidePreview();
        }
    }

    function startAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        if (typeof autoSlide === 'number' && imageList.length > 1) {
            autoSlideTimer = setInterval(() => {
                currentIndex = (currentIndex + 1) % imageList.length;
                updateImage();
            }, autoSlide);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
    }

    function onKeyDown(e) {
        if (!isPreviewVisible) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % imageList.length;
            } else {
                currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
            }
            updateImage();
        }
    }

    function extractImagesFromIframeDocument(doc) {
        const proseContainer = doc.querySelector('div.prose-container');
        if (!proseContainer || !proseContainer.shadowRoot) {
            return [];
        }
        const contentInShadow = proseContainer.shadowRoot.querySelector('div.dark');
        if (!contentInShadow) {
            return [];
        }
        return [...contentInShadow.querySelectorAll('img')]
            .map(img => img.src)
            .filter(src => (
                src && !/kone-logo|default|placeholder|data:image/.test(src)
            ));
    }

    function moveHandler(e) {
        const padding = 20;
        const boxW = previewBox.offsetWidth || thumbSize;
        const boxH = previewBox.offsetHeight || thumbSize;

        let left = e.clientX + padding;
        let top = e.clientY + padding;

        if (left + boxW > window.innerWidth) left = e.clientX - boxW - padding;
        if (top + boxH > window.innerHeight) top = e.clientY - boxH - padding;

        previewBox.style.left = `${Math.max(0, left)}px`;
        previewBox.style.top = `${Math.max(0, top)}px`;
    }

    function hidePreview() {
        if (!isPreviewVisible && previewBox.style.display === 'none' && !currentIframe) {
            return;
        }

        previewBox.style.display = 'none';
        previewImage.src = '';

        if (currentIframe) {
            currentIframe.src = 'about:blank';
            currentIframe.remove();
            currentIframe = null;
        }

        imageList = [];
        isPreviewVisible = false;
        stopAutoSlide();
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('keydown', onKeyDown);
        hoverId++;
    }

    function hideElementInIframe(doc, selector) {
        try {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.offsetParent !== null) {
                    el.style.setProperty('display', 'none', 'important');
                }
            });
        } catch (e) { }
    }

    async function handleModalsInIframeKone(doc) {
        try {
            const nsfwOverlayContainer = doc.querySelector('div.relative.min-h-60 > div.absolute.w-full.h-full.backdrop-blur-2xl');
            if (nsfwOverlayContainer && nsfwOverlayContainer.offsetParent !== null) {
                const viewContentButton = nsfwOverlayContainer.querySelector('div.flex.gap-4 button:nth-child(2)');
                if (viewContentButton && viewContentButton.textContent?.includes('콘텐츠 보기')) {
                    viewContentButton.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    hideElementInIframe(doc, '.age-verification-popup');
                    hideElementInIframe(doc, '.content-overlay.block');
                }
            } else {
                hideElementInIframe(doc, '.age-verification-popup');
                hideElementInIframe(doc, '.content-overlay.block');
            }
        } catch (e) { }
    }

    function showPreviewAtMouse(event, url, currentRequestHoverId) {
        if (currentIframe) {
            currentIframe.src = 'about:blank';
            currentIframe.remove();
            currentIframe = null;
        }

        currentIframe = document.createElement('iframe');
        Object.assign(currentIframe.style, {
            position: 'fixed',
            left: '-9999px',
            width: '1px',
            height: '1px',
            visibility: 'hidden'
        });
        document.body.appendChild(currentIframe);

        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        previewBox.style.display = 'block';
        moveHandler(event);

        currentIframe.onload = async () => {
            if (currentRequestHoverId !== hoverId) {
                return;
            }
            try {
                const doc = currentIframe.contentDocument || currentIframe.contentWindow.document;
                if (doc) {
                    await handleModalsInIframeKone(doc);
                    imageList = extractImagesFromIframeDocument(doc);
                    currentIndex = 0;
                    applySize();
                    updateImage();
                    isPreviewVisible = true;
                } else {
                    hidePreview();
                }
            } catch (e) {
                hidePreview();
            }
        };
        currentIframe.onerror = () => {
            if (currentRequestHoverId === hoverId) {
                hidePreview();
            }
        };
        currentIframe.src = url;

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('keydown', onKeyDown);
    }

    function handleMouseEnter(event, element, href) {
        clearTimeout(hoverTimer);
        hoverId++;
        const currentRequestHoverId = hoverId;

        hoverTimer = setTimeout(() => {
            if (currentRequestHoverId !== hoverId) return;
            const fullUrl = href.startsWith('http') ? href : location.origin + href;
            showPreviewAtMouse(event, fullUrl, currentRequestHoverId);
        }, 100);
    }

    function attachEvents() {
        const allLinks = document.querySelectorAll('a[href*="/s/"]');
        allLinks.forEach(link => {
            if (initializedLinks.has(link)) return;
            initializedLinks.add(link);

            link.addEventListener('mouseenter', e => handleMouseEnter(e, link, link.getAttribute('href')));
            link.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                hidePreview();
            });
            link.addEventListener('click', hidePreview);
        });
    }

    new MutationObserver(attachEvents).observe(document.body, { childList: true, subtree: true });
    attachEvents();

    function clickAllExpandButtons() {
        const expandButtons = document.querySelectorAll('button');
        let clickedAny = false;

        expandButtons.forEach(button => {
            try {
                const buttonText = button.textContent.trim();
                const isNCommentsButton = /^\d+개의 댓글$/.test(buttonText);

                if (isNCommentsButton && button.offsetParent !== null) {
                    button.click();
                    clickedAny = true;
                }
            } catch (e) {
                // 오류는 무시하고 다음 버튼으로 진행
            }
        });

        if (clickedAny) {
            setTimeout(clickAllExpandButtons, 500);
        }
    }

    let commentFixTimer = null;
    function runCommentFix() {
        clickAllExpandButtons();
    }

    const styleFix = document.createElement('style');
    document.head.appendChild(styleFix);

    function updateGlobalStyles() {
        let css = `
            .comment-wrapper,
            .comment-wrapper .overflow-x-auto,
            .comment-wrapper .overflow-hidden,
            .thread-body-content .overflow-hidden {
                overflow: visible !important;
                max-height: none !important;
            }
        `;
        styleFix.textContent = css;
    }

    const mainDocumentObserver = new MutationObserver(() => {
        clearTimeout(commentFixTimer);
        commentFixTimer = setTimeout(() => {
            clickAllExpandButtons();
        }, 100);
        updateGlobalStyles();
    });

    mainDocumentObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    mainDocumentObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    function observeURLChange() {
        let lastUrl = location.href;

        const urlChangeHandler = () => {
            if (location.href !== lastUrl && location.href.includes('/s/')) {
                lastUrl = location.href;
                hidePreview();
                setTimeout(() => {
                    runCommentFix();
                    attachEvents();
                    updateGlobalStyles();
                }, 500);
            }
        };

        const urlObserver = new MutationObserver(urlChangeHandler);
        urlObserver.observe(document.body, { childList: true, subtree: true });

        const originalPush = history.pushState;
        history.pushState = function () {
            originalPush.apply(this, arguments);
            urlChangeHandler();
        };

        window.addEventListener('popstate', urlChangeHandler);
    }

    const initScript = () => {
        runCommentFix();
        observeURLChange();
        updateGlobalStyles();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initScript();
    } else {
        document.addEventListener('DOMContentLoaded', initScript);
    }
})();