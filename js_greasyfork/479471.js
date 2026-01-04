// ==UserScript==
// @name         Przenośnik Synergia
// @namespace    https://github.com/Chinchillus/
// @version      0.7
// @description  Przenosi z wkurwiających milionów okienek do planu lekcji z "nowego" UI
// @license MIT
// @author       Chinchill
// @match        https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/error
// @match        https://portal.librus.pl/rodzina
// @match        https://synergia.librus.pl/uczen/index
// @match        https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/lekcje/plan-lekcji
// @downloadURL https://update.greasyfork.org/scripts/479471/Przeno%C5%9Bnik%20Synergia.user.js
// @updateURL https://update.greasyfork.org/scripts/479471/Przeno%C5%9Bnik%20Synergia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === 'https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/error') {
        window.location.href = 'https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/lekcje/plan-lekcji';
    } else if (window.location.href === 'https://portal.librus.pl/rodzina') {
        window.location.href = 'https://portal.librus.pl/rodzina/synergia/loguj';
    } else if (window.location.href === 'https://synergia.librus.pl/uczen/index') {
        window.location.href = 'https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/powiadomienia';
    } else if (window.location.href === 'https://synergia.librus.pl/gateway/ms/studentdatapanel/ui/lekcje/plan-lekcji') {

        function injectStyles() {
            var style = document.createElement('style');
            style.textContent = '.MuiTypography-root.MuiTypography-subtitle2 { color: red !important; }';
            document.head.appendChild(style);
        }

        injectStyles();
    }
})();
