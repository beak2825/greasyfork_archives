// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */


// ==UserScript==
// @name         shao的练习脚本. 暂无功能 请勿下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  shao的练习脚本. 暂无功能 请勿下载 。 练练手，我还不会javascript，以后学一下再把这个做成一个正经的脚本。
// @author       Andrew_matt
// @match        *://www.bilibili.com/*
// @match        *://www.baidu.com/*
// @icon         https://www.jianguoyun.com/c/tblv2/_Yk1Yzop5gf5DjmTi_qpu-klBvcKOIP7K2rz7chXC3nro-mLymeRd5Eqg9VdJzGpOwk4wp6W/jZHYDsofKQdt39vOhkqk4w/l
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/449930/shao%E7%9A%84%E7%BB%83%E4%B9%A0%E8%84%9A%E6%9C%AC%20%E6%9A%82%E6%97%A0%E5%8A%9F%E8%83%BD%20%E8%AF%B7%E5%8B%BF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449930/shao%E7%9A%84%E7%BB%83%E4%B9%A0%E8%84%9A%E6%9C%AC%20%E6%9A%82%E6%97%A0%E5%8A%9F%E8%83%BD%20%E8%AF%B7%E5%8B%BF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
/*
    setTimeout(function(){
            $("#nav-search-keyword").val("Andrew_matt");
            $("#bilifont bili-icon_dingdao_sousuo").click();

    },2000);
*/



    setTimeout(function(){
            $("#kw").val("shao");
            $("#su").click();
    },2000);







})();