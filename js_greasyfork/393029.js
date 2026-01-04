// ==UserScript==
// @name         xiaocao
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       justzt
// @include      http://www.baidu.com/
// @include      https://www.baidu.com/
// @include      http://www.xaaaaxpppmmmmaaaa.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://code.jquery.com/jquery-1.1.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/393029/xiaocao.user.js
// @updateURL https://update.greasyfork.org/scripts/393029/xiaocao.meta.js
// ==/UserScript==

(function() {
	var targetUrl = '0';
	function startRequest(){
		GM_xmlhttpRequest({
				method: 'POST',	
				data:"a=get18&system=android&v=2.1.1",
				url: "https://get.xunfs.com/app/listapp.php",
				dataType: "json",
				headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			onload: function(response) {
				var jsontext
				console.log(response.response);
				var jsontext=JSON.parse(response.response);
			 	targetUrl = jsontext.url1
			 	console.log(targetUrl)
			}
         });
	}
	
	// 缓存最新地址
	function saveAddress(url){
	    chrome.storage.local.set({"caoliu_url":url}, function(){
	        console.log("save caoliu data success")
	    });
	}


	// 开始
	if (targetUrl == '0') {
		startRequest();	
	}
	

	// 匹配百度关键字
    $("input[type='submit']").click(function(){
    	value=$(".s_ipt").val()
    	if(value == "xiaocao" && targetUrl != '0'){
    		var href = "http://"+targetUrl
    		$(location).attr('href', href);
    		console.log(href)
    		return false;
    	}else{
    		return true;
    	}
    });
})();