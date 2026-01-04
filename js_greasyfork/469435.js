// ==UserScript==
// @name         校情与教学质量问卷自动化(GXMU)
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  自动完成调查问卷
// @author       叶月绘梨依

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
// @downloadURL https://update.greasyfork.org/scripts/469435/%E6%A0%A1%E6%83%85%E4%B8%8E%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%8C%96%28GXMU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469435/%E6%A0%A1%E6%83%85%E4%B8%8E%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%8C%96%28GXMU%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /***** 参数配置 *****/
    var init_time=3000; //当页面加载完成后,延时3秒后启动评测脚本
    var finish_each_time=3600; //完成每次评测后间隔时间6s
    var close_time=1500; //关闭评测界面的对话框后延时2s;
    var is_gohome=false; //是否评测完后跳转主页，可选项: true,false. 默认值false,即不跳转.
    var is_comment=true; //是否开启评语填写，可选项: true,false. 默认值true,即开启评语填写.
    /*====> 此评语功能来自 @Natonaa <====*/
    /*====> 项目名称：校情与教学质量问卷自动化(GXMU)（自动评语版）<====*/
    /*====> 项目许可证：MIT <====*/
    /*====> 代码可获取自: https://greasyfork.org/zh-CN/scripts/521132-校情与教学质量问卷自动化-gxmu-自动评语版 <====*/
    //教师评语
    var predefined_comments = [
        "老师授课内容丰富多彩，讲解细致清晰，能结合实际案例帮助我们理解知识点，是我们非常尊敬和喜欢的老师。",
        "老师教学严谨认真，总是鼓励我们积极思考，帮助我们培养独立学习的能力，让我在学习中收获很多。",
        "老师不仅知识渊博，而且对待学生一视同仁，总是用鼓励的方式激发我们的潜力，课堂氛围十分融洽。",
        "课堂上老师总是耐心解答每一个问题，无论难易程度，都会用通俗易懂的方式讲解，给我们带来很大的帮助。"
    ];
    //课程评语
    var class_comments = [
        "课程内容丰富且有深度，老师讲解清晰易懂，但课堂互动较少，希望能增加更多的实际案例和讨论环节，提升学习体验。",
        "我非常喜欢课程的实用性和老师的教学方式，内容生动有趣，但课程节奏稍快，建议能在一些难点上花更多时间讲解。",
        "该课程能够深入浅出地传授理论知识，实际案例也很有帮助，不过某些部分的学习材料较少，希望能提供更多的参考资源。",
        "课程内容扎实，理论与实践相结合，讲解条理清晰；但有时进度较快，建议能适当放慢，确保每个知识点都能消化理解。",
        "课程设计合理，案例分析非常有助于理解理论，课堂氛围也很好；不过，某些环节过于抽象，希望能够更具体一些。"
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
                //判断链接是评教还是评课
                var currentURL = window.location.href;
                let textareas=document.querySelectorAll("textarea.m-wrap.span12")
                    if(textareas==undefined||textareas.length==0){
                        console.log("meet some errors when try to get the edit_area components")
                        return
                 }
                //评课
                if (currentURL.includes("lzdx_rank")) {
                    var randomIndex1 = Math.floor(Math.random() * class_comments.length);
                    var randomComment1 = class_comments[randomIndex1];
                    var randomIndex2;
                    // 确保两个文本框的评语不重复
                    do {
                        randomIndex2 = Math.floor(Math.random() * class_comments.length);
                        } while (randomIndex2 === randomIndex1);
                    var randomComment2 = class_comments[randomIndex2];

                    //填入评语
                    textareas[0].value = randomComment1;
                    textareas[1].value = randomComment2;
                } else {
                 //填入评语
                 var randomComment = predefined_comments[Math.floor(Math.random() * predefined_comments.length)];
                 textareas[1].value=randomComment
               }
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