// ==UserScript==
// @name         阿里云日志库列表-跳转旧版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://sls.console.aliyun.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377356/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E5%BA%93%E5%88%97%E8%A1%A8-%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377356/%E9%98%BF%E9%87%8C%E4%BA%91%E6%97%A5%E5%BF%97%E5%BA%93%E5%88%97%E8%A1%A8-%E8%B7%B3%E8%BD%AC%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle ( `
div[ui-view=projectDetail] table tbody tr.ng-scope td:first-child {
color:red;
cursor: pointer;
}
` );
(function() {
    'use strict';

    // Your code here...

    $('body').on('click','div[ui-view=projectDetail] table tbody tr.ng-scope td:first-child',function(){
        var projectMatch=/(?<=project\/).+(?=\/categoryList)/;
        var currenturl=window.location.href;
        var projectName=currenturl.match(projectMatch);
        //alert(projectName);
        if(projectName){
            var categoryName=$(this).children('span').text();
            var oldUrl='https://sls.console.aliyun.com/#/project/'+projectName+'/categoryList/detail/?categoryName='+categoryName;
            window.location=oldUrl;
        }

    });

})();