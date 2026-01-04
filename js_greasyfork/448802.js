// ==UserScript==
// @name         ShowComments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将非公开的备注修改为不用鼠标移进区域即显示 并修改提示使其更易理解
// @author       InfSein
// @match        *://bbs.nga.cn/read.php?*
// @match        *://bbs.nga.cn/nuke.php?func=ucp&u*
// @match        *://ngabbs.com/read.php?*
// @match        *://ngabbs.com/nuke.php?func=ucp&u*
// @match        *://nga.178.com/read.php?*
// @match        *://nga.178.com/nuke.php?func=ucp&u*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448802/ShowComments.user.js
// @updateURL https://update.greasyfork.org/scripts/448802/ShowComments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function (){
        if(__GP && !__GP.greater){
            console.log('[ShowComments] Load fail: 权限不够 需要GREATER权限');
            return;
        }
        if(document.location.href.match('read.php')){
            const blocks = document.querySelectorAll('.block_txt_c3');
            for(var i = 0;i<blocks.length;i++){
                if(blocks[i].className == 'block_txt block_txt_c3 nobr' && !blocks[i].title.match('公开备注')){
                    blocks[i].onmouseout = "";
                    blocks[i].title = '非公开的备注 仅版主可见'
                    blocks[i].firstChild.style = "";
                }
            }
        }
        else{
            const blocks = document.querySelectorAll('.gray');
            var intent = undefined;
            for(i = 0;i<blocks.length;i++){
                if(blocks[i].innerHTML == '版主可见,用户信息备忘,添加/删除备注可能在一天后方能生效'){
                    intent = blocks[i].parentNode.children[1].children[0].children;
                }
            }
            if(intent == undefined) return;
            for(i = 0;i<intent.length;i++){
                if(intent[i].onmouseout != null){
                    console.log(intent[i].onmouseout);
                    intent[i].title = '非公开的备注 仅版主可见';
                    intent[i].onmouseout = '';
                    intent[i].firstChild.style = '';
                }
            }
        }
    },100);
})();