// ==UserScript==
// @name         New Tab on Double Click
// @namespace    https://viayoo.com/
// @version      0.1
// @homepageURL  https://app.viayoo.com/addons/40
// @author       Sky
// @run-at       document-start
// @match        *
// @grant        none
// @description  Çift tıklamayla yeni sekmeye geçer
// @downloadURL https://update.greasyfork.org/scripts/460024/New%20Tab%20on%20Double%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/460024/New%20Tab%20on%20Double%20Click.meta.js
// ==/UserScript==


(function(){
    let clicks = 0;
    let timer = null;
    const delay = 1000; // 1 saniye

    document.addEventListener('click', function(e) {
        clicks++;

        if (clicks === 1) {
            timer = setTimeout(function() {
                clicks = 0;
            }, delay);
        } else if (clicks === 2) {
            clearTimeout(timer);
            clicks = 0;
            window.open('https://www.yandex.com.tr/', '_blank');
        }
    });
})();
