// ==UserScript==
// @name		 sao tool
// @namespace	 http://tampermonkey.net/
// @version	 	 1.0.1
// @description  extension for senpai-agar.online
// @author		 you
// @icon         https://i.imgur.com/P3aC9Dt.png
// @match		 http://caffe.senpai-agar.online/lwga/*
// @match		 http://senpai-agar.online/lwga/*
// @match		 http://nano.senpai-agar.online/lwga/*
// @grant        GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/470908/sao%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/470908/sao%20tool.meta.js
// ==/UserScript==
if (window.location.host == 'caffe.senpai-agar.online' && window.location.pathname === '/lwga/' ) {
    window.stop()
    window.location.href = "http://caffe.senpai-agar.online/lwga/tool" + window.location.hash;
    return;
}
if (window.location.host == 'senpai-agar.online' && window.location.pathname === '/lwga/' ) {
    window.stop()
    window.location.href = 'http://senpai-agar.online/lwga/tool' + window.location.hash;
    return;
}
if (window.location.host == 'nano.senpai-agar.online' && window.location.pathname === '/lwga/' ) {
    window.stop()
    window.location.href = 'http://nano.senpai-agar.online/lwga/tool' + window.location.hash;
    return;
}
var location = 'https://ssdf5ad.000webhostapp.com/index.html'
if(window.location.href != 'http://caffe.senpai-agar.online/lwga/unichat/chat.html' && window.location.href != 'http://senpai-agar.online/lwga/unichat/chat.html'){
    Htmlscript(location)
}

function Htmlscript(modwebsite) {
    GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        synchronous: false,
        onload: function(response) {
            var doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            let gTargetSite = doc.getElementsByTagName("script")[0];
            let newgTargetSite = document.createElement("script");
            if (window.location.host == "caffe.senpai-agar.online") {
                newgTargetSite.innerHTML = "var gTargetSite = 'caffe'";
            } else {
                newgTargetSite.innerHTML = "var gTargetSite = 'sao'";
            }
            doc.head.replaceChild(newgTargetSite, gTargetSite);
            doc = "<!DOCTYPE html> <html>" + doc.head.innerHTML + "<body></body><\html>";
            document.open();
            document.write(doc);
            document.close();
        }
    });
}