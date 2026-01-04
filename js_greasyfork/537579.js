// ==UserScript==
// @name         Curseforge Fast Downloader
// @namespace    https://vianos-official.com/
// @version      1.0
// @description  Skip all the selecting the Version and the Loader, download instantly without waiting 5 seconds!
// @author       HNP_Arda
// @license      MIT
// @match        https://www.curseforge.com/minecraft/mc-mods/*
// @icon         https://static-beta.curseforge.com/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/470000/code/GM%20Requests.js
// @require      https://github.com/PRO-2684/GM_config/releases/download/v1.2.1/config.min.js#md5=525526b8f0b6b8606cedf08c651163c2
// @downloadURL https://update.greasyfork.org/scripts/537579/Curseforge%20Fast%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537579/Curseforge%20Fast%20Downloader.meta.js
// ==/UserScript==

/* globals requests GM_config */

var url;

const loaders = ["NeoForge", "Forge", "Fabric", "Quilt"];

(async function() {
    'use strict';

    var cfg = new GM_config({
        modVersion: {
            name: "Version",
            type: "str",
            default: '1.20.1',
            value: '1.20.1'
        },
        modLoader: {
            name: "Mod Loader",
            input: "current",
            type: "enum",
            options: loaders
        }
    });

    const VERSION = cfg.get('modVersion');
    const LOADER = loaders[cfg.get('modLoader')];

    const projectID = JSON.parse(Array.from(document.scripts).find(e => e.type == "application/ld+json").innerHTML)["@graph"][1].identifier

    const request = await requests.get(`https://www.curseforge.com/api/v1/mods/${projectID}/files?pageSize=99999`);
    const files = JSON.parse(request.response).data;
    const file = files.filter(e => e.gameVersions.includes(VERSION) && e.gameVersions.includes(LOADER))[0];

    const fileID = file.id;

    url = `https://www.curseforge.com/api/v1/mods/${projectID}/files/${fileID}/download`;
    console.log(url);

    const downloadBox = document.getElementsByClassName("split-button")[0];
    const navbar = document.getElementsByClassName("top-actions")[0];
    var button = downloadBox.children[0].cloneNode(true);
    button.className = "link-btn btn-secondary";
    button.onclick = fastDownload;
    navbar.prepend(button);
    button.children[1].innerHTML = "Fast Download";

})();

function fastDownload() {
    window.open(url,"_self")
}
