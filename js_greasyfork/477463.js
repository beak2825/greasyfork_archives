// ==UserScript==
// @name         得分统计
// @namespace    https://www.yangshaofeng.com/
// @version      1.7
// @description  加载正确多少个，错误多少个，正确率多少
// @author       杨富贵
// @match        https://www.caishi.cn/questionCenter/questionDetails?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caishi.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477463/%E5%BE%97%E5%88%86%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/477463/%E5%BE%97%E5%88%86%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 script 元素
    var script = document.createElement('script');
    // 设置 script 的 src 属性为 jQuery 的路径
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    // 添加 script 元素到页面中
    document.getElementsByTagName('head')[0].appendChild(script);


    // 在 script 加载完成后执行代码
    script.onload = function () {
        /*逻辑开始*/
        //填充事件
        window.tianchong = function () {

            var count=$(".card-list-box.jf-start .xy-center.block2").length;
            var rightcount=$(".card-list-box.jf-start .xy-center.right").length;
            var errorcount=$(".card-list-box.jf-start .xy-center.error").length;
            var noWorkcount=$(".card-list-box.jf-start .xy-center.noWork").length;
            var baifenbi=100;
            var color="f-c-f23";
            if(errorcount<=0&&rightcount<=0){
                baifenbi=100;
            }else{
                baifenbi=((rightcount/(errorcount+rightcount))*100).toFixed(2);
            }
            if(baifenbi>=70){
                color="f-c-root";
            }
            var html='---->';
            html+='对<b class="f-c-root">&nbsp;'+rightcount+'&nbsp;</b>+错<b class="f-c-f23">&nbsp;'+errorcount+'&nbsp;</b>';
            html+='= <b class="'+color+'">'+baifenbi+'%</b>';
            $("#percentagebox").html(html);

//             var percentage='<div id="percentage"><b>'+baifenbi+'%</></div>';
//             var percentagehtml=$(percentage);
//             percentagehtml.css({
//                 "text-align": "center",
//                 "font-size": "50px",
//                 "box-sizing": "content-box",
//                 "text-shadow": "1px 1px 0 #fff, -1px -1px 0 #000",
//                 "color":"#58C69C",
//             });
//             $(".operation").html(percentagehtml);
        }
        var boxhtml="<span id='percentagebox'></span>";
        $(".chapterName").append(boxhtml);

        setInterval(function(){tianchong();},1500);
        /*逻辑结束*/

    };

    // Your code here...
})();