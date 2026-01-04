// ==UserScript==
// @name         网上大学
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       You
// @match        https://wangda.chinamobile.com/
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@9
// @downloadURL https://update.greasyfork.org/scripts/404034/%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/404034/%E7%BD%91%E4%B8%8A%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let count = 0;
    function checkPlayer(){
        let selector = $('.player-content>div')
        console.log(selector);
        if(selector.length > 0){
            let type = selector.attr('data-current').split('/').pop()
            console.log(type)
            if(!type) return
            if(type==='video'){
                setInterval(function(){
                    var ended = $('video.vjs-tech')[0].ended;
                    var totalLength = $('.required').length;
                    if(!ended){
                        $('.vjs-play-control.vjs-control.vjs-button.vjs-paused').click()
                    }else {
                        if($('.required').eq(totalLength - 1).hasClass('focus')){
                            window.close();
                        }
                    }
                }, 1000)
                Swal.fire("", "当前页面脚本已启动！")
            }else if(['pdf', 'image'].includes(type)){
                let top = 0
                setInterval(function(){
                    let dl = $('.chapter-list dl div.item.start.pointer span')
                    if(dl.length ==0){
                        window.close()
                    }
                    let text = $('.chapter-list dl.required.focus div.item.continue.pointer span').html()
                    if(text !== '已完成'){
                        $('.player-content>div .viewerContainer').scrollTop(top)
                        top+=100
                    }else{
                        dl.eq(0).click()
                    }
                }, 1000)
                Swal.fire("", "当前页面脚本已启动！")
            }else{
                Swal.fire("", `脚本启动失败，不支持当前页面的课程类型：${type}！换一个课程试试吧`)
            }
        }else{
            if(count >= 5) return;
            count++;
            console.log(`非课程页面, 进行第${count}次重试`)
            setTimeout(checkPlayer, 1000);
        }
    }
    window.onload=function(){
        console.log('window.onload')
        setTimeout(function(){
            $('a[target="_blank"]').each((index, element) => {
                $(element).attr('url', $(element).attr('href'));
                $(element).attr('href', 'javascript:void(0)');
                $(element).click(function () {
                    window.open($(element).attr('url'));
                });
                $(element).removeAttr('target');
            })
            checkPlayer();
        }, 2000)
    }
})();

