// ==UserScript==
// @name         Wplace Overlay
// @namespace    https://github.com/FrodoCompacto
// @version      1.4
// @description  Permite escolher, mover, redimensionar, fixar e salvar overlay personalizado no wplace.live com slider de opacidade.
// @match        https://wplace.live//
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live//
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545191/Wplace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/545191/Wplace%20Overlay.meta.js
// ==/UserScript==

let overlayMode = localStorage.getItem("overlayMode") || "over";
let opacityValue = localStorage.getItem("overlayOpacity") || "1.0";
let isLocked = localStorage.getItem("isLocked") === "true";
let overlayImg = null;
let originalWidth = 300;
let originalHeight = 300;

function createOverlayImage(url) {
    if (!overlayImg) {
        overlayImg = document.createElement("img");
        overlayImg.id = "custom-overlay";
        overlayImg.style.position = "absolute";
        overlayImg.style.top = localStorage.getItem("overlayTop") || "0px";
        overlayImg.style.left = localStorage.getItem("overlayLeft") || "0px";
        overlayImg.style.pointerEvents = isLocked ? "none" : "auto";
        overlayImg.style.zIndex = "9999";
        overlayImg.style.resize = isLocked ? "none" : "both";
        overlayImg.style.overflow = "auto";
        overlayImg.style.cursor = isLocked ? "default" : "move";
        overlayImg.draggable = false;

        enableDragging(overlayImg);
        enableResizePersistence(overlayImg);
        document.body.appendChild(overlayImg);
    }

    overlayImg.onload = () => {
        originalWidth = overlayImg.naturalWidth;
        originalHeight = overlayImg.naturalHeight;

        const savedRatio = parseFloat(localStorage.getItem("overlayRatio"));
        if (!isNaN(savedRatio)) {
            overlayImg.style.width = originalWidth * savedRatio + "px";
            overlayImg.style.height = originalHeight * savedRatio + "px";
        } else {
            overlayImg.style.width = localStorage.getItem("overlayWidth") || "300px";
            overlayImg.style.height = localStorage.getItem("overlayHeight") || "300px";
        }
    };

    overlayImg.src = url;
    overlayImg.style.mixBlendMode = overlayMode === "aus" ? "normal" : overlayMode;
    overlayImg.style.opacity = opacityValue;
    localStorage.setItem("overlayImage", url);
}

function enableDragging(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    element.addEventListener("mousedown", (e) => {
        if (isLocked) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(element.style.left) || 0;
        startTop = parseInt(element.style.top) || 0;
        e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging || isLocked) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.left = `${startLeft + dx}px`;
        element.style.top = `${startTop + dy}px`;
    });

    window.addEventListener("mouseup", () => {
        if (overlayImg) {
            localStorage.setItem("overlayLeft", overlayImg.style.left);
            localStorage.setItem("overlayTop", overlayImg.style.top);
        }
        isDragging = false;
    });
}

function enableResizePersistence(element) {
    new ResizeObserver(() => {
        localStorage.setItem("overlayWidth", element.style.width);
        localStorage.setItem("overlayHeight", element.style.height);
    }).observe(element);
}

function patchUI() {
    if (document.getElementById("overlay-container")) return;

    const container = document.createElement("div");
    container.id = "overlay-container";
    container.style.position = "absolute";
    container.style.top = "50%";
    container.style.transform = "translateY(-50%)";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "6px";
    container.style.fontFamily = "sans-serif";
    container.style.color = "white";

    const btn = (text, onclick) => {
        const b = document.createElement("button");
        b.textContent = text;
        b.onclick = onclick;
        b.style.backgroundColor = "#0e0e0e7f";
        b.style.color = "white";
        b.style.border = "solid 1px #1d1d1d7f";
        b.style.borderRadius = "4px";
        b.style.padding = "5px 10px";
        b.style.cursor = "pointer";
        b.style.backdropFilter = "blur(2px)";
        return b;
    };

    const blendBtn = btn(`Modo: ${overlayMode}`, () => {
        const modos = ["aus", "over", "difference", "out"];
        overlayMode = modos[(modos.indexOf(overlayMode) + 1) % modos.length];
        blendBtn.textContent = `Modo: ${overlayMode}`;
        if (overlayImg) overlayImg.style.mixBlendMode = overlayMode === "aus" ? "normal" : overlayMode;
        localStorage.setItem("overlayMode", overlayMode);
    });

    const opacityContainer = document.createElement("div");
    opacityContainer.style.display = "flex";
    opacityContainer.style.flexDirection = "column";
    opacityContainer.style.gap = "4px";
    opacityContainer.style.backgroundColor = "#0e0e0e7f";
    opacityContainer.style.padding = "5px";
    opacityContainer.style.borderRadius = "4px";
    opacityContainer.style.border = "solid 1px #1d1d1d7f";
    opacityContainer.style.backdropFilter = "blur(2px)";


    const opacityLabel = document.createElement("label");
    opacityLabel.textContent = `Opacidade: ${Math.round(parseFloat(opacityValue) * 100)}%`;
    opacityLabel.style.textAlign = "center";
    opacityLabel.style.fontSize = "12px";

    const opacitySlider = document.createElement("input");
    opacitySlider.type = "range";
    opacitySlider.min = "0";
    opacitySlider.max = "1";
    opacitySlider.step = "0.01";
    opacitySlider.value = opacityValue;
    opacitySlider.style.width = "100%";

    opacitySlider.oninput = (e) => {
        opacityValue = e.target.value;
        opacityLabel.textContent = `Opacidade: ${Math.round(parseFloat(opacityValue) * 100)}%`;
        if (overlayImg) {
            overlayImg.style.opacity = opacityValue;
        }
        localStorage.setItem("overlayOpacity", opacityValue);
    };

    opacityContainer.append(opacityLabel, opacitySlider);

    const lockBtn = btn(isLocked ? "🔒 Bloqueado" : "🔓 Editável", () => {
        isLocked = !isLocked;
        lockBtn.textContent = isLocked ? "🔒 Bloqueado" : "🔓 Editável";
        if (overlayImg) {
            overlayImg.style.pointerEvents = isLocked ? "none" : "auto";
            overlayImg.style.cursor = isLocked ? "default" : "move";
            overlayImg.style.resize = isLocked ? "none" : "both";
        }
        localStorage.setItem("isLocked", isLocked);
    });

    const resetBtn = btn("Redefinir Overlay", () => {
        localStorage.clear();
        if (overlayImg) overlayImg.remove();
        overlayImg = null;
        alert("Overlay removido e configurações resetadas.");
        location.reload();
    });

    const centerBtn = btn("Centralizar na tela", () => {
        if (overlayImg) {
            overlayImg.style.left = `${(window.innerWidth - overlayImg.offsetWidth) / 2}px`;
            overlayImg.style.top = `${(window.innerHeight - overlayImg.offsetHeight) / 2}px`;
            localStorage.setItem("overlayLeft", overlayImg.style.left);
            localStorage.setItem("overlayTop", overlayImg.style.top);
        }
    });

    const sizeContainer = document.createElement("div");
    sizeContainer.style.display = "flex";
    sizeContainer.style.flexDirection = "column";
    sizeContainer.style.gap = "4px";
    // --- CORREÇÃO DE CONTRASTE ADICIONADA AQUI ---
    sizeContainer.style.backgroundColor = "#0e0e0e7f";
    sizeContainer.style.padding = "8px"; // Um pouco mais de espaço interno
    sizeContainer.style.borderRadius = "4px";
    sizeContainer.style.border = "solid 1px #1d1d1d7f";
    sizeContainer.style.backdropFilter = "blur(2px)";
    // --- FIM DA CORREÇÃO ---


    // Tamanho manual
    const manualSizeRow = document.createElement("div");
    manualSizeRow.style.display = "flex";
    manualSizeRow.style.gap = "4px";
    manualSizeRow.style.alignItems = "center";

    const widthInput = document.createElement("input");
    widthInput.type = "number";
    widthInput.placeholder = "Largura";
    widthInput.style.width = "80px";

    const heightInput = document.createElement("input");
    heightInput.type = "number";
    heightInput.placeholder = "Altura";
    heightInput.style.width = "80px";

    const applySizeBtn = btn("Aplicar", () => {
        if (overlayImg) {
            if (widthInput.value) overlayImg.style.width = widthInput.value + "px";
            if (heightInput.value) overlayImg.style.height = heightInput.value + "px";
            localStorage.setItem("overlayWidth", overlayImg.style.width);
            localStorage.setItem("overlayHeight", overlayImg.style.height);
        }
    });
    manualSizeRow.append("Px:", widthInput, heightInput, applySizeBtn);

    // Escala por ratio fixo
    const ratioRow = document.createElement("div");
    ratioRow.style.display = "flex";
    ratioRow.style.gap = "4px";
    ratioRow.style.alignItems = "center";

    const ratioInput = document.createElement("input");
    ratioInput.type = "number";
    ratioInput.placeholder = "Escala";
    ratioInput.step = "0.1";
    ratioInput.style.width = "60px";

    const ratioBtn = btn("Aplicar", () => {
        if (overlayImg && ratioInput.value) {
            const ratio = parseFloat(ratioInput.value);
            overlayImg.style.width = (originalWidth * ratio) + "px";
            overlayImg.style.height = (originalHeight * ratio) + "px";
            localStorage.setItem("overlayWidth", overlayImg.style.width);
            localStorage.setItem("overlayHeight", overlayImg.style.height);
            localStorage.setItem("overlayRatio", ratio);
        }
    });
    ratioRow.append("Escala:", ratioInput, ratioBtn);

    const restoreSizeBtn = btn("Tamanho Original", () => {
        if (overlayImg) {
            overlayImg.style.width = originalWidth + "px";
            overlayImg.style.height = originalHeight + "px";
            localStorage.setItem("overlayWidth", overlayImg.style.width);
            localStorage.setItem("overlayHeight", overlayImg.style.height);
            localStorage.removeItem("overlayRatio");
            ratioInput.value = "1";
        }
    });

    sizeContainer.append(manualSizeRow, ratioRow, restoreSizeBtn);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => createOverlayImage(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadBtn = btn("Escolher Imagem", () => fileInput.click());

    container.append(fileInput, uploadBtn, blendBtn, opacityContainer, lockBtn, centerBtn, sizeContainer, resetBtn);
    document.body.appendChild(container);

    setTimeout(() => {
        if (overlayImg) {
            widthInput.value = parseInt(overlayImg.style.width) || 300;
            heightInput.value = parseInt(overlayImg.style.height) || 300;
        }
        ratioInput.value = localStorage.getItem("overlayRatio") || "1";
    }, 500);
}

const observer = new MutationObserver(() => patchUI());
observer.observe(document.body, { childList: true, subtree: true });
patchUI();

const savedImage = localStorage.getItem("overlayImage");
if (savedImage) {
    createOverlayImage(savedImage);
}