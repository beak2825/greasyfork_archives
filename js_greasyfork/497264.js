// ==UserScript==
// @name         Auto Click Enabled Button
// @name:zh-CN   自动点击启用按钮
// @name:en      Auto Click Enabled Button
// @name:hi      ऑटो क्लिक सक्षम बटन
// @name:fr      Bouton de clic automatique activé
// @name:ar      زر النقر التلقائي عند التمكين
// @name:bg      Автоматично кликване на активиран бутон
// @name:ru      Автоматическое нажатие на активированные кнопки
// @name:pt-BR   Botão de Clique Automático Habilitado
// @name:id      Tombol Klik Otomatis yang Diaktifkan
// @name:zh-TW   自動點擊啟用按鈕
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  This script detects and automatically clicks buttons that become enabled
// @description:en This script detects and automatically clicks buttons that become enabled. It has been tested and works correctly on the https://app.runwayml.com/* page.
// @description:zh-CN 这个脚本可以探测并自动点击变为可用状态的按钮。该脚本于 https://app.runwayml.com/* 页面测试正常运行。
// @description:hi यह स्क्रिप्ट बटन को पहचानती है और स्वचालित रूप से क्लिक करती है जो सक्षम हो जाते हैं। इसका परीक्षण https://app.runwayml.com/* पृष्ठ पर किया गया है और यह सही ढंग से काम करता है।
// @description:fr Ce script détecte et clique automatiquement sur les boutons qui deviennent activés. Il a été testé et fonctionne correctement sur la page https://app.runwayml.com/*.
// @description:ar يكتشف هذا البرنامج النصي الأزرار التي تصبح ممكّنة وينقر عليها تلقائيًا. تم اختباره ويعمل بشكل صحيح على صفحة https://app.runwayml.com/*.
// @description:bg Този скрипт открива и автоматично кликва върху бутони, които стават активни. Тестван е и работи правилно на страницата https://app.runwayml.com/*.
// @description:ru Этот скрипт обнаруживает и автоматически нажимает кнопки, которые становятся активными. Он был протестирован и работает правильно на странице https://app.runwayml.com/*.
// @description:pt-BR Este script detecta e clica automaticamente em botões que se tornam habilitados. Ele foi testado e funciona corretamente na página https://app.runwayml.com/*.
// @description:id Skrip ini mendeteksi dan mengklik tombol yang menjadi aktif secara otomatis. Skrip ini telah diuji dan berfungsi dengan baik di halaman https://app.runwayml.com/*.
// @description:zh-TW 此腳本可以檢測並自動點擊變為可用狀態的按鈕。經測試，該腳本在 https://app.runwayml.com/* 頁面上正常運行。
// @author       HDR10
// @match        https://*/*
// @match        https://app.runwayml.com/*
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/497264/Auto%20Click%20Enabled%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/497264/Auto%20Click%20Enabled%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 多语言支持的按钮文本
    const texts = {
        en: {
            title: "Auto Click Enabled Button",
            statusStopped: "Auto-clicking stopped",
            statusStarted: "Auto-clicking enabled",
            start: "Enable",
            stop: "Stop",
            clickLimit: "Stop after clicking:",
            clearLog: "Clear log",
            minimize: "Minimize"
        },
        "zh-CN": {
            title: "自动点击启用按钮",
            statusStopped: "自动点击已停止",
            statusStarted: "自动点击已启用",
            start: "启用",
            stop: "停止",
            clickLimit: "点击几次后停止:",
            clearLog: "清除log",
            minimize: "最小化"
        },
        hi: {
            title: "ऑटो क्लिक सक्षम बटन",
            statusStopped: "स्वचालित क्लिक बंद हो गया",
            statusStarted: "स्वचालित क्लिक सक्षम",
            start: "सक्षम करें",
            stop: "रोकें",
            clickLimit: "क्लिक करने के बाद रोकें:",
            clearLog: "लॉग साफ़ करें",
            minimize: "छोटा करें"
        },
        fr: {
            title: "Bouton de clic automatique activé",
            statusStopped: "Clic automatique arrêté",
            statusStarted: "Clic automatique activé",
            start: "Activer",
            stop: "Arrêter",
            clickLimit: "Arrêter après avoir cliqué:",
            clearLog: "Effacer le journal",
            minimize: "Minimiser"
        },
        ar: {
            title: "زر النقر التلقائي عند التمكين",
            statusStopped: "توقف النقر التلقائي",
            statusStarted: "تمكين النقر التلقائي",
            start: "تمكين",
            stop: "إيقاف",
            clickLimit: "توقف بعد النقر:",
            clearLog: "مسح السجل",
            minimize: "تصغير"
        },
        bg: {
            title: "Автоматично кликване на активиран бутон",
            statusStopped: "Автоматичното кликване е спряно",
            statusStarted: "Автоматичното кликване е активирано",
            start: "Активирай",
            stop: "Спри",
            clickLimit: "Спри след кликване:",
            clearLog: "Изчисти дневника",
            minimize: "Минимизирай"
        },
        ru: {
            title: "Автоматическое нажатие на активированные кнопки",
            statusStopped: "Автоклик остановлен",
            statusStarted: "Автоклик активирован",
            start: "Активировать",
            stop: "Остановить",
            clickLimit: "Остановить после кликов:",
            clearLog: "Очистить журнал",
            minimize: "Свернуть"
        },
        "pt-BR": {
            title: "Botão de Clique Automático Habilitado",
            statusStopped: "Clique automático parado",
            statusStarted: "Clique automático habilitado",
            start: "Habilitar",
            stop: "Parar",
            clickLimit: "Parar após clicar:",
            clearLog: "Limpar log",
            minimize: "Minimizar"
        },
        id: {
            title: "Tombol Klik Otomatis yang Diaktifkan",
            statusStopped: "Klik otomatis dihentikan",
            statusStarted: "Klik otomatis diaktifkan",
            start: "Aktifkan",
            stop: "Hentikan",
            clickLimit: "Berhenti setelah mengklik:",
            clearLog: "Hapus log",
            minimize: "Minimalkan"
        },
        "zh-TW": {
            title: "自動點擊啟用按鈕",
            statusStopped: "自動點擊已停止",
            statusStarted: "自動點擊已啟用",
            start: "啟用",
            stop: "停止",
            clickLimit: "點擊幾次後停止:",
            clearLog: "清除log",
            minimize: "最小化"
        }
    };

    // 获取浏览器语言，默认为英文
    const lang = navigator.language || navigator.userLanguage;
    const userLang = lang.startsWith('zh') ? (lang === 'zh-TW' ? 'zh-TW' : 'zh-CN') : (texts[lang] ? lang : 'en');
    const t = texts[userLang];

    // 创建浮窗
    const floatWindow = document.createElement('div');
    floatWindow.style.position = 'fixed';
    floatWindow.style.bottom = '10px';
    floatWindow.style.right = '10px';
    floatWindow.style.width = '400px';
    floatWindow.style.height = '250px';
    floatWindow.style.backgroundColor = 'white';
    floatWindow.style.border = '1px solid black';
    floatWindow.style.color = 'black';
    floatWindow.style.padding = '10px';
    floatWindow.style.overflowY = 'auto';
    floatWindow.style.zIndex = '10000';
    floatWindow.style.display = 'none'; // 初始状态为最小化
    floatWindow.innerHTML = `
        <div>
            <div id="dragHandle" style="width: 20px; height: 20px; background-color: gray; position: absolute; top: 5px; right: 5px; cursor: move;"></div>
            <h3>${t.title}</h3>
            <p id="statusLabel">${t.statusStopped}</p>
            <button id="startBtn">${t.start}</button>
            <button id="stopBtn">${t.stop}</button>
            <label for="clickLimit">${t.clickLimit}</label>
            <input type="number" id="clickLimit" value="0" min="0" style="width: 50px;">
            <div id="logContainer" style="height: 100px; background-color: white; border: 1px solid black; overflow-y: auto;"></div>
            <button id="clearLogBtn">${t.clearLog}</button>
            <button id="minimizeBtn">${t.minimize}</button>
        </div>
    `;
    document.body.appendChild(floatWindow);

    // 创建最小化图标
    const minimizeIcon = document.createElement('div');
    minimizeIcon.style.position = 'fixed';
    minimizeIcon.style.bottom = '10px';
    minimizeIcon.style.right = '10px';
    minimizeIcon.style.width = '40px';
    minimizeIcon.style.height = '40px';
    minimizeIcon.style.backgroundColor = 'white';
    minimizeIcon.style.border = '1px solid black';
    minimizeIcon.style.borderRadius = '50%';
    minimizeIcon.style.display = 'flex';
    minimizeIcon.style.alignItems = 'center';
    minimizeIcon.style.justifyContent = 'center';
    minimizeIcon.style.cursor = 'pointer';
    minimizeIcon.style.zIndex = '10000';
    minimizeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`;
    document.body.appendChild(minimizeIcon);

    let observer;
    let autoClickEnabled = false;
    let clickCount = 0;
    let clickLimit = 0;

    document.getElementById('startBtn').addEventListener('click', function() {
        autoClickEnabled = true;
        clickCount = 0;
        clickLimit = parseInt(document.getElementById('clickLimit').value, 10);
        document.getElementById('statusLabel').textContent = t.statusStarted;
        document.getElementById('statusLabel').style.color = 'green';
        minimizeIcon.style.backgroundColor = 'green';
        startObserving();
    });

    document.getElementById('stopBtn').addEventListener('click', function() {
        autoClickEnabled = false;
        document.getElementById('statusLabel').textContent = t.statusStopped;
        document.getElementById('statusLabel').style.color = 'black';
        minimizeIcon.style.backgroundColor = 'white';
        stopObserving();
    });

    document.getElementById('clearLogBtn').addEventListener('click', function() {
        document.getElementById('logContainer').innerHTML = '';
    });

    document.getElementById('minimizeBtn').addEventListener('click', function() {
        floatWindow.style.display = 'none';
        minimizeIcon.style.display = 'flex';
    });

    minimizeIcon.addEventListener('click', function() {
        floatWindow.style.display = 'block';
        minimizeIcon.style.display = 'none';
    });

    function startObserving() {
        const config = { attributes: true, childList: true, subtree: true };
        observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    const target = mutation.target;
                    if (target.tagName.toLowerCase() === 'button' && !target.disabled && autoClickEnabled) {
                        target.click();
                        clickCount++;
                        logClick(target);
                        if (clickLimit > 0 && clickCount >= clickLimit) {
                            autoClickEnabled = false;
                            document.getElementById('statusLabel').textContent = t.statusStopped;
                            document.getElementById('statusLabel').style.color = 'black';
                            minimizeIcon.style.backgroundColor = 'white';
                            stopObserving();
                        }
                    }
                }
            }
        });

        observer.observe(document.body, config);
    }

    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function logClick(target) {
        const logContainer = document.getElementById('logContainer');
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.textContent = `${timestamp} - 点击了按钮: ${target.innerText || target.id || 'Unknown'}`;
        logContainer.appendChild(logEntry);

        // 保持日志最多显示10行
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.firstChild);
        }

        // 自动滚动到最新日志
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // 拖动浮窗功能
    const dragHandle = document.getElementById('dragHandle');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    dragHandle.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = floatWindow.offsetLeft;
        initialY = floatWindow.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            floatWindow.style.left = initialX + dx + 'px';
            floatWindow.style.top = initialY + dy + 'px';
        }
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
})();
