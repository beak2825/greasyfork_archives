// ==UserScript==
// @name         Guvercin siralama
// @namespace    http://grayburger.com/
// @version      0.3
// @description  Guvercin'de yeni siparislerin ustte gorunmesini saglar
// @author       Osman Temiz
// @match        https://siparistakip.yemeksepeti.com/*
// @downloadURL https://update.greasyfork.org/scripts/395336/Guvercin%20siralama.user.js
// @updateURL https://update.greasyfork.org/scripts/395336/Guvercin%20siralama.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var divs = document.getElementsByClassName('activeordertable');

        if (divs.length > 0){
            //alert(divs.length);
            var div1 = divs[0];
            var div2 = divs[1];
            if (div2.innerHTML.indexOf("Yeni Siparişler") > -1){

                div1.parentNode.insertBefore(div2, div1);
            }
        }

    }, 300);

    // Your code here...
})();