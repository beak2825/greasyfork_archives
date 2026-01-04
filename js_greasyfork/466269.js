// ==UserScript==
// @name Mobile browser Gestures Extended (MbGE)
// @name:en Mobile browser Gestures Extended (MbGE)
// @description Add touch gesture functions to mobile browsers, such as ↓↑back to top, ↑↓back to bottom, →←back, ←→forward, →↓close tab, →↑restore the page just closed, etc. There are text gestures, image gestures, video gestures and more. You can also customize your gestures. Kiwi browser, Yandex browser and Lemur browser are recommended.
// @description:en	Add touch gestures to mobile browsers. For example, ↓↑: go to the top, ↑↓: go to the bottom, →←: go back, ←→: go forward, →↓: closes the tab, →↑: restores just closed page, etc. There are more functions such as text gestures, image gestures and video gestures. You can also customize your gestures. Recommend using Kiwi browser, Yandex browser and Lemur Browser.
// @version		9.0.9
// @author		L.Xavier
// @namespace	https://greasyfork.org/zh-CN/users/128493
// @match		*://*/*
// @license		MIT
// @grant window.close
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_addValueChangeListener
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/466269/Mobile%20browser%20Gestures%20Extended%20%28MbGE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466269/Mobile%20browser%20Gestures%20Extended%20%28MbGE%29.meta.js
// ==/UserScript==
// v9.0.9 2023-04-10 -Fix the problem that the gesture will be triggered after sliding with two fingers
// ***********************************************************************
// English translations + Custom modifications made by Crunchbits https://github.com/Crunchbits
// Custom Modifications include:
// - Changing New page from Limestart.cn to Chrome://newtab
// - Changing Baidu translate to Google translate(Text gesture)
// - Changing Youdao translate to Youtube search(Text gesture)
// - Changing Query search from Bing search to Google search(Text gesture)
// - Changing Baidu image search to Google image search(Image gesture)
// - Changing Video forward/backward 10 seconds to Video forward/backward 5 seconds(Video gesture)
// - Removed Analyze video function that opened videos in https://jx.jsonplayer.com/player as it didn't work to begin with and I had no use for it.
// ***********************************************************************
/*Gesture Data Module*/
let gesture = {
    '↑→↓←': 'Open settings',
    '◆◆': 'Video full screen',
    '●': 'Gesture penetration',
    '→←': 'Back',
    '←→': 'Forward',
    '↓↑': 'Back to top',
    '↑↓': 'Back to bottom',
    '←↓': 'Refresh page',
    '←↑': 'New page',
    '→↓': 'Close page',
    '→↑': 'Restore page',
    '↓↑●': 'Open in new page',
    '↑↓●': 'Hide element',
    '↓→': 'Duplicate page',
    '→←→': 'Half screen mode',
    'T→↑': 'Google translate',
    'T←↑': 'YouTube search',
    'T◆◆': 'Query search',
    'I↓↑●': 'Open image source',
    'I→↑●': 'Google image search',
    'V→': 'Forward 5s',
    'V←': 'Back 5s',
    'V↑': 'Increase speed',
    'V↓': 'Decrease speed',
    'V→●': 'Fast forward playback',
    'V→○': 'Release fast forwarding',
    'V←●': 'Rewind playback',
    'V←○': 'Release rewinding',
    'V↑●': 'Volume increase',
    'V↑○': 'Release volume increase',
    'V↓●': 'Volume decrease',
    'V↓○': 'Release volume decrease',
    'V→▼': 'Progress',
    'V→▽': 'Release progress',
    'V←▼': 'Regress',
    'V←▽': 'Release regress'
},
    pathFn = {
        'Open settings': '/*ONLY TOP*/openSet();',
        'Video full screen': 'videoFullScreen();',
        'Gesture penetration': 'setTimeout(()=>{if(/^[TIV]/.test(path)){path=(path.indexOf("I")>-1) ? "I" : "";return;}if(gestureData.touchEle.nodeName!=="IMG"){let imgs=gestureData.touchEle.parentNode.getElementsByTagName("img");for(let Ti=0,len=imgs.length;Ti<len;++Ti){let imgRect=imgs[Ti].getBoundingClientRect();if(gestureData.touchStart.clientX>imgRect.x && gestureData.touchStart.clientX<(imgRect.x+imgRect.width) && gestureData.touchStart.clientY>imgRect.y && gestureData.touchStart.clientY<(imgRect.y+imgRect.height)){gestureData.touchEle=imgs[Ti];break;}}}if(gestureData.touchEle.nodeName==="IMG" && settings["Image gestures"]){path="I";}else if(gestureData.touchEle.style.backgroundImage && settings["Image gestures"]){gestureData.touchEle.src=gestureData.touchEle.style.backgroundImage.split(\'"\')[1];path="I";}});',
        'Back': '/*ONLY TOP*/function pageBack(){if(gestureData.backTimer){history.go(-1);setTimeout(pageBack,20);}}gestureData.backTimer=setTimeout(()=>{gestureData.backTimer=0;window.close();},200);pageBack();',
        'Forward': '/*ONLY TOP*/history.go(1);',
        'Back to top': '/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){boxNode.scrollIntoView(true);if(boxNode.scrollTop){boxNode.scrollTo(0,0);}boxNode=boxNode.parentNode;}',
        'Back to bottom': '/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){if(getComputedStyle(boxNode).overflowY!=="hidden"){boxNode.scrollTo(0,boxNode.scrollHeight+999999);}boxNode=boxNode.parentNode;}',
        'Refresh page': '/*ONLY TOP*/document.documentElement.style.cssText="filter:grayscale(100%)";history.go(0);',
        'New page': '/*ONLY TOP*/GM_openInTab("chrome://newtab");',
        'Close page': '/*ONLY TOP*/window.close();',
        'Restore page': '/*ONLY TOP*/GM_openInTab("chrome-native://recent-tabs");',
        'Open in new page': 'let linkNode=gestureData.touchEle;while(true){if(linkNode.href){GM_openInTab(linkNode.href);break;}linkNode=linkNode.parentNode;if(linkNode.nodeName==="BODY"){gestureData.touchEle.click();break;}}',
        'Hide element': 'let boxNode=gestureData.touchEle,area=boxNode.offsetWidth*boxNode.offsetHeight,area_p=boxNode.parentNode.offsetWidth*boxNode.parentNode.offsetHeight,area_s=screen.width*screen.height;while(boxNode.nodeName!=="BODY" && area/area_p>0.2 && area_p/area_s<0.9){boxNode=boxNode.parentNode;area_p=boxNode.parentNode.offsetWidth*boxNode.parentNode.offsetHeight;}if(boxNode.nodeName!=="HTML"){boxNode.remove();}',
        'Duplicate page': '/*ONLY TOP*/GM_openInTab(location.href);',
        'Half screen mode': '/*ONLY TOP*/if(gestureData.halfScreen){setTimeout(()=>{gestureData.halfScreen.remove();halfClose.remove();gestureData.halfScreen=null;document.documentElement.scrollTop=gestureData.scrollTop;},500);gestureData.scrollTop=document.body.scrollTop;let halfClose=addStyle("html{transform:translateY(0) !important;}");}else{gestureData.scrollTop=document.documentElement.scrollTop;gestureData.halfScreen=addStyle("html,body{height:43vh !important;overflow-y:auto !important;}html{transform:translateY(50vh) !important;transition:0.5s !important;overflow:hidden !important;}");document.body.scrollTop=gestureData.scrollTop;}',
        'Google translate': 'GM_openInTab("//translate.google.com/#auto/en/"+encodeURIComponent(gestureData.selectWords));',
        'YouTube search': 'GM_openInTab("//www.youtube.com/results?search_query="+encodeURIComponent(gestureData.selectWords));',
        'Query search': 'GM_setClipboard(gestureData.selectWords);let regURL=/^((https?:)?\\/\\/)?([\\w\\-]+\\.)+\\w{2,4}(\\/\\S*)?$/;if(!regURL.test(gestureData.selectWords.trim())){gestureData.selectWords="//google.com/search?q="+encodeURIComponent(gestureData.selectWords);}else if(!/^(https?:)?\\/\\//.test(gestureData.selectWords.trim())){gestureData.selectWords="//"+gestureData.selectWords.trim();}GM_openInTab(gestureData.selectWords.trim());',
        'Open image source': 'GM_openInTab(gestureData.touchEle.src);',
        'Google image search': 'GM_openInTab("//www.google.com/searchbyimage?image_url="+gestureData.touchEle.src+"&client=firefox-b-d");',
        'Forward 5s': 'videoPlayer.currentTime+=5;gestureData.tipBox.innerHTML="+5s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
        'Back 5s': 'videoPlayer.currentTime-=5;gestureData.tipBox.innerHTML="-5s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
        'Increase speed': 'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed+=(playSpeed<1.5) ? 0.25 : 0.5;gestureData.tipBox.innerHTML="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
        'Decrease speed': 'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed-=(playSpeed>1.5) ? 0.5 : (playSpeed>0.25 && 0.25);gestureData.tipBox.innerHTML="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
        'Fast forward playback': 'gestureData.playSpeed=videoPlayer.playbackRate;videoPlayer.playbackRate=10;gestureData.tipBox.innerHTML="×10 ";gestureData.tipBox.style.display="block";',
        'Release fast forwarding': 'videoPlayer.playbackRate=gestureData.playSpeed;gestureData.tipBox.style.display="none";',
        'Rewind playback': 'gestureData.videoTimer=setInterval(()=>{--videoPlayer.currentTime;},100);gestureData.tipBox.innerHTML="- ×10 ";gestureData.tipBox.style.display="block";',
        'Release rewinding': 'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
        'Volume increase': 'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
        'Release volume increase': 'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
        'Volume decrease': 'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
        'Release volume decrease': 'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
        'Progress': 'let lastX=gestureData.touchEnd.screenX,rem=videoPlayer.currentTime/60,mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{if(gestureData.touchEnd.screenX-lastX){videoPlayer.currentTime+=(gestureData.touchEnd.screenX-lastX)*(1+Math.abs(gestureData.touchEnd.screenX-lastX)/20);lastX=gestureData.touchEnd.screenX;}rem=videoPlayer.currentTime/60;mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);},50);',
        'Release progress': 'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
        'Regress': 'let lastX=gestureData.touchEnd.screenX,rem=videoPlayer.currentTime/60,mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{if(gestureData.touchEnd.screenX-lastX){videoPlayer.currentTime+=(gestureData.touchEnd.screenX-lastX)*(1+Math.abs(gestureData.touchEnd.screenX-lastX)/20);lastX=gestureData.touchEnd.screenX;}rem=videoPlayer.currentTime/60;mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);},50);',
        'Release regress': 'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";'
    },
    settings = {
        'Sliding coefficient': [0.2, 0, 0.5, 2],//[current value, minimum value, maximum value, value precision]
        'Text gestures': true,
        'Image gestures': true,
        'Video gestures': true,
        'Video download': false,
        'Avoid breaking touch': false
    };
//Stored data read
gesture = GM_getValue('gesture', gesture);
pathFn = GM_getValue('pathFn', pathFn);
settings = GM_getValue('settings', settings);
//script constant
const gestureData = {}, minSide = (screen.width > screen.height) ? screen.height : screen.width, limit = (minSide * settings['Sliding coefficient'][0]) ** 2, minLimit = settings['Sliding coefficient'][0] / (settings['Sliding coefficient'][0] + 0.25) * minSide / 20, attachShadow = Element.prototype.attachShadow, observer = new MutationObserver(() => { if (checkTimer) { return; } checkTimer = setTimeout(loadCheck, 200); });

/*Gesture function module*/
//Finger Function Variables
let path = '', startPoint = null, timeSpan = 0, pressTime = 0, raiseTime = 0, slideTime = 0, moveTime = 0, lastTime = 0, pathLen = 0, slideLimit = 0, fingersNum = 0, gestureTimer = 0, clickTimer = 0, isAllow = 0, isClick = 0;
//gesture execution
function runCode(code) {
    try { eval(code); } catch (error) {
        if ((error + '').indexOf('unsafe-eval') > -1) {
            if (!window._eval_) {
                window._eval_ = (() => {
                    let script = document.createElement('script');
                    function thisParams() {
                        this.window.close = window.close;
                        this.GM_setValue = GM_setValue;
                        this.GM_getValue = GM_getValue;
                        this.GM_openInTab = GM_openInTab;
                        this.GM_setClipboard = GM_setClipboard;
                        this.runCode = runCode;
                        this.runFrame = runFrame;
                        this.runGesture = runGesture;
                        this.videoFullScreen = videoFullScreen;
                        this.findVideoBox = findVideoBox;
                        this.addStyle = addStyle;
                        this.openSet = openSet;
                        this.gestureData = gestureData;
                        this.path = path;
                        this.videoPlayer = videoPlayer;
                    }
                    return (js) => {
                        thisParams();
                        script.remove();
                        script = document.createElement('script');
                        script.innerHTML = 'try{' + js + '}catch(error){alert("“"+path+"” Gesture Execution Script Error：\\n"+error+" ！");}';
                        document.body.append(script);
                    }
                })();
                if (top === self) { window._eval_('window.addEventListener("popstate",()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);window.addEventListener("beforeunload",()=>{clearTimeout(gestureData.backTimer);gestureData.backTimer=0;},true);'); }
            }
            window._eval_(code);
        }
        else { alert('“' + path + '” Gesture Execution Script Error：\n' + error + ' ！'); }
    }
}
function runFrame(runPath) {
    let code = pathFn[gesture[runPath]];
    if (top === self || /^[TIV]/.test(runPath)) { runCode(code); }
    else {
        if (code.indexOf('/*ONLY TOP*/') < 0) { runCode(code); }
        if (/\/\*(ONLY|WITH) TOP\*\//.test(code)) {
            window._isPushing_ = () => { let _gestureData = {}; _gestureData.touchEnd = copyTouch(gestureData.touchEnd); top.postMessage({ 'type': 'pushTouch', 'gestureData': _gestureData }, '*'); }
            let _gestureData = {};
            _gestureData.touchStart = copyTouch(gestureData.touchStart);
            _gestureData.touchEnd = copyTouch(gestureData.touchEnd);
            top.postMessage({ 'type': 'runPath', 'runPath': path, 'gestureData': _gestureData }, '*');
        }
    }
}
function runGesture(newPath) {
    if (gesture[path]) {
        runFrame(path);
        if (gesture[newPath]) { path = newPath; }
    } else if (gesture[path.slice(1)] && /^[TIV]/.test(path)) {
        runFrame(path.slice(1));
        if (gesture[newPath?.slice(1)]) { path = newPath; }
    }
}
//Long press to execute
function longPress() {
    if (!/[●○▽]$/.test(path) && (isAllow || isClick)) {
        isAllow = isClick = pathLen = 0;
        startPoint = gestureData.touchEnd;
        let newPath = path + '○'; path += '●';
        runGesture(newPath);
    }
}
//Continuous sliding execution
function slidingRun() {
    moveTime = 0;
    let newPath = path + '▽'; path += '▼';
    runGesture(newPath);
    path = path.replace('▼', '');
}
//Touch to end execution
function touchRun() {
    gestureTimer = 0; if (isAllow) { runGesture(); }
}
//finger pressed
function touchStart(e) {
    clearTimeout(gestureTimer);
    if ((fingersNum = e.touches.length) > 1) { return; }
    pressTime = Date.now(); timeSpan = pressTime - raiseTime;
    let lineLen = gestureTimer && (e.changedTouches[0].screenX - gestureData.touchEnd.screenX) ** 2 + (e.changedTouches[0].screenY - gestureData.touchEnd.screenY) ** 2;
    if (timeSpan > 50 || lineLen > limit) {//Disconnection judgment
        startPoint = e.changedTouches[0];
        if (!gestureTimer || lineLen > limit) {
            path = ''; slideLimit = limit;
            gestureData.touchEle = e.target;
            gestureData.touchEnd = gestureData.touchStart = startPoint;
            gestureData.selectWords = window.getSelection() + '';
            if (gestureData.selectWords && settings['Text gestures']) { path = 'T'; }
            else if (document.contains(videoPlayer) && settings['Video gestures']) {
                let videoRect = findVideoBox().getBoundingClientRect(), offsetY = fullsState > 0 && videoRect.height / 10;
                if (gestureData.touchStart.clientX > videoRect.x && gestureData.touchStart.clientX < (videoRect.x + videoRect.width) && gestureData.touchStart.clientY > (videoRect.y + offsetY) && gestureData.touchStart.clientY < (videoRect.y + videoRect.height - offsetY)) { path = 'V'; }
            }
        } else if (isClick) { e.preventDefault(); }
        slideTime = pressTime; isAllow = pathLen = 0; isClick = 1;
    } else if (isClick) { clearTimeout(clickTimer); path = path.slice(0, -1); }
    gestureTimer = setTimeout(longPress, 300 + slideTime - pressTime);
}
//finger slide
function touchMove(e) {
    let nowTime = Date.now();
    if (nowTime - lastTime < 16 || fingersNum > 1) { return; }
    clearTimeout(gestureTimer);
    gestureData.touchEnd = e.changedTouches[0];
    let xLen = (gestureData.touchEnd.screenX - startPoint.screenX) ** 2, yLen = (gestureData.touchEnd.screenY - startPoint.screenY) ** 2, _pathLen = xLen + yLen,
        diffLen = (_pathLen > pathLen) ? _pathLen - pathLen : pathLen - _pathLen, lastIcon = path.slice(-1);
    lastTime = nowTime; pathLen = _pathLen;
    if (diffLen > minLimit && !/[○▽]/.test(lastIcon)) {
        slideTime = nowTime; isClick = 0;
        let direction = (xLen > yLen * 1.42) ? ((gestureData.touchEnd.screenX > startPoint.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY > startPoint.screenY) ? '↓' : '↑');
        if (lastIcon === direction || _pathLen > slideLimit) {
            if (lastIcon !== direction && (timeSpan < 50 || 'TIV◆'.indexOf(lastIcon) > -1)) { path += direction; slideLimit *= (slideLimit < limit / 2) || 0.64; moveTime = nowTime; isAllow = 1; timeSpan = 0; }
            startPoint = gestureData.touchEnd; pathLen = 0;
            if (moveTime && nowTime - moveTime > 400) { setTimeout(slidingRun); }
        } else if (_pathLen > minLimit * 16) { moveTime = isAllow = 0; }
    }
    gestureTimer = setTimeout(longPress, 300 + slideTime - nowTime);
    if (window._isPushing_) { setTimeout(window._isPushing_); }
}
//finger up
function touchEnd(e) {
    clearTimeout(gestureTimer);
    if (--fingersNum > 0) { isClick = isAllow = 0; return; }
    if (window._isPushing_) { window._isPushing_ = null; }
    gestureData.touchEnd = e.changedTouches[0];
    raiseTime = Date.now(); setTimeout(iframeLock);
    if (/[○▽]$/.test(path)) { raiseTime = gestureTimer = 0; setTimeout(runGesture); return; }
    gestureTimer = setTimeout(touchRun, 200);
    if (isClick) { isAllow = 1; path += '◆'; if (/^V◆◆$|^T/.test(path)) { e.stopPropagation(); e.preventDefault(); window.getSelection().empty(); } }
}
//Delay click to avoid triggering click when broken touch
function delayClick(e) {
    if (e.isTrusted) {
        e.stopPropagation(); e.preventDefault();
        if (timeSpan < 50) { return; }
        let ev = new PointerEvent('click', { bubbles: true, cancelable: true, clientX: e.clientX, clientY: e.clientY, composed: true, detail: 1, layerX: e.layerX, layerY: e.layerY, offsetX: e.offsetX, offsetY: e.offsetY, pageX: e.pageX, pageY: e.pageY, pointerId: e.pointerId, pointerType: e.pointerType, screenX: e.screenX, screenY: e.screenY, sourceCapabilities: e.sourceCapabilities, view: e.view, x: e.x, y: e.y });
        clickTimer = setTimeout(() => { e.target.dispatchEvent(ev); }, 50);
    }
}

/*Video function module*/
//video feature variable
let videoEle = document.getElementsByTagName('video'), videoPlayer = null, oriLock = 0, resizeTimer = 0, fullsState = 0;
//Video player assignment
async function setVideo(player) {
    let _videoPlayer = player.target || player;
    if (videoPlayer?.paused === false && _videoPlayer.muted === true) { return; }
    videoPlayer = _videoPlayer;
    videoOriLock();
    videoPlayer.parentNode.append(gestureData.tipBox);
    if (settings['Video download']) {
        await findVideoBox()?.append(videoPlayer._downloadTip_);
        if (window._urlObjects_[videoPlayer.src]) {
            videoPlayer._downloadTip_.innerHTML = 'is capturing';
            videoPlayer._downloadTip_.buffers = window._urlObjects_[videoPlayer.src].sourceBuffers;
            window._urlObjects_[videoPlayer.src]._downloadTip_ = videoPlayer._downloadTip_;
            delete window._urlObjects_[videoPlayer.src];
        } else if (videoPlayer._downloadTip_.innerHTML === 'not loaded') {
            if (!videoPlayer.src && videoPlayer.children.length) { videoPlayer.src = videoPlayer.firstChild.src; }
            if (videoPlayer.src.indexOf('blob:') && videoPlayer.src) { videoPlayer._downloadTip_.innerHTML = 'downloadable'; }
        }
    }
}
//Video orientation lock
function videoOriLock() {
    if (!videoPlayer.videoWidth) { if (!videoPlayer.error && document.contains(videoPlayer)) { setTimeout(videoOriLock, 100); } oriLock = 0; return; }
    oriLock = +(videoPlayer.videoWidth > videoPlayer.videoHeight);
    if (fullsState > 0 && oriLock) { top.postMessage({ 'type': 'GYRO' }, '*'); }
}
//Video frame lock
function iframeLock() {
    if (top !== self && !window._isShow_) { GM_setValue('isShow', Date.now()); }
}
//Video full screen/exit full screen
async function videoFullScreen() {
    if (resizeTimer) { return; }
    if (document.fullscreen) { await document.exitFullscreen()?.catch(Date); }
    else if (videoPlayer) { await findVideoBox()?.requestFullscreen()?.catch(Date); }
    else if (iframeEle.length) { GM_setValue('fullscreen', Date.now()); }
}
//Get video full screen style container
function findVideoBox(player = videoPlayer) {
    if (!document.contains(player)) { return null; }
    if (player._videoBox_?.contains(player)) { return player._videoBox_; }
    player._videoBox_ = player.parentNode; player.setAttribute('_videobox_', '');
    let parentEle = player._videoBox_.parentNode, videoStyle = getComputedStyle(player), childStyle = getComputedStyle(player._videoBox_), childWidth = 0, childHeight = 0, _childWidth = 0, _childHeight = 0;
    if (player._videoBox_.offsetParent === parentEle) {
        childWidth = Math.round(player.offsetWidth + (+videoStyle.marginLeft.slice(0, -2)) + (+videoStyle.marginRight.slice(0, -2)));
        childHeight = Math.round(player.offsetHeight + (+videoStyle.marginTop.slice(0, -2)) + (+videoStyle.marginBottom.slice(0, -2)));
        _childWidth = Math.round(player._videoBox_.offsetWidth + (+childStyle.marginLeft.slice(0, -2)) + (+childStyle.marginRight.slice(0, -2)));
        _childHeight = Math.round(player._videoBox_.offsetHeight + (+childStyle.marginTop.slice(0, -2)) + (+childStyle.marginBottom.slice(0, -2)));
    } else {
        childWidth = Math.round(player.offsetWidth + (+videoStyle.left.slice(0, -2) || 0) + (+videoStyle.marginLeft.slice(0, -2)) + (+videoStyle.marginRight.slice(0, -2)) + (+videoStyle.right.slice(0, -2) || 0));
        childHeight = Math.round(player.offsetHeight + (+videoStyle.top.slice(0, -2) || 0) + (+videoStyle.marginTop.slice(0, -2)) + (+videoStyle.marginBottom.slice(0, -2)) + (+videoStyle.bottom.slice(0, -2) || 0));
        _childWidth = Math.round(player._videoBox_.offsetWidth + (+childStyle.left.slice(0, -2) || 0) + (+childStyle.marginLeft.slice(0, -2)) + (+childStyle.marginRight.slice(0, -2)) + (+childStyle.right.slice(0, -2) || 0));
        _childHeight = Math.round(player._videoBox_.offsetHeight + (+childStyle.top.slice(0, -2) || 0) + (+childStyle.marginTop.slice(0, -2)) + (+childStyle.marginBottom.slice(0, -2)) + (+childStyle.bottom.slice(0, -2) || 0));
    }
    childWidth = (childWidth > _childWidth) ? childWidth : _childWidth;
    childHeight = (childHeight > _childHeight) ? childHeight : _childHeight;
    while (childWidth >= parentEle.clientWidth && childHeight >= parentEle.clientHeight && parentEle.nodeName != 'BODY') {
        player._videoBox_.setAttribute('_videobox_', ''); player._videoBox_ = parentEle;
        childStyle = getComputedStyle(parentEle);
        if (parentEle.offsetParent === parentEle.parentNode) {
            _childWidth = Math.round(parentEle.offsetWidth + (+childStyle.marginLeft.slice(0, -2)) + (+childStyle.marginRight.slice(0, -2)));
            _childHeight = Math.round(parentEle.offsetHeight + (+childStyle.marginTop.slice(0, -2)) + (+childStyle.marginBottom.slice(0, -2)));
        } else {
            _childWidth = Math.round(parentEle.offsetWidth + (+childStyle.left.slice(0, -2) || 0) + (+childStyle.marginLeft.slice(0, -2)) + (+childStyle.marginRight.slice(0, -2)) + (+childStyle.right.slice(0, -2) || 0));
            _childHeight = Math.round(parentEle.offsetHeight + (+childStyle.top.slice(0, -2) || 0) + (+childStyle.marginTop.slice(0, -2)) + (+childStyle.marginBottom.slice(0, -2)) + (+childStyle.bottom.slice(0, -2) || 0));
        }
        childWidth = (childWidth > _childWidth) ? childWidth : _childWidth;
        childHeight = (childHeight > _childHeight) ? childHeight : _childHeight;
        parentEle = parentEle.parentNode;
    }
    player._videoBox_.setAttribute('_videobox_', 'outer');
    return player._videoBox_;
}
//Full screen detection event
function regRESIZE() {
    let videoCss = addStyle(''), stopResize = () => { resizeTimer = 0; };
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer); resizeTimer = setTimeout(stopResize, 200);
        if (document.fullscreen && !fullsState) {
            fullsState = document.fullscreenElement;
            if (fullsState.nodeName === 'IFRAME') { fullsState = -1; return; }
            let srcFindVideo = fullsState.getElementsByTagName('video'), srcVideo = (fullsState.nodeName === 'VIDEO') ? fullsState : srcFindVideo[0];
            if (!fullsState.hasAttribute('_videobox_') && (!srcVideo || srcFindVideo.length > 1 || (srcVideo._videoBox_.offsetWidth * srcVideo._videoBox_.offsetHeight / fullsState.offsetWidth / fullsState.offsetHeight) < 0.9)) { fullsState = -1; videoCss.innerHTML = ''; return; }
            if (srcVideo !== videoPlayer) { videoPlayer?.pause(); setVideo(srcVideo); }
            fullsState = 1; if (oriLock) { top.postMessage({ 'type': 'GYRO' }, '*'); }
            videoCss.innerHTML = '*[_videobox_]{inset:0 !important;margin:0 !important;padding:0 !important;transform:none !important;}*[_videobox_=""]{width:100% !important;height:100% !important;max-width:100% !important;max-height:100% !important;}video{position:fixed !important;object-fit:contain !important;}';
        } else if (fullsState && !document.fullscreen) { fullsState = 0; videoCss.innerHTML = ''; }
    }, true);
}

/*Video download module*/
if (settings['Video download']) {
    //raw method storage
    const createObjectURL = URL.createObjectURL, addSourceBuffer = MediaSource.prototype.addSourceBuffer, appendBuffer = SourceBuffer.prototype.appendBuffer, endOfStream = MediaSource.prototype.endOfStream;
    //Initialize video download
    window._initDownload_ = (player) => {
        player._downloadTip_ = document.createElement('div');
        player._downloadTip_.style.cssText = 'position:absolute;right:0;top:20px;background:#3498db;border-radius:20px 0 0 20px;text-align:center;padding:20px;line-height:0px;color:#fff;min-width:60px;font-size:16px;font-family:system-ui;z-index:2147483647;';
        player._downloadTip_.target = player;
        player._downloadTip_.innerHTML = 'not loaded';
        if (window._urlObjects_[player.src]) {
            player._downloadTip_.innerHTML = 'is capturing';
            player._downloadTip_.buffers = window._urlObjects_[player.src].sourceBuffers;
            window._urlObjects_[player.src]._downloadTip_ = player._downloadTip_;
            delete window._urlObjects_[player.src];
        } else {
            if (!player.src && player.children.length) { player.src = player.firstChild.src; }
            if (player.src.indexOf('blob:') && player.src) { player._downloadTip_.innerHTML = 'downloadable'; }
        }
        player._downloadTip_.onclick = window._downloadVideo_;
        player._videoBox_.append(player._downloadTip_);
    }
    //download video
    window._downloadVideo_ = function (data) {
        if (this.innerHTML === 'not loaded') { return; }
        if (data.target) { data = this; data.src = this.target.src; }
        let buffers = data.buffers;
        if (top !== self) {
            let _buffers = [];
            for (let Ti = 0, len = buffers.length; Ti < len; ++Ti) {
                _buffers.push({ 'mime': buffers[Ti]._mime_, 'bufferList': buffers[Ti]._bufferList_ });
            }
            top.postMessage({ 'type': 'download', 'buffers': _buffers, 'src': data.src }, '*');
            return;
        }
        let a = document.createElement('a'); a.download = document.title; a.style.display = 'none'; document.body.append(a);
        if (data.src.indexOf('blob:') && data.src) { a.href = data.src; a.click(); }
        else if (buffers.length) {
            for (let Ti = 0, len = buffers.length; Ti < len; ++Ti) {
                a.href = URL.createObjectURL(new Blob(buffers[Ti]._bufferList_, { 'type': buffers[Ti]._mime_ }));
                a.click();
                URL.revokeObjectURL(a.href);
            }
        }
        a.remove();
    }
    //storage media source
    window._urlObjects_ = {};
    URL.createObjectURL = (obj) => {
        let url = createObjectURL(obj);
        if (obj.sourceBuffers) { window._urlObjects_[url] = obj; }
        return url;
    }
    //add capture
    MediaSource.prototype.addSourceBuffer = function (mime) {
        let sourceBuffer = addSourceBuffer.call(this, mime);
        sourceBuffer._bufferList_ = [];
        sourceBuffer._mime_ = mime;
        sourceBuffer._mediaSource_ = this;
        return sourceBuffer;
    }
    //capture clip
    SourceBuffer.prototype.appendBuffer = function (buffer) {
        this._bufferList_.push(buffer);
        if (this._mime_.indexOf('video') > -1 && this._mediaSource_._downloadTip_) { this._mediaSource_._downloadTip_.innerHTML = 'captured' + this._bufferList_.length + 'fragments'; }
        appendBuffer.call(this, buffer);
    }
    //capture complete
    MediaSource.prototype.endOfStream = function () {
        if (this._downloadTip_) { this._downloadTip_.innerHTML = 'downloadable'; }
        endOfStream.call(this);
    }
}

/*Function Supplementary Module*/
//Functional Supplementary Variables
let iframeEle = document.getElementsByTagName('iframe'), checkTimer = 0;
//Modify the trusted types policy
window.trustedTypes?.createPolicy('default', { createHTML: string => string, createScript: string => string, createScriptURL: string => string });
//Register for events when the page is rewritten
document._docWrite_ = document.write;
document.write = (content) => { document._docWrite_(content); if (getComputedStyle(document.documentElement).userSelect !== 'text') { regEvent(); } }
//set shadow-root (open)
Element.prototype.attachShadow = function () {
    if (!window._shadowList_) { window._shadowList_ = []; }
    let shadowRoot = attachShadow.call(this, { mode: 'open' });
    window._shadowList_.push(shadowRoot);
    return shadowRoot;
}
//page load detection
async function loadCheck() {
    //Detect video in shadow root
    if (window._shadowList_) {
        videoEle = [...document.getElementsByTagName('video')];
        for (let Ti = 0, len = window._shadowList_.length; Ti < len; ++Ti) {
            videoEle.push(...window._shadowList_[Ti].querySelectorAll('video'));
        }
    }
    //Video playback event binding
    if (videoEle.length) {
        if (!gestureData.tipBox) {
            //Start full screen detection
            regRESIZE();
            //TipOperation Tips
            gestureData.tipBox = document.createElement('div');
            gestureData.tipBox.style.cssText = 'width:100px;height:50px;position:absolute;text-align:center;top:calc(50% - 25px);left:calc(50% - 50px);display:none;color:#1e87f0;font-size:22px;line-height:50px;background-color:rgba(0,0,0,0.6);border-radius:20px;font-family:system-ui;z-index:2147483647;';
        }
        for (let Ti = 0, len = videoEle.length; Ti < len; ++Ti) {
            if (!videoEle[Ti]._videoBox_ && videoEle[Ti].offsetHeight) {
                await findVideoBox(videoEle[Ti]);
                if (settings['Video download']) { await window._initDownload_(videoEle[Ti]); }
                if (!videoEle[Ti].paused) { setVideo(videoEle[Ti]); }
                videoEle[Ti].addEventListener('playing', setVideo, true);
            }
        }
    }
    //Iframe is forced to be full screen
    for (let Ti = 0, len = iframeEle.length; Ti < len; ++Ti) {
        if (!iframeEle[Ti].allowFullscreen) {
            iframeEle[Ti].allowFullscreen = true;
            if (iframeEle[Ti].getAttribute('src') && iframeEle[Ti].src.indexOf('chrome-extension://')) {
                iframeEle[Ti].src = iframeEle[Ti].src;
            }
        }
    }
    checkTimer = 0;
}
//add stylesheet
function addStyle(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style);
    return style;
}
//copy coordinate object
function copyTouch(oldObj) {
    let newObj = {};
    for (let Ti in oldObj) {
        if (Ti === 'target') { continue; }
        newObj[Ti] = oldObj[Ti];
    }
    return newObj;
}
//Gesture function setting ui
function openSet() {
    let gestureName = '', gesturePath = '', gestureBox = document.createElement('div'), pathEle = null, _clickTimer = 0;
    //page generation
    addStyle('*{overflow:hidden !important;}' +
        '#gestureBox{background-color:#fff;width:100%;height:100%;position:fixed;padding:0;margin:0;inset:0;overflow-y:auto !important;z-index:2147483647;}' +
        '#gestureBox *{font-family:system-ui;margin:0;padding:0;text-align:center;font-size:5vmin;line-height:12vmin;user-select:none !important;transform:none;text-indent:0;}' +
        '#gestureBox ::placeholder{color:#999;font-size:2.5vmin;line-height:6vmin;}' +
        '#gestureBox h1{width:60%;height:12vmin;color:#0074d9;background-color:#dee6ef;margin:3vmin auto;border-radius:12vmin;box-shadow:0.9vmin 0.9vmin 3vmin #dfdfdf;}' +
        '#gestureBox #addGesture{width:14vmin;height:14vmin;margin:3vmin auto;line-height:14vmin;background-color:#dee6ef;color:#032e58;font-size:7.5vmin;border-radius:15vmin;box-shadow:0.3vmin 0.3vmin 1.5vmin #dfdfdf;}' +
        '#gestureBox .gestureLi{height:18vmin;width:100%;border-bottom:0.3vmin solid #dfdfdf;}' +
        '#gestureBox .gestureLi p{margin:3vmin 0 0 1%;width:38%;height:12vmin;border-left:1.8vmin solid;color:#ffb400;background-color:#fff1cf;float:left;white-space:nowrap;text-overflow:ellipsis;text-shadow:0.3vmin 0.3vmin 3vmin #ffcb56;}' +
        '#gestureBox .gestureLi .gesturePath{margin:3vmin 0 0 3%;float:left;width:38%;height:12vmin;background-color:#f3f3f3;color:#000;box-shadow:0.3vmin 0.3vmin 1.5vmin #ccc9c9;border-radius:3vmin;white-space:nowrap;text-overflow:ellipsis;}' +
        '#gestureBox .gestureLi .delGesture{margin:3vmin 2% 0 0;width:15vmin;height:12vmin;float:right;color:#f00;text-decoration:line-through;}' +
        '#gestureBox #revisePath{background-color:rgba(0,0,0,0.7);width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}' +
        '#gestureBox #revisePath span{width:15vmin;height:15vmin;font-size:12.5vmin;line-height:15vmin;position:absolute;}' +
        '#gestureBox #revisePath div{color:#3339f9;position:absolute;width:30%;height:12vmin;font-size:9vmin;bottom:15%;}' +
        '#gestureBox #revisePath p{color:#3ba5d8;position:absolute;top:15%;font-size:10vmin;height:12vmin;width:100%;}' +
        '#gestureBox #revisePath #path{top:40%;color:#ffee03;height:100%;word-wrap:break-word;font-size:15vmin;line-height:18vmin;}' +
        '#gestureBox #editGesture{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}' +
        '#gestureBox #editGesture p{color:#3339f9;font-size:7.5vmin;text-align:left;margin:6vmin 0 0 9vmin;width:100%;height:9vmin;line-height:9vmin;}' +
        '#gestureBox #editGesture #gestureName{margin-top:6vmin;width:80%;height:12vmin;color:#000;border:0.3vmin solid #dadada;border-radius:3vmin;text-align:left;padding:0 3vmin;}' +
        '#gestureBox #editGesture .label_box>label{display:inline-block;margin-top:6vmin;position:relative;}' +
        '#gestureBox #editGesture .label_box>label>input{position:absolute;top:0;left:-6vmin;}' +
        '#gestureBox #editGesture .label_box>label>div{width:20vw;border:#ddd solid 0.3vmin;height:12vmin;color:#666;position:relative;}' +
        '#gestureBox #editGesture .label_box>label>input:checked + div{border:#d51917 solid 0.3vmin;color:#d51917;}' +
        '#gestureBox #editGesture .label_box>label>input + div:after{top:auto;left:auto;bottom:-3vmin;right:0;transition:none;}' +
        '#gestureBox #editGesture .label_box>label>input:checked + div:after{content:"";display:block;border:none;width:6vmin;height:6vmin;background-color:#d51917;transform:skewY(-45deg);position:absolute;}' +
        '#gestureBox #editGesture .label_box>label>input:checked + div:before{content:"";display:block;width:0.9vmin;height:2.4vmin;border-right:#fff solid 0.6vmin;border-bottom:#fff solid 0.6vmin;transform:rotate(35deg);position:absolute;bottom:0.6vmin;right:1.2vmin;z-index:1;}' +
        '#gestureBox #editGesture #pathFn{overflow-y:auto !important;width:80%;margin-top:6vmin;height:40%;text-align:left;line-height:6vmin;padding:3vmin;border:0.3vmin solid #dadada;border-radius:3vmin;}' +
        '#gestureBox #editGesture button{width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;display:inline-block;color:#fff;background-color:#2866bd;margin:6vmin 3vmin 0 3vmin;border:none;}' +
        '#gestureBox #settingsBox{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}' +
        '#gestureBox #settingsBox p{color:#3339f9;text-align:left;margin:9vmin 0 0 9vmin;float:left;height:6vmin;line-height:6vmin;clear:both;}' +
        '#gestureBox #settingsBox .slideRail{overflow:initial !important;width:55%;background-color:#a8a8a8;float:left;margin:12vmin 0 0 3vmin;height:0.6vmin;position:relative;}' +
        '#gestureBox #settingsBox .slideRail .slideButton{line-height:9vmin;color:#fff;background-color:#2196f3;min-width:9vmin;height:9vmin;border-radius:9vmin;font-size:4vmin;position:absolute;top:-4.5vmin;box-shadow:0.3vmin 0.3vmin 1.8vmin #5e8aee;padding:0 1vmin;}' +
        '#gestureBox #settingsBox .switch{position:relative;display:inline-block;width:18vmin;height:9vmin;float:left;margin:7.5vmin 42% 0 3vmin;}' +
        '#gestureBox #settingsBox .switch input{display:none;}' +
        '#gestureBox #settingsBox .slider{border-radius:9vmin;position:absolute;cursor:pointer;inset:0;background-color:#ccc;transition:0.4s;}' +
        '#gestureBox #settingsBox .slider:before{border-radius:50%;position:absolute;content:"";height:7.5vmin;width:7.5vmin;left:0.6vmin;bottom:0.6vmin;background-color:white;transition:0.4s;}' +
        '#gestureBox #settingsBox input:checked + .slider{background-color:#2196F3;}' +
        '#gestureBox #settingsBox input:checked + .slider:before{transform:translateX(9vmin);}' +
        '#gestureBox #settingsBox #saveSettings{display:block;clear:both;width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;color:#fff;background-color:#2866bd;border:none;margin:12vmin 0 0 calc(50% - 15vmin);float:left;}');
    gestureBox.id = 'gestureBox';
    document.body.append(gestureBox);
    gestureBox.innerHTML = '<h1 id="openSettings">Gesture track settings</h1><div id="addGesture">+</div><div id="gestureUL"></div>' +
        '<div id="revisePath"><span style="top:0;left:0;text-align:left;">┌</span><span style="top:0;right:0;text-align:right;">┐</span><span style="bottom:0;left:0;text-align:left;">└</span><span style="bottom:0;right:0;text-align:right;">┘</span>' +
        '<p>Touch or slide finger</p><p id="path"></p><div id="clearPath" style="left:10%;">remove</div><div id="cancleRevise" style="right:10%;">save</div></div>' +
        '<div id="editGesture"><p>Gesture name：</p><input type="text" id="gestureName" maxlength="12" placeholder="Maximum input is 12 characters">' +
        '<p>Gesture type：</p><div class="label_box"><label><input type="radio" id="GG" name="gestureType" value=""><div>general</div></label><label><input type="radio" id="T" name="gestureType" value="T"><div>text</div></label><label><input type="radio" id="I" name="gestureType" value="I"><div>image</div></label><label><input type="radio" id="V" name="gestureType" value="V"><div>video</div></label></div>' +
        '<p>Gesture execution script：</p><textarea id="pathFn" placeholder="Description of available variables ↓\n 	gestureData：Gesture Data Constants,If you need to pass variables between gestures,assignablegestureData.variableName=variableValue；\n	gestureData.touchEle：The source element touched by the finger；\n	gestureData.selectWords：selected text；\n	gestureData.touchStart：Touch start coordinate object；\n	gestureData.touchEnd：Touch the latest coordinates object；\n	path：sliding path；\n	videoPlayer：The video element that is playing.' +
        '\n\nDescription of available methods↓\n	addStyle(CSSstyle)：Add CSS styles to web pages；\n	runGesture()：Execute the gesture with path as the path, you can execute this method after modifying the path；\n	GM_openInTab(Link)：open link；\n	GM_setClipboard(text)：copy text to clipboard；\n	GM_setValue(variableName,variableValue)：Storing data in GreaseMonkey；\n	GM_getValue(variableName,Defaults)：Fetch the data from GreasyMonkey, or use the default value if there is none.' +
        '\n\nRecognizable Code Comments(Only works for normal gestures)↓\n	default：When there is an iframe, all gestures will only be performed on the page object that triggered the gesture！\n 	Add to/*ONLY TOP*/：Gestures are only performed on top-level page objects；\n	Add to/*WITH TOP*/：Gestures are performed on both the current page object and the top-level page object."></textarea>' +
        '<div style="width:100%;height:0.3vmin;"></div><button id="saveGesture">save</button><button id="closeEdit">close</button></div>' +
        '<div id="settingsBox"><h1>Function switch settings</h1><span id="settingList"></span><button id="saveSettings">save</button></div>';
    pathEle = document.getElementById('path');

    //edit gesture
    function editGesture() {
        gestureName = this.parentNode.getAttribute('name');
        if (['Open settings', 'Video full screen', 'Gesture penetration'].indexOf(gestureName) > -1) { alert('This gesture script cannot be modified！'); return; }
        gesturePath = this.parentNode.getAttribute('path');
        let selectType = (/^[TIV]/.test(gesturePath)) ? gesturePath.slice(0, 1) : 'GG';
        document.getElementById(selectType).click();
        document.getElementById('gestureName').value = gestureName;
        document.getElementById('pathFn').value = pathFn[gestureName];
        document.getElementById('editGesture').style.display = 'block';
    }
    //modify path
    function revisePath() {
        gestureName = this.parentNode.getAttribute('name');
        gesturePath = this.parentNode.getAttribute('path');
        pathEle.innerHTML = '';
        window.removeEventListener('touchmove', touchMove, true);
        document.getElementById('revisePath').style.display = 'block';
    }
    //delete gesture
    function delGesture() {
        gestureName = this.parentNode.getAttribute('name');
        if (['Open settings', 'Video full screen', 'Gesture penetration'].indexOf(gestureName) > -1) { alert('This gesture cannot be deleted！'); return; }
        if (!confirm('Confirm to delete "' + gestureName + '" gesture:')) { return; }
        gesturePath = this.parentNode.getAttribute('path');
        delete pathFn[gestureName];
        delete gesture[gesturePath];
        GM_setValue('pathFn', pathFn);
        GM_setValue('gesture', gesture);
        init();
    }
    //slider
    function silideBar(e) {
        e.preventDefault(); fingersNum = 2;
        let diffX = e.changedTouches[0].clientX - gestureData.touchStart.clientX,
            leftPX = (+this.style.left.slice(0, -2)) + diffX, vmin = this.offsetWidth / 2, setArr = settings[this.id];
        leftPX = (leftPX < -vmin) ? -vmin : ((leftPX > (diffX = this.parentNode.offsetWidth - vmin)) ? diffX : leftPX);
        this.style.left = leftPX + 'px';
        this.innerHTML = ((leftPX + vmin) / this.parentNode.offsetWidth * (setArr[2] - setArr[1]) + setArr[1]).toFixed(setArr[3]);
        gestureData.touchStart = e.changedTouches[0];
    }
    //Long press to execute
    function _longPress() { if (!/[●○▼▽]$/.test(pathEle.innerHTML)) { isClick = pathLen = 0; startPoint = gestureData.touchEnd; pathEle.innerHTML += '●'; } }
    //Continuous sliding execution
    function _slidingRun() { moveTime = 0; pathEle.innerHTML += '▼'; }
    //Click to execute
    function _clickRun() { if (!/[○▼▽]$/.test(pathEle.innerHTML)) { pathEle.innerHTML += '◆'; } }
    //Interface initialization
    function init() {
        document.getElementById('gestureUL').innerHTML = '';
        for (gestureName in pathFn) {
            gesturePath = '';
            for (let Ti in gesture) {
                if (gesture[Ti] === gestureName) { gesturePath = Ti; break; }
            }
            document.getElementById('gestureUL').innerHTML += '<div class="gestureLi" name="' + gestureName + '" path="' + gesturePath + '"><p>' + gestureName + '</p><div class="gesturePath">' + gesturePath + '</div><div class="delGesture">delete</div></div>';
        }
        //Operation Binding
        let gestureEle = document.querySelectorAll('#gestureBox .gestureLi p');
        for (let Ti = 0, len = gestureEle.length; Ti < len; ++Ti) {
            gestureEle[Ti].addEventListener('click', editGesture, true);
        }
        gestureEle = document.querySelectorAll('#gestureBox .gestureLi .gesturePath');
        for (let Ti = 0, len = gestureEle.length; Ti < len; ++Ti) {
            gestureEle[Ti].addEventListener('click', revisePath, true);
        }
        gestureEle = document.querySelectorAll('#gestureBox .gestureLi .delGesture');
        for (let Ti = 0, len = gestureEle.length; Ti < len; ++Ti) {
            gestureEle[Ti].addEventListener('click', delGesture, true);
        }
    }
    init();

    //.New gesture
    document.getElementById('addGesture').addEventListener('click', () => {
        gestureName = gesturePath = '';
        document.getElementById('GG').click();
        document.getElementById('gestureName').value = '';
        document.getElementById('pathFn').value = '';
        document.getElementById('editGesture').style.display = 'block';
    }, true);
    //save gesture
    document.getElementById('saveGesture').addEventListener('click', () => {
        if (!document.getElementById('gestureName').value) { alert('Please enter a gesture name！'); return; }
        if (pathFn[document.getElementById('gestureName').value] && gestureName !== document.getElementById('gestureName').value) { alert('The gesture name is already taken！'); return; }
        delete pathFn[gestureName];
        delete gesture[gesturePath];
        let typeEle = document.getElementsByName('gestureType');
        for (let Ti = 0, len = typeEle.length; Ti < len; ++Ti) {
            if (typeEle[Ti].checked) {
                gesturePath = typeEle[Ti].value + ((gestureName && gesturePath.indexOf('[') < 0) ? ((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(1) : gesturePath) : ('[' + document.getElementById('gestureName').value + ']'));
                break;
            }
        }
        gesture[gesturePath] = document.getElementById('gestureName').value;
        pathFn[document.getElementById('gestureName').value] = document.getElementById('pathFn').value;
        GM_setValue('pathFn', pathFn);
        GM_setValue('gesture', gesture);
        init();
        document.getElementById('editGesture').style.display = 'none';
    }, true);
    //close edit
    document.getElementById('closeEdit').addEventListener('click', () => {
        document.getElementById('editGesture').style.display = 'none';
    }, true);
    //path modification event
    document.getElementById('revisePath').addEventListener('touchstart', () => {
        if (fingersNum > 1) { return; }
        clearTimeout(gestureTimer); clearTimeout(_clickTimer);
        gestureTimer = setTimeout(_longPress, 300 + slideTime - pressTime);
    }, true);
    document.getElementById('revisePath').addEventListener('touchmove', (e) => {
        e.preventDefault();
        let nowTime = Date.now();
        if (nowTime - lastTime < 16 || fingersNum > 1) { return; }
        clearTimeout(gestureTimer);
        gestureData.touchEnd = e.changedTouches[0];
        let xLen = (gestureData.touchEnd.screenX - startPoint.screenX) ** 2, yLen = (gestureData.touchEnd.screenY - startPoint.screenY) ** 2, _pathLen = xLen + yLen,
            diffLen = (_pathLen > pathLen) ? _pathLen - pathLen : pathLen - _pathLen, lastIcon = pathEle.innerHTML.slice(-1);
        lastTime = nowTime; pathLen = _pathLen;
        if (diffLen > minLimit && !/[○▼▽]/.test(lastIcon)) {
            slideTime = nowTime; isClick = 0;
            let direction = (xLen > yLen) ? ((gestureData.touchEnd.screenX > startPoint.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY > startPoint.screenY) ? '↓' : '↑');
            if (lastIcon === direction || _pathLen > limit) {
                if (lastIcon !== direction) { pathEle.innerHTML += direction; moveTime = nowTime; }
                startPoint = gestureData.touchEnd; pathLen = 0;
                if (moveTime && nowTime - moveTime > 400) { setTimeout(_slidingRun); }
            } else if (_pathLen > minLimit * 16) { moveTime = 0; }
        }
        gestureTimer = setTimeout(_longPress, 300 + slideTime - nowTime);
    }, true);
    document.getElementById('revisePath').addEventListener('touchend', (e) => {
        if (!isClick || fingersNum > 0) { return; }
        if (path.indexOf('◆◆') > -1) {
            path = '';
            switch (pathEle.innerHTML.slice(-1)) {
                case '●': { pathEle.innerHTML = pathEle.innerHTML.slice(0, -1) + '○'; break; }
                case '○': { pathEle.innerHTML = pathEle.innerHTML.slice(0, -1) + '●'; break; }
                case '▼': { pathEle.innerHTML = pathEle.innerHTML.slice(0, -1) + '▽'; break; }
                case '▽': { pathEle.innerHTML = pathEle.innerHTML.slice(0, -1) + '▼'; break; }
                default: { pathEle.innerHTML += '◆'; setTimeout(_clickRun, 100); break; }
            }
        } else { _clickTimer = setTimeout(_clickRun, 200); }
    });
    //clear path
    document.getElementById('clearPath').addEventListener('touchend', (e) => {
        e.stopPropagation();
        if (!isClick || fingersNum > 0) { return; }
        if (path.indexOf('◆◆') > -1) { path = ''; pathEle.innerHTML = ''; }
        else { pathEle.innerHTML = pathEle.innerHTML.slice(0, -1); }
    });
    //save modified path
    document.getElementById('cancleRevise').addEventListener('touchend', (e) => {
        e.stopPropagation(); e.preventDefault();
        if (!isClick || fingersNum > 0) { return; }
        if (pathEle.innerHTML) {
            if (gestureName === 'Video full screen' && pathEle.innerHTML.slice(-1) !== '◆') { alert('Video full screen needs to end with ◆！'); return; }
            if (gesture[pathEle.innerHTML] === 'Gesture penetration') { alert('path with"Gesture penetration"feature conflict！'); return; }
            if (/^[TIV]/.test(gesturePath)) { pathEle.innerHTML = gesturePath.slice(0, 1) + pathEle.innerHTML; }
            delete gesture[gesturePath];
            if (gesture[pathEle.innerHTML]) {
                let pathTXT = ((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(0, 1) : '') + '[' + gesture[pathEle.innerHTML] + ']';
                gesture[pathTXT] = gesture[pathEle.innerHTML];
            }
            gesture[pathEle.innerHTML] = gestureName;
            GM_setValue('gesture', gesture);
            init();
        }
        window.addEventListener('touchmove', touchMove, { capture: true, passive: true });
        document.getElementById('revisePath').style.display = 'none';
    });
    //Open function switch settings
    document.getElementById('openSettings').addEventListener('click', () => {
        gestureBox.style.cssText = 'overflow-y:hidden !important';
        document.getElementById('settingsBox').style.display = 'block';
        let settingList = document.getElementById('settingList');
        settingList.innerHTML = '';
        for (let Ti in settings) {
            settingList.innerHTML += '<p>' + Ti + '：</p>';
            if (typeof (settings[Ti]) === 'boolean') {
                settingList.innerHTML += '<label class="switch"><input type="checkbox" id="' + Ti + '" ' + ((settings[Ti]) ? 'checked' : '') + '><div class="slider"></div></label>';
            } else if (typeof (settings[Ti]) === 'object') {
                settingList.innerHTML += '<div class="slideRail"><div class="slideButton" id="' + Ti + '"></div></div>';
                let slideButton = document.getElementById(Ti),
                    leftPX = slideButton.parentNode.offsetWidth * (settings[Ti][0] - settings[Ti][1]) / (settings[Ti][2] - settings[Ti][1]) - slideButton.offsetWidth / 2;
                slideButton.style.left = leftPX + 'px';
                slideButton.innerHTML = settings[Ti][0].toFixed(settings[Ti][3]);
            }
        }
        let slideList = document.getElementsByClassName('slideButton');
        for (let Ti = 0, len = slideList.length; Ti < len; ++Ti) {
            slideList[Ti].addEventListener('touchmove', silideBar, true);
        }
    }, true);
    //Save feature switch settings
    document.getElementById('saveSettings').addEventListener('click', () => {
        gestureBox.style.cssText = '';
        for (let Ti in settings) {
            if (typeof (settings[Ti]) === 'boolean') {
                settings[Ti] = document.getElementById(Ti).checked;
            } else if (typeof (settings[Ti]) === 'object') {
                settings[Ti][0] = +document.getElementById(Ti).innerHTML;
            }
        }
        GM_setValue('settings', settings);
        document.getElementById('settingsBox').style.display = 'none';
    }, true);
}

/*event registration module*/
function regEvent() {
    if (top === self) {
        //clear back timer
        window.addEventListener('popstate', () => { clearTimeout(gestureData.backTimer); gestureData.backTimer = 0; }, true);
        window.addEventListener('beforeunload', () => { clearTimeout(gestureData.backTimer); gestureData.backTimer = 0; }, true);
        //Receive iframe data
        window.addEventListener('message', async (e) => {
            let data = e.data;
            switch (data.type) {
                case 'GYRO': {//Lock landscape mode
                    await screen.orientation.lock('landscape')?.catch(Date);
                    break;
                }
                case 'runPath': {//Iframe gestures are performed on the top-level page
                    let _gestureData = data.gestureData, iframe = iframeEle[0];
                    for (let Ti = 0, len = iframeEle.length; Ti < len; ++Ti) {
                        if (iframeEle[Ti].contentWindow === e.source) { iframe = iframeEle[Ti]; break; }
                    }
                    let ifrRect = iframe.getBoundingClientRect();
                    gestureData.touchStart = _gestureData.touchStart; gestureData.touchEnd = _gestureData.touchEnd;
                    gestureData.touchStart.target = gestureData.touchEnd.target = gestureData.touchEle = iframe;
                    gestureData.touchStart.pageX = gestureData.touchStart.clientX += ifrRect.x;
                    gestureData.touchStart.pageY = gestureData.touchStart.clientY += ifrRect.y;
                    gestureData.touchEnd.pageX = gestureData.touchEnd.clientX += ifrRect.x;
                    gestureData.touchEnd.pageY = gestureData.touchEnd.clientY += ifrRect.y;
                    path = data.runPath; setTimeout(runGesture);
                    break;
                }
                case 'pushTouch': {//Iframe gesture coordinate transfer
                    let _gestureData = data.gestureData, ifrRect = gestureData.touchEle.getBoundingClientRect();
                    gestureData.touchEnd = _gestureData.touchEnd;
                    gestureData.touchEnd.target = gestureData.touchEle;
                    gestureData.touchEnd.pageX = gestureData.touchEnd.clientX += ifrRect.x;
                    gestureData.touchEnd.pageY = gestureData.touchEnd.clientY += ifrRect.y;
                    break;
                }
                case 'download': {//Iframe video download
                    window._downloadVideo_(data);
                    break;
                }
            }
        }, true);
    } else {
        //Iframe video full screen
        GM_addValueChangeListener('fullscreen', async (name, old_value, new_value, remote) => {
            if (!document.hidden && window._isShow_) {
                await findVideoBox()?.requestFullscreen()?.catch(Date);
            }
        });
        //Iframe lock
        GM_addValueChangeListener('isShow', (name, old_value, new_value, remote) => {
            if (!document.hidden) { window._isShow_ = !remote; }
        });
    }
    //Uncheck restriction
    addStyle('*{user-select:text !important;touch-action:manipulation;}');
    //load detection
    checkTimer = setTimeout(loadCheck, 200);
    observer.observe(document, { childList: true, subtree: true });
    //Gesture event registration
    window.addEventListener('touchstart', touchStart, { capture: true, passive: false });
    window.addEventListener('touchmove', touchMove, { capture: true, passive: true });
    window.addEventListener('touchend', touchEnd, { capture: true, passive: false });
    window.addEventListener('touchcancel', touchEnd, { capture: true, passive: false });
    window.addEventListener('contextmenu', (e) => { if (path.indexOf("I") > -1) { e.preventDefault(); } }, true);//Disable the popup menu when long pressing the image
    if (settings['Avoid breaking touch']) { window.addEventListener('click', delayClick, true); }
}
regEvent();