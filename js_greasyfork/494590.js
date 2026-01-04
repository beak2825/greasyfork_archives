// ==UserScript==
// @name        CodeForces-朋友列表显示状态
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  display friend status on list
// @author       Qianfan
// @match        https://codeforces.com/friends
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @run-at      document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494590/CodeForces-%E6%9C%8B%E5%8F%8B%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/494590/CodeForces-%E6%9C%8B%E5%8F%8B%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(async function() {
    'use strict';
            const domParser = new DOMParser()
            const space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
            const users = document.querySelector('div#pageContent').querySelectorAll('a.rated-user')
            const sleep = t => new Promise(resolve => setTimeout(resolve, t))
            for (const user of users) {
                fetch(user.href).then(res => {
                    res.text().then(text => {
                        const doc = domParser.parseFromString(text, "text/html")
                        const lis = doc.querySelector('div.info').querySelectorAll('li')
                        for (const li of lis) {
                            if (li.innerText.includes('Last')) {
                                user.outerHTML = `${user.outerHTML} ${space} ${li.querySelector('span').outerHTML}`
                                break
                            }
                        }
                    })
                })
                await sleep(88 + Math.random() * 88)
            }
})();