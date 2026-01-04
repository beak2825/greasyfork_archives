// ==UserScript==
// @name           Demilitarize USTVNow.com
// @name:es        Desmilitarizar USTVNow.com
// @namespace      http://tampermonkey.net/
// @version        0.1.2
// @description    Removes military paraphernalia from ustvnow.com
// @description:es Elimina la parafernalia militar de USTVNow.com
// @author         Pacifist
// @include        *.ustvnow.com/*
// @run-at         document-start
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36267/Demilitarize%20USTVNowcom.user.js
// @updateURL https://update.greasyfork.org/scripts/36267/Demilitarize%20USTVNowcom.meta.js
// ==/UserScript==

GM_addStyle ( "                      \
    .flexslider {                    \
        display: none !important;    \
    }                                \
    #container-guide {               \
        margin-top: none !important; \
    }                                \
    .header-logo__text {             \
        color: #f6f6f6;              \
    }                                \
" );

window.addEventListener ("DOMContentLoaded", function(){
    document.getElementsByClassName("header-logo__text")[0].innerHTML = "TV for US citizens abroad<br>&nbsp;";
    document.getElementsByClassName("header-logo__text")[0].style.color = "#333";

    document.getElementsByClassName("footer__text")[0].innerHTML = document.getElementsByClassName("footer__text")[0].innerHTML.replace(" and military","");
});