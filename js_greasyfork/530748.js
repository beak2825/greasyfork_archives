// ==UserScript==
// @name         Monitor Popmundo 5.0 🤓 COM SENHA 1.0
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Monitora a saúde e o humor no Popmundo e usa automaticamente o item M203 Noob Tube.
// @author       Popper
// @match        *://**/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530748/Monitor%20Popmundo%2050%20%F0%9F%A4%93%20COM%20SENHA%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/530748/Monitor%20Popmundo%2050%20%F0%9F%A4%93%20COM%20SENHA%2010.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const API_KEY = "71557073eb4240529830684a980b499e";
    const EMAIL_PERMITIDO = "danmk2x@gmail.com";
 
    function gerarFingerprint() {
        let fingerprint = GM_getValue('deviceFingerprint', null);
        if (!fingerprint) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.fillText("Teste", 2, 2);
            const canvasData = canvas.toDataURL();
            fingerprint = btoa(
                navigator.userAgent +
                navigator.language +
                screen.width + "x" + screen.height +
                new Date().getTimezoneOffset() +
                canvasData +
                Math.random().toString(36).substring(2)
            );
            GM_setValue('deviceFingerprint', fingerprint);
            console.log("[DEBUG] Novo fingerprint gerado:", fingerprint);
        } else {
            console.log("[DEBUG] Fingerprint existente recuperado:", fingerprint);
        }
        return fingerprint;
    }
 
    function validarEmail(email, callback) {
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(email)}`;
        console.log("[DEBUG] Validando e-mail:", email);
 
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const resultado = JSON.parse(response.responseText);
                const isValid = resultado.deliverability === "DELIVERABLE" && !resultado.is_disposable_email.value;
                console.log("[DEBUG] Resultado da validação do e-mail:", email, "->", isValid, resultado);
                callback(isValid);
            },
            onerror: function() {
                console.log("[DEBUG] Erro ao validar e-mail:", email);
                callback(false);
            }
        });
    }
 
    console.log("[DEBUG] Iniciando autenticação...");
    const dispositivoAutorizado = GM_getValue('dispositivoAutorizado', null);
    const fingerprintAtual = gerarFingerprint();
    console.log("[DEBUG] Dispositivo autorizado salvo:", dispositivoAutorizado);
    console.log("[DEBUG] Fingerprint atual gerado:", fingerprintAtual);
    console.log("[DEBUG] Autenticado anteriormente?", GM_getValue('autenticado', false));
 
    if (!GM_getValue('autenticado', false) || (dispositivoAutorizado && dispositivoAutorizado !== fingerprintAtual)) {
        console.log("[DEBUG] Requer autenticação - mostrando painel de login");
        let loginDiv = document.createElement('div');
        loginDiv.id = 'loginPanel';
        loginDiv.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); color: white; padding: 20px; border-radius: 5px; z-index: 10000; font-family: Arial, sans-serif;">
                <h2>🔒 Autenticação Necessária</h2>
                <p>Digite seu e-mail para usar o Monitor Popmundo (apenas 1 dispositivo permitido):</p>
                <input type="email" id="emailInput" placeholder="Seu e-mail" style="width: 100%; padding: 5px; margin: 10px 0;" />
                <button id="loginBtn" style="width: 100%; padding: 8px; background: #4CAF50; border: none; color: white; cursor: pointer; border-radius: 3px;">Entrar</button>
                <p id="erroMsg" style="color: #FF5252; margin-top: 10px;"></p>
            </div>
        `;
        document.body.appendChild(loginDiv);
 
        GM_addStyle(`
            #loginPanel { box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); }
            #emailInput { box-sizing: border-box; }
            #loginBtn:hover { background: #45a049; }
        `);
 
        document.getElementById('loginBtn').addEventListener('click', function() {
            const emailDigitado = document.getElementById('emailInput').value.trim();
            if (!emailDigitado) {
                document.getElementById('erroMsg').textContent = "Digite um e-mail!";
                console.log("[DEBUG] Nenhum e-mail digitado");
                return;
            }
 
            document.getElementById('erroMsg').textContent = "Validando e-mail, aguarde...";
            console.log("[DEBUG] Iniciando validação do e-mail:", emailDigitado);
 
            validarEmail(emailDigitado, function(isValid) {
                console.log("[DEBUG] E-mail validado:", emailDigitado, "Resultado:", isValid);
                if (isValid && emailDigitado === EMAIL_PERMITIDO) {
                    if (!dispositivoAutorizado) {
                        GM_setValue('dispositivoAutorizado', fingerprintAtual);
                        GM_setValue('autenticado', true);
                        console.log("[DEBUG] Primeiro dispositivo autorizado:", fingerprintAtual);
                        document.getElementById('loginPanel').remove();
                        iniciarScript();
                    } else if (dispositivoAutorizado === fingerprintAtual) {
                        GM_setValue('autenticado', true);
                        console.log("[DEBUG] Dispositivo reconhecido como autorizado:", fingerprintAtual);
                        document.getElementById('loginPanel').remove();
                        iniciarScript();
                    } else {
                        console.log("[DEBUG] Dispositivo não autorizado! Autorizado:", dispositivoAutorizado, "Atual:", fingerprintAtual);
                        document.getElementById('erroMsg').textContent = "Este script já foi ativado em outro dispositivo!";
                    }
                } else {
                    console.log("[DEBUG] E-mail inválido ou não permitido:", emailDigitado);
                    document.getElementById('erroMsg').textContent = "E-mail inválido ou não autorizado!";
                }
            });
        });
 
        return;
    } else {
        console.log("[DEBUG] Autenticação já concluída para este dispositivo:", fingerprintAtual);
        iniciarScript();
    }
 
    function iniciarScript() {
        console.log("[DEBUG] Script iniciado com sucesso para:", EMAIL_PERMITIDO, "no dispositivo:", fingerprintAtual);
        let telegramUserId = GM_getValue('telegramUserId', '');
        let telegramBotToken = GM_getValue('telegramBotToken', '');
        let lastUrl = window.location.href;
        let urlNotificationSent = false;
        let statusLog = GM_getValue('statusLog', []);
        const MAX_LOG_ENTRIES = 5000;
        let isMonitoringActive = GM_getValue('isMonitoringActive', true);
        let refreshInterval = GM_getValue('refreshInterval', 10);
        let refreshIntervalId = null;
        let minimumHealth = GM_getValue('minimumHealth', 50);
        let lastHealthValue = null;
        let healthNotificationSent = false;
        let minimumMood = GM_getValue('minimumMood', 50);
        let lastMoodValue = null;
        let moodNotificationSent = false;
        let moodNaNotificationSent = false;
        let healthNaNotificationSent = false;
        let actionInProgress = false;
        let loginNavigationComplete = false;
        let availableCharacters = [];
        let username = GM_getValue('username', '');
        let password = GM_getValue('password', '');
        let autoLoginEnabled = GM_getValue('autoLoginEnabled', false);
        let autoCharSelectEnabled = GM_getValue('autoCharSelectEnabled', false);
        let selectedCharacter = GM_getValue('selectedCharacter', '');
        let selectedCharacterId = GM_getValue('selectedCharacterId', '');
        let autoNavigateToImprove = GM_getValue('autoNavigateToImprove', true);
        let lastUsedTime = GM_getValue('lastUsedTime', 0);
        const COOLDOWN_TIME = 31 * 60; // 31 minutos em segundos
        let autoNoobTubeEnabled = GM_getValue('autoNoobTubeEnabled', true);
 
        const HEALTH_BOOST_BUTTON_SELECTOR = '#ctl00_cphLeftColumn_ctl00_repAttributes_ctl02_btnBoostAttribute';
        const MOOD_BOOST_BUTTON_SELECTOR = '#ctl00_cphLeftColumn_ctl00_repAttributes_ctl01_btnBoostAttribute';
        const IMPROVE_LINK_SELECTOR = 'a[id^="ctl00_cphLeftColumn_ctl00_lnkToolLink"][href*="/Character/ImproveCharacter/"]';
        const ITEMS_PAGE_URL = '/World/Popmundo.aspx/Character/Items/1618575';
        const IMPROVE_PAGE_URL = '/World/Popmundo.aspx/Character/ImproveCharacter/1618575';
        const ACTION_DELAY = 14000; // 14 segundos
 
        function saveLog() {
            GM_setValue('statusLog', statusLog);
        }
 
        function sendTelegramMessage(message, maxRetries = 3, currentRetry = 0) {
            if (!telegramBotToken || !telegramUserId) {
                addToStatusLog('⚠️ Credenciais do Telegram não configuradas!');
                updateStatusDisplay();
                return;
            }
 
            const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
            addToStatusLog('📤 Enviando mensagem para Telegram...');
 
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    chat_id: telegramUserId,
                    text: message,
                    parse_mode: 'HTML'
                }),
                onload: function(response) {
                    try {
                        const responseData = JSON.parse(response.responseText);
                        if (responseData.ok) {
                            console.log('Notificação enviada com sucesso!', response.responseText);
                            addToStatusLog('✅ Notificação enviada com sucesso!');
                        } else {
                            console.error('Erro ao enviar notificação:', responseData.description);
                            addToStatusLog(`❌ Erro do Telegram: ${responseData.description}`);
                            if (currentRetry < maxRetries) {
                                addToStatusLog(`🔄 Tentativa ${currentRetry + 1}/${maxRetries} falhou, tentando novamente...`);
                                setTimeout(() => sendTelegramMessage(message, maxRetries, currentRetry + 1), 2000);
                            }
                        }
                    } catch (e) {
                        console.error('Erro ao processar resposta:', e, response.responseText);
                        addToStatusLog('❌ Erro ao processar resposta do Telegram');
                    }
                    updateStatusDisplay();
                },
                onerror: function(error) {
                    console.error('Erro de rede ao enviar notificação:', error);
                    addToStatusLog('❌ Erro de rede ao enviar notificação!');
                    if (currentRetry < maxRetries) {
                        addToStatusLog(`🔄 Tentativa ${currentRetry + 1}/${maxRetries} falhou, tentando novamente...`);
                        setTimeout(() => sendTelegramMessage(message, maxRetries, currentRetry + 1), 3000);
                    }
                    updateStatusDisplay();
                }
            });
        }
 
        function isLoginPage() {
            const isDefaultPage = window.location.href.includes('Default.aspx');
            const hasLoginForm = document.getElementById('ctl00_cphRightColumn_ucLogin_txtUsername') !== null;
            return hasLoginForm || isDefaultPage;
        }
 
        function isCharacterSelectionPage() {
            return document.querySelector('input[id^="ctl00_cphLeftColumn_repCharacters_"][id$="_btnChooseCharacter2"]') !== null;
        }
 
        function isLoggedIn() {
            return document.querySelector('a[id^="ctl00_cphLeftColumn_ctl00_lnkToolLink"]') !== null;
        }
 
        function scanAvailableCharacters() {
            if (!isCharacterSelectionPage()) return [];
 
            const characters = [];
            const charButtons = document.querySelectorAll('input[id^="ctl00_cphLeftColumn_repCharacters_"][id$="_btnChooseCharacter2"]');
 
            charButtons.forEach(button => {
                const id = button.id.match(/ctl00_cphLeftColumn_repCharacters_ctl(\d+)_btnChooseCharacter2/);
                const charId = id ? id[1] : null;
                const charName = button.value.replace('Escolher ', '').trim();
 
                if (charId && charName) {
                    characters.push({
                        id: charId,
                        name: charName,
                        buttonId: button.id
                    });
                }
            });
 
            addToStatusLog(`🔍 Encontrados ${characters.length} personagens disponíveis`);
            return characters;
        }
 
        function navigateToImprovePage() {
            if (!autoNavigateToImprove || actionInProgress || loginNavigationComplete) return;
 
            actionInProgress = true;
            addToStatusLog('🧭 Navegando para a página de aprimoramento...');
 
            setTimeout(() => {
                const improveLink = document.querySelector(IMPROVE_LINK_SELECTOR);
                if (improveLink) {
                    addToStatusLog('🎯 Link para página de aprimoramento encontrado, clicando...');
                    improveLink.click();
                    loginNavigationComplete = true;
 
                    setTimeout(() => {
                        actionInProgress = false;
                        addToStatusLog('✅ Navegação para página de aprimoramento concluída');
                    }, ACTION_DELAY);
                } else {
                    addToStatusLog('❌ Link para página de aprimoramento não encontrado');
                    actionInProgress = false;
                }
            }, ACTION_DELAY);
        }
 
        function performAutoLogin() {
            if (!autoLoginEnabled || !username || !password || actionInProgress) return;
 
            actionInProgress = true;
            addToStatusLog('🔑 Iniciando processo de login automático...');
            loginNavigationComplete = false;
 
            setTimeout(() => {
                const usernameField = document.getElementById('ctl00_cphLeftColumn_ucLogin_txtUsername') || document.getElementById('ctl00_cphRightColumn_ucLogin_txtUsername');
                if (usernameField) {
                    usernameField.value = username;
                    addToStatusLog('👤 Campo de usuário preenchido');
 
                    setTimeout(() => {
                        const passwordField = document.getElementById('ctl00_cphLeftColumn_ucLogin_txtPassword') || document.getElementById('ctl00_cphRightColumn_ucLogin_txtPassword');
                        if (passwordField) {
                            passwordField.value = password;
                            addToStatusLog('🔒 Campo de senha preenchido');
 
                            setTimeout(() => {
                                const loginButton = document.getElementById('ctl00_cphRightColumn_ucLogin_btnLogin');
                                if (loginButton) {
                                    loginButton.click();
                                    addToStatusLog('✅ Botão de login clicado');
 
                                    setTimeout(() => {
                                        actionInProgress = false;
                                    }, ACTION_DELAY);
                                } else {
                                    addToStatusLog('❌ Botão de login não encontrado');
                                    actionInProgress = false;
                                }
                            }, ACTION_DELAY);
                        } else {
                            addToStatusLog('❌ Campo de senha não encontrado');
                            actionInProgress = false;
                        }
                    }, ACTION_DELAY);
                } else {
                    addToStatusLog('❌ Campo de usuário não encontrado');
                    actionInProgress = false;
                }
            }, ACTION_DELAY);
        }
 
        function selectCharacter() {
            if (!autoCharSelectEnabled || actionInProgress) return;
 
            actionInProgress = true;
            addToStatusLog('👤 Iniciando seleção de personagem...');
            loginNavigationComplete = false;
 
            availableCharacters = scanAvailableCharacters();
            updateCharacterDropdown();
 
            setTimeout(() => {
                let buttonToClick = null;
 
                if (selectedCharacterId) {
                    const targetChar = availableCharacters.find(char => char.id === selectedCharacterId);
                    if (targetChar) {
                        buttonToClick = document.getElementById(targetChar.buttonId);
                        addToStatusLog(`👤 Personagem encontrado pelo ID: ${targetChar.name} (ID: ${targetChar.id})`);
                    }
                }
 
                if (!buttonToClick && selectedCharacter) {
                    const targetChar = availableCharacters.find(char =>
                        char.name.toLowerCase().includes(selectedCharacter.toLowerCase()));
                    if (targetChar) {
                        buttonToClick = document.getElementById(targetChar.buttonId);
                        addToStatusLog(`👤 Personagem encontrado pelo nome: ${targetChar.name}`);
 
                        selectedCharacterId = targetChar.id;
                        GM_setValue('selectedCharacterId', selectedCharacterId);
                    }
                }
 
                if (!buttonToClick && availableCharacters.length > 0) {
                    buttonToClick = document.getElementById(availableCharacters[0].buttonId);
                    addToStatusLog(`⚠️ Personagem específico não encontrado, selecionando o primeiro disponível: ${availableCharacters[0].name}`);
                }
 
                if (buttonToClick) {
                    setTimeout(() => {
                        buttonToClick.click();
                        addToStatusLog('✅ Personagem selecionado');
 
                        setTimeout(() => {
                            actionInProgress = false;
                        }, ACTION_DELAY);
                    }, ACTION_DELAY);
                } else {
                    addToStatusLog('❌ Nenhum personagem disponível para seleção');
                    actionInProgress = false;
                }
            }, ACTION_DELAY);
        }
 
        function getCurrentTime() {
            return Math.floor(Date.now() / 1000);
        }
 
        function isTimeToUseNoobTube() {
            const currentTime = getCurrentTime();
            const timeElapsed = currentTime - lastUsedTime;
            return timeElapsed >= COOLDOWN_TIME;
        }
 
        function recordNoobTubeUse() {
            lastUsedTime = getCurrentTime();
            GM_setValue('lastUsedTime', lastUsedTime);
            addToStatusLog(`⏲️ Cooldown do M203 Noob Tube iniciado: ${COOLDOWN_TIME / 60} minutos`);
        }
 
        function formatTime(seconds) {
            if (seconds <= 0) return "0m 00s";
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
        }
 
        function findNoobTubeItem() {
            const itemLinks = document.querySelectorAll('a[id^="ctl00_cphLeftColumn_ctl00_repItemGroups_"][id$="_lnkItem"]');
            addToStatusLog(`🔍 Procurando M203 Noob Tube entre ${itemLinks.length} itens...`);
 
            for (let link of itemLinks) {
                const itemName = link.textContent.trim().toLowerCase();
                addToStatusLog(`🔍 Item encontrado: ${itemName}`);
                if (itemName.includes('m203') && itemName.includes('noob') && itemName.includes('tube')) {
                    addToStatusLog(`✅ M203 Noob Tube identificado: ${itemName}`);
                    return link;
                }
            }
 
            addToStatusLog('❌ Nenhum item correspondente a "M203 Noob Tube" encontrado');
            return null;
        }
 
        function useNoobTubeItem() {
            if (!autoNoobTubeEnabled || actionInProgress || !isTimeToUseNoobTube()) {
                if (!isTimeToUseNoobTube()) {
                    const timeRemaining = COOLDOWN_TIME - (getCurrentTime() - lastUsedTime);
                    addToStatusLog(`⏳ M203 Noob Tube em cooldown: ${formatTime(timeRemaining)} restantes`);
                    if (!window.location.href.includes('/Character/ImproveCharacter/')) {
                        addToStatusLog('🧭 Retornando à página de aprimoramento (item em cooldown)...');
                        setTimeout(() => {
                            window.location.href = IMPROVE_PAGE_URL;
                            setTimeout(() => {
                                actionInProgress = false;
                                addToStatusLog('✅ Retornado à página de aprimoramento');
                            }, ACTION_DELAY);
                        }, ACTION_DELAY);
                    }
                }
                return;
            }
 
            actionInProgress = true;
            addToStatusLog('🔫 Iniciando processo de uso do M203 Noob Tube...');
 
            if (window.location.href.includes('/Character/ImproveCharacter/')) {
                addToStatusLog('🧭 Navegando para a página de itens...');
                window.location.href = ITEMS_PAGE_URL;
                setTimeout(() => {
                    actionInProgress = false;
                }, ACTION_DELAY);
            } else if (window.location.href.includes('/Character/Items/')) {
                const itemLink = findNoobTubeItem();
                if (itemLink) {
                    addToStatusLog('🔫 M203 Noob Tube encontrado na lista de itens, clicando nos detalhes...');
                    itemLink.click();
                    setTimeout(() => {
                        actionInProgress = false;
                    }, ACTION_DELAY);
                } else {
                    addToStatusLog('❌ M203 Noob Tube não encontrado na lista de itens!');
                    addToStatusLog('🧭 Retornando à página de aprimoramento...');
                    setTimeout(() => {
                        window.location.href = IMPROVE_PAGE_URL;
                        setTimeout(() => {
                            actionInProgress = false;
                            addToStatusLog('✅ Retornado à página de aprimoramento');
                        }, ACTION_DELAY);
                    }, ACTION_DELAY);
                }
            } else if (window.location.href.includes('/Character/ItemDetails/')) {
                const useButton = document.getElementById('ctl00_cphLeftColumn_ctl00_btnItemUse');
                if (useButton) {
                    addToStatusLog('🔫 Botão "Usar" encontrado, clicando...');
                    useButton.click();
                    recordNoobTubeUse();
                    sendTelegramMessage('🔫 <b>M203 Noob Tube usado com sucesso!</b>\nURL: ' + window.location.href);
                    addToStatusLog('🧭 Retornando à página de aprimoramento...');
                    setTimeout(() => {
                        window.location.href = IMPROVE_PAGE_URL;
                        setTimeout(() => {
                            actionInProgress = false;
                            addToStatusLog('✅ Retornado à página de aprimoramento');
                        }, ACTION_DELAY);
                    }, ACTION_DELAY);
                } else {
                    addToStatusLog('❌ Botão "Usar" não encontrado!');
                    addToStatusLog('🧭 Retornando à página de aprimoramento...');
                    setTimeout(() => {
                        window.location.href = IMPROVE_PAGE_URL;
                        setTimeout(() => {
                            actionInProgress = false;
                            addToStatusLog('✅ Retornado à página de aprimoramento');
                        }, ACTION_DELAY);
                    }, ACTION_DELAY);
                }
            } else {
                addToStatusLog('⚠️ Página atual não reconhecida, retornando à página de aprimoramento...');
                setTimeout(() => {
                    window.location.href = IMPROVE_PAGE_URL;
                    setTimeout(() => {
                        actionInProgress = false;
                        addToStatusLog('✅ Retornado à página de aprimoramento');
                    }, ACTION_DELAY);
                }, ACTION_DELAY);
            }
        }
 
        function checkCurrentPage() {
            if (actionInProgress) return;
 
            if (isLoginPage()) {
                addToStatusLog('🔍 Página de login detectada!');
                performAutoLogin();
            } else if (isCharacterSelectionPage()) {
                addToStatusLog('🔍 Página de seleção de personagem detectada!');
                availableCharacters = scanAvailableCharacters();
                updateCharacterDropdown();
                selectCharacter();
            } else if (isLoggedIn() && !loginNavigationComplete && autoNavigateToImprove) {
                addToStatusLog('🔍 Login bem-sucedido, verificando navegação para página de aprimoramento');
                navigateToImprovePage();
            } else if (isMonitoringActive && autoNoobTubeEnabled) {
                useNoobTubeItem();
            }
        }
 
        function clickHealthBoostButton() {
            if (actionInProgress) return;
 
            actionInProgress = true;
            addToStatusLog('🩺 Tentando clicar no botão "Aprimorar" (Saúde)...');
 
            setTimeout(() => {
                const boostButton = document.querySelector(HEALTH_BOOST_BUTTON_SELECTOR);
                if (boostButton) {
                    boostButton.click();
                    addToStatusLog('🩺 Botão "Aprimorar" (Saúde) clicado automaticamente!');
                    const message = `🩺 <b>SAÚDE APRIMORADA!</b>\nSaúde atingiu o mínimo (${minimumHealth}%) e o botão "Aprimorar" foi clicado.\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                } else {
                    addToStatusLog('❌ Botão "Aprimorar" (Saúde) não encontrado na página!');
                }
 
                setTimeout(() => {
                    actionInProgress = false;
                    updateStatusDisplay();
                }, ACTION_DELAY);
            }, ACTION_DELAY);
        }
 
        function clickMoodBoostButton() {
            if (actionInProgress) return;
 
            actionInProgress = true;
            addToStatusLog('😊 Tentando clicar no botão "Aprimorar" (Humor)...');
 
            setTimeout(() => {
                const boostButton = document.querySelector(MOOD_BOOST_BUTTON_SELECTOR);
                if (boostButton) {
                    boostButton.click();
                    addToStatusLog('😊 Botão "Aprimorar" (Humor) clicado automaticamente!');
                    const message = `😊 <b>HUMOR APRIMORADO!</b>\nHumor atingiu o mínimo (${minimumMood}%) e o botão "Aprimorar" foi clicado.\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                } else {
                    addToStatusLog('❌ Botão "Aprimorar" (Humor) não encontrado na página!');
                }
 
                setTimeout(() => {
                    actionInProgress = false;
                    updateStatusDisplay();
                }, ACTION_DELAY);
            }, ACTION_DELAY);
        }
 
        function checkUrlChange() {
            console.log('Verificando URL... Current:', window.location.href, 'Last:', lastUrl);
            if (!isMonitoringActive) return;
 
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl && !urlNotificationSent) {
                console.log('URL mudou! Enviando notificação...');
                addToStatusLog(`🌐 URL alterada: ${shortUrl(currentUrl)}`);
                const message = `🌐 <b>URL ALTERADA!</b>\nNova URL: ${currentUrl}\nURL anterior: ${lastUrl}`;
                sendTelegramMessage(message);
                lastUrl = currentUrl;
                urlNotificationSent = true;
 
                setTimeout(() => {
                    checkCurrentPage();
                }, ACTION_DELAY);
 
                setTimeout(() => {
                    urlNotificationSent = false;
                }, 10000);
            }
        }
 
        function checkAttributes() {
            const progressBars = document.querySelectorAll('div.progressBar[title$="%"]');
 
            const moodElement = progressBars && progressBars.length >= 1 ? progressBars[0].querySelector('div') : null;
            if (moodElement) {
                const moodText = moodElement.textContent.trim();
                const moodValue = parseInt(moodText.replace('%', ''));
                updateCurrentMoodDisplay(moodValue);
                checkMinimumMood(moodValue);
                lastMoodValue = moodValue;
                moodNaNotificationSent = false;
            } else {
                updateCurrentMoodDisplay('N/A');
                if (!moodNaNotificationSent) {
                    addToStatusLog('⚠️ Humor não encontrado (N/A)');
                    const message = `⚠️ <b>ALERTA: HUMOR NÃO ENCONTRADO</b>\nHumor atual: N/A\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                    moodNaNotificationSent = true;
                    setTimeout(() => {
                        moodNaNotificationSent = false;
                    }, 300000);
                }
                lastMoodValue = null;
            }
 
            const healthElement = progressBars && progressBars.length >= 2 ? progressBars[1].querySelector('div') : null;
            if (healthElement) {
                const healthText = healthElement.textContent.trim();
                const healthValue = parseInt(healthText.replace('%', ''));
                updateCurrentHealthDisplay(healthValue);
                checkMinimumHealth(healthValue);
                lastHealthValue = healthValue;
                healthNaNotificationSent = false;
            } else {
                updateCurrentHealthDisplay('N/A');
                if (!healthNaNotificationSent) {
                    addToStatusLog('⚠️ Saúde não encontrada (N/A)');
                    const message = `⚠️ <b>ALERTA: SAÚDE NÃO ENCONTRADA</b>\nSaúde atual: N/A\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                    healthNaNotificationSent = true;
                    setTimeout(() => {
                        healthNaNotificationSent = false;
                    }, 300000);
                }
                lastHealthValue = null;
            }
        }
 
        function checkMinimumHealth(healthValue) {
            if (!isMonitoringActive || healthValue === null) return;
 
            if (healthValue <= minimumHealth) {
                if (!healthNotificationSent) {
                    addToStatusLog(`⚠️ Saúde atingiu o mínimo: ${healthValue}% (mínimo: ${minimumHealth}%)`);
                    const message = `⚠️ <b>ALERTA DE SAÚDE BAIXA!</b>\nSaúde atual: ${healthValue}%\nSaúde mínima configurada: ${minimumHealth}%\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                    healthNotificationSent = true;
                    clickHealthBoostButton();
                    setTimeout(() => {
                        healthNotificationSent = false;
                    }, 300000);
                }
            } else if (lastHealthValue !== null && lastHealthValue <= minimumHealth && healthValue > minimumHealth) {
                addToStatusLog(`✅ Saúde recuperada: ${healthValue}% (mínimo: ${minimumHealth}%)`);
                const message = `✅ <b>SAÚDE RECUPERADA!</b>\nSaúde atual: ${healthValue}%\nSaúde mínima configurada: ${minimumHealth}%\nURL: ${window.location.href}`;
                sendTelegramMessage(message);
                healthNotificationSent = false;
            }
        }
 
        function checkMinimumMood(moodValue) {
            if (!isMonitoringActive || moodValue === null) return;
 
            if (moodValue <= minimumMood) {
                if (!moodNotificationSent) {
                    addToStatusLog(`😞 Humor atingiu o mínimo: ${moodValue}% (mínimo: ${minimumMood}%)`);
                    const message = `😞 <b>ALERTA DE HUMOR BAIXO!</b>\nHumor atual: ${moodValue}%\nHumor mínimo configurado: ${minimumMood}%\nURL: ${window.location.href}`;
                    sendTelegramMessage(message);
                    moodNotificationSent = true;
                    clickMoodBoostButton();
                    setTimeout(() => {
                        moodNotificationSent = false;
                    }, 300000);
                }
            } else if (lastMoodValue !== null && lastMoodValue <= minimumMood && moodValue > minimumMood) {
                addToStatusLog(`😊 Humor recuperado: ${moodValue}% (mínimo: ${minimumMood}%)`);
                const message = `😊 <b>HUMOR RECUPERADO!</b>\nHumor atual: ${moodValue}%\nHumor mínimo configurado: ${minimumMood}%\nURL: ${window.location.href}`;
                sendTelegramMessage(message);
                moodNotificationSent = false;
            }
        }
 
        function addToStatusLog(message) {
            const timestamp = new Date().toLocaleTimeString();
            statusLog.unshift(`[${timestamp}] ${message}`);
            if (statusLog.length > MAX_LOG_ENTRIES) {
                statusLog.pop();
            }
            saveLog();
        }
 
        function updateStatusDisplay() {
            const statusDisplay = document.getElementById('statusLogDisplay');
            if (statusDisplay) {
                statusDisplay.innerHTML = '';
                statusLog.forEach(entry => {
                    const logItem = document.createElement('div');
                    logItem.textContent = entry;
                    logItem.style.marginBottom = '2px';
                    statusDisplay.appendChild(logItem);
                });
            }
 
            const statusIndicator = document.getElementById('statusIndicator');
            if (statusIndicator) {
                statusIndicator.style.backgroundColor = isMonitoringActive ? '#4CAF50' : '#FF5252';
            }
 
            const telegramStatusDisplay = document.getElementById('telegramStatus');
            if (telegramStatusDisplay) {
                telegramStatusDisplay.textContent = telegramBotToken && telegramUserId ? 'Configurado' : 'Não configurado';
                telegramStatusDisplay.style.color = telegramBotToken && telegramUserId ? '#4CAF50' : '#FF9800';
            }
 
            const autoRefreshButton = document.getElementById('autoRefreshButton');
            if (autoRefreshButton) {
                autoRefreshButton.textContent = refreshIntervalId ?
                    `Atualização a cada ${refreshInterval}s (Ativa)` :
                    `Atualização a cada ${refreshInterval}s (Inativa)`;
                autoRefreshButton.style.backgroundColor = refreshIntervalId ? '#4CAF50' : '#FF9800';
            }
 
            const minimumHealthDisplay = document.getElementById('minimumHealthValue');
            if (minimumHealthDisplay) {
                minimumHealthDisplay.textContent = `${minimumHealth}%`;
            }
 
            const minimumMoodDisplay = document.getElementById('minimumMoodValue');
            if (minimumMoodDisplay) {
                minimumMoodDisplay.textContent = `${minimumMood}%`;
            }
 
            const autoLoginStatusDisplay = document.getElementById('autoLoginStatus');
            if (autoLoginStatusDisplay) {
                autoLoginStatusDisplay.textContent = autoLoginEnabled ? 'Ativado' : 'Desativado';
                autoLoginStatusDisplay.style.color = autoLoginEnabled ? '#4CAF50' : '#FF9800';
            }
 
            const autoCharSelectStatusDisplay = document.getElementById('autoCharSelectStatus');
            if (autoCharSelectStatusDisplay) {
                autoCharSelectStatusDisplay.textContent = autoCharSelectEnabled ? 'Ativado' : 'Desativado';
                autoCharSelectStatusDisplay.style.color = autoCharSelectEnabled ? '#4CAF50' : '#FF9800';
            }
 
            const autoNavigateStatusDisplay = document.getElementById('autoNavigateStatus');
            if (autoNavigateStatusDisplay) {
                autoNavigateStatusDisplay.textContent = autoNavigateToImprove ? 'Ativado' : 'Desativado';
                autoNavigateStatusDisplay.style.color = autoNavigateToImprove ? '#4CAF50' : '#FF9800';
            }
 
            const actionStatusDisplay = document.getElementById('actionStatus');
            if (actionStatusDisplay) {
                actionStatusDisplay.textContent = actionInProgress ? 'Em andamento' : 'Disponível';
                actionStatusDisplay.style.color = actionInProgress ? '#FF9800' : '#4CAF50';
            }
 
            const selectedCharacterDisplay = document.getElementById('selectedCharacterDisplay');
            if (selectedCharacterDisplay) {
                if (selectedCharacter) {
                    selectedCharacterDisplay.textContent = selectedCharacter;
                    selectedCharacterDisplay.style.color = '#4CAF50';
                } else {
                    selectedCharacterDisplay.textContent = 'Não configurado';
                    selectedCharacterDisplay.style.color = '#FF9800';
                }
            }
 
            const noobTubeStatusDisplay = document.getElementById('noobTubeStatus');
            if (noobTubeStatusDisplay) {
                const timeRemaining = COOLDOWN_TIME - (getCurrentTime() - lastUsedTime);
                noobTubeStatusDisplay.textContent = isTimeToUseNoobTube() ? 'Pronto para usar' : `Cooldown: ${formatTime(timeRemaining)}`;
                noobTubeStatusDisplay.style.color = isTimeToUseNoobTube() ? '#4CAF50' : '#FF9800';
            }
 
            const autoNoobTubeStatusDisplay = document.getElementById('autoNoobTubeStatus');
            if (autoNoobTubeStatusDisplay) {
                autoNoobTubeStatusDisplay.textContent = autoNoobTubeEnabled ? 'Ativado' : 'Desativado';
                autoNoobTubeStatusDisplay.style.color = autoNoobTubeEnabled ? '#4CAF50' : '#FF9800';
            }
        }
 
        function updateCharacterDropdown() {
            const characterDropdown = document.getElementById('characterDropdown');
            if (!characterDropdown) return;
 
            characterDropdown.innerHTML = '';
 
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Selecione um personagem --';
            characterDropdown.appendChild(defaultOption);
 
            availableCharacters.forEach(char => {
                const option = document.createElement('option');
                option.value = char.id;
                option.textContent = char.name;
                option.selected = char.id === selectedCharacterId;
                characterDropdown.appendChild(option);
            });
 
            if (availableCharacters.length === 0 && !isCharacterSelectionPage()) {
                const noCharsOption = document.createElement('option');
                noCharsOption.value = '';
                noCharsOption.textContent = 'Vá para a página de seleção de personagem para ver opções';
                noCharsOption.disabled = true;
                characterDropdown.appendChild(noCharsOption);
            }
        }
 
        function updateCurrentHealthDisplay(value) {
            const currentHealthDisplay = document.getElementById('currentHealthValue');
            if (currentHealthDisplay) {
                currentHealthDisplay.textContent = typeof value === 'number' ? `${value}%` : value;
                if (typeof value === 'number') {
                    currentHealthDisplay.style.color =
                        value <= minimumHealth ? '#FF5252' :
                        value < 70 ? '#FFC107' : '#4CAF50';
                } else {
                    currentHealthDisplay.style.color = '#FF5252';
                }
            }
        }
 
        function updateCurrentMoodDisplay(value) {
            const currentMoodDisplay = document.getElementById('currentMoodValue');
            if (currentMoodDisplay) {
                currentMoodDisplay.textContent = typeof value === 'number' ? `${value}%` : value;
                if (typeof value === 'number') {
                    currentMoodDisplay.style.color =
                        value <= minimumMood ? '#FF5252' :
                        value < 70 ? '#FFC107' : '#4CAF50';
                } else {
                    currentMoodDisplay.style.color = '#FF5252';
                }
            }
        }
 
        function shortUrl(url) {
            return url.length > 30 ? url.substring(0, 30) + '...' : url;
        }
 
        function setRefreshInterval(interval) {
            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                addToStatusLog('🔄 Atualização automática desativada temporariamente para configuração');
            }
 
            if (isMonitoringActive && interval > 0) {
                refreshIntervalId = setInterval(function() {
                    if (isLoginPage() || isCharacterSelectionPage()) {
                        addToStatusLog(`🔄 Detecção de página de login/seleção de personagem - verificando...`);
                        checkCurrentPage();
                        return;
                    }
 
                    if (actionInProgress) {
                        addToStatusLog(`🔄 Ação em andamento, aguardando antes de recarregar...`);
                        return;
                    }
 
                    addToStatusLog(`🔄 Recarregando página (intervalo: ${interval}s)...`);
                    updateStatusDisplay();
                    setTimeout(() => location.reload(), 1000);
                }, interval * 1000);
                addToStatusLog(`🔄 Atualização automática ativada a cada ${interval} segundos`);
            } else {
                addToStatusLog('🔄 Atualização automática desativada');
            }
 
            updateStatusDisplay();
        }
 
        function createConfigPanel() {
            const panel = document.createElement('div');
            panel.id = 'urlMonitorPanel';
            panel.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                min-width: 250px;
                max-width: 350px;
            `;
 
            const titleContainer = document.createElement('div');
            titleContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #555;
                padding-bottom: 5px;
            `;
 
            const title = document.createElement('div');
            title.textContent = 'Monitor Popmundo';
            title.style.cssText = `font-weight: bold; text-align: center;`;
 
            const statusIndicator = document.createElement('div');
            statusIndicator.id = 'statusIndicator';
            statusIndicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: ${isMonitoringActive ? '#4CAF50' : '#FF5252'};
                box-shadow: 0 0 5px ${isMonitoringActive ? '#4CAF50' : '#FF5252'};
            `;
 
            titleContainer.appendChild(title);
            titleContainer.appendChild(statusIndicator);
            panel.appendChild(titleContainer);
 
            const tabContainer = document.createElement('div');
            tabContainer.style.cssText = `
                display: flex;
                justify-content: space-around;
                margin-bottom: 10px;
                border-bottom: 1px solid #555;
            `;
 
            const statusTab = document.createElement('button');
            statusTab.textContent = 'Status';
            statusTab.style.cssText = `
                background-color: #666;
                border: none;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px 3px 0 0;
                flex-grow: 1;
            `;
 
            const loginTab = document.createElement('button');
            loginTab.textContent = 'Login';
            loginTab.style.cssText = `
                background-color: #444;
                border: none;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px 3px 0 0;
                flex-grow: 1;
            `;
 
            const configTab = document.createElement('button');
            configTab.textContent = 'Configurações';
            configTab.style.cssText = `
                background-color: #444;
                border: none;
                color: white;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px 3px 0 0;
                flex-grow: 1;
            `;
 
            tabContainer.appendChild(statusTab);
            tabContainer.appendChild(loginTab);
            tabContainer.appendChild(configTab);
            panel.appendChild(tabContainer);
 
            const panelContent = document.createElement('div');
            panelContent.id = 'panelContent';
 
            const statusSection = document.createElement('div');
            statusSection.id = 'statusSection';
            statusSection.style.cssText = `display: block;`;
 
            const currentStateSection = document.createElement('div');
            currentStateSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const currentMoodContainer = document.createElement('div');
            currentMoodContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const currentMoodLabel = document.createElement('span');
            currentMoodLabel.textContent = 'Humor atual:';
            const currentMoodValue = document.createElement('span');
            currentMoodValue.id = 'currentMoodValue';
            currentMoodValue.textContent = 'Carregando...';
            currentMoodValue.style.fontWeight = 'bold';
            currentMoodContainer.appendChild(currentMoodLabel);
            currentMoodContainer.appendChild(currentMoodValue);
            currentStateSection.appendChild(currentMoodContainer);
 
            const currentHealthContainer = document.createElement('div');
            currentHealthContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const currentHealthLabel = document.createElement('span');
            currentHealthLabel.textContent = 'Saúde atual:';
            const currentHealthValue = document.createElement('span');
            currentHealthValue.id = 'currentHealthValue';
            currentHealthValue.textContent = 'Carregando...';
            currentHealthValue.style.fontWeight = 'bold';
            currentHealthContainer.appendChild(currentHealthLabel);
            currentHealthContainer.appendChild(currentHealthValue);
            currentStateSection.appendChild(currentHealthContainer);
 
            const telegramStatusContainer = document.createElement('div');
            telegramStatusContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const telegramStatusLabel = document.createElement('span');
            telegramStatusLabel.textContent = 'Telegram:';
            const telegramStatus = document.createElement('span');
            telegramStatus.id = 'telegramStatus';
            telegramStatus.textContent = telegramBotToken && telegramUserId ? 'Configurado' : 'Não configurado';
            telegramStatus.style.fontWeight = 'bold';
            telegramStatusContainer.appendChild(telegramStatusLabel);
            telegramStatusContainer.appendChild(telegramStatus);
            currentStateSection.appendChild(telegramStatusContainer);
 
            const selectedCharacterContainer = document.createElement('div');
            selectedCharacterContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const selectedCharacterLabel = document.createElement('span');
            selectedCharacterLabel.textContent = 'Personagem:';
            const selectedCharacterDisplay = document.createElement('span');
            selectedCharacterDisplay.id = 'selectedCharacterDisplay';
            selectedCharacterDisplay.textContent = selectedCharacter || 'Não configurado';
            selectedCharacterDisplay.style.fontWeight = 'bold';
            selectedCharacterDisplay.style.color = selectedCharacter ? '#4CAF50' : '#FF9800';
            selectedCharacterContainer.appendChild(selectedCharacterLabel);
            selectedCharacterContainer.appendChild(selectedCharacterDisplay);
            currentStateSection.appendChild(selectedCharacterContainer);
 
            const actionStatusContainer = document.createElement('div');
            actionStatusContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const actionStatusLabel = document.createElement('span');
            actionStatusLabel.textContent = 'Estado das ações:';
            const actionStatus = document.createElement('span');
            actionStatus.id = 'actionStatus';
            actionStatus.textContent = actionInProgress ? 'Em andamento' : 'Disponível';
            actionStatus.style.fontWeight = 'bold';
            actionStatus.style.color = actionInProgress ? '#FF9800' : '#4CAF50';
            actionStatusContainer.appendChild(actionStatusLabel);
            actionStatusContainer.appendChild(actionStatus);
            currentStateSection.appendChild(actionStatusContainer);
 
            const noobTubeContainer = document.createElement('div');
            noobTubeContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const noobTubeLabel = document.createElement('span');
            noobTubeLabel.textContent = 'M203 Noob Tube:';
            const noobTubeStatus = document.createElement('span');
            noobTubeStatus.id = 'noobTubeStatus';
            noobTubeStatus.style.fontWeight = 'bold';
            noobTubeContainer.appendChild(noobTubeLabel);
            noobTubeContainer.appendChild(noobTubeStatus);
            currentStateSection.appendChild(noobTubeContainer);
 
            statusSection.appendChild(currentStateSection);
 
            const logSection = document.createElement('div');
            logSection.style.cssText = `
                margin-top: 10px;
                max-height: 150px;
                overflow-y: auto;
                font-size: 12px;
                background-color: rgba(0, 0, 0, 0.3);
                padding: 5px;
                border-radius: 3px;
            `;
 
            const logTitle = document.createElement('div');
            logTitle.textContent = 'Log de atividades:';
            logTitle.style.marginBottom = '5px';
            logSection.appendChild(logTitle);
 
            const statusLogDisplay = document.createElement('div');
            statusLogDisplay.id = 'statusLogDisplay';
            logSection.appendChild(statusLogDisplay);
 
            statusSection.appendChild(logSection);
 
            const loginSection = document.createElement('div');
            loginSection.id = 'loginSection';
            loginSection.style.cssText = `display: none;`;
 
            const loginConfigSection = document.createElement('div');
            loginConfigSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const loginTitle = document.createElement('div');
            loginTitle.textContent = 'Configuração de Login:';
            loginTitle.style.cssText = `font-weight: bold; margin-bottom: 10px;`;
            loginConfigSection.appendChild(loginTitle);
 
            const autoLoginToggleContainer = document.createElement('div');
            autoLoginToggleContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 8px;`;
            const autoLoginLabel = document.createElement('span');
            autoLoginLabel.textContent = 'Login automático:';
            const autoLoginToggle = document.createElement('input');
            autoLoginToggle.type = 'checkbox';
            autoLoginToggle.checked = autoLoginEnabled;
            autoLoginToggle.addEventListener('change', function() {
                autoLoginEnabled = this.checked;
                GM_setValue('autoLoginEnabled', autoLoginEnabled);
                addToStatusLog(`🔧 Login automático ${autoLoginEnabled ? 'ativado' : 'desativado'}`);
                updateStatusDisplay();
            });
            autoLoginToggleContainer.appendChild(autoLoginLabel);
            autoLoginToggleContainer.appendChild(autoLoginToggle);
            loginConfigSection.appendChild(autoLoginToggleContainer);
 
            const usernameLabel = document.createElement('div');
            usernameLabel.textContent = 'Nome de usuário:';
            usernameLabel.style.marginBottom = '2px';
            loginConfigSection.appendChild(usernameLabel);
 
            const usernameInput = document.createElement('input');
            usernameInput.type = 'text';
            usernameInput.value = username;
            usernameInput.placeholder = 'Seu nome de usuário';
            usernameInput.style.cssText = `width: 100%; margin-bottom: 8px; padding: 5px; box-sizing: border-box;`;
            usernameInput.addEventListener('change', function() {
                username = this.value.trim();
                GM_setValue('username', username);
                addToStatusLog(`🔧 Nome de usuário configurado`);
            });
            loginConfigSection.appendChild(usernameInput);
 
            const passwordLabel = document.createElement('div');
            passwordLabel.textContent = 'Senha:';
            passwordLabel.style.marginBottom = '2px';
            loginConfigSection.appendChild(passwordLabel);
 
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.value = password;
            passwordInput.placeholder = 'Sua senha';
            passwordInput.style.cssText = `width: 100%; margin-bottom: 8px; padding: 5px; box-sizing: border-box;`;
            passwordInput.addEventListener('change', function() {
                password = this.value.trim();
                GM_setValue('password', password);
                addToStatusLog(`🔧 Senha configurada`);
            });
            loginConfigSection.appendChild(passwordInput);
 
            const charSelectSection = document.createElement('div');
            charSelectSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const charSelectTitle = document.createElement('div');
            charSelectTitle.textContent = 'Seleção de Personagem:';
            charSelectTitle.style.cssText = `font-weight: bold; margin-bottom: 10px;`;
            charSelectSection.appendChild(charSelectTitle);
 
            const autoCharSelectToggleContainer = document.createElement('div');
            autoCharSelectToggleContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 8px;`;
            const autoCharSelectLabel = document.createElement('span');
            autoCharSelectLabel.textContent = 'Seleção automática:';
            const autoCharSelectToggle = document.createElement('input');
            autoCharSelectToggle.type = 'checkbox';
            autoCharSelectToggle.checked = autoCharSelectEnabled;
            autoCharSelectToggle.addEventListener('change', function() {
                autoCharSelectEnabled = this.checked;
                GM_setValue('autoCharSelectEnabled', autoCharSelectEnabled);
                addToStatusLog(`🔧 Seleção automática de personagem ${autoCharSelectEnabled ? 'ativada' : 'desativada'}`);
                updateStatusDisplay();
            });
            autoCharSelectToggleContainer.appendChild(autoCharSelectLabel);
            autoCharSelectToggleContainer.appendChild(autoCharSelectToggle);
            charSelectSection.appendChild(autoCharSelectToggleContainer);
 
            const characterDropdownLabel = document.createElement('div');
            characterDropdownLabel.textContent = 'Selecione seu personagem:';
            characterDropdownLabel.style.marginBottom = '2px';
            charSelectSection.appendChild(characterDropdownLabel);
 
            const characterDropdown = document.createElement('select');
            characterDropdown.id = 'characterDropdown';
            characterDropdown.style.cssText = `width: 100%; margin-bottom: 8px; padding: 5px; box-sizing: border-box;`;
            characterDropdown.addEventListener('change', function() {
                const selectedIndex = this.selectedIndex;
                if (selectedIndex > 0) {
                    const selectedOption = this.options[selectedIndex];
                    selectedCharacterId = selectedOption.value;
                    selectedCharacter = selectedOption.textContent;
                    GM_setValue('selectedCharacterId', selectedCharacterId);
                    GM_setValue('selectedCharacter', selectedCharacter);
                    addToStatusLog(`🔧 Personagem selecionado: ${selectedCharacter} (ID: ${selectedCharacterId})`);
                    updateStatusDisplay();
                }
            });
            charSelectSection.appendChild(characterDropdown);
 
            const scanCharactersButton = document.createElement('button');
            scanCharactersButton.textContent = 'Escanear Personagens Disponíveis';
            scanCharactersButton.style.cssText = `
                width: 100%;
                padding: 8px;
                background-color: #673AB7;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-bottom: 8px;
            `;
            scanCharactersButton.addEventListener('click', function() {
                if (isCharacterSelectionPage()) {
                    addToStatusLog('🔍 Escaneando personagens disponíveis...');
                    availableCharacters = scanAvailableCharacters();
                    updateCharacterDropdown();
                    addToStatusLog(`✅ ${availableCharacters.length} personagens encontrados`);
                } else {
                    addToStatusLog('⚠️ Vá para a página de seleção de personagem para escanear personagens');
                    window.open('/World/Popmundo.aspx/Character', '_blank');
                }
            });
            charSelectSection.appendChild(scanCharactersButton);
 
            const testLoginButton = document.createElement('button');
            testLoginButton.textContent = 'Testar Login Agora';
            testLoginButton.style.cssText = `
                width: 100%;
                padding: 8px;
                background-color: #2196F3;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-top: 5px;
                margin-bottom: 5px;
            `;
            testLoginButton.addEventListener('click', function() {
                if (isLoginPage()) {
                    addToStatusLog('🔧 Testando login automático...');
                    performAutoLogin();
                } else if (isCharacterSelectionPage()) {
                    addToStatusLog('🔧 Testando seleção automática de personagem...');
                    selectCharacter();
                } else if (isLoggedIn() && autoNavigateToImprove) {
                    addToStatusLog('🔧 Testando navegação para Aprimorar...');
                    loginNavigationComplete = false;
                    navigateToImprovePage();
                } else {
                    addToStatusLog('❌ Não estamos em uma página que requer ação de login');
                }
            });
            charSelectSection.appendChild(testLoginButton);
 
            loginSection.appendChild(loginConfigSection);
            loginSection.appendChild(charSelectSection);
 
            const configSection = document.createElement('div');
            configSection.id = 'configSection';
            configSection.style.cssText = `display: none;`;
 
            const attributesSection = document.createElement('div');
            attributesSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const attributesTitle = document.createElement('div');
            attributesTitle.textContent = 'Configuração de Atributos:';
            attributesTitle.style.cssText = `font-weight: bold; margin-bottom: 5px;`;
            attributesSection.appendChild(attributesTitle);
 
            const minimumMoodConfigLabel = document.createElement('div');
            minimumMoodConfigLabel.textContent = 'Humor mínimo (%):';
            minimumMoodConfigLabel.style.marginBottom = '5px';
            attributesSection.appendChild(minimumMoodConfigLabel);
 
            const minimumMoodInput = document.createElement('input');
            minimumMoodInput.type = 'number';
            minimumMoodInput.min = '1';
            minimumMoodInput.max = '100';
            minimumMoodInput.value = minimumMood;
            minimumMoodInput.style.cssText = `width: 100%; margin-bottom: 5px; padding: 5px; box-sizing: border-box;`;
            minimumMoodInput.addEventListener('change', function() {
                const newMinMood = parseInt(this.value);
                if (newMinMood >= 1 && newMinMood <= 100) {
                    minimumMood = newMinMood;
                    GM_setValue('minimumMood', minimumMood);
                    addToStatusLog(`🔧 Humor mínimo alterado para ${minimumMood}%`);
                    updateStatusDisplay();
                    updateCurrentMoodDisplay(lastMoodValue);
                }
            });
            attributesSection.appendChild(minimumMoodInput);
 
            const minimumHealthConfigLabel = document.createElement('div');
            minimumHealthConfigLabel.textContent = 'Saúde mínima (%):';
            minimumHealthConfigLabel.style.marginBottom = '5px';
            attributesSection.appendChild(minimumHealthConfigLabel);
 
            const minimumHealthInput = document.createElement('input');
            minimumHealthInput.type = 'number';
            minimumHealthInput.min = '1';
            minimumHealthInput.max = '100';
            minimumHealthInput.value = minimumHealth;
            minimumHealthInput.style.cssText = `width: 100%; margin-bottom: 5px; padding: 5px; box-sizing: border-box;`;
            minimumHealthInput.addEventListener('change', function() {
                const newMinHealth = parseInt(this.value);
                if (newMinHealth >= 1 && newMinHealth <= 100) {
                    minimumHealth = newMinHealth;
                    GM_setValue('minimumHealth', minimumHealth);
                    addToStatusLog(`🔧 Saúde mínima alterada para ${minimumHealth}%`);
                    updateStatusDisplay();
                    updateCurrentHealthDisplay(lastHealthValue);
                }
            });
            attributesSection.appendChild(minimumHealthInput);
 
            configSection.appendChild(attributesSection);
 
            const refreshIntervalSection = document.createElement('div');
            refreshIntervalSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const refreshTitle = document.createElement('div');
            refreshTitle.textContent = 'Configuração de Atualização:';
            refreshTitle.style.cssText = `font-weight: bold; margin-bottom: 5px;`;
            refreshIntervalSection.appendChild(refreshTitle);
 
            const refreshIntervalLabel = document.createElement('div');
            refreshIntervalLabel.textContent = 'Intervalo de atualização (segundos):';
            refreshIntervalLabel.style.marginBottom = '5px';
            refreshIntervalSection.appendChild(refreshIntervalLabel);
 
            const refreshIntervalInput = document.createElement('input');
            refreshIntervalInput.type = 'number';
            refreshIntervalInput.min = '1';
            refreshIntervalInput.value = refreshInterval;
            refreshIntervalInput.style.cssText = `width: 100%; margin-bottom: 5px; padding: 5px; box-sizing: border-box;`;
            refreshIntervalInput.addEventListener('change', function() {
                const newInterval = parseInt(this.value);
                if (newInterval >= 1) {
                    refreshInterval = newInterval;
                    GM_setValue('refreshInterval', refreshInterval);
                    setRefreshInterval(refreshInterval);
                    addToStatusLog(`🔧 Intervalo de atualização alterado para ${refreshInterval} segundos`);
                    updateStatusDisplay();
                }
            });
            refreshIntervalSection.appendChild(refreshIntervalInput);
 
            const autoRefreshButton = document.createElement('button');
            autoRefreshButton.id = 'autoRefreshButton';
            autoRefreshButton.textContent = refreshIntervalId ?
                `Atualização a cada ${refreshInterval}s (Ativa)` :
                `Atualização a cada ${refreshInterval}s (Inativa)`;
            autoRefreshButton.style.cssText = `
                width: 100%;
                padding: 5px;
                background-color: ${refreshIntervalId ? '#4CAF50' : '#FF9800'};
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-bottom: 5px;
            `;
            autoRefreshButton.addEventListener('click', function() {
                if (refreshIntervalId) {
                    clearInterval(refreshIntervalId);
                    refreshIntervalId = null;
                    addToStatusLog('🔄 Atualização automática desativada');
                } else {
                    setRefreshInterval(refreshInterval);
                    addToStatusLog(`🔄 Atualização automática ativada a cada ${refreshInterval} segundos`);
                }
                updateStatusDisplay();
            });
            refreshIntervalSection.appendChild(autoRefreshButton);
 
            configSection.appendChild(refreshIntervalSection);
 
            const telegramConfigSection = document.createElement('div');
            telegramConfigSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const telegramTitle = document.createElement('div');
            telegramTitle.textContent = 'Configuração do Telegram:';
            telegramTitle.style.cssText = `font-weight: bold; margin-bottom: 5px;`;
            telegramConfigSection.appendChild(telegramTitle);
 
            const userIdLabel = document.createElement('div');
            userIdLabel.textContent = 'User ID:';
            userIdLabel.style.marginBottom = '2px';
            telegramConfigSection.appendChild(userIdLabel);
 
            const userIdInput = document.createElement('input');
            userIdInput.type = 'text';
            userIdInput.value = telegramUserId;
            userIdInput.placeholder = 'Exemplo: 1234567890';
            userIdInput.style.cssText = `width: 100%; margin-bottom: 5px; padding: 5px; box-sizing: border-box;`;
            userIdInput.addEventListener('change', function() {
                telegramUserId = this.value.trim();
                GM_setValue('telegramUserId', telegramUserId);
                addToStatusLog(`🔧 User ID do Telegram configurado`);
                updateStatusDisplay();
            });
            telegramConfigSection.appendChild(userIdInput);
 
            const botTokenLabel = document.createElement('div');
            botTokenLabel.textContent = 'Bot Token:';
            botTokenLabel.style.marginBottom = '2px';
            telegramConfigSection.appendChild(botTokenLabel);
 
            const botTokenInput = document.createElement('input');
            botTokenInput.type = 'text';
            botTokenInput.value = telegramBotToken;
            botTokenInput.placeholder = 'Exemplo: 1234567890:AABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi';
            botTokenInput.style.cssText = `width: 100%; margin-bottom: 5px; padding: 5px; box-sizing: border-box;`;
            botTokenInput.addEventListener('change', function() {
                telegramBotToken = this.value.trim();
                GM_setValue('telegramBotToken', telegramBotToken);
                addToStatusLog(`🔧 Token do Bot configurado`);
                updateStatusDisplay();
            });
            telegramConfigSection.appendChild(botTokenInput);
 
            const testButton = document.createElement('button');
            testButton.textContent = 'Testar Configuração';
            testButton.style.cssText = `
                width: 100%;
                padding: 5px;
                background-color: #2196F3;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-bottom: 5px;
            `;
            testButton.addEventListener('click', function() {
                addToStatusLog('🔧 Testando configuração do Telegram...');
                sendTelegramMessage('✅ Teste de configuração do Monitor de URL, Saúde e Humor.\n\nSe você está vendo esta mensagem, o seu Monitor está funcionando corretamente!');
            });
            telegramConfigSection.appendChild(testButton);
 
            configSection.appendChild(telegramConfigSection);
 
            const noobTubeSection = document.createElement('div');
            noobTubeSection.style.cssText = `
                margin-bottom: 10px;
                padding-bottom: 5px;
                border-bottom: 1px dashed #555;
            `;
 
            const noobTubeTitle = document.createElement('div');
            noobTubeTitle.textContent = 'Configuração do M203 Noob Tube:';
            noobTubeTitle.style.cssText = `font-weight: bold; margin-bottom: 10px;`;
            noobTubeSection.appendChild(noobTubeTitle);
 
            const autoNoobTubeToggleContainer = document.createElement('div');
            autoNoobTubeToggleContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 8px;`;
            const autoNoobTubeLabel = document.createElement('span');
            autoNoobTubeLabel.textContent = 'Uso automático:';
            const autoNoobTubeToggle = document.createElement('input');
            autoNoobTubeToggle.type = 'checkbox';
            autoNoobTubeToggle.checked = autoNoobTubeEnabled;
            autoNoobTubeToggle.addEventListener('change', function() {
                autoNoobTubeEnabled = this.checked;
                GM_setValue('autoNoobTubeEnabled', autoNoobTubeEnabled);
                addToStatusLog(`🔧 Uso automático do M203 Noob Tube ${autoNoobTubeEnabled ? 'ativado' : 'desativado'}`);
                updateStatusDisplay();
            });
            autoNoobTubeToggleContainer.appendChild(autoNoobTubeLabel);
            autoNoobTubeToggleContainer.appendChild(autoNoobTubeToggle);
            noobTubeSection.appendChild(autoNoobTubeToggleContainer);
 
            const noobTubeStatusContainer = document.createElement('div');
            noobTubeStatusContainer.style.cssText = `display: flex; justify-content: space-between; margin-bottom: 5px;`;
            const noobTubeStatusLabel = document.createElement('span');
            noobTubeStatusLabel.textContent = 'Status:';
            const autoNoobTubeStatus = document.createElement('span');
            autoNoobTubeStatus.id = 'autoNoobTubeStatus';
            autoNoobTubeStatus.style.fontWeight = 'bold';
            noobTubeStatusContainer.appendChild(noobTubeStatusLabel);
            noobTubeStatusContainer.appendChild(autoNoobTubeStatus);
            noobTubeSection.appendChild(noobTubeStatusContainer);
 
            configSection.appendChild(noobTubeSection);
 
            const toggleMonitoringButton = document.createElement('button');
            toggleMonitoringButton.textContent = isMonitoringActive ? 'Desligar Monitoramento' : 'Ligar Monitoramento';
            toggleMonitoringButton.style.cssText = `
                width: 100%;
                padding: 5px;
                background-color: ${isMonitoringActive ? '#FF5252' : '#4CAF50'};
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-bottom: 10px;
                margin-top: 10px;
            `;
            toggleMonitoringButton.addEventListener('click', function() {
                isMonitoringActive = !isMonitoringActive;
                GM_setValue('isMonitoringActive', isMonitoringActive);
                this.textContent = isMonitoringActive ? 'Desligar Monitoramento' : 'Ligar Monitoramento';
                this.style.backgroundColor = isMonitoringActive ? '#FF5252' : '#4CAF50';
                addToStatusLog(isMonitoringActive ? '🔧 Monitoramento ligado' : '🔧 Monitoramento desligado');
 
                if (isMonitoringActive && refreshInterval > 0) {
                    setRefreshInterval(refreshInterval);
                } else if (!isMonitoringActive && refreshIntervalId) {
                    clearInterval(refreshIntervalId);
                    refreshIntervalId = null;
                    addToStatusLog('🔄 Atualização automática desativada (monitoramento desligado)');
                }
 
                updateStatusDisplay();
            });
            configSection.appendChild(toggleMonitoringButton);
 
            panelContent.appendChild(statusSection);
            panelContent.appendChild(loginSection);
            panelContent.appendChild(configSection);
            panel.appendChild(panelContent);
 
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Minimizar';
            toggleButton.style.cssText = `
                width: 100%;
                padding: 5px;
                background-color: #444;
                border: none;
                color: white;
                cursor: pointer;
                border-radius: 3px;
                margin-top: 10px;
            `;
 
            toggleButton.addEventListener('click', function() {
                if (panelContent.style.display === 'none') {
                    panelContent.style.display = 'block';
                    tabContainer.style.display = 'flex';
                    this.textContent = 'Minimizar';
                } else {
                    panelContent.style.display = 'none';
                    tabContainer.style.display = 'none';
                    this.textContent = 'Expandir';
                }
            });
 
            panel.appendChild(toggleButton);
 
            const footer = document.createElement('div');
            footer.textContent = 'By: Popper';
            footer.style.cssText = `
                text-align: center;
                font-size: 10px;
                color: #888;
                margin-top: 5px;
            `;
            panel.appendChild(footer);
 
            document.body.appendChild(panel);
 
            statusTab.addEventListener('click', function() {
                statusSection.style.display = 'block';
                loginSection.style.display = 'none';
                configSection.style.display = 'none';
                statusTab.style.backgroundColor = '#666';
                loginTab.style.backgroundColor = '#444';
                configTab.style.backgroundColor = '#444';
            });
 
            loginTab.addEventListener('click', function() {
                statusSection.style.display = 'none';
                loginSection.style.display = 'block';
                configSection.style.display = 'none';
                statusTab.style.backgroundColor = '#444';
                loginTab.style.backgroundColor = '#666';
                configTab.style.backgroundColor = '#444';
            });
 
            configTab.addEventListener('click', function() {
                statusSection.style.display = 'none';
                loginSection.style.display = 'none';
                configSection.style.display = 'block';
                statusTab.style.backgroundColor = '#444';
                loginTab.style.backgroundColor = '#444';
                configTab.style.backgroundColor = '#666';
            });
 
            updateCharacterDropdown();
 
            updateStatusDisplay();
        }
 
        function init() {
            createConfigPanel();
 
            if (window.location.href.includes('Default.aspx')) {
                addToStatusLog('🔍 URL padrão de login detectada');
            }
 
            if (isCharacterSelectionPage()) {
                availableCharacters = scanAvailableCharacters();
                addToStatusLog(`🔍 Encontrados ${availableCharacters.length} personagens para seleção`);
            }
 
            checkAttributes();
            checkCurrentPage();
            console.log('Script iniciado, intervalo configurado');
 
            setInterval(function() {
                console.log('Intervalo executado');
                if (isMonitoringActive) {
                    checkAttributes();
                    checkUrlChange();
 
                    if (isLoginPage() || isCharacterSelectionPage() || (isLoggedIn() && !loginNavigationComplete && autoNavigateToImprove)) {
                        checkCurrentPage();
                    } else {
                        useNoobTubeItem();
                    }
                }
 
                updateStatusDisplay();
            }, 5000);
 
            if (isMonitoringActive && refreshInterval > 0) {
                setRefreshInterval(refreshInterval);
            }
 
            window.addEventListener('popstate', checkUrlChange);
            const originalPushState = history.pushState;
            history.pushState = function(state, title, url) {
                originalPushState.apply(this, arguments);
                checkUrlChange();
            };
        }
 
        init();
    }
})();