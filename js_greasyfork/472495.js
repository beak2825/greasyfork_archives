// ==UserScript==
// @name         【泛用-图片】图片跳转原图
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  访问图片的URL时会自动跳转到原图：新浪微博、百度百科、Bwiki、米游社
// @author       halfasec、sucloud
// @match        *.sinaimg.cn/*
// @match        *.moyu.im/*
// @match        *.imgur.com/*
// @match        *pbs.twimg.com/*
// @match        *cdn.discordapp.com/*

// @match        *bkimg.cdn.bcebos.com/*
// @match        *bkimg.bj.bcebos.com/*
// @match        *patchwiki.biligame.com/*
// @match        *.i0.hdslb.com/*
// @match        *.prts.wiki/images/*
// @match        *.upload-bbs.miyoushe.com/upload/*
// @match        *.static-tapad.tapdb.net/*
// @match        *.img.tapimg.com/*
// @match        *.img2.tapimg.com/*
// @match        *.tx-free-imgs2.acfun.cn/*
// @match        *.img.166.net/*

// @grant        none
// @license      ODbL
// @downloadURL https://update.greasyfork.org/scripts/472495/%E3%80%90%E6%B3%9B%E7%94%A8-%E5%9B%BE%E7%89%87%E3%80%91%E5%9B%BE%E7%89%87%E8%B7%B3%E8%BD%AC%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/472495/%E3%80%90%E6%B3%9B%E7%94%A8-%E5%9B%BE%E7%89%87%E3%80%91%E5%9B%BE%E7%89%87%E8%B7%B3%E8%BD%AC%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function() {

    //18109384135把蜜蜂当宠物
    'use strict';
    //window.location.href:当前页面打开URL页面
    var originalLocator=window.location.href;

    console.log(originalLocator);
    //test()方法用于检测一个字符串是否匹配某个模式,如果字符串中有匹配的值返回 true,否则返回 false。
    var flagwbLarge=(/thumbnail|thumb150|mw600|mw690|mw1024|small|bmiddle|orj360|thumb180|mw2000/.test(originalLocator)&&/sinaimg.cn/.test(originalLocator));
    if(flagwbLarge){
        var fixedLocator=originalLocator.replace(/thumbnail|thumb150|mw600|mw690|mw1024|small|bmiddle|orj360|thumb180|mw2000/, "large");
        console.log(fixedLocator);
        window.location.href=fixedLocator;
    }

    var flagmoyuLarge=(/thumbnail|thumb150|mw600|mw690|mw1024|small|bmiddle|orj360|thumb180|mw2000/.test(originalLocator)&&/moyu.im/.test(originalLocator));
    if(flagmoyuLarge){
        var fixedmoyuLocator=originalLocator.replace("moyu.im","sinaimg.cn");
        console.log(fixedmoyuLocator);
        window.location.href=fixedmoyuLocator;
    }

    var flagtwLarge=(/&name=/.test(originalLocator)&&(/&name=orig/.test(originalLocator))||/:orig/.test(originalLocator)||/\?name=orig/.test(originalLocator));
    if(!flagtwLarge&&/twimg.com\/media/.test(originalLocator)){
        var fixedtwLocator=originalLocator.replace(/&name=[\s\S]*/, "&name=orig").replace(/:small|:large/,":orig").replace(/\.jpg$/,".jpg:orig");
        console.log(fixedtwLocator);
        window.location.href=fixedtwLocator;
    }

    var flagtwGifThumb=(/pbs.twimg.com\/tweet_video/.test(originalLocator));
    if(flagtwGifThumb){
        var fixedtwGifLocator=originalLocator.replace(/https:\/\/pbs.twimg.com\/tweet_video_thumb/,"https://video.twimg.com/tweet_video").replace(/\?format=[\s\S]*/,".mp4")
        console.log(fixedtwGifLocator);
        window.location.href=fixedtwGifLocator;
    }

    //自行添加部分

    //https://bkimg.cdn.bcebos.com/pic/4ec2d5628535e5dde7110377aa90b0efce1b9d16c446?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2UyNzI=,g_7,xp_5,yp_5
    //https://bkimg.bj.bcebos.com/waitAudit/fcfaaf51f3deb48f8c54104205492d292df5e1fed2aa?x-bce-process=image/resize,m_lfit,w_220,h_220,limit_1
    var flagBaidubaike_bkimg_cdn_bcebos_com=(/bkimg.[\s\S]*.bcebos.com/.test(originalLocator)&&/x-bce-process/.test(originalLocator));
    if(flagBaidubaike_bkimg_cdn_bcebos_com){
        var Baidubaike_bkimg_cdn_bcebos_com_Locator=originalLocator.replace(/\?x-bce-process=[\s\S]*/, "");
        console.log(Baidubaike_bkimg_cdn_bcebos_com_Locator);
        window.location.href=Baidubaike_bkimg_cdn_bcebos_com_Locator;
    }

    //https://patchwiki.biligame.com/images/tdj/thumb/6/6a/ekg1rgl1dkuv3yucnq6fmg7jvqntzuh.png/724px-%E7%AB%8B%E7%BB%98_%E5%B9%BD%E7%AF%81.png
    var flagBwiki_patchwiki_biligame_com=(/patchwiki.biligame.com/.test(originalLocator)&&/thumb/.test(originalLocator));
    if(flagBwiki_patchwiki_biligame_com){
        var Bwiki_patchwiki_biligame_com_Locator=originalLocator.replace(/thumb\//, "").replace(/.png[\s\S]*/, ".png");
        console.log(Bwiki_patchwiki_biligame_com_Locator);
        window.location.href=Bwiki_patchwiki_biligame_com_Locator;
    }

    //B站使用：https://greasyfork.org/zh-CN/scripts/393995-bilibili-%E5%B9%B2%E5%87%80%E9%93%BE%E6%8E%A5
    //https://www.bilibili.com/video/BV1DM411V72x/?vd_source=3977a665c48fb551f6cdadbaab32a38e
    //var flagBilibili_bilibili_com_video=(/bilibili.com\/video/.test(originalLocator)&&/\/\?/.test(originalLocator));
    //if(flagBilibili_bilibili_com_video){
    //var Bilibili_bilibili_com_video_Locator=originalLocator.replace(/\/\?[\s\S]*/,"/" );
    //console.log(Bilibili_bilibili_com_video_Locator);
    //window.location.href=Bilibili_bilibili_com_video_Locator;
    //}

    var flagBilibili_bilibili_com_bangumi=(/bilibili.com\/bangumi/.test(originalLocator)&&/from_spmid/.test(originalLocator))||/theme/.test(originalLocator)||/spm_id_from/.test(originalLocator);
    if(flagBilibili_bilibili_com_bangumi){
        var Bilibili_bilibili_com_bangumi_Locator=originalLocator.replace(/\?from_spmid=[\s\S]*/, "").replace(/\?theme=[\s\S]*/, "").replace(/\?spm_id_from=[\s\S]*/, "");
        //var Bilibili_bilibili_com_bangumi_Locator=originalLocator.replace(/\?theme=[\s\S]*/, "");
        console.log(Bilibili_bilibili_com_bangumi_Locator);
        window.location.href=Bilibili_bilibili_com_bangumi_Locator;
    }

    var flagBilibili_live_bilibili_com=(/live.bilibili.com/.test(originalLocator)&&/live_from/.test(originalLocator)||/spm_id_from/.test(originalLocator));
    if(flagBilibili_live_bilibili_com){
        var Bilibili_live_bilibili_com_Locator=originalLocator.replace(/\?live_from=[\s\S]*/, "").replace(/\?spm_id_from=[\s\S]*/, "");
        console.log(Bilibili_live_bilibili_com_Locator);
        window.location.href=Bilibili_live_bilibili_com_Locator;
    }

    //https://i0.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png@2560w_400h_100q_1o.webp
    var flagBilibili_i0_hdslb_com=(/i0.hdslb.com/.test(originalLocator)&&/@/.test(originalLocator));
    if(flagBilibili_i0_hdslb_com){
        var Bilibili_i0_hdslb_com_Locator=originalLocator.replace(/@[\s\S]*/, "");
        console.log(Bilibili_i0_hdslb_com_Locator);
        window.location.href=Bilibili_i0_hdslb_com_Locator;
    }

    //https://prts.wiki/images/0/07/%E7%AB%8B%E7%BB%98_%E4%BC%8A%E5%86%85%E4%B8%9D_1.png?image_process=format,webp/quality,Q_90
    var flagPrts_wiki=(/prts.wiki/.test(originalLocator)&&/png\?/.test(originalLocator));
    if(flagPrts_wiki){
        var Prts_wiki_Locator=originalLocator.replace(/png?[\s\S]*/, "png");
        console.log(Prts_wiki_Locator);
        window.location.href=Prts_wiki_Locator;
    }

    //https://upload-bbs.miyoushe.com/upload/2023/04/27/73565430/be67ee50d50ef71925e7114a5d65c5d7_3025383760542806886.png?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,png
    var flagUpload_bbs_miyoushe_com=(/upload-bbs.miyoushe.com/.test(originalLocator)&&/\?x-oss-process/.test(originalLocator));
    if(flagUpload_bbs_miyoushe_com){
        var Upload_bbs_miyoushe_com_Locator=originalLocator.replace(/\?x-oss-process=[\s\S]*/, "");
        console.log(Upload_bbs_miyoushe_com_Locator);
        window.location.href=Upload_bbs_miyoushe_com_Locator;
    }

    //https://static-tapad.tapdb.net/MzU1MTYzMDQxQDY0NDIzMmE0OThkODE.jpg?imageView2/0/w/1080/h/608/q/80/format/jpg/interlace/1/ignore-error/1
    var flagStatic_tapad_tapdb_net=(/static-tapad.tapdb.net/.test(originalLocator)&&/\?imageView/.test(originalLocator));
    if(flagStatic_tapad_tapdb_net){
        var Static_tapad_tapdb_net_Locator=originalLocator.replace(/\?imageView[\s\S]*/, "");
        console.log(Static_tapad_tapdb_net_Locator);
        window.location.href=Static_tapad_tapdb_net_Locator;
    }

    //https://img.tapimg.com/market/lcs/d0cf5c9877b43c6c1d3ed980cbd2e065_360_v2.png?imageView2/1/w/270/q/80/interlace/1/ignore-error/1
    //https://img2.tapimg.com/moment/etag/FkhU32cT2OBp-WlPPmMlKsM302QJ.jpg?imageView2/2/w/720/h/9999/q/80/format/jpg/interlace/1/ignore-error/1
    var flagTapimg_com=(/tapimg.com/.test(originalLocator)&&/\?imageView/.test(originalLocator));
    if(flagTapimg_com){
        var Tapimg_com_Locator=originalLocator.replace(/\?imageView[\s\S]*/, "");
        console.log(Tapimg_com_Locator);
        window.location.href=Tapimg_com_Locator;
    }

    //https://tx-free-imgs2.acfun.cn/kimg/bs2/zt-image-host/ChgwOGQwYjdjNGM5MDMxMGE1ZDJkN2EyMDUQmMzXLw.png?x-oss-process=image/resize,m_fill,w_964,h_494
    var flagTx_free_imgs2_acfun_cn=(/tx-free-imgs2.acfun.cn/.test(originalLocator)&&/\?x-oss-process/.test(originalLocator));
    if(flagTx_free_imgs2_acfun_cn){
        var Tx_free_imgs2_acfun_cn_Locator=originalLocator.replace(/\?x-oss-process[\s\S]*/, "");
        console.log(Tx_free_imgs2_acfun_cn_Locator);
        window.location.href=Tx_free_imgs2_acfun_cn_Locator;
    }

    //https://img.166.net/reunionpub/ds/kol/20230509/210953-hbvs0rf36j.png?imageView&tostatic=0&thumbnail=316y176
    var flagImg_166_net=(/img.166.net/.test(originalLocator)&&/\?imageView/.test(originalLocator));
    if(flagImg_166_net){
        var Img_166_net_Locator=originalLocator.replace(/\?imageView[\s\S]*/, "");
        console.log(Img_166_net_Locator);
        window.location.href=Img_166_net_Locator;
    }



    //http://tiebapic.baidu.com/forum/w%3D580/sign=fc97c6c8a0dde711e7d243fe97edcef4/0a81e2d3572c11df8019c9ee262762d0f503c28f.jpg?tbpicau=2023-05-24-05_7ad75edc6c6fa9ff9b966c25efd418e3
    var flagTiebapic_baidu_com=(/tiebapic.baidu.com/.test(originalLocator)&&/\?tbpicau/.test(originalLocator));
    if(flagTiebapic_baidu_com){
        var Tiebapic_baidu_com_Locator=originalLocator.replace(/\?tbpicau[\s\S]*/, "");
        console.log(Tiebapic_baidu_com_Locator);
        window.location.href=Tiebapic_baidu_com_Locator;
    }


    //webp转png
    var flagWebp_png=(/.webp/.test(originalLocator));
    if(flagWebp_png){
        var Webp_png_Locator=originalLocator.replace(/.webp/, ".png");
        console.log(Webp_png_Locator);
        window.location.href=Webp_png_Locator;
    }

    //console.log可以将变量输出到浏览器的控制台中，方便开发者调用JS代码，它是一个使用频率很高的功能。
    console.log(flagwbLarge);
    console.log(flagtwLarge);
    console.log(flagtwGifThumb);

    window.addEventListener('keydown', event => {
        if (event.keyCode == 115) { // F4
            var searchLocator="https://lens.google.com/uploadbyurl?url="+window.location.href;
            window.location.href=searchLocator;
        }
    });

})();