// ==UserScript==
// @name         NextDNS Tools by @AntiKeks
// @namespace    http://tampermonkey.net/
// @version      8.4
// @description  Импорт hosts и очистка записей NextDNS
// @author       AntiKeks
// @license      AGPLv3
// @match        https://my.nextdns.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538350/NextDNS%20Tools%20by%20%40AntiKeks.user.js
// @updateURL https://update.greasyfork.org/scripts/538350/NextDNS%20Tools%20by%20%40AntiKeks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let configId = null;

    // ⚡ Настройки производительности
    const PERFORMANCE_SETTINGS = {
        BURST_SIZE: 58,
        REST_DELAY: 5000,
        BATCH_SIZE_DELETE: 4,
        BATCH_SIZE_IMPORT: 4,
        MAX_RETRIES: 15,
        INITIAL_RETRY_DELAY: 500,
        MAX_RETRY_DELAY: 30000,
        BACKOFF_MULTIPLIER: 1.3,
        RATE_LIMIT_EXTRA_DELAY: 1000,
        INITIAL_COOLDOWN: 1000,
        PROGRESSIVE_DELAYS: [
            { range: [1, 8], delay: 1000 },
            { range: [9, 16], delay: 700 },
            { range: [17, 25], delay: 400 },
            { range: [26, 35], delay: 200 },
            { range: [36, 45], delay: 50 },
            { range: [46, 58], delay: 10 }
        ]
    };

    function isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function extractConfigId() {
        const path = window.location.pathname;
        const match = path.match(/\/([a-f0-9]{6})/);
        if (match) {
            configId = match[1];
            return configId;
        }
        return null;
    }

    function getThemeColors() {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        const bgColor = computedStyle.backgroundColor;
        
        const isDark = bgColor === 'rgb(33, 37, 41)' || 
                       bgColor === 'rgb(52, 58, 64)' || 
                       body.classList.contains('dark') ||
                       document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
            return {
                background: '#343a40',
                border: '#495057',
                text: '#ffffff'
            };
        } else {
            return {
                background: '#f8f9fa',
                border: '#dee2e6', 
                text: '#212529'
            };
        }
    }

    function getProgressiveDelay(position) {
        for (const delayConfig of PERFORMANCE_SETTINGS.PROGRESSIVE_DELAYS) {
            if (position >= delayConfig.range[0] && position <= delayConfig.range[1]) {
                return delayConfig.delay;
            }
        }
        return 10;
    }

    function parseRetryAfter(retryAfterHeader) {
        if (!retryAfterHeader) return null;
        const seconds = parseInt(retryAfterHeader);
        if (!isNaN(seconds)) {
            return seconds * 1000;
        }
        try {
            const retryDate = new Date(retryAfterHeader);
            const now = new Date();
            const delay = retryDate.getTime() - now.getTime();
            return Math.max(delay, 500);
        } catch (e) {
            return null;
        }
    }

    class RetryTracker {
        constructor() {
            this.successCount = 0;
            this.errorCount = 0;
            this.currentlyRetrying = 0;
            this.totalRetriesAttempted = 0;
            this.retrySuccessCount = 0;
            this.retryFailureCount = 0;
        }

        startRetrying() {
            this.currentlyRetrying++;
        }

        retrySuccess(totalAttempts) {
            this.currentlyRetrying--;
            this.successCount++;
            if (totalAttempts > 1) {
                this.totalRetriesAttempted += (totalAttempts - 1);
                this.retrySuccessCount++;
            }
        }

        retryFailure(totalAttempts) {
            this.currentlyRetrying--;
            this.errorCount++;
            if (totalAttempts > 1) {
                this.totalRetriesAttempted += (totalAttempts - 1);
                this.retryFailureCount++;
            }
        }

        firstAttemptSuccess() {
            this.successCount++;
        }

        firstAttemptFailure() {
            this.errorCount++;
        }
    }

    async function smartRetryWrapper(asyncFunction, itemName = 'запрос', tracker = null, updateCallback = null) {
        let lastError = null;
        let retryDelay = PERFORMANCE_SETTINGS.INITIAL_RETRY_DELAY;
        let isInRetry = false;
        
        for (let attempt = 1; attempt <= PERFORMANCE_SETTINGS.MAX_RETRIES; attempt++) {
            try {
                if (attempt === 2 && tracker && !isInRetry) {
                    tracker.startRetrying();
                    isInRetry = true;
                    if (updateCallback) updateCallback();
                }

                const result = await asyncFunction();
                return { success: true, result, attempts: attempt, wasRetrying: isInRetry };
                
            } catch (error) {
                lastError = error;
                
                if (attempt === PERFORMANCE_SETTINGS.MAX_RETRIES) {
                    return { success: false, error: lastError, attempts: attempt, wasRetrying: isInRetry };
                }
                
                let waitTime = retryDelay;
                
                if (error.status === 429) {
                    const retryAfter = parseRetryAfter(error.retryAfter);
                    if (retryAfter) {
                        waitTime = retryAfter + PERFORMANCE_SETTINGS.RATE_LIMIT_EXTRA_DELAY;
                    } else {
                        waitTime = retryDelay * 2;
                    }
                } else if (error.status === 404) {
                    return { success: false, error: lastError, attempts: attempt, wasRetrying: isInRetry };
                }
                
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retryDelay = Math.min(retryDelay * PERFORMANCE_SETTINGS.BACKOFF_MULTIPLIER, PERFORMANCE_SETTINGS.MAX_RETRY_DELAY);
            }
        }
        
        return { success: false, error: lastError, attempts: PERFORMANCE_SETTINGS.MAX_RETRIES, wasRetrying: isInRetry };
    }

    async function smartDeleteRewrite(rewrite, tracker, updateCallback) {
        return await smartRetryWrapper(async () => {
            const response = await fetch(`https://api.nextdns.io/profiles/${configId}/rewrites/${rewrite.id}`, {
                method: 'DELETE',
                headers: { 'Accept': '*/*', 'Origin': 'https://my.nextdns.io', 'Referer': window.location.href },
                credentials: 'include',
                mode: 'cors'
            });

            if (response.ok || response.status === 204) {
                return { rewrite };
            } else {
                let errorText = '';
                if (response.status !== 204) {
                    try { errorText = await response.text(); } catch (e) { errorText = 'Не удалось прочитать ошибку'; }
                }
                const error = new Error(`HTTP ${response.status}: ${errorText}`);
                error.status = response.status;
                error.retryAfter = response.headers.get('Retry-After');
                throw error;
            }
        }, `удаление ${rewrite.name}`, tracker, updateCallback);
    }

    async function smartCreateRewrite(rewrite, tracker, updateCallback) {
        return await smartRetryWrapper(async () => {
            const response = await fetch(`https://api.nextdns.io/profiles/${configId}/rewrites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'https://my.nextdns.io', 'Referer': window.location.href },
                body: JSON.stringify({ name: rewrite.name, content: rewrite.content }),
                credentials: 'include',
                mode: 'cors'
            });

            if (response.ok) {
                return { rewrite, result: await response.json() };
            } else {
                let errorText = '';
                try { errorText = await response.text(); } catch (e) { errorText = 'Не удалось прочитать ошибку'; }
                const error = new Error(`HTTP ${response.status}: ${errorText}`);
                error.status = response.status;
                error.retryAfter = response.headers.get('Retry-After');
                throw error;
            }
        }, `создание ${rewrite.name}`, tracker, updateCallback);
    }

    function createEmbeddedInterface() {
        const themeColors = getThemeColors();
        
        const style = document.createElement('style');
        style.textContent = `
            #antikeks-tools-embedded {
                background-color: ${themeColors.background} !important;
                color: ${themeColors.text} !important;
            }
            
            #antikeks-tools-embedded div[style*="background: linear-gradient"] > div {
                background-color: transparent !important;
            }

            #antikeks-tools-embedded *:not(.btn):not(.btn-success):not(.btn-danger):not(.btn-warning):not(div[style*="background: linear-gradient"] > div) {
                background-color: ${themeColors.background} !important;
                color: ${themeColors.text} !important;
            }
            
            #antikeks-tools-embedded .btn-outline-secondary {
                background-color: transparent !important;
                border-color: ${themeColors.border} !important;
                color: ${themeColors.text} !important;
            }
            
            #antikeks-tools-embedded .btn-outline-secondary:hover {
                background-color: ${themeColors.border} !important;
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'antikeks-tools-embedded';
        container.style.cssText = `
            background: ${themeColors.background} !important;
            color: ${themeColors.text} !important;
            border: 1px solid ${themeColors.border};
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
            transition: all 0.3s ease;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 15px;
            background: ${themeColors.background} !important;
            ${isMobile() ? 'flex-direction: column;' : ''}
        `;

        const importBtn = document.createElement('button');
        importBtn.className = 'btn btn-success btn-sm';
        importBtn.textContent = 'Import hosts';
        importBtn.style.cssText = `
            ${isMobile() ? 'padding: 12px; font-size: 16px;' : 'padding: 8px 16px; font-size: 14px;'}
            font-weight: 600;
        `;

        // ✅ НОВАЯ жёлтая кнопка экспорта
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-warning btn-sm';
        exportBtn.textContent = 'Export hosts';
        exportBtn.style.cssText = `
            ${isMobile() ? 'padding: 12px; font-size: 16px;' : 'padding: 8px 16px; font-size: 14px;'}
            font-weight: 600;
        `;

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn btn-danger btn-sm';
        clearBtn.textContent = 'Clear all';
        clearBtn.style.cssText = `
            ${isMobile() ? 'padding: 12px; font-size: 16px;' : 'padding: 8px 16px; font-size: 14px;'}
            font-weight: 600;
        `;

        const contentContainer = document.createElement('div');
        contentContainer.id = 'content-area';
        contentContainer.style.cssText = `
            min-height: 0; 
            overflow: hidden; 
            transition: all 0.3s ease;
            background: ${themeColors.background} !important;
        `;

        const authorDiv = document.createElement('div');
        authorDiv.style.cssText = `
            text-align: center;
            margin-top: 10px;
            font-size: 12px;
            color: #6c757d;
            background: ${themeColors.background} !important;
        `;
        authorDiv.innerHTML = `
            by <a href="https://4pda.to/forum/index.php?showuser=7613164" target="_blank" 
                 style="color: #6c757d; text-decoration: none;">@AntiKeks</a>
        `;

        buttonContainer.appendChild(importBtn);
        buttonContainer.appendChild(exportBtn);  // ✅ Добавляем экспорт между импортом и очисткой
        buttonContainer.appendChild(clearBtn);
        container.appendChild(buttonContainer);
        container.appendChild(contentContainer);
        container.appendChild(authorDiv);

        return { container, importBtn, exportBtn, clearBtn, contentContainer };
    }

    // ✅ НОВАЯ функция экспорта в формат hosts
    async function exportToClipboard(contentContainer) {
        try {
            contentContainer.style.minHeight = '80px';
            contentContainer.innerHTML = `
                <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #ffeaa7;">
                    <div style="color: #856404; font-weight: 600; font-size: 16px; margin-bottom: 8px; background-color: transparent !important;">📤 Экспорт записей</div>
                    <div style="color: #856404; font-size: 14px; background-color: transparent !important;">Загружаем записи...</div>
                </div>
            `;

            // Получаем все записи
            const rewrites = await getAllRewrites();
            
            if (rewrites.length === 0) {
                showMessage(contentContainer, 'Нет записей для экспорта', 'warning');
                return;
            }

            // Формируем hosts формат
            const hostsContent = rewrites.map(rewrite => `${rewrite.content} ${rewrite.name}`).join('\n');
            
            // Добавляем заголовок
            const exportContent = `# NextDNS Rewrites Export\n# Config ID: ${configId}\n# Exported: ${new Date().toLocaleString()}\n# Total entries: ${rewrites.length}\n\n${hostsContent}`;

            // Копируем в буфер обмена
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(exportContent);
                
                contentContainer.innerHTML = `
                    <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #c3e6cb;">
                        <div style="color: #155724; font-weight: 600; font-size: 16px; margin-bottom: 8px; background-color: transparent !important;">✅ Экспорт завершён!</div>
                        <div style="color: #155724; font-size: 14px; background-color: transparent !important; margin-bottom: 10px;">
                            Скопировано ${rewrites.length} записей в буфер обмена
                        </div>
                        <div style="color: #155724; font-size: 12px; background-color: transparent !important;">
                            Config ID: <code>${configId}</code>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button id="close-export" class="btn btn-outline-secondary" style="padding: 8px 16px; font-size: 14px;">Закрыть</button>
                    </div>
                `;

                document.getElementById('close-export').addEventListener('click', () => {
                    hideInterface(contentContainer);
                });

            } else {
                // Fallback для старых браузеров/WebView
                const textArea = document.createElement('textarea');
                textArea.value = exportContent;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                contentContainer.innerHTML = `
                    <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #c3e6cb;">
                        <div style="color: #155724; font-weight: 600; font-size: 16px; margin-bottom: 8px; background-color: transparent !important;">✅ Экспорт завершён!</div>
                        <div style="color: #155724; font-size: 14px; background-color: transparent !important; margin-bottom: 10px;">
                            Скопировано ${rewrites.length} записей в буфер обмена (legacy mode)
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <button id="close-export" class="btn btn-outline-secondary" style="padding: 8px 16px; font-size: 14px;">Закрыть</button>
                    </div>
                `;

                document.getElementById('close-export').addEventListener('click', () => {
                    hideInterface(contentContainer);
                });
            }

        } catch (error) {
            showMessage(contentContainer, `Ошибка экспорта: ${error.message}`, 'error');
        }
    }

    function showImportInterface(contentContainer) {
        const themeColors = getThemeColors();
        contentContainer.style.minHeight = isMobile() ? '320px' : '280px';
        contentContainer.innerHTML = `
            <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #c3e6cb;">
                <div style="color: #155724; font-weight: 600; font-size: 16px; margin-bottom: 8px; background-color: transparent !important;">Импорт hosts файла</div>
                <div style="color: #155724; font-size: 14px; background-color: transparent !important;">Config ID: <code>${configId}</code></div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display: block; color: ${themeColors.text};">Содержимое hosts файла:</label>
                <textarea id="hosts-input" style="
                    width: 100%; 
                    height: ${isMobile() ? '150px' : '120px'}; 
                    border: 2px solid #28a745; 
                    border-radius: 6px; 
                    padding: 12px; 
                    font-family: 'Courier New', monospace; 
                    font-size: 12px; 
                    resize: vertical;
                    background: ${themeColors.background};
                    color: ${themeColors.text};
                " placeholder="157.240.245.174 instagram.com&#10;157.240.245.174 www.instagram.com&#10;3.66.189.153 protonmail.com&#10;&#10;# Комментарии игнорируются"></textarea>
            </div>
            
            <div style="display: flex; gap: 12px; margin-bottom: 15px; ${isMobile() ? 'flex-direction: column;' : ''}">
                <label style="display: flex; align-items: center; font-size: 14px; color: ${themeColors.text};">
                    <input type="checkbox" id="skip-localhost" checked style="margin-right: 8px; transform: ${isMobile() ? 'scale(1.3)' : 'scale(1)'};"> 
                    Пропускать localhost записи
                </label>
                <label style="display: flex; align-items: center; font-size: 14px; color: ${themeColors.text};">
                    <input type="checkbox" id="skip-www" checked style="margin-right: 8px; transform: ${isMobile() ? 'scale(1.3)' : 'scale(1)'};"> 
                    Пропускать www.домены
                </label>
            </div>
            
            <div style="display: flex; gap: 12px; ${isMobile() ? 'flex-direction: column;' : 'justify-content: flex-end;'}">
                <button id="cancel-import" class="btn btn-outline-secondary" style="padding: ${isMobile() ? '12px 24px' : '8px 16px'}; font-size: 14px;">Отмена</button>
                <button id="start-import" class="btn btn-success" style="padding: ${isMobile() ? '12px 24px' : '8px 16px'}; font-size: 14px; font-weight: 600;">Импортировать</button>
            </div>
        `;

        document.getElementById('cancel-import').addEventListener('click', () => {
            hideInterface(contentContainer);
        });

        document.getElementById('start-import').addEventListener('click', () => {
            const content = document.getElementById('hosts-input').value.trim();
            const skipLocalhost = document.getElementById('skip-localhost').checked;
            const skipWww = document.getElementById('skip-www').checked;
            
            if (!content) {
                showMessage(contentContainer, 'Введите содержимое hosts файла', 'warning');
                return;
            }
            
            processHostsFile(content, skipLocalhost, skipWww, contentContainer);
        });

        setTimeout(() => document.getElementById('hosts-input').focus(), 100);
    }

    function showClearInterface(contentContainer) {
        getAllRewrites().then(rewrites => {
            if (rewrites.length === 0) {
                showMessage(contentContainer, 'Нет записей для удаления', 'info');
                return;
            }

            const burstCount = Math.ceil(rewrites.length / PERFORMANCE_SETTINGS.BURST_SIZE);
            const estimatedTime = Math.ceil((burstCount * PERFORMANCE_SETTINGS.REST_DELAY / 1000) / 60);

            contentContainer.style.minHeight = isMobile() ? '280px' : '240px';
            contentContainer.innerHTML = `
                <div style="background: #f8d7da; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #f5c6cb;">
                    <div style="color: #721c24; font-weight: 600; font-size: 16px; margin-bottom: 8px; background-color: transparent !important;">⚠️ Удаление всех записей</div>
                    <div style="color: #721c24; font-size: 14px; background-color: transparent !important;">Будут удалены ВСЕ записи: <strong>${rewrites.length} записей</strong></div>
                </div>
                
                <div style="background: #e2e3e5; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #d6d8db;">
                    <div style="color: #383d41; font-size: 14px; line-height: 1.4; background-color: transparent !important;">
                        • Всплесков: ${burstCount} по ${PERFORMANCE_SETTINGS.BURST_SIZE} записей<br>
                        • Время между всплесками: ${PERFORMANCE_SETTINGS.REST_DELAY/1000} сек<br>
                        • Примерное время: ~${estimatedTime} мин<br>
                        • Повторы при ошибках: до ${PERFORMANCE_SETTINGS.MAX_RETRIES} попыток
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; font-size: 14px; color: #721c24;">
                        <input type="checkbox" id="confirm-clear" style="margin-right: 12px; transform: ${isMobile() ? 'scale(1.3)' : 'scale(1)'};"> 
                        Я понимаю, что все ${rewrites.length} записей будут безвозвратно удалены
                    </label>
                </div>
                
                <div style="display: flex; gap: 12px; ${isMobile() ? 'flex-direction: column;' : 'justify-content: flex-end;'}">
                    <button id="cancel-clear" class="btn btn-outline-secondary" style="padding: ${isMobile() ? '12px 24px' : '8px 16px'}; font-size: 14px;">Отмена</button>
                    <button id="start-clear" class="btn btn-danger" style="padding: ${isMobile() ? '12px 24px' : '8px 16px'}; font-size: 14px; font-weight: 600;" disabled>Удалить все</button>
                </div>
            `;

            const confirmCheck = document.getElementById('confirm-clear');
            const startBtn = document.getElementById('start-clear');

            confirmCheck.addEventListener('change', () => {
                startBtn.disabled = !confirmCheck.checked;
            });

            document.getElementById('cancel-clear').addEventListener('click', () => {
                hideInterface(contentContainer);
            });

            document.getElementById('start-clear').addEventListener('click', () => {
                clearAllRewrites(rewrites, contentContainer);
            });

        }).catch(error => {
            showMessage(contentContainer, `Ошибка получения записей: ${error.message}`, 'error');
        });
    }
    
    function showProgressInterface(contentContainer, title, type) {
        const bgColor = type === 'import' ? '#28a745' : '#dc3545';
        contentContainer.style.minHeight = isMobile() ? '180px' : '140px';
        contentContainer.innerHTML = `
            <div style="
                background: linear-gradient(135deg, ${bgColor}, ${bgColor}dd);
                color: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            ">
                <div style="font-size: ${isMobile() ? '20px' : '18px'}; font-weight: 600; margin-bottom: 15px; background-color: transparent !important;">${title}</div>
                
                <div id="status-text" style="font-size: 14px; margin-bottom: 8px; opacity: 0.9; background-color: transparent !important;">Подготовка...</div>
                <div id="speed-text" style="font-size: 12px; margin-bottom: 15px; opacity: 0.8; background-color: transparent !important;">Режим: готовность</div>
                
                <div style="background: rgba(255,255,255,0.3); border-radius: 6px; height: 12px; margin-bottom: 15px; overflow: hidden;">
                    <div id="progress-fill" style="background: #fff; height: 100%; border-radius: 6px; width: 0%; transition: width 0.3s ease;"></div>
                </div>
                
                <div id="progress-text" style="font-size: 14px; opacity: 0.9; margin-bottom: 8px; background-color: transparent !important;">0 записей (✅ 0, ❌ 0, 🔄 0)</div>
                <div id="burst-text" style="font-size: 12px; opacity: 0.8; background-color: transparent !important;">Всплесков: 0/0</div>
            </div>
        `;
    }

    function updateProgressInterface(totalProcessed, totalItems, tracker, currentBurst, totalBursts, phase = 'processing', speedPhase = '', countdown = null) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const statusText = document.getElementById('status-text');
        const speedText = document.getElementById('speed-text');
        const burstText = document.getElementById('burst-text');

        if (!progressFill) return;

        const percentage = (totalProcessed / totalItems) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `${totalProcessed} записей (✅ ${tracker.successCount}, ❌ ${tracker.errorCount}, 🔄 ${tracker.currentlyRetrying})`;
        burstText.textContent = `Всплесков: ${currentBurst}/${totalBursts}`;

        if (phase === 'processing') {
            statusText.textContent = `Всплеск ${currentBurst}/${totalBursts} - обработка...`;
            speedText.textContent = `Режим: ${speedPhase}`;
            progressFill.style.background = '#fff';
        } else if (phase === 'resting') {
            if (countdown) {
                statusText.textContent = `Отдых между всплесками... ${countdown}с`;
                speedText.textContent = `Следующий всплеск: медленный старт`;
            } else {
                statusText.textContent = `Отдых между всплесками...`;
                speedText.textContent = `Готовимся к следующему всплеску...`;
            }
            progressFill.style.background = '#ffeb3b';
        } else {
            statusText.textContent = `Всплеск ${currentBurst}/${totalBursts} завершен`;
            speedText.textContent = `Финиш: быстро`;
            progressFill.style.background = '#4caf50';
        }
    }

    function showMessage(contentContainer, message, type = 'info', autoReload = false) {
        const colors = {
            info: { bg: '#cce7ff', border: '#99d6ff', text: '#0056b3' },
            warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' }
        };

        const color = colors[type] || colors.info;
        const themeColors = getThemeColors();
        contentContainer.style.cssText += `background: ${themeColors.background} !important;`;
        contentContainer.style.minHeight = '80px';
        
        if (autoReload) {
            contentContainer.innerHTML = `
                <div style="
                    background: ${color.bg};
                    border: 1px solid ${color.border};
                    color: ${color.text};
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 14px;
                    margin-bottom: 15px;
                ">${message}<br><br>
                <div id="countdown" style="font-weight: 600; font-size: 16px; background-color: transparent !important;">Перезагрузка через 3 секунды...</div>
                </div>
            `;
            
            let seconds = 3;
            const countdownElement = document.getElementById('countdown');
            const interval = setInterval(() => {
                seconds--;
                if (seconds > 0) {
                    countdownElement.textContent = `Перезагрузка через ${seconds} ${seconds === 1 ? 'секунду' : 'секунды'}...`;
                } else {
                    countdownElement.textContent = 'Перезагрузка...';
                    clearInterval(interval);
                }
            }, 1000);
            
        } else {
            contentContainer.innerHTML = `
                <div style="
                    background: ${color.bg};
                    border: 1px solid ${color.border};
                    color: ${color.text};
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    font-size: 14px;
                    margin-bottom: 15px;
                ">${message}</div>
                <div style="text-align: center; background: ${themeColors.background} !important;">
                    <button id="close-message" class="btn btn-outline-secondary" style="padding: 8px 16px; font-size: 14px;">Закрыть</button>
                </div>
            `;

            document.getElementById('close-message').addEventListener('click', () => {
                hideInterface(contentContainer);
            });
        }
    }

    function hideInterface(contentContainer) {
        contentContainer.style.minHeight = '0';
        contentContainer.innerHTML = '';
    }

    function addButtons() {
        const newRewriteButton = document.querySelector('button[type="button"].btn.btn-primary.btn-sm');
        
        if (newRewriteButton && newRewriteButton.textContent.trim().toUpperCase() === 'NEW REWRITE') {
            const existingContainer = document.querySelector('#antikeks-tools-embedded');
            if (existingContainer) return;

            const { container, importBtn, exportBtn, clearBtn, contentContainer } = createEmbeddedInterface();

            importBtn.addEventListener('click', () => {
                extractConfigId();
                if (!configId) {
                    showMessage(contentContainer, 'Не удалось определить Config ID', 'error');
                    return;
                }
                showImportInterface(contentContainer);
            });

            // ✅ Обработчик для жёлтой кнопки экспорта
            exportBtn.addEventListener('click', () => {
                extractConfigId();
                if (!configId) {
                    showMessage(contentContainer, 'Не удалось определить Config ID', 'error');
                    return;
                }
                exportToClipboard(contentContainer);
            });

            clearBtn.addEventListener('click', () => {
                extractConfigId();
                if (!configId) {
                    showMessage(contentContainer, 'Не удалось определить Config ID', 'error');
                    return;
                }
                showClearInterface(contentContainer);
            });

            if (isMobile()) {
                newRewriteButton.parentNode.parentNode.insertBefore(container, newRewriteButton.parentNode.nextSibling);
            } else {
                newRewriteButton.parentNode.insertBefore(container, newRewriteButton.nextSibling);
            }
        }
    }

    async function getAllRewrites() {
        const response = await fetch(`https://api.nextdns.io/profiles/${configId}/rewrites`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Origin': 'https://my.nextdns.io', 'Referer': window.location.href },
            credentials: 'include',
            mode: 'cors'
        });

        if (response.ok) {
            const result = await response.json();
            return result.data || [];
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    }

    async function clearAllRewrites(rewrites, contentContainer) {
        const bursts = [];
        for (let i = 0; i < rewrites.length; i += PERFORMANCE_SETTINGS.BURST_SIZE) {
            bursts.push(rewrites.slice(i, i + PERFORMANCE_SETTINGS.BURST_SIZE));
        }

        showProgressInterface(contentContainer, 'Удаление записей', 'clear');
        await new Promise(resolve => setTimeout(resolve, PERFORMANCE_SETTINGS.INITIAL_COOLDOWN));

        const tracker = new RetryTracker();
        let totalItemsProcessed = 0;

        for (let burstIndex = 0; burstIndex < bursts.length; burstIndex++) {
            const burst = bursts[burstIndex];
            const isLastBurst = burstIndex === bursts.length - 1;

            updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing');

            const batchSize = PERFORMANCE_SETTINGS.BATCH_SIZE_DELETE;
            for (let i = 0; i < burst.length; i += batchSize) {
                const batch = burst.slice(i, i + batchSize);
                const positionInBurst = i + 1;
                const currentDelay = getProgressiveDelay(positionInBurst);

                let phase = 'медленно';
                if (positionInBurst >= 36) phase = 'очень быстро';
                else if (positionInBurst >= 26) phase = 'быстро';
                else if (positionInBurst >= 17) phase = 'средне';
                else if (positionInBurst >= 9) phase = 'медленно';

                const promises = batch.map(async (rewrite) => {
                    const result = await smartDeleteRewrite(rewrite, tracker, () => {
                        updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing', phase);
                    });

                    if (result.success) {
                        if (result.wasRetrying) {
                            tracker.retrySuccess(result.attempts);
                        } else {
                            tracker.firstAttemptSuccess();
                        }
                    } else {
                        if (result.wasRetrying) {
                            tracker.retryFailure(result.attempts);
                        } else {
                            tracker.firstAttemptFailure();
                        }
                    }
                    return result;
                });

                await Promise.all(promises);
                totalItemsProcessed += batch.length;
                updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing', phase);

                if (i + batchSize < burst.length) {
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                }
            }

            updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'completed');

            if (!isLastBurst) {
                updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'resting');
                for (let countdown = PERFORMANCE_SETTINGS.REST_DELAY / 1000; countdown > 0; countdown--) {
                    updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'resting', '', countdown);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        setTimeout(() => {
            let message = `Очистка завершена!<br><br>✅ Удалено: ${tracker.successCount}<br>❌ Ошибок: ${tracker.errorCount}`;
            if (tracker.totalRetriesAttempted > 0) {
                message += `<br>🔄 Повторов: ${tracker.totalRetriesAttempted} (успешных: ${tracker.retrySuccessCount})`;
            }
            
            showMessage(contentContainer, message, tracker.successCount > 0 ? 'success' : 'error', tracker.successCount > 0);
            
            if (tracker.successCount > 0) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }, 2000);
    }

    function isValidDomain(domain) {
        if (!domain || domain.length === 0 || domain.length > 253) return false;
        const pattern = /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)*[a-zA-Z0-9][a-zA-Z0-9-]{0,62}[a-zA-Z0-9]$/;
        return !domain.includes('..') && !domain.startsWith('.') && !domain.endsWith('.') && pattern.test(domain);
    }

    function isValidIP(ip) {
        const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$/;
        return ipv4.test(ip) || ipv6.test(ip);
    }

    function formatDomain(domain) {
        return domain.replace(/^www\./, '').trim().toLowerCase();
    }

    function removeDuplicatesAndWww(rewrites, skipWww) {
        const seen = new Map();
        const result = [];

        for (const rewrite of rewrites) {
            const domain = rewrite.name;
            const ip = rewrite.content;
            const key = `${domain}->${ip}`;

            if (seen.has(key)) continue;

            const mainDomain = domain.replace(/^www\./, '');
            if (skipWww && domain.startsWith('www.')) {
                const mainKey = `${mainDomain}->${ip}`;
                if (seen.has(mainKey)) continue;
            } else if (skipWww) {
                const wwwKey = `www.${domain}->${ip}`;
                if (seen.has(wwwKey)) {
                    const index = result.findIndex(r => r.name === `www.${domain}` && r.content === ip);
                    if (index > -1) result.splice(index, 1);
                }
            }

            seen.set(key, true);
            result.push(rewrite);
        }

        return result;
    }

    function processHostsFile(content, skipLocalhost, skipWww, contentContainer) {
        const lines = content.split('\n');
        const rawRewrites = [];

        lines.forEach((line) => {
            line = line.trim();
            if (line.startsWith('#') || line === '') return;

            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const ip = parts[0].trim();
                const domain = formatDomain(parts[1].trim());

                if (skipLocalhost && (ip === '127.0.0.1' || ip === '::1' || domain === 'localhost')) return;
                if (isValidDomain(domain) && isValidIP(ip)) {
                    rawRewrites.push({ name: domain, content: ip });
                }
            }
        });

        const rewrites = removeDuplicatesAndWww(rawRewrites, skipWww);

        if (rewrites.length === 0) {
            showMessage(contentContainer, 'Нет валидных записей для импорта', 'warning');
            return;
        }

        importRewrites(rewrites, contentContainer);
    }

    async function importRewrites(rewrites, contentContainer) {
        const bursts = [];
        for (let i = 0; i < rewrites.length; i += PERFORMANCE_SETTINGS.BURST_SIZE) {
            bursts.push(rewrites.slice(i, i + PERFORMANCE_SETTINGS.BURST_SIZE));
        }

        showProgressInterface(contentContainer, 'Импорт записей', 'import');
        await new Promise(resolve => setTimeout(resolve, PERFORMANCE_SETTINGS.INITIAL_COOLDOWN));

        const tracker = new RetryTracker();
        let totalItemsProcessed = 0;

        for (let burstIndex = 0; burstIndex < bursts.length; burstIndex++) {
            const burst = bursts[burstIndex];
            const isLastBurst = burstIndex === bursts.length - 1;

            updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing');

            const batchSize = PERFORMANCE_SETTINGS.BATCH_SIZE_IMPORT;
            for (let i = 0; i < burst.length; i += batchSize) {
                const batch = burst.slice(i, i + batchSize);
                const positionInBurst = i + 1;
                const currentDelay = getProgressiveDelay(positionInBurst);

                let phase = 'медленно';
                if (positionInBurst >= 36) phase = 'очень быстро';
                else if (positionInBurst >= 26) phase = 'быстро';
                else if (positionInBurst >= 17) phase = 'средне';
                else if (positionInBurst >= 9) phase = 'медленно';

                const promises = batch.map(async (rewrite) => {
                    const result = await smartCreateRewrite(rewrite, tracker, () => {
                        updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing', phase);
                    });

                    if (result.success) {
                        if (result.wasRetrying) {
                            tracker.retrySuccess(result.attempts);
                        } else {
                            tracker.firstAttemptSuccess();
                        }
                    } else {
                        if (result.wasRetrying) {
                            tracker.retryFailure(result.attempts);
                        } else {
                            tracker.firstAttemptFailure();
                        }
                    }
                    return result;
                });

                await Promise.all(promises);
                totalItemsProcessed += batch.length;
                updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex, bursts.length, 'processing', phase);

                if (i + batchSize < burst.length) {
                    await new Promise(resolve => setTimeout(resolve, currentDelay));
                }
            }

            updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'completed');

            if (!isLastBurst) {
                updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'resting');
                for (let countdown = PERFORMANCE_SETTINGS.REST_DELAY / 1000; countdown > 0; countdown--) {
                    updateProgressInterface(totalItemsProcessed, rewrites.length, tracker, burstIndex + 1, bursts.length, 'resting', '', countdown);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        setTimeout(() => {
            let message = `Импорт завершен!<br><br>✅ Успешно: ${tracker.successCount}<br>❌ Ошибок: ${tracker.errorCount}`;
            if (tracker.totalRetriesAttempted > 0) {
                message += `<br>🔄 Повторов: ${tracker.totalRetriesAttempted} (успешных: ${tracker.retrySuccessCount})`;
            }
            
            showMessage(contentContainer, message, tracker.successCount > 0 ? 'success' : 'error', tracker.successCount > 0);
            
            if (tracker.successCount > 0) {
                setTimeout(() => window.location.reload(), 3000);
            }
        }, 2000);
    }

    function init() {
        extractConfigId();
        
        function waitForElement() {
            if (document.querySelector('button[type="button"].btn.btn-primary.btn-sm')) {
                addButtons();
            } else {
                setTimeout(waitForElement, 500);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForElement);
        } else {
            waitForElement();
        }

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    if (!configId) extractConfigId();
                    addButtons();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                extractConfigId();
                setTimeout(addButtons, 500);
            }
        }, 1000);
    }

    init();
})();
