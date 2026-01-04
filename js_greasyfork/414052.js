// ==UserScript==
// @name         BarcsihirekPhotoFS
// @namespace    https://greasyfork.org/en/users/697139-labuwx
// @version      0.1
// @description  Full size photos on www.barcsihirek.hu
// @author       labuwx
// @match        http://www.barcsihirek.hu/hirek/*/*
// @match        https://www.barcsihirek.hu/hirek/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414052/BarcsihirekPhotoFS.user.js
// @updateURL https://update.greasyfork.org/scripts/414052/BarcsihirekPhotoFS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var img = document.querySelector('.field-type-image.field-name-field-image img');
    if (!img) {
        return;
    }

    var photoURL = new URL(img.src);
    if (photoURL.hostname !== "www.barcsihirek.hu") {
        return;
    }

    var photoFileName = photoURL.pathname.split("/").pop();
    var fullsizePhotoURL = "http://www.barcsihirek.hu/sites/default/files/field/image/" + photoFileName;

    var a = document.createElement('a');
    a.href = fullsizePhotoURL;
    img.parentNode.appendChild(a);
    a.appendChild(img);
})();
