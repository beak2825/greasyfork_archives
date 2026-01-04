// ==UserScript==
// @name         Extractor Avanzado JW.org (Menú Contextual)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Extrae asignaciones o enlaces de imágenes/videos/posters (alta calidad) de JW.org mediante menú contextual. Los medios se guardan entre sesiones.
// @author       Angel Desgarennes (Modificado por Asistente IA)
// @match        https://www.jw.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534107/Extractor%20Avanzado%20JWorg%20%28Men%C3%BA%20Contextual%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534107/Extractor%20Avanzado%20JWorg%20%28Men%C3%BA%20Contextual%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MEDIA_STORAGE_KEY = 'jwExtractorMediaLinks';

    // --- Helper Functions ---

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.log(`Extractor JW: Elemento "${selector}" no encontrado tras ${timeout}ms.`);
            }
        }, 500);
    }

    function showFloatingMessage(message) {
        const floatingMessage = document.createElement('div');
        Object.assign(floatingMessage.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: '#4a6da7', color: 'white', padding: '10px 20px',
            borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '10002', fontSize: '14px', transition: 'opacity 0.5s', opacity: '1'
        });
        floatingMessage.textContent = message;
        document.body.appendChild(floatingMessage);

        setTimeout(() => {
            floatingMessage.style.opacity = '0';
            setTimeout(() => floatingMessage.remove(), 500);
        }, 4000);
    }

    // --- LocalStorage Functions (using GM_ functions) ---

    async function getStoredMediaLinks() {
        const storedData = await GM_getValue(MEDIA_STORAGE_KEY, '[]');
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error("Extractor JW: Error parsing stored media links", e);
            return [];
        }
    }

    async function saveMediaLinks(linksArray) {
        await GM_setValue(MEDIA_STORAGE_KEY, JSON.stringify(linksArray));
    }

    async function addMediaLinks(newLinks) {
        let storedLinks = await getStoredMediaLinks();
        let addedCount = 0;
        newLinks.forEach(link => {
            if (link && !storedLinks.includes(link)) {
                storedLinks.push(link);
                addedCount++;
            }
        });
        await saveMediaLinks(storedLinks);
        return { updatedList: storedLinks, addedCount: addedCount };
    }

    async function clearMediaLinksStorage() {
        await GM_deleteValue(MEDIA_STORAGE_KEY);
    }

    // --- Extraction Logic ---

    function extractAssignments() {
        console.log("Extractor JW: Iniciando extracción de asignaciones...");
        const header = document.querySelector('header h1');
        const contentBody = document.querySelector('.contentBody');

        if (!header || !contentBody) {
            showFloatingMessage('No se encontraron elementos para extraer asignaciones en esta página.');
            return '';
        }

        const dateRegex = /(\d+ de \w+ a \d+ de \w+)|(\d+)-(\d+ de \w+)/;
        const dateMatch = header.textContent.match(dateRegex);
        let date = 'Fecha no encontrada';

        if (dateMatch) {
            if (dateMatch[1]) {
                date = dateMatch[1];
            } else if (dateMatch[2] && dateMatch[3]) {
                const monthYearMatch = header.textContent.match(/de (\w+ de \d{4})/);
                const monthYear = monthYearMatch ? monthYearMatch[1] : dateMatch[3];
                date = `${dateMatch[2]} al ${dateMatch[3].split(' ')[0]} de ${monthYear}`;
             }
        }


        const sections = ['TESOROS DE LA BIBLIA', 'SEAMOS MEJORES MAESTROS', 'NUESTRA VIDA CRISTIANA'];
        let extractedData = `Semana del ${date}\n`;
        let foundAssignments = false;

        sections.forEach(sectionTitle => {
            const sectionElements = Array.from(contentBody.querySelectorAll('h3, p, ul, li'));
            let currentSectionText = '';
            let inSection = false;

            for (const el of sectionElements) {
                const text = el.textContent.toUpperCase().trim();
                 if (text.includes(sectionTitle)) {
                    inSection = true;
                    currentSectionText += `${sectionTitle}\n`;
                 } else if (inSection && sections.some(s => text.includes(s) && s !== sectionTitle)) {
                    inSection = false;
                 } else if (inSection) {
                     const assignmentRegex = /^(.*?)\s+\((\d+ min?s?\.)\)/;
                     const itemText = el.textContent.trim();
                     const match = itemText.match(assignmentRegex);
                     if (match && match[1].length > 5) {
                         currentSectionText += `${match[1].trim()} (${match[2]})\n`;
                         foundAssignments = true;
                     }
                 }
            }
             extractedData += currentSectionText;
        });

        if (!foundAssignments && contentBody.textContent) {
             console.log("Extractor JW: Usando método alternativo de extracción de asignaciones (textContent).");
             extractedData = `Semana del ${date}\n`;
             let content = contentBody.textContent;
             sections.forEach(section => {
                 const sectionStart = content.toUpperCase().indexOf(section);
                 if (sectionStart !== -1) {
                     const nextSectionStart = sections
                         .map(sec => content.toUpperCase().indexOf(sec))
                         .filter(pos => pos > sectionStart && pos !== -1)
                         .sort((a, b) => a - b)[0] || content.length;

                     const sectionText = content.substring(sectionStart, nextSectionStart).trim();
                     const assignmentRegex = /^\s*([^(\n]+?)\s+\((\d+ min?s?\.)\)/gm;
                     let match;
                     let sectionHasAssignments = false;
                     let currentSectionOutput = `${section}\n`;

                     while ((match = assignmentRegex.exec(sectionText)) !== null) {
                         const assignmentText = match[1].trim().replace(/^[\d.\s-]+/, '');
                         if (assignmentText.length > 5) {
                             currentSectionOutput += `${assignmentText} (${match[2]})\n`;
                             sectionHasAssignments = true;
                         }
                     }
                     if (sectionHasAssignments) {
                          extractedData += currentSectionOutput + '';
                          foundAssignments = true;
                     }
                 }
             });
        }

        if (!foundAssignments) {
             showFloatingMessage('No se encontraron asignaciones con el formato esperado.');
             return `Semana del ${date}\n\n(No se encontraron asignaciones con formato reconocible.)`;
        }

        console.log("Extractor JW: Extracción de asignaciones completada.");
        return extractedData.trim();
    }

    // --- Función extractMediaLinks (incluye posters) ---
    async function extractMediaLinks() {
        console.log("Extractor JW: Iniciando extracción de medios...");
        let foundLinks = [];

        // 1. Extract Images
        console.log("Extractor JW: Buscando imágenes...");
        const imageContainers = document.querySelectorAll('article, .bodyTxt');
        imageContainers.forEach(container => {
             if (container.closest('.pageSectionContainer')) return;
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                 if (img.closest('.pageSectionContainer')) return;
                let src = img.src || img.dataset.src;
                if (src) {
                     try {
                        const absUrl = new URL(src, window.location.href).href;
                         foundLinks.push(absUrl);
                     } catch (e) { console.warn("Extractor JW: URL de imagen inválida:", src); }
                }
            });
        });

        // 2. Extract Video Posters
        console.log("Extractor JW: Buscando posters de video...");
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(videoEl => {
            if (videoEl.closest('.pageSectionContainer')) return;
            const posterUrl = videoEl.poster;
            if (posterUrl) {
                try {
                    const absPosterUrl = new URL(posterUrl, window.location.href).href;
                    foundLinks.push(absPosterUrl);
                    console.log("Extractor JW: Poster de video encontrado:", absPosterUrl);
                } catch (e) { console.warn("Extractor JW: URL de poster inválida:", posterUrl); }
            }
        });

        // 3. Extract Video Files (Highest Quality)
        console.log("Extractor JW: Buscando archivos de video (.mp4)...");
        const videoContainers = document.querySelectorAll('.mediaItemCard, .mediaItemShareDownload, article');
        const resolutionOrder = ['720p', '540p', '480p', '360p', '270p', '240p', '144p'];

        for (const container of videoContainers) {
             let bestVideoUrl = null;
             let bestResolutionIndex = resolutionOrder.length;
             if (container.closest('.pageSectionContainer')) continue; // Saltar contenedor excluido

             // A. Direct download links
             const downloadLinks = container.querySelectorAll('a[href*=".mp4"]');
             downloadLinks.forEach(link => {
                 if (link.closest('.pageSectionContainer')) return;
                const href = link.href;
                const linkText = link.textContent || '';
                for (let i = 0; i < resolutionOrder.length; i++) {
                    if ((linkText.includes(resolutionOrder[i]) || href.includes(resolutionOrder[i])) && i < bestResolutionIndex) {
                        bestResolutionIndex = i;
                        bestVideoUrl = href;
                        break;
                    }
                }
            });

            // B. Click simulation
             if (!bestVideoUrl && container.querySelector('[class*="jwi-cloud-arrow-down"]')) {
                 const downloadIcon = container.querySelector('[class*="jwi-cloud-arrow-down"]');
                 if (downloadIcon && !downloadIcon.closest('.pageSectionContainer')) {
                     console.log("Extractor JW: Intentando simular clic en icono de descarga...");
                     downloadIcon.click();
                     await new Promise(resolve => setTimeout(resolve, 1000));

                     const postClickLinks = document.querySelectorAll('.mediaItemDownloadOptions a[href*=".mp4"], .modal downloadItem a[href*=".mp4"]'); // Ajustar si es necesario
                     postClickLinks.forEach(link => {
                         const href = link.href;
                         const linkText = link.textContent || '';
                         for (let i = 0; i < resolutionOrder.length; i++) {
                              if ((linkText.includes(resolutionOrder[i]) || href.includes(resolutionOrder[i])) && i < bestResolutionIndex) {
                                 bestResolutionIndex = i;
                                 bestVideoUrl = href;
                                 break;
                              }
                         }
                     });
                     // Cerrar modal si es posible
                     const closeModalButton = document.querySelector('.modal .closeButton'); // Ajustar selector si es necesario
                      if (closeModalButton) {
                           console.log("Extractor JW: Cerrando modal de descarga...");
                           closeModalButton.click();
                           await new Promise(resolve => setTimeout(resolve, 300));
                      }
                     if (bestVideoUrl) console.log("Extractor JW: Video encontrado después del clic:", bestVideoUrl);
                 }
             }

            if (bestVideoUrl) {
                foundLinks.push(bestVideoUrl);
                console.log(`Extractor JW: Video seleccionado (${resolutionOrder[bestResolutionIndex]}):`, bestVideoUrl);
            }
        }

        // Add found links to storage
        const uniqueLinks = [...new Set(foundLinks)];
        const { updatedList, addedCount } = await addMediaLinks(uniqueLinks);

        if (addedCount > 0) {
            showFloatingMessage(`${addedCount} nuevo(s) enlace(s) de medios agregado(s). Total: ${updatedList.length}.`);
        } else {
             if (uniqueLinks.length === 0) {
                 showFloatingMessage('No se encontraron enlaces de medios (imágenes, posters, videos) en esta página.');
             } else {
                  showFloatingMessage('No se encontraron nuevos enlaces de medios para agregar a la lista.');
             }
        }

        console.log("Extractor JW: Extracción de medios completada.");
        return updatedList;
    }


    // --- Modal UI ---

    function showModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('jwExtractorModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'jwExtractorModalOverlay';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '10000', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });

        const modalBox = document.createElement('div');
        Object.assign(modalBox.style, {
            backgroundColor: 'white', padding: '25px', borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', width: '70%', maxWidth: '800px',
            maxHeight: '85%', display: 'flex', flexDirection: 'column', gap: '15px'
        });

        const title = document.createElement('h2');
        title.textContent = 'Extractor de Contenido JW.org';
        title.style.marginTop = '0';
        title.style.textAlign = 'center';
        title.style.color = '#333';

        const buttonGroup1 = document.createElement('div');
        buttonGroup1.style.display = 'flex';
        buttonGroup1.style.gap = '10px';
        buttonGroup1.style.justifyContent = 'center';

        const buttonGroup2 = document.createElement('div');
        buttonGroup2.style.display = 'flex';
        buttonGroup2.style.gap = '10px';
        buttonGroup2.style.justifyContent = 'center';
         buttonGroup2.style.marginTop = '10px';


        const textarea = document.createElement('textarea');
        textarea.id = 'jwExtractorTextarea';
        Object.assign(textarea.style, {
            width: '100%', height: '350px', fontFamily: 'monospace', fontSize: '13px',
            border: '1px solid #ccc', borderRadius: '5px', padding: '10px',
            boxSizing: 'border-box', resize: 'vertical'
        });

        // --- Buttons ---
         const baseButtonStyle = {
            padding: '10px 18px', border: 'none', borderRadius: '5px',
             cursor: 'pointer', color: 'white', fontWeight: 'bold', fontSize: '14px'
         };

        const extractAssignBtn = document.createElement('button');
         Object.assign(extractAssignBtn.style, baseButtonStyle, { backgroundColor: '#007bff' });
        extractAssignBtn.textContent = 'Extraer Asignaciones (Página Actual)';
        extractAssignBtn.onclick = () => {
            textarea.value = "Extrayendo asignaciones...";
            const assignments = extractAssignments();
             textarea.value = assignments || "No se pudieron extraer asignaciones.";
             textarea.scrollTop = 0; // Scroll to top
        };

        const extractMediaBtn = document.createElement('button');
         Object.assign(extractMediaBtn.style, baseButtonStyle, { backgroundColor: '#28a745' });
        extractMediaBtn.textContent = 'Extraer Medios (Página Actual)';
        extractMediaBtn.onclick = async () => {
            textarea.value = "Extrayendo enlaces de medios y actualizando lista...";
            const mediaLinks = await extractMediaLinks();
             textarea.value = mediaLinks.join('\n');
             textarea.scrollTop = textarea.scrollHeight; // Scroll to bottom
        };

        const copyButton = document.createElement('button');
         Object.assign(copyButton.style, baseButtonStyle, { backgroundColor: '#17a2b8' });
        copyButton.textContent = 'Copiar Contenido';
        copyButton.onclick = () => {
            if (textarea.value) {
                navigator.clipboard.writeText(textarea.value).then(() => {
                    showFloatingMessage('Contenido copiado al portapapeles');
                }).catch(err => {
                    console.error('Extractor JW: Error al copiar:', err);
                     showFloatingMessage('Error al copiar texto.');
                    try {
                        textarea.select();
                        document.execCommand('copy');
                        showFloatingMessage('Contenido copiado (método alternativo).');
                    } catch (e) {
                        console.error('Extractor JW: Fallback execCommand también falló:', e);
                         showFloatingMessage('Error al copiar texto (ambos métodos).');
                    }
                });
            } else {
                showFloatingMessage('No hay contenido para copiar.');
            }
        };

        const clearMediaButton = document.createElement('button');
         Object.assign(clearMediaButton.style, baseButtonStyle, { backgroundColor: '#ffc107', color: '#333'});
        clearMediaButton.textContent = 'Borrar Lista de Medios';
        clearMediaButton.onclick = async () => {
             await clearMediaLinksStorage();
             textarea.value = '';
             showFloatingMessage('Lista de medios borrada.');
        };

        const closeButton = document.createElement('button');
        Object.assign(closeButton.style, baseButtonStyle, { backgroundColor: '#dc3545' });
        closeButton.textContent = 'Cerrar';
        closeButton.onclick = () => modalOverlay.remove();

        // --- Assemble Modal ---
        buttonGroup1.appendChild(extractAssignBtn);
        buttonGroup1.appendChild(extractMediaBtn);
        buttonGroup2.appendChild(copyButton);
        buttonGroup2.appendChild(clearMediaButton);
        buttonGroup2.appendChild(closeButton);

        modalBox.appendChild(title);
        modalBox.appendChild(buttonGroup1);
        modalBox.appendChild(textarea);
        modalBox.appendChild(buttonGroup2);
        modalOverlay.appendChild(modalBox);

        modalOverlay.onclick = (event) => {
             if (event.target === modalOverlay) {
                 modalOverlay.remove();
             }
         };

        document.body.appendChild(modalOverlay);

        // Load initial media list into textarea when modal opens
        getStoredMediaLinks().then(links => {
            textarea.value = links.join('\n');
            console.log(`Extractor JW: Modal abierto. ${links.length} medios cargados desde localStorage.`);
            textarea.scrollTop = textarea.scrollHeight; // Scroll to bottom
        });
    }

    // --- Initialization ---
    // Registra el comando en el menú contextual
    GM_registerMenuCommand("Abrir Extractor JW.org", showModal, 'j'); // 'j' como tecla de acceso (puede variar)

    console.log("Extractor JW: Comando de menú contextual registrado. Haz clic derecho para 'Abrir Extractor JW.org'.");

})();
