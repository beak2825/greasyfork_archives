// ==UserScript==
// @name         E-Storage
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Auto Filter MRP Controller for E-Storage
// @author       TANG Yanji
// @match        https://fiori-prod.app.corp:44301/zstock/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.corp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491803/E-Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/491803/E-Storage.meta.js
// ==/UserScript==

//网页加载完成后筛选MRP Controller，修改下面的数组即可实现增加或减少
var MRPController = ["003", "005", "006"]

var setMrpController = setInterval(function () {
    if (sap.ui.getCore().byId("__component0---Tile").getController()) {
        var aFilters = MRPController.map(function (sItem) {
            return new sap.ui.model.Filter(
                "ArrowStatus",
                sap.ui.model.FilterOperator.EQ, sItem
            );
        })
        sap.ui.getCore().byId("__component0---Tile").getController().aFilters = aFilters
        clearInterval(setMrpController)
    }
    console.log("finding...")
}, 30000)
//每秒检查错误窗口出现，出现就刷新网页
setInterval(() => {
    var errorMsg = sap.ui.getCore().byId("__error0")
    if (errorMsg){
        window.location.reload()
    }
}, 1000);
