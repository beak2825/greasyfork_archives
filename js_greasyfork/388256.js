// ==UserScript==
// @name        EALayer-Be-Gone
// @description Are you a CM+ that is tired of the EA layer reappearing and ruining your editing experience? Get rid of the editable area layer from WME for good!
// @namespace   hbiede.com
// @version     2019.08.06.002
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @author      HBiede
// @license     MIT
// @run-at      document-end
// @grant       none
// @copyright   2019 HBiede
// @downloadURL https://update.greasyfork.org/scripts/388256/EALayer-Be-Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/388256/EALayer-Be-Gone.meta.js
// ==/UserScript==

setTimeout(init, 2000);

function init() {
    if (!document.getElementById('layer-switcher-item_editable_areas')) setTimeout(init, 2000);
    let layerSwitch = document.getElementById('layer-switcher-item_editable_areas');
    if (layerSwitch.checked === true) layerSwitch.click();
    layerSwitch.disabled = true;
}