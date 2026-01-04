// ==UserScript==
// @name         【免费电子书下载】将爱分享网站(www.ishare1.cn)隐藏的PDF电子书下载链接显示出来
// @namespace    www.ishare1.cn
// @version      1.0
// @description  安装本插件后，可以将爱分享网站(www.ishare1.cn)隐藏的PDF电子书下载链接显示出来
// @author       sunjian286
// @include      *://www.ishare1.cn/archives/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-idle
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/409952/%E3%80%90%E5%85%8D%E8%B4%B9%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E3%80%91%E5%B0%86%E7%88%B1%E5%88%86%E4%BA%AB%E7%BD%91%E7%AB%99%28wwwishare1cn%29%E9%9A%90%E8%97%8F%E7%9A%84PDF%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%87%BA%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/409952/%E3%80%90%E5%85%8D%E8%B4%B9%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E3%80%91%E5%B0%86%E7%88%B1%E5%88%86%E4%BA%AB%E7%BD%91%E7%AB%99%28wwwishare1cn%29%E9%9A%90%E8%97%8F%E7%9A%84PDF%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%87%BA%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
	'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;

    /*** 未经授权，任何人不得使用本插件代码 ***/

    var downloadLinkHelper={};
    downloadLinkHelper.addHtml=function(){
    	if(window_url.indexOf("www.ishare1.cn/archives/")==-1 || website_host!="www.ishare1.cn"){
    		return;
    	}
    	//iframe中不再执行
    	if(window.top != window.self){
    		return;
    	}
        var $buttons = $('.ordown').children('a.ordown-demo');//按钮
        if($buttons.size == 0){//无链接等
    		return;
        }
        var hrefLink = $buttons.eq(0).attr('href');//链接
        if(typeof hrefLink === 'undefined'){//无链接等
            return;
        }
        if(hrefLink.indexOf('down.php') >= 0){//有下载链接
            return;
        }
        //链接id
        var postId = window_url.replace('http://www.ishare1.cn/archives/','').replace('.html','');
        var downloadButtonHtml = '<a rel="external nofollow" ' +
                   'href="http://www.ishare1.cn/wp-content/plugins/ordown/down.php?id=' + postId + '" ' +
                   'class="ordown-demo" style="float:left;color:red;margin-right:10px;" target="_blank" _hover-ignore="1">' +
                   '<i class="fa fa-cloud-download" style="margin-right:4px;margin-top:3px"></i>网盘下载</a>&nbsp;&nbsp;';
        $('.ordown').prepend(downloadButtonHtml);
    }
    downloadLinkHelper.init=function(){
    	downloadLinkHelper.addHtml();
    }
    downloadLinkHelper.init();
})();