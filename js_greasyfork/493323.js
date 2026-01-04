// ==UserScript==
// @name        XHReload
// @namespace   i2p.schimon.xhreload
// @description Reloading page with an XML HTTP Request type of it. Hotkey: Command + Shift + H.
// @homepageURL https://greasyfork.org/scripts/493323-xhreload
// @supportURL  https://greasyfork.org/scripts/493323-xhreload/feedback
// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       *://*/*
// @version     24.04
// @run-at      document-start
// @grant       GM.registerMenuCommand
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7imbvvuI88L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/493323/XHReload.user.js
// @updateURL https://update.greasyfork.org/scripts/493323/XHReload.meta.js
// ==/UserScript==

function xhreload() {
  let request = new XMLHttpRequest();
  request.open('GET', document.documentURI);
  request.onload = function() {
    if (request.status >= 200 && request.status < 300) {
      let domParser = new DOMParser();
      //let htmlFile = domParser.parseFromString(request.response.trim(), 'text/html');
      let htmlFile = domParser.parseFromString(request.responseText, 'text/html');
      let newDocument = document.importNode(htmlFile.documentElement, true);
      let oldDocument = document.documentElement;
      document.replaceChild(newDocument, oldDocument);
    } else {
      let errorMessage = 'Request failed with status: ' + request.status;
      console.error(errorMessage);
      alert(errorMessage);
    }
  };
  request.send();
}

function infoBar() {
  let namespace = 'i2p-schimon-ruffle';
  let bar = document.createElement(namespace);
  document.body.append(bar);
  bar.innerHTML = 'XHR Reload';
  bar.title = 'Flash elements have been detected on this page. Click this bar to activate Ruffle player.';
  bar.id = namespace;
  bar.style.backgroundColor = '#fff';
  bar.style.color = '#000';
  bar.style.fontFamily = 'system-ui';
  bar.style.fontSize = 'larger';
  bar.style.fontWeight = 'bold';
  bar.style.right = 0;
  bar.style.left = 0;
  bar.style.top = 0;
  bar.style.zIndex = 10000000000;
  bar.style.padding = '6px'; //13px //15px //11px //9px //3px //1px
  bar.style.position = 'fixed';
  bar.style.textAlign = 'center'; // justify
  bar.style.direction = 'ltr';
  bar.style.userSelect = 'none';
  // set bar behaviour
  bar.onclick = () => {
    bar.style.display = 'none';
    xhreload();
  };
}

function loadAtPageLoad(){
  document.addEventListener("DOMContentLoaded",
    async function() {
      infoBar();
    }
  );
}

function hotkey(e) {
  console.log(e)
  if (e.metaKey && e.shiftKey && e.which == 72) {
    xhreload();
  }
}

(function() {
  document.addEventListener('keyup', hotkey, false);
  //document.documentURI
  //document.location.search
  //location.search
  if (location.search.includes('__cf_chl_rt_tk')) {
    loadAtPageLoad();
  }
})();

(async function registerMenuCommand(){
  try {
    await GM.registerMenuCommand('Rough Reload Command + Shift + H', () => xhreload(), 'H');
  } catch (err) {
    console.warn(err);
    console.info('API GM.registerMenuCommand does not seem to be available.');
  }
})();

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    if (window.location.search.includes('__cf_chl_rt_tk')) {
      xhreload();
    }
  });
})();
