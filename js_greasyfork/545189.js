// ==UserScript==
// @name         Overlay c/ Paleta Manual V13 (Minimizável)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  Adiciona a funcionalidade de minimizar e maximizar a barra lateral de cores.
// @author       Víkish (com modificações de Gemini)
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partidomissao.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545189/Overlay%20c%20Paleta%20Manual%20V13%20%28Minimiz%C3%A1vel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545189/Overlay%20c%20Paleta%20Manual%20V13%20%28Minimiz%C3%A1vel%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // #####################################################################
    // ##### EDITE SUA PALETA DE CORES FIXA AQUI #####
    // #####################################################################
    const PALETA_DE_CORES_FIXA = [
        { nome: "Mostrar Todos", valor: 'all', rgb: 'all' },
        { nome: "Preto", valor: [0, 0, 0], rgb: "rgb(0, 0, 0)" },
        { nome: "Cinza Escuro", valor: [60, 60, 60], rgb: "rgb(60, 60, 60)" },
        { nome: "Marrom Escuro", valor: [104, 70, 52], rgb: "rgb(104, 70, 52)" },
        { nome: "Marrom", valor: [149, 104, 42], rgb: "rgb(149, 104, 42)" },
        { nome: "Cinza", valor: [120, 120, 120], rgb: "rgb(120, 120, 120)" },
        { nome: "Pele", valor: [248, 178, 119], rgb: "rgb(248, 178, 119)" },
        { nome: "Amarelo Queimado", valor: [246, 170, 9], rgb: "rgb(246, 170, 9)" },
        { nome: "Rosa Claro", valor: [243, 141, 169], rgb: "rgb(243, 141, 169)" },
        { nome: "Creme", valor: [255, 250, 188], rgb: "rgb(255, 250, 188)" },
        { nome: "Vinho", valor: [96, 0, 24], rgb: "rgb(96, 0, 24)" },
        { nome: "Cinza Claro", valor: [210, 210, 210], rgb: "rgb(210, 210, 210)" },
        { nome: "Amarelo", valor: [249, 221, 59], rgb: "rgb(249, 221, 59)" },
        { nome: "Branco", valor: [255, 255, 255], rgb: "rgb(255, 255, 255)" },
        { nome: "Azul Escuro", valor: [40, 80, 158], rgb: "rgb(40, 80, 158)" },
        { nome: "Laranja", valor: [255, 127, 39], rgb: "rgb(255, 127, 39)" },
        { nome: "Laranja Escuro", valor: [227, 129, 17], rgb: "rgb(227, 129, 17)" },
        { nome: "Vermelho", valor: [237, 28, 36], rgb: "rgb(237, 28, 36)" },
        { nome: "Magenta", valor: [236, 31, 128], rgb: "rgb(236, 31, 128)" },
        { nome: "Roxo", valor: [107, 80, 246], rgb: "rgb(107, 80, 246)" },
        { nome: "Lilás", valor: [153, 177, 251], rgb: "rgb(153, 177, 251)" },
        { nome: "Azul", valor: [64, 147, 228], rgb: "rgb(64, 147, 228)" },
        { nome: "Verde Limão", valor: [135, 255, 94], rgb: "rgb(135, 255, 94)" },
    ];
    // #####################################################################


    const CORRECT_PIXEL_COLOR = [0, 255, 0, 255];
    const OVERLAY_MODES = ["overlay", "original", "chunks"];
    let overlayMode = OVERLAY_MODES[0];
    let isSidebarMinimized = false;

    const selectedColors = new Set();
    const missions = await fetchData();
    const colorCounters = {};
    const workingPalette = PALETA_DE_CORES_FIXA;

    workingPalette.forEach(p => {
        if (p.valor !== 'all') {
            colorCounters[p.rgb] = { wrongPixelsInChunk: 0, totalPixelsInChunk: 0 };
        }
        selectedColors.add(p.rgb);
    });

    console.log("Pré-processando gabarito (quantização para paleta fixa)...");
    for (const mission of missions) {
        mission.quantizedImageData = await quantizeImage(mission.imageData, workingPalette);
    }
    console.log("Pré-processamento concluído.");

    // --- UI (Interface do Usuário) ---
    createPaletteSidebar(workingPalette);
    const counterContainer = document.createElement("div");
    Object.assign(counterContainer.style, { position: "fixed", top: "5px", left: "50%", transform: "translateX(-50%)", zIndex: "1000", padding: "6px 10px", fontSize: "12px", fontFamily: "Arial, sans-serif", backgroundColor: "#000a", color: "white", borderRadius: "6px", pointerEvents: "none", backdropFilter: "blur(3px)", lineHeight: "1.4" });
    document.body.appendChild(counterContainer);
    const pixelCounter = document.createElement("div");
    counterContainer.appendChild(pixelCounter);
    const percentageCounter = document.createElement("div");
    counterContainer.appendChild(percentageCounter);
    patchModeButtonUI();


    // --- Lógica Principal (Proxy para interceptar o 'fetch') ---
    fetch = new Proxy(fetch, {
        apply: async (target, thisArg, argList) => {
            const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];
            let url;
            try { url = new URL(urlString); } catch (e) { return target.apply(thisArg, argList); }

            if (overlayMode === 'overlay' && url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
                const relevantMissions = missions.filter(m => url.pathname.endsWith(`/${m.chunk[0]}/${m.chunk[1]}.png`));
                if (relevantMissions.length > 0) {
                    const originalResponse = await target.apply(thisArg, argList);
                    const originalBlob = await originalResponse.blob();
                    const originalImage = await blobToImage(originalBlob);
                    const { width, height } = originalImage;
                    const canvas = new OffscreenCanvas(width, height);
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });
                    ctx.drawImage(originalImage, 0, 0, width, height);
                    const originalData = ctx.getImageData(0, 0, width, height);
                    const resultData = ctx.getImageData(0, 0, width, height);
                    const combinedTemplate = await getCombinedTemplateForChunk(relevantMissions, width, height);
                    processPixels(originalData, combinedTemplate, resultData);
                    updateCountersUI();
                    ctx.putImageData(resultData, 0, 0);
                    const mergedBlob = await canvas.convertToBlob();
                    return new Response(mergedBlob, { headers: { "Content-Type": "image/png" } });
                }
            } else if (overlayMode === 'chunks' && url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
                const CHUNK_WIDTH = 1000, CHUNK_HEIGHT = 1000;
                const parts = url.pathname.split("/");
                const [chunk1, chunk2] = [parts.at(-2), parts.at(-1).split(".")[0]];
                const canvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);
                const ctx = canvas.getContext("2d");
                ctx.strokeStyle = 'red'; ctx.lineWidth = 2;
                ctx.strokeRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
                ctx.font = '40px Arial'; ctx.fillStyle = 'red';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(`${chunk1}, ${chunk2}`, CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2);
                const mergedBlob = await canvas.convertToBlob();
                return new Response(mergedBlob, { headers: { "Content-Type": "image/png" } });
            }
            return target.apply(thisArg, argList);
        }
    });


    // --- FUNÇÕES ---

    function colorDistance(rgb1, rgb2) {
        return Math.sqrt(Math.pow(rgb1[0] - rgb2[0], 2) + Math.pow(rgb1[1] - rgb2[1], 2) + Math.pow(rgb1[2] - rgb2[2], 2));
    }

    function findClosestPaletteColor(rgb, palette) {
        let minDistance = Infinity;
        let closestColor = null;
        const paletteColors = palette.filter(p => p.valor !== 'all');
        for (const pColor of paletteColors) {
            const dist = colorDistance(rgb, pColor.valor);
            if (dist < minDistance) {
                minDistance = dist;
                closestColor = pColor.valor;
            }
        }
        return closestColor;
    }

    async function quantizeImage(imageData, palette) {
        const quantizedData = new ImageData(imageData.width, imageData.height);
        const data = imageData.data;
        const qData = quantizedData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) {
                const pixelRgb = [data[i], data[i + 1], data[i + 2]];
                const closestColor = findClosestPaletteColor(pixelRgb, palette);
                if (closestColor) {
                    qData[i] = closestColor[0];
                    qData[i + 1] = closestColor[1];
                    qData[i + 2] = closestColor[2];
                    qData[i + 3] = 255;
                }
            }
        }
        return quantizedData;
    }

    async function getCombinedTemplateForChunk(relevantMissions, width, height) {
        const combinedTemplate = new OffscreenCanvas(width, height).getContext('2d').getImageData(0, 0, width, height);
        for (const mission of relevantMissions) {
            const templateCanvas = new OffscreenCanvas(1000, 1000);
            templateCanvas.getContext('2d').putImageData(mission.quantizedImageData, 0, 0);
            const missionImg = await blobToImage(await templateCanvas.convertToBlob());
            const finalCanvas = new OffscreenCanvas(width, height);
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.drawImage(missionImg, mission.coords[0], mission.coords[1]);
            const missionData = finalCtx.getImageData(0, 0, width, height).data;
            for (let i = 0; i < missionData.length; i += 4) {
                if (missionData[i + 3] > 0) {
                    combinedTemplate.data[i] = missionData[i];
                    combinedTemplate.data[i + 1] = missionData[i + 1];
                    combinedTemplate.data[i + 2] = missionData[i + 2];
                    combinedTemplate.data[i + 3] = missionData[i + 3];
                }
            }
        }
        return combinedTemplate;
    }


    function processPixels(original, template, result) {
        const d1 = original.data, d2 = template.data, dr = result.data;
        for (const key in colorCounters) {
            colorCounters[key].wrongPixelsInChunk = 0;
            colorCounters[key].totalPixelsInChunk = 0;
        }
        for (let i = 0; i < d1.length; i += 4) {
            if (d2[i + 3] > 0) {
                const templateColorRgb = `rgb(${d2[i]}, ${d2[i+1]}, ${d2[i+2]})`;
                const isSelected = selectedColors.has('all') || selectedColors.has(templateColorRgb);
                const isCorrect = d1[i] === d2[i] && d1[i + 1] === d2[i + 1] && d1[i + 2] === d2[i + 2];
                if (colorCounters[templateColorRgb]) {
                    colorCounters[templateColorRgb].totalPixelsInChunk++;
                    if (!isCorrect) {
                        colorCounters[templateColorRgb].wrongPixelsInChunk++;
                    }
                }
                if (isSelected) {
                    if (isCorrect) {
                        [dr[i], dr[i + 1], dr[i + 2], dr[i+3]] = CORRECT_PIXEL_COLOR;
                    } else {
                        dr[i] = d2[i]; dr[i + 1] = d2[i + 1]; dr[i + 2] = d2[i + 2]; dr[i + 3] = 255;
                    }
                } else {
                    [dr[i], dr[i + 1], dr[i + 2], dr[i+3]] = CORRECT_PIXEL_COLOR;
                }
            }
        }
    }


    async function fetchData() {
        const response = await fetch("https://gist.githubusercontent.com/yl99a/45ec3df57cc75c4b93c45251b87eb20b/raw/overlays.json?" + Date.now());
        const missionsData = await response.json();
        for(const mission of missionsData) {
            const { img, width, height } = await loadImage(mission.url);
            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            mission.imageData = ctx.getImageData(0, 0, width, height);
        }
        return missionsData;
    }


    function createPaletteSidebar(palette) {
        const sidebar = document.createElement("div");
        sidebar.id = "overlay-sidebar";
        Object.assign(sidebar.style, {
            position: "fixed", top: "70px", left: "10px", zIndex: "1000",
            backgroundColor: "#000000bb", color: "white", borderRadius: "8px",
            padding: "10px", fontFamily: "Arial, sans-serif", fontSize: "14px",
            backdropFilter: "blur(5px)", transition: "min-width 0.2s"
        });

        // --- CABEÇALHO DA SIDEBAR ---
        const header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #ffffff33'
        });

        const title = document.createElement('h3');
        title.textContent = "Paleta de Cores";
        Object.assign(title.style, { margin: 0, fontSize: '16px' });

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '–'; // Símbolo de minimizar
        Object.assign(toggleButton.style, {
            background: 'none', border: '1px solid #fff5', color: 'white',
            cursor: 'pointer', fontSize: '18px', width: '24px', height: '24px',
            borderRadius: '4px', lineHeight: '20px', padding: '0'
        });

        header.appendChild(title);
        header.appendChild(toggleButton);
        sidebar.appendChild(header);

        // --- CONTEÚDO DA SIDEBAR (LISTA DE CORES) ---
        const content = document.createElement('div');
        content.id = "sidebar-content";
        Object.assign(content.style, {
            maxHeight: "calc(100vh - 250px)", overflowY: "auto"
        });

        toggleButton.addEventListener('click', () => {
            isSidebarMinimized = !isSidebarMinimized;
            if (isSidebarMinimized) {
                content.style.display = 'none';
                toggleButton.textContent = '+';
                sidebar.style.minWidth = 'auto';
            } else {
                content.style.display = 'block';
                toggleButton.textContent = '–';
            }
        });


        const colorCheckboxes = [];
        const masterCheckboxContainer = document.createElement("input");

        palette.forEach((pColor, index) => {
            const entryDiv = document.createElement("div");
            Object.assign(entryDiv.style, { marginBottom: "8px", display: "flex", alignItems: "center" });
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox"; checkbox.checked = true; checkbox.id = `color-checkbox-${index}`;
            Object.assign(checkbox.style, { marginRight: "8px", cursor: "pointer" });
            let labelContent;
            if (pColor.valor === 'all') {
                labelContent = pColor.nome;
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedColors.add('all');
                        colorCheckboxes.forEach(cb => { cb.checked = true; if (!selectedColors.has(cb.dataset.rgb)) selectedColors.add(cb.dataset.rgb); });
                    } else {
                        selectedColors.clear();
                        colorCheckboxes.forEach(cb => { cb.checked = false; });
                    }
                });
                Object.assign(masterCheckboxContainer, checkbox);
            } else {
                const colorBox = document.createElement("div");
                Object.assign(colorBox.style, { width: "20px", height: "20px", backgroundColor: pColor.rgb, border: "1px solid #fff5", marginRight: "8px", borderRadius: "4px" });
                entryDiv.appendChild(colorBox);
                labelContent = pColor.nome;
                checkbox.dataset.rgb = pColor.rgb;
                colorCheckboxes.push(checkbox);
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) { selectedColors.add(pColor.rgb); }
                    else { selectedColors.delete(pColor.rgb); selectedColors.delete('all'); }
                    masterCheckboxContainer.checked = colorCheckboxes.every(cb => cb.checked);
                    if(masterCheckboxContainer.checked) selectedColors.add('all');
                });
            }
            const label = document.createElement("label");
            label.htmlFor = `color-checkbox-${index}`; label.textContent = labelContent;
            Object.assign(label.style, { cursor: "pointer", flexGrow: "1", fontSize: "12px" });
            entryDiv.appendChild(checkbox);
            entryDiv.appendChild(label);
            if(pColor.valor !== 'all') {
                const counterSpan = document.createElement("span");
                counterSpan.id = `counter-span-${pColor.rgb}`; counterSpan.textContent = "Faltam: 0";
                Object.assign(counterSpan.style, { marginLeft: "10px", backgroundColor: "#ffffff22", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" });
                entryDiv.appendChild(counterSpan);
            }
            content.appendChild(entryDiv);
        });
        sidebar.appendChild(content);
        document.body.appendChild(sidebar);
    }

    function updateCountersUI() {
        let totalWrong = 0, totalPixels = 0;
        for (const rgb in colorCounters) {
            const data = colorCounters[rgb];
            const span = document.getElementById(`counter-span-${rgb}`);
            if (span) { span.textContent = `Faltam: ${data.wrongPixelsInChunk || 0}`; }
            if (selectedColors.has('all') || selectedColors.has(rgb)) {
                totalWrong += data.wrongPixelsInChunk || 0;
                totalPixels += data.totalPixelsInChunk || 0;
            }
        }
        pixelCounter.textContent = `Total selecionado: ${totalWrong}`;
        const percentage = totalPixels === 0 ? 100 : (((totalPixels - totalWrong) / totalPixels) * 100).toFixed(2).replace(".", ",");
        percentageCounter.textContent = `Progresso: ${percentage}%`;
    }

    function patchModeButtonUI() {
        if (document.getElementById("overlay-mode-button")) return;
        let modeButton = document.createElement("button");
        modeButton.id = "overlay-mode-button";
        modeButton.textContent = "Modo: " + overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);
        Object.assign(modeButton.style, { backgroundColor: "#0e0e0e7f", color: "white", border: "solid", borderColor: "#1d1d1d7f", borderRadius: "4px", padding: "5px 10px", cursor: "pointer", backdropFilter: "blur(2px)" });
        modeButton.addEventListener("click", () => {
            overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];
            modeButton.textContent = "Modo: " + overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);
        });
        const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");
        if (buttonContainer) {
            buttonContainer.appendChild(modeButton);
            buttonContainer.classList.remove("items-center");
            buttonContainer.classList.add("items-end");
        }
    }

    // --- Funções Auxiliares ---
    async function loadImage(src) { return new Promise((resolve) => { const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => resolve({ img, width: img.naturalWidth, height: img.naturalHeight }); img.src = src; }); }
    async function blobToImage(blob) { return new Promise((resolve) => { const img = new Image(); img.onload = () => resolve(img); img.src = URL.createObjectURL(blob); }); }

    const observer = new MutationObserver(() => {
        patchModeButtonUI();
    });
    const interval = setInterval(() => {
        const targetNode = document.querySelector("div.gap-4:nth-child(1)");
        if (targetNode) {
            clearInterval(interval);
            observer.observe(targetNode, { childList: true, subtree: true });
            patchModeButtonUI();
        }
    }, 500);

})();