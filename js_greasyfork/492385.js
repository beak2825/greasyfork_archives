// ==UserScript==
// @name         Expressive Animator Crack (READ DESC)
// @version      1.0.0
// @description  Expressive Animator for free.
// @author       danthekidd
// @match        https://animator.expressive.app/*
// @icon         https://animator.expressive.app/favicon.png
// @grant        none
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1287532
// @downloadURL https://update.greasyfork.org/scripts/492385/Expressive%20Animator%20Crack%20%28READ%20DESC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492385/Expressive%20Animator%20Crack%20%28READ%20DESC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.crypto.subtle.verify = function() {
        return true;
    }

    setTimeout(async function () {
        await (async function() {
            var dir = await navigator.storage.getDirectory();
            var fileHandle = await dir.getFileHandle('sn', {create: true});
            var file = await fileHandle.getFile();
            var writable = await fileHandle.createWritable();
            await writable.write("FAKESERIAL");
            await writable.close();
        })();

        var inf = await navigator.userAgentData.getHighEntropyValues(["architecture","bitness"]);

        var data = {
          "customer": "Cracked",
          "email": "Cracked",
          "serial": "FAKESERIAL",
          "app": "animator",
          "browser": inf.brands.filter((t=>!t.brand.toLowerCase().endsWith("brand") && t.brand !== "Chromium"))[0].brand,
          "platform": inf.platform,
          "architecture": inf.architecture,
          "bitness": inf.bitness
        }

        var dir = await navigator.storage.getDirectory();
        var fileHandle = await dir.getFileHandle('lk', {create: true});
        var writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify([btoa(JSON.stringify(data)), btoa("this is where the RSA public key WOULD go")]));
        await writable.close();
    }, 0)
})();