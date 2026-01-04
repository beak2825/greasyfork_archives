// ==UserScript==
// @name         Wechat Push Alert
// @namespace    https://github.com/Cloudiiink/WechatPushAlert
// @version      0.2
// @description  Wechat Push Alert before you push the article
// @author       Cloudiiink
// @include      *://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371277/Wechat%20Push%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/371277/Wechat%20Push%20Alert.meta.js
// ==/UserScript==

// let the page wait
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

(function() {
    'use strict';
    // 检查页面内是否有群发按钮
    if (document.getElementById('send_btn_main') != null) {
        // Add check button
        var checkbtn = document.createElement("input");
        checkbtn.setAttribute("type", "button");
        checkbtn.setAttribute("value", "推前检查");
        checkbtn.style.display = "inline-block";
        checkbtn.style.borderRadius = "3px";
        checkbtn.style.height = "32px";
        checkbtn.style.width = "110px";
        checkbtn.style.align = "center";
        checkbtn.style.marginLeft = "14px";
        checkbtn.style.marginBottom = "10px";
        checkbtn.style.background = "#e82f28";
        checkbtn.style.color = "white";
        document.getElementById("send_tips_main").appendChild(checkbtn)

        // button event
        checkbtn.addEventListener("click", function() {
            if (confirm("我们的文章原创标了么？") === true) {
                sleep(400);
                if (confirm("转载的格式都对么？") === true) {
                    sleep(400);
                    if (confirm("推前大佬们确认过了么？") === true) {
                        sleep(400);
                        if (confirm("要修改的地方全都改了么？") === true) {
                            sleep(400);
                            if (confirm("看一眼昨天的推送，真的什么都没有落下了？") === true) {
                                sleep(400);
                                if (confirm("以防万一，再点进预览里看一眼吧！") === true) {
                                    sleep(400);
                                    if (confirm("真的啥问题都没了！") === true) {
                                        sleep(400);
                                        alert("勇敢地去点下那个群发按钮吧！没什么好怕的了！");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
})();