// ==UserScript==
// @name         HR ZFZ/ZSH
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  HR请假界面显示不同提示信息
// @author       You
// @match        http://61.172.47.101:7888/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillForm&inFrame=true&fromHeader=true&serviceId=QFqqEpm6TEGyMsi2sSWux%2FI9KRA%3D
// @icon         https://www.google.com/s2/favicons?sz=64&domain=47.101
// @grant        none
// @license      1.0
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/468118/HR%20ZFZZSH.user.js
// @updateURL https://update.greasyfork.org/scripts/468118/HR%20ZFZZSH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if($('#entries_person_number').val().substring(0,1)=='S'){
         var test=$("label[name='tishi3']")[1];
          test.innerHTML='';
    }else{
        var test2=$("label[name='tishi3']");
          test2[0].innerHTML='';
        test2[1].innerHTML='提示3：当月累计病假10 日（含）以内的，每日扣减绩效考核分值1 分；全月病假者，扣除全部绩效工资；全年考核平均分值作为发放年奖金的依据之一。（ZFZ）';
    }

})();