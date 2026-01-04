// ==UserScript==
// @name         gametracker.com — Connect via Steam
// @description  Add a link on the gametracker.com server page allowing to connect via Steam.
// @author       Rafal Enden
// @namespace    https://github.com/rafenden
// @homepageURL  https://github.com/rafenden/userscripts/blob/master/gametracker-steam-connect
// @supportURL   https://github.com/rafenden/userscripts/issues
// @license      MIT
// @version      1.0
// @match        *://www.gametracker.com/server_info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435412/gametrackercom%20%E2%80%94%20Connect%20via%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/435412/gametrackercom%20%E2%80%94%20Connect%20via%20Steam.meta.js
// ==/UserScript==

'use strict'

const rowBefore = document.querySelector('.block630_content_left .section_title')
const ip = document.querySelector('.block630_content_left').textContent.match(/Address:[\s]*([\w\.]*)/)[1]
const port = document.querySelector('.block630_content_left').textContent.match(/Port:[\s]*([\d]*)/)[1]

const link = document.createElement('A')
link.href = `steam://connect/${ip}:${port}`
link.text = 'Connect via Steam'
link.style.padding = '0 0 0 20px'
link.style.background = 'left / contain no-repeat url("http://icons.iconarchive.com/icons/froyoshark/enkel/128/Steam-icon.png")'

rowBefore.style.height = 'auto'
rowBefore.parentNode.insertBefore(document.createElement('BR'), rowBefore.nextSibling)
rowBefore.parentNode.insertBefore(link, rowBefore.nextSibling)