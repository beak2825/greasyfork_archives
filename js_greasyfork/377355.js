// ==UserScript==
// @name         阿里云日志查询页切换旧版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sls.console.aliyun.com/*logsearch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377355/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E6%9F%A5%E8%AF%A2%E9%A1%B5%E5%88%87%E6%8D%A2%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377355/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E6%9F%A5%E8%AF%A2%E9%A1%B5%E5%88%87%E6%8D%A2%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var projectMatch=/(?<=project\/).+(?=\/logsearch\/)/;
    var logMatch=/(?<=logsearch\/)[^?]+/i;
    var currenturl=window.location.href;
    var projectName=currenturl.match(projectMatch);
    var categoryName=currenturl.match(logMatch);
    if(projectName && categoryName){
        var oldUrl='https://sls.console.aliyun.com/#/project/'+projectName+'/categoryList/detail/?categoryName='+categoryName;
        var $link=$('<a>切换旧版</a>');
        $link.attr('href',oldUrl);

        $('.right div:first').prepend($link);

    }
    // Your code here...
})();