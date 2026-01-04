// ==UserScript==
// @name        屏蔽骚扰软件广告
// @description 屏蔽烦人的垃圾软件广告,主要是有些软件对我们的毫无吸引力又频繁发布版本骚扰,使用这个插件屏蔽掉关键字
// @namespace   https://github.com/huojianchuansb
// @version     0.3.0
// @author      g
// @include     *://www.oschina.net/*
// @license     MIT License
// @run-at      document-end
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445235/%E5%B1%8F%E8%94%BD%E9%AA%9A%E6%89%B0%E8%BD%AF%E4%BB%B6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445235/%E5%B1%8F%E8%94%BD%E9%AA%9A%E6%89%B0%E8%BD%AF%E4%BB%B6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
var keywords = ["仙童","莲花"];
function isExist(str) {
    for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
        var keyword = keywords_1[_i];
        if ((str === null || str === void 0 ? void 0 : str.indexOf(keyword)) > 0) {
            return true;
        }
    }
    return false;
}
var listArr = document.getElementsByClassName("item-list");
if (listArr){
    for (let j = 0; j < listArr.length; j++) {
        var list = listArr[j];
        var items = list.getElementsByClassName("item");
        if ((items === null || items === void 0 ? void 0 : items.length) > 0) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var a = item.getElementsByClassName("item-title");
                if (a && a[0]) {
                    var title = a[0].getAttribute("title");
                    if (isExist(title)) {
                        list.removeChild(item);
                    }
                }
            }
        }
    }
}
