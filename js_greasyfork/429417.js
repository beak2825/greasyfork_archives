// ==UserScript==
// @name         林科大教务自动评教
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动完成评教表单。
// @author       Max Cheng
// @include      http://jwgl.csuft.edu.cn/jsxsd/xspj/xspj_edit.do*
// @icon         https://www.google.com/s2/favicons?domain=csuft.edu.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/429417/%E6%9E%97%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/429417/%E6%9E%97%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(function(){
        pingjiao();
    });

    var text = '老师认真负责，讲课精神饱满，有感染力，能吸引学生的注意力。讲述内容充实，信息量大，能反映或联系学科发展的新思想、新概念、新成果。';

    function pingjiao(){
        var eventrs = $('#table1 tr:gt(0):even');
        var oddtrs = $('#table1 tr:gt(0):odd');
        eventrs.each(function(){
            $(this).children().last().children().eq(0).prop('checked','checked');
        });
        oddtrs.each(function(){
            $(this).children().last().children().eq(2).prop('checked','checked');
        });
        $('textarea').val(text);

        $('#tj').click();
    };
})();