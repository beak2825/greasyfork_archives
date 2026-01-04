// ==UserScript==
// @name         Enhanced Video Playing Experience for Viu.com
// @version      1.5
// @description  Automatically Full HD Video Quality (Paid Member) and Disable Auto Playing when the page is randomly reloaded 
// @match        https://www.viu.com/ott/*/vod/*
// @icon         https://www.google.com/s2/favicons?domain=viu.com
// @grant        unsafeWindow
// @grant        window.onurlchange
// @namespace https://greasyfork.org/users/371179
// @downloadURL https://update.greasyfork.org/scripts/428039/Enhanced%20Video%20Playing%20Experience%20for%20Viucom.user.js
// @updateURL https://update.greasyfork.org/scripts/428039/Enhanced%20Video%20Playing%20Experience%20for%20Viucom.meta.js
// ==/UserScript==
(function $$() {
    'use strict';

    if (!document || !document.documentElement) return window.requestAnimationFrame($$);

const uWin = window.unsafeWindow || window;


    if ([document.hidden, window.requestAnimationFrame, Object.defineProperty, window.performance].some(x => x === undefined)) throw 'Your browser is too outdated.';
    var navStart = performance.timeOrigin || performance.timing.navigationStart || null;
    if (navStart === null) throw 'Your browser is too outdated.';
    navStart = Math.ceil(navStart);

    var lastPlayingStatus = null;
    var settings = {}
    var falseReloaded = false;
    var lastUserClickAt = 0;
    var lastUserClickStatus = 0;
    var forceQuality = "1080";
    const __jver__ = "20210617b";

    const isPassiveOptionEnable = window.queueMicrotask?true:false; //here just a simple trick for checking browser is modern or not


        function isVideoPlaying(video){
            return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
        }

    function pageInit() {


        var _userPaused = null;

        Object.defineProperty(settings, 'userPaused', {
            get() {
                return _userPaused;
            },
            set(nv) {
                _userPaused = nv;
                console.log('[viu] userPaused: ', _userPaused);
            }
        })



        function doSomething(obj) {
            //for viu page auto reload ( it is confirmed that the page could randomly reload)


            if (!obj) return;
            let {
                version,
                datetime,
                pageVisible,
                withVideo,
                userPaused
            } = obj;

            if (version != __jver__) return;

            const isReload = (t) => (t > 0 && t - 2 < navStart && t + 480 > navStart); // max 155ms  => 155*3=465 => 480ms

            if (isReload(datetime) && withVideo) {
                console.log('[viu] reloaded page', obj)
                if (userPaused || !pageVisible) settings.userPaused = true;
            }

            console.log('[viu] reload time diff: ' + (navStart - datetime) + ' => ' + isReload(datetime))


        }

        var _saveObj = localStorage.__zvpp_unload1__;
        if (typeof _saveObj == 'string' && _saveObj.length > 0) {

            var _jObj = null;
            try {
                _jObj = JSON.parse(_saveObj);
            } catch (e) {}
            if (_jObj) {
                doSomething(_jObj);
            }
        }


        delete localStorage.__viu_js_fewunaznqjrx__
        delete localStorage.__viu_js_fewunaznqjr2__
        delete localStorage.__viu_js_fewunaznqjra__
        delete localStorage.__zvpp_unload1__

        if (localStorage.__zvpp_ver__ !== __jver__) {
            for (var k in localStorage) {
                if (k.indexOf('__zvpp_') === 0) localStorage.removeItem(k)
            }
            localStorage.__zvpp_ver__ = __jver__
        }




    }


    function getVideoFromEvent(evt) {
        return (evt && evt.target && evt.target.nodeName == 'VIDEO') ? evt.target : null;
    }

    function hasOffsetParent(v) {
        return v && v.offsetParent !== null && v.offsetParent.nodeType === 1; //is DOM valid on the page
    }

    function noAutoStart(evt) {
        const video = getVideoFromEvent(evt);

        if (video) {
            if (lastUserClickStatus===2) {
                //do nothing for user click
            } else if (settings.userPaused === true) {
                video.autoplay = false;
                video.pause();
            } else {
                if (lastPlayingStatus === true && document.hidden === true) {} else if (document.hidden === true) {
                    video.autoplay = false;
                    video.pause();
                }
            }
        }

    }

    const delayCall = function(p, f, d) {

        if (delayCall[p] > 0) clearTimeout(delayCall[p])
        delayCall[p] = setTimeout(f, d)
    }


    function loader(detection) {
        return function() {
            let oldHref = document.location.href,
                bodyDOM = document.querySelector("body");
            const observer = new MutationObserver(function(mutations) {
                if (oldHref != document.location.href) {
                    oldHref = document.location.href;
                    detection();
                    window.requestAnimationFrame(function() {
                        let tmp = document.querySelector("body");
                        if (tmp != bodyDOM) {
                            bodyDOM = tmp;
                            observer.observe(bodyDOM, config);
                        }
                    })
                }
            });
            const config = {
                childList: true,
                subtree: true
            };
            observer.observe(bodyDOM, config);
        }
    }

    const anyRecentClick=()=>lastUserClickAt + 5000 > +new Date;


    function pageEnableAutoQualityAtStart() {
        //default 1080p



        var cid = 0;
        var mDate = 0;
        const TIMEOUT = 8000; // just in case DOM is not found


        var gn = function(evt) {

            const video = getVideoFromEvent(evt);
            if (!video) return;


            delayCall('$$video_init', function() {

                if (video.hasAttribute('_viu_js_hooked')) return;
                video.setAttribute('_viu_js_hooked', '')
                video.addEventListener('playing', function(evt) {

                    const video = getVideoFromEvent(evt);
                    if (!video) return;
                    delayCall('$$video_playing_switch', function() {
                        if (video.paused === false && hasOffsetParent(video)) {
                            if (document.hidden !== true && settings.userPaused === true) settings.userPaused = false;
                        }
                    }, 300);
                }, true)
                video.addEventListener('pause', function(evt) {
                    const video = getVideoFromEvent(evt);
                    if (!video) return;
                    delayCall('$$video_playing_switch', function() {

                        if (video.paused === true && hasOffsetParent(video)) {
                            if (document.hidden !== true && (settings.userPaused === null || settings.userPaused === false)) settings.userPaused = true;
                        }
                    }, 300);
                }, true)

            }, 800);

            //call when the first video event fires
            if(lastUserClickStatus===1 && lastUserClickAt+5000 > +new Date){
                //url change: 2598  1443 1542 1975
                //without url change : 561
                console.log(`[viu] click and video status change ${+new Date -lastUserClickAt}`)
                //user perform action and video status changed
                lastUserClickStatus=2;
            }
            if(lastUserClickStatus!=2){
                // clear lastUserClickStatus
                delayCall('$$user_click_action_w38',function(){
                    if(lastUserClickStatus!==2) lastUserClickStatus=0;
                },300)
            }else{
                // extend duration of status 2 for 800ms
                delayCall('$$user_click_action_w38',function(){
                    if(lastUserClickStatus===2) lastUserClickStatus=0;
                },800)
            }

            //disable autostart
            noAutoStart(evt);

            mDate = +new Date + TIMEOUT;
            var jn = function(btn1080) {
                //button is found
                const bool = btn1080.matches(':not([aria-disabled=""]):not([aria-disabled="true"]):not([aria-checked="true"]):not([aria-checked=""])');
                console.log('resolution button found');
                if (bool) {

                    Promise.resolve()
                    .then(()=>new Promise(r=>{
                        const tf = function(){

                            let bool = document.querySelectorAll('button[id^="resolution_"]').length>=2 && document.querySelectorAll('button[id^="resolution_"].vjs-selected').length===1
                            if(!bool)return setTimeout(tf,30);

                            let video = document.querySelector('video[id*="-video-viu-player"][src]')
                            if(!video)return setTimeout(tf,30);
                            const bReady = video.currentTime>0 && !video.ended && video.readyState>video.HAVE_CURRENT_DATA;
                            if(!bReady)return setTimeout(tf,30);



                            console.log('video ready');

                            r();

                        }
                        tf();
                    }))
                    .then(()=>{

                        let btn=document.querySelector('button#resolution_list.bmpui-ui-qualitysettingstogglebutton[aria-pressed]');

                        if(btn){
                        btn.dispatchEvent(new Event('mouseenter'))
                        btn.className.replace(/\b(bmpui-off)\b/,'bmpui-on');
                            btn.setAttribute('aria-pressed','true');
                        }

                        btn1080.dispatchEvent(new Event('mouseenter'))

                    })
                    .then(()=>new Promise((resolve)=>setTimeout(resolve,8)))
                    .then(()=>btn1080.click())
                    .then(()=>new Promise((resolve)=>setTimeout(resolve,20)))
                    .then(()=>{

                        btn1080.dispatchEvent(new Event('mouseleave'))


                        let btn=document.querySelector('button#resolution_list.bmpui-ui-qualitysettingstogglebutton[aria-pressed]');
                        if(btn){
                        btn.dispatchEvent(new Event('mouseleave'))
                        btn.className.replace(/\b(bmpui-on)\b/,'bmpui-off');
                            btn.setAttribute('aria-pressed','false');
                        }


                          })
                    .then(()=>new Promise((resolve)=>setTimeout(resolve,8)))
                        .then(()=>{

                        let pElm=btn1080;
                        let menuUI=null;
                        while(pElm && pElm.parentNode){
                            let checkClsName=pElm.className.replace(/\b(bmpui-ui-settings-panel|customize-video-option-panel)\b/gi,'@@');
                            checkClsName=checkClsName.replace(/\b[a-zA-Z0-9_\-]+\b/gi,'').replace(/\s+/g,' ').trim();
                            if(checkClsName=='@@ @@'){
                                menuUI=pElm;
                                break;
                            }
                            pElm=pElm.parentNode;
                        }

                        if(menuUI){
                            if(!/\b(bmpui-hidden)\b/.test(menuUI.className)) menuUI.className=menuUI.className.trim()+' bmpui-hidden';
                        }


                    })
                    .catch((e)=>0)


                }
            }
            var zn = function() {
                //query when the video is loading/loaded/ready...
                if (cid > 0 && mDate < +new Date) {
                    cid = clearInterval(cid);
                    return;
                }
                var btn1080 = document.querySelector(`button[id^="resolution_${forceQuality}"]`)
                //var btn1080 = document.querySelector(`.vjs-menu-item[data-r="${forceQuality}"]`);
                if (!btn1080) return;
                if (cid > 0) cid = clearInterval(cid);
                if (btn1080.matches('[__userscript_viu_loaded]')) return true;
                btn1080.setAttribute('__userscript_viu_loaded', 'true');
                window.requestAnimationFrame(() => jn(btn1080)); // prevent too fast
            }
            if (cid > 0) cid = clearInterval(cid);
            if (!zn()) cid = setInterval(zn, 33);
        }

        document.addEventListener('loadstart', gn, true)
        document.addEventListener('durationchange', gn, true)
        document.addEventListener('loadedmetadata', gn, true)
        document.addEventListener('loadeddata', gn, true)
        //document.addEventListener('progress', gn, true)
        document.addEventListener('canplay', gn, true)
        //document.addEventListener('canplaythrough', gn, true)

        document.addEventListener('playing',function(evt){

            if(!evt||!evt.target||evt.target.nodeName!="VIDEO")return;
            let video = evt.target;

            requestAnimationFrame(()=>{

                if(!isVideoPlaying(video)) return;
                let unmuteBtn = document.querySelector('button.bmpui-unmute-button.unmute-button.bmpui-muted');
                if(video.muted && unmuteBtn) unmuteBtn.click();

            })


        },true)


    }



    const detection1 = function() {

        console.log('[viu] viu.com reloaded url - detection #1')



    }
    const detection2 = function() {

        console.log('[viu] viu.com reloaded url - detection #2')



    }

    const detection3 = function(info) {

        console.log('[viu] viu.com reloaded url - detection #3', info)


    }

    function handleBeforeUnload(event) {
        //core event handler for detection of false reloading


        console.log('[viu] viu.com reloaded url - detection #4')

        const video = document.querySelector('video#viu-player_html5_api') || document.querySelector('video');

        var saveObj = {};
        saveObj.version = __jver__;
        saveObj.datetime = +new Date();
        saveObj.pageVisible = !(document.hidden === true);
        saveObj.withVideo = (video && video.nodeName == "VIDEO")
        saveObj.userPaused = (settings.userPaused === true);

        localStorage.__zvpp_unload1__ = JSON.stringify(saveObj);


        navStart = (+new Date) - 1;

        // Cancel the event
        //event.preventDefault();
        //return (event.returnValue = ""); // Legacy method for cross browser support


    }

    function handleVisibilityChange() {
        //enable if document.hidden exists
        const video = document.querySelector('video#viu-player_html5_api') || document.querySelector('video'); // just in case
        if (!video) lastPlayingStatus = null;
        if (document.hidden === false) {
            console.log('[viu] page show')
        } else if (document.hidden === true) {
            console.log('[viu] page hide')
            if (video) lastPlayingStatus = !video.paused
        } else {
            lastPlayingStatus = null;
        }
    }


    function isMenuBtn(evt) {
        return evt && evt.target && evt.target.nodeType === 1 && (evt.target.className || "").indexOf('vjs-menu-item') === 0;
    }

    function setQualityAfterClick() {
        delayCall('$$change_video_quality', function() {

            let selectedQuality=-1

            let elm = document.querySelector('button[id^="resolution_"].vjs-selected');
            if(!elm)return;
            let regexp=/\d+/.exec(elm.id);
            if(regexp){
                selectedQuality = regexp[0];
            }
            //let attr = document.querySelector('.vjs-menu-item.vjs-selected[data-r]').getAttribute('data-r');
            if (+selectedQuality > 0) {
                forceQuality = (+selectedQuality).toString();
                console.log(`[viu] video quality set at ${selectedQuality}`)
            }
        }, 300)
    }


    pageInit();
    pageEnableAutoQualityAtStart();

    if (window.onurlchange === null) window.addEventListener('urlchange', detection3, true); // feature is supported

    window.addEventListener("load", loader(detection1), true);

    uWin.addEventListener("load", loader(detection2), true);

    uWin.addEventListener("beforeunload", handleBeforeUnload, true);

    if (typeof document.hidden !== "undefined") document.addEventListener("visibilitychange", handleVisibilityChange, true);


    function handleMouseDown(evt) {
        lastUserClickAt = +new Date;
        lastUserClickStatus =1;
        delayCall('$$user_click_action_w38',function(){
            if(lastUserClickStatus===1) lastUserClickStatus=0;
        },5000)
        if (isMenuBtn(evt)) setQualityAfterClick();
    }
    document.addEventListener("mousedown", handleMouseDown, isPassiveOptionEnable?{
        passive: true,
        capture: true
    }:true)




    function onReady(){

        setTimeout(function(){


            for(const s of document.querySelectorAll('link[rel="stylesheet"][href*=".css"]')){

                if(!s.hasAttribute('type')) s.setAttribute('type','text/css');
                if(!s.hasAttribute('charset')) s.setAttribute('charset','utf-8');

            }


        },40);

    }


    if (document.readyState != 'loading') {
        onReady();
    } else {
        window.addEventListener("DOMContentLoaded", onReady, false);
    }



    // Your code here...
})(unsafeWindow || window);