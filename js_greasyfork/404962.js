// ==UserScript==
// @name         广东省人力资源和社会保障厅【继续教育】
// @namespace    http://tampermonkey.net/
// @version      22.08.04
// @description  打开视频播放页面课程
// @author       左手天才
//视频播放网址
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player?*
//进入作业界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?*
//完成作业后界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/examination/subexam?*
//进入课程界面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/auc/myCourse
//进入选小节页面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?*
//进入课程列表页面
// @match        *://ggfw.hrss.gd.gov.cn/zxpx/hyper/search/courselist

// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404962/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%92%8C%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%9A%9C%E5%8E%85%E3%80%90%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/404962/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%92%8C%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%9A%9C%E5%8E%85%E3%80%90%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var k=0
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
            renli1.courseDetail()
        } else if (urlTip == "courselist") {
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
                    console.log("课程没有选择，正在选择新的课程")
                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202204290000005541"
                }
                if (SL=="1"){
                    console.log("已选课程1个，正在判断")
                    var txt=document.getElementsByClassName('font-overhidden')[0].innerText//就获取第一个课程名称
                    console.log("已选课程名称是："+txt)
                    if(txt==" 数字化转型与产业创新发展"){
                        location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202204290000005541"
                    }else {
                        location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202204290000005541"
                        //进入选课程页面，现在进入是人工智能，以后网址改成要选的页面
                    }
                }
                if (SL=="2"){
                    console.log("已选课程2个，正在进行后续操作")
                    var txtOne=document.getElementsByClassName('font-overhidden')[0].innerText//就获取第一个课程名称
                    var txtTwo=document.getElementsByClassName('font-overhidden')[1].innerText//就获取第二个课程名称
                    console.log("第1个课程名称是："+txtOne)
                    console.log("第2个课程名称是："+txtTwo)
                    location.href="https://ggfw.hrss.gd.gov.cn/zxpx/hyper/courseDetail?ocid=OC202204290000005541"
                }
            },
            //课程小节
            courseDetail: function (){
                console.log("当前任务: 进入课程小节页面 ")
                setInterval(function(){
                    window.location.reload();
                },5000)
                var SL
                var QD
                setTimeout(function(){SL = document.getElementsByClassName('append-plugin-tip').length
                                      console.log("未学课程数量："+SL)//检测未学课程数量
                                      if(SL>1){
                                          console.log("课程已选择，进入视频播放页面")
                                          var n = document.querySelectorAll(".append-plugin-tip a")[0]
                                          console.log("n："+n)
                                          if (n) {
                                              n.click()
                                          }
                                      }else {
                                          var addID = document.getElementsByClassName('course-intro-btn course-intro-footer-btn active').length
                                          console.log("增加课程按钮数量："+addID)
                                          if(addID=="1"){
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


            //课程列表
            courseList: function (){
                console.log("当前任务: 进入课程列表 ")
            },

        }
    };



    function getRenli() {
        //循环开始
        return {
            seeVideo: function () {
                var myinter = setInterval(function () {
                    window.clearInterval(myinter)

                    if (p.getStatus() != "playing") {
                        p.play()
                        console.log("正在点击播放视频按钮")
                    }

                    p.on("ended", function (e) {
                        setTimeout(function () {
                            next()
                        }, 1000)
                    })
                    checkTimu()
                }, 1000)

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
                        console.log("本节视频学习："+txt+"%")
                        if(txt>=80||txt=="已完成"){
                            var n = document.querySelectorAll(".append-plugin-tip a")[1]
                            if (n) {
                                n.click()
                            } else {
                                location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2022040000005801"
                                //alert("全部看完了")
                            }
                        }
                        var panel = document.querySelector(".panel.window")
                        k=k+1
                        console.log("k="+k)
                        if (panel && panel.style.display != "none") {
                            setTimeout(function () {
                                console.log("发现课间答题弹出")

                                if(k%2==0){
                                    console.log("我来回答一个 正确 试试")
                                    document.querySelectorAll("input[name='panduan']")[0].click()
                                    subAnswer();
                                    setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 20000)
                                      setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 20000)
                                }
                                else{
                                    console.log("我来回答一个 错误 试试")
                                    document.querySelectorAll("input[name='panduan']")[1].click()
                                    subAnswer();
                                    setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 20000)
                                      setTimeout(function () {
                                        document.querySelectorAll(".l-btn-text")[0].click()
                                    }, 20000)
                                }
                            },20000)
                        }
                    },20000)
                }



                function next() { //暂时没用
                    var n = document.querySelectorAll(".append-plugin-tip a")[1]
                    if (n) {
                        n.click()
                    } else {
                        location.href="https://ggfw.hrss.gd.gov.cn/zxpx/auc/courseExam?exid=EX2022040000005801"
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
                            for (let j = 0; j < an.length; ++an) {
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
                    window.history.back(-1);
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