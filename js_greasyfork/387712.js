// ==UserScript==
// @name         NetFunnel BomB (Debug Version)
// @version      0.4
// @author       You
// @description  NetFunnel BomB Script with Debug Features
// @match        http://*/*
// @match        https://*/*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/319515
// @downloadURL https://update.greasyfork.org/scripts/387712/NetFunnel%20BomB%20%28Debug%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387712/NetFunnel%20BomB%20%28Debug%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 디버그 로그 함수 (화면에 표시)
    function debugLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('ko-KR');
        const logMessage = `[${timestamp}] ${message}`;

        // 콘솔에 출력
        console.log(`[NetFunnel BomB] ${logMessage}`);

        // 화면에 디버그 패널 표시
        showDebugPanel(logMessage, type);
    }

    // 화면에 디버그 정보 표시
    function showDebugPanel(message, type) {
        let panel = document.getElementById('netfunnel-debug-panel');

        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'netfunnel-debug-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.9);
                color: #00ff00;
                padding: 15px;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                z-index: 999999;
                max-width: 350px;
                max-height: 400px;
                overflow-y: auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            `;

            // 닫기 버튼 추가
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
            `;
            closeBtn.onclick = () => panel.remove();
            panel.appendChild(closeBtn);

            const title = document.createElement('div');
            title.textContent = '🔧 NetFunnel Debug';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #ffff00;
                border-bottom: 1px solid #444;
                padding-bottom: 5px;
            `;
            panel.appendChild(title);

            const logContainer = document.createElement('div');
            logContainer.id = 'netfunnel-logs';
            panel.appendChild(logContainer);

            document.body.appendChild(panel);
        }

        const logContainer = document.getElementById('netfunnel-logs');
        if (logContainer) {
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '5px';
            logEntry.style.padding = '3px';
            logEntry.style.borderLeft = `3px solid ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff4444' : '#00aaff'}`;
            logEntry.style.paddingLeft = '8px';
            logEntry.textContent = message;

            logContainer.insertBefore(logEntry, logContainer.firstChild);

            // 최대 20개 로그만 유지
            while (logContainer.children.length > 20) {
                logContainer.removeChild(logContainer.lastChild);
            }
        }
    }

    // 환경 정보 수집
    function collectEnvironmentInfo() {
        debugLog('=== 환경 정보 수집 시작 ===', 'info');
        debugLog(`URL: ${window.location.href}`, 'info');
        debugLog(`User-Agent: ${navigator.userAgent}`, 'info');
        debugLog(`WebView 여부: ${isWebView() ? 'YES' : 'NO'}`, isWebView() ? 'success' : 'info');

        // NetFunnel 객체 존재 확인
        const netFunnelExists = typeof NetFunnel !== 'undefined';
        debugLog(`NetFunnel 객체: ${netFunnelExists ? '발견됨 ✓' : '없음 ✗'}`, netFunnelExists ? 'success' : 'error');

        if (netFunnelExists) {
            debugLog(`NetFunnel 속성: ${Object.keys(NetFunnel).join(', ')}`, 'info');
        }

        // unsafeWindow 확인
        const hasUnsafeWindow = typeof unsafeWindow !== 'undefined';
        debugLog(`unsafeWindow: ${hasUnsafeWindow ? '사용 가능 ✓' : '없음 ✗'}`, hasUnsafeWindow ? 'success' : 'error');
    }

    // WebView 감지
    function isWebView() {
        const ua = navigator.userAgent;
        return /wv|WebView|Version.*Chrome|;/.test(ua) ||
               /Android.*AppleWebKit(?!.*Safari)/.test(ua) ||
               /iPhone|iPad|iPod/.test(ua) && !window.MSStream && !navigator.standalone;
    }

    // NetFunnel Bomb 실행
    function funnelBomb() {
        debugLog('NetFunnel BomB 실행 시작...', 'success');

        let successCount = 0;
        const macro = setInterval(function() {
            try {
                const target = typeof unsafeWindow !== 'undefined' && unsafeWindow.NetFunnel
                    ? unsafeWindow.NetFunnel
                    : (typeof NetFunnel !== 'undefined' ? NetFunnel : null);

                if (target) {
                    target.TS_BYPASS = true;
                    target.TS_AUTO_COMPLETE = true;
                    target.TS_NWAIT_BYPASS = true;
                    target.TS_MAX_NWAIT_COUNT = 0;
                    successCount++;

                    if (successCount === 1) {
                        debugLog('NetFunnel 우회 설정 적용 완료! ✓', 'success');
                    }
                } else {
                    debugLog('NetFunnel 객체를 찾을 수 없습니다.', 'error');
                }
            } catch (e) {
                debugLog(`오류 발생: ${e.message}`, 'error');
            }
        }, 100);

        setTimeout(function() {
            clearInterval(macro);
            debugLog(`NetFunnel BomB 종료 (총 ${successCount}회 적용)`, 'info');
        }, 300000); // 5분
    }

    // 메인 실행 함수
    function main() {
        debugLog('🚀 스크립트 로드 완료!', 'success');

        // 환경 정보 수집
        collectEnvironmentInfo();

        // NetFunnel 객체 확인 및 즉시 설정
        const target = typeof unsafeWindow !== 'undefined' && unsafeWindow.NetFunnel
            ? unsafeWindow.NetFunnel
            : (typeof NetFunnel !== 'undefined' ? NetFunnel : null);

        if (target) {
            debugLog('NetFunnel 발견! 즉시 우회 설정 적용 중...', 'success');
            try {
                target.TS_BYPASS = true;
                target.TS_AUTO_COMPLETE = true;
                target.TS_NWAIT_BYPASS = true;
                target.TS_MAX_NWAIT_COUNT = 0;
                debugLog('초기 우회 설정 완료! ✓', 'success');
                funnelBomb();
            } catch (e) {
                debugLog(`오류: ${e.message}`, 'error');
            }
        } else {
            debugLog('NetFunnel 객체 없음. 동적 로드 감지 시작...', 'info');

            // NetFunnel이 나중에 로드될 경우를 위한 감시
            const checkInterval = setInterval(() => {
                const dynamicTarget = typeof unsafeWindow !== 'undefined' && unsafeWindow.NetFunnel
                    ? unsafeWindow.NetFunnel
                    : (typeof NetFunnel !== 'undefined' ? NetFunnel : null);

                if (dynamicTarget) {
                    debugLog('NetFunnel 동적 로드 감지! 우회 시작...', 'success');
                    clearInterval(checkInterval);
                    dynamicTarget.TS_BYPASS = true;
                    dynamicTarget.TS_AUTO_COMPLETE = true;
                    dynamicTarget.TS_NWAIT_BYPASS = true;
                    dynamicTarget.TS_MAX_NWAIT_COUNT = 0;
                    funnelBomb();
                }
            }, 500);

            // 30초 후 감시 중단
            setTimeout(() => {
                clearInterval(checkInterval);
                debugLog('NetFunnel 감지 타임아웃 (30초)', 'error');
            }, 30000);
        }
    }

    // 페이지 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();
