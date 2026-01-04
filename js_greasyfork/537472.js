// ==UserScript==
// @name         Bloc de Notas Flotante Minimalista
// @version      1.0
// @description  Bloc de notas flotante
// @license      MIT
// @match        http://191.234.162.51/*
// @exclude      http://191.234.162.51/LTConsultores1.3/Login
// @exclude      http://191.234.162.51/GestionErp1.3/Login
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @noframes
// @namespace https://greasyfork.org/users/1274518
// @downloadURL https://update.greasyfork.org/scripts/537472/Bloc%20de%20Notas%20Flotante%20Minimalista.user.js
// @updateURL https://update.greasyfork.org/scripts/537472/Bloc%20de%20Notas%20Flotante%20Minimalista.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTES ---
    const EXCLUDED_PATHS = ['/LTConsultores1.3/Login', '/GestionErp1.3/Login'];
    const MAX_NOTE_WIDTH = 800, MAX_NOTE_HEIGHT = 500, MIN_NOTE_WIDTH = 270, MIN_NOTE_HEIGHT = 175;
    const MAX_CHARACTERS = 4000, DEFAULT_OPACITY = 0.96;

    // --- BLOQUEA EJECUCIÓN SI ESTÁ EN LOGIN O YA INICIALIZADO ---
    if (EXCLUDED_PATHS.includes(window.location.pathname) || window.notepadInitialized) return;
    window.notepadInitialized = true;

    // --- ESTADO Y VALORES INICIALES ---
    let savedOpacity = parseFloat(GM_getValue('noteOpacity', DEFAULT_OPACITY));
    let isVisible = GM_getValue('noteVisible', false);
    let savedScroll = Number(GM_getValue('noteScroll', 0));

    // --- CREACIÓN DE COMPONENTES SHADOW DOM ---
    const notepadHost = document.createElement('div');
    notepadHost.id = 'notepadHost';
    document.body.appendChild(notepadHost);
    const shadowRoot = notepadHost.attachShadow({ mode: 'open' });

    // --- ESTILOS ---
    const style = document.createElement('style');
    style.textContent = `
        #noteBlock {
            position: fixed; top: 100px; left: 100px; width: 300px; height: 200px;
            background-color: #23262b; color: #f5f5f5;
            border: 1.5px solid #3b4048; border-radius: 13px; z-index: 10000;
            padding: 7px; box-shadow: 0 2px 16px 2px rgba(0,0,0,0.13);
            opacity: 0; pointer-events: none;
            transform: translateY(20px);
            transition: opacity 0.32s cubic-bezier(.7,0,.3,1), transform 0.32s cubic-bezier(.7,0,.3,1);
            resize: both; overflow: auto;
            min-width: ${MIN_NOTE_WIDTH}px; min-height: ${MIN_NOTE_HEIGHT}px;
            max-width: ${MAX_NOTE_WIDTH}px; max-height: ${MAX_NOTE_HEIGHT}px;
            font-family: 'Inter', 'Segoe UI', 'Arial', sans-serif; box-sizing: border-box;
        }
        #noteBlock.visible {
            opacity: var(--note-opacity, ${savedOpacity});
            pointer-events: all; transform: translateY(0);
            box-shadow:
                0 0 8px 2px #5da6f7cc,
                0 0 24px 4px #5da6f744,
                0 2px 16px 2px rgba(0,0,0,0.15);
            border-color: #60b3ff;
            animation: neon-fadein 0.38s cubic-bezier(.7,0,.3,1) 1;
        }
        @keyframes neon-fadein {
            0% {
                box-shadow:
                    0 0 0 0 #5da6f700,
                    0 0 0 0 #5da6f700,
                    0 2px 16px 2px rgba(0,0,0,0.05);
                border-color: #3b4048;
            }
            60% {
                box-shadow:
                    0 0 24px 6px #5da6f799,
                    0 0 48px 12px #5da6f733,
                    0 2px 20px 3px rgba(0,0,0,0.13);
                border-color: #90d5ff;
            }
            100% {
                box-shadow:
                    0 0 8px 2px #5da6f7cc,
                    0 0 24px 4px #5da6f744,
                    0 2px 16px 2px rgba(0,0,0,0.15);
                border-color: #60b3ff;
            }
        }
        #noteHeader {
            cursor: move; background-color: #22262c; border-bottom: 1px solid #32343a;
            border-radius: 11px 11px 0 0; padding: 7px 8px 4px 8px; text-align: left;
            font-weight: 600; font-size: 15px; user-select: none; position: relative; letter-spacing: 0.01em;
            text-shadow: 0 0 6px #5da6f799, 0 0 3px #60c0ff55;
            letter-spacing: 0.03em;
            transition: text-shadow 0.18s;
        }
        #noteHeader.fade-in,
        #noteHeader.fade-out {
            text-shadow: 0 0 12px #5da6f7bb, 0 0 5px #60c0ff99;
        }
        #noteHeader.fade-out { opacity: 0; transform: scale(0.95); transition: opacity 0.4s, transform 0.4s; }
        #noteHeader.fade-in { opacity: 1; transform: scale(1); transition: opacity 0.3s, transform 0.3s; }
        #closeBtn {
            position: absolute; top: 5px; right: 7px; background: transparent; border: none;
            color: #e2e2e2; font-size: 19px; cursor: pointer; padding: 0 5px; line-height: 1;
            border-radius: 6px; transition: background 0.18s, color 0.20s, box-shadow 0.18s;
            outline: none;
            box-shadow: 0 0 0 0 #5da6f7cc;
        }
        #closeBtn:hover, #closeBtn:focus {
            background: #35393f;
            color: #fff;
            border: none;
            box-shadow: 0 0 8px 2px #5da6f7cc, 0 0 14px 2px #60b3ff77;
            text-shadow: 0 0 8px #5da6f7cc, 0 0 2px #60b3ff99;
        }
        #noteContent {
            width: 100%; height: calc(100% - 120px); background-color: #23262b; color: #fafbfc;
            border: 1.1px solid #353942; border-radius: 0 0 11px 11px; padding: 7px 9px;
            box-sizing: border-box; outline: none; overflow-y: auto; spellcheck: true;
            font-size: 15px; line-height: 1.5; font-family: inherit; position: relative;
            transition: border-color 0.18s;
        }
        #noteContent:focus { border-color: #5da6f7; }
        #noteContent.empty::before {
            content: 'Escribe tu texto aquí'; color: #888b; pointer-events: none;
            position: absolute; left: 14px; top: 9px; font-style: italic; font-size: 15px; letter-spacing: 0.03em; line-height: 1.5;
        }
        #noteButtons {
            display: flex; justify-content: space-between; align-items: center;
            margin-top: 7px; user-select: none; border-top: 1px solid #32343a; padding-top: 5px;
        }
        #charCounter { color: #aaa; font-size: 13px; margin-left: 7px; user-select: none; letter-spacing: 0.01em; }
        #charCounter.full { color: #e57070; }
        #saveBtn, #clearBtn {
            background: #23262b; color: #e7e7e7; border: 1px solid #353942; border-radius: 7px;
            padding: 4px 17px; cursor: pointer;
            transition: background 0.11s, color 0.15s, border-color 0.12s, transform 0.13s, box-shadow 0.18s;
            font-size: 14px; font-family: inherit; margin-left: 5px;
            box-shadow: 0 0 0 0 #5da6f7cc;
        }
        #saveBtn:hover, #clearBtn:hover, #saveBtn:focus, #clearBtn:focus {
            color: #fff;
            border-color: #5da6f7;
            background: #23262b;
            box-shadow: 0 0 8px 2px #5da6f7cc, 0 0 18px 2px #60b3ff77;
            text-shadow: 0 0 6px #5da6f7bb, 0 0 2px #60b3ff88;
        }
        #saveBtn:active, #clearBtn:active {
            transform: scale(0.97); background: #282d34; color: #b2d3f5; border-color: #5da6f7;
            box-shadow: 0 0 12px 2px #5da6f7cc, 0 0 12px 2px #60b3ff99;
        }
        #toggleNoteBlock {
            position: fixed; top: 0; left: -5px; background: #23262b; color: #f4f4f4;
            border: 1px solid #353942; border-radius: 0 0 9px 0; padding: 10px 8px 10px 15px;
            cursor: pointer; z-index: 10001; width: 80px;
            transition: width 0.3s, background 0.16s, box-shadow 0.2s;
            overflow: hidden; white-space: nowrap;
            outline: none; font-family: inherit; font-size: 15px; box-shadow: 0 2px 10px 1px rgba(0,0,0,0.08);
            box-shadow: 0 0 0 0 #5da6f7cc;
        }
        #toggleNoteBlock:hover, #toggleNoteBlock:focus {
            width: 190px; background: #262b31;
            box-shadow: 0 0 8px 2px #5da6f7cc, 0 0 18px 2px #60b3ff77;
            color: #fff;
            text-shadow: 0 0 6px #5da6f7bb, 0 0 2px #60b3ff88;
        }
        #toggleNoteBlock:focus {
            outline: none;
        }
        #noteContent img {
            max-width: 96%; margin: 6px 0; border-radius: 7px; box-shadow: 0 2px 7px #0003;
            background: #32343a; display: block;
        }
        #opacityControl { display: flex; align-items: center; margin: 7px 0 2px 0; padding: 0 8px 2px 8px; font-size: 13px; user-select: none; color: #b6b6b6;}
        #opacityRange { margin-left: 8px; accent-color: #5da6f7; }
        #opacityValue { margin-left: 6px; font-family: monospace; color: #96caff; min-width: 32px; display: inline-block;}
        #opacityControlContainer { width: 100%; display: flex; justify-content: flex-start; }
    `;
    shadowRoot.appendChild(style);

    // --- HTML UI ---
    const noteBlock = document.createElement('div');
    noteBlock.id = 'noteBlock';
    noteBlock.innerHTML = `
        <div id="noteHeader">
            <span id="noteTitle">Bloc de Notas</span>
            <button id="closeBtn" title="Cerrar">×</button>
        </div>
        <div id="noteContent" contenteditable="true"></div>
        <div id="noteButtons">
            <div id="charCounter">0/${MAX_CHARACTERS}</div>
            <div>
                <button id="saveBtn" title="Guardar el contenido">Guardar</button>
                <button id="clearBtn" title="Limpiar el contenido">Limpiar</button>
            </div>
        </div>
        <div id="opacityControlContainer">
            <div id="opacityControl">
                <span>Transp.:</span>
                <input type="range" id="opacityRange" min="0.2" max="1" step="0.01" value="${savedOpacity}">
                <span id="opacityValue">${Math.round(savedOpacity*100)}%</span>
            </div>
        </div>
    `;
    shadowRoot.appendChild(noteBlock);

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggleNoteBlock';
    toggleBtn.textContent = 'Notas';
    toggleBtn.setAttribute('tabindex', '-1'); // <-- INHABILITA EL TABULADOR
    shadowRoot.appendChild(toggleBtn);

    // --- ELEMENTOS DOM ---
    const noteContent = noteBlock.querySelector('#noteContent');
    const saveBtn = noteBlock.querySelector('#saveBtn');
    const clearBtn = noteBlock.querySelector('#clearBtn');
    const noteHeader = noteBlock.querySelector('#noteHeader');
    const noteTitle = noteBlock.querySelector('#noteTitle');
    const closeBtn = noteBlock.querySelector('#closeBtn');
    const charCounter = noteBlock.querySelector('#charCounter');
    const opacityRange = noteBlock.querySelector('#opacityRange');
    const opacityValue = noteBlock.querySelector('#opacityValue');

    let animationInProgress = false, isDragging = false, offsetX = 0, offsetY = 0;

    // --- INICIALIZA NOTA Y ESTADO ---
    noteBlock.style.setProperty('--note-opacity', savedOpacity);
    if (isVisible) noteBlock.classList.add('visible');
    noteContent.innerHTML = GM_getValue('noteContent', '');
    updateCharCounter(); updatePlaceholder();

    setTimeout(() => {
        if (savedScroll && noteContent.scrollHeight > noteContent.clientHeight) {
            noteContent.scrollTop = savedScroll;
        }
    }, 100);

    // --- CARGA POSICIÓN Y TAMAÑO ---
    const savedPosition = GM_getValue('notePosition', { left: '100px', top: '100px' });
    noteBlock.style.left = savedPosition.left;
    noteBlock.style.top = savedPosition.top;
    const savedSize = GM_getValue('noteSize', { width: '300px', height: '200px' });
    noteBlock.style.width = savedSize.width;
    noteBlock.style.height = savedSize.height;

    // --- EVENTOS NOTA ---
    noteContent.addEventListener('scroll', () => GM_setValue('noteScroll', noteContent.scrollTop));
    noteContent.addEventListener('input', () => {
        updatePlaceholder();
        if (noteContent.textContent.length > MAX_CHARACTERS) {
            let imgs = Array.from(noteContent.querySelectorAll('img'));
            noteContent.textContent = noteContent.textContent.substring(0, MAX_CHARACTERS);
            imgs.forEach(img => noteContent.appendChild(img));
            placeCaretAtEnd(noteContent);
            showHeaderAnimation('Se alcanzó el límite');
        }
        updateCharCounter();
        saveContent();
        showHeaderAnimation('Autoguardado');
    });
    saveBtn.addEventListener('click', () => handleNoteAction('save'));
    clearBtn.addEventListener('click', () => handleNoteAction('clear'));
    noteHeader.addEventListener('mousedown', startDrag);

    // --- BOTÓN EXPANDIBLE CON TEXTO SIEMPRE CORRECTO ---
    toggleBtn.addEventListener('click', function() {
        toggleNoteBlockVisibility();
        if (toggleBtn.matches(':hover')) {
            toggleBtn.textContent = isVisible ? 'Ocultar Bloc de Notas' : 'Mostrar Bloc de Notas';
        } else {
            toggleBtn.textContent = 'Notas';
        }
        toggleBtn.blur();
    });
    toggleBtn.addEventListener('mouseover', () => toggleBtn.textContent = isVisible ? 'Ocultar Bloc de Notas' : 'Mostrar Bloc de Notas');
    toggleBtn.addEventListener('mouseout', () => toggleBtn.textContent = 'Notas');

    closeBtn.addEventListener('click', hideNoteBlock);
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // --- PEGADO DE IMÁGENES, TABLAS Y TEXTO (PRIORIDAD HTML) ---
    noteContent.addEventListener('paste', function(e) {
        const clipboardData = e.clipboardData || window.clipboardData;
        // 1. PRIORIDAD: HTML (tablas de Excel)
        if (clipboardData.types && clipboardData.types.includes("text/html")) {
            e.preventDefault();
            const html = clipboardData.getData('text/html');
            document.execCommand('insertHTML', false, html);
            updateCharCounter(); updatePlaceholder(); saveScroll();
            return;
        }
        // 2. Si no hay HTML, texto plano
        if (clipboardData.types && clipboardData.types.includes("text/plain")) {
            e.preventDefault();
            const text = clipboardData.getData('text/plain');
            let contentText = noteContent.textContent;
            if (contentText.length + text.length > MAX_CHARACTERS) {
                const allowedLength = MAX_CHARACTERS - contentText.length;
                const allowedText = text.substring(0, allowedLength);
                document.execCommand('insertText', false, allowedText);
                showHeaderAnimation('Se alcanzó el límite');
            } else {
                document.execCommand('insertText', false, text);
            }
            updateCharCounter(); updatePlaceholder(); saveScroll();
            return;
        }
        // 3. Si no hay texto ni HTML, imágenes
        if (clipboardData.files && clipboardData.files.length > 0) {
            e.preventDefault();
            const file = clipboardData.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.maxWidth = '100%';
                    img.style.display = 'block';
                    noteContent.appendChild(img);
                    saveContent(); updateCharCounter(); updatePlaceholder(); saveScroll();
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // --- SYNC MULTIPLE TABS ---
    GM_addValueChangeListener('noteContent', syncNoteContent);
    GM_addValueChangeListener('noteScroll', syncNoteScroll);
    GM_addValueChangeListener('noteOpacity', (name, _, newValue, remote) => {
        if (remote) {
            noteBlock.style.setProperty('--note-opacity', newValue);
            opacityRange.value = newValue;
            opacityValue.textContent = Math.round(newValue * 100) + '%';
        }
    });

    // --- RESIZE Y POSICIÓN ---
    new ResizeObserver(saveNoteSize).observe(noteBlock);
    window.addEventListener('resize', adjustNotePositionAndSize);

    // --- OPACIDAD ---
    opacityRange.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        noteBlock.style.setProperty('--note-opacity', value);
        opacityValue.textContent = Math.round(value * 100) + '%';
        GM_setValue('noteOpacity', value);
    });

    // --- FUNCIONES PRINCIPALES ---
    function handleNoteAction(action) {
        if (action === 'save') saveContent();
        else if (action === 'clear') {
            noteContent.innerHTML = '';
            GM_setValue('noteContent', '');
            noteContent.classList.add('empty');
            updateCharCounter();
        }
        showHeaderAnimation(action === 'save' ? 'Contenido Guardado' : 'Contenido Limpiado');
        saveScroll();
    }

    function saveContent() {
        noteContent.querySelectorAll('img').forEach(img => {
            if (img.src.startsWith('blob:')) {
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
                img.src = canvas.toDataURL('image/png');
            }
        });
        GM_setValue('noteContent', noteContent.innerHTML);
        saveScroll();
    }

    async function showHeaderAnimation(message) {
        if (animationInProgress) return;
        animationInProgress = true;
        await animateHeader(message);
        animationInProgress = false;
    }
    async function animateHeader(message) {
        await toggleHeaderAnimation('fade-out', 300);
        noteTitle.textContent = message;
        await toggleHeaderAnimation('fade-in', 300);
        await delay(950);
        await toggleHeaderAnimation('fade-out', 300);
        noteTitle.textContent = 'Bloc de Notas';
        await toggleHeaderAnimation('fade-in', 300);
    }
    function toggleHeaderAnimation(animClass, duration) {
        noteHeader.classList.toggle('fade-in', animClass === 'fade-in');
        noteHeader.classList.toggle('fade-out', animClass === 'fade-out');
        return delay(duration);
    }
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // --- DRAG & DROP ---
    function startDrag(e) {
        if (e.target === closeBtn) return;
        isDragging = true;
        offsetX = e.clientX - noteBlock.getBoundingClientRect().left;
        offsetY = e.clientY - noteBlock.getBoundingClientRect().top;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    }
    function onDrag(e) {
        let newLeft = e.clientX - offsetX, newTop = e.clientY - offsetY;
        const maxLeft = window.innerWidth - noteBlock.offsetWidth;
        const maxTop = window.innerHeight - noteBlock.offsetHeight;
        noteBlock.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
        noteBlock.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    }
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        GM_setValue('notePosition', { left: noteBlock.style.left, top: noteBlock.style.top });
    }

    // --- VISIBILIDAD Y SHORTCUTS ---
    function toggleNoteBlockVisibility() {
        isVisible = !isVisible;
        noteBlock.classList.toggle('visible', isVisible);
        GM_setValue('noteVisible', isVisible);
        if (isVisible) setTimeout(() => noteContent.scrollTop = Number(GM_getValue('noteScroll', 0)), 50);
    }
    function hideNoteBlock() {
        isVisible = false;
        noteBlock.classList.remove('visible');
        GM_setValue('noteVisible', false);
    }
    function handleKeyboardShortcuts(e) {
        if (e.altKey && e.key.toLowerCase() === 'n') toggleNoteBlockVisibility();
        else if (isVisible && e.ctrlKey) {
            if (e.key.toLowerCase() === 's') { e.preventDefault(); handleNoteAction('save'); }
            else if (e.key.toLowerCase() === 'l') { e.preventDefault(); handleNoteAction('clear'); }
        }
    }

    // --- SYNC MULTI-TAB ---
    function syncNoteContent(name, oldValue, newValue, remote) {
        if (remote && newValue !== noteContent.innerHTML) {
            noteContent.innerHTML = newValue || '';
            updatePlaceholder(); updateCharCounter();
            showHeaderAnimation('Contenido Actualizado');
            setTimeout(() => noteContent.scrollTop = Number(GM_getValue('noteScroll', 0)), 50);
        }
    }
    function syncNoteScroll(name, oldValue, newValue, remote) {
        if (remote) setTimeout(() => noteContent.scrollTop = Number(newValue || 0), 50);
    }

    // --- TAMAÑO Y POSICIÓN AUTOGUARDADO ---
    function saveNoteSize() {
        let width = parseInt(noteBlock.style.width, 10), height = parseInt(noteBlock.style.height, 10);
        width = Math.max(MIN_NOTE_WIDTH, Math.min(width, MAX_NOTE_WIDTH));
        height = Math.max(MIN_NOTE_HEIGHT, Math.min(height, MAX_NOTE_HEIGHT));
        noteBlock.style.width = `${width}px`; noteBlock.style.height = `${height}px`;
        GM_setValue('noteSize', { width: noteBlock.style.width, height: noteBlock.style.height });
    }

    function adjustNotePositionAndSize() {
        const windowWidth = window.innerWidth, windowHeight = window.innerHeight, margin = 20;
        let newLeft = parseInt(noteBlock.style.left, 10);
        let newTop = parseInt(noteBlock.style.top, 10);
        const maxLeft = windowWidth - noteBlock.offsetWidth;
        const maxTop = windowHeight - noteBlock.offsetHeight;
        if (newLeft > maxLeft) noteBlock.style.left = `${Math.max(0, maxLeft)}px`;
        if (newTop > maxTop) noteBlock.style.top = `${Math.max(0, maxTop)}px`;
        if (newLeft < 0 || isNaN(newLeft)) noteBlock.style.left = '0px';
        if (newTop < 0 || isNaN(newTop)) noteBlock.style.top = '0px';
        let newWidth = noteBlock.offsetWidth, newHeight = noteBlock.offsetHeight;
        const maxWidth = Math.min(windowWidth - margin, MAX_NOTE_WIDTH), maxHeight = Math.min(windowHeight - margin, MAX_NOTE_HEIGHT);
        if (newWidth > maxWidth) noteBlock.style.width = `${maxWidth}px`;
        if (newHeight > maxHeight) noteBlock.style.height = `${maxHeight}px`;
        if (newWidth < MIN_NOTE_WIDTH) noteBlock.style.width = `${MIN_NOTE_WIDTH}px`;
        if (newHeight < MIN_NOTE_HEIGHT) noteBlock.style.height = `${MIN_NOTE_HEIGHT}px`;
        GM_setValue('notePosition', { left: noteBlock.style.left, top: noteBlock.style.top });
        GM_setValue('noteSize', { width: noteBlock.style.width, height: noteBlock.style.height });
    }

    // --- UTILIDADES ---
    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            let sel = shadowRoot.getSelection ? shadowRoot.getSelection() : window.getSelection();
            sel.removeAllRanges(); sel.addRange(range);
        }
    }
    function updateCharCounter() {
        const contentText = noteContent.textContent;
        charCounter.textContent = `${contentText.length}/${MAX_CHARACTERS}`;
        charCounter.classList.toggle('full', contentText.length >= MAX_CHARACTERS);
    }
    function updatePlaceholder() {
        if (noteContent.textContent.trim().length === 0 && noteContent.querySelectorAll('img').length === 0)
            noteContent.classList.add('empty');
        else
            noteContent.classList.remove('empty');
    }
    function saveScroll() { GM_setValue('noteScroll', noteContent.scrollTop); }
})();