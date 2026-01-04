// ==UserScript==
// @name         360doc个人图书馆优化
// @namespace    http://tampermonkey.net/
// @version      0.4.4.2
// @description  解除复制限制，隐藏广告，隐藏打赏提示，点击全屏按钮后隐藏登录框，非可信域名链接直接打开，自动展开全文，显示打印按钮，显示转word按钮
// @author       AN drew
// @match        *://www.360doc.com/*
// @exclude      *://www.360doc.com/reader/*
// @match        *://www.360doc.cn/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423686/360doc%E4%B8%AA%E4%BA%BA%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/423686/360doc%E4%B8%AA%E4%BA%BA%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //解除复制限制来自https://greasyfork.org/zh-CN/scripts/12591
    document.body.oncopy=null; //去掉当前设置的复制监听
    document.body.__defineSetter__ && document.body.__defineSetter__("oncopy",function(){}); //禁止修改复制监听

    Object.defineProperty(document.body, 'oncopy', {
        set : function(){}
    })
    Object.defineProperties(document.body, {
        'oncopy':{
            set:function(){}
        }
    })

    GM_addStyle(`.a_left{ float:none; margin-left: auto; margin-right: auto;}
                 .doc360article_content{padding-right: 0px!important;}
                `)

    setTimeout(()=>{
        //点击全屏按钮、打印按钮后隐藏登录框
        $('.newbtn_fullscreen , #fixedFullScreen, .newbtn_print, #fixedPrint, #contextmenudivmouseup, #contextmenudiv').click(function(){
            $('#registerOrLoginLayer').hide();
            $('[style*="background: rgb(0, 0, 0); position: fixed; opacity: 0.5;"] , [style*="background: rgb(0, 0, 0); opacity: 0.5;"]').hide();
        });
    },1500);

    var domainlist = ["yytcdn.com", "youku.com", "yinyuetai", "yidianzixun.com", "xmnn.cn", "xinmin.cn", "www.s1979.com", "www.qzone.cc", "www.aipai.com",
                      "ws.126.net", "vodjk.com", "video.sxrb.com", "v1.cn", "v.mp.uc.cn", "v.ku6vms.com", "v.ifeng.com", "tv189.", "tudou.com",
                      "tangdou.com", "sohu.com", "smgbb.cn", "sina.com", "qq.com", "qiyi.com", "pptv.com", "pplive.cn", "pomoho.com", "people.com.cn",
                      "people.com", "pclady.com.cn", "netease.", "mtime.com", "m.toutiao", "letvcdn.com", "letv.com", "le.com", "ku6cdn.com", "kksmg.com",
                      "jstv.com", "js.tudouui.com", "iqiyi.com", "iqiyi.com", "iqilu.com", "imgo.tv", "ifengimg.com", "ifeng.com", "huanqiu.", "hitvs.cn",
                      "hitow.net", "haokan.baidu.com", "gmw.cn", "enorth.com", "eastmoney.com", "e23.cn", "douyin.com", "doc88.com", "cztv.com", "cutv.com",
                      "chinanews.com", "chaoxing.com", "cdstm.cn", "cctv.com", "cctv.com", "boosj.com", "bokecc.com", "bilibili.com", "baomihua.com", "b23.tv",
                      "av.rednet.cn", "71.cn", "56.com", "365yg.com", "360kan.com", "17173.com", "163.com", ".yidianzixun.com", ".xiguavideo.net",
                      ".xiguavideo.cn", ".xiguashipin.net", ".xiguashipin.cn", ".xiguaapp.com", ".xiguaapp.cn", ".toutiao.com", ".pstatp.com", ".kuaishou.com",
                      ".ixigua.com", ".365yg.com", "zhiyin.cn", "yoqoo.com", "xinhuanet.com", "xiaoniangao.cn", "www.legaldaily.com.cn", "www.docin.com",
                      "www.5872.com", "wenku.baidu.com", "v.rbc.cn", "v.csdn.hudong.com", "v.chinamil.com.cn", "umiwi.com", "static.youku.com","360doc.com",
                      "resources.pomoho.com", "pps.tv", "pcauto.com.cn", "news.cn", "ku6.com", "jxyinyue.com", "hunantv.com", "hualu5.com", "dv.ce.cn",
                      "cri.cn yntv.cn", "cntv.cn", "client.joy.cn", "bdchina.com", "6.cn", "21cn.com", "m.docin.com", "m.doc88.com", "wk.baidu.com"];

    $('#articlecontent a').click(function(){
        let href = $(this).attr('href');
        let isTrusted = false;
        $.each(domainlist, function(index, value) {
            if (href.indexOf(value) > -1) {
                isTrusted = true;
            }
        })

        if(isTrusted == false) //非可信域名链接直接打开，不弹提示
        {
            window.open(href);
        }
    });

    $('.a_left').width($('.doc360article_content').width()-100);
    $('#bgchange').width($('.doc360article_content').width()-100);
    $('.article_showall + table').width($('.doc360article_content').width()-100);
    $('#artContent').attr('style','max-width:'+ ($('.doc360article_content').width()-100) + 'px，width:'+ ($('.doc360article_content').width()-100) + 'px');
    $('#artContent + div').width($('.doc360article_content').width()-100);


    setInterval(()=>{
        $('body').removeClass('articleMaxH'); //自动展开全文

        //文章内打印按钮
        $('.newbtn_print').show();
        if($('.newbtn_print').length>0 && $('.newbtn_print').attr('onclick').indexOf('PrintObj.print()') == -1)
        {
            $('.newbtn_print').attr('onclick',$('.newbtn_print').attr('onclick')+'PrintObj.print();');
        }

        //顶部打印按钮
        if($('.atfixednav').css('display')=='block')
        {
            $('#fixedPrint').show();
            if($('#fixedPrint a').length>0 && $('#fixedPrint a').attr('onclick').indexOf('PrintObj.print()') == -1)
            {
                $('#fixedPrint a').attr('onclick',$('#fixedPrint a').attr('onclick')+'PrintObj.print();');
            }
        }

        //右键菜单打印按钮
        if($('#contextmenudiv').css('display')=='block')
        {
            if($('#contextmenudiv li:nth-of-type(2) a').length>0 && $('#contextmenudiv li:nth-of-type(2) a').attr('onclick').indexOf('PrintObj.print()') == -1)
            {
                $('#contextmenudiv li:nth-of-type(2) a').attr('onclick',$('#contextmenudiv li:nth-of-type(2) a').attr('onclick')+'PrintObj.print();');
            }
        }

        //文章内转word按钮
        $('.newbtn_word').show();
        if($('.newbtn_word').length>0 && $('.newbtn_word').attr('onclick').indexOf('WordObj.htmlToWord()') == -1)
        {
            $('.newbtn_word').attr('onclick',$('.newbtn_word').attr('onclick')+';WordObj.htmlToWord();');
        }

        //顶部转word按钮
        if($('.atfixednav').css('display')=='block')
        {
            $('#fixedWord').show();
            if($('#fixedWord a').length>0 && $('#fixedWord a').attr('onclick').indexOf('WordObj.htmlToWord()') == -1)
            {
                $('#fixedWord a').attr('onclick',$('#fixedWord a').attr('onclick')+'WordObj.htmlToWord();');
            }
        }

        if(!$('#topnickname a').hasClass('full'))
        {
            $('#topnickname a').text($('#topnickname a').attr('title'));
            $('#topnickname a').addClass('full');
        }


        $('#ac_buybook').hide();
        $('.floatqrcode').hide();
        $('#doc360outlinkpop').hide();
        $('#adarttopgoogle').hide();
        $('#outerdivifartad1').hide();
        $('.str_border').hide();
        $('#recommendArt .his_her_div').hide();
        $('.clear360doc').hide();
        $('newsfeed').hide();
        $('#topref').parent().hide();
        $('.prev_next').hide();
        $('#oranuserinfo').hide();
        $('#divreward').hide();
        $('#ifartaddiv').hide();
        $('#divadright').hide();
        $('.index_app2d').hide();
        $('.index_app2dclose').hide();
        $('.a_right').hide();
        $('#goTop2').hide();
        $('#arttopbdad').hide();
        $('.gzhxcjh_entrance').hide();
        $('.bevip__tips').hide();

        $('.head2020_mask + div').hide();
        $('#divtort + div').hide();
        $('.yc_user').hide();
        $('.youlike').hide();
        $('.lswztit').hide();
        $('.like_content').hide();
        $('#relearticle').hide();
        $('#relevantmorediv').hide();
        $('#currbackgroudcolor > div:nth-child(6)').hide();
        $('#VipNewTipsIframe').hide();
        $('#OneVipIframe').hide();
        $('div[style*="background: rgb(0, 0, 0); position: fixed;"]').hide();
        $('#SpringFestivalIframe').hide();
    },100);

    setTimeout(function(){
        if(window.location.href.indexOf('www.360doc.cn')>-1 && $('.article_showall a').length>0)
        {
            $('.article_showall a').get(0).click();
            ReShowAll();
            closedialog2();
        }
    },1000);

})();