// ==UserScript==
// @name         屏蔽百度搜索中的卡饭教程
// @namespace    https://greasyfork.org/zh-CN/users/18052-bin456789
// @version      0.0.3
// @description  屏蔽百度搜索中的卡饭教程!
// @author       bin456789
// @match        *://www.baidu.com/
// @match        *://www.baidu.com/s?*
// @match        *://www.baidu.com/baidu?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13088/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%B8%AD%E7%9A%84%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/13088/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E4%B8%AD%E7%9A%84%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
    var str = "result c-container ";

    function del(obj) {
        if (obj.className == str) {
            obj.innerHTML = "已屏蔽卡饭教程";
            obj.style.color = '#eee';
        }
    }

    function find() {
        var gs = $('.g');
        for (var i = 0; i < gs.length; i++) {
            var g = gs[i];
            if (g.innerHTML.indexOf('www.kafan.cn/topic/') === 0 || g.innerHTML.indexOf('www.kafan.cn/edu/') === 0) {
                var result = g.parentNode.parentNode;
                if (result.className == str)
                    del(result);
                else {
                    result = result.parentNode.parentNode;
                    del(result);
                }
            }
        }
    };

    find();

    var observer = new MutationObserver(find);
    var wrapper = document.querySelector("#wrapper");
    observer.observe(wrapper, {
        "attributes": true,
        "attributesFilter": ["class"],
    });
})();
