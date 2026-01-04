// ==UserScript==
// @name            清华选课系统显示优化
// @name:zh         清华选课系统显示优化
// @name:en         Tsinghua Course Reg. System Patch
// @namespace       http://clzls.github.io/
// @version         0.2.3
// @description     暴力拓宽清华选课系统窗口的长度。
// @description:zh  暴力拓宽清华选课系统窗口的长度。
// @description:en  Broaden the iframe of Tsinghua Course Registration System.
// @author          clzls
// @match           http://zhjwxk.cic.tsinghua.edu.cn/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/369394/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/369394/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var HtmlController = {
        Enlarge:function(){
            var prefix = "width:100%;height: ";
            var ratio = 39; // 单个条目对应的像素高度。
            var ul_tag = document.getElementById('iframe1');
            var content1 = document.getElementById('content_1');
            var tmp,tmpo2;
            if (ul_tag)
            {
                ul_tag.style="min-width: 1024px; height: 1285px;";
            }
            if (content1)
            {
                tmp = content1.childNodes[1].childNodes[1].childElementCount;
                if (tmp && tmp > 0)
                {
                    content1.style = prefix.concat(tmp * ratio + 100,"px;overflow-y:visible;overflow-x:visible;margin-right:0px;");
                    if (ul_tag) ul_tag.style="min-width: 1024px; height: ".concat(tmp * ratio + 200,"px;");
                }
            }
        }
    };
    HtmlController.Enlarge();
})();