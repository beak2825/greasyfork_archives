// ==UserScript==
// @name         研修刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hsua yanciuu.com
// @author       kakasearch
// @match        http://i.yanxiu.com/uft/course/courseview*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yanxiu.com
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/436465/%E7%A0%94%E4%BF%AE%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436465/%E7%A0%94%E4%BF%AE%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    function videoo(){
      $('video')[0].addEventListener('pause',function(){
                $('video')[0].play()})
        $('video')[0].addEventListener('ended',function(){
               $('video')[0].play()
                setTimeout(function(){
                    new ElegantAlertBox('已自动恢复，如需暂停，请先取消刷课 >__<')},2000)
        })
        document.querySelector(".vjs-big-play-button").click()
    }
    var tmp = setInterval(function(){
        if ($("video")) {
           clearInterval(tmp)
            videoo()
        }
    },500)

    var tmp1 = setInterval(function(){
        let a = document.querySelector("body > div.body-content > div.clock-tip")
        if (a.style.display=="block") {
            console.log("click")
           a.click()
        }
    },5000)

    // Your code here...
})();