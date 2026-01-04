// ==UserScript==
// @name         Orna Assess
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adiciona opção de avaliar o item no codex oficial do Orna/Aethric
// @author       Azmuth
// @match        https://playorna.com/codex/items/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playorna.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.16.0/dist/sweetalert2.all.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526386/Orna%20Assess.user.js
// @updateURL https://update.greasyfork.org/scripts/526386/Orna%20Assess.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.clear = () => {}

    const Swal = Sweetalert2

    let attribute
    let original
    let compare

    window._qualify = function(value, att) {
        compare = Number(prompt(`Digite o atributo ${att.toUpperCase()} do seu item:`))
        Swal.fire({
            title: `${Number(compare*100/value).toFixed(2)}%`,
            text: "Esta é a qualidade aproximada do seu item",
            icon: "success"
        });
    }

    $('.codex-stat').each(
        function(i, data) {
            attribute = /\D+(?=\:)/.exec(data.innerText)
            original  = /[\-0-9]+/.exec(data.innerText)

            if (/^(Ataque|Magia|Resistencia|Defesa|Guarda|HP|Mana|Destreza)/.test(data.innerText)) {
                data.innerHTML += `<button onclick="_qualify(${Number(original)}, '${attribute}')">Assess</button>`
            }
        }
    )
})();