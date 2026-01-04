// ==UserScript==
// @name         Remove a
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.10.20.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://testpage.qipeiyigou.com/dom/sc_product.php*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/513955/Remove%20a.user.js
// @updateURL https://update.greasyfork.org/scripts/513955/Remove%20a.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $("#submit_msg").mouseenter(() => {
        $("#edui271_body,#edui359_body,#edui49_body,#edui139_body").click();
        $("#ueditor_0,#ueditor_1").contents().find("*[style*=cursor]").css("cursor", "");
        document.activeElement.blur();
        $("#submit_msg").css("background-color", "green");
    });
    $("#submit_msg").mouseleave(() => {
        $("#submit_msg").css("background-color", "");
    });
})();
/*2024.10.20.080000 - Line : 28*/