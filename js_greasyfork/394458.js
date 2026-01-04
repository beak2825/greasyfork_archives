// ==UserScript==
// @name           ffxiv.ariyala.com 小工具
// @name:en        ffxiv.ariyala.com Tool
// @description    ffxiv.ariyala.com 自动标记所选项 + 魔晶石镶嵌界面快速选择魔晶石功能
// @description:en ffxiv.ariyala.com Auto mark the selection + Quickly selection on Materia Melding
// @version        1.3.0
// @match          *://ffxiv.ariyala.com/*
// @run-at         document-start
// @grant          unsafeWindow
// @author         AnnAngela
// @namespace      https://greasyfork.org/users/129402
// @supportURL     https://greasyfork.org/scripts/394458-ffxiv-ariyala-com-%E5%B0%8F%E5%B7%A5%E5%85%B7/feedback
// @license        GNU General Public License v3.0 or later
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/394458/ffxivariyalacom%20%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/394458/ffxivariyalacom%20%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
/* eslint-disable no-magic-numbers */
/* global ToolkitData, toolkit, BestInSlotSolver */
"use strict";
(function loop() {
    if (!unsafeWindow.toolkit || !unsafeWindow.toolkit.currentContentCallback || !unsafeWindow.toolkit.currentContentCallback.attributeNames || !Array.isArray(unsafeWindow.toolkit.currentContentCallback.attributeNames) || !unsafeWindow.MateriaWindow) {
        return setTimeout(loop, 100);
    }
    const i18n = {
        CRT: "暴击",
        DHT: "直击",
        SPS: "咏唱",
        SKS: "技速",
        DET: "信念",
        TEN: "坚韧",
        PIE: "信仰",
        CMS: "作业",
        CRL: "加工",
        CP: "制作力",
        GTH: "获得力",
        PCP: "鉴别力",
        GP: "采集力",
        clear: "清空",
    };
    const expensiveMaterias = ["CMS", "CRL", "CP", "GTH", "PCP", "GP"];
    const attributes = unsafeWindow.toolkit.currentContentCallback.attributeNames.filter((n) => Object.prototype.hasOwnProperty.bind(i18n)(n));
    const uiLangIsChinese = unsafeWindow.navigator.language.startsWith("zh");

    const doc = unsafeWindow.document;
    const style = doc.createElement("style");
    style.innerText = ".materiaQuicklySelect { text-align: left; } .materiaQuicklySelect a { margin-left: 1em; } .materiaQuicklySelect a:first-child, .materiaQuicklySelect br + a { margin-left: 0; } #materiaWindow > .overlayWindowAlignBox > .overlayWindowAlignCell > .overlayWindowContainer { max-height: 90vh; overflow-y: auto; }";
    doc.head.appendChild(style);

    function check() {
        if (!doc.querySelector(".markAllSelection")) {
            Array.from(doc.querySelectorAll('[id^="classJobsOptionsLine"]')).forEach((n) => {
                const button = doc.createElement("a");
                button.classList.add("markAllSelection");
                button.classList.add("author");
                button.innerText = "Mark ALL selection";
                n.append(" • ");
                n.appendChild(button);
                button.addEventListener("click", () => {
                    Array.from(doc.querySelectorAll('#groupTables .inventoryCell[displaystate="inventory"]')).forEach((p) => {
                        const n = p.querySelector(".inventoryToggleButton");
                        while (p.classList.contains("selected") && !n.classList.contains("selected") || !p.classList.contains("selected") && n.classList.contains("selected")) {
                            n.click();
                        }
                    });
                });
            });
        }
    }
    check();
    const observerForMarkAllSelection = new MutationObserver(check);
    observerForMarkAllSelection.observe(unsafeWindow.document.querySelector("#classJobsOptionsLineA"), {
        childList: true,
        characterData: true,
        subtree: true,
    });
    observerForMarkAllSelection.observe(unsafeWindow.document.querySelector("#classJobsOptionsLineB"), {
        childList: true,
        characterData: true,
        subtree: true,
    });
    const suitableMaterias = {
        normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        advanced: [1, 2, 3, 4, 5, 7, 9],
    };
    const MW = unsafeWindow.MateriaWindow;
    unsafeWindow.MateriaWindow = class MateriaWindow extends MW {
        constructor(slot, itemData, row) {
            super(slot, itemData, row);
            const sW = this.showWindow.bind(this);
            this.showWindow = () => {
                sW();
                const { materiaSlots, maxMateriaSlots } = itemData;
                Array.from(doc.querySelectorAll('select[id^="materiaSelect"]')).forEach((n, i) => {
                    const suitableMateria = i < materiaSlots ? suitableMaterias.normal : i < maxMateriaSlots ? i === materiaSlots ? suitableMaterias.normal : suitableMaterias.advanced : [];
                    const availableMateria = {};
                    const levels = new Set();
                    attributes.forEach((attr) => {
                        const { itemLevel, values } = ToolkitData.Materias[attr];
                        itemLevel.map((iL, lvl) => ({ iL, lvl: lvl + 1, val: values[lvl] })).filter(({ iL, lvl }) => iL <= itemData.iLevel && suitableMateria.includes(lvl)).forEach(({ lvl, val }) => {
                            (availableMateria[attr] = availableMateria[attr] || {})[lvl] = val;
                        });
                    });
                    Object.keys(availableMateria).forEach((attr) => {
                        const lvls = Object.keys(availableMateria[attr]).sort((a, b) => b - a);
                        if (expensiveMaterias.includes(attr)) {
                            lvls.forEach((l) => levels.add(l));
                        } else {
                            levels.add(lvls[0]);
                        }
                    });
                    console.info({ suitableMateria, availableMateria });
                    let div = n.parentElement.querySelector(".materiaQuicklySelect");
                    if (!div) {
                        div = doc.createElement("div");
                        div.classList.add("materiaQuicklySelect");
                        n.after(div);
                    }
                    div.innerHTML = "";
                    for (const level of levels) {
                        if (div.innerHTML !== "") {
                            div.innerHTML += "<br>";
                        }
                        div.innerHTML += Object.keys(availableMateria).map((attr) => `<a href="javascript:void(0);" title="${uiLangIsChinese ? i18n[attr] : `${attr}:`}${level}" data-value="${attr}:${level - 1}">${uiLangIsChinese ? i18n[attr] : `${attr}:`}${level} [${availableMateria[attr][level]}]</a>${availableMateria[attr][level] < 10 ? "  " : " "}`).join("").trim();
                    }
                    if (div.innerHTML !== "") {
                        div.innerHTML += ` <a href="javascript:void(0);" title="${uiLangIsChinese ? i18n.clear : "Clear"}" data-value="">${uiLangIsChinese ? i18n.clear : "Clear"}</a>`;
                    }
                    Array.from(div.querySelectorAll("a")).forEach((ele) => {
                        ele.addEventListener("click", () => {
                            n.value = ele.dataset.value;
                            unsafeWindow.uiManager.currentOverlayWindow.updateMateriaWindowTable();
                        });
                    });
                });
            };
            return this;
        }
    };
    const abbr = toolkit.currentContentCallback.abbreviation;
    if (!(abbr in BestInSlotSolver.attributeWeights)) {
        const aW = {};
        toolkit.currentContentCallback.attributeNames.forEach((attr) => {
            aW[attr] = 0;
        });
        BestInSlotSolver.attributeWeights[abbr] = aW;
    }
})();