// ==UserScript==
// @name         微博去除推荐内容
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  登录框居中显示，去除侧边栏推荐内容，自动展开微博全文
// @author       AN drew
// @match        *://*.weibo.com/*
// @match        *://*.weibo.cn/*
// @exclude      *://api.weibo.com/chat*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407563/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/407563/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E9%99%A4%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var change=0;
    if(change==1)
    {
        if(window.location.href.indexOf("https://weibo.com/u/")!=-1)
        {
            let uid = window.location.pathname.substring(window.location.pathname.indexOf("/u/")+3);
            let phoneUrl="https://m.weibo.cn/u/"+uid;
            window.location.href=phoneUrl;
        }
    }
    else if(change==2)
    {
        if(window.location.href.indexOf("/profile/")!=-1)
        {
            let uid = window.location.pathname.substring(window.location.pathname.indexOf("/profile/")+9);
            let PCUrl="https://weibo.com/u/"+uid;
            window.location.href=PCUrl;
        }
        else if(window.location.href.indexOf("https://weibo.cn/u/")!=-1 || window.location.href.indexOf("https://m.weibo.cn/u/")!=-1)
        {
            let uid = window.location.pathname.substring(window.location.pathname.indexOf("/u/")+3);
            let PCUrl="https://weibo.com/u/"+uid;
            window.location.href=PCUrl;
        }
    }


    if($('body').hasClass('FRAME_login') )  //&& (window.location.href=="https://weibo.com/" || window.location.href.indexOf("https://weibo.com/#_loginLayer")!= -1 || window.location.href.indexOf("https://weibo.com/login.php")!= -1 || window.location.href.indexOf("weibo.com/?topnav=1&mod=logo")!= -1 ))
    {
        var login_style= 'html, body{'+
            '    height:100%;'+
            '    overflow-y:hidden;'+
            '    background:linear-gradient(to bottom, rgb(255,232,168) , rgb(255,210,55))!important;'+
            '}'+
            '.WB_frame_c{'+
            'display:none!important;'+
            '}'+
            '.WB_main_l{'+
            'display:none!important;'+
            '}'+
            '#pl_unlogin_home_hots{'+
            'display:none!important;'+
            '}'+
            '#pl_unlogin_home_hotpersoncategory{'+
            'display:none!important;'+
            '}'+
            '#pl_unlogin_home_dmca{'+
            'display:none!important;'+
            '}'+
            '.WB_footer.S_bg2{'+
            'display:none!important;'+
            '}'+
            '#v6_pl_base{'+
            'display:none!important;'+
            '}'+
            '.W_gotop.S_ficon_bg{'+
            'display:none!important;'+
            '}'+
            '.UG_box{'+
            '    background:linear-gradient(to bottom, rgb(255,227,144) , rgb(255,215,80))!important;'+
            '}'+
            '#pl_unlogin_home_login{position:fixed;'+
            '    top:calc(50% - 163px);'+
            '    left:calc(50% - 170px);'+
            '    height:346px;'+
            '    width:340px;'+
            '    margin:0px auto;}';

        $('head').append('<style>'+login_style+'</style>');
    }



    var timer = setInterval(function(){
        $(".wbpv-star-theatre-control.wbpv-control.wbpv-button").click(function(){
            $(".PlayInfo_boxout_3UBS0").toggleClass("theatre");
            $(".Detail_wrap_IZQWz").toggleClass("hide");
            $(".Frame_side2_xRwuq").toggleClass("hide");
            clearInterval(timer);
        })
    })


    setInterval(function(){

        //新版微博
        //隐藏可能感兴趣的人
        $('[curcarddata="[object Object]"]').hide();

        //隐藏个人主页的关注推荐
        $(".wbpro-side-tit.woo-box-flex.woo-box-alignCenter").each(function(){
            if($(this).text().indexOf("关注推荐")!= -1)
            {
                $(this).closest(".wbpro-side-main").hide();
            }
        })

        //隐藏赞过,你常看的优质博主
        $('.title_title_1DVuO').each(function(){
            if($(this).text().indexOf("赞过")> -1 || $(this).text().indexOf("你常看的优质博主")> -1)
            {
                $(this).closest(".vue-recycle-scroller__item-view").hide();
            }
        })

        //隐藏超话推荐微博
        $('.head_suffixbox_1PPjD').each(function(){
            if($(this).text().indexOf("超话")> -1)
            {
                $(this).closest(".vue-recycle-scroller__item-view").hide();
            }
        })

        //隐藏粉丝头条
        $('.vue-recycle-scroller__item-view').each(function(){
            if(!$(this).hasClass('hide'))
            {
                if($(this).find('.woo-font.woo-font--cross').length>0)
                {
                    $(this).hide();
                    $(this).addClass('hide');
                }
            }
        });

        //隐藏热搜广告
        $('.wbpro-side-panel').each(function(){
            if($(this).find('.wbpro-icon-doticon').length>0)
            {
                $(this).hide();
            }
        });


        //隐藏视频弹出框的推荐视频
        if($(".woo-switch-shadow").length>0 && $(".woo-switch-shadow").hasClass("woo-switch-checked"))
        {
            $(".woo-switch-shadow").click();
        }
        $(".wbpv-next-video-wrap").hide();
        $(".woo-tab-item-main.Index_tabitem_17MDI[title='相关视频']").hide();

        if( $(".woo-tab-item-main.Index_tabitem_17MDI[title='热门评论']").length>0 && !$(".woo-tab-item-main.Index_tabitem_17MDI[title='热门评论']").hasClass("unfold") )
        {
            $(".woo-tab-item-main.Index_tabitem_17MDI[title='热门评论'] div").click();
            $(".woo-tab-item-main.Index_tabitem_17MDI[title='热门评论']").addClass("unfold");
        }

        //微博文章自动展开
        $('.WB_editor_iframe_new').attr('style','opacity: 1; zoom: 1;');
        $('.btn_line.W_tc.W_f14.W_fb').hide();
        /*
        //首页展开全文
        $('.Feed_body_3R0rO').each(function(){
            if(!$(this).hasClass("unfold"))
            {
                if($(this).find('.expand').length>0)
                {
                    $(this).find('.expand').removeAttr("href");
                    $(this).find('.expand').click();
                    let t = $(this);
                    setTimeout(function(){
                        if(t.find('.collapse').length>0)
                        {
                            t.addClass("unfold");
                        }
                    },500)
                }
                else
                {
                    $(this).addClass("unfold");
                }
            }
        })
*/

        //转发内嵌的原微博展开全文
        $('.Feed_retweet_JqZJb').each(function(){
            if(!$(this).hasClass("unfold"))
            {
                if($(this).find('.expand').length>0)
                {
                    $(this).find('.expand').removeAttr("href");
                    $(this).find('.expand').click();
                    let t = $(this);
                    setTimeout(function(){
                        if(t.find('.collapse').length>0)
                        {
                            t.addClass("unfold");
                        }
                    },1000)
                }
                else
                {
                    $(this).addClass("unfold");
                }
            }
        })

        //----------------------------------------------------------------------------

        //旧版微博
        //首页展开全文
        $('.WB_feed_detail').each(function(){
            if(!$(this).hasClass("unfold"))
            {
                if($(this).find('[node-type="feed_list_content"] .WB_text_opt[action-type="fl_unfold"]').length>0)
                {
                    $(this).find('[node-type="feed_list_content"] .WB_text_opt[action-type="fl_unfold"]').removeAttr("href");
                    $(this).find('[node-type="feed_list_content"] .WB_text_opt[action-type="fl_unfold"]').get(0).click();
                    let t = $(this);
                    setTimeout(function(){
                        if(t.find('[node-type="feed_list_content_full"]').length>0)
                        {
                            t.addClass("unfold");
                        }
                    },800)
                }
                else
                {
                    $(this).addClass("unfold");
                }
            }
        })

        //转发内嵌的原微博展开全文
        $('.WB_feed_expand').each(function(){
            if(!$(this).hasClass("unfold"))
            {
                if($(this).find('[node-type="feed_list_reason"] .WB_text_opt[action-type="fl_unfold"]').length>0)
                {
                    $(this).find('[node-type="feed_list_reason"] .WB_text_opt[action-type="fl_unfold"]').removeAttr("href");
                    $(this).find('[node-type="feed_list_reason"] .WB_text_opt[action-type="fl_unfold"]').get(0).click();
                    let t = $(this);
                    setTimeout(function(){
                        if(t.find('[node-type="feed_list_reason_full"]').length>0)
                        {
                            t.addClass("unfold");
                        }
                    },800)
                }
                else
                {
                    $(this).addClass("unfold");
                }
            }
        })

        //搜索结果页展开全文
        $('.card-feed').each(function(){
            if(!$(this).hasClass("unfold"))
            {
                if($(this).find('a[action-type="fl_unfold"]').length>0)
                {
                    $(this).find('a[action-type="fl_unfold"]').removeAttr("href");
                    $(this).find('a[action-type="fl_unfold"]').get(0).click();
                    let t = $(this);
                    setTimeout(function(){
                        if(t.find('[node-type="feed_list_content_full"]').length>0)
                        {
                            t.addClass("unfold");
                        }
                    },800)
                }
                else
                {
                    $(this).addClass("unfold");
                }
            }
        })

        if(window.location.href.indexOf("d.weibo.com")!=-1) //发现页
        {
            //发现页展开全文
            $(".content").each(function(){
                if(!$(this).hasClass("unfold"))
                {
                    $(this).addClass("unfold");
                    $(this).find(".txt:nth-of-type(1)").hide();
                    $(this).find(".txt:nth-of-type(2)").show();
                }
            })

            //发现页的话题显示全部文字
            $(".pt_li.S_line2").each(function(){
                if($(this).find(".info_box .S_txt1").text() != $(this).find(".pic_box .pic").attr("alt") )
                {
                    $(this).find(".info_box .S_txt1").text($(this).find(".pic_box .pic").attr("alt"));
                }
            })
        }

        $("h4.title").each(function(){
            if($(this).text().indexOf("广告") >-1)
            {
                $(this).parent().parent().parent().hide();
            }
        })
        $(".W_layer.W_translateZ").each(function(){
            if($(this).text().indexOf("网络繁忙")>-1)
            {
                $(this).hide();
                $(".outer").hide()
            }
        })

        //单条微博评价页居中
        if(!isNaN(parseInt(window.location.pathname.substr(1,10))) && window.location.href.indexOf("d.weibo.com")==-1) //非发现页
        {
            $(".WB_frame").attr("style","display:table; margin:0 auto;");
            $(".WB_frame_c").attr("style","display:table; margin:0 auto;");
            $(".WB_frame_b").hide();
        }


        if(window.location.href.indexOf("d.weibo.com")!=-1) //发现页
        {
            $("#plc_discover").width($("#plc_main").width())
            $(".WB_tab_a .tab_box").attr("style","background: white");
        }
        else
            $("#plc_discover").attr("style","display:table; margin:0 auto;");

        $(".pt_ul.clearfix").width("845px")

        $(".key").hide();
        $(".Slide_show_3dpDk").parent().hide();
        $(".PCD_feed").parent().parent().hide();
        $("#v6_pl_rightmod_hongbao").hide();
        $("#v6_pl_rightmod_rank").hide();
        $("#v6_pl_rightmod_recominfo").hide();
        $("#v6_pl_rightmod_ads36").hide();
        $("#v6_pl_rightmod_attfeed").hide();
        $("#v6_trustPagelet_recom_member").hide();
        $("#v6_pl_rightmod_noticeboard").hide();
        $("#v6_pl_ad_bigday").hide();
        $("#v6_pl_ad_forfqy").hide();
        $("#Pl_Discover_TextList__4").hide();
        $('[node-type="follow_recommend_box"]').hide();
        $('[node-type="recommend"]').hide();
        $('li[node-type="recom_tab"]').hide();
        $(".WB_empty").hide();
        $('.wbpro-side-copy').hide();
        $('[class*="TipsAd"]').hide();
        //$('[style*="z-index: 9999;"]').hide();

        if($('div[node-type="info_unfold"]').length>0 && $('div[node-type="info_unfold"]').css("display")!="none" && !$('div[node-type="info_unfold"]').hasClass("unfold"))
        {
            console.log($('div[node-type="info_unfold"]').css("display"))
            $('div[node-type="info_unfold"]').addClass("unfold");
            $('div[node-type="info_unfold"]').find("a").get(0).click();
        }
        if(!$('li[node-type="comment_tab"]').hasClass("curr"))
        {
            $('li[node-type="comment_tab"]').click();
        }
    },100);
})();