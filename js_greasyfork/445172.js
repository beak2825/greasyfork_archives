// ==UserScript==
// @name         直播小工具
// @namespace    https://github.com/isma123HH/bilibili_live-assistant
// @version      2.8.3
// @description  一个直播小工具，功能包括但不限于获取直播流、获取直播封面
// @TODO         无
// @tips         v2.8.3:修复了【获取主播名称失败】的问题，删除了【录制直播】功能，预计将在不久后清理相关代码
// @tips         v2.8.2:删除了重连功能，因为在实际使用中根本没有任何的用，还会消耗性能。以及在获取直播流时添加了菜单，现在可以自选分辨率了
// @tips         v2.8.1:新增删除B站专栏(https://*.bilibili.com/read/*)复制后带出处的功能。
// @tips         v2.8.0:由于B站的限制，搜索api无法被调用，所以删除了点击sc进主页的功能，以及优化及修复了一堆大小问题
// @tips         v2.8.0:替换了pako.js的cdn，并修复了多开直播间导致的网络问题
// @tips         v2.7.9:修复一些时候无法连接ws服务器
// @tips         v2.7.8:修复了一点小问题，以及新增心跳包统计（可以根据这个来推测观看时长，每30秒发送一次心跳包）
// @tips         v2.7.6:新增舰长数统计，以及统计数据导出为json格式，并且添加了打开sc可以显示对应的人民币
// @tips         v2.7.6:更新了打开super chat可以点击目标用户的用户名跳转到他的个人主页，以及修复了弹幕发送时间显示
// @tips         v2.7.5:更新了直播录制(acfun)，以及修改了录制完毕后的操作
// @tips         v2.7.4:更新了直播录制，位置：小功能->录制直播，停止录制同理
// @waring-tips  v2.7.4的警告:录制时清晰度请勿选择"原画PRO" "超清PRO"等PRO清晰度，会导致无法录制。
// @waring-tips  v2.7.4的警告:录制时不要静音播放器，或作出影响正常播放的行为。
// @tips         v2.7.3:详细信息请前往github的Releases查看
// @tips         v2.7.0:现已支持B站直播间wss连接，以及支持了Acfun的直播流获取
// @author       isma
// @license      MIT
// @match        https://live.bilibili.com/*
// @match        https://*.bilibili.com/read/*
// @match        https://live.acfun.cn/live/*
// @match        https://live.douyin.com/*
// @icon         https://i1.hdslb.com/bfs/live/83f48bf72165be6ed8d59ac249aec58e48360575.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @require      https://unpkg.com/sweetalert2@11.4.17/dist/sweetalert2.all.min.js
// @require      https://unpkg.com/sweetalert@2.1.2/dist/sweetalert.min.js
// @require      https://unpkg.com/jquery@3.2.1/dist/jquery.min.js
// @require      https://unpkg.com/xgplayer@2.31.2/browser/index.js
// @require      https://unpkg.com/xgplayer-hls.js@2.1.1/browser/index.js
// @require      https://unpkg.com/xgplayer-flv.js@2.1.2/browser/index.js
// @require      https://unpkg.com/pako@2.0.4/dist/pako.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/445172/%E7%9B%B4%E6%92%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445172/%E7%9B%B4%E6%92%AD%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

window.onload = function () { // 重构为加载时再进行各种操作
    'use strict';
    if (top.location != self.location) {
        return; // 防止在iframe中再加载
    }
    class tools_log_class { // 封装提示class
        constructor() {
            console.warn("[live_tools]初始化class")
        }
        error(msg) {
            console.error("[live_tools_error]" + msg)
        }
        normal(msg) {
            console.log("[live_tools]" + msg)
        }
        warn(msg) {
            console.warn("[live_tools_warn]" + msg)
        }
    }
    var live_tools_log = new tools_log_class() // 初始化
    // 全局通用函数
    function send_toast(icon, title, text, time, pos) { // 将提示封装成函数以便调用
        const Toast = Swal.mixin({
            toast: true,
            position: pos,
            showConfirmButton: false,
            timer: time,
            text: text,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
        });
        Toast.fire({
            icon: icon,
            title: title,
        })
    }
    function timestamptotime(timestamp) { // 时间戳解析
        return new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    }
    function time_stamp_ten(tm) { // 转换为10位时间戳，做这个函数才不是因为只写了解析10位时间戳呢！
        var tma = tm.toString()
        var tmp = tma.substr(0, 10)
        return tmp
    }
    function file_download(content, name, types) {
        var eleLink = document.createElement("a");
        eleLink.download = name + '.json';
        eleLink.style.display = "none";
        // 字符内容转变成blob地址
        var data = JSON.stringify(content, undefined, 4);
        var blob = new Blob([data], { type: types });
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }
    // 检测网站
    switch (window.location.host) {
        case 'live.acfun.cn':
            acfun_run()
            break;
        case 'live.bilibili.com':
            bilibili_run()
            break;
        case 'live.douyin.com':
            douyin_run()
            break;
        case 'www.bilibili.com':
            if (window.location.pathname.indexOf('read') != -1) {
                bilibili_zhuanlan_run()
            }
    }
    function douyin_run() {
        init_douyin()
        const ids = {
            LIVE__GET_STREAM_LINK_FLV: '#get_stream_link_flv',
            LIVE__GET_STREAM_LINK_MU: '#get_stream_link_mu'
        }
        var dy_room_id // 储存一下抖音直播间id，方便以后使用
        function init_douyin() {
            dy_room_id = window.location.pathname.replace('/', '') // 获取网址，例如 https://live.douyin.com/801196266504 = /801196266504
            send_toast('success', 'html注入成功！享用脚本', '', 3000, 'top')
        }
        const wrapperObserver = new MutationObserver((mutationsList) => { // 监听变动
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {// 子元素变动，也有characterData(节点内容或节点文本)，attributes(属性变动)，subtree(所有下属节点的变动)
                    [...mutation.addedNodes].map(item => {// 在新增的节点 返回数组(map)，并且带上item
                        // mmsn_log('非目标变更', item);
                        if (typeof item.innerHTML == 'string') {
                            if (item.parentNode.type == 'button') {
                                if (item.children[0].innerHTML == '举报直播间') {
                                    attack_sgd(item)
                                }
                            }
                        }
                    })
                }
            }
        });
        wrapperObserver.observe(document.body, { attributes: true, childList: true, subtree: true }); // 设置监听参数
        function attack_sgd(item) {
            // flv
            var nodef = document.createElement('li')
            nodef.id = 'get_stream_link_flv'
            nodef.classList.add(item.firstChild.className)
            nodef.appendChild(document.createTextNode('获取flv直播流'))
            // m3u8
            var nodem = document.createElement('li')
            nodem.id = 'get_stream_link_mu'
            nodem.classList.add(item.firstChild.className)
            nodem.appendChild(document.createTextNode('获取m3u8直播流'))
            // 插入
            item.append(nodef)
            item.append(nodem)
            var live_data = JSON.parse(decodeURIComponent(document.getElementById("RENDER_DATA").innerText));
            // flv
            document.querySelector(ids.LIVE__GET_STREAM_LINK_FLV).addEventListener('click', function () {
                navigator.clipboard.writeText(live_data.initialState.roomStore.roomInfo.room.stream_url.flv_pull_url.FULL_HD1)
                send_toast('success', '已复制直播流链接', '', 2000, 'top')
            })
            // m3u8
            document.querySelector(ids.LIVE__GET_STREAM_LINK_MU).addEventListener('click', function () {
                navigator.clipboard.writeText(live_data.initialState.roomStore.roomInfo.room.stream_url.hls_pull_url_map.FULL_HD1)
                send_toast('success', '已复制直播流链接', '', 2000, 'top')
            })
        }
    }
    function acfun_run() {
        const ids = {
            LIVE__MENU_ID: '#get_stream_link',
            LIVE__COVER_ID: '#get_cover_link',
            PLUGIN_MENU_ID: '#plugin_menu',
            LIVE__REC_ID: '#get_live_rec'
        }
        init_acfun()
        get_live_info()
        function get_live_info() {
            $.ajax(
                {
                    url: "https://id.app.acfun.cn/rest/app/visitor/login",
                    type: 'post',
                    xhrFields: { withCredentials: true },
                    contentType: 'application/x-www-form-urlencoded',
                    data: 'sid=acfun.api.visitor',
                    success: function (data) {
                        anonymous_uid = data.userId
                        var visitor_st = data['acfun.api.visitor_st']
                        $.ajax(
                            {
                                url: "https://api.kuaishouzt.com/rest/zt/live/web/startPlay?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&userId=" + anonymous_uid + '&did=H5_&acfun.api.visitor_st=' + visitor_st,
                                type: 'post',
                                xhrFields: { withCredentials: true },
                                contentType: 'application/x-www-form-urlencoded',
                                data: 'authorId=' + ac_room_id + '&pullStreamType=FLV',
                                success: function (data) {
                                    live_data = data
                                }
                            }
                        )
                    },
                }
            )
        }
        var ac_room_id // 房间号
        var acfun_video = null
        var anonymous_uid = null // 匿名id
        var live_data = null
        // 直播录制
        var is_rec = false
        var mediaRecorder
        var video_arr = []
        var rec_time_for
        var rec_time_total = 0
        function init_acfun() {
            ac_room_id = window.location.pathname.replace('/live/', '') // 获取网址，例如 https://live.acfun.cn/live/38382871 = /live/38382871
            send_toast('success', 'html注入成功！享用脚本', '', 3000, 'top')
        }
        const wrapperObserver = new MutationObserver((mutationsList) => { // 监听变动
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {// 子元素变动，也有characterData(节点内容或节点文本)，attributes(属性变动)，subtree(所有下属节点的变动)
                    [...mutation.addedNodes].map(item => {// 在新增的节点 返回数组(map)，并且带上item
                        //mmsn_log('非目标变更', item);
                        if (item.classList?.contains('btn-lab')) {
                            attack_player_player()
                        }
                    })
                }
            }
        });
        wrapperObserver.observe(document.body, { attributes: true, childList: true, subtree: true }); // 设置监听参数
        function attack_player_player() { // 由于acfun的播放器比较特殊，和B站不一样，没有打开菜单就没有div，所以监听打开事件再插入
            $('.context-menu')[0].insertBefore($('<li id="get_stream_link">获取直播流</li>')[0], document.querySelector('.context-menu').childNodes[6]);
            $('.context-menu')[0].insertBefore($('<li id="get_cover_link">获取直播封面</li>')[0], document.querySelector('.context-menu').childNodes[7]);
            // $('.context-menu')[0].insertBefore($('<li id="get_live_rec">录制直播</li>')[0], document.querySelector('.context-menu').childNodes[8]);
            if (is_rec == true) {
                document.querySelector(ids.LIVE__REC_ID).innerText = '停止录制' // 更改按钮名
            }
            // 直播封面
            document.querySelector(ids.LIVE__COVER_ID).addEventListener('click', function () {
                Swal.fire({
                    title: '直播间封面',
                    text: '右键或点击下方按钮即可复制链接!',
                    imageUrl: 'https://ali2.a.kwimgs.com/bs2/ztlc/cover_' + live_data.data.liveId + '_raw.jpg',
                    confirmButtonText: '复制',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigator.clipboard.writeText('https://ali2.a.kwimgs.com/bs2/ztlc/cover_' + live_data.data.liveId + '_raw.jpg')
                        send_toast('success', '已复制图片链接', '', 2000, 'top')
                    }
                })
            })
            // 直播流
            document.querySelector(ids.LIVE__MENU_ID).addEventListener('click', function () {
                var stlk_json = JSON.parse(live_data.data.videoPlayRes) // stlk=stream link
                navigator.clipboard.writeText(stlk_json.liveAdaptiveManifest[0].adaptationSet.representation[stlk_json.liveAdaptiveManifest[0].adaptationSet.representation.length - 1].url)
                send_toast('success', '已复制直播流链接', '', 2000, 'top')
            })
            // 录制直播
            document.querySelector(ids.LIVE__REC_ID).addEventListener('click', function () {
                if (is_rec == true & document.querySelector(ids.LIVE__REC_ID).innerText == '停止录制') {
                    is_rec = false; live_tools_log.warn('正在停止录制'); document.querySelector(ids.LIVE__REC_ID).innerText = '录制直播' // 更改按钮名
                    mediaRecorder.stop()
                    var web_m = new Blob(video_arr, { type: "video/webm" }); // 新建Blob对象，类型为webm
                    send_toast('success', '录制完毕', '共录制了' + rec_time_total + '秒,1秒后将自动跳转', 2000, 'top')
                    document.querySelector('#show_rec_time').remove(); clearInterval(rec_time_for); rec_time_total = 0 // 各种销毁
                    setTimeout(function () {
                        Swal.fire({
                            showConfirmButton: false, width: 1280, html: '<div id="video_run_rec"></div>', showCloseButton: true, // 显示关闭框
                            willClose: () => {
                                video_player.destroy(true) // 销毁播放器
                            },
                        })
                        var video_player = new Player({
                            id: 'video_run_rec', url: URL.createObjectURL(web_m), width: 1200, height: 700, autoplay: true, download: true, playbackRate: [0.5, 0.75, 1, 1.5, 2, 5, 10], defaultPlaybackRate: 1 // 注意的是也设置了倍数播放
                        })
                        // open(URL.createObjectURL(web_m))
                    }, 1500);
                }
                else if (is_rec == false & document.querySelector(ids.LIVE__REC_ID).innerText == '录制直播') {
                    is_rec = true // 设置一下状态
                    mediaRecorder = new MediaRecorder(document.querySelector('.container-video').childNodes[1].captureStream(), {
                        mimeType: "video/webm;codecs=vp8" // 目前看来只支持webm
                    })
                    video_arr = [] // 新建数组
                    new Promise((resolve, reject) => { // 监听将要发生的事件
                        mediaRecorder.onstop = resolve;
                        mediaRecorder.onerror = reject;
                        mediaRecorder.ondataavailable = (event) => {
                            video_arr.push(event.data); // 将数据存入数组
                            // console.log(video_arr) // 未来的计划是video_arr.length > 5000的时候分组
                        }
                        mediaRecorder.start(1); // 不加1的话大概率不会成功运行
                    })
                    setTimeout(function () {
                        rec_time_for = setInterval(function () { // 每隔1秒钟
                            rec_time_total++ // 记录一下已录制的时长
                            document.querySelector('#show_rec_time').innerText = '已经录制了' + rec_time_total + '秒' // 然后在播放器里面修改
                        }, 1000)
                    }, 1)
                    document.querySelector(ids.LIVE__REC_ID).innerText = '停止录制' // 更改按钮名
                    var rec_time_show = '<div class="share"> <span class="shareCount" id="show_rec_time">又是一个播放时间占位! By isma</span> </div>'
                    $(rec_time_show).insertAfter($('.live-tips')[0]) // 1:播放器的显目提示 2.类似高能榜提醒的时间统计
                    send_toast('info', '正在录制直播', '不要给播放器静音，会导致录制的视频没有声音 \n 以及也不要在录制时刷新，数据不会保存', 2500, 'top')
                }
            })
        }
        // 直播菜单
        window.setTimeout(function () {
            $('.author-interactive-area')[0].insertBefore($('<div class="follow-up not-follow" id="plugin_menu"><div class="follow-status">我是</div> <div class="follow-count">插件菜单</div></div>')[0], $('.author-interactive-area .more-action')[0])
            document.querySelector(ids.PLUGIN_MENU_ID).addEventListener('click', function () {
                Swal.fire({
                    title: '插件菜单',
                    showConfirmButton: false,
                    showDenyButton: true,
                    denyButtonText: '直播流播放器',
                }).then((result) => {
                    if (result.isDenied) {
                        let is_m3u8, is_flv = false;
                        Swal.fire({
                            title: '直播流播放',
                            input: 'text', // 允许输入text,但没有任何原生检测
                            inputLabel: '注意！播放器已经同时支持m3u8与flv播放！',
                            inputPlaceholder: '在这里粘贴直播流链接',
                            confirmButtonText: '继续',
                            inputValidator: (value) => {
                                if (!value) {
                                    return '请输入直播流链接!'
                                }
                                if (value.indexOf(".m3u8") != -1) {
                                    is_m3u8 = true
                                }
                                if (value.indexOf(".flv") != -1) {
                                    is_flv = true
                                }
                                if (value.indexOf(".m3u8") != -1 & value.indexOf(".flv") != -1) {
                                    return '既有.m3u8又有.flv，你这个链接不对吧?'
                                }
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                var find_video_id = false
                                try {
                                    acfun_video = document.querySelector('.container-video').childNodes[1] // 播放器控件最后一个节点
                                    acfun_video.muted = true; // 对播放器静音
                                    find_video_id = true
                                }
                                catch {
                                    find_video_id = false
                                }
                                Swal.fire({ // 如果通过video.js来播放m3u8视频。请在将要关闭时使用dispose()，也就是删除播放器的所有事件、元素，完美符合我们"重新创建标签"的需求
                                    showConfirmButton: false,
                                    width: 1280,
                                    html: // 这里就写html代码，其实我更想是找到swal窗口用innerHTML插入的，库本身支持的方法更好，唯一的缺点就是换行需要+
                                        '<div id="video_run_m3u8"></div>',
                                    showCloseButton: true, // 显示关闭框
                                    willClose: () => {
                                        if (find_video_id == true) {
                                            acfun_video.muted = false; // 取消对acfun播放器的静音
                                            video_player.destroy(true)
                                        }
                                        if (find_video_id == false) {
                                            video_player.destroy(true)
                                        }
                                    },
                                })
                                var video_player = null
                                if (is_m3u8) {
                                    video_player = new HlsJsPlayer({
                                        id: 'video_run_m3u8', url: result.value,
                                        isLive: true, width: 1200, height: 700,
                                        autoplay: true, pip: true,
                                    })
                                }
                                else if (is_flv) {
                                    video_player = new FlvJsPlayer({
                                        id: 'video_run_m3u8', url: result.value,
                                        isLive: true, width: 1200, height: 700,
                                        autoplay: true, pip: true, hasVideo: true, hasAudio: true,
                                    })
                                }
                            }
                        })
                    }
                })
            })
        }, 500)
    }
    // *** 
    // 哔哩哔哩专栏相关函数
    // ***
    function bilibili_zhuanlan_run() { // 所有人都恨附加信息！
        // 因为专栏的主要内容在article-content内，并且B站的信息添加也是针对该元素的。
        // 所以仅需阻止默认事件以及冒泡事件（不确定是否有效，先阻止就对了），最后再将选中的内容copy即可。
        // 这里不用.toString()是因为会将html元素也一起复制，并且B站本身也不用.toString()进行复制。
        document.querySelector('.article-content').addEventListener("copy", (e) => {
            e.preventDefault()
            e.stopPropagation()
            navigator.clipboard.writeText(window.getSelection())
        })
    }
    // *** 
    // 哔哩哔哩相关函数
    // ***
    function bilibili_run() {
        const ids = {
            MENU__SETTING_ID: '#plugins_setting',
            MENU__LIVE_TOALS_ID: '#totals_menu',
            RIGHT_MENU__CLICK_GET_STREAM_LINK_ID: '#right_click_menu_getstreamlink',
            RIGHT_MENU__CLICK_GET_STREAM_LINK_FLV_ID: '#right_click_menu_getstreamlink_flv',
            RIGHT_MENU__CLICK_GET_STREAM_COVER_ID: '#right_click_menu_getstreamcover',
            RIGHT_MENU__CLICK_NO_IN_SHOW: '#right_click_menu_no_in_show',
            RIGHT_MENU__CLICK_300S: '#right_click_menu_300s',
            RIGHT_MENU__CLICK_180S: '#right_click_menu_180s',
            RIGHT_MENU__CLICK_60S: '#right_click_menu_60s',
            RIGHT_MENU__CLICK_30S: '#right_click_menu_30s',
            RIGHT_MENU__CLICK_15S: '#right_click_menu_15s',
            LIVE_TOALS_SHOW_HIGH: '#high_people',
            RIGHT_MENU__CLICK_REC_LIVE: '#right_click_menu_rec_live',
        }
        var room_total = {
            // 各种统计
            high_people: 0,
            entry_people: 0,
            boat_guy_entry: 0,
            follow_people: 0,
            block_guys: 0,
            danmu_total: 0,
            // 付费相关
            silver: 0,
            free_gift: 0,
            free_gift_silver: 0,
            pay_gift: 0,
            // sc相关
            super_chat_total: 0,
            super_chat_rmb: 0,
            boat_add: 0,
            hearts: 0,
        }
        function getCertification(json) { // 这里的代码来源:https://blog.csdn.net/yyznm/article/details/116543107，非常感谢这位博主。
            var bytes = str2bytes(json);  //字符串转bytes
            var n1 = new ArrayBuffer(bytes.length + 16)
            var i = new DataView(n1);
            i.setUint32(0, bytes.length + 16), //封包总大小
                i.setUint16(4, 16), // 头部长度
                i.setUint16(6, 1), // 协议版本
                i.setUint32(8, 7),  // 操作码 7表示认证并加入房间
                i.setUint32(12, 1); // 就1
            for (var r = 0; r < bytes.length; r++) {
                i.setUint8(16 + r, bytes[r]); //把要认证的数据添加进去
            }
            return i; //返回
        }
        function str2bytes(str) {
            const bytes = []
            let c
            const len = str.length
            for (let i = 0; i < len; i++) {
                c = str.charCodeAt(i)
                if (c >= 0x010000 && c <= 0x10FFFF) {
                    bytes.push(((c >> 18) & 0x07) | 0xF0)
                    bytes.push(((c >> 12) & 0x3F) | 0x80)
                    bytes.push(((c >> 6) & 0x3F) | 0x80)
                    bytes.push((c & 0x3F) | 0x80)
                } else if (c >= 0x000800 && c <= 0x00FFFF) {
                    bytes.push(((c >> 12) & 0x0F) | 0xE0)
                    bytes.push(((c >> 6) & 0x3F) | 0x80)
                    bytes.push((c & 0x3F) | 0x80)
                } else if (c >= 0x000080 && c <= 0x0007FF) {
                    bytes.push(((c >> 6) & 0x1F) | 0xC0)
                    bytes.push((c & 0x3F) | 0x80)
                } else {
                    bytes.push(c & 0xFF)
                }
            }
            return bytes
        }
        // 文本解码器
        var textDecoder = new TextDecoder('utf-8');
        // 从buffer中读取int
        const readInt = function (buffer, start, len) {
            let result = 0
            for (let i = len - 1; i >= 0; i--) {
                result += Math.pow(256, len - i - 1) * buffer[start + i]
            }
            return result
        }
        // blob blob数据
        // call 回调 解析数据会通过回调返回数据
        function decode(blob, call) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let buffer = new Uint8Array(e.target.result)
                let result = {}
                result.packetLen = readInt(buffer, 0, 4)
                result.headerLen = readInt(buffer, 4, 2)
                result.ver = readInt(buffer, 6, 2)
                result.op = readInt(buffer, 8, 4)
                result.seq = readInt(buffer, 12, 4)
                if (result.op == 5) {
                    result.body = []
                    let offset = 0;
                    while (offset < buffer.length) {
                        let packetLen = readInt(buffer, offset + 0, 4)
                        let headerLen = 16 // readInt(buffer,offset + 4,4)
                        let data = buffer.slice(offset + headerLen, offset + packetLen);
                        let body = "{}"
                        if (result.ver == 2) {
                            body = textDecoder.decode(pako.inflate(data)); //协议版本为 2 时代表数据有进行压缩，通过pako.js进行解压
                        } else {
                            body = textDecoder.decode(data); //协议版本为 0 时，代表数据没有进行压缩
                        }
                        if (body) {
                            const group = body.split(/[\x00-\x1f]+/); // 同一条消息中可能存在多条信息，用正则筛出来
                            group.forEach(item => {
                                try {
                                    result.body.push(JSON.parse(item));
                                } catch (e) {
                                    // 忽略非JSON字符串，通常情况下为分隔符
                                }
                            });
                        }
                        offset += packetLen;
                    }
                }
                call(result); //回调
            }
            reader.readAsArrayBuffer(blob);
        }
        function bili_toast(type, left, top, message, time) { // type可用:success、error、info、caution
            var send_msg = '<div id="bili_toast" class="link-toast ' + type + '" style="left:' + left + 'px; top: ' + top + 'px;"><span class="toast-text">' + message + '</span></div>'
            $('body').append(send_msg)
            setTimeout(function () {
                $('#bili_toast').remove()
            }, time)
        }

        function get_stream_link(type, qn) {
            return new Promise((res, rej) => { // type可用:h5(hls,m3u8),web(flv) qn: 80:流畅 150:高清 400:蓝光 10000:原画 20000:4K 30000:杜比
                $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=' + type + '&qn=' + qn + '', function (data) {
                    res(data.data.durl[0].url)
                })
            })
        }
        //初始化
        var is_rec = false
        var ls_stream = null; // 加上&tmshift=xxx可以看直播回放（单位秒）
        var uid = null; // 用户uid
        var anchor = null; // 主播
        var anchor_uid = null; // 主播uid
        var room_id = null; // 房间号
        var room_real_id = null; // 真正的房间号，因为有些房间是短号
        var rdm_id = null; // 随机id，用在 _context-menu-item_ + rdm_id
        var room_title = null;
        var room_init_res = null; // 房间初始化信息
        var send_time_show = null; // 时间显示的html
        var data_v = null; // 一种data-v
        // var data_v1 = null; // 第二种data-v，但和data_v2一起使用 没必要了所有就注释了
        // var data_v2 = null // 第二种data-v，和v1一起使用
        var wss_timer = null; // 将定时器声明为全局变量，因为在丢失wss连接后要清除定时器
        var load_time = null; // 加载好本脚本的时间戳
        var now_time = null; // 现在时间
        var ws_content = null; // wss连接，方便在任何地方调用

        get_room_id() // 运行初始化函数
        function get_room_id() {
            if (window.location.pathname == '/') { // 由于在主页也会加载，所以先判断一下pathname是不是/，如果是就代表在主页，不必进行其他操作，否则会损耗用户性能
                return
            }
            room_id = window.location.pathname.replace('/', '') // 获取房间号，例如 https://live.bilibili.com/213 = /213 -> 213
            if (room_id.indexOf('blanc') != -1) { // 如果有blanc
                room_id = room_id.replace('/', '') // 那就继续解析!
                room_id = room_id.replace('blanc', '')
            }
            if (window.location.pathname.indexOf('blackboard') != -1) {
                setTimeout(function () {
                    window.location.href = document.querySelector('#player-ctnr').firstChild.firstChild.src
                }, 1500)
            }
            if (document.querySelector('.t-background-image') != null) { // 观察于2022/9/14 似乎B站升级了，现在地址栏没有blackboard了，就用该方法判断是否特殊的直播间
                setTimeout(() => { // 想留在特殊页面也可以，注释掉这个if就行了，对功能没有影响，但控制台会输入一堆报错
                    // 2022/9/23 根据本人观察，有些特殊直播间点进去后网址的房间号不变，但实际上显示的是其他直播间（例如22年的高能电玩节，点击进入C酱直播间，但实际上是“下班被游戏打”的直播间，也就是活动主办方。）
                    // 所以在这里解析出播放器url，如果播放器url的roomid不是当前网址的roomid，则重新跳转。
                    // 但我推测是bug，期待官方未来修复。
                    window.location.href = document.querySelector('#player-ctnr').firstChild.firstChild.src
                    // if(document.querySelector('#player-ctnr').firstChild.firstChild.src.split('/')[4].split('?')[0] != window.location.pathname.replace('/', '')){
                    //     window.location.href = 'https://live.bilibili.com/blanc/' + window.location.pathname.replace('/', '')
                    // }else{
                    //     window.location.href = document.querySelector('#player-ctnr').firstChild.firstChild.src
                    // }

                }, 1000)
            }
            setTimeout(() => {
                if (document.querySelector('.kv-box') != null) {
                    console.log('https://live.bilibili.com/blanc/' + window.location.pathname.replace('/', ''))
                    window.location.href = 'https://live.bilibili.com/blanc/' + window.location.pathname.replace('/', '')
                }
                if (document.querySelector('.era-container') != null) { // 不知道傻逼B站加那么多B乱七八糟的东西干嘛
                    setTimeout(() => {
                        window.location.href = document.querySelector('#player-ctnr').firstChild.firstChild.src
                    }, 1000)
                }
            }, 1500)
            init() // 继续初始化
            wss_get() // websocket连接
        }
        function init() {
            try {
                data_v = document.querySelector('.follow-ctnr .left-part').getAttributeNames()[0] // 获取data-v
            }
            catch {
                // 在一些特殊的直播间会获取不到data-v，但如果想做一个正常的样式，data-v是必须存在的。2022/9/14 大部分直播间没有该情况
                setTimeout(function () { // 我在LIVE__MENU_INJECT里内置了圆角边框和字体居中，如果没有data-v也能模仿其他按钮的样式
                    data_v = document.querySelector('.follow-ctnr').getAttributeNames()[0]
                    document.querySelector('#totals_menu').setAttribute(data_v, ''); document.querySelector('#plugins_setting').setAttribute(data_v, '')
                    document.querySelector('#totals_menu').firstChild.setAttribute(data_v, ''); document.querySelector('#plugins_setting').firstChild.setAttribute(data_v, '')
                }, 1000)
            }
            //注入
            load_time = time_stamp_ten(Date.now()) // 给加载时间复制
            live_tools_log.warn(timestamptotime(load_time) + '时加载脚本')
            send_toast('success', 'html注入成功！享用脚本', '', 3000, 'top') //调用示例 第一个参数是提示图标，可以在sweetalert2官网查询;第二个参数是标题;第三个参数是内容，不填则无;第四个参数是显示时间，毫秒为单位;第五个为显示位置，同样在sweetalert2官网查询。
        }
        const htmls = {
            LIVE__TOTALS_MENU: '<div id="totals_menu" ' + data_v + '="" style="margin-right:5px;border-radius:5px;" role="button" aria-label="数据统计" title="点击打开数据统计菜单" class="left-part live-skin-highlight-bg live-skin-button-text dp-i-block pointer p-relative"><span ' + data_v + '="" class="follow-text v-middle d-inline-block" style="text-align: center;line-height: 20px;">数据统计</span></div>',
            LIVE__MENU_INJECT: '<div id="plugins_setting" ' + data_v + '="" style="margin-right:5px;border-radius:5px;" role="button" aria-label="插件菜单" title="点击打开插件菜单" class="left-part live-skin-highlight-bg live-skin-button-text dp-i-block pointer p-relative"><span ' + data_v + '="" class="follow-text v-middle d-inline-block" style="text-align: center;line-height: 20px;">插件菜单</span></div>'
        };
        // 菜单注入
        window.setTimeout(function bili_live_menu_inject() {
            try {
                document.querySelector('.follow-ctnr').insertBefore($(htmls.LIVE__MENU_INJECT)[0], $('.follow-ctnr .left-part')[0]) // 将"直播菜单"注入
                document.querySelector('.follow-ctnr').insertBefore($(htmls.LIVE__TOTALS_MENU)[0], $('.follow-ctnr .left-part')[0]) // 将"数据统计"注入
            } catch {
                setTimeout(() => {
                    bili_live_menu_inject()
                }, 1000)
                return
            }
            // var high_people_show = '<div title="" '+data_v1+'="" '+data_v2+'="" class="live-skin-normal-a-text pointer not-hover" style="line-height: 16px;"><i '+data_v1+'="" style="font-size: 16px;"></i><span '+data_v1+'="" class="action-text v-middle" id="high_people" style="font-size: 12px;">高能榜占位</span></div>'
            // document.querySelector('.right-ctnr').insertBefore($(high_people_show)[0],document.querySelector('.right-ctnr').childNodes[5]) // 注入高能榜
            document.querySelector(ids.MENU__SETTING_ID).addEventListener('click', function () {
                Swal.fire({
                    title: '插件菜单',
                    showConfirmButton: false,
                    showCancelButton: true,
                    showDenyButton: true,
                    cancelButtonText: '退出',
                    denyButtonText: '直播流播放器',
                }).then((result) => {
                    if (result.isDenied) {
                        let is_m3u8, is_flv = false;
                        Swal.fire({
                            title: '直播流播放',
                            input: 'text', // 允许输入text,但没有任何原生检测
                            inputLabel: '注意！播放器已经同时支持m3u8与flv播放！',
                            inputPlaceholder: '在这里粘贴直播流链接',
                            confirmButtonText: '继续',
                            inputValidator: (value) => {
                                if (!value) {
                                    return '请输入直播流链接!'
                                }
                                if (value.indexOf(".m3u8") != -1) {
                                    is_m3u8 = true
                                }
                                if (value.indexOf(".flv") != -1) {
                                    is_flv = true
                                }
                                if (value.indexOf(".m3u8") != -1 & value.indexOf(".flv") != -1) {
                                    return '既有.m3u8又有.flv，你这个链接不对吧?'
                                }
                            },
                        }).then((result) => {
                            if (result.isConfirmed) {
                                var find_video_id = false
                                try {
                                    document.querySelector('video').muted = true; // 对播放器静音
                                    find_video_id = true
                                }
                                catch {
                                    find_video_id = false
                                }
                                Swal.fire({ // 如果通过video.js来播放m3u8视频。请在将要关闭时使用dispose()，也就是删除播放器的所有事件、元素，完美符合我们"重新创建标签"的需求
                                    showConfirmButton: false,
                                    width: 1280,
                                    html: // 这里就写html代码，其实我更想是找到swal窗口用innerHTML插入的，库本身支持的方法更好，唯一的缺点就是换行需要+
                                        '<div id="video_run_m3u8"></div>',
                                    showCloseButton: true, // 显示关闭框
                                    willClose: () => {
                                        if (find_video_id == true) {
                                            document.querySelector('video').muted = false; // 取消对B站播放器的静音
                                            video_player.destroy(true) // 销毁播放器
                                        }
                                        if (find_video_id == false) {
                                            video_player.destroy(true) // 销毁播放器
                                        }
                                    },
                                })
                                var video_player = null
                                if (is_m3u8 == true) {
                                    video_player = new HlsJsPlayer({
                                        id: 'video_run_m3u8',
                                        url: result.value,
                                        isLive: true,
                                        width: 1200,
                                        height: 700,
                                        autoplay: true,
                                        pip: true,
                                        definitionActive: 'hover', // 设置清晰度需要悬停在按钮上才能修改
                                    })
                                }
                                else if (is_flv == true) {
                                    video_player = new FlvJsPlayer({
                                        id: 'video_run_m3u8',
                                        url: result.value,
                                        isLive: true,
                                        width: 1200,
                                        height: 700,
                                        autoplay: true,
                                        pip: true,
                                        hasVideo: true,
                                        hasAudio: true,
                                        definitionActive: 'hover', // 设置清晰度需要悬停在按钮上才能修改
                                    })
                                }
                                video_player.emit('resourceReady', [{ name: '流畅', url: 'zanwei' }, { name: '高清', url: 'zanwei' }, { name: '原画', url: 'zanwei' }]);
                                video_player.on('definitionChange', function (e) { // 监听清晰度更改
                                    if (e.to == '原画' & is_flv == true) { // 监听更改并劫持修改
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&quality=4', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                    else if (e.to == '原画' & is_m3u8 == true) {
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&quality=4', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                    if (e.to == '流畅' & is_flv == true) {
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&quality=2', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                    else if (e.to == '流畅' & is_m3u8 == true) {
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&quality=2', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                    if (e.to == '高清' & is_flv == true) {
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&quality=3', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                    else if (e.to == '高清' & is_m3u8 == true) {
                                        $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&quality=3', function (data) {
                                            video_player.src = data.data.durl[0].url
                                        })
                                    }
                                })
                                video_player.once('canplay', function (e) { // 视频准备好之后就设置一下清晰度切换的样式
                                    document.querySelector('.xgplayer-definition').lastChild.setAttribute('style', 'left:0px')
                                    document.querySelector('.xgplayer-definition').lastChild.innerText = '清晰度'
                                })
                            }
                        })
                    }
                })
            })
            document.querySelector(ids.MENU__LIVE_TOALS_ID).addEventListener('click', function () { // 监听点击"数据菜单"
                now_time = timestamptotime(time_stamp_ten(Date.now())) // 获取现在时间
                Swal.fire({
                    title: '<font size=5>' + timestamptotime(load_time) + '到<br>' + now_time + '的统计</font>',
                    html:
                        '<h3>房间号' + room_id + '，真实房间号' + room_real_id + '，主播:' + anchor + '<br>' +
                        '新增了' + room_total.follow_people + '个关注<br>有' + room_total.entry_people + '个普通用户和' + room_total.boat_guy_entry + '个大航海用户进入直播间<br>共新增了' + room_total.boat_add + '个大航海<br>已经接收了' + room_total.danmu_total + '条弹幕<br>' + '共收到' + room_total.pay_gift + '个付费礼物，价值' + room_total.silver / 100 + '电池，等同于' + String(room_total.silver / 100).slice(0, String(room_total.silver / 100).length - 1) + '人民币<br>共收到' + room_total.free_gift + '个免费礼物，价值' + room_total.free_gift_silver + '银瓜子<br>共收到了' + room_total.super_chat_total + '条SuperChat,总价值' + room_total.super_chat_rmb + '人民币<br>共禁言了' + room_total.block_guys + '位用户<br>共发送了' + room_total.hearts + '个心跳包',
                    showCloseButton: true,
                    showCancelButton: true,
                    showConfirmButton: false,
                    showDenyButton: true,
                    cancelButtonText: '退出',
                    // confirmButtonText: '下载txt格式的统计数据',
                    denyButtonText: '下载json格式的统计数据'
                }).then((result) => {
                    if (result.isDenied) {
                        var total_json_data = {
                            'room_id': room_id,
                            'room_title': room_title,
                            'up': anchor,
                            'up_uid': anchor_uid,
                            'start_time': timestamptotime(load_time),
                            'export_time': now_time,
                            'data': {
                                'into_room': { // 进入直播间
                                    'normal_user': room_total.entry_people,
                                    'boat_user': room_total.boat_guy_entry,
                                },
                                'new_follow': room_total.follow_people, // 新增关注
                                'new_boat': room_total.boat_add, // 新增大航海
                                'danmu_total': room_total.danmu_total,
                                'gift': { // 礼物统计
                                    'free_gifts': room_total.free_gift,
                                    'free_gift_silver_total': room_total.free_gift_silver,
                                    'pays_gifts': room_total.pay_gift,
                                    'pays_gift_gold_total': room_total.silver / 100, // 金瓜子
                                    'pays_gift_rmb': String(room_total.silver / 100).slice(0, String(room_total.silver / 100).length - 1),
                                },
                                'superchat': { // SuperChat统计
                                    'superchat_total': room_total.super_chat_total,
                                    'superchat_rmb': room_total.super_chat_rmb,
                                },
                                'ban_total': room_total.block_guys, // 禁言统计
                                'send_heart-bags': room_total.hearts // 共发送的心跳包数量
                            },
                        }
                        file_download(total_json_data, '[' + anchor + ']' + room_title + '-' + now_time, "text/json")
                    }
                })
            })
            attack_player()
        }, 800);
        function attack_player() {
            // 获取一些东西
            try {
                anchor = document.querySelector('.upper-row .left-ctnr').childNodes[0].text; // fix in 2023/6/19 1:11
                anchor_uid = document.querySelector('#iframe-popup-area').firstChild.src.split('uid=')[1]
            } catch {
                setTimeout(() => {
                    try {
                        anchor = document.querySelector('.upper-row .left-ctnr').childNodes[0].text;
                        anchor_uid = document.querySelector('#iframe-popup-area').firstChild.src.split('uid=')[1]
                    } catch {
                        anchor = "can_find"
                        anchor_uid = "can_find"
                    }
                }, 1200);
            }
            room_title = document.querySelector('.flex-wrap').firstChild.innerText
            // 注入部分
            try {
                rdm_id = document.querySelector('.live-player-mounter').childNodes[5].className.split('_')[2] // 获取随机的id,分割_得到id
            } catch { // 如果无法获取就在一秒后重试
                setTimeout(() => {
                    attack_player()
                }, 1000)
                return
            }
            // <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_rec_live">录制直播</li>
            var LIVE__PLAYER_MENU = '<li class="_context-menu-item_' + rdm_id + '"><span class="_context-menu-text_' + rdm_id + '">小功能</span><div class="_context-menu-right-arrow_' + rdm_id + '"></div><ul class="_context-sub-menu_' + rdm_id + '"><li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_getstreamlink">获取m3u8直播流</li><li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_getstreamlink_flv">获取flv直播流</li><li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_getstreamcover">获取直播封面</li></ul></li>' 
            var LIVE__QC_MENU = '<li class="_context-menu-item_' + rdm_id + '"><span class="_context-menu-text_' + rdm_id + '">直播切片</span><div class="_context-menu-right-arrow_' + rdm_id + '"></div><ul class="_context-sub-menu_' + rdm_id + '"> <li class="_context-sub-menu-item_' + rdm_id + ' _disabled_' + rdm_id + '">仅在某些直播间可用!</li> <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_300s">300秒(5分钟)回放</li> <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_180s">180秒(3分钟)回放</li> <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_60s">60秒回放</li> <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_30s">30秒回放</li> <li class="_context-sub-menu-item_' + rdm_id + '" id="right_click_menu_15s">15秒回放</li> </ul></li>'
            var inject_live_player_menu_here = $('._web-player-context-menu_' + rdm_id + '') // 这里就有必要声明一个变量了
            var inject_live_player_here = document.querySelectorAll('.live-player-mounter ._context-menu-item_' + rdm_id + '')[3]
            inject_live_player_menu_here[0].insertBefore($(LIVE__PLAYER_MENU)[0], inject_live_player_here); // 向播放器注入"小功能"菜单
            inject_live_player_menu_here[0].insertBefore($(LIVE__QC_MENU)[0], inject_live_player_here); // 向播放器注入"直播切片"菜单
            // 复制m3u8直播流链接 // todo：修复问题
            document.querySelector(ids.RIGHT_MENU__CLICK_GET_STREAM_LINK_ID).addEventListener('click', function () {
                // $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&ts='+time_stamp_ten(Date.now()), function (data) {
                //     $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&ts='+time_stamp_ten(Date.now()), function (data) {
                //     console.log(data.data)
                //     navigator.clipboard.writeText(data.data.durl[0].url)
                //     send_toast('success', '已复制直播流链接', '', 2000, 'top')
                // })
                swal("选择流分辨率", "点击按钮选择！", "info", {
                    buttons: {
                        HD: {
                            text: "高清",
                            value: "HD",
                        },
                        // defeat: true,
                        blue: {
                            text: "蓝光",
                            value: "blue",
                        },
                        original: {
                            text: "原画",
                            value: "original",
                        },
                        fourK: {
                            text: "4K",
                            value: "fourK",
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "HD":
                            get_stream_link("h5", "150").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "blue":
                            get_stream_link("h5", "400").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "original":
                            get_stream_link("h5", "10000").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "fourK":
                            get_stream_link("h5", "20000").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;
                        // default:
                        //     swal("安全离开！");
                    }
                });
                document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 复制flv直播流链接
            document.querySelector(ids.RIGHT_MENU__CLICK_GET_STREAM_LINK_FLV_ID).addEventListener('click', function () {
                swal("选择流分辨率", "点击按钮选择！", "info", {
                    buttons: {
                        HD: {
                            text: "高清",
                            value: "HD",
                        },
                        // defeat: true,
                        blue: {
                            text: "蓝光",
                            value: "blue",
                        },
                        original: {
                            text: "原画",
                            value: "original",
                        },
                        fourK: {
                            text: "4K",
                            value: "fourK",
                        }
                    },
                }).then((value) => {
                    switch (value) {
                        case "HD":
                            get_stream_link("web", "150").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "blue":
                            get_stream_link("web", "400").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "original":
                            get_stream_link("web", "10000").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;

                        case "fourK":
                            get_stream_link("web", "20000").then(res => {
                                navigator.clipboard.writeText(res)
                                send_toast('success', '已复制直播流链接', '', 2000, 'top')
                            })
                            break;
                        // default:
                        //     swal("安全离开！");
                    }
                });
                document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 获取直播间封面
            document.querySelector(ids.RIGHT_MENU__CLICK_GET_STREAM_COVER_ID).addEventListener('click', function () {
                $.get('https://api.live.bilibili.com/room/v1/Room/get_info?id=' + room_id, function (data) {
                    Swal.fire({
                        title: '直播间封面',
                        text: '右键或点击下方按钮即可复制链接!',
                        imageUrl: data.data.user_cover,
                        confirmButtonText: '复制',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigator.clipboard.writeText(data.data.user_cover)
                            send_toast('success', '已复制图片链接', '', 2000, 'top')
                        }
                    })
                })
                document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            try {
                // 其实这段直接就能 window.__NEPTUNE_IS_MY_WAIFU__ 获取，但不知道为什么在脚本里不行
                room_init_res = JSON.parse(document.getElementsByClassName('script-requirement')[0].firstChild.innerHTML.replace(/window.__NEPTUNE_IS_MY_WAIFU__=/, ''))
                try { // 除chrome外的浏览器（例如edge）不支持fmp4，所以在这里会报错。
                    ls_stream = room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[1].codec[0].url_info[0].host + room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[1].codec[0].base_url + room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[1].codec[0].url_info[0].extra
                } catch {
                    ls_stream = room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[0].codec[0].url_info[0].host + room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[0].codec[0].base_url + room_init_res.roomInitRes.data.playurl_info.playurl.stream[1].format[0].codec[0].url_info[0].extra
                }
                uid = room_init_res.userLabInfo.data.uid // 获取一下uid
                live_tools_log.normal("当前用户uid:" + uid)
            }
            catch {
                live_tools_log.error("无法获取到房间初始化信息")
                uid = 0
                $.get('https://api.live.bilibili.com/room/v1/Room/playUrl?cid=' + room_id + '&platform=h5&quality=4', function (data) {
                    ls_stream = data.data.durl[0].url
                })
            }
            // 录制直播 已完成.
            var mediaRecorder
            var video_arr = []
            var rec_time_for
            var rec_time_total = 0
            document.querySelector(ids.RIGHT_MENU__CLICK_REC_LIVE).addEventListener('click', function () {
                if (is_rec == true & document.querySelector(ids.RIGHT_MENU__CLICK_REC_LIVE).innerText == '停止录制') {
                    is_rec = false; live_tools_log.warn('正在停止录制'); document.querySelector(ids.RIGHT_MENU__CLICK_REC_LIVE).innerText = '录制直播' // 更改按钮名
                    mediaRecorder.stop(); var web_m = new Blob(video_arr, { type: "video/webm" }); // 新建Blob对象，类型为webm
                    mediaRecorder.release()
                    send_toast('success', '录制完毕', '共录制了' + rec_time_total + '秒,1秒后将自动跳转', 2000, 'top')
                    document.querySelector('.web-player-icon-rec_now').remove(); document.querySelector('#rec_time_show').remove(); clearInterval(rec_time_for); rec_time_total = 0 // 各种销毁
                    document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
                    setTimeout(function () {
                        Swal.fire({
                            showConfirmButton: false, width: 1280, html: '<div id="video_run_rec"></div>', showCloseButton: true, // 显示关闭框
                            willClose: () => {
                                video_player.destroy(true) // 销毁播放器
                            },
                        })
                        var video_player = new Player({
                            id: 'video_run_rec', url: URL.createObjectURL(web_m), width: 1200, height: 700, autoplay: true, download: true, playbackRate: [0.5, 0.75, 1, 1.5, 2, 5, 10], defaultPlaybackRate: 1 // 注意的是也设置了倍数播放
                        })
                        // open(URL.createObjectURL(web_m))
                    }, 1500);
                }
                else if (is_rec == false & document.querySelector(ids.RIGHT_MENU__CLICK_REC_LIVE).innerText == '录制直播') {
                    is_rec = true // 设置一下状态
                    var video_stream = document.getElementsByTagName('video')[0].captureStream()
                    mediaRecorder = new MediaRecorder(video_stream, {
                        mimeType: "video/webm" // 目前看来只支持webm
                    })
                    video_arr = [] // 新建数组
                    new Promise((resolve, reject) => { // 监听将要发生的事件
                        mediaRecorder.onstop = resolve;
                        mediaRecorder.onerror = reject;
                        mediaRecorder.ondataavailable = (event) => {
                            video_arr.push(event.data); // 将数据存入数组
                            // console.log(video_arr) // 未来的计划是video_arr.length > 5000的时候分组
                        }
                        mediaRecorder.start(100); // 不加1的话大概率不会成功运行
                    })
                    setTimeout(function () {
                        rec_time_for = setInterval(function () { // 每隔1秒钟
                            rec_time_total++ // 记录一下已录制的时长
                            document.querySelector('#show_rec_time').innerText = '已经录制了' + rec_time_total + '秒' // 然后在播放器里面修改
                        }, 1000)
                    }, 1)
                    live_tools_log.warn(now_time + '开始录制直播')
                    document.querySelector(ids.RIGHT_MENU__CLICK_REC_LIVE).innerText = '停止录制' // 更改按钮名
                    var rec_now = '<div class="web-player-icon-rec_now" style="position: absolute; left: ' + document.querySelector('.live-player-mounter').getBoundingClientRect().width / 2 + 'px; top: 0px; z-index: 2; pointer-events: none; width: 150px; height: 35px; opacity: 100; background: none;"> <span id="player_show_rec_now" style="vertical-align: middle"><font size=3>正在录制</font></span> <svg viewBox="0 0 1024 1024" style="vertical-align: middle;color:#CC3300" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8="" width=20px height=20px><path fill="currentColor" d="M704 768V256H128v512h576zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32v128zm0 71.552v176.896l128 64V359.552l-128 64zM192 320h192v64H192v-64z"></path></svg></div>'
                    var rec_time_show = '<div id="rec_time_show" ' + document.querySelector('.left-ctnr .dp-i-block').getAttributeNames()[0] + '="" ' + document.querySelector('.left-ctnr .dp-i-block').getAttributeNames()[1] + '="" class="dp-i-block info-section"><div ' + document.querySelector('.left-ctnr .dp-i-block').getAttributeNames()[0] + '="" class="hot-rank-wrap"><div ' + document.querySelector('.left-ctnr .dp-i-block').getAttributeNames()[0] + '="" class="hot-rank-text rank-desc"><span id="show_rec_time" ' + document.querySelector('.left-ctnr .dp-i-block').getAttributeNames()[0] + '="">播放时间占位By isma</span></div></div></div>'
                    $('.live-player-mounter')[0].insertBefore($(rec_now)[0], $('.web-player-controller-wrap')[0]); $(rec_time_show).insertAfter($('.upper-row .left-ctnr .dp-i-block')[0]) // 1:播放器的显目提示 2.类似高能榜提醒的时间统计
                    send_toast('info', '正在录制直播', '不要静音播放器，会导致录制的视频没有声音 \n 也不要在录制时刷新，录制数据不会保存', 2500, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
                }
            })
            // 这里用 ls_stream 因为该链接已鉴权，使用 get_stream_link 获取的链接，由于没有权限所以无法使用tmshift
            // 直播流300秒(5分钟)切片
            document.querySelector(ids.RIGHT_MENU__CLICK_300S).addEventListener('click', function () {
                navigator.clipboard.writeText(ls_stream + '&tmshift=300')
                send_toast('success', '已复制直播流链接', '', 2000, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 直播流180秒(3分钟)切片
            document.querySelector(ids.RIGHT_MENU__CLICK_180S).addEventListener('click', function () {
                navigator.clipboard.writeText(ls_stream + '&tmshift=180')
                send_toast('success', '已复制直播流链接', '', 2000, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 直播流60秒切片
            document.querySelector(ids.RIGHT_MENU__CLICK_60S).addEventListener('click', function () {
                navigator.clipboard.writeText(ls_stream + '&tmshift=60')
                send_toast('success', '已复制直播流链接', '', 2000, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 直播流30秒切片
            document.querySelector(ids.RIGHT_MENU__CLICK_30S).addEventListener('click', function () {
                navigator.clipboard.writeText(ls_stream + '&tmshift=30')
                send_toast('success', '已复制直播流链接', '', 2000, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            // 直播流15秒切片
            document.querySelector(ids.RIGHT_MENU__CLICK_15S).addEventListener('click', function () {
                navigator.clipboard.writeText(ls_stream + '&tmshift=15')
                send_toast('success', '已复制直播流链接', '', 2000, 'top'); document.getElementsByClassName('_web-player-context-menu_' + rdm_id + '')[0].setAttribute('style', 'opacity : 0;')
            });
            $('.web-player-icon-roomStatus').remove()
            // var player_show_high_guy = '<div class="web-player-icon-high_guy_show" style="position: absolute; left: 10px; top: 10px; z-index: 2; pointer-events: none; width: 200px; height: 43px; opacity: 100; background: none;"> <font size=3><span id="player_show_high-people">B站直播小工具加载成功啦，但这里是占位</span></font> </div>'
            // <div class="web-player-round-title" style="z-index: 2; position: absolute; right: 20px; bottom: 20px; pointer-events: none; color: rgb(170, 170, 170); font-size: 14px;">BV1Di4y1N7LV-【直播录屏】3.7嘉然生日会 完整录屏-P1</div>
            // 固定到右下角示例
            // $('.live-player-mounter')[0].insertBefore($(player_show_high_guy)[0], $('.web-player-controller-wrap')[0])
        }
        function wss_get() {
            // data_v1 = document.querySelector('.right-ctnr').childNodes[2].getAttributeNames()[0] // data-v
            // data_v2 = document.querySelector('.right-ctnr').childNodes[2].getAttributeNames()[1] // 也是data-v 
            $.get('https://api.live.bilibili.com/room/v1/Room/room_init?id=' + room_id, function (rddata) { // 获取真实的房间号，因为有些房间是短号，而ws服务器是根据真实房间号来做广播的
                room_real_id = rddata.data.room_id // 有些房间是短号，还有长一点的id
                ws_content = new WebSocket('wss://broadcastlv.chat.bilibili.com/sub') //（不必了） 这里还有有个host_list[0]可以用，但相关的事件信息会较少 以及拼接wss链接
                ws_content.onopen = function () { // 在ws连接成功后
                    send_toast('success', '与wss服务器连接成功!', '', 3000, 'top')
                    live_tools_log.warn(timestamptotime(time_stamp_ten(Date.now())) + '时连接websocket服务器成功') // 注意！必须要在5秒内发送正确的验证包，不然会被服务器断开wss连接
                    var auth_bag = {
                        "uid": uid, // 用户uid，非必要可不填
                        'roomid': room_real_id, // 房间id,必填参数
                        'protover': 1, // 协议版本，我这里填1，填其他的或许会有错误吧
                        "platform": "web", // 播放平台
                        "clientver": "1.4.0", // 连接客户端版本
                    }
                    ws_content.send(getCertification(JSON.stringify(auth_bag)).buffer) // 发送请求，已经在getCertification处理好了，但我也看不懂
                    wss_timer = setInterval(function () { // 定时每30秒发送一次心跳包，不然会被服务端断开连接
                        var n1 = new ArrayBuffer(16) // 心跳包结构比较简单，直接写
                        var i = new DataView(n1);
                        i.setUint32(0, 0),  // 封包总大小
                            i.setUint16(4, 16), // 头部长度
                            i.setUint16(6, 1), // 协议版本
                            i.setUint32(8, 2),  // 操作码，2为心跳包
                            i.setUint32(12, 1); // 就1
                        ws_content.send(i.buffer); //发送
                        // live_tools_log.warn(timestamptotime(time_stamp_ten(Date.now())) + '发送了一次心跳包')
                        room_total.hearts++
                    }, 30000)   //30秒
                }
                ws_content.onmessage = function (event) {
                    decode(event.data, function (packet) { // 调用函数来解码
                        //解码成功回调
                        if (packet.op == 5) {
                            //会同时有多个数发过来 所以要循环
                            for (let i = 0; i < packet.body.length; i++) {
                                var element = packet.body[i];
                                // console.log(element); // 打印
                                switch (element.cmd) {
                                    case "DANMU_MSG": // 弹幕事件
                                        room_total.danmu_total++;
                                        if (element.info[2][0] == uid) {
                                            var send_pos = document.querySelector('#chat-control-panel-vm').getBoundingClientRect()
                                            bili_toast('success', send_pos.left, send_pos.top, '你的弹幕发送成功了~', 3000)
                                            //var send_ok_toast = '<div id="bili_toast" class="link-toast success " style="left: '+send_pos.left+'px; top: '+send_pos.top+'px;"><span class="toast-text">弹幕发送成功~</span></div>'
                                        }
                                        break;
                                    case "ROOM_CHANGE": // 直播信息更改
                                        break;
                                    case "SEND_GIFT": // 礼物事件
                                        if (element.data.coin_type != "silver") {
                                            room_total.pay_gift = room_total.pay_gift + element.data.num
                                            room_total.silver = room_total.silver + element.data.price
                                        }
                                        else {
                                            room_total.free_gift = room_total.free_gift + element.data.num
                                            room_total.free_gift_silver = room_total.free_gift_silver + element.data.price
                                        }
                                        break;
                                    case "SUPER_CHAT_MESSAGE": // SuperChat事件
                                        room_total.super_chat_total++;
                                        room_total.super_chat_rmb = room_total.super_chat_rmb + element.data.price
                                        break;
                                    case "ONLINE_RANK_COUNT": // 高能榜
                                        room_total.high_people = element.data.count
                                        // document.querySelector(ids.LIVE_TOALS_SHOW_HIGH).innerText = '高能榜人数:'+room_total.high_people
                                        // document.querySelector('#player_show_high-people').innerText = '高能榜人数:'+room_total.high_people
                                        document.querySelector(".tab-list").firstChild.innerText = '高能榜 共' + room_total.high_people + ' 人'
                                        // live_tools_log.normal(timestamptotime(time_stamp_ten(Date.now())) + ' 直播高能榜更新为'+element.data.count)
                                        break;
                                    case "INTERACT_WORD": // 进场事件为1，关注事件为2
                                        if (element.data.msg_type == 1) {
                                            room_total.entry_people++;
                                        }
                                        if (element.data.msg_type == 2) {
                                            room_total.follow_people++;
                                        }
                                        break;
                                    case "ENTRY_EFFECT": // 进场特效
                                        room_total.boat_guy_entry++;
                                        break;
                                    case "ROOM_BLOCK_MSG": // 禁言事件
                                        room_total.block_guys++;
                                        live_tools_log.error(element.data.uname + '被禁言了')
                                        break;
                                    case "GUARD_BUY":
                                        room_total.boat_add++;
                                        break;
                                }
                            }

                        }
                    });
                }
                ws_content.onclose = function (e) {
                    live_tools_log.error('断开了wss连接,错误代码' + e.code + '断开原因' + e.reason + ' 是否正常断开' + e.wasClean)
                    send_toast('error', '断开了wss连接，请刷新页面重连', '', 3000, 'top')
                }
            })
        }
        // 变动后执行函数
        function dm_timeshow(wrapper) {
            var insert_here = wrapper.childNodes[1]
            if (wrapper.getAttribute('data-danmaku') != undefined) { // 区分普通弹幕和礼物、系统提示
                if (wrapper.getAttribute('data-image') != undefined) {
                    setTimeout(function () {
                        var dm_send_time = timestamptotime(wrapper.getAttribute('data-ts')) // 获取弹幕发送时间戳
                        send_time_show = '<span id="time_menu" style="color:#00D1F1;">' + dm_send_time + '</span>' // 时间戳显示
                        $(send_time_show).insertAfter(wrapper); // 附加上去
                    }, 1)
                    return 0
                }
                if (wrapper.getAttribute('data-ts') == "0") { // 自己发的弹幕是没有时间戳的
                    send_time_show = '<span id="time_menu" style="color:#00D1F1;"><br>你应该知道自己是在什么时候发的弹幕吧！</span>'
                    $(send_time_show).insertAfter(insert_here); // 附加上去
                }
                else {
                    var dm_send_time = timestamptotime(wrapper.getAttribute('data-ts')) // 获取弹幕发送时间戳
                    send_time_show = '<span id="time_menu" style="color:#00D1F1;"><br>' + dm_send_time + '</span>' // 时间戳显示
                    $(send_time_show).insertAfter(insert_here); // 附加上去
                }
            }
        }
        function superchat_event(target) {
            setTimeout(function () { // 这里必须设置定时，如果不设置定时，设置属性的步骤会比获取target先执行
                target.querySelector('.name').setAttribute('id', 'go_sc_tp')
                // target.querySelector('.name').innerText = target.querySelector('.name').innerText + ' 点击前往主页'
                var sc_price = target.querySelector('.price').innerText.split('电池')[0] // 10000
                var sc_price_rmb = sc_price.slice(0, sc_price.length - 1) + '.00' // 1000 -> 1000.0
                target.querySelector('.price').innerText = sc_price + '电池 ' + sc_price_rmb + '人民币' // 10000电池 1000.0人民币
            }, 100)
        }
        // 观察变动
        const wrapperObserver = new MutationObserver((mutationsList) => { // 监听变动
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') { // 子元素变动，也有characterData(节点内容或节点文本)，attributes(属性变动)，subtree(所有下属节点的变动)
                    [...mutation.addedNodes].map(item => { // 在新增的节点 返回数组(map)，并且带上item
                        //mmsn_log('非目标变更', item);
                        if (item.classList?.contains('chat-item')) { // 聊天框
                            // mmsn_log('目标变更', item);
                            dm_timeshow(item)
                        }
                        if (item.classList?.contains('mode-roll')) { // 弹幕
                            //mmsn_log('目标变更', item);
                        }
                        if (item.classList?.contains('detail-info')) { // 打开sc
                            superchat_event(item)
                        }
                    })
                }
                //   if(mutation.type === 'attributes'){ // 属性变动，因为某些直播间弹幕较多，哔哩哔哩面对较多的弹幕会在原有的100个div基础上修改，而不是继续添加，影响性能
                //     [mutation.target].map(item => { // 如果要发送一个新弹幕，不会新建一个div而是在原有的div基础上修改弹幕内容来达到想要的效果

                //     })
                //   }
            }
        });
        // attributeFilter:['style'],attributeOldValue:true, 
        wrapperObserver.observe(document.body, { attributes: true, childList: true, subtree: true }); // 设置监听参数
    }
};