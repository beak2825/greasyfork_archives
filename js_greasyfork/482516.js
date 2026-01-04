// ==UserScript==
// @name         Table to Markdown Copier Enhanced Version
// @namespace    https://github.com/lundeen-bryan
// @version      2.1.0
// @description  Convert html table to markdown format and copy it to clipboard
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @author       lundeen-bryan (Original Author: Du Dang)
// @downloadURL https://update.greasyfork.org/scripts/482516/Table%20to%20Markdown%20Copier%20Enhanced%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/482516/Table%20to%20Markdown%20Copier%20Enhanced%20Version.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var MAX_COL_SIZE = 80;
  var Str = {};

  function displayTableControl() {
    var tables = document.querySelectorAll("table");
    tables.forEach(function (table, i) {
      var id = "btn-copy-md-" + i,
        btnMd = document.createElement("button"),
        lastCell = table
          .querySelector("tr:first-child")
          .querySelector("td:last-child, th:last-child");

      btnMd.setAttribute("type", "button");
      btnMd.classList.add("convert-to-markdown", "btn", "btn-primary");
      btnMd.style.cssText =
        "height: 20px; width: 30px; background-color: #81358c; color: #fff; padding: 0";
      btnMd.textContent = "MD";
      btnMd.id = id;

      btnMd.addEventListener("click", function () {
        var md = convertTableToMd(table);
        navigator.clipboard.writeText(md).then(
          function () {
            console.log("Copied to clipboard successfully.");
            btnMd.style.backgroundColor = "#6AB714";
            setTimeout(function () {
              btnMd.style.backgroundColor = "#81358c";
            }, 3000);
          },
          function (err) {
            console.error("Could not copy text: ", err);
          }
        );
      });

      lastCell.appendChild(btnMd);
    });
  }

  function getData(table) {
    var maxLengths = [],
      tableData = [];

    function setMax(index, length) {
      while (index >= maxLengths.length) {
        maxLengths.push(0);
      }
      maxLengths[index] = Math.max(maxLengths[index], length);
    }

    var rows = table.querySelectorAll("tr");
    rows.forEach(function (tr, trIndex) {
      var row = [],
        offset = 0;
      var cells = tr.querySelectorAll("td, th");
      cells.forEach(function (td, i) {
        var text = getText(td, trIndex),
          tl = text.length,
          index = i + offset,
          colspan = td.getAttribute("colspan");

        setMax(index, tl);
        row.push(text);

        if (colspan && !isNaN(colspan) && Number(colspan) > 1) {
          colspan = Number(colspan);
          offset += colspan - 1;
          for (var k = 0; k < colspan; k++) {
            row.push("");
          }
        }
      });
      tableData.push(row);
    });

    return {
      maxLengths: maxLengths,
      tableData: tableData,
    };
  }

  function convertTableToMd(table) {
    var md = "",
      data = getData(table),
      i,
      k,
      maxLengths = data.maxLengths;

    for (i = 0; i < data.tableData.length; i++) {
      var row = data.tableData[i],
        rowMd = "| ",
        sepMd = "| ";

      for (k = 0; k < row.length; k++) {
        var rowWidth = Math.min(maxLengths[k], MAX_COL_SIZE),
          text = Str.padRight(row[k], " ", rowWidth);
        rowMd += text + " | ";

        if (i === 0) {
          sepMd += Str.repeat(" ", rowWidth) + " | ";
        }
      }

      if (rowMd.length > 2) {
        md += Str.trim(rowMd) + "\n";
        if (sepMd.length > 2) {
          md += Str.trim(sepMd).replace(/ /g, "-") + "\n";
        }
      }
    }

    md += getReferenceLink(table);
    return md;
  }

  function getReferenceLink(table) {
    var refLink,
      anchor,
      refId = table.id,
      href = location.href;

    if (!refId) {
      anchor = table.closest("[id]");
      if (anchor) {
        refId = anchor.id;
      }
    }

    refLink = href.includes("#")
      ? href.replace(/#.+/, "#" + refId)
      : href + "#" + refId;
    return "[Table Source](" + (refLink || href) + ")";
  }

  function getText(td, trIndex) {
    var text = td.textContent;
    if (trIndex === 0) {
      text = text.replace(/MD$/, "");
    }
    text = text.replace("\n", "").replace(/\s/g, " ");
    return Str.trim(text);
  }

  Str.trim = function (s) {
    return s.trim();
  };

  Str.padRight = function (s, padStr, totalLength) {
    return s.padEnd(totalLength, padStr);
  };

  Str.repeat = function (s, count) {
    return s.repeat(count);
  };

  GM_registerMenuCommand("Convert Table to Markdown", displayTableControl);
})();
