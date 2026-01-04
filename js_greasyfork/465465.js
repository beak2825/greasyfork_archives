// ==UserScript==
// @name         aslain_modpack
// @namespace    http://tampermonkey.net/
// @version      2023.05.04.1
// @description  Aslain's WoWs ModPack
// @author       jacky
// @license     MIT
// @match        https://pastebin.com/raw/KGifAUBj
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pastebin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465465/aslain_modpack.user.js
// @updateURL https://update.greasyfork.org/scripts/465465/aslain_modpack.meta.js
// ==/UserScript==

var r = JSON.parse(document.body.innerText);
if (r) {
    var m = /(\d+\.\d+\.\d+)\.(\d+)/.exec(r.installer.version);
    if (m) {
        var a = document.createElement("a");
        a.href = `https://flcl.uk/public/Aslains_WoWs_Modpack_Installer_v.${m[1]}_${m[2]}.exe`;
        a.innerHTML= `Aslain's WoWs ${r.installer.version}`;
        document.body.append(a);
    }

}