// ==UserScript==
// @name         Chat BHS - Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Chat - BackOffice
// @author       Serhat Yalcin
// @match        https://dashboardagent.reamaze.com/admin/conversations/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reamaze.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527201/Chat%20BHS%20-%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/527201/Chat%20BHS%20-%20Shortcuts.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const declinedAgent = ['YWRlbQ==', 'YWx0YW4=', 'aWxrZXI=', 'ZnVhdA==', 'aGFsaWw=', 'YnVyYWs=']
    const delay = (sec) => {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }
    const getShortcut = (arr, key) => arr.find(x => x.name.trim() === key)?.body || ''
    const cleanText = (text) => text.replace('\n', '').replace('  ', ' ')
    const getCloseMessages = (arr) => [cleanText(getShortcut(arr, 'bb  p5')), cleanText(getShortcut(arr, 'r23')), cleanText(getShortcut(arr, '2dk')), cleanText(getShortcut(arr, '3dk'), getShortcut(arr, 'k2 küfür'))]
    const getShortcuts = (arr) => [
        {
            shortcut: ['`p1', '"p1', 'p1', '`1', '"1'],
            message: getShortcut(arr, 'p1')
        },
        {
            shortcut: ['`p2', '"p2', 'p2', '`2', '"2'],
            message: getShortcut(arr, 'p2')
        },
        {
            shortcut: ['`p3', '"p3', 'p3', '`3', '"3'],
            message: getShortcut(arr, 'p3')
        },
        {
            shortcut: ['`p4', '"p4', 'p4', '`4', '"4'],
            message: getShortcut(arr, 'benden(p4)')
        },
        {
            shortcut: ['`p5', '"p5', 'p5', '`5', '"5'],
            message: getShortcut(arr, 'p7')
        },
        {
            shortcut: ['w3'],
            message: getShortcut(arr, '(w3) +++')
        },
        {
            shortcut: ['tg'],
            message: getShortcut(arr, 'tg fs')
        },
        {
            shortcut: ['tkt'],
            message: getShortcut(arr, 'telegram kt')
        },
        {
            shortcut: ['z1'],
            message: getShortcut(arr, 'z1 - uy1')
        },
        {
            shortcut: ['k1'],
            message: getShortcut(arr, 'k1 küfür')
        },
        {
            shortcut: ['k2'],
            message: getShortcut(arr, 'k2 küfür')
        },
        {
            shortcut: ['bb'],
            message: getShortcut(arr, 'bb  p5')
        },
        {
            shortcut: ['çekimk'],
            message: getShortcut(arr, '24çekimkayıp')
        },
        {
            shortcut: ['kkb'],
            message: getShortcut(arr, 'kkb son dc sondc')
        },
        {
            shortcut: ['ç1'],
            message: getShortcut(arr, '/çevrimkt 30dk - ç1')
        },
    ]

    let textarea
    const config = { childList: true, subtree: true }

    setInterval(async () => {
        const chatStatus = document.querySelector('#conversation-sticky-top > div.conversation-meta.metaline.clearfix > div.conversation-meta-info > span.conversation-status-wrap.pea > span').textContent
        const agent = document.querySelector('#conversation-sticky-top > div.conversation-meta.metaline.clearfix > div.conversation-meta-info > span.assignee.pea > img').getAttribute('data-original-title');
        const pathname = location.pathname.split('/')[location.pathname.split('/').length - 1]

        if (chatStatus === 'Ended') {
            localStorage.removeItem('pathname')
            return
        }
        if (pathname === localStorage.getItem('pathname')) { return }
        let messageClose = []
        localStorage.setItem('pathname', pathname)

        const messageCheck = async () => {
            const lastMessage = document.querySelector('#messages-list span > li.message.staff.chat-ui:last-child .message-body > p').innerText
            if (!lastMessage) {return}
            const isCloseMessage = messageClose.includes(lastMessage)

            if (isCloseMessage) {
                const endButton = document.querySelector('#conversation-bulk-actions .btn-group a[data-keyboard-action="end"]')
                await delay(0.5)
                endButton.click()
            }
            if (lastMessage.match(/TR[0-9]/g)) {
                await delay(0.5)
                textarea.value = 'Sayın Üyemiz lütfen Yatırımınızı IBAN ile sağlayınız ve yatırım esnasından çıkan AD-SOYAD ve BANKA bilgilerini teyit ederek yatırım işleminizi onaylayınız'
            }
        }

        const check = () => {
            const agent = document.querySelector('#conversation-sticky-top > div.conversation-meta.metaline.clearfix > div.conversation-meta-info > span.assignee.pea > img').getAttribute('data-original-title').toLowerCase()
            if (declinedAgent.includes(btoa(agent))) {
                localStorage.removeItem('pathname')
                return
            }
            const messageList = document.querySelector('#messages-list span')
            if (!messageList) { return }
            observer.disconnect()
            textarea = document.querySelector('#message_body')
            const jsonShortcuts = JSON.parse(textarea.getAttribute('data-rt-quickinsert'))
            messageClose = messageClose.concat(getCloseMessages(jsonShortcuts))
            const messageObserver = new MutationObserver(messageCheck);
            messageObserver.observe(messageList, config)

            textarea.addEventListener('input', (e) => {
                if (e.target.value.endsWith('""')) {
                    var enterEvents = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true
                        });
                    textarea.value = e.target.value.replace('""', '')
                    textarea.dispatchEvent(enterEvents)
                }
                // console.dir(getShortcuts(jsonShortcuts).find(a => a.shortcut.includes(e.target.value)))
                if (getShortcuts(jsonShortcuts).find(a => a.shortcut.includes(e.target.value))) {
                    e.target.value = getShortcuts(jsonShortcuts).find(a => a.shortcut.includes(e.target.value)).message
                }
                switch (e.target.value) {
                    default:
                        if (getShortcut(jsonShortcuts, e.target.value)) {
                            e.target.value = getShortcut(jsonShortcuts, e.target.value)
                        }
                        break
                }
            })
        }
        const observer = new MutationObserver(check)
        observer.observe(document, config)
    }, 1000)
})();