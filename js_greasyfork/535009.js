// ==UserScript==
// @name        Bing Minimalist Search Layout
// @description Strips out padding, margins, logos and clipping rules on Bing search results for a clean, compact, full‑text view.
// @match       https://www.bing.com/search?*
// @exclude     https://www.bing.com/news/search?*
// @run-at      document-start
// @version 0.0.1.20250730102450
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535009/Bing%20Minimalist%20Search%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/535009/Bing%20Minimalist%20Search%20Layout.meta.js
// ==/UserScript==

(function () {
  const css = `
    /* Remove top padding on first result */
    #b_results > li:first-child,
    #b_results > li:first-child.b_bfb_mainline.b_ans:empty + li:not(.b_ans.b_topborder) {
      padding-top: 0 !important;
    }

    /* Remove padding on algorithmic results */
    #b_results > .b_algo {
      padding: 0 !important;
    }

    /* Remove padding on all other result items, ads, and age‑verification notices */
    #b_results > li,
    #b_results > [data-tag="ageverification.AVSignIn"],
    #b_results > [data-tag="ageverification.AVVerify"],
    #b_results > .b_ad {
      padding: 0 !important;
    }

    /* Remove padding from the content container */
    #b_content {
      padding: 0 !important;
    }

    /*  Add max-width to every result list item */
    #b_results > li {
      max-width: 290px !important;
    }

    #b_results .b_algo .b_tpcn .b_attribution {
      height: 0% !important;
    }

    /* Overwrite the webkit line clamp to show full text */
    #b_results .b_lineclamp2 {
      -webkit-line-clamp: unset !important;
      /* Removes the maximum-line count restriction */
    }

/* Hide the Bing logo area */
.b_logoArea {
  display: none !important;
}

/* Remove the max-width constraint */
.b_factrow.b_twofr ul:first-child {
  max-width: unset !important;
}

/* Allow normal wrapping */
.b_factrow.b_twofr ul li div {
  white-space: normal !important;
}

/* Remove padding on header */
#b_header {
  padding: 0 !important;
}

/* Remove margin on main content wrapper */
#b_tween.b_hidetoggletween ~ #b_mcw {
  margin: 0 !important;
}
    `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();