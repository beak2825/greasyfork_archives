
// ==UserScript==
// @name        学生端
// @namespace   new
// @include     http://jwgl3.jmu.edu.cn/Student/ScoreCourse/ScoreAll.aspx
// @version     1
// @grant       none
// @require     http://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @description 教务系统学生端信息处理
// @copyright   Chen
// @downloadURL https://update.greasyfork.org/scripts/19370/%E5%AD%A6%E7%94%9F%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/19370/%E5%AD%A6%E7%94%9F%E7%AB%AF.meta.js
// ==/UserScript==

$(document).ready(function(){
	var html =' '
		html += '<div id="button">';
	     	html += '<input type="button" value="通识必修" >';
		html += '<input type="button" value="通识选修">';
	    	html += '<input type="button" value="基础必修">';
	    	html += '<input type="button" value="基础选修">';
		html += '<input type="button" value="专业必修">';
		html += '<input type="button" value="专业选修">';
		html += '<input type="button" value="实践教学">';
		html += '</div>';
	$("#right").before(html);



	var mainF = $("#ctl00_ContentPlaceHolder1_scoreList").find("tr").not(":first");
	mainF.on('mouseenter mouseleave',function(e){
		if(e.type == "mouseenter"){
      	 		$(this).css('backgroundColor','yellow');
      		}else{
      			$(this).css('backgroundColor','');
      		}

	})
	

    	$("#content").on('click','input',function(){	
		var v = $(this).val();
           		var total = new Array();
           		var data = {};
          
           		

		mainF.each(function(){
			var category = $(this).find("td:eq(5)").text();
			var grade = $(this).find("td:eq(8)").text();
			var course = $(this).find("td:eq(1)").text();
			var credit = $(this).find("td:eq(4)").text();

			$(this).show(); 


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

			if ( category == v ){
				
				//函数块判断该成绩是否满足条件
				function sumc(){
					if ( grade >= 60 ){
							total.push(parseFloat(credit));
						}
				}

				
				if ( !data.hasOwnProperty(course) ){
					$(this).show();
					data[course] = grade;
					sumc();

				}else{
					if ( data[course]<=grade ){
						data[course] = grade;
						$(this).prev().remove();
						$(this).show();
						sumc();

					}else{
						$(this).remove();
					}
						
				}
			}else{
				$(this).hide();
			}

		});
	var totalc=total.reduce(function(a,b){return a+b;});
	 $('tbody').append('<tr id="total"></tr>');
	 $("#total").html('');
	 $("#total").append("<td colspan='9'>"+v+"获得的总学分为</td><td>"+totalc.toFixed(2)+"</td>").show();
	 console.log(total.toFixed(2));
	});
});	