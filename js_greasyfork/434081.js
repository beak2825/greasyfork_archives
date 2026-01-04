// ==UserScript==
// @name         export onetab urls
// @version      0.0.1
// @description  从 onetab 的分享页导出物质
// @author       ayase
// @match        https://www.one-tab.com/page/*
// @run-at document-end
// @namespace https://greasyfork.org/users/298898
// @downloadURL https://update.greasyfork.org/scripts/434081/export%20onetab%20urls.user.js
// @updateURL https://update.greasyfork.org/scripts/434081/export%20onetab%20urls.meta.js
// ==/UserScript==

(() => {
  const main = () => {
    document.addEventListener('keypress', (evt) => {
      if (evt.code === 'KeyA') {
        openWindown(getLinks());
      }
    })
  };

  const getLinks = () => {
    const links = [];
    for (const a of [...document.querySelectorAll("a")]) {
      if (a.href.includes("one-tab.com")) {
        continue;
      }
      links.push(a.href);
    }
    return links
  }

  /**
   *
   * @param {string[]} links
   */
  const openWindown = (links) => {
    const w = window.open();
    w.document.body.innerHTML = `<textarea style="width: 1200px; height: 600px;">${links.join(
      "\n"
    )}</textarea>`;
  }

  main();
})();

