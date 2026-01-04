// ==UserScript==
// @name         gzhmtScript
// @namespace    https://github.com/Gccc9
// @version      1.1
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @description  建议使用firefox浏览器 不要使用IE浏览器 教务系统IP:10.10.12.78(内网) 域名:jw.gzhmt.edu.cn.(外网)
// @node         功能1：拦截了登陆界面的弹窗,将错误提示显示在页面上,而不是弹窗
// @node         功能2：选体育课页面中，添加了抢课按钮，位于普通选择按钮的右侧，点击即可进行抢课。
// @node         功能3：选修课页面中，添加了抢课面板，可以进行跨页选择,在想要抢的课的最后一栏点击按钮“添加到抢课”即可添加到面板 而后可以点击提交
// @node         目前webkit内核的浏览器使用此脚本时会出现一些bug,暂未解决
// @node         选修课面板的判断需要做处理,等到抢课的时候即可进行改正。
// @author       Gccc9
// @match        *://10.10.12.78/*
// @match        *://jw.gzhmt.edu.cn/*
// @node         2019.1.7
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381531/gzhmtScript.user.js
// @updateURL https://update.greasyfork.org/scripts/381531/gzhmtScript.meta.js
// ==/UserScript==

var baseURL = window.location.host;//用于判断是内网还是外网 10.10.12.78是内网   访问jw.gzhmt.edu.cn为外网。
var path = window.location.host+window.location.pathname;
var helpString = 	[ '功能1：拦截登陆界面的弹窗,将错误提示显示在页面上.',
				   				   '功能2：选体育课页面中,普通选课按钮的右侧添加了抢课按钮,点击即可进行抢课.',
				   				   '功能3：选修课页面中添加了抢课面板,可以进行跨页选择,加入面板后即可进行提交.',
								   '<strong>注意   :  选修课中的筛选面板不要进行改动！！</strong>',
                                   '<strong>版本号: 1.0　　　作者: Gccc9　　日期: 2019.1.7</strong>'];

var alertMessage;//弹框弹出的信息
//登陆界面
if( path ==  baseURL || path == baseURL+"/default2.aspx" ){
    window.alert = function(message){
        alertMessage = message;
    };
}
//首页
if( path == baseURL+"/xs_main.aspx"){
    window.alert = function(message){
        alertMessage = message;
    };
    //首页因插件与jquery有兼容问题 故改用原生js实现
    window.onload = function(){
        let second = 8; //窗口关闭的秒数
        let intervalEndFlag;//用于记录渐入是否结束了的
        let div = document.createElement("div");
        div.innerHTML = "<div style='display:block;position:fixed;top:240px;right:600px;opacity:0'  id='tipContent'>"
                                                                                +	  "<div style='background:linear-gradient(#eaf4fe,#dbebfb,#dfecfc,#eaf4fe,#dbebfb,#eaf4fe,#bbd2f2);width:350px;padding:10px;border:3px #87a7d7 solid;border-radius:5px;'>"
                                                                                +		"<ul id='helpUl'>"
                                                                                +		"</ul>"
                                                                                +	  "</div>"
                                                                                +"</div>";
        document.getElementById("mainDiv").appendChild(div);
        if( alertMessage != undefined ){
            function fadeIn(element,speeded){
                if(element.style.opacity != 0  ){
                    let num = 10;
                    intervalEndFlag = setInterval(function(){
                        num--;
                        element.style.opacity = num/10;
                        if(num <= 0) {
                            clearInterval(intervalEndFlag);
                        } },speeded);
            }};
            function fadeOut(element,speeded){
                if(element.style.opacity !=1){
                    let num = 0;
                    let st = setInterval(function(){
                        num++;
                        element.style.opacity = num / 10 ;
                        if(num >= 10) {
                            clearInterval(st);
                        } },speeded);
                } };
            document.getElementById("helpUl").innerHTML= "<li>"+ alertMessage+"</li>"
                                                         +"<li style='text-align:center'><strong>"+second+"秒后自动关闭</strong></li>";
            fadeOut(document.getElementById("tipContent"),30);
            let loop = setInterval(function(){
                if( intervalEndFlag == undefined && second != 0 ){
                    second--;
                    document.getElementById("helpUl").innerHTML= "<li>"+ alertMessage+"</li>"
                                                         +"<li style='text-align:center'><strong>"+second+"秒后自动关闭</strong></li>";
                }
                if( second == 0 ){
                    clearInterval(loop);
                }
            },1000);
            let loopSecond= setInterval(function(){
                if( second == 0 ){
                    fadeIn(document.getElementById("tipContent"),30);
                    clearInterval(loopSecond);
                }
            });
        }
        for( let i = 0 ; i < document.querySelectorAll("a[target='zhuti']").length ; i++ ){
            document.querySelectorAll("a[target='zhuti']")[i].addEventListener("click",function(){
                document.querySelector("#tipContent").style.opacity = 0;
            });
        }


    };
}


$(document).ready(function(){
	//登录时清空data数据
	$("#Button1").click(function(){
		sessionStorage.clear();
	});
	//登录页面
    if( path == baseURL+"/" || path == baseURL+"/default2.aspx"){
		//屏蔽登陆弹框 改为在提交登陆界面下面添加提示
        $("#Button1").siblings().last().css("color","red").css("margin-left","20px");
        $("#txtSecretCode").css("font-size","12px");
        $("#icode").css("left","159px");
        $("#icodems").remove();
        //$("#Button1").siblings().last().prepend(alertMessage);
		//脚本说明
		$(".login_right").css("position","relative");
		$(".login_right").append("<input type='button' value='脚本说明' id='scriptHelp' class='button' style='position:absolute;top:45px;right:140px;' >"
										+"<div style='display:none;position:absolute;top:40px;right:-200px'  id='helpContent'>"
                                        +   "<div style='position:relative'>"
                                        +     "<div style='position:absolute;left:-19px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-left: 10px solid transparent;border-right: 10px solid #87a7d7;' id='helpBorder'></div>"
                                        +     "<div style='position:absolute;left:-15px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-left: 10px solid transparent;border-right: 10px solid #e2effc;' id='helpInside'></div>"
										+	  "<div style='background:linear-gradient(#eaf4fe,#dbebfb,#dfecfc,#eaf4fe,#dbebfb,#eaf4fe,#bbd2f2);width:300px;padding:10px;border:3px #87a7d7 solid;border-radius:5px;'>"
										+		"<ul>"
										+		"</ul>"
										+	  "</div>"
                                        +   "</div>"
										+"</div>");
		for(var i=0; i<helpString.length;i++){
			$("#helpContent ul").append("<li style='text-align:left;'>"+helpString[i]+"</li>");
		}
		$("#scriptHelp").click(function(){
			$("#helpContent").fadeToggle();
		});
        $("#Button1").parent().append("<div style='display:none;position:absolute;'  id='tip'>"
                                        + "<div style='position:relative'>"
                                        +   "<div style='position:absolute;left:-19px;top:5px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-left: 10px solid transparent;border-right: 10px solid #87a7d7;'></div>"
                                        +   "<div style='position:absolute;left:-15px;top:5px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-left: 10px solid transparent;border-right: 10px solid #dbebfb;'></div>"
										+	"<div style='background:linear-gradient(#eaf4fe,#dbebfb,#dfecfc,#eaf4fe,#dbebfb,#eaf4fe,#bbd2f2);width:110px;padding:10px;border:3px #87a7d7 solid;border-radius:5px;'>"
										+		"<ul>"
										+		"</ul>"
										+	"</div>"
                                        + "</div>"
										+"</div>");
        if( alertMessage != undefined ){
            $("#tip ul").append("<li style='text-align:left;'>"+alertMessage+"<li>");
            if( alertMessage.startsWith("用户名") ){
                $("#tip").css("top","95px").css("right","10px");
            }else if( alertMessage.startsWith("密码")){
                $("#tip").css("top","128px").css("right","10px");
            }else if( alertMessage.startsWith("验证码")){
                $("#tip").css("top","170px").css("right","10px");
            }
            $("#tip").fadeIn();
            setTimeout(function(){
                $("#tip").fadeToggle();
            },4500);
        };
    }

    //公选课抢课
    if( path == baseURL+"/xf_xsqxxxk.aspx"){
		$(".toolbox").css("position","relative");
		//脚本说明
		$(".toolbox").append("<input type='button' value='脚本说明' id='scriptHelp' class='button' style='position:absolute;top:58px;right:42px;' >"
					 				+"<div style='display:none;position:absolute;top:50px;right:120px'  id='helpContent'>"
                                        +   "<div style='position:relative'>"
                                        +     "<div style='position:absolute;right:-19px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-right: 10px solid transparent;border-left: 10px solid #87a7d7;'></div>"
                                        +     "<div style='position:absolute;right:-15px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-right: 10px solid transparent;border-left: 10px solid #e2effc;'></div>"
										+	  "<div style='background:linear-gradient(#eaf4fe,#dbebfb,#dfecfc,#eaf4fe,#dbebfb,#eaf4fe,#bbd2f2);width:300px;padding:10px;border:3px #87a7d7 solid;border-radius:5px;'>"
										+		"<ul>"
										+		"</ul>"
										+	  "</div>"
                                        +   "</div>"
										+"</div>");
		for(i=0; i<helpString.length;i++){
			$("#helpContent ul").append("<li style='text-align:left;'>"+helpString[i]+"</li>");
		}
		$("#scriptHelp").click(function(){
			$("#helpContent").fadeToggle();
		});


        $("tr.datelisthead:first").append("<td>添加到抢课列表</td>");
        $("tbody:first>tr[class!='datelisthead']").append("<td><input type='button' class='button' value='添加到抢课'></td>");
        $(".searchbox:eq(1)").after("<div style='position:absolute;left:700px;top:5px;width:620px;'>"
                                    +  "<select style='width:99%;height:99%;' size='3' onchange='' id='selectCreazy'>"
                                    +  "</select>"
                                    +  "<input type='button' class='button' value='提交' style='margin-right:50px;margin-top:4px;' id='postSessionStorage'>"
                                    +  "<input type='button' class='button' value='清空' style='margin-right:50px;margin-top:4px;' id='delSessionStorage'>"
                                    +  "<p style='position:absolute;left:405px;top:54px;' id='tip'><p>"
                                    +"</div>");
        var sessionData1 = JSON.parse(sessionStorage.getItem("data1"));
        var sessionData2 = JSON.parse(sessionStorage.getItem("data2"));

        if( sessionData1 != null ){
            $("select[id='selectCreazy']").append("<option>"+sessionData1.sourceName+"---"+sessionData1.teacher+"---"+sessionData1.time+"---"+sessionData1.place+"---"+sessionData1.college+"</option>");
            $("select[id='selectCreazy']").children("option:last").attr("value",sessionData1.postValue);
        }
        if( sessionData2 != null ){
            $("select[id='selectCreazy']").append("<option>"+sessionData2.sourceName+"---"+sessionData2.teacher+"---"+sessionData2.time+"---"+sessionData2.place+"---"+sessionData2.college+"</option>");
            $("select[id='selectCreazy']").children("option:last").attr("value",sessionData2.postValue);
        }
        function sendData(){
            let __EVENTTARGET = $("input[name='__EVENTTARGET']").val();
            let __EVENTARGUMENT = $("input[name='__EVENTARGUMENT']").val();
            let interval1;
            let interval2;
            let runFlag1 = false;
            let runFlag2 = false;
            sessionData1 = JSON.parse(sessionStorage.getItem("data1"));
            sessionData2 = JSON.parse(sessionStorage.getItem("data2"));

            if( sessionData1 != null ){
                runFlag1 = true;
                $("#delSessionStorage").hide();
                $("#postSessionStorage").val("停止抢课");
                $("#postSessionStorage").unbind("click");
                $("#postSessionStorage").click(function(){
                    $("#postSessionStorage").val("提交");
                    if( runFlag1 == true ){
                        runFlag1 = false;
                        clearInterval(interval1);
                    }
                    if( runFlag2 == true ){
                        runFlag2 = false;
                        clearInterval(interval2);
                    }
                    $("#delSessionStorage").show();
                    $("#postSessionStorage").click(sendData);
                });
                let choose = sessionData1.postValue;
                let data = {
                            "__EVENTTARGET":__EVENTTARGET,
                            "__EVENTARGUMENT":__EVENTARGUMENT,
                            "__VIEWSTATE":sessionData1.viewstate,
                            "Button1":$("#Button1").val(),
                            "ddl_kcgs":"",
                            "ddl_kcxz":"",
                            "ddl_sksj":"",
                            "ddl_xqbs":"1",
                            "ddl_ywyl":$("#ddl_ywyl").children("option[selected='selected']").val(),
                            "dpkcmcGrid:txtChoosePage":sessionData1.pageCount,
                            "dpkcmcGrid:txtPageSize":"15",
                            "TextBox1":""
                        };
                data[choose]="on";
                interval1 = setInterval( function(){
                    $.ajax({
                        url:$("#xsyxxxk_form").attr("action"),
                        data:data,
                        headers:{
                            "Upgrade-Insecure-Requests":"1",
                            "X-Requested-With":"",
                            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                        },
                        type:"POST",
                        contentType: 'application/x-www-form-urlencoded;charset=GBK',
                        datatype:"TEXT",
                        success:function(data,status,xhr){
                            if( data.split("alert(\'")[1].split("\');</script>")[0] == "现在不是选课时间！！"){
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                            }else if( data.split("alert(\'")[1].split("\');</script>")[0] == "您已经修过该课程！不能再选"){
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                                clearInterval(interval1);
                                runFlag1 = false;
                                if( runFlag2 == false || interval2 == undefined ){
                                    $("#postSessionStorage").val("提交");
                                    $("#postSessionStorage").unbind("click");
                                    $("#postSessionStorage").click(sendData);
                                    $("#delSessionStorage").show();
                                }

                            }else{
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                                clearInterval(interval1);
                                runFlag1 = false;
                                if( runFlag2 == false || interval2 == undefined){
                                    $("#postSessionStorage").val("提交");
                                    $("#postSessionStorage").unbind("click");
                                    $("#postSessionStorage").click(sendData);
                                    $("#delSessionStorage").show();
                                }
                            }
                        },
                        error:function(data,status,xhr){
                            $("#tip").text("(￣▽￣)\"客官,您的网络似乎不太行");
                        }
                    });
                },500);

            }

            if( sessionData2 != null ){
                runFlag2 = true;
                let choose = sessionData2.postValue;
                let data = {
                            "__EVENTTARGET":__EVENTTARGET,
                            "__EVENTARGUMENT":__EVENTARGUMENT,
                            "__VIEWSTATE":sessionData2.viewstate,
                            "Button1":$("#Button1").val(),
                            "ddl_kcgs":"",
                            "ddl_kcxz":"",
                            "ddl_sksj":"",
                            "ddl_xqbs":"1",
                            "ddl_ywyl":$("#ddl_ywyl").children("option[selected='selected']").val(),
                            "dpkcmcGrid:txtChoosePage":sessionData2.pageCount,
                            "dpkcmcGrid:txtPageSize":"15",
                            "TextBox1":""
                        };
                data[choose]="on";
                interval2 = setInterval( function(){
                    $.ajax({
                        url:$("#xsyxxxk_form").attr("action"),
                        data:data,
                        type:"POST",
                        headers:{
                            "Upgrade-Insecure-Requests":"1",
                            "X-Requested-With":"",
                            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                        },
                        contentType: 'application/x-www-form-urlencoded;charset=GBK',
                        datatype:"TEXT",
                        success:function(data,status,xhr){
                            if( data.split("alert(\'")[1].split("\');</script>")[0] == "现在不是选课时间！！"){
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                            }else if( data.split("alert(\'")[1].split("\');</script>")[0] == "您已经修过该课程！不能再选"){
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                                clearInterval(interval2);
                                runFlag2 = false;
                                if( runFlag1 == false){
                                    $("#postSessionStorage").val("提交");
                                    $("#postSessionStorage").unbind("click");
                                    $("#postSessionStorage").click(sendData);
                                    $("#delSessionStorage").show();
                                }
                            }else{
                                $("#tip").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                                clearInterval(interval2);
                                runFlag2 = false;
                                if( runFlag1 == false){
                                    $("#postSessionStorage").val("提交");
                                    $("#postSessionStorage").unbind("click");
                                    $("#postSessionStorage").click(sendData);
                                    $("#delSessionStorage").show();
                                }
                            }
                        },
                        error:function(data,status,xhr){
                            $("#tip").text("(￣▽￣)\"客官,您的网络似乎不太行");
                        }
                    });
                },500);
            }
        };

        //给"抢课提交"增加监听
        $("#postSessionStorage").click(sendData);



        //给“清空”增加监听
        $("#delSessionStorage").click(function(){
            sessionStorage.clear();
            $("select[id='selectCreazy']").empty();
            $("#tip").text("");
        });

        //给“添加到抢课”增加监听器
        $("td > input[type='button']").click(function(e){
            if( $("select[id='selectCreazy']").children().length < 2 ){
               let sourceName = $(e.target).parent().parent().children("td:eq(1)").text();
               let teacher = $(e.target).parent().parent().children("td:eq(3)").text();
               let time = $(e.target).parent().parent().children("td:eq(4)").attr("title");
               let place = $(e.target).parent().parent().children("td:eq(5)").text();
               let college = $(e.target).parent().parent().children("td:eq(14)").text();
               let postValue =$(e.target).parent().parent().children("td:first").children("input").attr("name");
               let json = {
                   'postValue':postValue,
                   'pageCount':$("#dpkcmcGrid_lblCurrentPage").text(),
                   'sourceName':sourceName,
                   'teacher':teacher,
                   'time':time,
                   'place':place,
                   'college':college,
                   'viewstate':$("input[name='__VIEWSTATE']").val()
               };
               $("select[id='selectCreazy']").append("<option>"+sourceName+"---"+teacher+"---"+time+"---"+place+"---"+college+"</option>");
               $("select[id='selectCreazy']").children("option:last").attr("value",postValue);
               if( sessionStorage.getItem('data1') == null ){
                   sessionStorage.setItem('data1',JSON.stringify(json));
               }else{
                   sessionStorage.setItem('data2',JSON.stringify(json));
               }
            }
        });
    }

    //体育课抢课
    if( path == baseURL+"/xstyk.aspx"){
		//脚本说明
		$("body").append("<input type='button' value='脚本说明' id='scriptHelp' class='button' style='position:absolute;top:58px;right:42px;' >"
					 				+"<div style='display:none;position:absolute;top:50px;right:120px'  id='helpContent'>"
                                        +   "<div style='position:relative'>"
                                        +     "<div style='position:absolute;right:-18px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-right: 10px solid transparent;border-left: 10px solid #87a7d7;'></div>"
                                        +     "<div style='position:absolute;right:-15px;top:10px;width:0px;height:0px;border-top: 10px solid transparent;border-bottom: 10px solid transparent;border-right: 10px solid transparent;border-left: 10px solid #e2effc;'></div>"
										+	  "<div style='background:linear-gradient(#eaf4fe,#dbebfb,#dfecfc,#eaf4fe,#dbebfb,#eaf4fe,#bbd2f2);width:300px;padding:10px;border:3px #87a7d7 solid;border-radius:5px;'>"
										+		"<ul>"
										+		"</ul>"
										+	  "</div>"
                                        +   "</div>"
										+"</div>");
		for(i=0; i<helpString.length;i++){
			$("#helpContent ul").append("<li style='text-align:left;'>"+helpString[i]+"</li>");
		}
		$("#scriptHelp").click(function(){
			$("#helpContent").fadeToggle();
		});

        function sendData(){
            $("#button3").siblings().last().text("-----开始抢课-----");
            $("#button4").val("停止抢课");
            $("#button4").unbind("click");
            $("#button4").click(function(){
                clearInterval(interval);
                $("#button4").val("开始抢课");
                $("#button4").unbind("click");
                $("#button4").click(sendData);
            });
            let interval = setInterval( function(){ //clearInterval(interval);用于终止
                $.ajax({
                    url:$("#Form1").attr("action"),
                    data:{ __EVENTTARGET:$("input[name='__EVENTTARGET']").val(),
                          __EVENTARGUMENT:$("input[name='__EVENTARGUMENT']").val(),
                          __VIEWSTATE:$("input[name='__VIEWSTATE']").val(),
                          button3:"%D1%A1%B6%A8%BF%CE%B3%CC",
                          DropDownList1:$("#DropDownList1").children("option[selected='selected']").val(),
                          ListBox1:$("#ListBox1").children("option[selected='selected']").val(),
                          ListBox2:$("#ListBox2").children("option[selected='selected']").val()
                         },
                    type:"POST",
                    contentType: 'application/x-www-form-urlencoded;charset=GBK',
                    datatype:"TEXT",
                    success:function(data,status,xhr){
                        if( data.split("alert(\'")[1].split("\');</script>")[0] == "只能选1门体育课！！"){
                            $("#Form1").submit();
                        }else if( data.split("alert(\'")[1].split("\');</script>")[0] == "请选择对应值！！"){
                            $("#button3").parent().children("p").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                            clearInterval(interval);
                            $("#button4").val("开始抢课");
                            $("#button4").unbind("click");
                            $("#button4").click(sendData);
                        }else{
                            $("#button3").parent().children("p").text(data.split("alert(\'")[1].split("\');</script>")[0]);
                        }
                    },
                    error:function(data){
                        $("#button3").parent().children("p").text("(￣▽￣)\"客官,您的网络似乎不太行");
                    }
                });
            },300);

        }

        $("#button3").parent().append("<input id='button4' class='button' value='开始抢课' style='width:60px'>");
        $("#button3").parent().append("<p style='display:inline;margin-left:30px;'></p>");
        $("#button4").click(sendData);
    }

});

