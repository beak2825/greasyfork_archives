// ==UserScript==
// @name         含羞草/AVPorn视频播放-内部版
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @include      /^https:\/\/(h5|www)\.fi11.*\.com*/
// @match        https://*.com/play/video/*
// @match        https://*.com/homeSmallVideo
// @match        https://*.com/detail-album/*
// @match        https://*.com/detail-small-video?*

// @include      /^https:\/\/the.*\.(com|xyz)*/
// @match        https://theav*.com
// @match        https://theav*.com/*

// @include      /^https:\/\/bbav.*\.com*/
// @include      /^https:\/\/bav.*\.xyz*/

// @include      /^https:\/\/www.hx(aa|bb).*\.com*/

// @match        https://madou.tv/*

// @include      /^https:\/\/usum.*\.com*/

// @match        https://*/vip/index.html
// @match        https://*/vip/list-*.html
// @match        https://*/index/home.html
// @match        https://*/shipin/detail-*.html
// @match        https://porxy.ailupa.us/*


// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/1.3.3/hls.js
// @require      https://cdn.bootcdn.net/ajax/libs/dplayer/1.27.0/DPlayer.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js


// @description  无需登录即可播放，享受VIP：①含羞草VIP视频+短视频  ②AVPorn视频
// @author       third_e
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/467893/%E5%90%AB%E7%BE%9E%E8%8D%89AVPorn%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE-%E5%86%85%E9%83%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/467893/%E5%90%AB%E7%BE%9E%E8%8D%89AVPorn%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE-%E5%86%85%E9%83%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //         let script = document.createElement('script');
    //         //script.setAttribute('type','text/javascript');
    //         script.setAttribute('type','module');
    //         script.src = "https://cdn.bootcdn.net/ajax/libs/dplayer/1.27.0/DPlayer.min.js";
    //         document.documentElement.appendChild(script);




    const {VITE_APP_AES_KEY: dn, VITE_APP_AES_IV: un} = {
        VITE_NODE_ENV: "production",
        VITE_APP_ROUTER_NAME: "false",
        VITE_APP_API_BASE_URL: "/api",
        VITE_APP_THEME: "dark",
        VITE_APP_LOG: "false",
        VITE_PORT: "8080",
        VITE_BASE_URL: "/api",
        VITE_OUTPUT_DIR: ".dist",
        VITE_APP_NAME: "fission-friends-pc",
        VITE_APP_WEB_SOCKET_URL: "127.0.0.1",
        VITE_APP_IMGKEY: "46cc793c53dc451b",
        VITE_APP_AES_PASSWORD_KEY: "0123456789123456",
        VITE_APP_AES_PASSWORD_IV: "0123456789123456",
        VITE_APP_AES_KEY: "B77A9FF7F323B5404902102257503C2F",
        VITE_APP_AES_IV: "B77A9FF7F323B5404902102257503C2F",
        BASE_URL: "https://js10.pmeaqve.cn/pc/",
        MODE: "production",
        DEV: !1,
        PROD: !0
    };


    // 请求加密数据
    function pn(e, {key: n, iv: t}={}) {
        let u = CryptoJS;
        var a = u.enc.Utf8.parse(e)
        , i = u.AES.encrypt(a, u.enc.Utf8.parse(n || dn), {
            iv: u.enc.Utf8.parse(t || un),
            mode: u.mode.CBC,
            padding: u.pad.Pkcs7
        });
        return u.enc.Base64.stringify(i.ciphertext)
    }

    // 红杏请求加密数据
    function hxaaEncrypt(initParams){
        // 视频加密  {id:videoId}
        // 账号加密  {client_system:0 password: "123456789", 手机采用phone: 1234|邮箱采用email:@163}
        var cp = CryptoJS;
        let n =Date.parse(new Date) / 1e3
        , i = (n - 100).toString()
        , r = (n + 100).toString()
        , s = i.substr(0, 9) + "0"
        , a = r.substr(0, 9) + "0"
        , c = "00" + s + s + s
        , u = "000000" + a;
        c =cp.enc.Utf8.parse(c);
        u = cp.enc.Utf8.parse(u);
        let e={};
        let h = JSON.stringify(initParams)
        , d = cp.enc.Utf8.parse(h)
        , f = cp.AES.encrypt(d, c, {
            iv: u,
            mode: cp.mode.CBC
        })
        , m = f.toString()
        , g = encodeURIComponent(m);


//         let p = JSON.stringify(initParams)
//         , h = cp.enc.Utf8.parse(p)
//         , d = cp.AES.encrypt(h, c, {
//             iv: u,
//             mode: cp.mode.CBC
//         })
//         , f = d.toString()
//         , m = encodeURIComponent(f);
        let params = {'data_param':g, 't' :n}
        return params
    }

    //===============================================================================================================================================================================
    //                                                 以下是删除广告
    //===============================================================================================================================================================================

    // 除去含羞草长视频提示VIP及试看上限广告
    function delLongVideoGG(){
        // 去除广告
        let del1 = document.getElementsByClassName("vip-mask absolute w-full h-full top-0 left-0 flex-center flex-col space-y-4")[0]||
            document.getElementsByClassName("pub-video-poster g-w g-h g-absolute")[0];
        let del2 = document.getElementsByClassName("el-image w-full h-full absolute top-0 left-0 z-50 h-full w-full overflow-hidden")[0]||
            document.getElementsByClassName("try-detail-video try-before g-absolute g-w g-flex g-flex-fdc g-flex-aic boxBackground textcss")[0];
        if (del1 != null){del1.parentNode.removeChild(del1);}
        if (del2 != null){del2.parentNode.removeChild(del2);}
    }

    // 除去含羞草短视频提示VIP及试看上限广告
    function delShortVideoGG(){
        // 除去短视频试看上限广告
        let del3 = document.getElementsByClassName("small-video-poster g-w g-h g-absolute")[0];
        let del4 = document.getElementsByClassName("small-video-dialog-mask g-w g-h g-absolute")[0];
        let del5 = document.getElementsByClassName("small-video-layer g-absolute g-f-s-14 g-text-tac")[0];
        let del6 = document.getElementsByClassName("user-bg g-absolute g-w")[0];

        if (del3 != null){del3.parentNode.removeChild(del3);}
        if (del4 != null){del4.parentNode.removeChild(del4);}
        if (del5 != null){del5.parentNode.removeChild(del5);}
        if (del6 != null){del6.parentNode.removeChild(del6);}

        // 处理页面滑动
        if(document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-active').length != 0){
            document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-active')[0].setAttribute('class','swiper-slide swiper-slide-active');
        }
        if(document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-next').length != 0){
            document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-next')[0].setAttribute('class','swiper-slide swiper-slide-next');
        }
        if(document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-prev').length != 0){
            document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-prev')[0].setAttribute('class','swiper-slide swiper-slide-prev');
        }
    }

    //删除avPorn广告
    function delavPornVideoGG(){
        let del7 = document.getElementsByClassName('sponsor')[0];
        if (del7 != null){ del7.parentNode.removeChild(del7);}
        // 去掉右侧提示升级VIP
        let del8 = document.getElementsByClassName('table')[0];
        if (del8 != null){ del8.parentNode.removeChild(del8);}
    }

    // 删除avjb广告
    function delAvjbVideoGG(){
        let del1 = document.getElementsByClassName("no-player")[0].style.display;
        let del2 = document.getElementsByClassName("top-ad")[0];
        let del3 = document.getElementsByClassName("sponsor")[0];
        if (del1 != null){document.getElementsByClassName("no-player")[0].style.display = "none";}
        if (del2 != null){del2.parentNode.removeChild(del2);}
        if (del3 != null){del3.parentNode.removeChild(del3);}
    }
    // 删除红杏广告
    function delHxaaVideoGG(){
        let del1 = document.getElementsByClassName('big_ibc')[0];
        let del2 = document.getElementsByClassName('play_video_2_1')[0];
        let del3 = document.getElementsByClassName('play_video_2')[0];
        let del4 = document.getElementsByClassName('el-carousel el-carousel--horizontal')[0];
        let del5 = document.getElementsByClassName('banner_img')[0];

        if (del1 != null){del1.parentNode.removeChild(del1);}
        if (del2 != null){del2.parentNode.removeChild(del2);}
        if (del3 != null){del3.parentNode.removeChild(del3);}
        if (del4 != null){del4.parentNode.removeChild(del4);}
        if (del5 != null){del5.parentNode.removeChild(del5);}
    }

    // 删除猫咪广告
    function delMaomiVideoGG(){
        let delList = [
            document.getElementsByClassName('home-banner-swiper swiper-initialized swiper-horizontal')[0]
            || document.getElementsByClassName('home-banner-swiper swiper-initialized swiper-horizontal swiper-pointer-events')[0]
            , document.getElementsByClassName('home-banner-mobile-swiper swiper-initialized swiper-horizontal swiper-ios')[0]
            , document.getElementsByClassName('vip-price-list')[0]
            , document.getElementsByClassName('top-gao-container gao-container photo-header-title-content-text-dallor')[0]
            , document.getElementsByClassName('float-gao-container')[0]
            , document.getElementsByClassName('photo--content-title-bottomx--foot gao-container')[0]
        ];
        delList.forEach(function(del){
            if (del != null){
                del.parentNode.removeChild(del);
            }
        });
    }

    //===============================================================================================================================================================================
    //                                                 以上是删除广告
    //===============================================================================================================================================================================

    // 解析视频时间提示
    function showTopInfo(){
        if (document.getElementById('add_tipInfo') == null){
            let currTime = 1;
            let tipInfodiv = document.createElement('div');
            tipInfodiv.innerHTML = `<div id="add_tipInfo" style="position:fixed;top:25%;width:100%;z-index:99999999;color:red;font-size:24px;text-align:center;font-weight:bold"></div>`;
            document.querySelector("head").after(tipInfodiv);
            intervalTipInfo = setInterval(function () {
                document.getElementById('add_tipInfo').innerText = `正在解析：${currTime++}秒`;
            },1000);
        }
    }

    // 初始化
    async function initBase(webSite){
        if (webSite == analyzeVideoDict.hxaa.baseUrl){
            // 设置红杏配置

            if (GM_getValue(gmSetDataKey.hxaa.accountConfig.key) == null){
                console.log('设置红杏配置开始','获取的配置：',GM_getValue(gmSetDataKey.hxaa.accountConfig.key));
                console.log('a');
                // 没有配置字段值就创建字段值，创建账号数，成功创建数
                let orginData = {};
                orginData[gmSetDataKey.hxaa.createAccountNums.key] = gmSetDataKey.hxaa.createAccountNums.value;
                orginData[gmSetDataKey.hxaa.succAccountNums.key] = gmSetDataKey.hxaa.succAccountNums.value;

                // 设置初始值
                GM_setValue(gmSetDataKey.hxaa.accountConfig.key,orginData);
                // 获取账号，一个一个的获取
                if (GM_getValue(String(gmSetDataKey.hxaa.HongxingAccount.key + 0)) == null){
                    await createHxaaAccount(analyzeVideoDict.hxaa.baseUrl);
                }
            }
            // 每日请求配置添加
            if (GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key) == null){
                console.log('添加每日请求配置',GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key));
                console.log(GM_listValues())
                let orginData = {};
                orginData[gmSetDataKey.hxaa.todayRequestNums.key] = gmSetDataKey.hxaa.todayRequestNums.value;
                // 设置初始值
                GM_setValue(gmSetDataKey.hxaa.todayRequestNums.key,orginData);
            }
            // 每日跨日清空请求次数

            if(GM_getValue(gmSetDataKey.hxaa.isCrossDay.key) == null){
                console.log('每日如果跨日，则清空请求',GM_getValue(gmSetDataKey.hxaa.isCrossDay.key));
                console.log('c')
                // 设置初始值
                GM_setValue(gmSetDataKey.hxaa.isCrossDay.key,gmSetDataKey.hxaa.isCrossDay.value);
            }else{
                //console.log('d')
                let now = (new Date()).toLocaleDateString();
                // 跨日则更新
                if(GM_getValue(gmSetDataKey.hxaa.isCrossDay.key) != now){
                    GM_setValue(gmSetDataKey.hxaa.isCrossDay.key,now);
                    // 请求次数重置
                    let orginData = {};
                    orginData[gmSetDataKey.hxaa.todayRequestNums.key] = gmSetDataKey.hxaa.todayRequestNums.value;
                    // 设置初始值
                    GM_setValue(gmSetDataKey.hxaa.todayRequestNums.key,orginData);
                }
            }
            //console.log(GM_getValue('HongxingAccount2') == null)

            // 红杏未登录则取随意token
            let storage = JSON.parse(localStorage.getItem('move-client-user-info'));
            if (storage.user.token == ''){
                console.log('红杏未登录则取随意token')
                let token = await getToken(analyzeVideoDict.hxaa.baseUrl);

                storage.user.token = token;
                localStorage.setItem('move-client-user-info', JSON.stringify(storage));
                console.log('红杏未登录则取随意token结束');
            }
        }
    }

    // 随机生成一个字母
    function getCharacter(flag){
        var character = '';
        if(flag == null || flag == 'lower'){
            character = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0));
        }
        if(flag == 'upper'){
            character = String.fromCharCode(Math.floor( Math.random() * 26) + "A".charCodeAt(0));
        }
        return character;
    }

    // 随机生成特定长度的字符串
    function getRandomLengthChar(length,characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"){
        //length为所需长度，characters为所包含的所有字符，默认为字母。数字ye可以加进去0123456789
        characters=characters.split("");//分割字符。
        var result="";//返回的结果。
        while(result.length<length) result+=characters[Math.round(Math.random()*characters.length)];
        return result;
    }
    // 随机生成限定范围的数字
    function getRandomNumRange (m,n){
        var num = Math.floor(Math.random()*(m - n) + n);
        return num;
    }

    /*登录API：https://api2.apippzqhx2.com/WebApp/LoginPhonePwd
               https://api2.apippzqhx2.com/WebApp/LoginEmailPwd
    */
    // 创建账号
    async function createHxaaAccount(webSite,accountNo){
        let requireData = {}
        let phone = getRandomLengthChar(getRandomNumRange(6,12));
        let password = Math.random().toString(36).substr(2).slice(1,8); //随机生成密码
        let email = '@163.com';
        let apiUrl = ''
        if (webSite == analyzeVideoDict.hxaa.baseUrl){
            apiUrl = 'https://hxppi3.qiaonianxinxi.xyz/WebApp/Register';
            requireData.method = 'POST';
            requireData.data = hxaaEncrypt({'client_system':3,'password':password, 'email':phone+email,'machine_num':null});
            requireData.baseData = {'password':password, 'email':phone+email, 'client_system':3};
            requireData.url = apiUrl;
            requireData.no = accountNo;
        }

        // 发起请求创建账号
        await requestCreateHxaaAccount(webSite, requireData);
    }

    function requestCreateHxaaAccount(webSite, requireData){
        return new Promise(function (resolve, reject) {
            // 创建账户开始
            console.log('=========================================创建账户开始=========================================');
            console.log("请求url"+requireData.url + '?data_param=' + requireData.data.data_param + '&t='+ requireData.data.t);
            console.log("请求内容"+JSON.stringify(requireData.baseData));
            GM_xmlhttpRequest({
                method: requireData.method, //请求方法 GET POST
                headers: requireData.headers ,
                data: JSON.stringify(requireData.baseData), //通过 POST 请求发送的字符串
                timeout: 10000, //超时（毫秒）
                responseType: "json", //响应的数据类型 text arraybuffer blob document json
                overrideMimeType: "text/xml", //请求的 MIME 类型
                url: requireData.url + '?data_param=' + requireData.data.data_param + '&t='+ requireData.data.t,

                onabort: function () {
                    //如果请求中止，则要执行的回调
                },
                onerror: function () {
                    //如果请求最终出现错误，则要执行的回调
                    console.log("请求最终出现错误,将重新请求");
                },
                ontimeout: function () {
                    //如果请求由于超时而失败，则要执行的回调
                    console.log("请求由于超时而失败，将重新请求");

                },
                onload: function (xhr,status) {
                    console.log("创建账户：请求返回结果",xhr);
                    console.log("创建账户：请求状态",xhr.status);
                    console.log("创建账户：请求返回值",xhr.response);
                    //如果创建账户成功
                    if (webSite == analyzeVideoDict.hxaa.baseUrl){
                        if(xhr.response.code ==200200){
                            let baseaccountConfig = GM_getValue(gmSetDataKey.hxaa.accountConfig.key);
                            // 存储账号信息
                            requireData.baseData.response = xhr.response.data;
                            requireData.baseData.tokenDate = new Date().toLocaleString();

                            //存储账号
                            console.log('GM_getValue账号key：'+ gmSetDataKey.hxaa.HongxingAccount.key + (requireData.no == null?baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key]:requireData.no));
                            console.log(requireData.baseData)
                            GM_setValue(String(gmSetDataKey.hxaa.HongxingAccount.key + (requireData.no == null?baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key]:requireData.no)), requireData.baseData);
                            // 重新设置创建成功次数
                            baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key] = baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key] + 1;
                            //更新找好配置
                            GM_setValue(gmSetDataKey.hxaa.accountConfig.key,baseaccountConfig);
                            // 成功账号数不等于给定账号数，继续请求创建=====这里暂时只创建一个
                            if(baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key] != baseaccountConfig[gmSetDataKey.hxaa.createAccountNums.key]){
                                //createHxaaAccount(webSite);
                            }
                            console.log('=========================================创建账户结束=========================================');
                            resolve();
                        }else if(xhr.response.code == 400 && xhr.response.message == '邮箱已存在,请更换邮箱'){
                            createHxaaAccount(webSite);
                        }
                    }
                }
            });
        });
    }

    async function loginHxaaAccount(webSite,accountInfo){
        let requireData = {}
        let phone = accountInfo.phone;
        let password = accountInfo.password;
        let email = '@163.com';
        let apiUrl = ''
        let jiami = null;
        if (webSite == analyzeVideoDict.hxaa.baseUrl){
            jiami = hxaaEncrypt({'client_system':3, 'email':phone, 'machine_num':null,'password':password});
            apiUrl = `https://hxppi3.qiaonianxinxi.xyz/WebApp/LoginEmailPwd?data_param=${jiami.data_param}&t=${jiami.t}`;
            requireData.method = 'GET';
            requireData.data = '';
            requireData.baseData = {'password':password, 'phone':phone};
            requireData.accountKey = accountInfo.key;
            requireData.url = apiUrl;
        }

        return await requestGetHxaaAccountToken(webSite, requireData);
    }
    // 获取用户登录token
    function requestGetHxaaAccountToken(webSite, requireData){
        return new Promise(function (resolve, reject) {
            // 获取账户token开始
            console.log('=========================================获取账户token开始=========================================',requireData);
            GM_xmlhttpRequest({
                method: requireData.method, //请求方法 GET POST
                headers: requireData.headers ,
                data: JSON.stringify(requireData.data), //通过 POST 请求发送的字符串
                timeout: 10000, //超时（毫秒）
                responseType: "json", //响应的数据类型 text arraybuffer blob document json
                overrideMimeType: "text/xml", //请求的 MIME 类型
                url: requireData.url,

                onerror: function () {
                    //如果请求最终出现错误，则要执行的回调
                    console.log("请求最终出现错误,将重新请求");
                },
                ontimeout: function () {
                    //如果请求由于超时而失败，则要执行的回调
                    console.log("请求由于超时而失败，将重新请求");
                },
                onload: function (xhr,status) {
                    console.log("请求返回结果",xhr);
                    console.log("请求状态",xhr.status);
                    console.log("请求返回值",xhr.response);
                    //如果账户登录成功
                    if (webSite == analyzeVideoDict.hxaa.baseUrl){
                        if(xhr.response.code ==200200){
                            // 存储账号信息
                            requireData.baseData.response = xhr.response.data;
                            requireData.baseData.tokenDate = new Date().toLocaleString();

                            //存储账号
                            GM_setValue(requireData.accountKey,requireData.baseData);
                            console.log('=========================================获取账户token结束=========================================');
                            resolve();
                            return xhr.response.data.token;
                        }
                    }
                }
            });
        });
    }

    // 获取token
    async function getToken(webSite){
        console.log('获取token')
        let token = '';
        if (webSite == analyzeVideoDict.hxaa.baseUrl){
            //
            if (!shortVideo){
                // 为长视频，获取第一个账号的token
                // 如果一个账号都没有则创建一个
                if (GM_getValue(String(gmSetDataKey.hxaa.HongxingAccount.key + 0)) == null){
                    console.log('一个账号都没有');
                    let baseaccountConfig = GM_getValue(gmSetDataKey.hxaa.accountConfig.key); // 获取配置
                    if(baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key] <= baseaccountConfig[gmSetDataKey.hxaa.createAccountNums.key]){
                        await createHxaaAccount(webSite, 0);
                    }
                }
                let accountInfo = GM_getValue(String(gmSetDataKey.hxaa.HongxingAccount.key + 0));
                accountInfo.key = String(gmSetDataKey.hxaa.HongxingAccount.key + 0);
                if ((new Date() - new Date(accountInfo.tokenDate)) >= 1000*60*60){
                    console.log('|token超1个小时，重新获取')
                    await loginHxaaAccount(webSite,accountInfo);
                }
                accountInfo = GM_getValue(String(gmSetDataKey.hxaa.HongxingAccount.key + 0));
                token = accountInfo.response.token;
            }else{
                // 为短视频，查看短视频请求次数，获取对应账号数
                // 获取当前 请求数
                let requestNums = GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key)[gmSetDataKey.hxaa.todayRequestNums.key];
                if (requestNums%3 == 0 && requestNums !=0 ){
                    // 创建账号
                    if (GM_getValue(gmSetDataKey.hxaa.HongxingAccount.key + parseInt(requestNums/3)) == null){
                        let baseaccountConfig = GM_getValue(gmSetDataKey.hxaa.accountConfig.key); // 获取配置
                        if(baseaccountConfig[gmSetDataKey.hxaa.succAccountNums.key] <= baseaccountConfig[gmSetDataKey.hxaa.createAccountNums.key]){
                            await createHxaaAccount(webSite, parseInt(requestNums/3));
                        }
                    }
                    requestNums = parseInt((requestNums-1)/3);
                }else{
                    requestNums = parseInt(requestNums/3);
                }
                console.log('获取当前账号key',gmSetDataKey.hxaa.HongxingAccount.key + requestNums);
                console.log(GM_getValue(gmSetDataKey.hxaa.HongxingAccount.key + requestNums))
                let accountInfo = GM_getValue(gmSetDataKey.hxaa.HongxingAccount.key + requestNums);
                accountInfo.key = gmSetDataKey.hxaa.HongxingAccount.key + requestNums;
                if ((new Date() - new Date(accountInfo.tokenDate)) >= 1000*60*60){
                    console.log('token超1个小时，重新获取')
                    // 登录
                    await loginHxaaAccount(webSite,accountInfo);
                }
                accountInfo = GM_getValue(gmSetDataKey.hxaa.HongxingAccount.key + requestNums);
                console.log('token未超6个小时，token为：',accountInfo.response.token)
                token = accountInfo.response.token;
            }
            //token = '/1jEA9Ke0fPhc4FmTE+0+X69R6SR/IMNvvtSIETvABc=';
        }
        console.log('获取token结束',token)
        return token;
    }

    //========================================================================================================================================================================
    //                      以下是获取视频ID
    //========================================================================================================================================================================
    // 获取当前页面视频编号ID
    function getVideoId(webSite){
        console.log('获取ID开始');
        let videoInfo = document.location;
        let url = videoInfo.href;
        let videoInfoList = url.split('/')
        let id = 0;

        if (webSite == analyzeVideoDict.avPorn.baseUrl){
            id = parseInt(videoInfoList[4]);
        }else if (webSite == analyzeVideoDict.hxc.baseUrl){
            if(!shortVideo){
                if (videoInfoList.find(element => element === 'video')){ // PC端获取视频编号ID
                    console.log("获取的PC视频编号ID",videoInfoList[5]);
                    id = parseInt(videoInfoList[5]);
                } else if(videoInfoList.find(element => element === 'detail-album')){ // 移动端获取视频编号ID
                    console.log("获取的移动视频编号ID",videoInfoList[4]);
                    id = parseInt(videoInfoList[4]);
                } else if(videoInfoList.find(element => element.indexOf('detail-small-video')!= -1)){// 移动端-短视频获取视频编号ID
                    console.log("获取的移动-短视频视频编号ID",videoInfoList[3].split('=')[1]);
                    id = parseInt(videoInfoList[3].split('=')[1]);
                }
            }else{
                id = parseInt(oldShortVideoId.split('a')[0].replace("video",""));
            }
        }else if (webSite == analyzeVideoDict.avjb.baseUrl){
            id = parseInt(videoInfoList[4]);
        }else if (webSite == analyzeVideoDict.hxaa.baseUrl){
            if(!shortVideo){
                id = parseInt(videoInfoList[6]);
            }else{
                id = parseInt(url.split('?id=')[1]);
            }
        }
        console.log('获取ID为：' + id + '，结束');
        return id;
    }

    //========================================================================================================================================================================
    //                      以下是请求
    //========================================================================================================================================================================
    /* requireData:{method:请求类型, headers:请求头, data:请求参数, url:请求地址}
       webSite:网站站点分类，用于处理返回结果
       videoDate:播放视频参数
    */
    async function requireGetVideoUrl(webSite, videoDate){

        // 视频编号ID
        let videoId = getVideoId(webSite);
        // 发送请求参数
        let requireData =null;
        //未获取到ID不执行

        if (videoId != 0 ){
            // 根据当前网站路径处理请求
            if (webSite == analyzeVideoDict.avPorn.baseUrl){
                requireData = {'method':'GET', 'headers':'', 'data':'', 'url':document.location.origin + '/player/m3key.php?VID='+videoId};
            }else if (webSite == analyzeVideoDict.hxc.baseUrl){
                // 更换api了：https://api.qianyuewenhua.xyz/videos/getPreUrl
                // 发送请求地址
                let videoM3u8 = document.location.origin + !shortVideo?'/api/videos/getPreUrl':'/api/videos/getShortUrl';
                /*
                  发送请求参数
                */
                let data ={videoId:videoId};
                let nowDate = new Date;
                // 请求参数处理
                data = {
                    endata: pn(JSON.stringify(data || {})),
                    ents: pn(parseInt(nowDate.getTime() / 1e3) + 60 * nowDate.getTimezoneOffset())
                }
                // 登录返回的token
                let token1 = 'OWNhOGQ4NDk1MzcxNDFiNGFmMWM5OGIxOTUxYjM0NWN8MzkzODM4OTEwfFA=';// "MWE1NDgyYTk5NjQ5M2IwYmE1YzdhMzMyODg5ODJiMmN8MzkzODcyOTE1fFA="
                //token1 = 'MWE1NDgyYTk5NjQ5M2IwYmE1YzdhMzMyODg5ODJiMmN8MzkzODcyOTE1fFA=';
                requireData = {'method':'POST',
                               'headers':{ //消息头
                                   "Content-Type": "application/json",
                                   //'auth': token1
                               },
                               'data': data, 'url':videoM3u8};
            }else if (webSite == analyzeVideoDict.avjb.baseUrl){
                requireData = {'method':'GET', 'headers':'', 'data':'', 'url':document.location.origin + '/newembed/'+videoId};
            }else if (webSite == analyzeVideoDict.hxaa.baseUrl){
                // 红杏短视频每请求一次，今日请求次数加1
                if(shortVideo == true){
                    let todayReq = GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key);
                    todayReq[gmSetDataKey.hxaa.todayRequestNums.key] = todayReq[gmSetDataKey.hxaa.todayRequestNums.key]+1;
                    GM_setValue(gmSetDataKey.hxaa.todayRequestNums.key, todayReq);
                }
                // 发送请求地址
                let videoM3u8 = `https://hxppi3.qiaonianxinxi.xyz/WebApp/WebVideo/CheckSeeVideoAccess`;
                let token = await getToken(webSite);
                let params = hxaaEncrypt({id:videoId});
                requireData = {'method':'GET',
                               'headers':{ //消息头
                                   "Content-Type": "application/json",
                                   'token': token
                               },
                               'data':'',
                               'url':videoM3u8 + `?data_param=${params.data_param}&t=${params.t}`
                };
            }
            console.log("发起请求的参数",requireData);
            requestNums++;

            GM_xmlhttpRequest({
                method: requireData.method, //请求方法 GET POST
                headers: requireData.headers ,
                data: JSON.stringify(requireData.data), //通过 POST 请求发送的字符串
                timeout: 10000, //超时（毫秒）
                responseType: "json", //响应的数据类型 text arraybuffer blob document json
                overrideMimeType: "text/xml", //请求的 MIME 类型
                url: requireData.url,

                onabort: function () {
                    //如果请求中止，则要执行的回调
                },
                onerror: function () {
                    //如果请求最终出现错误，则要执行的回调
                    console.log("请求最终出现错误,将重新请求");
                    if (requestNums <=20 ){
                        requireGetVideoUrl(webSite, videoDate);
                    }else{
                        throw new Error(errorDict.sendRequestError);
                    }
                },
                onloadstart: function () {
                    //在加载开始时执行的回调，如果 responseType 设置为"stream"，则提供对流对象的访问
                    //console.log("b");
                },
                onprogress: function () {
                    //如果请求取得了一些进展，则要执行的回调
                    //console.log("c");
                },
                onreadystatechange: function () {
                    //在请求的就绪状态发生更改时要执行的回调
                    //console.log("d");
                },
                ontimeout: function () {
                    //如果请求由于超时而失败，则要执行的回调
                    console.log("请求由于超时而失败，将重新请求");
                    if (requestNums <=20 ){
                        requireGetVideoUrl(webSite, videoDate);
                    }else{
                        throw new Error(errorDict.sendRequestTimeoutError);
                    }
                },
                onload: function (xhr,status) {
                    //如果加载了请求，则要执行的回调
                    console.log("请求返回结果",xhr);
                    console.log("请求状态",xhr.status);
                    console.log("请求返回值",xhr.response);
                    // 试看视频链接
                    let shikanVideoUrl = null;
                    // 拼接sign
                    let paramOne = "";
                    //处理参数
                    let videoParam = null;
                    // 最终视频地址
                    let videoBase =null;

                    if (webSite == analyzeVideoDict.avPorn.baseUrl){
                        shikanVideoUrl = xhr.responseText.split('\'')[1];
                        videoParam = shikanVideoUrl.split("?")[0];
                        videoBase = videoParam;
                    }else if(webSite == analyzeVideoDict.hxc.baseUrl){
                        /*code: 2009
                          data: {}
                          msg: "今日试看次数达限"
                        */
                        if(xhr.response.code == 0){
                            shikanVideoUrl = xhr.response.data.url;

                            videoParam = shikanVideoUrl.split("&");
                            for(let tmp in videoParam ){
                                if(videoParam[tmp].indexOf("sign")!=-1){
                                    paramOne = videoParam[tmp];
                                    break;
                                }
                            }
                            videoBase = !shortVideo?shikanVideoUrl.split("?")[0] +"?"+ paramOne:shikanVideoUrl;
                        }else if(xhr.response.code == 2009){
                            console.log('今日试看次数达限');
                        }
                    }else if(webSite == analyzeVideoDict.avjb.baseUrl){
                        if (xhr.status == 404){
                            console.log("请求由于超时而失败，将重新请求");
                            requireGetVideoUrl(webSite, videoDate);
                            return;
                        }else{
                            shikanVideoUrl = 'https'+(xhr.responseText.split("url = '")[1].split('index.m3u8')[0]+'index.m3u8').split('https')[1];
                            videoBase = shikanVideoUrl;
                        }
                    }else if(webSite == analyzeVideoDict.hxaa.baseUrl){
                        if (xhr.response.code == 200200){
                            if (!shortVideo){
                                shikanVideoUrl = xhr.response.data.url;
                                videoParam = shikanVideoUrl.split("&time");
                                let replaceStr = shikanVideoUrl.split("/")[2];
                                videoBase = videoParam[0].replace(replaceStr + '/shikanshipin', 'zms1.sxgm.xyz');
                            }else {
                                shikanVideoUrl = xhr.response.data.url;
                                videoBase = shikanVideoUrl;
                            }
                        }else if (xhr.response.code == 400 && xhr.response.message == '非会每日观看短视频超过限制'){
                            console.log('当前账号，非会每日观看短视频超过限制');
                            requireGetVideoUrl(webSite, videoDate);
                            return;
                        }
                    }
                    console.log("播放地址：",videoBase);
                    if (videoBase == null ||(videoBase.indexOf('m3u8') == -1 && videoBase.indexOf('mp4') == -1)){
                        throw new Error(errorDict.RequestVideoUrlError);
                    }
                    videoDate.videoUrl = videoBase;

                    play_allVideo(videoDate, webSite);
                }
            });
        }else{
            //删除提示
            clearInterval(intervalTipInfo);
            document.getElementById('add_tipInfo').remove();
            // 清空视频地址定位次数
            playerContainerNums = 0;
            requestNums = 0;
            analyzeVideoIsStop = true;
        }
    }
    //========================================================================================================================================================================
    //                      以上是请求
    //========================================================================================================================================================================

    //========================================================================================================================================================================
    //                      以下是展示视频地址
    //========================================================================================================================================================================

    // 展示视频地址
    function showVideoUrlAddress(videoUrl, webSite){
        // 显示视频链接
        let titleName = null;
        var address = document.getElementById("my_add_dizhi");
        if(document.getElementById("my_add_dizhi") != null){address.parentNode.removeChild(address);}
        address = document.createElement('div');
        address.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px"><p style="color:red;font-size:14px">视频地址：<a href="${videoUrl}" target="_blank">${videoUrl}</a></p>`;

        // 显示视频链接地址
        if(webSite == analyzeVideoDict.hxc.baseUrl){
            titleName = document.getElementsByClassName("text-base article-title")[0] || document.getElementsByClassName("g-m-t-8 g-flex title")[0];
            if(titleName != null){titleName.after(address);}
        }else if (webSite == analyzeVideoDict.avPorn.baseUrl){
            titleName = document.getElementsByClassName("inform_section")[0]?.getElementsByClassName("title")[0];
            if(titleName != null){titleName.after(address);}
        }else if (webSite == analyzeVideoDict.avjb.baseUrl){
            titleName = document.getElementsByClassName("info-content")[0];
            if(titleName != null){
                titleName.after(address);
                document.getElementById('my_add_dizhi').getElementsByTagName('a')[0].style.color = 'red';
            }
        }else if (webSite == analyzeVideoDict.hxaa.baseUrl){
            titleName = document.getElementsByClassName("play_main_1")[0] || document.getElementsByClassName("my_video_bottom_1_1")[0];
            if(titleName != null){
                titleName.after(address);
                document.getElementById('my_add_dizhi').getElementsByTagName('a')[0].style.color = 'red';
            }
        }
    }

    // 设置DPlayer播放器container容器定位
    function setPlayerContainer(webSite,otherData){

        return null;
    }
    // 获取DPlayer播放器container容器定位
    // 每执行一次 playerContainerNums 加1，定位元素获取成功 playerContainerNums 重置为 0， playerContainerNums 超过十次获取失败表示存在异常，可能页面更新或者其他问题
    // otherData为字典，自定义值
    function getPlayerContainer(webSite,otherData){
        let el = null;
        playerContainerNums++;
        //if (playerContainerNums >10){throw new Error("获取视频播放元素失败超过10次失败，请点击视频地址链接播放"); return;}
        if (webSite == analyzeVideoDict.hxc.baseUrl && otherData?.shortVideo == false){
            el = document.getElementById("v_prism") || document.getElementById("video1");// v_prism 为PC端，video1为移动端
        }else if (webSite == analyzeVideoDict.hxc.baseUrl && otherData?.shortVideo == true){
            el = document.querySelector("div[id^='" + otherData.oldShortVideoId + "']");// 短视频
        }else if (webSite == analyzeVideoDict.avPorn.baseUrl){
            el = document.getElementsByClassName('player_twocolumns')[0]?.getElementsByClassName('player')[0] || document.getElementById("layer") ;
        }else if (webSite == analyzeVideoDict.avjb.baseUrl){
            if(document.getElementById("new") != null){
                document.getElementById("new").remove();
            }
            let play_div = document.createElement('div');
            //`<pjsdiv id="oframeiplayer" class="pjscssed"  data-fullscreen-container="true"></div>`
            //
            play_div.innerHTML = `<div class="player-wrap" data-fullscreen-container="true" id="new" style="height: 509.625px; position:relative;"></div>`;
            document.getElementsByClassName('player')[0].setAttribute('style','height: 100% !important;padding-bottom: 0 !important;');
            document.getElementsByClassName('no-player')[0].after(play_div);
            el = document.getElementById("new");
        }else if (webSite == analyzeVideoDict.hxaa.baseUrl && otherData?.shortVideo == false){
            el = document.getElementsByClassName('play_video_zhec_2')[0]?.getElementsByClassName('play_video_1')[0] || document.getElementsByClassName('play_video_1')[0];
        }else if (webSite == analyzeVideoDict.hxaa.baseUrl && otherData?.shortVideo == true){
            el = document.getElementsByClassName('play_video_1')[0]?.getElementsByTagName('div')[0];
            document.getElementsByClassName('play_video_1')[0]?.getElementsByTagName('div')[0]?.setAttribute('data-fullscreen-container','true');
            document.getElementsByClassName('play_video_1')[0]?.getElementsByTagName('div')[0]?.setAttribute('style','width: 100%; z-index: 15; height: 100%;');
            //设置短视频标题影响不能拖动
            document.getElementsByClassName('play_video_1_2 ellipsis-2')[0]?.setAttribute('style','pointer-events: none');

        }
        console.log('第'+ playerContainerNums +'获取DPlayer播放器container容器定位：',el);
        if (el != null){playerContainerNums =0}
        return el;
    }

    //========================================================================================================================================================================
    //                      以下是播放器
    //========================================================================================================================================================================
    /*
       videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
       webSite:当前站点
    */
    function play_allVideo(videoDate, webSite) {
        // 添加视频显示地址
        showVideoUrlAddress(videoDate.videoUrl, webSite);
        // 这里判断一下 videoDate.el 是否存在，不存在在获取一次
        // if (videoDate.el == null ){
        //     videoDate.el = getPlayerContainer(webSite,{'shortVideo':shortVideo}) || setPlayerContainer(webSite,{'shortVideo':shortVideo});
        // }
        console.log(videoDate);
        if (window.dp) {
            window.dp.pause()
            window.dp.destroy()
            window.dp = null;
        }
        try{
            /* 2. 新增播放器 */
            window.dp = new DPlayer({
                container: videoDate.el,// 播放器容器元素
                autoplay: true,// 视频自动播放
                theme: '#FADFA3',// 主题色
                loop: true,// 视频循环播放
                lang: 'zh-cn',// 语言 en zh-cn zh-tw
                screenshot: true,// 开启截图
                hotkey: true,// 开启热键，支持快进、快退、音量控制、播放暂停
                preload: 'auto',// 视频预加载
                video: {
                    url: videoDate.videoUrl,
                    type: 'hls'
                },
                //                 pluginOptions:{
                //                     hls:{
                //                         xhrSetup: function(xhr, url){
                //                             xhr.open("GET", url, true);
                //                             xhr.setRequestHeader('referer','https://www.fi11sm307.com');
                //                         },
                //                         licenseXhrSetup: function(xhr, url, keyContext, licensChallenge){
                //                             xhr.withCredentials = true; // 运行请求携带cookies
                //                             xhr.open('GET', url, true);
                //                             xhr.setRequestHeader('Access-Control-Allow-Origin','*');

                //                         }
                //                     }
                //                 }
            });
            //=========================================================================================
            // 播放成功对数据初始化
            //=========================================================================================
            //删除提示
            clearInterval(intervalTipInfo);
            document.getElementById('add_tipInfo').remove();
            console.log('删除解析提示完成');
            // 清空错误异常
            typeError = null;
            // 清空视频地址定位次数
            playerContainerNums = 0;
            requestNums = 0;
            analyzeVideoIsStop = true;

            if (webSite == analyzeVideoDict.avPorn.baseUrl || webSite == analyzeVideoDict.avjb.baseUrl){
                clearInterval(changeTime);
            }
        }catch{
            throw new Error(errorDict.getPlayerContainerError);
        }
    }
    //========================================================================================================================================================================
    //                      以上是播放器
    //========================================================================================================================================================================


    //========================================================================================================================================================================
    //                      以下是初始参数
    //========================================================================================================================================================================
    // 一个页面只会加载一次
    var oldhref = location.href;
    //短视频ID
    var oldShortVideoId = null;
    // 是否为短视频
    var shortVideo = false;

    // 执行解析视频页面集合
    var analyzeVideoDict = {
        'hxc':{// 含羞草执行页面
            'baseUrl':'fi11','pc':'video', 'android':'detail-album', 'video':['/video','/detail-album'], 'shortVideo':['/detail-small-video', '/homeSmallVideo', '/smallVideo']
        },
        'avPorn':{ // avPorn执行页面
            'baseUrl':'theav','pc':'videos','video':['/videos'],'baseUrls':['theav','thepa']
        },
        'avjb':{ // avjb执行页面      0、该视频为VIP视频，请登录后查看登錄 可以用 document.scripts[4].text  m3u8类型视频   1、即刻注册，观看更多精彩视频。已有账号请登录会没有m3u8视频类型 2、免费视频直接观看
            'baseUrl':'bbav','baseUrl2':'bav','pc':'videos','video':['/videos']
        },
        'hxaa':{ // 红杏执行页面
            'baseUrl': 'hxaa', 'pc':'playvideo','android':'playvideo','video':['/playvideo'],'shortVideo':['/shotVideo'],'baseUrls':['hxaa','hxbb']
        },
        'madou':{
            'baseUrl': 'madou', 'pc':'','android':'','video':[''],'shortVideo':['']
        },
        '_91tv':{
            'baseUrl': '91TV', 'pc':'','android':'','video':[''],'shortVideo':['']
        },
        'maomi':{
            'baseUrl': 'b2', 'pc':'','android':'','video':[''],'shortVideo':[''], 'title':'Maomi'
        }
    };

    // 执行对应的网站站点
    var executeWebSite = null;

    // 当前页面setInterval循环的次数；
    var times = 0;

    // 视频解析显示定时器;
    var intervalTipInfo = null;

    // 获取视频播放器定位元素执行次数, 超过十次将提示错误
    var playerContainerNums = 0;

    // 请求次数，超过 20 次将提示错误
    var requestNums = 0;

    // 异常参数
    var typeError = null; // DPlayerContainerError 播放器位置异常
    // 异常字典处理
    var errorDict = {
        'getPlayerContainerError':'获取播放视频元素位置异常',
        'getPlayerContainer10Error':'获取视频播放元素失败超过10次失败，请点击视频地址链接播放',
        'sendRequestError':'发起请求出现错误',
        'sendRequestTimeoutError':'获取视频链接请求超时',
        'AccountError':'账号异常',
        'RequestVideoUrlError':'获取视频URL失败',

    }
    // GM_setValue 键值初始化
    var gmSetDataKey = {
        'hxaa':{
            'accountConfig':{key:'accountConfig',value:''},
            'createAccountNums':{key:'createAccountNums', value:200}, //创建账号数
            'succAccountNums':{key:'succAccountNums', value:0},
            'HongxingAccount':{key:'HongxingAccount', value:0},// 账号存储key，默认HongxingAccount+1、2、3、4
            'isCrossDay':{key:'isCrossDay', value:(new Date()).toLocaleDateString()}, // 是否跨日
            'todayRequestNums':{key:'todayRequestNums', value:0}, //当天请求次数
        }
    };



    //========================================================================================================================================================================
    //                      以上是初始参数
    //========================================================================================================================================================================
    //document.querySelector('meta[name="referrer"]').content = 'origin';
    var changeTime = null;
    var analyzeVideoIsStop = true;
    changeTime = setInterval(function () {
        if (analyzeVideoIsStop){ //在调用中就不执行了
            analyzeVideoIsStop = false;
            // 第一步：获取当前访问的浏览器路径，判断是否属于所需要解析的网址，
            // 第二步：为播放视频详情页才需要执行，其他页面不执行
            let monitorUrl = location.href;
            //========================================================================================================================================================================
            if (location.host.indexOf(analyzeVideoDict.hxc.baseUrl)!= -1){
                // 长视频
                if (location.host.indexOf(analyzeVideoDict.hxc.baseUrl)!= -1 && analyzeVideoDict.hxc.video.find(e => location.pathname.indexOf(e)!= -1)){
                    // 当前网站站点
                    executeWebSite = analyzeVideoDict.hxc.baseUrl;
                    console.log("当前执行网站站点"+executeWebSite,"执行播放为长视频", '旧路径：'+oldhref,'新路径：'+monitorUrl);
                    // 执行播放长视频 去除短视频数据信息
                    shortVideo = false;
                    oldShortVideoId = null;
                    // 删除提示广告
                    delLongVideoGG();
                    if (monitorUrl != oldhref || times == 0){
                        console.log("解析视频开始");
                        // 解析时间提示
                        console.log('解析时间提示开启');
                        showTopInfo();
                        // 发起请求，获取视频返回链接
                        // OWNhOGQ4NDk1MzcxNDFiNGFmMWM5OGIxOTUxYjM0NWN8MzkzODM4OTEwfFA=
                        //play('OWNhOGQ4NDk1MzcxNDFiNGFmMWM5OGIxOTUxYjM0NWN8MzkzODM4OTEwfFA=');

                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};

                        videoDate.el = getPlayerContainer(executeWebSite,{'shortVideo':shortVideo});

                        requireGetVideoUrl(executeWebSite, videoDate);
                    }else{analyzeVideoIsStop = true;}
                }
                // 含羞草短视频处理
                else if (location.host.indexOf(analyzeVideoDict.hxc.baseUrl)!= -1 && analyzeVideoDict.hxc.shortVideo.find(e => location.pathname.indexOf(e)!= -1)){
                    // 当前网站站点
                    executeWebSite = analyzeVideoDict.hxc.baseUrl;
                    // 标记为短视频
                    shortVideo = true;

                    // 存在提示VIP限制才执行短视频播放
                    if(document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-active')[0] != null ||
                       document.getElementsByClassName('small-video-txt-see')[0] != null ||
                       typeError == "DPlayerContainerError"
                      ){
                        console.log("当前执行网站站点"+executeWebSite,"执行播放为短视频", '旧路径：'+oldhref,'新路径：'+monitorUrl, "视频ID：" + oldShortVideoId);
                        // 获取播放的ID
                        let monitorShortVideoId = null;
                        if (document.getElementsByClassName('small-video-txt-see')[0] != null ){
                            monitorShortVideoId = document.getElementsByClassName('swiper-slide swiper-slide-active')[0].getElementsByTagName('div')[1].id;
                        }else{
                            monitorShortVideoId = document.getElementsByClassName('swiper-slide swiper-no-swiping swiper-slide-active')[0].getElementsByTagName('div')[1].id;
                        }
                        // 处理广告
                        console.log('删除VIP广告提示');
                        delShortVideoGG();
                        if (monitorShortVideoId != oldShortVideoId){
                            oldShortVideoId = monitorShortVideoId;
                            // 解析时间提示
                            showTopInfo();
                            console.log('试看上限，开始处理短视频','当前ID为'+oldShortVideoId,'当前播放短视频有更新')
                            // 播放视频
                            //play('OWNhOGQ4NDk1MzcxNDFiNGFmMWM5OGIxOTUxYjM0NWN8MzkzODM4OTEwfFA=')

                            // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                            let videoDate = {};
                            videoDate.el = getPlayerContainer(executeWebSite,{'shortVideo':shortVideo,'oldShortVideoId':oldShortVideoId});
                            requireGetVideoUrl(executeWebSite, videoDate);
                        }
                    }
                    else{analyzeVideoIsStop = true;}
                }else{analyzeVideoIsStop = true;}
            }
            //========================================================================================================================================================================
            else if (analyzeVideoDict.avPorn.baseUrls.find(url => location.host.indexOf(url)!= -1) && analyzeVideoDict.avPorn.video.find(e => location.pathname.indexOf(e)!= -1)){
                // 当前网站站点
                executeWebSite = analyzeVideoDict.avPorn.baseUrl;
                console.log("当前执行网站站点"+executeWebSite,"执行播放视频", '旧路径：'+oldhref,'新路径：'+monitorUrl);

                //去掉广告
                delavPornVideoGG();

                if (monitorUrl != oldhref || times == 0){
                    // 如果当前获取id=new失败，表示avPron拒绝片段,成为VIP,即刻解锁全站影片
                    if (document.getElementById('new') == null){
                        console.log('avPron拒绝片段,成为VIP,即刻解锁全站影片');
                        // 解析时间提示
                        showTopInfo();
                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};
                        videoDate.el = getPlayerContainer(executeWebSite,{});
                        requireGetVideoUrl(executeWebSite, videoDate);

                    }
                    else{// 存在表示可以播放，直接获取URL进行播放
                        console.log('存在视频播放');
                        // 获取视频URL
                        let videoUrlList = null;
                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};
                        if (player.api("hls").url != null ){
                            videoUrlList = player.api("hls").url.split('?');
                            if(videoUrlList.length == 1){
                                console.log('正常视频，无需解析');
                                showVideoUrlAddress(videoUrlList[0], executeWebSite);
                                // 结束
                                clearInterval(changeTime);
                                analyzeVideoIsStop = true;
                            }else{
                                // 解析时间提示
                                showTopInfo();
                                console.log('片段视频，重新解析');
                                // 片段视频，获取真实视频地址
                                videoDate.videoUrl = videoUrlList[0]/*+"?"+videoUrlList[1]*/;
                                //视频显示地址
                                videoDate.el = getPlayerContainer(executeWebSite,{});
                                // 执行
                                play_allVideo(videoDate, executeWebSite);
                            }
                        }else{
                            // 没有URL则发起请求获取
                            // 解析时间提示
                            showTopInfo();
                            // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                            let videoDate = {};
                            videoDate.el = getPlayerContainer(executeWebSite,{});
                            requireGetVideoUrl(executeWebSite, videoDate);
                        }
                    }
                }
                else{analyzeVideoIsStop = true;}
            }
            //========================================================================================================================================================================
            else if ((location.host.indexOf(analyzeVideoDict.avjb.baseUrl)!= -1 || location.host.indexOf(analyzeVideoDict.avjb.baseUrl2)!= -1)
                     && analyzeVideoDict.avjb.video.find(e => location.pathname.indexOf(e)!= -1)){
                // 当前网站站点
                executeWebSite = analyzeVideoDict.avjb.baseUrl;
                console.log("当前执行网站站点"+executeWebSite,"执行播放视频", '旧路径：'+oldhref,'新路径：'+monitorUrl);
                if (monitorUrl != oldhref || times == 0){
                    // 删除广告
                    delAvjbVideoGG();
                    // 如果从当前页面head里获取到m3u8格式的播放路径,mp4格式不处理了
                    if (document.documentElement.outerHTML.indexOf('new Playerjs({') != -1 &&
                        document.documentElement.outerHTML.indexOf('index.m3u8",') != -1
                       ){
                        // oframeiplayer 不为空，表示当前可以播放，为空，表示需要替换视频
                        if ( document.getElementById('oframeiplayer') == null ){
                            console.log('存在视频链接，处理视频解析开始');
                            // 解析时间提示
                            showTopInfo();
                            // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                            let videoDate = {};

                            /* 匹配值
                        var player = new Playerjs({
                            id:"player",
                            file : "/mod/time.php?key=https://d12q3lbk1af983.cloudfront.net/20211230/kc1jaUnP/index.m3u8",
                            poster:"https://ajb.cdn.avstatic.com/cdn/contents/videos_screenshots/4000/4141/preview.jpg",
                        });
                        var player = new Playerjs({
                            id:"player",
		                    file : "https://d3ma0fqepvymei.cloudfront.net/contents/videos/28000/28986/28986video_limt.mp4",
  		                    poster:"https://ajb.cdn.avstatic.com/cdn/contents/videos_screenshots/28000/28986/preview.jpg",
                        });
                        */
                            for (let e of document.scripts) {
                                if(e.text.indexOf('m3u8') != -1){
                                    if (e.text.indexOf('key=') != -1){
                                        videoDate.videoUrl = e.text.split('key=')[1].split('index.m3u8')[0] + 'index.m3u8';
                                    }else{
                                        videoDate.videoUrl = e.text.replaceAll(' ','').split('file:"')[1].split('index.m3u8')[0] + 'index.m3u8';
                                    }
                                    break;
                                }
                                // else if(e.text.indexOf('mp4",') != -1){
                                //     if (e.text.indexOf('key=') != -1){
                                //         videoDate.videoUrl = e.text.split('key=')[1].split('.mp4')[0] + '.mp4';
                                //     }else{
                                //         videoDate.videoUrl = e.text.replaceAll(' ','').split('file:"')[1].split('.mp4')[0] + '.mp4';
                                //     }
                                //     break;
                                // }
                            }
                            // 获取播放元素
                            videoDate.el = getPlayerContainer(executeWebSite,{});
                            // 执行解析
                            play_allVideo(videoDate, executeWebSite);
                        }else{
                            /*
                        var player = new Playerjs({
                            id: "iplayer",
                            file: "https://d3ma0fqepvymei.cloudfront.net/contents/videos/25000/25263/index.m3u8",
                            poster: "https://ajb.cdn.avstatic.com/cdn/contents/videos_screenshots/25000/25263/preview.jpg",

                        });
                        */
                            console.log('正常视频可以播放');
                            // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                            let videoDate = {};
                            for (let e of document.scripts) {
                                if(e.text.indexOf('m3u8') != -1){
                                    if (e.text.indexOf('key=') != -1){
                                        videoDate.videoUrl = e.text.split('key=')[1].split('index.m3u8')[0] + 'index.m3u8';
                                    }else{
                                        videoDate.videoUrl = e.text.replaceAll(' ','').split('file:"')[1].split('index.m3u8')[0] + 'index.m3u8';
                                    }
                                    break;
                                }
                                // else if(e.text.indexOf('mp4",') != -1){
                                //     if (e.text.indexOf('key=') != -1){
                                //         videoDate.videoUrl = e.text.split('key=')[1].split('.mp4')[0] + '.mp4';
                                //     }else{
                                //         videoDate.videoUrl = e.text.replaceAll(' ','').split('file:"')[1].split('.mp4')[0] + '.mp4';
                                //     }
                                //     break;
                                // }
                            }
                            //添加视频链接地址
                            showVideoUrlAddress(videoDate.videoUrl, executeWebSite)
                            analyzeVideoIsStop = true;
                        }
                    }
                    // 获取不到直接开始处理
                    else{
                        // 获取当前视频请求路径：document.head.querySelector('meta[property="og:video"]').content
                        console.log('不存在视频链接，解析视频开始');
                        // 解析时间提示
                        showTopInfo();

                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};
                        videoDate.el = getPlayerContainer(executeWebSite,{});
                        requireGetVideoUrl(executeWebSite, videoDate);
                    }
                }else{analyzeVideoIsStop = true;}
            }
            //========================================================================================================================================================================
            else if (location.host.indexOf(analyzeVideoDict.hxaa.baseUrl)!= -1 || analyzeVideoDict.hxaa.baseUrls.find(url => location.host.indexOf(url)!= -1)){
                // 曲线救视频法，判断当前是否存有hxaa账户数据，没有就执行
                initBase(analyzeVideoDict.hxaa.baseUrl);
                // 删除提示广告
                delHxaaVideoGG();
                // 长视频
                if (analyzeVideoDict.hxaa.video.find(e => location.href.indexOf(e)!= -1)){
                    // 当前网站站点
                    executeWebSite = analyzeVideoDict.hxaa.baseUrl;
                    console.log("当前执行网站站点"+executeWebSite,"执行播放为长视频", '旧路径：'+oldhref,'新路径：'+monitorUrl,'每日短视频请求',JSON.stringify(GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key)));
                    // 执行播放长视频 去除短视频数据信息
                    shortVideo = false;
                    oldShortVideoId = null;

                    if (monitorUrl != oldhref || times == 0){
                        console.log("解析视频开始");
                        // 解析时间提示
                        console.log('解析时间提示开启');
                        showTopInfo();

                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};

                        videoDate.el = getPlayerContainer(executeWebSite,{'shortVideo':shortVideo});

                        requireGetVideoUrl(executeWebSite, videoDate);
                    }else{analyzeVideoIsStop = true;}
                }
                // 红杏短视频处理
                else if(analyzeVideoDict.hxaa.shortVideo.find(e => location.href.indexOf(e)!= -1)){
                    // 当前网站站点
                    executeWebSite = analyzeVideoDict.hxaa.baseUrl;
                    // 标记为短视频
                    shortVideo = true;
                    console.log('短视频','每日短视频请求',JSON.stringify(GM_getValue(gmSetDataKey.hxaa.todayRequestNums.key)))
                    // 存在提示则需要处理
                    if (document.querySelector('div[role="dialog"]')?.style.display == ''){
                        // 解析时间提示
                        console.log('解析时间提示开启');
                        showTopInfo();

                        // 除去提示
                        document.querySelector('div[role="dialog"]').style.display = 'none';
                        document.getElementsByClassName('van-overlay')[0].style.display = 'none';

                        // videoDate:{videoUrl：视频地址, el：播放器加载位置, showVideoAddress: 地址显示位置 }
                        let videoDate = {};

                        videoDate.el = getPlayerContainer(executeWebSite,{'shortVideo':shortVideo});
                        requireGetVideoUrl(executeWebSite, videoDate);
                    }else{
                        analyzeVideoIsStop = true;
                    }
                }
                //
                else{analyzeVideoIsStop = true;}
            }
            //========================================================================================================================================================================
            else if (location.host.indexOf(analyzeVideoDict.madou.baseUrl)!= -1 ){
                // 当前网站站点
                executeWebSite = analyzeVideoDict.madou.baseUrl;
                console.log("当前执行网站站点"+executeWebSite, '旧路径：'+oldhref,'新路径：'+monitorUrl);
                if (localStorage.getItem('token') == null || localStorage.getItem('token') == ''){
                    localStorage.setItem('token','"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc19jaGVja19pbiI6ZmFsc2UsInRvdGFsX2NoZWNrX2luIjowLCJhZGRfdGltZXMiOjAsInVpZCI6ODkxNjQsInZpcF9sZXZlbCI6MCwidmFsaWRhdGVfdGltZSI6bnVsbCwiZW1haWwiOiIiLCJ1c2VybmFtZSI6IjE1NzY2OTM2MTEwIiwic2hhcmVfY29kZSI6IkowV1A5IiwidmlwX2RvbWFpbiI6IiIsImlhdCI6MTY4NzMxNjk1OCwiZXhwIjoxNjg3NDAzMzU4fQ.ecjkMpByOmK2PUBjVNsl3j38T3DxpLg8SxoEDvwg1MU"');
                }
                if (localStorage.getItem('vip_level') == null || localStorage.getItem('vip_level') != 1){
                    console.log('当前 vip_level 为：',localStorage.getItem('vip_level'))
                    localStorage.setItem('vip_level',1);
                }
                analyzeVideoIsStop = true;
                //clearInterval(changeTime);
            }
            //========================================================================================================================================================================
            else if (document.querySelector('meta[name="keywords"]')?.content.toUpperCase() == analyzeVideoDict._91tv.baseUrl){
                // 当前网站站点
                executeWebSite = analyzeVideoDict.madou.baseUrl;
                console.log("当前执行网站站点"+executeWebSite, '旧路径：'+oldhref,'新路径：'+monitorUrl);
                if (localStorage.getItem('token') == null || localStorage.getItem('token') == ''){
                    localStorage.setItem('token','"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc19jaGVja19pbiI6ZmFsc2UsInRvdGFsX2NoZWNrX2luIjowLCJhZGRfdGltZXMiOjAsInVpZCI6MTI1MjYwNjksInZpcF9sZXZlbCI6MCwidmFsaWRhdGVfdGltZSI6bnVsbCwiZW1haWwiOiIiLCJ1c2VybmFtZSI6IjE1NzY2OTM2MTEwIiwic2hhcmVfY29kZSI6ImZvZmZKIiwidmlwX2RvbWFpbiI6IiIsImlhdCI6MTY4NzMxOTA4MiwiZXhwIjoxNjg3NDA1NDgyfQ.IqKlF5oO1hg7XkFASMH2uuh04AxguOJUYULfrGoCP5s"');
                }
                if (localStorage.getItem('vip_level') == null || localStorage.getItem('vip_level') != 1){
                    console.log('当前 vip_level 为：',localStorage.getItem('vip_level'))
                    localStorage.setItem('vip_level',1);
                }
                analyzeVideoIsStop = true;
            }
            //========================================================================================================================================================================
            else if (document.querySelector('title').text.indexOf(analyzeVideoDict.maomi.title)!= -1){
                // 当前网站站点
                executeWebSite = analyzeVideoDict.madou.baseUrl;
                console.log("当前执行网站站点"+executeWebSite, '旧路径：'+oldhref,'新路径：'+monitorUrl);
                // 删除广告
                delMaomiVideoGG();
                document.querySelectorAll("div.content-item  a.video-pic")?.forEach( a => {a.href = a.href.replace("/vip/play-","/shipin/detail-")});
                analyzeVideoIsStop = true;
                clearInterval(changeTime);
            }
            // 未匹配上就释放
            else{
                console.log("未匹配上网站");
                analyzeVideoIsStop = true;
                clearInterval(changeTime);
            }

            oldhref = monitorUrl;
            times++;
            //console.log("当前重复调用次数"+times);
        }
    }, 2500);


    //========================================================================================================================================================================
    //                      以下是菜单配置
    //========================================================================================================================================================================

    if (analyzeVideoDict.hxaa.baseUrls.find(url => location.host.indexOf(url)!= -1) ){
        GM_registerMenuCommand ("红杏账号导出", function(){
            let accountDict = '';
            for (let key of GM_listValues()) {
                if (key.indexOf(gmSetDataKey.hxaa.HongxingAccount.key)!= -1){
                    let acc = GM_getValue(key);
                    accountDict += `${key}账号:${acc.phone.padEnd(30)}密码:${acc.password} \r\n`
                }
            }
            let Hongxing_eleLink = document.createElement('a');
            Hongxing_eleLink.download =`红杏账号导出${(new Date().toLocaleDateString()).replaceAll('/','-')}.txt`;
            Hongxing_eleLink.style.display = 'none';
            var blob = new Blob([accountDict],{type:"text/plain;charset=utf-8"});
            Hongxing_eleLink.href = URL.createObjectURL(blob);
            //触发点击
            document.body.appendChild(Hongxing_eleLink);
            Hongxing_eleLink.click();
            //然后移除
            document.body.removeChild(Hongxing_eleLink);
        });

        GM_registerMenuCommand ("红杏账号限制解除", function(){
            if(GM_getValue(gmSetDataKey.hxaa.accountConfig.key) == null){
                alert('未进行过红杏配置初始化，无需解除');
            }else{
                let orginData = GM_getValue(gmSetDataKey.hxaa.accountConfig.key);
                orginData[gmSetDataKey.hxaa.createAccountNums.key] = 99999;
                // 修改配置
                GM_setValue(gmSetDataKey.hxaa.todayRequestNums.key,orginData);
            }
        });

        GM_registerMenuCommand ("红杏配置重置[将删除已申请账号数据]", function(){
            for (let key of GM_listValues()) {
                GM_deleteValue(key);
            }
        });
    }

    //========================================================================================================================================================================
    //                      以上是菜单配置
    //========================================================================================================================================================================


    //========================================================================================================================================================================
    //                      以下是异常补抓
    //========================================================================================================================================================================
    // 脚本出错异常补抓
    window.onerror = function(message, source, lineno, colno, error) {
        console.log('捕获到异常：',{message, source, lineno, colno, error});
        // 如果出现"Uncaught TypeError: Cannot read properties of null (reading 'classList')"   视频定位元素获取重置url，重新执行一遍
        if (errorDict.getPlayerContainerError == message.error.message){
            if (playerContainerNums <=10){
                oldhref = null;
                analyzeVideoIsStop = true;
                typeError = "DPlayerContainerError";
            }else{
                message.error.message = errorDict.getPlayerContainer10Error
                showErrorInfo(message);
            }

        }else if (errorDict.getPlayerContainer10Error == message.error.message||
                  errorDict.sendRequestError == message.error.message||
                  errorDict.sendRequestTimeoutError == message.error.message){
            showErrorInfo(message);
        }
        else{
            console.log('未定义的其他异常信息', message);
        }
    }

    function showErrorInfo(message){
        clearInterval(intervalTipInfo);
        clearInterval(changeTime);
        if (document.getElementById('add_tipInfo') == null){
            let tipInfodiv = document.createElement('div');
            tipInfodiv.innerHTML = `<div id="add_tipInfo" style="position:fixed;top:25%;width:100%;z-index:99999999;color:red;font-size:24px;text-align:center;font-weight:bold"></div>`;
            document.querySelector("head").after(tipInfodiv);
        }
        document.getElementById('add_tipInfo').innerText = `解析失败了（10秒后自动隐藏）：` + message.error.message;

        setTimeout(function(){
            document.getElementById('add_tipInfo').remove()
        }, 10000 );
    }
})();