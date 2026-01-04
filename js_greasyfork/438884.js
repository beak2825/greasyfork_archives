// ==UserScript==
// @name         JIRA Open link in new
// @namespace    braunson.jira.open.links.in.new.tab
// @version      1.0.0
// @description  Adds target="_blank" to any links within a card's text description
// @author       Braunson Yager
// @match        https://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438884/JIRA%20Open%20link%20in%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/438884/JIRA%20Open%20link%20in%20new.meta.js
// ==/UserScript==

const isExternalLink = (url) => {
    const tmp = document.createElement('a');
    tmp.href = url;
    return tmp.host !== window.location.host;
};

(function() {
    setInterval(() => {
        let links = document.querySelectorAll("[data-test-id='issue.views.field.rich-text.description'] a[href]");
        for (let link of links) {
          if (! isExternalLink(link.getAttribute("href"))) {
            continue;
          }

          link.setAttribute('target', '_blank');
        }
    }, 2000);
})();