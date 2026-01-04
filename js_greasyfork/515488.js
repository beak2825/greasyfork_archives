// ==UserScript==
// @name        Auto Skip Streaming Services
// @namespace   Violentmonkey Scripts
// @match       https://www.disneyplus.com/*
// @match       https://www.starplus.com/*
// @match       https://www.max.com/*
// @match       https://www.netflix.com/*
// @grant       none
// @version     5.1
// @author      RedBlack
// @description 28/04/2024, 23:42:18 Clicar Automaticamente em "Pular Abertura" e em "Próximo Episódio" em diversas plataformas de streaming
// @license     0BSD
// @downloadURL https://update.greasyfork.org/scripts/515488/Auto%20Skip%20Streaming%20Services.user.js
// @updateURL https://update.greasyfork.org/scripts/515488/Auto%20Skip%20Streaming%20Services.meta.js
// ==/UserScript==

// Configuração inicial dos seletores de botões para cada plataforma
let config = {
  'DisneyPlus': {
    skipButton: ['button.skip__button.body-copy', 'class'],
    nextButton: ['button._5gjogg1', 'class']
  },
  'StarPlus': {
    skipButton: ['button.skip__button.body-copy', 'class'],
    nextButton: ['button._5gjogg1', 'class']
  },
  'Max': {
    skipButton: ['.skip-btn', 'class'],
    nextButton: ['.next-episode-btn', 'class']
  },
  'Netflix': {
    skipButton: ['.ltr-bf8b0m', 'class'],
    nextButton: ['button[data-uia="next-episode-seamless-button"]', 'attribute']
  }
};

// Velocidade de busca padrão
let searchInterval = 1000;

// Função para salvar as configurações no localStorage
function saveConfig() {
  localStorage.setItem('autoSkipConfig', JSON.stringify({
    config,
    searchInterval
  }));
}

// Carrega a configuração salva do localStorage
function loadConfig() {
  const config = localStorage.getItem('buttonConfig');
  if (config) {
    buttonConfig = JSON.parse(config);
  }
  else {
    buttonConfig = {}; // Certifique-se de que seja um objeto vazio
  }

  // Se não houver botões configurados, inicialize o objeto como um vazio
  if (!Object.keys(buttonConfig).length) {
    buttonConfig = {};
  }
}

// Função para verificar se o botão está visível na janela
function isButtonVisible(buttonSelector) {
  const button = document.querySelector(buttonSelector[0]);
  return button && button.offsetParent !== null;
}

// Função para clicar no botão quando estiver visível
function clickButton(buttonSelector) {
  const button = document.querySelector(buttonSelector[0]);
  if (button) {
    const buttonText = button.textContent || button.innerText; // Captura o texto do botão
    button.click(); // Clica no botão
    showNotification(`Botão clicado: ${buttonText}`); // Exibe notificação com o texto do botão
  }
}

// Função para mostrar uma notificação na tela
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '12px 20px';
  notification.style.backgroundColor = '#323232';
  notification.style.color = '#FFFFFF';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
  notification.style.fontSize = '14px';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.zIndex = '9999';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(notification);

  // Faz a notificação aparecer gradualmente
  setTimeout(() => (notification.style.opacity = '1'), 100);
  // Faz a notificação desaparecer após 2 segundos
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Função para verificar e clicar nos botões configurados
function checkAndClickButtons() {
  const platform = detectPlatform();
  if (platform) {
    const {
      skipButton,
      nextButton
    } = config[platform];
    if (isButtonVisible(skipButton)) clickButton(skipButton);
    if (isButtonVisible(nextButton)) clickButton(nextButton);
  }
}

// Função para detectar a plataforma atual com base no URL
function detectPlatform() {
  const url = window.location.href;
  if (url.includes('disneyplus.com')) return 'DisneyPlus';
  if (url.includes('starplus.com')) return 'StarPlus';
  if (url.includes('max.com')) return 'Max';
  if (url.includes('netflix.com')) return 'Netflix';
  return null;
}

// Cria uma interface para configuração dos seletores
function createConfigInterface() {
  const configContainer = document.createElement('div');
  configContainer.style.position = 'fixed';
  configContainer.style.top = '50px';
  configContainer.style.right = '20px';
  configContainer.style.width = '300px';
  configContainer.style.maxHeight = '400px'; // Altura máxima para o contêiner
  configContainer.style.overflowY = 'auto'; // Habilita rolagem vertical
  configContainer.style.padding = '15px';
  configContainer.style.backgroundColor = '#1e1e1e'; // Cor de fundo escura
  configContainer.style.borderRadius = '8px';
  configContainer.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.3)';
  configContainer.style.zIndex = '10000';
  configContainer.style.display = 'none';
  configContainer.style.fontFamily = 'Arial, sans-serif';
  configContainer.style.color = '#FFFFFF'; // Cor do texto

  // Cabeçalho do painel de configuração
  const header = document.createElement('h3');
  header.textContent = 'Configurações de Seletores';
  header.style.marginBottom = '10px';
  header.style.color = '#FFFFFF'; // Cor do cabeçalho
  configContainer.appendChild(header);

  // Cria entradas para cada plataforma
  for (const [platform, selectors] of Object.entries(config)) {
    const platformLabel = document.createElement('h4');
    platformLabel.textContent = platform;
    platformLabel.style.color = '#FFDD57'; // Cor para o nome da plataforma
    configContainer.appendChild(platformLabel);

    Object.keys(selectors).forEach((buttonType) => {
      const label = document.createElement('label');
      label.textContent = `${buttonType}: `;
      label.style.display = 'block';
      label.style.margin = '5px 0';
      label.style.color = '#FFFFFF'; // Cor do texto do label

      // Campo de entrada para o seletor
      const input = document.createElement('input');
      input.type = 'text';
      input.value = selectors[buttonType][0];
      input.style.width = '60%';
      input.style.padding = '6px';
      input.style.marginBottom = '10px';
      input.style.border = 'none';
      input.style.borderRadius = '4px';
      input.style.backgroundColor = '#2e2e2e'; // Cor de fundo do input
      input.style.color = '#FFFFFF'; // Cor do texto do input
      input.onchange = () => {
        selectors[buttonType][0] = input.value;
        saveConfig();
      };

      // Select para tipo de seletor (class, id, attribute)
      const select = document.createElement('select');
      select.style.marginLeft = '5px';
      select.style.padding = '6px';
      select.style.borderRadius = '4px';
      select.style.backgroundColor = '#2e2e2e'; // Cor de fundo do select
      select.style.color = '#FFFFFF'; // Cor do texto do select
      const optionClass = new Option('Class', 'class', false, selectors[buttonType][1] === 'class');
      const optionId = new Option('ID', 'id', false, selectors[buttonType][1] === 'id');
      const optionAttribute = new Option('Attribute', 'attribute', false, selectors[buttonType][1] === 'attribute');
      select.add(optionClass);
      select.add(optionId);
      select.add(optionAttribute);
      select.onchange = () => {
        selectors[buttonType][1] = select.value;
        saveConfig();
      };

      // Botão de excluir seletor
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.style.padding = '6px 10px';
      deleteButton.style.backgroundColor = '#FF5722'; // Cor de fundo do botão de excluir
      deleteButton.style.color = '#FFF';
      deleteButton.style.border = 'none';
      deleteButton.style.borderRadius = '4px';
      deleteButton.style.cursor = 'pointer';
      deleteButton.style.marginLeft = '10px';
      deleteButton.onclick = () => {
        delete selectors[buttonType]; // Remove o seletor
        saveConfig();
        window.location.reload(); // Recarrega a página para aplicar mudanças
      };

      label.appendChild(input);
      label.appendChild(select);
      label.appendChild(deleteButton);
      configContainer.appendChild(label);
    });
  }

  // Cria campo de entrada para a velocidade de busca
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Velocidade de busca (ms): ';
  speedLabel.style.display = 'block';
  speedLabel.style.marginTop = '10px';
  speedLabel.style.color = '#FFFFFF'; // Cor do texto do label

  const speedInput = document.createElement('input');
  speedInput.type = 'number';
  speedInput.value = searchInterval;
  speedInput.style.width = '60%';
  speedInput.style.padding = '6px';
  speedInput.style.marginBottom = '10px';
  speedInput.style.border = 'none';
  speedInput.style.borderRadius = '4px';
  speedInput.style.backgroundColor = '#2e2e2e'; // Cor de fundo do input
  speedInput.style.color = '#FFFFFF'; // Cor do texto do input
  speedInput.onchange = () => {
    searchInterval = parseInt(speedInput.value, 10);
    saveConfig();
  };

  configContainer.appendChild(speedLabel);
  configContainer.appendChild(speedInput);

  // Botão para abrir/fechar o painel de configuração
  const toggleConfigButton = document.createElement('button');
  toggleConfigButton.textContent = 'Configurações';
  toggleConfigButton.style.position = 'absolute';
  toggleConfigButton.style.top = '10px';
  toggleConfigButton.style.right = '20px';
  toggleConfigButton.style.padding = '10px';
  toggleConfigButton.style.backgroundColor = '#007BFF';
  toggleConfigButton.style.color = '#FFF';
  toggleConfigButton.style.border = 'none';
  toggleConfigButton.style.borderRadius = '4px';
  toggleConfigButton.style.cursor = 'pointer';
  toggleConfigButton.onclick = () => {
    configContainer.style.display = configContainer.style.display === 'none' ? 'block' : 'none';
  };

  document.body.appendChild(toggleConfigButton);
  document.body.appendChild(configContainer);
}

// Carrega a configuração ao iniciar
loadConfig();
createConfigInterface();

// Inicia a verificação dos botões a cada intervalo de busca
setInterval(checkAndClickButtons, searchInterval);
