// ==UserScript==
// @name         好书友
// @namespace    https://greasyfork.org/zh-CN/users/821
// @version      0.8
// @description  好书友自动领取在线奖励
// @author       ashcarbide
// @match        https://www.93hsy.com/index.php
// @match        https://www.58shuyou.com/index.php
// @match        https://www.58shuyou.com/
// @icon
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/431724/%E5%A5%BD%E4%B9%A6%E5%8F%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431724/%E5%A5%BD%E4%B9%A6%E5%8F%8B.meta.js
// ==/UserScript==
function autoclick(){
    if(document.getElementById('online_link').href.indexOf("plugin.php?id=gonline:index&action=award&formhash=")>-1){
        document.getElementById('online_link').click();
        setTimeout(function(){location.reload();}, 5000);
        return true;}
    location.reload();
}
setTimeout(function(){autoclick();},60000);