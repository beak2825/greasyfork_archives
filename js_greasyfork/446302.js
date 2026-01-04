// ==UserScript==
// @name         职教云测试
// @namespace    http://tampermonkey.net/222
// @version      0.3
// @description  测试
// @author       You1
// @match        https://zjy2.icve.com.cn/common/directory/directory.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icve.com.cn
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446302/%E8%81%8C%E6%95%99%E4%BA%91%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446302/%E8%81%8C%E6%95%99%E4%BA%91%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // @ts-ignore
        const _template = unsafeWindow.template;
        // @ts-ignore
        unsafeWindow.template = function (type , data ) {
          const res = _template(type, data);
          onTemplate(type, data);
          return res;
        };

        function onTemplate(type , data ) {
          console.log('onTemplate', type, data);
        }
    // Your code here...
})();