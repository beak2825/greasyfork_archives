// ==UserScript==
// @name         AcFun HTML5播放器
// @namespace    https://www.kindjeff.com/
// @version      2017.2.25
// @description  把flash播放器的位置去掉，嵌入手机版 AcFun 的 HTML5 播放器
// @author       kindJeff
// @match        http://*.acfun.cn/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/27195/AcFun%20HTML5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/27195/AcFun%20HTML5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var get_url = function(){
        var page_info = document.getElementById('pageInfo');
        var vid, pic;
        if(page_info===null){
            vid = document.getElementsByClassName('btn active')[0].getAttribute('data-vid');
        }else{
            pic = page_info.getAttribute('data-pic');
            vid = page_info.getAttribute('data-vid');
        }

        var url = 'http://m.acfun.cn/ykplayer?date=undefined#vid='+ vid;
        if(pic!==undefined)
            url += ';cover=' + pic;
        return url;
    };

    var replace_player = function(player_div, min_height){
        var url = get_url();

        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.id = 'm_ifr';
        ifr.style.width = '100%';
        ifr.style.minHeight = min_height;
        ifr.style.overflow = 'hidden';
        ifr.setAttribute('allowFullScreen', 'true');
        ifr.scrolling = 'no';
        ifr.setAttribute('seamless', 'seamless');

        player_div.appendChild(ifr);
    };


    // 设置这个值来解决跨域不能加载脚本的问题。HTML5 播放器页面是 m.acfun.cn，PC是 www.acfun.cn
    document.domain = 'acfun.cn';

    var path_name = window.location.pathname;
    if(window.location.hostname==='m.acfun.cn'){
    }
    else if(path_name.slice(0, 4)==='/v/a'){
        window.onload = function(){
            var player_div, min_height;
            if(path_name[4]=='c'){
                // url 是 www.acfun.cn/v/acXXXXXXX 时
                player_div = document.getElementById('player');
                min_height = $('#player').height() + 'px';
                player_div.getElementsByTagName('object')[0].remove();
            }else if(path_name[4]=='b'){
                // url 是 www.acfun.cn/v/abXXXXXXX 时
                player_div = document.getElementsByClassName('inner ui-draggable')[0];
                min_height = $('#area-player').height() + 'px';
                document.getElementById('ACFlashPlayer-re').remove();
            }

            replace_player(player_div, min_height);

            var m_ifr = document.getElementById('m_ifr');
            m_ifr.onload = function(){
                var full_btn = m_ifr.contentDocument.getElementsByClassName('controller-btn-fullscreen');
                $(full_btn).on('click', function(){
                    if($(full_btn).children().attr('class')==="controller-icon-fullscreen"){
                        if (m_ifr.requestFullscreen) {
                            m_ifr.requestFullscreen();
                        } else if (m_ifr.mozRequestFullScreen) {
                            m_ifr.mozRequestFullScreen();
                        } else if (m_ifr.webkitRequestFullscreen) {
                            m_ifr.webkitRequestFullscreen();
                        }
                        $(full_btn).children().attr('class', 'controller-icon-fullscreen-close');
                    }else{
                        if (document.cancelFullScreen) {
                            document.cancelFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        }
                        $(full_btn).children().attr('class', 'controller-icon-fullscreen');
                    }
                });
            };
        };
    }
})();