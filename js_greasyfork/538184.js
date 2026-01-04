// ==UserScript==
// @name         Waze Forum Editor Custom Buttons (good)
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  Añade botones personalizados a la barra de edición del foro de Waze.
// @author       JanKlaaseen
// @license      MIT
// @match        https://www.waze.com/discuss/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538184/Waze%20Forum%20Editor%20Custom%20Buttons%20%28good%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538184/Waze%20Forum%20Editor%20Custom%20Buttons%20%28good%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("WFE Custom Buttons: Script v0.8.1 starting...");

    const YOUR_CUSTOM_BUTTON_CLASS_PREFIX = 'wce-custom-btn-';
    let headerDropdownMenu = null;
    let introductionModal = null;
    let biographyModal = null;
    let biographyEntryCount = 0;
    const MAX_BIO_ENTRIES = 15;

    const defaultIntroText = "¡Waze está trabajando en cargar las Estaciones de Carga para implementarlas en el mapa y que, a su vez, actualicen su información de manera automática! Para ello, hay un bot “**evcs feed 1(1)** ” que se encarga de enlazar las estaciones de carga con las bases de datos de cargadores, tipos y precios con las que pudiéramos tener en el mapa de waze. Esta información viene de proveedores externos que trabajan con google en la actualidad.";
    const defaultIntroNoteText = "La edición está limitada a los editores de nivel 3+.";

    const headerOptions = {
        "Encabezado 1": ["# [wzh=1]", "[/wzh]\n"],
        "Encabezado 2": ["## [wzh=2]", "[/wzh]\n"],
        "Encabezado 3": ["### [wzh=3]", "[/wzh]\n"],
        "Encabezado 4": ["#### [wzh=4]", "[/wzh]\n"],
        "Encabezado 5": ["##### [wzh=5]", "[/wzh]\n"],
        "Encabezado 6": ["###### [wzh=6]", "[/wzh]\n"],
        "Encabezado 7": ["[wzh=7]", "[/wzh]\n"]
    };

    const customIconInfo = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><image href="data:image/png;base64,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" height="1em" width="1em"/></svg>
    `;
    const customIconBio = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><image href="data:image/png;base64,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" height="1em" width="1em"/></svg>
    `;
    const customIconForum = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><image href="data:image/png;base64,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" height="1em" width="1em"/></svg>
   `;

    function createFaSvgIcon(iconName, customClass = '') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', `fa d-icon d-icon-${iconName} svg-icon svg-string ${customClass}`);
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${iconName}`);
        svg.appendChild(use);
        return svg;
    }

    function createButton(id, title, iconNameOrHtml, onClickAction, toolbar) {
        console.log(`WFE Custom Buttons: Attempting to create button "${id}".`);
        if (toolbar.querySelector('#' + YOUR_CUSTOM_BUTTON_CLASS_PREFIX + id)) {
            console.warn(`WFE Custom Buttons: Button "${id}" already exists in toolbar. Skipping creation.`);
            return null;
        }

        const button = document.createElement('button');
        button.id = YOUR_CUSTOM_BUTTON_CLASS_PREFIX + id;
        button.className = 'btn no-text btn-icon custom-editor-button';
        button.type = 'button';
        button.title = title;
        button.tabIndex = -1;

        try {
            if (typeof iconNameOrHtml === 'string') {
                if (iconNameOrHtml.startsWith('#')) {
                    button.appendChild(createFaSvgIcon(iconNameOrHtml.substring(1)));
                } else if (iconNameOrHtml.trim().toLowerCase().startsWith('<svg') || iconNameOrHtml.trim().toLowerCase().startsWith('<img')) {
                    button.classList.remove('no-text');
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = iconNameOrHtml.trim();
                    if (tempDiv.firstChild) {
                        const iconElement = tempDiv.firstChild.cloneNode(true);
                        if (iconElement.tagName.toLowerCase() === 'svg') {
                            iconElement.classList.add('d-icon', 'svg-icon', 'svg-string', 'custom-svg-icon');
                            if (!iconElement.getAttribute('width') && !iconElement.style.width) iconElement.setAttribute('width', '1em');
                            if (!iconElement.getAttribute('height') && !iconElement.style.height) iconElement.setAttribute('height', '1em');
                        }
                        button.appendChild(iconElement);
                    } else {
                        console.warn(`WFE Custom Buttons: Button "${id}" - SVG/IMG string for icon resulted in no firstChild.`);
                        button.textContent = title.substring(0, 3);
                        button.classList.remove('no-text');
                    }
                } else {
                    button.textContent = iconNameOrHtml;
                    button.classList.remove('no-text');
                    button.style.padding = "0 5px";
                }
            } else if (iconNameOrHtml instanceof Element) {
                button.appendChild(iconNameOrHtml);
            }

            const hiddenSpan = document.createElement('span');
            hiddenSpan.setAttribute('aria-hidden', 'true');
            hiddenSpan.innerHTML = '&#8203;';
            button.appendChild(hiddenSpan);

            button.addEventListener('click', onClickAction);
            console.log(`WFE Custom Buttons: Button "${id}" created successfully.`);
            return button;
        } catch (e) {
            console.error(`WFE Custom Buttons: Error creating button "${id}":`, e);
            return null;
        }
    }

    function insertTextAndSelect(textarea, prefix, selectedText, suffix) {
        const originalScrollTop = textarea.scrollTop;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;
        let textToInsert;
        let newStart;
        let newEnd;

        if (selectedText) {
            textToInsert = prefix + selectedText + suffix;
            textarea.value = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
            newStart = start + prefix.length;
            newEnd = newStart + selectedText.length;
        } else {
            textToInsert = prefix + suffix;
            textarea.value = currentValue.substring(0, start) + textToInsert + currentValue.substring(end);
            newStart = start + prefix.length;
            newEnd = newStart;
        }

        textarea.focus({ preventScroll: true });
        textarea.selectionStart = newStart;
        textarea.selectionEnd = newEnd;
        textarea.scrollTop = originalScrollTop;

        const event = new Event('input', { bubbles: true, cancelable: true });
        textarea.dispatchEvent(event);
    }

    function createHeaderDropdownMenuIfNeeded(textarea, buttonElement) {
        if (headerDropdownMenu) return;
        headerDropdownMenu = document.createElement('div');
        headerDropdownMenu.className = 'custom-header-dropdown';
        document.body.appendChild(headerDropdownMenu);

        Object.keys(headerOptions).forEach(key => {
            const item = document.createElement('div');
            item.textContent = key;
            item.addEventListener('click', () => {
                let [prefix, suffix] = headerOptions[key];
                const selectionStart = textarea.selectionStart;
                const selectionEnd = textarea.selectionEnd;
                const selectedText = textarea.value.substring(selectionStart, selectionEnd);

                const charBeforeStart = textarea.value.charAt(selectionStart - 1);
                if (selectionStart > 0 && charBeforeStart !== '\n' && charBeforeStart !== '') {
                    prefix = '\n' + prefix;
                }

                insertTextAndSelect(textarea, prefix, selectedText, suffix);
                if(headerDropdownMenu) headerDropdownMenu.style.display = 'none';
                document.removeEventListener('click', handleClickOutsideDropdown, true);
            });
            headerDropdownMenu.appendChild(item);
        });
    }

    function toggleHeaderDropdown(textarea, buttonElement) {
        createHeaderDropdownMenuIfNeeded(textarea, buttonElement);
         if (!headerDropdownMenu) return; // Safety check
        if (headerDropdownMenu.style.display === 'block') {
            headerDropdownMenu.style.display = 'none';
            document.removeEventListener('click', handleClickOutsideDropdown, true);
        } else {
            const rect = buttonElement.getBoundingClientRect();
            headerDropdownMenu.style.top = (rect.bottom + window.scrollY) + 'px';
            headerDropdownMenu.style.left = (rect.left + window.scrollX) + 'px';
            headerDropdownMenu.style.display = 'block';
            setTimeout(() => {
                document.addEventListener('click', handleClickOutsideDropdown, true);
            }, 0);
        }
    }

    function handleClickOutsideDropdown(event) {
        const headersButton = document.getElementById(YOUR_CUSTOM_BUTTON_CLASS_PREFIX + 'headers');
        if (headerDropdownMenu && headerDropdownMenu.style.display === 'block') {
            if (!headerDropdownMenu.contains(event.target) && headersButton && !headersButton.contains(event.target)) {
                headerDropdownMenu.style.display = 'none';
                document.removeEventListener('click', handleClickOutsideDropdown, true);
            }
        }
    }

    function createIntroductionModalIfNeeded(textarea) {
        console.log("WFE Custom Buttons: createIntroductionModalIfNeeded called");
        if (introductionModal) {
            console.log("WFE Custom Buttons: Introduction modal already exists.");
            return;
        }
        try {
            introductionModal = document.createElement('div');
            introductionModal.id = YOUR_CUSTOM_BUTTON_CLASS_PREFIX + 'intro-modal';
            introductionModal.className = 'custom-editor-modal';
            introductionModal.innerHTML = `
                <div class="custom-modal-content">
                    <span class="custom-modal-close">&times;</span>
                    <h2>Configurar Introducción</h2>
                    <label for="introMainText">Texto Principal:</label>
                    <textarea id="introMainText" rows="5">${defaultIntroText}</textarea>
                    <div>
                        <input type="checkbox" id="introAddNoteCheckbox">
                        <label for="introAddNoteCheckbox">Añadir nota :bookmark:</label>
                    </div>
                    <div id="introNoteSection" style="display:none;">
                        <label for="introNoteText">Texto de la Nota:</label>
                        <textarea id="introNoteText" rows="2">${defaultIntroNoteText}</textarea>
                    </div>
                    <div>
                        <input type="checkbox" id="introAddExtraCheckbox">
                        <label for="introAddExtraCheckbox">Añadir contenido adicional</label>
                    </div>
                    <div id="introExtraSection" style="display:none;">
                        <label for="introExtraText">Contenido Adicional:</label>
                        <textarea id="introExtraText" rows="3"></textarea>
                    </div>
                    <button id="insertIntroButton">Insertar Introducción</button>
                </div>
            `;
            document.body.appendChild(introductionModal);
            console.log("WFE Custom Buttons: Introduction modal HTML structure created and appended to body.");

            const closeModalButton = introductionModal.querySelector('.custom-modal-close');
            const addNoteCheckbox = introductionModal.querySelector('#introAddNoteCheckbox');
            const noteSection = introductionModal.querySelector('#introNoteSection');
            const addExtraCheckbox = introductionModal.querySelector('#introAddExtraCheckbox');
            const extraSection = introductionModal.querySelector('#introExtraSection');
            const insertButton = introductionModal.querySelector('#insertIntroButton');

            if (!closeModalButton || !addNoteCheckbox || !noteSection || !addExtraCheckbox || !extraSection || !insertButton) {
                console.error("WFE Custom Buttons: One or more elements inside introduction modal not found!");
                return;
            }
            closeModalButton.onclick = () => { if(introductionModal) introductionModal.style.display = 'none'; console.log("WFE Custom Buttons: Intro modal closed."); };
            addNoteCheckbox.onchange = () => { if(noteSection) noteSection.style.display = addNoteCheckbox.checked ? 'block' : 'none'; };
            addExtraCheckbox.onchange = () => { if(extraSection) extraSection.style.display = addExtraCheckbox.checked ? 'block' : 'none'; };

            insertButton.onclick = () => {
                console.log("WFE Custom Buttons: Insert Intro button clicked.");
                const mainText = document.getElementById('introMainText').value;
                let fullIntroText = `[center][wzh=0]![Info64x64|64x64](upload://1cG8aFsGrCONmfJ4R1Bzb5PP9Ia.png)[/wzh][/center]\n\n`;
                fullIntroText += `# [wzh=1]Introducción[/wzh]\n\n`;
                fullIntroText += mainText.trim() + '\n\n';

                if (addNoteCheckbox.checked) {
                    const noteText = document.getElementById('introNoteText').value;
                    fullIntroText += `> :bookmark: ${noteText.trim()}\n\n`;
                }
                if (addExtraCheckbox.checked) {
                    const extraText = document.getElementById('introExtraText').value;
                    if (extraText.trim()) {
                        fullIntroText += extraText.trim() + '\n\n';
                    }
                }
                fullIntroText += '---\n';

                const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                insertTextAndSelect(textarea, fullIntroText, selection, "");
                if(introductionModal) introductionModal.style.display = 'none';
                console.log("WFE Custom Buttons: Introduction content inserted.");
            };
            console.log("WFE Custom Buttons: Introduction modal event listeners attached.");
        } catch (e) {
            console.error("WFE Custom Buttons: Error in createIntroductionModalIfNeeded:", e);
            if (introductionModal && introductionModal.parentNode) {
                introductionModal.parentNode.removeChild(introductionModal);
            }
            introductionModal = null;
        }
    }

    function showIntroductionModal(textarea) {
        console.log("WFE Custom Buttons: showIntroductionModal called");
        try {
            createIntroductionModalIfNeeded(textarea);
            if (!introductionModal) {
                console.error("WFE Custom Buttons: Introduction modal could not be created or shown.");
                alert("Error: No se pudo mostrar el modal de introducción.");
                return;
            }
            const mainTextElem = document.getElementById('introMainText');
            const addNoteCheckboxElem = document.getElementById('introAddNoteCheckbox');
            const noteSectionElem = document.getElementById('introNoteSection');
            const noteTextElem = document.getElementById('introNoteText');
            const addExtraCheckboxElem = document.getElementById('introAddExtraCheckbox');
            const extraSectionElem = document.getElementById('introExtraSection');
            const extraTextElem = document.getElementById('introExtraText');

            if(mainTextElem) mainTextElem.value = defaultIntroText;
            if(addNoteCheckboxElem) addNoteCheckboxElem.checked = false;
            if(noteSectionElem) noteSectionElem.style.display = 'none';
            if(noteTextElem) noteTextElem.value = defaultIntroNoteText;
            if(addExtraCheckboxElem) addExtraCheckboxElem.checked = false;
            if(extraSectionElem) extraSectionElem.style.display = 'none';
            if(extraTextElem) extraTextElem.value = '';

            introductionModal.style.display = 'block';
            console.log("WFE Custom Buttons: Introduction modal displayed.");
        } catch (e) {
            console.error("WFE Custom Buttons: Error in showIntroductionModal:", e);
            alert("Error al mostrar el modal de introducción. Revise la consola.");
        }
    }

    // --- MODAL PARA BIOGRAFÍA ---
    function createBiographyModalIfNeeded(textarea) {
        console.log("WFE Custom Buttons: createBiographyModalIfNeeded called");
        if (biographyModal) {
            console.log("WFE Custom Buttons: Biography modal already exists.");
            return;
        }
        try {
            biographyModal = document.createElement('div');
            biographyModal.id = YOUR_CUSTOM_BUTTON_CLASS_PREFIX + 'bio-modal';
            biographyModal.className = 'custom-editor-modal';
            biographyModal.innerHTML = `
                <div class="custom-modal-content">
                    <span class="custom-modal-close">&times;</span>
                    <h2>Configurar Biografía y Enlaces</h2>
                    <div id="bioEntriesContainer">
                        </div>
                    <button id="addBioEntryButton" type="button">Añadir Nueva Entrada</button>
                    <hr>
                    <button id="insertBioButton" type="button">Insertar Biografía</button>
                </div>
            `;
            document.body.appendChild(biographyModal);
            console.log("WFE Custom Buttons: Biography modal HTML structure created.");

            const entriesContainer = biographyModal.querySelector('#bioEntriesContainer');
            const addEntryButton = biographyModal.querySelector('#addBioEntryButton');
            const insertBioButton = biographyModal.querySelector('#insertBioButton');
            const closeBioModalButton = biographyModal.querySelector('.custom-modal-close');

            closeBioModalButton.onclick = () => { if(biographyModal) biographyModal.style.display = 'none'; console.log("WFE Custom Buttons: Bio modal closed."); };

            const addBioEntry = () => {
                if (biographyEntryCount >= MAX_BIO_ENTRIES) {
                    alert(`No se pueden añadir más de ${MAX_BIO_ENTRIES} entradas.`);
                    return;
                }
                biographyEntryCount++;
                const entryDiv = document.createElement('div');
                entryDiv.className = 'bio-entry';
                entryDiv.dataset.entryId = biographyEntryCount;
                entryDiv.innerHTML = `
                    <h4>Entrada ${biographyEntryCount}</h4>
                    <label for="bioDate${biographyEntryCount}">Fecha (texto):</label>
                    <input type="text" id="bioDate${biographyEntryCount}" name="bioDate">
                    <label for="bioUrl${biographyEntryCount}">URL (opcional):</label>
                    <input type="text" id="bioUrl${biographyEntryCount}" name="bioUrl">
                    <label for="bioDesc${biographyEntryCount}">Descripción:</label>
                    <textarea id="bioDesc${biographyEntryCount}" name="bioDesc" rows="2"></textarea>
                    <button type="button" class="removeBioEntryButton">Eliminar Entrada</button>
                    <hr style="margin-top:10px; margin-bottom:10px;">
                `;
                entriesContainer.appendChild(entryDiv);
                entryDiv.querySelector('.removeBioEntryButton').onclick = function() {
                    this.closest('.bio-entry').remove();
                    // No decrementamos biographyEntryCount para evitar IDs duplicados si se añaden más después,
                    // pero la cuenta real de elementos la podemos obtener con querySelectorAll.
                    // Opcionalmente, podríamos re-numerar, pero es más complejo.
                };
            };

            addEntryButton.onclick = addBioEntry;

            insertBioButton.onclick = () => {
                console.log("WFE Custom Buttons: Insert Bio button clicked.");
                let bioContent = `---\n\n`;
                bioContent += `[center][wzh=0]![image|128x128, 50%](upload://UTuWTJ1XEX6BVzoj1FIhLjAb6i.png)[/wzh][/center]\n`; // Asegúrate que este upload ID es el correcto para Bio
                bioContent += `# [wzh=2]Biografía y Enlaces[/wzh]\n`;

                const entryElements = entriesContainer.querySelectorAll('.bio-entry');
                entryElements.forEach(entryEl => {
                    const date = entryEl.querySelector('input[name="bioDate"]').value.trim();
                    const url = entryEl.querySelector('input[name="bioUrl"]').value.trim();
                    const desc = entryEl.querySelector('textarea[name="bioDesc"]').value.trim();

                    if (date && desc) { // Fecha y descripción son mínimamente requeridas
                        if (url) {
                            bioContent += `El [${date}](${url}) ${desc}\n\n`;
                        } else {
                            bioContent += `El ${date} ${desc}\n\n`;
                        }
                    }
                });

                const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                insertTextAndSelect(textarea, bioContent, selection, ""); // Se inserta el contenido, si hay selección se envuelve.
                if(biographyModal) biographyModal.style.display = 'none';
                console.log("WFE Custom Buttons: Biography content inserted.");
            };
            console.log("WFE Custom Buttons: Biography modal event listeners attached.");

        } catch (e) {
            console.error("WFE Custom Buttons: Error in createBiographyModalIfNeeded:", e);
            if (biographyModal && biographyModal.parentNode) {
                biographyModal.parentNode.removeChild(biographyModal);
            }
            biographyModal = null;
        }
    }

    function showBiographyModal(textarea) {
        console.log("WFE Custom Buttons: showBiographyModal called");
        try {
            createBiographyModalIfNeeded(textarea);
            if (!biographyModal) {
                console.error("WFE Custom Buttons: Biography modal could not be created/shown.");
                alert("Error: No se pudo mostrar el modal de biografía.");
                return;
            }
            // Limpiar entradas anteriores y resetear contador
            const entriesContainer = biographyModal.querySelector('#bioEntriesContainer');
            if (entriesContainer) entriesContainer.innerHTML = '';
            biographyEntryCount = 0;
            // Añadir una entrada inicial por defecto
            const addEntryButton = biographyModal.querySelector('#addBioEntryButton');
            if (addEntryButton) addEntryButton.click();

            biographyModal.style.display = 'block';
            console.log("WFE Custom Buttons: Biography modal displayed.");
        } catch (e) {
             console.error("WFE Custom Buttons: Error in showBiographyModal:", e);
            alert("Error al mostrar el modal de biografía. Revise la consola.");
        }
    }
    // --- FIN MODAL BIOGRAFÍA ---


    function addCustomButtons(toolbar) {
        console.log("WFE Custom Buttons: addCustomButtons called. Toolbar found:", !!toolbar);
        const editorTextarea = document.querySelector('textarea.d-editor-input');
        if (!editorTextarea) {
            console.warn('WFE Custom Buttons: Textarea del editor (textarea.d-editor-input) no encontrada. No se añadirán botones.');
            return;
        }
        console.log("WFE Custom Buttons: Editor textarea found:", !!editorTextarea);

        const buttonsToAdd = [];

        buttonsToAdd.push({
            id: 'headers',
            title: 'Insertar Encabezado',
            icon: '#tasks',
            action: (event) => {
                console.log("WFE Custom Buttons: Headers button clicked.");
                try {
                    toggleHeaderDropdown(editorTextarea, event.currentTarget);
                } catch (e) {
                    console.error("WFE Custom Buttons: Error in headers button action:", e);
                }
            }
        });

        buttonsToAdd.push({
            id: 'introduction',
            title: 'Insertar contenido de Introducción',
            icon: customIconInfo,
            action: () => {
                console.log("WFE Custom Buttons: Introduction button clicked.");
                try {
                    showIntroductionModal(editorTextarea);
                } catch (e) {
                    console.error("WFE Custom Buttons: Error in introduction button action:", e);
                }
            }
        });

        buttonsToAdd.push({
            id: 'biography',
            title: 'Insertar contenido de Biografía',
            icon: customIconBio, // Asegúrate que este es el icono correcto para Biografía
            action: () => {
                console.log("WFE Custom Buttons: Biography button clicked.");
                 try {
                    showBiographyModal(editorTextarea);
                } catch (e) {
                    console.error("WFE Custom Buttons: Error in biography button action:", e);
                }
            }
        });

        buttonsToAdd.push({
            id: 'forum-content',
            title: 'Insertar contenido de Foro',
            icon: customIconForum,
            action: () => {
                console.log("WFE Custom Buttons: Forum button clicked.");
                try {
                    let postTitle = "TÍTULO_POR_DEFECTO";
                    const pageTitleElement = document.querySelector('.topic-details .topic-title, .title-wrapper .topic-title');
                    if (pageTitleElement) {
                         postTitle = pageTitleElement.textContent.trim();
                    } else {
                        const titleLinkElement = document.querySelector('a.topic-link[data-topic-id]');
                        if (titleLinkElement) {
                            const specificTitleSpan = titleLinkElement.querySelector('span[dir="auto"]');
                            if (specificTitleSpan) {
                                const clonedContainer = specificTitleSpan.cloneNode(true);
                                const imgElement = clonedContainer.querySelector('img.emoji');
                                if (imgElement) imgElement.remove();
                                postTitle = clonedContainer.textContent.trim();
                            } else {
                                const clonedLink = titleLinkElement.cloneNode(true);
                                Array.from(clonedLink.querySelectorAll('span.topic-stalled-glyph, span.badge, img.emoji, .d-icon')).forEach(el => el.remove());
                                postTitle = clonedLink.textContent.trim().replace(/\s+/g, ' ');
                            }
                        } else {
                            const h1Title = document.querySelector('h1');
                            if(h1Title) {
                                const clonedH1 = h1Title.cloneNode(true);
                                Array.from(clonedH1.querySelectorAll('.topic-stalled-glyph, .badge, .d-icon, .topic-status')).forEach(el => el.remove());
                                postTitle = clonedH1.textContent.trim().replace(/\s+/g, ' ');
                            }
                        }
                    }
                    if (!postTitle || postTitle.length === 0 || postTitle.toLowerCase().includes("crear un tema nuevo")) {
                        postTitle = "TÍTULO_POR_DEFECTO_REVISAR";
                    }
                    console.log("WFE Custom Buttons: Post title found: ", postTitle);

                    const encodedTitle = encodeURIComponent(postTitle);
                    let finalForumContent = `---\n\n`; // --- al principio
                    finalForumContent += `[center]![image|128x128, 50%](upload://2cmYNNfUCAykbh8vW92usPC9Sf3.png)[/center]\n\n`;
                    finalForumContent += `# [wzh=1]Foro de discusión:[/wzh]\n`;
                    finalForumContent += `Si observas cualquier tipo de error en la información aquí contenida, así como si deseas mejorarla o incluso solicitar algún tipo de cambio en los criterios para su uso, puedes informar en el foro correspondiente <a rel="nofollow" class="external text" href="https://www.waze.com/discuss/new-topic?category=spain-usuarios-y-editores/wazeopedia-es/4779&title=WAZO%20-%20${encodedTitle}&body=Hola%20editores%2C%0A%0AHe%20le%C3%ADdo%20la%20informaci%C3%B3n%20en%20la%20Wazeopedia%20y%20me%20gustar%C3%ADa%20hacer%20una%20sugerencia%20o%20proponer%20un%20cambio%20relacionado%20con%20la%20informaci%C3%B3n%20contenida%20en%20${encodedTitle}.%20A%20continuaci%C3%B3n%20detallar%C3%A9%20mi%20idea%2C%20error%20o%20modificaci%C3%B3n%3A%0A%0A%3C%20Pon%20aqu%C3%AD%20tu%20sugerencia%2C%20error%20o%20cambio%20%3E">→aquí←</a>\n`;

                    const selection = editorTextarea.value.substring(editorTextarea.selectionStart, editorTextarea.selectionEnd);
                    insertTextAndSelect(editorTextarea, finalForumContent, selection, "");
                } catch (e) {
                    console.error("WFE Custom Buttons: Error in forum button action:", e);
                }
            }
        });

        const optionsButton = toolbar.querySelector('details.toolbar-popup-menu-options');
        console.log("WFE Custom Buttons: Options (gear) button found:", !!optionsButton);

        buttonsToAdd.forEach(btnData => {
            const newButton = createButton(btnData.id, btnData.title, btnData.icon, btnData.action, toolbar);
            if (newButton) {
                console.log(`WFE Custom Buttons: Attempting to insert button "${btnData.id}"...`);
                if (optionsButton) {
                    toolbar.insertBefore(newButton, optionsButton);
                } else {
                    toolbar.appendChild(newButton);
                }
                if (toolbar.contains(newButton)) {
                    console.log(`WFE Custom Buttons: Button "${btnData.id}" successfully inserted into toolbar.`);
                } else {
                    console.error(`WFE Custom Buttons: Button "${btnData.id}" was NOT inserted into toolbar, but no error was thrown by append/insertBefore.`);
                }
            } else {
                 console.warn(`WFE Custom Buttons: Button "${btnData.id}" was not created (returned null from createButton).`);
            }
        });
        toolbar.dataset.customButtonsAdded = 'true';
        console.log("WFE Custom Buttons: All custom buttons processed. Toolbar dataset updated.");
    }

    const observer = new MutationObserver((mutationsList, obs) => { /* ... (sin cambios) ... */ });
    try {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("WFE Custom Buttons: MutationObserver observing body.");
    } catch (e) { console.error("WFE Custom Buttons: Error starting MutationObserver:", e); }

    try {
        const initialToolbar = document.querySelector('.d-editor-button-bar');
        if (initialToolbar && !initialToolbar.dataset.customButtonsAdded) {
             console.log('WFE Custom Buttons: Editor toolbar found initially.');
            addCustomButtons(initialToolbar);
        } else if (!initialToolbar) {
            console.log('WFE Custom Buttons: Editor toolbar NOT found initially. Waiting for MutationObserver.');
        } else {
            console.log('WFE Custom Buttons: Editor toolbar found initially, but custom buttons already marked as added.');
        }
    } catch (e) { console.error("WFE Custom Buttons: Error during initial toolbar check:", e); }

    try {
        GM_addStyle(`
            .custom-editor-button svg.custom-svg-icon { }
            .custom-editor-button { overflow: visible !important; }
            .custom-editor-button .d-icon { vertical-align: middle; }
            .custom-header-dropdown {
                display: none; position: absolute; background-color: #fff;
                min-width: 180px; border: 1px solid #ccc;
                box-shadow: 0px 3px 8px rgba(0,0,0,0.15); z-index: 1001; border-radius: 4px;
            }
            .custom-header-dropdown div {
                padding: 8px 12px; text-decoration: none; display: block;
                color: #333; cursor: pointer; white-space: nowrap;
            }
            .custom-header-dropdown div:hover { background-color: #f0f0f0; }

            .custom-editor-modal {
                display: none; position: fixed; z-index: 1000;
                left: 0; top: 0; width: 100%; height: 100%;
                overflow: auto; background-color: rgba(0,0,0,0.4);
            }
            .custom-modal-content {
                background-color: #fefefe; margin: 10% auto; padding: 20px;
                border: 1px solid #888; width: 70%; max-width: 700px; /* Ancho aumentado */
                border-radius: 5px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            }
            .custom-modal-content h2 { margin-top: 0; }
            .custom-modal-content label {
                display: block; margin-top: 10px; margin-bottom: 5px; font-weight: bold;
            }
            .custom-modal-content textarea, .custom-modal-content input[type="text"] {
                width: calc(100% - 12px); padding: 5px; margin-bottom: 10px;
                border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box;
            }
            .custom-modal-content textarea { resize: vertical; }
            .custom-modal-content button {
                background-color: #007bff; color: white; /* Azul Bootstrap */
                padding: 10px 15px; margin-top: 15px; border: none;
                border-radius: 3px; cursor: pointer; margin-right: 10px;
            }
            .custom-modal-content button:hover { background-color: #0056b3; }
            .custom-modal-close {
                color: #aaa; float: right; font-size: 28px; font-weight: bold;
            }
            .custom-modal-close:hover, .custom-modal-close:focus {
                color: black; text-decoration: none; cursor: pointer;
            }
            .custom-modal-content div > input[type="checkbox"] { margin-right: 5px; }
            /* Estilos para el modal de Biografía */
            #bioEntriesContainer .bio-entry {
                border: 1px solid #eee;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            #bioEntriesContainer .bio-entry h4 { margin-top: 0; }
            .removeBioEntryButton {
                background-color: #dc3545 !important; /* Rojo Bootstrap */
                font-size: 0.8em;
                padding: 5px 8px !important;
            }
            .removeBioEntryButton:hover { background-color: #c82333 !important; }
        `);
        console.log("WFE Custom Buttons: Styles added.");
    } catch (e) { console.error("WFE Custom Buttons: Error adding styles with GM_addStyle:", e); }

    console.log("WFE Custom Buttons: Script v0.8 finished initialization.");
})();
