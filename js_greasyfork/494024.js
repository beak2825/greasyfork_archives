// ==UserScript==
// @name         MediaWiki Special:Gadgets • Tabular View
// @namespace    fabulous.cupcake.jp.net
// @version      2024.05.03.1
// @description  Less cluttery and more readable Special:Gadgets view as table
// @author       FabulouCupcake
// @license      MIT
// @include      */Special:Gadgets
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494024/MediaWiki%20Special%3AGadgets%20%E2%80%A2%20Tabular%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/494024/MediaWiki%20Special%3AGadgets%20%E2%80%A2%20Tabular%20View.meta.js
// ==/UserScript==

(function(){

const transformGadgetLiToTr = (li) => {
    // Parse bits of it since there's basically no structure
    const id = li.id;

    const desc = li.innerHTML.match(/^(.+?)&nbsp;&nbsp;\(<a href/)[1];
    const descEditURL = li.querySelector("a[href$=edit]").href;

    const sourcesHTML = li.innerHTML.match(/<br>Uses: (.+?)(?:<br>|$)/)[1];
    const sources = sourcesHTML.split(",").map(s => s.trim());

    const notes = li.innerHTML.split("<br>").splice(2);

    // Edit Button
    // Stolen from https://www.mediawiki.org/wiki/MediaWiki:Gadget-Global-MiniEdit.js
    const editIcon = '<span class="miniedit-button noprint" style="cursor: pointer;"><svg style="vertical-align: middle;" width="14" height="14" viewBox="0 0 20 20"><path fill="currentColor" d="M16.77 8l1.94-2a1 1 0 0 0 0-1.41l-3.34-3.3a1 1 0 0 0-1.41 0L12 3.23zm-5.81-3.71L1 14.25V19h4.75l9.96-9.96-4.75-4.75z"></path></svg></span>';

    // Construct replacement HTML
    const el = `
    <tr>
        <td>${id}</td>
        <td><a href="${descEditURL}">${editIcon}</a></td>
        <td>${desc}</td>
        <td><ol style="margin-left:1.5em">${sources.map(s => `<li>${s}</li>`).join("")}</ol></td>
        <td>${notes.join("<br>")}</td>
    </tr>`;

    return el;
}

const gadgetUl = Array.from(document.querySelectorAll("#mw-content-text ul"));
gadgetUl.forEach(ul => {
    // Transform <li> to <tr>
    const gadgetLi = Array.from(ul.querySelectorAll("li[id]"));
    const gadgetTableRows = gadgetLi.map(li => transformGadgetLiToTr(li));

    // Replace <ul> with <table>
    ul.outerHTML = `
    <table class="wikitable">
      <tr>
        <th width="20%">ID</th>
        <th width="40%" colspan="2">Description</th>
        <th width="20%">Sources</th>
        <th width="20%">Notes</th>
      </tr>
      ${gadgetTableRows.join("")}
    </table>`;
});

})();