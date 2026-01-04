// ==UserScript==
// @name         古诗文网自动填充验证码
// @namespace    http://waahah.github.io/
// @version      0.2.4
// @description  自动识别填充验证码以及账号信息并登录，不需要到代码中修改账号，登陆一次之后就会自动登录
// @author       waahah
// @license      Apache License 2.0
// @require      https://unpkg.com/tesseract.js@2.1.4/dist/tesseract.min.js
// @match        *://so.gushiwen.cn/user/login.aspx*
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='none' d='M0 0h24v24H0z'/%3E%3Cpath d='M15 3h6v5h-2V5h-4V3zM9 3v2H5v3H3V3h6zm6 18v-2h4v-3h2v5h-6zm-6 0H3v-5h2v3h4v2zM3 11h18v2H3v-2z'/%3E%3C/svg%3E
// @grant             unsafeWindow
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/441805/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441805/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    class Sleep {
        constructor(timeout) {
          this.timeout = timeout;
        }
        then(resolve, reject) {
          const startTime = Date.now();
          setTimeout(
            () => resolve(Date.now() - startTime),
            this.timeout
          );
        }
      }

    let name, pwd, valName, valPwd;
    const host_name = `${location.host}_nmae`;
    const host_pwd = `${location.host}_pwd`;

    //存放自己写好的工具类函数的对象
    const utils = {
        get_utils: function () {
            valName = localStorage.getItem(host_name);
            valPwd = localStorage.getItem(host_pwd);
            return this.get_utils;
        },
        set_utils: () => {
            window.localStorage.setItem(host_name, name);
            window.localStorage.setItem(host_pwd, pwd);
        }
    };
    utils.del_utils = () => {
        if (window.localStorage.getItem(host_name) !== null) {
            window.localStorage.removeItem(host_name);
        }
        if (window.localStorage.getItem(host_pwd) !== null) {
            window.localStorage.removeItem(host_pwd);
        }
    }

    GM_registerMenuCommand("删除保存在本地的账号密码", utils.del_utils);
    utils.get_utils();

    if (valName == undefined && valPwd == undefined) {
        name = prompt('第一次需输入邮箱/手机号:', '');
        pwd = prompt('第一次需输入密码:', '');
        utils.set_utils();
        utils.get_utils();
        console.log(localStorage);
    }

    const account = document.querySelector('#email');
    const password = document.querySelector('#pwd');
    const core = document.querySelector('#code');
    const randcode = document.querySelector('#imgCode');
    const submit = document.querySelector('#denglu');
    const emailNo = document.getElementById('emailNo').style.display;
    const pwdNo = document.getElementById('pwdNo').style.display;

    const login = () => {
        $("#leftLogin").fadeOut("slow");//立即停止显示微信扫码登录
        clearInterval(intervalErweima);
        if (account.value == '邮箱 / 手机号' && password.value == '') {
            //onEmial();//消除提示
            account.value = valName;
            //onPwd();消除提示
            password.value = valPwd;
        } else if (zhanghao.value !== valName || password.value !== valPwd) {
            zhanghao.value = valName;
            password.value = valPwd;
        }
        return new Promise(resolve => {
            console.log('开始尝试登录...');
        })
    }

    const security = async () => {
        //GetCodeImg();
        const exampleImage = "/RandCode.ashx";
        console.log(`exampleImage：${exampleImage}`);

        const worker = Tesseract.createWorker({
            logger: m => console.log(m)
        });
        Tesseract.setLogging(true);
        work();

        async function work() {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');

            let result = await worker.recognize(exampleImage);
            console.log(result.data);
            console.log(`识别成功率：${result.data.confidence}`);

            await worker.terminate();
            core.value = result.data.text;
            if (emailNo == 'none' && pwdNo == 'none' && result.data.confidence > 50) {
                submit.click();
            }
            if (result.data.confidence < 60) {
                (async () => GetCodeImg())().then(
                    async () => {
                        await new Sleep(1000);
                        await security();
                    }
                );

            }
        }
    }

    window.onload = async () => {
        login().then(
            security()
        );
    }

})();