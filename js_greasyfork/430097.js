// ==UserScript==
// @name         中关村,下载之家去除高速下载，页面广告优化
// @namespace    http://tampermonkey.net/
// @include      https://softdown.fengcv.cn/
// @version      0.1.4
// @description  去除中关村与下载之家的软件下载详情页面高速下载通道（非常恶心的东西）以及页面的广告。
// @author       Jason
// @match        *://softdown.fengcv.cn/*
// @match        *://www.downza.cn/*
// @icon         https://icon.zol-img.com.cn/mainpage/2019logo/logo-fengcv.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430097/%E4%B8%AD%E5%85%B3%E6%9D%91%2C%E4%B8%8B%E8%BD%BD%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430097/%E4%B8%AD%E5%85%B3%E6%9D%91%2C%E4%B8%8B%E8%BD%BD%E4%B9%8B%E5%AE%B6%E5%8E%BB%E9%99%A4%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
// @updateURL    https://gitee.com/XiaoLang147258/oil-monkey-script/raw/master/removeGaosu.js
(function() {

    function remove(document){
        if(document==undefined||document==null){
            return false
        }else{
            document.remove()
        }
    };
    function to(){
        window.scrollTo(0,document.documentElement.offsetHeight-window.innerHeight);
    }
    function tobotton(document){
        document.innerText='直达最底部';
        document.onclick = to
    }

    //*://softdown.fengcv.cn/*
    let box_top_xiazai = document.getElementsByClassName("box-top-xiazai")[0]
    if(box_top_xiazai){
        window.setTimeout(()=>{remove(document.getElementsByClassName("fast-down-btn")[0])},500);
        remove(box_top_xiazai);
        remove(document.getElementsByClassName("recommend-soft-box")[0]);
        remove(document.getElementsByClassName("down-right")[0]);
        remove(document.getElementsByClassName("shandian-software")[0]);
        remove(document.getElementsByClassName("base-right-pic")[0]);
        remove(document.getElementsByClassName("sidebarNav")[0]);
        remove(document.getElementById("zolGlobalFooter"));
        remove(document.getElementById("nowDown"));
    }

    //*://www.downza.cn//*
    let guess_head = document.getElementsByClassName("guess_head")[0]
    if(guess_head){
        tobotton(document.getElementById("priDownBtn"));
        remove(guess_head);
        remove(document.getElementsByClassName("pull-right")[0])
        remove(document.getElementsByClassName("fixed_btn_box")[0])
        remove(document.getElementsByClassName("side-down3")[0])
        remove(document.getElementsByClassName("links")[0])
        remove(document.getElementsByClassName("share")[0])
        remove(document.getElementsByClassName('pc-down_relenews')[0])
        remove(document.getElementsByClassName('recommend-baidu')[0])
        remove(document.getElementsByClassName('main-r_box')[0])
        remove(document.getElementsByClassName('softking')[0])
        remove(document.getElementsByClassName('alsodownload')[0])
        remove(document.getElementsByClassName('ads')[0])
        remove(document.getElementsByClassName('relever')[0])
        remove(document.getElementsByClassName('feedback')[0])
        remove(document.getElementsByClassName('down_remove')[0])
        remove(document.getElementsByClassName('small-video')[0])
        remove(document.getElementsByClassName('pc-down_special')[0])
        remove(document.getElementsByClassName('bkbottomAD')[0])
        remove(document.getElementsByClassName('nav')[0])
        remove(document.getElementsByTagName('footer')[0])
        remove(document.getElementById("m_tags"))
        remove(document.getElementById("m_rjjx"))

    }

    //*://?????//*

})();
