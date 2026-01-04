// ==UserScript==
// @name         X岛-揭示板的增强型体验
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       热心群众
// @description  X岛-揭示板_显示优化,全面功能增强
// @license      MIT
// @match        *://*.nmbxd1.com/*
// @require     https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @require     https://update.greasyfork.org/scripts/433654/977772/Spectrum.js

// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/497875/X%E5%B2%9B-%E6%8F%AD%E7%A4%BA%E6%9D%BF%E7%9A%84%E5%A2%9E%E5%BC%BA%E5%9E%8B%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/497875/X%E5%B2%9B-%E6%8F%AD%E7%A4%BA%E6%9D%BF%E7%9A%84%E5%A2%9E%E5%BC%BA%E5%9E%8B%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class XDBBSScript {
        constructor() {
            //调试
            this.DEV_value = true
            // 配置
            this.setting = {
                original: [],
                normal: {},
                advanced: {}
            }
            // 模块
            this.modules = []
            // 样式
            this.style = ''
            // 数据存储
            this.store = {}
            // 引用库
            this.libs = { $ }
        }
        /**
        * 全程渲染函数
        * @method renderAlways
        */
        renderAlways() {
            for (const module of this.modules) {
                try {
                    module.renderAlwaysFunc && module.renderAlwaysFunc(this)
                } catch (error) {
                    this.printLog(`[${module.name}]模块在[renderAlwaysFunc()]中运行失败！`)
                    console.log(error)
                }
            }
        }
        /**
        * 详情页渲染函数
        * @method renderForms
        */
        renderForms() {
            $('#h-menu[hld-forms-render!=ok]').each((index, dom) => {
                const $el = $(dom)
                // 等待页面渲染完成
                if ($el.find('#h-menu-search').length == 0) return true
                for (const module of this.modules) {
                    try {
                        module.renderFormsFunc && module.renderFormsFunc($el, this)
                    } catch (error) {
                        this.printLog(`[${module.name}]模块在[renderFormsFunc()]中运行失败！`)
                        console.log(error)
                    }
                }
                $el.attr('hld-forms-render', 'ok')
            })
        }
        /**
         * 添加模块
         * @method addModule
         * @param {Object} module 模块对象
         * @param {Boolean} plugin 是否为插件
         */
        addModule(module) {
            // 组件预处理函数
            if (module.preProcFunc) {
                try {
                    module.preProcFunc(this)
                } catch (error) {
                    this.printLog(`[${module.name}]模块在[preProcFunc()]中运行失败！`)
                    console.log(error)
                }
            }
            // 添加设置
            const addSetting = setting => {
                // 标准模块配置
                if (setting.key) {
                    this.setting[setting.type || 'normal'][setting.key] = setting.default ?? ''
                    this.setting.original.push(setting)
                }
            }
            // 功能板块
            if (module.setting && !Array.isArray(module.setting)) {
                addSetting(module.setting)
            }
            if (module.settings && Array.isArray(module.settings)) {
                for (const setting of module.settings) {
                    addSetting(setting)
                }
            }
            // 添加样式
            if (module.style) {
                this.style += module.style
            }
            this.modules.push(module)
        }
        /**
             * 判断当前页面是否为详情页
             * @method isForms
             * @return {Boolean} 判断状态
             */
        isForms() {
            return $('#h-content').length > 0
        }
        /**
        * 抛出异常
        * @method throwError
        * @param {String} msg 异常信息
        */
        throwError(msg) {
            alert(msg)
            throw (msg)
        }
        /**
         * 初始化
         * @method init
         */
        init() {
            // 开始初始化
            this.printLog('初始化...')
            //localforage.config({ name: 'XD BBS Script DB' })
            const startInitTime = new Date().getTime()
            const modulesTable = []
            //同步配置
            this.loadSetting()
            // 组件初始化函数
            for (const module of this.modules) {
                if (module.initFunc) {
                    try {
                        module.initFunc(this)
                    } catch (error) {
                        this.printLog(`[${module.name}]模块在[initFunc()]中运行失败！`)
                        console.log(error)
                    }
                }
            }
            // 组件后处理函数
            for (const module of this.modules) {
                if (module.postProcFunc) {
                    try {
                        module.postProcFunc(this)
                    } catch (error) {
                        this.printLog(`[${module.name}]模块在[postProcFunc()]中运行失败！`)
                        console.log(error)
                    }
                }
            }
            // 动态样式
            for (const module of this.modules) {
                if (module.asyncStyle) {
                    try {
                        this.style += module.asyncStyle(this)
                    } catch (error) {
                        this.printLog(`[${module.name}]模块在[asyncStyle()]中运行失败！`)
                        console.log(error)
                    }
                }
                modulesTable.push({
                    name: module.title || module.name || 'UNKNOW',
                    type: module.type == 'plugin' ? '插件' : '标准模块',
                    version: module.version || '-'
                })
            }
            // 插入样式
            const style = document.createElement("style")
            style.appendChild(document.createTextNode(this.style))
            document.getElementsByTagName('head')[0].appendChild(style)
            // 初始化完成
            const endInitTime = new Date().getTime()
            console.table(modulesTable)
            this.printLog(`[v${this.getInfo().version}] 初始化完成: 共加载${this.modules.length}个模块，总耗时${endInitTime - startInitTime}ms`)
            console.log(`%c反馈问题请前往: ${this.getInfo().update}`, 'color:orangered;font-weight:bolder')
        }
        /**
         * 通知弹框
         * @method popNotification
         * @param {String} msg 消息内容
         * @param {Number} duration 显示时长(ms)
         */
        popNotification(msg, duration = 1000) {
            $('#hld__noti_container').length == 0 && $('body').append('<div id="hld__noti_container"></div>')
            let $msgBox = $(`<div class="hld__noti-msg">${msg}</div>`)
            $('#hld__noti_container').append($msgBox)
            $msgBox.slideDown(100)
            setTimeout(() => { $msgBox.fadeOut(500) }, duration)
            setTimeout(() => { $msgBox.remove() }, duration + 500)
        }
        /**
         * 消息弹框
         * @method popMsg
         * @param {String} msg 消息内容
         * @param {String} type 消息类型 [ok, err, warn]
         */
        popMsg(msg, type = 'ok') {
            $('.hld__msg').length > 0 && $('.hld__msg').remove()
            let $msg = $(`<div class="hld__msg hld__msg-${type}">${msg}</div>`)
            $('body').append($msg)
            $msg.slideDown(200)
            setTimeout(() => { $msg.fadeOut(500) }, type == 'ok' ? 2000 : 5000)
            setTimeout(() => { $msg.remove() }, type == 'ok' ? 2500 : 5500)
        }
        /**
         * 打印控制台消息
         * @method printLog
         * @param {String} msg 消息内容
         */
        printLog(msg) {
            console.log(`%cXD%cScript%c ${msg}`,
                'background: #222;color: #fff;font-weight:bold;padding:2px 2px 2px 4px;border-radius:4px 0 0 4px;',
                'background: #fe9a00;color: #000;font-weight:bold;padding:2px 4px 2px 2px;border-radius:0px 4px 4px 0px;',
                'background:none;color:#000;'
            )
        }
        /**
         * 读取值
         * @method saveSetting
         * @param {String} key
         */
        getValue(key) {
            try {
                if (!this.DEV_value) {
                    return GM_getValue(key) || window.localStorage.getItem(key)
                } else { return window.localStorage.getItem(key) }
            } catch { return window.localStorage.getItem(key) }
        }
        /**
         * 写入值
         * @method setValue
         * @param {String} key
         * @param {String} value
         */
        setValue(key, value) {
            try {
                if (!this.DEV_value) {
                    GM_setValue(key, value) || window.localStorage.setItem(key, value);
                } else { window.localStorage.setItem(key, value); }
            } catch { window.localStorage.setItem(key, value); }
        }
        /**
         * 删除值
         * @method deleteValue
         * @param {String} key
         */
        deleteValue(key) {
            try {
                if (!this.DEV_value) {
                    GM_deleteValue(key) || window.localStorage.removeItem(key);
                } else { window.localStorage.removeItem(key); }
            } catch { window.localStorage.removeItem(key); }

        }
        /**
         * 保存配置到本地
         * @method saveSetting
         * @param {String} msg 自定义消息信息
         */
        saveSetting(msg = '面板：保存配置成功，刷新页面生效') {
            // 基础设置
            for (let k in this.setting.normal) {
                $('input#hld__cb_' + k).length > 0 && (this.setting.normal[k] = $('input#hld__cb_' + k)[0].checked)
            }
            script.setValue('hld__NGA_setting', JSON.stringify(this.setting.normal))
            // 高级设置
            for (let k in this.setting.advanced) {
                if ($('#hld__adv_' + k).length > 0) {
                    const originalSetting = this.setting.original.find(s => s.type == 'advanced' && s.key == k)
                    const valueType = typeof originalSetting.default
                    const inputType = $('#hld__adv_' + k)[0].nodeName
                    if (inputType == 'SELECT') {
                        this.setting.advanced[k] = $('#hld__adv_' + k).val()
                    } else {
                        if (valueType == 'boolean') {
                            this.setting.advanced[k] = $('#hld__adv_' + k)[0].checked
                        }
                        if (valueType == 'number') {
                            this.setting.advanced[k] = +$('#hld__adv_' + k).val()
                        }
                        if (valueType == 'string') {
                            this.setting.advanced[k] = $('#hld__adv_' + k).val()
                        }
                    }
                }
            }
            script.setValue('hld__NGA_advanced_setting', JSON.stringify(this.setting.advanced))
            msg && this.popMsg(msg)
        }
        /**
         * 从本地读取配置
         * @method loadSetting
         */
        loadSetting() {
            // 基础设置
            try {
                const settingStr = script.getValue('hld__NGA_setting')
                if (settingStr) {
                    let localSetting = JSON.parse(settingStr)
                    for (let k in localSetting) {
                        !this.setting.normal.hasOwnProperty(k) && delete localSetting[k]
                    }
                    this.setting.normal = localSetting
                }
                // 高级设置
                const advancedSettingStr = script.getValue('hld__NGA_advanced_setting')
                if (advancedSettingStr) {
                    let localAdvancedSetting = JSON.parse(advancedSettingStr)
                    for (let k in this.setting.advanced) {
                        !localAdvancedSetting.hasOwnProperty(k) && (localAdvancedSetting[k] = this.setting.advanced[k])
                    }
                    for (let k in localAdvancedSetting) {
                        !this.setting.advanced.hasOwnProperty(k) && delete localAdvancedSetting[k]
                    }
                    this.setting.advanced = localAdvancedSetting
                }
            } catch (e) {
                script.throwError(`【NGA-Script】读取配置文件出现错误，无法加载配置文件!\n错误问题: ${e}\n\n请尝试使用【修复脚本】来修复此问题`)
            }

        }
        /**
         * 运行脚本
         * @method run
         */
        run() {
            this.init()
            setInterval(() => {
                this.renderAlways()
                this.renderForms()
            }, 100)
        }
        /**
         * 获取脚本信息
         * @method getInfo
         * @return {Object} 脚本信息对象
         */
        getInfo() {
            return {
                version: "1.1.0",
                author: '热心群众',
                github: 'https://github.com',
                update: 'https://greasyfork.org/zh-CN/scripts/497875-x%E5%B2%9B-%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96'
            }
        }

    }
    /* 注册菜单按钮 */
    try {
        // 设置面板
        GM_registerMenuCommand('设置面板', function () {
            $('#hld__setting_cover').css('display', 'block')
            $('html, body').animate({scrollTop: 0}, 500)
        })
        // 清理缓存
        GM_registerMenuCommand('清理缓存', function () {
            if (window.confirm('此操作为清理Local Storage缓存内容，不会清理配置\n\n继续请点击【确定】')) {
                localforage.clear()
                alert('操作成功，请刷新页面重试')
            }
        })
        // 修复脚本
        GM_registerMenuCommand('修复脚本', function () {
            if (window.confirm('如脚本运行失败或无效，尝试修复脚本，这会清除脚本的所有数据\n* 数据包含配置，各种名单等\n* 此操作不可逆转，请谨慎操作\n\n继续请点击【确定】')) {
                try {
                    window.localStorage.clear() || GM_listValues().forEach(key => GM_deleteValue(key))
                } catch {window.localStorage.clear()}
                
                alert('操作成功，请刷新页面重试')
            }
        })
        // 反馈问题
        GM_registerMenuCommand('反馈问题', function () {
            if (window.confirm('如脚本运行失败而且修复后也无法运行，请反馈问题报告\n* 问题报告请包含使用的: [浏览器]，[脚本管理器]，[脚本版本]\n* 描述问题最好以图文并茂的形式\n* 如脚本运行失败，建议提供F12控制台的红色错误输出以辅助排查\n\n默认打开的为Greasy Fork的反馈页面，有能力最好去Github Issue反馈问题，可以获得优先处理\n\n即将打开反馈页面，继续请点击【确定】')) {
                window.open('https://greasyfork.org/zh-CN/scripts/497875-x%E5%B2%9B-%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96/feedback')
            }
        })
    } catch (e) {
        // 不支持此命令
        console.warn(`【NGA Script】警告: 此脚本管理器不支持菜单按钮，可能会导致新特性无法正常使用，建议更改脚本管理器为
        Tampermonkey[https://www.tampermonkey.net/] 或 Violentmonkey[https://violentmonkey.github.io/]`)
    }

    /* 标准模块 */
    /**
     * 设置模块
     * @name SettingPanel
     * @description 提供脚本的设置面板，提供配置修改，保存等基础功能
     */
    const SettingPanel = {
        name: 'SettingPanel',
        title: '设置模块',
        initFunc() {
            //设置面板
            let $panelDom = $(`
                <div id="hld__setting_cover" class="animated zoomIn">
                    <div id="hld__setting_panel">
                        <a href="javascript:void(0)" id="hld__setting_close" class="hld__setting-close" close-type="hide">×</a>
                        <p class="hld__sp-title">
                            <a title="更新地址" href="#" target="_blank">X岛 优化体验
                            <span class="hld__script-info">v${script.getInfo().version}</span>
                            </a>
                        </p>
                        <div class="hld__field">
                            <p class="hld__sp-section">显示优化</p>
                            <div id="hld__normal_left"></div>
                        </div>
                        <div class="hld__field">
                            <p class="hld__sp-section">功能增强</p>
                            <div id="hld__normal_right"></div>
                        </div>
                        <div style="clear:both"></div>
                        <div class="hld__advanced-setting">
                            <button id="hld__advanced_button">+</button><span>高级设置</span>
                            <div class="hld__advanced-setting-panel">
                                <p>⚠️ 鼠标停留在
                                    <span class="hld__help" title="详细描述">选项文字</span>
                                    上可以显示详细描述，设置有误可能会导致插件异常或者无效！
                                </p>
                                <table id="hld__advanced_left"></table>
                                <table id="hld__advanced_right"></table>
                            </div>
                        </div>
                        <div class="hld__buttons">
                            <span id="hld_setting_panel_buttons"></span>
                            <span>
                                <button class="hld__btn" id="hld__save__data">保存设置</button>
                            </span>
                        </div>
                    </div>
                </div>
                `)
            const insertDom = setting => {
                if (setting.type === 'normal') {
                    $panelDom.find(`#hld__normal_${setting.menu || 'left'}`).append(`
                        <p><label ${setting.desc ? 'class="hld__help" help="' + setting.desc + '"' : ''}>
                        <input type="checkbox" id="hld__cb_${setting.key}">
                         ${setting.title || setting.key}${setting.shortCutCode ? '（快捷键切换[<b>' + script.getModule('ShortCutKeys').getCodeName(setting.rewriteShortCutCode || setting.shortCutCode) + '</b>]）' : ''}
                         </label></p>
                        `)
                    if (setting.extra) {
                        $panelDom.find(`#hld__cb_${setting.key}`).attr('enable', `hld__${setting.key}_${setting.extra.mode || 'fold'}`)
                        $panelDom.find(`#hld__normal_${setting.menu || 'left'}`).append(`
                            <div class="hld__sp-${setting.extra.mode || 'fold'}" id="hld__${setting.key}_${setting.extra.mode || 'fold'}" data-id="hld__${setting.key}">
                                <p><button id="${setting.extra.id}">${setting.extra.label}</button></p>
                            </div>
                            `)
                    }
                }
                if (setting.type === 'advanced') {
                    let formItem = ''
                    const valueType = typeof setting.default
                    if (valueType === 'boolean') {
                        formItem = `<input type="checkbox" id="hld__adv_${setting.key}">`
                    }
                    if (valueType === 'number') {
                        formItem = `<input type="number" id="hld__adv_${setting.key}">`
                    }
                    if (valueType === 'string') {
                        if (setting.options) {
                            let t = ''
                            for (const option of setting.options) {
                                t += `<option value="${option.value}">${option.label}</option>`
                            }
                            formItem = `<select id="hld__adv_${setting.key}">${t}</select>`
                        } else {
                            formItem = `<input type="text" id="hld__adv_${setting.key}">`
                        }
                    }
                    $panelDom.find(`#hld__advanced_${setting.menu || 'left'}`).append(`
                        <tr>
                            <td><span class="hld__help" help="${setting.desc || ''}">${setting.title || setting.key}</span></td>
                            <td>${formItem}</td>
                        </tr>`)
                }
            }
            for (const module of script.modules) {
                if (module.setting && module.setting.key) {
                    insertDom(module.setting)
                }
                if (module.settings) {
                    for (const setting of module.settings) {
                        setting.key && insertDom(setting)
                    }
                }
            }
            /**
             * Bind:Mouseover Mouseout
             * 提示信息Tips
             */
            $('body').on('mouseover', '.hld__help', function (e) {
                if (!$(this).attr('help')) return
                const $help = $(`<div class="hld__help-tips">${$(this).attr('help').replace(/\n/g, '<br>')}</div>`)
                $help.css({
                    top: ($(this).offset().top + $(this).height() + 5) + 'px',
                    left: $(this).offset().left + 'px'
                })
                $('body').append($help)
            }).on('mouseout', '.hld__help', () => $('.hld__help-tips').remove())
            $('body').append($panelDom)
            //本地恢复设置
            //基础设置
            for (let k in script.setting.normal) {
                if ($('#hld__cb_' + k).length > 0) {
                    $('#hld__cb_' + k)[0].checked = script.setting.normal[k]
                    const enableDomID = $('#hld__cb_' + k).attr('enable')
                    if (enableDomID) {
                        script.setting.normal[k] ? $('#' + enableDomID).show() : $('#' + enableDomID).hide()
                        $('#' + enableDomID).find('input').each(function () {
                            $(this).val() == script.setting.normal[$(this).attr('name').substring(8)] && ($(this)[0].checked = true)
                        })
                        $('#hld__cb_' + k).on('click', function () {
                            $(this)[0].checked ? $('#' + enableDomID).slideDown() : $('#' + enableDomID).slideUp()
                        })
                    }
                }
            }
            //高级设置
            for (let k in script.setting.advanced) {
                if ($('#hld__adv_' + k).length > 0) {
                    const valueType = typeof script.setting.advanced[k]
                    if (valueType == 'boolean') {
                        $('#hld__adv_' + k)[0].checked = script.setting.advanced[k]
                    }
                    if (valueType == 'number' || valueType == 'string') {
                        $('#hld__adv_' + k).val(script.setting.advanced[k])
                    }
                }
            }
            /**
             * Bind:Click
             * 设置面板-展开切换高级设置
             */
            $('body').on('click', '#hld__advanced_button', function () {
                if ($('.hld__advanced-setting-panel').is(':hidden')) {
                    $('.hld__advanced-setting-panel').css('display', 'flex')
                    $(this).text('-')
                } else {
                    $('.hld__advanced-setting-panel').css('display', 'none')
                    $(this).text('+')
                }
            })
            /**
             * Bind:Click
             * 关闭面板（通用）
             */
            $('body').on('click', '.hld__list-panel .hld__setting-close', function () {
                if ($(this).attr('close-type') == 'hide') {
                    $(this).parent().hide()
                } else {
                    $(this).parent().remove()
                }
            })
            /**
             * Bind:Click
             * 保存配置
             */
            $('body').on('click', '#hld__save__data', () => {
                script.saveSetting()
                $('#hld__setting_cover').fadeOut(200)
            })
        },
        renderAlwaysFunc() {
            if ($('.hld__setting-box').length == 0) {
                $('#startmenu > tbody > tr > td.last').append('<div><div class="item hld__setting-box"></div></div>')
                let $entry = $('<a id="hld__setting" title="打开NGA优化摸鱼插件设置面板">NGA优化摸鱼插件设置</a>')
                $entry.click(() => {
                    $('#hld__setting_cover').css('display', 'block')
                    $('html, body').animate({ scrollTop: 0 }, 500)
                })
                $('#hld__setting_close').click(() => $('#hld__setting_cover').fadeOut(200))
                $('.hld__setting-box').append($entry)
            }
        },
        addButton(button) {
            const $button = $(`<button class="hld__btn" id="${button.id}" title="${button.desc}">${button.title}</button>`)
            if (typeof button.click == 'function') {
                $button.on('click', function () {
                    button.click($(this))
                })
            }
            $('#hld_setting_panel_buttons').append($button)
        },
        style: `
            .animated {animation-duration:.3s;animation-fill-mode:both;}
            .animated-1s {animation-duration:1s;animation-fill-mode:both;}
            .zoomIn {animation-name:zoomIn;}
            .bounce {-webkit-animation-name:bounce;animation-name:bounce;-webkit-transform-origin:center bottom;transform-origin:center bottom;}
            .fadeInUp {-webkit-animation-name:fadeInUp;animation-name:fadeInUp;}
            #loader {display:none;position:absolute;top:50%;left:50%;margin-top:-10px;margin-left:-10px;width:20px;height:20px;border:6px dotted #FFF;border-radius:50%;-webkit-animation:1s loader linear infinite;animation:1s loader linear infinite;}
            @keyframes loader {0% {-webkit-transform:rotate(0deg);transform:rotate(0deg);}100% {-webkit-transform:rotate(360deg);transform:rotate(360deg);}}
            @keyframes zoomIn {from {opacity:0;-webkit-transform:scale3d(0.3,0.3,0.3);transform:scale3d(0.3,0.3,0.3);}50% {opacity:1;}}
            @keyframes bounce {from,20%,53%,80%,to {-webkit-animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}40%,43% {-webkit-animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0);}70% {-webkit-animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0);}90% {-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0);}}
            @keyframes fadeInUp {from {opacity:0;-webkit-transform:translate3d(-50%,100%,0);transform:translate3d(-50%,100%,0);}to {opacity:1;-webkit-transform:translate3d(-50%,0,0);transform:translate3d(-50%,0,0);}}
            .hld__msg{display:none;position:fixed;top:10px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;z-index:99996;padding:10px 30px 10px 45px;font-size:16px;border-radius:10px;background-image:url("");background-size:25px;background-repeat:no-repeat;background-position:15px}
            .hld__msg a{color:#fff;text-decoration: underline;}
            .hld__msg-ok{background:#4bcc4b}
            .hld__msg-err{background:#c33}
            .hld__msg-warn{background:#FF9900}
            .hld__flex{display:flex;}
            .hld__float-left{float: left;}
            .clearfix {clear: both;}
            #hld__noti_container {position:fixed;top:10px;left:10px;z-index:99;}
            .hld__noti-msg {display:none;padding:10px 20px;font-size:14px;font-weight:bold;color:#fff;margin-bottom:10px;background:rgba(0,0,0,0.6);border-radius:10px;cursor:pointer;}
            .hld__btn-groups {display:flex;justify-content:center !important;margin-top:10px;}
            button.hld__btn {padding:3px 8px;border:1px solid #591804;background:#fff8e7;color:#591804;}
            button.hld__btn:hover {background:#591804;color:#fff0cd;}
            button.hld__btn[disabled] {opacity:.5;}
            #hld__updated {position:fixed;top:20px;right:20px;width:230px;padding:10px;border-radius:5px;box-shadow:0 0 15px #666;border:1px solid #591804;background:#fff8e7;z-index: 9999;}
            #hld__updated .hld__readme {text-decoration:underline;color:#591804;}
            .hld__script-info {margin-left:4px;font-size:70%;color:#666;}
            #hld__setting {color:#6666CC;cursor:pointer;}

            #hld__setting_cover {display:none;padding-top: 70px;position:absolute;top:0;left:0;right:0;bottom:0;z-index:999;}
            #hld__setting_panel {position:relative;background:#fff8e7;width:600px;left: 50%;transform: translateX(-50%);padding:15px 20px;border-radius:10px;box-shadow:0 0 10px #666;border:1px solid #591804;}
            #hld__setting_panel > div.hld__field {float:left;width:50%;}
            #hld__setting_panel p {margin-bottom:10px;}
            #hld__setting_panel .hld__sp-title {font-size:15px;font-weight:bold;text-align:center;}
            #hld__setting_panel .hld__sp-section {font-weight:bold;margin-top:20px;}
            .hld__setting-close {position:absolute;top:5px;right:5px;padding:3px 6px;background:#fff0cd;color:#591804;transition:all .2s ease;cursor:pointer;border-radius:4px;text-decoration:none;z-index:9999;}
            .hld__setting-close:hover {background:#591804;color:#fff0cd;text-decoration:none;}
            #hld__setting_panel button {transition:all .2s ease;cursor:pointer;border-radius: 4px;}
            .hld__advanced-setting {border-top: 1px solid #e0c19e;border-bottom: 1px solid #e0c19e;padding: 3px 0;margin-top:25px;}
            .hld__advanced-setting >span {font-weight:bold}
            .hld__advanced-setting >button {padding: 0px;margin-right:5px;width: 18px;text-align: center;}
            .hld__advanced-setting-panel {display:none;padding:5px 0;flex-wrap: wrap;}
            .hld__advanced-setting-panel>p {width:100%;}
            .hld__advanced-setting-panel>table {width:50%;}
            .hld__advanced-setting-panel>p {margin: 7px 0 !important;font-weight:bold;}
            .hld__advanced-setting-panel>p svg {height:16px;width:16px;vertical-align: top;margin-right:3px;}
            .hld__advanced-setting-panel>table td {padding-right:10px}
            .hld__advanced-setting-panel input[type=text],.hld__advanced-setting-panel input[type=number] {width:80px}
            .hld__advanced-setting-panel input[type=number] {border: 1px solid #e6c3a8;box-shadow: 0 0 2px 0 #7c766d inset;border-radius: 0.25em;}
            .hld__help {cursor:help;text-decoration: underline;}
            .hld__buttons {clear:both;display:flex;justify-content:space-between;padding-top:15px;}
            button.hld__btn {padding:3px 8px;border:1px solid #591804;background:#fff8e7;color:#591804;}
            button.hld__btn:hover {background:#591804;color:#fff0cd;}
            .hld__sp-fold {padding-left:23px;}
            .hld__sp-fold .hld__f-title {font-weight:bold;}
            .hld__help-tips {position: absolute;padding: 5px 10px;background: rgba(0,0,0,.8);color: #FFF;border-radius: 5px;z-index: 9999;}
            `
    }
    /**
    * 隐藏图片模块
    * @name HideImage
    * @description 此模块提供了可以快捷键切换显示隐藏图片
    *              其中隐藏的图片会用一个按钮来替代
    */
    const HideImage = {
        name: 'HideImage',
        title: '隐藏图片',
        setting: {
            //shortCutCode: 69, // E
            type: 'normal',
            key: 'hideImage',
            default: false,
            title: '隐藏贴内图片',
            menu: 'left'
        },
        renderFormsFunc($el) {
            if (script.setting.normal.hideImage) {
                $el = $("#h-content")
                $el.find('.h-threads-img-box').each(function () {
                    const classs = $(this).attr('class')

                    if ((classs) && !$(this).is(':hidden')) {
                        $(this).addClass('hld__img-postimg')
                        let $imgB = $('<button class="switch-img" style="display:none">图</button>')
                        $imgB.on('click', function () {
                            $(this).parent().prev().toggle();
                            $(this).text($(this).parent().prev().is(':hidden') ? '图' : '隐藏')
                        })
                        if (script.setting.normal.hideImage) {
                            $(this).hide();
                            $imgB.show()
                        }
                        $(this).next().children().first().before($imgB)
                    }
                })
            }

        },
        asyncStyle() {
            if (script.setting.normal.hideImage) {
                return `
                .switch-img{background: #eee;border-radius: 0.25em;padding: 0 0.5em;margin-right: 10px;border: none;}
                .switch-img:hover{background: #dfdfdf;}
                `
            }
        }
    }
    /**
    * 高清图片模块
    * @name HDImage
    * @description 此模块替换了原有的图片链接为高清链接
    *
    */
    const HDImage = {
        name: 'HDImage',
        title: '高清图片',
        setting: {
            //shortCutCode: 69, // E
            type: 'normal',
            key: 'HDImage',
            default: false,
            title: '启用高清图片链接',
            menu: 'left'
        },
        renderFormsFunc($el) {
            //console.log('高清图片模块加载', script.setting.normal.HDImage)
            if (script.setting.normal.HDImage) {
                $('img[src^="https://image.nmb.best/thumb"]').attr('src', function (index, oldSrc) {
                    return oldSrc.replace('/thumb', '/image');
                });
            }
        },
        asyncStyle() {
            if (script.setting.normal.HDImage) {
                console.log('高清图片模块加载', script.setting.normal.HDImage)
                return `
                /*图片鼠标经过放大 -- 配合页面美化使用*/
                ._xd_beautyCss .h-threads-img-box:hover::after {background: rgba(0, 0, 0, 0.5);}
                ._xd_beautyCss .h-threads-img:hover {position: relative;transform: translateX(160px) translateY(0px) scale(2.5) translateZ(0px);z-index: 9999;border-radius: 0px;margin: 0 20px 10px 0;}
                ._xd_beautyCss .h-threads-img:hover div.h-threads-item-index{overflow: inherit;}
                ._xd_beautyCss .h-threads-img{max-width: 250px !important;}
                `
            }
        }
    }
    /**
    * 页面美化模块
    * @name PageCss
    * @description 此模块对全站进行了页面Css美化
    */
    const PageCss = {
        name: 'PageCss',
        title: '页面美化',
        setting: {
            type: 'normal',
            key: 'PageCss',
            default: true,
            title: '启用页面美化',
            menu: 'left'
        },
        renderFormsFunc() {
            //console.log('页面美化模块加载', script.setting.normal.PageCss)
            script.setting.normal.PageCss && $('body').addClass('_xd_beautyCss')
            // 新的<logo>内容
            var newContent = `
                    <div id="h-menu-top" style="display: flex;justify-content: center;padding: 5px;">
                        <div class="h-menu-logo" style="width: 60px;margin-right: 10px;">
                            <img src="https://file.moetu.org/images/2023/08/29/e1db89f8b15b0002b1ebdf574d5a7f30c6f2590891da1a8422eba303bf8b589c.gif" alt="" border="0" width="100%">
                        </div>
                        <div class="h-menu-slogan">
                            <a href="/" id="h-menu-top-sitename" style="display: block;font-size: 20px;font-weight: bold;margin:6px 6px 6px 0;text-align:left;">X岛揭示板 </a>
                            <a href="/" id="h-menu-top-img" style="display: block;font-size: 14px;color: #ccc;">写作绅士，读作丧尸</a>
                        </div>
                    </div>
                `;
            // 替换logo
            $('#h-menu-top').empty();
            $('#h-menu-top').append(newContent);
            // 添加头像
            $(".h-threads-item-reply").each(function () {
                if ($(this).find(".h-threads-img-box").length === 0) {
                    var uid = $(this).find(".h-threads-info-uid").text();
                    var mainUid = $(this).parent().siblings(".h-threads-item-main").find(".h-threads-info-uid").text();

                    var firstThreeChars = uid.substring(3, 6);

                    if (mainUid == uid) {
                        $(this).append(`<div class="h-threads-info-idafter Po-text">${firstThreeChars}</div>`)
                    } else {
                        $(this).append(`<div class="h-threads-info-idafter">${firstThreeChars}</div>`)
                    }
                } else {
                    $(this).find(".h-threads-item-reply-main").css("padding", "0")
                }
            });
            //移除表单的类
            $(".h-post-form-input").removeClass("uk-width-1-5")

            // 初始化隐藏表单
            $("#h-post-form").find("form").hide();
            $("#h-post-form").prepend(`<div class="__jion-form"><div>点击参与讨论</div></div>`);
            $(".__jion-form").on('click', function () {
                var hTitleText = $('h2.h-title').text();
                if (hTitleText.indexOf('[只看PO]') !== -1) {
                    var msg = "目前是[只看PO],请返回主串参与讨论"
                    msg && script.popMsg(msg)
                    // 定义动画
                    var blinkAnimation = '@keyframes blink { 0% { color: black; } 50% { color: red; } 100% { color: black; } }';
                    var blinkClass = '.blink { animation: blink 0.5s step-start infinite; }';

                    // 将动画样式添加到页面的样式表中
                    var styleSheet = document.createElement("style");
                    styleSheet.type = "text/css";
                    styleSheet.innerText = blinkAnimation + ' ' + blinkClass;
                    document.head.appendChild(styleSheet);

                    // 找到文本为“返回主串”的标签并添加闪烁类
                    var $target = $('span.h-threads-info-report-btn a').filter(function () {
                        return $(this).text() === '返回主串';
                    });

                    if ($target.length) {
                        $target.addClass('blink');

                        // 3秒后移除闪烁效果
                        setTimeout(function () {
                            $target.removeClass('blink');
                        }, 3000);
                    }
                } else {
                    var form = $("#h-post-form").find("form");
                    if (form.is(":hidden")) {
                        $(this).text("点击隐藏表单")
                        form.slideDown(200);
                    } else {
                        $(this).text("点击参与讨论")
                        form.slideUp(200);
                    }
                }

            });

            //底部导航
            $(window).scroll(function () {
                if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                    $('#h-bottom-nav').css('display', 'flex');
                } else {
                    $('#h-bottom-nav').css('display', 'none');
                }
            });
        },
        asyncStyle() {
            return `
    /*全局样式*/
    ._xd_beautyCss hr{display:none;}
    ._xd_beautyCss font[color='#789922']{cursor: pointer;}
    /*导航目录*/
    ._xd_beautyCss #h-menu {height: 100% !important;width: 240px;overflow: auto;border-right: 1px solid #e6e6e6;}
    ._xd_beautyCss #h-menu a{text-decoration: none;}
    ._xd_beautyCss #h-menu::-webkit-scrollbar-thumb {background-color: #d6f4ff;outline-offset: -2px;outline: 2px solid #fff;-webkit-border-radius: 4px;border: 2px solid #fff;}
    ._xd_beautyCss #h-menu::-webkit-scrollbar-thumb:hover {background-color: #00bbff;-webkit-border-radius: 4px;}
    ._xd_beautyCss #h-menu::-webkit-scrollbar {width: 8px;height: 8px;}
    ._xd_beautyCss #h-menu::-webkit-scrollbar-track-piece {background-color: #fff;-webkit-border-radius: 0;}
    ._xd_beautyCss #h-menu::-webkit-scrollbar-thumb:active{height:50px;background-color:#000;-webkit-border-radius:4px;}
    ._xd_beautyCss #h-menu #h-menu-content .uk-parent .uk-nav-sub{padding:0}
    ._xd_beautyCss #h-menu #h-menu-content .uk-parent .uk-nav-sub li {padding: 0 30px;border-radius: 5px;margin: 1px 10px;}
    ._xd_beautyCss #h-menu #h-menu-content .h-active {background: #ecf5ff;}
    ._xd_beautyCss #h-menu #h-menu-content .h-active a{color: #07D;}
    ._xd_beautyCss #h-menu .uk-nav-parent-icon>.uk-parent.uk-open>a:before {content: "\\f009";font-family: FontAwesome;margin-right: 5px;}
    ._xd_beautyCss #h-menu .uk-nav-parent-icon>.uk-parent>a:before {content: "\\f009";font-family: FontAwesome;margin-right: 5px;}
    ._xd_beautyCss #h-menu .uk-nav-sub>li:hover {background: rgba(0, 0, 0, .03);color: #444;outline: 0;box-shadow: inset 0 0 1px rgba(0, 0, 0, .06);text-shadow: 0 -1px 0 #fff;}
    /*主页*/
    ._xd_beautyCss #h-content {margin: auto auto 30px 240px;display: flex;flex-direction: column;align-items: center;background-color: #f1f2f5;padding-bottom: 20px;}
    ._xd_beautyCss #h-content-top-nav{padding: 15px;background: #fff;margin: 10px 0 0 0 !important;border-radius: 10px 10px 0 0 ;}
    ._xd_beautyCss #h-content-top-nav .uk-breadcrumb{margin:0 !important;}
    ._xd_beautyCss #h-content h2.h-title{padding: 15px;background: #fff;margin: 0 0 10px 0 !important;border-radius: 0 0 10px 10px;}
    /*串样式*/
    ._xd_beautyCss .h-threads-item {background-color: #FFF;border-radius: 10px;padding: 15px;margin-bottom: 10px;}
    /*串样式 -- PO串*/
    ._xd_beautyCss .h-threads-item .h-threads-item-main .h-threads-content {line-height: 1.6;color: #555;margin: 15px 0px;}
    ._xd_beautyCss .h-threads-item .h-threads-item-main .h-threads-tips {color: #dbdbdb;}
    ._xd_beautyCss .h-threads-item .h-threads-item-main .h-threads-info {margin-bottom: 10px;}
    ._xd_beautyCss .h-threads-item .h-threads-item-main .h-threads-info-title {font-size: 1.5em;font-weight: bold;color: #333;}
    /*串样式 -- 回应串*/
    ._xd_beautyCss .h-threads-item .h-threads-item-reply {border-radius: 5px;padding: 10px;margin-top: 10px;width: 100%;margin: 10px auto;padding: 10px 0;position: relative;border-top: 1px solid #cccccc50;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-icon{display:none;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main {background-color: #fff0;padding: 0px 0 0 40px;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info  {font-size: 14px;line-height: 22px;margin: 5px 40px;color:#22222250;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info-title {font-size: 14px;color:#22222250;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info-email {display: none;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info-createdat {color:#22222250;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info-uid {color:#22222250;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info-id {color:#22222250;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-content {margin: 10px 40px;}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-content font{float: right;color: #22222220;font-size: 14px}
    ._xd_beautyCss .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-content br:first-of-type{display:none;}
    /*串样式 -- 回应串详情去除阴影*/
    ._xd_beautyCss div.h-threads-item-reply.h-threads-item-reply-selected > div.h-threads-item-reply-main,
    ._xd_beautyCss div.h-threads-item.uk-clearfix.h-threads-item-selected > div.h-threads-item-main {box-shadow:none}
    /*串样式 -- 举报订阅按钮*/
    ._xd_beautyCss .h-threads-item .h-threads-info-report-btn {float: right;color:#22222220;}
    ._xd_beautyCss .h-threads-item .h-threads-info-report-btn a{color:#22222220;}
    /*串样式 -- 回应按钮*/
    ._xd_beautyCss .h-threads-item .h-threads-info-reply-btn {font-size: 14px !important;color: #cc1105;border: 1px solid #ccc;padding: 2px 10px;margin: 0 15px;border-radius: 5px;background: #cc1105;}
    ._xd_beautyCss .h-threads-item .h-threads-info-reply-btn:hover {color: red;background: red;}
    ._xd_beautyCss .h-threads-item .h-threads-info-reply-btn a {color: #fff;text-decoration: none;}
    /*主页引用串*/
    ._xd_beautyCss #h-ref-view {right: 5px;box-shadow: -1px -1px 1px 0px #f5f5f5;border-radius: 10px;border: 1px solid #e5e5e5;background: #fff;}
    ._xd_beautyCss #h-ref-view .h-threads-item-ref{border-radius: 5px;border: 1px solid #fff;background: #fff;padding:0;margin:0;}

    /*图片*/
    ._xd_beautyCss .h-threads-img {display: inline-block;margin: 0 20px 0 0 !important; max-height: 800px !important;border-radius: 5px;transition: transform 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease;}
    ._xd_beautyCss .h-threads-img-box {position: relative;}
    ._xd_beautyCss .h-threads-img-box::after {content: '';position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background: rgba(0, 0, 0, 0);transition: background 0.3s ease;z-index: 1;pointer-events: none;}
    ._xd_beautyCss .h-threads-item .h-threads-img-box.h-active .h-threads-img-a .h-threads-img {max-height: 800px;}

    /*头像自定义样式*/
    ._xd_beautyCss .h-threads-info-idafter {text-align: center;line-height: 50px;font-size: 15px;font-weight: bolder;color: #fff;position: absolute;left: 15px;top: 15px;display: block;width: 50px;height: 50px;background: #c0c4cc;border-radius: 10px;}
    ._xd_beautyCss .h-threads-info-idafter::before {content: "  ";position: absolute;top: 0;left: 0;width: 100%;height: 100%;
        background-image: url(https://file.moetu.org/images/2023/08/29/e1db89f8b15b0002b1ebdf574d5a7f30c6f2590891da1a8422eba303bf8b589c.gif);
        background-size: cover;background-repeat: no-repeat;background-position: center;opacity: 0.1;}

    /* 表单样式 */
    ._xd_beautyCss #h-post-form {display: block;width: 100%;}
    ._xd_beautyCss #h-post-form .h-forum-header{margin-bottom: 10px;padding: 5px;}
    ._xd_beautyCss #h-post-form .h-post-form-title {background-color: #fff0;font-weight: bold;margin-bottom: 5px;line-height: 35px;padding: 0;text-align: center;width: 100%;}
    ._xd_beautyCss #h-post-form .h-post-form-input {margin-bottom: 10px;}
    ._xd_beautyCss #h-post-form form {margin: 0 auto;padding: 20px 20px 0 20px;background-color: #FFF;border-radius: 10px;}
    ._xd_beautyCss #h-post-form form input[type="text"] {width: 100%;padding: 8px;font-size: 14px;border-radius: 4px;border: none;box-sizing: border-box;border: 1px solid #e9e9e9;}
    ._xd_beautyCss #h-post-form form input[type="file"] {width: 100%;padding: 8px;font-size: 14px;border-radius: 4px;border: none;box-sizing: border-box;cursor: pointer;}
    ._xd_beautyCss #h-post-form form input[type="submit"] {padding: 6px 20px;font-size: 16px;background-color: #4CAF50;color: white;border: none;border-radius: 4px;cursor: pointer;width: 100%;}
    ._xd_beautyCss #h-post-form form input[type="submit"]:hover {background-color: #45a049;}
    ._xd_beautyCss #h-post-form form textarea {width: 100%;padding:10px !important;;font-size: 14px;border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;}
    ._xd_beautyCss #h-post-form form label.h-water-tool {display: block;margin-top: 8px;font-size: 14px;}
    ._xd_beautyCss #h-post-form form select{border: 1px solid #ccc;border-radius: 4px;box-sizing: border-box;padding: 8px;}
    ._xd_beautyCss #h-post-form form select:focus{ outline: none;border: 1px solid #969696;}
    ._xd_beautyCss #h-post-form .uk-grid {display: flex;flex-wrap: wrap;}
    ._xd_beautyCss #h-post-form .uk-width-1-5,
    ._xd_beautyCss #h-post-form .uk-width-3-5,
    ._xd_beautyCss #h-post-form .uk-width-1-6 {box-sizing: border-box;padding: 0 10px 0 0;margin: 0 10px 10px 0;border-radius: 5px;}
    ._xd_beautyCss #h-post-form .h-post-form-option.uk-width-1-5:has(input[type="checkbox"]){display: none;}
    ._xd_beautyCss #h-post-form .uk-width-1-5 {width: 100px !important;border: 1px solid #e9e9e9;padding: 0!important;height: 35px;display: flex;align-content: flex-start;flex-wrap: wrap;background: #fff;}
    ._xd_beautyCss #h-post-form .uk-width-1-6 {width: 19% !important;}
    ._xd_beautyCss #h-post-form .h-post-form-title,
    ._xd_beautyCss #h-post-form .h-post-form-input,
    ._xd_beautyCss #h-post-form .h-post-form-option {padding: 0;line-height: 35px;}
    ._xd_beautyCss #h-post-form .__jion-form {width: 100%;height: 35px;display: flex;align-items: center;background-color: #fff;padding: 0 10px;border-radius: 5px;box-sizing: border-box;margin-bottom: 10px;cursor: pointer;user-select: none;}
    ._xd_beautyCss #h-post-form .__jion-form:hover {color: #FFF;background: linear-gradient(45deg,#84F0EE 0%,#84F0EE 30%,#5AD4C2 30%,#5AD4C2 60%,#7b8df3 60%,#7b8df3 100%,#84F0EE 100%,#84F0EE 100%);background-size: 400%;background-position: 0% 100%;animation: rainbow 1.5s linear infinite;}
    @keyframes rainbow {0% {background-position: 0% 200%;}100% {background-position: 200% 0%;}}

    /*底部 -- 配合隐藏底部使用*/
    ._xd_beautyCss #h-bottom-nav {display: flex;justify-content: center;color: #cfcfcf;height: 30px;line-height: 30px;background: #fff;display: none;box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);transition: opacity 0.3s ease, visibility 0.3s ease;border: none;font-size: 12px}
    ._xd_beautyCss #h-bottom-nav a {margin: 0 5px;color: #cfcfcf;font-size: 12px}
            `
        }

    }
    /**
    * 自动翻页模块
    * @name AutoPage
    * @description 此模块提供了脚本自动翻页的功能
    *
    */
    const AutoPage = {
        name: 'AutoPage',
        title: '自动翻页',
        settings: [{
            type: 'normal',
            key: 'autoPage',
            default: true,
            title: '自动翻页',
            menu: 'right'
        }],
        $window: $(window),
        renderAlwaysFunc() {
            const _this = this
            if (script.setting.normal.autoPage) {
                if ($('#hld__next_page').length > 0) return
                $('ul.uk-pagination[hld-auto-page!=ok] li').each(function () {
                    //console.log("自动翻页已加载")
                    var $a = $(this).children('a');
                    if ($a.text().trim() == '下一页') {
                        $a.attr('id', 'hld__next_page');
                        $(window).on('scroll.autoPage', function () {
                            if ($(document).scrollTop() != 0 && (Math.ceil($(document).scrollTop()) + $(window).height() >= ($(document).height() - 20))) {
                                if ($('#hld__next_page').length > 0) {
                                    script.popMsg("正在翻页...")
                                    document.getElementById('hld__next_page').click();
                                    $('#hld__next_page').removeAttr('id');
                                    $(window).off('scroll.autoPage');
                                }
                            }
                        });
                    }
                });

                $('ul.uk-pagination').attr('hld-auto-page', 'ok');
            }
        }
    }
    /**
    * 串串页新页面打开模块
    * @name LinkBlank
    * @description 此模块可以选择在新页面打开链接
    *
    */
    const LinkBlank = {
        name: 'LinkBlank',
        title: '串串页新页面打开',
        setting: {
            //shortCutCode: 69, // E
            type: 'normal',
            key: 'LinkBlank',
            default: true,
            title: '串串页新页面打开',
            menu: 'right'
        },
        renderFormsFunc($el) {
            //console.log('启用串串页新页面打开', script.setting.normal.LinkBlank)
            if (script.setting.normal.LinkBlank) {
                $("#h-content .h-threads-list a").attr("target", "_blank");
            }
        }
    }
    /**
    * 回应串折叠模块
    * @name FoldChuan
    * @description 此模块支持折叠回应串
    *              当回应串超过3个时,折叠掉其余串
    *              仅主页生效
    *
    */
    const FoldChuan = {
        name: 'FoldChuan',
        title: '回应串折叠',
        setting: {
            type: 'normal',
            key: 'FoldChuan',
            default: true,
            title: '回应串折叠',
            menu: 'left'
        },
        renderFormsFunc($el) {
            console.log('启用回应串折叠', script.setting.normal.FoldChuan)
            if (script.setting.normal.FoldChuan) {
                if (!$("#h-content .uk-container .h-title").text().startsWith("No.")) {
                    console.log('回应串折叠执行', script.setting.normal.FoldChuan)
                    $('.h-threads-item .h-threads-item-replies').each(function () {
                        $(this).parent().addClass("removeScorll")
                        var replies = $(this).find('.h-threads-item-reply');
                        if (replies.length > 3) {
                            replies.slice(3).hide();
                            replies.eq(2).after('<button class="show-more-replies">显示更多回复</button>');
                            $('.show-more-replies', this).click(function () {
                                replies.slice(3).toggle();
                                $(this).text($(this).next().is(':hidden') ? '显示更多回复' : '隐藏回复')
                            });
                        }
                    });
                    var maxHeight = $(window).height() * 0.5;
                    var maxHeightV = "300px";
                    $('.h-threads-content').each(function () {
                        var $content = $(this);
                        if ($content.outerHeight() > maxHeight) {
                            $content.css({
                                'max-height': maxHeightV,
                                'overflow': 'hidden',
                                'white-space': 'normal',
                                'text-overflow': 'ellipsis'
                            });
                            $content.after(`
                            <div style="position: relative;"><div style="width: 100%;height: 20px;background: linear-gradient(to bottom, #fff0, #fff);position: absolute;top: -30px;"></div>
                            <button class="maxtoggle-button">展开</button></div>`);
                            var $button = $content.next().find('.maxtoggle-button');
                            if ($button.parent().parent().attr('class') == "h-threads-item-main") {
                                $content.css("padding-left", "35px")
                            }
                            $button.click(function () {
                                if ($content.css('max-height') == maxHeightV) {
                                    var scrollHeight = $content[0].scrollHeight;
                                    $content.animate({ maxHeight: scrollHeight + 'px' }, "fast");
                                    $(this).prev().css("background", "#fff0")
                                    $(this).text("隐藏");
                                } else {
                                    $content.animate({ maxHeight: maxHeightV }, "fast");
                                    $(this).prev().css("background", "linear-gradient(to bottom, #fff0, #fff)")
                                    $(this).text("展开");
                                }
                            });
                        }
                    });

                }
            }
        },
        asyncStyle() {
            if (script.setting.normal.FoldChuan) {
                return `
                #h-content .h-threads-list .maxtoggle-button{position: absolute;top: -30px;left: -10px;border: none;border-radius: 5px;background: #f9f9f9;color: #b9b9b9;}
                #h-content .h-threads-list .maxtoggle-button:hover{background: #e9e9e9;color:#222}
                #h-content .h-threads-list .removeScorll{max-height: 100%;overflow-y: none;}
                #h-content .h-threads-list .show-more-replies{width: 100%;border: none;padding: 5px 0;border-radius: 5px;background: #f9f9f9;color: #b9b9b9;}
                #h-content .h-threads-list .show-more-replies:hover{background: #e9e9e9;color:#222}
                `
            }
        }
    }
    /**
     * 扩展坞模块
     * @name ExtraDocker
     * @description 此模块提供了一个悬浮的扩展坞，来添加某些功能
     *              目前添加的功能有:
     *              TOP返回顶部: 返回顶部
     *              MENU打开菜单: 打开设置主菜单
     *              REPLY跳转上一页: 跳转到上一页
     *              BOTTOM跳转尾页: 跳转到当前帖子的尾页
     */
    const ExtraDocker = {
        name: 'ExtraDocker',
        title: '扩展坞',
        initFunc() {
            const _this = this
            const $dockerDom = $(`
                    <div class="hld__docker">
                        <div class="hld__docker-sidebar">
                            <svg t="1603961015993" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3634" width="64" height="64"><path d="M518.344359 824.050365c-7.879285 0-15.758569-2.967523-21.693614-9.004897l-281.403018-281.403018c-5.730389-5.730389-9.004897-13.609673-9.004897-21.693614s3.274508-15.963226 9.004897-21.693614l281.403018-281.403018c11.972419-11.972419 31.41481-11.972419 43.387229 0 11.972419 11.972419 11.972419 31.41481 0 43.387229L280.32857 511.948836l259.709403 259.709403c11.972419 11.972419 11.972419 31.41481 0 43.387229C534.0006 821.082842 526.223643 824.050365 518.344359 824.050365z" p-id="3635" fill="#888888"></path><path d="M787.160987 772.88618c-7.879285 0-15.758569-2.967523-21.693614-9.004897l-230.238833-230.238833c-11.972419-11.972419-11.972419-31.41481 0-43.387229l230.238833-230.238833c11.972419-11.972419 31.41481-11.972419 43.387229 0 11.972419 11.972419 11.972419 31.41481 0 43.387229L600.309383 511.948836l208.545218 208.545218c11.972419 11.972419 11.972419 31.41481 0 43.387229C802.817228 769.918657 794.937943 772.88618 787.160987 772.88618z" p-id="3636" fill="#888888"></path></svg>
                        </div>
                        <div class="hld__docker-btns">
                            <div data-type="TOP" id="hld__jump_top"><svg t="1603962702679" title="返回顶部" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9013" width="64" height="64"><path d="M528.73 161.5c-9.39-9.38-24.6-9.38-33.99 0L319.65 336.59a24.028 24.028 0 0 0-7.05 23.59A24.04 24.04 0 0 0 330 377.6c8.56 2.17 17.62-0.52 23.6-7.02l158.14-158.14 158.1 158.14a23.901 23.901 0 0 0 17 7.09c6.39 0 12.5-2.55 17-7.09 9.38-9.39 9.38-24.61 0-34L528.73 161.5zM63.89 607.09h102.79V869.5h48.04V607.09h102.79v-48.04H63.89v48.04z m518.69-48.05h-127.3c-15.37 0-30.75 5.85-42.49 17.59a59.846 59.846 0 0 0-17.59 42.49v190.3c0 15.37 5.89 30.75 17.59 42.49 11.74 11.74 27.12 17.59 42.49 17.59h127.3c15.37 0 30.75-5.85 42.49-17.59 11.7-11.74 17.59-27.12 17.59-42.49V619.17a59.903 59.903 0 0 0-17.53-42.55 59.912 59.912 0 0 0-42.55-17.54v-0.04z m12 250.38c0 2.31-0.6 5.59-3.5 8.54a11.785 11.785 0 0 1-8.5 3.5h-127.3c-3.2 0.02-6.26-1.26-8.5-3.54a11.785 11.785 0 0 1-3.5-8.5V619.17c0-2.31 0.6-5.59 3.5-8.54 2.24-2.27 5.31-3.53 8.5-3.5h127.3c2.27 0 5.55 0.64 8.5 3.55 2.27 2.24 3.53 5.31 3.5 8.5v190.29-0.05z m347.4-232.78a59.846 59.846 0 0 0-42.49-17.59H734.74V869.5h48.04V733.32h116.71a59.94 59.94 0 0 0 42.54-17.55 59.923 59.923 0 0 0 17.55-42.54v-54.07c0-15.37-5.85-30.74-17.59-42.49v-0.03z m-30.44 96.64c0 2.26-0.64 5.55-3.55 8.5a11.785 11.785 0 0 1-8.5 3.5H782.78v-78.15h116.71c2.27 0 5.59 0.6 8.54 3.5 2.27 2.24 3.53 5.31 3.5 8.5v54.15z m0 0" p-id="9014" fill="#591804"></path></svg></div>
                            <div data-type="MENU" id="hld__jump_menu"><svg t="1687167394269" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5137" width="48" height="48"><path d="M708.367 353.656c0-56.745-22.729-110.092-63.996-150.218s-96.132-62.224-154.494-62.224-113.229 22.099-154.498 62.224-63.996 93.473-63.996 150.218c0 43.987 13.713 86.196 39.651 122.064 7.273 10.060 21.559 12.479 31.904 5.406 10.343-7.073 12.834-20.963 5.561-31.019-20.486-28.329-31.315-61.684-31.315-96.451 0-92.585 77.471-167.911 172.694-167.911s172.689 75.325 172.689 167.911-77.471 167.906-172.694 167.906c-47.055 0-92.711 8.965-135.702 26.646-41.516 17.076-78.796 41.509-110.806 72.632-32.007 31.123-57.142 67.371-74.705 107.736-18.181 41.808-27.401 86.199-27.401 131.948 0 12.298 10.252 22.266 22.898 22.266s22.898-9.968 22.898-22.266c0-162.35 135.843-294.425 302.816-294.425 58.361 0 113.229-22.099 154.497-62.22s63.996-93.477 63.996-150.221zM530.991 631.551c0 12.298 10.252 22.266 22.898 22.266h304.337c12.647 0 22.898-9.968 22.898-22.266s-10.252-22.266-22.898-22.266h-304.337c-12.647 0-22.898 9.968-22.898 22.266zM858.229 722.671h-304.337c-12.65 0-22.898 9.968-22.898 22.266s10.252 22.266 22.898 22.266h304.337c12.647 0 22.898-9.968 22.898-22.266 0-12.294-10.252-22.266-22.898-22.266zM858.229 836.056h-304.337c-12.65 0-22.898 9.967-22.898 22.266s10.252 22.266 22.898 22.266h304.337c12.647 0 22.898-9.968 22.898-22.266 0-12.294-10.252-22.266-22.898-22.266z" fill="#591804" p-id="5138"></path></svg></div>
                            <div data-type="REPLY" id="hld__jump_reply"><svg t="1687169791224" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8570" width="48" height="48"><path d="M415.937331 320 415.937331 96 20.001331 438.176C-6.718669 461.28-6.622669 498.784 20.033331 521.824L415.937331 864 415.937331 640C639.937331 640 847.937331 688 1023.937331 928 943.937331 480 607.937331 320 415.937331 320" p-id="8571" fill="#591804"></path></svg></div>
                            <div data-type="BOTTOM" id="hld__jump_bottom"><svg t="1603962680160" title="跳转至最后一页" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7501" width="64" height="64"><path d="M792.855 465.806c-6.24-6.208-14.369-9.312-22.56-9.312s-16.447 3.169-22.688 9.44l-207.91 207.74v-565.28c0-17.697-14.336-32-32-32s-32.002 14.303-32.002 32v563.712l-206.24-206.164c-6.271-6.209-14.432-9.344-22.624-9.344-8.224 0-16.417 3.135-22.656 9.407-12.511 12.513-12.48 32.768 0.032 45.248L483.536 770.38c3.265 3.263 7.104 5.6 11.136 7.135 4 1.793 8.352 2.88 13.024 2.88 1.12 0 2.08-0.544 3.2-0.64 8.288 0.064 16.608-3.009 22.976-9.408l259.11-259.292c12.48-12.511 12.448-32.8-0.127-45.248z m99.706 409.725c0 17.665-14.303 32.001-31.999 32.001h-704c-17.665 0-32-14.334-32-31.999s14.335-32 32-32h704c17.696 0 32 14.334 32 31.998z" p-id="7502" fill="#591804"></path></svg></div>
                        </div>
                    </div>
                `)
            $('#h-tool').remove()
            $('body').append($dockerDom)
            /**
             * Bind:Click
             * 按钮点击事件
             */
            $('body').on('click', '.hld__docker-btns>div', function (e) {
                const type = $(this).data('type')
                if (type == 'TOP') {
                    $('html, body').animate({ scrollTop: 0 }, 500)
                }
                if (type == 'MENU') {
                    $('#hld__setting_cover').css('display', 'block')
                    $('html, body').animate({ scrollTop: 0 }, 500)
                }
                if (type == 'REPLY') {
                    if (script.isForms()) {
                        window.location.href = $('.uk-pagination a:contains("上一页")').attr('href');
                    }
                }
                if (type == 'BOTTOM') {
                    window.location.href = "#h-footer"
                }
            })
        },
        renderAlwaysFunc(script) {
            (script.isForms()) ? $('.hld__docker').show() : $('.hld__docker').hide()
            $('#hld__jump_favor').toggle(script.isForms())
            $('#hld__jump_reply').toggle(script.isForms())
        },
        /**
         * 获取URL参数对象
         * @method getQuerySet
         * @return {Object} 参数对象
         */
        getQuerySet() {
            let queryList = {}
            let url = decodeURI(window.location.search.replace(/&amp;/g, "&"))
            url.startsWith('?') && (url = url.substring(1))
            url.split('&').forEach(item => {
                let t = item.split('=')
                if (t[0] && t[1]) {
                    queryList[t[0]] = t[1]
                }
            })
            return queryList
        },
        style: `
            .hld__docker{position:fixed;height:80px;width:30px;bottom:180px;right:0;transition:all ease .2s}
            .hld__docker:hover{width:150px;height:300px;bottom:75px}
            .hld__docker-sidebar{background:#fff;position:fixed;height:50px;width:20px;bottom:195px;right:0;display:flex;justify-content:center;align-items:center;background:#fff;border:1px solid #CCC;box-shadow:0 0 1px #333;border-right:none;border-radius:5px 0 0 5px}
            .hld__excel-body .hld__docker-sidebar{background:#fff;border:1px solid #bbb}
            .hld__docker-btns{position:absolute;top:0;left:50px;bottom:0;right:50px;display:flex;justify-content:center;align-items:center;flex-direction:column}
            .hld__docker .hld__docker-btns>div{opacity:0;flex-shrink: 0;}
            .hld__docker:hover .hld__docker-btns>div{opacity:1}
            .hld__docker-btns>div{background:#fff;border:1px solid #CCC;box-shadow:0 0 1px #444;width:50px;height:50px;border-radius:50%;margin:10px 0;cursor:pointer;display:flex;justify-content:center;align-items:center}
            .hld__excel-body .hld__docker-btns>div{background:#fff;border:1px solid #bbb}
            .hld__docker-btns svg{width:30px;height:30px;transition:all ease .2s}
            .hld__docker-btns svg:hover{width:40px;height:40px}
            .hld__excel-body .hld__docker-sidebar{background:#fff;border:1px solid #bbb}
            .hld__excel-body .hld__docker-btns>div{background:#fff;border:1px solid #bbb}
            `
    }
    /**
    * 引用串优化模块
    * @name QuoteChuan
    * @description 此模块可以减少引用串的请求次数
    *              优化样式与二次查看时的等待时间
    *
    */
    const QuoteChuan = {
        name: 'QuoteChuan',
        title: '引用串优化',
        setting: {
            type: 'normal',
            key: 'QuoteChuan',
            default: true,
            title: '引用串优化',
            menu: 'right'
        },
        renderFormsFunc($el) {
            //console.log('启用引用串优化', script.setting.normal.QuoteChuan)
            if (script.setting.normal.QuoteChuan) {
                //console.log('引用串优化执行', script.setting.normal.QuoteChuan)
                // 重写4.绿色引用串显示、修改slideUpDown、缓存数据避免重复请求
                // 话说不要用color=#789922发串啊！
                const cache = {};
                var removedHtmls = $('font[color="#789922"]').map(function () { return this.outerHTML; }).get();
                $('font[color="#789922"]').each(function (index) {
                    var prevSibling = $(this).prev();
                    if (prevSibling.length > 0) {
                        prevSibling.after(removedHtmls[index]);
                    } else {
                        $(this).parent().prepend(removedHtmls[index]);
                    }
                    $(this).remove();
                });

                $(document).on('mouseenter', 'font[color="#789922"]', function () {
                    const $this = $(this);
                    const tid = $this.text().match(/\d+/)[0];
                    fetchData(tid, $this);
                });

                function fetchData(tid, $this) {
                    if (cache[tid]) { showRefView(cache[tid], $this); } else {
                        $this.css('cursor', 'progress');
                        $.get(`/Home/Forum/ref?id=${tid}`).done(function (data) {
                            if (typeof data == "string") {
                                if (data.startsWith('<div class="h-threads-item">')) {
                                    cache[tid] = data;
                                    data = data;
                                } else {
                                    data = `<div class="h-threads-item">Error:服务器返回错误.</div>`;
                                }
                            } else if (typeof data == "object") {
                                data = `<div class="h-threads-item">${data.info}</div>`;
                            } else {
                                data = `<div class="h-threads-item">Error:服务器返回错误.</div>`;
                            }
                            showRefView(data, $this);
                        });
                    }
                }
                function showRefView(data, $this) {
                    const $refView = $("#h-ref-view").off().html(data).css({ top: $this.offset().top, left: $this.offset().left });
                    $refView.ready().addClass("QuoteChuan").slideDown(200);
                    setTimeout(() => {
                        $refView.one('mouseleave', function () { $(this).slideUp(200); $("#h-ref-view").removeAttr('QuoteChuan-state'); });
                    }, 500);
                }

            }
        },
        asyncStyle() {
            if (script.setting.normal.QuoteChuan) {
                return `
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-ref {margin: 0!important;padding: 0!important;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main{display:flex;margin: 0;padding: 20px 0 0 0;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-img-box{display: block;width: 200px;border-radius: 10px;max-width: 220px;background: #ccc;margin: 10px 10px 0 0;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-img-box img{width: 100%;min-width: 100px;max-height: 300px;overflow: hidden;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info{position: absolute;top: 0px;margin: 0;padding: 0;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-info .h-threads-info-createdat{display:none}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-content{margin: 10px 0;font-size: small;min-width: 260px;}
                ._xd_beautyCss .QuoteChuan .h-threads-item .h-threads-item-reply .h-threads-item-reply-main .h-threads-tips{display: none;}
                `
            }
        }
    }
    /**
     * 初始化脚本
     */
    const script = new XDBBSScript()
    /**
     * 添加模块
     */
    script.addModule(SettingPanel)  //设置模块
    script.addModule(HDImage)       //高清图片模块
    script.addModule(PageCss)       //页面美化模块
    script.addModule(ExtraDocker)   //扩展坞模块
    script.addModule(LinkBlank)     //串串页新页面打开模块
    script.addModule(AutoPage)      //自动翻页模块
    script.addModule(HideImage)      //隐藏图片
    script.addModule(QuoteChuan)      //引用串优化
    script.addModule(FoldChuan)      //回应串折叠
    /**
     * 运行脚本
     */
    script.run()
})();