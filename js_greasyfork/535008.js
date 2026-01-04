// ==UserScript==
// @name        Google css
// @description Remove column gaps, enforce max-width + full previews, strip grid/flex layouts, margins & reset positions on Google web search only
// @match       https://www.google.com/search?*
// @exclude     https://www.google.com/search?*tbm=nws*
// @run-at      document-start
// @version 0.0.1.20250730131648
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535008/Google%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/535008/Google%20css.meta.js
// ==/UserScript==

(function () {
  const css = `
:root {
color-scheme: light dark !important;
}
* {
    margin: revert !important;
    white-space: revert !important;
background: revert !important;
    color: revert !important;
}
    #rcnt {
      /*google search not news*/
      column-gap: 0 !important;
    }

    /* Apply max-width to every search-result wrapper */
    .MjjYud {
      max-width: 290px !important;
    }

    /* 2) Remove the -webkit-line-clamp limitation on the snippet */
    .VwiC3b.yXK7lf.p4wth.r025kc.hJNv6b.Hdw6tb {
      -webkit-line-clamp: unset !important;
    }

    /* Remove grid display on specific container */
    .YNk70c {
      display: unset !important;
    }

    .pZvJc { position: static !important; }
    .y6UnXe { display: block !important; }
.crJ18e {
    gap: 0px; !important;
    flex-wrap: wrap; !important;
}

.qogDvd {
    display: unset; !important
}

a.FgNLaf {
    display: none !important;
}

    /* Remove minimum width constraint */
    .YNk70c:not(.B2Ogle) {
      min-width: unset !important;
    }

    .NDnoQ {
      display: unset !important;
    }

    /* Remove left padding */
    .Efnghe {
      padding-left: 0 !important;
    }

/* Remove positioning on the search form container */
.CvDJxb,
#searchform {
  position: static !important;
}

/* Remove that top padding */
.e9EfHf {
  padding-top: 0 !important;
}

/* Hide the entire #sfcnt dodTBe container */
#sfcnt.dodTBe {
  display: none !important;
}

/* Strip flex off the .RNNXgb element */
.RNNXgb {
  display: block !important;
border: 0px !important;
}

    /* Reset #fsl white-space to default */
    #fsl {
      white-space: normal !important;
    }

.y3NyWc {
  height: unset !important;
}

div[id]:has(> div > div > div > div > div > div > div > div > a > div > span > svg > path[d^="M8.59 16.59L13.17"]):has(> div > div > div > span[role="heading"]) {
    display: none !important;
}

div[id]:has(> div > div > div > div > div > div > div > div > div > div > a > div > div > div > span > svg > path[d^="M15.5 14h-.79l-.28-.27A6.471"]) {
    display: none !important;
}

div[role="navigation"] > div:has(> div) {
    overflow-x: auto !important;
}

div.main > div > div:nth-of-type(2) > div {
display: none !important;
}

div[aria-label="Search by image"], div[aria-label="Search by voice"] {
  padding: revert !important;
}

div:has(> div > div > div > div[aria-label="Search by voice"]) {
  display: flex !important;
  overflow: auto !important;
}
    `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();