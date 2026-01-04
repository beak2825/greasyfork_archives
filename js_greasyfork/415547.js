// ==UserScript==
// @name         百度贴吧-宽版
// @namespace    http://tampermonkey.net/
// @version      2024-9-9
// @description  隐藏侧边栏，拓宽贴子的显示宽度，图片变得更清晰，贴吧链接不跳转直接打开，移动版页面自动跳转为PC版
// @author       AN drew
// @match        *://tieba.baidu.com/*
// @match        *://gsp0.baidu.com/*
// @match        *://jump.bdimg.com/safecheck/*
// @match        *://jump2.bdimg.com/safecheck/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415547/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7-%E5%AE%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/415547/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7-%E5%AE%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.tb_rich_poster .poster_success{left:334px!important} /*发表成功提示居中*/
.af_display_mask{ background: #009eff38} /*图片缩略图聚焦框显示为淡蓝色*/
.p_content img.BDE_Image.origin{ max-width: 810px!important; cursor:pointer!important;} /*图片变大*/
.media_bigpic img{ max-width: 800px!important; cursor:pointer!important;} /*图片变大*/
#ueditor_replace img.BDE_Image{width:auto!important; height:auto!important;}/*编辑区删除图片长宽限制*/
.core_title_theme_bright .core_title_txt{ width: 700px!important;} /*标题变长*/
.post_bubble_top, .post_bubble_middle, .post_bubble_bottom{ width:auto!important } /*拉宽回复气泡*/
/*帖子内容变宽*/
.replace_div{ width: 810px!important; height: auto!important;}
.replace_tip{display:none!important}
.right_section{display:none!important}
/*吧内首页变宽*/
#plat_recom_carousel{visibility:hidden!important}
#aside{display:none!important}
#content_leftList{background:white!important}
.enter_pb_wrapper{left:850px!important;margin-top:-32px!important}/*进入帖子按钮靠右*/
.tbui_aside_fbar_button.tbui_fbar_down{display:none!important}/*隐藏下载按钮*/
.j_poster_share.poster_share .j_use_share{margin-left: 0px;}/*图标对齐*/
.tb_rich_poster .poster_body .editor_bottom_panel{margin: 0 20px 0 0!important;}/*内容恢复提示对齐*/
.passMod_spin-coordinate{z-index:1!important}
/*个人主页变宽*/
.right_aside{display:none!important}
.ihome_body{border:1px solid #87BED9}
.ihome_nav_wrap{margin:0px}
.left_aside{background:white}
.n_right{background:white}
.new_list .n_post_time{margin-right:20px}
.n_right:hover{background-color: #f7f9fc;}
/*隐藏广告*/
#search_back_box{display:none!important}
.lu-search-box{display:none!important}
#search_fengchao{display:none!important}
#search_union_mod{display:none!important}
.af_head_gamelink{display:none!important}
#error_404_iframe{display:none!important}
.ifram-wrapper-gamen-ad{display:none!important}
.fengchao-wrap-feed{display:none!important}
.banner_theme{display:none!important}
.bus-top-activity-wrap{display:none!important}
#mediago-tb-first-floor{display:none!important}
[id*="mediago-tb-"]{display:none!important}
[class*="mediago-ad-"]{display:none!important}
.gift-goin{display:none!important}
#pc2client{display:none!important}
.tb_poster_placeholder{display:none!important}/*隐藏回复框会员特权提示*/
.emotion{background: transparent url(//tb2.bdstatic.com/tb/editor/images/default/fFace.png?t=20140529&t=1675423791162) no-repeat scroll left top;
    width: 30px;
    height: 30px;
    background-position: left -30px;
    }
`);

    //移动版页面自动跳转为PC版
    if(window.location.pathname.indexOf('/mo') > -1)
    {
        var reg = new RegExp('(^|&)' + 'tid' + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            window.location.href='https://tieba.baidu.com/p/'+r[2];
        }
    }

    if(window.location.href.indexOf('/photo/')>-1)
    {
        let right_fold=setInterval(function(){
            if($('.af_right_fold.right_close').length>0)
            {
                $('.af_right_fold').get(0).click();
                clearInterval(right_fold);
            }
        },100);
    }

    if(window.location.href.indexOf('jump.bdimg.com') > -1 || window.location.href.indexOf('jump2.bdimg.com') > -1)
    {
        window.location.href=$('.link').text();
    }

    let flag=0;

    setInterval(()=>{

        if(window.location.href.indexOf('/p/')!= -1) //帖子
        {
            //帖子内容变宽
            if(!$('.left_section').hasClass('wide'))
            {
                $('.left_section').width($('.pb_content').width());
                $('#j_core_title_wrap').width($('.pb_content').width()); //标题栏
                $('#j_p_postlist').width($('.pb_content').width()); //内容列表
                $('.left_section').addClass('wide');
            }

            $('.l_post_bright').each(function(){
                if(!$(this).hasClass('wide'))
                {
                    $(this).width($('.pb_content').width());
                    $(this).find('.d_post_content_main').width($('.pb_content').width() - 153);
                    $(this).find('.d_post_content_main .p_content').width($('.pb_content').width() - 173);
                    $(this).find('.core_reply_tail').width($('.pb_content').width() - 168);
                    $(this).find('.core_reply_wrapper').width($('.pb_content').width() - 168);
                    $(this).find('.core_reply_wrapper').width($('.pb_content').width() - 168);
                    $(this).find('.lzl_editor_container_s').width($('.pb_content').width() - 173);

                    if( $(this).find('.core_reply_wrapper').css('width')!=undefined  && parseInt( $(this).find('.core_reply_wrapper').css('width'))  >= 800)
                    {
                        $(this).addClass('wide');
                    }
                }
                //楼中楼回复框
                $(this).find('.edui-container').width($('.pb_content').width() - 203);
                $(this).find('.p_content .edui-editor-body').width($('.pb_content').width() - 203);
                $(this).find('.editor_for_container.editor_lzl_container').width($('.pb_content').width() - 203);
                $(this).find('.lzl_simple_wrapper').width($('.pb_content').width() - 203);
                $(this).find('.lzl_panel_wrapper').width($('.pb_content').width() - 203);
            })

            /*let furl=$('meta[furl]').attr('furl');*/
            /*let barname=furl.match(/(?<=kw=)(.*?)(?=&)/)[0];*/
            /*let barname=furl.substring(furl.lastIndexOf('?')+1, furl.lastIndexOf('&'));*/
            let barname=encodeURI($('meta[furl]').attr('fname'))
            let canonical=$('link[rel="canonical"]').attr('href');
            let tid=canonical.substring(canonical.lastIndexOf('/')+1);

            //图片变清晰
            $('.p_content img.BDE_Image').each(function(){
                if(!$(this).hasClass('origin'))
                {
                    let pic_src=$(this).attr('src');
                    let pic_id=pic_src.substring(pic_src.lastIndexOf('/')+1, pic_src.lastIndexOf('.'));
                    let pic_page="https://tieba.baidu.com/photo/p?kw="+barname+"&flux=1&tid="+tid+"&pic_id="+pic_id+"&pn=1&fp=2&see_lz=1";
                    let ts=$(this);

                    $.ajax({
                        url:pic_page,
                        method:'get',
                        success:function (res) {
                            let waterurl=res.substring(res.indexOf('waterurl')+11);
                            let origin_src=waterurl.substring(0, waterurl.indexOf('\",'));
                            if(origin_src!=undefined && origin_src!='')
                                ts.attr('src',origin_src);
                        }
                    })

                    $(this).removeAttr('width');
                    $(this).removeAttr('height');
                    $(this).removeAttr('style');
                    $(this).addClass('origin');
                    $(this).wrap('<a href="'+pic_page+'" target="_blank"></a>');
                }
            });

            //发表回复变宽
            $('.poster_head').width($('.pb_content').width() - 40);
            $('.old_style_wrapper').width($('.pb_content').width() - 70);
            $('.old_style_wrapper .edui-container').width($('.pb_content').width() - 70);
            $('.edui-toolbar').width($('.pb_content').width() - 70);
            $('.old_style_wrapper .edui-editor-body').width($('.pb_content').width() - 70);
            $('#ueditor_replace').width($('.old_style_wrapper .edui-editor-body').width() - 20);
            $('.poster_component').width($('.pb_content').width() - 40);

            if($('.tbui_aside_fbar_button tbui_fbar_props').length==0)
            {
                $('.tb_rich_poster').css('margin','0px');
                $('.editor_wrapper').css('margin-left','20px');
            }

            if(!$('title').hasClass('replace'))
            {
                let title=$('title').text();
                if(title.indexOf('[lbk]') > -1)
                    title=title.replace(/\[lbk\]/g, '[');
                if(title.indexOf('[rbk]') > -1)
                    title=title.replace(/\[rbk\]/g, ']');
                $('title').text(title);
                $('title').addClass('replace');
            }

            if(!$('.core_title_txt').hasClass('replace'))
            {
                let title=$('.core_title_txt').text();
                if(title.indexOf('[lbk]') > -1)
                    title=title.replace(/\[lbk\]/g, '[');
                if(title.indexOf('[rbk]') > -1)
                    title=title.replace(/\[rbk\]/g, ']');
                $('.core_title_txt').text(title);
                $('.core_title_txt').addClass('replace');
            }

            if(flag==0)
            {
                if($(".d_post_content").length>0)
                {
                    $($(".d_post_content").get(0).childNodes).filter(function() {
                        return this.nodeType === Node.TEXT_NODE;
                    }).each(function() {
                        let title=this.textContent
                        if(title.indexOf('[lbk]') > -1)
                            title=title.replace(/\[lbk\]/g, '[');
                        if(title.indexOf('[rbk]') > -1)
                            title=title.replace(/\[rbk\]/g, ']');
                        this.textContent=title;
                        flag=1;
                    });
                }
            }

        }
        else if(window.location.href.indexOf('/home/')!= -1) //个人主页
        {
            $('.content_wrap').width($('#container').width());
            $('.ihome_section').width($('#container').width()-23);
            $('.n_right').width($('#container').width()-40);
        }
        else if(window.location.href.indexOf('/search/')!= -1) //搜索结果页
        {
            setTimeout(function(){
                //图片变清晰
                $('.p_content img.BDE_Image').each(function(){
                    if(!$(this).hasClass('origin'))
                    {
                        let barname=encodeURI($(this).closest('.s_post').find('.p_forum .p_violet').text())
                        let tid=$(this).closest('.s_post').find('.p_title a').attr('data-tid');
                        let pic_src=$(this).attr('src');
                        let pic_id=pic_src.substring(pic_src.lastIndexOf('/')+1, pic_src.lastIndexOf('.'));
                        let pic_page="https://tieba.baidu.com/photo/p?kw="+barname+"&flux=1&tid="+tid+"&pic_id="+pic_id+"&pn=1&fp=2&see_lz=1";
                        let ts=$(this);

                        $.ajax({
                            url:pic_page,
                            method:'get',
                            success:function (res) {
                                let waterurl=res.substring(res.indexOf('waterurl')+11);
                                let origin_src=waterurl.substring(0, waterurl.indexOf('\",'));
                                if(origin_src!=undefined && origin_src!='')
                                    ts.attr('src',origin_src);
                            }
                        })

                        $(this).removeAttr('width');
                        $(this).removeAttr('height');
                        $(this).removeAttr('style');
                        $(this).addClass('origin');
                        $(this).wrap('<a href="'+pic_page+'" target="_blank"></a>');
                    }
                });
            },3000);
        }
        else //吧内首页
        {
            //吧内首页变宽
            $('#content_wrap').width($('.forum_content').width());

            //图片变大
            $('.media_disp').width($('.forum_content').width() - 120);

            setTimeout(function(){
                if($('.card_title_fname').length>0)
                {
                    let card_title_fname=$('.card_title_fname').attr('href');
                    /*let barname=card_title_fname.substring(card_title_fname.lastIndexOf('?')+1);*/
                    let barname=card_title_fname.match(/(?<=kw=)(.*?)(?=&)/)[0];

                    //图片变清晰
                    $('img.j_retract').each(function(){
                        if(!$(this).hasClass('origin'))
                        {
                            let tid=$(this).closest('li.j_thread_list').attr('data-tid');
                            let pic_src=$(this).attr('src');
                            let pic_id=pic_src.substring(pic_src.lastIndexOf('/')+1, pic_src.lastIndexOf('.'));
                            let pic_page="https://tieba.baidu.com/photo/p?kw="+barname+"&flux=1&tid="+tid+"&pic_id="+pic_id+"&pn=1&fp=2&see_lz=1";
                            let ts=$(this);

                            $.ajax({
                                url:pic_page,
                                method:'get',
                                success:function (res) {
                                    let waterurl=res.substring(res.indexOf('waterurl')+11);
                                    let origin_src=waterurl.substring(0, waterurl.indexOf('\",'));
                                    if(origin_src!=undefined)
                                        ts.attr('src',origin_src);
                                }
                            })

                            $(this).css('max-width', '875px;')
                            $(this).removeAttr('width');
                            $(this).removeAttr('height');
                            $(this).addClass('origin');
                            //$(this).wrap('<div>');
                        }
                    });
                }
            },3000);

            //发表回复变宽
            if( !$('html').hasClass('tb-ueditor-fullscreen')) //正常状态
            {
                $('.poster_head').width($('.forum_content').width() - 40);
                $('.j_title_wrap').width($('.forum_content').width() - 40);
                $('.editor_title').width($('.forum_content').width() - 130);
                $('.old_style_wrapper').width($('.forum_content').width() - 40);
                $('.old_style_wrapper .edui-container').width($('.forum_content').width() - 40);
                $('.edui-toolbar').width($('.forum_content').width() - 70);
                $('.edui-editor-body').width($('.forum_content').width() - 42);
                $('#ueditor_replace').width($('.old_style_wrapper .edui-editor-body').width() - 20);
            }
            else //全屏模式
            {
                $('.poster_head').removeAttr('style');
                $('.j_title_wrap').removeAttr('style');
                $('.editor_title').removeAttr('style');
                $('.old_style_wrapper').removeAttr('style');
                $('.old_style_wrapper .edui-container').removeAttr('style');
                $('.edui-toolbar').removeAttr('style');
                $('.edui-editor-body').removeAttr('style');
            }
        }

        $('.j_thread_list a.j_th_tit').each(function(){
            if(!$(this).hasClass('replace'))
            {
                let title=$(this).text();
                if(title.indexOf('[lbk]') > -1)
                    title=title.replace(/\[lbk\]/g, '[');
                if(title.indexOf('[rbk]') > -1)
                    title=title.replace(/\[rbk\]/g, ']');
                $(this).text(title);
                $(this).addClass('replace')
            }
        })

        $('.threadlist_abs.threadlist_abs_onlyline ').each(function(){
            if(!$(this).hasClass('replace'))
            {
                let title=$(this).text();
                if(title.indexOf('[lbk]') > -1)
                    title=title.replace(/\[lbk\]/g, '[');
                if(title.indexOf('[rbk]') > -1)
                    title=title.replace(/\[rbk\]/g, ']');
                $(this).text(title);
                $(this).addClass('replace')
            }
        })

        $('.feed_rich img').each(function(){
            if(!$(this).hasClass('done'))
            {
                let url=$(this).attr('url');
                if((url.indexOf('image_emoticon') > -1 || url.indexOf('i_f') > -1))
                {
                    url=url.substring(url.lastIndexOf('/'), url.indexOf('.png'));
                    let num = url.replace(/[^\d]/g, " ");
                    if(num<125)
                    {
                        $(this).hide();
                        $(this).attr('onerror'," ");
                        $(this).attr('src'," ");
                        let emotion=$('<div class="emotion" href="javascript:void(0)">&nbsp;</div>');
                        $(this).after(emotion);
                        if(num==66)
                        {
                            $(this).next().css('cssText','display:inline-block;background:url("https://gsp0.baidu.com/5aAHeD3nKhI2p27j8IqW0jdnxx1xbK/tb/editor/images/client/image_emoticon66.png");background-position: left 0px;');
                        }
                        else
                        {
                            $(this).next().css('cssText','display:inline-block;background-position: left '+(-30*(num-1))+'px;');
                        }
                    }
                }
                $(this).addClass('done');
            }
        })

        $('.ec-tuiguang').closest('.thread_item_box').hide();
        $('.ec-tuiguang').closest('.l_post').hide();

        $('div[id*=pagelet_live]').hide();

        $('.pull_right.label_text').closest('li').hide();
        $('.label_text').closest('.l_post').hide();
        $('.hover_btn').closest('.clearfix').hide();
    },500);

})();