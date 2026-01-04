// ==UserScript==
// @name         cctv live tv view formater
// @namespace    CherryChen
// @version      1.0
// @description  cctv live tv view page layer formater
// @author       CherryChen
// @match        https://tv.cctv.com/live/cctv*
// @license      GPL-3.0 License
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/471384/cctv%20live%20tv%20view%20formater.user.js
// @updateURL https://update.greasyfork.org/scripts/471384/cctv%20live%20tv%20view%20formater.meta.js
// ==/UserScript==

//获取屏幕缩放比例
function getRatio()
{
    var ratio=0;
    var screen=window.screen;
    var ua=navigator.userAgent.toLowerCase();

    if(window.devicePixelRatio !== undefined)
    {
        ratio=window.devicePixelRatio;
    }
    else if(~ua.indexOf('msie'))
    {
        if(screen.deviceXDPI && screen.logicalXDPI)
        {
            ratio=screen.deviceXDPI/screen.logicalXDPI;
        }
    }
    else if(window.outerWidth !== undefined && window.innerWidth !== undefined)
    {
        ratio=window.outerWidth/window.innerWidth;
    }

    if(ratio)
    {
        ratio=Math.round(ratio*100);
    }
    return ratio/100;
}

/*
   四舍五入: Math.round()
   算法: 固有元素尺寸 * ratio, 四舍五入取整, 视频宽高为(剩余可用尺寸/ratio)
*/


(function() {
    'use strict';

    var debug=true
    // retry times. time spend total=(300ms * retry)
    var retry=20
    // golbal zoom rate config
    var zoomr=getRatio()
    // golbal height config, px
    var h_menu=Math.round(0*zoomr) // 45/56
    var h_bottom=Math.round(40*zoomr) // 40/50
    var h_vspace=0
    var h_chrome_task=Math.round((71+49)*zoomr) // 71+49/89+60
    var h_video=Math.round((1080-(h_menu+h_bottom+h_vspace+h_chrome_task))/zoomr) // 100/875, 125/660, by vrs
    // global width config, px
    var w_channel=Math.round(364/zoomr) // 100/364, 125/358
    var w_display=Math.round(1920/zoomr)
    var w_video=(w_display-w_channel)

    // log function wrapper
    var log=function(msg, level=debug){
        if(debug){
            window.console.log(msg);
        }
    };
    log(`[info] ratio is ============= ${getRatio()} ====================`)

    var column13292=function(){
        return document.querySelector("#page_body > div.column_wrapper_13292");
    };
    // column13292.remove()

    var butify=function(){
        var n_task = 5
        var a_name=column13292()
        if(a_name){
            a_name.remove();
            document.querySelector("#page_body > div.gwA18043_ind01").remove();
            document.querySelector("#page_bottom > div.cntv_footer").remove();
            document.querySelector("#page_body > div.column_wrapper.zhibo_201013.bangdan_201014.zhibo_201014.ELMTnKfV6iRUmmCYeVNJUuyj201202").remove();
            document.querySelector("#video > div.video_btnBar").remove();
            // style: menu
/*             var menu = document.querySelector("#page_body > div.gwA18043_ind01");
            menu.style.height=`{h_menu}px` */
            // style: vspace
            var vspace_a = document.querySelector("#page_body > div.jiemuguanwang18950_zhibo_ind01.zhibo19629_ind01 > div:nth-child(1)");
            var vspace_b = document.querySelector("#page_body > div.jiemuguanwang18950_zhibo_ind01.zhibo19629_ind01 > div:nth-child(3)");
            vspace_a.style.height=0 //`{h_vspace}px`
            vspace_b.style.height=0 //`{h_vspace}px`
            // style.wh playing
            var playing=document.querySelector("#page_body > div.jiemuguanwang18950_zhibo_ind01.zhibo19629_ind01 > div.playingVideo");
            playing.style.height=`${h_video}px` // "875px"
            playing.style.width=`${w_display}px`
            // style.h channel
            var video_r_scroll = document.querySelector("#scrollbar");
            video_r_scroll.style.height=`${h_video}px`
            video_r_scroll.getElementsByClassName("scrollbar")[0].style.height=`${h_video}px`
            video_r_scroll.getElementsByClassName("viewport")[0].style.height=`${h_video}px`
            video_r_scroll.style.width=`${w_channel}px`
            // style.wh video
            var player = document.querySelector("#player");
            player.style.height=`${h_video}px`
            player.style.width=`${w_video}px`

            log('[info] found column wrapper, removed column wrapper.')
        }else{
            if(retry>0){
                log('[info] page.body.column wrapper not found! sleep 300ms and retring...');
                setTimeout(butify, 300)
                retry=retry-1
            }
        }
    };
    butify();
})();