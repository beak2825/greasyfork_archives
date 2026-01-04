// ==UserScript==
// @name         广西干部网络学院-秒配合软件-vx:shuake345
// @namespace   vx:shuake345
// @version      vx:shuake345
// @description  代刷|自动换课|自动秒完
// @author       vx:shuake345
// @match        https://www.gxela.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxela.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522320/%E5%B9%BF%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E7%A7%92%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6-vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/522320/%E5%B9%BF%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E7%A7%92%E9%85%8D%E5%90%88%E8%BD%AF%E4%BB%B6-vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function BFY(){
        if(document.getElementsByTagName('video')!==null){
            document.getElementsByTagName('video')[0].play()
            setTimeout(gb,66000)
        }
    }
    setInterval(BFY,5222)

    function gb(){
    document.querySelector("#app > div > div> button > span").click()
        setTimeout(function(){document.querySelectorAll("body > div> div > div > div> button > span")[1].click()},2000)
    }
    // Your code here...
})();