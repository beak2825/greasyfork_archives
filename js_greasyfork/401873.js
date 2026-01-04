// ==UserScript==
// @name         PTA查询历史提交记录
// @namespace    269797689@qq.com
// @version      1.0
// @description  可以快速查询自己的所有历史提交记录
// @author       Rilomilo
// @match        https://pintia.cn/problem-sets*           
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/401873/PTA%E6%9F%A5%E8%AF%A2%E5%8E%86%E5%8F%B2%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401873/PTA%E6%9F%A5%E8%AF%A2%E5%8E%86%E5%8F%B2%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {

    $.ajax({
        type:"GET",
        url:"https://pintia.cn/api/u/current",
        dataType:"json",
        success:(info_obj)=>{
            timer=setInterval(() => {
                if($('.SecondarySidebar_31VUT').length!=0 && 
                    location.href.match(/problem-sets\/(\d+)/) &&
                    $('.SecondarySidebar_31VUT a:last').text()!="查看我的所有提交"
                ){
                    let pid=location.href.match(/problem-sets\/(\d+)/)[1];
                    $('.SecondarySidebar_31VUT').append(
                        '<a href="/problem-sets/'+pid+'/submissions?userId='+info_obj.user.id+'" class="item_1fnIV">'+
                            '<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em"'+
                            'viewBox="0 0 40 40" class="icon_2cd_3" style="vertical-align: middle;">'+
                                '<g><path d="m30.1 32.9q0-0.6-0.5-1t-1-0.5-1 0.5-0.4 1 0.4 1 1 0.4 1-0.4 0.5-1z m5.7 0q0-0.6-0.4-1t-1-0.5-1 0.5-0.5 1 0.5 1 1 0.4 1-0.4 0.4-1z m2.8-5v7.1q0 0.9-0.6 1.5t-1.5 0.6h-32.9q-0.8 0-1.5-0.6t-0.6-1.5v-7.1q0-0.9 0.6-1.6t1.5-0.6h9.6q0.4 1.3 1.5 2.1t2.5 0.8h5.7q1.4 0 2.5-0.8t1.6-2.1h9.5q0.9 0 1.5 0.6t0.6 1.6z m-7.2-14.5q-0.4 0.9-1.3 0.9h-5.7v10q0 0.6-0.5 1t-1 0.4h-5.7q-0.6 0-1-0.4t-0.4-1v-10h-5.7q-1 0-1.3-0.9-0.4-0.9 0.3-1.5l10-10q0.4-0.5 1-0.5t1 0.5l10 10q0.7 0.6 0.3 1.5z"></path></g>'+
                            '</svg>查看我的所有提交'+
                        '</a>'+
                        '<hr>'
                    );
                }
            }, 1000);
        }
    })
})();
