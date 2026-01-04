// ==UserScript==
// @name         畅玩空间会员
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  免费体验畅玩空间会员
// @author       y
// @match        https://play.wo1wan.com/*/play*
// @icon         https://play.wo1wan.com/nextgame/pc/favicon.ico
// @run-at       document-body
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457694/%E7%95%85%E7%8E%A9%E7%A9%BA%E9%97%B4%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/457694/%E7%95%85%E7%8E%A9%E7%A9%BA%E9%97%B4%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var url = location.href;
    if(url.indexOf("play.wo1wan.com/fcnext/play") > 0){
         let task = setInterval(()=>{
            try{
                //设置vip等级
                i_hdjjf_['LevelInfo']['VipLevel']=2
                i_hdjjf_['LevelInfo']['Svip']=2
                clearInterval(task)
            }catch(e){console.log('失败')}
        },1000)
    }else{
        let task = setInterval(()=>{
            try{
                //设置vip等级
                i_KBESwg['LevelInfo']['VipLevel']=2
                i_KBESwg['LevelInfo']['Svip']=2
                clearInterval(task)
            }catch(e){console.log('失败')}
        },1000)
    }
    // Your code here...
})();