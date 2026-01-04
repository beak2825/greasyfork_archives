// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Forum user cards
// @description  Forum user cards (temporary fix)
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/forum/*
// @noframes
// @run-at       document-idle
// @grant        none
// @version      1
// @downloadURL https://update.greasyfork.org/scripts/454294/7%20Cups%20-%20Forum%20user%20cards.user.js
// @updateURL https://update.greasyfork.org/scripts/454294/7%20Cups%20-%20Forum%20user%20cards.meta.js
// ==/UserScript==
$('a[data-usercard').each(function () {
    var pop = new bootstrap.Popover(this, {
        content: '<i class="fa-solid fa-xl fa-spinner fa-spin"></i>',
        html: true,
        trigger: 'focus hover'
        })
    var fill = function () {
        $.get('/ajax/userCard.php',
              {s: this.getAttribute('data-usercard')},
              function (card) {pop.setContent({'.popover-body': card})},
              'html')
        this.removeEventListener('show.bs.popover', fill)
        }
    this.addEventListener('show.bs.popover', fill)
    })