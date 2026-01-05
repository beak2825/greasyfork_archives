// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/30310-adan1
// @name         DMZJ去视频广告及提取地址
// @description  去除动漫之家的视频广告，点击不同视频时提取地址。
// @icon		 http://donghua.dmzj.com/favicon.ico
// @author       Adan1
// @exclude      http://adan.homepage/
// @include      http://donghua.dmzj.com/donghua_play/*
// @include      http://donghua.dmzj.com/donghua_info/*
// @include      http://donghua.dmzj.com/*
// @include      http://manhua.dmzj.com/*
// @include      http://xs.dmzj.com/*
// @exclude      http://acg.178.com/*/t_*.html
// @include      http://acg.178.com/*
// @include      http://t.178.com/widget/tweet/resource*.html
// @grant        GM_getValue
// @require		 http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @encoding     utf-8
// @date         2016-02-14
// @version      0.4
// @modified     2016-03-19
// @downloadURL https://update.greasyfork.org/scripts/17068/DMZJ%E5%8E%BB%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E5%8F%8A%E6%8F%90%E5%8F%96%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/17068/DMZJ%E5%8E%BB%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A%E5%8F%8A%E6%8F%90%E5%8F%96%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


function removeById(id){
	$("#"+id).remove();
}
var removesById, removesByHref;
if(false){
    removesById = function(id){
    	var n = $("#"+id);
    	n.parent().css("backgroundColor","black");
    	n.remove();
    };
    removesByHref = function(href, subTagName){ // subTag必须存在防止意外事故
    	var n = $("a[href='"+href+"'] "+subTagName);
    	n.parent().css("backgroundColor","black");
    	n.remove();
    }
}else{
    removesById = function(id){
    	$("#"+id).parent().remove();
    };
    removesByHref = function(href, subTagName){ // subTag必须存在防止意外事故
		$("a[href='"+href+"'] "+subTagName).parent().remove();    	
    }
}
function removeIframe(src){
	$("iframe[src='"+src+"']").remove();
}


// 视频广告
removeById("ad");
// 顶底广告
removesById("BAIDU_UNION__wrapper_u2288649_0");
removesById("BAIDU_UNION__wrapper_u2288646_0");
removeIframe("http://acg.178.com/201207/t_137372048994.html");
removeById("SG_GG_CONTAINER_731");
removeById("SG_GG_CONTAINER_725");removeById("adv1");
// 内容广告
removesById("ac_js86_116683");
removeById("BAIDU_UNION__wrapper_u2071031_0");
removeById("app_manhua");
removesByHref("http://www.dmzj.com/app/pc.html", "img");
removeById("floatCode");
// 提取视频地址
$(".ani-player").each(function(){
    var box = $(this);
    box.find(".cite-tools ul>li").each(function(){
        var btn = $(this).children("a");
        box.append("[", btn.html(), "] ");
        var lnkobj = $([  "<a href='", "javascript:void(0);", "' target='_blank'>", "?", "</a>"  ].join(""));
        lnkobj.appendTo(box);
        box.append("<br/>");
        
        btn.one("click", function(){	//alert("one");
        	var lnk = box.find(".ani-player-box embed").attr("src");
            if(lnk==undefined){
            	lnk = box.find(".ani-player-box a").attr("href");
            }
            lnkobj.html(lnk);
            lnkobj.attr("href", lnk);
        });
    });
});
















