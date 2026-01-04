// ==UserScript==
// @name              VIP视频新版_爱奇艺
// @name:en           Kill ADs and Watch VIP Videos
// @namespace         http://mofiter.com/
// @version           1.6
// @description       VIP视频新版_爱奇艺[内嵌版]
// @description:en    maybe it's the most similar VIP videos script to origin website
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://www.iqiyi.com/*
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/394426/VIP%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E7%88%B1%E5%A5%87%E8%89%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394426/VIP%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E7%88%B1%E5%A5%87%E8%89%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jiexiname01="8090"
    var jiexiurl01="https://www.8090g.cn/?url=";//原链接"https://api.bbbbbb.me/jx/?url=";
    var jiexiname02="菜鸟"
    var jiexiurl02="https://jiexi.bm6ig.cn/?url=";
    var jiexiname03="1717"
    var jiexiurl03="https://www.1717yun.com/jx/ty.php?url=";
    var jiexiname04="二度"
    var jiexiurl04="http://jx.du2.cc/?url=";
    var jiexiname05="稳定"
    var jiexiurl05="http://jx.598110.com/?url=";
  
    //==========================判断是否为指定网站==================================================
    if(location.href.indexOf(".iqiyi.com") > -1){ //是否是指定网址
      var wytitle=$(document).attr('title');
      wytitle=wytitle.replace("_1080P在线观看平台", "");
      wytitle=wytitle.replace("_高清1080P在线观看平台", "");
      wytitle=wytitle.replace("_腾讯视频", "");
      wytitle=wytitle.replace("_综艺", "");
      wytitle=wytitle.replace("_电影", "");
      wytitle=wytitle.replace("-爱奇艺", "");
      wytitle=wytitle.replace("-资讯", "");
      wytitle=wytitle.replace("-搜索最新资讯", "");
      wytitle=wytitle.replace("-完整版视频在线观看", "");
      wytitle=wytitle.replace("-综艺节目", "");
      wytitle=wytitle.replace("-电影", "");
      wytitle=wytitle.replace("-电视剧全集", "");
      wytitle=wytitle.replace("-电视剧", "");
      wytitle=wytitle.replace("-儿童", "");
      wytitle=wytitle.replace("-动画片大全儿童教育", "");
      wytitle=wytitle.replace("-高清完整正版视频在线观看", "");
      wytitle=wytitle.replace("-优酷", "");
      wytitle=wytitle.replace("-动漫", "");
      wytitle=wytitle.replace("-娱乐", "");
      wytitle=wytitle.replace("-综艺", "");
      $("title").html(wytitle);
      
        setTimeout(function(){//定时执行事件
             $(".qy-header-side").remove();//屏蔽会员登陆

            $(".qy-play-list").siblings().remove();//屏蔽除播放列表外所有同级
            $(".barrage-switch-wrap").siblings().remove();//屏蔽除弹出字幕外所有同级
            $(".qy-flash-func").remove();//屏蔽赞 分享块
            $(".qy-player-side-op").remove();//屏蔽 新客专享！ 特效按钮
            

            $(".qy-player-side-vip").remove();//屏蔽会员推广
            $(".widget-movie-moviesound").remove();//屏蔽影视原声
            $("#widget-movie-newtidbits").remove();//屏蔽相关片断
            $("#widget-videorezebra").remove();//屏蔽相关视频
            $(".vpro-banner").remove();//屏蔽右边浮窗活动
            $(".qy-icon-btn-collect").remove();//屏蔽影片名旁收藏
            $(".detail-sd").remove();//屏蔽PC端下载位
            $(".qy-scroll-anchor").remove();//屏蔽右边浮窗登陆
            $("#block-I").remove();//屏蔽下边评论
            $("#block-AR").remove();//屏蔽下顶底部
            $("#block-K").remove();//屏蔽右边排行榜
            $("#block-G").remove();//屏蔽猜我喜欢
            $(".iqp-integral-inner").remove();//屏蔽达成任务框



            var yuanlogo=$(".logo-link-nonIndex");//找到指定组件
            yuanlogo.attr("target","view_window");//给字定组件斌值 (弹窗)
            yuanlogo.attr("href",jiexiurl05+location.href);   //修改原超链接地址为 解析视频地址



            //==========================给爱奇艺原组件 添加弹出窗口VIP解析======================================
        var jiexibianliang = $("<span class='score drama-wrap text fn-shipin-jiexi-text' align='center'>&#160;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl01+"'>▶"+jiexiname01+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl02+"'>▶"+jiexiname02+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl03+"'>▶"+jiexiname03+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl04+"'>▶"+jiexiname04+"</button>"+
                        "");
        $(".qy-player-side-head").prepend(jiexibianliang);//在指定元素起始处 导入 jiexibianliang 变量内容
        $(".qy-player-side-head").prepend(jiexibianliang);//在指定元素起始处 导入 jiexibianliang 变量内容

            $(".jiexianniu").css({"background":"#d0ad46","height":"28px","width":"64px","color":"#8ef263","font-size":"10px"});//给解析按钮 添加样式


        $(".fn-shipin-jiexi-text").click(()=>{//按钮执行 fn-shipin-jiexi-text 事件
        var bfurl="";//实用前提前申请变量
        $(".jiexianniu").css("color","#8ef263");//所有解析按钮恢复默认色
        var dangqianniu=$(":focus");//获取当前焦点元素
       dangqianniu.css("color","#ff0000");//给焦点元素添上红色字体



    if(document.getElementById("iframe-player") == null){//判断是否已经加载过播放组件

    var ykPlayer = $("#flashbox");//设置变量找到准备插入嵌入式播放位置
    bfurl= $(":focus").attr("value")+ location.href//获取当前元素并取 value 值 并加上 当前网址链接
    var videoPlayer = $("<div id='iframe-div' style='width:100%;height:100%;z-index:2147483647;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%' src='"+bfurl+location.href+"'></iframe></div>"); //播放器代码
          ykPlayer.empty(); //移除准备嵌入播放器位置原有子元素及信息
    ykPlayer.append(videoPlayer);//嵌入位置导入播放代码
    $("#module_basic_player").css("height","100%");
    var player = $("#player");//设置变量找到准备插入嵌入式播放位置
    player.css("height","100%");//设置准备嵌入位置的高度百分百展示
    player.empty();//移除准备嵌入播放器位置原有子元素及信息
    player.append(videoPlayer);//嵌入位置导入播放代码

   } else {

    bfurl= $(":focus").attr("value")+ location.href//获取当前元素并取 value 值 并加上 当前网址链接
    $("#iframe-player").attr("src",bfurl);//将有效播放URL 斌值给已经加载过的 iframe-player 变量上

       //alert($(window.parent.document).find("#iframe-player").attr("src"));
       //alert('再次点击1');//弹出对话框
   }

});//单击事件结束


            },3500);//如果时间少于3秒  相关视频等后期加载的则不能屏蔽掉
     }
})();