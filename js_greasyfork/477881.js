// ==UserScript==
// @name         Easy Change Bing Region
// @namespace    https://www.cnblogs.com/zhiders/
// @version      0.1.1
// @description  用于在中国的用户方便的更改自己的地域。安装这个脚本之后，在右上角的设置菜单中，将会增加一个切换到特定地域的选项。默认是新加坡，你也可以更改到你喜欢的地方。
// @author       ZHider
// @license      MIT
// @match        https://www.bing.com/*
// @icon         https://www.bing.com/favicon.ico
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477881/Easy%20Change%20Bing%20Region.user.js
// @updateURL https://update.greasyfork.org/scripts/477881/Easy%20Change%20Bing%20Region.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements (
        "#hbsettings",
        main
    );

    function appendElement(aherf) {
        let myMenuitem = document.createElement('a');
        myMenuitem.className = "hb_section";
        myMenuitem.href = aherf;
        myMenuitem.target = "_blank"
        myMenuitem.setAttribute("role", "menuitem");
        myMenuitem.setAttribute("tabindex", "0")
        myMenuitem.innerHTML = `
<div class="hb_titlerow">
    <div class="hbic_col"></div>
        <div class="hb_title_col">切换到新加坡</div>
    <div class="hb_value_col"></div>
</div>`;
        document.getElementById("hbsettings").nextElementSibling.appendChild(myMenuitem);
    }

    function parseChangeRegionURL(data, status, xhr) {

        function parseReg() {
            let res = data.match(new RegExp(`<a target="_blank" href="(.+?)" h=".+?">新加坡</a>`));
            return res ? res[1].replaceAll('&amp;', '&') : null;
        }

        if (status !== "success") {
            return;
        }

        let aherf = parseReg();
        appendElement(aherf);
    }

    function main() {

        $.get("/account/general", parseChangeRegionURL);

    }
})();