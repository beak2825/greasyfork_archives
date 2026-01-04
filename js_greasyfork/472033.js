// ==UserScript==
// @name         Luogu CF link redirect
// @namespace    https://www.luogu.com.cn/blog/765382/
// @version      1.0
// @description  F**k u Mike
// @author       ThaumicExecutor as 0x1f1e33
// @match        https://www.luogu.com.cn/problem/*
// @exclude      https://www.luogu.com.cn/problem/list
// @icon         https://cdn.luogu.com.cn/upload/usericon/765382.png
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472033/Luogu%20CF%20link%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/472033/Luogu%20CF%20link%20redirect.meta.js
// ==/UserScript==
(function() {
    var url=window.location.href;
    if(url.search("CF")!=-1){
        document.getElementsByTagName("section")[0].getElementsByTagName("a")[0].href=
        document.getElementsByTagName("section")[0].getElementsByTagName("a")[0].href.replace("codeforces.com","codeforc.es");
    }
})();