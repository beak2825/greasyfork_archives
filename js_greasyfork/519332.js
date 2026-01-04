// ==UserScript==
// @name        Google Scholar in Google
// @namespace   https://thynanami.dev
// @description This script add "Scholar" link to Google search result page.
// @match       https://www.google.com/search*
// @version     0.0.2
// @author      Nanami Nakano
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519332/Google%20Scholar%20in%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/519332/Google%20Scholar%20in%20Google.meta.js
// ==/UserScript==

(function () {
'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".style-module_tabTitle__VJsXm{align-items:center;color:#9aa0a6;display:flex;font-family:Google Sans,sans-serif;font-size:14px;height:20px;justify-content:center;padding-bottom:10px;padding-left:10px;padding-right:10px;width:fit-content}";
var styles = {"tabTitle":"style-module_tabTitle__VJsXm"};
styleInject(css_248z);

function getSearchText() {
  const searchTextarea = document.querySelector("[aria-label=\"Search\"]");
  if (!searchTextarea) {
    const searchTextarea = document.querySelector("[role=\"textbox\"]");
    const searchText = searchTextarea.value;
    return encodeURI(`https://scholar.google.com/scholar?q=${searchText}`);
  }
  const searchText = searchTextarea.textContent;
  return encodeURI(`https://scholar.google.com/scholar?q=${searchText}`);
}
function getTab() {
  const listItems = document.querySelectorAll("[role=\"listitem\"]");
  if (listItems.length < 2) {
    throw new Error("Could not find the second listitem to copy styles from.");
  }
  return listItems[1];
}
try {
  const url = getSearchText();
  const tab = getTab();
  const newTab = document.createElement("div");
  Array.from(tab.attributes).forEach(attribute => {
    newTab.setAttribute(attribute.name, attribute.value);
  });
  const anchor = tab.querySelector("a");
  const newAnchor = document.createElement("a");
  Array.from(anchor.attributes).forEach(attribute => {
    newAnchor.setAttribute(attribute.name, attribute.value);
  });
  newAnchor.setAttribute("href", url);
  const newTitle = document.createElement("div");
  newTitle.textContent = "Scholar";
  newTitle.setAttribute("class", styles.tabTitle);
  newAnchor.appendChild(newTitle);
  newTab.appendChild(newAnchor);
  const navigationContainer = document.querySelector("[role=\"list\"]");
  if (navigationContainer) {
    navigationContainer.insertBefore(newTab, tab);
  }
} catch (e) {
  console.warn(e);
}

})();
