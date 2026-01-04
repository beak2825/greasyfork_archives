// ==UserScript==
// @name         xjtu-ydc-sr
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description         xitu-ydc-sr
// @description:zh-CN   xjtu-ydc-sr
// @author       AnZhili
// @match        http://202.117.17.144/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=17.144
// @grant        none
// @license      AnZhili
// @downloadURL https://update.greasyfork.org/scripts/454674/xjtu-ydc-sr.user.js
// @updateURL https://update.greasyfork.org/scripts/454674/xjtu-ydc-sr.meta.js
// ==/UserScript==

(function() {
    try{
    document.getElementById('showWin').style.display='none';
    document.getElementById('info').style.display='none';
    }catch(e){

    }
	var yzm = false;
	var currentTime = new Date(); //本地时间
	var currentTimeStr = currentTime.toString();
	var restString = " 08:40:01 GMT+08:00";
	var targetTimeStr = currentTimeStr.substring(0, 15) + restString;
	var targetTime = new Date(targetTimeStr); //目标时间(根据今天的时间自动更新);
	console.log("targetTime:" + targetTime);
	//确定预定时间
    try{
	document.getElementById("reserve")
		.style.display = "block";}
    catch(e){
    }
	var u = window.location.href;

	//在product页面下的操作；不进行时间预判；
	if (u.includes('product')) {
		$(document)
			.click(function(e) {
				var id = e.target.id;
				if (id == "reserve") {
					document.getElementById("reserve")
						.attachEvent = ("onclick", applySeat());
				}
			});
		//创建时间控件
		var t = document.createElement("text");
		t.style.margin = "10px";
		t.style.width = "100px";
		t.style.height = "30px";
		document.body.appendChild(t);
		var xhsj = setInterval(function() {
			//循环看时间
			var time = new Date()
				.toLocaleTimeString();
			t.innerHTML = time;
		}, 1000);
	}

	//订购页面下，进行时间预判
	if (u.includes('order/show')) {

        $(document)
			.click(function(e) {
				var id = e.target.id;
				if (id == "reserve") {
					document.getElementById("reserve")
						.attachEvent = ("onclick", goonreserve());
				}
			});
		console.log("yzm");
		//创建时间控件
		t = document.createElement("text");
		t.style.margin = "10px";
		t.style.width = "100px";
		t.style.height = "30px";
		document.body.appendChild(t);
		var xhsj2 = setInterval(function() {
			//循环看时间
			var time = new Date()
				.toLocaleTimeString();
			t.innerHTML = '学校已更改验证码方式，在39分50秒左右系统会自动获取滑动验证码，请滑动验证码等到40分1秒时进行提交------现在时间为：'+time;
			var restTime = getRestTime(targetTime);
			console.log(restTime)
			//这里判断
			if (restTime < -1000) {
				//说明超过了40分1秒,人工处理提交了；
				//clearInterval(xhsj2);
                //alert('已经超过时间，请手动提交');
			} else if (-1000<restTime && restTime<1000) {
				//说明时间在00-01秒之间,这里进行提交
				//document.querySelector("#dlg > div.dialog-foot > button")
				//	.click();
                //console.log('时间在0-1秒之内')
				//clearInterval(xhsj2);
			} else if (1000<restTime && restTime<10000) {
				//时间还有5-10秒时，进行验证码处理；并判断是否验证码处理；
				if (yzm == false) {
                    goonreserve();
					//说明没验证码；
					//var img = document.querySelector("#typecode > span > img"); //应该是图片不可以跨域访问导致的问题
					//var url = downloadIamge(img.src);
					yzm = true;
				}
			}else{
            console.log('等待中...')
            }
			//继续等待
		}, 1000);
	}




	//获取时间差值
	function getRestTime(targetTime) {
		currentTime = new Date();
		var restTime = targetTime.getTime() - currentTime.getTime();
		return restTime;
	}

// 	function downloadIamge(imgsrc) { //下载图片地址和图片名
// 		let image = new Image();
// 		// 解决跨域 Canvas 污染问题
// 		image.setAttribute("crossOrigin", "anonymous");
// 		image.src = imgsrc;
// 		image.onload = function() {
// 			let canvas = document.createElement("canvas");
// 			canvas.width = image.width;
// 			canvas.height = image.height;
// 			let context = canvas.getContext("2d");
// 			context.drawImage(image, 0, 0, image.width, image.height);
// 			let baseURL = canvas.toDataURL("image/png"); //得到图片的base64编码数
// 			var webURL = baseURL.slice(22);
// 			document.querySelector("#typecode > span > img")
// 				.src = 'data:image/png;base64,' + encodeURIComponent(webURL);
// 			//console.log(encodeURIComponent(webURL))
// 			imgcode(encodeURIComponent(webURL)) //获取验证码
// 		};
// 	}


// 	function imgcode(uri) {
// 		//token
// 		//uri传进来
// 		$.ajax({
// 			type: "post",
// 			url: "http://www.bhshare.cn/imgcode/",
// 			data: {
// 				token: '7fcbcaf8c',
// 				uri: 'data:image/png;base64,' + uri,
// 				type: "online"
// 			},
// 			dataType: "json",
// 			success: function(data) {
// 				console.log(data);
// 				if (data.code > 0) {
// 					console.log(data.data);
// 					document.querySelector("#yzm")
// 						.value = data.data;
// 				} else {
// 					console.log(data.msg);
// 				}
// 			},
// 			error: function(result) {
// 				console.log(result);
// 				console.log(JSON.stringify(result));
// 				alert("系统繁忙,请稍后再试！");
// 			}

// 		});
// 	}


})();