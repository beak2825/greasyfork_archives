// ==UserScript==
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @name         公需科目学习
// @namespace    https://gitee.com/tangpc/gongxukemu
// @version      0.2.8
// @description  成电求实网站的公需科目学习
// @author       tpc
// @match        https://pcc.uestcedu.com/student/index.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434574/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/434574/%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var course_year = "2024";
(function() {
    'use strict';

	var answer2020 = {

	}



	//https://pcc.uestcedu.com/student/apply/uc/uc_user_course_exercise_list.jsp?82971=&user_id=48081&course_id=147&returl=uc_user_course_list.jsp
    var $button1 = $("<button style=\"position: absolute;right: 42%;top: 50px;color: #ecdf24;background: #241717;display: block;z-index: 999;\">一键学习</button>")
	var $button2 = $("<button style=\"position: absolute;right: 35%;top: 50px;color: #ecdf24;background: #241717;display: block;z-index: 999;\">一键答题</button>")
    var $select1 = $("<select style=\"position: absolute;right: 48%;top: 50px;color: #ecdf24;background: #241717;display: block;z-index: 999;\">"+
                     "<option value=\"2024\">2024</option>"+
                     "<option value=\"2023\">2023</option>"+
                     "<option value=\"2022\">2022</option>"+
                     "<option value=\"2021\">2021</option>"+
                     "<option value=\"2020\">2020</option>"+
                     "<option value=\"2019\">2019</option>"+
                     "一键答题</select>")
    $("body").append($button1)
	$("body").append($button2)
    $("body").append($select1)
    $select1.change(function(){

        console.log("已选择"+$(this).val())
        course_year=$(this).val();

    })
    //定义任务数组,用于学习完毕关闭任务
    var taskList = new Array()
	//一键学习
    $button1.click(function(){

        $.get("https://pcc.uestcedu.com/student/apply/uc/uc_user_course_list.jsp?course_year="+course_year,function(data){
            //获取课程列表html
            //console.log($(data))
            var $html = $(data)
			//遍历每个课程学习
            $.each($html.find(".div_pay"),function(i,a){
                var index = i;

                //获取开始学习按钮
                var $a = $(a).find("a:contains('开始学习')");
                //console.log("第"+i+"门课");

                //console.log($a.eq(1).attr("href"))
                var url = $a.attr('href')
                if(url == undefined){
                    console.log("未支付")
					//0作为占位,防止停止任务时找不到序号
					taskList.push(0)
                    return;
                }
				//如果已经学习到100%则直接退出,某个课程出现问题,需要重新学习的情况
				var $progressBar = $(a).prevAll(".layui-progress").find(".layui-progress-bar")
				var percent = $progressBar.attr("lay-percent")
				console.log("percent:"+percent)
				if("100%" == percent){
					console.log("第"+i+"门课已学习完毕")
					//0作为占位,防止停止任务时找不到序号
					taskList.push(0)
                    return;
				}
                //获取课程参数
                var param = getUrlkey(url)
                delete param.lesson_id
                param.client_type = 99
                console.log("获取到的学习参数为:")
				//client_type: 99,course_id: "147",course_uuid:"cf687f3f-eb08-45ae-ac88-ab7bcdab3286"
                console.log(param)
                var studyUrl = "https://pcc.uestcedu.com/rest/course/detail";
                console.log("开始学习第"+i+"门课")
                var newTask = setInterval(task,10000,index,studyUrl,param)

                taskList.push(newTask)
                console.log(taskList)

            })

        })

    })

	//一键答题
	$button2.click(function(){
		$.get("https://pcc.uestcedu.com/student/apply/uc/uc_user_course_list.jsp?course_year="+course_year,function(data){
			var $html = $(data)
			//遍历每个课程答题
            $.each($html.find(".div_pay"),function(i,a){
				var index = i;
                //获取练习按钮
                var $a = $(a).find("a:contains('练习')");
				if($a.length == 0){
					console.log("第"+i+"题未学习完毕")
					return;
				}
				var func=$a.attr('href')
				//console.log(func)
				var params = getParam(func)
				var url = "https://pcc.uestcedu.com/student/apply/uc/uc_user_course_exercise_list.jsp?user_id="+params.user_id+"&course_id="+params.course_id+"&returl=uc_user_course_list.jsp"
				//获取course_id
				var $a1 = $(a).find("a:contains('开始学习')");
				var param = getUrlkey($a1.attr("href"))
				var course_id = param.course_id
				//获取练习列表页面
				$.get(url,function (html) {
					var $doc=$(html)
					$.each($doc.find("table a:contains('做练习')"),function(i,a){
						//保存本次练习的答案数据
						var answerObject={}
						var href = $(a).attr('href')
						var exerciseid = $(a).parent("td").prev("td").attr("exerciseid")
						console.log(href)
						var url1 = "https://pcc.uestcedu.com"+href
						//获取练习详情页面,/rest/course/exercise/info/87

						$.get(url1,function(html1){
							var $doc1=$(html1)
							//有多少道题
							var tNum=eval($doc1.find("#div_item div:contains('题目数量')").text().split("：")[1])
							//最高得分为0才做题,表示这个题没有做的
							var highScore = eval($doc1.find("#div_item div:contains('最高得分')").text().split("：")[1])
							//练习项目
							var progress = $doc1.find("#div_item h5:eq(0)").text()
							if(highScore < 60 || href.endsWith('68')){

								//循环题目数量次寻找答案,/rest/course/exercise/item_with_answer/87/2
								var finishNum = 0;
								//获取答案组装为object
								for(var i=1;i<=tNum;i++){
									(function(num,tNum){
										//从网页获取答案,然后答题,https://pcc.uestcedu.com/rest/course/exercise/item_with_answer/87/2
										$.get("https://pcc.uestcedu.com/rest/course/exercise/item_with_answer/"+exerciseid+"/"+num,function(answer){
											var $doc3 = $(answer)
											//获取标题
											var ti
											//如果标题中有图片,则用图片的地址作为标题关键字
											if($doc3.find(".item_title").has("img").length ==1){
												ti = $doc3.find(".item_title img").attr('src')
											}else{
												ti=$doc3.find(".item_title").text().trim()
											}
											//获取答案
											var str = $doc3.find("#div_item div:contains('答案：')").text()
											var as = str.replaceAll('答案：','')
											var result;
											if(as.length != 1){
												result = new Array()
												var asArr = as.split('')
												for(let j in asArr){
													//获取答案内容，因为有的答案内容有大写英文所以只能替换第一个A到D加、号
													let asContent = $doc3.find(".opt:contains("+asArr[j]+"、)")
													let str=''
													//如果答案是图片,则获取图片的网络地址
													if(asContent.has('img').length == 1){
														str = asContent.find('img').attr('src')
													}else{
														str = asContent.text().trim().replace(/[A-D]、/,'')
													}
													result.push(str)
												}
											}else{

												//获取答案内容，因为有的答案内容有大写英文所以只能替换第一个A到D加、号
												let asContent = $doc3.find(".opt:contains("+as+"、)")
												let str=''
												//如果答案是图片,则获取图片的网络地址
												if(asContent.has('img').length == 1){
													str = asContent.find('img').attr('src')
												}else{
													str = asContent.text().trim().replace(/[A-D]、/,'')
												}
												result = str
											}
											console.log("ti:"+ti+",result:"+result)
											if(ti && result && ti.length !=0 && result.length != 0){
												answerObject[ti] = result;

												finishNum++;
												console.log("判断内部:"+progress+"finishNum:"+finishNum+",tNum:"+tNum)
											}else{
												result="未获取到答案"
												answerObject[ti] = result;
												finishNum++;
												console.log("判断没有:"+progress+"finishNum:"+finishNum+",tNum:"+tNum)
											}
											console.log("判断外面:"+progress+"finishNum:"+finishNum+",tNum:"+tNum)
											//等待答案拼装完成
											if(finishNum == tNum){
												console.log("获取到的答案为:")
												console.log(answerObject)
												//答题之前先确认进入答题,/rest/course/exercise/enter/87?course_id=147
												$.get("https://pcc.uestcedu.com/rest/course/exercise/enter/"+exerciseid+"?course_id="+course_id)
												//循环题目数量次答题,/rest/course/exercise/item/87/1
												finishNum = 0;
												//开始答题
												for(let j=1;j<=tNum;j++){

													setTimeout(function(num){

														return function(){

															var url2 = "https://pcc.uestcedu.com/rest/course/exercise/item/"+exerciseid+"/"+num

															$.get(url2,function(html2){
																var $doc2=$(html2)
																var title
																//如果标题中有图片,则用图片的地址作为标题关键字
																if($doc2.find(".item_title").has("img").length ==1){
																	title = $doc2.find(".item_title img").attr('src')
																}else{
																	title = $doc2.find(".item_title").text().trim()
																}

																//去除特殊字符的正则表达式(全),也可以去选择自己想要去除的特殊符号进行改动
																//title=title.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、0-9\s\w\t]/g,'');
																///rest/course/exercise/item_select/412/3
																//console.log("题目:"+title)
																var item_id="",option_serial="";
																//手写答案
																for(var k in answerObject){
																	var result = answerObject[k]
																	if(title != "" && k != "" && title.indexOf(k) != -1){
																		if(Array.isArray(result)){
																			//console.log("答案"+result.length+"个:")
																			for(var i1=0;i1<result.length;i1++){
																				//console.log(i1+":"+result[i1])
																				if(i1 != 0){
																					option_serial+=","
																				}
																				let content
																				if(result[i1].endsWith(".jpg")){
																					content = $doc2.find(".opt label:has(img[src='"+result[i1]+"'])")
																				}else{
																					content = $doc2.find(".opt label:contains('"+result[i1]+"')")
																				}
																				option_serial+=content.prev("input").attr("option_serial")
																				item_id=content.prev("input").attr("item_id")
																			}

																		}else{
																			//console.log("答案一个:"+result)
																			let content
																			if(result.endsWith(".jpg")){
																				console.log("本题答案为图片")
																				content = $doc2.find(".opt label:has(img[src='"+result+"'])")
																			}else{
																				console.log("本题答案为文字")
																				content = $doc2.find(".opt label:contains('"+result+"')")
																			}
																			option_serial=content.prev("input").attr("option_serial")
																			if(option_serial == undefined){
																				option_serial=$doc2.find(".opt label:contains('"+result.substr(0,2)+"')").prev("input").attr("option_serial")
																			}
																			item_id=content.prev("input").attr("item_id")
																			if(item_id == undefined){
																				item_id=$doc2.find(".opt input:eq(0)").attr("item_id")
																			}
																			console.log("答案内容:"+result)
																			console.log("题目编号:"+item_id+",答案编号:"+option_serial)
																		}

																		if(!item_id || item_id== "" || !option_serial || option_serial == ""){
																			console.log("题目:"+title+"    未找到答案")
																			console.log(subUrl)
																			option_serial = 1
																		}
                                                                        //拼装提交答案url:/rest/course/exercise/item_select/419/2,3,4
																		var subUrl = "https://pcc.uestcedu.com/rest/course/exercise/item_select/"+item_id+"/"+option_serial

																		console.log("提交的答案为:"+subUrl)
																		//提交答案
																		$.get(subUrl)
																		//提交一次答案,完成次数加1
																		finishNum++;
																		//确认获取得分
																		///rest/course/exercise/finish/87
																		//如果题全做完了,则提交答案获取得分
																		if(finishNum == tNum){
																			var finishUrl = "https://pcc.uestcedu.com/rest/course/exercise/finish/"+exerciseid
																			$.get(finishUrl)
																		}
																	}
																}


															})
														}
													}(j),1000*j)


												}
											}
										})
									})(i,tNum)

								}



							}

						})
					})


				})


				//
				//$(".opt label:contains('送餐服务')").prev("input").attr("option_serial")item_id
			})

		})


	})

	//解析方法参数
	function getParam(str){
		var params = {};
		var p1= str.substring(str.indexOf('(')+1,str.indexOf(')'))
		var user_id = p1.split(',')[0]
		var course_id = p1.split(',')[1]
		params.user_id=user_id
		params.course_id=course_id
		return params;

	}
    //解析url参数
    function getUrlkey(url) {
            var params = {};
            var urls = url.split("?");
            var arr = urls[1].split("&");
            for (var i = 0, l = arr.length; i < l; i++) {
                var a = arr[i].split("=");
                params[a[0]] = a[1];
            }
            return params;
        }
    //重写setInterval方法
        var __sto = setInterval;
        window.setInterval = function(callback,timeout,params){
            var args = Array.prototype.slice.call(arguments,2);
            var _cb = function(){
                callback.apply(null,args);
            }
            return __sto(_cb,timeout);
        }
    //视频学习任务
    function task(index,url,data){
            console.log("taskData:")
            console.log(data)
            $.getJSON(url, data, function (json) {
                if(!json.success){
                    return;
                }
                var jsonData = json.data;
                var courseName = jsonData.courseName;
                var outTime = jsonData.userFocusTime;
                $("#course-name1").text(courseName);
                // $("#course-name2").text(courseName);
                var courseLessonList = jsonData.courseLessonList;
                console.log("获取课程'"+courseName+"'成功")
                console.log("课程内容为:")
                console.log(courseLessonList)
                var i = 0;
                var num = 0;
                for (i = 0; i < courseLessonList.length; i++) {

                    var item = courseLessonList[i];
                    var isChapter = item.isChapter;

                    var itemName = item.lessonName;
                    var playUrl = item.playUrl;
                    var sourceUrl = item.sourceUrl;
                    var timeLen = item.timeLen;
                    var lessonId = item.lessonId;
                    //var courseId = item.courseId;
                    var videoPosition = item.videoPosition;
                    var finishLen = item.finishLen;
                    var learningStatus = item.learningStatus;
					var step = timeLen-finishLen>10?10:(timeLen-finishLen)
                    //var url ="https://pcc.uestcedu.com/rest/user/course/lesson/onexit?course_id="+data.course_id+"&course_uuid="+data.course_uuid+"&client_type=99&lesson_id="+lessonId+"&finish_len="+step+"&video_position="+(finishLen+step)
                    var url ="https://pcc.uestcedu.com/rest/user/course/lesson/onexit"
                    var req_data = {
                        course_id:data.course_id,
                        course_uuid:data.course_uuid,
                        client_type:99,
                        lesson_id:lessonId,
                        finish_len:step,
                        video_position:(finishLen+step)

                    }
                    //console.log(url)
                    if(timeLen != 0 && finishLen < timeLen){
                        num++;
                        //console.log("num:"+num)
                        $.post(url,req_data,function(data){
                            console.log(data)
                        })
                    }

                }
                //console.log("num:"+num+",index:"+index)
                if(num === 0){
                    console.log("'"+courseName+"'学习完毕")
					//console.log(taskList)
                    clearInterval(taskList[index])
                }
            })
        }

})();