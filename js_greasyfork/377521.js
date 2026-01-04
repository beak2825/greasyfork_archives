// ==UserScript==
// @name         Kickshrouder
// @namespace    Kickshrouder
// @version      1.2
// @description  Hide kickstarter projects that don't interest you
// @author       Mindez
// @match        https://www.kickstarter.com/discover*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377521/Kickshrouder.user.js
// @updateURL https://update.greasyfork.org/scripts/377521/Kickshrouder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var SHROUDED_COOKIE_NAME = '_kickshrouded'

    var $ = window.jQuery
    if (!$) { return console.log('Kickshrouder :: Error :: No JQuery') }

    function getNameFromElement(element) {
        const lines = element.children[0].children[0].children[0].outerText.split('\n')
        if (lines[0] === 'Project We Love') {
            return lines[1]
        }
        return lines[0]
    }

    function getIdFromElement(element) {
        return element.children[0].children[0].children[0].children[1].children[0].href.split('/')[5].split('?')[0]
    }

    function getButtonParentFromElement(element) {
        return element.children[0].children[0].children[0].children[0].children[0]
    }


    function setCookie(name, value) {
        document.cookie = name + '=' + value + '; path=/'
    }

    let shroudedIds = []
    var cookies = document.cookie.split(';')
    cookies.forEach(cookie => {
        if (cookie.split('=')[0].trim() === SHROUDED_COOKIE_NAME) {
            console.log('Kickshrouder :: Info :: Loading List')
            shroudedIds = JSON.parse(cookie.split('=')[1])
        }
    })

    let existingButtons = []
    function shroudKickstarters() {
        $('.js-react-proj-card, .js-react-async-proj-card').each(function (index, element) {
            var id = getIdFromElement(element)
            var name = getNameFromElement(element)
            if (shroudedIds.indexOf(id) !== -1) {
                console.log('Kickshrouder :: Shrouded :: ' + name)
                return element.remove()
            }

            if (existingButtons.indexOf(id) == -1) {
                var button = document.createElement('button')
                button.className = 'pill bg-soft-black_50 h6 w6 ksr-tooltip text-nowrap flex p0 keyboard-focusable-transparent z1 no-outline shadow-avatar absolute t2 r2'
                button.innerHTML = '<span style="align:center; color:white; font-size:2em; margin-left:0.4em">X</span>'
                button.setAttribute('data-tooltip', 'Ignore')
                button.style.margin = '3em 0em 0em 0em'
                getButtonParentFromElement(element).append(button)

                button.addEventListener("click", function() {
                    shroudedIds.push(id)
                    setCookie(SHROUDED_COOKIE_NAME, JSON.stringify(shroudedIds))
                    console.log('Kickshrouder :: Shrouded :: ' + name)
                    element.remove()
                });
                existingButtons.push(id)
            }
        })
    }

    function begin()
    {
        shroudKickstarters()
        setTimeout(begin, 500)
    }

    begin()
})();