// ==UserScript==
// @name        Plugins at WordPress.org: WP Hive Cleanup
// @namespace   cvladan.com
// @match       https://*wordpress.org/plugins/*
// @run-at      document-start
// @inject-into content
// @grant       none
// @version     1.0
// @license     MIT
// @author      Vladan Colovic
// @description Userscript cleans up and simplifies page elements added by the WP Hive (wphive.com) Browser extension on WordPress.org plugin pages.
// @downloadURL https://update.greasyfork.org/scripts/466390/Plugins%20at%20WordPressorg%3A%20WP%20Hive%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/466390/Plugins%20at%20WordPressorg%3A%20WP%20Hive%20Cleanup.meta.js
// ==/UserScript==

var css = `

  .widget.plugin-donate {
    display: none !important;
  }

  /* WP Hive extension bloat */

  .hive-plugins-header-section,
  .hive-plugin-sidebar-checkbox,
  .hive-plugin-all-redirect-checkbox,
  .hive-plugin-sidebar-buttons > a,
  .hive-plugin-sidebar-insights li:last-child {
    display: none !important;
  }

  .entry-meta .hive-plugin-sidebar-insights .widget-title {
    visibility: hidden;
  }

  .hive-plugin-sidebar-buttons {
    display: flex;
  }

  .hive-plugin-sidebar-buttons > a:first-child {
    display:  inline !important;
    width: auto;
    background: none;
    color: currentColor;
    padding: 0;
    font-weight: normal;
    text-decoration: underline;
    margin-left: auto;
    margin-right: 0;
  }


  .hive-plugin-sidebar-insights ul {
    line-height: 1em;
    border: 0;
  }

  .hive-criteria-text {
    font-size: 0.7rem;
    border: 0;
    padding: 0;
  }

  .hive-criteria-icon span {
    width: 22px;
    height: 22px;
    line-height: 22px;
    border: 0;
  }


`

// Inject CSS in document head
//
function injectStyle(css) {
	var doc = document;
  var script = document.createElement('style');
  script.textContent = css;

  var where = doc.getElementsByTagName ('head')[0] || doc.body || doc.documentElement;
  where.appendChild(script);
}

injectStyle(css)
