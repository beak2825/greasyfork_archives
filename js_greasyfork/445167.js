// ==UserScript==
// @name         2022广东省公需课考核部分自动答题并提交
// @description  《碳达峰、碳中和的实现路径与广东探索专题》和《数字化转型与产业创新发展专题》最后考核部分自动答题并提交
// @namespace    林赞赞
// @version      1.0
// @description  448
// @author       You
// @match        https://jsxx.gdedu.gov.cn/a_a13a3cc6f4d447d29abd2bb30180409f/study/course/c_00adfb3fea0f4e5e95baddcfc9e34ddd?offsetTop=*=N
// @match        http*://jsxx.gdedu.gov.cn/a_c42f291ad32c48659ec8b17f9c0f59e0/study/course/c_b898edfac2344887b59036cc3b738807?offsetTop=*=N
// @icon         https://jsxx.gdedu.gov.cn/ncts/custom/gongxu/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445167/2022%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E6%A0%B8%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B9%B6%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/445167/2022%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E6%A0%B8%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B9%B6%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var answers = [];
    if($('.aidHidden.ing').val() == 'a_a13a3cc6f4d447d29abd2bb30180409f')
        answers = ['D','C','C','A','A','B','C','D','A','A','ACD','BDE','BCD','ABC','BCD','ABD','ABCD','AC','ABCD','BD','B','B','B','B','A','A','B','A','B','A'];
    else
        answers = ['C','C','C','D','A','B','A','A','A','C','ABCD','ABCD','ABCD','ABD','ABCD','ABC','ABC','ABCD','ABC','ACD','A','A','A','A','A','A','B','B','A','B'];

    for(var i = 0; i < answers.length; i++){
        var val = answers[i];
        if(val.search('A') != -1)$('.m-topic-item:eq(' + i + ') input:eq(1)')[0].click();
        if(val.search('B') != -1)$('.m-topic-item:eq(' + i + ') input:eq(2)')[0].click();
        if(val.search('C') != -1)$('.m-topic-item:eq(' + i + ') input:eq(3)')[0].click();
        if(val.search('D') != -1)$('.m-topic-item:eq(' + i + ') input:eq(4)')[0].click();
        if(val.search('E') != -1)$('.m-topic-item:eq(' + i + ') input:eq(5)')[0].click();
    }
    finishTest();
})();
