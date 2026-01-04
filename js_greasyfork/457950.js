// ==UserScript==
// @name         视频网站自动全屏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  网站自动全屏
// @author       AragakiYui
// @match        *://*/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
  // @grant        unsafeWindow
  // @grant        GM_addStyle
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @grant        GM_deleteValue
  // @grant        GM_listValues
  // @grant        GM_addValueChangeListener
  // @grant        GM_removeValueChangeListener
  // @grant        GM_registerMenuCommand
  // @grant        GM_unregisterMenuCommand
  // @grant        GM_getTab
  // @grant        GM_saveTab
  // @grant        GM_getTabs
  // @grant        GM_openInTab
  // @grant        GM_setClipboard
// @icon         https://www.jiaozi.me/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/457950/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/457950/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==
var haspagefullscreen=0;
function pagefullscreen(){
      const fullPageStyle = `
#playleft iframe {
          width: 100% !important;
          height: 100% !important;
position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
        }
#dplayer{
position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 999;
}
.custom-background{
    height: 100vh;
    overflow: hidden;
}
.page{
height:100vh;
overflow:auto;
}
.header,.fixedGroup,.module-player-side{
display:none
}
        .embed-responsive iframe {
          width: 100% !important;
          height: 100% !important;
position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
        }
        ._webfullscreen_ {
          display: block !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
          background: #000 !important;
          z-index: 999999 !important;
        }
        ._webfullscreen_zindex_ {
          z-index: 999999 !important;
        }
      `;
      /* 将样式插入到全局页面中 */
      if (!window._hasInitFullPageStyle_ && window.GM_addStyle) {
        window.GM_addStyle(fullPageStyle);
          console.log('!!!')
        window._hasInitFullPageStyle_ = true;
      }
    const c = document.getElementsByTagName('button')
    for(var i in c){
        console.log(c[i])
        if(c[i].innerText == '全屏'){
          console.log(c[i]);c[i].click()
        }
      }

            haspagefullscreen = 1
}
function hrefclick(){
var list = document.querySelectorAll('a')
for(var i in list){
list[i].setAttribute('target','')
}
}
var firstfullscreen=setInterval(function(){
    if (haspagefullscreen){
        clearInterval(firstfullscreen);
        return;
   }
   pagefullscreen();
},3000);