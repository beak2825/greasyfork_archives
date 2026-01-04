// ==UserScript==
// @name         百度网盘简易下载助手修改
// @namespace    http://bd.softxm.cn/bd/
// @version      1.5.7
// @antifeature  membership
// @license       ALGP lience
// @description  一个纯净好用的直链下载助手，绝无多余附加功能。免SVIP会员，免安装浏览器扩展，无视黑号，只要你有个IDM或Aria2，就能享受极速下载的快感！
// @author       mingli
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
// @connect      softxm001.club
// @connect      softxm002.club
// @connect      softxm003.club
// @connect      softxm004.club
// @connect      softxm005.club
// @connect      softxm006.club
// @connect      softxm007.club
// @connect      softxm008.club
// @connect      softxm009.club
// @connect      baidu.com
// @downloadURL https://update.greasyfork.org/scripts/453713/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%AE%80%E6%98%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/453713/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%AE%80%E6%98%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let globalData = {
        scriptVersion: '1.5.6',
        domain: 'http://softxm.vip',
        domainB: 'http://bd.yyxxs.cn',
        param: '',
        downloading: 0,
        sending: 0,
        storageNamePrefix: 'softxm_storageName', // 本地储存名称前缀
        paramDomain: `https://softxm.lanzoui.com`, // 教程跳转地址
        paramDomain2: `https://pic.rmb.bdstatic.com`, // 教程跳转地址
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            param: globalData.param,
            storageNamePrefix: globalData.storageNamePrefix,
            getDownloadUrl: `/bd/getDownloadUrl2.php`,
            // paramUrl: `${globalData.paramDomain}/params.data.localhost`, // 教程跳转地址
            // paramUrl: `${globalData.paramDomain}/b01nqc7yj`, // 教程跳转地址
            aria2DownloadUrl: `${globalData.paramDomain}/b01nqc7yj`, // Aria2软件下载地址
            aria2CourseUrl: `https://www.cnblogs.com/softxmm/p/13972678.html#aria2`, // Aria2教程地址
            idmDownloadUrl: `https://www.cnblogs.com/softxmm/p/13972678.html#idm`, // idm教程地址
        }
    }


    let tempCount =0;

    let resList = [];


    let fileCount = 0;

    let tempDateList = [];

    let tmpData = {
        response: '',
        pwd: '',
        fs_id: '',
        token: '',
    }

    let configDefault = {
        savePath: '/newData/download/',
        jsonRpc: 'http://193.122.103.185:10085/jsonrpc',
        token: '8cce22b2afde038de045',
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
            let mainList = document.querySelector('.nd-main-list');
            if (!mainList) mainList = document.querySelector('.nd-new-main-list');//20220524 新版
            return mainList.__vue__.selectedList;
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
        //暂时限制只能在管理页面中使用
        if (pageType === 'share') {
            showTipErrorSwal('必须先转存到自己网盘中，然后进入网盘进行下载！');
            console.log('必须先转存到自己网盘中');
            showShareSave();
        } else {
            let fileList = getSelectedFileList();
            let fileStat = getFileListStat(fileList);
            if (fileList.length) {
                //if (fileStat.dir_num > 0) {
                //    showTipError('请选择一个文件进行下载（暂时不支持文件夹和多文件批量下载）')
                //}
                if (fileStat.dir_num == 0) { // && fileStat.file_num == 1
                    showDownloadDialog(fileList, fileStat);
                    fileCount =  fileList.length;
                    setShareCompleteState();
                    //自动下载
                    // getJquery()("#dialogBtnGetUrl").click();
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
            option.button = '朕 知 道 了'
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

    //对象拷贝
    function copyObject(obj) {
			let newObj = {};
			for (let i in obj) {
				// 递归（实现深度拷贝）
				if (obj[i] instanceof Object) {
					newObj[i] = copyObject(obj[i]);
				} else {
					newObj[i] = obj[i];
				}

			}
			return newObj;
	}

    //下载面板
    let showDownloadDialog = function (fileList, fileStat) {
        let theFiles = fileList;
        // console.log(theFile);
        let content = `
            <div id="downloadDialog">
                <div id="dialogTop">
                    请点击下方按钮，开始下载 <span id="dialogFileName">${CutString(theFiles[0].server_filename, 40)}</span>
                </div>
                <div id="dialogMiddle">
                    <div id="dialogLeft">
                        <div id="dialogLeftTips">
                            <div id="dialogLeftTips1">
                                <strong>【方式1】</strong>IDM 必须设置4线程及修改UA（以教程为准）</strong>
                                <div class="dialogLeftTipsLink">
                                    <a href="${getAppSettingData().aria2DownloadUrl}" target="_blank">【点击下载IDM】</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${getAppSettingData().idmDownloadUrl}" target="_blank">【IDM配置教程】</a>
                                </div>
                            </div>
                            <div id="dialogLeftTips2">
                                <strong>【方式2】</strong>Aria2 无需配置即可使用
                                <div class="dialogLeftTipsLink">
                                    <a href="${getAppSettingData().aria2DownloadUrl}" target="_blank">【点击下载Aria2】</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${getAppSettingData().aria2CourseUrl}" target="_blank">【Aria2使用教程】</a>
                                </div>
                            </div>
                        </div>
                        <div id="dialogQr">
                            <img id="dialogQrImg" src="https://pic.rmb.bdstatic.com/bjh/faa1661e54ab1bf491bf630fe16f277b.gif" />
                        </div>
                    </div>
                    <div id="dialogRight">
                        <div id="dialogContent">
                            <input id="dialogBtnGetUrl" type="button" value="点击获取直链地址" class="btnInterface" />
                            <div id="dialogRemark">
                                <!--
                                ■ IDM下载速度<strong>6M/s</strong>左右，Aria2下载速度可以<strong>跑满带宽</strong>
                                <br />
                                -->
                                ■ 下载速度<strong>因人而异</strong>，特别是共享网络（例如 校园网）
                            </div>
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
                <div id="dialogBottom">众所周知的原因，脚本不可能常在，但作者常在，关注才能不迷路！！！</div>
            </div>
        `;
        showSwal(content, {
            button: '关 闭',
            closeOnClickOutside: false
        });

        //分享（入口 ）
        let dialogBtnClick = function () {
            for(var i = 0;i<theFiles.length;i++){

                let theFile = theFiles[i];
                //if (globalData.downloading === 1) {
                //    return false;
                //}
               
                setShareStartState();
                //判断是否已分享过该文件（不重复分享，仅限于当前窗口的上一次分享）
                let t;
                if(tempDateList.length > 0 ){
                   t  = getTmpData(tempCount);
                }
                if (t && t.response && t.fs_id == theFile.fs_id) {
                    console.warn('已分享过此文件，不再重复分享');
                    getDownloadUrl(t.response, t.pwd, t.fs_id, '');
                    console.log(t);
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
                    synchronous: true,
                    responseType: 'json',
                    timeout: 20000, // 10秒超时
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
                  console.log(details);
                  GM_xmlhttpRequest(details);
                } catch (error) {
                    showTipInfo('发生错误！')
                    showTipError('未知错误，请重试！');
                    setShareCompleteState();
                    console.error(error);
                }

            }
            tempCount = 0;
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


    let aria2Download  = function(){
		if( tempCount === fileCount){
			 for(var j = 0; j <resList.length;j++){
                 console.log(resList[j]);
                 changeClickEvent(resList[j]);
            }
		}

	}

    //请求备用参数
    let getParams = function () {
        let hkUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=2942844742";
        // let hkUrl = "http://localhost:48818/bd/getinfo.php?query_uk=2942844742";
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
        // getJquery()("#dialogBtnAria").val('正在发送至Aria2...');
        //保存用户输入的数据
        saveLastUseData();
    }
    let setSendAriaCompleteState = function (isSuccess) {
        globalData.sending = 0;
        if (isSuccess) {
            getJquery()("#dialogBtnAria").val('Aria2已经开始下载了');
            // showTipInfoAria('Aria2已经开始下载了');
        } else {
            getJquery()("#dialogBtnAria").val('发送至Aria2');
            // showTipInfoAria('Aria2已经开始下载了，切换过去看看吧~');
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

        let tempDataLocal = {
            response:response,
            pwd:pwd,
            fs_id:fs_id,
            token:token
        };
        tempDateList.push(tempDataLocal);
    }
    let getTmpData = function (tempCount) {
        return tempDateList[tempCount];
    }
    let saveRes = function(res){
        resList.push(res);
    }

    //手势验证成功后，服务器获取直链地址
    let getDownloadUrlReal = function (domain, response, pwd, fsid, token) {
        // console.log('分享成功后返回：', response);
        let au = getJquery()('#dialogQrImg').attr('src');
        let shorturl = response.shorturl;
        let surl = shorturl.substring(shorturl.lastIndexOf('/') + 1, shorturl.length);
        let downloadUrl = `${getAppSettingData().getDownloadUrl}?version=${getAppSettingData().scriptVersion}&t=8888` + new Date().getTime();
        downloadUrl = domain + downloadUrl + getAppSettingData().param;

        let params = new FormData();
        params.append('surl', surl);
        params.append('pwd', pwd);
        params.append('shareid', response.shareid);
        params.append('from', uInfo.uk);
        params.append('fsidlist', `[${fsid}]`);
        params.append('start', getStorage.getCommonValue('start'));
        params.append('code', getJquery()('#dialogCode').val().trim());
        params.append('u', uInfo.baidu_name);
        params.append('fn', getSelectedFileList()[0].server_filename);
        params.append('token', token);
        params.append('au', au.indexOf(globalData.paramDomain2) == 0 ? '' : au);
        //远程请求直链下载地址
        let details = {
            method: 'POST',
            responseType: 'json',
            synchronous: true,
            timeout: 30000, // 30秒超时
            url: downloadUrl,
            // data: `surl=${surl}&pwd=${pwd}`, --php端收不到数据
            data: params,
            onloadstart: function () {
                let tmpTips = '正在远程请求直链地址...';
                if (domain == globalData.domainB) tmpTips = '快好了，再耐心等一下下...';
                if (token) tmpTips = '人机验证通过~ ' + tmpTips;
                showTipInfo(tmpTips)
            },
            onload: function (res) {
                // console.log('请求参数：');
                // params.forEach((value, key) => {
                //      console.log("%s --> %s", key, value);
                // })
                console.log('远程请求直链地址，返回：', res);
                if (res.status === 200) {
                    switch (res.response.errno) {
                        case 0: // 正常返回
                        case 103: // aria2 only
                            setShareCompleteState(true);
                            //changeClickEvent(res.response);
                            saveRes(res.response);
                            saveStartState();
                            showQrTips(res.response);
                            tempCount++;
                            aria2Download();
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
        // let bdUrl = "http://localhost:48818/bd/getinfo.php?query_uk=477485340";
        let details = {
            method: 'GET',
            synchronous: true,
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
       // btnAria2.click();
        downloadDirect(res);
    }
    //直接请求aria2c下载
    let downloadDirect = function(res){
            ariaDownload(res);
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
            synchronous: true,
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
            // 复制成功（右键下载不好使，别再尝试了）
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
        .swal-modal input {
            border: 1px grey solid;
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
        .dialogLeftTipsLink a{
            color: #06a7ff;
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
        text: '简易下载助手',
        title: '使用百度网盘简易下载助手进行下载',
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
                    <button class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--danger u-button--default u-button--small is-has-icon">
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
            let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
            parent = btnUpload.parentNode;
            parent.insertBefore(btn, parent.childNodes[0]);
        } else if (pageType === 'new') {
            let btnUpload;
            btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']"); // 管理页面：【新建文件夹】
            if (btnUpload) {
                btn.style.cssText = 'margin-right: 5px;';
                // alert('inline-block-v-middle');
                btnUpload.insertBefore(btn, btnUpload.childNodes[0]);
            } else {
                btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-default-skin is-header-tool']"); // 20220612管理页面：整个工具条
                // console.log(btnUpload);
                if (!btnUpload) {
                    btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-header-tool']"); // 20220629管理页面：整个工具条
                }
                let parentDiv = document.createElement('div');
                parentDiv.className = 'wp-s-agile-tool-bar__h-action is-need-left-sep is-list';
                parentDiv.style.cssText = 'margin-right: 10px;';
                parentDiv.insertBefore(btn, parentDiv.childNodes[0]);
                btnUpload.insertBefore(parentDiv, btnUpload.childNodes[0]);
            }
        } else if (pageType === 'share') {
            let btnQrCode = document.querySelector('[node-type=qrCode]'); // 分享页面：【保存到手机】
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
//###########################################