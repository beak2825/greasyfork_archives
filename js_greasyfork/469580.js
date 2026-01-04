// ==UserScript==
// @name         IsQuestCompleted
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Simple macro that check you completed that quest before.
// @author       Przemekb88 / Yalahari
// @license      MIT
// @match        https://www.wowhead.com/quest=*
// @match        https://wowpedia.fandom.com/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469580/IsQuestCompleted.user.js
// @updateURL https://update.greasyfork.org/scripts/469580/IsQuestCompleted.meta.js
// ==/UserScript==


var host = window.location.hostname
var url = window.location.href
if (host === 'wowpedia.fandom.com') {
    url = document.querySelector('.elinks .wowhead').firstChild.href
}

var page = url.substring(url.lastIndexOf('quest=') + 6)
var result = page.split('/')

var button = document.createElement('button')

button.onclick = function() {
    navigator.clipboard.writeText('/script print(IsQuestFlaggedCompleted('+result[0]+'))')
    button.textContent = 'Copied'
    setTimeout(function() {
        button.textContent = 'Is quest completed?'
    }, 3000)
}
button.textContent = 'Is quest completed?'

if (host === 'wowpedia.fandom.com') {
    var tr = document.createElement('tr')
    var th = document.createElement('th')
    th.setAttribute('scope', 'row')
    th.style.textAlign = 'left'
    th.style.backgroundColor = 'transparent'
    th.innerHTML = 'Check'
    tr.appendChild(th)
    tr.appendChild(button)
    var questbox = document.querySelector('.infobox.darktable.questbox')
    questbox.appendChild(tr)
} else {
    var node = document.createElement('li')
    node.appendChild(button)
    var myList = document.getElementById('infobox-contents-0').getElementsByTagName('ul')[0]
    myList.appendChild(node)
}