// ==UserScript==
// @name         muahahaha silent-otaku96
// @namespace    muahahaha
// @version      1.0
// @description  kill de player an chat
// @match        http://www.wikplayer.com/wik.html?16102012
// @match        http://www.silent-otaku96.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/372579/muahahaha%20silent-otaku96.user.js
// @updateURL https://update.greasyfork.org/scripts/372579/muahahaha%20silent-otaku96.meta.js
// ==/UserScript==

(function() {

    setTimeout(
        function(){
            if(typeof(unsafeWindow.$)==='function'){

                var $=unsafeWindow.$;
                $('#pause').click();
                $('#HTML6').remove();

            }
        }
        ,2000
    );

})();