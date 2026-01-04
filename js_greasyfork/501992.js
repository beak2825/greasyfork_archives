// ==UserScript==
// @name        Auto Dark Mode
// @namespace   Kyan Violentmonkey Scripts
// @match       *://*.reddit.com/*
// @match       *://*.paratranz.cn/*
// @match       *://paratranz.cn/*
// @match       *://robertsspaceindustries.com/spectrum/*
// @grant       none
// @version     1.1.1
// @license     MIT
// @author      Kyan
// @description Auto set dark or light mode for reddit / Paratranz / Star Citizen Spectrum
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/559897/Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/559897/Auto%20Dark%20Mode.meta.js
// ==/UserScript==
;(function () {
    'use strict';


    /* Classes */
    class ThemeManager {
        element () {}
        ready () {
            return this.element() !== null
        }
    }
    class Reddit extends ThemeManager {
        static hostname = "reddit.com"
        element () {
            return document.querySelector("html.theme-beta")
        }
        is_dark () {
            return this.element().classList.contains('theme-dark')
        }
        is_light () {
            return this.element().classList.contains('theme-light')
        }
        to_dark () {
            this.element().classList.remove("theme-light")
            this.element().classList.add("theme-dark")
        }
        to_light () {
            this.element().classList.remove("theme-dark")
            this.element().classList.add("theme-light")
        }
    }
    class Spectrum extends ThemeManager {
        static hostname = "robertsspaceindustries.com"
        element () {
            return document.querySelector("div#react")
        }
        ready () {
            return this.element() && !this.element().classList.contains("theme-undefined") && document.querySelector("#toolbarSettings")
        }
        is_dark () {
            return this.element().classList.contains("theme-dark")
        }
        is_light () {
            return this.element().classList.contains("theme-light")
        }
        to_dark () {
            document.querySelector("#toolbarSettings").click()
            const obeserver = new MutationObserver(() => {
                if (document.querySelector(".toggle-button > input[type='checkbox']")) {
                    document.querySelector(".toggle-button > input[type='checkbox']").click()
                }
                if (document.querySelector("a.c-settings-close")) {
                    obeserver.disconnect()
                    document.querySelector("a.c-settings-close").click()
                }
            })
            obeserver.observe(this.element(), { childList: true, subtree: true })
            window.setTimeout(() => obeserver.disconnect(), 10000)
        }
        to_light () {
            this.to_dark()
        }
    }
    class Paratranz extends ThemeManager {
        static hostname = "paratranz.cn"
        element () {
            return document.querySelector("#toggleTheme > a.nav-link")
        }
        is_dark () {
            return document.querySelector("html").getAttribute("data-theme") === "dark"
        }
        is_light () {
            return document.querySelector("html").getAttribute("data-theme") === "light"
        }
        to_dark () {
            this.element().click()
        }
        to_light () {
            this.element().click()
        }
    }


    /* Functions */
    const get_inst = () => {
        for (const cls of [Reddit, Paratranz, Spectrum]) {
            if (window.location.hostname.indexOf(cls.hostname) > -1) {
                return new cls()
            }
        }
        return null
    }
    const is_prefer_dark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const is_prefer_light = () => window.matchMedia("(prefers-color-scheme: light)").matches;


    /* Main */
    const main = (inst) => {
        console.log(`[Auto Dark Mode] Prefer: ${is_prefer_light()?"[✓ Light]":"✗ Light"}, ${is_prefer_dark()?"[✓ Dark]":"✗ Dark"}`)
        console.log(`[Auto Dark Mode] Current: ${inst.is_light()?"[✓ Light]":"✗ Light"}, ${inst.is_dark()?"[✓ Dark]":"✗ Dark"}`)
        if (inst.is_dark() && is_prefer_light()) {
            inst.to_light()
            console.log("[Auto Dark Mode] Switched to Light")
        } else if (inst.is_light() && is_prefer_dark()) {
            inst.to_dark()
            console.log("[Auto Dark Mode] Switched to Dark")
        } else {
            console.log("[Auto Dark Mode] No need to switch")
        }
    }

    console.log("[Auto Dark Mode] Loaded")
    const inst = get_inst()
    const observer = new MutationObserver(() => {
        if (inst.ready()) {  // Check if the page is ready
            console.log("[Auto Dark Mode] Ready")
            observer.disconnect()
            main(inst)
        } else {
            console.log("[Auto Dark Mode] Waiting")
        }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
    window.setTimeout(() => observer.disconnect(), 15000)  // Timeout after 15s
})()