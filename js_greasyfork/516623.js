// ==UserScript==
// @name         百度搜图自动填充
// @namespace    百度搜图自动填充
// @version      2024-11-10
// @description  用于实现自动百度搜图
// @author       Liam Men
// @match        https://graph.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516623/%E7%99%BE%E5%BA%A6%E6%90%9C%E5%9B%BE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/516623/%E7%99%BE%E5%BA%A6%E6%90%9C%E5%9B%BE%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var formFields = location.hash.match(/(?:^#|&)field=([^&]+)/),
        formSubmit = location.hash.match(/(?:^#|&)submit=([^&]+)/);

    if(formFields && formFields.length > 1){
        formFields[1].split(",").forEach(function(fieldItem) {
            var fieldInfo = fieldItem.split(":"),
                fieldDom  = $(fieldInfo[0]);

                if(fieldDom.length > 0 && fieldInfo.length > 1){
                    fieldDom.val(decodeURIComponent(fieldInfo[1]));
                    fieldDom.get(0).dispatchEvent(new Event('input'));
                }
        });
    }

    if(formSubmit && formSubmit.length > 1){
        var submitInfo = formSubmit[1].split(","),
            submitDom  = $(submitInfo[0]);

            if(submitDom.length > 0 && submitInfo.length > 1 && typeof submitDom[submitInfo[1]] == 'function'){
                submitDom[submitInfo[1]]();
            }
    }
})();