// ==UserScript==
// @name         西瓜视频自动点赞回复评论
// @namespace    http://tampermonkey.net/
// @version      0.87
// @description  自动回复西瓜视频的评论
// @author       cpp
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @match        https://studio.ixigua.com/comment
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toutiao.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442100/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%9B%9E%E5%A4%8D%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/442100/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%9B%9E%E5%A4%8D%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

/*/
var importJs=document.createElement('script')  //在页面新建一个script标签
importJs.setAttribute("type","text/javascript")  //给script标签增加type属性
importJs.setAttribute("src", 'https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js') //给script标签增加src属性， url地址为cdn公共库里的
document.getElementsByTagName("head")[0].appendChild(importJs) //把importJs标签添加在页面
//*/

window.onload = function() {
    setTimeout(function(){

        function sleep(delay) {
          var start = (new Date()).getTime();
          while ((new Date()).getTime() - start < delay) {
            continue;
          }
        }
        
        function post(commentId, userId, comment) {
            var da = {
                "ReplyToCommentId": commentId,
                "ReplyToReplyId": 0,
                "ReplyToUserId": userId,
                "Content": comment,
                "ImageList": []
            };

            $.ajax({
                type: "POST",
                url: "https://studio.ixigua.com/api/comment/CommentReply",
                contentType: "application/json charset=utf-8",
                data: JSON.stringify(da),
                headers: {
                  "accept": "*/*",
                  "content-type": "application/json"
                },
                dataType: "json",
                success: function (message) {
                  console.log("msg:" + JSON.stringify(message));
                },
                error: function (message) {
                    console.error("" + message)
                }
            });
        }

        function clickButton(){
            var comments=[
                "[玫瑰][玫瑰][玫瑰]",
                "[比心][比心][比心]",
                "[祈祷][祈祷][祈祷]",
                "感谢支持[玫瑰][玫瑰][玫瑰]",
                "感谢支持[比心][比心][比心]",
                "感谢支持[祈祷][祈祷][祈祷]",
                "感恩支持[玫瑰][玫瑰][玫瑰]",
                "感恩支持[比心][比心][比心]",
                "感恩支持[祈祷][祈祷][祈祷]",
                "谢谢您的支持[比心][比心][比心]",
                "谢谢支持，愿您平安健康，[祈祷][祈祷][祈祷]",
                "感恩支持，祝您幸福快乐，[玫瑰][玫瑰][玫瑰]",
                "感恩支持，祝您万事胜意，[比心][比心][比心]",
                "感谢支持，祝您天天开心，笑口常开[祈祷][祈祷][祈祷]",
                "感谢支持，祝您幸福无限，百事可乐[祈祷][祈祷][祈祷]",
                "感谢支持，祝您永享幸福，财源滚滚[祈祷][祈祷][祈祷]",
                "感谢支持，祝您岁岁平安，蒸蒸日上[祈祷][祈祷][祈祷]",
                "感谢支持，祝您幸福安康，金玉满堂[祈祷][祈祷][祈祷]",
                "感谢支持，祝您顺心如意，大展宏图[祈祷][祈祷][祈祷]",
                "感谢支持，祝您心想事成，财源广进[祈祷][祈祷][祈祷]",
                "感谢支持，祝您幸福快乐，恭喜发财[祈祷][祈祷][祈祷]",
                "感恩支持，祝您天天开心，笑口常开[祈祷][祈祷][祈祷]",
                "感恩支持，祝您幸福无限，百事可乐[祈祷][祈祷][祈祷]",
                "感恩支持，祝您永享幸福，财源滚滚[祈祷][祈祷][祈祷]",
                "感恩支持，祝您岁岁平安，蒸蒸日上[祈祷][祈祷][祈祷]",
                "感恩支持，祝您幸福安康，金玉满堂[祈祷][祈祷][祈祷]",
                "感恩支持，祝您顺心如意，大展宏图[祈祷][祈祷][祈祷]",
                "感恩支持，祝您心想事成，财源广进[祈祷][祈祷][祈祷]",
                "感恩支持，祝您幸福快乐，恭喜发财[祈祷][祈祷][祈祷]",
                "感恩支持，祝您幸福美满，快乐永随[祈祷][祈祷][祈祷]",
                "感谢支持，祝您幸福平安，生意兴隆[祈祷][祈祷][祈祷]",
                "感谢支持，祝您快乐永随，吉祥如意[祈祷][祈祷][祈祷]",
                "感谢支持，祝您好事连连，万事胜意[祈祷][祈祷][祈祷]",
                "感谢支持，祝您福如东海，寿比南山[祈祷][祈祷][祈祷]",
                "感谢支持，祝您幸福如意，大展宏图[祈祷][祈祷][祈祷]",
                "感谢支持，祝您身体健康，财源滚滚[祈祷][祈祷][祈祷]",
                "感谢支持，祝您阖家安康，财源广进[祈祷][祈祷][祈祷]",
                "感谢支持，祝您阖家幸福，招财聚宝[祈祷][祈祷][祈祷]",
                "感谢支持，祝您一帆风顺，金玉满堂[祈祷][祈祷][祈祷]",
                "感谢支持，祝您大吉大利，大展宏图[祈祷][祈祷][祈祷]",
                "感谢支持，祝您好运连连，蒸蒸日上[祈祷][祈祷][祈祷]",
                "感谢支持，祝您寿与天齐，金玉满堂[祈祷][祈祷][祈祷]",
                "感谢支持，祝您身体倍儿棒，吃嘛嘛香[比心][比心][比心]"
            ];
            var START = 0;
            var END = comments.length;

            var userComments = $(".m-comment-item");
            var userImages = $(".user-img");
            var diggButtons = $(".m-digg-btn");
            for (var i=0; i<userComments.length; i++) {
                (function(i) {
                    setTimeout(function() {
                        var commentId = userComments[i].id;
                        var userImageUrl = userImages[i].href;
                        var userId = parseInt(userImageUrl.substring(userImageUrl.lastIndexOf("/")+1, userImageUrl.lastIndexOf("?")));
                        var randomIndex = Math.floor(Math.random()*(END-START));
                        var comment = comments[randomIndex];

                        console.log(i);
                        $(".m-digg-btn")[i].click();
                        post(commentId, userId, comment);
                    }, (i + 1) * 5000);
                })(i);
            }
        }

        var button = document.createElement("button");
        button.id = "reply-button";
        button.textContent = "一键点赞回复";
        button.style.width = "100px";
        button.style.height = "28px";
        button.style.align = "center";
        button.style.color = "white";
        button.style.background = "#e33e33";
        button.style.border = "1px solid #e33e33";
        button.style.borderRadius = "4px";
        document.getElementsByClassName("m-menu")[0].appendChild(button);

        document.addEventListener('click', event => {
            if (event.target.id == "reply-button") {
                event.stopPropagation();
                clickButton();
                console.log("开始点赞回复评论啦~~~");
                return;
            }
        }, true);

    }, 5000);
}
