// ==UserScript==
// @name         KEN at-ads - Bloqueador de Anúncios
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Painel móvel elegante para bloqueio de anúncios
// @author       KEN AI
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543644/KEN%20at-ads%20-%20Bloqueador%20de%20An%C3%BAncios.user.js
// @updateURL https://update.greasyfork.org/scripts/543644/KEN%20at-ads%20-%20Bloqueador%20de%20An%C3%BAncios.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Verificar se já foi inicializado
  if (window.kenAtAdsInitialized) {
    console.warn('KEN at-ads já foi inicializado.');
    return;
  }
  window.kenAtAdsInitialized = true;

  // Estilos CSS
  const stylesContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

        .ken-at-ads-panel {
            position: fixed;
            top: 20px;
            right: -400px;
            width: 380px;
            height: 500px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: 'Inter', sans-serif;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .ken-at-ads-panel.open {
            right: 20px;
        }

        /* Media Queries para Mobile */
        @media screen and (max-width: 480px) {
            .ken-at-ads-panel {
                top: 10px;
                right: -100vw;
                left: 10px;
                width: calc(100vw - 20px);
                height: calc(100vh - 20px);
                border-radius: 15px;
                max-width: none;
            }

            .ken-at-ads-panel.open {
                right: 0;
                left: 10px;
            }
        }

        @media screen and (max-width: 768px) and (min-width: 481px) {
            .ken-at-ads-panel {
                width: 320px;
                height: 450px;
                top: 15px;
                right: -340px;
            }

            .ken-at-ads-panel.open {
                right: 15px;
            }
        }

        .ken-at-ads-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .ken-at-ads-title {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
        }

        .ken-at-ads-logo {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #ff6b6b, #ffd93d);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            color: #333;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }

        .ken-at-ads-title span {
            font-size: 16px;
            font-weight: 600;
        }

        .ken-at-ads-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .ken-at-ads-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .ken-at-ads-content {
            padding: 20px;
            height: calc(100% - 80px);
            overflow-y: auto;
        }

        .ken-at-ads-stats {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
        }

        .ken-at-ads-stats-number {
            font-size: 32px;
            font-weight: 700;
            color: #ffd93d;
            margin-bottom: 5px;
        }

        .ken-at-ads-stats-label {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }

        .ken-at-ads-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 15px 20px;
            margin-bottom: 15px;
            color: white;
        }

        .ken-at-ads-switch {
            position: relative;
            width: 50px;
            height: 25px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .ken-at-ads-switch.active {
            background: #4CAF50;
        }

        .ken-at-ads-switch-handle {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 21px;
            height: 21px;
            background: white;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .ken-at-ads-switch.active .ken-at-ads-switch-handle {
            transform: translateX(25px);
        }

        .ken-at-ads-filters {
            margin-top: 20px;
        }

        .ken-at-ads-filter-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
        }

        .ken-at-ads-filter-item:last-child {
            border-bottom: none;
        }

        .ken-at-ads-filter-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ken-at-ads-filter-icon {
            width: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .ken-at-ads-floating-btn {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            z-index: 999998;
            transition: all 0.3s ease;
        }

        .ken-at-ads-floating-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }

        .ken-at-ads-floating-btn.panel-open {
            right: 420px;
        }

        /* Ajustes do botão flutuante para mobile */
        @media screen and (max-width: 480px) {
            .ken-at-ads-floating-btn {
                width: 50px;
                height: 50px;
                right: 15px;
                font-size: 20px;
                z-index: 1000000;
                bottom: 20px;
                top: auto;
                transform: none;
            }

            .ken-at-ads-floating-btn.panel-open {
                right: 15px;
                opacity: 0.7;
            }

            .ken-at-ads-close {
                width: 44px;
                height: 44px;
                font-size: 18px;
                z-index: 1000001;
                touch-action: manipulation;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                min-height: 44px;
                min-width: 44px;
            }

            .ken-at-ads-header {
                padding: 15px 20px;
                touch-action: manipulation;
            }
        }

        @media screen and (max-width: 768px) and (min-width: 481px) {
            .ken-at-ads-floating-btn.panel-open {
                right: 350px;
            }
        }

        .ken-at-ads-status-indicator {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 16px;
            height: 16px;
            background: #4CAF50;
            border-radius: 50%;
            border: 2px solid white;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }

        .ken-at-ads-blocked-list {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 10px;
            margin-top: 15px;
        }

        .ken-at-ads-blocked-item {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            padding: 5px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ken-at-ads-blocked-item:last-child {
            border-bottom: none;
        }

        .ken-at-ads-notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
            z-index: 1000000;
            font-family: 'Inter', sans-serif;
            font-weight: 500;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .ken-at-ads-notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(10px);
        }
    `;

  // Adicionar estilos
  const styleSheet = document.createElement('style');
  styleSheet.textContent = stylesContent;
  document.head.appendChild(styleSheet);

  // HTML do painel
  function createPanelHTML() {
    return `
      <div class="ken-at-ads-panel" id="kenAtAdsPanel">
        <div class="ken-at-ads-header">
          <div class="ken-at-ads-title">
            <div class="ken-at-ads-logo">🛡️</div>
            <span>KEN at-ads</span>
          </div>
          <button class="ken-at-ads-close" id="kenAtAdsClose">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="ken-at-ads-content">
          <div class="ken-at-ads-stats">
            <div class="ken-at-ads-stats-number" id="blockedCount">247</div>
            <div class="ken-at-ads-stats-label">Anúncios Bloqueados</div>
          </div>
          <div class="ken-at-ads-filters">
            <div class="ken-at-ads-filter-item">
              <div class="ken-at-ads-filter-info">
                <div class="ken-at-ads-filter-icon">🔄</div>
                <div>
                  <div style="font-weight: 500;">Bypass Redirecionável</div>
                  <div style="font-size: 11px; opacity: 0.7;">horoscopeonday.com</div>
                </div>
              </div>
              <div class="ken-at-ads-switch" id="bypassToggle">
                <div class="ken-at-ads-switch-handle"></div>
              </div>
            </div>
            <div class="ken-at-ads-filter-item">
              <div class="ken-at-ads-filter-info">
                <div class="ken-at-ads-filter-icon">🆕</div>
                <div>
                  <div style="font-weight: 500;">Bypass Milbviral</div>
                  <div style="font-size: 11px; opacity: 0.7;">milbviral.com</div>
                </div>
              </div>
              <div class="ken-at-ads-switch" id="milbviralBypassToggle">
                <div class="ken-at-ads-switch-handle"></div>
              </div>
            </div>
            <div class="ken-at-ads-filter-item">
              <div class="ken-at-ads-filter-info">
                <div class="ken-at-ads-filter-icon">🔓</div>
                <div>
                  <div style="font-weight: 500;">Bypass Kasviral</div>
                  <div style="font-size: 11px; opacity: 0.7;">kasviral.com</div>
                </div>
              </div>
              <div class="ken-at-ads-switch" id="kasviralBypassToggle">
                <div class="ken-at-ads-switch-handle"></div>
              </div>
            </div>
            <div class="ken-at-ads-filter-item">
              <div class="ken-at-ads-filter-info">
                <div class="ken-at-ads-filter-icon">🔓</div>
                <div>
                  <div style="font-weight: 500;">Bypass Guis2</div>
                  <div style="font-size: 11px; opacity: 0.7;">guis2.com</div>
                </div>
              </div>
              <div class="ken-at-ads-switch" id="guis2BypassToggle">
                <div class="ken-at-ads-switch-handle"></div>
              </div>
            </div>
            <div class="ken-at-ads-filter-item">
              <div class="ken-at-ads-filter-info">
                <div class="ken-at-ads-filter-icon">🚀</div>
                <div>
                  <div style="font-weight: 500;">Bypass Automático</div>
                  <div style="font-size: 11px; opacity: 0.7;">Todos os sites</div>
                </div>
              </div>
              <div id="autoBypassBtn" class="ken-at-ads-switch">
                <div class="ken-at-ads-switch-handle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="ken-at-ads-floating-btn" id="kenAtAdsFloatingBtn">
        <i class="fas fa-shield-alt"></i>
        <div class="ken-at-ads-status-indicator"></div>
      </button>
    `;
  }
  function unlockAndClick() {
    const unlockLink = document.querySelector('a.linky.buttonpanel.get-link.disabled');
    if (unlockLink) {
      unlockLink.classList.remove('disabled');
      unlockLink.style.pointerEvents = 'auto';
      unlockLink.querySelector('span').textContent = 'Link Liberado! Clica aí.';
      console.log('Botão liberado, clicando agora...');
      unlockLink.click();
    } else {
      console.log('Botão bloqueado não encontrado');
    }
  }

  // Tenta liberar e clicar a cada 2 segundos até conseguir
  const interval = setInterval(() => {
    unlockAndClick();
  }, 2000);

  // Para o loop depois de 20 segundos para não ficar infinito
  setTimeout(() => clearInterval(interval), 20000);
  // Para o loop depois de 20 segundos para não ficar infinito
  setTimeout(() => clearInterval(interval), 20000);
  // Criar e adicionar painel
  const panelContainer = document.createElement('div');
  panelContainer.innerHTML = createPanelHTML();
  document.body.appendChild(panelContainer);

  // Elementos DOM
  const panel = document.getElementById('kenAtAdsPanel');
  const floatingBtn = document.getElementById('kenAtAdsFloatingBtn');
  const closeBtn = document.getElementById('kenAtAdsClose');
  const bypassToggle = document.getElementById('bypassToggle');
  const milbviralBypassToggle = document.getElementById('milbviralBypassToggle');
  const kasviralBypassToggle = document.getElementById('kasviralBypassToggle');
  const guis2BypassToggle = document.getElementById('guis2BypassToggle');
  const autoBypassBtn = document.getElementById('autoBypassBtn');

  // Configurações do localStorage
  const BYPASS_STORAGE_KEY = 'kenAtAds_bypassEnabled';
  const MILBVIRAL_BYPASS_STORAGE_KEY = 'kenAtAds_milbviralBypassEnabled';
  const KASVIRAL_BYPASS_STORAGE_KEY = 'kenAtAds_kasviralBypassEnabled';
  const GUIS2_BYPASS_STORAGE_KEY = 'kenAtAds_guis2BypassEnabled';
  const AUTO_BYPASS_STORAGE_KEY = 'kenAtAds_autoBypassEnabled';

  // Carregar estado do bypass
  function loadBypassState() {
    const saved = localStorage.getItem(BYPASS_STORAGE_KEY);
    return saved === 'true';
  }

  // Carregar estado do bypass do Milbviral
  function loadMilbviralBypassState() {
    const saved = localStorage.getItem(MILBVIRAL_BYPASS_STORAGE_KEY);
    return saved === 'true';
  }

  // Carregar estado do bypass do Kasviral
  function loadKasviralBypassState() {
    const saved = localStorage.getItem(KASVIRAL_BYPASS_STORAGE_KEY);
    return saved === 'true';
  }

  // Carregar estado do bypass do Guis2
  function loadGuis2BypassState() {
    const saved = localStorage.getItem(GUIS2_BYPASS_STORAGE_KEY);
    return saved === 'true';
  }

  // Carregar estado do bypass automático
  function loadAutoBypassState() {
    const saved = localStorage.getItem(AUTO_BYPASS_STORAGE_KEY);
    return saved === 'true';
  }

  // Salvar estado do bypass
  function saveBypassState(enabled) {
    localStorage.setItem(BYPASS_STORAGE_KEY, enabled.toString());
  }

  // Salvar estado do bypass do Milbviral
  function saveMilbviralBypassState(enabled) {
    localStorage.setItem(MILBVIRAL_BYPASS_STORAGE_KEY, enabled.toString());
  }

  // Salvar estado do bypass do Kasviral
  function saveKasviralBypassState(enabled) {
    localStorage.setItem(KASVIRAL_BYPASS_STORAGE_KEY, enabled.toString());
  }

  // Salvar estado do bypass do Guis2
  function saveGuis2BypassState(enabled) {
    localStorage.setItem(GUIS2_BYPASS_STORAGE_KEY, enabled.toString());
  }

  // Salvar estado do bypass automático
  function saveAutoBypassState(enabled) {
    localStorage.setItem(AUTO_BYPASS_STORAGE_KEY, enabled.toString());
  }

  // Inicializar estado do bypass
  function initBypassState() {
    const enabled = loadBypassState();
    if (enabled) {
      bypassToggle.classList.add('active');
    }

    // Inicializar estado do bypass do Milbviral
    const milbviralEnabled = loadMilbviralBypassState();
    if (milbviralEnabled) {
      milbviralBypassToggle.classList.add('active');
    }

    // Inicializar estado do bypass do Kasviral
    const kasviralEnabled = loadKasviralBypassState();
    if (kasviralEnabled) {
      kasviralBypassToggle.classList.add('active');
    }

    // Inicializar estado do bypass do Guis2
    const guis2Enabled = loadGuis2BypassState();
    if (guis2Enabled) {
      guis2BypassToggle.classList.add('active');
    }

    // Inicializar estado do bypass automático
    const autoBypassEnabled = loadAutoBypassState();
    if (autoBypassEnabled) {
      autoBypassBtn.classList.add('active');
    }
  }

  // Função para mostrar notificações
  function showNotification(message, duration = 3000) {
    // Remover notificação existente se houver
    const existingNotification = document.querySelector('.ken-at-ads-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = 'ken-at-ads-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remover notificação após o tempo especificado
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, duration);
  }

  // Funções
  function togglePanel() {
    panel.classList.toggle('open');
    floatingBtn.classList.toggle('panel-open');
  }

  function toggleSwitch(switchElement) {
    switchElement.classList.toggle('active');

    // Se for o toggle do bypass, salvar estado e executar/parar bypass
    if (switchElement === bypassToggle) {
      const enabled = switchElement.classList.contains('active');
      saveBypassState(enabled);

      if (enabled) {
        showNotification('Bypass redirecionável ativado');
        // Só executa se estiver no site correto
        if (window.location.hostname.includes('horoscopeonday.com')) {
          executeBypass();
        }
      } else {
        showNotification('Bypass redirecionável desativado');
      }
    }
  }

  // Função do bypass redirecionável
  async function executeBypass() {
    // Verificar se está no site correto
    if (!window.location.hostname.includes('horoscopeonday.com')) {
      return;
    }

    // Mostrar notificação de início
    showNotification('Bypass redirecionável ativado');

    // Pega params da URL
    const params = new URLSearchParams(window.location.search);
    const vsl = params.get('vsl');
    let i = parseInt(params.get('i'), 10);
    const t = params.get('t');

    // Usa a URL atual como hostname
    const hostname = window.location.href;

    if (!vsl || !i || !t) {
      console.log('❌ Parâmetros vsl, i ou t não encontrados na URL!');
      return;
    }

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    // Função para fazer POST para objects.php e lidar com botão + captcha
    async function getButtonAndSolveCaptcha() {
      const data = {
        i: i.toString(),
        t,
        vsl,
        hostname,
        v: localStorage.getItem(vsl),
      };

      const res = await fetch('https://app.alpharede.com/ws/objects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error('Falha no request objects.php');
      }

      // Se i==1 tem captcha (soma simples)
      if (i === 1) {
        // Pega números da pergunta (ex: "Quantos é 3 + 7?")
        const regex = /Quantos é (\d+) \+ (\d+)\?/;
        const match = regex.exec(json.messageDiv.text);
        if (match) {
          const num1 = parseInt(match[1], 10);
          const num2 = parseInt(match[2], 10);
          const soma = num1 + num2;
          console.log(`🧠 Resolvendo captcha: ${num1} + ${num2} = ${soma}`);
          showNotification(`Captcha resolvido: ${num1} + ${num2} = ${soma}`);

          // Salva no localStorage que captcha passou
          localStorage.setItem('recaptcha-' + vsl, true);

          // Simula "clicar no botão" que ativa o redirect
          await redirectLinks();
          return;
        }
      }

      // Se não captcha, espera o tempo pedido e tenta clicar no botão (força visibilidade)
      const tempo = json.messageDiv.time * 1000 || 0;
      console.log(`⏳ Esperando ${tempo / 1000}s para liberar botão...`);
      showNotification(`Aguardando ${Math.round(tempo / 1000)}s para prosseguir...`);

      // Força o botão aparecer
      // (vai clicar automaticamente depois do tempo)
      await delay(tempo);
    }

    // Função para fazer POST para redirectLinks.php e navegar
    async function redirectLinks() {
      const data = {
        i: i.toString(),
        t,
        vsl,
        hostname,
        v: localStorage.getItem(vsl),
      };

      const res = await fetch('https://app.alpharede.com/ws/redirectLinks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (json.success) {
        if (json.isLast) {
          console.log('✅ Link final encontrado:', json.destination_link);
          showNotification('Bypass concluído! Redirecionando...', 2000);
          localStorage.setItem(vsl, true); // marca no localStorage que passou
          setTimeout(() => {
            window.location.href = json.destination_link;
          }, 2000);
        } else {
          console.log('➡️ Próxima etapa:', json.redirect_link);
          showNotification('Avançando para próxima etapa...', 1500);
          // Atualiza i e vai pra próxima etapa, recarregando a página com o redirect_link
          i++;
          setTimeout(() => {
            window.location.href = json.redirect_link;
          }, 1500);
        }
      } else {
        throw new Error('Falha no request redirectLinks.php');
      }
    }

    try {
      // Se i==1 e tiver captcha, resolve antes
      if (i === 1 && !localStorage.getItem('recaptcha-' + vsl)) {
        await getButtonAndSolveCaptcha();
      } else {
        // Senão, pula direto pra redirectLinks
        await redirectLinks();
      }
    } catch (e) {
      console.error('❌ Erro no bypass:', e);
      showNotification('Erro no bypass: ' + e.message, 5000);
    }
  }

  // Event listeners
  floatingBtn.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  // Adicionar suporte a touch events para mobile
  floatingBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    togglePanel();
  });

  closeBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    togglePanel();
  });

  // Toggle switch do bypass
  if (bypassToggle) {
    bypassToggle.addEventListener('click', () => toggleSwitch(bypassToggle));
  }

  // Toggle switch do milbviral
  if (milbviralBypassToggle) {
    milbviralBypassToggle.addEventListener('click', () => {
      const enabled = !milbviralBypassToggle.classList.contains('active');
      saveMilbviralBypassState(enabled);
      milbviralBypassToggle.classList.toggle('active');
      if (enabled) {
        showNotification('Bypass Milbviral ativado');
        // Só executa se estiver no site correto
        if (window.location.hostname.includes('milbviral.com')) {
          executeMilbviralBypass();
        }
      } else {
        showNotification('Bypass Milbviral desativado');
      }
    });
  }

  // Função para criar e gerenciar o botão de liberação de link
  function createUnlockLinkButton() {
    // Removido completamente
  }

  // Remoção de todo código relacionado ao Sub4unlock
  // Removido toggle, funções e referências ao Sub4unlock

  // Toggle switch do Kasviral
  if (kasviralBypassToggle) {
    kasviralBypassToggle.addEventListener('click', () => {
      const enabled = !kasviralBypassToggle.classList.contains('active');
      saveKasviralBypassState(enabled);
      kasviralBypassToggle.classList.toggle('active');
      if (enabled) {
        showNotification('Bypass Kasviral ativado');
        // Só executa se estiver no site correto
        if (window.location.hostname.includes('kasviral.com')) {
          executeKasviralBypass();
        }
      } else {
        showNotification('Bypass Kasviral desativado');
      }
    });
  }

  // Toggle switch do Guis2
  if (guis2BypassToggle) {
    guis2BypassToggle.addEventListener('click', () => {
      const enabled = !guis2BypassToggle.classList.contains('active');
      saveGuis2BypassState(enabled);
      guis2BypassToggle.classList.toggle('active');
      if (enabled) {
        showNotification('Bypass Guis2 ativado');
        // Só executa se estiver no site correto
        if (window.location.hostname.includes('guis2.com')) {
          executeGuis2Bypass();
        }
      } else {
        showNotification('Bypass Guis2 desativado');
      }
    });
  }

  // Toggle switch do Bypass Automático
  if (autoBypassBtn) {
    autoBypassBtn.addEventListener('click', () => {
      const enabled = !autoBypassBtn.classList.contains('active');
      saveAutoBypassState(enabled);
      autoBypassBtn.classList.toggle('active');
      if (enabled) {
        showNotification('Bypass Automático Ativado 🚀\nSerá aplicado em sites compatíveis', 4000);
        // Inicia o bypass automático
        autoDetectAndBypass();
      } else {
        showNotification('Bypass Automático Desativado', 3000);
      }
    });
  }

  // Inicializar estado do bypass
  initBypassState();

  // Executar bypass automaticamente se estiver ativado
  if (loadBypassState() && window.location.hostname.includes('horoscopeonday.com')) {
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
      executeBypass();
    }, 1000);
  }

  // Executar bypass do Milbviral automaticamente se estiver ativado
  if (loadMilbviralBypassState() && window.location.hostname.includes('milbviral.com')) {
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
      executeMilbviralBypass();
    }, 1000);
  }

  // Executar bypass do Kasviral automaticamente se estiver ativado
  if (loadKasviralBypassState() && window.location.hostname.includes('kasviral.com')) {
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
      executeKasviralBypass();
    }, 1000);
  }

  // Executar bypass do Guis2 automaticamente se estiver ativado
  if (loadGuis2BypassState() && window.location.hostname.includes('guis2.com')) {
    // Aguardar um pouco para garantir que a página carregou
    setTimeout(() => {
      executeGuis2Bypass();
    }, 1000);
  }

  // Atalho de teclado
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      togglePanel();
    }

    if (e.key === 'Escape' && panel.classList.contains('open')) {
      togglePanel();
    }
  });

  // Simular contador de anúncios bloqueados
  let blockedCount = 247;
  const blockedCountElement = document.getElementById('blockedCount');
  setInterval(() => {
    blockedCount += Math.floor(Math.random() * 3);
    blockedCountElement.textContent = blockedCount;
  }, 5000);

  // Novo bypass para milbviral.com
  async function executeMilbviralBypass() {
    if (!window.location.hostname.includes('milbviral.com')) {
      showNotification('Este bypass só funciona em milbviral.com', 4000);
      return;
    }
    const baseUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const vsl = urlParams.get('vsl');
    const i = urlParams.get('i') || '1';
    const t = urlParams.get('t');
    if (!vsl || !t) {
      showNotification('Parâmetros vsl ou t não encontrados na URL!', 4000);
      return;
    }
    const payload = {
      i: i,
      t: t,
      vsl: vsl,
      hostname: baseUrl,
      v: 'true',
    };
    try {
      const response = await fetch('https://app.alpharede.com/ws/submais/redirectLinks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (json.success && json.isLast && json.destination_link) {
        showNotification('Bypass milbviral concluído! Redirecionando...', 2000);
        setTimeout(() => {
          window.location.href = json.destination_link;
        }, 2000);
      } else {
        showNotification('Resposta inesperada do servidor!', 4000);
        console.error('❌ Resposta inesperada:', json);
      }
    } catch (e) {
      showNotification('Erro na requisição: ' + e.message, 5000);
      console.error('❌ Erro na requisição:', e);
    }
  }

  // Novo bypass para kasviral.com
  async function executeKasviralBypass() {
    if (!window.location.hostname.includes('kasviral.com')) {
      showNotification('Este bypass só funciona em kasviral.com', 4000);
      return;
    }

    const baseUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const vsl = urlParams.get('vsl');
    const i = urlParams.get('i') || '1';
    const t = urlParams.get('t');

    if (!vsl || !t) {
      showNotification('Parâmetros vsl ou t não encontrados na URL!', 4000);
      return;
    }

    const payload = {
      i: i,
      t: t,
      vsl: vsl,
      hostname: baseUrl,
      v: 'true',
    };

    try {
      const response = await fetch('https://app.alpharede.com/ws/submais/redirectLinks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.success && json.isLast && json.destination_link) {
        showNotification('Bypass Kasviral concluído! Redirecionando...', 2000);
        setTimeout(() => {
          window.location.href = json.destination_link;
        }, 2000);
      } else {
        showNotification('Resposta inesperada do servidor!', 4000);
        console.error('❌ Resposta inesperada:', json);
      }
    } catch (e) {
      showNotification('Erro na requisição: ' + e.message, 5000);
      console.error('❌ Erro na requisição:', e);
    }
  }

  // Novo bypass para guis2.com
  async function executeGuis2Bypass() {
    if (!window.location.hostname.includes('guis2.com')) {
      showNotification('Este bypass só funciona em guis2.com', 4000);
      return;
    }

    const baseUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const vsl = urlParams.get('vsl');
    const i = urlParams.get('i') || '1';
    const t = urlParams.get('t');

    if (!vsl || !t) {
      showNotification('Parâmetros vsl ou t não encontrados na URL!', 4000);
      return;
    }

    const payload = {
      i: i,
      t: t,
      vsl: vsl,
      hostname: baseUrl,
      v: 'true',
    };

    try {
      const response = await fetch('https://app.alpharede.com/ws/submais/redirectLinks.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.success && json.isLast && json.destination_link) {
        showNotification('Bypass Guis2 concluído! Redirecionando...', 2000);
        setTimeout(() => {
          window.location.href = json.destination_link;
        }, 2000);
      } else {
        showNotification('Resposta inesperada do servidor!', 4000);
        console.error('❌ Resposta inesperada:', json);
      }
    } catch (e) {
      showNotification('Erro na requisição: ' + e.message, 5000);
      console.error('❌ Erro na requisição:', e);
    }
  }

  // Função para injetar código de desbloqueio no Sub4unlock
  function injectSub4unlockBypass() {
    // Removido completamente
  }

  // Função de detecção e bypass automático para sites similares
  function autoDetectAndBypass() {
    const url = new URL(window.location.href);
    const vsl = url.searchParams.get('vsl');
    const t = url.searchParams.get('t');
    let i = parseInt(url.searchParams.get('i') || '1');
    const v = localStorage.getItem(vsl) || null;

    if (!vsl || !t) return;

    // Detectar se é um dos domínios do sistema AlphaRede
    const isAlphaHost =
      window.location.hostname.includes('jamviral.com') ||
      window.location.hostname.includes('blogdelicia.com') ||
      window.location.hostname.includes('mabuviral.com') ||
      window.location.hostname.includes('guis2.com') ||
      window.location.hostname.includes('submais.com') ||
      window.location.hostname.includes('alpharede.com') ||
      window.location.hostname.includes('horoscopeonday.com') ||
      window.location.hostname.includes('milbviral.com') ||
      window.location.hostname.includes('kasviral.com');

    if (!isAlphaHost) return;

    const apiUrl = window.location.href.includes('submais')
      ? 'https://app.alpharede.com/ws/submais/redirectLinks.php'
      : 'https://app.alpharede.com/ws/redirectLinks.php';

    async function seguirAteOFim() {
      while (true) {
        const fullUrl = `${window.location.origin}${window.location.pathname}?vsl=${vsl}&i=${i}&t=${t}&utm_source=3921&origin=ar`;

        const payload = {
          i: i.toString(),
          t: t,
          vsl: vsl,
          hostname: fullUrl,
          v: v,
        };

        console.log(`🔄 Buscando etapa i=${i}...`);

        try {
          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const json = await res.json();
          console.log(`📡 Resposta i=${i}:`, json);

          // Verifica se é o destino final
          if (json.isLast && json.destination_link && json.destination_link.startsWith('http')) {
            console.log('✅ Link final detectado:', json.destination_link);
            showNotification('Bypass automático concluído!', 2000);
            window.location.href = json.destination_link;
            return;
          }

          // Verifica se o redirecionamento intermediário é válido
          if (
            json.redirect_link &&
            typeof json.redirect_link === 'string' &&
            json.redirect_link.startsWith('http') &&
            json.redirect_link.length > 20 &&
            !json.redirect_link.includes('https://?')
          ) {
            const nextUrl = new URL(json.redirect_link);
            const nextI = parseInt(nextUrl.searchParams.get('i')) || i + 1;
            i = nextI;
            console.log(`➡️ Redirecionando para etapa i=${i}...`);
            window.location.href = json.redirect_link;
            return;
          } else {
            console.warn('⚠️ Link intermediário inválido, tentando próxima etapa...');
            i++;
          }
        } catch (err) {
          console.error('❌ Erro na requisição:', err);
          showNotification('Erro no bypass automático', 3000);
          return;
        }
      }
    }

    // Verifica se o bypass automático está ativado
    if (loadAutoBypassState()) {
      showNotification('Bypass Automático Iniciado 🚀', 3000);
      seguirAteOFim();
    }
  }

  // Executa detecção automática em todos os sites
  autoDetectAndBypass();

  console.log('KEN at-ads inicializado! Use Alt+A para abrir/fechar');
})();
