// ==UserScript==
// @name         FSM 一键收藏 不喜欢 加上图片放大功能
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Enhanced torrent page with gallery viewer, quick actions and keyboard shortcuts
// @author       You
// @match        https://fsm.name/Torrents/details*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js
// @resource     FANCYBOX_CSS https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528767/FSM%20%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F%20%E4%B8%8D%E5%96%9C%E6%AC%A2%20%E5%8A%A0%E4%B8%8A%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528767/FSM%20%E4%B8%80%E9%94%AE%E6%94%B6%E8%97%8F%20%E4%B8%8D%E5%96%9C%E6%AC%A2%20%E5%8A%A0%E4%B8%8A%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        const fancyboxCSS = GM_getResourceText('FANCYBOX_CSS');
        GM_addStyle(fancyboxCSS);

        GM_addStyle(`
            .fancybox-bg {
                background: #000;
            }
            .fancybox-is-open .fancybox-bg {
                opacity: .9;
            }
            .fancybox-container {
                z-index: 999999 !important;
            }

            .unified-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px;
                padding: 10px;
                margin: 15px 0;
            }

            .unified-gallery a {
                display: block;
                position: relative;
                overflow: hidden;
                border-radius: 4px;
                background: #f5f5f5;
            }

            .unified-gallery img {
                width: 100%;
                height: auto;
                display: block;
                transition: transform 0.3s ease;
            }

            .unified-gallery a:hover img {
                transform: scale(1.05);
            }
        `);
    } catch (error) {
        console.error('Failed to add styles:', error);
    }

    const $ = window.jQuery.noConflict(true);

    function initFancybox() {
        try {
            $('[data-fancybox="gallery"]').fancybox({
                buttons: [
                    "zoom",
                    "slideShow",
                    "fullScreen",
                    "download",
                    "thumbs",
                    "close"
                ],
                loop: true,
                protect: false,
                animationEffect: "zoom",
                transitionEffect: "slide",
                thumbs: {
                    autoStart: true,
                    hideOnClose: true
                },
                mobile: {
                    clickContent: function(current, event) {
                        return current.type === "image" ? "toggleControls" : false;
                    },
                    clickSlide: function(current, event) {
                        return current.type === "image" ? "toggleControls" : "close";
                    },
                }
            });
        } catch (error) {
            console.error('Fancybox initialization failed:', error);
        }
    }

    function reorganizeGallery(img) {
        try {
            console.log('进入reorganizeGallery')
            const contentArea = document.querySelector('.el-card__body');
            if (!contentArea) return;

            const unifiedGallery = document.createElement('div');
            unifiedGallery.className = 'unified-gallery';

            const allImages = [];
            const detailsImages = document.querySelectorAll('.ql-editor img');
            detailsImages.forEach(img => {
                if (img.src) allImages.push(img.src);
            });

            const supplementImages = document.querySelectorAll('.screenshots .el-image img');
            supplementImages.forEach(img => {
                if (img.src) allImages.push(img.src);
            });
            console.log('allImages:',allImages)
            const uniqueImages = [...new Set(allImages)];

            uniqueImages.forEach(src => {
                const link = document.createElement('a');
                link.href = src;
                link.setAttribute('data-fancybox', 'gallery');

                const img = document.createElement('img');
                img.src = src;
                img.loading = 'lazy';

                link.appendChild(img);
                unifiedGallery.appendChild(link);
            });

            const headers = Array.from(document.querySelectorAll('h4')).filter(h =>
                h.textContent === '种子详情' || h.textContent === '补充信息'
            );

            headers.forEach(header => {
                let next = header.nextElementSibling;
                while (next && next.tagName !== 'H4') {
                    const temp = next.nextElementSibling;
                    next.remove();
                    next = temp;
                }
                header.remove();
            });

            const originalScreenshots = document.querySelector('.screenshots');
            if (originalScreenshots) {
                originalScreenshots.remove();
            }

            if (uniqueImages.length > 0) {
                contentArea.appendChild(unifiedGallery);
                setTimeout(initFancybox, 500);
            }
        } catch (error) {
            console.error('Failed to reorganize gallery:', error);
        }
    }

    function voteTorrent(tid, value) {
        const authorization = localStorage.getItem('token')
        const deviceId = localStorage.getItem('DeviceId')
        const formData = new FormData();
        formData.append('tid', tid);
        formData.append('status', value);

        fetch('/api/Torrents/voteTorrent', {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'authorization': authorization,
                'deviceid': deviceId,
                'origin': 'https://fsm.name',
                'referer': window.location.href
            },
            body: formData,
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(res => {
            if (res?.success) {
                if (window.$notify) {
                    window.$notify({
                        message: '操作成功',
                        type: 'success'
                    });
                } else {
                    window.close();
                }
            }
        })
        .catch(error => {
            if (window.$notify) {
                window.$notify({
                    message: '操作失败',
                    type: 'error'
                });
            } else {
                alert('操作失败');
            }
        });
    }

    function addButtons() {
        const sideBlk = document.querySelector('.side-blk');
        if (!sideBlk) return;

        const urlParams = new URLSearchParams(window.location.search);
        const tid = urlParams.get('tid');
        if (!tid) return;

        const favoriteDiv = document.createElement('div');
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'el-button el-button--info el-button--large is-plain is-circle side-btn el-tooltip__trigger el-tooltip__trigger';
        favoriteBtn.style.display = 'block';
        favoriteBtn.innerHTML = `<i class="el-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"></path></svg></i>`;
        favoriteBtn.addEventListener('click', () => {
            voteTorrent(tid, 'VALUE');
        });
        favoriteDiv.appendChild(favoriteBtn);

        const dislikeDiv = document.createElement('div');
        const dislikeBtn = document.createElement('button');
        dislikeBtn.className = 'el-button el-button--info el-button--large is-plain is-circle side-btn el-tooltip__trigger el-tooltip__trigger';
        dislikeBtn.style.display = 'block';
        dislikeBtn.innerHTML = `<i class="el-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"></path></svg></i>`;
        dislikeBtn.addEventListener('click', () => {
            voteTorrent(tid, 'POINTLESS');
        });
        dislikeDiv.appendChild(dislikeBtn);

        sideBlk.appendChild(favoriteDiv);
        sideBlk.appendChild(dislikeDiv);

        window.dislikeButton = dislikeBtn;
    }

    function addKeyboardShortcuts() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'x' &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                window.dislikeButton?.click();
            }
        });
    }

    let keyboardShortcutsAdded = false;

    const galleryObserver = new MutationObserver((mutations, obs) => {
        const contentBody = document.querySelector('.el-card__body');
        const screenshots = document.querySelector('.ql-editor.ql-content-fix.img-beautify');
        console.log(contentBody , screenshots)
        if (contentBody && screenshots) {
            obs.disconnect();
            setTimeout(reorganizeGallery, 2000);

            setTimeout(() => {
                if (!document.querySelector('[data-fancybox="gallery"]')) {
                    reorganizeGallery();
                }
            }, 3000);
        }
    });

    const buttonsObserver = new MutationObserver((mutations, obs) => {
        const sideBlk = document.querySelector('.side-blk');
        if (sideBlk) {
            obs.disconnect();
            addButtons();

            if (!keyboardShortcutsAdded) {
                addKeyboardShortcuts();
                keyboardShortcutsAdded = true;
            }
        }
    });

    galleryObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    buttonsObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addButtons();
            if (!keyboardShortcutsAdded) {
                addKeyboardShortcuts();
                keyboardShortcutsAdded = true;
            }
        });
    } else {
        addButtons();
        if (!keyboardShortcutsAdded) {
            addKeyboardShortcuts();
            keyboardShortcutsAdded = true;
        }
    }
})();