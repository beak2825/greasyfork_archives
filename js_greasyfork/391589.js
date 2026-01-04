// ==UserScript==
// @name         Verification Status Link
// @namespace    https://github.com/beet-aizu/library
// @version      1.0
// @description  Add Link to Verification Status
// @author       @beet_aizu
// @match        https://github.com/beet-aizu/library/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391589/Verification%20Status%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/391589/Verification%20Status%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href;
    if(url.search(/.cpp$/) >= 0){
        var status = "https://beet-aizu.github.io/library/test/status.html?url=" + /master\/(.*\.cpp)$/.exec(url)[0].substr(6);
        $('#blob-path').after($('<a>').attr({href: status, class: "btn btn-sm" }).text('Verification Status'));
    }
})();