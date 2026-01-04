// ==UserScript==
// @name         瓜瓜选课增强
// @namespace    ludoux
// @version      0.1
// @description  瓜瓜选课增强，增加一点小 feature
// @license      GPL-3.0
// @author       ludoux
// @match        http://us.nwpu.edu.cn/eams/stdElectCourse!defaultPage.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410148/%E7%93%9C%E7%93%9C%E9%80%89%E8%AF%BE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/410148/%E7%93%9C%E7%93%9C%E9%80%89%E8%AF%BE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    main()
    function main() {
        setInterval(function () {
            appendse()
            keyshortcuts()
            $('div.gridbar').find('span').html('查询后上方课表会发生变化。如要显示全部课程，请清空查询条件【快捷键C 或点击此处】后再做一次查询。')
            $('div.gridbar').find('span').click(function () {
                cleanInput()
            })
        }, 1000)
    }
    function keyshortcuts() {//Thanks to https://greasyfork.org/zh-CN/scripts/393991
        $('body').keyup(function (event) {
            if (/textarea|select|input/i.test(event.target.nodeName)
                || /text|password|number|email|url|range|date|month/i.test(event.target.type)) {
                return;
            }
            if (event.keyCode == 67) {//C
                cleanInput()
            }
            if (event.keyCode == 81) {//Q
                $('div.electTab').eq(0).click()
                document.getElementsByClassName('electTab')[0].scrollIntoView()
            }
            if (event.keyCode == 83) {//S
                $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                document.getElementsByClassName('electTab')[0].scrollIntoView()
            }
            if (event.keyCode == 69) {//E
                $('div.electTab').eq(1).click()
                document.getElementsByClassName('electTab')[0].scrollIntoView()
            }
            if (event.keyCode == 88) {//X

                window.scrollTo(0, 0)

            }
        })
    }
    function cleanInput() {
        $('table#electableLessonList.gridtable').find("input[type='text']").val('')
    }
    function appendse() {
        $('tbody#electableLessonList_data').find('tr').find('td:eq(1)').each(function () {
            let daima = $(this).text()
            if ($(this).children().length == 0) {
                let btn1 = $('<button type="button">新查</button>')
                let btn2 = $('<button type="button">补查</button>')
                btn1.click(function () {
                    cleanInput()
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(1).val(daima)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                btn2.click(function () {
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(1).val(daima)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                $(this).append('<br>')
                $(this).append(btn1)
                $(this).append(btn2)
            }
        })
        $('tbody#electableLessonList_data').find('tr').find('td:eq(3)').each(function () {
            let leibie = $(this).text()
            if ($(this).children().length == 0) {
                let btn1 = $('<button type="button">新</button>')
                let btn2 = $('<button type="button">补</button>')
                btn1.click(function () {
                    cleanInput()
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(3).val(leibie)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                btn2.click(function () {
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(3).val(leibie)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                $(this).append('<br>')
                $(this).append(btn1)
                $(this).append(btn2)
            }
        })
        $('tbody#electableLessonList_data').find('tr').find('td:eq(5)').each(function () {
            if ($(this).children().length == 1) {
                let teacher = $(this).text().match(/^[^,]+?(?=(,|$))/)[0]
                let btn1 = $('<button type="button">新查</button>')
                let btn2 = $('<button type="button">补查</button>')
                btn1.click(function () {
                    cleanInput()
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(5).val(teacher)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                btn2.click(function () {
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(5).val(teacher)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                })
                $(this).append('<br>')
                $(this).append(btn1)
                $(this).append(btn2)
            }
        })
        $('tbody#electableLessonList_data').find('tr').find('td:eq(11)').each(function () {
            if ($(this).children().length == 1) {
                let btn1 = $('<button type="button">零豆</button>')
                let con = $(this).find('a')
                btn1.click(function () {
                    con.click()
                    setTimeout(function () {
                        $("input#walletCost[type='text']").val('0')
                        $('input.buttonStyle').click()
                    }, 300)
                    setTimeout(function () {
                        if ($('div#cboxWrapper').find('td').find('div').text().indexOf('选课成功') != -1) {
                            $('button#cboxClose').click()
                        }
                    }, 1000)
                })
                $(this).append(btn1)
            }
        })
        $('tbody#electedLessonList_data').find('tr').find('td:eq(1)').each(function () {
            let daima = $(this).text()
            if ($(this).children().length == 0) {
                let btn1 = $('<button type="button">转查</button>')
                btn1.click(function () {
                    cleanInput()
                    $('div.electTab').eq(0).click()
                    $('table#electableLessonList.gridtable').find("input[type='text']").eq(1).val(daima)
                    $('table#electableLessonList.gridtable').find("input[type='submit']").click()
                    document.getElementsByClassName('electTab')[0].scrollIntoView()
                })
                $(this).append('<br>')
                $(this).append(btn1)
            }
        })
        $('tbody#electedLessonList_data').find('tr').find('td:eq(10)').each(function () {
            if ($(this).children().length == 1) {
                let now = parseInt($(this).parent().find('td:eq(7)').text().match(/(\d+)\/(\d+)$/)[1])
                let all = parseInt($(this).parent().find('td:eq(7)').text().match(/(\d+)\/(\d+)$/)[2])
                let res = 0
                let cur = parseInt($(this).text())
                let con = $(this).find('a')
                if (now > all) {
                    res = Math.ceil((now - all) * 100 / all)
                }
                let btn1 = (res <= cur ? $(`<button type="button">${res}</button>`) : $(`<button type="button" style="color:red;font-weight:bold">${res}</button>`))
                btn1.click(function () {
                    con.click()
                    $("input#walletCost[type='text']").ready(function () {
                        $("input#walletCost[type='text']").val(res)
                        $('input.buttonStyle').click()
                        $('div#cboxWrapper').find('td').find('div').ready(function () {
                            setTimeout(function () {
                                if ($('div#cboxWrapper').find('td').find('div').text().indexOf('意愿值修改成功') != -1) {
                                    $('button#cboxClose').click()
                                }
                            }, 1000)
                        })
                    })
                })
                $(this).append('<br>')
                $(this).append(btn1)
                if (cur != 0) {
                    let btn2 = $(`<button type="button">清</button>`)
                    btn2.click(function () {
                        con.click()
                        $("input#walletCost[type='text']").ready(function () {
                            $("input#walletCost[type='text']").val('0')
                            $('input.buttonStyle').click()
                            $('div#cboxWrapper').find('td').find('div').ready(function () {
                                setTimeout(function () {
                                    if ($('div#cboxWrapper').find('td').find('div').text().indexOf('意愿值修改成功') != -1) {
                                        $('button#cboxClose').click()
                                    }
                                }, 1000)
                            })
                        })
                    })
                    $(this).append(btn2)
                }
            }
        })
    }
})();