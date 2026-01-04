// ==UserScript==
// @name         阻止切屏检测
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  切屏也能保持网页标题不变，让你轻松找到想要的网页！
// @author       GR：PM
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483981/%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483981/%E9%98%BB%E6%AD%A2%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

;(function () {
    "use strict"
    Object.defineProperty(window, "onblur", {
        value: null,
        writable: false,
    })
    Object.defineProperty(document, "onblur", {
        value: null,
        writable: false,
    })
    Object.defineProperty(window, "onmouseleave", {
        value: null,
        writable: false,
    })
    Object.defineProperty(document, "onmouseleave", {
        value: null,
        writable: false,
    })
    Object.defineProperty(window, "onvisibilitychange", {
        value: null,
        writable: false,
    })
    Object.defineProperty(document, "onvisibilitychange", {
        value: null,
        writable: false,
    })

    // Backup original addEventListener
    const originalEventTargetAddEventListener = EventTarget.prototype.addEventListener
    const originalHTMLElementAddEventListener = HTMLElement.prototype.addEventListener
    const originalWindowAddEventListener = Window.prototype.addEventListener
    const originalDocumentAddEventListener = Document.prototype.addEventListener

    function isBlocked(eventName) {
        if (
            eventName === "visibilitychange" ||
            eventName === "focus" ||
            eventName === "focusin" ||
            eventName === "focusout" ||
            eventName === "blur" ||
            eventName === "mouseleave"
        ) {
            return true
        } else {
            return false
        }
    }

    EventTarget.prototype.addEventListener = function (eventName, eventHandler) {
        if (isBlocked(eventName)) {
            console.log(`Blocked listener: ${eventName}`)
        } else {
            // console.log(`Bypass listener: ${eventName}`);
            originalEventTargetAddEventListener.call(this, eventName, eventHandler)
        }
    }

    HTMLElement.prototype.addEventListener = function (eventName, eventHandler) {
        if (isBlocked(eventName)) {
            console.log(`Blocked listener: ${eventName}`)
        } else {
            // console.log(`Bypass listener: ${eventName}`);
            originalHTMLElementAddEventListener.call(this, eventName, eventHandler)
        }
    }

    Window.prototype.addEventListener = function (eventName, eventHandler) {
        if (isBlocked(eventName)) {
            console.log(`Blocked listener: ${eventName}`)
        } else {
            // console.log(`Bypass listener: ${eventName}`);
            originalWindowAddEventListener.call(this, eventName, eventHandler)
        }
    }

    Document.prototype.addEventListener = function (eventName, eventHandler) {
        if (isBlocked(eventName)) {
            console.log(`Blocked listener: ${eventName}`)
        } else {
            // console.log(`Bypass listener: ${eventName}`);
            originalDocumentAddEventListener.call(this, eventName, eventHandler)
        }
    }
})()
