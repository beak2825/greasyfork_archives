// ==UserScript==
// @name         工商课程在线助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       Idwins
// @match        *://cqlg.360xkw.com/*
// @grant        none
// @license      for shengda education.
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js

// @downloadURL https://update.greasyfork.org/scripts/438298/%E5%B7%A5%E5%95%86%E8%AF%BE%E7%A8%8B%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438298/%E5%B7%A5%E5%95%86%E8%AF%BE%E7%A8%8B%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var context = `<button class="layui-btn layui-btn-warm" style="top:10px;position:fixed;left: 10px;"  id="btn"><i class="layui-icon layui-icon-down layui-icon-face-smile-b"></i>助手工作台<span class="layui-badge layui-bg-gray">0</span></button>
<form class="layui-form" action="" id="contDom"   style="display: none;">
<div class="layui-form-item" id="divLogin"  style="display: none;" >
<hr class="layui-border-green">
    <div class="layui-inline">
      <label class="layui-form-label">学员账号</label>
      <div class="layui-input-inline">
        <input type="tel" id="userNo" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-inline">
      <label class="layui-form-label">学员密码</label>
      <div class="layui-input-inline">
        <input type="text" id="userPwd"  lay-verify="email" autocomplete="off" class="layui-input">
      </div>
    </div>
    <button type="button" class="layui-btn layui-btn-sm layui-btn-radius" id="btn_login">登录</button>
  </div>
<hr class="layui-border-green">
<div id="workspeach">
<div style="padding:5px;text-align:center">
   <button type="button" class="layui-btn layui-btn-sm layui-btn-radius"  id="btn_listen">自动听课<span class="layui-badge layui-bg-orange isVideoOver" >听过啦</span></button>
   <button type="button" class="layui-btn layui-btn-sm layui-btn-radius"  id="btn_answer">知识点测评<span class="layui-badge layui-bg-orange isHwOver">做过啦</span></button>
    <button type="button" class="layui-btn layui-btn-sm layui-btn-radius"  id="btn_simulate">模拟练习<span class="layui-badge layui-bg-orange isSimuOver" >听过啦</span></button>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">学员姓名</label>
   <div class="layui-form-mid layui-word-aux"  id="fullName"></div>
    <label class="layui-form-label">学员专业</label>
    <div class="layui-form-mid layui-word-aux" id="majorName"></div>
     <label class="layui-form-label">注册时间</label>
    <div class="layui-form-mid layui-word-aux" id="registTime"></div>
</div>
<div class="layui-form-item">
     <label class="layui-form-label" style="font-size:12px">上次登录时间</label>
    <div class="layui-form-mid layui-word-aux" id="lastLoginTime"></div>
         <label class="layui-form-label">本次完成</label>
    <div class="layui-form-mid layui-word-aux" id="secessCo"></div>
         <label class="layui-form-label">本次时长</label>
    <div class="layui-form-mid layui-word-aux" id="timeSum"></div>
  </div>
  <div class="layui-form-item">
     <label class="layui-form-label" style="font-size:12px">总课程时长</label>
    <div class="layui-form-mid layui-word-aux" id="SumVideoDate"></div>
         <label class="layui-form-label">已听课时长</label>
    <div class="layui-form-mid layui-word-aux" id="NowVideoDate"></div>
         <label class="layui-form-label">尚需时间</label>
    <div class="layui-form-mid layui-word-aux" id="planDate"></div>
  </div>
  <div class="layui-form-item">
           <label class="layui-form-label">课程总数</label>
    <div class="layui-form-mid layui-word-aux" id="AllCount"></div>
     <label class="layui-form-label" style="font-size:12px">总完成数量</label>
    <div class="layui-form-mid layui-word-aux" id="total"></div>
    <label class="layui-form-label" style="font-size:12px">当前视频位置</label>
    <div class="layui-form-mid layui-word-aux" id="nowLessionIndex">0</div>
  </div>
  <div class="layui-form-item">
    <div class="layui-progress layui-progress-big" lay-showpercent="true" lay-filter="divPercent">
         <div class="layui-progress-bar" lay-percent="0%"></div>
    </div>
  </div>
  <textarea id="txtLog" placeholder="系统记录..." class="layui-textarea" style="height:190px;resize: none;"></textarea>
</div>
  </form>`;
var $ = $ || window.$;
$(context).appendTo($("body"));
var userEntity = {
	secessCo: 0,
	count: 1
};
// 取值时：把获取到的Json字符串转换回对象
var sessionEntity = JSON.parse(sessionStorage.getItem('user'));
if (sessionEntity != undefined) {
	userEntity = sessionEntity;
}
//间隔时间
var intervalTime = 10000;
//循环次数
var count = userEntity.count;
var nowCo = 1;
var tempCo = 0;
var secessCo = userEntity.secessCo;
var timeSum = "";
//状态
var state = "启动成功，欢迎使用，";
var durationSum = 0;
var watchTimeSum = 0;
var total = 0;
var parcentage = "0%";
var nowLessionList= [];
var nowLessionIndex=0;
var userNo = $.cookie('userNo');
state +="【"+userNo+"】信息获取成功...";
setLog(state);
layui.use(['form', 'layedit', 'element', 'jquery'], function() {
	var form = layui.form,
		layer = layui.layer,
		element = layui.element,
		$ = layui.jquery;
	$(document).on('click', '#btn', function() {
		layer.open({
			title: '在线听课助手',
			type: 1,
			btn: ['关闭'],
			area: ['720px', '600px'],
			content: $("#contDom")
		});
		element.progress('divPercent', parcentage);
	});
	//判断当前页面进行不同操作
	var url = window.location.pathname;
	var pageName = url.substring(url.lastIndexOf("/") + 1);
	if (pageName == "index.html") {
		$("#divLogin").show();
		$("#workspeach").hide();
		//登录页
		//加载用户名密码
		$("#userNo").val($.cookie('userNo'));
		$("#userPwd").val($.cookie('userPwd'));
		//登陆
		$("#btn_login").click(function() {
			$("span:contains('密码登录')").eq(0).click();
			$("input[name='account']").eq(1).val($("#userNo").val());
			$("input[name='pwd']").val($("#userPwd").val());
			//存储用户名密码
			$.cookie('userNo', $("#userNo").val(), {
				expires: 14,
				path: "/"
			});
			$.cookie('userPwd', $("#userPwd").val(), {
				expires: 14,
				path: "/"
			});
			$("#Bbut").click();
		});
	} else {
		//基本信息获取
		var user = layui.data("userInfo");
		if (user.data != undefined) {
			$("#fullName").html(user.data.fullName);
			$("#majorName").html(user.data.majorName);
			$("#registTime").html(user.data.registTime);
			$("#lastLoginTime").html(user.data.lastLoginTime);
		}
		//判断作业情况
		if ($.cookie(userNo + 'isHwOver') != "cope") $(".isHwOver").hide();
		//判断听课情况
		if ($.cookie(userNo + 'isVideoOver') != "cope") $(".isVideoOver").hide();
		//判断测试情况
		if ($.cookie(userNo + 'isSimuOver') != "cope") $(".isSimuOver").hide();
		//去听课
		$(document).on('click', '#btn_listen', function() {
			window.location.href = "learning.html";
		});
		//去做题
		$(document).on('click', '#btn_answer', function() {
			window.location.href = "knowledgePointsTest.html";
		});
        //去模拟练习
		$(document).on('click', '#btn_simulate', function() {
			window.location.href = "simulatedPaper.html";
		});

		if (pageName == "home.html") {
			$("#btn").click();
		} else if (pageName == "learning.html") {
			//课程观看页

            layer.open({
                title: '听课助手提示[5s自动关闭]',
                icon: '1',
                content: "即将自动听课，无需任何操作，完成后自动回到主页，点击左上角“助手工作台”可查看听课详情。",
                time: 5000,
                end: function() {
                    //获取课程更新汇总数据
                    doLearn();
                    setInterval(doWork, intervalTime);
                }
            });
             $("#videoRecord_kmBox .kmList li").click(function () {
                 //获取课程更新汇总数据
                 doLearn();
             });
		} else if (pageName == "simulatedPaper.html") {
            //模拟练习
            //等页面加载后再执行
			setTimeout(() => { execDoSimulate(); }, 2000)
		} else if (pageName == "knowledgePointsTest.html") {
			//知识点测评
			layer.open({
				title: '听课助手提示[5s自动关闭]',
				icon: '1',
				content: "即将自动答题，无需任何操作，完成后自动回到主页。",
				time: 5000,
				end: function() {
					execDoWork();
				}
			});
		} else if (pageName == "questionBank.html") {
			//作业详情
			//等页面加载后再执行
			layer.open({
				title: '听课助手提示[3s自动关闭]',
				icon: '1',
				content: "自动答题中...",
				time: 3000,
				end: function() {
					doHomeWork();
				}
			});
		}
	}

});


//定义主要执行方法
function doWork() {
	//当前播放状态
	var paused = $('video')[0].paused;
	var nowdate = formatSeconds(count * (intervalTime / 1000));
	//当前课时长度
	var nowPlay =getNowPlay();
    var npDate= nowPlay.children().eq(0).text();
	if ((nowCo * 10 - 30) > time_to_sec("00:" + npDate)) {
		//当前时间减去30s,后还在继续可能存在视频卡了，直接刷新当前页面
		window.location.href = window.location.href;
	}
    setLog(nowPlay[0].innerText);
    //视频暂停了
    if (paused) {
        //在总体目录中的下标
        $.each(nowLessionList,function(idx){
            if(nowLessionList[idx].id ==nowPlay.data("id")){
                nowLessionIndex = idx;
            }
        });
        $("#nowLessionIndex").html(nowLessionIndex+1);
        //非听过的才累加
        if (tempCo > 2) {
            //成功次数+1
            secessCo++;
            nowCo = 1;
            //成功更新统计
            watchTimeSum += time_to_sec("00:" + npDate);
            $("#planDate").html(formatSeconds(durationSum - watchTimeSum));
            parcentage = (watchTimeSum / durationSum * 100).toFixed(2) + "%";
            layui.element.progress('demo', parcentage);
            $("#NowVideoDate").html(formatSeconds(watchTimeSum));
            $("#total").html(total++);
        }
        tempCo = 0;
        //本课程结束
        if(nowLessionList.length -1 ==nowLessionIndex){
            //进入下一课程
            var nextli = $("li.kmBox.active").next();
            if (nextli.is("li")) {
                setLog("本课程完成，即将进入下一科目...");
                nextli.click();
                //更新课程数量
                doLearn();
            } else {
                //回到主页
                layer.open({
                    title: '听课助手提示[5s自动关闭]',
                    icon: '1',
                    content: "当前已经没有课程可以听了，即将自动回到主页...",
                    time: 5000,
                    end: function() {
                        $.userNo + (userNo + 'isVideoOver', "cope", {
                            expires: 14,
                            path: "/"
                        });
                        window.location.href = "home.html";
                    }
                });
            }
        }else{
            //下一个播放
            var nextId= doNextVideo(nowLessionIndex+1,nowLessionList);
            console.log(nowLessionIndex+1+"   "+nextId);
            $('a.isVideo[data-id="' +nextId + '"]').eq(0).click();
            return false;
        }
	}

    //定位当前播放位置
    var now = getNowPlay();
    if (now.length > 0){
        now[0].scrollIntoView();
    }
	//更新状态数据
	$("#secessCo").html(secessCo);
	$(".layui-bg-gray").text(secessCo);
	$("#timeSum").html(nowdate);

	//存储次数
	userEntity.secessCo = secessCo;
	userEntity.count = count;
	sessionStorage.setItem('user', JSON.stringify(userEntity));
	nowCo++;
	count++;
	tempCo++;
}
//获取下一个课程
function doNextVideo(nowindex,nowLessionList){
    var nextVideo= nowLessionList[nowindex],nextId="";
    if (nextVideo.percent< 100) {
        nextId = nextVideo.id;
        return nextId;
    }else {
     return doNextVideo(nowindex+1,nowLessionList);
    }
}

//获取当前播放
function getNowPlay (){
    var nowPlay = $('#recordVideoBox p[class="isVideo onLive"]');
    if(nowPlay.length==0)
    {
        nowPlay = $('#recordVideoBox a[class="isVideo onLive"]');
    }
    return nowPlay;
}

//秒转时间
function formatSeconds(value) {
	let result = parseInt(value)
	let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
	let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
	let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

	let res = '';
	if (h !== '00') res += `${h}h `;
	if (m !== '00') res += `${m}min `;
	res += `${s}s`;
	return res;
}
/**
 * 时间转为秒
 * @param time 时间(00:00:00)
 * @returns {string} 时间戳（单位：秒）
 */
var time_to_sec = function(time) {
	var s = '';
	var hour = time.split(':')[0];
	var min = time.split(':')[1];
	var sec = time.split(':')[2];
	s = Number(hour * 3600) + Number(min * 60) + Number(sec);
	return s;
};
//模拟练习
function execDoSimulate() {
	//试卷列表
	var points = $("div.yearsTuthTitle");
	if (points.length > 0) {
 	for (var p = 0; p < points.length; p++) {
    	var txt =userNo+ points[p].children[0].innerHTML;
        var nowtxt =$.cookie(userNo+"Simu");
        if(nowtxt==undefined || nowtxt.indexOf(txt) == -1){
            layer.open({
                title: '听课助手提示[2s自动关闭]',
                icon: '1',
                content: "即将自动进入"+txt+"模拟练习页面...",
                time: 2000,
                end: function() {
                    $.cookie(userNo+"Simu",nowtxt+","+txt);
                    $(points[p]).next().find("a")[0].click();
                }
            });
            //停止循环
            return false;
        }
  		}
		//当前无作业，判断下一科目
		//进入下一课程
		var nextli = $("li.kmBox.active").next();
		if (nextli.is("li")) {
			nextli.click();
			//等页面加载后再执行
			setTimeout(() => { execDoSimulate(); }, 2000)
		} else {
			layer.open({
				title: '听课助手提示[5s自动关闭]',
				content: "当前已经没有模拟练习可以做了，即将自动回到主页...",
				time: 5000,
				end: function() {
                    $.cookie(userNo + 'isSimuOver', "cope", {expires:14,path:"/"});
					window.location.href = "home.html";
				}
			});
		}
	}
}

//知识点测评
function execDoWork() {

	var points = $("div.testName");
	if (points.length > 0) {
		for (var p = 0; p < points.length; p++) {
			var txt = points[p].children[1].innerHTML;
			var words = txt.split('/')
			if (words[0] == 0) {
				var vals = $(points[p]).parent().next().find("a").attr("onclick").replace("startTopic(", "").replace(
					")", "").split(",");
				layer.open({
					title: '听课助手提示[5s自动关闭]',
					icon: '1',
					content: "即将自动进入考试页面...",
					time: 5000,
					end: function() {
						window.location.href = 'questionBank.html?paperId=' + vals[0] + '&type=KT&id=' +
							vals[1] + '&subCourseId=' + vals[2] + '&way=1';
					}
				});
			}
		}
		//当前无作业，判断下一科目
		//进入下一课程
		var nextli = $("li.kmBox.active").next();
		if (nextli.is("li")) {
			nextli.click();
			//等页面加载后再执行
			setTimeout(() => {
				execDoWork()
			}, 2000)
		} else {
			layer.open({
				title: '听课助手提示[5s自动关闭]',
				icon: '1',
				content: "当前已经没有作业可以做了，即将自动回到主页...",
				time: 5000,
				end: function() {
					$.cookie(userNo + 'isHwOver', "cope", {
						expires: 14,
						path: "/"
					});
					window.location.href = "home.html";
				}
			});
		}
	}
}

function doHomeWork() {
    var  type = getQueryString("type");
	//显示多选
     $(".multiple_list").css("display", "block");
    //显示答案
	$("div.Parsing").show();
	//获取作业列表
	var contents = $("div.tm.bg_white");
	if (contents.length > 0) {
		for (var x = 0; x < contents.length; x++) {
			var tempdiv = contents[x];
			var choice = $(tempdiv).find("div.parsingInfo").eq(0)[0].innerText;
			//选中
            $(tempdiv).find("ul li").each(function() {
                var nowtxt = $(this).text().substring(0,1);
                if (choice.indexOf(nowtxt) >-1) {
                    $(this).click();
                }
            })
        }
		//返回上一级页面
		layer.open({
			title: '听课助手提示[2s自动关闭]',
			icon: '1',
            content: "助手将自动提交答案，之后回到试卷列表页面...",
            time: 2000,
            end: function() {
                //提交答案
                if (type == "MN")
                {
                    $("#submitPaper").click();
                }
                else
                {
                    $("#DXsubmitPaper").click();
                }
                layer.open({
                    title: '听课助手提示[2s自动关闭]',
                    content: "返回试卷列表页面...",
                    time: 2000,
                    end: function() {
                        window.location.href = $("#breadcrumbDX a").last().attr("href");
                    }
                });
            }
        });
	}
}

function setLog(txt) {
	var oldtxt = $("#txtLog").text();
	$("#txtLog").text(getFormatDate() + "：" + txt + "\n" + oldtxt);
}

function getFormatDate() {
	var nowDate = new Date();
	var year = nowDate.getFullYear();
	var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
	var date = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
	var hour = nowDate.getHours() < 10 ? "0" + nowDate.getHours() : nowDate.getHours();
	var minute = nowDate.getMinutes() < 10 ? "0" + nowDate.getMinutes() : nowDate.getMinutes();
	var second = nowDate.getSeconds() < 10 ? "0" + nowDate.getSeconds() : nowDate.getSeconds();
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function doLearn() {
    //展开所有目录
    $("div.layui-colla-content").addClass("layui-show");
    //显示所有进度
    $('#recordVideoBox span').show();
    //加载课程概况总时长
    var VideoDate = JSON.parse(localStorage.getItem('videoList'));
    var AllCount = 0,
        nowVideo;
    //循环课程
    nowLessionIndex = 0;
    total=0;
    durationSum =0;
    watchTimeSum=0;
    for (var i = 0; i < VideoDate.length; i++) {
        //循环小节
        var videos = VideoDate[i].videos,
            percent = 0,
            duration = 0,
            wathtime = 0;
        AllCount += videos.length;
        for (var j = 0; j < videos.length; j++) {
            nowLessionList.push(videos[j]);
            duration = time_to_sec("00:" + videos[j].duration.replace("：",":"));
            wathtime = videos[j].watchTime;
            percent = videos[j].percent;
            //已经听完了的
            if (percent==100){
                total++;
                wathtime =duration;
            }
            if (nowVideo == undefined && percent< 100) {
                nowVideo = videos[j];
            }
            durationSum += duration
            watchTimeSum += wathtime
        }
    }
    $("#SumVideoDate").html(formatSeconds(durationSum));
    $("#NowVideoDate").html(formatSeconds(watchTimeSum));
    $("#planDate").html(formatSeconds(durationSum - watchTimeSum));
    parcentage = (watchTimeSum / durationSum * 100).toFixed(2) + "%";
    $("#total").html(total);
    $("#AllCount").html(AllCount);
    //自动开始
    if(nowVideo != undefined)
    {
        //$('a.isVideo[data-id="' + nowVideo.id + '"]').eq(0).click();
        //定位当前播放位置
        var now = getNowPlay();
        if (now.length > 0)
            now[0].scrollIntoView();
         nowLessionIndex =$.inArray(nowVideo,nowLessionList);
        $("#nowLessionIndex").html(nowLessionIndex+1);
        //playVideo(videoUrl, itemId, seekTime_record, $('video')[0].paused, true, videosData)
    }else{
        //当前没有课了
        layer.open({
            title: '听课助手提示[5s自动关闭]',
            icon: '1',
            content: "当前已经没有课程可以听了...",
            time: 5000
        });
    }
}
