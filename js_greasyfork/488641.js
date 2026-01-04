// ==UserScript==
// @name         Display Ora corrente con Milliseconds and AM/PM
// @namespace    https://greasyfork.org/users/237458
// @version      0.3
// @description  Visualizza l'ora corrente in millisecondi e nel formato AM/PM (2024)
// @author       figuccio
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon         data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488641/Display%20Ora%20corrente%20con%20Milliseconds%20and%20AMPM.user.js
// @updateURL https://update.greasyfork.org/scripts/488641/Display%20Ora%20corrente%20con%20Milliseconds%20and%20AMPM.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var $ = window.jQuery;
    let use24HourFormat = false; // Variabile per il formato dell'orario

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        if (!use24HourFormat) {
            hours = hours % 12;
            hours = hours ? hours : 12; // Formato a 12 ore
        }

        const timeString = hours.toString().padStart(2, '0') + ':' +
                           minutes.toString().padStart(2, '0') + ':' +
                           seconds.toString().padStart(2, '0') + ':' +
                           milliseconds.toString().padStart(3, '0') +
                           (use24HourFormat ? '' : ' ' + ampm);

        return timeString;
    }

    function displayTime() {
        const timeContainer = $('<div id="test" aria-label="Orario corrente"></div>');
        const savedPosition = GM_getValue('timeContainerPosition');
        if (savedPosition) {
            const [top, left] = savedPosition.split(',');
            timeContainer.css({
                'position': 'fixed',
                'top': top,
                'left': left
            });
        } else {
            timeContainer.css({
                'position': 'fixed',
                'top': '10px',
                'left': '10px'
            });
        }
        timeContainer.css({
            'background': 'black',
            'padding': '5px',
            'border': '2px solid gold',
            'borderRadius': '5px',
            'fontFamily': 'Arial, sans-serif',
            'fontSize': '14px',
            'color': 'lime',
            'zIndex': '9999',
            'cursor': 'move',
            'width': '110px'
        });
        $('body').append(timeContainer);

        timeContainer.draggable({
            stop: function() {
                savePosition(timeContainer);
            }
        });

        setInterval(function() {
            timeContainer.text(getCurrentTime()); // Mostra il tempo corrente
        }, 90); // Aggiorna ogni 90 ms
    }

    function savePosition(element) {
        const top = element.css('top');
        const left = element.css('left');
        GM_setValue('timeContainerPosition', `${top},${left}`);
    }

    // Aggiunge il comando per cambiare formato
    GM_registerMenuCommand('Cambia formato orario', function() {
        use24HourFormat = !use24HourFormat;
        alert('Formato orario cambiato a ' + (use24HourFormat ? '24 ore' : '12 ore'));
    });

    GM_registerMenuCommand('Mostra/Nascondi Pulsante', function() {
        const timeContainer = $('#test');
        timeContainer && timeContainer.toggle();
    });

    displayTime();
})();

