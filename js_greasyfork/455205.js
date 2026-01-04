// ==UserScript==
// @name         努努影院 播放优化
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  播放页面 “<”后退秒  “>”前进面  “↑”“↓”调节音量   直接点击数字键就可以调节倍速  （列表页面屏蔽韩国地区作品）
// @author       You
// @match        *.nunuyy1.org/*
// @match        *.nunuyy2.org/*
// @match        *.nunuyy3.org/*
// @match        *.nunuyy4.org/*
// @match        *.nunuyy5.org/*
// @match        *.nunuyy6.org/*
// @match        *.nunuyy7.org/*
// @match        *.nunuyy8.org/*
// @match        *.nunuyy9.org/*
// @icon         https://www.nunuyy3.org/favicon.ico
// @grant        none
// @license      ***
// @downloadURL https://update.greasyfork.org/scripts/455205/%E5%8A%AA%E5%8A%AA%E5%BD%B1%E9%99%A2%20%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/455205/%E5%8A%AA%E5%8A%AA%E5%BD%B1%E9%99%A2%20%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = document.getElementById('video');

    var playbackRate ='';

    function setPlaybackRate(){
        if(playbackRate>0){
            video.playbackRate = playbackRate;
            playbackRate = '';
        }
    }
    if(video){
        document.onkeydown=function(e){
            if(e.keyCode==188){
                video.currentTime = video.currentTime - 5;
            }
            if(e.keyCode==190){
                video.currentTime= video.currentTime + 5;
            }
            if(e.keyCode==38){
                video.volume = video.volume - 5;
            }
            if(e.keyCode==40){
                video.volume= video.volume + 5;
            }
            /*  //全屏
            if(e.keyCode==70){
                var element = document.documentElement;
                if(element.requestFullScreen) {
                    element.requestFullScreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                }
            }*/

            if(!isNaN(e.key) || e.key == '.' ){
                playbackRate += e.key;
                setTimeout(setPlaybackRate,800);
            }
        }
     }else{
         var href;
         document.onkeydown=function(e){

            if(e.keyCode==37){
                href = document.location.pathname;
                document.location = href.replace(/index_\d+/, 'index_'+ (parseInt(href.match(/index_\d+/)[0].match(/\d+/)[0])-1));

            }
            if(e.keyCode==39){
                href = document.location.pathname;
                document.location = href.replace(/index_\d+/, 'index_'+(parseInt(href.match(/index_\d+/)[0].match(/\d+/)[0])+1));
            }

             if(false){
                 href = document.location.pathname;
                 href.replace(/index_\d+/, (parseInt(href.match(/index_\d+/)[0].match(/\d+/)[0])+1));
                 document.location=href;
             }
         }
         document.onmousedown = function(e){if(e.button==4){
             href = document.location.pathname;
             document.location = href.replace(/index_\d+/, 'index_'+(parseInt(href.match(/index_\d+/)[0].match(/\d+/)[0])+1));
         }}

     }

    if(location.href.indexOf('/dianying/') >=0){
        var han = $('<input type="checkbox"/>');
        if(document.cookie.indexOf('hanguo=true') >=0){
            han.prop('checked',true);
        }else{
            han.prop('checked',false);
            var lis = $('.lists-content li');
            for(var i=0;i<lis.length;i++){
                var li = lis.eq(i);
                if(li.find('.orange').eq(1).html()=='韩国'){
                    console.log(li)
                    li.hide();
                }
            }
        }
        han.click(function(){
            document.cookie = 'hanguo='+han.prop('checked');
            if(!han.prop('checked')){
                var lis = $('.lists-content li');
                for(var i=0;i<lis.length;i++){
                    var li = lis.eq(i);
                    if(li.find('.orange').eq(1).html()=='韩国'){
                        console.log(li)
                        li.hide();
                    }
                }
            }else{
                $('.lists-content li').show();
            }
            han.prop('checked')
        });
        var box = $('.lists-title-lines-1 header').eq(0);
        var lab = $('<lable>屏蔽韩国</lable>');
        lab.append(han);
        box.append(lab);
    }
    // Your code here...
})();