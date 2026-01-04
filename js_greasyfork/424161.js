// getit
// ==UserScript==
// @name         [ythere]一起MOOC做题吧~！（2020.10.17更新)
// @name:en      [ythere]let's learning on MOOC~!
// @namespace    ythere
// @version      2020.10.17
// @description  MOOC学习伙伴
// @description:en  MOOC learning helper
// @author       ythere

// @include      *://www.cnmooc.org/*


// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/424161/%5Bythere%5D%E4%B8%80%E8%B5%B7MOOC%E5%81%9A%E9%A2%98%E5%90%A7~%EF%BC%81%EF%BC%8820201017%E6%9B%B4%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424161/%5Bythere%5D%E4%B8%80%E8%B5%B7MOOC%E5%81%9A%E9%A2%98%E5%90%A7~%EF%BC%81%EF%BC%8820201017%E6%9B%B4%E6%96%B0%29.meta.js
// ==/UserScript==
(function() {
    var test = true;
    'use strict'
    // alert('hello world');
    // Define region
    //-------------------------------------------------------------
    function addInfrastructure() {
        let style = document.createElement("style");

        style.appendChild(document.createTextNode(`
        #mywidget {
            position: relative;
            animation: mywidget_ani 2s 1;
            border-radius: 8px;
            background: transparent;
        }
        #mywidget a {
            position: absolute;
            left: -75px;
            transition: 0.3s;
            padding: 15px 30px 15px 15px;
            text-decoration: none;
            color: white !important;
            border-radius: 8px;
            font: 20px "Microsoft YaHei", SimHei, helvetica, arial, verdana, tahoma, sans-serif;
            min-width: 80px;
            text-align: right;
            white-space: nowrap;
        }
        #mywidget a:hover {
            left: -8px;
        }


        .hcwidget {
            position: relative;
            animation: mywidget_ani 2s 1;
            border-radius: 8px;
            background: transparent;
        }

        .hcwidget a {
            position: absolute;
            left: -75px;
            transition: 0.3s;
            padding: 15px 30px 15px 15px;
            text-decoration: none;
            color: white !important;
            border-radius: 8px;
            font: 20px "Microsoft YaHei", SimHei, helvetica, arial, verdana, tahoma, sans-serif;
            min-width: 80px;
            text-align: right;
            white-space: nowrap;
        }
        .hcwidget a:hover {
            left: -8px;
        }


        #vparse {
            background-color: #f44336;
        }
        .hcparse {
        	background-color: #f44336;
        }

        .test {
            background-color: #5FC074;
        }

        #myplaybutton {
            position: absolute;
            right: -8px;
            top: 14px;
            width: 0px;
            height: 0px;
            margin: 0px;
            border-width: 16px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }
        #testbutton {
            position: absolute;
            right: -8px;
            top: 14px;
            width: 0px;
            height: 0px;
            margin: 0px;
            border-width: 16px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }

        @keyframes mywidget_ani {
            0% {
                transform: rotate(0deg);
                left: 20px;
            }

            50% {
                transform: rotate(8deg);
                left: 500px;
            }

            100% {
                transform: rotate(-360deg);
                left: 0px;
            }
        }`));

        document.head.appendChild(style);
    }

	function pppp_id(input_kid) {
		return input_kid.parentElement.parentElement.parentElement.parentElement.id;
	}
    function test() {
        alert("hello");
    }

	function autoSelect() {

		console.log("开始尝试获取答案。");

		var is_init = true;
		var all_correct = false;
		var input_data =[];
		var got_answer = [];
		var output_error = [];
		var out_k = 0;
		var iter = true
		var url_get_ans = "https://" + document.domain + "/examSubmit/" + document.getElementById("courseOpenId").value + "/getExamPaper-" + examSubmitId + ".mooc?testPaperId=" + examTestPaperId + "&paperId=0&modelType=view";
		var success_flag = false;

		$.ajax({
		    type: 'POST',
		    url: url_get_ans,
		        success: function(data){
		        input_data = data;
		        success_flag = true;
		                console.log(data);
		                console.log(input_data);
		        },
		        error: function(){
		        console.log("初始网络请求失败，请重试运行脚本。");
		        },
		        async:false
		    });

		if (!input_data.examSubmit.submitContent) {
			var quizlist = document.querySelectorAll("[base_type=\"itt003\"]");
			var num = quizlist.length;
			for (var i = 0; i<num; i++) {
			    document.getElementById(quizlist[i].id).getElementsByTagName("a")[0].click();
			}
		    setTimeout(function(){document.getElementById("save_exam").click();},300);

		} else {
				var pointlist = $("practice-no clearfix");
			    var pre_submit_content = JSON.parse(input_data.examSubmit.submitContent);
			    var submit_content = [];
			    all_correct = true;
                var i;
			    for (i = 0; i< pre_submit_content.length; i++) {
			        submit_content.push(JSON.parse(pre_submit_content[i]));
			        if (submit_content[i].errorFlag == "right") {
			            if (!got_answer[i]) {
			                got_answer[i] = true;
			                console.log("第" + (i+1) +"题答案获取成功。");
			            }
			        } else {
			            all_correct = false;
			            var trans = parseInt(submit_content[i].userAnswer)+1;
			            trans.toString();
			            var pre_get = document.querySelector("[option_id=\""+submit_content[i].userAnswer+"\"] span a");
			            var aft_get = document.querySelector("[option_id=\""+trans+"\"] span a");
			            if (pre_get != null && aft_get != null) {
			            	var pre_chose = pppp_id(pre_get);
			            	var aft_chose = pppp_id(aft_get);
				            if (pre_chose == aft_chose)
				            {
				            	document.querySelector("[option_id=\""+trans+"\"] span a").click();
				           		console.log("错误题目：第" + (i+1) +"题");
				        	} else {
				        		document.getElementById(pre_chose).getElementsByTagName("a")[0].click();
				           		console.log("错误题目：第" + (i+1) +"题");
				        	}
			            } else {
				        	document.getElementById(pre_chose).getElementsByTagName("a")[0].click();
				         	console.log("错误题目：第" + (i+1) +"题");
				        }
			        }
			    }

			    if (all_correct) 
			    {	
			    	
			    	console.log("已经全选正确答案，请手动提交");
			    	alert("已经全选正确答案，请手动提交");
			    }
			    else
			    {
		    		setTimeout(function(){document.getElementById("save_exam").click();},300);
			    	console.log("已经自动暂存，请再次打开测试并运行脚本");
			    }
		}
	}

	function showError() {

		console.log("开始尝试获取答案。");

		var is_init = true;
		var all_correct = true;
		var input_data =[];
		var got_answer = [];
		var output_error = [];
		var out_k = 0;
		var iter = true
		var url_get_ans = "https://" + document.domain + "/examSubmit/" + document.getElementById("courseOpenId").value + "/getExamPaper-" + examSubmitId + ".mooc?testPaperId=" + examTestPaperId + "&paperId=0&modelType=view";
		var success_flag = false;

		$.ajax({
		    type: 'POST',
		    url: url_get_ans,
		        success: function(data){
		        input_data = data;
		        success_flag = true;
		                console.log(data);
		                console.log(input_data);
		        },
		        error: function(){
		        console.log("初始网络请求失败，请重试运行脚本。");
		        },
		        async:false
		    });

		if (!input_data.examSubmit.submitContent) {
			var quizlist = document.querySelectorAll("[base_type=\"itt003\"]");
			var num = quizlist.length;
			for (var i = 0; i<num; i++) {
				// quizlist[i].getElementsByTagName("span").click();
				// document.getElementById(now_quiz).getElementsByTagName("span").click();
				document.querySelector("[class=\"practice-no clearfix\"]").children[i].style.color = 'red';
			}
		} else {
			var pointlist = $("practice-no clearfix");
			var pre_submit_content = JSON.parse(input_data.examSubmit.submitContent);
		    var submit_content = [];
		    all_correct = true;

			for (var j = 0; j< pre_submit_content.length; j++) {
			    submit_content.push(JSON.parse(pre_submit_content[j]));
			    if (submit_content[j].errorFlag != "right") {
			      	// var now_quiz = pppp_id(document.querySelector("[option_id=\""+submit_content[j].userAnswer+"\"] span a"));
			       	all_correct = false;
					document.querySelector("[class=\"practice-no clearfix\"]").children[i].style.color = 'red';

			       	// document.getElementById(now_quiz).getElementsByTagName("span").click();
				   	// document.querySelector("[class=\"practice-no clearfix\"]").children[j].style.color = 'red';
				}			   
			}
			if (all_correct) 
			{	
			  	console.log("已经全选正确答案，请手动提交");
			   	alert('已经全选正确答案，请手动提交');
			}
		}
	}

    function tricks() {
        window.addEventListener('message', function(event) {
            if (~event.origin.indexOf('chinese-elements.com')) {
                var intervalId = window.setInterval(function() {
                    $("#aside-nav").hide();
                    window.clearInterval(intervalId)
                }, 1000 * 2);
            } else {
                return;
            }
        });
        const im = /chinese-elements.com/i;
        if (im.test(self.location.href)) {
            var intervalId = window.setInterval(function() {
                $("#aside-nav").hide();
                window.clearInterval(intervalId);
                try {
                    var frame = document.getElementById("player");
                    if (frame && frame.hasOwnProperty('contentWindow')) {
                        var iframeWindow = frame.contentWindow;
                        iframeWindow.postMessage("tricks", "*");
                    }

                } catch (e) {
                    console.log(e);
                }
            }, 1000 * 2);
        }
    }

    //-------------------------------------------------------------
    let playurl = window.location.href;
    let rArray = playurl.split('?');
    let cWeb = rArray[0];
    const vSite = /m1907.cn/i;
    //-------------------------------------------------------------

    // Little tricks
    tricks();
    if (vSite.test(cWeb)) {
        window["alert"] = function(e) {};
        return;
    }
    //------------------------------------------------------------

    //add a button to current website.
    const vWebsites = new Array();
    vWebsites[0] = /cnmooc.org/i;
    vWebsites.every((item) => {
        if (item.test(cWeb)) {
            addInfrastructure();
            var autoButton = $(`
            <div id="mywidget_1" class = "hcwidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:270px;">
                <a href="#" id="vparse">❀快乐学习<div id="myplaybutton_1"></div></a>
            </div>
            `);
            var ShowerrorButton = $(`
            <div id="mywidget_2" class = "hcwidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:350px;">
                <a href="#" class = "hcparse">❀快乐批改<div id="myplaybutton_2"></div></a>
            </div>
            `);
            $("body").append(autoButton);
            $("body").append(ShowerrorButton);	
            // $:快速查找元素
            // 向body中添加元素

            // bind onclick event

            $("#mywidget_1").click(function() {
				autoSelect();
            });
			$("#mywidget_2").click(function() {
                showError();
            });
            return false;
        }
        return true;
    });

})();

