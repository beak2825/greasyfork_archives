// ==UserScript==
// @name         慕课网(Imooc.com)自动播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Imooc.com 去除微信公众号二维码;可设置的是否自动播放下一个视频;可设置的是否全屏播放
// @author       smilewind
// @match        https://www.imooc.com/video/*
// @match        https://coding.imooc.com/class/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388944/%E6%85%95%E8%AF%BE%E7%BD%91%28Imooccom%29%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/388944/%E6%85%95%E8%AF%BE%E7%BD%91%28Imooccom%29%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //在个人设置中添加配置选项
    var playSetting = `
             <div class="card-history" style="margin-top:10px;" ><span class="history-item"><i class="imv2-homework" style="display:inline-block;margin-left: -10%;margin-right:2%;"></i> <span class="text-ellipsis"  style="font-weight: 700;">播放设置</span>
                 <ol>
                     <li style="margin-top:10px;">
                        <input class="tamAutoFullScr" type="checkbox" name="autoplay" style="top:3px;">
                        <span class="text-ellipsis" style="margin-left: 5%;">全屏播放</span>
                     </li>
                     <li style="margin-top:3px;">
                        <input class="tamAutoPlay" type="checkbox" name="autoplay" style="top:3px;">
                        <span class="text-ellipsis" style="margin-left: 5%;">自动下一集</span>
                     </li>
                  </o>
              </span></div>`;

    //初始化状态
    var storage = window.localStorage,
     autoPlay = storage.getItem('autoPlay')=='true' ? true : false,
     autoFull = storage.getItem('autoFull')=='true' ?true : false;
    //console.log('自动播放:'+autoPlay+',自动全屏:'+autoFull);
    //关闭未关注微信公众号的弹窗二维码
    window.onload = function(){
        $('#BindingPublicNumber').css('display','none');
        $('.publicnumber-block').css('display','none');
        //添加配置项
        $('.user-center-box').append(playSetting);
        $('.tamAutoPlay').attr('checked',autoPlay);
        $('.tamAutoFullScr').attr('checked',autoFull);
    }

    //checkbox是否选中
    $(document).on('click','.tamAutoPlay',function(){
         var isCheck = $(this).get(0).checked;
         window.localStorage.setItem("autoPlay",isCheck);
         location=location;
    })
    $(document).on('click','.tamAutoFullScr',function(){
         var isFull = $(this).get(0).checked;
         window.localStorage.setItem("autoFull",isFull);
         location=location;
    })

   //自动播放下一集
   var isPlay = '';
   if(autoPlay){
       setInterval(function(){
           isPlay = $('.J_next-box').css('display');
           if(isPlay == 'block'){
               $('.J-next-btn').click();
           }
       },1000)
    }

    //自动全屏
    var isFull = '',isMiddle = '',isClick=false;
    if(autoFull){
        setInterval(function(){
            if(!isClick){
                isFull = $('#chapterId').css('visibility');
                isMiddle = $('.J_next-box').css('display');
                if(isFull == 'hidden' && isMiddle=='none'){
                    $('.vjs-fullscreen-control').click();
                    isClick = true;
                }
             }
       },1000)
     }
})();