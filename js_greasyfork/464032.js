// ==UserScript==
// @name         Ustawiacz daty
// @namespace    PrzystanMedyczna
// @version      1.1
// @description  Ustaw datę wizyty w serum
// @homepageURL  https://greasyfork.org/en/scripts/464032-ustawiacz-daty
// @author       Jedrzej Kubala
// @match        https://serum.com.pl/dpls/rm/ex.act
// @icon         https://serum.com.pl/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464032/Ustawiacz%20daty.user.js
// @updateURL https://update.greasyfork.org/scripts/464032/Ustawiacz%20daty.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = '<style>#date_setter{position: fixed; z-index: 99999; top: 72px; right: 2%; background-color: #ff0081; padding: 10px 15px; border-radius: 4px; border: none; box-shadow: 0 2px 25px rgba(255,0,130,.5); font-size: 14px; -webkit-animation: bounce 1s 3;}.date_setter_collapsed{font-size: 10px!important;opacity: 0.6;background-color: #f35aa7!important;}.date_setter_prompt{text-align: center; color: #fff; margin-bottom: 7px;}.date_setter_input{background-color: #f1bed8; border-radius: 6px; border-width: 0; border-style: solid; padding: 5px 10px; margin: 0 3px; box-shadow: inset 0 0 5px #ff0081; color: #880848;}.date_setter_collapsed .date_setter_input{display:none;}.date_setter_collapsed #date_setter_collapse_expand{margin-left: 8px; height: 15px;}#date_setter_collapse_expand{fill: #fff; display: inline-block; float: right; margin-left: 10px;}.date_setter_input:focus{outline: #945474 solid 2px;}.date_setter_short{width: 35px;}.date_setter_long{width: 50px;}@-webkit-keyframes bounce{0%{top:70px;}25%, 75%{top:65px;}50%{top:60px;}100%{top:75px;}}</style>'
    const widgetHtml = '<div id="date_setter"> <div class="date_setter_prompt"> <span>Ustaw datę wizyt</span> <svg id="date_setter_collapse_expand" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg> </div><input class="date_setter_input date_setter_short" id="date_setter-day"> <input class="date_setter_input date_setter_short" id="date_setter-month"> <input class="date_setter_input date_setter_long" id="date_setter-year"></div>'
    const chevronDown = '<path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/>'
    const chevronUp = '<path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/>'

    const IDS_DAYS = ['gab_dok_data_wykonania_od_d', 'gab_dok_data_wykonania_d', 'wize_data_roz_wizyty_d', 'wize_data_zak_wizyty_d'];
    const IDS_MONTHS = ['gab_dok_data_wykonania_od_m', 'gab_dok_data_wykonania_m', 'wize_data_roz_wizyty_m', 'wize_data_zak_wizyty_m'];
    const IDS_YEARS = ['gab_dok_data_wykonania_od_r', 'gab_dok_data_wykonania_r', 'wize_data_roz_wizyty_r', 'wize_data_zak_wizyty_r'];

    let widgetActive = true;

    function injectWidget() {
        const body = document.getElementsByTagName('body')[0];
        body.insertAdjacentHTML('beforeend', style + widgetHtml);
        $('date_setter-day').value = ('0' + new Date().getDate()).slice(-2);
        $("date_setter-month").value = ('0' + (new Date().getMonth() + 1)).slice(-2);
        $("date_setter-year").value = new Date().getFullYear();
        $("date_setter_collapse_expand").addEventListener('click', collapseWidget, false);
        addMutationObserver();
    }

    function collapseWidget() {
        $("date_setter").classList.add("date_setter_collapsed");
        widgetActive = false;
        const chevronIcon = $("date_setter_collapse_expand");
        chevronIcon.innerHTML = chevronDown;
        chevronIcon.removeEventListener('click', collapseWidget, false);
        chevronIcon.addEventListener('click', expandWidget, false);
    }

    function expandWidget() {
        $("date_setter").classList.remove("date_setter_collapsed");
        widgetActive = true;
        const chevronIcon = $("date_setter_collapse_expand");
        chevronIcon.innerHTML = chevronUp;
        chevronIcon.removeEventListener('click', expandWidget, false);
        chevronIcon.addEventListener('click', collapseWidget, false);
        adjustDate();
    }

    function adjustDate() {
        if (!widgetActive) return;
        IDS_DAYS.forEach(id => {
            let field = $(id);
            if (field) field.value = $('date_setter-day').value;
        })
        IDS_MONTHS.forEach(id => {
            let field = $(id);
            if (field) field.value = $('date_setter-month').value;
        })
        IDS_YEARS.forEach(id => {
            let field = $(id);
            if (field) field.value = $('date_setter-year').value;
        })
    }

    function addMutationObserver() {
        const targetNode = document.getElementsByTagName('body')[0];
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.addedNodes.length && mutation.addedNodes[0].classList &&
                    mutation.addedNodes[0].classList.length && mutation.addedNodes[0].classList.contains('pas_win')
                ) {
                    adjustDate();
                }
            }
        };
        const obs = new MutationObserver(callback);
        obs.observe(targetNode, config);
    }

    injectWidget();
})();
