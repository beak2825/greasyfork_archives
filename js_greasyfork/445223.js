// ==UserScript==
// @name        跳转链接直达
// @description 知乎,CSDN,简书,开源中国,掘金 跳转链接直达
// @namespace   https://github.com/golyu/directTo/issues
// @version     0.9.1
// @author      g
// @include     *://link.zhihu.com/*
// @include     *://link.csdn.net/*
// @include     *://link.juejin.cn/*
// @include     *://www.jianshu.com/go-wild*
// @include     *://www.oschina.net/action/GoToLink*
// @license     MIT License ???直接
// @supportURL  https://github.com/golyu/directTo/issues
// @run-at      document-start
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/445223/%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/445223/%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==
"use strict";
class Base {
    constructor(regexp, regexpDetails) {
        this.regexp = regexp;
        this.regexpDetails = regexpDetails;
    }
    getRegexp() {
        return this.regexp;
    }
    getToUrl(href) {
        const result = this.regexpDetails.exec(href);
        if (result && result.length > 1) {
            return decodeURIComponent(result[1]);
        }
        return "";
    }
}
const websiteArray = [
    new Base(/jianshu/, /.*jianshu.com\/go-wild.*url=(.*)/),
    new Base(/oschina/, /.*oschina.net\/action\/GoToLink.*url=(.*)/),
    new Base(/zhihu/, /.*link.zhihu.com\/\?target=(.*)/),
    new Base(/juejin/, /.*link.juejin.cn\/\?target=(.*)/),
    new Base(/csdn/, /.*link.csdn.net\/\?target=(.*)/),
];
websiteArray.some(website => {
    return (function () {
        if (website.getRegexp().test(window.location.href)) {
            const url = website.getToUrl(window.location.href);
            if (url) {
                window.location.href = url;
                return true;
            }
        }
        return false;
    })();
});
//# sourceMappingURL=directTo.js.map
