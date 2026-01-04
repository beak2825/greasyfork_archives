// ==UserScript==
// @name         智慧树挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       MoMorZ
// @match        *://online.zhihuishu.com/CreateCourse/learning/videoList?courseId*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35096/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/35096/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

//参考自开源脚本 https://greasyfork.org/scripts/28924-%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E7%A8%8B/code/%E6%99%BA%E6%85%A7%E6%A0%91%E5%88%B7%E8%AF%BE%E7%A8%8B.user.js
//非常感谢上面脚本的作者，自己也是第一次用JavaScript
//自己加了个静音和清晰度调节，重写了一遍代码，调节了下延迟
//请先保证自己浏览器能运行JS脚本，本人使用Chrome的Tampermonkey运行脚本
//请先打开视频播放界面，再点击红色播放按钮使用，弹出提示后即可自动后台运行
//如有需要请自己更改下方源码，注释都很详细，数字代表延迟，单位是毫秒，如2000则代表延迟为2秒，请根据自己实际使用情况调节
//如若视频出现卡顿则脚本稳定性会变差，所以请尽量选择网速好的时段进行刷课
//静音设置了一定延迟，所以可以还是最好自己把浏览器静音吧

var time = 0;
var father=document.getElementById("my");
var divs = document.createElement("div");
divs.id='mybutton';
divs.style.position='fixed';
divs.style.left='150px';
divs.style.top='100px';
divs.style.width='72px';
divs.style.height='72px';
divs.style.backgroundImage="url('data:image/png;base64,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')";

divs.onclick=function(){
    setTimeout(function(){
		//调节音量，默认静音，若需要音量，请注释掉下面这行语句
		console.log('音量');
        document.getElementsByClassName("volumeIcon")[0].click();
		//调节速度，默认1.5倍，若需要1.0倍，请把 "speedTab15" 改为 "speedTab05" ,若需要1.25倍，请把 "speedTab15" 改为 "speedTab10"
		console.log('速度');
		document.getElementsByClassName('speedTab15')[0].click();
		//调节清晰度，默认标清，若需要高清，请注释掉下面这行语句
		//调了清晰度暂停会出错，无语
		/*console.log('清晰度');
		document.getElementsByClassName("line1bq")[0].click();*/
    },200);

	//初始化提示
    if (time===0) alert("欢迎使用，可最小化");

    //跳题
    document.getElementById("vjs_mediaplayer_html5_api").onpause = function(){
        console.log('暂停');
        window.setInterval(function(){
			if (document.getElementById("popbox_title")){
				console.log('关闭弹窗');
				window.clearInterval();
				document.getElementsByClassName("popbtn_cancel")[0].click();
			}
		},200);
    };
    //当前视频结束，进入下一节
    document.getElementById("vjs_mediaplayer_html5_api").onended = function() {
        setTimeout(function(){
			console.log('结束');
            document.getElementById("nextBtn").click();
            setTimeout(function(){
                time = 1;
                divs.click();
            },5000);
        },2000);
    };

};
document.body.appendChild(divs);