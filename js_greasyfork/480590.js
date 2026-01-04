// ==UserScript==
// @name                 Xbox CLoud Gaming优化整合
// @name:zh-CN           Xbox CLoud Gaming优化整合
// @namespace            http://tampermonkey.net/xbox/nft
// @version              3.9.2
// @author               奈非天
// @license              MIT
// @match                https://www.xbox.com/*/play*
// @run-at               document-start
// @grant                unsafeWindow
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.4.1/jquery.min.js
// @original-script      
// @description:zh-cn    整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764反馈】
// @description          整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764反馈】
// @downloadURL https://update.greasyfork.org/scripts/480590/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/480590/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...

    let nftxboxversion = 'v3.9.2';

    let naifeitian = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        getValue(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setValue(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array' || this.isType(value) === 'boolean') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },
        isValidIP(ip) {
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
            return reg.test(ip);
        },
        isNumber(val) {
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        toElement(key, onChange) {
            const CE = createElement;
            const setting = key;
            const currentValue = key['default'] == undefined ? key : key['default'];

            let $control;
            if (setting['options'] != undefined) {

                $control = CE('select', { id: 'xcloud_setting_' + key['name'] });

                for (let value in setting.options) {
                    const label = setting.options[value];

                    const $option = CE('option', { value: value }, label);
                    $control.appendChild($option);
                }

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    key['default'] = e.target.value;

                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });

            } else if (typeof setting.default === 'number') {
                $control = CE('input', { 'type': 'number', 'min': setting.min, 'max': setting.max });

                $control.value = currentValue;
                $control.addEventListener('change', e => {
                    let value = Math.max(setting.min, Math.min(setting.max, parseInt(e.target.value)));
                    e.target.value = value;

                    key['default'] = e.target.value
                    this.setValue(key['name'], key);
                    onChange && onChange(e);
                });
            } else {
                $control = CE('input', { 'type': 'checkbox' });
                $control.checked = currentValue;

                $control.addEventListener('change', e => {
                    key['default'] = e.target.checked;
                    NFTconfig[key['name'].slice(0,-2)]['default']=e.target.checked;
                    this.setValue(key['name'], key);
                    if(key['name']=='STATS_SLIDE_OPENGM' && e.target.checked){
                        if(this.getValue('STATS_SHOW_WHEN_PLAYINGGM')['default']){
                            $('#xcloud_setting_STATS_SHOW_WHEN_PLAYINGGM').click();
                        }
                    }else if(key['name']=='STATS_SHOW_WHEN_PLAYINGGM' && e.target.checked){
                        if(this.getValue('STATS_SLIDE_OPENGM')['default']){
                            $('#xcloud_setting_STATS_SLIDE_OPENGM').click();
                        }
                    }
                    onChange && onChange(e);
                });
            }

            $control.id = `xcloud_setting_${key.name}`;
            return $control;
        },
        isSafari() {
            let userAgent = userAgentOriginal.toLowerCase();
            if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1) {
                return true;
            } else {
                return false;
            }
        },
        getGM(defaultValue, n) {
            let newval = this.getValue(n) == null ? defaultValue : this.getValue(n);
            if(newval.options!=undefined){
                newval.options=defaultValue.options;
            }
            naifeitian.setValue(n, newval);
            return newval;
        },
        showSetting(){
            $('#settingsBackgroud').css('display', '');
            $('body').css('overflow','hidden');
        },
        hideSetting(){
            $('#settingsBackgroud').css('display', 'none');
            $('body').css('overflow','visible');
        }

    }
    //★★ 1=开   0=关 ★★//
    let default_language_list = { '智能简繁': 'Auto', '简体': 'zh-CN', '繁体': 'zh-TW' }
    let NFTconfig =
        {
            no_need_VPN_play: 1,
            regionsList: {
                'Hàn': '168.126.63.1',
                'Mỹ': '4.2.2.2',
                'Nhật': '210.131.113.123'
            },
            fakeIp: '',
            chooseLanguage: 1,
            IfErrUsedefaultGameLanguage: 'zh-CN',
            CustomUA:{
                default:'Edge on Windows',
                options:{
                    'Edge on Windows':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0',
                    'Safari on macOS':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
                    'Samsung Smart Tv':'Mozilla/5.0 (SMART-TV; LINUX; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) 94.0.4606.31/7.0 TV Safari/537.36',
                    'Firefox on Windows':'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b8pre) Gecko/20101213 Firefox/4.0b8pre',
                    '自定义':''
                },
            },
            CustomUAUser:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0',
            high_bitrate: 1,
            autoOpenOC: 0,
            disableCheckNetwork: 1,
            slideToHide: 0,
            IPv6: 0,
            autoFullScreen: 0,
            blockXcloudServer: 0,
            blockXcloudServerList: ['AustraliaEast', 'AustraliaSouthEast', 'BrazilSouth', 'EastUS', 'EastUS2', 'JapanEast', 'KoreaCentral', 'NorthCentralUs', 'SouthCentralUS', 'UKSouth', 'WestEurope', 'WestUS', 'WestUS2'],
            defaultXcloudServer: 'KoreaCentral',
            video_stretch: {
                default: 'none',
                options: {
                    none: '无',
                    fill: '填充',
                    setting: '微调'
                },
                name: 'video_stretchGM'
            },

            video_stretch_x_y: {
                x: 0,
                y: 0,
                name: 'video_stretch_x_yGM'
            },

            noPopSetting: 0,
            disableTouchControls: 0,
            canShowOC: false,
            autoShowTouch: true,
            STATS_SHOW_WHEN_PLAYING: {
                default: false,
                name: 'STATS_SHOW_WHEN_PLAYINGGM'
            },

            STATS_POSITION: {
                default: 'top-left',
                options: {
                    'top-left': '上左',
                    'top-center': '上中',
                    'top-right': '上右'
                },

                name: 'STATS_POSITIONGM'
            },

            STATS_TRANSPARENT: {
                default: false,
                name: 'STATS_TRANSPARENTGM'
            },

            STATS_OPACITY: {
                default: 80,
                min: 10,
                max: 100,
                name: 'STATS_OPACITYGM'
            },

            STATS_TEXT_SIZE: {
                default: '0.9rem',
                options: {
                    '0.9rem': '小',
                    '1.0rem': '中',
                    '1.1rem': '大'
                },

                name: 'STATS_TEXT_SIZEGM'
            },

            STATS_CONDITIONAL_FORMATTING: {
                default: false,
                name: 'STATS_CONDITIONAL_FORMATTINGGM'
            },
            STATS_SLIDE_OPEN:{
                default: false,
                name: 'STATS_SLIDE_OPENGM'
            },

            video_quality:{
                default:'Mặc Định',
                options: [
                    'Mặc Định',
                    'Thấp',
                    'Tạm',
                    'Cao'
                ]
            },
            VIDEO_CLARITY: {
                default: 0,
                min: 0,
                max: 3,
                name: 'VIDEO_CLARITYGM'
            },

            VIDEO_CONTRAST: {
                default: 100,
                min: 0,
                max: 150,
                name: 'VIDEO_CONTRASTGM'
            },

            VIDEO_SATURATION: {
                default: 100,
                min: 0,
                max: 150,
                name: 'VIDEO_SATURATIONGM'
            },

            VIDEO_BRIGHTNESS: {
                default: 100,
                min: 0,
                max: 150,
                name: 'VIDEO_BRIGHTNESSGM'
            },
            antiKick: 0,
            customfakeIp: 0,
            customfakeIp: '',
            xcloud_game_language:default_language_list['简体']
        }
    NFTconfig['fakeIp']=NFTconfig['regionsList']['美服'];
    const integratekeys = Object.keys(NFTconfig);

    integratekeys.forEach(key => {
        NFTconfig[key] = naifeitian.getGM(NFTconfig[key], key + 'GM');
    });

    const originFetch = fetch;
    let regionsMenuItemList = [];
    let languageMenuItemList = [];

    let letmeOb = true;

    let STREAM_WEBRTC;
    const ICON_STREAM_STATS = '<path d="M12.005 5C9.184 5 6.749 6.416 5.009 7.903c-.87.743-1.571 1.51-2.074 2.18-.251.335-.452.644-.605.934-.434.733-.389 1.314-.004 1.98a6.98 6.98 0 0 0 .609.949 13.62 13.62 0 0 0 2.076 2.182C6.753 17.606 9.188 19 12.005 19s5.252-1.394 6.994-2.873a13.62 13.62 0 0 0 2.076-2.182 6.98 6.98 0 0 0 .609-.949c.425-.737.364-1.343-.004-1.98-.154-.29-.354-.599-.605-.934-.503-.669-1.204-1.436-2.074-2.18C17.261 6.416 14.826 5 12.005 5zm0 2c2.135 0 4.189 1.135 5.697 2.424.754.644 1.368 1.32 1.773 1.859.203.27.354.509.351.733s-.151.462-.353.732c-.404.541-1.016 1.214-1.77 1.854C16.198 15.881 14.145 17 12.005 17s-4.193-1.12-5.699-2.398a11.8 11.8 0 0 1-1.77-1.854c-.202-.27-.351-.508-.353-.732s.149-.463.351-.733c.406-.54 1.019-1.215 1.773-1.859C7.816 8.135 9.87 7 12.005 7zm.025 1.975c-1.645 0-3 1.355-3 3s1.355 3 3 3 3-1.355 3-3-1.355-3-3-3zm0 2c.564 0 1 .436 1 1s-.436 1-1 1-1-.436-1-1 .436-1 1-1z"/>';
    const ICON_VIDEO_SETTINGS = '<path d="M16 9.144A6.89 6.89 0 0 0 9.144 16 6.89 6.89 0 0 0 16 22.856 6.89 6.89 0 0 0 22.856 16 6.9 6.9 0 0 0 16 9.144zm0 11.427c-2.507 0-4.571-2.064-4.571-4.571s2.064-4.571 4.571-4.571 4.571 2.064 4.571 4.571-2.064 4.571-4.571 4.571zm15.704-7.541c-.065-.326-.267-.607-.556-.771l-4.26-2.428-.017-4.802c-.001-.335-.15-.652-.405-.868-1.546-1.307-3.325-2.309-5.245-2.953-.306-.103-.641-.073-.923.085L16 3.694l-4.302-2.407c-.282-.158-.618-.189-.924-.086a16.02 16.02 0 0 0-5.239 2.964 1.14 1.14 0 0 0-.403.867L5.109 9.84.848 12.268a1.14 1.14 0 0 0-.555.771 15.22 15.22 0 0 0 0 5.936c.064.326.267.607.555.771l4.261 2.428.017 4.802c.001.335.149.652.403.868 1.546 1.307 3.326 2.309 5.245 2.953.306.103.641.073.923-.085L16 28.306l4.302 2.407a1.13 1.13 0 0 0 .558.143 1.18 1.18 0 0 0 .367-.059c1.917-.648 3.695-1.652 5.239-2.962.255-.216.402-.532.405-.866l.021-4.807 4.261-2.428a1.14 1.14 0 0 0 .555-.771 15.21 15.21 0 0 0-.003-5.931zm-2.143 4.987l-4.082 2.321a1.15 1.15 0 0 0-.429.429l-.258.438a1.13 1.13 0 0 0-.174.601l-.022 4.606a13.71 13.71 0 0 1-3.623 2.043l-4.117-2.295a1.15 1.15 0 0 0-.559-.143h-.546c-.205-.005-.407.045-.586.143l-4.119 2.3a13.74 13.74 0 0 1-3.634-2.033l-.016-4.599a1.14 1.14 0 0 0-.174-.603l-.257-.437c-.102-.182-.249-.333-.429-.437l-4.085-2.328a12.92 12.92 0 0 1 0-4.036l4.074-2.325a1.15 1.15 0 0 0 .429-.429l.258-.438a1.14 1.14 0 0 0 .175-.601l.021-4.606a13.7 13.7 0 0 1 3.625-2.043l4.11 2.295a1.14 1.14 0 0 0 .585.143h.52c.205.005.407-.045.586-.143l4.119-2.3a13.74 13.74 0 0 1 3.634 2.033l.016 4.599a1.14 1.14 0 0 0 .174.603l.257.437c.102.182.249.333.429.438l4.085 2.327a12.88 12.88 0 0 1 .007 4.041h.007z" fill-rule="nonzero"/>';
    // Quickly create a tree of elements without having to use innerHTML
    function createElement(elmName, props = {}) {
        let $elm;
        const hasNs = 'xmlns' in props;

        if (hasNs) {
            $elm = document.createElementNS(props.xmlns, elmName);
        } else {
            $elm = document.createElement(elmName);
        }

        for (let key in props) {
            if (key === 'xmlns') {
                continue;
            }

            if (!props.hasOwnProperty(key) || $elm.hasOwnProperty(key)) {
                continue;
            }

            if (hasNs) {
                $elm.setAttributeNS(null, key, props[key]);
            } else {
                $elm.setAttribute(key, props[key]);
            }
        }

        for (let i = 2, size = arguments.length; i < size; i++) {
            const arg = arguments[i];
            const argType = typeof arg;

            if (argType === 'string' || argType === 'number') {
                $elm.textContent = arg;
            } else if (arg) {
                $elm.appendChild(arg);
            }
        }

        return $elm;
    }

    function setMachineFullScreen() {
        try {
            let element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullScreen();
            }
            screen?.orientation?.lock("landscape");
        } catch (e) {
        }
    }

    function exitMachineFullscreen() {
        try {
            screen?.orientation?.unlock();
            if (document.exitFullScreen) {
                document.exitFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        } catch (e) {
        }
    }
    function exitGame() {
        document.documentElement.style.overflowY = "";
        letmeOb = true;
        transitionComplete = true;
        StreamStats.stop();
        bindmslogoevent();
        const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
        if ($quickBar) {
            $quickBar.style.display = 'none';
        }
        if (NFTconfig['autoFullScreen'] == 1) {
            exitMachineFullscreen();
        }
        if (NFTconfig['noPopSetting'] == 0) {
            $('#popSetting').css('display', 'block');
        }
    }
    class StreamBadges {
        static get BADGE_PLAYTIME() { return 'Time'; };
        static get BADGE_BATTERY() { return 'Pin'; };
        static get BADGE_IN() { return 'IN'; };
        static get BADGE_OUT() { return 'OUT'; };

        static get BADGE_SERVER() { return 'Sever'; };
        static get BADGE_VIDEO() { return 'Video'; };
        static get BADGE_AUDIO() { return 'Âm Thanh'; };

        static get BADGE_BREAK() { return 'break'; };

        static ipv6 = false;
        static resolution = null;
        static video = null;
        static audio = null;
        static fps = 0;
        static region = '';

        static startBatteryLevel = 100;
        static startTimestamp = 0;

        static #cachedDoms = {};

    static #interval;
    static get #REFRESH_INTERVAL() { return 3000; };

    static #renderBadge(name, value, color) {
        const CE = createElement;

        if (name === StreamBadges.BADGE_BREAK) {
            return CE('div', {'style': 'display: block'});
        }

        let $badge;
        if (StreamBadges.#cachedDoms[name]) {
            $badge = StreamBadges.#cachedDoms[name];
            $badge.lastElementChild.textContent = value;
            return $badge;
        }

        $badge = CE('div', {'class': 'better-xcloud-badge'},
                    CE('span', {'class': 'better-xcloud-badge-name'}, name),
                    CE('span', {'class': 'better-xcloud-badge-value', 'style': `background-color: ${color}`}, value));

        if (name === StreamBadges.BADGE_BATTERY) {
            $badge.classList.add('better-xcloud-badge-battery');
        }

        StreamBadges.#cachedDoms[name] = $badge;
        return $badge;
    }

    static async #updateBadges(forceUpdate) {
        if (!forceUpdate && !document.querySelector('.better-xcloud-badges')) {
            StreamBadges.#stop();
            return;
        }

        // Playtime
        let now = +new Date;
        const diffSeconds = Math.ceil((now - StreamBadges.startTimestamp) / 1000);
        const playtime = StreamBadges.#secondsToHm(diffSeconds);

        // Battery
        let batteryLevel = '100%';
        let batteryLevelInt = 100;
        let isCharging = false;
        if (navigator.getBattery) {
            try {
                const bm = await navigator.getBattery();
                isCharging = bm.charging;
                batteryLevelInt = Math.round(bm.level * 100);
                batteryLevel = `${batteryLevelInt}%`;

                if (batteryLevelInt != StreamBadges.startBatteryLevel) {
                    const diffLevel = Math.round(batteryLevelInt - StreamBadges.startBatteryLevel);
                    const sign = diffLevel > 0 ? '+' : '';
                    batteryLevel += ` (${sign}${diffLevel}%)`;
                }
            } catch(e) {}
        }

        const stats = await STREAM_WEBRTC.getStats();
        let totalIn = 0;
        let totalOut = 0;
        stats.forEach(stat => {
            if (stat.type === 'candidate-pair' && stat.state == 'succeeded') {
                totalIn += stat.bytesReceived;
                totalOut += stat.bytesSent;
            }
        });

        const badges = {
            [StreamBadges.BADGE_IN]: totalIn ? StreamBadges.#humanFileSize(totalIn) : null,
            [StreamBadges.BADGE_OUT]: totalOut ? StreamBadges.#humanFileSize(totalOut) : null,
            [StreamBadges.BADGE_PLAYTIME]: playtime,
            [StreamBadges.BADGE_BATTERY]: batteryLevel,
        };

        for (let name in badges) {
            const value = badges[name];
            if (value === null) {
                continue;
            }

            const $elm = StreamBadges.#cachedDoms[name];
            $elm && ($elm.lastElementChild.textContent = value);

            if (name === StreamBadges.BADGE_BATTERY) {
                // Show charging status
                $elm.setAttribute('data-charging', isCharging);

                if (StreamBadges.startBatteryLevel === 100 && batteryLevelInt === 100) {
                    $elm.style.display = 'none';
                } else {
                    $elm.style = '';
                }
            }
        }
    }

    static #stop() {
        StreamBadges.#interval && clearInterval(StreamBadges.#interval);
        StreamBadges.#interval = null;
    }

    static #secondsToHm(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor(seconds % 3600 / 60) + 1;

        const hDisplay = h > 0 ? `${h}小时`: '';
        const mDisplay = m > 0 ? `${m}分钟`: '';
        return hDisplay + mDisplay;
    }

    // https://stackoverflow.com/a/20732091
    static #humanFileSize(size) {
        let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
        return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    static async render() {
        // Video
        let video = '';
        if (StreamBadges.resolution) {
            video = `${StreamBadges.resolution.height}p`;
        }

        if (StreamBadges.video) {
            video && (video += '/');
            video += StreamBadges.video.codec;
            if (StreamBadges.video.profile) {
                let profile = StreamBadges.video.profile;
                profile = profile.startsWith('4d') ? '高' : (profile.startsWith('42e') ? '中' : '低');
                video += ` (${profile})`;
            }
        }

        // Audio
        let audio;
        if (StreamBadges.audio) {
            audio = StreamBadges.audio.codec;
            const bitrate = StreamBadges.audio.bitrate / 1000;
            audio += ` (${bitrate} kHz)`;
        }

        // Battery
        let batteryLevel = '';
        if (navigator.getBattery) {
            batteryLevel = '100%';
        }

        // Server + Region
        let server = StreamBadges.region;
        server += '@' + (StreamBadges.ipv6 ? 'IPv6' : 'IPv4');

        const BADGES = [
            [StreamBadges.BADGE_PLAYTIME, '1m', '#ff004d'],
            [StreamBadges.BADGE_BATTERY, batteryLevel, '#00b543'],
            [StreamBadges.BADGE_IN, StreamBadges.#humanFileSize(0), '#29adff'],
            [StreamBadges.BADGE_OUT, StreamBadges.#humanFileSize(0), '#ff77a8'],
            [StreamBadges.BADGE_BREAK],
            [StreamBadges.BADGE_SERVER, server, '#ff6c24'],
            video ? [StreamBadges.BADGE_VIDEO, video, '#742f29'] : null,
            audio ? [StreamBadges.BADGE_AUDIO, audio, '#5f574f'] : null,
        ];

        const $wrapper = createElement('div', {'class': 'better-xcloud-badges'});
        BADGES.forEach(item => item && $wrapper.appendChild(StreamBadges.#renderBadge(...item)));

        await StreamBadges.#updateBadges(true);
        StreamBadges.#stop();
        StreamBadges.#interval = setInterval(StreamBadges.#updateBadges, StreamBadges.#REFRESH_INTERVAL);

        return $wrapper;
    }
}
 class StreamStats {
 static #interval;
 static #updateInterval = 1000;

 static #$container;
 static #$fps;
 static #$rtt;
 static #$dt;
 static #$pl;
 static #$fl;
 static #$br;

 static #$settings;

 static #lastStat;

 static start() {
    clearInterval(StreamStats.#interval);

    StreamStats.#$container.classList.remove('better-xcloud-gone');
    StreamStats.#interval = setInterval(StreamStats.update, StreamStats.#updateInterval);
}

static stop() {
    clearInterval(StreamStats.#interval);

    StreamStats.#$container.classList.add('better-xcloud-gone');
    StreamStats.#interval = null;
    StreamStats.#lastStat = null;
}

static toggle() {
    StreamStats.#isHidden() ? StreamStats.start() : StreamStats.stop();
}

static #isHidden = () => StreamStats.#$container.classList.contains('better-xcloud-gone');

static update() {
    if (StreamStats.#isHidden() || !STREAM_WEBRTC) {
        StreamStats.stop();
        return;
    }

    STREAM_WEBRTC.getStats().then(stats => {
        stats.forEach(stat => {
            let grade = '';
            if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
                // FPS
                StreamStats.#$fps.textContent = stat.framesPerSecond || 0;

                // Packets Lost
                const packetsLost = stat.packetsLost;
                if (packetsLost != undefined) {
                    const packetsReceived = stat.packetsReceived;
                    const packetsLostPercentage = (packetsLost * 100 / ((packetsLost + packetsReceived) || 1)).toFixed(2);
                    StreamStats.#$pl.textContent = `${packetsLost} (${packetsLostPercentage}%)`;
                }else{
                    StreamStats.#$pl.textContent =  `-1 (-1%)`;
                }

                // Frames Dropped
                const framesDropped = stat.framesDropped;
                if (framesDropped != undefined) {
                    const framesReceived = stat.framesReceived;
                    const framesDroppedPercentage = (framesDropped * 100 / ((framesDropped + framesReceived) || 1)).toFixed(2);
                    StreamStats.#$fl.textContent = `${framesDropped} (${framesDroppedPercentage}%)`;
                }else{
                    StreamStats.#$fl.textContent = `-1 (-1%)`;
                }
                if (StreamStats.#lastStat) {
                    const lastStat = StreamStats.#lastStat;
                    // Bitrate
                    const timeDiff = stat.timestamp - lastStat.timestamp;
                    const bitrate = 8 * (stat.bytesReceived - lastStat.bytesReceived) / timeDiff / 1000;
                    StreamStats.#$br.textContent = `${bitrate.toFixed(2)} Mbps`;

                    // Decode time
                    const totalDecodeTimeDiff = stat.totalDecodeTime - lastStat.totalDecodeTime;
                    const framesDecodedDiff = stat.framesDecoded - lastStat.framesDecoded;
                    const currentDecodeTime = totalDecodeTimeDiff / framesDecodedDiff * 1000;
                    StreamStats.#$dt.textContent = `${currentDecodeTime.toFixed(2)}ms`;

                    if (NFTconfig['STATS_CONDITIONAL_FORMATTING']['default']) {
                        grade = (currentDecodeTime > 12) ? 'bad' : (currentDecodeTime > 9) ? 'ok' : (currentDecodeTime > 6) ? 'good' : '';
                    }
                    StreamStats.#$dt.setAttribute('data-grade', grade);
                }

                StreamStats.#lastStat = stat;
            } else if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
                // Round Trip Time
                const roundTripTime = typeof stat.currentRoundTripTime !== 'undefined' ? stat.currentRoundTripTime * 1000 : '???';
                StreamStats.#$rtt.textContent = `${roundTripTime}ms`;

                if (NFTconfig['STATS_CONDITIONAL_FORMATTING']['default']) {
                    grade = (roundTripTime > 100) ? 'bad' : (roundTripTime > 75) ? 'ok' : (roundTripTime > 40) ? 'good' : '';
                }
                StreamStats.#$rtt.setAttribute('data-grade', grade);
            }
        });
    });
}

static #refreshStyles() {
    const PREF_POSITION = NFTconfig['STATS_POSITION']['default'];
    const PREF_TRANSPARENT = NFTconfig['STATS_TRANSPARENT']['default'];
    const PREF_OPACITY = NFTconfig['STATS_OPACITY']['default'];
    const PREF_TEXT_SIZE = NFTconfig['STATS_TEXT_SIZE']['default'];

    StreamStats.#$container.setAttribute('data-position', PREF_POSITION);
    StreamStats.#$container.setAttribute('data-transparent', PREF_TRANSPARENT);
    StreamStats.#$container.style.opacity = PREF_OPACITY + '%';
    StreamStats.#$container.style.fontSize = PREF_TEXT_SIZE;
}

static hideSettingsUi() {
    StreamStats.#$settings.style.display = 'none';
}

static #toggleSettingsUi() {
    const display = StreamStats.#$settings.style.display;
    StreamStats.#$settings.style.display = display === 'block' ? 'none' : 'block';
}

static render() {
    if (StreamStats.#$container) {
        return;
    }

    const CE = createElement;
    StreamStats.#$container = CE('div', { 'class': 'better-xcloud-stats-bar better-xcloud-gone' },
                                 CE('label', {}, '帧率'),
                                 StreamStats.#$fps = CE('span', {}, 0),
                                 CE('label', {}, '延迟'),
                                 StreamStats.#$rtt = CE('span', {}, '0ms'),
                                 CE('label', {}, '解码'),
                                 StreamStats.#$dt = CE('span', {}, '0ms'),
                                 CE('label', {}, '码率'),
                                 StreamStats.#$br = CE('span', {}, '0 Mbps'),
                                 CE('label', {}, '丢包'),
                                 StreamStats.#$pl = CE('span', {}, '0 (0.00%)'),
                                 CE('label', {}, '丢帧'),
                                 StreamStats.#$fl = CE('span', {}, '0 (0.00%)'));

    let clickTimeout;
    StreamStats.#$container.addEventListener('mousedown', e => {
        clearTimeout(clickTimeout);
        if (clickTimeout) {
            // Double-clicked
            clickTimeout = null;
            StreamStats.#toggleSettingsUi();
            return;
        }

        clickTimeout = setTimeout(() => {
            clickTimeout = null;
        }, 400);
    });

    document.documentElement.appendChild(StreamStats.#$container);

    const refreshFunc = e => {
        StreamStats.#refreshStyles()
    };
    const $position = naifeitian.toElement(NFTconfig['STATS_POSITION'], refreshFunc);

    let $close;
    const $showStartup = naifeitian.toElement(NFTconfig['STATS_SHOW_WHEN_PLAYING'], refreshFunc);
    const $transparent = naifeitian.toElement(NFTconfig['STATS_TRANSPARENT'], refreshFunc);
    const $formatting = naifeitian.toElement(NFTconfig['STATS_CONDITIONAL_FORMATTING'], refreshFunc);
    const $opacity = naifeitian.toElement(NFTconfig['STATS_OPACITY'], refreshFunc);
    const $textSize = naifeitian.toElement(NFTconfig['STATS_TEXT_SIZE'], refreshFunc);
    const $slideopen = naifeitian.toElement(NFTconfig['STATS_SLIDE_OPEN'], refreshFunc);
    StreamStats.#$settings = CE('div', { 'class': 'better-xcloud-stats-settings' },
                                CE('b', {}, '状态条设置'),
                                CE('div', {},
                                   CE('label', { 'for': `xcloud_setting_NFTconfig['STATS_SHOW_WHEN_PLAYING']` }, '游戏启动时显示状态条'),
                                   $showStartup
                                  ),
                                CE('div', {},
                                   CE('label', {}, '位置'),
                                   $position
                                  ),
                                CE('div', {},
                                   CE('label', {}, '字体大小'),
                                   $textSize
                                  ),
                                CE('div', {},
                                   CE('label', { 'for': `xcloud_setting_STATS_OPACITY` }, '透明度 (10-100%)'),
                                   $opacity
                                  ),
                                CE('div', {},
                                   CE('label', { 'for': `xcloud_setting_STATS_TRANSPARENT` }, '背景透明'),
                                   $transparent
                                  ),
                                CE('div', {},
                                   CE('label', { 'for': `xcloud_setting_STATS_CONDITIONAL_FORMATTING` }, '数值颜色'),
                                   $formatting
                                  ),
                                CE('div', {},
                                   CE('label', { 'for': `xcloud_setting_STATS_SLIDE_OPEN` }, '悬浮窗展开时打开'),
                                   $slideopen
                                  ),



                                $close = CE('button', {}, '关闭'));

    $close.addEventListener('click', e => StreamStats.hideSettingsUi());
    document.documentElement.appendChild(StreamStats.#$settings);

    StreamStats.#refreshStyles();
}
}
function numberPicker(key, suffix = '', disabled = false) {
    const setting = key.name;
    let value = key.default;
    let $text, $decBtn, $incBtn;

    const MIN = key.min;
    const MAX = key.max;

    const CE = createElement;
    const $wrapper = CE('div', {},
                        $decBtn = CE('button', { 'data-type': 'dec' }, '-'),
                        $text = CE('span', {}, value + suffix),
                        $incBtn = CE('button', { 'data-type': 'inc' }, '+'),
                       );

    if (disabled) {
        $incBtn.disabled = true;
        $incBtn.classList.add('better-xcloud-hidden');

        $decBtn.disabled = true;
        $decBtn.classList.add('better-xcloud-hidden');
        return $wrapper;
    }

    let interval;
    let isHolding = false;

    const onClick = e => {
        if (isHolding) {
            e.preventDefault();
            isHolding = false;

            return;
        }

        const btnType = e.target.getAttribute('data-type');
        if (btnType === 'dec') {
            value = (value <= MIN) ? MIN : value - 1;
        } else {
            value = (value >= MAX) ? MAX : value + 1;
        }

        $text.textContent = value + suffix;

        key['default'] = value;

        naifeitian.setValue(key['name'], key);

        updateVideoPlayerCss();

        isHolding = false;
    }

    const onMouseDown = e => {
        isHolding = true;

        const args = arguments;
        interval = setInterval(() => {
            const event = new Event('click');
            event.arguments = args;

            e.target.dispatchEvent(event);
        }, 200);
    };

    const onMouseUp = e => {
        clearInterval(interval);
        isHolding = false;
    };

    $decBtn.addEventListener('click', onClick);
    $decBtn.addEventListener('mousedown', onMouseDown);
    $decBtn.addEventListener('mouseup', onMouseUp);
    $decBtn.addEventListener('touchstart', onMouseDown);
    $decBtn.addEventListener('touchend', onMouseUp);

    $incBtn.addEventListener('click', onClick);
    $incBtn.addEventListener('mousedown', onMouseDown);
    $incBtn.addEventListener('mouseup', onMouseUp);
    $incBtn.addEventListener('touchstart', onMouseDown);
    $incBtn.addEventListener('touchend', onMouseUp);

    return $wrapper;
}

function setupVideoSettingsBar() {
    const CE = createElement;
    let $stretchInp;
    const refreshFunc = e => {
        updateVideoPlayerCss();
    };
    const $stretch = naifeitian.toElement(NFTconfig['video_stretch'], refreshFunc);
    const $wrapper = CE('div', { 'class': 'better-xcloud-quick-settings-bar' },
                        CE('div', {},
                           CE('label', { 'for': 'better-xcloud-quick-setting-stretch' }, 'Viền Đen'),
                           $stretch),
                        CE('div', {},
                           CE('label', {}, 'Độ Rõ'),
                           numberPicker(NFTconfig['VIDEO_CLARITY'], '', naifeitian.isSafari())),
                        CE('div', {},
                           CE('label', {}, 'Bão Hòa'),
                           numberPicker(NFTconfig['VIDEO_SATURATION'], '%')),
                        CE('div', {},
                           CE('label', {}, 'Tương Phản'),
                           numberPicker(NFTconfig['VIDEO_CONTRAST'], '%')),
                        CE('div', {},
                           CE('label', {}, 'Độ Sáng'),
                           numberPicker(NFTconfig['VIDEO_BRIGHTNESS'], '%'))
                       );


    $stretch.addEventListener('change', e => {
        if (e.target.value == 'setting') {
            $('#video_stretch_x_y').css('display', 'block');
        } else {
            $('#video_stretch_x_y').css('display', 'none');
        }
        NFTconfig['video_stretch'].default = e.target.value;
        naifeitian.setValue('video_stretchGM', NFTconfig['video_stretch']);
        updateVideoPlayerCss();
    });

    document.documentElement.appendChild($wrapper);
    if ($stretch.id == 'xcloud_setting_video_stretchGM') {
        let dom = $('#xcloud_setting_video_stretchGM');
        dom.after(`<div id="video_stretch_x_y" style="display: ${NFTconfig['video_stretch'].default == 'setting' ? 'block' : 'none'}">
                     <lable>左右
                       <input type=\'text\'class="video_stretch_x_y_Listener" id="video_stretch_x" style="width:35px" value="${NFTconfig['video_stretch_x_y']['x']}"/>
                     </lable><br/>
                     <lable>上下
                       <input type=\'text\'class="video_stretch_x_y_Listener" id="video_stretch_y" style="width:35px" value="${NFTconfig['video_stretch_x_y']['y']}"/>
                     </lable>
                  </div>`);

        $(document).on('blur', '.video_stretch_x_y_Listener', function () {
            let newval = $(this).val();
            if (naifeitian.isNumber($(this).val())) {
                if ($(this).attr('id') == 'video_stretch_x') {
                    NFTconfig['video_stretch_x_y']['x'] = newval;
                    naifeitian.setValue('video_stretch_x_yGM', NFTconfig['video_stretch_x_y']);
                } else {
                    NFTconfig['video_stretch_x_y']['y'] = newval;
                    naifeitian.setValue('video_stretch_x_yGM', NFTconfig['video_stretch_x_y']);
                }
            } else {
                $(this).val("0");
                NFTconfig['video_stretch_x_y']['x'] = 0;
                NFTconfig['video_stretch_x_y']['y'] = 0;
                naifeitian.setValue('video_stretch_x_yGM', NFTconfig['video_stretch_x_y']);
            }
            updateVideoPlayerCss();
        });
    }
}

function cloneStreamMenuButton($orgButton, label, svg_icon) {
    const $button = $orgButton.cloneNode(true);
    $button.setAttribute('aria-label', label);
    $button.querySelector('div[class*=label]').textContent = label;

    const $svg = $button.querySelector('svg');
    $svg.innerHTML = svg_icon;
    $svg.setAttribute('viewBox', '0 0 32 32');

    return $button;
}

function HookProperty(object, property, value) {
    Object.defineProperty(object, property, {
        value: value
    });
}
let windowCtx = self.window;
if (self.unsafeWindow) { windowCtx = self.unsafeWindow; }
let userAgentOriginal = windowCtx.navigator.userAgent;
try {
    HookProperty(windowCtx.navigator, "userAgent",NFTconfig['CustomUAUser']);
    HookProperty(windowCtx.navigator, "maxTouchPoints", 10);
    if (NFTconfig['disableCheckNetwork'] == 1) {
        Object.defineProperty(windowCtx.navigator, 'connection', {
            get: () => undefined,
        });
    }
    HookProperty(windowCtx.navigator, "standalone", true);

} catch (e) { }
windowCtx.fetch = (...arg) => {
    let arg0 = arg[0];
    let url = "";
    let isRequest = false;
    switch (typeof arg0) {
        case "object":
            url = arg0.url;
            isRequest = true;
            break;
        case "string":
            url = arg0;
            break;
        default:
            break;
    }

    if (url.indexOf('/v2/login/user') > -1) {//xgpuweb.gssv-play-prod.xboxlive.com
        return new Promise((resolve, reject) => {
            if (isRequest && arg0.method == "POST") {
                arg0.json().then(json => {
                    let body = JSON.stringify(json);
                    if (NFTconfig['no_need_VPN_play'] == 1) {
                        console.log('免代理开始' + url);
                        if (NFTconfig['customfakeIp'] == 1 && naifeitian.isValidIP(NFTconfig['customfakeIp'])) {
                            arg[0].headers.set('x-forwarded-for', NFTconfig['customfakeIp']);
                            console.log('自定义IP:' + NFTconfig['customfakeIp']);
                        } else {
                            arg[0].headers.set('x-forwarded-for', NFTconfig['fakeIp']);
                        }
                    }

                    arg[0] = new Request(url, {
                        method: arg0.method,
                        headers: arg0.headers,
                        body: body,

                    });
                    originFetch(...arg).then(res => {
                        console.log('免代理结束');
                        res.json().then(json => {
                            let newServerList = [];
                            let currentAutoServer;
                            json["offeringSettings"]["regions"].forEach((region) => {
                                newServerList.push(region["name"]);
                                if (region["isDefault"] === true) {
                                    currentAutoServer = region["name"];
                                }
                            });
                            naifeitian.setValue("blockXcloudServerListGM", newServerList);
                            NFTconfig['blockXcloudServerList'] = newServerList;

                            if (NFTconfig['blockXcloudServerList'].indexOf(NFTconfig['defaultXcloudServer']) == -1) {
                                naifeitian.setValue("defaultXcloudServerGM", "");
                                NFTconfig['defaultXcloudServer'] = "";
                                NFTconfig['blockXcloudServer'] = 0;
                                naifeitian.setValue("blockXcloudServerGM", 0);
                            }
                            if (NFTconfig['blockXcloudServer'] == 1) {
                                console.log('修改服务器开始');
                                json["offeringSettings"]["allowRegionSelection"] = true;
                                let selectedServer = NFTconfig['defaultXcloudServer'];
                                if (selectedServer !== "Auto" && newServerList.includes(selectedServer)) {
                                    json["offeringSettings"]["regions"].forEach((region) => {
                                        if (region["name"] === selectedServer) {
                                            region["isDefault"] = true;
                                        } else {
                                            region["isDefault"] = false;
                                        }
                                    });
                                }
                                console.log('修改服务器结束');
                            }


                            try {
                                json["offeringSettings"]["regions"].forEach((region) => {

                                    if(region.isDefault){
                                        StreamBadges.region = region.name;
                                        throw new Error();
                                    }

                                });

                            } catch(e) {}

                            let body = JSON.stringify(json);
                            let newRes = new Response(body, {
                                status: res.status,
                                statusText: res.statusText,
                                headers: res.headers
                            })
                            resolve(newRes);
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                });

            } else {
                console.error("[ERROR] Not a request.");
                return originFetch(...arg);
            }
        });
    } else if (url.indexOf('/cloud/play') > -1) {

        document.documentElement.style.overflowY = "hidden";

        document.body.style.top = '0px';
        if (NFTconfig['autoFullScreen'] == 1) {
            setMachineFullScreen();
        }
        if (NFTconfig['noPopSetting'] == 0) {
            $('#popSetting').css('display', 'none');
        }

        if (NFTconfig['chooseLanguage'] == 1) {
            return new Promise(async (resolve, reject) => {
                console.log('语言开始');
                let selectedLanguage = NFTconfig['xcloud_game_language'];
                console.log('语言选择：' + selectedLanguage);
                if (selectedLanguage == 'Auto') {

                    let parts=window.location.pathname.split('/');
                    let pid = parts[parts.length-1];
                    try {
                        let res = await fetch(
                            "https://catalog.gamepass.com/products?market=US&language=en-US&hydration=PCInline", {
                                "headers": {
                                    "content-type": "application/json;charset=UTF-8",
                                },
                                "body": "{\"Products\":[\"" + pid + "\"]}",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "omit"
                            });
                        let jsonObj = await res.json();
                        let languageSupport = jsonObj["Products"][pid]["LanguageSupport"]
                        for (let language of Object.keys(default_language_list)) {
                            if (default_language_list[language] in languageSupport) {
                                selectedLanguage = default_language_list[language];
                                break;
                            }
                        }
                        if (selectedLanguage == 'Auto') {
                            //防止接口没有返回支持语言
                            selectedLanguage = NFTconfig['IfErrUsedefaultGameLanguage'];
                        }

                    } catch (e) {
                    }
                }

                if (isRequest && arg0.method == "POST") {
                    arg0.json().then(json => {

                        json["settings"]["locale"] = selectedLanguage;

                        json["settings"]["osName"] = NFTconfig['high_bitrate'] == 1 ? 'windows' : 'android';
                        let body = JSON.stringify(json);

                        arg[0] = new Request(url, {
                            method: arg0.method,
                            headers: arg0.headers,
                            body: body,
                            mode: arg0.mode,
                            credentials: arg0.credentials,
                            cache: arg0.cache,
                            redirect: arg0.redirect,
                            referrer: arg0.referrer,
                            integrity: arg0.integrity
                        });
                        originFetch(...arg).then(res => {
                            console.log(`语言结束, 选择语言: ${selectedLanguage}.`)
                            resolve(res);

                        }).catch(err => {
                            reject(err);
                        });
                    });
                } else {
                    console.error("[ERROR] Not a request.");
                    return originFetch(...arg);
                }
            });
        } else {
            return originFetch(...arg);
        }
    } else if (url.indexOf('/configuration') > -1) {
        // Enable CustomTouchOverlay
        console.log('修改触摸开始')
        return new Promise((resolve, reject) => {
            originFetch(...arg).then(res => {
                res.json().then(json => {
                    // console.error(json);
                    if (NFTconfig['autoOpenOC'] == 1 && NFTconfig['disableTouchControls'] == 0) {
                        let inputOverrides = JSON.parse(json.clientStreamingConfigOverrides || '{}') || {};
                        inputOverrides.inputConfiguration = {
                            enableTouchInput: true,
                            maxTouchPoints: 10,
                            enableVibration:true
                        };
                        json.clientStreamingConfigOverrides = JSON.stringify(inputOverrides);
                        let cdom = $('#BabylonCanvasContainer-main').children();
                        if (cdom.length > 0) {
                            NFTconfig['canShowOC'] = false;
                        } else {
                            NFTconfig['canShowOC'] = true;
                        }
                    }
                    let body = JSON.stringify(json);
                    let newRes = new Response(body, {
                        status: res.status,
                        statusText: res.statusText,
                        headers: res.headers
                    })
                    resolve(newRes);

                    console.log('修改触摸结束')
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    } else if (NFTconfig['IPv6']==1 && url.indexOf('/ice') > -1 && url.indexOf('/sessions/cloud')>-1 && arg0.method == "GET") {//https://ckr.core.gssv-play-prod.xboxlive.com/v5/sessions/cloud/EC9AA551-2EF7-4924-8B69-0FDB85AE8C6A/ice
        return originFetch(...arg).then(response => {
            return response.clone().text().then(text => {
                if (!text.length) {
                    return response;
                }

                const obj = JSON.parse(text);
                let exchangeResponse = JSON.parse(obj.exchangeResponse);
                exchangeResponse = updateIceCandidates(exchangeResponse)
                obj.exchangeResponse = JSON.stringify(exchangeResponse);

                response.json = () => Promise.resolve(obj);
                response.text = () => Promise.resolve(JSON.stringify(obj));

                return response;
            });
        });
    }else {
        return originFetch(...arg);
    }
}
function updateIceCandidates(candidates) {
    const pattern = new RegExp(/a=candidate:(?<foundation>\d+) (?<component>\d+) UDP (?<priority>\d+) (?<ip>[^\s]+) (?<the_rest>.*)/);

    const lst = [];
    for (let item of candidates) {
        if (item.candidate == 'a=end-of-candidates') {
            continue;
        }

        const groups = pattern.exec(item.candidate).groups;
        lst.push(groups);
    }

    lst.sort((a, b) => (a.ip.includes(':') || a.ip > b.ip) ? -1 : 1);

    const newCandidates = [];
    let foundation = 1;
    lst.forEach(item => {
        item.foundation = foundation;
        item.priority = (foundation == 1) ? 100 : 1;

        newCandidates.push({
            'candidate': `a=candidate:${item.foundation} 1 UDP ${item.priority} ${item.ip} ${item.the_rest}`,
            'messageType': 'iceCandidate',
            'sdpMLineIndex': '0',
            'sdpMid': '0',
        });

        ++foundation;
    });

    newCandidates.push({
        'candidate': 'a=end-of-candidates',
        'messageType': 'iceCandidate',
        'sdpMLineIndex': '0',
        'sdpMid': '0',
    });

    return newCandidates;
}
function checkCodec(){
    let video_quality= naifeitian.getValue('video_qualityGM');
    let codecs=RTCRtpReceiver.getCapabilities('video').codecs;
    let codesOptions=['默认'];
    const codecProfileMap = {"高": "4d","中": "42e","低": "420"};
    codecs.forEach((codec, index) => {
        if (codec.mimeType === 'video/H264') {
            for (let key in codecProfileMap) {
                if (codec.sdpFmtpLine.includes(codecProfileMap[key])) {
                    codesOptions.push(codec.mimeType.substring(6)+key);
                    break;
                }
            }
        }
    });

    codesOptions = [...new Set(codesOptions)];

    let sortOrder = ['Mặc Định','Cao','Tạm','Thấp'];
    const customSort = (a, b) => {
        const indexOfA = sortOrder.indexOf(a);
        const indexOfB = sortOrder.indexOf(b);

        if (indexOfA === -1) {
            return 1;
        }
        if (indexOfB === -1) {
            return -1;
        }
        return indexOfA - indexOfB;
    };
    codesOptions.sort(customSort);
    video_quality['options']=codesOptions;

    if (!video_quality['options'].includes(video_quality['default'])) {
        video_quality['default']="默认";
    }
    NFTconfig['video_quality']=video_quality;
    naifeitian.setValue('video_qualityGM',video_quality);
}
checkCodec();

if (NFTconfig['autoOpenOC'] == 1 && NFTconfig['disableTouchControls'] == 0 && NFTconfig['autoShowTouch']) {
    windowCtx.RTCPeerConnection.prototype.originalCreateDataChannelGTC = windowCtx.RTCPeerConnection.prototype.createDataChannel;
    windowCtx.RTCPeerConnection.prototype.createDataChannel = function (...params) {
        let dc = this.originalCreateDataChannelGTC(...params);
        let paddingMsgTimeoutId = 0;
        if (dc.label == "message") {
            dc.addEventListener("message", function (de) {
                if (typeof (de.data) == "string") {
                    let msgdata = JSON.parse(de.data);
                    if (msgdata.target == "/streaming/touchcontrols/showlayoutv2") {
                        clearTimeout(paddingMsgTimeoutId);
                    } else if (msgdata.target == "/streaming/touchcontrols/showtitledefault") {

                        if (!NFTconfig['canShowOC']) {
                            clearTimeout(paddingMsgTimeoutId);
                        } else {
                            if (msgdata.pluginHookMessage !== true) {
                                clearTimeout(paddingMsgTimeoutId);
                                paddingMsgTimeoutId = setTimeout(() => {
                                    dc.dispatchEvent(new MessageEvent('message', {
                                        data: '{"content":"{\\"layoutId\\":\\"\\"}","target":"/streaming/touchcontrols/showlayoutv2","type":"Message","pluginHookMessage":true}'
                                    }));
                                }, 1000);
                            }
                        }
                    }
                }
            });
        }
        return dc;
    }
}

// 配置对象，定义每个设置项的信息
const settingsConfig = [
    {
        label: 'Ngôn Ngữ：',
        type: 'radio',
        name: 'chooseLanguage',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'chooseLanguageOn' },
            { value: 0, text: 'OFF', id: 'chooseLanguageOff' }
        ],
        checkedValue: NFTconfig['chooseLanguage'],
        needHr: false
    },
    {
        label: 'selectLanguage：',
        type: 'radio',
        name: 'selectLanguage',
        display: NFTconfig['chooseLanguage'] === 1 ? 'block' : 'none',
        options: Object.keys(default_language_list).map(languageChinese => {
            return {
                value: default_language_list[languageChinese],
                text: languageChinese,
                id: default_language_list[languageChinese]
            };
        }),
        checkedValue: NFTconfig['xcloud_game_language'],
        needHr: false

    },
    {
        label: 'defaultGameLanguage：',
        type: 'radio',
        name: 'IfErrUsedefaultGameLanguage',
        display: NFTconfig['xcloud_game_language'] === 'Auto' ? 'block' : 'none',
        options: Object.keys(default_language_list).map(languageChinese => {
            if (languageChinese == '智能简繁') { return; }
            return {
                value: default_language_list[languageChinese],
                text: languageChinese,
                id: default_language_list[languageChinese] + 'ifErr'
            };

        }),
        checkedValue: NFTconfig['IfErrUsedefaultGameLanguage'],
        needHr: true
    },
    {
        label: 'noNeedVpn：',
        type: 'radio',
        name: 'noNeedVpn',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'noNeedVpnOn' },
            { value: 0, text: 'OFF', id: 'noNeedVpnOff' },
        ],
        checkedValue: NFTconfig['no_need_VPN_play'],
        needHr: false
    },
    {
        label: 'Hàn Mỹ Nhật：',
        type: 'radio',
        name: 'selectRegion',
        display: NFTconfig['no_need_VPN_play'] === 1 ? 'block' : 'none',
        options: Object.keys(NFTconfig['regionsList']).map(region => {
            return {
                value: NFTconfig['regionsList'][region],
                text: region,
                id: NFTconfig['regionsList'][region]
            };
        }),
        checkedValue: NFTconfig['fakeIp'],
        needHr: false
    },
    {
        label: 'Tùy Chỉnh IP：',
        type: 'radio',
        name: 'customfakeIpInput',
        display: NFTconfig['no_need_VPN_play'] === 1 ? 'block' : 'none',
        value: NFTconfig['customfakeIp'],
        needHr: true,
        moreDom: `<input type="radio" class="selectRegionListener settingsBoxInputRadio" style="outline:none;"
        name='selectRegion' id="customfakeIp" value="customfakeIp" ${NFTconfig['customfakeIp'] == 1 ? 'checked' : ''}>
        <label for="customfakeIp" style="padding-right: 15px;">Tùy Chỉnh IP ：</label>
        <input type='text' style="display: ` + (NFTconfig['customfakeIp'] == 1 ? 'inline' : 'none')
        + `;outline: none;width: 125px;" id="customfakeIpInput" class="customfakeIpListener" value="${NFTconfig['customfakeIp']}" placeholder="请输入IP"/>`

        },
    {
        label: 'Độ Phân Giải：',
        type: 'radio',
        name: 'highBitrate',
        display: 'block',
        options: [
            { value: 1, text: '1080P', id: 'high_bitrateOn' },
            { value: 0, text: '720P', id: 'high_bitrateOff' }
        ],
        checkedValue: NFTconfig['high_bitrate'],
        needHr: true
    },
    {
        label: 'chất lượng hình ảnh：',
        showLable:true,
        type: 'dropdown',
        name: 'video_quality',
        display: "block",
        options: NFTconfig['video_quality']['options'],
        selectedValue: NFTconfig['video_quality']['default'],
        needHr: true
    },
    {
        label: 'kiểm tra mạng：',
        type: 'radio',
        name: 'disableCheckNetwork',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'disableCheckNetworkOn' },
            { value: 0, text: 'OFF', id: 'disableCheckNetworkOff' }
        ],
        checkedValue: NFTconfig['disableCheckNetwork'],
        needHr: true
    },
    {
        label: 'Treo Game：',
        type: 'radio',
        name: 'autoOpenOC',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'autoOpenOCOn' },
            { value: 0, text: 'OFF', id: 'autoOpenOCOff' }
        ],
        checkedValue: NFTconfig['autoOpenOC'],
        needHr: true,
        moreDom: `<div id="autoShowTouchDom" style="padding-right: 0px;display: ${NFTconfig['autoOpenOC'] == 1 ? 'inline' : 'none'}">
        <input type="checkbox" class="autoShowTouchListener settingsBoxInputRadio" style="outline:none;cursor: pointer;" name='autoShowTouch'
        id="autoShowTouch" ${NFTconfig['autoShowTouch'] == true ? 'checked' : ''}><label for="autoShowTouch" style="cursor: pointer;">自动弹出</label></div>`
        },
    {

        label: 'Cảm Ứng Ảo：',
        type: 'radio',
        name: 'slideToHide',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'slideToHideOn' },
            { value: 0, text: 'OFF', id: 'slideToHideOff' },
        ],
        checkedValue: NFTconfig['slideToHide'],
        needHr: true
    },
    {
        label: 'Ẩn Cảm ứng Ảo：',
        type: 'radio',
        name: 'disableTouchControls',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'disableTouchControlsOn' },
            { value: 0, text: 'OFF', id: 'disableTouchControlsOff' },
        ],
        checkedValue: NFTconfig['disableTouchControls'],
        needHr: true
    },
    {
        label: 'Full Screen：',
        type: 'radio',
        name: 'autoFullScreen',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'autoFullScreenOn' },
            { value: 0, text: 'OFF', id: 'autoFullScreenOff' }
        ],
        checkedValue: NFTconfig['autoFullScreen'],
        needHr: true
    },
    {
        label: 'IPv6：',
        type: 'radio',
        name: 'IPv6server',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'IPv6On' },
            { value: 0, text: 'OFF', id: 'IPv6Off' }
        ],
        checkedValue: NFTconfig['IPv6'],
        needHr: true
    }
    ,
    {
        label: 'Máy Chủ Vật Lý：',
        type: 'radio',
        name: 'blockXcloudServer',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'blockXcloudServerOn' },
            { value: 0, text: 'OFF', id: 'blockXcloudServerOff' }
        ],
        checkedValue: NFTconfig['blockXcloudServer'],
        needHr: false
    },
    {
        label: 'Chọn Sever：',
        type: 'dropdown',
        name: 'defaultXcloudServer',
        display: NFTconfig['blockXcloudServer'] === 1?"block":"none",
        options: NFTconfig['blockXcloudServerList'],
        selectedValue: NFTconfig['defaultXcloudServer'],
        needHr: true

    },
    {
        label: 'AntiKick：',
        type: 'radio',
        name: 'antiKick',
        display: 'block',
        options: [
            { value: 1, text: 'ON', id: 'antiKickOn' },
            { value: 0, text: 'OFF', id: 'antiKickOff' }
        ],
        checkedValue: NFTconfig['antiKick'],
        needHr: true

    },
    {
        label: 'Cửa Sổ Nổi：',
        type: 'radio',
        name: 'noPopSetting',
        display: 'block',
        options: [
            { value: 0, text: 'OFF', id: 'noPopSettingOff' },
            { value: 1, text: 'ON', id: 'noPopSettingOn' }
        ],
        checkedValue: NFTconfig['noPopSetting'],
        needHr: true
    },
    {
        label: 'User-Agent：',
        showLable:true,
        type: 'dropdown',
        css:'width:90%',
        name: 'User-Agent',
        display: "block",
        options: NFTconfig['CustomUA']['options'],
        optionsCss:'float:right',
        selectedValue: NFTconfig['CustomUA']['default'],
        needHr: true,
        moreDom: `<br><input type="text" style="display: inline; outline: none; width: 100%;margin-top:12px;" `
        + (NFTconfig['CustomUA']['default']!='自定义'?"readonly disable":"")
        + ` id="customUAuser" class="customUAuserListener" value="${NFTconfig['CustomUA']['options'][NFTconfig['CustomUA']['default']]}">`
    },


];

// 函数用于生成单个设置项的HTML
function generateSettingElement(setting) {
    let settingHTML = `<lable style="display:${setting.display};white-space: nowrap;" class="${setting.name + 'Dom'}">`;
    if (setting.type === 'radio') {
        if (setting.options != undefined) {
            settingHTML += `<label style="display:block;text-align:left;"><div style="display: inline;">${setting.label}</div>`;
            setting.options.forEach(option => {
                if (option == null) { return; }

                settingHTML += `
                <input type="radio" class="${setting.name + 'Listener'} settingsBoxInputRadio" style="outline:none;" name="${setting.name}" id="${option.id}" value="${option.value}" ${option.value === setting.checkedValue ? 'checked' : ''}>
                <label for="${option.id}" style="padding-right: 15px;cursor: pointer;">${option.text}</label>
            `;
            });
        }
        if (setting.moreDom != undefined) {
            settingHTML += setting.moreDom;
        }
        settingHTML += '</label>';
    } else if (setting.type === 'text') {
        settingHTML += `<label style="display: display:block;text-align:left;"><div style="display: inline;">${setting.label}</div>`;
        settingHTML += `
            <input type="text" style="display: inline;outline: none;width: 125px;" id="${setting.name}" class="${setting.name}Listener" value="${setting.value}" placeholder="请输入${setting.label}"/>
        `;
        settingHTML += `</label>`;
    } else if (setting.type === 'dropdown') {
        if(setting.showLable==true){
            settingHTML += `<label style="display: display:block;text-align:left;${setting.css}"><div style="display: inline;">${setting.label}</div>`;
        }
        if(setting.options.length==undefined){
            setting.options=Object.keys(setting.options);
        }
        settingHTML += `
            <select style="outline: none;margin-bottom:5px;${setting.optionsCss}" class="${setting.name + 'Listener'}">
                ${setting.options.map(option => `<option value="${option}" ${option === setting.selectedValue ? 'selected' : ''}>${option}</option>`).join('')}
            </select>
        `;

        if (setting.moreDom != undefined) {
            settingHTML += setting.moreDom;
        }
    }

    settingHTML += `</lable>`;

    if (setting.needHr) {
        settingHTML += `<hr style="background-color: black;width:95%" />`
        }
    return settingHTML;
}
function generateSettingsPage() {
    let settingsHTML = `
        <div style="padding: 10px;color: black;display:none;" class="settingsBackgroud" id="settingsBackgroud">
            <div class="settingsBox">
    `;
    settingsConfig.forEach(setting => {
        settingsHTML += generateSettingElement(setting);
    });

    settingsHTML += `
                <button class="closeSetting1 closeSetting2" style="outline: none;">Lưu </button>
                <div style="text-align: right;margin-top: 8px;font-size: 16px;">
                    <label>Liên Hệ Mua Tk：</label>
                    <a style="margin-right:15px;outline: none;color: #107c10;text-decoration: underline;" href="https://www.facebook.com/HenryHothchid/ ">MuaTKXBOX</a>
                    <a style="outline: none;color: #107c10;text-decoration: underline;" href="https://www.facebook.com/groups/260484345410337/ ">GroupsFb </a>
                </div>
            </div>
        </div>
    `;

    return settingsHTML;
}
let needrefresh = 0;
function initSettingBox() {
    $('body').append(generateSettingsPage());

    //确定
    $(document).on('click', '.closeSetting1', function () {

        naifeitian.hideSetting();
        if (needrefresh == 1) {
            history.go(0);
        }
    });
    //ua输入框
    $(document).on('blur', '.customUAuserListener', function () {
        if($(this).attr('readonly')=='readonly'){return;}
        if($(this).val()==""){
            alert("请输入ua");
            return;
        }
        NFTconfig['CustomUA']['options']['自定义']=$(this).val();
        naifeitian.setValue('CustomUAGM',NFTconfig['CustomUA']);
        naifeitian.setValue('CustomUAUserGM',$(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //ua
    $(document).on('change', '.User-AgentListener', function () {
        if($(this).val()=='自定义'){
            $('#customUAuser').removeAttr('readonly');
            $('#customUAuser').removeAttr('disable');
        }else{
            $("#customUAuser").prop('readonly', true);
            $("#customUAuser").prop('disable', true);
        }
        naifeitian.setValue('CustomUAUserGM',NFTconfig['CustomUA']['options'][$(this).val()]);
        NFTconfig['CustomUA']['default']=$(this).val();
        naifeitian.setValue('CustomUAGM',NFTconfig['CustomUA']);
        $('#customUAuser').val(NFTconfig['CustomUA']['options'][NFTconfig['CustomUA']['default']])
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //设置悬浮窗
    $(document).on('click', '.noPopSettingListener', function () {
        naifeitian.setValue('noPopSettingGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //Máy Chủ
    $(document).on('click', '.antiKickListener', function () {
        needrefresh = 1;
        naifeitian.setValue('antiKickGM', $(this).val());
        $('.closeSetting1').text('确定');
    });
    //ipv6
    $(document).on('click', '.IPv6serverListener', function () {
        naifeitian.setValue('IPv6GM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //选择服务器change
    $(document).on('change', '.defaultXcloudServerListener', function () {
        naifeitian.setValue('defaultXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //物理服务器
    $(document).on('click', '.blockXcloudServerListener', function () {
        if ($(this).val() == 0) {
            $('.defaultXcloudServerDom').css('display', 'none');
        } else {
            $('.defaultXcloudServerDom').css('display', 'block');
        }
        naifeitian.setValue('blockXcloudServerGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //自动全屏
    $(document).on('click', '.autoFullScreenListener', function () {
        naifeitian.setValue('autoFullScreenGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //屏蔽触控
    $(document).on('click', '.disableTouchControlsListener', function () {
        if ($(this).val() == 1) {
            if (!confirm("确定要屏蔽触控吗?")) {
                $('#disableTouchControlsOff').click();
                return;
            }
            $('#autoOpenOCOff').click();
            $('#slideToHideOff').click();
        }

        needrefresh = 1;
        naifeitian.setValue('disableTouchControlsGM', $(this).val());
        $('.closeSetting1').text('确定');
    });

    //自动弹出
    $(document).on('change', '.autoShowTouchListener', function () {
        let newVal = $(this).attr('checked') == 'checked';
        if (newVal) {
            $(this).removeAttr('checked');
        } else {
            $(this).attr('checked');
        }
        naifeitian.setValue('autoShowTouchGM', !newVal);
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //手势显隐触控
    $(document).on('click', '.slideToHideListener', function () {

        if ($(this).val() == 1) {
            $('#disableTouchControlsOff').click();
            $('#autoOpenOCOn').click();

        }
        naifeitian.setValue('slideToHideGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //强制触控
    $(document).on('click', '.autoOpenOCListener', function () {

        if ($(this).val() == 0) {
            $('#autoShowTouchDom').css('display', 'none');
        } else {
            $('#autoShowTouchDom').css('display', 'inline');
            $('#disableTouchControlsOff').click();
        }

        naifeitian.setValue('autoOpenOCGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //禁止检测网络
    $(document).on('click', '.disableCheckNetworkListener', function () {
        naifeitian.setValue('disableCheckNetworkGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //画质
    $(document).on('change', '.video_qualityListener', function () {
        NFTconfig['video_quality']['default']=$(this).val();
        naifeitian.setValue('video_qualityGM', NFTconfig['video_quality']);
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //分辨率
    $(document).on('click', '.highBitrateListener', function () {
        naifeitian.setValue('high_bitrateGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });


    //自定义ip输入框
    $(document).on('blur', '.customfakeIpListener', function () {
        if (naifeitian.isValidIP($(this).val())) {
            naifeitian.setValue('customfakeIpGM', $(this).val());
        } else {
            $(this).val("");
            naifeitian.setValue('customfakeIpGM', '');
            alert('IP格式错误！');
            return;
        }
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //选服
    $(document).on('click', '.selectRegionListener', function () {
        if ($(this).val() == 'customfakeIp') {
            naifeitian.setValue('useCustomfakeIpGM', 1);
            $('#customfakeIpInput').css('display', 'inline');
        } else {
            naifeitian.setValue('fakeIpGM', $(this).val());
            naifeitian.setValue('useCustomfakeIpGM', 0);
            $('#customfakeIpInput').css('display', 'none');
        }
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //免代理直连
    $(document).on('click', '.noNeedVpnListener', function () {
        if ($(this).val() == 0) {
            $('.selectRegionDom').css('display', 'none');;
            $('.customfakeIpInputDom').css('display', 'none');
        } else {
            $('.selectRegionDom').css('display', 'block');
            $('.customfakeIpInputDom').css('display', 'block');
        }
        naifeitian.setValue('no_need_VPN_playGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //智能简繁错误
    $(document).on('click', '.IfErrUsedefaultGameLanguageListener', function () {
        naifeitian.setValue('IfErrUsedefaultGameLanguageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
    //语言
    $(document).on('click', '.selectLanguageListener', function () {
        if ($(this).val() != 'Auto') {
            $('.IfErrUsedefaultGameLanguageDom').css('display', 'none');
        } else {
            $('.IfErrUsedefaultGameLanguageDom').css('display', 'block');
        }
        naifeitian.setValue('xcloud_game_languageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });

    //选择语言
    $(document).on('click', '.chooseLanguageListener', function () {
        if ($(this).val() == 0) {
            $('.selectLanguageDom').css('display', 'none');
            $('.IfErrUsedefaultGameLanguageDom').css('display', 'none');
        } else {
            $('.selectLanguageDom').css('display', 'block');

            if (naifeitian.getValue('xcloud_game_languageGM') == 'Auto') {
                $('.IfErrUsedefaultGameLanguageDom').css('display', 'block');
            }
        }
        naifeitian.setValue('chooseLanguageGM', $(this).val());
        needrefresh = 1;
        $('.closeSetting1').text('确定');
    });
}

function initSlideHide(){
    if(NFTconfig['slideToHide']==1){
        var gestureArea = $("<div></div>");
        gestureArea.attr("id", "touchControllerEventArea");
        $(document.documentElement).append(gestureArea);

        gestureArea = $("#touchControllerEventArea");
        let startX, startY, endX, endY;
        let threshold = 130; // 手势滑动的阈值
        gestureArea.on("touchstart", function (e) {
            startX = e.originalEvent.touches[0].clientX;
            startY = e.originalEvent.touches[0].clientY;
        });
        gestureArea.on("touchmove", function (e) {
            endX = e.originalEvent.touches[0].clientX;
            endY = e.originalEvent.touches[0].clientY;
        });
        gestureArea.on("touchend", function (e) {
            if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
                const deltaX = endX - startX;
                const deltaY = endY - startY;
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                    if (deltaX < 0) {
                        // 左滑
                        $('#BabylonCanvasContainer-main').css('display','none');
                        $('#MultiTouchSurface').css('display','none');
                        e.preventDefault();
                    } else {
                        // 右滑
                        $('#BabylonCanvasContainer-main').css('display','block');
                        $('#MultiTouchSurface').css('display','block');
                        e.preventDefault();
                    }
                }
            }
        });

    }
}
$(document).ready(function () {
    setTimeout(function () {
        let popCss = `

#popSetting {
width: 76px;
height: 33px;
background: #fff;
position: absolute;
  top: 30%;
  cursor: pointer;
box-sizing: border-box;
background-size: 100% 100%;
overflow: hidden;
  font-family: Arial;
font-size: 18px;
line-height: 30px;
font-weight: bold;
color: #000000bf;
border: 2px solid;
border-radius: 10px;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none ;
}
.better-xcloud-hidden {
  visibility: hidden !important;
}

.better-xcloud-stats-bar {
  display: block;
  user-select: none;
  position: fixed;
  top: 0;
  background-color: #000;
  color: #fff;
  font-family: Consolas, "Courier New", Courier, monospace;
  font-size: 0.9rem;
  padding-left: 8px;
  z-index: 1000;
  text-wrap: nowrap;
}

.better-xcloud-stats-bar[data-position=top-left] {
  left: 20px;
}

.better-xcloud-stats-bar[data-position=top-right] {
  right: 0;
}

.better-xcloud-stats-bar[data-position=top-center] {
  transform: translate(-50%, 0);
  left: 50%;
}

.better-xcloud-stats-bar[data-transparent=true] {
  background: none;
  filter: drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000);
}

.better-xcloud-stats-bar label {
  margin: 0 8px 0 0;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-size: inherit;
  font-weight: bold;
  vertical-align: middle;
}

.better-xcloud-stats-bar span {
  min-width: 60px;
  display: inline-block;
  text-align: right;
  padding-right: 8px;
  margin-right: 8px;
  border-right: 2px solid #fff;
  vertical-align: middle;
}

.better-xcloud-stats-bar span[data-grade=good] {
  color: #6bffff;
}

.better-xcloud-stats-bar span[data-grade=ok] {
  color: #fff16b;
}

.better-xcloud-stats-bar span[data-grade=bad] {
  color: #ff5f5f;
}

.better-xcloud-stats-bar span:first-of-type {
  min-width: 30px;
}

.better-xcloud-stats-bar span:last-of-type {
  border: 0;
  margin-right: 0;
}

.better-xcloud-stats-settings {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 420px;
  padding: 20px;
  border-radius: 8px;
  z-index: 1000;
  background: #1a1b1e;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  box-shadow: 0 0 6px #000;
  user-select: none;
}

.better-xcloud-stats-settings *:focus {
  outline: none !important;
}

.better-xcloud-stats-settings > b {
  color: #fff;
  display: block;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 32px;
  margin-bottom: 12px;
}

.better-xcloud-stats-settings > div {
  display: flex;
  margin-bottom: 8px;
  padding: 2px 4px;
}

.better-xcloud-stats-settings label {
  flex: 1;
  margin-bottom: 0;
  align-self: center;
}

.better-xcloud-stats-settings button {
  padding: 8px 32px;
  margin: 20px auto 0;
  border: none;
  border-radius: 4px;
  display: block;
  background-color: #2d3036;
  text-align: center;
  color: white;
  text-transform: uppercase;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: 18px;
  font-size: 14px;
}

@media (hover: hover) {
  .better-xcloud-stats-settings button:hover {
      background-color: #515863;
  }
}

.better-xcloud-stats-settings button:focus {
  background-color: #515863;
}

.better-xcloud-gone {
  display: none !important;
}

.better-xcloud-quick-settings-bar {
  display: none;
  user-select: none;
  -webkit-user-select: none;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 9999;
  padding: 16px;
  width: 600px;
  background: #1a1b1e;
  color: #fff;
  border-radius: 8px 8px 0 0;
  font-weight: 400;
  font-size: 14px;
  font-family: Bahnschrift, Arial, Helvetica, sans-serif;
  text-align: center;
  box-shadow: 0px 0px 6px #000;
  opacity: 0.95;
}

.better-xcloud-quick-settings-bar *:focus {
  outline: none !important;
}

.better-xcloud-quick-settings-bar > div {
  flex: 1;
}

.better-xcloud-quick-settings-bar label {
  font-size: 16px;
  display: block;
  margin-bottom: 8px;
}

.better-xcloud-quick-settings-bar input {
  width: 22px;
  height: 22px;
}

.better-xcloud-quick-settings-bar button {
  border: none;
  width: 22px;
  height: 22px;
  margin: 0 4px;
  line-height: 22px;
  background-color: #515151;
  color: #fff;
  border-radius: 4px;
}

@media (hover: hover) {
  .better-xcloud-quick-settings-bar button:hover {
      background-color: #414141;
      color: white;
  }
}

.better-xcloud-quick-settings-bar button:active {
      background-color: #414141;
      color: white;
  }

.better-xcloud-quick-settings-bar span {
  display: inline-block;
  width: 40px;
  font-weight: bold;
  font-family: Consolas, "Courier New", Courier, monospace;
}


.closeSetting1 {
    color: #0099CC;
    background: transparent;
    border: 2px solid #0099CC;
    border-radius: 6px;
    border: none;
    color: white;
    padding: 3px 13px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    cursor: pointer;
    text-decoration: none;
    text-transform: uppercase;
   }
    .closeSetting2 {
    background-color: white;
    color: black;
    border: 2px solid #008CBA;
    display: block;
    margin: 0 auto;
    margin-top: 5px;
   }
  .closeSetting2:hover {
    background-color: #008CBA;
    color: white;
   }
  .settingsBackgroud{
      position: fixed;
      left: 0;
      top: 0;
      background: #0000;
      width: 100%;
      height: 100%;
              overflow: scroll;
              z-index:8888;
    }
    .settingsBox{
      position: relative;
      background: wheat;
      width: fit-content;
              height: fit-content;
      border-radius: 5px;
      margin: 5% auto;
              padding: 10px;
              font-family: '微软雅黑';
              line-height: 22px;
              top:5%;
              z-index:8889;
    }
         .settingsBoxInputRadio{
              background-color: initial;
              cursor: pointer;
              appearance: auto;
              box-sizing: border-box;
              margin: 3px 3px 0px 5px;
              padding: initial;
              padding-top: initial;
              padding-right: initial;
              padding-bottom: initial;
              padding-left: initial;
              border: initial;
              -webkit-appearance: checkbox;
              accent-color: dodgerblue;
          }

          #StreamHud >div{
      background-color:rgba(255,0,0,0)!important;
      }

      #StreamHud >button{
      background-color:rgba(0,0,0,0)!important;
      }
      #StreamHud >button > div{
      opacity:0.3!important;
      }

      #touchControllerEventArea {
    pointer-events: auto;
    position: fixed;
    bottom: 0;
    right: 0;
    width: 33%;
    height: 6vh;
    z-index: 5678;
    background-color: rgba(0, 0, 0, 0);
    }
.better-xcloud-badges {
    position: absolute;
    margin-left: 0px;
    user-select: none;
    -webkit-user-select: none;
}

.better-xcloud-badge {
    border: none;
    display: inline-block;
    line-height: 24px;
    color: #fff;
    font-family: Bahnschrift Semibold, Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 400;
    margin: 0 8px 8px 0;
    box-shadow: 0px 0px 6px #000;
    border-radius: 4px;
}

.better-xcloud-badge-name {
    background-color: #2d3036;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px 0 0 4px;
    text-transform: uppercase;
}

.better-xcloud-badge-value {
    background-color: grey;
    display: inline-block;
    padding: 2px 8px;
    border-radius: 0 4px 4px 0;
}

.better-xcloud-badge-battery[data-charging=true] span:first-of-type::after {
    content: ' ⚡️';
}

body[data-media-type=tv] .better-xcloud-badges {
    top: calc(var(--streamMenuItemSize) + 30px);
}

body:not([data-media-type=tv]) .better-xcloud-badges {
    top: calc(var(--streamMenuItemSize) + 50px);
}

body:not([data-media-type=tv]) button[class*=MenuItem-module__container] {
    width: 100px !important;
}

body:not([data-media-type=tv]) button[class*=MenuItem-module__container]:nth-child(n+2) {
    margin-left: 10px !important;
}

body:not([data-media-type=tv]) div[class*=MenuItem-module__label] {
    margin-left: 8px !important;
    margin-right: 8px !important;
}
div[class*=Menu-module__scrollable] {
    overflow-x:initial!important;
}

div[class*=StreamMenu-module__menuContainer] {
    height:75%!important;
}

div[class*=Menu-module__scrollable] {
    --bxStreamMenuItemSize: 80px;
    --streamMenuItemSize: calc(var(--bxStreamMenuItemSize) + 35px) !important;
}

.better-xcloud-badges {
    top: calc(var(--streamMenuItemSize) - 30px);
}

body[data-media-type=tv] .better-xcloud-badges {
    top: calc(var(--streamMenuItemSize) - 10px) !important;
}

button[class*=MenuItem-module__container] {
    min-width: auto !important;
    min-height: auto !important;
    width: var(--bxStreamMenuItemSize) !important;
    height: var(--bxStreamMenuItemSize) !important;
}

svg[class*=MenuItem-module__icon] {
    width: 36px;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
}
`;
        if (NFTconfig['disableTouchControls'] == 1) {
            popCss += `
#MultiTouchSurface, #BabylonCanvasContainer-main {
  display: none !important;
}

`};

        let xfbasicStyle = document.createElement('style');
        xfbasicStyle.innerHTML = popCss;
        let docxf = document.head || document.documentElement;
        docxf.appendChild(xfbasicStyle);
        if (NFTconfig['noPopSetting'] == 0) {
            $('body').append(`<div id="popSetting" style="display:block">⚙️Hello </div>`);
            $(document).on('click', '#popSetting', function () {
                naifeitian.showSetting();
            });
        }
        initSettingBox();
        updateVideoPlayerCss();
        StreamStats.render();
        setupVideoSettingsBar();
        initSlideHide();
    }, 2000);

});

let timer;
let mousehidding = false;
$(document).mousemove(function () {
    if (mousehidding) {
        mousehidding = false;
        return;
    }
    if (timer) {
        clearTimeout(timer);
        timer = 0;
    }
    $('html').css({
        cursor: ''
    });
    timer = setTimeout(function () {
        mousehidding = true;
        $('html').css({
            cursor: 'none'
        });
    }, 2000);
});

$(window).on('popstate', function () {
    exitGame();
});

let _pushState = window.history.pushState;
window.history.pushState = function () {
    if (NFTconfig['noPopSetting'] == 0) {
        if (arguments[2].substring(arguments[2].length, arguments[2].length - 5) == '/play') {
            $('#popSetting').css('display', 'block');

        } else {
            $('#popSetting').css('display', 'none');
        }
    }
    exitGame();
    return _pushState.apply(this, arguments);
}

window.onpopstate = function (event) {
    if (event.state) {
        if (window.location.href.slice(-5) == '/play') {
            exitGame();
        }
    }
};


RTCPeerConnection.prototype.orgAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;
RTCPeerConnection.prototype.addIceCandidate = function (...args) {


    const candidate = args[0].candidate;
    if (candidate && candidate.startsWith('a=candidate:1 ')) {
        STREAM_WEBRTC = this;
        StreamBadges.ipv6 = candidate.substring(20).includes(':');
    }

    STREAM_WEBRTC = this;
    return this.orgAddIceCandidate.apply(this, args);
}

function getVideoPlayerFilterStyle() {
    const filters = [];

    const clarity = NFTconfig['VIDEO_CLARITY']['default'];
    if (clarity != 0) {
        const level = 7 - (clarity - 1); // 5,6,7
        const matrix = `0 -1 0 -1 ${level} -1 0 -1 0`;
        document.getElementById('better-xcloud-filter-clarity-matrix').setAttributeNS(null, 'kernelMatrix', matrix);

        filters.push(`url(#better-xcloud-filter-clarity)`);
    }

    const saturation = NFTconfig['VIDEO_SATURATION']['default'];
    if (saturation != 100) {
        filters.push(`saturate(${saturation}%)`);
    }

    const contrast = NFTconfig['VIDEO_CONTRAST']['default'];
    if (contrast != 100) {
        filters.push(`contrast(${contrast}%)`);
    }

    const brightness = NFTconfig['VIDEO_BRIGHTNESS']['default'];
    if (brightness != 100) {
        filters.push(`brightness(${brightness}%)`);
    }

    return filters.join(' ');
}


function updateVideoPlayerCss() {
    let $elm = document.getElementById('better-xcloud-video-css');
    if (!$elm) {
        const CE = createElement;

        $elm = CE('style', { id: 'better-xcloud-video-css' });
        document.documentElement.appendChild($elm);

        // Setup SVG filters
        const $svg = CE('svg', {
            'id': 'better-xcloud-video-filters',
            'xmlns': 'http://www.w3.org/2000/svg',
            'class': 'better-xcloud-gone',
        }, CE('defs', { 'xmlns': 'http://www.w3.org/2000/svg' },
              CE('filter', { 'id': 'better-xcloud-filter-clarity', 'xmlns': 'http://www.w3.org/2000/svg' },
                 CE('feConvolveMatrix', { 'id': 'better-xcloud-filter-clarity-matrix', 'order': '3', 'xmlns': 'http://www.w3.org/2000/svg' }))
             )
                       );
        document.documentElement.appendChild($svg);
    }

    let filters = getVideoPlayerFilterStyle();
    let css = '';
    if (filters) {
        css += `filter: ${filters} !important;`;
    }

    if (NFTconfig['video_stretch'].default == 'fill') {
        css += 'object-fit: fill !important;';
    }

    if (NFTconfig['video_stretch'].default == 'setting') {
        css += `transform: scaleX(` + (NFTconfig['video_stretch_x_y'].x * 1 + 1) + `) scaleY(` + (NFTconfig['video_stretch_x_y'].y * 1 + 1) + `) !important;`;
    }

    if (css) {
        css = `#game-stream video {${css}}`;
    }

    $elm.textContent = css;
}
function injectVideoSettingsButton() {
    const $screen = document.querySelector('#PageContent section[class*=PureScreens]');
    if (!$screen) {
        return;
    }

    if ($screen.xObserving) {
        return;
    }

    $screen.xObserving = true;
    const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
    const $parent = $screen.parentElement;
    const hideQuickBarFunc = e => {
        e.stopPropagation();
        if (e.target != $parent && e.target.id !== 'MultiTouchSurface' && !e.target.querySelector('#BabylonCanvasContainer-main')) {
            return;
        }

        // Hide Quick settings bar
        $quickBar.style.display = 'none';

        $parent.removeEventListener('click', hideQuickBarFunc);
        $parent.removeEventListener('touchstart', hideQuickBarFunc);

        if (e.target.id === 'MultiTouchSurface') {
            e.target.removeEventListener('touchstart', hideQuickBarFunc);
        }
    }
    const observer = new MutationObserver(mutationList => {
        mutationList.forEach(item => {
            if (item.type !== 'childList') {
                return;
            }

            item.addedNodes.forEach(async node => {
                if (!node.className || !node.className.startsWith('StreamMenu')) {
                    return;
                }

                const $orgButton = node.querySelector('div > div > button');
                if (!$orgButton) {
                    return;
                }

                // Create Video Settings button
                const $btnVideoSettings = cloneStreamMenuButton($orgButton, 'Tùy Chỉnh', ICON_VIDEO_SETTINGS);
                $btnVideoSettings.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close HUD
                    $btnCloseHud.click();

                    // Show Quick settings bar
                    $quickBar.style.display = 'flex';

                    $parent.addEventListener('click', hideQuickBarFunc);
                    $parent.addEventListener('touchstart', hideQuickBarFunc);

                    const $touchSurface = document.getElementById('MultiTouchSurface');
                    $touchSurface && $touchSurface.style.display != 'none' && $touchSurface.addEventListener('touchstart', hideQuickBarFunc);
                });
                // Add button at the beginning
                $orgButton.parentElement.insertBefore($btnVideoSettings, $orgButton.parentElement.firstChild);

                // Hide Quick bar when closing HUD
                const $btnCloseHud = document.querySelector('button[class*=StreamMenu-module__backButton]');
                $btnCloseHud.addEventListener('click', e => {
                    $quickBar.style.display = 'none';
                });

                // Create Stream Stats button
                const $btnStreamStats = cloneStreamMenuButton($orgButton, 'Kiểm Tra', ICON_STREAM_STATS);
                $btnStreamStats.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle Stream Stats
                    StreamStats.toggle();
                });

                // Insert after Video Settings button
                $orgButton.parentElement.insertBefore($btnStreamStats, $btnVideoSettings);

                //桥
                const $menu = document.querySelector('div[class*=StreamMenu-module__menuContainer] > div[class*=Menu-module]');
                $menu.appendChild(await StreamBadges.render());

            });
        });
    });
    observer.observe($screen, { subtree: true, childList: true });
}

let transitionComplete = true;
let SildeopenBlock=0;
function patchVideoApi() {

    // Show video player when it's ready
    let showFunc;
    showFunc = function () {

        this.removeEventListener('playing', showFunc);

        if (!this.videoWidth) {
            return;
        }

        onStreamStarted(this);
        STREAM_WEBRTC?.getStats().then(stats => {

            if (NFTconfig['STATS_SHOW_WHEN_PLAYING']['default']) {
                StreamStats.start();
            }
        });
        let chkDom=setInterval(()=>{
            if($('#StreamHud button').length>0){
                clearInterval(chkDom);

                if($('#StreamHud').css('left')=='0px' && NFTconfig['STATS_SLIDE_OPEN']['default']){
                    StreamStats.start();
                }
                if (SildeopenBlock == 0) {
                    SildeopenBlock=1;
                    $(document).on('click', '.'+ $($('#StreamHud button')[$('#StreamHud button').length-1]).attr('class'), function () {
                        transitionComplete=true;
                    });

                    $(document).on('transitionend', '#StreamHud', function () {
                        if(!NFTconfig['STATS_SLIDE_OPEN']['default']){return;}
                        if(!transitionComplete){return;}
                        if($('#StreamHud').css('left')=='0px'){
                            StreamStats.start();
                        }else{
                            StreamStats.stop();
                        }
                        transitionComplete=false;
                    });
                }

                //失去焦点图层处理
                var targetNode = $('#StreamHud').parent()[0];
                var callback = function(mutationsList, observer) {
                    mutationsList.forEach(function(mutation) {
                        if (mutation.addedNodes) {
                            $(mutation.addedNodes).each(function() {
                                if($(this).attr('class') && $(this).attr('class').indexOf('NotFocusedDialog') > -1) {
                                    $(this).css('display', 'none');
                                    $('head').append('<style>.' + $(this).attr('class') + '{ display:none }</style>');
                                    observer.disconnect();
                                }
                            });
                        }
                    });
                };

                var observer = new MutationObserver(callback);

                observer.observe(targetNode, { childList: true });

            }
        },2000);
    }
    HTMLMediaElement.prototype.orgPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
        if (letmeOb && NFTconfig['antiKick'] == 1) {
            const divElement = $('div[data-testid="ui-container"]')[0];
            const observer = new MutationObserver(function (mutations) {
                try {
                    mutations.forEach(function (mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function (addedNode) {
                                let btn = $(addedNode).find('button[data-auto-focus="true"]');
                                if ($(btn).length > 0 && btn.parent().children().length == 1) {
                                    $(btn).click();
                                    throw new Error("巴啦啦能量－呼尼拉－魔仙变身！");
                                }
                            });
                        }
                    });
                } catch (e) { }
            });

            setTimeout(() => {
                observer.observe(divElement, { childList: true, subtree: true });
                console.log('antiKick已部署');
            }, 1000 * 20);
            letmeOb = false;
        }

        this.addEventListener('playing', showFunc);
        injectVideoSettingsButton();
        return this.orgPlay.apply(this);
    };


}

function onStreamStarted($video) {

    StreamBadges.resolution = {width: $video.videoWidth, height: $video.videoHeight};
    StreamBadges.startTimestamp = +new Date;

    // Get battery level
    try {
        navigator.getBattery && navigator.getBattery().then(bm => {
            StreamBadges.startBatteryLevel = Math.round(bm.level * 100);
        });
    } catch(e) {}

    STREAM_WEBRTC.getStats().then(stats => {
        const allVideoCodecs = {};
        let videoCodecId;

        const allAudioCodecs = {};
        let audioCodecId;

        stats.forEach(stat => {
            if (stat.type == 'codec') {
                const mimeType = stat.mimeType.split('/');
                if (mimeType[0] === 'video') {
                    // Store all video stats
                    allVideoCodecs[stat.id] = stat;
                } else if (mimeType[0] === 'audio') {
                    // Store all audio stats
                    allAudioCodecs[stat.id] = stat;
                }
            } else if (stat.type === 'inbound-rtp' && stat.packetsReceived > 0) {
                // Get the codecId of the video/audio track currently being used
                if (stat.kind === 'video') {
                    videoCodecId = stat.codecId;
                } else if (stat.kind === 'audio') {
                    audioCodecId = stat.codecId;
                }
            }
        });

        // Get video codec from codecId
        if (videoCodecId) {
            const videoStat = allVideoCodecs[videoCodecId];
            const video = {
                codec: videoStat.mimeType.substring(6),
            };

            if (video.codec === 'H264') {
                const match = /profile-level-id=([0-9a-f]{6})/.exec(videoStat.sdpFmtpLine);
                video.profile = match ? match[1] : null;
            }

            StreamBadges.video = video;
        }

        // Get audio codec from codecId
        if (audioCodecId) {
            const audioStat = allAudioCodecs[audioCodecId];
            StreamBadges.audio = {
                codec: audioStat.mimeType.substring(6),
                bitrate: audioStat.clockRate,
            }
        }

    });


}
function moveCodecToIndex(array, currentIndex, targetIndex, element) {
    array.splice(currentIndex, 1);
    array.splice(targetIndex, 0, element);
}
function customizeRtcCodecs() {
    const customCodecProfile = NFTconfig['video_quality']['default'];

    if (customCodecProfile === '默认') {
        return;
    }
    if (typeof RTCRtpTransceiver === 'undefined' || !('setCodecPreferences' in RTCRtpTransceiver.prototype)) {
        return false;
    }

    let codecProfilePrefix="";
    let codecProfileLevelId = "";
    let codecMimeType="";
    const codecProfileMap = {"264": {"Cao": "4d","Tạm": "42e","Thấp": "420"}};

    if (customCodecProfile.includes("264")) {
        const codecLevel = Object.keys(codecProfileMap["264"]).find(level => customCodecProfile.includes(level));
        if (codecLevel) {
            codecProfilePrefix = codecProfileMap["264"][codecLevel];
            codecProfileLevelId = `profile-level-id=${codecProfilePrefix}`;
        }
    }else{
        codecMimeType="video/"+customCodecProfile;
    }

    RTCRtpTransceiver.prototype.originalSetCodecPreferences = RTCRtpTransceiver.prototype.setCodecPreferences;
    RTCRtpTransceiver.prototype.setCodecPreferences = function(codecs) {
        const customizedCodecs = codecs.slice();
        let insertionIndex = 0;

        customizedCodecs.forEach((codec, index) => {
            if (codecProfileLevelId !== '' && codec.sdpFmtpLine && codec.sdpFmtpLine.includes(codecProfileLevelId)) {
                moveCodecToIndex(customizedCodecs, index, insertionIndex, codec);
                insertionIndex++;
            } else if (codec.mimeType === codecMimeType) {
                moveCodecToIndex(customizedCodecs, index, insertionIndex, codec);
                insertionIndex++;
            }
        });

        try {
            this.originalSetCodecPreferences.apply(this, [customizedCodecs]);
            console.log("编解码偏好配置成功");
        } catch (error) {
            console.log("无法修改编解码配置，将使用默认设置");
            this.originalSetCodecPreferences.apply(this, [codecs]);
        }
    }
}

customizeRtcCodecs();
patchVideoApi();

let mslogotimeOut = 0;
function mslogoClickevent(mslogoInterval, s) {
    let mslogodom = $($('header>div>div>button')[1]);
    if (mslogodom.length > 0) {
        clearInterval(mslogoInterval);
        mslogodom = mslogodom.next();
        if (mslogodom.text() == ("⚙️ 设置" + nftxboxversion)) { return; }
        mslogodom.removeAttr('href');
        mslogodom.css("color", 'white');
        mslogodom.text("⚙️ 设置" + nftxboxversion);
        mslogodom.click(() => {
            naifeitian.showSetting();
        });
        setTimeout(() => { mslogoClickevent(mslogoInterval) }, 5000);
    }
    mslogotimeOut = mslogotimeOut + 1;
    if (mslogotimeOut > 10) {
        mslogotimeOut = 0;
        clearInterval(mslogoInterval);
    }
}
let mslogoInterval = setInterval(() => {
    mslogoClickevent(mslogoInterval, 3000);
}, 1000);

function bindmslogoevent() {
    let divElement = $('#gamepass-root > div > div');
    if (divElement.length < 1) {
        setTimeout(() => {
            bindmslogoevent();
        }, 2333);
        return;
    }
    divElement = divElement.get(0);
    let mslogodom = $(divElement).children('header').find('a[href]');
    if (mslogodom.length > 1) { mslogodom = $(mslogodom.get(0)); }
    if (mslogodom.text() == ("⚙️ 设置" + nftxboxversion)) { return; }
    mslogodom.removeAttr('href');
    mslogodom.css("color", 'white');
    mslogodom.text("⚙️ 设置" + nftxboxversion);
    mslogodom.click(() => {
        naifeitian.showSetting();
    });
    setTimeout(() => { bindmslogoevent() }, 5000);
}

bindmslogoevent();

if (window.location.pathname.toLocaleLowerCase() == '/zh-cn/play') {
    window.location.href = "https://www.xbox.com/en-us/play";
}

console.log("all done");
})();