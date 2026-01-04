// ==UserScript==
//  @name        河工程教学评估
// @namespace     https://github.com/slightin
// @description    自动教学评估,自动评分和主观评价,适用于河北工程大学URP教务系统
// @author       万事可乐
//  @version      2.2.10
// @include        http://27.188.65.169:911*
// @match        http://202.206.161.181:46110/*
// @match        http://202.206.161.203:46110/*
// @match        http://202.206.161.206:46110/*
// @match        */student/teachingEvaluation/*
// @icon         https://cdn.jellow.site/Fgwb1WzJddpQanzWwg9bVURFF37Vv2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427091/%E6%B2%B3%E5%B7%A5%E7%A8%8B%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427091/%E6%B2%B3%E5%B7%A5%E7%A8%8B%E6%95%99%E5%AD%A6%E8%AF%84%E4%BC%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //主观评价
    var eva=[
        "老师重视教学，严慈相济，关爱学生，讲授详略得当，重点突出，难点讲透",
        "老师备课充分，内容讲解熟练，讲课充满激情，让我始终保持上课的兴趣",
        "老师使用多种教学方法，师生互动多，讲课风趣幽默，有助于我理解和记忆",
        "教师上课认真负责，专业基础极技能高深，非常注重学生的实际动手能力。注重学生专业能力和素养的培养。上课语言幽默，互动适当，演示精准精彩",
        "老师总是能够认真倾听学生的问题、意见与建议，并给予耐心细致的回答",
        "课堂氛围轻松活跃，积极调动了学生的兴趣。并且学习内容安排恰当，注重能力培养",
        "切入点新颖，很有新意，能充分吸引学生的注意力，符合学生的学习兴趣，使得课堂活泼不古板",
        "老师爱党爱国，积极向上，备课充分，内容讲解熟练，课程设置合理，深浅知宜",
        "老师体系的讲解本课程的知识结构学习导图，使学生能够了解到本课程的重点难点"
    ]
    var flag = true;

    //评估主页模块
    function index(){
        var times = document.querySelector("#jxpgtbody").getElementsByTagName("tr").length;
        for(var i=1;i<=times;i++)
        {
            if(/评估/.test(document.querySelector("#jxpgtbody > tr:nth-child("+i+") > td:nth-child(1) > button").innerText))
            {
                flag=false
                document.querySelector("#jxpgtbody > tr:nth-child("+i+") > td:nth-child(1) > button").click();
                break;
            }
        }

        if(flag)
        {
            var div = document.createElement('div')
            var ins = document.querySelector("#page-content-template").firstElementChild
            document.querySelector("#page-content-template").insertBefore(div,ins)
            div.innerText="评估未开始或已完成"
            div.style="color: #128520;font-size: x-large;"
        }
    }

    //评估主页面执行
    if(/evaluation\/index/.test(window.location.href))
    {
        setTimeout(index,700);//延迟执行，防止网速问题导致页面加载未完全找不到DOM，不建议太小
    }

    //评估详情页执行
    if(/evaluationPage/.test(window.location.href))
    {
        let num=[];
        $("font").each(function(i){
            if(i<10){
                num.push(Number(/\d+/.exec($(this).text())[0]));
            }
        })
        $("textarea").each(function(i){
            if(i<10){
                $(this).text(num[i]-Math.ceil(Math.random()*10)/10)
            }
            else{
                $(this).text(eva[Math.floor(Math.random()*eva.length)])
            }
        })
        // document.querySelector("#RemainM").innerText=2 

        //用户提示模块
        var tip = document.createElement("h4")
        var ins = document.getElementById("buttonSubmit")
        var div = document.querySelector("#page-content-template > div > div > div:nth-child(3)")
        div.insertBefore(tip,ins)
        tip.innerHTML=`时间结束会自动提交并进入下一评估中哦U•ェ•*U<br/>
            为保证脚本的正常运行，请保持浏览器处于此窗口<br/>
            计时检测在服务器端，暂无法跳过。<br/>
            开发不易，本脚本完全免费，如果觉得帮助到你，你可以选择<u><a id="wxmoney">打赏作者</a></u>
            <div id="reward" style="
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 99;
                width: 20%;
                display: none;
            ">
                <span id="rewardclose" style="
                    float: right;
                    background-color: coral;
                    padding: 5px;
                    border-radius: 4px;
                    color: white;
                ">点此关闭⨉</span>
                <img src="https://www.z4a.net/images/2022/10/21/reward.jpg" alt="reward.jpg" border="0" style="width: 100%;border-radius: 5px;">
            </div>
        `
        $("#wxmoney").click(function(){$("#reward").slideToggle()});
        $("#rewardclose").click(function(){$("#reward").slideToggle()});
        window.scrollTo(0,document.body.clientHeight)//保证滚动到页面底端

        //提交模块
        setInterval(function(){
            if(document.querySelector("#RemainM").innerText=='0' && document.querySelector("#RemainS").innerText=='0'){//时间结束时点击提交
                document.querySelector("#buttonSubmit").click();
              $('a.layui-layer-btn0').click()
            }
        },1000);//检测间隔
    }

    if(location.pathname=="/login"){
        $("#native > a").after(`
            <br/><input type="checkbox" name="_spring_security_remember_me" class="fadeIn third" style="margin-bottom: 5px;text-align: left;" checked>&nbsp;两周内免登录
        `)
    }

    if(location.pathname=="/" || location.pathname=="/index.jsp") {//主页快捷面板
        var shortcut=document.createElement("div")
        document.querySelector("#page-content-template > div.row").appendChild(shortcut)
        shortcut.className="col-sm-6 widget-container-col"
        shortcut.innerHTML=`<div class="widget-box">
                <div class="widget-header">
                    <h5 class="widget-title">
                        快捷面板（河工程教学评估脚本提供）
                    </h5>
                    <a class="widget-toolbar" href="https://scriptcat.org/script-show-page/220/issue" target="_blank">点此反馈</a>
                </div>
                <div class="widget-body">
                    <div class="widget-main">
                        <a class="infobox infobox-orange2 click-item shortcutmain" href="/student/integratedQuery/scoreQuery/thisTermScores/index" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-file-text"></i>
                            </div>
                            <div class="shortcuttext">本学期成绩</div>
                        </a>
                        <a class="infobox infobox-green click-item shortcutmain" href="/student/integratedQuery/scoreQuery/coursePropertyScores/index" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-list-alt"></i>
                            </div>
                            <div class="shortcuttext">全部成绩</div>
                        </a>
                        <a class="infobox infobox-blue click-item shortcutmain" href="/student/courseSelect/thisSemesterCurriculum/index" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-calendar"></i>
                            </div>
                            <div class="shortcuttext">本学期课表</div>
                        </a>
                        <a class="infobox infobox-orange click-item shortcutmain" href="http://27.188.65.169:9900/pjxfjdpm/" target="_blank" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-grade"></i>
                            </div>
                            <div class="shortcuttext">专业排名</div>
                        </a>
                        <a class="infobox infobox-orange click-item shortcutmain" href="http://27.188.65.169:9900/tskc/" target="_blank" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-child"></i>
                            </div>
                            <div class="shortcuttext">我的通识课</div>
                        </a>
                        <a class="infobox infobox-red click-item shortcutmain" href="/student/teachingEvaluation/evaluation/index" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class="ace-icon fa fa-jxpg"></i>
                            </div>
                            <div class="shortcuttext">教学评估</div>
                        </a>
                        <a id="wxmoney" class="infobox infobox-pink click-item shortcutmain" style="text-decoration: none">
                            <div class="infobox-icon">
                                <i class=" wxmoney ace-icon 	fa fa-cny"></i>
                            </div>
                            <div  class="shortcuttext">打赏作者</div>
                            
                        </a>
                        <style type="text/css">
                            .shortcuttext {
                                font-size: 18px;
                                line-height: 40px;
                                display: inline;
                                padding-left: 10px;
                            }
                            .shortcutmain {
                                width:205px;
                                padding-top:10px;
                                padding-left:20px
                            }
                        </style>

                    </div>
                </div>
        </div>
        <div id="reward" style="
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 99;
            width: 20%;
            display: none;
        ">
            <span id="rewardclose" style="
                float: right;
                background-color: coral;
                padding: 5px;
                border-radius: 4px;
                color: white;
            ">点此关闭⨉</span>
            <img src="https://www.z4a.net/images/2022/10/21/reward.jpg" alt="reward.jpg" border="0" style="width: 100%;border-radius: 5px;">
        </div>`
        $("#wxmoney").click(function(){$("#reward").slideToggle()});
        $("#rewardclose").click(function(){$("#reward").slideToggle()});
    }
})();