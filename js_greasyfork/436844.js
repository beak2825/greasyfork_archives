// ==UserScript==
// @name iflytek sns block
// @namespace maiya
// @version 0.1
// @description 屏蔽论坛'jg',并转换为其它语句
// @author maiya
// @match https://in.iflytek.com/iflyteksns/forum/web/snsDoc/detail/*
// @icon https://www.google.com/s2/favicons?domain=github.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436844/iflytek%20sns%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/436844/iflytek%20sns%20block.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function replaceJG(){
        var ul_tags = $(".table-content>table .plate-content");
        if (ul_tags) {
            ul_tags.each(function(index,ul_tag){
                ul_tag.innerHTML=ul_tag.innerHTML.replace(/jg/g,"我是煞笔")
                ul_tag.innerHTML=ul_tag.innerHTML.replace(/JG/g,"我是煞笔")
                ul_tag.innerHTML=ul_tag.innerHTML.replace(/Jg/g,"我是煞笔")
                ul_tag.innerHTML=ul_tag.innerHTML.replace(/jG/g,"我是煞笔")
            });

        }
    }
    replaceJG();
})();
