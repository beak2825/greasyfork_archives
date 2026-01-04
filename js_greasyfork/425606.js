// ==UserScript==
// @name         Notion Column TOC
// @namespace    http://playeruu.com
// @version      0.3
// @description  Make notions's Toc float on right bottom place
// @author       arronKler
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425606/Notion%20Column%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/425606/Notion%20Column%20TOC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    function createMenuBtn() {
        let circle = document.createElement('div');
        circle.id = 'menu-circle'
        circle.style.fontSize = '12px'
        circle.style.width = "36px";
        circle.style.height = "36px";
        circle.style.lineHeight = '36px';
        circle.style.backgroundColor = '#fff';
        circle.style.borderRadius = "50%";
        circle.style.boxShadow = '0 0 5px 0 #aaa';
        circle.style.position = 'absolute';
        circle.style.bottom = '100px';
        circle.style.right = '31px';
        circle.style.zIndex = '101';
        circle.style.textAlign = 'center'
        circle.style.cursor = 'pointer'

        circle.appendChild(document.createTextNode('Menu'))

        circle.onclick = () => {
            const block = document.querySelector('#menu-circle >.notion-table_of_contents-block')

            const display = block.style.display
            if (display === 'block') {
                block.style.display = 'none'
            } else {
                block.style.display = 'block'
            }
        }


        return circle
    }

    function appendMenu(parent) {
        setTimeout(() => {
            const toc = document.querySelector('.notion-table_of_contents-block');

            if (toc) {
                toc.style.maxWidth = 'auto';
                toc.style.position = 'absolute';
                toc.style.bottom = '0';
                toc.style.right = '60px';
                toc.style.overflowY = 'scroll';
                toc.style.maxHeight = '50vh';
                toc.style.width = 'auto';
                toc.style.backgroundColor = '#fff';
                toc.style.boxShadow = '0 0 5px 0 #aaa';
                toc.style.padding = '10px';
                toc.style.display = 'block';
                console.log('toc appended')

                parent.appendChild(toc)
            } else {
                appendMenu(parent)
            }
        }, 500)
    }


    let menuBtn = null
    const observer = new MutationObserver(() => {
        const helpBtn = document.querySelector('.notion-help-button')

        if (helpBtn && menuBtn === null) {
            console.log('append menu')
            menuBtn = createMenuBtn()
            helpBtn.parentNode.insertBefore(menuBtn, helpBtn)
            appendMenu(menuBtn)
        }
    });

    let notionApp = document.getElementById('notion-app');
    const config = { childList: true, subtree: true };
    observer.observe(notionApp, config);

    /*
    setTimeout(() => {
        const menuBtn = createMenuBtn()
        const helpBtn = document.querySelector('.notion-help-button')
        if (helpBtn) {
            helpBtn.parentNode.insertBefore(menuBtn, helpBtn)
        }

        appendMenu(menuBtn)
        console.log('help', helpBtn)
    }, 1000)
*/

})();