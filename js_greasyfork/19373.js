// ==UserScript==
// @name        教师端
// @namespace   new
// @include     http://jwgl2.jmu.edu.cn/Teacher/Query/QueryStudent.aspx
// @version     1
// @grant       none
// @require     http://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @description 关于集美大学教师端的教务系统对于学生管理的增强处理
// @downloadURL https://update.greasyfork.org/scripts/19373/%E6%95%99%E5%B8%88%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/19373/%E6%95%99%E5%B8%88%E7%AB%AF.meta.js
// ==/UserScript==

$(document).ready(function(){

	var html = ' '
		html +='<td align="center" id="button">';
		html +='<input type="button" value="查看照片">';
		html +='<input type="button" value="查询成绩">';
		html +='</td>'
	$("#outtable").find("tr:eq(0)").append('<td align="center" style="border:0;color:#fff">学生信息查询</td>');
	$("#outtable").find("tr").not(":first").append(html);

	var tableLength = $("#outtable").find("tr").not(":first");
	if( tableLength.length >1 ){
		var a = '<div id="pButton"><input type="button" value="显示全体学生照片"></div>';
		$("#bodyInfo").find("table:eq(0)").after(a);
	}

	//单个学生照片查看
	$(this).on('click','input[value="查看照片"]',function(){		
		$(this).parent().parent().siblings().find("div").hide();
		$(this).parent().parent().siblings().find("input").show();
		var studentNum = $(this).parent().parent().find("td:eq(0)").text();
		$(this).parent().find("input").hide();
		var photoHttp = "http://jwgl2.jmu.edu.cn/Teacher/Query/StudentPhoto.aspx?stucode=" + studentNum;
		var image = '<div><a target="_blank" href="' + photoHttp + '">'+ '<img width="90" height="120" src="' + photoHttp +'"></a><input type="button" value="收起"></div>';
		$(this).parent().append(image);
		$(this).parent().find('input[value="收起"]').click(function(){
			$(this).parent().parent().find("div").hide();
			$(this).parent().parent().find("input").show();
		})
	})
	//多个学生照片查看
	$("#pButton").click(function(){
		$("#outtable").hide();
		$("#bodyInfo>div>p").hide();
		var newHtml = ' '
			newHtml += '<div align="center">';
			newHtml += '<div style="width:95%">';
			newHtml += '<p align="center" style="font-size:24px">学生信息</p>';
			newHtml += '<div class="studentNews">';
			newHtml += '</div></div></div>'
		$("#bodyInfo").append(newHtml);

		$("#outtable").find("tr").not(":first").each(function(){
			var studentNum = $(this).find("td:eq(0)").text();
			var studentName = $(this).find("td:eq(1)").text();
			var Cstudent = $(this).find("Td:eq(3)").text();
			var data = {
				num : studentNum,
				name : studentName,
				C : Cstudent,
				photo : photoHttp
			};

			var photoHttp = "http://jwgl2.jmu.edu.cn/Teacher/Query/StudentPhoto.aspx?stucode=" + studentNum;
			var student = "http://jwgl2.jmu.edu.cn/Teacher/Query/ViewStudent.aspx?stucode=" +studentNum;
			var a = ' '
				a += '<div style="float:left;border:1px solid; width:12%;" >'
				a += '<div align="center" style="border-bottom:1px solid;height:150px">';
				a += '<a target="_blank" href="' + photoHttp + '">'
				a += '<img style="padding-top:10px" width="90" height="120" src="' + photoHttp +'">';
				a += '</a></div>';
				a += '<p style="border-bottom:1px solid" align="center">' + Cstudent +'  ' + studentName  + '</p>';
				a += '<a target="_barket" href="' + student + '">';
				a += '<p align="center">' + studentNum +'</p>';
				a += '</a></div>'
				$(".studentNews").append(a);
		})
	})
	
	//显示成绩
	$(this).on('click','input[value="查询成绩"]',function(){
                console.log(123);
		var  sqNum = $('input[value="收起"]').length;
		if ( sqNum == 0 ){
			$(this).parent().parent().show();
			$(this).parent().parent().siblings().not(":first").hide();
			$(this).parent().append('<input type="button" value="收起">');
			$('input[value="收起"]').click(function(){
				$(".tableHide").remove();
				positionThis.siblings().show();
				$(this).remove();
			})
			
			var data = {};
			var arr = new Array();
			var sz = new Array();
			var studentNum = $(this).parent().parent().find("td:eq(0)").text();
			var positionThis = $(this).parent().parent();
			$.ajax({
				type:"get",
				url:"http://jwgl2.jmu.edu.cn/Teacher/Query/ViewStudent.aspx",
				data:{
					stucode:studentNum
				},
				success:function(html){
						var html = $(html).filter("table:eq(1)");
						//console.log(html)
						var a = ' '
							a += '<div class="tableHide"><table border="1" align="center" width="98%" cellspacing="0" cellpadding="4" class="main">';
							a += '<h1 align="center">学生成绩</h1>';
							a += '<tr align="center" bgcolor="#6C94D1"><td>学期</td><td>课程号</td><td>课程名称</td><td>学时</td><td>学分</td><td>修习类别</td><td>考试性质</td><td>考试状态</td><td>成绩</td></tr>';
							a += '</table></div>';
							$("#outtable").after(a);

						html.find("tr").not(":first").each(function(){
							var category = $(this).find("td:eq(5)").text();	
							if ( category == "专业必修" || category == "专业选修" || category == "基础必修" ){
								var course = $(this).find("td:eq(1)").text();
								var grade = $(this).find("td:eq(8)").text();
								if ( isNaN(grade) ){
									switch(grade)
									{
										case "优秀":
										grade = 90;
										break;

										case "良好":
										grade = 80;
										break;

										case "中等":
										grade = 70;
										break;

										case "合格" : case "及格":
										grade = 60;
										break;

										default:
										grade = 50;
										
									}

								}else{
									grade = parseInt(grade);
								}
								if ( !data.hasOwnProperty(course) ){
									arr = $(this);
									data[course] = grade;
								}else{
									if ( data[course]<=grade ){
										data[course] = grade;
										arr.remove();
										arr = $(this);
									}else{
										$(this).remove();
									}
								}
								$(".main").append(arr);
							}
						})	
				}
			})
		}
		
	})
})