// ==UserScript==
// @name         JIRA view issue sidebar show/hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Kamil Ściana
// @description  Show/hide sidebar on issue view
// @match        https://*.atlassian.net/jira/software/c/projects/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/444463/JIRA%20view%20issue%20sidebar%20showhide.user.js
// @updateURL https://update.greasyfork.org/scripts/444463/JIRA%20view%20issue%20sidebar%20showhide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = '<a id="jira-hide-viewissuesidebar" class="aui-button aui-button-subtle aui-sidebar-toggle aui-sidebar-footer-tipsy" href="#" original-title="Hide" onclick="jQuery(\'#viewissuesidebar\').toggle(\'slow\')">+</a>';
    jQuery('.aui-toolbar2-secondary > div').append(button);

})();