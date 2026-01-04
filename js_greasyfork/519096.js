// ==UserScript==
// @name         华医网自动答题
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  华医网自动答题,适合课程已经播放完成
// @author       You
// @match        https://cme28.91huayi.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519096/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/519096/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(() => {
    // window.onload = function () {
    // if (jQuery) {

    //   window.setTimeout(init,2000);

    // } else {
    //     alert('jQuery 未加载');
    // }
    // };

    //课程列表
    var classlist = 'https://cme28.91huayi.com/pages/course.aspx?cid='
    //答题列表
    var answer = 'https://cme28.91huayi.com/pages/exam.aspx?cwid='
    //答题结果
    var jieguo = 'https://cme28.91huayi.com/pages/exam_result.aspx?cwid='
    init();

    function init() {

        var local_ulr = window.location.href;

        if (local_ulr.indexOf(classlist) == 0) {
            //小课列表界面
            var cid = getUrlParam('cid')
            lset('cid', cid)
            todati()

        } else if (local_ulr.indexOf(answer) == 0) {
            //小课列表界面
            dati()
        } else if (local_ulr.indexOf(jieguo) == 0) {
            //收集答案
            shouji()
        }

    }

    //跳转答题页面
    function todati() {
        $('.course h3 span').each(function () {
            if ($(this).text() == '待考试') {
                var a = $(this).parent().find('a')
                var newurl = a.attr('href').replace('../course_ware/course_ware.aspx', '/pages/exam.aspx')
                window.location.href = newurl
                return false;
            }

        })

    }

    //开始答题
    function dati() {

        var rightAn = lget('rightAn')
        var errorAn = lget('errorAn')
        var yuxuan = lget('yuxuan')

        $('.tablestyle').each(function () {
            var qid = $(this).find('.q_name').text()
            qid = qid.slice(2, qid.length)
            if (!errorAn[qid]) errorAn[qid] = [];

            $(this).find('.qo_name').each(function () {
                var an = $(this).val()


                if (rightAn[qid] == an) {
                    //是正确答案 选择
                    $(this).prop('checked', true)
                    return false;
                } else if (errorAn[qid].indexOf(an) != -1) {
                    //错误答案 跳过
                    // return false;
                } else {
                    //未知答案 选择
                    console.log(qid)
                    console.log(an)
                    yuxuan[qid] = an
                    $(this).prop('checked', true)
                    return false;
                }
            })
        })
        lset('yuxuan', yuxuan)
        setTimeout(function () {
            $('#btn_submit').click();
        }, ((Math.random() * 3) + 2) * 1000)


    }


    function shouji() {
        var rightAn = lget('rightAn')
        var errorAn = lget('errorAn')
        var yuxuan = lget('yuxuan')
        if ($('p.tips_text').text() == '考试未通过') {
            $('li.state_cour_lis').each(function () {
                var qid = $(this).find('.state_lis_text').attr('title')
                console.log(qid)
                if (!errorAn[qid]) errorAn[qid] = [];
                if ($(this).find('img').attr('src').indexOf('error_icon.png') != -1) {
                    //错误
                    errorAn[qid].push(yuxuan[qid])
                } else {
                    rightAn[qid] = yuxuan[qid]
                }
            })
            lset('rightAn', rightAn)
            lset('errorAn', errorAn)
            setTimeout(function () {
                let cwid = getUrlParam('cwid')
                window.location.href = answer + cwid
            }, ((Math.random() * 3) + 2) * 1000)
        } else {
            setTimeout(function () {
                let cid = lget('cid')
                window.location.href = classlist + cid
            }, ((Math.random() * 3) + 2) * 1000)
        }
    }

    function getUrlParam(name) {
//构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//匹配目标参数
        var r = window.location.search.substr(1).match(reg);
//返回参数值
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }

    function lset(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
    }

    function lget(name) {
        let data = localStorage.getItem(name)
        if (!data) {
            return {}
        }
        return JSON.parse(data)
    }

})
()