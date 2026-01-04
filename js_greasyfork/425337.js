// ==UserScript==
// @name          科大抢课
// @namespace     大逼哥666
// @version       0.0.2
// @description  科大学术报告抢课，还是有一定的小bug，等后续修复
// @author       大逼哥
// @home-url	 https://greasyfork.org/zh-CN/scripts/425337
// @match      http://yjs.ustc.edu.cn/bgzy/m_bgxk_up.asp
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/425337/%E7%A7%91%E5%A4%A7%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/425337/%E7%A7%91%E5%A4%A7%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // debugger;
    var tablem_bgxk_up = document.getElementById('table_info');
    var trList = tablem_bgxk_up.getElementsByTagName("tr");
    for(var i = 0; i < trList.length; i++) {
        if (i == 0) {
            var newTDH = trList[i].insertCell(0);
            newTDH.innerHTML = '工具';
            newTDH.style.width = '70';
            newTDH.style.align = 'center';
        } else {
            var tNo = trList[i].cells[1].innerHTML;
            var newTd = trList[i].insertCell(0);
            newTd.setAttribute("class","bt06" );
            let takeLessonBtn_d = $('<input type="button" value="抢课" class="takeLesson" lesson_id="'+ tNo +'" />');
            newTd.innerHTML = '<input type="button" value="抢课" class="takeLesson" lesson_id="'+ tNo +'" />';
            takeLessonBtn_d.click(takeLessonClick)
        }
        // console.log(trList[i]);
    }

    $('.takeLesson').each(function() {
        $(this).click(takeLessonClick);
    });

    function takeLessonClick() {
        var lNo = $(this).attr("lesson_id");
        // console.log(lNo);
        $.ajax({
            method: "POST", // 一般用 POST 或 GET 方法
            url: "http://yjs.ustc.edu.cn/bgzy/m_bgxk_up.asp", // 要请求的地址
            dataType: "text", // 服务器返回的数据类型，可能是文本 ，音频 视频 script 等浏览 （MIME类型）器会采用不同的方法来解析。
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data:{selectxh: lNo, select: true},
            success: function(data) {
                console.log("succ"+data)
                parent.location.href="http://yjs.ustc.edu.cn/bgzy/m_bgxk.asp"
            },
            error: function(data) {
                console.log("err"+data)//请求失败是执行这里的函数
            }
        });
    };

})();