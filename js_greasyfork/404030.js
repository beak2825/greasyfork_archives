// ==UserScript==
// @name         超星学习通教师后台（即超星泛雅平台）加强
// @namespace    http://teachroot.com/
// @version      0.30
// @description  针对超星学习通教师后台一些功能进行了优化,方便判卷、分析、预览.
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @author       辽经职院 冯涛
// @match        https://mooc1-1.chaoxing.com/exam/*
// @match        https://mooc1-1.chaoxing.com/work/*
// @match        https://mooc1-1.chaoxing.com/scoreAnalysis/toSetWeights*
// @match        https://mooc1-1.chaoxing.com/moocAnalysis/analysisScore*
// @match        https://mooc1.chaoxing.com/exam/test/toReVersionPublishAndExamSet*
// @match        https://mooc2-ans.chaoxing.com/exam/test/topublish*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404030/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E5%90%8E%E5%8F%B0%EF%BC%88%E5%8D%B3%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%EF%BC%89%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404030/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%95%99%E5%B8%88%E5%90%8E%E5%8F%B0%EF%BC%88%E5%8D%B3%E8%B6%85%E6%98%9F%E6%B3%9B%E9%9B%85%E5%B9%B3%E5%8F%B0%EF%BC%89%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //本部分应用于新版超星(编写完才发现，旧版的原已经做这个功能了，时间长自己都忘记了)
    //发放设置-按人发放 （可在文本框内批量放置学号）
    //    https://mooc2-ans.chaoxing.com/exam/test/topublish?clazzid=-1&courseid=202255427&ut=t&cpi=144235191&paperid=103096329&score=0.0
    if(window.location.pathname=="/exam/test/topublish"){
        let $title=$('<span style="margin-left:10px;width:120px;float:left;white-space:pre-wrap;word-wrap:break-word;"><span style="font-weight:bold;">批量添加学生</span><br/>1.先展开相应班级；<br/>2.每行一个学生名。</span>');
        let $stuList=$('<textarea id="stuList" rows="3" cols="15" style="margin-left:2px;border: 1px solid #2e00ff;"></textarea>');
        let $stuAdd=$('<input type="button" class="jb_btn jb_btn_92" value="添加至清单">');
        $("a#confirmchoose").before($title);
        $("a#confirmchoose").before($stuList);
        $("a#confirmchoose").before($stuAdd);
        let $tagLi=$('');
        $stuAdd.on("click",function(){
            //console.log('result:', $stuList.val()  );
            //console.log( $(".manageTitl.current").next("ul").children("li") );
            //取出学生列表
            let arrStus=$stuList.val().split('\n');
            let findStu=0;
            //遍历班级每名学生
            $(".manageTitl.current").next("ul").children("li").children(".manageTitl.lastLever").children("a").each(function(index,element){
                //判断是否为列表中学生
                arrStus.forEach(function(stu){
                    if(stu.length<=0){
                        return true;
                    }
                    if(stu==$(element).text()){
                        $(element).css("background-color","red");
                        $(element).next().click();
                        findStu++;
                    };
                });
            });
            alert("共选择学生人数：" + findStu);
        });
    }

    //以下是在旧版超星上的应用

    //补考名单批量选择（文本区域内输入多个学生学号，每行一人）
    if(window.location.pathname=="/exam/test/toReVersionPublishAndExamSet"){
        let $stulab=$("<span id='stulab'>请输入补考学生学号，每行一条 <input id='cleartext' type='button' value='清空'/></span>");
        let $cleartext=$("");
        let $stus=$("<textarea id='stus' rows='3' cols='50' style='background-color:#eeeeee'></textarea>");
        let $add=$("<input type='button' id='addstus' value='设置学生'/>");
        let $error=$("<select id='error'><li>错误列表</li></select>");
        $("#classDiv").after($error);
        $("#classDiv").after($add);
        $("#classDiv").after($stus);
        $("#classDiv").after($stulab);

        $("#cleartext").click(function(){
            $("#stus").val("");
            var checkBoxList = $("#allstu").find("input[type='checkbox']");
            checkBoxList.each(function (index, thisObject) {
                $(thisObject).attr("checked", false);
            });
        });

        $("#addstus").click(function(){
            $("#error").empty();
            let students=$("#stus").val();
            //console.log(students);
            let arrstus=[];
            arrstus=students.split(/[(\r\n)\r\n]+/);
            $.each(arrstus,function(i,e){
                if($.trim(e)==""){
                    return true
                }
                let findResult=false;
                $("#allstu").children().each(function(idx,obj){
                    let td=$(obj).children("td")[1];
                    if($.trim( $(td).text() )==$.trim(e) ){
                        $(obj).find("input[type='checkbox']").attr("checked", "checked");
                        findResult=true;
                    }
                });
                if(!findResult){
                    $("#error").prepend("<option value='" + e + "'>设置失败：" + e + "</option>");
                }
            });
        })

    }


    //快速预览试题（资料-》题库）20200711
    if(window.location.pathname=='/exam/search'){
        //获取各试题url
        window.currentQuestionIndex=-1;
        let tr= $("#tableId>tr:gt(0)");
        var tagA= $(tr).find("td:eq(1)").children("a");
        tagA.each( function(i, e){
            let url=$(e).attr("href");
            $(e).attr("id","question_" + i);
            $(e).attr("data-href",url);
            $(e).attr("href","javascript:void(0);");
            $(e).removeAttr("target");
            $(e).on("click",function(){
                $('#reviewFrame').attr('src', url);
                $(e).css('font-weight','bold');
                currentQuestionIndex=i;
                $('#myreviewWindow').show();
            });
        });

        //定义弹出框
        let reviewWindow='<div id="myreviewWindow">\
<div class="pop_notice_title">\
<a class="pop_dele" href="javascript:void(0);" onclick=$("#myreviewWindow").hide()></a>\
</div>\
<div class="pop_notice_cont">\
<iframe id="reviewFrame" src="" width="780" height="500" frameborder="0" scrolling="auto" ></iframe\
</div>\
<div class="q_pop_import_bnt">\
<input type="button" id="btnPrevious" value="上题" onclick="switchQuestion(-1)"  class="q_pop_bnt_quxiao">\
<input type="button" id="btnNext" value="下题" onclick="switchQuestion(+1)"  class="q_pop_bnt_quxiao">\
<input type="button" value="关闭" onclick=$("#myreviewWindow").hide()  class="q_pop_bnt_quxiao">\
</div>\
</div>';
        $("#customType").before(reviewWindow);
        $("#myreviewWindow").attr("class","pop_notice");
        $('#myreviewWindow').css({
            'top' : ($(window).innerHeight() - $('.pop_notice').innerHeight()) / 2,
            'left' : ($(window).innerWidth() - $('.pop_notice').innerWidth()) / 2,
            'background-color':'#eeeeee',
            'width':800,
        });

        //切换试题
        unsafeWindow.switchQuestion = function(goIndex){
            let newQuestionIndex=currentQuestionIndex + goIndex;
            if(newQuestionIndex<0){
                $("#btnPrevious").val("已到页头");
            }
            else{
                $("#btnPrevious").val("上题");
            }

            if(newQuestionIndex>19){
                $("#btnNext").val("已到页尾");
            }
            else{
                $("#btnNext").val("下题");
            }

            if(newQuestionIndex >=0 && newQuestionIndex<=19){
                $("#question_" + currentQuestionIndex).css('font-weight','');
                $("#question_" + newQuestionIndex).css('font-weight','bold');
                let newUrl=$(tagA[newQuestionIndex]).attr("data-href");
                $('#reviewFrame').attr('src',newUrl );
                currentQuestionIndex = currentQuestionIndex + goIndex;
            }
        }

    }

    //记忆并醒目标记单击查看所在的学生（作业-》查看）20200711
    if(window.location.pathname=='/work/reviewTheList'){
        //alert( $('p').length);
        $('p').css("color","red");
        $('p').unbind().bind("mouseover",function(){
            this.css("background-color","yellow");
        })
    }

    //作业|主观题判卷 自动填写满分
    if(window.location.pathname=='/work/selectWorkQuestionYiPiYue' || window.location.pathname=='/work/reviewTheContentNew'){
        //显示姓名
        let stuname=$('img.headimages.fl').next().children('i').text() //学生姓名
        let nameTag=$('<span style="font-weight:bold">' + stuname + '</span>')
        $('span[style="line-height: 2;"]').next().children().first().after( nameTag )

        //填写默认最高分或已打过的分数
        let scoreText=$('span[style="line-height: 2;"]') // 题目分值：100.0 分
        let score=scoreText.text().substring(scoreText.text().indexOf("：")+1,scoreText.text().indexOf(" 分"));
        let stuScoreObj=$('i[style="color:red;"]');//已判过卷的分数元素
        if( stuScoreObj.length>0){
            score=stuScoreObj.text().replace(/分/, "");
        }
        $("input[placeholder='0-100.0']").val(score);        //填写分数1
        $("#tmpscore").val(score);                           //填写分数2

        //鼠标悬放分数全选-20200708
        $("input[placeholder='0-100.0']").mouseover(function(){
            $(this).select();
        })

        //“隐藏题干”复选框状态及效果持久化-20200708
        let iTag= $("i:contains('隐藏题干')");
        let cbxTag= $("i:contains('隐藏题干')").prev();
        cbxTag.click( function(){
            if(cbxTag.is(':checked') ){
                GM_setValue("showOrHide","hide");
            }
            else{
                GM_setValue("showOrHide","show");
            }
        });

        if( GM_getValue("showOrHide") =="hide"){
            setTimeout(function () {
                cbxTag.prop("checked",true);
                dealQueContent(cbxTag);
            },50)
        }
    }

    // 统计|成绩管理|权重设置 自动合分
    if(window.location.pathname=='/scoreAnalysis/toSetWeights'){
        scoresum()
    }

    // 统计|成绩管理|成绩统计 自动列分数段
    if(window.location.pathname=='/moocAnalysis/analysisScore'){
        //展开所有成绩20200720
        let myTimer=function(){
            if( $("#tjMore").attr("style")=="display: block;" )
            {
                more();
            }
            //  else{
            //    clearInterval(myVar);
            // }
        }
        var myVar = setInterval( myTimer , 1000);


        let Excellent=$('<td style="background-color:#FFCCCC"></td>')
        let Good=$('<td></td>')
        let Average=$('<td></td>')
        let Pass=$('<td></td>')
        let Fail=$('<td style="background-color:#FFFFCC"></td>')
        let StuCounts=$('<td></td>')
        let StuAverage=$('<td></td>')
        let StuVariance=$('<td></td>')
        let tr=$('<tr></tr>')
        tr.append(Excellent)
        tr.append(Good)
        tr.append(Average)
        tr.append(Pass)
        tr.append(Fail)
        tr.append(StuCounts)
        tr.append(StuAverage)
        tr.append(StuVariance)

        let scoreGrade=$('<table border="1" style="border-collapse:collapse;margin-top:5px; border: 1px solid rgb(69, 238, 69);width:500px; "><tr><th style="background-color:#FFCCCC">优</th><th>良</th><th>中</th><th>及</th><th style="background-color:#FFFFCC">不及</th><th>总人数</th><th>平均分</th><th>标准差</th></tr></table>')
        scoreGrade.append(tr)
        $(".CyTopN").after(scoreGrade)
        $(".tablecon tbody").bind('DOMNodeInserted', function (e) {
            let scores=[] //成绩数组
            let scoreSum=0
            let excellen=0
            let good=0
            let average=0
            let pass=0
            let fail=0
            $(".borRightNone>span").each(function(){
                if(!isNaN(parseFloat($(this).text()))){
                    let score=parseFloat($(this).text())
                    scores.push(score)
                    scoreSum+=score
                    if(score>=90){
                        $(this).parent().parent().css("background-color","#FFCCCC")
                        excellen++
                    }
                    else if(score>=80){
                        good++
                    }
                    else if(score>=70){
                        average++
                    }
                    else if(score>=60){
                        pass++
                    }
                    else{
                        $(this).parent().parent().css("background-color","#FFFFCC")
                        fail++
                    }
                }
            });
            Excellent.text(excellen)  //优
            Good.text(good)           //良
            Average.text(average)     //中
            Pass.text(pass)           //及
            Fail.text(fail)           //不及
            let stuCounts=scores.length
            StuCounts.text(stuCounts) //人数
            let stuAverage=scoreSum/stuCounts
            StuAverage.text(stuAverage.toFixed(2) ) //平均分
            //就是用每个样本的分数减平均分，再求平方和，再除以样本容量，这个是方差。在开方就是标准差了
            //定义两个简单的函数
            var sum = function(x,y){ return x+y;};　　//求和函数
            var square = function(x){ return x*x;};　　//数组中每个元素求它的平方

            var data = [1,1,3,5,5];　　//
            var mean = data.reduce(sum)/data.length; //平均值
            var deviations = data.map(function(x){return x-mean;});//偏差
            var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1)); //标准差
            StuVariance.text(stddev)

        });

    }
})();

function scoresum(){
    let scoreBox=$('<div></div>')
    floatBox(100,80,'left',scoreBox)
    var sumtimer=setInterval(function(){
        let realWork= $("#realWork").val() // 作业
        let active= $("#active").val()  //课堂互动
        let attend = $("#attend").val()  //签到
        let video= $("#video").val()   //课程音视频
        let work = $("#work").val()   //章节测验
        let pbl = $("#pbl").val()   //PBL
        let onlineTime = $("#onlineTime").val() //章节学习次数
        let bbs= $("#bbs").val()  //讨论
        let readTime= $("#readTime").val()  //阅读
        let liveTime= $("#liveTime").val()  //直播
        let test = $("#test").val() //考试
        let offline= $("#offline").val()  //线下
        let sum= Number(realWork)+Number(active) + Number(attend)+ Number(video)+ Number(work)+Number(pbl) + Number(onlineTime)+Number(bbs) +Number(readTime) + Number(liveTime)+Number(test)+Number(offline)

        scoreBox.html('<h3 style="font-size:18px;">即时合分:</h3><h1 style="font-size:32px;">' + sum + '</h1>')
        if(sum>100){
            scoreBox.css("background-color","yellow")
        }
        else{
            scoreBox.css("background-color","transparent");
        }
    } , 500);
}

function floatBox(width,height,align,obj){
    $("#tailwindFloat").remove()
    var fudong= $('<div id="tailwindFloat" style="border:1px solid #45ee45; width:' + width + 'px; height:' + height + 'px; position: absolute; ' + align + ': 100px; top: 400px;"></div>')
    fudong.append(obj)
    var timer, scrollTop, sideDiv = fudong.appendTo('body');
    $(window).scroll(function() {
        timer && clearTimeout(timer);
        scrollTop = $(this).scrollTop();
        timer = setTimeout(function() {
            sideDiv.animate({
                top: scrollTop + 400 + 'px'
            }, 600);
        }, 200);
    });
}

