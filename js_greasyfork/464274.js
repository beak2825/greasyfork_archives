// ==UserScript==
// @name         Youtube净化留言区
// @namespace    妖伊社
// @version      0.3
// @description  隐藏视频下方的“相关视频”栏，屏蔽中文区常见的引战留言。
// @author       妖伊社
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464274/Youtube%E5%87%80%E5%8C%96%E7%95%99%E8%A8%80%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/464274/Youtube%E5%87%80%E5%8C%96%E7%95%99%E8%A8%80%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fw = ["黨","中國","人礦","習","民主","支那","hina","獨裁","牆國"];

    function filterComments(){
        var cs = document.getElementsByClassName("style-scope ytd-comment-renderer");
        for (var i=0; i < cs.length; i++)
        {
            try {
                var n = cs[i].innerHTML;
                if (n.length<2 || n.indexOf("</")>0 || n.indexOf("><")>0) {continue;}
                for(var j=0; j<fw.length; j++){
                    if (n.indexOf(fw[j])>0) {
                        cs[i].innerHTML = "（和谐词："+fw[j]+"）";
                    }
                }
            }
            catch (e) {
                continue;
            }
        }
        setTimeout(function() { filterComments(); }, 1000);
    }
    function hideRelated(){
        var rs = document.querySelectorAll("#contents");
        for (var i=0; i < rs.length; i++)
        {
            try {
                if (rs[i].className=="style-scope ytd-item-section-renderer")
                {
                    var childs = rs[i].childNodes;
                    if (childs[0].tagName=="YTD-COMPACT-VIDEO-RENDERER"){
                        rs[i].innerHTML="";
                    }
                }
            }
            catch (e) {
                continue;
            }
        }
        setTimeout(function() { hideRelated(); }, 1000);
    }

    filterComments();
    hideRelated();
})();