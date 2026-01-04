// ==UserScript==
// @name         BiliBili 修复失效的搜藏视频标题内容
// @version      1.0
// @description  注意: 这个脚本只是让你知道是啥没了, 想看d复制标题去别的地方找吧.
// @author       Heicks
// @include        *//space.bilibili.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        Mozilla
// @namespace https://greasyfork.org/users/41902
// @downloadURL https://update.greasyfork.org/scripts/371687/BiliBili%20%E4%BF%AE%E5%A4%8D%E5%A4%B1%E6%95%88%E7%9A%84%E6%90%9C%E8%97%8F%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/371687/BiliBili%20%E4%BF%AE%E5%A4%8D%E5%A4%B1%E6%95%88%E7%9A%84%E6%90%9C%E8%97%8F%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

/*

Update: cu(can use)
    初次可正常运行.二次需手动点击按钮.



------------------
 TODO:
 在页面切换的时候自动修复
 在页面url改变的时候修复

       难点:
         页面不会全部刷新, 所以脚本只在初次ready()有效. 以后不会所有页面都生效
           方案1: 试试看每隔多少秒查询一次
           方案2: 存储url在tmp中查询
           方案3: 根据点击事件执行 fix 函数
           方案4: 每次都强制重新载入页面 (不推荐,渣优化)
@: 2018-8-28 03:11:45 add.







*/
$(document).ready(function(){

    // 搜藏内容
    let fixFavCont = $('#page-fav .fav-main .fav-video-list li');


    const iDiv = $('.breadcrumb');
    iDiv.append(`<p style="margin-left: 15px;font-size: 14px;color: #03A9F4;"><span style="cursor: pointer;" onclick="javascript:var fixFavCont=$('#page-fav .fav-main .fav-video-list li');if(fixFavCont.hasClass('small-item disabled')){fixFavCont.removeClass('disabled')};var getLostImg=$('#page-fav .fav-main .fav-video-list li img');var getLostTxt=$('#page-fav .fav-main .fav-video-list li a.title');for(var i=0;i<getLostImg.length;i++){if(getLostTxt[i].text=='已失效视频'){getLostTxt[i].style.cssText='color:#F00;line-height:13px;';getLostTxt[i].text=getLostImg[i].alt}};console.log('Bilibili 搜藏视频失效标题内容修复完毕! ---- by Heicks');">修复失效内容</p>`);

// 以下为初次刷新页面时的效果.
    if(fixFavCont.hasClass('small-item disabled')){
        fixFavCont.removeClass('disabled');
    }
    //搜藏内容的图片,里面有标题,要取出来
    var getLostImg = $('#page-fav .fav-main .fav-video-list li img');
    var getLostTxt = $('#page-fav .fav-main .fav-video-list li a.title');

    for(var i=0;i<getLostImg.length;i++){
        if(getLostTxt[i].text == '已失效视频' ){
            getLostTxt[i].style.cssText = "color:#F00;line-height:13px;";
            getLostTxt[i].text = getLostImg[i].alt;
        }
    };
    console.log('搜藏视频失效标题内容修复完毕! ---- by heicks');

});



