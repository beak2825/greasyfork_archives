// ==UserScript==
// @name         2929339419
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://assess.fifedu.com/*
// @run-at  document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404779/2929339419.user.js
// @updateURL https://update.greasyfork.org/scripts/404779/2929339419.meta.js
// ==/UserScript==
/**
 * 考试客户端js处理类
 * option partContent, maxPartNum, questionNumStart,mediaRootPath
 */
var examClient = {
	
	FOLLOWING_CONVERSATION_TXT : "<div style='padding-left: 0px;padding-right: 0px;	margin: 10px;font-size: 16px;font-weight:900;' > The following questions are based on the recording you have just heard.</div>",
	FOLLOWING_PASSAGES_TXT : "<div class='divFollowQuestion'> The following questions are based on the recording you have just heard.</div>",
	ANSWER_CHOICES_CHAR : [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ],
	PAGINGBTN_CTRL_NEXT_HTML  : '<a href="#" class="fl exam_right-nextbtn" onclick="examClient.nextQuestionEvent()">下一题</a>',
	examQustion : {questionDesc:"",answerChoice:""},
	//播放器对象
	playerCtrl : {},
	//用户答案处理对象
	answerCtrl : {}
};
	
	examClient.init = function(options) {
		this.options = options;

		// 答题区ID
		this.answerAreaId = "id_div_answerarea";
		// 试题内容展示区域ID
		this.questionTitleAreaId = "id_div_questionarea";
		// 按钮区域ID
		this.pagingBtnCtrlWrapperId = "id_div_qcb_wp";
		// directions ID
		this.directionsWrapperId = "id_p_directions";
		// part title ID
		this.partTitleWrapperId = "id_div_parttitle";
		//播视频放器控制ID
		this.divPlayerCtrId = "id_div_ctr_Player";
		//视频播放器ID
		this.myPlayerId = "id_div_myPlayer";
		//音频播放器ID
		this.flvPlayerId = "id_div_flvPlayer";
		//音频播放器
		this.myPlayer ;
		//视频播放器
		this.flvPlayer ;
		//UE配置文件  
		this.UEConfig = {toolbars: [[ 'simpleupload','kityformula','scrawl','photo','fullscreen']],autoHeightEnabled: false,autoFloatEnabled: true,serverUrl: top.baseURL ,enableContextMenu: false,initialStyle:'p{line-height:1em} img{max-width:88%}',enableAutoSave: false,autoHeightEnabled:false};
		this.partContent = this.options.partContent;
		this.mediaRootPath = this.options.mediaRootPath;
		// part先所有的音频文件路径和间隔时间，例{'20130905/33497831080606.mp3',
		// '5', '20130905/35473900070896.mp3', '3'}
		this.videoPlayArray = [];
		// 页面主体内容html
		this.bodyContent = [];
		// 当前结构序号
		this.partNum = this.options.partNum;
		// 整张试卷的最大结构序号
		this.maxPartNum = this.options.maxPartNum;
		// 当前part 试题开始题号
		this.curPartQuestionNumStart = this.options.questionNumStart;
		this.questionNumStart= 0;
		// 当前part 试题开始题号
		this.examPaperQuestionNumArr = this.options.examPaperQuestionNumArr;
		// 当前part 子大题数量
		this.curPartSubQuestionNum = this.options.partContent.subExamPaperContentList.length;
		//当前part的题号
		this.questionNum = 0;
		// 当前 part 答题位置
		this.curPartAnswerQuestionPos = 0;
		// 当前 part 总体量
		this.curPartQuestionCount = 0;
		// 当前 试题题目
		this.curQuestionTitle="";
		// 当前 试题选项
		this.curQuestionChoice="";
		// 试题题目 和 答题分栏显示
		this.isSplitShowQuestion = false;
		//当前播放第几个
		this.playNow = 0;
		this.speakerShow;
		//播放完毕标志
		this.complete = false;
		//是否正在播放标志
		this.isPlaying = false;
		//两个全局this对象
		this.clickObj = null;
		this._d = null;
		this.thmlontent=null;
		//复合题型总JSON串
		this.parentQuestionJson = [];
		//复合题型总JSON串
		this.childQuestionJson = [];
		//配对题标记
		this.answertype2_1_flag = false;
		//大阅读标记
		this.answerType0_isSplit_flag = false;
		//parent question answer type
		this.answerTyleFlag = "0";
		this.orderChangeStatus = "4";
		this.randomQuestion = this.options.randomQuestion;
		this.randomOption = this.options.randomOption;
		//记录各个子题的开始题号
		examClient.questionNumCount = new Array(this.curPartSubQuestionNum);
		this.initFlvFFlag = false;
		this.mediaLoadMap={};
		this.ueJson={};
		return this;
	};
	
	/**
	 * 获取part 音频
	 * @param partContent
	 * @return
	 */
	examClient.addPartDirectionsPlayAudio = function(partContent) {
		if (partContent.directionsResourcePath&&partContent.directionsResourcePath != "") {
			var playCount = (partContent.directionsResourcePlayCount==null)?0:partContent.directionsResourcePlayCount;
			for (var i = 0; i < playCount; i++) {
				this.videoPlayArray.push(partContent.directionsResourcePath.replace(".flv",".mp4").replace(".FLV",".mp4"));
				this.videoPlayArray.push(playCount);
			}
		}
	};
	/**
	 * 设置音频str
	 * @param question
	 * @param videoPlayBuffer
	 */
	examClient.addQuestionPlayAudioStr = function(question) {
		if(question.resourcePath){			
			for (var j = 0; j < question.questionType.videoRepeatTimes; j++) {
				this.videoPlayArray.push(question.resourcePath.replace(".flv",".mp4").replace(".FLV",".mp4"));
				if (j != question.questionType.videoRepeatTimes - 1) {
					// 重复间隔时间
					this.videoPlayArray.push(question.questionType.videoRepeatBreak);
				} else {
					// 与下一题间隔时间
					this.videoPlayArray.push(question.questionType.videoTimeLimit);
				}
			}
		}
	};
	/**
	 * 添加题号音频
	 * @param questionNum
	 */
	examClient.addQuestionNumPlayAudioStr = function(questionNum) {
//		解决北工大作文题加音频，并且题号 是101的问题
		if(questionNum<100){
			this.videoPlayArray.push("/numaudio/fiftest_"+questionNum+".mp3");
			this.videoPlayArray.push(1);
		}
	};
	// 根据试题、题型设计音频播放控制字符串
	examClient.setVideoPlayBufferWithQuestion = function(videoPlayBuffer, question,  questionType) {
		
	};
	/**
	 * 初始化音视频播放器
	 */
	var initJplayer = function(){
		if(!examClient.myPlayer){
			//音频组件初始化
			$("#"+examClient.myPlayerId).jPlayer({
				ready : function(event) {
					examClient.myPlayer = $(this);
//					alert(examClient.myPlayer);
				},
				swfPath : staticURL+"/libs/thirdparty/jplayer/js",
				supplied : "mp3",
				wmode : "window",
				error : function(event) {
					examClient.isPlaying = false;
				},
				ended : function(event) {
					//播放结束后播放下一个
					setTimeout("examClient.playme('playsw-1')", 0);
				},
				error : function(event){
					try {
						$.post(
							top.baseURL+"/examPaper/collectOralInfo",
							{"questionId":studentExamResultId,"info":"听力考试音视频播放异常："+examClient.playNow+"_error:"+JSON.stringify(event.jPlayer.error)+"_status:"+JSON.stringify(event.jPlayer.status)},
							function(data){}
						);
					} catch (e) {}
					
					if(undefined != event.jPlayer && undefined != event.jPlayer.error && undefined != event.jPlayer.error.type){
						if(event.jPlayer.error.type == "e_no_solution" || event.jPlayer.error.type == "e_flash" || event.jPlayer.error.type == "e_flash_disabled" || event.jPlayer.error.type == "e_version"){
							top.topAlert("提示","["+event.jPlayer.error.type + "]页面上插入Flash时出现问题，是否安装了FLASH，是否禁用了FLASH？","确定",function(){
								$("#"+examClient.flvPlayerId).html('<h1>Alternative content</h1><p>	<a href="https://www.adobe.com/go/getflashplayer"  alt="点击尝试启用FLASH" title="点击尝试启用FLASH">	<img src="'+staticURL+'/images/exam/get_flash_player.gif" alt="点击尝试启用flash" title="点击尝试启用flash"/></a></p>');
								top.location.href = "https://www.adobe.com/go/getflashplayer";
							});
						}else if(event.jPlayer.error.type == "e_url_not_set"){
							top.topAlert("提示",event.jPlayer.error.type + "由于未设置媒体，因此媒体无法播放。","确定",function(){});
						}else if(event.jPlayer.error.type == "e_no_support"){
							top.topAlert("提示",event.jPlayer.error.type + "无法播放的媒体格式，"+examClient.videoPlayArray[examClient.playNow]+"。","确定",function(){});
						}else{
							top.topAlert("提示","["+event.jPlayer.error.type + "]由于网络原因音频播放中断，点击确定重试。","确定",function(){
								try {
									examClient.mediaLoadMap={};
									examClient.myPlayer.bind($.jPlayer.event.progress, function (event) {
									   if (event.jPlayer.status.seekPercent >= 100) {
										   if(undefined==examClient.mediaLoadMap[examClient.playNow] || examClient.mediaLoadMap[examClient.playNow] != 100){
											   examClient.mediaLoadMap[examClient.playNow]=100;
											   examClient.myPlayer.jPlayer("play");
										   }
									    }
									});
									examClient.myPlayer.bind($.jPlayer.event.durationchange, function (event) {
										if (event.jPlayer.status.seekPercent >= 100) {
										   if(undefined==examClient.mediaLoadMap[examClient.playNow] || examClient.mediaLoadMap[examClient.playNow] != 100){
											   examClient.mediaLoadMap[examClient.playNow]=100;
											   examClient.myPlayer.jPlayer("play");
										   }
									    }
									});
									examClient.myPlayer.jPlayer("load");
								} catch (e) {}
							});
						}
					}
				}
			});
		}
		if(!examClient.flvPlayer && examClient.initFlvFFlag){
//			return;
			//视频组件初始化
			$("#"+examClient.flvPlayerId).jPlayer({
				ready : function(event) {
					examClient.flvPlayer = $(this);
				},
				swfPath : staticURL+"/libs/thirdparty/jplayer/js",
				supplied: "mp4,ogv,m4v",
				error : function(event) {
					examClient.isPlaying = false;
					try {
						$.post(
							top.baseURL+"/examPaper/collectOralInfo",
							{"questionId":studentExamResultId,"info":"听力考试音视频播放异常："+examClient.playNow+"_error:"+JSON.stringify(event.jPlayer.error)+"_status:"+JSON.stringify(event.jPlayer.status)},
							function(data){
							}
						);
					} catch (e) {}
					
					if(undefined != event.jPlayer && undefined != event.jPlayer.error && undefined != event.jPlayer.error.type){
						if(event.jPlayer.error.type == "e_no_solution" || event.jPlayer.error.type == "e_flash" || event.jPlayer.error.type == "e_flash_disabled" || event.jPlayer.error.type == "e_version"){
							top.topAlert("提示","["+event.jPlayer.error.type + "]页面上插入Flash时出现问题，是否安装了FLASH，是否禁用了FLASH？","确定",function(){
								$("#"+examClient.flvPlayerId).html('<h1>Alternative content</h1><p>	<a href="https://www.adobe.com/go/getflashplayer"  alt="点击尝试启用FLASH" title="点击尝试启用FLASH">	<img src="'+staticURL+'/images/exam/get_flash_player.gif" alt="点击尝试启用flash" title="点击尝试启用flash"/></a></p>');
								top.location.href = "https://www.adobe.com/go/getflashplayer";
							});
						}else if(event.jPlayer.error.type == "e_url_not_set"){
							top.topAlert("提示",event.jPlayer.error.type + "由于未设置媒体，因此媒体无法播放。","确定",function(){});
						}else if(event.jPlayer.error.type == "e_no_support"){
							top.topAlert("提示",event.jPlayer.error.type + "无法播放的媒体格式，"+examClient.videoPlayArray[examClient.playNow]+"。","确定",function(){});
						}else{
							top.topAlert("提示","["+event.jPlayer.error.type + "]由于网络原因音频播放中断，点击确定重试。","确定",function(){
								try {
									examClient.mediaLoadMap={};
									examClient.flvPlayer.bind($.jPlayer.event.progress, function (event) {
									   if (event.jPlayer.status.seekPercent >= 100) {
										   if(undefined==examClient.mediaLoadMap[examClient.playNow] || examClient.mediaLoadMap[examClient.playNow] != 100){
											   examClient.mediaLoadMap[examClient.playNow]=100;
											   examClient.flvPlayer.jPlayer("play");
										   }
									    }
									});
									examClient.flvPlayer.bind($.jPlayer.event.durationchange, function (event) {
										if (event.jPlayer.status.seekPercent >= 100) {
										   if(undefined==examClient.mediaLoadMap[examClient.playNow] || examClient.mediaLoadMap[examClient.playNow] != 100){
											   examClient.mediaLoadMap[examClient.playNow]=100;
											   examClient.flvPlayer.jPlayer("play");
										   }
									    }
									});
									examClient.flvPlayer.jPlayer("load");
								} catch (e) {}
							});
						}
					}
				},
				ended : function() {
					setTimeout("examClient.playme('playsw-1')", 0);
					/*var divPlayer = document.getElementById(examClient.divPlayerCtrId);
					divPlayer.style.position = "absolute";
					divPlayer.style.top = "2000px";*/
					//播放结束后播放下一个
				},
				useStateClassSkin: true,
				autoBlur: false,
				smoothPlayBar: true,
				keyEnabled: true,
				remainingDuration: true,
				toggleDuration: true,
				size: {
			        width: "640px", height: "480px",cssClass: "jp-video-360p"
			   }
			});
			$("#jp-play").hide();
		};
		
	};
	/**
	 * 验证是否已经播放过该Part
	 */
	examClient.checkPlay = function(){
//		try {
			if (this.isPlaying) {
			}
			if (!this.complete && !isNaN(this.videoPlayArray[this.playNow - 1])) {
				top.sysAlert("音频正在播放!");
				return;
			}
			//ajax后台验证是否已经播放过该音频
			$.ajaxSettings.async = false;
			$.post( baseURL + "/examPaper/checkVideoPlayStaus.json", {
				partNum : examClient.partNum,
				examBatchResultId : studentExamResultId
			}, function(data) {
				if(!(data.playStatus)){
					data.playStatus="-1";	
				}
		        //播放中状态
				var obj = $("#id_div_music_start");
		        obj.hide();
		        obj.siblings(".playing").show();
		        obj.siblings("p").show();
				if (data.playStatus == "1") { //正在播放
					examClient.playme('playsw-1');
					examClient.saveplayStatus(1);
					//刷新可以从新播放
				} else if (data.playStatus == "2") { //已经播放过
					//音频播放完毕按钮状态
					var obj = $("#id_div_music_start");
					obj.siblings(".playing").hide();
		            obj.siblings(".over").show();
		            obj.siblings("p").hide();
					top.sysAlert("音频播放结束，请不要点击小喇叭，如有疑问，请联系监考老师!");
					return false;
				} else {
					//该Part没有播放过
					examClient.playme('playsw-1');
					examClient.saveplayStatus(1);
				};
			});
			$.ajaxSettings.async = true;
//		} catch (e) {
//			top.sysAlert(e.showMessage);
//		};
	};
	
	/**
	 * 缓存音频
	 */
	
	examClient.mediaload =function (func){
		var status = -1;
		if(this.videoPlayArray.length > 0){
			try {
				var arr = new Array();
				for (var int = 0; int < this.videoPlayArray.length; int++) {
					var playParam = this.videoPlayArray[int];
					if (undefined != playParam && playParam.length > 0 && isNaN(playParam)) {
						var myplayfile = cndURL+'upload/media/' + playParam;
						arr.push(myplayfile)
					}
				}
				examClient.mediaLoadMap={};
				examClient.oneMediaLoad(arr,0);
				status = 0;
			} catch (e) {
				status = 1;
			}
		}
		return status;
	};
	
	examClient.oneMediaLoad =function (arr,idx,func){
		var myplayfile = "" ;
		if(arr.length>0 && arr.length>idx){
			myplayfile = arr[idx];
			idx++;
		}else{
			//console.log(idx+"_return_"+myplayfile);
			return;
		}
		//获取视频格式
		var movieType = myplayfile.substring(myplayfile.length - 3,	myplayfile.length);
		//视频播放
		if (movieType.toUpperCase() == "MP4") {
			examClient.flvPlayer.jPlayer("setMedia", {
				mp4 : myplayfile
			});
			examClient.flvPlayer.bind($.jPlayer.event.progress, function (event) {
			   if (event.jPlayer.status.seekPercent >= 100) {
				   if(undefined==examClient.mediaLoadMap[idx] || examClient.mediaLoadMap[idx] != 100){
					   examClient.mediaLoadMap[idx]=100;
					   //console.log(JSON.stringify(event.jPlayer.status));
					   setTimeout(function(){
						   examClient.oneMediaLoad(arr,idx);
					   },300);
				   }
			    } else {
			    	//console.log("加载中1："+event.jPlayer.status.seekPercent);
			    }
			});
			examClient.flvPlayer.bind($.jPlayer.event.durationchange, function (event) {
				if(undefined==examClient.mediaLoadMap[idx] || examClient.mediaLoadMap[idx] != 100){
					if (event.jPlayer.status.seekPercent >= 100) {
						examClient.mediaLoadMap[idx]=100;
						setTimeout(function(){
							   examClient.oneMediaLoad(arr,idx);
						},300);
						//console.log("durationchange "+idx);
					}
				}
			});
			examClient.flvPlayer.jPlayer("load");
		}else{
			examClient.myPlayer.jPlayer("setMedia", {
				mp3 : myplayfile
			});
			examClient.myPlayer.bind($.jPlayer.event.progress, function (event) {
			   if (event.jPlayer.status.seekPercent >= 100) {
				   if(undefined==examClient.mediaLoadMap[idx] || examClient.mediaLoadMap[idx] != 100){
					   examClient.mediaLoadMap[idx]=100;
					   //console.log(JSON.stringify(event.jPlayer.status));
					   setTimeout(function(){
						   examClient.oneMediaLoad(arr,idx);
					   },300);
				   }
			    } else {
			    	//console.log("加载中1："+event.jPlayer.status.seekPercent);
			    }
			});
			examClient.myPlayer.bind($.jPlayer.event.durationchange, function (event) {
				if(undefined==examClient.mediaLoadMap[idx] || examClient.mediaLoadMap[idx] != 100){
					if (event.jPlayer.status.seekPercent >= 100) {
						examClient.mediaLoadMap[idx]=100;
						setTimeout(function(){
							   examClient.oneMediaLoad(arr,idx);
						},300);
						//console.log("durationchange "+idx);
					}
				}
			});
			examClient.myPlayer.jPlayer("load");
		}
	}
	
	/**
	 * 保存本part的音频播放状态
	 */
	examClient.saveplayStatus = function(status) {
		try {
			if("1"==paperView){
				return false;
			}
			$.post(baseURL+"/examPaper/saveVideoPlayStaus.json", {
				status : status,
				partNum : examClient.partNum,
				examBatchResultId : studentExamResultId
			}, function(data) {
				return;
			});
		} catch (e) {
			top.sysAlert(e.showMessage);
		};
	};
	/**
	 * 播放逻辑控制
	 */
	examClient.playme = function(myid) {
		//初始化页面播放状态显示
		if (this.playNow > (this.videoPlayArray.length - 1)) {
			this.isPlaying = false;
//			changePlayDisplay(src_stoped, html_5);
			top.examleft.changeLock(false);//左页菜单锁定解除
			if(!((this.videoPlayArray.toString().indexOf(".flv")>0)||(this.videoPlayArray.toString().indexOf(".FLV")>0))){
				this.saveplayStatus(2); //播放结束，保存播放状态
			}
			this.complete = true;
			//音频播放完毕按钮状态
			var obj = $("#id_div_music_start");
			obj.siblings(".playing").hide();
            obj.siblings(".over").show();
            obj.siblings("p").hide();
			return;
		}
		//获取到播放文件路径
//		changePlayDisplay(src_playing, html_6);
		var myplayfile = "";
		var playParam = this.play();
		top.examleft.changeLock(true);
		//数字表示音频播放间隔
		if (!isNaN(playParam)) {
			this.playNow = this.playNow + 1;
//			changePlayDisplay(src_playing, html_3);
			setTimeout("examClient.playme('playsw-1')", parseInt(playParam) * 1000);
		} else {
			var myplayfile = cndURL+'upload/media/' + playParam;
			//获取视频格式
			var movieType = myplayfile.substring(myplayfile.length - 3,	myplayfile.length);
			//视频播放
			if (movieType.toLowerCase() == "flv"){
				myplayfile = myplayfile.replace(".flv",".mp4").replace(".FLV",".mp4");
				movieType = "mp4";
			}
			if ( movieType.toLowerCase() == "mp4") {
				var divPlayer = document.getElementById(this.divPlayerCtrId);
				divPlayer.style.display = "block";
				divPlayer.style.position = "relative";
				divPlayer.style.top = "0";
				$("#"+this.divPlayerCtrId).css("margin-left",(($("#id_div_parttitle").width()-640)/2));
				examClient.playMovie(myplayfile);

			} else {//音频播放
				this.playAudio(myplayfile);
				//top.leftInfo.changeLock(true); //左页菜单锁定
				//changePlayDisplay(src_playing, html_3);
			}
//			changePlayDisplay(src_playing, html_3);
			//播放下一题
			this.playNow = this.playNow + 1;
		}
	};
	/**
	 * 播放视频
	 */
	examClient.playMovie = function(flvFile) {
		$("#jp-play").show();
		if (flvFile != null) {
			examClient.flvPlayer.jPlayer("setMedia", {
				m4v : flvFile
			});
			examClient.flvPlayer.jPlayer("load");
		}
//		this.flvPlayer.jPlayer("fullScreen");
		this.flvPlayer.jPlayer("play");
		$("#jp-pause").hide();
		$("#jp-play").hide();
		$(".jp-full-screen").hide();
		this.isPlaying = true;
	};
	/**
	 * 播放音频
	 */
	examClient.playAudio = function(mp3file) {
		if (mp3file != null) {
			examClient.myPlayer.jPlayer("setMedia", {
				mp3 : mp3file
			});
			examClient.myPlayer.jPlayer("load");
		}
		examClient.myPlayer.jPlayer("play");
		this.isPlaying = true;
	};
	/**
	 * 获取播放控制参数：音频资源路径或则播放间隔时间
	 */
	examClient.play = function() {
		if (this.playNow < this.videoPlayArray.length) {
			return this.videoPlayArray[this.playNow];
		} else {
			return "";
		}
	};
	/**
	 * 是否显示question 标题
	 * @param questionType.
	 * @return
	 */
	examClient.isShowQuestionTitle = function(questionType) {
		var _flag = true;
		var  _l = questionType.questiontypeAttributeList;
		if(_l) {
			for (var i = 0; i < _l.length; i++) {
				var qa = _l[i];
				if("title"==qa.fieldName&&"0"==qa.isDisplay) {
					_flag = false;
					break;
				}
			}
		}
		return _flag;
	};
	/**
	 * 构建选词填空题 ， 候选词
	 * @return
	 */
	var letterArr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	examClient.buildBank = function(qa,questionId) {
		var groups = [];
		var aitems = [];
		var cols = [];
		var cols_idx = 0;
		var answer = qa.value;//.replace(/ /g, "");
		answer = examClient.delHtmlTag(answer);
//		var strs = answer.split(/([A-Z](\\s)*[.|)|）])+/);
//		console.log(answer);
		var strs = answer.replace(/([A-Za-z][\s]*[.|)|）])+/g,",,,").split(",,,");
		for(var k = 0 ; k < strs.length ; k++){
			if(strs[k]){
				var group = strs[k].match(/[A-Z][.{1}|){1}|）{1}]/);
				if(group){
					group = group.toString().replace(".","");
					group = group.toString().replace(")","");
					group = group.toString().replace("）","");
					groups.push(group);
				}else{
					aitems.push(strs[k]);
				};
			};
		}
		if("2"==this.orderChangeStatus||"1"==this.orderChangeStatus){
			aitems = randomz(aitems , studentId, realName);
		}
		var count = aitems.length;
//		console.log(count);
//		console.log(aitems.toString());
		var j = 1;
		var i = 1;
		for(var kk = 0 ; kk<count ;kk++){
			if(!aitems[kk] && $.trim(strs[k]).length==0 ){continue;}
			var group = letterArr[kk];
			var aitemValue = aitems[kk];
			aitemValue=aitemValue.replace(")", "");
			aitemValue = examClient.delHtmlTag(aitemValue);
			aitemValue=aitemValue.replace(/\"/g, "&#34;");
			if(cols[cols_idx]){
				cols[cols_idx] +=( "<a><p onclick=\"examClient.buildBankClick(this)\" id=\"buildBank_"+group+"\" attrbu=\""+aitemValue+"\" style=\"padding-left:5px;\" >"+group+")&nbsp;"+aitemValue+"</p></a>");
			}else{
				cols[cols_idx] =( "<a><p onclick=\"examClient.buildBankClick(this)\" id=\"buildBank_"+group+"\" attrbu=\""+aitemValue+"\" style=\"padding-left:5px;\" >"+group+")&nbsp;"+aitemValue+"</p></a>");
			}
			var count3 = parseInt(count/3);
		    if((count%3==0&&j-(count3)==0) || (count%3==1&& j-(count3+1-cols_idx%2)==0) || (count%3==2 && j-(count3+1)==0) ){
					    cols_idx++;
					    j = 0;
		    }
		    i++;
		    j++;
		};
		examClient.thmlontent[questionId] = "<table id='id_table_bank' ><tr valign='top'><td>"+cols[0]+"</td><td>"+cols[1]+"</td><td>"+cols[2]+"</td></tr></table>";
	};
	/**
	 * 选词填空点击选项
	 */
	examClient.buildBankClick = function(obj){
		var buildBankObj = $(obj);
		var buildBankValue = buildBankObj.attr("attrbu");
		if(buildBankObj&&buildBankValue){
			$(examClient.clickObj).val($.trim(buildBankValue));
//			clickObj.className = "input_changed";
			examClient.clickObj.className= examClient.clickObj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			examClient.clickObj = null;
		}
		examClient._d.close();
		examClient.finishedAnswer(examClient.clickObj);
		
	};
	
	examClient.initSplitQuestion = function() {

	};
	// 简单题型生成题目结构
	examClient.buildQuestion2html = function(parentQuestion,question,answerAreaHtml) {
		this.questionNum++;
		var questionType = question.questionType;
		var answerType = questionType.answerType;
		var qId = question.id;
		question.questionNum = this.questionNum;
		if(this.questionNum==1&&examClient.isShowQuestionTitle(question.questionType)){
			question.parentQuestion = parentQuestion;
		}
		if(!examClient.isShowQuestionTitle(question.questionType)){
			question.title="";
		}
		if(undefined != question.answerOption && !(question.answerOption instanceof Array)){
			question.answerOption = question.answerOption.replace(/break-all/g,"break-word");
		}
		// 1、隐藏域输出试题主键
		answerAreaHtml.push("<input type='hidden' id='questionId[" + qId + "]' answername='answer[" + qId
				+ "]' answertype='" + answerType + "' name='questionId' value='" + qId + "'/>");
		// 挖空题 - 挖空个数统计
		var temp_groupCount = 0;
		// 答案为单选或者复选(0:单选 1：多选 9:单选但是答案选项的描述展示控件是xheditor)
		if ("0"==answerType || "1"==answerType || "9"==answerType ||  "12"==answerType ) {
//			var answerOption = JSON.parse(question.answerOption);
//			console.log(JSON.stringify(question.answerOption));
//			如果question.answerOption不是数组那么就要转换成数组
			if(!(question.answerOption instanceof Array)){
				var answerOption = eval("("+question.answerOption+")");
				// 如果子题是单选、多项等选择类型试题则需对选项进行重新组织处理，处理过程中包含了选项异序逻辑。
				// "0".equals(orderChangeStatus)&&"1".equals(randomOption):即当复合题主题类型设置为依据考试规则定，且考试规则中设置了选项异序的情况
				// "1".equals(orderChangeStatus)或"3".equals(orderChangeStatus)：当试题类型中要求选项异序时就直接进行异序处理，不用考虑考试规则中的相关设置了
	//			if (("0".equals(orderChangeStatus) && "1".equals(randomOption)) || "1".equals(orderChangeStatus) || "3".equals(orderChangeStatus)) {
				if(("0"==this.orderChangeStatus&&"1"==this.randomOption)||"1"==this.orderChangeStatus||"3"==this.orderChangeStatus ){
					answerOption = randomz(answerOption , studentId, realName);
				}
				var answerOptionNew = [];
				var index = 0 ;
				for ( var i = 0; i < answerOption.length; i++) {
					var jsonobj = {};
					jsonobj.option=this.ANSWER_CHOICES_CHAR[i];
					for ( var x in answerOption[i]) {
						jsonobj.value = x;
						jsonobj.content = answerOption[i][x];
						jsonobj.index = index;
						index++;
					}
					answerOptionNew.push(jsonobj);
				}
				question.answerOption = answerOptionNew;
			}
			if(parentQuestion.following){
				question.following = parentQuestion.following.replace(/<table/g , "<table style='width:100%;'").replace(/break-all/g,"break-word");;
				parentQuestion.following=null;
			}
			question.complexQuestionId = parentQuestion.id;
//			question.title = question.title.replace(/span|SPAN/g , "lable");
			if(this.isSplitShowQuestion){
//			if(this.isSplitShowQuestion||(parentQuestion.questionType.isComplex&&parentQuestion.questionType.isComplex=="1")){
				this.isSplitShowQuestion = true;
				examClient.answerType0_isSplit_flag = true;
			}else{
				/*
				 * 判断是非分栏的题，是否显示title，并且是，第一次显示
				 */
				//2019年6月3日 万清说子题大于等于也要显示题干，所以由原来的子题大于1改成大于等于1
				if((examClient.isShowQuestionTitle(question.questionType)) && !(parentQuestion.parentTite)&& (parentQuestion.subQuestionArray) &&(parentQuestion.subQuestionArray.length>=1)){
					question.parentTite = parentQuestion.title.replace(/break-all/g,"break-word");;
					parentQuestion.parentTite=true;
				}
				if(answerType==0||answerType==9){
					$('#answerType0').tmpl(question).appendTo('#exam_right-container');
				}else if(answerType == 1 || answerType == 12){
					$('#answerType1').tmpl(question).appendTo('#exam_right-container');
				}
			}
		}
		else if(answerType=="2"){
			var temp_groupCount1 = question.answerOption.split("<input").length-1;
			temp_groupCount = temp_groupCount1;
			if(temp_groupCount1 == 0){
				temp_groupCount1 = question.answerOption.split("<INPUT").length-1;
			}
			//挖空题是一个空的，并且不分栏  并且父题是简单题（2016年5月9日15:26:27 选择和填空建在了一个符合提醒下挖空题不展示）
			if ( temp_groupCount1 == 1 && (!this.isSplitShowQuestion) && (!this.answerType0_isSplit_flag) && "0"==parentQuestion.questionType.isComplex ) {
				examClient.answertype2_1_flag = true;
				question.questionNum = examClient.questionNum;
				question.isChild = true;
				question.tempGroupCount = temp_groupCount1;
				var completion_input_text = "<input type='text' name='answer[" + question.id + "]' value='' "
											+"onfocus='examClient.writeAnswer(this)' maxLength='500' onblur='examClient.finishedAnswer(this)'"
											+" class='aswText' data='" + question.id	+ "' defValue=''/>";
				question.answerOption = question.answerOption.replace(/<\/?input[^>]*>/g,completion_input_text);
				question.answerOption = question.answerOption.replace(/<\/?INPUT[^>]*>/g,completion_input_text);
				//复合题型要构造HTML
			} else {
				if(parentQuestion.answerOption){
					question.answerOption = parentQuestion.answerOption.replace(/<table/g , "<table style='width:100%;'");
				}
				if((examClient.isShowQuestionTitle(parentQuestion.questionType)) && !(parentQuestion.parentTite)&& (parentQuestion.subQuestionArray) &&(parentQuestion.subQuestionArray.length>0)){
					question.parentTite = parentQuestion.title.replace(/break-all/g,"break-word");;
					parentQuestion.parentTite=true;
				}
				question.answerOption = question.answerOption.replace(/INPUT/g , "input");
				var questionNum=null;
				while(question.answerOption.indexOf("<input")>-1){
					if(temp_groupCount1 != 1){
						examClient.questionNum++;
						questionNum = (examClient.questionNum-1);
					}else{
						questionNum = examClient.questionNum;
					}
					var completion_input_text = '<iinnppuutt	name="answer['+question.id+']"	class="writ7Text1" '+
					'onclick="examClient.writeAnswerBefore(this)" onfocus="examClient.writeAnswer(this)" onblur="examClient.finishedAnswer(this)" type="text" '+
					'value="Question '+ questionNum +'" data="'+question.id+'"  defvalue="Question '+ questionNum +'">';
					$(this).replaceWith($(completion_input_text));
					question.answerOption = question.answerOption.replace(/<\/?input[^>]*>/,completion_input_text);
//					question.answerOption = question.answerOption.replace(/<\/?INPUT[^>]*>/,completion_input_text);
				}
				if(questionNum!=null && temp_groupCount1 != 1){
					examClient.questionNum--;
				}
				question.answerOption = question.answerOption.replace(/iinnppuutt/g , "input");
				if(!(this.isSplitShowQuestion && this.answerType0_isSplit_flag)){
					/*$('#answerType2').tmpl(question).appendTo('#exam_right-container');
					var input = $("#exam_right-container").find("input[type!='hidden'][class!='writ7Text1'][type!='radio']");
					input.each(function() {
						var completion_input_text = '<input	name="answer['+question.id+']"	class="writ7Text1" '+
						'onclick="examClient.writeAnswerBefore(this)" onfocus="examClient.writeAnswer(this)" onblur="examClient.finishedAnswer(this)" type="text" '+
						'value="Question '+examClient.questionNum+'" data="'+question.id+'"  defvalue="Question '+examClient.questionNum+'">';
						$(this).replaceWith($(completion_input_text));
						examClient.questionNum++;
					});
					examClient.questionNum--;*/
					
					$('#answerType2').tmpl(question).appendTo('#exam_right-container');
				}
			}
			if(question.attribute&&question.attribute.length>0) {
				var qas = question.attribute;
				for(var i = 0 ; i<qas.length ; i++) {
					if("bank"==qas[i].code) {
						examClient.buildBank(qas[i],question.id);
						break;
					}
				}
			}
		}
		else if(answerType=="3"){
			this.answerType0_isSplit_flag = false;
			question.partNum = this.partNum;
			/*if((this.questionNumStart==this.questionNum)&&parentQuestion.subQuestionArray&&(parentQuestion.subQuestionArray.length>1)){
				question.parentTite = parentQuestion.title;
				this.answerTyleFlag = "3_1";
			}*/
			
			/*
			 * 是否显示title，并且是，第一次显示
			 * 2019年10月22日 万清说子题大于等于也要显示题干，所以由原来的子题大于1改成大于等于1 （作文题复合题一子题显示父题题干）
			 */
			if((examClient.isShowQuestionTitle(parentQuestion.questionType)) && !(parentQuestion.parentTite)&& (parentQuestion.subQuestionArray) &&(parentQuestion.subQuestionArray.length>=1)){
				question.parentTite = parentQuestion.title;
				parentQuestion.parentTite=true;
				this.answerTyleFlag = "3_1";
			}
			
			if(this.answerTyleFlag == "3_1"){
				$('#answerType3_1').tmpl(question).appendTo('#exam_right-container');
			}else{
				//question.title = question.title.replace(/&nbsp;/g , " ");
				question.title = examClient.replaceNbsp(question.title);
				if(this.partContent.subExamPaperContentList.length == 1 && this.partNum==0)question.questionNum = "";
				$('#answerType3').tmpl(question).appendTo('#exam_right-container');
			}
		}
		else if(answerType=="6"){
			question.partNum = this.partNum;
			
//			question.title = "<div id=\"rownum_0\"><span id=\"sp0_0h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">From</span><span id=\"spnb0_0h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span></span>a<span id=\"spnb0_1h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_2h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">check</span><span id=\"spnb0_2h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_3h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">of</span><span id=\"spnb0_3h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_4h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">the</span><span id=\"spnb0_4h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_5h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">literature</span><span id=\"spnb0_5h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_6h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">of</span><span id=\"spnb0_6h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_7h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">the</span><span id=\"spnb0_7h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_8h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">field</span><span id=\"spnb0_8h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_9h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">it</span><span id=\"spnb0_9h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_10h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">is</span><span id=\"spnb0_10h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_11h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">clear</span><span id=\"spnb0_11h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_12h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">that</span><span id=\"spnb0_12h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp0_13h41\" onclick=\"showDialog(this, 0, 'w')\" class=\"errorSp\">all</span><span id=\"spnb0_13h41\" onclick=\"showDialog(this, 0, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_1\">这行是无效行</div><div id=\"rownum_2\"><span id=\"sp1_0h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">the</span><span id=\"spnb1_0h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_1h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">approaches</span><span id=\"spnb1_1h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_2h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">adopted</span><span id=\"spnb1_2h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_3h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">to</span><span id=\"spnb1_3h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_4h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">the</span><span id=\"spnb1_4h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_5h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">phenomena</span><span id=\"spnb1_5h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_6h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">of</span><span id=\"spnb1_6h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_7h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">SLA</span><span id=\"spnb1_7h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_8h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">so</span><span id=\"spnb1_8h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_9h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">far</span><span id=\"spnb1_9h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp1_10h71\" onclick=\"showDialog(this, 1, 'w')\" class=\"errorSp\">have</span><span id=\"spnb1_10h71\" onclick=\"showDialog(this, 1, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_3\"><span id=\"sp2_0h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">one</span><span id=\"spnb2_0h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_1h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">thing</span><span id=\"spnb2_1h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_2h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">in</span><span id=\"spnb2_2h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_3h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">common</span>:<span id=\"spnb2_3h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_4h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">The</span><span id=\"spnb2_4h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_5h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">perspective</span><span id=\"spnb2_5h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_6h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">adopted</span><span id=\"spnb2_6h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_7h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">to</span><span id=\"spnb2_7h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_8h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">view</span><span id=\"spnb2_8h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_9h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">the</span><span id=\"spnb2_9h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp2_10h101\" onclick=\"showDialog(this, 2, 'w')\" class=\"errorSp\">acquiring</span><span id=\"spnb2_10h101\" onclick=\"showDialog(this, 2, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_4\"><span id=\"sp3_0h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">of</span><span id=\"spnb3_0h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_1h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">an</span><span id=\"spnb3_1h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_2h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">additional</span><span id=\"spnb3_2h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_3h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">language</span><span id=\"spnb3_3h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_4h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">is</span><span id=\"spnb3_4h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_5h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">that</span><span id=\"spnb3_5h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_6h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">of</span><span id=\"spnb3_6h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_7h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">an</span><span id=\"spnb3_7h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_8h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">individual</span><span id=\"spnb3_8h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_9h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">attempts</span><span id=\"spnb3_9h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_10h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">to</span><span id=\"spnb3_10h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp3_11h131\" onclick=\"showDialog(this, 3, 'w')\" class=\"errorSp\">do</span><span id=\"spnb3_11h131\" onclick=\"showDialog(this, 3, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_5\"><span id=\"sp4_0h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">so</span>.<span id=\"spnb4_0h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_1h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">Whether</span><span id=\"spnb4_1h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_2h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">one</span><span id=\"spnb4_2h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_3h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">labels</span><span id=\"spnb4_3h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_4h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">it</span><span id=\"spnb4_4h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span>“<span id=\"sp4_5h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">learning</span>”<span id=\"spnb4_5h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_6h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">or</span><span id=\"spnb4_6h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span>“<span id=\"sp4_7h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">acquiring</span>”<span id=\"spnb4_7h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_8h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">an</span><span id=\"spnb4_8h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp4_9h161\" onclick=\"showDialog(this, 4, 'w')\" class=\"errorSp\">additional</span><span id=\"spnb4_9h161\" onclick=\"showDialog(this, 4, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_6\"><span id=\"sp5_0h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">language</span>,<span id=\"spnb5_0h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_1h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">it</span><span id=\"spnb5_1h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_2h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">is</span><span id=\"spnb5_2h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_3h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">an</span><span id=\"spnb5_3h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_4h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">individual</span><span id=\"spnb5_4h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_5h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">accomplishment</span><span id=\"spnb5_5h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_6h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">or</span><span id=\"spnb5_6h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_7h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">what</span><span id=\"spnb5_7h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_8h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">is</span><span id=\"spnb5_8h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp5_9h191\" onclick=\"showDialog(this, 5, 'w')\" class=\"errorSp\">under</span><span id=\"spnb5_9h191\" onclick=\"showDialog(this, 5, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_7\"><span id=\"sp6_0h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">focus</span><span id=\"spnb6_0h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_1h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">is</span><span id=\"spnb6_1h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_2h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">the</span><span id=\"spnb6_2h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_3h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">cognitive</span>,<span id=\"spnb6_3h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_4h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">psychological</span>,<span id=\"spnb6_4h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_5h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">and</span><span id=\"spnb6_5h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_6h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">institutional</span><span id=\"spnb6_6h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_7h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">status</span><span id=\"spnb6_7h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_8h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">of</span><span id=\"spnb6_8h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp6_9h221\" onclick=\"showDialog(this, 6, 'w')\" class=\"errorSp\">an</span><span id=\"spnb6_9h221\" onclick=\"showDialog(this, 6, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_8\"><span id=\"sp7_0h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">individual</span>.<span id=\"spnb7_0h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_1h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">That</span><span id=\"spnb7_1h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_2h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">is</span>,<span id=\"spnb7_2h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_3h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">the</span><span id=\"spnb7_3h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_4h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">spotlight</span><span id=\"spnb7_4h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_5h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">is</span><span id=\"spnb7_5h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_6h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">on</span><span id=\"spnb7_6h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_7h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">what</span><span id=\"spnb7_7h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_8h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">mental</span><span id=\"spnb7_8h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp7_9h251\" onclick=\"showDialog(this, 7, 'w')\" class=\"errorSp\">capabilities</span><span id=\"spnb7_9h251\" onclick=\"showDialog(this, 7, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_9\"><span id=\"sp8_0h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">or</span><span id=\"spnb8_0h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_1h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">acquisition</span>,<span id=\"spnb8_1h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_2h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">and</span><span id=\"spnb8_2h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_3h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">whether</span><span id=\"spnb8_3h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_4h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">the</span><span id=\"spnb8_4h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_5h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">target</span><span id=\"spnb8_5h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_6h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">language</span><span id=\"spnb8_6h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_7h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">is</span><span id=\"spnb8_7h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_8h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">learnt</span><span id=\"spnb8_8h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_9h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">in</span><span id=\"spnb8_9h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp8_10h281\" onclick=\"showDialog(this, 8, 'w')\" class=\"errorSp\">the</span><span id=\"spnb8_10h281\" onclick=\"showDialog(this, 8, 'n')\" class=\"errorSp\">&nbsp;</span></div><div id=\"rownum_10\"><span id=\"sp9_0h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">classroom</span><span id=\"spnb9_0h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_1h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">or</span><span id=\"spnb9_1h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_2h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">acquired</span><span id=\"spnb9_2h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_3h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">through</span><span id=\"spnb9_3h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_4h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">social</span><span id=\"spnb9_4h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_5h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">touching</span><span id=\"spnb9_5h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_6h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">with</span><span id=\"spnb9_6h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_7h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">native</span><span id=\"spnb9_7h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span><span id=\"sp9_8h311\" onclick=\"showDialog(this, 9, 'w')\" class=\"errorSp\">speakers</span>.<span id=\"spnb9_8h311\" onclick=\"showDialog(this, 9, 'n')\" class=\"errorSp\">&nbsp;</span></div>";
//			question.answerOption = "<div id=\"rownum_opt_0\" ><input class=\"textinput\" truetype=\"textinput\" name=\"del0\" id=\"inp0\" readonly=\"readonly\" type=\"text\"></div><div id=\"rownum_opt_1\">&nbsp;</div><div id=\"rownum_opt_2\" ><input class=\"textinput\" truetype=\"textinput\" readonly=\"readonly\" name=\"modify1\" id=\"inp1\" onchange=\"getOptVal(this, 1, 2)\" type=\"text\"></div><div id=\"rownum_opt_3\" ><input class=\"textinput\" truetype=\"textinput\" name=\"right2\" id=\"inp2\"  readonly=\"readonly\" type=\"text\"></div><div id=\"rownum_opt_4\" ><input class=\"textinput\" truetype=\"textinput\" name=\"del3\" id=\"inp3\" readonly=\"readonly\" type=\"text\"></div><div id=\"rownum_opt_5\" ><input class=\"textinput\" truetype=\"textinput\" name=\"modify4\" id=\"inp4\" readonly=\"readonly\" onchange=\"getOptVal(this, 4, 2)\" type=\"text\"></div><div id=\"rownum_opt_6\" ><input class=\"textinput\" truetype=\"textinput\" name=\"add5\" id=\"inp5\" readonly=\"readonly\" onchange=\"getOptVal(this, 5, 1)\" type=\"text\"></div><div id=\"rownum_opt_7\" ><input class=\"textinput\" truetype=\"textinput\" name=\"right6\" id=\"inp6\" readonly=\"readonly\" type=\"text\"></div><div id=\"rownum_opt_8\" ><input class=\"textinput\" truetype=\"textinput\" name=\"del7\" id=\"inp7\" readonly=\"readonly\" type=\"text\"></div><div id=\"rownum_opt_9\" ><input class=\"textinput\" truetype=\"textinput\" name=\"add8\" id=\"inp8\"  readonly=\"readonly\" onchange=\"getOptVal(this, 8, 1)\" type=\"text\"></div><div id=\"rownum_opt_10\" ><input class=\"textinput\" truetype=\"textinput\" name=\"modify9\" id=\"inp9\" readonly=\"readonly\" onchange=\"getOptVal(this, 9, 2)\" type=\"text\"></div>";

			question.title = question.title.replace(/<div/g , "<div class=\"editwordDiv\"").replace(/rownum_/g , question.id+"_rownum_");//.replace(/&nbsp;/g , " ");
			question.answerOption = question.answerOption.replace(/rownum_opt_/g , question.id+"_rownum_opt_");
			
			//question.answerOption数据处理
			question.answerOption = question.answerOption.replace(/INPUT/g , "input");
			var questionNum=null;
			while(question.answerOption.indexOf("<input")>-1){
				examClient.questionNum++;
				questionNum = (examClient.questionNum-1);
//				question.answerOption = question.answerOption.replace(/<input/ , "<iinnppuutt value=\"Question "+ questionNum +"\" data=\""+question.id+"\" defvalue=\"Question "+questionNum+"\" ");
				
				
				var completion_input_text = '<iinnppuutt type="text" readonly="readonly"  name="answerShow['+question.id+']" truetype="textinput" class="textinput input_default" defvalue="Question '+ questionNum +'" data="'+question.id+'" value="Question '+ questionNum +'" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" style="overflow-x: visible;">'+
											'<iinnppuutt type="hidden" readonly="readonly"  name="answer['+question.id+']" truetype="textinput" class="textinput input_default" defvalue="Question '+ questionNum +'" data="'+question.id+'" value="Question '+ questionNum +'" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" style="overflow-x: visible;">';
				
				/*							"<iinnppuutt value=\"Question "+ questionNum +"\" data=\""+question.id+"\" defvalue=\"Question "+questionNum+"\" "
				var completion_input_text = '<iinnppuutt	name="answer['+question.id+']"	class="writ7Text1" '+
				'onclick="examClient.writeAnswerBefore(this)" onfocus="examClient.writeAnswer(this)" onblur="examClient.finishedAnswer(this)" type="text" '+
				'value="Question '+ questionNum +'" data="'+question.id+'"  defvalue="Question '+ questionNum +'">';*/
				question.answerOption = question.answerOption.replace(/<\/?input[^>]*>/,completion_input_text);
			
			}
			question.answerOption = question.answerOption.replace(/iinnppuutt/g , "input");
			if(questionNum!=null){
				examClient.questionNum--;
			}
			question.answerOption = question.answerOption.replace(/<div/g , "<div class=\"editValueDiv\"");//.replace(/iinnppuutt/g , "input").replace(/name=\"[^ ]*\"/g , "name=\"answer["+question.id+"]\"");

			$('#answerType6').tmpl(question).appendTo('#exam_right-container');
			//改错题-左侧自动高度 右侧自动对齐-20160311
			edittipAutoHeight();
		}else if(answerType=="4" || "11"==answerType){
			this.answerType0_isSplit_flag = false;
			question.partNum = this.partNum;
			question.title = examClient.replaceNbsp(question.title);
			/*
			 * 是否显示title，并且是，第一次显示
			 * 2019年10月22日 万清说子题大于等于也要显示题干，所以由原来的子题大于1改成大于等于1 （作文题复合题一子题显示父题题干）
			 */
			if((examClient.isShowQuestionTitle(parentQuestion.questionType)) && !(parentQuestion.parentTite)&& (parentQuestion.subQuestionArray) &&(parentQuestion.subQuestionArray.length>=1)){
				question.parentTite = parentQuestion.title;
				parentQuestion.parentTite=true;
				this.answerTyleFlag = "4_1";
			}
			if(this.partContent.subExamPaperContentList.length == 1 && this.partNum==0)question.questionNum = "";
			$('#answerType4').tmpl(question).appendTo('#exam_right-container');
			
			this.UEConfig.serverUrl =  top.baseURL + "/ueu/controller.jsp?batchId="+top.batchId+"&studentId="+top.studentId;
			var ueObj = UE.getEditor('answer['+question.id+']',this.UEConfig);
			this.ueJson[question.id] = ueObj;
			//关闭防切屏
			top.focusEnable=false;
			
			ueObj.addListener('blur',function(type){
				examClient.subAnswerAnswerType4(question.id , ueObj.getContent());
			});
			ueObj.addListener('beforepaste',function(o, html){
				html.html = "";
			});
		}
		answerAreaHtml.push("</div>");
		// 增加空行间隔
		answerAreaHtml.push(" <div class='divspace'>&nbsp;</div>");
		if (question.resourcePath != null && question.resourcePath != '') {
			if(temp_groupCount<=1) { //挖空题 是1个  其他为 0 的时候添加序号
				//添加序号音频
				this.addQuestionNumPlayAudioStr(this.curPartQuestionNumStart);
			}
			//添加question 音频 
			this.addQuestionPlayAudioStr(question);
		}
		
		this.childQuestionJson.push(question);
		
		// 自增题号
		if(temp_groupCount!=0){
			/*有挖空题的时候，加上空的数量而不是自增+1*/
			this.curPartQuestionNumStart += temp_groupCount ;
		}else{
			/*没有挖空题的时候自增+1*/
			this.curPartQuestionNumStart++;
		}
		//刷新 收起操作的按钮的 active 属性 
		this.refresh();
		
	};
	
	/**
	 * 重新构造，收起操作的按钮的 active 属性 
	 */
	examClient.refresh = function(){
		if($(".exam_right-suo",window.parent.document).hasClass("active")){
			$('#exam_right-container').find(".exam_right-wrap").addClass("active");
		}
		else{
			$('#exam_right-container').find(".exam_right-wrap").removeClass("active");
		}
	};
	
	// 解析试卷结构到StringBuilder中(需要试卷结构中级联了question/questionType/questionTypeAttributs、subQuestion/subQestionType/subQuestionTypeAttributs)
	examClient.buildExamPaperContent2HTML = function(subExamPaperContentList) {
		/*清空选词填空的备选词库*/
		$("#id_table_bank").remove();
		examClient.thmlontent = {};
		/*examClient.answertype2_1_flag = false;
		this.isSplitShowQuestion = false;
		this.answerType0_isSplit_flag = false;*/
		examClient.answertype2_1_flag = false;
		var answerAreaHtml = [];
		//异序
		if("1"==this.randomQuestion&&subExamPaperContentList.length>1&& (this.isSameQuestion(subExamPaperContentList)) ){
			var arr1 = [];
			var arr2 = [];
			for (var i=0;i<subExamPaperContentList.length;i++) {
				if(subExamPaperContentList[i].question.subQuestionArray!=null&&subExamPaperContentList[i].question.subQuestionArray.length>1) {
					arr2.push(subExamPaperContentList[i]);
				}else{
					arr1.push(subExamPaperContentList[i]);
				}
			}
			arr1 = randomz(arr1 , studentId, realName);
			arr2 = randomz(arr2 , studentId, realName);
			subExamPaperContentList = arr1.concat(arr2);
		}
		
		for (var i=0;i<subExamPaperContentList.length;i++) {
			this.childQuestionJson = [];//初始化小题数组
			if(this.curPartAnswerQuestionPos>0) {
				i = this.curPartAnswerQuestionPos;
			}
			if(undefined==this.questionNumCount[i]){
				this.questionNumCount[i] = this.curPartQuestionNumStart-1;
			}
			var question = subExamPaperContentList[i].question;
			if(null==question.title){
				question.title = "";
			}
			this.orderChangeStatus = question.questionType.orderChangeStatus;
			this.answerTyleFlag = question.questionType.answerType;
			if(!examClient.isShowQuestionTitle(question.questionType)){
				question.title="";
			}
			// 简单题型
			if ("0"==question.questionType.isComplex) {
				question.curPartSubQuestionNum = this.curPartSubQuestionNum;
				this.buildQuestion2html(question, question,answerAreaHtml);
				this.curPartAnswerQuestionPos++;
				//挖空题是一个空的，并且不分栏
				if(examClient.answertype2_1_flag){
					question.answertype2_1_flag = this.answertype2_1_flag;
					$('#answerType2').tmpl(question).appendTo('#exam_right-container');
					//刷新 收起操作的按钮的 active 属性 
					this.refresh();
				}else{
					if(this.isSplitShowQuestion && this.answerType0_isSplit_flag){
						/*当前part的第几个*/
						question.curPartAnswerQuestionPos = this.curPartAnswerQuestionPos;
						/*当前总共有多少个part*/
						$('#answerType2').tmpl(question).appendTo('#exam_right-container');
						this.refresh();
						break;
					}
				}
			//复合题型
			} else {
				// "0".equals(orderChangeStatus)&&"1".equals(randomQuestion)):当试题类型中设置了复合题小题异序情况由考试规则定，且考试规则中设置了试题异序时
				// "1".equals(orderChangeStatus)或"2".equals(orderChangeStatus)：当试题类型中设置了复合题小题要求异序时就直接进行异序处理,不用考虑考试规则中的相关设置了
				var subQuestionArray = question.subQuestionArray;
				if(!subQuestionArray)subQuestionArray=[];
				if(("0"==this.orderChangeStatus&&"1"==this.randomQuestion)||"1"==this.orderChangeStatus||"2"==this.orderChangeStatus ){
					question.subQuestionArray = randomz(subQuestionArray , studentId, realName); 
				}
				var qId = question.id;
				this.pushQT("<input type='hidden' id='questionId[" +qId + "]' answername='answer[" + qId
						+ "]' answertype='' name='complexQuestionId' value='" + qId + "'/>");
				this.curPartAnswerQuestionPos++;
				// 1、复合式听写
				if (question.resourcePath != null && question.resourcePath != '') {
							var isnumadio = 11;
							// resourcePathList.add(question.getResourcePath());
							// 语言题提示语言  只有子题数量大于1的时候才出现以下内容
							if(question.subQuestionArray!=null&&question.subQuestionArray.length>1) {
								question.following = this.FOLLOWING_CONVERSATION_TXT;
								//bodyContent.append(FOLLOWING_CONVERSATION_TXT);
							} else if (question.subQuestionArray.length!=0){
								if(this.answerTyleFlag!=2){
									this.addQuestionNumPlayAudioStr(this.curPartQuestionNumStart);
								}
							}
							//添加question 音频 
							this.addQuestionPlayAudioStr(question);
							// 阅读
				// 阅读
				}
				if(!question.resourcePath||null==question.resourcePath||""==question.resourcePath||(question.title.indexOf("##1##")!=-1 || question.title.indexOf("####")!=-1)) {
					//计算当前是否为分栏显示题型
//					if(question.title.length>500||(  question.title.indexOf("<img") !=-1 ) ) {
					if(subExamPaperContentList.length>1 || question.title.length>500|| question.title.indexOf("<img") !=-1 || question.title.indexOf("##1##")!=-1 || question.title.indexOf("####")!=-1){
						//都是复合题再分栏展示 this.isSameQuestionTypeComplex(subExamPaperContentList)
						if(this.isSameQuestionTypeComplex(subExamPaperContentList)){
							this.isSplitShowQuestion = true;
							this.answerType0_isSplit_flag = true;
						}else{
							this.isSplitShowQuestion = false;
						}
//						this.curPartAnswerQuestionPos++;
					} else {
						this.isSplitShowQuestion = false;
//						this.curPartAnswerQuestionPos = 0;
					}
					this.pushQT("<div class='divQuestionTitle'><div class='resource'>");
					this.pushQT("<div id='resourceScript'>");
					var num=1;
					if(question.title!=null && (question.title.indexOf("##1##")!=-1 || question.title.indexOf("####")!=-1)){
						var qnum = this.questionNum+1;
						for (var subQuestion in subQuestionArray) {
							var inputContext = "<input id=\"gap_"+subQuestionArray[subQuestion].id+"\" value='Question " + qnum + "' type=\"text\" readonly=\"readonly\" " + " defValue='Question " + qnum +"' onclick=\"examClient.clozetestsClick(this)\"/>";
							if( question.title.indexOf("##"+num+"##")!=-1){	//如果是完型填空题
								question.title = question.title.replace("##"+num+"##", inputContext);
//								question.title = question.title.replace("##"+num+"##", qnum+")________");
							}else if(question.title.indexOf("####")!=-1){
								question.title = question.title.replace("####", inputContext);
							}
							qnum++;
							num++;
						}
						this.answerTyleFlag = "answerType0_1";
					}else if(question.title.indexOf("examClient.clozetestsClick(this)")!=-1){
						this.answerTyleFlag = "answerType0_1";
					}
//					question.subQuestionArray = randomz(subQuestionArray , studentId, realName); 
					this.pushQT(question.title==null?"":question.title);
					this.pushQT("</div><div class='divspace'></div>");
					this.pushQT("</div></div>");
				}
				// 2、子题展示按照简单题型展示
//				var subQuestionArray = question.subQuestionArray;
				/*if(this.isSplitShowQuestion&&(!this.videoPlayArray||this.videoPlayArray.length==0)){
				}*/
				question.isChild = false;
				for (var subQuestion in subQuestionArray) {
					this.buildQuestion2html(question , subQuestionArray[subQuestion],answerAreaHtml);
				}
//				console.log(JSON.stringify(subQuestionArray));
				question.child = examClient.childQuestionJson;
				/*当前part的第几个*/
				question.curPartAnswerQuestionPos = this.curPartAnswerQuestionPos;
				/*当前总共有多少个part*/
				question.curPartSubQuestionNum = this.curPartSubQuestionNum;
				question.title = question.title.replace(/<table/g , "<table style='width:100%;'");
				//question.title = question.title.replace(/&nbsp;/g , "　");
				question.title = examClient.replaceNbsp(question.title);
				if(examClient.answertype2_1_flag&&"3"==this.answerTyleFlag){
					examClient.childQuestionJson = [];
					//this.questionNum = 0;
					$('#answerType0_isSplit').tmpl(question).appendTo('#exam_right-container');
					//刷新 收起操作的按钮的 active 属性 
					winSize2();
					this.refresh();
					bindResize(document.getElementById('answer'));
					break;
				}else if(this.answerTyleFlag == "answerType0_1"){
					$('#answerType0_1').tmpl(question).appendTo('#exam_right-container');
					this.refresh();
					break;
				}else if(examClient.answerType0_isSplit_flag){
					examClient.childQuestionJson = [];
					//this.questionNum = 0;
					$('#answerType0_isSplit').tmpl(question).appendTo('#exam_right-container');
					//winSize_isSplit();
					//bindResize_isSplit(document.getElementById('answer'));
					winSize2();
					this.refresh();
					bindResize(document.getElementById('answer'));
					break;
				}else if(examClient.answertype2_1_flag&&"2"==this.answerTyleFlag){
					$('#answerType0_isSplit').tmpl(question).appendTo('#exam_right-container');
					winSize2();
					bindResize(document.getElementById('answer'));
					break;
				}
			}
			if(this.isSplitShowQuestion) {
				this.curQuestionTitle = this.bodyContent.join("");
				this.curQuestionChoice = answerAreaHtml.join("");
			}
			//初始化answerType = 2 的Boolean标识 为flase，此行，一个题执行完成
			examClient.answertype2_1_flag = false;
			//只解析一题
			/*if(this.isSplitShowQuestion&&this.curPartAnswerQuestionPos>1) {
				break;
			}*/
			
		}
		//只有一个question的remove掉最后一个answer = 2 的分割线
		if(subExamPaperContentList.length==1){
			$("div[name='splitLine']").remove();
		}
//		this.videoPlayArray = [];
//		this.videoPlayArray.push("/numaudio/1.mp3");
//		this.videoPlayArray="0,/resourcefile/201309/710/20130913142744607.mp3";
//		top.sysAlert(this.videoPlayArray.toString());

		var fontSize = sessionStorage.getItem('fontSize');
		if (fontSize){
			$('.exam_right-wrap').css('font-size', fontSize + 'px');
			$('#tools select option[value=' + fontSize + ']').prop('selected', true)
		}
	};
	
	//设置当前试题内容
	examClient.pushQT = function(con) {
		this.bodyContent.push(con);
	};

	// 设置该part下挂载的试题Html字符串setBodyContent()，包括设置音频资源setResourcePath()
	examClient.showQuestionContent = function() {
		
		//add dir 音频
		this.addPartDirectionsPlayAudio(this.partContent);
		//构建 directions
		if(undefined!=this.partContent.directions && ""!=this.partContent.directions){
			$("#"+this.directionsWrapperId).html(this.partContent.directions);
			$("#"+this.directionsWrapperId).prev().html("答题说明:");
		}else{
			$("#"+this.directionsWrapperId).prev().hide();
		}
		//渲染标题
		$("#"+this.partTitleWrapperId).html(this.partContent.name+" &nbsp;&nbsp; "+(this.partContent.title?this.partContent.title:""));
		this.buildExamPaperContent2HTML(this.partContent.subExamPaperContentList);
		//交卷或者下一题按钮
		if((!(this.isSplitShowQuestion&&(this.curPartAnswerQuestionPos<this.curPartSubQuestionNum)))&&(this.maxPartNum==(this.partNum+1))){
			document.getElementById("id_a_nextQuestion").style.display="none";
			document.getElementById("id_a_submitPaper").style.display="block";
		}else{
			document.getElementById("id_a_nextQuestion").style.display="block";
			document.getElementById("id_a_submitPaper").style.display="none";
		}
		//上一题按钮显隐
		if(this.partNum==0){
			document.getElementById("id_a_prevQuestion").style.display="none";
		}
		//是第一个part 并且有多个结构 并且是不分页
		if(this.partNum==0 && this.curPartAnswerQuestionPos >1 && (this.isSplitShowQuestion)){
			document.getElementById("id_a_prevQuestion").style.display="block";
		}
		if(this.isSplitShowQuestion) {
			// 答题区ID
//			this.answerAreaId = "id_div_answerarea";
//			// 试题内容展示区域ID
//			this.questionTitleAreaId = "id_div_questionarea";
			$("#"+this.questionTitleAreaId).html(this.curQuestionTitle);
			$("#"+this.answerAreaId).html(this.curQuestionChoice);
		} else {
			$("#"+this.questionTitleAreaId).html(this.bodyContent.join(""));
		}
		this.buildFunBtnToolBar();
		
//		console.log(this.videoPlayArray.toString());
			//渲染播放器（控制显隐）
		if(this.videoPlayArray.length&&this.videoPlayArray.length>0){
			$("#id_div_music").show();
			//检测音频播放状态，播放过则不让点击
			if((this.videoPlayArray.toString().indexOf(".mp4")>0)||(this.videoPlayArray.toString().indexOf(".MP4")>0)){
				var divPlayer = document.getElementById(this.divPlayerCtrId);
				divPlayer.style.display = "block";
				divPlayer.style.position = "relative";
				divPlayer.style.top = "0";
				$("#"+this.divPlayerCtrId).css("margin-left",(($("#id_div_parttitle").width()-640)/2));
				this.initFlvFFlag = true;
				initJplayer();
			}else{
				$.post( baseURL + "/examPaper/checkVideoPlayStaus.json", {
					partNum : examClient.partNum,
					examBatchResultId : studentExamResultId
				}, function(data) {
					if(!(data.playStatus)){
						data.playStatus="-1";	
					}
					//播放中状态
					if (data.playStatus == "2") { //已经播放过
						//音频播放完毕按钮状态
						$("#id_div_music_start").hide();
						var obj = $("#id_div_music_start");
						obj.siblings(".playing").hide();
						obj.siblings(".over").show();
						obj.siblings("p").hide();
						return false;
					}
				});
			}
		}
		//处理上一题按钮的页面跳转操作2/2
		top.window.partNextNum ++ ;
		if((this.curPartSubQuestionNum==1) || !(this.isSplitShowQuestion)){
			top.window.partNextFlag =false;
		}
		if((this.curPartSubQuestionNum)>(top.window.partNextNum) && top.window.partNextFlag){
			examClient.nextQuestionEvent();
		}
		
	};
	
	
	/**
	 * 构建题号
	 */
	examClient.buildQuestionNum = function() {
		var count  = 0;
		for(var i = 0 ;(this.examPaperQuestionNumArr&&this.examPaperQuestionNumArr.length>i);i++){
			for(var j = 0 ; j < this.partNum ; j++){
				var num = this.examPaperQuestionNumArr[i][j+""] ;
				if(num){
					count+=num;
				}
			}
		}
		this.questionNum = count;
		this.questionNumStart = count + 1;
		this.curPartQuestionNumStart = count+1;
	};
	/**
	 * 构建试题选项
	 */
	examClient.buildQstAnswerChoice = function(question) {
		
	};
	/**
	 * 构建试题选项
	 */
	/*examClient.writeAnswer = function(obj) {
		
	};*/
	/**
	 * 文本框时，样式修改及保存答案
	 */
	examClient.finishedAnswer = function(obj , type) {
			if (type == "selectWord") {
				if (checkSelect(obj)) {
					return;
				}
			}
			//过滤emoij表情
			try {
				var ranges = [
				              '\udb40[\udc00-\udfff]',
				              '\ud80c[\udc00-\udfff]',
				              '\ud83c[\udc00-\udfff]',
				              '\ud83e[\udd00-\udfff]',
				              '\ud83d[\udc00-\ude4f]', 
				              '\ud83d[\ude80-\udeff]'
				          ];
				var emojireg = obj.value;
				if(undefined == emojireg) emojireg = "";
				emojireg = emojireg .replace(new RegExp(ranges.join('|'), 'g'), '');
				if(emojireg.length!=obj.value.length){
					obj.value = emojireg;
				}
			} catch (e) {
			}
			//过滤emoij表情结束	
			
			if ($(obj).attr("data") != null) {
				examClient.subAnswer($(obj).attr("data"), $(obj).attr("name"), type);
			}
			if ($(obj).attr("defValue") != null) {
				var defV = $(obj).attr("defValue");
				var v = $(obj).val();
				if (v == "") {
					$(obj).val(defV);
//					obj.className = "input_default";
					obj.className= obj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_default";
				}
			}
	};
	/**
	 * 文本框时，录题时样式
	 */
	examClient.writeAnswer = function(obj) {
		if ($(obj).attr("defValue") != null) {
			var defV = $(obj).attr("defValue");
			var v = $(obj).val();
			if (defV == v) {
				$(obj).val("");
//				obj.className = "input_changed";
				obj.className= obj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			}
		}
	};
	/**
	 * 选词填空点击输入文本框
	 */
	examClient.writeAnswerBefore = function(obj) {
		examClient.clickObj = null;
		if(!examClient.thmlontent[$(obj).attr("data")]){
			return;
		}else{
			examClient.clickObj = obj;
			if(examClient._d){
				examClient._d.remove();
			}
			examClient._d = null;
			
			$(obj).attr("readonly","readonly");
			examClient._d = dialog({
				align : 'bottom right',
				quickClose : true,
				fixed:false,
				content : examClient.thmlontent[$(obj).attr("data")]
			});
			examClient._d.show(obj);
			// 设置字体
			var fontSize = sessionStorage.getItem('fontSize');
			if (fontSize){
				$('.ui-popup .ui-dialog').css('font-size', fontSize + 'px')
			}
		}
	};
	
	//完形填空点击输入文本框
	examClient.clozetestsClick = function(obj){
		if ($(obj).attr("defValue") != null) {
			var defV = $(obj).attr("defValue");
			var v = $(obj).val();
			if (defV != v) {
//				obj.className = "input_changed";
				obj.className= obj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			}
		}
		try {examClient._d.remove();} catch (e) {}
		examClient.clickObj = null;
		examClient._d = null;
		examClient.clickObj = obj;
		var gapId = $(obj).attr("id");
		var clozetestsId = gapId.replace(/gap/ ,"clozetests");
		var thmlontent = "";
		if(gapId){
			thmlontent = $("#"+clozetestsId);
			thmlontent.find("tr").each(function(i){
				$(this).removeClass("ansewerChecked");
				if($.trim($(this).attr("attrbu"))==$.trim($(obj).val())){
					$(this).addClass("ansewerChecked");
					var obj2 = $(this).find("input[type=radio]");
					obj2.attr("checked" , true);
				}else{
					var obj2 = $(this).find("input[type=radio]");
					obj2.attr("checked" , false);
				}
			});
			examClient._d = dialog({
				align : 'bottom',
				quickClose : true,
				content : thmlontent.html().replace(/name="answer/g , 'name="clozetest_answer')
			});
			examClient._d.show(obj);
		}
	};
	/**
	 * 显示提交答卷确认提示
	 */
	examClient.submitTestpaper1 = function() {
		var d = dialog({
		    title: '提示',
		    content: '试卷提交后不可返回修改！是否确定提交试卷？',
		    okValue: '确定',
		    ok: function () {
		    	$.post("saveStudentAnswer.json",
			    		  {studentResultId :studentExamResultId, examPaperId : exampid, batchId : batchId, studentId : studentId ,isTrain:top.window.isTrain},
			     		  function rendResponds(data) {
			    			var data1=data;
							if (data1.done == "failed") {
								dialog({content: data1.info,okValue: '确定'}).show();
								return;
							} else {
								//训练系统
								if(top.window.isTrain=="1"){
									var context ="试卷已提交，点击查看试卷。";
									parent.topAlert("提示",context,"确定",function() {
										top.location.href=baseURL+"/examPaper/viewExamPaper4js/"+exampid+"?isTrain=1&studentResultId="+studentExamResultId+"&batchId="+batchId;
									});
								}else{
									var context =(top.isPaperSell)?"亲~交卷成功了！\"我的成绩\"中可以查看考试结果哦~":"试卷已提交。请点击“确定”返回测试系统首页。考试成绩查询时间请等待学校通知。";
									parent.topAlertClose("提示",context,"确定",function() {
										if(top.isPaperSell){
											examClient.addCookie("isPaper",true,1);
											examClient.addCookie("batchId",batchId,1);
											examClient.addCookie("studentResultId",studentExamResultId,1);
											examClient.addCookie("studentId",studentId,1);
											examClient.addCookie("examPaperId ",top.examPaperId ,1);
											//top.location.href=baseURL;
											//top.window.location.href=baseURL+"/home/analysisExamResult?batchId="+batchId+"&studentResultId=" +studentExamResultId + "&type=1" + "&loginName="+studentId+"&realName=&isPaperSell="+top.isPaperSell;
										}
										top.location.href=baseURL;
									});
								}
								
								/*dialog({content: '试卷已提交。请点击“确定”返回测试系统首页。考试成绩查询时间请等待学校通知。',okValue: '确定', ok: function () {
									top.location.href=baseURL;
								}}).show();*/
							}
						});
		    },
		    cancelValue: '取消',
		    cancel: function () {}
		}).showModal();
		d.show();
	};
	
	examClient.closeWindow = function(){
		window.opener = null;  
	    window.open('', '_top', '');  
	    window.parent.close();  
	};
	
	examClient.submitTestpaper = function() {
		//试卷预览则关闭窗口
		if("1"==paperView){
			examClient.closeWindow();
			return false;
		}
		var message = "试卷提交后不可返回修改！是否确定提交试卷？";
		$.ajax({
			type : "POST",
			url : baseURL+"/examPaper/checkTotllQuestionNumIsOver",
			data : { examPaperId : exampid, batchId : batchId, studentId : studentId},
			async : false,
			success : function(data) {
				if(data.message=="false"){
					message = "<b style='color:#F00'>您可能还有试题未作答！</b>试卷提交后不可返回修改，是否确定提交试卷？";
				}
			}
	    });
		
		parent.topAlert2Close("提示",message,"确定",function() {
			$.post("saveStudentAnswer.json",
	    		  {studentResultId :studentExamResultId, examPaperId : exampid, batchId : batchId, studentId : studentId ,isTrain:top.window.isTrain},
	     		  function rendResponds(data) {
	    			var data1=data;
					if (data1.done == "failed") {
						dialog({content: data1.info,okValue: '确定'}).show();
						return;
					} else {
						examClient.nextPaper();
						//训练系统
						if(top.window.isTrain=="1"){
							var context ="试卷已提交，点击查看试卷。";
							parent.topAlert("提示",context,"确定",function() {
								top.location.href=baseURL+"/examPaper/viewExamPaper4js/"+exampid+"?isTrain=1&studentResultId="+studentExamResultId+"&batchId="+batchId;
							});
						}else{
							try {
								var nodejsExit = require("child_process");
								shutdownshieldhk();
							}
							catch (e) 
							{}
							var context =(top.isPaperSell)?"亲~交卷成功了！\"我的成绩\"中可以查看考试结果哦~":"试卷已提交。请点击“确定”返回测试系统首页。考试成绩查询时间请等待学校通知。";
							parent.topAlertClose("提示",context,"确定",function() {
								if(top.isPaperSell){
									examClient.addCookie("isPaper",true,1);
									examClient.addCookie("batchId",batchId,1);
									examClient.addCookie("studentResultId",studentExamResultId,1);
									examClient.addCookie("studentId",studentId,1);
									examClient.addCookie("examPaperId ",top.examPaperId ,1);
									//top.location.href=baseURL;
									//top.window.location.href=baseURL+"/home/analysisExamResult?batchId="+batchId+"&studentResultId=" +studentExamResultId + "&type=1" + "&loginName="+studentId+"&realName=&isPaperSell="+top.isPaperSell;
								}
								top.location.href=baseURL;
							});
						}
					}
			});
		});
	};
	
	examClient.nextPaper = function(){
		//关闭北工大下一页自动进入口语考试的功能
		return;
//		if(parent.schoolId=="2811000026000000221"){ //2000000026000000001
		if(parent.schoolId=="2811000026000000221"){
			$.ajax({
				type : "POST",
				data :{studentResultId :studentExamResultId, examPaperId : exampid, batchId : batchId, studentId : studentId ,isTrain:top.window.isTrain},
				async : false,
				url : "saveStudentAnswer.json",
				success : function(data) {
				}
			});
			
			$.ajax({
				type : "POST",
				async : false,
				url : baseURL+"/home/student_index.json?getData=true&loginName="+studentId,
				success : function(data) {
					var examBatchResultList = eval(data.examBatchResultList);
					if(examBatchResultList[0]){
						top.location.href=baseURL+"/examPaper/toExamMain?studentResultId=" + examBatchResultList[0].id+"&isPaperSell=0";
					}else{
						top.location.href=baseURL;
					}
				}
			});
		}
	};
	
	/**
	 * 判断当前part下面的题型是不是都是一样的
	 */
	examClient.isSameQuestion = function(subExamPaperContentList){
		if(subExamPaperContentList){
			var answerTypeFlag = null;
			for(var i =0 ; i< subExamPaperContentList.length;i++){
				if(null==answerTypeFlag){
					answerTypeFlag = subExamPaperContentList[i].question.questionType.answerType;
				}else if(answerTypeFlag!=subExamPaperContentList[i].question.questionType.answerType){
					return false;
				}
			}
		}else{
			return false;
		}
		return true;
	};
	/**
	 * 判断当前part下面的题型是不是都是一样的 都是简单题 或者复合题
	 * 都是复合题返回 true
	 * 包含简单题返回 false
	 */
	examClient.isSameQuestionTypeComplex = function(subExamPaperContentList){
		if(subExamPaperContentList){
			var isComplexFlag = null;
			for(var i =0 ; i< subExamPaperContentList.length;i++){
				if(null==isComplexFlag){
					isComplexFlag = subExamPaperContentList[i].question.questionType.isComplex;
				}else if(isComplexFlag!=subExamPaperContentList[i].question.questionType.isComplex){
					return false;
				}
			}
		}else{
			return false;
		}
		return true;
	};
	
	/**
	 * 构建分页 提交按钮 工具栏  主要是区分 变化上一页，下一页 提交按钮
	 * TODO 简单实现，后面补充
	 */
	examClient.buildFunBtnToolBar = function() {
		$("#"+this.pagingBtnCtrlWrapperId).html(this.PAGINGBTN_CTRL_NEXT_HTML);
	};
	
	/**
	 * 显示下一题
	 */
	examClient.nextQuestionEvent = function(obj) {
		// part 内 分页下一页
		this.bodyContent = [];
		if(this.isSplitShowQuestion&&(this.curPartAnswerQuestionPos<this.curPartSubQuestionNum)) {
			$("div[name='exam_right-wrap']").remove();
			this.showQuestionContent();
			var questionObjs = document.getElementsByName("questionId") ,questionIds="";
			for ( var i = 0; i < questionObjs.length; i++) {
				questionIds += (","+$(questionObjs[i]).val());
			}
			//2.6版本初始化学生已经作答的试题答案
			examClient.intiAnswer2_6(questionIds);
		// 下一部分
		} else {
			parent.examleft.partNext(this.partNum+1);
		}
	};
	/**
	 * 显示上一题
	 */
	examClient.prevQuestionEvent = function(obj) {
		// part 内 分页上一页
		this.bodyContent = [];
//		alert(this.isSplitShowQuestion&&(this.curPartSubQuestionNum>=this.curPartAnswerQuestionPos)&&(this.curPartAnswerQuestionPos!=1));
		if(this.isSplitShowQuestion&&(this.curPartSubQuestionNum>=this.curPartAnswerQuestionPos)&&(this.curPartAnswerQuestionPos!=1)) {
			this.curPartAnswerQuestionPos-=2;
			this.questionNum = this.questionNumCount[this.curPartAnswerQuestionPos];
			$("div[name='exam_right-wrap']").remove();
			this.showQuestionContent();
			var questionObjs = document.getElementsByName("questionId") ,questionIds="";
			for ( var i = 0; i < questionObjs.length; i++) {
				questionIds += (","+$(questionObjs[i]).val());
			}
			//2.6版本初始化学生已经作答的试题答案
			examClient.intiAnswer2_6(questionIds);
			// 下一部分
		} else {
			//是通过上一题按钮跳转到上一题 标记为 ture2/2
			top.window.partNextFlag = true;
			top.window.partNextNum = 0;
			parent.examleft.partNext(this.partNum-1);
		}
	};
	
	/**
	 * 显示上一题
	 */
	examClient.preQuestionEvent = function() {
		// part 内 部分内上一部分  需要重新计算
		if(this.isSplitShowQuestion&&(this.curPartAnswerQuestionPos>0)) {
			
		// 下一部分
		} else {
			
		}
	};
	/**
	 * 去掉所有的html标记
	 */
	examClient.delHtmlTag = function(str) {
		str = $.trim(str);
		//str = str.replace(/ /g,"");
		str = str.replace(/&nbsp;/g,"");
		str = str.replace(/<[^>]+>/g,"");
		return str;
	};
	
	var exampid = parent.examPaperId;
	var batchId = parent.batchId;
	var studentId = parent.studentId , realName=(parent.examleft.realName&&parent.examleft.realName.length>1)?parent.examleft.realName:"A";
	var studentExamResultId = parent.studentExamResultId;
	var staticURL = parent.staticURL;
	var cndURL = parent.cndURL;
	var baseURL = parent.baseURL;
	var stuAnswerRegExp = /Question[\s]{1}[\d]{1,3}/g;
	
	/**
	 * 统计输入单词各数
	 */
	examClient.countNum = function(objID){
		var obj = document.getElementById(objID); // 写作题
		var str = obj.value.replace(/(&[n|N][b|B][s|S][p|P];|\r?\n)/g, " "); //<[^>]+>|
		str = str.replace(/('|’|-)/g, "");
		var reg = new RegExp("\\w+", "gim");
		var array = str.match(reg);
		var num = 0;
		if (array) {
			num = array.length;
		}

		var iTotal = 0;
		for ( var i = 0; i < str.length; i++) {

			var c = str.charAt(i);
			if (c.match(/[\u4e00-\u9fa5]/)) {
				iTotal++;
			}
		}
		var pqid = objID.substr(7, objID.length - 8);
		document.getElementById("wordsCount_" + pqid).innerHTML = "统计字数："+(num + iTotal);
		return num + iTotal;
	};
	//允许输入文本域输入@!@符号
	examClient.textareaonkeyup = function(objID){
		var obj = document.getElementById(objID); // 写作题
		if(obj.value.indexOf("@!@")>-1){
			obj.value = obj.value.replace("@!@","");
		}

		var emojireg = examClient.replaceEmoij(obj.value,false);
		if(emojireg.length!=obj.value.length){
			obj.value = emojireg;
		}
	};
	/**
	 * 替换emoij表情
	 */
	examClient.replaceEmoij = function(sourceStr, alert){
		var emojireg = sourceStr;
		if(undefined == emojireg) emojireg = "";
		//过滤emoij表情
		var ranges = [
		              '\udb40[\udc00-\udfff]',
		              '\ud80c[\udc00-\udfff]',
		              '\ud83c[\udc00-\udfff]',
		              '\ud83c[\udf00-\udfff]',
		              '\ud83e[\udd00-\udfff]',
		              '\ud83d[\udc00-\ude4f]', 
		              '\ud83d[\ude80-\udeff]'
		          ];
		emojireg = emojireg .replace(new RegExp(ranges.join('|'), 'g'), '');
		if(emojireg.length!=sourceStr.length){
			if(alert){
				top.topAlert("提示","存在不支持的字符，请删除","确定",function(){});
			}
			try{
				console.log("替换前\t"+sourceStr);
				console.log("替换后\t"+emojireg);
				for(var i = 0 ;emojireg.length> i; i++){
					console.log( "原："+emojireg[i] + " \t=码： " + emojireg[i].charCodeAt(0).toString(16));
				}
			} catch(e) {}
		}
		return emojireg
	}
	/*
	 * 保存答案(单选题保存答案直接调用)
	 */
	examClient.subAnswer = function(qid, name, type) {
		if (typeof qid == "object") {
			var obj = qid;
			qid = $(obj).attr("data");
			name = $(obj).attr("name");
		}
		var objs = document.getElementsByName(name);

		var values = "";
		for ( var i = 0; i < objs.length; i++) {
			var xx = 1;
			if (objs[i].type == "radio" || objs[i].type == "checkbox") {
				if (!objs[i].checked) {
					xx = 0;
				}
			}
			if (xx == 1) {
				if (type == "selectWord") {
					var temp_value = "";
					if (objs[i].value.trim().length == 0) {
						temp_value = $(objs[i]).attr("defValue") + "_|_";
					} else {
						temp_value = objs[i].value + "@!@";
					}

					for ( var j = 0; j < select.length; j++) {
						if (objs[i].value.toUpperCase() == select[j].toUpperCase()) {
							temp_value = answerSelect[j] + "@!@";
							break;
						}
					}
					values += temp_value;
				} else {
					try {
						var buildBankValue = objs[i].value;
						buildBankValue =$.trim(buildBankValue);
						if( buildBankValue.length == 1 && examClient.thmlontent[qid]  ){
							buildBankValue = buildBankValue.toUpperCase();
							var buildBankObj = $("#buildBank_"+buildBankValue);
							if(buildBankObj&&buildBankObj.attr("attrbu")){
								values += $.trim(buildBankObj.attr("attrbu")) + "@!@";
							} else {
								values += objs[i].value + "@!@";
							}
						} else {
							values += objs[i].value + "@!@";
						}
					} catch(e) {
						values += objs[i].value + "@!@";
					}
				}
			}
		}
		if (!qid || qid == "undefined") {
			return;
		}
	    //去掉最后的@!@符号
		if(values.length > 0) {
			values = values.substring(0, values.length-3);
		}
		//替换未作答的题为空
		values = values.replace(stuAnswerRegExp, "");
		if(values == "" && "mcq"!=type) {	//"mcq"!=type 判断是多选题允许保存""
			return false;
		}
		//过滤特殊字符
		values = examClient.replaceEmoij(values,true);
		parent.subAnswerFlag = false;
		if("1"==paperView){
			return false;
		}
		$.ajax({
			url : "preSaveStudentAnswer.json?loginName="+studentId,// 要访问的后台地址
			type : "post",// 使用post方法访问后台
			async : true,
			data : {
				questionId : qid,
				questionValue : values,
				examPaperId : exampid,
				batchId : batchId,
				studentId : studentId,
				studentExamResultId : studentExamResultId

			},// 要发送的数据
			success : function(data) { // msg为返回的数据，在这里做数据绑定
				if( data != null && data.success==false){
					parent.topAlertEndExam("提示",data.message,"确定",function() {
						top.location.href=baseURL;
					});
				}
				parent.subAnswerFlag = true;
			},
			error : function(xhr, status, errMsg) {
				parent.subAnswerFlag = "fail";
				top.topAlert("提示","网络异常，刷新后继续作答。","刷新",function(){
					location.reload();
				});
//				parent.topAlert("提示",'答案保存错误,点击确定后系统将自动重新载入考试客户端，载入成功后再重新答此题，如有疑问，请与监考老师联系！',"确定",function() {
//					top.location.href=baseURL;
//				});
			}
		});
		
		if($(".openright").hasClass("active")){
            $(".openright").removeClass("active").animate({"left":winWidth_rightbar-25},300);
            $(".openright-title").css({"margin-top":(winHeight_rightbar-$(".exam_right-header-con").height()-60)/2-39,"padding":"15px 0"});
        }
	};
	
	/**
	 * 富文本编辑器的答案保存方法
	 */
	examClient.subAnswerAnswerType4 = function(qid, values) {
		//过滤emoij表情
		try {
			var emojireg = examClient.replaceEmoij(values,true);
			if(emojireg.length!=values.length){
				values = emojireg;
			}
		} catch (e) {}
		
		parent.subAnswerFlag = false;
		if("1"==paperView){
			return false;
		}
		$.ajax({
			url : "preSaveStudentAnswer.json?loginName="+studentId,// 要访问的后台地址
			type : "post",// 使用post方法访问后台
			async : true,
			data : {
				questionId : qid,
				questionValue : values,
				examPaperId : exampid,
				batchId : batchId,
				studentId : studentId,
				studentExamResultId : studentExamResultId

			},// 要发送的数据
			success : function(data) { // msg为返回的数据，在这里做数据绑定
				if( data != null && data.success==false){
					parent.topAlertEndExam("提示",data.message,"确定",function() {
						top.location.href=baseURL;
					});
				}
				parent.subAnswerFlag = true;
			},
			error : function(xhr, status, errMsg) {
				parent.subAnswerFlag = "fail";
				top.topAlert("提示","网络异常，刷新后继续作答。","刷新",function(){
					location.reload();					
				});
			}
		});
	};
	
	/**
	 * 点击DIV保存答案---单选按钮
	 */
	examClient.areaSelected = function(val) {
		var arraySeleted = val.parentNode.childNodes;
		for ( var i = 0; i < arraySeleted.length; i++) {
			if (arraySeleted[i].className != "divspace") {
				arraySeleted[i].className = "answerOption";
			}
		}
		var obj = $(val).find("input[type=radio]");
		$(obj).attr("checked", true);
		examClient.subAnswer($(obj).attr("data"), $(obj).attr("name"));
		$(val).addClass("ansewerChecked");
		$(val).removeClass("answerOption");
		var attrbu = $(val).attr("attrbu");
		if(attrbu){
			attrbu = $.trim(attrbu);
		}else{
			attrbu = "";
		}
		if(examClient.clickObj){
			$(examClient.clickObj).val(attrbu);
//			examClient.clickObj.className = "input_changed";
			examClient.clickObj.className= examClient.clickObj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			examClient.clickObj = null;
		}
		if(examClient._d){
			examClient._d.close();
		}
	};
	/**
	 * 点击DIV保存答案---复选框
	 */
	examClient.areacheckbox = function(val) {
		var obj = $(val).find("input[type=checkbox]");
		if(obj.is(':checked')){
			$(obj).attr("checked", false);
		}else{
			$(obj).attr("checked", true);
		}

		var arraySeleted = val.parentNode.childNodes;
		for ( var i = 0; i < arraySeleted.length; i++) {
			if (arraySeleted[i].className != "divspace" && arraySeleted[i].nodeType == 1 ) {
				if(($(arraySeleted[i]).find("input[type=checkbox]").is(':checked'))){
					$(arraySeleted[i]).addClass("ansewerChecked");
					$(arraySeleted[i]).removeClass("answerOption");
				}else{
					$(arraySeleted[i]).removeClass("ansewerChecked");
					$(arraySeleted[i]).addClass("answerOption");
				}
			}
		}
		examClient.subAnswer($(obj).attr("data"), $(obj).attr("name"),"mcq");
		var attrbu = $(val).attr("attrbu");
		if(attrbu){
			attrbu = $.trim(attrbu);
		}else{
			attrbu = "";
		}
		if(examClient.clickObj){
			$(examClient.clickObj).val(attrbu);
			examClient.clickObj.className= examClient.clickObj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			examClient.clickObj = null;
		}
		if(examClient._d){
			examClient._d.close();
		}
	};
	
	/**
	 * 初始化学生已经作答的试题答案
	 */
	examClient.initAnswer = function(qid, qname, qtype) {
		if("1"==paperView){
			return false;
		}
	    try {
	        $.post("getStudentAnswer.json", {
	            questionId: qid,
	            batchId : batchId,
	            examPaperId : exampid,
				studentId : studentId
	        }, function (data) {
	            var data1 = data;
	            if (data1.done == "no") {
	                return;
	            }
	            if(!data1.answer) {
	            	return;
	            }
	            var ans = data1.answer.split("@!@");
	            var objs = document.getElementsByName(qname);
	            for (var i = 0; i < objs.length; i++) {
	                if (qtype == "0" || qtype == "1" || qtype == "9") { //单选题和多选题初始化页面答案
	                    for (var ii = 0; ii < ans.length; ii++) {
	                        if (objs[i].value == ans[ii]) {
	                            objs[i].checked = true;
	                            objs[i].parentNode.parentNode.className = "ansewerChecked";
	                        }
	                    }
	                    examClient.checkClozetests();
	                }else { //挖空、作文
	                    objs[i].value = ans[i];
	                    if (objs[i].type == "text") {//挖空题
	                        examClient.aw_length(objs[i]);
	                        examClient.changeInputCss(objs[i]);
	                    }
	                    if(objs[i].type == "textarea") {
	                    	try {examClient.countNum(objs[i].id);} catch(e){}
	                    }
	                }
	            }
	            if(qtype == "6"){//格式化改错题学生答案
	            	try{
	            		formatAnswer6(qid, qname);
	            	}catch (e) {
	            	}
	            }
	        });
	    } catch (e) {
	        top.sysAlert(e.showMessage);
	    }
	};
	/**
	 * 2.6版本初始化学生已经作答的试题答案
	 */
	examClient.intiAnswer2_6 = function(questionIds) {
		if("1"==paperView){
			return false;
		}
		if(!questionIds || questionIds.length == 0){
			return;
		}
		questionIds = questionIds.substr(1);
	    try {
	        $.post("getStudentAnswer.json", {
	            questionId: questionIds,
	            batchId : batchId,
	            examPaperId : exampid,
				studentId : studentId
	        }, function (data) {
	        	
	        	var questionObjs = document.getElementsByName("questionId");
	        	for ( var j = 0; j < questionObjs.length; j++) {
	        		var qid=$(questionObjs[j]).val(), qname = $(questionObjs[j]).attr("answername"), qtype=$(questionObjs[j]).attr("answertype");
		            var data1 = data;
		            if (data1.done == "no") {
		                continue;
		            }
		            if(!data1.answerMap || !data1.answerMap[qid]) {
		            	continue;
		            }
		            data1.answer = data1.answerMap[qid];
		            var ans = data1.answer.split("@!@");
		            var objs = document.getElementsByName(qname);
		            for (var i = 0; i < objs.length; i++) {
		                if (qtype == "0" || qtype == "1" || qtype == "9") { //单选题和多选题初始化页面答案
		                    for (var ii = 0; ii < ans.length; ii++) {
		                        if (objs[i].value == ans[ii]) {
		                            objs[i].checked = true;
		                            objs[i].parentNode.parentNode.className = "ansewerChecked";
		                        }
		                    }
		                    examClient.checkClozetests();
		                }else if(qtype == "4"){
		                	examClient.ueditorInitedAnswer(qid,data1.answer);
		                }else { //挖空、作文
		                    objs[i].value = ans[i];
		                    if (objs[i].type == "text") {//挖空题
		                        examClient.aw_length(objs[i]);
		                        examClient.changeInputCss(objs[i]);
		                    }
		                    if(objs[i].type == "textarea") {
		                    	try {examClient.countNum(objs[i].id);} catch(e){}
		                    }
		                }
		            }
		            if(qtype == "6"){//格式化改错题学生答案
		            	try{
		            		formatAnswer6(qid, qname);
		            	}catch (e) {
		            	}
		            }
	        	}
	        });
	    } catch (e) {
	        top.sysAlert(e.showMessage);
	    }
	};
	
	/**
	 * 富文本编辑器题目渲染答案
	 */
	examClient.ueditorInitedAnswer = function(qid,answer){
		examClient.ueJson[qid].ready(function() {
			examClient.ueJson[qid].setContent(answer, false);
	    });
	}
	
	examClient.aw_length = function(obj)
	{
	  	if(obj.offsetWidth<500){
	 	 	obj.style.overflowX="visible";
	  		obj.style.width = 152;
	  	}
	  	if(obj.offsetWidth>500){
	  		obj.inputLength = obj.value.length; 
			obj.style.overflowX="hidden";
			obj.style.width = "500px";
		}
		if(obj.style.width == "500px"){
			if(obj.inputLength){
				if(obj.inputLength>obj.value.length){
					obj.style.overflowX="visible";
					obj.style.width = 152;
				}
			}
		}
	};
	examClient.changeInputCss = function(obj){
		if($(obj).attr("defValue")!=null)
		{

			var defV=$(obj).attr("defValue");
			var v=obj.value;
			if(defV==v||v=="")
			{	
				obj.value = defV;
//				alert(obj.className);
				obj.className= obj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_default";
			}else{
				obj.className= obj.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
			}
		}
	};
	
	//选词填空答案回填
	examClient.checkClozetests = function(){
		$("tr[class='ansewerChecked']").each(function() {
			var answerOptionId = $(this).attr("id");
			if(answerOptionId){
				var gapId = answerOptionId.replace(/answerOption/ ,"gap");
				var attrbu = $(this).attr("attrbu");
				if(attrbu){
					attrbu = $.trim(attrbu);
					var obj2 = document.getElementById(gapId);
					if(obj2){
						obj2.className= obj2.className.replace(/input_changed/g , "").replace(/input_default/g , "") + " input_changed";
					}
				}else{
					attrbu = "";
				}
				$("#"+gapId).val(attrbu);
			}
		});
	};
	
	examClient.addCookie = function(name,value,expiresHours){
		var cookieString = name + "=" + escape(value);
		if(expiresHours>0){
			var date=new Date();
			date.setTime(date.getTime()+expiresHours*3600*1000);
			cookieString=cookieString+";expires="+date.toGMTString()+";path=/;";
		}
		document.cookie=cookieString;
	};

	examClient.replaceNbsp = function(title){
		title = title.replace(/&nbsp;&nbsp;/g , "&XXXX;&XXXX;");
		title = title.replace(/&nbsp; &nbsp;/g , "&XXXX;&XXXX;");
		title = title.replace(/&XXXX;&nbsp;/g , "&XXXX;&XXXX;");
		title = title.replace(/&XXXX; &nbsp;/g , "&XXXX;&XXXX;");
		title = title.replace(/&nbsp;/g , " ");
		title = title.replace(/&XXXX;/g , "&nbsp;");
		return title;
	}
	
	function winSize_isSplit(){
	    $(".exam_right-writ-answer2 table").first().children("tbody").children("tr").last().find("td").css({"border-bottom":"0"});
	    //绑定需要拖拽改变大小的元素对象
	    aswTrLength=$(".exam_right-writ-answer2").children("table").children("tbody").children("tr").length,aswTrHeight=0,aswHeight=$(".exam_right-writ-answer table").height();
	    //宽度改变
	    var rightWidth=$("#id_div_parttitle").width();
	    
		  if($(".exam_right-suo",window.parent.document).hasClass("active")){
			  $('#exam_right-container').find(".exam_right-wrap").addClass("active");
		      $(".exam_right-writ-answer").css({"left":"0","width":"968px","border-left":"1px solid #4FBE72","border-right":"1px solid #4FBE72"});
		      $(".exam_right-writ-answer2").css({"width":"963px"});
		      $("#drag").css({"left":"0","width":rightWidth});
		  }
		  else{
			  $('#exam_right-container').find(".exam_right-wrap").removeClass("active");
		      $(".exam_right-writ-answer").css({"left":"-18px","width":$(".exam_right",window.parent.document).width()-31,"border-left":"0","border-right":"0"});
		      $(".exam_right-writ-answer2").css({"width":rightWidth+19-36});
		      $("#drag").css({"left":"-19px","width":rightWidth+30});
		  }
		  $(".exam_right-writ-ask").css({"width":rightWidth-5});

		  //取3或5行或少于的高度值aswTrHeight
		  var lentId;
		  if(winHeight<700){
		      lentId=1;
		  }
		  else{
		      lentId=2;
		  }
		  aswTrHeight=0;
		  if(aswTrLength>=lentId){
		      aswTrLength=lentId;
		  }
		  for(var i=0;i<aswTrLength;i++){
		      aswTrHeight=aswTrHeight + $(".exam_right-writ-answer").find("tr").eq(i).height();
		  }

		  writHeight = winHeight - $(".exam_right-foot").height() - $(".exam_right-header").height()- 4;
		  $(".exam_right-writ-ask").height(writHeight-aswTrHeight-52 - 40);
		  //超出隐藏
		  if(aswHeight>aswTrHeight){
			  aswTrHeight = winHeight - $(".exam_right-foot").height() - $(".exam_right-header").height()- 58 - $(".exam_right-header-con").height() - $(".exam_right-writ-ask").height() - $(".drag").height() - 40;
		      $(".exam_right-writ-answer2").height(aswTrHeight).css("overflow-y","auto");
		  }
		  writHeight = writHeight - $(".exam_right-header-con").height() -54;
	}

	function winSize2(){
	    $(".exam_right-writ-answer2 table").first().children("tbody").children("tr").last().find("td").css({"border-bottom":"0"});
	    //绑定需要拖拽改变大小的元素对象
	    aswTrLength=$(".exam_right-writ-answer2").children("table").children("tbody").children("tr").length,aswTrHeight=0,aswHeight=$(".exam_right-writ-answer table").height();
	    //宽度改变
	    var rightWidth=$("#id_div_parttitle").width();
	    
		  if($(".exam_right-suo",window.parent.document).hasClass("active")){
			  $('#exam_right-container').find(".exam_right-wrap").addClass("active");
		      $(".exam_right-writ-answer").css({"left":"0","width":"968px","border-left":"1px solid #4FBE72","border-right":"1px solid #4FBE72"});
		      $(".exam_right-writ-answer2").css({"width":"963px"});
		      $("#drag").css({"left":"0","width":rightWidth});
		  }
		  else{
			  $('#exam_right-container').find(".exam_right-wrap").removeClass("active");
		      $(".exam_right-writ-answer").css({"left":"-18px","width":$(".exam_right",window.parent.document).width()-31,"border-left":"0","border-right":"0"});
		      $(".exam_right-writ-answer2").css({"width":rightWidth+19-36});
		      $("#drag").css({"left":"-19px","width":rightWidth+30});
		  }
		  $(".exam_right-writ-ask").css({"width":rightWidth-5});

		  //取3或5行或少于的高度值aswTrHeight
		  var lentId;
		  if(winHeight<700){
		      lentId=1;
		  }
		  else{
		      lentId=2;
		  }
		  aswTrHeight=0;
		  if(aswTrLength>=lentId){
		      aswTrLength=lentId;
		  }
		  for(var i=0;i<aswTrLength;i++){
		      aswTrHeight=aswTrHeight + $(".exam_right-writ-answer").find("tr").eq(i).height();
		  }
		  writHeight = winHeight - $(".exam_right-foot").height() - $(".exam_right-header").height()- 4 ;
		  $(".exam_right-writ-ask").height(writHeight-aswTrHeight-52 - $(".exam_right-header-con").height() - 40);
		  //超出隐藏
		  if(aswHeight>aswTrHeight){
			  aswTrHeight = winHeight - $(".exam_right-foot").height() - $(".exam_right-header").height()- 58 - $(".exam_right-header-con").height() - $(".exam_right-writ-ask").height() - $(".drag").height() - 40;
		      $(".exam_right-writ-answer2").height(aswTrHeight).css("overflow-y","auto");
		  }
		  writHeight = writHeight - $(".exam_right-header-con").height() -54;
	}

	/**
	 * 网页禁止选取禁止复制禁止右键JS代码
	 */
	document.oncontextmenu=function(){return true;};
	document.ondragstart=function(){return true;};
	document.onselectstart =function(){return true;};
	document.onselect=function(){document.selection.empty();};
	document.oncopy=function(){document.selection.empty();};
	document.onpaste=function(){return true;};
	document.onbeforecopy=function(){return true;};
	document.ontouchmove = function(e){ e.preventDefault();};
	function clickStop(oEvent){//屏蔽鼠标右键
		return true;
	}
	document.oncontextmenu=clickStop;

	function noPaste(){//屏蔽   Ctrl+V
		if((event.ctrlKey)&&(event.keyCode==86)){
			event.keyCode=0;
			event.returnValue=true;
		}
	};
	document.onkeydown=noPaste;
	if(navigator.userAgent.indexOf('MSIE')<0){
		//此段代码用于Mozilla和Webkit内核浏览器
		var css=document.createElement('style');
		css.type='text/css';
		css.innerHTML='body{-moz-user-select:none;-webkit-user-select:none;}';
		document.getElementsByTagName('head')[0].appendChild(css);
	}
	//阻止事件冒泡并且阻止默认事件
	function preventDefault(e){
		try{
			e.stopPropagation();	
			e.preventDefault();
		}catch(x){
			e.cancelBubble=true;	
			e.returnValue=false;
		}
		return false;
	}
	document.onkeyup=document.onselectstart=document.ondragstart=document.oncontextmenu=document.oncopy=function(){
		//屏蔽以下事件：松开键盘/开始选择/开始拖动/点击鼠标右键/复制/按下鼠标键
		return preventDefault(window.event||arguments[0]);
	};
	document.onkeydown=function(){
		var e=window.event||arguments[0];
		var c=e.keyCode||e.which;
		if(c==16||c==17||c==18){
			//屏蔽shift/ctrl/alt键
			return preventDefault(e);
		}
	};