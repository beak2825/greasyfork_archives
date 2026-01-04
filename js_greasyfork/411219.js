// ==UserScript==
// @name         软件下载站页面净化
// @name:zh      软件下载站页面净化
// @name:zh-CN   软件下载站页面净化
// @version      1.0.0
// @description  清理某些下载站的广告和烦人的推荐，以及恶心人的高速捆绑下载按钮，目前支持：绿色先锋,西西,华军,下载吧,太平洋下载站,东坡下载,多特,pc6
// @author       CoolBreeze
// @namespace    CoolBreeze.DownAdAway
// @match        *://www.greenxf.com/*
// @match        *://www.cr173.com/soft/*
// @match        *://www.onlinedown.net/*
// @match        *://www.xiazaiba.com/html/*
// @match        *://dl.pconline.com.cn/*
// @match        *://www.uzzf.com/soft/*
// @match        *://www.duote.com/*
// @match        *://www.pc6.com/*
// @match        *://www.pcsoft.com.cn/soft/*
//上面这一个链接是PC下载站的，我还没抽空写。
// @grant        none


// @note 2020/9/11 第一个版本，有BUG请反馈。

// @downloadURL https://update.greasyfork.org/scripts/411219/%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/411219/%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var getCurDomain = function() {
        return document.domain.toLowerCase();
          //return document.domain.split('.').slice(-2).join('.').toLowerCase();
      };//取当前顶级域名

    var _CurDomain=getCurDomain();
    console.log("当前域名:"+_CurDomain);


    switch(_CurDomain)
    {
        case "www.greenxf.com"://绿色先锋

                $("iframe").remove();//清除内嵌推广
                $("#BAIDU_DUP_fp_wrapper").remove();

                //介绍部分
                $(".downLoadSel").remove();//软件介绍左侧的推广
                $(".relSoft-box").remove();//介绍右侧的相关软件
                $("#baiduShare").remove();//百度的分享
                $(".downShow-type").remove();//高速下载按钮
                $("#comp-praise-box").remove();//点赞点踩

                //说明部分
                $(".softInfo-right").remove();//右侧的热门推荐
                $(".softInfo-tab").remove();//中间导航按钮
                $(".softInfo-left").css({"float":"","width":"1200px"});
                $(".att-inner").css({"float":"","width":"1200px"});//重新分布去除右侧栏后的宽度

                //下载部分
                $(".dt").html("下载地址");
                $("#speed-downloader").remove();//高速捆绑下载
                $("li[class='tra3']").attr("style","background: url('http://cdn.02wq.com/image/zhongguan/dx11.png'); border-radius: 0px; width: 160px; height: 34px; border: none; box-shadow: none;");
                $(".downloader-list li a").css({"color":"white"});//重新分配下载按钮的样式

                //页面下方
                $("#showDownlad-relNews").remove();//相关软件
                $("#showDownlad-like").remove();//猜你喜欢
                $("#showDownlad-comment").remove();//网友评论

                //右侧标签导航栏
                $("#autoTab").remove();
                $("#goTop").remove()//返回顶部


                $(".tra3 a[onclick]").attr("onclick","");//清除下载后的猜你喜欢*/
            break;

        case "www.cr173.com"://西西

            $(".c_soft_pic.m-soft-ad").remove();//右侧广告
            $("#full_downad").remove();//下载链接右侧的推广
            $(".m-bdtn.downnowgaosu").remove();//高速下载按钮
            $(".c_soft_same.m-soft-relat").remove();//右侧相关软件
            $(".c_soft_button").remove();//点赞点踩
            $(".c_info_side").remove();
            $(".screenshots.c_box").remove();

            //本类软件分类
            $("#xiangua").remove();//下载上方相关
            $("#comment_list").remove();//评论区
            $(".f-gsh3").remove();
            $(".address_like.downurl").remove();//高速下载链接
            $(".m-key-float").remove();
            $(".affix").remove();//悬浮导航栏
            $("iframe").remove();//内嵌广告
            $("#c_des_content").css({"width":"1240px"});//重新分布宽度
            break;

        case "www.onlinedown.net"://华军

            //顶部
            $(".hotSearch.cGrey").remove();//顶部热词
            $(".ppShow.clearfix").remove();//顶部流氓
            $(".clo").remove();//今日热点

            //软件详情
            $(".relateSoft").remove();//相关软件
            $(".mdetailQcode").remove();//手机版二维码
            $(".syzs1").remove();//手游助手广告
            $(".downdecailHeads").remove();//下载按钮下方导航
            $(".right").remove();//右侧栏推荐
            $("#autotab").remove();//纵向导航栏
            $(".downdecailHeads.fixed").remove();//顶部栏
            $(".xgshach").remove();//相关搜索
            $("tabList").remove();//详情下方导航
            $(".left").css({"width":"1038px"});//重新排布详情宽度

            //下载地址
            $(".godown").remove();//悬浮的下载地址按钮
            $(".onedownbtn2").remove();//高速下载按钮
            $(".downtu").remove();//恶意引流到垃圾下载器的图
            $(".downgs.downgsPc.qrcode_show.clearfix").remove();//垃圾高速下载
            $(".downDz h4:first").remove();//高速下载地址标题
            $(".downDz ul:first").remove();//高速下载地址

            //地址下方乱七八糟的那一坨
            $("#ItemXGJC").remove();//相关教程
            $(".downdecailItemSSZT").remove();//所属专题
            $(".downdecailItemWYPL").remove();//网友评论
            $(".downdecailItemCNXH").remove();//猜你喜欢

            //底部
            $(".Friendlink").remove();//友情链接
            $(".partner").remove();//合作伙伴

            $(".ad").remove();
            $("iframe").remove();//内嵌广告
            break;

        case "www.xiazaiba.com"://下载吧，因为主页样式用的跟下载页面一样的样式会导致过滤后页面异常，只过滤下载页面,但不得不说下载吧相对来说下载页面还算挺干净了。。

            $(".search-adv").remove();//搜索右侧广告
            $(".search-keys").remove();//搜索热词
            $(".wt300.rf").remove();//右侧那一堆乱七八糟的排行榜
            $(".soft-img.rf").remove();//预览的小图
            $("div.soft-down")[1].remove();//高速下载按钮
            $(".wt900,.xzinfo,.soft-ess,.boxMod").css({"width":"1200px"});//重新分布去除右侧栏后的宽度
            $(".needfast").remove();//需要高速下载器的提示
            $(".sdown-btns").addClass("down-group");//让普通下载按钮变高速下载按钮样式
            $(".sdown-item")[0].remove();//移除高速下载的分组
            $(".soft-interest,.course-relate").parent().remove();//感兴趣的软件和教程
            break;

        case "dl.pconline.com.cn"://太平洋

            $(".nav-glo.clearfix").remove();//顶部不相关的导航栏
            $(".mark-sub")[1].remove();//行业相关资讯
            $("#Jnavi").remove();//悬浮导航
            $(".ivy-tl1").remove();//顶部横幅
            $(".link.fc-gray").remove();//搜索热词
            $(".nav-wrap-r").remove();//导航栏下方推广
            $(".report-box").remove();//分享,点赞点踩的盒子
            $(".publish-area").remove();//上传者和上传按钮
            $(".col-c").remove();//右侧相关
            $(".col-ab").css({"width":"100%"});//重新分配宽度
            $("#JhsBtn").remove();//高速下载按钮
            $("#rela-subject").remove();//相关主题
            $("#rela-arts").remove();//相关文章
            $(".ivy-pair").remove();//广告位
            $("#rela-cmt").remove();//相关评论
            $(".rela-new").remove();//软件速递
            $(".rela-best").remove();//聚超值推广
            $(".sc-2").remove();//推广内容
            $(".sc-last").remove();//友情链接
            $(window).scroll(function(){$("#bzFixBottom").remove();})//底部恶心的诱导悬浮栏,应该是scroll事件里动态创建的，所以覆盖scroll事件

            //正式下载页
            $(".block-jcz").remove();//聚超值推广
            $(".soft-rel").remove();//乱七八糟的推荐
            $(".ivy").remove();//ivy广告
            $(".tab-nav").remove();//游戏推送
            $(".box-tags").remove();//软件速递
            $(".bzxz").remove();//高速下载_1
            $(".bzxz2").remove();//高速下载_2
            $(".sub").html("下载地址:");
            $(".btn-gray").css({"background":"orange","color":"white"});//重新渲染真实下载地址
            break;

        case "www.uzzf.com"://东坡下载
            $(".m-search p").remove();//搜索热词
            $(".m-topnav").remove();//导航栏下方推广
            $(".m-resoft").remove();//右侧广告
            $(".m-xx-right").remove();//右侧相关
            $(".m-xx").css({"width":"1170px"});//重新分配宽度
            $(".f-uzzf-down").remove();//高速下载按钮
            $(".download").addClass("f-uzzf-down");//重新设置下载按钮样式
            $(".m-vote").remove();//点赞点踩
            $("#jies").remove();//下方导航
            $(".m-center-r").remove();//右侧推广
            $(".back-top").remove();//回到顶部
            $(".address_r").remove();///下载地址右侧广告
            $(".ul_Address h3:first").remove();//高速下载的文本提示
            $(".topdown").remove();//高速下载地址
            $(".ul_Address li").attr("class","f-uzzf-link");//重新渲染下载地址样式
            $("#pl").remove();//评论
            $(".m-related").remove();//必备软件
            $(".cbox[id]").remove();//扩展阅读和同类软件
            break;

        case "www.duote.com"://多特，也就是2345

            $("#hengfu").remove();//2345毒瘤浏览器的推荐横幅
            $(".serch_hot").remove();//热词
            $(".pic-bannerA").remove();//横幅广告
            $(".links-banner").remove();//百度推广

            $(".fast-down-btn").remove();//高速下载按钮
            $(".relateSoft").remove();//相关推荐
            $(".soft-type").remove();//点赞点踩
            $(".dl-banner").remove();//详情下方的横幅广告
            $(".main-right-box").remove();//右侧排行
            $(".main-left-box").css("width","1200px");//重新分配左侧宽度
            $("iframe").remove();//软件截图下方的广告
            $("#same-soft").remove();//同类软件
            $(".adBox,.down-ad").remove();//下载地址右侧的广告
            $("#ntc").remove();//ip地址标签
            $("#net-cmt").remove();//网友评论
            $(".footer .box").remove();//友情链接
            $(".mask").remove();//弹窗蒙层
            $(".msgbox-wrap").remove();//弹窗
            //吐槽：2345这个毒瘤居然下载地址还没有像其他那种一连串的高速捆绑下载器，真是令人意外
            break;

        case "www.pc6.com"://pc6

            $(".bdcs-hot").remove();//热词
            $("#bdfx").remove();//分享
            $("#dingandcai").hide();//点赞点踩,只能选择隐藏，否则软件评会永远转圈圈
            $(".ad").remove();//软件详情信息右侧排行
            $("#sidebar").remove();//右侧
            $("#content").css("width","1200px");//重新分配左侧宽度
            $(".downnow").remove();//高速下载按钮
            $("#xzbtn .bendown").attr("class","downnow");//重新设置下载按钮样式
            $(".zban").remove();//软件下方的导航条
            $("#xgk").remove();//相关软件
            $("#autotab").remove();//右侧纵向导航栏
            $(".ul_Address h3").remove();//高速下载标题
            $("#gaosuxiazai").remove();//高速下载链接
            $(".ad-download").remove();//下载右侧广告
            $("#xgd,#xgw,#comment-wrap,#reci").remove();//人气软件,相关文章和网友评论,热门关键词
            break;

        //case "www.pcsoft.com.cn"://pc下载，抽空写。。




    }
})();