// ==UserScript==
// @name         党课脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动播放，结束后自动返回
// @author       You
// @match        http://dxpx.ahstu.edu.cn/jjfz/lesson/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406024/%E5%85%9A%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/406024/%E5%85%9A%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.pathname === '/jjfz/lesson/video') {
        let height  = getCookie('scroll_to').split('=').pop();
       if(height) {
           $(document).scrollTop(height);
       }
       window.onunload = function(){
         let old_height = $(document).scrollTop();
         setCookie('scroll_to', old_height);
       }
   }

    else if(location.pathname === '/jjfz/lesson/play') {

      setTimeout(()=>{
        if($('.video_red1 a').prop('style').color === 'red') {
           let new_href =  $('li a').get().find(item => item.style.color!=='red');
           if(new_href){
             window.location.href = new_href.href;
           }else {
             let href = $("a.video_goback").prop('href');
             window.location.href = href;
           }
         }
      }, 1000)

      setTimeout(()=>{
       //$(".public_cancel").click();
       //$(".public_close").click();
       //players[0].forward(parseInt());
       //players[0].play();
       console.log(222)
       window.CheckPageFocus = () => {
       }
      }, 100);


    setInterval(()=>{
      //document.hasFocus = ()=> { return true};
      //window.loop_pause = () => {console.log('拦截成功')};
      if($(".public_cancel").get(0)){
        $(".public_cancel").click();
      }else if($(".public_submit").get(0)) {
        $(".public_submit").click()
      }else if($(".plyr--stopped").get(0)) {
       $(".plyr__play-large").click()
     }
    }, 500)
    }
    // Your code here...
})();

    function setCookie(name, value) {
     document.cookie = name + '=' + value;
    }

    function getCookie(name) {
      return document.cookie.split(';')
      .filter(item => item.indexOf(name) !== -1)
      .shift()
   }

   function deleteCookie(name) {
     setCookie(name, '', -1);
   }

    function getHref(str) {
     let first = str.indexOf('=');
     return str.slice(first + 1);
    }

