// ==UserScript==
// @name              网盘快开助手
// @namespace         https://github.com/maimierjiafude/KK_OpenPanHelper
// @version           2.0.1
// @author            龙龙龙
// @description       划一划，快速打开文本中的网盘链接，支持20+网盘，能自动提取提取码和解压密码。同时为了防止忘记链接相关信息，还会整合提取码和解压密码在链接里面，更有解压密码提示助手，在浏览器的历史记录里面打开，就会跳出提醒框，一键复制解压密码！！！。以及有分享的KK链接，要说的都在链接里面，插件全帮你搞定，直接网址打开无需多言（对方也要装网盘快开插件才行）。还有前后台打开模式，快开和弹窗模式，设置最适合自己的。沉浸式上网冲浪！（对于部分国内无法打开的网站，换源成我个人认为国内做的比较好的crx商店了，望周知）
// @license           AGPL-3.0-or-later
// @supportURL        https://github.com/maimierjiafude/KK_OpenPanHelper
// @match             *://*/*
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at            document-idle 
// @grant             GM_openInTab
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM_setClipboard
// @grant             GM_info
// @icon              data:image/svg+xml;base64,PHN2ZyB0PSIxNjczOTcwMjM5NTk1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MTMiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNDcwLjIyOTMzMyA0NDkuMTA5MzMzbDY0IDAuMTA2NjY3TDUzMy4zMzMzMzMgOTQ5LjM5NzMzM2wtNjQtMC4xMjggMC44OTYtNTAwLjE2eiBtMzIuMjEzMzM0LTM4OC4yNjY2NjZsMTkwLjE4NjY2NiAxOTUuMDA4djE1Ni40OGwxOTUuNTYyNjY3IDE5NS41NjI2NjZWNzQ4LjhoLTE5NS45NDY2Njd2OTAuOTg2NjY3aC02NHYtMTE4Ljc0MTMzNGgwLjM4NFYyODEuODc3MzMzbC0xMjYuMTg2NjY2LTEyOS4zODY2NjYtMTI2LjE2NTMzNCAxMjkuMzY1MzMzIDAuOTE3MzM0IDQ2Ni4xMzMzMzNoLTAuMjk4NjY3djkxLjc5NzMzNGgtNjR2LTkxLjc5NzMzNEgxMTcuMzMzMzMzdi0xNDAuMDk2bDE5NS4yLTE5NS4yMjEzMzMtMC4yOTg2NjYtMTU2LjggMTkwLjIwOC0xOTUuMDI5MzMzeiBtMTkwLjE4NjY2NiA0NDIuMDA1MzMzVjY4NC44aDEzMS41NjI2Njd2LTUwLjM4OTMzM2wtMTMxLjU2MjY2Ny0xMzEuNTYyNjY3eiBtLTM3OS45MjUzMzMgMC4xNzA2NjdMMTgxLjMzMzMzMyA2MzQuMzg5MzMzdjQ5LjZoMTMxLjczMzMzNGwtMC4zNjI2NjctMTgwLjk3MDY2NnoiIGZpbGw9IiMxNjc3RkYiIHAtaWQ9IjE0MTQiPjwvcGF0aD48L3N2Zz4=
// @downloadURL https://update.greasyfork.org/scripts/460184/%E7%BD%91%E7%9B%98%E5%BF%AB%E5%BC%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/460184/%E7%BD%91%E7%9B%98%E5%BF%AB%E5%BC%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 在addPluginStyle里面配置style
    // 对于一些部件自定义调节css样式，可以防止和其他插件撞样式
    const customClass = {
        container: 'KK-PanHelper-container',
        popup: 'KK-PanHelper-popup',
        htmlContainer: 'KK-PanHelper-htmlContainer',
        title: 'KK-PanHelper-title',
        actions: 'KK-PanHelper-actions',
    };

    // 工具汇总
    let util = {

        // 控制台成组输出，便于查找到log
        clog(value, name = '打印：') {
            console.group("%c %c [网盘快开助手]", `background:url(${GM_info.script.icon}) center center no-repeat;background-size:12px;padding:3px`, "");
            console.log(name, value);
            console.groupEnd();
        },


        // 弹出框添加样式
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let styleDom = document.getElementById(id);
            if (styleDom) return;
            let style = document.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        // 存值取值
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        // 睡眠时间，可以和await async 配合使用
        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        isHidden(el) {
            try {
                return el.offsetParent === null;
            } catch (e) {
                return false;
            }
        },

        // 构造的querySelector选择器，传入的参数可以是数组或者字符串
        query(selector) {
            if (Array.isArray(selector)) {
                let obj = null;
                for (let i = 0; i < selector.length; i++) {
                    let o = document.querySelector(selector[i]);
                    if (o) {
                        obj = o;
                        break;
                    }
                }
                return obj;
            }
            return document.querySelector(selector);
        },

        formatPanText(pan_obj) {
            let pan_text =
                '网盘：' + pan_obj.pan_name + '\n' +
                '链接：' + pan_obj.link + '\n' +
                (!!pan_obj.pwd ? '提取码：' + pan_obj.pwd + '\n' : '\n') +
                (!!pan_obj.zip ? '解压密码：' + pan_obj.zip : '')

            return pan_text;
        }
    };

    //弹窗事件汇总
    let popupNotifications = {

        // 快开模式下的复制提示弹窗，便于复制，不然复制不到，选中就打开了，悲
        copyPN(pan_obj) {
            let formatText = util.formatPanText(pan_obj);
            Swal.fire({
                toast: true,
                showCancelButton: true,
                position: 'top',
                title: `<span style="color: #2778c4;margin: 0 5px;">网盘快开助手(此窗口可设置不显示)</span>`,
                html: `<span style="font-size: 0.8em;display:block">  ${formatText.replace(/\n/g, '<br>')}  </span>`,
                confirmButtonText: '复制KK链接',
                cancelButtonText: '关闭',
                customClass
            }).then((res) => {
                if (res.isConfirmed || res.dismiss === 'timer') {
                    GM_setClipboard(main.kkLink(pan_obj));
                };
            });
        },

        // 弹窗模式下的打开提示弹窗，检测到链接，是否打开
        // 按钮弹窗
        openPN(pan_obj) {
            Swal.fire({
                toast: true,
                showCancelButton: true,
                position: 'top',
                title: `发现<span style="color: #2778c4;margin: 0 5px;">${pan_obj.pan_name}</span>链接`,
                html: `<span style="font-size: 0.8em;">${!!pan_obj.pwd ? '密码：' + pan_obj.pwd : '是否打开？'}</span>`,
                confirmButtonText: '打开',
                cancelButtonText: '关闭',
                customClass
            }).then((res) => {
                if (res.isConfirmed || res.dismiss === 'timer') {
                    let url = main.kkLink(pan_obj)
                    main.openHTML(url);
                };
            });
        },

        zipPN(url, zip) {
            Swal.fire({
                toast: true,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: '复制KK链接',
                cancelButtonText: '关闭',
                position: 'top-start',
                padding: '1px',
                width: '300px',
                title: `<span style="color: #2778c4;margin: 0px;font-weight:bold">解压密码：${zip} </span><button id="KK_zipButton" style="width:60px;height:25px;cursor: pointer;border:none;border-radius: 2px;background: red; text-align: center;color: white;">复 制</button>`,
                customClass
            }).then((res) => {
                if (res.isConfirmed) {
                    GM_setClipboard(url);
                }
            })

            document.getElementById("KK_zipButton").addEventListener('click', () => {
                GM_setClipboard(zip);
                document.getElementById("KK_zipButton").innerHTML = "已复制";
            });



        },

        contactPN() {
            Swal.fire({
                toast: false,
                title: '💬 反馈 & 建议',
                icon: 'success',
                html: `
                    打开<a style="color:blue;margin-right:5px;margin-left:5px;text-decoration: underline;font-weight: bold" href="https://github.com/maimierjiafude/KK_OpenPanHelper" target="_blank">Github</a>发Issue<br>
                    打开<a style="color:blue;margin-right:5px;margin-left:5px;text-decoration: underline;font-weight: bold" href="https://github.com/maimierjiafude/KK_OpenPanHelper" target="_blank">GreasyFork</a>给我留言
                    `,
                showCloseButton: false,
                confirmButtonText: '好的',
                customClass
            })
        }
    };

    // 选项，网盘的正则，组件的打包内容
    // hash应该就是域名匹配，而local需要借助本地存储
    let opt = {
        'baidu': {
            reg: /((?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/(doc\/|enterprise\/)?(?:s\/[\w~]*(((-)?\w*)*)?|share\/\S{4,}))/,
            host: /(pan|e?yun)\.baidu\.com/,
            input: ['#accessCode', '.share-access-code', '#wpdoc-share-page > .u-dialog__wrapper .u-input__inner'],
            button: ['#submitBtn', '.share-access .g-button', '#wpdoc-share-page > .u-dialog__wrapper .u-btn--primary'],
            name: '百度网盘',
            storage: 'hash'
        },
        'aliyun': {
            reg: /((?:https?:\/\/)?(?:(?:www\.)?aliyundrive\.com\/s|alywp\.net)\/[a-zA-Z\d]+)/,
            host: /www\.aliyundrive\.com|alywp\.net/,
            input: ['form .ant-input', 'form input[type="text"]'],
            button: ['form .button--fep7l', 'form button[type="submit"]'],
            name: '阿里云盘',
            storage: 'hash'
        },
        'weiyun': {
            reg: /((?:https?:\/\/)?share\.weiyun\.com\/[a-zA-Z\d]+)/,
            host: /share\.weiyun\.com/,
            input: ['.mod-card-s input[type=password]'],
            button: ['.mod-card-s .btn-main'],
            name: '微云',
            storage: 'hash'
        },
        'lanzou': {
            reg: /((?:https?:\/\/)?(?:[a-zA-Z0-9\-.]+)?lanzou[a-z]\.com\/[a-zA-Z\d_\-]+)/,
            host: /(?:[a-zA-Z\d-.]+)?lanzou[a-z]\.com/,
            input: ['#pwd'],
            button: ['.passwddiv-btn', '#sub'],
            name: '蓝奏云',
            storage: 'hash'
        },
        'tianyi': {
            reg: /((?:https?:\/\/)?cloud\.189\.cn\/(?:t\/|web\/share\?code=)?[a-zA-Z\d]+)/,
            host: /cloud\.189\.cn/,
            input: ['.access-code-item #code_txt'],
            button: ['.access-code-item .visit'],
            name: '天翼云盘',
            storage: 'hash'
        },
        'caiyun': {
            reg: /((?:https?:\/\/)?caiyun\.139\.com\/(?:m\/i|w\/i\/|web\/|front\/#\/detail)\??(?:linkID=)?[a-zA-Z\d]+)/,
            host: /caiyun\.139\.com/,
            input: ['.token-form input[type=text]'],
            button: ['.token-form .btn-token'],
            name: '移动云盘',
            storage: 'local',
            storagePwdName: 'tmp_caiyun_pwd'
        },
        'xunlei': {
            reg: /((?:https?:\/\/)?pan\.xunlei\.com\/s\/[\w-]{10,})/,
            host: /pan\.xunlei\.com/,
            input: ['.pass-input-wrap .td-input__inner'],
            button: ['.pass-input-wrap .td-button'],
            name: '迅雷云盘',
            storage: 'hash'
        },
        '123pan': {
            reg: /((?:https?:\/\/)?www\.123pan\.com\/s\/[\w-]{6,})/,
            host: /www\.123pan\.com/,
            input: ['.ca-fot input'],
            button: ['.ca-fot button'],
            name: '123云盘',
            storage: 'hash'
        },
        '360': {
            reg: /((?:https?:\/\/)?(?:[a-zA-Z\d\-.]+)?yunpan\.360\.cn(\/lk)?\/surl_\w{6,})/,
            host: /yunpan\.360\.cn/,
            input: ['.pwd-input'],
            button: ['.submit-btn'],
            name: '360云盘',
            storage: 'hash'
        },
        '115': {
            reg: /((?:https?:\/\/)?115\.com\/s\/[a-zA-Z\d]+)/,
            host: /115\.com/,
            input: ['.form-decode input'],
            button: ['.form-decode .submit a'],
            name: '115网盘',
            storage: 'hash'
        },
        'cowtransfer': {
            reg: /((?:https?:\/\/)?(?:[a-zA-Z\d-.]+)?cowtransfer\.com\/s\/[a-zA-Z\d]+)/,
            host: /(?:[a-zA-Z\d-.]+)?cowtransfer\.com/,
            input: ['.receive-code-input input'],
            button: ['.open-button'],
            name: '奶牛快传',
            storage: 'hash'
        },
        'ctfile': {
            reg: /((?:https?:\/\/)?(?:[a-zA-Z\d-.]+)?ctfile\.com\/\w+\/[a-zA-Z\d-]+)/,
            host: /(?:[a-zA-Z\d-.]+)?ctfile\.com/,
            input: ['#passcode'],
            button: ['.card-body button'],
            name: '城通网盘',
            storage: 'hash'
        },
        'quark': {
            reg: /((?:https?:\/\/)?pan\.quark\.cn\/s\/[a-zA-Z\d-]+)/,
            host: /pan\.quark\.cn/,
            input: ['.ant-input'],
            button: ['.ant-btn-primary'],
            name: '夸克网盘',
            storage: 'local',
            storagePwdName: 'tmp_quark_pwd'
        },
        'flowus': {
            reg: /((?:https?:\/\/)?flowus\.cn\/[\S ^\/]*\/?share\/[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12})/,
            host: /flowus\.cn/,
            name: 'FlowUs息流',
            storage: 'hash'
        }
    };

    // 解析总类
    let parse = {

        // 记忆上一次的密码，从而防止选择完以后还触发相同事件
        lastText: "long",

        // 解析selection
        parseSelection(text) {
            let pan_obj = this.parseEngine(text);

            if (!pan_obj.link) {
                let nameAndLinkObj = this.parseALink(window.getSelection());
                if (nameAndLinkObj) {
                    pan_obj.pan_name = nameAndLinkObj.pan_name;
                    pan_obj.link = nameAndLinkObj.link;
                    if (nameAndLinkObj.pwd != '') {
                        (pan_obj.pwd != nameAndLinkObj.pwd) ? pan_obj.pwd = nameAndLinkObj.pwd : ''
                    }
                }
            };

            return pan_obj;
        },

        // 解析Clipboard
        parseClipboard(text) {
            let pan_obj = this.parseEngine(text);
            return pan_obj;
        },

        // 对于解析的总方法
        // 返回一个对象
        parseEngine(text) {
            let pan_obj = {
                pan_name: '',
                link: '',
                pwd: '',
                zip: '',
            };

            // 获取提取码
            let pwd = this.parsePwd(text);

            // 获取解压码
            pan_obj.zip = this.parseZipPasswords(text);

            // 文字替换
            text = this.textFliter(text);

            // 获取pan的名字和text中的link
            // pan_obj.pan_name, pan_obj.link = this.parseLink(text);
            // 返回值只能有一个。
            let nameAndLinkObj = this.parseLink(text);
            pan_obj.pan_name = nameAndLinkObj.pan_name;
            pan_obj.link = nameAndLinkObj.link;
            if (nameAndLinkObj.pwd) {
                (pwd != nameAndLinkObj.pwd) ? pwd = nameAndLinkObj.pwd : ''
            }

            pan_obj.pwd = pwd
            return pan_obj;

        },

        //正则解析超链接类型网盘链接
        // ⚠️可能会增加时间⚠️ 如果有需要可以增加选项
        // 获取选择内容的HTML和文本(增加兼容性) 或 DOM（节点遍历）
        // 使用chatGPT生成并修改
        parseALink(selection) {
            if (!selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const commonAncestor = range.commonAncestorContainer;
                if (typeof (commonAncestor.querySelector) !== 'undefined') {
                    const links = commonAncestor.querySelector('*[href]')
                    return this.parseLink(links ? links.href : "");
                }

            }
            return;
        },

        // 选中文字的替换规则
        textFliter(text) {
            if (text) {
                try {
                    text = decodeURIComponent(text);
                } catch {
                }
            };
            text = text.replace(/[点點]/g, '.');
            text = text.replace(/[\u4e00-\u9fa5\u200B()（）,，]/g, '');
            text = text.replace(/lanzous/g, 'lanzouw'); //修正lanzous打不开的问题
            return text
        },

        //正则解析提取码
        // 这里的?<=正向后发断言 看文档说JS不支持，但是目前呢能用，以后改吧
        parsePwd(text) {
            text = text.replace(/\u200B/g, '');
            let reg = /(?<=\s*(?:密|提取|访问|訪問|key|password|pwd|#)\s*[码碼]?\s*[：:=]?\s*)[a-zA-Z0-9]{3,8}\w/i;
            if (reg.test(text)) {
                let match = text.match(reg);
                return match[0];
            }

            return '';
        },

        //正则解析解压密码
        parseZipPasswords(text) {
            let zip_reg = /(?<=\s*(?:解压|解压密)\s*[码碼]\s*)[：:=]?\s*(.+?)\s/;
            if (zip_reg.test(text)) {
                let match = text.match(zip_reg);
                return match[1];
            }

            let zip_hash_reg = /#zip(.+)zip/;
            if (zip_hash_reg.test(text)) {
                let match = text.match(zip_hash_reg);
                return match[1];
            }

            return '';
        },

        // 正则解析链接
        parseLink(text) {
            let nameAndLinkObj = { pan_name: '', link: '', pwd: '' };

            for (let pan_name in opt) {
                let val = opt[pan_name];
                if (val.reg.test(text)) {
                    let matches = text.match(val.reg);
                    nameAndLinkObj.pan_name = val.name;
                    nameAndLinkObj.link = matches[0];
                    nameAndLinkObj.pwd = this.parsePwd(text)

                    if (val.replaceHost) {
                        nameAndLinkObj.link = nameAndLinkObj.link.replace(val.host, val.replaceHost);
                    }
                    return nameAndLinkObj;
                }
            };
            return nameAndLinkObj;
        },

        // 优化筛选输入的string，没有四个以上字母的通通抬走呢
        parsePreTextAndReturn(text) {

            if (text == this.lastText || text == '') {
                return;
            } else if (text.length > 1000) {
                return;
            }

            this.lastText = text;

            return true;
        },

        // 网址解析
        parseQuery(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = location.search.substring(1).match(reg);
            if (r != null) return (r[2]);

            return null;
        },

        // 专门为百度准备的解析，因为要本地存储比对
        parseBaiduLink(url) {
            let baidu_reg = /(?:https?:\/\/)?(?:e?yun|pan)\.baidu\.com\/(?:s\/|share\/init\?surl=)(.+?)(?:\?|&)/;
            if (baidu_reg.test(url)) {
                let match = url.match(baidu_reg);
                return match[1];
            }
            return;
        }

    };

    // 主要代码逻辑
    let main = {

        // 初始化配置数据
        // KK_setting_open_model false 快开模式;true 弹窗模式
        // KK_setting_active true 后台打开,false 新窗口打开
        // KK_setting_show_copyPN 是否显示快开模式的弹窗 yes 是
        // KK_local_data 需要本地保存的用于缓冲数据
        initValue() {
            let value = [{
                name: 'KK_setting_open_model',
                value: true
            }, {
                name: 'KK_setting_active',
                value: true
            }, {
                name: 'KK_setting_show_copyPN',
                value: true
            }, {
                name: 'KK_local_data',
                value: {
                    'url': '',
                    'code': '',
                    'zip': ''
                }
            }, {
                name: 'KK_setting_auto_copy',
                value: true
            }, {
                name: 'KK_setting_selection_active',
                value: true
            }];

            value.forEach((v) => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value);
                }
            });
        },

        // 监听选择事件
        addPageListener() {

            // 监听，mouseup并绑定函数
            // 绑定函数 document.onmouseup = () => {} 
            //document.addEventListener("mouseup", this.getSelectionAndParse.bind(this), true);
            document.addEventListener("mouseup", () => {
                this.root('selection', window.getSelection().toString())
            });

            // 粘贴事件选择
            window.addEventListener("paste", (e) => {
                let clipData = e.clipboardData || window.clipboardData;
                let clipText = clipData.getData("text/plain")
                this.root('paste', clipText);
            });

            // 快捷按键操作
            document.addEventListener("keydown", (e) => {
                this.pressKey(e)
            });
        },

        // 读取模式，并与之打开网页
        openHTML(url) {
            let active = util.getValue('KK_setting_active');
            if (url.indexOf('https') === -1) {
                url = 'https://' + url;
            }
            GM_openInTab(url, { active });
        },

        // 构造kk链接，返回一个url
        kkLink(pan_obj) {
            let pan_name = pan_obj.pan_name;
            let link = pan_obj.link;
            let pwd = pan_obj.pwd;
            let zip = pan_obj.zip;

            if (pan_name === 'caiyun') {  //移动云盘无法携带参数和Hash
                util.setValue('tmp_caiyun_pwd', pwd);
            }
            if (pan_name === 'quark') {
                util.setValue('tmp_quark_pwd', pwd);
            }

            let url = link;

            if (pwd) {
                let extra = `${link}?pwd=${pwd}#${pwd}`;
                if (~link.indexOf('?')) {
                    extra = `${link}&pwd=${pwd}#${pwd}`;
                }
                url = extra;
            }

            if (zip) {
                url = `${url}#zip${encodeURI(zip)}zip`
            }

            return url;
        },

        // 事件入口
        root(event, data = '') {
            let pan_obj = {};

            if (!parse.parsePreTextAndReturn(data)) {
                return;
            }

            // 粘贴事件
            if (event == 'paste') {
                pan_obj = parse.parseClipboard(data);
            };

            // 鼠标选中事件
            if (event == 'selection') {
                pan_obj = parse.parseSelection(data);
            };

            // 熔断机制
            if (!pan_obj.link) {
                return
            };

            util.clog(pan_obj)

            // (event == 'selection' ) ? window.getSelection().empty():'';

            let KK_setting_open_model = util.getValue('KK_setting_open_model');
            let KK_setting_show_copyPN = util.getValue('KK_setting_show_copyPN');
            let KK_setting_auto_copy = util.getValue('KK_setting_auto_copy');
            let KK_setting_selection_active = util.getValue('KK_setting_selection_active');

            let url = this.kkLink(pan_obj);

            if (event == 'selection' && KK_setting_selection_active) {
                window.getSelection().empty()
                parse.lastText = 'long';
            }

            if (KK_setting_auto_copy) {
                GM_setClipboard(url);
            };

            if (KK_setting_open_model) {
                this.openHTML(url)
                if (KK_setting_show_copyPN) {
                    popupNotifications.copyPN(pan_obj)
                };
            } else {
                popupNotifications.openPN(pan_obj)
            };

        },

        // 快捷键操作，Enter确定，Esc退出
        pressKey(event) {
            if (event.key === 'Enter') {
                let confirmBtn = document.querySelector('.KK-PanHelper-container .swal2-confirm');
                confirmBtn && confirmBtn.click();
            }
            if (event.key === 'Escape') {
                let cancelBtn = document.querySelector('.KK-PanHelper-container .swal2-cancel');
                cancelBtn && cancelBtn.click();
            }
        },

        //根据域名检测网盘类型,返回值是opt的key
        panDetectReturnName() {
            let hostname = location.hostname;
            for (let name in opt) {
                let val = opt[name];
                if (val.host.test(hostname)) {
                    return name;
                }
            }
            return
        },

        // 本地存储百度的特征码和解压密码
        saveBaiduData(baidu_save_code, zip) {
            console.log(123);
            if (baidu_save_code && zip) {
                util.setValue('KK_local_data', {
                    'code': baidu_save_code,
                    'zip': zip
                });
            }
        },

        // 监听url的hash变化,并且进行当前url的替换，在hash值里面加入解压密码
        watchUrlHashChange(zip) {
            if (("onhashchange" in window) && ((typeof document.documentMode === "undefined") || document.documentMode == 8)) {
                window.onhashchange = () => {
                    if (location.hash.toString().indexOf("#zip") == -1) {
                        location.hash = '#zip' + zip + 'zip' + location.hash
                    };
                };
            }
        },

        //自动填写密码
        autoFillPassword() {
            let panType = this.panDetectReturnName();

            let url = location.href;
            let pwd_query = parse.parseQuery('pwd');
            let pwd_hash = location.hash.slice(1);

            let baidu_save_code = parse.parseBaiduLink(url)

            let zip = '';
            let zip_hash_reg = /#zip(.+)zip/;
            if (zip_hash_reg.test(pwd_hash)) {
                zip = pwd_hash.match(zip_hash_reg)[1];
                zip = decodeURI(zip);
                pwd_hash = pwd_hash.replace((pwd_hash.match(zip_hash_reg)[0]), '');
            }

            let pwd = pwd_query || pwd_hash;

            for (let name in opt) {
                let val = opt[name];
                if (panType === name) {
                    if (val.storage === 'local') {
                        pwd = util.getValue(val.storagePwdName) ? util.getValue(val.storagePwdName) : '';
                        pwd && this.doFillAction(val.input, val.button, pwd);
                    }

                    if (val.storage === 'hash') {
                        if (!/^[a-zA-Z0-9]{3,8}$/.test(pwd)) { //过滤掉不正常的Hash
                            return;
                        }
                        pwd && this.doFillAction(val.input, val.button, pwd);
                    }
                }
            }

            baidu_save_code && this.saveBaiduData(baidu_save_code, zip)

            let baidu_data = util.getValue('KK_local_data');

            if (baidu_data.code && url.indexOf('baidu') != -1) {
                if ((url.indexOf(baidu_data.code) != -1) && !zip) {
                    zip = baidu_data.zip;
                    location.hash = '#zip' + zip + 'zip' + location.hash
                    url = location.href;
                };
            }


            if (zip && baidu_save_code) {
                this.watchUrlHashChange(zip);
            };

            zip && popupNotifications.zipPN(url, zip);

        },

        // 进行填写
        doFillAction(inputSelector, buttonSelector, pwd) {
            let maxTime = 10;
            // async函数才能使用await
            let ins = setInterval(async () => {
                maxTime--;
                let input = util.query(inputSelector);
                let button = util.query(buttonSelector);

                if (input && !util.isHidden(input)) {
                    clearInterval(ins);

                    let lastValue = input.value;
                    input.value = pwd;

                    //Vue & React 触发 input 事件
                    let event = new Event('input', { bubbles: true });
                    let tracker = input._valueTracker;
                    if (tracker) {
                        tracker.setValue(lastValue);
                    }
                    input.dispatchEvent(event);

                    await util.sleep(200); //0.2秒后点击按钮
                    button.click();

                } else {
                    maxTime === 0 && clearInterval(ins);
                }
            }, 800);
        },


        // 显示设置
        showSettingBox() {
            let html = `<div style="font-size: 1em;">
                            <label class="KK-PanHelper-setting-label">插件运行模式
                                <select id="KK-Model" class="KK-PanHelper-setting-select">
                                    <option>快开模式</option>
                                    <option>弹窗模式</option>
                                </select>
                            </label>
                            <label class="KK-PanHelper-setting-label" id="KK-checkbox-show-copyPN" style="${util.getValue('KK_setting_open_model') ? 'display: flex' : 'display: none'}">快开模式显示复制弹窗
                                <input type="checkbox" class="KK-PanHelper-setting-checkbox" ${util.getValue('KK_setting_show_copyPN') ? 'checked' : ''} >
                            </label>
                            <label class="KK-PanHelper-setting-label">新窗口打开方式
                                <select id="KK-Active" class="KK-PanHelper-setting-select">
                                    <option>新窗口打开</option>
                                    <option>后台打开</option>
                                </select>
                            </label>
                            <label class="KK-PanHelper-setting-label">选中链接后->自动复制
                                <input type="checkbox" id="KK-checkbox-auto-copy" class="KK-PanHelper-setting-checkbox" ${util.getValue('KK_setting_auto_copy') ? 'checked' : ''} >   
                            </label>
                            <label class="KK-PanHelper-setting-label">选中链接后->取消选中状态
                                <input type="checkbox" id="KK-setting-selection-active" class="KK-PanHelper-setting-checkbox" ${util.getValue('KK_setting_selection_active') ? 'checked' : ''} >   
                            </label>
                        </div>`;
            Swal.fire({
                title: '快开助手配置',
                html,
                icon: 'info',
                showCloseButton: true,
                confirmButtonText: '保存',
                footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a style="color:blue;margin-right:5px;text-decoration: underline;" href="https://greasyfork.org/zh-CN/scripts/460184" target="_blank"> GreasyFork</a><a style="color:blue;margin-right:5px;text-decoration: underline;" href="https://github.com/maimierjiafude/KK_OpenPanHelper" target="_blank"> Github</a><a style="color:blue;margin-right:5px;text-decoration: underline;" href="https://www.acfun.cn/v/ac40763378" target="_blank"> 视频演示</a>,Powered by 龙龙龙</div>',
                customClass
            }).then((res) => {
                // history.go(0)刷新
                // location.reload()刷新
                res.isConfirmed && location.reload();
            });

            document.getElementById('KK-Model').selectedIndex = (util.getValue('KK_setting_open_model') ? 0 : 1);
            document.getElementById('KK-Model').addEventListener('change', () => {
                let KK_checkbox_show_copyPN = document.getElementById('KK-checkbox-show-copyPN');
                KK_checkbox_show_copyPN.style.display = (!util.getValue('KK_setting_open_model') ? 'flex' : 'none')
                util.setValue('KK_setting_open_model', !util.getValue('KK_setting_open_model'));
            });

            document.getElementById('KK-Active').selectedIndex = (util.getValue('KK_setting_active') ? 0 : 1);
            document.getElementById('KK-Active').addEventListener('change', () => {
                util.setValue('KK_setting_active', !util.getValue('KK_setting_active'));
            });

            document.getElementById("KK-checkbox-show-copyPN").addEventListener('change', () => {
                util.setValue('KK_setting_show_copyPN', !util.getValue('KK_setting_show_copyPN'));
            });

            document.getElementById("KK-checkbox-auto-copy").addEventListener('change', () => {
                util.setValue('KK_setting_auto_copy', !util.getValue('KK_setting_auto_copy'));
            });

            document.getElementById("KK-setting-selection-active").addEventListener('change', () => {
                util.setValue('KK_setting_selection_active', !util.getValue('KK_setting_selection_active'));
            });

        },

        // 菜单注册
        registerMenuCommand() {

            GM_registerMenuCommand('💬 反馈 & 建议', () => {
                // 这里填我的联系方式
                // 弹出框，邮箱，github
                popupNotifications.contactPN()
            });

            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSettingBox();
            });

        },

        // 样式总控制
        addPluginStyle() {
            let style = `
                .KK-PanHelper-title {text-align: center !important; }
                .KK-PanHelper-container { z-index: 99999!important; text-align: center !important; }
                .KK-PanHelper-popup { font-size: 14px !important; text-align: center !important; }
                .KK-PanHelper-htmlContainer{ margin: 2px !important; padding:1px !important;}
                .KK-PanHelper-actions {justify-content: center!important; align-items: center;}
                .KK-PanHelper-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .KK-PanHelper-setting-select { width: 150px;height: 30px;font-size: 1em; }
                .KK-PanHelper-setting-checkbox { width: 16px;height: 16px; }
            `;

            if (document.head) {
                util.addStyle('KK-swal-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('KK-PanHelper-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('KK-swal-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('KK-PanHelper-style', 'style', style);
            });
            headObserver.observe(document.head, { childList: true, subtree: true });
        },

        // 是否最前
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