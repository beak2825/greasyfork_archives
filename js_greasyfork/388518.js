
// ==UserScript==
// @name              维基百科用户屏蔽工具
// @namespace         https://github.com/Hyijun/wikipedia_cover
// @version           1.5.6
// @icon              https://zh.wikipedia.org/favicon.ico
// @description       维基百科上的一个用户屏蔽工具，它能删除一些您不希望看到用户的留言
// @author            Hyijun
// @license           GNU
// @supportURL        https://github.com/Hyijun/wikipedia_cover/issues
// @match             *://zh.wikipedia.org/wiki/Wikipedia*
// @match             *://zh.wikipedia.org/User_talk:*
// @match             *://zh.wikipedia.org/User:*
// @match             *://zh.wikipedia.org/*Talk*:*
// @match             *://zh.wikipedia.org/Talk:*
// @downloadURL https://update.greasyfork.org/scripts/388518/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/388518/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//By Hyijun. 如有问题请联系作者：https://github.com/Hyijun/wikipedia_cover/issues

//将你需要屏蔽的用户写在这个数组中，以逗号（半角）分隔，名字用双引号（半角）包围起来，不需要User:前缀
//例子：var users = new Array("User1", "User2", "User3");
var users = new Array("Any_user");

//如果您不熟悉js语言，请不要修改以下代码
var url = window.location.href;
var matre = /.*?zh.wikipedia.org\/wiki\/(Wikipedia.*?|User_talk:.*?|User:.*?|.*?Talk.*?:.*?|Talk:.*?)/img;
if (!matre.test(url)){
    console.log("因为处于条目空间，屏蔽工具未运行。");
}else{
    var res_1 = new Array();
    console.log("屏蔽工具正在运行。");
    var users_name = "";
    for (var each in users){
        if (each != (users.length - 1)){
            users_name = users_name + users[each] + "|";
        }else{
            users_name = users_name + users[each];
        }
    }
    var s1 = document.getElementById("mw-content-text").innerHTML;
    var re1 = new RegExp("<(p|dd|li|ul)>.*?User:(" + users_name +")[\\s\\S]*?</(p|dd|li|ul)>", "igm");
    s1 = document.getElementById("mw-content-text").innerHTML = s1.replace(re1, "<small><div>[已删除一段留言]</div></small>");
}