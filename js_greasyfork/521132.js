// ==UserScript==
// @name         校情与教学质量问卷自动化(GXMU)（自动评语版）
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  自动完成调查问卷
// @author       Natonaa
// @match        http://*/new/student/rank*
// @match        http://*/new/student/rank/*
// @match        http://*/new/student/lzdx_rank/*

// @match        http://210.36.48.43/new/student/rank*
// @match        http://210.36.48.43/new/student/rank/*
// @match        http://210.36.48.43/new/student/lzdx_rank/*

// @match        http://10.129.2.141/new/student/rank*
// @match        http://10.129.2.141/new/student/rank/*
// @match        http://10.129.2.141/new/student/lzdx_rank/*

// @match        http://10-129-2-141.svpn.gxmu.edu.cn:8118/new/student/rank/*
// @match        http://10-129-2-141.svpn.gxmu.edu.cn:8118/new/student/rank*
// @match        http://10-129-2-141.svpn.gxmu.edu.cn:8118/new/student/lzdx_rank/*

// @match        http://wspj.gxmu.edu.cn/new/student/rank*
// @match        http://wspj.gxmu.edu.cn/new/student/rank/*
// @match        http://wspj.gxmu.edu.cn/new/student/lzdx_rank/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=48.43

// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521132/%E6%A0%A1%E6%83%85%E4%B8%8E%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%8C%96%28GXMU%29%EF%BC%88%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AF%AD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521132/%E6%A0%A1%E6%83%85%E4%B8%8E%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%8C%96%28GXMU%29%EF%BC%88%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AF%AD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /***** 参数配置 *****/
    var init_time=3000; //当页面加载完成后,延时3秒后启动评测脚本
    var finish_each_time=3600; //完成每次评测后间隔时间3.6s
    var close_time=1500; //关闭评测界面的对话框后延时2s;
    var is_gohome=false; //是否评测完后跳转主页，可选项: true,false. 默认值false,即不跳转.
    var is_comment=true; //是否开启评语填写，可选项: true,false. 默认值true,即开启评语填写.
    /*====> 此评语功能来自 @Natonaa <====*/
    /*====> 项目名称：校情与教学质量问卷自动化(GXMU)（自动评语版）<====*/
    /*====> 项目许可证：MIT <====*/
    /*====> 代码可获取自: https://greasyfork.org/zh-CN/scripts/521132-校情与教学质量问卷自动化-gxmu-自动评语版 <====*/
    //教师评语
    var teacher_comments = [
        "{{teacher}}在{{course}}课程中展现出极高的教学热忱与专业素养，备课扎实，讲解清晰生动，能有效激发学生的学习兴趣。若能在教学中适时融入更广泛的拓展视角，将有助于进一步提升课程的知识广度与思维启发性。",
        "{{teacher}}教学态度认真负责，讲解细致耐心，课堂氛围融洽和谐，能充分照顾到不同学生的学习状态。如能进一步丰富课堂的互动形式，或许能使学生的参与感和思考深度得到更全面的调动。",
        "{{teacher}}在教学中注重培养学生的理解能力与思维方法，课程结构合理，节奏流畅，使学习过程系统而高效。或可酌情增加一些弹性化、拓展性的教学内容，以满足不同学生的学习需求与发展可能。",
        "{{teacher}}对{{course}}的教学内容把握得当，重点突出，逻辑清晰，使学生能扎实掌握核心知识体系。如能在授课中进一步兼顾理论与实际的贯通，或将更有利于促进学生知识的迁移与应用能力。"
    ];

    //课程评语
    var class_comments_satisfy = [
        "{{course}}课程内容丰富且实用，教学设计合理，知识点讲解深入浅出，老师讲解生动清晰，善于通过实例和案例帮助学生理解核心概念，使学生在课堂上能够主动思考并有效掌握知识，整体课程体验非常满意。",
        "{{course}}课程结构合理、逻辑清楚，教学环节紧密衔接，老师授课认真负责，课堂氛围积极活跃，能够激发学生学习兴趣和参与热情，知识传授与思维训练兼顾，学习效果显著。",
        "{{course}}课程案例丰富、内容深入浅出，老师善于结合实际问题进行讲解，能够帮助学生更好地理解复杂知识点，课堂互动适度，使学生在系统学习中获得扎实的知识基础，整体满意度较高。",
        "{{course}}课程内容紧凑而不失重点，老师讲解细致易懂，课堂氛围融洽和谐，能够充分调动学生学习积极性，同时培养学生的逻辑思维和分析能力，使学习过程高效而充实。"
    ];

    var class_comments_improve = [
        "{{course}}课程节奏略快，部分重点和难点内容讲解稍显紧凑，建议在关键知识点和难点部分适当放慢节奏，并增加重复巩固和总结环节，以便学生更好地理解和吸收知识。",
        "{{course}}课堂互动环节相对有限，可以考虑增加更多小组讨论、案例分析或实际操作机会，提升学生参与感和思考深度，使学习体验更为生动丰富。",
        "{{course}}建议在课后提供更系统化的学习资料、复习手册或拓展性阅读材料，帮助学生课后巩固知识，进行自主学习和深入理解，以增强整体学习效果。",
        "{{course}}在章节衔接和重要结论处可适当停顿或总结，引导学生回顾和思考，使知识点内化为可理解的系统性知识，同时帮助学生更好地跟随教学节奏并进行有效反思。"
    ];

    /*====> 此评语功能来自 @Natonaa <====*/
    /***** 参数配置 *****/

    var all_tasks;
    var all_links=[];
    var isload=0;
    
    /*====> 此评语功能来自 @Natonaa <====*/
    /*====> 项目名称：校情与教学质量问卷自动化(GXMU)（自动评语版）<====*/
    /*====> 项目许可证：MIT <====*/
    /*====> 代码可获取自: https://greasyfork.org/zh-CN/scripts/521132-校情与教学质量问卷自动化-gxmu-自动评语版 <====*/
    /*====> 叶月绘梨依在其基础上进行功能改进 <====*/
    //随机添加评语
    function add_comments(){
        var textareas = document.querySelectorAll("textarea.m-wrap.span12");
        if(!textareas || textareas.length === 0){
            console.log("未找到评语输入框");
            return;
        }

        document.querySelectorAll('li.wdt').forEach((li, index) => {
            const title = li.querySelector('.title').innerText;
            const textarea = li.querySelector('textarea');
            if(!textarea) return;

            if(title.includes("最满意")) {
                const comment = class_comments_satisfy[Math.floor(Math.random() * class_comments_satisfy.length)];
                textarea.value = replaceComment(comment);
            } else if(title.includes("需要改进")) {
                const comment = class_comments_improve[Math.floor(Math.random() * class_comments_improve.length)];
                textarea.value = replaceComment(comment);
            } else if(title.includes("教师") || title.includes("教学有何建议")) {
                const comment = teacher_comments[Math.floor(Math.random() * teacher_comments.length)];
                textarea.value = replaceComment(comment);
            }
        });
    }

    function getCourseAndTeacher() {
        let course = document.querySelector("#kcmchtml")?.innerText.trim() || "本课程";
        let teacherRaw = document.querySelector("#jsxmhtml")?.innerText.trim() || "任课";
        let teacher = teacherRaw.endsWith("老师") ? teacherRaw : teacherRaw + "老师";
        return { course, teacher };
    }

    function replaceComment(template) {
        let { course, teacher } = getCourseAndTeacher();
        return template.replace(/{{course}}/g, course).replace(/{{teacher}}/g, teacher);
    }

    /*====> 此评语功能来自 @Natonaa <====*/
    
    //返回主页
    function go_home(){
        //使用正则将'/*rank*'一大串字符替换成主页网址的‘studen_login/index.jsp’
        let return_home=window.location.href.replace(/(.*)(\/.*\/.*)\/.*rank.*/,'$1$2')+'/student_login/index.jsp';
        //跳转主页
        if(is_gohome) window.location.replace(return_home);
    }

    //关闭对话框
    function fclose(){
        try{
            //这里关闭的是测评页面的对话框
            var finishDlg=document.getElementById("finishDlg");
            if(finishDlg){
                finishDlg.innerHTML+=`<button id="close_" data-dismiss="modal">close</button>`;
                var close_=document.getElementById("close_");
                if(close_){
                    close_.click();
                    finishDlg.removeChild(close_);
                }
            }
        }catch(e){
        }
    }

    setTimeout(function(){
        all_tasks=document.querySelectorAll("td>span.badge-important,td>span.badge-success");
        //console.log(all_tasks);
        var raw_all_links=document.querySelectorAll("td>div.tdrepaire>a[onclick].blue");
        for(let h=0;h<raw_all_links.length;h++){
            if(raw_all_links[h].innerText=="评价") all_links.push(raw_all_links[h]);
        }

        var undone=[];
        for(let i=0;i<all_tasks.length;i++){
            var badge_class=all_tasks[i].getAttribute("class");
            console.log(badge_class);
            if(badge_class=="badge badge-important"){
                undone.push(i);
            }
        }

        console.log(undone)
        console.log("undone_len: "+undone.length)
        var count=0;
        if(undone.length==0){
            alert("所有评测可能完成，请自行检查！");
            go_home();
        }
        else{
            var inter=setInterval(function(){
                if(count==undone.length){
                    clearInterval(inter);
                    fclose();
                    alert("所有评测可能完成，请自行检查！");
                    go_home();
                }

                if(all_links[undone[count]]){
                    all_links[undone[count]].click()
                    count++;
                }
                //找到所有选项(10分..0分)
                var opts=document.querySelectorAll("label.radio>div.radio>span");
                //console.log(opts);

                //筛选出10分的选项,自动选择10分的选项
                for(let i=0;i<opts.length;i++){
                    var op=opts[i].querySelector("input");
                    if(op.value=="10"||op.value=="1"){
                        var item=opts[i].parentNode.parentNode;
                        item.dispatchEvent(new MouseEvent("click"));
                    }
                }
                
                /*====> 此评语功能来自 @Natonaa <====*/
                //添加评语
                if(is_comment) add_comments();
                /*====> 此评语功能来自 @Natonaa <====*/
                
                //由于问卷不能满分,所以倒数第11题固定选第二个
                var lastChange=opts[opts.length-9]?opts[opts.length-9]:opts[0]
                lastChange.parentNode.parentNode.dispatchEvent(new MouseEvent("click"));

                //点击提交按钮
                var submit=document.getElementById("pjsubmit");

                //关闭按钮
                submit.click();
                fclose();
                //做一个延迟，避免太快后导致窗口黑屏了...会让人以为卡死了orz
                setTimeout(()=>console.log("awaiting..."),close_time);
            },finish_each_time);
        }
    },init_time)

})();