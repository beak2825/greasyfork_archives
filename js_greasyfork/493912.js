// ==UserScript==
// @name         Смартфон vivo
// @description  vivo
// @version      1.2
// @author       skyenot
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace    https://greasyfork.org/users/1295591
// @downloadURL https://update.greasyfork.org/scripts/493912/%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD%20vivo.user.js
// @updateURL https://update.greasyfork.org/scripts/493912/%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD%20vivo.meta.js
// ==/UserScript==

;(function() {
    window.setTimeout(() => {
        ;(function(open) {
            XMLHttpRequest.prototype.open = function() {
                this._url = arguments[1]
                return open.apply(this, arguments)
            }
        })(XMLHttpRequest.prototype.open)
        ;(function(send) {
            XMLHttpRequest.prototype.send = function(body) {
                if (typeof body === 'string') {
                    if (body.includes('message_html') && !this._url.includes('save-draft')) {
                        const insertBeforePos = body.lastIndexOf('%3C%2Fp%3E')
                        const vivo = '%3Cbr%3E%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%E2%80%94%3Cbr%3EСмартфон vivo'
                        const string = body.slice(0, insertBeforePos) + vivo + body.slice(insertBeforePos, body.length)
                        send.call(this, string)
                    } else if (body.includes('message') && body.includes('roomId')) {
                        const insertBeforePos = body.indexOf('&roomId')
                        const string = body.slice(0, insertBeforePos) + '%20%7C%20Смартфон vivo' + body.slice(insertBeforePos, body.length)
                        send.call(this, string)
                    } else {
                        send.call(this, body)
                    }
                } else {
                    send.call(this, body)
                }
            }
        })(XMLHttpRequest.prototype.send)
    }, 500);
})();