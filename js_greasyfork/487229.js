// ==UserScript==
// @name        DRRR HELPER
// @description 为Dollars聊天室创建可以全局调用的事件, 并添加一些辅助功能
// @namespace   Violentmonkey Scripts
// @match       https://drrr.com/room/*
// @license     MIT
// @version     1.0.4
// @author      QQ:121610059
// @update      2024-02-13 14:05:03
// @supportURL  https://greasyfork.org/zh-CN/scripts/414535
// @downloadURL https://update.greasyfork.org/scripts/487229/DRRR%20HELPER.user.js
// @updateURL https://update.greasyfork.org/scripts/487229/DRRR%20HELPER.meta.js
// ==/UserScript==


(function () {
    'use strict';

    //  清空控制台信息
    console.clear();

    //  开发模式
    const dev = localStorage.getItem('dev') || false;

    //  jQuery
    const $ = window.jQuery;

    //  window对象
    let unsafeWindow = window;

    //  全局变量
    let globals = {
        isSending: false, //   是否正在发送消息
        lastSendMessageTime: null,  //  最后发送消息的时间
        throttleTime: 2000,  //  发送消息的节流时间
        lastSendMessageContent: null,  //  最后发送的消息内容
        dev: dev    //    开发模式
    };

    //  事件
    const events = (() => {
        // 存储事件监听器的对象
        const listeners = {};

        // 添加事件监听器的方法
        const addEventListener = (eventName, callback) => {
            // 如果该事件类型不存在，创建一个空数组
            if (!listeners[eventName]) {
                listeners[eventName] = [];
            }
            // 将回调函数添加到对应事件类型的数组中
            listeners[eventName].push(callback);
        }

        // 触发事件的方法
        const triggerEvent = (eventName, data) => {
            // 获取该事件类型的回调函数数组
            const eventListeners = listeners[eventName];
            // 如果存在回调函数数组，依次执行每个回调函数并传递数据
            if (eventListeners) {
                eventListeners.forEach(callback => callback(data));
            }
        }

        // 返回公共接口，将需要暴露的函数和变量放在这里
        return {
            addEventListener,
            triggerEvent
        }
    })();

    //  工具
    const utils  = {
        //   发送信息
        sendMessage: async (message, callback) => {
            // 获取当前时间
            const currentTime = Date.now();

            // 如果上次发送消息的时间存在且距离当前时间不到节流时间，则直接返回，避免重复发送
            if (globals.lastSendMessageTime && currentTime - globals.lastSendMessageTime < 2000) {
                dev && console.error(`触发节流机制(${globals.throttleTime / 1000}秒)，本次消息不发送`);
                return;
            }

            // 更新上次发送消息的时间为当前时间
            globals.lastSendMessageTime = currentTime;

            // 如果正在发送消息，则直接返回，避免重复发送
            if (globals.isSending) {
                dev && console.log('消息正在发送中,本次消息不发送');
                return;
            }

            // 检查message是否为对象
            if (typeof message !== 'object' || message === null) {
                // 如果不是对象，无法继续执行，直接传递错误给回调函数
                if (typeof callback === 'function') {
                    callback(new Error('发送的信息必须为对象'), null);
                } else {
                    dev && console.error('发送的信息必须为对象');
                }
                return; // 结束函数执行
            }

            // 设置发送状态为 true
            globals.isSending = true;

            try {
                //  构造表单数据
                const formData = new FormData();
                for (const key in message) {
                    formData.append(key, message[key]);
                }

                const response = await fetch('?ajax=1', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData // 发送消息
                });
                if (!response.ok) {
                    // 如果响应不是成功的状态，抛出错误
                    throw new Error(`发送消息失败: ${response.status}`);
                }

                // 解析JSON响应
                const data = await response.text();

                //   检查是否有回调函数
                if (typeof callback === 'function') {
                    // 如果提供了回调函数，调用它并传递响应数据
                    callback(null, data);
                } else {
                    //  没有就回调函数就执行默认的判断方法
                    if (data === '') {
                        //  打印调试信息
                        dev && console.log('发送消息成功: ', message);

                        //  文本消息发送完插入本地
                        if (message.message && !message.to){
                            //  插入本地消息
                            utils.insertLocalMessage(message.message);
                        }
                    } else {
                        //  打印调试信息
                        dev && console.error('发送请求成功，但响应不正确');
                    }
                }
            } catch (error) {
                // 如果发生错误，调用回调函数并传递错误信息
                if (typeof callback === 'function') {
                    callback(error, null);
                } else {
                    // 如果没有提供回调函数，打印错误信息
                    dev && console.error('发送消息失败: ', error);
                }
            } finally {
                // 无论发送成功还是失败，都将发送状态设置为 false
                globals.isSending = false;
            }
        },

        // 插入消息到页面
        insertLocalMessage: (message) => {
            // 将消息转为字符串防止意外
            message = message.toString();
            // 忽略me消息
            if (message.startsWith('/me')) return;

            // 创建元素
            const dl = document.createElement('dl');
            dl.className = `talk ${profile.icon}`;

            const dt = document.createElement('dt');
            dt.className = 'dropdown user';

            const avatarDiv = document.createElement('div');
            avatarDiv.className = `avatar avatar-${profile.icon}`;

            const nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.setAttribute('data-toggle', 'dropdown');

            const selectTextSpan = document.createElement('span');
            selectTextSpan.className = 'select-text';
            selectTextSpan.textContent = profile.name;

            const ul = document.createElement('ul');
            ul.className = 'dropdown-menu';
            ul.setAttribute('role', 'menu');

            const dd = document.createElement('dd');
            dd.className = 'bounce';

            const bubbleDiv = document.createElement('div');
            bubbleDiv.className = 'bubble';

            const tailWrapDiv = document.createElement('div');
            tailWrapDiv.className = 'tail-wrap center';
            tailWrapDiv.style.backgroundSize = '65px';

            const tailMaskDiv = document.createElement('div');
            tailMaskDiv.className = 'tail-mask';

            const p = document.createElement('p');
            p.className = 'body select-text';
            p.innerHTML = message.replace(/\n/g, '<br>');

            // 构建元素结构
            tailWrapDiv.appendChild(tailMaskDiv);
            bubbleDiv.appendChild(tailWrapDiv);
            bubbleDiv.appendChild(p);
            dt.appendChild(avatarDiv);
            nameDiv.appendChild(selectTextSpan);
            dt.appendChild(nameDiv);
            dt.appendChild(ul);
            dl.appendChild(dt);
            dd.appendChild(bubbleDiv);
            dl.appendChild(dd);

            // 延迟1.5秒插入本地消息
            const talks = document.querySelector('#talks');
            setTimeout(function() {
                talks.insertAdjacentElement('afterbegin', dl);
            }, 1500);
        },

        //  引入脚本
        loadScript: (src, onloadCallback, onErrorCallback) => {
            // 创建元素
            const scriptElement = document.createElement('script');

            // 设置src属性
            scriptElement.src = `${src}?v=${Date.now()}`;

            // 监听脚本加载成功事件
            scriptElement.onload = () => {
                // 如果提供了加载成功的回调函数，则调用回调函数
                if (typeof onloadCallback === 'function') {
                    onloadCallback();
                } else {
                    //  打印调试信息
                   dev &&  console.log('引入脚本成功: ' + src);
                }
            };

            // 监听脚本加载失败事件
            scriptElement.onerror = () => {
                // 如果提供了加载失败的回调函数，则调用回调函数
                if (typeof onErrorCallback === 'function') {
                    onErrorCallback();
                } else {
                    //  打印调试信息
                    dev &&  console.log('引入脚本失败' +src);
                }
            };

            // 插入元素
            document.head.appendChild(scriptElement);
        },

        //  引入样式
        loadStyle: (href, onloadCallback, onErrorCallback) => {
            // 创建元素
            const linkElement = document.createElement('link');

            // 设置href属性
            linkElement.href = href;

            // 设置rel属性
            linkElement.rel = 'stylesheet';

            // 监听样式加载成功事件
            linkElement.onload = () => {
                // 如果提供了加载成功地回调函数，则调用回调函数
                if (typeof onloadCallback === 'function') {
                    onloadCallback();
                } else {
                    //  打印调试信息
                    dev &&  console.error('引入脚样式功: ' + href);
                }
            }

            //   监听样式加载失败事件
            linkElement.onerror = () => {
                // 如果提供了加载失败的回调函数，则调用回调函数
                if (typeof onErrorCallback === 'function') {
                    onErrorCallback();
                } else {
                    //  打印调试信息
                    dev &&  console.error('引入脚样式失败: ' + href);
                }
            }

            // 插入元素
            document.head.appendChild(linkElement);
        }
    }

    //  自定义命令
    const commands = [];

    //  把事件和自定义命令绑定到全局对象上
    unsafeWindow.DRRR = { globals, events, utils, commands, ...unsafeWindow.DRRR };

    // hook最新消息
    $(document).ajaxSuccess(function(event, xhr, settings) {
        // 检查是否是发送更新请求
        if (!settings.url.includes('update')) return;

        // 检查是否有响应数据和聊天记录
        const talks = xhr.responseJSON.talks || [];

        // 没有有新消息直接返回
        if (talks.length === 0) return;

        // 遍历聊天记录并触发事件
        talks.forEach(function(data) {
            // 如果是自己发送的消息则忽略
            //if (data.is_me) return;

            // 构造事件数据对象
            const { message = '', from = '', user = '', music = '', to = ''} = data;

            const eventData = { message, from, user, music, to};

            //  触发消息事件
            if (data.type === 'message'){
                //  接收消息
                const message = eventData.message;

                // 检查 profile.name 是否为空
                const profileName = profile.name ?? '';

                //  构建正则表达式，匹配 @用户名
                const atRegex = new RegExp(`^@${profileName}\\s*`);

                //  使用正则表达式匹配 @
                const isAt = atRegex.test(message);

                //  检查是否是 @ 消息
                if (isAt) {
                    // 替换消息中的 @用户名 的值
                    const atMessage = message.replace(atRegex, '').trim();

                    //  检查是否为空
                    if (atMessage ){
                        //  打印调试信息
                        dev && console.log("艾特消息：" + atMessage);

                        //  修改监听数据中的消息内容为@消息后的参数
                        eventData.message = atMessage;

                        //  触发@消息事件并传入数据
                        events.triggerEvent('message(@)', eventData);
                    }else{
                        //  打印调试信息
                        dev && console.error("艾特消息内容为空，不处理空消息");
                    }
                    return;
                }

                //  检查消息是否以命令开头
                const matchedCommand = commands.find(({ command }) => message.startsWith(command));

                //  检查是否有匹配的命令
                if (matchedCommand) {
                    const commandLength = matchedCommand.command.length;
                    const commandIndex = message.indexOf(matchedCommand.command);
                    const param = message.substring(commandIndex + commandLength).trim();

                    //  检查是否有参数
                    if (param){
                        //  打印调试信息
                        dev && console.log("命令消息: " + message);
                        dev && console.log("命令: " + matchedCommand.command);
                        dev && console.log('消息: ' + param);

                        //  添加一条命令的监听数据
                        eventData.command = matchedCommand.command

                        //  修改监听数据中的消息内容为命令后的参数
                        eventData.message = param;

                        //  触发指定的消息事件并传入数据
                        events.triggerEvent(`message(${matchedCommand.command})`, eventData);
                    }else{
                        //  打印调试信息
                        dev && console.error(`[${matchedCommand.command}]命令消息没有消息内容，不处理空消息`);
                    }
                }else{
                    dev && console.log("普通消息: " + message);

                    //  触发普通消息事件并传入数据
                    events.triggerEvent(`message(*)`, eventData);
                }
                return;
            }
            // 触发除消息外其他事件
            events.triggerEvent(data.type, eventData);
        });
    });

    //  Hook音乐播放事件
    unsafeWindow.MusicItem = function() {
        function e(n) {
            var r = this;
            _classCallCheck(this, e),
                this.music = n,
                this.name = DRRRClientBehavior.literalMusicTitle(n),
                this.url = n.playURL,
                this.schedule = null;
            var o = function() {
                events.triggerEvent("music(end)", r.music);
                r._unschedule_progress_update(100),
                visualizerEnabled && visualizer.stop(),
                    Player.isPausing = !0,
                    $(document).trigger("music-end", r)
            }
                , i = function() {
                events.triggerEvent("music(pause)", r.music);
                r._unschedule_progress_update(100 * r.percent())
            }
                , a = function() {
                events.triggerEvent("music(start)", r.music);
                r._schedule_progress_update()
            }
                , s = function() {
                events.triggerEvent("music(stop)", r.music);
                r._unschedule_progress_update()
            };
            "apple_music" == n.source ? this.howl = new AppleMusicBackend(n,{
                autoplay: !1,
                onend: o,
                onpause: i,
                onplay: a,
                onstop: s
            }) : this.howl = new Howl({
                autoplay: !1,
                src: [this.url],
                html5: !0,
                volume: visualizerEnabled ? 1 : Player.volume,
                onload: function() {
                    visualizerEnabled && visualizer.play(r._sounds[0]._node)
                },
                onend: o,
                onpause: i,
                onplay: a,
                onstop: s,
                onloaderror: function(e, n) {
                    events.triggerEvent("music(error)", n);
                    if (r._unschedule_progress_update(),
                    "不支持该音频格式" != n && ("不支持所选音频源的编解码器。" != n || -1 === r.url.indexOf(visualizerUrlPrefix))) {
                        switch (n = n || "Unknown") {
                            case 1:
                                n = "获取过程被用户中止";
                                break;
                            case 2:
                                n = "下载时发生错误";
                                break;
                            case 3:
                                n = "解码时发生错误";
                                break;
                            case 4:
                                n = "URL不正确或不支持音频"
                        }
                        visualizerEnabled && visualizer.stop(),
                            swal(t("Music: "), t("音频无法加载: {1}", r.name) + "\n\n" + t("错误信息: {1}", n), "warning");
                        setTimeout(() => swal.close(), 2000);
                    }
                },
                onplayerror: function() {
                    r.howl.once("unlock", function() {
                        r.howl.play()
                    })
                }
            })
        }
        return _createClass(e, [{
            key: "volume",
            value: function(e) {
                this.howl.volume(e)
            }
        }, {
            key: "_schedule_progress_update",
            value: function() {
                var e = this;
                $(document).trigger("music-start", this),
                    $(document).trigger("music-update-percent", 100 * this.percent()),
                    this.schedule = setInterval(function() {
                        $(document).trigger("music-update-percent", 100 * e.percent())
                    }, 950)
            }
        }, {
            key: "_unschedule_progress_update",
            value: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                $(document).trigger("music-stop"),
                    clearInterval(this.schedule),
                !1 !== e && $(document).trigger("music-update-percent", e)
            }
        }, {
            key: "now",
            value: function() {
                return this.howl.seek()
            }
        }, {
            key: "setTime",
            value: function(e) {
                var t = this
                    , n = new Date;
                0 == this.duration() ? this.howl.once("play", function() {
                    var r = (new Date - n) / 1e3;
                    t.howl.seek(e + r)
                }) : e <= this.duration() ? this.howl.seek(e) : this.howl.stop()
            }
        }, {
            key: "duration",
            value: function() {
                return this.howl.duration()
            }
        }, {
            key: "percent",
            value: function() {
                return this.now() / this.duration()
            }
        }, {
            key: "play",
            value: function() {
                $(document).trigger("music-play", this),
                    Player.nowPlaying = this,
                this instanceof Howl && this.stopOthers(),
                    this.howl.play(),
                    Player.isPausing = !1,
                visualizerEnabled && visualizer.resume()
            }
        }, {
            key: "stopOthers",
            value: function() {
                var e = this;
                Player.playList.forEach(function(t) {
                    t !== e && null != t && null != t.howl && t.stop()
                })
            }
        }, {
            key: "pause",
            value: function() {
                this.howl.pause(),
                visualizerEnabled && visualizer.pause(),
                    Player.isPausing = !0
            }
        }, {
            key: "stop",
            value: function() {
                Player.isPausing = !0,
                    this.howl.stop()
            }
        }, {
            key: "unload",
            value: function() {
                clearInterval(this.schedule),
                    this.howl.unload()
            }
        }, {
            key: "previewOnly",
            get: function() {
                return "apple_music" == this.music.source && this.howl.previewOnly
            }
        }, {
            key: "time",
            get: function() {
                return this.now()
            }
        }, {
            key: "music_object",
            get: function() {
                return this.music
            }
        }]),
            e
    }();

    //   插件列表API
    const pluginsApi =  '//43.142.80.6/drrrHelper/plugins/';

    //  加载插件列表
    $.ajax({
        url: `${ pluginsApi }pluginsLists.php`,
        dataType: 'json',
        success: function(data) {
            // 打印调试信息
            dev && console.log('插件列表获取成功');

            //  遍历插件列表
            data.forEach((item) =>{
                //  判断是否启用
                if (item.enabled){
                    //  引入插件
                    utils.loadScript(`${pluginsApi}${item.filename}`, () => {
                        //  打印调试信息
                        dev && console.log(`【${item.name}】插件加载成功`);
                    },() => {
                        //  打印调试信息
                        dev && console.error(`【${item.name}】插件加载失败`);
                    });
                }
            });
        },
        error: function(xhr, status, error) {
            // 打印调试信息
            dev && console.error('插件列表获取失败: ' + error);
        }
    });

    //  打印帮助信息
    //dev && console.log('音乐事件: music(start) music(end) music(pause) music(end) music(error)');
    //dev && console.log('消息事件: message(*) message(command) message(@)');
    //dev && console.log('房间事件: join leave music new_host kick ban unban system new_description room_profile');
})();