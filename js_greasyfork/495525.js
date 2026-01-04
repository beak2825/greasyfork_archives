// ==UserScript==
// @name          PAPAZ Google Direct Image Links
// @description   Replaces Google Image search result links with direct image links
// @version       2.0
// @author        DoctorEye
// @namespace     DoctorEye
// @include      /^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*tbm=isch.*/
// @include      /^https?:\/\/(www\.)?google\.[a-z\.]{2,5}\/search.*udm=2.*/
// @license      Proprietary
// @run-at       document-start
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/495525/PAPAZ%20Google%20Direct%20Image%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/495525/PAPAZ%20Google%20Direct%20Image%20Links.meta.js
// ==/UserScript==

// === ΡΥΘΜΙΣΗ: Αριστερό κλικ σε νέο tab? ===
const LEFT_CLICK_NEW_TAB = false;  // true = νέο tab | false = ίδιο tab
// ==========================================

const updateInterval = 1000;
const maxtries = 100;
const selector = `.rg_di.rg_bx a.rg_l img:not(.linksdone),
#islrg div.isv-r a.wXeWr.islib img:not(.linksdone),
div#res div#rso h3 a g-img img:not(.linksdone),
div#islmp div.islrc a[role="button"] img:not(.linksdone),
div#search div[data-attrid="images universal"] h3 a[href] img:not(.linksdone)
`;

function updatePage() {
  document.querySelectorAll(selector).forEach(e => {
    if (e.classList.contains("linksdone")) return;
    const tp = e.closest('a');
    if (!tp) return;

    // Αριστερό κλικ
    tp.addEventListener('click', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      waitForLink(tp, LEFT_CLICK_NEW_TAB, false); // false = ενεργό tab
    });

    // Μεσαίο κλικ
    tp.addEventListener('auxclick', event => {
      if (event.button !== 1) return;
      event.preventDefault();
      event.stopPropagation();
      waitForLink(tp, true, true); // true = background tab
    });

    e.classList.add("linksdone");
  });
}

function waitForLink(tp, openInNew, background) {
  const imin = tp.href.indexOf("imgurl=");
  if (imin < 0) {
    let tries = tp.getAttribute("resTries") ? parseInt(tp.getAttribute("resTries")) + 1 : 1;
    if (tries === 1) {
      tp.click();
      setTimeout(() => tp.click(), 200);
    }
    tp.setAttribute("resTries", tries);
    if (tries >= maxtries) return;
    setTimeout(() => waitForLink(tp, openInNew, background), 200);
    return;
  }

  const linkconts = tp.href.substr(imin + 7);
  let piclink = linkconts.substr(0, linkconts.indexOf("&"));
  piclink = decodeURIComponent(piclink);

  if (openInNew) {
    GM_openInTab(piclink, { active: !background });
  } else {
    location.href = piclink;
  }
}

setInterval(updatePage, updateInterval);
updatePage();