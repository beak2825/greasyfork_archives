// ==UserScript==
// @name        Fishtank Camera Buttons
// @description Show buttons for every camera in the sidebar
// @version     1.0
// @namespace   Visua
// @match       https://www.fishtank.live/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/482705/Fishtank%20Camera%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/482705/Fishtank%20Camera%20Buttons.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';
    function createFishtankButton(text) {
        var button = document.createElement('button');
        button.classList.add('color-button_color-button__cW61T', 'color-button_md__GaczN');

        var img = document.createElement('img');
        img.src = 'https://cdn.fishtank.live/images/slices/console-button-long-gray-4.png';
        button.appendChild(img);

        var textContainer = document.createElement('div');
        textContainer.classList.add('color-button_text__3OQAq');
        textContainer.innerText = text;
        button.appendChild(textContainer);

        return button;
    }

    function addButtons() {
        var roomList = document.createElement('div');
        var sidebar = document.getElementsByClassName('secondary-panel_secondary-panel__vUc65')[0];
        var footer = document.getElementsByClassName('footer_footer__Mnt6p')[0];
        var roomOptions = document.getElementsByClassName('select_options__t1ibN')[0];

        [].forEach.call(roomOptions.children, (option) => {
            var name = option.children[0].innerText;
            if (name == 'Global') {
                return;
            } else if (name == 'Hallway Upstairs') {
                var spacingDiv = document.createElement('div');
                spacingDiv.style.marginTop = '16px';
                roomList.appendChild(spacingDiv);
            }

            var roomButton = createFishtankButton(name);
            roomButton.onclick = () => {
                option.click();
            }
            roomList.appendChild(roomButton);
        });

        sidebar.insertBefore(roomList, footer);
        document.getElementsByClassName('inventory_inventory__7bCIe')[0].remove();
    }

    function init() {
        if (document.getElementsByClassName('select_options__t1ibN')[0]) {
            clearInterval(interval);
            addButtons();
        }
    }

    const interval = setInterval(init, 500);
});
