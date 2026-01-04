// ==UserScript==
// @name         디시인사이드 갤로그 정보 표시
// @namespace    https://github.com/yourname/
// @version      2.0
// @description  디시인사이드 모바일에서 닉네임 길게 클릭 시 갤로그 정보를 화면 안쪽에 표시
// @author       yourname
// @match        https://m.dcinside.com/board/*
// @match        https://m.dcinside.com/mini/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      m.dcinside.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/538799/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EB%A1%9C%EA%B7%B8%20%EC%A0%95%EB%B3%B4%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/538799/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EB%A1%9C%EA%B7%B8%20%EC%A0%95%EB%B3%B4%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 설정
    const CONFIG = {
        longPressDuration: 500,
        cacheExpiry: 3600000,
        darkMode: false,
        tooltipMargin: 15 // 화면 가장자리 여유 공간
    };

    // 캐시 시스템 (기존 코드 유지)
    const cache = {
        get: (key) => {
            const item = GM_getValue(key, null);
            if (!item) return null;
            if (Date.now() > item.expiry) {
                GM_deleteValue(key);
                return null;
            }
            return item.data;
        },
        set: (key, data, expiry = CONFIG.cacheExpiry) => {
            GM_setValue(key, {
                data: data,
                expiry: Date.now() + expiry
            });
        }
    };

    // 툴팁 생성 (기존 코드 유지)
    const createTooltip = () => {
        const tooltip = document.createElement('div');
        tooltip.id = 'dc-gallog-tooltip-v2';
        tooltip.style.cssText = `
            position: fixed;
            z-index: 99999;
            background: ${CONFIG.darkMode ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)'};
            color: ${CONFIG.darkMode ? '#eee' : '#333'};
            border: 1px solid ${CONFIG.darkMode ? '#555' : '#ddd'};
            border-radius: 10px;
            padding: 15px;
            max-width: 280px;
            width: 80%;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            font-size: 14px;
            line-height: 1.6;
            display: none;
            backdrop-filter: blur(8px);
            word-break: keep-all;
            pointer-events: auto;
        `;
        document.body.appendChild(tooltip);
        return tooltip;
    };

    const tooltip = createTooltip();

    // 갤로그 정보 파서 (기존 코드 유지)
    const parseGallogData = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const getData = (selector, regex) => {
            const elem = doc.querySelector(selector);
            if (!elem) return 'N/A';
            const text = elem.textContent.trim();
            if (!regex) return text;
            const match = text.match(regex);
            return match ? match[1] || text : text;
        };

        return {
            visitors: getData('.today-visit', /([\d,]+\s*\/\s*[\d,]+)/) || 'N/A',
            posts: getData('section.grid:nth-of-type(2) .md-tit a', /\(([\d,]+)\)/) || 'N/A',
            comments: getData('section.grid:nth-of-type(3) .md-tit a', /\(([\d,]+)\)/) || 'N/A',
            description: (doc.querySelector('.gallog-desc') || {}).textContent || '',
            timestamp: Date.now()
        };
    };

    // 갤로그 정보 가져오기 (기존 코드 유지)
    const fetchGallogInfo = (userId, callback) => {
        const cacheKey = `gallog_v2_${userId}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            callback(cached);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://m.dcinside.com/gallog/${userId}`,
            onload: function(response) {
                if (response.status === 200) {
                    const data = parseGallogData(response.responseText);
                    cache.set(cacheKey, data);
                    callback(data);
                } else {
                    callback(null);
                }
            },
            onerror: function() {
                callback(null);
            }
        });
    };

    // 화면 경계 안에 툴팁 위치 계산 (기존 코드 유지)
    const calculateTooltipPosition = (posX, posY) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = 280;
        const tooltipHeight = 200;
        const margin = CONFIG.tooltipMargin;

        let left = posX - (tooltipWidth / 2);

        if (left < margin) {
            left = margin;
        }
        else if (left + tooltipWidth > viewportWidth - margin) {
            left = Math.min(posX - tooltipWidth, viewportWidth - tooltipWidth - margin);
            if (left < margin) left = margin;
        }

        let top = posY - tooltipHeight - 50;
        if (top < margin) {
            top = posY + 50;
            if (top + tooltipHeight > viewportHeight - margin) {
                top = (viewportHeight - tooltipHeight) / 2;
            }
        }

        return { left, top };
    };

    // 툴팁 표시 (기존 코드 유지)
    const showTooltip = (data, posX, posY) => {
        if (!data) {
            tooltip.innerHTML = `
                <div style="color:#ff6b6b;font-weight:bold;margin-bottom:10px;">⚠️ 정보 불러오기 실패</div>
                <div>갤로그 데이터를 가져오지 못했습니다.</div>
                <div style="margin-top:10px;font-size:12px;color:#999;">잠시 후 다시 시도해주세요</div>
            `;
        } else {
            tooltip.innerHTML = `
                <div style="font-weight:bold;margin-bottom:12px;color:${CONFIG.darkMode ? '#4CAF50' : '#2196F3'};font-size:15px;">
                    ${data.description || '갤로그 정보'}
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;align-items:center;">
                    <span style="color:#888;flex:1;">방문자</span>
                    <span style="font-weight:500;flex:1;text-align:right;">${data.visitors}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;align-items:center;">
                    <span style="color:#888;flex:1;">게시물</span>
                    <span style="font-weight:500;flex:1;text-align:right;">${data.posts}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:5px;align-items:center;">
                    <span style="color:#888;flex:1;">댓글</span>
                    <span style="font-weight:500;flex:1;text-align:right;">${data.comments}</span>
                </div>
                <div style="margin-top:15px;padding-top:10px;border-top:1px solid ${CONFIG.darkMode ? '#444' : '#eee'};font-size:12px;color:#888;text-align:center;">
                    ▼ 길게 눌러 닫기 (5초 후 자동 닫힘) ▼
                </div>
            `;
        }

        const { left, top } = calculateTooltipPosition(posX, posY);
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.display = 'block';

        const autoCloseTimer = setTimeout(hideTooltip, 5000);

        const handlePressStart = () => {
            tooltip._pressTimer = setTimeout(hideTooltip, CONFIG.longPressDuration);
        };
        const handlePressEnd = () => {
            clearTimeout(tooltip._pressTimer);
        };

        tooltip.addEventListener('touchstart', handlePressStart, { once: true });
        tooltip.addEventListener('touchend', handlePressEnd, { once: true });
        tooltip.addEventListener('mousedown', handlePressStart, { once: true });
        tooltip.addEventListener('mouseup', handlePressEnd, { once: true });

        tooltip._cleanup = () => {
            clearTimeout(autoCloseTimer);
            tooltip.removeEventListener('touchstart', handlePressStart);
            tooltip.removeEventListener('touchend', handlePressEnd);
            tooltip.removeEventListener('mousedown', handlePressStart);
            tooltip.removeEventListener('mouseup', handlePressEnd);
        };
    };

    const hideTooltip = () => {
        if (tooltip._cleanup) tooltip._cleanup();
        tooltip.style.display = 'none';
    };

    // 닉네임에서 사용자 ID 추출 (기존 코드 유지)
    const getUserIdFromElement = (element) => {
        const link = element.closest('a[href*="/gallog/"]');
        if (!link) return null;
        const match = link.href.match(/\/gallog\/([^\/]+)/);
        return match ? match[1] : null;
    };

    // 수정된 부분: 새로운 선택자 추가
    const setupNicknameEvents = () => {
        // 모든 갤러리 유형을 위한 선택자들
        const targetElements = [
            // 미니 갤러리
            'div.theme-mini:first-child > div.container:nth-child(4) > div.sec-wrap-sub > div.brick-wid > section.grid:nth-child(3) > div.gallview-tit-box:first-child > div.btm:last-child > div.rt:last-child > a.btn.btn-line-gray',

            // 마이너/정식 갤러리 (새로 추가된 선택자들)
             'div.container:nth-child(4) > div.sec-wrap-sub > div.brick-wid > section.grid:nth-child(3) > div.gallview-tit-box:first-child > div.btm:last-child > div.rt:last-child > a.btn.btn-line-gray',

            // 댓글 영역
            '.comment_list .nickname[href*="/gallog/"]',
            '.comment_list .nick[href*="/gallog/"]',
            '#comment_cnt_* > a.nick:first-child'
        ];

        targetElements.forEach(selector => {
            if (selector.includes('*')) {
                // 와일드카드 처리
                const baseSelector = selector.replace('*', '');
                document.querySelectorAll('[id^="comment_cnt_"]').forEach(el => {
                    const nickElement = el.querySelector('a.nick:first-child');
                    if (nickElement) {
                        addEventHandlers(nickElement);
                    }
                });
            } else {
                // 일반 선택자 처리
                document.querySelectorAll(selector).forEach(addEventHandlers);
            }
        });
    };

    // 수정된 부분: 이벤트 핸들러 개선
    const addEventHandlers = (element) => {
        if (element._gallogHandler) return;
        element._gallogHandler = true;

        let pressTimer;
        let isLongPress = false;

        const handleStart = (e) => {
            // 마이너/정식 갤러리에서 이벤트 전파 문제 해결
            e.stopImmediatePropagation();
            e.preventDefault();

            const userId = getUserIdFromElement(e.target);
            if (!userId) return;

            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                const posX = e.touches ? e.touches[0].clientX : e.clientX;
                const posY = e.touches ? e.touches[0].clientY : e.clientY;

                hideTooltip();

                showTooltip({
                    visitors: '로딩 중...',
                    posts: '로딩 중...',
                    comments: '로딩 중...',
                    description: '데이터를 불러오는 중입니다'
                }, posX, posY);

                fetchGallogInfo(userId, (data) => {
                    showTooltip(data, posX, posY);
                });
            }, CONFIG.longPressDuration);
        };

        const handleEnd = (e) => {
            clearTimeout(pressTimer);
            if (isLongPress) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };

        const handleClick = (e) => {
            if (isLongPress) {
                e.stopImmediatePropagation();
                e.preventDefault();
                isLongPress = false;
            }
        };

        // 이벤트 리스너 추가 (capture phase에서 처리)
        element.addEventListener('touchstart', handleStart, { passive: false, capture: true });
        element.addEventListener('touchend', handleEnd, { passive: false, capture: true });
        element.addEventListener('touchmove', handleEnd, { passive: false, capture: true });
        element.addEventListener('touchcancel', handleEnd, { passive: false, capture: true });

        element.addEventListener('mousedown', handleStart, { passive: false, capture: true });
        element.addEventListener('mouseup', handleEnd, { passive: false, capture: true });
        element.addEventListener('mouseleave', handleEnd, { passive: false, capture: true });

        element.addEventListener('click', handleClick, true);
    };

    // DOM 변경 감지 (기존 코드 유지)
    const observeDOM = () => {
        const observer = new MutationObserver(() => {
            setupNicknameEvents();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    };

    // 초기화 (기존 코드 유지)
    const init = () => {
        CONFIG.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (CONFIG.darkMode) {
            tooltip.style.background = 'rgba(30,30,30,0.97)';
            tooltip.style.color = '#f0f0f0';
            tooltip.style.borderColor = '#444';
        }

        setupNicknameEvents();
        observeDOM();
    };

    // 실행 (기존 코드 유지)
    if (document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }
})();