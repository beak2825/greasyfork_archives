// ==UserScript==
// @run-at document-start
// @name         Guvercin yazdırma
// @namespace    http://grayburger.com/
// @version      0.1
// @description  Guvercin'de "Siparişi Yazdır" butonunun varsayılan olarak termal yazıcıya uygun hale gelmesini sağlar.
// @author       Osman Temiz
// @match        https://siparistakip.yemeksepeti.com/print.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422528/Guvercin%20yazd%C4%B1rma.user.js
// @updateURL https://update.greasyfork.org/scripts/422528/Guvercin%20yazd%C4%B1rma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var p= window.location.href.replace("AClass", "termal");
    window.location.replace(p);


    // Your code here...
})();