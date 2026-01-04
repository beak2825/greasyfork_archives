// ==UserScript==
// @name         安全微伴
// @version      0.5
// @description  通过在h5上模拟点击，调用结束课程请求等方法实现自动化刷课，具有一定隐蔽性，不会被发现
// @author       九尾妖渚
// @match      *://weiban.mycourse.cn/*
// @match      https://mcwk.mycourse.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant 		 none
// @run-at       document-end
// @namespace https://greasyfork.org/users/822791
// @downloadURL https://update.greasyfork.org/scripts/433560/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/433560/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const addHistoryEvent = function(type) {
		var originalMethod = history[type];
		return function() {
			var recallMethod = originalMethod.apply(this, arguments);
			var e = new Event(type);
			e.arguments = arguments;
			window.dispatchEvent(e);
			return recallMethod;
		};
	};
	history.pushState = addHistoryEvent('pushState');
	history.replaceState = addHistoryEvent('replaceState');

	var getVal = function(fun1, fun2){
		let id = setInterval(()=>{
			var val = fun1();
			if (val.length) {
				clearInterval(id);
				fun2(val);
			}
		}, 100)
	}
	var start = function(e) {
		$(function(){
			setTimeout(()=>{
				  //console.log(window.location);
				  // 第一阶段 在主页
				  if (window.location.hash === '#/') {
					  getVal(()=>{return $("div.task-block-new")}, (res)=>{
						  //console.log(res);
						  setTimeout(()=>{
							  res[0].click();
						  }, 200);

					  })
				  }
				  // 第二阶段 在学习任务
				  var reg = /course.*projectId.*projectType.*special.*title.*/
				  if (window.location.hash.match(reg)) {
						// 先检测出还需要完成的任务
						getVal(()=>{return $("li.folder-item")},(res)=>{
							res = res.filter(function(index){
								var child = this.querySelector('.state');
								var str = child.innerHTML;
								if (str.substring(0, str.indexOf("/")) === str.substring(str.indexOf("/") + 1, str.length)) {
									return false;
								}
								return true;
							})
							//console.log(res);
							getVal(()=>{return res.find('.folder-extra a')}, (res2)=>{
								res2[0].click();
							})
						})
				  };
				  // 第三阶段 在学习任务列表
				  reg = /course.*list.*projectType.*subjectType.*categoryCode.*projectId.*categoryName.*/
				  if (window.location.hash.match(reg)) {
						getVal(()=>{return $("li.course")},(res)=>{
							res = res.filter(function(index){
								var child = this.querySelector('.course-content h3 i');
								return !child;
							})
							//console.log(res);
							if (res.length == 0) {
								getVal(()=>{return $("a.mint-tab-item.is-selected")}, (res2)=>{
									res2[0].click();
								})
							}
							else res[0].click();
					})
			  }

			  // 第四阶段 在iframe中	同域解决方法
			  /*if (window.location.hash.match(reg)) {
					getVal(()=>{return $("iframe")},(res)=>{
						res[0].contentWindow.finishWxCours();
					})

			  }		*/
			}, 1000)

		});
	}
	window.addEventListener('pushState', start);
	window.addEventListener('popstate', start);
	//console.log("脚本执行");
	// 第四阶段 此时在异域iframe中
	if (window.location.href.indexOf("mcwk.mycourse.cn/course/") != -1) {
       // console.log(window.location.href);
		$(function(){
			setTimeout(()=>{
                try{console.log(exportRoot.currentFrame)}catch(e){}
                try {
                    var userid = getQueryString("userCourseId");
                    var jiaoxuejihuaid = getQueryString("tenantCode");
                    var finishWxHost = document.referrer.replace("http://","").replace("https://","").split("/")[0];
                    if(document.referrer=="" || document.referrer==null || document.referrer==undefined){
                        finishWxHost = "weiban.mycourse.cn"
                    }

                    var webUrl = window.location.href;
                    var finishWxUrl=getRecordUrl(webUrl);
                    if(finishWxHost.indexOf("218.25.139.161") > 0){
                        //finishWxUrl = "http://"+finishWxHost+"/pharos/usercourse/finish.do";
                        finishWxUrl = "https://"+finishWxHost+"/pharos/usercourse/finish.do";
                    }

                    var finishData = {"userCourseId": userid, "tenantCode": jiaoxuejihuaid};

                    $.ajax({
                        async: false,
                        url: finishWxUrl,
                        type: "GET",
                        dataType: "jsonp",
                        data: finishData,
                        timeout: 5000,

                        success : function (data) {
                            backToList();
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                } catch (e) {
                    alert("报了啥错误" + e)
                }

			}, 10000)

		})

	}
	else if (window.location.href.indexOf("weiban.mycourse.cn/") != -1) {
        //console.log(window.location.href);
		$(function(){
			start();
		})
	}

    // Your code here...
})();