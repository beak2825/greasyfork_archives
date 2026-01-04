// ==UserScript==
// @name         微博超话自动签到-C
// @version      1.0.9
// @namespace    https://deuscx.github.io/
// @description  用户登录后进入微博主页，获取超级话题并自动签到
// @homepageURL  https://github.com/Deuscx/WB_SIGN_EXT
// @supportURL   https://github.com/Deuscx/WB_SIGN_EXT/issues
// @author       deus/chinshry
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.staticfile.org/toastr.js/latest/toastr.min.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395968/%E5%BE%AE%E5%8D%9A%E8%B6%85%E8%AF%9D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-C.user.js
// @updateURL https://update.greasyfork.org/scripts/395968/%E5%BE%AE%E5%8D%9A%E8%B6%85%E8%AF%9D%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const NAME = 'WB'
    const VERSION = '1.0.7'
   
    let CONFIG;
    let CACHE;

    let API = {
        setCommonArgs: (csrfToken = '', visitId = '') => {
            csrf_token = csrfToken;
            visit_id = visitId;
        },
        runUntilSucceed: (callback, delay = 0, period = 50) => {
            setTimeout(() => {
                if (!callback()) API.runUntilSucceed(callback, period, period);
            }, delay);
        },
        processing: 0,
        ajax: (settings) => {
            if (settings.xhrFields === undefined) settings.xhrFields = {};
            settings.xhrFields.withCredentials = true;
            jQuery.extend(settings, {
                url: (settings.url.substr(0, 2) === '//' ? '' : '//weibo.com/') + settings.url,
                method: settings.method || 'GET',
                crossDomain: true,
                dataType: settings.dataType || 'json'
            });
            const p = jQuery.Deferred();
            API.runUntilSucceed(() => {
                if (API.processing > 8) return false;
                ++API.processing;
                return jQuery.ajax(settings).then((arg1, arg2, arg3) => {
                    --API.processing;
                    p.resolve(arg1, arg2, arg3);
                    return true;
                }, (arg1, arg2, arg3) => {
                    --API.processing;
                    p.reject(arg1, arg2, arg3);
                    return true;
                });
            });
            return p;
        },

        ajaxWithCommonArgs: (settings) => {
            if (!settings.data) settings.data = {};
            settings.data.csrf = csrf_token;
            settings.data.csrf_token = csrf_token;
            settings.data.visit_id = visit_id;
            return API.ajax(settings);
        },

        Interest: {
            signInterest: (id) => {
                return API.ajax({
                    url: 'p/aj/general/button',
                    data: {
                        ajwvr: 6,
                        api: 'http://i.huati.weibo.com/aj/super/checkin',
                        texta: encodeURI('签到'),
                        textb: encodeURI('已签到'),
                        status: 0,
                        id: id, //话题id
                        location: 'page_100808_super_index',
                        timezone: 'GMT 0800',
                        lang: 'zh-cn',
                        plat: 'Windows',
                        ua: 'Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14',
                        screen: '1920*1080',
                        __rnd: new Date().getTime()
                    }
                });
            }
        }
    }

    toastr.options = {
        closeButton: true, // 是否显示关闭按钮，（提示框右上角关闭按钮）
        debug: false, // 是否使用deBug模式
        progressBar: false, // 是否显示进度条，（设置关闭的超时时间进度条）
        //positionClass: "toast-bottom-center",              // 设置提示款显示的位置
        onclick: null, // 点击消息框自定义事件 
        showDuration: "300", // 显示动画的时间
        hideDuration: "1000", //  消失的动画时间
		timeOut: "2000",
        extendedTimeOut:"1000",
        showEasing: "swing", //  显示时的动画缓冲方式
        hideEasing: "linear", //   消失时的动画缓冲方式
        showMethod: "slideDown", //   显示时的动画方式
        hideMethod: "slideUp" //   消失时的动画方式
    };
    const tz_offset = new Date().getTimezoneOffset() + 480;

    const ts_s = () => Math.round(ts_ms() / 1000);

    const ts_ms = () => Date.now();

    const delayCall = (callback, delay = 10e3) => {
        const p = $.Deferred();
        setTimeout(() => {
            const t = callback();
            if (t && t.then) t.then((arg1, arg2, arg3, arg4, arg5, arg6) => p.resolve(arg1, arg2, arg3, arg4, arg5, arg6));
            else p.resolve();
        }, delay);
        return p;
    };

    const checkNewDay = (ts) => {
        // 检查是否为新的一天，以UTC+8为准
        const t = new Date(ts);
        t.setMinutes(t.getMinutes() + tz_offset);
        t.setHours(0, 0, 0, 0);
        const d = new Date();
        d.setMinutes(t.getMinutes() + tz_offset);
        return (d - t > 86400e3);
    };

    const runTomorrow = (callback) => {
        const t = new Date();
        t.setMinutes(t.getMinutes() + tz_offset);
        t.setDate(t.getDate() + 1);
        t.setHours(0, 1, 0, 0);
        t.setMinutes(t.getMinutes() - tz_offset);
        setTimeout(callback, t - ts_ms());
    };

    const runUntilSucceed = (callback, delay = 0, period = 100) => {
        setTimeout(() => {
            if (!callback()) runUntilSucceed(callback, period, period);
        }, delay);
    };

    const addCSS = (context) => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = context;
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    $('head').append(`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css" />`)
    const Essential = {
        init: () => {

            return Essential.Toast.init().then(() => {
                return Essential.Config.init().then(() => {
                    Essential.DataSync.init();
                    Essential.Cache.load();
                    Essential.Config.load();
                });
            });

        },
        Toast: {
            init: () => {
                try {
                    window.toast = (msg, type = 'success', timeout = 3e3) => {
                        let d = new Date().toLocaleTimeString();
                        switch (type) {
                            case 'success':
                            case 'info':
                                console.info(`[${NAME}][${d}]${msg}`);
                                break;
                            case 'caution':
                                console.warn(`[${NAME}][${d}]${msg}`);
                                break;
                            case 'error':
                                console.error(`[${NAME}][${d}]${msg}`);
                                break;
                            default:
                                type = 'info';
                                console.log(`[${NAME}][${d}]${msg}`);
                        }
                        if (CONFIG && !CONFIG.SHOW_TOAST) return; //如果没有配置显示浮动，就直接返回
                        switch (type) {
                            case 'success':
                                toastr.success(`${msg}`)
                                break;
                            case 'info':
                                toastr.info(`${msg}`)
                                break;
                            case 'error':
                                toastr.error(`${msg}`)
                                break;
                            case 'warning':
                                toastr.warning(`${msg}`)
                                break;
                            default:
                                toastr.success(`${msg}`)
                        }
                    };
                    return $.Deferred().resolve();
                } catch (err) {
                    console.error(`[${NAME}]初始化浮动提示时出现异常`);
                    console.error(`[${NAME}]`, err);
                    return $.Deferred().reject();
                }
            },
            reload:() =>{
                Essential.Toast.init();
            }
        },
        Config: {
            CONFIG_DEFAULT: {
                AUTO_SIGN: true,
                SHOW_TOAST: true,
                TIMEOUT: 1000
            },
            NAME: {
                AUTO_SIGN: '自动签到',
                SHOW_TOAST: '显示浮动提示',
                TIMEOUT: '延迟时间'
            },
            HELP: {
                TIMEOUT:'提示：设置延迟时间为0,窗口将不会自动关闭 '
            },
            PLACEHOLDER:{
                TIMEOUT:"请输入延迟时间，单位为秒"
            },
            showed: false,
            init: () => {
                try {
                    const p = $.Deferred();
                    const getConst = (itemname, obj) => {
                        if (itemname.indexOf('-') > -1) {
                            const objname = itemname.match(/(.+?)-/)[1];
                            if (objname && obj[objname]) return getConst(itemname.replace(`${objname}-`, ''), obj[objname]);
                            else return undefined;
                        }
                        if (typeof obj[itemname] === 'function') return obj[itemname]();
                        return obj[itemname];
                    };
                    const recur = (cfg, element, parentname = undefined) => {
                        //这里cfg 是 CONFIG_DEFAULT 这个对象  element 是每个设置项块 的jquery对象
                        for (const item in cfg) {
                            let itemname;
                            if (parentname) itemname = `${parentname}-${item}`;
                            else itemname = item; //其中itemname 一个为AUTO_SIGN

                            const id = `${NAME}_config_${itemname}`;
                            const name = getConst(itemname, Essential.Config.NAME); //Essential.Config.NAME 返回对应的中文信息
                            const placeholder = getConst(itemname, Essential.Config.PLACEHOLDER);

                            let e;
                            let h;
                            if (getConst(itemname, Essential.Config.HELP))
                                h = $(`<div class="${NAME}_help" id="${id}_help" style="display: inline;"><span class="${NAME}_clickable">?</span></div>`);

                            switch ($.type(cfg[item])) {
                                case 'number':
                                case 'string':
                                    e = $(`<div class="${NAME}_setting_item"></div>`);
                                    e.html(`<label style="display: inline;" title="${name}">${name}<input id="${id}" type="text" class="${NAME}_input_text" placeholder="${placeholder}"></label>`);
                                    if (h) e.append(h);
                                    element.append(e);
                                    break;
                                case 'boolean':
                                    e = $(`<div class="${NAME}_setting_item"></div>`);
                                    e.html(`<label style="display: inline;" title="${name}"><input id="${id}" type="checkbox" class="${NAME}_input_checkbox">${name}</label>`);
                                    if (h) e.append(h);
                                    element.append(e);
                                    if (getConst(`${itemname}_CONFIG`, Essential.Config.NAME)) $(`#${id}`).addClass(`${NAME}_control`);
                                    break;
                                case 'array':
                                    e = $(`<div class="${NAME}_setting_item"></div>`);
                                    e.html(`<label style="display: inline;" title="${name}">${name}<input id="${id}" type="text" class="${NAME}_input_text" placeholder="${placeholder}"></label>`);
                                    if (h) e.append(h);
                                    element.append(e);
                                    break;
                                case 'object':
                                    e = $(`<div id="${id}" style="margin: 0px 0px 8px 12px;"/>`);
                                    element.append(e);
                                    recur(cfg[item], e, itemname);
                                    break;
                            }
                        }
                    };
                    runUntilSucceed(() => {
                        try {

                            if (!$('.gn_position div.gn_nav')[0]) return false;

                            // 加载css
                            addCSS(`.${NAME}_clickable {font-size: 12px;color: #0080c6;cursor: pointer;text-decoration: underline;}
                            .${NAME}_setting_item {margin: 6px 0px;}
                            .${NAME}_input_checkbox {vertical-align: bottom;}
                            .${NAME}_input_text {margin: -2px 0 -2px 4px;padding: 0;}`);
                            // 绘制右下角按钮
                            const div_button_span = $('<span>助手设置</span>');
                            div_button_span[0].style = 'font-size: 12px;line-height: 16px;color: #0080c6;';
                            const div_button = $('<div/>');
                            div_button[0].style = 'cursor: pointer;text-align: center;padding: 0px;';
                            const div_side_bar = $('<div/>');
                            div_side_bar[0].style = 'width: 56px;height: 32px;overflow: hidden;position: fixed;right: 0px;bottom: 10%;padding: 4px 4px;background-color: rgb(255, 255, 255);z-index: 10001;border-radius: 8px 0px 0px 8px;box-shadow: rgba(0, 85, 255, 0.0980392) 0px 0px 20px 0px;border: 1px solid rgb(233, 234, 236);';
                            div_button.append(div_button_span);
                            div_side_bar.append(div_button);
                            $('.gn_position div.gn_nav').first().after(div_side_bar);
                            // 绘制设置界面
                            const div_position = $('<div/>');
                            div_position[0].style = 'display: none;position: fixed;height: 300px;width: 300px;bottom: 5%;z-index: 9999;';
                            const div_style = $('<div/>');
                            div_style[0].style = 'display: block;overflow: hidden;height: 300px;width: 300px;border-radius: 8px;box-shadow: rgba(106, 115, 133, 0.219608) 0px 6px 12px 0px;border: 1px solid #1e90ff ;background-color: rgb(255, 255, 255);';
                            div_position.append(div_style);
                            document.body.appendChild(div_position[0]);
                            // 绘制标题栏及按钮
                            const div_title = $('<div/>');
                            div_title[0].style = 'display: block;border-bottom: 1px solid #E6E6E6;height: 35px;line-height: 35px;margin: 0;padding: 0;overflow: hidden;';
                            const div_title_span = $('<span style="float: left;display: inline;padding-left: 8px;font: 700 14px/35px SimSun;">签到助手</span>');
                            const div_title_button = $('<div/>');
                            div_title_button[0].style = 'float: right;display: inline;padding-right: 8px;';
                            const div_button_clear = $(`<div style="display: inline;"><span class="${NAME}_clickable">清除缓存</span></div>`);
                            div_title_button.append(div_button_clear);
                            div_title.append(div_title_span);
                            div_title.append(div_title_button);
                            div_style.append(div_title);
                            // 绘制设置项内容
                            const div_context_position = $('<div/>');
                            div_context_position[0].style = 'display: block;position: absolute;top: 36px;width: 100%;height: calc(100% - 36px);';
                            const div_context = $('<div/>');
                            div_context[0].style = 'height: 100%;overflow: auto;padding: 0 12px;margin: 0px;';
                            div_context_position.append(div_context);
                            div_style.append(div_context_position);


                            recur(Essential.Config.CONFIG_DEFAULT, div_context);

                            // 设置事件 点击展开或关闭侧边栏
                            div_button.click(() => {
                                if (!Essential.Config.showed) {
                                    Essential.Config.load();
                                    div_position.css('right', div_side_bar[0].clientWidth + 'px');
                                    div_position.show();
                                    div_button_span.text('点击保存设置');
                                    div_button_span.css('color', '#ff8e29');
                                } else {
                                    Essential.Config.save();
                                    div_position.hide();
                                    div_button_span.text('助手设置');
                                    div_button_span.css('color', '#0080c6');
                                }
                                Essential.Config.showed = !Essential.Config.showed;
                            });
                            div_button_clear.click(() => {
                                Essential.Cache.clear();
                                localStorage.removeItem(`${NAME}_SIGNED_ARR`);
                                location.reload();
                            });
                            const getItemByElement = (element) => element.id.replace(`${NAME}_config_`, '');
                            const getItemByHelpElement = (element) => element.id.replace(`${NAME}_config_`, '').replace('_help', '');

                            $(`.${NAME}_help`).click(function () {
                                window.toast(getConst(getItemByHelpElement(this), Essential.Config.HELP),'info');
                            });
                            $(`.${NAME}_control`).click(function () { //控制次级栏的显示
                                if ($(this).is(':checked')) {
                                    $(`#${NAME}_config_${getItemByElement(this)}_CONFIG`).show();
                                } else {
                                    $(`#${NAME}_config_${getItemByElement(this)}_CONFIG`).hide();
                                }
                            });
                            p.resolve();
                            return true;
                        } catch (err) {
                            window.toast('初始化设置界面时出现异常', 'error');
                            console.error(`[${NAME}]`, err);
                            p.reject();
                            return true;
                        }
                    });
                    return p;
                } catch (err) {
                    window.toast('初始化设置时出现异常', 'error');
                    console.error(`[${NAME}]`, err);
                    return $.Deferred().reject();
                }
            },
            recurLoad: (cfg, parentname = undefined, cfg_default = Essential.Config.CONFIG_DEFAULT) => {
                for (const item in cfg_default) {
                    let itemname;
                    if (parentname) itemname = `${parentname}-${item}`;
                    else itemname = item;
                    const e = $(`#${NAME}_config_${itemname}`);
                    if (!e[0]) continue;
                    if (cfg[item] === undefined) cfg[item] = Essential.Config._copy(cfg_default[item]);
                    switch ($.type(cfg[item])) {
                        case 'number':
                        case 'string':
                            e.val(cfg[item]);
                            break;
                        case 'boolean':
                            e.prop('checked', cfg[item]);
                            if (e.is(':checked')) $(`#${NAME}_config_${itemname}_CONFIG`).show();
                            else $(`#${NAME}_config_${itemname}_CONFIG`).hide();
                            break;
                        case 'array':
                            e.val(cfg[item].join(','));
                            break;
                        case 'object':
                            Essential.Config.recurLoad(cfg[item], itemname, cfg_default[item]);
                            break;
                    }
                }
            },
            recurSave: (cfg, parentname = undefined, cfg_default = Essential.Config.CONFIG_DEFAULT) => {
                if (Object.prototype.toString.call(cfg) !== '[object Object]') return cfg;
                for (const item in cfg_default) {
                    let itemname;
                    if (parentname) itemname = `${parentname}-${item}`;
                    else itemname = item;
                    const e = $(`#${NAME}_config_${itemname}`);
                    if (!e[0]) continue;
                    switch ($.type(cfg[item])) {
                        case 'string':
                            cfg[item] = e.val() || '';
                            break;
                        case 'number':
                            cfg[item] = parseFloat(e.val());
                            if (isNaN(cfg[item])) cfg[item] = 0;
                            break;
                        case 'boolean':
                            cfg[item] = e.is(':checked'); //判断是否被选中
                            break;
                        case 'array':
                            const value = e.val().replace(/(\s|\u00A0)+/, '');
                            if (value === '') cfg[item] = [];
                            else cfg[item] = value.split(',');
                            cfg[item].forEach((v, i) => {
                                cfg[item][i] = parseFloat(v);
                                if (isNaN(cfg[item][i])) cfg[item][i] = 0;
                            });
                            break;
                        case 'object':
                            cfg[item] = Essential.Config.recurSave(cfg[item], itemname, cfg_default[item]);
                            break;
                    }
                    if (cfg[item] === undefined) cfg[item] = Essential.Config._copy(cfg_default[item]);
                }
                return cfg;
            },
            fix: (config) => {
                // 修正设置项中不合法的参数，针对有输入框的设置项
                if (config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER === undefined) config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER = Essential.Config.CONFIG_DEFAULT.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER;
                config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER = parseInt(config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER, 10);
                if (config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER < 1) config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER = 1;
                else if (config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER > 5) config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.LISTEN_NUMBER = 5;

                if (config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL === undefined) config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL = Essential.Config.CONFIG_DEFAULT.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL;
                config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL = parseInt(config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL, 10);
                if (config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL < 0) config.AUTO_LOTTERY_CONFIG.GIFT_LOTTERY_CONFIG.REFRESH_INTERVAL = 0;

                if (config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL === undefined) config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL = Essential.Config.CONFIG_DEFAULT.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL;
                config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL = parseInt(config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL, 10);
                if (config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL < 0) config.AUTO_LOTTERY_CONFIG.GUARD_AWARD_CONFIG.CHANGE_ROOM_INTERVAL = 0;

                if (config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL === undefined) config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL = Essential.Config.CONFIG_DEFAULT.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL;
                config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL = parseInt(config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL, 10);
                if (config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL < 0) config.AUTO_LOTTERY_CONFIG.MATERIAL_OBJECT_LOTTERY_CONFIG.CHECK_INTERVAL = 0;

                if (config.AUTO_GIFT_CONFIG.ROOMID === undefined) config.AUTO_GIFT_CONFIG.ROOMID = Essential.Config.CONFIG_DEFAULT.AUTO_GIFT_CONFIG.ROOMID;
                config.AUTO_GIFT_CONFIG.ROOMID = parseInt(config.AUTO_GIFT_CONFIG.ROOMID, 10);
                if (config.AUTO_GIFT_CONFIG.ROOMID < 0) config.AUTO_GIFT_CONFIG.ROOMID = 0;

                if (config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER === undefined) config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER = Essential.Config.CONFIG_DEFAULT.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER;
                config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER = parseInt(config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER, 10);
                if (config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER < 0) config.AUTO_DAILYREWARD_CONFIG.COIN_CONFIG.NUMBER = 0;
                return config;
            },
            _copy: (obj) => {
                return JSON.parse(JSON.stringify(obj));
            },
            load: () => {
                try {
                    CONFIG = JSON.parse(localStorage.getItem(`${NAME}_CONFIG`)) || {};
                    //CONFIG = Essential.Config.fix(CONFIG);
                    if (Object.prototype.toString.call(CONFIG) !== '[object Object]') throw new Error();
                } catch (e) {
                    CONFIG = Essential.Config._copy(Essential.Config.CONFIG_DEFAULT); //如果获取缓存中的配置信息错误，则获取默认配置
                }
                Essential.Config.recurLoad(CONFIG);
                localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(CONFIG));
            },
            save: () => {
                CONFIG = Essential.Config.recurSave(CONFIG);
                //CONFIG = Essential.Config.fix(CONFIG);
                let oToastTIMEOUT = JSON.parse(localStorage.WB_CONFIG).TIMEOUT;
                Essential.DataSync.down();
                localStorage.setItem(`${NAME}_CONFIG`, JSON.stringify(CONFIG));

                if(oToastTIMEOUT!= CONFIG.TIMEOUT){
                    Essential.Toast.reload();
                }
                window.toast('设置已保存，部分设置需要刷新后生效', 'success');
            },
            clear: () => {
                CONFIG = Essential.Config._copy(Essential.Config.CONFIG_DEFAULT);
                Essential.DataSync.down();
                localStorage.removeItem(`${NAME}_CONFIG`);
            }
        },
        Cache: { //缓存
            load: () => {
                try {
                    CACHE = JSON.parse(localStorage.getItem(`${NAME}_CACHE`));
                    if (Object.prototype.toString.call(CACHE) !== '[object Object]') throw new Error(); //检测对象类型
                    if (CACHE.version !== VERSION) Essential.Cache.clear();
                } catch (err) {
                    CACHE = {
                        version: VERSION
                    };
                    localStorage.setItem(`${NAME}_CACHE`, JSON.stringify(CACHE));
                }
            },
            save: () => {
                localStorage.setItem(`${NAME}_CACHE`, JSON.stringify(CACHE));
            },
            clear: () => {
                CACHE = {
                    version: VERSION
                };
                Essential.DataSync.down();
                localStorage.removeItem(`${NAME}_CACHE`);
            }
        },
        DataSync: {
            init: () => {
                window[NAME] = {};
                window[NAME].iframeSet = new Set();
            },
            down: () => {
                try {
                    window[NAME].Info = Info;
                    window[NAME].CONFIG = CONFIG;
                    window[NAME].CACHE = CACHE;
                    for (const iframe of window[NAME].iframeSet) {
                        if (iframe.promise.down) iframe.promise.down.resolve();
                    }
                } catch (err){}
            }
        }

    }

    let SignedArr=[]

    const Interest = {
        run: () => {
            if (!CONFIG.AUTO_SIGN) return $.Deferred().resolve();
            
            if (CACHE.sign_ts && !checkNewDay(CACHE.sign_ts)) {
                // 同一天，不再检查签到
                window.toast('今日已签到','info')
                runTomorrow(Interest.run);
                return $.Deferred().resolve();
            }
            localStorage.removeItem(`${NAME}_SIGNED_ARR`);
            Interest.getInterestHash().then(
                (hash) => {
                    var hashName=Object.keys(hash)
                    for (let i = 0; i <hashName.length ; i++) {
                       // console.log(hash[hashName[i]]+'---'+hashName[i])
                        Interest.signInterest(hash[hashName[i]],hashName[i])
                    }
                },(response)=>{
                    window.toast(`${response}`,'error')
                }
            );

        },
        getInterestHash: function(){
            let user_id;
            const g = jQuery.Deferred();
            let hash;
          

            if(!localStorage[`${NAME}_page_id`] && isNaN(parseInt(window.$CONFIG.page_id,10))){
                window.toast("未获取到page_id  请到'关注页'再刷新尝试",'error')
            }else {
                if(!isNaN(parseInt(window.$CONFIG.page_id,10))){
                    localStorage[`${NAME}_page_id`]=window.$CONFIG.page_id
                }
                user_id =  localStorage[`${NAME}_page_id`];
            }


            $.ajax({
                url: `https://weibo.com/p/${user_id}/myfollow?relate=interested`
            }).then((response) => {
                    var pageSize=1
                    if(response.indexOf("Pl_Official_RelationInterested__97_page")!=-1){
                        var a=response.split(/Pl_Official_RelationInterested__97_page/);
                        pageSize=a[a.length-2][1];
                    }
                    Promise.all(Interest.get_topic_hash(response, pageSize, user_id))
                    .then(
                        (result)=>{
                           this.recur_topic_hash(result).then((hash)=>{
                            //console.log('hash',hash);
                            g.resolve(hash);
                        });
                        }
                    )
                },
                (err) => { 
                    console.error(`[${NAME}]`, err);
                    g.reject('获取hash失败');
                })
            return g
        },
        recur_topic_hash:(arr)=>{
            const recurDef=jQuery.Deferred();
            let result={};
            arr.forEach((obj)=>{
                Object.assign(result,obj);
            })
            if(localStorage[`${NAME}_SIGNED_ARR`]){
                    let arr = localStorage.getItem(`${NAME}_SIGNED_ARR`).split(",");
                    arr.forEach((name)=>{
                        delete result[name];
                    })
                    console.log(result);
            }
            recurDef.resolve(result);
            return recurDef;
        },
        get_topic_hash: (response_text, page, user_id) => {
            // 从响应文本中解析出话题名称和 hash
            /* 参数: 
                response_text: 待解析的文本  其中一部分为   
                page: 当前页号，用来得到下一页的链接
                user_id: 用户ID
            */
            let promiseArr=[];
            var name_start_index, name_end_index, name, hash;
            for (let i = 1; i <= page ; i++) {
               promiseArr.push(
                   new Promise((resolve,reject)=>{
                    $.ajax({
                        url:`https://weibo.com/p/${user_id}/myfollow?cfs=600&relate=interested&Pl_Official_RelationInterested__97_page=${i}`
                    }).then((response_text)=>{
                        var name_index = response_text.indexOf('screen_name=');
                        let result={};
                        while (name_index != -1) {
                            // 循环得到 response_text 的话题名和 hash
                            name_start_index = name_index + 12;
                            name_end_index = response_text.indexOf('&', name_index); //从name_index找到&
                            name = response_text.slice(name_start_index, name_end_index); // slice从start到end（不包含）
                            hash = response_text.slice(name_index - 56, name_index - 56 + 38);
                            result[name] = hash;
                            name_index = response_text.indexOf('screen_name=', name_index + 100);
                        }
                        resolve(result);
                    },(err)=>{
                        reject(err);
                    })
                   })
               ) 
            }
            return promiseArr;
        },
        signInterest: (id, name) => {
            API.Interest.signInterest(id).then((response) => {
                    if (response.code === '100000') {
                        window.toast(`[${name}签到成功]${response.msg} ---${response.data.alert_title}`,'success')
                        CACHE.sign_ts = ts_ms();
                        Essential.Cache.save();

                        SignedArr.push(name);
                        SignedArr = Array.from(new Set(SignedArr));
                        localStorage.setItem(`${NAME}_SIGNED_ARR`,SignedArr); 
                    } else {
                        window.toast(`[${name}超话签到]${response.msg}`, 'warning')
                        if(response.code !="382004"){
                            CACHE.sign_ts = undefined;
                        }else{
                            CACHE.sign_ts = ts_ms();

                            SignedArr.push(name);
                            SignedArr = Array.from(new Set(SignedArr)); 
                            localStorage.setItem(`${NAME}_SIGNED_ARR`,SignedArr); 
                        }
                        Essential.Cache.save();
                    }
                },
                () => {
                    window.toast('[${name}超话签到]签到失败，请检查网络', 'error');
                    return delayCall(() => Interest.run())
                })
        }
    }


    const Init = () => {
        try {
            const promiseInit = $.Deferred();
            Essential.init().then(() => {
                const uniqueCheck = () => {
                    const p1 = $.Deferred();
                    const t = Date.now() / 1000;
                    // 没有其他脚本正在运行
                    return p1.resolve();
                };
                uniqueCheck().then(() => {
                    let timer_unique;
                    const uniqueMark = () => {
                        timer_unique = setTimeout(uniqueMark, 10e3);
                        CACHE.unique_check = Date.now() / 1000;
                        Essential.Cache.save();
                    };
                    window.addEventListener('unload', () => {
                        if (timer_unique) {
                            clearTimeout(timer_unique);
                            CACHE.unique_check = 0;
                            Essential.Cache.save();
                        }
                    });
                    uniqueMark();
                    window.toast('正在初始化脚本...', 'info');
                    const InitData = () => {
                        const p = $.Deferred();
                        let initFailed = false;
                        const p2 = $.Deferred();
                        p2.then(() => {
                            initFailed = true;
                        });
                        let timer_p2 = setTimeout(() => p2.resolve(), 30e3);
                        runUntilSucceed(() => {
                            try {
                                if (initFailed) {
                                    timer_p2 = undefined;
                                    window.toast('初始化用户数据超时，请关闭广告拦截插件后重试', 'error');
                                    p.reject();
                                    return true;
                                }

                                clearTimeout(timer_p2);
                                timer_p2 = undefined;
                                if (parseInt(window.$CONFIG.islogin, 10) === 0 || isNaN(parseInt(window.$CONFIG.islogin, 10))) {
                                    delete localStorage[`${NAME}_page_id`]
                                    window.toast('你还没有登录，助手无法使用！', 'error');
                                    p.reject();
                                    return true;
                                }
                                Essential.DataSync.down();
                                p.resolve();
                                return true;
                            } catch (err) {
                                if (timer_p2) clearTimeout(timer_p2);
                                window.toast('初始化用户数据时出现异常', 'error');
                                console.error(`[${NAME}]`, err);
                                p.reject();
                                return true;
                            }
                        }, 1, 500);
                        return p;
                    };

                    InitData().then(() => {
                        promiseInit.resolve();
                    }, () => {
                        promiseInit.reject()
                    })
                }, () => {
                    window.toast('有其他页面的脚本正在运行，本页面脚本停止运行,请清除缓存并刷新', 'caution');
                    promiseInit.reject();
                });
            });
            return promiseInit;
        } catch (err) {
            window.toast('初始化时出现异常', 'error');
            console.error(`[${NAME}]`, err);
            return $.Deferred().reject();
        }
    }
    const Run = () => {

        // 每天一次
        if (CONFIG.AUTO_SIGN) Interest.run();

    };

    $(document).ready(() => {
        Init().then(Run, () => {
            window.toast('初始化失败','error')
        });
    });
})()