// ==UserScript==
// @name         NCST教学平台助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://elearning.ncst.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403148/NCST%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/403148/NCST%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 课程列表页面
    if (location.pathname === "/meol/lesson/blen.student.lesson.list.jsp") {
        let trs = $('#table2 tr');
        trs.each(function(index, tr) {
            if (index === 0) {
                // 标题栏
                $(tr).append("<th nowrap>置顶</th>");
            } else {
                // 行
                // 添加置顶按钮
                //  href="blen.student.lesson.list.jsp?ACTION=LESSUP&amp;lid=46276"
                let href = $(tr).find('td .movedown').attr('href')
                let result = /lid=([0-9]+)/.exec(href);
                let courceId = result[1];

                $(tr).append(`<td class="align_c"><a class="moveup movetop" data-index="${index}" data-cource-id="${courceId}" title="置顶"></a></td>`);
            }
        })

        $('#table2 tr').on('click', '.movetop', function(e) {
            let index = e.currentTarget.dataset.index;
            let courceId = e.currentTarget.dataset.courceId;
            let actionHref = `http://elearning.ncst.edu.cn/meol/lesson/blen.student.lesson.list.jsp?ACTION=LESSUP&lid=` + courceId;

            $(this).addClass('loading');

            let count = 0;
            for (let i = 0; i < (index - 1); i++) {
                setTimeout(() => {
                    $.get(actionHref).then(() => {
                        count++;
                        if (count >= (index - 1)) {
                            $(this).removeClass('loading');
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        }
                    });
                }, 50 * i)
            }
        })
    }

    let body = $(document.body);

    body.append(`
        <style>
           .movetop {
               background: url(http://elearning.ncst.edu.cn/meol/styles/main/image/global_image.png) no-repeat -17px -59px !important;
               border-bottom: 2px solid #9fc000;
               padding-bottom: 2px;
           }
           .moveup.loading {
               background: url(http://elearning.ncst.edu.cn/meol/styles/main/image/global_image.png) no-repeat -79px -59px !important;
               padding-bottom: 2px !important;
               border-bottom: 0 !important;;
               background-size: 585px 400px !important;
           }
           .reminderwrap #reminder>li:nth-child(2) ul {
               display: block !important;
           }
           .presonalwrap .content_inner>.left,
           .presonalwrap .content_inner>.right{
               display: none !important;
           }
           .presonalwrap .content_inner>.courselist {
                padding-top: 0 !important;
           }
        </style>
    `);
    // Your code here...
})();