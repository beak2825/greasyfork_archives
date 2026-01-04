// ==UserScript==
// @name         智慧树
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       不二
// @match        http://study.zhihuishu.com/learning/videoList?courseId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40716/%E6%99%BA%E6%85%A7%E6%A0%91.user.js
// @updateURL https://update.greasyfork.org/scripts/40716/%E6%99%BA%E6%85%A7%E6%A0%91.meta.js
// ==/UserScript==

var fa=$("body");
var btn=$("<li></li>");
var json={
    "background":"#31e16d",
    "height":"16px",
    "padding":"5px",
    "cursor": "pointer",
    "top":"300px",
    "right":"80px",
    "position": "fixed"
};
btn.css(json);
btn.html("<span id='lfsenior'>开启自动播放模式</span>");
fa.append(btn);
var bodywidth=$("#body").css("width");
var mainwidth=$("#main").css("width");
btn.click(function () {
    $("#lfsenior").html("自动模式已开启");
    //关闭弹题
    setInterval(function(){
        $(".popboxes_close").click();
        //获取当前进度
        var spans=$(".current_play span");
        var progress=spans[spans.size()-1].innerHTML;
        document.getElementsByClassName('speedTab15')[0].click();
        if("100"==progress.substring(progress.lastIndexOf("『")+1,progress.lastIndexOf("』")-1)){
            //播放完毕
            $(".next_lesson a").click();
            document.getElementsByClassName('speedTab15')[0].click();
        }else{
            $("#vjs_mediaplayer_html5_api")[0].play();
            $("#vjs_mediaplayer_html5_api")[0].muted=true;
            document.getElementsByClassName('speedTab15')[0].click();
        }
        $("#lfsenior").html("自动模式已开启,本章进度:"+progress+"%");
        document.getElementsByClassName('speedTab15')[0].click();
    },100);
});