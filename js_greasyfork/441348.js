// ==UserScript==
// @name         2024年《广东省公需课》学习脚本-左手天才
// @namespace    http://tampermonkey.net/
// @version      24.11.15
// @description  打开视频播放页面课程
// @author       左手天才
// @ 视频播放网址
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player?*
// @ 进入作业界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?*
// @ 完成作业后界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/examination/subexam?*
// @ 进入课程界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse
// @ 进入课程界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse?*
// @ 进入选小节页面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?*
// @ 进入课程列表页面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/hyper/search/courselist
// @ 进入登录页面
// @match        *://ggfw.hrss.gd.gov.cn/ssologin/login?*
// @ 进入登录页面
// @match        *://ggfw.hrss.gd.gov.cn/ssologin/login
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441348/2024%E5%B9%B4%E3%80%8A%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%8B%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B%E5%A4%A9%E6%89%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/441348/2024%E5%B9%B4%E3%80%8A%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%85%AC%E9%9C%80%E8%AF%BE%E3%80%8B%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC-%E5%B7%A6%E6%89%8B%E5%A4%A9%E6%89%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var keyTest = "jixujiaoyuTest";
    var keyResult = "jixujiaoyuResult";
    var keyOther = "jixujiaoyuOther";
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    if (window.location.href.indexOf("ggfw") != -1) {
        var renli1 = getRenli1()
        var renli = getRenli()
        if (urlTip == "player") {
            console.log("当前任务: 人力公需课视频 ")
            renli.seeVideo()
} else if (urlTip == "login") {
            console.log("当前任务: 登录页面 ")
            renli1.doLogin()
        } else if (urlTip == "courseExam") {
            console.log("当前任务: 人力公需课作业 ")
            renli.doTest()
        } else if (urlTip == "subexam") {
            console.log("当前任务: 人力公需课作业结果 ")
            renli.doResult()
        } else if (urlTip == "myCourse") {
            console.log("当前任务: 人力公需课我的课程 ")
            renli1.myCourse()
        } else if (urlTip == "courseDetail") {
            console.log("当前任务: 人力公需课课程小节 ")
            let KC = document.getElementsByClassName('course-intro-status').length
            console.log(KC)
            if(KC != 0 ){
                console.log("我在这里")
                var KCZT = document.getElementsByClassName('course-intro-status')[0].innerText
                if(KCZT=="学时申报状态：已申报学时"){
                    console.log("学时申报状态：已申报学时")
                    return
                }else {
                    console.log("正在进入选课程程序")
                    renli1.courseDetail()
                    return
                }

            }else {
                console.log("正在进入选课程程序")
                renli1.courseDetail()
                return
            }
        }else if (urlTip == "courselist") {
            console.log("当前任务: 人力公需课课程列表 ")
            renli.courseList()
        }
    }

    function getRenli1() {
        return {
            //我的课程页面
            myCourse: function (){
                console.log("当前任务: 进入我的课程页面 ")
                // 获取课程元素的数量
                var SL = document.getElementsByClassName('font-overhidden').length
                console.log("已选课程数量为："+SL)
                if (SL=="0"){//表示没有选择课程
                    console.log("课程没有选择，正在选择新的课程")//《百县千镇万村高质量发展工程与城乡区域协调发展》的学习时间少一点
                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202404290000005581"
                }
                if (SL=="1"){
                    var SBXS = document.getElementsByClassName('mycourse-row-randstatus')[0].innerText
                    console.log(SBXS)
                    if(SBXS=="已申报学时"){
                        console.log("学时已申报")
                        return
                    }else{
                        console.log("已选课程1个，正在判断")
                        var txt=document.getElementsByClassName('font-overhidden')[0].innerText//就获取第一个课程名称
                        console.log("已选课程名称是："+txt)
                        txt=txt.replace(/\s*/g,"")//去除字符串中的空格
                        if(txt=="百县千镇万村高质量发展工程与城乡区域协调发展"){//《百县千镇万村高质量发展工程与城乡区域协调发展》的学习时间少一点
                            location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202404290000005581"
                        }else {
                            location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202404290000005581"
                            //进入选课程页面，现在进入是《百县千镇万村高质量发展工程与城乡区域协调发展》，以后网址改成要选的页面
                        }
                    }
                }
                if (SL=="2"){
                    console.log("已选课程2个，正在进行后续操作")
                    var SBXS1 = document.getElementsByClassName('mycourse-row-randstatus')[0].innerText
                    var SBXS2 = document.getElementsByClassName('mycourse-row-randstatus')[1].innerText
                    if(SBXS1 == "已申报学时"||SBXS2 == "已申报学时"){
                        console.log("学时已申报")
                        return
                    }else{
                        var txt1 = document.getElementsByClassName('font-overhidden')[0].innerText//就获取第一个课程名称
                        txt1=txt1.replace(/\s*/g,"")//去除字符串中的空格
                        var txt2 = document.getElementsByClassName('font-overhidden')[1].innerText//就获取第二个课程名称
                        txt2=txt2.replace(/\s*/g,"")//去除字符串中的空格
                        console.log("第1个课程名称是："+txt1)
                        console.log("第2个课程名称是："+txt2)
                        //《高质量发展》的学习时间少一点,所以选择它。
                        location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202404290000005581"
                    }
                }
            },
            //课程小节
            courseDetail: function (){
                console.log("当前任务: 进入课程小节页面 ")
                setInterval(function(){
                    window.location.reload();
                },5000)
                var WKS//定义“未开始课程数量”变量
                var WXX//定义“未学习课程数量”变量
                var YXX//定义“已学习课程数量”变量
                var QD//定义“确定按钮”变量
                var XZKC//定义“选择课程”变量
                var KCZT//定义“课程状态”变量
                setTimeout(function(){
                    console.log("判断1")
                    let kcz = document.getElementsByClassName('course-intro-status').length
                    if(kcz != 0 ){
                        console.log("判断6")
                        KCZT = document.getElementsByClassName('course-intro-status')[0].innerText
                        if(KCZT=="学时申报状态：已申报学时"){
                            console.log("学时申报状态：已申报学时")
                            return
                        } else{
                            console.log("判断3")
                            console.log("课程没有完成，正在开始学习")
                            //未开始课程数量
                            WKS=document.getElementsByClassName('content-unstart').length
                            //未学习课程数量
                            WXX = document.getElementsByClassName('append-plugin-tip').length
                            //已学习课程数量
                            YXX=document.getElementsByClassName('content-finished').length
                            console.log("未学课程数量："+WXX)//检测未学课程数量
                            if(YXX=="30"){
                                if(window.location.href.split("/")[window.location.href.split("/").length-1].substr(-4)=="5581"){
                                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2024040000006401"
                                }else{
                                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2024040000006401"
                                }
                            }else{
                                console.log("课程已选择，进入视频播放页面")
                                var n = document.querySelectorAll(".append-plugin-tip a")[0]
                                console.log("n："+n)
                                if (n) {
                                    n.click()
                                }
                            }
                        }
                    } else {
                        console.log("判断2")
                        var XZKC = document.getElementsByClassName('course-intro-btn course-intro-footer-btn active').length
                        console.log("增加课程按钮数量："+XZKC)
                        if(XZKC=="1"){
                            console.log("这是一个全新的课程")
                            document.querySelector("#btn-addToShopcart").click()
                            QD = document.getElementsByClassName('l-btn-text').length
                            console.log("确定按钮："+QD)//检测弹窗
                            var m = document.querySelectorAll(".l-btn-text")[0]
                            if(m){
                                m.click()
                            }
                        }
                    }
                } ,2000)
                setTimeout(function () {
                    var adID = document.querySelector(".panel.window.messager-window .l-btn.l-btn-small").length
                    console.log("确定按钮的数量："+adID)},5000)

                //document.querySelector("body > div.panel.window.messager-window > div.dialog-button.messager-button > a:nth-child(1) > span > span")[0].click()//点击确定
                //document.querySelector(".panel.window.messager-window .l-btn.l-btn-small .l-btn-left")[0].onclick()//点击确定
                //document.querySelectorAll(".panel.window.messager-window .l-btn.l-btn-small")[0].click()//点击确定
                //location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse"

                setTimeout(function () {
                    //  document.querySelector(".panel.window.messager-window .l-btn.l-btn-small")[0].click()//点击确定
                    // document.querySelectorAll(".panel.window.messager-window .l-btn.l-btn-small")[0].click()//点击确定

                },5000)

            },

//首页添加登录按钮
//            doLogin: function (){
//               console.log("当前任务: 2222面001 ")
//                    console.log("当前任务: 2222面002 ")
//                    let btn = document.createElement('button')
//                    btn.innerText='登录'
//                    document.querySelector("#doPersonLogin").before(btn)
//                    addEventListener('click',fnDoPersonLogin())                    
//            },

doLogin: function (){
                console.log("当前任务: 2222面001 ")
                document.querySelector("#doPersonLogin").onclick=""
                    document.querySelector("#doPersonLogin").addEventListener('click',()=>{
                        fnDoPersonLogin()
                    })
                    console.log('hkfe')
            },


            //课程列表
            courseList: function (){
                console.log("当前任务: 进入课程列表 ")
            },

        }
    };

    function getRenli() {
        //循环开始
        console.log("001")
        return {
            seeVideo: function () {
                //判断是否出现进入已完成页面
                console.log("正在判断是否出错")
                if(document.getElementsByClassName('exception-error').length>0){
                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse"
                }
                var myinter = setInterval(function () {
                    console.log("005")
                    window.clearInterval(myinter)
                    if (p.getStatus() != "playing") {
                        p.play()
                        console.log("正在点击播放视频按钮")
                    }
                    console.log("006")
                    p.on("ended", function (e) {
                        setTimeout(function () {
                            console.log("003")
                            next()
                        }, 1000)
                    })
                    console.log("运行一次检查程序")
                    checkTimu()

                }, 1000)
                console.log("004")
                var myinter2 = setInterval(function () {
                    var errorDiv = document.querySelector(".prism-ErrorMessage")
                    if (errorDiv && errorDiv.style.display != "none") {
                        document.querySelector(".prism-button.prism-button-retry").click()
                    }
                }, 20000)
                //间隔20秒钟。
                //这边是答题功能部分
                function checkTimu() {
                    setInterval(function () {
                        //静音
                        p.tag.muted = true;
                        console.log("静音")

                        if (p.getStatus() != "playing") {
                            p.play()
                            console.log("正在点击播放视频按钮")
                        }
                        //删题
                        map = {};
                        console.log("删除题目")
                        var txt=document.getElementById('realPlayVideoTime').innerHTML
                        console.log(txt)
                        if(txt>=81||txt=="已完成"){
                            var n = document.querySelectorAll(".append-plugin-tip a")[1]
                            if (n) {
                                n.click()
                            } else {
                                location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2024040000006401"
                                //alert("全部看完了")
                            }
                        }
                        //判断是否出现进入已完成页面
                        console.log("正在判断是否出错")
                        if(document.getElementsByClassName('exception-error').length>0){
                            location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse"
                        }
                        //判断是否有答题，并完成答题
                        var panel = document.querySelector(".panel.window")
                        var k
                        if (panel && panel.style.display != "none") {
                            console.log("题目弹出")
                            if(document.querySelector(".panel.window").innerText !='提示\n您暂未达到学习要求，请继续观看！\n确定'){
                                if(k!=1){
                                    k=1
                                    document.querySelectorAll("input[name='panduan']")[0].click()//点击“正确”选项
                                }else{
                                    k=0
                                    document.querySelectorAll("input[name='panduan']")[1].click()//点击“错误”选项
                                }
                                setTimeout(function () {
                                    // subAnswer();
                                    setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 2000)
                                    setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 5000)
                                }, 10000)
                            }else{
                                setTimeout(function () {
                                    document.querySelectorAll(".l-btn-text")[0].click()
                                }, 2000)
                            }
                        }
                    }, 10000)

                }

                function next() { //暂时没用
                    var n = document.querySelectorAll(".append-plugin-tip a")[1]
                    if (n) {
                        n.click()
                    } else {
                        location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2024040000006401"
                        //alert("全部看完了")
                    }
                }
            },

            doTest: function () {
                var juge = localStorage.getItem(keyOther)
                if (juge != "true") {
                    var res = JSON.parse(localStorage.getItem(keyResult))

                    var rd = document.querySelector(".exam-subject-rd")
                    var rdqs = rd.querySelectorAll(".exam-subject-text-que-title") //题目
                    var rds = rd.querySelectorAll(".exam-subject-text-quecontent") //单选题选项
                    for (let i = 0; i < rds.length; ++i) {
                        let an = findAnswer(rdqs[i].innerText.substring(2));
                        if (an) {
                            let a = getChoiceCode(an[0])
                            rds[i].querySelectorAll(".exam-subject-text-queanswar")[a].firstElementChild.click()
                            console.log("单选题自动选 " + i)
                        } else {
                            rds[i].querySelectorAll(".exam-subject-text-queanswar")[0].firstElementChild.click() //选A
                        }
                    }

                    var ms = document.querySelector(".exam-subject-ms")
                    var msqs = ms.querySelectorAll(".exam-subject-text-que-title") //题目
                    var mss = ms.querySelectorAll(".exam-subject-text-quecontent") //多选题选项
                    for (let i = 0; i < mss.length; ++i) {
                        let an = findAnswer(msqs[i].innerText.substring(2));
                        if (an) {
                            for (let j = 0; j < an.length; ++j) {
                                let a = getChoiceCode(an[j])
                                mss[i].querySelectorAll(".exam-subject-text-queanswar")[a].firstElementChild.click()
                                console.log("多选题自动选 " + i)
                            }
                        } else {
                            mss[i].querySelectorAll(".exam-subject-text-queanswar")[0].firstElementChild.click() //选A
                        }
                    }
                    var jd = document.querySelector(".exam-subject-jd") //判断题
                    var jdqs = jd.querySelectorAll(".exam-subject-text-que-title") //题目
                    var jds = jd.querySelectorAll(".exam-subject-text-quecontent")//判断题选项
                    for (let i = 0; i < jds.length; ++i) {
                        let an = findAnswer(jdqs[i].innerText.substring(2));
                        if (an) {
                            let a = getChoiceCode(an[0])
                            jds[i].querySelectorAll(".exam-subject-text-jdanswer")[a].firstElementChild.click()
                            console.log("判断题自动选 " + i)
                        } else {
                            jds[i].querySelectorAll(".exam-subject-text-jdanswer")[0].firstElementChild.click() //选A
                        }
                    }
                    function findAnswer(timu) {
                        if (res) {
                            for (let i = 0; i < res.length; ++i) {
                                if (res[i].timu == timu) {
                                    return res[i].answer
                                }
                            }
                        }
                    }

                    setTimeout(function(){
                        document.querySelector("#exam_sub").click()//提交
                        setTimeout(function () {
                            document.querySelectorAll(".panel.window.messager-window .l-btn.l-btn-small")[0].click()//点击确定
                        },1000)
                    }, 1000)
                } else {
                    localStorage.setItem(keyOther, "false")
                    setTimeout(function () {
                        window.location.reload()
                    }, 1000)
                }

                function getChoiceCode(an) { //用于获取选项字符编码
                    return an.charCodeAt(0) - "A".charCodeAt(0);
                }

            },
            doResult: function () {
                var res = JSON.parse(localStorage.getItem(keyResult))
                if (!res) res = new Array()
                var reg = new RegExp("[A-Z]{1}", "g");
                var timus = document.querySelectorAll(".exam-subject-text-que-title")
                var answers = document.querySelectorAll(".exam-subject-text-quecontent")
                for (var i = 0; i < timus.length; ++i) {
                    var data = {}
                    data.timu = timus[i].innerText.substring(2);
                    data.answer = answers[i].lastElementChild.innerText.match(reg)
                    if(!data.answer){
                        switch(answers[i].lastElementChild.innerText){
                            case "正确答案：正确":{
                                data.answer = ["A"]
                                break
                            }
                            case "正确答案：错误":{
                                data.answer = ["B"]
                                break
                            }
                            default: {
                                console.log("获取答案错误")
                            }
                        }
                    }
                    var f = findData(data.timu)
                    if(f == -1){
                        res.push(data)
                    } else {
                        res[f].answer = data.answer
                    }

                }
                localStorage.setItem(keyResult, JSON.stringify(res))
                localStorage.setItem(keyOther, "true")

                setTimeout(function(){
                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2024040000006401"
                    //window.history.back(-1);
                }, 1000)

                function findData(timu) {
                    if (res) {
                        for (let i = 0; i < res.length; ++i) {
                            if (res[i].timu == timu) {
                                return i
                            }
                        }
                    }
                    return -1
                }
            }
        }
    }
    // Your code here...
})();