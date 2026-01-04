// ==UserScript==
// @name         Sphinx RTD template: toggle sidebar and highlighting
// @namespace    club.porcupine.gm_scripts.sphinx_rtd_template_toggle_sidebar_and_highlighting
// @version      3
// @description  Toggle sidebar (Esc-H) and search keyword highlighting (Esc-U) on Sphinx HTML pages using the Read the Docs template.
// @author       Sam Birch
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip2/readthedocs.io.ico
// @match        *://*/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/457370/Sphinx%20RTD%20template%3A%20toggle%20sidebar%20and%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/457370/Sphinx%20RTD%20template%3A%20toggle%20sidebar%20and%20highlighting.meta.js
// ==/UserScript==
(function() {
    'use strict'

    function initialize() {
        function gen_style_toggler(source) {
            const stylesheet = document.createElement('style')
            stylesheet.innerHTML = source
            function toggle() {
                if (stylesheet.parentElement) {
                    stylesheet.parentElement.removeChild(stylesheet)
                } else {
                    document.head.appendChild(stylesheet)
                }
            }
            return toggle
        }

        const toggle_search_highlighting = gen_style_toggler(`
            .highlighted { background-color: unset !important; }
        `)
        const toggle_sidebar_visibility = gen_style_toggler(`
            .wy-nav-side, .rst-versions { display: none }
            .wy-nav-content-wrap { margin-left: unset }
        `)

        const esc_timeout_ms = 1000
        let esc_pressed = 0
        window.addEventListener("keydown", ev => {
            if (ev.defaultPrevented) {
                return
            }
            switch (ev.key) {
                case "Escape":
                    esc_pressed = Date.now()
                    ev.preventDefault()
                    break
                case "h":
                    if (esc_pressed && Date.now() - esc_pressed < esc_timeout_ms) {
                        esc_pressed = 0
                        toggle_sidebar_visibility()
                        ev.preventDefault()
                    }
                    break
                case "u":
                    if (esc_pressed && Date.now() - esc_pressed < esc_timeout_ms) {
                        esc_pressed = 0
                        toggle_search_highlighting()
                        ev.preventDefault()
                    }
                    break
            }
        })
    }

    if (document.body.classList.contains('wy-body-for-nav')) {
        initialize()
    }
}())
