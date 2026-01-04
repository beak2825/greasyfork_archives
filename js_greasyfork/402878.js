// ==UserScript==
// @name         屏蔽知乎视频和专栏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽知乎视频和专栏,className知乎会经常变动，失效后可以直接改，建议电脑性能差的慎用。
// @author       hello world
// @match        https://*.zhihu.com/*
// @match        https://v.vzuu.com/video/*
// @match        https://video.zhihu.com/video/*
// @connect      zhihu.com
// @connect      vzuu.com
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402878/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E5%92%8C%E4%B8%93%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/402878/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E5%92%8C%E4%B8%93%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var callback = function (records){
        records.map(function(record){
            $('.ZVideoItem').parent().parent().hide();
            $('.ArticleItem').parent().parent().hide();
        });
    };

    var mo = new MutationObserver(callback);

    var option = {
       attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true

    };

    mo.observe(document.body, option);
})();