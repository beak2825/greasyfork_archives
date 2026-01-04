// ==UserScript==
// @name         MCBBS自定义板块收藏栏
// @namespace    http://fang.blog.miri.site/
// @version      1.3
// @icon         https://s2.ax1x.com/2020/02/25/3twNzq.png
// @description  自定义收藏栏
// @author       Mr_Fang
// @match        https://www.mcbbs.net/forum.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406631/MCBBS%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9D%BF%E5%9D%97%E6%94%B6%E8%97%8F%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406631/MCBBS%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9D%BF%E5%9D%97%E6%94%B6%E8%97%8F%E6%A0%8F.meta.js
// ==/UserScript==

(function() {

    var code = '';
    /*
    / 关于板块ID：
    /    以茶馆为例，茶馆的地址是：
    /       https://www.mcbbs.net/forum-chat-1.html
    /    链接中的“chat”即为茶馆的板块ID
    */

    var list = [
        ['第一个板块','ID','这里是描述'],
        ['第二个板块','ID','这里是描述'],
        ['第三个板块','ID','这是是描述']
    ]

    if (list.length%2 != 0){
        list.push(['占位','','我是用来占位的'])
        // emmmm，如果数组长度不是偶数在下面for循环的时候会出bug
        // 下个版本（可能会有吧）修
    }
    console.log(list);
    for(var i=0; i<list.length; i+=2){
        code = code + '<tr><td class="fl_g" width="49.9%"><div class="fl_icn_g" style="width: 68px;"><a href="forum-' + list[i][1] + '-1.html"><img src="https://attachment.mcbbs.net/common/ee/common_185_icon.png" align="left" alt=""></a></div><dl style="margin-left: 68px;"><dt><a href="forum-' + list[i][1] + '-1.html">' + list[i][0] + '</a></dt><dd><em>' + list[i][2] + '</em></dd></dl></td><td class="fl_g" width="49.9%"><div class="fl_icn_g" style="width: 68px;"><a href="forum-' + list[i+1][1] + '-1.html"><img src="https://attachment.mcbbs.net/common/ee/common_185_icon.png" align="left" alt=""></a></div><dl style="margin-left: 68px;"><dt><a href="forum-' + list[i+1][0] + '-1.html">' + list[i+1][0] + '</a></dt><dd><em>' + list[i+1][2] + '</em></dd></dl></td></tr>';
    };


    
    if(list.length != 0){
        jq('.mn').prepend('<div class="bm bmw  flg cl"><div class="bm_h cl"><span class="o"><img id="category_0_img" src="https://www.mcbbs.net/template/mcbbs/image/collapsed_no.gif" title="收起/展开" alt="收起/展开" onclick="toggle_collapse(\'category_0\');"></span><h2>我收藏的版块</h2></div><div id="category_0" class="bm_c" style=""><table cellspacing="0" cellpadding="0" class="fl_tb"><tbody>' + code + '</tbody></table></div></div>');
    }

})();