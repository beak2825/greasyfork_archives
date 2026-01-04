// ==UserScript==
// @name         Ma.gl 인벤토리 요약 & 자동사냥
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ma.gl 인벤토리 요약과 자동사냥 기능을 통합 (드래그 가능 UI, 접기 상태 유지, 크기 조절 가능, UI 토글)
// @author       wlstjr
// @match        https://ma.gl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530688/Magl%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20%EC%9A%94%EC%95%BD%20%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/530688/Magl%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20%EC%9A%94%EC%95%BD%20%20%EC%9E%90%EB%8F%99%EC%82%AC%EB%83%A5.meta.js
// ==/UserScript==

/*
마녀의 상점
어둠의 설원
비룡의 폭포
어둠의 평원
16일 밤의 폭포
여신상의 사이
황금
만월의 밤하늘 아래
별빛 밤하늘 아래
보름달 밤하늘 아래
푸른 하늘 아래
신비의 호수
수행자의 탑
보물 동굴
숲
늪지대

*/



(function() {
    'use strict';

    // 공통 변수 선언
    let isInventoryCollapsed = false;
    let isAutoHuntActive = false;
    let isUIToggleActive = true; // UI가 기본적으로 활성화 상태

    // UI 토글 버튼 생성 함수
    function createUIToggleButton() {
        let toggleButton = document.getElementById('ui-toggle-button');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'ui-toggle-button';
            toggleButton.textContent = 'UI 끄기'; // 초기 상태: UI가 보이는 상태
            toggleButton.style.position = 'fixed';
            toggleButton.style.bottom = '10px'; // 하단에서 10px 떨어짐
            toggleButton.style.left = '10px'; // 좌측에서 10px 떨어짐
            toggleButton.style.zIndex = '10001'; // 다른 UI 위에 표시
            toggleButton.style.background = '#444444';
            toggleButton.style.color = '#d3d3d3';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '3px';
            toggleButton.style.padding = '5px 10px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.fontFamily = 'Arial, sans-serif';

            toggleButton.addEventListener('click', () => {
                isUIToggleActive = !isUIToggleActive;
                toggleButton.textContent = isUIToggleActive ? 'UI 끄기' : 'UI 켜기';
                toggleUIElements();
            });

            document.body.appendChild(toggleButton);
        }
    }

    // UI 요소 토글 함수
    function toggleUIElements() {
        const inventoryUI = document.getElementById('inventory-floating-ui');
        const autoHuntUI = document.getElementById('autohunt-container');

        if (inventoryUI) inventoryUI.style.display = isUIToggleActive ? 'block' : 'none';
        if (autoHuntUI) autoHuntUI.style.display = isUIToggleActive ? 'block' : 'none';
    }

    // 인벤토리 플로팅 UI 생성 함수
    function createInventoryUI() {
        let ui = document.getElementById('inventory-floating-ui');
        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'inventory-floating-ui';
            ui.style.position = 'fixed';
            ui.style.top = '60px';
            ui.style.left = '200px';
            ui.style.background = 'rgba(0, 0, 0, 0.9)';
            ui.style.color = '#d3d3d3';
            ui.style.padding = '10px';
            ui.style.borderRadius = '5px';
            ui.style.zIndex = '10000';
            ui.style.fontFamily = 'Arial, sans-serif';
            ui.style.fontSize = '14px';
            ui.style.maxHeight = '70vh';
            ui.style.overflowY = 'auto';
            ui.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
            ui.style.width = '250px';
            ui.style.userSelect = 'none';
            ui.style.display = isUIToggleActive ? 'block' : 'none'; // 초기 표시 상태 적용

            const header = document.createElement('div');
            header.style.background = '#333333';
            header.style.padding = '5px';
            header.style.cursor = 'move';
            header.style.borderBottom = '1px solid #555';
            header.textContent = '인벤토리 요약';
            header.style.fontWeight = 'bold';
            header.style.color = '#d3d3d3';
            ui.appendChild(header);

            const content = document.createElement('div');
            content.id = 'inventory-summary-content';
            content.style.padding = '5px';
            ui.appendChild(content);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'X';
            toggleButton.style.position = 'absolute';
            toggleButton.style.top = '5px';
            toggleButton.style.right = '5px';
            toggleButton.style.background = '#444444';
            toggleButton.style.color = '#d3d3d3';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '3px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.padding = '2px 6px';
            ui.appendChild(toggleButton);

            addDragFunctionality(ui, header);

            toggleButton.addEventListener('click', () => {
                isInventoryCollapsed = !isInventoryCollapsed;
                if (isInventoryCollapsed) {
                    content.style.display = 'none';
                    ui.style.padding = '0';
                    ui.style.height = `${header.offsetHeight}px`;
                    ui.style.overflowY = 'hidden';
                    toggleButton.textContent = '+';
                } else {
                    content.style.display = 'block';
                    ui.style.padding = '10px';
                    ui.style.height = 'auto';
                    ui.style.maxHeight = '70vh';
                    ui.style.overflowY = 'auto';
                    toggleButton.textContent = 'X';
                    summarizeInventory();
                }
            });

            document.body.appendChild(ui);
        }
        return ui.querySelector('#inventory-summary-content');
    }

    // 자동사냥 UI 생성 함수
    function createAutoHuntUI() {
        let container = document.getElementById('autohunt-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'autohunt-container';
            container.style.position = 'fixed';
            container.style.left = '10px';
            container.style.top = '60px';
            container.style.zIndex = '9999';
            container.style.background = '#000000';
            container.style.padding = '5px';
            container.style.border = '1px solid #555';
            container.style.borderRadius = '5px';
            container.style.userSelect = 'none';
            container.style.color = '#d3d3d3';
            container.style.display = isUIToggleActive ? 'block' : 'none'; // 초기 표시 상태 적용

            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'OFF';
            toggleButton.style.display = 'block';
            toggleButton.style.marginBottom = '5px';
            toggleButton.style.background = '#444444';
            toggleButton.style.color = '#d3d3d3';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '3px';
            toggleButton.style.padding = '2px 6px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.onclick = function() {
                isAutoHuntActive = !isAutoHuntActive;
                toggleButton.textContent = isAutoHuntActive ? 'ON' : 'OFF';
            };
            container.appendChild(toggleButton);

            const inputBox = document.createElement('textarea');
            inputBox.id = 'autohunt-input';
            inputBox.style.width = '160px';
            inputBox.style.height = '400px';
            inputBox.style.resize = 'none';
            inputBox.style.background = '#222222';
            inputBox.style.color = '#d3d3d3';
            inputBox.style.border = '1px solid #555';
            inputBox.style.borderRadius = '3px';
            inputBox.style.padding = '5px';
            inputBox.placeholder = '사냥터입력\n위쪽=높은우선순위\n아래=낮은우선순위\n(예시)\n마녀\n황금\n늪지대';
            container.appendChild(inputBox);

            const resizeHandle = document.createElement('div');
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.bottom = '0';
            resizeHandle.style.right = '0';
            resizeHandle.style.width = '10px';
            resizeHandle.style.height = '10px';
            resizeHandle.style.background = '#555555';
            resizeHandle.style.cursor = 'se-resize';
            container.appendChild(resizeHandle);

            addDragFunctionality(container, container);
            addResizeFunctionality(container, resizeHandle, inputBox, toggleButton);

            document.body.appendChild(container);
        }
    }

    // 드래그 기능 추가
    function addDragFunctionality(element, handle) {
        let isDragging = false;
        let currentX = parseInt(element.style.left) || 0;
        let currentY = parseInt(element.style.top) || 0;
        let initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                element.style.left = `${currentX}px`;
                element.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 크기 조절 기능 추가
    function addResizeFunctionality(container, handle, inputBox, toggleButton) {
        let isResizing = false;
        let resizeInitialX, resizeInitialY;
        let initialWidth = 150;
        let initialHeight = 100;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeInitialX = e.clientX;
            resizeInitialY = e.clientY;
            initialWidth = parseInt(inputBox.style.width) || 150;
            initialHeight = parseInt(inputBox.style.height) || 100;
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                e.preventDefault();
                let newWidth = initialWidth + (e.clientX - resizeInitialX);
                let newHeight = initialHeight + (e.clientY - resizeInitialY);
                newWidth = Math.max(newWidth, 100);
                newHeight = Math.max(newHeight, 50);
                inputBox.style.width = `${newWidth}px`;
                inputBox.style.height = `${newHeight}px`;
                container.style.width = `${newWidth + 10}px`;
                container.style.height = `${newHeight + toggleButton.offsetHeight + 15}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // 인벤토리 요약 함수
    function summarizeInventory() {
        const itemGrid = document.querySelector('.grid.grid-cols-2.gap-4');
        if (!itemGrid) return;

        const items = itemGrid.querySelectorAll('div[data-state="closed"] > div');
        const itemCountMap = {};
        let totalSlots = 0;
        let totalItems = 0;

        items.forEach(item => {
            const nameElement = item.querySelector('.text-sm.font-medium span');
            const stackElement = item.querySelector('.absolute.top-1.right-1');

            if (nameElement) {
                const itemName = nameElement.textContent.trim();
                let stackCount = 1;

                if (stackElement && stackElement.textContent.startsWith('x')) {
                    stackCount = parseInt(stackElement.textContent.replace('x', '')) || 1;
                }

                itemCountMap[itemName] = (itemCountMap[itemName] || 0) + stackCount;
                totalSlots += 1;
                totalItems += stackCount;
            }
        });

        const summaryLines = Object.entries(itemCountMap)
            .map(([name, count]) => `${name} ${count}개`)
            .join('<br>');
        const totalSlotsLine = `총 칸 수: ${totalSlots}칸`;
        const totalItemsLine = `총 아이템 수: ${totalItems}개`;

        const content = createInventoryUI();
        if (!isInventoryCollapsed) {
            content.innerHTML = `${totalSlotsLine}<br>${totalItemsLine}` +
                (summaryLines ? '<br>' + summaryLines : '<br>아이템이 없습니다.');
        }
    }

    // 버튼 클릭 함수
    function clickMatchingButtons() {
        if (!isAutoHuntActive) return;

        const inputBox = document.querySelector('#autohunt-input');
        if (!inputBox) return;

        let keywords = inputBox.value.split('\n').map(k => k.trim()).filter(k => k);
        if (keywords.length === 0) return;

        let buttons = [...document.querySelectorAll('button')];
        for (let keyword of keywords) {
            let matchedButton = buttons.find(btn => btn.textContent.includes(keyword));
            if (matchedButton) {
                matchedButton.click();
                break;
            }
        }
    }

    // 초기화 함수
    function initialize() {
        const itemGrid = document.querySelector('.grid.grid-cols-2.gap-4');
        const inventoryUI = document.getElementById('inventory-floating-ui');

        if (itemGrid) {
            if (!inventoryUI) {
                summarizeInventory();
                const observer = new MutationObserver(() => summarizeInventory());
                observer.observe(itemGrid, { childList: true, subtree: true });
            }
        } else if (inventoryUI) {
            inventoryUI.remove();
        }

        createUIToggleButton(); // UI 토글 버튼 생성
        createAutoHuntUI();
        setInterval(clickMatchingButtons, 100);
    }

    // 페이지 로드 시 초기화
    window.addEventListener('load', initialize);
    setInterval(initialize, 1000);
    initialize();
})();