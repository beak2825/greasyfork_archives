// ==UserScript==
// @name        Plugins at WordPress.org: TasteWP Link
// @namespace   cvladan.com
// @match       https://*wordpress.org/plugins/*
// @run-at      document-start
// @inject-into content
// @grant       none
// @version     1.0
// @license     MIT
// @author      Vladan Colovic
// @description Userscript adds TasteWP link below the download button on WordPress.org for easy access to plugin sandbox testing.
// @downloadURL https://update.greasyfork.org/scripts/466392/Plugins%20at%20WordPressorg%3A%20TasteWP%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/466392/Plugins%20at%20WordPressorg%3A%20TasteWP%20Link.meta.js
// ==/UserScript==

var css = `

  a.tastewp-button {
    display: block;
    width: fit-content;
    font-size: 0.6rem;
    color: currentColor;
    margin: 4px auto 0 auto;
    font-style: italic;
    padding: 0 0 0 45px;
  }

`

/* Inject CSS in document head */

function injectStyle(css) {
	var doc = document;
  var script = document.createElement('style');
  script.textContent = css;

  var where = doc.getElementsByTagName ('head')[0] || doc.body || doc.documentElement;
  where.appendChild(script);
}

injectStyle(css)


/* Insert PluginTests.com link */

document.addEventListener('DOMContentLoaded', function() {

  const currentUrl = window.location.href.split('#')[0].split('?')[0].replace(/\/$/, ''); // cleanup and remove trailing slash
  const pluginSlug = currentUrl.split("/").pop();

  const a = document.createElement("a");
  a.href = "https://tastewp.com/create/NMS/8.2/6.2/create-block-theme,missing-menu-items," + pluginSlug + "/blocksy/WP_DEBUG,WP_DEBUG_LOG,WP_DEBUG_DISPLAY,CONCATENATE_SCRIPTS";
  a.className = "tastewp-button";
  a.textContent = "Run PHP 8.2 @ TasteWP.com";

  const downloadButton = document.querySelector("a.download-button");

  if (downloadButton) {
    downloadButton.after(a);
  }

});