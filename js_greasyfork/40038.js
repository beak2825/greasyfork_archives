// ==UserScript==
// @name         屏蔽51job培训公司
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给51JOB招聘网上面的培训公司进行标记，以免上当受骗
// @author       两载
// @include        *//search.51job.com/*
// @grant        none
// @run-at document-idle




// @downloadURL https://update.greasyfork.org/scripts/40038/%E5%B1%8F%E8%94%BD51job%E5%9F%B9%E8%AE%AD%E5%85%AC%E5%8F%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/40038/%E5%B1%8F%E8%94%BD51job%E5%9F%B9%E8%AE%AD%E5%85%AC%E5%8F%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms)
    {
        for(var t = Date.now();
            Date.now() - t <= ms;
           );
    }

    sleep(1000);

    //需要屏蔽的公司列表
    var adblock_company = [
        '湖北全健运动健康产业孵化器有限公司',
        '湖北华奥星空体育产业联盟发展有限...',
        '武汉方能文化传播有限公司',
        '武汉千途创造软件开发有限公司',
        '武汉百科杰软件有限公司',
        '蓝鸥科技（武汉）有限公司'
    ];
    console.log('开始了。');
    var el_length = $(".el").length;
    var el_arr = $(".el");
    for(var i = 0; i < el_length; i++)
    {
        for ( var j = 0 ; j <adblock_company.length ; j++ )
        {
            if ( el_arr[i].innerHTML.indexOf(adblock_company[j]) >= 0 )
            {
                //找到元素添加背景色
                $(".el")[i].style = "background: red;";
                //console.log("i = " + i);
            }
            //console.log("j = " + j);
        }
    }
})();
