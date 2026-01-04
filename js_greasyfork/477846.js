// ==UserScript==
// @name         Tools For Mia
// @version      0.1
// @description  A set of little tools developed for Mia.
// @author       Ben
// @match        https://gs.amac.org.cn/amac-infodisc/res/pof/manager/*.html
// @exclude      https://gs.amac.org.cn/amac-infodisc/res/pof/manager/managerList.html
// @exclude      https://gs.amac.org.cn/amac-infodisc/res/pof/manager/baidumap.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amac.org.cn
// @grant        none
// @namespace https://greasyfork.org/users/304698
// @downloadURL https://update.greasyfork.org/scripts/477846/Tools%20For%20Mia.user.js
// @updateURL https://update.greasyfork.org/scripts/477846/Tools%20For%20Mia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    $("#app-main-div").css('height','auto');
    $("#print2").css("display", "");
})();