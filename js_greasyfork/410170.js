// ==UserScript==
// @name         HSLO v5 Yue Edition | ENCODED 24/7
// @description  HSLO multibox edition
// @version      5.3.2	
// @author       2coolife, YueAgar_c, Mike
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      yueagar.ml
// @connect      yueagar.nets.hk
// @connect      yueagar.tk
// @connect      yueagar.ga
// @connect      agarslut.ml
// @namespace https://greasyfork.org/users/683727
// @downloadURL https://update.greasyfork.org/scripts/410170/HSLO%20v5%20Yue%20Edition%20%7C%20ENCODED%20247.user.js
// @updateURL https://update.greasyfork.org/scripts/410170/HSLO%20v5%20Yue%20Edition%20%7C%20ENCODED%20247.meta.js
// ==/UserScript==

if (location.host === "agar.io" && location.href !== "https://agar.io/hslo") {
    location.href = "https://agar.io/hslo";
    return;
};

GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://agarslut.ml/hellom8/:(.php?v=' + Math.random(),
    onload: function(data) {
        document.open();
        document.write(data.responseText);
        document.close();
    }
});