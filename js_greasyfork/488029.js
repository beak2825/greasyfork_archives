// ==UserScript==
// @name               Auto Dark Mode for Penana Mobile
// @name:zh-TW         Penana 手機版自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               https://wsrv.nl/?url=https://static2.penana.com/img/mobile/app-icon/ios/128.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.0
// @license            MIT
// @match              https://m.penana.com/*
// @match              https://android.penana.com/*
// @run-at             document-end
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.registerMenuCommand
// @require            https://unpkg.com/typesafe-i18n@5.26.2/dist/i18n.object.min.js
// @require            https://unpkg.com/uuid-random@1.3.2/uuid-random.min.js
// @require            https://update.greasyfork.org/scripts/494512/1373878/gm-inject.js
// @supportURL         https://greasyfork.org/scripts/488029/feedback
// @downloadURL https://update.greasyfork.org/scripts/488029/Auto%20Dark%20Mode%20for%20Penana%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/488029/Auto%20Dark%20Mode%20for%20Penana%20Mobile.meta.js
// ==/UserScript==

const LL = (function()
{
    const translations =
    {
        "en": {
            COMMAND: {
                SETTING: "Change Light Theme Setting",
            },
            SETTING: {
                SUBTITLE: "Light Theme Setting",
                LIGHT: "Light",
                WHITE: "White",
                BROWN: "Brown",
                SAVE: "Save",
            },
        },
        "zh-TW": {
            COMMAND: {
                SETTING: "更改明亮主題設定",
            },
            SETTING: {
                SUBTITLE: "明亮主題設定",
                LIGHT: "明亮",
                WHITE: "白色",
                BROWN: "褐色",
                SAVE: "儲存",
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

GM.registerMenuCommand(LL.COMMAND.SETTING(), async () =>
{
    await showLightThemeSetting();
    updateTheme(query);
});

window.addEventListener(`${EVENT_KEY}:ready`, () =>
{
    query.addEventListener("change", updateTheme);
    updateTheme(query);
});

GM.injectPageScript(
    ({ EVENT_KEY }) =>
    {
        const interval = setInterval(() =>
        {
            if ("setTheme" in window)
            {
                clearInterval(interval);
                window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:ready`));
            }
        }, 100);

        window.addEventListener(`${EVENT_KEY}:setTheme`, ({ detail: theme }) =>
        {
            setTheme(theme);
            setCookie("darktheme", theme, 9999);
        });

        window.addEventListener(`${EVENT_KEY}:hidePopup`, ({ detail: selector }) =>
        {
            $(selector).hide();
        });
    },
    { EVENT_KEY });

function getLightTheme()
{
    return GM.getValue("light_theme", "lighttheme");
}

function getExpectedTheme(isDarkMode)
{
    return isDarkMode ? Promise.resolve("darktheme") : getLightTheme();
}

function getCurrentTheme()
{
    switch (true)
    {
        case document.body.classList.contains("darktheme"):
            return "darktheme";
        case document.body.classList.contains("whitetheme"):
            return "whitetheme";
        case document.body.classList.contains("browntheme"):
            return "browntheme";
        default:
            return "lighttheme";
    }
}

async function updateTheme({ matches: isDarkMode })
{
    const expectedTheme = await getExpectedTheme(isDarkMode);
    if (getCurrentTheme() !== expectedTheme)
    {
        window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:setTheme`, { detail: expectedTheme }));
    }
}

function showLightThemeSetting()
{
    return new Promise(async (resolve) =>
    {
        const popupWrapper = document.createElement("div");
        popupWrapper.id = uuid();
        popupWrapper.classList.add("popupwrap", "narrowpopup", "scroll");

        const popupMask = document.createElement("div");
        popupMask.classList.add("mask", "pseudoclose");

        const popup = document.createElement("div");
        popup.classList.add("popup", "logregpopup", "popupbox", "invitebox", "scroll");

        const closeButton = document.createElement("a");
        closeButton.classList.add("close", "ignorelink", "newclose", "nonsticky", "floatright");
        closeButton.innerText = "×";

        const contents = document.createElement("div");
        contents.classList.add("padding10px");

        const subtitle = document.createElement("span");
        subtitle.classList.add("popup_subtitle", "font15px");
        subtitle.innerText = LL.SETTING.SUBTITLE();

        const form = document.createElement("form");
        form.style = "margin-top: 20px;";
        form.addEventListener("submit", async (event) =>
        {
            event.preventDefault();

            const options = new FormData(form);
            await GM.setValue("light_theme", options.get("light_theme"));

            window.dispatchEvent(new CustomEvent(`${EVENT_KEY}:hidePopup`, { detail: `#${popupWrapper.id}` }));
        });

        const lightThemeLabelWrapper = document.createElement("p");

        const lightThemeLabel = document.createElement("label");

        const lightThemeRadio = document.createElement("input");
        lightThemeRadio.classList.add("with-gap");
        lightThemeRadio.name = "light_theme";
        lightThemeRadio.type = "radio";
        lightThemeRadio.required = true;
        lightThemeRadio.value = "lighttheme";

        const lightThemeText = document.createElement("span");
        lightThemeText.innerText = LL.SETTING.LIGHT();

        const whiteThemeLabelWrapper = document.createElement("p");

        const whiteThemeLabel = document.createElement("label");

        const whiteThemeRadio = document.createElement("input");
        whiteThemeRadio.classList.add("with-gap");
        whiteThemeRadio.name = "light_theme";
        whiteThemeRadio.type = "radio";
        whiteThemeRadio.required = true;
        whiteThemeRadio.value = "whitetheme";

        const whiteThemeText = document.createElement("span");
        whiteThemeText.innerText = LL.SETTING.WHITE();

        const brownThemeLabelWrapper = document.createElement("p");

        const brownThemeLabel = document.createElement("label");

        const brownThemeRadio = document.createElement("input");
        brownThemeRadio.classList.add("with-gap");
        brownThemeRadio.name = "light_theme";
        brownThemeRadio.type = "radio";
        brownThemeRadio.required = true;
        brownThemeRadio.value = "browntheme";

        const brownThemeText = document.createElement("span");
        brownThemeText.innerText = LL.SETTING.BROWN();

        const saveButton = document.createElement("button");
        saveButton.classList.add("btn", "waves-effect", "waves-light");
        saveButton.innerHTML = `${LL.SETTING.SAVE()} <i class="material-icons right">save</i>`;

        lightThemeLabel.append(lightThemeRadio, lightThemeText);
        lightThemeLabelWrapper.append(lightThemeLabel);
        whiteThemeLabel.append(whiteThemeRadio, whiteThemeText);
        whiteThemeLabelWrapper.append(whiteThemeLabel);
        brownThemeLabel.append(brownThemeRadio, brownThemeText);
        brownThemeLabelWrapper.append(brownThemeLabel);
        form.append(lightThemeLabelWrapper, whiteThemeLabelWrapper, brownThemeLabelWrapper, saveButton);
        contents.append(subtitle, form);
        popup.append(closeButton, contents);
        popupWrapper.append(popupMask, popup);
        document.body.append(popupWrapper);

        const theme = await getLightTheme();
        switch (theme)
        {
            case "lighttheme":
                lightThemeRadio.checked = true;
                break;
            case "whitetheme":
                whiteThemeRadio.checked = true;
                break;
            case "browntheme":
                brownThemeRadio.checked = true;
                break;
        }

        const observer = new MutationObserver((records) =>
        {
            observer.disconnect();

            resolve();
            popupWrapper.remove();
        });

        observer.observe(popupWrapper, { attributes: true, attributeFilter: ["style"] });
    });
}
