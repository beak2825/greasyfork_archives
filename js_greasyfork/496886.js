// ==UserScript==
// @name         自动注册sf
// @namespace    QTools.net
// @version      3.0.6
// @description  自动注册openai
// @author       q
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @icon         data:image/gif
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496886/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Csf.user.js
// @updateURL https://update.greasyfork.org/scripts/496886/%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8Csf.meta.js
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

        console.log("!!!!!!!!!!!!url", document.location.href);

        if (document.location.href.indexOf("cloud.siliconflow.cn/auth/login") > -1) {
            return "siliconflow登录页"
        }

        if (document.location.href.indexOf("cloud.siliconflow.cn/models/text/chat") > -1) {
            return "siliconflow首页"
        }

        if (document.location.href.indexOf("https://cloud.siliconflow.cn/keys") > -1) {
            return "siliconflow获取key"
        }

        if (document.body.innerText.indexOf("By continuing, Google will share your name, email address, language preference, an") > -1) {
            return "选择google账号继续"
        }


        if (document.body.innerText.indexOf("Google will share your name, email address, language preferenc") > -1) {
            return "选择google账号"
        }




        // if (document.location.href.indexOf("https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount") > -1) {
        //     return "选择google账号"
        // }

        console.log('jinlaile');



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




    //alert(1);
    console.log(document.querySelector('#root'));

    var state = queryState();

    console.log('sf状态：', state);
    switch (state) {





        case "选择google账号继续":


            var button = await tools.wiatDomLoadingByInnerTextAsunc("button", "Continue", 5);

            button.click()



            break;


        case "选择google账号":

            await tools.delayAsync(5000);

            var a = document.querySelector('.Dl08I')
            a = a.querySelector('li')
            a = a.querySelector('div')
            a.click()
            break;

        case "siliconflow登录页":
            await tools.delayAsync(5000);
            var a = document.querySelector('.text-card-foreground')

            var btn = a.querySelectorAll('button')[5]
            if (btn) {
                btn.click()
                break;
            }

            var btn = a.querySelectorAll('button')[4]
            if (btn) {
                btn.click()
                break;
            }




        case "siliconflow首页":
            await tools.delayAsync(2000);


            var a = document.querySelector('.lucide-key')
            var b = a.parentNode
            b.click()


            await tools.delayAsync(3000);

            var a = document.querySelectorAll('button')[1]
            a.click()
            await tools.delayAsync(4000);


            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow
            });
            document.querySelector("td svg").dispatchEvent(event);
            await tools.delayAsync(1000);

            var key = document.querySelectorAll("tr")[1].querySelectorAll('td')[1].querySelectorAll('span')[0].innerText


            document.title = "已完成:" + key;
            break;




        case "siliconflow获取key":
            await tools.delayAsync(3000);

            var a = document.querySelectorAll('button')[1]
            a.click()
            await tools.delayAsync(4000);


            var event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow
            });
            document.querySelector("td svg").dispatchEvent(event);
            await tools.delayAsync(1000);

            var key = document.querySelectorAll("tr")[1].querySelectorAll('td')[1].querySelectorAll('span')[0].innerText


            document.title = "已完成:" + key;
            break;

        default:
            // location.reload();
            break;
    }


    setTimeout(function () {
        location.reload();
    }, 1000 * 6000)

})();
