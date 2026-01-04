// ==UserScript==
// @name         rarbg-magnet-batch-copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display checkboxes and magnet icons on rarbg search result page, you can batch copy magnet links.
// @author       Xavier Lee
// @match        *://rarbg.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rarbg.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445556/rarbg-magnet-batch-copy.user.js
// @updateURL https://update.greasyfork.org/scripts/445556/rarbg-magnet-batch-copy.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /**
   * Global constant
   */
  const itemCheckboxClass = "rarbg-magnet-batch-item-checkbox";
  const modalWrapperId = "rarbg-magnet-batch-modal-wrapper";
  const modalContentId = "rarbg-magnet-batch-modal-content";
  const selectAllText = "✅Select All";
  const unselectAllText = "🔳Unselect All";
  const copySelectedButtonText = "🧲📋Copy Selected Magnet Links";
  // selectors on the rarbg details page
  const rarbgPageMagnetIconSelector = "a[href^='magnet:?']";
  const rarbgPageTorrentLinkSelector = "a[href$='.torrent']";
  // selectors on the rarbg search result page
  const itemRowSecondTdSelector = "tr.lista2 > td:nth-child(2)";
  const titleLinkInSecondTdSelector = "a[title]";
  const headerRowSecondCellSelector =
    "table.lista2t > tbody > tr:nth-child(1) > td:nth-child(2)";
  const itemRowSelector = "table.lista2t > tbody > tr.lista2";

  /**
   * Create control elements
   */
  const createControlElement = function (controlType) {
    const controlDetailsObject = {
      selectAllButton: {
        element: "button",
        innerText: selectAllText,
        attributes: {
          style: "margin-right:10px;",
        },
      },
      copySelectedMagnetButton: {
        element: "button",
        innerText: copySelectedButtonText,
        attributes: {
          style: "margin-left:10px;",
        },
      },
      lineBreak: {
        element: "br",
      },
      itemCheckbox: {
        element: "input",
        attributes: {
          type: "checkbox",
          style: "height: 12px;",
          class: itemCheckboxClass,
        },
      },
      magnetIcon: {
        element: "img",
        attributes: {
          title: "copy magnet link",
          class: "copyManet",
          src: "https://dyncdn.me/static/20/img/magnet.gif",
          style: "margin: 0px 5px;",
        },
      },
      torrentIcon: {
        element: "img",
        attributes: {
          title: "download torrent file",
          class: "downloadTorrent",
          src: "https://dyncdn.me/static/20/img/16x16/download.png",
        },
      },
      modalWrapper: {
        element: "div",
        innerText: "",
        attributes: {
          id: modalWrapperId,
          style:
            "display:none; position:fixed; z-index:1; padding-top:100px; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);",
        },
      },
      modalContent: {
        element: "div",
        innerText: "",
        attributes: {
          id: modalContentId,
          style:
            "background-color:#fefefe; margin:auto; padding:20px; border:1px solid #888; width:80%; color:#000;",
        },
      },
    };
    const possibleTypes = Object.keys(controlDetailsObject);
    if (!possibleTypes.includes(controlType)) {
      throw `createControlElement function, argument controlType is ${controlType}, expecting ${possibleTypes}`;
    }
    const controlDetail = controlDetailsObject[controlType];
    const controlAttributes = controlDetail.attributes;
    const controlElement = document.createElement(controlDetail.element);
    controlElement.innerText = controlDetail.innerText;
    for (const attributeName in controlAttributes) {
      if (Object.hasOwnProperty.call(controlAttributes, attributeName)) {
        const attributeValue = controlAttributes[attributeName];
        controlElement.setAttribute(attributeName, attributeValue);
      }
    }
    return controlElement;
  };

  /**
   * This function UPDATE the array of rarbgMagnetTorrentItems
   * rarbgMagnetTorrentItems should be something like:
  [
    {
      name: "This.Is.Us.S04E18.1080p.AMZN.WEBRip.DDP5.1.x264-KiNGS[rartv]",
      pageUrl: "https://rarbg.to/torrent/dti6lc1",
      magnetUrl: null,
      torrentUrl: null,
    },
    {
      name: "This.Is.Us.S04E17.1080p.AMZN.WEBRip.DDP5.1.x264-KiNGS[rartv]",
      pageUrl: "https://rarbg.to/torrent/pnljgd2",
      magnetUrl: null,
      torrentUrl: null,
    },
  ]
   * Then the function should update the magnetUrl and torrentUrl in each object of the array
   */
  const updateRarbgMagnetTorrentItems = async function (items) {
    const responses = await Promise.all(
      items.map((item) => fetch(item.pageUrl))
    );
    const htmls = await Promise.all(responses.map((r) => r.text()));
    htmls.forEach((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const torrentLink = doc.querySelector(rarbgPageTorrentLinkSelector);
      const magnetIcon = doc.querySelector(rarbgPageMagnetIconSelector);
      const pageName = torrentLink.innerText;
      const magnetUrl = magnetIcon.getAttribute("href");
      const torrentUrl = torrentLink.getAttribute("href");
      const currentName = items.find((item) => item.name === pageName);
      currentName.magnetUrl = magnetUrl;
      currentName.torrentUrl = torrentUrl;
    });
    return items;
  };

  /**
   * This function GENERATE one rarbgMagnetTorrentItem obj from the second td in an item row
   */
  const generateRarbgMagnetTorrentItem = function (td) {
    const titleLink = td.querySelector(titleLinkInSecondTdSelector);
    return {
      name: titleLink.innerText,
      pageUrl: titleLink.getAttribute("href"),
      magnetUrl: null,
      torrentUrl: null,
    };
  };

  /**
   * This function GENERATE the array of rarbgMagnetTorrentItems for selected
   * Or for a single item in an array when click the icon directly
   */
  const generateRarbgMagnetTorrentItemsForSelected = function (
    targetTd = null
  ) {
    if (targetTd) {
      return [generateRarbgMagnetTorrentItem(targetTd)];
    }
    const itemRowSecondTds = document.querySelectorAll(itemRowSecondTdSelector);
    return Array.from(itemRowSecondTds)
      .filter((td) => td.querySelector(`.${itemCheckboxClass}`).checked)
      .map((td) => generateRarbgMagnetTorrentItem(td));
  };

  /**
   * Select or Un-select all item checkboxes
   */
  const selectOrUnselectAllItems = function (event) {
    const targetButton = event.target;
    const currentButtonText = targetButton.innerText;
    const checkboxes = document.querySelectorAll(`.${itemCheckboxClass}`);
    if (currentButtonText === selectAllText) {
      checkboxes.forEach((checkbox) => (checkbox.checked = true));
      targetButton.innerText = unselectAllText;
    } else {
      checkboxes.forEach((checkbox) => (checkbox.checked = false));
      targetButton.innerText = selectAllText;
    }
  };

  /**
   * This function showing a message to user
   */

  const showMessage = function (str) {
    const modalWrapper = document.getElementById(modalWrapperId);
    const modalContent = document.getElementById(modalContentId);
    modalContent.innerText = str;
    modalWrapper.style.display = "block";

    setTimeout(() => {
      modalWrapper.style.display = "none";
      modalContent.innerText = "";
    }, 2000);
  };

  /**
   * This function get UPDATED rarbgMagnetTorrentItems for selected or targeted
   */
  const getUpdatedRarbgMagnetTorrentItems = async function (event) {
    let targetTdOrNull;
    if (event.target.tagName !== "BUTTON") {
      // means user clicked icon
      targetTdOrNull = event.target.parentNode;
    }
    const rarbgMagnetTorrentItems =
      generateRarbgMagnetTorrentItemsForSelected(targetTdOrNull);
    await updateRarbgMagnetTorrentItems(rarbgMagnetTorrentItems);
    return rarbgMagnetTorrentItems;
  };

  /**
   * This function copy selected items' magnet urls to clipboard
   */
  const copySelectedMagnetUrls = async function (event) {
    const rarbgMagnetTorrentItems = await getUpdatedRarbgMagnetTorrentItems(
      event
    );
    const textToCopy = rarbgMagnetTorrentItems
      .map((item) => item.magnetUrl)
      .join("\t\n");
    await navigator.clipboard.writeText(textToCopy);
    showMessage(
      `successfully copied ${rarbgMagnetTorrentItems.length} links to clipboard: 
${textToCopy}`
    );
  };

  /**
   * This function download the torrent file
   */
  const downloadSelectedTorrent = async function (event) {
    const rarbgMagnetTorrentItems = await getUpdatedRarbgMagnetTorrentItems(
      event
    );
    const torrentUrl = rarbgMagnetTorrentItems[0].torrentUrl;
    const name = rarbgMagnetTorrentItems[0].name;
    const link = document.createElement("a");
    link.href = torrentUrl;
    link.setAttribute("target", "_blank");
    link.click();
  };

  /**
   * Insert UI buttons on top of the table
   */
  const insertUiButtonsOnTop = function (target = null) {
    const scopeDoc = target ? target : document;
    const headerRowSecondCell = scopeDoc.querySelector(
      headerRowSecondCellSelector
    );
    if (!headerRowSecondCell) {
      return;
    }
    const selectAllButton = createControlElement("selectAllButton");
    selectAllButton.addEventListener("click", selectOrUnselectAllItems);
    const copySelectedMagnetButton = createControlElement(
      "copySelectedMagnetButton"
    );
    copySelectedMagnetButton.addEventListener("click", copySelectedMagnetUrls);
    headerRowSecondCell.append(selectAllButton, copySelectedMagnetButton);
  };

  /**
   * Insert UI controls into each item row
   */
  const insertUiControlElementsPerRow = function (target = null) {
    const scopeDoc = target ? target : document;
    const itemRows = scopeDoc.querySelectorAll(itemRowSelector);

    itemRows.forEach((row, i) => {
      const itemLinkTd = row.querySelectorAll("td")[1];
      const itemCheckbox = createControlElement("itemCheckbox");
      const magnetIcon = createControlElement("magnetIcon");
      magnetIcon.addEventListener("click", copySelectedMagnetUrls);
      const torrentIcon = createControlElement("torrentIcon");
      torrentIcon.addEventListener("click", downloadSelectedTorrent);
      const lineBreak = createControlElement("lineBreak");
      itemLinkTd.prepend(itemCheckbox, magnetIcon, torrentIcon, lineBreak);
    });
  };

  /**
   * Insert model related element for notification
   */
  const insertModelToBody = function () {
    const modalWrapper = createControlElement("modalWrapper");
    const modalContent = createControlElement("modalContent");
    modalWrapper.append(modalContent);
    document.body.append(modalWrapper);
  };

  /**
   * Setting up the observer when click expanding on tv page
   */
  const setupObserverForTvPage = function () {
    const contentTable = document.querySelector(".lista-rounded");
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length > 0) {
          insertUiButtonsOnTop(mutation.target);
          insertUiControlElementsPerRow(mutation.target);
        }
      });
    });
    observer.observe(contentTable, { childList: true, subtree: true });
  };

  /**
   * Main entrance
   */
  insertUiButtonsOnTop();
  insertUiControlElementsPerRow();
  insertModelToBody();
  setupObserverForTvPage();
})();
