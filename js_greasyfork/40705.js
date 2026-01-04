// ==UserScript==
// @name         Clean Reading
// @name:zh_CN   清爽阅读
// @namespace    http://www.lelins.com/
// @version      0.1.4
// @description  remove CSDN,stackoverflow,cnblogs,jb51.net elements you not like, such as advertisements.
// @description:zh_CN 轻松去除CSDN,statckoverflow,cnblog,jb51等网站上很乱的东西，让你更专注于阅读内容。支持把内容直接打印为PDF
// @author       lelins.com
// @match        https://blog.csdn.net/*
// @match        https://stackoverflow.com/questions/*
// @match        https://www.cnblogs.com/*
// @match        http://www.jb51.net/article/*
// @grant        none
//  2018-04-16 add Statckoverflow site
//  2018-04-17 add switch button you can hide or show the hidden elements
//  2018-04-18 add jb51.net site
// @downloadURL https://update.greasyfork.org/scripts/40705/Clean%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/40705/Clean%20Reading.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function css(id,styles){ try{ $('#'+id).css(styles);}catch(e){} try{ $(id).css(styles);}catch(e){}}
    function css_(id){ try{ $('#'+id).removeAttr('style');}catch(e){} try{ $(id).removeAttr('style');}catch(e){}}

     window.killJB51 = function(hideThem){
        if(hideThem){
            $('.main.mb10.clearfix,.topTools,.header,.wrap>.subnav,.fr.w300,#right-share,.xgcomm.clearfix,#footer,#comments,.jb51ewm,.art_xg,.w350.fr').hide();
            $('iframe').remove();
            setTimeout(function(){
                $('#BAIDU_DUP_fp_wrapper').hide();
                $('.w750.fl').css({width:'1080px'});
                $('#content,.jb51code').css({width:'1000px'});
            },300);
        }else{
            $('.main.mb10.clearfix,.topTools,.header,.wrap>.subnav,.fr.w300,#right-share,.xgcomm.clearfix,#footer,#comments,.jb51ewm,.art_xg,.w350.fr').show();
            css_('.w750.fl,#content,.jb51code');
        }
    };

    window.killCSDN = function(hideThem){
        if(hideThem){
            css('main',{ paddingLeft : 0, width: '97%',float : 'left'});
            css('article_content',{height:'auto'});
            $('#side,#navigator,#article_ad,.readall_box,.article_next_prev,aside').hide();
            setTimeout(function(){
                $('#share_box,.meau-gotop-box,.csdn-toolbar,.recommend_list,.comment_look_more,.pulllog-box,.comments').hide();
                css('comment_list',{height:'auto'});
                $('#layerd').remove();
                $('iframe').remove();
            },500);
        }else{
            css_('main');
            css_('article_content');
            $('#side,#navigator,#article_ad,.readall_box,.article_next_prev,aside').show();
            $('#share_box,.meau-gotop-box,.csdn-toolbar,.recommend_list,.comment_look_more,.pulllog-box,.comments').show();
            css_('comment_list');
        }
    };

    /* StatckOverflow 站点 */
    window.killStackoverflow = function (hideThem){
        if( hideThem ){
          $('#sidebar').hide();
          setTimeout(function(){
            $('#mainbar, .mainbar,.answer,.answers-header,#questions, #answers').css({'width':'97%'});
            $('.question-page #answers .answer').css({'border-top':'5px solid #ccc'});
            $('.everyonelovesstackoverflow').hide();
            $('footer,#dfp-mlb,.new-post-login,#post-form').hide();
            $('.bottom-notice,.hero-container,.post-text ~ div').hide();
            $('.answer .vote-count-post:contains("-")').each(function(){
                $(this).parents('.answer').hide();
            });
          },800);

        }else{
          $('#sidebar').show();
          css_('#mainbar, .mainbar,.answer,.answers-header,#questions, #answers');
          css_('.question-page #answers .answer');
          $('.everyonelovesstackoverflow').show();
          $('footer,#dfp-mlb,.new-post-login,#post-form').show();
          $('.bottom-notice,.hero-container,.post-text ~ div').show();
          $('.answer .vote-count-post:contains("-")').each(function(){
             $(this).parents('.answer').show();
          });
        }
    };

    window.killCNBlog = function(hideThem){
        if(hideThem){
            $('#leftcontent,#header,#comment_form,.footer,#blog_post_info_block,#mytopmenu').hide();
            $('#centercontent').css({width : '80%','padding-left':'10%'});
        }else{
            $('#leftcontent,#header,#comment_form,.footer,#blog_post_info_block,#mytopmenu').show();
            $('#centercontent').removeAttr('style');
        }
    };

    window.siteCfg = {};
    window.toggle = function(){
        var host = window.location.host;
        window.siteCfg[host] = !!!window.siteCfg[host];
        var hideThem = window.siteCfg[host];
        if( 'blog.csdn.net' == host){
            window.killCSDN(hideThem);
        }else if('stackoverflow.com' == host){
            window.killStackoverflow(hideThem);
        }else if('www.cnblogs.com' == host){
            window.killCNBlog(hideThem);
        }else if('www.jb51.net' == host){
            window.killJB51(hideThem);
        }
    };

    window.toggle();

    var html = "<style media=print type='text/css'>.noprint{visibility:hidden}</style><style type=text/css>.mui-switch{width:70px;height:31px;position:relative;border:1px solid #dfdfdf;background-color:#fdfdfd;box-shadow:#dfdfdf 0 0 0 0 inset;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-clip:content-box;display:inline-block;-webkit-appearance:none;user-select:none;outline:0}.mui-switch:before{content:'';width:29px;height:29px;position:absolute;top:0;left:0;border-radius:20px;border-top-left-radius:20px;border-top-right-radius:20px;border-bottom-left-radius:20px;border-bottom-right-radius:20px;background-color:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.4)}.mui-switch:checked{border-color:#64bd63;box-shadow:#64bd63 0 0 0 16px inset;background-color:#64bd63}.mui-switch:checked:before{left:39px}.mui-switch.mui-switch-animbg{transition:background-color ease .4s}.mui-switch.mui-switch-animbg:before{transition:left .3s}.mui-switch.mui-switch-animbg:checked{box-shadow:#dfdfdf 0 0 0 0 inset;background-color:#64bd63;transition:border-color .4s,background-color ease .4s}.mui-switch.mui-switch-animbg:checked:before{transition:left .3s}.mui-switch.mui-switch-anim{transition:border cubic-bezier(0,0,0,1) .4s,box-shadow cubic-bezier(0,0,0,1) .4s}.mui-switch.mui-switch-anim:before{transition:left .3s}.mui-switch.mui-switch-anim:checked{box-shadow:#64bd63 0 0 0 16px inset;background-color:#64bd63;transition:border ease .4s,box-shadow ease .4s,background-color ease 1.2s}.mui-switch.mui-switch-anim:checked:before{transition:left .3s}</style>";
    html+="<div style='position: fixed;left: 20px;top: 50px;width: 60px;height: 40px;'><input onclick=\"window.toggle()\"  class='noprint mui-switch mui-switch-anim' type='checkbox' checked></div>";
    $('body').append(html);
    // Your code here...background: ;

})();