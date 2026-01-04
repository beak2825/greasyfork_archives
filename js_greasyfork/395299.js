// ==UserScript==
// @name         TorcAddons-watch-json-file
// @namespace    http://torcado.com
// @description  provides a watch.json button, to spawn a watch.json file, and set it's contents automatically to that to be compatible with torcAddons-ManualUpdate
// @author       torcado and J-Tech-Foundation
// @license      MIT
// @icon         http://torcado.com/torcAddons/icon.png
// @run-at       document-start
// @grant        none
// @include      http*://glitch.com/edit/*
// @version 0.2.11
// @downloadURL https://update.greasyfork.org/scripts/395299/TorcAddons-watch-json-file.user.js
// @updateURL https://update.greasyfork.org/scripts/395299/TorcAddons-watch-json-file.meta.js
// ==/UserScript==
(function () {
    let t = torcAddons;

    t.addEventListener('load', ()=>{
        let code = `{
  "install": {
    "include": [
      "^.torc-update"
    ]
  },
  "throttle": 10
}`;
        var gg = $('<div class="torc-update">Add json</div>').insertAfter($(".show-app-wrapper"))
        gg.on("click", function(){
            $(gg).remove();
        let FI = application.fileByPath("watch.json");
        if (FI === undefined) {
            application.newFile("watch.json").then(f => {
                application.writeToFile(f, code);
            });
        } else {
            application.writeToFile(FI, code);
        }
    });
    })
})();