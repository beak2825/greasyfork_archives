// ==UserScript==
// @name              视频新版_腾讯
// @name:en           Kill ADs and Watch VIP Videos
// @namespace         http://mofiter.com/
// @version           1.5
// @description       VIP视频新版_腾讯[内嵌版]
// @description:en    maybe it's the most similar VIP videos script to origin website
// @author            mofiter
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match             *://v.qq.com/x/*
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/394427/%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E8%85%BE%E8%AE%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/394427/%E8%A7%86%E9%A2%91%E6%96%B0%E7%89%88_%E8%85%BE%E8%AE%AF.meta.js
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
    if(location.href.indexOf(".qq.com") > -1){ //是否是指定网址
      
    var wytitle=$(document).attr('title');
      wytitle=wytitle.replace("_1080P在线观看平台", "");
      wytitle=wytitle.replace("_高清1080P在线观看平台", "");
      wytitle=wytitle.replace("_腾讯视频", "");
      wytitle=wytitle.replace("_综艺", "");
      wytitle=wytitle.replace("_电影", "");
      wytitle=wytitle.replace("-娱乐", "");
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
      wytitle=wytitle.replace("-综艺", "");
      $("title").html(wytitle);
      
      
    $(".mod_quick").remove();//删除VIP
    $(".btn_collect").remove();//删除加入看单
    $(".mod_scene_change").remove();//VIP广告
    $("#_vip_player_sec").remove();//开通VIP




    setTimeout(function () {//延迟2秒再执行
        $(".mod_ad").remove();//删除播放器右下角小广告
        $(".site_footer").remove();//删除网页底部
        $(".wrapper_side").remove();//删除网页右侧推荐
        $(".icon_refresh").parent().parent().parent().parent().parent().remove();//往上跳6级父元素 进行删除  删除下面的为你推荐
        $("#active_mod_viewstars").remove();//删除只看 谁的电影
        $(".txp_barrage_switch").siblings().remove();//删除弹幕外其经同级元素
        $(".action_wrap").remove();//删除字幕开关左边广告
        $(".txp_comment_hot").remove();//删除字幕左边的“热”
        $("#shortcut").remove();//删除浮动框

        //$(".txp_ad").parent().attr("class","txp_none");
        //$(".txp_ad").remove;//删除播放区域的广告视频
            //txp_none



     var linshizujian=$(".mod_episode").parent()//获取此元素的上一级 删除的是播放列表的推荐系列
    $(">div:nth-child(5)",linshizujian).remove();//获取此元素下的 div 第6个 子元素  并删除  不明所以 实际删除的是第5个
    $(">div:nth-child(4)",linshizujian).remove();//获取此元素下的 div 第5个 子元素  并删除  不明所以 实际删除的是第4个
    $(">div:nth-child(3)",linshizujian).remove();//获取此元素下的 div 第4个 子元素  并删除  不明所以 实际删除的是第3个

        linshizujian=$(".mod_row_box_casts").parent();//获取此元素的上一级 删除的是 主演以下的电影推广
    $(">div:nth-child(3)",linshizujian).remove();//获取此元素下的 div 第4个 子元素  并删除  不明所以 实际删除的是第3个


        //==========================给优酷原组件 添加弹出窗口VIP解析======================================
       var yuanlogo = $(".link_logo"); //根据类找到元素  取他的下一级元素
        yuanlogo.attr("target","view_window");//给字定组件斌值 (弹窗) 不过 优酷设置后  已无效
        yuanlogo.attr("href",jiexiurl05+location.href);   //修改原超链接地址为 解析视频地址

        $(".jiexianniu").css({"background":"#d0ad46","height":"28px","width":"64px","color":"#8ef263","font-size":"10px"});//给解析按钮 添加样式
        $(".txp_top_btns").remove(); //删除加入看单


      var zimubutton=$(".yk_dm_button");//找到弹窗按钮元素
      var mingzi=zimubutton.prop("className");//获取弹窗元素的class
      var zhaodaoweizhi=mingzi.indexOf("enable");//查找弹窗元素class里的enable

    if(zhaodaoweizhi > 0){//查找值 是否存在
      zimubutton.attr("id","tangchuzimushijian");//给按钮事件添加ID特征
      document.getElementById("tangchuzimushijian").click();//根据ID特征来执行页面跳转
     // alert("已经点击了");

    };//单击事件结束
    }, 3000);

        setInterval(()=>{//无限循环 间隔 500 毫秒
            $(".doki_btns").parent().remove();//删除 主演关注
            $(".tvip_layer").remove();//删除试看结束后的VIP提示
            $("#mask_layer").remove();//删除试看结束后的遮罩层
            $(".mod_vip_popup").remove();
          
        }, 500);



    //  var zimubutton=$("<div class='yk_dmswitch_box'><a href='javascript:;' class='yk_dm_button' data-btn='danmutoggle'><span class='dmicon'>弹</span></a></div>");
    //  $(".g-so").after(zimubutton);//在指定元素起始处 导入 zimubutton 变量内容



//==========================到指定文本中间内容段==================================================
        //var str1="aaa@hotmail.com";//要截取@到.之间的内容
        //var str2=str1.substring(str1.indexOf("@")+1,str1.indexOf(".")); 取文本 @ 至 . 之间的内容
        //alert(str1); //弹出对话框

//==========================给嵌入式播放 导入按钮=================================================
    var jiexibianliang = $("<span class='score drama-wrap text fn-shipin-jiexi-text' align='center'>&#160;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl01+"'>▶"+jiexiname01+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl02+"'>▶"+jiexiname02+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl03+"'>▶"+jiexiname03+"</button>&#12288;"+
                        "<button type='button' class='jiexianniu' value='"+jiexiurl04+"'>▶"+jiexiname04+"</button>"+
                        "");

    $(".panel_body_1").prepend(jiexibianliang);//在指定元素起始处 导入 jiexibianliang 变量内容
    $(".panel_body_1").prepend(jiexibianliang);//在指定元素起始处 导入 jiexibianliang 变量内容


    }


    $(".fn-shipin-jiexi-text").click(()=>{//按钮执行 fn-shipin-jiexi-text 事件
        var bfurl="";//实用前提前申请变量
        $(".jiexianniu").css("color","#8ef263");//所有解析按钮恢复默认色
        var dangqianniu=$(":focus");//获取当前焦点元素
        dangqianniu.css("color","#ff0000");//给焦点元素添上红色字体



    if(document.getElementById("iframe-player") == null){//判断是否已经加载过播放组件
    var ykPlayer = $("#tenvideo_player");//设置变量找到准备插入嵌入式播放位置
    bfurl= dangqianniu.attr("value")+ location.href//获取元素 value值 并加上 当前网址链接
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
       dangqianniu.css("color","#ff0000");//给焦点元素添上红色字体
       //alert('再次点击1');//弹出对话框
   }

});//单击事件结束


})();
