// ==UserScript==
// @name         jenkins-selectSearch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  jenkins搜索框优化
// @author       solenya
// @match        http://ops.dev.casstime.com/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js
// @resource     select2css https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/435237/jenkins-selectSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/435237/jenkins-selectSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var select2css = GM_getResourceText ("select2css");
    GM_addStyle (select2css);

    $("select").select2();
    $(document).ready(function () {
        $("select").select2();
    });
    // Your code here...
})();