// ==UserScript==
//
// @name            Better Iceberg
// @name:fr         Better Iceberg
// @namespace       https://deuchnord.fr/userscripts#better-iceberg
// @license         AGPL-3.0
// @version         2.3.1
// @description     Provides enhancements to download websites.
// @description:fr  Améliore les sites de téléchargement.
// @author          Deuchnord
//
// @match           https://www.wawacity.*/*
// @match           https://www.yggtorrent.*/*
// @match           https://igg-games.com/*
// @match           https://t.me/s/Wawacity_officiel
//
// @match           https://dl-protect.link/*
// @match           https://bluemediaurls.lol/url-generator-1.php?url=*
//
// @match           https://1fichier.com/*
//
// @icon            data:image/png;base64,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
//
// @grant           GM_openInTab
//
// @downloadURL https://update.greasyfork.org/scripts/484733/Better%20Iceberg.user.js
// @updateURL https://update.greasyfork.org/scripts/484733/Better%20Iceberg.meta.js
// ==/UserScript==

(async function() {

  'use strict';


  function normalizeHomoglyphs(str) {

    const map = {
      "ѕ": "s", "а": "a", "е": "e", "о": "o",
      "р": "p", "с": "c", "х": "x", "і": "i"
    };

    return str.split("").map(ch => map[ch] || ch).join("");
  }

  function parseSelection(text) {
    text = text.replace(' ', '');

    let selection = [];

    for (let part of text.split(',')) {
      if (part === '') {
        continue;
      }

      if (!part.includes('-')) {
        let parsedPart = parseInt(part);

        if (isNaN(parsedPart)) {
          throw `"${part}" n'est pas un nombre.`;
        }

        selection.push(parsedPart);
        continue;
      }

      if ((part.match(/-/g) || []).length > 1) {
        throw `la partie "${part}" contient plus d'un tiret.`;
      }

      let sequence = part.split('-');
      let start = parseInt(sequence[0]);
      let end = parseInt(sequence[1]);

      if (isNaN(start) || isNaN(end)) {
        throw `"${part}" n'est pas une séquence de nombres valide.`;
      }
      if (end <= start) {
        throw `"${part}" est une séquence invalide. Peut-être vouliez-vous écrire "${end}-${start}" ?`
      }

      for (let i = start; i <= end; i++) {
        selection.push(i);
      }
    }

    if (selection.length === 0) {
      throw `la liste d'épisodes à télécharger est vide.`
    }

    return [...new Set(selection)];
  }

  function openTabs(links) {
    let openedTabs = [];

    for (let link of links) {
      let t = GM_openInTab(link, {active: false, insert: false, setParent: true});

      if (typeof t == "Promise") {
        // Tampermonkey compatibility (for some reasons it returns a Promise instead of the tab object)
        t.then(tab => {
          openedTabs.push(tab);
        });
      } else {
        openedTabs.push(t);
      }
    }

    return openedTabs;
  }

  const CURRENT_URL = document.location.href;


  /**
   * ******** WAWACITY ******** *
   */


  if (CURRENT_URL.startsWith("https://www.wawacity.")) {

    // Simplify page title
    if (document.title.startsWith("Télécharger ")) {
      document.title = document.title.replace("Télécharger ", "").replace(" gratuitement sur Wawacity", "");
    }

    function getLinks() {

      let ddlLinksTable = document.getElementById("DDLLinks");
      if (ddlLinksTable === null) {
        ddlLinksTable = document.getElementById("DDLLinkѕ"); // be careful, last "s" is actually a Cyrillic character.
      }

      const ddlTable = ddlLinksTable.childNodes[1];
      let dlLinks = {};

      for (const row of ddlTable.getElementsByClassName("link-row")) {
        const linkTd = row.childNodes[1];
        const sourceTd = row.childNodes[3];

        if (sourceTd.innerText === "Anonyme") {
          // Skip buguous line. This is an advertising anyway.
          continue;
        }

        let link = linkTd.getElementsByClassName("link")

        if (link.length == 0) {
          continue;
        }

        link = link[0].href;
        let source = sourceTd.innerText;

        if (!(source in dlLinks)) {
          dlLinks[source] = [];
        }

        dlLinks[source].push(link);
      }

      return dlLinks;
    }

    let linkByProvider = getLinks();
    let nbEpisodes = 0;

    for (let provider in linkByProvider) {
      nbEpisodes = linkByProvider[provider].length;
      break;
    }

    if (nbEpisodes < 2) {
      console.warn(`${nbEpisodes} episodes found. Aborting.`);
      return;
    }

    let dlSection = document.createElement("div");
    dlSection.classList.add("wa-sub-block");

    let dlSectionTitle = document.createElement("div");
    dlSectionTitle.classList.add("wa-sub-block-title");
    dlSectionTitle.innerText = "Téléchargement avancé";

    let dlSectionBody = document.createElement("div");
    dlSectionBody.classList.add("wa-block-body");

    let dlIntro = document.createElement("p");
    let openedTabs = [];

    let closeAllLink = document.createElement("button");
    closeAllLink.innerText = "Tout fermer";
    closeAllLink.href = "#";
    closeAllLink.style.display = "none";

    closeAllLink.addEventListener("click", e => {
      e.preventDefault();
      closeAllLink.style.display = "none";

      for (let tab of openedTabs) {
        tab.close();
      }

      openedTabs = [];
    });


    let form = document.createElement("form");
    form.classList.add("form-horizontal");

    let divAll = document.createElement("div");
    divAll.classList.add("form-group");

    let subDivAll = document.createElement("div");
    subDivAll.classList.add("col-sm-offset-2", "col-sm-5");
    divAll.appendChild(subDivAll);

    let subSubDivAll = document.createElement("div");
    subSubDivAll.classList.add("radio");
    subDivAll.appendChild(subSubDivAll);

    let radioDlAll = document.createElement("input");
    radioDlAll.type = "radio";
    radioDlAll.id = "radioDlAll";
    radioDlAll.name = "dlmode";
    radioDlAll.checked = true;
    radioDlAll.classList.add("form-check-input");

    let labelDlAll = document.createElement("label");
    labelDlAll.htmlFor = "radioDlAll";
    labelDlAll.appendChild(radioDlAll)
    labelDlAll.appendChild(document.createTextNode("Tout télécharger"));

    subSubDivAll.appendChild(labelDlAll);

    let divSome = document.createElement("div");
    divSome.classList.add("form-group");

    let subDivSome = document.createElement("div");
    subDivSome.classList.add("col-sm-offset-2", "col-sm-5");
    divSome.appendChild(subDivSome);

    let subSubDivSome = document.createElement("div");
    subSubDivSome.classList.add("radio");
    subDivSome.appendChild(subSubDivSome);

    let radioDlSome = document.createElement("input");
    radioDlSome.type = "radio";
    radioDlSome.id = "radioDlSome";
    radioDlSome.name = "dlmode";
    radioDlSome.classList.add("form-check-input");

    let labelDlSome = document.createElement("label");
    labelDlSome.htmlFor = "radioDlSome";
    labelDlSome.appendChild(radioDlSome);
    labelDlSome.appendChild(document.createTextNode("Télécharger certains épisodes :"));

    let inputSomeEpisodes = document.createElement("input");
    inputSomeEpisodes.type = "text";
    inputSomeEpisodes.disabled = true;
    inputSomeEpisodes.placeholder = "exemple : 1-8, 12, 15-17";
    inputSomeEpisodes.title = "Indiquez ici la liste des épisodes à télécharger, séparés par des virgules.\nLe tiret permet d'indiquer une succession.\nExemple : 1-8, 12, 15-17";
    inputSomeEpisodes.value = `1-${nbEpisodes}`;
    inputSomeEpisodes.classList.add("form-control");

    function onDlModeChange(e) {
      inputSomeEpisodes.disabled = (e.srcElement !== radioDlSome)
    };

    radioDlAll.onchange = onDlModeChange;
    radioDlSome.onchange = onDlModeChange;

    labelDlSome.appendChild(inputSomeEpisodes);

    subSubDivSome.appendChild(labelDlSome);

    let divSelectProvider = document.createElement("div");
    divSelectProvider.classList.add("form-group");

    let labelSelectProvider = document.createElement("label");
    labelSelectProvider.for = "selectProvider";
    labelSelectProvider.innerHTML = "Télécharger depuis&nbsp;:";
    labelSelectProvider.classList.add("control-label", "col-sm-2");

    let divInnerSelectProvider = document.createElement("div");
    divInnerSelectProvider.classList.add("col-sm-2");

    let selectProvider = document.createElement("select");
    selectProvider.name = "selectProvider";
    selectProvider.id = "selectProvider";
    selectProvider.classList.add("form-control");

    for (let provider in linkByProvider) {
        let option = document.createElement("option");
        option.value = option.innerText = provider;
        selectProvider.appendChild(option);
    }

    divInnerSelectProvider.appendChild(selectProvider);

    divSelectProvider.appendChild(labelSelectProvider);
    divSelectProvider.appendChild(divInnerSelectProvider);

    let errorContainer = document.createElement("p");
    errorContainer.rel = "alert";
    errorContainer.classList.add("alert", "alert-danger", "hidden");

    let divButtons = document.createElement("div");
    divButtons.classList.add("form-group");

    let divInnerButtons = document.createElement("div");
    divInnerButtons.classList.add("col-sm-offset-2", "col-sm-5");

    divButtons.appendChild(divInnerButtons);

    let dlExec = document.createElement("button");
    dlExec.type = "submit";
    dlExec.innerText = "Télécharger";
    dlExec.onclick = function (e) {
      e.preventDefault();
      errorContainer.classList.add("hidden");

      try {
        if (radioDlAll.checked) {
          openedTabs.push(...openTabs(linkByProvider[selectProvider.value]));
        } else if (radioDlSome.checked) {
          let selection = parseSelection(inputSomeEpisodes.value);
          let toOpen = [];

          for (let episode of selection) {
            let i = linkByProvider[selectProvider.value][episode - 1];
            if (i === undefined) {
              throw `l'épisode ${episode} n'existe pas.`;
            }
            toOpen.push(i);
          }

          openedTabs.push(...openTabs(toOpen));
        }

        closeAllLink.style.display = "inline";
      } catch (e) {
        errorContainer.classList.remove("hidden");
        errorContainer.innerText = `Une erreur s'est glissée dans la liste des épisodes saisie : ${e}`;
      }
    };

    dlExec.classList.add("btn", "btn-default");
    closeAllLink.classList.add("btn", "btn-default");

    divInnerButtons.appendChild(dlExec);
    divInnerButtons.appendChild(closeAllLink);

    dlSectionBody.appendChild(form);

    form.appendChild(errorContainer);
    form.appendChild(divSelectProvider);
    form.appendChild(divAll);
    form.appendChild(divSome);
    form.appendChild(divButtons);

    dlSection.appendChild(dlSectionTitle);
    dlSection.appendChild(dlSectionBody);

    let detailPage = document.getElementById("detail-page");
    let foundPosition = false;
    let block = null;

    for (block of detailPage.getElementsByClassName("wa-sub-block")) {
      for (let child of block.childNodes) {
        if (child.id == "streamLinkѕ" || child.id == "DDLLinkѕ") {
          foundPosition = true;
          break;
        }
      }

      if (foundPosition) {
        break;
      }
    }

    if (!foundPosition) {
      console.error("Could not find a good place for the download section.");
      return;
    }

    detailPage.insertBefore(dlSection, block);

    setInterval(function() {
      if (openedTabs.length === 0 && closeAllLink.style.display !== "none") {
        closeAllLink.style.display = "none";
        return;
      }

      let stillOpenTabs = [];
      for (let tab of openedTabs) {
        if (!tab.closed) {
          stillOpenTabs.push(tab);
        }
      }

      openedTabs = stillOpenTabs;
    }, 10);

  }


    /**
     * ******** IGG GAMES ******** *
     */


  else if (CURRENT_URL.startsWith("https://igg-games.com")) {

      for (let h of document.getElementsByClassName("uk-heading-bullet")) {
        let links = [];

        if (h.tagName !== "B" || h.innerText.toLowerCase().includes("torrent")) {
          continue;
        }

        for (let t of h.parentNode.childNodes) {
          if (t.href === undefined) {
            continue;
          }

          links.push(t.href)
        }

        console.log([h.innerText, links]);

        if (links.length === 0) {
          continue;
        }

        let openAll = e => {
          e.preventDefault();
          let tabs = openTabs(links);

          otLink.innerText = " (close all tabs)";
          otLink.onclick = closeAll(tabs);
        };

        let closeAll = ts => e => {
          e.preventDefault();

          for (let t of ts) {
            t.close();
          }

          otLink.innerText = " (open all tabs)";
          otLink.onclick = openAll;
        }

        let otLink = document.createElement("a");
        otLink.href="#";
        otLink.innerText = " (open all tabs)"
        otLink.onclick = openAll;

        h.appendChild(otLink);
      }

  }


  /**
   * ******** YGGTORRENT ******** *
   */

  if (document.location.href.startsWith("https://www.yggtorrent.")) {

    let topMenu = document.querySelectorAll('#top_panel .ct ul li');

    let seedLeet = [
      topMenu[0].children[0].innerText.replaceAll(' ', ''),
      topMenu[0].children[1].innerText.replaceAll(' ', ''),
    ];

    for (let i = 0; i < 2; i++) {
      let sl = seedLeet[i];

      if (sl.endsWith('Go')) {
        sl = parseFloat(sl.replace('Go')) * 1024 ** 3;
        seedLeet[i] = sl;

        // Fix the display:
        topMenu[0].children[i].innerHTML = topMenu[0].children[i].innerHTML.replace('Go', '&nbsp;Go');
      } else if (sl.endsWith('To')) {
        sl = parseFloat(sl.replace('To')) * 1024 ** 4;
        seedLeet[i] = sl;

        // Fix the display:
        topMenu[0].children[i].innerHTML = topMenu[0].children[i].innerHTML.replace('To', '&nbsp;To');
      }
    }

    const UNITS = ['octets', 'Ko', 'Mo', 'Go', 'To'];
    let dlCapacity = seedLeet[0] - seedLeet[1];

    let color = 'white';

    if (dlCapacity <= 5 * 1024 ** 3) {
      color = '#ea5656';
    } else if (dlCapacity <= 10 * 1024 ** 3) {
      color = '#f29137';
    } else if (dlCapacity <= 15 * 1024 ** 3) {
      color = '#ffe06b';
    }

    let n = 0;
    while (dlCapacity > 1024 && n < 4) {
      dlCapacity /= 1024;
      n++;
    }

    dlCapacity = `${dlCapacity.toFixed(2)}&nbsp;${UNITS[n]}`;
    topMenu[1].innerHTML += `<strong style="color: ${color}; margin-left: 5px">(reste ${dlCapacity})</strong>`;

  }


  /**
   * ******** FILE HOSTING SERVICES ******** *
   */


  /**
   * ******** 1FICHIER.COM ******** *
   */

  else if (document.location.href.startsWith("https://1fichier.com/")) {

    let filename = document.querySelector("table.premium:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)")?.innerText;
    if (filename !== undefined) {
      document.title = filename;
    }

    // Close the dialog that shows up at page load
    let ctaInterval = setInterval(function () {
      let ctaDialog = document.querySelector("html body div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front div.ui-dialog-titlebar.ui-corner-all.ui-widget-header.ui-helper-clearfix button.ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close");

      if (!ctaDialog) {
        return;
      }

      ctaDialog.click();
      clearInterval(ctaInterval);
    }, 100);

  }


  else if (document.location.href.startsWith("https://dl-protect.link/") || document.location.href.startsWith("https://bluemediaurls.lol/url-generator-1.php?url=")) {


    let continueBtn;
    let isOk;
    let openUrls;

    /**
     * ******** DL-PROTECT ******** *
     */


   if (document.location.href.startsWith("https://dl-protect.link/")) {
      continueBtn = document.getElementById("subButton");
      isOk = (btn) => !btn.disabled;

      openUrls = () => {
        let urlsUl = document.getElementsByClassName("urls")[0].childNodes[1];
        let urlsOpened = false;
        for (let child of urlsUl.childNodes) {
          if (child.tagName != "LI") {
            continue;
          }

          for (let subChild of child.childNodes) {
            if (subChild.tagName != "A") {
              continue;
            }

            document.location.href = subChild.href;
          }
        }
      }
    }


    /**
     * ******** BLUE MEDIA FILE ******** *
     */


    else if (document.location.href.startsWith("https://bluemediaurls.lol/url-generator-1.php?url=")) {
      continueBtn = document.getElementById("nut");
      isOk = (btn) => btn.src != "";
    }


    if (continueBtn == undefined) {
      if (openUrls != undefined) {
        openUrls();
      }

      return;
    }

    let i = setInterval(() => {
        if (!isOk(continueBtn)) {
            return;
        }

        continueBtn.click();
        clearInterval(i);
    }, 100)

    setTimeout(() => {
      if (isOk(continueBtn)) {
        return;
      }

      location.reload();
    }, 15000);

  }


  /**
   * ******** TELEGRAM CHANNELS ******** *
   */

  else if (document.location.href === "https://t.me/s/Wawacity_officiel") {
      let msg = document.getElementsByClassName('tgme_widget_message_bubble');
      msg = msg[msg.length - 1];

      let url = msg.getElementsByTagName("a")[1].href;

      if (!url.startsWith('https://wawacity.') && !url.startsWith('https://www.wawacity.')) {
          console.warn(`URL is probably wrong, not redirecting. Got "${url}".`)
          return;
      }

      let content = null;

      do {
          content = msg.querySelector(".tgme_widget_message_text");
          await new Promise(resolve => setTimeout(resolve, 50));
      } while (content === null);

      let html = content.innerHTML;
      let counter = 3;

      setInterval(function () {
          if (counter === 0) {
              document.location.replace(url);
              return;
          }

          content.innerHTML = html + `<br /><strong>Redirection automatique dans ${counter} seconde${counter > 1 ? 's' : ''}.</strong>`;
          counter--;
      }, 1000);
  }

})();
