// ==UserScript==
// @name GreasyFork Total Scripts
// @namespace -
// @version 3.1.6
// @description Shows a user's total scripts count on GreasyFork.
// @author NotYou
// @match *://greasyfork.org/*/users/*
// @match *://sleazyfork.org/*/users/*
// @match *://greasyfork.org/*/scripts*
// @match *://sleazyfork.org/*/scripts*
// @license GPL-3.0-or-later
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/437234/GreasyFork%20Total%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/437234/GreasyFork%20Total%20Scripts.meta.js
// ==/UserScript==

~function() {
    class Utils {
        static getColor(amount) {
            if (amount >= 100) {
                return 'rgb(185, 16, 16)'
            } if (amount >= 50) {
                return 'rgb(185, 87, 16)'
            } if (amount >= 25) {
                return 'rgb(185, 159, 16)'
            } if (amount >= 10) {
                return 'rgb(21, 185, 16)'
            } if (amount >= 5) {
                return 'rgb(16, 185, 153)'
            } if (amount > 1) {
                return 'rgb(16, 42, 185)'
            } if (amount === 1) {
                return 'rgb(125, 125, 125)'
            }
        }

        static isSearchPage() {
            return Boolean(document.querySelector('#browse-script-list'))
        }

        static getLocale($languageSelectorLocale) {
            return $languageSelectorLocale ? $languageSelectorLocale.value || 'en-US' : 'en-US'
        }
    }

    class Counter {
        static getAmount(selector) {
            return document.querySelectorAll(selector).length
        }

        static getScripts() {
            return this.getAmount('[data-script-language="js"]:not([data-script-type="library"])')
        }

        static getStyles() {
            return this.getAmount('[data-script-language="css"]')
        }

        static getLibraries() {
            return this.getAmount('[data-script-type="library"]')
        }
    }

    class Stat {
        static createItem(data, text, color) {
            const node = document.createElement('span')
            node.style.fontSize = '15px'
            node.style.borderRadius = '3px'
            node.style.backgroundColor = 'rgb(45, 45, 45)'
            node.style.color = 'rgb(255, 255, 255)'
            node.style.margin = '0 4px'
            node.style.padding = '0 4px'
            node.style.display = 'inline-flex'
            node.style.alignItems = 'center'
            node.style.gap = '4px'
            node.style.boxShadow = `0 0 0 2px ${color}`
            node.textContent = data + ' ' + text

            const circle = document.createElement('span')
            circle.style.width = '8px'
            circle.style.height = '8px'
            circle.style.borderRadius = '50%'
            circle.style.background = color

            node.prepend(circle)

            return node
        }
    }

    class Main {
        static init() {
            const scripts = Counter.getScripts()
            const styles = Counter.getStyles()
            const libraries = Counter.getLibraries()
            const isSearchPage = Utils.isSearchPage()
            const $languageSelectorLocale = document.querySelector('#language-selector-locale')
            const userLocale = Utils.getLocale($languageSelectorLocale)
            const $scripts = Stat.createItem(scripts.toLocaleString(userLocale), scripts > 1 ? 'Scripts' : 'Script', Utils.getColor(scripts))
            const $styles = Stat.createItem(styles.toLocaleString(userLocale), styles > 1 ? 'Styles' : 'Style', Utils.getColor(styles))
            const $libraries = Stat.createItem(libraries.toLocaleString(userLocale), libraries > 1 ? 'Libraries' : 'Library', Utils.getColor(libraries))

            if (isSearchPage) {
                const $mainContentParagraph = document.querySelector('.sidebarred-main-content > p')

                if (scripts) {
                    $mainContentParagraph.appendChild($scripts)
                } if (styles) {
                    $mainContentParagraph.appendChild($styles)
                } if (libraries) {
                    $mainContentParagraph.appendChild($libraries)
                }
            } else {
                const $header = document.querySelector('div.sidebarred-main-content h3:first-child')

                if (scripts) {
                    $header.appendChild($scripts)
                } if (styles) {
                    $header.appendChild($styles)
                } if (libraries) {
                    $header.appendChild($libraries)
                }
            }
        }
    }

    Main.init()
}()
