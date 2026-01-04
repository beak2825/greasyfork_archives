// ==UserScript==
// @name         网盘资源社助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动回复隐藏贴
// @author       You
// @license      MIT
// @match        *://www.wpzysq.com/thread-*.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wpzysq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480435/%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%A4%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/480435/%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E7%A4%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isLogin;
    // 随机回复帖子的内容
    var replyList = [
        "感谢楼主分享的内容！",
        "感谢分享！给你点赞！",
        "感谢分享！论坛因你更精彩！",
        "看看隐藏内容是什么！谢谢！",
        "楼主一生平安！好人一生平安！",
        "你说的观点我也很支持！",
        "楼主太棒了！我先下为敬！",
        "给楼主点赞，希望继续分享！",
        "感谢论坛，感谢LZ热心分享！",
        "感谢楼主分享优质内容，希望继续努力！",
        "这么好的东西！感谢楼主分享！感谢论坛！",
        "希望楼主继续分享更多好用的东西！谢谢！",
        "看到楼主这么努力分享，我只能顶个贴感谢一下了！",
        "好东西，拿走了，临走顶个贴感谢一下楼主！",
        "这就非常给力了！感谢分享！",
        "厉害了！先收藏，再回复！谢谢！"
    ];
    function checkLogin(){
        if($('.btn-outline-ssecondary').length){
            isLogin = false
        }
        else{
            isLogin = true;
        }
    }

    checkLogin();

    function autoReply(){
		if($('.alert-warning').length){
            writeReply();
		}
	}

	if(isLogin)
	{
		autoReply();
	}

    function writeReply(){
        let textarea = document.getElementById('message');
        if (textarea){
            textarea.value = textarea.value + replyList[Math.floor((Math.random()*replyList.length))] + replyList[Math.floor((Math.random()*replyList.length))];
            let fastpostsubmit = document.getElementById('submit');
            if (fastpostsubmit){
                fastpostsubmit.click();
            }
        }
    }
})();