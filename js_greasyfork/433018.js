// ==UserScript==
// @name         Schoology Browser File Viewer
// @namespace    https://razboy.dev/
// @version      0.11
// @description  Shows the browser's default pdf/file viewer instead of Schoology's.
// @author       Razboy20
// @match        https://*.schoology.com/attachment/*/docviewer
// @match        https://*.schoology.com/submission/*/docviewer
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433018/Schoology%20Browser%20File%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/433018/Schoology%20Browser%20File%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.stop();
    //console.log(document.documentElement.innerHTML);
    document.documentElement.innerHTML = "";

    (async function() {
        const req = await fetch("");
        //const body = await req.body;
        //console.log(body);
        const text = await req.text();

        let sourceUrl;
        let locationUrl;
        try {
            sourceUrl = text.match(/source\\\\\\\/(.*?)\\"/)[1];
            locationUrl = `${location.href.match(/.*\//)[0]}source/${sourceUrl}`;
        } catch {
            locationUrl = sourceUrl = text.match(/pdfPath":"(.*?)"/)[1].replaceAll("\\","");
        }
        unsafeWindow.test = sourceUrl;

        if (sourceUrl) {
            let type;
            let req;
            let blob;

            // check if image, if so then load faster
            if (sourceUrl.split(".")[1] == "png" || sourceUrl.split(".")[1] == "jpg") {
                type = "image";
            } else {
                req = await fetch(locationUrl);
                blob = await req.blob();

                type = blob.type;
            }

            // document.documentElement.innerHTML = `<iframe style="position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; border: 0" title="Document Frame" src="${locationUrl}" width="100%" height="100%" allowfullscreen="true"></iframe>`;
            if (type.split("/")[0] == "image") {
                document.documentElement.innerHTML = `<div><img src="${locationUrl}" style="object-fit: contain; width: calc(100% - 2em); height: calc(100% - 2em); transform: translate(-50%, -50%); left:50%; top: 50%; position: absolute;" width="auto" /></div>`;
            } else {
                document.documentElement.innerHTML = `<iframe style="position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; border: 0" title="Document Frame" src="${URL.createObjectURL(blob)}" width="100%" height="100%" allowfullscreen="true"></iframe>`;
                URL.revokeObjectURL(blob);
            }
        }
    })();
})();