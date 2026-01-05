// ==UserScript==
// @name ed2k_get
// @namespace   https://github.com/weakiwi
// @description ed2k_get_totoword
// @author weakiwi
// @version 1
// @run-at document-idle
// @include http://www.totoword.com/gongxiang/*
// @grant GM_setClipboard
// @require http://cdn.bootcss.com/jquery/3.1.0/jquery.js

// @downloadURL https://update.greasyfork.org/scripts/23501/ed2k_get.user.js
// @updateURL https://update.greasyfork.org/scripts/23501/ed2k_get.meta.js
// ==/UserScript==

var a = function(){
    $('#btncopy').click(
        function(){
            var clip_content = "";
            $("a[href^=ed2k]").each(
                function(){
                    clip_content = clip_content + $(this).attr('href');
                }
            );
            GM_setClipboard(clip_content);
            alert("复制成功");
        }
    );
    };
a();