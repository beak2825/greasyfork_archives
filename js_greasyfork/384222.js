// ==UserScript==
// @name         美和易思课堂
// @namespace    http://www.9frd.com/
// @version      1.0.0
// @description  美和易思课堂自动播放 进行下一节 屏蔽鼠标限制
// @author       废人岛
// @icon         https://www.wandhi.com/favicon.ico
// @match        http://www.51moot.net/server_hall_2/server_hall_2/video_play?dir_id=*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://greasyfork.org/scripts/373336-layer-wandhi/code/layer_wandhi.js?version=637587
// @grant        GM_setClipboard
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification

// @downloadURL https://update.greasyfork.org/scripts/384222/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/384222/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==




(function() {



    var css=$('     <style type="text/css">                .frd-box {            height: 150px;            width: 170px;            position: fixed;            background-color: #fff;            left: 5px;            top: 50%;            border-radius: 10px;            border: 1px solid #ffd200;            text-align: center;            padding: 10px;            padding-top:15px;        }        .frd-font {            color: #000;            text-shadow: 1px 1px 0 #ffd200;        }        .frd-box div {            text-align: left;            padding-left: 5px;        }        .frd-box span {            display: inline-block;            width: 110px;            height: 32px;            border: 2px solid #ffd200;            margin: 15px;        }            .frd-box span a {                width: 100%;                height: 100%;                display: inline-block;                border: 1px solid #000;                background-color: #fff;                color: #000;                text-shadow: 1px 1px 0 #ffd200;                font-size: 14px;                text-decoration: none;                line-height: 32px;            }    </style>');
    var html=$('  <div class="frd-box frd-font">        <p class="frd-font" style="margin-bottom: 5px;">网课辅助-By(9Frd.Com)</p>        <div>            <label>总时长：</label><label id="sun-time">2000</label>S        </div>        <div>            <label>现时长：</label><label id="new-time">0</label>S        </div>        <span>            <a title="官网"  target="_blank" value="官网" href="http://www.9frd.com">官网</a>        </span>    </div>');
    $("body").append(css);
    $("body").append(html);


    var myTimer=setInterval(cheack_time,2000);




    function cheack_time(){


        if( !player.j2s_resumeVideo){
            location.reload();
        }





        // console.clear()

        //console.log(player.j2s_getDuration()+" "+ player.j2s_realPlayVideoTime())

        document.getElementById("sun-time").innerText = player.j2s_getDuration();
        document.getElementById("new-time").innerText =player.j2s_realPlayVideoTime();


        player.j2s_setVolume(0);
        player.j2s_resumeVideo();


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










    // Your code here...
})();

