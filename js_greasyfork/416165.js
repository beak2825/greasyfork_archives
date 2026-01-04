// ==UserScript==
// @name         百度搜索csdn结果优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏百度搜索中csdn自己推广的 含有 csdn已为您找到关于 的搜索项!
// @author       Jie
// @match        https://www.baidu.com/s?*
// @grant        none
// @namespace       https://greasyfork.org/users/705477
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/416165/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2csdn%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416165/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2csdn%E7%BB%93%E6%9E%9C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

jQuery.noConflict();
(function() {
    'use strict';
    $('.result .c-abstract').each(function(i)
    {
        if($(this).text().indexOf('csdn已为您找到关于')>-1)
        {
            $(this).parent().hide()
            
        }
        
    })
})();