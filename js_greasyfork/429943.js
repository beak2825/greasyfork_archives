// ==UserScript==
// @name        Empornium Copy All Download Links (ECADL)
// @description Provides a link to copy all download links present on a page.
// @namespace   Empornium Scripts
// @version     1.0.6
// @author      BlazingApe
// @grant       none
// @license     MIT
// @include /^https://www\.empornium\.(me|sx|is)\/torrents.php*/
// @include /^https://www\.empornium\.(me|sx|is)\/user.php*/
// @include /^https://www\.empornium\.(me|sx|is)\/top10.php*/
// @exclude /^https://www\.empornium\.(me|sx|is)\/torrents.php.*[?&]id=.*/
//
// @downloadURL https://update.greasyfork.org/scripts/429943/Empornium%20Copy%20All%20Download%20Links%20%28ECADL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429943/Empornium%20Copy%20All%20Download%20Links%20%28ECADL%29.meta.js
// ==/UserScript==

// Changelog:
// Version 1.0.6
//  - Made ECADL compatible with "gazelle collapse duplicates" (and if GCD executes first, it'll add per-dupe checkboxes!)
// Version 1.0.5
//  - Fixed clickable table cells preventing checkboxes themselves from being toggled.
// Version 1.0.4
//  - Clicking col header or table cell will toggle related checkbox(es).
// Version 1.0.3
//  - Add a checkbox on every row, only copy ones the user hasn't unchecked.
// Version 1.0.2
//  - Fix accidental exclusion of user torrent activity pages.
// Version 1.0.1
//  - Exclude individual torrent pages.
// Version 1.0.0
//  - Initial release
// Todo:

/*jshint esversion: 6 */

(function () {
  const DL_LINK_SEARCH_HEIGHT = 5;
  const COL_HEADER_CLASS = "ecadl-header";

  console.log('ECADL Starting...');

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      console.error('ECADL can\'t get to your clipboard.');
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('ECADL: Copying to clipboard was successful!');
    }, function(err) {
      console.error('ECADL: Could not copy text: ', err);
    });
  }

  // Let's hide all the ugly DOM stuff behind helper functions
  function isVisible(element) {
    return !(window.getComputedStyle(element).display == "none");
  }

  function getIconSpans() {
    return Array.from(document.querySelectorAll('.torrent .torrent_icon_container'));
  }

  function getTorrentRowFromIconSpan(iconSpan) {
    return iconSpan.closest(".torrent");
  }

  function getIconSpanInTorrentRow(torrentRow) {
    return torrentRow.querySelector(".torrent_icon_container");
  }

  function getDownloadNodesFromStandardRow(torrentRow) {
    let span = getIconSpanInTorrentRow(torrentRow);
    let dlNode = span.querySelector('.icon_torrent_download, .download, .snatched, .grabbed');
    if (dlNode === null) {
      dlNode = span.querySelector('a');
      if (dlNode === null) {
        console.error("Couldn't find download link in: ", span);
        return [];
      }
      console.log("We couldn't find the download link the proper way in: ", span, ", fell back to the fallback method. Link might be wrong.");
    }
    return [dlNode];
  }

  function getDownloadNodesFromVersionRow(torrentRow) {
    let nodeList = [];
    torrentRow.querySelectorAll(".version").forEach(verDiv => {
      if (verDiv.querySelector("[name=ecadlVersionCheck]") == null ||
          verDiv.querySelector("[name=ecadlVersionCheck]").checked) {
        nodeList.push(verDiv.querySelector("a"));
      }
    });
    return nodeList;
  }

  function getDownloadUrlsFromTorrentRow(torrentRow) {
    let nodes = [];
    if (torrentRow.querySelectorAll(".version").length > 0) {
      nodes = getDownloadNodesFromVersionRow(torrentRow);
    } else {
      nodes = getDownloadNodesFromStandardRow(torrentRow);
    }
    // Assume a single node, for now.
    let dlNode = nodes[0];

    let urls = [];
    nodes.forEach(node => {
      // Go up the tree for a link.
      for (let i = 0; i <= DL_LINK_SEARCH_HEIGHT; i++) {
        if (dlNode.nodeName.toUpperCase() !== "A") {
          if (i === DL_LINK_SEARCH_HEIGHT) {
            console.log("We don't have the link for ", dlNode, "!")
            return;
          }
          dlNode = dlNode.parentElement;
        } else {
          break;
        }
      }
      if (dlNode !== null) {
        urls.push(dlNode.href);
      }
    });
    return urls;
  }

  function getColHeadFromRow(torrentRow) {
    return torrentRow.parentElement?.firstElementChild;
  }

  function addHeaderToColRow(colHeadRow) {
    if (colHeadRow.querySelector("."+COL_HEADER_CLASS) === null) {
      var ecadlColHeader = document.createElement("td");
      ecadlColHeader.innerText = "📋";
      ecadlColHeader.className = COL_HEADER_CLASS;
      ecadlColHeader.onclick = () => headerToggleAllCheckboxes(colHeadRow)
      colHeadRow.insertAdjacentElement("afterbegin", ecadlColHeader);
    }
  }

  function headerToggleAllCheckboxes(colHeadRow) {
    var fullTable = colHeadRow.closest("tbody");
    var allCheckboxes = fullTable.querySelectorAll('input[name="ecadlCheck"]');
    allCheckboxes.forEach(c => {c.checked = !c.checked});
  }

  function addCheckboxToTorrentRow(torrentRow) {
    addStandardCheckboxToTorrentRow(torrentRow);
    if (torrentRow.querySelectorAll(".version").length > 1) {
      addVersionBoxCheckboxesToTorrentRow(torrentRow);
    }
  }

  function addStandardCheckboxToTorrentRow(torrentRow) {
    var td = document.createElement("td");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "ecadlCheck";
    checkbox.checked = true;
    checkbox.onclick = (evt) => evt.stopPropagation();
    td.onclick = () => {checkbox.checked = !checkbox.checked};
    td.insertAdjacentElement("afterbegin", checkbox);
    torrentRow.insertAdjacentElement("afterbegin", td);
  }

  function addVersionBoxCheckboxesToTorrentRow(torrentRow) {
    // First checkbox should be checked, others unchecked
    var versionDivs = Array.from(torrentRow.querySelectorAll(".version")).reverse();
    addCheckboxToVersionDiv(versionDivs.pop(), true);
    versionDivs.forEach(div => addCheckboxToVersionDiv(div, false));
  }

  function addCheckboxToVersionDiv(versionDiv, isChecked) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "ecadlVersionCheck";
    checkbox.checked = isChecked;
    checkbox.onclick = (evt) => evt.stopPropagation();
    var innerSpan = document.createElement("span");
    innerSpan.innerText = "📋";
    innerSpan.style.paddingRight = "28px";
    innerSpan.insertAdjacentElement("beforeend", checkbox);
    versionDiv.insertAdjacentElement("beforeend", innerSpan)
  }

  function linkInject() {
    let linkboxTargets = document.querySelectorAll(".linkbox:not(.pager)");
    if (linkboxTargets === null || linkboxTargets.length === 0) {
      // Fall back to allowing pager linkboxes
      linkboxTargets = document.querySelectorAll(".linkbox");
      if (linkboxTargets === null || linkboxTargets.length === 0) {
        console.error('ECADL couldn\'t find a linkbox to use!');
        return;
      }
    }
    // Just dump the link in the first linkbox we find.
    const linkbox = linkboxTargets[0];
    const spacer = document.createElement("span");
    spacer.innerText = "|";
    spacer.style = "width:20px;display:inline-block;";
    const clickTarget = document.createElement("A");
    clickTarget.onclick = ecadlRun;
    clickTarget.innerText = "copy selected download links";
    if (linkbox.children.length > 0) {
      linkbox.appendChild(spacer);
    }
    linkbox.appendChild(clickTarget);
  }

  function addAllDomElements() {
    var iconSpans = getIconSpans();
    if (iconSpans.length === 0) {
      // No downloadable links, abort
      return;
    }
    let torrentRows = iconSpans.map(getTorrentRowFromIconSpan).filter(r => isVisible(r));
    // Yes, we do want to do this for every row, mostly to handle the Top 10
    // page correctly.
    torrentRows.map(getColHeadFromRow).forEach(addHeaderToColRow);
    torrentRows.forEach(addCheckboxToTorrentRow);
    linkInject();
  }

  const ecadlRun = () => {
    const torrentIconSpans = getIconSpans();
    let torrentList = [];

    if (torrentIconSpans.length == 0) {
      // The link that kicks this function off shouldn't even be present when this is true.
      console.error("ECADL execution error, exemplifying extrodinary event.")
      return;
    }

    torrentIconSpans.map(getTorrentRowFromIconSpan).forEach(torrentRow => {
      if (!isVisible(torrentRow)) {
        // Treat this as an indication of execution order causing issues, don't copy links from
        // hidden rows
        return;
      }

      let checkbox = torrentRow.querySelector('input[name="ecadlCheck"]');
      if (checkbox?.checked ?? false) {
        let dlUrls = getDownloadUrlsFromTorrentRow(torrentRow);
        dlUrls.forEach(dlUrl => {torrentList.push(dlUrl)});
      }
    });

    copyTextToClipboard(torrentList.join('\n'));
    return;
  }

  addAllDomElements();
})();