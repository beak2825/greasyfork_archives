// ==UserScript==
// @name         Ma.gl 인벤토리 요약
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ma.gl 인벤토리 요약 기능 (드래그 가능 UI, 접기 상태 유지, 토글 버튼, 크기 조절 가능)
// @author       wlstjr
// @match        https://ma.gl/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530689/Magl%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20%EC%9A%94%EC%95%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/530689/Magl%20%EC%9D%B8%EB%B2%A4%ED%86%A0%EB%A6%AC%20%EC%9A%94%EC%95%BD.meta.js
// ==/UserScript==
// aHR0cHM6Ly91cGRhdGUuZ3JlYXN5Zm9yay5vcmcvc2NyaXB0cy81MzA2ODgvTWFnbCUyMCVFQyU5RCVCOCVFQiVCMiVBNCVFRCU4NiVBMCVFQiVBNiVBQyUyMCVFQyU5QSU5NCVFQyU5NSVCRCUyMCUyMCVFQyU5RSU5MCVFQiU4RiU5OSVFQyU4MiVBQyVFQiU4MyVBNS51c2VyLmpz

(function() {
    'use strict';

    // 공통 변수 선언
    let isInventoryCollapsed = false; // 인벤토리 UI가 접혀있는지 여부 (true: 접힘, false: 펼침)
    let isInventoryUIVisible = true; // 인벤토리 UI 표시 여부 (true: 표시, false: 숨김)

    // 인벤토리 플로팅 UI를 생성하는 함수
    function createInventoryUI() {
        let ui = document.getElementById('inventory-floating-ui');
        if (!ui) {
            ui = document.createElement('div');
            ui.id = 'inventory-floating-ui';
            ui.style.position = 'fixed';
            ui.style.top = '60px';
            ui.style.left = '20px';
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

            // 크기 조절 핸들 추가
            const resizeHandle = document.createElement('div');
            resizeHandle.style.position = 'absolute';
            resizeHandle.style.bottom = '2px';
            resizeHandle.style.right = '2px';
            resizeHandle.style.width = '10px';
            resizeHandle.style.height = '10px';
            resizeHandle.style.background = '#555555';
            resizeHandle.style.cursor = 'se-resize'; // 우하단 크기 조절 커서
            ui.appendChild(resizeHandle);

            addDragFunctionality(ui, header);
            addResizeFunctionality(ui, resizeHandle);

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

    // UI ON/OFF 토글 버튼 생성 함수
    function createToggleUIButton() {
        let toggleUIButton = document.getElementById('inventory-toggle-ui-button');
        if (!toggleUIButton) {
            toggleUIButton = document.createElement('button');
            toggleUIButton.id = 'inventory-toggle-ui-button';
            toggleUIButton.textContent = 'UI ON';
            toggleUIButton.style.position = 'fixed';
            toggleUIButton.style.bottom = '10px';
            toggleUIButton.style.left = '10px';
            toggleUIButton.style.background = '#444444';
            toggleUIButton.style.color = '#d3d3d3';
            toggleUIButton.style.border = 'none';
            toggleUIButton.style.borderRadius = '3px';
            toggleUIButton.style.padding = '5px 10px';
            toggleUIButton.style.cursor = 'pointer';
            toggleUIButton.style.zIndex = '10001';
            toggleUIButton.style.fontFamily = 'Arial, sans-serif';

            toggleUIButton.addEventListener('click', () => {
                isInventoryUIVisible = !isInventoryUIVisible;
                const ui = document.getElementById('inventory-floating-ui');
                if (ui) {
                    ui.style.display = isInventoryUIVisible ? 'block' : 'none';
                }
                toggleUIButton.textContent = isInventoryUIVisible ? 'UI ON' : 'UI OFF';
                if (isInventoryUIVisible) {
                    summarizeInventory();
                }
            });

            document.body.appendChild(toggleUIButton);
        }
    }

    // 드래그 기능을 추가하는 함수
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

    // 크기 조절 기능을 추가하는 함수
    function addResizeFunctionality(element, handle) {
        let isResizing = false;
        let initialX, initialY;
        let initialWidth, initialHeight;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            initialX = e.clientX;
            initialY = e.clientY;
            initialWidth = parseInt(element.style.width) || 250;
            initialHeight = parseInt(element.style.height) || (isInventoryCollapsed ? element.offsetHeight : 300); // 접힌 상태 고려
            e.stopPropagation(); // 드래그와 충돌 방지
        });

        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                e.preventDefault();
                const newWidth = Math.max(initialWidth + (e.clientX - initialX), 150); // 최소 너비 150px
                const newHeight = Math.max(initialHeight + (e.clientY - initialY), 50); // 최소 높이 50px
                element.style.width = `${newWidth}px`;
                if (!isInventoryCollapsed) {
                    element.style.height = `${newHeight}px`; // 접혀있지 않을 때만 높이 조절
                }
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // 인벤토리 아이템을 요약하는 함수
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
        if (!isInventoryCollapsed && isInventoryUIVisible) {
            content.innerHTML = `${totalSlotsLine}<br>${totalItemsLine}` +
                (summaryLines ? '<br>' + summaryLines : '<br>아이템이 없습니다.');
        }
    }

    // 초기화 및 모니터링 함수
    function initialize() {
        const itemGrid = document.querySelector('.grid.grid-cols-2.gap-4');
        const inventoryUI = document.getElementById('inventory-floating-ui');

        createToggleUIButton();

        if (itemGrid && isInventoryUIVisible) {
            if (!inventoryUI) {
                summarizeInventory();
                const observer = new MutationObserver(() => summarizeInventory());
                observer.observe(itemGrid, { childList: true, subtree: true });
            }
        } else if (inventoryUI) {
            inventoryUI.remove();
        }
    }

    // 페이지 로드 시 및 주기적으로 초기화 실행
    window.addEventListener('load', initialize);
    setInterval(initialize, 1000);
    initialize();
})();