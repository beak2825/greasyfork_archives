// ==UserScript==
// @name         知网下载助手
// @namespace    cnki
// @version      0.0.4
// @antifeature  membership
// @description  知网学术下载解析工具，免登录即可下载，完全免费使用。
// @author       千千软件
// @icon         https://img03.mifile.cn/v1/MI_542ED8B1722DC/8a3d67192d85999be1bc1cda5c4d3528.png
// @match        https://*.cnki.net/kcms2/*
// @require      https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      qianqian.club
// @connect      cnki.net
// @connect      baidu.com
// @downloadURL https://update.greasyfork.org/scripts/492511/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492511/%E7%9F%A5%E7%BD%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let globalData = {
        scriptVersion: '0.0.4',
        downloading: 0,
        storageNamePrefix: 'qq_storageName', // 本地储存名称前缀
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            apiUrl: `/cnki.php`,
            storageNamePrefix: globalData.storageNamePrefix,
        }
    }

    let getConfig = function () {
        return {
            code: getStorage.getLastUse('code'),
        }
    }
    let getStorage = {
        getAppConfig: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_app_' + key) || '';
        },
        setAppConfig: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_app_' + key, value || '');
        },
        getLastUse: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_last_' + key) || '';
        },
        setLastUse: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_last_' + key, value || '');
        },
        getCommonValue: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_common_' + key) || '';
        },
        setCommonValue: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_common_' + key, value || '');
        }
    }

    //下载面板
    let showDownloadDialog = function (response) {
        let content = `
            <div id="downloadDialog">
                <div id="dialogTop">
                    <div id="dialogErr">${response.err}</div>
                </div>
                <div id="dialogMiddle">
                    <div id="dialogLeft">
                        <div id="dialogQr">
                            <img id="dialogQrImg" src="https://img06.mifile.cn/v1/MI_542ED8B1722DC/118fd536b55197b20597d81d5974159f.jpg" />
                        </div>
                    </div>
                    <div id="dialogRight">
                        <div id="dialogContent">
                            <div id="dialogVaptchaCode">
                                <div id="dialogVaptchaCodeInput">
                                    <span id="dialogVaptchaCodeTips">填写验证码：</span>
                                    <input id="dialogCode" type="text" value="${getConfig().code}" />
                                </div>
                                <div id="dialogCodeRemark"></div>
                            </div>
                            <input id="dialogBtnGetUrl" type="button" value="点击继续下载" class="btnInterface" />
                        </div>
                    </div>
                </div>
                <div id="dialogClear"></div>
                <div id="dialogBottom"></div><!--众所周知的原因，脚本不可能常在，但作者常在，关注才能不迷路！！！-->
            </div>
        `;
        showSwal(content, {
            button: '关 闭',
            closeOnClickOutside: false
        });
    }

    //请求直链成功后，tips
    let showQrTips = function (res) {
        let qrImg = $.trim(res.qrImg);
        let qrTips = $.trim(res.qrTips);
        let codeTips = $.trim(res.codeTips);
        let codeRemark = $.trim(res.codeRemark);
        //console.log(qrImg, qrTips);
        if (qrImg.length > 0) {
            $("#dialogQrImg").attr('src', qrImg);
        }
        if (qrTips.length > 0) {
            // $("#dialogBottom").html(qrTips);
        }
        if (codeTips.length > 0) {
            $("#dialogVaptchaCodeTips").html(codeTips).show();
        }
        if (codeRemark.length > 0) {
            $("#dialogCodeRemark").html(codeRemark).show();
        }
    }

    //存储验证码
    let saveCode = function () {
        getStorage.setLastUse('code', $("#dialogCode").val());
    }

    //=========================================

    //查询接口地址-->发起服务器请求
    let getDownloadUrl = function (dlType) {
        if (globalData.downloading === 1) {
            return false;
        }
        setDownloadingState(dlType, '正在查询接口地址...');
        let bdUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=1070525283";
        let details = {
            method: 'GET',
            timeout: 10000, // 10秒超时
            url: bdUrl + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                // console.log(res);
                if (res.status === 200) {
                    if (res.response.errno == 0) {
                        let ifDomain = res.response.user_info.intro;
                        // console.log(ifDomain);
                        // ifDomain = 'http://localhost:48818/cnki'
                        getDownloadUrlReal(dlType, ifDomain);
                    } else {
                        throw res;
                    }
                } else {
                    throw res;
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
            setDownloadCompleteState();
            showTipError('获取接口地址时报错：' + error.message)
        }
    }

    let getDownloadUrlReal = function (dlType, ifDomain) {
        setDownloadingState(dlType, '正在请求下载地址...');
        let downloadUrl = `${ifDomain}${getAppSettingData().apiUrl}?version=${getAppSettingData().scriptVersion}&t=8888` + new Date().getTime();
        // let code = $('#dialogCode').val() || getConfig().code;
        let code = getConfig().code;
        let fileUrl = window.location.href;
        let fileName = $('.wx-tit h1').text();
        let dlUrl = $('#' + dlType + 'Down').attr('href');
        //官网“学位论文”栏目的bug，两个按钮的id都是cajDown，暂时就这样来修复
        if (!dlUrl && dlType == 'pdf') {
            let pdfBtn = $('li.btn-dlpdf>a').first();
            if (pdfBtn) {
                dlUrl = pdfBtn.attr('href');
            }
        }

        let params = new FormData();
        params.append('code', $.trim(code));
        params.append('fileUrl', fileUrl);
        params.append('fileName', fileName);
        params.append('dlUrl', dlUrl);
        params.append('dlType', dlType);
        //远程请求下载地址
        let details = {
            method: 'POST',
            responseType: 'json',
            timeout: 30000, // 30秒超时
            url: downloadUrl,
            data: params,
            onload: function (res) {
                // params.forEach((value, key) => {
                //      console.log("%s --> %s", key, value);
                // })
                setDownloadCompleteState();
                console.log('远程请求直链地址，返回：', res);
                if (res.status === 200) {
                    switch (res.response.errno) {
                        case 0: // 正常返回
                            console.log('正常返回');
                            downFile(res.response.downloadUrl);
                            break;
                        case 100: // 版本太旧
                            showTipErrorSwal(res.response.err);
                            break;
                        case 101: // 验证码不正确
                            showDownloadDialog(res.response);
                            showQrTips(res.response);
                            //绑定按钮点击（点击继续下载）
                            $("#dialogBtnGetUrl").click(function () {
                                saveCode();
                                swal.close();
                                getDownloadUrl();
                            });
                            break;
                        default: // 其它错误
                            showTipError(res.response.err);
                            break;
                    }
                } else {
                    console.error(res);
                    showTipError('请求下载地址失败！服务器返回：' + res.status);
                }
            },
            ontimeout: (res) => {
                console.error(res);
                setDownloadCompleteState();
                showTipError('请求下载地址时连接服务器接口超时，请重试！');
            },
            onerror: (res) => {
                console.error(res);
                setDownloadCompleteState();
                showTipError('请求下载地址时连接服务器接口出错，请重试！');
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            showTipError('远程请求未知错误，请重试！');
            setDownloadCompleteState();
            console.error(error);
        }
    }

    let setDownloadingState = function (dlType, tips) {
        globalData.downloading = 1;
        $('#' + dlType + 'BtnName').text(tips);
    }
    let setDownloadCompleteState = function () {
        globalData.downloading = 0;
        $('#pdfBtnName').text('知网助手下载PDF');
        $('#cajBtnName').text('知网助手下载CAJ');
    }

    let showTipErrorSwal = function (err) {
        showSwal(err, {icon: 'error'});
    }

    let showSwal = function (content, option) {
        divTips.innerHTML = content;
        option.content = divTips;
        if (!option.hasOwnProperty('button')) {
            option.button = '朕 知 道 了'
        }
        swal(option);
    }

    let showTipError = function (err) {
        // showSwal(err,{icon: 'error'});
        alert(err);
    }

    //========================================= 公共函数

    let downFile = function (url) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 延迟执行，否则找不到对应的按钮
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    //========================================= css
    GM_addStyle(`
        .operate-btn .btn-dl-helper a {
            background-color: #ff6988
        }
        .operate-btn .btn-dl-helper a:hover {
            background-color: #dd2014
        }
        .operate-btn .btn-dlpdf-helper i {
            background-position: -75px 0
        }
        .operate-btn .btn-dlcaj-helper i {
            background-position: -50px 0
        }
        .operate-btn li .btn-dl-helper i {
            display: inline-block;
            vertical-align: middle;
            width: 25px;
            height: 25px;
            background-image: url(https://piccache.cnki.net/nxgp/kcms/2023121114r/images/gb/kcms8/ndetail/icon-dllinkbtns3.png);
            background-repeat: no-repeat;
            *height: 20px;
        }
        .operate-left {
            padding-right: 0px;
        }
        a.aDownHelper {
            font-size: 16px;
            font-weight: bold;
        }
        
        /****************************************/
        .swal-modal {
            width: auto;
            min-width: 730px;
        }
        .swal-modal input {
            border: 1px grey solid;
        }
        #downloadDialog{
            width: 730px;
            font-size: 16px;
        }

        #dialogTop{
            margin: 20px 0;
        }
        #dialogErr{
            background: #f4c758;
            margin: 15px -20px 0 -20px;
            padding: 10px 0 10px 25px;
            color: #4c4433;
        }
        #dialogLeftTips{
            text-align: left;
            margin: 0 0 10px 0px;
            color: #4c4433;
            font-size: 13px;
        }
        #dialogRight{
            width: 56%;
            float: left;
            margin-left: 10px;
        }
        #dialogContent input{
            vertical-align: middle;
        }
        #dialogRemark{
            text-align: left;
            font-size: 12px;
            margin-top: 5px;
        }
        #dialogVaptchaCode{
            text-align: left;
            font-size: 14px;
            /* border: 2px solid #EDD; */
            line-height: 28px;
        }
        #dialogVaptchaCodeInput{
            font-size: 18px;
        }
        #dialogCode{
            width: 65%;
            font-size: 18px;
            padding: 3px;
        }
        #dialogCodeRemark{
            margin: 10px 0px;
            padding: 3px;
        }
        #dialogQr{
            width: 265px;
            height: 265px;
            text-align: center;
        }
        #dialogQr img{
            width: 100%;
            margin-left: 27px;
        }
        #dialogClear{
            clear: both;
        }
        #dialogBottom{
            text-align: left;
            margin: 20px -20px -5px -20px;
            background: #f4c758;
            color: #4c4433;
            height: 1px;
        }
        .btnInterface {
            width: 100%;
            height: 50px;
            background: #f00 !important;
            border-radius: 4px;
            transition: .3s;
            font-size: 25px !important;
            border: 0;
            color: #fff;
            cursor: pointer;
            text-decoration: none;
            font-family: Microsoft YaHei,SimHei,Tahoma;
            font-weight: 100;
            letter-spacing: 2px;
        }
        #dialogLeft{
            float: left;
            width: 42%;
        }
        .swal-footer{
            margin-top: 5px;
        }
        .div-dl-helper{
            margin-bottom: 10px;
            text-align: center;
        }
    `);
    // ==================================== 逻辑代码开始
    console.log('脚本开始');

    const divTips = document.createElement('div');
    divTips.id = "divTips";//用于提示脚本版本

    let btnDownload = {
        id: 'divCnkiHelper',
        html: function () {
            return `
                <li id="liPdfBtn" title="使用知网下载助手进行下载" class="btn-dl-helper btn-dlpdf-helper" style="margin-right: 5px;">
                    <a id="pdfDownHelper" class="aDownHelper" href="#">
                        <i></i>
                        <text id="pdfBtnName"></text>
                    </a>
                </li>
                <li id="liCajBtn" title="使用知网下载助手进行下载" class="btn-dl-helper btn-dlcaj-helper">
                    <a id="cajDownHelper" class="aDownHelper" href="#">
                        <i></i>
                        <text id="cajBtnName"></text>
                    </a>
                </li>
            `
        },
        class: function () {
            return 'div-dl-helper';
        }
    }

    let start = function () {//迭代调用
        if (!$('#pdfDown')[0]) {
            if (!$('li.btn-dlpdf>a').first()) {
                //官网“学位论文”栏目的bug，两个按钮的id都是cajDown，暂时就这样来修复
                console.log('找不到【PDF下载】按钮，该文档不可下载！');
                return;
            }
        }
        if (!$('#cajDown')[0]) {
            console.log('找不到【CAJ下载】按钮！');
            // return;
        }
        let operateBtn = $('ul.operate-btn');

        // 创建按钮 START
        let divCnkiHelper = document.createElement('div');
        divCnkiHelper.id = btnDownload.id;
        divCnkiHelper.innerHTML = btnDownload.html();
        // divCnkiHelper.style.cssText = btnDownload.style();
        divCnkiHelper.className = btnDownload.class();
        // 创建按钮 END

        // 添加按钮 START
        operateBtn.children().first().before(divCnkiHelper);
        if (!$('#cajDown')[0]) $('#liCajBtn').hide();//如果无caj下载按钮
        setDownloadCompleteState();
        // 添加按钮 END

        //绑定点击事件
        $('.aDownHelper').click(function (e) {
            let dlType = $(this).attr('id').slice(0, 3);
            console.log('#' + dlType + 'DownHelper 点击事件');
            e.preventDefault();
            // getDownloadUrlReal();
            getDownloadUrl(dlType);
        });
    }

    sleep(500).then(() => {
        start();
        // GM_deleteValue('qq_storageName_last_code');//测试
    })
})();
//#######