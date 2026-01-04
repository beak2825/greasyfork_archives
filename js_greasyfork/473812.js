// ==UserScript==
// @name              Mexc助手
// @namespace         mexc
// @version           2.0.2
// @author            Hacker
// @description       Mexc Helper
// @license           MIT
// @homepage          https://www.mexc.com
// @match             *://*.mexc.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/buffer.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/index.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @resource          toastrStyle https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @connect           mexc.com
// @connect           dwei.xin
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
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMTI1LjkgODQuNkw5OC4zIDIzLjVjLTYuMS0xMi43LTIwLjktMTIuOS0yNi43LjVMNDIuNSA4Ny42Yy01LjQgMTEuNiAxLjMgMjYuMyAxMi4xIDI2LjNoNTguMmMxMSAwIDE5LjItMTUuMSAxMy4xLTI5LjN6Ii8+PHBhdGggZD0iTTg2IDg5LjRsLTEuNy0zLjhjLTEuNi0zLjUtNS4xLTExLjEtNS4xLTExLjFMNTUuOCAyMi43Yy02LjEtMTEuNS0yMC40LTEyLjUtMjYuNSAyTDIgODQuOGMtNS42IDEyLjYgMS4xIDI5IDEzLjMgMjkuMWg5Ny4zYy0xNSAuMS0xOS44LTkuOC0yNi42LTI0LjV6Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/473812/Mexc%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473812/Mexc%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const domain = document.domain;

    const baseAPI = `https://exchangeapi.dwei.xin`;
    const inviteUrl = 'https://www.mexc.com/zh-TW/register?inviteCode=mexc-1gjAm'; //有邀请码注册链接
    const inviteUrlWithout = 'https://www.mexc.com/zh-TW/register'; //有邀请码注册链接

    const withdrawInner = true; //自动跳转到提现页面

    const customClass = {
        container: 'mexc-container',
        popup: 'mexc-popup',
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
        }
    });

    let main = {
        from: null,
        to: null,
        sub: null,
        emailCode: '',
        wsRes: {},

        async getAccountById(id) {
            try {
                let {res} = await util.post(`${baseAPI}/v1/mexc_account/get_one`,
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

        getAccount(emailName) {
            for (let i = 0; i < accountList.length; i++) {
                let account = accountList[i].split(',');
                if (account[0] === emailName) {
                    return {
                        email: account[0],
                        password: account[1],
                        fundPassword: account[2],
                    };
                }
            }
            return null;
        },

        async uploadToMysql(email) {
            //获取cookie
            let cookies = await util.exportCookie();
            let cookieValue = cookies.map((item) => {
                return item.name + '=' + item.value;
            }).join('; ');
            let device = localStorage.getItem('mexc_local_fingerprint_sys_info');
            if (!device) {
                return toast.fire({icon: 'error', title: '未找到Device'});
            }
            let {res} = await util.post(`${baseAPI}/v1/mexc_account/update_one`, {
                email: email,
                cookie: cookieValue,
                device: device
            }, {
                'content-type': 'application/json;charset=UTF-8',
            });
            if (res.code === 200) {
                toast.fire({icon: 'success', title: '更新成功'});
            } else {
                toast.fire({icon: 'error', title: '更新失败'});
            }
        },

        async uploadToMysqlCookie(email) {
            //获取cookie
            let cookies = await util.exportCookie();
            let cookieValue = cookies.map((item) => {
                return item.name + '=' + item.value;
            }).join('; ');
            let {res} = await util.post(`${baseAPI}/v1/mexc_account/update_one`, {
                email: email,
                cookie: cookieValue,
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
            toastr.success(googleSecret, '获取 Secret 成功');
            let {res} = await util.post(`${baseAPI}/v1/mexc_account/update_one`, {
                email: email,
                google_secret: googleSecret,
            }, {
                'content-type': 'application/json;charset=UTF-8',
            });
            if (res.code === 200) {
                toast.fire({icon: 'success', title: '更新成功'});
            } else {
                toast.fire({icon: 'error', title: '更新失败'});
            }
        },

        addStyle() {
            //样式
            GM_addStyle(`
                .mexc-container { z-index: 99999!important; }
                .mexc-popup { font-size: 14px !important}
                #tm-hide-control {right: -14px; background: #ddd; opacity: .5; cursor: pointer; border-radius: 0 5px 5px 0; transition: all .3s; z-index: 10; position: absolute; bottom: 30px; user-select: none; width: 14px; display: flex; align-items: center; justify-content: center; height: 36px; }
                #tm-hide-control:hover { opacity: 1; transition: all .3s; }
                .tm-hide {display: none; }
                #tm-btn-box { z-index:999999999 ;position: fixed; left: 0; bottom: 5px; font-size:12px;text-align:left }
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
                    <div class="tm-task"><span class="tag" id="from" style="margin-right: 10px;"></span><span id="tm-input1">${util.getValue('from') ? 'From：' + util.getValue('from') : '<span style="color:#bc2020">请选择转账账号</span>'}</span></div>
                    <div class="tm-task"><span class="tag" id="to" style="margin-right: 10px;"></span><span id="tm-input2">${util.getValue('to') ? 'To：' + util.getValue('to') : '<span style="color:#bc2020">请选择目标账号</span>'}</span></div>
                    <div class="tm-task">=========================</div>
                    <div class="tm-task"><span class="tag" id="sub" style="margin-right: 10px;"></span><span id="tm-input3">${util.getValue('sub') ? '子：' + util.getValue('sub') : '<span style="color:#bc2020">请选择子账号</span>'}</span></div>
                  </div>
                </div>
                <div class="tm-btn">提现
                  <div class="task-list">
                    <div class="tm-task" id="withdrawA">0. 自动填写资金密码和Google</div>
                  </div>
                </div>
                <div class="tm-btn">绑定Google
                  <div class="task-list">
                    <div class="tm-task" id="bindGoogleA">0. 绑定Google</div>
                  </div>
                </div>
                <div class="tm-btn">新建子账号
                  <div class="task-list">
                    <div class="tm-task" id="addSubA">0. 新建子账号</div>
                  </div>
                </div>
                <div class="tm-btn">注册
                  <div class="task-list">
                    <div class="tm-task" id="registerA">0. 自动填写账号和密码（有邀请码）</div>
                    <div class="tm-task" id="registerB">0. 自动填写账号和密码（无邀请码）</div>
                  </div>
                </div>
                <div class="tm-btn">登录
                  <div class="task-list">
                    <div class="tm-task" id="loginA">0. 自动填写账号和密码</div>
                  </div>
                </div>
                <div class="tm-btn">上传Cookie和Device
                  <div class="task-list">
                    <div class="tm-task" id="task-toMysql">0. 上传 Cookie 和 Device 到后台</div>
                    <div class="tm-task" id="task-toMysql-google">1. 上传谷歌密钥 到后台</div>
                    <div class="tm-task" id="task-toMysql-cookie">2. 仅上传 Cookie 到后台</div>
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
                    showLoaderOnConfirm: true,
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
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await util.clearAllLocalData();
                        Swal.fire({
                            title: '是否导入Cookie',
                            cancelButtonText: '不导入',
                            confirmButtonText: '导入',
                            showCancelButton: true,
                            showLoaderOnConfirm: true,
                        }).then(async (res) => {
                            if (res.isConfirmed) {
                                $('#tm-input1').text('From：' + result.value);
                                util.setValue('from', result.value);
                                main.from = await main.getAccountById(result.value);
                                $('#from').text(main.from.user_id);
                                let {cookie, device} = main.from;
                                let cookiesArray = cookie.split(';');
                                cookiesArray.map(async (item) => {
                                    let _cookie = item.split('=');
                                    let val = {
                                        name: _cookie[0].trim(),
                                        value: _cookie[1].trim(),
                                        domain: 'mexc.com',
                                        path: '/',
                                        expires: 2147483647,
                                        size: 0,
                                        httpOnly: false,
                                        secure: false,
                                        session: false
                                    };
                                    await util.importCookie(val);
                                });
                                localStorage.setItem('mexc_local_fingerprint_sys_info', device);
                                history.go(0);
                            }
                            if (res.isDismissed) {
                                $('#tm-input1').text('From：' + result.value);
                                util.setValue('from', result.value);
                                main.from = await main.getAccountById(result.value);
                                $('#from').text(main.from.email);
                                $('#loginA').click();
                            }
                        });
                    }
                });
            });

            //选择账号2
            $('body').on('click', '#tm-input2', () => {
                Swal.fire({
                    title: '请选择目标账号',
                    input: 'text',
                    inputValue: util.getValue('to'),
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择目标账号',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        $('#tm-input2').text('To：' + result.value);
                        util.setValue('to', result.value);
                        main.to = await main.getAccountById(result.value);
                        $('#to').text(main.to.email);
                        //await util.sleep(500);
                        //history.go(0);
                    }
                });
            });

            //选择账号3
            $('body').on('click', '#tm-input3', () => {
                Swal.fire({
                    title: '请选择子账号',
                    input: 'text',
                    inputValue: util.getValue('sub'),
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择子账号',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        $('#tm-input3').text('子：' + result.value);
                        util.setValue('sub', result.value);
                        main.sub = await main.getAccountById(result.value);
                        $('#sub').text(main.sub.email);
                        await util.sleep(500);
                        //util.clearAllInterval();
                        $('#addSubA').click();
                    }
                });
            });

            //提币
            $('body').on('click', '#withdrawA', async (event) => {
                let url = `https://${domain}/zh-TW/assets/withdraw/USDT`;
                if (location.href !== url) return location.href = url;

                main.listenElement('#googleAuthCode', async () => {
                    let inputGoogleCode = document.querySelector('#googleAuthCode');
                    util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    setInterval(() => {
                        util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });

                main.listenElement('#emailCode', async () => {
                    let inputEmailCode = document.querySelector('#emailCode');
                    let ins = setInterval(async () => {
                        if (main.wsRes.exchange === 'mexc' && main.wsRes.email === main.from.email) {
                            let emailCode = main.wsRes.code;
                            util.setReactNativeValue(inputEmailCode, emailCode);
                            clearInterval(ins);
                        }
                    }, util.getValue('interval'));
                });

                main.listenElement('.send-verification-code_linkButton__9FR98', async () => {
                    //点击发送验证码
                    document.querySelector('.send-verification-code_linkButton__9FR98').click();
                });

                main.listenElement('.risk-modal_wrap__OE1IM', async () => {
                    //自动关闭弹框
                    document.querySelector('.risk-modal_wrap__OE1IM input[type="checkbox"]').click();
                    await util.sleep(300);
                    document.querySelector('.risk-modal_footer__Cw09j button[type="button"]').click();
                });
            });

            //绑定Google
            $('body').on('click', '#bindGoogleA', async (event) => {
                let url = `https://${domain}/zh-TW/user/security/google-auth`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.step3_secret__Zxy9C', async () => {
                    let googleSecret = document.querySelector('.step3_secret__Zxy9C').innerText;
                    if (googleSecret) {
                        toastr.success(googleSecret, '获取 Secret 成功');
                        GM_setClipboard(googleSecret);
                        util.setValue('googleSecret', googleSecret);
                    }
                });

                main.listenElement('.step4_wrapper__YgqPR > form', async () => {
                    await util.sleep(1500);

                    let inputPwd = document.querySelector('#password');
                    inputPwd.type = 'text';
                    util.setReactNativeValue(inputPwd, main.from.password);
                    await util.sleep(100);

                    //点击发送验证码
                    document.querySelector('.step4_wrapper__YgqPR > form > div:nth-child(2) > div > div.ant-col.ant-form-item-control > div > div > div > div > button').click();
                    await util.sleep(100);

                    let inputGoogleCode = document.querySelector('#validationCode');
                    util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(util.getValue('googleSecret')));
                    setInterval(() => {
                        util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(util.getValue('googleSecret')));
                    }, util.getValue('interval'));
                });
            });

            //添加子账号
            $('body').on('click', '#addSubA', async (event) => {
                let url = `https://${domain}/zh-TW/user/sub-account?tab=account`;
                if (location.href !== url) return location.href = url;

                main.listenElement('#rc-tabs-1-panel-account', async () => {
                    await util.sleep(600);
                    //点击新建子账号按钮
                    document.querySelector('#rc-tabs-1-panel-account > div > form > div > div:nth-child(2) > button').click();
                    await util.sleep(800);
                    //选择账号类型为Web
                    document.querySelector('.create-sub-account_confirmModalItem__fKkdl:nth-child(2)').click();
                    await util.sleep(300);
                    document.querySelector('.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-footer > button.ant-btn.ant-btn-primary').click();
                });

                main.listenElement('.security-alert_tip__BoxJI', async () => {
                    await util.sleep(1000);

                    let inputEmail = document.querySelector('#email');
                    util.setReactNativeValue(inputEmail, main.sub.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#hexPassword');
                    inputPwd.type = 'text';
                    util.setReactNativeValue(inputPwd, main.sub.password);
                    await util.sleep(100);

                    let inputRePwd = document.querySelector('#hexPasswordConfirm');
                    inputRePwd.type = 'text';
                    util.setReactNativeValue(inputRePwd, main.sub.password);
                    await util.sleep(300);

                    //点击发送验证码
                    document.querySelector('.send-verification-code_linkButton__9FR98').click();
                    await util.sleep(100);

                    let inputEmailCode = document.querySelector('#emailCode.ant-input');
                    main.emailCode && util.setReactNativeValue(inputEmailCode, main.emailCode);
                    setInterval(() => {
                        util.setReactNativeValue(inputEmailCode, main.emailCode);
                    }, util.getValue('interval'));
                });

                main.listenElement('.security-verification_item__YvPET', async () => {
                    await util.sleep(1500);

                    //点击发送验证码
                    document.querySelector('.send-verification-code_linkButton__9FR98').click();
                    await util.sleep(100);

                    let inputEmailCode = document.querySelector('#emailCode.ant-input.ant-input-lg');
                    let inputGoogleCode = document.querySelector('#googleAuthCode');
                    //main.emailCode && util.setReactNativeValue(inputEmailCode, main.emailCode);
                    util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    setInterval(() => {
                        //main.emailCode && util.setReactNativeValue(inputEmailCode, main.emailCode);
                        util.setReactNativeValue(inputGoogleCode, main.getGoogleCodeBySecret(main.from.google_secret));
                    }, util.getValue('interval'));
                });
            });

            //登录
            $('body').on('click', '#loginA', async (event) => {
                let url = `https://${domain}/zh-TW/login`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('#login', async () => {
                    await util.sleep(1500);

                    let inputEmail = document.querySelector('#accountInput');
                    util.setReactNativeValue(inputEmail, main.from.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#passwordInput');
                    inputPwd.type = 'text';
                    util.setReactNativeValue(inputPwd, main.from.password);
                    await util.sleep(100);

                    let submitButton = document.querySelector('#login > button').click();
                });

                //登录时填写Google验证码
                main.listenElement('.AuthCode_codeInput__7WYrT', async () => {
                    await util.sleep(1500);
                    let title = document.querySelector('.AuthCode_title__7jX0D').innerText;

                    if (title.indexOf('郵箱') > -1) {
                        let ins = setInterval(async () => {
                            if (main.wsRes.exchange === 'mexc' && main.wsRes.email === main.from.email) {
                                let emailCode = main.wsRes.code;
                                const [digit1, digit2, digit3, digit4, digit5, digit6] = String(emailCode).split('').map(Number);
                                for (let i = 1; i <= 6; i++) {
                                    let inputGAuth = document.querySelector(`.AuthCode_codeInput__7WYrT input:nth-child(${i})`);
                                    util.setReactNativeValue(inputGAuth, eval(`digit${i}`));
                                    await util.sleep(100);
                                }
                                clearInterval(ins);
                            }
                        }, util.getValue('interval'));
                    }

                    if (title.indexOf('谷歌') > -1) {
                        let googleCode = main.getGoogleCodeBySecret(main.from.google_secret);
                        const [digit1, digit2, digit3, digit4, digit5, digit6] = String(googleCode).split('').map(Number);

                        for (let i = 1; i <= 6; i++) {
                            let inputGAuth = document.querySelector(`.AuthCode_codeInput__7WYrT input:nth-child(${i})`);
                            util.setReactNativeValue(inputGAuth, eval(`digit${i}`));
                            await util.sleep(100);
                        }
                    }
                });
            });

            //注册
            $('body').on('click', '#registerA', async (event) => {
                await util.clearAllLocalData();
                if (location.href !== inviteUrl) return location.href = inviteUrl;
                //event.preventDefault();

                main.listenElement('#register', async () => {
                    await util.sleep(1500);

                    let inputEmail = document.querySelector('#register_email');
                    util.setReactNativeValue(inputEmail, main.from.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#register_password');
                    inputPwd.type = 'text';
                    util.setReactNativeValue(inputPwd, main.from.password);

                    document.querySelector('#register_agreed').click();
                });
            });

            //注册
            $('body').on('click', '#registerB', async (event) => {
                await util.clearAllLocalData();
                if (location.href !== inviteUrlWithout) return location.href = inviteUrlWithout;
                //event.preventDefault();

                main.listenElement('#register', async () => {
                    await util.sleep(1500);

                    let inputEmail = document.querySelector('#register_email');
                    util.setReactNativeValue(inputEmail, main.from.email);
                    await util.sleep(100);

                    let inputPwd = document.querySelector('#register_password');
                    inputPwd.type = 'text';
                    util.setReactNativeValue(inputPwd, main.from.password);

                    document.querySelector('#register_agreed').click();
                });
            });

            //上传 Cookie 和 Device
            $('body').on('click', '#task-toMysql', async (event) => {
                Swal.fire({
                    title: '请选择输入账号 Email',
                    input: 'text',
                    inputValue: main.from.email,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择输入账号 Email',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        main.uploadToMysql(result.value);
                    }
                });
            });

            //上传 google 验证码
            $('body').on('click', '#task-toMysql-google', async (event) => {
                Swal.fire({
                    title: '请选择输入账号 Email',
                    input: 'text',
                    inputValue: main.from.email,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择输入账号 Email',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        main.uploadToMysqlGoogle(result.value);
                    }
                });
            });

            //上传 Cookie
            $('body').on('click', '#task-toMysql-cookie', async (event) => {
                Swal.fire({
                    title: '请选择输入账号 Email',
                    input: 'text',
                    inputValue: main.from.email,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择输入账号 Email',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        main.uploadToMysqlCookie(result.value);
                    }
                });
            });
        },

        async listenElement(element, callback) {
            // 检查元素是否已存在
            if ($(element).length > 0) {
                console.log('元素已存在');
                callback();
                return; // 元素已存在，不需要继续监听
            }
            const observer = new MutationObserver(() => {
                if ($(element).length > 0) {
                    observer.disconnect();
                    console.log('找到了');
                    callback();
                }
            });
            observer.observe(document.body, {childList: true, subtree: true});
        },

        getGoogleCodeBySecret(secret) {
            return otplib.authenticator.generate(secret);
        },

        createEmailWebsocket() {
            let ws = new WebSocket('ws://localhost:9866');
            ws.onmessage = function (e) {
                try {
                    let res = JSON.parse(e.data);
                    // if (res.exchange === 'mexc' && res.email === main.from.email) {
                    if (res.exchange === 'mexc') {
                        main.wsRes = res;
                        main.emailCode = res.code;
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            ws.onclose = async function () {
                main.createEmailWebsocket();
                await util.sleep(2000);
            };
        },

        async autoRun() {
            let from = util.getValue('from');
            let to = util.getValue('to');
            let sub = util.getValue('sub');
            if (!from || !to) return;
            main.from = await main.getAccountById(util.getValue('from'));
            $('#from').text(main.from.email);
            main.to = await main.getAccountById(util.getValue('to'));
            $('#to').text(main.to.email);
            if (sub) {
                main.sub = await main.getAccountById(util.getValue('sub'));
                $('#sub').text(main.sub.email);
            }

            //main.createEmailWebsocket();

            if (location.href.indexOf('/zh-TW/assets/withdraw/USDT') > -1 && withdrawInner) {
                $('#withdrawA').click();
            }

            if (location.href.indexOf('/zh-TW/login') > -1) {
                $('#loginA').click();
            }

            if (location.href.indexOf('/zh-TW/user/security/google-auth') > -1) {
                $('#bindGoogleA').click();
            }

            if (location.href === inviteUrl) {
                $('#registerA').click();
            }

            if (location.href === inviteUrlWithout) {
                $('#registerB').click();
            }
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
        }
    };
    main.init();
})();
