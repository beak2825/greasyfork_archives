// ==UserScript==
// @name            Library: Color Logs
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/5d44a978d18a1b91f554b2358406671d/raw/
// @version         16.0.1
// @description     Log enhancer. Extends console.log, console.error, etc. Show console.debug logs by setting window.Debug = true.
// @author          sidneys
// @icon            https://www.greasespot.net/favicon.ico
// @match           http*://*/*
// @grant           unsafeWindow
// ==/UserScript==


/**
 * Get Debug State
 * @this window
 * @returns {Boolean} - Yes/No
 */
let getIsDebug = () => !!unsafeWindow.Debug || !!unsafeWindow.DEBUG || !!this.Debug || !!this.DEBUG
getIsDebug = getIsDebug.bind(this)

/**
 * Get Log Message Prefix
 * @returns {String} - Prefix
 */
let getLogPrefix = () => GM.info.script.name


/**
 * Original console
 * @type {Object}
 * @readonly
 */
// const originalConsole = window.console

/**
 * Original log()
 * @type {function}
 * @readonly
 */
const originalLog = unsafeWindow.console.log


/**
 * Extended console logging methods
 * @type {Object}
 * @borrows window.console.debug as debug
 * @borrows window.console.error as error
 * @borrows window.console.info as info
 * @borrows window.console.log as log
 * @borrows window.console.warn as warn
 */
const consoleMixin = {
    debug: function () {
        if (!getIsDebug()) { return }

        const color = `rgb(255, 150, 70)`

        originalLog.call(this, `🛠 %c[${getLogPrefix()}] %c${Array.from(arguments).join(' ')}`, `font-weight: 600; color: ${color};`, `font-weight: 400; color: ${color};`)
    },
    error: function () {
        const color = `rgb(220, 0, 30)`

        originalLog.call(this, `🚨️ %c[${getLogPrefix()}] %c${Array.from(arguments).join(' ')}`, `font-weight: 600; color: ${color};`, `font-weight: 400; color: ${color};`)
    },
    info: function () {
        const color = `rgb(0, 200, 180)`

        originalLog.call(this, `ℹ️ %c[${getLogPrefix()}] %c${Array.from(arguments).join(' ')}`, `font-weight: 600; color: ${color};`, `font-weight: 400; color: ${color};`)
    },
    log: function () {
        const color = `rgb(70, 70, 70)`

        originalLog.call(this, `✳️ %c[${getLogPrefix()}] %c${Array.from(arguments).join(' ')}`, `font-weight: 600; color: ${color};`, `font-weight: 400; color: ${color};`)
    },
    warn: function () {
        const color = `rgb(255, 100, 0)`

        originalLog.call(this, `⚠️ %c[${getLogPrefix()}] %c${Array.from(arguments).join(' ')}`, `font-weight: 600; color: ${color};`, `font-weight: 400; color: ${color};`)
    }
}


/**
 * Replace console logging methods
 * @mixes window.console
 */
Object.assign(unsafeWindow.console, consoleMixin)
