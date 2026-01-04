// ==UserScript==
// @name         美和易思课堂
// @namespace    http://ku-m.cn/
// @version      1.0.1
// @description  对 http://uee.me/c8aqE，进行简单的修改。感谢原作者！
// @author       枯木
// @match        http://www.51moot.net/server_hall_2/server_hall_2/video_play?dir_id=*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=637587
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_notification

// @downloadURL https://update.greasyfork.org/scripts/392053/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/392053/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==


(function() {
    window.onblur =null;
    document.title='脚本注入成功。'
    var myTimer=setInterval(cheack_time,1000);
  
    function cheack_time(){
        if( !player.j2s_resumeVideo){
            location.reload();
        }        
        if(player.j2s_getDuration()!=0){         
          if (player.j2s_getDuration() <= player.j2s_realPlayVideoTime()) {
            if ($(".active").next().html() == undefined) {
                
                var next = $(".active").parents("div").parents("div").next().children("div").children("ul");
                var nexth = next.html()
                if (RegExp(/湖北美和易思教/).test(nexth)) {

                    clearInterval(myTimer);
                    console.log("结束");
                } else {
                    next.children("li").eq(0).click()
                }
            } else {
                $(".active").next().click();
            }



        }
          
        }

        
    }



})();
