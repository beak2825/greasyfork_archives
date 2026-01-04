// ==UserScript==
// @name         Ekşi Sözlük - her zamanki görünüme dön
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Ekşi Sözlük sitesinde her zamanki görünüme dön butonuna otomatik tıklar
// @author       You
// @include        /^https?://eksisozluk.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk2023.com
// @grant        none
// @license N/A
// @downloadURL https://update.greasyfork.org/scripts/465856/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20-%20her%20zamanki%20g%C3%B6r%C3%BCn%C3%BCme%20d%C3%B6n.user.js
// @updateURL https://update.greasyfork.org/scripts/465856/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20-%20her%20zamanki%20g%C3%B6r%C3%BCn%C3%BCme%20d%C3%B6n.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let duration = 0;
    const asd = setInterval(function () {
        duration += 100;
        let xyz = document.querySelector('#return-to-innocence')
        if(xyz){
            xyz.click()
            clearInterval(asd)
        } else if(duration > 3000)
            clearInterval(asd)
    }, 100);

})();