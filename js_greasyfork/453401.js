// ==UserScript==
// @name        青骄课堂学习(中学版)
// @namespace   http://tampermonkey.net/
// @match        https://www.2-class.com/competition
// @version     2022.10
// @author      Hzane
// @description 青骄课堂竞赛辅助工具（中学版）
    // @icon         https://img.alicdn.com/tfs/TB13RHdl8r0gK0jSZFnXXbRRXXa-32-32.png
    // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
    // @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/js/toastr.min.js
    // @require      https://greasyfork.org/scripts/453197-2021-2022/code/2021-2022.js?version=1106991
    // @resource css https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
    // @grant        GM_getResourceText
    // @grant        unsafeWindow
    // @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453401/%E9%9D%92%E9%AA%84%E8%AF%BE%E5%A0%82%E5%AD%A6%E4%B9%A0%28%E4%B8%AD%E5%AD%A6%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453401/%E9%9D%92%E9%AA%84%E8%AF%BE%E5%A0%82%E5%AD%A6%E4%B9%A0%28%E4%B8%AD%E5%AD%A6%E7%89%88%29.meta.js
    // ==/UserScript==
(function () {

    'use strict';

    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    var config ={isAuto:false}

    //设置toastr参数
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-left",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "1000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    const gradesPrimary = {一年级: 1, 二年级: 2, 三年级: 3, 四年级: 4, 五年级: 5, 六年级: 6 }
    const choices = {A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7}

    //获取当前用户年级
    const gradeName = unsafeWindow.__DATA__.userInfo.department.gradeName


    var lib;


    //根据所在年级选择对应题库
    if(gradeName in gradesPrimary){
        lib = libs.libPrimarySchool
        toastr["success"]("已匹配小学组题库")
    }else{
        lib = libs.libMiddleSchool;
        toastr["success"]("已匹配中学组题库")
    }


    //引入toastr所需样式css
    GM_addStyle(GM_getResourceText('css'))


    document.addEventListener("keydown", event => {
        //用event.key替换被弃用的event.keyCode
        //if (event.keyCode === 17) {

        if (event.key === 'Control') {
            //当前题号
            let questionNum = document.querySelector("#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div:nth-child(3) > p > span.exam-content-type-text > b").innerText
            //如果是第1题，询问是否打开自动答题功能
            if(!config.isAuto&&questionNum==='1'){
                config.isAuto = confirm("开启自动答题功能吗？")}

            var q_txt = document.querySelector("#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div:nth-child(3) > div").innerText
            lib.forEach(function (element) {
                // 使用正则表达式移除非汉字字符,以方便比较
                var qtxt = q_txt.replaceAll(/[^\u4e00-\u9fa5]/g, '');
                var ltxt = element.question.replaceAll(/[^\u4e00-\u9fa5]/g, '')
                if (qtxt.indexOf(ltxt) === 0) {
                    //if (q_txt.replaceAll(/[^\u4e00-\u9fa5]/g, '').indexOf(element.question.replaceAll(/[^\u4e00-\u9fa5]/g, ''))>=0) {
                    //alert("问题：" + q_txt + "\n\n答案：" + element.answer)
                    //toastr["success"](q_txt, element.answer)
                    toastr["success"](q_txt, "<h1 style='color:#ffdb01'>" + element.answer + "</h1>")

                    //判断是否启用了“自动答题”功能，未启用不执行后续代码
                    if (!config.isAuto)
                        return

                    var options = document.querySelector("#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div:nth-child(4) > div").children
                    //单选题
                    for(var i=0;i<element.answer.length;i++){
                        let answer = element.answer.toUpperCase().at(i)
                        let choice = choices[answer]
                        options[choice].click()

                    }

                    sleep(1000).then(()=>{
                        let nextButton = document.querySelector("#app > div > div.home-container > div > div > div.competiotion-exam-box-all > div.exam-box > div.competition-sub > button.ant-btn.ant-btn-primary")
                        nextButton.click()

                    })

                }
            });
        }

    });
})();