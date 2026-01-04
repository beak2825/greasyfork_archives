// ==UserScript==
// @name         清华大学本科生中文成绩单预览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  →http://jxgl.cic.tsinghua.edu.cn/jxpg/f/zzzc/v_zzfw_zzdy_dd/bks_dzcjd
// @author       Rika
// @match        http://jxgl.cic.tsinghua.edu.cn/jxpg/f/zzzc/v_zzfw_zzdy_dd/bks_dzcjd
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/377053/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E4%B8%AD%E6%96%87%E6%88%90%E7%BB%A9%E5%8D%95%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377053/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E4%B8%AD%E6%96%87%E6%88%90%E7%BB%A9%E5%8D%95%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (location.pathname === '/jxpg/f/zzzc/v_zzfw_zzdy_dd/bks_dzcjd') {
            $('<div class="panel" >\n' +
                '\t\t\t\t\t<div class="panel-header">\n' +
                '\t\t\t\t\t\t<div class="panel-title">本科生中文成绩单预览</div>\t\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t<div class="panel-body preview" id="pdf-preview">\n' +
                '\t\t\t\t\t\t\t\n' +
                '\t\t\t\t</div>\t\t\t\t\t\t\t\t\n' +
                '\t\t\t</div>').insertAfter('#disabled_button')
            $.post('/jxpg/f/zzzc/v_zzfw_zzdy_dd/bks_dzcjd_lx', {cjdlx: "yxw_zw"}, function (result) {
                $("#pdf-preview").html(result); // Or whatever you need to insert the result
            }, 'html');
        }
    // Your code here...
})();