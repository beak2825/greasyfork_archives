// ==UserScript==
// @name     北大未名 屏蔽用户
// @namespace PkuBbsUserBlock
// @version  1.0.0
// @author ration
// @description 屏蔽指定用户的发言楼层
// @match  http://bbs.pku.edu.cn/*
// @match  https://bbs.pku.edu.cn/*
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447508/%E5%8C%97%E5%A4%A7%E6%9C%AA%E5%90%8D%20%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/447508/%E5%8C%97%E5%A4%A7%E6%9C%AA%E5%90%8D%20%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==
const BLOCK_USERS = ["Virtualize","Kindness","KakaHiguain"] //请在此手动添加你想屏蔽的（贴子中上面一行的）用户名（，而非下面一行较小的昵称）并保存。例：["ration","user1"]

const block = () => {
    const obj_posts = document.getElementsByClassName("post-card")
    for (var obj_post of obj_posts) {
        var str_username = obj_post.getElementsByClassName("username")[0].firstChild.innerText //该楼用户名
        var flag2=false
        if(obj_post.getElementsByClassName("quotehead").length){
            var str_quote = obj_post.getElementsByClassName("quotehead")[0].innerText //该楼所引用楼层的第一行，包含用户名
            var str_username2 = str_quote.split(" (")[0]
            flag2 = BLOCK_USERS.indexOf(str_username2) != -1
        }
        if (BLOCK_USERS.indexOf(str_username) != -1 || flag2) {
            var parent = obj_post.parentElement;
            parent.removeChild(obj_post);
        }

//         var but = document.createElement('button')
//         obj_post.getElementsByClassName("line wide-btn")[0].appendChild(but)
//         but.innerText = "屏蔽"
//         but.addEventListener("click", butFun)
//         function butFun(){

//         }

    }
}

//-------------main--------------------
block();
new MutationObserver(block).observe(document.documentElement, { childList: true, subtree: true });
