// ==UserScript==
// @name         Better Orion
// @version      0.5
// @description  Just wanna make Orion better and easier to use.
// @author       Beta Kuang
// @match        https://orion.klook.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://betakuang.me/
// @downloadURL https://update.greasyfork.org/scripts/391183/Better%20Orion.user.js
// @updateURL https://update.greasyfork.org/scripts/391183/Better%20Orion.meta.js
// ==/UserScript==

(function() {
    'use strict'

    var log = function(...args) {
        console.log('Better Orion:', ...args)
    }

    // Detect and re-run script on URL changes.
    var currentPath = ''
    var isPlanningPage = false
    var pathChangeDetector = window.setInterval(function () {
        if (location.pathname !== currentPath) {
            log('path changed:', location.pathname)
            currentPath = location.pathname
            isPlanningPage = currentPath.includes('planning')
            colorTaskTable()
        }
    }, 200)

    var colorTaskTable = function () {
        var findTableInterval
        var findTableTimes = 0
        var findTable = function() {
            findTableTimes++
            if (findTableTimes > 5) {
                log('task table not found, script stopped')
                window.clearInterval(findTableInterval)
                return
            }

            log('finding task table...', findTableTimes)

            // Find story table.
            var treeTables = document.getElementsByClassName('tree-table')
            if (treeTables.length <= 0) {
                return
            }

            log('task table found')
            window.clearInterval(findTableInterval)

            for (var table of treeTables) {
                listenOnTableChange(table)
            }
        }
        findTableInterval = window.setInterval(findTable, 500)

        var listenOnTableChange = function(tableEl) {
            applyColorToRows(tableEl)
            var obs = new window.MutationObserver(function (mutations, observer) {
                applyColorToRows(tableEl)
            })
            obs.observe(tableEl, {childList: true, subtree: true})
        }

        var applyColorToRows = function(tableEl) {
            // Find rows.
            var rows = tableEl.getElementsByTagName('tr')
            if (rows.length <= 0) {
                return
            }

            for (var i = 0; i < rows.length; i++) {
                var row = rows.item(i)
                if (!row) {
                    continue
                }
                // row.querySelector('a.el-tooltip').style.textDecorationLine = 'none'

                // Find status text.
                var statusLinks = []
                if (isPlanningPage) {
                    statusLinks = row.children[4].getElementsByClassName('tree-table-td-div')
                } else {
                    statusLinks = row.getElementsByClassName('status')
                }

                if (statusLinks.length <= 0) {
                    continue
                }

                var bgColor = '#FFF' // Default to white.
                var statusText = statusLinks[0].textContent.trim().toLowerCase()
                switch (statusText) {
                    default:
                    case 'scope':
                    case 'to do':
                    case 'tb dev':
                        bgColor = '#FFF' // White.
                        break
                    case 'in progress':
                    case 'dev':
                    case 'developing':
                    case 'in dev':
                        bgColor = '#E0F7FA' // A light cyan color.
                        break
                    case 'dev finished':
                    case 'dev done':
                    case 'peer debug finished':
                        bgColor = '#C8E6C9' // A light green color.
                        break
                    case 'peer debug':
                    case 'testing':
                    case 'rd testing':
                        bgColor = '#FFECB3' // A light amber color.
                        break
                    case 'done':
                    case 'completed':
                    case 'launch':
                        bgColor = '#EEE' // A light grey color.

                        var text = row.querySelector('.title-ele.finished')
                        if (text) {
                            text.style.textDecorationLine = 'line-through'
                        }
                        break
                }

                row.setAttribute('style', 'background-color: ' + bgColor + ' !important')
            }
        }
    }
})();