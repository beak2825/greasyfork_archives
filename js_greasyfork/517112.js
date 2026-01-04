// ==UserScript==
// @name         华医网弹窗自动点击(带答题,非正确答案,只是在递归)
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  未实现带选项的弹窗，仅仅是不带答案的弹窗
// @author       niushuai233
// @match        https://*.91huayi.com/course_ware/course_ware_polyv.aspx?*
// @match        https://*.91huayi.com/pages/exam*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @require      https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517112/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%BC%B9%E7%AA%97%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%28%E5%B8%A6%E7%AD%94%E9%A2%98%2C%E9%9D%9E%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88%2C%E5%8F%AA%E6%98%AF%E5%9C%A8%E9%80%92%E5%BD%92%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517112/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%BC%B9%E7%AA%97%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%28%E5%B8%A6%E7%AD%94%E9%A2%98%2C%E9%9D%9E%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88%2C%E5%8F%AA%E6%98%AF%E5%9C%A8%E9%80%92%E5%BD%92%29.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var current = null;
    var next = null;

    Array.from($(".lis-inside-content")).forEach(elem => {

        if (current && !next) {
            next = elem;
        }
        var xx = $(elem).find('#top_play')
        if (xx.length == 1) {
            current = elem;
        }

    });

    if (current && next) {
        console.log($(current).find('h2')[0].innerText, $(next).find('h2')[0].innerText)
    }
    setInterval(function() {
        if (current && next) {
            var jrks_available = $($("#jrks")[0]).attr("disabled")=='disabled'
            console.log('jkrs_ava', $("#jrks"))

            if (!jrks_available) {
                setTimeout(function() {
                    $(next).find('h2')[0].click()
                }, 30000)
            }
        }
    }, 60000)

    var ccciii = setInterval(function(){
        if (!$(Array.from($(".zhezhao"))[0]).attr('style').includes('display: none')) {
            var zhidaole_button = Array.from($("button")).find(button => button.innerText === '知道了');
            if (zhidaole_button) {
                zhidaole_button.click()
                console.log('知道了 clicked at '+ new Date().toString())
            }
        }

        if ($(".study_box").length > 0) {
            var haode_zhidaole_button = Array.from($("button")).find(button => button.innerText === '好的，知道了');
            if (haode_zhidaole_button) {
                haode_zhidaole_button.click()
                console.log('好的，知道了 clicked at '+ new Date().toString())
            }
        }
    }, 30000)


    let q_and_a_arr = localStorage.getItem('q_and_a_arr');
    // 存起来 下次自动获取
    if (!q_and_a_arr) {
        q_and_a_arr = []
    } else {
        q_and_a_arr = Object.values(JSON.parse(q_and_a_arr))
    }


    function doAnswer() {

        //debugger
        // 取出所有的题目与答案 并且答案已知对错
        var answers = Array.from($(".state_lis_text"));

        for (let index = 0; index < answers.length; index = index + 2) {
            // 题干dom
            var name = replaceName(answers[index].innerText);
            // 答案dom
            var answer = answers[index + 1].innerText;
            // 使用正则表达式匹配并提取答案
            var match = answer.match(/【您的答案： (.*?)】/);

            // 如果匹配成功，则提取答案
            answer = match ? match[1] : null;
            // 答案对错
            var correct = !$($(answers[index]).parent()[0]).find('img')[0].src.includes('error');

            console.log(name, answer, correct)

            var exists = true
            var fff = found(name)
            if (!fff) {
                fff = {
                    name: name,
                    lastSelect: []
                }
                exists = false
            }
            if (fff) {
                //debugger
                if (correct) {
                    fff.option = answer
                    fff.lastSelect.push(answer)
                    console.log('name: ' + name + " answer: " + answer)
                    console.log('zzz', fff, 'xxx', q_and_a_arr)
                } else {
                    fff.option = undefined
                    fff.lastSelect.push(answer)
                }
            }

            if (exists) {
                replaceElement(fff)
            } else {
                q_and_a_arr.push(fff);
            }

            console.log('answer.....', q_and_a_arr)
            localStorage.setItem('q_and_a_arr', JSON.stringify(q_and_a_arr))

            sleep(5000)
            $('input').each(function () {
                if ($(this).val() === '重新考试') {
                    //$(this).click();
                    // 停止循环，如果只需要触发第一个匹配的input的点击事件
                    return false;
                }
            });

        }

    }


    function doExam() {

        Array.from($(".tablestyle")).forEach(element => {

            var eee = $(element).find('.q_name')[0]
            var item = found(replaceName(eee.innerHTML))

            var exists = !!item;
            if (!exists) {
                item = {
                    name: replaceName(eee.innerHTML).replaceAll(' ', ''),
                    lastSelect: []
                }
            }

            var options = Array.from($(element).find('.qo_name'))
            var selected = false
            for(var i=0; i<options.length;i++) {
                sleep(5000)
                var oo = options[i];
                // 未做出选择时 允许循环
                if (!selected) {
                    // 当前临时答案 不知对错
                    var tmpAnswer = $(oo).parent()[0].innerText.trim()
                    // 找出选项 并选择一个答案
                    if (item && item.option) {
                        // 已知正确答案
                        if (item.option.trim() == tmpAnswer) {
                            // 选择并置位
                            $(oo).click()
                            selected = true;
                        }
                    } else {
                        // 未知正确答案 选择当前答案
                        if (!item.lastSelect.some(e => e && e.trim() === tmpAnswer)) {
                            // 选择并置位
                            $(oo).click()
                            selected = true
                            // 记录本次选择的数据
                            //debugger
                            item.lastSelect.push(tmpAnswer)
                        }
                    }
                }
            }
            if (!selected) {
                // 一个没选上 清空选项
                item.lastSelect = []
            }


            // 已存在 更新lastSelect属性值 并重设到localStorage中
            if (exists) {
                replaceElement(item)
            } else {
                q_and_a_arr.push(item);
            }
        })

        sleep(5000)
        //$("#btn_submit").click();

        console.log('exam.....', q_and_a_arr)
        localStorage.setItem('q_and_a_arr', JSON.stringify(q_and_a_arr))
    }

    function replaceElement(elem) {
        let index = q_and_a_arr.findIndex(item => item.name.replaceAll(' ', '') === elem.name.replaceAll(' ', ''));
        // 检查对象是否存在于数组中
        if (index !== -1) {
            var _old = q_and_a_arr[index]
            // 修改对象的 name 属性
            q_and_a_arr[index] = elem;
            console.log('update elem index ', index, ' from ', _old, ' to ', elem)
        } else {
            console.log('target not found ', elem)
        }

    }

    function found(q_name) {
        var found = null;
        q_and_a_arr.forEach(item => {
            var rpName = replaceName(item.name)
            //debugger
            if (rpName.replaceAll(' ', '')==q_name.replaceAll(' ', '')) {
                found = item;
            }
        })

        console.log('find by ', q_name, ' and the result is ', found)
        return found;
    }

    function replaceName(str) {
        return str.replace(/\d+、/g, '').trim().replaceAll(' ', '');
    }


    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    if (window.location.href.includes('exam')) {
        if (window.location.href.includes('exam_result')) {
            console.log('exam result do answer at ' + new Date().toLocaleString())
            doAnswer();
        } else {
            console.log('exam result do exam at ' + new Date().toLocaleString())
            doExam();
        }
    }


})();