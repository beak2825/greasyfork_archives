// ==UserScript==
// @name               Auto Dark Mode for ESJ Zone
// @name:zh-TW         ESJ Zone 自動黑暗模式
// @name:zh-CN         ESJ Zone 自动黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @description:zh-CN  根据浏览器的布景主题设定，自动从明亮和黑暗模式间切换。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.0
// @license            MIT
// @match              https://www.esjzone.cc/*
// @match              https://www.esjzone.me/*
// @match              https://www.esjzone.one/*
// @run-at             document-end
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.registerMenuCommand
// @require            https://unpkg.com/typesafe-i18n@5.26.2/dist/i18n.object.min.js
// @require            https://unpkg.com/uuid-random@1.3.2/uuid-random.min.js
// @require            https://update.greasyfork.org/scripts/494512/1373878/gm-inject.js
// @supportURL         https://greasyfork.org/scripts/488026/feedback
// @downloadURL https://update.greasyfork.org/scripts/488026/Auto%20Dark%20Mode%20for%20ESJ%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/488026/Auto%20Dark%20Mode%20for%20ESJ%20Zone.meta.js
// ==/UserScript==

const LL = (function()
{
    const translations =
    {
        "en": {
            COMMAND: {
                SETTINGS: "Change Theme Settings",
            },
            SETTINGS: {
                TITLE: "Theme Settings",
                LIGHT_THEME: "Light Theme",
                WHITE: "White",
                BLUE: "Blue",
                GREEN: "Green",
                GRAY: "Pink",
                LIGHT_GRAY: "Light Gray",
                DARK_THEME: "Dark Theme",
                BLACK: "Black",
                DARK_GRAY: "Dark Gray",
                CANCEL: "Cancel",
                SAVE: "Save",
            },
        },
        "zh-TW": {
            COMMAND: {
                SETTINGS: "更改主題設定",
            },
            SETTINGS: {
                TITLE: "主題設定",
                LIGHT_THEME: "明亮主題",
                WHITE: "白色",
                BLUE: "藍色",
                GREEN: "綠色",
                PINK: "粉紅色",
                LIGHT_GRAY: "淺灰色",
                DARK_THEME: "黑暗主題",
                BLACK: "黑色",
                DARK_GRAY: "深灰色",
                CANCEL: "取消",
                SAVE: "儲存",
            },
        },
        "zh-CN": {
            COMMAND: {
                SETTINGS: "更改主题设定",
            },
            SETTINGS: {
                TITLE: "主题设定",
                LIGHT_THEME: "明亮主题",
                WHITE: "白色",
                BLUE: "蓝色",
                GREEN: "绿色",
                PINK: "粉红色",
                LIGHT_GRAY: "浅灰色",
                DARK_THEME: "黑暗主题",
                BLACK: "黑色",
                DARK_GRAY: "深灰色",
                CANCEL: "取消",
                SAVE: "储存",
            },
        },
    };

    let locale = "en";
    for (let _locale of navigator.languages.map((language) => new Intl.Locale(language)))
    {
        if (_locale.language === "zh")
        {
            _locale = new Intl.Locale("zh", { region: _locale.maximize().region });
        }
;
        if (_locale.baseName in translations)
        {
            locale = _locale.baseName;
            break;
        }
    }

    return i18nObject(locale, translations[locale]);
})();

const EVENT_KEY = uuid();

const query = matchMedia("(prefers-color-scheme: dark)");

GM.registerMenuCommand(LL.COMMAND.SETTINGS(), async () =>
{
    await showThemeSettings();
    updateTheme(query);
});

query.addEventListener("change", updateTheme);
updateTheme(query);

GM.injectPageScript(
    ({ EVENT_KEY }) =>
    {
        window.addEventListener(`${EVENT_KEY}:showModal`, ({ detail: selector }) =>
        {
            $(selector)
                .on("hide.bs.modal", (event) =>
                {
                    event.target.dispatchEvent(new CustomEvent("hide.bs.modal", { ...event }));
                })
                .on("hidden.bs.modal", (event) =>
                {
                    event.target.dispatchEvent(new CustomEvent("hidden.bs.modal", { ...event }));
                })
                .modal("show");
        });

        window.addEventListener(`${EVENT_KEY}:hideModal`, ({ detail: selector }) =>
        {
            $(selector)
                .modal("hide");
        });
    },
    { EVENT_KEY });

function getLightTheme()
{
    return GM.getValue("light_theme", "mycolor-0");
}

function getDarkTheme()
{
    return GM.getValue("dark_theme", "mycolor-1");
}

function setThemeSettings(lightTheme, darkTheme)
{
    return Promise.all([GM.setValue("light_theme", lightTheme), GM.setValue("dark_theme", darkTheme)]);
}

function getExpectedTheme(isDarkMode)
{
    return isDarkMode ? getDarkTheme() : getLightTheme();
}

function getCurrentTheme()
{
    return document.querySelector(".customizer-color-switch [id^=mycolor-].active")?.id ?? "mycolor-0";
}

function setTheme(name)
{
    document.querySelector(`.customizer-color-switch #${name}`).click();
}

async function updateTheme({ matches: isDarkMode })
{
    const expectedTheme = await getExpectedTheme(isDarkMode);
    if (getCurrentTheme() !== expectedTheme)
    {
        setTheme(expectedTheme);
    }
}

let settingsOpened = false;

function showThemeSettings()
{
    if (settingsOpened) { return Promise.reject(new Error("Settings was already opened.")); }

    return new Promise(async (resolve) =>
    {
        const [lightTheme, darkTheme] = await Promise.all([getLightTheme(), getDarkTheme()]);

        const form = document.createElement("form");
        form.id = uuid();
        form.classList.add("modal", "fade");
        form.addEventListener("submit", async (event) =>
        {
            event.preventDefault();

            const settings = new FormData(form);
            await setThemeSettings(settings.get("light_theme"), settings.get("dark_theme"));

            window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:hideModal`, { detail: `#${form.id}` }));
        });
        form.addEventListener("hide.bs.modal", () => resolve());
        form.addEventListener("hidden.bs.modal", () =>
        {
            form.remove();
            settingsOpened = false;
        });

        const modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog");

        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");

        const modalHeader = document.createElement("div");
        modalHeader.classList.add("modal-header");

        const modalTitle = document.createElement("h4");
        modalTitle.classList.add("modal-title");
        modalTitle.innerText = LL.SETTINGS.TITLE();

        const closeButton = document.createElement("button");
        closeButton.classList.add("close");
        closeButton.type = "button";
        closeButton.dataset.dismiss = "modal";
        closeButton.innerHTML = `<span aria-hidden="true">×</span>`;

        const modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");

        const lightThemeFormGroup = document.createElement("div");
        lightThemeFormGroup.classList.add("form-group");

        const lightThemeLabel = document.createElement("label");
        lightThemeLabel.htmlFor = "light-theme-select";
        lightThemeLabel.innerText = LL.SETTINGS.LIGHT_THEME();

        const lightThemeSelect = document.createElement("select");
        lightThemeSelect.id = "light-theme-select";
        lightThemeSelect.classList.add("form-control");
        lightThemeSelect.name = "light_theme";

        const whiteThemeOption = document.createElement("option");
        whiteThemeOption.value = "mycolor-0";
        whiteThemeOption.selected = (lightTheme === "mycolor-0");
        whiteThemeOption.innerText = LL.SETTINGS.WHITE();

        const blueThemeOption = document.createElement("option");
        blueThemeOption.value = "mycolor-2";
        blueThemeOption.selected = (lightTheme === "mycolor-2");
        blueThemeOption.innerText = LL.SETTINGS.BLUE();

        const greenThemeOption = document.createElement("option");
        greenThemeOption.value = "mycolor-3";
        greenThemeOption.selected = (lightTheme === "mycolor-3");
        greenThemeOption.innerText = LL.SETTINGS.GREEN();

        const pinkThemeOption = document.createElement("option");
        pinkThemeOption.value = "mycolor-4";
        pinkThemeOption.selected = (lightTheme === "mycolor-4");
        pinkThemeOption.innerText = LL.SETTINGS.PINK();

        const lightGrayThemeOption = document.createElement("option");
        lightGrayThemeOption.value = "mycolor-5";
        lightGrayThemeOption.selected = (lightTheme === "mycolor-5");
        lightGrayThemeOption.innerText = LL.SETTINGS.LIGHT_GRAY();

        const darkThemeFormGroup = document.createElement("div");
        darkThemeFormGroup.classList.add("form-group");

        const darkThemeLabel = document.createElement("label");
        darkThemeLabel.htmlFor = "dark-theme-select";
        darkThemeLabel.innerText = LL.SETTINGS.DARK_THEME();

        const darkThemeSelect = document.createElement("select");
        darkThemeSelect.id = "dark-theme-select";
        darkThemeSelect.classList.add("form-control");
        darkThemeSelect.name = "dark_theme";

        const blackThemeOption = document.createElement("option");
        blackThemeOption.value = "mycolor-1";
        blackThemeOption.selected = (darkTheme === "mycolor-1");
        blackThemeOption.innerText = LL.SETTINGS.BLACK();

        const darkGrayThemeOption = document.createElement("option");
        darkGrayThemeOption.value = "mycolor-6";
        darkGrayThemeOption.selected = (darkTheme === "mycolor-6");
        darkGrayThemeOption.innerText = LL.SETTINGS.DARK_GRAY();

        const modalFooter = document.createElement("div");
        modalFooter.classList.add("modal-footer");

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("btn", "btn-default");
        cancelButton.type = "button";
        cancelButton.dataset.dismiss = "modal";
        cancelButton.innerText = LL.SETTINGS.CANCEL();

        const saveButton = document.createElement("button");
        saveButton.classList.add("btn", "btn-primary");
        cancelButton.type = "submit";
        saveButton.innerText = LL.SETTINGS.SAVE();

        modalHeader.append(modalTitle, closeButton);
        lightThemeSelect.append(whiteThemeOption, blueThemeOption, greenThemeOption, pinkThemeOption, lightGrayThemeOption);
        lightThemeFormGroup.append(lightThemeLabel, lightThemeSelect);
        darkThemeSelect.append(blackThemeOption, darkGrayThemeOption);
        darkThemeFormGroup.append(darkThemeLabel, darkThemeSelect);
        modalBody.append(lightThemeFormGroup, darkThemeFormGroup);
        modalFooter.append(cancelButton, saveButton);
        modalContent.append(modalHeader, modalBody, modalFooter);
        modalDialog.append(modalContent);
        form.append(modalDialog);
        document.body.append(form);

        window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:showModal`, { detail: `#${form.id}` }));
        settingsOpened = true;
    });
}
