// ==UserScript==
// @name         自动填写完成任务表单
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Fill Vue form automatically
// @author       大旭
// @match        https://energyfuture.top/energyFutureBusiness/staging/myTask/index
// @grant        none
// @license      MIT
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/487587/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AE%8C%E6%88%90%E4%BB%BB%E5%8A%A1%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/487587/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AE%8C%E6%88%90%E4%BB%BB%E5%8A%A1%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isAlreadyHandling = false;
    $(document).on('DOMSubtreeModified', '.el-drawer', function() {
        if (!isAlreadyHandling) {
            isAlreadyHandling = true;
            setTimeout(function() {
                isAlreadyHandling = false;
            }, 1000);
             // 查找Vue实例
            const vueInstance = document.querySelector('.el-form').__vue__;
            // 如果找到了Vue实例
            console.log(vueInstance,'vueInstance')
            if (vueInstance) {
                // 修改表单数据
                let taskStartTime = vueInstance.$parent.$data.rowObj.taskStartTime;
                let taskEndTime = vueInstance.$parent.$data.rowObj.taskEndTime;
                console.log(taskStartTime,'taskStartTime')
                console.log(taskEndTime,'taskEndTime')
                setTimeout(function() {
                    vueInstance.$parent.$data['form']['realityStartTime']= taskStartTime;
                    vueInstance.$parent.$data['form']['realityEndTime']= taskEndTime;
                    vueInstance.$parent.$data['form']['manDay']= 1;
                }, 1000);
                // 强制Vue重新渲染
                vueInstance.$forceUpdate();
            }
        }
    });
})();


