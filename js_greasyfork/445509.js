// ==UserScript==
// @name		 ʀꜱᴛ
// @namespace	 http://tampermonkey.net/
// @version	 	 1.0.1
// @description  extension for senpai-agar.online
// @author		 Redgeioz
// @match		 http://caffe.senpai-agar.online/lwga/
// @match		 http://senpai-agar.online/lwga/
// @match		 http://senpai-agar.online/lwga/unichat/chat.html
// @match		 http://caffe.senpai-agar.online/lwga/unichat/chat.html
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/445509/%CA%80%EA%9C%B1%E1%B4%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/445509/%CA%80%EA%9C%B1%E1%B4%9B.meta.js
// ==/UserScript==

gTargetSite = null;
window.stop();
GM_xmlhttpRequest({
    method: "GET",
    url: location.href,
    onload: function(e) {
        let doc = new DOMParser().parseFromString(e.response, 'text/html');
        if (window.location.pathname == "/lwga/unichat/chat.html") {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://cwal.io/rst/chat_tags.js",
                onload: function(e) {
                    let newNode = document.createElement("script");
                    newNode.type = "riot/tag";
                    newNode.innerHTML = e.response;

                    let ct = doc.getElementsByTagName("script")[2];
                    doc.head.replaceChild(newNode, ct);

                    doc = "<!DOCTYPE html> <html>" + doc.documentElement.innerHTML + "<\html>";

                    document.open();
                    document.write(doc);
                    document.close();
                }
            });
        } else {
            let pixi = doc.getElementsByTagName("script")[1];
            let gts = doc.getElementsByTagName("script")[3];
            let main = doc.getElementsByTagName("script")[4];
            doc.head.removeChild(pixi);

            let ngts = document.createElement("script");
            if (location.host == "caffe.senpai-agar.online") {
                ngts.innerHTML = "var gts = 'caffe'";
            } else {
                ngts.innerHTML = "var gts = 'sao'";
            }
            doc.head.replaceChild(ngts, gts);

            let newMain = document.createElement("script");
            newMain.type = "text/javascript";
            newMain.src = "http://cwal.io/RSTxfw.min.js";
            doc.head.replaceChild(newMain, main);

            doc = "<!DOCTYPE html> <html>" + doc.documentElement.innerHTML + "<\html>";

            document.open();
            document.write(doc);
            document.close();
        }
    }
});