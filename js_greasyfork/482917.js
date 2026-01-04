// ==UserScript==
// @name         bb-code-formatter
// @version      0.3
// @author       v666ad
// @description  автоматические отступы для удобного редактирования вложенных bb-кодов в редакторе
// @match        *://shikimori.tld/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @namespace https://greasyfork.org/users/1006905
// @downloadURL https://update.greasyfork.org/scripts/482917/bb-code-formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/482917/bb-code-formatter.meta.js
// ==/UserScript==

const tab = '  '

// список тегов, которые не нуждаются в закрытии
const selfClosingTags = ['comment=', '*', 'br', 'hr', 'poll=', 'image=', 'poster=','animes', 'characters', 'mangas', 'people']

function prettify(data) {
    data = data.replace(/\[/g, '\n[')
    let result = ''
    let tabLevel = 0
    let tabShouldIncrement = false
    data.split('\n').forEach((line)=>{
        line = line.trim()
        if (line === '') {
            return
        }
        if (line.startsWith('[/')) {
            tabLevel--
        } else if (line.startsWith('[')) {
            tabShouldIncrement = true
            selfClosingTags.forEach((selfClosingTag)=>{
                if (line.slice(1, selfClosingTag.length+1) === selfClosingTag) {
                    tabShouldIncrement = false
                    return false // работает как break
                }
            })
        }
        if (tabLevel < 0) {
            tabLevel = 0
        }
        result += tab.repeat(tabLevel) + line + '\n'
        if (tabShouldIncrement) {
            tabLevel++
            tabShouldIncrement = false
        }
    })
    return result
}

function dumps(data) {
    data = prettify(data)
    let result = ''
    data.split('\n').forEach((line)=>{
        line = line.trim()
        if (line.startsWith('[')) {
            result += line
        } else {
            result += '\n' + line
        }
    })
    return result
}

(function(){
    'use strict'

    function addButtons(container) {
        if (container.querySelector('.prettify-code') && container.querySelector('.dumps-code')) {
            return
        }

        const buttonsStyle = document.createElement('style');
        buttonsStyle.textContent = `
        .prettify-code:after {
             font-family: "shikimori";
             content: "";
             color: green;
             font-size: 18px;
             text-align: center;
        }
        .dumps-code:after {
             font-family: "shikimori";
             content: "";
             color: red;
             font-size: 18px;
             text-align: center;
        }
        `
        document.head.appendChild(buttonsStyle);

        const prettifyButton = document.createElement('div')
        prettifyButton.className = 'prettify-code'
        prettifyButton.title = 'Добавить отступы bb-code'
        const dumpsButton = document.createElement('div')
        dumpsButton.className = 'dumps-code'
        dumpsButton.title = 'Убрать отступы bb-code'

        prettifyButton.addEventListener('click', () => {
            const textareas = document.querySelectorAll('.editor-area');

            textareas.forEach((textarea) => {
                textarea.value = prettify(textarea.value)
            });
        })

        dumpsButton.addEventListener('click', () => {
            const textareas = document.querySelectorAll('.editor-area');

            textareas.forEach((textarea) => {
                textarea.value = dumps(textarea.value)
            });
        })

        container.appendChild(prettifyButton)
        container.appendChild(dumpsButton)
    }

    function checkAndAddButtons() {
        if (document.readyState === 'complete') {
            const controlsBlock = document.querySelector('.b-shiki_editor.shiki_editor-selector > .controls, .b-shiki_editor-v2 .vue-node .menubar .icons .menu_group.menu_group-item ')
            addButtons(controlsBlock)
        }
    }

    setInterval(checkAndAddButtons, 1000);
})()
