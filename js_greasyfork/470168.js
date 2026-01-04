// ==UserScript==
// @name         Ekşi - Çaylaklar'a git
// @namespace    http://tampermonkey.net/
// @version      1
// @description  "Geçerli başlığın çaylaklar kısmına geçebilmek için buton oluşturur." Acaba çaylaklar konu hakkında ne demiş diyorsan butona tıkla.
// @author       angusyus
// @include      *eksisozluk*

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470168/Ek%C5%9Fi%20-%20%C3%87aylaklar%27a%20git.user.js
// @updateURL https://update.greasyfork.org/scripts/470168/Ek%C5%9Fi%20-%20%C3%87aylaklar%27a%20git.meta.js
// ==/UserScript==

var h1s = document.querySelectorAll("h1");

for (let i = 0; i < h1s.length; i++) {
    var header = h1s[i];
    var tagA = header.getElementsByTagName("a")[0];
    var oldHref = tagA.getAttribute('href');

    var caylakButon = document.createElement("a");
    caylakButon.setAttribute("onClick","window.open('"+ oldHref + "?a=caylaklar&p=1'); return false");
    caylakButon.style.setProperty('font-size', '12px', 'important');
    caylakButon.style.setProperty('color', '#ff0000', 'important');

    const textNode = document.createTextNode("  (Çaylaklara git)");
    caylakButon.appendChild(textNode);

    header.insertBefore(caylakButon, header.childNodes[2]);
}
