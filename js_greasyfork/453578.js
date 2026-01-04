// ==UserScript==
// @name         中山教师继续教育刷课
// @name:zh-CN   中山教师继续教育刷课
// @name:zh-TW   中山教師繼續教育刷課
// @namespace    https://greasyfork.org/
// @version      0.08
// @description  中山教师研修网刷课
// @description:zh-CN  中山教师研修网刷课
// @description:zh-TW  中山教師研修網刷課
// @author       zsynzx
// @match        http*://m.zsjsjy.com/teacher/train/train/train/*
// @match        http*://m.zsjsjy.com/teacher/train/train/online/*
// @icon         http://m.zsjsjy.com/favicon.ico
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/453578/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/453578/%E4%B8%AD%E5%B1%B1%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

if (window.location.href.includes('m.zsjsjy.com/teacher/train/train/train/listForMine.do')) {

 setTimeout(function () {

	//如果还没选课则进入选课页面
	let bStr=Array.from(document.querySelectorAll('a.normal-account-permission'))
    .find(el => el.innerText === '进入学习');
	if (typeof bStr==="undefined") {
		//打开选课页面
		window.location='http://m.zsjsjy.com/teacher/train/train/online/listForTeacherRegist.do?paramMap[trainMode]=';
	   }

	//如果视频未完成继续学习
	let aStr=Array.from(document.querySelectorAll('a.normal-account-permission'))
    .find(el => el.innerText === '视频未完成');
	if (typeof aStr!=="undefined") {
		let fnStr=$(aStr).context.dataset.function;
		let fnArr=fnStr.split("'");
		window.location='http://m.zsjsjy.com/teacher/train/train/online/study.do?registerId='+fnArr[1]+'&part='+fnArr[7];
	   }

  }, 1000);

  let interval = setInterval(function () {
    //如果有未评价则继续评价
    let aStr=Array.from(document.querySelectorAll('a.normal-account-permission'))
    .find(el => el.innerText === '进入评价');
	if (typeof aStr!=="undefined")
	   {aStr.click();
		$('.star','.star-box').click();
		document.getElementById("content").value="讲解得非常好，谢谢老师！";

					$("#evaluateUserResultForm").ajaxSubmit({
						type: 'post',
						success: function(json){
							json = $.myParseJSON(json);
							if(!$.isEmptyObject(json)){
								var responseMsg = json.responseMsg;
								var responseCode = json.responseCode;
								if("00"==responseCode) {//操作成功
									layer.msg("操作成功！1秒后关闭",{
										time: 1000
									}, function(){
										layer.closeAll();
										finishEvaluate();
									});
								} else {//操作失败
									layer.msg("信息提交失败。"+responseMsg);
								}
							}
						}
					});
	   }
    else
       {clearInterval(interval);}//停止执行setInterval循环
  }, 1000);

}


if (window.location.href.includes('m.zsjsjy.com/teacher/train/train/online/study.do')) {

  let interval = setInterval(function () {
	if($(".u-empty").length==0) {//当前课程的视频全部看完，进入课程列表页面
	    clearInterval(interval);//停止执行setInterval循环。
		window.location="http://m.zsjsjy.com/teacher/train/train/train/listForMine.do";//打开课程列表网页
    } else {
		let videoObj=document.querySelectorAll("video")[0];
		videoObj.play();
		videoObj.muted=true;//静音
		videoObj.playbackRate = 16.0;//加速
		let ID=videoObj.id;//视频ID
		let elevideo = document.getElementById(ID);
		let number = $('.g-mv-con .g-top').find("#number").val();//获取序号
		elevideo.addEventListener(
			 'ended',
			 () => {
			   if($(".u-empty").length==0) {
					layer.msg('当前课程的视频全部看完');
			   } else {
					var newNum = parseInt(number)+1;
					var tabNo = $('#m-chapter-ul').find("#tg"+newNum);
					if(tabNo.length == 0){//则不存在对应的id
						 layer.msg('不存在对应的id');
					}else{
						 var videoUrl = $('#tg'+newNum).find('#videoUrl').val();//获取视频路径
						 var courseId = $('#tg'+newNum).find('#courseId').val();//获取课程id
						 var chapterId = $('#tg'+newNum).find('#chapterId').val();//获取章节id
						 var name = $('#tg'+newNum).find('a[class="tit"]').text();//获取章节标题
						 var videoUrlType = $('#tg'+newNum).find('#videoUrlType').val();//视频连接的类型
						 changeVideoShow(name,videoUrl,newNum,courseId,chapterId,videoUrlType);//调用方法
				   }
			 }
//			 false
			 }
		);
	}
  }, 1000);

}


if (window.location.href.includes('m.zsjsjy.com/teacher/train/train/online/listForTeacherRegist.do')) {

	var Total=42;//上级要求必须修学的课程总分

//获取已报名的总学分数
function getScourseAll(tableId){
		var table = document.getElementById(tableId);
		var tbody = table.tBodies[1];
		var tr = tbody.rows;
		var j=0;
		for (var i=0; i<tr.length; i++ ) {
			if (tr[i].cells[7].innerText === '已报名') {
				j=j+parseInt(tr[i].cells[6].innerText);//课程学分;
			}
		}
		return j;
}

//继续选课：再选总学分：Scourse
function RegistAll(Scourse,trValue){
    if (Scourse>0){
		var zf=0;//已选课的总学分
		var xf=0;
        for (var i=0; i<trValue.length; i++ ) {
            if (trValue[i].cells[7].innerText === '') {
				xf=parseInt(trValue[i].cells[6].innerText);//课程学分
				zf=zf+xf;
				if (zf>Scourse) {
					zf=zf-xf;
					continue;//此课程学分不合适，跳到下一次循环
				} else {
                    myregist(i);//选课
				}
			}
            if (zf===Scourse){
				break;//选课完成，结束循环
			}
        }
	}
}

//对页面课程列表中选择第n个课程进行报名
function myregist(n) {
	var radio=$(":radio[name='id']")[n];
	radio.checked=true;
	var trainId = $(":radio[name='id']:checked").val();
	var classroomId = $("#classroomId_"+trainId).val();
	var data=$.ajaxSubmitValue('/manage/train/register/online/regist.do?register[trainId]='+trainId+'&register[classroomId]='+classroomId);
}

//对指定表格指定列进行排序
function sortTable(tableId,Idx){
            var table = document.getElementById(tableId);
            var tbody = table.tBodies[1];
            var tr = tbody.rows;
            var trValue = new Array();
			let j=0;
            for (var i=0; i<tr.length; i++ ) {
               if (tr[i].cells[7].innerText === '') {
					trValue[j] = tr[i];//将表格中各行的信息存储在新建的数组中
					j++;
				}
            }
            if (tbody.sortCol == Idx) {
               trValue.reverse(); //如果该列已经进行排序过了，则直接对其反序排列
            } else {
               //trValue.sort(compareTrs(Idx));  //进行排序
               trValue.sort(function(tr1, tr2){
                  var value1 = tr1.cells[Idx].innerHTML;
                  var value2 = tr2.cells[Idx].innerHTML;
                  return value2.localeCompare(value1);
               });
            }
            var fragment = document.createDocumentFragment();//新建一个代码片段，用于保存排序后的结果
            for (i=0; i<trValue.length; i++ ) {
               fragment.appendChild(trValue[i]);
            }
            tbody.appendChild(fragment); //将排序的结果替换掉之前的值
            tbody.sortCol = Idx;

			var sVal=getScourseAll(tableId);//已选学分
			RegistAll(Total-sVal,trValue);//选课：学分必须选够，不能多，也不能少！

}

setTimeout(function () {
	var url='/teacher/train/train/online/noskin/listForTeacherRegist.do?paramMap[isReplenish]=';
	var contentId='pageContent';
	var formId='pageForm';
	//url += "&pagination.limit=2147483647";
	url += "&pagination.limit=2147";
	loading.open();
	$("#"+contentId).load(url,$("#"+formId).serialize(),function() {
		loading.close();
		var laypage=document.querySelectorAll(".laypage_main");
		if (laypage.length===0) {
			//设置课程列表表格的ID
			document.querySelectorAll("table.z-crt")[0].id='mytable';
			//按表格的第7列(课程学分)升序排序
			sortTable('mytable',6);//第1次降序，再执行一次可升序
			window.location="http://m.zsjsjy.com/teacher/train/train/train/listForMine.do";//打开课程列表网页
		}
	});
}, 1000);

}
