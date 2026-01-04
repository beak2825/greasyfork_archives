// ==UserScript==
// @name         童程xuexi、tmooc脚本
// @namespace    http://tampermonkey.net/
// @version      1.4.7-beat
// @description  童程xuexi见面课挂机脚本、童程tmooc去掉视频暂停按钮脚本
// @author       zjp007
// @match        *://xuexi.tmooc.cn/*
// @match        *://code.tmooc.cn/*
// @match        *://robot.tmooc.cn/*
// @match        *://pdf.ajiatech.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420046/%E7%AB%A5%E7%A8%8Bxuexi%E3%80%81tmooc%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420046/%E7%AB%A5%E7%A8%8Bxuexi%E3%80%81tmooc%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
	var videoLocalSpeed = 1;
    'use strict';
    console.log("童程脚本")
	// 添加自定义样式到<head>标记中
	function loadStyle(css) {
	  var style = document.createElement('style');
	  style.type = 'text/css';
	  style.rel = 'stylesheet';
	  style.appendChild(document.createTextNode(css));
	  var head = document.getElementsByTagName('head')[0];
	  head.appendChild(style);

   }
   //自定义样式
	function addCss(){
		// 自定义倍速样式
		var css = '.add-speed-entry{font-size:inherit;'
			  + 'color:inherit;line-height:inherit;background:transparent;'
			  + 'outline:none;width:100%;border:none;text-align:center;}';
		css += '.add-speed-entry[type=number]{-moz-appearance:textfield;user-select:initial;'
			+'touch-action:manipulation;-webkit-appearance:none;text-decoration:none;overflow:visible;'
			+'}';
		css += 'input::-webkit-outer-spin-button,'
				+'input::-webkit-inner-spin-button{'
				+'-webkit-appearance: none !important;'
				+'margin: 0;}'
		css += '.removeLi{position:absolute;right:8px}';
		css += '.removeLi:hover{color:red;}';
        // 去暂停按钮
        css += '#replaybtn{display:none !important;}';
        // 去水印
        css += 'div.jw-marquee.jw-marquee-extension{display:none !important;}';
		// 显示当前课次样式
		css += '.video-cont h2{display:inline-block;}';
		css += '.lesson{position: relative;display: inline-block;float: right;font-weight: bold;right: 20%;}';
		// 倍速模式
		css += '.switch-wrap input[type=checkbox]{height: 0px;width: 0px;visibility: hidden;margin:0;padding:0;}';
		css += '.switch-wrap label{display: inline-block;width: 52px;height: 32px;border: 1px solid #DFDFDF;outline: none;border-radius: 16px;box-sizing: border-box;background: #FFFFFF;cursor: pointer;transition: border-color .3s,background-color .3s;vertical-align: middle;position: relative;}';
		css += '.switch-wrap label::before {content: "";position: absolute;top: 0;left: 0;transition: transform 0.3s;width: 30px;height: 30px;border-radius: 50%;box-shadow: 0 1px 3px rgba(0,0,0,0.4);background-color: #fff;}';
		css += '.switch-wrap input:checked + label {background: #33DB70;}';
		css += '.switch-wrap input:checked + label:before {transform: translateX(20px);}';
		css += '.video-list-box h2,.switch-wrap{display:inline-block;}';
		css += '.video-list-box h2{width: 80%;}';
	   loadStyle(css)
	}
	// 隐藏TTS阶段考试的答案和解析
	function addCssFortts(){
		var css = 'input[type="radio"]{display:none !important;}';
		css += 'input[type="checkbox"]{display:none !important;}';
		css += 'div.exam_result{display:none !important;}';
		// 试题代码格式
		css += 'xmp{line-height: 1.4em;'
			 + 'width: 98%;'
			 + 'padding: 5px;'
			 + 'font-size: 110%;'
			 + 'font-family: Menlo,Monaco,Consolas,"Andale Mono","lucida console","Courier New",monospace;'
			 + 'white-space: pre-wrap;'
			 + 'word-break: break-all;'
			 + 'word-wrap: break-word;}'
	   loadStyle(css)
	}
	// 复制下载连接样式
	function aDownloadCss(){
		var css = '.copyDiv{position: fixed;right: 10px;bottom: 120px;'
				+'width: 54px;background: white;border-radius: 4px;'
				+'overflow: hidden;}';
		css += '.copyDiv:hover{background: #1a8bc0;}';
		css += '.copyDiv a{font-size: 16px;display: inline-block;'
			+ 'width: 54px;height: 54px;text-align: center;'
			+ 'line-height: 54px;}';
		css += '.copyDiv a:hover{color: white}';
        css += '#top1{margin: 0px 220px !important}'
        css += '.catalogDiv{'
            + 'background: #2cccc6;'
			+ 'border-radius: 30px;'
            + 'position: fixed;'
            + 'left: -218px;'
            + 'top: 170px;'
            + 'padding: 18px 5px;'
			+ 'height: 12%;transition: left 0.6s ease;'
            + '}'
			+ '.catalogDiv:hover{left: 0px;transition: left 0.6s ease;}';
		css += 'input.search{height: 36px;'
			+ 'padding: 0 10px;'
			+ 'border: 1px solid #d6d6d6;'
			+ 'line-height: 36px;'
			+ 'font-size: 14px;}'
			+ 'button.srchBtn{height: 37px;}'
		loadStyle(css);
	}
	// 更改TTS考试标题
	function changeTtsTitleName(){
		var titleTxt = $("title").text();
        titleTxt = titleTxt.substring(titleTxt.indexOf("Level")) + " 考试";
        $("#exam_title").text(titleTxt);
	}
	// TTS问题加上括号
	function changeQuestionTitle(){
		var questionDomArr = $("div.question xmp");
		for(var i = 0;i<questionDomArr.length;i++){
			var questionTxt = $(questionDomArr[i]).text();
			$(questionDomArr[i]).text(questionTxt + " (  ) ");
		}
	}
	// 打印答案到控制台上
	function printTTSAnswer(){
		var answerDomArr = $("div.exam_result");
		for(var i = 0;i<answerDomArr.length;i++){
			var count = "";
			var answerDom = $($(answerDomArr[i]).find("p")[0]);
			var answerTxt = answerDom.text();
			if(answerTxt == "" || answerTxt == '' || answerTxt == null)
			{
				$(answerDomArr[i]).remove();
				continue;
			}
			if (i<9){
				count += "0" + (i+1);
			}else{
				count += (i+1);
			}
			// 答案格式["正确答案：A"]
			answerTxt = count + " : " + answerTxt.substring(5) + "\n";
			$(answerDomArr[i]).text(answerTxt);
		}
		console.log(answerDomArr.text())
	}
	// 获取所有下载资料的链接
	function getDownloadStr(){
		var downloadStr = "";
		// 所有a标签
		var aSumList = $("a.class-enter");
		// 存储下载资料的a标签
		var aDownloadList = [];
		for(var i = 0;i<aSumList.length;i++){
			var aHref = $(aSumList[i]).attr('href');
			if (aHref.indexOf('html') < 0){
				aDownloadList.push(aSumList[i]);
				downloadStr += encodeURI(aHref) + "\n";
			}
			//name = aHref.substring(aHref.lastIndexOf('/') + 1);
		}
        console.log(aDownloadList);
		return downloadStr;
	}
    // 获取所有下载资料的链接
    function getDownloadList(){
        var downloadList = [];
        // 所有a标签
        var aSumList = $("a.class-enter");
        // 存储下载资料的a标签
        var aDownloadList = [];
        for(var i = 0;i<aSumList.length;i++){
            var aHref = $(aSumList[i]).attr('href');
            if (aHref.indexOf('html') < 0){
                aDownloadList.push(aSumList[i]);
                downloadList.push(encodeURI(aHref));
            }
        }
        return downloadList;
    }
    function downFiles(wordArr){
        wordArr.forEach(function(item,index){
            // 拼接成后端定义好的单个文件的下载的路径（根据实际情况）
            var path = item
            if (!(path.indexOf('.zip') || path.indexOf('.rar') || path.indexOf('.7z'))){
                return true;
            }
            //使用了闭包，返回的函数能够使用外部的path
            var timer1 = setTimeout(function(path){
                return function(){
                    //定义一个看不见的iframe
                    var iframe =$("<iframe class='downloadIfream' src='"+path+"' style='height:0;display:none'></iframe>")
                    $("body").append(iframe)
                    var timer2 = setTimeout(function(){
                        iframe.remove()
                        clearTimeout(timer2)
                    },5000)  //这个就根据实际情况定义一下延时删除添加的iframe,不删除也问题不大
                    clearTimeout(timer1)
                }
            }(path), 1000 * index)  //每隔1s插入一个iframe
            })
    }
	function printDownloadHref(){
		// 参考元素class名
		var domClassName = ".footer";
		waitElement(domClassName).then(function(){
			var btnStr = '<button id="copyBtn">复制下载连接</button>';
            var downStr = '<button id="downBtn">全部下载</button>';
			$(domClassName).prepend(btnStr);
            $(domClassName).append(downStr);
			$("#copyBtn").on('click', function(){
				var downloadStr = getDownloadStr();
				copyText(downloadStr);
				alert("复制下载链接成功");
			});
            $("#downBtn").on('click', function(){
				var wordArr = getDownloadList();
                downFiles(wordArr);
			});
		});
		var bottomDomStr = ".fixed-box-x";
		waitElement(bottomDomStr).then(function(){
			var btnStr = '<div class="copyDiv">'
					+'<a href="#copyBtn">END</a>'
					+'</div>';
			$(bottomDomStr).before(btnStr);
		});
	}
	// 给课程a标记添加当前课次
	function addAHref(){
		var Lessons = $(".class-video-cont");
		/*if (Lessons.length <= 0){
			Lessons = $($("div.stage.jiqiren")[0]).find("li");
		}*/
		for (var i = 0;i<Lessons.length;i++){
			var liDom = $(Lessons[i]);
			var leftA = liDom.find("a.class-name");
			var rightA = $(liDom.find("a.class-enter")[0]);
			var lessonTxt = leftA.text();
			var lessonHref = leftA.attr("href");
			if (lessonHref.indexOf("Lesson") >= 0){
				return
			}
			var lastHref = lessonHref + "?Lesson=" + lessonTxt;
			leftA.attr("href", lastHref);
			rightA.attr("href", lastHref);
		}
	}
	function touchSearch(){
		var KC = $("input.search").val();
			if (KC != '' && KC != undefined){
				var locationHref = window.location.href;
				if (locationHref.indexOf('#') >= 0){
					locationHref = locationHref.split('#')[0]
				}
				window.location.href = locationHref + '#' +KC;
			}
	}

    // 添加搜索
    function addCatalog(){
		$($("div.class span")[0]).remove()
        if ($("div.catalogDiv").length==0){
            var catalogHTML = '<div class="catalogDiv">'
							+'<input type="text" placeholder="请输入课时（整数）" class="search">'
							+'<button class="srchBtn">搜索</button>'
							+'</div>'
            $("#top1").append(catalogHTML)
        }
		var lessonDoms = $(".class-video li");
        for (var i = 0;i<lessonDoms.length;i++){
            if($(lessonDoms[i]).attr("id")==undefined){
                $(lessonDoms[i]).attr("id",i+1)
            }
        }
		$("button.srchBtn").on("click",function(){
			touchSearch();
		})
		$("input.search").keyup(function(e){
			if(e.keyCode == 13){
				touchSearch();
			}
		})
    }
	function changeAHref(){
		waitElement("a.class-name").then(function(){
				// 视频页面显示课次信息
				addAHref();
				// 课程库添加搜索框
				addCatalog();
			});
			$("li").on("click", function(){
				waitElement("a.class-name").then(function(){
					// 视频页面显示课次信息
					addAHref();
					// 课程库添加搜索框
					addCatalog();
				});
			})
	}
	// 视频显示当前课次（课程名称）
	function getLessons(){
		waitElement("div.video-cont").then(function(){
			var currentUrl = window.location.href;
			if (currentUrl.indexOf("Lesson") >= 0){
				var urlAndParamArr = currentUrl.split("?");
				if (urlAndParamArr.length >= 2){
					var params = urlAndParamArr[1].split("=");
					if (params.length >= 2){
						var lessonTxt = decodeURI(params[1]);
						var lessonHtml = '<h2 class="lesson">' + lessonTxt + '</h2>';
						$("div.video-cont h2").after(lessonHtml);
					}
				}
			}
		});
	}
	// 等待元素加载成功或取消的函数
	function waitElement(selector, times, interval, flag=true){
        var _times = times || -1, // 默认不限次数
            _interval = interval || 500, // 默认每次间隔500毫秒
            _selector = selector, //选择器
            _iIntervalID,
            _flag = flag; //定时器id
        return new Promise(function(resolve, reject){
            _iIntervalID = setInterval(function() {
                if(!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                    reject();
                }
                _times <= 0 || _times--; //如果是正数就 --
                var _self = $(_selector); //再次选择
                if( (_flag && _self.length) || (!_flag && !_self.length) ) { //判断是否取到
                    clearInterval(_iIntervalID);
                    resolve(_iIntervalID);
                }
            }, _interval);
        });
    }
	// 复制文本到剪切板
	function copyText(text) {
        //var textarea = document.createElement("input");//创建input对象
		var textarea = document.createElement("textarea");//创建input对象
        var currentFocus = document.activeElement;//当前获得焦点的元素
        document.body.appendChild(textarea);//添加元素
        textarea.value = text;
        textarea.focus();
        if(textarea.setSelectionRange)
            textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
        else
            textarea.select();
        try {
            var flag = document.execCommand("copy");//执行复制
        } catch(eo) {
            var flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus();
        return flag;
    }
	// 获取cookie值
	function getCookie(name) {
		var prefix = name + "="
		var start = document.cookie.indexOf(prefix)
		if (start == -1) {
			return null;
		}
		var end = document.cookie.indexOf(";", start + prefix.length)
		if (end == -1) {
			end = document.cookie.length;
		}
		var value = document.cookie.substring(start + prefix.length, end)
		return unescape(value);
	}
	// 将字符串分隔为数组
	function splitStrToArray(str, splitStr){
		var returnArray = [];
		if (str != undefined && str != null && str != ''){
			returnArray = str.split(splitStr);
		}
		return returnArray
	}
	// 根据浏览器存储的值初始化倍速按钮
	function initSpeedBtn(ulDom){
		// 登录用户名
		var cookieName = getCookie("loginName");
		// 获取存储的倍数值
		var speedStorge = localStorage.getItem(cookieName);
		var userSpeedArry = splitStrToArray(speedStorge, ",");
		if (userSpeedArry != null && userSpeedArry != '' ){
			for (var m = userSpeedArry.length-1;m >=0;m--){
				ulDom.prepend('<li data-sp="' + userSpeedArry[m] + '" class="" >' + userSpeedArry[m] + '倍<i class="removeLi">×</i></li>')
			}
		}else{
			ulDom.prepend('<li data-sp="2.5" class="" >2.5倍<i class="removeLi">×</i></li>')
			ulDom.prepend('<li data-sp="3" class="" >3倍<i class="removeLi">×</i></li>')
		}
	}
	// 初始化video播放速度
	function initVideoSpeed(){
		// 等待视频video加载完成后进行设置倍速
		waitElement("video").then(function(){
			if(! $("#switch").is(":checked")){
				// 缓冲时间
				var count = 5;
				var initVideoSpeedFlag = setInterval (function(){
					var currentSpeed = $("video")[0].playbackRate;
					var videoStorge = 1;
					$("video")[0].playbackRate=1;
					// 设置视频倍速
					$("video")[0].playbackRate=videoStorge;
					// 设置显示当前倍速
					var speedLi =$("ul").find('li[data-sp="' + videoStorge +'"]');
					$("ul.ccH5spul li").removeClass("selected");
					speedLi.addClass("selected");
					var speedText = speedLi.text();
					if(speedText.indexOf("×") > -1){
						speedText = speedText.substring(0,speedText.length-1);
					}
					$("span.ccH5sp").text(speedText)
					if (currentSpeed == videoStorge){
						count--;
						if (count<=0){
							clearInterval(initVideoSpeedFlag);
						}
					}
				},1000);
			}else{
				// 缓冲时间
				var count = 5;
				var initVideoSpeedFlag = setInterval (function(){
					// 获取存储的倍数值
					var videoStorge = Number(localStorage.getItem("codeVideoSpeed"));
					var currentSpeed = $("video")[0].playbackRate;
					// console.log("videoStorge : " + videoStorge)
					// console.log("currentSpeed : " + currentSpeed)
					if (videoStorge != null && videoStorge != ''){
						// 设置视频倍速
						$("video")[0].playbackRate=videoStorge;
						// 设置显示当前倍速
						var speedLi =$("ul").find('li[data-sp="' + videoStorge +'"]');
						$("ul.ccH5spul li").removeClass("selected");
						speedLi.addClass("selected");
						var speedText = speedLi.text();
						if(speedText.indexOf("×") > -1){
							speedText = speedText.substring(0,speedText.length-1);
						}
						$("span.ccH5sp").text(speedText)
					}else{
						$("video")[0].playbackRate=1;
					}
					if (currentSpeed == videoStorge){
						count--;
						if (count<=0){
							clearInterval(initVideoSpeedFlag);
						}
					}
				},1000);
			}
		})
	}
	// 存储倍速到
	function saveSpeedStorge(){
		// 登录用户名
		var cookieName = getCookie("loginName");
		var data = "";
		var liArray = $("ul.ccH5spul li");
		if(liArray.length > 0){
			var liLength = liArray.length;
			var count = 1;
			while (liLength > 6){
				var li = $(liArray[count]);
				data += li.attr("data-sp") + ",";
				count++;
				liLength--;
			}
		}
		data = data.substring(0,data.length-1)
		localStorage.setItem(cookieName,data)
	}
    // 点击继续学习方法
    function clickStudyBtn(){
        var timeFlag = setInterval (function(){
            //var dvWarningView = document.getElementById("dvWarningView");
            var dvWarningView = $("#dvWarningView");
            if(dvWarningView != null && $(dvWarningView).find("input") != null){
				// 点击继续学习
                // dvWarningView.find("input").click();
                $("#reStartStudy").click();
                $("#reStartStudy").mousedown();
                $("#reStartStudy").mouseup();
            }
        },5000);
    }
    // 去除不能复制粘贴限制
    function removeCannotPaste(){
        var count = 6;
        var timeFlag = setInterval (function(){
            // 压缩的js脚本，去除网页限制
			(function(c){function e(a){var b=a.document,f=a.jQuery,g=function(a){h.forEach(function(b){a["on"+b]=null;f&&f(a).unbind(b);try{/frame/i.test(a.tagName)&&e(a.contentWindow)}catch(c){}})};[a,b].forEach(g);a=0;for(var b=b.all,c=b.length;a<c;a++){var d=b[a];d&&1===d.nodeType&&g(d)}}var h="contextmenu dragstart mouseup copy beforecopy selectstart select keydown".split(" ");e(c)})(window);
            count--;
			if (count <= 0){
				clearInterval(timeFlag);
			}
		},1500);
    }
	// 添加高倍速选择,有延时
	function addVideoSpeed(){
		var timeFlag = setInterval (function(){
			// 部分视频不会重新加载整个页面，需要进行判断
			// 已经添加自定义倍速的页面，不再进行添加
			var liArray = $("ul.ccH5spul li");
			if (liArray.length <= 5){
				var ulDom = $("ul.ccH5spul");
				initSpeedBtn(ulDom);
				var mySelf = '<li id="speeedLi" class="" >'+
						'<i class="addIDom" style="display: inline; onmouseover">+</i>' +
						'<input id="addSpeedInput" class="add-speed-entry" type="number" max="16" step="0.5" title="增加新的倍数值" min="3.5" style="display: none;"></li>';
				ulDom.prepend(mySelf);
				// 元素事件绑定
				eventBind();
				console.log("speed add");
			}
			if (liArray.length > 5){
				clearInterval(timeFlag);
			}
		},1000);
		waitElement(".video-list-box").then(function(){
			var btnStr = '<div class="switch-wrap">'
					+'<input type="checkbox" id= "switch">'
					+'<label for="switch"></label>'
					+'</div>';
			if ($("#switch").length <= 0){
				$(".video-list-box h2").after(btnStr);
			}
		});
        waitElement("video").then(function(){
            $("video").get(0).addEventListener("ended",function(){
                if($("video").width() <= 720 ){
                    return;
                }
                setTimeout(function(){
                    $(".ccH5FullsBtn").click();
                },30)
            },false);
        });
	}
	// liClickFun
	function speedBtnFun(liDom){
		$("ul.ccH5spul li").removeClass("selected")
		$(liDom).addClass("selected");
		var speedText = $(liDom).text();
		if(speedText.indexOf("×") > -1){
			speedText = speedText.substring(0,speedText.length-1);
		}
		$("span.ccH5sp").text(speedText)
		console.log($(liDom).attr("data-sp"));
		var speedStr = $(liDom).attr("data-sp");
		localStorage.setItem("codeVideoSpeed",speedStr);
		$("video")[0].playbackRate=Number(speedStr);
		// videoLocalSpeed = Number($(liDom).attr("data-sp"));
	}
	// 事件绑定
	function eventBind(){
		//高倍速按钮回车事件绑定
		$('#addSpeedInput').bind('keypress', function(event) {
			if (event.keyCode == "13") {
				event.preventDefault();
				var videoSpeed = $('#addSpeedInput').val();
				//回车执行添加倍速
				$('#addSpeedInput').parent().after('<li data-sp="' + videoSpeed + '" class="">' + videoSpeed
									+ '倍<i class="removeLi">×</i></li>');
				// 给新增的li（第二个li）添加点击事件
				$($("ul.ccH5spul li")[1]).click(function(){
						speedBtnFun(this);
				});
				// 删除自定义倍速
				var removeIbtn = $("i.removeLi");
				$(removeIbtn[0]).click(function(){
					$(this).parent().remove();
						saveSpeedStorge();
				})
				saveSpeedStorge();
			}
		});
		// 给倍速按钮添加点击事件绑定（样式切换，视频速度切换）
		var liArray = $("ul.ccH5spul li");
		if(liArray.length > 0){
			for (var i = 0;i < liArray.length;i++){
				var li = $(liArray[i]);
				if(li.attr('data-sp') != undefined){
					li.click(function(){
						speedBtnFun(this);
					});
				}
			}
		}
		// 右侧视频列表，点击后会重新加载视频元素，重新添加倍速按钮
		var rightUlArray = $("ul.video-list li");
		if (rightUlArray.length <= 0){
			// robot.tmooc.cn适配
			rightUlArray = $("#video-list li");
		}
		if(rightUlArray.length > 0){
			for (var j = 0;j < rightUlArray.length;j++){
				var rightLi = $(rightUlArray[j]);
					rightLi.click(function(){
						addVideoSpeed();
						// 初始化video播放速度
						initVideoSpeed();
					});
			}
		}
		// 给删除i标记绑定事件
		var removeIbtn = $("i.removeLi");
		if (removeIbtn != undefined && removeIbtn.length > 0){
			for (var n = 0;n < removeIbtn.length;n++){
				var removeI = $(removeIbtn[n]);
					removeI.click(function(){
						$(this).parent().remove();
						saveSpeedStorge();
					});
			}
		}
		// 加号，鼠标移入移出不生效
		var addIdom = $("i.addIDom");
		// 倍速输入框，鼠标移入移出不生效
		var speedInput = $('#addSpeedInput');
		// 添加倍速的的li
		var speeedLiDom = $("#speeedLi");
		speeedLiDom.mouseenter(function(){
            addIdom[0].style.display="none";
			speedInput[0].style.display="inline";
			speedInput.attr("autofocus",'true');
        });
        speeedLiDom.mouseleave(function(){
            addIdom[0].style.display="inline";
			speedInput[0].style.display="none";
        });
	}
	// Your code here...
	$(function(){
		// 去除不能复制粘贴限制
		removeCannotPaste();
		// 云学堂点击继续学习，每5秒点击一次
		if (window.location.href.indexOf('xuexi.tmooc.cn')>-1) {
            addCss();
			clickStudyBtn();
		}
		// 课堂视频网站（童创童创都可以），去暂停按钮，添加自定义倍速
		if (window.location.href.indexOf('code.tmooc.cn/web/kids') > -1 || window.location.href.indexOf('robot.tmooc.cn')>-1){
			addCss();
			addVideoSpeed();
			// 初始化video播放速度
			initVideoSpeed();
			// 显示当前课次
			getLessons();
		}
		// TTS阶段性考试去掉答案和解析,代码格式化，打印答案到控制台上
		if(window.location.href.indexOf('pdf.ajiatech.com/tctm/kid/QS/result/web/exam/')>-1){
			addCssFortts();
			changeTtsTitleName();
			changeQuestionTitle();
			printTTSAnswer();
		}
		if(window.location.href.indexOf('code.tmooc.cn/kidcourse/kids')>-1 || window.location.href.indexOf('robot.tmooc.cn/kidcourse/robot')>-1){
			aDownloadCss()
			// 多课件下载
			printDownloadHref()
			changeAHref();
            if(window.location.href.indexOf('robot.tmooc.cn/kidcourse/robot')>-1){
                if($("#user").text()=="胡治美"){
                    $("#user").text("胡章萌")
                }
            }
		}
	})
})();