// ==UserScript==
// @name         北理乐学视频下载助手
// @namespace    https://www.ordosx.tech/
// @version      1.0
// @description  将课程列表的播放页面链接替换成视频文件下载链接！
// @author       OrdosX
// @match        http://lexue.bit.edu.cn/course/view.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422933/%E5%8C%97%E7%90%86%E4%B9%90%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422933/%E5%8C%97%E7%90%86%E4%B9%90%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let icon =
`<svg viewBox="0 0 16 16" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" style="margin-left: 0.2em; margin-right: 0.5em; stroke: #3e65a0; width: 1em;">
  <g>
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
  </g>
</svg>`;

    window.addEventListener('load', function() {
        $('li.activity.resource.modtype_resource a').each(
            function(i, e){
                if($(e).children('img')[0].src.match(/mpeg/)!=null){
                    $.ajax({
                        url:e.href,
                        async:true,
                        success:(result)=>{
                            if(result.match(/http(\S*).mp4/) != null) {
                                $(e).attr('href',result.match(/http(\S*).mp4/)[0]);
                                $(e).attr('download',"");
                                $(e).children('img')[0].remove();
                                $(e).prepend(icon)
                            }
                        }
                    })
                }
            }
        )
        $('li.activity.page.modtype_page a').each(
            function(i, e){
                $.ajax({
                    url:e.href,
                    async:true,
                    success:(result)=>{
                        if(result.match(/http(\S*).mp4/) != null){
                            $(e).attr('href',result.match(/http(\S*).mp4/)[0]);
                            $(e).attr('download',"");
                            $(e).children('img')[0].remove();
                            $(e).prepend(icon)
                        }
                    }
                })
            }
        )
    });
})();