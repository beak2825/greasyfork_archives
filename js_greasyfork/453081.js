// ==UserScript==
// @name         按键F视频全屏fullscreen
// @namespace    https://github.com/rasso1/u-Youtube
// @version      1.03
// @description  任意网站,按F键视频全屏
// @author       ok!
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jyu01.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/453081/%E6%8C%89%E9%94%AEF%E8%A7%86%E9%A2%91%E5%85%A8%E5%B1%8Ffullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/453081/%E6%8C%89%E9%94%AEF%E8%A7%86%E9%A2%91%E5%85%A8%E5%B1%8Ffullscreen.meta.js
// ==/UserScript==

(function() {
    var doc_s;
    doc_s = window.document;
    doc_s.onkeydown = key_down;

    // 当键盘按下ctrl+f键时,搜索浏览器页面
    function key_down(e){
        //document.onkeydown = function(e) {
        if (e.ctrlKey && e.keyCode == 70) {window.find();

                                          } else if (e.keyCode == 70) {
                                              e.preventDefault();

                                              if (!document.fullscreenElement) {
                                                  if(document.querySelector("video").requestFullscreen){
                                                      document.querySelector("video").webkitRequestFullScreen()

                                                      document.querySelector("video").requestFullscreen();
                                                  }else if(document.querySelector("video").webkitRequestFullScreen){

                                                      document.querySelector("video").webkitRequestFullScreen();
                                                  }else if(document.querySelector("video").mozRequestFullScreen){
                                                      document.querySelector("video").mozRequestFullScreen();
                                                  }else{
                                                      document.querySelector("video").msRequestFullscreen();
                                                  }

                                              }
                                              else{document.webkitCancelFullScreen();}


                                          }
    }

})();