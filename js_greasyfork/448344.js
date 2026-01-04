// ==UserScript==
// @name         openproject  端口添加脚本
// @namespace    http://tampermonkey.net/
// @match        https://pm.intranet.cbwxshop.com:9999/*
// @version      0.6
// @description  openproject  自动端口添加脚本
// @author       hhcto
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448344/openproject%20%20%E7%AB%AF%E5%8F%A3%E6%B7%BB%E5%8A%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448344/openproject%20%20%E7%AB%AF%E5%8F%A3%E6%B7%BB%E5%8A%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links = document.getElementsByTagName('a')
    console.log("links.length:" + links.length);
    for(let i=0; i<links.length; i++){
        let linkUrl=links[i].href
        if(linkUrl.search(":9999") == -1) {
            console.log(i + ":"+linkUrl);
            linkUrl = linkUrl.replace("pm.intranet.cbwxshop.com","pm.intranet.cbwxshop.com:9999")
            links[i].href= linkUrl;
            console.log(i + ":"+ links[i].href);
        }

    }
})();