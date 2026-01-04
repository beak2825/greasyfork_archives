// ==UserScript==
// @name         ureactor change static
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        https://*.ureactor.zbj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389395/ureactor%20change%20static.user.js
// @updateURL https://update.greasyfork.org/scripts/389395/ureactor%20change%20static.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // icon
    // <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    // logo
    document.getElementsByClassName("logo")[0].innerHTML = "<img height=42 width=130 src='https://dev-proj.oss-cn-qingdao.aliyuncs.com/WechatIMG1.png' />";
    var logodelete = document.getElementsByClassName("logo")[1];
    if (logodelete !== null){
        logodelete.parentNode.removeChild(logodelete);
    }
    var borline = document.getElementsByClassName("bor-line")[0];
    if (borline !== null){
        borline.parentNode.removeChild(borline);
    }

    // footer
    document.getElementById("layout-foot").id = "footer";
    //document.getElementById("footer").className = "footer_class";
    document.getElementById("footer").innerHTML = "<p>Copyright © 2018 All right reserved 锐融天下 版权所有 京ICP备12037648号 京公网安备 11010802027681</p>";
    //var footer = document.getElementById("layout-foot");
    //if (footer != null){
    //    footer.parentNode.removeChild(footer);
    //}

    // links
    var links = document.getElementsByClassName("selected-link");
    if (links !== null){
        links[0].parentNode.removeChild(links[0]);
        links[1].parentNode.removeChild(links[1]);
    }
    var links2 = document.getElementsByClassName("selected-link");
    if (links2 !== null){
        links2[0].parentNode.removeChild(links2[0]);
    }
})();