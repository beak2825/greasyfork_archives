// ==UserScript==
// @name         Auto drop client v3.3
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Auto claim stake drop code!
// @author       FCFC
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.com
// @match        https://stake.com/settings/offers*
// @match        https://stake.com/*/settings/offers*
// @match        https://stake.ac/settings/offers*
// @match        https://stake.ac/*/settings/offers*
// @match        https://stake.games/settings/offers*
// @match        https://stake.games/*/settings/offers*
// @match        https://stake.bet/settings/offers*
// @match        https://stake.bet/*/settings/offers*
// @match        https://stake.pink/settings/offers*
// @match        https://stake.pink/*/settings/offers*
// @match        https://stake.mba/settings/offers*
// @match        https://stake.mba/*/settings/offers*
// @match        https://stake.jp/settings/offers*
// @match        https://stake.jp/*/settings/offers*
// @match        https://stake.bz/settings/offers*
// @match        https://stake.bz/*/settings/offers*
// @match        https://stake.ceo/settings/offers*
// @match        https://stake.ceo/*/settings/offers*
// @match        https://stake.krd/settings/offers*
// @match        https://stake.krd/*/settings/offers*
// @match        https://staketr.com/settings/offers*
// @match        https://staketr.com/*/settings/offers*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://lib.baomitu.com/socket.io/4.7.3/socket.io.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_setClipboard
// @grant GM_notification
// @grant GM_addValueChangeListener
// @grant GM_deleteValue
// @grant GM_log
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/487235/Auto%20drop%20client%20v33.user.js
// @updateURL https://update.greasyfork.org/scripts/487235/Auto%20drop%20client%20v33.meta.js
// ==/UserScript==
(function() {
    // @require      https://lib.baomitu.com/socket.io/4.7.3/socket.io.min.js
    // @require      file://F:/orther/stake-drop/stake-drop/node_modules/socket.io/client-dist/socket.io.min.js
    'use strict';
    var $ = $ || window.$;
    $(function(){
        var version = 3.3
        var debug = false // 是否是调试模式
        console.log(`+ ---------------------------------- +
Name: Auto drop client Version: ${version} debug: ${debug}
+ ---------------------------------- +`)
        // 获取网站域名
        var websiteOrigin = window.location.origin
        console.log('获取网站域名', websiteOrigin)
        var submitBtnObserver = null // 提交按钮监听器
        var dropModelObserver = null // 空投弹窗监听器
        var checkModalContentObserver = null // 弹窗内容监听器
        var dropCompleted = true // 领取是否结束
        var logtext = '' // 日志文本
        var waittingCodes = [] // 等待领取的code
        var reClaimCount = 0 // 记录未知错误时尝试重新领取次数，超过5次不再尝试
        var socketUrl = debug ? 'http://localhost:3000/' : 'https://www.hh123.site/'
        if (debug) {
            console.log(`请求地址：${socketUrl}`)
        }
       // 初始化程序
        controlAction(()=>{
            /**
	         * 重载xhr的send，用于拦截网页发送的xhr请求
	         */
            /*
            let xhr = XMLHttpRequest.prototype;
            let originSend = xhr.send;
            xhr.send = async function (postData) {
                GM_log(postData);
                return originSend.apply(this, arguments);
            }*/
            /**
	         * 重载fetch，用于拦截网页发送的fetch请求
	         */
            let errorMessage = {
                notFound: '奖金未找到或不可用',
                bonusCodeInactive: '此代码不活跃',
                weeklyWagerRequirement: '您未达到兑换此代码所需的每周投注需求',
                alreadyClaimed: '您已领取此代码',
                available: '此代码可用'
            }
            let originFetch = fetch;
            window.unsafeWindow.fetch = async function (...args) {
                const url = args[0]
                let requestBody = JSON.parse(args[1].body)
                const response = await originFetch(...args);
                if (url == `${websiteOrigin}/_api/graphql` && requestBody.variables.hasOwnProperty('code')){
                    let code = requestBody.variables.code
                    await response.clone().json().then(res => {
                        if (res.data) {
                            /**
                             * 校验code返回处理
                             * data info: BonusCodeAvailability: weeklyWagerRequirement(投注不满足) | bonusCodeInactive(代码不活跃) | alreadyClaimed（已领取）
                             */
                            if (res.data.hasOwnProperty('bonusCodeAvailability')) {
                                let status = res.data.bonusCodeAvailability
                                if (status != 'available') {
                                    if (status in errorMessage) {
                                        logger(errorMessage[status])
                                        console.log('验证完成：' + errorMessage[status])
                                    } else {
                                        logger(status)
                                        console.log('验证完成：' + status)
                                    }
                                    // code不可用直接走完成领取步骤
                                    claimCompelet(code)
                                }
                            }
                            /**
                             * 领取返回结果
                             */
                            if (res.data.hasOwnProperty('claimConditionBonusCode')) {
                                let amout = res.data.claimConditionBonusCode.amount
                                let currency = res.data.claimConditionBonusCode.currency
                                let str = `成功领取：${amout} ${currency}`
                                logger(str)
                                claimCompelet(code)
                                console.log('收到领取成功结果：' + str)
                            }
                        } else {
                            // 错误结果
                            let paths = res.errors[0].path
                            let path = paths[0]
                            let err = res.errors[0].errorType
                            if (path == 'bonusCodeAvailability') {
                                console.log('bonusCodeAvailability***********************',path, err)
                                if (err in errorMessage) {
                                     logger(errorMessage[err])
                                    console.log('验证完成：' + errorMessage[err])
                                } else {
                                     logger(err)
                                    console.log('验证完成：' + err)
                                }
                                claimCompelet(code)
                            } else if (path == 'claimConditionBonusCode') {
                                console.log('claimConditionBonusCode***********************',path, err)
                                let errTypes = ['alreadyClaimed','bonusCodeInactive','weeklyWagerRequirement','notFound']
                                if (errTypes.includes(err)) {
                                    logger(errorMessage[err])
                                    claimCompelet(code)
                                    reClaimCount = 0
                                    console.log('收到领取失败结果：' + errorMessage[err])
                                } else {
                                    logger(err+ ': ' + res.errors[0].message)
                                    console.log('收到领取失败结果：', res.errors)
                                    // 重新领取
                                    console.log(`第${reClaimCount}次尝试重新领取`)
                                    if (reClaimCount < 5) {
                                        logger(`第${reClaimCount}次尝试重新领取`)
                                        mainDrop(code)
                                        reClaimCount++
                                    } else {
                                        logger(`${err} \n尝试5次未领取成功，请手动尝试。`)
                                        claimCompelet(code)
                                        reClaimCount = 0
                                    }
                                }
                            }
                        }
                    }).catch(e=> {
                        logger('处理返回数据出错：' + JSON.stringify(e))
                    });
                }
                return response;
            }
            init()
        })
        /**
         * 初始化方法，1、通过cookie获取session 2、获取用户信息 3、连接websocket
         */
        function init() {
            let session = getCookie('session')
            if (!session) {
                logger('初始化失败，Error: 1001')
                return
            }
            getUser(session, (data) => {
                socketFunc(data.user.name)
            },(e)=>{
                logger('初始化失败，Error: 1002')
            })
        }
        /**
         * 添加插件UI到页面的方法
         */
        function controlAction(cb) {
            var html = `<div id="drop-status" style="position:fixed;right: 10px;top:508px;width:50px;height:30px;text-align:center;line-height:30px;border-radius:2px;background:green;color:#fff;font-size:12px;cursor:pointer;z-index:10000">日志</div>
                        <div id="autoDropwrap" style="position:fixed;top:205px;left:60px;z-index:1000000;background:rgba(0,0,0,.5);border-radius:5px;">
                            <div style="padding:10px;background:#213743;margin:0 auto;border-radius:5px;border:1px solid #000;">
                                 <div style="display:flex;align-items:center;justify-content: space-between;">
                                     <div style="font-size:14px;font-weight:bold;color:#fff">Auto claim drop <span class="version"></span></div>
                                     <div class="status" style="width:10px;height:10px;border-radius:10px;background:red;"></div>
                                 </div>
                                 <div style="font-size:12px;margin-top:10px;">开发和维持不易，<span class="gototip" style="color:#0D8A1C;cursor:pointer">点此打赏支持‘FCFC’</span></div>
                                 <textarea class="log scrollY" cols="50" rows="20" readonly value="" style="padding:5px;margin-top:10px;font-size:12px;background:#0F212E;border-radius:4px;outline: none;font-family:auto;"></textarea>
                             </div>
                       </div>
            `
            $('body').append(html)
            $('#drop-status').click(function(){
                $('#autoDropwrap').toggle()
            })
            $('#autoDropwrap .version').text('V' + version)
            logger('初始化...')
            cb()
            $('#autoDropwrap .gototip').click(function(){
                GM_setClipboard('FCFC')
                let currency = getCookie('currency_currency')
                setTimeout(function(){
                    window.open(`${window.location.origin}${window.location.pathname}?tab=tip&currency=${currency}&modal=wallet`,'_blank')
                },1500)
                window.alert('已复制用户名：FCFC')
            })
        }

        /**
         * 更新日志方法
         */
        function logger(text){
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours() >=10 ? date.getHours() : `0${date.getHours()}`
            let min = date.getMinutes() >=10 ? date.getMinutes() : `0${date.getMinutes()}`
            let second = date.getSeconds() >=10 ? date.getSeconds() : `0${date.getSeconds()}`
            let timeStr = date.getTime()
            let timeStr1 = new Date(`${year}-${month}-${day} ${hour}:${min}:${second}`).getTime()
            let haomiao = 0
            if (timeStr - timeStr1 < 10) {
                haomiao = `00${timeStr - timeStr1}`
            } else if (timeStr - timeStr1 >= 10 && timeStr - timeStr1 < 100) {
                haomiao = `0${timeStr - timeStr1}`
            } else {
                haomiao = timeStr - timeStr1
            }
            let time = `${hour}:${min}:${second}.${haomiao}`
            let mark = `${time} | `
            logtext += `${mark}${text}\n`
            $('#autoDropwrap .log').val(logtext)
            $('#autoDropwrap .log').scrollTop(100000)
        }
        /**
         * ws function
         */
        function socketFunc(user) {
            const socket = io(socketUrl,{
                query: {
                    "user": user
                }
            })
            console.log(socket)
            socket.on("connect", () => {
                console.log('连接成功'+socket.connected+'ID:' + socket.id);
                logger('连接成功')
                $('#autoDropwrap .status')[0].style.background = 'green'
            });
            socket.io.on("error", (error) => {
                console.log('连接错误')
                logger('Error: 连接错误')
                $('#autoDropwrap .status')[0].style.background = 'red'
            });
            socket.on("ping", () => {
                console.log('ping')
            });
            socket.on('chat message', function(msg) {
                if (!msg.isCode) {
                    logger(msg.msg)
                    return
                }
                console.log(`${Date.now()} CODE incomming: ${msg.msg}`)
                let code = msg.msg.trim()
                waittingCodes.push(code)
                console.log('队列中的code：', waittingCodes)
                console.log('完成领取状态：' + dropCompleted)
                if (dropCompleted){
                    // 领取队列中的第一个code
                    console.log('开始领取的code：', waittingCodes[0])
                    mainDrop(waittingCodes[0])
                } else {
                    //logger('上一个code在领取中，等待领取')
                    console.log('还有code在领取中，等待', waittingCodes[0])
                }
            });
        }
        /**
         * 领取结束处理方法
         */
        function claimCompelet(code) {
            //console.log('领取结束')
            // 关闭弹窗
            closeDialog()
            // 标记当前code已经完成领取
            dropCompleted = true
            // 从列表中删除当前code
            if (waittingCodes.indexOf(code) > -1) {
                waittingCodes.splice(waittingCodes.indexOf(code),1)
                let newArr = waittingCodes.filter(item => item != undefined);
                waittingCodes = newArr
            }
            console.log('完成领取状态：' + dropCompleted)
            // 检查待领取列表是否还有等待领取的code
            console.log('等待领取的code',waittingCodes)
            if (waittingCodes.length > 0) {
                let timer00 = null
                let wait_time = 100
                timer00 = setInterval(()=>{
                    const target = $('[data-test=modal-redeemBonus] .overlay')
                    if (target[0]) {
                        console.log('弹窗存在')
                    } else {
                        console.log('弹窗已关闭')
                    }
                    console.log('等待...' + wait_time + 'ms')
                    wait_time+= 100
                },100)
                setTimeout(() => {
                    clearInterval(timer00)
                    timer00 = null
                    console.log('清除定时器：', timer00)
                    console.log('继续领取队列中的code：' + waittingCodes[0])
                    mainDrop(waittingCodes[0])
                },500)
            } else {
                console.log('已经没有待领取的code')
            }
        }
        /**
         * 主领取程序
         */
        function mainDrop(code) {
            GM_setClipboard(code)
            $('.input-content input').eq(1).val(code)
            var element = $('.input-content input').eq(1)[0];
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            // 将事件分派到指定的元素上
            element.dispatchEvent(event);
            logger('开始领取：' + code)
            dropCompleted = false
            isBtnCanClick(() => {
                isModel((nodes)=>{
                    checkModalContent(nodes)
                })
            })
        }
        /**
         * 点击领取按钮，直到领取成功
         */
        function clickDropBtn(btn) {
            if (dropCompleted) {
                return
            }
            btn.trigger('click')
            setTimeout(function(){
                clickDropBtn(btn)
            },100)
        }
        /**
         * 判断弹窗内容
         */
        function checkModalContent(nodes) {
            let target = $(nodes).find('.card .content')
            let config = { attributes: false, childList: true, characterData: false, subtree: true }
            checkModalContentObserver = listenNode(target[0],config,(mutation) => {
                if (mutation.type == 'childList') {
                    // 判断领取按钮是否存在data-test="redeem-drop"
                    if (mutation.addedNodes && $(mutation.addedNodes).attr('data-test') == 'redeem-drop') {
                        console.log('真正的开始领取')
                        clickDropBtn($(mutation.addedNodes))
                    }
                }
            })
        }
        /**
         * 关闭弹窗
         */
        function closeDialog() {
            const target = $('[data-test=modal-redeemBonus] .overlay')
            if (target[0]) {
                target.trigger('click')
            }
        }

        /**
         * 判断弹出
         */
        function isModel(cb) {
            let target = $('#svelte')
            let config = { attributes: false, childList: true, characterData: false, subtree: false }
            dropModelObserver = listenNode(target[0],config,(mutation) => {
                if (mutation.type == 'childList') {
                    if (mutation.addedNodes && $(mutation.addedNodes).attr('data-test') == 'modal-redeemBonus'){
                        cb(mutation.addedNodes)
                    }
                    if (mutation.removedNodes && $(mutation.removedNodes).attr('data-test') == 'modal-redeemBonus'){
                        // 解除监听
                        if (dropModelObserver) {
                            dropModelObserver.disconnect();
                            dropModelObserver = null
                        }
                    }
                }
            })
        }
        /**
         * 判断提交按钮是否可以点击的方法
         */
        function isBtnCanClick(cb){
            let target = $('.section-footer button').eq(1)
            submitBtnObserver = listenNode(target[0],{},(mutation) => {
                if (mutation.type == 'attributes' && mutation.attributeName == 'disabled') {
                    if (target.prop('disabled') == false) {
                        target.trigger('click')
                        cb()
                    } else {
                        if (submitBtnObserver) {
                            submitBtnObserver.disconnect()
                            submitBtnObserver = null
                        }
                    }
                }
            })
        }
        /*
          监听节点函数封装
         * @param object target 要监听的节点对象
         */
        function listenNode(target, option, cb) {
            // Firefox和Chrome早期版本中带有前缀
            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            // 创建观察者对象
            let observer = new MutationObserver(function(mutations){
                mutations.forEach(function(mutation) {
                    cb(mutation)
                });
            });
            // 配置观察选项:
            let config = { attributes: true, childList: true, characterData: true, subtree: false }
            if (Object.keys(option).length != 0) {
                config = option
            }

            // 传入目标节点和观察选项
            observer.observe(target, config);
            return observer
        }
        /**
         * 获取cookie
         */
        function getCookie(name) {
            let cookies = document.cookie.split("; ");
            for(let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if(cookie[0] == name) {
                    return cookie[1];
                }
            }
            return null;
        }
        /**
         * 获取信息
         */
        function getUser(session,success,fail) {
            let payload = {
                query:"query UserMeta($name: String, $signupCode: Boolean = false) {\n  user(name: $name) {\n    id\n    name\n    isMuted\n    isRainproof\n    isBanned\n    createdAt\n    campaignSet\n    selfExclude {\n      id\n      status\n      active\n      createdAt\n      expireAt\n    }\n    signupCode @include(if: $signupCode) {\n      id\n      code {\n        id\n        code\n      }\n    }\n  }\n}\n",
                variables:{}
            }
            $.ajax({
                url: websiteOrigin + '/_api/graphql',
                type: 'POST',
                headers:{
                    'content-type': 'application/json; charset=utf-8',
                    'x-access-token': session,
                    'x-language': 'zh'
                },
                data: JSON.stringify(payload),
                dataType: 'JSON',
                success: function(data){
                    success(data.data)
                },
                error: function(e) {
                    console.log('|||||||||||||||||||||||||||||||||||||||',e)
                    fail(e)
                }
            })
        }
    })
    // Your code here...
})();