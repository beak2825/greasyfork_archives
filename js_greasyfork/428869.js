// ==UserScript==
// @name         安阳师范学院专升本课堂作业自动完成
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  安阳师范学院专升本课堂作业自动完成，打开【课堂作业】，选择试卷后，点击自动完成按钮即可
// @author       KangNian
// @match        https://kc.jxjypt.cn/paper/start?pid=*
// @icon         https://kc.jxjypt.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428869/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E5%A0%82%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/428869/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E5%A0%82%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    //开关的CSS样式开始
    var css = `.uiswitch {
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  box-sizing: border-box;
	  -webkit-appearance: none;
	  -moz-appearance: none;
	  -ms-appearance: none;
	  -o-appearance: none;
	  appearance: none;
	  -webkit-user-select: none;
	  -moz-user-select: none;
	  -ms-user-select: none;
	  user-select: none;
	  height: 31px;
	  width: 51px;
	  position: relative;
	  border-radius: 16px;
	  cursor: pointer;
	  outline: 0;
	  z-index: 0;
	  margin: 0;
	  padding: 0;
	  border: none;
	  background-color: #e5e5e5;
	  -webkit-transition-duration: 600ms;
	  -moz-transition-duration: 600ms;
	  transition-duration: 600ms;
	  -webkit-transition-timing-function: ease-in-out;
	  -moz-transition-timing-function: ease-in-out;
	  transition-timing-function: ease-in-out;
	  -webkit-touch-callout: none;
	  -webkit-text-size-adjust: none;
	  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
	  -webkit-user-select: none;
	}
	.uiswitch::before {
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  box-sizing: border-box;
	  height: 27px;
	  width: 47px;
	  content: ' ';
	  position: absolute;
	  left: 2px;
	  top: 2px;
	  background-color: #ffffff;
	  border-radius: 16px;
	  z-index: 1;
	  -webkit-transition-duration: 300ms;
	  -moz-transition-duration: 300ms;
	  transition-duration: 300ms;
	  -webkit-transform: scale(1);
	  -moz-transform: scale(1);
	  -ms-transform: scale(1);
	  -o-transform: scale(1);
	  transform: scale(1);
	}
	.uiswitch::after {
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  box-sizing: border-box;
	  height: 27px;
	  width: 27px;
	  content: ' ';
	  position: absolute;
	  border-radius: 27px;
	  background: #ffffff;
	  z-index: 2;
	  top: 2px;
	  left: 2px;
	  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25), 0px 4px 11px 0px rgba(0, 0, 0, 0.08), -1px 3px 3px 0px rgba(0, 0, 0, 0.14);
	  -webkit-transition: -webkit-transform 300ms, width 280ms;
	  -moz-transition: -moz-transform 300ms, width 280ms;
	  transition: transform 300ms, width 280ms;
	  -webkit-transform: translate3d(0, 0, 0);
	  -moz-transform: translate3d(0, 0, 0);
	  -ms-transform: translate3d(0, 0, 0);
	  -o-transform: translate3d(0, 0, 0);
	  transform: translate3d(0, 0, 0);
	  -webkit-transition-timing-function: cubic-bezier(0.42, 0.8, 0.58, 1.2);
	  -moz-transition-timing-function: cubic-bezier(0.42, 0.8, 0.58, 1.2);
	  transition-timing-function: cubic-bezier(0.42, 0.8, 0.58, 1.2);
	}
	.uiswitch:checked {
	  background-color: #4CD964;
	  background-image: -webkit-linear-gradient(-90deg, #4CD964 0%, #4dd865 100%);
	  background-image: linear-gradient(-180deg,#4CD964 0%, #4dd865 100%);
	}
	.uiswitch:checked::after {
	  -webkit-transform: translate3d(16px, 0, 0);
	  -moz-transform: translate3d(16px, 0, 0);
	  -ms-transform: translate3d(16px, 0, 0);
	  -o-transform: translate3d(16px, 0, 0);
	  transform: translate3d(16px, 0, 0);
	  right: 18px;
	  left: inherit;
	}
	.uiswitch:active::after {
	  width: 35px;
	}
	.uiswitch:checked::before, .uiswitch:active::before {
	  -webkit-transform: scale(0);
	  -moz-transform: scale(0);
	  -ms-transform: scale(0);
	  -o-transform: scale(0);
	  transform: scale(0);
	}
	.uiswitch:disabled {
	  opacity: 0.5;
	  cursor: default;
	  -webkit-transition: none;
	  -moz-transition: none;
	  transition: none;
	}
	.uiswitch:disabled:active::before, .uiswitch:disabled:active::after, .uiswitch:disabled:checked:active::before, .uiswitch:disabled:checked::before {
	  width: 27px;
	  -webkit-transition: none;
	  -moz-transition: none;
	  transition: none;
	}
	.uiswitch:disabled:active::before {
	  height: 27px;
	  width: 41px;
	  -webkit-transform: translate3d(6px, 0, 0);
	  -moz-transform: translate3d(6px, 0, 0);
	  -ms-transform: translate3d(6px, 0, 0);
	  -o-transform: translate3d(6px, 0, 0);
	  transform: translate3d(6px, 0, 0);
	}
	.uiswitch:disabled:checked:active::before {
	  height: 27px;
	  width: 27px;
	  -webkit-transform: scale(0);
	  -moz-transform: scale(0);
	  -ms-transform: scale(0);
	  -o-transform: scale(0);
	  transform: scale(0);
	}

	.uiswitch {
	  background-color: #e5e5e5;
	}
	.uiswitch::before {
	  background-color: #ffffff;
	}
	.uiswitch::after {
	  background: #ffffff;
	}
	.uiswitch:checked {
	  background-color: #4CD964;
	  background-image: -webkit-linear-gradient(-90deg, #4CD964 0%, #4dd865 100%);
	  background-image: linear-gradient(-180deg,#4CD964 0%, #4dd865 100%);
	}

	.fields__item {
	  display: inline-block;
	  margin-right: 1.875em;
	  text-align: center;
	}

	.section {
	  margin: 2em auto;
	}

	.custom {
	  background-color: #eadcbc;
	}

	.custom::before {
	  background-color: #f7f2e5;
	}

	.custom::after {
	  background: #fff3a6;
	}

	.custom:checked {
	  background-color: #ffca3f;
	  background-image: -webkit-linear-gradient(-90deg, #ffca3f 0%, #feca40 100%);
	  background-image: linear-gradient(-180deg, #ffca3f 0%, #feca40 100%);
	}

	.my-switch {
	  border-radius: 4px;
	}

	.my-switch::before {
	  border-radius: 2px;
	}

	.my-switch::after {
	  border-radius: 1px;
	}

	.my-switch:checked {
	  background: hotpink;
	}

	.my-switch:checked::after {
	  background-color: #333;
	}`;
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			// no head yet, stick it whereever
			document.documentElement.appendChild(node);
		}
	}
    //开关的CSS样式结束

    //是否自动提交
    var isAutoSub = true

    //休眠方法
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    // 在指定位置添加DOM
    $(".ft").prepend('是否自动提交：<input type="checkbox" class="uiswitch" id="c1" checked><br><div class="btn"><a href="javascript:;" id="autoSub">自动填充答案</a></div><br>');
    //设置是否自动提交
    $("#c1").click(function () {
        if ($(this).prop("checked")) {
             //console.log("自动提交");
            isAutoSub = true;
        } else {
            //console.log("不自动提交");
            isAutoSub = false;
        }
    });
    //填充答案功能
    $("#autoSub").on("click", function () {
        //获取总数
        var sum = $(".card-count")[0].innerText.replace(/[\r\n]/g,"").trim()
        for (var i = 0; i < Number(sum.substr(sum.lastIndexOf("/")+1)); i++) {
        	var tNumber = i+1
        	var indexID = '#question_li_' + tNumber
        	//单选、多选题、判断题
        	var daAn = $('em[class="right"]',$(indexID)).text()
        	if (daAn.length == 1 || daAn == "正确" || daAn == "错误") {
        		//添加正确答案
        		$('dd[data-value="'+daAn+'"]',$('[data-orderid="' + tNumber + '"]',$(indexID))).click()
        	}else if(daAn.length > 1){	//有多个选项
        		for (var x = 0; x < daAn.length; x++) {
        			$('dd[data-value="'+ daAn[x] +'"]',$('[data-orderid="'+ tNumber +'"]',$(('#question_li_' + tNumber)))).click();
        		}
        	}
        	//简答题、填空题
        	var jiandaDA = ""
        	var jiandaDAList = $('.wenzi',$(indexID))
        	if(jiandaDAList.length > 1){	//因为简答题是俩所以大于1
        		for (var z = 0; z < jiandaDAList.length; z++) {
        		    //删除没用的东西，删除换行符、空格
        		    var temStr = jiandaDAList[z].innerText.replace(/[\r\n]/g,"").trim()
        		    if(temStr != "暂无"){
        		        jiandaDA = temStr
        		    };
        		}
        		//简答题、填空题 添加答案
        	    var textareaTem = $('[data-orderid="' + tNumber + '"]',$(indexID))
        	    $(textareaTem).val(jiandaDA)
        	    $(textareaTem).trigger("change");
        	}
        }
        //提交
        //休眠方法使用方式，延时1秒
        sleep(1 * 1000).then(() => {
            if(isAutoSub){
                //模拟点击提交按钮
                $("#btn__submit").click();
            }else{
                console.log("未启用自动提交功能")
            }
        })

    });//按钮点击事件结束

})();