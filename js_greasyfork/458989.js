// ==UserScript==
// @name         ZhChat增强脚本
// @namespace    http://tampermonkey.net/
// @version      3.7.0
// @description  增强功能:鼠标中键oldnick（已消抖）、自定义邀请、过滤rule，自动更新（提醒）、lookup、lookuplast（脚本）、/zhelp（更新显示命令帮助）、粘贴发送图片
// @author       UbisoComes (GreenDebug)
// @match        https://chat.zhangsoft.cf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhangsoft.cf
// @license      MIT
// @run-at       document-end
// @grant none


// @downloadURL https://update.greasyfork.org/scripts/458989/ZhChat%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458989/ZhChat%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
window._script_version = {
    ver: '3.7.0',
    update_note: `更新内容：鼠标中键oldnick（已消抖）、自定义邀请、过滤rule、自动更新（提醒）、/lookup功能（脚本）、/lookuplast (脚本)、/zhelp（更新显示命令帮助）、/addshortcmd /delshortcmd（快捷命令）、/hash、/mymurmur
    更新 & 优化:
    1.更新粘贴发送图片功能
    `
};
(function () {

    /**
     * 储存
     */
    const local = {
        set: (key, value) => localStorage.setItem(key, value),
        remove: (key) => localStorage.removeItem(key),
        get: (key) => {
            let res = localStorage.getItem(key);
            return res != null ? res : undefined;

        },
        exist: (key) => localStorage.getItem(key) != undefined,

    };
    const json = JSON;
    /**
     * 提示
     */
    var is_trip_update = false, is_show_ver = false;

    const doc = window.document;
    const $_ = (q) => doc.querySelectorAll(q);
    const $ = (d) => doc.querySelector(d);
    /**
     * 解析包含`${*}`字符里面js代码
     * @param {String} str 
     * @returns 
     */
    const streval = (str) => {
        try {
            const reg = /\${([^}]*)}/g;
            const result = str.replace(reg, (match, p1) => {
                return eval(p1).toString();
            });
            return result;
        }
        catch (e) { return e.message; }
    };
    window.streval = streval;
    /**
     * 翻译
     */
    var tr = {
        nick: "用户名", trip: "识别码", utype: "用户类型",
        hash: "hash", level: "等级", userid: "用户id",
        channel: "频道", client: "客户端", isme: "是我吗", isBot: "是机器人", time: "加入时间"
    };
    /**
     * 等级翻译
     */
    var leveltr = { "user": "普通用户", "trusted": "信任用户", "mod": "管理员", "channelOwner": "房主" };
    function info(t) {
        COMMANDS.info({ cmd: 'info', text: t });
    }
    function warn(e) {
        COMMANDS.warn({ cmd: 'warn', text: e });
    }
    window.zhc_script_link = 'https://greasyfork.org/zh-CN/scripts/458989-zhchat%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC';
    /**
     * 方便lookup、lookuplast
     */
    window.zhcUsers = [];
    /**
     * 最后离开的用户
     */
    window.lastLeave = false;
    /**
     * 是否启用js功能：默认开启，可通过`/js disable` 关闭 `/js enable` 开启
     */
    window.enablejs = eval(local.get('enablejs'));
    enablejs = enablejs != undefined ? enablejs : true;
    /**
     * 数组去重
     * @param {Array} _array
     * @returns
     */
    function trimSpace(_array, f = undefined) {
        var array = _array;
        for (var i = 0; i < array.length; i++) {
            //这里为过滤的值
            if (array[i] == " " || array[i] == null || typeof (array[i]) == "undefined" || array[i] == '  ' || array[i] == '' || array[i] == f) {
                array.splice(i, 1);
                i = i - 1;
            }
        }

        return array;
    }
    /**
     * json try parse 
     * @param {String} json 
     * @returns 
     */
    function tryparse(json) {
        try {
            return JSON.parse(json);
        } catch {
            return null;
        }
    }
    /**
     * 解除控制台限制
     * @returns
     */
    window.fuckconsole = function () {
        var iframeid = parseInt(Math.random() * 1000);
        pushMessage({ cmd: 'chat', text: `<iframe style='display:none;' id="${iframeid}"></iframe>` }, null, true);
        return document.getElementById(iframeid).contentWindow.console;

    };
    window.msg = (e) => send({ cmd: 'chat', text: enablejs ? streval(e) : e, head: localStorageGet('head') || '' });
    window._welcome = () => {
        //直接扣client.js里面的 （
        var hiyo = 'hi y'
        var max = Math.round(Math.random() * 20);

        for (var i = 0; i < max; i++) { // @ee 你想累死我啊
            hiyo += 'o'; // ee：（被打
        }

        const welcomes = `${hiyo}|awa!|uwu!|来了老弟~|哇，真的是你呀|awa!`.split('|');
        let txt = welcomes[Math.round(Math.random() * (welcomes.length - 1))];
        return txt;
    };
    /**
     * 格式化用户信息
     * @param {String} user
     * @returns
     */
    function UserStr(user) {
        //替换key
        let new_user = Object.keys(user).reduce((newData, key) => {
            let newKey = tr[key] || key;
            newData[newKey] = '`' +
                (s => {
                    //如果是true or false
                    if (typeof (s) == 'boolean') {
                        s = ({ 'true': '是', 'false': '否' })[s.toString()];
                    }
                    //如果包含mod等级字眼
                    if (Object.keys(leveltr).includes(s)) {
                        s = leveltr[s];
                    }
                    //判断是否为空
                    if (s == '' || s == undefined || s == null)
                        s = '空';

                    return s;
                })(user[key]) + '`';

            return newData;
        }, {});
        return JSON.stringify(new_user, null, 2).replaceAll('"', '').replaceAll('{', '').replaceAll('}', '');//直接格式化替换json
    }
    /**
     * enum
     */
    const Enum = {
        skip: (arr, i) => {
            let array = [];
            for (let index = i; index < arr.length; index++) {
                array.push(arr[index]);
            }
            return array;
        }
    };
    /**
     * 是否正在查看曾用名
     */
    var is_oldnick_ing = false;

    /********************************************************* */
    /**
     * 快捷命令
     */
    window.fastcmd = [];

    /**
     * 是否在快捷命令里面
     * @param {String} ee 
     * @returns 
     */
    function isInfastcmd(ee) {
        return fastcmd.find(c => c.name == ee) != undefined;
    }
    /**
     * 获取快捷命令的值
     * @param {String} ee 
     * @returns 
     */
    function getfastcmdValue(ee) {
        return fastcmd.find(c => c.name == ee);
    }
    /**
     * 保存快捷命令
     */
    function savefastcmd() {
        try {
            local.set('fastcmd', json.stringify(fastcmd));
        }
        catch {
            local.set('fastcmd', json.stringify([]));
        }
    }
    /**
     * 加载快捷命令
     */
    function loadfastcmd() {
        try {
            fastcmd = json.parse(local.get('fastcmd')) || [];
        }
        catch {
            fastcmd = [];
        }
    }
    /**
     * 添加快捷命令
     * @param {String} ee 
     * @param {Object} value 
     * @param {Boolean} _iswz 
     * @param {Boolean} custom 
     * @returns 
     */
    function addfastcmd(ee, value, _iswz = false, custom = false) {
        if (!isInfastcmd(ee)) {
            if (isInfastcmd(value))
                return { success: false, msg: `不允许添加命令的值为:\`${value}\`，强制添加将导致递归` };

            // (!js)
            fastcmd.push(!custom ? { name: ee, val: value, iswz: _iswz } : { name: ee, val: value, obj: true });
            //else fastcmd.push({ name: ee, val: value, js: true });

            savefastcmd();
            return { success: true, msg: '添加成功' };
        }
        else return { success: false, msg: `添加失败，快捷命令：\`${ee}\` 已存在` };

    }
    /**
     * 移除快捷命令
     * @param {String} ee 
     * @returns 
     */
    function removefastcmd(ee) {
        if (isInfastcmd(ee)) {
            fastcmd.splice(fastcmd.findIndex(s => s.name == ee), 1);
            savefastcmd();
            return { success: true, msg: '移除成功' };
        } else return { success: false, msg: `快捷命令：\`${ee}\` 不存在` };

    }

    /********************************************************* */

    /********************************************************* */



    /********************************************************* */
    window._isincmd = isInfastcmd;
    /**
     * 添加管理员操作
     * @param {String} action 
     */
    window.addAction = (action) => {
        var option = document.createElement('option');
        option.textContent = action.text;
        option.value = JSON.stringify({ text: action.data, custom: true });	//转换为JSON
        addfastcmd(action.text, action.data, false, true);
        $('#mod-action').options.add(option);
    };
    function group(array, subGroupLength) {
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }
    function create(tagName, options) {
        var el = document.createElement(tagName);

        if (options) {
            if (options.id) {
                el.id = options.id;
            }
            if (options.class) {
                el.className = options.class;
            }
            if (options.text) {
                el.appendChild(document.createTextNode(options.text));
            }
            if (options.html) {
                el.innerHTML = options.html;
            }
            if (options.attrs) {
                for (var attr in options.attrs) {
                    el.setAttribute(attr, options.attrs[attr]);
                }
            }
            if (options.children && options.children.length) {
                for (var i = 0; i < options.children.length; i++) {
                    el.appendChild(options.children[i]);
                }
            }
        }

        return el;
    }

    var Inject = {
        sidebar: {
            getObj: () => {
                let bar = [...$('#sidebar-content').children].map(s => { return { obj: s, name: s.localName } });
                let all = [], arr = [];
                bar.forEach(s => {
                    if (s.name != 'hr') {
                        arr.push(s);
                    }
                    else {
                        all.push(arr);
                        arr = [];
                    }
                });
                return all;
            },
            Setting: () => {
                let bars = Inject.sidebar.getObj();
                return bars[0];

            },
            More: () => {
                let bars = Inject.sidebar.getObj();
                return bars[1];
            }
        },
        /* 注入到“设置”的侧边栏区域 */
        Setting: {

            last: (e) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.Setting();
                setting_in_bar.insertBefore(e, st[st.length - 1].obj.nextSibling);
            },
            first: (e) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.Setting();
                setting_in_bar.insertBefore(e, st[0].obj);
            },
            custom: (e, i) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.Setting();
                setting_in_bar.insertBefore(e, st[i].obj);
            },

        },
        /* 注入到“更多”的侧边栏区域 */
        More: {
            last: (e) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.More();
                setting_in_bar.insertBefore(e, st[st.length - 1].obj.nextSibling);
            },
            first: (e) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.More();
                setting_in_bar.insertBefore(e, st[0].obj);
            },
            custom: (e, i) => {
                let setting_in_bar = $('#sidebar-content');
                let st = Inject.sidebar.More();
                setting_in_bar.insertBefore(e, st[i].obj);
            },
        }

    };
    /**
     * 脚本命令
     */
    window.Script_Command = {
        zhelp: {
            help: '帮助',
            func: (e) => {

                let keys = Object.keys(Script_Command);
                let arr = group(keys, 5);

                if (e.length <= 0) info(`|命令列表:|\n|--|\n${arr.map(s => `|${s.join(', ')}|`).join('\n')}\n要查看指定命令的帮助信息，请发送：\`/zhelp <command>\``);
                else {
                    let cmd = keys.find(k => k == e.join(''));
                    if (cmd != undefined) info(`## ${cmd} 命令的帮助:\n|名称：|${cmd}|||\n|--|--|--|--|\n|帮助：|${Script_Command[cmd].help}|||\n|用法：|${Script_Command[cmd].use || '/' + cmd}|||`);
                    else warn('`help` 找不到命令');
                }
            },
            use: '/zhelp <command> 或 /zhelp'
        },
        lookup: {
            help: '查看某位用户',
            func: (e) => {
                let nick = e.join();
                let user = zhcUsers.find(u => u.nick == nick);
                if (user != undefined) info(`# ${user.nick} 的信息:\r\n` + UserStr(user));
                else warn('`lookup` 找不到用户');
            },
            use: '/lookup <呢称>'
        },
        lookuplast: {
            help: '查看最后离开的用户信息',
            func: (e) => {
                if (lastLeave != undefined && lastLeave != false) {
                    info('# 最后离开用户的信息:\r\n' + UserStr(lastLeave));
                } else warn('最后离开的用户无记录');
            },
            use: '/lookuplast'
        },
        ver: {
            help: '显示当前`zhc增强脚本`的版本号和更新内容',
            func: (e) => {
                info(`当前版本号:${_script_version.ver}
                更新内容:${_script_version.update_note}`);
            }, use: '/ver'
        },
        welcome: {
            help: '显示一条一条欢迎信息',
            func: (e) => msg(_welcome()),
            use: '/welcome'
        },
        addshortcmd: {
            help: '添加一条快捷命令',
            use: '/addshortcmd <短命令名称> <命令名称>',
            func: (e) => {
                if (e.length < 2) return warn('缺少命令参数，请使用`/zhelp addshortcmd` 查看帮助');

                let key = e[0];
                let val = e[1];

                let res = addfastcmd(key, val);
                (res.success ? info : warn)(res.msg);
            }
        },
        addshortcmdwz: {
            help: '添加一条快捷命令（完整）',
            use: '/addshortcmdwz <短的新命令> <完整命令>',
            func: (e) => {
                if (e.length < 2) return warn('缺少命令参数，请使用`/zhelp addshortcmdwz` 查看帮助');
                let key = e[0];
                let val = Enum.skip(e, 1).join(' ');
                /*if (!val.includes('/')) {
                    val = '/' + val;
                }*/
                let res = addfastcmd(key, val, true);
                (res.success ? info : warn)(res.msg);
            }
        },
        addscriptcmd: {
            help: '添加一条快捷命令（完整）',
            use: '/addscriptcmd <短的新命令> <完整命令>',
            func: (e) => {
                if (e.length < 2) return warn('缺少命令参数，请使用`/zhelp addscriptcmd` 查看帮助');
                let key = e[0];
                let val = Enum.skip(e, 1).join(' ');
                /*if (!val.includes('/')) {
                    val = '/' + val;
                }*/
                let res = addfastcmd(key, '/runjs ' + val, true);
                (res.success ? info : warn)(res.msg);
            }
        },
        delshortcmd: {
            help: '移除一条快捷命令',
            use: '/delshortcmd <短的命令>',
            func: (e, p = undefined) => {
                if (e.length < 1) return warn(`缺少命令参数，请使用\`/zhelp ${p ? 'delshortcmd' : p}\` 查看帮助`);
                let res = removefastcmd(e[0]);
                (res.success ? info : warn)(res.msg);
            }
        },
        hash: {
            help: '显示你的hash',
            use: '/hash',
            func: (e) => {
                info(`你的hash为：${myhash || '空'}`);
            }
        },
        mymurmur: {
            help: '显示你的指纹',
            use: '/mymurmur',
            func: (e) => info(`你的指纹为：${myMurmur}`)
        },
        link: {
            help: '显示脚本链接',
            use: '/link',
            func: (e) => info(`脚本链接:${zhc_script_link}`)
        },
        addaction: {
            help: '添加快捷操作->侧边栏->名称->右键的快捷操作',
            use: '/addaction <快捷命令> <完整命令 (支持填充 `呢称` 或 `js代码`，填充符:$nick，js填充:${ <你的js代码> }) >',
            func: (e) => {
                if (e.length < 2) return warn('缺少命令参数，请使用`/zhelp addaction` 查看帮助');
                let key = e[0];
                if (isInfastcmd(key)) return warn(`无法添加，\`${key}\` 已存在`);
                let val = Enum.skip(e, 1);
                addAction({ text: key, data: val.join(' ') });
                info('添加快捷操作成功!');
            }
        },
        delaction: {
            help: '移除快捷操作',
            use: '/delaction <命令>',
            func: (e) => {

                try {
                    //fastcmd.indexOf(f)
                    let options = $('#mod-action').options;

                    let action = getfastcmdValue(e[0]);
                    if (action) {
                        let index = fastcmd.indexOf(action);
                        if (options[options.selectedIndex] == undefined) {
                            local.set('lastmodcmdindex', '0');
                            local.set('lastmodcmd', null);
                            options.selectedIndex = 0;
                            modCmd = null;
                            modcmd_index = 0;
                        }
                        else {
                            let d = JSON.parse(options[options.selectedIndex].value);
                            if (d.custom != undefined && d.text == action.val) {
                                options.remove(options.selectedIndex);
                                options.selectedIndex = 0;
                                modCmd = null;
                                modcmd_index = 0;
                                local.set('lastmodcmdindex', '0');
                                local.set('lastmodcmd', null);
                            }
                            fastcmd.splice(index, 1);
                        }
                        savefastcmd();
                        info('清除快捷操作成功!');
                    }
                    else throw new Error('找不到该命令');
                } catch (e) {
                    warn(`清除 \`快捷操作\` 失败:${e.message}`);
                }
            }
        },
        clearshortcmd: {
            help: '清除全部快捷命令',
            use: '/clearshortcmd',
            func: (e) => {
                try {
                    let cmds = fastcmd.filter(u => u.obj == undefined);
                    for (let f of cmds) {
                        fastcmd.splice(fastcmd.indexOf(f), 1);
                    }
                    savefastcmd();
                    info('清除快捷命令成功');
                }
                catch (e) {
                    warn(`清除 \`快捷命令\` 失败：${e.message}`);
                }
            }
        },
        clearaction: {
            help: '清理快捷操作',
            use: '/clearaction',
            func: (e) => {
                try {
                    //fastcmd.indexOf(f)
                    let options = $('#mod-action').options;
                    local.set('lastmodcmdindex', '0');
                    local.set('lastmodcmd', null);
                    modCmd = null;
                    modcmd_index = 0;
                    let cmds = fastcmd.filter(u => u.obj != undefined);
                    for (let f of cmds) {
                        fastcmd.splice(fastcmd.indexOf(f), 1);

                    }
                    let h = options[options.selectedIndex] || undefined;
                    if (h == undefined) {
                        options.selectedIndex = 0;

                    } else if (JSON.parse(h.value) && JSON.parse(h.value).custom != undefined) {
                        options.remove(options.selectedIndex);
                        options.selectedIndex = 0;

                    }
                    let arr_options = [...options];
                    for (let b of arr_options) {
                        if (JSON.parse(b.value) && JSON.parse(b.value).custom != undefined) {
                            options.remove(arr_options.indexOf(b));
                        }
                    }
                    savefastcmd();
                    info('清除快捷操作成功');
                } catch (e) {
                    warn(`清除 \`快捷操作\` 失败:${e.message}`);
                }
            }
        },
        runjs: {
            help: '在聊天框快速执行js（慎用，可能会导致不安全）',
            use: '/runjs <code>',
            func: (e) => {
                let res;
                try { res = eval(e.join(' ')).toString(); } catch (e) {
                    res = e.message;
                }

                info(res);
            }

        },
        js: {
            help: '启用或关闭js功能（脚本）',
            use: '/js <enable/disable>',
            func: (e) => {
                if (e.length <= 0) return warn('缺少参数，参数为:`on/off`');

                enablejs = e.includes('on') || e.includes('true');
                local.set('enablejs', enablejs);
                info(`js功能已${enablejs ? '开启' : '关闭'}`);
            }
        },


        delscriptcmd: {
            help: '移除js代码快捷命令',
            use: '/delscriptcmd <命令名字>',
            func: (e) => {
                //懒，这里就做成快捷方式罢 （
                Script_Command.delshortcmd.func(e, 'delscriptcmd');
            }
        },
        unlockupload: {
            help: '解除正在上传图片限制',
            func: (e) => {
                window.isUploading = false;
                info(`限制已解除`);
            }
        },
        imgMode: {
            help: '设置图片的发送模式,0为直接发送，1为复制到输入框',
            use: '/imgMode 或 /imgMode <0/1>',
            func: (e) => {
                if (e.length > 0)
                    info(`图片发送模式配置为:${(e.includes('0') ? () => {
                        imgUploadMode = '0';
                        local.set('imgMode', '0');
                        return '直接发送';
                    } : () => {
                        imgUploadMode = '1';
                        local.set('imgMode', '1');
                        return '粘贴到输入框';
                    })()}`);
                else info(`图片发送模式为:${window.imgUploadMode == 0 ? '直接发送' : '粘贴到输入框'}`);
            }
        }



    };
    /**
     * 侧边栏ui
     */
    const SideBarUI = {

        add: (element) => {
            let side = $('#sidebar-content');
            side.insertBefore(element, side.children[1]);
        },
        remove: (filther) => {
            let side = $('#sidebar-content');
            for (let i in side.children) {
                let item = side.children[i];
                if (filther(item)) side.removeChild(item);
            }
        }
    };

    /**
     * 判断命令
     * @param {String} c
     * @returns
     */
    function isCommand(c) {
        var keys = Object.keys(Script_Command);

        for (let p in keys) {

            let item = keys[p];

            if (item == c) return { success: true, obj: (e) => Script_Command[item].func(trimSpace(e)) };
            if (isInfastcmd(c)) {
                let obj_ = getfastcmdValue(c);

                let val = obj_.val;
                return {
                    success: true, obj: keys.includes(val) && obj_.obj == undefined ? Script_Command[val].func : (e) => {
                        if (obj_.obj != undefined) return;
                        val.iswz ? msg(`/${val}${e.length <= 0 ? '' : ' ' + e.join(' ')}`) : msg(val);
                    }
                };
            }

        }

        return { success: false };
    }
    /**
     * 处理脚本的命令
     * @param {String} text
     */
    function handleScriptCommand(e) {
        //_console.log(e);
        if (e.cmd != "chat") return false;
        if (e.text == undefined || !e.text.startsWith('/')) return false;
        let t = e.text.slice(1).split(' ');
        let f = (Enum.skip(t, 1));
        let res = isCommand(t[0]);
        if (res.success) {
            res.obj(f);
            return true;
        }

        return false;
    }
    /**
     * 比较版本号
     * @param {String} ver1
     * @param {String} ver2
     * @returns {Number}
     */
    function compareVersion(ver1, ver2) {
        const v1 = ver1.split('.').map(Number);
        const v2 = ver2.split('.').map(Number);
        const len = Math.max(v1.length, v2.length);

        for (let i = 0; i < len; i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;

            if (num1 < num2) {
                return -1;
            } else if (num1 > num2) {
                return 1;
            }
        }

        return 0;
    }
    /**
     * 检测更新
     *
     */
    function update_tip() {
        //注意：此脚本用于更新，里面只包含版本号（其他的代码是无用的，为了让greasyfork不删除脚本
        //脚本路径：https://greasyfork.org/zh-CN/scripts/462606-%E7%9F%A5%E4%B9%8E-%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4cookie

        if (!is_trip_update) { is_trip_update = true; } else return;
        var script = document.createElement("script");
        script.src =
            "https://greasyfork.org/scripts/462606-%E7%9F%A5%E4%B9%8E-%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4cookie" +
            "/code/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E5%8E%BB%E9%99%A4cookie.user.js?cache=" + parseInt(Math.random() * 114514);
        script.onload = () => {
            if (compareVersion(_script_version.ver, gf_script_version.last_ver) < 0) {
                info(`当前zhc增强脚本版本有更新! 请及时更新。
    当前版本: ${_script_version.ver}   新版本: ${gf_script_version.last_ver}
    新版本更新内容:${gf_script_version.last_note || '无'}
    更新链接:${zhc_script_link}`);
            }
        };
        document.head.appendChild(script);
    }
    /**
     * 鼠标中键oldnick
     */
    function nick_oldnick() {

        $('#sidebar-content').addEventListener('mousedown', (e) => {
            if (e.button === 1) { // 检测是否为鼠标中键触发的事件
                e.preventDefault();
            }
            [...$('#users').children].map(s => s.children[0]).forEach(q =>
                q.addEventListener('mousedown', (e) => {

                    if (e.button == 1 && !is_oldnick_ing) {
                        send({ cmd: 'oldnick', nick: q.textContent });
                        is_oldnick_ing = true;
                    }

                    e.preventDefault();
                }));
        });
    }
    function version(p = false) {
        if (!is_show_ver) { is_show_ver = true; } else return;//判断是否提醒过一次了
        COMMANDS.info({
            cmd: 'info', text: `zhchat增强脚本已启动，版本：v${_script_version.ver}，
            输入 \`/zhelp\` 可以获取脚本的命令帮助，
            输入 \`/ver\` 可以查看更新内容
            `
        });

    }

    function initUI() {
        nick_oldnick();//鼠标中键oldnick

    }
    function ChatLoaded() {
        version();//版本
        try {
            update_tip();//更新提示
        } catch { }

    }
    function init() {
        /************** 初始化ui **************/
        try {
            initUI();//初始化ui
            loadfastcmd();//从储存中加载fastcmd列表
            window._console = fuckconsole();//解除控制台限制
            window._info = info;
            window._warn = warn;
        }
        catch { }
        /**********************************/
        /************** 版本号显示、rule拦截 ****************/
        setTimeout(() => {
            let _info = COMMANDS.info;
            COMMANDS.info = (e) => {
                e.nick = '*';
                if (e.text && e.text.indexOf("曾用名") != -1) {
                    is_oldnick_ing = false;
                }
                if (e.type == "invite" && e.text.includes('\\rule')) {

                    e.text = e.text.replace(/\\rule/g, "【rule】")
                    _info({ cmd: 'info', text: 'rule已被拦截' })
                }

                _info(e);
            };


        }, 1000);

        /************** lookup、lookuplast ****************/
        setTimeout(() => {
            let _onlineSet = COMMANDS['onlineSet'],
                _onlineAdd = COMMANDS['onlineAdd'],
                _onlineRemove = COMMANDS['onlineRemove'],
                _changeNick = COMMANDS['changeNick'];

            COMMANDS['onlineSet'] = (e) => {
                _onlineSet(e);
                ChatLoaded();
                zhcUsers = e.users || [];
                window.myhash = zhcUsers.find(u => u.nick == getNick()).hash;
            };
            COMMANDS['onlineAdd'] = (e) => {
                _onlineAdd(e);
                delete e.cmd;
                zhcUsers.push(e);
            };
            COMMANDS['onlineRemove'] = (e) => {
                _onlineRemove(e);
                delete e.cmd;
                lastLeave = zhcUsers.find(u => u.nick == e.nick);
                zhcUsers = zhcUsers.filter(u => u.nick != e.nick);
            };
            COMMANDS['changeNick'] = (e) => {
                _changeNick(e);
                zhcUsers.map(s => {
                    if (s.nick == e.nick) {
                        s.nick = e.text;
                    }
                    return s;
                });

            };
        }, 1000);
        /************** 自定义邀请 ****************/
        setTimeout(() => {
            userInvite = function (nick) {
                var gotoChannel = prompt("设置一个去的频道（按取消随机）");
                if (gotoChannel != undefined && gotoChannel.indexOf("\\rule") != -1)
                    return pushMessage({ nick: "!", text: "你干嘛，哈哈哎哟" });

                send(gotoChannel ? { cmd: 'invite', nick: nick, to: gotoChannel } : { cmd: 'invite', nick: nick });

            }

        }, 1000);
        /************** 捕获脚本命令 ****************/
        setTimeout(() => {
            var _send = send;
            send = (e) => {
                if (!handleScriptCommand(e)) _send(e);
            };

        }, 1000);
        /******************************************/
        setTimeout(() => {

            let actions = fastcmd.filter(u => u.obj != undefined);
            actions.forEach(s => addAction({ text: s.name, data: s.val, custom: true }));
            window.modCmd = tryparse(local.get('lastmodcmd'));
            window.modcmd_index = tryparse(local.get('lastmodcmdindex')) || 0;

            $('#mod-action').onchange = (e) => {
                modCmd = tryparse(e.target.value);	//解析为obj
                local.set('lastmodcmd', e.target.value);
                local.set('lastmodcmdindex', e.target.selectedIndex);
                modcmd_index = e.target.selectedIndex;
            }
            $('#mod-action').selectedIndex = modcmd_index;
            let _userModAction = userModAction;
            let custom_action = (e) => {
                msg(modCmd.text.replaceAll('$nick', e));
            };
            userModAction = (e) => { (modCmd == null || modCmd.custom == undefined ? _userModAction(e) : custom_action(e)); }


        }, 1000);
        /************* 粘贴图片函数 ****************/
        window.uploadImage = function (base64, fileName) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const url = 'https://imagebed.1919810.gq/api/upload';

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText));
                        } else {
                            reject(xhr.statusText);
                        }
                    }
                };

                xhr.onerror = () => {
                    reject(xhr.statusText);
                };

                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');

                const body = JSON.stringify({
                    data: base64,

                    name: fileName,
                });

                xhr.send(body);
            });

        };
        window.Inject = Inject;
        if (local.get('imgPaste') == undefined) {
            local.set('imgPaste', 'false');
        }
        window.isCanImgPaste = local.get('imgPaste') == 'true';
        window.imgPasteOnChange = (e) => {
            isCanImgPaste = e.checked;
            local.set('imgPaste', e.checked);
        };
        window.imgUploadMode = local.get('imgMode') != undefined ? local.get('imgMode') : '0';
        window.isUploading = false;
        window.addTextToInput = (e) => {
            $('#chatinput').value += e;
        };
        setTimeout(() => {

            imgHostWhitelist.push('imagebed.s3.bitiful.net');
            Inject.Setting.last(create('p', {
                children: [
                    (() => {
                        let input = create('input', {
                            id: 'imgPaste',
                            attrs: {
                                onchange: 'imgPasteOnChange(this)',
                                type: 'checkbox',

                            }
                        });
                        input.checked = isCanImgPaste;
                        return input;
                    })(),
                    create('label', {
                        text: ' 粘贴并发送图片',
                        attrs: { for: 'imgPaste' }
                    })

                ]
            }));
            // 监听paste事件
            document.addEventListener('paste', function (e) {
                if (!isCanImgPaste)
                    return;
                if (isUploading) {
                    info('检测到图片，但是检测到当前正在上传另一张图片，如果异常请使用 `/unlockupload` 命令解除限制');
                    return;
                }
                const dataTransferItemList = e.clipboardData.items;
                // 过滤非图片类型
                const items = [].slice.call(dataTransferItemList).filter(function (item) {
                    return item.type.indexOf('image') !== -1;
                });
                if (items.length === 0) {
                    return;
                }
                info(imgUploadMode == 0 ? '检测到图片，正在上传并发送' : '检测到图片，正在上传并获取链接');
                const dataTransferItem = items[0];
                const blob = dataTransferItem.getAsFile();
                // 获取base64
                const fileReader = new FileReader();
                fileReader.addEventListener('load', function (j) {
                    let base64 = j.target.result;
                    isUploading = true;
                    uploadImage(base64, `image.png`).then(img => {
                        switch (imgUploadMode) {
                            case '0': msg(`![](${img.url})`); break;
                            case '1': addTextToInput(`![](${img.url})`); break;
                        }
                        isUploading = false;

                    });
                });
                fileReader.readAsDataURL(blob);


            });


        }, 1000);
        /*****************************************/
    }
    init();
})();