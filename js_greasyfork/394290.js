// ==UserScript==
// @name         山东大学教务系统自动评估脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用来自动进行山东大学教务系统的评估
// @author       You
// @match        http://bkjws.sdu.edu.cn/f/common/main
// @match        *://*bkjws.sdu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394290/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/394290/%E5%B1%B1%E4%B8%9C%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BC%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        for(let i=0;i<=20;i++){
            let name="zbda_"+i;
            let value=i==19?2:0;
            let _selector="input[name='"+name+"']:eq("+value+")";
            $(_selector).trigger("click");
            $(_selector).trigger("click");
        }

        var reason="很好";
        $("#zbda_21").val(reason);
        $("#tjButtonId").trigger("click");
        setTimeout(function(){$(".aui_state_highlight").trigger("click");},1000);
    },1000);
})();