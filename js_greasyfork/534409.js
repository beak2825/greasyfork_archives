// ==UserScript==
// @name         DogDrip Preview tool
// @version      1.0.1
// @author       TKC
// @description  개드립 게시물 미리보기 도구
// @namespace    http://tampermonkey.net/
// @match        https://www.dogdrip.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534409/DogDrip%20Preview%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/534409/DogDrip%20Preview%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ——— 설정 상수 ———
    const CONFIG = {
        HOVER_DELAY: 700,        // 호버 후 미리보기 표시까지 대기 시간(ms)
        HIDE_DELAY: 200,         // 마우스 벗어난 후 미리보기 숨김까지 대기 시간(ms)
        PREVIEW_SIZE: {
            minWidth: '300px',
            minHeight: '200px',
            maxWidth: '800px',
            maxHeight: '600px',
            defaultWidth: '30vw',
            defaultHeight: '45vh'
        },
        Z_INDEX: 10000,
        ANIMATION_DURATION: 300  // 애니메이션 지속 시간(ms)
    };

    // ——— 유틸리티 함수 ———
    const Util = {
        createElement(tag, attributes = {}, styles = {}) {
            const element = document.createElement(tag);
            Object.assign(element, attributes);
            Object.assign(element.style, styles);
            return element;
        },
        setStyles(element, styles) {
            Object.assign(element.style, styles);
        },
        addEventListeners(element, events) {
            for (const [event, handler] of Object.entries(events)) {
                element.addEventListener(event, handler);
            }
        }
    };

    // ——— 프리뷰 박스 모듈 ———
    const PreviewBox = (function() {
        let previewBox;
        let hideTimer;

        function create() {
            if (!previewBox) {
                previewBox = Util.createElement('div', {}, {
                    position: 'fixed',
                    zIndex: CONFIG.Z_INDEX,
                    background: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    padding: '0px',
                    boxSizing: 'border-box',
                    minWidth: CONFIG.PREVIEW_SIZE.minWidth,
                    minHeight: CONFIG.PREVIEW_SIZE.minHeight,
                    maxWidth: CONFIG.PREVIEW_SIZE.maxWidth,
                    maxHeight: CONFIG.PREVIEW_SIZE.maxHeight,
                    width: CONFIG.PREVIEW_SIZE.defaultWidth,
                    height: CONFIG.PREVIEW_SIZE.defaultHeight,
                    overflow: 'hidden',
                    display: 'none',
                    transition: `all ${CONFIG.ANIMATION_DURATION}ms ease-in-out`
                });
                document.body.appendChild(previewBox);
            }
            return previewBox;
        }

        function adjustSize() {
            if (!previewBox) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            let width = Math.min(vw * 0.8, parseInt(CONFIG.PREVIEW_SIZE.maxWidth));
            let height = Math.min(vh * 0.7, parseInt(CONFIG.PREVIEW_SIZE.maxHeight));
            width = Math.max(width, parseInt(CONFIG.PREVIEW_SIZE.minWidth));
            height = Math.max(height, parseInt(CONFIG.PREVIEW_SIZE.minHeight));

            Util.setStyles(previewBox, {
                width: `${width}px`,
                height: `${height}px`
            });
        }

        // ——— 프리뷰 박스 위치 설정 ———
        function position(link) {
            if (!previewBox) create();

            const rect = link.getBoundingClientRect();

            // 1) 크기 조정
            adjustSize();

            // 2) 실제 크기 측정용: 잠시 보이게 했다가 숨김
            previewBox.style.visibility = 'hidden';
            previewBox.style.display    = 'block';
            const boxWidth  = previewBox.offsetWidth;
            const boxHeight = previewBox.offsetHeight;
            previewBox.style.display    = 'none';
            previewBox.style.visibility = 'visible';

            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // 3) X 좌표 계산
            let left = rect.left;
            if (left + boxWidth > viewportW) {
                left = Math.max(0, viewportW - boxWidth);
            }

            // 4) Y 좌표: 아래에 공간 있으면 아래, 아니면 위
            const spaceBelow = viewportH - (rect.bottom + 5);
            const top = spaceBelow >= boxHeight
                ? rect.bottom + 5
                : rect.top - boxHeight - 5;

            // 5) 한 번에 위치 및 보이기
            Object.assign(previewBox.style, {
                top:     `${top}px`,
                left:    `${left}px`,
                opacity: '0',
                display: 'block'
            });

            // 6) fade-in
            requestAnimationFrame(() => {
                previewBox.style.opacity = '1';
            });
        }

        function show(content) {
            if (!previewBox) create();
            previewBox.innerHTML = content;
            previewBox.style.display = 'block';
        }

        // ——— 프리뷰 박스 숨김 예약 ———
        function scheduleHide() {
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                if (!previewBox) return;
                // 페이드 아웃
                Util.setStyles(previewBox, { opacity: '0' });
        
                // 애니메이션 끝나면 DOM에서 완전 제거
                setTimeout(() => {
                    remove();
                }, CONFIG.ANIMATION_DURATION);
            }, CONFIG.HIDE_DELAY);
        }

        function cancelHide() {
            clearTimeout(hideTimer);
        }

        function remove() {
            if (previewBox && previewBox.parentNode) {
                previewBox.parentNode.removeChild(previewBox);
            }
            previewBox = null;
        }

        return {
            create,
            adjustSize,
            position,
            show,
            scheduleHide,
            cancelHide,
            remove,
            getElement: () => previewBox
        };
    })();

    const previewBox = PreviewBox.create();
    window.addEventListener('resize', PreviewBox.adjustSize);

    let hoverTimer, progressBar;

    function showPreview(link) {
        const rawHref = link.getAttribute('href');
        if (!rawHref) {
            PreviewBox.show('<div style="padding:16px;font-size:14px;color:red;text-align:center;">미리보기 로드 실패</div>');
            return;
        }
        const url = new URL(rawHref, location.origin).href;
        PreviewBox.position(link);
        PreviewBox.show(`
            <div style="display:flex;justify-content:center;align-items:center;height:100%;width:100%;">
                <div style="text-align:center;">
                    <div style="margin-bottom:10px;font-size:14px;">로딩 중...</div>
                    <div style="width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `);
        fetchAndRenderPreview(url);
    }

    function fetchAndRenderPreview(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        fetch(url, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const snippet = ContentProcessor.extractArticleContent(doc);
                if (!snippet) throw new Error('본문을 찾을 수 없습니다');

                const styles = ContentProcessor.extractStyles(doc);
                const scripts = ContentProcessor.extractScripts(doc, url);
                const iframe = ContentProcessor.renderIframe(url, snippet, styles, scripts);

                const box = PreviewBox.getElement();
                box.innerHTML = '';
                box.appendChild(iframe);
            })
            .catch(err => {
                console.error('미리보기 로드 오류:', err);
                let msg = '미리보기 로드 중 오류';
                if (err.name === 'AbortError') msg = '요청 시간 초과. 네트워크 연결을 확인해주세요.';
                else if (err instanceof TypeError) msg = '네트워크 오류. 인터넷 연결을 확인해주세요.';
                else msg = `미리보기 로드 중 오류: ${err.message}`;
                PreviewBox.show(`<div style="padding:16px;font-size:14px;color:red;text-align:center;">${msg}</div>`);
            });
    }

    const ContentProcessor = {
        extractArticleContent(doc) {
            const wrappers = Array.from(doc.querySelectorAll('div.ed.article-wrapper'));
            const art = wrappers.find(w => w.querySelector('#comment_end'));
            if (!art) return null;
            let html = '';
            let copying = false;
            art.childNodes.forEach(n => {
                if (n.nodeType === Node.ELEMENT_NODE && n.classList.contains('inner-container')) {
                    copying = true;
                }
                if (copying && n.outerHTML) html += n.outerHTML;
                if (n.nodeType === Node.ELEMENT_NODE && n.id === 'comment_end') {
                    copying = false;
                }
            });
            
            html = html.replace(/<div class="ed comment-form">[\s\S]*?<\/div>\s*<\/form><\/div>/g, '');
            html = html.replace(/<a[^>]*>\s*댓글\s*<\/a>/g,'');

            return html;
        },
        extractStyles(doc) {
            return Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'))
                        .map(el => el.outerHTML).join('\n');
        },
        extractScripts(doc, base) {
            return Array.from(doc.querySelectorAll('script')).map(el => {
                if (el.src) {
                    const abs = new URL(el.getAttribute('src'), base).href;
                    return `<script src="${abs}"></script>`;
                } else {
                    return `<script>${el.innerHTML}</script>`;
                }
            }).join('\n');
        },
        renderIframe(url, content, styles, scripts) {
            return Util.createElement('iframe', {
                srcdoc: `
<!DOCTYPE html>
<html>
<head>
  <base href="${url}">
  <style>
    html, body { height:100%; margin:0; padding:0; overflow:hidden; background:#fff; }
    #__preview-wrapper { height:100%; min-height:100%; overflow:auto; overscroll-behavior:contain; }
  </style>
  ${styles}
  ${scripts}
</head>
<body>
  <div id="__preview-wrapper">
    ${content}
  </div>
</body>
</html>`.trim()
            }, {
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
            });
        }
    };

    const ProgressBar = (function() {
        let progressBar;
        function create(link) {
            remove();
            const rect = link.getBoundingClientRect();
            progressBar = Util.createElement('div', {}, {
                position: 'absolute',
                top:    `${window.scrollY + rect.bottom + 2}px`,
                left:   `${window.scrollX + rect.left}px`,
                width:  '0px',
                height: '3px',
                background: 'linear-gradient(to right, #4CAF50, #2196F3)',
                borderRadius: '2px',
                transition: `width ${CONFIG.HOVER_DELAY}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                zIndex: CONFIG.Z_INDEX,
                pointerEvents: 'none',
                boxShadow: '0 0 5px rgba(33, 150, 243, 0.5)'
            });
            document.body.appendChild(progressBar);
            progressBar.offsetHeight;
            requestAnimationFrame(() => {
                if (progressBar) progressBar.style.width = `${rect.width}px`;
            });
        }
        function remove() {
            if (progressBar && progressBar.parentNode) {
                progressBar.parentNode.removeChild(progressBar);
            }
            progressBar = null;
        }
        return { create, remove };
    })();

    const EventHandler = {
        onLeave() {
            clearTimeout(hoverTimer);
            ProgressBar.remove();
            PreviewBox.scheduleHide();
        },
        onEnter(e) {
            const link = e.currentTarget;
            if (progressBar) return;
            ProgressBar.create(link);
            hoverTimer = setTimeout(() => {
                showPreview(link);
                ProgressBar.remove();
            }, CONFIG.HOVER_DELAY);
        },
        onPreviewEnter() {
            PreviewBox.cancelHide();
        },
        onPreviewLeave() {
            PreviewBox.scheduleHide();
        },
        initEventListeners() {
            // 1) 제목 링크 (span.ed.title-link의 부모 <a>)
            document.querySelectorAll('span.ed.title-link').forEach(span => {
                const a = span.parentElement;
                if (a && a.tagName === 'A') {
                    Util.addEventListeners(a, {
                        mouseenter: this.onEnter,
                        mouseleave: this.onLeave
                    });
                }
            });

            // 2) 게시판 리스트 링크
            document.querySelectorAll('.ed.board-list > ul:not(.pagination) > li > a')
                .forEach(a => {
                    Util.addEventListeners(a, {
                        mouseenter: this.onEnter,
                        mouseleave: this.onLeave
                    });
                });

            const addPreviewBoxListeners = () => {
                const box = PreviewBox.getElement();
                if (box) {
                    Util.addEventListeners(box, {
                        mouseenter: this.onPreviewEnter,
                        mouseleave: this.onPreviewLeave
                    });
                }
            };
            
            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    if (m.type === 'childList' && m.addedNodes.length) {
                        addPreviewBoxListeners();
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    EventHandler.initEventListeners();

    window.addEventListener('resize', () => {
        PreviewBox.adjustSize();
        const box = PreviewBox.getElement();
        if (box && box.style.display !== 'none') {
            const hoverEl = document.querySelector(':hover');
            if (!hoverEl) return;

            let link;
            // 1) board-list 아이템인 <a>
            if ( hoverEl.matches('.ed.board-list > ul:not(.pagination) > li > a') ) {
                link = hoverEl;
            }
            // 2) title-link <span> 위로 hover 됐을 때는 부모 <a>
            else if ( hoverEl.matches('span.ed.title-link') && hoverEl.parentElement.tagName === 'A' ) {
                link = hoverEl.parentElement;
            }

            if (link) {
                PreviewBox.position(link);
            }
        }
    });

})();
