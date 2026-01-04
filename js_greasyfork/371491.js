// ==UserScript==
// @name         联合惩戒
// @namespace    https://wfgxic.com/
// @version      0.0.9
// @description  联合惩戒插件
// @author       潍坊高新信建
// @include      *://10.88.52.22:8080/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371491/%E8%81%94%E5%90%88%E6%83%A9%E6%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/371491/%E8%81%94%E5%90%88%E6%83%A9%E6%88%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var myInterval ;
	$(document).on("click",".close-btn",function(){
	  $('.overlay,.check-tip').fadeOut(200);
	  setTimeout(function(){
		console.log('关弹窗继续检测')
		if ($(".overlay").is(":hidden")) {
		  //$('#listenStatus').html('联合惩戒已启动').css('color','#d2f77a')
		  iframeOnloadEvent(1, document);
		}
	  }, 10000)
	})

     function addModal(msg, link,value) {
      $('body').css({ 'overflow-y': 'hidden', 'height': '100%' });
      $('body').append('<div class="check-tip" style="display: none;margin: auto;position: absolute;z-index:222222;top: 0;left: 0;right: 0;bottom: 0;width: 600px;height: 500px;background: #f39631;border: 5px solid #000;text-align: center; padding: 50px;overflow-y: scroll;">' +
        '<div  class="close-btn" style="position:absolute;width:120px;height:40px;right:0;top:0;background:#000;color:red;text-align:center;font-size:20px;cursor: pointer;padding-top:5px">关闭窗口</div>' +
        '<div style="margin-bottom:30px;text-align:center;"><h1 style="padding:20px">联合惩戒检测结果</h1><a style="color:#fff;border:2px solid #fff;padding:10px 50px;text-decoration: none;" target="_blank" href="' + link + '">点击查看详情 ' + value +'</a></div>' +
        '<p style="line-height:30px">' + msg + '</p>' +
        '</div>' +
        '<div class="overlay" style="display: none;position: fixed;z-index:111111;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0, 0, 0, .6);"></div>');
    }

    function checkValue (value) {
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (reg.test(value)) {
            console.log("=====【检测符合的身份证】=====", value);
            var url="http://172.20.10.160/query?id="+value;
            GM_xmlhttpRequest({
                 method: "get",
                 url: url,
                 onload: function(res) {
                    if (res.status == 200) {
						var text = res.responseText;
						var json = JSON.parse(text);
						console.log(json);
						if (json.code === "0") {
							var msg = '';
							if (json.allLog) {
								msg = json.allLog;
							} else {
								msg = json.sxbzxrmd ? json.sxbzxrmd : '' + json.ycjyml ? '<br/>' + json.ycjyml : '';
							}
							var link = json.link || '';
							var value = json.idCardNo || '';
							addModal(msg, link, value)
							if ($(".overlay").is(":hidden")) {
								//$('#listenStatus').html('联合惩戒检测成功请及时处理，关闭弹窗10s后再次检测').css('color','#fbbc05')
								$('.overlay,.check-tip').fadeIn(200);
							}
                            clearInterval(myInterval);
						}
					}
				}
			});
		}
	}

	function getInputValue (arr) {
	  if (arr.length) {
		for (var i = 0; i < arr.length; i++) {
		  checkValue(arr[i].value);
		}
	  }
	}

	function getIframeAllInput (parentFrame) {
	  var _text = {};
	  _text.input = $(parentFrame).contents().find("input");
	  _text.textarea = $(parentFrame).contents().find("textarea");
	  getInputValue(_text.input);
	  getInputValue(_text.textarea);
	}

	/**
	 * iframe 准备监听
	 * @param {} currentIframe 当前 iframe
	 * @param {*} level 层级
	 */
	function iframeAttachReady (currentIframe, level) {
	  console.log("------------ 开始监听 ------------");
	  myInterval = setInterval(function () {
		iframeOnloadEvent(level + 1, currentIframe);
		getIframeAllInput(currentIframe);
	  }, 5000);
	}

	/**
	 * iframe dom 加载完成
	 * @param {*} currentIframe
	 * @param {*} level
	 */
	function iframeAttachEvent (currentIframe, level) {
        iframeAttachReady(currentIframe, level);
	}

	/**
	 * 获取传入级的全部子 iframe
	 * @param {number} level 需要获取 iframe 的层级，top 层为 1
	 * @param {*} parentFrame 传入的父级 iframe
	 */
	function getIframeArray (level, parentFrame) {
	  var _getArray = []; // query 的 iframe
	  var _returnArray = []; // 重组后返回的 iframe 数组
	  if (parentFrame) {
		// 有父级 iframe
		_getArray = $(parentFrame).contents().find("iframe");
		_getArray = _getArray ? _getArray : [];
	  } else {
		// 无父级 iframe
		_getArray = $(document).find("iframe");
		_getArray = _getArray ? _getArray : [];
	  }
	  console.log("第【" + level + "】级 Frame 共【" + _getArray.length + "】个");
	  if (_getArray.length) {
		for (var i = 0; i < _getArray.length; i++) {
		  _returnArray.push(_getArray[i]); // 重组
		}
	  }
	  return _returnArray;
	}

	/**
	 * 获取 iframe dom
	 * @param {*} level
	 * @param {*} parentFrame
	 */
	function iframeOnloadEvent (level, parentFrame) {
		setTimeout(function () {
		  var currentIframes = getIframeArray(level, parentFrame);
		  if (currentIframes && currentIframes.length) {
			for (var i = 0; i < currentIframes.length; i++) {
			  iframeAttachEvent(currentIframes[i], level);
			  getIframeAllInput(currentIframes[i]);
			}
		  }
		}, 0);
	}

	iframeOnloadEvent(1, document);
    // Your code here...
})();