// ==UserScript==
// @name              LBank自动登录助手
// @namespace         lbank-login
// @version           1.0.4
// @author            Hacker
// @description       LBank自动登录小助手
// @license           MIT
// @homepage          https://www.lbank.com
// @match             *://www.lbk.plus/*
// @match             *://www.lbank.com/*
// @require           https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require           https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource          toastrStyle https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @connect           www.lbk.plus
// @connect           www.lbank.com
// @connect           lbkperp.lbank.com
// @connect           dwei.xin
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
// @icon              data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTQ3MiA5ODBoLTE2YTggOCAwIDAgMSAwLTE2aDE2YTggOCAwIDAgMSAwIDE2eiIgZmlsbD0iIzI2MzIzOCIvPjxwYXRoIGQ9Ik0xMTYgNTI0YTM4NCAzODQgMCAxIDAgNzY4IDAgMzg0IDM4NCAwIDEgMC03NjggMHoiIGZpbGw9IiNGRkQ3NDAiLz48cGF0aCBkPSJNNTAwIDkxNmMtMjE2LjE0NCAwLTM5Mi0xNzUuODU2LTM5Mi0zOTJzMTc1Ljg1Ni0zOTIgMzkyLTM5MiAzOTIgMTc1Ljg1NiAzOTIgMzkyLTE3NS44NTYgMzkyLTM5MiAzOTJ6bTAtNzY4Yy0yMDcuMzI4IDAtMzc2IDE2OC42NzItMzc2IDM3NnMxNjguNjcyIDM3NiAzNzYgMzc2IDM3Ni0xNjguNjcyIDM3Ni0zNzYtMTY4LjY3Mi0zNzYtMzc2LTM3NnoiIGZpbGw9IiMyNjMyMzgiLz48cGF0aCBkPSJNMTgwIDUyNGEzMjAgMzIwIDAgMSAwIDY0MCAwIDMyMCAzMjAgMCAxIDAtNjQwIDB6IiBmaWxsPSIjRkZENzQwIi8+PHBhdGggZD0iTTUwMCA4NTJjLTE4MC44NjQgMC0zMjgtMTQ3LjEzNi0zMjgtMzI4czE0Ny4xMzYtMzI4IDMyOC0zMjggMzI4IDE0Ny4xMzYgMzI4IDMyOC0xNDcuMTM2IDMyOC0zMjggMzI4em0wLTY0MGMtMTcyLjAzMiAwLTMxMiAxMzkuOTY4LTMxMiAzMTJzMTM5Ljk2OCAzMTIgMzEyIDMxMiAzMTItMTM5Ljk2OCAzMTItMzEyLTEzOS45NjgtMzEyLTMxMi0zMTJ6IiBmaWxsPSIjMjYzMjM4Ii8+PHBhdGggZD0iTTUyIDUzMmE4IDggMCAwIDEtOC04QzQ0IDI3Mi41NiAyNDguNTYgNjggNTAwIDY4YTggOCAwIDAgMSAwIDE2QzI1Ny4zNzYgODQgNjAgMjgxLjM3NiA2MCA1MjRhOCA4IDAgMCAxLTggOHpNNTQ4IDg0aC0xNmE4IDggMCAwIDEgMC0xNmgxNmE4IDggMCAwIDEgMCAxNnptLTQ4IDg5NmE4IDggMCAwIDEgMC0xNmMyNDIuNjI0IDAgNDQwLTE5Ny4zNzYgNDQwLTQ0MGE4IDggMCAwIDEgMTYgMGMwIDI1MS40NC0yMDQuNTYgNDU2LTQ1NiA0NTZ6TTg2MCA5MmgtNjRhOCA4IDAgMCAxIDAtMTZoNjRhOCA4IDAgMCAxIDAgMTZ6IiBmaWxsPSIjMjYzMjM4Ii8+PHBhdGggZD0iTTgyOCAxMjRhOCA4IDAgMCAxLTgtOFY1MmE4IDggMCAwIDEgMTYgMHY2NGE4IDggMCAwIDEtOCA4em0xNDQgNzJoLTY0YTggOCAwIDAgMSAwLTE2aDY0YTggOCAwIDAgMSAwIDE2eiIgZmlsbD0iIzI2MzIzOCIvPjxwYXRoIGQ9Ik05NDAgMjI4YTggOCAwIDAgMS04LTh2LTY0YTggOCAwIDAgMSAxNiAwdjY0YTggOCAwIDAgMS04IDh6IiBmaWxsPSIjMjYzMjM4Ii8+PHBhdGggZD0iTTYyNy4xMDQgNTExLjUybC0uMDY0LS4wMzJBOTguOTc2IDk4Ljk3NiAwIDAgMCA2NDMuOTg0IDQ1NmMwLTUwLjM2OC0zNy40ODgtOTIuMDY0LTg2LTk4Ljg5NlYzMDhoLTQ4djQ4SDQ3NnYtNDhoLTQ4djQ4aC04MHY2NGgzMnYyMTAuMjA4aC0zMlY2OTJoODB2NDhoNDh2LTQ4aDM0djQ4aDQ4di00OGgxMGExMDAuMTEyIDEwMC4xMTIgMCAwIDAgMTAwLTEwMCA5OS44MDggOTkuODA4IDAgMCAwLTQwLjg5Ni04MC40OHpNNTQ0IDQyMGMxOS44NTYgMCAzNiAxNi4xNDQgMzYgMzZzLTE2LjE0NCAzNi0zNiAzNkg0NDR2LTcyaDEwMHptMjQgMjA4SDQ0NHYtNzJoMTI0YzE5Ljg1NiAwIDM2IDE2LjE0NCAzNiAzNnMtMTYuMTQ0IDM2LTM2IDM2eiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik01NTggNzQ4aC00OGE4IDggMCAwIDEtOC04di00MGgtMTh2NDBhOCA4IDAgMCAxLTggOGgtNDhhOCA4IDAgMCAxLTgtOHYtNDBoLTcyYTggOCAwIDAgMS04LTh2LTYxLjc5MmE4IDggMCAwIDEgOC04aDI0VjQyOGgtMjRhOCA4IDAgMCAxLTgtOHYtNjRhOCA4IDAgMCAxIDgtOGg3MnYtNDBhOCA4IDAgMCAxIDgtOGg0OGE4IDggMCAwIDEgOCA4djQwaDE4di00MGE4IDggMCAwIDEgOC04aDQ4YTggOCAwIDAgMSA4IDh2NDIuMzY4YzQ5LjQ4OCAxMC4zMiA4NiA1NC41NDQgODYgMTA1LjYzMmExMDYuOTQ0IDEwNi45NDQgMCAwIDEtMTQuMzY4IDUzLjY0OEExMDguNDE2IDEwOC40MTYgMCAwIDEgNjc2IDU5MmExMDguMTI4IDEwOC4xMjggMCAwIDEtMTA4IDEwOGgtMnY0MGE4IDggMCAwIDEtOCA4em0tNDAtMTZoMzJ2LTQwYTggOCAwIDAgMSA4LThoMTBjNTAuNzIgMCA5Mi00MS4yOCA5Mi05MmE5Mi40MTYgOTIuNDE2IDAgMCAwLTM3LjQwOC03My44NzIgOCA4IDAgMCAxLTIuMTc2LTExLjEwNEM2MzAuNjA4IDQ5MS44NzIgNjM2IDQ3NC4yMjQgNjM2IDQ1NmMwLTQ1LjUwNC0zNC4wMTYtODQuNjI0LTc5LjEyLTkwLjk5MmE4IDggMCAwIDEtNi44OC03LjkyVjMxNmgtMzJ2NDBhOCA4IDAgMCAxLTggOGgtMzRhOCA4IDAgMCAxLTgtOHYtNDBoLTMydjQwYTggOCAwIDAgMS04IDhoLTcydjQ4aDI0YTggOCAwIDAgMSA4IDh2MjEwLjIwOGE4IDggMCAwIDEtOCA4aC0yNFY2ODRoNzJhOCA4IDAgMCAxIDggOHY0MGgzMnYtNDBhOCA4IDAgMCAxIDgtOGgzNGE4IDggMCAwIDEgOCA4djQwem01MC05Nkg0NDRhOCA4IDAgMCAxLTgtOHYtNzJhOCA4IDAgMCAxIDgtOGgxMjRjMjQuMjcyIDAgNDQgMTkuNzI4IDQ0IDQ0cy0xOS43MjggNDQtNDQgNDR6bS0xMTYtMTZoMTE2YzE1LjQ0IDAgMjgtMTIuNTYgMjgtMjhzLTEyLjU2LTI4LTI4LTI4SDQ1MnY1NnptOTItMTIwSDQ0NGE4IDggMCAwIDEtOC04di03MmE4IDggMCAwIDEgOC04aDEwMGMyNC4yNzIgMCA0NCAxOS43MjggNDQgNDRzLTE5LjcyOCA0NC00NCA0NHptLTkyLTE2aDkyYzE1LjQ0IDAgMjgtMTIuNTYgMjgtMjhzLTEyLjU2LTI4LTI4LTI4aC05MnY1NnoiIGZpbGw9IiMyNjMyMzgiLz48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/459003/LBank%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/459003/LBank%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const domain = document.domain;
    const registerURL = `https://${domain}/login/`;
    const baseAPI = `https://exchangeclientapi.dwei.xin`;

    let accountList = [];

    const customClass = {
        container: 'lbank-container',
        popup: 'lbank-popup',
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

        userInfo: {
            email: '请先登录账号',
            password: '',
            fundPassword: '',
            userId: '',
            extoken: '',
            cookie: '',
        },
        verifyKey: '',

        async getAccountListFromServer() {
            try {
                let {res} = await util.post(`${baseAPI}/v1/lbank_account/get_list`,
                    {"status": 200, "size": 1000, "page": 1, "order": "id|desc"}, {
                        'content-type': 'application/json;charset=UTF-8',
                    });
                if (res.code === 200) {
                    let list = [];
                    res.data.list.forEach((item) => {
                        list.push(`${item.email},${item.password},${item.fund_password},${item.id},${item.cookie_status}`);
                    });
                    return list;
                }
                return [];
            } catch (e) {
                util.message.error('无法连接服务器，请刷新重试！');
            }
        },

        async uploadCookieToServer(email, cookie) {
            try {
                await main.getUserInfo();
                if (main.userInfo.email === '请先登录账号') return util.message.error('当前账户未登录，请先登录账户！');
                let {res} = await util.post(`${baseAPI}/v1/lbank_account/update_one`,
                    {email, cookie}, {
                        'content-type': 'application/json;charset=UTF-8',
                    });
                if (res.code === 200) {
                    util.message.success('上传 Cookie 成功');
                } else {
                    util.message.error('上传 Cookie 失败');
                }
            } catch (e) {
                util.message.error('无法连接服务器');
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

        addStyle() {
            //样式
            GM_addStyle(`
                .lbank-container { z-index: 99999!important; }
                .lbank-popup { font-size: 14px !important}
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
                name: 'account',
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
                                <div class="tm-btn">选择登录账号
                                  <div class="task-list">
                                    <div id="tm-input1" class="tm-task">${util.getValue('account') ? '选择账号：' + util.getValue('account') : '<span style="color:#bc2020">请选择要登录的账号</span>'}</div>
                                  </div>
                                </div>
                                <div class="tm-btn">登录
                                  <div class="task-list">
                                    <div class="tm-task" id="tm-logout">1. 进入无痕模式</div>
                                    <div class="tm-task" id="task-login">2. 自动登录账号</div>
                                    <div class="tm-task" id="task-yiduncode">3. 识别滑动验证码</div>
                                    <div class="tm-task" id="task-upload-cookie">4. 上传Cookie到后台</div>
                                  </div>
                                </div>
                                <div class="tm-btn" id="printSetting">实时数据
                                  <div class="task-list">
                                    <div class="tm-task">当前用户：<span class="tag" id="userEmail"></span> <span id="getUserInfo">刷新</span></div>
                                    <div class="tm-task">用户UID：<span class="tag" id="userUserId"></span></div>
                                  </div>
                                </div>
                                <div class="tm-btn" id="printCookie">其他
                                  <div class="task-list">
                                    <div class="tm-task task-import-token">导入Token</div>
                                  </div>
                                </div>
                              </div>
                            </div>`);
            $('body').append(button);
        },

        async getExToken() {
            main.userInfo.extoken = await util.getCookie('_uuid', domain);
            return main.userInfo.extoken;
        },
        addPageListener() {
            $('body').on('click', '#tm-hide-control', () => {
                util.setValue('show', !util.getValue('show'));
                util.getValue('show') ? $('#tm-content').removeClass('tm-hide') : $('#tm-content').addClass('tm-hide');
                $('#tm-hide-control').text(util.getValue('show') ? '<' : '>');
            });
            //选择账号
            $('body').on('click', '#tm-input1', () => {
                let accountObj = {};
                accountList.forEach((val) => {
                    let row = val.split(',');
                    accountObj[row[0]] = `${row[3]} | ${row[4] == 200 ? '✔️' : '❌'} ${row[0]}`;
                });
                Swal.fire({
                    title: '请选择账号',
                    input: 'select',
                    inputValue: util.getValue('account'),
                    inputOptions: accountObj,
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请选择账号',
                    },
                    confirmButtonText: '确定',
                    showLoaderOnConfirm: true,
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        $('#tm-input1').text('当前账号：' + result.value);
                        util.setValue('account', result.value);
                        //history.go(0);
                    }
                });
            });
            //打印账号信息
            $('body').on('click', '#printAccount', () => {
                let account = main.getAccount(util.getValue('account'));
                Swal.fire({
                    title: '本地账号信息',
                    html: `<div style="white-space: pre-wrap; text-align: left;">${JSON.stringify(account, null, 2)}</div>`,
                    customClass
                });
            });
            //注册
            $('body').on('click', '#task-login', async () => {
                if (location.href.indexOf(registerURL) === -1) return location.href = registerURL;

                let account = main.getAccount(util.getValue('account'));
                if (account) {
                    $('.index_invitation-icode__9E2k7').css('height', '44px');

                    //let email = document.getElementsByName('dnEmail');
                    let email = document.querySelector('.sign-up input[type="text"]') || document.querySelector('form > div:nth-child(1) input');
                    let password = document.querySelector('.sign-up input[type="password"]') || document.querySelector('form > div:nth-child(2) input');

                    if (email) {
                        util.setReactNativeValue(email, account.email);
                    }
                    if (password) {
                        password.type = 'text';
                        util.setReactNativeValue(password, account.password);
                    }

                    await util.sleep(1000); //1秒后点击按钮

                    $('form button[type="submit"]')?.trigger('click');
                    //$('.btn-join')?.click();
                } else {
                    toastr.error('请先设置账户编号');
                }
            });
            //自动填写滑动验证码
            $('body').on('click', '#task-yiduncode', async () => {
                try {
                    let image1Url = $('.yidun_bg-img').attr('src');
                    let image2Url = $('.yidun_jigsaw').attr('src');
                    let base64 = await util.combineImage(image1Url, image2Url);
                    if (!base64) {
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
                    if (res.code === 10000) {
                        let distance = +res.data.data;
                        util.message.info('识别成功，距离为：' + distance);
                        let offset = 8; //实际的偏差
                        let realDistance = 280 / 320 * distance + offset; //验证码背景图显示宽度280/实际宽度320
                        //await util.slide('.yidun_slider', realDistance);
                        util.moveSideCaptcha('.yidun_slider', realDistance);
                    } else {
                        toastr.error(res.msg);
                    }
                } catch (e) {
                    toastr.error('识别验证码出错');
                }
            });
            //上传Cookie
            $('body').on('click', '#task-upload-cookie', async () => {
                try {
                    await main.getExToken();
                    let cookie = await util.exportCookieString();
                    let account = main.getAccount(util.getValue('account'));
                    let email = account.email;
                    await main.uploadCookieToServer(email, cookie);
                } catch (e) {
                    toastr.error(e, '上传Cookie失败');
                }
            });
            //获取用户登录信息
            $('body').on('click', '#getUserInfo', main.getUserInfo);
            //导入Token
            $('body').on('click', '.task-import-token', async (event) => {
                Swal.fire({
                    title: '请输入Token',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                        placeholder: '请输入Token',
                    },
                    confirmButtonText: '导入',
                    showCancelButton: false,
                    allowOutsideClick: false,
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        util.importCookie({
                            "domain": "www.lbank.com",
                            "httpOnly": false,
                            "secure": false,
                            "name": "_uuid",
                            "path": "/",
                            "sameSite": "unspecified",
                            "value": result.value,
                            "session": true,
                            "hostOnly": true
                        });
                        await util.sleep(1000);
                        history.go(0);
                    }
                });

                event.stopPropagation();
                const fileInput = document.getElementById('inputImportCookie');
                const fileReader = new FileReader();
                fileInput.addEventListener('change', () => {
                    const file = fileInput.files[0];
                    fileReader.readAsText(file);
                });
                fileReader.addEventListener('load', () => {
                    // 文件内容存储在 fileReader.result 中
                    let cookies = JSON.parse(fileReader.result);
                    cookies.forEach((cookie) => {
                        util.importCookie(cookie);
                    });
                    if (cookies.length > 0) {
                        history.go(0);
                    }
                });
            });
            //打印Cookie
            $('body').on('click', '#printCookie', async () => {
                let cookies = await util.exportCookie();
                let cookieValue = cookies.map((item) => {
                    return item.name + '=' + item.value;
                }).join('; ');
                Swal.fire({
                    title: '当前Cookie',
                    width: '600px',
                    html: `<textarea style="width: 100%; height: 200px;">${cookieValue}</textarea>`,
                    confirmButtonText: '复制',
                    showLoaderOnConfirm: true,
                    customClass
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        GM_setClipboard(cookieValue);
                    }
                });
            });
            //退出登录
            $('body').on('click', '#tm-logout', async () => {
                await main.getUserInfo();
                localStorage.clear();
                GM_cookie && GM_cookie('list', {url: domain}, async (cookies, error) => {
                    if (!error) {
                        cookies.forEach((val) => {
                            GM_cookie.delete({name: val.name, url: val.domain});
                        });
                        await main.getUserInfo();
                        util.message.success('3s 后刷新网页请继续下一步');
                        setTimeout(() => {
                            history.go(0);
                        }, 2000);
                    }
                });
            });
        },

        async getUserInfo() {
            try {
                let {res} = await util.get(`https://www.lbank.com/user-profile-center/user`, {
                    'content-type': 'application/json',
                    'ex-token': await main.getExToken(),
                    'source': '4',
                    'ex-client-type': 'WEB',
                    'referer': 'https://www.lbank.com',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                });
                if (res.code === 200) {
                    main.userInfo.email = res.data.email;
                    main.userInfo.userId = res.data.openId;
                    $('#userEmail').removeClass('tag-danger').addClass('tag-success').text(main.userInfo.email);
                    $('#userUserId').removeClass('tag-danger').addClass('tag-success').text(main.userInfo.userId);
                } else {
                    main.userInfo.email = '请先登录账号';
                    main.userInfo.userId = '';
                    $('#userEmail').removeClass('tag-success').addClass('tag-danger').text(main.userInfo.email);
                    $('#userUserId').removeClass('tag-success').addClass('tag-danger').text(main.userInfo.userId);
                }
            } catch (e) {

            }
        },

        async init() {
            accountList = await this.getAccountListFromServer();
            this.initValue();
            this.addStyle();
            this.addButton();
            this.addPageListener();
            this.getUserInfo();
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

        slide(selector, width) {
            let devicePixelRatio = window.devicePixelRatio;
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

        moveSideCaptcha(moveItem, distance) {
            if (distance === 0) {
                console.log("distance", distance);
                return;
            }
            let slider = document.querySelector(moveItem);

            let sliderLeft = null;

            let mousedown = document.createEvent("MouseEvents");
            let rect = slider.getBoundingClientRect();
            let x = rect.x;
            let y = rect.y;
            mousedown.initMouseEvent("mousedown", true, true, document.defaultView, 0, x, y, x, y, false, false, false, false, 0, null);
            slider.dispatchEvent(mousedown);

            let dx = 0;
            let dy = 0;
            let interval = setInterval(function () {
                let mousemove = document.createEvent("MouseEvents");
                let _x = x + dx;
                let _y = y + dy;
                mousemove.initMouseEvent("mousemove", true, true, document.defaultView, 0, _x, _y, _x, _y, false, false, false, false, 0, null);
                slider.dispatchEvent(mousemove);
                slider.dispatchEvent(mousemove);

                sliderLeft = $(slider).css('left').replace('px', '');

                if (sliderLeft >= distance) {
                    clearInterval(interval);
                    let mouseup = document.createEvent("MouseEvents");
                    mouseup.initMouseEvent("mouseup", true, true, document.defaultView, 0, _x, _y, _x, _y, false, false, false, false, 0, null);
                    setTimeout(() => {
                        slider.dispatchEvent(mouseup);
                    }, Math.ceil(Math.random() * 2000));
                } else {
                    if (dx >= distance - 20) {
                        dx += Math.ceil(Math.random() * 2);
                    } else {
                        dx += Math.ceil(Math.random() * 10);
                    }
                    let sign = Math.random() > 0.5 ? -1 : 1;
                    dy += Math.ceil(Math.random() * 3 * sign);
                }
            }, 10);
            setTimeout(() => {
                clearInterval(interval);
            }, 10000);
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
    };
    main.init();
})();
