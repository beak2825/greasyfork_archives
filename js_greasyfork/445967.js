// ==UserScript==
// @name        Thingiverse Zip Download mod
// @namespace   HowBoutNo
// @description Restores zip file download button on Thingiverse with seamless integration
// @icon        https://cdn.thingiverse.com/site/img/favicons/favicon-32x32.png
// @version     0.2.0
// @license     GNU General Public License v3
// @copyright   2022, Nickel
// @author      Nickel, HowBoutNo
// @grant       none
// @include     https://www.thingiverse.com/thing:*
// @downloadURL https://update.greasyfork.org/scripts/445967/Thingiverse%20Zip%20Download%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/445967/Thingiverse%20Zip%20Download%20mod.meta.js
// ==/UserScript==

var no = location.pathname.match( /[0-9]+/ );
var zip = "/thing:" + no + "/zip";

/* https://stackoverflow.com/a/61511955 */
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.SidebarMenu__sideMenuTop--3xCYh').then((elmen) => {
  var node = elmen.children[0].cloneNode(true);
  node.children[0].className = "";
  node.children[0].href = zip;
  node.querySelector("span").innerText = "Download All Files"
  elmen.querySelector("span").innerText = "Download Individual Files"
  elmen.insertBefore(node, elmen.children[1]);
});