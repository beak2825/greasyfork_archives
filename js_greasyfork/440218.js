// ==UserScript==
// @name         bdEasy
// @namespace    https://www.null119.cn/
// @version      0.2
// @description  纯净直链下载，无多余附加功能。
// @icon         data:image/png;base64,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
// @author       治廷君
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
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
// @connect      yyxxs.cn
// @connect      softxm.cn
// @connect      softxm.vip
// @connect      42.193.51.61
// @connect      119.28.33.23
// @connect      119.28.139.214
// @connect      49.234.47.193
// @connect      82.156.65.179
// @connect      42.193.127.85
// @connect      81.70.253.99
// @connect      49.232.252.126
// @connect      82.156.15.149
// @connect      59.110.224.13
// @connect      59.110.225.22
// @connect      59.110.226.3
// @connect      api.null119.cn
// @connect      baidu.com
// @downloadURL https://update.greasyfork.org/scripts/440218/bdEasy.user.js
// @updateURL https://update.greasyfork.org/scripts/440218/bdEasy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let globalData = {
        scriptVersion: '1.5.1',
        domain: 'http://82.156.65.179',
        domainB: 'http://bd.yyxxs.cn',
        domainC: 'http://82.156.15.149',
        domainD: 'http://42.193.51.61',
        domainE: 'http://81.70.253.99',
        domainF: 'http://119.28.139.214',
        domainG: 'http://49.234.47.193',
        param: '',
        downloading: 0,
        sending: 0,
        storageNamePrefix: 'softxm_storageName', // 本地储存名称前缀
        paramDomain: '',
        paramDomain2: '',
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            param: globalData.param,
            storageNamePrefix: globalData.storageNamePrefix,
            getDownloadUrl: `http://api.null119.cn:9998`,
            aria2DownloadUrl: `https://null119.lanzoul.com/iziNi008uwpg`,
            idmDownloadUrl: `https://null119.lanzoul.com/iuSut008uwqh`,
            yhDownloadUrl:`https://null119.lanzoul.com/if4LE008uwof`,
            aria2CourseUrl: `https://www.null119.cn/bdeasy/#/?id=%e4%ba%8c%e3%80%81aria2%e9%85%8d%e7%bd%ae`,
            idmCourseUrl: `https://www.null119.cn/bdeasy/#/?id=%e4%b8%80%e3%80%81idm%e9%85%8d%e7%bd%ae`
        }
    }

    let tmpData = {
        response: '',
        pwd: '',
        fs_id: '',
        token: '',
    }

    let configDefault = {
        savePath: 'D:\\BaiduDownLoad',
        jsonRpc: 'http://localhost:6800/jsonrpc',
        token: '',
        mine: '',
        code: '',
    };
    let getConfig = function () {
        // 上次使用 > 应用配置 > 代码默认
        return {
            savePath: getStorage.getLastUse('savePath') || getStorage.getAppConfig('savePath') || configDefault.savePath,
            jsonRpc: getStorage.getLastUse('jsonRpc') || getStorage.getAppConfig('jsonRpc') || configDefault.jsonRpc,
            token: getStorage.getLastUse('token') || getStorage.getAppConfig('token') || configDefault.token,
            mine: getStorage.getLastUse('mine') || getStorage.getAppConfig('mine') || configDefault.mine,
            code: getStorage.getLastUse('code') || configDefault.code,
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

    let uInfo = {};

    let isOldHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/home") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isNewHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/main") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isSharePage = function () {
        let path = location.pathname.replace('/disk/', '');
        if (/^\/(s|share)\//.test(path)) {
            return true;
        } else {
            return false;
        }
    }

    let getSelectedFileList = function () {
        let pageType = getPageType();
        if (pageType === 'old') {
            return require('system-core:context/context.js').instanceForSystem.list.getSelected();
        }
        if (pageType === 'new') {
            return document.querySelector('.nd-main-list').__vue__.selectedList;
        }
    };

    let getFileListStat = function (fileList) {
        let fileStat = {
            file_num: 0,
            dir_num: 0
        };
        fileList.forEach(function (item) {
            if (item.isdir == 0) {
                fileStat.file_num++;
            } else {
                fileStat.dir_num++;
            }
        });
        return fileStat;
    };

    let initButtonEvent = function () {
        console.log('initButtonEvent初始化按钮事件');
        let pageType = getPageType();
        let yunData = getYunData();
        if (!yunData && pageType != 'new') {
            showLogin();
            return;
        }
        if (pageType === 'share') {
            showTipErrorSwal('必须先转存到自己网盘中，然后进入网盘进行下载！');
            console.log('必须先转存到自己网盘中');
            showShareSave();
        } else {
            let fileList = getSelectedFileList();
            let fileStat = getFileListStat(fileList);
            if (fileList.length) {
                if (fileStat.file_num > 1 || fileStat.dir_num > 0) {
                    showTipError('请选择一个文件进行下载（不支持文件夹和多文件批量下载）')
                }
                if (fileStat.dir_num == 0 && fileStat.file_num == 1) {
                    showDownloadDialog(fileList, fileStat);
                    setShareCompleteState();
                }
            } else {
                showTipErrorSwal('请选择一个文件进行下载');
            }
        }
    };

    let getYunData = function () {
        return unsafeWindow.yunData;
    };

    let showTipErrorSwal = function (err) {
        showSwal(err, {icon: 'error'});
    }
    let showTipError = function (err) {
        // showSwal(err,{icon: 'error'});
        alert(err);
    }
    let showTipInfo = function (info) {
        getJquery()("#dialogOpTips").show().html(info);
    }
    let showTipInfoAria = function (info) {
        getJquery()("#dialogOpTipsAria").show().html(info);
    }
    let showTipInfoIdm = function (info) {
        getJquery()("#dialogOpTipsIdm").show().html(info);
    }

    let showSwal = function (content, option) {
        divTips.innerHTML = content;
        option.content = divTips;
        if (!option.hasOwnProperty('button')) {
            option.button = '确定'
        }
        swal(option);
    }

    let getJquery = function () {
        // return require("base:widget/libs/jquerypacket.js");
        return $;
    };
    let showLogin = function () {
        require("base:widget/libs/jquerypacket.js")("[node-type='header-login-btn']").click();
    };
    let showShareSave = function () {
        require("base:widget/libs/jquerypacket.js")("[node-type='shareSave']").click();
    };

    //下载面板
    let showDownloadDialog = function (fileList, fileStat) {
        let theFile = fileList[0];
        // console.log(theFile);
        let content = `
            <div id="downloadDialog">
                <div id="dialogTop">
                    请点击下方按钮，开始下载 <span id="dialogFileName">${CutString(theFile.server_filename, 40)}</span>
                </div>
                <div id="dialogMiddle">
                    <div id="dialogLeft">
                        <div id="dialogLeftTips">
                            <div id="dialogLeftTips1">
                                <strong>【方式1】</strong>IDM 必须设置4线程及修改UA（以教程为准）</strong>
                                <div class="dialogLeftTipsLink">
                                    <a href="${getAppSettingData().idmDownloadUrl}" target="_blank">【点击下载IDM】</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${getAppSettingData().idmCourseUrl}" target="_blank">【IDM教程】</a>
                                </div>
                            </div>
                            <div id="dialogLeftTips2">
                                <strong>【方式2】</strong>Aria2 无需配置即可使用
                                <div class="dialogLeftTipsLink">
                                    <a href="${getAppSettingData().aria2DownloadUrl}" target="_blank">【点击下载Aria2】</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${getAppSettingData().aria2CourseUrl}" target="_blank">【Aria2教程】</a>
                                </div>
                            </div>
                        </div>
                        <div id="dialogRemark">
                                <!--
                                ■ IDM下载速度<strong>6M/s</strong>左右，Aria2下载速度可以<strong>跑满带宽</strong>
                                <br />
                                -->
                                ■ 下载速度<strong>因人而异</strong>，特别是共享网络（如校园网）
                            </div>
                    </div>
                    <div id="dialogRight">
                        <div id="dialogContent">
                        <input id="dialogBtnGetUrl" type="button" value="获取直链地址" class="btnInterface" />
                            <div id="dialogOpTips"></div>
                            <div id="dialogVaptchaCode">
                                <div id="dialogVaptchaCodeInput">
                                    <span id="dialogVaptchaCodeTips"></span>
                                    <input id="dialogCode" type="text" value="${getConfig().code}" />
                                </div>
                                <div id="dialogCodeRemark"></div>
                            </div>
                            <div id="dialogOpButtons">
                                <input id="dialogBtnIdm" type="button" data-clipboard-text="" value="复制直链地址" class="btnInterface btnGreen" />
                                <div id="dialogOpTipsIdm"></div>
                                <input id="dialogBtnAria" type="button" value="发送至Aria2" class="btnInterface btnGreen" />
                                <div id="dialogOpTipsAria"></div>
                                <div id="dialogDivSavePath">
                                    保存路径：<input type="text" id="dialogTxtSavePath" value="${getConfig().savePath}" style="width: 170px;" />
                                    <span id="dialogAriaConfigClick">配置Aria2>></span>
                                    <div id="dialogAriaConfig">
                                        <input type="text" id="dialogAriaRPC" value="${getConfig().jsonRpc}" title="RPC地址" placeholder="RPC地址" style="width: 240px;" />
                                        <input type="text" id="dialogAriaToken" value="${getConfig().token}" title="token" placeholder="token" style="width: 77px;" />
                                        <br />
                                        <input type="checkbox" id="dialogAriaMine" value="checked" ${getConfig().mine}> 我使用自己的Aria2（如不懂，勿勾选）
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="dialogClear"></div>
                <div id="dialogBottom">公众号【治廷君】,关注不迷路！！！<a href="${getAppSettingData().yhDownloadUrl}" target="_blank">【点击下载油猴插件】</a></div>
            </div>
        `;
                               /* <div id="dialogQr">
                            <img id="dialogQrImg" src="" />
                        </div>*/
        showSwal(content, {
            button: '关 闭',
            closeOnClickOutside: false
        });

        //分享（入口 ）
        let dialogBtnClick = function () {
            if (globalData.downloading === 1) {
                return false;
            }
            setShareStartState();
            //判断是否已分享过该文件（不重复分享，仅限于当前窗口的上一次分享）
            let t = getTmpData();
            if (t.response && t.fs_id == theFile.fs_id) {
                console.warn('已分享过此文件，不再重复分享');
                getDownloadUrl(t.response, t.pwd, t.fs_id, '');
                return;
            } else {
                console.info('未分享过此文件，开始分享');
            }

            //获取数据
            let bdstoken = '';//unsafeWindow.locals.get('bdstoken');
            let pwd = getRndPwd(4);
            //+===================================
            //分享
            let details = {
                method: 'POST',
                responseType: 'json',
                timeout: 10000, // 10秒超时
                url: `/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`,
                data: `fid_list=[${theFile.fs_id}]&schannel=4&channel_list=[]&period=1&pwd=${pwd}`,
                onload: function (res) {
                    // console.log('分享文件时，百度返回：', res);
                    if (res.status === 200) {
                        switch (res.response.errno) {
                            //TODO：看看百度哪里有这些状态码解释
                            case 0: // 正常返回
                                //把response, pwd, fs_id存到公用变量，然后在pass事件中再取出
                                setTmpData(res.response, pwd, theFile.fs_id, '');
                                getDownloadUrl(res.response, pwd, theFile.fs_id, '');
                                break;
                            case 110:
                                showTipInfo('发生错误！')
                                showTipError('百度说：您今天分享太多了，24小时后再试吧！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            case 115:
                                showTipInfo('发生错误！')
                                showTipError('百度说：该文件禁止分享！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            case -6:
                                showTipInfo('发生错误！')
                                showTipError('百度说：请重新登录！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            default: // 其它错误
                                showTipInfo('发生错误！')
                                showTipError('分享文件失败，请重试！\n百度返回状态码：' + res.response.errno + '\n使用百度分享按钮试试，就知道具体原因了。');
                                setShareCompleteState();
                                console.error(res);
                                break;
                        }
                    } else {
                        showTipInfo('发生错误！')
                        showTipError('分享文件失败，导致无法获取直链下载地址！\n百度返回：' + res.responseText);
                        setShareCompleteState();
                        console.error(res);
                    }
                },
                ontimeout: (res) => {
                    showTipInfo('发生错误！')
                    showTipError('分享文件时连接百度接口超时，请重试！');
                    setShareCompleteState();
                    console.error(res);
                },
                onerror: (res) => {
                    showTipInfo('发生错误！')
                    showTipError('分享文件时发生错误，请重试！');
                    setShareCompleteState();
                    console.error(res);
                }
            };
            try {
                GM_xmlhttpRequest(details);
            } catch (error) {
                showTipInfo('发生错误！')
                showTipError('未知错误，请重试！');
                setShareCompleteState();
                console.error(error);
            }
        };

        //绑定按钮点击（点击获取直链地址）
        getJquery()("#dialogBtnGetUrl").click(function () {
            dialogBtnClick()
        });
        //点击配置Aria2
        getJquery()("#dialogAriaConfigClick").click(function () {
            showAriaConfig()
        });
        // 绑定点击复制事件
        copyUrl2Clipboard();
    };

    //请求备用参数
    let getParams = function () {
        let hkUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=2942844742";
        let details = {
            method: 'GET',
            timeout: 10000, // 10秒超时
            url: hkUrl + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                if (res.status === 200) {
                    globalData.domainB = res.response.user_info.intro;
                    // console.info("domainB：" + globalData.domainB);
                } else {
                    console.error(res);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
        }
    }

    let getUInfo = function () {
        let url = "https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo";
        let details = {
            method: 'GET',
            timeout: 10000, // 10秒超时
            url: url + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                if (res.status === 200) {
                    uInfo = res.response;
                } else {
                    console.error(res);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
        }
    }
    let setShareStartState = function () {
        globalData.downloading = 1;
        showTipInfo('正在分享文件...')
        //保存用户输入的数据
        saveLastUseData();
        getJquery()('#dialogVaptchaCode').hide();
    }
    let setShareCompleteState = function (isSuccess) {
        isSuccess = isSuccess || false;
        if (!isSuccess) {
            //失败之后，允许重复点击按钮
            globalData.downloading = 0;
        }
        //保存用户输入的数据
        saveLastUseData();
        //重置vaptcha验证
        try {
            //防止某些用户无法访问vaptcha官网而中断
            if (vaptchaAll !== null && vaptchaAll.hasOwnProperty("reset")) {
                vaptchaAll.reset();
            } else {
                console.warn("vaptchaAll is undefined");
            }
        } catch (error) {
            console.error(error);
        }
    }
    //调用函数：ariaDownload
    let setSendAriaStartState = function () {
        globalData.sending = 1;
        showTipInfoAria('正在发送至Aria2...');
        //保存用户输入的数据
        saveLastUseData();
    }
    let setSendAriaCompleteState = function (isSuccess) {
        globalData.sending = 0;
        if (isSuccess) {
            getJquery()("#dialogBtnAria").val('Aria2已经开始下载了');
        } else {
            getJquery()("#dialogBtnAria").val('发送至Aria2');
        }
        //保存用户输入的数据
        saveLastUseData();
    }

    let showAriaConfig = function () {
        let t = getJquery()("#dialogAriaConfig");
        if (t.css("display") == "none") {
            t.show();
        } else {
            t.hide();
        }
    }

    //分享成功后，开始手势验证
    let vaptchaValidate = function () {
        loadVaptchaSdk(function () {
            vaptcha({
                vid: "5fc5252656181ea89f9ead2e", // 验证单元id
                type: "invisible", // 显示类型 隐藏式
                scene: 1, // 场景值 默认0
                offline_server: "", //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
            }).then(function (vaptchaObj) {
                vaptchaAll = vaptchaObj; //将VAPTCHA验证实例保存到全局变量中
                console.log(vaptchaAll);
                //验证通过时触发
                vaptchaAll.listen("pass", function () {
                    // 验证成功进行后续操作
                    let token = vaptchaAll.getToken();
                    console.log(token);
                    let t = getTmpData();
                    getDownloadUrl(t.response, t.pwd, t.fs_id, token);
                });

                //关闭验证弹窗时触发
                vaptchaAll.listen("close", function () {
                    showTipInfo('通过验证才可以取直链！点击上面按钮重新开始。');
                    setShareCompleteState()
                });

                //开始手势验证
                vaptchaAll.validate();
            });
        });
    }

    let setTmpData = function (response, pwd, fs_id, token) {
        tmpData.response = response;
        tmpData.pwd = pwd;
        tmpData.fs_id = fs_id;
        tmpData.token = token;
    }
    let getTmpData = function () {
        return tmpData;
    }
    //手势验证成功后，服务器获取直链地址
    let getDownloadUrlReal = function (domain, response, pwd, fsid, token) {
        let au = '';
        let shorturl = response.shorturl;
        let surl = shorturl.substring(shorturl.lastIndexOf('/') + 1, shorturl.length);
        let downloadUrl = `${getAppSettingData().getDownloadUrl}?version=${getAppSettingData().scriptVersion}&t=8888` + new Date().getTime();
        downloadUrl = downloadUrl + getAppSettingData().param;
        let nau=au.indexOf(globalData.paramDomain2) == 0 ? '' : au;
        var par='type=bd&data='+surl+'|'+pwd+'|'+response.shareid+'|'+uInfo.uk+'|'+ `[${fsid}]`+'|'+getStorage.getCommonValue('start')+'|'+uInfo.baidu_name+'|'+getSelectedFileList()[0].server_filename+'|'+token+'|'+nau
        //远程请求直链下载地址
        let details = {
            method: 'POST',
            responseType: 'json',
            timeout: 30000, // 30秒超时
            url: downloadUrl,
            data: par,
            onloadstart: function () {
                let tmpTips = '正在远程请求直链地址...';
                if (domain == globalData.domainB) tmpTips = '快好了，再耐心等一下下...';
                if (token) tmpTips = '人机验证通过~ ' + tmpTips;
                showTipInfo(tmpTips)
            },
            onload: function (res) {
                console.log('远程请求直链地址，返回：', res);
                if (res.status === 200) {
                    switch (res.response.errno) {
                        case 0: // 正常返回
                        case 103: // aria2 only
                            setShareCompleteState(true);
                            changeClickEvent(res.response);
                            saveStartState();
                            showQrTips(res.response);
                            break;
                        case 100: // 版本太旧
                            setShareCompleteState();
                            showTipErrorSwal(res.response.err);
                            break;
                        case 101: // vaptcha验证不成功
                            setShareCompleteState();
                            showTipInfo(res.response.err);
                            getJquery()('#dialogVaptchaCode').show();
                            showQrTips(res.response);
                            break;
                        case 102: // 慢速直链
                            setShareCompleteState();
                            showTipInfo(res.response.err);
                            break;
                        case 104: // 需要手势验证
                            showTipInfo(res.response.err);
                            setShareCompleteState();
                            vaptchaValidate();
                            break;
                        case 1001: // 重试
                            console.error(res);
                            if (domain == globalData.domainB) {
                                showTipInfo('发生错误！')
                                showTipError(res.response.err);
                                setShareCompleteState();
                            } else {
                                //非备用接口请求时，就继续使用备用接口再请求1次
                                getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
                            }
                            break;
                        default: // 其它错误
                            showTipInfo('发生错误！')
                            showTipError(res.response.err);
                            setShareCompleteState();
                            break;
                    }
                } else {
                    console.error(res);
                    if (domain == globalData.domainB) {
                        showTipInfo('发生错误！')
                        showTipError('请求直链下载地址失败！服务器返回：' + res.status);
                        setShareCompleteState();
                    } else {
                        //非备用接口请求时，就继续使用备用接口再请求1次
                        getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
                    }
                }
            },
            ontimeout: (res) => {
                console.error(res);
                if (domain == globalData.domainB) {
                    showTipInfo('发生错误！')
                    showTipError('请求直链下载地址时连接服务器接口超时，请重试！');
                    setShareCompleteState();
                } else {
                    //非备用接口请求时，就继续使用备用接口再请求1次
                    getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
                }
            },
            onerror: (res) => {
                console.error(res);
                if (domain == globalData.domainB) {
                    showTipInfo('发生错误！')
                    showTipError('请求直链下载地址时连接服务器接口出错，请重试！');
                    setShareCompleteState();
                } else {
                    //非备用接口请求时，就继续使用备用接口再请求1次
                    getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            showTipInfo('发生错误！')
            showTipError('远程请求未知错误，请重试！');
            setShareCompleteState();
            console.error(error);
        }
    }

    //查询接口地址-->发起服务器请求
    let getDownloadUrl = function (response, pwd, fsid, token) {
        let bdUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=477485340";
        let details = {
            method: 'GET',
            timeout: 10000, // 10秒超时
            url: bdUrl + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                try {
                    showTipInfo('正在查询服务器接口地址...');
                    // console.log(res);
                    if (res.status === 200) {
                        // console.info(res);
                        if (res.response.errno == 0) {
                            let ifDomain = res.response.user_info.intro;
                            //let ifDomain = 'http://localhost:48818'
                            // console.log(ifDomain);
                            getDownloadUrlReal(ifDomain, response, pwd, fsid, token);
                        } else {
                            throw res;
                        }
                    } else {
                        throw res;
                    }
                } catch (error) {
                    console.error(error);
                    getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
            getDownloadUrlReal(globalData.domainB, response, pwd, fsid, token);
        }
    }

    //请求直链成功后，改变按钮点击事件
    let changeClickEvent = function (res) {
        //显示操作按钮
        getJquery()("#dialogOpButtons").show();
        if (res.errno == 0) {
            //正常返回：复制直链下载地址
            showTipInfo('获取直链成功，请在下方选择下载方式。');
            let url = res.aria2info.params[1][0];
            getJquery()("#dialogBtnIdm").attr("data-clipboard-text", url);
        } else {
            //Aria2 下载提示（隐藏idm下载按钮）
            showTipInfo(res.err);
            getJquery()("#dialogBtnIdm").hide();
            getJquery()("#dialogOpTipsIdm").hide();
        }
        //发送至Aria2
        let btnAria2 = getJquery()("#dialogBtnAria");
        btnAria2.unbind();
        btnAria2.click(function () {
            ariaDownload(res);
        });
    }
    //请求直链成功后，tips
    let showQrTips = function (res) {
        let qrImg = getJquery().trim(res.qrImg);
        let qrTips = getJquery().trim(res.qrTips);
        let codeTips = getJquery().trim(res.codeTips);
        let codeRemark = getJquery().trim(res.codeRemark);
        //console.log(qrImg, qrTips);
        if (qrImg.length > 0) {
            getJquery()("#dialogQrImg").attr('src', qrImg);
        }
        if (qrTips.length > 0) {
            getJquery()("#dialogBottom").html(qrTips);
        }
        if (codeTips.length > 0) {
            getJquery()("#dialogVaptchaCodeTips").html(codeTips).show();
        }
        if (codeRemark.length > 0) {
            getJquery()("#dialogCodeRemark").html(codeRemark).show();
        }
    }
    //请求直链成功后，xxxx
    let saveStartState = function (res) {
        let start = getStorage.getCommonValue('start');
        if (start) return;
        start = new Date().getTime();
        getStorage.setCommonValue('start', start);
    }
    //发送至aria2
    let ariaDownload = function (response) {
        let rpcDir = (getJquery()("#dialogTxtSavePath").val()).replace(/\\/g, '/');
        let rpcUrl = getJquery()("#dialogAriaRPC").val();
        let rpcToken = getJquery()("#dialogAriaToken").val();
        //使用自己的Aria2
        if (getConfig().mine == "checked") {
            if (response.errno == 0) {
                //正常返回
                delete response.aria2info.params[2].dir;
                delete response.aria2info.params[2]['max-connection-per-server'];
                delete response.aria2info.params[2].split;
                delete response.aria2info.params[2]['piece-length'];
            } else {
                //Aria2 only
                delete response.aria2info.params[0][0].params[2].dir;
                delete response.aria2info.params[0][0].params[2]['max-connection-per-server'];
                delete response.aria2info.params[0][0].params[2].split;
                delete response.aria2info.params[0][0].params[2]['piece-length'];
            }
        }
        let data = JSON.stringify(response.aria2info);
        data = data.replace('{{{rpcDir}}}', rpcDir).replace('{{{rpcToken}}}', rpcToken);
        //发送至aria2
        let details = {
            method: 'POST',
            responseType: 'json',
            timeout: 3000, // 3秒超时
            url: rpcUrl,
            data: data,
            onloadstart: function () {
                setSendAriaStartState();
            },
            onload: function (res) {
                console.log('发送至Aria2，返回：', res);
                if (res.status === 200) {
                    if (res.response.result) {
                        // 正常返回
                        setSendAriaCompleteState(true);
                        showTipInfoAria('Aria2已经开始下载了，切换过去看看吧~');
                    } else {
                        // 其它错误
                        showTipInfoAria('发生错误！')
                        showTipError(res.response.message);
                        setSendAriaCompleteState(false);
                    }
                } else {
                    showTipInfoAria('发生错误！')
                    showTipError('发送至Aria2失败！<br />服务器返回：' + res.responseText);
                    setSendAriaCompleteState(false);
                    console.error(res);
                }
            },
            ontimeout: (res) => {
                showTipInfoAria('发生错误！')
                showTipError('连接到RPC服务器超时：请检查Aria2是否已连接，RPC配置是否正确！');
                setSendAriaCompleteState(false);
                console.error(res);
            },
            onerror: (res) => {
                showTipInfoAria('发生错误！')
                showTipError('发送至Aria2时发生错误，请重试！');
                setSendAriaCompleteState(false);
                console.error(res);
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            showTipInfoAria('发生错误！')
            showTipError('发送至Aria2时发生未知错误，请重试！');
            setSendAriaCompleteState(false);
            console.error(error);
        }
    }
    //保存用户输入的数据（下次当默认值使用）
    let saveLastUseData = function () {
        getStorage.setLastUse('savePath', getJquery()("#dialogTxtSavePath").val());
        getStorage.setLastUse('jsonRpc', getJquery()("#dialogAriaRPC").val());
        getStorage.setLastUse('token', getJquery()("#dialogAriaToken").val());
        let mine = "";
        if (getJquery()("#dialogAriaMine").prop("checked") == true) {
            mine = "checked";
        }
        getStorage.setLastUse('mine', mine);
        getStorage.setLastUse('code', getJquery()("#dialogCode").val());
    }

    //复制直链下载地址
    let copyUrl2Clipboard = function () {
        let copyBtn = new ClipboardJS('#dialogBtnIdm')
        copyBtn.on("success", function (e) {
            showTipInfoIdm(`直链下载地址复制成功！`)
        });
    }

    //========================================= 公共函数
    function CutString(str, len, suffix) {
        if (!str) return "";
        if (len <= 0) return "";
        if (!suffix) suffix = "...";
        let templen = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                templen += 2;
            } else {
                templen++
            }
            if (templen == len) {
                return str.substring(0, i + 1) + suffix;
            } else if (templen > len) {
                return str.substring(0, i) + suffix;
            }
        }
        return str;
    }

    function getRndPwd(len) {
        len = len || 4;
        let $chars = 'AEJPTZaejptz258';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function checkVsite() {
        let vDomain = document.domain.split('.').slice(-2).join('.');
        if (vDomain == 'vaptcha.com') return true;
        return false;
    }

    // 延迟执行，否则找不到对应的按钮
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    /**
     * 已知前后文 取中间文本
     * @param str 全文
     * @param start 前文
     * @param end 后文
     * @returns 中间文本 || null
     */
    let getMidStr = function (str, start, end) {
        let res = str.match(new RegExp(`${start}(.*?)${end}`))
        return res ? res[1] : null
    }

    let getPageType = function () {
        if (isOldHomePage()) return 'old';
        if (isNewHomePage()) return 'new';
        if (isSharePage()) return 'share';
        return '';
    }

    //========================================= css
    GM_addStyle(`
        .swal-modal {
            width: auto;
            min-width: 730px;
        }
        #downloadDialog{
            width: 730px;
            font-size:14px;
        }

        #dialogTop{
            margin: 20px 0;
        }
        #dialogFileName{
            color: blue;
            text-decoration:underline;
        }

        #dialogMiddle{}
        #dialogLeftTips{
            text-align: left;
            margin: 0 0 10px 0px;
            color: #4c4433;
            font-size: 13px;
        }
        #dialogLeftTips1,#dialogLeftTips2{
            margin-bottom: 5px;
            background: #f4c758;
            padding: 5px 0 5px 0;
            border-radius: 4px;
        }
        .dialogLeftTipsLink{
            text-align: center;
        }
        #dialogRight{
            width: 50%;
            float: left;
            margin-left: 15px;
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
            display: none;
            text-align: left;
            margin-top: 5px;
            font-size: 12px;
            border: 2px solid #EDD;
        }
        #dialogVaptchaCodeInput{
            font-size: 14px;
        }
        #dialogCode{
            width: 50%;
            border: 1px grey solid;
        }
        #dialogCodeRemark{}
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
            margin: 15px -20px 0 -20px;
            background: #f4c758;
            padding: 10px 0 10px 25px;
            color: #4c4433;
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
        .btnGreen {
            background: #5cb85c !important;
        }

        #dialogDivSavePath{
            margin-top: 2px;
            text-align: left;
        }
        #dialogOpTips, #dialogOpTipsAria, #dialogOpTipsIdm{
            display: none;
            background: #f4c758;
            padding: 3px 14px;
            color: #4c4433;
            border-radius: 2px;
            font-weight: bold;
            text-align: left;
            margin-top: 2px;
        }
        #dialogOpButtons{
            display: none;
        }
        #dialogBtnIdm, #dialogBtnAria{
            margin-top: 15px;
        }
        #dialogAriaConfig{
            display: none;
            margin-top: 2px;
        }
        #dialogAriaConfigClick{
            color: #0098EA;
            text-decoration: underline;
            cursor:pointer;
            font-size: 12px;
            padding-left: 6px;
        }
        #dialogAriaConfig{
            font-size: 12px;
        }
        #dialogLeft{
            float: left;
            width: 47%;
        }
        .swal-footer{
            margin-top: 5px;
        }
    `);
    // ==================================== 逻辑代码开始
    console.log('脚本开始');
    getParams();
    getUInfo();

    const divTips = document.createElement('div');
    divTips.id = "divTips";

    let isLogin = document.querySelector('.login-main'); // 登录页面
    let isVsite = checkVsite();

    //载入vaptcha
    let vaptchaAll = null;

    let btnDownload = {
        id: 'btnEasyHelper',
        text: 'EasyDown',
        title: '使用高速下载',
        html: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return `
                    <span class="g-button-right">
                        <em class="icon icon-download" style="color:#ffffff" title="${this.text}"></em>
                        <span class="text" style="width: auto;">${this.text}</span>
                    </span>
                `
            }
            if (pageType === 'new') {
                return `
                    <button class="u-btn nd-file-list-toolbar-action-item is-need-left-sep u-btn--danger u-btn--default u-btn--small is-has-icon">
                        <i class="iconfont icon-download"></i>
                        <span>${this.text}</span>
                    </button>
                `;
            }
        },
        style: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'margin: 0px;';
            }
            if (pageType === 'new') {
                return '';
            }
        },
        class: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'g-button g-button-red-large';
            }
            if (pageType === 'new') {
                return '';
            }
        }
    }

    let start = function () {//迭代调用
        if (isVsite) return;
        let pageType = getPageType();
        if (pageType === '') {
            console.log('非正常页面，1秒后将重新查找！');
            sleep(500).then(() => {
                start();
            })
            return;
        }

        // 创建按钮 START
        let btn = document.createElement('a');
        btn.id = btnDownload.id;
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html(pageType);
        btn.style.cssText = btnDownload.style(pageType);
        btn.className = btnDownload.class(pageType);
        btn.addEventListener('click', function (e) {
            initButtonEvent();
            e.preventDefault();
        });
        // 创建按钮 END

        // 添加按钮 START
        let parent = null;
        if (pageType === 'old') {
            let btnUpload = document.querySelector('[node-type=upload]');
            parent = btnUpload.parentNode;
            parent.insertBefore(btn, parent.childNodes[0]);
        } else if (pageType === 'new') {
            let btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']");
            btnUpload.insertBefore(btn, btnUpload.childNodes[0]);
        } else if (pageType === 'share') {
            let btnQrCode = document.querySelector('[node-type=qrCode]');
            parent = btnQrCode.parentNode;
            parent.insertBefore(btn, btnQrCode);
        }
        // 添加按钮 END

        // 修改搜索框宽度，否则在小显示器上，元素会重叠
        document.querySelectorAll('span').forEach((e) => {
            if (e.textContent.includes('搜索您的文件')) {
                let divP = e.parentNode.parentNode.parentNode
                divP.style.maxWidth = '200px';
            }
        });
    }

    sleep(500).then(() => {
        start();
    })
})();
//############################################