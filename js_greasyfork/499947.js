// ==UserScript==
// @name         Table copier (to clipboard)
// @version      0.3.1
// @description  Choose from your userscipts addon menu. All tables are highlighted, click one to copy, elsewhere to cancel. Copy table and paste into spreadsheets like Excel, Google Sheets, LibreOffice Calc, OpenOffice Calc and others.
// @author       Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @copyright    2024+, Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @license      Zlib
// @namespace    Jakub Marcinkowski
// @homepageURL  https://gist.github.com/JakubMarcinkowski
// @homepageURL  https://github.com/JakubMarcinkowski
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgY2xpcC1wYXRoPSJjaXJjbGUoKSI+PHJlY3QgZmlsbD0iIzZkOSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+PHBhdGggZD0iTTIsMFYxNk02LDBWMTZNMTQsMFYxNk0wLDNIMTZNMCw4SDE2TTAsMTNIMTYiIHN0cm9rZT0iIzQ0NSIvPjwvc3ZnPg
// @match        *://*/*
// @noframes
// @run-at       document-idle
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/499947/Table%20copier%20%28to%20clipboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499947/Table%20copier%20%28to%20clipboard%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (!('setClipboard' in GM)) return;

  let cleaned = 1;
  let tables = [];
  let tablesBorders = new Map();

  function run() {
    tables = [...document.getElementsByTagName('table')];
    if (tables.length === 1) {
      copyTable(tables[0]);
      tables[0].scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
      borderHighlight(tables[0]);
      setTimeout(borderNormal, 1000, tables[0]);
    } else {
      tables.forEach(elem => {
        borderHighlight(elem);
        elem.addEventListener('click', takeElem, {capture: true});
        elem.addEventListener('contextmenu', takeElem, {capture: true});
      });
      document.addEventListener('click', stopAll);
    }
  }

  function end() {
    tables.forEach(elem => {
      borderNormal(elem);
      elem.removeEventListener('click', takeElem, {capture: true});
      elem.removeEventListener('contextmenu', takeElem, {capture: true});
    });
    document.removeEventListener('click', stopAll);
    tables = [];
    tablesBorders = new Map();
  }

  function stopAll(e) {
    e.preventDefault();
    e.stopPropagation();
    end();
  }

  function takeElem(e) {
    stopAll(e);
    const table = e.target.tagName === 'TABLE' ? e.target : e.target.closest('table');
    if (table) copyTable(table);
  }

  function borderHighlight(elem) {
    tablesBorders.set(elem, elem.style.border);
    elem.style.border = '2px dashed green';
  }

  function borderNormal(elem) {
    elem.style.border = tablesBorders.get(elem);
  }

  function processTable(table) {
    // When pasting tags from these long selectors (except style), Excel makes additional rows.
    let clone = table.cloneNode(true);
    clone.querySelectorAll('br, wbr, hr, img, style')
    .forEach(elem => {
      elem.remove();
    });
    if (cleaned >= 2) {
      clone.querySelectorAll('a')
      .forEach(link => {
        const span = document.createElement('span');
        span.textContent = link.href;
        link.replaceWith(span);
        span.after(' '); // Separate texts (hrefs)
      });
    }
    if (cleaned === 3) {
      clone.querySelectorAll('*')
      .forEach(elem => {
        if (['SPAN', 'TBODY', 'THEAD', 'TFOOT', 'TR', 'TH', 'TD', 'CAPTION', 'COLGROUP', 'COL'].includes(elem.tagName)) return;
        const span = document.createElement('span');
        for (let child of elem.childNodes) {
          span.append(child);
        }
        elem.replaceWith(span);
      });
    } else {
      clone.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, ul, li, ol, dl, dt, dd')
      .forEach(elem => {
        const span = document.createElement('span');
        for (let child of elem.childNodes) {
          span.append(child);
        }
        for (let attr of elem.getAttributeNames()) {
          span.setAttribute(attr, elem.getAttribute(attr));
        }
        elem.replaceWith(span);
      });
    }
    return clone;
  }

  function copyTable(table) {
    if (cleaned !== 0) table = processTable(table);
    let param;
    switch (GM.info.scriptHandler) {
      case 'Tampermonkey':
        param = 'html'
        break;
      case 'Violentmonkey':
      case 'Userscripts':
        param = 'text/html'
        break;
      case 'Greasemonkey':
      default:
        param = null;
    }
    if (param) GM.setClipboard(table.outerHTML, param);
    else GM.setClipboard(table.outerHTML);
    // alert(`Table in clipboard. Now paste it into a spreadsheet.`);
  }

  GM.registerMenuCommand('Copy table (full HTML)', () => {cleaned = 0; run();});
  GM.registerMenuCommand('Copy table (cleaned HTML)', () => {cleaned = 1; run();});
  GM.registerMenuCommand('Copy table (cleaned, links as hrefs)', () => {cleaned = 2; run();});
  GM.registerMenuCommand('Copy table (cleanest, links as hrefs)', () => {cleaned = 3; run();});
})();