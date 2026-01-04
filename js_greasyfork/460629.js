// ==UserScript==
// @name         博客犇犇插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  被禁言用户使用博客发送犇犇的替代方案
// @license      GPL-3.0
// @author       LiuTianyou
// @match        https://www.luogu.com.cn/
// @grant        unsafeWindow
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/markdown-it/13.0.1/markdown-it.min.js
// @downloadURL https://update.greasyfork.org/scripts/460629/%E5%8D%9A%E5%AE%A2%E7%8A%87%E7%8A%87%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/460629/%E5%8D%9A%E5%AE%A2%E7%8A%87%E7%8A%87%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
window.csrf = "";
$.get("https://www.luogu.com.cn/blogAdmin/article/new", function(data){
    var doc = window.parser.parseFromString(data, "text/html");
    window.csrf = doc.getElementsByName("csrf-token")[0].value;
    console.log("Get! csrf-token = " + window.csrf);
});
window.parser = new DOMParser();
window.markdown = window.markdownit();
window.sendBlog = function(){
    var msg = document.getElementById('feed-content').value;
    $.ajax({
        method: "POST",
        url: "https://www.luogu.com.cn/blogAdmin/article/post_new",
        data: {
            "title": "【博客犇犇插件】一条博客犇犇",
            "content": "[start]" + msg,
            "identifier": Math.random().toString(36).slice(-8),
            "type": "博客犇犇",
            "top": 0,
            "status": 2,
            "csrf-token": window.csrf
        },
    });
    var event = document.createEvent("MouseEvents");
    event.initEvent("click", true, true);
    document.getElementById('feed-content').value = "";
    document.querySelector("li[data-mode='watching']").dispatchEvent(event);
}
setTimeout(function(){
    var benben = document.querySelector('.lg-index-benben');
    var submit = document.createElement('button');
    submit.className = "am-btn am-btn-danger am-btn-sm";
    submit.innerText = "发送博客犇犇！";
    submit.addEventListener("click", window.sendBlog);
    benben.children[2].appendChild(submit);
    setInterval(function(){
        var contents = document.getElementById("feed");
        for(var i = 0; i < contents.children.length; i++){
            if(contents.children[i].children[1] != undefined){
                var bc = contents.children[i].children[1].children[1].innerHTML;
                if(bc.search("【博客犇犇插件】一条博客犇犇") != -1){
                    bc = bc.replace(/[\s\S]*<blockquote>[\s\S]*<br><br>[\s\S]*\[start\]/, "");
                    bc = bc.replace(/[\s]*<\/blockquote>[\s\S]*/, "");
                    if(bc.search("【博客犇犇插件】一条博客犇犇") == -1){
                        contents.children[i].children[1].children[1].innerHTML = window.markdown.render(bc);
                        var reply = document.createElement('a');
                        reply.name = "feed-reply";
                        reply.setAttribute("onclick", "scrollToId('feed-content'); document.getElementById('feed-content').value = ' || @" + contents.children[i].children[1].children[0].children[0].children[0].innerText + ": " + bc + "';");
                        reply.innerText = "回复";
                        contents.children[i].children[1].children[0].children[0].appendChild(reply);
                    }
                }
            }
        }
    }, 200);
}, 1100);