// ==UserScript==
// @name          Anistar редирект
// @description   Автоматически переключает c anistar.appspot.com на незаблокированное зеркало
// @include       /^https?://(.*)anistar(.*).appspot.com/.*$/
// @run-at        document-body
// @grant         GM_setValue
// @grant         GM_getValue
// @author        DygDyg
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @icon          https://anistar.appspot.com/favicon.png
// @version       0.7
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/396361/Anistar%20%D1%80%D0%B5%D0%B4%D0%B8%D1%80%D0%B5%D0%BA%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/396361/Anistar%20%D1%80%D0%B5%D0%B4%D0%B8%D1%80%D0%B5%D0%BA%D1%82.meta.js
// ==/UserScript==


var $ = window.jQuery;

if (GM_getValue('refrsh', null) == null) GM_setValue('refrsh', 0);

var refrsh = GM_getValue('refrsh');


$(document).ready(function () {
    var dop = "raspisanie-vyhoda-seriy-ongoingov.html";
    var x1 = $(".btn.btn-large.animated.tada");

    if (x1.length) {
        GM_setValue('refrsh', 0);
        document.location.href = x1.text() + "/" + dop;
    }
    else {

        /*if (refrsh <= 5) {
            console.log(refrsh);
            refrsh = refrsh + 1;
            GM_setValue('refrsh', refrsh);
            window.location.reload();
        } else {
            alert('Шот пошло не так?');
            GM_setValue('refrsh', 0);
        }*/
        window.location.reload();

    }
});
