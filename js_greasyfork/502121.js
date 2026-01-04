// ==UserScript==
// @name         my crack slide
// @license MIT
// @namespace    http://oneoneone.cn/
// @version      3.9
// @description  This is a script file used to move the slider verification code, but the success rate cannot be guaranteed.
// @author       ChoiWan
// @match        https://*.temu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      127.0.0.1
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/short-unique-id@5.2.0/dist/short-unique-id.min.js
// @require       https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=


// @downloadURL https://update.greasyfork.org/scripts/502121/my%20crack%20slide.user.js
// @updateURL https://update.greasyfork.org/scripts/502121/my%20crack%20slide.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict'
    /* var isFirstRun = GM_getValue('IS_FIRST_RUN',null)
    if(!isFirstRun){
        console.log('IS_FIRST_RUN')
        clearAllCookies()
        GM_setValue("IS_FIRST_RUN", "1");
        windows.location.reload(true)
    }*/

    //===================Function 0: anti ========================================
    /*var anti = ''
    function doGetAnti(){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'get',
                url: 'http://127.0.0.1:6699/api/anti',
                dataType: 'json',
                onload: function(res) {
                    if (res.status === 200) {
                        const responseData = JSON.parse(res.responseText)
                        const anti = responseData.data
                        resolve(anti)
                    }
                }
            })
        })
    }

    doGetAnti().then((data)=>{
        anti = data
        console.log(anti)
    })
    */

    //===================Function : HOOK REQUEST ========================================
    /*ajaxHooker.hook(request => {

        //if (request.url === '/api/bg/sigerus/auth/login_name/is_registered') {

        // console.log('ajaxHooker :',request)

        // request.headers['Anti-Content'] = anti
        //}
    });*/

    //===================Function 1: doAutoRefresh ========================================
    /*doAutoRefresh()
    function doAutoRefresh(){
        setInterval(() => {
            waitElement('#best_new_log')
                        .then(result => {
                const text = $('#best_new_log>p').text()
                if(text.indexOf('任务队列为空')!=-1){
                    console.log('doAutoRefresh')
                    location.reload();
                }
            })

        },5000)
    }*/


    //===================Function 1: doAutoClick ========================================
    doAutoClick()
    function doAutoClick() {

        setInterval(() => {

            // Reject all
            const rejectItem = $('span:contains("Reject all")')
            // 隐藏cookie弹框
            if (rejectItem.length > 0) {
                rejectItem.click()
            }

            const startBtn = $('.kasdsaj>.btn-box>#task-start')
            if (startBtn.length > 0) {
                const text = startBtn.text()
                if (text == 'start') {
                    console.log('start')
                    startBtn.click()
                }else {
                    console.log('stop')
                    startBtn.click()
                    setTimeout(() => {
                        const _startBtn = $('.kasdsaj>.btn-box>#task-start')
                        const text = startBtn.text()
                        if (text == 'start') {
                            console.log('start')
                            _startBtn.click()
                        }
                    }, 300)
                    setTimeout(() => {
                        const _startBtn = $('.kasdsaj>.btn-box>#task-start')
                        const text = startBtn.text()
                        if (text == 'start') {
                            console.log('start')
                            _startBtn.click()
                        }
                    }, 1000)
                    setTimeout(() => {
                        const _startBtn = $('.kasdsaj>.btn-box>#task-start')
                        const text = startBtn.text()
                        if (text == 'start') {
                            console.log('start')
                            _startBtn.click()
                        }
                    }, 2000)
                }
            }

        }, 30000)
    }

    //===================Function 1: doCheckSoldOut ========================================
    /* doCheckSoldOut()

    function doCheckSoldOut() {
        setInterval(() => {
            const flag = $('div:contains("This item is sold out.")')
            if (flag.length > 0) {
                console.log('sold out')
                clearAllCookies();
                window.location.replace('https://temu.com/?' + Math.random())
            }
        }, 20000)
    }
    */

    //===================Function 2: doCheckJumpToLogin ========================================
    //doCheckJumpToLogin()

    navigation.addEventListener("navigate", (event) => {
        const d_url = event.destination.url
        if(d_url.indexOf('login.html')!==-1) {
            event.intercept({
                focusReset: "manual",
                scroll: "manual",
                async handler() {

                    // You could navigate again with {history: 'replace'} to change the URL here,
                    // which might indicate "done"
                },
            });
        }

    });
    function doCheckJumpToLogin() {
        var isLogining = false

        setInterval(() => {
            if(!isLogining){
                const href = window.location.href
                if (href.indexOf('temu.com/login.html') !== -1) {
                    isLogining = true
                    waitElement('#user-account')
                        .then(result => {
                        var uid = new ShortUniqueId({ length: 11,dictionary:'number' });
                        const account = uid.rnd()+'@qq.com'
                        $('#user-account').val(account)
                        waitElement('#submit-button')
                            .then(result => {
                            $('#submit-button').click()
                            waitElement('#pwdInputInLoginDialog')
                                .then(result => {
                                $('#user-account').val(account)
                                $('#pwdInputInLoginDialog').trigger("focus")
                                document.execCommand("insertText", false, account)

                                waitElement('#submit-button')
                                    .then(result => {
                                    $('#submit-button').click()
                                    isLogining = false
                                    console.log('register finish!',account)
                                }).catch(err=>{
                                    console.log('sorry:submit-button2')
                                    isLogining = false
                                })
                            }).catch(err=>{
                                console.log('sorry:pwdInputInLoginDialog')
                                isLogining = false
                            })
                        }).catch(err=>{
                            console.log('sorry:submit-button')
                            isLogining = false
                        })
                        $('#submit-button').click()
                    }).catch(err=>{
                        console.log('sorry:user-account')
                        isLogining = false
                    })
                }
            }

        }, 60000)

    }


    //====================Function 3: auto slide =======================================
    var isVerifying = false
    var GapimgBase64 = null

    // check dialog
    const interval_verifyDialog = setInterval(() => {
        const element = document.querySelector('.verifyDialog')
        if (element && !isVerifying) {
            waitElement('#slider')
                .then(result => {
                beginCrack()
            }).catch(err=>{
                console.log('warnning:no slider !!!!!!!!')
                //doRandomGo()
                //window.location.replace('https://www.temu.com/uk?' + Math.random())
            })
        }
    }, 10000)

    async function doRandomGo(){
        console.log('doRandomGo')
        isVerifying = true
        var verifyDialog = $('.verifyDialog')[0]
        //
        var mousedown = document.createEvent('MouseEvents')
        var rect = verifyDialog.getBoundingClientRect()
        var x = rect.width * 0.5 + getRandomInteger(-10, 10)
        var y = rect.height * 0.5 + getRandomInteger(-10, 10)
        mousedown.initMouseEvent(
            'mousedown',
            true,
            true,
            document.defaultView,
            0,
            x,
            y,
            x,
            y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        verifyDialog.dispatchEvent(mousedown)
        await sleep(100)
        //
        var mousemove = document.createEvent('MouseEvents')
        var _x = x + getRandomInteger(-10, 10)
        var _y = y + getRandomInteger(-10, 10)
        mousemove.initMouseEvent(
            'mousemove',
            true,
            true,
            document.defaultView,
            0,
            _x,
            _y,
            _x,
            _y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        verifyDialog.dispatchEvent(mousemove)
        //
        await sleep(1000)
        var __x = _x + getRandomInteger(-10, 10)
        var __y = _y + getRandomInteger(-10, 10)
        var mouseup = document.createEvent('MouseEvents')
        mouseup.initMouseEvent(
            'mouseup',
            true,
            true,
            document.defaultView,
            0,
            __x,
            __y,
            __x,
            __y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        verifyDialog.dispatchEvent(mouseup)
        $('.verifyDialog').click()
        isVerifying = false
    }

    //=======================================================
    function beginCrack() {
        if (isVerifying) {
            console.log('isVerifying...')
            return
        }
        console.log('beginCrack')
        isVerifying = true
        doMouseDown()
        doRareMove()
        const interval = setInterval(() => {
            // Check if the DOM element exists
            const element = document.querySelector('#img-button>img')
            if (element) {
                var gapimg_base64 = $('#img-button>img')
                .attr('src')
                var isSame = GapimgBase64 === gapimg_base64
                if (!isSame) {
                    clearInterval(interval) // Stop the interval
                    doSlide()
                }
            }
            else {
                console.log('no element...')
                doMouseDown()
            }
        }, 500)
        }


    function endCrack(){
        isVerifying = false
        doMouseUp()
    }

    function doMouseDown() {
        console.log('doMouseDown')
        var btn = $('#slide-button')[0]
        var mousedown = document.createEvent('MouseEvents')
        var rect = btn.getBoundingClientRect()
        var x = rect.x + getRandomInteger(0, 2)
        var y = rect.y + getRandomInteger(-2, 2)
        mousedown.initMouseEvent(
            'mousedown',
            true,
            true,
            document.defaultView,
            0,
            x,
            y,
            x,
            y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        btn.dispatchEvent(mousedown)
    }

    function doMouseUp() {
        console.log('doMouseUp')
        var btn = $('#slide-button')[0]
        var rect = btn.getBoundingClientRect()
        var x = rect.x + getRandomInteger(0, 2)
        var y = rect.y + getRandomInteger(-2, 2)
        var mouseup = document.createEvent('MouseEvents')
        mouseup.initMouseEvent(
            'mouseup',
            true,
            true,
            document.defaultView,
            0,
            x,
            y,
            x,
            y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        btn.dispatchEvent(mouseup)
    }

    async function doSlide() {
        console.log('doSlide...')
        var fullimg_base64 = $('#slider>img')
        .attr('src')
        var gapimg_base64 = $('#img-button>img')
        .attr('src')
        if (fullimg_base64 && gapimg_base64) {
            GapimgBase64 = gapimg_base64
            try{
                const gapOffset = await getOffset2Img()
                console.log('gapOffset:',gapOffset)
                const padding = await doPost(gapimg_base64, fullimg_base64)
                console.log('padding:',padding)
                doMove(padding, gapOffset)
            }catch(e){
                endCrack()
                setTimeout(() => {
                    beginCrack()
                }, 1000)
            }
        } else {
            //console.error('没有拿到base64~~~~~~~~~~~')
            endCrack()
            setTimeout(() => {
                beginCrack()
            }, 1000)
        }
    }



    function doPost(gapimg_base64, fullimg_base64) {

        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: 'post',
                url: 'http://127.0.0.1:6699/api/ocr/slider/gap',
                data: JSON.stringify({
                    gapimg_base64: gapimg_base64,
                    fullimg_base64: fullimg_base64
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                dataType: 'json',
                onload: function(res) {
                    if (res.status === 200) {
                        const responseData = JSON.parse(res.responseText)
                        const padding = responseData.result.target[0]
                        resolve(padding)

                    } else {
                        //console.log('失败')
                        //console.log(res)

                        endCrack()
                        reject(0)
                    }
                },
                onerror: function(err) {
                    //console.log('error')
                    //console.log(err)

                    endCrack()
                    reject(0)
                }
            })
        })
    }

    function getOffset2Img() {
        return new Promise((resolve, reject) => {
            // 步骤1: 加载图片
            var img = new Image()
            img.src = $('#img-button>img')
                .attr('src')
            img.onload = function() {
                // 步骤2: 创建Canvas并绘制图片
                var canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                var ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)
                // 步骤3: 获取像素数据
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                var data = imageData.data
                // 初始化最左边非透明像素点坐标
                var leftMostPixel = { x: -1, y: -1 }
                // 步骤4: 遍历每一行，寻找最左边的非透明像素点
                for (var y = 0; y < canvas.height; y++) {
                    for (var x = 0; x < canvas.width; x++) {
                        var i = (y * canvas.width + x) * 4
                        if (data[i + 3] !== 0) { // 检查alpha通道是否不为0
                            // 如果这是第一个非透明像素点或者比之前记录的更靠左
                            if (leftMostPixel.x === -1 || x < leftMostPixel.x) {
                                leftMostPixel = { x: x, y: y }
                            }
                            break // 找到非透明像素点后，跳出内层循环
                        }
                    }
                }
                // 打印结果
                if (leftMostPixel.x !== -1) {
                    //console.log('最左边的第一个非透明像素点坐标:', leftMostPixel)
                    resolve(leftMostPixel.x)
                } else {
                    //console.log('没有找到非透明像素点')
                    resolve(0)
                }
            }
        })
    }

    function doRareMove() {
        // console.log('doRareMove')
        var btn = $('#slide-button')[0]
        var rect = btn.getBoundingClientRect()
        var x = rect.x
        var y = rect.y
        var dx = getRandomInteger(-2, 2)
        var dy = getRandomInteger(-2, 2)
        var mousemove = document.createEvent('MouseEvents')
        var _x = x + dx
        var _y = y + dy
        mousemove.initMouseEvent(
            'mousemove',
            true,
            true,
            document.defaultView,
            0,
            _x,
            _y,
            _x,
            _y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        btn.dispatchEvent(mousemove)
    }

    function doMove(length, gapOffset) {
        if(!length){
            length = 0
        }
        console.log('Move:',length,gapOffset)
        var btn = $('#slide-button')[0]
        var rect = btn.getBoundingClientRect()
        var x = rect.x
        var y = rect.y
        var dx = 0
        var dy = 0
        let varible = null
        var sliderLeft = $('#slider')
        .offset().left
        var targetLeft = $('#img-button > img')
        .offset().left - sliderLeft
        var targetWidth = $('#img-button > img')
        .width()
        var distance = length * 203 / 250
        dx = distance / 3 + getRandomInteger(-10, 10)
        var mousemove = document.createEvent('MouseEvents')
        var _x = x + dx + getRandomInteger(0, 2)
        var _y = y + dy + getRandomInteger(-2, 2)
        mousemove.initMouseEvent(
            'mousemove',
            true,
            true,
            document.defaultView,
            0,
            _x,
            _y,
            _x,
            _y,
            false,
            false,
            false,
            false,
            0,
            null
        )
        btn.dispatchEvent(mousemove)
        var interval = setInterval(function() {
            var mousemove = document.createEvent('MouseEvents')
            var _x = x + dx + getRandomInteger(0, 2)
            var _y = y + dy + getRandomInteger(-2, 2)
            mousemove.initMouseEvent(
                'mousemove',
                true,
                true,
                document.defaultView,
                0,
                _x,
                _y,
                _x,
                _y,
                false,
                false,
                false,
                false,
                0,
                null
            )
            btn.dispatchEvent(mousemove)
            var newTargetLeft = $('#img-button > img')
            .offset().left
            varible = newTargetLeft - sliderLeft + gapOffset
            //console.log('gapOffset:',gapOffset)
            //console.log('distance:',distance)
            //console.log('newTargetLeft:',newTargetLeft)
            //console.log('sliderLeft:',sliderLeft)
            //console.log('varible:',varible)
            var size = varible - distance
            //console.log('size:',size)
            if (size > -1 && size < 1) {
                doRareMove()
                clearInterval(interval)
                //console.log('varible >= distance,finish move:',varible , distance)
                endCrack()
                setTimeout(() => {
                    beginCrack()
                }, 1000)
            } else {
                if (distance > varible) {
                    if (distance - varible > 40) {
                        dx += getRandomInteger(0, 4)
                    } else {
                        dx += getRandomInteger(4, 12)
                    }
                } else {
                    dx -= getRandomInteger(0, 2)
                }
            }
        }, 30)
        setTimeout(() => {
            clearInterval(interval)
            endCrack()
            setTimeout(() => {
                beginCrack()
            }, 1000)
        }, 4000)
    }

    function waitElement(selector, times, interval, flag = true) {
        var _times    = times || 50,     // 默认50次
            _interval = interval || 100, // 默认每次间隔100毫秒
            _selector = selector, //选择器
            _iIntervalID,
            _flag = flag; //定时器id

        return new Promise(function (resolve, reject) {
            _iIntervalID = setInterval(function () {
                if (!_times) { //是0就退出
                    clearInterval(_iIntervalID);
                    reject();
                }
                _times <= 0 || _times--; //如果是正数就 --
                var _self = document.querySelector(_selector); //再次选择
                if ((_flag && _self) || (!_flag && !_self)) { //判断是否取到
                    clearInterval(_iIntervalID);
                    resolve(_self);
                }
            }, _interval);
        });
    }
    function sleep(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function clearAllCookies() {
        localStorage.clear();
        sessionStorage.clear();
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    }
})()