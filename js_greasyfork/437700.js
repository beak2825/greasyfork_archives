// ==UserScript==
// @name Greasy Fork Total Downloads
// @namespace -
// @version 1.2.2
// @description Shows a user's total downloads.
// @author NotYou
// @match *://greasyfork.org/*/users/*
// @match *://sleazyfork.org/*/users/*
// @license GPL-3.0
// @run-at document-body
// @grant GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/445697/1244619/Greasy%20Fork%20API.js
// @downloadURL https://update.greasyfork.org/scripts/437700/Greasy%20Fork%20Total%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/437700/Greasy%20Fork%20Total%20Downloads.meta.js
// ==/UserScript==

~function(GreasyFork) {
    class Installs {
        static async getData(userId) {
            const userData = await GreasyFork.getUserData(userId)

            return (userData.all_listable_scripts || userData.scripts).reduce((acc, curr) => {
                acc.total += curr.total_installs
                acc.daily += curr.daily_installs

                return acc
            }, {
                total: 0,
                daily: 0
            })
        }
    }

    class User {
        static getId(url) {
            const match = url.match(/https?:\/\/(greasyfork|sleazyfork)\.org\/[a-zA-Z]+(\-[a-zA-Z]+)?\/users\/(?<userId>\d+)/)

            if (match) {
                const { userId } = match.groups

                return userId
            } else {
                return '1'
            }
        }

        static getLocale($languageSelectorLocale) {
            return $languageSelectorLocale ? $languageSelectorLocale.value || 'en-US' : 'en-US'
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

    class Data {
        static async getData() {
            const { href } = location
            const $languageSelectorLocale = document.querySelector('#language-selector-locale')
            const userLocale = User.getLocale($languageSelectorLocale)
            const userId = User.getId(href)
            const installsData = await Installs.getData(userId)

            return {
                userLocale,
                installsData
            }
        }
    }

    class Main {
        static init() {
            window.addEventListener('DOMContentLoaded', async () => {
                const { userLocale, installsData } = await Data.getData()
                const { total, daily } = installsData
                const $total = Stat.createItem(total.toLocaleString(userLocale), total > 1 ? 'Installs' : 'Install', 'rgb(123, 23, 23)')
                const $daily = Stat.createItem(daily.toLocaleString(userLocale), daily > 1 ? 'Daily Installs' : 'Daily Install', 'rgb(185, 32, 32)')
                const $header = document.querySelector('div.sidebarred-main-content h3:first-child')

                $header.appendChild($total)
                $header.appendChild($daily)
            })
        }
    }

    Main.init()
}(GreasyFork)





















