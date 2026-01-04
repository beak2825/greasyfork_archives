// ==UserScript==
// @name         myrealvida.monkey
// @namespace    https://github.com/lucascudo/myrealvida.monkey
// @version      1.0
// @description  Facilite sua vida ao acessar https://myrealvida.pt/ com este script para Greasemonkey ou Tampermonkey!.
// @author       https://github.com/lucascudo
// @match        https://myrealvida.pt/resgates/ResgatesFinanceiros
// @match        https://myrealvida.pt/seguros/capitalizacao
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417871/myrealvidamonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/417871/myrealvidamonkey.meta.js
// ==/UserScript==

(function() {
    let total = 0;
    setInterval(() => Array.from(document.querySelectorAll(".movimentos-item")).reverse().forEach((movimento, idx, array) => {
        if (movimento.children.length > 2) {
            return;
        }
        let value = parseFloat(movimento.children[1].children[0].innerText.replace('€', '').replace(',', '.').trim());
        let op = movimento.children[1].children[1].classList[3];
        if (op === 'positivo') {
            total += value;
        } else if (op === 'negativo') {
            total -= value;
        }
        const subtotal = document.createElement('div');
        subtotal.innerHTML = '<b>' + total.toFixed(2).toString().replace('.', ',') + ' €</b>';
        subtotal.className = 'col-xs-4 col-sm-3 text-right';
        movimento.appendChild(subtotal);
        const header = document.querySelector('.movimentos-header');
        if (idx === array.length - 1 && header.children.length === 2) {
            const title = document.createElement('div');
            title.innerText = 'SUBTOTAL';
            title.className = 'col-xs-4 col-sm-3 movimento-valor';
            header.appendChild(title);
        }
    }), 3000);
})();
