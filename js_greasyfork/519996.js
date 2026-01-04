// ==UserScript==
// @name         针对上海电子信息课表错位的问题做的简单修复
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world! maybe……
// @author       u1iz
// @match        https://os.stiei.edu.cn/teaching/student/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stiei.edu.cn
// @homepage     https://gitee.com/u1iz/javascript-script/tree/master/TamperMonkey/%E4%BF%AE%E5%A4%8D%E8%AF%BE%E8%A1%A8
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519996/%E9%92%88%E5%AF%B9%E4%B8%8A%E6%B5%B7%E7%94%B5%E5%AD%90%E4%BF%A1%E6%81%AF%E8%AF%BE%E8%A1%A8%E9%94%99%E4%BD%8D%E7%9A%84%E9%97%AE%E9%A2%98%E5%81%9A%E7%9A%84%E7%AE%80%E5%8D%95%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/519996/%E9%92%88%E5%AF%B9%E4%B8%8A%E6%B5%B7%E7%94%B5%E5%AD%90%E4%BF%A1%E6%81%AF%E8%AF%BE%E8%A1%A8%E9%94%99%E4%BD%8D%E7%9A%84%E9%97%AE%E9%A2%98%E5%81%9A%E7%9A%84%E7%AE%80%E5%8D%95%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

// @require      https://cdn.bootcss.com/jquery/3.6.0/jquery.min.js

(function() {
    'use strict';

    // 在这里修改占用4节课的课程名的开头字符
    const lessonsInfo = {
        double: ['虚拟现实', '新媒体运营', '三维图像设计']
    }

    const reload = callBack => {
        $('.ant-menu-item').eq(0).click()
        clearInterval(window.waittingLoad)

        return new Promise((resolve, reject) => {
            window.waittingLoad = setInterval(() => {
                if (location.href.endsWith('week_schedule')) {
                    clearInterval(window.waittingLoad)
                    callBack && callBack()

                    resolve()
                }
                $('.ant-menu-item').eq(1).click()
            }, 200)
        })
    }

    const addStyle = () => {
        if($('#longer').length) return

        let style = $('<style id="longer"><style>')

        style.text(`.longer::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 200%;
            background: linear-gradient(to right, #9bd2fb, transparent);
        }
        .longer-sp::after {
            background: linear-gradient(to right, #fedeab, transparent);
        }
        .lesson-cell.lesson-pointer {
            position: relative;
            z-index: 1
        }`)


        $('html').append(style)
    }

    const fix = () => {
        if (!location.href.endsWith('week_schedule')) return

        addStyle()

        reload().then(() => {
            $('.schedule-table-wrapper .row.header').html(
                `<div data-v-247749a0="" class="row-head" style="width: 66px;"></div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(104, 180, 235);">
            <div data-v-247749a0="" class="title">第一节</div>
            <div data-v-247749a0="" class="range">8:30-9:10</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(104, 180, 235);">
            <div data-v-247749a0="" class="title">第二节</div>
            <div data-v-247749a0="" class="range">9:10-9:50</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(104, 180, 235);">
            <div data-v-247749a0="" class="title">第三节</div>
            <div data-v-247749a0="" class="range">10:05-10:45</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(104, 180, 235);">
            <div data-v-247749a0="" class="title">第四节</div>
            <div data-v-247749a0="" class="range">10:45-11:25</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(249, 175, 54);">
            <div data-v-247749a0="" class="title">第五节</div>
            <div data-v-247749a0="" class="range">13:00-13:40</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(249, 175, 54);">
            <div data-v-247749a0="" class="title">第六节</div>
            <div data-v-247749a0="" class="range">13:40-14:20</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(249, 175, 54);">
            <div data-v-247749a0="" class="title">第七节</div>
            <div data-v-247749a0="" class="range">14:35-15:15</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(249, 175, 54);">
            <div data-v-247749a0="" class="title">第八节</div>
            <div data-v-247749a0="" class="range">15:15-15:55</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(47, 65, 105);">
            <div data-v-247749a0="" class="title">第九节</div>
            <div data-v-247749a0="" class="range">19:00-19:40</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(47, 65, 105);">
            <div data-v-247749a0="" class="title">第十节</div>
            <div data-v-247749a0="" class="range">19:40-20:20</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(47, 65, 105);">
            <div data-v-247749a0="" class="title">第十一节</div>
            <div data-v-247749a0="" class="range">20:40-21:20</div>
        </div>
    </div>
    <div data-v-247749a0="" class="row-col" style="min-width: 81px;">
        <div data-v-247749a0="" class="col-head"
            style="border-bottom: 1px solid rgb(232, 232, 232); border-right: 1px solid rgba(232, 232, 232, 0.3); background: rgb(47, 65, 105);">
            <div data-v-247749a0="" class="title">第十二节</div>
            <div data-v-247749a0="" class="range">21:20-22:00</div>
        </div>
    </div>`
            )

            setTimeout(() => addBtn(), 100)

            setLessonWidth()
        })
    }

    const setLessonWidth = () => {
        $('.schedule-table-wrapper .schedule-table .default-cell').each((i, e) => {
            const str = $(e).attr('style').split(';')[0]
        
            if (str.startsWith('width')) {
                var val = str.split(': ')[1]
        
                lessonsInfo.double.forEach(les => {
                    const name = $(e).find('.name').text()
                  if (name.startsWith(les)) {
                    // $(e).width(`calc(${parseFloat(val) * 2 +'%'} - 100px)`)

                    // 考查课另用背景色
                    // if (name.includes('考查')) {
                    if ($(e).find('.pm').length) {
                        $(e).addClass('longer-sp')
                    }

                    $(e).addClass('longer')
                  }  
                })
                
            }
        })
    }

    const addBtn = () => {
        if (!$('.fix-btn').length && location.href.endsWith('week_schedule')) {
            let btn = $('<button class="fix-btn">修复</button>')
    
            $('.table-header__actions').append(btn)
    
            btn.on('click', () => fix())
        }


        setTimeout(() => {
            if (!$('.fix-btn').length) addBtn()
        }, 100)
    }

    window.onload = () => addBtn()

    // url变化 异步执行
    window.addEventListener('popstate', _ => setTimeout(() => addBtn(), 10))


    // 循环监听
    let lastUrl = location.href
    window.loopListener = setInterval(() => {
        // addBtn()
        if (location.href != lastUrl) {
            addBtn()
            
            lastUrl = location.href
        }
    }, 500)
})()