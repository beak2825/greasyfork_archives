// ==UserScript==
// @name         AFO - mini-hitboxes
// @namespace    http://tampermonkey.net/
// @version      0.45
// @description  Inscription automatique aux mini-hitboxes
// @author       Flamby67
// @match        https://all-for-one.fr/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32502/AFO%20-%20mini-hitboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/32502/AFO%20-%20mini-hitboxes.meta.js
// ==/UserScript==

(function() {
    // request permission on page load
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

    function notifyMiniHitBox() {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification('All For One', {
                icon: 'https://all-for-one.fr/apple-touch-icon-57x57.png',
                body: "Mini-hitbox disponible !",
                tag: "AFOMiniHitbox"
            });

            notification.onclick = function () {
                window.focus();
                notification.close();
                this.cancel();
            };
        }
    }

    $(document).ready(function() {
        setInterval(function ()
                    {
            if ($(".valid").is(":visible"))
            {
                //alert("Mini-hitbox");
                notifyMiniHitBox();
            }
        }, 15000);
    });
})();