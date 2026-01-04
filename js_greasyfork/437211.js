// ==UserScript==
// @name         2021广东省公需课考核部分自动答题并提交
// @description  《人工智能发展与产业应用》和《科技创新现状与发展趋势》最后考核部分自动答题并提交
// @namespace    小南88
// @version      2.2
// @description  try to take over the world!
// @author       You
// @match        https://jsxx.gdedu.gov.cn/a_b23243b083e449e79f1c6c269575e7ea/study/course/c_f03e978ceb05464095427119fd8c9ada?offsetTop=*&goLastActivity=N
// @match        http*://jsxx.gdedu.gov.cn/a_2dbd7d2806214a8a93c99f601cbec045/study/course/c_4e9f50e2756a4bf5ad1ca9696672681a?offsetTop=*&goLastActivity=N
// @icon         https://jsxx.gdedu.gov.cn/ncts/custom/gongxu/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437211/2021%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E6%A0%B8%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B9%B6%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/437211/2021%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E6%A0%B8%E9%83%A8%E5%88%86%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B9%B6%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var answers = [];
    if($('.aidHidden.ing').val() == 'a_b23243b083e449e79f1c6c269575e7ea')
        answers = ['A','A','B','B','B','A','A','B','A','A','A','B','C','B','B','B','A','A','D','B','AC','ABD','ABCD','ACD','ACD','AB','ABCD','ABCD','BD','ABC'];
    else
        answers = ['A','A','B','B','A','A','B','B','B','A','B','A','A','A','C','B','A','A','A','B','ABC','ABCD','BCD','ABC','ABC','ABD','ABC','ABCD','ABC','ABC'];
 
    for(var i = 0; i < answers.length; i++){
        var val = answers[i];
        if(val.search('A') != -1)$('.m-topic-item:eq(' + i + ') input:eq(1)')[0].click();
        if(val.search('B') != -1)$('.m-topic-item:eq(' + i + ') input:eq(2)')[0].click();
        if(val.search('C') != -1)$('.m-topic-item:eq(' + i + ') input:eq(3)')[0].click();
        if(val.search('D') != -1)$('.m-topic-item:eq(' + i + ') input:eq(4)')[0].click();
    }
    finishTest();
})();
