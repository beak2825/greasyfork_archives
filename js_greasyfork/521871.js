// ==UserScript==
// @name         Auto Liker for Tinder (AutoSwipe)
// @name:pt      Auto Liker para Tinder (AutoSwipe)
// @name:pt-BR   Auto Liker para Tinder (AutoSwipe)

// @description  Auto swipe com filtro por palavras-chave, controle de intervalo e painel visual.
// @description:pt Script de auto like e dislike com filtros, sliders e painel de controle.
// @description:pt-BR Script de auto like e dislike no Tinder com filtros, sliders e painel visual.

// @version      1.3.3
// @namespace    https://greasyfork.org/users/1416065
// @author       Nox
// @license      MIT

// @match        https://tinder.com/*
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinder.com
// @downloadURL https://update.greasyfork.org/scripts/521871/Auto%20Liker%20para%20Tinder%20%28AutoSwipe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521871/Auto%20Liker%20para%20Tinder%20%28AutoSwipe%29.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Configurações iniciais
    let interval = 3000; // Intervalo entre ações (ms)
    let profileOpenWait = 3000; // Tempo de espera ao abrir o perfil (ms)
    let forbiddenWords = ['exemplo', 'louca', 'proibido']; // Palavras proibidas padrão
    let likesCount = 0;
    let dislikesCount = 0;
    let isPaused = false;

    // Configurações de altura
    let heightFilterEnabled = false;
    let heightThreshold = 170; // Valor padrão em cm
    let heightCondition = 'greater'; // 'greater' para maior que, 'less' para menor que

    // Carregar valores armazenados no localStorage, se existirem
    interval = parseInt(localStorage.getItem('interval')) || interval;
    profileOpenWait =
        parseInt(localStorage.getItem('profileOpenWait')) || profileOpenWait;

    // Carregar configurações de altura
    heightFilterEnabled = localStorage.getItem('heightFilterEnabled') === 'true' || false;
    heightThreshold = parseInt(localStorage.getItem('heightThreshold')) || heightThreshold;
    heightCondition = localStorage.getItem('heightCondition') || heightCondition;

    // Criação do painel de controle
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    container.style.width = '300px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    container.style.color = 'white';
    container.style.padding = '15px';
    container.style.borderRadius = '10px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '14px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.opacity = '0.2';
    container.style.transition = 'opacity 0.3s';
    document.body.appendChild(container);
    container.addEventListener('mouseenter', () => {
        container.style.opacity = '1';
    });
    container.addEventListener('mouseleave', () => {
        container.style.opacity = '0.2';
    });

    const statsContainer = document.createElement('div');
    statsContainer.style.display = 'flex';
    statsContainer.style.justifyContent = 'space-between';
    statsContainer.style.marginBottom = '10px';

    const likeCounter = document.createElement('div');
    likeCounter.textContent = `Likes: ${likesCount}`;
    statsContainer.appendChild(likeCounter);

    const dislikeCounter = document.createElement('div');
    dislikeCounter.textContent = `Dislikes: ${dislikesCount}`;
    statsContainer.appendChild(dislikeCounter);

    container.appendChild(statsContainer);

    forbiddenWords =
        JSON.parse(localStorage.getItem('forbiddenWords')) || forbiddenWords;

    const forbiddenWordsInput = document.createElement('textarea');
    forbiddenWordsInput.value = forbiddenWords.join(', ');
    forbiddenWordsInput.style.width = '100%';
    forbiddenWordsInput.style.height = '50px';
    forbiddenWordsInput.style.borderRadius = '8px';
    forbiddenWordsInput.style.padding = '5px';
    forbiddenWordsInput.style.marginTop = '5px';

    const forbiddenWordsLabel = document.createElement('label');
    forbiddenWordsLabel.textContent =
        'Palavras proibidas (separadas por vírgula)';
    container.appendChild(forbiddenWordsLabel);
    container.appendChild(forbiddenWordsInput);

    forbiddenWordsInput.addEventListener('input', () => {
        forbiddenWords = forbiddenWordsInput.value
            .split(',')
            .map((word) => word.trim())
            .filter((word) => word.length > 0);
        localStorage.setItem('forbiddenWords', JSON.stringify(forbiddenWords)); // Salvar no localStorage
    });

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pausar';
    pauseButton.style.padding = '10px';
    pauseButton.style.borderRadius = '8px';
    pauseButton.style.cursor = 'pointer';
    container.appendChild(pauseButton);

    const createSlider = (
        labelText,
        min,
        max,
        step,
        initialValue,
        nameInterval,
        onChange
    ) => {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.flexDirection = 'column';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.marginBottom = '5px';
        sliderContainer.appendChild(label);

        const valueDisplay = document.createElement('div');
        valueDisplay.style.textAlign = 'right';
        valueDisplay.textContent = `${(initialValue / 1000).toFixed(1)}s`;
        sliderContainer.appendChild(valueDisplay);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = initialValue;
        slider.style.width = '100%';
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueDisplay.textContent = `${(value / 1000).toFixed(1)}s`;
            onChange(value);
            localStorage.setItem(nameInterval, value);
        });

        sliderContainer.appendChild(slider);
        return sliderContainer;
    };

    const intervalSlider = createSlider(
        'Intervalo entre ações (segundos)',
        100,
        10000,
        100,
        interval,
        'interval',
        (value) => {
            interval = value;
        }
    );
    container.appendChild(intervalSlider);

    const profileWaitSlider = createSlider(
        'Espera ao abrir perfil (segundos)',
        100,
        10000,
        100,
        profileOpenWait,
        'profileOpenWait',
        (value) => {
            profileOpenWait = value;
        }
    );
    container.appendChild(profileWaitSlider);

    // Seção de filtro por altura
    const heightFilterContainer = document.createElement('div');
    heightFilterContainer.style.backgroundColor = '#2a2a2a';
    heightFilterContainer.style.padding = '10px';
    heightFilterContainer.style.borderRadius = '8px';
    heightFilterContainer.style.marginTop = '10px';
    container.appendChild(heightFilterContainer);

    const heightFilterTitle = document.createElement('div');
    heightFilterTitle.textContent = 'Filtro por Altura';
    heightFilterTitle.style.fontWeight = 'bold';
    heightFilterTitle.style.marginBottom = '10px';
    heightFilterTitle.style.color = '#ffcc00';
    heightFilterContainer.appendChild(heightFilterTitle);

    // Checkbox para ativar/desativar filtro
    const enableHeightFilterContainer = document.createElement('div');
    enableHeightFilterContainer.style.display = 'flex';
    enableHeightFilterContainer.style.alignItems = 'center';
    enableHeightFilterContainer.style.marginBottom = '10px';

    const enableHeightFilterCheckbox = document.createElement('input');
    enableHeightFilterCheckbox.type = 'checkbox';
    enableHeightFilterCheckbox.checked = heightFilterEnabled;
    enableHeightFilterCheckbox.style.marginRight = '8px';

    const enableHeightFilterLabel = document.createElement('label');
    enableHeightFilterLabel.textContent = 'Ativar filtro por altura';
    enableHeightFilterLabel.style.cursor = 'pointer';

    enableHeightFilterContainer.appendChild(enableHeightFilterCheckbox);
    enableHeightFilterContainer.appendChild(enableHeightFilterLabel);
    heightFilterContainer.appendChild(enableHeightFilterContainer);

    // Input para valor da altura
    const heightInputContainer = document.createElement('div');
    heightInputContainer.style.display = 'flex';
    heightInputContainer.style.flexDirection = 'column';
    heightInputContainer.style.marginBottom = '10px';

    const heightInputLabel = document.createElement('label');
    heightInputLabel.textContent = 'Altura limite (cm):';
    heightInputLabel.style.marginBottom = '5px';
    heightInputContainer.appendChild(heightInputLabel);

    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.min = '100';
    heightInput.max = '250';
    heightInput.step = '1';
    heightInput.value = heightThreshold;
    heightInput.style.padding = '5px';
    heightInput.style.borderRadius = '5px';
    heightInput.style.width = '100%';
    heightInputContainer.appendChild(heightInput);

    heightFilterContainer.appendChild(heightInputContainer);

    // Dropdown para condição
    const heightConditionContainer = document.createElement('div');
    heightConditionContainer.style.display = 'flex';
    heightConditionContainer.style.flexDirection = 'column';
    heightConditionContainer.style.marginBottom = '10px';

    const heightConditionLabel = document.createElement('label');
    heightConditionLabel.textContent = 'Condição:';
    heightConditionLabel.style.marginBottom = '5px';
    heightConditionContainer.appendChild(heightConditionLabel);

    const heightConditionSelect = document.createElement('select');
    heightConditionSelect.style.padding = '5px';
    heightConditionSelect.style.borderRadius = '5px';
    heightConditionSelect.style.width = '100%';

    const optionGreater = document.createElement('option');
    optionGreater.value = 'greater';
    optionGreater.textContent = 'Maior que';

    const optionLess = document.createElement('option');
    optionLess.value = 'less';
    optionLess.textContent = 'Menor que';

    heightConditionSelect.appendChild(optionGreater);
    heightConditionSelect.appendChild(optionLess);
    heightConditionSelect.value = heightCondition;

    heightConditionContainer.appendChild(heightConditionSelect);
    heightFilterContainer.appendChild(heightConditionContainer);

    // Event listeners para filtro de altura
    enableHeightFilterCheckbox.addEventListener('change', () => {
        heightFilterEnabled = enableHeightFilterCheckbox.checked;
        localStorage.setItem('heightFilterEnabled', heightFilterEnabled);

        // Ativar/desativar inputs
        heightInput.disabled = !heightFilterEnabled;
        heightConditionSelect.disabled = !heightFilterEnabled;
    });

    heightInput.addEventListener('input', () => {
        heightThreshold = parseInt(heightInput.value);
        localStorage.setItem('heightThreshold', heightThreshold);
    });

    heightConditionSelect.addEventListener('change', () => {
        heightCondition = heightConditionSelect.value;
        localStorage.setItem('heightCondition', heightCondition);
    });

    // Inicializar estado dos inputs
    heightInput.disabled = !heightFilterEnabled;
    heightConditionSelect.disabled = !heightFilterEnabled;

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Continuar' : 'Pausar';
    });

    // Criação do contêiner de informações do perfil
    const profileInfoContainer = document.createElement('div');
    profileInfoContainer.style.padding = '10px';
    profileInfoContainer.style.backgroundColor = '#1c1c1c';
    profileInfoContainer.style.borderRadius = '8px';
    profileInfoContainer.style.color = '#ffcc00';
    profileInfoContainer.style.marginTop = '10px';
    profileInfoContainer.style.display = 'flex';
    profileInfoContainer.style.flexDirection = 'column';
    profileInfoContainer.style.gap = '5px';
    container.appendChild(profileInfoContainer);

    // Função para criar cada linha de informação
    function createInfoRow(label, value) {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';

        const labelSpan = document.createElement('span');
        labelSpan.textContent = label + ':';
        labelSpan.style.fontWeight = 'bold';

        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;

        row.appendChild(labelSpan);
        row.appendChild(valueSpan);

        return row;
    }

    // Função de extração das informações
    function extractProfileInfo() {
        const profileContainer = document.querySelector(
            '.Bgc\\(--color--background-sparks-profile\\)'
        );

        if (!profileContainer) {
            console.log('Perfil não encontrado.');
            return null;
        }

        const profileInfo = {};

        // Método 1: Procurar por todos os itens de informação básica
        const infoSection = profileContainer.querySelector('section[aria-labelledby]');
        if (infoSection) {
            const listItems = infoSection.querySelectorAll('li');
            listItems.forEach((item, index) => {
                const svg = item.querySelector('svg');
                const textDiv = item.querySelector('.Typs\\(body-1-regular\\)');

                if (svg && textDiv) {
                    const svgPath = svg.querySelector('path');
                    if (svgPath) {
                        const pathD = svgPath.getAttribute('d') || '';
                        const text = textDiv.textContent.trim();

                        console.log(`Item ${index}: Path = ${pathD.substring(0, 30)}..., Text = "${text}"`);

                        // Identificar pelo caminho do SVG
                        if (pathD.includes('M12.301')) {
                            // Ícone de localização/distância
                            if (text.includes('quilômetros') || text.includes('km')) {
                                profileInfo.distance = text;
                            }
                        } else if (pathD.includes('M16.95')) {
                            // Ícone de altura (o que você mostrou)
                            profileInfo.height = text;
                            console.log(`Altura encontrada via SVG: ${text}`);
                        } else if (pathD.includes('M16.995')) {
                            // Ícone de profissão
                            profileInfo.profession = text;
                        } else if (pathD.includes('M12.225')) {
                            // Ícone de pronomes
                            profileInfo.genderPronoun = text;
                        } else if (pathD.includes('M22.757')) {
                            // Ícone de idiomas
                            profileInfo.languages = text;
                        }
                    }
                }
            });
        }

        // Método 2: Procurar texto "cm" em qualquer lugar
        if (!profileInfo.height) {
            const allElements = profileContainer.querySelectorAll('*');
            for (const element of allElements) {
                const text = element.textContent.trim();
                if (text && text.includes('cm') && text.match(/\d+\s*cm/)) {
                    // Encontrar o padrão "158 cm"
                    const heightMatch = text.match(/(\d+)\s*cm/);
                    if (heightMatch) {
                        profileInfo.height = heightMatch[0]; // "158 cm"
                        console.log(`Altura encontrada via texto "cm": ${profileInfo.height}`);
                        break;
                    }
                }
            }
        }

        // Método 3: Procurar por divs específicas que contêm altura
        if (!profileInfo.height) {
            const allDivs = profileContainer.querySelectorAll('div');
            for (const div of allDivs) {
                const text = div.textContent.trim();
                // Procurar por padrões de altura
                if (text.match(/^\d+\s*cm$/)) {
                    profileInfo.height = text;
                    console.log(`Altura encontrada em div: ${profileInfo.height}`);
                    break;
                }
            }
        }

        // Método 4: Procurar por todas as informações básicas em linhas
        const allSpans = profileContainer.querySelectorAll('span');
        for (const span of allSpans) {
            const parentText = span.parentElement?.textContent || '';
            if (parentText.includes('Altura') || parentText.includes('altura')) {
                const heightMatch = parentText.match(/(\d+)\s*cm/);
                if (heightMatch) {
                    profileInfo.height = heightMatch[0];
                    console.log(`Altura encontrada via texto "Altura": ${profileInfo.height}`);
                    break;
                }
            }
        }

        // Extrair outras informações se necessário
        if (!profileInfo.distance) {
            const distanceElements = profileContainer.querySelectorAll('*');
            for (const element of distanceElements) {
                const text = element.textContent.trim();
                if (text.includes('quilômetros') || text.includes('km')) {
                    profileInfo.distance = text;
                    break;
                }
            }
        }

        // Extrair profissão se disponível
        if (!profileInfo.profession) {
            const professionElements = profileContainer.querySelectorAll('*');
            for (const element of professionElements) {
                const text = element.textContent.trim();
                if (text.toLowerCase().includes('profiss') && text.length < 100) {
                    profileInfo.profession = text;
                    break;
                }
            }
        }

        console.log('Informações extraídas do perfil:', profileInfo);
        return profileInfo;
    }

    // Função para converter altura para cm (aceita "1,70 m" e "188 cm")
    function convertHeightToCm(heightString) {
        if (!heightString || heightString === 'Não informado') {
            return null;
        }

        console.log('Convertendo altura:', heightString);

        try {
            // Limpar espaços extras e converter para minúsculas
            const cleaned = heightString.trim().toLowerCase();

            // Se já estiver em cm (ex: "188 cm")
            if (cleaned.includes('cm')) {
                const cmMatch = cleaned.match(/(\d+)\s*cm/);
                if (cmMatch && cmMatch[1]) {
                    const result = parseInt(cmMatch[1]);
                    console.log('Convertido para cm (já em cm):', result);
                    return result;
                }
            }

            // Se estiver em metros (ex: "1,70 m" ou "1.70 m")
            if (cleaned.includes('m') && (cleaned.includes(',') || cleaned.includes('.'))) {
                // Remover "m" e substituir vírgula por ponto
                const metersStr = cleaned.replace('m', '').replace(',', '.').trim();
                const meters = parseFloat(metersStr);

                if (!isNaN(meters)) {
                    // Converter para cm
                    const result = Math.round(meters * 100);
                    console.log('Convertido para cm (de metros):', result);
                    return result;
                }
            }

            // Se tiver apenas número
            const numberMatch = cleaned.match(/(\d+)/);
            if (numberMatch && numberMatch[1]) {
                const num = parseInt(numberMatch[1]);
                // Se o número for maior que 100, provavelmente já está em cm
                // Se for menor que 3, provavelmente está em metros
                if (num > 100) {
                    console.log('Convertido para cm (número > 100):', num);
                    return num; // Já está em cm
                } else if (num < 3) {
                    const result = Math.round(num * 100);
                    console.log('Convertido para cm (número < 3):', result);
                    return result; // Converte metros para cm
                }
            }

            console.log('Não foi possível converter altura:', heightString);
            return null;
        } catch (error) {
            console.error('Erro ao converter altura:', error, heightString);
            return null;
        }
    }

    // Função para verificar filtro de altura
    function checkHeightFilter(profileHeight) {
        console.log('=== VERIFICANDO FILTRO DE ALTURA ===');
        console.log('Configurações:', {
            enabled: heightFilterEnabled,
            threshold: heightThreshold,
            condition: heightCondition,
            profileHeight: profileHeight
        });

        if (!heightFilterEnabled || !profileHeight) {
            console.log('Filtro desativado ou altura não informada');
            return { shouldDislike: false, reason: null };
        }

        const heightInCm = convertHeightToCm(profileHeight);
        console.log('Altura convertida para cm:', heightInCm);

        if (heightInCm === null) {
            console.log('Não foi possível converter altura');
            return { shouldDislike: false, reason: null };
        }

        let shouldDislike = false;
        let reason = '';

        if (heightCondition === 'greater') {
            if (heightInCm > heightThreshold) {
                shouldDislike = true;
                reason = `Altura maior que ${heightThreshold}cm (${profileHeight})`;
            }
        } else if (heightCondition === 'less') {
            if (heightInCm < heightThreshold) {
                shouldDislike = true;
                reason = `Altura menor que ${heightThreshold}cm (${profileHeight})`;
            }
        }

        console.log('Resultado do filtro:', { shouldDislike, reason });
        console.log('=============================');
        return { shouldDislike, reason };
    }

    const profileInfo = document.createElement('div');
    profileInfo.style.padding = '10px';
    profileInfo.style.backgroundColor = '#1c1c1c';
    profileInfo.style.borderRadius = '8px';
    profileInfo.style.color = '#ffcc00';
    profileInfo.textContent = 'Sobre mim: Não disponível';
    container.appendChild(profileInfo);

    const forbiddenWordReason = document.createElement('div');
    forbiddenWordReason.style.padding = '10px';
    forbiddenWordReason.style.backgroundColor = '#8b0000';
    forbiddenWordReason.style.color = 'white';
    forbiddenWordReason.style.borderRadius = '8px';
    forbiddenWordReason.style.display = 'none';
    forbiddenWordReason.textContent = 'Motivo do deslike: Nenhum';
    container.appendChild(forbiddenWordReason);

    function updateLikeCounter() {
        likeCounter.textContent = `Likes: ${likesCount}`;
    }

    function updateDislikeCounter() {
        dislikeCounter.textContent = `Dislikes: ${dislikesCount}`;
    }

    function updateProfileInfo(text) {
        const extractedInfo = extractProfileInfo();

        if (!extractedInfo) {
            console.log('Não foi possível extrair as informações do perfil.');
            return;
        }

        // Limpa o contêiner antes de atualizar
        profileInfoContainer.innerHTML = '';

        // Adiciona as informações capturadas
        let hasInfo = false;

        if (extractedInfo.distance) {
            profileInfoContainer.appendChild(createInfoRow('Distância', extractedInfo.distance));
            hasInfo = true;
        }
        if (extractedInfo.height) {
            profileInfoContainer.appendChild(createInfoRow('Altura', extractedInfo.height));
            hasInfo = true;
        }
        if (extractedInfo.profession) {
            profileInfoContainer.appendChild(createInfoRow('Profissão', extractedInfo.profession));
            hasInfo = true;
        }
        if (extractedInfo.genderPronoun) {
            profileInfoContainer.appendChild(createInfoRow('Pronomes', extractedInfo.genderPronoun));
            hasInfo = true;
        }
        if (extractedInfo.languages) {
            profileInfoContainer.appendChild(createInfoRow('Idiomas', extractedInfo.languages));
            hasInfo = true;
        }

        // Se nenhuma informação foi encontrada, mostrar mensagem
        if (!hasInfo) {
            const noInfo = document.createElement('div');
            noInfo.textContent = 'Nenhuma informação extraída';
            noInfo.style.color = '#ff6b6b';
            profileInfoContainer.appendChild(noInfo);
        }

        // Atualiza a seção "Sobre mim"
        const aboutMeText = text || 'Não disponível';
        profileInfo.textContent = `Sobre mim: ${aboutMeText}`;

        // Destacar se é muito curto
        if (aboutMeText.length < 10 && aboutMeText !== 'Não disponível') {
            profileInfo.style.color = '#ff6b6b';
        } else {
            profileInfo.style.color = '#ffcc00';
        }
    }

    function showForbiddenWordReason(reason) {
        forbiddenWordReason.textContent = `Motivo do deslike: ${reason}`;
        forbiddenWordReason.style.display = 'block';

        // Esconder após 5 segundos
        setTimeout(() => {
            forbiddenWordReason.style.display = 'none';
        }, 5000);
    }

    function findLikeButton() {
        return document.querySelector(
            '.gamepad-button-wrapper .button.Bgc\\(\\$c-ds-background-gamepad-sparks-like-default\\)'
        );
    }

    function findDislikeButton() {
        return document.querySelector(
            '.gamepad-button-wrapper .button.Bgc\\(\\$c-ds-background-gamepad-sparks-nope-default\\)'
        );
    }

    function findProfileButton() {
        // Tentar múltiplos seletores para encontrar o botão de abrir perfil
        const selectors = [
            'div.P\\(0\\).Trsdu\\(\\$normal\\).Sq\\(28px\\)',
            'div[class*="Sq(28px)"]',
            'div[class*="P(0)"]',
            'div[class*="Trsdu($normal)"]',
            'div.Sq\\(28px\\)'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Perfil encontrado com seletor:', selector);
                return element;
            }
        }

        // Tentar encontrar pelo texto "Abrir perfil" no span
        const spans = Array.from(document.querySelectorAll('span'));
        const profileSpan = spans.find(span => span.textContent.includes('Abrir perfil'));

        if (profileSpan) {
            console.log('Perfil encontrado pelo texto do span');
            // Subir até o elemento pai que é o div clicável
            let parent = profileSpan.parentElement;
            while (parent && !parent.classList.contains('Sq(28px)')) {
                parent = parent.parentElement;
            }
            return parent;
        }

        console.log('Botão de abrir perfil não encontrado');
        return null;
    }

    function findProfileInfo() {
        // Método 1: Buscar pelo título "Sobre mim" em h2
        const headers = Array.from(document.querySelectorAll('h2'));
        for (const header of headers) {
            if (header.textContent.includes('Sobre mim')) {
                // Encontrar o conteúdo após o h2
                let currentElement = header.parentElement;
                while (currentElement && !currentElement.querySelector('.Typs\\(body-1-regular\\)')) {
                    currentElement = currentElement.nextElementSibling || currentElement.parentElement.nextElementSibling;
                }

                if (currentElement) {
                    const contentDiv = currentElement.querySelector('.Typs\\(body-1-regular\\)');
                    if (contentDiv) {
                        return contentDiv.textContent.trim();
                    }
                }
            }
        }

        // Método 2: Buscar por qualquer div com classe Typs(body-1-regular) que esteja perto de um h2 "Sobre mim"
        const allContentDivs = document.querySelectorAll('.Typs\\(body-1-regular\\)');
        for (const contentDiv of allContentDivs) {
            // Verificar se há um h2 "Sobre mim" próximo
            let parent = contentDiv.parentElement;
            while (parent) {
                const h2 = parent.querySelector('h2');
                if (h2 && h2.textContent.includes('Sobre mim')) {
                    return contentDiv.textContent.trim();
                }
                parent = parent.parentElement;
            }
        }

        console.log('Texto "Sobre mim" não encontrado');
        return 'Não disponível';
    }

    async function autoAction() {
        if (isPaused) return;

        console.log('=== INICIANDO AÇÃO ===');

        const profileButton = findProfileButton();

        if (profileButton) {
            try {
                // 1. Clicar para abrir o perfil
                profileButton.click();
                console.log('Botão de abrir perfil clicado.');

                // 2. Esperar o perfil carregar
                await new Promise((resolve) => setTimeout(resolve, profileOpenWait));
                if (isPaused) return;

                // 3. Extrair informações do perfil
                const aboutText = findProfileInfo();
                console.log(`Sobre mim encontrado: ${aboutText}`);

                // 4. Atualizar informações no painel
                updateProfileInfo(aboutText);

                // 5. Extrair todas as informações do perfil para filtros
                const profileContainer = document.querySelector(
                    '.Bgc\\(--color--background-sparks-profile\\)'
                );

                let profileText = '';
                if (profileContainer) {
                    profileText = Array.from(profileContainer.querySelectorAll('*'))
                        .map((element) => element.textContent.trim())
                        .filter((text) => text.length > 0)
                        .join('\n');
                    console.log('Texto do perfil extraído (primeiros 500 chars):', profileText.substring(0, 500));
                }

                const profileInfo = extractProfileInfo();
                console.log('Informações detalhadas do perfil:', profileInfo);

                // 6. VERIFICAR PALAVRAS PROIBIDAS
                console.log('Verificando palavras proibidas...');
                console.log('Palavras proibidas atuais:', forbiddenWords);
                console.log('Texto do perfil contém palavras proibidas?');

                let forbiddenWordFound = false;
                for (const word of forbiddenWords) {
                    if (profileText.toLowerCase().includes(word.toLowerCase())) {
                        console.log(`PALAVRA PROIBIDA ENCONTRADA: "${word}"`);
                        forbiddenWordFound = true;
                        const dislikeButton = findDislikeButton();
                        if (dislikeButton) {
                            console.log('Dando dislike por palavra proibida...');
                            dislikeButton.click();
                            dislikesCount++;
                            updateDislikeCounter();
                            showForbiddenWordReason(`Palavra proibida: "${word}"`);
                            console.log(`Deslike dado! Motivo: ${word}`);
                            // Esperar antes de continuar
                            await new Promise((resolve) => setTimeout(resolve, interval));
                            if (isPaused) return;
                            return;
                        }
                    }
                }

                if (!forbiddenWordFound) {
                    console.log('Nenhuma palavra proibida encontrada');
                }

                // 7. VERIFICAR FILTRO DE ALTURA
                if (profileInfo && profileInfo.height) {
                    console.log(`=== VERIFICANDO FILTRO DE ALTURA ===`);
                    console.log(`Altura encontrada: "${profileInfo.height}"`);
                    console.log(`Filtro ativado: ${heightFilterEnabled}`);
                    console.log(`Condição: ${heightCondition === 'greater' ? 'Maior que' : 'Menor que'} ${heightThreshold}cm`);

                    const heightCheck = checkHeightFilter(profileInfo.height);

                    if (heightCheck.shouldDislike) {
                        console.log(`❌ ALTURA FILTRADA! Motivo: ${heightCheck.reason}`);
                        console.log(`=== FIM VERIFICAÇÃO ALTURA ===`);

                        const dislikeButton = findDislikeButton();
                        if (dislikeButton) {
                            dislikeButton.click();
                            dislikesCount++;
                            updateDislikeCounter();
                            showForbiddenWordReason(heightCheck.reason);
                            console.log(`Deslike dado! Motivo: ${heightCheck.reason}`);
                            const delay = interval;
                            await new Promise((resolve) => setTimeout(resolve, delay));
                            if (isPaused) return;
                            return;
                        }
                    } else {
                        console.log(`✅ Altura não filtrada: ${profileInfo.height}`);
                        console.log(`=== FIM VERIFICAÇÃO ALTURA ===`);
                    }
                } else {
                    console.log(`⚠️ Altura não encontrada no perfil`);
                }

                // 8. SE NÃO HOUVE FILTROS, DAR LIKE
                console.log('Nenhum filtro aplicado, dando like...');
                const likeButton = findLikeButton();
                if (likeButton) {
                    likeButton.click();
                    likesCount++;
                    updateLikeCounter();
                    console.log(`Like dado! Total: ${likesCount}`);
                }

                // 9. Esperar o intervalo antes de próxima ação
                await new Promise((resolve) => setTimeout(resolve, interval));

            } catch (error) {
                console.error('Erro ao processar perfil:', error);
            }
        } else {
            console.log('Botão de perfil não encontrado, pulando...');
            // Tentar like mesmo sem abrir perfil (se configurado)
            const likeButton = findLikeButton();
            if (likeButton) {
                likeButton.click();
                likesCount++;
                updateLikeCounter();
                console.log(`Like dado sem abrir perfil! Total: ${likesCount}`);
            }
            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        console.log('=== AÇÃO FINALIZADA ===\n');
    }

    async function main() {
        console.log('Script Auto Liker iniciado!');
        console.log('Configurações:', {
            interval: interval,
            profileOpenWait: profileOpenWait,
            forbiddenWords: forbiddenWords,
            heightFilterEnabled: heightFilterEnabled,
            heightThreshold: heightThreshold,
            heightCondition: heightCondition
        });

        while (true) {
            if (!isPaused) {
                await autoAction();
            } else {
                await new Promise((resolve) => setTimeout(resolve, 100)); // Aguardar brevemente enquanto pausado
            }
        }
    }

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    container.addEventListener('mousedown', function(e) {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'move';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
        container.style.right = 'auto';
        container.style.position = 'fixed';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        container.style.cursor = 'default';
    });

    main();
})();