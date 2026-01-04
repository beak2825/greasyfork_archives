// ==UserScript==
// @name         rap2文本域全选
// @description  http://rap2.taobao.org    rap2接口编写页面的文本域获取焦点后自动全选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       BoserSteven
// @match        http://rap2.taobao.org/repository/editor*
// @icon         https://www.google.com/s2/favicons?domain=taobao.org
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428010/rap2%E6%96%87%E6%9C%AC%E5%9F%9F%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/428010/rap2%E6%96%87%E6%9C%AC%E5%9F%9F%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function() {
    $(function(){
        $('body').on('focus', '.editable', function(){
            $(this).select();
        });
    });
})();