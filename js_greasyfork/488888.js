// ==UserScript==
// @name         Guardar tropas
// @namespace    Guardar tropas
// @version      2024-03-03
// @description  Viva el betis
// @author       You
// @match        https://*.grepolis.com/game/*
// @match        http://*.grepolis.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/488888/Guardar%20tropas.user.js
// @updateURL https://update.greasyfork.org/scripts/488888/Guardar%20tropas.meta.js
// ==/UserScript==

// Funciones autoguardado tropas
////////////////////////////////
observerAjax();

function insertCheckboxForUnitSaving() {
    const attackWindow = document.querySelector('.attack_support_window');
    attackWindow.parentElement.parentElement.style.height = '515px'; // Cambia '515px' por la altura deseada
    if (attackWindow && !document.getElementById('checkbox_save_units')) {
        const checkboxHTML = `
            <div id="checkbox_save_units" class="checkbox_new checked green" style="margin-bottom: 10px;">
                <div class="cbx_icon"></div>
                <div class="cbx_caption">Guardar selección de unidades</div>
            </div>`;
        attackWindow.insertAdjacentHTML('afterbegin', checkboxHTML);
        document.getElementById('checkbox_save_units').addEventListener('click', toggleUnitSavingFeature);
    }
}


function toggleUnitSavingFeature() {
    const isChecked = document.getElementById('checkbox_save_units').classList.contains('checked');
    if (isChecked) {
        document.getElementById('checkbox_save_units').classList.remove('checked');
        GM_setValue('unitSavingEnabled', false);
    } else {
        document.getElementById('checkbox_save_units').classList.add('checked');
        GM_setValue('unitSavingEnabled', true);
    }
}


function saveUnitSelections() {
    if (!GM_getValue('unitSavingEnabled', false)){return;}
    const unitSelections = {};
    document.querySelectorAll('.unit_input').forEach(input => {
        const unitType = input.getAttribute('name');
        const unitCount = input.value;
        if (unitType && unitCount && unitCount > 0) {
            unitSelections[unitType] = unitCount;
        }
    });
    GM_setValue('savedUnitSelections', JSON.stringify(unitSelections));
}


function loadUnitSelections() {
    if (!GM_getValue('unitSavingEnabled', false)) {return;}
    const savedUnitSelections = JSON.parse(GM_getValue('savedUnitSelections', '{}'));
    Object.keys(savedUnitSelections).forEach(unitType => {
        const input = document.querySelector(`.unit_input[name="${unitType}"]`);

        if (input) {
            input.value = savedUnitSelections[unitType];
            input.dispatchEvent(new Event('change'));
        }
    });
}

function attachListeners() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Asegúrate de que el nodo agregado es un elemento
                if (node.nodeType === 1) {
                    // Busca todos los botones en el nodo agregado y en sus descendientes
                    node.querySelectorAll('a.button').forEach(button => {
                        if (button.textContent.trim() === "Reforzar") {
                            // Añade el evento click aquí
                            button.addEventListener('click', function(e) {
                                e.preventDefault();

                                saveUnitSelections();
                                setTimeout(() => {
                                    loadUnitSelections();
                                }, 200);
                            });

                        }
                    });
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const attackButton = document.querySelector('#btn_attack_town');

    if (attackButton) {
        attackButton.addEventListener('click', function(e) {

            e.preventDefault();
            saveUnitSelections();

            setTimeout(() => {
                loadUnitSelections();
            }, 200);
        });
    } else {
    }
}


// Función encargada de interceptar los cambios en la página.
/////////////////////////////////////////////////////////////
function observerAjax() {
    $(document).ajaxComplete(function (e, xhr, opt) {
        var url = opt.url.split("?"), action = "";
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        switch (action) {
            case "/town_info/attack":
                attachListeners();
                insertCheckboxForUnitSaving();

                break;
            case "/town_info/support":
                attachListeners();
                insertCheckboxForUnitSaving();

                break;
        }
    });
}

