// ==UserScript==
// @name         一键下载Pixabay图片
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  支持在登录情况下一键下载指定尺寸的原图，不需要打开详情页下载
// @author       UUtool
// @match        https://pixabay.com/*
// @grant        GM_addStyle
// @require      https://cdn.staticfile.org/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391523/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDPixabay%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/391523/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDPixabay%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

GM_addStyle ( `
.js-img-btn {
position:absolute;
right:0;
top:0;
background:rgba(0,0,0,0.5);
color:#fff;
padding:4px 10px;
}
.js-img-btn:hover{
background:rgba(0,0,0,0.8);
}
` );


(function() {
    'use strict';
    var $jq = jQuery.noConflict();

    var str = '<a class="js-img-btn" title="点击下载该图片" href="javascript:;" style="">下载</a>';
    $jq('.credits .item').append(str);//追加到节点
    $jq('.credits .item').on('click','.js-img-btn',function(){
        var node = $jq(this).parent().find('a img');
        if(0===node.length){
            alert('该图片无法下载');
            return;
        }

        //获取节点上的数据
        var src =$jq(node).attr('srcset');
        if(''===src){
            src = $jq(node).data('lazy');
        }


        //拼接字符串并下载文件
        var pos1 = src.lastIndexOf('/'),
            pos2 = src.lastIndexOf('__');
        var name = src.slice(pos1+1,pos2),
            size = 1920;//下载图片的宽度分辨率,可以根据实际情况换成其他的如640,1280,1920等

        var url = 'https://pixabay.com/images/download/'+name+'_'+size+'.jpg?attachment';
        var a = document.createElement('a'); // 创建a标签
        a.setAttribute('href', url);// href链接
        a.click();// 自执行点击事件
    });
})();