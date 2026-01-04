// ==UserScript==
// @name         oa批量阅读
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  oa批量阅读，由吴大师编写
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @author       吴大师(wxj)
// @match        http://10.46.7.197:7100/risen/oa/index/getAllPendingYListIndex.action?strMap.searchWhere=ALL&strMap.selectType=DY*
// @downloadURL https://update.greasyfork.org/scripts/497888/oa%E6%89%B9%E9%87%8F%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/497888/oa%E6%89%B9%E9%87%8F%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if ($("#batchFinishRead").length>0) {
        $("#batchFinishRead").show();
    }
})();