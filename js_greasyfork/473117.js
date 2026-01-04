// ==UserScript==
// @name         maven2aliyun
// @namespace maven2aliyun
// @version      0.1
// @description  替换maven中的下载地址为阿里云的地址
// @document
// @author       icefairy
// @match       *://repo1.maven.org/*
// @run-at document-idle
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473117/maven2aliyun.user.js
// @updateURL https://update.greasyfork.org/scripts/473117/maven2aliyun.meta.js
// ==/UserScript==
(() => {
    $("a").each((index, e) => {
        const jElement = $(e);
        const title = jElement.attr("title");
        if (!title) {
            return;
        }
        let newurl=e.href;
        if(newurl.indexOf(".jar")>-1 || newurl.indexOf(".pom")>-1){
        newurl=newurl.replace('repo1.maven.org/maven2','maven.aliyun.com/nexus/content/repositories/central');
        }
        jElement.attr("href",newurl);
    });
})();

