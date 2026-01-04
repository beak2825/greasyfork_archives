// ==UserScript==
// @name         AskfmForHumans/themes
// @name:ru      AskfmForHumans/themes
// @version      1.2.0
// @namespace    https://github.com/AskfmForHumans
// @author       https://github.com/AskfmForHumans
// @homepage     https://afh.snowwm.ml/userjs/themes
// @license      MIT
//
// @description    Restore the choice from 18 color themes
// @description:ru Возвращает выбор из 18 цветовых тем
//
// @match        https://ask.fm/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @resource     style https://github.com/AskfmForHumans/user.js/raw/main/themes.css
// @resource     icon https://github.com/AskfmForHumans/user.js/raw/main/icon-owl.ico
// @downloadURL https://update.greasyfork.org/scripts/425738/AskfmForHumansthemes.user.js
// @updateURL https://update.greasyfork.org/scripts/425738/AskfmForHumansthemes.meta.js
// ==/UserScript==

(function () {
    "use strict"

    const LOG_PREFIX = "afh/themes:"
    const THEME_NAMES = [ // by WandAlKa
        "[Без темы]",
        "Томатная жижа",
        "Голубой вагон",
        "Хмурь",
        "Глухая чаща",
        "Кровавое месиво",
        "Сумеречная зона",
        "Фиалка в горшочке",
        "Барби",
        "Мёртвый розовый",
        "Стервозный розовый",
        "Shitty Life",
        "Гематома",
        "Стратосфера",
        "Морфей",
        "Басейн",
        "Болотная водоросль",
        "Фисташка",
        "Тенистый мох",
    ]

    const menuItems = []

    GM_addStyle(GM_getResourceText("style"))
    update()

    // Re-apply when a new body is created (on URL change).
    const observer = new MutationObserver(() => update())
    observer.observe(document.documentElement, {
        childList: true,
    })

    function update(themeId) {
        if (themeId !== undefined) {
            GM_setValue("afh-askfm-theme", themeId)
        } else {
            themeId = GM_getValue("afh-askfm-theme") || 0
        }

        rebuildMenu(themeId)
        applyTheme(themeId)
    }

    function rebuildMenu(currentTheme) {
        // clear current items
        for (const i of menuItems) {
            GM_unregisterMenuCommand(i)
        }
        menuItems.length = 0

        for (const [id, name] of THEME_NAMES.entries()) {
            const text = (id === currentTheme ? `${id}. ${name} ✔️` : `${id}. ${name}`)
            const cmd = GM_registerMenuCommand(text, () => update(id))
            menuItems.push(cmd)
        }
    }

    function applyTheme(currentTheme) {
        console.info(LOG_PREFIX, `apply ${currentTheme}`)

        for (const i of THEME_NAMES.keys()) {
            document.body.classList.remove(`theme-${i}`)
        }

        if (currentTheme > 0) {
            setIcon(true)
            document.body.classList.add(`theme-${currentTheme - 1}`)
        } else {
            setIcon(false)
        }
    }

    function setIcon(enabled) {
        let iconElem = document.getElementById("afh-icon")
        if (!iconElem) {
            iconElem = document.createElement("link")
            iconElem.id = "afh-icon"
            iconElem.rel = "icon"
            document.head.appendChild(iconElem)
        }

        if (enabled) {
            iconElem.href = GM_getResourceURL("icon")
        } else {
            iconElem.href = "/favicon.ico"
        }
    }
})()
