// ==UserScript==
// @name         dak.gg 실시간 통계 필터링
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  RP 획득량과 픽률 기준으로 원하는 대로 필터링이 가능해집니다
// @author       wisenb
// @match        https://dak.gg/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532988/dakgg%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%ED%86%B5%EA%B3%84%20%ED%95%84%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/532988/dakgg%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%ED%86%B5%EA%B3%84%20%ED%95%84%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const applyFilter = () => {
        const minRp = parseFloat(localStorage.getItem('minRp')) || 0;
        const minPickRate = parseFloat(localStorage.getItem('minPickRate')) || 0;

        const rows = document.querySelectorAll('table tbody tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const rp = parseFloat(cells[3]?.textContent) || 0;
            const pickRateText = cells[4]?.textContent || '';
            const pickRate = parseFloat(pickRateText.replace('%', '')) || 0;

            const shouldShow = rp >= minRp && pickRate >= minPickRate;
            row.style.display = shouldShow ? '' : 'none';
        });
    };

    const handleInput = (e, key) => {
        let cleaned = e.target.value.replace(/[^\d.]/g, '');
        e.target.value = cleaned;
        localStorage.setItem(key, cleaned);
        applyFilter();
    };

    const createSettingsUI = () => {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '200px';
        container.style.right = '20px';
        container.style.backgroundColor = 'rgb(245, 245, 245)';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.zIndex = '10000';
        container.style.fontSize = '14px';
        container.style.width = '30px';
        container.style.minHeight = '30px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        container.style.borderRadius = '6px';

        const toggleButton = document.createElement('div');
        toggleButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18" style="cursor:pointer;">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
`;
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '5px';
        toggleButton.style.right = '5px';
        container.appendChild(toggleButton);

        const content = document.createElement('div');
        content.id = 'filter-content';
        content.style.marginTop = '24px';
        content.style.display = 'none';

        const rpLabel = document.createElement('label');
        rpLabel.textContent = '최소 RP 획득량: ';
        const rpInput = document.createElement('input');
        rpInput.type = 'text';
        rpInput.id = 'minRp';
        rpInput.value = localStorage.getItem('minRp') || '';
        handleInput({ target: rpInput }, 'minRp');
        rpInput.addEventListener('input', (e) => handleInput(e, 'minRp'));

        const pickRateLabel = document.createElement('label');
        pickRateLabel.textContent = '최소 픽률(%): ';
        const pickRateInput = document.createElement('input');
        pickRateInput.type = 'text';
        pickRateInput.id = 'minPickRate';
        pickRateInput.value = localStorage.getItem('minPickRate') || '';
        handleInput({ target: pickRateInput }, 'minPickRate');
        pickRateInput.addEventListener('input', (e) => handleInput(e, 'minPickRate'));

        const resetButton = document.createElement('button');
        resetButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>`;
        resetButton.style.marginTop = '5px';
        resetButton.onclick = () => {
            localStorage.removeItem('minRp');
            localStorage.removeItem('minPickRate');
            rpInput.value = '';
            pickRateInput.value = '';
            applyFilter();
        };

        const rpRow = document.createElement('div');
        rpRow.style.display = 'flex';
        rpRow.style.justifyContent = 'space-between';
        rpRow.style.alignItems = 'center';
        rpRow.style.marginBottom = '6px';
        rpInput.style.width = '40px';
        rpInput.style.borderRadius = '6px';
        rpInput.style.textAlign = 'right';
        rpInput.style.paddingRight = '4px';
        rpRow.appendChild(rpLabel);
        rpRow.appendChild(rpInput);
        content.appendChild(rpRow);

        const pickRateRow = document.createElement('div');
        pickRateRow.style.display = 'flex';
        pickRateRow.style.justifyContent = 'space-between';
        pickRateRow.style.alignItems = 'center';
        pickRateRow.style.marginBottom = '6px';
        pickRateInput.style.width = '40px';
        pickRateInput.style.borderRadius = '6px';
        pickRateInput.style.textAlign = 'right';
        pickRateInput.style.paddingRight = '4px';
        pickRateRow.appendChild(pickRateLabel);
        pickRateRow.appendChild(pickRateInput);
        content.appendChild(pickRateRow);

        content.appendChild(resetButton);
        container.appendChild(content);

        toggleButton.addEventListener('click', () => {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            container.style.width = isHidden ? '180px' : '30px';
        });

        document.body.appendChild(container);
        applyFilter();

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const topValue = Math.max(20, 200 - scrollY);
            container.style.top = `${topValue}px`;
        });
    };

    window.addEventListener('load', () => {
        let rowObserver;

        const initRowObserver = () => {
            const table = document.querySelector('table');
            if (!table) return;

            if (rowObserver) rowObserver.disconnect();

            rowObserver = new MutationObserver((mutations) => {
                
                applyFilter();
            });

            rowObserver.observe(table, {
                childList: true,
                subtree: true
            });
        };
        if (location.href.startsWith('https://dak.gg/er/statistics')) {
            if (!document.querySelector('#filter-content')) {
                createSettingsUI();
                applyFilter();
                initRowObserver();

            // 정렬 버튼 클릭 시 필터 재적용
            const sortTargets = ['티어', 'RP 획득', '픽률', '승률', 'TOP 3'];
            const ths = document.querySelectorAll('table thead tr th');
            ths.forEach(th => {
                const div = th.querySelector('div');
                if (div && sortTargets.includes(div.innerText.trim()) && !div.dataset.filterBound) {
                    div.dataset.filterBound = 'true';
                    div.addEventListener('click', () => {
                        requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            applyFilter();
                        });
                    });
                    });
                }
            });
            }
        }

        const observer = new MutationObserver(() => {
            const container = document.querySelector('#filter-content')?.parentElement;

            // 페이지 벗어날 경우 설정창 제거
            if (!location.href.startsWith('https://dak.gg/er/statistics')) {
                if (container) container.remove();
                return;
            }
            if (location.href.startsWith('https://dak.gg/er/statistics')) {
                if (!document.querySelector('#filter-content')) {
                    createSettingsUI();
                    applyFilter();
                }
            }
        });

        const title = document.querySelector('head > title');
        if (title) {
            observer.observe(title, { childList: true });
        }
    });
})();
