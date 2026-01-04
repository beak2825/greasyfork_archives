// ==UserScript==
// @name                 Xbox CLoud Gaming优化整合
// @name:zh-CN           Xbox CLoud Gaming优化整合
// @namespace            http://tampermonkey.net/xbox/nft
// @version              3.10.3.3
// @author               奈非天
// @license              MIT
// @match                https://www.xbox.com/*/*play*
// @run-at               document-start
// @grant                none
// @require              https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.4.1/jquery.min.js
// @description:zh-cn    脚本免费！谨防上当受骗！整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764，3群826510890，4群82737876反馈】
// @description          脚本免费！谨防上当受骗！整合和修改现有脚本，优化项详见脚本说明。【若你有好的想法或者BUG可以进xbox云游戏QQ交流1群531602832，2群313340764，3群826510890,4群82737876反馈】

// @downloadURL https://update.greasyfork.org/scripts/455741/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455741/Xbox%20CLoud%20Gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...

    //★★★★★★★★★★★★★★★★★★★★Reference Project License Agreement Begin 参考项目许可协议开始★★★★★★★★★★★★★★★★★★★★//

    /*  better-xcloud MIT License

        Copyright (c) 2023 redphx

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */

    //★★★★★★★★★★★★★★★★★★★★Reference Project License Agreement End 参考项目许可协议结束★★★★★★★★★★★★★★★★★★★★//


    let nftxboxversion = 'v3.10.3.3';

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
                if (key.fps == undefined) {
                    $control = CE('input', { 'type': 'checkbox' });
                    $control.checked = currentValue;

                    $control.addEventListener('change', e => {
                        key['default'] = e.target.checked;
                        NFTconfig[key['name'].slice(0, -2)]['default'] = e.target.checked;
                        this.setValue(key['name'], key);
                        if (key['name'] == 'STATS_SLIDE_OPENGM' && e.target.checked) {
                            if (this.getValue('STATS_SHOW_WHEN_PLAYINGGM')['default']) {
                                $('#xcloud_setting_STATS_SHOW_WHEN_PLAYINGGM').click();
                            }
                        } else if (key['name'] == 'STATS_SHOW_WHEN_PLAYINGGM' && e.target.checked) {
                            if (this.getValue('STATS_SLIDE_OPENGM')['default']) {
                                $('#xcloud_setting_STATS_SLIDE_OPENGM').click();
                            }
                        }
                        onChange && onChange(e);
                    });
                } else {

                    let stats_info_sortedEntries = Object.entries(NFTconfig['stats_info']).sort((a, b) => a[1][1] - b[1][1]);
                    //流统计信息
                    $control = CE('div', { 'class': 'stats-container' });
                    stats_info_sortedEntries.forEach(entry => {

                        //entry[1][0]     是否选中
                        //entry[1][1]     顺序
                        //entry[1][2]     名字
                        let divElement = document.createElement('div');
                        divElement.className = `drag-handle ${entry[1][0] === true ? 'stats-selected' : 'stats-delete'}`;
                        divElement.draggable = "true";
                        divElement.dataset.name = entry[0];
                        divElement.dataset.index = entry[1][1];
                        divElement.textContent = entry[1][2];

                        let dragIndicator = document.createElement('div');
                        dragIndicator.className = "drag-indicator";
                        divElement.appendChild(dragIndicator);

                        $control.appendChild(divElement);


                    });
                    let placeholder = document.createElement('div');
                    placeholder.className = "placeholder drag-handle";
                    $control.appendChild(placeholder);
                }
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
            if (newval?.options != undefined) {
                newval.options = defaultValue.options;
            }
            naifeitian.setValue(n, newval);
            return newval;
        },
        showSetting() {
            $('#settingsBackgroud').css('display', '');
            $('body').css('overflow', 'hidden');
        },
        hideSetting() {
            $('#settingsBackgroud').css('display', 'none');
            $('body').css('overflow', 'visible');
        },
        patchFunctionBind() {
            const nativeBind = Function.prototype.bind;
            Function.prototype.bind = function () {
                let valid = false;
                if (this.name.length <= 2 && arguments.length === 2 && arguments[0] === null) {
                    if (arguments[1] === 0 || (typeof arguments[1] === 'function')) {
                        valid = true;
                    }
                }

                if (!valid) {
                    return nativeBind.apply(this, arguments);
                }

                if (typeof arguments[1] === 'function') {
                    console.log('还原 Function.prototype.bind()');
                    Function.prototype.bind = nativeBind;
                }

                const orgFunc = this;
                const newFunc = (a, item) => {
                    if (NFTconfig['PATCH_ORDERS'].length === 0) {
                        orgFunc(a, item);
                        return;
                    }

                    naifeitian.patch(item);
                    orgFunc(a, item);
                }

                return nativeBind.apply(newFunc, arguments);
            };
        },
        patch(item) {
            // console.log('patch', '-----');
            let patchName;
            let appliedPatches;

            for (let id in item[1]) {
                if (NFTconfig['PATCH_ORDERS'].length <= 0) {
                    return;
                }

                appliedPatches = [];
                const func = item[1][id];
                let funcStr = func.toString();

                for (let groupIndex = 0; groupIndex < NFTconfig['PATCH_ORDERS'].length; groupIndex++) {
                    const group = NFTconfig['PATCH_ORDERS'][groupIndex];
                    let modified = false;

                    for (let patchIndex = 0; patchIndex < group.length; patchIndex++) {
                        const patchName = group[patchIndex];
                        if (appliedPatches.indexOf(patchName) > -1) {
                            continue;
                        }

                        const patchedFuncStr = naifeitian.handle_remote_patch(patchName, funcStr);
                        if (!patchedFuncStr) {
                            // Only stop if the first patch is failed
                            if (patchIndex === 0) {
                                break;
                            } else {
                                continue;
                            }
                        }

                        modified = true;
                        funcStr = patchedFuncStr;

                        console.log(`应用 "${patchName}" 修补`);
                        appliedPatches.push(patchName);

                        // Remove patch from group
                        group.splice(patchIndex, 1);
                        patchIndex--;
                    }

                    // Apply patched functions
                    if (modified) {
                        item[1][id] = eval(funcStr);
                    }

                    // Remove empty group
                    if (!group.length) {
                        NFTconfig['PATCH_ORDERS'].splice(groupIndex, 1);
                        groupIndex--;
                    }
                }
            }
        },
        handle_remote_patch(name, funcStr) {
            //根据不同的字符串执行不同的方法
            if (name == 'remotePlayConnectMode') {
                const text = 'connectMode:"cloud-connect"';
                if (!funcStr.includes(text)) {
                    return false;
                }

                return funcStr.replace(text, `connectMode:window.BX_REMOTE_PLAY_CONFIG?"xhome-connect":"cloud-connect",remotePlayServerId:(window.BX_REMOTE_PLAY_CONFIG&&window.BX_REMOTE_PLAY_CONFIG.serverId)||''`);

            } else if (name == 'remotePlayDirectConnectUrl') {
                const index = funcStr.indexOf('/direct-connect');
                if (index === -1) {
                    return false;
                }
                return funcStr.replace(funcStr.substring(index - 9, index + 15), 'https://www.xbox.com/play');
            } else if (name == 'remotePlayKeepAlive') {
                if (!funcStr.includes('onServerDisconnectMessage(e){')) {
                    return false;
                }

                funcStr = funcStr.replace('onServerDisconnectMessage(e){', `onServerDisconnectMessage (e) {
                const msg = JSON.parse(e);
                if (msg.reason === 'WarningForBeingIdle') {
                    try {
                        this.sendKeepAlive();
                        return;
                    } catch (ex) {}
                }
            `);
                return funcStr;

            } else if (name == 'EnableStreamGate') {
                const index = funcStr.indexOf(',EnableStreamGate:');
                if (index === -1) {
                    return false;
                }

                // Find the next "},"
                const endIndex = funcStr.indexOf('},', index);

                const newCode = `
EnableStreamGate: false,
PwaPrompt: false,
`;
                funcStr = funcStr.substring(0, endIndex) + ',' + newCode + funcStr.substring(endIndex);
                return funcStr;
            } else if (name == 'remotePlayGuideWorkaround') {
                const text = 'nexusButtonHandler:this.featureGates.EnableClientGuideInStream';
                if (!funcStr.includes(text)) {
                    return false;
                }

                return funcStr.replace(text, `nexusButtonHandler: !window.BX_REMOTE_PLAY_CONFIG && this.featureGates.EnableClientGuideInStream`);

            } else if (name == 'patchStreamHud') {
                const text = 'let{onCollapse';
                if (!funcStr.includes(text)) {
                    return false;
                }

                // 恢复悬浮窗 "..." 按钮
                funcStr = funcStr.replace(text, 'e.guideUI = null;' + text);

                return funcStr;

            } else if (name == "loadingEndingChunks") {
                // Add patches that are only needed when start playing
                const text = 'Symbol("ChatSocketPlugin")';
                if (!funcStr.includes(text)) {
                    return false;
                }

                NFTconfig['PATCH_ORDERS'] = NFTconfig['PATCH_ORDERS'].concat(NFTconfig['PLAYING_PATCH_ORDERS']);

                return funcStr;
            }
        },
        isDivTopOrBottomOutOfBounds(divElement) {
            const $div = $(divElement);
            $div.css("height","")

            // 获取div的边界信息
            const divRect = $div[0].getBoundingClientRect();
            const divTop = divRect.top;
            const divBottom = divRect.bottom;

            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            return (
                divBottom > viewportHeight ||
                divTop < 0
            );
        }

    }
    //★★ 1=开   0=关 ★★//
    let default_language_list = { '智能简繁': 'Auto', '简体': 'zh-CN', '繁体': 'zh-TW' }
    let NFTconfig =
    {
        enableRemotePlay: 0,
        PATCH_ORDERS: [],
        PLAYING_PATCH_ORDERS: [],
        no_need_VPN_play: 1,
        regionBlock: {
            blockIp: '美服',
            options: {
                '韩服': '168.126.63.1',
                '美服': '4.2.2.2',
                '日服': '210.131.113.123'
            }
        },
        chooseLanguage: 1,
        IfErrUsedefaultGameLanguage: 'zh-CN',
        high_bitrate: 1,
        disableCheckNetwork: 1,
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
        rtcCodecPreferences: {
            default: '自动',
            options: [
                '默认',
                '自动'
            ]
        },
        video_stretch_x_y: {
            x: 0,
            y: 0,
            name: 'video_stretch_x_yGM'
        },

        noPopSetting: 0,
        disableTouchControls: 0,
        autoOpenOC: 1,
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
        STATS_SLIDE_OPEN: {
            default: false,
            name: 'STATS_SLIDE_OPENGM'
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
        useCustomfakeIp: 0,
        customfakeIp: '',
        xcloud_game_language: default_language_list['简体'],
        REMOTE_PLAY_RESOLUTION: {
            'default': '1080p',
            'options': {
                '1080p': '1080p',
                '720p': '720p',
            },
            'name': 'REMOTE_PLAY_RESOLUTIONGM'
        },
        REMOTE_SERVER_LIST: ['eau', 'seau', 'brs', 'eus', 'eus2', 'ejp', 'ckr', 'mxc', 'ncus', 'scus', 'uks', 'weu', 'wus', 'wus2'],

        stats_info: {
            fps: [true, 1, "帧率"],
            rtt: [true, 2, "延迟"],
            dt: [true, 3, "解码"],
            br: [true, 4, "码率"],
            pl: [true, 5, "丢包"],
            fl: [true, 6, "丢帧"],
        }
    }

    const integratekeys = Object.keys(NFTconfig);

    integratekeys.forEach(key => {
        NFTconfig[key] = naifeitian.getGM(NFTconfig[key], key + 'GM');
    });

    NFTconfig['PATCH_ORDERS'] = [

        NFTconfig['enableRemotePlay'] == 1 && ['remotePlayKeepAlive'],
        NFTconfig['enableRemotePlay'] == 1 && ['remotePlayDirectConnectUrl'],

    ];
    NFTconfig['PATCH_ORDERS'] = [

        NFTconfig['enableRemotePlay'] == 1 && ['remotePlayConnectMode'],
        NFTconfig['enableRemotePlay'] == 1 && ['remotePlayGuideWorkaround'],

        ['patchStreamHud'],
        ['EnableStreamGate']
    ]


    let regionsMenuItemList = [];
    let languageMenuItemList = [];
    let crturl = "";
    let canShowOC = null;

    let letmeOb = true;
    let checkIpsuc = false;

    let STREAM_WEBRTC;
    const ICON_VIDEO_SETTINGS = '<path d="M16 9.144A6.89 6.89 0 0 0 9.144 16 6.89 6.89 0 0 0 16 22.856 6.89 6.89 0 0 0 22.856 16 6.9 6.9 0 0 0 16 9.144zm0 11.427c-2.507 0-4.571-2.064-4.571-4.571s2.064-4.571 4.571-4.571 4.571 2.064 4.571 4.571-2.064 4.571-4.571 4.571zm15.704-7.541c-.065-.326-.267-.607-.556-.771l-4.26-2.428-.017-4.802c-.001-.335-.15-.652-.405-.868-1.546-1.307-3.325-2.309-5.245-2.953-.306-.103-.641-.073-.923.085L16 3.694l-4.302-2.407c-.282-.158-.618-.189-.924-.086a16.02 16.02 0 0 0-5.239 2.964 1.14 1.14 0 0 0-.403.867L5.109 9.84.848 12.268a1.14 1.14 0 0 0-.555.771 15.22 15.22 0 0 0 0 5.936c.064.326.267.607.555.771l4.261 2.428.017 4.802c.001.335.149.652.403.868 1.546 1.307 3.326 2.309 5.245 2.953.306.103.641.073.923-.085L16 28.306l4.302 2.407a1.13 1.13 0 0 0 .558.143 1.18 1.18 0 0 0 .367-.059c1.917-.648 3.695-1.652 5.239-2.962.255-.216.402-.532.405-.866l.021-4.807 4.261-2.428a1.14 1.14 0 0 0 .555-.771 15.21 15.21 0 0 0-.003-5.931zm-2.143 4.987l-4.082 2.321a1.15 1.15 0 0 0-.429.429l-.258.438a1.13 1.13 0 0 0-.174.601l-.022 4.606a13.71 13.71 0 0 1-3.623 2.043l-4.117-2.295a1.15 1.15 0 0 0-.559-.143h-.546c-.205-.005-.407.045-.586.143l-4.119 2.3a13.74 13.74 0 0 1-3.634-2.033l-.016-4.599a1.14 1.14 0 0 0-.174-.603l-.257-.437c-.102-.182-.249-.333-.429-.437l-4.085-2.328a12.92 12.92 0 0 1 0-4.036l4.074-2.325a1.15 1.15 0 0 0 .429-.429l.258-.438a1.14 1.14 0 0 0 .175-.601l.021-4.606a13.7 13.7 0 0 1 3.625-2.043l4.11 2.295a1.14 1.14 0 0 0 .585.143h.52c.205.005.407-.045.586-.143l4.119-2.3a13.74 13.74 0 0 1 3.634 2.033l.016 4.599a1.14 1.14 0 0 0 .174.603l.257.437c.102.182.249.333.429.438l4.085 2.327a12.88 12.88 0 0 1 .007 4.041h.007z" fill-rule="nonzero"/>';

    //视频调整
    const ICON_HD_VIDEO_SETTINGS = '<g transform="matrix(.142357 0 0 .142357 -2.22021 -2.22164)" fill="none" stroke="#fff" stroke-width="16"><circle cx="128" cy="128" r="40"/><path d="M130.05 206.11h-4L94 224c-12.477-4.197-24.049-10.711-34.11-19.2l-.12-36c-.71-1.12-1.38-2.25-2-3.41L25.9 147.24a99.16 99.16 0 0 1 0-38.46l31.84-18.1c.65-1.15 1.32-2.29 2-3.41l.16-36C69.951 42.757 81.521 36.218 94 32l32 17.89h4L162 32c12.477 4.197 24.049 10.711 34.11 19.2l.12 36c.71 1.12 1.38 2.25 2 3.41l31.85 18.14a99.16 99.16 0 0 1 0 38.46l-31.84 18.1c-.65 1.15-1.32 2.29-2 3.41l-.16 36A104.59 104.59 0 0 1 162 224l-31.95-17.89z"/></g>';

    //流监控
    const ICON_HD_STREAM_STATS = '<g transform="scale(2)" class="ICON_HD_STREAM_STATS_OFF" style="display:block"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"></path><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"></path><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"></path></g><g transform="scale(2)" class="ICON_HD_STREAM_STATS_ON" style="display:none"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></g>';

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

        canShowOC = null;
        setTimeout(RemotePlay.detect, 10);
        document.documentElement.style.overflowY = "";
        StreamStats.hideSettingsUi();
        letmeOb = true;
        StreamStats.stop();
        bindmslogoevent();
        $('.better-xcloud-quick-settings-bar').css("display", "none");
        if (NFTconfig['autoFullScreen'] == 1) {
            exitMachineFullscreen();
        }
        if (NFTconfig['noPopSetting'] == 0) {
            $('#popSetting').css('display', 'block');
        }
    }
    function inGame() {
        if (!IS_REMOTE_PLAYING) {
            let path = window.location.pathname;
            history.pushState({}, null, window.location.pathname.substr(0, window.location.pathname.indexOf("/launch/")));
            history.pushState({}, null, path);
        }
        document.documentElement.style.overflowY = "hidden";

        document.body.style.top = '0px';
        if (NFTconfig['autoFullScreen'] == 1) {
            setMachineFullScreen();
        }
        if (NFTconfig['noPopSetting'] == 0) {
            $('#popSetting').css('display', 'none');
        }
    }
    class StreamBadges {
        static get BADGE_PLAYTIME() { return '游玩时间'; };
        static get BADGE_BATTERY() { return '电量'; };
        static get BADGE_IN() { return '下载'; };
        static get BADGE_OUT() { return '上传'; };

        static get BADGE_SERVER() { return '服务器'; };
        static get BADGE_VIDEO() { return '编解码器'; };
        static get BADGE_AUDIO() { return '音频'; };

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
                return CE('div', { 'style': 'display: block' });
            }

            let $badge;
            if (StreamBadges.#cachedDoms[name]) {
                $badge = StreamBadges.#cachedDoms[name];
                $badge.lastElementChild.textContent = value;
                return $badge;
            }

            $badge = CE('div', { 'class': 'better-xcloud-badge' },
                CE('span', { 'class': 'better-xcloud-badge-name' }, name),
                CE('span', { 'class': 'better-xcloud-badge-value', 'style': `background-color: ${color}` }, value));

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

            // 游玩时间
            let now = +new Date;
            const diffSeconds = Math.ceil((now - StreamBadges.startTimestamp) / 1000);
            const playtime = StreamBadges.#secondsToHm(diffSeconds);

            // 电量
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
                } catch (e) { }
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

            const hDisplay = h > 0 ? `${h}小时` : '';
            const mDisplay = m > 0 ? `${m}分钟` : '';
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

            // 音频
            let audio;
            if (StreamBadges.audio) {
                audio = StreamBadges.audio.codec;
                const bitrate = StreamBadges.audio.bitrate / 1000;
                audio += ` (${bitrate} kHz)`;
            }

            // 电量
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

            const $wrapper = createElement('div', { 'class': 'better-xcloud-badges' });
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

        static status() {
            return StreamStats.#interval != null;
        }

        static start() {
            clearInterval(StreamStats.#interval);

            StreamStats.#$container.classList.remove('better-xcloud-gone');
            StreamStats.#interval = setInterval(StreamStats.update, StreamStats.#updateInterval);
            $('#xcloud_setting_STATS_BUTTON').text("关闭监控");
            $('.ICON_HD_STREAM_STATS_ON').css("display", 'block');
            $('.ICON_HD_STREAM_STATS_OFF').css("display", 'none');

        }


        static stop() {
            clearInterval(StreamStats.#interval);

            StreamStats.#$container.classList.add('better-xcloud-gone');
            StreamStats.#interval = null;
            StreamStats.#lastStat = null;
            $('#xcloud_setting_STATS_BUTTON').text("启动监控");
            $('.ICON_HD_STREAM_STATS_ON').css("display", 'none');
            $('.ICON_HD_STREAM_STATS_OFF').css("display", 'block');
        }

        static toggle() {
            StreamStats.#isHidden() ? StreamStats.start() : StreamStats.stop();
            screenClicktohide();
            if (naifeitian.isDivTopOrBottomOutOfBounds(".better-xcloud-stats-settings")) {
                $(".better-xcloud-stats-settings").css("height", "90%");
            } else {
                $(".better-xcloud-stats-settings").css("height", "");
            }
        }

        static #isHidden = () => StreamStats.#$container.classList.contains('better-xcloud-gone');

        static update() {
            if (StreamStats.#isHidden() || !STREAM_WEBRTC) {
                StreamStats.stop();
                return;
            }

            try {

                STREAM_WEBRTC.getStats().then(stats => {
                    stats.forEach(stat => {
                        let grade = '';
                        if (stat.type === 'inbound-rtp' && stat.kind === 'video') {
                            // FPS
                            $(".stats_fps span").text(stat.framesPerSecond || 0);

                            // Packets Lost
                            const packetsLost = stat.packetsLost;
                            if (packetsLost != undefined) {
                                const packetsReceived = stat.packetsReceived;
                                const packetsLostPercentage = (packetsLost * 100 / ((packetsLost + packetsReceived) || 1)).toFixed(2);
                                $(".stats_pl span").text(`${packetsLost} (${packetsLostPercentage}%)`);
                            } else {
                                $(".stats_pl span").text(`-1 (-1%)`);
                            }

                            // Frames Dropped
                            const framesDropped = stat.framesDropped;
                            if (framesDropped != undefined) {
                                const framesReceived = stat.framesReceived;
                                const framesDroppedPercentage = (framesDropped * 100 / ((framesDropped + framesReceived) || 1)).toFixed(2);
                                $(".stats_fl span").text(`${framesDropped} (${framesDroppedPercentage}%)`);
                            } else {
                                $(".stats_fl span").text(`-1 (-1%)`);
                            }
                            if (StreamStats.#lastStat) {
                                const lastStat = StreamStats.#lastStat;
                                // Bitrate
                                const timeDiff = stat.timestamp - lastStat.timestamp;
                                const bitrate = 8 * (stat.bytesReceived - lastStat.bytesReceived) / timeDiff / 1000;
                                $(".stats_br span").text(`${bitrate.toFixed(2)} Mbps`);

                                // Decode time
                                const totalDecodeTimeDiff = stat.totalDecodeTime - lastStat.totalDecodeTime;
                                const framesDecodedDiff = stat.framesDecoded - lastStat.framesDecoded;
                                const currentDecodeTime = totalDecodeTimeDiff / framesDecodedDiff * 1000;
                                $(".stats_dt span").text(`${currentDecodeTime.toFixed(2)}ms`);

                                if (NFTconfig['STATS_CONDITIONAL_FORMATTING']['default']) {
                                    grade = (currentDecodeTime > 12) ? 'bad' : (currentDecodeTime > 9) ? 'ok' : (currentDecodeTime > 6) ? 'good' : '';
                                }
                                $(".stats_dt span").attr('data-grade', grade);
                            }

                            StreamStats.#lastStat = stat;
                        } else if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
                            // Round Trip Time
                            const roundTripTime = typeof stat.currentRoundTripTime !== 'undefined' ? stat.currentRoundTripTime * 1000 : '???';
                            $(".stats_rtt span").text(`${roundTripTime}ms`);

                            if (NFTconfig['STATS_CONDITIONAL_FORMATTING']['default']) {
                                grade = (roundTripTime > 100) ? 'bad' : (roundTripTime > 75) ? 'ok' : (roundTripTime > 40) ? 'good' : '';
                            }
                            $(".stats_rtt span").attr('data-grade', grade);
                        }
                    });
                });
            } catch (e) { }
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

        static toggleSettingsUi() {
            const display = StreamStats.#$settings.style.display;
            StreamStats.#$settings.style.display = display === 'block' ? 'none' : 'block';
            screenClicktohide();
            if (naifeitian.isDivTopOrBottomOutOfBounds(".better-xcloud-stats-settings")) {
                $(".better-xcloud-stats-settings").css("height", "90%");
            } else {
                $(".better-xcloud-stats-settings").css("height", "");
            }
        }

        static render() {
            if (StreamStats.#$container) {
                return;
            }

            const CE = createElement;
            StreamStats.#$container = CE('div', { 'class': 'better-xcloud-stats-bar better-xcloud-gone' },
                CE('div', { 'class': 'stats_fps' }, CE('label', {}, '帧率'),
                    StreamStats.#$fps = CE('span', {}, 0)),
                CE('div', { 'class': 'stats_rtt' }, CE('label', {}, '延迟'),
                    StreamStats.#$rtt = CE('span', {}, '0ms')),
                CE('div', { 'class': 'stats_dt' }, CE('label', {}, '解码'),
                    StreamStats.#$dt = CE('span', {}, '0ms')),
                CE('div', { 'class': 'stats_br' }, CE('label', {}, '码率'),
                    StreamStats.#$br = CE('span', {}, '0ms')),
                CE('div', { 'class': 'stats_pl' }, CE('label', {}, '丢包'),
                    StreamStats.#$pl = CE('span', {}, '0ms')),
                CE('div', { 'class': 'stats_fl' }, CE('label', {}, '丢帧'),
                    StreamStats.#$fl = CE('span', {}, '0ms')));

            let clicked_count = 0;
            StreamStats.#$container.addEventListener('ontouchstart' in document ? 'touchstart' : 'mousedown', function (e) {
                clicked_count++;
                setTimeout(function () {
                    clicked_count = 0;
                }, 500);

                if (clicked_count > 1) {
                    //双击
                    StreamStats.toggleSettingsUi();
                    clicked_count = 0;
                }
            }, false);

            document.documentElement.appendChild(StreamStats.#$container);

            const refreshFunc = e => {
                StreamStats.#refreshStyles()
            };
            const $position = naifeitian.toElement(NFTconfig['STATS_POSITION'], refreshFunc);

            let $open_button;
            const $showStartup = naifeitian.toElement(NFTconfig['STATS_SHOW_WHEN_PLAYING'], refreshFunc);
            const $transparent = naifeitian.toElement(NFTconfig['STATS_TRANSPARENT'], refreshFunc);
            const $formatting = naifeitian.toElement(NFTconfig['STATS_CONDITIONAL_FORMATTING'], refreshFunc);
            const $opacity = naifeitian.toElement(NFTconfig['STATS_OPACITY'], refreshFunc);
            const $textSize = naifeitian.toElement(NFTconfig['STATS_TEXT_SIZE'], refreshFunc);
            const $slideopen = naifeitian.toElement(NFTconfig['STATS_SLIDE_OPEN'], refreshFunc);
            const $stats_info = naifeitian.toElement(NFTconfig['stats_info'], refreshFunc);
            StreamStats.#$settings = CE('div', { 'class': 'better-xcloud-stats-settings' },
                CE('b', {}, '流监控设置'),
                CE('div', {},
                    CE('label', { 'for': `xcloud_setting_NFTconfig['STATS_SHOW_WHEN_PLAYING']` }, '自启动'),
                    $showStartup
                ),
                CE('div', {},
                    CE('label', {}, '位置'),
                    $position
                ),
                CE('div', {},
                    CE('label', {}, '统计信息'),
                    $stats_info
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
                    CE('label', { 'for': `xcloud_setting_STATS_SLIDE_OPEN` }, '仅悬浮窗展开时打开'),
                    $slideopen
                ),
                $open_button = CE('button', { 'id': 'xcloud_setting_STATS_BUTTON' }, '启动监控'));

            $open_button.addEventListener('click', () => {

                if (StreamStats.status()) {
                    //需关闭
                    StreamStats.stop();

                } else {
                    //需启动
                    StreamStats.start();

                }

            });
            document.documentElement.appendChild(StreamStats.#$settings);

            let stats_info_sortedEntries = Object.entries(NFTconfig['stats_info']).sort((a, b) => a[1][1] - b[1][1]);

            let infos = [];

            stats_info_sortedEntries.forEach(entry => {

                //entry[1][0]     是否选中
                //entry[1][1]     顺序
                //entry[1][2]     名字
                let tempDom = $(".stats_" + entry[0]).clone();

                if (entry[1][0]) {
                    tempDom.css("display", "block");
                } else {
                    tempDom.css("display", "none");
                }
                tempDom.css("border-right", "2px solid #fff");
                infos.push(tempDom);
                $(".stats_" + entry[0]).remove();

            });
            infos.forEach(function (item, index, array) {
                $(".better-xcloud-stats-bar").append(item);
            });
            $('.better-xcloud-stats-bar > *')
                .filter(function () {
                    return $(this).css('display') === 'block';
                })
                .last().css("border-right", '0px');


            //流统计信息事件

            let draggedItemIndex = -1;
            let draggedItem;
            let draggedItemClone; // 声明一个变量来存储被拖拽元素的副本
            let isClick = false;
            let isTouchstart = false;
            let touchTimeout;
            // 当拖拽开始时，添加拖拽中的样式，并设置拖拽数据
            $('.drag-handle').on('dragstart', function (event) {
                draggedItem = $(this);
                draggedItemIndex = draggedItem.index();

            });

            // 当拖拽对象在可放置区域上方移动时触发
            $('.drag-handle').on('dragover', function (event) {
                event.preventDefault();
                $('.drag-handle').removeClass('drag-over');

                $(this).addClass('drag-over');

                var placeholder = $('.placeholder');
                var target = $(this);

                if (event.originalEvent.clientY < target.offset().top + target.outerHeight() / 2) {
                    placeholder.insertBefore(target);
                } else {
                    placeholder.insertAfter(target);
                }
                if (!placeholder.prev().hasClass("dragging") && !placeholder.next().hasClass("dragging")) {
                    placeholder.show();
                }

            });

            // 当拖拽对象离开可放置区域时触发
            $('.drag-handle').on('dragleave', function (event) {
                $(this).removeClass('drag-over');

            });

            // 当拖拽对象被松开触发
            $('.drag-handle').on('dragend', function (event) {

                var droppedIndex = $('.placeholder').index();

                var draggedItem = $('.drag-handle').eq(draggedItemIndex);
                draggedItem.insertBefore($('.placeholder'));

                draggedItem.removeClass('dragging').hide().fadeIn();



                $('.drag-handle').removeClass('drag-over');
                $('.drag-handle').removeClass('dragging');

                $('.placeholder').hide();
                draggedItemClone?.remove(); // 移除被拖拽元素的副本

                let drag_index = 0;
                let infos = [];
                $('.drag-handle').each(function (index, d) {
                    let name = $(d).attr("data-name");
                    if (name != undefined) {
                        drag_index = drag_index + 1;
                        NFTconfig['stats_info'][name][1] = drag_index;
                        $(this).attr("data-index", drag_index);
                        let tempDom = $(".stats_" + name).clone();

                        if (!NFTconfig['stats_info'][name][0]) {
                            //隐藏
                            tempDom.css("display", "none");
                        } else {
                            tempDom.css("display", "block");
                        }
                        tempDom.css("border-right", "2px solid #fff");
                        infos.push(tempDom);
                        $(".stats_" + name).remove();
                    }
                });
                naifeitian.setValue("stats_infoGM", NFTconfig['stats_info']);

                infos.forEach(function (item, index, array) {
                    $(".better-xcloud-stats-bar").append(item);
                });
                $('.better-xcloud-stats-bar > *')
                    .filter(function () {
                        return $(this).css('display') === 'block';
                    })
                    .last().css("border-right", '0px');


            });


            // 添加触摸事件
            $('.drag-handle').on('touchstart', function (event) {
                isTouchstart = true;
                draggedItem = $(this);
                draggedItemIndex = $(this).index();

                touchTimeout = setTimeout(function () {
                    isClick = false;
                    if ($(".dragged-copy-item").length == 0) {
                        // 创建被拖拽元素的副本
                        draggedItemClone = draggedItem.clone().addClass('stats-container dragged-copy-item');
                        $('.better-xcloud-stats-settings').after(draggedItemClone);
                    } else {
                        draggedItemClone = $(".dragged-copy-item");
                    }

                }, 200);
                isClick = true;
            });

            $('.stats-container').on('touchmove', function (event) {
                event.preventDefault();
                if (isClick) { return; }
                draggedItem.addClass("dragging");

                $(".dragged-copy-item").css("display", "block");

                const touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

                var previousElement = $(".better-xcloud-stats-settings");

                // 计算右边界位置
                var rightEdgeOfPrevious = previousElement.offset().left + previousElement.outerWidth() - 100;

                // 更新被拖拽元素的副本位置
                draggedItemClone.css({
                    top: touch.clientY - draggedItemClone.outerHeight() / 2 + 'px',
                    left: rightEdgeOfPrevious + 'px'
                });

                $('.drag-handle').each(function () {
                    if ($(this).hasClass("dragged-copy-item")) { return }
                    const itemOffset = $(this).offset().top;
                    const itemHeight = $(this).outerHeight();
                    if (draggedItem.is($(this))) return true;
                    let placeholder = $('.placeholder');
                    if (touch.clientY > itemOffset && touch.clientY < itemOffset + itemHeight) {
                        $(this).addClass('drag-over');


                        if (touch.clientY < itemOffset + itemHeight / 4) {
                            placeholder.insertBefore($(this));
                        } else {
                            placeholder.insertAfter($(this));
                        }
                        if (!placeholder.prev().hasClass("dragging") && !placeholder.next().hasClass("dragging")) {
                            placeholder.css("display", "block");
                        }

                        return false;
                    } else {
                        $(this).removeClass("drag-over");

                    }
                });
            });

            $('.stats-container').on('touchend', function (event) {
                isTouchstart = false;
                if (isClick) { return; }
                var droppedIndex = $('.placeholder').index();

                var draggedItem = $('.drag-handle').eq(draggedItemIndex);
                draggedItem.insertBefore($('.placeholder'));

                draggedItem.removeClass('dragging').hide().fadeIn();

                $('.drag-handle').removeClass('drag-over');
                $('.drag-handle').removeClass('dragging');

                $('.placeholder').hide();
                draggedItemClone.remove();

                let drag_index = 0;
                let infos = [];
                $('.drag-handle').each(function (index, d) {
                    let name = $(d).attr("data-name");
                    if (name != undefined) {
                        drag_index = drag_index + 1;
                        NFTconfig['stats_info'][name][1] = drag_index;
                        $(this).attr("data-index", drag_index);
                        let tempDom = $(".stats_" + name).clone();
                        if (!NFTconfig['stats_info'][name][0]) {
                            //隐藏
                            tempDom.css("display", "none");
                        } else {
                            tempDom.css("display", "block");
                        }
                        tempDom.css("border-right", "2px solid #fff");
                        infos.push(tempDom);
                        $(".stats_" + name).remove();
                    }
                });
                naifeitian.setValue("stats_infoGM", NFTconfig['stats_info']);

                infos.forEach(function (item, index, array) {
                    $(".better-xcloud-stats-bar").append(item);
                });
                $('.better-xcloud-stats-bar > *')
                    .filter(function () {
                        return $(this).css('display') === 'block';
                    })
                    .last().css("border-right", '0px');
            });

            // 点击事件，选中/取消选中按钮
            $('.drag-handle').on('click', function (event) {
                if (!isClick) {
                    if (isTouchstart) {
                        return;
                    }
                }
                if ($(this).hasClass('stats-selected')) {
                    //取消
                    $(this).removeClass('stats-selected');
                    $(this).addClass('stats-delete');
                    NFTconfig['stats_info'][$(this).attr("data-name")][0] = false;

                } else {
                    //启用
                    $(this).addClass('stats-selected');
                    $(this).removeClass('stats-delete');
                    NFTconfig['stats_info'][$(this).attr("data-name")][0] = true;
                }
                naifeitian.setValue("stats_infoGM", NFTconfig['stats_info']);

                let stats_info_sortedEntries = Object.entries(NFTconfig['stats_info']).sort((a, b) => a[1][1] - b[1][1]);

                stats_info_sortedEntries.forEach(entry => {
                    //entry[1][0]     是否选中
                    //entry[1][1]     顺序
                    //entry[1][2]     名字
                    if (entry[1][0]) {
                        $(".stats_" + entry[0]).css("display", "block");
                    } else {
                        $(".stats_" + entry[0]).css("display", "none");
                    }
                    $(".stats_" + entry[0]).css("border-right", "2px solid #fff");
                })
                $('.better-xcloud-stats-bar > *')
                    .filter(function () {
                        return $(this).css('display') === 'block';
                    })
                    .last().css("border-right", '0px');

            });

            StreamStats.#refreshStyles();
        }
    }
    function numberPicker(key, suffix = '', disabled = false, range = true) {

        const setting = key.name;
        let value = key.default;
        let $text, $decBtn, $incBtn, $range;

        const MIN = key.min;
        const MAX = key.max;

        const CE = createElement;
        const $wrapper = CE('div', {},
            $decBtn = CE('button', { 'data-type': 'dec' }, '-'),
            $text = CE('span', {}, value + suffix),
            $incBtn = CE('button', { 'data-type': 'inc' }, '+'),
        );
        if (range) {
            $range = CE('input', { 'type': 'range', 'style': "width:100px", 'min': 0, 'max': 150, 'value': value });
            $range.addEventListener('input', e => {
                value = parseInt(e.target.value);

                $text.textContent = value + "%";

                key['default'] = value;

                naifeitian.setValue(key['name'], key);

                updateVideoPlayerCss();


            });
            $wrapper.appendChild($range);

        }
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
            $($range).val(value);
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
                CE('label', { 'for': 'better-xcloud-quick-setting-stretch' }, '去黑边'),
                $stretch),
            CE('div', {},
                CE('label', {}, '清晰'),
                numberPicker(NFTconfig['VIDEO_CLARITY'], '', naifeitian.isSafari(), false)),
            CE('div', {},
                CE('label', {}, '饱和'),
                numberPicker(NFTconfig['VIDEO_SATURATION'], '%')),
            CE('div', {},
                CE('label', {}, '对比'),
                numberPicker(NFTconfig['VIDEO_CONTRAST'], '%')),
            CE('div', {},
                CE('label', {}, '亮度'),
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
    function cloneStreamHudButton($orgButton, class_, label, svg_icon) {
        const $container = $orgButton.cloneNode(true);
        if (class_ != "") {
            $($container).addClass(class_);
        }


        const $button = $container.querySelector('button');
        $button.setAttribute('title', label);

        const $svg = $button.querySelector('svg');
        $svg.innerHTML = svg_icon;

        const attrs = {
            'fill-rule': 'evenodd',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': 2,
            'viewBox': '0 0 32 32'
        };

        for (const attr in attrs) {
            $svg.setAttribute(attr, attrs[attr]);
        }

        return $container;
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

    let userAgentOriginal = window.navigator.userAgent;
    try {
        HookProperty(window.navigator, "userAgent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/999.0.0.0 Safari/537.36 Edg/999.0.0.0");
        HookProperty(window.navigator, "maxTouchPoints", 10);
        if (NFTconfig['disableCheckNetwork'] == 1) {
            Object.defineProperty(window.navigator, 'connection', {
                get: () => undefined,
            });
        }
        HookProperty(window.navigator, "standalone", true);

    } catch (e) { }
    let consoleIp;
    let consolePort;
    const patchIceCandidates = function (...arg) {
        // ICE server candidates
        const request = arg[0];
        const url = (typeof request === 'string') ? request : request.url;

        if (url && url.endsWith('/ice') && url.includes('/sessions/') && request.method === 'GET') {
            const promise = originFetch(...arg);

            return promise.then(response => {
                return response.clone().text().then(text => {
                    if (!text.length) {
                        return response;
                    }

                    const options = {
                        preferIpv6Server: NFTconfig['IPv6'] == 1,
                        consoleIp: consoleIp,
                    };

                    const obj = JSON.parse(text);
                    let exchangeResponse = JSON.parse(obj.exchangeResponse);
                    exchangeResponse = updateIceCandidates(exchangeResponse, options)
                    obj.exchangeResponse = JSON.stringify(exchangeResponse);

                    response.json = () => Promise.resolve(obj);
                    response.text = () => Promise.resolve(JSON.stringify(obj));

                    return response;
                });
            });
        }

        return null;
    }
    const originFetch = window.fetch;
    window.fetch = async (...arg) => {
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

        // 串流
        if (IS_REMOTE_PLAYING && url.includes('/sessions/home') || url.includes('inputconfigs')) {

            canShowOC = true;
            const clone = arg0.clone();

            const headers = {};
            for (const pair of clone.headers.entries()) {
                headers[pair[0]] = pair[1];
            }
            headers['authorization'] = `Bearer ${RemotePlay.XHOME_TOKEN}`;

            const deviceInfo = RemotePlay.BASE_DEVICE_INFO;
            if (NFTconfig['REMOTE_PLAY_RESOLUTION']['default'] == '720p') {
                deviceInfo.dev.os.name = 'android';
            }

            headers['x-ms-device-info'] = JSON.stringify(deviceInfo);

            const opts = {
                method: clone.method,
                headers: headers,
            };

            if (clone.method === 'POST') {
                opts.body = await clone.text();
            }

            const index = arg0.url.indexOf('.xboxlive.com');
            let newUrl = `https://${REMOTE_PLAY_SERVER}.core.gssv-play-prodxhome` + arg0.url.substring(index);

            arg0 = new Request(newUrl, opts);

            arg[0] = arg0;
            url = (typeof request === 'string') ? arg0 : arg0.url;
            // Get console IP
            if (url.includes('/configuration')) {
                const promise = originFetch(...arg);

                return promise.then(response => {
                    return response.clone().json().then(obj => {
                        console.log(obj);
                        consoleIp = obj.serverDetails.ipAddress;
                        consolePort = obj.serverDetails.port;

                        response.json = () => Promise.resolve(obj);

                        return response;
                    });
                });
            }
            if (url.includes('/sessions/home/play')) {
                inGame();
                document.title = document.title.replace('Fortnite', '串流');
            }

            return patchIceCandidates(...arg) || originFetch(...arg);

        }
        if (IS_REMOTE_PLAYING && url.includes('/login/user')) {
            try {
                const clone = arg0.clone();

                const obj = await clone.json();
                obj.offeringId = 'xhome';

                arg0 = new Request('https://xhome.core.gssv-play-prod.xboxlive.com/v2/login/user', {
                    method: 'POST',
                    body: JSON.stringify(obj),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                arg[0] = arg0;
            } catch (e) {
                alert(e);
                console.log(e);
            }

            return originFetch(...arg);
        }
        // ICE server candidates
        const patchedIpv6 = patchIceCandidates(...arg);
        if (patchedIpv6) {
            return patchedIpv6;
        }
        if (!url.includes('xhome.') && url.indexOf('/v2/login/user') > -1) {//xgpuweb.gssv-play-prod.xboxlive.com
            checkIpsuc = true;


            let json = await arg0.json();
            let body = JSON.stringify(json);
            // 处理免代理逻辑
            if (NFTconfig['no_need_VPN_play'] == 1) {

                if (NFTconfig['useCustomfakeIp'] == 1 && naifeitian.isValidIP(NFTconfig['customfakeIp'])) {
                    arg0.headers.set('x-forwarded-for', NFTconfig['customfakeIp']);
                } else {
                    arg0.headers.set('x-forwarded-for', NFTconfig['regionBlock']['options'][NFTconfig['regionBlock']['blockIp']]);
                }
            }

            arg[0] = new Request(url, {
                method: arg0.method,
                headers: arg0.headers,
                body: body,
            });

            const promise = originFetch(...arg);
            if (NFTconfig['useCustomfakeIp'] == 1 && naifeitian.isValidIP(NFTconfig['customfakeIp'])) {
                console.log('免代理成功，已设置为自定义IP【' + NFTconfig['customfakeIp'] + "】");
            } else {
                console.log('免代理成功，已设置为【' + NFTconfig['regionBlock']['blockIp'] + "】");
            }
            RemotePlay.preload();
            return promise.then(response => {
                return response.clone().json().then(json => {
                    //获取服务器列表
                    let newServerList = [];
                    let currentAutoServer;
                    let REMOTE_SERVER_LIST = [];
                    json["offeringSettings"]["regions"].forEach((region) => {
                        REMOTE_SERVER_LIST.push(region.networkTestHostname.split(".")[0]);
                        newServerList.push(region["name"]);
                        if (region["isDefault"] === true) {
                            currentAutoServer = region["name"];
                        }
                    });
                    NFTconfig['REMOTE_SERVER_LIST'] = REMOTE_SERVER_LIST;
                    naifeitian.setValue("REMOTE_SERVER_LISTGM", REMOTE_SERVER_LIST);
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
                            if (region.isDefault) {
                                StreamBadges.region = region.name;
                                throw new Error();
                            }
                        });

                    } catch (e) { }

                    response.json = () => Promise.resolve(json);
                    return response;
                });
            });
        } else if (url.indexOf('/cloud/play') > -1) {

            inGame();
            const clone = arg0.clone();
            const body = await clone.json();
            if (NFTconfig['chooseLanguage'] == 1) {
                let selectedLanguage = NFTconfig['xcloud_game_language'];
                if (selectedLanguage == 'Auto') {
                    let parts = window.location.pathname.split('/');
                    let pid = parts[parts.length - 1];
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
                            console.log("使用次选语言");
                        }

                    } catch (e) {
                    }
                }
                console.log('语言已设置：【' + selectedLanguage + '】');
                body.settings.locale = selectedLanguage;
            }
            body.settings.osName = NFTconfig['high_bitrate'] == 1 ? 'windows' : 'android';

            const newRequest = new Request(arg0, {
                body: JSON.stringify(body),
            });

            arg[0] = newRequest;
            return originFetch(...arg);


        } else if (url.endsWith('/configuration') && url.includes('/sessions/cloud/') && NFTconfig['autoOpenOC'] == 1 && NFTconfig['disableTouchControls'] == 0) {
            // Enable CustomTouchOverlay

            return new Promise((resolve, reject) => {
                originFetch(...arg).then(res => {
                    res.json().then(json => {
                        // console.error(json);
                        let inputOverrides = JSON.parse(json.clientStreamingConfigOverrides || '{}') || {};
                        inputOverrides.inputConfiguration = {
                            enableTouchInput: true,
                            maxTouchPoints: 10,
                            enableVibration: true
                        };
                        json.clientStreamingConfigOverrides = JSON.stringify(inputOverrides);
                        let cdom = $('#BabylonCanvasContainer-main').children();
                        if (cdom.length > 0) {
                            canShowOC = false;
                        } else {
                            canShowOC = true;
                        }
                        let body = JSON.stringify(json);
                        let newRes = new Response(body, {
                            status: res.status,
                            statusText: res.statusText,
                            headers: res.headers
                        })
                        resolve(newRes);

                        console.log('修改触摸成功')
                    }).catch(err => {
                        reject(err);
                    });
                }).catch(err => {
                    reject(err);
                });
            });
        } else {
            return originFetch(...arg);
        }
    }
    function updateIceCandidates(candidates, options) {
        const pattern = new RegExp(/a=candidate:(?<foundation>\d+) (?<component>\d+) UDP (?<priority>\d+) (?<ip>[^\s]+) (?<the_rest>.*)/);

        const lst = [];
        for (let item of candidates) {
            if (item.candidate == 'a=end-of-candidates') {
                continue;
            }

            const groups = pattern.exec(item.candidate).groups;
            lst.push(groups);
        }

        if (options.preferIpv6Server) {
            lst.sort((a, b) => (!a.ip.includes(':') && b.ip.includes(':')) ? 1 : -1);
        }

        const newCandidates = [];
        let foundation = 1;
        lst.forEach(item => {
            item.foundation = foundation;
            item.priority = (foundation == 1) ? 10000 : 1;

            newCandidates.push({
                'candidate': `a=candidate:${item.foundation} 1 UDP ${item.priority} ${item.ip} ${item.the_rest}`,
                'messageType': 'iceCandidate',
                'sdpMLineIndex': '0',
                'sdpMid': '0',
            });

            ++foundation;
        });

        if (options.consoleIp) {
            newCandidates.push({
                'candidate': `a=candidate:${newCandidates.length + 1} 1 UDP 1 ${options.consoleIp} 9002 typ host`,
                'messageType': 'iceCandidate',
                'sdpMLineIndex': '0',
                'sdpMid': '0',
            });
        }

        newCandidates.push({
            'candidate': 'a=end-of-candidates',
            'messageType': 'iceCandidate',
            'sdpMLineIndex': '0',
            'sdpMid': '0',
        });

        return newCandidates;
    }
    function checkCodec() {

        let rtcCodecPreferences = naifeitian.getValue('rtcCodecPreferencesGM');
        let codecs = RTCRtpReceiver.getCapabilities('video').codecs;
        let codesOptions = ['默认', '自动'];
        const codecProfileMap = { "高": "4d", "中": "42e", "低": "420" };
        codecs.forEach((codec, index) => {
            if (codec.mimeType === 'video/H264') {
                for (let key in codecProfileMap) {
                    if (codec.sdpFmtpLine.includes(codecProfileMap[key])) {
                        codesOptions.push(codec.mimeType.substring(6) + key);
                        break;
                    }
                }
            } else {
                codesOptions.push(codec.mimeType.substring(6));
            }
        });

        codesOptions = [...new Set(codesOptions)];

        let sortOrder = ['默认', '自动', 'AV1', 'VP9', 'H265', 'VP8', 'H264高', 'H264中', 'H264低', 'flexfec-03', 'ulpfec', 'rtx', 'red'];
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
        rtcCodecPreferences['options'] = codesOptions;

        if (!rtcCodecPreferences['options'].includes(rtcCodecPreferences['default'])) {
            rtcCodecPreferences['default'] = "默认";
        }
        NFTconfig['rtcCodecPreferences'] = rtcCodecPreferences;
        naifeitian.setValue('rtcCodecPreferencesGM', rtcCodecPreferences);
    }
    checkCodec();



    if (NFTconfig['autoOpenOC'] == 1 && NFTconfig['disableTouchControls'] == 0 && NFTconfig['autoShowTouch']) {
        window.RTCPeerConnection.prototype.originalCreateDataChannelGTC = window.RTCPeerConnection.prototype.createDataChannel;
        window.RTCPeerConnection.prototype.createDataChannel = function (...params) {

            const dc = this.originalCreateDataChannelGTC.apply(this, arguments);
            if (dc.label == "message") {
                dc.addEventListener('open', e => {
                    setTimeout(() => {
                        if (canShowOC) {
                            dc.dispatchEvent(new MessageEvent('message', {
                                data: '{"content":"{\\"layoutId\\":\\"\\"}","target":"/streaming/touchcontrols/showlayoutv2","type":"Message"}'
                            }));
                        }
                    }, 1000);
                });
                dc.addEventListener("message", function (de) {
                    if (typeof (de.data) != "string") { return; }
                    let msgdata = JSON.parse(de.data);
                    if (msgdata.target == "/streaming/touchcontrols/showtitledefault") {
                        let chkItv = setInterval(() => {
                            if (canShowOC == null) { return; }
                            clearInterval(chkItv);
                            if (canShowOC) {
                                dc.dispatchEvent(new MessageEvent('message', {
                                    data: '{"content":"{\\"layoutId\\":\\"\\"}","target":"/streaming/touchcontrols/showlayoutv2","type":"Message"}'
                                }));
                            }

                        }, 1000);
                    }
                });
            }
            return dc;

        }

    }

    // 配置对象，定义每个设置项的信息
    const settingsConfig = [
        {
            label: '选择语言：',
            type: 'radio',
            name: 'chooseLanguage',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'chooseLanguageOn' },
                { value: 0, text: '关', id: 'chooseLanguageOff' }
            ],
            checkedValue: NFTconfig['chooseLanguage'],
            needHr: false
        },
        {
            label: '首选语言：',
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
            label: '次选语言：',
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
            label: '免代理直连：',
            type: 'radio',
            name: 'noNeedVpn',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'noNeedVpnOn' },
                { value: 0, text: '关', id: 'noNeedVpnOff' },
            ],
            checkedValue: NFTconfig['no_need_VPN_play'],
            needHr: false
        },
        {
            label: '选服：',
            type: 'radio',
            name: 'selectRegion',
            display: NFTconfig['no_need_VPN_play'] === 1 ? 'block' : 'none',
            options: Object.keys(NFTconfig['regionBlock']['options']).map(region => {
                return {
                    value: NFTconfig['regionBlock']['options'][region],
                    text: region,
                    id: NFTconfig['regionBlock']['options'][region]
                };
            }),
            checkedValue: NFTconfig['regionBlock']['options'][NFTconfig['regionBlock']['blockIp']],
            needHr: false
        },
        {
            label: '自定义IP：',
            type: 'radio',
            name: 'customfakeIpInput',
            display: NFTconfig['no_need_VPN_play'] === 1 ? 'block' : 'none',
            value: NFTconfig['useCustomfakeIp'],
            needHr: true,
            moreDom: `<input type="radio" class="selectRegionListener settingsBoxInputRadio" style="outline:none;"
        name='selectRegion' id="customfakeIp" value="customfakeIp" ${NFTconfig['useCustomfakeIp'] == 1 ? 'checked' : ''}>
        <label for="customfakeIp" style="padding-right: 7px;">自定义IP：</label>
        <input type='text' style="display: ` + (NFTconfig['useCustomfakeIp'] == 1 ? 'inline' : 'none')
                + `;outline: none;width: 125px;" id="customfakeIpInput" class="customfakeIpListener" value="${NFTconfig['customfakeIp']}" placeholder="请输入IP"/>`

        },
        {
            label: '分辨率：',
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
            label: '浏览器编解码偏好：',
            showLable: true,
            type: 'dropdown',
            name: 'rtcCodecPreferences',
            display: "block",
            options: NFTconfig['rtcCodecPreferences']['options'],
            selectedValue: NFTconfig['rtcCodecPreferences']['default'],
            needHr: true
        },
        {
            label: '禁止检测网络状况：',
            type: 'radio',
            name: 'disableCheckNetwork',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'disableCheckNetworkOn' },
                { value: 0, text: '关', id: 'disableCheckNetworkOff' }
            ],
            checkedValue: NFTconfig['disableCheckNetwork'],
            needHr: true
        },
        {
            label: '强制触控：',
            type: 'radio',
            name: 'autoOpenOC',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'autoOpenOCOn' },
                { value: 0, text: '关', id: 'autoOpenOCOff' }
            ],
            checkedValue: NFTconfig['autoOpenOC'],
            needHr: true,
            moreDom: `<div id="autoShowTouchDom" style="padding-right: 0px;display: ${NFTconfig['autoOpenOC'] == 1 ? 'inline' : 'none'}">
        <input type="checkbox" class="autoShowTouchListener settingsBoxInputRadio" style="outline:none;cursor: pointer;" name='autoShowTouch'
        id="autoShowTouch" ${NFTconfig['autoShowTouch'] == true ? 'checked' : ''}><label for="autoShowTouch" style="cursor: pointer;">自动弹出</label></div>`
        },
        {
            label: '屏蔽触控：',
            type: 'radio',
            name: 'disableTouchControls',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'disableTouchControlsOn' },
                { value: 0, text: '关', id: 'disableTouchControlsOff' },
            ],
            checkedValue: NFTconfig['disableTouchControls'],
            needHr: true
        },
        {
            label: '自动全屏：',
            type: 'radio',
            name: 'autoFullScreen',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'autoFullScreenOn' },
                { value: 0, text: '关', id: 'autoFullScreenOff' }
            ],
            checkedValue: NFTconfig['autoFullScreen'],
            needHr: true
        },
        {
            label: '优先IPv6：',
            type: 'radio',
            name: 'IPv6server',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'IPv6On' },
                { value: 0, text: '关', id: 'IPv6Off' }
            ],
            checkedValue: NFTconfig['IPv6'],
            needHr: true
        }
        ,
        {
            label: '物理服务器：',
            type: 'radio',
            name: 'blockXcloudServer',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'blockXcloudServerOn' },
                { value: 0, text: '关', id: 'blockXcloudServerOff' }
            ],
            checkedValue: NFTconfig['blockXcloudServer'],
            needHr: false
        },
        {
            label: '选择服务器：',
            type: 'dropdown',
            name: 'defaultXcloudServer',
            display: NFTconfig['blockXcloudServer'] === 1 ? "block" : "none",
            options: NFTconfig['blockXcloudServerList'],
            selectedValue: NFTconfig['defaultXcloudServer'],
            needHr: true

        },
        {
            label: '挂机防踢：',
            type: 'radio',
            name: 'antiKick',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'antiKickOn' },
                { value: 0, text: '关', id: 'antiKickOff' }
            ],
            checkedValue: NFTconfig['antiKick'],
            needHr: true

        },
        {
            label: '设置悬浮窗：',
            type: 'radio',
            name: 'noPopSetting',
            display: 'block',
            options: [
                { value: 0, text: '显示', id: 'noPopSettingOff' },
                { value: 1, text: '隐藏', id: 'noPopSettingOn' }
            ],
            checkedValue: NFTconfig['noPopSetting'],
            needHr: true
        },
        {
            label: '开启串流功能：',
            type: 'radio',
            name: 'enableRemotePlay',
            display: 'block',
            options: [
                { value: 1, text: '开', id: 'enableRemotePlayOn' },
                { value: 0, text: '关', id: 'enableRemotePlayOff' }
            ],
            checkedValue: NFTconfig['enableRemotePlay'],
            needHr: true
        }


    ];

    // 函数用于生成单个设置项的HTML
    function generateSettingElement(setting) {
        let settingHTML = `<lable style="display:${setting.display};white-space: nowrap;margin-bottom:0.375rem;" class="${setting.name + 'Dom'}">`;
        if (setting.type === 'radio') {
            if (setting.options != undefined) {
                settingHTML += `<label style="display:block;text-align:left;"><div style="display: inline;">${setting.label}</div>`;
                setting.options.forEach(option => {
                    if (option == null) { return; }

                    settingHTML += `
                <label style="cursor: pointer;"><input type="radio" class="${setting.name + 'Listener'} settingsBoxInputRadio" style="outline:none;" name="${setting.name}"
                id="${option.id}" value="${option.value}" ${option.value === setting.checkedValue ? 'checked' : ''}>${option.text}</label>
            `;
                });
            }
            if (setting.moreDom != undefined) {
                settingHTML += setting.moreDom;
            }
            settingHTML += '</label>';
        } else if (setting.type === 'text') {
            settingHTML += `<label style="display: block;text-align:left;"><div style="display: inline;">${setting.label}</div>`;
            settingHTML += `
            <input type="text" style="display: inline;outline: none;width: 125px;" id="${setting.name}" class="${setting.name}Listener" value="${setting.value}" placeholder="请输入${setting.label}"/>
        `;
            settingHTML += `</label>`;
        } else if (setting.type === 'dropdown') {
            if (setting.showLable == true) {
                settingHTML += `<label style="display: block;text-align:left;${setting.css}"><div style="display: inline;">${setting.label}</div>`;
            }
            if (setting.options.length == undefined) {
                setting.options = Object.keys(setting.options);
            }
            settingHTML += `
            <select style="outline: none;margin-bottom:5px;" class="${setting.name + 'Listener'}">
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
            <div class="settingsBox"><span class="blink-text" onclick="window.location.href='https://greasyfork.org/zh-CN/scripts/455741';">更新咯~</span>
    `;
        settingsConfig.forEach(setting => {
            settingsHTML += generateSettingElement(setting);
        });

        settingsHTML += `
                <button class="closeSetting1 closeSetting2" style="outline: none;">关闭</button>                
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

        //开启串流
        $(document).on('click', '.enableRemotePlayListener', function () {
            needrefresh = 1;
            naifeitian.setValue('enableRemotePlayGM', $(this).val());
            $('.closeSetting1').text('确定');
        });
        //设置悬浮窗
        $(document).on('click', '.noPopSettingListener', function () {
            naifeitian.setValue('noPopSettingGM', $(this).val());
            needrefresh = 1;
            $('.closeSetting1').text('确定');
        });
        //挂机防踢
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
        //浏览器编解码偏好
        $(document).on('change', '.rtcCodecPreferencesListener', function () {
            NFTconfig['rtcCodecPreferences']['default'] = $(this).val();
            naifeitian.setValue('rtcCodecPreferencesGM', NFTconfig['rtcCodecPreferences']);
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
                NFTconfig['regionBlock']['blockIp'] = Object.keys(NFTconfig['regionBlock']['options']).find(key => NFTconfig['regionBlock']['options'][key] === $(this).val());
                naifeitian.setValue('regionBlockGM', NFTconfig['regionBlock']);
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
    //手势显隐触控
    function initSlideHide() {
        var gestureArea = $("<div></div>");
        gestureArea.attr("id", "touchControllerEventArea");
        $(document.documentElement).append(gestureArea);

        gestureArea = $("#touchControllerEventArea");
        let startX, startY, endX, endY;
        let threshold = 60; // 手势滑动的阈值
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
                        $('#BabylonCanvasContainer-main').css('display', 'none');
                        $('#MultiTouchSurface').css('display', 'none');
                        e.preventDefault();
                    } else {
                        // 右滑
                        $('#BabylonCanvasContainer-main').css('display', 'block');
                        $('#MultiTouchSurface').css('display', 'block');
                        e.preventDefault();
                    }
                }
            }
        });

    }

    async function checkUPD() {
        try {
            const response = await fetch("https://greasyfork.org/zh-CN/scripts/455741-xbox-cloud-gaming%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88/versions");
            const data = await response.text();

            let historyVersion = $(data).find('.history_versions')[0];
            let hli = $($(historyVersion).find('li .version-number > a')[0]);
            let version = hli.text();
            if (nftxboxversion != version) {
                $('head').append('<style>.blink-text{ display:block!important }</style>');
            }
        } catch (error) {
            //console.error('Fetch error:', error);
        }
    }

    $(document).ready(function () {
        //检测Thank you for your interest
        let checkTYFYIInterval = setInterval(() => {
            if (checkIpsuc) {
                clearInterval(checkTYFYIInterval);
                return;
            }
            var title = $("[class*='UnsupportedMarketPage-module__title']");
            if (title.length > 0) {
                console.log("脚本检测到免代理没有成功，自动刷新中");
                title.text("脚本检测到免代理没有成功，自动刷新中");
                history.go(0);
                clearInterval(checkTYFYIInterval);
            }

        }, 5000);

        setTimeout(function () {

            if (NFTconfig['noPopSetting'] == 0) {
                $('body').append(`<div id="popSetting" style="display:block">⚙️ 设置</div>`);
                $(document).on('click', '#popSetting', function () {
                    naifeitian.showSetting();
                });
            }
            checkUPD();
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


    let _pushState = window.history.pushState;
    window.history.pushState = function () {

        setTimeout(RemotePlay.detect, 10);
        if (NFTconfig['noPopSetting'] == 0) {
            if (arguments[2].substring(arguments[2].length, arguments[2].length - 5) == '/play') {
                exitGame();
            } else {
                $('#popSetting').css('display', 'none');
            }
        }
        if (arguments[2].indexOf("/play/games/") > -1) {
            let timeout = 0;
            let checkPlayInterval = setInterval(() => {
                var playButtons = $("[class*='PlayButton-module__playButton'][disabled]");
                if (playButtons.length > 0) {
                    playButtons.text("该游戏无法在" + [NFTconfig['regionBlock']['blockIp']] + "游玩，请使用脚本切换其他服尝试");
                    clearInterval(checkPlayInterval);

                }
                if (timeout == 10) {
                    clearInterval(checkPlayInterval);
                }
                timeout++;

            }, 1333);
        }

        if ((!arguments[2].includes("/play/launch/") && !arguments[2].includes('/remote-play'))) {
            exitGame();
        }
        if(arguments[2].includes("/play/launch/")){
            $($("div[class^='StreamGateDialog-module__scrollable']")[0]).css("display","none");
        }

        if (arguments[2].includes("/https")) {
            if (window.location.href.includes("/remote-play")) {
                exitGame();
            }
            setTimeout(() => { history.go(-1) }, 10);
            return;
        }
        if (arguments[2].includes("/dev-tools/direct-connect")) {
            exitGame();
            setTimeout(() => { history.go(-1) }, 10);
            return
        }

        return _pushState.apply(this, arguments);
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
    function screenClicktohide() {
        const $screen = document.querySelector('#PageContent section[class*=PureScreens]');
        const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
        const $parent = $screen.parentElement;
        const hideQuickBarFunc = e => {
            e.stopPropagation();
            if (e.target != $parent && e.target.id !== 'MultiTouchSurface' && !e.target.querySelector('#BabylonCanvasContainer-main')) {
                return;
            }

            // Hide Quick settings bar
            $quickBar.style.display = 'none';
            $('.better-xcloud-stats-settings').css("display", "none");

            $parent.removeEventListener('click', hideQuickBarFunc);
            $parent.removeEventListener('touchstart', hideQuickBarFunc);

            if (e.target.id === 'MultiTouchSurface') {
                e.target.removeEventListener('touchstart', hideQuickBarFunc);
            }
        }
        $parent.addEventListener('click', hideQuickBarFunc);
        $parent.addEventListener('touchstart', hideQuickBarFunc);

    }
    //插入按钮
    function injectVideoSettingsButton() {
        const $screen = document.querySelector('#PageContent section[class*=PureScreens]');
        if (!$screen) {
            return;
        }

        if ($screen.xObserving) {
            return;
        }

        $screen.xObserving = true;
        const $parent = $screen.parentElement;
        const $quickBar = document.querySelector('.better-xcloud-quick-settings-bar');
        screenClicktohide();
        let $btnStreamStats;
        let $btnVideoSettings_HD;
        const observer = new MutationObserver(mutationList => {
            mutationList.forEach(item => {
                if (item.type !== 'childList') {
                    return;
                }

                item.addedNodes.forEach(async node => {

                    if (IS_REMOTE_PLAYING) {
                        try {
                            let btn = $(node).find('button[class*=PopupScreen-module__button][data-auto-focus=false]');
                            if ($(btn).length > 0) {
                                $(btn).click();
                                throw new Error("巴啦啦能量－呼尼拉－魔仙变身！");
                            }
                        } catch (e) { }
                    }

                    if (!node.className || !node.className.startsWith('StreamMenu')) {
                        return;
                    }

                    const $orgButton = node.querySelector('div > div > button');
                    if (!$orgButton) {
                        return;
                    }

                    // 创建视频调整
                    const $btnVideoSettings = cloneStreamMenuButton($orgButton, '视频调整', ICON_VIDEO_SETTINGS);
                    $btnVideoSettings.addEventListener('click', e => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Show Quick settings bar
                        $quickBar.style.display = 'flex';

                        $parent.addEventListener('click', screenClicktohide());
                        $parent.addEventListener('touchstart', screenClicktohide());

                        const $touchSurface = document.getElementById('MultiTouchSurface');
                        $touchSurface && $touchSurface.style.display != 'none' && $touchSurface.addEventListener('touchstart', screenClicktohide());
                    });
                    // Add button at the beginning
                    $orgButton.parentElement.insertBefore($btnVideoSettings, $orgButton.parentElement.firstChild);

                    // Hide Quick bar when closing HUD
                    const $btnCloseHud = document.querySelector('button[class*=StreamMenu-module__backButton]');
                    $btnCloseHud.addEventListener('click', e => {
                        $quickBar.style.display = 'none';
                    });

                    // 创建流监控
                    const $btnStreamStats = cloneStreamMenuButton($orgButton, '流监控', ICON_HD_STREAM_STATS);
                    $btnStreamStats.addEventListener('click', e => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Toggle Stream Stats
                        StreamStats.toggle();
                    });

                    // Insert after Video Settings button
                    $orgButton.parentElement.insertBefore($btnStreamStats, $btnVideoSettings);

                    //menu图标样式
                    if (StreamStats.status()) {
                        $('.ICON_HD_STREAM_STATS_ON').css("display", 'block');
                        $('.ICON_HD_STREAM_STATS_OFF').css("display", 'none');
                    } else {
                        $('.ICON_HD_STREAM_STATS_ON').css("display", 'none');
                        $('.ICON_HD_STREAM_STATS_OFF').css("display", 'block');
                    }
                    //桥
                    const $menu = document.querySelector('div[class*=StreamMenu-module__menuContainer] > div[class*=Menu-module]');
                    //const streamBadgesElement = await StreamBadges.render();
                    $menu.appendChild(await StreamBadges.render());

                    //$menu.insertAdjacentElement('afterend', streamBadgesElement);

                });
            });

            mutationList.forEach(item => {
                if (item.type !== 'childList') {
                    return;
                }

                item.removedNodes.forEach($node => {
                    if (!$node || !$node.className || !$node.className.startsWith) {
                        return;
                    }

                });

                item.addedNodes.forEach(async $node => {
                    if (!$node || !$node.className) {
                        return;
                    }

                    if ($node.className.startsWith('Overlay-module_') || $node.className.startsWith('InProgressScreen')) {
                        $node = $node.querySelector('#StreamHud');
                    }

                    if (!$node || ($node.id || '') !== 'StreamHud') {
                        return;
                    }

                    $(document).on('transitionend', '#StreamHud', function () {
                        if ($('#StreamHud').css('left') == '0px') {
                            $('.hd-stream-setting').removeClass("hd-stream-setting-hide");
                        } else {
                            $('.hd-stream-setting').addClass("hd-stream-setting-hide");
                        }
                        if (!NFTconfig['STATS_SLIDE_OPEN']['default']) { return; }
                        if ($('#StreamHud').css('left') == '0px') {
                            if (!StreamStats.status()) {
                                StreamStats.start();
                            }
                        } else {
                            StreamStats.stop();
                        }
                    });

                    // Get the second last button
                    const $orgButton = $node.querySelector('div[class^=HUDButton]');
                    if (!$orgButton) {
                        return;
                    }

                    // 流监控设置
                    if (!$btnStreamStats) {
                        $btnStreamStats = cloneStreamHudButton($orgButton, "hd-stream-setting", "流监控设置", ICON_HD_STREAM_STATS);
                        $btnStreamStats.addEventListener('click', e => {
                            e.preventDefault();
                            StreamStats.toggleSettingsUi();
                        });
                    }

                    // 视频调整        
                    if (!$btnVideoSettings_HD) {
                        $btnVideoSettings_HD = cloneStreamHudButton($orgButton, "hd-stream-setting", '视频调整', ICON_HD_VIDEO_SETTINGS);
                        $btnVideoSettings_HD.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopPropagation();

                            // Show Quick settings bar
                            $quickBar.style.display = 'flex';

                            $parent.addEventListener('click', screenClicktohide());
                            $parent.addEventListener('touchstart', screenClicktohide());

                            const $touchSurface = document.getElementById('MultiTouchSurface');
                            $touchSurface && $touchSurface.style.display != 'none' && $touchSurface.addEventListener('touchstart', screenClicktohide());
                        });
                    }
                    // Insert buttons after Stream Settings button
                    $orgButton.parentElement.insertBefore($btnStreamStats, $orgButton.parentElement.lastElementChild);
                    $orgButton.parentElement.insertBefore($btnVideoSettings_HD, $btnStreamStats);
                    if ($('#StreamHud').css('left') == '0px' && NFTconfig['STATS_SLIDE_OPEN']['default']) {
                        StreamStats.start();
                    }
                    if (StreamStats.status()) {
                        $('.ICON_HD_STREAM_STATS_ON').css("display", 'block');
                        $('.ICON_HD_STREAM_STATS_OFF').css("display", 'none');
                    } else {
                        $('.ICON_HD_STREAM_STATS_ON').css("display", 'none');
                        $('.ICON_HD_STREAM_STATS_OFF').css("display", 'block');
                    }
                    // Move the Dots button to the beginning
                    const $dotsButton = $orgButton.parentElement.lastElementChild;
                    $dotsButton.parentElement.insertBefore($dotsButton, $dotsButton.parentElement.firstElementChild);

                });
            });
        });
        observer.observe($screen, { subtree: true, childList: true });
    }



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
            if (this.className && this.className.startsWith('XboxSplashVideo')) {
                this.volume = 0;
                this.style.display = 'none';
                this.dispatchEvent(new Event('ended'));

                return {
                    catch: () => { },
                };
                return nativePlay.apply(this);
            }

            this.addEventListener('playing', showFunc);
            injectVideoSettingsButton();
            return this.orgPlay.apply(this);
        };
    }

    function onStreamStarted($video) {

        StreamBadges.resolution = { width: $video.videoWidth, height: $video.videoHeight };
        StreamBadges.startTimestamp = +new Date;

        // Get battery level
        try {
            navigator.getBattery && navigator.getBattery().then(bm => {
                StreamBadges.startBatteryLevel = Math.round(bm.level * 100);
            });


            STREAM_WEBRTC.getStats().then(stats => {
                const allVideoCodecs = {};
                let videoCodecId;

                const allAudioCodecs = {};
                let audioCodecId;

                const allCandidates = {};
                let candidateId;

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
                    } else if (stat.type === 'candidate-pair' && stat.packetsReceived > 0 && stat.state === 'succeeded') {
                        candidateId = stat.remoteCandidateId;
                    } else if (stat.type === 'remote-candidate') {
                        allCandidates[stat.id] = stat.address;
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
                // Get server type
                if (candidateId) {
                    //console.log(candidateId, allCandidates);
                    StreamBadges.ipv6 = allCandidates[candidateId].includes(':');
                }

            });
        } catch (e) { }

    }
    function moveCodecToIndex(array, currentIndex, targetIndex, element) {
        array.splice(currentIndex, 1);
        array.splice(targetIndex, 0, element);
    }
    function customizeRtcCodecs() {

        const customCodecProfile = NFTconfig['rtcCodecPreferences']['default'];

        if (customCodecProfile === '默认') {
            console.log("customizeRtcCodecs：默认");
            return;
        }
        if (typeof RTCRtpTransceiver === 'undefined' || !('setCodecPreferences' in RTCRtpTransceiver.prototype)) {
            return false;
        }

        let codecProfilePrefix = "";
        let codecProfileLevelId = "";
        let codecMimeType = "";
        const codecProfileMap = { "264": { "高": "4d", "中": "42e", "低": "420" } };

        if (customCodecProfile.includes("264")) {
            const codecLevel = Object.keys(codecProfileMap["264"]).find(level => customCodecProfile.includes(level));
            if (codecLevel) {
                codecProfilePrefix = codecProfileMap["264"][codecLevel];
                codecProfileLevelId = `profile-level-id=${codecProfilePrefix}`;
            }
        } else {
            codecMimeType = "video/" + customCodecProfile;
        }

        RTCRtpTransceiver.prototype.originalSetCodecPreferences = RTCRtpTransceiver.prototype.setCodecPreferences;
        RTCRtpTransceiver.prototype.setCodecPreferences = function (codecs) {
            let customizedCodecs = null;
            if (customCodecProfile === '自动') {

                let a = [];
                let b = [];
                let c = [];
                let d = [];
                codecs.slice().forEach((item) => {
                    if (item.mimeType == 'video/H264') {
                        if (item.sdpFmtpLine.indexOf('id=4d') > -1) {
                            a.push(item);
                        } else if (item.sdpFmtpLine.indexOf('id=42e') > -1) {
                            b.push(item);
                        } else if (item.sdpFmtpLine.indexOf('id=420') > -1) {
                            c.push(item);
                        } else {
                            d.push(item);
                        }
                    } else {
                        d.push(item);
                    }
                });
                customizedCodecs = a.concat(b, c, d);

            } else {
                customizedCodecs = codecs.slice();
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
            }

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

    class Dialog {
        constructor(title, className, $content, onClose) {
            const CE = createElement;

            // Create dialog overlay
            this.$overlay = document.querySelector('.bx-dialog-overlay');
            if (!this.$overlay) {
                this.$overlay = CE('div', { 'class': 'bx-dialog-overlay bx-gone' });
                document.documentElement.appendChild(this.$overlay);
            }

            let $close;
            this.onClose = onClose;
            this.$dialog = CE('div', { 'class': `bx-dialog ${className} bx-gone` },
                CE('b', {}, title),
                CE('div', { 'class': 'bx-dialog-content' }, $content),
                $close = CE('button', {}, "关闭"));

            $close.addEventListener('click', e => {
                this.hide(e);
            });
            document.documentElement.appendChild(this.$dialog);
        }

        show() {
            this.$dialog.classList.remove('bx-gone');
            this.$overlay.classList.remove('bx-gone');
        }

        hide(e) {
            this.$dialog.classList.add('bx-gone');
            this.$overlay.classList.add('bx-gone');
            this.onClose && this.onClose(e);
        }

        toggle() {
            this.$dialog.classList.toggle('bx-gone');
            this.$overlay.classList.toggle('bx-gone');
        }

        preload() {
            this.$dialog.classList.add('bx-gone');
            this.$overlay.classList.add('bx-gone');
        }
    }
    let REMOTE_PLAY_CONFIG;
    let IS_REMOTE_PLAYING;
    let REMOTE_PLAY_SERVER;

    class RemotePlay {
        static XCLOUD_TOKEN;
        static XHOME_TOKEN;
        static #CONSOLES;

        static #STATE_LABELS = {
            'On': "已开机",
            'Off': "已关机",
            'ConnectedStandby': "待机中",
            'Unknown': "未知",
        };

        static get BASE_DEVICE_INFO() {
            return {
                appInfo: {
                    env: {
                        clientAppId: window.location.host,
                        clientAppType: 'browser',
                        clientAppVersion: '21.1.98',
                        clientSdkVersion: '8.5.3',
                        httpEnvironment: 'prod',
                        sdkInstallId: '',
                    },
                },
                dev: {
                    displayInfo: {
                        dimensions: {
                            widthInPixels: 1920,
                            heightInPixels: 1080,
                        },
                        pixelDensity: {
                            dpiX: 1,
                            dpiY: 1,
                        },
                    },
                    hw: {
                        make: 'Microsoft',
                        model: 'unknown',
                        sdktype: 'web',
                    },
                    os: {
                        name: 'windows',
                        ver: '22631.2715',
                        platform: 'desktop',
                    },
                    browser: {
                        browserName: 'chrome',
                        browserVersion: '119.0',
                    },
                },
            };
        }

        static #dialog;
        static #$content;
        static #$consoles;

        static #initialize() {
            if (RemotePlay.#$content) {
                return;
            }
            const CE = createElement;
            RemotePlay.#$content = CE('div', {}, "获取控制台列表");
            RemotePlay.#dialog = new Dialog(("串流"), '', RemotePlay.#$content);

            RemotePlay.#getXhomeToken(() => {
                RemotePlay.#getConsolesList(() => {
                    console.log(RemotePlay.#CONSOLES);
                    RemotePlay.#renderConsoles();
                });
            });
        }

        static #renderConsoles() {
            const CE = createElement;

            const $fragment = document.createDocumentFragment();

            if (!RemotePlay.#CONSOLES || RemotePlay.#CONSOLES.length === 0) {
                $fragment.appendChild(CE('span', {}, "未找到主机"));
            } else {
                const $settingNote = CE('p', {});

                const resolutions = [1080, 720];
                const currentResolution = NFTconfig['REMOTE_PLAY_RESOLUTION']['default'];
                const $resolutionSelect = CE('select', {});
                for (const resolution of resolutions) {
                    const value = `${resolution}p`;

                    const $option = CE('option', { 'value': value }, value);
                    if (currentResolution === value) {
                        $option.selected = true;
                    }

                    $resolutionSelect.appendChild($option);
                }
                $resolutionSelect.addEventListener('change', e => {
                    const value = $resolutionSelect.value;

                    $settingNote.textContent = value === '1080p' ? '✅ ' + "可串流xbox360游戏" : '❌ ' + "不可串流xbox360游戏";

                    NFTconfig['REMOTE_PLAY_RESOLUTION']['default'] = value;
                    naifeitian.setValue(NFTconfig['REMOTE_PLAY_RESOLUTION']['name'], NFTconfig['REMOTE_PLAY_RESOLUTION']);
                });
                $resolutionSelect.dispatchEvent(new Event('change'));

                const $qualitySettings = CE('div', { 'class': 'bx-remote-play-settings' },
                    CE('div', {},
                        CE('label', {}, "目标分辨率", $settingNote),
                        $resolutionSelect,
                    )
                );

                $fragment.appendChild($qualitySettings);
            }

            for (let con of RemotePlay.#CONSOLES) {
                let $connectButton;
                const $child = CE('div', { 'class': 'bx-remote-play-device-wrapper' },
                    CE('div', { 'class': 'bx-remote-play-device-info' },
                        CE('div', {},
                            CE('span', { 'class': 'bx-remote-play-device-name' }, con.deviceName),
                            CE('span', { 'class': 'bx-remote-play-console-type' }, con.consoleType)
                        ),
                        CE('div', { 'class': 'bx-remote-play-power-state' }, RemotePlay.#STATE_LABELS[con.powerState]),
                    ),
                    $connectButton = CE('button', { 'class': 'bx-primary-button bx-no-margin' }, "连接"),
                );

                $connectButton.addEventListener('click', e => {
                    REMOTE_PLAY_CONFIG = {
                        serverId: con.serverId,
                    };
                    window.BX_REMOTE_PLAY_CONFIG = REMOTE_PLAY_CONFIG;

                    const url = window.location.href.substring(0, 31) + '/launch/fortnite/BT5P2X999VH2#remote-play';

                    const $pageContent = document.getElementById('PageContent');
                    const $anchor = CE('a', { href: url, class: 'bx-hidden', style: 'position:absolute;top:-9990px;left:-9999px' }, '');
                    $anchor.addEventListener('click', e => {
                        setTimeout(() => {
                            $pageContent.removeChild($anchor);
                        }, 1000);
                    });

                    $pageContent.appendChild($anchor);
                    $anchor.click();

                    RemotePlay.#dialog.hide();
                });
                $fragment.appendChild($child);
            }

            RemotePlay.#$content.parentElement.replaceChild($fragment, RemotePlay.#$content);
        }

        static detect() {

            IS_REMOTE_PLAYING = window.location.pathname.includes('/remote-play') || window.location.hash.startsWith('#remote-play');
            if (IS_REMOTE_PLAYING) {
                window.BX_REMOTE_PLAY_CONFIG = REMOTE_PLAY_CONFIG;
                // 移除 /launch/...
                window.history.replaceState({}, '', 'https://www.xbox.com/' + location.pathname.substring(1, 6) + '/remote-play');

            } else {
                window.BX_REMOTE_PLAY_CONFIG = null;
            }
        }

        static #getXhomeToken(callback) {
            if (RemotePlay.XHOME_TOKEN) {
                callback();
                return;
            }

            let GSSV_TOKEN;
            try {
                const xboxUserInfo = JSON.parse(localStorage.getItem('xboxcom_xbl_user_info'));
                GSSV_TOKEN = xboxUserInfo.tokens['http://gssv.xboxlive.com/'].token;
            } catch (e) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);

                    if (key.startsWith('Auth.User.')) {
                        const json = JSON.parse(localStorage.getItem(key));

                        GSSV_TOKEN = json.tokens.find(token => token.relyingParty.includes('gssv.xboxlive.com'))?.tokenData.token;

                        if (GSSV_TOKEN) {
                            break;
                        }
                    }
                }
            }

            fetch('https://xhome.gssv-play-prod.xboxlive.com/v2/login/user', {
                method: 'POST',
                body: JSON.stringify({
                    offeringId: 'xhome',
                    token: GSSV_TOKEN,
                }),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            }).then(resp => resp.json())
                .then(json => {
                    RemotePlay.XHOME_TOKEN = json.gsToken;
                    callback();
                });
        }
        //获取xbox列表
        static async #getConsolesList(callback) {
            if (RemotePlay.#CONSOLES) {
                callback();
                return;
            }

            let servers;
            if (!REMOTE_PLAY_SERVER) {
                if (NFTconfig['REMOTE_SERVER_LIST'].length == 0) {
                    servers = ['wus2', 'eus', 'uks', 'ejp'];
                } else {
                    servers = NFTconfig['REMOTE_SERVER_LIST'];
                }

            } else {
                servers = REMOTE_PLAY_SERVER;
            }

            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${RemotePlay.XHOME_TOKEN}`,
                },
            };

            const controller = new AbortController();
            const signal = controller.signal;

            let foundResponse = false;

            const promises = NFTconfig['REMOTE_SERVER_LIST'].map(async (server) => {
                const url = `https://${server}.core.gssv-play-prodxhome.xboxlive.com/v6/servers/home?mr=50`;

                try {
                    const response = await fetch(url, { ...options, signal });
                    const json = await response.json();
                    if (json.results && !foundResponse) {
                        foundResponse = true;
                        RemotePlay.#CONSOLES = json.results;
                        REMOTE_PLAY_SERVER = server;

                        // 取消剩余请求
                        controller.abort();

                        return 'Found response';
                    }

                } catch (error) {
                     console.log(`请求至服务器 ${server} 时遇到错误，已忽略：`, error);
                }
            });


            // 等待所有请求完成
            const results=await Promise.allSettled(promises);


            // 检查是否有请求成功
            const successfulResult = results.find(result => result.status === 'fulfilled' && result.value === 'Found response');

            if (successfulResult) {
                callback();
            } else {
                RemotePlay.#CONSOLES = [];
            }

        }

        static preload() {
            RemotePlay.#initialize();
            RemotePlay.#dialog.preload();
        }


        static showDialog() {
            RemotePlay.#initialize();
            RemotePlay.#dialog.show();
        }
    }
    function bindmslogoevent() {
        let divElement = $('#gamepass-root > div > div');
        if (divElement.length == 0) {
            setTimeout(() => {
                bindmslogoevent();
            }, 2333);
            return;
        }
        divElement = divElement.get(0);
        let mslogodom = $(divElement).children('header').find('a[href]');
        if (mslogodom.length == 0) {
            setTimeout(() => {
                bindmslogoevent();
            }, 2333);
            return;
        }
        if (mslogodom.length > 0) { mslogodom = $(mslogodom.get(0)); }
        let linkElement = $("a:contains('⚙️ 设置" + nftxboxversion + "')");
        for (let i = 0; i < linkElement.length; i++) {
            let ele = linkElement.get(i);
            if ($(ele).attr('class').indexOf('button') > -1) {
                return;
            }
        }
        mslogodom.removeAttr('href');
        mslogodom.css("color", 'white');
        mslogodom.text("⚙️ 设置" + nftxboxversion);
        mslogodom.click(() => {
            naifeitian.showSetting();
        });

        if (NFTconfig['enableRemotePlay'] == 1) {
            let remotePlayBtn = $('.bx-remote-play-button');
            if (remotePlayBtn.length > 0) { return; }
            //添加串流按钮
            var targetElement = $("[title*='Account Settings']");

            var newButton = $(`<button class="bx-remote-play-button" title="远程串流"><svg fill="none" stroke="#fff" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" viewBox="0 0 32 32"><g transform="matrix(.492308 0 0 .581818 -14.7692 -11.6364)"><clipPath id="A"><path d="M30 20h65v55H30z"></path></clipPath><g clip-path="url(#A)"><g transform="matrix(.395211 0 0 .334409 11.913 7.01124)"><g transform="matrix(.555556 0 0 .555556 57.8889 -20.2417)" fill="none" stroke="#fff" stroke-width="13.88"><path d="M200 140.564c-42.045-33.285-101.955-33.285-144 0M168 165c-23.783-17.3-56.217-17.3-80 0"></path></g><g transform="matrix(-.555556 0 0 -.555556 200.111 262.393)"><g transform="matrix(1 0 0 1 0 11.5642)"><path d="M200 129c-17.342-13.728-37.723-21.795-58.636-24.198C111.574 101.378 80.703 109.444 56 129" fill="none" stroke="#fff" stroke-width="13.88"></path></g><path d="M168 165c-23.783-17.3-56.217-17.3-80 0" fill="none" stroke="#fff" stroke-width="13.88"></path></g><g transform="matrix(.75 0 0 .75 32 32)"><path d="M24 72h208v93.881H24z" fill="none" stroke="#fff" stroke-linejoin="miter" stroke-width="9.485"></path><circle cx="188" cy="128" r="12" stroke-width="10" transform="matrix(.708333 0 0 .708333 71.8333 12.8333)"></circle><path d="M24.358 103.5h110" fill="none" stroke="#fff" stroke-linecap="butt" stroke-width="10.282"></path></g></g></g></g></svg></button>`);
            newButton.on("click", function () {
                RemotePlay.showDialog();
            });

            newButton.insertBefore(targetElement);
        }
        setTimeout(() => { bindmslogoevent() }, 5000);
    }

    bindmslogoevent();

    if (window.location.pathname.includes('/play/')) {
        NFTconfig['PATCH_ORDERS'] = NFTconfig['PATCH_ORDERS'].concat(NFTconfig['PLAYING_PATCH_ORDERS']);
    } else {
        NFTconfig['PATCH_ORDERS'].push(['loadingEndingChunks']);
    }
    naifeitian.patchFunctionBind();
    RemotePlay.detect();


    if (window.location.pathname.toLocaleLowerCase() == '/zh-cn/play') {
        window.location.href = "https://www.xbox.com/en-us/play";
    }
    if (window.location.href.endsWith('consoles/remote-play') || window.location.href.endsWith('/remote-play')) {
        //https://www.xbox.com/en-US/consoles/remote-play
        let jurl = window.location.href.replace('/consoles', '');
        jurl = window.location.href.replace('/remote-play', '/play');
        window.location.href = jurl;
    }

    if (window.location.href.endsWith('play/dev-tools')) {
      window.location.href="/play"
    }



    RTCPeerConnection.prototype.orgAddIceCandidate = RTCPeerConnection.prototype.addIceCandidate;

    RTCPeerConnection.prototype.addIceCandidate = function (...args) {
        STREAM_WEBRTC = this;
        return this.orgAddIceCandidate(...args);
    };


    function addCss() {

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
.hd-stream-setting-hide{
    pointer-events: none !important;
}
div[class^=HUDButton-module__hiddenContainer] ~ div:not([class^=HUDButton-module__hiddenContainer]) {
    opacity: 0;
    position: absolute;
    top: -9999px;
    left: -9999px;
}
.bx-remote-play-button {
    height: auto;
    margin-right: 8px !important;
    position: relative;
    background-color: transparent;
    border:0px;
    border-radius: 50%;
}

.bx-remote-play-button svg {
    width: 28px;
    height: 46px;
}
.bx-remote-play-button:hover {
    background-color: #515863;
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
.better-xcloud-stats-bar div {
    min-width: 60px;
    display: inline-block;
    text-align: right;
    padding-right: 8px;
    margin-right: 8px;
    border-right: 2px solid #fff;
    vertical-align: middle;
    float:left
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
.better-xcloud-stats-bar div:last-of-type {
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
  z-index: 500;
  background: #1a1b1e;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  font-family: "Segoe UI", Arial, Helvetica, sans-serif;
  box-shadow: 0 0 6px #000;
  user-select: none;
  overflow-y: auto;
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
  bottom: 10%;
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
      height: 90vh;
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
  bottom: 0px;
  display: none;
}
/* 横屏 */
@media screen and (orientation: landscape) {
  .better-xcloud-badges {
    display: block; /* 显示 */
  }
}

/* 竖屏 */
@media screen and (orientation: portrait) {
  .better-xcloud-badges {
    display: none; /* 隐藏 */
  }
}

button[class*=BaseItem-module__container] {
    height:fit-content;
}
div[class*=Menu-module__scrollable] {
    height:225px;
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

div[class*=NotFocusedDialog-module__container] {
    display:none
}
@keyframes blink {
      20% {color: blueviolet; }
      50% { color: blue; }
      100% { color: green; }
    }

    .blink-text {
      font-size: 15px;
      font-weight: bold;
      animation: blink 3s infinite;
      float: right;
      cursor: pointer;
      display:none
    }
    .remote-play-button {
    background-color: transparent;
    border: none;
    color: white;
    font-weight: bold;
    line-height: 30px;
    border-radius: 4px;
    padding: 8px;
}

.remote-play-button:hover, .remote-play-button:focus {
    background-color: #515863;
}
.bx-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: var(--bx-dialog-overlay-z-index);
    background: black;
    opacity: 50%;
}

.bx-dialog {
    display: flex;
    flex-flow: column;
    max-height: 90vh;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    max-width: 410px;
    width:95%;
    padding: 20px;
    border-radius: 8px;
    z-index: var(--bx-dialog-z-index);
    background: #1a1b1e;
    color: #fff;
    font-weight: 400;
    font-size: 16px;
    font-family: var(--bx-normal-font);
    box-shadow: 0 0 6px #000;
    user-select: none;
    -webkit-user-select: none;
}

.bx-dialog *:focus {
    outline: none !important;
}

.bx-dialog > b {
    color: #fff;
    display: block;
    font-family: var(--bx-title-font);
    font-size: 26px;
    font-weight: 400;
    line-height: 32px;
    margin-bottom: 12px;
}

.bx-dialog > div {
    overflow: auto;
    padding: 2px 0;
}

.bx-dialog > button {
    padding: 8px 32px;
    margin: 20px auto 0;
    border: none;
    border-radius: 4px;
    display: block;
    background-color: #2d3036;
    text-align: center;
    color: white;
    text-transform: uppercase;
    font-family: var(--bx-title-font);
    font-weight: 400;
    line-height: 18px;
    font-size: 14px;
}
.bx-gone {
    display: none !important;
}
.bx-remote-play-settings {
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #2d2d2d;
}

.bx-remote-play-settings > div {
    display: flex;
}

.bx-remote-play-settings label {
    flex: 1;
}

.bx-remote-play-settings label p {
    margin: 4px 0 0;
    padding: 0;
    color: #888;
    font-size: 12px;
}

.bx-remote-play-settings input {
    display: block;
    margin: 0 auto;
}

.bx-remote-play-settings span {
    font-weight: bold;
    font-size: 18px;
    display: block;
    margin-bottom: 8px;
    text-align: center;
}
.bx-remote-play-device-name {
    font-size: 20px;
    font-weight: bold;
    display: inline-block;
    vertical-align: middle;
}
.bx-remote-play-console-type {
    font-size: 12px;
    background: #888;
    color: #fff;
    display: inline-block;
    border-radius: 14px;
    padding: 2px 10px;
    margin-left: 8px;
    vertical-align: middle;
}

.bx-remote-play-power-state {
    color: #888;
    font-size: 14px;
}
.bx-remote-play-power-state {
    color: #888;
    font-size: 14px;
}
.bx-primary-button {
    padding: 8px 32px;
    margin: 10px auto 0;
    border: none;
    border-radius: 4px;
    display: block;
    background-color: #044e2a;
    text-align: center;
    color: white;
    text-transform: uppercase;
    font-family: var(--bx-title-font);
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
}

@media (hover: hover) {
    .bx-primary-button:hover {
        background-color: #00753c;
    }
}

.bx-primary-button:focus {
    background-color: #00753c;
}

.bx-primary-button:active {
    background-color: #00753c;
}

.bx-primary-button[disabled] {
    background: #393939;
    color: #a2a2a2;
}
.bx-no-margin {
    margin: 0 !important;
}
.bx-remote-play-device-info {
    flex: 1;
    padding: 4px 0;
}
.bx-remote-play-device-wrapper {
    display: flex;
    margin-bottom: 8px;
}

.bx-remote-play-device-wrapper:not(:last-child) {
  margin-bottom: 14px;
}
#xcloud_setting_STATS_BUTTON{
    background-color: cadetblue;
    width:100%;
}
.stats-container {
    width: 30%;
    border:1px solid white;
}

.drag-handle {
    cursor: pointer;
    margin: 5px;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    transition: background-color 0.2s ease;
    position: relative;
    color:black;
    height: 30px;
}

.drag-handle::after {
    content: "≡";
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}

.drag-handle.drag-over {
    background-color: #e0f0ff;
}

.drag-handle.dragging {
    opacity: 0.5;
}

.drag-handle.stats-selected {
    background-color: #cbffcd;
}
.drag-handle.stats-delete {
    text-decoration: line-through;
}

.placeholder {
    border: 1px dashed #ccc;
    border-radius: 5px;
    margin: 5px;
    height: 30px;
    display: none;
    background-color:#c5c5c5!important;
}

/* 新增样式，用于被拖拽元素的副本 */
.dragged-copy-item {
    position: absolute;
    z-index: 1000;
    pointer-events: none;
    /* 防止被拖拽元素副本干扰其他事件 */
    display: none;
    width:100px
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
    }
    addCss();
    crturl = window.location.href;
    console.log("all done");


})();