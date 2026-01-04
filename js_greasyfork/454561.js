// ==UserScript==
// @name         mokamel filimoleech
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  json trimmer for filimo leecher project
// @author       takl.ink/bugbounted
// @match        https://filimoleechbybugbounted.netlify.app/&page_url=http://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netlify.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454561/mokamel%20filimoleech.user.js
// @updateURL https://update.greasyfork.org/scripts/454561/mokamel%20filimoleech.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    var images = document.body.innerHTML;


    var h = images;
    var w = /\\/gm;
    var x = /^((?!(https):\/\/(ww)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])).)*/;
    var y = /(?=","DownloadLinkMain")(.*)/;
    var z;
    var o;
    h = h.replace(w, "");
    z = h.replace(x, "");
    o = z.replace(y, "");
    document.body.innerHTML = o
}, false);