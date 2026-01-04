// ==UserScript==
// @name        Native Canvas Size
// @match       https://sketchful.io/
// @namespace   https://greasyfork.org/users/281093
// @grant       none
// @version     1.0
// @author      Bell
// @description Sets the canvas to its native dimensions to avoid any upscaling artifacts.
// @downloadURL https://update.greasyfork.org/scripts/406612/Native%20Canvas%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/406612/Native%20Canvas%20Size.meta.js
// ==/UserScript==

document.querySelector(".gameParent").style.maxWidth = "1340px";
// The lines below shouldn't be necessary, but I included them anyway
document.querySelector(".gameParent").style.minWidth = "1340px";
document.querySelector("#canvas").style.maxWidth = "800px";
document.querySelector("#canvas").style.minWidth = "800px";