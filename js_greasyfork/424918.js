// ==UserScript==
// @name         CoursePlayback
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  add hotkey to pku course playback
// @author       shanqiaosong
// @match        https://livingroomhqy.pku.edu.cn/player*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424918/CoursePlayback.user.js
// @updateURL https://update.greasyfork.org/scripts/424918/CoursePlayback.meta.js
// ==/UserScript==

(function() {
    'use strict';

(function () {
    var version = '4.8.37.20200917'
    var CmcMediaPlayer = function (_id, _playervars) {
        // console.log('CmcMediaPlayer this =', this)

        this.root = document.getElementById(_id);
        this.id = _id;
        this.playervars = _playervars;
        this.cmcPlayer = null;
        this.ieFlashPlayer = null;
        this.mobilePlayer = null;

        this.getPlayerById = null;
        this.screenshot = null;
        this.Screenshot = null;
        this.ScreenShot = null;
        this.screenShot = null;
        this.playerPlay = null;
        this.seekAndPause = null;
        this.pausePlay = null;
        this.resumePlay = null;
        this.stopPlay = null;
        this.changePlay = null;
        this.PlayNew = null;
        this.playSlice = null;
        this.getPlayTime = null;
        this.getDuration = null;

        this.getBrowser = function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var mobile = !!userAgent.match(/AppleWebKit.*Mobile.*/) || !!userAgent.match(/AppleWebKit/) && userAgent.indexOf('QIHU') > -1 && userAgent.indexOf('Chrome') < 0
            // var mobile = userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
            var browser = {};
            var type = '';
            if (mobile) {
                type = 'mobile'
                if (userAgent.indexOf('UCBrowser') > -1) { type = 'uc' }
                if (userAgent.indexOf('iPhone') > -1) { type = 'iPhone' }
                if (userAgent.indexOf('iPad') > -1) { type = 'iPad' }
                if (userAgent.indexOf('MicroMessenger') > -1) { type = 'weixin' }
                if (userAgent.match(/\sQQ/i) == " qq") { type = 'qq' }

                browser.type = type;
                browser.mobile = true;

                if (userAgent.indexOf('WindowsWechat') > -1) browser.mobile = false
            }
            else {
                if (userAgent.indexOf('Opera') > -1) { type = 'opera' }
                if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) { type = 'safari' }
                if (userAgent.indexOf('Chrome/') >= 0 && userAgent.indexOf('WebKit') >= 0) { type = 'chrome' }
                if (userAgent.indexOf("Edge") > -1) { type = 'edge' }
                if (userAgent.indexOf("Firefox") > -1) { type = 'firefox' }
                if (window.ActiveXObject || "ActiveXObject" in window) {
                    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                    reIE.test(userAgent);
                    var fIEVersion = parseFloat(RegExp["$1"]);
                    if (userAgent.indexOf('MSIE 6.0') != -1) {
                        type = "IE6";
                    }
                    else if (fIEVersion == 7) { type = "IE7"; }
                    else if (fIEVersion == 8) { type = "IE8"; }
                    else if (fIEVersion == 9) { type = "IE9"; }
                    else if (fIEVersion == 10) { type = "IE10"; }
                    else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
                        type = "IE11";
                    }
                    else { type = "IE" }//IE版本过低
                }
                browser.type = type;
                browser.mobile = false;
            }
            return browser;
        }

        var self = this;
        var loadJS = function (url, callback) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            if (typeof callback == 'function') {
                script.onload = script.onreadystatechange = function () {
                    if (!script.readyState || script.readyState == 'loaded'
                        || script.readyState == 'complete') {
                        callback();
                        script.onload = script.onreadystatechange = null;
                    }
                }
                script.onerror = function(e){
                    console.log('load js error =',e,url)
                }
            }
            document.body.appendChild(script);
        }

        var browser = this.getBrowser();
        var url = '';
        if (browser.mobile) {
            //调用手机播放器
            if(window.hasOwnProperty('CmcMobilePlayer')&&CmcMobilePlayer){
                self.mobilePlayer = new CmcMobilePlayer(_id, _playervars);
                // console.log('mobilePlayer 1=',self.mobilePlayer)
                for (var key in self.mobilePlayer) {
                    self[key] = self.mobilePlayer[key]
                }
                self.getPlayerById = function(){
                    return self.mobilePlayer;
                }
                self.resize = function(){}
            }
            else {
                url = './mobile/cmcMobilePlayer.js';
                if (self.playervars.hasOwnProperty('fileHost')) {
                    url = self.playervars.fileHost + 'mobile/cmcMobilePlayer.js';
                }
                // url = 'http://localhost:8301/cmcMobilePlayer.js'
                url = url + `?v=${version}`
                loadJS(url, function () {
                    // console.log('cmcPlayer this =', self)
                    self.mobilePlayer = new CmcMobilePlayer(_id, _playervars);
                    // console.log('mobilePlayer 2=',self.mobilePlayer,Object.keys(self.mobilePlayer))
                    for (var key in self.mobilePlayer) {
                        self[key] = self.mobilePlayer[key]
                    }
                    self.getPlayerById = function(){
                        return self.mobilePlayer;
                    }
                    self.resize = function(){}
                })
            }

        }
        else {

            if (browser.type=='IE9'||browser.type=='IE8'||browser.type=='IE6'||browser.type=='IE7'||browser.type=='IE') {
                // console.log('低版本ie 用flash')

                var ieFlashId = 'cmc_flash_'+self.id;
                self.ieFlashPlayer = document.createElement('div');
                self.ieFlashPlayer.id = ieFlashId;
                self.root.appendChild(self.ieFlashPlayer);

                var swfVersionStr = '11.4.0';
                var xiSwfUrlStr = '';
                var params = {};
                params.quality = 'high';
                params.bgcolor = '#ffffff';
                params.wmode = "transparent";
                params.allowscriptaccess = 'always';
                params.allowfullscreen = 'true';
                params.allowfullscreeninteractive = 'true';
                var attributes = {};
                attributes.id = ieFlashId;
                attributes.name = ieFlashId;
                attributes.align = 'middle';

                var flashvars = JSON.parse(JSON.stringify(self.playervars)); //Object.assign({}, self.playervars);
                flashvars.switchPlayer = false;
                flashvars.filePath = 'flash/';

                if(window.hasOwnProperty('swfobject')&&swfobject){

                    // console.log('swfUrl =',swfUrl)
                    swfobject.embedSWF(swfUrl, ieFlashId, self.playervars.width, self.playervars.height, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);

                    self.getPlayerById = function(){
                        return swfobject.getObjectById(ieFlashId);
                    };
                    self.screenshot = function(type, w, h, p, enable){
                        var fl = swfobject.getObjectById(ieFlashId);
                        return fl.screenshot(type, w, h, p, enable);
                    };
                    self.Screenshot = function(type, w, h, p, enable){
                        self.screenshot(type, w, h, p, enable);
                    };
                    self.ScreenShot = function(type, w, h, p, enable){
                        self.screenshot(type, w, h, p, enable);
                    };
                    self.screenShot = function(type, w, h, p, enable){
                        self.screenshot(type, w, h, p, enable);
                    };
                    self.playerPlay = function(obj){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.playerPlay(obj);

                        self.playervars.url = obj.url;
                        if(obj.hasOwnProperty('mediaType')){
                            self.playervars.mediaType = obj.mediaType;
                        }
                    };
                    self.seekAndPause = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.seekAndPause();
                    };
                    self.pausePlay = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.pausePlay();
                    };
                    self.resumePlay = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.resumePlay();
                    };
                    self.stopPlay = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.stopPlay();
                    };
                    self.changePlay = function(param){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.changePlay(param);
                    };
                    self.PlayNew = function(url,type){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.PlayNew();
                    };
                    self.getPlayTime = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.getPlayTime();
                    };
                    self.getDuration = function(){
                        var fl = swfobject.getObjectById(ieFlashId);
                        fl.getDuration();
                    };
                }
                else {
                    url = './lib/swfobject.js';
                    if (self.playervars.hasOwnProperty('fileHost')) {
                        url = self.playervars.fileHost + 'lib/swfobject.js';
                    }

                    loadJS(url, function () {
                        // console.log('swfobject =', swfobject)
                        swfobject.embedSWF(swfUrl, ieFlashId, self.playervars.width, self.playervars.height, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);

                        self.getPlayerById = function(){
                            return swfobject.getObjectById(ieFlashId);
                        };
                        self.screenshot = function(type, w, h, p, enable){
                            var fl = swfobject.getObjectById(ieFlashId);
                            return fl.screenshot(type, w, h, p, enable);
                        };
                        self.Screenshot = function(type, w, h, p, enable){
                            self.screenshot(type, w, h, p, enable);
                        };
                        self.ScreenShot = function(type, w, h, p, enable){
                            self.screenshot(type, w, h, p, enable);
                        };
                        self.screenShot = function(type, w, h, p, enable){
                            self.screenshot(type, w, h, p, enable);
                        };
                        self.playerPlay = function(obj){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.playerPlay(obj);

                            self.playervars.url = obj.url;
                            if(obj.hasOwnProperty('mediaType')){
                                self.playervars.mediaType = obj.mediaType;
                            }
                        };
                        self.seekAndPause = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.seekAndPause();
                        };
                        self.pausePlay = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.pausePlay();
                        };
                        self.resumePlay = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.resumePlay();
                        };
                        self.stopPlay = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.stopPlay();
                        };
                        self.changePlay = function(param){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.changePlay(param);
                        };
                        self.PlayNew = function(url,type){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.PlayNew();
                        };
                        self.getPlayTime = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.getPlayTime();
                        };
                        self.getDuration = function(){
                            var fl = swfobject.getObjectById(ieFlashId);
                            fl.getDuration();
                        };
                    })
                }

            }
            else {
                // console.log('调用cmcPlayer 兼容播放器')
                //判断是否已加载cmcPlayer.js
                if(window.hasOwnProperty('CmcPCPlayer')&&CmcPCPlayer){
                    self.cmcPlayer = new CmcPCPlayer(_id, _playervars);
                    for (var key in self.cmcPlayer) {
                        self[key] = self.cmcPlayer[key]
                    }
                }
                else {
                    url = './cmcPlayer.js';
                    if (self.playervars.hasOwnProperty('fileHost')) {
                        url = self.playervars.fileHost + 'cmcPlayer.js';
                    }
                    url = url + `?v=${version}`
                    // console.log('cmcPlayer js = ',url)
                    loadJS(url, function () {
                        // console.log('cmcPlayer this =', self)
                        self.cmcPlayer = new CmcPCPlayer(_id, _playervars);
                        window.cmcPlayer=self.cmcPlayer
                        // console.log('self.cmcPlayer =',self.cmcPlayer)
                        for (var key in self.cmcPlayer) {
                            self[key] = self.cmcPlayer[key]
                        }
                    })
                }

            }
        }

    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = CmcMediaPlayer;// CommonJS

    } else {
        if (typeof define === "function" && define.amd) {
            define("CmcMediaPlayer", [], function () { return CmcMediaPlayer; });// AMD
        }
        if (typeof window === "object" && typeof window.document === "object") {
            window.CmcMediaPlayer = CmcMediaPlayer;
            window.CmcPlayer = CmcMediaPlayer
        }
    }
})();

    let nowSpeed=2
    const speeds=[0.5,0.75,1,1.25,1.5,2.0,2.5,3,4.0]
    function prompt(txt){
        let p=document.createElement('div')
        p.innerHTML=txt
        p.style.width= '200px'
        p.style.position= 'fixed'
        p.style.top= '20px'
        p.style.left= '0px'
        p.style.right= '0px'
        p.style.margin= '0px auto'
        p.style.height= '40px'
        p.style.background= '#ffffffeb'
        p.style.textAlign= 'center'
        p.style.fontSize= '15px'
        p.style.lineHeight= '40px'
        p.style.borderRadius= '5px'
        p.style.backdropFilter= 'blur(4px)'
        p.style.boxShadow= '#00000059 1px 1px 19px 0px'
        p.style.zIndex= '10000000'
        p.style.transition= '0.5s all'
        document.body.appendChild(p)
        setTimeout(()=>{
            p.style.opacity='0'
        },1000)
    }
    document.onkeydown=(e)=>{
        console.log(e)
        if(e.key==='.'){
            nowSpeed=Math.min(8,Math.max(0,nowSpeed+1))
            window.cmcPlayer.h5Player.Pure.observerMap.play_speed_change[0]({name:'play_speed_change',body:speeds[nowSpeed]})
            prompt('速度: '+speeds[nowSpeed])
        }
        if(e.key===','){
            nowSpeed=Math.min(8,Math.max(0,nowSpeed-1))
            window.cmcPlayer.h5Player.Pure.observerMap.play_speed_change[0]({name:'play_speed_change',body:speeds[nowSpeed]})
            prompt('速度: '+speeds[nowSpeed])
        }
        if(e.key==='b'){
            window.cmcPlayer.seekPlay(window.cmcPlayer.getPlayTime()-3+10*60)
            prompt('跳过课间（10分钟） ')

        }
    }
})();