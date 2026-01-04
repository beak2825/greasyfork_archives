// ==UserScript==
// @name        BlitzRhythm Editor Mod Base Lib
// @name:zh-CN  闪韵灵境编辑器模组基本库
// @namespace   lib-cipher-mod-base
// @version     1.2.2
// @description A BlitzRhythm Editor Mod Base Lib
// @description:zh-CN 兼容模组加载器所必须的库
// @author      Moyuer
// @author:zh-CN   如梦Nya
// @license     MIT
// @source      https://github.com/CMoyuer/BlitzRhythm-Editor-Mod-Loader
// @match       *://*/*
// ==/UserScript==

const scriptInfo = window.GM_info.script
// const icon = window.GM_info.script.icon
// const scriptName = window.GM_info.script.name
const scriptNamespace = scriptInfo.namespace

function log(...data) {
    console.log("[" + scriptNamespace + "]", ...data)
}

/**
 * i18n
 * @param {string} key 
 * @param {any[]} data 
 */
function $t(key, ...data) {
    let language = localStorage.getItem("i18nextLng") ?? "en"
    if (/^zh-?/.test(language) && I18N["zh"]) language = "zh"
    let keys = key.split('.')
    try {
        /** @type {string} */
        let val = I18N[language] ?? I18N['en']
        keys.forEach(element => {
            val = val[element]
        })
        for (let i = 0; i < data.length; i++)
            val = val.replace(new RegExp("\\{" + i + "\\}", "g"), data[i] + "")
        return val
    } catch (error) {
        console.warn("[" + scriptNamespace + "]I18N Key not found: " + key)
        return key
    }
}

/**
 * Get parameter value
 * @param {string} parameterId 
 */
function $p(parameterId) {
    try {
        let info = JSON.parse(localStorage.getItem("mod-" + scriptNamespace))
        return info.parameter[parameterId].value
    } catch (error) {
        return
    }
}

function showSetupPage() {
    unsafeWindow.modloader.gotoPage("/settings/" + scriptNamespace)
}

function hideDrawer() {
    unsafeWindow.modloader.drawer.methods.hide()
}

(function () {
    'use strict'

    let _methods = {
        enabled: () => {
            if (typeof (onEnabled) === "function")
                onEnabled()
        },
        disabled: () => {
            if (typeof (onDisabled) === "function")
                onDisabled()
        },
        parameterChanged: (id, val) => {
            if (typeof (onParameterValueChanged) === "function")
                onParameterValueChanged(id, val)
        }
    }

    let handle = setInterval(() => {
        if (!unsafeWindow.modloader) return
        unsafeWindow.modloader.addMod({
            id: scriptNamespace,
            info: scriptInfo,
            parameter: PARAMETER,
            methods: METHODS,
            _methods,
            window,
        })
        clearInterval(handle)
    }, 100)
})()