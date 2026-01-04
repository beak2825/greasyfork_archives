// ==UserScript==
// @name        Change background color on ChatGPT
// @name:es     Cambiar color de fondo en ChatGPT
// @name:en-US  Change background color on ChatGPT
// @name:ja     ChatGPTの背景色を変更
// @name:ru     Изменить цвет фона в ChatGPT
// @name:ko     ChatGPT 배경색 변경
// @name:it  Cambia colore di sfondo su ChatGPT
// @name:de     Hintergrundfarbe in ChatGPT ändern
// @name:fr     Changer la couleur de fond sur ChatGPT
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description With this script you can change ChatGPT background color and even use a custom image!
// @description:es     Con este script puedes cambiar el color de fondo de ChatGPT e incluso usar una imagen personalizada.
// @description:en-US  With this script you can change ChatGPT background color and even use a custom image!
// @description:ja     このスクリプトを使用すると、ChatGPTの背景色を変更したり、カスタム画像を使用したりできます。
// @description:ru     С помощью этого скрипта вы можете изменить цвет фона ChatGPT и даже использовать собственное изображение!
// @description:ko     이 스크립트를 사용하면 ChatGPT 배경색을 변경하고 사용자 지정 이미지를 사용할 수도 있습니다!
// @description:it  Con questo script puoi cambiare il colore di sfondo di ChatGPT e persino usare un'immagine personalizzata!
// @description:de     Mit diesem Skript können Sie die Hintergrundfarbe von ChatGPT ändern und sogar ein benutzerdefiniertes Bild verwenden!
// @description:fr     Avec ce script, vous pouvez changer la couleur de fond de ChatGPT et même utiliser une image personnalisée !
// @author      Mr-Zanzibar
// @match       *://chatgpt.com/*
// @license MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/496823/Change%20background%20color%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/496823/Change%20background%20color%20on%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    // Constants & Storage
    const STORAGE_KEY_BACKGROUND = 'chatgptBackground';
    let isDragging = false;
    let offsetX, offsetY;

    // Translations
    const translations = {
        en: {
            backgroundColorLabel: 'Background Color:',
            resetButton: 'Reset',
            imagePrompt: 'Set this image as background?',
            invalidImage: 'Please select a valid image file.',
            disclaimer: 'ChatGPT can make errors. Script by <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        es: {
            backgroundColorLabel: 'Color de fondo:',
            resetButton: 'Restablecer',
            imagePrompt: '¿Establecer esta imagen como fondo?',
            invalidImage: 'Por favor, seleccione un archivo de imagen válido.',
            disclaimer: 'ChatGPT puede cometer errores. Script por <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        ja: {
            backgroundColorLabel: '背景色:',
            resetButton: 'リセット',
            imagePrompt: 'この画像を背景に設定しますか？',
            invalidImage: '有効な画像ファイルを選択してください。',
            disclaimer: 'ChatGPTはエラーを起こす可能性があります。スクリプトは<a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>によるものです。'
        },
        ru: {
            backgroundColorLabel: 'Цвет фона:',
            resetButton: 'Сбросить',
            imagePrompt: 'Установить это изображение в качестве фона?',
            invalidImage: 'Пожалуйста, выберите действительный файл изображения.',
            disclaimer: 'ChatGPT может допускать ошибки. Скрипт от <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        ko: {
            backgroundColorLabel: '배경색:',
            resetButton: '초기화',
            imagePrompt: '이 이미지를 배경으로 설정하시겠습니까?',
            invalidImage: '올바른 이미지 파일을 선택하십시오.',
            disclaimer: 'ChatGPT는 오류를 일으킬 수 있습니다. 스크립트 작성자: <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        it: {
            backgroundColorLabel: 'Colore di sfondo:',
            resetButton: 'Ripristina',
            imagePrompt: 'Impostare questa immagine come sfondo?',
            invalidImage: 'Seleziona un file immagine valido.',
            disclaimer: 'ChatGPT può commettere errori. Script di <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        de: {
            backgroundColorLabel: 'Hintergrundfarbe:',
            resetButton: 'Zurücksetzen',
            imagePrompt: 'Dieses Bild als Hintergrund festlegen?',
            invalidImage: 'Bitte wählen Sie eine gültige Bilddatei aus.',
            disclaimer: 'ChatGPT kann Fehler machen. Skript von <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        },
        fr: {
            backgroundColorLabel: 'Couleur de fond :',
            resetButton: 'Réinitialiser',
            imagePrompt: 'Définir cette image comme arrière-plan ?',
            invalidImage: 'Veuillez sélectionner un fichier image valide.',
            disclaimer: 'ChatGPT peut faire des erreurs. Script par <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>'
        }
    };

    // Get Browser Language
    const userLang = navigator.language || navigator.userLanguage;
    const lang = userLang.split('-')[0]; // Extract main language code (e.g., 'en' from 'en-US')
    const currentTranslations = translations[lang] || translations['en']; // Fallback to English

    // Background Functions
    function setBackground(background, type = 'color') {
        localStorage.setItem(STORAGE_KEY_BACKGROUND, JSON.stringify({ background, type }));
        document.body.style.backgroundColor = type === 'color' ? background : 'transparent';
        document.body.style.backgroundImage = type === 'color' ? 'none' : `url(${background})`;
    }

    // UI Element Creation
    function createButton(text, onClick, style = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        Object.assign(button.style, {
            margin: '5px 0', padding: '8px 12px', border: 'none', borderRadius: '5px',
            cursor: 'pointer', fontSize: '14px', ...style
        });
        return button;
    }

    function createColorPicker() {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = currentTranslations.backgroundColorLabel;
        label.htmlFor = 'colorPickerInput';
        container.appendChild(label);

        const input = document.createElement('input');
        input.id = 'colorPickerInput';
        input.type = 'color';
        input.value = savedBackground?.type === 'color' ? savedBackground.background : '#ffffff';
        input.addEventListener('input', () => setBackground(input.value, 'color'));
        container.appendChild(input);
        return container;
    }

    // Drag and Drop Functionality (Encapsulated)
    function handleDragStart(e) {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    }

    function handleDrag(e) {
        if (isDragging) {
            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;

            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            container.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            container.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        }
    }

    function handleDragEnd() {
        isDragging = false;
    }

    function createImageInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file.type.startsWith('image/')) {
                alert(currentTranslations.invalidImage);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const previewImg = document.createElement('img');
                previewImg.src = reader.result;
                previewImg.style.maxWidth = '200px';
                previewImg.style.maxHeight = '200px';
                previewImg.style.marginBottom = '5px';
                container.insertBefore(previewImg, input);

                if (confirm(currentTranslations.imagePrompt)) {
                    setBackground(reader.result, 'image');
                }
                previewImg.remove();
            };
            reader.readAsDataURL(file);
        };
        return input;
    }

    // Main Container Setup
    const container = document.createElement('div');
    container.id = 'background-options-container';
    Object.assign(container.style, {
        position: 'fixed', top: '10px', right: '10px', zIndex: '9999',
        backgroundColor: 'rgba(255,255,255,0.8)', padding: '15px', borderRadius: '5px'
    });
    container.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);

    // Load Saved Settings
    const savedBackground = JSON.parse(localStorage.getItem(STORAGE_KEY_BACKGROUND));
    if (savedBackground) {
        setBackground(savedBackground.background, savedBackground.type);
    }

    // Disclaimer (With Link Handling)
    const disclaimerElement = document.querySelector('.text-center.text-xs');
    if (disclaimerElement) {
        disclaimerElement.innerHTML = `ChatGPT can make errors. Script by <a href="https://github.com/Mr-Zanzibar" target="_blank">Mr-Zanzibar</a>`;
        const linkElement = disclaimerElement.querySelector('a');
        linkElement.addEventListener('mouseover', () => linkElement.style.textDecoration = 'underline');
        linkElement.addEventListener('mouseout', () => linkElement.style.textDecoration = 'none');
    }

    // UI Elements
    container.appendChild(createColorPicker()); // Color Picker
    container.appendChild(createImageInput());
    container.appendChild(createButton(currentTranslations.resetButton, () => {
        localStorage.removeItem(STORAGE_KEY_BACKGROUND);
        location.reload();
    }, { backgroundColor: '#ff0000', color: 'white' })); // Reset Button

    document.body.appendChild(container);
})();
