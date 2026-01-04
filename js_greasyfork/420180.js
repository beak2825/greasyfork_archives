// ==UserScript==
// @name         友盟事件分析筛选条件加长
// @namespace    https://www.jihuangbaike.com/
// @version      1.0.0
// @description  友盟事件分析筛选条件加长，可以最大限度看到内容
// @author       tpxxn
// @match        https://mobile.umeng.com/platform/*/analysis_insight/segment/create
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420180/%E5%8F%8B%E7%9B%9F%E4%BA%8B%E4%BB%B6%E5%88%86%E6%9E%90%E7%AD%9B%E9%80%89%E6%9D%A1%E4%BB%B6%E5%8A%A0%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/420180/%E5%8F%8B%E7%9B%9F%E4%BA%8B%E4%BB%B6%E5%88%86%E6%9E%90%E7%AD%9B%E9%80%89%E6%9D%A1%E4%BB%B6%E5%8A%A0%E9%95%BF.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function changeWidth() {
        console.log("ChangeWidth");
        var items = document.getElementsByClassName(
            "ant-select-show-arrow umui-select property-field-values-select ant-select ant-select-enabled"
        );
        console.log(items.length);
        for (var item of items) {
            item.style.cssText = "width:600px;";
        }
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                // 在创建新的 element 时调用
                console.log("child list: ");
                // console.log(mutation);
                changeWidth();
            } else if (mutation.type === "attributes") {
                // 在属性发生变化时调用
                console.log("attributes: ");
                console.log(mutation);
            }
        });
    });

    observer.observe(window.document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["src", "href", "action"],
    });
})();
