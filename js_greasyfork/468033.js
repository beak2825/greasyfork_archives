// ==UserScript==
// @name         宝塔界面修改
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*/site
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/468033/%E5%AE%9D%E5%A1%94%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/468033/%E5%AE%9D%E5%A1%94%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //
    if (document.querySelector("#container > div.sidebar-scroll") != null) {


        let intervalID = setInterval(() => {
            if (document.querySelector("body > div.layui-layer.layui-layer-page.model_project_dialog.layer-anim") != null) {
                document.querySelector("body > div.layui-layer.layui-layer-page.model_project_dialog.layer-anim").style.width = "1480px"
            }
        }, 200);

    }



    // Your code here...
})();