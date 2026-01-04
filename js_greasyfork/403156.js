// ==UserScript==
// @name         百家号文章标题h[x]层级标准化
// @namespace    https://mbd.baidu.com
// @version      0.2
// @description  修正百家号文章的层级，配合copy as markdown插件食用
// @author       dexfire
// @icon         https://q2.qlogo.cn/headimg_dl?dst_uin=275176629&spec=5
// @match        https://mbd.baidu.com/newspage/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403156/%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98h%5Bx%5D%E5%B1%82%E7%BA%A7%E6%A0%87%E5%87%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/403156/%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98h%5Bx%5D%E5%B1%82%E7%BA%A7%E6%A0%87%E5%87%86%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // replace the Elements with $(src) with a tag with type of dist.
    // such as `replace_tag('bjh-h3', 'h3')`
    function replace_tag(src, dist){
        var jsrc = $('.' + src);
        jsrc.each(function(){
            var e = $(this);
            var p = $('<p></p>');
            var jdist = $('<' + dist + ' class="' + src + '"></' + dist +'>');
            jdist.append(e.contents());
            p.append(jdist);
            if (e.parent() !== null){
                e.parent().after(p);
                e.parent().remove();
            }
        });
    }

    replace_tag('bjh-h3', 'h2');
    replace_tag('bjh-blockquote', 'quote');
})();