// ==UserScript==
// @name         游民星空去除视频跳转
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除游民新闻中的视频跳转!
// @author       CrazyMelody
// @match        http://*.gamersky.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24886/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/24886/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var width = 600;
    var height = 500;
    var $div = $(".VideoJumper");
    if($div.size()>0){
        var reg,vid,html;
        console.info($div.size());
        $div.each(function(i,e){
            $div.css({width:"600px",height:"500px"});
            var href = $(e).find("a").attr("href");
            console.info("获取视频地址%s",href);
            if(href.indexOf("youku")>0){
	            reg = /.*id_(.*).html*/;
	            vid = reg.exec(href)[1];
                console.info('获取优酷视频ID：'+vid);
	            html = "<embed src='http://player.youku.com/player.php/sid/"+vid+"/v.swf' allowFullScreen='true' quality='high' width='"+width+"' height='"+height+"' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>";
	            $(e).html(html);
            }
            if(href.indexOf("letv")>0){
            	reg = /.*\?(.*)&width.*/;
            	vid = reg.exec(href)[1];
            	html = "<embed name='cloudPlayer14792694541520' src='http://yuntv.letv.com/bcloud.swf'"+
            	"pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash' "+
            	"width='100%' height='100%' bgcolor='#000000' allowscriptaccess='always' wmode='direct' align='middle' "+
            	"quality='high' allowfullscreen='true' version='10' flashvars='"+vid+"&width="+width+"&height="+height+"&pageControls=0&'>";
                $(e).html(html);
            }
            if(href.indexOf("tudou")>0){
                reg = /view\/(.*)\//;
                vid = reg.exec(href)[1];
                html = '<embed src="http://www.tudou.com/v/'+vid+'/v.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" width="'+width+'" height="'+height+'"></embed>';
                $(e).html(html);
            }
        });
    }
})();