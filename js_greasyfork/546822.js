// ==UserScript==
// @name         MegamiDeviceBP - EnglishTranslationScript
// @namespace    http://tampermonkey.net/
// @version      4.3.1
// @description  Text blocks for param01-10 with universal bg; swap bpp.png to English version; swap chart_bg.png; add tooltips; update page title
// @match        https://user.kotobukiya.co.jp/megamideviceBP/*
// @grant        none
// @run-at       document-start
// @author       Animal22
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546822/MegamiDeviceBP%20-%20EnglishTranslationScript.user.js
// @updateURL https://update.greasyfork.org/scripts/546822/MegamiDeviceBP%20-%20EnglishTranslationScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------- Update Page Title ----------------
    document.title = "Megami Device Battle Point Display Program";

    // ---------------- Chart logic ----------------
    const CHART_NEEDLE = 'chart_bg.png';
    const CHART_REPLACEMENT = 'https://i.postimg.cc/13Z3vq2K/chart.png';
    const replacementChartImg = new Image();
    replacementChartImg.src = CHART_REPLACEMENT;

    const imgDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
        configurable: true,
        enumerable: imgDesc.enumerable,
        get: imgDesc.get,
        set(url) {
            if (typeof url === 'string' && url.includes(CHART_NEEDLE)) url = CHART_REPLACEMENT;
            return imgDesc.set.call(this, url);
        }
    });

    const _setAttr = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'src' && typeof value === 'string' && value.includes(CHART_NEEDLE)) {
            value = CHART_REPLACEMENT;
        }
        return _setAttr.call(this, name, value);
    };

    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function(...args) {
        try {
            let img = args[0];
            if (img && img.src && img.src.includes(CHART_NEEDLE)) {
                args[0] = replacementChartImg;
            }
        } catch (e) {}
        return originalDrawImage.apply(this, args);
    };

    // ---------------- Translate logic ----------------
    const replacements = {
        "param01.png": "Short-Range Attack",
        "param02.png": "Mid-Range Attack",
        "param03.png": "Long-Range Attack",
        "param04.png": "Armor/Defense",
        "param05.png": "Weight",
        "param06.png": "Endurance",
        "param07.png": "Stealth",
        "param08.png": "Search",
        "param09.png": "Aerial Mobility",
        "param10.png": "Ground Mobility"
    };

    const explanations = {
        "param01.png": "This parameter reflects attack power and proficiency with melee weapons such as swords and maces.",
        "param02.png": "This parameter reflects attack power and proficiency with projectile weapons such as handguns and rifles.",
        "param03.png": "This parameter reflects attack power and proficiency with long-range guided weapons such as sniper rifles and missiles.",
        "param04.png": "This parameter reflects defensive power obtained through the use of armor and shields.",
        "param05.png": "This parameter reflects the overall weight of the weapons and armor equipped to the Megami. It also includes the weight of machines such as vehicles. The heavier a device becomes, the more its mobility and endurance parameters will decrease.",
        "param06.png": "This parameter reflects the overall length of time a Megami can participate in battle. Once a Megami’s energy stores are depleted, the unit will become unable to move. A Megami’s endurance will decrease depending on the device’s weight and the energy consumption of the weapons used, but it is also possible to increase the endurance parameter with spare energy packs.",
        "param07.png": "This parameter reflects the device’s ability to avoid enemy detection. Stealth can be improved by painting a device with camouflage to match a particular battlefield. Armor and weapons with bold coloring that emit bright light or loud sounds will decrease this parameter.",
        "param08.png": "This parameter reflects the device’s ability to locate enemy targets. Parts such as sensors, telescopic cameras, and surveillance units will increase this parameter.",
        "param09.png": "This parameter reflects the ability to move through the air through the use of parts such as wings or levitation devices.",
        "param10.png": "This parameter reflects the ability to move on the ground and can be improved through the use of special boots, vehicles, and caterpillar treads. Hover capabilities also fall under this parameter."
};

    const textColor = "#e58801";
    const backgroundColor = "#535353";
    const blockWidth = "434px";
    const padding = "4px 8px";
    const borderRadius = "0";
    const backgroundImageURL = "https://i.postimg.cc/Mp4VmjL5/param.png";
    const bppReplacementURL = "https://i.postimg.cc/4dJcfCF7/Header.png";

    function filenameFromURL(u) {
        if (!u) return "";
        const clean = u.split("#")[0].split("?")[0];
        return clean.split("/").pop() || "";
    }

    function replaceTranslateImages(root = document) {
        root.querySelectorAll("img").forEach(img => {
            if (img.dataset.replaced === "true") return;

            const candidates = [img.getAttribute("src"), img.getAttribute("data-src"), img.src].filter(Boolean);

            for (const s of candidates) {
                const file = filenameFromURL(s);

                // param01–param10 → text block with tooltip
                if (replacements[file]) {
                    const span = document.createElement("span");
                    span.textContent = replacements[file];
                    span.title = explanations[file]; // Tooltip added
                    span.style.color = textColor;
                    span.style.backgroundColor = backgroundColor;
                    span.style.padding = padding;
                    span.style.borderRadius = borderRadius;
                    span.style.backgroundImage = `url('${backgroundImageURL}')`;
                    span.style.backgroundSize = "cover";
                    span.style.backgroundRepeat = "no-repeat";
                    span.style.fontWeight = "bold";
                    span.style.display = "inline-block";
                    span.style.width = blockWidth;
                    span.style.boxSizing = "border-box";

                    img.replaceWith(span);
                    img.dataset.replaced = "true";
                    return;
                }

                // bpp.png → swap src
                if (file === "bpp.png") {
                    const rect = img.getBoundingClientRect();
                    if (!img.getAttribute("width") && rect.width) img.setAttribute("width", Math.round(rect.width));
                    if (!img.getAttribute("height") && rect.height) img.setAttribute("height", Math.round(rect.height));
                    img.src = bppReplacementURL;
                    if (img.srcset !== undefined) img.srcset = "";
                    img.dataset.replaced = "true";
                    return;
                }
            }
        });
    }

    // ---------------- MutationObserver ----------------
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                replaceTranslateImages(node);
            });
        }
    });

    function startObserver() {
        if (!document.body) {
            requestAnimationFrame(startObserver);
            return;
        }
        replaceTranslateImages(); // initial run
        observer.observe(document.body, { childList: true, subtree: true });
    }

    startObserver();

})();
