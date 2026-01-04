// ==UserScript==
// @name         Capytale Jupyter Notebook : more tools
// @namespace    http://tampermonkey.net/
// @version      2025-01-20d
// @description  New features for Capytale's Jupyter's notebooks : (1) admonition's question quick add, (1) admonition's note quick add, (3) Admonition's spoiler button feature, (4) restart & clear all cells outputs shortcut
// @author       James Web (in the area)
// @supportURL   https://codeberg.org/jrm-omg/userscripts
// @include      https://capytale2.ac-paris.fr/p/basthon/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524061/Capytale%20Jupyter%20Notebook%20%3A%20more%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/524061/Capytale%20Jupyter%20Notebook%20%3A%20more%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Wait until Basthon's ready
    let ticTac;
    function myCallback() {
        if (document.querySelector('#MathJax_Message')) {
            // Basthon is ready, go go go !
            clearInterval(ticTac);

            // (1) Admonition's question button feature
            function addAdmoQuestion() {
                let cell = Jupyter.notebook.insert_cell_below('markdown')
                cell.set_text('!!! question\n\n!!!')
            }
            let qEl = document.createElement('button');
            qEl.className = 'btn btn-default';
            qEl.title = 'Ajouter une admonition « question » après la cellule active';
            qEl.innerHTML = '<i class="fa-question-circle fa"></i>';
            qEl.addEventListener('click', addAdmoQuestion);

            // (2) Admonition's note button feature
            function addAdmoNote() {
                let cell = Jupyter.notebook.insert_cell_below('markdown')
                cell.set_text('!!! note\n\n!!!')
            }
            let nEl = document.createElement('button');
            nEl.className = 'btn btn-default';
            nEl.title = 'Ajouter une admonition « note » après la cellule active';
            nEl.innerHTML = '<i class="fa-pencil fa"></i>';
            nEl.addEventListener('click', addAdmoNote);

            // (3) Admonition's spoiler button feature
            function addAdmoSpoiler() {
                let cell = Jupyter.notebook.insert_cell_below('markdown')
                cell.set_text('??? quote Indice *— à ouvrir uniquement en cas de difficultés*\n\n???')
            }
            let sEl = document.createElement('button');
            sEl.className = 'btn btn-default';
            sEl.title = 'Ajouter une admonition « spoiler » après la cellule active';
            sEl.innerHTML = '<i class="fa-envelope-o fa"></i>';
            sEl.addEventListener('click', addAdmoSpoiler);

            // (4) Restart & clear all cells outputs shortcut
            function restartAndClean() {
                document.querySelector('#restart_run_all').click();
                setTimeout(()=>{
                    document.querySelector('.modal-footer .btn-danger').click();
                    setTimeout(()=>{
                        document.querySelector('#restart_clear_output').click();
                        setTimeout(()=>{
                            document.querySelector('.modal-footer .btn-danger').click();
                        }, 500)
                    }, 500)
                }, 500)
            }
            let rEl = document.createElement('button');
            rEl.className = 'btn btn-default';
            rEl.title = 'Tout exécuter + Effacer les sorties';
            rEl.innerHTML = '<i class="fa-truck fa"></i>';
            rEl.addEventListener('click', restartAndClean);

            // Hiding the #cmd_palette .btn-group (to get more space)
            document.querySelector('#cmd_palette').style.display = 'none';

            // Insert new buttons inside the user-scripts-group
            let usgEl = document.querySelector('.user-scripts-group');
            if (!usgEl) {
                usgEl = document.createElement('div');
                usgEl.className = 'btn-group user-scripts-group';
                document.querySelector('#maintoolbar-container').append(usgEl);
            }
            usgEl.append(qEl);
            usgEl.append(nEl);
            usgEl.append(sEl);
            usgEl.append(rEl);
        }
    }
    ticTac = setInterval(myCallback, 500);
})();