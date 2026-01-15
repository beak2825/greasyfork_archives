// ==UserScript==
// @name        XHReload
// @namespace   i2p.schimon.xhreload
// @description Reloading page with XHR is useful to bypass some WAF checks. Hotkey: Command + Shift + H.
// @homepageURL https://greasyfork.org/scripts/493323-xhreload
// @supportURL  https://greasyfork.org/scripts/493323-xhreload/feedback
// @copyright   2024 - 2026, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       *://*/*
// @version     26.01.13
// @run-at      document-start
// @grant       GM.notification
// @grant       GM.registerMenuCommand
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7imbvvuI88L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/493323/XHReload.user.js
// @updateURL https://update.greasyfork.org/scripts/493323/XHReload.meta.js
// ==/UserScript==

function xhreload() {
  let request = new XMLHttpRequest();
  request.open("GET", document.documentURI);
  request.onload = function() {
    if (request.status >= 200 && request.status < 300) {
      let domParser = new DOMParser();
      //let htmlFile = domParser.parseFromString(request.response.trim(), "text/html");
      let htmlFile = domParser.parseFromString(request.responseText, "text/html");
      let newDocument = document.importNode(htmlFile.documentElement, true);
      let oldDocument = document.documentElement;
      document.replaceChild(newDocument, oldDocument);
      notification("URI content was reloaded.", "✔️");
    } else {
      let errorMessage = "Request failed with status: " + request.status;
      console.warn(errorMessage);
      notification(errorMessage, "❌");
      if (confirm("Content was not retrieved. Do you want to try again?")) {
        xhreload();
      }
    }
  };
  request.send();
}

function hotkey(e) {
  //console.log(e)
  if (e.metaKey && e.shiftKey && e.which == 72) {
    xhreload();
  }
}

(function() {
  document.addEventListener("keyup", hotkey, false);
})();

(function registerMenuCommand(){
  if (typeof GM !== "undefined" && typeof GM.registerMenuCommand === "function") {
    GM.registerMenuCommand("Rough reload", () => xhreload(), "R");
  }
})();

function characterAsSvgDataUri(character) {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text y=".9em" font-size="90">${character}</text>
    </svg>
  `;
  const base64Svg = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64Svg}`;
}

function notification(message, graphics) {
  console.info("♻️ XHReload: " + message);
  if (typeof GM !== "undefined" && typeof GM.notification === "function") {
    GM.notification(message, "♻️ XHReload", characterAsSvgDataUri(graphics));
  } else {
    alert(message);
  }
}

