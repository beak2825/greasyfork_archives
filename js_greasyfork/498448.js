// ==UserScript==
// @name        eTools QOL improvements
// @namespace   Violentmonkey Scripts
// @match       https://www.etools.ch/*
// @grant       none
// @version     1.002
// @author      Ryan Wilson
// @license     AGPL-3.0-or-later
// @description ...
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @require     https://update.greasyfork.org/scripts/421384/1134973/GM_fetch.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498448/eTools%20QOL%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/498448/eTools%20QOL%20improvements.meta.js
// ==/UserScript==

// TODO: Achieve better safety
//
// TODO: Support mobile and support engine-specific search with these options
// Not here but in the CSS Stylish add an option to disable the highlight

// TODO: Add a proper userscript config with GM_config
// -  @see https://github.com/sizzlemctwizzle/GM_config/wiki/
// TODO: Use proper JSDoc annotations on the config object for all the properties
const config = {
  yandexImageSearchBtn: true,
  /* TODO: Implement */
  collapsableSidebar: true,
  removeHighlight: true,
  disableMobileLink: false,
  /** Bring the "By Topic:" menu to the top of the right sidebar **/
  bringByTopicToTop: true,
  moveSearchStatusesToBottom: true,
  removeAffiliateLink: true,
  displayFullLink: true,
  faviSources: false,
  showFavi: true, // Fetches the favicon from the sites in a bare proxy
  autofill: {
    enabled: true,
    service: "brave",
  },
  preview: {
    enable: false,
    // This would allow for any site to be iframed with the preview feature, bringing preview to any site, using aero
    proxyPreview: true,
  },
};

const usingMobile =
  location.pathname === "/mobileSearch.do" ||
  location.pathname === "/mobileSearchSubmit.do";
const usingDesktop =
  location.pathname === "/search.do" ||
  location.pathname === "/searchSubmit.do";

if (usingDesktop) {
  if (config.yandexImageSearchBtn) {
    const searchBar = document.getElementsByClassName("query")[0];
    const searchBtn = document.getElementsByClassName("submit")[0];
    const imgSearchBtn = document.createElement("input");
    imgSearchBtn.type = "submit";
    imgSearchBtn.value = "Image Search";
    imgSearchBtn.className = "submit";
    imgSearchBtn.style.marginLeft = "5px";
    imgSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.href =
        "https://yandex.com/images/search?text=" + searchBar.value;
    });
    searchBtn.after(imgSearchBtn);
  }
  if (config.moveSearchStatusesToBottom) {
    const results = document.getElementsByClassName("result")[0];
    const resultsTable = results.parentNode;
    const statuses = [
      ...document.getElementsByClassName("searchStatus"),
    ].filter((status) => resultsTable.contains(status));
    // Search statuses on eTools are optional so they might not exist
    if (statuses.length !== 0) {
      statuses.at(-1).style.paddingBottom = "15px";
      statuses.forEach((status) => {
        resultsTable.appendChild(status);
      });
    }
  }
  if (config.disableMobileLink) {
    [...document.getElementsByTagName("a")]
      .find((link) => (link.href = "mobileSearch.do"))
      .removeAttribute("href");
    // Consider: Perhaps I should add "mobile version" to the sidebar instead and make the favicon just redirect to the real home page, not the mobile version of the site? It would be a more logical place to put the mobile version.
  }
  if (config.bringByTopicToTop) {
    // const sidebarLeft = [...document.getElementsByTagName("td")][100];
    const sourceBox = [...document.getElementsByClassName("boxTop")][2];
    const resultsToolTitle = [...document.getElementsByTagName("h3")].find(
      (title) => title.textContent === "Results Tool"
    );
    if (resultsToolTitle)
      resultsToolTitle.insertAdjacentElement("afterend", sourceBox);
  }
  if (config.faviSources) {
    const links = [...document.getElementsByTagName("a")];
    const engineToFavi = new Map();
    // TODO: Find HD sources for each favicon
    // TODO: Finish adding all of the sources
    engineToFavi.set(
      "Brave",
      "https://cdn.search.brave.com/serp/v2/_app/immutable/assets/favicon-32x32.B2iBzfXZ.png"
    );
    engineToFavi.set("DuckDuckGo", "https://duckduckgo.com/favicon.ico");
    engineToFavi.set("Google", "https://www.google.com/favicon.ico");
    engineToFavi.set("Mojeek", "https://www.mojeek.com/favicon.ico");
    engineToFavi.set("Qwant", "https://www.qwant.com/favicon.ico");
    engineToFavi.set(
      "Wikipedia",
      "https://www.wikipedia.org/static/favicon/wikipedia.ico"
    );
    engineToFavi.set(
      "Yandex",
      "https://yastatic.net/s3/home-static/_/nova/7f2537ce.png"
    );

    for (let [text, faviLink] of engineToFavi) {
      const ddgs = links.filter((link) => link.innerText === text);
      ddgs.forEach((ddg) => {
        ddg.innerText = "";
        const favi = document.createElement("img");
        favi.src = faviLink;
        favi.style.width = "20px";
        favi.style.height = "20px";
        // TODO: Keep the link to the search engine but append the current query to it
        ddg.insertAdjacentElement("afterend", favi);
      });
    }
  }
  if (!config.preview.enable) {
    const pipeText = " | ";
    // FIXME: Doesn't work on Engine-specific search
    [...document.getElementsByTagName("a")]
      .filter((link) => link.textContent === "preview" && /^p\d/.test(link.id))
      .forEach((previewLink) => {
        const pipe = previewLink.previousSibling;
        // Parity check
        if (pipe.textContent === pipeText) {
          pipe.remove();
        }
        previewLink.remove();
      });
  }
  // TODO: Add the "proxy preview" feature
  if (config.proxyPreview) {
    /*
    [...document.getElementsByClassName("attr")].forEach(attr => {
        [...attr.childNodes].forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const isPipe = child.textContent === pipeText;
                const isSource = child.textContent === "Source: ";
                if (config.faviSources && (isPipe || isSource))
                  ...
            }
        });
    })
    */
  }
}

function removeAffiliateLink(linkElement) {
  if (linkElement.href.startsWith(affiliateRedirect))
    linkElement.href = decodeURIComponent(
      linkElement.href.split(affiliateRedirect).pop()
    );
}
function desktopHandleRecord(record) {
  const children = [...record.children];
  const titleElement = children.find((el) => el instanceof HTMLAnchorElement);
  if (config.removeAffiliateLink) removeAffiliateLink(titleElement);
  if (config.displayFullLink) {
    const titleLink = titleElement.href;
    if (titleLink) {
      const urlDiv = children.find((child) => child.className === "attr");
      const attrChildren = [...urlDiv.children];
      const displayLink = attrChildren[0];
      displayLink.innerText = titleLink;
    }
  }
}
function mobileHandlePElement(pElement) {
  const children = [...pElement.children];
  const linkElement = children.find(
    (child) => child instanceof HTMLAnchorElement
  );
  if (config.removeAffiliateLink) removeAffiliateLink(linkElement);
  const varElement = children.find((child) => child.tagName === "VAR");
  varElement.innerText = linkElement.href;
}

const recordObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations)
    if (mutation.type === "childList")
      for (const node of mutation.addedNodes) {
        if (node.tagName === "TR") {
          const children = [...node.children];
          const record = children.find((child) => child.className === "record");
          if (record) desktopHandleRecord(record);
        }
      }
});
// This is done to enchance support with Pagetual because it inserts elements from the next page and this update needs to be factored
const pElementObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations)
    if (mutation.type === "childList")
      for (const node of mutation.addedNodes)
        if (node instanceof HTMLParagraphElement) mobileHandlePElement(node);
});

const affiliateRedirect = "https://www.etools.ch/redirect.do?a=";
if (config.displayFullLink || config.removeAffiliateLink) {
  if (usingDesktop) {
    const searchEntries = [...document.getElementsByClassName("record")];
    for (const searchEntry of searchEntries) desktopHandleRecord(searchEntry);
    recordObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
  if (usingMobile) {
    const pElements = [...document.getElementsByTagName("p")].filter((p) =>
      /^(\d\.)/.test(p.getAttribute("title"))
    );
    for (const pElement of pElements) mobileHandlePElement(pElement);
    pElementObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

if (config.autofill) {
  const searchBar = document.getElementById("query");
  if (searchBar) {
    searchBar.autocomplete = "off";
    const autofill = document.createElement("datalist");
    autofill.id = "autofill";
    searchBar.setAttribute("list", "autofill");
    searchBar.insertAdjacentElement("afterend", autofill);
    searchBar.addEventListener("input", (e) => {
      if (config.autofill.service === "brave")
        GM_fetch(
          `https://search.brave.com/api/suggest?q=${e.target.value}&rich=false&source=web`,
          {
            method: "GET",
          }
        )
          .then((resp) => resp.json())
          .then((results) => {
            const sgs = results[1];
            // Clear previous suggestions
            autofill.innerHTML = "";
            // Add new suggestions
            for (const sg of sgs) {
              const option = document.createElement("option");
              option.value = sg;
              autofill.appendChild(option);
            }
          });
    });
  }
}
