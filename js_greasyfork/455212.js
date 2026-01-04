// ==UserScript==
// @name    Auto-desbloqueio do Koo
// @name:en    Self Unblock from Koo
// @namespace    https://geovani.dev/
// @version    0.2
// @description    Só para se auto-desbloquear no Koo!
// @description:en    Just for self unblocking!
// @author    Geovani Perez França
// @match    https://www.kooapp.com/*
// @icon    https://www.google.com/s2/favicons?sz=64&domain=kooapp.com
// @grant    none
// @keywords    koo,lock,self,unlock
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/455212/Auto-desbloqueio%20do%20Koo.user.js
// @updateURL https://update.greasyfork.org/scripts/455212/Auto-desbloqueio%20do%20Koo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        addButton('Se desbloquear', selfUnblock)
    })

    function addButton(text, onclick) {
        let kooBtn = document.querySelector('a > button')

        let unblockA = document.createElement('a')
        document.body.append(unblockA)
        unblockA.innerHTML = `<button class="${kooBtn.classList.toString()}">${text}</button>`
        unblockA.onclick = onclick
        unblockA.style = "position: absolute; top: 1em; left: 1em; z-index: 999;"
        return unblockA
    }

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
    }

    function selfUnblock(element) {
        let id = getCookie("userId");
        let token = getCookie("token");

        fetch('/apiV1/users/unblock/' + id, {
            method: 'DELETE',
            headers: {token}
        })

        alert("Prontinho, seu koo tá desbloqueado!")
    }

})();