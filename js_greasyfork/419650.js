// ==UserScript==
// @name         Mint - Remove Ads
// @namespace    https://openuserjs.org/users/zachhardesty7
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  removes annoying and inconspicuous ads from Mint
// @copyright    2019, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.1.4

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/mint-clean-ui.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Mint_-_Remove_Ads
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @include      https://mint.intuit.com*
// @exclude      https://mint.intuit.com/save.event
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419650/Mint%20-%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/419650/Mint%20-%20Remove%20Ads.meta.js
// ==/UserScript==
/* global onElementReady */

/* css hiding */
const main = () => {
  const styles = `
    /* feedback modal */
    .QSIPopOver.SI_6RSOI27plGNzMeV_PopOverContainer {
      display: none !important;
    }

    /* right help widget */
    .nr-side-widget {
      display: none !important;
    }

    .adviceWidget {
      display: none !important;
    }

    .feedbackWidget {
      display: none !important;
    }

    /* bills page feedback widget */
    .FeedbackView {
      display: none !important;
    }

    /* homepage ad */
    .promotions-personalized-offers-ui {
      display: none !important;
    }
  `

  const stylesheet = document.createElement("style")
  const head = document.head || document.querySelectorAll("head")[0]
  stylesheet.type = "text/css"
  stylesheet.append(document.createTextNode(styles))
  head.append(stylesheet)
}

/* dynamic hiding */
// hide account status bar (if robinhood text included)
onElementReady(
  ".AccountStatusBarItemView .status.error",
  { findOnce: false },
  (el) =>
    el.textContent.includes("Robinhood") &&
    document.querySelector(".AccountStatusBarView").remove()
)

main()
