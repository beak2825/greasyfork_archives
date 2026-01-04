// ==UserScript==
// @name         XXXX大学网络教育视频自动连续播放视频插件
// @namespace    http://andot.org/
// @version      2.1
// @description  有些同学确实没有时间看视频，所以我就写了此脚本，在github开源了，欢迎star https://github.com/andotorg/UpolX
// @author       andot
// @match        http://xl.upol.cn/study/directory.aspx?*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375110/XXXX%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/375110/XXXX%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
     /**
      * video auto paly
      * anthor: andot
      * date: 2018-3-31 14:36:57
      */
    setTimeout(function(){
        document.getElementsByClassName("am-topbar-brand")[0].innerHTML = "<div style='line-height:68px; color:#F00;'>当前页面已使用蚁点视频自动播放插件";
        console.log("蚁点视频自动播放插件开始工作");
        try {
            jwplayer(0).play(true);
            var inter = setInterval(inters, 1000);
            function inters(){
                var state = jwplayer().getState();
                console.log(state);
                if(state == "complete"){
                    var nextVideo = $(".active").attr("title");
                    console.log("视频播放完成");
                    $(".cell_info").each(function(){
                        console.log($(this).find("a").attr("class"));
                        if($(this).find("a").attr("class") == "active"){
                            console.log("准备播放下一个视频");
                            console.log($(this).parents(".tr_topic").next().find(".cell_info").text());
                            $(this).parents(".tr_topic").next().find(".cell_info").click();
                            var nowVideo = $(".active").attr("title");
                            if(nextVideo == nowVideo){
                                console.log("此视频到了一个小单元最后，应该进入下一个单元");
                                $(this).parents(".sh-toc3").next().next().find(".cell_info")[0].click();
                            }
                            jwplayer(0).play(true);
                            console.log($(".active").attr("title")+"视频下一个开始播放");
                            setTimeout(function(){
                                $('.am-modal-btn').click();
                            }, 2000);
                            return false;
                        }
                        //console.log($(this).html());
                    });
                }else if(state == "playing")
                    console.log($(".active").attr("title")+"视频正在播放");
            }
        } catch (error) {
            console.log("此页面不会使用插件"+error);
        }
    }, 5000)


    // Your code here...
})();