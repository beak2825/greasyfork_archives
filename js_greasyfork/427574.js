// ==UserScript==
// @name         SCAU OJ小工具(Beta)
// @namespace    YelloooBlue_SCAU_OJ_TimerTool
// @version      0.3
// @description  适用于：SCAU华南农业大学OJ平台;
// @author       YelloooBlue
// @match        *://172.26.14.60:8000/uoj/mainMenu.html*
// @match        *://202.116.161.81:8000/uoj/mainMenu.html*
// @match        *://acm.scau.edu.cn:8000/uoj/mainMenu.html*
// @match        *://acm.scau.net.cn:8000/uoj/mainMenu.html*
// @grant
// @downloadURL https://update.greasyfork.org/scripts/427574/SCAU%20OJ%E5%B0%8F%E5%B7%A5%E5%85%B7%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427574/SCAU%20OJ%E5%B0%8F%E5%B7%A5%E5%85%B7%28Beta%29.meta.js
// ==/UserScript==


var timeS = 60;//倒计时时间，可修改


//跳转到特定提交列表
function showList(code){
    var iframeContent_2=$('#rightMain').contents().find("iframe").contents();
    if(iframeContent_2.length){
        switch(code) {
            case 0:
                iframeContent_2.get(0).location.href="/uoj/common_solution_listAllRecent_PUBLIC.html";//OJ系统最近提交（可以看见别人）10条
                break;
            case 1:
                iframeContent_2.get(0).location.href="/uoj/common_solution_listByUserRecent_PUBLIC.html";//该用户最近提交记录 20条
                break;
            case 2:
                iframeContent_2.get(0).location.href="/uoj/common_solution_listByUser_PUBLIC.html";//该用户所有提交记录 分页
                break;
        }
    }else alert("请先进入实验界面")
}


//用户信息显示div
var tip=$("<div id='userId' />");
tip.css({"display":"inline-block","height":"50px","line-height":"50px","margin":"10px","text-align":"center","overflow":" hidden","color":"#ffffff"})
var id=localStorage["userId"]
var code=localStorage["userCode"]
if(!id||!code)alert("小工具未读取到您的用户ID或学号，请访问“编辑个人信息”页面获取ID")
tip.html("用户ID:"+id+" 学号:"+code)
$("#top").prepend(tip);


//存放跳转按钮的div
var buttonDiv = $("<div />");
buttonDiv.css({"display":"inline-block","height":"50px","line-height":"50px","margin":"10px","text-align":"center","overflow":" hidden"})

//三个跳转按钮
var button=document.createElement("input");
button.type="button";
button.value="系统最近提交(所有人)";
button.style="padding:5px;margin:10px";
button.onclick =function(){showList(0)};
buttonDiv.append(button);

button=document.createElement("input");
button.type="button";
button.value="用户最近提交";
button.style="padding:5px;margin:10px";
button.onclick =function(){showList(1)};
buttonDiv.append(button);

button=document.createElement("input");
button.type="button";
button.value="用户历史提交";
button.style="padding:5px;margin:10px";
button.onclick = function(){showList(2)};
buttonDiv.append(button);

$("#top").prepend(buttonDiv);



//倒计时显示div
var div = document.createElement("div");
div.style.cssText = "background: #044599;display:inline-block;color:#ffffff;overflow: hidden;z-index: 99999999;margin:10px;text-align:center;line-height:50px;width: 50px;height: 50px;";
div.title = "插件制作：Copyright©YelloooBlue\n 联系方式：YelloooBlue@qq.com";
$("#top").prepend(div);

function setDivContent(content) {
    div.innerHTML = content;
}



(function () {
    'use strict';
    var flag = 0; //0为正在检测提交界面  1为当前处于提交界面  2为正在倒计时
    setDivContent("init");

    //一秒后初始化
    setTimeout(function(){
        alert("目前版本为Beta版，存在许多Bug，如有新版本发布请关注【yellowblue.top】")
    setDivContent("inited");
        $("#nav_module").hide()//隐藏业务模块标题
        $("#nav_resource").css({"margin":"0"})
        $("#top_nav").hide()//隐藏顶部位置栏
        $("#top_logo").hide()//隐藏logo
        $("#main").css({"top":"70px","overflow":" hidden"})//main向上补位

    },1000)


    function ready(form) {

        div.style.backgroundColor = "green"
        setDivContent("ready");

        form.submit(function (e) {
            flag =2;
            div.style.backgroundColor = "OrangeRed"


            var sec=timeS;
            //计时函数
            var timer = setInterval(function () {
                sec--;

                setDivContent( sec );

                //倒计时结束
                if (!sec) {

                    div.style.backgroundColor = "#044599"
                    setDivContent("find");


                    sec = timeS;
                    flag = 0;
                    clearInterval(timer);
                }
            }, 1000);

        })
    }



    //每秒执行一次
    setInterval(function () {

        //$("#main").css({"left":"200px","top":"70px","overflow":" hidden"})

        var iframeContent_1=$('#rightMain').contents();
        var iframeContent_2=$('#rightMain').contents().find("iframe").contents();

        var form = iframeContent_2.find('#form1');//提交表单
        var formT = iframeContent_1.find('#form1');//考试表单

        if (form.length) {
            if(flag==0){
                flag = 1;
                ready(form);
            }
        }
        else if (formT.length) {
            if(flag==0){
                flag = 1;
                ready(formT);
            }
        }
        else{
            if(flag==1){
                flag=0;
                div.style.backgroundColor = "#044599"
                setDivContent("find");
            }
        }



        //二级iframe
        if(iframeContent_2.length){
            //console.log("已经打开二级iframe")

            //提交代码转textarea方便复制
           // var sourceCodeDiv=iframeContent_2.find('#divsource');//定位到源代码div
           // if (sourceCodeDiv.find("pre").length&&!form.length) {
           //     sourceCodeDiv.html($('<textarea style="height:400px;width:100%"/>').val(sourceCodeDiv.find("pre").find("pre").html()));
           // }

            //输入样例转textarea
          //  var inputExpPre=iframeContent_2.find('#content').find("h1:contains(输入样例)").next("pre");//定位到输入样例
          //  if (inputExpPre.length) {
           //     var h=inputExpPre.height()//原来pre的高度
             //   inputExpPre.after($('<textarea id="inputExp" style="width:100%;display:block"/>').val(inputExpPre.html()));
           //     var textArea=inputExpPre.next("textarea");
            //    inputExpPre.remove();
            //    textArea.height(h+20)
           // }

            iframeContent_1.find("#sider").css({"left":"0px"})
            iframeContent_1.find("#main").css({"left":"170px"})


           // if(!iframeContent_2.find("#viewA").length){
            //    iframeContent_2.find("body").before(listDiv)
           //}



        }

        var userInfo_form=iframeContent_1.find("#user_user_save_PUBLIC");
        if(userInfo_form.length){
            if(!userInfo_form.find("#nick").length){
                userInfo_form.find("tbody:eq(1)").append('<tr id="nick"><td width=100% colspan=4><label for="user_user_save_PUBLIC_user_nick" class="desc">昵称</label><input type="text" name="user.nick" value="yellowblue.top" id="user_user_save_PUBLIC_user_nick" class="text large"/></td></tr>')
            }
            if(!id||!code){
            //编辑个人信息页面获取用户id
                var userId = userInfo_form.find("#user_user_save_PUBLIC_user_id").val()
                var userCode= userInfo_form.find("#user_user_save_PUBLIC_user_username").val()
                //var userCode= iframeContent_1.find("#user_user_save_PUBLIC_user_username").val()
                //console.log(logButton)
                if(userId&&userCode){
                    localStorage["userId"]= userId
                    localStorage["userCode"]= userCode
                    id=userId
                    code=userCode
                    $("#userId").html("用户ID:"+id+" 学号:"+code)
                    alert("成功获取"+"用户ID:"+id+" 学号:"+code)
                }
            }
        }



        //检测是否到题目列表界面
        var tr=iframeContent_2.find("#node").find("tbody").find("tr")
        //console.log(tr.eq(1).find("td:last"))

        //检测"提交列表"内是否有按钮
        if(!tr.eq(0).find("td:last").find("#faster").length){

                tr.each(function(){
                var problemId=$(this).find("td:eq(1)").html();
                    var newinput=$('<input id="faster" type="button" value="2s查看" style="color:grean">')
                    if(id){
                        newinput.attr("onclick","location.href='/uoj/common_solution_listByUserAndProblem_PUBLIC_DELAY2.html?userId="+id+"&amp;problemId="+problemId+"'");
                    }else {
                         newinput.attr("onclick","alert('未获取到您的用户ID，无法提供此服务')");
                    }
                    $(this).find("td:last").append(newinput)
                });
        }




        //检测是否到提交记录界面
        var table=iframeContent_2.find("#solution");
        if(table.length){
            if(table.find("thead").find("th:eq(1)").html()=="题目编号"){
                tr=table.find("tbody").find("tr")
                //检测一个tr的"语言"内是否有超链接A标签
                if(!tr.eq(0).find("td:eq(5)").find("a").length){
                    tr.each(function(){
                        var solutionId=$(this).find("td:eq(0)").html();
                        var newinput=$('<a>强制跳转</a>').attr("href","/uoj/common_solution_viewCode_PUBLIC.html?solutionId="+solutionId);
                        $(this).find("td:eq(5)").append(newinput)
                    });
                }
            }
            else{

            }




        }
    }, 1000);
}
)();

