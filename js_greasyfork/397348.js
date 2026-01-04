// ==UserScript==
// @name         UESTC Auto Login
// @namespace    smlW
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.1/dist/tesseract.min.js
// @version      3.0
// @description  自动识别登录验证码并且填充。
// @author       smlW
// @match        https://idas.uestc.edu.cn/authserver/login*
// @match        https://cwcx.uestc.edu.cn/WFManager/login.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397348/UESTC%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/397348/UESTC%20Auto%20Login.meta.js
// ==/UserScript==
var base ;
var InputPosition;
var autoLogin = 1;

(function() {
    'use strict';
    var url = document.domain;
   if (url.indexOf("idas") != -1 ){
      $(":button").attr("onclick","submitLoginForm(event);casLoginForm.submit()");
   }
   else if (url.indexOf("cwcx") != -1 ){
           var worker = Initialize();
           var Validation = document.getElementById("checkcodeImg");
           InputPosition = document.getElementById("chkcode1");
           base = ConversionBase(Validation);
           Validation.onload = function() {
               base = ConversionBase(Validation);
               GetCode(worker);
           }
   }

    //var value = new Array("dd425b7cefd411ea8083f9d34832ad30");
    //var a = randomNum(0,value.length-1);
    //var signInput = "<input type='hidden' name='sign' value='" + value[a] + "'/>";
    //casLoginForm.innerHTML += signInput;
    //loginButton[0].click();
    //casLoginForm.submit();
})();

function Initialize(){
    const { createWorker } = Tesseract;
    const worker = createWorker({
        logger: m => console.log(m),
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@2.1.1/dist/worker.min.js',
        //langPath: 'https://cdn.jsdelivr.net/gh/tesseract-ocr/tessdata@master/eng.traineddata',
        corePath: 'https://cdn.jsdelivr.net/gh/naptha/tesseract.js-core@2.2.0/tesseract-core.wasm.js',
    });
    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({tessedit_ocr_engine_mode:'OEM_LSTM_ONLY',tessedit_char_whitelist: '0123456789',});
        GetCode(worker);
    })();
    return worker;
}
//识别验证码
function GetCode(worker) {
    (async () => {
        const { data: { text } } = await worker.recognize(base);
        InputPosition.value = text;
        if(autoLogin){
            var a = document.getElementById("zhLogin");
            a.click();
        }
    })();
}


function AddListener(){
$("#zhLogin").click(function(){
			var uid = $("#uid").val();
			var pwd = $("#pwd").val();
			var chkcode = $("#chkcode1").val();
			var bdate = y+"-"+m+"-"+t;
			if( (uid != "") && (pwd != "") && (chkcode != "") ){

				pwd=encode64(pwd);
				$.ajax({
					type:"POST",
					url:"loginAction_doLogin.action",
					data:{uid:uid,pwd:pwd,chkcode:chkcode,bdate:bdate},
					dataType:"text",
					success:function(data,textStatus){

						//data有可能为提示：
						if(data=="ok"){

							$("#msg").css({fontSize:"14px",color:"#ADFC49"}).html("登录成功!");
							$("#zhLogin").hide("puff",{},1500,function(){

								if($.browser.msie){
									window.location.href="waitting.html";
							  	}else if($.browser.mozilla){//firefox
							  		window.location.href="waitting.html";
							  	}else if($.browser.opera){
							    	alert("opera");
							    }else if($.browser.webkit){//chrome
							    	window.location.href="waitting.html";
							    }
							});
						}else{
							if(data=="noUserid"){
								reloadCheckcode();
								$("#msg").html("工号不存在");
							}else if(data == "checkerror"){
								reloadCheckcode();
								$("#msg").html("验证码不正确");
							}else if(data=="illegal"){
								reloadCheckcode();
								$("#msg").html("用户名或密码不正确");

							}else if(data=="error"){
								reloadCheckcode();
								$("#msg").html("出现异常")

							}else if(data.split(":")[0]=="illegal"){
								reloadCheckcode();
								var times=5-data.split(":")[1];
								$("#msg").html("用户名或密码不正确，"+times+"次登陆失败用户将被锁定");
							}else if(data.split(":")[0]=="false"){
								reloadCheckcode();
								var times=data.split(":")[1];
								$("#msg").html("您的账号已被锁定，请"+times+"分钟后再次尝试");

							}
							else {
								reloadCheckcode();
								alert(data);
							}


							/*
							 * else if(data=="userviews"){
								reloadCheckcode();
								$("#msg").html("user_views语句中未找到userid/password字段");

							}
							 */
						}
					}
			});

			}else{
				alert("用户名或者密码或验证码不能为空");
			}
		});
}

//将img标签生成Base字符串
function ConversionBase(Validation) {
    var canvas = document.createElement("canvas");
    canvas.width = Validation.width;
    canvas.height = Validation.height;
    var ctx = canvas.getContext("2d");           //插入验证码
    ctx.drawImage(Validation, 0, 0, Validation.width, Validation.height);    //获取数据
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var index = OTSUAlgorithm(imgData)-5;//阈值
    for (var i = 0; i < imgData.data.length; i += 4) {
        var R = imgData.data[i]; //R(0-255)
        var G = imgData.data[i + 1]; //G(0-255)
        var B = imgData.data[i + 2]; //B(0-255)
        var Alpha = imgData.data[i + 3]; //Alpha(0-255)
        var sum = (R + G + B) / 3;
        if (sum > index) {
            imgData.data[i] = 255;
            imgData.data[i + 1] = 255;
            imgData.data[i + 2] = 255;
            imgData.data[i + 3] = Alpha;
        } else {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = Alpha;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    //var src = canvas.toDataURL("image/png");
    //var obj = document.getElementsByTagName("img");
    //obj[0].src = src;
    return canvas;
}

function OTSUAlgorithm(canvasData) {
    var m_pFstdHistogram = new Array();//表示灰度值的分布点概率
    var m_pFGrayAccu = new Array();//其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
    var m_pFGrayAve = new Array();//其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
    var m_pAverage = 0;//值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
    var m_pHistogram = new Array();//灰度直方图
    var i, j;
    var temp = 0, fMax = 0;//定义一个临时变量和一个最大类间方差的值
    var nThresh = 0;//最优阀值
    //初始化各项参数
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = 0;
        m_pFGrayAccu[i] = 0;
        m_pFGrayAve[i] = 0;
        m_pHistogram[i] = 0;
    }
    //获取图像的像素
    var pixels = canvasData.data;
    //下面统计图像的灰度分布信息
    for (i = 0; i < pixels.length; i += 4) {
        //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        var r = pixels[i];
        m_pHistogram[r]++;
    }
    //下面计算每一个灰度点在图像中出现的概率
    var size = canvasData.width * canvasData.height;
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = m_pHistogram[i] / size;
    }
    //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
    for (i = 0; i < 256; i++) {
        for (j = 0; j <= i; j++) {
            //计算m_pFGaryAccu[256]
            m_pFGrayAccu[i] += m_pFstdHistogram[j];
            //计算m_pFGrayAve[256]
            m_pFGrayAve[i] += j * m_pFstdHistogram[j];
        }
        //计算平均值
        m_pAverage += i * m_pFstdHistogram[i];
    }
    //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
    for (i = 0; i < 256; i++) {
        temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
            * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
        / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
        if (temp > fMax) {
            fMax = temp;
            nThresh = i;
        }
    }
    return nThresh
}

