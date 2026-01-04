// ==UserScript==
// @name         Auto Click Crystal Discord
// @namespace    asstars.tv.crystalclicker
// @version      1.5
// @description  Автоматический сбор кристаллов на страницах просмотра (АНИМЕ) и отправка уведомлений в Discord.
// @author       JerichoRPG & AI
// @match        https://asstars.tv/*
// @match        https://animestars.org/*
// @match        https://astars.club/*
// @match        https://asstars1.astars.club/*
// @match        https://as1.astars.club/*
// @match        https://as1.asstars.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asstars.tv
// @downloadURL https://update.greasyfork.org/scripts/538640/Auto%20Click%20Crystal%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/538640/Auto%20Click%20Crystal%20Discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Константы и глобальные переменные для скрипта кристаллов ---
    const ACC_SCRIPT_ENABLED_KEY = 'acc_scriptEnabledState';
    let crystalScriptEnabled = GM_getValue(ACC_SCRIPT_ENABLED_KEY, false);

    let crystalInfoPanel = null;
    let clickOnCrystalsTimeoutId = null;
    let preventTimeoutTimeoutId = null;
    let checkHeavenlyStoneIntervalIds = []; // Массив для ID интервалов checkHeavenlyStoneAfterClick
    const notificationSound = new Audio('/uploads/asss.mp3'); // Убедитесь, что путь корректен

    // --- Вспомогательные функции определения страницы ---
    function isOnPmPage() {
        return window.location.pathname.startsWith('/pm/');
    }

    function isVideoPage() {
        // Пример: адаптируйте под структуру URL вашего сайта для страниц с видео, где есть кристаллы
        return window.location.pathname.includes('/aniserials/videos/');
    }

    // --- Основная логика скрипта сбора кристаллов ---
    function startAutoClickCrystalScript() {
        if (isOnPmPage()) {
            console.log("ACC: Скрипт сбора кристаллов неактивен на /pm/ страницах.");
            stopAutoClickCrystalScript();
            return;
        }
        if (!isVideoPage()) {
            console.log("ACC: Скрипт сбора кристаллов запускается только на страницах (АНИМЕ).");
            stopActiveCrystalOperations(); // Убедимся, что все остановлено, если мы не на (АНИМЕ)
            return;
        }

        console.log("ACC: 🚀 Сбор кристаллов запущен");

        let lastClicked;
        const lastResetTimestamp = parseInt(GM_getValue('acc_lastClickedResetTimestamp', '0'), 10) || 0;
        const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (now - lastResetTimestamp > twentyFourHoursInMs) {
            console.log("ACC: ⏳ Прошло более 24 часов. 'lastClicked' и 'verifiedCrystalTransactions' будут сброшены.");
            lastClicked = {};
            GM_setValue('acc_lastClicked', JSON.stringify({}));
            GM_setValue('acc_verifiedCrystalTransactions', JSON.stringify({}));
            GM_setValue('acc_lastClickedResetTimestamp', now.toString());
        } else {
            const storedLastClicked = GM_getValue('acc_lastClicked', '{}');
            try {
                lastClicked = JSON.parse(storedLastClicked);
                if (typeof lastClicked !== 'object' || lastClicked === null) {
                    console.warn("ACC: ⚠️ 'lastClicked' из GM_getValue не является объектом. Сбрасываем.");
                    lastClicked = {}; GM_setValue('acc_lastClicked', JSON.stringify({}));
                }
            } catch (e) {
                console.error("ACC: 🚫 Ошибка парсинга 'lastClicked'. Используется пустой объект.", e);
                lastClicked = {}; GM_setValue('acc_lastClicked', JSON.stringify({}));
            }
        }

        let clickedCrystals = parseInt(GM_getValue('acc_clickedCrystals', '0'), 10) || 0;
        let collectedStones = parseInt(GM_getValue('acc_collectedStones', '0'), 10) || 0;
        let soundEnabled = GM_getValue('acc_soundEnabled', false);


        function tryClickFullscreenButton() {
            if (!crystalScriptEnabled || !isVideoPage()) return;
            const fullscreenButton = document.querySelector('.anime-player__fullscreen-btn');
            if (fullscreenButton) {
                fullscreenButton.click();
                console.log("ACC: 🔄 Кнопка полноэкранного режима найдена и нажата!");
                setTimeout(() => {
                    if (!crystalScriptEnabled || !isVideoPage()) return;
                    if (document.querySelector('.anime-player__fullscreen-btn')) {
                        document.querySelector('.anime-player__fullscreen-btn').click();
                        console.log("ACC: 🔄 Кнопка полноэкранного режима нажата снова!");
                    }
                }, 100);
            }
        }

        async function verifyAndCountCrystal() {
            if (!crystalScriptEnabled || !isVideoPage()) return;
            const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1380662498654556160/1bDkmWETIQn071n_5R1TEURQ5GS3nVDB4QSjub34pFhhSkHEc2P6CBz1yAkqJQ1Q9W92";
            console.log(`ACC: 🔍 Проверка транзакций на наличие нового камня...`);
            try {
                const response = await fetch('/transactions/');
                if (!response.ok) {
                    console.error(`ACC: 🚫 Ошибка загрузки /transactions/: ${response.status} ${response.statusText}`);
                    return;
                }
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');
                const transactionRows = doc.querySelectorAll('.ncard-transactions__table tbody tr.new-tr-item');
                let verifiedTransactionsOnPage = JSON.parse(GM_getValue('acc_verifiedCrystalTransactions', '{}')) || {};
                let foundAndProcessedNewStoneThisRun = false;
                let firstNewStoneTransactionTime = "";
                let newStonesFoundCountThisRun = 0;

                for (const row of transactionRows) {
                    const descriptionCell = row.querySelector('td:nth-child(3)');
                    const dateCell = row.querySelector('td.new-tr-date');
                    if (descriptionCell && dateCell && descriptionCell.textContent.trim() === "Найден небесный камень") {
                        const transactionFullDateTime = dateCell.textContent.trim();
                        if (!verifiedTransactionsOnPage[transactionFullDateTime]) {
                            console.log(`ACC: ✅ НОВАЯ транзакция ПОДТВЕРЖДЕНА: "Найден небесный камень" в ${transactionFullDateTime}`);
                            collectedStones++;
                            newStonesFoundCountThisRun++;
                            if (!firstNewStoneTransactionTime) {
                                firstNewStoneTransactionTime = transactionFullDateTime;
                            }
                            verifiedTransactionsOnPage[transactionFullDateTime] = true;
                            foundAndProcessedNewStoneThisRun = true;
                        }
                    }
                }

                if (foundAndProcessedNewStoneThisRun) {
                    const stonesDisplay = document.getElementById('acc_collectedStones');
                    if (stonesDisplay) stonesDisplay.textContent = collectedStones;
                    GM_setValue('acc_collectedStones', collectedStones.toString());
                    GM_setValue('acc_verifiedCrystalTransactions', JSON.stringify(verifiedTransactionsOnPage));

                    if (soundEnabled && typeof notificationSound !== 'undefined' && notificationSound.play) {
                        notificationSound.play().catch(e => console.error("ACC: Ошибка воспроизведения звука:", e));
                    }
                    console.log(`ACC: 🔊 За этот проход verifyAndCountCrystal собрано ${newStonesFoundCountThisRun} камней.`);

                    if (DISCORD_WEBHOOK_URL && !DISCORD_WEBHOOK_URL.includes("СЮДА_ВСТАВЬТЕ")) {
                        let userNameForDiscord = "Неизвестный пользователь";
                        if (typeof unsafeWindow.visitor_name !== 'undefined' && unsafeWindow.visitor_name) {
                            userNameForDiscord = unsafeWindow.visitor_name;
                        } else {
                            const userElement = document.querySelector('.lgn__name span');
                            if (userElement && userElement.textContent) userNameForDiscord = userElement.textContent.trim();
                        }
                        const discordMessageContent =
`**Сбор кристаллов**
Пользователь **${userNameForDiscord}** собрал небесный камень ${newStonesFoundCountThisRun === 1 ? 'небесный камень' : ``}!
Время появления камня
${firstNewStoneTransactionTime || "Неизвестно"}`;
                        const discordPayload = { content: discordMessageContent };
                        fetch(DISCORD_WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(discordPayload),
                        })
                        .then(response => {
                            if (!response.ok) {
                                response.json().then(errData => console.error('ACC: Ошибка Discord:', response.status, errData))
                                .catch(() => console.error('ACC: Ошибка Discord (no JSON):', response.status, response.statusText));
                            } else console.log('ACC: Сообщение в Discord отправлено.');
                        })
                        .catch(error => console.error('ACC: Сетевая ошибка Discord:', error));
                    } else console.warn("ACC: URL Discord Webhook не настроен.");
                } else console.log(`ACC: ⏳ Новые транзакции "Найден небесный камень" не найдены.`);
            } catch (error) {
                console.error("ACC: 🚫 Ошибка при проверке /transactions/:", error);
            }
        }

        function checkHeavenlyStoneAfterClick() {
            if (!crystalScriptEnabled || !isVideoPage()) return;
            const stoneRegex = /Вы нашли небесный камень духа/i;
            const missedStoneRegex = /К сожалению вы опоздали/i;
            const emptyStoneRegex = /Тут уже пусто/i;
            let checkAttempts = 0;
            const maxCheckAttempts = 20;
            const intervalId = setInterval(() => {
                if (!crystalScriptEnabled || !isVideoPage() || checkAttempts >= maxCheckAttempts) {
                    clearInterval(intervalId);
                    checkHeavenlyStoneIntervalIds = checkHeavenlyStoneIntervalIds.filter(id_ => id_ !== intervalId);
                    return;
                }
                checkAttempts++;
                let eventMessage = null;
                const customNotification = document.querySelector('.custom-card-notification'); // Если у вас есть свой кастомный
                if (customNotification && customNotification.style.top === '20px' && customNotification.textContent) {
                    const messageId = customNotification.textContent + "_" + (customNotification.dataset.lastShowTime || '');
                    if (customNotification.dataset.processedMessageId !== messageId) {
                        eventMessage = customNotification.textContent;
                        customNotification.dataset.processedMessageId = messageId;
                    }
                }
                if (!eventMessage) {
                    const originalNotificationNodes = document.querySelectorAll('#DLEPush .DLEPush-notification.wrapper');
                    originalNotificationNodes.forEach(notificationNode => {
                        if (eventMessage) return;
                        if (notificationNode.style.display === 'none' || notificationNode.dataset.interceptorProcessed === 'true') return;
                        const messageElement = notificationNode.querySelector('.DLEPush-message');
                        if (messageElement && messageElement.textContent) {
                            const originalMessageId = messageElement.textContent;
                            if (notificationNode.dataset.processedOriginalMessage !== originalMessageId) {
                                eventMessage = messageElement.textContent;
                                notificationNode.dataset.processedOriginalMessage = originalMessageId;
                                notificationNode.style.display = 'none';
                            }
                        }
                    });
                }
                if (eventMessage) {
                    if (stoneRegex.test(eventMessage)) console.log(`ACC: 💬 (DLE Уведомление) "Найден камень": "${eventMessage.substring(0,50)}..."`);
                    else if (missedStoneRegex.test(eventMessage)) console.log(`ACC: 🚫 (DLE Уведомление) "Камень пропущен": "${eventMessage.substring(0,50)}..."`);
                    else if (emptyStoneRegex.test(eventMessage)) console.log(`ACC: 💨 (DLE Уведомление) "Камень пуст": "${eventMessage.substring(0,50)}..."`);
                    if (stoneRegex.test(eventMessage) || missedStoneRegex.test(eventMessage) || emptyStoneRegex.test(eventMessage)) {
                        clearInterval(intervalId);
                        checkHeavenlyStoneIntervalIds = checkHeavenlyStoneIntervalIds.filter(id_ => id_ !== intervalId);
                    }
                }
            }, 500);
            checkHeavenlyStoneIntervalIds.push(intervalId);
        }

        function activateCrystalLogic() {
            if (isOnPmPage() || !isVideoPage()) { stopActiveCrystalOperations(); return; }
            if (!crystalScriptEnabled) { stopActiveCrystalOperations(); return; }

            setTimeout(tryClickFullscreenButton, 1500);

            if (crystalInfoPanel && crystalInfoPanel.parentNode) crystalInfoPanel.parentNode.removeChild(crystalInfoPanel);
            crystalInfoPanel = document.createElement('div');
            Object.assign(crystalInfoPanel.style, {
                position: 'absolute', top: '5px', right: '5px',
                backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
                padding: '10px', borderRadius: '25px', zIndex: '200', textAlign: 'center'
            });
            const crystalsContainer = document.createElement('div');
            crystalsContainer.innerHTML = `Кликнул <span id="acc_clickedCrystals">${clickedCrystals}</span> р.`;
            const stonesContainer = document.createElement('div');
            stonesContainer.innerHTML = `Собрал <span id="acc_collectedStones">${collectedStones}</span> шт.`;
            const soundToggleButton = document.createElement('button');
            Object.assign(soundToggleButton.style, {
                marginLeft: '5px', backgroundColor: soundEnabled ? '#4CAF50':'#ff4d4d', color:'#fff',
                border:'none',padding:'0',borderRadius:'11px',cursor:'pointer',
                fontSize:'14px',lineHeight:'1',height:'20px',width:'20px'
            });
            soundToggleButton.innerHTML = soundEnabled ? '🔊':'🔇';
            soundToggleButton.addEventListener('click', ()=>{
                soundEnabled = !soundEnabled;
                GM_setValue('acc_soundEnabled', soundEnabled);
                soundToggleButton.style.backgroundColor = soundEnabled ? '#4CAF50':'#ff4d4d';
                soundToggleButton.innerHTML = soundEnabled ? '🔊':'🔇';
                console.log(`ACC: 🔊 Звук ${soundEnabled ? 'вкл':'выкл'}`);
            });
            stonesContainer.appendChild(soundToggleButton);
            const clearButton = document.createElement('button');
            clearButton.textContent = 'х';
            Object.assign(clearButton.style, {
                marginLeft:'5px',backgroundColor:'#ff4d4d',color:'#fff',border:'none',
                padding:'0',borderRadius:'11px',cursor:'pointer',fontSize:'10px',
                lineHeight:'1',height:'20px',width:'20px'
            });
            clearButton.addEventListener('click', ()=>{
                GM_setValue('acc_lastClicked', JSON.stringify({})); lastClicked={};
                GM_setValue('acc_clickedCrystals', '0'); GM_setValue('acc_collectedStones', '0');
                GM_setValue('acc_verifiedCrystalTransactions', JSON.stringify({}));
                clickedCrystals=0; collectedStones=0;
                const cDisp = document.getElementById('acc_clickedCrystals'); if(cDisp)cDisp.textContent=0;
                const sDisp = document.getElementById('acc_collectedStones'); if(sDisp)sDisp.textContent=0;
                console.log("ACC: 🗑️ Данные очищены.");
            });
            crystalsContainer.appendChild(clearButton);
            crystalInfoPanel.appendChild(crystalsContainer); crystalInfoPanel.appendChild(stonesContainer);
            const playerCont = document.querySelector('#dle-player') || document.querySelector('.player-area') || document.querySelector('.video-player');
            if(playerCont){ playerCont.style.position='relative'; playerCont.appendChild(crystalInfoPanel); }
            else if(document.body){ document.body.appendChild(crystalInfoPanel); }

            function clickOnCrystals() {
                if (!crystalScriptEnabled || !isVideoPage()) {
                    if (clickOnCrystalsTimeoutId) clearTimeout(clickOnCrystalsTimeoutId);
                    clickOnCrystalsTimeoutId = null; return;
                }
                document.querySelectorAll(".lc_chat_li").forEach(msg => {
                    const diamond = msg.querySelector("#diamonds-chat");
                    if (diamond) {
                        const msgText = msg.textContent.trim();
                        const timeMatch = msgText.match(/(\d{2}:\d{2}:\d{2}|\d{2}:\d{2})/);
                        if (timeMatch) {
                            const timeKeyFromMessage = timeMatch[0];
                            const todayForMsgKey = new Date();
                            const day = String(todayForMsgKey.getDate()).padStart(2, '0');
                            const month = String(todayForMsgKey.getMonth() + 1).padStart(2, '0');
                            const year = todayForMsgKey.getFullYear();
                            const datePrefixForMsgKey = `${day}.${month}.${year}`;
                            const uniqueMessageKey = `${datePrefixForMsgKey} ${timeKeyFromMessage}`;
                            if (lastClicked[uniqueMessageKey]) return;

                            console.log("ACC: 💎 Клик по кристаллу (чат " + timeKeyFromMessage + ")");
                            diamond.click();
                            lastClicked[uniqueMessageKey] = true;
                            clickedCrystals++;
                            const cDispUpd = document.getElementById('acc_clickedCrystals');
                            if(cDispUpd) cDispUpd.textContent = clickedCrystals;
                            GM_setValue('acc_lastClicked',JSON.stringify(lastClicked));
                            GM_setValue('acc_clickedCrystals',clickedCrystals.toString());
                            setTimeout(() => verifyAndCountCrystal(), 5000);
                            checkHeavenlyStoneAfterClick();
                        }
                    }
                });
                clickOnCrystalsTimeoutId = setTimeout(clickOnCrystals, 5000);
            }

            function preventTimeout() {
                if (!crystalScriptEnabled || !isVideoPage()) {
                    if (preventTimeoutTimeoutId) clearTimeout(preventTimeoutTimeoutId);
                    preventTimeoutTimeoutId = null; return;
                }
                const afkBtn = document.querySelector(".lc_chat_timeout_imback,.timeout-button,.afk-return-button");
                if(afkBtn){ console.log("ACC: 🔄 Нажата AFK-кнопка."); afkBtn.click(); }
                preventTimeoutTimeoutId = setTimeout(preventTimeout, 10000);
            }

            if (clickOnCrystalsTimeoutId) clearTimeout(clickOnCrystalsTimeoutId);
            if (preventTimeoutTimeoutId) clearTimeout(preventTimeoutTimeoutId);
            clickOnCrystalsTimeoutId = setTimeout(clickOnCrystals, 2000);
            preventTimeoutTimeoutId = setTimeout(preventTimeout, 1000);
        }
        activateCrystalLogic();
    }

    function stopActiveCrystalOperations() {
        if (clickOnCrystalsTimeoutId) { clearTimeout(clickOnCrystalsTimeoutId); clickOnCrystalsTimeoutId = null; }
        if (preventTimeoutTimeoutId) { clearTimeout(preventTimeoutTimeoutId); preventTimeoutTimeoutId = null; }
        checkHeavenlyStoneIntervalIds.forEach(id => clearInterval(id));
        checkHeavenlyStoneIntervalIds = [];
        if (crystalInfoPanel && crystalInfoPanel.parentNode) {
            crystalInfoPanel.parentNode.removeChild(crystalInfoPanel);
            crystalInfoPanel = null;
        }
    }

    function stopAutoClickCrystalScript() {
        console.log("ACC: 🚫 Сбор кристаллов остановлен");
        stopActiveCrystalOperations();
    }

    // --- Создание кнопки управления скриптом кристаллов ---
    function createCrystalToggleButton() {
        if (isOnPmPage()) return; // Не создаем кнопку на /pm/

        const buttonId = 'acc_toggleCrystalScriptBtn';
        if (document.getElementById(buttonId)) return;

        const button = document.createElement('button');
        button.id = buttonId;
        button.title = 'Включить/Выключить сбор кристаллов';
        Object.assign(button.style, {
            position: 'fixed', bottom: '20px', left: '12px', zIndex: '200',
            fontSize: '15px', width: '40px', height: '40px', border: 'none', borderRadius: '50%',
            transition: 'background 0.3s ease, transform 0.1s ease',
            color: 'white', cursor: 'pointer', boxShadow: '0 0 10px rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0'
        });
        button.textContent = '💎';

        function updateButtonStyle() {
            button.style.background = crystalScriptEnabled ?
                'linear-gradient(145deg, rgb(50, 222, 50), rgb(50, 122, 50))' : // Зеленый
                'linear-gradient(145deg, rgb(220, 53, 69), rgb(180, 30, 45))';   // Красный
        }
        updateButtonStyle();

        button.addEventListener('click', () => {
            crystalScriptEnabled = !crystalScriptEnabled;
            GM_setValue(ACC_SCRIPT_ENABLED_KEY, crystalScriptEnabled);
            updateButtonStyle();
            if (crystalScriptEnabled) {
                if (isVideoPage()) {
                    startAutoClickCrystalScript();
                } else {
                    console.log("ACC: Сбор кристаллов активируется на странице просмотра (АНИМЕ).");
                    stopAutoClickCrystalScript(); // Убедимся, что остановлен, если не на видео
                }
            } else {
                stopAutoClickCrystalScript();
            }
        });
        document.body.appendChild(button);
    }

    // --- Инициализация ---
    if (!isOnPmPage()) { // Кнопку не создаем и не запускаем на /pm/
        createCrystalToggleButton();
        if (crystalScriptEnabled && isVideoPage()) {
            startAutoClickCrystalScript();
        } else if (crystalScriptEnabled && !isVideoPage()) {
            console.log("ACC: Скрипт включен, но не на странице (АНИМЕ). Активных операций нет.");
            stopActiveCrystalOperations(); // На всякий случай
        } else {
            stopActiveCrystalOperations(); // Если выключен
        }
    } else {
        // Если мы на /pm/, убедимся, что всё остановлено
        stopActiveCrystalOperations();
    }

})(); // Конец IIFE для всего скрипта