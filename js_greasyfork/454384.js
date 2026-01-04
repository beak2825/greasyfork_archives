// ==UserScript==
// @name         SenpaiMod+
// @namespace    http://tampermonkey.net/
// @version      4.3.6
// @icon        https://i.imgur.com/pCHt43l.jpg
// @description  extend script for senpai clients
// @author       sus
// @match		 http://caffe.senpai-agar.online/lwga/
// @match		 http://senpai-agar.online/lwga/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454384/SenpaiMod%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/454384/SenpaiMod%2B.meta.js
// ==/UserScript==
gTargetSite = null;
window.stop();
GM_xmlhttpRequest({
    method: "GET",
    url: location.href,
    onload: function(e) {
        let doc = new DOMParser().parseFromString(e.response, 'text/html');
        let pixi = doc.getElementsByTagName("script")[1];
        let main = doc.getElementsByTagName("script")[4];
        doc.head.removeChild(pixi);;

        let newMain = document.createElement("script");
        newMain.type = "text/javascript";
        newMain.src = "https://blazing-eleven.000webhostapp.com/senpaimod+.min.js";
        doc.head.replaceChild(newMain, main);

        doc = "<!DOCTYPE html> <html>" + doc.documentElement.innerHTML + "<\html>";

        document.open();
        document.write(doc);
        document.close();
    }
});