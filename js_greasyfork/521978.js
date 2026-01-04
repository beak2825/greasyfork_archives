// ==UserScript==
// @name         Drawaria Keep Buttons Enabled Uptaded
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  All buttons enabled kickbutton, hidedrawing, mutebutton, reportbutton + Added drawcontrols and chatbox_textinput!
// @author       YouTube
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521978/Drawaria%20Keep%20Buttons%20Enabled%20Uptaded.user.js
// @updateURL https://update.greasyfork.org/scripts/521978/Drawaria%20Keep%20Buttons%20Enabled%20Uptaded.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Función para eliminar el atributo 'required' de los campos del formulario
    function removeRequiredAttributes() {
        // Seleccionar el campo de selección (dropdown)
        const reportReasonSelect = document.getElementById('report-reason');
        if (reportReasonSelect) {
            reportReasonSelect.removeAttribute('required');
        }

        // Seleccionar el campo de texto (textarea)
        const reportCommentsTextarea = document.getElementById('report-comments');
        if (reportCommentsTextarea) {
            reportCommentsTextarea.removeAttribute('required');
        }
    }

    // Función para mantener los botones habilitados
    function keepButtonsEnabled() {
        const buttons = document.querySelectorAll(
            'button.btn.btn-primary.btn-block.pgdrawbutton,' +
            'button.btn.btn-primary.btn-block.spawnavatarbutton,' +
            'button#sendtogallery,' +
            'button.btn.btn-light.btn-block.btn-sm.kickbutton,' +
            'button.btn.btn-light.btn-block.btn-sm.hidedrawing,' +
            'button.btn.btn-light.btn-block.btn-sm.mutebutton,' +
            'button.btn.btn-light.btn-block.btn-sm.reportbutton,' +
            'button#roomlist-refresh' // Added the new button
        );
        buttons.forEach(button => {
            button.disabled = false;
            button.removeAttribute('disabled');
            button.style.pointerEvents = 'auto'; // Asegura que el botón sea clickeable
        });
    }

    // Función para mantener el popover-body visible
    function keepPopoverBodyVisible() {
        const popoverBody = document.querySelector('.popover-body');
        if (popoverBody) {
            popoverBody.style.display = 'block';
        }
    }

    // Ejecutar las funciones inicialmente
    keepButtonsEnabled();
    keepPopoverBodyVisible();

    // Observar cambios en el DOM para mantener los botones habilitados y el popover-body visible
    const observer = new MutationObserver(() => {
        keepButtonsEnabled();
        keepPopoverBodyVisible();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    // También puedes agregar un intervalo para asegurarte de que los botones y el popover-body se mantengan habilitados/visibles
    setInterval(() => {
        keepButtonsEnabled();
        keepPopoverBodyVisible();
    }, 1000);

    // Interceptar el evento click para asegurar que los botones siempre estén habilitados
    document.addEventListener('click', function(event) {
        if (event.target && event.target.matches(
            'button.btn.btn-primary.btn-block.pgdrawbutton,' +
            'button.btn.btn-primary.btn-block.spawnavatarbutton,' +
            'button#sendtogallery,' +
            'button.btn.btn-light.btn-block.btn-sm.kickbutton,' +
            'button.btn.btn-light.btn-block.btn-sm.hidedrawing,' +
            'button.btn.btn-light.btn-block.btn-sm.mutebutton,' +
            'button.btn.btn-light.btn-block.btn-sm.reportbutton,' +
            'button#roomlist-refresh' // Added the new button
        )) {
            event.target.disabled = false;
            event.target.removeAttribute('disabled');
            event.target.style.pointerEvents = 'auto';
        }
    }, true);

    // Ejecutar la función cuando el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            removeRequiredAttributes();
            // Esperar a que el modal se abra y luego simular el clic
            const modal = document.querySelector('.modal-dialog');
            if (modal) {
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'class' && modal.classList.contains('show')) {
                        }
                    });
                });
                observer.observe(modal, { attributes: true });
            }
        });
    } else {
        removeRequiredAttributes();
        // Esperar a que el modal se abra y luego simular el clic
        const modal = document.querySelector('.modal-dialog');
        if (modal) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class' && modal.classList.contains('show')) {
                    }
                });
            });
            observer.observe(modal, { attributes: true });
        }
    }

    // Función para habilitar los botones y el chat
    function enableElements() {
        // Habilitar botones
        var disabledButtons = document.querySelectorAll('.drawcontrols-button.drawcontrols-disabled');
        disabledButtons.forEach(function(button) {
            button.classList.remove('drawcontrols-disabled');
        });

        // Habilitar chat
        var chatInput = document.getElementById('chatbox_textinput');
        if (chatInput && chatInput.disabled) {
            chatInput.disabled = false;
            chatInput.style.border = '1px solid aqua'; // Restaurar el estilo del borde
        }
    }

    // Ejecutar la función de habilitación de elementos cada segundo
    setInterval(enableElements, 1000);

    // Observar cambios en el DOM para habilitar los elementos si es necesario
    var observer1 = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && (mutation.target.id === 'chatbox_textinput' || mutation.target.classList.contains('drawcontrols-button'))) {
                enableElements();
            }
        });
    });

    observer1.observe(document.body, { attributes: true, childList: true, subtree: true });
})();
