// ==UserScript==
// @name autoCX学习通自动刷课脚本
// @namespace https://mooc1.chaoxing.com/
// @version 1.0.0
// @description autoCX是基于原生js编写的一个网页版学习通刷课脚本，其功能包括但不限于视频快进，ppt快进，章节测试快进(暂不支持自动答题)，且脚本支持后台自动刷课。
// @author undefined205
// @match https://mooc1.chaoxing.com/mycourse/studentstudy*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491461/autoCX%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491461/autoCX%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.onload = function()
{
	runJs();
};

function runJs()
{
	Timer1 = setTimeout(function()
	{	
		var fraDoc_1 = document.getElementById("iframe").contentWindow.document;
		var fraArr = fraDoc_1.getElementsByTagName("iframe");
		var t5 = calT5(fraArr.length);
		var Timer5 = setTimeout(function()
		{
			if(fraArr.length)  //如果本页含有任务点框架
			{
				fastFwd(fraArr,0);
			}else  //如果页面不含有任务点框架
			{
				document.getElementsByClassName("jb_btn jb_btn_92 fr fs14 nextChapter")[0].click();  //强制下一节
				var Timer2 = setTimeout(function()
				{
					runJs();
				},500);  //页面刷新等待
			}
		},t5);  //页面初始化加时
	},700);  //页面初始化等待(保证的最小时间)
}

function fastFwd(fraArr,crt_fra_order)  //任务点框架，当前框架序号
{
	var fraDoc_2 = fraArr[crt_fra_order].contentWindow.document;
	
	if(fraDoc_2.getElementsByTagName("video").length)  //如果为视频任务框架
	{
		var vid = fraDoc_2.getElementsByTagName("video")[0];
		vid.addEventListener("ended",function()
		{
			clearInterval(Timer6);  //停止视频自动播放
			var Timer3 = setTimeout(function()
			{
				if(vid.ended)
				{
					if(crt_fra_order == fraArr.length - 1)  //如果是最后一个任务点框架
					{
						document.getElementsByClassName("jb_btn jb_btn_92 fr fs14 nextChapter")[0].click();  //强制下一节
						var Timer2 = setTimeout(function()
						{
							runJs();
						},500);  //页面刷新等待
					}else{
						fastFwd(fraArr,crt_fra_order + 1);
					}
				}else
				{
					Timer6 = setInterval(function()
					{
						if(vid.paused)
						{
							vid.play();  //自动播放
						}	
					},100);  //视频暂停状态监听
				}			
			},1300);  //视频结束确认		
		});
		vid.muted = true;  //满足自动播放条件
		vid.play();  //自动播放
		var Timer6 = setInterval(function()
		{
			if(vid.paused)
			{
				vid.play();  //自动播放
			}	
		},100);  //视频自动播放监听
		if(vid.duration)  //视频进度条拉到结尾			
		{
			vid.currentTime = vid.duration;
		}else{
			vid.currentTime = 3600;
		}
		var Timer4 = setTimeout(function()
		{
				if(vid.previousSibling)  //如果不允许拉进度条
				{
					vid.parentNode.addEventListener("seeked", function (event) {  //禁止寻址监听
						event.stopPropagation();
					}, true);
					vid.parentNode.addEventListener("play", function (event) {  //禁止播放监听
						event.stopPropagation();
					}, true);
					if(vid.duration)
					{
						vid.currentTime = vid.duration;
					}else{
						vid.currentTime = 3600;
					}
					vid.currentTime -= 80;
					vid.play();  //自动播放
				}
		},700);  //弹窗延迟检测
	}else if(fraDoc_2.getElementById("panView"))  //如果为ppt任务框架
	{
		var fraDoc_3 = fraDoc_2.getElementById("panView").contentWindow.document;
		var ppt = fraDoc_3.getElementsByTagName("html")[0];
		var pptSta = 0x00;
		var Timer5 = setInterval(function()
		{
			ppt.scrollTop = ppt.scrollHeight;
		},100);  //强制滚动间隔
		var Timer7 = setInterval(function()
		{
			if(ppt.scrollTop - ppt.scrollHeight <= 600)  //二者实际最终差542
			{
				pptSta = (pptSta << 1) + 1;
			}else{
				pptSta = (pptSta << 1) + 0;
			}
			if(pptSta % 16 == 0x0F)  //如果连续四次都检测到ppt结束
			{
				clearInterval(Timer5);
				clearInterval(Timer7);
				if(crt_fra_order == fraArr.length - 1)  //如果是最后一个任务点框架
				{
					document.getElementsByClassName("jb_btn jb_btn_92 fr fs14 nextChapter")[0].click();  //强制下一节
					var Timer2 = setTimeout(function()
					{
						runJs();
					},500);  //页面刷新等待
				}else{
					fastFwd(fraArr,crt_fra_order + 1);
				}
			}
		},120);  //ppt结束检测
	}else if(fraDoc_2.getElementById("frame_content"))  //如果为章节检测框架
	{
		//自动答题代码待添加
		if(crt_fra_order == fraArr.length - 1)  //如果是最后一个任务点框架
		{
			document.getElementsByClassName("jb_btn jb_btn_92 fr fs14 nextChapter")[0].click();  //强制下一节
			var Timer2 = setTimeout(function()
			{
				runJs();
			},500);  //页面刷新等待
		}else{
			fastFwd(fraArr,crt_fra_order + 1);
		}
	}else  //如果框架类型不明
	{
		console.log("框架类型不明，自动跳过");
		if(crt_fra_order == fraArr.length - 1)  //如果是最后一个任务点框架
		{
			document.getElementsByClassName("jb_btn jb_btn_92 fr fs14 nextChapter")[0].click();  //强制下一节
			var Timer2 = setTimeout(function()
			{
				runJs();
			},500);  //页面刷新等待
		}else{
			fastFwd(fraArr,crt_fra_order + 1);
		}
	}
}

function calT5(fraNum)
{
	if(fraNum == 0)
	{
		return 0;
	}else if(fraNum == 1)
	{
		return 100;
	}else if(fraNum == 2)
	{
		return 600;
	}else if(fraNum == 3)
	{
		return 1100;
	}else if(fraNum >= 4 && fraNum <= 7)
	{
		return 1800;
	}else
	{
		return 2500;
	}
}