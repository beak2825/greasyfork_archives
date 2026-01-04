// ==UserScript==
// @name         Amazon by Volume
// @namespace    ScriptKing
// @version      2024-08-27
// @description  Shows best picks
// @author       ScriptKing
// @match        https://www.amazon.it/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/505405/Amazon%20by%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/505405/Amazon%20by%20Volume.meta.js
// ==/UserScript==

(function() {
    const calculate = () => {
        var matrix = [...document.querySelector('[class="s-main-slot s-result-list s-search-results sg-row"]').querySelectorAll('[class="sg-col-inner"]')].map(e => {
            const regex = /(\d+,\d+)\s?€\s?\//;
            const match = e.textContent.match(regex);

            if (match && match[1] && e.offsetParent) {
                return [e, parseFloat(match[1].replaceAll('.','').replaceAll(',','.'))]
            } else {
                return null;
            }
        })

        matrix = matrix.filter(e => e != null && e[0] != null && e[0].textContent.indexOf('/unità)') == -1)
        matrix.sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]));
        console.log(matrix)

        matrix.forEach((e,i) => {
            let rank = document.createElement('h2');
            if(i == 0) {
                rank.innerHTML = 'GOLD PRICE'
                e[0].style.background = 'lightgreen'
                rank.style.background = 'gold'
            } else if(i == 1) {
                rank.innerHTML = 'SILVER PRICE'
                e[0].style.background = 'lightgreen'
                rank.style.background = 'silver'
            } else if(i == 2) {
                rank.innerHTML = 'BRONZE PRICE'
                e[0].style.background = 'lightgreen'
                rank.style.background = 'burlywood'
            } else {
                rankp = i + 1
                rank.innerHTML = rankp + ' position'
            }
            e[0].insertBefore(rank, e[0].firstChild);
        })
    }
    window.onload = () => setTimeout(calculate, 1000)
})();