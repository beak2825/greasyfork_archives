// ==UserScript==
// @name         copy_jianshu_to_csdn_and_segmentfault
// @namespace    
// @version      0.1
// @description  将景昱OA头像换掉
// @author       You
// @include      http://221.224.77.77:8088
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442178/copy_jianshu_to_csdn_and_segmentfault.user.js
// @updateURL https://update.greasyfork.org/scripts/442178/copy_jianshu_to_csdn_and_segmentfault.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var lg = $('#personHeadImg > div');
    if(lg.length==1){
        $(lg).html('<img id="memberImageUrl" src="https://q4.qlogo.cn/g?b=qq&nk=1079610190@qq.com&s=3?d=retro">');
    }
})();