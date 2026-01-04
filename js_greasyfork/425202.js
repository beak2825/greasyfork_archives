// ==UserScript==
// @name         </> Kurt & Java Ekran Görüntüsü Modu
// @namespace    http://tampermonkey.net/
// @version      24.5
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425202/%3C%3E%20Kurt%20%20Java%20Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC%20Modu.user.js
// @updateURL https://update.greasyfork.org/scripts/425202/%3C%3E%20Kurt%20%20Java%20Ekran%20G%C3%B6r%C3%BCnt%C3%BCs%C3%BC%20Modu.meta.js
// ==/UserScript==

window.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 27:
            var mb = document.getElementsByClassName("hud")[0];
            if (mb.style.display === "none") {
                mb.style.display = "block";
            } else {
                mb.style.display = "none";
            }
            break;
    }
})