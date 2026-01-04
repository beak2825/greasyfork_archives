// ==UserScript==
// @name        디시인사이드 게시글 및 댓글 미리보기
// @namespace   http://tampermonkey.net/
// @version     2.0
// @description 갤러리 제목/댓글 미리보기
// @author      116.125
// @match       https://gall.dcinside.com/*/board/lists*
// @match       https://gall.dcinside.com/board/lists*
// @connect     dcinside.com
// @connect     gall.dcinside.com
// @connect     m.dcinside.com
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/511939/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EB%B0%8F%20%EB%8C%93%EA%B8%80%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/511939/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EB%B0%8F%20%EB%8C%93%EA%B8%80%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        POPUP_WIDTH: 340,
        DEBOUNCE_DELAY: 100,
        HIDE_DELAY: 400,
        MAX_CACHE_SIZE: 100,
        MAX_CONCURRENT: 3
    };

    const css = `
        .dc-preview-popup {
            position: absolute;
            width: ${CONFIG.POPUP_WIDTH}px;
            background-color: #252525;
            border: 1px solid #666;
            color: #e0e0e0;
            padding: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.7);
            z-index: 10000;
            max-height: 500px;
            overflow-y: auto;
            overflow-x: hidden;
            display: none;
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.4;
            word-break: break-all;
            font-family: 'Malgun Gothic', sans-serif;
            box-sizing: border-box;
            text-align: left !important; /* 팝업 전체 왼쪽 정렬 */
        }
        .dc-preview-popup * {
            max-width: 100% !important;
            box-sizing: border-box !important;
        }

        .dc-preview-popup.expanded {
            width: 80vw !important;
            max-width: 1000px;
            height: 80vh !important;
            max-height: none;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            position: fixed;
            background-color: #1a1a1a;
            z-index: 10001;
        }

        /* 본문 이미지 스타일 */
        .dc-preview-popup img { display: block; margin: 5px auto; border-radius: 4px; height: auto !important; }
        .dc-preview-popup:not(.expanded) img { max-height: 200px; object-fit: contain; }

        /* 댓글 스타일 */
        .dc-cmt-item { padding: 8px 0; border-bottom: 1px solid #444; }
        .dc-cmt-item:last-child { border-bottom: none; }
        .dc-cmt-info { display: flex; justify-content: space-between; font-size: 0.85em; color: #aaa; margin-bottom: 4px; }
        .dc-cmt-nick { font-weight: bold; color: #ddd; }
        .dc-cmt-content { color: #eee; white-space: pre-wrap; text-align: left !important; }

        /* 디시콘 스타일 */
        .dc-preview-popup .dc-cmt-dccon,
        .dc-preview-popup .comment_dccon,
        .dc-preview-popup .written_dccon,
        .dc-preview-popup .coment_dccon_img {
            margin: 5px 0 !important;
            text-align: left !important;
            display: block !important;
        }

        /* 디시콘 이미지/비디오 */
        .dc-preview-popup .dc-cmt-dccon img,
        .dc-preview-popup .dc-cmt-dccon video,
        .dc-preview-popup .comment_dccon img,
        .dc-preview-popup .comment_dccon video {
            max-height: 100px !important;
            max-width: 100px !important;
            display: inline-block !important; /* inline-block으로 변경하여 text-align 영향 받게 함 */
            margin: 0 !important; /* 중앙 정렬 마진 제거 */
            border-radius: 4px;
        }

        .dc-msg-loading { text-align: center; color: #888; padding: 10px; font-style: italic; }
        .dc-msg-error { text-align: center; color: #ff6b6b; padding: 10px; border: 1px dashed #ff6b6b; margin-top:5px; }
        .dc-msg-info { text-align: center; color: #aaa; padding: 10px; font-size: 0.9em; }
    `;

    GM_addStyle(css);

    const state = {
        popup: document.createElement('div'),
        currentLink: null,
        hideTimeout: null,
        debounceTimer: null,
        isExpanded: false,
        parser: new DOMParser(),
        cache: new Map(),
        queue: [],
        activeRequests: 0
    };

    state.popup.className = 'dc-preview-popup';
    state.popup.addEventListener('click', e => e.stopPropagation());
    state.popup.addEventListener('wheel', e => { if (state.isExpanded) e.stopPropagation(); }, { passive: false });
    state.popup.addEventListener('mouseenter', () => clearTimeout(state.hideTimeout));
    state.popup.addEventListener('mouseleave', hidePopupWithDelay);
    state.popup.addEventListener('click', toggleExpand);
    document.body.appendChild(state.popup);

    function toggleExpand() {
        state.isExpanded = !state.isExpanded;
        if (state.isExpanded) state.popup.classList.add('expanded');
        else {
            state.popup.classList.remove('expanded');
            if (state.currentLink) positionPopup(state.currentLink);
        }
    }

    function positionPopup(target) {
        if (state.isExpanded) return;
        const rect = target.getBoundingClientRect();
        const pW = CONFIG.POPUP_WIDTH;
        const pH = state.popup.offsetHeight || 150;

        let top = rect.bottom + window.scrollY + 10;
        let left = rect.left + window.scrollX;

        if (rect.left + pW > window.innerWidth - 20) left = (rect.right + window.scrollX) - pW;
        if (left < 10) left = 10;
        if (rect.bottom + pH > window.innerHeight + window.scrollY - 20) top = (rect.top + window.scrollY) - pH - 10;

        state.popup.style.top = `${top}px`;
        state.popup.style.left = `${left}px`;
    }

    // --- 디시콘 및 요소 정리 헬퍼 함수 ---
    function fixDccon(element) {
        if (!element) return '';

        // 1. 모든 요소의 이벤트 핸들러 제거 (마우스 오버 시 이동 방지)
        element.querySelectorAll('*').forEach(el => {
            [...el.attributes].forEach(attr => {
                if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
            });
        });

        // 2. 미디어 태그 속성 복구
        element.querySelectorAll('img, video').forEach(media => {
            const realSrc = media.dataset.original || media.dataset.src;
            if (realSrc) {
                media.src = realSrc;
                media.classList.remove('lazy');
            }

            if (media.tagName === 'VIDEO') {
                media.autoplay = true;
                media.loop = true;
                media.muted = true;
                media.setAttribute('playsinline', '');
            }
        });

        return element.innerHTML;
    }

    // --- 파서 ---
    function parseHtml(html, type, isMobile = false) {
        const doc = state.parser.parseFromString(html, 'text/html');

        if (type === 'post') {
            let content = doc.querySelector('.writing_view_box') || doc.querySelector('.view_content_wrap');
            if (!content) return `<div class="dc-msg-error">본문 파싱 실패</div>`;

            ['script', 'iframe', 'style', 'object', 'embed'].forEach(t => content.querySelectorAll(t).forEach(e => e.remove()));

            content.querySelectorAll('*').forEach(el => {
                el.style.width = '';
                el.style.height = '';
                el.style.maxWidth = '100%';
                el.removeAttribute('width');
                el.removeAttribute('height');
            });

            return content.innerHTML;
        }
        else if (type === 'comment') {
            // 모바일 댓글 파싱 (우선순위)
            if (isMobile) {
                const list = doc.querySelector('.all-comment-lst') || doc.querySelector('.comment-list');

                if (!list) {
                    if (doc.title.includes('성인') || html.includes('성인')) return `<div class="dc-msg-error">성인 인증 필요</div>`;
                    return `<div class="dc-msg-error">댓글 없음(권한/삭제)</div>`;
                }

                const items = list.querySelectorAll('li');
                if (items.length === 0) return '<div class="dc-msg-info">등록된 댓글이 없습니다.</div>';

                let htmlOut = '';

                items.forEach(li => {
                    const nickEl = li.querySelector('.name') || li.querySelector('.nick');
                    const txtEl = li.querySelector('.txt');

                    let dcconEl = li.querySelector('.dccon') ||
                                  li.querySelector('.written_dccon') ||
                                  li.querySelector('.comment_dccon') ||
                                  li.querySelector('video') ||
                                  li.querySelector('img[src*="dcimg5"]') ||
                                  li.querySelector('img[data-original*="dcimg5"]');

                    // 디시콘 엘리먼트 정제: 불필요한 DIV 껍데기 벗기고 알맹이만 추출 시도
                    if (dcconEl && !['IMG', 'VIDEO'].includes(dcconEl.tagName)) {
                         const innerMedia = dcconEl.querySelector('img, video');
                         if (innerMedia) dcconEl = innerMedia;
                    }

                    if (nickEl && (txtEl || dcconEl)) {
                        const nick = nickEl.textContent.trim();
                        let contentHtml = txtEl ? txtEl.innerHTML : '';

                        if (dcconEl && (!txtEl || !txtEl.contains(dcconEl))) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'dc-cmt-dccon';
                            wrapper.appendChild(dcconEl.cloneNode(true));
                            contentHtml += fixDccon(wrapper);
                        } else {
                            if (txtEl) contentHtml = fixDccon(txtEl);
                        }

                        htmlOut += `
                            <div class="dc-cmt-item">
                                <div class="dc-cmt-info">
                                    <span class="dc-cmt-nick">${nick}</span>
                                </div>
                                <div class="dc-cmt-content">${contentHtml}</div>
                            </div>`;
                    }
                });
                return htmlOut;
            }
            // PC 댓글 파싱 (Fallback)
            else {
                const list = doc.querySelector('.cmt_list');
                if (!list) return null;

                const items = list.querySelectorAll('li[id^="comment_li_"]');
                let htmlOut = '';

                items.forEach(li => {
                    if (li.id === 'comment_li_0') return;

                    const nickEl = li.querySelector('.nickname') || li.querySelector('.gall_writer') || li.querySelector('em');
                    const txtEl = li.querySelector('.usertxt') || li.querySelector('.cmt_txt');
                    let dcconBox = li.querySelector('.comment_dccon') || li.querySelector('.coment_dccon_img');

                    if (dcconBox) {
                         const innerMedia = dcconBox.querySelector('img, video');
                         if (innerMedia) dcconBox = innerMedia;
                    }

                    if (nickEl && (txtEl || dcconBox)) {
                        const nick = nickEl.textContent.trim();
                        let contentHtml = txtEl ? txtEl.innerHTML : '';

                        if (dcconBox) {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'dc-cmt-dccon';
                            wrapper.appendChild(dcconBox.cloneNode(true));
                            contentHtml += fixDccon(wrapper);
                        } else if (txtEl) {
                            contentHtml = fixDccon(txtEl);
                        }

                        const isReply = li.classList.contains('reply_line');
                        const style = isReply ? 'style="padding-left:15px; border-left: 2px solid #444;"' : '';
                        const ip = li.querySelector('.ip')?.textContent || '';

                        htmlOut += `
                            <div class="dc-cmt-item" ${style}>
                                <div class="dc-cmt-info">
                                    <span><span class="dc-cmt-nick">${nick}</span> ${ip}</span>
                                </div>
                                <div class="dc-cmt-content">${contentHtml}</div>
                            </div>`;
                    }
                });
                return htmlOut || '<div class="dc-msg-info">등록된 댓글이 없습니다.</div>';
            }
        }
    }

    // --- 데이터 요청 ---
    function fetchContent(url, isMobile = false) {
        return new Promise((resolve, reject) => {
            const cacheKey = (isMobile ? 'm_' : '') + url.split('#')[0];
            if (state.cache.has(cacheKey)) return resolve(state.cache.get(cacheKey));

            state.queue.push({ url, isMobile, resolve, reject });
            processQueue();
        });
    }

    function processQueue() {
        if (state.activeRequests >= CONFIG.MAX_CONCURRENT || state.queue.length === 0) return;

        const { url, isMobile, resolve, reject } = state.queue.shift();
        state.activeRequests++;

        const headers = {
            'Referer': isMobile ? 'https://m.dcinside.com/' : window.location.href,
            'Cache-Control': 'no-cache'
        };

        if (isMobile) {
            headers['User-Agent'] = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36';
        } else {
            headers['User-Agent'] = navigator.userAgent;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: headers,
            onload: res => {
                state.activeRequests--;
                const cacheKey = (isMobile ? 'm_' : '') + url.split('#')[0];
                state.cache.set(cacheKey, res.responseText);
                resolve(res.responseText);
                processQueue();
            },
            onerror: err => {
                state.activeRequests--;
                reject(err);
                processQueue();
            }
        });
    }

    // --- 통합 로직 ---
    function showPopup(triggerEl, url, type) {
        state.currentLink = triggerEl;
        const label = type === 'post' ? '본문' : '댓글';

        state.popup.innerHTML = `<div class="dc-msg-loading">${label} 로딩 중...</div>`;
        state.popup.style.display = 'block';
        positionPopup(triggerEl);

        if (type === 'comment') {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const id = urlParams.get('id');
            const no = urlParams.get('no');

            if (id && no) {
                const mobileUrl = `https://m.dcinside.com/board/${id}/${no}`;

                fetchContent(mobileUrl, true).then(html => {
                    if (state.currentLink !== triggerEl && !state.isExpanded) return;
                    const result = parseHtml(html, 'comment', true);
                    state.popup.innerHTML = result;
                    positionPopup(triggerEl);
                }).catch(err => {
                    state.popup.innerHTML = `<div class="dc-msg-error">댓글 로딩 실패<br>${err.statusText || '오류'}</div>`;
                });
            } else {
                state.popup.innerHTML = `<div class="dc-msg-error">URL 분석 실패 (ID/No 없음)</div>`;
            }
            return;
        }

        fetchContent(url, false).then(html => {
            if (state.currentLink !== triggerEl && !state.isExpanded) return;

            const result = parseHtml(html, 'post', false);
            if (result) {
                state.popup.innerHTML = result;
                const imgs = state.popup.querySelectorAll('img');
                if (imgs.length) imgs[0].onload = () => positionPopup(triggerEl);
                positionPopup(triggerEl);
            } else {
                state.popup.innerHTML = `<div class="dc-msg-error">본문 내용을 찾을 수 없습니다.</div>`;
            }
        }).catch(err => {
            state.popup.innerHTML = `<div class="dc-msg-error">네트워크 오류<br>${err.statusText || ''}</div>`;
        });
    }

    function hidePopupWithDelay() {
        if (state.isExpanded) return;
        state.hideTimeout = setTimeout(() => {
            state.popup.style.display = 'none';
            state.currentLink = null;
        }, CONFIG.HIDE_DELAY);
    }

    // --- 이벤트 리스너 ---
    document.addEventListener('mouseover', e => {
        const target = e.target;
        const replyEl = target.matches('.reply_num, .reply_numbox, .reply_cnt') ? target : target.closest('.reply_num, .reply_numbox, .reply_cnt');
        const titleEl = target.closest('.gall_tit a, .ub-content a.subject, .gall_tit a.icon_txt');

        if ((!replyEl && !titleEl) || state.isExpanded) return;

        const trigger = replyEl || titleEl;
        const type = replyEl ? 'comment' : 'post';

        clearTimeout(state.hideTimeout);
        clearTimeout(state.debounceTimer);

        state.debounceTimer = setTimeout(() => {
            let url = null;
            if (replyEl) {
                if (replyEl.tagName === 'A') url = replyEl.href;
                else {
                    const parentLink = replyEl.closest('a');
                    if (parentLink) url = parentLink.href;
                    else {
                        const row = replyEl.closest('tr, li, .ub-content');
                        if (row) {
                            const subjectLink = row.querySelector('a.subject') || row.querySelector('a[href*="board/view"]');
                            if (subjectLink) url = subjectLink.href;
                        }
                    }
                }
            } else {
                url = titleEl.href;
            }

            if (url && url.includes('board/view')) {
                showPopup(trigger, url, type);
            }
        }, CONFIG.DEBOUNCE_DELAY);
    });

    document.addEventListener('mouseout', e => {
        const t = e.target;
        if (t.matches('.reply_num, .reply_numbox') || t.closest('a')) {
            clearTimeout(state.debounceTimer);
            hidePopupWithDelay();
        }
    });

    window.addEventListener('resize', () => { if (!state.isExpanded) state.popup.style.display = 'none'; });
})();