// ==UserScript==
// @name        Plugins at WordPress.org: PluginTests.com Link
// @namespace   cvladan.com
// @match       https://*wordpress.org/plugins/*
// @run-at      document-start
// @inject-into content
// @grant       none
// @version     1.0
// @license     MIT
// @author      Vladan Colovic
// @description Userscript adds PluginTests.com link below the download button on WordPress.org for quick plugin compatibility checks.
// @downloadURL https://update.greasyfork.org/scripts/466391/Plugins%20at%20WordPressorg%3A%20PluginTestscom%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/466391/Plugins%20at%20WordPressorg%3A%20PluginTestscom%20Link.meta.js
// ==/UserScript==

var css = `

  a.plugintests-button {
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
  a.href = "https://plugintests.com/plugins/wporg/" + pluginSlug + "/latest";
  a.className = "plugintests-button";
  a.textContent = "pluginTests.com";

  const downloadButton = document.querySelector("a.download-button");

  if (downloadButton) {
    downloadButton.after(a);
  }

});