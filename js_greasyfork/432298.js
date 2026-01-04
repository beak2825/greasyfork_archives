// ==UserScript==
// @name         livedoor blog clean 
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  移除多余的字符
// @author       ayase
// @match        http://blog.livedoor.jp/geek/archives/*
// @downloadURL https://update.greasyfork.org/scripts/432298/livedoor%20blog%20clean.user.js
// @updateURL https://update.greasyfork.org/scripts/432298/livedoor%20blog%20clean.meta.js
// ==/UserScript==


(() => {
    const main = () => {
        for (const node of Array.from(document.querySelectorAll('a'))) {
            if (node.textContent.startsWith('サークル')){
                node.textContent = node.textContent.slice('サークル'.length)
                node.addEventListener('click', (event) => {
                    event.preventDefault()
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(event.currentTarget.textContent)
                    }
                })
            }
            if (node.textContent.endsWith('氏')){
                node.textContent = node.textContent.slice(0, -('氏'.length))
            }
        }
    }

    main()
})()