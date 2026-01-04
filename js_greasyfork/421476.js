// ==UserScript==
// @name         降低国内流氓软件站的威胁程度
// @namespace    https://blog.imyqs.com/
// @version      0.2.1
// @description  移除在百度、360搜索下载软件时，搜索结果出现的“立即下载”模块，移除360搜索的“360软件宝库”；为百度、360搜索“官网”增加提示；移除ZOL软件下载中的“高速下载“
// @author       FrankYu
// @match        *://*.baidu.com/*
// @match        *://*.so.com/*
// @match        *://*.zol.com.cn/*
// @match        *://*.onlinedown.net/*
// @match        *://*.pc6.com/*
// @match        *://*.pcsoft.com.cn/*
// @match        *://*.pconline.com.cn/*
// @match        *://*.duote.com/*
// @match        *://*.cr173.com/*
// @match        *://*.crsky.com/*
// @match        *://*.skycn.com/*
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @run-at       document-idle
// @license      CC by-4.0
//
// @downloadURL https://update.greasyfork.org/scripts/421476/%E9%99%8D%E4%BD%8E%E5%9B%BD%E5%86%85%E6%B5%81%E6%B0%93%E8%BD%AF%E4%BB%B6%E7%AB%99%E7%9A%84%E5%A8%81%E8%83%81%E7%A8%8B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/421476/%E9%99%8D%E4%BD%8E%E5%9B%BD%E5%86%85%E6%B5%81%E6%B0%93%E8%BD%AF%E4%BB%B6%E7%AB%99%E7%9A%84%E5%A8%81%E8%83%81%E7%A8%8B%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
     * 用户自定义模块是否启用，启用为True，不启用为False，默认全部启用。
     */

    var enable_BaiduDownload = true;            //百度搜索结果出现的“立即下载”模块
    var enable_360Download = true;              //360搜索结果出现的“立即下载”模块
    var enable_360Software = true;              //360搜索结果出现的“360软件宝库”模块
    var enable_Official_Enhance = true;         //增强百度、360搜索结果中的“官方”标识
    var enable_Download_Clean = true;

    //百度搜索界面“立即下载”模块移除
    function kill_baidu_download() {
        if (window.location.href.indexOf('baidu.com') != -1) {
            //每秒检测是否存在广告，如果存在广告，则删除广告。
            setInterval(function () {
                if ($("[class^='pc-down_']").length != 0) {
                    $("[class^='pc-down_']").hide(500)
                    //console.log('执行成功！');
                } else {
                    //console.log("该Baidu网页没有发现“立即下载”模块。");
                }
            }, 1000)
        } else {
            //console.log('非百度搜索界面');
        }
    }

    //360搜索界面“立即下载”模块移除
    function kill_360_download() {
        if (window.location.href.indexOf('so.com') != -1) {
            //每秒检测是否存在广告，如果存在广告，则删除广告。
            setInterval(function () {
                if ($('#mohe-softbox').length != 0) {
                    $('#mohe-softbox').hide(500);
                    //console.log('执行成功！');
                } else {
                    //console.log("该360网页没有发现“立即下载”模块。");
                }
            }, 700)
        } else {
            //console.log('非360搜索界面');
        }
    }

    //360搜索界面“360软件宝库”模块
    function kill_360_software() {
        if (window.location.href.indexOf('so.com') != -1) {
            setInterval(function () {
                if ($('#mohe-relation_soft').length != 0) {
                    $('#mohe-relation_soft').hide(500);
                    //console.log('执行成功！');
                } else {
                    //console.log("该360页面没有发现“360软件宝库”模块");
                }
            }, 700);
        } else {
            //console.log('非360搜索界面');
        }
    }

    //为百度搜索和360搜索界面的“官网”的添加更显眼的标记
    function Official_Enhance() {
        if (window.location.href.indexOf('baidu.com') != -1) {
            setInterval(function () {
                if ($('#warning').length == 0) {
                    if ($('h3.t:first-child > a.OP_LOG_LINK.c-text.c-text-public.c-text-mult.c-gap-left-small:last-child').length != 0) {
                        $('h3.t:first-child > a.OP_LOG_LINK.c-text.c-text-public.c-text-mult.c-gap-left-small:last-child').after('<p id=\'warning\' style=\'border:1px solid red;border-radius:10px;background-color:red;' +
                            'font-size:large;text-align:center;padding:5px 0 5px 0;color:white\'>⚠&nbsp' +
                            '<strong style=\'font-style:italic\'>注意，这里是官方网站，如需下载软件，请选择该条目!</strong>&nbsp⚠</p>');
                        //console.log('百度搜索“Official_Enhance”执行成功！');
                    } else {
                        //console.log("该Baidu搜索结果没有发现“官网”标记。。。");
                    }
                } else {
                    //console.log('已经添加了标记。');
                }
            }, 2000);
        } else if (window.location.href.indexOf('so.com') != -1) {
            setInterval(function () {
                if ($('#warning').length == 0) {
                    if ($('span.icon-official').length != 0) {
                        $('span.icon-official').after("<p id=\'warning\' style=\"border:1px solid red;border-radius:10px;background-color:red;" +
                            "font-size:large;text-align:center;padding:5px 0 5px 0;color:white\">⚠&nbsp" +
                            "<strong style=\"font-style:italic\">注意，这里是官方网站，如需下载软件，请选择该条目!</strong>&nbsp⚠</p>");
                        //console.log('360搜索“Official_Enhance”执行成功！');
                    } else {
                        //console.log("该360搜索结果没有发现“官网”标记。。。");
                    }
                } else {
                    //console.log('已经添加了标记。');
                }
            }, 2000);
        } else {
            //console.log('非Baidu、360界面。。。')
        }
    }

    //清除常用下载站的高速下载按钮
    //ZOL软件下载
    function ZOL_Download() {
        if (window.location.href.indexOf('zol.com.cn') != -1) {
            //软件详情页
            $('a#downloader_main1').remove();           //ZOL高速下载
            $('div.xiazaic-topb-box').remove();         //高速下载器
            $('h4.down-h5').remove();                   //极速下载标题
            $('span.down-gaosub.clearfix').remove();    //极速下载按钮
            $('a#downloadTop').remove();                //底部弹窗高速下载移除
            //下载详情页
            $('h4.down-h4').remove();                   //高速下载标题
            $('span.down-jisu.clearfix').remove();      //高速下载按钮
            $('span.down-gaosuc.clearfix').remove();    //高速下载器
        } else {
            //console.log('非ZOL下载');
        }
    }

    //华军软件园
    function huajun_Download() {
        if (window.location.href.indexOf('onlinedown.net') != -1) {
            //软件详情页
            $('a.onedownbtn2.qrcode_show.gaosu').remove();                      //高速下载按钮
            $('div.downgs.downgsPc.clearfix.qrcode_show.gaosu').remove();       //高速下载
            $('ul.downlist.downlistPc.clearfix.qrcode_show.gaosu').remove();    //高速下载
            $('p.downtu').remove();                                             //引导图片
        } else {
            //console.log('非华军软件园')
        }
    }

    //PC6下载站
    function pc6_Download() {
        if (window.location.href.indexOf('pc6.com') != -1) {
            $('a.downnow').remove();            //高速下载按钮
            $('div#gaosuxiazai').remove();      //高速下载器
            $('li.ad-download').remove();       //游戏盒等广告
            $('div#HMRichBox').remove();        //右下角广告
        } else {
            //console.log('非PC6下载站');
        }
    }

    //PC下载网
    function pc_Download() {
        if (window.location.href.indexOf('pcsoft.com.cn') != -1) {
            $('body>div>a>img').remove();                   //侧边office广告，banner广告
            $('dl.clearfix.gsxzdl.qrcode_show').remove();   //高速下载器
            $('a.gsxz').remove();                           //下载提示
        } else {
            //console.log('非PC下载网')
        }
    }

    //太平洋下载中心
    function taipingyang_Download() {
        if (window.location.href.indexOf('pconline.com.cn') != -1) {
            $('a.btn.hs-btn.sh-down-btn').remove();         //高速下载按钮
            $('div.bzxz').remove();                         //下载详情页高速下载
            $('div.bzxz2').remove();
            $('div.block-jcz').remove();                    //下载页广告
        } else {
            //console.log('非太平洋下载中心');
        }
    }

    //多特软件站
    function duote_Download() {
        if (window.location.href.indexOf('duote.com') != -1) {
            $('div.hengfu#hengfu').remove();                              //2345浏览器广告
            $('a.large-soft-down-btn.fast-down-btn').remove();      //高速下载按钮
            $('div.downFastListBox').remove();                      //高速下载器模块
            //广告
            $('div.pic-bannerA').remove();                          //顶部广告
            $('div.links-banner').remove();                         //百度联盟广告
            $('.ad').remove();                                      //广告
            $('div#wrapper').remove();
            $('iframe').remove();
            $('div.adBox').remove();
            $('div.down-ad').remove();
            $('div.dl-banner').remove();
            //三分钟蒙版和广告推荐
            setInterval(function () {
                $('div.mask').remove();
                $('div.msgbox-wrap').remove();
            }, 170000);
        } else {
            //console.log('非多特软件站');
        }
    }

    //西西软件园
    function xixi_Download() {
        if (window.location.href.indexOf('cr173.com') != -1) {
            $('a.m-bdtn.downnowgaosu').remove();        //高速下载按钮
            $('li.address_like.downurl').remove();      //高速下载器
            $('div#full_downad').remove();              //广告
        } else {
            //console.log('非西西软件园');
        }
    }

    //非凡软件站
    function feifan_Download() {
        if (window.location.href.indexOf('crsky.com') != -1) {
            $('a.ml10.Gs_d').remove();                      //高速下载按钮
            $('ul.clearfix.Adown_v_gs').remove();           //高速下载器
            $('div.fr.clearfix.adowGright').remove();       //广告
            $('div.shadu_soft').remove();                   //杀毒软件广告
            $('body>div>div>div>div>div>a>img').remove();   //侧边CAD广告
        } else {
            //console.log('非非凡软件站')
        }
    }

    //天空下载
    function tiankong_Download() {
        //该网站暂未发现高速下载器，但是该网站下载的软件版本过低，该网页不做屏蔽，仅增加提示
        if (window.location.href.indexOf('skycn.com') != -1) {
            window.alert('提示：\n该下载站暂未发现高速下载器，但是该网页内中的软件版本过低，且有被第三方篡改的风险，如有需要，建议从软件官网下载。');
        } else {

        }
    }

    //模块调用判定
    if (enable_BaiduDownload) {
        kill_baidu_download();
    }

    if (enable_360Download) {
        kill_360_download();
    }

    if (enable_360Software) {
        kill_360_software();
    }

    if (enable_Official_Enhance) {
        Official_Enhance();
    }

    if (enable_Download_Clean) {
        ZOL_Download();
        huajun_Download();
        pc6_Download();
        pc_Download();
        taipingyang_Download();
        duote_Download();
        xixi_Download();
        feifan_Download();
        tiankong_Download();
    }

})();

