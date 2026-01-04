// ==UserScript==
// @name             Editorials Dropdown for AtCoder
// @name:ja          Editorials Dropdown for AtCoder
// @namespace        https://github.com/roumcha/browser-extensions/tree/main/src/editorials-dropdown-for-atcoder
// @version          1.1.0
// @description      Add a drop-down list next to the editorial buttons on AtCoder problem pages.
// @description:ja   AtCoder の解説ボタンの横にドロップダウンリストを追加します。
// @author           Roumcha
// @license          Creative Commons Zero v1.0 Universal
// @match            https://atcoder.jp/contests/*/tasks/*
// @grant            GM.xmlHttpRequest
// @connect          atcoder.jp
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/500819/Editorials%20Dropdown%20for%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/500819/Editorials%20Dropdown%20for%20AtCoder.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/editorials-dropdown-for-atcoder/editorials-dropdown.ts
  async function editorialsDropdown({
    fetchXMLDocument
  }) {
    const started = Date.now();
    let lang = getLanguage();
    const link = findEditorialsButton(document);
    if (link) {
      console.log("[EDFA] Found the target button: ", link);
    } else {
      console.log(`[EDFA] Editorials button not found.`);
      return;
    }
    const url2 = new URL(link.href);
    url2.searchParams.set("editorialLang", lang);
    const editorialsPageDoc = await fetchXMLDocument(
      url2
    ).catch((reason) => {
      console.error(`[EDFA] Failed to fetch ${link.href}: ${reason}`);
      return null;
    });
    if (editorialsPageDoc) {
      console.log(`[EDFA] Downloaded ${link.href}.`);
    } else {
      console.error(`[EDFA] ${link.href} is empty or not an XML document.`);
      return;
    }
    const content = createDropdownContent(editorialsPageDoc);
    if (content.length === 0) {
      console.error(`[EDFA] failed to generate the dropdown content.`);
      return;
    }
    const insertedElem = createDropdownAndButton(...content);
    link.after(insertedElem);
    console.log(
      `[EDFA] Successfully generated and inserted a drop-down list: `,
      insertedElem
    );
    console.log(`[EDFA] done in ${Date.now() - started} ms.`);
  }
  var translation = {
    editorial: {
      ja: "\u89E3\u8AAC",
      en: "editorial"
    },
    overallEditorial: {
      ja: "\u30B3\u30F3\u30C6\u30B9\u30C8\u5168\u4F53\u306E\u89E3\u8AAC",
      en: "overall editorial"
    }
  };
  function getLanguage() {
    const param = new URLSearchParams(location.search).get(
      "lang"
    );
    if (param) {
      console.log(`[EDFA] Found language '${param}' in the URL parameter.`);
      return param;
    }
    const cookie = document.cookie.split("; ").find((s) => s.startsWith("language="))?.split("=").at(1);
    if (cookie) {
      console.log(`[EDFA] Found language '${cookie}' in Cookie.`);
      return cookie;
    }
    const browser = navigator.language;
    if (browser == "ja") {
      console.log(`[EDFA] Loaded language '${browser}' from the browser.`);
      return "ja";
    }
    console.log(`[EDFA] Fall back to English.`);
    return "en";
  }
  function findEditorialsButton(root) {
    const res = [...root.querySelectorAll("a.btn")].filter(
      ({ textContent }) => textContent && Object.values(translation["editorial"]).includes(
        textContent.toLowerCase()
      )
    ).at(0);
    return res;
  }
  function createDropdownContent(editorialsPageDoc) {
    const res = [
      ...editorialsPageDoc.querySelectorAll(
        "#main-container > div > div:not(#contest-nav-tabs) > *"
      )
    ].filter(
      ({ tagName }) => ["ul", "h3", "p"].includes(tagName.toLowerCase())
    );
    if (res.length === 0) {
      console.error(`[EDFA] failed to find editorial lists.`);
    }
    return res;
  }
  function createDropdownAndButton(...content) {
    const res = document.createElement("span");
    res.className = "edfa-root";
    res.style.position = "relative";
    res.addEventListener("blur", () => res.classList.remove("open"));
    {
      const button = document.createElement("button");
      button.className = "edfa-button btn btn-default btn-sm";
      button.type = "button";
      button.title = "open editorials list";
      button.onclick = () => res.classList.toggle("open");
      res.append(button);
      {
        const caret = document.createElement("span");
        caret.classList.add("caret");
        button.append(caret);
      }
    }
    {
      const dropdown = document.createElement("div");
      dropdown.className = "edfa-dropdown dropdown-menu";
      dropdown.style.position = "absolute";
      dropdown.style.width = "200px";
      dropdown.style.padding = "8px";
      dropdown.style.zIndex = "998";
      dropdown.append(...content);
      res.append(dropdown);
    }
    return res;
  }

  // src/editorials-dropdown-for-atcoder/info.ts
  var title = "Editorials Dropdown for AtCoder";
  var version = "1.1.0";
  var url = "https://github.com/roumcha/browser-extensions/tree/main/src/editorials-dropdown-for-atcoder";
  var author = "Roumcha";
  var userScriptHeader = `// ==UserScript==
// @name             ${title}
// @name:ja          ${title}
// @namespace        ${url}
// @version          ${version}
// @description      Add a drop-down list next to the editorial buttons on AtCoder problem pages.
// @description:ja   AtCoder \u306E\u89E3\u8AAC\u30DC\u30BF\u30F3\u306E\u6A2A\u306B\u30C9\u30ED\u30C3\u30D7\u30C0\u30A6\u30F3\u30EA\u30B9\u30C8\u3092\u8FFD\u52A0\u3057\u307E\u3059\u3002
// @author           ${author}
// @license          Creative Commons Zero v1.0 Universal
// @match            https://atcoder.jp/contests/*/tasks/*
// @grant            GM.xmlHttpRequest
// @connect          atcoder.jp
// @run-at           document-end
// ==/UserScript==
`;

  // src/editorials-dropdown-for-atcoder/user-script.ts
  (async function() {
    console.log(`[EDFA] ${title} v${version} (UserScript) started.`);
    await editorialsDropdown({
      fetchXMLDocument: async (url2) => await GM.xmlHttpRequest({ url: url2 }).then((res) => res.responseXML)
    });
  })();
})();
