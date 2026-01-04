// ==UserScript==
// @name         GGn Bulleted Group Info List
// @version      6
// @description  Change group sidebar info comma list to bulleted list
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @namespace https://greasyfork.org/users/1141417
// @downloadURL https://update.greasyfork.org/scripts/541310/GGn%20Bulleted%20Group%20Info%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/541310/GGn%20Bulleted%20Group%20Info%20List.meta.js
// ==/UserScript==
const minimum = 2
const alias_minimum = 2

const body = document.querySelector('#sidebar_group_info .body')

if (body) {
    if (body.querySelector(':scope > strong')) {
        const info = {}
        let currentHeader = ''
        const childNodes = body.childNodes

        for (let i = 1; i < childNodes.length; i++) { // first is a new line text
            const childNode = childNodes[i]

            const textContent = childNode.textContent
            if (childNode.nodeName === 'STRONG') {
                currentHeader = textContent
                info[currentHeader] = []
                info[currentHeader].push(childNode)
            } else {
                info[currentHeader].push(childNode)
            }
        }

        for (const /** @type {Node[]} */ nodes of Object.values(info)) {
            const anchors = nodes.filter(n => n.nodeName === 'A')
            if (anchors.length < minimum) continue

            for (const node of nodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.id !== 'group_aliases') {
                    node.style.display = 'none'
                }

                if (node.nodeName === 'A') {
                    continue
                }

                if (node.nodeValue === ', ' || node.nodeName === 'BR') {
                    node.remove()
                }
            }

            createList(nodes[0], anchors)
        }
    }

    const aliasCtn = document.getElementById('group_aliases')
    if (aliasCtn) {
        const aliasText = document.querySelector('textarea[name=aliases]').textContent
        let aliases = []

        if (aliasText.includes('||')) {
            aliases = aliasText.split('||')
            for (let alias of aliases) {
                alias = alias.trim()
            }
        } else {
            const _aliases = aliasText.split(', ')

            // join lowercase-starting strings to the previous non-lowercase string
            let cur = _aliases[0]
            for (let i = 1; i < _aliases.length; i++) {
                const string = _aliases[i]
                if (/^[a-z]/.test(string)) {
                    cur += ', ' + string
                } else {
                    aliases.push(cur)
                    cur = string
                }
            }

            aliases.push(cur)
        }

        if (aliases.length >= alias_minimum) {
            aliasCtn.style.display = 'none'
            const strong = document.createElement('strong')
            strong.textContent = 'Aliases:'
            aliasCtn.after(strong)
            createList(strong, aliases)
        }

        if (aliasCtn.previousElementSibling?.nodeName === 'UL') {
            aliasCtn.querySelector('br').remove()
        }
    }
}

function createList(headerEl, items) {
    headerEl.style.display = 'block'
    const ul = document.createElement('ul')
    ul.style.listStyle = 'revert'
    ul.style.margin = '0'
    ul.style.paddingLeft = '20px'

    for (const item of items) {
        const li = document.createElement('li')
        if (item.nodeName === 'A') {
            item.style.display = 'revert'
            li.appendChild(item)
        } else {
            li.textContent = item
        }
        li.style.padding = '0'
        ul.appendChild(li)
    }

    headerEl.after(ul)
    if (ul.nextElementSibling) {
        ul.style.paddingBottom = '5px'
    }
}

/* too inflexible

function groupByCommaCount(str, referenceStr) {
    const elements = str.split(', ')
    const commaCount = (referenceStr.match(/,/g) || []).length
    const groupSize = commaCount + 1

    const result = []
    for (let i = 0; i < elements.length; i += groupSize) {
        const group = elements.slice(i, i + groupSize)
        result.push(group.join(', '))
    }
    return result
}*/
