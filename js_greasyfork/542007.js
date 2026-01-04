// ==UserScript==
// @name         一万亿次免费抽卡加速和自动化 One Trillion Free Draws Accelerator and Automation
// @namespace    xfdz.OTFDAA
// @version      2.0
// @description  同时提供用户控制界面
// @author       Zero（加速）, 销锋镝铸（自动化）
// @match        https://duducat.moe/gacha/*
// @match        https://gityxs.github.io/one-trillion-free-draws/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542007/%E4%B8%80%E4%B8%87%E4%BA%BF%E6%AC%A1%E5%85%8D%E8%B4%B9%E6%8A%BD%E5%8D%A1%E5%8A%A0%E9%80%9F%E5%92%8C%E8%87%AA%E5%8A%A8%E5%8C%96%20One%20Trillion%20Free%20Draws%20Accelerator%20and%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/542007/%E4%B8%80%E4%B8%87%E4%BA%BF%E6%AC%A1%E5%85%8D%E8%B4%B9%E6%8A%BD%E5%8D%A1%E5%8A%A0%E9%80%9F%E5%92%8C%E8%87%AA%E5%8A%A8%E5%8C%96%20One%20Trillion%20Free%20Draws%20Accelerator%20and%20Automation.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const defaultOptions = {
        speedMultiplier: 1,
        autoDraw: {
            enabled: false,
            drawOnFull: false
        },
        autoSkill: {
            enabled: false,
            skills: {
                fire: false,
                water: false,
                leaf: false,
                sun: false,
                moon: false
            }
        }
    };
    let options = {};

    let interval = null;
    const intervalActions = new Map();

    let accelerator = null;
    let autoDrawManager = null;
    let autoSkillManager = null;
    let uiManager = null;

    function initialize() {
        try {
            let optionsInLocalStorage = JSON.parse(window.localStorage.getItem("OTFDAAOptions"));
            if (optionsInLocalStorage) {
                try{
                    options = Object.assign({}, defaultOptions, optionsInLocalStorage);
                    console.log("[OTFDAA] 设置已从本地存储中加载");
                }
                catch{
                    options = defaultOptions;
                    console.log("[OTFDAA] 本地存储中的设置存在问题，已初始化设置");
                }
            }
            else {
                options = defaultOptions;
                saveOptions();
                console.log("[OTFDAA] 未找到设置，已初始化设置");
            }
        }
        catch (e) {
            options = defaultOptions;
            console.log("[OTFDAA] 未找到设置，已初始化设置");
        }
        accelerator = new Accelerator();
        autoDrawManager = new AutoDrawManager();
        autoSkillManager = new AutoSkillManager();
        uiManager = new UIManager();
        interval = setInterval(() => {
            for (let action of intervalActions.values()) {
                action();
            }
        }, 500);
        window.addEventListener("beforeunload", () => {
            accelerator.restoreOriginalAPIs();
            clearInterval(interval);
        });
    }

    function saveOptions() {
        window.localStorage.setItem("OTFDAAOptions", JSON.stringify(options));
    }

    class Accelerator {
        originalAPIs;
        performanceNowOverridden = false;
        requestAnimationFrameOverridden = false;
        syncTimeSourcesOverridden = false;

        constructor() {
            this.originalAPIs = {
                raf: window.requestAnimationFrame.bind(window),
                performanceNow: performance.now.bind(performance),
                DateNow: Date.now
            };
            try {
                this.initialize();
                console.log("[OTFDAA] 加速OTFDAA已激活");
            }
            catch (error) {
                console.error("[OTFDAA] 初始化失败:", error);
                setTimeout(this.initialize, 1500); // 重试初始化
            }
        }

        initialize() {
            this.overridePerformanceNow();
            this.overrideRequestAnimationFrame();
            this.syncTimeSources();
        }

        setSpeedMultiplier(multiplier) {
            options.speedMultiplier = multiplier;
            console.log(`[OTFDAA] 已修改游戏速度为 ×${options.speedMultiplier}`);
            saveOptions();
        }

        // 劫持 performance.now
        overridePerformanceNow() {
            if (this.performanceNowOverridden) {
                return;
            }
            Object.defineProperty(performance, "now", {
                value: () => this.originalAPIs.performanceNow() * options.speedMultiplier,
                configurable: true,
                writable: false
            });
            console.log("[OTFDAA] performance.now 已劫持");
            this.performanceNowOverridden = true;
        }

        // 劫持 requestAnimationFrame
        overrideRequestAnimationFrame() {
            if (this.requestAnimationFrameOverridden) {
                return;
            }
            window.requestAnimationFrame = (callback) => {
                return this.originalAPIs.raf((timestamp) => {
                    callback(timestamp * options.speedMultiplier);
                });
            };
            console.log("[OTFDAA] requestAnimationFrame 已劫持");
            this.requestAnimationFrameOverridden = true;
        }

        // 同步时间源
        syncTimeSources() {
            if (this.syncTimeSourcesOverridden) {
                return;
            }
            const baseTime = Date.now();
            Date.now = () => baseTime + (performance.now() - baseTime);
            console.log("[OTFDAA] 时间源已同步");
            this.syncTimeSourcesOverridden = true;
        }

        // 恢复原始 API
        restoreOriginalAPIs() {
            Object.defineProperty(performance, "now", {
                value: this.originalAPIs.performanceNow,
                configurable: true
            });
            window.requestAnimationFrame = this.originalAPIs.raf;
            Date.now = this.originalAPIs.DateNow;
            console.log("[OTFDAA] 原始 API 已恢复");
            this.performanceNowOverridden = false;
            this.requestAnimationFrameOverridden = false;
            this.syncTimeSourcesOverridden = false;
        }
    }

    class AutoDrawManager {

        constructor() {
            this.setAutoDraw(options.autoDraw.enabled, false);
        }

        setAutoDraw(on, save = true) {
            options.autoDraw.enabled = on;
            if (on) {
                if (!intervalActions.has("autoDraw")) {
                    intervalActions.set("autoDraw", this.draw);
                }
            }
            else {
                intervalActions.delete("autoDraw");
            }
            if (save) {
                saveOptions();
            }
        }

        draw() {
            try {
                const drawButton = options.autoDraw.drawOnFull ?
                    document.querySelector("#draw-zone > .currency.f-fire")
                        ?.parentElement
                        ?.querySelector("#draw-button") :
                    document.querySelector("#draw-button");
                if (drawButton) {
                    drawButton.click();
                }
                const cancelButton = document.querySelector(
                    ".card-list.done + .draw-result > button");
                if (cancelButton) {
                    cancelButton.click();
                }
            }
            catch {
            }
        }

        setDrawOnFull(on) {
            options.autoDraw.drawOnFull = on;
            saveOptions();
        }
    }

    class AutoSkillManager {
        constructor() {
            this.setAutoSkillEnabled(options.autoSkill.enabled, false);
        }

        setAutoSkillEnabled(on, save = true) {
            options.autoSkill.enabled = on;
            if (on) {
                if (!intervalActions.has("autoSkill")) {
                    intervalActions.set("autoSkill", this.useSkill);
                }
            }
            else {
                intervalActions.delete("autoSkill");
            }
            if (save) {
                saveOptions();
            }
        }

        useSkill() {
            if (!options.autoSkill.enabled) {
                return;
            }
            const skillHolder = document.querySelector("#draw-options .skill-holder");
            if (!skillHolder) {
                return;
            }
            const skillButtons = skillHolder.children;
            for (let i = 0; i < 5; i++) {
                let skillButton = skillButtons[i];
                if (skillButton.classList.contains("disabled")) {
                    continue;
                }
                for (const [skill, on] of Object.entries(options.autoSkill.skills)) {
                    if (on) {
                        const button = skillHolder.querySelector(`.f-${skill}:not(.disabled)`);
                        if (button) {
                            button.click();
                        }
                    }
                }
            }
        }

        setAutoSkill(skill, on) {
            switch (skill) {
                case "fire":
                    options.autoSkill.skills.fire = on;
                    break;
                case "water":
                    options.autoSkill.skills.water = on;
                    break;
                case "leaf":
                    options.autoSkill.skills.leaf = on;
                    break;
                case "sun":
                    options.autoSkill.skills.sun = on;
                    break;
                case "moon":
                    options.autoSkill.skills.moon = on;
                    break;
            }
            saveOptions();
        }
    }

    class UIManager {
        constructor() {
            this.insertStyle();
            this.createControlPanel();
        }

        insertStyle() {
            const style = document.createElement("style");
            style.textContent = `
#OTFDAAControlPanel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: fixed;
    bottom: 40px;
    left: 25px;
    max-width: 248px;
    z-index: 2000001;
}
#OTFDAAControlPanel .OTFDAAOptionContainer {
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
    min-height: 35px;
}
#OTFDAASkillPanel {
    display: flex;
    gap: 2px;
}
#OTFDAASkillPanel button{
    flex: 1;
    aspect-ratio: 1;
}`;
            document.head.appendChild(style);
        }

        createControlPanel() {
            if (document.getElementById("OTFDAAControlPanel")) {
                return;
            }
            const panelContainer = document.createElement("div");
            panelContainer.id = "OTFDAAControlPanel";
            panelContainer.classList.add("opt-container");
            const panelTitle = document.createElement("h3");
            panelTitle.textContent = "OTFDAA 控制台";
            panelTitle.style.marginTop = "10px";
            panelContainer.appendChild(panelTitle);
            this.createCheckbox("自动抽卡", panelContainer, options.autoDraw.enabled, event => {
                autoDrawManager.setAutoDraw(event.target.checked);
            });
            this.createCheckbox("等待批量能量达到上限",
                panelContainer,
                options.autoDraw.drawOnFull,
                event => {
                    autoDrawManager.setDrawOnFull(event.target.checked);
                });
            this.createCheckbox("自动技能", panelContainer, options.autoSkill.enabled, event => {
                autoSkillManager.setAutoSkillEnabled(event.target.checked);
                const skillPanel = document.getElementById("OTFDAASkillPanel");
                if (skillPanel) {
                    skillPanel.style.display = event.target.checked ? "flex" : "none";
                }
            });
            this.createNumberInput("加速倍率",
                panelContainer,
                0.1,
                100,
                0.1,
                options.speedMultiplier,
                event => {
                    let num = event.target.valueAsNumber;
                    if (num < 0.1) {
                        num = 0.1;
                        event.target.value = num;
                    }
                    if (num > 100) {
                        num = 100;
                        event.target.value = num;
                    }
                    accelerator.setSpeedMultiplier(num);
                });
            document.body.appendChild(panelContainer);
            this.createSkillButtons();
        }

        createCheckbox(title, parent, checked, onChange) {
            const container = document.createElement("div");
            container.classList.add("OTFDAAOptionContainer");
            const titleLabel = document.createElement("label");
            titleLabel.textContent = title;
            titleLabel.htmlFor = title;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = title;
            checkbox.checked = checked;
            checkbox.addEventListener("change", onChange);
            container.appendChild(titleLabel);
            container.appendChild(checkbox);
            parent.appendChild(container);
        }

        createNumberInput(title, parent, min, max, step, value, onChange) {
            const container = document.createElement("div");
            container.classList.add("OTFDAAOptionContainer");
            const titleLabel = document.createElement("label");
            titleLabel.textContent = title;
            titleLabel.htmlFor = title;
            const input = document.createElement("input");
            input.type = "number";
            input.id = title;
            input.min = min;
            input.max = max;
            input.step = step;
            input.value = value;
            input.addEventListener("change", onChange);
            container.appendChild(titleLabel);
            container.appendChild(input);
            parent.appendChild(container);
        }

        createSlider(title, parent, min, max, step, value, onChange) {
            const container = document.createElement("div");
            container.classList.add("OTFDAAOptionContainer");
            const titleSpan = document.createElement("span");
            titleSpan.textContent = title;
            const sliderContainer = document.createElement("div");
            const sliderInput = document.createElement("input");
            sliderInput.type = "range";
            sliderInput.id = title;
            sliderInput.min = min;
            sliderInput.max = max;
            sliderInput.step = step;
            sliderInput.value = value;
            sliderInput.style.width = "140px";
            const sliderLabel = document.createElement("label");
            sliderLabel.textContent = value.toFixed(1);
            sliderLabel.htmlFor = title;
            sliderInput.addEventListener("change", event => {
                sliderLabel.textContent = "×" + sliderInput.valueAsNumber.toFixed(1);
                onChange(event);
            });
            sliderContainer.appendChild(sliderLabel);
            sliderContainer.appendChild(sliderInput);
            container.appendChild(titleSpan);
            container.appendChild(sliderContainer);
            parent.appendChild(container);
        }

        createSkillButtons() {
            if (document.getElementById("OTFDAASkillPanel")) {
                return;
            }
            const skillHolder = document.querySelector("#draw-options .skill-holder");
            if (!skillHolder) {
                return;
            }
            const container = document.createElement("div");
            container.style.display = options.autoSkill.enabled ? "flex" : "none";
            container.id = "OTFDAASkillPanel";
            for (const [skill, on] of Object.entries(options.autoSkill.skills)) {
                const button = document.createElement("button");
                button.classList.add(`f-${skill}`);
                button.disabled = true;
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = on;
                checkbox.addEventListener("change", event => {
                    autoSkillManager.setAutoSkill(skill, event.target.checked);
                });
                button.appendChild(checkbox);
                container.appendChild(button);
            }
            skillHolder.after(container);
        }
    }

    if (!window.OTFDAALoaded) {
        window.OTFDAALoaded = true;
        if (document.readyState === "complete") {
            initialize();
        }
        else {
            window.addEventListener("load", () => {
                initialize();
            });
        }
    }
})();
