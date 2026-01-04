// ==UserScript==
// @name         Auto link passing
// @version      0.4
// @description  Disables third-party site notification
// @author       Superillegal
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @run-at       document-end
// @namespace Auto_link_passing
// @downloadURL https://update.greasyfork.org/scripts/468956/Auto%20link%20passing.user.js
// @updateURL https://update.greasyfork.org/scripts/468956/Auto%20link%20passing.meta.js
// ==/UserScript==
 
function urlReplace(urls) {
    for (var i = 0; i < urls.length; i++)
    {
        if (urls[i].href.includes("proxy")) {
            console.log(i);
            urls[i].href = urls[i].href.split("&hash")[0].replace("https://zelenka.guru/proxy.php?link=","").replace("%3A%2F%2F","://").replace(/%2F/g, "/").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/%2B/g, "+").replace(/%25/g, "%");
        }
    }
}
function rep() {
    urlReplace(document.getElementsByClassName("externalLink"));
    urlReplace(document.getElementsByClassName("internalLink"));
}
setInterval(rep, 0);