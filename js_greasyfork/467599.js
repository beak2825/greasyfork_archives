// ==UserScript==
// @name         TurboWarp Extension Presets
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  Automatically add extensions to the TurboWarp pallet.
// @author       NexusKitten https://github.com/NexusKitten
// @match        *://turbowarp.org/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=turbowarp.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467599/TurboWarp%20Extension%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/467599/TurboWarp%20Extension%20Presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (localStorage.getItem('ext1') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/utilities.js');};
    if (localStorage.getItem('ext2') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/LukeManiaStudios/CommentBlocks.js');};
    if (localStorage.getItem('ext3') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/gamepad.js');};
    if (localStorage.getItem('ext4') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/stretch.js');};
    if (localStorage.getItem('ext5') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/Xeltalliv/clippingblending.js');};
    if (localStorage.getItem('ext6') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/DT/cameracontrols.js');};
    if (localStorage.getItem('ext7') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/runtime-options.js');};
    if (localStorage.getItem('ext8') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/text.js');};
    if (localStorage.getItem('ext9') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/true-fantom/math.js');};
    if (localStorage.getItem('ext10') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/LukeManiaStudios/ClonesPlus.js');};
    if (localStorage.getItem('ext11') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/-SIPC-/time.js');};
    if (localStorage.getItem('ext12') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/NOname-awa/more-comparisons.js');};
    if (localStorage.getItem('ext13') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/JeremyGamer13/tween.js');};

    // mcutils is best (use localstorage extension to access)
    if (localStorage.getItem('mcutils') == 'true') {window.vm.extensionManager.loadExtensionURL('https://extensions.turbowarp.org/LukeManiaStudios/McUtils.js');};

    let preTags = document.getElementsByClassName('menu-bar_account-info-group_MeJZP');
    let p = preTags[0];

    let btn = document.createElement("button")
    btn.innerHTML = "Extension Presets";
    btn.onclick = () => {
        localStorage.setItem("ext2", confirm('Enable Comment Blocks?'));
        localStorage.setItem("ext1", confirm('Enable Utilities?'));
        localStorage.setItem("ext7", confirm('Enable Runtime Options?'));
        localStorage.setItem("ext11", confirm('Enable Time?'));
        localStorage.setItem("ext4", confirm('Enable Stretch?'));
        localStorage.setItem("ext5", confirm('Enable Clipping & Blending?'));
        localStorage.setItem("ext6", confirm('Enable Camera Controls?'));
        localStorage.setItem("ext3", confirm('Enable Gamepad?'));
        localStorage.setItem("ext10", confirm('Enable Clones Plus?'));
        localStorage.setItem("ext8", confirm('Enable Text?'));
        localStorage.setItem("ext9", confirm('Enable Math?'));
        localStorage.setItem("ext12", confirm('Enable More Comparisons?'));
        localStorage.setItem("ext13", confirm('Enable Tween?'));
        alert('Extensions Selected. Reset the tab to see your selections.');
    }
    p.insertBefore(btn, p.childNodes[0]);
})();