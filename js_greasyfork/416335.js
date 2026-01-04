// ==UserScript==
// @name         GitLab Plus
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  quickly do something for gitlab
// @author       huiren
// @match        https://gitlab.com/*/commit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416335/GitLab%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/416335/GitLab%20Plus.meta.js
// ==/UserScript==

(function() {
    // 'use strict';

    var plus = {
        link_to: function(url, text) { return $('<a/>').attr('href', url ).html(text) },
    };

    let bc = $('.breadcrumbs-list');
    let currentId = $('.breadcrumbs-list li:nth-child(4) a').text();

    bc.append( plus.link_to('../compare/master...' +  currentId, 'diff to master') );
    bc.append(' &nbsp; | &nbsp; ');
    bc.append( plus.link_to('../compare/' +  currentId + '...master', 'diff by master') );

})();
