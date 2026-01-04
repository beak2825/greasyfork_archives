// ==UserScript==
// @name        湖南开放大学刷课（旧版界面）
// @namespace   Violentmonkey Scripts
// @match       *://www.hnsydwpx.cn/center.html*
// @match       *://www.hnsydwpx.cn/getcourseDetails.html*
// @match       *://www.hnsydwpx.cn/play.html*
// @match       *://www.hnsydwpx.cn/template/*
// @version     2.2
// @author      n1nja88888
// @description 支持自动播放，自动换集、延长登陆时间等功能
// @run-at      document-start
// @frames
// @require     https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require     https://lib.baomitu.com/crypto-js/3.3.0/crypto-js.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @license     AGPL License
// @downloadURL https://update.greasyfork.org/scripts/474365/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%EF%BC%88%E6%97%A7%E7%89%88%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474365/%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%EF%BC%88%E6%97%A7%E7%89%88%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==
// http://www.hnsydwpx.cn/center.html 课程
// http://www.hnsydwpx.cn/play.html 课程概览
// http://www.hnsydwpx.cn/getcourseDetails.html 视频
'use strict'
console.log('n1nja88888 creates this world!')
const key = 'easyweb'
const checkedKey = 'checked'
const accountKey = 'account'
const passwordKey = 'password'
main()

async function main() {
    // 对于内嵌标签页的处理
    if (window.top !== window) {
        await getEleAsync('script[src*="lay-config"]')
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            const error = options.error
            options.error = function(...args) {
                if (args[0].status != 401) {
                    if ($.isFunction(error))
                        return error.apply(this, args)
                }
            }
        })
        const temp = unsafeWindow.$
        Object.defineProperty(unsafeWindow, '$', {
            get() { return temp },
            set(val) { }
        })
        Object.defineProperty(unsafeWindow.layui, 'jquery', {
            get() { return temp },
            set(val) { }
        })
        return
    }
    const token = JSON.parse(localStorage.getItem(key)).token
    if (!token)
        return
    axios.defaults.baseURL = 'https://www.hnsydwpx.cn'
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(token)

    // 重写media标签的play函数
    const _play = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function() {
        this.muted = true // 默认静音
        return _play.apply(this)
    }

    // 插入时机
    await getEleAsync('script[src*="public"]')
    loginPanel()
    // 重写layui.js
    unsafeWindow.layui._use = unsafeWindow.layui.use
    unsafeWindow.layui.use = (...args) => {
        if (!!args[0] && Array.isArray(args[0]) && args[0].length === 6
            && location.href.includes('www.hnsydwpx.cn/getcourseDetails.html'))
            return
        return unsafeWindow.layui._use.apply(unsafeWindow.layui, args)
    }

    window.addEventListener('DOMContentLoaded', () => {
        if (location.href.includes('www.hnsydwpx.cn/center.html'))
            centerPage()
        else if (location.href.includes('www.hnsydwpx.cn/play.html'))
            getEleAsync('.classItem a').then(course => course.click())
        else if (location.href.includes('www.hnsydwpx.cn/getcourseDetails.html'))
            videoPage()
    })
}

// 获取网页元素
function getEleAsync(selector, isCollection = false, context = null) {
    return new Promise(res => {
        context = context ? context.document : document
        const ret = get(context)
        if (ret) {
            res(ret)
            return
        }
        const observer = new MutationObserver((records, observer) => {
            const ret = get(context)
            if (ret) {
                res(ret)
                observer.disconnect()
            }
        })
        observer.observe(context, {
            childList: true,
            subtree: true
        })
    })
    function get(context) {
        const ret = isCollection ? context.querySelectorAll(selector) : context.querySelector(selector)
        if ((!isCollection && !!ret) || (isCollection && ret.length > 0))
            return ret
        else
            return null
    }
}
// 添加登陆面板
function loginPanel() {
    const isChecked = GM_getValue(checkedKey, '')
    const css = `
                <style>
                    .fixed-form {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 400px;
                        background-color: #fff;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
                        z-index: 9999;
                    }
                    .form-content {
                        margin-top: 20px;
                    }
                    .form-item {
                        margin-bottom: 20px;
                    }
                    .layui-input {
                        width: 220px;
                    }
                    .layui-form-label {
                        width: 90px;
                    }
                </style>`
    const panel = `
                <div class="fixed-form" id="loginPanel">
                    <div class="form-content layui-container">
                        <form class="layui-form" lay-filter="form">
                        <div class="form-item">
                            <label class="layui-form-label">账号</label>
                            <div class="layui-input-block">
                            <input type="text" name="account" placeholder="请输入账号" class="layui-input" autocomplete="on">
                            </div>
                        </div>

                        <div class="form-item">
                            <label class="layui-form-label">密码</label>
                            <div class="layui-input-block">
                            <input type="password" name="password" placeholder="请输入密码" class="layui-input" autocomplete="current-password">
                            </div>
                        </div>

                        <div class="form-item">
                            <label class="layui-form-label">延长登录</label>
                            <div class="layui-input-block">
                            <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF" id="switch" ${isChecked}>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>`

    $('head').append(css)
    $('body').append(panel)

    layui.use('form', () => {
        const form = layui.form
        form.render()
        if (isChecked)
            isCorrect()
        // 监听开关按钮的状态改变事件
        form.on('switch', (data) => {
            if (!data.elem.checked)
                GM_setValue(checkedKey, '')
            else {
                GM_setValue(checkedKey, 'checked')
                const account = form.val('form').account
                const password = form.val('form').password
                if (!isCorrect(account))
                    return
                if (account == '' || password == '') {
                    print('不能填写为空，已自动关闭延长登录')
                    toggle(false)
                }
                else {
                    GM_setValue(accountKey, account)
                    GM_setValue(passwordKey, password)
                    GM_setValue(checkedKey, 'checked')
                }
            }
        })
    })
    // 拦截所有401错误
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        const error = options.error
        options.error = function(...args) {
            if (args[0].status == 401) {
                if (GM_getValue(checkedKey))
                    extendSession()
            }
            else {
                if ($.isFunction(error))
                    return error.apply(this, args)
            }
        }
    })
    const temp = unsafeWindow.$
    Object.defineProperty(unsafeWindow, '$', {
        get() { return temp },
        set(val) { }
    })
    Object.defineProperty(unsafeWindow.layui, 'jquery', {
        get() { return temp },
        set(val) { }
    })
    function print(msg) {
        layer.open({
            title: '刷课脚本提示',
            content: msg
        })
    }
    function toggle(isChecked) {
        if (isChecked)
            $('#switch').next().addClass('layui-form-onswitch')
        else
            $('#switch').next().removeClass('layui-form-onswitch')
        $('#switch').next().children().eq(0).text(isChecked ? 'ON' : 'OFF')
        GM_setValue(checkedKey, isChecked ? 'checked' : '')
    }
    function extendSession() {
        if (!isCorrect())
            return
        const username = GM_getValue(accountKey)
        const password = CryptoJS.AES.encrypt(GM_getValue(passwordKey), CryptoJS.enc.Latin1.parse(layui.webconfig.cryptoJSKey), {
            iv: CryptoJS.enc.Latin1.parse(layui.webconfig.cryptoJSKey),
            mode: CryptoJS.mode.CFB,
            padding: CryptoJS.pad.NoPadding
        }).toString()
        axios.post('/auth/oauth/token?grant_type=password',
            `username=${username}&password=${password}&scope=server&clientId=trainee`,
            {
                headers: {
                    'Authorization': 'Basic dGVzdDp0ZXN0'
                }
            }).then(res => {
                const data = res.data
                layui.webconfig.putToken(data.access_token)
                layui.webconfig.putUser(data.user_info)
                location.reload()
            }).catch(err => {
                print('账号或密码错误，延长登录失败，已自动关闭延长登录功能')
                toggle(false)
            })
    }
    function isCorrect(account = null) {
        account = account ? account : GM_getValue(accountKey)
        const username = JSON.parse(JSON.parse(localStorage.getItem('easyweb')).login_user).username
        if (account == username)
            return true
        else {
            print('检测到保存的账号与当前登录账号不符，已自动关闭延长登录功能')
            toggle(false)
            return false
        }
    }
}
async function centerPage() {
    // 获取iframe的上下文
    const iframe = await getEleAsync('#iframe2')
    const context = iframe.contentWindow
    // 判断是否全部学完
    const ret = await isFinished()
    if (ret)
        return
    // 获取课程列表
    const list = $(await getEleAsync('#LearnInCompleteArr li', true, context))
    // 记录要学习的点位 默认从0 即第一个视频开始
    let index = 0
    // 获取第一个未学习课
    let curLesson = list.eq(index)
    // 检查视频学习进度
    let text = curLesson.find('.percent').text()
    // 定位到未学状态的视频
    while (text === '进度：100%') {
        curLesson = list.eq(++index)
        text = curLesson.find('.classItemInfo p').eq(2).text()
    }
    curLesson.find('button').click()
    async function isFinished() {
        const customerId = JSON.parse(JSON.parse(localStorage.getItem(key)).login_user).id
        const res = await axios.get(`/classes/sydwpxxclassescustomercourse/selectChangeNum?customerId=${customerId}`)
        return res.data.data.noNum <= 0
    }
}
async function videoPage() {
    // 重写发生heartbeat的时间间隔
    const res = await axios.get('/js/getcourseDetails.js')
    const data = res.data
        .replace(/layui\.use/, 'layui._use')
        .replace(/player\.on\(\'pause\'[\s\S]*?player\.on\(\'error\'/, `
                let curDate = Date.now()
                player.on('pause', function() {
                playing = false

                //======添加的代码
                const temp = Date.now()
                const interval = Math.ceil((temp - curDate) / 1e3)
                curDate = temp
                playTime += interval //本次播放时长(不是播放器的时长)
                submitTime = interval //提交时长(循环清空)
                //======添加的代码

                var tmpSubmitTime = submitTime //暂存待提交时长
                clearInterval(playtimer) //清空定时器
                var restLen = parseInt(currentDuration) - parseInt(playTime) - parseInt(lastTime)
                //console.log("pause", restLen, tmpSubmitTime, parseInt(playTime), parseInt(lastTime), parseInt(currentDuration));
                if (errorFlag) { //错误不做提交
                    //console.log("error pause not submit");
                    errorFlag = false
                } else {
                    submitTime = 0 //重置提交缓冲时长
                    //console.log("pause ok", learningToken);
                    if (learnStatus != 2) { //没有看完的
                        //没有错误
                        if (tmpSubmitTime > 0) { //待提交时长大于1秒
                            if (restLen < 3) {
                                //视频最后一次提交
                                playTime++ //最后加1秒
                                tmpSubmitTime++ //最后加1秒
                                var slIdx = submitLoading(true)
                                setTimeout(function() {
                                    sendheartbeat(chapterId, tmpSubmitTime, learnStatus, function() {
                                        $("#" + slIdx).remove() //移除遮罩
                                        //console.log('最后提交数据ok');
                                        //效验数据  此方法会自动判断标记是否已真实学完
                                        handleEnded(player, learnStatus)
                                    })
                                }, 2000)
                            } else {
                                sendheartbeat(chapterId, tmpSubmitTime, learnStatus, function() {
                                    //回调
                                    learningToken = "" //清空token
                                    //console.log('数据提交ok');
                                })
                            }
                        } else {
                            learningToken = "" //清空token
                        }
                    } else {
                        //已看完的
                        if (parseInt(player.currentTime) >= parseInt(player.duration)) { //到进度条最后了
                            handleEnded(player, learnStatus)
                        }
                        if (tmpSubmitTime > 1) {
                            sendheartbeat(chapterId, tmpSubmitTime, learnStatus)
                        } else {
                            learningToken = "" //清空token
                        }
                    }
                }
            })

            player.on('play', function() {
                //console.log('play', learningToken);
                videoMsk(false) //隐藏缓冲遮罩
                learningToken = "" //开始播放清空token
                sendheartbeat(chapterId, 0) //发送初次请求
                playtimer = setInterval(function() {

                    // ========添加的代码
                    const temp = Date.now()
                    const interval = Math.ceil((temp - curDate) / 1e3)
                    curDate = temp
                    playTime += interval //本次播放时长(不是播放器的时长)
                    submitTime = interval //提交时长(循环清空)
                    // ========添加的代码

                    var lookedLen = parseInt(playTime) + parseInt(lastTime)
                    //console.log("计算时长:" + submitTime, "本次播放时长:" + playTime, "已学习时长:" + lookedLen,"当前播放器进度:" + player.currentTime, "当前视频时长:" + currentDuration);
                    //最新版火狐101.0.1 (64 位)出现播放完成不触发结束暂停事件,手动判断是否播放完毕
                    //当前播放大于等于视频时长
                    // 剩余时间
                    var restNodeId = "#shengyu" + jid
                    var restLen = parseInt(currentDuration) - lookedLen
                    restLen = restLen < 0 ? 0 : restLen
                    if (learnStatus == 2) {
                        restLen = parseInt(currentDuration) - parseInt(player.currentTime)
                    }
                    $(restNodeId).removeClass("hide")
                    $(restNodeId).addClass("redborder")
                    $(restNodeId).text("剩余" + formatSeconds2(restLen))
                    $(restNodeId).prev().css("width", "55%")
                    //没有学完且播放器计时比定时器快了,将进度条拉回来
                    if (learnStatus != 2 && parseInt(player.currentTime) > lookedLen) {
                        player.currentTime = lookedLen //拉回来
                        //console.log('矫正');
                    }

                    if (isFirefox && !player.ended && !player.paused && parseInt(player.currentTime) >= parseInt(player.duration)) {
                        if (submitTime > 1) {
                        //console.log("firefox 播放结束");
                        player.pause() //交给播放暂停去提交数据
                        }
                    } else {
                        if (learningToken == "") {
                            //网速太慢上次请求还没完成 这种情况发生在网络极端不好的情况下
                            errorFlag = true //标识此变量,后续暂停将不请求心跳
                            player.pause() //暂停
                            player.currentTime = parseInt(playTime) + parseInt(lastTime) //将进度条拖回上一次提交时长
                            playTime = playTime - submitTime //本次播放时长回退
                            //currentPlayTime = player.currentTime;
                            //开启数据提交中遮罩
                            var slIdx = submitLoading(true)
                            //console.log('网络太慢提交数据等待中...', chapterId, submitTime, learnStatus);
                            sendheartbeat(chapterId, submitTime, learnStatus, function() {
                            learningToken = "" //清空token
                            $("#" + slIdx).remove() //移除遮罩
                            //console.log('网络太慢提交数据成功..', chapterId, submitTime, learnStatus);
                            //成功后重新开始播放
                            if (!playing || player.paused) {
                                player.play()
                            }
                            })
                            submitTime = 0
                        } else {
                            //console.log("定时器提交数据:", parseInt(player.currentTime), parseInt(player.duration));
                            if ((parseInt(player.currentTime) + 1) >= parseInt(player.duration)) {
                            handleEnded(player, learnStatus)
                            }
                            sendheartbeat(chapterId, submitTime, learnStatus, function() { }) //提交数据
                            submitTime = 0
                        }
                    }
                }, 30e3)
            })
            // 播放错误时，点击刷新
            player.on('error'
        `)
    new Function(data).apply(unsafeWindow)

    // 监听是否卡顿，以及是否添加video
    const observer = new MutationObserver(records => {
        let retry = 10, timer = null
        records.forEach(record => {
            const type = record.type
            if ('childList' === type) {
                for (const node of record.addedNodes.values()) {
                    if ('VIDEO' === node.tagName)
                        videoOps(record)
                }
            }
            else if ('attribute' === type)
                refreshOps(record)
        })
        function videoOps(record) {
            const exit = $('.list-header').find('button')
            const video = $('#studyVideo video')[0]
            video.addEventListener('play', async () => {
                const videoItems = await getEleAsync('.item-list', true)
                if (!video.muted)
                    video.muted = true
                // 找到第一个未看完的元素，且不是当前播放的元素
                const videoItem = $(videoItems).find('.item-list-progress:not(:contains("100%"))').first().parent()
                if (videoItem.length === 0)
                    exit.click()
                if (!videoItem.hasClass('item-list-redClass'))
                    videoItem.click()
            })
            video.addEventListener('pause', async function() {
                const videoItems = await getEleAsync('.item-list', true)
                if ($('.item-list-redClass').index('.item-list') === videoItems.length - 1) {
                    isFinished().then(res => {
                        if (res)
                            exit.click()
                    })
                }
                // 停顿5s再播放，因为原视频页存在卡顿时也会停止播放，要留给原视频页对视频卡顿进行处理
                setTimeout(() => video.play(), 5e3)
            })
            video.addEventListener('canplay', e => e.play())
        }
        async function refreshOps(record) {
            const refresh = await getEleAsync('.xgplayer-error-refresh')
            if (record.target.classList.contains('xgplayer-is-error')) {
                if (!timer) {
                    if (retry-- <= 0)
                        location.reload()
                    timer = setTimeout(() => {
                        refresh.click()
                        timer = null
                    }, 1.5e3)
                }
            }
        }
    })
    observer.observe($('#studyVideo')[0], {
        attributes: true,
        attributeFilter: ['class'],
        childList: true
    })

    // 每1.5min检查一次是否卡住，因为heartbeat被修改为30s发送一次
    // 记录上次进度
    let lastProgress = $('.item-list-redClass .item-list-progress').text()
    setInterval(() => {
        const curProgress = $('.item-list-redClass .item-list-progress').text()
        if (lastProgress === curProgress)
            location.reload()
        lastProgress = curProgress
    }, 3 * 30e3)

    async function isFinished() {
        const playInfo = JSON.parse(localStorage.getItem(key)).playinfo
        const res = await axios.post('/learning/coursenode/getCourseNodeProgressRedis', {
            chapterId: playInfo.chapterId,
            classesId: playInfo.classesId,
            courseId: playInfo.courseid,
            nodeId: playInfo.jid
        })
        return parseInt(res.data.data.demandLength) <= parseInt(res.data.data.learnLength)
    }
}