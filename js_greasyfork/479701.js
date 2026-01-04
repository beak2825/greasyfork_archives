// ==UserScript==
// @version      0.1
// @description  国联江森附件预览
// @match        *://oa.gl-jci.com/*
// @name         国联江森附件预览按钮
// @license      MIT
// @namespace    https://greasyfork.org/users/1216559
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/479701/%E5%9B%BD%E8%81%94%E6%B1%9F%E6%A3%AE%E9%99%84%E4%BB%B6%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/479701/%E5%9B%BD%E8%81%94%E6%B1%9F%E6%A3%AE%E9%99%84%E4%BB%B6%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

             $(function(){
                 for(let i=0;i<$("[id*=Attachment]").length;i++){
    
    let atti = h3form.value[$("[id*=Attachment]").eq(i).attr("id")];
    let key = $("[id*=Attachment]").eq(i).attr("id");
    for(let j=0;j<atti.length;j++){
        $("#"+key).find(".file-item").eq(j).find(".download-icon").append($("<a href=\"https://view.xdocin.com/view?src="
                                +atti[j].url+"\">预览</a>"));
    }
    
}
             });
                    
                
  
})();
