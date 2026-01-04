// ==UserScript== 
// @name        Swf2js Flash Player
// @namespace   i2p.schimon.swf2js
// @description Play flash (.swf) files
// @homepageURL https://schapps.woodpeckersnest.eu/
// @supportURL  https://greasyfork.org/en/scripts/466071-flash-player/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @require https://greasyfork.org/scripts/466069-swf2js/code/swf2js.js?version=1189198
// @match       *://*/*
// @version     25.03
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7imqE8L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/466071/Swf2js%20Flash%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/466071/Swf2js%20Flash%20Player.meta.js
// ==/UserScript==

// TODO Check 404 http status

// /makyen
// /greasemonkey/greasemonkey/issues/3160#issuecomment-1456758080
//const gmXmlhttpRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : GM.xmlHttpRequest;

/*
cssSelectors = [
  'object[type="application/x-shockwave-flash"]',
  '*[type="application/x-shockwave-flash"]',
  'embed[src$=".swf"]']
*/

for (const element of document.querySelectorAll('embed[src$=".swf"]')) {
  
  let divElement = document.createElement('div');
  divElement.textContent = 'Play ⚡';// ▶️ Click to Play
  divElement.setAttribute('swf-data', element.src);
  divElement.style.height = element.closest('object').height;
  divElement.style.width = element.closest('object').width;
  divElement.style.fontSize = element.closest('object').height / 10;
  divElement.style.fontStyle = 'italic';
  divElement.style.display = 'table-cell';
  divElement.style.verticalAlign = 'middle';
  divElement.style.background = 'DarkRed';
  divElement.style.color = 'WhiteSmoke';
  divElement.style.textAlign = 'center';
  divElement.style.fontWeight = 'bold';
  divElement.style.userSelect = 'none';

  divElement.addEventListener ("click", function() {
    swf2js.load(element.src);
    let swfElement = document.querySelector('div[id*="swf2js_"]:last-child');
    swfElement.style.height = divElement.style.height;
    swfElement.style.width = divElement.style.width;
    divElement.parentNode.replaceChild(swfElement, divElement);
  });

  let orgElement = element.closest('object');
  insertAfter(orgElement, divElement);
  orgElement.remove();

}

// /questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/* Initial release

for (const element of document.querySelectorAll('embed[src$=".swf"]')) {
  swf2js.load(element.src);
  let newElement = document.querySelector('div[id*="swf2js_"]:last-child');
  let orgElement = element.closest('object');
  insertAfter(orgElement, newElement);
  orgElement.remove();
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

*/
