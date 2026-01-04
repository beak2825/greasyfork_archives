// ==UserScript==
// @name		手机浏览器触摸手势（修改版）
// @name:en		Mobile browser touch gestures
// @description	为手机浏览器添加触摸手势，即装即用，无需配置。除了通用手势外，还有针对文字、图片、视频的特殊手势。还嫌不够？支持添加属于你的个性化手势。推荐使用Kiwi浏览器、Yandex浏览器和狐猴浏览器。
// @description:en	Add touch gestures to your mobile browser, ready to use and no configuration required. In addition to general gestures, there are also special gestures for text, images, and videos. Do you still think it's not enough? Support adding personalized gestures that belong to you. We recommend using Kiwi browser, Yandex browser, and Lemur browser.
// @version		0.3
// @author		L.Xavier
// @namespace	https://example.com/
// @match		*://*/*
// @license		MIT
// @grant		window.close
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_openInTab
// @grant		GM_setClipboard
// @grant		GM_addValueChangeListener
// @run-at	document-start
// @downloadURL https://update.greasyfork.org/scripts/495213/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%A6%E6%91%B8%E6%89%8B%E5%8A%BF%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/495213/%E6%89%8B%E6%9C%BA%E6%B5%8F%E8%A7%88%E5%99%A8%E8%A7%A6%E6%91%B8%E6%89%8B%E5%8A%BF%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
// v0.3		2024-04-13 - 修改百度搜图为必应搜图
/*手势数据模块*/
let gesture={
	'↑→↓←':'打开设置',
	'◆◆':'视频全屏',
	'●':'手势穿透',
	'→←':'后退',
	'←→':'前进',
	'↓↑':'回到顶部',
	'↑↓':'回到底部',
	'←↓':'刷新页面',
	'←↑':'新建页面',
	'→↓':'关闭页面',
	'→↑':'恢复页面',
	'↓↑●':'新页面打开',
	'↑↓●':'隐藏元素',
	'↓→':'复制页面',
	'→←→':'半屏模式',
	'→↓↑←':'视频解析',
	'T→↑':'百度翻译',
	'T←↑':'有道翻译',
	'T◆◆':'双击搜索',
	'I↓↑●':'打开图片',
	'I→↑●':'必应搜图',
	'V→':'前进10s',
	'V←':'后退10s',
	'V↑':'增加倍速',
	'V↓':'减小倍速',
	'V→●':'快进播放',
	'V→○':'停止快进',
	'V←●':'快退播放',
	'V←○':'停止快退',
	'V↑●':'增加音量',
	'V↑○':'关闭增加音量',
	'V↓●':'减少音量',
	'V↓○':'关闭减少音量',
	'V→▼':'右滑进度',
	'V→▽':'关闭右滑进度',
	'V←▼':'左滑进度',
	'V←▽':'关闭左滑进度'
},
pathFn={
	'打开设置':'/*ONLY TOP*/openSet();',
	'视频全屏':'videoFullScreen();',
	'手势穿透':'setTimeout(()=>{if(/^[TIV]/.test(path)){path=(path.indexOf("I")>-1) ? "I" : "";return;}if(gestureData.touchEle.nodeName!=="IMG"){let imgs=gestureData.touchEle.parentNode.getElementsByTagName("img");for(let Ti=0,len=imgs.length;Ti<len;++Ti){let imgRect=imgs[Ti].getBoundingClientRect();if(gestureData.touchStart.clientX>imgRect.x && gestureData.touchStart.clientX<(imgRect.x+imgRect.width) && gestureData.touchStart.clientY>imgRect.y && gestureData.touchStart.clientY<(imgRect.y+imgRect.height)){gestureData.touchEle=imgs[Ti];break;}}}if(gestureData.touchEle.nodeName==="IMG" && settings["图片手势"]){path="I";}else if(gestureData.touchEle.style.backgroundImage && settings["图片手势"]){gestureData.touchEle.src=gestureData.touchEle.style.backgroundImage.split(\'"\')[1];path="I";}});',
	'后退':'/*ONLY TOP*/function pageBack(){if(gestureData.backTimer){history.go(-1);setTimeout(pageBack,20);}}gestureData.backTimer=setTimeout(()=>{gestureData.backTimer=0;window.close();},200);pageBack();',
	'前进':'/*ONLY TOP*/history.go(1);',
	'回到顶部':'/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){boxNode.scrollIntoView(true);if(boxNode.scrollTop){boxNode.scrollTo(0,0);}boxNode=boxNode.parentNode;}',
	'回到底部':'/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){if(getComputedStyle(boxNode).overflowY!=="hidden"){boxNode.scrollTo(0,boxNode.scrollHeight+999999);}boxNode=boxNode.parentNode;}',
	'刷新页面':'/*ONLY TOP*/document.documentElement.style.cssText="filter:grayscale(100%)";history.go(0);',
	'新建页面':'/*ONLY TOP*/GM_openInTab("//limestart.cn");',
	'关闭页面':'/*ONLY TOP*/window.close();',
	'新页面打开':'let linkNode=gestureData.touchEle;while(true){if(linkNode.href){GM_openInTab(linkNode.href);break;}linkNode=linkNode.parentNode;if(linkNode.nodeName==="BODY"){gestureData.touchEle.click();break;}}',
	'隐藏元素':'let boxNode=gestureData.touchEle,area=boxNode.offsetWidth*boxNode.offsetHeight,area_p=boxNode.parentNode.offsetWidth*boxNode.parentNode.offsetHeight,area_s=screen.width*screen.height;while(boxNode.parentNode.nodeName!=="BODY" && area/area_p>0.2 && area_p/area_s<0.9){boxNode=boxNode.parentNode;area_p=boxNode.parentNode.offsetWidth*boxNode.parentNode.offsetHeight;}if(boxNode.nodeName!=="HTML"){boxNode.remove();}',
	'复制页面':'/*ONLY TOP*/GM_openInTab(location.href);',
	'半屏模式':'/*ONLY TOP*/if(gestureData.halfScreen){setTimeout(()=>{gestureData.halfScreen.remove();halfClose.remove();gestureData.halfScreen=null;document.documentElement.scrollTop=gestureData.scrollTop;},500);gestureData.scrollTop=document.body.scrollTop;let halfClose=addStyle("html{transform:translateY(0) !important;}");}else{gestureData.scrollTop=document.documentElement.scrollTop;gestureData.halfScreen=addStyle("html,body{height:43vh !important;overflow-y:auto !important;}html{transform:translateY(50vh) !important;transition:0.5s !important;overflow:hidden !important;}");document.body.scrollTop=gestureData.scrollTop;}',
	'视频解析':'/*ONLY TOP*/GM_openInTab("https://www.ckplayer.vip/jiexi/?url="+location.href);',
	'百度翻译':'GM_openInTab("//fanyi.baidu.com/#auto/auto/"+encodeURIComponent(gestureData.selectWords));',
	'有道翻译':'GM_openInTab("//dict.youdao.com/w/eng/"+encodeURIComponent(gestureData.selectWords));',
	'双击搜索':'if(!regURL.test(gestureData.selectWords.trim())){gestureData.selectWords="//bing.com/search?q="+encodeURIComponent(gestureData.selectWords);}else if(!/^(https?:)?\\/\\//.test(gestureData.selectWords.trim())){gestureData.selectWords="//"+gestureData.selectWords.trim();}GM_openInTab(gestureData.selectWords.trim());',
	'必应搜图':'GM_openInTab("https://cn.bing.com/images/search?q="+gestureData.touchEle.src);',
	'前进10s':'videoPlayer.currentTime+=10;gestureData.tipBox.textContent="+10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
	'后退10s':'videoPlayer.currentTime-=10;gestureData.tipBox.textContent="-10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
	'增加倍速':'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed+=(playSpeed<1.5) ? 0.25 : 0.5;gestureData.tipBox.textContent="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
	'减小倍速':'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed-=(playSpeed>1.5) ? 0.5 : (playSpeed>0.25 && 0.25);gestureData.tipBox.textContent="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
	'快进播放':'gestureData.playSpeed=videoPlayer.playbackRate;videoPlayer.playbackRate=10;gestureData.tipBox.textContent="×10 ";gestureData.tipBox.style.display="block";',
	'停止快进':'videoPlayer.playbackRate=gestureData.playSpeed;gestureData.tipBox.style.display="none";',
	'快退播放':'gestureData.videoTimer=setInterval(()=>{--videoPlayer.currentTime;},100);gestureData.tipBox.textContent="- ×10 ";gestureData.tipBox.style.display="block";',
	'停止快退':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'增加音量':'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.textContent=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.textContent=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
	'关闭增加音量':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'减少音量':'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.textContent=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.textContent=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
	'关闭减少音量':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'右滑进度':'let lastX=gestureData.touchEnd.screenX,hour,minu,sec;function showTip(){minu=videoPlayer.currentTime/60;sec=videoPlayer.currentTime%60;hour=minu/60;minu%=60;gestureData.tipBox.textContent=(hour|0)+":"+((minu<10) ? "0":"")+(minu|0)+":"+((sec<10) ? "0" : "")+(sec|0);}showTip();gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{let len=gestureData.touchEnd.screenX-lastX;if(len){videoPlayer.currentTime+=len*(1+Math.abs(len)/2);lastX=gestureData.touchEnd.screenX;}showTip();},50);',
	'关闭右滑进度':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'左滑进度':'let lastX=gestureData.touchEnd.screenX,hour,minu,sec;function showTip(){minu=videoPlayer.currentTime/60;sec=videoPlayer.currentTime%60;hour=minu/60;minu%=60;gestureData.tipBox.textContent=(hour|0)+":"+((minu<10) ? "0":"")+(minu|0)+":"+((sec<10) ? "0" : "")+(sec|0);}showTip();gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{let len=gestureData.touchEnd.screenX-lastX;if(len){videoPlayer.currentTime+=len*(1+Math.abs(len)/2);lastX=gestureData.touchEnd.screenX;}showTip();},50);',
	'关闭左滑进度':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";'
},
settings={
	'滑动系数':[0.2,0,0.5,2],//[当前值,最小值,最大值,取值精度]
	'文字手势':true,
	'图片手势':true,
	'视频手势':true,
	'链接加速':false,
	'视频下载':false,
	'避免断触':false
};
//存储数据读取
gesture=GM_getValue('gesture',gesture);
pathFn=GM_getValue('pathFn',pathFn);
settings=GM_getValue('settings',settings);
//脚本常量
const gestureData={},minSide=(screen.width>screen.height) ? screen.height : screen.width,limit=(minSide*settings['滑动系数'][0])**2,attachShadow=Element.prototype.attachShadow,regURL=/^((https?:)?\/\/)?([\w\-]+\.)+\w{2,4}(:\d{1,5})?(\/\S*)?$/,mObserver=new MutationObserver(()=>{if(!checkTimer){checkTimer=setTimeout(loadCheck,200);}});

/*手势功能模块*/
//手指功能变量
let path='',startPoint=null,timeSpan=0,raiseTime=0,slideTime=0,slideLimit=0,fingersNum=0,gestureTimer=0,clickTimer=0,isAllow=0,isClick=0;
//手势执行
function runCode(code){
	try{eval(code);}catch(error){
		if((error+'').indexOf('unsafe-eval')>-1){
			if(!window._eval_){
				window._eval_=(()=>{
					let script=document.createElement('script');
					function thisParams(){
						this.window.close=window.close;
						this.GM_setValue=GM_setValue;
						this.GM_getValue=GM_getValue;
						this.GM_openInTab=GM_openInTab;
						this.GM_setClipboard=GM_setClipboard;
						this.copyText=copyText;
						this.runCode=runCode;
						this.runFrame=runFrame;
						this.runGesture=runGesture;
						this.videoFullScreen=videoFullScreen;
						this.findVideoBox=findVideoBox;
						this.addStyle=addStyle;
						this.openSet=openSet;
						this.gestureData=gestureData;
						this.regURL=regURL;
						this.path=path;
						this.videoPlayer=videoPlayer;
					}
					return (js)=>{
						thisParams();script.remove();
						script.textContent='try{'+js+'}catch(error){alert("“"+path+"” 手势执行脚本错误：\\n"+error+" ！");}';
						document.body.insertAdjacentElement('beforeend',script);
					}
				})();
				if(top===self){window._eval_('window.addEventListener("popstate",()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);window.addEventListener("beforeunload",()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);');}
			}
			window._eval_(code);
		}
		else{alert('“'+path+'” 手势执行脚本错误：\n'+error+' ！');}
	}
}
function runFrame(runPath){
	let code=pathFn[gesture[runPath]];
	if(top===self || /^[TIV]/.test(runPath)){runCode(code);}
	else{
		if(code.indexOf('/*ONLY TOP*/')<0){runCode(code);}
		if(/\/\*(ONLY|WITH) TOP\*\//.test(code)){
			if(/[●▼]$/.test(runPath)){window._isPushing_=()=>{let _gestureData={};_gestureData.touchEnd=copyTouch(gestureData.touchEnd);top.postMessage({'type':'pushTouch','gestureData':_gestureData},'*');}}
			let _gestureData={};
			_gestureData.touchStart=copyTouch(gestureData.touchStart);
			_gestureData.touchEnd=copyTouch(gestureData.touchEnd);
			top.postMessage({'type':'runPath','runPath':path,'gestureData':_gestureData},'*');
		}
	}
}
function runGesture(newPath){
	if(gesture[path]){
		runFrame(path);
		if(gesture[newPath]){path=newPath;}
	}else if(gesture[path.slice(1)] && /^[TIV]/.test(path)){
		runFrame(path.slice(1));
		if(gesture[newPath?.slice(1)]){path=newPath;}
	} raiseTime=0;
}
//长按执行
function longPress(){
	if(!/[●○▽]$/.test(path)){
		isAllow=isClick=0;
		startPoint=gestureData.touchEnd;
		let newPath=path+'○';path+='●';
		runGesture(newPath);
	}
}
//持续滑动执行
function slidingRun(){
	slideTime=0;
	let newPath=path+'▽';path+='▼';
	runGesture(newPath);
	path=path.replace('▼','');
}
//手指按下
function touchStart(e){
	clearTimeout(gestureTimer);
	if((fingersNum=e.touches.length)>1){return;}
	timeSpan=Date.now()-raiseTime;
	let lineLen=raiseTime && (e.changedTouches[0].screenX-gestureData.touchEnd.screenX)**2+(e.changedTouches[0].screenY-gestureData.touchEnd.screenY)**2;
	if(timeSpan>50 || lineLen>limit){//断触判断
		startPoint=e.changedTouches[0];
		if(timeSpan>200 || lineLen>limit){
			path='';slideLimit=limit;
			gestureData.touchEle=e.target;
			gestureData.touchEnd=gestureData.touchStart=startPoint;
			gestureData.selectWords=window.getSelection()+'';
			if(gestureData.selectWords && settings['文字手势']){path='T';}
			else if(document.contains(videoPlayer) && settings['视频手势']){
				let videoRect=findVideoBox().getBoundingClientRect();
				if(fullsState>0 && gestureData.touchStart.clientY<(videoRect.y+videoRect.height/8)){path='!';}
				else if(gestureData.touchStart.clientX>videoRect.x && gestureData.touchStart.clientX<(videoRect.x+videoRect.width) && gestureData.touchStart.clientY>videoRect.y && gestureData.touchStart.clientY<(videoRect.y+videoRect.height)){path='V';}
			}
		}else if(isClick){e.preventDefault();} isClick=1;
	}else if(isClick){clearTimeout(clickTimer);path=path.slice(0,-1);}
	gestureTimer=setTimeout(longPress,300);
}
//手指滑动
function touchMove(e){
	clearTimeout(gestureTimer);
	gestureData.touchEnd=e.changedTouches[0];
	if(window._isPushing_){setTimeout(window._isPushing_);}
	if(/[○▽]$/.test(path) || fingersNum>1){return;}
	let xLen=(gestureData.touchEnd.screenX-startPoint.screenX)**2,yLen=(gestureData.touchEnd.screenY-startPoint.screenY)**2,
	direction=(xLen>yLen*1.42) ? ((gestureData.touchEnd.screenX>startPoint.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY>startPoint.screenY) ? '↓' : '↑'),
	nowTime=Date.now(),pathLen=xLen+yLen,lastIcon=path.slice(-1);
	if((lastIcon===direction && pathLen>limit/576) || pathLen>slideLimit){
		if(lastIcon!==direction && (timeSpan<50 || 'TIV◆'.indexOf(lastIcon)>-1)){path+=direction;slideLimit*=(slideLimit<limit/2) || 0.64;slideTime=nowTime;isAllow=1;timeSpan=0;}
		startPoint=gestureData.touchEnd;
		if(slideTime && nowTime-slideTime>300){setTimeout(slidingRun);}
	}else if(pathLen>limit/100){isClick=slideTime=isAllow=0;}
	gestureTimer=setTimeout(longPress,300);
}
//手指抬起
function touchEnd(e){
	clearTimeout(gestureTimer);
	if(--fingersNum>0){if(!/[○▽]$/.test(path)){path='!';}return;}
	if(window._isPushing_){window._isPushing_=null;}
	gestureData.touchEnd=e.changedTouches[0];
	raiseTime=Date.now();setTimeout(iframeLock);
	if(/[○▽]$/.test(path)){setTimeout(runGesture);return;}
	if(isClick){isAllow=1;path+='◆';if(/^V◆◆$|^T/.test(path)){e.stopPropagation();e.preventDefault();window.getSelection().empty();}}
	if(isAllow){gestureTimer=setTimeout(runGesture,199);}
}
//延迟点击，避免断触触发点击
function delayClick(e){
	if(e.isTrusted){
		e.stopImmediatePropagation();e.stopPropagation();e.preventDefault();
		if(timeSpan<50){return;}
		let ev=new PointerEvent('click',{bubbles:true,cancelable:true,clientX:e.clientX,clientY:e.clientY,composed:true,detail:1,layerX:e.layerX,layerY:e.layerY,offsetX:e.offsetX,offsetY:e.offsetY,pageX:e.pageX,pageY:e.pageY,pointerId:e.pointerId,pointerType:e.pointerType,screenX:e.screenX,screenY:e.screenY,sourceCapabilities:e.sourceCapabilities,view:e.view,x:e.x,y:e.y});
		clickTimer=setTimeout(()=>{e.target.dispatchEvent(ev);},50);
	}
}

/*视频功能模块*/
//视频功能变量
let videoPlayer=null,oriLock=0,resizeTimer=0,fullsState=0;
//videoPlayer赋值
async function setVideo(player){
	let _videoPlayer=player.target || player;
	if(videoPlayer?.paused===false && _videoPlayer.muted===true){return;}
	videoPlayer=_videoPlayer;
	videoOriLock();
	videoPlayer.parentNode.insertAdjacentElement('beforeend',gestureData.tipBox);
	if(settings['视频下载']){
		await findVideoBox()?.insertAdjacentElement('beforeend',videoPlayer._downloadTip_);
		if(window._urlObjects_[videoPlayer.src]){
			videoPlayer._downloadTip_.textContent='正在捕获';
			videoPlayer._downloadTip_.buffers=window._urlObjects_[videoPlayer.src].sourceBuffers;
			window._urlObjects_[videoPlayer.src]._downloadTip_=videoPlayer._downloadTip_;
			delete window._urlObjects_[videoPlayer.src];
		}else if(videoPlayer._downloadTip_.textContent==='未加载'){
			if(!videoPlayer.src && videoPlayer.children.length){videoPlayer.src=videoPlayer.firstChild.src;}
			if(videoPlayer.src.indexOf('blob:') && videoPlayer.src){videoPlayer._downloadTip_.textContent='可下载';}
		}
	}
}
//video方向锁定
function videoOriLock(){
	if(!videoPlayer.videoWidth){if(!videoPlayer.error && document.contains(videoPlayer)){setTimeout(videoOriLock,100);}oriLock=0;return;}
	oriLock=+(videoPlayer.videoWidth>videoPlayer.videoHeight);
	if(fullsState>0 && oriLock){top.postMessage({'type':'GYRO'},'*');}
	else{screen.orientation.unlock();}
}
//video框架锁定
function iframeLock(){
	if(top!==self && !window._isShow_){GM_setValue('isShow',Date.now());}
}
//video全屏/退出全屏
async function videoFullScreen(){
	if(resizeTimer){return;}
	if(document.fullscreen){await document.exitFullscreen()?.catch(Date);}
	else if(videoPlayer){await findVideoBox()?.requestFullscreen()?.catch(Date);}
	else if(iframeEles.length){GM_setValue('fullscreen',Date.now());}
}
//获取video全屏样式容器
function findVideoBox(player=videoPlayer){
	if(!document.contains(player)){return null;}
	if(player._videoBox_?.contains(player) && (document.fullscreen || player._boxHeight_>=player._videoBox_.clientHeight)){return player._videoBox_;}
	player._videoBox_=player.parentNode;player.setAttribute('_videobox_','');
	let parentEle=player._videoBox_.parentNode,videoStyle=getComputedStyle(player),childStyle=getComputedStyle(player._videoBox_),childWidth=0,childHeight=0,_childWidth=0,_childHeight=0;
	if(player._videoBox_.offsetParent===parentEle){
		childWidth=Math.round(player.offsetWidth+(+videoStyle.marginLeft.slice(0,-2))+(+videoStyle.marginRight.slice(0,-2)));
		childHeight=Math.round(player.offsetHeight+(+videoStyle.marginTop.slice(0,-2))+(+videoStyle.marginBottom.slice(0,-2)));
		_childWidth=Math.round(player._videoBox_.offsetWidth+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2)));
		_childHeight=Math.round(player._videoBox_.offsetHeight+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2)));
	}else{
		childWidth=Math.round(player.offsetWidth+(+videoStyle.left.slice(0,-2) || 0)+(+videoStyle.marginLeft.slice(0,-2))+(+videoStyle.marginRight.slice(0,-2))+(+videoStyle.right.slice(0,-2) || 0));
		childHeight=Math.round(player.offsetHeight+(+videoStyle.top.slice(0,-2) || 0)+(+videoStyle.marginTop.slice(0,-2))+(+videoStyle.marginBottom.slice(0,-2))+(+videoStyle.bottom.slice(0,-2) || 0));
		_childWidth=Math.round(player._videoBox_.offsetWidth+(+childStyle.left.slice(0,-2) || 0)+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2))+(+childStyle.right.slice(0,-2) || 0));
		_childHeight=Math.round(player._videoBox_.offsetHeight+(+childStyle.top.slice(0,-2) || 0)+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2))+(+childStyle.bottom.slice(0,-2) || 0));
	}
	childWidth=(childWidth>_childWidth) ? childWidth : _childWidth;
	childHeight=(childHeight>_childHeight) ? childHeight : _childHeight;
	while(childWidth>=parentEle.clientWidth && parentEle.nodeName!='BODY'){
		if(childHeight<parentEle.clientHeight){
			let isBreak=1;
			for(let childEle of parentEle.children){
				childStyle=getComputedStyle(childEle);
				childHeight=Math.round(childEle.offsetHeight+(+childStyle.top.slice(0,-2) || 0)+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2))+(+childStyle.bottom.slice(0,-2) || 0));
				if(childHeight===parentEle.clientHeight){isBreak=0;break;}
			}
			if(isBreak){break;}
		}
		player._videoBox_.setAttribute('_videobox_','');
		player._videoBox_=parentEle;player._boxHeight_=childHeight;
		childStyle=getComputedStyle(parentEle);
		if(parentEle.offsetParent===parentEle.parentNode){
			_childWidth=Math.round(parentEle.offsetWidth+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2)));
			_childHeight=Math.round(parentEle.offsetHeight+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2)));
		}else{
			_childWidth=Math.round(parentEle.offsetWidth+(+childStyle.left.slice(0,-2) || 0)+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2))+(+childStyle.right.slice(0,-2) || 0));
			_childHeight=Math.round(parentEle.offsetHeight+(+childStyle.top.slice(0,-2) || 0)+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2))+(+childStyle.bottom.slice(0,-2) || 0));
		}
		childWidth=(childWidth>_childWidth) ? childWidth : _childWidth;
		childHeight=(childHeight>_childHeight) ? childHeight : _childHeight;
		parentEle=parentEle.parentNode;
	}
	player._videoBox_.setAttribute('_videobox_','outer');
	return player._videoBox_;
}
//全屏检测事件
function regRESIZE(){
	let videoCss=addStyle(''),stopResize=()=>{resizeTimer=0;};
	window.addEventListener('resize',()=>{
		clearTimeout(resizeTimer);resizeTimer=setTimeout(stopResize,200);
		if(document.fullscreen && !fullsState){
			fullsState=document.fullscreenElement;
			if(fullsState.nodeName==='IFRAME'){fullsState=-1;return;}
			let srcFindVideo=fullsState.getElementsByTagName('video'),srcVideo=(fullsState.nodeName==='VIDEO') ? fullsState : srcFindVideo[0];
			if(!fullsState.hasAttribute('_videobox_') && (!srcVideo || srcFindVideo.length>1 || (srcVideo._videoBox_.offsetWidth*srcVideo._videoBox_.offsetHeight/fullsState.offsetWidth/fullsState.offsetHeight)<0.9)){fullsState=-1;videoCss.textContent='';return;}
			if(srcVideo!==videoPlayer){videoPlayer?.pause();setVideo(srcVideo);}
			fullsState=1;if(oriLock){top.postMessage({'type':'GYRO'},'*');}
			videoCss.textContent='*[_videobox_]{inset:0 !important;margin:0 !important;padding:0 !important;transform:none !important;}*[_videobox_=""]{width:100% !important;height:100% !important;max-width:100% !important;max-height:100% !important;}video{position:fixed !important;object-fit:contain !important;}';
		}else if(fullsState && !document.fullscreen){fullsState=0;videoCss.textContent='';}
	},true);
}

/*视频下载模块*/
if(settings['视频下载']){
	//原始方法存储
	const createObjectURL=URL.createObjectURL,addSourceBuffer=MediaSource.prototype.addSourceBuffer,appendBuffer=SourceBuffer.prototype.appendBuffer,endOfStream=MediaSource.prototype.endOfStream;
	//初始化视频下载
	window._initDownload_=(player)=>{
		player._downloadTip_=document.createElement('div');
		player._downloadTip_.style.cssText='position:absolute;right:0;top:20px;background:#3498db;border-radius:20px 0 0 20px;text-align:center;padding:20px;line-height:0px;color:#fff;min-width:60px;font-size:16px;font-family:system-ui;z-index:2147483647;';
		player._downloadTip_.target=player;
		player._downloadTip_.textContent='未加载';
		if(window._urlObjects_[player.src]){
			player._downloadTip_.textContent='正在捕获';
			player._downloadTip_.buffers=window._urlObjects_[player.src].sourceBuffers;
			window._urlObjects_[player.src]._downloadTip_=player._downloadTip_;
			delete window._urlObjects_[player.src];
		}else{
			if(!player.src && player.children.length){player.src=player.firstChild.src;}
			if(player.src.indexOf('blob:') && player.src){player._downloadTip_.textContent='可下载';}
		}
		player._downloadTip_.onclick=window._downloadVideo_;
		player._videoBox_.insertAdjacentElement('beforeend',player._downloadTip_);
	}
	//下载视频
	window._downloadVideo_=function(data){
		if(this.textContent==='未加载'){return;}
		if(data.target){data=this;data.src=this.target.src;}
		let buffers=data.buffers;
		if(top!==self){
			let _buffers=[];
			for(let Ti=0,len=buffers.length;Ti<len;++Ti){
				_buffers.push({'mime':buffers[Ti]._mime_,'bufferList':buffers[Ti]._bufferList_});
			}
			top.postMessage({'type':'download','buffers':_buffers,'src':data.src},'*');
			return;
		}
		let a=document.createElement('a');a.download=document.title;a.style.display='none';document.body.insertAdjacentElement('beforeend',a);
		if(data.src.indexOf('blob:') && data.src){a.href=data.src;a.click();}
		else if(buffers.length){
			for(let Ti=0,len=buffers.length;Ti<len;++Ti){
				a.href=URL.createObjectURL(new Blob(buffers[Ti]._bufferList_,{'type':buffers[Ti]._mime_}));
				a.click();
				URL.revokeObjectURL(a.href);
			}
		}
		a.remove();
	}
	//存储MediaSource
	window._urlObjects_={};
	URL.createObjectURL=(obj)=>{
		let url=createObjectURL(obj);
		if(obj.sourceBuffers){window._urlObjects_[url]=obj;}
		return url;
	}
	//添加捕获
	MediaSource.prototype.addSourceBuffer=function(mime){
		let sourceBuffer=addSourceBuffer.call(this,mime);
		sourceBuffer._bufferList_=[];
		sourceBuffer._mime_=mime;
		sourceBuffer._mediaSource_=this;
		return sourceBuffer;
	}
	//捕获片段
	SourceBuffer.prototype.appendBuffer=function(buffer){
		this._bufferList_.push(buffer);
		if(this._mime_.indexOf('video')>-1 && this._mediaSource_._downloadTip_){this._mediaSource_._downloadTip_.textContent='已捕获'+this._bufferList_.length+'个片段';}
		appendBuffer.call(this,buffer);
	}
	//捕获完成
	MediaSource.prototype.endOfStream=function(){
		if(this._downloadTip_){this._downloadTip_.textContent='可下载';}
		endOfStream.call(this);
	}
}

/*功能补充模块*/
//功能补充变量
let videoEles=document.getElementsByTagName('video'),linkEles=document.getElementsByTagName('a'),iframeEles=document.getElementsByTagName('iframe'),checkTimer=0,linkNum=0,allowCopy=0;
//修改Trusted-Types策略
window.trustedTypes?.createPolicy('default',{createHTML:string=>string,createScript:string=>string,createScriptURL:string=>string});
//设置shadow-root (open)
Element.prototype.attachShadow=function(){
	if(!window._shadowList_){window._shadowList_=[];}
	let shadowRoot=attachShadow.call(this,{mode:'open'});
	window._shadowList_.push(shadowRoot);
	return shadowRoot;
}
//页面加载检测
async function loadCheck(){
	//检测shadowRoot中的视频
	if(window._shadowList_){
		videoEles=[...document.getElementsByTagName('video')];
		for(let Ti=0,len=window._shadowList_.length;Ti<len;++Ti){
			videoEles.push(...window._shadowList_[Ti].querySelectorAll('video'));
		}
	}
	//video播放事件绑定
	if(videoEles.length){
		if(!gestureData.tipBox){
			//启动全屏检测
			regRESIZE();
			if(top!==self){top.postMessage({'type':'forceFullScreen'},'*');}
			//tip操作提示
			gestureData.tipBox=document.createElement('div');
			gestureData.tipBox.style.cssText='width:100px;height:50px;position:absolute;text-align:center;top:calc(50% - 25px);left:calc(50% - 50px);display:none;color:#1e87f0;font-size:22px;line-height:50px;background-color:rgba(0,0,0,0.6);border-radius:20px;font-family:system-ui;z-index:2147483647;';
		}
		for(let Ti=0,len=videoEles.length;Ti<len;++Ti){
			if(!videoEles[Ti]._videoBox_ && videoEles[Ti].offsetHeight){
				await findVideoBox(videoEles[Ti]);
				if(settings['视频下载']){await window._initDownload_(videoEles[Ti]);}
				if(!videoEles[Ti].paused){setVideo(videoEles[Ti]);}
				videoEles[Ti].addEventListener('playing',setVideo,true);
			}
		}
	}
	//链接加速事件绑定
	if(linkEles.length>linkNum && settings['链接加速']){
		if(!window._prefetch_){
			window._prefetch_=document.createElement('div');
			window._prefetch_.style.display='none';
		}
		for(let Ti=0,len=linkEles.length;Ti<len;++Ti){
			if(!linkEles[Ti]._prefetch_){
				linkEles[Ti]._prefetch_=1;if(!regURL.test(linkEles[Ti].href)){continue;}
				linkEles[Ti].addEventListener('touchstart',linkQuicken,true);
			}
		}
	}
	linkNum=linkEles.length;checkTimer=0;
}
//链接加速
function linkQuicken(){
	window._prefetch_.innerHTML='<iframe style="width:0px;height:0px;display:none;" src="'+this.href.replace(/^https?:/,'')+'" loading="eager" importance="high" onload="this.remove();" onerror="this.remove();" sandbox></iframe>';
	document.body.insertAdjacentElement('beforeend',window._prefetch_);
}
//复制文本
function copyText(text){
	allowCopy=1;GM_setClipboard(text);
}
//添加样式表
function addStyle(css){
	let style=document.createElement('style');
	style.textContent=css;
	document.head.insertAdjacentElement('beforeend',style);
	return style;
}
//复制坐标对象
function copyTouch(oldObj){
	let newObj={};
	for(let Ti in oldObj){
		if(Ti==='target'){continue;}
		newObj[Ti]=oldObj[Ti];
	}
	return newObj;
}
//手势功能设置UI
function openSet(){
	let gestureName='',gesturePath='',gestureBox=document.createElement('div'),pathEle=null,_clickTimer=0;
	//页面生成
	addStyle('*{overflow:hidden !important;}'+
				'#_gestureBox_{background-color:#fff;width:100%;height:100%;position:fixed;padding:0;margin:0;inset:0;overflow-y:auto !important;z-index:2147483647;}'+
				'#_gestureBox_ *{font-family:system-ui;margin:0;padding:0;text-align:center;font-size:5vmin;line-height:12vmin;user-select:none !important;transform:none;text-indent:0;}'+
				'#_gestureBox_ ::placeholder{color:#999;font-size:2.5vmin;line-height:6vmin;}'+
				'#_gestureBox_ h1{width:60%;height:12vmin;color:#0074d9;background-color:#dee6ef;margin:3vmin auto;border-radius:12vmin;box-shadow:0.9vmin 0.9vmin 3vmin #dfdfdf;}'+
				'#_gestureBox_ #_addGesture_{width:14vmin;height:14vmin;margin:3vmin auto;line-height:14vmin;background-color:#dee6ef;color:#032e58;font-size:7.5vmin;border-radius:15vmin;box-shadow:0.3vmin 0.3vmin 1.5vmin #dfdfdf;}'+
				'#_gestureBox_ ._gestureLi_{height:18vmin;width:100%;border-bottom:0.3vmin solid #dfdfdf;}'+
				'#_gestureBox_ ._gestureLi_ p{margin:3vmin 0 0 1%;width:38%;height:12vmin;border-left:1.8vmin solid;color:#ffb400;background-color:#fff1cf;float:left;white-space:nowrap;text-overflow:ellipsis;text-shadow:0.3vmin 0.3vmin 3vmin #ffcb56;}'+
				'#_gestureBox_ ._gestureLi_ ._gesturePath_{margin:3vmin 0 0 3%;float:left;width:38%;height:12vmin;background-color:#f3f3f3;color:#000;box-shadow:0.3vmin 0.3vmin 1.5vmin #ccc9c9;border-radius:3vmin;white-space:nowrap;text-overflow:ellipsis;}'+
				'#_gestureBox_ ._gestureLi_ ._delGesture_{margin:3vmin 2% 0 0;width:15vmin;height:12vmin;float:right;color:#f00;text-decoration:line-through;}'+
				'#_gestureBox_ #_revisePath_{background-color:rgba(0,0,0,0.7);width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#_gestureBox_ #_revisePath_ span{width:15vmin;height:15vmin;font-size:12.5vmin;line-height:15vmin;position:absolute;}'+
				'#_gestureBox_ #_revisePath_ div{color:#3339f9;position:absolute;width:30%;height:12vmin;font-size:10vmin;bottom:15%;}'+
				'#_gestureBox_ #_revisePath_ p{color:#3ba5d8;position:absolute;top:15%;font-size:10vmin;height:12vmin;width:100%;}'+
				'#_gestureBox_ #_revisePath_ #_path_{top:40%;color:#ffee03;height:100%;word-wrap:break-word;font-size:15vmin;line-height:18vmin;}'+
				'#_gestureBox_ #_editGesture_{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#_gestureBox_ #_editGesture_ p{color:#3339f9;font-size:7.5vmin;text-align:left;margin:6vmin 0 0 9vmin;width:100%;height:9vmin;line-height:9vmin;}'+
				'#_gestureBox_ #_editGesture_ #_gestureName_{margin-top:6vmin;width:80%;height:12vmin;color:#000;border:0.3vmin solid #dadada;border-radius:3vmin;text-align:left;padding:0 3vmin;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label{display:inline-block;margin-top:6vmin;position:relative;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>input{position:absolute;top:0;left:-6vmin;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>div{width:20vw;border:#ddd solid 0.3vmin;height:12vmin;color:#666;position:relative;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>input:checked + div{border:#d51917 solid 0.3vmin;color:#d51917;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>input + div:after{top:auto;left:auto;bottom:-3vmin;right:0;transition:none;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>input:checked + div:after{content:"";display:block;border:none;width:6vmin;height:6vmin;background-color:#d51917;transform:skewY(-45deg);position:absolute;}'+
				'#_gestureBox_ #_editGesture_ ._label_box_>label>input:checked + div:before{content:"";display:block;width:0.9vmin;height:2.4vmin;border-right:#fff solid 0.6vmin;border-bottom:#fff solid 0.6vmin;transform:rotate(35deg);position:absolute;bottom:0.6vmin;right:1.2vmin;z-index:1;}'+
				'#_gestureBox_ #_editGesture_ #_pathFn_{overflow-y:auto !important;width:80%;margin-top:6vmin;height:40%;text-align:left;line-height:6vmin;padding:3vmin;border:0.3vmin solid #dadada;border-radius:3vmin;}'+
				'#_gestureBox_ #_editGesture_ button{width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;display:inline-block;color:#fff;background-color:#2866bd;margin:6vmin 3vmin 0 3vmin;border:none;}'+
				'#_gestureBox_ #_settingsBox_{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#_gestureBox_ #_settingsBox_ p{color:#3339f9;text-align:left;margin:9vmin 0 0 9vmin;float:left;height:6vmin;line-height:6vmin;clear:both;}'+
				'#_gestureBox_ #_settingsBox_ ._slideRail_{overflow:initial !important;width:55%;background-color:#a8a8a8;float:left;margin:12vmin 0 0 3vmin;height:0.6vmin;position:relative;}'+
				'#_gestureBox_ #_settingsBox_ ._slideRail_ ._slideButton_{line-height:9vmin;color:#fff;background-color:#2196f3;min-width:9vmin;height:9vmin;border-radius:9vmin;font-size:4vmin;position:absolute;top:-4.5vmin;box-shadow:0.3vmin 0.3vmin 1.8vmin #5e8aee;padding:0 1vmin;}'+
				'#_gestureBox_ #_settingsBox_ ._switch_{position:relative;display:inline-block;width:18vmin;height:9vmin;float:left;margin:7.5vmin 42% 0 3vmin;}'+
				'#_gestureBox_ #_settingsBox_ ._switch_ input{display:none;}'+
				'#_gestureBox_ #_settingsBox_ ._slider_{border-radius:9vmin;position:absolute;cursor:pointer;inset:0;background-color:#ccc;transition:0.4s;}'+
				'#_gestureBox_ #_settingsBox_ ._slider_:before{border-radius:50%;position:absolute;content:"";height:7.5vmin;width:7.5vmin;left:0.6vmin;bottom:0.6vmin;background-color:white;transition:0.4s;}'+
				'#_gestureBox_ #_settingsBox_ input:checked + ._slider_{background-color:#2196F3;}'+
				'#_gestureBox_ #_settingsBox_ input:checked + ._slider_:before{transform:translateX(9vmin);}'+
				'#_gestureBox_ #_settingsBox_ #_saveSettings_{display:block;clear:both;width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;color:#fff;background-color:#2866bd;border:none;margin:12vmin 0 0 calc(50% - 15vmin);float:left;}');
	gestureBox.id='_gestureBox_';
	document.body.insertAdjacentElement('beforeend',gestureBox);
	gestureBox.innerHTML='<h1 id="_openSettings_">手势轨迹设置</h1><div id="_addGesture_">+</div><div id="_gestureUL_"></div>'+
					'<div id="_revisePath_"><span style="top:0;left:0;text-align:left;">┌</span><span style="top:0;right:0;text-align:right;">┐</span><span style="bottom:0;left:0;text-align:left;">└</span><span style="bottom:0;right:0;text-align:right;">┘</span>'+
					'<p>请滑动手指</p><p id="_path_"></p><div id="_clearPath_" style="left:10%;">清除</div><div id="_cancleRevise_" style="right:10%;">保存</div></div>'+
					'<div id="_editGesture_"><p>手势名称：</p><input type="text" id="_gestureName_" maxlength="12" placeholder="最大输入12个字符">'+
					'<p>手势类型：</p><div class="_label_box_"><label><input type="radio" id="_G_" name="_gestureType_" value=""><div>一般</div></label><label><input type="radio" id="_T_" name="_gestureType_" value="T"><div>文字</div></label><label><input type="radio" id="_I_" name="_gestureType_" value="I"><div>图片</div></label><label><input type="radio" id="_V_" name="_gestureType_" value="V"><div>视频</div></label></div>'+
					'<p>手势执行脚本：</p><textarea id="_pathFn_" placeholder="可用变量说明↓\n 	gestureData：手势数据常量,如果你需要在不同手势间传递变量,你可以赋值gestureData.变量名=变量值；\n	gestureData.touchEle：手指触摸的源元素；\n	gestureData.selectWords：选中的文字；\n	gestureData.touchStart：触摸开始坐标对象；\n	gestureData.touchEnd：触摸最新坐标对象；\n	path：滑动的路径；\n	videoPlayer：正在播放的视频元素。'+
					'\n\n可用方法说明↓\n	addStyle(CSS样式)：将CSS样式添加到网页上；\n	runGesture()：以path为路径执行手势,你可以修改path后执行此方法；\n	GM_openInTab(链接)：打开链接；\n	copyText(文本)：复制文本到剪切板；\n	GM_setValue(变量名,变量值)：在油猴中存储数据；\n	GM_getValue(变量名,默认值)：从油猴中取出数据,没有则使用默认值。'+
					'\n\n可识别代码注释说明(仅对一般手势生效)↓\n	默认情况：存在iframe时，所有手势只会在触发手势的页面对象执行！\n 	添加/*ONLY TOP*/：手势只在顶级页面对象执行；\n	添加/*WITH TOP*/：手势同时在当前页面对象和顶级页面对象执行。"></textarea>'+
					'<div style="width:100%;height:0.3vmin;"></div><button id="_saveGesture_">保存</button><button id="_closeEdit_">关闭</button></div>'+
					'<div id="_settingsBox_"><h1>功能开关设置</h1><span id="_settingList_"></span><button id="_saveSettings_">保存</button></div>';
	pathEle=document.getElementById('_path_');

	//编辑手势
	function editGesture(){
		gestureName=this.parentNode.getAttribute('name');
		if(['打开设置','视频全屏','手势穿透'].indexOf(gestureName)>-1){alert('该手势脚本无法修改！');return;}
		gesturePath=this.parentNode.getAttribute('path');
		let selectType=(/^[TIV]/.test(gesturePath)) ? '_'+gesturePath.slice(0,1)+'_' : '_G_';
		document.getElementById(selectType).click();
		document.getElementById('_gestureName_').value=gestureName;
		document.getElementById('_pathFn_').value=pathFn[gestureName];
		document.getElementById('_editGesture_').style.display='block';
	}
	//修改路径
	function revisePath(){
		gestureName=this.parentNode.getAttribute('name');
		gesturePath=this.parentNode.getAttribute('path');
		pathEle.textContent='';
		window.removeEventListener('touchmove',touchMove,true);
		document.getElementById('_revisePath_').style.display='block';
	}
	//删除手势
	function delGesture(){
		gestureName=this.parentNode.getAttribute('name');
		if(['打开设置','视频全屏','手势穿透'].indexOf(gestureName)>-1){alert('该手势无法删除！');return;}
		if(!confirm('确定删除"'+gestureName+'"手势')){return;}
		gesturePath=this.parentNode.getAttribute('path');
		delete pathFn[gestureName];
		delete gesture[gesturePath];
		GM_setValue('pathFn',pathFn);
		GM_setValue('gesture',gesture);
		init();
	}
	//滑动条
	function silideBar(e){
		e.preventDefault();fingersNum=2;
		let diffX=e.changedTouches[0].clientX-gestureData.touchStart.clientX,
		leftPX=(+this.style.left.slice(0,-2))+diffX,vmin=this.offsetWidth/2,setArr=settings[this.id];
		leftPX=(leftPX<-vmin) ? -vmin : ((leftPX>(diffX=this.parentNode.offsetWidth-vmin)) ? diffX : leftPX);
		this.style.left=leftPX+'px';
		this.textContent=((leftPX+vmin)/this.parentNode.offsetWidth*(setArr[2]-setArr[1])+setArr[1]).toFixed(setArr[3]);
		gestureData.touchStart=e.changedTouches[0];
	}
	//长按执行
	function _longPress(){if(!/[●○▼▽]$/.test(pathEle.textContent)){isClick=0;startPoint=gestureData.touchEnd;pathEle.textContent+='●';}}
	//持续滑动执行
	function _slidingRun(){slideTime=0;pathEle.textContent+='▼';}
	//点击执行
	function _clickRun(){if(!/[○▼▽]$/.test(pathEle.textContent)){pathEle.textContent+='◆';}}
	//界面初始化
	function init(){
		document.getElementById('_gestureUL_').textContent='';
		for(gestureName in pathFn){
			gesturePath='';
			for(let Ti in gesture){
				if(gesture[Ti]===gestureName){gesturePath=Ti;break;}
			}
			document.getElementById('_gestureUL_').innerHTML+='<div class="_gestureLi_" name="'+gestureName+'" path="'+gesturePath+'"><p>'+gestureName+'</p><div class="_gesturePath_">'+gesturePath+'</div><div class="_delGesture_">删除</div></div>';
		}
		//操作绑定
		let gestureEle=document.querySelectorAll('#_gestureBox_ ._gestureLi_ p');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',editGesture,true);
		}
		gestureEle=document.querySelectorAll('#_gestureBox_ ._gestureLi_ ._gesturePath_');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',revisePath,true);
		}
		gestureEle=document.querySelectorAll('#_gestureBox_ ._gestureLi_ ._delGesture_');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',delGesture,true);
		}
	}
	init();

	//.新建手势
	document.getElementById('_addGesture_').addEventListener('click',()=>{
		gestureName=gesturePath='';
		document.getElementById('_G_').click();
		document.getElementById('_gestureName_').value='';
		document.getElementById('_pathFn_').value='';
		document.getElementById('_editGesture_').style.display='block';
	},true);
	//保存手势
	document.getElementById('_saveGesture_').addEventListener('click',()=>{
		if(!document.getElementById('_gestureName_').value){alert('请输入手势名称！');return;}
		if(pathFn[document.getElementById('_gestureName_').value] && gestureName!==document.getElementById('_gestureName_').value){alert('该手势名称已被占用！');return;}
		delete pathFn[gestureName];
		delete gesture[gesturePath];
		let typeEle=document.getElementsByName('_gestureType_');
		for(let Ti=0,len=typeEle.length;Ti<len;++Ti){
			if(typeEle[Ti].checked){
				gesturePath=typeEle[Ti].value+((gestureName && gesturePath.indexOf('[')<0) ? ((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(1) : gesturePath) : ('['+document.getElementById('_gestureName_').value+']'));
				break;
			}
		}
		gesture[gesturePath]=document.getElementById('_gestureName_').value;
		pathFn[document.getElementById('_gestureName_').value]=document.getElementById('_pathFn_').value;
		GM_setValue('_pathFn_',pathFn);
		GM_setValue('gesture',gesture);
		init();
		document.getElementById('_editGesture_').style.display='none';
	},true);
	//关闭编辑
	document.getElementById('_closeEdit_').addEventListener('click',()=>{
		document.getElementById('_editGesture_').style.display='none';
	},true);
	//路径修改事件
	document.getElementById('_revisePath_').addEventListener('touchstart',()=>{
		if(fingersNum>1){return;}
		clearTimeout(gestureTimer);clearTimeout(_clickTimer);
		gestureTimer=setTimeout(_longPress,300);
	},true);
	document.getElementById('_revisePath_').addEventListener('touchmove',(e)=>{
		e.preventDefault();clearTimeout(gestureTimer);
		gestureData.touchEnd=e.changedTouches[0];
		if(/[○▼▽]$/.test(pathEle.textContent) || fingersNum>1){return;}
		let xLen=(gestureData.touchEnd.screenX-startPoint.screenX)**2,yLen=(gestureData.touchEnd.screenY-startPoint.screenY)**2,
		direction=(xLen>yLen) ? ((gestureData.touchEnd.screenX>startPoint.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY>startPoint.screenY) ? '↓' : '↑'),
		nowTime=Date.now(),pathLen=xLen+yLen,lastIcon=pathEle.textContent.slice(-1);
		if((lastIcon===direction && pathLen>limit/576) || pathLen>limit){
			if(lastIcon!==direction){pathEle.textContent+=direction;slideTime=nowTime;}
			startPoint=gestureData.touchEnd;
			if(slideTime && nowTime-slideTime>300){_slidingRun();}
		}else if(pathLen>limit/100){isClick=slideTime=0;}
		gestureTimer=setTimeout(_longPress,300);
	},true);
	document.getElementById('_revisePath_').addEventListener('touchend',(e)=>{
		if(!isClick || fingersNum>0){return;}
		if(path.indexOf('◆◆')>-1){path='';
			switch(pathEle.textContent.slice(-1)){
				case '●':{pathEle.textContent=pathEle.textContent.slice(0,-1)+'○';break;}
				case '○':{pathEle.textContent=pathEle.textContent.slice(0,-1)+'●';break;}
				case '▼':{pathEle.textContent=pathEle.textContent.slice(0,-1)+'▽';break;}
				case '▽':{pathEle.textContent=pathEle.textContent.slice(0,-1)+'▼';break;}
				default:{pathEle.textContent+='◆';setTimeout(_clickRun,100);break;}
			}
		}else{_clickTimer=setTimeout(_clickRun,200);}
	});
	//清除路径
	document.getElementById('_clearPath_').addEventListener('touchend',(e)=>{
		e.stopPropagation();
		if(!isClick || fingersNum>0){return;}
		if(path.indexOf('◆◆')>-1){path='';pathEle.textContent='';}
		else{pathEle.textContent=pathEle.textContent.slice(0,-1);}
	});
	//保存修改路径
	document.getElementById('_cancleRevise_').addEventListener('touchend',(e)=>{
		e.stopPropagation();e.preventDefault();
		if(!isClick || fingersNum>0){return;}
		if(pathEle.textContent){
			if(gestureName==='视频全屏' && pathEle.textContent.slice(-1)!=='◆'){alert('视频全屏需要以◆结尾！');return;}
			if(gesture[pathEle.textContent]==='手势穿透'){alert('路径与"手势穿透"功能冲突！');return;}
			if(/^[TIV]/.test(gesturePath)){pathEle.textContent=gesturePath.slice(0,1)+pathEle.textContent;}
			delete gesture[gesturePath];
			if(gesture[pathEle.textContent]){
				let pathTXT=((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(0,1) : '')+'['+gesture[pathEle.textContent]+']';
				gesture[pathTXT]=gesture[pathEle.textContent];
			}
			gesture[pathEle.textContent]=gestureName;
			GM_setValue('gesture',gesture);
			init();
		}
		window.addEventListener('touchmove',touchMove,{capture:true,passive:true});
		document.getElementById('_revisePath_').style.display='none';
	});
	//打开功能开关设置
	document.getElementById('_openSettings_').addEventListener('click',()=>{
		gestureBox.style.cssText='overflow-y:hidden !important';
		document.getElementById('_settingsBox_').style.display='block';
		let settingList=document.getElementById('_settingList_');
		settingList.textContent='';
		for(let Ti in settings){
			settingList.innerHTML+='<p>'+Ti+'：</p>';
			if(typeof(settings[Ti])==='boolean'){
				settingList.innerHTML+='<label class="_switch_"><input type="checkbox" id="'+Ti+'" '+((settings[Ti]) ? 'checked' : '')+'><div class="_slider_"></div></label>';
			}else if(typeof(settings[Ti])==='object'){
				settingList.innerHTML+='<div class="_slideRail_"><div class="_slideButton_" id="'+Ti+'"></div></div>';
				let slideButton=document.getElementById(Ti),
				leftPX=slideButton.parentNode.offsetWidth*(settings[Ti][0]-settings[Ti][1])/(settings[Ti][2]-settings[Ti][1])-slideButton.offsetWidth/2;
				slideButton.style.left=leftPX+'px';
				slideButton.textContent=settings[Ti][0].toFixed(settings[Ti][3]);
			}
		}
		let slideList=document.getElementsByClassName('_slideButton_');
		for(let Ti=0,len=slideList.length;Ti<len;++Ti){
			slideList[Ti].addEventListener('touchmove',silideBar,true);
		}
	},true);
	//保存功能开关设置
	document.getElementById('_saveSettings_').addEventListener('click',()=>{
		gestureBox.style.cssText='';
		for(let Ti in settings){
			if(typeof(settings[Ti])==='boolean'){
				settings[Ti]=document.getElementById(Ti).checked;
			}else if(typeof(settings[Ti])==='object'){
				settings[Ti][0]=+document.getElementById(Ti).textContent;
			}
		}
		GM_setValue('settings',settings);
		document.getElementById('_settingsBox_').style.display='none';
	},true);
}

/*事件注册模块*/
(function(){
	if(top===self){
		//清除后退定时器
		window.addEventListener('popstate',()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);
		window.addEventListener('beforeunload',()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);
		//接收iframe数据
		window.addEventListener('message',async (e)=>{
			let data=e.data;
			switch(data.type){
				case 'GYRO':{//锁定横屏模式
					await screen.orientation.lock('landscape')?.catch(Date);
				break;}
				case 'forceFullScreen':{//iframe强制可全屏
					for(let Ti=0,len=iframeEles.length;Ti<len;++Ti){
						if(iframeEles[Ti].contentWindow===e.source){
							if(!iframeEles[Ti].allowFullscreen){
								iframeEles[Ti].allowFullscreen=true;
								if(iframeEles[Ti].getAttribute('src') && regURL.test(iframeEles[Ti].src)){
									iframeEles[Ti].src=iframeEles[Ti].src;
								}
							}
							break;
						}
					}
				break;}
				case 'runPath':{//iframe手势在顶级页面执行
					for(let Ti=0,len=iframeEles.length;Ti<len;++Ti){
						if(iframeEles[Ti].contentWindow===e.source){
							let ifrRect=iframeEles[Ti].getBoundingClientRect();
							gestureData.touchStart=data.gestureData.touchStart;gestureData.touchEnd=data.gestureData.touchEnd;
							gestureData.touchStart.target=gestureData.touchEnd.target=gestureData.touchEle=iframeEles[Ti];
							gestureData.touchStart.pageX=gestureData.touchStart.clientX+=ifrRect.x;
							gestureData.touchStart.pageY=gestureData.touchStart.clientY+=ifrRect.y;
							gestureData.touchEnd.pageX=gestureData.touchEnd.clientX+=ifrRect.x;
							gestureData.touchEnd.pageY=gestureData.touchEnd.clientY+=ifrRect.y;
							break;
						}
					}
					path=data.runPath;setTimeout(runGesture);
				break;}
				case 'pushTouch':{//iframe手势坐标传递
					let ifrRect=gestureData.touchEle.getBoundingClientRect();
					gestureData.touchEnd=data.gestureData.touchEnd;
					gestureData.touchEnd.target=gestureData.touchEle;
					gestureData.touchEnd.pageX=gestureData.touchEnd.clientX+=ifrRect.x;
					gestureData.touchEnd.pageY=gestureData.touchEnd.clientY+=ifrRect.y;
				break;}
				case 'download':{//iframe视频下载
					window._downloadVideo_(data);
				break;}
			}
		},true);
	}else{
		//iframe视频全屏
		GM_addValueChangeListener('fullscreen',async (name,old_value,new_value,remote)=>{
			if(!document.hidden && window._isShow_){
				await findVideoBox()?.requestFullscreen()?.catch(Date);
			}
		});
		//iframe锁定
		GM_addValueChangeListener('isShow',(name,old_value,new_value,remote)=>{
			if(!document.hidden){window._isShow_=!remote;}
		});
	}
	//加载检测
	checkTimer=setTimeout(loadCheck,200);
	mObserver.observe(document,{childList:true,subtree:true});
	//手势事件注册
	window.addEventListener('touchstart',touchStart,{capture:true,passive:false});
	window.addEventListener('touchmove',touchMove,{capture:true,passive:true});
	window.addEventListener('touchend',touchEnd,{capture:true,passive:false});
	window.addEventListener('touchcancel',touchEnd,{capture:true,passive:false});
	window.addEventListener('contextmenu',(e)=>{if(path.indexOf("I")>-1 && gestureData.touchEle.src!==location.href){e.preventDefault();}},true);//长按图片时禁止弹出菜单
	if(settings['避免断触']){window.addEventListener('click',delayClick,true);}
	//禁止网页检测焦点
	document.addEventListener('visibilitychange',(e)=>{e.stopImmediatePropagation();},true);//页面切换检测
	window.addEventListener('pagehide',(e)=>{e.stopImmediatePropagation();},true);
	window.addEventListener('blur',(e)=>{e.stopImmediatePropagation();});
	//禁止网页修改复制内容
	window.addEventListener('copy',(e)=>{if(allowCopy){allowCopy=0;return;}e.stopImmediatePropagation();e.stopPropagation();},true);
	//解除选中限制
	addStyle('*{user-select:text !important;touch-action:manipulation;}');
})();