// ==UserScript==
// @name         MuseScore Download Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bypass the Pro-only download restrictions on musescore
// @author       flancast90
// @match        *://musescore.com/user/*/scores/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musescore.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436508/MuseScore%20Download%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/436508/MuseScore%20Download%20Bypass.meta.js
// ==/UserScript==

var urls = []

 $(document).ready(async function() {
    async function wait_until_loaded() {
        setTimeout(function() {
            if (document.getElementsByClassName('_2zZ8u').length == 2) {
                urls.push(document.getElementsByClassName('_2zZ8u')[1].src);
            }else {
                urls.push(document.getElementsByClassName('_2zZ8u')[0].src);
            }
        }, 1000);
    }

    var elem = parseInt(document.getElementsByClassName('JQKO_ Nj4E6 -sCT0')[0].scrollHeight);

    var height = parseInt(document.getElementsByClassName('_2zZ8u')[0].height);
    var scrolled = 0;
    var scrollHeight = (elem - (elem % height));

    function get_lazy_imgs() {
         if (scrolled < scrollHeight) {
             document.getElementsByClassName('JQKO_ Nj4E6 -sCT0')[0].scrollTop = scrolled;
             scrolled += height;

             setTimeout(function(scrolled, scrollHeight) {
                 var img = document.getElementsByClassName('_2zZ8u');

                 urls.push(img[img.length-1].src);
                 // use recursion to execute syncroniously
                 if (scrolled < scrollHeight) {
                     get_lazy_imgs()
                 }
             }, 1000, scrolled, scrollHeight);
         }
    }

    get_lazy_imgs()

    document.getElementById('a2ae0a5caabafb538105b98516c4c7d5').addEventListener('click', hijack_popup);

    function hijack_popup() {
        if (document.getElementsByClassName('_1oLA0 IfSKv _22S7- _2OCeG')[0]) {
            for (var i = 0; i < urls.length; i++) {
                if (i == 0) {
                    // replace existing content on first iteration
                    document.getElementsByClassName('_2sLDi _222n2 _3vdd_')[0].innerHTML = `<img src="`+urls[i]+`" style="width:100%;"/>`;
                }else {
                    // append to replaced content
                    document.getElementsByClassName('_2sLDi _222n2 _3vdd_')[0].innerHTML += `<img src="`+urls[i]+`" style="width:100%;"/>`;
                }
            }
        }else {
            setTimeout(function() {
                hijack_popup();
            }, 100);
        }
     }
});