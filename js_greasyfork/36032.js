// ==UserScript==
// @name         判断电池企业是否存在
// @namespace    https://www.batthr.com/
// @version      1.22
// @description  电池判断企业是否存在
// @author       penrcz
// @match        http://dc.epjob88.com/SearchResult.php*
// @grant        none
// @require      https://cdn.bootcss.com/layer/3.1.0/layer.js
// @downloadURL https://update.greasyfork.org/scripts/36032/%E5%88%A4%E6%96%AD%E7%94%B5%E6%B1%A0%E4%BC%81%E4%B8%9A%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/36032/%E5%88%A4%E6%96%AD%E7%94%B5%E6%B1%A0%E4%BC%81%E4%B8%9A%E6%98%AF%E5%90%A6%E5%AD%98%E5%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("head").append (
        '<link href="https://cdn.bootcss.com/layer/3.1.0/theme/default/layer.css" rel="stylesheet" type="text/css">'
    );
    $('.item_r_A a').each(function(){
    	var _self = $(this);
        var title = _self.text();
        $.get("http://www.batthr.com/s-k-"+title+".html", function(data){
            //console.log(_self.prop('title'));
            layer.tips(data, _self,{
                tips: [2, '#0FA6D8'],
                tipsMore: true,
                time:0
            });
        });

    });
})();