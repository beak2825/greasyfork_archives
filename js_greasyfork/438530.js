// ==UserScript==
// @name              哔哩哔哩链接识别助手
// @namespace         https://github.com/yalwolf/bilibiliurl
// @version           1.3.9
// @author            一只阿狼哒
// @icon              https://js.alwolf.cn/images/bilibiliurl.png
// @icon64            https://js.alwolf.cn/images/bilibiliurl.png
// @description       AI智能识别选中文字中的哔哩哔哩链接【视频】【动态】等。
// @license           AGPL
// @homepage          https://js.alwolf.cn/
// @supportURL        https://github.com/yalwolf/bilibiliurl
// @match             *://*/*
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at            document-end
// @grant             GM_openInTab
// @grant             unsafeWindow
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/438530/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438530/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fixedStyle = ['www.baidu.com']; //弹出框错乱的网站css插入到<html>而非<head>
    const customClass = {
        container: 'panai-container',
        popup: 'panai-popup',
        header: 'panai-header',
        title: 'panai-title',
        closeButton: 'panai-close',
        icon: 'panai-icon',
        image: 'panai-image',
        content: 'panai-content',
        htmlContainer: 'panai-html',
        input: 'panai-input',
        inputLabel: 'panai-inputLabel',
        validationMessage: 'panai-validation',
        actions: 'panai-actions',
        confirmButton: 'panai-confirm',
        denyButton: 'panai-deny',
        cancelButton: 'panai-cancel',
        loader: 'panai-loader',
        footer: 'panai-footer'
    };

    let util = {
        clog(c) {
            console.group('[哔哩哔哩链接识别助手]');
            console.log(c);
            console.groupEnd();
        },

        parseQuery(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        include(str, arr) {
            for (let i = 0, l = arr.length; i < l; i++) {
                let val = arr[i];
                if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                    return true;
                }
            }
            return false;
        },

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            let root = this.include(location.href, fixedStyle);
            root ? doc.documentElement.appendChild(style) : doc.getElementsByTagName('head')[0].appendChild(style);
        },

        isHidden(el) {
            try {
                return el.offsetParent === null;
            } catch (e) {
                return false;
            }
        }
    };

    let opt = {
        bilibilisp: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/video\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili视频',
            storage: 'hash'
        },
        bilibilivideo: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/medialist\/play\/(?:[A-Za-z0-9]+\/[A-Za-z0-9]+\?oid=)?[0-9]+\&otype=2)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili视频',
            storage: 'hash'
        },
        bilibilitbsp: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/festival\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili专属页',
            storage: 'hash'
        },
        bilibilifj: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/bangumi\/play\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili番剧/纪录片/动画',
            storage: 'hash'
        },
        bilibilitvb: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/bangumi\/media\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili番剧/纪录片/动画介绍页',
            storage: 'hash'
        },
        bilibilimh: {
            reg: /((?:https?:\/\/)?manga\.bilibili\.com\/detail\/[A-Za-z0-9]+)/,
            host: /manga\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili漫画',
            storage: 'hash'
        },
        bilibililive: {
            reg: /((?:https?:\/\/)?live\.bilibili\.com\/[0-9]+)/,
            host: /live\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili直播间',
            storage: 'hash'
        },
        bilibilikt: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/cheese\/play\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili课堂',
            storage: 'hash'
        },
        bilibiliau: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/audio\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili音频',
            storage: 'hash'
        },
        bilibilird: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/read\/[A-Za-z0-9]+)/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili专栏',
            storage: 'hash'
        },
        bilibiliup: {
            reg: /((?:https?:\/\/)?space\.bilibili\.com\/[0-9]+)/,
            host: /space\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili用户',
            storage: 'hash'
        },
        bilibilidt: {
            reg: /((?:https?:\/\/)?t\.bilibili\.com\/[0-9]+)/,
            host: /t\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili动态',
            storage: 'hash'
        },
        b23tv: {
            reg: /((?:https?:\/\/)?\/b23\.tv\/[A-Za-z0-9]+)/,
            host: /b23\.tv/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili短链接',
            storage: 'hash'
        },
        bilibiligame: {
            reg: /((?:https?:\/\/)?game\.bilibili\.com\/[A-Za-z_\-]+)/,
            host: /game\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili游戏',
            storage: 'hash'
        },
        biligame: {
            reg: /((?:https?:\/\/)?www\.biligame\.com\/(?:detail\/\?id=)?[0-9]+)/,
            host: /www\.biligame\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili游戏',
            storage: 'hash'
        },
        bilishow: {
            reg: /((?:https?:\/\/)?show\.bilibili\.com\/(?:platform\/detail.html\?id=)?[0-9]+)/,
            host: /show\.biligame\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili会员购',
            storage: 'hash'
        },
        bilibilijc: {
            reg: /((?:https?:\/\/)?www\.bilibili\.com\/blackboard\/activity-[A-Za-z0-9]+).html/,
            host: /www\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili活动',
            storage: 'hash'
        },
        bilibiligy: {
            reg: /((?:https?:\/\/)?love\.bilibili\.com\/(?:detail\?uuid=)?[A-Za-z0-9_\-]+)/,
            host: /love\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili公益',
            storage: 'hash'
        },
        bilibiliwiki: {
            reg: /((?:https?:\/\/)?wiki\.biligame\.com\/?(?:[A-Za-z0-9\-.]+)?\/[A-Za-z0-9_\-\%]+)/,
            host: /wiki\.biligame\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili百科',
            storage: 'hash'
        },
        biliworkshop: {
            reg: /((?:https?:\/\/)?workshop\.bilibili\.com\/?(?:[A-Za-z0-9\-.]+)?\/[A-Za-z0-9_\-\%]+)/,
            host: /workshop\.bilibili\.com/,
            input: ['#accessCode'],
            button: ['#submitBtn'],
            name: 'bilibili创意工坊',
            storage: 'hash'
        },
    };

    let main = {
        lastText: "lorem&",

        //初始化配置数据
        initValue() {
            let value = [{
                name: 'setting_success_times',
                value: 0
            }, {
                name: 'setting_auto_click_btn',
                value: true
            }, {
                name: 'setting_active_in_front',
                value: true
            }, {
                name: 'setting_timer_open',
                value: false
            }, {
                name: 'setting_timer',
                value: 5000
            }];

            value.forEach((v) => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value);
                }
            });
        },

        // 监听选择事件
        addPageListener() {
            document.addEventListener("mouseup", this.smartIdentify.bind(this), true);
        },

        smartIdentify() {
            let selection = unsafeWindow.getSelection();
            let text = selection.toString();
            if (text !== this.lastText && text !== '') { //选择相同文字或空不识别
                let start = performance.now();
                this.lastText = text;
                //util.clog(`当前选中文字：${text}`);
                let linkObj = this.parseLink(text);
                let link = linkObj.link;
                let name = linkObj.name;
                let pwd = this.parsePwd(text);
                if (!link) {
                    linkObj = this.parseParentLink(selection);
                    link = linkObj.link;
                    name = linkObj.name;
                }
                if (link) {
                    if (!/https?:\/\//.test(link)) {
                        link = 'https://' + link;
                    }
                    let end = performance.now();
                    let time = (end - start).toFixed(3);
                    util.clog(`文本识别结果：${name} 链接：${link} 耗时：${time}毫秒`);
                    let option = {
                        toast: true,
                        showCancelButton: true,
                        position: 'top',
                        title: `发现<span style="color: #2778c4;margin: 0 5px;">哔哩哔哩</span>链接`,
                        html: `<div>链接：<span style="color:blue;font-size: 0.8em;">${link}</span></div>
                        <div>标题：<span style="color:#000;font-size: 0.8em;">!开发中</span></div>
                        <div>类型：<span style="color:blue;font-size: 0.8em;">${name}</span></div>
                        <span style="font-size: 0.8em;">是否打开</span><span style="color:#000;font-size: 0.8em;">’？</span>`,
                        confirmButtonText: '打开',
                        cancelButtonText: '关闭',
                        customClass
                    };
                    if (util.getValue('setting_timer_open')) {
                        option.timer = util.getValue('setting_timer');
                        option.timerProgressBar = true;
                    }
                    util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);

                    Swal.fire(option).then((res) => {
                        this.lastText = 'lorem&';
                        selection.empty();
                        if (res.isConfirmed || res.dismiss === 'timer') {
                            if (name === '和彩云') {  //和彩云无法携带参数和Hash
                                util.setValue('tmp_caiyun_pwd', pwd);
                            }
                            if (pwd) {
                                let extra = `${link}?pwd=${pwd}#${pwd}`;
                                if (~link.indexOf('?')) {
                                    extra = `${link}&pwd=${pwd}#${pwd}`;
                                }
                                GM_openInTab(extra, {active: util.getValue('setting_active_in_front')});
                            } else {
                                GM_openInTab(`${link}`, {active: util.getValue('setting_active_in_front')});
                            }
                        }
                    });
                }
            }
        },

        //正则解析网盘链接
        parseLink(text = '') {
            let obj = {name: '', link: ''};
            if (text) {
                for (let name in opt) {
                    let val = opt[name];
                    if (val.reg.test(text)) {
                        let matches = text.match(val.reg);
                        obj.name = val.name;
                        obj.link = matches[0];
                        return obj;
                    }
                }
            }
            return obj;
        },

        //正则解析超链接类型网盘链接
        parseParentLink(selection) {
            let anchorNode = selection.anchorNode.parentElement.href;
            let focusNode = selection.focusNode.parentElement.href;
            if (anchorNode) return this.parseLink(anchorNode);
            if (focusNode) return this.parseLink(focusNode);
            return this.parseLink()
        },

        //正则解析提取码
        parsePwd(text) {
            text = text.replace(/#/, '');
            let reg = /#/;
            if (reg.test(text)) {
                let match = text.match(reg);
                return match[0];
            }
            return '';
        },

        //根据域名检测网盘类型
        panDetect() {
            let hostname = location.hostname;
            for (let name in opt) {
                let val = opt[name];
                if (val.host.test(hostname)) {
                    return name;
                }
            }
            return '';
        },

        //自动填写密码
        autoFillPassword() {
            let url = location.href;
            let query = util.parseQuery('pwd');
            let hash = location.hash.slice(1);
            let pwd = query || hash;
            let panType = this.panDetect();

            for (let name in opt) {
                let val = opt[name];
                if (panType === name) {
                    if (val.storage === 'local') {
                        pwd = util.getValue(val.storagePwdName) ? util.getValue(val.storagePwdName) : '';
                        pwd && this.doFillAction(val.input, val.button, pwd);
                    }
                    if (val.storage === 'hash') {
                        if (!/^[A-Za-z0-9]{3,8}$/.test(pwd)) { //过滤掉不正常的Hash
                            return;
                        }
                        pwd && this.doFillAction(val.input, val.button, pwd);
                    }
                }
            }
        },

        doFillAction(inputSelector, buttonSelector, pwd) {
            let maxTime = 10;
            let ins = setInterval(async () => {
                maxTime--;
                let input = document.querySelector(inputSelector[0]) || document.querySelector(inputSelector[1]);
                let button = document.querySelector(buttonSelector[0]) || document.querySelector(buttonSelector[1]);

                if (input && !util.isHidden(input)) {
                    clearInterval(ins);
                    Swal.fire({
                        toast: true,
                        position: 'top',
                        showCancelButton: false,
                        showConfirmButton: false,
                        title: 'AI已识别到密码！正自动帮您填写',
                        icon: 'success',
                        timer: 2000,
                        customClass
                    });

                    let lastValue = input.value;
                    input.value = pwd;
                    //Vue & React 触发 input 事件
                    let event = new Event('input', {bubbles: true});
                    let tracker = input._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    input.dispatchEvent(event);

                    if (util.getValue('setting_auto_click_btn')) {
                        await util.sleep(1000); //1秒后点击按钮
                        button.click();
                    }
                } else {
                    maxTime === 0 && clearInterval(ins);
                }
            }, 800);
        },

        registerMenuCommand() {
            GM_registerMenuCommand('已识别：' + util.getValue('setting_success_times') + '次', () => {
                Swal.fire({
                    showCancelButton: true,
                    title: '确定要重置识别次数吗？',
                    icon: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass
                }).then((res) => {
                    this.lastText = 'lorem&';
                    if (res.isConfirmed) {
                        util.setValue('setting_success_times', 0);
                        history.go(0);
                    }
                });
            });
            GM_registerMenuCommand('介绍', () => {
                let html = `<div style="font-size: 1em;">
                              <label class="panai-setting-label"><a href="https://js.alwolf.cn"title="脚本丨主页" target="_blank" class="links" style="text-decoration:none;">主页</a></label>
                              <label class="panai-setting-label"><a href="https://js.alwolf.cn/js/updates/bilibiliurl"title="脚本丨检查更新" target="_blank" class="links" style="text-decoration:none;">检查更新</label>
                              <label class="panai-setting-label"><a href="https://js.alwolf.cn/tutorial/bilibiliurl"title="脚本丨教程" target="_blank" class="links" style="text-decoration:none;">使用教程</label>
                            </div>`;
                Swal.fire({
                    title: '识别助手介绍',
                    html,
                    icon: 'info',
                    showCloseButton: true,
                    confirmButtonText: '关闭',
                    footer: '<div id="footerBox">©2021&nbsp;Copyright:<a href="http://alwolf.cn"  title="一只阿狼哒丨主页" target="_blank" class="links" style="text-decoration:none;">一只阿狼哒</a></div>',
                    customClass
                }).then((res) => {
                    res.isConfirmed && history.go(0);
                });

                document.getElementById('S-Auto').addEventListener('change', (e) => {
                    util.setValue('setting_auto_click_btn', e.currentTarget.checked);
                });
                document.getElementById('S-Active').addEventListener('change', (e) => {
                    util.setValue('setting_active_in_front', e.currentTarget.checked);
                });
                document.getElementById('S-Timer-Open').addEventListener('change', (e) => {
                    util.setValue('setting_timer_open', e.currentTarget.checked);
                });
                document.getElementById('S-Timer').addEventListener('change', (e) => {
                    util.setValue('setting_timer', e.target.value);
                    document.getElementById('Timer-Value').innerText = `（${e.target.value / 1000}秒）`;
                });
            });
        },

        addPluginStyle() {
            let style = `
                .panai-container { z-index: 99999!important }
                .panai-popup { font-size: 14px !important }
                .panai-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; text-align: center; }
                .panai-setting-checkbox { width: 16px;height: 16px; }
                .links{color:#000;}
            `;
            util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
            util.addStyle('panai-style', 'style', style);
        },

        isTopWindow() {
            return window.self === window.top;
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.autoFillPassword();
            this.addPageListener();
            this.isTopWindow() && this.registerMenuCommand();
        },
    };

    main.init();
})();
