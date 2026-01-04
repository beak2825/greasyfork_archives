// ==UserScript==
// @name         eHR-Safari
// @namespace    Devgum
// @version      0.1
// @description  eHR work in Safari!
// @author       Devgum
// @match        http://ehr.baogang.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426333/eHR-Safari.user.js
// @updateURL https://update.greasyfork.org/scripts/426333/eHR-Safari.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parse_iframe_id(tab) {
        var parent = tab.parentElement
        if (parent.hasAttribute('contentid')) return parent.getAttribute('contentid');
        parent = parent.parentElement
        if (parent.hasAttribute('contentid')) return parent.getAttribute('contentid');
        return null;
    }

    function reload_iframe() {
        var selected = document.getElementsByClassName('TabbedPanelsTabSelected');
        for (var i=0; i<selected.length; i++) {
            var tab = selected[i];
            var tab_src = tab.getAttribute('src');
            var iframe_id = parse_iframe_id(tab);
            if (iframe_id == null) continue;
            var iframe = document.getElementById(iframe_id);
            iframe.setAttribute('src', tab_src);
        }
    }

    window.reload_iframe = reload_iframe

    var tabs = document.getElementsByClassName('TabbedPanelsTab');
    for (var i=0; i<tabs.length; i++) {
        var tab = tabs[i];
        tab.setAttribute('onclick', 'reload_iframe()');
    }
    reload_iframe();
})();