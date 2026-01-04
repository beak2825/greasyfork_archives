// ==UserScript==
// @name         other
// @namespace    http://tampermonkey.net/
// @version      0.3.9
// @description  xxx
// @author       xxx
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png
// @include      *://*.aqdy*.com/*/*
// @include      *://x9*.com:*
// @match        *://www.kmkk104.com/videoContent/*
// @match        https://www.mjsq.men/index.php/vod/detail/id/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/440293/other.user.js
// @updateURL https://update.greasyfork.org/scripts/440293/other.meta.js
// ==/UserScript==

//【参考：[MissavNoPause](https://sleazyfork.org/zh-CN/scripts/470465-missavnopause )】
const cur_url = window.location.href;
(function() {
    'use strict';
    // debugger;
    addStyle();

    console.log(cur_url);
    //console.log($('li'));
    const width=$(document).width();

    if(cur_url.includes('/static/player/dplayer.html')){ // 29neii.com 真实页面 https://x8ppi2rqncc7rheyc.com:58006/static/player/dplayer.html?v=1
        console.log(4);
        //debugger;
        // $("tbody").find('iframe').contents().find('video').css('width','75%'); 控制台输入有用，使用代码没效果
        if(width > 1000)
            $("body").find('video').css('width','75%');
        //let temp=$("body").find('video')
        //console.log(temp);
        //console.log(4);
        //debugger
        /*
        console.log($('div.stui-pannel_bd > ul > li'));
        if(width > 992){
            console.log(width);
            $("li.col-md-6").css('width','33%');// 没效果,采用addStyle()
        }
        if(width <= 992 && width > 768)
            $("li.col-sm-4").css('width','50%');// 没效果
        if(width <= 768)
            $("li.col-xs-2").css('width','100%!important');// 没效果
        */
        return
    }
    //else if(!cur_url.match(/x8*\.com/)){ // 29nei.com 首页，搜索页
    //console.log(3);
    //$('#dingpiao_wap').remove(); // 广告
    //console.log($("li.col-xs-2"));
    /*
        if(width > 992)
            $("li.col-md-5").css('width','33%'); // 这个有效果，一起采用addStyle()
        if(width <= 992 && width > 768)
            $("li.col-sm-4").css('width','50%');
        if(width <= 768)
            $("li.col-xs-2").css('width','100%');
        */
    //}


    if(cur_url.includes('videoContent')){  // https://www.kmkk104.com/videoContent/16146 播放页   快，不卡顿
        //console.log(11111);
        // 需要配合脚本使用
        setTimeout(()=>{
            document.querySelector("div.dplayer-controller-mask").remove();
            document.querySelector("div.dplayer-video-wrap").style.width='1000px';
        },5 * 1000);
        setTimeout(()=>{
            document.querySelector("div.dplayer-controller-mask").remove();
            document.querySelector("div.dplayer-video-wrap").style.width='1000px';
        },10 * 1000);

    }


    if(cur_url.match(/\.aqdy.*\.com\/.*\/.*\/player.+/)){ // 播放页 https://b.aqdyia.com/shechu/NHDTB833lianmuruzhongchuchiqibing/player-0-0.html
        console.log(2);
        setTimeout(()=>{
            //debugger;
            //console.log(2);
            let xfplay_url=$("iframe").contents().find('#video iframe').contents().find('object param').eq(0).val();
            if(xfplay_url){
                console.log(xfplay_url)
                console.log(window.top.document.querySelector("#content > div > span > span")); // 网页内有iframe，所以需要选中顶级窗口
                $(window.top.document.querySelector("#content > div > span > span")).append(`<a href='${xfplay_url}' style='color:blue;text-decoration:underline;margin-left:10px;'>xfpaly</a>`);
            }
        },2000);
        return
    }else if(cur_url.match(/\.aqdy.*\.com\/.*\/(.+?)\//)){ //详情页 https://b.aqdyia.com/shechu/NHDTB833lianmuruzhongchuchiqibing/
        console.log(1)
        let $title=$('.detail-title.fn-clear h2');
        let code=$title.text().match(/(\w+-\d{3})/);
        if(code==null)
            return;

        let url=` https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${code[0]}`; // 图书馆 免
        let url2=` http://javland.xyz/tw/id_search.php?keys=${code[0]}`; // 主站 jav.land/tw 需要翻墙 | 有国内访问的网址 javland.de/tw  javland.xyz/tw

        let url3=` https://missav.com/cn/search/${code[0]}`; //
        let url4=` https://jable.tv/search/${code[0]}/`;  //

        let $a1=`<a href=${url} target="_blank" style="color:blue;">javlibrary</a>`;
        let $a2=`<a href=${url2} target="_blank" style="color:blue;">javland</a>`;

        let $a3=`<a href=${url3} target="_blank" style="color:blue;">missav</a>`;
        let $a4=`<a href=${url4} target="_blank" style="color:blue;">jable</a>`;
        $title.prepend(`${$a1}|${$a2}|${$a4}|${$a3} `);

        let textContent=document.querySelector("#like-focus > div.con4 > ul > div > a").textContent
        if(!textContent.includes('xfplay')){
            document.querySelector("#like-focus > div.con4 > ul > div > a").textContent='123'
        }else{
            document.querySelector("#like-focus > div.con4 > ul > div > a").style.color='red'
        }
        return;
        // 极品 姿势 FC 女神
    }


    if(cur_url.includes('index.php/vod/detail/id')){
        // et str='https://www.mjsq.men/index.php/vod/detail/id/183683.html';
        let temp=cur_url.match(/\d+/);
        let temp_url=`https://www.mjsq.men/index.php/vod/play/id/${temp[0]}/sid/1/nid/1.html`
        console.log(temp_url);
        location.replace(temp_url);
        return;
        // 极品 姿势 FC 女神
    }


})();

function addStyle() {
    //debugger;
    let layui_css = `li.col-xs-2{width:100%}
                     @media (min-width: 768px){li.col-sm-4{width:50%}}
                     @media (min-width: 992px){li.col-md-5{width:33%}li.col-md-6{width:33%}}`;
    GM_addStyle(layui_css);
}
/*
非ssr
mjsq.me
www.nenmsp.com

用这个搜索番号
【(http://88av172.xyz/ )】
*/