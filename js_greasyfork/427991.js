// ==UserScript==
// @name         全国民办高校党史学习教育知识竞赛练习题脚本
// @namespace    Zcentury
// @version      1.3
// @description  自动做全国民办高校党史学习教育知识竞赛练习题
// @author       Zcentury
// @match        *://ks.wjx.top/*
// @icon         https://cdn.Zcentury.top/Image/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427991/%E5%85%A8%E5%9B%BD%E6%B0%91%E5%8A%9E%E9%AB%98%E6%A0%A1%E5%85%9A%E5%8F%B2%E5%AD%A6%E4%B9%A0%E6%95%99%E8%82%B2%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E7%BB%83%E4%B9%A0%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427991/%E5%85%A8%E5%9B%BD%E6%B0%91%E5%8A%9E%E9%AB%98%E6%A0%A1%E5%85%9A%E5%8F%B2%E5%AD%A6%E4%B9%A0%E6%95%99%E8%82%B2%E7%9F%A5%E8%AF%86%E7%AB%9E%E8%B5%9B%E7%BB%83%E4%B9%A0%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {

        console.log("欢迎使用全国民办高校党史学习教育知识竞赛练习题脚本")
        let html = '<div id="msg" style="border: 1px solid green;background: rgba(190, 247, 153, 0.90);width: 200px;height: 50px;font-size: 20px;position: fixed;top: 0;right: 0;z-index: 9999!important;text-align: center;line-height: 50px;">'
        html += '请选择学校'
        html += '</div>'

        $("body").append(html);
        let indexNum = 0

        $("body").on('click', 'a, td', function() {


            if ($(this).attr('class') == 'button white') {
                let el = $(".fieldset[style='']")
                $("#divNext > a").hide()

                setTimeout(() => {
                    let title = el.find('div.field-label').html()
                    let radio = el.find('.ui-controlgroup .ui-radio[ans="1"]')
                    let checkbox = el.find('.ui-controlgroup .ui-checkbox[ans="1"]')

                    if (checkbox.length > 0) {
                        checkbox.click()
                    } else {
                        radio.click()
                    }
                    indexNum++
                    setTimeout(() => {
                        if (indexNum <= 90) {
                            $("#divNext > a").click()
                            $("#msg").html("已答:&nbsp;" + indexNum + "&nbsp;题")
                        } else {
                            $("#msg").html("请手动填写填空题")
                            $("#divNext > a").show()
                        }
                    }, 0);
                }, 0);

            }

        })

    })

})();