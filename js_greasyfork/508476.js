// ==UserScript==
// @name         GC - Throw Slorg at Neofriend Button
// @namespace    https://greasyfork.org/en/users/1251911
// @version      0.6
// @description  Adds Throw at Neofriend action to the inventory menu
// @author       Teffy
// @match        https://www.grundos.cafe/inventory/
// @match        www.grundos.cafe/inventory/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508476/GC%20-%20Throw%20Slorg%20at%20Neofriend%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/508476/GC%20-%20Throw%20Slorg%20at%20Neofriend%20Button.meta.js
// ==/UserScript==

(function() {
    const username = 'Teffy'; // Replace 'Teffy' with the desired username
    const SlorgArray = ['Red Slorg', 'Snow Slorg', 'Slorg'];

    document.querySelectorAll('.inv-dropdown-menu').forEach(menu => {
        const itemText = menu.querySelector('p').textContent.trim();

        if (SlorgArray.some(slorg => itemText.includes(slorg))) {
            const button = menu.querySelector('button[onclick]');
            const id = button.getAttribute('onclick').match(/['"]([a-f0-9\-]+)['"]/)[1];

            const throwButton = document.createElement('button');
            throwButton.setAttribute('onclick', `const newWindow = window.open('https://www.grundos.cafe/useobject/${id}/?action=throw&key=slorg', 'newwindow', 'width=425,height=600');
                newWindow.onload = function() {
                    const inputField = newWindow.document.getElementById('recip');

                    if (inputField) {
                        inputField.value = '${username}';
                    }
                }; return false;`);
            throwButton.innerHTML = `
                <img src="https://grundoscafe.b-cdn.net/items/hall_petpet1.gif" alt="Throw Icon" class="dropdown-icon"> Throw at Neofriend
            `;

            const targetButton = Array.from(menu.querySelectorAll('button')).find(button =>
                button.textContent.includes("Send One as Gift") || button.textContent.includes("Send as Gift")
            );
            menu.insertBefore(throwButton, targetButton.nextSibling);
        }
    });
})();
