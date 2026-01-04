// ==UserScript==
// @name         自动注册gemini
// @namespace    QTools.net
// @version      3.0.4
// @description  自动注册openai
// @author       q
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @icon         data:image/gif
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496884/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Cgemini.user.js
// @updateURL https://update.greasyfork.org/scripts/496884/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Cgemini.meta.js
// ==/UserScript==



(async function () {
    'use strict';

    const tools = {
        delayAsync: async (ms) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, ms);
            });
        },
        wiatDomLoadingAsunc: async (css, timeOut = 10) => {
            for (let index = 0; index < timeOut; index++) {
                await tools.delayAsync(1000);

                var dom = document.querySelector(css);
                console.log("等待加载", css, dom);
                if (dom) {
                    return true
                }
            }
            throw { code: -1 }
        },
        wiatDomLoadingByInnerTextAsunc: async (css, text, timeOut = 10) => {
            for (let index = 0; index < timeOut; index++) {
                await tools.delayAsync(1000);
                var doms = document.querySelectorAll(css);
                console.log("等待加载", css, text, doms);
                for (let i = 0; i < doms.length; i++) {
                    const element = doms[i];
                    if (element.innerText.indexOf(text) > -1) {
                        return element;
                    }
                }
            }
            throw { code: -1 }
        },
        makeFullName: async () => {
            // 定义可能的名字部分
            const firstNames = ["Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria", "Scarlett"];
            const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"];
            // 生成随机名字
            const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            return randomFirstName + " " + randomLastName;
        },

        // 生成随机的年满18岁的出生日期
        makeBirthday() {
            // 当前日期
            const currentDate = new Date();
            // 当前年份减去18，确保随机生成的日期年满18岁
            const minYear = currentDate.getFullYear() - 18;
            // 最小日期为1900年1月1日
            const minDate = new Date(minYear, 0, 1);
            // 最大日期为当前日期
            const maxDate = currentDate;

            // 生成随机日期
            const randomTimestamp = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
            const randomDate = new Date(randomTimestamp);

            // 格式化日期为 MM/DD/YYYY
            const month = String(randomDate.getMonth() + 1).padStart(2, '0');
            const day = String(randomDate.getDate()).padStart(2, '0');
            const year = randomDate.getFullYear();

            return `${month}/${day}/${year}`;
        },


        async makeRequestAsync(url, method, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    data: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json", // 设置请求头，根据需要修改
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjEsImlhdCI6MTcxNDcwMzMzNSwibmJmIjoxNzE0NzAzMzM1LCJleHAiOjE3NzQ3MDMzMzUsImlzcyI6ImRvdG5ldGNoaW5hIiwiYXVkIjoicG93ZXJieSBGdXJpb24ifQ.C3NMgjPWiokPTYTb6Ig-Lr5w-OspICxLBEBmz1aep5Q"
                    },
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            console.log('responseresponseresponseresponse', response);
                            var tempJson = JSON.parse(response.responseText)
                            if (tempJson.statusCode == 200) {
                                resolve(tempJson);
                            } else {
                                reject("请求失败：" + response.statusText);
                            }
                        } else {
                            reject("请求失败：" + response.statusText);
                        }
                    },
                    onerror: function (err) {
                        console.log("err", err);
                        reject("请求错误：" + err);
                    }
                });
            });
        },

        //模拟点击
        simulateMouseDown: (element) => {
            const event = new MouseEvent('mousedown', {
                view: unsafeWindow,
                bubbles: true,
                cancelable: true,
                clientX: element.getBoundingClientRect().left + element.offsetWidth / 2,
                clientY: element.getBoundingClientRect().top + element.offsetHeight / 2,
                button: 0, // 主鼠标按钮 (通常是左键)
                buttons: 1, // 二进制掩码,表示按下的鼠标按钮
            });
            console.log("e", event);
            element.dispatchEvent(event);
        },
        setNativeValue: (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value)
            } else {
                valueSetter.call(element, value)
            }
            element.dispatchEvent(new Event('input', { bubbles: true }))
        },
        //模拟inpout修改值
        simulateInputAsync: async (input, val) => {
            for (let i = 0; i < val.length; i++) {
                const char = val[i];
                const keydownEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: char,
                    code: `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0)
                });
                input.dispatchEvent(keydownEvent);
                input.value += char;

                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    data: char
                });
                input.dispatchEvent(inputEvent);

                const keyupEvent = new KeyboardEvent('keyup', {
                    bubbles: true,
                    cancelable: true,
                    key: char,
                    code: `Key${char.toUpperCase()}`,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0)
                });
                input.dispatchEvent(keyupEvent);

                await tools.delayAsync(100);
            }


            const changeEvent = new Event('change', {
                bubbles: true,
                cancelable: true
            });
            // 触发 change 事件
            input.dispatchEvent(changeEvent);

            const blurEvent = new FocusEvent('blur', {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow,
                relatedTarget: null
            });
            // 触发 blur 事件
            input.dispatchEvent(blurEvent);
        }
    }





    const api = {
        getUserInfoAsync: async () => {
            var userInfo = GM_getValue('userInfo');
            if (!userInfo) {
                var response = await tools.makeRequestAsync('https://api4.vaszimu.com/api/open-ai/getuserinfo/z', 'GET', {
                    adapterId: 5,
                    configJson: "{ \"ApiUrl\":\"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent\", \"Key\":\"xxxxx\", \"ProxyType\":\"1\", \"Proxy\":\"https://aihub-uxoafmabtw.ap-southeast-1.fcapp.run\" }\n",
                    id: 0,
                    isEnable: true,
                    lockTime: null,
                    name: "测试",
                    parallelNum: 1,
                    weights: 1,
                });
                console.log('getUserInfoAsync:', response);
                // 这里可以对响应数据进行处理
                GM_setValue('userInfo', response.data);
                return response
            }
            return userInfo
        },
    }





    function queryState() {


        if (document.querySelector("#identifierId")) {
            return "填写邮箱";
        }


        if (document.location.href.indexOf("myaccount") > -1 || document.body.innerText.indexOf("Welcome, ") > -1) {
            return "跳转API"
        }



        if (document.location.href.indexOf("app/apikey") > -1 || document.body.innerText.indexOf("I'd like to receive invitations ") > -1) {
            return "勾选同意"
        }


        console.log('jinlaile');
        if (document.body.innerText.indexOf("Create your account") > -1 || document.body.innerText.indexOf("Create an account") > -1) {
            var element = document.querySelector('#password');
            //如果没有密码
            if (element) {
                return "填写密码"
            } else {
                return "填写邮箱"
            }
        }







        if (document.body.innerText.indexOf("With passkeys you can now use your") > -1) {
            return "不是现在"
        }


        if (document.body.innerText.indexOf("Complete a few suggestions to get the most out of your Google account") > -1) {
            return "跳转myaccount"
        }


        if (document.body.innerText.indexOf("Verify your identity") > -1) {
            return "需要手机验证"
        }


        if (document.body.innerText.indexOf("You can also download your data from some Google services") > -1) {
            return "违反政策"
        }

        if (document.body.innerText.indexOf("Complete a few suggestions to get the most out of your Google account") > -1) {
            return "跳转myaccount"
        }


        if (document.body.innerText.indexOf("Verify your email") > -1) {
            return "读取邮箱验证地址"
        }

        if (document.body.innerText.indexOf("Start verification") > -1) {
            console.log('开始验证');
            return "开始验证"
        }

    }


    // 定义要定时执行的函数
    async function myFunction() {
        try {
            if (window.location.href.indexOf("siliconflow") > -1) {
                return;
            }

            if (document.location.href.indexOf("gds.google.com") > -1) {
                document.location.href = "https://accounts.google.com/";
            }


            if (document.body.innerText.indexOf("Choose how you want to sign") > -1) {
                try {
                    await tools.delayAsync(4000);
                    var fingerprint = document.querySelectorAll('li')[2]
                    var fingerprintDiv = fingerprint.querySelector('div')
                    if (fingerprintDiv) {
                        fingerprintDiv.click()
                    }
                } catch (err) {
                    document.location.href = "https://myaccount.google.com/";
                }
                return;
            }

            if (document.body.innerText.indexOf("Confirm the recovery email address you added to your") > -1) {
                document.title = "验证邮箱:"
                for (let i = 0; i < 10; i++) {
                    await tools.delayAsync(1000);
                    if (document.querySelectorAll('input')[0].value != '') {
                        var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Next", 5);
                        button.click();
                        break;
                    }
                }
                document.location.href = "https://myaccount.google.com/";
                return;
            }


            document.querySelectorAll("div").forEach(i => {
                if (i.children.length == 0 && i.innerText.indexOf("Use another account") > -1) {
                    i.click();
                }
            })
        } catch (error) {

        }

    }

    // 设置定时器，每隔10000毫秒（10秒）执行一次myFunction
    let intervalId = setInterval(myFunction, 10000);



    if (window.location.href.indexOf("/bscframe") > -1) {
        return;
    }


    async function waitDomLoading() {



        //判断url
        console.log(" window.location.href", window.location.href);
        // if (xxxxxx)

        var url = window.location.href;
        console.log("111", url);
        if (url.indexOf("aistudio")) {
            //await tools.wiatDomLoadingByInnerTextAsunc("button", "Continue", 3);
        }
    }

    try {
        await waitDomLoading();
    } catch (error) {
        alert("等待异常")
    } finally {
        console.log("等待结束")
    }



    if (window.location.href.indexOf("siliconflow") > -1) {
        return;
    }

    //alert(1);
    console.log(document.querySelector('#root'));

    var state = queryState();

    console.log('状态：', state);
    switch (state) {
        case "填写邮箱":
            var index = 0;
            while (true) {
                index++;
                await tools.delayAsync(2000);
                try {
                    var robot = await tools.wiatDomLoadingByInnerTextAsunc("div", "Confirm you’re not a robot", 5);
                    if (robot) {
                        await tools.delayAsync(30000);

                        var a = document.querySelector('.recaptcha-checkbox-spinner')
                        if (a.style.display != 'none') {
                            document.title = "重试:图片验证"
                            return
                        }

                    }
                } catch (err) {
                    //没有就跳过
                }


                await tools.delayAsync(3000);
                if (document.body.innerText.indexOf("on your phone to verify it’s you") > -1) {

                    await tools.delayAsync(5000);
                    document.location.href = "https://accounts.google.com/";

                    // document.title = "重试:需要手机验证"
                    return
                }


                try {
                    var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Next", 5);
                    if (button) {
                        document.querySelector("input").focus();

                        const changeEvent = new Event('change', {
                            bubbles: true,
                            cancelable: true
                        });
                        // 触发 change 事件
                        document.querySelector("input").dispatchEvent(changeEvent);

                        document.querySelector("input").parentElement.click();
                        tools.simulateMouseDown(document.querySelector("input").parentElement);
                        await tools.delayAsync(500);
                        console.log("找到按钮", button)
                        button.click();
                    }
                } catch (error) {
                    //找不到按钮，重新加载
                    document.location.href = "https://accounts.google.com/";
                }


                if (index > 10) {
                    try {
                        var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Try another way", 5);
                        if (button) {
                            await tools.delayAsync(1000);
                            document.location.href = "https://accounts.google.com/";
                        }
                    } catch (err) {
                        //没有就跳过
                        document.location.href = "https://accounts.google.com/";
                    }
                }
            }
            break;

        case "填写邮箱2":
            // return;
            //document.querySelector("#identifierId").value = "chevonnesophan@gmail.com";
            await tools.delayAsync(2000);
            document.querySelector("button.VfPpkd-LgbsSe-OWXEXe-k8QpJ").click();
            await tools.wiatDomLoadingAsunc("input[type=password].whsOnd", 20);
            await tools.delayAsync(2000);
            //document.querySelector("input[type=password].whsOnd").value = "hbbzgeaogt";
            await tools.delayAsync(500);
            document.querySelector("button.VfPpkd-LgbsSe-OWXEXe-k8QpJ").click();





            try {
                var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Try another way", 10);
                if (button) {
                    await tools.delayAsync(10000);
                    document.location.href = "https://accounts.google.com/";
                }
            } catch (err) {
                //没有就跳过
            }


            break;


        case "不是现在":
            try {
                console.log("进入 fingerprint");
                var fingerprint = await tools.wiatDomLoadingByInnerTextAsunc("div", "With passkeys you can now use your fingerprint, face, or screen lock to verify it’s really you", 5);
                console.log("确实有 fingerprint");

                if (fingerprint) {
                    console.log("开始找 Not now");

                    var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Not now", 5);

                    button.click();
                }
            } catch (err) {
                //没有就跳过
            }

            break;


        case "违反政策":
            document.title = "失败:违反政策"
            break;

        case "需要手机验证":
            document.title = "失败:需要手机验证"
            break;

        case "跳转myaccount":
            document.location.href = "https://myaccount.google.com/";
            break;
        case "跳转API":
            document.location.href = "https://aistudio.google.com/app/apikey";
            break;
        case "勾选同意":

            await tools.delayAsync(3000);

            try {//第一次访问关闭弹窗
                var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "New Prompt", 5);
                document.querySelector("button[aria-label=close]").click();
            } catch (error) {

            }



            var doms = document.querySelectorAll("input[type=checkbox]");
            doms.forEach(element => {
                element.click();
            });
            await tools.delayAsync(1000);
            if (document.querySelector("button.mdc-button.mdc-button--unelevated.mat-primary")) {
                document.querySelector("button.mdc-button.mdc-button--unelevated.mat-primary").click();
            }



            await tools.delayAsync(2000);


            try {
                var okButton = await tools.wiatDomLoadingByInnerTextAsunc("button", "Create API key", 5);
            } catch (error) {
                window.location.reload();
            }




            console.log("okButton disabled", okButton.disabled);
            var i = 0;
            while (okButton.disabled) {
                await tools.delayAsync(1000);
                if (i++ > 10) {
                    //如果过了10秒还是不可用
                    window.location.reload();
                }
            }



            okButton.click();
            console.log("okButton", okButton);
            await tools.delayAsync(3000);



            //网络慢 有可能找不到这个按钮
            try {
                var a = document.querySelector(".mat-mdc-dialog-actions")
                a = a.querySelector('button')
                // var button = await tools.wiatDomLoadingByInnerTextAsunc("mat-dialog-actions", "Got it", 10);
                // console.log("Got it", button);
                if (a) {
                    a.click();
                }
            } catch (err) {
                //没有就跳过
            }



            try {
                var button2 = await tools.wiatDomLoadingByInnerTextAsunc("button", "Create API key in new project", 10);
                if (button2) {
                    button2.click();
                } else {
                    // 如果不让新创建项目，让选择 现有项目创建
                    var existing = await tools.wiatDomLoadingByInnerTextAsunc("button", "Create API key in existing project", 10);
                    if (existing) {
                        var a = document.querySelector('#project-name-input')
                        a.click()
                        var b = document.querySelector('.mat-mdc-option')
                        b.click()
                        existing.click()
                    }
                }
            } catch (error) {
                //没有找到这个按钮 刷新
                window.location.reload();
            }










            try {
                var button2 = await tools.wiatDomLoadingByInnerTextAsunc("button", "Copy", 20);
            } catch {
                // //已经存在key了
                // if(document.body.innerText.indexOf("xxxxxxxxxxxxxx")){
                //     window.title = "失败:已经有Key"
                //     return;
                // }

                window.location.reload();
            }

            //有了

            var key = document.querySelector(".apikey-text").innerText;



            //     "id": 0,
            //     "name": "string",
            //     "adapterId": 0,
            //     "configJson": "string",
            //     "parallelNum": 0,
            //     "state": 0,
            //     "isEnable": true,
            //     "weights": 0,
            //     "lockTime": "2024-05-03T18:01:40.049Z"
            //   }


            var newWindow = window.open("http://api.proxyrack.net/release", "_blank");
            await tools.delayAsync(3000);

            document.title = "已完成:" + key;


            return;
            var data = {
                adapterId: 6,
                configJson: `{ \"ApiUrl\":\"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent\", \"Key\":\"${key}\", \"ProxyType\":\"1\", \"Proxy\":\"https://aihub-ayjqglebcw.us-west-1.fcapp.run\" }\n`,
                id: 0,
                isEnable: true,
                lockTime: null,
                name: "guigu" + Date.now(),
                parallelNum: 1,
                weights: 1,
            }




            try {
                var response = await tools.makeRequestAsync('https://fanyi.vaszimu.com/api/channel-api/channel', 'POST', data);
                console.log('responseresponse:', response);
                document.title = "已完成:" + key;
            } catch (error) {
                document.title = "添加失败手动，需要手动添加:" + key;
                alert(key);
            }


            break;
        default:
            // location.reload();
            break;
    }




})();


