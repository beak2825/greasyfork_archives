// ==UserScript==
// @name		手机端浏览器功能扩展
// @name:en		Add additional functions to mobile browser
// @description	手机端可装插件浏览器(如Yandex,Kiwi,火狐)添加额外的功能。例如:视频双击全屏，双击快速搜索，视频快进/快退和倍速播放，单手手势操作等。(手势如：↓↑回到顶部，↑↓回到底部，→←后退，←→前进，→↓关闭标签页，→↑恢复刚关闭的页面等)
// @description:en	Add additional functions to mobile browser(Yandex,Kiwi and Firefox).For example, video double-click full screen, double-click fast search, video fast forward / backward and variable speed play, one hand gesture operation, etc
// @version		6.11.2
// @author		L.Xavier
// @namespace	https://greasyfork.org/zh-CN/users/128493
// @include		*
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_listValues
// @grant		unsafeWindow
// @grant		window.close
// @grant		GM_openInTab
// @grant		GM_addValueChangeListener
// @run-at		document-body
// @note		功能说明:1.视频重力感应横屏	2.视频双击全屏/退出全屏	3.单手手势功能	3-①.文字手势	3-②.图片手势	3-③.视频手势	4.解除页面选中限制	（功能详情请查看”脚本描述“）
// @v6.10.10		2021-05-18 - 修复滑动长按触发的定时器，在断触后无法关闭的问题。
// @v6.10.11		2021-05-19 - 修复断触时可能会被识别为点击的问题。
// @v6.11.0		2021-08-07 - 调整视频全屏样式的识别宽容度。将谷歌翻译替换为有道翻译。删除阅读模式。
// @downloadURL https://update.greasyfork.org/scripts/431020/%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431020/%E6%89%8B%E6%9C%BA%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==
(()=>{
	'use strict';
	/*手势功能数据模块*/
	let gesture={
    '◆◆':'下翻',
    '◆◆◆':'上翻',
    '→↑●':'回到顶部',
    '→↓●':'回到底部',
    '↓←':'刷新页面',
    '↓→':'关闭页面',
    '←→':'恢复页面'
	},
	pathFn={
		'上翻':'window.scrollBy(0,-620);',
		'下翻':'window.scrollBy(0,620);',
		'打开设置':'openSet();',
		'后退':'let oldUrl=location.href;history.back();setTimeout(()=>{if(oldUrl==location.href){GM_setValue("lastTab",[location.href]);window.close();}},500);',
		'前进':'history.forward();',
		'回到顶部':'let boxNode=gestureData.touchEle.parentNode;while(true){boxNode.scrollTop=0;if(boxNode.nodeName=="HTML"){break;}boxNode=boxNode.parentNode;}',
		'回到底部':'let boxNode=gestureData.touchEle.parentNode;while(true){boxNode.scrollTop=boxNode.scrollHeight;if(boxNode.nodeName=="HTML"){break;}boxNode=boxNode.parentNode;}',
		'刷新页面':'document.documentElement.style.cssText="filter:grayscale(100%)";location.reload();',
		'新建页面':'openURL("https://nav.uvooc.com/m/");',
		'关闭页面':'GM_setValue("lastTab",[location.href]);window.close();',
		'恢复页面':'let lastTab=GM_getValue("lastTab",[]);for(let Ti of lastTab){openURL(Ti);}GM_setValue("lastTab",[]);',
		'新页面打开':'let linkNode=gestureData.touchEle;while(true){if(linkNode.href){openURL(linkNode.href);break;}linkNode=linkNode.parentNode;if(linkNode.nodeName=="BODY"){break;}}',
		'复制页面':'openURL(location.href);',
		'半屏模式':'if(gestureData.halfScreen){setTimeout(()=>{gestureData.halfScreen.remove();halfClose.remove();gestureData.halfScreen=null;},500);let halfClose=addStyle("html{animation:halfClose 0.5s;}@keyframes halfClose{from{transform:translateY("+gestureData.halfPX+"px);}to{transform:translateY(0px);}}");}else{gestureData.halfPX=window.screen.height/2;gestureData.halfScreen=addStyle("html{transform:translateY("+gestureData.halfPX+"px) !important;animation:halfScreen 0.5s;}@keyframes halfScreen{from{transform:translateY(0px);}to{transform:translateY("+gestureData.halfPX+"px);}}");}',
		'关闭其他页面':'GM_setValue("closeAll",Date());setTimeout(()=>{let urlList=GM_listValues();let lastTab=[];for(let Ti of urlList){if(Ti.indexOf("@")>-1){lastTab.push(GM_getValue(Ti));GM_deleteValue(Ti);}}GM_setValue("lastTab",lastTab);},500);',
		'视频解析':'openURL("http://jx.51yfx.com/?url="+location.href);',
		'百度翻译':'openURL("https://fanyi.baidu.com/#auto/auto/"+gestureData.selectWords);',
		'有道翻译':'openURL("https://dict.youdao.com/w/eng/"+gestureData.selectWords);',
		'打开图片':'openURL(gestureData.touchEle.src);',
		'百度搜图':'openURL("https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image="+gestureData.touchEle.src);',
		'前进10s':'videoPlayer.currentTime+=10;gestureData.tipBox.innerHTML="+10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
		'后退10s':'videoPlayer.currentTime-=10;gestureData.tipBox.innerHTML="-10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
		'增加倍速':'if(document.webkitIsFullScreen || document.mozFullScreen){let playSpeed=videoPlayer.playbackRate;playSpeed=(playSpeed<1.5) ? playSpeed+0.25 : playSpeed+0.5;gestureData.tipBox.innerHTML="x"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
		'减小倍速':'if(document.webkitIsFullScreen || document.mozFullScreen){let playSpeed=videoPlayer.playbackRate;playSpeed=(playSpeed>1.5) ? playSpeed-0.5 : ((playSpeed>0.25) ? playSpeed-0.25 : 0.25);gestureData.tipBox.innerHTML="x"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
		'快进播放':'gestureData.playSpeed=videoPlayer.playbackRate;videoPlayer.playbackRate=5;gestureData.tipBox.innerHTML="x5 ";gestureData.tipBox.style.display="block";',
		'停止快进':'videoPlayer.playbackRate=gestureData.playSpeed;gestureData.tipBox.style.display="none";',
		'快退播放':'gestureData.backTimer=setInterval(()=>{videoPlayer.currentTime-=5;},500);gestureData.tipBox.innerHTML="- x5 ";gestureData.tipBox.style.display="block";',
		'停止快退':'clearInterval(gestureData.backTimer);gestureData.tipBox.style.display="none";',
		'增加音量':'if(document.webkitIsFullScreen || document.mozFullScreen){gestureData.tipBox.innerHTML=parseInt(videoPlayer.volume*100)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.endY;gestureData.volumeTimer=setInterval(()=>{if(((gestureData.endY-lastY)**2)>1){let tempVolume=videoPlayer.volume+(lastY-gestureData.endY)/100;videoPlayer.volume=(tempVolume>1) ? 1 : ((tempVolume<0) ? 0 : tempVolume);gestureData.tipBox.innerHTML=parseInt(videoPlayer.volume*100)+"%";lastY=gestureData.endY;}},50);}',
		'关闭增加音量':'clearInterval(gestureData.volumeTimer);gestureData.tipBox.style.display="none";',
		'减少音量':'if(document.webkitIsFullScreen || document.mozFullScreen){gestureData.tipBox.innerHTML=parseInt(videoPlayer.volume*100)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.endY;gestureData.volumeTimer=setInterval(()=>{if(((gestureData.endY-lastY)**2)>1){let tempVolume=videoPlayer.volume-(gestureData.endY-lastY)/100;videoPlayer.volume=(tempVolume>1) ? 1 : ((tempVolume<0) ? 0 : tempVolume);gestureData.tipBox.innerHTML=parseInt(videoPlayer.volume*100)+"%";lastY=gestureData.endY;}},50);}',
		'关闭减少音量':'clearInterval(gestureData.volumeTimer);gestureData.tipBox.style.display="none";',
		'双击搜索':'copyText(gestureData.selectWords);if(!regURL.test(gestureData.selectWords)){gestureData.selectWords="https://www.baidu.com/s?wd="+gestureData.selectWords;}else if(gestureData.selectWords.indexOf("http")<0){gestureData.selectWords="//"+gestureData.selectWords;}window.open(gestureData.selectWords)'
	},
	settings={
		'滑动距离':0.5,
		'双击全屏':true,
		'全屏样式':true,
		'文字手势':true,
		'图片手势':true,
		'视频手势':true,
		'弹出网页':false
	};
	//存储数据读取
	gesture=GM_getValue('gesture',gesture);
	pathFn=GM_getValue('pathFn',pathFn);
	settings=GM_getValue('settings',settings);
	//脚本常量
	const gestureData={},regTYPE=/[TIV]/,regURL=/^(https?:\/\/)?([\w\-]+\.)+\w{2,4}(\/\S*)?$/,
	limit=(((window.screen.width>window.screen.height) ? window.screen.height : window.screen.width)/(6-5*settings['滑动距离']))**2;

	/*手势功能模块*/
	//手指滑动变量
	let startX=0,startY=0,calcX=0,calcY=0,pressTime=0,raiseTime=0,slideTime=0,path='',
	gestureON=0,delayTime=0,fullScreenPath=['V◆◆','◆◆','I◆◆','T◆◆'];
	//手势执行
	function runGesture(pathStr=''){
		if(gesture[path]){
			if(top.location==location || regTYPE.test(path)){try{eval(pathFn[gesture[path]]);}catch(error){alert('“'+path+'” 手势执行脚本错误：\n'+error+' ！');}}
			else{GM_setValue('gestureIfr',path);}
			path=pathStr;
		}else if(gesture[path.slice(1)] && regTYPE.test(path)){
			if(top.location==location){try{eval(pathFn[gesture[path.slice(1)]]);}catch(error){alert('“'+path.slice(1)+'” 手势执行脚本错误：\n'+error+' ！');}}
			else{GM_setValue('gestureIfr',path.slice(1));}
			path=pathStr;
		}
	}
	//手指按下
	function touchStart(e){
		pressTime=new Date().getTime();
		gestureData.startX=e.changedTouches[0].screenX;gestureData.startY=e.changedTouches[0].screenY;
		calcX=(gestureData.endX-gestureData.startX)**2;calcY=(gestureData.endY-gestureData.startY)**2;
		if((pressTime-raiseTime)>200 || (calcX+calcY)>10000){
			path='';slideTime=pressTime;
			gestureData.touchEle=e.srcElement;
			if(window.getSelection().toString() && settings['文字手势']){gestureData.selectWords=window.getSelection().toString();path='T';}
			else if(e.srcElement.tagName=='IMG' && settings['图片手势']){path='I';}
			else if(videoPlayer && settings['视频手势']){
				startX=e.changedTouches[0].clientX;
				startY=e.changedTouches[0].clientY;
				let videoRect=videoPlayer.getBoundingClientRect();
				if(startX>videoRect.x && startX<(videoRect.x+videoRect.width) && startY>videoRect.y && startY<(videoRect.y+videoRect.height)){path='V';}
			}
			startX=gestureData.startX;startY=gestureData.startY;
		}else{
			gestureON=0;
			if((pressTime-raiseTime)<50 && path.slice(-1)=='◆'){path=path.slice(0,-1);}
		}
		calcX=calcY=0;
	}
	//手指滑动
	function touchMove(e){
		if(e.changedTouches.length==1){
			gestureData.endX=e.changedTouches[0].screenX;gestureData.endY=e.changedTouches[0].screenY;
			calcX=(gestureData.endX-startX)**2;calcY=(gestureData.endY-startY)**2;
			let nowTime=new Date().getTime();
			if((calcX+calcY)>(limit/(path.length/2+1)) && path.slice(-1)!='○'){
				let direction=(calcX>calcY) ? ((gestureData.endX>startX) ? '→' : '←') : ((gestureData.endY>startY) ? '↓' : '↑');
				if(path.slice(-1)!=direction){path+=direction;}
				startX=gestureData.endX;startY=gestureData.endY;
				slideTime=nowTime;
			}else if((nowTime-slideTime)>500 && !regTYPE.test(path.slice(-1)) && '●○'.indexOf(path.slice(-1))<0){
				//长按执行
				path+='●';
				runGesture(path.slice(0,-1)+'○');
				slideTime=nowTime;
			}
		}else{path='';}
	}
	//手指抬起
	function touchEnd(e){
		let nowTime=new Date().getTime();
		if((nowTime-raiseTime)>50){
			let unBroken=((pressTime-raiseTime)<50) ? 0 : 1;
			raiseTime=nowTime;
			gestureData.endX=e.changedTouches[0].screenX;gestureData.endY=e.changedTouches[0].screenY;
			if((raiseTime-pressTime)<200 && (calcX+calcY)<100 && path.slice(-1)!='○' && unBroken){path+='◆';}
			delayTime=raiseTime+199;
			gestureON=1;
			if(settings['双击全屏'] && fullScreenPath.indexOf(path)>-1){
				//双击全屏
				if(document.webkitIsFullScreen){e.preventDefault();document.webkitExitFullscreen();}
				else if(document.mozFullScreen){e.preventDefault();document.mozCancelFullScreen();}
				else if(videoPlayer){
					copyText(videoPlayer.src);
					let videoBox=(settings['全屏样式']) ? findVideoBox() : videoPlayer;
					if(videoPlayer.webkitRequestFullscreen){videoBox.webkitRequestFullscreen();}
					else if(videoPlayer.mozRequestFullScreen){videoBox.mozRequestFullScreen();}
				}else if(iframeEle.length>0){GM_setValue('fullscreen',Date());}
			}
			setTimeout(videoEvent,0);
		}
	}
	//手势事件注册
	window.addEventListener('touchstart',touchStart,true);
	window.addEventListener('touchmove',touchMove,true);
	window.addEventListener('touchend',touchEnd,true);
	let gestureTimer=setInterval(()=>{if(gestureON && new Date().getTime()>delayTime){gestureON=0;runGesture();}},10);
	document.addEventListener('visibilitychange',()=>{
		if(document.hidden){clearInterval(gestureTimer);}
		else{clearInterval(gestureTimer);gestureTimer=setInterval(()=>{if(gestureON && new Date().getTime()>delayTime){gestureON=0;runGesture();}},10);}
	});

	/*video功能模块*/
	//video标签变量
	let videoEle=document.getElementsByTagName('video'),_videoEle=[],videoPlayer=null,
	oriHway='landscape-primary',isLock=0,unReg=1;
	//video判定
	function setVideo(){videoPlayer=this;videoOriLock();gestureData.tipBox.remove();videoPlayer.parentNode.appendChild(gestureData.tipBox);}
	function videoOriLock(){
		if(videoPlayer.videoWidth>videoPlayer.videoHeight){isLock=1;}
		else{isLock=0;screen.orientation.unlock();}
		if(top.location!=location){GM_setValue('isLock',isLock);}
	}
	//获取video全屏样式容器
	function findVideoBox(){
		let nodeNum=4,
		videoBox=videoPlayer,
		parentEle=videoPlayer.parentNode,
		videoWidth=videoPlayer.clientWidth-parseFloat(getComputedStyle(videoPlayer).paddingLeft)-parseFloat(getComputedStyle(videoPlayer).paddingRight),
		videoHeight=videoPlayer.clientHeight-parseFloat(getComputedStyle(videoPlayer).paddingTop)-parseFloat(getComputedStyle(videoPlayer).paddingBottom),
		parentWidth=parentEle.clientWidth-parseFloat(getComputedStyle(parentEle).paddingLeft)-parseFloat(getComputedStyle(parentEle).paddingRight),
		parentHeight=parentEle.clientHeight-parseFloat(getComputedStyle(parentEle).paddingTop)-parseFloat(getComputedStyle(parentEle).paddingBottom),
		childWidth=videoPlayer.offsetWidth+parseFloat(getComputedStyle(videoPlayer).marginLeft)+parseFloat(getComputedStyle(videoPlayer).marginRight),
		childHeight=videoPlayer.offsetHeight+parseFloat(getComputedStyle(videoPlayer).marginTop)+parseFloat(getComputedStyle(videoPlayer).marginBottom);
		while(true){
			if(parentWidth>=videoWidth && parentHeight>=videoHeight && childWidth==parentEle.offsetWidth && childHeight==parentEle.offsetHeight){
				let childNodes=parentEle.children;
				if(childNodes.length>=nodeNum){videoBox=parentEle;nodeNum=childNodes.length;}
				for(let Ti of childNodes){
					if(Ti.children.length>=nodeNum){videoBox=parentEle;nodeNum=Ti.children.length;}
				}
				childWidth=parentEle.offsetWidth+parseFloat(getComputedStyle(parentEle).marginLeft)+parseFloat(getComputedStyle(parentEle).marginRight);
				childHeight=parentEle.offsetHeight+parseFloat(getComputedStyle(parentEle).marginTop)+parseFloat(getComputedStyle(parentEle).marginBottom);
				parentEle=parentEle.parentNode;
				if(parentEle.nodeName=='BODY'){return videoBox;}
				parentWidth=parentEle.clientWidth-parseFloat(getComputedStyle(parentEle).paddingLeft)-parseFloat(getComputedStyle(parentEle).paddingRight);
				parentHeight=parentEle.clientHeight-parseFloat(getComputedStyle(parentEle).paddingTop)-parseFloat(getComputedStyle(parentEle).paddingBottom);
			}else{return videoBox;}
		}
	}
	//video标签事件绑定
	function videoEvent(){
		if(videoEle.length>_videoEle.length){
			if(!_videoEle.length){
				//重力感应事件
				regGYRO();
				//tip视频操作提示
				gestureData.tipBox=document.createElement('div');
				gestureData.tipBox.style.cssText='width:100px;height:50px;position:fixed;text-align:center;top:calc(50% - 25px);left:calc(50% - 50px);display:none;color:#1e87f0;font-size:24px;line-height:50px;background-color:#fff;border-radius:20px;font-family:"Microsoft YaHei";z-index:2147483647;';
				document.body.appendChild(gestureData.tipBox);
				//视频方向锁定
				if(top.location!=location){
					document.addEventListener('webkitfullscreenchange',()=>{
						if(document.webkitIsFullScreen){videoOriLock();}
					});
					document.addEventListener('mozfullscreenchange',()=>{
						if(document.mozFullScreen){videoOriLock();}
					});
				}
			}
			//播放video标签查找
			for(let Ti=_videoEle.length;Ti<videoEle.length;Ti++){
				if(!videoEle[Ti].paused){videoPlayer=videoEle[Ti];videoOriLock();}
				videoEle[Ti].addEventListener('playing',setVideo);
				_videoEle[Ti]=videoEle[Ti];
			}
		}else if(_videoEle.length>0 && videoEle.length==_videoEle.length){
			for(let Ti of _videoEle){
				if(!Ti.offsetWidth>0){
					for(let Ti=0;Ti<videoEle.length;Ti++){
						if(!videoEle[Ti].paused){videoPlayer=videoEle[Ti];videoOriLock();}
						videoEle[Ti].addEventListener('playing',setVideo);
						_videoEle[Ti]=videoEle[Ti];
					}
					break;
				}
			}
		}
	}
	//注册陀螺仪
	function regGYRO(){
		if(unReg){unReg=0;
			window.addEventListener('deviceorientation',(e)=>{
				if(isLock){
					let oriHgamma=e.gamma,
					oriHbeta=(e.beta>0) ? e.beta : -e.beta;
					if((oriHbeta<60 || oriHbeta>120) && (oriHgamma<-30 || oriHgamma>30)){
						oriHway=((oriHbeta<60 && oriHgamma<-30) || (oriHbeta>120 && oriHgamma>30)) ? 'landscape-primary' : 'landscape-secondary';
					}
					screen.orientation.lock(oriHway);
				}
			});
		}
	}

	/*工具方法模块*/
	function openURL(url){if(settings['弹出网页']){window.open(url);}else{GM_openInTab(url,{active:true});}}
	function addStyle(css){
		let style=document.createElement('style');
		style.type='text/css';
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
		return style;
	}
	function copyText(txt){
		try{navigator.clipboard.writeText(txt);return true;}
		catch(error){return false;}
	}
	//手势操作设置UI
	function openSet(){
		let gestureName='',gesturePath='',clickTime=0,clickTimer=0;
		document.documentElement.style.cssText='overflow:hidden';
		selectCSS.remove();
		//页面生成
		addStyle('html{font-size:62.5% !important;}'+
					'#gestureBox{background-color:#fff;width:100%;height:100%;position:fixed;padding:0;margin:0;top:0;left:0;overflow-y:auto;overflow-x:hidden;font-family:"Microsoft YaHei";z-index:999990;}'+
					'#gestureBox *{font-family:"Microsoft YaHei";margin:0;padding:0;text-align:center;font-size:2rem;line-height:4rem;}'+
					'#gestureBox ::placeholder{color:#999;font-size:1rem;line-height:2rem;}'+
					'#gestureBox h1{width:60%;height:4rem;line-height:4rem;font-size:2rem;color:#0074d9;background-color:#dee6ef;margin:1rem auto;border-radius:4rem;box-shadow:.3rem .3rem 1rem #dfdfdf;}'+
					'#gestureBox #addGesture{width:5rem;height:5rem;margin:1rem auto;line-height:4.8rem;background-color:#dee6ef;color:#032e58;font-size:3rem;border-radius:5rem;box-shadow:.1rem .1rem .5rem #dfdfdf;}'+
					'#gestureBox .gestureLi{height:6rem;width:100%;border-bottom:.3rem dashed #dfdfdf;}'+
					'#gestureBox .gestureLi p{margin:1rem 0 0 1%;width:38%;height:4rem;border-left:0.6rem solid;color:#ffb400;background-color:#fff1cf;float:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-shadow:0.1rem 0.1rem 1rem #ffcb56;}'+
					'#gestureBox .gestureLi .gesturePath{margin:1rem 0 0 3%;float:left;width:38%;height:4rem;background-color:#f3f3f3;color:#000;box-shadow:.1rem .1rem .5rem #ccc9c9;border-radius:1rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}'+
					'#gestureBox .gestureLi .delGesture{margin:1rem 2% 0 0;width:5rem;height:4rem;float:right;color:#f00;text-decoration:line-through;}'+
					'#gestureBox #revisePath{user-select:none;background-color:rgba(0,0,0,.5);width:100%;height:100%;position:fixed;top:0;left:0;overflow:hidden;z-index:999991;display:none;color:#000;}'+
					'#gestureBox #revisePath span{width:5rem;height:5rem;font-size:5rem;line-height:5rem;position:absolute;}'+
					'#gestureBox #revisePath div{color:#3339f9;position:absolute;width:30%;height:4rem;line-height:4rem;font-size:4rem;bottom:15%;}'+
					'#gestureBox #revisePath p{color:#3ba5d8;position:absolute;top:15%;font-size:4rem;line-height:4rem;height:4rem;width:100%;}'+
					'#gestureBox #revisePath #path{top:40%;color:#ffee03;height:100%;word-wrap:break-word;font-size:6rem;line-height:6rem;}'+
					'#gestureBox #editGesture{background-color:#fff;width:100%;height:100%;position:fixed;top:0;left:0;overflow:hidden;z-index:999991;display:none;color:#000;}'+
					'#gestureBox #editGesture p{color:#3339f9;font-size:3rem;text-align:left;margin:3rem 0 0 3rem;width:100%;height:3rem;line-height:3rem;}'+
					'#gestureBox #editGesture #gestureName{margin-top:2rem;width:80%;height:4rem;line-height:4rem;font-size:2rem;color:#000;border:0.1rem solid #dadada;border-radius:1rem;text-align:left;padding:0 1rem;}'+
					'#gestureBox #editGesture .label_box>label{display:inline-block;margin-top:2rem;position:relative;overflow:hidden;}'+
					'#gestureBox #editGesture .label_box>label>input{position:absolute;top:0;left:-2rem;}'+
					'#gestureBox #editGesture .label_box>label>div{width:8rem;text-align:center;border:#ddd solid 1px;height:4rem;line-height:4rem;color:#666;user-select:none;overflow:hidden;position:relative;}'+
					'#gestureBox #editGesture .label_box>label>input:checked + div{border:#d51917 solid 1px;color:#d51917;}'+
					'#gestureBox #editGesture .label_box>label>input:checked + div:after{content:"";display:block;width:2rem;height:2rem;background-color:#d51917;transform:skewY(-45deg);position:absolute;bottom:-1rem;right:0;z-index:999992;}'+
					'#gestureBox #editGesture .label_box>label>input:checked + div:before{content:"";display:block;width:3px;height:8px;border-right:#fff solid 2px;border-bottom:#fff solid 2px;transform:rotate(35deg);position:absolute;bottom:2px;right:4px;z-index:999993;}'+
					'#gestureBox #editGesture #pathFn{width:80%;margin-top:2rem;height:40%;font-size:2rem;text-align:left;line-height:2.2rem;padding:1rem;border:0.1rem solid #dadada;border-radius:1rem;}'+
					'#gestureBox #editGesture button{width:10rem;height:5rem;font-size:3rem;line-height:5rem;display:inline-block;color:#fff;background-color:#2866bd;margin:3rem 1rem 0rem 1rem;border:none;}'+
					'#gestureBox #settingsBox{background-color:#fff;width:100%;height:100%;position:fixed;top:0;left:0;overflow:hidden;z-index:999991;display:none;color:#000;}'+
					'#gestureBox #settingsBox p{color:#3339f9;font-size:2rem;text-align:left;margin:3rem 0 0 3rem;float:left;height:2rem;line-height:2rem;clear:both;}'+
					'#gestureBox #settingsBox .slideRail{width:20rem;background-color:#a8a8a8;float:left;margin:4rem 0 0 3rem;height:0.2rem;position:relative;}'+
					'#gestureBox #settingsBox .slideRail .slideButton{text-align:center;line-height:3rem;color:#fff;background-color:#2196f3;width:3rem;height:3rem;border-radius:3rem;font-size:1.5rem;position:absolute;top:-1.5rem;left:-15px;box-shadow:1px 1px 6px #5e8aee;}'+
					'#gestureBox #settingsBox .switch{position:relative;display:inline-block;width:6rem;height:3rem;float:left;margin:2.5rem 42% 0 1rem;}'+
					'#gestureBox #settingsBox .switch input{display:none;}'+
					'#gestureBox #settingsBox .slider{border-radius:3rem;position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;}'+
					'#gestureBox #settingsBox .slider:before{border-radius:50%;position:absolute;content:"";height:2.6rem;width:2.6rem;left:0.2rem;bottom:0.2rem;background-color:white;transition:.4s;}'+
					'#gestureBox #settingsBox input:checked + .slider{background-color:#2196F3;}'+
					'#gestureBox #settingsBox input:checked + .slider:before{transform:translateX(3rem);}'+
					'#gestureBox #settingsBox #saveSettings{display:block;clear:both;width:10rem;height:5rem;font-size:3rem;line-height:5rem;color:#fff;background-color:#2866bd;border:none;margin:4rem 0 0 calc(50% - 5rem);float:left;}');
		let gestureBox=document.createElement('div');
		gestureBox.id='gestureBox';
		document.body.appendChild(gestureBox);
		gestureBox.innerHTML='<h1 id="openSettings">手势轨迹设置</h1><div id="addGesture">+</div><div id="gestureUL"></div>'+
						'<div id="revisePath"><span style="top:0;left:0;text-align:left;">┌</span><span style="top:0;right:0;text-align:right;">┐</span><span style="bottom:0;left:0;text-align:left;">└</span><span style="bottom:0;right:0;text-align:right;">┘</span>'+
						'<p>请滑动手指</p><p id="path"></p><div id="clearPath" style="left:10%;">Clear</div><div id="cancleRevise" style="right:10%;">Cancle</div></div>'+
						'<div id="editGesture"><p>手势名称：</p><input type="text" id="gestureName" maxlength="12" placeholder="最大输入12个字符">'+
						'<p>手势类型：</p><div class="label_box"><label><input type="radio" id="GG" name="gestureType" value=""><div>一般</div></label><label><input type="radio" id="T" name="gestureType" value="T"><div>文字</div></label><label><input type="radio" id="I" name="gestureType" value="I"><div>图片</div></label><label><input type="radio" id="V" name="gestureType" value="V"><div>视频</div></label></div>'+
						'<p>手势路径脚本：</p><textarea id="pathFn" placeholder="可用变量说明↓\n 	gestureData：手势数据常量,如果你需要在不同手势间传递变量,你可以赋值gestureData.变量名=变量值；\n	gestureData.touchEle：手指触摸的源元素；\n	gestureData.selectWords：选中的文字；\n	[gestureData.startX,gestureData.startY]触摸开始坐标；\n	[gestureData.endX,gestureData.endY]触摸结束坐标；\n	path：滑动的路径；\n	videoPlayer：正在播放的视频元素。'+
						'\n\n可用方法说明↓\n	openURL(链接)：打开链接；\n	copyText(文本)：复制文本到剪切板,成功(失败)返回true(false)；\n	addStyle(CSS样式)：将CSS样式添加到网页上；\n	runGesture()：以path为路径执行手势,你可以修改path后执行此方法；\n	GM_setValue(变量名,变量值)：在油猴中存储数据；\n	GM_getValue(变量名,默认值)：从油猴中取出数据,没有则使用默认值；\n	GM_deleteValue(变量名)：从油猴中删除指定变量；\n	GM_listValues()：获得油猴存储的变量列表。"></textarea>'+
						'<div style="width:100%;height:1px;"></div><button id="saveGesture">保存</button><button id="closeEdit">关闭</button></div>'+
						'<div id="settingsBox"><h1>功能开关设置</h1><span id="settingList"></span><button id="saveSettings">保存</button></div>';
		let pathEle=document.getElementById('path');

		//编辑手势
		function editGesture(){
			gestureName=this.parentNode.getAttribute('name');
			gesturePath=this.parentNode.getAttribute('path');
			let selectType=(regTYPE.test(gesturePath)) ? gesturePath.slice(0,1) : 'GG';
			document.getElementById(selectType).click();
			document.getElementById('gestureName').value=gestureName;
			document.getElementById('pathFn').value=pathFn[gestureName];
			document.getElementById('editGesture').style.display='block';
		}
		//修改路径
		function revisePath(){
			gestureName=this.parentNode.getAttribute('name');
			gesturePath=this.parentNode.getAttribute('path');
			pathEle.innerHTML='';
			window.removeEventListener('touchmove',touchMove,true);
			gestureBox.style.cssText='overflow:hidden;';
			document.getElementById('revisePath').style.display='block';
		}
		//删除手势
		function delGesture(){
			gestureName=this.parentNode.getAttribute('name');
			gesturePath=this.parentNode.getAttribute('path');
			if(gestureName=='打开设置'){alert('这个手势无法删除！');return false;}
			delete pathFn[gestureName];
			delete gesture[gesturePath];
			GM_setValue('pathFn',pathFn);
			GM_setValue('gesture',gesture);
			init();
		}
		//滑动条
		function silideBar(e){
			e.stopPropagation();
			e.preventDefault();
			if(e.changedTouches.length==1){
				let endX=e.changedTouches[0].screenX;
				calcX=endX-startX;
				let leftPX=parseFloat(this.style.left)+calcX;
				if(leftPX>=-15 && leftPX<=(this.parentNode.offsetWidth-15)){
					this.style.left=leftPX+'px';
					leftPX=(leftPX+15)/this.parentNode.offsetWidth;
					this.innerHTML=leftPX.toFixed(1);
					startX=endX;
				}
			}
		}
		//界面初始化
		function init(){
			document.getElementById('gestureUL').innerHTML='';
			for(gestureName in pathFn){
				gesturePath='';
				for(let Ti in gesture){
					if(gesture[Ti]==gestureName){gesturePath=Ti;break;}
				}
				document.getElementById('gestureUL').innerHTML+='<div class="gestureLi" name="'+gestureName+'" path="'+gesturePath+'"><p>'+gestureName+'</p><div class="gesturePath">'+gesturePath+'</div><div class="delGesture">删除</div></div>';
			}
			//操作绑定
			let gestureEle=document.querySelectorAll('#gestureBox .gestureLi p');
			for(let Ti of gestureEle){
				Ti.addEventListener('click',editGesture);
			}
			gestureEle=document.querySelectorAll('#gestureBox .gestureLi .gesturePath');
			for(let Ti of gestureEle){
				Ti.addEventListener('click',revisePath);
			}
			gestureEle=document.querySelectorAll('#gestureBox .gestureLi .delGesture');
			for(let Ti of gestureEle){
				Ti.addEventListener('click',delGesture);
			}
		}
		init();

		//.新建手势
		document.getElementById('addGesture').addEventListener('click',()=>{
			gestureName=gesturePath='';
			document.getElementById('GG').click();
			document.getElementById('gestureName').value='';
			document.getElementById('pathFn').value='';
			document.getElementById('editGesture').style.display='block';
		});
		//保存手势
		document.getElementById('saveGesture').addEventListener('click',()=>{
			if(gestureName=='打开设置'){alert('这个手势无法修改！');return false;}
			if(document.getElementById('gestureName').value){
				delete pathFn[gestureName];
				delete gesture[gesturePath];
				for(let Ti of document.getElementsByName('gestureType')){
					if(Ti.checked){
						gesturePath=(gestureName && gesturePath.indexOf('[')<0) ? ((regTYPE.test(gesturePath)) ? Ti.value+gesturePath.slice(1) : Ti.value+gesturePath) : (Ti.value+'['+document.getElementById('gestureName').value+']');
						break;
					}
				}
				gesture[gesturePath]=document.getElementById('gestureName').value;
				pathFn[document.getElementById('gestureName').value]=document.getElementById('pathFn').value;
				GM_setValue('pathFn',pathFn);
				GM_setValue('gesture',gesture);
				init();
				document.getElementById('editGesture').style.display='none';
			}else{alert('请输入手势名称！');}
		});
		//关闭编辑
		document.getElementById('closeEdit').addEventListener('click',()=>{
			document.getElementById('editGesture').style.display='none';
		});
		//路径修改事件
		document.getElementById('revisePath').addEventListener('touchmove',(e)=>{
			if(e.changedTouches.length==1 && pathEle.innerHTML.slice(-1)!='○'){
				let endX=e.changedTouches[0].screenX,endY=e.changedTouches[0].screenY;
				calcX=(endX-startX)**2;calcY=(endY-startY)**2;
				let nowTime=new Date().getTime();
				if((calcX+calcY)>limit){
					let direction=(calcX>calcY) ? ((endX>startX) ? '→' : '←') : ((endY>startY) ? '↓' : '↑');
					if(pathEle.innerHTML.slice(-1)!=direction){pathEle.innerHTML+=direction;}
					startX=endX;startY=endY;
					slideTime=nowTime;
				}else if((nowTime-slideTime)>800 && pathEle.innerHTML && pathEle.innerHTML.slice(-1)!='●'){
					pathEle.innerHTML+='●';
					slideTime=nowTime;
				}
			}
		});
		document.getElementById('revisePath').addEventListener('touchend',()=>{
			raiseTime=new Date().getTime();
			if((raiseTime-clickTime)<400 && (pressTime-clickTime)<200){
				clearTimeout(clickTimer);
				if(pathEle.innerHTML.slice(-1)=='●'){pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'○';}
				else if(pathEle.innerHTML.slice(-1)=='○'){pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'●';}
			}else if((raiseTime-pressTime)<200){
				clickTimer=setTimeout(()=>{if(pathEle.innerHTML.slice(-1)!='○'){pathEle.innerHTML+='◆';}},400);
				clickTime=raiseTime;
			}
		});
		//清除路径
		document.getElementById('clearPath').addEventListener('touchend',(e)=>{
			e.stopPropagation();
			raiseTime=new Date().getTime();
			if((raiseTime-clickTime)<400 && (pressTime-clickTime)<200){
				pathEle.innerHTML='';
			}else if((raiseTime-pressTime)<200){
				pathEle.innerHTML=pathEle.innerHTML.slice(0,-1);
				clickTime=raiseTime;
			}
		});
		//保存修改路径
		document.getElementById('cancleRevise').addEventListener('touchend',(e)=>{
			e.stopPropagation();
			e.preventDefault();
			raiseTime=new Date().getTime();
			if((raiseTime-pressTime)<200){
				if(pathEle.innerHTML){
					if(regTYPE.test(gesturePath)){pathEle.innerHTML=gesturePath.slice(0,1)+pathEle.innerHTML;}
					delete gesture[gesturePath];
					if(gesture[pathEle.innerHTML]){
						let pathTXT=((regTYPE.test(gesturePath)) ? gesturePath.slice(0,1) : '')+'['+gesture[pathEle.innerHTML]+']';
						gesture[pathTXT]=gesture[pathEle.innerHTML];
					}
					gesture[pathEle.innerHTML]=gestureName;
					GM_setValue('gesture',gesture);
					init();
				}
				window.addEventListener('touchmove',touchMove,true);
				gestureBox.style.cssText='overflow-y:auto';
				document.getElementById('revisePath').style.display='none';
			}
		});
		//打开功能开关设置
		document.getElementById('openSettings').addEventListener('touchend',()=>{
			raiseTime=new Date().getTime();
			if((raiseTime-clickTime)<400 && (pressTime-clickTime)<200){
				document.getElementById('settingsBox').style.display='block';
				let settingList=document.getElementById('settingList');
				settingList.innerHTML='';
				for(let Ti in settings){
					settingList.innerHTML+='<p>'+Ti+'：</p>';
					if(typeof(settings[Ti])=='boolean'){
						settingList.innerHTML=(settings[Ti]) ? (settingList.innerHTML+'<label class="switch"><input type="checkbox" id="'+Ti+'" checked><div class="slider"></div></label>') : (settingList.innerHTML+'<label class="switch"><input type="checkbox" id="'+Ti+'" ><div class="slider"></div></label>');
					}else if(typeof(settings[Ti])=='number'){
						settingList.innerHTML+='<div class="slideRail"><div class="slideButton" id="'+Ti+'"></div></div>';
						let slideButton=document.getElementById(Ti),
						leftPX=slideButton.parentNode.offsetWidth*settings[Ti]-15;
						slideButton.style.left=leftPX+'px';
						slideButton.innerHTML=settings[Ti].toFixed(1);
					}
				}
				let slideList=document.getElementsByClassName('slideButton');
				for(let Ti of slideList){
					Ti.addEventListener('touchmove',silideBar);
				}
			}else if((raiseTime-pressTime)<200){
				clickTime=raiseTime;
			}
		});
		//保存功能开关设置
		document.getElementById('saveSettings').addEventListener('click',()=>{
			for(let Ti in settings){
				if(typeof(settings[Ti])=='boolean'){
					settings[Ti]=document.getElementById(Ti).checked;
				}else if(typeof(settings[Ti])=='number'){
					settings[Ti]=parseFloat(document.getElementById(Ti).innerHTML);
				}
			}
			GM_setValue('settings',settings);
			document.getElementById('settingsBox').style.display='none';
		});
	}

	/*功能补充模块*/
	//关闭其他页面
	GM_addValueChangeListener('closeAll',(name,old_value,new_value,remote)=>{
		if(remote){
			GM_setValue('@'+document.title,location.href);
			window.close();
		}
	});
	//iframe相关
	let iframeEle=document.getElementsByTagName('iframe');
	if(top.location!=location){
		//iframe视频全屏
		GM_addValueChangeListener('fullscreen',(name,old_value,new_value,remote)=>{
			if(remote && !document.hidden){
				videoEvent();
				if(videoPlayer){
					copyText(videoPlayer.src);
					let videoBox=(settings['全屏样式']) ? findVideoBox() : videoPlayer;
					if(videoPlayer.webkitRequestFullscreen){videoBox.webkitRequestFullscreen();}
					else if(videoPlayer.mozRequestFullScreen){videoBox.mozRequestFullScreen();}
				}
			}
		});
	}else{
		//iframe手势执行
		GM_addValueChangeListener('gestureIfr',(name,old_value,new_value,remote)=>{
			if(remote && !document.hidden && new_value){
				try{eval(pathFn[gesture[new_value]]);}
				catch(error){alert('“'+new_value+'” 手势执行脚本错误：\n'+error+' ！');}
				setTimeout(()=>{GM_setValue('gestureIfr','');},0);
			}
		});
		//iframe陀螺仪
		GM_addValueChangeListener('isLock',(name,old_value,new_value,remote)=>{
			if(remote && !document.hidden && new_value<2){
				isLock=new_value;
				if(!new_value){screen.orientation.unlock();}
				setTimeout(()=>{regGYRO();GM_setValue('isLock',2);},0);
			}
		});
	}
	//双击全屏路径
	for(let Ti in gesture){
		if(Ti.slice(0,2)=='◆◆'){fullScreenPath=fullScreenPath.filter(item=>item!='◆◆');}
		else if(fullScreenPath.indexOf(Ti.slice(0,3))>-1){fullScreenPath=fullScreenPath.filter(item=>item!=Ti.slice(0,3));}
	}
	//解除选中限制
	let selectCSS=addStyle('html,*{user-select:text !important;}');
})();