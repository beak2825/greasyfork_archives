// ==UserScript==
// @name         Google Docs - Force Center Document View
// @namespace    https://zachhardesty.com
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  force center align of page display on Google Docs
// @copyright    2019, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      0.1.3

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/google-docs-force-center.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Google_Docs_-_Force_Center_Document_View
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://docs.google.com/document/*
// @downloadURL https://update.greasyfork.org/scripts/419646/Google%20Docs%20-%20Force%20Center%20Document%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/419646/Google%20Docs%20-%20Force%20Center%20Document%20View.meta.js
// ==/UserScript==

window.addEventListener("load", centerDocs, false)

function centerDocs() {
  document
    .querySelector(".kix-appview-editor")
    .setAttribute("style", "overflow-x: hidden")

  setInterval(() => {
    document.querySelector(".kix-appview-editor").scrollLeft =
      (document.querySelector(".kix-zoomdocumentplugin-outer").scrollWidth -
        document.querySelector(".kix-appview-editor").clientWidth) /
      2
  }, 250)
}
