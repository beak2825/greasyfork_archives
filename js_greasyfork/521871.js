// ==UserScript==
// @name         AutoSwipe for Tinder
// @name:pt      AutoSwipe para Tinder
// @name:pt-BR   AutoSwipe para Tinder
// @version      1.2
// @description  Script para auto like/deslike no Tinder com base em palavras proibidas, sliders e melhorias visuais no painel.
// @description:pt Script para auto like/deslike no Tinder com base em palavras proibidas, sliders e melhorias visuais no painel.
// @description:pt-BR Script para auto like/deslike no Tinder com palavras proibidas, sliders e melhorias visuais no painel.
// @compatible chrome
// @compatible firefox
// @author       Nox
// @match        https://tinder.com/app/recs
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinder.com
// @license      MIT
// @namespace https://greasyfork.org/users/1416065
// @downloadURL https://update.greasyfork.org/scripts/521871/AutoSwipe%20for%20Tinder.user.js
// @updateURL https://update.greasyfork.org/scripts/521871/AutoSwipe%20for%20Tinder.meta.js
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

    // Carregar valores armazenados no localStorage, se existirem
    interval = parseInt(localStorage.getItem('interval')) || interval;
    profileOpenWait =
        parseInt(localStorage.getItem('profileOpenWait')) || profileOpenWait;

    // Criação do painel de controle
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    container.style.width = '250px';
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

        const sections = profileContainer.querySelectorAll('.D\\(f\\).Ai\\(c\\)');
        const profileInfo = {};

        sections.forEach((section) => {
            const svg = section.querySelector('svg path');
            const textElement = section.querySelector(
                '.Typs\\(body-1-regular\\), .Typs\\(body-1-strong\\)'
            );

            if (!svg || !textElement) return;

            const svgPath = svg.getAttribute('d').trim();
            const textContent = textElement.textContent.trim();

            if (svgPath.includes('M12.301')) {
                profileInfo.distance = textContent;
            } else if (svgPath.includes('M16.95')) {
                profileInfo.height = textContent;
            } else if (svgPath.includes('M16.995')) {
                profileInfo.profession = textContent;
            } else if (svgPath.includes('M11.171')) {
                profileInfo.university = textContent;
            } else if (svgPath.includes('M2.25')) {
                profileInfo.location = textContent;
            } else if (svgPath.includes('M12.225')) {
                profileInfo.genderPronoun = textContent;
            } else if (svgPath.includes('M12 21.994')) {
                profileInfo.genderIdentity = textContent;
            } else if (svgPath.includes('M22.757')) {
                profileInfo.languages = textContent;
            } else {
                profileInfo.other = textContent; // Caso algum ícone não mapeado apareça
            }
        });

        return profileInfo;
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
        const profileInfo = extractProfileInfo();

        if (!profileInfo) {
            console.log('Não foi possível extrair as informações do perfil.');
            return;
        }

        const {
            distance = 'Não informado',
            height = 'Não informado',
            profession = 'Não informado',
            university = 'Não informado',
            location = 'Não informado',
            genderPronoun = 'Não informado',
            genderIdentity = 'Não informado',
            languages = 'Não informado',
        } = profileInfo;

        console.log('Informações extraídas:', profileInfo);

        // Limpa o contêiner antes de atualizar
        profileInfoContainer.innerHTML = '';

        // Adiciona as informações capturadas
        profileInfoContainer.appendChild(createInfoRow('Distância', distance));
        profileInfoContainer.appendChild(createInfoRow('Altura', height));
        profileInfoContainer.appendChild(createInfoRow('Profissão', profession));
        profileInfoContainer.appendChild(createInfoRow('Universidade', university));
        profileInfoContainer.appendChild(createInfoRow('Localização', location));
        profileInfoContainer.appendChild(createInfoRow('Pronomes', genderPronoun));
        profileInfoContainer.appendChild(
            createInfoRow('Identidade de Gênero', genderIdentity)
        );
        profileInfoContainer.appendChild(createInfoRow('Idiomas', languages));

        // Atualiza a seção "Sobre mim"
        profileInfo.textContent = `Sobre mim: ${text}`;
    }

    function showForbiddenWordReason(reason) {
        forbiddenWordReason.textContent = `Motivo do deslike: ${reason}`;
        forbiddenWordReason.style.display = 'block';
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
        return document.querySelector(
            'button.P\\(0\\).Trsdu\\(\\$normal\\).Sq\\(28px\\)'
        );
    }

    function findProfileInfo() {
        const aboutHeader = Array.from(document.querySelectorAll('div')).find(
            (div) => div.textContent.includes('Sobre mim')
        );

        if (aboutHeader) {
            const content = aboutHeader.parentElement.querySelector(
                '.Typs\\(body-1-regular\\)'
            );

            console.log(content);

            if (content) return content;
        }

        return 'Não disponível';
    }

    async function autoAction() {
        if (isPaused) return;

        const profileButton = findProfileButton();
        if (profileButton) {
            profileButton.click();
            console.log('Botão de abrir perfil clicado.');

            await new Promise((resolve) => setTimeout(resolve, profileOpenWait)); // Esperar o perfil carregar
            if (isPaused) return;

            const aboutText = findProfileInfo();
            updateProfileInfo(aboutText);
            console.log(`Sobre mim: ${aboutText}`);

            await new Promise((resolve) =>
                              setTimeout(resolve, profileOpenWait + interval)
                             );
            if (isPaused) return;
        }

        const profileContainer = document.querySelector(
            '.Bgc\\(--color--background-sparks-profile\\)'
        );

        const profileText = profileContainer
        ? Array.from(profileContainer.querySelectorAll('*'))
        .map((element) => element.textContent.trim())
        .filter((text) => text.length > 0)
        .join('\n')
        : '';

        console.log(`InfoProfile:\n${profileText}`);

        const profileInfo = extractProfileInfo();
        console.log('Informações detalhadas do perfil:', profileInfo);

        // Verifica palavras proibidas
        for (const word of forbiddenWords) {
            if (profileText.toLowerCase().includes(word.toLowerCase())) {
                const dislikeButton = findDislikeButton();
                if (dislikeButton) {
                    dislikeButton.click();
                    dislikesCount++;
                    updateDislikeCounter();
                    showForbiddenWordReason(word);
                    console.log(`Deslike dado! Motivo: ${word}`);
                    const delay = interval;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    if (isPaused) return;
                    return;
                }
            }
        }

        // Ação de like se não houver palavras proibidas
        const likeButton = findLikeButton();
        if (likeButton) {
            likeButton.click();
            likesCount++;
            updateLikeCounter();
            console.log(`Like dado!`);
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
        if (isPaused) return;
    }

    async function main() {
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
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
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
