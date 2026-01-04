// ==UserScript==
// @name                 Xbox CLoud Gaming优化整合复刻版
// @name:zh-CN           Xbox CLoud Gaming优化整合复刻版
// @namespace            http://tampermonkey.net/xbox/nft
// @version              2.2.1
// @author               奈非天
// @match                https://www.xbox.com/*/play*
// @run-at               document-start
// @grant                unsafeWindow
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @original-script      https://greasyfork.org/zh-CN/scripts/455741-xbox-cloud-gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88
// @description:zh-cn    整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764反馈】
// @description          整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764反馈】
// @downloadURL https://update.greasyfork.org/scripts/463294/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E5%A4%8D%E5%88%BB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/463294/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E5%A4%8D%E5%88%BB%E7%89%88.meta.js
// ==/UserScript==
(function() {

    'use strict';
    // Your code here...

    //========↓↓↓↓↓是各个功能的初始设置，仅第一次运行脚本有效↓↓↓↓↓========//
    //★★ 1=开   0=关 ★★//

    //免代理直连
    let no_need_VPN_play=1;

    let regionsList={'韩':'168.126.63.1'
                     ,'美':'4.2.2.2'
                     ,'日':'210.131.113.123'
                    }

    //欺骗IP
    let fakeIp=regionsList['美'];

    //选择语言
    let chooseLanguage=1;
    //智能语言报错时默认使用的语言，简体zh-CN，繁体zh-TW，总开关是上一行的chooseLanguage
    let IfErrUsedefaultGameLanguage='zh-CN';

    //高码率，禁用后最高8M，码率720P画质
    let high_bitrate=1;

    //使用触屏经典手柄布局(默认关闭)
    let useDefaultTouchControls=0;

    //禁止检测网络状况
    let disableCheckNetwork=1;

    //禁用游戏界面下拉刷新
    let no_pull_refresh=1;

    //自动全屏
    let autoFullScreen=0;

    //锁定云游戏服务器，注意此项并非是云游戏区域(默认关闭)
    let blockXcloudServer=0;
    let blockXcloudServerList=['AustraliaEast','AustraliaSouthEast','BrazilSouth','EastUS','EastUS2','JapanEast','KoreaCentral','NorthCentralUs','SouthCentralUS','UKSouth','WestEurope','WestUS','WestUS2'];
    let defaultXcloudServer='KoreaCentral';

    //画面设置
    let videoResize=0;
    //左右
    let videoX=0;
    //上下
    let videoY=0;


    //========↑↑↑↑↑是各个功能的初始设置，仅第一次运行脚本有效↑↑↑↑↑========//

    const originFetch = fetch;
    let regionsMenuItemList = [];
    let languageMenuItemList = [];
    let default_language_list={'智能简繁':'Auto','简体':'zh-CN','繁体':'zh-TW'}
    let xcloud_game_language=default_language_list['简体'];//
    let useCustomfakeIp=0;
    let customfakeIp='';
    let BasicControlsCheck=false;

    let windowCtx = self.window;
    if (self.unsafeWindow) {
        console.log("使用unsafeWindow模式");
        windowCtx = self.unsafeWindow;
    } else {
        console.log("使用原生模式");
    }

    let naifeitian={
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        getValue(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setValue(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },
        isValidIP(ip) {
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(ip);
        },
        isNumber(val){
            return !isNaN(parseFloat(val)) && isFinite(val);
        }
    }

    function setMachineFullScreen(){
        try{
            let element=document.documentElement;
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.msRequestFullscreen){
                element.msRequestFullscreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
            screen?.orientation?.lock("landscape");
        }catch(e){}
    }
    function exitMachineFullscreen() {
        try{
            screen?.orientation?.unlock();
            if(document.exitFullScreen) {
                document.exitFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if(element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        }catch(e){}
    }

    blockXcloudServerList=naifeitian.getValue("blockXcloudServerListGM")==null?blockXcloudServerList:naifeitian.getValue("blockXcloudServerListGM");
    naifeitian.setValue("blockXcloudServerListGM",blockXcloudServerList);

    no_need_VPN_play=naifeitian.getValue("no_need_VPN_playGM")==null?no_need_VPN_play:naifeitian.getValue("no_need_VPN_playGM");
    naifeitian.setValue("no_need_VPN_playGM",no_need_VPN_play);

    chooseLanguage=naifeitian.getValue("chooseLanguageGM")==null?chooseLanguage:naifeitian.getValue("chooseLanguageGM");
    naifeitian.setValue("chooseLanguageGM",chooseLanguage);

    IfErrUsedefaultGameLanguage=naifeitian.getValue("IfErrUsedefaultGameLanguageGM")==null?IfErrUsedefaultGameLanguage:naifeitian.getValue("IfErrUsedefaultGameLanguageGM");
    naifeitian.setValue("IfErrUsedefaultGameLanguageGM",IfErrUsedefaultGameLanguage);

    fakeIp=naifeitian.getValue("fakeIpGM")==null?fakeIp:naifeitian.getValue("fakeIpGM");
    naifeitian.setValue("fakeIpGM",fakeIp);

    high_bitrate=naifeitian.getValue("high_bitrateGM")==null?high_bitrate:naifeitian.getValue("high_bitrateGM");
    naifeitian.setValue("high_bitrateGM",high_bitrate);

    useDefaultTouchControls=naifeitian.getValue("useDefaultTouchControlsGM")==null?useDefaultTouchControls:naifeitian.getValue("useDefaultTouchControlsGM");
    naifeitian.setValue("useDefaultTouchControlsGM",useDefaultTouchControls);

    disableCheckNetwork=naifeitian.getValue("disableCheckNetworkGM")==null?disableCheckNetwork:naifeitian.getValue("disableCheckNetworkGM");
    naifeitian.setValue("disableCheckNetworkGM",disableCheckNetwork);

    no_pull_refresh=naifeitian.getValue("no_pull_refreshGM")==null?no_pull_refresh:naifeitian.getValue("no_pull_refreshGM");
    naifeitian.setValue("no_pull_refreshGM",no_pull_refresh);

    defaultXcloudServer=naifeitian.getValue("defaultXcloudServerGM")==null?defaultXcloudServer:naifeitian.getValue("defaultXcloudServerGM");
    naifeitian.setValue("defaultXcloudServerGM",defaultXcloudServer);

    blockXcloudServer=naifeitian.getValue("blockXcloudServerGM")==null?blockXcloudServer:naifeitian.getValue("blockXcloudServerGM");
    naifeitian.setValue("blockXcloudServerGM",blockXcloudServer);

    xcloud_game_language=naifeitian.getValue("xcloud_game_languageGM")==null?xcloud_game_language:naifeitian.getValue("xcloud_game_languageGM");
    naifeitian.setValue("xcloud_game_languageGM",xcloud_game_language);

    useCustomfakeIp=naifeitian.getValue("useCustomfakeIpGM")==null?useCustomfakeIp:naifeitian.getValue("useCustomfakeIpGM");
    naifeitian.setValue("useCustomfakeIpGM",useCustomfakeIp);

    customfakeIp=naifeitian.getValue("customfakeIpGM")==null?customfakeIp:naifeitian.getValue("customfakeIpGM");
    naifeitian.setValue("customfakeIpGM",customfakeIp);

    autoFullScreen=naifeitian.getValue("autoFullScreenGM")==null?autoFullScreen:naifeitian.getValue("autoFullScreenGM");
    naifeitian.setValue("autoFullScreenGM",autoFullScreen);


    videoResize=naifeitian.getValue("videoResizeGM")==null?videoResize:naifeitian.getValue("videoResizeGM");
    naifeitian.setValue("videoResizeGM",videoResize);

    videoX=naifeitian.getValue("videoXGM")==null?videoX:naifeitian.getValue("videoXGM");
    naifeitian.setValue("videoXGM",videoX);

    videoY=naifeitian.getValue("videoYGM")==null?videoY:naifeitian.getValue("videoYGM");
    naifeitian.setValue("videoYGM",videoY);

    if(useDefaultTouchControls==1){
        windowCtx.RTCPeerConnection.prototype.originalCreateDataChannelGTC = windowCtx.RTCPeerConnection.prototype.createDataChannel;
        windowCtx.RTCPeerConnection.prototype.createDataChannel = function (...params) {
            let dc = this.originalCreateDataChannelGTC(...params);
            let paddingMsgTimeoutId = 0;
            if (dc.label == "message") {
                dc.addEventListener("message", function (de) {
                    if (typeof(de.data) == "string") {
                        // console.debug(de.data);
                        let msgdata = JSON.parse(de.data);
                        if (msgdata.target == "/streaming/touchcontrols/showlayoutv2") {
                            clearTimeout(paddingMsgTimeoutId);
                        } else if (msgdata.target == "/streaming/touchcontrols/showtitledefault") {
                            if (msgdata.pluginHookMessage !== true) {
                                clearTimeout(paddingMsgTimeoutId);
                                paddingMsgTimeoutId = setTimeout(() => {
                                    dc.dispatchEvent(new MessageEvent('message', {
                                        data : '{"content":"{\\"layoutId\\":\\"\\"}","target":"/streaming/touchcontrols/showlayoutv2","type":"Message","pluginHookMessage":true}'
                                    }));
                                }, 1000);
                            }
                        }
                    }
                });
            }
            return dc;
        }
    }


    function HookProperty(object, property, value)
    {
        Object.defineProperty(object, property, {
            value: value
        });
    }

    let fakeuad = {
        "brands": [
            {
                "brand": "Microsoft Edge",
                "version": "999"
            },
            {
                "brand": "Chromium",
                "version": "999"
            },
            {
                "brand": "Not=A?Brand",
                "version": "24"
            }
        ],
        "mobile": false,
        "platform": "Windows"
    };
    try{
        if(high_bitrate==1){
            HookProperty(windowCtx.navigator, "userAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0");
            HookProperty(windowCtx.navigator, "appVersion", "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0");
            HookProperty(windowCtx.navigator, "platform", "Win32");
            HookProperty(windowCtx.navigator, "appName", "Netscape");
            HookProperty(windowCtx.navigator, "appCodeName", "Mozilla");
            HookProperty(windowCtx.navigator, "product", "Gecko");
            HookProperty(windowCtx.navigator, "vendor", "Google Inc.");
            HookProperty(windowCtx.navigator, "vendorSub", "");
            HookProperty(windowCtx.navigator, "maxTouchPoints", 10);
            HookProperty(windowCtx.navigator, "userAgentData", fakeuad);
        }
        if(disableCheckNetwork==1){
            //HookProperty(windowCtx.navigator, "connection", undefined);
            Object.defineProperty(windowCtx.navigator, 'connection', {
                get: function () {
                    return {
                        onchange: null,
                        effectiveType: '4g',
                        rtt: 0,
                        downlink: 10,
                        saveData: false,
                        addEventListener: function() {},
                        removeEventListener: function() {},
                    }; // Official check: rtt >= 100 || downlink <= 10 || saveData || effectiveType is ["slow-2g","2g","3g"]
                }
            });
        }
        HookProperty(windowCtx.navigator, "standalone", true);

    }catch(e){}

    //悬浮确认按钮
    let confirmBtn='.Button-module__typeBrand___MMuct';
    //悬浮x按钮
    let basic_X_Btn='.EditErgoMenu-module__basicControlsButtonColor___hPHPz';
    //basic不需要的Class
    let basicFukClass='Button-module__overlayModeAcrylic___QnjAv';
    //悬浮···
    let threeDotBtn='.Button-module__buttonIcon___540Jm';
    //悬浮···后全屏
    let threeDotClickedScreen='.StreamMenu-module__container___gE8aQ';
    //退出游戏确认按钮区域
    let quitGameArea='';
    //退出游戏区域X和never mind按钮
    let quitGame_X_nm_btn='.PureInStreamConfirmationModal-module__closeButton___P2u+9';
    //退出游戏确认按钮
    let quitGameConfirmBtn='.PureInStreamConfirmationModal-module__destructiveButton___PZgIz';
    //开启basic的开关
    let basicCheckBtn='.Button-module__decoratedButton___-YJyr';
    //微软logo
    let mslogo=".c-sgl-stk-uhfLogo";
    //悬浮窗6个点Box
    let floatingSixDotBox='.GripHandle-module__container___Ys9mS';
    //悬浮窗6个点
    let floatingSixDot='.Grip-module__container___5o7HD';
    //悬浮窗6个点left
    let floatingSixDotLeft='.StreamHUD-module__container___l-cp9';
    //悬浮窗6个点left子1
    let floatingSixDotLeftC1='.StreamHUD-module__buttonsContainer___SN1lD';
    //悬浮窗6个点left子2
    let floatingSixDotLeftC2='.GripHandle-module__container___Ys9mS';
    //选游页左上角
    let cloudGameBeta='.Button-module__callToAction___mSaZg';
    let cloudGameBetaC1='.CloudGamingButton-module__text___cffxB';
    let cloudGameBetaC2='.CloudGamingButton-module__betaIcon___Xy-SS';
    $.ajax({
        url:"https://greasyfork.org/scripts/461579-xbox-cloud-gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E6%A0%B7%E5%BC%8F/code/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88%E6%A0%B7%E5%BC%8F.user.js",
        type:"GET",
        async:false,
        timeout:1000,
        success:function(data,textStatus){
            var aPos=data.indexOf('//======//');
            var bPos=data.indexOf('//++++++//');
            var r=data.substr(aPos+17,bPos-aPos-17);
            var newCss= JSON.parse(r);
            //悬浮确认按钮
            confirmBtn=newCss['confirmBtn'];
            //悬浮x按钮
            basic_X_Btn=newCss['basic_X_Btn'];
            //basic不需要的Class
            basicFukClass=newCss['basicFukClass'];
            //悬浮···
            threeDotBtn=newCss['threeDotBtn'];
            //悬浮···后全屏
            threeDotClickedScreen=newCss['threeDotClickedScreen'];
            //退出游戏确认按钮区域
            quitGameArea=newCss['quitGameArea'];
            //退出游戏区域X和never mind按钮
            quitGame_X_nm_btn=newCss['quitGame_X_nm_btn'];
            //退出游戏确认按钮
            quitGameConfirmBtn=newCss['quitGameConfirmBtn'];
            //开启basic的开关
            basicCheckBtn=newCss['basicCheckBtn'];
            //微软logo
            mslogo=newCss['mslogo']
            //悬浮窗6个点Box
            floatingSixDotBox=newCss['floatingSixDotBox'];
            //悬浮窗6个点
            floatingSixDot=newCss['floatingSixDot'];
            //悬浮窗6个点left
            floatingSixDotLeft=newCss['floatingSixDotLeft'];
            //悬浮窗6个点left子1
            floatingSixDotLeftC1=newCss['floatingSixDotLeftC1'];
            //悬浮窗6个点left子2
            floatingSixDotLeftC2=newCss['floatingSixDotLeftC2'];
            //选游页左上角
            cloudGameBeta=newCss['cloudGameBeta'];
            cloudGameBetaC1=newCss['cloudGameBetaC1'];
            cloudGameBetaC2=newCss['cloudGameBetaC2'];

        },

        error:function(XMLHttpRequest,textStatus,errorThrown){
            console.log('error...状态文本值：'+textStatus+" 异常信息："+errorThrown);
        }
    });
    windowCtx.fetch = (...arg) => {
        let arg0 = arg[0];
        let url = "";
        let isRequest = false;
        switch (typeof arg0) {
            case "object":
                url = arg0.url;
                isRequest = true;
                break;
            case "string":
                url = arg0;
                break;
            default:
                break;
        }

        if (url.indexOf('/v2/login/user') > -1){//xgpuweb.gssv-play-prod.xboxlive.com
            return new Promise((resolve, reject) => {
                if (isRequest && arg0.method == "POST") {
                    arg0.json().then(json => {
                        let body = JSON.stringify(json);
                        if(no_need_VPN_play==1){
                            console.log('xff欺骗开始'+url)
                            if(useCustomfakeIp==1 && naifeitian.isValidIP(customfakeIp)){
                                arg[0].headers.set('x-forwarded-for',customfakeIp);
                                console.log('自定义IP:'+customfakeIp);
                            }else{
                                arg[0].headers.set('x-forwarded-for',fakeIp);
                            }
                        }

                        arg[0] = new Request(url, {
                            method: arg0.method,
                            headers: arg0.headers,
                            body: body,

                        });
                        originFetch(...arg).then(res => {
                            console.log('xff欺骗结束');
                            res.json().then(json => {
                                let newServerList = [];
                                let currentAutoServer;
                                json["offeringSettings"]["regions"].forEach((region) => {
                                    newServerList.push(region["name"]);
                                    if (region["isDefault"] === true) {
                                        currentAutoServer = region["name"];
                                    }
                                });
                                naifeitian.setValue("blockXcloudServerListGM",newServerList);
                                blockXcloudServerList=newServerList;
                                if(blockXcloudServerList.indexOf(defaultXcloudServer)==-1){
                                    naifeitian.setValue("defaultXcloudServerGM","");
                                    defaultXcloudServer="";
                                    blockXcloudServer=0;
                                    naifeitian.setValue("blockXcloudServerGM",0);
                                }
                                if(blockXcloudServer==1){
                                    console.log('修改服务器开始');
                                    json["offeringSettings"]["allowRegionSelection"] = true;
                                    let selectedServer=defaultXcloudServer;
                                    if (selectedServer !== "Auto" && newServerList.includes(selectedServer)) {
                                        json["offeringSettings"]["regions"].forEach((region) => {
                                            if (region["name"] === selectedServer) {
                                                region["isDefault"] = true;
                                            } else {
                                                region["isDefault"] = false;
                                            }
                                        });
                                    }
                                    console.log('修改服务器结束');
                                }
                                let body = JSON.stringify(json);
                                let newRes = new Response(body, {
                                    status: res.status,
                                    statusText: res.statusText,
                                    headers: res.headers
                                })
                                resolve(newRes);
                            }).catch(err => {
                                reject(err);
                            });
                        }).catch(err => {
                            reject(err);
                        });
                    });

                } else {
                    console.error("[ERROR] Not a request.");
                    return originFetch(...arg);
                }
            });
        }else if (url.indexOf('/v5/sessions/cloud/play') > -1) {

            document.documentElement.style.overflowY = "hidden";
            if(no_pull_refresh==1){
                $('*').on('touchmove', false);
            }
            if(autoFullScreen==1){
                setMachineFullScreen();
            }
            changeBasicBtnCss();
            if(chooseLanguage==1){
                return new Promise(async(resolve, reject) => {
                    console.log('语言开始');
                    let selectedLanguage=xcloud_game_language;
                    console.log('语言选择：'+selectedLanguage);
                    if(selectedLanguage=='Auto'){
                        const regex = /\/([a-zA-Z0-9]+)\/?/gm;
                        let matches;
                        let latestMatch;
                        while ((matches = regex.exec(document.location.pathname)) !== null) {
                            if (matches.index === regex.lastIndex) {
                                regex.lastIndex++;
                            }
                            matches.forEach((match, groupIndex) => {
                                // console.log(`Found match, group ${groupIndex}: ${match}`);
                                latestMatch = match;
                            });
                        }
                        if (latestMatch) {
                            let pid = latestMatch;
                            try {
                                let res = await fetch(
                                    "https://catalog.gamepass.com/products?market=US&language=en-US&hydration=PCInline", {
                                        "headers": {
                                            "content-type": "application/json;charset=UTF-8",
                                        },
                                        "body": "{\"Products\":[\"" + pid + "\"]}",
                                        "method": "POST",
                                        "mode": "cors",
                                        "credentials": "omit"
                                    });
                                let jsonObj =await res.json();
                                let languageSupport = jsonObj["Products"][pid]["LanguageSupport"]


                                for(let language of Object.keys(default_language_list)) {
                                    if (default_language_list[language] in languageSupport) {
                                        selectedLanguage=default_language_list[language];
                                        break;
                                    }
                                }

                                if(selectedLanguage=='Auto'){
                                    //防止接口没有返回支持语言
                                    selectedLanguage=IfErrUsedefaultGameLanguage;
                                }

                            }catch(e){}
                        }
                    }

                    if (isRequest && arg0.method == "POST") {
                        arg0.json().then(json => {
                            json["settings"]["locale"] = selectedLanguage;
                            let body = JSON.stringify(json);
                            arg[0] = new Request(url, {
                                method: arg0.method,
                                headers: arg0.headers,
                                body: body,
                                mode: arg0.mode,
                                credentials: arg0.credentials,
                                cache: arg0.cache,
                                redirect: arg0.redirect,
                                referrer: arg0.referrer,
                                integrity: arg0.integrity
                            });
                            originFetch(...arg).then(res => {
                                console.log(`语言结束, 选择语言: ${selectedLanguage}.`)
                                resolve(res);

                            }).catch(err => {
                                reject(err);
                            });
                        });
                    } else {
                        console.error("[ERROR] Not a request.");
                        return originFetch(...arg);
                    }
                });
            }else {
                return originFetch(...arg);
            }
        } else if (url.indexOf('/v2/titles') > -1) { // /v2/titles or /v2/titles/mru
            // Enable CustomTouchOverlay
            console.log('修改触摸开始')
            return new Promise((resolve, reject) => {
                originFetch(...arg).then(res => {
                    res.json().then(json => {
                        // console.error(json);
                        try {
                            //e.controller = "Controller",
                            //  e.mouseAndKeyboard = "MKB",
                            //  e.customTouchOverlay = "CustomTouchOverlay",
                            //   e.genericTouch = "GenericTouch",
                            //    e.nativeTouch = "NativeTouch",
                            //    e.nativeSensor = "NativeSensor"
                            json["results"].forEach(result => {
                                if (result["details"]["supportedInputTypes"].includes("CustomTouchOverlay") === false) {
                                    result["details"]["supportedInputTypes"].push("CustomTouchOverlay");
                                    // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                                }
                                if (result["details"]["supportedInputTypes"].includes("MKB") === false) {
                                    result["details"]["supportedInputTypes"].push("MKB");
                                    // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                                }
                                if (result["details"]["supportedInputTypes"].includes("GenericTouch") === false) {
                                    result["details"]["supportedInputTypes"].push("GenericTouch");
                                    // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                                }
                                if (result["details"]["supportedInputTypes"].includes("NativeTouch") === false) {
                                    result["details"]["supportedInputTypes"].push("NativeTouch");
                                    // console.log("[Xbox Cloud Gaming Global Touch Controll] Hook " + result["titleId"]);
                                }
                            });
                        } catch (err) {}
                        let body = JSON.stringify(json);
                        let newRes = new Response(body, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: res.headers
                        })
                        resolve(newRes);

                        console.log('修改触摸结束')
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            });
        }else {
            return originFetch(...arg);
        }
    }


    function changeBasicBtnCss(){
        let btnCss =
            basic_X_Btn+`{
        width:10px;
        min-width:10px;
        background-color:rgba(255,0,0,0)!important;
        overflow: hidden;
        color: white;
    }
    `+floatingSixDotBox+`{
        background:rgba(0, 0, 0, 0)!important;
    }
    `+floatingSixDot+`{
        opacity:0.3!important;
    }
    `+floatingSixDotLeft+`{
        background-color:rgba(255,0,0,0)!important;
    }`
     +floatingSixDotLeftC1+`{
        background-color:rgba(255,0,0,0)!important;
     }`
     +floatingSixDotLeftC2+`{
        background-color:rgba(255,0,0,0)!important;
     }
    .closeSetting1 {
      /* 文字颜色 */
      color: #0099CC;
      /* 清除背景色 */
      background: transparent;
      /* 边框样式、颜色、宽度 */
      border: 2px solid #0099CC;
      /* 给边框添加圆角 */
      border-radius: 6px;
      /* 字母转大写 */
      border: none;
      color: white;
      padding: 3px 13px;
      text-align: center;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      -webkit-transition-duration: 0.4s; /* Safari */
      transition-duration: 0.4s;
      cursor: pointer;
      text-decoration: none;
      text-transform: uppercase;
     }
      .closeSetting2 {
      background-color: white;
      color: black;
      border: 2px solid #008CBA;
      display: block;
      margin: 0 auto;
      margin-top: 5px;
     }
    /* 悬停样式 */
    .closeSetting2:hover {
      background-color: #008CBA;
      color: white;
     }
    .settingsBackgroud{
				position: fixed;
				left: 0px;
				top: 3%;
				background: #0000;
				width: 100%;
				height: 100%;
                overflow: scroll;
			}
			.settingsBox{
				position: relative;
				background: wheat;
				width: fit-content;
                height: fit-content;
				border-radius: 5px;
				margin: 5% auto;
                padding: 20px;
                font-family: '微软雅黑';
                line-height: 22px;
			}
           .settingsBoxInputRadio{
                background-color: initial;
                cursor: default;
                appearance: auto;
                box-sizing: border-box;
                margin: 3px 3px 0px 5px;
                padding: initial;
                padding-top: initial;
                padding-right: initial;
                padding-bottom: initial;
                padding-left: initial;
                border: initial;
                -webkit-appearance: checkbox;
                accent-color: dodgerblue;
            }

`;
        if(videoResize==1){
            btnCss+=`video{
               transform: scaleX(`+(videoX+1)+`) scaleY(`+(videoY+1)+`)}`;

        }
        var basicStyle = document.createElement('style');
        basicStyle.innerHTML = btnCss;
        var doc = document.head || document.documentElement;
        doc.appendChild(basicStyle);
    }


    changeBasicBtnCss();
    $(document).on("click",basicCheckBtn,
                   function(){

        if($(this).attr('aria-checked')=='true'){
            BasicControlsCheck=true;
        }else{
            BasicControlsCheck=false;
        }
    });
    $(document).on("click",confirmBtn,
                   function(){
        if(BasicControlsCheck){
            $(basic_X_Btn).removeClass(basicFukClass);
            $(basic_X_Btn).text('X');
        }
    });


    let needrefresh=0;
    function initSettingBox() {

        let dom = '';
        dom += `<label  style="display: block;text-align:left;"><div   style="display: inline;">选择语言：</div>`;
        dom += `<input type="radio" class="chooseLanguageListener settingsBoxInputRadio" style="outline:none;" name='chooseLanguage' id="chooseLanguageOn" value="1" ${chooseLanguage == 1 ? 'checked' : ''}><label for="chooseLanguageOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="chooseLanguageListener settingsBoxInputRadio" style="outline:none;" name='chooseLanguage' id="chooseLanguageOff" value="0" ${chooseLanguage == 0 ? 'checked' : ''}><label for="chooseLanguageOff" style="padding-right: 25px;">关</label>`;

        dom += `<label class=" chooseLanguageBlock" style="text-align:left;display:`+(chooseLanguage==1?'block':'none')+`"><div   style="display: inline;">语言：</div>`;

        Object.keys(default_language_list).forEach(languageChinese => {
            dom += `<input type="radio" class="languageSingleListener settingsBoxInputRadio" style="outline:none;" name='selectLanguage' id="${default_language_list[languageChinese]}" value="${default_language_list[languageChinese]}" ${xcloud_game_language == default_language_list[languageChinese] ? 'checked' : ''}><label for="${default_language_list[languageChinese]}" style="padding-right: 15px;">${languageChinese}</label>`;
        });
        dom += `</label>`;

        dom += `</label>`;

        dom += `<label class=" IfErrUsedefaultGameLanguageBlock" style="display:`+ (xcloud_game_language=='Auto'?'block':'none')+`;text-align:left;"><div   style="display: inline;">智能错误时使用：</div>`;
        dom += `<input type="radio" style="outline:none;" name='IfErrUsedefaultGameLanguage' class="IfErrUsedefaultGameLanguageListener settingsBoxInputRadio" id="IfErrUsedefaultGameLanguageCN" value="zh-CN" ${IfErrUsedefaultGameLanguage == 'zh-CN' ? 'checked' : ''}><label for="IfErrUsedefaultGameLanguageCN" style="padding-right: 15px;">简体</label>`;
        dom += `<input type="radio" style="outline:none;" name='IfErrUsedefaultGameLanguage' class="IfErrUsedefaultGameLanguageListener settingsBoxInputRadio" id="IfErrUsedefaultGameLanguageTW" value="zh-TW" ${IfErrUsedefaultGameLanguage == 'zh-TW' ? 'checked' : ''}><label for="IfErrUsedefaultGameLanguageTW" style="padding-right: 15px;">繁体</label>`;
        dom += `</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">免代理直连：</div>`;
        dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOpen" value="1" ${no_need_VPN_play == 1 ? 'checked' : ''}><label for="noNeedVpnOpen" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class='noNeedVpnListener settingsBoxInputRadio' style="outline:none;" name='noNeedVpn' id="noNeedVpnOff" value="0" ${no_need_VPN_play == 0 ? 'checked' : ''}><label for="noNeedVpnOff" style="padding-right: 15px;">关</label>`;
        dom += `</label>`;


        dom += `<label class=" chooseRegionsBlock" style="text-align:left;display:`+(no_need_VPN_play==1?'block':'none')+`"><div   style="display: inline;">欺骗IP：</div>`;


        Object.keys(regionsList).forEach(region => {
            dom += `<input type="radio" class="regionSingleListener settingsBoxInputRadio" style="outline:none;" name='selectRegion' id="${region}" value="${regionsList[region]}" ${fakeIp == regionsList[region] ? 'checked' : ''}><label for="${region}" style="padding-right: 15px;">${region}</label>`;
        });
        dom += `<div style="display:block">`
        dom += `<input type="radio" class="regionSingleListener settingsBoxInputRadio" style="outline:none;" name='selectRegion' id="customfakeIp" value="customfakeIp" ${useCustomfakeIp == 1 ? 'checked' : ''}><label for="customfakeIp" style="padding-right: 15px;">自定义IP：</label>`;

        dom += `<input type='text' style="display: `+(useCustomfakeIp==1?'inline':'none')+`;outline: none;width: 125px;" id="customfakeIpInput" class="customfakeIpListener" value="${customfakeIp}" placeholder="请输入IP"/>`
        dom += `</div>`
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">高码率：</div>`;
        dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOn" value="1" ${high_bitrate == 1 ? 'checked' : ''}><label for="high_bitrateOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="high_bitrateListener settingsBoxInputRadio" style="outline:none;" name='highBitrate' id="high_bitrateOff" value="0" ${high_bitrate == 0 ? 'checked' : ''}><label for="high_bitrateOff" style="padding-right: 25px;">关</label>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">禁止检测网络状况：</div>`;
        dom += `<input type="radio" class="disableCheckNetworkListener settingsBoxInputRadio" style="outline:none;" name='disableCheckNetwork' id="disableCheckNetworkOn" value="1" ${disableCheckNetwork == 1 ? 'checked' : ''}><label for="disableCheckNetworkOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="disableCheckNetworkListener settingsBoxInputRadio" style="outline:none;" name='disableCheckNetwork' id="disableCheckNetworkOff" value="0" ${disableCheckNetwork == 0 ? 'checked' : ''}><label for="disableCheckNetworkOff" style="padding-right: 25px;">关</label>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">自动打开经典触控：</div>`;
        dom += `<input type="radio" class="useDefaultTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='useDefaultTouchControls' id="useDefaultTouchControlsOn" value="1" ${useDefaultTouchControls == 1 ? 'checked' : ''}><label for="useDefaultTouchControlsOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="useDefaultTouchControlsListener settingsBoxInputRadio" style="outline:none;" name='useDefaultTouchControls' id="useDefaultTouchControlsOff" value="0" ${useDefaultTouchControls == 0 ? 'checked' : ''}><label for="useDefaultTouchControlsOff" style="padding-right: 25px;">关</label>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">禁用游戏内下拉刷新：</div>`;
        dom += `<input type="radio" class="no_pull_refreshListener settingsBoxInputRadio" style="outline:none;" name='no_pull_refresh' id="no_pull_refreshOn" value="1" ${no_pull_refresh == 1 ? 'checked' : ''}><label for="no_pull_refreshOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="no_pull_refreshListener settingsBoxInputRadio" style="outline:none;" name='no_pull_refresh' id="no_pull_refreshOff" value="0" ${no_pull_refresh == 0 ? 'checked' : ''}><label for="no_pull_refreshOff" style="padding-right: 25px;">关</label>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">自动全屏：</div>`;
        dom += `<input type="radio" class="autoFullScreenListener settingsBoxInputRadio" style="outline:none;" name='autoFullScreen' id="autoFullScreenOn" value="1" ${autoFullScreen == 1 ? 'checked' : ''}><label for="autoFullScreenOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="autoFullScreenListener settingsBoxInputRadio" style="outline:none;" name='autoFullScreen' id="autoFullScreenOff" value="0" ${autoFullScreen == 0 ? 'checked' : ''}><label for="autoFullScreenOff" style="padding-right: 25px;">关</label>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;


        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">锁定物理服务器：</div>`;
        dom += `<input type="radio" class="blockXcloudServerListener settingsBoxInputRadio" style="outline:none;" name='blockXcloudServer' id="blockXcloudServerOn" value="1" ${blockXcloudServer == 1 ? 'checked' : ''}><label for="blockXcloudServerOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="blockXcloudServerListener settingsBoxInputRadio" style="outline:none;" name='blockXcloudServer' id="blockXcloudServerOff" value="0" ${blockXcloudServer == 0 ? 'checked' : ''}><label for="blockXcloudServerOff" style="padding-right: 25px;">关</label>`;

        dom += `<select class="blockServerBlock" style="outline: none;display:`+(blockXcloudServer==1?'block':'none')+`">`;
        dom +=`<option style="display:none"></option>`
        blockXcloudServerList.forEach(serverName => {
            dom += `<option value="${serverName}" ${defaultXcloudServer == serverName ? 'selected' : ''}>${serverName}</option>`;
        });
        dom += `</select>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom += `<label class="" style="display: block;text-align:left;"><div   style="display: inline;">去视频黑边：</div>`;
        dom += `<input type="radio" class="videoResizeListener settingsBoxInputRadio" style="outline:none;" name='videoResize' id="videoResizeOn" value="1" ${videoResize == 1 ? 'checked' : ''}><label for="videoResizeOn" style="padding-right: 15px;">开</label>`;
        dom += `<input type="radio" class="videoResizeListener settingsBoxInputRadio" style="outline:none;" name='videoResize' id="videoResizeOff" value="0" ${videoResize == 0 ? 'checked' : ''}><label for="videoResizeOff" style="padding-right: 25px;">关</label>`;



        dom+=`<div id="videoXY" style="display: `;

        if(videoResize == 1){
            dom +=`block">`;
        }else{
            dom +=`none">`;
        }
        dom += `<lable>上下</lable><input type='text' style="outline: none;width: 102px;" id="videoY" class="videoYListener" value="${videoY}" placeholder="请输入数字"/>`
        dom += `<lable>左右</lable><input type='text' style="outline: none;width: 102px;" id="videoX" class="videoXListener" value="${videoX}" placeholder="请输入数字"/>`

        dom+=`</div>`;
        dom+=`</label><hr style="background-color: black;width:95%" />`;

        dom+=`<button class="closeSetting1 closeSetting2" style="outline: none;">关闭</button>`

        dom+=`<div style="text-align: right;margin-top: 8px;font-size: 16px;"><lable>捐赠：</lable><a style="margin-right:15px;outline: none;color: #107c10;text-decoration: underline;" href="https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMVNFQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--14c278e3f72d104cff50bf130d4039229fc25a6b/wx.png?locale=zh-CN">微信</a><a style="outline: none;color: #107c10;text-decoration: underline;" href="https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMU9FQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--5fc08aaa8407cc6099654d65455b7966bf2c60ee/alipay.png?locale=zh-CN">支付宝</a></div>`
        dom = '<div style="padding: 20px;color: black;display:none;" class="settingsBackgroud" id=\'settingsBackgroud\'>' +`<div class="settingsBox">`+dom+`</div>`+ '</div>';

        $('body').append(dom);

        $(document).on('blur', '.videoXListener',function(){
            if(naifeitian.isNumber($(this).val())){
                naifeitian.setValue('videoXGM',$(this).val());
            }else{
                $(this).val("0");
                naifeitian.setValue('videoXGM','0');
                alert('请输入数字！');
            }
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });
        $(document).on('blur', '.videoYListener',function(){
            if(naifeitian.isNumber($(this).val())){
                naifeitian.setValue('videoYGM',$(this).val());
            }else{
                $(this).val("0");
                naifeitian.setValue('videoYGM','0');
                alert('请输入数字！');
            }
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.videoResizeListener',function(){
            if($(this).val()==0){
                $('#videoXY').hide();
            }else{
                $('#videoXY').css('display','');
            }
            naifeitian.setValue('videoResizeGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });


        $(document).on('click', '#header-right',function(){
            $('#settingsBackgroud').css('display','none');
        });

        $(document).on('click', '.closeSetting1',function(){

            $('*').off('touchmove', false);
            $('#settingsBackgroud').css('display','none');
            if(needrefresh==1){
                history.go(0);
            }
        });

        $(document).on('click', '.chooseLanguageListener',function(){
            if($(this).val()==0){
                $('.chooseLanguageBlock').hide();
                $('.IfErrUsedefaultGameLanguageBlock').hide();
            }else{
                $('.chooseLanguageBlock').css('display','block');

                if(naifeitian.getValue('xcloud_game_languageGM')=='Auto'){
                    $('.IfErrUsedefaultGameLanguageBlock').css('display','block');
                }
            }
            naifeitian.setValue('chooseLanguageGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.languageSingleListener',function(){
            if($(this).val()!='Auto'){
                $('.IfErrUsedefaultGameLanguageBlock').hide();
            }else{
                $('.IfErrUsedefaultGameLanguageBlock').css('display','block');
            }
            naifeitian.setValue('xcloud_game_languageGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.IfErrUsedefaultGameLanguageListener',function(){
            naifeitian.setValue('IfErrUsedefaultGameLanguageGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.noNeedVpnListener',function(){
            if($(this).val()==0){
                $('.chooseRegionsBlock').hide();
            }else{
                $('.chooseRegionsBlock').css('display','block');
            }
            naifeitian.setValue('no_need_VPN_playGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.regionSingleListener',function(){
            if($(this).val()=='customfakeIp'){
                naifeitian.setValue('useCustomfakeIpGM',1);
                $('#customfakeIpInput').css('display','inline');
            }else{
                naifeitian.setValue('fakeIpGM',$(this).val());
                naifeitian.setValue('useCustomfakeIpGM',0);
                $('#customfakeIpInput').css('display','none');
            }

            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('blur', '.customfakeIpListener',function(){
            if(naifeitian.isValidIP($(this).val())){
                naifeitian.setValue('customfakeIpGM',$(this).val());
            }else{
                $(this).val("");
                naifeitian.setValue('customfakeIpGM','');
                alert('IP格式错误！');
            }
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });


        $(document).on('click', '.high_bitrateListener',function(){

            naifeitian.setValue('high_bitrateGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.autoFullScreenListener',function(){
            naifeitian.setValue('autoFullScreenGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.disableCheckNetworkListener',function(){
            naifeitian.setValue('disableCheckNetworkGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.useDefaultTouchControlsListener',function(){
            naifeitian.setValue('useDefaultTouchControlsGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.no_pull_refreshListener',function(){
            naifeitian.setValue('no_pull_refreshGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('click', '.blockXcloudServerListener',function(){
            if($(this).val()==0){
                $('.blockServerBlock').hide();
            }else{
                $('.blockServerBlock').css('display','block');
            }
            naifeitian.setValue('blockXcloudServerGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });

        $(document).on('change', '.blockServerBlock',function(){
            naifeitian.setValue('defaultXcloudServerGM',$(this).val());
            needrefresh=1;
            $('.closeSetting1').text('确定');
        });
    }

    if(no_pull_refresh==1){
        $(document).on("click",threeDotBtn,
                       function(){
            if($(this).parent().attr('aria-expanded')=="false"){
                $('*').off('touchmove', false);
                $(threeDotClickedScreen).on('click',function(){
                    setTimeout(function(){
                        let exitBtn=$(quitGameConfirmBtn);
                        if(exitBtn.length==0){
                            $('*').on('touchmove', false);
                        }else{
                            $(quitGame_X_nm_btn).on('click',function(){
                                $('*').on('touchmove', false);
                            })
                        }
                    },100);
                });

            }
        });

        $(window).on('popstate', function () {
            $('*').off('touchmove', false);
            document.documentElement.style.overflowY = "";
            if(autoFullScreen==1){
                exitMachineFullscreen();
            }
        });

        $(document).on("click",quitGameConfirmBtn,
                       function(){
            document.documentElement.style.overflowY = "";
            $('*').off('touchmove', false);
            if(autoFullScreen==1){
                exitMachineFullscreen();
            }

        });
    }else{
        $(document).on("click",quitGameConfirmBtn,
                       function(){
            document.documentElement.style.overflowY = "";
            if(autoFullScreen==1){
                exitMachineFullscreen();
            }
        });
    }
    $(document).on('click', cloudGameBeta,function(){
        if($(this).attr('href')=='/play'){
            $('#settingsBackgroud').css('display','');
            $('*').on('touchmove', false);
            $('.settingsBackgroud').off('touchmove', false);

            $(this).text("⚙️ 设置");
            $(this).next().remove();
        }
    });
    $(document).on('click', cloudGameBetaC1,function(){
        $('#settingsBackgroud').css('display','');
        $('*').on('touchmove', false);
        $('.settingsBackgroud').off('touchmove', false);

        $(this).text("⚙️ 设置");
        $(this).next().remove();
    });
    $(document).on('click', cloudGameBetaC2,function(){
        $('#settingsBackgroud').css('display','');
        $('*').on('touchmove', false);
        $(this).prev().text("⚙️ 设置");
        $(this).remove();
        $('.settingsBackgroud').off('touchmove', false);
    });

    $(document).ready(function(){
        setTimeout(function(){
            initSettingBox();
            let logoText=$(mslogo);
            if(logoText.attr('href')!=null && logoText.attr('href')!=""){
                logoText.removeAttr('href');
                logoText.css("color",'white');
                logoText.text("⚙️ 设置");
            }
        },2000);

    });
    $(document).on('click', mslogo,function(){
        $('#settingsBackgroud').css('display','');
        $('*').on('touchmove', false);
        $('.settingsBackgroud').off('touchmove', false);
    });

    var timer;
    var mousehidding = false;
    $(document).mousemove(function () {
        if(mousehidding){
            mousehidding = false;
            return;
        }
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        $('html').css({
            cursor: ''
        });
        timer = setTimeout(function () {
            mousehidding = true;
            $('html').css({
                cursor: 'none'
            });
        }, 2000)});

    console.log("all done");
})();
