// ==UserScript==
// @include      https://redmine.int.jiedi*
// @name         issue_helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417558/issue_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/417558/issue_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //生成批量生成checklist
    if ($('.save-new-by-button').length == 1) {
        $('.save-new-by-button').last().after("<span class='icon icon-stop' id='generate-checklist'></span>");
        $('.checklist-item').on('click', '#generate-checklist', function(){
            var checkList = ["需求评审","任务拆解与耗时评估","配置备注","发布步骤备注","发布前代码review","发布前配置review","上线后验证"];
            checkList.forEach(function(v){
                $('.edit-box').last().val(v)
                $('.save-new-by-button').last().click()
            })
        })
    }

    // Your code here...
})();