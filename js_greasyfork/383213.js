// ==UserScript==
// @name           hassbian auto reply
// @name:zh-CN     hassbian自动回复
// @author         brilon
// @namespace      hassbian-auto-reply
// @description    hassbian post auto reply
// @description:zh-cn    hassbian提交自动回复
// @version        1.1
// @create         2019-05-18
// @include        *://bbs.hassbian.com/thread*
// @include        *://bbs.hassbian.com/forum.php?mod=viewthread&tid=*
// @include        *://bbs.hassbian.com/forum.php?mod=post&action=reply&fid=*
// @include        *://bbs.hassbian.com/forum.php?mod=post&action=newthread&fid=*
// @copyright      2019, brilon
// @downloadURL https://update.greasyfork.org/scripts/383213/hassbian%20auto%20reply.user.js
// @updateURL https://update.greasyfork.org/scripts/383213/hassbian%20auto%20reply.meta.js
// ==/UserScript==
// 

(function () {

    var _Q = function (d) {
        return document.querySelector(d)
    };
    var w = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;

    function $(id) {
        return !id ? null : document.getElementById(id);
    }
    
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
        
    //discuz_uid fid tid
    if (w.discuz_uid > 0 || _Q('#um')) { //是否登录，否则退出
        var texts = new Array("感谢楼主分享,收下了",
            "楼主说的对",
            "大佬牛B,膜拜",
            "酱油党路过,并水了一帖",
            "感谢楼主分享！！！！",
            "厉害了word楼主！！！！");
        var sidebarSpan = document.createElement("span");
        var sidebarLink = document.createElement("a");
        sidebarLink.id = 'autoreply';
        sidebarLink.textContent = "回复";
        sidebarLink.style = 'background: none;padding-top: 10px;padding-bottom: 0px;';
        sidebarSpan.appendChild(sidebarLink);
        var sidebar = $('scrolltop');
        sidebar.appendChild(sidebarSpan);

        

        sidebarLink.onclick = function () {
            var postPanel = $('postlist');
            if (postPanel === undefined || postPanel === null) {
                return;
            }
            var posts = $('postlist').innerText;
            if (posts.indexOf('如果您要查看本帖隐藏内容请回复') != -1) {
                var fastpostmessage = document.getElementById("fastpostmessage");
                var rand = getRandomInt(6);
                fastpostmessage.textContent = texts[rand];

                var start = document.getElementsByClassName('plhin').length;
                var retry = 0;
                var intervalId = setInterval(function () {
                    if (retry >= 10) {
                        clearInterval(intervalId);
                        return;
                    }
                    retry++;
                    var end = document.getElementsByClassName('plhin').length;
                    if (end === start) {
                        return;
                    } else {
                        clearInterval(intervalId);
                        setTimeout(function () {
                            window.scrollTo('0', '0');
                        }, 2000);
                    }
                }, 500);
                var btn = document.getElementById("fastpostsubmit");
                btn.click();
            }
        }


    }

})();