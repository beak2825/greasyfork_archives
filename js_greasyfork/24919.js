// ==UserScript==
// @name         Hide torrent's comment in byrbt
// @namespace    http://blog.rhilip.info/
// @version      20161117
// @description  Just hide it!!
// @author       Rhilip
// @match        http*://bt.byr.cn/details.php*
// @icon         http://bt.byr.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24919/Hide%20torrent%27s%20comment%20in%20byrbt.user.js
// @updateURL https://update.greasyfork.org/scripts/24919/Hide%20torrent%27s%20comment%20in%20byrbt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("td#outer > table.main:last").before('<input class="btn" type="button" id="showbutton" value="显示评论">').hide();  //捕捉种子界面评论区并隐藏，在其上添加“显示评论”按钮
    $('input#showbutton').click(function(){         //为按钮添加点击事件
        $("td#outer > table.main").toggle();        //显示隐藏的评论区
        $('input#showbutton').remove();             //移除“显示评论”按钮
    });
})();