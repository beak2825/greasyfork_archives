// ==UserScript==
// @name         MooMoo.io Invisible Hand / Invisible Clan / Invisible Clan
// @version      1
// @description  Invisible Clan + Invisible Clan + Invisible Weapon ("/" & "." are invisible chat / invisible clan, "-" is invisible weapon!)
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/566378
// @downloadURL https://update.greasyfork.org/scripts/430053/MooMooio%20Invisible%20Hand%20%20Invisible%20Clan%20%20Invisible%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/430053/MooMooio%20Invisible%20Hand%20%20Invisible%20Clan%20%20Invisible%20Clan.meta.js
// ==/UserScript==

let fname = localStorage.moo_name;
setInterval(async ()=>insert_0000000(true, document.getElementById("nameInput").value + "|" + fname), 30000);
(() => {
    let keybinds = {
        "period": "invisClan",
        "/": "invisibleChat",
        "-": "invisibleWeapon"
    };
    console.log(keybinds, keybinds["/"]);
});