// ==UserScript==
// @name         Symfonie external ID link
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Turn external ID info in Job page into Memsource link
// @author       TBurkert
// @include        https://projects.moravia.com/jobs/*
// @include        https://projects.moravia.com/task/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37603/Symfonie%20external%20ID%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/37603/Symfonie%20external%20ID%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var extid_element = $('small:contains("External ID")').next();
    var extid = $(extid_element).text();
    if(!extid) return false;
    $(extid_element).html("<a href=" + "https://cloud.memsource.com/web/project2/show/" + extid + " target=_blank>" + extid +"</a>");
})();