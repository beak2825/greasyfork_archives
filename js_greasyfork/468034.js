// ==UserScript==
// @name         泰生活更新CDN和泰生活IOS方法返回
// @namespace    http://tampermonkey.net/
// @version      0.1.17
// @description  泰生活用于填充cdn更新内容和泰生活IOS方法返回
// @author       zhangxx138
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAABpElEQVR4nO3Vv2uUQRDG8c/ebSMWqay0trATAxrUSi1S2AiWFoJYpNCgoBjURsHWJKeNRfAvsDgFixQqKdPZ2ViEiCJYBOQu8f1hEXO59713j7MUfLZ6d2a/O8vMO0OzDnin9Ku2Mjvuaw07xgSAYEVXe2indMhj92zpKJLnBhF8MDeye9hn6zbN70eRiqCw02Bra3up8BBLu1FEBxsBucXqW4csz0ULe4jorSCMuPU89boRELDMHiI6Y8V65bbCUTccc70RkaOwKLOg0IkyXa9qTjOu2LAs6NZuD86hrdTyxRNTkUqqdhXlHrngGRVEZsMpJwex9DxIZSHYclesIb65LCoHgIs66UJq6btDBZHZrPh8V6YBOX66LbOkTGckBYimBW2FVTNeuOZNyrFJ236Yl4NSy5SbVm1PDvhodqgyMledTdRlAtDzqfL9tfkwUtyaRkv9LwFj9B/w7wPycXOhqlJ0yZHKPChMi5MCiM47XhsopbVJAUHfrYbmN/EToN+02eLPfz9OYyZhFJzW1Jn3lTsxaKQjCkp52jy45r1ZvSbTb9M0d4PBozGZAAAAAElFTkSuQmCC
// @run-at       document-start
// @match        https://console.cloud.tencent.com/*
// @match        https://medicaluat.mobile.taikang.com/*
// @match        https://tklifetest.mobile.taikang.com/*
// @match        https://dentalgmall500.taikang.com/*
// @match        https://dentalmbybo500.taikang.com/*
// @match        https://pointsit500.taikang.com/*

// @match        https://tlifehealth.taikang.com/*
// @match        https://operation.mobile.taikang.com/*
// @match        https://operation.taikang.com/*
// @match        https://tklife.mobile.taikang.com/*
// @match        https://tshmall.wanyuhengtong.com/*
// @match        https://point.taikang.com/*
// @match        http://localhost/*
// @match        https://localhost/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468034/%E6%B3%B0%E7%94%9F%E6%B4%BB%E6%9B%B4%E6%96%B0CDN%E5%92%8C%E6%B3%B0%E7%94%9F%E6%B4%BBIOS%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/468034/%E6%B3%B0%E7%94%9F%E6%B4%BB%E6%9B%B4%E6%96%B0CDN%E5%92%8C%E6%B3%B0%E7%94%9F%E6%B4%BBIOS%E6%96%B9%E6%B3%95%E8%BF%94%E5%9B%9E.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 刷新CDN
    if (location.hostname == 'console.cloud.tencent.com') {
        var id1 = 'cdn-my-test1'
        var id2 = 'cdn-my-test2'
        var $dom = document.createElement('div');
        $dom.id = id1;
        $dom.innerText = '健康cdn';
        document.body.appendChild($dom);
        var $dom2 = document.createElement('div');
        $dom2.id = id2;
        $dom2.innerText = '首页cdn';
        document.body.appendChild($dom2);
        var style = document.createElement('style');

        style.type = 'text/css';

        style.textContent = `
          #cdn-my-test1{
            position: fixed;
            right: 20px;
            bottom: 120px;
            z-index: 9999;
            width: 60px;
            height: 60px;
            line-height: 60px;
            border-radius: 50%;
            font-size: 12px;
            border: 1px solid #f00;
            text-align: center;
            color: #000;
            background-color: #ccc;
          }
          #cdn-my-test2{
            position: fixed;
            right: 20px;
            bottom: 40px;
            z-index: 9999;
            width: 60px;
            height: 60px;
            line-height: 60px;
            border-radius: 50%;
            font-size: 12px;
            border: 1px solid #f00;
            text-align: center;
            color: #000;
            background-color: #ccc;
          }
        `;
        function changeFn (str) {
            var list = document.getElementsByClassName('app-cdn-textarea')
            for (let i = 0; i < list.length; i++) {
                list[i].value = str
                var keyDownEvent = new KeyboardEvent('keydown', {
                    'keyCode': 13,
                    'bubbles': true,
                    'cancelable': true
                });
                list[i].dispatchEvent(keyDownEvent);
            }
        }
        document.getElementsByTagName('HEAD').item(0).appendChild(style);
        setTimeout(() => {
            var myTimer = setInterval(() => {
                var $dom = document.querySelector('.app-cdn-textarea');
                if ($dom) {

                    clearInterval(myTimer);
                    document.getElementById(id1).style.cssText =
                        'background-color: #fff;cursor: pointer;';
                    document.getElementById(id1).addEventListener('click', function (e) {
                        changeFn(`https://tlifehealth.taikang.com`)
                    });
                    document.getElementById(id2).style.cssText =
                        'background-color: #fff;cursor: pointer;';
                    document.getElementById(id2).addEventListener('click', function (e) {
                        changeFn(`https://tklife.mobile.taikang.com
https://operation.mobile.taikang.com`);
                    });
                }
            }, 500);
        }, 1000);
    }

    if (['localhost', 'medicaluat.mobile.taikang.com', 'tklifetest.mobile.taikang.com', 'dentalgmall500.taikang.com', 'dentalmbybo500.taikang.com', 'pointsit500.taikang.com', 'tlifehealth.taikang.com', 'operation.mobile.taikang.com', 'operation.taikang.com', 'tklife.mobile.taikang.com', 'tshmall.wanyuhengtong.com', 'point.taikang.com'].includes(location.hostname)) {
        var ua = navigator.userAgent.toLowerCase()
        if (
            !/TSH-iOS/i.test(ua)) { // 泰生活 ios) 
            return false;
        }
        // 保险的页面，会取本地的缓存
        localStorage.clear();
        sessionStorage.clear();

        var token = null;

        window.webkit = {
            messageHandlers: {
                NativeFunction: {
                    postMessage: async (paramsStr) => {

                        const obj = JSON.parse(paramsStr)
                        console.log('调用原生IOS的方法参数：', obj)
                        /**
                        callback: "setNavigationBarColor2"
                        command: "setNavigationBarColor"
                        parameter: {backgroundColor: '#FFFFFF'}
                         * 
                        */
                        var callbackData = {
                            data: '',
                            code: '0'
                        }
                        //解析各种方法 
                        // 不用回调的方法（纯设置原生的方法，返回啥都行的）
                        if (['hideNavAction', 'setNavigationBarColor', 'closePage', 'closePageAction', 'gobackAction', 'startRealName', 'setPopGestureForIOS', 'setWebViewBounces', 'MiniProgramAPM', 'backOrClose', 'changeDisplayMode', 'onPageStart', 'onAppEnterForeground', 'onBackPressed', 'onAppEnterBackground', 'onShow', 'showNavRightButtonAction', 'changeStatusBarTransparent', 'showNavAction', 'showsVerticalScrollIndicator'].includes(obj.command)) {
                            callbackData.data = true
                        }
                        // 自定义返回结果的
                        if (['startBusinessDetailPage', 'startHealthMianfeiwenzhen', 'openNativePage', 'startVipRightsKehujingli', 'startVipRightsTijianyuyue', 'startVipRightsACTijianyuyue', 'wealthEquityDetail', 'toChooseCity', 'miniOCRBaseUrl', 'newImageSelector', 'startBaseInformationPage', 'startBusinessProgress', 'startPolicySchedulePage', 'dismissPageAction', 'newChangePersonTelephone', 'downloadUpdateApp', 'changeAddress', 'faceLivenessRecognitionService', 'faceRecognitionService', 'insuranceFaceVerification', 'insuranceFaceMultipleIdentificationVerification', 'startRecommendManager', 'commonShortLink', 'openSpeechInput', 'compressImage', 'showNativeInputLayout', 'hideNativeInputLayout', 'onVoiceInputClickKeyBoard', 'onVoiceInputClickKeyEmoji', 'onVoiceInputClickKeyPLus', 'onShowVoiceAnimatorArea', 'onHideVoiceAnimatorArea', 'onReceiveVoiceInputData', 'startUpLoadTask', 'systemNotificationPopupNew', 'startPrivateDataUnlock', 'startUpLoadTask'].includes(obj.command)) {
                            var otherStr = window.prompt("暂不支持" + obj.command + "，自定义的返回结果：", '{"code":"0","data":true}');
                            callbackData = JSON.parse(otherStr)
                        }
                        // 需要回调的方法
                        // 登录
                        if (obj.command == 'loginService' || obj.command == 'loginServiceV2') {
                            token = token ? token : 'Bearer ' + await getToken()
                            callbackData.data = '已登录'
                            callbackData.token = token
                        }

                        // 获取token
                        if (obj.command == 'userJWTService') {
                            token = token ? token : 'Bearer ' + await getToken()
                            callbackData.data = {
                                token: token
                            }
                            // callbackData.token = token
                        }

                        // 获取设备信息
                        if (obj.command == 'deviceInfoService') {
                            callbackData.data = {
                                "mobileType": "iPhone13,2",
                                "deviceId": "E7CFD549-DE69-4E65-97E7-78AD39FC2C1A",
                                "systemVersion": "16.4.1",
                                "mobileBrand": "iPhone",
                                "appVersion": "6.32.0",
                                "terminalType": "IOS"
                            }
                        }
                        // 获取设备信息
                        if (obj.command == 'getSystemInfo') {
                            callbackData.data = { "safeArea": { "right": "0.0", "height": "763.0", "top": "47.0", "width": "390.0", "left": "0.0", "bottom": "34.0" }, "version": "6.32.0", "system": "iOS 16.4.1", "inHera": true, "windowHeight": "844.0", "deviceId": "E7CFD549-DE69-4E65-97E7-78AD39FC2C1A", "pixelRatio": "3.0", "screenHeight": "844.0", "SDKVersion": "2.6.0", "language": "zh_CN", "platform": "iOS", "windowWidth": "390.0", "model": "iPhone 12", "screenWidth": "390.0" }
                        }
                        // 关闭当前页面
                        if (['closePageAction', 'closePage'].includes(obj.command)) {
                            window.close()
                        }
                        // 返回上一个页面
                        if (['backOrClose', 'gobackAction'].includes(obj.command)) {
                            window.go(-1)
                        }
                        // 实名
                        if (obj.command == 'startRealName') {
                            alert('实名需要到   真实的原生页面才能实现')
                            callbackData.data = true
                        }
                        // 调用原生拍照功能
                        if (obj.command == 'routerService') {
                            alert('调用原生测气血   真实的原生页面才能实现')
                            callbackData.data = true
                        }
                        // 进入系统设置的泰生活通知设置页
                        if (obj.command == 'openMessageSettings') {
                            alert('模拟进入系统设置的泰生活通知设置页 成功')
                            callbackData.data = true
                        }
                        // 通过跳转h5调取原生支付
                        if (obj.command == 'pushH5pay') {
                            alert('通过跳转h5调取原生支付   真实的原生页面才能实现')
                            callbackData.data = true
                        }
                        //打开新页面
                        if (obj.command == 'startWebPage') {
                            callbackData.data = true
                            window.open(obj.parameter.url)
                        }
                        //查看pdf
                        if (obj.command == 'showPDF') {
                            callbackData.data = true
                            window.open(obj.parameter.url)
                        }
                        // 下载
                        if (obj.command == 'downloadHealthFile') {
                            callbackData.data = true
                            alert('模拟downloadHealthFile下载完成')
                        }
                        // 下载pdf
                        if (obj.command == 'downloadHealthFileV2') {
                            callbackData.data = true
                            alert('模拟downloadHealthFileV2下载完成')
                        }
                        // 处理原生url：startAppPage
                        if (obj.command == 'startAppPage') {
                            callbackData.data = true
                            alert('模拟 startAppPage 完成')
                        }
                        // 处理原生URL：startHome
                        if (obj.command == 'startHome') {
                            callbackData.data = true
                            alert('模拟 startHome 完成')
                        }
                        // 扫码
                        if (obj.command == 'QRCodeScanService' || obj.command == 'scanService') {
                            var QRCodeScanServiceStr = window.prompt("返回获取视频自动播放设置：", ' {"result": "https://www.baidu.com","code":"0"}');
                            callbackData = JSON.parse(QRCodeScanServiceStr)
                        }
                        // 选择图片
                        if (obj.command == 'chooseImage' || obj.command == 'toCamera' || obj.command == 'toPhotoAlbum') {
                            callbackData = { "data": { "localIds": ["tfile://tmp_3AE31B0E957CA6965E2AC7C395579A74.jpeg"], "localFiles": [{ "size": 1045078, "type": "image/jpeg", "orientation": "right", "width": 3024, "height": 4032, "localId": "tfile://tmp_3AE31B0E957CA6965E2AC7C395579A74.jpeg" }] }, "code": 0 }
                        }
                        // 选择PDF
                        if (obj.command == 'chooseFilePDF' || obj.command == 'healthAddPDFFile') {
                            callbackData = { "data": { "fileSize": 38975, "fileName": "pdf小.pdf", "state": "success", "filePath": "tfile://tmp_A290B1C31DB887A3D7E21C4830C2CBBF.pdf" }, "code": 0 }
                        }
                        // 上传返回
                        if (obj.command == 'uploadFile') {
                            // pdf 链接
                            if (obj.parameter.filePath.indexOf('pdf') > -1) {
                                var pdfCallBack = window.prompt("上传的结果,默认直接点确认：", '{ "data": { "code": "2000", "status": null, "data": { "limitFileUrl": "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId=Sm12cit2c1MrTnV3V0NoTllqSEFSU1E3T0UxeG8wNFp3eHdhUTVqeFF5Rmg0VUtObFd4bDROL3AvVlJiQXNGVw==@TL", "fileId": "3486e4b2db944db281c9fdba705f9c78", "fileUrl": "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId=3486e4b2db944db281c9fdba705f9c78", "fileRepoEntity": { "suffix": "pdf", "storageCode": "common", "format": null, "limitFileUrl": null, "size": "38.06KB", "storageChannel": "qingStor", "type": "image", "storageKey": "3272d97e-d36e-49c7-92b6-2c55465a726b", "name": "ecd9faa74cdd406cbaf08f32cbd83783.pdf", "fileUrl": null }, "fileRepo": { "suffix": "pdf", "storageCode": "common", "id": "3486e4b2db944db281c9fdba705f9c78", "size": "38.06KB", "storageChannel": "qingStor", "storageKey": "3272d97e-d36e-49c7-92b6-2c55465a726b", "type": "image", "createTime": 1733109323000, "name": "ecd9faa74cdd406cbaf08f32cbd83783.pdf" } }, "msg": "success" }, "statusCode": 0 }');
                                callbackData = JSON.parse(pdfCallBack)
                            } else {
                                // 图片 链接
                                var picCallBack = window.prompt("上传的结果,默认直接点确认", '{ "data": { "code": "2000", "status": null, "data": { "limitFileUrl": "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId=RlBOMFNnVFFmU1JOR3Ywd0RVWFlsZjB0cjNSVnRkcVNRaXJrS2FweElvRTFyOXllTmx0OFRvQ3pvRTZ3Ulg2Sw==@TL", "fileId": "6cd9b92d5c9f4315be8a706e648dd35d", "fileUrl": "https://cloudhospital.taikang.com/cloudhospital/storage/file/get?fileId=6cd9b92d5c9f4315be8a706e648dd35d", "fileRepoEntity": { "suffix": "jpeg", "storageCode": "common", "format": null, "limitFileUrl": null, "size": "1020.58KB", "storageChannel": "qingStor", "type": "image", "storageKey": "272caff4-e30c-4795-b6b5-f784c75f58e2", "name": "76a3b65335dd42b7a323b5507681d7cc.jpeg", "fileUrl": null }, "fileRepo": { "suffix": "jpeg", "storageCode": "common", "id": "6cd9b92d5c9f4315be8a706e648dd35d", "size": "1020.58KB", "storageChannel": "qingStor", "storageKey": "272caff4-e30c-4795-b6b5-f784c75f58e2", "type": "image", "createTime": 1733108862000, "name": "76a3b65335dd42b7a323b5507681d7cc.jpeg" } }, "msg": "success" }, "statusCode": 0 }');
                                callbackData = JSON.parse(picCallBack)
                            }

                        }
                        // 保存base64到本地
                        if (obj.command == 'saveBitmapToLocal') {
                            alert('模拟下载完成')
                            callbackData.data = true
                        }
                        // 保存图片
                        if (obj.command == 'saveImageToPhotosAlbum') {
                            alert('模拟下载完成')
                            callbackData.data = true
                        }
                        // 打开小应用
                        if (obj.command == 'startV2MiniProgram') {
                            alert('模拟打开小应用- startV2MiniProgram 成功')
                            callbackData.data = true
                        }
                        // 打电话
                        if (obj.command == 'makePhoneCall') {
                            alert('模拟打电话-makePhoneCall 成功')
                            callbackData.data = true
                        }
                        // 打开视频房间 
                        if (obj.command == 'startVideoRoom') {
                            alert('模拟打开视频房间-startVideoRoom 成功')
                            callbackData.data = true
                        }
                        // 分享
                        if (obj.command == 'onMenuShare') {
                            alert('模拟onMenuShare - 分享 成功')
                            callbackData.data = true
                        }
                        // 弹窗
                        if (obj.command == 'showModal') {
                            alert('模拟showModal - 弹窗 成功')
                            callbackData.data = true
                        }
                        // IMuploadfile 发送选取的图片到IM聊天中
                        if (obj.command == 'IMuploadfile') {
                            var IMuploadfileCallBack = window.prompt('IMuploadfile的回调', '{"code":0,"data":{"result": "success"}}')
                            callbackData = JSON.parse(IMuploadfileCallBack)
                        }
                        // checkAppAuthor 获取原生权限接口 
                        if (obj.command == 'checkAppAuthor' || obj.command == 'openAppSomeAuthors') {
                            var auths = obj.parameter.auths || obj.parameter.nativeParams.auths || []
                            let authsObj = {}
                            auths.forEach(element => {
                                authsObj[element] = true
                            });
                            callbackData.data = authsObj
                        }
                        //  定位
                        if (obj.command == 'getLocation' || obj.command == 'GPSService') {
                            var locationStr = window.prompt("定位信息返回,默认直接点确认：", '{"result":"1","data":{"district":"洪山区","city":"武汉市","longitude":"114.498154","formattedAddress":"湖北省武汉市洪山区花城北路靠近花山生态湿地公园","country":"中国","latitude":"30.561561","province":"湖北省"}}');
                            callbackData = JSON.parse(locationStr)
                        }
                        //  血氧
                        if (obj.command == 'bloodDetect') {
                            var bloodDetectStr = window.prompt("返回血氧,默认直接点确认：", '{"oxygen":90 ,"bpm": 80}');
                            callbackData = JSON.parse(bloodDetectStr)
                        }
                        // 朗读
                        if (obj.command == 'readText') {
                            alert('模拟 readText - 朗读 成功')
                            callbackData.data = true
                        }
                        // 终止朗读
                        if (obj.command == 'stopReadText') {
                            alert('模拟 stopReadText - 终止朗读 成功')
                            callbackData.data = true
                        }
                        // 在线问诊评价弹窗，参数写死的，去千语评价
                        if (obj.command == 'showRatingAlert') {
                            alert('模拟 showRatingAlert 在线问诊评价弹窗，参数写死的，去千语评价  成功')
                            callbackData.data = true
                        }
                        // 是否登录 token
                        if (obj.command == 'isUserLogin') {
                            callbackData.data = { result: token ? 1 : 0 }
                        }
                        // 设置缓存数据
                        if (obj.command == 'setStorage') {
                            callbackData.data = window.setStorage(obj.parameter.key, obj.parameter.data)
                        }
                        // 获取缓存数据
                        if (obj.command == 'getStorage') {
                            callbackData.data = window.getStorage(obj.parameter.key)
                        }
                        // 返回app配置的服务器地址和运营平台地址
                        if (obj.command == 'getServerUrl') {
                            var getServerUrlStr = window.prompt("返回app配置的服务器地址和运营平台地址,默认直接点确认：", '{"data":{"errMsg":"getServerUrl:ok","serverUrl":"http://tklifetest.mobile.taikang.com/","operationUrl":"https://medicaluat.mobile.taikang.com/active/"},"code":"0"}');
                            callbackData = JSON.parse(getServerUrlStr)
                        }
                        // 返回网络连接类型
                        if (obj.command == 'getNetworkType') {
                            var getNetworkTypeStr = window.prompt("返回app配置的服务器地址和运营平台地址,默认直接点确认：", '{"networkType":"mobile"}');
                            callbackData = JSON.parse(getNetworkTypeStr)
                        }
                        // OCR验证
                        if (obj.command == 'miniOCRService') {
                            var miniOCRServiceStr = window.prompt("返回aOCR验证-miniOCRService：", '{"startTime":"2019-10-08","endTime":"2039-10-08","imageInfo":{"type":"jpeg","filePath":"tfile://tmp_C519xxxxxxxxxx","company":"北京公安局","base64Str":"xxxxxxxxxxxxxxxxxxxxx"}}');
                            callbackData = JSON.parse(miniOCRServiceStr)
                        }
                        // 跳转特殊容器
                        if (obj.command == 'openSpecialWebviewV2' || obj.command == 'openSpecialWebview') {
                            alert('模拟 openSpecialWebviewV2 跳转特殊容器  成功')
                            callbackData.data = true
                        }
                        // toTKdoctor
                        if (obj.command == 'toTKdoctor') {
                            alert('模拟 toTKdoctor  成功')
                            callbackData.data = true
                        }

                        // startIMVoice
                        if (obj.command == 'startIMVoice') {
                            alert('模拟 startIMVoice  成功')
                            callbackData.data = true
                        }

                        // insertCalendar
                        if (obj.command == 'insertCalendar') {
                            alert('模拟 insertCalendar  成功')
                            callbackData.data = true
                        }
                        // 暂停、恢复语音合成（文字转语音）
                        if (obj.command == 'pauseReadText' || obj.command == 'resumeReadText') {
                            alert('模拟 pauseReadText || resumeReadText 暂停、恢复语音合成（文字转语音）  成功')
                            callbackData.data = true
                        }
                        // mapServiceNew 跳转地图详情页面
                        if (obj.command == 'mapServiceNew') {
                            alert('模拟 mapServiceNew 跳转地图详情页面  成功')
                            callbackData.data = true
                        }
                        // 分享微信小程序
                        if (obj.command == 'shareWXMiniProgramService') {
                            alert('模拟 shareWXMiniProgramService 分享微信小程序  成功')
                            callbackData.data = true
                        }
                        // 分享URL 卡片独立交互
                        if (obj.command == 'directShareUrl') {
                            alert('模拟 directShareUrl 分享URL 卡片独立交互  成功')
                            callbackData.data = true
                        }
                        // 微信分享纯文本
                        if (obj.command == 'shareTextToWXService' || obj.command == 'shareTextToWXServiceV2') {
                            alert('模拟 shareTextToWXService 微信分享纯文本  成功')
                            callbackData.data = true
                        }
                        // 分享图片
                        if (obj.command == 'directShareImg') {
                            alert('模拟 directShareImg 分享图片  成功')
                            callbackData.data = true
                        }
                        // 退出登录
                        if (obj.command == 'loginOutService') {
                            alert('模拟 loginOutService 退出登录  成功')
                            callbackData.data = true
                        }
                        // 分享（调起分享面板）
                        if (obj.command == 'shareAction') {
                            alert('模拟 shareAction 分享（调起分享面板）  成功')
                            callbackData.data = true
                        }

                        // 跳转手机设置
                        if (obj.command == 'openAppAuthorV2' || obj.command == 'openAppAuthor') {
                            alert('模拟 openAppAuthorV2 跳转手机设置  成功')
                            callbackData.data = true
                        }
                        // 查询周边Okase
                        if (obj.command == 'scanDrugBox' || obj.command == 'scanDrugBoxV2') {
                            var scanDrugBoxStr = window.prompt("返回查询周边Okase：", '{"code":"0","data":"HEXString"}');
                            callbackData = JSON.parse(scanDrugBoxStr)
                        }
                        // 操作cgm血糖仪
                        if (obj.command == 'cgmAction' || obj.command == 'cgmActionV2') {
                            var cgmActionStr = window.prompt("返回操作cgm血糖仪：", '{"code":"0","data":""}');
                            callbackData = JSON.parse(cgmActionStr)
                        }
                        // 获取用户手机号
                        if (obj.command == 'getUserMobile' || obj.command == 'getUserMobileV2') {
                            var getUserMobileStr = window.prompt("返回获取用户手机号：", '{"countryCode":"86","userMobile":"189****7976"}');
                            callbackData = JSON.parse(getUserMobileStr)
                        }
                        // 获取用户姓名
                        if (obj.command == 'userNameService' || obj.command == 'userNameServiceV2') {
                            var userNameServiceStr = window.prompt("返回获取用户姓名：", '{"userName":"张先生"}');
                            callbackData = JSON.parse(userNameServiceStr)
                        }

                        // 获取用户今日步数
                        if (obj.command == 'getTodayRunData' || obj.command == 'getTodayRunDataV2') {
                            var currentDate = formatDate(new Date(), 'yyyy-MM-dd'); 
                            var getTodayRunDataStr = window.prompt("返回获取用户今日步数：", `{"step":2133,"date": "${currentDate}"}`);
                            callbackData = JSON.parse(getTodayRunDataStr)
                        }
                        // 获取用户人脸数据
                        if (obj.command == 'faceDetectService' || obj.command == 'faceDetectServiceV2') {
                            var faceDetectServiceStr = window.prompt("返回获取用户人脸数据：", ' {"detectCode": 1}');
                            callbackData = JSON.parse(faceDetectServiceStr)
                        }
                        // 获取视频自动播放设置
                        if (obj.command == 'getVideoAutoPlay') {
                            var getVideoAutoPlayStr = window.prompt("返回获取视频自动播放设置：", ' {"status": "1","code":"0"}');
                            callbackData = JSON.parse(getVideoAutoPlayStr)
                        }
                        // 获取通知开关状态
                        if (obj.command == 'getNotificationsEnabled') {
                            var getNotificationsEnabledStr = window.prompt("返回获取通知开关状态：", ' {"enabled": "1","code":"0"}');
                            callbackData = JSON.parse(getNotificationsEnabledStr)
                        }
                        // 保存pdf到手机相册
                        if (obj.command == 'downloadPDF') {
                            var downloadPDFStr = window.prompt("返回保存pdf到手机相册：", ' {"result": "success","code":"0"}');
                            callbackData = JSON.parse(downloadPDFStr)
                        }
                        // 开启消息提醒弹窗
                        if (obj.command == 'userPushAlertAction') {
                            var userPushAlertActionStr = window.prompt("返回开启消息提醒弹窗：", ' { "event": "showOpenNotificationDialog", "status": "ok" }');
                            callbackData = JSON.parse(userPushAlertActionStr)
                        }
                        // 获取设备指纹
                        if (obj.command == 'getDeviceSecurityToken') {
                            var getDeviceSecurityTokenStr = window.prompt("返回获取设备指纹：", '{"data":{"securityToken":"6WOyEy6Hhq2BQo/4Xv69WKgQhd/d5I7QdNNdUQfwxMbRXiiB0TI0hKwqEF5hWJihsCn0GF2MrdQx9zl8UeQVPh+KoOdzZe1ZRvckkyop5NLc6/z7w0gclA=="},"code":0}');
                            callbackData = JSON.parse(getDeviceSecurityTokenStr)
                        }
                        // 从本地获取图片信息
                        if (obj.command == 'getChooseImageMsg') {
                            var getChooseImageMsgStr = window.prompt("返回从本地获取图片信息：", '{"data":{"localIds":["tfile://tmp_389164E761C5473131B0F81FBBAABF6A.jpeg"],"localFiles":[{"size":447599,"type":"image/jpeg","orientation":"up","width":721,"height":1280,"localId":"tfile://tmp_389164E761C5473131B0F81FBBAABF6A.jpeg"}]},"code":0}{"data":{"localIds":["tfile://tmp_389164E761C5473131B0F81FBBAABF6A.jpeg"],"localFiles":[{"size":447599,"type":"image/jpeg","orientation":"up","width":721,"height":1280,"localId":"tfile://tmp_389164E761C5473131B0F81FBBAABF6A.jpeg"}]},"code":0}');
                            callbackData = JSON.parse(getChooseImageMsgStr)
                        }
                        // 从本地获取视频信息
                        if (obj.command == 'getChooseVideoMsg') {
                            var getChooseVideoMsgStr = window.prompt("返回从本地获取视频信息：", '{"code":0,"data":{"size":5658069,"duration":5.295,"width":888,"height":1920,"localId":"tfile://tmp_AF605A10CEC96D1115FC64B3602B27D1.mp4"}}');
                            callbackData = JSON.parse(getChooseVideoMsgStr)
                        }




                        //执行回调
                        setTimeout(() => {

                            // 以下不用处理
                            if (!['getChooseImageMsg', 'getServerUrl', 'uploadFile'].includes(obj.command)) {
                                // 有些人写的项目 没有处理数据是放到 data中还是直接返回的 比如 原生有些返回{code:1, data:{name:'zs'}} 有些返回{code:1,name:'zs'} (健康这边统一方法有处理，有data返回data，没有直接返回。)  为了兼容某些没处理的项目
                                if (callbackData.data && Object.prototype.toString.call(callbackData.data) === "[object Object]") {
                                    callbackData = { ...callbackData, ...callbackData.data }
                                }
                            }

                            console.log(`%c  ${obj.command} - 模拟原生返回的值是:%o`, 'background-color:#0f0;color:#f00;font-size:20px;', callbackData)
                            var callbackJSON = JSON.stringify(callbackData)

                            if (obj.callback && window[obj.callback]) {
                                window[obj.callback](callbackJSON)
                            } else if (obj.command && window[obj.command]) {
                                window[obj.command](callbackJSON)
                            }
                        }, 200);

                    }
                }

            }
        }
        //formatDate(currentDate, 'yyyy-MM-dd HH:mm:ss');
        function formatDate (date, format) {
            if (!(date instanceof Date)) {
                if (typeof date === 'number') {
                    date = new Date(date);
                } else {
                    throw new Error('输入的参数不是有效的Date对象或时间戳');
                }
            }

            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return format
                .replace('yyyy', year)
                .replace('MM', month)
                .replace('dd', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        }
        // 获取token
        function getToken () {
            return new Promise((resolve, reject) => {
                // 线上直接返回即可
                if (['tlifehealth.taikang.com', 'operation.mobile.taikang.com', 'operation.taikang.com', 'tklife.mobile.taikang.com', 'tshmall.wanyuhengtong.com', 'point.taikang.com'].includes(location.hostname)) {
                    let token = '' // 这里需要自己 找后端去 日志 里拿token
                    !token && alert("没有线上token")
                    return resolve(token)
                }


                // 模拟手机号
                var mobile = window.prompt("请输入需要获取token的手机号：", "18031359654");
                // 假设你有一个JSON对象
                const jsonData = {
                    "verifyCode": "123456",
                    "mobile": mobile,
                    "deviceId": "111",
                    "deviceType": "1"
                };
                // 将JSON对象转换为字符串
                const jsonString = JSON.stringify(jsonData);
                // 使用fetch发送POST请求，包含JSON数据
                fetch('https://tklifetest.mobile.taikang.com/users/login/v2', {
                    method: 'POST', // 指定请求方法
                    headers: {
                        'Content-Type': 'application/json' // 设置请求头为JSON格式
                    },
                    body: jsonString // 将JSON字符串作为请求体
                }).then(response => {
                    if (response.ok) {
                        return response.json(); // 如果响应成功，解析JSON响应
                    }
                    throw new Error('Network response was not ok.'); // 如果响应不成功，抛出错误
                }).then(r => {
                    if (r.code == 0) {
                        resolve(r.data.token)
                    } else {
                        console.log(r)
                        reject(r)
                    }
                }).catch(error => console.error('There has been a problem with your fetch operation:', error)); // 捕获错误
            })
        }

        // 某些原生进入页面就会执行的方法
        setTimeout(() => {
            window.webviewDidFinishLoading && window.webviewDidFinishLoading()
            window.onGetCgmHistroy && window.onGetCgmHistroy()
            window.updateSeviveStatus && window.updateSeviveStatus()
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    window.onResume && window.onResume()
                    window.onAppEnterForeground && window.onAppEnterForeground()
                } else {
                    window.onAppEnterBackground && window.onAppEnterBackground()
                }
            });
        }, 1000);
    }
})();