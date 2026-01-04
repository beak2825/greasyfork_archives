// ==UserScript==
// @name              Deepcoin助手 - client
// @namespace         deepcoin-helper
// @version           2.0.0
// @author            Hacker
// @description       Deepcoin助手
// @license           MIT
// @homepage          https://www.deepcoin.com
// @match             *://www.deepcoin.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/buffer.js
// @require           https://unpkg.com/@otplib/preset-browser@12.0.1/index.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @resource          toastrStyle https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @connect           www.lbk.plus
// @connect           www.deepcoin.com
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
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMCA3MC40aDU3LjlWMTI4SDB6TTEyOCA3MC40Yy0xLjkgMzEuMy0yNi40IDU1LjctNTcuOSA1Ny42VjcwLjRIMTI4ek0wIDBoNTcuOXY1Ny42SDB6TTcwLjEgMGMzMS41IDEuOSA1Ni4xIDI2LjMgNTcuOSA1Ny42SDcwLjFWMHoiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/478924/Deepcoin%E5%8A%A9%E6%89%8B%20-%20client.user.js
// @updateURL https://update.greasyfork.org/scripts/478924/Deepcoin%E5%8A%A9%E6%89%8B%20-%20client.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const domain = document.domain;
    const baseAPI = `https://exchangeclientapi.dwei.xin`;
    const withdrawInner = false; //自动跳转到提现页面

    const customClass = {
        container: 'deepcoin-container',
        popup: 'deepcoin-popup',
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
        withdrawEmailCode: '',

        async getAccountById(id) {
            try {
                let {res} = await util.post(`${baseAPI}/v1/deepcoin_account/get_one`,
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
            let token = localStorage.getItem('token');
            let device = localStorage.getItem('device');
            if (!token) {
                return toast.fire({icon: 'error', title: '未找到Token'});
            }
            if (!device) {
                return toast.fire({icon: 'error', title: '未找到Device'});
            }
            let {res} = await util.post(`${baseAPI}/v1/deepcoin_account/update_one`, {
                email: email,
                cookie: util.decrypt(token),
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

        addStyle() {
            //样式
            GM_addStyle(`
                .deepcoin-container { z-index: 99999!important; }
                .deepcoin-popup { font-size: 14px !important}
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
                  </div>
                </div>
                <div class="tm-btn">提现
                  <div class="task-list">
                    <div class="tm-task" id="withdraw">0. 自动填写资金密码和Google</div>
                  </div>
                </div>
                <div class="tm-btn">登录
                  <div class="task-list">
                    <div class="tm-task" id="login">0. 自动填写账号和密码</div>
                  </div>
                </div>
                <div class="tm-btn">上传Token和Device
                  <div class="task-list">
                    <div class="tm-task" id="task-toMysql">0. 上传注册信息到服务器</div>
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
                for (let i = 1; i < 1000; i++) {
                    clearInterval(i);
                }
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
                        $('#tm-input1').text('From：' + result.value);
                        util.setValue('from', result.value);
                        main.from = await main.getAccountById(result.value);
                        $('#from').text(main.from.email);
                        let {cookie, device, user_id, email} = main.from;
                        let userInfo = {
                            "uid": user_id,
                            "token": cookie,
                            "name": "",
                            "mobile": email,
                            "phone": "",
                            "country": "China",
                            "phone_country": "",
                            "email": email,
                            "nickname": email,
                            "has_pwd": true,
                            "head_img": "https://n-bkt.deepcoin.ski/default_avatar.png",
                            "last_login_time": "",
                            "last_login_ip": ""
                        };
                        let localAccountHistory = [{"account": email, "type": 2, "areaCode": ""}];
                        let localUserList = [{
                            "uid": user_id,
                            "token": cookie,
                            "name": "",
                            "mobile": email,
                            "phone": "",
                            "country": "China",
                            "phone_country": "",
                            "email": email,
                            "nickname": email,
                            "has_pwd": true,
                            "head_img": "https://n-bkt.deepcoin.ski/default_avatar.png",
                            "last_login_time": "",
                            "last_login_ip": "",
                            "loginAccount": email,
                            "phoneCountry": ""
                        }];

                        localStorage.setItem('uid', user_id);
                        localStorage.setItem('default_accountid', user_id);
                        localStorage.setItem('Otoken', util.encrypt(cookie));
                        localStorage.setItem('token', util.encrypt(cookie));
                        localStorage.setItem('device', device);
                        localStorage.setItem('userInfo', util.encrypt(JSON.stringify(userInfo)));
                        localStorage.setItem('localAccountHistory', util.encrypt(JSON.stringify(localAccountHistory)));
                        localStorage.setItem('localUserList', util.encrypt(JSON.stringify(localUserList)));

                        await util.sleep(300);
                        if (withdrawInner) {
                            location.href = `https://${domain}/zh/withdrawal`;
                        } else {
                            history.go(0);
                        }
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

            //提币
            $('body').on('click', '#withdraw', async (event) => {
                let url = `https://${domain}/zh/withdrawal`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.carry-box', async () => {
                    await util.sleep(1500);
                    let tab = document.querySelector('.carry-box .tabs li:nth-child(2)').click();
                    await util.sleep(1000);

                    let inputUid = document.querySelector('.ucenter-info > div > form > div:nth-child(3) > div > div > input');
                    inputUid.value = main.to.user_id;
                    inputUid.dispatchEvent(new Event('input', {bubbles: true}));
                    await util.sleep(100);

                    let inputEmail = document.querySelector('.ucenter-info > div > form > div:nth-child(4) > div > div > input');
                    inputEmail.value = main.to.email;
                    inputEmail.dispatchEvent(new Event('input', {bubbles: true}));
                    await util.sleep(100);

                    let inputFundPwd = document.querySelector('.ucenter-info > div > form > div:nth-child(5) > div > div > input');
                    inputFundPwd.value = main.from.fund_password;
                    inputFundPwd.type = 'text';
                    inputFundPwd.dispatchEvent(new Event('input', {bubbles: true}));
                    await util.sleep(100);

                    let allButton = document.querySelector('.ucenter-info > div > form > div:nth-child(6) > div > div.form-phone > div.form-inp-whole > a').click();
                    await util.sleep(100);

                    let inputGoogleCode = document.querySelector('.ucenter-info > div > form > div:nth-child(8) > div > div > input');
                    setInterval(() => {
                        inputGoogleCode.value = main.getGoogleCodeBySecret(main.from.google_secret);
                        inputGoogleCode.dispatchEvent(new Event('input', {bubbles: true}));
                    }, util.getValue('interval'));
                });

                main.listenElement('.ucenter-info > div > form > div:nth-child(7) > div > button', async () => {
                    //点击发送验证码
                    document.querySelector('.ucenter-info > div > form > div:nth-child(7) > div > button').click();
                });
            });

            //登录
            $('body').on('click', '#login', async (event) => {
                let url = `https://${domain}/zh/register?status=login`;
                if (location.href !== url) return location.href = url;
                event.preventDefault();

                main.listenElement('.loginBox', async () => {
                    await util.sleep(1500);
                    let tab = document.querySelector('.loginBox > div:nth-child(3) > div.phone-email > li:nth-child(1)').click();
                    await util.sleep(1000);

                    let inputEmail = document.querySelector('.loginBox > div:nth-child(3) > div:nth-child(2) > div.input-box.flex > div > input');
                    inputEmail.value = main.from.email;
                    inputEmail.dispatchEvent(new Event('input', {bubbles: true}));
                    await util.sleep(100);

                    let inputPwd = document.querySelector('.loginBox > div:nth-child(3) > div:nth-child(2) > div:nth-child(4) > input[type=password]');
                    inputPwd.value = main.from.password;
                    inputPwd.type = 'text';
                    inputPwd.dispatchEvent(new Event('input', {bubbles: true}));
                    await util.sleep(100);

                    let submitButton = document.querySelector('.loginBox > div:nth-child(3) > div:nth-child(2) > button').click();
                    await util.sleep(1000);
                });

                main.listenElement('.input-box.code', async () => {
                    let inputGoogleCode = document.querySelector('.loginBox > div > input[type=text]');
                    inputGoogleCode.value = main.getGoogleCodeBySecret(main.from.google_secret);
                    inputGoogleCode.dispatchEvent(new Event('input', {bubbles: true}));
                    setInterval(() => {
                        inputGoogleCode.value = main.getGoogleCodeBySecret(main.from.google_secret);
                        inputGoogleCode.dispatchEvent(new Event('input', {bubbles: true}));
                    }, util.getValue('interval'));
                });
            });

            //上传 Token 和 Device
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
            let ws = new WebSocket('ws://localhost:9766');
            ws.onmessage = function (e) {
                try {
                    let res = JSON.parse(e.data);
                    if (res.type === 'withdraw' && res.exchange === 'deepcoin') {
                        main.withdrawEmailCode = res.code;
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            ws.onclose = function () {
                main.createEmailWebsocket();
            };
        },

        async autoRun() {
            let from = util.getValue('from');
            let to = util.getValue('to');
            if (!from || !to) return;
            main.from = await main.getAccountById(util.getValue('from'));
            $('#from').text(main.from.email);
            main.to = await main.getAccountById(util.getValue('to'));
            $('#to').text(main.to.email);

            //main.createEmailWebsocket();

            if (location.href.indexOf('/zh/withdrawal') > -1 && withdrawInner) {
                $('#withdraw').click();
            }

            if (location.href.indexOf('/zh/register?status=login') > -1) {
                $('#login').click();
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

        encrypt(e) {
            var t = CryptoJS.enc.Utf8.parse("I6bPqY4nJqZ1Nk3S");
            e = CryptoJS.enc.Utf8.parse(e);
            return CryptoJS.AES.encrypt(e, t, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
        },

        // Decrypt function
        decrypt(e) {
            var t = CryptoJS.enc.Utf8.parse("I6bPqY4nJqZ1Nk3S");
            e = CryptoJS.AES.decrypt(e, t, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            return CryptoJS.enc.Utf8.stringify(e).toString();
        }
    };
    main.init();
})();
