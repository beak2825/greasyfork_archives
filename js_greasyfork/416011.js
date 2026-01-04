// ==UserScript==
// @name         BV->av
// @icon         https://www.bilibili.com/favicon.ico
// @author       Minecrazy
// @description  对“萌萌哒丶九灬书”和“神代绮凛”的转av脚本进行了简单粗暴的合并,以解决前者不显示时间t和后者换p时不转换的问题
// @version      0.1
// @create       2020-11-13
// @lastmodified 2020-11-13
// @include      /^https?:\/\/www\.bilibili\.com\/video\/[AaBbVv]+/
// @require      https://cdn.jsdelivr.net/npm/simple-query-string@1.3.2/src/simplequerystring.min.js
// @grant        none
// @namespace https://greasyfork.org/users/470045
// @downloadURL https://update.greasyfork.org/scripts/416011/BV-%3Eav.user.js
// @updateURL https://update.greasyfork.org/scripts/416011/BV-%3Eav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const purgeSearchString = () => {
        const { p, t } = simpleQueryString.parse(location.search);
        const result = simpleQueryString.stringify({ p, t });
        return result ? `?${result}` : '';
    };

    (window.aid==undefined)?(''):(history.replaceState(null, null, `https://www.bilibili.com/video/av${window.aid}${purgeSearchString()}${window.location.hash}`));
})();