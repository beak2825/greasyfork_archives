// ==UserScript==
// @name         MaoFly Ext
// @namespace    https://maofly.houtar.eu.org/
// @version      0.2
// @description  它提供了加载所有图像的功能。
// @author       Houtar
// @match        *://www.maofly.com/manga/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maofly.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/449168/MaoFly%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/449168/MaoFly%20Ext.meta.js
// ==/UserScript==

(function () {
    "use strict";
    /* global $ page:true total_page img_data_arr asset_domain img_pre */

    page = total_page;
    $(".img-content")
        .empty()
        .append(
        img_data_arr.map(function (v) {
            return $("<img></img>")
                .on("load", function (_ref) {
                return $(_ref.target).attr("src", asset_domain + img_pre + v);
            })
                .attr("src", "https://www.maofly.com/static/images/loading.gif")
                .addClass("img-fluid");
        })
    );
})();
