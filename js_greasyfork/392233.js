// ==UserScript==
// @name         4399赛尔号屏蔽广告
// @namespace    https://greasyfork.org/zh-CN
// @version      1.0.0
// @description  屏蔽4399赛尔号网页中的各种广告，带来清爽浏览体验。已覆盖4399赛尔号绝大部分相关网页，屏蔽内容包括百度推广广告、游戏面板广告、视频播放广告、顶部链接广告、底部链接广告等。
// @author       橙汁
// @copyright    橙汁
// @namespace    http://tampermonkey.net/
// @homepageURL  https://space.bilibili.com/293848435
// @supportURL   http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=973354623@qq.com
// @license      GNU General Public License version 2; https://opensource.org/licenses/GPL-2.0
// @match        *://www.4399.com/flash/seer.htm
// @match        *://news.4399.com/seer/*
// @match        *://news.4399.com/news/seerwenda/*
// @match        *://news.4399.com/gonglue/seer/*
// @match        *://v.4399pk.com/seer/*
// @match        *://huodong2.4399.com/comm/xiaobian/*
// @match        *://my.4399.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392233/4399%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/392233/4399%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

removeClass = function(ClassName,itemID){
    var elem = document.getElementsByClassName(ClassName);
    elem[itemID].parentNode.removeChild(elem[itemID]);
}

removeID = function(IDName){
    var elem = document.getElementById(IDName);
    elem.parentNode.removeChild(elem);
}

removeClassChild = function(ClassName,itemID,ChildName,ChildID){
    var elem = document.getElementsByClassName(ClassName);
    var child= elem[itemID].getElementsByTagName(ChildName);
    elem[itemID].removeChild(child[ChildID]);
}

checkClass = function(ClassName,itemID){
    var elem = document.getElementsByClassName(ClassName);
    return(elem[itemID]!=null);
}

checkID = function(IDName){
    var elem = document.getElementById(IDName);
    return(elem!=null);
}

optimizeHomePage = function(){
    removeID('scroll_list_xsjl');
    removeID('scroll_list_qdjl');
    removeID('showtab_rmxs_area');
    removeClass('i_middle2 pd_miky',0);
    removeClass('banm',0);
    removeClass('banm2',0);
    removeClass('bg-1 m',0);
    removeClass('site_tbar_wri',0);
    removeClass('a1',3);
    removeClass('a1',3);
    removeClass('li4',0);
    removeClass('li5',0);
    removeClass('footer',0);
    removeClass('ad_left',0);
    removeClass('ad_right',0);
    removeID('bdshare');
    removeClass('dongm',0);
    removeClass('serphone',0);
}

removeShareAd = function(ad,isClass){
    if (isClass){
        if (checkClass(ad,0)){
            removeClass(ad,0);
            try{clearInterval(t);}catch(err){}
        }
    }
    else{
         if (checkID(ad)){
            removeID(ad);
            try{clearInterval(t);}catch(err){}
        }
    }
}

optimizePetHomeBook = function(){
    removeClass('site_tbar_wri',0);
    removeClass('ad960',0);
    removeClass('footwrap',0);
    removeClass('gametuij',0);
    removeClassChild('fix_box',0,'a',3);
    var t=setInterval("removeShareAd('bdshare-slide-button-box bdshare-slide-style-r4',true)",300);
}

optimizePetBook = function(){
    removeClass('banner',0);
    removeClassChild('tit',0,'a',0);
    removeClass('schkey fl',0);
    removeClass('gametuij',0);
    removeClass('footer cf',0);
}

optimizeStudy = function(){
    removeClass('banner',0);
    removeID('arc_bb_20');
    removeClass('ad660',0);
    removeClass('gametuij',0);
    removeClass('footwp',0);
    removeClass('schkeys',0);
    for (var i=0;i<6;i++){
        try{
            removeClassChild('conl',0,'a',i);
        }
        catch(err){

        };
    }
}

optimizeVideo = function(){
    var elem = document.getElementById('video');
    var embed = elem.getElementsByTagName('embed')[0];
    var src = embed.getAttribute('src');
    embed.setAttribute('src',src.replace('&pscale=1',''));
    removeClass('banner',0);
    removeClass('schkeys',0);
    removeClass('gametuij',0);
    removeClass('footwp',0);
}

optimizeSsxxk = function(){
    removeClass('banner wp',0);
    removeClass('gametuij',0);
    removeClass('footwp',0);
    removeClass('schkeys',0);
}

optimizeZzph = function(){
    removeClass('banner',0);
    removeClass('gametuij',0);
    removeClass('footer cf',0);
}

optimizeJsq = function(){
    removeClass('site_tbar_wri',0);
    removeClass('ad1 w980',0);
    removeClass('footer w980',0);
    var t=setInterval("removeShareAd('bdshare',false)",300);
}

optimizeNoteHome = function(){
    try{
        removeClass('banner',0);
    }catch(err){};
    try{
        removeClass('banner wp',0);
    }catch(err){};
    try{
        removeClass('gametuij',0);
        removeClass('footwp',0);
        removeClass('schkeys',0);
    }catch(err){};
    try{
        removeID('arc_bb_20');
    }catch(err){};
    try{
        removeID('actDiv');
    }catch(err){};
    try{
        removeClassChild('conr',0,'a',1);
    }catch(err){};
    try{
        removeClass('side-ad',0);
    }catch(err){};
}

optimizeCartoon = function(){
    removeClass('banner wp',0);
    removeClass('gametuij',0);
    removeClass('footer2',0);
    removeClass('schkeys',0);
    removeClass('plun-info',0);
}

optimizeVideoHome = function(){
    removeClass('footwp',0);
    removeClass('ad fl',0);
    removeClass('ad fr',0);
    removeClass('fxad',0);
}

optimizeTopic = function(){
    removeClass('gametuij',0);
    removeClass('footer2',0);
}

optimizeTopics = function(){
    removeClass('gametuij',0);
    removeClass('footer2',0);
    removeClass('bann',0);
}

optimizeForums = function(){
    removeClass('my_footer',0);
    try{
        removeClass('baidu_ad',0);
    }catch(err){};
    try{
        removeClass('m-qunzu-guanggao',0);
        removeClass('u-title-top',0);
        removeClassChild('fixed_menu',0,'a',0);
    }catch(err){};

}

optimizeUperHome = function(){
    removeClass('fl top-list',0);
    removeClass('footer2',0);
    try{
        removeClass('bd-gg',0);
        removeClass('con4 cf',0);
    }catch(err){};
}

optimizeUpers = function(){
    removeClass('fl top-list',0);
    removeClass('footer2',0);
    try{
        removeClass('pic',2);
        removeClass('module m6 cf',0);
        removeClass('btn',1);
    }catch(err){};

}

main = function(){
    try{
        removeClass('tbnav-list',0);
    }catch(err){}
    var path=window.location.pathname;
    switch(path){
        case '/flash/seer.htm':
            optimizeHomePage();
            break;
        case '/seer/jinglingdaquan/':
            optimizePetHomeBook();
            break;
        case '/seer/ssxxk/':
            optimizeSsxxk();
            break;
        case '/seer/zzph/':
            optimizeZzph();
            break;
        case '/seer/jsq/':
            optimizeJsq();
            break;
        case '/gonglue/seer/yugao/':
            optimizeNoteHome();
            break;
        case '/seer/new/':
            optimizeNoteHome();
            break;
        case '/seer/youxixinwen/':
            optimizeNoteHome();
            break;
        case '/gonglue/seer/saiergonglue/':
            optimizeNoteHome();
            break;
        case '/seer/saiergonglue/':
            optimizeNoteHome();
            break;
        case '/seer/jingyanxinde/':
            optimizeNoteHome();
            break;
        case '/seer/tougao/':
            optimizeNoteHome();
            break;
        case '/news/seerwenda/':
            optimizeNoteHome();
            break;
        case '/seer/tougao/manhua/':
            optimizeNoteHome();
            break;
        case '/seer/video/':
            optimizeVideoHome();
            break;
        case '/seer/huati/':
            optimizeTopic();
            break;
        case '/comm/xiaobian/':
            optimizeUperHome();
            break;
        default:
            if(path.indexOf("seer/tujian")>-1){
                optimizePetBook();
                break;
            }
            if(path.indexOf("seer/jingyanxinde")>-1 || path.indexOf("saiergonglue")>-1 || path.indexOf("zenmezhua")>-1 || path.indexOf("yugao")>-1 || path.indexOf("seerwenda")>-1 || path.indexOf("youxixinwen")>-1){
                optimizeStudy();
                break;
            }
            if(path.indexOf("video")>-1){
                optimizeVideo();
                break;
            }
            if(path.indexOf("tougao/manhua")>-1 || path.indexOf("paoxiao/shouhui")>-1){
                optimizeCartoon();
                break;
            }
            if(path.indexOf("seer/huati")>-1){
                optimizeTopics();
                break;
            }
            if(path.indexOf("forums")>-1){
                optimizeForums();
                break;
            }
            if(path.indexOf("comm/xiaobian")>-1){
                optimizeUpers();
                break;
            }
    }
    console.log('4399赛尔号屏蔽广告功能执行完成。')
}

main();