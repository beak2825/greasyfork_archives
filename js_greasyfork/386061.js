// ==UserScript==
// @name         七七铺批量导出下载链接
// @namespace    https://www.yge.me/
// @version      0.1
// @description  导出给Aria2下载
// @author       Y.A.K.E
// @match        http://www.qiqipu.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/386061/%E4%B8%83%E4%B8%83%E9%93%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/386061/%E4%B8%83%E4%B8%83%E9%93%BA%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    jQuery('.xf_down_all').after('<a href="javascript:void(0);" class="get_y_cc" style="color: blue;" target="_self">复制选中原始链接</a><a href="javascript:void(0);" class="get_y_cc2" style="color: red;" target="_self">复制全部原始链接</a>');



    jQuery('.get_y_cc2').click(function(){
        window.y_cc='';
        jQuery(this).parent().prev().find('.publish_down a').each(function(e){
            window.y_cc = window.y_cc + jQuery(this).attr('href')  + "\n";
        });
        GM_setClipboard(window.y_cc);

    });




//复制选中
    jQuery('.get_y_cc').click(function(){
        window.y_cc='';
        jQuery('.down_url').each(function(index,e){
            if (jQuery(this).is(':checked')){
                window.y_cc = window.y_cc + jQuery('.publish_down a').eq(index).attr('href')  + "\n";
            }
            GM_setClipboard(window.y_cc);

        });



    });

})();