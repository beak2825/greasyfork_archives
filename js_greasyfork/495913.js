// ==UserScript==
// @name        PRIVATE SERVER KRYPTA
// @namespace
// @version     1.5
// @description  Krypta
// @author      Krypta
// @match       https://kogama.com.br/games/play/*/*
// @grant       none
// @namespace https://greasyfork.org/users/1306116
// @downloadURL https://update.greasyfork.org/scripts/495913/PRIVATE%20SERVER%20KRYPTA.user.js
// @updateURL https://update.greasyfork.org/scripts/495913/PRIVATE%20SERVER%20KRYPTA.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    let langValue = getQueryParam('lang') || 'pt_BR';

    const xhrPrototype = XMLHttpRequest.prototype;

    const originalOpenFunction = xhrPrototype.open;

    xhrPrototype.open = function() {
        const url = arguments[1];
        if (url.includes("lang=")) {
            const newUrl = url.replace(/(lang=)[^&]*/, `$1${langValue}`);
            arguments[1] = newUrl;
            console.log("URL alterada para 'lang=" + langValue + "'");
        }

        originalOpenFunction.apply(this, arguments);
    };
})();
