// ==UserScript==
// @name         哔哩哔哩合集列表增加长度 bilibili
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  阿B，你视频右侧的合集列表长度敢不敢再短点？建议改成一屏只能看到一行 （添加功能：按g网页全屏）
// @author       JoshCai233
// @license      GPL-3.0-only
// @match        https://www.bilibili.com/video/*
// @icon         https://favicon.yandex.net/favicon/v2/http://www.bilibili.com/?size=32
// @require       http://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450780/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E9%95%BF%E5%BA%A6%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/450780/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E5%A2%9E%E5%8A%A0%E9%95%BF%E5%BA%A6%20bilibili.meta.js
// ==/UserScript==

// 获取播放列表
function getBilibiliPlayList(){
    return  $('.base-video-sections-v1 .video-sections-content-list,    .right-container-inner .cur-list,    .video-pod .video-pod__body');
}
// 记录播放列表顶端位置
var bilibiliPlayListTop=0;
// 只能改一次宽度
var changeWidthLock=false;
// 取第一p的标题，如果标题刷新了则需要重新修改宽度（?）
var titleP1 = "";

// 增加播放列表宽度
function changePlayListWidth(){
    var widthInterval=setInterval(()=>{
        if(changeHeJiWidth()||changeFenPWidth()){
            console.log("播放列表宽度增加");
            clearInterval(widthInterval);
        }
    },500);
}

// 改变播放列表长度
function enlargeBilibiliPlayList(){
    var bilibiliPlayList = getBilibiliPlayList();
    if(bilibiliPlayList.length>0 && bilibiliPlayList.css('height')!='fit-content'){
        bilibiliPlayListTop = bilibiliPlayList.offset().top;
        // 不删除广告时的高度
        // var bilibiliPlayListHeight = window.innerHeight - bilibiliPlayList.offset().top - 24;
        // 删除广告时的高度
        var bilibiliPlayListHeight = window.innerHeight - bilibiliPlayList.offset().top - 34;

        bilibiliPlayListHeight = Math.max(500, bilibiliPlayListHeight) + 'px';

        bilibiliPlayList.css('height','fit-content').css('max-height',bilibiliPlayListHeight);

        console.log("改变播放列表高度完成");


            changePlayListWidth();
        // 分小节的合集点击小节时需要再次增加宽度
        $('.video-pod .slide-item').click(()=>{
            changePlayListWidth();
        });
    }
}
//合集
function changeHeJiWidth(){

    var contentList=$('.video-sections-content-list');
    if(contentList.height()<10){
        return false;
    }
    contentList.css('margin-right','10px');
    var cardInfos=contentList.find('.video-episode-card__info');
    if(cardInfos.length){
        // // 改变合集宽度只改一次
        // if(cardInfos[0].firstChild.className.indexOf('video-episode-card__info-title')===-1){
        //     return true;
        // }
        if(changeWidthLock){
            // 如果标题的时长通过刷新等方式改回去了，则需要忽略锁，重新将时长加回去
            if ( titleP1 !== cardInfos[0].firstChild.lastChild.textContent){
                return true;
            }
        }else{
            // 上锁
            changeWidthLock = true;
        }

        titleP1 = cardInfos[0].firstChild.lastChild.textContent;

        // 文字排版
        cardInfos.each(function(index,item){
            //     item.insertBefore(item.lastChild,item.firstChild);
            //     item.firstChild.style.marginRight='0.8em';
            //     item.style.justifyContent='left';

            // 把时长和标题放一起，如果单独拿过去会出bug
            if (item.firstChild.lastChild.nodeType === 3){
                var videoLength = item.lastChild.innerText.trim();
                if(videoLength.length > 3 && videoLength.split(":")[0].length<2){
                    videoLength = "0" + videoLength;
                }
                item.firstChild.lastChild.textContent = ' [' + videoLength +'] '+ item.firstChild.lastChild.textContent;
            }
            item.style.justifyContent='left';
        });

        // 启用滚动
        contentList.css('overflow','scroll');
        $('.video-sections-item,.video-episode-card__info-title').css('width','100%').css('min-width', 'fit-content');
        //滚动条样式
        const styleTag = document.createElement('style');
        styleTag.innerHTML =".video-sections-content-list::-webkit-scrollbar{height:4px;} " +
            ".video-episode-card__info-title.video-episode-card__info-title_indent{padding-left:0.55em;}" +
            ".video-section-title {border-bottom: 1px solid #e3e5e7;}";

        // 将样式标签添加到head
        document.head.appendChild(styleTag);

        return true;
    }
    return false;
}
//分p
function changeFenPWidth(){
    var contentList=$('.video-pod__body');
    if(!contentList.length){
        debugger
        return false;
    }
    var cardInfos=contentList.find('.video-pod__list .video-pod__item .simple-base-item');
    if(!cardInfos.length){
        cardInfos=contentList.find('.video-pod__list .video-pod__item');
    }
    // 分p先加载长度
    if(contentList.height()<10 ||cardInfos[0].children.length===0){
        return false;
    }
    contentList.css('margin-right','10px');
    if(cardInfos.length){
        // 改变分p宽度只改一次
        if($(cardInfos[0]).find('.link-content').index()===1){
            return true;
        }

        // B站最近监听了 DOM 变化事件, 所以采用延时调整
        setTimeout(function(){
            // 文字排版
            cardInfos.each(function(index, item){
                item.insertBefore(item.lastElementChild,item.firstElementChild);
                item.firstElementChild.style.marginRight='0.8em';
                item.style.justifyContent='left';
            });
            // 启用滚动
            contentList.css('overflow','scroll');
            cardInfos.css('width','100%').css('min-width', 'fit-content');

            // 文字不换行
            contentList.find('.title-txt').css('white-space', 'nowrap');
            //滚动条样式
            const styleTag = document.createElement('style');
            styleTag.innerHTML =".video-pod__body::-webkit-scrollbar{height:4px;}";
            // 将样式标签添加到头部
            document.head.appendChild(styleTag);
        },3000);

        return true;
    }
    return false;
}


(function() {
    'use strict';
    $(document).ready(function () {
        /////////// 按下g的时候能点击网页全屏
        document.addEventListener('keydown', function(event) {
            console.log(event.key);
            if (event.key === 'g'||event.key === 'G') {
                var buttonElem =$(".bpx-player-ctrl-btn-icon.bpx-player-ctrl-web-enter")[0]; // 将 'myButton' 替换为实际按钮的 ID
                buttonElem.click();
            }
        });

        // 取消下滑右边栏的常态显示，方便摸鱼
        $(".video-container-v1 .right-container .right-container-inner").css("padding-bottom", window.innerHeight + "px");



        // 扩大一次播放列表长度
        enlargeBilibiliPlayList();
        var list = getBilibiliPlayList();

        // 检测高度变化, 如果变短则再次增加列表长度
        var callback = (mutations) => {
            for(var i=0;i<mutations.length;i++){
                console.log("视频列表高度发生变化");
                enlargeBilibiliPlayList();
            }
        }
        var config = {attributes:true,attributeFilter:['style'],attributeOldValue:true};
        new MutationObserver(callback).observe(list[0], config);


        // 检测是否删除了广告, 如果删除广告则变化列表长度
        config = { attributes: false, childList: true, subtree: true };
        callback = (mutationsList, observer) => {
            var bilibiliPlayList = getBilibiliPlayList();
            if(bilibiliPlayListTop>bilibiliPlayList.offset().top){
                bilibiliPlayListTop=bilibiliPlayList.offset().top;
                bilibiliPlayList.css('height','');
            }
        };
        new MutationObserver(callback).observe($('.right-container')[0], config);
    });
})();