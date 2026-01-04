// ==UserScript==
// @name         触摸屏视频优化
// @namespace    https://github.com/HeroChan0330
// @version      2.23
// @description  触摸屏视频播放手势支持，上下滑调整音量，左右滑调整进度
// @author       HeroChanSysu
// @match        https://*/*
// @match        http://*/*
// @match        ftp://*/*
// @grant        GM_addStyle
// @grant        GM_setValue  
// @grant        GM_getValue  
// @downloadURL https://update.greasyfork.org/scripts/405897/%E8%A7%A6%E6%91%B8%E5%B1%8F%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405897/%E8%A7%A6%E6%91%B8%E5%B1%8F%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var TGUserDefaultSetting = {
    global : {
        gSwitchState:true,
        gSwitchProgress:true,
        gSwitchBrightness:true,
        gSwitchVolume:true,
        gSwitchSpeedX4:true,
        gSwitchSpeed:true,
        gSwitchSpeedX4Sigle:false,
        gSelectToastPos:"middle"
    },
    website :{

    }
};
var TGUserSetting;

// 黑名单
var TouchGestureBlackList=[
    
];

var TouchGesture={forbidScroll:false,orientationLocked:false,ismobile:false,debug:false};
var TouchGestureSetting = {volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true,forbidScrollNFS:false};
/*
*    WhiteList format
*    function container(video_element){
*       callback(root_element,listen_element，options);
*       callback(null,null,options);
*   }
*   options = {volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true}
*/
var TouchGestureWhiteList={
    "www.bilibili.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("bpx-player-video-wrap")){
                if(tg_IsFullscreen()==true){
                    var root_element = seekGrandParentByClass(parent,"bpx-player-video-area");
                    var listen_element = seekGrandParentByClass(root_element,"video-container-v1");
                    // return [root_element,listen_element];
                    callback(root_element,listen_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
                }
                else{
                    var root_element = seekGrandParentByClass(parent,"bpx-player-video-area");
                    var listen_element = seekGrandParentByClass(root_element,"player-wrap");
                    // return [root_element,listen_element];
                    callback(root_element,listen_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
                }
            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["bilibili-player-dm-tip-wrap"]
    },
    "m.bilibili.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("mplayer-video-wrap")){
                var root_element = seekGrandParentByClass(parent,"mplayer");
                // return [root_element,listen_element];
                callback(root_element,root_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["player-mobile-display","mplayer-display"]
    },
    "weibo.com":{
        container:function(video_element,callback){
            // return null;
            callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
        },
        forbidScrollList:["wbpv-tech","wbpv-open-layer-button"]
    },
    "www.youtube.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("html5-video-container")){
                // var temp = parent;
                // while(temp!=null){
                //     if(temp && temp.id=='player'){
                //         break;
                //     }
                //     temp = temp.parentElement;
                // }
                // var root_element;
                // if(temp!=null){
                //     root_element = temp;
                // }
                // else{
                //     root_element = parent;
                // }
                var root_element = seekGrandParentByClass(parent,"ytd-player");
                // return [root_element,listen_element];
                callback(root_element,root_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["video-stream","ytd-watch-flexy"]
    },
    "m.youtube.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("html5-video-container")){
                var root_element = seekGrandParentByClass(parent,"player-container");
                var listen_element = null;
                ytFindListenElement();
                function ytFindListenElement(){
                    listen_element = root_element.getElementsByClassName("player-controls-background")[0];
                    // console.log(root_element);
                    // console.log(listen_element);
                    if(listen_element==null){
                        setTimeout(() => {
                            ytFindListenElement();
                        }, 500);
                    }
                    else{
                        callback(root_element,listen_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
                        // console.log("callback!");
                    }
                }

            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["animation-enabled","player-controls-background"]
    },
    "v.youku.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("youku-film-player")){
                var root_element = seekGrandParentByClass(parent,"youku-film-player");
                // return [root_element,listen_element];
                callback(root_element,root_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
            else if(parent.classList.contains("video-layer")){
                var root_element = seekGrandParentByClass(parent,"youku-player");
                // return [root_element,listen_element];
                callback(root_element,root_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["yk-trigger-layer","kui-dashboard-display-panel","kui-message-information"]
    },
    "www.facebook.com":{
        container:function(video_element,callback){
            // return null;
            callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
        },
        forbidScrollList:["i09qtzwb"]
    },
    "v.qq.com":{
        container:function(video_element,callback){
            var parent = video_element.parentElement;
            if(parent.classList.contains("txp_video_container")){
                var root_element = seekGrandParentByClass(parent,"txp_player");
                // return [root_element,listen_element];
                callback(root_element,root_element,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
            else{
                // return null;
                callback(null,null,{volume:true,brightness:true,progress:true,speed:true,speedx4:true,speedx4single:true,state:true});
            }
        },
        forbidScrollList:["txp_shadow","plugin_ctrl_txp_shadow"]
    }

};


var CustomizedVideoTAG = {
    "www.bilibili.com":["bwp-video"]
};



function seekGrandParentByClass(child,parentClass){
    var temp = child;
    while(temp!=null){
        if(temp.classList!=null && temp.classList.contains(parentClass)){
            return temp;
        }
        temp = temp.parentElement;
    }
    return null;
}

var forbidScrollList=[];

TouchGesture.VideoGesture=function(videoElement){
    this.touchDownPt=null; //触摸按下时得位置
    this.touchDownTime = 0;
    this.touchStartPt=null; //顺着一定方向滑动时并触发功能，开始计算的点
    
    this.sweepDir=0; //0:no sweep 1:up 2:down 3:left 4:right
    this.startTouchVideoTime; 
    this.startTouchVideoVolume;
    this.touchResult=0; //触摸结果暂存
    this.startTouchFingers=0; //在触发功能前触摸点数
    this.originalPlayrate=1; //视频原本的播放速率
    //this.bodyPosition="";
    this.videoBrightness=1;
    this.startTouchBrightness=1;
    this.longTouch=false;

    this._videoSrcStore=null;
    this._videoElement=videoElement;//对象video标签
    this._videoElementAbLeft=0; //video标签相对页面的left
    this._elementFrame=null;//文字显示的框架
    this._toastText=null; //文字显示
    this._unlockBtn = null; //解锁按钮
    this._settingBtn = null; // 设置按钮

    this._containElement=null; //_elementFrame的父级
    this._eventListenElement=null;//监听触摸动作的元素

    this._options = TouchGestureSetting;
    this._contextMenuFunc = document.oncontextmenu;

    this._fullScreenNow=tg_IsFullscreen();
    if(this._videoElement.style.filter=="" || this._videoElement.style.filter==null)
        this._videoElement.style.filter = "brightness(1)";
    // console.log("_fullScreenNow:"+this._fullScreenNow);

    // console.log(TouchGestureWhiteList);
    // console.log(TouchGestureWhiteList["www.bilibili.com"]!=null);

    var self = this;

    self.createDom();
    self.findBestRoot(function(root_element,listen_element){
        self.applyDom();  
        
        // video内地址更改时，重新设置页面(针对bilibili连续播放)
        self._videoElement.addEventListener('play', function () { //播放开始执行的函数
            if(self._videoSrcStore == null){
                // alert("first play");
                self._videoSrcStore=self._videoElement.src;

            }else if(self._videoElement.src!=self._videoSrcStore){
                // alert("replay");
                self.restoreDom();
                self.findBestRoot(function(root_element,listen_element){
                    self.applyDom();
                });
                
            }
        });
    });
      



    this._videoElement.addEventListener('play', function () {
        self._settingBtn.style.display = "none";
    });

    this._videoElement.addEventListener('pause', function () {
        self._settingBtn.style.display = "block";
        self.setSettingBtnLayout();
        setTimeout(() => {
            self._settingBtn.style.display = "none";
        }, 3000);
    });

};

// 产生显示元素
TouchGesture.VideoGesture.prototype.createDom=function(parentElement){

    var toastDiv=document.createElement("div");
    var toastText=document.createElement("span");
    var unlockBtn = document.createElement("div");
    var settingBtn = document.createElement("div");

    toastDiv.appendChild(toastText);
    toastDiv.classList.add("TouchGesture_Toast");
    toastText.classList.add("TouchGesture_ToastText");
    unlockBtn.classList.add("TouchGesture_Btn");
    settingBtn.classList.add("TouchGesture_Btn");
    
    toastDiv.style.display="none";
    unlockBtn.style.display="none";
    unlockBtn.style.position="fixed";
    unlockBtn.innerHTML = "&#128274;";

    settingBtn.style.display = "none";
    settingBtn.style.position="absolute";
    settingBtn.innerHTML = "&#9881;";
    
    this._elementFrame=toastDiv;
    this._toastText=toastText;
    this._unlockBtn = unlockBtn;
    this._settingBtn = settingBtn;

    this._elementFrame.classList.add("TouchGestureForbidScroll");
    this._toastText.classList.add("TouchGestureForbidScroll");
    this._unlockBtn.classList.add("TouchGestureForbidScroll");
    this._settingBtn.classList.add("TouchGestureForbidScroll");

    this._touchStartHandler=this.onTouchStart.bind(this);
    this._touchEndHandler=this.onTouchEnd.bind(this);
    this._touchMoveHandler=this.onTouchMove.bind(this);
    this._windowResizeHandeler=this.fullScreenDetect.bind(this);
    window.addEventListener("resize",this._windowResizeHandeler,"false");
    // this._orientationChange = this.onOrientationChange;
    // window.addEventListener("orientationchange",this._orientationChange,"false");

    var self = this;
    this._unlockBtn.onclick=function(event){
        // console.log("unlock cancel");
        screen.orientation.unlock();
        event.stopPropagation();
    };

    this._settingBtn.onclick=function(event){
        // alert("setting clicked");
        var domain = window.location.host;
        var url = "https://herochansysu.gitlab.io/touchgesturesetting/index_v2.html?target="+domain;
        // var url = "http://192.168.1.33:8848/TouchGestureSetting/index_v2.html?target="+domain;
        // window.parent.open(url);
         window.parent.location.href = url;
    };

    this._unlockBtn.addEventListener("transitionend",function(){
        self._unlockBtn.style.display = "none";
    });

};

// 找到显示元素最佳的parent及监听元素
TouchGesture.VideoGesture.prototype.findBestRoot=function(callback){
    var self=this;
    var targetElement=this._videoElement;
    var hostDomain=window.location.host;
    var defaultSetting=TouchGestureWhiteList[hostDomain];
    var defaultSettingSuccess=false;
    if(defaultSetting!=null){
        // console.log("defaultSetting!=null");
        defaultSetting.container(this._videoElement,function(root_element,listen_element,options){
            if(root_element!=null&&listen_element!=null){
                self._containElement=root_element;
                self._eventListenElement=listen_element;
                defaultSettingSuccess = true;
            }
            else{
                self.findBestRootByParent();
            }
            if(options!=null){
                for(var key in self._options){
                    self._options[key] = TouchGestureSetting[key] && options[key];
                }
            }
            callback(self._containElement,self._eventListenElement);
        });

    }
    else{
        self.findBestRootByParent();
        callback(self._containElement,self._eventListenElement);
    }

    


};



TouchGesture.VideoGesture.prototype.findBestRootByParent=function(){
    var self=this;
    var targetElement=this._videoElement;
    var elementInFullScreen = false;
    if(self._fullScreenNow == true){
        var temp = targetElement;
        while(temp != null){
            if(temp == document.fullscreenElement){
                elementInFullScreen = true;
                break;
            }
            // console.log(temp);
            temp = temp.parentElement;
        }
    }
    // console.log("video in fullsceen");
    // console.log(elementInFullScreen);

    if(elementInFullScreen==false){
        targetElement=targetElement.parentElement;
        var topest=false;
        while(!topest){
            // targetElement.classList.add("TouchGestureForbidScroll");
            var temp=targetElement.parentElement;
            var size1=targetElement.offsetWidth*targetElement.offsetHeight;
            var size2=temp.offsetWidth*temp.offsetHeight;
            if(temp.offsetWidth>=targetElement.offsetWidth&&temp.offsetHeight>=targetElement.offsetHeight&&size2/size1<=1.2){
                targetElement=temp;
            }else{
                topest=true;
            }
            if(temp.tagName.toLowerCase()=="body"){
                break;
            }
        }
        self._containElement=targetElement;
        self._eventListenElement=targetElement;
    }else{
        // alert("FULLSCREEN!");
        if(document.fullscreenElement!=null){
            self._containElement=document.fullscreenElement;
            self._eventListenElement=document.fullscreenElement;
            // // delete other toast for other video under fullscreen
            // if(self._containElement!=null){
            //     var toasts = self._containElement.getElementsByClassName("TouchGesture_Toast");
            //     toasts.forEach(t => {
            //         self._containElement.removeChild(t);
            //     });
            // }
        }
    }
}
// TouchGesture.findFullScreenRoot=function(){

// };

TouchGesture.VideoGesture.prototype.simMouseMoveDock=function(){
    if(this.touchDownPt==null)
        return;
    var self=this;
    var event = new MouseEvent('mousemove', {
        view: document.defaultView,
        bubbles: true,
        cancelable: false,
        clientX:self._videoElement.clientWidth/2+Math.floor(Math.random()*20),
        clientY:self._videoElement.clientHeight*1.5
    });
    self._videoElement.dispatchEvent(event);
    setTimeout(() => {
        self.simMouseMoveDock();
    }, 1000);
};


TouchGesture.VideoGesture.prototype.simMouseMoveCenter=function(){
    var self=this;
    var event = new MouseEvent('mousemove', {
        view: document.defaultView,
        bubbles: true,
        cancelable: false,
        clientX:self._videoElement.clientWidth/2,
        clientY:self._videoElement.clientHeight/2
    });
    self._videoElement.dispatchEvent(event);
};

// 触摸开始
TouchGesture.VideoGesture.prototype.onTouchStart=function(e){
    if(this._videoElement.src.length<=2){
        // 视频的src长度太低，视频基本无效。
        return;
    }
    if(this.sweepDir!=0){
        // 当滑动一定距离后，不再响应touchdown
        if(e.touches.length!=this.startTouchFingers){
            // 触摸点数变化，取消当前的触摸结果
            this.cancelTouch();
        }
        return;
    }
    // this.forbidScroll();
    // console.log(e);
    this.setElementLayout(TGUserSetting.global.gSelectToastPos);
    // console.log(e);
    this.startTouchFingers=e.touches.length;
    if(this.startTouchFingers>0){
        this.originalPlayrate=this._videoElement.playbackRate;
        if(this.startTouchFingers==2){
            var dis=Math.sqrt((e.touches[0].clientX-e.touches[1].clientX)*(e.touches[0].clientX-e.touches[1].clientX)+(e.touches[0].clientY-e.touches[1].clientY)*(e.touches[0].clientY-e.touches[1].clientY));
            var longside = (document.body.clientWidth>document.body.clientHeight)?document.body.clientWidth:document.body.clientHeight;
            if(dis>longside/4){
                // 两个触摸到相隔太远，取消触摸结果
                this.touchDownPt=null;
                this.startTouchFingers=0;
                this.cancelTouch();
                return;
            }else{
                // 记录原本的播放速率，并且4倍速播放
                this.setElementLayout("top");
                if(this._options.speedx4==true){
                    this._videoElement.playbackRate=4.0;
                    this.setToast('4倍速播放<b>>>></b>');
                    this._toastText.classList.add("toast_blink");
                }
            }
        }
        else if(this.startTouchFingers==1){
            var self = this;
            if(this._options.speedx4==true && this._options.speedx4single==true){
                setTimeout(() => {
                    var dt = new Date();
                    var elipse = dt.getTime() - self.touchDownTime;
                    if(elipse > 400 && self.touchDownPt != null && self.sweepDir==0 && self.startTouchFingers==1){
                        self.setElementLayout("top");
                        self._videoElement.playbackRate=4.0;
                        self.setToast('4倍速播放<b>>>></b>');
                        self._toastText.classList.add("toast_blink");
                        // document.addEventListener('contextmenu',tgPreventDefault);
                        self._contextMenuFunc = document.oncontextmenu;
                        document.oncontextmenu = function(){e.preventDefault();return false;}
                        self.sweepDir=-1;
                    }
                }, 500);
            }else if(this._options.state==true){
                setTimeout(() => {
                    var dt = new Date();
                    var elipse = dt.getTime() - self.touchDownTime;
                    if(elipse > 400 && self.touchDownPt != null && self.touchResult==0 && self.startTouchFingers==1){
                        var str = seconds2TimeStr(Math.floor(self._videoElement.currentTime)) + " / " + seconds2TimeStr(Math.floor(self._videoElement.duration));
                        self.setToast(str);
                        self.simMouseMoveDock();
                        self.longTouch=true;
                        
                    }
                }, 500);
            }
        }
        this.touchDownPt=e.touches[0];
        var dt = new Date();
        this.touchDownTime = dt.getTime();
        var tor = window.screen.height/10;
        if(TouchGesture.ismobile == true && this._fullScreenNow == true && (this.touchDownPt.pageY < tor || this.touchDownPt.pageY > window.screen.height-tor)){
            this.cancelTouch(); // 移动端边缘上滑、下滑判定
        }

        var ableft=this._videoElement.offsetLeft;
        var temp=this._videoElement.offsetParent;
        while(temp!=null){
            ableft+=temp.offsetLeft;
            temp=temp.offsetParent;
        }
        this._videoElementAbLeft=ableft;
        // console.log("ableft:"+ableft);
    
    }else{
        this.cancelTouch();
    }
};

TouchGesture.VideoGesture.prototype.onTouchMove=function(e){
    // console.log(e);
    var videoElement=this._videoElement;
    if(this.touchDownPt==null)
        return;
    // if(e.touches.length!=this.startTouchFingers){
    //     this.cancelTouch();
    //     return;
    // }
    if(this.startTouchFingers==1){
        // 单个手指触摸
        var touchPt=e.touches[0];
        delX=touchPt.clientX-this.touchDownPt.clientX;
        delY=touchPt.clientY-this.touchDownPt.clientY;
        if(this.sweepDir==0){
            var radius=Math.sqrt(delX*delX+delY*delY);
            var w=videoElement.offsetWidth,h=videoElement.offsetHeight;
            var judge=Math.sqrt(w*w+h*h)/30;
            if(radius>judge){
                if(Math.abs(delX)>Math.abs(delY)){
                    if(delX>0)
                        this.sweepDir=4;
                    else
                        this.sweepDir=3;
                }else{
                    if(delY>0)
                        this.sweepDir=2;
                    else
                        this.sweepDir=1;

                }
                // console.log("get sweep dir:"+this.sweepDir);
                this.startTouchVideoTime=Math.floor(videoElement.currentTime);
                this.startTouchVideoVolume=videoElement.volume;
                this.startTouchBrightness=this.videoBrightness;
                this.touchStartPt=touchPt;
            }
        }else if(this._options.progress==true && (this.sweepDir==3||this.sweepDir==4)){
            delX=touchPt.clientX-this.touchStartPt.clientX;
            var delXRatio=delX/videoElement.offsetWidth;
            // console.log(delXRatio);
            var duration = this._videoElement.duration;
            if(isNaN(duration)==true){
                duration = 1800;
            }
            if(Math.abs(delXRatio)<0.5){
                this.touchResult=Math.floor(delXRatio*240);
            }else{
                if(delXRatio>0)
                    this.touchResult=Math.floor((Math.pow(10000,delXRatio-0.5)-1)/50*duration+delXRatio*240);
                else
                    this.touchResult=Math.floor(-(Math.pow(10000,-delXRatio-0.5)-1)/50*duration+delXRatio*240);
                //this.touchResult=Math.floor(Math.pow(2*delX/videoElement.offsetWidth,3)*120);
            }
            if(this.touchResult+this.startTouchVideoTime<0)
                this.touchResult=-this.startTouchVideoTime;
            if(this.touchResult+this.startTouchVideoTime>videoElement.duration){
                this.touchResult=Math.floor(videoElement.duration-this.startTouchVideoTime)-1;
            }
            if( (this.sweepDir==3&&this.touchResult>0)||(this.sweepDir==4&&this.touchResult<0)){
                this.touchResult=0;
            }
            var offsetValStr;
            if(Math.abs(this.touchResult)<60)
                offsetValStr=this.touchResult+"s";
            else{
                if(this.touchResult>0){
                    var sec = this.touchResult%60;
                    offsetValStr=Math.floor(this.touchResult/60)+":"+(sec < 10? '0' + sec : sec);
                }
                else{
                    var sec = (-this.touchResult)%60;
                    offsetValStr="-"+Math.floor(-this.touchResult/60)+":"+(sec < 10? '0' + sec : sec);
                }
            }
            // if(this.touchResult==Infinity){
            //     this._elementFrame.style.display="none";
            // }
            if(this.touchResult>0)
                this.setToast(seconds2TimeStr(this.startTouchVideoTime)+" +"+offsetValStr);
            else
                this.setToast(seconds2TimeStr(this.startTouchVideoTime)+" "+offsetValStr);
            // console.log(videoElement);
        }else if(this.sweepDir==1||this.sweepDir==2){
            if(this.touchStartPt.clientX-this._videoElementAbLeft<this._videoElement.clientWidth/2){
                if(this._options.brightness==true){
                    delY=touchPt.clientY-this.touchStartPt.clientY;
                    var plus=-delY/videoElement.offsetHeight*4;
                    this.touchResult=this.startTouchBrightness+plus;
                    if(this.touchResult<0) this.touchResult=0;
                    else if(this.touchResult>1) this.touchResult=1;
                    this.videoBrightness=this.touchResult;
                    var realBrightness=Math.sqrt(this.touchResult)*0.85+0.15;
                    videoElement.style.filter="brightness("+realBrightness+")";
                    this.setToast("&#x2600;&nbsp;"+Math.floor(this.touchResult*100)+"%");
                }
            }else{
                if(this._options.volume==true){
                    delY=touchPt.clientY-this.touchStartPt.clientY;
                    var plus=-delY/videoElement.offsetHeight*4;
                    this.touchResult=this.startTouchVideoVolume+plus;
                    if(this.touchResult<0) this.touchResult=0;
                    else if(this.touchResult>1) this.touchResult=1;
                    videoElement.volume =this.touchResult;
                    // if(videoElement.volume!=0)
                    //    videoElement.muted=false;
                    this.setToast("&#x266b;&nbsp;"+Math.floor(this.touchResult*100)+"%");
                }
            }
        }

        //console.log("delx:"+delX);
    }else if(this.startTouchFingers==2){
        // 2个手指触摸
        var touchPt=e.touches[0];
        delX=touchPt.clientX-this.touchDownPt.clientX;
        delY=touchPt.clientY-this.touchDownPt.clientY;
        if(this.sweepDir==0){
            var radius=Math.sqrt(delX*delX+delY*delY);
            var w=videoElement.offsetWidth,h=videoElement.offsetHeight;
            var judge=Math.sqrt(w*w+h*h)/30;
            if(radius>judge){
                if(Math.abs(delX)>Math.abs(delY)){
                    this._videoElement.playbackRate=this.originalPlayrate;
                    if(delX>0)
                        this.sweepDir=4;
                    else
                        this.sweepDir=3;
                }else{
                    if(delY>0)
                        this.sweepDir=2;
                    else
                        this.sweepDir=1;

                }
                // console.log("get sweep dir:"+this.sweepDir);
                this.touchStartPt=touchPt;
                
            }
        }else if(this.sweepDir==3||this.sweepDir==4){
            if(this._options.speed==true){
                delX=touchPt.clientX-this.touchStartPt.clientX;
                this.touchResult=this.originalPlayrate+Math.floor((delX/videoElement.offsetWidth)*10)*0.25;
                if(this.touchResult>4) this.touchResult=4;
                if(this.touchResult<0.25) this.touchResult=0.25;
                this.setToast("倍速X "+this.touchResult);
            }
        }
    }
};


TouchGesture.VideoGesture.prototype.onTouchEnd=function(e){
    var videoElement=this._videoElement;
    this.touchDownPt=null;
    if(this.touchResult!=0){
        if(this.startTouchFingers==1){
            if(this.sweepDir==3||this.sweepDir==4){
                if(this._options.progress==true){
                    var res=this.startTouchVideoTime+this.touchResult;
                    // console.log(videoElement.currentTime);
                    // console.log("touch end:"+res);
                    videoElement.currentTime=res;
                    // this.hideToast();
                    // videoElement.play();
                }
            }else if(this.sweepDir==1||this.sweepDir==2){
                // this.hideToast();
                // videoElement.play();
            }
        }else if(this.startTouchFingers==2){
            if(this.sweepDir==3||this.sweepDir==4){
                if(this._options.speed==true){
                    this._videoElement.playbackRate=this.touchResult;
                    this.originalPlayrate=this.touchResult;
                }
            }
        }
    }else{

    }
    this.sweepDir=0;
    this.touchResult=0;
    this._videoElement.playbackRate=this.originalPlayrate;
    this.hideToast();
    if(this.longTouch==true)
        this.simMouseMoveCenter();
    this.longTouch=false;
    if(this._options.speedx4==true && this._options.speedx4single==true)
        document.oncontextmenu = this._contextMenuFunc;

    // this.cancelTouch();

    // this.permitcroll();
};

// 启动监听
TouchGesture.VideoGesture.prototype.applyDom=function(videoElement){
    this._containElement.appendChild(this._settingBtn);
    var hostDomain=window.location.host;
    if(TGUserSetting.website[hostDomain]!=null && TGUserSetting.website[hostDomain]["wSwitchEnable"]==false){ //用户设置该网站上不可用，不监听手势
        return;
    }
    this._containElement.appendChild(this._elementFrame);
    this._containElement.appendChild(this._unlockBtn);

    var temp=this._videoElement;
    while(temp!=this._eventListenElement && temp!=null){
            if(temp.classList!=null)
            temp.classList.add("TouchGestureForbidScroll");
            temp=temp.parentElement;
    }
    this._eventListenElement.classList.add("TouchGestureForbidScroll");

    this._eventListenElement.addEventListener("touchstart",this._touchStartHandler,false);
    this._eventListenElement.addEventListener("touchend",this._touchEndHandler,false);
    this._eventListenElement.addEventListener("touchmove",this._touchMoveHandler,false);


};

// Resize时恢复元素原样，取消事件监听
TouchGesture.VideoGesture.prototype.restoreDom=function(){
    if(this._containElement!=null){
        this._containElement.appendChild(this._elementFrame);
        // this._containElement.removeChild(this._elementFrame);
    }

    var temp=this._videoElement;
    while(temp!=this._eventListenElement){
        if(temp.classList!=null)
            temp.classList.remove("TouchGestureForbidScroll");
        temp=temp.parentElement;
        if(temp == null)
            break;
    }
    if(this._eventListenElement==null)
        return;
    this._eventListenElement.classList.remove("TouchGestureForbidScroll");

    this._eventListenElement.removeEventListener("touchstart",this._touchStartHandler);
    this._eventListenElement.removeEventListener("touchend",this._touchEndHandler);
    this._eventListenElement.removeEventListener("touchmove",this._touchMoveHandler);
};

// 窗口resize时检测是否全屏并且适配
TouchGesture.VideoGesture.prototype.fullScreenDetect=function(){
    // alert("resize");
    var self = this;
    this.setUnlockBtnLayout(); 
    this.setSettingBtnLayout();

    var fullScreenState=tg_IsFullscreen();
    if(fullScreenState!=this._fullScreenNow){
        this._fullScreenNow=fullScreenState;
        this.restoreDom();
        this.findBestRoot(function(root_element,listen_element){
            self.applyDom();
            if(fullScreenState == true){
                // console.log("fullscreen");
                self._elementFrame.style.position = "fixed";
                self.simMouseMoveCenter();
                //模拟鼠标移到中间，使得自动隐藏视频底部
            }
            else{
                self._elementFrame.style.position = "absolute";
            }
        });
    }
    if(fullScreenState==true && this.videoInFullscreenElement()){
        if(this._videoElement.videoWidth/this._videoElement.videoHeight>1.3){
            // console.log("lock");
            if(TouchGesture.orientationLocked == false && TouchGesture.ismobile == true){
                TouchGesture.orientationLocked = true;
                setTimeout(() => {
                    {
                        screen.orientation.lock("landscape");
                        setTimeout(() => {
                            this._unlockBtn.style.display = "block";
                            this._unlockBtn.classList.remove("fadeout");
                        }, 300);
                        setTimeout(() => {
                            self._unlockBtn.classList.add("fadeout");
                        }, 2300);
                    }
                }, 300);
            }
            // screen.lockOrientationUniversal("landscape-primary");
        }
    }else if(fullScreenState == false){
        TouchGesture.orientationLocked = false;
        screen.orientation.unlock();
    }
};

// TouchGesture.VideoGesture.prototype.onOrientationChange=function(){
//     var self = this;

// };


TouchGesture.VideoGesture.prototype.videoInFullscreenElement=function(){
    var temp = this._videoElement;
    while(temp!=null && temp!=document.body){
        if(temp == document.fullscreenElement)
            return true;
        temp = temp.parentElement;
    }
};

//自动调节DIV元素位置
TouchGesture.VideoGesture.prototype.setElementLayout=function(pos){
    var videoTarget=this._containElement;
    var vw=videoTarget.offsetWidth,vh=videoTarget.offsetHeight;
    var w=vw/5;
    //var h=vh/8;
    var h=w/3;
    var x=(vw-w)/2+videoTarget.offsetLeft;
    var y;
    if(pos == "bottom"){
        y= vh*7/8-h/2+videoTarget.offsetTop;
    }else if(pos == "top"){
        y= vh*1/8-h/2+videoTarget.offsetTop;
    }
    else{
        y= vh/2-h/2+videoTarget.offsetTop;
    }
    // console.log("w:"+w," h:"+h+" x:"+x+" y:"+y);
    this._elementFrame.style.width=w+"px";
    this._elementFrame.style.height=h+"px";
    this._elementFrame.style.left=x+"px";
    this._elementFrame.style.top=y+"px";
    // this._element.style.display="block";
    var fontsize=h/3;
    this._toastText.style.fontSize=fontsize+"px";
    this._toastText.style.marginTop=(h-fontsize)/2+"px";
    this._elementFrame.style.display="none";
    this._elementFrame.style.borderRadius = w/10 +"px";


};

TouchGesture.VideoGesture.prototype.setUnlockBtnLayout=function(){
    var videoTarget=this._containElement;
    var vw=window.screen.width,vh=window.screen.height;
    var w = vh/8;
    var h = vh/8;
    var x=(vw-w)/2;
    var y=(vh-h)/2+vh/6;

    this._unlockBtn.style.fontSize=w/2+"px";
    this._unlockBtn.style.width=w+"px";
    this._unlockBtn.style.height=h+"px";
    this._unlockBtn.style.lineHeight = h+"px";
    this._unlockBtn.style.left=x+"px";
    this._unlockBtn.style.top=y+"px";
    this._unlockBtn.style.borderRadius = w/2+"px";
    // this._unlockBtn.style.display = "block";
    // this._unlockBtn.classList.remove("fadeout");
}

TouchGesture.VideoGesture.prototype.setSettingBtnLayout=function(){
    var videoTarget=this._containElement;
    var vw=videoTarget.offsetWidth,vh=videoTarget.offsetHeight;
    var w = vh/8;
    var h = vh/8;
    var x= vw - w - vw/12;
    var y=(vh-h)/2;
    if(vw/window.screen.width<0.3){
        this._settingBtn.style.display = "none"; // 隐藏小视频的设置按钮
    }else{
        this._settingBtn.style.fontSize=w/2+"px";
        this._settingBtn.style.width=w+"px";
        this._settingBtn.style.height=h+"px";
        this._settingBtn.style.lineHeight = h+"px";
        this._settingBtn.style.left=x+"px";
        this._settingBtn.style.top=y+"px";
        this._settingBtn.style.borderRadius = w/2+"px";
    }

}


//显示Toast
TouchGesture.VideoGesture.prototype.setToast=function(str){
    // this._element.style.opacity=0.75;
    this._elementFrame.style.display="block";
    this._elementFrame.classList.remove("fadeout");
    this._toastText.innerHTML=str;
}

//在Touchend之前取消手势
TouchGesture.VideoGesture.prototype.cancelTouch=function(){
    this.sweepDir=0;
    this._videoElement.playbackRate=this.originalPlayrate;
    this.touchDownPt=null;
    this.hideToast();
}

// 隐藏toast
TouchGesture.VideoGesture.prototype.hideToast=function(){
    var self = this;
    setTimeout(function(){
        self._elementFrame.classList.add("fadeout");
        self._toastText.classList.remove("toast_blink");
    },500);
    // setTimeout(function(){
    //     element.style.opacity=0;
    //     element.classList.remove("fadeout");
    // },1500);
}

// 检测<video>并插入元素
TouchGesture.VideoGesture.insertDom=function(dom){
    var videoTagsNative = dom.getElementsByTagName('video');
    // console.log(dom);
    Array.prototype.forEach.call(videoTagsNative, function(videoTag) {
        if (!videoTag.getAttribute('TouchGesture_Video')) {
            videoTag.setAttribute('TouchGesture_Video', true);
            new TouchGesture.VideoGesture(videoTag);
        //   console.log("insert node");
        }
    });

    var hostDomain=window.location.host;
    if(CustomizedVideoTAG[hostDomain] == null)
        return;

    CustomizedVideoTAG[hostDomain].forEach(function(videoTagName){
        var videoTags = dom.getElementsByTagName(videoTagName);
        // console.log(dom);
        Array.prototype.forEach.call(videoTags, function(videoTag) {
            if (!videoTag.getAttribute('TouchGesture_Video')) {
                videoTag.setAttribute('TouchGesture_Video', true);
                new TouchGesture.VideoGesture(videoTag);
            //   console.log("insert node");
            }
        });
    });
    
};

TouchGesture.VideoGesture.insertAll=function(){
    // var self=this;
    TouchGesture.VideoGesture.insertDom(document);

};

// TouchGesture.VideoGesture.prototype.forbidScroll=function(){
//     // var bodies=document.getElementsByTagName("body");
//     // Array.prototype.forEach.call(bodies, function(body) {
//     //     body.style.position="fixed";
//     // });
//     TouchGesture.forbidScroll=true;
// }

// TouchGesture.VideoGesture.prototype.permitcroll=function(){
//     // var bodies=document.getElementsByTagName("body");
//     // Array.prototype.forEach.call(bodies, function(body) {
//     //     body.style.position="relative";
//     // });
//     TouchGesture.forbidScroll=false;
// }

function seconds2TimeStr(secs){
    var hour=parseInt(secs/3600);
    var min=parseInt(secs/60)-60*hour;
    var sec=secs%60;
    var ret="";
    if(hour>0){
        ret+=hour+":";
    }
    ret+=(min < 10? '0' + min : min) + ':' + (sec < 10? '0' + sec : sec);
    return ret;
}

function initForbidScrollList(){
    var hostDomain=window.location.host;
    var defaultSetting=TouchGestureWhiteList[hostDomain];
    if(defaultSetting!=null){
        if(defaultSetting.forbidScrollList!=null)
            forbidScrollList=defaultSetting.forbidScrollList;
        // console.log(forbidScrollList);
    }
}

function whetherInBlackList(){
    var hostDomain=window.location.host;
    if(TouchGestureBlackList.indexOf(hostDomain)>=0){
        return true;
    }
    return false;
}
function tg_IsFullscreen(){
    return document.fullscreenElement!=null    ||
           document.msFullscreenElement!=null  ||
           document.mozFullScreenElement!=null ||
           document.webkitFullscreenElement!=null ||
           document.fullscreen == true || false;
}

function tg_IsMobile(){
    if(window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        return true; // 移动端
    }else if(window.screen.height/window.screen.width>1.3){
        return true; // 屏幕纵向
    }else{
        return false; // PC端
    }
}

function tgVideoPageInit(){
    GM_addStyle('div.TouchGesture_Toast{  width: 200px;  height: 100px;  opacity: 0.75;  position: absolute;  z-index: 2147483648;  top: 100px;  left: 200px;  background-color: black; pointer-events:none;} ');
    GM_addStyle('span.TouchGesture_ToastText{  position: absolute;  left: 0;  right: 0;  text-align: center;  color: white; pointer-events:none; font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;}');
    GM_addStyle('div.TouchGesture_Toast.fadeout{  -webkit-transition: all 1.5s; -moz-transition: all 1.5s; -ms-transition: all 1.5s; -o-transition: all 1.5s; transition: all 1.5s; opacity: 0;}');
    GM_addStyle('div.TouchGesture_Btn{opacity: 0.75; z-index: 2147483648; width: 50px;height: 50px;text-align: center;font-size: 25;margin: 20;background-color: black;color: white; font-family:apple color emoji,segoe ui emoji,noto color emoji,android emoji,emojisymbols,emojione mozilla,twemoji mozilla,segoe ui symbol;}');
    GM_addStyle('div.TouchGesture_Btn.fadeout{  -webkit-transition: all 1.5s; -moz-transition: all 1.5s; -ms-transition: all 1.5s; -o-transition: all 1.5s; transition: all 1.5s; opacity: 0;}');
    GM_addStyle('@media all and (-webkit-min-device-pixel-ratio:0) and (min-resolution: .001dpcm) { .toast_blink {background: -webkit-gradient( linear, left top, right top, color-stop(0, #000000), color-stop(0.5, #ffffff),color-stop(1,#000000) );-webkit-text-fill-color: transparent;-webkit-background-clip: text;-webkit-background-size: 200% 100%;-webkit-animation: toast_blink_animation 1s infinite linear;}}');
    GM_addStyle('@-webkit-keyframes toast_blink_animation {0%  { background-position: 150% 0;}100% { background-position: -50% 0;}}');

    var hostDomain = window.location.host;
    var glbSetting = TGUserSetting.global;
    var usrSetting = TGUserSetting.website[hostDomain];
    var glb = [glbSetting["gSwitchVolume"],glbSetting["gSwitchBrightness"],glbSetting["gSwitchProgress"],glbSetting["gSwitchSpeed"],glbSetting["gSwitchSpeedX4"],glbSetting["gSwitchState"],glbSetting["gSwitchSpeedX4Sigle"]];
    var usr = [true,true,true,true,true,true,true];
    // console.log(hostDomain);
    if(usrSetting!=null){
        usr = [usrSetting["wSwitchVolume"],usrSetting["wSwitchBrightness"],usrSetting["wSwitchProgress"],usrSetting["wSwitchSpeed"],usrSetting["wSwitchSpeedX4"],usrSetting["wSwitchState"],usrSetting["wSwitchSpeedX4Sigle"]];
        // console.log("usr setting exist");
    }
    
    TouchGestureSetting["volume"] =  glb[0] && usr[0];
    TouchGestureSetting["brightness"] =  glb[1] && usr[1];
    TouchGestureSetting["progress"] =  glb[2] && usr[2];
    TouchGestureSetting["speed"] =  glb[3] && usr[3];
    TouchGestureSetting["speedx4"] =  glb[4] && usr[4];
    TouchGestureSetting["state"] =  glb[5] && usr[5];
    TouchGestureSetting["speedx4single"] =  glb[6] && usr[6];
    TouchGestureSetting["forbidScrollNFS"] =  false;
    if(usrSetting!=null){
        TouchGestureSetting["forbidScrollNFS"] =  (usrSetting["wSwitchForbidScrollNFS"]==true);
    }
    // console.log("forbidScrollNFS");
    // console.log(TouchGestureSetting.forbidScrollNFS);
    
    // console.log(glb);
    // console.log(usr);

    initForbidScrollList();

    TouchGesture.ismobile = tg_IsMobile();
    window.addEventListener('resize',function(e){
        TouchGesture.ismobile = tg_IsMobile();
    });

    document.addEventListener('touchstart',function(e){
        if(forbidScrollList.indexOf(e.srcElement.classList[0])>=0){
            document.addEventListener('touchmove',tgPreventDefault,{passive:false});
        }else{
            var noVideo=true;
            
            const ev = window.event || e;
            const path = e.path || (e.composedPath && e.composedPath());
            // console.log(path);

            for(var i=0;i<path.length;i++){
                var element=path[i];
                // console.log(element);
                if(element.tagName=="VIDEO"||(element.classList&&element.classList.contains("TouchGestureForbidScroll"))){
                    // TouchGesture.forbidScroll=true;
                    noVideo=false;
                    break;
                }
            }

            var fs = tg_IsFullscreen();
            if(fs == false && !noVideo){
                if(TouchGestureSetting.forbidScrollNFS==false)
                    document.addEventListener('touchmove',tgPreventDefault,{passive:false});
            }else if(fs){
                if(!noVideo){
                    document.addEventListener('touchmove',tgPreventDefault,{passive:false});
                }
                else if(e.touches[0].pageX>window.screen.width/8&&e.touches[0].pageX<window.screen.width){
                    document.addEventListener('touchmove',tgPreventDefault,{passive:false});
                }else{
                }
            }
            else{
            }
        }
    });

    document.addEventListener('touchend',function(e){
        document.removeEventListener('touchmove',tgPreventDefault);
    });
    if(TouchGesture.debug == true){
        document.addEventListener('touchmove',function(e){
            console.log(e.srcElement.classList);
        });
    }
    TouchGesture.VideoGesture.insertAll();
    setInterval(TouchGesture.VideoGesture.insertAll, 2000);
}

function tgPreventDefault(e){
    e.preventDefault();
    return false;
};

function tgSettingPage(){
    console.log("setting page");
    var targetDomain = tgGetQueryString("target");
    console.log(targetDomain);
    console.log(TGUserSetting);
    var websiteSetting;
    if(TGUserSetting.website[targetDomain]){
        websiteSetting=TGUserSetting.website[targetDomain];
        // console.log("found");
    }else{
        // console.log("not found");
        websiteSetting={
            wSwitchEnable:true,
            wSwitchState:true,
            wSwitchProgress:true,
            wSwitchBrightness:true,
            wSwitchVolume:true,
            wSwitchSpeedX4:true,
            wSwitchSpeedX4Sigle:true,
            wSwitchSpeed:true,
            wSwitchForbidScrollNFS:false
        };
    }
    
    $(".g_tgs").each(function(index,ele){
        var val = TGUserSetting.global[ele.id];
        if(val!=true){
            ele.classList.remove("mui-active")
        }
    });
    $("#gSelectToastPos").text(TGUserSetting.global["gSelectToastPos"]);

    $(".w_tgs").each(function(index,ele){
        var val = websiteSetting[ele.id];
        if(val!=true){
            ele.classList.remove("mui-active")
        }
    });

    document.getElementById("globalSettingInput").addEventListener("change",function(){
        var gVal = document.getElementById("globalSettingInput").value;
        gVal = JSON.parse(gVal);
        TGUserSetting.global = gVal;
        GM_setValue("tg_setting",JSON.stringify(TGUserSetting));
    });

    document.getElementById("websiteSettingInput").addEventListener("change",function(){
        // alert("change");
        var wVal = document.getElementById("websiteSettingInput").value;
        wVal = JSON.parse(wVal);
        TGUserSetting.website[targetDomain] = wVal;
        GM_setValue("tg_setting",JSON.stringify(TGUserSetting));
    });

    document.getElementById("resetSettingInput").addEventListener("change",function(){
        // alert("reset");
        GM_setValue("tg_setting",JSON.stringify(TGUserDefaultSetting));
    });
}

function tgGetQueryString(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


(function() {
    if(whetherInBlackList()){
        return;
    }

    TGUserSetting = GM_getValue("tg_setting",JSON.stringify(TGUserDefaultSetting));
    TGUserSetting = JSON.parse(TGUserSetting);
    // console.log(TGUserSetting);
    // Your code here...

    var domain = window.location.host;
    
    if(domain == "herochansysu.gitlab.io"){
    // if(domain == "192.168.1.33:8848"){
        tgSettingPage();
    }else{
        tgVideoPageInit();
    }

})();