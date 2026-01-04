// ==UserScript==
// @name         videoControls
// @version      0.1
// @description  适用于资源网助手
// @author       黄盐
// @grant        none
// ==/UserScript==
function addStyle () {
	var sty=document.createElement("style");
	sty.innerText='#tip{ position: absolute; z-index: 999999;padding: 10px 15px 10px 20px; border-radius: 10px; background: white; font-size:30px; color:black;top: 50%;left: 50%; transform: translate(-50%,-50%); transition: all 500ms ease;  -webkit-font-smoothing: subpixel-antialiased; font-family: "微软雅黑"; -webkit-user-select: none;}';
	document.head.appendChild(sty);
};
function showTip (txt) {
	var ele=document.createElement("div");
	ele.id="tip";
	ele.innerText=txt;
	document.getElementById('TM_f').appendChild(ele);
	var a=setTimeout(function(){document.getElementById('TM_f').removeChild(document.getElementById('tip'));},1000);
}
function keyUp(e) {   
		var v=document.getElementsByTagName('video')[0];
       var currKey=0,e=e||event;   
       currKey=e.keyCode||e.which||e.charCode;   
       var keyName = String.fromCharCode(currKey);   
       //alert("按键码: " + currKey + " 字符: " + keyName);   
	   switch( currKey ) {
		case 32:		//空格 暂停或者播放
			if(v.paused) {
			v.play();
			showTip("▋▋");
		}else{
			v.pause();
			showTip(" ▶ ");
		}
		   break;
		case 39:	//右箭头→
		if(e.ctrlKey){
			v.currentTime += 30;
			showTip('➕ 30s');
			}else{
			v.currentTime += 5;
			showTip('➕ 5s');
			}
			break;
		case 37:	//左箭头 ←
		if(e.ctrlKey){
			v.currentTime -= 30;
			showTip('➖ 30s');
			}else{
			v.currentTime -= 5;
			showTip('➖ 5s');
			}
			break;
		case 38:	//上箭头↑
		   v.volume += 0.05;
		   //if(v.volume>1){ v.volume=1}
		   showTip('? '  +Math.ceil(v.volume/0.01)+'%');
			break;
		case 40:	//下箭头↓
		   v.volume -= 0.05;
		   //if(v.volume<0){ v.volume=0}
		   showTip('? '+Math.ceil(v.volume/0.01)+'%');
			break;		
		//按键m：静音 | 取消静音
		case 77:
			if(v.muted) {
				v.muted=false;
				showTip('?');
			} else {
				v.muted=true;
				showTip('?');
			}
			break;
		//按键x：减速播放 -0.1
		case 88:
			if (v.playbackRate > 0) {
                    v.playbackRate -= 0.1;
                    v.playbackRate = v.playbackRate.toFixed(1);
				   showTip(v.playbackRate+"?");
            }
			break;
		//按键c：减速播放 +0.1
		case 67:
			if (v.playbackRate < 16) {
                    v.playbackRate += 0.1;
                    v.playbackRate = v.playbackRate.toFixed(1);
				   showTip(v.playbackRate+"?");
                }
			break;
		//按键z ：恢复正常速度
		case 90:
            v.playbackRate = 1;
			showTip(' 1 ?');
			break;
		//按键S：画面旋转 90 度
        case 83:
			if(isNaN(v.rotate))  v.rotate=0 ;
			v.rotate += 90;			
			if (v.rotate % 360 === 0) v.rotate = 0;
			v.style.transform = "rotate(" + v.rotate + "deg)";
			showTip('➦'+v.rotate+'°');
			break;
		//按键回车，进入全屏或者退出全屏
		case 13:
			if(v.offsetWidth!=screen.width){
				if(v.requestFullscreen) {  //w3c
					v.requestFullscreen();
				} else if(v.mozRequestFullScreen) {  //firefox
					v.mozRequestFullScreen();  
				} else if(v.webkitRequestFullscreen) {  //chrome | safari
					v.webkitRequestFullscreen();  
				} else if(v.msRequestFullscreen) {  //ie11
					v.msRequestFullscreen();  
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}			
			break;
	   default:
		   break;
	   }
   }   
   document.onkeyup = keyUp; 
	addStyle();