// ==UserScript==
// @name         哔哩哔哩勋章粉丝牌升级
// @version      1.09
// @description  模拟观看直播获取亲密度
// @author       无夏不春风orz
// @iconURL      https://www.bilibili.com/favicon.ico
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/blackboard/live/*
// @connect      bilibili.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.js
// @require      https://unpkg.com/crypto-js@4.2.0/crypto-js.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/537954/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8B%8B%E7%AB%A0%E7%B2%89%E4%B8%9D%E7%89%8C%E5%8D%87%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/537954/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8B%8B%E7%AB%A0%E7%B2%89%E4%B8%9D%E7%89%8C%E5%8D%87%E7%BA%A7.meta.js
// ==/UserScript==


(function () {
    var NAME
    var BAPI
    var Live_info = {
        coin: undefined,
        room_id: undefined,
        uid: undefined,
        csrf_token: undefined,
        rnd: undefined,
        ruid: undefined,
        uname: undefined,
        user_level: undefined,
        Blever: undefined,
        vipType: undefined,
        face_url: undefined,
        vipTypetext: undefined,
        vipStatus: undefined,
        cost: undefined,
        regtime: undefined,
        identification: undefined,
        img_key:undefined,
        sub_key:undefined,
        buvid3:undefined,
    };
    const ts_ms = () => Date.now();
    const ts_s = () => Math.round(ts_ms() / 1000);
    const hour = () => new Date(ts_ms()).getHours();
    const minute = () => new Date(ts_ms()).getMinutes();
    function sleep(ms) {
        return new Promise(resolve => setTimeout(() => resolve('sleep'), ms));
    }
    String.prototype.replaceAll = function (oldSubStr, newSubStr) {
        return this.replace(new RegExp(oldSubStr, 'gm'), newSubStr)
    }
    const newWindow = {
        init: () => {
            return newWindow.Toast.init();
        },
        Toast: {
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'info', timeout = 5e3) => {
                        console.log(msg)
                        switch (type){
                            case 'success':
                            case 'info':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001;text-align: left;"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
                        a.style.left = 10 + 'px';
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err){
                    return $.Deferred().reject();
                }
            }
        }
    }
    const getCookie = (name) => {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null)
            return unescape(arr[2]);
        return false;
    }
    $(function () { //DOM完毕，等待弹幕加载完成
        if((typeof BilibiliLive) == "undefined"){
            BilibiliLive = undefined;
        }
        let loadInfo = (delay) => {
            setTimeout(async function () {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.bilibili.com/x/web-interface/nav",
                    onload: async function(response) {
                        let data = JSON.parse(response.response);
                        if (!data.data.isLogin) {
                            loadInfo(5000);
                            window.toast('无账号登陆信息,请先登录或检查网络','error',8000);
                        } else {
                            if(BilibiliLive == undefined || BilibiliLive.ROOMID == undefined) return loadInfo(5000);
                            Live_info.room_id = BilibiliLive.ROOMID;
                            Live_info.ruid = BilibiliLive.ANCHOR_UID
                            Live_info.uid = data.data.mid
                            Live_info.coin = parseInt(data.data.money)
                            Live_info.Blever = data.data.level_info.current_level
                            Live_info.vipType = data.data.vipType
                            Live_info.vipStatus = data.data.vipStatus
                            Live_info.uname = data.data.uname
                            Live_info.face_url = data.data.face
                            Live_info.vipTypetext = data.data.vip_label.text
                            if(Live_info.vipTypetext=='')Live_info.vipTypetext = '普通用户'
                            let img_url = data.data.wbi_img.img_url
                            let sub_url = data.data.wbi_img.sub_url
                            let img_key = img_url.slice(img_url.lastIndexOf('/') + 1,img_url.lastIndexOf('.'))
                            let sub_key = sub_url.slice(sub_url.lastIndexOf('/') + 1,sub_url.lastIndexOf('.'))
                            Live_info.img_key = img_key
                            Live_info.sub_key = sub_key
                            NAME = 'BILI' + Live_info.uid
                            Live_info.csrf_token = getCookie('bili_jct');
                            Live_info.buvid3 = getCookie('buvid3');
                            window.toast('登陆信息获取成功','success');
                            init();
                        }
                    },
                    onerror : function(err){
                        loadInfo(5000);
                        window.toast('无账号登陆信息,请先登录或检查网络','error',8000);
                    }
                });
            }, delay);
        };
        newWindow.init();
        loadInfo(5000);
    });

    async function init() { //API初始化
        const right_ctnr = $('.right-ctnr');
        const share = right_ctnr.find('.v-middle.icon-font.icon-share').parent();
        const remove_button = $(
            `<div data-v-6d89404b="" data-v-42ea937d="" title="" class="icon-ctnr live-skin-normal-a-text pointer" id = "blth_like_button" style="line-height: 16px;margin-left: 15px;"><i data-v-6d89404b="" class="v-middle icon-font icon-delete" style="font-size: 16px;"></i><span data-v-6d89404b="" class="action-text v-middle" style="font-size: 12px;margin-left: 5px;">去掉直播水印</span></div>`
        );
        remove_button.click(() => {
            $('.web-player-icon-roomStatus').remove()
        });
        const blanc_button = $(
            `<div data-v-6d89404b="" data-v-42ea937d="" title="" class="icon-ctnr live-skin-normal-a-text pointer" id = "blth_like_button" style="line-height: 16px;margin-left: 15px;"><i data-v-6d89404b="" class="v-middle icon-font icon-top" style="font-size: 16px;"></i><span data-v-6d89404b="" class="action-text v-middle" style="font-size: 12px;margin-left: 5px;">回到默认界面</span></div>`
        );
        blanc_button.click(() => {
            window.top.location.href = 'https://live.bilibili.com/blanc/'+ Live_info.room_id
        })
        if ($('.right-ctnr').length !== 0){
            right_ctnr[0].insertBefore(remove_button[0], share[0]);
            right_ctnr[0].insertBefore(blanc_button[0], remove_button[0], share[0]);
        }
        BAPI = BilibiliAPI;
        const MY_API = {
            CONFIG_DEFAULT: {
                auto_medal_task: true,
                medal_level_pass: true,
                medal_pass_level: 999,
                js_running_mark:0,
                medal_pass_uid:[],
                sort:true,
                hide_Toast:true,
                medal_first_uid:[],
                auto_share_watch: true,
                auto_coin_add: false,
            },
            CONFIG: {},
            loadConfig: async function () {
                let p = $.Deferred();
                try {
                    let config = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));
                    $.extend(true, MY_API.CONFIG, MY_API.CONFIG_DEFAULT);
                    for (let item in MY_API.CONFIG) {
                        if (!MY_API.CONFIG.hasOwnProperty(item))
                            continue;
                        if (config[item] !== undefined && config[item] !== null)
                            MY_API.CONFIG[item] = config[item];
                    }
                    p.resolve()
                } catch (e) {
                    console.log('API载入配置失败，加载默认配置', e);
                    MY_API.CONFIG = MY_API.CONFIG_DEFAULT
                    MY_API.saveConfig()
                    p.reject()
                }
                return p
            },
            saveConfig: function () {
                try {
                    localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                    return true
                } catch (e) {
                    console.log('API保存出错', e);
                    return false
                }
            },
            creatSetBox: function () { // 创建设置框
                // 获取最大宽度和高度
                const widthmax = $('.web-player-ending-panel').width() - 50;
                const heightmax = $('.chat-history-panel').height();

                // 创建主容器
                const div = $("<div class='xzsjzsdiv'>");

                // 设置容器样式
                div.css({
                    'width': '400px',
                    'min-width': '400px',
                    'height': '560px',
                    'max-height': `${heightmax}px`,
                    'position': 'absolute',
                    'top': '10px',
                    'right': '10px',
                    'background': 'rgba(255,255,255,.95)',
                    'padding': '10px',
                    'z-index': '99',
                    'border-radius': '12px',
                    'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
                    'transition': 'all .3s ease',
                    'overflow': 'auto',
                    'line-height': '1.2',
                    'font-family': 'system-ui, -apple-system, sans-serif'
                });

                // 创建HTML内容
                div.append(`
        <div class="settings-header">
            <h3 style="margin:0;color:#06aed5;text-align:center;">勋章升级设置</h3>
        </div>
        <fieldset class="settings-fieldset">
            <legend class="settings-legend">用户信息</legend>
            <div id="user_info" class="user-info">
                <img src="${Live_info.face_url}" width="50" height="50" class="user-avatar">
                <div class="user-details">
                    <div><span class="detail-label">昵称：</span>${Live_info.uname}</div>
                    <div><span class="detail-label">UID：</span>${Live_info.uid}</div>
                    <div><span class="detail-label">直播消费：</span>${Live_info.cost}</div>
                    <div><span class="detail-label">会员等级：</span>${Live_info.vipTypetext}</div>
                    <div><span class="detail-label">主站等级：</span>Lv${Live_info.Blever}</div>
                    <div><span class="detail-label">硬币数量：</span>${Live_info.coin}</div>
                </div>
            </div><br>
            <div class="user-details">
            <div class="setting-item" data-toggle="auto_share_watch">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">主站升级（观看分享）</span>
                </label>
            </div>
            <div class="setting-item" data-toggle="auto_coin_add">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">主站升级（随机投币）</span>
                </label>
            </div>
            </div>
        </fieldset>

        <fieldset class="settings-fieldset">
            <legend class="settings-legend">勋章升级参数设置</legend>
            <div class="setting-item" data-toggle="auto_medal_task">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">自动直播观看任务</span>
                </label>
            </div>

            <div class="setting-item" data-toggle="medal_level_pass">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">高级勋章任务跳过</span>
                </label>
            </div>
            <div class="setting-item" data-toggle="medal_level_pass_num">
                <span class="setting-label">跳过</span>
                <input class="setting-input num" type="number" min="1">
                <span class="setting-label">级及以上勋章</span>
                <button class="setting-button" data-action="save">保存</button>
            </div>
            <div class="setting-item" data-toggle="medal_pass_uid">
                <div class="setting-label">不执行观看任务主播UID [逗号隔开]</div>
                <div class="input-group">
                    <input class="setting-input keyword" type="text" placeholder="输入UID，多个用逗号分隔">
                    <button class="setting-button" data-action="save">保存</button>
                </div>
            </div>

            <div class="setting-item" data-toggle="medal_first_uid">
                <div class="setting-label">优先执行观看任务主播UID [逗号隔开]</div>
                <div class="input-group">
                    <input class="setting-input keyword" type="text" placeholder="输入UID，多个用逗号分隔">
                    <button class="setting-button" data-action="save">保存</button>
                </div>
            </div>

            <div class="setting-item" data-toggle="sort">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">按等级升序/降序顺序执行</span>
                </label>
            </div>

            <div class="setting-item" data-toggle="hide_Toast">
                <label class="checkbox-container">
                    <input type="checkbox">
                    <span class="checkmark"></span>
                    <span class="setting-label">运行提示信息弹出显示</span>
                </label>
            </div>

            <div class="settings-note">
                <ul>
                <p><strong>注意事项：</strong></p>
                    <li>同一时间仅一个勋章可获得亲密度，故每日观看总亲密度有上限，可适当排序或过滤。部分设置需要刷新后生效。
                </ul>
            </div>
        </fieldset>
        <div class="settings-footer" data-toggle="ui_hide">
            <button class="setting-button toggle-button" data-action="save">隐藏设置面板</button>
        </div>
    `);

                // 添加CSS样式
                $('head').append(`
        <style>
            .xzsjzsdiv {
                scrollbar-width: thin;
                scrollbar-color: #06aed5 rgba(0,0,0,0.1);
            }
            .xzsjzsdiv::-webkit-scrollbar {
                width: 6px;
            }
            .xzsjzsdiv::-webkit-scrollbar-thumb {
                background-color: #06aed5;
                border-radius: 3px;
            }
            .settings-fieldset {
                border: 1px solid #ddd;
                border-radius: 8px;
                margin-bottom: 5px;
                padding: 10px;
            }
            .settings-legend {
                color: #06aed5;
                font-weight: bold;
                padding: 0 8px;
                font-size: 14px;
            }
            .user-info {
                display: flex;
                gap: 10px;
                align-items: flex-start;
            }
            .user-avatar {
                border-radius: 50%;
                border: 2px solid #06aed5;
            }
            .user-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px;
                font-size: 12px;
            }
            .detail-label {
                color: #666;
                font-weight: bold;
            }
            .setting-item {
                margin-bottom: 2px;
                padding: 0px 0;
                border-bottom: 1px dashed #eee;
            }
            .setting-item:last-child {
                border-bottom: none;
            }
            .checkbox-container {
                display: flex;
                align-items: center;
                cursor: pointer;
                position: relative;
                user-select: none;
            }
            .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }
            .checkmark {
                position: relative;
                height: 18px;
                width: 18px;
                background-color: #fff;
                border: 1px solid #06aed5;
                border-radius: 4px;
                margin-right: 8px;
            }
            .checkbox-container input:checked ~ .checkmark {
                background-color: #06aed5;
            }
            .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }
            .checkbox-container input:checked ~ .checkmark:after {
                display: block;
            }
            .checkbox-container .checkmark:after {
                left: 6px;
                top: 2px;
                width: 5px;
                height: 10px;
                border: solid white;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
            .setting-label {
                font-size: 14px;
                color: #333;
            }
            .setting-input {
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                margin: 0 5px;
                width: 50px;
            }
            .setting-input.keyword {
                width: 220px;
                margin-right: 8px;
            }
            .setting-button {
                background-color: #06aed5;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }
            .setting-button:hover {
                background-color: #0589b0;
            }
            .input-group {
                display: flex;
                align-items: center;
                margin-top: 5px;
            }
            .settings-note {
                font-size: 12px;
                color: #666;
                margin-top: 15px;
                background: #f8f8f8;
                padding: 0px;
                border-radius: 6px;
            }
            .settings-note ul {
                margin: 5px 0 0 15px;
                padding: 0;
            }
            .settings-note li {
                margin-bottom: 3px;
            }
            .toggle-button {
                display: block;
                width: 100%;
                margin-top: 10px;
                background-color: #888;
            }
            .toggle-button:hover {
                background-color: #666;
            }
        </style>
    `);

                // 添加到DOM
                $('.player-section.p-relative.border-box.none-select.z-player-section').append(div);

                // 隐藏/显示按钮事件
                div.find('div[data-toggle="ui_hide"] [data-action="save"]').click(function () {
                    $('.xzsjzsdiv').toggle();
                    $(this).text($('.xzsjzsdiv').is(':visible') ? '隐藏设置面板' : '显示设置面板');
                });

                // 初始化复选框状态
                const initCheckbox = (toggle, configKey) => {
                    const checkbox = div.find(`div[data-toggle="${toggle}"] input`);
                    if (MY_API.CONFIG[configKey]) {
                        checkbox.prop('checked', true);
                    }
                    checkbox.change(function () {
                        MY_API.CONFIG[configKey] = $(this).prop('checked');
                        MY_API.saveConfig();
                        window.toast(`${configKey.replace(/_/g, ' ')} 设置: ${MY_API.CONFIG[configKey]}`);
                        if (configKey === 'auto_medal_task' && MY_API.CONFIG[configKey]) {
                            window.location.reload();
                        }
                    });
                };

                // 初始化所有复选框
                initCheckbox('auto_medal_task', 'auto_medal_task');
                initCheckbox('auto_coin_add', 'auto_coin_add');
                initCheckbox('auto_share_watch', 'auto_share_watch');
                initCheckbox('medal_level_pass', 'medal_level_pass');
                initCheckbox('sort', 'sort');
                initCheckbox('hide_Toast', 'hide_Toast');

                // 初始化跳过等级输入
                div.find('div[data-toggle="medal_level_pass_num"] .num').val(parseInt(MY_API.CONFIG.medal_pass_level.toString()));
                div.find('div[data-toggle="medal_level_pass_num"] [data-action="save"]').click(function () {
                    const level = parseInt(div.find('div[data-toggle="medal_level_pass_num"] .num').val());
                    if (isNaN(level) || level < 1) {
                        window.toast('请输入1以上的有效数字');
                        return;
                    }
                    MY_API.CONFIG.medal_pass_level = level;
                    MY_API.saveConfig();
                    window.toast(`勋章跳过等级已设置为: ${MY_API.CONFIG.medal_pass_level}`);
                });

                // 处理UID列表保存
                const handleUidSave = (toggle, configKey, message) => {
                    const input = div.find(`div[data-toggle="${toggle}"] .keyword`);
                    input.val(MY_API.CONFIG[configKey].join(', '));

                    div.find(`div[data-toggle="${toggle}"] [data-action="save"]`).click(function () {
                        let val = input.val().trim();
                        if (!val) {
                            MY_API.CONFIG[configKey] = [];
                            MY_API.saveConfig();
                            window.toast(`${message} 已清空`);
                            return;
                        }

                        val = val.replaceAll('，', ',');
                        const uids = val.split(",")
                        .map(uid => uid.trim())
                        .filter(uid => uid !== '')
                        .map(uid => Number(uid))
                        .filter(uid => !isNaN(uid));

                        const uniqueUids = [...new Set(uids)];
                        MY_API.CONFIG[configKey] = uniqueUids;
                        MY_API.saveConfig();
                        window.toast(`${message} 已设置: ${uniqueUids.join(', ')}`);
                    });
                };

                // 初始化UID列表
                handleUidSave('medal_pass_uid', 'medal_pass_uid', '【观看跳过】主播UID');
                handleUidSave('medal_first_uid', 'medal_first_uid', '【观看优先】主播UID');
            },
            getMedalList:async() => {
                let medal_list_now = [];
                let break_mark = false
                for(let page=1;page<999;page++){
                    if(break_mark)break
                    await BAPI.fansMedal_panel(page).then(async (data) => {
                        medal_list_now = medal_list_now.concat(data.data.list);
                        if(data.data.special_list.length)medal_list_now = medal_list_now.concat(data.data.special_list);
                        window.toast(`【勋章升级】正在获取勋章数据：已获取${medal_list_now.length}个`,'success');
                        if (data.data.page_info.current_page >= data.data.page_info.total_page){
                            break_mark = true;
                        }else{
                            await sleep(2000)
                        }
                    }, () => {
                        break_mark = true;
                    });
                }
                return medal_list_now
            },
            auto_heartbert:async() => {
                window.toast(`【勋章升级】开始获取勋章数据`);
                let medal_list_now = await MY_API.getMedalList()
                if(MY_API.CONFIG.sort && medal_list_now.length)medal_list_now.sort(function(a, b) { return a.medal.level - b.medal.level;});
                if(!MY_API.CONFIG.sort && medal_list_now.length)medal_list_now.sort(function(a, b) { return b.medal.level - a.medal.level;});
                if(MY_API.CONFIG.medal_first_uid.length && medal_list_now.length){
                    let new_medal_list_now = []
                    let first_medal_list = []
                    for(let i=0;i<medal_list_now.length;i++){
                        if(MY_API.CONFIG.medal_first_uid.indexOf(medal_list_now[i].medal.target_id) > -1){
                            first_medal_list.push(medal_list_now[i])
                        }else{
                            new_medal_list_now.push(medal_list_now[i])
                        }
                    }
                    medal_list_now = [].concat(first_medal_list).concat(new_medal_list_now)
                }
                let start_ts = ts_s()
                if(medal_list_now.length){
                    for(let i=0;i<medal_list_now.length;i++){
                        let dotime = 25
                        let task_info_mark = true
                        await BAPI.task_info(medal_list_now[i].medal.target_id).then(async (data) => {
                            let task_info = data.data.task_info
                            if(task_info){
                                for(let t=0;t<task_info.length;t++){
                                    if(task_info[t].jump_type == "watchLive"){
                                        if(task_info[t].is_done)task_info_mark = false
                                        if(task_info[t].title == "观看15分钟"){
                                            dotime = 40
                                        }
                                        if(task_info[t].title == "观看直播5分钟"){
                                            let sub_title = task_info[t].sub_title
                                            dotime = (5 - parseInt(sub_title.match(/\d+/)[0], 10))*5
                                        }
                                    }
                                }
                            }else{
                                task_info_mark = false
                            }
                        })
                        if(!task_info_mark){
                            await sleep(5000)
                            continue
                        }
                        if(MY_API.CONFIG.medal_level_pass && medal_list_now[i].medal.level >= MY_API.CONFIG.medal_pass_level){
                            if(MY_API.CONFIG.hide_Toast)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}] [${medal_list_now[i].medal.medal_name}][${medal_list_now[i].medal.level}] 超出等级跳过`)
                            continue
                        }
                        if(MY_API.CONFIG.medal_pass_uid.indexOf(medal_list_now[i].medal.target_id) > -1){
                            if(MY_API.CONFIG.hide_Toast)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}] [${medal_list_now[i].medal.medal_name}][${medal_list_now[i].medal.level}] 不执行名单跳过`)
                            continue
                        }
                        for(let t=0;t<dotime;t++){
                            setTimeout(async() => {
                                if(MY_API.CONFIG.hide_Toast)window.toast(`【观看任务】[${medal_list_now[i].anchor_info.nick_name}] [${medal_list_now[i].medal.medal_name}][${medal_list_now[i].medal.level}] 进度${t+1}/${dotime}`,'info',60000)
                            },t* 60 * 1000)
                        }
                        let roomHeart = new RoomHeart(medal_list_now[i].room_info.room_id,dotime,medal_list_now[i].medal.target_id)
                        await roomHeart.start()
                        //await sleep(5000)
                        await sleep(dotime*60*1000)
                    }
                }
                if(ts_s() - start_ts < 10*60){
                    window.toast(`【观看任务】将在10分钟后重新运行...`)
                    await sleep(10*60*1000)
                }
                return MY_API.auto_heartbert()
            },
            experience_add:async() => {//主站经验大会员加速包
                if(Live_info.vipType >= 1 && Live_info.vipStatus == 1){
                    await BAPI.experience_add(Live_info.csrf_token).then(async(re) => {
                        if(re.code == 0){
                            window.toast(`【大会员经验】主站经验大会员加速包领取成功`, 'success');
                        }else if(re.code == 69801){
                            window.toast(`【大会员经验】主站经验大会员加速包已领取`, 'error');
                        }else{
                            window.toast(`【大会员经验】主站经验大会员加速包：${re.message}`, 'error');
                        }
                    });
                    window.toast(`【大会员经验】将在12小时后重新运行...`)
                    await sleep(12*3600*1000)
                    return MY_API.experience_add()
                }
            },
            score_task_sign:async() => {//大会员自动签到
                if(Live_info.vipType >= 1 && Live_info.vipStatus == 1){
                    await BAPI.score_task_sign().then(async(re) => {
                        if(re.code == 0 && re.message == "success"){
                            window.toast(`【大会员签到】大会员签到成功`, 'success');
                            await BAPI.vip_point_task_combine().then((r) => {
                                if(r.code == 0){
                                    window.toast(`【大会员签到】大会员积分：${r.data.point_info.point}`, 'success');
                                }
                            })
                        }
                    });
                    window.toast(`【大会员签到】将在12小时后重新运行...`)
                    await sleep(12*3600*1000)
                    return MY_API.score_task_sign()
                }
            },
            watch_share:async() => {
                await BAPI.top_rcmd().then(async (response) => {
                    if(response.code === 0 && response.data.item){
                        const obj =(response.data.item[0])
                        await BAPI.watch_heartbeat(obj.id, obj.cid, Live_info.uid, Live_info.csrf_token).then((response) => {
                            //console.log('每日观看', response)
                            if(response.code === 0){
                                window.toast(`【视频观看】视频观看完成(av=${obj.id})`, 'success');
                            }else{
                                window.toast(`【视频观看】视频观看${response.message}`, 'error');
                            }
                        })
                        await BAPI.aid_share(obj.id, Live_info.csrf_token).then((response) => {
                            //console.log('每日分享', response)
                            if(response.code === 0){
                                window.toast(`【视频分享】视频分享完成(av=${obj.id})`, 'success');
                            }else{
                                window.toast(`【视频分享】视频分享${response.message}`, 'error');
                            }
                        })
                    }else{
                        window.toast(`【观看分享】获取视频失败：${response.msg}`, 'error');
                    }
                })
                window.toast(`【观看分享】将在12小时后重新运行...`)
                await sleep(12*3600*1000)
                return MY_API.watch_share()
            },
            coin_add:async() => {
                await BAPI.exp().then(async (response) => {
                    //console.log('今日投币已获经验exp',response.data)
                    if(response.code === 0){
                        let need_coin = (50 - response.data)/10
                        if(need_coin){
                            await BAPI.article_recommends().then(async(response) => {
                                let oidlist = response.data
                                let break_mark = false
                                for(let i = 0;i<need_coin;i++){
                                    if(break_mark)break
                                    await BAPI.article_coin_add(oidlist[i].id, oidlist[i].author.mid, Live_info.csrf_token).then(async(response) => {
                                        //console.log('每日专栏投币', response)
                                        if(response.code === 0){
                                            window.toast(`【投币任务】投币1个成功(av=${oidlist[i].id})`);
                                        }else if(response.code == -104){
                                            break_mark=true
                                            window.toast(`【投币任务】投币${response.message}`);
                                        }else{
                                            break_mark=true
                                            window.toast(`【投币任务】投币${response.message}`);
                                        }
                                    })
                                    await sleep(5000)
                                }
                            })
                        }else{
                            window.toast(`【投币任务】投币任务已完成`);
                        }
                    }
                })
                window.toast(`【投币任务】将在12小时后重新运行...`)
                await sleep(12*3600*1000)
                return MY_API.coin_add()
            },

        };
        MY_API.loadConfig()
        try {
            const promiseInit = $.Deferred();
            const uniqueCheck = () => {
                const t = Date.now();
                if(t - MY_API.CONFIG.js_running_mark >= 0 && t - MY_API.CONFIG.js_running_mark <= 10e3){
                    // 其他脚本正在运行
                    window.toast('检测到脚本已经运行');
                    return promiseInit.reject();
                }
                // 没有其他脚本正在运行
                return promiseInit.resolve();
            };
            uniqueCheck().then(() => {
                let timer_unique;
                const uniqueMark = () => {
                    timer_unique = setTimeout(uniqueMark, 2e3);
                    MY_API.CONFIG.js_running_mark = Date.now();
                    try {
                        localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                        return true
                    } catch (e){
                        console.log('API保存出错', e);
                        return false
                    };
                };
                window.addEventListener('unload', () => {
                    if(timer_unique){
                        clearTimeout(timer_unique);
                        MY_API.CONFIG.js_running_mark = 0;
                        try {
                            localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(MY_API.CONFIG));
                            return true
                        } catch (e){
                            console.log('API保存出错', e);
                            return false
                        };
                    }
                });
                uniqueMark();
                StartPlunder(MY_API);
            })
        } catch (e){
            console.error('重复运行检测错误', e);
        }
    }
    async function StartPlunder(API) {
        await BAPI.room_init(Live_info.room_id).then(async function(data){
            if(data.code == 0 && data.data.live_status == 1){
                window.toast('当前直播间正在直播，由于B站限制仅能生效一个观看亲密度（包括各端），可能不能正常获取亲密度，请挂在未开播直播间','error',60000);
            }
        })

        let icon_pic = 'https://s1.hdslb.com/bfs/live/e051dfd4557678f8edcac4993ed00a0935cbd9cc.png'
        let ui_button = $(`<img width=100 height=100 style="position: fixed; top: 155px; right: 60px;z-index:999;" src=${icon_pic} />`)
        $('html').append(ui_button);
        ui_button.click(function () {
            $('.xzsjzsdiv').toggle()
        });
        API.creatSetBox(); //创建设置框
        $('.xzsjzsdiv').hide()
        let get_cost = () => {
            return BAPI.cost().then((re) => {
                if(re.code == 0){
                    let list = re.data.info
                    for(let i=0;i<list.length;i++){
                        if(list[i].title == "富可敌国"){
                            if(list[i].finished){
                                Live_info.cost = '10个W元以上'
                            }else{
                                Live_info.cost = parseInt(list[i].progress.now/10) + '元'
                            }
                            break
                        }
                    }
                }
            });
        }
        await get_cost()
        let showinfo = async function () {
            let info = document.getElementById('user_info');
            info.innerHTML = `
            <img src="${Live_info.face_url}" width="50" height="50" class="user-avatar">
                <div class="user-details">
                    <div><span class="detail-label">昵称：</span>${Live_info.uname}</div>
                    <div><span class="detail-label">UID：</span>${Live_info.uid}</div>
                    <div><span class="detail-label">直播消费：</span>${Live_info.cost}</div>
                    <div><span class="detail-label">会员等级：</span>${Live_info.vipTypetext}</div>
                    <div><span class="detail-label">主站等级：</span>Lv${Live_info.Blever}</div>
                    <div><span class="detail-label">硬币数量：</span>${Live_info.coin}</div>
                </div>`
        }
        showinfo()
        setTimeout(async() => {
            if (API.CONFIG.auto_medal_task) {
                API.auto_heartbert()
            }
            if (API.CONFIG.auto_share_watch) {
                API.watch_share()
                API.score_task_sign()
                API.experience_add()
            }
            if (API.CONFIG.auto_coin_add) {
                API.coin_add()
            }
        }, 5 * 1000);
    }
})();

const BilibiliAPI = {
    runUntilSucceed: (callback, delay = 0, period = 50) => {
        setTimeout(() => {
            if (!callback())
                BilibiliAPI.runUntilSucceed(callback, period, period);
        }, delay);
    },
    processing: 0,
    ajax: (settings) => {
        if (settings.xhrFields === undefined)
            settings.xhrFields = {};
        settings.xhrFields.withCredentials = true;
        jQuery.extend(settings, {
            url: settings.url,
            method: settings.method || 'GET',
            crossDomain: true,
            dataType: settings.dataType || 'json'
        });
        const p = jQuery.Deferred();
        BilibiliAPI.runUntilSucceed(() => {
            if (BilibiliAPI.processing > 8)
                return false;
            ++BilibiliAPI.processing;
            return jQuery.ajax(settings).then((arg1, arg2, arg3) => {
                --BilibiliAPI.processing;
                p.resolve(arg1, arg2, arg3);
                return true;
            }, (arg1, arg2, arg3) => {
                --BilibiliAPI.processing;
                p.reject(arg1, arg2, arg3);
                return true;
            });
        });
        return p;
    },
    task_info: (ruid) => {//勋章任务
        return BilibiliAPI.ajax({
            url: "https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/GetActivatedMedalInfo?target_id=" + ruid,
            method: "GET",
        })
    },
    fansMedal_panel: (page,pageSize=50) => {//获取全部勋章数据
        return BilibiliAPI.ajax({
            url: "https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel",
            method: "GET",
            data:{
                page:page,
                page_size:pageSize
            }
        })
    },
    cost: () => {//花费适用于10w以下
        return BilibiliAPI.ajax({
            url: "https://api.live.bilibili.com/xlive/web-ucenter/v1/achievement/list?type=normal&status=0&category=all&keywords=&page=1&pageSize=100",
            method: "GET",
        })
    },
    room_init: (roomid) => {//花费适用于10w以下
        return BilibiliAPI.ajax({
            url: "https://api.live.bilibili.com/room/v1/Room/room_init?id="+roomid,
            method: "GET",
        })
    },
    top_rcmd: () => {//首页视频推荐
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/x/web-interface/index/top/rcmd",
            method: "GET",
        })
    },
    watch_heartbeat: (i, e, a, csrf) => {//视频观看
        return BilibiliAPI.ajax({
            method: "POST",
            url: "https://api.bilibili.com/x/report/web/heartbeat",
            data: {
                aid: i,
                cid: e,
                mid: a,
                start_ts: Math.round(Date.now()/1000),
                played_time: 0,
                realtime: 0,
                type: 3,
                play_type: 1,
                dt: 2,
                csrf:csrf
            }
        })
    },
    aid_share: (i, csrf) => {//视频分享
        return BilibiliAPI.ajax({
            method: "POST",
            url: "https://api.bilibili.com/x/web-interface/share/add",
            data: {
                aid: i,
                csrf: csrf,
                jsonp: "jsonp"
            }
        })
    },
    exp: () => {//投币经验
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/x/web-interface/coin/today/exp",
        })
    },
    article_recommends: () => {//获取最新专栏信息
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/x/article/recommends",
            method: "GET",
            data:{
                aid:'',
                cid:3,
                pn:1,
                ps:20,
                jsonp:'jsonp',
                sort:1
            }
        })
    },
    article_coin_add: (oid, upid, csrf) => {//专栏投币
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/x/web-interface/coin/add",
            method: "POST",
            data:{
                aid:oid,
                upid: upid,
                multiply: 1,
                avtype: 2,
                csrf: csrf
            }
        })
    },
    experience_add: (csrf) => {//大会员经验包
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/x/vip/experience/add",
            method: "POST",
            data:{
                csrf: csrf
            }
        })
    },
    score_task_sign:() => {//大会员积分签到
        return BilibiliAPI.ajax({
            url: "https://api.bilibili.com/pgc/activity/score/task/sign",
            method: "POST",
        })
    },
}
//https://github.com/lzghzr/TampermonkeyJS

class RoomHeart {
    constructor(t,g,r) {
        this.roomID = t,
        this.Dotime = g,
        this.ruid = r
    }
    areaID;
    parentID;
    seq = 0;
    roomID;
    Dotime;
    get id() {
        return [this.parentID, this.areaID, this.seq, this.roomID]
    }
    buvid = this.getItem("LIVE_BUVID");
    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (t => {
                const e = 16 * Math.random() | 0;
                return ("x" === t ? e : 3 & e | 8).toString(16)
            }));
    device = [this.buvid, this.uuid];
    get ts() {
        return Date.now()
    }
    _patchData = {};
    get patchData() {
        const t = [];
        for (const[e, i]of Object.entries(this._patchData))
            t.push(i);
        return t
    }
    get isPatch() {
        return 0 === this.patchData.length ? 0 : 1
    }
    W = "undefined" == typeof unsafeWindow ? window : unsafeWindow;
    ua = this.W && this.W.navigator ? this.W.navigator.userAgent : "";
    csrf = this.getItem("bili_jct") || "";
    nextInterval = Math.floor(5) + Math.floor(55 * Math.random());
    heartBeatInterval;
    secretKey;
    secretRule;
    timestamp;
    lastHeartbeatTimestamp = Date.now();
    get watchTimeFromLastReport() {
        const t = Math.ceil(((new Date).getTime() - this.lastHeartbeatTimestamp) / 1e3);
        return t < 0 ? 0 : t > this.heartBeatInterval ? this.heartBeatInterval : t
    }
    start() {
        return this.getInfoByRoom()
    }
    doneFunc = function () {};
    async getInfoByRoom() {
        if (0 === this.roomID)
            return !1;
        const t = await fetch(`//api.live.bilibili.com/room/v1/Room/get_info?room_id=${this.roomID}&from=room`, {
            mode: "cors",
            credentials: "include"
        }).then((t => t.json()));
        return 0 === t.code && (({
                area_id: this.areaID,
                parent_area_id: this.parentID,
                room_id: this.roomID
            } = t.data), 0 !== this.areaID && 0 !== this.parentID && (this.e(), !0))
    }
    async webHeartBeat() {
        if (this.seq > this.Dotime)
            return;
        const t = `${this.nextInterval}|${this.roomID}|1|0`,
        e = CryptoJS.enc.Utf8.parse(t),
        i = CryptoJS.enc.Base64.stringify(e),
        s = await fetch(`//live-trace.bilibili.com/xlive/rdata-interface/v1/heartbeat/webHeartBeat?hb=${encodeURIComponent(i)}&pf=web`, {
            mode: "cors",
            credentials: "include"
        }).then((t => t.json()));
        0 === s.code && (this.nextInterval = s.data.next_interval, setTimeout((() => this.webHeartBeat()), 1e3 * this.nextInterval))
    }
    async savePatchData() {
        if (this.seq > this.Dotime)
            return;
        const t = {
            id: JSON.stringify(this.id),
            device: JSON.stringify(this.device),
            ruid:this.ruid,
            ets: this.timestamp,
            benchmark: this.secretKey,
            time: this.watchTimeFromLastReport > this.heartBeatInterval ? this.heartBeatInterval : this.watchTimeFromLastReport,
            ts: this.ts,
            ua: this.ua
        },
        e = this.sypder(JSON.stringify(t), this.secretRule),
        i = Object.assign({
            s: e
        }, t);
        this._patchData[this.roomID] = i,
        setTimeout((() => this.savePatchData()), 15e3)
    }
    async e() {
        const t = {
            id: JSON.stringify(this.id),
            device: JSON.stringify(this.device),
            ruid:this.ruid,
            ts: this.ts,
            is_patch: 0,
            heart_beat: "[]",
            ua: this.ua
        },
        e = await fetch("//live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/E", {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `${this.json2str(t)}&csrf_token=${this.csrf}&csrf=${this.csrf}&visit_id=`,
            mode: "cors",
            credentials: "include"
        }).then((t => t.json()));
        0 === e.code && (this.seq += 1, ({
                heartbeat_interval: this.heartBeatInterval,
                secret_key: this.secretKey,
                secret_rule: this.secretRule,
                timestamp: this.timestamp
            } = e.data), setTimeout((() => this.x()), 1e3 * this.heartBeatInterval))
    }
    async x() {
        if (this.seq > this.Dotime)
            return this.doneFunc();
        const t = {
            id: JSON.stringify(this.id),
            device: JSON.stringify(this.device),
            ruid:this.ruid,
            ets: this.timestamp,
            benchmark: this.secretKey,
            time: this.heartBeatInterval,
            ts: this.ts,
            ua: this.ua
        },
        e = this.sypder(JSON.stringify(t), this.secretRule),
        i = Object.assign({
            s: e
        }, t);
        this._patchData[this.roomID] = i,
        this.lastHeartbeatTimestamp = Date.now();
        const s = await fetch("//live-trace.bilibili.com/xlive/data-interface/v1/x25Kn/X", {
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `${this.json2str(i)}&csrf_token=${this.csrf}&csrf=${this.csrf}&visit_id=`,
            mode: "cors",
            credentials: "include"
        }).then((t => t.json()));
        0 === s.code && (this.seq += 1, ({
                heartbeat_interval: this.heartBeatInterval,
                secret_key: this.secretKey,
                secret_rule: this.secretRule,
                timestamp: this.timestamp
            } = s.data), setTimeout((() => this.x()), 1e3 * this.heartBeatInterval))
    }
    sypder(t, e) {
        const i = JSON.parse(t),
        [s, a, r, n] = JSON.parse(i.id),
        [o, c] = JSON.parse(i.device),
        h = i.benchmark,
        m = {
            platform: "web",
            parent_id: s,
            area_id: a,
            seq_id: r,
            room_id: n,
            buvid: o,
            uuid: c,
            ets: i.ets,
            time: i.time,
            ts: i.ts
        };
        let d = JSON.stringify(m);
        for (const t of e)
            switch (t) {
            case 0:
                d = CryptoJS.HmacMD5(d, h).toString(CryptoJS.enc.Hex);
                break;
            case 1:
                d = CryptoJS.HmacSHA1(d, h).toString(CryptoJS.enc.Hex);
                break;
            case 2:
                d = CryptoJS.HmacSHA256(d, h).toString(CryptoJS.enc.Hex);
                break;
            case 3:
                d = CryptoJS.HmacSHA224(d, h).toString(CryptoJS.enc.Hex);
                break;
            case 4:
                d = CryptoJS.HmacSHA512(d, h).toString(CryptoJS.enc.Hex);
                break;
            case 5:
                d = CryptoJS.HmacSHA384(d, h).toString(CryptoJS.enc.Hex);
                break;
            default:
                break
            }
        return d
    }
    getItem(t) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(t).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || ""
    }
    json2str(t) {
        let e = "";
        for (const i in t)
            e += `${i}=${encodeURIComponent(t[i])}&`;
        return e.slice(0, -1)
    }
}