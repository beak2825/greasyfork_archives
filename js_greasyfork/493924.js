// ==UserScript==
// @name         FULL-EDGE Auto Roll freebitco.in 
// @namespace    https://github.com/DevZurvan
// @namespace    https://greasyfork.org/en/users/1295753-hyago-nunes
// @version      10.1
// @description  https://freebitco.in/?r=1393623
// @author       Zurvan
// @icon         https://raw.githubusercontent.com/DevZurvan/Full-Edge/main/assets/icon.png
// @match        https://freebitco.in/*
// @match        https://*/recaptcha/*
// @match        https://*.hcaptcha.com/*hcaptcha-challenge*
// @match        https://*.hcaptcha.com/*checkbox*
// @match        https://*.hcaptcha.com/*captcha*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493924/FULL-EDGE%20Auto%20Roll%20freebitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/493924/FULL-EDGE%20Auto%20Roll%20freebitcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // UTILITÁRIOS BÁSICOS
    function qSelector(selector) { return document.querySelector(selector); }
    function isHidden(el) { return (el.offsetParent === null); }
    function random(min, max) { return min + (max - min) * Math.random(); }

    // CONFIGURAÇÃO
    const CONFIG = {
        tentativasMaximas: 7,
        intervaloCaptcha: 3000,
        rollDelay: 7000,
        playWithoutCaptchaDelay: 12000,
        secondRollDelay: 14000,
        intervaloVerificacao: 1000,
        intervaloBackground: 30000,
        hcCheckBox: "#checkbox",
        hcAriaChecked: "aria-checked",
        rcCheckBox: ".recaptcha-checkbox-border",
        rcStatus: "#recaptcha-accessible-status",
        rcDosCaptcha: ".rc-doscaptcha-body",
        rollButton: "#free_play_form_button",
        playWithoutCaptchaButton: "#play_without_captchas_button",
        timerElement: "#time_remaining",
        cfIframeSelector: 'iframe[src*="challenges.cloudflare.com"]',
        cfResponseInput: "#cf-chl-widget-a1bva_response",
        cfSuccessSelector: "#success-i > circle",
        use2Captcha: true,
        turnstileSitekey: "a1bva",
        apiKey2Captcha: "e6e564ccebe70607715fa0e7a2188482",
        btcBalanceSelector: '#balance',
        btcStorageKeys: {
            initial: 'Full-Edge_initial_btc',
            gained: 'Full-Edge_gained_btc',
            lastRoll: 'Full-Edge_last_roll'
        }
    };

    // ESTADO
    let state = {
        modoOperacao: 0,
        tentativas: 0,
        ultimaExecucao: 0
    };

    // GERENCIAMENTO DE ESTADO
    function carregarEstado() {
        try {
            chrome.storage.local.get('stateFreeBTC', function(result) {
                if (result.stateFreeBTC) {
                    state = Object.assign(state, JSON.parse(result.stateFreeBTC));
                }
            });
        } catch (e) { console.error(e); }
    }

    function salvarEstado() {
        try {
            chrome.storage.local.set({
                'stateFreeBTC': JSON.stringify(state)
            });
        } catch (e) { console.error(e); }
    }

    // POPUP MANAGER
    const PopupManager = {
        fecharPopups() {
            ['.pushly_popover-container', '#onesignal-slidedown-container', '#notification_permission']
                .forEach(sel => { const el = qSelector(sel); if (el) el.style.display = 'none'; });
        }
    };

    // CAPTCHA HANDLERS
    function resolverHcaptcha() {
        if (window.location.href.includes("hcaptcha")) {
            const interval = setInterval(() => {
                const checkbox = qSelector(CONFIG.hcCheckBox);
                if (!checkbox) return;
                if (checkbox.getAttribute(CONFIG.hcAriaChecked) === "true") {
                    clearInterval(interval);
                    console.log("Hcaptcha resolvido");
                } else if (!isHidden(checkbox) && checkbox.getAttribute(CONFIG.hcAriaChecked) === "false") {
                    checkbox.click();
                    clearInterval(interval);
                    console.log("Hcaptcha: abrindo checkbox");
                }
            }, Number(CONFIG.intervaloCaptcha));
        }
    }

    function resolverRecaptcha() {
        if (window.location.href.includes("recaptcha")) {
            setTimeout(() => {
                let initialStatus = qSelector(CONFIG.rcStatus) ? qSelector(CONFIG.rcStatus).innerText : "";
                try {
                    if (qSelector(CONFIG.rcCheckBox) && !isHidden(qSelector(CONFIG.rcCheckBox))) {
                        qSelector(CONFIG.rcCheckBox).click();
                        console.log("Recaptcha: abrindo checkbox");
                    }
                    if (qSelector(CONFIG.rcStatus) && qSelector(CONFIG.rcStatus).innerText !== initialStatus) {
                        console.log("Recaptcha resolvido");
                    }
                    if (qSelector(CONFIG.rcDosCaptcha) && qSelector(CONFIG.rcDosCaptcha).innerText.length > 0) {
                        console.log("Recaptcha: consulta automatizada detectada");
                    }
                } catch (err) { console.error(err.message); }
            }, Number(CONFIG.intervaloCaptcha));
        }
    }

    // TURNSTILE HANDLERS
    function resolverTurnstileClique() {
        const cfIframe = qSelector(CONFIG.cfIframeSelector);
        if (cfIframe && cfIframe.contentDocument) {
            const checkbox = cfIframe.contentDocument.querySelector('.mark');
            if (checkbox && !isHidden(checkbox)) {
                if (simularCliqueHumano(checkbox)) {
                    console.log("Turnstile resolvido via clique");
                    return true;
                }
            }
        }
        return false;
    }

    function resolverTurnstile2Captcha(callback) {
        const reqUrl = `http://2captcha.com/in.php?key=${CONFIG.apiKey2Captcha}&method=turnstile&sitekey=${CONFIG.turnstileSitekey}&pageurl=${encodeURIComponent(window.location.href)}&json=1`;
        fetch(reqUrl)
            .then(response => response.json())
            .then(data => {
                if (data.status === 1) {
                    pollToken(data.request, callback);
                } else {
                    console.error("2Captcha Error: " + data.request);
                    callback(false);
                }
            })
            .catch(err => {
                console.error(err);
                callback(false);
            });
    }

    function pollToken(captchaId, callback) {
        const pollUrl = `http://2captcha.com/res.php?key=${CONFIG.apiKey2Captcha}&action=get&id=${captchaId}&json=1`;
        let attempts = 0;
        const pollInterval = setInterval(() => {
            attempts++;
            fetch(pollUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 1) {
                        clearInterval(pollInterval);
                        const token = data.request;
                        const input = qSelector(CONFIG.cfResponseInput);
                        if (input) {
                            input.value = token;
                            console.log("Turnstile resolvido via 2Captcha");
                            callback(true);
                        } else {
                            console.error("Input para Turnstile não encontrado");
                            callback(false);
                        }
                    } else if (data.request !== "CAPCHA_NOT_READY") {
                        clearInterval(pollInterval);
                        console.error("Erro polling: " + data.request);
                        callback(false);
                    }
                })
                .catch(err => {
                    console.error(err);
                    callback(false);
                });
            if (attempts >= 24) {
                clearInterval(pollInterval);
                console.error("Timeout 2Captcha polling");
                callback(false);
            }
        }, 5000);
    }

    
    function garantirReferenciador() {
        const referUrl = "https://freebitco.in/?r=1393623";
        if (!window.location.href.includes("?r=1393623")) {
            window.location.href = referUrl;
        }
    }

    // Inicialização
    function init() {
        garantirReferenciador(); 
        createUI();
        carregarEstado();
        PopupManager.fecharPopups();
        gerenciarCaptcha();
        iniciarAcoesTemporizadas();
        monitorarTimer();
        configurarVisibilidade();
        ajustarPreloadCloudflare();

        console.log("Full-Edge FreeBTC iniciado com sucesso!");
    }

    // Função para gerenciar captcha
    function gerenciarCaptcha() {
        if (window.location.href.includes("hcaptcha")) resolverHcaptcha();
        if (window.location.href.includes("recaptcha")) resolverRecaptcha();
        if (qSelector(CONFIG.cfIframeSelector)) {
            if (!resolverTurnstileClique() && CONFIG.use2Captcha) {
                resolverTurnstile2Captcha(function(success) {
                    if (!success) console.error("Falha ao resolver Turnstile via 2Captcha");
                });
            }
        }
    }

    // ACIONAMENTO DOS BOTÕES PLAY/ROLL
    function acionarRoll() {
        const btn = qSelector(CONFIG.rollButton);
        if (btn && !isHidden(btn)) {
            btn.click();
            console.log("ROLL acionado");
        }
        else console.warn("Botão ROLL não encontrado");
    }

    function acionarPlayWithoutCaptcha() {
        const btn = qSelector(CONFIG.playWithoutCaptchaButton);
        if (btn && !isHidden(btn)) {
            btn.click();
            console.log("PLAY WITHOUT CAPTCHA acionado");
        }
        else console.warn("Botão PLAY WITHOUT CAPTCHA não encontrado");
    }

    // AÇÕES TEMPORIZADAS
    function iniciarAcoesTemporizadas() {
        setTimeout(acionarRoll, CONFIG.rollDelay);
        setTimeout(acionarPlayWithoutCaptcha, CONFIG.playWithoutCaptchaDelay);
        setTimeout(acionarRoll, CONFIG.secondRollDelay);
    }

    // MONITORAMENTO DO TIMER
    function monitorarTimer() {
        setInterval(() => {
            const timer = qSelector(CONFIG.timerElement);
            if (timer) {
                const tempoFormatado = formatarTempoSimples(timer);
                const uiTimer = document.getElementById('uiTimer');
                if (uiTimer) {
                    uiTimer.textContent = tempoFormatado;
                }

                if (timer.textContent.trim().includes("00:00:00")) {
                    gerenciarCaptcha();
                    iniciarAcoesTemporizadas();
                }
            }
            monitorarBTC();
        }, 1000);
    }

    function formatarTempoSimples(elemento) {
        const secoes = elemento.querySelectorAll('.countdown_section');
        if (secoes.length < 2) return "00:00";
        const minutos = secoes[0].querySelector('.countdown_amount').textContent.padStart(2, '0');
        const segundos = secoes[1].querySelector('.countdown_amount').textContent.padStart(2, '0');
        return `${minutos}:${segundos}`;
    }

    // CONTROLE DE VISIBILIDADE
    function configurarVisibilidade() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log("Retomando operação em primeiro plano");
            } else {
                console.log("Modo segundo plano ativado");
            }
        });
    }

    // AJUSTE DO PRELOAD DO CLOUDFLARE
    function ajustarPreloadCloudflare() {
        try {
            const link = document.querySelector('link[rel="preload"][href*="challenges.cloudflare.com/cdn-cgi/challenge-platform/h/g/cmg/1"]');
            if (link) {
                link.setAttribute('as', 'script');
                console.log("Atributo 'as' ajustado para 'script' no link de preload");
            }
        } catch (e) { console.error(e); }
    }

    // Função para monitorar BTC
    function monitorarBTC() {
        const balanceEl = qSelector(CONFIG.btcBalanceSelector);
        if (!balanceEl) return;

        const currentBalance = parseFloat(balanceEl.textContent);

        // Inicializar valores do storage
        if (!localStorage.getItem(CONFIG.btcStorageKeys.initial)) {
            localStorage.setItem(CONFIG.btcStorageKeys.initial, currentBalance.toString());
            localStorage.setItem(CONFIG.btcStorageKeys.gained, '0');
            localStorage.setItem(CONFIG.btcStorageKeys.lastRoll, currentBalance.toString());
        }

        const lastRoll = parseFloat(localStorage.getItem(CONFIG.btcStorageKeys.lastRoll));
        let totalGained = parseFloat(localStorage.getItem(CONFIG.btcStorageKeys.gained));

        // Se houve mudança no saldo, atualizar ganhos
        if (currentBalance > lastRoll) {
            const rollGain = currentBalance - lastRoll;
            totalGained += rollGain;
            localStorage.setItem(CONFIG.btcStorageKeys.gained, totalGained.toString());
            localStorage.setItem(CONFIG.btcStorageKeys.lastRoll, currentBalance.toString());
        }

        // Atualizar UI com o ícone de reset "↻"
        const btcGanhoEl = document.getElementById('btcGanho');
        if (btcGanhoEl) {
            btcGanhoEl.innerHTML = totalGained.toFixed(8) + ' <span id="resetCounter" style="cursor:pointer; color: white;">↻</span> ';
            btcGanhoEl.style.color = totalGained >= 0 ? '#4CAF50' : '#f44336';
            // Atribuir função de reset ao ícone ↻
            const resetCounter = btcGanhoEl.querySelector('#resetCounter');
            if (resetCounter) {
                resetCounter.addEventListener('click', () => {
                    localStorage.setItem(CONFIG.btcStorageKeys.gained, '0');
                    localStorage.setItem(CONFIG.btcStorageKeys.lastRoll, currentBalance.toString());
                    btcGanhoEl.innerHTML = '0.00000000 <span id="resetCounter" style="cursor:pointer; color: white;">↻</span> ';
                    console.log("Contador zerado");
                });
            }
        }
    }

    // Inicialização
    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }

})();



function createUI() {
    const uiContainer = document.createElement('div');
    uiContainer.id = 'full-edge-ui';
    Object.assign(uiContainer.style, {
        background: 'rgba(5, 5, 5, 0.23)',          
        backdropFilter: 'blur(20px)',                      
        border: '1px solid rgba(3, 3, 3, 0.5)',        
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',       
        padding: '25px',                               
        transition: 'all 0.3s ease',
        color: '#ffffff',
        position: 'fixed',
        top: '20px',
        right: '20px',
        width: '360px', 
        borderRadius: '15px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        zIndex: '9999',
        cursor: 'move',
        boxSizing: 'border-box' 
    });

    const fontStyle = document.createElement('link');
    fontStyle.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap';
    fontStyle.rel = 'stylesheet';
    document.head.appendChild(fontStyle);

    const iconAnimation = document.createElement('style');
    iconAnimation.textContent = `
        @keyframes pulseIcon {
            0% { transform: scale(1); filter: drop-shadow(0 0 10px #001f3f); }
            50% { transform: scale(1.1); filter: drop-shadow(0 0 15pxrgb(0, 19, 37)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 10pxrgb(0, 15, 29)); }
        }
        @keyframes neonPulse {
            0% { box-shadow: 0 0 5pxrgba(250, 148, 59, 0.75), 0 0 10pxrgba(0, 0, 0, 0.62), 0 0 15pxrgba(0, 0, 0, 0.62) }
            50% { box-shadow: 0 0 10pxrgba(0, 0, 0, 0.62), 0 0 20pxrgba(247, 170, 102, 0.75), 0 0 30pxrgba(252, 163, 85, 0.79); }
            100% { box-shadow: 0 0 5px rgba(0, 0, 0, 0.62), 0 0 10px rgba(0, 0, 0, 0.62) rgba(0, 0, 0, 0.62) }
        }
    `;
    document.head.appendChild(iconAnimation);

    const rgbAnimation = document.createElement('style');
    rgbAnimation.textContent = `
        @keyframes rgbText {
            0% { filter: hue-rotate(0deg) brightness(1.2); }
            50% { filter: hue-rotate(180deg) brightness(1.5); }
            100% { filter: hue-rotate(360deg) brightness(1.2); }
        }
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(35deg); }
            100% { transform: translateX(200%) rotate(35deg); }
        }
    `;
    document.head.appendChild(rgbAnimation);

    // === NOVA ESTRUTURA DO HEADER ===
    const header = document.createElement('div');
    Object.assign(header.style, {
        padding: '15px 0',
        borderBottom: '2px solid rgba(255,255,255,0.7)',    
        marginBottom: '15px'
    });

    // Linha superior: ícone e título na mesma linha
    const headerTop = document.createElement('div');
    Object.assign(headerTop.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap' 
    });
    const iconContainer = document.createElement('div');
    Object.assign(iconContainer.style, {
        width: '60px',
        height: '60px',
        flexShrink: '0'
    });
    const icon = document.createElement('img');
    icon.src = 'https://raw.githubusercontent.com/DevZurvan/Full-Edge/main/assets/icon.png';
    icon.alt = 'Full-Edge Icon';
    Object.assign(icon.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 10px #001f3f)',
        animation: 'pulseIcon 2s infinite ease-in-out'
    });
    iconContainer.appendChild(icon);
    const titleContainer = document.createElement('div');
    Object.assign(titleContainer.style, {
        marginLeft: '15px',
        flexGrow: '1',
        minWidth: '0'
    });
    const title = document.createElement('h1');
    title.textContent = 'FULL-EDGE';
    Object.assign(title.style, {
        margin: '0',
        fontSize: '28px',
        color: '#ffffff',
        textShadow: '0 0 10pxrgb(10, 1, 0)',
        letterSpacing: '2px'
    });
    titleContainer.appendChild(title);
    headerTop.appendChild(iconContainer);
    headerTop.appendChild(titleContainer);

    // Linha inferior: tagline (subTitle) centralizada
    const headerBottom = document.createElement('div');
    Object.assign(headerBottom.style, {
        textAlign: 'center',
        marginTop: '8px'
    });
    const subTitle = document.createElement('div');
    subTitle.textContent = 'Espaço intocado, ações ilimitadas.';
    Object.assign(subTitle.style, {
        fontSize: '16px',
        color: 'rgb(0, 0, 0)',
        textShadow: '0 0 5pxrgba(3, 0, 0, 0.5)'
    });
    headerBottom.appendChild(subTitle);

    header.appendChild(headerTop);
    header.appendChild(headerBottom);
    uiContainer.appendChild(header);

    const infoSection = document.createElement('div');
    Object.assign(infoSection.style, {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        marginBottom: '15px',
        flexWrap: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',              
        borderRadius: '8px',
        padding: '12px'
    });
    const btcCard = document.createElement('div');
    Object.assign(btcCard.style, {
        flex: '1',
        background: '#222',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center'
    });
    btcCard.innerHTML = `<div style="font-size: 14px; margin-bottom: 5px;"><strong>BTC Ganho</strong></div>
                         <div id="btcGanho" style="font-size: 16px;">0.00000000</div>`;
    const rollCard = document.createElement('div');
    Object.assign(rollCard.style, {
        flex: '1',
        background: '#222',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center'
    });
    rollCard.innerHTML = `<div style="font-size: 14px; margin-bottom: 5px;"><strong>Próximo Roll</strong></div>
                          <div id="uiTimer" style="font-size: 16px;">00:00</div>`;
    infoSection.appendChild(btcCard);
    infoSection.appendChild(rollCard);
    uiContainer.appendChild(infoSection);

    // === NOVA ESTRUTURA DO RODAPÉ ===
    const footerContainer = document.createElement('div');
    Object.assign(footerContainer.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '15px',
        borderTop: '2px solid rgba(255,255,255,0.7)',
        gap: '10px'
    });
    const footerTop = document.createElement('div');
    Object.assign(footerTop.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'nowrap'
    });
    const githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/DevZurvan';
    githubLink.target = '_blank';
    githubLink.title = 'GitHub do Desenvolvedor';
    githubLink.innerHTML = '<img src="https://raw.githubusercontent.com/DevZurvan/Full-Edge/main/assets/github.png" alt="GitHub" style="width:60px; transition: transform 0.3s;">';
    Object.assign(githubLink.style, {
        background: 'rgba(255, 255, 255, 0)',
        borderRadius: '8px',
        padding: '5px',
        boxShadow: '0 0 3px rgba(252, 252, 252, 0)'
    });
    const donationIcon = document.createElement('div');
    donationIcon.style.cursor = 'pointer';
    donationIcon.title = 'Copiar carteira BTC';
    donationIcon.innerHTML = '<img src="https://raw.githubusercontent.com/DevZurvan/Full-Edge/main/assets/donate.png" alt="Doação BTC" style="width:60px; transition: transform 0.3s;">';
    Object.assign(donationIcon.style, {
        background: 'rgba(241, 241, 241, 0)',
        borderRadius: '8px',
        padding: '5px',
        boxShadow: '0 0 3px rgba(255, 255, 255, 0)'
    });
    footerTop.appendChild(githubLink);
    footerTop.appendChild(donationIcon);

    // Linha inferior: crédito do desenvolvedor centralizado
    const footerBottom = document.createElement('div');
    Object.assign(footerBottom.style, {
        textAlign: 'center',
        fontSize: '10px',
        color: '#cccccc',
        fontFamily: '"Cinzel", serif',
        letterSpacing: '1px'
    });
    footerBottom.textContent = 'by Zurvan';

    footerContainer.appendChild(footerTop);
    footerContainer.appendChild(footerBottom);
    uiContainer.appendChild(footerContainer);

    const addHoverEffect = (img) => {
        img.addEventListener('mouseover', () => { img.style.transform = 'scale(1.1)'; });
        img.addEventListener('mouseout', () => { img.style.transform = 'scale(1)'; });
    };
    addHoverEffect(githubLink.querySelector('img'));
    addHoverEffect(donationIcon.querySelector('img'));

    const btcAddress = '17jGRDbuMb5oxsjTG64FFB2Ax4BNBhqrV';
    donationIcon.addEventListener('click', () => {
        navigator.clipboard.writeText(btcAddress).then(() => {
            showTooltip(donationIcon, 'Carteira copiada!');
        });
    });

    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        Object.assign(tooltip.style, {
            position: 'absolute',
            background: '#FF4136',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '5px',
            fontSize: '12px',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.3s'
        });
        element.style.position = 'relative';
        element.appendChild(tooltip);
        setTimeout(() => { tooltip.style.opacity = '1'; }, 50);
        setTimeout(() => { tooltip.style.opacity = '0'; }, 2000);
        setTimeout(() => { element.removeChild(tooltip); }, 2500);
    }

    let offsetX = 0, offsetY = 0;
    headerTop.addEventListener('mousedown', (e) => {
        e.preventDefault();
        offsetX = e.clientX - uiContainer.offsetLeft;
        offsetY = e.clientY - uiContainer.offsetTop;
        document.addEventListener('mousemove', moveAt);
        document.addEventListener('mouseup', () => { 
            document.removeEventListener('mousemove', moveAt); 
        }, { once: true });
    });
    function moveAt(e) {
        uiContainer.style.left = (e.clientX - offsetX) + 'px';
        uiContainer.style.top = (e.clientY - offsetY) + 'px';
    }

    document.body.appendChild(uiContainer);
    return uiContainer;
}