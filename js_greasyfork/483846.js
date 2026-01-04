// ==UserScript==
// @name              Coinw助手
// @namespace         coinw
// @version           3.1.4
// @author            Hacker
// @description       Coinw 助手
// @license           MIT
// @homepage          https://www.coinw.com
// @match             *://*.coinw.com/*
// @match             *://*.coinw.casino/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/buffer.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/index.js
// @require           https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @resource          toastrStyle https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @connect           coinw.com
// @connect           dwei.xin
// @connect           www.tulingtech.xyz
// @connect           www.jfbym.com
// @connect           *
// @noframes
// @run-at            document-idle
// @grant             GM_openInTab
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @grant             GM_cookie
// @grant             GM_download
// @grant             unsafeWindow
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMTEuMSAyOGwzMy40IDMzIDIyLjktMjIuNkw5MC4zIDYxIDEwNiA0NS40bC03LjctNy43SDEyOHYyOS43bC03LjgtNy44LTMwIDI5LjYtMjIuOS0yMi40LTIyLjcgMjIuNy0yNC4zLTI0Yy4zIDEwLjcgNC42IDIxLjQgMTIuOCAyOS42IDE1LjggMTUuOCA0MC45IDE3IDU4LjEgMy42bDE0LjMgMTQuM2MtMTEuOSA5LjktMjYuNyAxNS00MS40IDE1LTE2LjUgMC0zMi44LTYuMy00NS40LTE4LjdDLTMuNCA4Ny4yLTUuOSA1Mi45IDExLjEgMjh6bTkuMy0xMC45YzIzLjktMjIuMSA2MC40LTIyLjcgODUtMkw5MC45IDI5LjJDODMgMjMgNzMuNiAyMCA2NCAyMGMtMTAuNSAwLTIxIDMuOC0yOS4zIDExLjJMMjAuNCAxNy4xeiIvPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/483846/Coinw%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483846/Coinw%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const baseAPI = `https://metaapi.dwei.xin`;

    const domain = document.domain;
    let inviteUrl = `https://${domain}/front/register?r=${GM_getValue('inviteCode')}`; //有邀请码注册链接 r后面是邀请码
    let inviteUrlWithout = `https://${domain}/front/register`; //无邀请码注册链接

    const withdrawInner = true; //自动跳转到提现页面

    const customClass = {
        container: 'coinw-container',
        popup: 'coinw-popup',
    };

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        customClass
    });

    let main = {
        from: null,
        to: null,
        sub: null,
        emailCode: '',
        wsMainRes: {},
        wsRes: {},
        isInGeetest: false,

        async getAccountById(id) {
            try {
                let {res} = await util.post(`${baseAPI}/v1/coinw_account/get_one`,
                    {"status": 'all', "id": id}, {
                        'content-type': 'application/json;charset=UTF-8',
                    });
                if (res.code === 200) {
                    return res.data;
                }
                return null;
            } catch (e) {
                util.message.error('无法连接服务器，请刷新重试！');
            }
        },

        async uploadToMysqlCookie(email) {
            //获取cookie
            let cookies = await util.exportCookie();
            let accessToken = localStorage.getItem('accessToken');  //{"type":"string","data":"3ee3367af1769285c2d94eb732a9fdfee168b851a29eccf2d1ebb2bb50aac5e1"}
            if (!accessToken) {
                return toast.fire({icon: 'error', title: '未找到accessToken'});
            }
            let cookieValue = cookies.map((item) => {
                return item.name + '=' + item.value;
            }).join('; ');
            let {res} = await util.post(`${baseAPI}/v1/coinw_account/update_one`, {
                email: email,
                cookie: cookieValue,
                access_token: JSON.parse(accessToken).data,
            }, {
                'content-type': 'application/json;charset=UTF-8',
            });
            if (res.code === 200) {
                toast.fire({icon: 'success', title: '更新成功'});
            } else {
                toast.fire({icon: 'error', title: '更新失败'});
            }
        },

        async uploadToMysqlGoogle(email) {
            let googleSecret = util.getValue('googleSecret');
            if (!googleSecret) {
                return toast.fire({icon: 'error', title: '未找到googleSecret'});
            }
            if (main.from.google_secret && main.from.google_secret !== googleSecret) {
                return toast.fire({icon: 'error', title: '该账号在服务器上已存在 Google 密钥！'});
            }
            toastr.success(googleSecret, '获取 Secret 成功');
            let {res} = await util.post(`${baseAPI}/v1/coinw_account/update_one`, {
                email: email,
                google_secret: googleSecret,
            }, {
                'content-type': 'application/json;charset=UTF-8',
            });
            if (res.code === 200) {
                toast.fire({icon: 'success', title: '更新成功'});
                history.go(0);
            } else {
                toast.fire({icon: 'error', title: '更新失败'});
            }
        },

        addStyle() {
            //样式
            GM_addStyle(`
                body .coinw-container { z-index: 99999!important; }
                .coinw-popup { font-size: 16px !important; }
                #tm-hide-control {right: -14px; background: #ddd; opacity: .5; cursor: pointer; border-radius: 0 5px 5px 0; transition: all .3s; z-index: 10; position: absolute; bottom: 30px; user-select: none; width: 14px; display: flex; align-items: center; justify-content: center; height: 36px; }
                #tm-hide-control:hover { opacity: 1; transition: all .3s; }
                .tm-hide {display: none; }
                #tm-btn-box { z-index:999999999999 ;position: fixed; left: 0; bottom: 5px; font-size:12px;text-align:left }
                #tm-update { display: flex; align-items: center; color: #000000; opacity: 0.6;line-height: 1.1; font-size:12px}
                .tm-col-2 { display: grid; grid-column: 2; grid-template-columns: 1fr 1fr; grid-gap: 5px;}
                .tm-btn { display: block;cursor: pointer; padding:5px 4px;background: #d6d6d6; margin: 5px 0 0; color: #000; line-height: 1.1; border-radius: 3px;}
                .tm-btn a{ color: #000; display:block}
                .tm-form-input { outline-style: none; border: 1px solid #ccc; border-radius: 3px; padding: 0 6px; width: 200px; height: 32px;box-sizing:border-box;}
                .tm-form-button { width: 80px; height: 32px; border-radius: 3px; background: #1E90FF; outline: none; color: white; border: none;}
                .tag { display: inline-block; font-size: 12px; border-radius: 4px; box-sizing: border-box; white-space: nowrap;background-color: #409eff; color: #fff; padding: 0 5px;}
                .tag-success { background-color: #67c23a; border-color: #67c23a; color: #fff;}
                .tag-danger { background-color: #f56c6c; border-color: #f56c6c; color: #fff;}
                .tm-task {display: block; padding-top: 3px; padding-bottom: 3px;line-height:14px;position:relative; }
                .tm-btn:hover { background: #9d9d9d; transition: all 0.3s; }
                .tm-btn:active { opacity: 0.7; transition: all 0.1s; }
                .task-list { font-size: 12px; background: #bbb; padding: 5px; color: #077442; margin-top: 5px;}
                .task-list a { color: #077442; }
                .task-list a:hover { color: #07744291; }
                #script-info header { position: sticky; top: 0; z-index: 9; background: #ffffff96; backdrop-filter: blur(6px); }
                #inputImportCookie{ position: absolute; overflow: hidden; height: 14px; width: 100%; opacity: 0; line-height: 14px; }
                .swal2-container {z-index: 3000!important;}
                `);
            GM_addStyle(GM_getResourceText('toastrStyle'));
        },

        /**
         * 配置默认值
         */
        initValue() {
            let value = [{
                name: 'number',
                value: 0
            }, {
                name: 'show',
                value: true
            }, {
                name: 'from',
                value: ''
            }, {
                name: 'to',
                value: ''
            }, {
                name: 'sub',
                value: ''
            }, {
                name: 'interval',
                value: 5000
            }, {
                name: 'inviteCode',
                value: ''
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        addButton() {
            let button = $(`<div id="tm-btn-box">
              <div id="tm-hide-control">${util.getValue('show') ? '<' : '>'}</div>
              <div id="tm-content" class="${util.getValue('show') ? '' : 'tm-hide'}">
                <div class="tm-btn">配置参数
                  <div class="task-list">
                    <div class="tm-task"><span class="tag" id="clearIns" style="margin-right: 10px;">清除定时器</span><span id="tm-input0">${util.getValue('interval') ? '间隔：' + util.getValue('interval') : '<span style="color:#bc2020">设置监听间隔</span>'}</span></div>
                    <div class="tm-task"><span class="tag" id="from" style="margin-right: 10px;"></span><span id="tm-input1">${util.getValue('from') ? 'From：' + util.getValue('from') : '<span style="color:#bc2020">请选择账号</span>'}</span></div>
                  </div>
                </div>
                <div class="tm-btn">提现
                  <div class="task-list">
                    <div class="tm-task" id="withdrawA">0. 自动填写提币信息</div>
                  </div>
                </div>
                <div class="tm-btn">绑定Google和交易密码
                  <div class="task-list">
                    <div class="tm-task" id="task-toMysql-cookie">0. 上传 Cookie 和 Token 到后台</div>
                    <div class="tm-task">==========================</div>
                    <div class="tm-task" id="bindGoogleA">1. 绑定Google</div>
                    <div class="tm-task" id="task-toMysql-google">2. 上传谷歌密钥到后台</div>
                    <div class="tm-task" id="setFundPasswordA">3. 设置交易密码</div>
                  </div>
                </div>
                <div class="tm-btn">识别验证码
                  <div class="task-list">
                    <div class="tm-task" id="geetestD">0. 自动识别九宫格验证码</div>
                  </div>
                </div>
                <div class="tm-btn">注册/登录
                  <div class="task-list">
                    <div class="tm-task" id="registerA">0. 自动注册（有邀请码）</div>
                    <div class="tm-task" id="registerB">0. 自动注册（无邀请码）</div>
                    <div class="tm-task">==========================</div>
                    <div class="tm-task" id="loginA">0. 自动登录</div>
                  </div>
                </div>
              </div>
            </div>`);
            $('body').append(button);
        },

        addPageListener() {
            $('body').on('click', '#tm-hide-control', () => {
                util.setValue('show', !util.getValue('show'));
                util.getValue('show') ? $('#tm-content').removeClass('tm-hide') : $('#tm-content').addClass('tm-hide');
                $('#tm-hide-control').text(util.getValue('show') ? '<' : '>');
            });
            //间隔
            $('body').on('click', '#tm-input0', () => {
                Swal.fire({
                    title: '请输入监听间隔',
                    input: 'text',
                    inputValue: util.getValue('interval'),
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请输入监听间隔',
                    },
                    confirmButtonText: '确定',
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        $('#tm-input0').text('间隔：' + result.value);
                        util.setValue('interval', result.value);
                    }
                });
            });

            //清除定时器
            $('body').on('click', '#clearIns', () => {
                util.clearAllInterval();
            });

            //选择账号1
            $('body').on('click', '#tm-input1', () => {
                Swal.fire({
                    title: '请选择主账号',
                    input: 'text',
                    inputValue: util.getValue('from'),
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择主账号',
                    },
                    confirmButtonText: '确定',
                    showDenyButton: true,
                    showCancelButton: true,
                    denyButtonText: `编号+1`,
                    cancelButtonText: `编号+2`,
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await util.clearAllLocalData();
                        $('#tm-input1').text('From：' + result.value);
                        util.setValue('from', result.value);
                        main.from = await main.getAccountById(result.value);
                        $('#from').text(main.from.email);
                        Swal.fire({
                            title: '是否导入Cookie？',
                            showDenyButton: true,
                            confirmButtonText: '导入',
                            denyButtonText: `不导入`,
                            customClass
                        }).then(async (res) => {
                            if (res.isConfirmed) {
                                // 登录页不能导入cookie，否则会退出登录
                                if (/front\/(login|register)/.test(location.href)) {
                                    return Swal.fire({
                                        title: '登录和注册页不能导入cookie，否则会退出登录！请前往首页后再导入',
                                        icon: 'error',
                                        customClass
                                    }).then(() => {
                                        location.href = `https://${domain}/`;
                                    });
                                }
                                let {cookie} = main.from;
                                let cookiesArray = cookie.split(';');
                                cookiesArray.map(async (item) => {
                                    let _cookie = item.split('=');
                                    let val = {
                                        name: _cookie[0].trim(),
                                        value: _cookie[1].trim(),
                                        domain: 'coinw.com',
                                        path: '/',
                                        expires: 2147483647,
                                        size: 0,
                                        httpOnly: false,
                                        secure: false,
                                        session: false
                                    };
                                    await util.importCookie(val);
                                });
                                localStorage.setItem('selectType', 'USD');  //设置币种
                                localStorage.setItem(`noopenhydataid${main.from.user_id}`, `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //开通合约弹窗
                                localStorage.setItem('todayShowAdTime', `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //广告弹窗
                                localStorage.setItem(`poptyjdataid${main.from.user_id}`, `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //广告弹窗
                                localStorage.setItem('accessToken', JSON.stringify({type: 'string', data: main.from.access_token}));
                                localStorage.setItem('userMenu', JSON.stringify({
                                    "type": "object", "data": {
                                        "assetRise": "0.00",
                                        "availableKR": false,
                                        "availableLanguage": ["ru_RU", "zh_TW", "en_US", "tr_TR", "zh_CN", "vi_VN", "es_ES", "ja_JP", "fr_FR", "pt_PT"],
                                        "hasRealValidate": false,
                                        "hasTradePassword": true,
                                        "id": main.from.user_id,
                                        "identityType": 0,
                                        "ip": null,
                                        "isBindEmail": true,
                                        "isBindGoogle": !!main.from.google_secret,
                                        "isBindTelephone": false,
                                        "loginName": "未知",
                                        "nickName": null,
                                        "totalAsset": "未知",
                                        "totalAssetExchange": "未知",
                                        "vipLevel": 1,
                                        "vipTop": false,
                                        "userInfo": {
                                            "availableKR": false,
                                            "availableLanguage": ["zh_CN", "en_US", "zh_TW", "vi_VN", "tr_TR", "ru_RU", "pt_PT", "ja_JP", "fr_FR", "es_ES"],
                                            "fid": main.from.user_id,
                                            "fisForbidWithdraw": 0,
                                            "hasC1Validate": false,
                                            "hasC2Validate": false,
                                            "hasC3Validate": false,
                                            "idDeductible": false,
                                            "identityNo": "******",
                                            "identityType": 0,
                                            "isBindEmail": true,
                                            "isBindMobil": false,
                                            "isGoogleBind": !!main.from.google_secret,
                                            "isHBTPartner": false,
                                            "isHasTradePWD": true,
                                            "isNewComer": true,
                                            "isSecondValidate": false,
                                            "loginName": main.from.email,
                                            "nationality": true,
                                            "nickName": "未知",
                                            "postC2Validate": false,
                                            "securityCount": 4,
                                            "tel": "未绑定",
                                            "vip": 1
                                        }
                                    }
                                }));
                                history.go(0);
                            }
                            if (res.isDenied) {
                                //$('#loginA').click();
                            }
                        });
                    } else if (result.isDenied) {
                        await util.clearAllLocalData();
                        let number = +util.getValue('from') + 1;
                        $('#tm-input1').text('From：' + number);
                        util.setValue('from', number);
                        main.from = await main.getAccountById(number);
                        $('#from').text(main.from.email);
                        //$('#loginA').click();
                    } else if (result.isDismissed && result.dismiss === 'cancel') {
                        await util.clearAllLocalData();
                        let number = +util.getValue('from') + 2;
                        $('#tm-input1').text('From：' + number);
                        util.setValue('from', number);
                        main.from = await main.getAccountById(number);
                        $('#from').text(main.from.email);
                        //$('#loginA').click();
                    }
                });
            });

            //提币
            $('body').on('click', '#withdrawA', async (event) => {
                let url = `https://${domain}/wallet/withdraw?symbolId=63`;
                if (location.href !== url) return location.href = url;

                main.listenElement('[aria-label="添加提幣地址"] .addWithdrawAddressDialog-dialog', async () => {
                    let inputGoogleCode = document.querySelector('[aria-label="添加提幣地址"] .el-dialog__body > div > div:nth-child(5) > div.el-input > input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));

                    let inputFundPwd = document.querySelector('[aria-label="添加提幣地址"] .el-dialog__body > div > div:nth-child(6) > div.el-input > input');
                    inputFundPwd.type = 'text';
                    util.setVueNativeValue(inputFundPwd, main.from.fund_password);

                    setInterval(() => {
                        util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });

                main.listenElement('[aria-label="安全驗證"] .addWithdrawAddressDialog-dialog', async () => {
                    let inputGoogleCode = document.querySelector('[aria-label="安全驗證"] .el-dialog__body > div > div:nth-child(3) > div.el-input > input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    let inputFundPwd = document.querySelector('[aria-label="安全驗證"] .el-dialog__body > div > div:nth-child(4) > div.el-input > input');
                    inputFundPwd.type = 'text';
                    util.setVueNativeValue(inputFundPwd, main.from.fund_password);

                    setInterval(() => {
                        util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });

                main.listenElement('[aria-label="添加提币地址"] .addWithdrawAddressDialog-dialog', async () => {
                    let inputGoogleCode = document.querySelector('[aria-label="添加提币地址"] .el-dialog__body > div > div:nth-child(5) > div.el-input > input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));

                    let inputFundPwd = document.querySelector('[aria-label="添加提币地址"] .el-dialog__body > div > div:nth-child(6) > div.el-input > input');
                    inputFundPwd.type = 'text';
                    util.setVueNativeValue(inputFundPwd, main.from.fund_password);

                    setInterval(() => {
                        util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });

                main.listenElement('[aria-label="安全验证"] .addWithdrawAddressDialog-dialog', async () => {
                    let inputGoogleCode = document.querySelector('[aria-label="安全验证"] .el-dialog__body > div > div:nth-child(3) > div.el-input > input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    let inputFundPwd = document.querySelector('[aria-label="安全验证"] .el-dialog__body > div > div:nth-child(4) > div.el-input > input');
                    inputFundPwd.type = 'text';
                    util.setVueNativeValue(inputFundPwd, main.from.fund_password);

                    setInterval(() => {
                        util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });
            });

            //绑定Google
            $('body').on('click', '#bindGoogleA', async (event) => {
                let url = `https://${domain}/front/user`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.setinfo', async () => {
                    document.querySelector('#coinw > div.user.router-view > div.pages > div > div.nm > div:nth-child(2) > div:nth-child(3) .nobind').click();
                });

                main.listenElement('.dialog-table .text-copy i', async () => {
                    let googleSecret = document.querySelector('.dialog-table .text-copy i').innerText;
                    if (!googleSecret) {
                        toastr.error('未获取到 Secret，请等待 Google 私钥显示后再点击！', '获取 Secret 失败');
                        return;
                    }

                    toastr.success(googleSecret, '获取 Secret 成功');
                    GM_setClipboard(googleSecret);
                    util.setValue('googleSecret', googleSecret);

                    await util.sleep(1000);

                    let inputGoogleCode = document.querySelector('.text-copy').nextElementSibling.querySelector('input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(util.getValue('googleSecret')));
                    setInterval(() => {
                        util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(util.getValue('googleSecret')));
                    }, util.getValue('interval'));

                    await util.sleep(500);
                    document.querySelector('.text-copy').nextElementSibling.nextElementSibling.querySelector('.el-input__suffix-inner div').click();
                });
            });

            //设置交易密码
            $('body').on('click', '#setFundPasswordA', async (event) => {
                let url = `https://${domain}/front/user`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.setinfo', async () => {
                    document.querySelector('#coinw > div.user.router-view > div.pages > div > div.nm > div:nth-child(4) > div:nth-child(2) .nobind').click();
                });

                main.listenElement('.popcontent', async () => {
                    await util.sleep(500);

                    let inputFuncPwd = document.querySelector('.popcontent div:nth-child(2) > input');
                    inputFuncPwd.type = 'text';
                    util.setVueNativeValue(inputFuncPwd, main.from.fund_password);
                    await util.sleep(100);

                    let inputReFundPwd = document.querySelector('.popcontent div:nth-child(3) > input');
                    inputReFundPwd.type = 'text';
                    util.setVueNativeValue(inputReFundPwd, main.from.fund_password);
                    await util.sleep(100);

                    let inputGoogleCode = document.querySelector('.popcontent div:nth-child(4) > input');
                    util.setVueNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                });
            });

            //登录
            $('body').on('click', '#loginA', async (event) => {
                let url = `https://${domain}/front/login`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.login_box', async () => {
                    await util.sleep(300);

                    let tab = document.querySelector('#contBox > div.login_box > div.l_right > div.labelRow > div:nth-child(2)');
                    tab.click();

                    await util.sleep(500);

                    let inputEmail = document.querySelector('#login-account-phone');
                    util.setVueNativeValue(inputEmail, main.from.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#login-password');
                    inputPwd.type = 'text';
                    util.setVueNativeValue(inputPwd, main.from.password);
                    await util.sleep(100);

                    let buttonSendEmail = document.querySelector('#login-submit');
                    buttonSendEmail.click();
                    await util.sleep(100);
                });

                //登录时填写Google验证码
                main.listenElement('.auth-code .inputs', async () => {
                    await util.sleep(1500);

                    let googleCode = main.getGoogleCodeBySecret(main.from.google_secret);

                    document.querySelector('.auth-code').__vue__._data.codeVal = String(googleCode);
                });

            });

            //注册 有邀请码
            $('body').on('click', '#registerA', async (event) => {
                await util.clearAllLocalData();

                if (!/\?r=\d{3,}/.test(location.href)) {
                    const result = await Swal.fire({
                        title: '请输入邀请码',
                        input: 'text',
                        inputValue: util.getValue('inviteCode'),
                        inputAttributes: {
                            autocapitalize: 'off',
                            placeholder: '请输入邀请码',
                        },
                        confirmButtonText: '确定',
                        customClass
                    });

                    if (result.isConfirmed) {
                        if (result.value) {
                            util.setValue('inviteCode', result.value);
                            inviteUrl = `https://${domain}/front/register?r=${result.value}`;
                        }
                    } else {
                        return;
                    }

                    if (location.href !== inviteUrl) {
                    }
                    return location.href = inviteUrl;
                    //event.preventDefault();
                }

                main.listenElement('.registerBox', async () => {
                    await util.sleep(300);

                    let tab = document.querySelector('#contBox > div.cont-center > div.registerBox > div.labelRow > div:nth-child(2)');
                    tab.click();

                    await util.sleep(500);

                    let inputEmail = document.querySelector('#register-email');
                    util.setVueNativeValue(inputEmail, main.from.email);
                    await util.sleep(1000);

                    let inputPwd = document.querySelector('#register-password');
                    inputPwd.type = 'text';
                    util.setVueNativeValue(inputPwd, main.from.password);
                    await util.sleep(100);

                    let inputRePwd = document.querySelector('#register-confirmpassword');
                    inputRePwd.type = 'text';
                    util.setVueNativeValue(inputRePwd, main.from.password);
                    await util.sleep(100);

                    let buttonSendEmail = document.querySelector('#register-sendemail');
                    buttonSendEmail.click();
                    await util.sleep(300);

                    //勾选同意条款
                    document.querySelector('#uncheckimg').click();
                });
            });

            //注册 无邀请码
            $('body').on('click', '#registerB', async (event) => {
                await util.clearAllLocalData();
                if (location.href !== inviteUrlWithout) return location.href = inviteUrlWithout;
                //event.preventDefault();

                main.listenElement('.registerBox', async () => {
                    await util.sleep(300);

                    let tab = document.querySelector('#contBox > div.cont-center > div.registerBox > div.labelRow > div:nth-child(2)');
                    tab.click();

                    await util.sleep(500);

                    let inputEmail = document.querySelector('#register-email');
                    util.setVueNativeValue(inputEmail, main.from.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#register-password');
                    inputPwd.type = 'text';
                    util.setVueNativeValue(inputPwd, main.from.password);
                    await util.sleep(100);

                    let inputRePwd = document.querySelector('#register-confirmpassword');
                    inputRePwd.type = 'text';
                    util.setVueNativeValue(inputRePwd, main.from.password);
                    await util.sleep(100);

                    let buttonSendEmail = document.querySelector('#register-sendemail');
                    buttonSendEmail.click();
                    await util.sleep(300);

                    //勾选同意条款
                    document.querySelector('#uncheckimg').click();
                });
            });

            //上传 Cookie
            $('body').on('click', '#task-toMysql-cookie', async (event) => {
                Swal.fire({
                    title: '上传Cookie&Token，请输入Email',
                    input: 'text',
                    inputValue: main.from.email,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '上传Cookie&Token，请输入Email',
                    },
                    confirmButtonText: '确定',
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        main.uploadToMysqlCookie(result.value);
                    }
                });
            });

            //上传 google 验证码
            $('body').on('click', '#task-toMysql-google', async (event) => {
                Swal.fire({
                    title: '上传谷歌密钥，请输入Email',
                    text: util.getValue('googleSecret'),
                    input: 'text',
                    inputValue: main.from.email,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '上传谷歌密钥，请输入Email',
                    },
                    confirmButtonText: '确定',
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        main.uploadToMysqlGoogle(result.value);
                    }
                });
            });

            //滑动验证码接口1
            $('body').on('click', '#geetestA', async (event) => {
                event.stopPropagation(); //阻止冒泡
                try {
                    if (main.isInGeetest) return;
                    main.isInGeetest = true;
                    // 获取背景图片
                    const geetestBackgroundImg = getComputedStyle(document.querySelector('.geetest_freeze_wait .geetest_bg'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    // 获取缺口图片
                    const geetestSliceImg = getComputedStyle(document.querySelector('.geetest_freeze_wait .geetest_slice_bg'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    let base64 = await util.combineImage(geetestBackgroundImg, geetestSliceImg);
                    if (!base64) {
                        main.isInGeetest = false;
                        return toastr.error('请等待验证码图片加载完成！', '未发现滑动验证码！');
                    }
                    util.message.info('开始识别滑动距离...');

                    let {res} = await util.post('https://www.jfbym.com/api/YmServer/customApi', {
                        "token": "mJcQTheaFRrJxup5NNYPJhHmSvLg0eyVfI3dYEkZdp0",
                        "type": 20110,
                        "image": base64
                    }, {
                        'Content-Type': 'application/json'
                    });
                    main.isInGeetest = false;
                    if (res.code === 10000) {
                        let distance = +res.data.data;
                        util.message.info('识别成功，距离为：' + distance);
                        let offset = 0; //实际的偏差
                        let realDistance = 300 / 300 * distance + offset; //验证码背景图显示宽度280/实际宽度320
                        await util.slide('.geetest_freeze_wait .geetest_slider .geetest_btn', realDistance);
                    } else {
                        toastr.error(res.msg);
                    }
                } catch (e) {
                    main.isInGeetest = false;
                    console.error(e);
                    toastr.error('识别验证码出错');
                }
            });

            //滑动验证码接口2
            $('body').on('click', '#geetestB', async (event) => {
                event.stopPropagation(); //阻止冒泡
                try {
                    if (main.isInGeetest) return;
                    main.isInGeetest = true;
                    // 获取背景图片
                    const geetestBackgroundImg = getComputedStyle(document.querySelector('.geetest_freeze_wait .geetest_bg'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    // 获取缺口图片
                    const geetestSliceImg = getComputedStyle(document.querySelector('.geetest_freeze_wait .geetest_slice_bg'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    let base64 = await util.combineImage(geetestBackgroundImg, geetestSliceImg);
                    if (!base64) {
                        main.isInGeetest = false;
                        return toastr.error('请等待验证码图片加载完成！', '未发现滑动验证码！');
                    }
                    util.message.info('开始识别滑动距离...');

                    let {res} = await util.post('http://www.tulingtech.xyz/tuling/predict', {
                        ID: "05119180",
                        version: "3.1.1",
                        "username": "lorem2",
                        "password": 'lorem2',
                        "b64": base64.replace(/^data:image\/\w+;base64,/, "")
                    }, {
                        'Content-Type': 'application/json'
                    });
                    main.isInGeetest = false;
                    if (res.code === 1) {
                        let distance = res.data['缺口']['X坐标值'] - res.data['滑块']['X坐标值'];
                        util.message.info('识别成功，距离为：' + distance);
                        let offset = 0; //实际的偏差
                        let realDistance = 300 / 300 * distance + offset; //验证码背景图显示宽度280/实际宽度320
                        await util.slide('.geetest_freeze_wait .geetest_slider .geetest_btn', realDistance);
                    } else {
                        toastr.error(res.msg);
                    }
                } catch (e) {
                    main.isInGeetest = false;
                    console.error(e);
                    toastr.error('识别验证码出错');
                }
            });

            //3张图点击验证码接口
            $('body').on('click', '#geetestC', async (event) => {
                event.stopPropagation(); //阻止冒泡
                try {
                    if (main.isInGeetest) return;
                    main.isInGeetest = true;
                    const iconDivHeight = 30;
                    // 获取背景图片
                    const geetestBackgroundImg = getComputedStyle(document.querySelector('.geetest_freeze_wait .geetest_bg'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');

                    // 获取三张图顺序图片
                    const geetestIconImg1 = document.querySelector('.geetest_freeze_wait .geetest_ques_back img:nth-child(1)').getAttribute('src');
                    const geetestIconImg2 = document.querySelector('.geetest_freeze_wait .geetest_ques_back img:nth-child(2)').getAttribute('src');
                    const geetestIconImg3 = document.querySelector('.geetest_freeze_wait .geetest_ques_back img:nth-child(3)').getAttribute('src');

                    util.message.info('开始生成识别图片...');
                    let $screenshot = $(`
                    <div id="screenshot" style="float: left;font-size: 0;">
                      <div style="height: ${iconDivHeight}px">
                        <img style="width: 24px;height: 24px;" src="${geetestIconImg1}">
                        <img style="width: 24px;height: 24px;" src="${geetestIconImg2}">
                        <img style="width: 24px;height: 24px;" src="${geetestIconImg3}">
                      </div>
                      <img src="${geetestBackgroundImg}">
                    </div>
                    `);
                    document.body.appendChild($screenshot[0]);
                    let canvas = await html2canvas($screenshot[0], {
                        allowTaint: true,
                        useCORS: true,
                        scale: 1
                    });
                    let base64 = canvas.toDataURL("image/jpeg", 0.8);
                    $screenshot.remove();
                    util.message.info('开始识别图标位置...');
                    let {res} = await util.post('http://www.tulingtech.xyz/tuling/predict', {
                        ID: "44040235",
                        version: "3.1.1",
                        "username": "lorem2",
                        "password": 'lorem2',
                        "b64": base64.replace(/^data:image\/\w+;base64,/, "")
                    }, {
                        'Content-Type': 'application/json'
                    });
                    main.isInGeetest = false;
                    if (res.code === 1) {
                        let cor = {
                            x1: res.data['顺序1']['X坐标值'],
                            x2: res.data['顺序2']['X坐标值'],
                            x3: res.data['顺序3']['X坐标值'],
                            y1: res.data['顺序1']['Y坐标值'] - iconDivHeight,
                            y2: res.data['顺序2']['Y坐标值'] - iconDivHeight,
                            y3: res.data['顺序3']['Y坐标值'] - iconDivHeight,
                        };
                        util.message.info(`识别成功，坐标：(${cor.x1},${cor.y1}) (${cor.x2},${cor.y2}) (${cor.x3},${cor.y3})`);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_bg'), cor.x1, cor.y1);
                        await util.sleep(450);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_bg'), cor.x2, cor.y2);
                        await util.sleep(466);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_bg'), cor.x3, cor.y3);
                        await util.sleep(700);
                        document.querySelector('.geetest_freeze_wait .geetest_submit').click();
                        $('.identification-point').remove();
                    } else {
                        toastr.error(res.message);
                    }
                } catch (e) {
                    main.isInGeetest = false;
                    console.error(e);
                    toastr.error('识别验证码出错');
                }
            });

            //九宫格辨认物体验证码
            $('body').on('click', '#geetestD', async (event) => {
                event.stopPropagation(); //阻止冒泡
                try {
                    if (main.isInGeetest) return;
                    main.isInGeetest = true;
                    const iconDivHeight = 30;

                    let geetest = document.querySelector('.geetest_box');
                    let geetestIconImg = geetest.querySelector('.geetest_ques_back img').src;
                    let geetestBackgroundImg = getComputedStyle(document.querySelector('.geetest_item_img'))
                        .getPropertyValue('background-image')
                        .replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    main.isInGeetest = true;
                    util.message.info('开始生成识别图片...');
                    let $screenshot = $(`
                    <div id="screenshot" style="width: 300px;font-size: 0;float: left;">
                      <div style="height: ${iconDivHeight}px;display:flex;justify-content: space-between">
                        <div style="font-size: 16px;">请选择 <b>3</b> 个符合的图片</div>
                        <img style="width: 24px;height: 24px;" src="${geetestIconImg}">
                      </div>
                      <div style="position: relative;">
                        <img src="${geetestBackgroundImg}">
                        <div style="height: 6px;width: 100%;background: #fff;position: absolute;top: 84px;left: 0;"></div>
                        <div style="height: 6px;width: 100%;background: #fff;position: absolute;top: 170px;left: 0;"></div>
                        <div style="width: 6px;height: 100%;background: #fff;position: absolute;top: 0;left: 97px;"></div>
                        <div style="width: 6px;height: 100%;background: #fff;position: absolute;top: 0;left: 197px;"></div>
                      </div>
                    </div>`);
                    document.body.appendChild($screenshot[0]);
                    let canvas = await html2canvas($screenshot[0], {
                        allowTaint: true,
                        useCORS: true,
                        scale: 1
                    });
                    let base64 = canvas.toDataURL("image/jpeg", 0.8);
                    $screenshot.remove();
                    util.message.info('开始识别图标位置...');
                    let {res} = await util.post('http://www.tulingtech.xyz/tuling/predict', {
                        ID: "30492402", //60139718
                        version: "3.1.1",
                        "username": "lorem2",
                        "password": 'lorem2',
                        "b64": base64.replace(/^data:image\/\w+;base64,/, "")
                    }, {
                        'Content-Type': 'application/json'
                    });
                    main.isInGeetest = false;
                    if (res.code === 1) {
                        let cor = {
                            x1: res.data['顺序1']['X坐标值'],
                            x2: res.data['顺序2']['X坐标值'],
                            x3: res.data['顺序3']['X坐标值'],
                            y1: res.data['顺序1']['Y坐标值'] - iconDivHeight,
                            y2: res.data['顺序2']['Y坐标值'] - iconDivHeight,
                            y3: res.data['顺序3']['Y坐标值'] - iconDivHeight,
                        };
                        util.message.info(`识别成功，坐标：(${cor.x1},${cor.y1}) (${cor.x2},${cor.y2}) (${cor.x3},${cor.y3})`);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_window'), cor.x1, cor.y1);
                        await util.sleep(129);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_window'), cor.x2, cor.y2);
                        await util.sleep(226);
                        await util.addPoint(document.querySelector('.geetest_freeze_wait .geetest_window'), cor.x3, cor.y3);
                        await util.sleep(195);
                        $('.identification-point').remove();
                    } else {
                        toastr.error(res.message);
                    }
                } catch (e) {
                    main.isInGeetest = false;
                    console.error(e);
                    toastr.error('识别验证码出错');
                }
            });


        },

        listenElement(element, callback) {
            if (document.querySelector(element)) {
                console.log(`已存在元素 ${element}`);
                callback();
                return; // 元素已存在，不需要继续监听
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(element)) {
                    observer.disconnect();
                    console.log(`找到了元素 ${element}`);
                    callback();
                }
            });
            observer.observe(document.body, {childList: true, subtree: true});
        },

        getGoogleCodeBySecret(secret) {
            return otplib.authenticator.generate(secret);
        },

        //获取主账号邮件的websocket
        createMainEmailWebsocket() {
            let ws = new WebSocket('ws://localhost:9867');
            ws.onmessage = function (e) {
                try {
                    let res = JSON.parse(e.data);
                    // if (res.exchange === 'coinw' && res.email === main.from.email) {
                    if (res.exchange === 'coinw') {
                        main.wsMainRes = res;
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            ws.onclose = async function () {
                main.createMainEmailWebsocket();
                await util.sleep(5000);
            };
        },

        async autoRun() {
            let from = util.getValue('from');
            if (!from) return util.message.error('请先配置账号');
            main.from = await main.getAccountById(from);
            $('#from').text(main.from.email);

            localStorage.setItem('selectType', 'USD');  //设置币种
            localStorage.setItem(`noopenhydataid${main.from.user_id}`, `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //开通合约弹窗
            localStorage.setItem('todayShowAdTime', `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //广告弹窗
            localStorage.setItem(`poptyjdataid${main.from.user_id}`, `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`);  //广告弹窗

            if (location.href.indexOf('wallet/withdraw') > -1 && withdrawInner) {
                $('#withdrawA').click();
            }

            //自动识别点击验证码
            main.listenElement('.geetest_btn_click', async () => {
                await util.sleep(500); //1秒后点击按钮
                await util.addPoint(document.querySelector('.geetest_btn_click'), 170, 23);
                $('.identification-point').remove();
            });

            //自动识别九宫格验证码
            main.listenElement('.geetest_boxShow', async () => {
                await util.sleep(1000);
                document.querySelector('#geetestD').click();
            });

            //关闭右下角弹窗
            main.listenElement('.clear-all', async () => {
                await util.sleep(500);
                document.querySelector('.clear-all').click();
            });


        },

        async init() {
            this.initValue();
            this.addStyle();
            this.addButton();
            this.addPageListener();
            this.autoRun();
        }
    };

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        sleep(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        resolve({res: res.response || res.responseText});
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        resolve({res: res.response || res.responseText});
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
        getCookie(name, domain) {
            return new Promise((resolve, reject) => {
                GM_cookie && GM_cookie('list', {name: name, domain: domain}, (cookies, error) => {
                    if (!error) {
                        resolve(cookies?.[0]?.value);
                    }
                    resolve(null);
                });
            });
        },
        /**
         * 导入Cookie
         * @param value { name: 'name', value: 'foo', httpOnly: true }
         */
        importCookie(value) {
            GM_cookie && GM_cookie.delete({name: value.name, url: value.domain}, () => {
                GM_cookie.set(value, () => {
                    toastr.success(value.name + '导入成功');
                });
            });
        },
        exportCookie() {
            return new Promise((resolve, reject) => {
                GM_cookie && GM_cookie('list', {url: domain}, (cookies, error) => {
                    if (!error) {
                        resolve(cookies);
                    }
                    reject(error);
                });
            });
        },

        clearCookie(domain) {
            return new Promise((resolve, reject) => {
                GM_cookie && GM_cookie('list', {url: domain}, async (cookies, error) => {
                    if (!error) {
                        cookies.forEach((val) => {
                            GM_cookie.delete({name: val.name, url: val.domain});
                        });
                        resolve(true);
                        return;
                    }
                    resolve(false);
                });
            });
        },

        exportCookieString() {
            return new Promise((resolve, reject) => {
                GM_cookie && GM_cookie('list', {url: domain}, (cookies, error) => {
                    if (!error) {
                        let cookieString = '';
                        cookies.forEach((item) => {
                            cookieString += item.name + '=' + item.value + '; ';
                        });
                        resolve(cookieString);
                    }
                    reject(error);
                });
            });
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            }
        },
        findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        /**
         * 格式化时间
         * @param val 可以为 毫秒/秒时间戳（需要为Int） | 2022-05-25T08:13:04Z | 2012-03-08 | new Date() 等时间格式
         * @param format
         * @example
         *   dateFormat('2022-07-21T20:05:33Z')
         *   dateFormat('2022年07月21日')
         *   dateFormat('2022年7月21日')
         *   dateFormat('June 21, 2022')
         *   dateFormat(1658433933)
         *   dateFormat('20220103')
         *   dateFormat(1658433933000)
         *   dateFormat()
         *   dateFormat(new Date())
         * @returns {string|*}
         */
        dateFormat(val = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
            if (val === '0001-01-01T00:00:00Z' || val === '') return '';
            if (this.isType(val) === 'number') { //数字类型
                val = parseInt(val);
                return (val + '').length === 10 ? dayjs(val * 1000).format(format) : dayjs(val).format(format);
            }
            if (this.isType(val) === 'string') {
                val = val && val.replace(/[年月]/g, '-').replace('日', '');
                return dayjs(val).format(format);
            }
            if (this.isType(val) === 'date') {
                return dayjs(val).format(format);
            }
            return dayjs().format(format);   //返回当前时间
        },

        calColor(value) {
            if (value < 0) {
                return '#f1493f';
            } else if (value > 0) {
                return '#1da2b4';
            } else {
                return '#000000';
            }
        },
        /**
         * 比较时间
         * @param val 可以为 毫秒/秒时间戳（需要为Int） | 2022-05-25T08:13:04Z | 2012-03-08 | new Date() 等时间格式
         * @returns {string}
         */
        dateDiff(val) {
            try {
                if (val === '0001-01-01T00:00:00Z') return '';
                let date1 = this.dateFormat(val, 'YYYY-MM-DD HH:mm:ss');
                let date2 = dayjs();
                const minute = date2.diff(date1, 'minute');
                const second = date2.diff(date1, 'second');
                const hour = date2.diff(date1, 'hour');
                const day = date2.diff(date1, 'day');
                const week = date2.diff(date1, 'week');
                const month = date2.diff(date1, 'month');
                const year = date2.diff(date1, 'year');
                if (year > 0) return year + '年前';
                if (month > 0) return month + '个月前';
                if (week > 0) return week + '周前';
                if (day > 0) return day + '天前';
                if (hour > 0) return hour + '小时前';
                if (minute > 0) return minute + '分钟前';
                if (second > 0) return second + '秒前';
                return '刚刚';
            } catch (e) {
                return '未知';
            }
        },
        setReactNativeValue(element, value) {
            let lastValue = element.value;
            element.value = value;
            let event = new Event("input", {target: element, bubbles: true});
            // React 15
            event.simulated = true;
            // React 16
            let tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(event);
        },

        setVueNativeValue(element, value) {
            element.value = value;
            let event = new Event('input', {bubbles: true});
            element.dispatchEvent(event);
        },

        stringify(obj) {
            return Object.entries(obj).map(([key, value]) => `${key}=${value}`).join('&');
        },

        obsHas(selector, desc = 'has') {
            return new Promise(resolve => {
                //obs node
                let timer = setInterval(() => {
                    let target = document.querySelector(selector);
                    if (!!target) {
                        clearInterval(timer);
                        resolve(selector);
                    } else {
                        return;
                    }
                }, 100);
            });
        },

        getTopDomain() {
            const match = window.location.hostname.match(/\w+\.\w+$/);
            return match ? match[0] : window.location.hostname;
        },

        async clearAllLocalData() {
            // Clear cookies
            await util.clearCookie(util.getTopDomain());

            // Clear localStorage
            localStorage.clear();

            // Clear sessionStorage
            sessionStorage.clear();

            // Clear indexedDB
            const dbs = await indexedDB.databases();
            for (const db of dbs) {
                await indexedDB.deleteDatabase(db.name);
            }

            // Unregister service workers
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        },

        clearAllInterval() {
            // 获取当前页面上所有的定时器和间隔器 ID
            const allIntervalIds = setInterval(() => {
            });

            for (let i = 0; i < allIntervalIds; i++) {
                clearInterval(i);
            }
        },

        combineImage(url1, url2) {
            return new Promise((resolve, reject) => {
                if (!url1 || !url2) return resolve(false);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const image1 = new Image();
                const image2 = new Image();

                image1.src = url1;
                image1.setAttribute("crossOrigin", 'Anonymous');
                image2.src = url2;
                image2.setAttribute("crossOrigin", 'Anonymous');

                image1.onload = () => {
                    canvas.width = image1.width;
                    canvas.height = image1.height;
                    ctx.drawImage(image1, 0, 0);
                    image2.onload = () => {
                        ctx.drawImage(image2, 0, 0);
                        const mergedImage = canvas.toDataURL('image/jpeg', 0.8);
                        resolve(mergedImage);
                    };
                };
            });
        },

        slide(selector, width) {
            let slider = document.querySelector(selector);

            let rect = slider.getBoundingClientRect(),
                x0 = rect.x || rect.left,
                y0 = rect.y || rect.top,
                //x1 = x0 + width / devicePixelRatio,
                x1 = x0 + width,
                y1 = y0;

            let mousedown = document.createEvent("MouseEvents");
            mousedown.initMouseEvent("mousedown", true, true, unsafeWindow, 0,
                x0, y0, x0, y0, false, false, false, false, 0, null);
            slider.dispatchEvent(mousedown);

            let mousemove = document.createEvent("MouseEvents");
            mousemove.initMouseEvent("mousemove", true, true, unsafeWindow, 0,
                x1, y1, x1, y1, false, false, false, false, 0, null);
            slider.dispatchEvent(mousemove);

            let mouseup = document.createEvent("MouseEvents");
            mouseup.initMouseEvent("mouseup", true, true, unsafeWindow, 0, x1, y1, x1, y1, false, false, false, false, 0, null);
            setTimeout(() => {
                slider.dispatchEvent(mouseup);
            }, 500);
        },

        addPoint(element, x, y) {
            let rect = element.getBoundingClientRect(),
                x0 = rect.x || rect.left,
                y0 = rect.y || rect.top,
                //x1 = x0 + width / devicePixelRatio,
                x1 = x0 + x,
                y1 = y0 + y;

            const box = document.createElement('div');
            box.className = 'identification-point';
            box.style.position = 'absolute';
            box.style.left = `${x1}px`;
            box.style.top = `${y1}px`;
            box.style.width = '10px';
            box.style.height = '10px';
            box.style.border = '3px solid #000';
            box.style.borderRadius = '50%';
            box.style.zIndex = '999999999999999999999';
            box.style.backgroundColor = 'red';
            document.body.appendChild(box);

            //触发极验点击事件
            let ev = document.createEvent('HTMLEvents');
            ev.clientX = x1;
            ev.clientY = y1;
            ev.initEvent('click', false, true);
            element.dispatchEvent(ev);
            let clickedElement = document.elementFromPoint(x1, y1);
            if (clickedElement) {
                clickedElement.click();
            }
        },
    };
    main.init();
})();
