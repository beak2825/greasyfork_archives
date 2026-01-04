// ==UserScript==
// @name         【图腾新版】+【弹性新版】四位数字验证码识别23.9.19【手动登录】
// @namespace    none
// @version      23.9.19
// @description  none
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=mf2.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470898/%E3%80%90%E5%9B%BE%E8%85%BE%E6%96%B0%E7%89%88%E3%80%91%2B%E3%80%90%E5%BC%B9%E6%80%A7%E6%96%B0%E7%89%88%E3%80%91%E5%9B%9B%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB23919%E3%80%90%E6%89%8B%E5%8A%A8%E7%99%BB%E5%BD%95%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470898/%E3%80%90%E5%9B%BE%E8%85%BE%E6%96%B0%E7%89%88%E3%80%91%2B%E3%80%90%E5%BC%B9%E6%80%A7%E6%96%B0%E7%89%88%E3%80%91%E5%9B%9B%E4%BD%8D%E6%95%B0%E5%AD%97%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%86%E5%88%AB23919%E3%80%90%E6%89%8B%E5%8A%A8%E7%99%BB%E5%BD%95%E3%80%91.meta.js
// ==/UserScript==

(function() {

    //限制登录页面运行
    var currentUrl = window.location.href;
    if (currentUrl.indexOf('page_id=page_login') !== -1) {

        //【㈠验证码识别函数】@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        let isRecognizing = false; // 标志变量，用来记录当前是否正在进行验证码识别
        //-------------------------------------
        async function recognizeCaptcha(needDelay = true) {
            // 如果当前正在进行验证码识别，则不再发起新的识别请求
            if (isRecognizing) {
                return;
            }

            // 设置标志变量为 true，表示当前正在进行验证码识别
            isRecognizing = true;

            // 记录开始运行时间
            var startTime = new Date().getTime();

            try {
                // 点击验证码时添加延迟
                if (needDelay) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                console.log('【图腾1】开始识别验证码');

                //获取验证码图片base64格式数据(下面分别是:pc版新平台验证码图片、重庆pc验证码图片、天津app登录页验证码图片)
                const myImg = document.querySelector('#login_idCode, #cq_login_idCode, img.lines-blue');
                const myCanvas = document.createElement('canvas');
                const myCtx = myCanvas.getContext('2d');
                myCanvas.width = myImg.naturalWidth;
                myCanvas.height = myImg.naturalHeight;
                myCtx.drawImage(myImg, 0, 0);
                let dataURL = myCanvas.toDataURL();
                console.log('【图腾2】获取验证码图片base64数据:');//原版(含图片base64数据):console.log('【图腾2】获取缓存的验证码图片:', dataURL);||

                // 如果 data URL 无效，则延迟50毫秒后重新运行
                if (dataURL === "data:,") {
                    console.log('【★★】未获取到有效验证码图片,50毫秒后重试');
                    setTimeout(() => recognizeCaptcha(false), 50);
                    isRecognizing = false;
                    return;
                }

                // 去掉base64头部，只保留图片数据
                let imgData = dataURL.split(',')[1];
                console.log('【图腾3】图片base64数据已去掉头部');//console.log('去掉头部的图片数据:', imgData);

                //使用图腾API接口进行验证码识别
                fetch('https://www.tutengocr.com/api/ocr/ty01?key=knM41zoSgF0tWsBy5EklHOVD19', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify({
                        key: 'knM41zoSgF0tWsBy5EklHOVD19',

                        image: imgData,
                    })
                }).then(response => response.json())
                    .then(data => {
                    console.log('【图腾4】获取验证码:', data); //输出结果到控制台

                    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    // 如果弹性API接口返回的状态码不是"0"(一般200表示正常)表示接口异常,那么就调用图腾API
                    if (data.code !== 0) {
                        tanxingAPI(); //调用弹性api接口
                    } else {
                        // 如果返回的状态码是"0"
                        console.log('【❤❤】继续下一步');
                    }
                    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                    var code_data = data.data;
                    code_data = code_data.replace(/o/g, '0'); //将o替换为0
                    code_data = code_data.replace(/q/g, '0'); //将q替换为0
                    code_data = code_data.replace(/I/g, '1'); //将i替换为1
                    code_data = code_data.replace(/l/g, '1'); //将L替换为1
                    code_data = code_data.replace(/x/g, '4'); //将X替换为4


                    // 检查值的长度是否等于4并且是否包含非数字字符,如果值的长度不等于4或者包含了非数字字符,那么就刷新当前页面,否则输入验证码
                    if (code_data.length !== 4 || /\D/.test(code_data)) {
                        // 刷新当前页面
                        location.reload();
                    } else {
                        // 获取输入框元素(下面分别是:pc版新平台验证码输入框、重庆pc验证码输入框、天津app登录页验证码输入框)
                        const inputElement = document.querySelector('#login_identifying_code, #cq_login_identifying_code, .uni-input-input[maxlength="4"]');

                        // 设置输入框的值
                        inputElement.value = code_data;

                        // 手动触发 input 事件
                        const event = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        inputElement.dispatchEvent(event);

                        console.log('【图腾5】验证码识别及输入完成:', code_data);
                    }

                    // 记录结束运行时间
                    var endTime = new Date().getTime();

                    // 计算运行时间并在网页上显示
                    var timeElement = document.createElement("div");
                    timeElement.innerHTML = "【TT】验证码识别耗时：" + (endTime - startTime) + "毫秒";
                    timeElement.style.fontFamily = 'Microsoft YaHei';
                    timeElement.style.fontSize = '22px';
                    timeElement.style.fontWeight = 'bold';
                    document.body.appendChild(timeElement);

                    // 识别完成后，将标志变量设置为 false
                    isRecognizing = false;

                    // 如果验证码长度不等于4，则重新运行识别函数，避免输入错误的验证码
                    //if (code_data.length !== 4) {
                    //    recognizeCaptcha();
                    //    return;
                    //}

                })
                    .catch(error => {
                    console.log('【图腾6】请求失败');
                    // 请求失败后，将标志变量设置为 false
                    isRecognizing = false;

                    // 刷新当前网页【23.9.5新增:如果请求失败,立即刷新网页或者调用"弹性api"】
                    tanxingAPI();
                });
            } catch (error) {
                console.error(error);
                // 发生错误后，将标志变量设置为 false
                isRecognizing = false;
            }
        }

        // 自动运行验证码识别函数（需延迟50毫秒等验证码图片加载完成, "这里可以不用设置延迟,因为前面在获取到无效验证码图片时50毫秒后会重试"）
        setTimeout(() => {
            recognizeCaptcha(false);
        }, 0);


        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        // ★★★★★★设置一个监听器, 当点击验证码图片后运行识别验证码验证码识别函数recognizeCaptcha(true)
        document.querySelector('#login_idCode, #cq_login_idCode,img.lines-blue').addEventListener('click', () => recognizeCaptcha(true));

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        //========自动点击登录或确认提交========

        //如果检测到验证码输入框里的值大于等于4就触发运行runInterval函数(登录或确认提交)
        const intervalId = setInterval(() => {
            // 获取输入框元素(下面分别是:pc版新平台验证码输入框、重庆pc验证码输入框、天津app登录页验证码输入框)
            const inputElement = document.querySelector('#login_identifying_code, #cq_login_identifying_code, .uni-input-input[maxlength="4"]');
            const value = inputElement.value;// 获取输入框的值
            if (value.length >= 4) {// 检查输入框的值是否大于等于4，如果是，则调用 runInterval 函数
                runInterval();//运行下面runInterval函数(自动点击"确认提交"和"登录按钮"的函数)
                clearInterval(intervalId);
            }
        }, 50);

        //【㈡自动登录的函数】@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        //自动点击"确认提交"和"登录按钮"打包成函数,这里应该不需要.btn_success.dialog_submit_btn排除属性为隐藏的情况(因为是在验证码识别后才会触发运行)
        function runInterval() {
            //识别完验证码后立即点击"确认提交"或"登录"
            var interval = setInterval(function() {//下面元素分别是天津订购页确认订单按钮+新平台pc版登录按钮+重庆登录按钮+天津手机版登录按钮
                var element = document.querySelector('.btn_success.dialog_submit_btn, #手动登录login_Toindexbtn, #cq_login_Toindexbtn, uni-view.wrapper > uni-button');
                if (element) {
                    element.click();
                    console.log('【图腾6】自动点击了登录按钮');
                    clearInterval(interval);
                }
            }, 50);//这里设置1000的时候正常

            // 在运行完 runInterval 函数后，每隔 500 毫秒检测一次页面中是否提示"验证码无效",如果提示无效则重新识别验证码并重新点击"登录或者确认提交函数"

            let count = 0;// 初始化一个计数器变量，用于记录验证码无效提示出现的次数

            // 创建一个定时器，每隔500毫秒执行一次以下代码
            const checkIntervalId = setInterval(() => {
                // 查找页面中是否存在具有类名"msg_error_txt"的元素
                const msgErrorElement = document.querySelector('.msg_error_txt');

                // 如果找到了该元素并且其文本内容是"验证码无效"
                if (msgErrorElement && msgErrorElement.textContent === "验证码无效") {
                    // 增加计数器的值，表示出现验证码无效提示的次数加一
                    count++;

                    // 如果出现次数不超过3次
                    if (count <= 3) {
                        // 重新识别并输入验证码的操作
                        recognizeCaptcha();

                        // 取消之前设置的定时器，停止继续检查
                        clearInterval(checkIntervalId);

                        // 再次执行登录按钮点击操作
                        runInterval();
                    } else {
                        // 如果出现次数超过2次，取消定时器，停止检查
                        clearInterval(checkIntervalId);
                    }
                }
            }, 1000);//这里设置500毫秒是因为完成一次验证码识别需要500毫秒左右, 如果设置时间太短会因为【验证码无效】而重复识别
        }//runInterval()函数

        //@@@@@@@@@@@@@@@@@@@@@@@@@@

        //天津点击确认提交后自动点击确定
        //var interval = setInterval(function() {
        //    var element = document.querySelector('#layui-layer4 > div.layui-layer-btn.layui-layer-btn- > a');
        //    if (element && element.style.display !== 'none') {//排除属性为隐藏的情况(这里应该不需要排除,因为是在验证码识别后才会触发运行)
        //        element.click();
        //        clearInterval(interval);
        //    }
        //}, 50);

        //@@@@@@@@@@@@@@@@@@@@@@@@@@

        //如果验证码识别异常,卡登录页那么就30秒后刷新一下登录页(仅限天津烟草)
        if (window.location.href.includes('jy.tjtobacco.cn') && window.location.href.includes('page_id=page_login')) {
            setTimeout(function() {
                var username = document.getElementById('login_username').value;
                var password = document.getElementById('login_userpwd').value;
                if (username && password) {
                    console.log('检测到用户名和密码都不为空，即将刷新页面');
                    location.reload(); // 刷新当前页面
                } else {
                    console.log('用户名或密码为空，不刷新页面');
                }
            }, 3000);
        }
    }//只在登陆页面运行


    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    //弹性API接口
    function tanxingAPI() {

        //限制登录页面运行
        var currentUrl = window.location.href;
        if (currentUrl.indexOf('page_id=page_login') !== -1) {

            //【㈠验证码识别函数】@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            let isRecognizing = false; // 标志变量，用来记录当前是否正在进行验证码识别
            //-------------------------------------
            async function recognizeCaptcha(needDelay = true) {
                // 如果当前正在进行验证码识别，则不再发起新的识别请求
                if (isRecognizing) {
                    return;
                }

                // 设置标志变量为 true，表示当前正在进行验证码识别
                isRecognizing = true;

                // 记录开始运行时间
                var startTime = new Date().getTime();

                try {
                    // 点击验证码时添加延迟
                    if (needDelay) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    console.log('【弹性1】开始识别验证码');

                    //获取验证码图片base64格式数据(下面分别是:pc版新平台验证码图片、重庆pc验证码图片、天津app登录页验证码图片)
                    const myImg = document.querySelector('#login_idCode, #cq_login_idCode, img.lines-blue');
                    const myCanvas = document.createElement('canvas');
                    const myCtx = myCanvas.getContext('2d');
                    myCanvas.width = myImg.naturalWidth;
                    myCanvas.height = myImg.naturalHeight;
                    myCtx.drawImage(myImg, 0, 0);
                    let dataURL = myCanvas.toDataURL();
                    console.log('【弹性2】获取验证码图片base64数据:');//原版(含图片base64数据):console.log('【弹性2】获取缓存的验证码图片:', dataURL);||

                    // 如果 data URL 无效，则延迟50毫秒后重新运行
                    if (dataURL === "data:,") {
                        console.log('【★★】未获取到有效验证码图片,50毫秒后重试');
                        setTimeout(() => recognizeCaptcha(false), 10);
                        isRecognizing = false;
                        return;
                    }

                    // 去掉base64头部，只保留图片数据
                    let imgData = dataURL.split(',')[1];
                    console.log('【弹性3】图片base64数据已去掉头部');//console.log('去掉头部的图片数据:', imgData);

                    //使用弹性API接口进行验证码识别
                    const params = new URLSearchParams();
                    params.append('token', 'dt05M5iQMUGTN');
                    params.append('img_data', imgData);

                    fetch('https://api.txapi.cn/v1/aim/ocr/img_code', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: params
                    }).then(response => response.json())
                        .then(data => {
                        console.log('【弹性4】获取验证码:', data); //输出结果到控制台

                        var code_data = data.data.text;
                        code_data = code_data.replace(/o/g, '0'); //将o替换为0
                        code_data = code_data.replace(/q/g, '0'); //将q替换为0
                        code_data = code_data.replace(/I/g, '1'); //将i替换为1
                        code_data = code_data.replace(/l/g, '1'); //将L替换为1
                        code_data = code_data.replace(/x/g, '4'); //将X替换为4


                        // 检查值的长度是否等于4并且是否包含非数字字符,如果值的长度不等于4或者包含了非数字字符,那么就刷新当前页面,否则输入验证码
                        if (code_data.length !== 4 || /\D/.test(code_data)) {
                            // 刷新当前页面
                            location.reload();
                        } else {
                            // 获取输入框元素(下面分别是:pc版新平台验证码输入框、重庆pc验证码输入框、天津app登录页验证码输入框)
                            const inputElement = document.querySelector('#login_identifying_code, #cq_login_identifying_code, .uni-input-input[maxlength="4"]');

                            // 设置输入框的值
                            inputElement.value = code_data;

                            // 手动触发 input 事件
                            const event = new Event('input', {
                                bubbles: true,
                                cancelable: true,
                            });
                            inputElement.dispatchEvent(event);

                            console.log('【弹性5】验证码识别及输入完成:', code_data);
                        }

                        // 记录结束运行时间
                        var endTime = new Date().getTime();

                        // 计算运行时间并在网页上显示
                        var timeElement = document.createElement("div");
                        timeElement.innerHTML = "【TX】验证码识别耗时：" + (endTime - startTime) + "毫秒";
                        timeElement.style.fontFamily = 'Microsoft YaHei';
                        timeElement.style.fontSize = '22px';
                        timeElement.style.fontWeight = 'bold';
                        document.body.appendChild(timeElement);

                        // 识别完成后，将标志变量设置为 false
                        isRecognizing = false;

                    })
                        .catch(error => {
                        console.log('【弹性6】请求失败');
                        // 请求失败后，将标志变量设置为 false
                        isRecognizing = false;

                        // 刷新当前网页【23.9.5新增:如果请求失败,立即刷新网页】
                        window.location.reload();
                    });
                } catch (error) {
                    console.error(error);
                    // 发生错误后，将标志变量设置为 false
                    isRecognizing = false;
                }
            }

            // 自动运行验证码识别函数（需延迟50毫秒等验证码图片加载完成, "这里可以不用设置延迟,因为前面在获取到无效验证码图片时50毫秒后会重试"）
            setTimeout(() => {
                recognizeCaptcha(false);
            }, 0);

        }//只在登陆页面运行

    }//弹性API接口


})();


