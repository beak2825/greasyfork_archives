// ==UserScript==
// @name         Unlock photo Ayaznal.ru
// @namespace    http://tampermonkey.net/
// @version      2024-12-14
// @description  Unlock photo
// @author       Vierta
// @match        https://ayaznal.ru/photo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ayaznal.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515231/Unlock%20photo%20Ayaznalru.user.js
// @updateURL https://update.greasyfork.org/scripts/515231/Unlock%20photo%20Ayaznalru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function funcPass() {
        document.getElementById("pass_x").style.display = "none";

        document.getElementById("pass_password").value = "";

        document.querySelector('.remodal-close').click();

        let polomanPro = document.getElementById("poloman_pro");
        if (polomanPro) {
            polomanPro.classList.add('pass_view_photo');
            polomanPro.classList.remove('pass_noview_photo');
        }

        document.body.classList.add('pass_view_ph');
        document.body.classList.remove('pass_noview_ph');
    }

    funcPass();
})();