// ==UserScript==
// @name         英华网课助手 Plus
// @description  自动连播网课
// @author       little3022
// @namespace    little3022.TM
// @homepageURL  https://greasyfork.org/users/782903
// @supportURL   https://greasyfork.org/scripts/440261/feedback
// @version      2.2.5
// @license      GNU GPL v2.0
// @icon         data:image/gif;base64,R0lGODlhQABAALMAAAAAABCWm/vaCPoFE3t+fu3t7AOi6+C8rXV0dJHR7leHifRPVpCQkUa48PTiUQAAACH5BAkAAA8ALAAAAABAAEAAAAT+8MlJq7046827/2B4LWJpVsNwrmVKsjCXpnGNLTNt71Ku8zXfDBgUqogs4xBpwikHL2bouZR+qLOoVYb9bTXd3FfjzC7OZ984MzscLoVDeW1JvTkFHL2yKIDkexJ3IXmBJ36GiYqLjB4FiBaIkIaPD4+TE5WVjH6YkZ9rl5uRohWDQAYYnRqSFAcORA2ppJ6Zlp4FAkQGsxSatRKXFwKwO7y9oBnAArrGvMoby8Q2x8i2wLbDzDWyxwk7DszbMNUGDeDizSvlzzbp4yfs5jXh78Ul8u0w7+Im3fLnWPATdw9EvmMBTdQbqO7DwWoJQyxkWLDDQ4giJjJsyOFiuYiSHDRu5Jjhn0eEIUcOjNGgW8uXDb5dEKmyXyMpASTkxLDTws6fPR/81GkigNGjSCcMJUohaNCmQp+KWNoU6VGlVpNGzWqUhVSrOntKZZozq9CiZqFSxaoVqtIVS8Vy7epzbNoSc51GPXuBLl+3Mfz2/dpVMFuwJwpXyGtXw9gQgq8udmx4K1e8NzNr3sy5s+cMEQAAOw==
// @run-at       document-body
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/440261/%E8%8B%B1%E5%8D%8E%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/440261/%E8%8B%B1%E5%8D%8E%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%20Plus.meta.js
// ==/UserScript==


class YHAssistant {
    /**
     * 类名: YHAssistant
     * 说明: 主类, 统筹管理所有脚本数据.
     **/
    constructor() {
        this.__appname__ = 'YHAssistant';
        this.__author__ = 'little3022';
        this.__version__ = '2.2.5';
        this.__scriptid__ = '440261';

        this.regexs = {
            originalHostMatch: [
                /mooc\.yinghuaonline\.com/,
                /mooc\.\S+\.edu\.cn/,
                /shixun\.\S+\.edu\.cn/
            ],
            courseId: /(?<=courseId=)\d+/,
            nodeId: /(?<=nodeId=)\d+/
        };
        this.pathnames = [
            '/user/node'
        ];
        this.setting = {
            video: {
                muted: false,
                volume: 1,
                autoplay: true
            },
            beep: {
                muted: false,
                volume: 80,
                effect: 0,
                customURL: ''
            },
            captcha: {
                enabled: false,
                apiURL: ''
            },
            whitelist: [],
            blacklist: [],
            data: {
                courseId: '',
                finished: false,
                page: 1,
                pageCount: 1
            }
        };
        this.beepURLs = [
            'https://cdn2.ear0.com:3321/preview?soundid=34591&type=mp3',
            'https://downsc.chinaz.net/Files/DownLoad/sound1/202106/14428.mp3',
            'https://downsc.chinaz.net/Files/DownLoad/sound1/202103/14039.mp3'
        ];
        this.finishBeep = 'https://ppt-mp3cdn.hrxz.com/d/file/filemp3/hrxz.com-bjxdrlfq5o143304.mp3';
        this.HTML = null;

        this._timers = {
            mainTimer: {
                id: null,
                value: 0
            }
        };
        this._videoData = { // 本地视频总时长, 已提交时长, 本次播放有效时长
            totalTime: 0,
            submitTime: 0,
            validTime: 0
        };
        this._courseData = {
            courseId: '',
            page: 0,
            pageCount: 0,
            index: 0,
            recordsCount: 0,
            nextURL: ''
        };
        this._tree = {};
        this._locker = {
            refresh: {
                value: false,
                timeout: 3000
            },
            button: {
                value: false,
                timeout: 300
            },
            beep: {
                value: false,
                timeout: 1000
            },
            request: {
                value: false,
                timeout:500
            }
        };
        this._page = 0;
        this._elBeep = document.createElement('audio');
        this._beepCount = 0;
    }

    _timerLock(locker) {
        if(!locker.value) {
            locker.value = true;
            setTimeout(() => {locker.value = false;}, locker.timeout);
            return false;
        }
        return true;
    }

    _initGUITree() {
        let table = this.HTML.querySelector('table[data-yha="table"]');

        this._tree = {
            msgbox: this.HTML.querySelector('[data-yha="msgbox"]'),
            container: this.HTML.querySelector('[data-yha="container"]'),
            labelInfo: this.HTML.querySelector('[data-yha="label-info"]'),
            labelSet: this.HTML.querySelector('[data-yha="label-set"]'),
            labelCaptcha: this.HTML.querySelector('[data-yha="label-advanced"]'),
            btRefresh: this.HTML.querySelector('[yha-action="refresh"]'),
            btSet: this.HTML.querySelector('[yha-action="setting"]'),
            btBack: this.HTML.querySelector('[yha-action="back"]'),
            btReset: this.HTML.querySelector('[yha-action="reset"]'),
            btCaptcha: this.HTML.querySelector('[yha-action="advanced"]'),
            tip2: this.HTML.querySelector('[data-yha="tip2"]'),
            progress: {
                table: {
                    caption: table.caption,
                    cells: [
                        table.rows[0].cells[1],
                        table.rows[1].cells[1],
                        table.rows[2].cells[1],
                        table.rows[3].cells[1],
                        table.rows[4].cells[1],
                        table.rows[5].cells[1],
                        table.rows[6].cells[1]
                    ]
                }
            },
            setting: {
                video: {
                    muting: this.HTML.querySelector('[yha-setting="video-muting"]'),
                    volume: this.HTML.querySelector('[yha-setting="video-volume"]'),
                    autoplay: this.HTML.querySelector('[yha-setting="video-autoplay"]')
                },
                beep:{
                    muting: this.HTML.querySelector('[yha-setting="beep-muting"]'),
                    volume: this.HTML.querySelector('[yha-setting="beep-volume"]'),
                    beep1: this.HTML.querySelector('[yha-setting="beep-beep1"]'),
                    beep2: this.HTML.querySelector('[yha-setting="beep-beep2"]'),
                    beep3: this.HTML.querySelector('[yha-setting="beep-beep3"]'),
                    beep4: this.HTML.querySelector('[yha-setting="beep-beep4"]'),
                    beepURL: this.HTML.querySelector('[yha-setting="beep-beepURL"]'),
                    test: this.HTML.querySelector('[yha-action="test"]')
                },
                advanced: {
                    whitelist: this.HTML.querySelector('[yha-setting="whitelist"]'),
                    blacklist: this.HTML.querySelector('[yha-setting="blacklist"]'),
                    btAPIEnabled: this.HTML.querySelector('[yha-setting="api-enabled"]'),
                    apiURL: this.HTML.querySelector('[yha-setting="captcha-api"]')
                }
            }
        }
    }

    _bindGUIEvent() {
        let elContainer = this._tree.container;
        let labelInfo = this._tree.labelInfo;
        let labelSet = this._tree.labelSet;
        let labelCaptcha = this._tree.labelCaptcha;
        let btRefresh = this._tree.btRefresh;
        let btSet = this._tree.btSet;
        let btBack = this._tree.btBack;
        let btReset = this._tree.btReset;
        let btCaptcha = this._tree.btCaptcha;
        let tip2 = this._tree.tip2;
        let vMute = this._tree.setting.video.muting;
        let bMute = this._tree.setting.beep.muting;
        let vVolume = this._tree.setting.video.volume;
        let bVolume = this._tree.setting.beep.volume;
        let vAutoplay = this._tree.setting.video.autoplay;
        let beep4 = this._tree.setting.beep.beep4;
        let txtURL = this._tree.setting.beep.beepURL;
        let btTest = this._tree.setting.beep.test;
        let whitelist = this._tree.setting.advanced.whitelist;
        let blacklist = this._tree.setting.advanced.blacklist;
        let btAPIEnabled = this._tree.setting.advanced.btAPIEnabled;
        let apiURL = this._tree.setting.advanced.apiURL;
        let radioArr = [
            this._tree.setting.beep.beep1,
            this._tree.setting.beep.beep2,
            this._tree.setting.beep.beep3,
            this._tree.setting.beep.beep4,
        ];
        let arr = [];

        btRefresh.addEventListener('click', () => {
            if(this._timerLock(this._locker.refresh)) return;
            let tStr = btRefresh.getAttribute('yha-tooltip');
            let tTime = this._locker.refresh.timeout;

            btRefresh.classList.toggle('action');
            this.refreshClick();
            let tTimer = setInterval(() => {
                btRefresh.setAttribute('yha-tooltip', `${(tTime -= 100) / 1000}s`);

                if(tTime <= 0) {
                    btRefresh.setAttribute('yha-tooltip', tStr);
                    btRefresh.classList.toggle('action');
                    tTimer && clearInterval(tTimer);
                }
            }, 100);
        });
        btSet.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;
            labelInfo.style.display = 'none';
            labelSet.style.display = 'inline-block';
            btRefresh.style.display = 'none';
            btSet.style.display = 'none';
            btBack.style.display = 'block';
            btReset.style.display = 'block';
            btCaptcha.style.display = 'block';
            this._page = 1;
            elContainer.style.left = `-${this._page * 100}%`;
        });
        btBack.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;
            labelInfo.style.display = 'none';
            labelSet.style.display = 'none';
            labelCaptcha.style.display = 'none';
            btRefresh.style.display = 'none';
            btSet.style.display = 'none';
            btBack.style.display = 'none';
            btReset.style.display = 'none';
            btCaptcha.style.display = 'none';
            this._page--;
            switch(this._page) {
                case 0:
                    labelInfo.style.display = 'inline-block';
                    btRefresh.style.display = 'block';
                    btSet.style.display = 'block';
                    break;
                case 1:
                    labelSet.style.display = 'inline-block';
                    btBack.style.display = 'block';
                    btReset.style.display = 'block';
                    btCaptcha.style.display = 'block';
                    break;
                case 2:
                    labelCaptcha.style.display = 'inline-block';
                    btBack.style.display = 'block';
                    break;
            }
            elContainer.style.left = `-${this._page * 100}%`;
        });
        btReset.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;
            if(!confirm('确定重置设置吗?')) return;

            this.recoverSetting();
            this.saveSetting();
            this.showSetting();
        });
        btCaptcha.addEventListener('click', () => {
            btReset.style.display = 'none';
            btCaptcha.style.display = 'none';
            labelSet.style.display = 'none';
            labelCaptcha.style.display = 'inline-block';
            this._page = 2;
            elContainer.style.left = `-${this._page * 100}%`;
        });
        arr = [
            this._tree.progress.table.cells[1],
            this._tree.progress.table.cells[2],
            this._tree.progress.table.cells[4]
        ];
        arr.forEach(item => {
            item.set = function(value) {
                if(value < 0) value = 0;
                item.innerText = value + ' s';
            };
        });
        vMute.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;

            if(!this.setting.video.muted) {
                vMute.classList.add('muted');
                vVolume.value = 0;
            }
            else {
                vMute.classList.remove('muted');
                vVolume.value = this.setting.video.volume;
            }
            this.setting.video.muted = !this.setting.video.muted;

            if(this.elVideo) {
                this.elVideo.muted = this.setting.video.muted;
            }
            this.saveSetting();
        });
        bMute.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;

            if(!this.setting.beep.muted) {
                bMute.classList.add('muted');
                bVolume.value = 0;
            }
            else {
                bMute.classList.remove('muted');
                bVolume.value = this.setting.beep.volume;
            }
            this.setting.beep.muted = !this.setting.beep.muted;
            this.saveSetting();
        });
        vVolume.addEventListener('input', () => {
            vVolume.setAttribute('value', vVolume.value);

            if(vVolume.value == 0) vMute.classList.add('muted');
            vMute.classList.remove('muted');
            if(this.elVideo) {
                this.elVideo.muted = false;
                this.elVideo.volume = vVolume.value / 100;
            }
        });
        bVolume.addEventListener('input', () => {
            bVolume.setAttribute('value', bVolume.value);

            if(bVolume.value == 0) bMute.classList.add('muted');
            bMute.classList.remove('muted');
        });
        vVolume.addEventListener('change', () => {
            if(this._timerLock(this._locker.button)) return;

            if(vVolume.value == 0) {
                vMute.classList.add('muted');
                vVolume.setAttribute('value', this.setting.video.volume);
                this.setting.video.muted = true;
            }
            else {
                vMute.classList.remove('muted');
                this.setting.video.volume = parseInt(vVolume.value);
                this.setting.video.muted = false;
            }
            if(this.elVideo) {
                this.elVideo.muted = this.setting.video.muted;
                this.elVideo.volume = this.setting.video.volume / 100;

                // 同步视频标签操作, 防止音量被重置
            }
            this.saveSetting();
        });
        bVolume.addEventListener('change', () => {
            if(this._timerLock(this._locker.button)) return;

            if(bVolume.value == 0) {
                bMute.classList.add('muted');
                bVolume.setAttribute('value', this.setting.beep.volume);
                this.setting.beep.muted = true;
            }
            else {
                bMute.classList.remove('muted');
                this.setting.beep.volume = parseInt(bVolume.value);
                this.setting.beep.muted = false;
                this.beep();
                this.saveSetting();
            }
        });
        vAutoplay.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;

            this.setting.video.autoplay = !this.setting.video.autoplay;
            vAutoplay.checked = this.setting.video.autoplay;

            this.saveSetting();
        });
        arr = [
            this._tree.setting.beep.beep1,
            this._tree.setting.beep.beep2,
            this._tree.setting.beep.beep3
        ]
        arr.forEach(item => {
            item.addEventListener('click', () => {
                if(this._timerLock(this._locker.beep)) {
                    radioArr[this.setting.beep.effect].checked = true;
                    return;
                }

                txtURL.disabled = true;
                this.setting.beep.effect= parseInt(item.value);
                this.beep();
                this.saveSetting();
            });
        });
        beep4.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) {
                radioArr[this.setting.beep.effect].checked = true;
                return;
            }

            txtURL.disabled = false;
        });
        txtURL.addEventListener('input', () => {
            tip2.hidden = false;
        });
        txtURL.addEventListener('change', () => {
            if(this._timerLock(this._locker.button)) return;
            tip2.hidden = true;
            if(txtURL.value.search(/https:\S+/) !== 0) {
                txtURL.value = '';
                arr[this.setting.beep.effect].checked = true;
                txtURL.disabled = true;

                return this.showInfo('无效的 URL');
            }
            this.setting.beep.effect = 3;
            this.setting.beep.customURL = txtURL.value;
            this.saveSetting();
        });
        btTest.addEventListener('click', () => {
            if(this._timerLock(this._locker.beep)) return;
            if(this.setting.beep.effect == 3 && (this.setting.beep.customURL.search(/https:\S+/) !== 0)) return this.showError('#008', '无效的 URL');

            this.beep();
        });
        let whiteCount = 0, blackCount = 0;
        whitelist.addEventListener('keypress', e => {
            tip2.hidden = false;
            if(e.which === 13) {
                let eChange = new Event('change');

                whitelist.dispatchEvent(eChange);
            }
            whiteCount++;
        });
        whitelist.addEventListener('change', e => {
            if(this._timerLock(this._locker.button) && e.isTrusted) return;
            if(!whiteCount) return;
            // 去除空格并转为数组并去除空值
            let list = whitelist.value.replaceAll(' ', '').replaceAll(/\n+/g, '\n').split('\n').filter(x => x);
            // 去除重复项
            list = [...new Set(list)];
            // 判断是否相同
            let i = 0;
            for(; list.length === this.setting.whitelist.length && i < list.length; i++) {
                if(list[i] !== this.setting.whitelist[i]) break;
            }
            if(i < list.length) { // 不相同
                this.setting.whitelist = list;
                this.saveSetting();
            }
            whitelist.value = list.join('\n');
            tip2.hidden = true;
        });
        blacklist.addEventListener('keypress', e => {
            tip2.hidden = false;
            if(e.which === 13) {
                let eChange = new Event('change');

                blacklist.dispatchEvent(eChange);
            }
            else blackCount++;
        });
        blacklist.addEventListener('change', e => {
            if(this._timerLock(this._locker.button) && e.isTrusted) return;
            if(!blackCount) return;
            // 去除空格转为数组并去除空值
            let list = blacklist.value.replaceAll(/\n+/g, '\n').split('\n').filter(x => x);
            // 去除重复项
            list = [...new Set(list)];
            // 判断是否相同
            let i = 0;
            for(; list.length === this.setting.blacklist.length && i < list.length; i++) {
                if(list[i] !== this.setting.blacklist[i]) break;
            }
            if(i < list.length) { // 不相同
                this.setting.blacklist = list;
                this.saveSetting();
            }
            blacklist.value = list.join('\n');
            tip2.hidden = true;
        });
        btAPIEnabled.addEventListener('click', () => {
            if(this._timerLock(this._locker.button)) return;

            if(this.setting.captcha.enabled) {
                apiURL.disabled = true;
            }
            else {
                apiURL.disabled = false;
            }
            if(this.setting.captcha.apiURL);
            this.setting.captcha.enabled = true;
            this.saveSetting();
        });
        apiURL.addEventListener('input', () => {
            tip2.hidden = false;
        });
        apiURL.addEventListener('change', () => {
            if(this._timerLock(this._locker.button)) return;
            tip2.hidden = true;
            if(apiURL.value.search(/http\S+/) !== 0) {
                apiURL.value = '';
                btAPIEnabled.checked = false;
                apiURL.disabled = true;

                return this.showInfo('无效的 URL');
            }
            this.setting.captcha.enabled = true;
            this.setting.captcha.apiURL = apiURL.value;
            this.saveSetting();
        });
    }

    showGUI() {
        function getHTML() {
            /*
            <div data-yha="title">英华网课助手 Plus <span>控制台</span></div>
            <div data-yha="info">
                <span>作者: <a href="https://greasyfork.org/zh-CN/users/782903" target="_blank">__author__</a></span>
                <span>版本: __version__</span>
                <span><a href="https://greasyfork.org/scripts/__scriptid__/feedback" target="_blank">点此反馈</a></span>
            </div>
            <div data-yha="toolbar">
                <span data-yha="icon">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M939.880137 299.43679 83.552951 299.43679c-16.57449 0-30.011524-13.101389-30.011524-29.67588s13.437034-29.67588 30.011524-29.67588L939.880137 240.08503c16.57449 0 30.011524 13.101389 30.011524 29.67588S956.454628 299.43679 939.880137 299.43679z"></path><path d="M785.821389 546.053584 83.552951 546.053584c-16.57449 0-30.011524-13.613042-30.011524-30.187533s13.437034-30.187533 30.011524-30.187533L785.821389 485.678518c16.57449 0 30.011524 13.613042 30.011524 30.187533S802.39588 546.053584 785.821389 546.053584z"></path><path d="M939.880137 791.647071 83.552951 791.647071c-16.57449 0-30.011524-13.101389-30.011524-29.67588s13.437034-29.67588 30.011524-29.67588L939.880137 732.295312c16.57449 0 30.011524 13.101389 30.011524 29.67588S956.454628 791.647071 939.880137 791.647071z"></path></svg>
                </span>
                <span data-yha="label-info">课程信息</span>
                <span data-yha="label-set" style="display: none;">设置<span style="color: red;font-size: 0.6em;">(高级设置 →)</span></span>
                <span data-yha="label-advanced" style="display: none;">高级设置</span>
                <span data-yha="button" yha-action="back" yha-tooltip="返回" style="display: none;">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M947.4 864C893.2 697.7 736.2 578.9 551 575.5c-23.1-0.4-44.9 0.1-65.6 1.5v164.3c0.1 0.5 0.2 1 0.2 1.5 0 4-3.3 7.3-7.3 7.3-2.7 0-5-1.4-6.2-3.5v0.7L68.8 465.4h2.1c-4 0-7.3-3.3-7.3-7.3 0-2.9 1.7-5.4 4.1-6.6L472 169v0.7c1.3-2.1 3.6-3.5 6.2-3.5 4 0 7.3 3.3 7.3 7.3 0 0.5-0.1 1-0.2 1.5v159.4c18.5-0.9 37.9-1.2 58.3-0.8 230.1 3.9 416.7 196.9 416.7 427.1 0.1 35.5-4.5 70.2-12.9 103.3z m-462-704.4v0.2h-0.4l0.4-0.2z m0 596.9l-0.3-0.2h0.3v0.2z"></path></svg>
                </span>
                <span data-yha="button" yha-action="reset" yha-tooltip="重置" style="display: none;">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M495.7 313.1c-16.6 0-30 13.4-30 30v182.6c0 3.3 0.5 6.4 1.5 9.3 2.1 14.5 14.6 25.7 29.7 25.7h182.6c16.6 0 30-13.4 30-30s-13.4-30-30-30H525.7V343.1c0-16.6-13.4-30-30-30zM857.3 366.1c-18.9-44.6-45.9-84.7-80.3-119.1-34.4-34.4-74.5-61.4-119.1-80.3-46.2-19.5-95.3-29.5-145.9-29.5-44.8 0-88.7 7.8-130.3 23.3-40.3 14.9-77.4 36.6-110.4 64.3-47.2 39.6-83.8 90.2-106.6 146.6l-16.1-30c-7.8-14.6-26-20.1-40.6-12.2-14.6 7.8-20.1 26-12.2 40.6l51.1 95.1c0.3 0.6 0.7 1.2 1.1 1.8 0.2 0.4 0.5 0.7 0.7 1.1 0.1 0.2 0.3 0.4 0.4 0.7 5.8 7.9 14.8 12.2 24.2 12.2 4.8 0 9.7-1.2 14.2-3.6 0 0 0.1 0 0.1-0.1l95-51c14.6-7.8 20.1-26 12.2-40.6-7.8-14.6-26-20.1-40.6-12.2l-32.5 17.5c19.3-46.1 49.5-87.4 88.3-120 27.7-23.3 58.9-41.4 92.7-54 35-13 71.8-19.5 109.5-19.5 84.1 0 163.1 32.7 222.5 92.2s92.2 138.5 92.2 222.5-32.9 163.2-92.4 222.6-138.4 92.2-222.5 92.2-163.1-32.7-222.5-92.2c-11.7-11.7-30.7-11.7-42.4 0s-11.7 30.7 0 42.4c34.4 34.4 74.5 61.4 119.1 80.3 46.2 19.5 95.3 29.5 145.9 29.5s99.7-9.9 145.9-29.5c44.6-18.9 84.7-45.9 119.1-80.3 34.4-34.4 61.4-74.5 80.3-119.1 19.5-46.2 29.5-95.3 29.5-145.9s-10.1-99.5-29.6-145.8z"></path></svg>
                </span>
                <span data-yha="button" yha-action="advanced" yha-tooltip="高级" style="display: none;">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M800 192H224a128 128 0 0 0-128 128v384a128 128 0 0 0 128 128h576a128 128 0 0 0 128-128V320a128 128 0 0 0-128-128zM309.184 667.008h-36.608V421.632a188.992 188.992 0 0 1-34.624 26.496 234.816 234.816 0 0 1-38.528 19.904v-37.184c20.416-10.112 38.336-22.4 53.632-36.8 15.296-14.4 26.176-28.352 32.512-41.92h23.616v314.88z m283.456 0H395.648a71.552 71.552 0 0 1 4.288-26.752c5.056-14.144 13.056-28.032 24.064-41.728 11.072-13.632 27.008-29.504 47.872-47.488 32.384-27.968 54.272-50.048 65.664-66.432 11.392-16.32 17.088-31.744 17.088-46.336a52.8 52.8 0 0 0-15.552-38.592A54.656 54.656 0 0 0 498.496 384c-17.6 0-31.68 5.568-42.304 16.64-10.56 11.136-15.872 26.56-16.064 46.208l-37.568-4.032c2.56-29.504 12.224-52.032 29.056-67.52s39.36-23.168 67.712-23.168c28.608 0 51.2 8.32 67.968 25.024 16.64 16.704 25.024 37.376 25.024 62.08 0 12.544-2.496 24.896-7.36 36.992s-12.992 24.832-24.32 38.272-30.144 31.808-56.448 55.104c-21.952 19.456-36.032 32.64-42.304 39.552a126.72 126.72 0 0 0-15.424 20.864H592.64v36.992z m203.456-22.976c-18.88 19.136-42.88 28.544-72 28.544-26.048 0-47.872-8.192-65.152-24.576s-27.008-37.696-29.44-63.808l36.544-5.12c4.16 21.824 11.328 37.504 21.44 47.168 10.112 9.6 22.4 14.464 36.864 14.464 17.28 0 31.744-6.272 43.648-18.816 11.904-12.48 17.728-28.096 17.728-46.656a60.48 60.48 0 0 0-16.384-43.712 55.488 55.488 0 0 0-41.856-17.28c-6.912 0-15.488 1.408-25.792 4.288l4.032-33.792a72.576 72.576 0 0 0 48-12.416c12.48-8.576 18.624-21.76 18.624-39.616a46.912 46.912 0 0 0-48.768-48.96 48.512 48.512 0 0 0-35.584 14.08c-9.472 9.472-15.552 23.616-18.304 42.432l-36.544-6.848c4.48-25.792 14.656-45.824 30.528-60.032 15.872-14.208 35.584-21.312 59.136-21.312 16.256 0 31.232 3.648 44.928 11.008 13.696 7.36 24.128 17.344 31.424 30.08 7.232 12.736 10.88 26.176 10.88 40.448 0 13.504-3.52 25.856-10.368 36.992a72.128 72.128 0 0 1-30.656 26.56c17.536 4.288 31.232 13.184 41.088 26.624 9.664 13.504 14.656 30.336 14.656 50.624a95.488 95.488 0 0 1-28.672 69.632z"></path></svg>
                </span>
                <span data-yha="button" yha-action="setting" yha-tooltip="设置">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M381.482667 673.877333a90.389333 90.389333 0 0 1 85.226666 60.245334H853.333333v64H465.28a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h125.610666a90.389333 90.389333 0 0 1 85.205334-60.245334z m0 64a26.346667 26.346667 0 1 0 0 52.693334 26.346667 26.346667 0 0 0 0-52.693334z m261.034666-304.938666a90.389333 90.389333 0 0 1 85.205334 60.245333H853.333333v64h-127.04a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h386.624a90.389333 90.389333 0 0 1 85.226666-60.245333z m0 64a26.346667 26.346667 0 1 0 0 52.693333 26.346667 26.346667 0 0 0 0-52.693333zM381.482667 192a90.389333 90.389333 0 0 1 85.226666 60.224H853.333333v64H465.28a90.389333 90.389333 0 0 1-167.573333 0H170.666667v-64h125.610666A90.389333 90.389333 0 0 1 381.482667 192z m0 64a26.346667 26.346667 0 1 0 0 52.693333 26.346667 26.346667 0 0 0 0-52.693333z"></path></svg>
                </span>
                <span data-yha="button" yha-action="refresh" yha-tooltip="刷新" style="fill: #666;">
                    <svg viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1017.856 460.8l-185.408-233.536c-20.48-25.6-58.368-25.6-78.848 0L569.216 460.8C554.88 478.208 568.256 504.832 590.784 504.832l72.704 0c-2.048 136.192-2.048 309.312-240.704 447.552-6.144 4.096-3.072 13.312 4.096 12.288 456.768-70.656 493.632-376.896 494.656-458.816l75.776 0C1019.904 504.832 1032.192 478.208 1017.856 460.8L1017.856 460.8zM434.048 519.168 361.344 519.168c2.048-136.192 2.048-309.312 240.704-447.552 6.144-4.096 3.072-13.312-4.096-12.288C141.12 129.984 104.256 437.248 103.232 518.144L27.456 518.144c-22.528 0-35.84 26.624-21.504 44.032l185.344 233.536c20.48 25.6 58.368 25.6 78.848 0l185.408-233.536C468.864 545.792 456.576 519.168 434.048 519.168L434.048 519.168zM434.048 519.168"></path></svg>
                </span>
            </div>
            <span data-yha="tip2">设置未保存</span>
            <div data-yha="container">
                <span data-yha="progress">
                    <table data-yha="table" cellspacing="0">
                        <caption>null</caption>
                        <tbody> <tr> <th width="99px">观看次数</th> <td>null</td> </tr> <tr> <th>视频时长</th> <td>null</td> </tr> <tr> <th>剩余时长</th> <td>null</td> </tr> <tr> <th>状态</th> <td>null</td> </tr> <tr> <th>计时</th> <td>null</td> </tr> <tr> <th>预计完成</th> <td>null</td> </tr> </tr> <tr> <th>进度</th> <td>null</td> </tr> </tbody>
                    </table>
                </span>
                <span data-yha="setting">
                    <span data-yha="text">视频设置</span>
                    <div data-yha="setting-item">
                        <span data-yha="setting-key">音量</span>
                        <span data-yha="setting-value">
                            <span yha-setting="video-muting" class="yha-icon-muting"></span>
                            <input yha-setting="video-volume" type="range"  min="0" max="100" step="1">
                        </span>
                    </div>
                    <div data-yha="setting-item">
                        <label data-yha="setting-key" for="c0">自动播放</label>
                        <span data-yha="setting-value">
                            <input id="c0" yha-setting="video-autoplay" type="checkbox">
                        </span>
                    </div>
                    <span data-yha="text">音效设置</span>
                    <div data-yha="setting-item">
                        <span data-yha="setting-key">音量</span>
                        <span data-yha="setting-value">
                            <span yha-setting="beep-muting" class="yha-icon-muting"></span>
                            <input yha-setting="beep-volume" type="range"  min="0" max="100" step="1">
                        </span>
                    </div>
                    <div data-yha="setting-item">
                        <span data-yha="setting-value">
                            <label data-yha="setting-key" for="a0">音效1
                                <input id="a0" yha-setting="beep-beep1" type="radio" name="acoustics" value="0">
                            </label>
                        </span>
                        <span data-yha="setting-value">
                            <label data-yha="setting-key" for="a1">音效2
                                <input id="a1" yha-setting="beep-beep2" type="radio" name="acoustics" value="1">
                            </label>
                        </span>
                        <span data-yha="setting-value">
                            <label data-yha="setting-key" for="a2">音效3
                                <input id="a2" yha-setting="beep-beep3" type="radio" name="acoustics" value="2">
                            </label>
                        </span>
                        <span data-yha="setting-value">
                            <label data-yha="setting-key" for="a3">超链接
                                <input id="a3" yha-setting="beep-beep4" type="radio" name="acoustics" value="3">
                                <input yha-setting="beep-beepURL" type="text" placeholder="超链接仅支持 https 协议" disabled style="margin-top: 12px;width: 68%;">
                            </label>
                        </span>
                    </div>
                    <span data-yha="test" yha-action="test">测试</span>
                    <span data-yha="tip1">注意: Edge 浏览器请关闭“签页休眠”功能, 或播放声音避免脚本意外暂停!!!</span>
                </span>
                <span data-yha="advanced">
                    <span data-yha="text">白名单</span>
                    <div data-yha="setting-item">
                        <span data-yha="setting-value">
                            <textarea yha-setting="whitelist" placeholder="请输入域名全称, 一行一个, 原始匹配: &#10;mooc.yinghuaonline.com&#10;mooc.*.edu.cn&#10;shixun.*.edu.cn" style="box-sizing: border-box;width: 100%;height: 5em;resize: none;"></textarea>
                        </span>
                    </div>
                    <span data-yha="text">黑名单</span>
                    <div data-yha="setting-item">
                        <span data-yha="setting-value">
                            <textarea yha-setting="blacklist" placeholder="优先级高于白名单，一行一个域名。如：mooc.yinghuaonline.com" style="box-sizing: border-box;width: 100%;height: 3em;resize: none;"></textarea>
                        </span>
                    </div>
                    <span data-yha="text" title="脚本会发送 XMLHttpRequest 到指定服务器, 参见:&#10;method: POST&#10;formData: img&#10;type: base64 (string)&#10;&#10;服务器应返回 JSON 对象 &#10;{&#10;code: 'xxxx',&#10;...&#10;}">验证码识别 API<span style="margin: 0 5px;text-decoration:underline;">( ? )</span></span>
                    <div data-yha="setting-item">
                        <label data-yha="setting-key" for="c1">启用</label>
                        <span data-yha="setting-value">
                            <input id="c1" yha-setting="api-enabled" type="checkbox">
                            <input yha-setting="captcha-api" type="text" placeholder="请输入服务器 URL" disabled style="position: relative;top: -2px;margin-top: 5px;width: 70%;">
                        </span>
                    </div>
                </span>
            </div>
            <div data-yha="msgbox"></div>
            */
            let lines = new String(getHTML);
            lines = lines.substring(lines.indexOf("/*") + 3, lines.indexOf("*/"));
            return lines;
        }
        function getCSS() {
            /*
            #YHAssistant {
                --yha-width: 300px;
                --yha-height: 435px;
                --yha-color: gray;
                z-index: 999;
                position: fixed;
                top: calc(50vh - var(--yha-height) / 2);
                left: calc(20px - var(--yha-width));
                margin: 0;
                padding: 0;
                border: 0;
                border-radius: 8px;
                box-shadow: 3px 3px 8px #3338;
                width: var(--yha-width);
                font-size: 16px;
                color: var(--yha-color);
                background-color: #F5F5DCDD;
                transition: all 0.5s ease;
                overflow: hidden;
                -webkit-user-select: none;
                user-select: none;
            }
            #YHAssistant:hover {
                left: 0;
            }
            #YHAssistant.reveal {
                left: 8px;
            }
            [data-yha="title"] {
                margin: 1em auto;
                font-size: 1em;
                font-weight: bold;
                text-align: center;
            }
            [data-yha="title"] span {
                font-size: 0.6em;
                font-weight: normal;
                vertical-align: super;
            }
            [data-yha="info"] {
                border-bottom: 1px solid var(--yha-color);
                padding-bottom: 8px;
                font-size: 0.6em;
                text-align: center;
            }
            [data-yha="info"] span {
                padding: 0 5px 0 5px;
                border-right: 1px solid var(--yha-color);
            }
            [data-yha="info"] span:last-child {
                padding: 0 0 0 5px;
                border-right: none;
            }
            [data-yha="toolbar"] {
                z-index: 10;
                margin: 8px 12px;
            }
            [data-yha="toolbar"] [data-yha="icon"] {
                float: left;
                margin: 0 8px;
            }
            [data-yha="toolbar"] [data-yha="button"] {
                float: right;
                margin-left: 8px;
            }
            [data-yha="icon"] svg,
            [data-yha="button"] svg {
                width: 20px;
                height: 20px;
                margin: auto;
                pointer-events: none;
            }
            [data-yha="button"] {
                opacity: 0.6;
                height: 30px;
                width: 30px;
                display: block;
                cursor: pointer;
                line-height: 36px;
                text-align: center;
                border-radius: 8px;
                transition: opacity 0.1s ease;
                fill: #333;
            }
            [data-yha="button"]:hover {
                opacity: 1;
                background-color: #3331;
            }
            [data-yha="button"]::after {
                display: none;
                content: attr(yha-tooltip);
                position: relative;
                top: -15px;
                font-size: 0.8em;
            }
            [data-yha="button"]:hover::after {
                display: block;
            }
            @keyframes refreshing{
                from{transform: rotate(0deg);}
                to{transform: rotate(-360deg);}
            }
            [yha-action="refresh"].action svg {
                animation: refreshing 3s linear infinite;
                animation-fill-mode: forwards;
            }
            [data-yha="container"] {
                display: flex;
                flex-direction: row;
                position: relative;
                left: 0;
                width: 300%;
                min-height: 200px;
                transition: left 0.5s ease;
            }
            [data-yha="progress"],
            [data-yha="setting"],
            [data-yha="advanced"] {
                box-sizing: content-box;
                padding: 15px 20px;
                width: calc(var(--yha-width) - 40px);
            }
            [data-yha="setting"],
            [data-yha="advanced"] {
                font-size: 0.85em;
            }
            [data-yha="table"] {
                clear: both;
                margin: auto;
                margin-top: 12px;
                width: 80%;
                line-height: 1.5em;
                text-align: center;
            }
            [data-yha="table"] caption {
                margin: 8px auto;
                width: calc(var(--yha-width) * 0.8);
                font-size: 1.1em;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            [data-yha="table"] th, td {
                border-bottom: 1px solid #ccc;
                text-align: center;
            }
            [data-yha="table"] th {
                font-size: 0.9em;
            }
            [data-yha="setting"] {
                font-size: 0.85em;
            }
            [data-yha="setting-value"] input[type="range"] {
                position: relative;
                top: -2px;
                width: calc(100% - 75px);
            }
            [data-yha="setting-value"] input[type="range"]::after {
                content: attr(value);
                float: right;
                width: 0;
            }
            [data-yha="setting-value"] input[type="checkbox"] {
                position: relative;
                top: -1.5px;
                margin: 0 8px 0 0;
            }
            [data-yha="setting-value"] input[type="radio"] {
                position: relative;
                top: 1.5px;
                margin: 0 8px 0 0;
            }
            [data-yha="text"] {
                display: inline-block;
                margin: 5px auto;
                padding-top: 5px;
                border-top: 1px var(--yha-color) dashed;
                width: 100%;
                font-size: 1em;
                font-weight: bold;
            }
            [data-yha="setting-item"] {
                margin: 5px auto;
            }
            [data-yha="setting-key"] {
                position: relative;
                top: -3px;
            }
            [data-yha="test"] {
                float: right;
                position: relative;
                top: -35px;
                left: -18px;
                display: inline-block;
                border-radius: 8px;
                width: 52px;
                height: 28px;
                color: #fff;
                line-height: 28px;
                text-align: center;
                background-color: #0005;
                box-shadow: 3px 3px 3px #3333;
                cursor: pointer;
            }
            [data-yha="test"]:hover {
                background-color: #0008;
            }
            [data-yha="tip1"] {
                display: inline-block;
                margin-top: -22px;
                line-height: 20px;
                color: red;
                font-weight: bold;
                text-indent: 1.5em;
                text-align: justify;
            }
            [data-yha="tip2"] {
                z-index: 10;
                position: absolute;
                top: 118px;
                right: 15px;
                color: red;
                background-color: pink;
                padding: 5px;
                border-radius: 5px;
                font-size: 0.6em;
                box-shadow: 3px 3px 3px gray;
                pointer-events: none;
            }
            input[type="text"].changed,
            textarea.changed {
                background-color: pink;
            }
            [data-yha="msgbox"] {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                pointer-events: none;
            }
            [data-yha="msgbox"] > span {
                z-index: 999;
                margin: 5px auto;
                padding: 8px 20px;
                border: 2px dashed royalblue;
                border-radius: 8px;
                text-align: center;
                color: white;
                transition: opacity 0.8s linear;
            }
            .msgbox-info {
                background-color: #ef950399;
            }
            .msgbox-error {
                background-color: #ff1e1e99;
            }
            .yha-input {
                opacity: 0;
                position: absolute;
                left: 0;
                cursor: pointer;
            }
            .yha-icon-muting {
                display: inline-block;
                width: 18px;
                height: 18px;
                background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJncmF5IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik03NjIuNyA0NjkuN2MwLTkzLjUtNjkuMy0xNzAuMS0xNTkuMi0xODN2NTMuMWM2MC41IDEyLjMgMTA2LjEgNjUuOCAxMDYuMSAxMzBzLTQ1LjYgMTE3LjctMTA2LjEgMTMwdjUzLjFjODkuOS0xMy4yIDE1OS4yLTg5LjggMTU5LjItMTgzLjJ6TTk5LjQgMzYzLjV2MjEyLjJjMCAyOS4zIDIzLjggNTMuMSA1My4xIDUzLjFoNzkuNlYzMTAuNWgtNzkuNmMtMjkuMyAwLTUzLjEgMjMuNy01My4xIDUzeiBtMzcxLjUtMjEyLjJMMjg1LjIgMjc1LjF2Mzg5LjFMNDcwLjkgNzg4YzI5LjMgMCA1My4xLTIzLjggNTMuMS01My4xVjIwNC40Yy0wLjEtMjkuNC0yMy44LTUzLjEtNTMuMS01My4xeiBtMTMyLjYtNTIuN3Y1NC41YzE1NS44IDMwIDI2NS4zIDE1Ny4xIDI2NS4zIDMxNi42IDAgMTU4LjYtMTA2LjEgMjgxLjUtMjY1LjMgMzE2LjZ2NTQuNWMxNzkuOC0yNi4zIDMxOC40LTE4MS42IDMxOC40LTM3MS4xIDAtMTg5LjUtMTM4LjYtMzQ0LjgtMzE4LjQtMzcxLjF6Ij48L3BhdGg+PC9zdmc+);
                cursor: pointer;
            }
            .yha-icon-muting.muted {
                background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJncmF5IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Ik0xMDAuMSAzOTl2MjIxYzAgMzAuNSAyNC43IDU1LjMgNTUuMyA1NS4zaDgyLjlWMzQzLjdoLTgyLjljLTMwLjUgMC01NS4zIDI0LjgtNTUuMyA1NS4zek04MDMgNTA5LjVsMTE1LjMtMTE1LjNjMTIuNC0xMi40IDEzLjYtMzEuNSAyLjYtNDIuNXMtMzAtOS45LTQyLjUgMi42TDc2My4xIDQ2OS42IDY0Ny45IDM1NC4zYy0xMi40LTEyLjUtMzEuNS0xMy42LTQyLjUtMi42cy05LjkgMzAgMi42IDQyLjVsMTE1LjMgMTE1LjNMNjA4IDYyNC44Yy0xMi40IDEyLjQtMTMuNiAzMS41LTIuNiA0Mi41czMwIDkuOSA0Mi41LTIuNmwxMTUuMy0xMTUuMyAxMTUuMyAxMTUuM2MxMi40IDEyLjQgMzEuNSAxMy42IDQyLjUgMi42czkuOS0zMC0yLjYtNDIuNUw4MDMgNTA5LjV6TTQ4Ni45IDE3OEwyOTMuNSAzMDYuOXY0MDUuMkw0ODYuOSA4NDFjMzAuNSAwIDU1LjMtMjQuNyA1NS4zLTU1LjNWMjMzLjJjLTAuMS0zMC41LTI0LjgtNTUuMi01NS4zLTU1LjJ6Ij48L3BhdGg+PC9zdmc+);
            }
            */
            let lines = new String(getCSS);
            lines = lines.substring(lines.indexOf("/*") + 3, lines.indexOf("*/"));
            return lines;
        }
        let _css = document.createElement('style');
        let _wrapper = document.createElement('div');

        _css.type = 'text/css';
        _css.innerHTML = getCSS();
        _wrapper.id = this.__appname__;
        _wrapper.classList.toggle('reveal');
        _wrapper.innerHTML = getHTML().replace('__author__', this.__author__).replace('__version__', this.__version__).replace('__scriptid__', this.__scriptid__);

        document.head.appendChild(_css);
        document.documentElement.insertBefore(_wrapper, document.body);

        this.HTML = _wrapper;
        this._initGUITree();
        this._bindGUIEvent();
        this._tree.tip2.hidden = true;
        setTimeout(() => {
            _wrapper.classList.toggle('reveal');
        }, 3000);
    }

    _setRange(el, value) {
        el.value = value;
        el.setAttribute('value', value);
    }

    loadSetting() {
        let t1 = GM_getValue(this.__appname__, null);
        let badSetting = false;

        for(let item in t1) {
            if(item == 'whitelist') {
                if(Array.isArray(t1[item])) this.setting.whitelist = t1[item];
                continue;
            }
            if(item == 'blacklist') {
                if(Array.isArray(t1[item])) this.setting.blacklist = t1[item];
                continue;
            }
            for(let key in t1[item]) {
                try {
                    this.setting[item][key] = t1[item][key];
                }
                catch(e) {
                    badSetting = true;
                    continue;
                }
            }
        }
        if(badSetting) {
            GM_deleteValue(this.__appname__);
            this.showInfo('识别到无效本地设置, 已重置');
        }
    }

    saveSetting(showInfo=true) {
        GM_setValue(this.__appname__, this.setting);
        if(showInfo) this.showInfo('已存储设置');
    }

    recoverSetting() {
        let effect = 0;
        let customURL = '';
        let enabledAPI = false;
        let apiURL = '';

        if(this.setting.beep.effect === 3) effect = 3;
        if(this.setting.beep.customURL.search(/https:\S+/) === 0) customURL = this.setting.beep.customURL;
        if(this.setting.captcha.enabled) enabledAPI = true;
        if(this.setting.captcha.apiURL.search(/http\S+/) === 0) apiURL = this.setting.captcha.apiURL;
        this.setting = {
            video: {
                muted: false,
                volume: 1,
                autoplay: true
            },
            beep: {
                muted: false,
                volume: 80,
                effect: 0,
                customURL: ''
            },
            captcha: {
                enabled: false,
                apiURL: ''
            },
            whitelist: [],
            blacklist: [],
            data: {
                courseId: '',
                finished: false,
                page: 1,
                pageCount: 1
            }
        };
        this.setting.beep.effect = effect;
        this.setting.beep.customURL = customURL;
        this.setting.captcha.enabled = enabledAPI;
        this.setting.captcha.apiURL = apiURL;
    }

    showSetting() {
        let vMute = this._tree.setting.video.muting;
        let bMute = this._tree.setting.beep.muting;
        let vVolume = this._tree.setting.video.volume;
        let bVolume = this._tree.setting.beep.volume;
        let vAutoplay = this._tree.setting.video.autoplay;
        let txtURL = this._tree.setting.beep.beepURL;
        let whitelist = this._tree.setting.advanced.whitelist;
        let blacklist = this._tree.setting.advanced.blacklist;
        let btAPIEnabled = this._tree.setting.advanced.btAPIEnabled;
        let apiURL = this._tree.setting.advanced.apiURL;

        if(this.setting.video.muted) {
            vMute.classList.add('muted');
            vVolume.setAttribute('value', this.setting.video.volume);
            vVolume.value = 0;
        }
        else {
            this._setRange(vVolume, this.setting.video.volume);
        }
        if(this.setting.video.autoplay) vAutoplay.checked = true;
        if(this.setting.beep.muted) {
            bMute.classList.add('muted');
            vVolume.setAttribute('value', this.setting.beep.volume);
            bVolume.value = 0;
        }
        else {
            this._setRange(bVolume, this.setting.beep.volume);
            if(this.setting.beep.volume < 50) this.showInfo('提示音音量过低', 6000);
        }
        switch(this.setting.beep.effect) {
            case 0:
                this._tree.setting.beep.beep1.checked = true;
                txtURL.disabled = true;
                break;
            case 1:
                this._tree.setting.beep.beep2.checked = true;
                txtURL.disabled = true;
                break;
            case 2:
                this._tree.setting.beep.beep3.checked = true;
                txtURL.disabled = true;
                break;
            case 3:
                this._tree.setting.beep.beep4.checked = true;
                txtURL.disabled = false;
        }
        txtURL.value = this.setting.beep.customURL;
        whitelist.value = this.setting.whitelist.join('\n');
        blacklist.value = this.setting.blacklist.join('\n');
        btAPIEnabled.checked = this.setting.captcha.enabled;
        if(this.setting.captcha.enabled) apiURL.disabled = false;
        else apiURL.disabled = true;
        apiURL.value = this.setting.captcha.apiURL;
    }

    beep(src='') {
        if(this.setting.beep.muted || this.setting.data.finished) return;

        if(src) {
            this._elBeep.src = src;
        }
        else if(this.setting.beep.effect == 3) {
            this._elBeep.src = this.setting.beep.customURL;
        }
        else {
            this._elBeep.src = this.beepURLs[this.setting.beep.effect];
        }
        this._elBeep.volume = this.setting.beep.volume / 100;
        if(this._beepCount < 3) {
            this._elBeep.muted = true;
            this._elBeep.play();
            setTimeout(() => {
                this._elBeep.muted = false;
            }, 10);
        }
        else {
            this._elBeep.play();
        }
        this._beepCount++;
    }

    loopBeep(times=3, interval=1000) {
        let i = 0;

        if(times <= 1) {
            this.beep();
            return;
        }

        let val = setInterval(() => {
            if(i++ < times) this.beep();
            else val && clearInterval(val);
        }, interval);

        return val;
    }

    beepTip() { // 组合提示音
        this._timers.a = this.loopBeep(3, 2000);
        this._timers.c = setTimeout(() => {
            this._timers.b = this.loopBeep(5, 10000);
        }, 30000);
    }

    clearBeepTip() {
        this._timers.a && clearInterval(this._timers.a);
        this._timers.b && clearInterval(this._timers.b);
        this._timers.c && clearTimeout(this._timers.c);
    }

    showInfo(msg, timeout=3000) {
        let elTip = document.createElement('span');

        elTip.className = 'msgbox-info';
        elTip.innerText = 'Ⓘ ' + msg;
        this._tree.msgbox.appendChild(elTip);
        setTimeout(() => {
            elTip.style.opacity = 0;
        }, timeout - 800);
        setTimeout(() => {
            elTip.style.display = 'none';
        }, timeout);

        return true;
    }

    showError(id, msg, timeout=5000) {
        let elTip = document.createElement('span');

        elTip.className = 'msgbox-error';
        elTip.innerText = `⚠ 错误 ID: ${id}, 描述: ${msg}.`;
        this._tree.progress.table.caption.innerText = `⚠ ${msg} ⚠`;
        this._tree.progress.table.caption.title = `⚠ 错误 ID: ${id}, 描述: ${msg}.`;
        this._tree.progress.table.caption.style.color = 'red';
        this._tree.msgbox.appendChild(elTip);
        setTimeout(() => {
            elTip.style.opacity = 0;
        }, timeout - 800);
        setTimeout(() => {
            elTip.style.display = 'none';
        }, timeout);

        return false;
    }

    simulateMouseMove(element) {

    }

    refreshClick() {
        if(!this._courseData && !this._courseData.courseId) return this.showError('#002', '不支持的页面');

        this.showInfo('正在检查进度...');
        let courseData = this.checkPage();

        if(courseData) {
            this._courseData = courseData;
            this.showCourseData(courseData);
            // 刷新计时器
            if(this._timers.d) {
                clearTimeout(this._timers.d);
                this._timers.d = null;
            }
            let surplusTime = this._videoData.totalTime - this._videoData.submitTime - this._videoData.validTime;
            this._timers.d = setTimeout(() => {
            }, parseInt(surplusTime > 0? surplusTime + 3: 0) * 1000);
        }
        else {
            this.showInfo('刷新失败');
        }
    }

    furureTime(sec=0) {
        /**
         * 返回当前时间(hh:mm:ss)加 sec 后的时间
         */
        let date = new Date();
        let sTime = date.toJSON().match(/\d\d:\d\d:\d\d/)[0];
        let time = this.parseSec(sTime);

        return this.formatSec(time + sec);
    }

    parseSec(sTime="00:00:00") {
        /**
         * 函数名: parseSec()
         * 说明: 把时间格式的字符串转换为秒数.*/
        let sec = 0;
        if(sTime != "" && !isNaN(Date.parse("1970-1-1 " + sTime))) { //判断是否是时间格式
            let t = sTime.split(":");
            sec += parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + parseInt(t[2]);
        }
        else return -1;

        return sec;
    }

    formatSec(sec=0) {
        /**
         * 函数名: formateSec()
         * 说明: 把秒数转换为时间格式的字符串.*/
        return (new Date(sec * 1000).toTimeString().slice(0, 8));
    }

    img2b64(elImg, width=90, height=40) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        let ctx1 = canvas.getContext("2d");
        ctx1.drawImage(elImg, 0, 0, width, height);

        return canvas.toDataURL();
    }

    parseCaptcha(elImg) {
        let xhr = new XMLHttpRequest();
        let formdata = new FormData();
        let code = '';

        let b64 = this.img2b64(elImg, elImg.width, elImg.height);
        formdata.append('img', b64);

        xhr.open('POST', this.setting.captcha.apiURL, false);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                try {
                    code = JSON.parse(xhr.responseText).code;
                }
                catch(e) {}
            }
        };
        try {
            xhr.send(formdata);
        }
        catch(e) {
            return '';
        }

        return code;
    }

    handleCaptcha() {
        this.showInfo('正在识别验证码...', 5000);

        let t1 = null, t2 = null;
        t1 = setTimeout(() => {
            try {
                let elImg = document.querySelector('#layui-layer1 > div.layui-layer-content > div > div:nth-child(2) > img:nth-child(4)');
                let elInput = document.querySelector('#layui-layer1 > div.layui-layer-content > div > div:nth-child(2) > input[type=text]:nth-child(2)');
                let elSubmit = document.querySelector('#layui-layer1 > div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0');
                let code = this.parseCaptcha(elImg);
                let eMousedown = new MouseEvent('mousedown');

                if(!code) {
                    this.showError('#009', '验证码识别失败');
                    return false;
                }
                this.showInfo('验证码识别成功');
                // 模拟触发 mousedown 事件, 执行其内部代码, 防止被服务器检测
                elInput.dispatchEvent(eMousedown);
                elInput.value = code;
                elSubmit.click();
                setTimeout(() => {
                    if(this.elVideo.paused) this.elVideo.play();
                }, 2500);
            }
            catch(e) {
                this.showError('#007', '验证码识别失败');
                this.beepTip();
            }
        }, 5000);
        t2 = setTimeout(() => {
            if(this.elVideo.paused) {
                window.location.reload();
            }
        }, 10000);
    }

    getCourseID() {
        /**
         * 爬取网页源码中的课程 ID, 用于请求课程数据
         */
        let courseId = '';

        try {
            courseId = document.querySelector('#wrapper > div.curPlace > div.center > a:last-child').href.match(/(?<=courseId=)\d+/)[0];
        }
        catch(err) {}

        return courseId;
    }

    request(courseId, page=1) {
        /**
         * 描述: 从服务器获取课程数据(JSON)
         * 请求模式: 同步
         */
        let xhttp = new XMLHttpRequest();
        let url = `/user/study_record.json?courseId=${courseId}&page=${page}&_=${(new Date()).valueOf()}`;
        let result = null;

        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                result = JSON.parse(xhttp.responseText);
            }
        };
        xhttp.open('get', url, false);
        xhttp.send();

        return result;
    }

    checkPage(page=1, pageCount=1) {
        /**
         * 跳转未完成页面, 返回对应课程数据
         */
        let courseId = this.getCourseID();

        if(!courseId) return this.showError('#003', 'courseId 获取失败');
        if(this.setting.data.courseId == courseId) {
            page = this.setting.data.page;
            pageCount = this.setting.data.pageCount;
        }

        for(; page <= pageCount; page++) {
            this.showInfo(`请求数据, courseId: ${courseId}, page: ${page}`);
            let json = this.request(courseId, page);

            if(json && json.status) {
                this.showInfo('数据请求成功');
                pageCount = json.pageInfo.pageCount;
                for(let courseData of json.list) { // 查找未完成页面
                    if(courseData.state.match(/(未学完|未学)/)) {
                        let currentNodeID = document.location.href.match(this.regexs.nodeId)[0];
                        let newNodeID = courseData.url.match(this.regexs.nodeId)[0];
                        let index = json.list.indexOf(courseData);
                        let nextCourse = json.list[index + 1];

                        if(currentNodeID != newNodeID) { // 本节已完成 跳转未完成页面
                            window.open(courseData.url, '_self');
                            // 立即退出循环, 防止 window.open() 重复请求
                            return this.showInfo('正在跳转新页面...');
                        }
                        // 当前页面为未完成, 添加页面信息方便后续处理
                        courseData.page = json.pageInfo.page;
                        courseData.pageCount = json.pageInfo.pageCount;
                        courseData.index = json.pageInfo.page * 20 - 20 + index;
                        courseData.recordsCount = json.pageInfo.recordsCount;
                        if(nextCourse) courseData.nextURL = nextCourse.url;

                        // 保存页码减少重复请求
                        this.setting.data.courseId = courseId;
                        this.setting.data.finished = false;
                        this.setting.data.page = page;
                        this.setting.data.pageCount = json.pageInfo.pageCount;

                        this.saveSetting();

                        return courseData;
                    }
                }
            }
            else return this.showError('#004', '数据请求失败');
        }
        // 课程进度 100%
        this.HTML.style.color = 'black';
        this.HTML.style.backgroundColor = 'mediumseagreen';
        this.showInfo('该课程观看进度 100%');
        this._tree.progress.table.caption.innerText = '(已完成) ' + this._tree.progress.table.caption.innerText;
        this._tree.progress.table.caption.title = this._tree.progress.table.caption.innerText;
        this.beep(this.finishBeep);
        this.setting.data.finished = true;
        this.saveSetting();

        return false;
    }

    showCourseData() {
        this._tree.progress.table.caption.innerText = this._courseData.name;
        this._tree.progress.table.caption.title = this._courseData.name;
        this._tree.progress.table.cells[0].innerText = parseInt(this._courseData.viewCount) + 1;
        this._tree.progress.table.cells[1].set(this.parseSec(this._courseData.videoDuration));
        this._tree.progress.table.cells[2].set(this.parseSec(this._courseData.videoDuration) - this._courseData.duration);
        this._tree.progress.table.cells[3].innerText = this._courseData.state.match(/(未学完|未学|已学)/)[0];
        this._tree.progress.table.cells[4].set(0);
        this._tree.progress.table.cells[5].innerText = this.furureTime(this.parseSec(this._courseData.videoDuration) - this._courseData.duration);
        this._tree.progress.table.cells[6].innerText = `${this._courseData.index}/${this._courseData.recordsCount} (${(this._courseData.index / this._courseData.recordsCount * 100).toFixed(2)}%)`;
    }

    listeningVideo() {
        let elVideo = document.querySelector('video');

        if(this.setting.data.finished) return;
        if(!elVideo) return this.showError('#005', '未获取视频对象');
        // if(elVideo.src != this._courseData.localFile) return this.showError('#006', '视频 URL 不匹配');
        this.showInfo('开始监听视频对象');

        // 初始化数据
        this._videoData.totalTime = this.parseSec(this._courseData.videoDuration);
        this._videoData.submitTime = parseInt(this._courseData.duration);
        this._timers.d = null; // 超时查询进度

        // 绑定事件
        let pos1 = parseInt(elVideo.currentTime), pos2 = 0;
        elVideo.addEventListener('timeupdate', () => {
            let pos2 = parseInt(elVideo.currentTime);

            if(pos2 >= pos1 + 1) { // 经过 1s
                pos1 = pos2;

                this._tree.progress.table.cells[2].set(this._videoData.totalTime - this._videoData.submitTime - this._videoData.validTime++);
            }
        });
        elVideo.addEventListener('play', () => {
            if(!this._timers.d) { // 超时查询进度
                let surplusTime = this._videoData.totalTime - this._videoData.submitTime - this._videoData.validTime;

                this._timers.d = setTimeout(() => {
                    this.refreshClick();
                }, parseInt(surplusTime + 3) * 1000);
                // 刷新预计完成时间
                this._tree.progress.table.cells[5].innerText = this.furureTime(surplusTime + 3);
            }
            this.clearBeepTip();
        });
        elVideo.addEventListener('pause', () => {
            if(this._timers.d) {
                clearTimeout(this._timers.d);
                this._timers.d = null;
            }

            let t1 = false, t2 = document.querySelector('div.layui-layer > div.layui-layer-content'), t3 = 0;
            if(elVideo.ended) { // 视频播放结束
                this.refreshClick();
            }
            else if(t2 && t2.innerText == '提交学习时长失败,请检查网络状态是否正常！') { // 网络故障提交失败
                if(++t3 >= 3) {
                    this.beepTip();
                    this.showInfo('网络情况不佳, 脚本已暂停', 15000);
                    setTimeout(() => {
                        if(!elVideo.paused) t3 =0;
                    }, 300000);
                }
                else {
                    document.querySelector('div.layui-layer > div.layui-layer-btn > a').click();
                    this.elVideo.play();
                }
            }
            else if(!t1 && elVideo.currentTime < 3) { // 处理验证码
                t1 = true;

                if(this.setting.captcha.enabled) this.handleCaptcha();
            }
            else { // 未知错误
                this.beepTip();
            }
        });
        // 监听鼠标移动事件
        document.body.onmousemove = () => {
            this.clearBeepTip();
        };

        this.elVideo = elVideo;

        this.showCourseData();
    }

    _matching() {
        let matched = false;

        if(this.setting.blacklist.indexOf(document.location.hostname) >= 0) {
            matched = false;
        }
        else if(this.setting.whitelist.indexOf(document.location.hostname) >= 0) {
            matched = true;
        }
        else {
            for(let href of this.regexs.originalHostMatch) {
                if(document.location.hostname.search(href) === 0) matched = true;
            }
        }

        if(matched) { // 元匹配或白名单
            if(this.setting.whitelist.indexOf(document.location.hostname) >= 0) { // 白名单
                GM_registerMenuCommand('❌ 将此网站移出白名单', () => {
                    this.setting.whitelist = this.setting.whitelist.filter(x => {return x != document.location.hostname});
                    this.saveSetting();
                    window.location.reload();
                });
            }
            else { // 元匹配
                GM_registerMenuCommand('❌ 将此网站加入黑名单', () => {
                    this.setting.blacklist.push(document.location.hostname);
                    this.saveSetting();
                    window.location.reload();
                });
            }
        }
        else { // 未识别或黑名单
            if(this.setting.blacklist.indexOf(document.location.hostname) >= 0) { // 黑名单
                GM_registerMenuCommand('✅ 将此网站移出黑名单', () => {
                    this.setting.blacklist = this.setting.blacklist.filter(x => {return x != document.location.hostname});
                    this.saveSetting(false);
                    window.location.reload();
                });
            }
            else { // 未识别页面
                GM_registerMenuCommand('✅ 将此网站加入白名单', () => {
                    this.setting.whitelist.push(document.location.hostname);
                    this.saveSetting(false);
                    window.location.reload();
                });
            }
        }
        return matched;
    }

    exec() {
        this.loadSetting();
        if(!this._matching()) return;

        this.showGUI();
        this.showSetting();
        if(this.pathnames.indexOf(document.location.pathname) > -1) {
            let courseData = this.checkPage();

            if(courseData) {
                this._courseData = courseData;
                // 设置主计时器
                let t1 = false, t2 = false;
                this._timers.mainTimer.id = setInterval(() => {
                    if(!t2 && document.querySelector('video')) { // 视频加载
                        t2 = true;
                        this.listeningVideo();
                    }
                    if(!t1 && this.elVideo && this.elVideo.readyState === 4) { // 视频就绪
                        t1 = true;
                        // 应用视频设置
                        this.elVideo.currentTime = 0;
                        this.elVideo.volume = this.setting.video.volume / 100;
                        if(this.setting.video.autoplay) {
                            // 静音状态下播放视频, 防止浏览器报错
                            this.elVideo.muted = true;
                            this.elVideo.play();
                        }
                        this.elVideo.muted = this.setting.video.muted;
                        this.elVideo.playbackRate = 1;
                    }
                    this._tree.progress.table.cells[4].set(++this._timers.mainTimer.value);
                }, 1000);
            }
        }
        else {
            this.showError('#001', '不支持的页面');
        }
    }
}


(function() {
    'use strict';

    let app = new YHAssistant();

    app.exec();
})();
