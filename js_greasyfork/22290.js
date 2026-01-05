// ==UserScript==
// @name Прямые ссылки в DLE
// @namespace    FIX
// @version      0.2
// @description  Прямые ссылки на сайтах с движком DataLife Engine (DLE)
// @match        *://*/*
// @grant        unsafeWindow
// @author       raletag
// @compatible   Opera 15+
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/22290/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B2%20DLE.user.js
// @updateURL https://update.greasyfork.org/scripts/22290/%D0%9F%D1%80%D1%8F%D0%BC%D1%8B%D0%B5%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%B2%20DLE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var win = unsafeWindow || window, links = document.getElementsByTagName('a'), url64, url;

    function isBase64(str) {
        try {
            return !!str && !!win.atob(str);
        } catch (e) {
            return false;
        }
    }

    for (var i = 0; i < links.length; i++) {
        url64 = decodeURIComponent((links[i].href.match(/go\.php[?&]url=([^&]*)(&|$)/i)||
                                    links[i].href.match(/\/leech_out\.php\?.:(.+)$/i)||
                                    [])[1]);
        if (isBase64(url64)) {
            url = decodeURIComponent(escape(win.atob(url64)));
            console.log('Replace ' + links[i].href + ' to ' + url);
            links[i].href = url;
        }
    }

})();
