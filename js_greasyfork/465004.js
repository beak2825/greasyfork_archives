// ==UserScript==
// @name         homepage redirect
// @namespace    https://www.haijiao.com/homepage/*
// @version      0.0.1
// @description  rewrite hj topic detail user url link
// @author       You
// @match        https://www.haijiao.com/homepage/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/465004/homepage%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/465004/homepage%20redirect.meta.js
// ==/UserScript==


(async function () {
    "use strict";

    const len = window.location.pathname.split('/').length;

    if (len === 3){
        window.location.href = window.location.href.replace('homepage', 'homepage/last');
    }

})();
