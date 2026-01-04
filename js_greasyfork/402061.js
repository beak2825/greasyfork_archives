// ==UserScript==
    // @name         慕课网添加多倍速播放、自动播放下一条视频
    // @namespace
    // @version      0.2
    // @description  针对慕课网添加多倍速播放(默认最大 2 倍,现在支持到 4 倍)、自动播放下一条视频
    // @author       Bamboo
    // @include      /^http(s?)://www.imooc.com/(.*)$/
    // @grant        unsafeWindow
    // @run-at       document-end
    // @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
  // @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/402061/%E6%85%95%E8%AF%BE%E7%BD%91%E6%B7%BB%E5%8A%A0%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E6%9D%A1%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/402061/%E6%85%95%E8%AF%BE%E7%BD%91%E6%B7%BB%E5%8A%A0%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E6%9D%A1%E8%A7%86%E9%A2%91.meta.js
    // ==/UserScript==

    //添加多倍速播放
    function liClickEvent(obj){
        $(obj).parent().find('li').removeClass('current')
        $(obj).addClass('current');

        var currentSpeedText = $(obj).text();
        var currentSpeed = currentSpeedText.replace(/[^0-9]/ig, '');
        var cssAttrs = $('.vjs-playback-rate-value').attr('class');
        var rateNum = cssAttrs.replace(/[^0-9]/ig, '');

        $('.vjs-playback-rate-value').removeClass('rate' + rateNum + 'x').addClass('rate' + (currentSpeed * 10 > 100 ? (currentSpeed * 10 / 10) : currentSpeed * 10) +  'x')

        if (currentSpeed.length == 2) {
          currentSpeed = currentSpeed / 10;
        } else if (currentSpeed.length == 3) {
          currentSpeed = currentSpeed / 100;
        }
        $('.vjs-playback-rate-value').css('background-image','url()');
        $('.vjs-playback-rate-value').text(currentSpeed + 'x');

        var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
        if (video){
            video.play();
            video.playbackRate = currentSpeed;
        }
    }
    var addExtSpeedPlay = function () {
        var extSpeedArr = ['2.5x', '3x', '3.5x', '4x'];
        var ulList = $('#vjsMenu').children('ul')
        var appendHtml = '<li class="vjs-menu-item" tabindex="-1" role="menuitem" aria-live="polite">?<span class="vjs-control-text"></span><i class="imv2-check"></i></li>';
        for (var i = 0; i < extSpeedArr.length; i++) {
            var appendLi = appendHtml.replace('?', extSpeedArr[i]);
            ulList.prepend(appendLi)
        }

         //$('#vjsMenu').delegate('li', 'click', function(){
         //});
        $('ul.vjs-menu-content').on('click', 'li', function(){ //只要改这一行就可以了
             liClickEvent(this);
        });
    };
   

    //自动播放下一条视频 参考372498，不过有的失效的地方我已经改掉
    var nextMask = document.querySelector('div.next-box.J_next-box');
    var loop = setInterval(function () {
        if (!nextMask.classList.contains('hide')) {
            document.querySelector('span.J-next-btn.next-auto.moco-btn.moco-btn-green').click();
        }
    }, 1000);

        ;(function () {
            'use strict';
            setTimeout(function(){
                addExtSpeedPlay();
            }, 3000)
        })();