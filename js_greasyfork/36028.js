// ==UserScript==
// @name         教师教育网下载文件保存带名称
// @namespace    https://www.sx314.com/
// @version      1.22
// @description  下载文件保存名称
// @author       penrcz
// @match        http://html.study.teacheredu.cn/*
// @match        http://*.teacheredu.cn/proj/counsellor/task/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/36028/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E4%BF%9D%E5%AD%98%E5%B8%A6%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/36028/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6%E4%BF%9D%E5%AD%98%E5%B8%A6%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.article_fj_list a').each(function(){
    	var _self = $(this);
    	if(_self.children('em').text() == "下载"){
    		var n = $('.article_xx span').eq(2);
    		_self.prop('type','application/octet-stream');
    		_self.prop('target','_blank');
        	_self.attr('download',
        			n.text().replace(/\s+/g,"") + " - " + 
        			_self.parent().children('span').text());
    	}
    });
    
    //批阅页
    $("div.hdjg_warp a").each(function(){
    	var _self = $(this);
    	if(_self.text() == "下载"){
    		var n = $('.zypy_tit span').eq(0);
    		_self.prop('type','application/octet-stream');
    		_self.prop('target','_blank');
        	_self.attr('download',
        			n.text().replace(/\s+/g,"") + " - " + 
        			_self.parentsUntil('em').parent().text()
        				.replace(/\s+/g,"")
        				.replace("下载","")
        				.replace("预览","")
        	);
    	}
    });
    
    function _p(obj){
    	console.log(obj);
    }
})();