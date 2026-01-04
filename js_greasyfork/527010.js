// ==UserScript==
// @name         Discord UI Organizer Pro
// @namespace    https://discord.com/*
// @version      1.2
// @description  Layout premium para Discord com melhor organização visual e funcional
// @author       EmersonxD
// @match        https://discord.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527010/Discord%20UI%20Organizer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/527010/Discord%20UI%20Organizer%20Pro.meta.js
// ==/UserScript==

/* Layout Principal */
GM_addStyle(`
  /* Estrutura Base */
  .appMount-3lHmkl {
    display: grid !important;
    grid-template-columns: 80px 240px minmax(300px, 1fr) 240px;
    grid-template-rows: 48px 1fr;
    height: 100vh;
  }

  /* Barra Superior */
  .container-1NXEtd {
    grid-column: 1 / 5;
    grid-row: 1;
    background: var(--background-tertiary) !important;
  }

  /* Lista de Servidores */
  .guilds-2JjMmN {
    grid-column: 1;
    grid-row: 2;
    flex-direction: column !important;
  }

  /* Lista de Canais */
  .sidebar-2K8pFh {
    grid-column: 2;
    grid-row: 2;
    border-right: 1px solid var(--background-modifier-accent);
  }

  /* Área de Chat Principal */
  .chat-3bRxxu {
    grid-column: 3;
    grid-row: 2;
    display: flex !important;
    flex-direction: column;
    max-width: none !important;
  }

  /* Lista de Membros */
  .members-1998pB {
    grid-column: 4;
    grid-row: 2;
    border-left: 1px solid var(--background-modifier-accent);
  }

  /* Melhorias Gerais */
  .channelTextArea-1FufC0 {
    border-radius: 8px !important;
    background: var(--background-secondary) !important;
  }

  .message-2CShn3 {
    padding: 12px !important;
    margin: 8px 0;
    border-radius: 6px;
    background: var(--background-secondary);
  }
`);

/* Sistema de Abas para Canais */
GM_addStyle(`
  .channels-Ie2l6A {
    display: flex !important;
    flex-direction: column;
  }

  .channelTabs-3TQ5vX {
    display: flex;
    gap: 8px;
    padding: 10px;
    border-bottom: 1px solid var(--background-modifier-accent);
  }

  .tabItem-2hXZJ- {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    background: var(--background-secondary);
    transition: 0.2s;
  }

  .tabItem-2hXZJ-:hover {
    background: var(--background-modifier-hover);
  }

  .tabActive-1h_Joa {
    background: var(--brand-experiment) !important;
    color: white !important;
  }
`);

/* Painéis Redimensionáveis */
const resizeHandles = `
  <style>
    .resize-handle {
      position: absolute;
      background: var(--brand-experiment);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .resize-vertical {
      width: 4px;
      cursor: col-resize;
      height: 100%;
    }

    .resize-horizontal {
      height: 4px;
      cursor: row-resize;
      width: 100%;
    }

    .resize-handle:hover {
      opacity: 1;
    }
  </style>
`;

document.head.insertAdjacentHTML('beforeend', resizeHandles);

/* Sistema de Grid Personalizável */
function initLayoutManager() {
  const containers = {
    serverList: document.querySelector('.guilds-2JjMmN'),
    channelList: document.querySelector('.sidebar-2K8pFh'),
    chatArea: document.querySelector('.chat-3bRxxu'),
    memberList: document.querySelector('.members-1998pB')
  };

  // Cria handles de redimensionamento
  function createResizeHandle(container, direction) {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${direction}`;
    container.appendChild(handle);
    
    let isDragging = false;
    handle.addEventListener('mousedown', () => isDragging = true);
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      if (direction === 'vertical') {
        container.style.width = `${e.clientX - container.getBoundingClientRect().left}px`;
      } else {
        container.style.height = `${e.clientY - container.getBoundingClientRect().top}px`;
      }
    });

    document.addEventListener('mouseup', () => isDragging = false);
  }

  // Aplica a todos os containers
  Object.values(containers).forEach(container => {
    if (container) createResizeHandle(container, 'vertical');
  });
}

// Inicialização
setTimeout(() => {
  initLayoutManager();
  
  // Adiciona abas personalizadas
  const channelList = document.querySelector('.channels-Ie2l6A');
  if (channelList) {
    channelList.insertAdjacentHTML('afterbegin', `
      <div class="channelTabs-3TQ5vX">
        <div class="tabItem-2hXZJ- tabActive-1h_Joa">Text Channels</div>
        <div class="tabItem-2hXZJ-">Voice Channels</div>
        <div class="tabItem-2hXZJ-">Categories</div>
      </div>
    `);
  }
}, 3000);