// ==UserScript==
// @name         其乐高级搜索自动选中汉化板块
// @version      1.0
// @description  高级搜索地址：https://keylol.com/search.php?mod=forum&adv=yes
// @author       shopkeeperV
// @match        https://keylol.com/search.php?mod=forum&adv=yes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keylol.com
// @grant        none
// @namespace https://greasyfork.org/users/150069
// @downloadURL https://update.greasyfork.org/scripts/505203/%E5%85%B6%E4%B9%90%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%B1%89%E5%8C%96%E6%9D%BF%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/505203/%E5%85%B6%E4%B9%90%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%B1%89%E5%8C%96%E6%9D%BF%E5%9D%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let options = document.getElementById("srchfid").getElementsByTagName("option");
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === "all") {
            options[i].selected = false;
        }
        let ids = [257, 280, 293, 307];
        for (let j = 0; j < ids.length; j++) {
            if (options[i].value === ids[j] + "") {
                options[i].selected = true;
            }
        }
    }
})();