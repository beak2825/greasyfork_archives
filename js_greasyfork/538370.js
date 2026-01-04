// ==UserScript==
// @name         Myanonamouse - Open All Messages Button
// @namespace    https://www.myanonamouse.net/u/253587
// @version      1.0
// @description  Adds a button to expand all messages at once in the MyAnonamouse inbox/sentbox
// @match        https://www.myanonamouse.net/messages.php*
// @grant        none
// @author       Gorgonian
// @downloadURL https://update.greasyfork.org/scripts/538370/Myanonamouse%20-%20Open%20All%20Messages%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/538370/Myanonamouse%20-%20Open%20All%20Messages%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addOpenAllButton() {
        const checkAllBtn = document.querySelector('.blockBodyCon .tableb input[value="Check all"]');
        if (!checkAllBtn) return false;

        if (document.getElementById('openAllMessagesBtn')) return true;

        const openAllBtn = document.createElement('input');
        openAllBtn.type = 'button';
        openAllBtn.value = 'Open All';
        openAllBtn.id = 'openAllMessagesBtn';
        openAllBtn.style.float = 'left';

        const container = checkAllBtn.parentNode;
        container.insertBefore(openAllBtn, container.firstChild);

        openAllBtn.addEventListener('click', () => {
            const toggleIcons = document.querySelectorAll('a[data-pmid] img[src*="plus.gif"]');
            toggleIcons.forEach(img => {
                if (img.alt === 'Show/Hide') {
                    img.click();
                }
            });
        });

        return true;
    }

    if (addOpenAllButton()) return;

    const targetNode = document.querySelector('.blockBodyCon');
    if (!targetNode) return;

    const observer = new MutationObserver(() => {
        if (addOpenAllButton()) {
            observer.disconnect();
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
})();
