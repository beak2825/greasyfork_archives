// ==UserScript==
// @name         Bilibili评论成分识别&屏蔽
// @namespace    analyzer.bilibili
// @version      2.15
// @description  标注成分&自动屏蔽
// @author       星之所向i
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/festival/*
// @match        *://www.bilibili.com/read/*
// @match        *://www.bilibili.com/blackboard/*
// @match        *://www.bilibili.com/list/watchlater*
// @match        *://www.bilibili.com/list/ml*
// @match        *://www.bilibili.com/v/topic/*
// @match        *://www.bilibili.com/bangumi/*
// @match        *://www.bilibili.com/opus/*
// @match        *://t.bilibili.com/*
// @match        *://space.bilibili.com/*/dynamic*
// @match        *://live.bilibili.com/*
// @match        *//live.bilibili.com/blanc/*?liteVersion=*
// @exclude      *://www.bilibili.com/video/online.html*
// @exclude      *://www.bilibili.com/
// @exclude      *://live.bilibili.com/p/*
// @exclude      *//t.bilibili.com/h5/dynamic/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @noframes
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451421/Bilibili%E8%AF%84%E8%AE%BA%E6%88%90%E5%88%86%E8%AF%86%E5%88%AB%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451421/Bilibili%E8%AF%84%E8%AE%BA%E6%88%90%E5%88%86%E8%AF%86%E5%88%AB%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

const script = async () => {
    'use strict';

    let
        /** MODE 模式
         * @type { '自动' | '静默' }
         */
        MODE = '自动',

        /** 检测功能启用状态
         * @type { boolean }
         */
        DET = true,

        /** 屏蔽功能启用状态
         * @type { boolean }
         */
        DEL = false,

        /** 屏蔽样式
         * @type { '完全删除' | '消息屏蔽' }
         */
        DEL_STYLE = '消息屏蔽',

        /** 自动模式下每秒最大检测次数, 不含已检测过成分的用户
         * @type { number }
         */
        LIMIT_EVENT = 10,

        /** 标签收纳阈值(字节), 超过自动收纳
         * @type { number }
         */
        TAG_MAX_LENGTH = 20,

        /** 渲染最短间隔时间(毫秒)
         * @type { number }
         */
        INTERVAL = 0,

        /** 检测依据 粉丝牌/关注列表/投稿列表/动态空间/评论文本
         * @type { { [ key: string ]: boolean} }
         */
        DET_BASE = {
            DET_BASE_MedalWall: true,
            DET_BASE_FOLLOWINGS: true,
            DET_BASE_VIDEOS: true,
            DET_BASE_DYNAMIC: true,
            DET_BASE_COMMENT: true,
        },

        /**  粉丝牌/关注列表/投稿列表/动态空间API 过载状态
         * @type { { [ key: string ]: { Timer: number | null, state: boolean, timestamp: number } } }
         */
        API_OVERLOAD = {
            DET_BASE_MedalWall: { Timer: null, state: false, timestamp: 0 },
            DET_BASE_FOLLOWINGS: { Timer: null, state: false, timestamp: 0 },
            DET_BASE_VIDEOS: { Timer: null, state: false, timestamp: 0 },
            DET_BASE_DYNAMIC: { Timer: null, state: false, timestamp: 0 },
        }

    /** <===================================================================================设置面板==========================================================================================> */
    let navPanelVis = false, ctab = true, ckey = undefined, ciframe = undefined, animationState = false, init = false, newRuleKeysSet = new Set(), deleteRuleKeysSet = new Set(), newAntiRuleSets = new Set(), deleteAntiRuleSets = new Set(), settingTemp = {}, timerTab1 = null, timerTab2 = null, timerFoot = null, timerFoot2 = null, timerAnimaltion = null

    /** 重新封装history行为
     * @param { string } type histroy行为类型
     * @returns { (...args: any[]) => any }
     */
    const bindHistoryEvent = (type) => {
        const historyEvent = history[type]
        return function () {
            const newEvent = historyEvent.apply(this, arguments)
            const e = new Event(type)
            e.arguments = arguments
            window.dispatchEvent(e)
            return newEvent
        }
    }

    /** 等待
     * @param { number } wait 等待时长
     * @returns { Promise<void> }
     */
    const delay = (wait) => new Promise((r) => setTimeout(r, wait))

    /** 基于消息队列的事件节流器 */
    class Throttler {
        /** 构造器参数
         * @param { number } limit 单位时间内事件执行的最大次数
         * @param { number } interval 单位时间长度
         * @param { ( object ) => boolean } callback 回调函数
         */
        constructor(limit, interval, callback) {
            this._limit = limit
            this._count = 0
            this._interval = interval
            this._ispending = true
            this._ftimestamp = Date.now() + interval
            this._timer = null
            this._callback = callback
            this._queue = []
            this._queue.__proto__ = Object.create(Array.prototype)
            this._queue.__proto__.push = (...args) => { Array.prototype.push.call(this._queue, ...args); if (this._ispending && this._count < this._limit) this.deal() }
            this._queue.__proto__.unshift = (...args) => { Array.prototype.unshift.call(this._queue, ...args); if (this._ispending && this._count < this._limit) this.deal() }
        }

        /** 加入队列
         * @param { object } data 处理回调事件所需的数据对象
         * @param { boolean } isJump 插队到消息队列最前端
         * @returns { void }
         */
        enqueue = (data, isJump) => isJump ? this._queue.unshift(data) : this._queue.push(data)

        /** 从队列最前面移除并返回元素
         * @returns { object }
         */
        dequeue = () => this._queue.shift()

        /** 重置计数与时间戳
       * @returns { void }
       */
        reset = () => {
            this._count = 0
            this._ftimestamp = Date.now() + this._interval
        }

        /** 重置限制次数
        * @returns { void }
        */
        resetlimit = (newLimit) => {
            this._limit = newLimit
            this.reset()
        }

        /** 重置队列
        * @returns { void }
        */
        resetqueue = () => this._queue.length = 0

        /** 处理事件
         * @returns { boolean }
         */
        deal = () => {
            if (Date.now() >= this._ftimestamp) this.reset()
            if (this._queue.length > 0 && this._count < this._limit) {
                let item = this.dequeue()
                if (item) {
                    if (this._callback(item)) this._count++
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }

        /** 定时处理消息队列中额定的事件
         * @returns { void }
         */
        start = () => {
            setTimeout(async () => {
                while (true) {
                    this._ispending = false
                    while (this.deal()) { }
                    this._ispending = true
                    await delay(this._ftimestamp - Date.now())
                }
            }, 0)
        }
    }

    /** 节流
     * @param { function } func 函数体
     * @param { number } wait 时间间隔
     * @param { { leading?: boolean, trailing?: boolean } } options 参数配置
     * @returns { [ (...args: any[]) => void, () => void ] }
     */
    const _throttle = (func, wait, options = {}) => {
        if (typeof (func) !== 'function' || typeof (wait) !== 'number' || typeof (options) !== 'object') return () => { }
        let context, args, timer, option = { leading: false, trailing: true, ...options }
        return [function () {
            context = this
            args = arguments
            if (option.leading && !timer) {
                func.apply(context, args)
                if (!option.trailing) {
                    timer = setTimeout(() => timer = null, wait)
                }
            }
            if (!timer && option.trailing) {
                timer = setTimeout(() => {
                    func.apply(context, args)
                    timer = null
                }, wait)
            }
        }, () => { clearTimeout(timer); timer = null }]
    }

    /** 防抖
     * @param { function } func 函数体
     * @param { number } wait 时间间隔
     * @param { { leading?: boolean, maxWait?: number, trailing?: boolean } } options 参数配置
     * @returns { [ (...args: any[]) => void, () => void ] }
     */
    const _debounce = (func, wait, options = {}) => {
        if (typeof (func) !== 'function' || typeof (wait) !== 'number' || typeof (options) !== 'object') return () => { }
        let context, args, timer, maxTimr, option = { leading: false, maxWait: undefined, trailing: true, ...options }
        return [function () {
            context = this
            args = arguments
            if (option.leading && !timer) {
                func.apply(context, args)
            }
            if (timer) {
                clearTimeout(timer)
                timer = null
            }
            if (option.maxWait !== undefined && !maxTimr) {
                maxTimr = setTimeout(() => {
                    func.apply(context, args)
                    clearTimeout(timer)
                    timer = null
                    maxTimr = null
                }, option.maxWait)
            }
            if (!timer && option.trailing) {
                timer = setTimeout(() => {
                    func.apply(context, args)
                    clearTimeout(maxTimr)
                    timer = null
                }, wait)
            }
        }, () => { clearTimeout(timer); timer = null }]
    }

    /** 系统提示
     * @param { string } text 提示文本
     * @param { string } title 提示标题
     * @param { () => void } callback 提示点击回调
     * @returns { void }
     */
    const showNotification = (text, title, timeout = 0, callback = () => { }) => {
        GM_notification({
            text,
            title,
            timeout,
            onclick: () => {
                window.focus()
                callback()
            }
        })
    }

    /** 监听对象并在被监听键值改变时执行回调函数
     * @param { object } obj 监听对象
     * @param { string } key 监听键名
     * @param { ( newvalue: string | number ) => void } callback 监听键值变化时调用的回调函数
     * @returns { void }
     */
    const watch = (obj, key, callback) => {
        if (typeof (obj) !== 'object' || typeof (key) !== 'string' || typeof (callback) !== 'function') return
        let value = obj[key]
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get: () => value,
            set: (newValue) => {
                value = newValue
                callback(newValue)
            }
        })
    }

    /** API过载后禁用15分钟
     * @param { string } api 需要禁用的API名
     * @param { Element | null } ele 需要修改的元素
     * @param { number } time 禁用时间, 默认15分钟
     * @param { number } timestamp 禁用截止时间戳
     * @returns { void }
     */
    const banAPI = (api, ele = null, time = 15 * 60 * 1000, timestamp = Date.now(), isAlert = true) => {
        if (isAlert && DET_BASE[api]) showNotification(`检测到API『${api}』频繁调用被B站暂时拉黑, 已自动禁用${(time / 60000).toFixed(2)}分钟`, 'API禁用提醒')
        API_OVERLOAD[api].state = true
        if (API_OVERLOAD[api].Timer === null) {
            API_OVERLOAD[api].timestamp = timestamp
            API_OVERLOAD[api].Timer = setTimeout(() => recoverAPI(api, ele, ele?.className), time)
        }
        if (DET_BASE[api]) {
            DET_BASE[api] = false
            if (ele) ele.className = 'statusBAN'
        }
        GM_setValue('xzsx_bilibili_detector_apioverload', JSON.stringify(API_OVERLOAD))
    }

    /** 恢复API
     * @param { string } api 需要恢复的API名
     * @param { Element | null } ele 需要修改的元素
     * @param { string } preClass 需要修改的元素样式
     * @returns { void }
     */
    const recoverAPI = (api, ele = null, preClass = undefined) => {
        DET_BASE[api] = true
        API_OVERLOAD[api].state = false
        API_OVERLOAD[api].timestamp = Date.now()
        clearTimeout(API_OVERLOAD[api].Timer)
        API_OVERLOAD[api].Timer = null
        if (ele !== null && preClass !== undefined) ele.className = JSON.parse(JSON.stringify(preClass))
    }

    /** 深拷贝配置参数
     * @param { object } source 配置参数对象
     * @returns { object }
     */
    const deepCloneRules = (source) => {
        let clone = JSON.parse(JSON.stringify(source))
        Object.keys(clone.detect).forEach((key) => {
            clone.detect[key]['keywords'] = clone.detect[key].hasOwnProperty('keywords') ? new Set([...source.detect[key].keywords]) : new Set()
            clone.detect[key]['antikeywords'] = clone.detect[key].hasOwnProperty('antikeywords') ? new Set([...source.detect[key].antikeywords]) : new Set()
        })
        return clone
    }

    /** 从本地存储读取配置信息
     * @returns { object }
     */
    const initRules = () => {
        /** 初始配置 */
        const initConf = {
            blackList:
            {
                '原神': '基于成分',
                '明日方舟': '基于成分',
                '王者荣耀': '基于成分',
                '用户昵称': '基于昵称',
                /** ... */
            },
            detect: {
                '原神': { 'color': '#000000', 'keywords': new Set(['原神', '莴苣某人', '你的影月月']), 'antikeywords': new Set(['原P', '原批']) }, /** 最好不要填写容易匹配英文单词的关键词 */
                '明日方舟': { 'color': '#73ff00', 'keywords': new Set(['明日方舟', 'Wan顽子']), 'antikeywords': new Set(['粥÷', '粥畜']) },
                '王者荣耀': { 'color': '#ff00f7', 'keywords': new Set(['王者荣耀', 'AG超玩会王者荣耀梦泪']), 'antikeywords': new Set(['农P', '农批']) },
                '战双帕弥什': { 'color': '#f50000', 'keywords': new Set(['战双帕弥什']), 'antikeywords': new Set(['双畜']) },
                '崩坏3': { 'color': '#8000ff', 'keywords': new Set(['崩坏3第一偶像爱酱']), 'antikeywords': new Set(['幻官']) },
                'Asoul': { 'color': '#000000', 'keywords': new Set(['A-SOUL_Official', '嘉然今天吃什么', '向晚大魔王', '贝拉kira', '乃琳Queen', '顶碗人', '音乐珈', '奶淇淋', '贝极星']), 'antikeywords': new Set(['A畜']) },
                '幻塔': { 'color': '#66dbd9', 'keywords': new Set(['幻塔']), 'antikeywords': new Set(['幻官']) },
                '棺人痴': { 'color': '#fed06c', 'keywords': new Set(['東雪蓮Official', '東雪蓮', '东雪莲', '棺人痴']), 'antikeywords': new Set(['眠大佐']) },
                /** ... */
            }
        }
        try {
            let conf = GM_getValue('xzsx_bilibili_detector'), state = GM_getValue('xzsx_bilibili_detector_state'), overload = GM_getValue('xzsx_bilibili_detector_apioverload')
            /** 从本地存储恢复配置列表 */
            if (typeof (conf) === 'string' && conf) {
                conf = JSON.parse(conf)
                if (Object.keys(conf).length > 0) {
                    if (Array.isArray(conf.blackList)) {
                        let obj = {}
                        conf.blackList.forEach((key) => obj[key] = '基于昵称')
                        conf.blackList = obj
                    }
                    Object.keys(conf?.detect).forEach((key) => {
                        conf.detect[key]['keywords'] = conf.detect[key].hasOwnProperty('keywords') ? new Set([...conf.detect[key].keywords.length > 0 ? conf.detect[key].keywords : []]) : new Set()
                        conf.detect[key]['antikeywords'] = conf.detect[key].hasOwnProperty('antikeywords') ? new Set([...conf.detect[key].antikeywords.length > 0 ? conf.detect[key].antikeywords : []]) : new Set()
                    })
                }
            }

            /** 初始配置 */
            if (!conf || Object.keys(conf).length === 0) conf = initConf

            /** 从本地存储恢复状态 */
            if (typeof (state) === 'string' && state) {
                state = JSON.parse(state)
                MODE = state?.MODE ?? (state?.MODE === '自动' || state?.MODE === '静默') ? state?.MODE : '自动'
                DET = state?.DET ?? (typeof (state?.DET) === "boolean" ? state?.DET : true)
                DEL = state?.DEL ?? (typeof (state?.DEL) === "boolean" ? state?.DEL : false)
                DEL_STYLE = state?.DEL_STYLE ?? (state?.DEL_STYLE === '消息屏蔽' || state?.DEL_STYLE === '完全删除') ? state?.DEL_STYLE : '消息屏蔽'
                TAG_MAX_LENGTH = state?.TAG_MAX_LENGTH ?? (typeof (state?.TAG_MAX_LENGTH) === "number" ? state?.TAG_MAX_LENGTH : 20)
                INTERVAL = state?.INTERVAL ?? (typeof (state?.INTERVAL) === "number" ? state?.INTERVAL : 0)
                LIMIT_EVENT = state?.LIMIT_EVENT ?? (typeof (state?.LIMIT_EVENT) === "number" ? state?.LIMIT_EVENT : 10)
                DET_BASE['DET_BASE_MedalWall'] = state?.DET_BASE_MedalWall ?? (typeof (state?.DET_BASE_MedalWall) === "boolean" ? state?.DET_BASE_MedalWall : true)
                DET_BASE['DET_BASE_FOLLOWINGS'] = state?.DET_BASE_FOLLOWINGS ?? (typeof (state?.DET_BASE_FOLLOWINGS) === "boolean" ? state?.DET_BASE_FOLLOWINGS : true)
                DET_BASE['DET_BASE_VIDEOS'] = state?.DET_BASE_VIDEOS ?? (typeof (state?.DET_BASE_VIDEOS) === "boolean" ? state?.DET_BASE_VIDEOS : true)
                DET_BASE['DET_BASE_DYNAMIC'] = state?.DET_BASE_DYNAMIC ?? (typeof (state?.DET_BASE_DYNAMIC) === "boolean" ? state?.DET_BASE_DYNAMIC : true)
                DET_BASE['DET_BASE_COMMENT'] = state?.DET_BASE_COMMENT ?? (typeof (state?.DET_BASE_COMMENT) === "boolean" ? state?.DET_BASE_COMMENT : true)
            }

            /** 从本地存储恢复API禁用状态 */
            if (typeof (overload) === 'string' && overload) {
                overload = JSON.parse(overload)
                Object.keys(overload).forEach((api) => {
                    if (overload[api]?.timestamp) {
                        let passed = Date.now() - overload[api].timestamp
                        if (overload[api]?.state && passed < 15 * 60 * 1000) banAPI(api, null, 15 * 60 * 1000 - passed, overload[api].timestamp, false)
                    }
                })
            }
            return [conf, deepCloneRules(conf)]
        } catch (error) {
            return [initConf, deepCloneRules(initConf)]
        }
    }

    /** 标记/屏蔽规则
     * @type { { blackList: [ key: string ]: string, detect: { [ key: string ]: { color: string, keywords: Set<string>, antikeywords: Set<string> } } } }
     */
    let [rulesApply, rules] = initRules()

    /** 构建事件节流器实例 */
    const _T = new Throttler(LIMIT_EVENT, 1000, ({ uid, user, isdeep, forceSync }) => {
        // 查重
        if (filte(uid, user)) return false
        // 异步处理
        setTimeout(() => handleStr(uid, user, isdeep, forceSync), 0)
        return true
    })

    /** 启动事件节流器 */
    _T.start()

    /** 获取正确的iframe
     *  当用户元素存在于iframe内时需要调用
     * @returns { HTMLIFrameElement | undefined } iframe存在则返回实例,反之则返回undefined
     */
    const getCurIframe = () => {
        let matches = []
        for (const iframe of document.getElementsByTagName('iframe')) {
            matches = iframe.attributes.src.value.match(/\/\/(.*?)\/([a-zA-Z|\d])+\/.*$/)
            if (matches !== null) {
                if (matches.length > 2 && matches[2] === 'p') continue
                if (matches.length > 1 && matches[1] === 'live.bilibili.com') return iframe
            }
        }
        return undefined
    }

    /** 添加css样式
     * @type { HTMLStyleElement }
     */
    const style = document.createElement('style')

    /** 面板相关css样式
     * @type { string }
     */
    const css_panel =
    `
        .nav-show{display:block;outline:0;height:24px;width:40px;margin-bottom:12px;transition:all 0.3s;cursor:pointer;text-align:center;padding:0 4px;position:fixed;bottom:4px;right:6px;color:white;background-color:rgb(75,182,206);box-sizing:border-box;box-shadow:0px 0px 2px #525252;border:0px;user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:14px;transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s;transform:scale(1);-o-transform:scale(1);-ms-transform:scale(1);-moz-transform:scale(1);-webkit-transform:scale(1);appearance:button;-moz-appearance:button;-webkit-appearance:button;z-index:99999;cursor:pointer;opacity:1}
        .nav-show:hover{transform:scale(0.8);-o-transform:scale(0.8);-ms-transform:scale(0.8);-moz-transform:scale(0.8);-webkit-transform:scale(0.8);opacity:0.5}
        .nav-panel{width:250px;height:425px;display:none;align-items:center;flex-direction:column;justify-content:flex-start;position:fixed;bottom:12px;right:90px;background-color:white;box-shadow:0px 0px 4px #6a6767;user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;z-index:999999;overflow:hidden}
        .nav-tabs{display:flex;width:100%;justify-content:space-around;box-shadow:0px 2px 4px #ddd}
        .nav-tabs-btn1{flex-grow:1;height:36px;background-color:rgba(22,51,194,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;border:0;cursor:pointer;filter:brightness(100%);-o-filter:brightness(100%);-moz-filter:brightness(100%);-webkit-filter:brightness(100%);z-index:1}
        .nav-tabs-btn1:hover{opacity:0.8}
        .nav-tabs-btn2{flex-grow:1;height:36px;background-color:rgba(49,182,203,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;border:0;cursor:pointer;filter:brightness(50%);-o-filter:brightness(50%);-moz-filter:brightness(50%);-webkit-filter:brightness(50%);z-index:1}
        .nav-tabs-btn2:hover{opacity:0.8}
        .nav-list{display:inline-flex;flex-direction:column;height:calc(100% - 36px);width:100%;overflow:auto}
        .rule-item-btn{border:1px solid #d9d9d9;outline:0;height:24px;padding:0 4px;font-size:14px;border-radius:2px;color:#fff;background:#1890ff;border-color:#1890ff;text-shadow:0 -1px 0 rgba(0,0,0,.12);box-shadow:0 2px 0 rgba(0,0,0,.045);appearance:button;-moz-appearance:button;-webkit-appearance:button;cursor:pointer}
        .rule-item-btn:hover{opacity:0.8}
        .addrule_form{position:absolute;top:36px;width:100%;height:calc(100% - 72px);padding:0;display:none;flex-direction:column;justify-content:flex-start;background-color:rgb(255,255,255);user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;z-index:1;animation:showEditPanel 0.5s forwards;-o-animation:showEditPanel 0.5s forwards;-moz-animation:showEditPanel 0.5s forwards;-webkit-animation:showEditPanel 0.5s forwards;clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-o-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-moz-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-webkit-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        @keyframes showEditPanel{from{clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        to{clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        }@-o-keyframes showEditPanel{from{-o-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        to{-o-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        }@-moz-keyframes showEditPanel{from{-moz-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        to{-moz-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        }@-webkit-keyframes showEditPanel{from{-webkit-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        to{-webkit-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        }.addrule_form-hide{position:absolute;top:36px;width:100%;height:calc(100% - 72px);padding:0;display:none;flex-direction:column;justify-content:flex-start;background-color:rgb(255,255,255);user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;z-index:1;animation:hideEditPanel 0.5s forwards;-o-animation:hideEditPanel 0.5s forwards;-moz-animation:hideEditPanel 0.5s forwards;-webkit-animation:hideEditPanel 0.5s forwards;clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%);-o-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%);-moz-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%);-webkit-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        @keyframes hideEditPanel{from{clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        to{clip-path:polygon(157% 0,157% 0,100% 100%,100% 100%)}
        }@-o-keyframes hideEditPanel{from{-o-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        to{-o-clip-path:polygon(157% 0,157% 0,100% 100%,100% 100%)}
        }@-moz-keyframes hideEditPanel{from{-moz-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        to{-moz-clip-path:polygon(157% 0,157% 0,100% 100%,100% 100%)}
        }@-webkit-keyframes hideEditPanel{from{-webkit-clip-path:polygon(0 0,157% 0,100% 100%,-57% 100%)}
        to{-webkit-clip-path:polygon(157% 0,157% 0,100% 100%,100% 100%)}
        }.addrule_item1{display:flex;justify-content:space-between;align-items:center;padding:8px;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px}
        .rule_keywords{height:50%;width:94%;flex-wrap:wrap;padding:8px;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;overflow-x:hidden;overflow-y:auto}
        .tagname_input{border:0;color:black;outline-style:none;height:37px;width:195px;font-size:32px;transition:color 0.5s;-o-transition:color 0.5s;-moz-transition:color 0.5s;-webkit-transition:color 0.5s}
        .tagcolor_input{height:30px;width:30px;cursor:pointer}
        .xzsx_detect_tagsample_container{display:flex;justify-content:flex-start;align-items:center;height:36px;padding-left:8px;padding-right:8px;padding-top:4px;padding-bottom:2px;box-shadow:0px 0px 8px #ddd inset;overflow:hidden}
        .xzsx_detect_tagsample{display:inline-flex;height:14px;line-height:14px;position:relative;box-sizing:content-box !important;padding:1px 2px 1px 14px;margin:1px 4px 1px 0;color:black;white-space:nowrap;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑 !important;font-size:14px;font-weight:600 !important;border-radius:6px 4px 4px 6px;box-shadow:0 0 6px #ddd;text-size-adjust:100%;-ms-text-size-adjust:100%;-moz-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent;transition:all 1s;-o-transition:all 1s;-moz-transition:all 1s;-webkit-transition:all 1s;overflow-wrap:break-word;cursor:pointer}
        .xzsx_detect_tagsample:hover{opacity:0.8}
        .xzsx_detect_tagsample::before{background:#fff;border-radius:10px;box-shadow:0 1px rgba(0,0,0,0.25) inset;content:'';height:6px;left:4px;position:absolute;width:6px;top:calc(50% - 3px)}
        .add_items{display:inline-flex;justify-content:center;align-items:center}
        .tagkeyword_input{width:128px;border:0;border-bottom:0.5px solid;outline-style:none;font-size:24px}
        .add_icon{display:inline-flex;justify-content:center;align-items:center;height:10px;width:10px;color:rgb(0,0,0);transform:scale(2);-o-transform:scale(2);-ms-transform:scale(2);-moz-transform:scale(2);-webkit-transform:scale(2);transform-origin:25% 55%;-o-transform-origin:25% 55%;-ms-transform-origin:25% 55%;-moz-transform-origin:25% 55%;-webkit-transform-origin:25% 55%;cursor:pointer}
        .add_icon:hover{opacity:0.5}
        .keyword{display:inline-flex;font-size:24px;padding:4px;animation:showEditPanel 0.5s forwards;-o-animation:showEditPanel 0.5s forwards;-moz-animation:showEditPanel 0.5s forwards;-webkit-animation:showEditPanel 0.5s forwards;clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-o-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-moz-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%);-webkit-clip-path:polygon(0 0,0 0,-57% 100%,-57% 100%)}
        .keyword:hover{background-color:#ddd}
        .keyword_delete{position:relative;top:-3px;right:0;width:20px;height:20px;border-radius:50%;text-align:center;transform:scale(0.6) translate(0%,0%);-o-transform:scale(0.6) translate(0%,0%);-ms-transform:scale(0.6) translate(0%,0%);-moz-transform:scale(0.6) translate(0%,0%);-webkit-transform:scale(0.6) translate(0%,0%);transform-origin:center;-o-transform-origin:center;-ms-transform-origin:center;-moz-transform-origin:center;-webkit-transform-origin:center;font-size:20px;color:#837171;line-height:18px;background-color:#b2bfc67a;cursor:pointer}
        .keyword_delete:hover{color:white;background-color:crimson}
        .keyword_delete:active{color:white;background-color:#f0f}
        .rule-item{display:flex;justify-content:space-between;align-items:center;padding:2px 8px 2px 8px;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;transform:scaleX(1);-o-transform:scaleX(1);-ms-transform:scaleX(1);-moz-transform:scaleX(1);-webkit-transform:scaleX(1);transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s;clip-path:polygon(0 0,115% 0,100% 100%,-15% 100%);-o-clip-path:polygon(0 0,115% 0,100% 100%,-15% 100%);-moz-clip-path:polygon(0 0,115% 0,100% 100%,-15% 100%);-webkit-clip-path:polygon(0 0,115% 0,100% 100%,-15% 100%)}
        .rule-item:hover{background-color:#ddd;transform:scaleX(0.95);-o-transform:scaleX(0.95);-ms-transform:scaleX(0.95);-moz-transform:scaleX(0.95);-webkit-transform:scaleX(0.95)}
        .rule-item-detect-add{font-size:18px;text-align:center;padding:2px 8px 2px 8px;border-left:0;border-right:0;color:blue;cursor:pointer}
        .rule-item-detect-add:hover{background-color:#ddd}
        .rule-item-blacklist-add{display:none;text-align:center;padding:2px 8px 2px 8px;border-left:0;border-right:0}
        .rule-item-blacklist-add-input{height:32px;width:90px;border:0;border-bottom:0.5px solid;outline-style:none;font-size:24px}
        .rule-item-blacklist-select{height:32.8px;width:90px;border:0;border-bottom:0.5px solid;outline-style:none;font-size:24px}
        .rule-item-blacklist-addicon{display:inline-flex;justify-content:center;align-items:center;height:10px;width:10px;color:rgb(0,0,0);transform:scale(3);-o-transform:scale(3);-ms-transform:scale(3);-moz-transform:scale(3);-webkit-transform:scale(3);transform-origin:25% 5%;-o-transform-origin:25% 5%;-moz-transform-origin:25% 5%;-webkit-transform-origin:25% 5%;cursor:pointer}
        .rule-item-blacklist-addicon:hover{opacity:0.5}
        .rule-item-blacklist-base{display:flex;justify-content:center;align-items:center;padding:2px 8px 2px 8px;margin-right:4px;color:#299bda;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;transform:scaleX(1);-o-transform:scaleX(1);-ms-transform:scaleX(1);-moz-transform:scaleX(1);-webkit-transform:scaleX(1);transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s;cursor:pointer}
        .rule-item-blacklist-base:hover{background-color:#ddd;transform:scaleX(0.95);-o-transform:scaleX(0.95);-moz-transform:scaleX(0.95);-webkit-transform:scaleX(0.95)}
        .nav-footer{display:flex;width:100%;position:relative;background-color:red;justify-content:flex-start;box-shadow:0px -2px 4px #ddd}
        .nav-footer:hover{opacity:0.8}
        .confirm_btn{flex-grow:1;height:36px;background-color:rgb(80,130,220,0.7);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:20px;border:0;cursor:pointer;z-index:1}
        .add_btn{flex-grow:1;height:36px;background-color:rgba(60,234,57,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:20px;border:0;cursor:pointer;z-index:1}
        .alter_btn{flex-grow:1;height:36px;background-color:rgba(154,36,160,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:20px;border:0;cursor:pointer;z-index:1}
        .nav-tabs-confirm_btn:hover{opacity:0.8}
        .changed-signel1{height:8px;width:8px;border-radius:50%;background-color:white;position:absolute;left:105px;top:14px;z-index:1}
        .changed-signel2{height:8px;width:8px;border-radius:50%;background-color:white;position:absolute;right:10px;top:14px;z-index:1}
        .statuslayout{height:12px;width:12px;position:absolute;left:8px;top:12px;display:flex;justify-content:center;align-items:center}
        .statuslayout2{margin-right:6px;margin-left:8px}
        .statusP{height:12px;width:12px;background-color:rgb(33,247,140);border-radius:50%}
        .statusE{height:12px;width:12px;background-color:rgb(243,28,28);border-radius:50%}
        .statusBAN{height:12px;width:12px;background-color:rgb(246,255,0);border-radius:50%}
        .statusPcircle{position:absolute;width:12px;height:12px;border:2px solid rgb(33,247,140);border-radius:50%;animation:Processing 1.2s infinite ease-in-out;-o-animation:Processing 1.2s infinite ease-in-out;-moz-animation:Processing 1.2s infinite ease-in-out;-webkit-animation:Processing 1.2s infinite ease-in-out;opacity:0}
        @keyframes Processing{0%{width:12px;height:12px;opacity:0.5}
        100%{width:24px;height:24px;opacity:0}
        }@-o-keyframes Processing{0%{width:12px;height:12px;opacity:0.5}
        100%{width:24px;height:24px;opacity:0}
        }@-moz-keyframes Processing{0%{width:12px;height:12px;opacity:0.5}
        100%{width:24px;height:24px;opacity:0}
        }@-webkit-keyframes Processing{0%{width:12px;height:12px;opacity:0.5}
        100%{width:24px;height:24px;opacity:0}
        }.process{visibility:hidden;position:absolute;height:36px;width:0%;background-color:rgb(0 53 255);transition:width 0.5s;-o-transition:width 0.5s;-moz-transition:width 0.5s;-webkit-transition:width 0.5s}
        .applysuccess{position:absolute;right:36px;top:6px;z-index:2;transform:scale(1.5);-o-transform:scale(1.5);-ms-transform:scale(1.5);-moz-transform:scale(1.5);-webkit-transform:scale(1.5);clip-path:polygon(0 0,0 0,0 100%,0 100%);-o-clip-path:polygon(0 0,0 0,0 100%,0 100%);-moz-clip-path:polygon(0 0,0 0,0 100%,0 100%);-webkit-clip-path:polygon(0 0,0 0,0 100%,0 100%);animation:success 1.5s infinite;-o-animation:success 1.5s infinite;-moz-animation:success 1.5s infinite;-webkit-animation:success 1.5s infinite}
        @keyframes success{0%{clip-path:polygon(0 0,0 0,0 100%,0 100%)}
        25%{clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%)}
        100%{clip-path:polygon(100% 0%,100% 0%,100% 100%,100% 100%)}
        }@-o-keyframes success{0%{-o-clip-path:polygon(0 0,0 0,0 100%,0 100%)}
        25%{-o-clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%)}
        100%{-o-clip-path:polygon(100% 0%,100% 0%,100% 100%,100% 100%)}
        }@-moz-keyframes success{0%{-moz-clip-path:polygon(0 0,0 0,0 100%,0 100%)}
        25%{-moz-clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%)}
        100%{-moz-clip-path:polygon(100% 0%,100% 0%,100% 100%,100% 100%)}
        }@-webkit-keyframes success{0%{-webkit-clip-path:polygon(0 0,0 0,0 100%,0 100%)}
        25%{-webkit-clip-path:polygon(0% 0%,100% 0%,100% 100%,0% 100%)}
        100%{-webkit-clip-path:polygon(100% 0%,100% 0%,100% 100%,100% 100%)}
        }.side-btn{display:flex;justify-content:center;align-items:center;position:fixed;right:355px;color:white;border:0;padding:4px;background-color:rgba(22,51,194,0.821);box-shadow:0px 0px 4px #575555;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:16px;cursor:pointer;user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;transform:scale(1);-o-transform:scale(1);-ms-transform:scale(1);-moz-transform:scale(1);-webkit-transform:scale(1);transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s;z-index:999999}
        .side-btn:hover{transform:scale(0.8);-o-transform:scale(0.8);-ms-transform:scale(0.8);-moz-transform:scale(0.8);-webkit-transform:scale(0.8);opacity:0.8}
        .side-btn-mode{bottom:380px}
        .side-btn-import{bottom:340px}
        .side-btn-export{bottom:300px}
        .navPanel-resetBtn{display:flex;justify-content:center;align-items:center;position:fixed;height:25px;width:25px;bottom:430px;right:56px;color:white;border-radius:0%;border:0;padding:2px;background-color:#11cc83bd;box-shadow:0px 0px 4px #575555;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;cursor:pointer;user-select:none;transform:scale(1);-o-transform:scale(1);-ms-transform:scale(1);-moz-transform:scale(1);-webkit-transform:scale(1);transition:all 0.5s;-o-transition:all 0.5s;-moz-transition:all 0.5s;-webkit-transition:all 0.5s;z-index:999999}
        .navPanel-resetBtn:hover{transform:scale(0.8);-o-transform:scale(0.8);-ms-transform:scale(0.8);-moz-transform:scale(0.8);-webkit-transform:scale(0.8);opacity:0.8;border-radius:35%}
        .resetBtn-icon{height:25px;width:25px;transform:rotate(0deg);-webkit-transform:rotate(0deg);transform-origin:50% 50%;-webkit-transform-origin:50% 50%;transition:all 0.5s;-o-transition:all 0.5s;-moz-transition:all 0.5s;-webkit-transition:all 0.5s}
        .resetBtn-icon:hover{transform:rotate(360deg);-o-transform:rotate(360deg);-ms-transform:rotate(360deg);-moz-transform:rotate(360deg);-webkit-transform:rotate(360deg)}
        .block_btn{display:inline-flex;position:relative;left:12px;bottom:-4px;cursor:pointer}
        .show-animation{width:344px;height:450px;position:fixed;bottom:12px;right:53px;clip-path:polygon(0 0,0 0,0 100%,0 100%);-o-clip-path:polygon(0 0,0 0,0 100%,0 100%);-moz-clip-path:polygon(0 0,0 0,0 100%,0 100%);-webkit-clip-path:polygon(0 0,0 0,0 100%,0 100%);animation:showPanel 0.5s forwards;-o-animation:showPanel 0.5s forwards;-moz-animation:showPanel 0.5s forwards;-webkit-animation:showPanel 0.5s forwards;opacity:1;z-index:99999}
        @keyframes showPanel{from{clip-path:polygon(0 0,100% 0,100% 0,0 0);opacity:1}
        to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        }@-o-keyframes showPanel{from{-o-clip-path:polygon(0 0,100% 0,100% 0,0 0);opacity:1}
        to{-o-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        }@-moz-keyframes showPanel{from{-moz-clip-path:polygon(0 0,100% 0,100% 0,0 0);opacity:1}
        to{-moz-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        }@-webkit-keyframes showPanel{from{-webkit-clip-path:polygon(0 0,100% 0,100% 0,0 0);opacity:1}
        to{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        }.hide-animation{width:342px;height:450px;position:fixed;bottom:12px;right:57px;clip-path:polygon(0 0,0 0,0 100%,0 100%);-o-clip-path:polygon(0 0,0 0,0 100%,0 100%);-moz-clip-path:polygon(0 0,0 0,0 100%,0 100%);-webkit-clip-path:polygon(0 0,0 0,0 100%,0 100%);animation:hidePanel 0.5s forwards;-o-animation:hidePanel 0.5s forwards;-moz-animation:hidePanel 0.5s forwards;-webkit-animation:hidePanel 0.5s forwards;z-index:99999}
        @keyframes hidePanel{from{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        to{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);opacity:1}
        }@-o-keyframes hidePanel{from{-o-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        to{-o-clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);opacity:1}
        }@-moz-keyframes hidePanel{from{-moz-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        to{-moz-clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);opacity:1}
        }@-webkit-keyframes hidePanel{from{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);opacity:1}
        to{-webkit-clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%);opacity:1}
        }.setting-show{display:inline-flex;flex-direction:column;justify-content:flex-start;align-items:center;position:absolute;right:0;top:36px;width:50%;height:0px;background-color:rgba(49,182,203,0.821);z-index:2;overflow:hidden;transition:all 1s;-o-transition:all 1s;-moz-transition:all 1s;-webkit-transition:all 1s}
        .setting-btn{display:flex;align-items:center;height:30px;width:100%;padding:0px;background-color:rgba(22,51,194,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;border:0;cursor:pointer;transform:scale(1);-o-transform:scale(1);-ms-transform:scale(1);-moz-transform:scale(1);-webkit-transform:scale(1);transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s}
        .setting-btn:hover{transform:scale(0.8);-o-transform:scale(0.8);-ms-transform:scale(0.8);-moz-transform:scale(0.8);-webkit-transform:scale(0.8);opacity:0.8}
        .setting-text{display:flex;justify-content:center;align-items:center;flex-direction:column;height:68px;width:100%;background-color:rgba(22,51,194,0.821);color:white;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-size:18px;border:0;cursor:pointer}
        .setting-text:hover{opacity:0.8}
        input[type=range]::-webkit-slider-thumb{appearance:none;-moz-appearance:none;-webkit-appearance:none;height:14px;width:14px;border-radius:50%;background:rgb(5,165,189);cursor:pointer}
        input[type=range][id=xzsx_length]{appearance:none;-moz-appearance:none;-webkit-appearance:none;height:8px;width:100%;margin-bottom:8px;outline:0;background:none;background:-webkit-linear-gradient(rgb(93,214,65),rgb(93,214,65))no-repeat,#fb0f0f;background-size:50% 100%}
        input[type=range][id=xzsx_interval]{appearance:none;-moz-appearance:none;-webkit-appearance:none;height:8px;width:100%;margin-bottom:8px;outline:0;background:none;background:-webkit-linear-gradient(#fb0f0f,#fb0f0f)no-repeat,rgb(93,214,65);background-size:10% 100%}
        input[type=range][id=xzsx_limitevent]{appearance:none;-moz-appearance:none;-webkit-appearance:none;height:8px;width:100%;margin-bottom:8px;outline:0;background:none;background:-webkit-linear-gradient(rgb(93,214,65),rgb(93,214,65))no-repeat,#fb0f0f;background-size:60% 100%}
        .nav-list::-webkit-scrollbar{height:8px;width:8px}
        .nav-list::-webkit-scrollbar-thumb{background-color:rgb(80,130,220,1)}
        .nav-list::-webkit-scrollbar-thumb:hover{background-color:rgb(80,130,220,0.5)}
        .nav-list::-webkit-scrollbar-track-piece{background:transparent}
        #rule_keywords::-webkit-scrollbar{height:8px;width:8px}
        #rule_keywords::-webkit-scrollbar-thumb{background-color:rgb(80,130,220,1)}
        #rule_keywords::-webkit-scrollbar-thumb:hover{background-color:rgb(80,130,220,0.5)}
        #rule_keywords::-webkit-scrollbar-track-piece{background:transparent}
        #rule_antikeywords::-webkit-scrollbar{height:8px;width:8px}
        #rule_antikeywords::-webkit-scrollbar-thumb{background-color:rgb(80,130,220,1)}
        #rule_antikeywords::-webkit-scrollbar-thumb:hover{background-color:rgb(80,130,220,0.5)}
        #rule_antikeywords::-webkit-scrollbar-track-piece{background:transparent}
        .xzsx_detect_tag-trackpanel-show{width:250px;height:200px;display:flex;flex-direction:column;justify-content:flex-start;position:absolute;background-color:white;box-shadow:0px 0px 4px #6a6767;user-select:none;-o-user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-o-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-moz-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-webkit-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);animation:showTrack 0.5s forwards;-o-animation:showTrack 0.5s forwards;-moz-animation:showTrack 0.5s forwards;-webkit-animation:showTrack 0.5s forwards;z-index:999999}
        @keyframes showTrack{from{clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%)}
        to{clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        }@-o-keyframes showTrack{from{-o-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%)}
        to{-o-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        }@-moz-keyframes showTrack{from{-moz-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%)}
        to{-moz-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        }@-webkit-keyframes showTrack{from{-webkit-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%)}
        to{-webkit-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        }.xzsx_detect_tag-medalwall-show{height:100px;width:fit-content;max-width:400px;display:flex;flex-direction:column;position:absolute;background-color:white;box-shadow:0px 0px 4px #6a6767;user-select:none;-o-user-select:none;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-weight:550;clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-o-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-moz-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);-webkit-clip-path:polygon(-5% -5%,-5% -5%,-5% 105%,-5% 105%);animation:showTrack 0.5s forwards;-o-animation:showTrack 0.5s forwards;-moz-animation:showTrack 0.5s forwards;-webkit-animation:showTrack 0.5s forwards;z-index:999999;overflow:auto}
        .xzsx_detect_tag-trackpanel-hide{width:250px;height:200px;display:flex;flex-direction:column;justify-content:flex-start;position:absolute;background-color:white;box-shadow:0px 0px 4px #6a6767;user-select:none;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-weight:550;clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-o-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-moz-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-webkit-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);animation:hideTrack 0.5s forwards;-o-animation:hideTrack 0.5s forwards;-moz-animation:hideTrack 0.5s forwards;-webkit-animation:hideTrack 0.5s forwards;z-index:999999;overflow:auto}
        @keyframes hideTrack{from{clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        to{clip-path:polygon(105% -5%,105% -5%,105% 105%,105% 105%)}
        }@-o-keyframes hideTrack{from{-o-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        to{-o-clip-path:polygon(105% -5%,105% -5%,105% 105%,105% 105%)}
        }@-moz-keyframes hideTrack{from{-moz-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        to{-moz-clip-path:polygon(105% -5%,105% -5%,105% 105%,105% 105%)}
        }@-webkit-keyframes hideTrack{from{-webkit-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%)}
        to{-webkit-clip-path:polygon(105% -5%,105% -5%,105% 105%,105% 105%)}
        }.xzsx_detect_tag-medalwall-hide{height:100px;width:fit-content;max-width:400px;display:flex;flex-direction:column;position:absolute;background-color:white;box-shadow:0px 0px 4px #6a6767;user-select:none;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑;font-weight:550;clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-o-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-moz-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);-webkit-clip-path:polygon(-5% -5%,105% -5%,105% 105%,-5% 105%);animation:hideTrack 0.5s forwards;-o-animation:hideTrack 0.5s forwards;-moz-animation:hideTrack 0.5s forwards;-webkit-animation:hideTrack 0.5s forwards;z-index:999999;overflow:auto}
        .xzsx_detect_tag-medalwall-title{display:inline-flex;align-items:center;height:24px;width:100%;padding-left:8px;padding-top:4px;padding-bottom:4px;color:#1890ff;font-size:18px;font-style:normal;font-weight:600;box-shadow:0px 0px 4px #ddd;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;-ms-text-overflow:ellipsis;cursor:pointer}
        .xzsx_detect_tag-medalwall-container{position:relative}
        .xzsx_detect_tag-trackpanel-content::-webkit-scrollbar{height:8px;width:8px}
        .xzsx_detect_tag-trackpanel-content::-webkit-scrollbar-thumb{background-color:rgb(80,130,220,1)}
        .xzsx_detect_tag-trackpanel-content::-webkit-scrollbar-thumb:hover{background-color:rgb(80,130,220,0.5)}
        .xzsx_detect_tag-trackpanel-content::-webkit-scrollbar-track-piece{background:transparent}
        #xzsx_medalwall::-webkit-scrollbar{height:8px;width:8px}
        #xzsx_medalwall::-webkit-scrollbar-thumb{background-color:rgb(80,130,220,1)}
        #xzsx_medalwall::-webkit-scrollbar-thumb:hover{background-color:rgb(80,130,220,0.5)}
        #xzsx_medalwall::-webkit-scrollbar-track-piece{background:transparent}
        .xzsx_detect_tag-trackpanel-title{display:flex;align-items:center;height:35px;padding-left:8px;padding-top:4px;padding-bottom:4px;color:#1890ff;font-size:18px;font-style:normal;font-weight:600;box-shadow:0px 0px 4px #ddd;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;-ms-text-overflow:ellipsis;cursor:pointer}
        .xzsx_detect_tag-trackpanel-content{height:200px;padding:8px;overflow:auto}
        .xzsx_detect_tag-trackpanel-texttitle{font-weight:600;font-size:20px;margin-bottom:4px}
        .xzsx_detect_tag-trackpanel-anti{margin-bottom:8px;color:red}
        .xzsx_detect_tag-trackpanel-fans{margin-bottom:8px;color:green}
        .xzsx_detect_tag-trackpanel-source{font-size:18px;color:rgba(22,51,194,0.821);font-weight:600}
        .xzsx_detect_tag-trackpanel-text{font-size:16px;color:rgb(64,63,63);font-weight:400;padding-left:4px;margin-top:4px;margin-bottom:4px;box-shadow:0 0 4px #ddd}
    `

    /** 成分标签相关css样式
     * @type { string }
     */
    const css_tag =
    `
        .tag_container{display:inline-flex;align-items:center;flex-wrap:wrap;position:relative;vertical-align:middle;overflow:hidden;padding:1px 0px 1px 0px;margin-left:4px;transform:translateX(-50px);-o-transform:translateX(-50px);-ms-transform:translateX(-50px);-moz-transform:translateX(-50px);-webkit-transform:translateX(-50px);animation:showtag 0.5s ease-out forwards;-o-animation:showtag 0.5s ease-out forwards;-moz-animation:showtag 0.5s ease-out forwards;-webkit-animation:showtag 0.5s ease-out forwards;opacity:0}
        @keyframes showtag{from{transform:translateX(-50px);opacity:0}
        to{transform:translateX(0px);opacity:1}
        }@-o-keyframes showtag{from{-o-transform:translateX(-50px);opacity:0}
        to{-o-transform:translateX(0px);opacity:1}
        }@-moz-keyframes showtag{from{-moz-transform:translateX(-50px);opacity:0}
        to{-moz-transform:translateX(0px);opacity:1}
        }@-webkit-keyframes showtag{from{-webkit-transform:translateX(-50px);opacity:0}
        to{-webkit-transform:translateX(0px);opacity:1}
        }.xzsx_detect_tag-medalwall-medalBtn{display:inline-flex;justify-content:center;align-items:center;height:100%;width:fit-content;margin-right:4px;box-shadow:0 0 6px #ddd;cursor:pointer}
        .xzsx_detect_tag-medalwall-medalBtn:hover{opacity:0.8}
        .xzsx_detect_tag{display:inline-flex;height:14px;line-height:14px;position:relative;box-sizing:content-box !important;padding:1px 2px 1px 14px;margin:1px 4px 1px 0;color:black;white-space:nowrap;font-family:"Microsoft YaHei","Microsoft Sans Serif","Microsoft SanSerf",微软雅黑 !important;font-size:14px;font-weight:600 !important;border-radius:6px 4px 4px 6px;box-shadow:0 0 6px #ddd;text-size-adjust:100%;-webkit-tap-highlight-color:transparent;overflow-wrap:break-word;cursor:pointer}
        .xzsx_detect_tag:hover{opacity:0.8}
        .xzsx_detect_tag::before{background:#fff;border-radius:10px;box-shadow:0 1px rgba(0,0,0,0.25) inset;content:'';height:6px;left:4px;position:absolute;width:6px;top:calc(50% - 3px)}
        .icon-expend{height:24px;transform:rotate(90deg);-o-transform:rotate(90deg);-moz-transform:rotate(90deg);-webkit-transform:rotate(90deg);cursor:pointer}
        .icon-expend:hover{opacity:0.8}
        .icon-deepcheck{display:none;height:18px;width:18px;margin-left:4px}
        .icon-deepcheck:hover{opacity:0.8}
        .icon-deepcheck-hide{display:unset;height:18px;width:18px;transform:scale(1);-o-transform:scale(1);-moz-transform:scale(1);-webkit-transform:scale(1);transition:all 0.2s;-o-transition:all 0.2s;-moz-transition:all 0.2s;-webkit-transition:all 0.2s;cursor:pointer;z-index:1}
        svg.check-container{background:transparent;position:absolute;height:18px;width:18px;left:0px}
        circle.check-circle{fill:transparent;stroke:rgb(42,226,223);stroke-width:1.5px;stroke-dasharray:50.3,50.3;stroke-dashoffset:50.3;transition:all 1s;-o-transition:all 1s;-moz-transition:all 1s;-webkit-transition:all 1s;transform-origin:center;-o-transform-origin:center;-moz-transform-origin:center;-webkit-transform-origin:center}
        circle:hover{stroke-dashoffset:0}
        .svg-expend{height:25px;width:25px}
        .svg-deepcehck{height:18px;width:18px;color:#9400D3}
    `

    style.innerHTML = css_panel + css_tag

    /** 设置面板
     * @type { HTMLDivElement }
     */
    const nav = document.createElement('div')

    nav.innerHTML =
    `
        <button class='nav-show'>
            配置
        </button>
        <div id='panel-animation' class='hide-animation'>
            <div class='navPanel-resetBtn' style='display:${navPanelVis ? '' : 'none'}'>
                <svg fill="#FFFFFF" t="1636097794549" class="resetBtn-icon" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5713">
                    <path d="M245.11,393.317c19.5,0,38.5-3.8,56.6-11.3c36.6-15.1,65-43.6,80.2-80.2s15.2-76.8,0-113.4
                            c-23-55.6-76.8-91.5-137-91.5c-19.5,0-38.5,3.8-56.6,11.3c-75.5,31.2-111.5,118.1-80.2,193.6
                            C131.11,357.317,184.91,393.317,245.11,393.317z M195.91,126.517c15.7-6.5,32.2-9.8,49-9.8c52.1,0,98.7,31.1,118.7,79.3
                            c13.1,31.7,13.1,66.6,0,98.2c-13.1,31.7-37.8,56.3-69.5,69.5c-15.7,6.5-32.2,9.8-49,9.8c-52.1,0-98.7-31.1-118.7-79.3
                            C99.31,228.817,130.51,153.517,195.91,126.517z"/>
                    <path d="M14.41,328.017c1.5,4,5.3,6.6,9.3,6.6c1.1,0,2.2-0.2,3.3-0.6c5.1-1.8,7.8-7.5,6-12.7
                            c-29.3-81.9-9.8-171.4,51-233.6c42-43,98.3-67.1,158.4-67.8c60-0.7,116.9,22,159.9,64l-25.3,0.3c-5.5,0.1-9.8,4.5-9.8,10
                            c0.1,5.4,4.5,9.8,9.9,9.8h0.1l49.2-0.6c2.6,0,5.1-1.1,7-3c1.8-1.9,2.8-4.4,2.8-7l-0.6-49.2c-0.1-5.5-4.5-10-10-9.8
                            c-5.5,0.1-9.8,4.5-9.8,10l0.3,25.3c-46.8-45.7-108.5-70.4-173.9-69.7c-65.4,0.9-126.7,27-172.4,73.8
                            c-32.7,33.5-55.1,75.4-64.6,121C-4.09,239.317-0.89,285.317,14.41,328.017z"/>
                    <path d="M406.01,402.417c-86.7,88.8-229.5,90.4-318.3,3.8l25.3-0.3c5.5-0.1,9.8-4.5,9.8-10
                    c-0.1-5.4-4.5-9.8-9.9-9.8h-0.1l-49.2,0.6c-5.5,0.1-9.8,4.5-9.8,10l0.6,49.2c0.1,5.4,4.5,9.8,9.9,9.8h0.1c5.5-0.1,9.8-4.5,9.8-10
                    l-0.3-25.3c47.6,46.4,109.3,69.6,171.1,69.6c63.7,0,127.3-24.6,175.2-73.6c32.7-33.5,55.1-75.4,64.6-121
                    c9.3-44.4,6.1-90.5-9.2-133.1c-1.8-5.1-7.5-7.8-12.7-6c-5.1,1.8-7.8,7.5-6,12.7C486.31,250.717,466.81,340.217,406.01,402.417z"/>
                </svg>
            </div>
            <div class='side-btn side-btn-mode' style='display:${navPanelVis ? '' : 'none'}'>${MODE}</div>
            <label for="file-upload" class='side-btn side-btn-import' style='display:${navPanelVis ? '' : 'none'}'>
                导入
            </label>
            <input id='file-upload' name='config-upload' type='file' accept='.json,.txt' style='display:none' />
            <div class='side-btn side-btn-export' style='display:${navPanelVis ? '' : 'none'}'>导出</div>
            <div class='nav-panel'>
                <div id='setting-panel' class='setting-show'>
                    <button id='DEL_STYLE' class='setting-btn' style="padding-left: 26px;">${DEL_STYLE}</button>
                    <button id='DET_BASE_MedalWall' class='setting-btn'>
                        <div class='statuslayout2'>
                            <div id='status_MedalWall' class='${DET_BASE['DET_BASE_MedalWall'] ? 'statusP' : 'statusE'}'></div>
                        </div>
                        粉丝牌
                    </button>
                    <button id='DET_BASE_FOLLOWINGS' class='setting-btn'>
                        <div class='statuslayout2'>
                            <div id='status_FOLLOWINGS' class='${DET_BASE['DET_BASE_FOLLOWINGS'] ? 'statusP' : 'statusE'}'></div>
                        </div>
                        关注列表
                    </button>
                    <button id='DET_BASE_VIDEOS' class='setting-btn'>
                        <div class='statuslayout2'>
                            <div id='status_VIDEOS' class='${DET_BASE['DET_BASE_VIDEOS'] ? 'statusP' : 'statusE'}'></div>
                        </div>
                        投稿列表
                    </button>
                    <button id='DET_BASE_DYNAMIC' class='setting-btn'>
                        <div class='statuslayout2'>
                            <div id='status_DYNAMIC' class='${DET_BASE['DET_BASE_DYNAMIC'] ? 'statusP' : 'statusE'}'></div>
                        </div>
                        动态内容
                    </button>
                    <button id='DET_BASE_COMMENT' class='setting-btn'>
                        <div class='statuslayout2'>
                            <div id='status_COMMENT' class='${DET_BASE['DET_BASE_COMMENT'] ? 'statusP' : 'statusE'}'></div>
                        </div>
                        评论内容
                    </button>
                    <div id='TAG_MAX_LENGTH' class='setting-text'>
                        收纳阈值
                        <span>${TAG_MAX_LENGTH}</span>
                        <input id='xzsx_length' type="range" min="1" max="50" step="1" value="${TAG_MAX_LENGTH}"/>
                    </div>
                    <div id='INTERVAL' class='setting-text'>
                        渲染间隔
                        <span>${INTERVAL}</span>
                        <input id='xzsx_interval' type="range" min="0" max="5000" step="250" value="${INTERVAL}"/>
                    </div>
                    <div id='LIMIT_EVENT' class='setting-text'>
                        事件节流
                        <span>${LIMIT_EVENT}</span>
                        <input id='xzsx_limitevent' type="range" min="1" max="25" step="1" value="${LIMIT_EVENT}"/>
                    </div>
                </div>
                <div class='nav-tabs'>
                    <button class='nav-tabs-btn1'>
                        检测成分
                        <div id='status1' class='statuslayout'>
                            <div id='status1_circleE' class='statusE' style='display:${DET ? 'none' : ''}'></div>
                            <div id='status1_circleP' class='statusP' style='display:${DET ? '' : 'none'}'></div>
                            <div id='status1_effect' class='statusPcircle' style='display:${DET ? '' : 'none'}'></div>
                        </div>
                    </button>
                    <div class='changed-signel1' style='display:none'></div>
                    <div id='process1' class='process' style="left:0%;"></div>
                    <button class='nav-tabs-btn2'>
                        自动屏蔽
                        <div id='status2' class='statuslayout'>
                            <div id='status2_circleE' class='statusE' style='display:${DEL ? 'none' : ''}'></div>
                            <div id='status2_circleP' class='statusP' style='display:${DEL ? '' : 'none'}'></div>
                            <div id='status2_effect' class='statusPcircle' style='display:${DEL ? '' : 'none'}'></div>
                        </div>
                    </button>
                    <div class='changed-signel2' style='display:none'></div>
                    <div id='process2' class='process' style="left:50%;"></div>
                </div>
                <div class='addrule_form'>
                    <div class='addrule_item1'>
                        <input id='tagname' type="text" class='tagname_input' placeholder='标签名' />
                        <input id="tagcolor" type="color" class='tagcolor_input' value='#008000' />
                    </div>
                    <div class='xzsx_detect_tagsample_container'>
                        <div class='xzsx_detect_tagsample'></div>
                    </div>
                    <div id='rule_keywords' class='rule_keywords'>
                        <div class='add_items'>
                            <input id='keyword' type="text" class='tagkeyword_input' placeholder='粉丝关键词' />
                            <div id='keywords-add' class='add_icon'>+</div>
                        </div>
                    </div>
                    <div id='rule_antikeywords' class='rule_keywords'>
                        <div class='add_items'>
                            <input id='antikeyword' type="text" class='tagkeyword_input' placeholder='黑子关键词' />
                            <div id='antikeywords-add' class='add_icon'>+</div>
                        </div>
                    </div>
                </div>
                <div class='nav-list'>
                    <div class='rule-item-detect-add'>+</div>
                    <div class='rule-item-blacklist-add'> 
                        <input type="text" placeholder='关键词' class='rule-item-blacklist-add-input' style="display:unset"/>
                        <select name='rule-item-blacklist-select' class='rule-item-blacklist-select' style="display:none" required></select>
                        <div class='rule-item-blacklist-base'>基于昵称</div>
                        <div id='blacklist-add' class='rule-item-blacklist-addicon'>+</div>
                    </div>
                </div>
                <div class='nav-footer'>
                    <div class='applysuccess' style="display:none">
                        <svg fill="white" width="24px" height="24px" viewBox="0 0 36 36" version="1.1">
                            <path d="M13.72,27.69,3.29,17.27a1,1,0,0,1,1.41-1.41l9,9L31.29,7.29a1,1,0,0,1,1.41,1.41Z"></path>
                            <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
                        </svg>
                    </div>
                    <div id='footer-process' class='process'></div>
                    <button class='confirm_btn'>应&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用</button>
                    <button class='add_btn' style="display:none">新&nbsp;&nbsp;增&nbsp;&nbsp;规&nbsp;&nbsp;则</button>
                    <button class='alter_btn' style="display:none">修&nbsp;&nbsp;改&nbsp;&nbsp;规&nbsp;&nbsp;则</button>
                </div>
            </div>
        </div>
        <div id='xzsx_trackpanel' class='xzsx_detect_tag-trackpanel-hide' style='display:none'></div>
        <div id='xzsx_medalwall' class='xzsx_detect_tag-medalwall-hide'></div>
    `

    document.querySelector('head').appendChild(style)

    document.querySelector('body').appendChild(nav)

    /** <===================================================================================获取实例==========================================================================================>
     * @type { Element }
     */

    let
        /** 面板显示/隐藏动画 */
        animation = document.querySelector('#panel-animation'),

        /** 侧边悬浮按钮 */
        navBtn = document.querySelector('.nav-show'),

        /** 设置面板 */
        navPanel = document.querySelector('.nav-panel'),

        /** 成分溯源面板 */
        trackPanel = document.querySelector('#xzsx_trackpanel'),

        /** 勋章墙 */
        medalWall = document.querySelector('#xzsx_medalwall'),

        /** 侧边悬浮按钮 */
        resetBtn = document.querySelector('.navPanel-resetBtn'),

        /** 切换模式按钮 */
        navMode = document.querySelector('.side-btn.side-btn-mode'),

        /** 导入按钮 */
        importBtn = document.querySelector('.side-btn.side-btn-import'),

        /** 上传文件 */
        uploader = document.querySelector('#file-upload'),

        /** 侧边悬浮按钮 */
        exportBtn = document.querySelector('.side-btn.side-btn-export'),

        /** 检测成分按钮 */
        navTabsBtn1 = document.querySelector('.nav-tabs-btn1'),

        /** 自动屏蔽按钮 */
        navTabsBtn2 = document.querySelector('.nav-tabs-btn2'),

        /** 设置面板 */
        settingPanel = document.querySelector('#setting-panel'),

        /** 屏蔽样式按钮 */
        DEL_STYLE_BTN = document.querySelector('#DEL_STYLE'),

        /**检测依据-粉丝牌 */
        DET_BASE_MedalWall = document.querySelector('#DET_BASE_MedalWall'),

        /** 检测依据-关注列表 */
        DET_BASE_FOLLOWINGS = document.querySelector('#DET_BASE_FOLLOWINGS'),

        /** 检测依据-投稿列表 */
        DET_BASE_VIDEOS = document.querySelector('#DET_BASE_VIDEOS'),

        /** 检测依据-动态空间 */
        DET_BASE_DYNAMIC = document.querySelector('#DET_BASE_DYNAMIC'),

        /** 检测依据-评论文本 */
        DET_BASE_COMMENT = document.querySelector('#DET_BASE_COMMENT'),

        /** 标签最大长度文本 */
        TAG_MAX_LENGTH_TEXT = document.querySelector('#TAG_MAX_LENGTH'),

        /** 标签最大长度滑动条 */
        TAG_MAX_LENGTH_SLIDER = document.querySelector('#xzsx_length'),

        /** 渲染间隔文本 */
        INTERVAL_TEXT = document.querySelector('#INTERVAL'),

        /** 渲染间隔滑动条 */
        INTERVAL_SLIDER = document.querySelector('#xzsx_interval'),

        /** 事件节流文本 */
        LIMIT_EVENT_TEXT = document.querySelector('#LIMIT_EVENT'),

        /** 事件节流滑动条 */
        LIMIT_EVENT_SLIDER = document.querySelector('#xzsx_limitevent'),

        /** 检测成分启用状态标识1 */
        status1_circleP = document.querySelector('#status1_circleP'),

        /** 检测成分启用状态标识2 */
        status1_circleE = document.querySelector('#status1_circleE'),

        /** 检测成分启用状态标识3 */
        status1_effect = document.querySelector('#status1_effect'),

        /** 自动屏蔽启用状态标识1 */
        status2_circleP = document.querySelector('#status2_circleP'),

        /** 自动屏蔽启用状态标识2 */
        status2_circleE = document.querySelector('#status2_circleE'),

        /** 自动屏蔽启用状态标识3 */
        status2_effect = document.querySelector('#status2_effect'),

        /** 检测依据启用状态标识-粉丝牌 */
        status_MedalWall = document.querySelector('#status_MedalWall'),

        /** 检测依据启用状态标识-关注列表 */
        status_FOLLOWINGS = document.querySelector('#status_FOLLOWINGS'),

        /** 检测依据启用状态标识-投稿列表 */
        status_VIDEOS = document.querySelector('#status_VIDEOS'),

        /** 检测依据启用状态标识-动态内容(), */
        status_DYNAMIC = document.querySelector('#status_DYNAMIC'),

        /** 检测依据启用状态标识-评论内容 */
        status_COMMENT = document.querySelector('#status_COMMENT'),

        /** 检测成分长按进度条 */
        process1 = document.querySelector('#process1'),

        /** 自动屏蔽长按进度条 */
        process2 = document.querySelector('#process2'),

        /** 检测成分修改标识 */
        changedSignel1 = document.querySelector('.changed-signel1'),

        /** 自动屏蔽修改标识 */
        changedSignel2 = document.querySelector('.changed-signel2'),

        /** 规则列表 */
        navRuleList = document.querySelector('.nav-list'),

        /** 检测成分添加/修改规则界面 */
        addRuleForm = document.querySelector('.addrule_form'),

        /** 检测成分添加/修改规则界面 添加粉丝关键词右侧<+>号按钮 */
        addKeyWordBtn = document.querySelector('#keywords-add'),

        /** 检测成分添加/修改规则界面 添加黑子关键词右侧<+>号按钮 */
        addAntiKeyWordBtn = document.querySelector('#antikeywords-add'),

        /** 检测成分添加/修改规则界面 添加粉丝关键词列表 */
        keywords = document.querySelector('#rule_keywords'),

        /** 检测成分添加/修改规则界面 添加黑子关键词列表 */
        antikeywords = document.querySelector('#rule_antikeywords'),

        /** 检测成分添加/修改规则界面 标签名 */
        tagname = document.querySelector('#tagname'),

        /** 检测成分添加/修改规则界面 标签颜色 */
        tagcolor = document.querySelector('#tagcolor'),

        /** 检测成分添加/修改规则界面 标签样式预览 */
        tagsample = document.querySelector('.xzsx_detect_tagsample'),

        /** 检测成分添加/修改规则界面 添加粉丝关键词左侧文字输入框 */
        newKeyWord = document.querySelector('#keyword'),

        /** 检测成分添加/修改规则界面 添加黑子关键词左侧文字输入框 */
        newAntiKeyWord = document.querySelector('#antikeyword'),

        /** 检测成分规则列表 添加按钮 */
        detectAdd_btn = document.querySelector('.rule-item-detect-add'),

        /** 黑名单规则列表 添加关键词容器 */
        blacklistAdd_item = document.querySelector('.rule-item-blacklist-add'),

        /** 黑名单规则列表 添加关键词选择框 */
        blacklistAdd_select = document.querySelector('.rule-item-blacklist-select'),

        /** 黑名单规则列表 添加关键词右侧<+>号按钮 */
        blacklistAdd_btn = document.querySelector('#blacklist-add'),

        /** 黑名单规则列表 添加关键词屏蔽依据 */
        blacklistAdd_base = document.querySelector('.rule-item-blacklist-base'),

        /** 黑名单规则列表 添加关键词左侧文字输入框 */
        blacklistAdd_keyword = document.querySelector('.rule-item-blacklist-add-input'),

        /** 页脚 进度条 */
        footerProcess = document.querySelector('#footer-process'),

        /** 页脚 应用按钮 */
        confirm_btn = document.querySelector('.confirm_btn'),

        /** 页脚 应用成功动画 */
        confirm_success = document.querySelector('.applysuccess'),

        /** 页脚 新增规则按钮 */
        add_btn = document.querySelector('.add_btn'),

        /** 页脚 修改规则按钮 */
        alter_btn = document.querySelector('.alter_btn')

    /** 批量监听下拉设置栏DOM元素的变化并绑定数据
     * @type { () => void }
     */
    const batchWatch = () => {
        /**
         * @type { { watchObj: object, watchKey: string, target: { ele: Element | null, key: string, callback: () => string | number  }[] }
         */
        const watchParams = [
            { watchObj: settingTemp, watchKey: 'DEL_STYLE', target: { ele: DEL_STYLE_BTN, key: 'textContent', callback: (newValue) => newValue } },
            { watchObj: settingTemp, watchKey: 'TAG_MAX_LENGTH', target: { ele: TAG_MAX_LENGTH_TEXT.childNodes[1], key: 'textContent', callback: (newValue) => newValue } },
            { watchObj: settingTemp, watchKey: 'INTERVAL', target: { ele: INTERVAL_TEXT.childNodes[1], key: 'textContent', callback: (newValue) => newValue } },
            { watchObj: settingTemp, watchKey: 'LIMIT_EVENT', target: { ele: LIMIT_EVENT_TEXT.childNodes[1], key: 'textContent', callback: (newValue) => newValue } },
            { watchObj: settingTemp, watchKey: 'DET_BASE_MedalWall', target: { ele: status_MedalWall, key: 'className', callback: (newValue) => newValue ? 'statusP' : 'statusE' } },
            { watchObj: settingTemp, watchKey: 'DET_BASE_FOLLOWINGS', target: { ele: status_FOLLOWINGS, key: 'className', callback: (newValue) => newValue ? 'statusP' : 'statusE' } },
            { watchObj: settingTemp, watchKey: 'DET_BASE_VIDEOS', target: { ele: status_VIDEOS, key: 'className', callback: (newValue) => newValue ? 'statusP' : 'statusE' } },
            { watchObj: settingTemp, watchKey: 'DET_BASE_DYNAMIC', target: { ele: status_DYNAMIC, key: 'className', callback: (newValue) => newValue ? 'statusP' : 'statusE' } },
            { watchObj: settingTemp, watchKey: 'DET_BASE_COMMENT', target: { ele: status_COMMENT, key: 'className', callback: (newValue) => newValue ? 'statusP' : 'statusE' } },
        ]

        watchParams.forEach((v) => watch(v.watchObj, v.watchKey, (newValue) => v.target.ele[v.target.key] = v.target.callback(newValue)))
    }

    /** 获取集合1相对于集合2的差集
     * @param { Set } set1 集合1
     * @param { Set } set2 集合2
     * @returns { Set } 差集结果
     */
    const _difference = (set1, set2) => new Set([...set1].filter((v) => !set2.has(v)))

    /** 重置DOM状态
     * @type { () => void }
     */
    const resetAll = () => {
        navMode.textContent = MODE
        status1_circleP.style.display = DET ? '' : 'none'
        status1_circleE.style.display = DET ? 'none' : ''
        status1_effect.style.display = DET ? '' : 'none'
        process1.style.visibility = 'hidden'
        status2_circleP.style.display = DEL ? '' : 'none'
        status2_circleE.style.display = DEL ? 'none' : ''
        status2_effect.style.display = DEL ? '' : 'none'
        process2.style.visibility = 'hidden'
        DEL_STYLE_BTN.textContent = DEL_STYLE
        TAG_MAX_LENGTH_SLIDER.value = parseInt(TAG_MAX_LENGTH)
        INTERVAL_SLIDER.value = parseInt(INTERVAL)
        LIMIT_EVENT_SLIDER.value = parseInt(LIMIT_EVENT)
        TAG_MAX_LENGTH_TEXT.childNodes[1].textContent = parseInt(TAG_MAX_LENGTH)
        INTERVAL_TEXT.childNodes[1].textContent = parseInt(INTERVAL)
        LIMIT_EVENT_TEXT.childNodes[1].textContent = parseInt(LIMIT_EVENT)
        status_MedalWall.className = API_OVERLOAD['DET_BASE_MedalWall'].state ? 'statusBAN' : DET_BASE['DET_BASE_MedalWall'] ? 'statusP' : 'statusE'
        status_FOLLOWINGS.className = API_OVERLOAD['DET_BASE_FOLLOWINGS'].state ? 'statusBAN' : DET_BASE['DET_BASE_FOLLOWINGS'] ? 'statusP' : 'statusE'
        status_VIDEOS.className = API_OVERLOAD['DET_BASE_VIDEOS'].state ? 'statusBAN' : DET_BASE['DET_BASE_VIDEOS'] ? 'statusP' : 'statusE'
        status_DYNAMIC.className = API_OVERLOAD['DET_BASE_DYNAMIC'].state ? 'statusBAN' : DET_BASE['DET_BASE_DYNAMIC'] ? 'statusP' : 'statusE'
        status_COMMENT.className = DET_BASE['DET_BASE_COMMENT'] ? 'statusP' : 'statusE'
    }

    /** <===================================================================================事件绑定==========================================================================================> */

    /** 阻止点击事件冒泡 */
    [navPanel, trackPanel, medalWall, importBtn, uploader].forEach(ele => ele.onclick = e => e.stopPropagation())

    /** 控制面板可见性 */
    navBtn.onclick = (e) => {
        e.stopPropagation()
        animationState = !animationState
        animation.className = animationState ? 'show-animation' : 'hide-animation'
        clearTimeout(timerAnimaltion)
        if (navPanelVis && !animationState) {
            timerAnimaltion = setTimeout(() => {
                navPanelVis = false
                navPanel.style.display = 'none'
                resetBtn.style.display = 'none'
                navMode.style.display = 'none'
                importBtn.style.display = 'none'
                exportBtn.style.display = 'none'
                blacklistAdd_keyword.value = ''
                blacklistAdd_select.style.display = 'none'
                blacklistAdd_keyword.style.display = 'unset'
                blacklistAdd_base.textContent = '基于昵称'
            }, 500)
        } else {
            [rulesApply, rules] = initRules()
            resetAll()
            renderMainPanel()
            navPanelVis = true, ctab = true, ckey = undefined, newRuleKeysSet.clear(), deleteRuleKeysSet.clear(), newAntiRuleSets.clear(), deleteAntiRuleSets.clear(), settingTemp = {}

            batchWatch()

            navPanel.style.display = 'flex'
            resetBtn.style.display = 'flex'
            navMode.style.display = 'flex'
            importBtn.style.display = 'flex'
            exportBtn.style.display = 'flex'
            changedSignel1.style.display = 'none'
            changedSignel2.style.display = 'none'
            navTabsBtn1.click()
        }
    }

    /** 设置面板鼠标移开相关操作 */
    navPanel.onmouseleave = () => { settingPanel.style.height = '0px' }

    /** 点击空白处相关操作 */
    document.addEventListener('click', () => { trackPanel.className = 'xzsx_detect_tag-trackpanel-hide'; medalWall.className = 'xzsx_detect_tag-medalwall-hide'; medalWall.setAttribute('key', null) })

    /** 执行显示隐藏面板各一次 */
    const [_dreset, __] = _throttle(() => { navBtn.click() }, 500, { leading: true })

    /** 恢复设置 */
    resetBtn.onclick = (e) => { e.stopPropagation(); _dreset() }

    /** 切换模式 */
    navMode.onclick = (e) => {
        e.stopPropagation()
        let MODE_TEMP = settingTemp.hasOwnProperty('MODE') ? settingTemp['MODE'] === '自动' ? '静默' : '自动' : MODE === '自动' ? '静默' : '自动'
        navMode.textContent = MODE_TEMP
        settingTemp['MODE'] = MODE_TEMP
    }

    /** 导入 */
    uploader.onchange = async (e) => {
        e.stopPropagation()
        try {
            let conf = JSON.parse(await e.target.files[0].text())
            if (Object.keys(conf).length > 0) {
                GM_setValue('xzsx_bilibili_detector', JSON.stringify({ blackList: conf.blackList, detect: conf.detect }))
                GM_setValue('xzsx_bilibili_detector_state', JSON.stringify(conf.state))
                resetBtn.click()
                e.target.value = ''
            }
        } catch (error) {
            console.log(error)
        }
    }

    /** 导出 */
    exportBtn.onclick = (e) => {
        e.stopPropagation()
        let temp = {}, state = {
            MODE, DET, DEL, DEL_STYLE, TAG_MAX_LENGTH, INTERVAL, LIMIT_EVENT,
            DET_BASE_MedalWall: DET_BASE['DET_BASE_MedalWall'],
            DET_BASE_FOLLOWINGS: DET_BASE['DET_BASE_FOLLOWINGS'],
            DET_BASE_VIDEOS: DET_BASE['DET_BASE_VIDEOS'],
            DET_BASE_DYNAMIC: DET_BASE['DET_BASE_DYNAMIC'],
            DET_BASE_COMMENT: DET_BASE['DET_BASE_COMMENT']
        }

        Object.keys(rulesApply.detect).forEach((key) => {
            temp[key] = { 'color': rulesApply.detect[key].color, 'keywords': [...rulesApply.detect[key].keywords], 'antikeywords': [...rulesApply.detect[key].antikeywords] }
        })

        let json = JSON.stringify({ blackList: rulesApply.blackList, detect: temp, state })
        let blob = new Blob([json], { type: "octet/stream" })
        let url = window.URL.createObjectURL(blob)

        let a = document.createElement("a");
        a.href = url
        a.download = 'xzsx_bilibili_detector.json'
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    /** 检测成分按钮单击相关操作 */
    navTabsBtn1.onclick = () => {
        ctab = true
        addRuleForm.style.display = 'none'
        detectAdd_btn.style.display = ''
        blacklistAdd_item.style.display = 'none'
        confirm_btn.style.display = ''
        add_btn.style.display = 'none'
        alter_btn.style.display = 'none'
        navTabsBtn1.style.filter = 'brightness(100%)'
        navTabsBtn2.style.filter = 'brightness(50%)'
        newRuleKeysSet.clear()
        deleteRuleKeysSet.clear()
        newAntiRuleSets.clear()
        deleteAntiRuleSets.clear()
        renderMainPanel()
    }

    /** 检测成分按钮长按相关操作 */
    navTabsBtn1.onmousedown = () => {
        if (ctab) {
            process1.style.visibility = 'visible'
            process1.style.width = '50%'
            timerTab1 = setTimeout(() => {
                let temp = settingTemp.hasOwnProperty('DET') ? !settingTemp['DET'] : !DET
                settingTemp['DET'] = temp
                changedSignel1.style.display = ''
                status1_circleP.style.display = temp ? '' : 'none'
                status1_circleE.style.display = temp ? 'none' : ''
                status1_effect.style.display = 'none'
                process1.style.visibility = 'hidden'
                process1.style.width = '0%'
            }, 500)
        }
    }

    /** 检测成分按钮松开相关操作 */
    navTabsBtn1.onmouseup = () => {
        if (ctab) {
            process1.style.width = '0%'
            clearTimeout(timerTab1)
        }
    }

    /** 检测成分按钮离开相关操作 */
    navTabsBtn1.onmouseout = () => {
        if (ctab) {
            process1.style.width = '0%'
            clearTimeout(timerTab1)
        }
    }

    /** 检测成分按钮标悬浮相关操作 */
    navTabsBtn1.onmouseenter = () => { settingPanel.style.height = '0px' }

    /** 自动屏蔽按钮单击相关操作 */
    navTabsBtn2.onclick = () => {
        ctab = false
        addRuleForm.style.display = 'none'
        detectAdd_btn.style.display = 'none'
        blacklistAdd_item.style.display = 'flex'
        confirm_btn.style.display = ''
        add_btn.style.display = 'none'
        alter_btn.style.display = 'none'
        navTabsBtn1.style.filter = 'brightness(50%)'
        navTabsBtn2.style.filter = 'brightness(100%)'
        newRuleKeysSet.clear()
        deleteRuleKeysSet.clear()
        newAntiRuleSets.clear()
        deleteAntiRuleSets.clear()
        renderMainPanel()
    }

    /** 自动屏蔽按钮鼠标聚焦相关操作 */
    navTabsBtn2.onmouseenter = () => { if (!ctab) settingPanel.style.height = '378px' }

    /** 设置下拉栏按钮鼠标离开相关操作 */
    settingPanel.onmouseleave = () => { settingPanel.style.height = '0px' }

    /** 规则列表鼠标悬浮相关操作 */
    navRuleList.onmouseenter = () => { settingPanel.style.height = '0px' }

    /** 修改屏蔽样式 */
    DEL_STYLE_BTN.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DEL_STYLE'] = copy.hasOwnProperty('DEL_STYLE') ? copy['DEL_STYLE'] === '消息屏蔽' ? '完全删除' : '消息屏蔽' : DEL_STYLE === '消息屏蔽' ? '完全删除' : '消息屏蔽'
    }

    /** 修改标签收纳阈值 */
    TAG_MAX_LENGTH_SLIDER.onchange = (e) => settingTemp['TAG_MAX_LENGTH'] = parseInt(e.target.value)

    /** 修改渲染间隔(毫秒) */
    INTERVAL_SLIDER.onchange = (e) => settingTemp['INTERVAL'] = parseInt(e.target.value)

    /** 事件节流(每秒) */
    LIMIT_EVENT_SLIDER.onchange = (e) => settingTemp['LIMIT_EVENT'] = parseInt(e.target.value)

    /** 检测依据-粉丝牌 */
    DET_BASE_MedalWall.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DET_BASE_MedalWall'] = copy.hasOwnProperty('DET_BASE_MedalWall') ? !copy['DET_BASE_MedalWall'] : !DET_BASE['DET_BASE_MedalWall']
    }

    /** 检测依据-关注列表 */
    DET_BASE_FOLLOWINGS.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DET_BASE_FOLLOWINGS'] = copy.hasOwnProperty('DET_BASE_FOLLOWINGS') ? !copy['DET_BASE_FOLLOWINGS'] : !DET_BASE['DET_BASE_FOLLOWINGS']
    }

    /** 检测依据-投稿列表 */
    DET_BASE_VIDEOS.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DET_BASE_VIDEOS'] = copy.hasOwnProperty('DET_BASE_VIDEOS') ? !copy['DET_BASE_VIDEOS'] : !DET_BASE['DET_BASE_VIDEOS']
    }

    /** 检测依据-动态空间 */
    DET_BASE_DYNAMIC.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DET_BASE_DYNAMIC'] = copy.hasOwnProperty('DET_BASE_DYNAMIC') ? !copy['DET_BASE_DYNAMIC'] : !DET_BASE['DET_BASE_DYNAMIC']
    }

    /** 检测依据-评论文本 */
    DET_BASE_COMMENT.onclick = () => {
        let copy = JSON.parse(JSON.stringify(settingTemp))
        settingTemp['DET_BASE_COMMENT'] = copy.hasOwnProperty('DET_BASE_COMMENT') ? !copy['DET_BASE_COMMENT'] : !DET_BASE['DET_BASE_COMMENT']
    }

    /** 自动屏蔽按钮长按相关操作 */
    navTabsBtn2.onmousedown = () => {
        if (!ctab) {
            process2.style.visibility = 'visible'
            process2.style.width = '50%'
            timerTab2 = setTimeout(() => {
                let temp = settingTemp.hasOwnProperty('DEL') ? !settingTemp['DEL'] : !DEL
                settingTemp['DEL'] = temp
                changedSignel2.style.display = ''
                status2_circleP.style.display = temp ? '' : 'none'
                status2_circleE.style.display = temp ? 'none' : ''
                status2_effect.style.display = 'none'
                process2.style.visibility = 'hidden'
                process2.style.width = '0%'
            }, 500)
        }
    }

    /** 自动屏蔽按钮松开相关操作 */
    navTabsBtn2.onmouseup = () => {
        if (!ctab) {
            process2.style.width = '0%'
            clearTimeout(timerTab2)
        }
    }

    /** 自动屏蔽按钮离开相关操作 */
    navTabsBtn2.onmouseout = () => {
        if (!ctab) {
            process2.style.width = '0%'
            clearTimeout(timerTab2)
        }
    }

    /** 检测成分添加规则按钮相关操作 */
    detectAdd_btn.onclick = () => {
        add_btn.style.display = ''
        alter_btn.style.display = 'none'
        confirm_btn.style.display = 'none'
        renderEditPanel(undefined)
    }

    /** 自动屏蔽添加规则按钮相关操作 */
    blacklistAdd_btn.onclick = () => {
        if (blacklistAdd_base.textContent === '基于成分' && blacklistAdd_select.value.trim().length > 0 && !rules.blackList.hasOwnProperty(blacklistAdd_select.value)) {
            changedSignel2.style.display = ''
            rules.blackList[blacklistAdd_select.value.trim()] = blacklistAdd_base.textContent
            blacklistAdd_select.querySelector(`option[value="${blacklistAdd_select.value.trim()}"]`).remove()
            renderMainPanel()
        } else if (blacklistAdd_base.textContent === '基于昵称') {
            let keyword = blacklistAdd_keyword.value?.trim() ?? ''
            if (!rules.blackList.hasOwnProperty(keyword) && keyword.length > 0) {
                changedSignel2.style.display = ''
                rules.blackList[keyword] = blacklistAdd_base.textContent
                blacklistAdd_keyword.value = ''
                renderMainPanel()
            }
        }
    }

    /** 自动屏蔽屏蔽依据按钮相关操作 */
    blacklistAdd_base.onclick = () => {
        blacklistAdd_base.textContent = blacklistAdd_base.textContent === '基于昵称' ? '基于成分' : '基于昵称'
        if (blacklistAdd_base.textContent === '基于成分') {
            let detectListKeys = Object.keys(rules.detect), blackListKeys = Object.keys(rules.blackList), htmlStr = ''
            detectListKeys.filter((key) => !blackListKeys.includes(key)).forEach((v) => htmlStr += `<option value='${v.trim()}'>${v.trim()}</option>`)
            blacklistAdd_select.innerHTML = htmlStr
            blacklistAdd_select.style.display = 'unset'
            blacklistAdd_keyword.style.display = 'none'
        } else if (blacklistAdd_base.textContent === '基于昵称') {
            blacklistAdd_select.style.display = 'none'
            blacklistAdd_keyword.style.display = 'unset'
        }
    }

    /** 黑子关键词输入框回车直接触发添加 */
    blacklistAdd_keyword.onkeydown = (e) => { e.keyCode === 13 && blacklistAdd_btn.click() }

    /** 检测成分添加/修改页面 拾色器相关操作 */
    tagcolor.onchange = (e) => {
        tagname.style.color = e.target.value
        changedSignel1.style.display = ''
        tagsample.style.color = getContrastColor(e.target.value)
        tagsample.style.backgroundColor = e.target.value
        tagsample.style.borderColor = e.target.value + '80'
        tagsample.style.backgroundImage = `linear-gradient(45deg,  ${e.target.value}, ${e.target.value + '80'})`
    }

    /** 检测成分添加/修改页面 标签名相关操作 */
    tagname.onchange = (e) => {
        changedSignel1.style.display = ''
        tagname.title = e.target.value
        tagsample.title = e.target.value
        tagsample.textContent = e.target.value
    }

    /** 检测成分添加/修改页面 添加粉丝关键词按钮<+>相关操作 */
    addKeyWordBtn.onclick = () => {
        let keyword = newKeyWord.value?.trim() ?? '', exist = false
        for (const dom of keywords.querySelectorAll('.keyword')) {
            if (dom.firstChild.textContent === keyword) {
                exist = true
                break
            }
        }

        if (keyword.length > 0 && !exist) {
            newRuleKeysSet.add(keyword)
            newKeyWord.value = ''
            changedSignel1.style.display = ''
            let keywordDom = document.createElement('div')
            keywordDom.className = 'keyword'
            keywordDom.style.color = 'green'
            keywordDom.innerHTML = `${keyword}<div class="keyword_delete">x</div>`
            keywordDom.children[0].onclick = () => {
                newRuleKeysSet.has(keyword) ? newRuleKeysSet.delete(keyword) : deleteRuleKeysSet.add(keyword)
                keywordDom.remove(keywordDom.children[0])
                changedSignel1.style.display = ''
            }
            keywords.insertBefore(keywordDom, keywords.lastChild.previousSibling)
        }
    }

    /** 粉丝关键词输入框回车直接触发添加 */
    newKeyWord.onkeydown = (e) => { e.keyCode === 13 && addKeyWordBtn.click() }

    /** 检测成分添加/修改页面 添加黑子关键词按钮<+>相关操作 */
    addAntiKeyWordBtn.onclick = () => {
        let keyword = newAntiKeyWord.value?.trim() ?? '', exist = false
        for (const dom of antikeywords.querySelectorAll('.keyword')) {
            if (dom.firstChild.textContent === keyword) {
                exist = true
                break
            }
        }

        if (keyword.length > 0 && !exist) {
            newAntiRuleSets.add(keyword)
            newAntiKeyWord.value = ''
            changedSignel1.style.display = ''
            let keywordDom = document.createElement('div')
            keywordDom.className = 'keyword'
            keywordDom.style.color = 'rgb(243,28,28)'
            keywordDom.innerHTML = `${keyword}<div class="keyword_delete">x</div>`
            keywordDom.children[0].onclick = () => {
                newAntiRuleSets.has(keyword) ? newAntiRuleSets.delete(keyword) : deleteAntiRuleSets.add(keyword)
                keywordDom.remove(keywordDom.children[0])
                changedSignel1.style.display = ''
            }
            antikeywords.insertBefore(keywordDom, antikeywords.lastChild.previousSibling)
        }
    }

    /** 黑子关键词输入框回车直接触发添加 */
    newAntiKeyWord.onkeydown = (e) => { e.keyCode === 13 && addAntiKeyWordBtn.click() }

    /** 页脚应用按钮长按相关操作 */
    confirm_btn.onmousedown = async () => {
        clearTimeout(timerFoot)
        clearTimeout(timerFoot2)
        footerProcess.style.visibility = 'visible'
        footerProcess.style.width = '100%'
        timerFoot = setTimeout(async () => {
            let curDocument = domain === 'live.bilibili.com' ? ciframe !== undefined ? ciframe.contentWindow.document : document : document
            curDocument.querySelectorAll('.tag_container').forEach(tag => tag.remove())

            userTags = {}
            userTagsHash = {}
            userBlackList.clear()
            uidset.clear()
            changedSignel1.style.display = 'none'
            changedSignel2.style.display = 'none'
            footerProcess.style.visibility = 'hidden'
            footerProcess.style.width = '0%'
            blacklistAdd_keyword.value = ''
            trackPanel.className = 'xzsx_detect_tag-trackpanel-hide'
            medalWall.className = 'xzsx_detect_tag-trackpanel-hide'
            medalWall.setAttribute('key', null)

            let settingTempCopy = JSON.parse(JSON.stringify(settingTemp))
            settingTemp = {}
            if (settingTempCopy.hasOwnProperty('MODE')) MODE = settingTempCopy['MODE']
            if (settingTempCopy.hasOwnProperty('DET')) DET = settingTempCopy['DET']
            if (settingTempCopy.hasOwnProperty('DEL')) DEL = settingTempCopy['DEL']
            if (DET) status1_effect.style.display = ''
            if (DEL) status2_effect.style.display = ''
            if (settingTempCopy.hasOwnProperty('DEL_STYLE')) DEL_STYLE = settingTempCopy['DEL_STYLE']
            if (settingTempCopy.hasOwnProperty('TAG_MAX_LENGTH')) TAG_MAX_LENGTH = settingTempCopy['TAG_MAX_LENGTH']
            if (settingTempCopy.hasOwnProperty('INTERVAL')) INTERVAL = settingTempCopy['INTERVAL']
            if (settingTempCopy.hasOwnProperty('LIMIT_EVENT')) LIMIT_EVENT = settingTempCopy['LIMIT_EVENT']
            if (settingTempCopy.hasOwnProperty('DET_BASE_MedalWall')) DET_BASE['DET_BASE_MedalWall'] = settingTempCopy['DET_BASE_MedalWall']; if (DET_BASE['DET_BASE_MedalWall']) recoverAPI('DET_BASE_MedalWall')
            if (settingTempCopy.hasOwnProperty('DET_BASE_FOLLOWINGS')) DET_BASE['DET_BASE_FOLLOWINGS'] = settingTempCopy['DET_BASE_FOLLOWINGS']; if (DET_BASE['DET_BASE_FOLLOWINGS']) recoverAPI('DET_BASE_FOLLOWINGS')
            if (settingTempCopy.hasOwnProperty('DET_BASE_VIDEOS')) DET_BASE['DET_BASE_VIDEOS'] = settingTempCopy['DET_BASE_VIDEOS']; if (DET_BASE['DET_BASE_VIDEOS']) recoverAPI('DET_BASE_VIDEOS')
            if (settingTempCopy.hasOwnProperty('DET_BASE_DYNAMIC')) DET_BASE['DET_BASE_DYNAMIC'] = settingTempCopy['DET_BASE_DYNAMIC']; if (DET_BASE['DET_BASE_DYNAMIC']) recoverAPI('DET_BASE_DYNAMIC')
            if (settingTempCopy.hasOwnProperty('DET_BASE_COMMENT')) DET_BASE['DET_BASE_COMMENT'] = settingTempCopy['DET_BASE_COMMENT']

            _T.resetqueue()
            _T.reset()
            _T.resetlimit(LIMIT_EVENT)

            confirm_success.style.display = 'unset'
            timerFoot2 = setTimeout(() => confirm_success.style.display = 'none', 1500)

            const doms = await getDom('div[xzsx_ischecked="true"],[xzsx_isdeepchecked="true"]')
            doms.forEach((dom) => { dom.removeAttribute('xzsx_ischecked'); dom.removeAttribute('xzsx_isdeepchecked') })
            render(true)
            _render = _throttle((forceSync, isjump) => render(forceSync, isjump), INTERVAL, { leading: false, trailing: true })[0]
            batchWatch()
            rulesApply = deepCloneRules(rules)

            let temp = {}
            Object.keys(rulesApply.detect).forEach((key) => {
                temp[key] = { 'color': rulesApply.detect[key].color, 'keywords': [...rulesApply.detect[key].keywords], 'antikeywords': [...rulesApply.detect[key].antikeywords] }
            })

            GM_setValue('xzsx_bilibili_detector_state', JSON.stringify({
                MODE, DET, DEL, DEL_STYLE, TAG_MAX_LENGTH, INTERVAL, LIMIT_EVENT,
                DET_BASE_MedalWall: DET_BASE['DET_BASE_MedalWall'],
                DET_BASE_FOLLOWINGS: DET_BASE['DET_BASE_FOLLOWINGS'],
                DET_BASE_VIDEOS: DET_BASE['DET_BASE_VIDEOS'],
                DET_BASE_DYNAMIC: DET_BASE['DET_BASE_DYNAMIC'],
                DET_BASE_COMMENT: DET_BASE['DET_BASE_COMMENT']
            }))

            GM_setValue('xzsx_bilibili_detector', JSON.stringify({
                blackList: rulesApply.blackList,
                detect: temp
            }))

            timerFoot = null
        }, 500)
    }

    /** 页脚应用按钮松开相关操作 */
    confirm_btn.onmouseup = () => {
        footerProcess.style.width = '0%'
        clearTimeout(timerFoot)
        timerFoot = null
    }

    /** 页脚新增规则按钮相关操作 */
    add_btn.onclick = () => {
        ckey = undefined
        confirm_btn.style.display = ''
        add_btn.style.display = 'none'
        alter_btn.style.display = 'none'
        addRuleForm.className = 'addrule_form-hide'
        setTimeout(() => addRuleForm.style.display = 'none', 500)
        let name = tagname.value?.trim() ?? '', newKeyWords = _difference(newRuleKeysSet, deleteRuleKeysSet), newantikeywords = _difference(newAntiRuleSets, deleteAntiRuleSets)
        if (name.length > 0 && newKeyWords.size > 0) {
            rules.detect[tagname.value] = { 'color': tagcolor.value, 'keywords': newKeyWords, 'antikeywords': newantikeywords }
            newRuleKeysSet.clear()
            deleteRuleKeysSet.clear()
            newAntiRuleSets.clear()
            deleteAntiRuleSets.clear()
            renderMainPanel()
        }
    }

    /** 页脚修改规则按钮相关操作 */
    alter_btn.onclick = () => {
        confirm_btn.style.display = ''
        add_btn.style.display = 'none'
        alter_btn.style.display = 'none'
        addRuleForm.className = 'addrule_form-hide'
        setTimeout(() => addRuleForm.style.display = 'none', 500)
        _difference(newRuleKeysSet, deleteRuleKeysSet).forEach((addKey) => rules.detect[ckey].keywords.add(addKey))
        _difference(deleteRuleKeysSet, newRuleKeysSet).forEach((deleteKey) => rules.detect[ckey].keywords.delete(deleteKey))
        _difference(newAntiRuleSets, deleteAntiRuleSets).forEach((addKey) => rules.detect[ckey].antikeywords.add(addKey))
        _difference(deleteAntiRuleSets, newAntiRuleSets).forEach((deleteKey) => rules.detect[ckey].antikeywords.delete(deleteKey))
        rules.detect[tagname.value] = { 'color': tagcolor.value, 'keywords': rules.detect[ckey].keywords, 'antikeywords': rules.detect[ckey].antikeywords }
        ckey !== tagname.value && Reflect.deleteProperty(rules.detect, ckey)
        ckey = undefined
        changedSignel1.style.display = 'none'
        newRuleKeysSet.clear()
        deleteRuleKeysSet.clear()
        newAntiRuleSets.clear()
        deleteAntiRuleSets.clear()
        renderMainPanel()
    }

    /** 渲染面板
     * @returns { void }
     */
    const renderMainPanel = () => {
        navRuleList.querySelectorAll('.rule-item').forEach((c) => c.remove())
        let cdatas = ctab ? Object.keys(rules.detect) : Object.keys(rules.blackList)
        cdatas.forEach((key) => {
            let parent = document.createElement('div')
            parent.id = key
            parent.className = 'rule-item'
            parent.innerHTML =
            `
                ${key}
                <div style="display:flex;align-items:center;height:25px;">
                    ${ctab ?
                    '<button class="rule-item-btn" style="display:none;">编辑</button>&nbsp;'
                    :
                    `<button class="rule-item-btn" style="display:none;background-color:#5d71df;border-color:#5d71df;">${rules.blackList[key]}</button>&nbsp;`}
                    <button class="rule-item-btn" style="display:none;"">删除</button>
                </div>
            `
            /** 构建检测成分面板 */
            if (ctab) {
                parent.style.color = rules.detect[key].color
                parent.children[0].children[0].onclick = () => {
                    ckey = key
                    parent.children[0].children[0].style.display = 'none'
                    parent.children[0].children[1].style.display = 'none'
                    renderEditPanel(key)
                }
                parent.children[0].children[1].onclick = () => {
                    parent.style.clipPath = 'polygon(115% 0, 115% 0, 100% 100%, 100% 100%)'
                    setTimeout(() => navRuleList.removeChild(parent), 200)
                    changedSignel1.style.display = ''
                    Reflect.deleteProperty(rules.detect, key)
                    rules.blackList[key] && rules.blackList[key] === '基于成分' && Reflect.deleteProperty(rules.blackList, key)
                    blacklistAdd_select.querySelector(`option[value="${key}"]`)?.remove()
                }
                /** 构建自动屏蔽面板 */
            } else {
                parent.children[0].children[0].onclick = () => {
                    let del_base = parent.children[0].children[0].textContent === '基于成分' ? '基于昵称' : '基于成分'
                    if (del_base === '基于成分' && rules.detect.hasOwnProperty(key)) {
                        parent.children[0].children[0].textContent = del_base
                        rules.blackList[key] = del_base
                        changedSignel2.style.display = ''
                    } else if (del_base === '基于昵称') {
                        parent.children[0].children[0].textContent = del_base
                        rules.blackList[key] = del_base
                        changedSignel2.style.display = ''
                    }
                }
                parent.children[0].children[1].onclick = () => {
                    parent.style.clipPath = 'polygon(115% 0, 115% 0, 100% 100%, 100% 100%)'
                    setTimeout(() => navRuleList.removeChild(parent), 200)
                    changedSignel2.style.display = ''
                    Reflect.deleteProperty(rules.blackList, key)
                    if (blacklistAdd_base.textContent === '基于成分' && parent.children[0].children[0].textContent === '基于成分' && blacklistAdd_select.querySelector(`option[value="${key}"]`) === null) {
                        let newOption = document.createElement('option')
                        newOption.value = key
                        newOption.text = key
                        blacklistAdd_select.appendChild(newOption)
                    }
                }
            }

            parent.onmouseenter = () => {
                parent.children[0].children[0].style.display = ''
                parent.children[0].children[1].style.display = ''
            }
            parent.onmouseleave = () => {
                parent.children[0].children[0].style.display = 'none'
                parent.children[0].children[1].style.display = 'none'
            }
            navRuleList.insertBefore(parent, detectAdd_btn)
        })
    }

    /** 渲染新增/编辑页面
     * @param { string } key 当前正在编辑的标签名
     * @returns { void }
     */
    const renderEditPanel = (key) => {
        keywords.querySelectorAll('.keyword').forEach((c) => c.remove())
        antikeywords.querySelectorAll('.keyword').forEach((c) => c.remove())
        ckey = key
        newKeyWord.value = ''
        newAntiKeyWord.value = ''
        if (key === undefined) {
            tagname.title = ''
            tagname.value = ''
            tagname.style.color = '#000000'
            tagcolor.value = '#000000'
            add_btn.style.display = ''
            alter_btn.style.display = 'none'
        } else {
            tagname.title = key
            tagname.value = key
            tagname.style.color = rules.detect[key].color
            tagcolor.value = rules.detect[key].color
            /** 粉丝关键词 */
            rules.detect[key].keywords.forEach((keyword) => {
                let keywordDom = document.createElement('div')
                keywordDom.className = 'keyword'
                keywordDom.style.color = 'green'
                keywordDom.innerHTML = `${keyword}<div class="keyword_delete">x</div>`
                keywordDom.children[0].onclick = () => {
                    changedSignel1.style.display = ''
                    newRuleKeysSet.has(keyword) ? newRuleKeysSet.delete(keyword) : deleteRuleKeysSet.add(keyword)
                    keywordDom.remove(keywordDom.children[0])
                }
                keywords.insertBefore(keywordDom, keywords.firstChild)
            })
            /** 黑子关键词 */
            rules.detect[key].antikeywords.forEach((antikeyword) => {
                let keywordDom = document.createElement('div')
                keywordDom.className = 'keyword'
                keywordDom.style.color = 'rgb(243,28,28)'
                keywordDom.innerHTML = `${antikeyword}<div class="keyword_delete">x</div>`
                keywordDom.children[0].onclick = () => {
                    changedSignel1.style.display = ''
                    newAntiRuleSets.has(antikeyword) ? newAntiRuleSets.delete(antikeyword) : deleteAntiRuleSets.add(antikeyword)
                    keywordDom.remove(keywordDom.children[0])
                }
                antikeywords.insertBefore(keywordDom, antikeywords.firstChild)
            })

            add_btn.style.display = 'none'
            alter_btn.style.display = ''
        }

        let curColor = key === undefined ? '#000000' : rules.detect[key].color
        tagsample.title = key?.length > 0 ? key : '标签样式预览'
        tagsample.textContent = key?.length > 0 ? key : '标签样式预览'
        tagsample.style.color = getContrastColor(curColor)
        tagsample.style.backgroundColor = curColor
        tagsample.style.borderColor = curColor + '80'
        tagsample.style.backgroundImage = `linear-gradient(45deg,  ${curColor}, ${curColor + '80'})`

        confirm_btn.style.display = 'none'
        addRuleForm.className = 'addrule_form'
        addRuleForm.style.display = 'flex'
    }

    /** <===================================================================================功能实现==========================================================================================> */

    /** 用于去重的UID集合 */
    const uidset = new Set(), url = window.location.href

    /** 标签缓存
     * @type { { [ key: number | string ]: { [key: string]:  { fan: { isFans: boolean, sources: { [key: string]: Set<string> } }, anti: { isAnti: boolean, sources: { [key: string]: Set<string> } } }  } }}
     */
    let userTags = {}, userTagsHash = {}, userBlackList = new Set()

    /** 对部分特殊URL进行映射
     * @returns { void }
     */
    const domainTransition = () => {
        switch (true) {
            case url.match(/^https?:\/\/www.bilibili.com\/festival.*$/) !== null: return 'www.bilibili.com/festival/'
            case url.match(/^https?:\/\/www.bilibili.com\/bangumi.*$/) !== null: return 'www.bilibili.com/bangumi/'
            case url.match(/^https?:\/\/www.bilibili.com\/read.*$/) !== null: return 'www.bilibili.com/read/'
            case url.match(/^https?:\/\/www.bilibili.com\/blackboard.*$/) !== null: return 'www.bilibili.com/blackboard/'
            case url.match(/^https?:\/\/www.bilibili.com\/v\/topic\/.*$/) !== null: return 'www.bilibili.com/v/topic/'
            case url.match(/^https?:\/\/t.bilibili.com\/\?spm_id_from=.*$/) !== null: return 'space.bilibili.com'
            default: return url.match(/^https?:\/\/(.*?)\/.*$/)[1]
        }
    }

    /** 域名
     * @type { string }
     */
    const domain = domainTransition()

    /** UserAgent生成器 */
    class UserAgentGenerator {
        constructor() {
            this._part1 =
                [
                    { name: "Mozilla/5.0", children: [] }
                ]
            this._part2 =
                [
                    {
                        name: "Windows NT ${11}.${10}",
                        children:
                            [
                                {
                                    name: 'Win64; x64',
                                    children:
                                        [
                                            {
                                                name: "rv:${54}.${10}",
                                                children: []
                                            },
                                            {
                                                name: "Trident/${8}.${10}",
                                                children: []
                                            },
                                        ]
                                },
                                {
                                    name: '',
                                    children:
                                        [
                                            {
                                                name: "rv:${54}.${10}",
                                                children: []
                                            },
                                            {
                                                name: "Trident/${8}.${10}",
                                                children: []
                                            },
                                        ]
                                }
                            ]
                    },
                    {
                        name: 'Macintosh',
                        children:
                            [
                                {
                                    name: "Intel Mac OS X ${11}_${13}_${6}",
                                    children:
                                        [
                                            {
                                                name: "rv:${54}.${10}",
                                                children: []
                                            },
                                        ]
                                }
                            ]
                    },
                    {
                        name: 'X11',
                        children:
                            [
                                {
                                    name: 'Ubuntu',
                                    children:
                                        [
                                            {
                                                name: "rv:${54}.${10}",
                                                children: []
                                            },
                                        ]
                                },
                                {
                                    name: 'Linux x86_64',
                                    children:
                                        [
                                            {
                                                name: "rv:${54}.${10}",
                                                children: []
                                            },
                                        ]
                                }
                            ]
                    },
                ]
            this._part3 =
                [
                    { name: "Gecko/20100101", children: [] },
                    { name: "AppleWebKit/5${38}.36", children: [] },
                    { name: "", children: [] },
                ]
            this._part4 =
                [
                    { name: "(KHTML, like Gecko)", children: [] },
                    { name: "", children: [] },
                ]
            this._part5 =
                [
                    { name: "(KHTML, like Gecko)", children: [] },
                    { name: "", children: [] },
                ]
            this._part6 =
                [
                    "Firefox/${54}.${10}",
                    "Chrome/${105}.${10}.${10}.${10}",
                    "Safari/${538}.${37}",
                    "OPR/${46}.0.2552.${889}",
                    'Ubuntu',
                    "Version/${11}.${10}.${10}",
                    "Chromium/${59}.0.3029.${111}",
                    "Mobile/14F89",
                    "(iPad; U; CPU OS 3_2 like Mac OS X; en-us)",
                ]
        }

        generate =
            () => this._dfs(this._part1, '')
                + this._dfs(this._part2, '')
                + this._dfs(this._part3, '')
                + this._dfs(this._part4, '')
                + this._dfs(this._part5, '')
                + this._dfs2(this._part6, [], new Set(), Math.floor(Math.random() * this._part6.length))

        _dfs = (arr, combine) => {
            if (arr.length === 0) return combine
            const randomIndex = Math.floor(Math.random() * arr.length)

            let str = JSON.parse(JSON.stringify(arr[randomIndex].name)), matches = str.match(/\${(\d+)}/)
            while (matches !== null) {
                str = str.replace(/\${(\d+)}/, Math.floor(Math.random() * parseInt(matches[1])))
                matches = str.match(/\${(\d+)}/)
            }

            combine += str + (str.length > 0 ? '; ' : '')
            return this._dfs(arr[randomIndex].children, combine)
        }

        _dfs2 = (arr, combine, vis, total) => {
            if (combine.length === total) return combine.join('; ')
            let randomIndex = Math.floor(Math.random() * arr.length)
            while (vis.has(randomIndex)) randomIndex = Math.floor(Math.random() * arr.length)
            vis.add(randomIndex)

            let str = JSON.parse(JSON.stringify(arr[randomIndex])), matches = str.match(/\${(\d+)}/)
            while (matches !== null) {
                str = str.replace(/\${(\d+)}/, Math.floor(Math.random() * parseInt(matches[1])))
                matches = str.match(/\${(\d+)}/)
            }

            combine.push(str)
            return this._dfs2(arr, combine, vis, total)
        }
    }

    /** UserAgent生成器 */
    const Generator = new UserAgentGenerator()

    /** 获取网络请求参数
     * @param { string } name API名
     * @param { string } uid 用户UID
     * @param { number } pn API检索页数
     * @param { string } offset 主键偏移
     * @returns { object } 请求参数对象
     */
    const getRequestParams = (name, uid, pn, offset = '') => {
        const randomUID = Math.floor(Math.random() * Math.pow(2, 29)), userAgent = Generator.generate()
        switch (name) {
            /** B站粉丝牌API */
            case 'Medal': return {
                method: "get",
                url: `https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id=${uid}`,
                headers: { 'user-agent': userAgent, 'referer': 'https://live.bilibili.com/' }
            }
            /** B站关注列表API */
            case 'SubList': return {
                method: "get",
                url: `https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${pn}&ps=50&order=desc&jsonp=jsonp`,
                headers: { 'user-agent': userAgent, 'referer': `https://space.bilibili.com/${randomUID}/fans/follow` }
            }
            /** B站投稿列表API */
            case 'Video': return {
                method: "get",
                url: `https://api.bilibili.com/x/space/arc/search?mid=${uid}&pn=${pn}&ps=50&jsonp=jsonp`,
                headers: { 'user-agent': userAgent, 'referer': `https://space.bilibili.com/${randomUID}/video` }
            }
            /** B站用户动态API */
            case 'Dynamic': return {
                method: "get",
                url: `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=${uid}&offset=${offset}`,
                headers: { 'user-agent': userAgent, 'referer': `https://space.bilibili.com/${randomUID}/dynamic` }
            }
            default: return ''
        }
    }

    /** 封装GM_xmlhttpRequest为Promise方便进行同步操作
     * @param { string } params GM_xmlhttpRequest 参数列表
     * @returns { Promise<object> }
     */
    const GM_Request = (params) => {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                ...params,
                onload: res => res.status === 200 ? resolve(JSON.parse(res.response)) : resolve({ 'code': res.status }),
                onerror: error => resolve({ 'code': error.code, 'message': error })
            })
        })
    }

    /** 判断新旧版本
     * @type { boolean }
     */

    let version = true, Cookie = document.cookie, goOldVideo = Cookie.match(/(?<=go_old_video=)[-\d]{1,2}/)

    if (Cookie && goOldVideo) version = goOldVideo[0] === '-1'

    /** 新旧版本-评论根节点class映射
     * @type { { [ key: string ]: { true: { mainList: string, subList: string }, false: { mainList: string, subList: string } } } }
     */
    const versionMap = {
        'www.bilibili.com': { true: { 'mainList': '.reply-list', 'subList': '.sub-reply-list' }, false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
        'space.bilibili.com': { true: { 'mainList': '.bili-dyn-list__items', 'subList': '.bili-dyn-item' }, false: { 'mainList': '.bili-dyn-list__items', 'subList': '.bili-dyn-item' } },
        't.bilibili.com': { true: { 'mainList': '.comment-list ', 'subList': '.reply-box' } , false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
        'live.bilibili.com': { true: { 'mainList': '.chat-items', 'subList': '.reply-box' }, false: { 'mainList': '.chat-items', 'subList': '.reply-box' } },
        'www.bilibili.com/festival/': { true: { 'mainList': '.reply-list,.chat-items', 'subList': '.sub-reply-list,.reply-box' }, false: { 'mainList': '.comment-list ,.chat-items', 'subList': '.reply-box' } },
        'www.bilibili.com/bangumi/': { true: { 'mainList': '.comment-list ', 'subList': '.reply-box' }, false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
        'www.bilibili.com/read/': { true: { 'mainList': '.comment-list ', 'subList': '.reply-box' }, false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
        'www.bilibili.com/blackboard/': { true: { 'mainList': '.comment-list ', 'subList': '.reply-box' }, false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
        'www.bilibili.com/v/topic/': { true: { 'mainList': '.comment-list ', 'subList': '.reply-box' }, false: { 'mainList': '.comment-list ', 'subList': '.reply-box' } },
    }

    /** 用于屏蔽的Class映射表 @视频评论
     * @type { { [ key: string ]: Array<string> } }
     */
    const videoClassMap = {
        'user': ['user', 'reply-item reply-wrap', '.text'],
        'user-name': ['.user-info', '.reply-list > .reply-item', '.reply-content,.root-reply'],
        'sub-user-name': ['.sub-user-info', '.sub-reply-list > .sub-reply-item', '.reply-content,.sub-reply-content'],
    }

    /** Class映射表 @动态评论
     * @type { { [ key: string ]: Array<string> } }
     */
    const dynamicClassMap = {
        'user': ['.level-link', '.text text-con reply-item reply-wrap', '.text text-con'],
    }

    /** Class映射表 @直播评论
     * @type { { [ key: string ]: Array<string> } }
     */
    const liveClassMap = {
        'chat-item danmaku-item ': ['.danmaku-item-left', '.chat-item danmaku-item ', '.danmaku-item-right'],
        'chat-item danmaku-item chat-colorful-bubble': ['.danmaku-item-left', '.chat-item danmaku-item ', '.danmaku-item-right'],
        'chat-item danmaku-item chat-colorful-bubble chat-emoticon bulge-emoticon': ['.danmaku-item-left', '.chat-item danmaku-item ', '.danmaku-item-right'],
        'chat-item danmaku-item  chat-emoticon': ['.danmaku-item-left', '.chat-item danmaku-item ', '.danmaku-item-right'],
        'chat-item danmaku-item  chat-emoticon bulge-emoticon': ['.danmaku-item-left', '.chat-item danmaku-item ', '.danmaku-item-right'],
    }

    /** 域名Class映射表
     * @type { { [ key: string ]: { userDomClass: string, classMap: object } } }
     */
    const domainMap = {
        'www.bilibili.com': { 'userDomClass': '.user,.user-name,.sub-user-name', 'classMap': videoClassMap },
        'space.bilibili.com': { 'userDomClass': '.user', 'classMap': dynamicClassMap },
        't.bilibili.com': { 'userDomClass': '.user,.user-name,.sub-user-name', 'classMap': dynamicClassMap },
        'live.bilibili.com': { 'userDomClass': '.chat-item,.danmaku-item', 'classMap': liveClassMap },
        'www.bilibili.com/festival/': { 'userDomClass': '.user,.user-name,.sub-user-name,.chat-item,.danmaku-item', 'classMap': { ...videoClassMap, ...liveClassMap } },
        'www.bilibili.com/bangumi/': { 'userDomClass': '.user,.user-name,.sub-user-name,.chat-item,.danmaku-item', 'classMap': { ...videoClassMap, ...liveClassMap } },
        'www.bilibili.com/read/': { 'userDomClass': '.user,.user-name,.sub-user-name,.chat-item,.danmaku-item', 'classMap': { ...videoClassMap, ...liveClassMap } },
        'www.bilibili.com/blackboard/': { 'userDomClass': '.user,.user-name,.sub-user-name,.chat-item,.danmaku-item', 'classMap': { ...videoClassMap, ...liveClassMap } },
        'www.bilibili.com/v/topic/': { 'userDomClass': '.user,.user-name,.sub-user-name,.chat-item,.danmaku-item', 'classMap': { ...videoClassMap, ...liveClassMap } },
    }

    /** 获取UID
     * @param { Element } v 用户DOM元素
     * @returns { string } 返回UID字符串
     */
    const getUID = (v) => v?.dataset?.uid || v?.children[0]?.dataset['usercardMid'] || v?.children[0]?.href?.replace(/[^\d]/g, "") || v.dataset['userId']

    /** 获取用户昵称
     * @param { Element } v 用户DOM元素
     * @returns { string } 返回昵称字符串
     */
    const getUname = (v) =>
    (
        {
            'live.bilibili.com': v?.dataset?.uname,
            'space.bilibili.com': v?.firstChild?.textContent,
            'www.bilibili.com': version ? v?.textContent : v?.firstChild?.textContent,
            't.bilibili.com': v?.firstChild?.textContent
        }[domain]
    )

    /** 轮询获取DOM元素
     * @param { string } className 类名
     * @param { number } timeout 轮询周期(毫秒), 默认值为1000
     * @param { boolean } isDelay 是否立刻执行一次
     * @returns { Promise<Array<Element>> } 返回DOM数组
     */
    const getDom = (className, timeout = 1000, isDelay = false) => {
        let DOMS = [], timer = undefined
        let fn = (resolve) => {
            return () => {
                if (ciframe === undefined) {
                    ciframe = getCurIframe()
                    /** 若页面存在iframe, 则将成分标签相关样式css样式添加到iframe内 */
                    if (!init && ciframe !== undefined) {
                        init = true
                        const innerIframe_style = document.createElement('style')
                        innerIframe_style.innerHTML = css_tag
                        ciframe.contentWindow.document.querySelector('head').appendChild(innerIframe_style)
                    }
                }

                DOMS = (domain === 'live.bilibili.com' ?
                    ciframe !== undefined ?
                        ciframe.contentWindow.document
                        :
                        document
                    :
                    document).querySelectorAll(className)

                if (DOMS.length > 0) {
                    clearInterval(timer)
                    resolve(DOMS)
                }
            }
        }
        return new Promise(resolve => {
            !isDelay && fn(resolve)()
            timer = setInterval(fn(resolve), timeout)
        })
    }

    /** 获取反差强烈的另外一种颜色
     * @param { string } oldColor 十六进制字符串
     * @returns { string } 返回反差强烈的另外一种颜色的十六进制字符串
     */
    const getContrastColor = (oldColor) => (('0x' + oldColor.slice(1, 3)) * 299 + ('0x' + oldColor.slice(3, 5)) * 587 + ('0x' + oldColor.slice(5, 7)) * 114) / 1000 >= 128 ? 'black' : 'white'

    /** 获取待个人信息字符串并检测成分
     * @param { string } uid 用户UID
     * @param { Element | null } dom 用户评论元素
     * @param { boolean } isdeep 是否需要深度收集, 默认为否
     * @param { boolean } forceSync 是否强制刷新
     * @returns { Promise<void> } 返回个人信息字符串
     */
    const handleStr = async (uid, dom, isdeep = false, forceSync = false) => {
        /** 并发进行网络请求及成分检测 */
        await Promise.all(
            [
                /** 获取评论/弹幕文本 */
                new Promise(resolve => {
                    if (DET_BASE['DET_BASE_COMMENT']) {
                        let textStr = ' '
                        switch (true) {
                            case domain === 'space.bilibili.com' || domain === 't.bilibili.com': textStr = (dom.closest('.text text-con') || dom.querySelector('.text-con') || dom.parentNode.querySelector('.text')).textContent
                                break
                            default:
                                textStr = (domain === 'live.bilibili.com' ?
                                    dom : version ?
                                        (dom.closest(domainMap[domain].classMap[dom.className][1]) || dom || dom.parentNode)
                                        :
                                        dom.parentNode.className !== 'reply-con' ?
                                            dom.parentNode
                                            :
                                            dom.parentNode.parentNode)?.querySelector(dom.parentNode.className === 'reply-con' ?
                                                '.text-con'
                                                :
                                                domainMap[domain].classMap[dom.className][2])?.textContent
                                break
                        }
                        if (textStr?.trim().length > 0) dealRes(uid, '『评论内容』' + textStr, '评论', forceSync, resolve); else resolve()
                    } else resolve()
                }),
                /** 获取用户全部粉丝牌列表 */
                new Promise(async (resolve) => {
                    if (DET_BASE['DET_BASE_MedalWall'] && !API_OVERLOAD['DET_BASE_MedalWall'].state) {
                        let medalStr = ' '
                        const medalList = await GM_Request(getRequestParams('Medal', uid, 1))
                        if (medalList?.code === 0 && medalList?.data?.count > 0) {
                            medalList?.data?.list.forEach((v) => {
                                let
                                    /** 粉丝牌正主名称 */
                                    target_name = (v?.target_name ?? ''),
                                    /** 粉丝牌名称 */
                                    medal_name = (v?.medal_info.medal_name ?? ''),
                                    /** 粉丝牌等级 */
                                    level = (v?.medal_info.level ?? '') + ''
                                medalStr
                                    += (target_name.length > 0 ? `『${level.length > 0 ? `${level}级` : ''}粉丝牌->正主』` : '') + target_name + '∏'
                                    + (medal_name.length > 0 ? `『${level.length > 0 ? `${level}级` : ''}粉丝牌->名称』` : '') + medal_name + '∏'
                                userTags[uid]['MedalWall'] = medalList?.data?.list
                            })
                        } else if (medalList?.code === 412) banAPI('DET_BASE_MedalWall', status_MedalWall)
                        if (medalStr.trim().length > 0) dealRes(uid, medalStr, '粉丝牌', forceSync, resolve); else resolve()
                    } else resolve()
                }),
                /** 获取用户前(50n)个投稿列表 */
                new Promise(async (resolve) => {
                    if (DET_BASE['DET_BASE_VIDEOS'] && !API_OVERLOAD['DET_BASE_VIDEOS'].state) {
                        let videoStr = ' '
                        for (let pn = 1, count = 0; pn <= (isdeep ? 2 : 1); pn++) {
                            const videoList = await GM_Request(getRequestParams('Video', uid, pn))
                            if (videoList?.code === 0 && videoList?.data?.list?.vlist.length > 0) {
                                videoList?.data?.list?.vlist.forEach((v) => {
                                    let
                                        /** 投稿标题 */
                                        title = (v?.title ?? ''),
                                        /** 投稿描述 */
                                        description = (v?.description ?? '')
                                    videoStr
                                        += (title.length > 0 ? '『投稿标题』' : '') + title + '∏'
                                        + (description.length > 0 ? '『投稿描述』' : '') + description + '∏'
                                })
                                count += 50
                                if (count >= videoList?.data?.page?.count) break
                            } else if (videoList?.code === 412) {
                                banAPI('DET_BASE_VIDEOS', status_VIDEOS)
                                break
                            }
                        }
                        if (videoStr.trim().length > 0) dealRes(uid, videoStr, '投稿列表', forceSync, resolve); else resolve()
                    } else resolve()
                }),
                /** 获取用户前(50n)个关注列表 */
                new Promise(async (resolve) => {
                    if (DET_BASE['DET_BASE_FOLLOWINGS'] && !API_OVERLOAD['DET_BASE_FOLLOWINGS'].state) {
                        let subStr = ' '
                        for (let pn = 1, count = 0; pn <= (isdeep ? 5 : 1); pn++) {
                            const subList = await GM_Request(getRequestParams('SubList', uid, pn))
                            if (subList?.code === 0 && subList?.data?.list?.length > 0) {
                                subList?.data?.list.forEach((v) => {
                                    /** 关注用户的名称 */
                                    let uname = (v?.uname ?? '')
                                    subStr += (uname.length > 0 ? '『关注用户』' : '') + uname + '∏'
                                })
                                count += 50
                                if (count >= subList?.data?.total) break
                            } else if (subList?.code === 412) {
                                banAPI('DET_BASE_FOLLOWINGS', status_FOLLOWINGS)
                                break
                            }
                        }
                        if (subStr.trim().length > 0) dealRes(uid, subStr, '关注列表', forceSync, resolve); else resolve()
                    } else resolve()
                }),
                /** 获取用户前n页动态列表 */
                new Promise(async (resolve) => {
                    if (DET_BASE['DET_BASE_DYNAMIC'] && !API_OVERLOAD['DET_BASE_DYNAMIC'].state) {
                        let dynamicStr = '', offset = ''
                        for (let pn = 1; pn <= (isdeep ? 5 : 1); pn++) {
                            const dynamicList = await GM_Request(getRequestParams('Dynamic', uid, pn, offset))
                            if (dynamicList?.code === 0 && dynamicList?.data?.items?.length > 0) {
                                offset = dynamicList?.data?.offset
                                dynamicList?.data?.items.forEach((v) => {
                                    let
                                        /** 装扮名称 */
                                        decorate_name = (v?.modules?.module_author?.decorate?.name ?? ''),
                                        /** 头像装扮名称 */
                                        pendant_name = (v?.modules?.module_author?.pendant?.name ?? ''),
                                        /** 转发动态的作者名称 */
                                        module_author = (v?.orig?.modules?.module_author?.name ?? ''),
                                        /** 动态文本内容 */
                                        text = (v?.modules?.module_dynamic?.desc?.text ?? '')
                                    dynamicStr
                                        += (decorate_name.length > 0 ? '『装扮』' : '') + decorate_name + '∏'
                                        + (pendant_name.length > 0 ? '『头像装扮』' : '') + pendant_name + '∏'
                                        + (module_author.length > 0 ? '『转发作者』' : '') + module_author + '∏'
                                        + (text.length > 0 ? '『动态内容』' : '') + text + '∏'
                                })
                                if (!dynamicList?.data?.has_more) break
                            } else if (dynamicList?.code === 412) {
                                banAPI('DET_BASE_DYNAMIC', status_DYNAMIC)
                                break
                            }
                        }
                        if (dynamicStr.trim().length > 0) dealRes(uid, dynamicStr, '动态列表', forceSync, resolve); else resolve()
                    } else resolve()
                }),
            ]
        ).then(() => {
            if (DEL && userBlackList.has(uid)) block(dom)
            if (DET && uidset.has(uid)) {
                appendTags(uid, dom, userTags[uid], forceSync)
                for (const tagname of Object.keys(userTags[uid])) userTagsHash[uid]['filter'].add(tagname)
            }
        })
    }

    /** 普通/深度检测
     * @param { string } uid 用户UID
     * @param { Element | null } dom 用户评论元素
     * @param { boolean } isdeep 是否需要深度收集, 默认为否
     * @returns { Promise<void> }
     */
    const check = async (uid, dom, isdeep = false) => {
        /** 获取旧标签容器 */
        let container = (domain === 'live.bilibili.com' ?
            dom : version ?
                dom.closest(domainMap[domain].classMap[dom.className][1])
                :
                dom.parentNode.className !== 'reply-con' ?
                    dom.parentNode
                    :
                    dom.parentNode.parentNode).querySelector('.tag_container')

        container.innerHTML = '<img src="data:image/svg+xml;base64,PCEtLSBCeSBTYW0gSGVyYmVydCAoQHNoZXJiKSwgZm9yIGV2ZXJ5b25lLiBNb3JlIEAgaHR0cDovL2dvby5nbC83QUp6YkwgLS0+DQo8c3ZnIHdpZHRoPSIzOCIgaGVpZ2h0PSIzOCIgdmlld0JveD0iMCAwIDQwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KICAgIDxkZWZzPg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjguMDQyJSIgeTE9IjAlIiB4Mj0iNjUuNjgyJSIgeTI9IjIzLjg2NSUiIGlkPSJhIj4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyMjIiIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIwJSIvPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzIyMiIgc3RvcC1vcGFjaXR5PSIuNjMxIiBvZmZzZXQ9IjYzLjE0NiUiLz4NCiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiMyMjIiIG9mZnNldD0iMTAwJSIvPg0KICAgICAgICA8L2xpbmVhckdyYWRpZW50Pg0KICAgIDwvZGVmcz4NCiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIj4NCiAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOCIgaWQ9Ik92YWwtMiIgc3Ryb2tlPSJ1cmwoI2EpIiBzdHJva2Utd2lkdGg9IjQiPg0KICAgICAgICAgICAgICAgIDxhbmltYXRlVHJhbnNmb3JtDQogICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSINCiAgICAgICAgICAgICAgICAgICAgdHlwZT0icm90YXRlIg0KICAgICAgICAgICAgICAgICAgICBmcm9tPSIwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICB0bz0iMzYwIDE4IDE4Ig0KICAgICAgICAgICAgICAgICAgICBkdXI9IjAuOXMiDQogICAgICAgICAgICAgICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPg0KICAgICAgICAgICAgPC9wYXRoPg0KICAgICAgICAgICAgPGNpcmNsZSBmaWxsPSIjMjIyIiBjeD0iMzYiIGN5PSIxOCIgcj0iMSI+DQogICAgICAgICAgICAgICAgPGFuaW1hdGVUcmFuc2Zvcm0NCiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIg0KICAgICAgICAgICAgICAgICAgICB0eXBlPSJyb3RhdGUiDQogICAgICAgICAgICAgICAgICAgIGZyb209IjAgMTggMTgiDQogICAgICAgICAgICAgICAgICAgIHRvPSIzNjAgMTggMTgiDQogICAgICAgICAgICAgICAgICAgIGR1cj0iMC45cyINCiAgICAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIC8+DQogICAgICAgICAgICA8L2NpcmNsZT4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K" style="height:18px;width:18px;"></img>'
        medalWall.className = 'xzsx_detect_tag-medalwall-hide'
        medalWall.setAttribute('key', null)

        if (userTagsHash[uid]['isdeepchecked']) {
            container.querySelector('img').remove()
            appendTags(uid, dom, userTags[uid])
            return
        }

        if (isdeep) {
            /** 添加已深度检测状态 */
            dom.setAttribute('xzsx_isdeepchecked', true)
            userTagsHash[uid]['isdeepchecked'] = true
        }

        /** 检测成分 */
        await handleStr(uid, dom, isdeep, true)

        container.querySelector('img').remove()
        isdeep && container.querySelector('.icon-deepcheck').remove()
    }

    /** 数字转十六进制字符串
    * @param { number } num 源字符串
    * @returns { string }
    */
    const intToHexString = (num) => {
        let hexStr = num.toString(16)
        for (let i = hexStr.length; i < 6; i++) hexStr = '0' + hexStr
        return hexStr
    }

    /** 高亮关键词
     * @param { string } str 源字符串
     * @param { string } targetStr 目标字符串
     * @returns { string }
     */
    const highLight = (str, targetStr) => str.split(targetStr).join(`<span style="background-color:yellow;color:black;">${targetStr}</span>`)

    /** 瀑布流
     * @param { HTMLElement } container 瀑布流布局容器
     * @param { HTMLElement[] } doms HTML元素集合
     * @param { number } gap 元素间隙
     * @param { 'Horizontal' | 'Vertical' } direction 方向
     * @return { [ number, number ] } 最大高宽
     */
    const waterfall = (container, doms, gap, direction) => {
        const curAttr = { 'Horizontal': ['height', 'width', 'left', 'top'], 'Vertical': ['width', 'height', 'top', 'left'] }[direction], csize = parseInt(container.style[curAttr[0]])
        if (typeof (csize) !== 'number' || csize <= 0) return 0
        const size = parseInt(getComputedStyle(doms[0])[curAttr[0]]), num = parseInt(csize / (size + gap))
        let pos = [], lowest = -1
        for (let i = 0; i < doms.length; i++) {
            let computedStyle = getComputedStyle(doms[i])
            doms[i].style.position = 'absolute'
            if (i < num) {
                pos[i] = parseInt(computedStyle[curAttr[1]]) + gap
                doms[i].style[curAttr[2]] = gap + 'px'
                doms[i].style[curAttr[3]] = gap * (i % num + 1) + size * (i % num) + 'px'
            } else {
                lowest = pos.indexOf(Math.min(...pos))
                doms[i].style[curAttr[2]] = pos[lowest] + gap + 'px'
                doms[i].style[curAttr[3]] = gap * (lowest % num + 1) + size * (lowest % num) + 'px'
                pos[lowest] = pos[lowest] + parseInt(computedStyle[curAttr[1]]) + gap
            }
        }
        return [pos.length * (size + gap) + gap, pos[pos.indexOf(Math.max(...pos))] + gap]
    }

    /** 插入标签
     * @param { string } uid 用户UID
     * @param { Element | null } dom 用户评论元素
     * @param { object } tags 用户成分名集合
     * @param { boolean } forceSync 是否强制刷新, 默认为否
     * @returns { void }
     */
    const appendTags = (uid, dom, tags, forceSync = false) => {
        let fansTags = [], antiTags = [], iframePos = ciframe?.getBoundingClientRect()
        try {
            Object.keys(tags).forEach(tagname => {
                if (tagname !== 'MedalWall') {
                    tags[tagname].fan.isFans && fansTags.push(tagname)
                    tags[tagname].anti.isAnti && antiTags.push(tagname)
                }
            })

            /** 生成标签DOM */
            let Tags = [], length = 0, cur = (version && domain !== 'www.bilibili.com' && domain !== 'www.bilibili.com/bangumi/' && domain !== 'www.bilibili.com/read/'&& domain !== 'www.bilibili.com/blackboard/'&& domain !== 'www.bilibili.com/v/topic/') ? (dom.querySelector(domainMap[domain].classMap[dom.className][0]) || dom.closest(domainMap[domain].classMap[dom.className][0])) : dom, tag_container = cur.querySelector('.tag_container'), existTags = new Set(), container = tag_container !== null ? tag_container : document.createElement('div')
            container.querySelectorAll('.xzsx_detect_tag').forEach(ele => existTags.add(ele.textContent))
            fansTags.forEach((tagname) => {
                if (!existTags.has(tagname)) {
                    length += tagname.replace(/\p{sc=Han}/gu, '**').length
                    let ele = document.createElement('div')
                    ele.className = 'xzsx_detect_tag'
                    ele.style.display = length <= TAG_MAX_LENGTH ? 'inline-flex' : 'none'
                    ele.style.color = getContrastColor(rulesApply.detect[tagname].color)
                    ele.style.borderColor = rulesApply.detect[tagname].color + '80'
                    ele.style.backgroundImage = `-o-linear-gradient(45deg,  ${rulesApply.detect[tagname].color}, ${rulesApply.detect[tagname].color + '80'})`
                    ele.style.backgroundImage = `-moz-linear-gradient(45deg,  ${rulesApply.detect[tagname].color}, ${rulesApply.detect[tagname].color + '80'})`
                    ele.style.backgroundImage = `-webkit-linear-gradient(45deg,  ${rulesApply.detect[tagname].color}, ${rulesApply.detect[tagname].color + '80'})`
                    ele.style.backgroundImage = `linear-gradient(45deg,  ${rulesApply.detect[tagname].color}, ${rulesApply.detect[tagname].color + '80'})`
                    ele.textContent = (tags[tagname].anti.isAnti ? '🐵' : '') + tagname
                    /** 点击成分标签展开溯源面板 */
                    ele.onclick = (e) => {
                        e.stopPropagation()
                        medalWall.setAttribute('key', null)
                        medalWall.className = 'xzsx_detect_tag-medalwall-hide'
                        trackPanel.className = 'xzsx_detect_tag-trackpanel-hide'
                        trackPanel.innerHTML =
                        `
                            <div title='${getUname(dom)} / ${tagname}' class='xzsx_detect_tag-trackpanel-title'>
                                ${getUname(dom)} / ${tagname}
                            </div>
                            <div class='xzsx_detect_tag-trackpanel-content'>
                                ${tags[tagname].anti.isAnti ?
                                `
                                    <div class='xzsx_detect_tag-trackpanel-anti'>
                                        <u class='xzsx_detect_tag-trackpanel-texttitle'>黑子关键词溯源</u>
                                        ${Object.keys(tags[tagname].anti.sources).map((src) => {
                                            return tags[tagname].anti.sources[src].size > 0 ?
                                            `
                                                <div>     
                                                    <div class="xzsx_detect_tag-trackpanel-source">${src}</div>
                                                    ${Array.from(tags[tagname].anti.sources[src]).map((text) => {
                                                        let texts = text.split('Γ')
                                                        return `<div class="xzsx_detect_tag-trackpanel-text">${highLight(texts[1], texts[0])}</div>`
                                                    }).join('')}
                                                </div>
                                            ` : ''}).join('')}
                                    </div>
                                ` : '' }
                            <div class='xzsx_detect_tag-trackpanel-fans'>
                                <u class='xzsx_detect_tag-trackpanel-texttitle'>粉丝关键词溯源</u>
                                ${Object.keys(tags[tagname].fan.sources).map((src) => {
                                    return tags[tagname].fan.sources[src].size > 0 ?
                                    `
                                        <div>
                                            <div class="xzsx_detect_tag-trackpanel-source">${src}</div>
                                            ${Array.from(tags[tagname].fan.sources[src]).map((text) => {
                                                let texts = text.split('Γ')
                                                return `<div class="xzsx_detect_tag-trackpanel-text">${highLight(texts[1], texts[0])}</div>`
                                            }).join('')}
                                        </div>
                                    ` : ''}).join('')}
                                </div>
                            </div>
                        `
                        let title = trackPanel.querySelector('.xzsx_detect_tag-trackpanel-title')
                        title.onclick = e => { e.stopPropagation(); ele.scrollIntoView({ block: "center", inline: "center" }) }
                        title.onmouseenter = e => e.target.style.opacity = 0.8
                        title.onmouseleave = e => e.target.style.opacity = 1
                        trackPanel.style.display = 'flex'
                        let pos = e.target.getBoundingClientRect()
                        if (domain === 'live.bilibili.com') {
                            trackPanel.style.position = 'fixed'
                            trackPanel.style.right = '24px'
                            trackPanel.style.top = '24px'
                        } else {
                            trackPanel.style.position = 'absolute'
                            trackPanel.style.left = (iframePos?.left ?? 0) + (pos.left + 260 > document.documentElement.clientWidth ? document.documentElement.clientWidth - 300 : pos.left + 10) + 'px'
                            trackPanel.style.top = (iframePos?.top ?? 0) + document.scrollingElement.scrollTop + (pos.top + 220 > document.documentElement.clientHeight ? document.documentElement.clientHeight - 250 : pos.top + 20) + 'px'
                        }
                        trackPanel.className = 'xzsx_detect_tag-trackpanel-show'
                    }
                    Tags.push(ele)
                }
            })

            let icon = document.createElement('div'), checkBtn = document.createElement('div'), exist_btn = container.querySelector('div.icon-expend') === null
            if (exist_btn && length > TAG_MAX_LENGTH) {
                icon.className = 'icon-expend'
                icon.innerHTML =
                `
                    <svg t="1636097794549" class="svg-expend" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5713" >
                        <path d="M586.624 234.624a74.624 74.624 0 1 1-149.184 0 74.624 74.624 0 0 1 149.12 0z m0 554.624a74.624 74.624 0 1 1-149.248 0 74.624 74.624 0 0 1 149.248 0zM512 586.624a74.624 74.624 0 1 0 0-149.248 74.624 74.624 0 0 0 0 149.248z" p-id="5714" fill="#9499a0"></path>
                    </svg>
                `
                icon.onclick = e => {
                    e.stopPropagation()
                    icon.style.display = 'none'
                    container.querySelectorAll('div.xzsx_detect_tag[style*="display: none;"]').forEach(tag => tag.style.display = 'inline-flex')
                }
            }

            /** 构造标签容器 */
            container.className = 'tag_container'

            /** 构造主动检测按钮 */
            checkBtn.className = 'icon-deepcheck'
            checkBtn.innerHTML =
            `
                <div class="icon-deepcheck-hide" >
                    <svg class="svg-deepcehck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                    </svg>
                </div>
                <div style="position: absolute;">
                    <svg class='check-container'>
                        <circle class='check-circle' cx="9" cy="9" r="8" />
                    </svg>
                </div>
            `

            checkBtn.onclick = () => check(uid, dom, false)

            const [_ddeep, clearDeepTimer] = _debounce(() => { checkBtn.children[0].className = 'icon-deepcheck-hide'; check(uid, dom, true) }, 1000)

            checkBtn.onmousedown = () => { checkBtn.children[0].style.transform = 'scale(0.55)'; checkBtn.children[1].children[0].children[0].style.strokeDashoffset = 0; _ddeep() }
            checkBtn.onmouseup = () => { checkBtn.children[0].style.transform = 'scale(1)'; checkBtn.children[1].children[0].children[0].style.strokeDashoffset = 50.3; clearDeepTimer() }

            const [_dshow, clearshowTimer] = _debounce(() => checkBtn.style.display = 'inline-flex', 500)
            const [_dhide, clearhideTimer] = _debounce(() => checkBtn.style.display = 'none', 1000)

            container.onmouseenter = () => { clearhideTimer(); _dshow() }
            container.onmouseleave = () => { clearshowTimer(); _dhide() }
            dom.onmouseenter = () => { clearhideTimer(); _dshow() }
            dom.onmouseleave = () => { clearshowTimer(); _dhide() }

            /** 勋章墙 */
            let container2 = document.createElement('div'), medalBtn = null, medalList = []
            if (tags['MedalWall'] !== undefined) {
                tags['MedalWall'].sort((a, b) => b.medal_info.level - a.medal_info.level).forEach((info, i) => {
                    let medal = document.createElement('div')
                    medal.title = info.target_name
                    medal.onclick = () => window.open(info.link)
                    medal.style.cssText =
                    `
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        -webkit-box-sizing: content-box;
                        box-sizing: content-box;
                        width: fit-content;
                        height: 16px;
                        line-height: 16px;
                        color: #fff;
                        border: 1px solid transparent;
                        border-color: #${intToHexString(info.medal_info.medal_color_border)};
                        white-space: nowrap;
                        border-radius: 2px;
                        font-family: "Microsoft YaHei", "Microsoft Sans Serif", "Microsoft SanSerf", "微软雅黑";
                        font-size: 10px;
                        position: relative;
                        cursor: pointer;
                        z-index: 1;
                    `

                    let medal_name = info.medal_info.medal_name, target_name = info.target_name
                    Object.keys(rules.detect).forEach(tagname => { rules.detect[tagname].keywords.forEach(key => { medal_name = highLight(medal_name, key); target_name = highLight(target_name, key) }); rules.detect[tagname].antikeywords.forEach(antikey => medal_name = highLight(medal_name, antikey)) })

                    medal.innerHTML =
                    `
                        <div>
                            <span>${medal_name}</span>
                        </div>
                        <div>
                            <span style="margin-left:4px;margin-right:4px;">${target_name}</span>
                        </div>
                        <div style="color:#${intToHexString(info.medal_info.medal_color_start)};width: 16px; text-align: center; border-top-left-radius: 1px; border-bottom-right-radius: 1px;background-color: white;box-shadow: 0px 0px 4px #ddd;">${info.medal_info.level}</div>
                    `
                    medal.children[0].style.cssText =
                    `
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-pack: center;
                        -ms-flex-pack: center;
                        justify-content: center;
                        -webkit-box-align: center;
                        -ms-flex-align: center;
                        align-items: center;
                        min-width: 12px;
                        text-align: center;
                        padding: 0 4px;
                        color: #fff;
                        border-top-left-radius: 1px;
                        border-bottom-left-radius: 1px;
                        background-image: linear-gradient(45deg, #${intToHexString(info.medal_info.medal_color_start)}, #${intToHexString(info.medal_info.medal_color_end)});
                        box-shadow: 0px 0px 4px #ddd;
                    `
                    medal.children[1].style.cssText =
                    `
                        color:black;
                        box-shadow: 2px 2px 0px #ddd inset;
                    `
                    medal.onmouseenter = e => e.target.style.opacity = 0.8
                    medal.onmouseleave = e => e.target.style.opacity = 1
                    medalList.push(medal)
                    if (i === 0) {
                        let clone = medal.cloneNode(true)
                        clone.children[0].children[0].textContent = info.medal_info.medal_name
                        clone.children[1].children[0].textContent = info.target_name
                        medalBtn = clone
                    }
                })
            }

            let existMedal = cur.querySelector('.fans-medal-item')
            if (tags.hasOwnProperty('MedalWall')) {
                cur.querySelector('.xzsx_detect_tag-medalwall-medalBtn')?.remove()
                container2.className = 'xzsx_detect_tag-medalwall-medalBtn'
                container2.appendChild(medalBtn)
                if (domain === 'live.bilibili.com' && existMedal !== null) {
                    container2 = existMedal
                    container2.style.cursor = 'pointer'
                    container2.onmouseenter = e => e.target.style.opacity = 0.8
                    container2.onmouseleave = e => e.target.style.opacity = 1
                    document.querySelector('#fans-medal-popover')?.remove()
                }
                container2.onclick = (e) => {
                    e.stopPropagation()
                    let ckey = medalWall.getAttribute('key'), key = getUname(dom)
                    if (ckey !== null && ckey === key) return
                    medalWall.setAttribute('key', key)
                    medalWall.innerHTML =
                    `
                        <div title="${getUname(dom)} / 勋章墙" class="xzsx_detect_tag-medalwall-title">${getUname(dom)} / 勋章墙</div>
                        <div class="xzsx_detect_tag-medalwall-container"></div>
                    `
                    let medalContainer = medalWall.querySelector('.xzsx_detect_tag-medalwall-container'), medalTitle = medalWall.querySelector('.xzsx_detect_tag-medalwall-title')
                    medalTitle.onclick = () => dom.scrollIntoView({ block: "center", inline: "center" })
                    medalTitle.onmouseenter = e => e.target.style.opacity = 0.8
                    medalTitle.onmouseleave = e => e.target.style.opacity = 1
                    medalContainer.style.height = medalList.length < 25 ? '120px' : '240px'
                    medalContainer.append(...medalList)
                    const [size1, size2] = waterfall(medalContainer, medalList, 8, 'Horizontal'), pos = e.target.getBoundingClientRect()
                    trackPanel.className = 'xzsx_detect_tag-trackpanel-hide'
                    medalWall.className = 'xzsx_detect_tag-medalwall-hide'

                    if (domain === 'live.bilibili.com') {
                        medalWall.style.position = 'fixed'
                        medalWall.style.right = '24px'
                        medalWall.style.top = '24px'
                    } else {
                        medalWall.style.position = 'absolute'
                        medalWall.style.left = (iframePos?.left ?? 0) + (pos.left + 260 > document.documentElement.clientWidth ? document.documentElement.clientWidth - 300 : pos.left + 10) + 'px'
                        medalWall.style.top = (iframePos?.top ?? 0) + document.scrollingElement.scrollTop + (pos.top + 220 > document.documentElement.clientHeight ? document.documentElement.clientHeight - 250 : pos.top + 20) + 'px'
                    }

                    medalWall.style.display = 'flex'
                    medalWall.style.height = size1 + (size2 > 400 ? 38 : 34) + 'px'
                    medalWall.style.width = size2 + 'px'
                    medalContainer.style.height = size1 + 'px'
                    medalContainer.style.width = size2 + 'px'
                    medalTitle.style.width = size2 - 8 + 'px'
                    medalWall.scrollLeft = 0
                    medalWall.className = 'xzsx_detect_tag-medalwall-show'

                    /** 滚轮控制横向滚动 */
                    if (size2 > 400) {
                        medalWall.addEventListener("wheel", e => {
                            e.preventDefault()
                            medalWall.scrollLeft += e.deltaY
                        })
                    }
                }
            }

            container.append(domain === 'live.bilibili.com' ? '' : container2, ...Tags, exist_btn && length > TAG_MAX_LENGTH ? icon : '', forceSync ? checkBtn : (JSON.parse((dom.attributes?.xzsx_isdeepchecked?.value ?? false)) || userTagsHash[uid]['isdeepchecked']) ? '' : checkBtn)
            tag_container === null && cur.append(container)
            if (domain === 'live.bilibili.com' && existMedal == null) cur?.insertBefore(container2, cur.firstChild)
        } catch (error) {
            console.log(error);
        }
    }

    /** 屏蔽操作
     * @param { Element | null } user 用户评论元素
     * @returns { void }
     */
    const block = (user) => {
        let closest = domain === 'live.bilibili.com' ?
            user : version ?
                user.closest(domainMap[domain].classMap[user.className][1])
                :
                user.parentNode.className !== 'reply-con' ?
                    user.parentNode
                    :
                    user.parentNode.parentNode

        switch (DEL_STYLE) {
            case '消息屏蔽':
                closest = closest.querySelector(user.parentNode.className === 'reply-con' ?
                    '.text-con'
                    :
                    domainMap[domain].classMap[user.className][2])

                closest.style.fontStyle = 'oblique'
                closest.textContent = '[消息已删除]'
                break
            case '完全删除':
                closest.style.display = 'none'
                break
            /** ... */
            default:
                break
        }
    }

    /** 查重
     * @param { string } uid 用户UID
     * @param { Element | null } user 用户评论元素
     * @returns { void }
     */
    const filte = (uid, user) => {
        if (DEL && userBlackList.has(uid)) block(user)
        if (DET && (!DEL || DEL_STYLE !== '完全删除') && uidset.has(uid)) appendTags(uid, user, userTags[uid])
        return uidset.has(uid) || userBlackList.has(uid)
    }

    /** 处理用户数据
     * @param { string } uid 用户UID
     * @param { string } resStr 用户信息字符串
     * @param { string } source 字符串来源
     * @param { boolean } forceSync 是否强制刷新
     * @param { function } resolve 调用结束Promise状态
     * @returns { void }
     */
    const dealRes = (uid, resStr, source, forceSync, resolve) => {
        try {
            if (DEL) {
                for (const key of Object.keys(rulesApply.blackList)) {
                    if (rulesApply.blackList[key] === '基于成分' && rulesApply.detect.hasOwnProperty(key) && rulesApply.detect[key].keywords.size > 0) {
                        rulesApply.detect[key].keywords.forEach(key => resStr.indexOf(key) !== -1 && userBlackList.add(uid))
                    }
                }
            }
            if (DET) {
                /** 结合黑子关键词atikeyword与粉丝关键词keyword查成分 */
                for (const tagname of Object.keys(rulesApply.detect)) {
                    if ((forceSync || !userTagsHash[uid]['filter'].has(tagname)) && rulesApply.detect[tagname].keywords.size > 0) {
                        if (!userTags[uid].hasOwnProperty(tagname)) {
                            userTags[uid][tagname] = { fan: { isFans: false, sources: {} }, anti: { isAnti: false, sources: {} } }
                        }
                        rulesApply.detect[tagname].keywords.forEach((keyword) => {
                            let index = resStr.indexOf(keyword)
                            while (index !== -1) {
                                userTags[uid][tagname].fan.isFans = true
                                if (!userTags[uid][tagname].fan.sources.hasOwnProperty(source)) {
                                    userTags[uid][tagname].fan.sources[source] = new Set()
                                }
                                /** 截取关键词前后十个字符 */
                                let begin = index, L = index, R = index + keyword.length, countL = 0, countR = 0
                                while (L > 0 && resStr[L] !== '』' && countL++ < 10) { --L }
                                while (R < resStr.length && resStr[R] !== '∏' && countR++ < 10) { ++R }
                                while (begin > 0 && resStr[begin] !== '『') { begin-- }
                                userTags[uid][tagname].fan.sources[source].add(keyword + 'Γ' + resStr.slice(begin, resStr.indexOf('』', begin) + 1) + resStr.slice(L + 1, R))
                                index = resStr.indexOf(keyword, index + 1)
                            }
                        })
                        if (rulesApply.detect[tagname].antikeywords.size > 0) {
                            rulesApply.detect[tagname].antikeywords.forEach((antikeyword) => {
                                let index = resStr.indexOf(antikeyword)
                                while (index !== -1) {
                                    userTags[uid][tagname].anti.isAnti = true
                                    if (!userTags[uid][tagname].anti.sources.hasOwnProperty(source)) {
                                        userTags[uid][tagname].anti.sources[source] = new Set()
                                    }
                                    /** 截取关键词前后十个字符 */
                                    let begin = index, L = index, R = index + antikeyword.length, countL = 0, countR = 0
                                    while (L > 0 && resStr[L] !== '』' && countL++ < 10) { --L }
                                    while (R < resStr.length && resStr[R] !== '∏' && countR++ < 10) { ++R }
                                    while (begin > 0 && resStr[begin] !== '『') { begin-- }
                                    userTags[uid][tagname].anti.sources[source].add(antikeyword + 'Γ' + resStr.slice(begin, resStr.indexOf('』', begin) + 1) + resStr.slice(L + 1, R))
                                    index = resStr.indexOf(antikeyword, index + 1)
                                }
                            })
                        }
                    }
                }
                uidset.add(uid)
            }
        } catch (error) {
            console.log(error)
        } finally {
            resolve()
        }
    }

    /** 渲染行为
     * @param { boolean } forceSync 是否强制刷新, 默认为否
     * @param { boolean } isJump 是否插队
     * @returns { Promise<void> }
     */
    const render = async (forceSync = false, isJump = false) => {
        if (!DET && !DEL) return
        try {
            /** 获取用户元素集合 */
            let DOMS = Array.from(await getDom(...[domainMap[domain].userDomClass, ...domain === 'space.bilibili.com' ? [500, true] : []])), curDocument = domain === 'live.bilibili.com' ? ciframe !== undefined ? ciframe.contentWindow.document : document : document

            /** 若需要插队则对数组排序进行特殊处理 */
            if (isJump) DOMS = DOMS.slice(0, _T._limit - _T._count).concat(DOMS.slice(_T._limit - _T._count, DOMS.length).reverse())

            for (const user of DOMS) {
                /** 过滤不在视野内的元素 */
                const pos = user.getBoundingClientRect()
                if (pos.top + pos.height < 0 || pos.top > curDocument.documentElement.clientHeight) continue

                /** 获取UID和昵称 */
                const uid = getUID(user), uname = getUname(user)

                /** 过滤未设置的Class  排除非评论元素 */
                if (!domainMap[domain].classMap.hasOwnProperty(user.className) || !uid) continue

                /** 过滤已查过成分的DOM元素 */
                if (!forceSync && JSON.parse(user.attributes?.xzsx_ischecked?.value ?? false)) continue
                else user.setAttribute('xzsx_ischecked', true)

                /** 过滤已查过成分的用户 */
                if (!forceSync && filte(uid, user)) continue

                /** 基于昵称屏蔽 */
                if (DEL && rules.blackList.hasOwnProperty(uname?.trim()) && rules.blackList[uname?.trim()] === '基于昵称') {
                    userBlackList.add(uid)
                    block(user)
                }

                /** 基于成分贴标签/屏蔽 */
                if (DET) {
                    if (!userTagsHash.hasOwnProperty(uid)) {
                        userTagsHash[uid] = { isdeepchecked: false, filter: new Set() }
                        userTags[uid] = {}
                    }
                    /** 根据模式选择不同的处理方式 */
                    switch (MODE) {
                        case '自动':
                            _T.enqueue({ uid, user, isdeep: false, forceSync }, isJump)
                            break
                        case '静默':
                            appendTags(uid, user, [], true)
                            continue
                        default:
                            break
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    /** 节流渲染次数
     * @type { () => void }
     */
    let _render = _throttle((forceSync, isJump) => render(forceSync, isJump), INTERVAL, { leading: false, trailing: true })[0]

    /** <===================================================================================列表监听===========================================================================================> */

    /** 监听器浏览器兼容
     * @type { MutationObserver }
     */
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    /** 监听元素
     * @param { boolean } params getDom 参数
     * @param { boolean } isMark 是否开启优化, 默认为false
     * @param { boolean } breakCondition 跳出情况, 默认为false
     * @param { boolean } extra 额外需要执行的函数, 默认为空函数
     * @returns { () => Promise<void> }
     */
    const Listen = (params, isMark = false, breakCondition = false, extra = async () => { }) => {
        if (!Array.isArray(params) || typeof (breakCondition) !== 'boolean' || typeof (isMark) !== 'boolean' || typeof (extra) !== 'function' || breakCondition) return async () => { }
        return async () => {
            const DOMS = await getDom(...params)
            for (const dom of DOMS) {
                if (isMark && dom.attributes?.xzsx_islistened?.value) continue
                new MutationObserver(() => { _render(false, true); extra() }).observe(dom, { childList: true })
                isMark && dom.setAttribute('xzsx_islistened', true)
            }
        }
    }

    /** 动态页面监听子列表
     * @type { () => Promise<void> }
     */
    const ListenSubSubReplyList = Listen(['.comment-list,.reply-box', ...domain === 'space.bilibii.com' ? [250, true] : []], true)

    /** 监听子评论列表
     * @type { () => Promise<void> }
     */
    const ListenSubReplyList = Listen(
        [versionMap[domain][version].subList],
        true,
        domain === 'live.bilibili.com',
        async () => {
            if (domain === 'space.bilibili.com') {
                await Listen(['.comment-list', 250, true], true, false, async () => ListenSubSubReplyList())()
                await ListenSubSubReplyList()
            }
        }
    )

    /** 监听主评论列表
     * @type { () => Promise<void> }
     */
    const ListenReplyList = Listen([versionMap[domain][version].mainList], true, false, async () => await ListenSubReplyList())

    /** 滚动页面触发渲染&防抖 */
    const _dscroll = _debounce(() => render(), 100, { leading: false, trailing: true })[0]

    /** 监听直播页面的特殊滚动条 
    * @returns { Promise<void> }
    */
    const ListenScrollBar = async () => {
        const scroller = await getDom('#chat-history-list > div.ps__scrollbar-y-rail')
        scroller.forEach(ele => new MutationObserver(() => _dscroll()).observe(ele, { attributeFilter: ['style'] }))
    }

    /** 批量监听
     * @returns { Promise<void> }
     */
    const batchListen = async () => {
        /** 监听主列表 */
        await ListenReplyList()

        /** 监听子列表 */
        await ListenSubReplyList()

        /** 动态页面额外监听的子列表 */
        domain === 'space.bilibili.com' && await ListenSubSubReplyList()

        /** 直播页面额外监听列表特殊滚动条 */
        domain === 'live.bilibili.com' && await ListenScrollBar()
    }

    /** 初始渲染 */
    _render()

    /** 初始监听 */
    await batchListen()

    /** 监听页面滚动并检测视野范围内的用户成分 */
    window.onscroll = _dscroll

    /** 单页面监听URL变化重新监听评论列表 */
    history.replaceState = bindHistoryEvent('replaceState')
    window.onhashchange = async () => { _T.resetqueue(); _T.reset(); await batchListen() }
    window.onpopstate = async () => { _T.resetqueue(); _T.reset(); await batchListen() }
    window.addEventListener('replaceState', async () => { _T.resetqueue(); _T.reset(); await batchListen() })
}

script()