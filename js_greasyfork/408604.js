// ==UserScript==
// @version      1.0.1
// @name         Wikipedia Multi-Column Layout
// @description  Apply multi-column layout to Wikipedia with CSS3.
// @author       Xoihazard
// @license      MIT
// @namespace    https://github.com/xoihazard/wikipedia-multicolumn
// @match        *://*.wikipedia.org/wiki/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408604/Wikipedia%20Multi-Column%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/408604/Wikipedia%20Multi-Column%20Layout.meta.js
// ==/UserScript==

GM_addStyle(`
div.multicolumn-layout {
  margin-top: 1rem;
  margin-bottom: 1rem;
  column-width: 25rem;
  column-gap: 2rem;
  column-rule: 1px solid lightgray;
}

div.multicolumn-layout.break {
  padding-bottom: 1rem;
  border-bottom: 1px dashed lightgray;
}

div.multicolumn-layout * {
  max-width: 100% !important;
}

div.multicolumn-layout img {
  max-width: 100% !important;
  height: auto !important;
}
`);

{
  const exclude = [
    "h2",
    "div.toc",
    "div.dablink",
    "div.pathnavbox",
    "div.navbox",
    "table.ambox:not(.mbox-small-left)",
    "table.infobox",
    "table.wikitable",
    "table.navbox",
  ].join(", ");

  class Row {
    constructor() {
      this.isEmpty = true;
      this.rows = [];
      this.addRow();
    }

    addRow() {
      this.row = document.createElement("div");
      this.row.classList.add("multicolumn-layout");
      this.rows.push(this.row);
    }

    append(node) {
      this.mount(node);
      if (this.row.clientHeight > window.innerHeight * 0.75) {
        this.addRow();
      }
      this.row.append(node);
      this.isEmpty = false;
    }

    mount(nextNode) {
      if (!document.body.contains(this.row)) {
        nextNode.parentNode.insertBefore(this.row, nextNode);
      }
    }

    close() {
      this.rows.forEach((row, index) => {
        if (index < this.rows.length - 1) {
          row.classList.add("break");
        }
      });
    }
  }

  let row = new Row();

  const nodes = document.querySelector(".mw-parser-output").childNodes;

  [...nodes].forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (!node.matches(exclude)) {
        row.append(node);
      } else if (!row.isEmpty) {
        row.close();
        row = new Row();
      }
    }
  });
}
