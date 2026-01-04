// ==UserScript==
// @name         Compare with staging
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a link
// @author       Arne Goeteyn
// @match        https://github.com/officient/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/459951/Compare%20with%20staging.user.js
// @updateURL https://update.greasyfork.org/scripts/459951/Compare%20with%20staging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var originalUrl = document.URL
    var base = originalUrl.match('.*officient/[^\/]*/')

    var a = $('a, no-underline').filter(function() {
        return this.href.match(/http.*officient.*tree/);
    });

    var href = a.last().attr('href');
    var compareHref = href.replace("tree/", "compare/staging...")

    var zNode = document.createElement ('a');
    zNode.setAttribute ('href', compareHref);
    zNode.text = "compare staging";

    var parent = a.parent().parent();
    parent.append (zNode);

})();