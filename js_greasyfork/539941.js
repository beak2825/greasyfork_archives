// ==UserScript==
// @name         D2R Traderie Simple Relist & Remove
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Diablo II: Resurrected Traderie 간단한 재등록 및 삭제 도구
// @author       User
// @match        *://traderie.com/*
// @match        *://www.traderie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539941/D2R%20Traderie%20Simple%20Relist%20%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/539941/D2R%20Traderie%20Simple%20Relist%20%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let CONFIG = {
        clickDelay: 1500,
        scrollDelay: 800,
        loadMoreDelay: 2000
    };

    let isRunning = false;
    let relistButtons = [];
    let removeButtons = [];
    let stats = { 
        relist: { success: 0, failed: 0, skipped: 0 },
        remove: { success: 0, failed: 0, skipped: 0 }
    };

    // 유틸리티
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const log = msg => console.log(`[D2R Tool] ${msg}`);
    const isClickable = el => el && el.offsetParent && !el.disabled && el.getBoundingClientRect().width > 0;

    // 더보기 버튼 찾기
    const findLoadMore = () => {
        return document.querySelector('.see-all-btn-bar button[aria-label="Load More"]') ||
               document.querySelector('button[aria-label="Load More"]') ||
               Array.from(document.querySelectorAll('button')).find(btn =>
                   ['더 보기', 'Load More'].includes(btn.textContent?.trim())
               );
    };

    // 리리스트 버튼 찾기
    const findRelistButtons = () => {
        return Array.from(document.querySelectorAll('button'))
            .filter(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return (text.includes('relist') || text.includes('재등록')) && isClickable(btn);
            });
    };

    // 삭제 버튼 찾기
    const findRemoveButtons = () => {
        return Array.from(document.querySelectorAll('button'))
            .filter(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                const classes = btn.className?.toLowerCase() || '';
                return ((text.includes('remove') || text.includes('삭제') || classes.includes('remove-listing')) && isClickable(btn));
            });
    };

    // 전체 콘텐츠 로드
    const loadAllContent = async () => {
        updateStatus('전체 로드 중...');
        let clicks = 0;

        while (clicks < 50) {
            window.scrollTo(0, document.body.scrollHeight);
            await delay(1000);

            const loadMoreBtn = findLoadMore();
            if (!loadMoreBtn) break;

            loadMoreBtn.click();
            clicks++;
            updateStatus(`로드 중... (${clicks}번)`);
            await delay(CONFIG.loadMoreDelay);
        }

        window.scrollTo(0, 0);
        updateStatus(`로드 완료 (${clicks}번)`);
        return clicks;
    };

    // 상태 업데이트
    const updateStatus = text => {
        const el = document.getElementById('tool-status');
        if (el) el.textContent = text;
    };

    const updateCounts = (type = 'relist') => {
        if (type === 'relist') {
            document.getElementById('relist-success-count').textContent = stats.relist.success;
            document.getElementById('relist-fail-count').textContent = stats.relist.failed;
            document.getElementById('relist-skip-count').textContent = stats.relist.skipped;
        } else {
            document.getElementById('remove-success-count').textContent = stats.remove.success;
            document.getElementById('remove-fail-count').textContent = stats.remove.failed;
            document.getElementById('remove-skip-count').textContent = stats.remove.skipped;
        }
    };

    // 재등록 실행
    const startRelist = async () => {
        if (relistButtons.length === 0) {
            updateStatus('먼저 버튼 찾기 실행');
            return;
        }

        isRunning = true;
        stats.relist = { success: 0, failed: 0, skipped: 0 };

        document.getElementById('start-relist-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        for (let i = 0; i < relistButtons.length && isRunning; i++) {
            try {
                const btn = relistButtons[i];
                updateStatus(`재등록 중... (${i+1}/${relistButtons.length})`);

                if (!isClickable(btn)) {
                    stats.relist.skipped++;
                    continue;
                }

                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(CONFIG.scrollDelay);

                btn.click();
                stats.relist.success++;
                log(`재등록 버튼 ${i+1} 클릭 완료`);

                if (i < relistButtons.length - 1) {
                    await delay(CONFIG.clickDelay);
                }

            } catch (error) {
                stats.relist.failed++;
                log(`재등록 버튼 ${i+1} 실패: ${error.message}`);
            }

            updateCounts('relist');
        }

        isRunning = false;
        document.getElementById('start-relist-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateStatus('재등록 완료!');
    };

    // 삭제 실행
    const startRemove = async () => {
        if (removeButtons.length === 0) {
            updateStatus('먼저 버튼 찾기 실행');
            return;
        }

        // 확인 대화상자
        if (!confirm(`${removeButtons.length}개의 아이템을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다!`)) {
            return;
        }

        isRunning = true;
        stats.remove = { success: 0, failed: 0, skipped: 0 };

        document.getElementById('start-remove-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        for (let i = 0; i < removeButtons.length && isRunning; i++) {
            try {
                const btn = removeButtons[i];
                updateStatus(`삭제 중... (${i+1}/${removeButtons.length})`);

                if (!isClickable(btn)) {
                    stats.remove.skipped++;
                    continue;
                }

                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(CONFIG.scrollDelay);

                btn.click();
                stats.remove.success++;
                log(`삭제 버튼 ${i+1} 클릭 완료`);

                if (i < removeButtons.length - 1) {
                    await delay(CONFIG.clickDelay);
                }

            } catch (error) {
                stats.remove.failed++;
                log(`삭제 버튼 ${i+1} 실패: ${error.message}`);
            }

            updateCounts('remove');
        }

        isRunning = false;
        document.getElementById('start-remove-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateStatus('삭제 완료!');
    };

    // 중지
    const stopOperation = () => {
        isRunning = false;
        document.getElementById('start-relist-btn').disabled = false;
        document.getElementById('start-remove-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        updateStatus('중지됨');
    };

    // 강조표시
    const highlightButtons = (type = 'both') => {
        // 기존 강조 제거
        document.querySelectorAll('.tool-highlight').forEach(el => {
            el.style.border = '';
            el.style.boxShadow = '';
            el.classList.remove('tool-highlight');
        });

        let count = 0;

        // 재등록 버튼 강조 (파란색)
        if (type === 'relist' || type === 'both') {
            relistButtons.forEach((btn, i) => {
                btn.style.border = '3px solid #2196F3';
                btn.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.8)';
                btn.classList.add('tool-highlight');
                count++;
            });
        }

        // 삭제 버튼 강조 (빨간색)
        if (type === 'remove' || type === 'both') {
            removeButtons.forEach((btn, i) => {
                btn.style.border = '3px solid #f44336';
                btn.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.8)';
                btn.classList.add('tool-highlight');
                count++;
            });
        }

        updateStatus(`${count}개 버튼 강조됨`);
    };

    // 토글 버튼 생성
    const createToggleButton = () => {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tool-toggle';
        toggleBtn.innerHTML = '⚡';
        toggleBtn.title = 'D2R 재등록/삭제 도구';
        toggleBtn.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; z-index: 999998;
            width: 35px; height: 35px; border-radius: 8px;
            background: rgba(30, 30, 30, 0.9); backdrop-filter: blur(10px);
            border: 1px solid rgba(233, 69, 96, 0.5); color: #e94560;
            font-size: 16px; cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease; opacity: 0.7;
        `;

        // 호버 효과
        toggleBtn.onmouseenter = () => {
            toggleBtn.style.opacity = '1';
            toggleBtn.style.transform = 'translateY(-2px)';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(233, 69, 96, 0.3)';
            toggleBtn.style.background = 'rgba(233, 69, 96, 0.1)';
        };
        toggleBtn.onmouseleave = () => {
            toggleBtn.style.opacity = '0.7';
            toggleBtn.style.transform = 'translateY(0)';
            toggleBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            toggleBtn.style.background = 'rgba(30, 30, 30, 0.9)';
        };

        toggleBtn.onclick = () => {
            const existingPanel = document.getElementById('tool-panel');
            if (existingPanel) {
                existingPanel.remove();
                toggleBtn.style.display = 'block';
            } else {
                createUI();
                toggleBtn.style.display = 'none';
            }
        };

        document.body.appendChild(toggleBtn);
        log('토글 버튼 생성 완료');
    };

    // UI 생성
    const createUI = () => {
        // 기존 패널이 있으면 제거
        const existingPanel = document.getElementById('tool-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'tool-panel';
        panel.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 999999;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 3px solid #e94560; border-radius: 12px; padding: 20px;
            color: white; font-family: Arial, sans-serif; min-width: 350px;
            box-shadow: 0 8px 32px rgba(233, 69, 96, 0.4);
            max-height: 90vh; overflow-y: auto;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #e94560; text-align: center;">🔄 D2R 재등록/삭제 도구</h3>

            <!-- 재등록 통계 -->
            <div style="background: rgba(33, 150, 243, 0.1); border: 1px solid #2196F3; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 8px; color: #2196F3;">📈 재등록 통계</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13px;">
                    <div>성공: <span id="relist-success-count" style="color: #4CAF50;">0</span></div>
                    <div>실패: <span id="relist-fail-count" style="color: #f44336;">0</span></div>
                    <div>건너뜀: <span id="relist-skip-count" style="color: #FF9800;">0</span></div>
                </div>
            </div>

            <!-- 삭제 통계 -->
            <div style="background: rgba(244, 67, 54, 0.1); border: 1px solid #f44336; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 8px; color: #f44336;">🗑️ 삭제 통계</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 13px;">
                    <div>성공: <span id="remove-success-count" style="color: #4CAF50;">0</span></div>
                    <div>실패: <span id="remove-fail-count" style="color: #f44336;">0</span></div>
                    <div>건너뜀: <span id="remove-skip-count" style="color: #FF9800;">0</span></div>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div>상태: <span id="tool-status" style="color: #FFC107;">준비됨</span></div>
            </div>

            <!-- 타이밍 설정 -->
            <div style="background: rgba(255,193,7,0.1); border: 1px solid #FFC107; border-radius: 8px; padding: 12px; margin-bottom: 15px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px; color: #FFC107;">⚙️ 타이밍 설정</div>
                <div style="display: grid; grid-template-columns: 1fr 60px; gap: 8px; align-items: center; font-size: 12px;">
                    <label>클릭 딜레이(ms):</label>
                    <input type="number" id="click-delay" value="1500" min="100" max="10000" style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; padding: 4px; color: white; text-align: center;">
                    <label>스크롤 딜레이(ms):</label>
                    <input type="number" id="scroll-delay" value="800" min="100" max="5000" style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; padding: 4px; color: white; text-align: center;">
                    <label>더보기 딜레이(ms):</label>
                    <input type="number" id="loadmore-delay" value="2000" min="500" max="10000" style="background: rgba(255,255,255,0.1); border: 1px solid #555; border-radius: 4px; padding: 4px; color: white; text-align: center;">
                </div>
            </div>

            <!-- 기본 작업 -->
            <button id="load-all" style="width: 100%; background: #FF5722; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 8px;">📜 전체 로드</button>

            <div style="display: flex; gap: 8px; margin-bottom: 15px;">
                <button id="find-relist-buttons" style="flex: 1; background: #2196F3; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">🔍 재등록 버튼</button>
                <button id="find-remove-buttons" style="flex: 1; background: #f44336; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">🗑️ 삭제 버튼</button>
            </div>

            <!-- 실행 버튼 -->
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button id="start-relist-btn" style="flex: 1; background: #2196F3; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">▶ 재등록 시작</button>
                <button id="start-remove-btn" style="flex: 1; background: #f44336; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold;">🗑️ 삭제 시작</button>
            </div>

            <button id="stop-btn" style="width: 100%; background: #757575; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 15px;" disabled>⏹ 중지</button>

            <button id="close-btn" style="position: absolute; top: 8px; right: 8px; background: transparent; border: none; color: #888; cursor: pointer; font-size: 18px;">✕</button>
        `;

        document.body.appendChild(panel);

        // 이벤트 연결
        document.getElementById('close-btn').onclick = () => {
            panel.remove();
            const toggleBtn = document.getElementById('tool-toggle');
            if (toggleBtn) toggleBtn.style.display = 'block';
        };

        document.getElementById('load-all').onclick = loadAllContent;

        document.getElementById('find-relist-buttons').onclick = () => {
            relistButtons = findRelistButtons();
            updateStatus(`${relistButtons.length}개 재등록 버튼 발견`);
            log(`${relistButtons.length}개 재등록 버튼 발견`);
            // 자동으로 강조표시
            highlightButtons('relist');
        };

        document.getElementById('find-remove-buttons').onclick = () => {
            removeButtons = findRemoveButtons();
            updateStatus(`${removeButtons.length}개 삭제 버튼 발견`);
            log(`${removeButtons.length}개 삭제 버튼 발견`);
            // 자동으로 강조표시
            highlightButtons('remove');
        };
        
        document.getElementById('start-relist-btn').onclick = startRelist;
        document.getElementById('start-remove-btn').onclick = startRemove;
        document.getElementById('stop-btn').onclick = stopOperation;

        // 설정 변경
        document.getElementById('click-delay').oninput = e => CONFIG.clickDelay = parseInt(e.target.value) || 1500;
        document.getElementById('scroll-delay').oninput = e => CONFIG.scrollDelay = parseInt(e.target.value) || 800;
        document.getElementById('loadmore-delay').oninput = e => CONFIG.loadMoreDelay = parseInt(e.target.value) || 2000;

        log('UI 생성 완료');
    };

    // 키보드 단축키 (Ctrl+Shift+R)
    const setupKeyboard = () => {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                const toggleBtn = document.getElementById('tool-toggle');
                if (toggleBtn) toggleBtn.click();
            }
        });
    };

    // 초기화 (토글 버튼만 생성)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                createToggleButton();
                setupKeyboard();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            createToggleButton();
            setupKeyboard();
        }, 1000);
    }

    log('스크립트 로드 완료');

})();