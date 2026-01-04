// ==UserScript==
// @name         Tabele-kaloriinoinputs
// @namespace    https://www.tabele-kalorii.pl/
// @version      0.1
// @description  Dodaje opcje po kliknięciu na komórkę `Waga` by zamienić pola input na tekst z wartością, dzięki czemu można kopiować do sheets.google.com
// @author       engineering-this
// @match        https://www.tabele-kalorii.pl/*
// @downloadURL https://update.greasyfork.org/scripts/367749/Tabele-kaloriinoinputs.user.js
// @updateURL https://update.greasyfork.org/scripts/367749/Tabele-kaloriinoinputs.meta.js
// ==/UserScript==

(function(){
    const button = document.querySelector( '#kalkulatorKalorii table' ).tBodies[0].firstChild.querySelector(':nth-child(2)');

    button.addEventListener('click',()=>{
        [].forEach.call( document.querySelector( '#kalkulatorKalorii table' ).querySelectorAll('input[name="waga"]'), (item)=>{
	        item.parentElement.outerHTML = `<span>${item.value}</span>`;
        });
    });
    button.style.background='lightblue';
})();
