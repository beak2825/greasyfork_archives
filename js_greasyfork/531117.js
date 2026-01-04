// ==UserScript==
// @name         Perfetto Pin 区域高度调整
// @namespace    https://github.com/shadowwingz
// @version      0.2
// @description       调整 Perfetto Viewer 的 Pinned 区域高度，提供可视化控制按钮和实时比例显示
// @description:en    Adjust the height of Pinned area in Perfetto Viewer with visual controls and real-time percentage display
// @description:de    Passen Sie die Höhe des fixierten Bereichs im Perfetto Viewer mit visuellen Steuerelementen und Echtzeit-Prozentsatzanzeige an
// @description:es    Ajuste la altura del área fijada en Perfetto Viewer con controles visuales y visualización de porcentaje en tiempo real
// @description:fr    Ajustez la hauteur de la zone épinglée dans Perfetto Viewer avec des contrôles visuels et un affichage en temps réel du pourcentage
// @description:zh-CN 调整 Perfetto Viewer 的固定区域高度，提供可视化控制按钮和实时比例显示
// @description:ru    Настройте высоту закрепленной области в Perfetto Viewer с визуальными элементами управления и отображением процентов в реальном времени
// @description:ja    Perfetto Viewerのピン留め領域の高さを視覚的コントロールとリアルタイムパーセンテージ表示で調整
// @description:pt-BR Ajuste a altura da área fixada no Perfetto Viewer com controles visuais e exibição de porcentagem em tempo real
// @description:hi    Perfetto Viewer में पिन किए गए क्षेत्र की ऊंचाई को विज़ुअल नियंत्रण और रीयल-टाइम प्रतिशत प्रदर्शन के साथ समायोजित करें
// @description:ar    اضبط ارتفاع المنطقة المثبتة في Perfetto Viewer باستخدام عناصر تحكم مرئية وعرض النسبة المئوية في الوقت الفعلي
// @description:it    Regola l'altezza dell'area bloccata in Perfetto Viewer con controlli visivi e visualizzazione della percentuale in tempo reale
// @description:ko    시각적 컨트롤과 실시간 백분율 표시로 Perfetto Viewer의 고정 영역 높이 조정
// @author       shadowwingz
// @match        https://ui.perfetto.dev/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531117/Perfetto%20Pin%20%E5%8C%BA%E5%9F%9F%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/531117/Perfetto%20Pin%20%E5%8C%BA%E5%9F%9F%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentHeight = 40;
    const MIN_HEIGHT = 10;
    const MAX_HEIGHT = 90;
    const STEP = 5;

    // 创建控制容器
    const createControls = () => {
        const controls = document.createElement('div');
        controls.id = 'perfetto-pin-controls';
        
        GM_addStyle(`
            #perfetto-pin-controls {
                position: fixed;
                top: 70px;
                right: 25px;
                background: #fff;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 2147483647;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            #perfetto-pin-controls button {
                padding: 6px 12px;
                background: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            #perfetto-pin-controls button:hover {
                background: #1565c0;
            }
            #perfetto-pin-controls span {
                font-family: Roboto, Arial;
                font-size: 14px;
                color: #444;
                min-width: 50px;
                text-align: center;
            }
        `);

        return controls;
    };

    // 初始化界面
    const initUI = () => {
        if (document.getElementById('perfetto-pin-controls')) return;

        const controls = createControls();
        const status = document.createElement('span');
        status.textContent = '40%';
        
        const btnPlus = document.createElement('button');
        btnPlus.textContent = '+';
        const btnMinus = document.createElement('button');
        btnMinus.textContent = '-';

        controls.appendChild(btnMinus);
        controls.appendChild(status);
        controls.appendChild(btnPlus);
        
        // 插入到页面顶部容器
        const mainContainer = document.querySelector('body');
        if (mainContainer) {
            mainContainer.appendChild(controls);
        }

        // 功能实现
        const updateHeight = () => {
            const pinArea = document.querySelector('.pf-viewer-page__pinned-track-tree');
            if (pinArea) {
                pinArea.style.maxHeight = `${currentHeight}%`;
                status.textContent = `${currentHeight}%`;
            }
        };

        btnPlus.addEventListener('click', () => {
            currentHeight = Math.min(currentHeight + STEP, MAX_HEIGHT);
            updateHeight();
        });

        btnMinus.addEventListener('click', () => {
            currentHeight = Math.max(currentHeight - STEP, MIN_HEIGHT);
            updateHeight();
        });

        // 初始检查
        updateHeight();
    };

    // 使用MutationObserver确保动态加载后执行
    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.pf-viewer-page__pinned-track-tree')) {
            initUI();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    initUI();
})();