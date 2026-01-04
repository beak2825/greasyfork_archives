// ==UserScript==
// @name         PenguinMod stylish single-tabbed addons
// @namespace    https://studio.penguinmod.com
// @version      2025-01-25
// @description  Makes the addons page open in a stylish iframe instead of in a new tab.
// @author       Pooiod7
// @match        https://studio.penguinmod.com/editor.html
// @match        https://studio.penguinmod.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524781/PenguinMod%20stylish%20single-tabbed%20addons.user.js
// @updateURL https://update.greasyfork.org/scripts/524781/PenguinMod%20stylish%20single-tabbed%20addons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const AddonsButton = Array.from(document.querySelectorAll('div')).find(btn => {
            const div = btn.querySelector('div');
            const span = div?.querySelector('span');
            if (span?.textContent.trim() === 'Addons') {
                return btn;
            }
        });
        const existingButton = document.getElementById("StylishAddonsButton");

        if (AddonsButton && !existingButton) {
            const newAddonsButton = AddonsButton.cloneNode(true);
            newAddonsButton.id = "StylishAddonsButton";
            AddonsButton.parentNode.replaceChild(newAddonsButton, AddonsButton);

            newAddonsButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                if (document.getElementById("widgetoverlay")) return;

                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 195, 255, 0.7)';
                overlay.style.zIndex = '9999';
                overlay.id = "widgetoverlay";

                const wrapper = document.createElement('div');
                wrapper.style.position = 'absolute';
                wrapper.style.top = "50%";
                wrapper.style.left = "50%";
                wrapper.style.transform = 'translate(-50%, -50%)';
                wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
                wrapper.style.borderRadius = '13px';
                wrapper.style.padding = '0px';
                wrapper.style.width = '70vw';
                wrapper.style.height = '80vh';

                const modal = document.createElement('div');
                modal.style.backgroundColor = 'var(--ui-primary, white)';
                modal.style.padding = '0px';
                modal.style.borderRadius = '10px';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.textAlign = 'center';

                wrapper.appendChild(modal);

                const title = document.createElement('div');
                title.style.position = 'absolute';
                title.style.top = '0';
                title.style.left = '0';
                title.style.width = '100%';
                title.style.height = '50px';
                title.style.backgroundColor = 'rgb(0, 195, 255)';
                title.style.display = 'flex';
                title.style.justifyContent = 'center';
                title.style.alignItems = 'center';
                title.style.color = 'white';
                title.style.fontSize = '24px';
                title.style.borderTopLeftRadius = '10px';
                title.style.borderTopRightRadius = '10px';
                title.innerHTML = "Addons";

                const iframe = document.createElement('iframe');
                iframe.src = '/addons.html';
                iframe.style.width = '100%';
                iframe.style.height = `calc(100% - 50px)`;
                iframe.style.marginTop = '50px';
                iframe.style.border = 'none';
                iframe.style.borderBottomLeftRadius = '10px';
                iframe.style.borderBottomRightRadius = '10px';
                modal.appendChild(iframe);

                const closeButton = document.createElement('div');
                closeButton.setAttribute('aria-label', 'Close');
                closeButton.classList.add('close-button_close-button_lOp2G', 'close-button_large_2oadS');
                closeButton.setAttribute('role', 'button');
                closeButton.setAttribute('tabindex', '0');
                closeButton.innerHTML = '<img class="close-button_close-icon_HBCuO" src="data:image/svg+xml,%3Csvg%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%207.48%207.48%22%3E%3Cpath%20d%3D%22M3.74%206.48V1M1%203.74h5.48%22%20style%3D%22fill%3Anone%3Bstroke%3A%23fff%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A2px%22%2F%3E%3C%2Fsvg%3E">';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '50%';
                closeButton.style.right = '10px';
                closeButton.style.transform = 'translateY(-50%)';
                closeButton.style.zIndex = '1000';
                closeButton.addEventListener('click', () => {
                    document.body.removeChild(overlay);
                });
                title.appendChild(closeButton);

                modal.appendChild(title);
                overlay.appendChild(wrapper);
                document.body.appendChild(overlay);

                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                    }
                });
            });
        }
    }, 1000);
})();