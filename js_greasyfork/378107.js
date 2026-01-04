// ==UserScript==
// @name         福建省干部网络学院助手
// @namespace    www.fsa.gov.cn
// @version      3.1
// @description  福建省干部网络学院学习助手，自动学习“年度必修”和“我的选修”课程
// @author       zsy
// @license
// @match        https://www.fsa.gov.cn/zxStudy_2018/study.aspx?xxfbid=*
// @match        http://www.fsa.gov.cn/zxStudy_2018/study.aspx?xxfbid=*
// @match        https://www.fsa.gov.cn/zxStudy_2018/study_General.aspx?xxfbid=*
// @match        http://www.fsa.gov.cn/zxStudy_2018/study_General.aspx?xxfbid=*
// @match        https://www.fsa.gov.cn/zxStudy_2018/showservice.aspx?xxfbid=*
// @match        http://www.fsa.gov.cn/zxStudy_2018/showservice.aspx?xxfbid=*
// @match        https://www.fsa.gov.cn/zxStudy_2018/showservice_General.aspx?xxfbid=*
// @match        http://www.fsa.gov.cn/zxStudy_2018/showservice_General.aspx?xxfbid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378107/%E7%A6%8F%E5%BB%BA%E7%9C%81%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/378107/%E7%A6%8F%E5%BB%BA%E7%9C%81%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
	'use strict';
	//    $('video').each(function () {
	//        $(this).attr('autoplay', 'autoplay');
	//        $(this).click();
	//        alert('ok1');
	//    });
//     var div1 = document.getElementById("kcml").getElementsByTagName("li");
    var kcwc = 0;
    if($("#txt_kjid").length > 0)
    {
        var kcid = txt_kjid.value;
    }else
    {
        var play =function play() {//关闭正在播放的其他课件，跳转到当前课件
            var courseID = $("#hid_id").val();

            var serviceURL = "webservices/AjaxEnd.ashx";
            $.ajax({

                type: "POST",

                //contentType: "application/json; charset=utf-8",
                data: "",

                url: serviceURL,

                async: false, //阻塞jquery同步执行的进程，等待异步进程执行完后再执行;

                success:

                function (msg) {
                    if (msg == "ok") {
                        window.location.href = "study_General.aspx?xxfbid=" + courseID +"&action=user";
                    }


                    else if (msg == "wrong") {

                    }


                },

                error:

                function (XMLHttpRequest, textStatus, errorThrown) {

                    alert("Error Occured!");

                }

            });
        }
        play();
    }
    var save = function (end, types) {
        var serviceURL = "webservices/AjaxScorm_General.ashx";
        var cLocation = currentzjd;
        var cSessionTime = ctime;

        var endtime;
        if (end == 1) {
            playstate = "end";
            endtime = "1";
        }
        else if (end == 2) {
            endtime = "2";
        }
        else {

            endtime = "0";
            }
            $.ajax({
                    type: "POST",
                    dataType: "text",
                    url: "webservices/AjaxScorm_General.ashx?userID=" + user_id + "&courseID=" + course_id + "&kjkid=" + kjk_id + "&lessonLocation=" + cLocation + "&sessionTime=" + cSessionTime + "&endtime=" + endtime + "&newmx=" + lesson_newmx,
                    //data: "userID=" + user_id + "&courseID=" + course_id + "&lessonLocation=" + cLocation + "&sessionTime=" + cSessionTime + "&endtime=" + endtime + "&newmx=" + lesson_newmx,
                    async: true, //阻塞jquery同步执行的进程，等待异步进程执行完后再执行;
                    success:
                            function (msg) {
//                                $("#txt_save").fadeIn(3000);
//                                $("#txt_save").fadeOut(3000);
                                $(".tag").fadeOut(10000);
                                //console.log(msg);
                                if (msg == "pause") {
                                    //play();
                                    //parent.test3();
                                }
                                else if (msg == "end") {
                                    playstate = "end";
                                    var str_warning = "";
                                    if (types == "windowclose") {
                                        window.close();
                                    } else {
                                            if($("#bx0").length > 0)
                                                {
                                                bx0.click();
                                                }else if($("#xx0").length > 0)
                                                {
                                                xx0.click();
                                                }else
                                                {
//                                                   alert("我是一个保存框！");
                                                 save(1, "windowclose");
                                                }
                                            }
                                        }
                                    },
                            error:
                            function (XMLHttpRequest, textStatus, errorThrown) {
                                var errorsave = XMLHttpRequest.status + "|" + XMLHttpRequest.readyState + "|" + XMLHttpRequest.statusText + "|" + errorThrown;
                                $.ajax({
                                    type: "POST",
                                    //contentType: "application/json; charset=utf-8",
                                    dataType: "text",
                                    url: "webservices/AjaxErrorLog.ashx?userID=" + user_id + "&courseID=" + course_id + "&lessonLocation=" + cLocation + "&sessionTime=" + cSessionTime + "&endtime=" + endtime + "&newmx=" + lesson_newmx + "&state=start" + "&errorSave=" + errorsave,
                                    //data: "userID=" + user_id + "&courseID=" + course_id + "&lessonLocation=" + cLocation + "&sessionTime=" + cSessionTime + "&endtime=" + endtime + "&newmx=" + lesson_newmx + "&state='23'" + "&errorSave=" + errorsave,
                                    //data: cp,
                                    async: false, //阻塞jquery同步执行的进程，等待异步进程执行完后再执行;
                                    success: function (m) {
                                        //alert("错误日志保存成功");
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        //alert(errorThrown)
                                    }
                                });
                                //alert("保存失败，请重试或联系管理员");
                            }
                        });
                    }
	var time = '<div> <input type="text" id="txt_timer" style="width: 27%; float:right; color: red;" readonly="readonly" value="计时器当前未加载（如播放异常，请点击右边的“问题反馈”按钮进行反馈）"> </div>';
	var bixiu = '<div class="kecheng" id="bixiu" style="width: 49%;float:left;"><li style="height: 29px;margin: 0px;width: 100%;float: left;color: #cc0104;text-align: center;text-indent: 5px;cursor: pointer;line-height: 26px;font-size: 14px;border-bottom: 2px solid #cc0104;font-weight: bold;" id="ndbx">年度必修未完成课程</li></div>';
	var xuanxiu = '<div class="kecheng" id="xuanxiu" style="width: 49%;float:right;"><li style="height: 29px;margin: 0px;width: 100%;float: left;color: #cc0104;text-align: center;text-indent: 5px;cursor: pointer;line-height: 26px;font-size: 14px;border-bottom: 2px solid #cc0104;font-weight: bold;" id="wdxx">我的选修未完成课程</li></div>';
	var div1 = document.getElementById("kcml").getElementsByTagName("li");
    if($("#mpanel").length > 0)
       {
       $("#mpanel").remove();
       }
    $("video").remove();
	$("#MainToper span.icon_wang").remove();
    $("#MainToper H5").before("<div style='width: 5%; color: #f00;float: left;font-size: 13px;font-weight: bold;line-height: 13px;margin: 0;padding: 12px;'>正在学:</div>");
    $("#MainToper div.mymenu").remove();
	$("#MainToper H5").after(time);
	$("#MainBottomer").hide();
	$("#notebottom").remove();
	$("#MainToper").after(xuanxiu);
	$("#MainToper").after(bixiu);
    $("#MainToper").after(div1);
	//    show_tab("ndbxk");

    function returncolor(num) {
			var fontcolor = "#000";
			if (parseFloat(num) > 0 && parseFloat(num) < 100) {
				fontcolor = "red";
			} else if (parseFloat(num) == 100) {
				fontcolor = "#00ab2c";
			}
			return fontcolor;
		}

    function getRandomNumber(max,min) {
          var x = Math.floor(Math.random() * (max - min + 1)) + min;
          return x;
       }

    function returnzt(num) {
			var zt = "开始学习";
			if (parseFloat(num) > 0 && parseFloat(num) < 100) {
				zt = "继续学习";
			} else if (parseFloat(num) == 100) {
				zt = "已完成";
			}
			return zt;
		}
    var sec_to_time = function(s) {
        var t;
		if (s > -1) {
			var hour = Math.floor(s / 3600);
			var min = Math.floor(s / 60) % 60;
			var sec = s % 60;
			if (hour < 10) {
				t = '0' + hour + ":";
			} else {
				t = hour + ":";
			}

			if (min < 10) {
				t += "0";
			}
			t += min + ":";
			if (sec.toFixed(0) < 10) {
				t += "0";
			}
			t += sec.toFixed(0);
		}
		return t;
	}
    var timer = function() {
		ctime = ctime + 1;
		var str_timer = sec_to_time(ctime);
		$("#txt_timer").css("color", "black");
		$("#txt_timer").val("计时器正常加载，本次学习时长：  " + str_timer.toString());
		if (ctime % 300 == 1 && ctime != 1) {   //11.14 修改为2分钟保存一次  2019-11-12 修改为5分钟一次
			save(0, "");
		}
        return timer;
	}
	setInterval(timer(),1000);

	var bxkc = function() {
        var str_check = $("#bixiu div.index_dt1").text();
        var str_new = "课程名称进度";
		var url = "../BB_PX/getkcinfo.aspx";
		var data = [],
		data1 = [];
		var xyid = $("#txt_xyid").val();
		$.ajax({
			type: "post",
			data: {
				"id": 0,
				"pc": 1,
				"xyid": xyid,
                "czlx": "bxkc"

			},
			url: url,
			async: false,
			success: function(theString) {
				if (theString !== "") {
					data = strToJson(theString);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("bxkc Error Occured!");
			}
		});
		var str_bxk = "";
		var y_count = data.length;
		var page = 1;
		var x = 0,
		zyhxf = 0,
		zjd = 0; //统计总学分，总获得学分
		var mysl = 40; //每页数量
		var lsbl = y_count / mysl;
		var zpage = Math.ceil(lsbl);
		var pager = 1;
		if (page === null || page === "") {
			pager = 1;
		} else {
			pager = page;
		}
		var kll, klk, gifname;
		if ((pager * mysl) > y_count) {
			kll = y_count;
		} else {
			kll = pager * mysl;
		}
		str_bxk += "<div Class='index_dt1'>";
		str_bxk += "<div class='bt' style='width: 85%;float:left;font-weight:bold; text-align:center;'>课程名称</div>";
		str_bxk += "<div class='update-date' style='width: 15%;float:right;font-weight:bold; text-align:center;'>进度</div>";
		if (y_count > 0) {
			for (var z = ((pager - 1) * mysl), y = kll; y > 0 && z < y_count; z++) {
				if (data[z].jd != 100) {
					var str_func = "study_General.aspx";
					str_bxk += "<div Class='wwckc'>"
                    str_bxk += "<div class='bt'>"
                    str_bxk +="<a id=bx"+ x + " href='" + str_func + "?xxfbid=" + data[z].id + "&action=user' title='" + data[z].bt + "' style='width: 85%;float:left;'>"
					var str_bt = data[z].bt
					if (str_bt.length > 34) {
						str_bt = str_bt.substring(0, 34);
					}
					str_bxk += str_bt;
                    str_new += str_bt;
					str_bxk += "</a>";
					str_bxk += "<div id=jd"+ x + " class='update-date' style='width:15%; float:right; color:" + returncolor(data[z].jd) + "; text-align:center;'>";
					str_bxk += data[z].jd;
                    str_new += data[z].jd;
                    str_new += "%";
					str_bxk += "%</div>";
					str_bxk += "</div>";
					str_bxk += "</div>";
					y--;
                    x++;
				}
                else if(data[z].id == kcid){
                    kcwc = 1;
                         }
			}
		}
//         $("#bixiu div.index_dt1").remove();
//         setTimeout($("#bixiu").append(str_bxk),500);
//         var str_check = $("#bixiu div.index_dt1").text();
//        if(str_new == str_check && str_check != "课程名称进度" && $("#MainContent li [href] font").length > 0 && $("#MainContent li:not(:has(a)) font")[0].innerText != "[必修课]")
        if(str_new == str_check && str_check != "课程名称进度")
        {
//            if($("#MainContent li [href] font").length > 0 && $("#MainContent li:not(:has(a)) font")[0].innerText != "[必修课]")
//            {
            if($("#MainContent li [href] font").length > 0)
            {
               for(var s = 0,m = 0;s < $("#MainContent li [href] font").length ; s++)
               {
//                   if($("#MainContent li [href] font")[s].color != "#00ab2c" && $("#MainContent li [href] font")[s].innerText == "[必修课]")
                   if($("#MainContent li [href] font")[s].innerText != "[已完成：100.00%]" && $("#MainContent li [href] font")[s].innerText != "[必修课]" && $("#MainContent li [href] font")[s].innerText != "[进度：100.00%]")
                   {
                       save(0, "");
                       $("#MainContent li [href]")[m].onclick();
                       break;
                   }else if($("#MainContent li [href] font")[s].innerText != "[必修课]")
                   {
                       m++;
                   }
//                    }else
//                    {
//                        kcwc = 1;
// //                        $("#bixiu div.index_dt1").remove();
//                    }
               }
            }
               kcwc = 1;
           }
            else
           {
                $("#bixiu div.index_dt1").remove();
           }
        $("#bixiu").append(str_bxk);
//         }
        if(kcwc == 1)
           {
               if($("#bx0").length > 0)
               {
                   save(1, "");
                   bx0.click();
               }else if($("#xx0").length > 0)
               {
                   save(1, "");
                   xx0.click();
               }else
               {
                    setTimeout('save(1, "windowclose")',10000);
               }
           }
        return bxkc;
    }
//     setInterval(bxkc(),getRandomNumber(300000,500000));

	var wdxx = (function() {
        var str_check = $("#xuanxiu div.index_dt1").text();
        var str_new = "课程名称进度";
		var url = "../BB_PX/getkcinfo.aspx";
		var data = [],
		data1 = [];
		var xyid = $("#txt_xyid").val();
		$.ajax({
			type: "post",
			data: {
				"id": 0,
				"pc": 1,
				"xyid": xyid,
				"czlx": "wdsc"
			},
			url: url,
			async: false,
			success: function(theString) {
				if (theString !== "") {
					data = strToJson(theString);
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("bxkc Error Occured!");
			}
		});
		var str_bxk = "";
		var y_count = data.length;
		var page = 1;
		var x = 0,
		zyhxf = 0,
		zjd = 0; //统计总学分，总获得学分
		var mysl = 40; //每页数量
		var lsbl = y_count / mysl;
		var zpage = Math.ceil(lsbl);
		var pager = 1;
		if (page === null || page === "") {
			pager = 1;
		} else {
			pager = page;
		}
		var kll, klk, gifname;
		if ((pager * mysl) > y_count) {
			kll = y_count;
		} else {
			kll = pager * mysl;
		}
		str_bxk += "<div Class='index_dt1'>";
		str_bxk += "<div class='bt' style='width: 85%;float:left;font-weight:bold; text-align:center;'>课程名称</div>";
		str_bxk += "<div class='update-date' style='width: 15%;float:right;font-weight:bold; text-align:center;'>进度</div>";
		if (y_count > 0) {
			for (var z = ((pager - 1) * mysl), y = kll; y > 0 && z < y_count; z++) {
				if (data[z].jd != 100) {
					var str_func = "study_General.aspx";
					str_bxk += "<div Class='wwckc'>"
                    str_bxk += "<div class='bt'>"
                    str_bxk += "<a id=xx"+ x + " href='" + str_func + "?xxfbid=" + data[z].id + "&action=user' title='" + data[z].bt + "' style='width: 85%;float:left;'>"
					var str_bt = data[z].bt
					if (str_bt.length > 34) {
						str_bt = str_bt.substring(0, 34);
					}
					str_bxk += str_bt;
                    str_new += str_bt;
					str_bxk += "</a>";
					str_bxk += "<div id=jd"+ x + " class='update-date' style='width:15%; float:right; color:" + returncolor(data[z].jd) + "; text-align:center;'>";
					str_bxk += data[z].jd;
                    str_new += data[z].jd;
                    str_new += "%";
					str_bxk += "%</div>";
					str_bxk += "</div>";
					str_bxk += "</div>";
					y--;
                    x++;
                }
                else if(data[z].id == kcid){
                    kcwc = 1;
                }
			}
		}
        str_bxk += "</div>";
        if(str_new == str_check && str_check != "课程名称进度" && $("#bx0").length == 0)
        {
             if($("#MainContent li [href] font").length > 0)
             {
               for(var s = 0,m = 0;s < $("#MainContent li [href] font").length ; s++)
               {
//                   if($("#MainContent li [href] font")[s].color != "#00ab2c")
                   if($("#MainContent li [href] font")[s].innerText != "[已完成：100.00%]" && $("#MainContent li [href] font")[s].innerText != "[必修课]" && $("#MainContent li [href] font")[s].innerText != "[进度：100.00%]")
                   {
                       save(0, "");
                       $("#MainContent li [href]")[m].onclick();
                       break;
                    }else if($("#MainContent li [href] font")[s].innerText != "[必修课]")
                   {
                       m++;
                   }else
                   {
                       kcwc = 1;
//                        $("#xuanxiu div.index_dt1").remove();
                   }
               }
             }
            kcwc =1;
           }
        else{
            $("#xuanxiu div.index_dt1").remove();
        }
        $("#xuanxiu").append(str_bxk);
        if(kcwc == 1)
           {
               if($("#bx0").length > 0)
               {
                   save(1, "");
                   bx0.click();
               }else if($("#xx0").length > 0)
               {
                   save(1, "");
                   xx0.click();
               }else
               {
//                   alert("我是一个选修框！");
                    setTimeout('save(1, "windowclose")',10000);
               }
           }
        return wdxx;
        }
   )

//    setInterval(wdxx(),getRandomNumber(300000,500000));
    bxkc();
    wdxx();
    var loop = (function() {
        if($("#bx0").length > 0)
        {
            setTimeout(bxkc,200)
        }else if($("#xx0").length > 0)
        {
            setTimeout(wdxx,200)
        }else
        {
            setTimeout(save(1, "windowclose"),10000);
        }
        return loop;
    })
    setInterval(loop,getRandomNumber(300000,500000));
//    var next = (function() {
//        if(kcwc == 1)
//       {
//         if($("#bx0").length > 0)
//        {
//            bx0.click();
//        }else if($("#xx0").length > 0)
//        {
//            xx0.click();
//        }else
//        {
//            home-zx.click();
//        }
//       }
//    })
//    setInterval(next(),150000);
})();
