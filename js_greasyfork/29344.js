// ==UserScript==
// @name         获取天猫评论图片
// @namespace    https://greasyfork.org/zh-CN/scripts/22386
// @version      20170429
// @description  Get TMALL Comment Pic
// @author       sbdx
// @match        detail.tmall.com/item.htm?*
// @grant        none
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/29344/%E8%8E%B7%E5%8F%96%E5%A4%A9%E7%8C%AB%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/29344/%E8%8E%B7%E5%8F%96%E5%A4%A9%E7%8C%AB%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/*
Target URL: https://item.taobao.com/item.htm?id=528857970664
*/
(function() {
    //   'use strict';
    var page=1;
    var url,PageTotal;
    var itemid,sellerid;
    var targetElement='#mainwrap';
    itemid=g_config.itemId;
    sellerid=g_config.sellerId;

    function getJSON()
    {
        //$('#J_IdsSegments').css('z-index',100);//降低右侧div的层级
        url="https://rate.tmall.com/list_detail_rate.htm?itemId=" + itemid + "&sellerId=" + sellerid + "&order=3&content=1&currentPage=" + page + "&picture=1&_ksTS="+(new Date().getTime()) + "&callback=?";
        $.getJSON(url,function(d){
            if(page==1) PageTotal=d.rateDetail.paginator.lastPage;//获取总页数
            ProcessJSON(d);
            page++;
            if(page<=Math.min(10,PageTotal))getJSON();//最多取10页数据
        });

    }
    function ProcessJSON(d)
    {
        var ImgList=[];
        $.each(d.rateDetail.rateList,function(i,v){
            img='';
            if(v.pics)
            {
                $.each(v.pics,function(pi,pv){
                    img+="<img src='" + pv.replace('_400x400.jpg','') + "' /><br><br>\r\n";
                });
            }
            if(v.appendComment.pics)
            {
                $.each(v.appendComment.pics,function(pi,pv){
                    img+="<img src='" + pv.replace('_400x400.jpg','') + "' /><br><br>\r\n";
                });
            }
            ImgList.push(img);
        });
        append='<div>第' + page + '页</div>'+ImgList.join('');
        console.log(append);
        $(targetElement).append(append);
        
    }
    if(jQuery)
    {
        $("body").append("<div id='sbdx_tools_getAllImage' style='position:absolute;right:10px;top:100px;z-index:200000020'><button>显示天猫<br>评论图片</button></div>");$("#sbdx_tools_getAllImage").on("click",function(){page=1;$(targetElement).html('');getJSON();});
        $(window).scroll(function(){$("div[id^=sbdx]").each(function(i){$(this).offset({top:$(document).scrollTop()+100+i*30});});});
    }
    else
    {
        alert('Tampermonkey 加载jquery.js 失败！脚本终止运行！');
    }
})();