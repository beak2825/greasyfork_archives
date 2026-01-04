// ==UserScript==
// @name            ChatGPT with Date
// @name:en         ChatGPT with Date
// @name:zh-CN      ChatGPT with Date
// @namespace       https://github.com/jiang-taibai/chatgpt-with-date
// @version         2.1.0
// @description     显示 ChatGPT 历史对话时间 与 实时对话时间的 Tampermonkey 插件。
// @description:zh-cn   显示 ChatGPT 历史对话时间 与 实时对话时间的 Tampermonkey 插件。
// @description:en  Tampermonkey plugin for displaying ChatGPT historical and real-time conversation time.
// @author          CoderJiang
// @license         MIT
// @match           *://chat.openai.com/*
// @match           *://chatgpt.com/*
// @match           *://jiang-taibai.github.io/chatgpt-with-date-config-page*
// @icon            https://cdn.coderjiang.com/project/chatgpt-with-date/logo.svg
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_listValues
// @grant           GM_deleteValue
// @grant           GM_addElement
// @grant           GM_addStyle
// @grant           GM_openInTab
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/493949/ChatGPT%20with%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/493949/ChatGPT%20with%20Date.meta.js
// ==/UserScript==

// 更新日志
/*
v2.1.0 - 2025-06-02 00:22:54
    修复：修复一直是本地时间的问题（#9）
    优化：优先渲染最近的消息时间标签
    优化：优化渲染性能，在用户操作页面时停止渲染时间标签，避免页面卡顿
v2.0.4 - 2024-12-18 10:15:20
    功能：提供统一的 DEBUG 开关
    修复：监听全局而不是局部的 main 标签，解决刚开始消息无法被监听到的问题
    功能：提供取消监听的接口，供未来扩展使用
v2.0.3 - 2024-08-21 00:45:25
    优化：修改链接匹配机制
v2.0.2 - 2024-07-29 02:11:47
    优化：统一访问 GitHub 部署的资源
    新功能：支持分享界面的时间显示
    修复：完善提示词的语法提示，并提供中英双版本
    新增：提供英文文档
    优化：提供更多菜单项，方便用户查看文档、反馈等
v2.0.1 - 2024-06-15 16:33:35
    修复：解决“切换上下一个消息时时间强制变成当前时间”的问题
v2.0.0 - 2024-06-13 16:58:05
    修复：适应新版 ChatGPT 对话型 UI
    新功能：提供全新的配置页面（其实是 ChatGPT 不支持 unsafe-eval 了）
    功能调整：为适应新版 UI，不再支持“时间徽标插入位置”
v1.3.0 - 2024-05-06 19:48:01
    新功能：i18n 国际化支持
    新功能：提供重置脚本的功能
    新功能：提供适应本插件的提示词来生成 HTML、CSS、JavaScript 代码
    新功能：提供教程入口
    新功能：可收起、展开配置面板
    优化：代码输入框支持自定义高度
v1.2.3 - 2024-05-04 20:04:51
    修复：修复无法正常运行用户自定义代码的问题
    优化：优化即使用户自定义代码出错也不会影响整个脚本的运行
    优化：将渲染顺序调整为最近的消息优先渲染
v1.2.2 - 2024-05-04 15:24:44
    修复：修复消息 ID 属性变化后找不到目标消息 DOM 节点的问题
v1.2.1 - 2024-05-04 14:33:12
    修复：ChatGPT 更新域名
v1.2.0 - 2024-05-03 21:26:43
    优化：限制每次渲染时间标签的次数以及总时长，避免页面卡顿
    优化：设置时间标签渲染函数异步执行，避免阻塞页面渲染
    优化：修改 Fetch 劫持 URL 匹配规则，更加精确以免干扰其他请求。并在 URL 匹配成功时才进行具体的劫持操作
    优化：选择模板时直接显示时间格式的示例，而不是冰冷的模板HTML字符串
    新功能：添加更多时间格式的元素，例如星期、月份（英文）等
    新功能：添加更多时间格式化规则，例如 12 小时制、24 小时制等
    新功能：提供自定义样式的 HTML、CSS、JavaScript 的代码编辑器与注入系统
    新功能：提供创建时间标签的生命周期钩子函数 window.beforeCreateTimeTag(messageId, timeTagHTML) 和 window.afterCreateTimeTag(messageId, timeTagNode)
v1.1.0 - 2024-05-02 17:50:04
    新增：添加更多时间格式的模板
*/
// Changelog
/*
v2.1.0 – 2025-06-02 00:22:54
    Fix: Corrected the issue where timestamps were always displayed in local time (#9)
    Optimization: Prioritize rendering the time labels for the most recent messages first
    Optimization: Improved rendering performance by pausing timestamp updates when the user is interacting with the page to prevent lag
v2.0.4 - 2024-12-18 10:15:20
    Feature: Provide a unified DEBUG switch.
    Fix: Listen to the global main tag instead of a local one to resolve the issue where messages could not be detected initially.
    Feature: Provide an interface to cancel listeners for future extensibility.
v2.0.3 - 2024-08-21 00:45:25
    Optimization: modify link matching mechanism
v2.0.2 - 2024-07-29 02:11:47
    Optimization: Unified access to resources hosted on GitHub.
    New Feature: Support for displaying time on shared interfaces.
    Fix: Improve the grammatical hints of prompt words, and provide both Chinese and English versions.
    New: Provide English documentation
    Optimization: provide more menu items for users to view documents, feedback, etc.
v2.0.1 - 2024-06-15 16:33:35
    Fix: Resolved the issue where switching between messages forces the time to update to the current time.
v2.0.0 - 2024-06-13 16:58:05
    Fix: Adapted to the new ChatGPT conversational UI.
    New Feature: Introduced a new configuration page (due to ChatGPT's lack of support for unsafe-eval).
    Feature Adjustment: To accommodate the new UI, support for "time badge insertion position" was removed.
v1.3.0 - 2024-05-06 19:48:01
    New Features:
        Internationalization (i18n) support.
        Functionality to reset the script.
        Custom prompts to generate HTML, CSS, and JavaScript code suitable for this plugin.
        Tutorial access.
        Ability to collapse and expand the configuration panel.
    Optimization: Support for customizing the height of the code input box.
v1.2.3 - 2024-05-04 20:04:51
    Fix: Resolved an issue preventing custom user code from running properly.
    Optimization:
        Ensured that errors in custom code do not affect the entire script.
        Adjusted the rendering order to prioritize the most recent messages.
v1.2.2 - 2024-05-04 15:24:44
    Fix: Resolved issues with message ID attribute changes leading to failures in locating target message DOM nodes.
v1.2.1 - 2024-05-04 14:33:12
    Fix: Updated domain names for ChatGPT.
v1.2.0 - 2024-05-03 21:26:43
    Optimizations:
        Limited the number and total duration of time label renderings to prevent page lag.
        Set time label rendering functions to execute asynchronously to avoid blocking page rendering.
        Enhanced Fetch hijacking URL matching rules for accuracy and minimized interference with other requests. Hijacking operations are now performed only when URL matches are confirmed.
        Replaced cold template HTML strings with direct examples of time formats when selecting templates.
    New Features:
        Added more elements for time formats, such as weekdays and months in English.
        Added more rules for time formatting, such as 12-hour and 24-hour formats.
        Introduced a code editor and injection system for custom HTML, CSS, and JavaScript styles.
        Provided lifecycle hook functions window.beforeCreateTimeTag(messageId, timeTagHTML) and window.afterCreateTimeTag(messageId, timeTagNode).
v1.1.0 - 2024-05-02 17:50:04
    New Feature: Added more templates for time formats.
 */

/**
 * 通用堆（Heap）实现，支持自定义排序函数，并能自动扩容与缩容
 */
class Heap {
    /**
     * 构造函数
     * @param {function(a: any, b: any): number} comparator 排序比较函数：
     *    返回值 < 0 表示 a 优先级更高（放在前面）
     *    返回值 > 0 表示 b 优先级更高
     *    返回值 = 0 表示 a、b 优先级相同
     * @param {number} initialCapacity 初始容量（可选，默认为 16）
     */
    constructor(comparator = (a, b) => a - b, initialCapacity = 16) {
        if (typeof comparator !== 'function') {
            throw new Error('比较函数 comparator 必须是函数');
        }
        if (!Number.isInteger(initialCapacity) || initialCapacity <= 0) {
            throw new Error('初始容量 initialCapacity 必须是大于 0 的整数');
        }
        this.comparator = comparator;        // 保存用户提供的比较函数
        this.capacity = initialCapacity;     // 当前内部数组的容量
        this.size = 0;                       // 当前堆中元素个数
        this.data = new Array(this.capacity); // 内部存储堆元素的数组
    }

    /**
     * 插入一个元素到堆中
     * @param {any} element 待插入的元素
     */
    push(element) {
        if (element === undefined || element === null) {
            return;
        }
        // 如果当前元素数量达到容量上限，则扩容为原来的 2 倍
        if (this.size >= this.capacity) {
            this._resize(this.capacity * 2);
        }
        // 将新元素放到数组尾部，然后上滤（heapifyUp）
        this.data[this.size] = element;
        this._heapifyUp(this.size);
        this.size += 1;
    }

    /**
     * 返回堆顶元素（优先级最高），不删除
     * @returns {any|null} 堆顶元素，若堆为空则返回 null
     */
    peek() {
        return this.size > 0 ? this.data[0] : null;
    }

    /**
     * 弹出并返回堆顶元素，同时恢复堆性质；若堆为空，返回 null
     * @returns {any|null} 堆顶元素或 null
     */
    pop() {
        if (this.size === 0) {
            return null;
        }
        const top = this.data[0];
        // 把最后一个元素放到堆顶位置，然后下滤（heapifyDown）
        this.size -= 1;
        this.data[0] = this.data[this.size];
        this.data[this.size] = undefined; // 可选：清除引用，利于 GC
        this._heapifyDown(0);

        // 如果 size 小于等于 capacity/4，则缩容到 capacity/2，但最低容量至少为 1
        if (this.size > 0 && this.size <= Math.floor(this.capacity / 4)) {
            const newCap = Math.max(Math.floor(this.capacity / 2), 1);
            this._resize(newCap);
        }
        return top;
    }

    /**
     * 返回当前堆中元素个数
     * @returns {number}
     */
    getSize() {
        return this.size;
    }

    /**
     * 判断堆是否为空
     * @returns {boolean} 为空返回 true，否则 false
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * 私有方法：上滤操作，将索引 index 位置的元素不断向上移动，直到堆性质恢复
     * @param {number} index 当前待上滤的节点索引
     */
    _heapifyUp(index) {
        let current = index;
        // 不断比较当前节点与其父节点，若当前优先级更高，则交换
        while (current > 0) {
            const parentIdx = Math.floor((current - 1) / 2);
            const cmp = this.comparator(this.data[current], this.data[parentIdx]);
            // comparator 返回值 < 0 表示 current 更优先，需要上移
            if (cmp < 0) {
                this._swap(current, parentIdx);
                current = parentIdx;
            } else {
                break;
            }
        }
    }

    /**
     * 私有方法：下滤操作，将索引 index 位置的元素不断向下移动，直到堆性质恢复
     * @param {number} index 当前待下滤的节点索引
     */
    _heapifyDown(index) {
        let current = index;
        while (true) {
            const leftIdx = 2 * current + 1;
            const rightIdx = 2 * current + 2;
            let bestIdx = current;

            // 如果左孩子存在且优先级更高，则记录为候选
            if (
                leftIdx < this.size &&
                this.comparator(this.data[leftIdx], this.data[bestIdx]) < 0
            ) {
                bestIdx = leftIdx;
            }
            // 如果右孩子存在且优先级更高，则更新候选
            if (
                rightIdx < this.size &&
                this.comparator(this.data[rightIdx], this.data[bestIdx]) < 0
            ) {
                bestIdx = rightIdx;
            }

            // 如果当前节点已是最优，则不需要继续下滤
            if (bestIdx === current) {
                break;
            }

            // 否则交换并继续下滤
            this._swap(current, bestIdx);
            current = bestIdx;
        }
    }

    /**
     * 私有方法：交换数组中索引 i 和 j 的元素
     * @param {number} i 索引 i
     * @param {number} j 索引 j
     */
    _swap(i, j) {
        const tmp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = tmp;
    }

    /**
     * 私有方法：调整内部数组容量，复制元素到新的数组
     * @param {number} newCapacity 新容量
     */
    _resize(newCapacity) {
        const newData = new Array(newCapacity);
        // 只复制已有的元素（0 .. size-1）
        for (let i = 0; i < this.size; i++) {
            newData[i] = this.data[i];
        }
        this.data = newData;
        this.capacity = newCapacity;
    }
}

(function () {
    'use strict';

    const IsConfigPage = window.location.hostname === 'jiang-taibai.github.io'
    const DEBUG = false

    class SystemConfig {
        static Common = {
            ApplicationName: 'ChatGPT with Date',
        }
        static Main = {
            WindowRegisterKey: 'ChatGPTWithDate',
        }
        static Logger = {
            TimeFormatTemplate: "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}.{ms}",
        }
        static TimeRender = {
            Interval: 200,
            IdleCallbackTimeout: 1000,   // 页面空闲时渲染时间标签，但如果等待空闲超时，则强制渲染；单位毫秒。
            TimeClassName: 'chatgpt-time-container',
            BatchSize: 200,
            BatchTimeout: 200,
            RenderRetryCount: 3,
            BasicStyle: `
                .chatgpt-time-container.user {
                    display:flex;
                    justify-content: flex-end;
                }
                .chatgpt-time-container.assistant {
                    display:flex;
                    justify-content: flex-start;
                }
            `,
            TimeTagTemplates: [
                // 默认：2023-10-15 12:01:00
                `<span style="padding-right: 1rem; color: #ababab; font-size: 0.9em;">{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}</span>`,
                // 美国：Oct 15, 2023 12:01 PM
                `<span style="padding-right: 1rem; color: #ababab; font-size: 0.9em;">{MM#shortname@en} {dd}, {yyyy} {HH#12}:{mm} {HH#tag}</span>`,
                // 英国：01/01/2024 12:01
                `<span style="padding-right: 1rem; color: #ababab; font-size: 0.9em;">{dd}/{MM}/{yyyy} {HH}:{mm}</span>`,
                // 日本：2023年10月15日 12:01
                `<span style="padding-right: 1rem; color: #ababab; font-size: 0.9em;">{yyyy}年{MM}月{dd}日 {HH}:{mm}</span>`,
                // 显示毫秒数：2023-10-15 12:01:00.000
                `<span style="padding-right: 1rem; color: #ababab; font-size: 0.9em;">{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}.{ms}</span>`,
                // 复杂模板
                `<span style="padding-right: 1rem; margin-bottom: .5rem; background: #2B2B2b; border-radius: 8px; padding: 1px 10px; color: #717171; font-size: 0.9em;">{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}</span>`,
                `<span style="padding-right: 1rem; margin-bottom: .5rem; background: #d7d7d7; border-radius: 8px; padding: 1px 10px; color: #2b2b2b; font-size: 0.9em;">{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}</span>`,
                `<span style="padding-right: 1rem; margin-bottom: .5rem; color: #E0E0E0; font-size: 0.9em;"><span style="background: #333; padding: 1px 4px 1px 10px; display: inline-block; border-radius: 8px 0 0 8px;">{yyyy}-{MM}-{dd}</span><span style="background: #606060; padding: 1px 10px 1px 4px; display: inline-block; border-radius: 0 8px 8px 0;">{HH}:{mm}:{ss}</span></span>`,
                `<span style="padding-right: 1rem; margin-bottom: .5rem; color: #E0E0E0; font-size: 0.9em;"><span style="background: #848484; padding: 1px 4px 1px 10px; display: inline-block; border-radius: 8px 0 0 8px;">{yyyy}-{MM}-{dd}</span><span style="background: #a6a6a6; padding: 1px 10px 1px 4px; display: inline-block; border-radius: 0 8px 8px 0;">{HH}:{mm}:{ss}</span></span>`,
            ],
            BasicStyleKey: 'time-render',
            AdditionalStyleKey: 'time-render-advanced',
            AdditionalScriptKey: 'time-render-advanced',
        }
        static ConfigPanel = {
            AppID: 'CWD-Configuration-Panel',
            Icon: {
                Close: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M834.858667 191.914667l-6.101334-5.546667-5.162666-3.84-5.674667-3.370667a67.712 67.712 0 0 0-80.469333 11.306667L512 416.042667 287.274667 191.36l-2.688-2.56c-27.946667-24.234667-68.266667-24.192-92.672 0.170667l-4.821334 5.12-4.565333 6.144-3.413333 5.674666a67.797333 67.797333 0 0 0 11.306666 80.469334l225.706667 225.664-227.2 227.285333c-24.32 28.16-24.32 68.394667 0 92.885333l5.12 4.778667 6.144 4.608 5.674667 3.370667a67.712 67.712 0 0 0 80.469333-11.306667l225.621333-225.706667 227.072 227.2c28.586667 24.789333 68.906667 23.936 94.293334-1.493333l4.565333-5.034667 4.096-5.632a67.882667 67.882667 0 0 0-8.618667-85.248L607.786667 512l224.554666-224.597333 4.138667-4.394667c23.04-26.752 22.4-66.986667-1.621333-91.136z"></path></svg>',
                Restore: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M597.333333 85.333333a128 128 0 0 1 127.786667 120.490667L725.333333 213.333333v21.333334h170.666667a42.666667 42.666667 0 0 1 4.992 85.034666L896 320h-42.666667V810.666667a128 128 0 0 1-120.490666 127.786666L725.333333 938.666667H298.666667a128 128 0 0 1-127.786667-120.490667L170.666667 810.666667V320H128a42.666667 42.666667 0 0 1-4.992-85.034667L128 234.666667h170.666667V213.333333a128 128 0 0 1 120.490666-127.786666L426.666667 85.333333h170.666666z m170.666667 234.666667H256V810.666667a42.666667 42.666667 0 0 0 37.674667 42.368L298.666667 853.333333h426.666666a42.666667 42.666667 0 0 0 42.368-37.674666L768 810.666667V320zM426.666667 426.666667a42.666667 42.666667 0 0 1 42.368 37.674666L469.333333 469.333333v213.333334a42.666667 42.666667 0 0 1-85.034666 4.992L384 682.666667v-213.333334a42.666667 42.666667 0 0 1 42.666667-42.666666z m170.666666 0a42.666667 42.666667 0 0 1 42.368 37.674666L640 469.333333v213.333334a42.666667 42.666667 0 0 1-85.034667 4.992L554.666667 682.666667v-213.333334a42.666667 42.666667 0 0 1 42.666666-42.666666z m0-256h-170.666666a42.666667 42.666667 0 0 0-42.368 37.674666L384 213.333333v21.333334h256V213.333333a42.666667 42.666667 0 0 0-37.674667-42.368L597.333333 170.666667z"></path></svg>',
                Language: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M757.205333 473.173333c5.333333 0 10.453333 2.090667 14.250667 5.717334a19.029333 19.029333 0 0 1 5.888 13.738666v58.154667h141.184c11.093333 0 20.138667 8.704 20.138667 19.413333v232.704a19.797333 19.797333 0 0 1-20.138667 19.413334h-141.184v96.981333a19.754667 19.754667 0 0 1-20.138667 19.370667H716.8a20.565333 20.565333 0 0 1-14.250667-5.674667 19.029333 19.029333 0 0 1-5.888-13.696v-96.981333h-141.141333a20.565333 20.565333 0 0 1-14.250667-5.674667 19.029333 19.029333 0 0 1-5.930666-13.738667v-232.704c0-5.12 2.133333-10.112 5.930666-13.738666a20.565333 20.565333 0 0 1 14.250667-5.674667h141.141333v-58.154667c0-5.162667 2.133333-10.112 5.888-13.738666a20.565333 20.565333 0 0 1 14.250667-5.674667h40.362667zM192.597333 628.394667c22.272 0 40.32 17.365333 40.32 38.826666v38.741334c0 40.618667 32.512 74.368 74.624 77.397333l6.058667 0.213333h80.64c21.930667 0.469333 39.424 17.706667 39.424 38.784 0 21.077333-17.493333 38.314667-39.424 38.784H313.6c-89.088 0-161.28-69.461333-161.28-155.178666v-38.741334c0-21.461333 18.005333-38.826667 40.277333-38.826666z m504.106667 0h-80.64v116.394666h80.64v-116.394666z m161.28 0h-80.64v116.394666h80.64v-116.394666zM320.170667 85.333333c8.234667 0 15.658667 4.778667 18.773333 12.202667H338.773333l161.322667 387.84c2.517333 5.973333 1.706667 12.8-2.005333 18.090667a20.394667 20.394667 0 0 1-16.725334 8.533333h-43.52a20.181333 20.181333 0 0 1-18.688-12.202667L375.850667 395.648H210.901333l-43.264 104.149333A20.181333 20.181333 0 0 1 148.906667 512H105.514667a20.394667 20.394667 0 0 1-16.725334-8.533333 18.773333 18.773333 0 0 1-2.005333-18.090667l161.28-387.84A20.181333 20.181333 0 0 1 266.88 85.333333h53.290667zM716.8 162.901333c42.794667 0 83.84 16.341333 114.090667 45.44a152.234667 152.234667 0 0 1 47.232 109.738667v38.741333c-0.469333 21.077333-18.389333 37.930667-40.32 37.930667s-39.808-16.853333-40.32-37.930667v-38.741333c0-20.608-8.490667-40.32-23.637334-54.869333a82.304 82.304 0 0 0-57.045333-22.741334h-80.64c-21.888-0.469333-39.424-17.706667-39.424-38.784 0-21.077333 17.493333-38.314667 39.424-38.784h80.64z m-423.424 34.304L243.2 318.037333h100.48L293.418667 197.205333z"></path></svg>',
                Documentation: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M768.085333 85.333333a128 128 0 0 1 127.701334 120.490667L896 213.333333v597.333334a128 128 0 0 1-120.405333 127.786666l-7.509334 0.213334H256.256a128 128 0 0 1-127.744-120.490667L128.298667 810.666667v-80A43.050667 43.050667 0 0 1 128 725.674667l0.298667-4.949334V213.333333A128 128 0 0 1 248.746667 85.546667L256.256 85.333333h511.829333zM810.666667 768.341333H213.589333V810.666667a42.666667 42.666667 0 0 0 37.717334 42.368l4.949333 0.298666h511.829333a42.666667 42.666667 0 0 0 42.368-37.674666L810.666667 810.666667v-42.325334zM768.085333 170.666667h-180.650666v233.728a42.666667 42.666667 0 0 1-61.738667 38.144l-4.096-2.346667-82.218667-53.376-85.077333 53.674667a42.666667 42.666667 0 0 1-64.341333-26.453334l-0.810667-4.693333-0.256-4.949333V170.666667h-32.64a42.666667 42.666667 0 0 0-42.368 37.674666L213.632 213.333333l-0.042667 469.674667H810.666667L810.709333 213.333333a42.666667 42.666667 0 0 0-37.674666-42.368L768.085333 170.666667z m-265.941333 20.352h-128v136.021333l42.88-26.965333a42.666667 42.666667 0 0 1 36.181333-4.394667l4.992 2.048 4.778667 2.688 39.168 25.386667V191.018667z"></path></svg>',
                Minimize: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M202.922667 562.176H407.466667l2.986666 0.128 3.84 0.554667 3.285334 0.810666 4.565333 1.706667 5.205333 2.986667 3.541334 2.688 3.456 3.413333c1.536 1.706667 2.858667 3.413333 4.053333 5.333333l1.92 3.328 1.834667 4.181334 1.28 4.138666 0.938666 4.352 0.426667 3.456 0.128 3.328v217.088c0 22.314667-16.768 40.405333-37.461333 40.405334-19.2 0-35.072-15.573333-37.205334-35.669334l-0.256-4.736V698.026667l-178.432 186.581333a35.541333 35.541333 0 0 1-52.949333-0.896 42.837333 42.837333 0 0 1-2.346667-53.418667l3.157334-3.754666L314.88 642.986667H202.922667c-20.693333 0-37.461333-18.090667-37.461334-40.405334 0-20.736 14.464-37.802667 33.109334-40.106666l4.352-0.298667z m602.538666-1.621333c20.693333 0 37.461333 18.090667 37.461334 40.405333 0 20.736-14.464 37.802667-33.109334 40.106667l-4.352 0.298666H690.346667l175.530666 183.552c14.848 15.530667 15.232 41.130667 0.853334 57.173334a35.498667 35.498667 0 0 1-49.408 4.181333l-3.584-3.285333-179.968-188.202667v119.978667c0 22.314667-16.768 40.448-37.461334 40.448-19.2 0-35.072-15.616-37.248-35.712l-0.213333-4.693334v-213.845333c0-22.314667 16.768-40.405333 37.461333-40.405333h209.152zM188.16 136.234667l3.541333 3.328 179.797334 190.464V209.237333c0-22.314667 16.768-40.448 37.461333-40.448 19.2 0 35.072 15.616 37.248 35.712l0.213333 4.693334v202.154666c0 6.058667-1.237333 11.818667-3.456 17.024a39.765333 39.765333 0 0 1-1.365333 6.826667l-0.853333 5.205333c-3.541333 16.384-16.298667 28.928-32.085334 30.890667l-4.352 0.298667H199.808c-20.693333 0-37.461333-18.133333-37.461333-40.448 0-20.736 14.464-37.802667 33.109333-40.106667l4.352-0.298667h122.112L139.221333 197.248a42.709333 42.709333 0 0 1-0.512-57.173333 35.456 35.456 0 0 1 49.450667-3.84z m698.368 5.333333c12.714667 15.402667 12.501333 38.4 0.213333 53.461333l-3.328 3.626667-190.250666 182.314667h123.349333c20.693333 0 37.461333 18.133333 37.461333 40.448 0 20.736-14.464 37.802667-33.109333 40.106666l-4.352 0.298667h-220.202667c-20.693333 0-37.461333-18.090667-37.461333-40.405333V204.330667c0-22.314667 16.768-40.405333 37.461333-40.405334 19.2 0 35.029333 15.573333 37.205334 35.669334l0.256 4.736v125.44l199.893333-191.573334a35.584 35.584 0 0 1 52.906667 3.413334z"></path></svg>',
                Maximize: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M411.648 547.328a36.565333 36.565333 0 0 1 50.688 3.413333c13.866667 14.805333 14.933333 38.101333 3.2 54.186667l-3.2 3.925333-191.701333 204.970667H396.8l4.48 0.298667c19.114667 2.389333 33.92 19.754667 33.92 40.789333 0 21.077333-14.805333 38.4-33.92 40.832L396.8 896H166.4l-4.48-0.256c-17.621333-2.218667-31.616-17.152-33.664-36.010667L128 853.76v-250.026667l0.256-4.778666c2.218667-20.437333 18.432-36.266667 38.144-36.266667s35.925333 15.829333 38.144 36.266667l0.256 4.778666v164.394667l203.264-217.386667 3.584-3.413333z m215.552 340.48l-4.48-0.256c-19.114667-2.346667-33.92-19.712-33.92-40.789333 0-21.077333 14.805333-38.4 33.92-40.789334l4.48-0.298666h155.008l-218.026667-194.346667-3.456-3.541333a43.221333 43.221333 0 0 1-1.408-54.272 36.693333 36.693333 0 0 1 50.176-8.32l3.882667 3.029333 205.824 183.466667V600.32l0.256-4.778667c2.218667-20.437333 18.432-36.266667 38.144-36.266666s35.925333 15.829333 38.144 36.266666l0.256 4.778667v246.442667c0 21.077333-14.805333 38.4-33.92 40.789333l-4.48 0.298667h-230.4zM396.8 128c21.205333 0 38.4 18.389333 38.4 41.088 0 21.034667-14.805333 38.4-33.92 40.789333l-4.48 0.256H264.789333L459.776 384c16.298667 14.506667 18.517333 40.405333 4.906667 57.856a36.693333 36.693333 0 0 1-50.176 8.277333l-3.882667-3.029333-205.824-183.466667V420.266667c0 22.656-17.194667 41.045333-38.4 41.045333-19.712 0-35.925333-15.829333-38.144-36.266667L128 420.266667V169.088c0-21.077333 14.805333-38.4 33.92-40.832L166.4 128h230.4z m460.8 0c19.712 0 35.925333 15.872 38.144 36.266667l0.256 4.821333v246.4c0 22.698667-17.194667 41.088-38.4 41.088-19.712 0-35.925333-15.872-38.144-36.266667l-0.256-4.821333V259.114667l-205.482667 187.648a36.693333 36.693333 0 0 1-54.144-4.608 43.264 43.264 0 0 1 0.853334-54.314667l3.413333-3.584 190.72-174.08H627.2c-21.205333 0-38.4-18.432-38.4-41.088 0-21.077333 14.805333-38.4 33.92-40.832L627.2 128h230.4z"></path></svg>',
            },
            StyleKey: 'config-panel',
            ApplicationRegisterKey: 'configPanel',
            I18N: {
                default: 'zh',
                rollback: 'zh',
                supported: ['zh', 'en'],
                zh: {
                    'restore-info': '恢复出厂设置',
                    'restore-warn': '确定恢复出厂设置？你的所有自定义配置将被清除！',
                    'toggle-language-info': 'Switch to English',
                    'documentation-info': '查看教程',
                    'documentation-international-access': '国际访问',
                    'documentation-china-access': '中国访问',
                    'template': '模板',
                    'preview': '预览',
                    'code': '代码',
                    'position': '位置',
                    'advance': '高级',
                    'reset': '重置',
                    'apply': '应用',
                    'save': '保存并关闭',
                    'apply-failed': '应用失败',
                    'input-html': '请输入 HTML 代码',
                    'input-css': '请输入 CSS 代码',
                    'input-js': '请输入 JavaScript 代码',
                    'position-after-role-left': '角色之后（靠左）',
                    'position-after-role-right': '角色之后（靠右）',
                    'position-below-role': '角色之下',
                    'gpt-prompt-info': '不会写代码？复制提示词让 ChatGPT 帮你写！',
                    'copy-success-info': '复制成功，发给 ChatGPT 吧！',
                    'js-invalid-info': 'JS 代码无效',
                    'gpt-prompt': 'IyAxLiDku7vliqHnroDku4sKCuS9oOmcgOimgeWGmSBIVE1M44CBQ1NT44CBSmF2YVNjcmlwdCDku6PnoIHvvIzlrp7njrDmiJHnmoTpnIDmsYLvvIzlkI7pnaLmiJHlsIbor6bnu4bku4vnu43kvaDlupTor6XmgI7kuYjlhpnku6PnoIHjgIIKCiMgMi4gSFRNTCDopoHmsYIKCuS9oOmcgOimgeWGmeS4gOS4quaXpeacn+aXtumXtOeahOaooeadvyBIVE1MIOWtl+espuS4su+8jOS9oOWPr+S7peS9v+eUqOWNoOS9jeespuadpeihqOekuuaXtumXtOWFg+e0oO+8jOS+i+Wmgu+8mgoKYGBgaHRtbAo8ZGl2IGNsYXNzPSJ0ZXh0LXRhZy1ib3giPgogICAgPHNwYW4gY2xhc3M9ImRhdGUiPnt5eXl5fS17TU19LXtkZH08L3NwYW4+CiAgICA8c3BhbiBjbGFzcz0idGltZSI+e0hIfTp7bW19Ontzc308L3NwYW4+CjwvZGl2PgpgYGAKCuWQjumdouS8muS7i+e7jeS9oOaAjuS5iOeUqCBKYXZhU2NyaXB0IOadpeWunueOsOaYvuekuueJueWumueahOaXtumXtOOAggoKIyAzLiBDU1Mg6KaB5rGCCgooMSkg5LiN5YWB6K645L2/55So5qCH562+6YCJ5oup5Zmo77yM5Y+q6IO95L2/55So57G76YCJ5oup5Zmo5oiWIElEIOmAieaLqeWZqAooMikg5bC96YeP5L2/55So5ZCO5Luj6YCJ5oup5Zmo77yM5LiN5rGh5p+T5YWo5bGA5qC35byPCigzKSDlsL3ph4/kuI3opoHkvb/nlKggYCFpbXBvcnRhbnRgCgojIDQuIEphdmFTY3JpcHQg6KaB5rGCCgojIyA0LjEg5o+Q5L6b55qEIEFQSSDmjqXlj6MKCkFQSSDlrprkuYnlnKggd2luZG93IOS4iu+8jOWmguacieW/heimgeS9oOmcgOimgeWcqCBKUyDohJrmnKzlhoXph43lhpnlh73mlbDjgIIKCi0gd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLCB0ZW1wbGF0ZSk6IOagueaNriBEYXRlIOWvueixoeWwhuaooeadvyBIVE1MIOWtl+espuS4suS4reeahOWGheWuueabv+aNouS4uiBkYXRlCiAg5a+56LGh5oyH5a6a55qE5pe26Ze0CiAgICAtIGRhdGU6IEphdmFTY3JpcHQgRGF0ZSDlrp7kvosKICAgIC0gdGVtcGxhdGU6IEhUTUwg5a2X56ym5Liy77yM5Y2z5L2g5YaZ55qEIEhUTUwg5Luj56CBCiAgICAtIOi/lOWbnuWAvDog5qC85byP5YyW5pe26Ze05ZCO55qEIEhUTUwg5Luj56CBCi0gd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5iZWZvcmVDcmVhdGVUaW1lVGFnKG1lc3NhZ2VJZCwgdGltZVRhZ0hUTUwpOiDlsIYgdGVtcGxhdGUg5o+S5YWl5Yiw6aG16Z2i5LmL5YmN6LCD55SoCiAgICAtIG1lc3NhZ2VJZDog5raI5oGv55qEIElE77yM5bm26Z2eIEhUTUwg5YWD57Sg55qEIElECiAgICAtIHRpbWVUYWdIVE1MOiDlrZfnrKbkuLLnsbvlnovvvIwnPGRpdiBjbGFzcz0iY2hhdGdwdC10aW1lIj4nICsgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLAogICAgICB0ZW1wbGF0ZSkgKyAnPC9kaXY+JwogICAgLSDov5Tlm57lgLw6IOaXoAotIHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuYWZ0ZXJDcmVhdGVUaW1lVGFnKG1lc3NhZ2VJZCwgdGltZVRhZ0NvbnRhaW5lck5vZGUpOiDlsIYgdGVtcGxhdGUg5o+S5YWl5Yiw6aG16Z2i5LmL5ZCO6LCD55SoCiAgICAtIG1lc3NhZ2VJZDog5raI5oGv5pe26Ze05a+55bqU5raI5oGv55qEIElE77yM5bm26Z2eIEhUTUwg5YWD57Sg55qEIElECiAgICAtIHRpbWVUYWdOb2RlOiDmraTml7bnmoToioLngrnmmK8gJzxkaXYgY2xhc3M9ImNoYXRncHQtdGltZSI+JyArIHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuZm9ybWF0RGF0ZVRpbWVCeURhdGUoZGF0ZSwKICAgICAgdGVtcGxhdGUpICsgJzwvZGl2Picg55qEIERPTSDoioLngrkKICAgIC0g6L+U5Zue5YC8OiDml6AKCiMjIDQuMiBBUEkg5omn6KGM6YC76L6RCgrns7vnu5/kvJrmjInnhafku6XkuIvpobrluo/miafooYwgQVBJ77yaCgooMSkgdGVtcGxhdGUgPSDkvaDovpPlhaXnmoQgSFRNTCDku6PnoIEKKDIpIHRlbXBsYXRlID0gd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLCB0ZW1wbGF0ZSkKKDMpIHRpbWVUYWdIVE1MID0gJzxkaXYgY2xhc3M9ImNoYXRncHQtdGltZSI+JyArIHRlbXBsYXRlICsgJzwvZGl2PicKKDQpIHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuYmVmb3JlQ3JlYXRlVGltZVRhZyhtZXNzYWdlSWQsIHRpbWVUYWdIVE1MKQooNSkg5bCGIHRpbWVUYWdIVE1MIOaPkuWFpeWIsOafkOS9jee9rgooNikgdGltZVRhZ05vZGUgPSDliJrliJrmj5LlhaXnmoQgdGltZVRhZ0hUTUwg6IqC54K5Cig3KSB3aW5kb3cuQ2hhdEdQVFdpdGhEYXRlLmhvb2tzLmFmdGVyQ3JlYXRlVGltZVRhZyhtZXNzYWdlSWQsIHRpbWVUYWdOb2RlKQoKIyMgNC4zIOS7o+eggeinhOiMgwoKKDEpIOivt+S9v+eUqCBFUzYg6K+t5rOVCigyKSDor7fkvb/nlKjkuKXmoLzmqKHlvI8gYCd1c2Ugc3RyaWN0J2AKKDMpIOivt+S9v+eUqCBgY29uc3RgIOWSjCBgbGV0YCDlo7DmmI7lj5jph48KKDQpIOivt+S9v+eUqCBJSUZFIOmBv+WFjeWFqOWxgOWPmOmHj+axoeafkwooNSkg6K+35L2/55SoIGA9PT1gIOWSjCBgIT09YCDpgb/lhY3nsbvlnovovazmjaLpl67popgKKDYpIOazqOmHiuS4gOW+i+WGmeS4reaWh+azqOmHigoKIyA1LiDmoYjkvosKCuS7peS4i+aYr+S4gOS4quahiOS+i++8jOWunueOsOWFieagh+enu+WKqOWIsOaXtumXtOagh+etvuS4iuaXtu+8jOaXpeacn+aYvuekuuS4uuWHoOWkqeWJjeeahOaViOaenOOAggoKSFRNTCDku6PnoIHvvJoKCmBgYGh0bWwKPHNwYW4gY2xhc3M9InRpbWUtdGFnIj57eXl5eX0te01NfS17ZGR9IHtISH06e21tfTp7c3N9PC9zcGFuPgpgYGAKCkNTUyDku6PnoIHvvJoKCmBgYGNzcwoudGltZS10YWcgewogICAgcGFkZGluZy1yaWdodDogMXJlbTsgCiAgICBjb2xvcjogI2FiYWJhYjsgCiAgICBmb250LXNpemU6IDAuOWVtOwp9CmBgYAoKSmF2YVNjcmlwdCDku6PnoIHvvJoKCmBgYGphdmFzY3JpcHQKKCgpID0+IHsKICAgICd1c2Ugc3RyaWN0JzsKICAgIAogICAgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZSA9IChkYXRlLCB0ZW1wbGF0ZSkgPT4gewogICAgICAgIGNvbnN0IGZvcm1hdFZhbHVlID0gKHZhbHVlLCBmb3JtYXQpID0+IHZhbHVlLnRvU3RyaW5nKCkucGFkU3RhcnQoZm9ybWF0ID09PSAneXl5eScgPyA0IDogMiwgJzAnKTsKICAgICAgICBjb25zdCBkYXRlVmFsdWVzID0gewogICAgICAgICAgICAne3l5eXl9JzogZGF0ZS5nZXRGdWxsWWVhcigpLAogICAgICAgICAgICAne01NfSc6IGRhdGUuZ2V0TW9udGgoKSArIDEsCiAgICAgICAgICAgICd7ZGR9JzogZGF0ZS5nZXREYXRlKCksCiAgICAgICAgICAgICd7SEh9JzogZGF0ZS5nZXRIb3VycygpLAogICAgICAgICAgICAne21tfSc6IGRhdGUuZ2V0TWludXRlcygpLAogICAgICAgICAgICAne3NzfSc6IGRhdGUuZ2V0U2Vjb25kcygpCiAgICAgICAgfTsKICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvXHtbXn1dK1x9L2csIG1hdGNoID0+IGZvcm1hdFZhbHVlKGRhdGVWYWx1ZXNbbWF0Y2hdLCBtYXRjaC5zbGljZSgxLCAtMSkpKTsKICAgIH0KICAgIHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuYWZ0ZXJDcmVhdGVUaW1lVGFnID0gKG1lc3NhZ2VJZCwgdGltZVRhZ0NvbnRhaW5lck5vZGUpID0+IHsKICAgICAgICBjb25zdCB0aW1lVGFnTm9kZSA9IHRpbWVUYWdDb250YWluZXJOb2RlLnF1ZXJ5U2VsZWN0b3IoJy50aW1lLXRhZycpOwogICAgICAgIGNvbnN0IGRhdGVUZXh0ID0gdGltZVRhZ05vZGUuaW5uZXJUZXh0OwogICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShkYXRlVGV4dCk7CiAgICAgICAgdGltZVRhZ05vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKCkgPT4gewogICAgICAgICAgICB0aW1lVGFnTm9kZS5pbm5lclRleHQgPSBgJHtNYXRoLmZsb29yKChuZXcgRGF0ZSgpIC0gZGF0ZSkgLyA4NjQwMDAwMCl9IOWkqeWJjWA7CiAgICAgICAgfSk7CiAgICAgICAgdGltZVRhZ05vZGUuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB7CiAgICAgICAgICAgIHRpbWVUYWdOb2RlLmlubmVyVGV4dCA9IGRhdGVUZXh0OwogICAgICAgIH0pOwogICAgfQp9KSgpCmBgYAoKIyA2LiDkvaDnmoTku7vliqEKCueOsOWcqOS9oOmcgOimgeWGmeS4ieauteS7o+egge+8jOWIhuWIq+S4ukhUTUzjgIFDU1PjgIFKYXZhU2NyaXB077yM6KaB5rGC5aaC5LiL77yaCgotIEhUTUzvvJrkvaDlj6rpnIDopoHlhpnml7bpl7TmoIfnrb7nmoQgSFRNTAotIENTU++8muivt+S9v+eUqOexu+mAieaLqeWZqOaIliBJRCDpgInmi6nlmajvvIzkuI3opoHkvb/nlKjmoIfnrb7pgInmi6nlmajvvIjpmaTpnZ7mmK/lrZDpgInmi6nlmajvvIkKLSBKYXZhU2NyaXB077ya6K+35ZyoIElJRkUg5Lit57yW5YaZ5Luj56CB77yM5L2g5Y+v5Lul5L2/55So5LiK6Z2i6K6y5Yiw55qE5LiJ5Liq6ZKp5a2Q5Ye95pWw44CCCi0g5LiN6KaB6K+05bqf6K+d77yM55u05o6l5LiK5Luj56CB77yM5YiG5Li65LiJ5Liq5Luj56CB5Z2X57uZ5oiR77yM5Zyo5q+P5Liq5Luj56CB5Z2X5LmL5YmN5YaZ5LiK4oCc6L+Z5pivSFRNTOS7o+eggeKAneOAgeKAnOi/meaYr0NTU+S7o+eggeKAneOAgeKAnOi/meaYr0pT5Luj56CB4oCd44CCCi0g5o6l5LiL5p2l55qE5a+56K+d5oiR5LiN5Lya6YeN5aSN5Lul5LiK55qE5YaF5a6577yM5L2g6ZyA6KaB6K6w5L2P6L+Z5Lqb5YaF5a6544CCCi0g5oiR5q+P5qyh5Lya5ZGK6K+J5L2g5oiR6ZyA6KaB5oCO5LmI5pS56L+b5L2g55qE5Luj56CB77yM5L2g6ZyA6KaB5qC55o2u5oiR55qE6KaB5rGC5L+u5pS55Luj56CB44CCCi0g6K+35b+Y6K6w5qGI5L6L5Lit55qE5Luj56CB77yM5oiR55qE6ZyA5rGC5Y+v6IO95Lya5pyJ5omA5LiN5ZCM44CCCgojIDcuIOS9oOmcgOimgeWujOaIkOeahOaIkeeahOmcgOaxggoK5pel5pyf5pe26Ze05qC85byP5qC35L6L77yaMjAyNC0wNC0wMyAxODowOTowMQrkuKrmgKfljJbmoLflvI/vvJrml7bpl7TmoIfnrb7ml6XmnJ/mmL7npLrlnKjlt6bovrnvvIzml7bpl7TmmL7npLrlnKjlj7PovrnvvIzml6XmnJ/lkozml7bpl7TkuYvpl7TmnInkuIDkuKrnq5bnur/liIbpmpTjgILkuI3opoHkvb/nlKjog4zmma/popzoibLvvIzpgInmi6nkuIDkuKrlj6/ku6XpgILlupRkYXJr5qih5byP5ZKMbGlnaHTmqKHlvI/nmoTlrZfkvZPpopzoibLjgIIK6aKd5aSW5pWI5p6c77ya5b2T6byg5qCH56e75Yqo5Yiw5pe26Ze05qCH562+5LiK5pe277yM5pe26Ze05qCH562+5oqW5Yqo5LiA5LiL44CC',
                },
                en: {
                    'restore-info': 'Restore factory settings',
                    'restore-warn': 'Are you sure to restore the factory settings? All your custom configurations will be cleared!',
                    'toggle-language-info': '切换到中文',
                    'documentation-info': 'View documentation',
                    'documentation-international-access': 'International Access',
                    'documentation-china-access': 'China Access',
                    'template': 'Template',
                    'preview': 'Preview',
                    'code': 'Code',
                    'position': 'Position',
                    'advance': 'Advance',
                    'reset': 'Reset',
                    'apply': 'Apply',
                    'apply-failed': 'Apply failed',
                    'save': 'Save and Close',
                    'input-html': 'Please enter HTML code',
                    'input-css': 'Please enter CSS code',
                    'input-js': 'Please enter JavaScript code',
                    'position-after-role-left': 'After Role (left)',
                    'position-after-role-right': 'After Role (right)',
                    'position-below-role': 'Below Role',
                    'gpt-prompt-info': 'Not good at coding? Copy the prompt words and let ChatGPT help you!',
                    'copy-success-info': 'Copy successfully, send it to ChatGPT!',
                    'js-invalid-info': 'Invalid JS code',
                    'gpt-prompt': 'IyAxLiBUYXNrIE92ZXJ2aWV3CgpZb3UgbmVlZCB0byB3cml0ZSBIVE1MLCBDU1MsIGFuZCBKYXZhU2NyaXB0IGNvZGUgdG8gbWVldCBteSByZXF1aXJlbWVudHMuIEkgd2lsbCBwcm92aWRlIGRldGFpbGVkIGluc3RydWN0aW9ucyBvbiBob3cgdG8Kd3JpdGUgdGhlIGNvZGUuCgojIDIuIEhUTUwgUmVxdWlyZW1lbnRzCgpZb3UgbmVlZCB0byBjcmVhdGUgYW4gSFRNTCBzdHJpbmcgdGVtcGxhdGUgZm9yIGRhdGUgYW5kIHRpbWUsIHVzaW5nIHBsYWNlaG9sZGVycyB0byByZXByZXNlbnQgdGltZSBlbGVtZW50cy4gRm9yCmV4YW1wbGU6CgpgYGBodG1sCjxkaXYgY2xhc3M9InRleHQtdGFnLWJveCI+CiAgICA8c3BhbiBjbGFzcz0iZGF0ZSI+e3l5eXl9LXtNTX0te2RkfTwvc3Bhbj4KICAgIDxzcGFuIGNsYXNzPSJ0aW1lIj57SEh9OnttbX06e3NzfTwvc3Bhbj4KPC9kaXY+CmBgYAoKSSB3aWxsIGxhdGVyIGV4cGxhaW4gaG93IHRvIHVzZSBKYXZhU2NyaXB0IHRvIGRpc3BsYXkgc3BlY2lmaWMgdGltZXMuCgojIDMuIENTUyBSZXF1aXJlbWVudHMKCigxKSBEbyBub3QgdXNlIHRhZyBzZWxlY3RvcnM7IG9ubHkgdXNlIGNsYXNzIHNlbGVjdG9ycyBvciBJRCBzZWxlY3RvcnMuICAKKDIpIFVzZSBkZXNjZW5kYW50IHNlbGVjdG9ycyBhcyBtdWNoIGFzIHBvc3NpYmxlIHRvIGF2b2lkIHBvbGx1dGluZyBnbG9iYWwgc3R5bGVzLiAgCigzKSBUcnkgdG8gYXZvaWQgdXNpbmcgYCFpbXBvcnRhbnRgLgoKIyA0LiBKYXZhU2NyaXB0IFJlcXVpcmVtZW50cwoKIyMgNC4xIFByb3ZpZGVkIEFQSSBJbnRlcmZhY2UKCkFQSXMgYXJlIGRlZmluZWQgb24gdGhlIHdpbmRvdyBvYmplY3QuIFlvdSBtYXkgbmVlZCB0byBvdmVycmlkZSB0aGVzZSBmdW5jdGlvbnMgaW4geW91ciBKUyBzY3JpcHQgaWYgbmVjZXNzYXJ5LgoKLSBgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLCB0ZW1wbGF0ZSlgOiBSZXBsYWNlIHRoZSBjb250ZW50IGluIHRoZSB0ZW1wbGF0ZSBIVE1MIHN0cmluZwogIHdpdGggdGhlIHRpbWUgc3BlY2lmaWVkIGJ5IHRoZSBgZGF0ZWAgb2JqZWN0LgogICAgLSBgZGF0ZWA6IEphdmFTY3JpcHQgRGF0ZSBpbnN0YW5jZS4KICAgIC0gYHRlbXBsYXRlYDogSFRNTCBzdHJpbmcsIHdoaWNoIGlzIHlvdXIgSFRNTCBjb2RlLgogICAgLSBSZXR1cm5zOiBUaGUgSFRNTCBjb2RlIGFmdGVyIGZvcm1hdHRpbmcgdGhlIHRpbWUuCi0gYHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuYmVmb3JlQ3JlYXRlVGltZVRhZyhtZXNzYWdlSWQsIHRpbWVUYWdIVE1MKWA6IENhbGxlZCBiZWZvcmUgaW5zZXJ0aW5nIHRoZSB0ZW1wbGF0ZSBpbnRvCiAgdGhlIHBhZ2UuCiAgICAtIGBtZXNzYWdlSWRgOiBUaGUgSUQgb2YgdGhlIG1lc3NhZ2UsIG5vdCB0aGUgSUQgb2YgdGhlIEhUTUwgZWxlbWVudC4KICAgIC0gYHRpbWVUYWdIVE1MYDogQQogICAgICBzdHJpbmcsIGAnPGRpdiBjbGFzcz0iY2hhdGdwdC10aW1lIj4nICsgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLCB0ZW1wbGF0ZSkgKyAnPC9kaXY+J2AuCiAgICAtIFJldHVybnM6IE5vbmUuCi0gYHdpbmRvdy5DaGF0R1BUV2l0aERhdGUuaG9va3MuYWZ0ZXJDcmVhdGVUaW1lVGFnKG1lc3NhZ2VJZCwgdGltZVRhZ0NvbnRhaW5lck5vZGUpYDogQ2FsbGVkIGFmdGVyIGluc2VydGluZyB0aGUKICB0ZW1wbGF0ZSBpbnRvIHRoZSBwYWdlLgogICAgLSBgbWVzc2FnZUlkYDogVGhlIElEIG9mIHRoZSBtZXNzYWdlLCBub3QgdGhlIElEIG9mIHRoZSBIVE1MIGVsZW1lbnQuCiAgICAtIGB0aW1lVGFnTm9kZWA6IFRoZSBET00gbm9kZQogICAgICBmb3IgYCc8ZGl2IGNsYXNzPSJjaGF0Z3B0LXRpbWUiPicgKyB3aW5kb3cuQ2hhdEdQVFdpdGhEYXRlLmhvb2tzLmZvcm1hdERhdGVUaW1lQnlEYXRlKGRhdGUsIHRlbXBsYXRlKSArICc8L2Rpdj4nYC4KICAgIC0gUmV0dXJuczogTm9uZS4KCiMjIDQuMiBBUEkgRXhlY3V0aW9uIExvZ2ljCgpUaGUgc3lzdGVtIHdpbGwgZXhlY3V0ZSB0aGUgQVBJcyBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOgoKKDEpIGB0ZW1wbGF0ZSA9YCB5b3VyIGlucHV0IEhUTUwgY29kZS4gIAooMikgYHRlbXBsYXRlID0gd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5mb3JtYXREYXRlVGltZUJ5RGF0ZShkYXRlLCB0ZW1wbGF0ZSlgICAKKDMpIGB0aW1lVGFnSFRNTCA9ICc8ZGl2IGNsYXNzPSJjaGF0Z3B0LXRpbWUiPicgKyB0ZW1wbGF0ZSArICc8L2Rpdj4nYCAgCig0KSBgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5iZWZvcmVDcmVhdGVUaW1lVGFnKG1lc3NhZ2VJZCwgdGltZVRhZ0hUTUwpYCAgCig1KSBJbnNlcnQgYHRpbWVUYWdIVE1MYCBpbnRvIHNvbWUgbG9jYXRpb24uICAKKDYpIGB0aW1lVGFnTm9kZSA9YCB0aGUgbm9kZSBqdXN0IGluc2VydGVkLiAgCig3KSBgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5hZnRlckNyZWF0ZVRpbWVUYWcobWVzc2FnZUlkLCB0aW1lVGFnTm9kZSlgCgojIyA0LjMgQ29kZSBDb252ZW50aW9ucwoKKDEpIFVzZSBFUzYgc3ludGF4LiAgCigyKSBVc2Ugc3RyaWN0IG1vZGUgYCd1c2Ugc3RyaWN0J2AuICAKKDMpIFVzZSBgY29uc3RgIGFuZCBgbGV0YCB0byBkZWNsYXJlIHZhcmlhYmxlcy4gIAooNCkgVXNlIElJRkUgdG8gYXZvaWQgZ2xvYmFsIHZhcmlhYmxlIHBvbGx1dGlvbi4gIAooNSkgVXNlIGA9PT1gIGFuZCBgIT09YCB0byBhdm9pZCB0eXBlIGNvbnZlcnNpb24gaXNzdWVzLiAgCig2KSBBbGwgY29tbWVudHMgc2hvdWxkIGJlIGluIENoaW5lc2UuCgojIDUuIEV4YW1wbGUKCkhlcmUgaXMgYW4gZXhhbXBsZSBvZiBpbXBsZW1lbnRpbmcgYW4gZWZmZWN0IHdoZXJlLCB3aGVuIGhvdmVyaW5nIG92ZXIgdGhlIHRpbWUgdGFnLCB0aGUgZGF0ZSBkaXNwbGF5cyBhcyBob3cgbWFueSBkYXlzCmFnbyBpdCB3YXMuCgpIVE1MIENvZGU6CgpgYGBodG1sCjxzcGFuIGNsYXNzPSJ0aW1lLXRhZyI+e3l5eXl9LXtNTX0te2RkfSB7SEh9OnttbX06e3NzfTwvc3Bhbj4KYGBgCgpDU1MgQ29kZToKCmBgYGNzcwoudGltZS10YWcgewogICAgcGFkZGluZy1yaWdodDogMXJlbTsgCiAgICBjb2xvcjogI2FiYWJhYjsgCiAgICBmb250LXNpemU6IDAuOWVtOwp9CmBgYAoKSmF2YVNjcmlwdCBDb2RlOgoKYGBgamF2YXNjcmlwdAooKCkgPT4gewogICAgJ3VzZSBzdHJpY3QnOwogICAgCiAgICB3aW5kb3cuQ2hhdEdQVFdpdGhEYXRlLmhvb2tzLmZvcm1hdERhdGVUaW1lQnlEYXRlID0gKGRhdGUsIHRlbXBsYXRlKSA9PiB7CiAgICAgICAgY29uc3QgZm9ybWF0VmFsdWUgPSAodmFsdWUsIGZvcm1hdCkgPT4gdmFsdWUudG9TdHJpbmcoKS5wYWRTdGFydChmb3JtYXQgPT09ICd5eXl5JyA/IDQgOiAyLCAnMCcpOwogICAgICAgIGNvbnN0IGRhdGVWYWx1ZXMgPSB7CiAgICAgICAgICAgICd7eXl5eX0nOiBkYXRlLmdldEZ1bGxZZWFyKCksCiAgICAgICAgICAgICd7TU19JzogZGF0ZS5nZXRNb250aCgpICsgMSwKICAgICAgICAgICAgJ3tkZH0nOiBkYXRlLmdldERhdGUoKSwKICAgICAgICAgICAgJ3tISH0nOiBkYXRlLmdldEhvdXJzKCksCiAgICAgICAgICAgICd7bW19JzogZGF0ZS5nZXRNaW51dGVzKCksCiAgICAgICAgICAgICd7c3N9JzogZGF0ZS5nZXRTZWNvbmRzKCkKICAgICAgICB9OwogICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC9ce1tefV0rXH0vZywgbWF0Y2ggPT4gZm9ybWF0VmFsdWUoZGF0ZVZhbHVlc1ttYXRjaF0sIG1hdGNoLnNsaWNlKDEsIC0xKSkpOwogICAgfQogICAgd2luZG93LkNoYXRHUFRXaXRoRGF0ZS5ob29rcy5hZnRlckNyZWF0ZVRpbWVUYWcgPSAobWVzc2FnZUlkLCB0aW1lVGFnQ29udGFpbmVyTm9kZSkgPT4gewogICAgICAgIGNvbnN0IHRpbWVUYWdOb2RlID0gdGltZVRhZ0NvbnRhaW5lck5vZGUucXVlcnlTZWxlY3RvcignLnRpbWUtdGFnJyk7CiAgICAgICAgY29uc3QgZGF0ZVRleHQgPSB0aW1lVGFnTm9kZS5pbm5lclRleHQ7CiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGRhdGVUZXh0KTsKICAgICAgICB0aW1lVGFnTm9kZS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoKSA9PiB7CiAgICAgICAgICAgIHRpbWVUYWdOb2RlLmlubmVyVGV4dCA9IGAke01hdGguZmxvb3IoKG5ldyBEYXRlKCkgLSBkYXRlKSAvIDg2NDAwMDAwKX0gZGF5cyBhZ29gOwogICAgICAgIH0pOwogICAgICAgIHRpbWVUYWdOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgKCkgPT4gewogICAgICAgICAgICB0aW1lVGFnTm9kZS5pbm5lclRleHQgPSBkYXRlVGV4dDsKICAgICAgICB9KTsKICAgIH0KfSkoKQpgYGAKCiMgNi4gWW91ciBUYXNrCgpOb3cgeW91IG5lZWQgdG8gd3JpdGUgdGhyZWUgcGllY2VzIG9mIGNvZGU6IEhUTUwsIENTUywgYW5kIEphdmFTY3JpcHQuIFRoZSByZXF1aXJlbWVudHMgYXJlIGFzIGZvbGxvd3M6CgotIEhUTUw6IE9ubHkgd3JpdGUgdGhlIHRpbWUgdGFnIEhUTUwuCi0gQ1NTOiBVc2UgY2xhc3Mgc2VsZWN0b3JzIG9yIElEIHNlbGVjdG9yczsgZG8gbm90IHVzZSB0YWcgc2VsZWN0b3JzIChleGNlcHQgYXMgY2hpbGQgc2VsZWN0b3JzKS4KLSBKYXZhU2NyaXB0OiBXcml0ZSB0aGUgY29kZSB3aXRoaW4gYW4gSUlGRSBhbmQgdXNlIHRoZSB0aHJlZSBob29rIGZ1bmN0aW9ucyBtZW50aW9uZWQuCi0gRG8gbm90IHJlcGVhdCB1bm5lY2Vzc2FyeSBkZXRhaWxzOyBqdXN0IHByb3ZpZGUgdGhlIGNvZGUgYmxvY2tzLCB3aXRoICJUaGlzIGlzIEhUTUwgY29kZSwiICJUaGlzIGlzIENTUyBjb2RlLCIgYW5kICIKICBUaGlzIGlzIEpTIGNvZGUiIGJlZm9yZSBlYWNoIGJsb2NrLgotIEluIHN1YnNlcXVlbnQgY29udmVyc2F0aW9ucywgSSB3b24ndCByZXBlYXQgdGhlIGFib3ZlIGRldGFpbHM7IHlvdSBuZWVkIHRvIHJlbWVtYmVyIHRoZW0uCi0gSSB3aWxsIHRlbGwgeW91IGhvdyB0byBpbXByb3ZlIHlvdXIgY29kZSBlYWNoIHRpbWUsIGFuZCB5b3UgbmVlZCB0byBtb2RpZnkgdGhlIGNvZGUgYWNjb3JkaW5nbHkuCi0gRm9yZ2V0IHRoZSBleGFtcGxlIGNvZGUgcHJvdmlkZWQ7IG15IHJlcXVpcmVtZW50cyBtYXkgZGlmZmVyLgoKIyA3LiBXaGF0IHlvdSBuZWVkIHRvIGFjY29tcGxpc2ggZm9yIG1lCgpEYXRlIGFuZCB0aW1lIGZvcm1hdCBleGFtcGxlOiAyMDI0LTA0LTAzIDE4OjA5OjAxICAKQ3VzdG9taXphdGlvbjogRGlzcGxheSB0aGUgZGF0ZSBvbiB0aGUgbGVmdCBhbmQgdGhlIHRpbWUgb24gdGhlIHJpZ2h0IGluIHRoZSB0aW1lIHRhZywgd2l0aCBhIHZlcnRpY2FsIGxpbmUgc2VwYXJhdG9yCmJldHdlZW4gdGhlIGRhdGUgYW5kIHRpbWUuIEF2b2lkIHVzaW5nIGJhY2tncm91bmQgY29sb3JzOyBjaG9vc2UgYSBmb250IGNvbG9yIHN1aXRhYmxlIGZvciBib3RoIGRhcmsgYW5kIGxpZ2h0IG1vZGVzLiAgCkFkZGl0aW9uYWwgZWZmZWN0OiBUaGUgdGltZSB0YWcgc2hvdWxkIHNoYWtlIHNsaWdodGx5IHdoZW4gaG92ZXJlZCBvdmVyLg==',
                },
            },
        }
        static Hook = {
            // APP 使用 SystemConfig.Main.WindowRegisterKey 作为键绑定到 window 对象上
            // Hook 使用 SystemConfig.Hook.ApplicationRegisterKey 作为键绑定到 APP 对象上
            // 即如果要调用钩子 foo() 方法，应该使用 window.ChatGPTWithDate.hooks.foo()
            ApplicationRegisterKey: 'hooks',
        }
        // GM 存储的键
        static GMStorageKey = {
            UserConfig: 'ChatGPTWithDate-UserConfig',
            ConfigPanel: {
                Position: 'ChatGPTWithDate-ConfigPanel-Position', Size: 'ChatGPTWithDate-ConfigPanel-Size',
            },
        }
    }

    class Utils {

        /**
         * 按照模板格式化日期时间
         *
         * @param date      Date 对象
         * @param template  模板，例如 '{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}'
         * @returns string  格式化后的日期时间字符串
         */
        static formatDateTimeByDate(date, template) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const week = date.getDay();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();
            const week2zh = ['', '一', '二', '三', '四', '五', '六', '日']
            const week2enFullName = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            const week2enShortName = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            const month2zh = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
            const month2enFullName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const month2enShortName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            const getValueByKey = (key) => {
                switch (key) {
                    case '{yyyy}':
                        return year.toString();
                    case '{yy}':
                        return (year % 100).toString().padStart(2, '0');

                    case '{MM}':
                    case '{MM:02}':
                        return month.toString().padStart(2, '0');
                    case '{MM:01}':
                        return month.toString();
                    case '{MM#name@zh}':
                        return month2zh[month];
                    case '{MM#name@en}':
                    case '{MM#fullname@en}':
                        return month2enFullName[month];
                    case '{MM#shortname@en}':
                        return month2enShortName[month];

                    case '{dd}':
                    case '{dd:02}':
                        return day.toString().padStart(2, '0');
                    case '{dd:01}':
                        return day.toString();

                    case '{HH}':
                    case '{HH:02}':
                    case '{HH#24}':
                    case '{HH#24:02}':
                        return hours.toString().padStart(2, '0');
                    case '{HH:01}':
                    case '{HH#24:01}':
                        return hours.toString();
                    case '{HH#12}':
                    case '{HH#12:02}':
                        return (hours % 12 || 12).toString().padStart(2, '0');
                    case '{HH#12:01}':
                        return (hours % 12 || 12).toString();
                    case '{HH#tag}':
                    case '{HH#tag@en}':
                        return hours >= 12 ? 'PM' : 'AM';
                    case '{HH#tag@zh}':
                        return hours >= 12 ? '下午' : '上午';

                    case '{mm}':
                    case '{mm:02}':
                        return minutes.toString().padStart(2, '0');
                    case '{mm:01}':
                        return minutes.toString();

                    case '{ss}':
                    case '{ss:02}':
                        return seconds.toString().padStart(2, '0');
                    case '{ss:01}':
                        return seconds.toString();

                    case '{ms}':
                        return milliseconds.toString().padStart(3, '0');


                    case '{week}':
                    case '{week:02}':
                        return week.toString().padStart(2, '0');
                    case '{week:01}':
                        return week.toString();
                    case '{week#name@zh}':
                        return week2zh[week];
                    case '{week#name@en}':
                    case '{week#fullname@en}':
                        return week2enFullName[week];
                    case '{week#shortname@en}':
                        return week2enShortName[week];
                    default:
                        return key;
                }
            }
            return template.replace(/\{[^}]+\}/g, match => getValueByKey(match));
        }

        /**
         * 深度合并两个对象，将源对象的属性合并到目标对象中，如果属性值为对象则递归合并。
         *
         * @param target    目标对象
         * @param source    源对象
         * @returns {*}
         */
        static deepMerge(target, source) {
            if (!source) return target
            // 遍历源对象的所有属性
            Object.keys(source).forEach(key => {
                if (source[key] && typeof source[key] === 'object') {
                    // 如果源属性是一个对象且目标中也存在同名属性且为对象，则递归合并
                    if (target[key] && typeof target[key] === 'object') {
                        Utils.deepMerge(target[key], source[key]);
                    } else {
                        // 否则直接复制（对于源中的对象，需要进行深拷贝）
                        target[key] = JSON.parse(JSON.stringify(source[key]));
                    }
                } else {
                    // 非对象属性直接复制
                    target[key] = source[key];
                }
            });
            return target;
        }

        /**
         * 检查依赖关系图（有向图）是否有循环依赖，如果没有就返回一个先后顺序（即按照此顺序实例化不会出现依赖项为空的情况）。
         * 给定依赖关系图为此结构[{node:'ComponentClass0', dependencies:['ComponentClass2', 'ComponentClass3']}, ...]
         * @param dependencyGraph   依赖关系图
         * @returns {*[]}
         */
        static dependencyAnalysis(dependencyGraph) {
            // 创建一个映射每个节点到其入度的对象
            const inDegree = {};
            const graph = {};
            const order = [];

            // 初始化图和入度表
            dependencyGraph.forEach(item => {
                const {node, dependencies} = item;
                if (!graph[node]) {
                    graph[node] = [];
                    inDegree[node] = 0;
                }
                dependencies.forEach(dependentNode => {
                    if (!graph[dependentNode]) {
                        graph[dependentNode] = [];
                        inDegree[dependentNode] = 0;
                    }
                    graph[dependentNode].push(node);
                    inDegree[node]++;
                });
            });

            // 将所有入度为0的节点加入到队列中
            const queue = [];
            for (const node in inDegree) {
                if (inDegree[node] === 0) {
                    queue.push(node);
                }
            }

            // 处理队列中的节点
            while (queue.length) {
                const current = queue.shift();
                order.push(current);
                graph[current].forEach(neighbour => {
                    inDegree[neighbour]--;
                    if (inDegree[neighbour] === 0) {
                        queue.push(neighbour);
                    }
                });
            }

            // 如果排序后的节点数量不等于图中的节点数量，说明存在循环依赖
            if (order.length !== Object.keys(graph).length) {
                // 找到循环依赖的节点
                const cycleNodes = [];
                for (const node in inDegree) {
                    if (inDegree[node] !== 0) {
                        cycleNodes.push(node);
                    }
                }
                throw new Error("存在循环依赖的节点：" + cycleNodes.join(","));
            }
            return order;
        }

        /**
         * 将文本转换为 base64 编码，兼容中文
         * @param text
         * @returns {string}
         */
        static base64Encode(text) {
            const encodedUriComponent = encodeURIComponent(text);
            const binaryString = unescape(encodedUriComponent);
            return btoa(binaryString);
        }

        /**
         * 将 base64 编码的文本解码，兼容中文
         * @param encoded
         * @returns {string}
         */
        static base64Decode(encoded) {
            const binaryString = atob(encoded);
            const encodedUriComponent = escape(binaryString);
            return decodeURIComponent(encodedUriComponent);
        }

        /**
         * 判断 JavaScript 代码字符串是否合法
         * @param code
         * @returns {{valid: boolean, error: *}}
         */
        static isJavaScriptSyntaxValid(code) {
            try {
                new Function(code);
                return {
                    valid: true,
                    error: null
                };
            } catch (e) {
                return {
                    valid: false,
                    error: e
                };
            }
        }

        /**
         * isMainThreadIdleAsync：
         *   返回一个 Promise，当浏览器下一个空闲时刻到来时 resolve，
         *   resolve 的值是一个 boolean，表示“当前这一帧还有多少空闲时间”是否大于 0。
         *
         * 示例用法：
         *    isMainThreadIdleAsync().then(isIdle => {
         *      if (isIdle) {
         *        // 真的有空闲，可以做低优先级工作
         *      } else {
         *        // 虽然在 idleCallback 里调用，但已经没有剩余空余时间了
         *      }
         *    });
         */
        static isMainThreadIdleAsync() {
            return new Promise((resolve) => {
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback((deadline) => {
                        // timeRemaining() > 0，说明本次空闲窗口还有剩余时间
                        resolve(deadline.timeRemaining() > 0);
                    });
                } else {
                    // 不支持 requestIdleCallback，就在下一个宏任务中认为“可能空闲”
                    setTimeout(() => {
                        resolve(true);
                    }, 0);
                }
            });
        }
    }

    class Logger {
        static EnableLog = true
        static EnableDebug = DEBUG
        static EnableInfo = true
        static EnableWarn = true
        static EnableError = true
        static EnableTable = DEBUG

        static prefix(type = 'INFO') {
            const timeFormat = Utils.formatDateTimeByDate(new Date(), SystemConfig.Logger.TimeFormatTemplate);
            return `[${timeFormat}] - [${SystemConfig.Common.ApplicationName}] - [${type}]`
        }

        static log(...args) {
            if (Logger.EnableLog) {
                console.log(Logger.prefix('INFO'), ...args);
            }
        }

        static debug(...args) {
            if (Logger.EnableDebug) {
                console.debug(Logger.prefix('DEBUG'), ...args);
            }
        }

        static info(...args) {
            if (Logger.EnableInfo) {
                console.info(Logger.prefix('INFO'), ...args);
            }
        }

        static warn(...args) {
            if (Logger.EnableWarn) {
                console.warn(Logger.prefix('WARN'), ...args);
            }
        }

        static error(...args) {
            if (Logger.EnableError) {
                console.error(Logger.prefix('ERROR'), ...args);
            }
        }

        static table(...args) {
            if (Logger.EnableTable) {
                console.table(...args);
            }
        }
    }

    class MessageBO {
        /**
         * 消息业务对象
         *
         * @param messageId 消息ID，为消息元素的data-message-id属性值
         * @param role      角色
         *                  system:     表示系统消息，并不属于聊天内容。    从 API 获取
         *                  tool:       也表示系统消息。                 从 API 获取
         *                  assistant:  表示 ChatGPT 回答的消息。        从 API 获取
         *                  user:       表示用户输入的消息。              从 API 获取
         *                  You:        表示用户输入的消息。              从页面实时获取
         *                  ChatGPT:    表示 ChatGPT 回答的消息。        从页面实时获取
         * @param timestamp 时间戳，浮点数或整数类型，单位毫秒或秒，能够自适应统一转换为秒级别的小数形式，
         *                  例如 1714398759.26881(s)、1714398759(s)、1748617891317.3572(ms)
         * @param message   消息内容
         */
        constructor(messageId, role, timestamp, message = '') {
            this.messageId = messageId;
            this.role = role;
            this.timestamp = this.toMilliseconds(timestamp);
            this.message = message;
        }

        /**
         * 将各种格式的时间戳（秒级/毫秒级，整数/小数）统一转换为毫秒级别的小数形式。
         * 如果传入的时间戳非法，则返回当前时间的毫秒级别小数时间戳。
         *
         * @param {string|number} timestamp 要转换的时间戳，支持如下几种形式：
         *   1. 1714398759.26881   （秒级别的小数）
         *   2. 1714398759        （秒级别的整数）
         *   3. 1748617891317.3572 （毫秒级别的小数）
         *   4. 1748617891317      （毫秒级别的整数）
         * @returns {number} 返回毫秒级别的小数（Number 类型），若输入无法解析则返回当前时间戳（毫秒级小数）
         */
        toMilliseconds(timestamp) {
            // 将传入的 timestamp 转为数值类型
            const t = Number(timestamp);
            // 如果解析后不是合法数字，则返回当前时间戳（毫秒级别小数）兜底
            if (isNaN(t)) {
                return Date.now();
            }

            /**
             * 判断标准：
             *   1. 当前一般意义上的秒级 UNIX 时间戳大概在 1e9 ~ 1.7e9（2025 年左右），远小于 1e12。
             *   2. 当前毫秒级 UNIX 时间戳大概在 1e12 ~ 1e13（2025 年左右，大约 1.7e12）。
             *   3. 如果传入值小于 1e12，就认为它是秒级别（整数或小数），需要乘以 1000 转为毫秒。
             *   4. 否则就直接认为它是毫秒级别（整数或小数），无需额外处理。
             */
            if (t < 1e10) {
                // 秒级别，乘以 1000 后变成毫秒级别
                return t * 1000;
            } else {
                // 已经是毫秒级别（整数或小数），直接返回
                return t;
            }
        }
    }

    class MessageElementBO {
        /**
         * 消息元素业务对象
         *
         * @param rootEle       消息的根元素，也就是 messageEle 的父节点
         * @param messageEle    消息元素，包含 data-message-id 属性
         *                      例如 <div data-message-id="123456">你好</div>
         */
        constructor(rootEle, messageEle) {
            this.rootEle = rootEle;
            this.messageEle = messageEle;
        }
    }

    class Component {

        constructor() {
            this.dependencies = []
            Object.defineProperty(this, 'initDependencies', {
                value: function () {
                    this.dependencies.forEach(dependency => {
                        this[dependency.field] = ComponentLocator.get(dependency.clazz)
                    })
                }, writable: false,        // 防止方法被修改
                configurable: false     // 防止属性被重新定义或删除
            });
        }

        init() {
        }
    }

    class ComponentLocator {
        /**
         * 组件注册器，用于注册和获取组件
         */
        static components = {};

        /**
         * 注册组件，要求组件为 Component 的子类
         *
         * @param clazz     Component 的子类
         * @param instance  Component 的子类的实例化对象，必顧是 clazz 的实例
         * @returns obj 返回注册的实例化对象
         */
        static register(clazz, instance) {
            if (!(instance instanceof Component)) {
                throw new Error(`实例化对象 ${instance} 不是 Component 的实例。`);
            }
            if (!(instance instanceof clazz)) {
                throw new Error(`实例化对象 ${instance} 不是 ${clazz} 的实例。`);
            }
            if (ComponentLocator.components[clazz.name]) {
                throw new Error(`组件 ${clazz.name} 已经注册过了。`);
            }
            ComponentLocator.components[clazz.name] = instance;
            return instance
        }

        /**
         * 获取组件，用于完成组件之间的依赖注入
         *
         * @param clazz    Component 的子类
         * @returns {*}    返回注册的实例化对象
         */
        static get(clazz) {
            if (!ComponentLocator.components[clazz.name]) {
                throw new Error(`组件 ${clazz.name} 未注册。`);
            }
            return ComponentLocator.components[clazz.name];
        }
    }

    class UserConfig extends Component {

        init() {
            const defaultConfig = this.getDefaultConfig()
            this.timeRender = defaultConfig.timeRender
            this.i18n = defaultConfig.i18n
            const userConfig = this.load()
            if (userConfig) {
                // 不调用 update 方法，因为 update 方法会保存配置
                // 为了 （开发者）调试 方便，不保存配置
                // 为了 （用户）性能 考虑，不保存配置
                Utils.deepMerge(this.timeRender, userConfig.timeRender)
                if (userConfig.i18n) this.i18n = userConfig.i18n
            }
        }

        getDefaultConfig() {
            return {
                timeRender: {
                    format: SystemConfig.TimeRender.TimeTagTemplates[0],
                    advanced: {
                        enable: false,
                        htmlTextContent: `<span class="time-tag">{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}</span>`,
                        styleTextContent: `.time-tag {
    padding-right: 1rem; 
    color: #ababab; 
    font-size: 0.9em;
}`,
                        scriptTextContent: `(() => {
    'use strict';
    
    window.ChatGPTWithDate.hooks.formatDateTimeByDate = (date, template) => {
        const formatValue = (value, format) => value.toString().padStart(format === 'yyyy' ? 4 : 2, '0');
        const dateValues = {
            '{yyyy}': date.getFullYear(),
            '{MM}': date.getMonth() + 1,
            '{dd}': date.getDate(),
            '{HH}': date.getHours(),
            '{mm}': date.getMinutes(),
            '{ss}': date.getSeconds()
        };
        return template.replace(/\\{[^}]+\\}/g, match => formatValue(dateValues[match], match.slice(1, -1)));
    }
    window.ChatGPTWithDate.hooks.afterCreateTimeTag = (messageId, timeTagContainerNode) => {
        const timeTagNode = timeTagContainerNode.querySelector('.time-tag');
        const dateText = timeTagNode.innerText;
        const date = new Date(dateText);
        timeTagNode.addEventListener('mouseover', () => {
            timeTagNode.innerText = Math.floor((new Date() - date) / 86400000) + ' days ago';
        });
        timeTagNode.addEventListener('mouseout', () => {
            timeTagNode.innerText = dateText;
        });
    }
})()`,
                    }
                },
                i18n: SystemConfig.ConfigPanel.I18N.default
            }
        }

        restore() {
            this.timeRender = this.getDefaultConfig().timeRender
            this.i18n = SystemConfig.ConfigPanel.I18N.default
            this.save()
        }

        save() {
            GM_setValue(SystemConfig.GMStorageKey.UserConfig, {
                timeRender: this.timeRender,
                i18n: this.i18n
            })
        }

        load() {
            return GM_getValue(SystemConfig.GMStorageKey.UserConfig)
        }

        /**
         * 更新配置并保存
         * @param newConfig 新的配置
         */
        update(newConfig) {
            Utils.deepMerge(this.timeRender, newConfig.timeRender)
            if (newConfig.i18n) this.i18n = newConfig.i18n
            this.save()
        }

        /**
         * 更新一个配置项并保存
         * @param key   配置项的 key
         * @param value 配置项的 value
         */
        updateOne(key, value) {
            if (this[key] instanceof Object) {
                Utils.deepMerge(this[key], value)
            } else {
                this[key] = value
            }
            this.save()
        }
    }

    class HookService extends Component {

        init() {
            this.defaultHooks = {
                beforeCreateTimeTag: (messageId, timeTagHTML) => {
                },
                afterCreateTimeTag: (messageId, timeTagNode) => {
                },
                formatDateTimeByDate: Utils.formatDateTimeByDate
            }
            this.reset2DefaultHooks()
        }

        _checkOldVersion(hookName) {
            if (unsafeWindow[hookName]) {
                Logger.warn(`钩子函数 ${hookName} 不应该绑定在 window 对象上，请绑定在 window.${SystemConfig.Main.WindowRegisterKey}.${SystemConfig.Hook.ApplicationRegisterKey} 上！未来版本中将不再兼容此情况。`)
                return true
            }
            return false
        }

        _register2Window() {
            unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.Hook.ApplicationRegisterKey] = {
                beforeCreateTimeTag: this.hooks.beforeCreateTimeTag,
                afterCreateTimeTag: this.hooks.afterCreateTimeTag,
                formatDateTimeByDate: this.hooks.formatDateTimeByDate
            }
            for (let hookName in this.defaultHooks) {
                if (this._checkOldVersion(hookName)) {
                    unsafeWindow[hookName] = this.defaultHooks[hookName]
                }
            }
        }

        reset2DefaultHooks() {
            this.hooks = this.defaultHooks
            this._register2Window()
        }

        invokeHook(hookName, ...args) {
            if (!this.defaultHooks[hookName]) {
                Logger.error(`钩子函数 ${hookName} 非法`)
                return
            }
            if (this._checkOldVersion(hookName)) {
                unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.Hook.ApplicationRegisterKey][hookName] = unsafeWindow[hookName]
            }
            try {
                return unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.Hook.ApplicationRegisterKey][hookName](...args)
            } catch (e) {
                Logger.error(`调用钩子函数 ${hookName} 失败：`, e)
            }
        }
    }

    class StyleService extends Component {
        init() {
            this.styles = new Map()
        }

        /**
         * 更新样式
         *
         * @param key           样式的 key，字符串对象
         * @param styleContent  样式，字符串对象
         */
        updateStyle(key, styleContent) {
            this.removeStyle(key)
            const styleNode = GM_addStyle(styleContent);
            this.styles.set(key, styleNode)
        }

        /**
         * 移除样式
         *
         * @param key   样式的 key，字符串对象
         */
        removeStyle(key) {
            let styleNode = this.styles.get(key)
            if (styleNode) {
                styleNode.remove()
                this.styles.delete(key)
            }
        }
    }

    class JavaScriptService extends Component {
        init() {
            this.javaScriptNodes = new Map()
        }

        updateJavaScript(key, scriptContent) {
            this.removeJavaScript(key)
            const scriptNode = GM_addElement('script', {
                textContent: scriptContent
            });
            this.javaScriptNodes.set(key, scriptNode)
        }

        removeJavaScript(key) {
            let scriptNode = this.javaScriptNodes.get(key)
            if (scriptNode) {
                scriptNode.remove()
                this.javaScriptNodes.delete(key)
            }
        }
    }

    class MessageService extends Component {
        init() {
            this.messages = new Map();
        }

        /**
         * 解析消息元素，获取消息的所有内容。由于网页中不存在时间戳，所以时间戳使用当前时间代替。
         * 调用该方法只需要消息元素，一般用于从页面实时监测获取到的消息。
         *
         * @param messageDiv    消息元素，包含 data-message-id 属性 的 div 元素
         * @returns {MessageBO|undefined}   返回消息业务对象，如果消息元素不存在则返回 undefined
         */
        parseMessageDiv(messageDiv) {
            if (!messageDiv) {
                return;
            }
            const messageId = messageDiv.getAttribute('data-message-id');
            const role = messageDiv.getAttribute('data-message-author-role');
            const messageElementBO = this.getMessageElement(messageId)
            if (!messageElementBO) {
                return;
            }
            let timestamp = new Date().getTime();
            const message = messageElementBO.messageEle.innerHTML;
            if (!this.messages.has(messageId)) {
                const messageBO = new MessageBO(messageId, role, timestamp, message);
                this.addMessage(messageBO)
            }
            return this.messages.get(messageId);
        }

        /**
         * 添加消息，主要用于添加从 API 劫持到的消息列表。
         * 调用该方法需要已知消息的所有内容，如果只知道消息元素则应该使用 parseMessageDiv 方法获取消息业务对象。
         *
         * @param message   消息业务对象
         * @param force     是否强制添加，如果为 true 则强制添加，否则如果消息已经存在则不添加
         * @returns {boolean}   返回是否添加成功
         */
        addMessage(message, force = false) {
            if (this.messages.has(message.messageId) && !force) {
                return false;
            }
            this.messages.set(message.messageId, message);
            return true
        }

        /**
         * 移除消息
         *
         * @param messageId 消息 ID
         * @returns {boolean}   返回是否移除成功
         */
        removeMessage(messageId) {
            return this.messages.delete(messageId)
        }

        /**
         * 通过消息 ID 获取消息元素业务对象
         *
         * @param messageId 消息 ID
         * @returns {MessageElementBO|undefined}  返回消息元素业务对象
         */
        getMessageElement(messageId) {
            const messageDiv = document.body.querySelector(`div[data-message-id="${messageId}"]`);
            if (!messageDiv) {
                return;
            }
            const rootDiv = messageDiv.parentElement;
            return new MessageElementBO(rootDiv, messageDiv);
        }

        /**
         * 通过消息 ID 获取消息业务对象
         * @param messageId
         * @returns {any}
         */
        getMessage(messageId) {
            return this.messages.get(messageId);
        }

        /**
         * 显示所有消息信息
         */
        showMessages() {
            Logger.table(Array.from(this.messages.values()));
        }
    }

    class MonitorService extends Component {
        constructor() {
            super();
            this.messageService = null
            this.timeRendererService = null
            this.dependencies = [{field: 'messageService', clazz: MessageService}, {
                field: 'timeRendererService', clazz: TimeRendererService
            },]
        }

        init() {
            this.totalTime = 0;
            this.originalFetch = unsafeWindow.fetch.bind(unsafeWindow);
            this._initMonitorFetch();
            this._initMonitorAddedMessageNode();
            this._initConfigPageNode();
            this._initSharePageDataFetch();
        }

        /**
         * 初始化劫持 fetch 方法，用于监控 ChatGPT 的消息数据
         *
         * @private
         */
        _initMonitorFetch() {
            const that = this;
            const urlRegex = new RegExp("^https://(chat\\.openai|chatgpt)\\.com/backend-api/conversation/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
            unsafeWindow.fetch = (...args) => {
                return that.originalFetch(...args)
                    .then(response => {
                        Logger.debug("修改 fetch 方法，监控到请求：", response.url);
                        if (urlRegex.test(response.url)) {
                            // 克隆响应对象以便独立处理响应体
                            const clonedResponse = response.clone();
                            clonedResponse.json().then(data => {
                                that._parseConversationJsonData(data);
                            }).catch(error => Logger.error('解析响应体失败:', error));
                        }
                        return response;
                    })
            };
        }

        /**
         * 初始化获取分享界面的消息数据
         *
         * @private
         */
        _initSharePageDataFetch() {
            const __NEXT_DATA__ = document.querySelector("#__NEXT_DATA__")
            if (!__NEXT_DATA__) return;
            const jsonData = JSON.parse(__NEXT_DATA__.text);
            try {
                this._parseConversationJsonData(jsonData.props.pageProps.serverResponse.data)
            } catch (e) {
                Logger.error('解析分享页面数据失败：', e)
            }
        }

        /**
         * 解析从 API 获取到的消息数据，该方法存在报错风险，需要在调用时捕获异常以防止中断后续操作。
         *
         * @param obj   从 API 获取到的消息数据
         * @private
         */
        _parseConversationJsonData(obj) {
            const mapping = obj.mapping
            Logger.debug('解析从 API 获取到的消息数据：', obj);
            const messageIds = []
            for (let key in mapping) {
                const message = mapping[key].message
                if (message) {
                    const messageId = message.id
                    const role = message.author.role
                    const createTime = message.create_time
                    const messageBO = new MessageBO(messageId, role, createTime)
                    messageIds.push(messageId)
                    this.messageService.addMessage(messageBO, true)
                }
            }
            this.timeRendererService.addMessageArrayToBeRendered(messageIds.reverse())
            this.messageService.showMessages()
        }

        /**
         * 初始化监控节点变化，用于监控在使用 ChatGPT 期间实时输入的消息。
         * 每隔 500ms 检查一次 main 节点是否存在，如果存在则开始监控节点变化。
         * @private
         */
        _initMonitorAddedMessageNode() {
            const interval = setInterval(() => {
                const mainElement = document.body;
                if (mainElement) {
                    this._setupMonitorAddedMessageNode(mainElement);
                    clearInterval(interval); // 清除定时器，停止进一步检查
                }
            }, 500);
        }

        /**
         * 设置监控节点变化，用于监控在使用 ChatGPT 期间实时输入的消息。
         * @param supervisedNode    监控在此节点下的节点变化，确保新消息的节点在此节点下
         * @private
         */
        _setupMonitorAddedMessageNode(supervisedNode) {
            const that = this;
            const addMessageDiv = (messageDiv) => {
                if (messageDiv !== null) {
                    const messageBO = that.messageService.parseMessageDiv(messageDiv);
                    if (messageBO) {
                        that.timeRendererService.addMessageToBeRendered(messageBO.messageId);
                        that.messageService.showMessages()
                    }
                }
            }
            const callback = function (mutationsList, observer) {
                const start = performance.now();
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const messageDivs = node.querySelectorAll('div[data-message-id]');
                                Logger.debug('监控到多个消息节点被添加：', messageDivs);
                                for (let messageDiv of messageDivs) {
                                    addMessageDiv(messageDiv)
                                }
                                if (node.hasAttribute('data-message-id')) {
                                    addMessageDiv(node)
                                }
                            }
                        }
                    } else if (mutation.type === 'attributes') {
                        addMessageDiv(mutation.target)
                    }
                }
                const end = performance.now();
                that.totalTime += (end - start);
            };
            const observer = new MutationObserver(callback);
            observer.observe(supervisedNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["data-message-id"]
            });
            this.disconnectObserver = () => observer.disconnect();
        }

        /**
         * 初始化配置页面节点，以便显示配置页面的时间渲染效果
         * @private
         */
        _initConfigPageNode() {
            if (IsConfigPage) {
                const messageIds = []
                const messageDivs = document.querySelectorAll('div[data-message-id]');
                for (let messageDiv of messageDivs) {
                    const dataMessageId = messageDiv.getAttribute('data-message-id');
                    const timestamp = parseInt(messageDiv.getAttribute('data-chatgpt-with-date-demo-timestamp'))
                    const messageBO = new MessageBO(dataMessageId, 'ConfigDemo', timestamp)
                    messageIds.push(dataMessageId)
                    this.messageService.addMessage(messageBO, true)
                }
                this.timeRendererService.addMessageArrayToBeRendered(messageIds)
            }
        }

        /**
         * 断开监控节点变化的观察者
         */
        disconnectObserver() {
            Logger.debug("尚未绑定监控节点变化的观察者。")
        };
    }

    class TimeRendererService extends Component {

        constructor() {
            super();
            this.messageService = null
            this.userConfig = null
            this.styleService = null
            this.javaScriptService = null
            this.hookService = null
            this.dependencies = [
                {field: 'messageService', clazz: MessageService},
                {field: 'userConfig', clazz: UserConfig},
                {field: 'styleService', clazz: StyleService},
                {field: 'javaScriptService', clazz: JavaScriptService},
                {field: 'hookService', clazz: HookService},
            ]
        }

        init() {
            this.messageToBeRenderedHeap = new Heap((lhs, rhs) => rhs.timestamp - lhs.timestamp);
            this.messageCountOfFailedToRender = new Map()
            this._setStyleAndJavaScript()
            this._initRender()
        }

        /**
         * 若为高级模式则设置用户自定义的样式和脚本，否则设置默认样式
         *
         * @private
         */
        _setStyleAndJavaScript() {
            this.styleService.updateStyle(SystemConfig.TimeRender.BasicStyleKey, SystemConfig.TimeRender.BasicStyle)
            this.hookService.reset2DefaultHooks()
            this.styleService.removeStyle(SystemConfig.TimeRender.AdditionalStyleKey)
            this.javaScriptService.removeJavaScript(SystemConfig.TimeRender.AdditionalScriptKey)
            if (this.userConfig.timeRender.advanced.enable) {
                this.styleService.updateStyle(SystemConfig.TimeRender.AdditionalStyleKey, this.userConfig.timeRender.advanced.styleTextContent)
                this.javaScriptService.updateJavaScript(SystemConfig.TimeRender.AdditionalScriptKey, this.userConfig.timeRender.advanced.scriptTextContent)
            }
        }

        /**
         * 添加消息 ID 到待渲染队列
         * @param messageId 消息 ID
         */
        addMessageToBeRendered(messageId) {
            if (typeof messageId !== 'string') {
                return
            }
            this.messageToBeRenderedHeap.push(this.messageService.getMessage(messageId))
            Logger.debug(`添加ID ${messageId} 到待渲染队列，当前队列大小 ${this.messageToBeRenderedHeap.getSize()}`)
        }

        /**
         * 添加消息 ID 到待渲染队列
         * @param messageIdArray 消息 ID数组
         */
        addMessageArrayToBeRendered(messageIdArray) {
            if (!messageIdArray || !(messageIdArray instanceof Array)) {
                return
            }
            for (let messageId of messageIdArray) {
                this.addMessageToBeRendered(messageId)
            }
        }

        /**
         * 初始化渲染时间的定时器，每隔 SystemConfig.TimeRender.Interval 毫秒处理一次待渲染队列
         * 1. 备份待渲染队列
         * 2. 清空待渲染队列
         * 3. 遍历备份的队列，逐个渲染
         * 3.1 如果渲染失败则重新加入待渲染队列，失败次数加一
         * 3.2 如果渲染成功，清空失败次数
         * 4. 重复 1-3 步骤
         * 5. 如果失败次数超过 SystemConfig.TimeRender.RenderRetryCount 则不再尝试渲染，即不再加入待渲染队列。同时清空失败次数。
         *
         * @private
         */
        _initRender() {
            const that = this

            async function processTimeRender() {
                const start = new Date().getTime();
                let completeCount = 0;
                let totalCount = that.messageToBeRenderedHeap.getSize()
                for (let i = 0; i < SystemConfig.TimeRender.BatchSize; ++i) {
                    const isIdle = await Utils.isMainThreadIdleAsync();
                    if (!isIdle) {
                        Logger.debug(`当前主线程忙碌，结束本次渲染。`)
                        break;
                    }
                    if (new Date().getTime() - start > SystemConfig.TimeRender.BatchTimeout) {
                        Logger.debug(`本批次渲染超时，将继续下一批次渲染。`)
                        break;
                    }
                    if (that.messageToBeRenderedHeap.isEmpty()) {
                        Logger.debug(`待渲染队列为空，结束本批次渲染。`)
                        break;
                    }
                    const messageBo = that.messageToBeRenderedHeap.pop();
                    const messageId = messageBo.messageId;
                    const result = await that._renderTime(messageId)
                    if (!result) {
                        let countOfFailed = that.messageCountOfFailedToRender.get(messageId)
                        if (countOfFailed && countOfFailed >= SystemConfig.TimeRender.RenderRetryCount) {
                            Logger.debug(`ID ${messageId} 渲染失败次数超过 ${SystemConfig.TimeRender.RenderRetryCount} 次，将不再尝试。`)
                            that.messageCountOfFailedToRender.delete(messageId)
                        } else {
                            that.messageToBeRenderedHeap.push(messageBo);
                            if (countOfFailed) {
                                that.messageCountOfFailedToRender.set(messageId, countOfFailed + 1)
                            } else {
                                that.messageCountOfFailedToRender.set(messageId, 1)
                            }
                        }
                    } else {
                        completeCount++
                        that.messageCountOfFailedToRender.delete(messageId)
                    }
                    Logger.debug(`ID ${messageId} 渲染${result ? '成功' : '失败'}，本批次渲染进度 ${completeCount}/${SystemConfig.TimeRender.BatchSize}，该消息渲染耗时 ${new Date().getTime() - start}ms`)
                }
                if (totalCount > 0) {
                    Logger.debug(`本批次渲染成功率 ${completeCount}/${SystemConfig.TimeRender.BatchSize}，本批次渲染耗时 ${new Date().getTime() - start}ms`)
                }
                setTimeout(processTimeRender, SystemConfig.TimeRender.Interval);
            }

            processTimeRender().then(r => Logger.debug('初始化渲染时间定时器完成'))
        }

        /**
         * 将时间渲染到目标位置，如果检测到目标位置已经存在时间元素则更新时间，否则创建时间元素并插入到目标位置。
         *
         * @param messageId     消息 ID
         * @returns {Promise}   返回是否渲染成功的 Promise 对象
         * @private
         */
        _renderTime(messageId) {
            return new Promise(resolve => {
                const messageElementBo = this.messageService.getMessageElement(messageId);
                const messageBo = this.messageService.getMessage(messageId);
                if (!messageElementBo || !messageBo || !messageElementBo.rootEle) resolve(false)
                const timeElement = messageElementBo.rootEle.querySelector(`.${SystemConfig.TimeRender.TimeClassName}`);
                const role = messageElementBo.messageEle.getAttribute('data-message-author-role');
                const element = this._createTimeElement(messageBo.timestamp, role);
                // 强制移除时间元素，重新渲染。这样才能保证时间正确的同时也能正确执行用户自定义的脚本。
                if (timeElement) {
                    messageElementBo.rootEle.removeChild(timeElement)
                }
                this.hookService.invokeHook('beforeCreateTimeTag', messageId, element.timeTagContainer)
                messageElementBo.rootEle.firstChild.insertAdjacentHTML('beforebegin', element.timeTagContainer);
                this.hookService.invokeHook('afterCreateTimeTag', messageId, messageElementBo.rootEle.querySelector(`.${SystemConfig.TimeRender.TimeClassName}`))
                resolve(true)
            })
        }

        /**
         * 创建时间元素，如果开启高级模式则使用用户自定义的时间格式，否则使用默认时间格式。
         *
         * @param timestamp 时间戳，浮点数或整数类型，单位毫秒，例如 1714398759.26881、1714398759
         * @returns {{timeTagFormated, timeTagContainer: string}} 返回格式化后的时间标签 和 包含时间标签的容器的 HTML 字符串
         * @private
         */
        _createTimeElement(timestamp, role) {
            let timeTagFormated = ''
            if (this.userConfig.timeRender.advanced.enable) {
                timeTagFormated = this.hookService.invokeHook('formatDateTimeByDate', new Date(timestamp), this.userConfig.timeRender.advanced.htmlTextContent)
            } else {
                timeTagFormated = this.hookService.invokeHook('formatDateTimeByDate', new Date(timestamp), this.userConfig.timeRender.format);
            }
            const timeTagContainer = `<span class="${SystemConfig.TimeRender.TimeClassName} ${role}">${timeTagFormated}</span>`;
            return {
                timeTagFormated, timeTagContainer,
            };
        }

        /**
         * 清除所有时间元素
         * @private
         */
        _cleanAllTimeElements() {
            const timeElements = document.body.querySelectorAll(`.${SystemConfig.TimeRender.TimeClassName}`);
            timeElements.forEach(ele => {
                ele.remove()
            })
        }

        /**
         * 重新渲染时间元素，强制拉取所有消息 ID 重新渲染
         */
        reRender() {
            this._setStyleAndJavaScript()
            this._cleanAllTimeElements()
            this.addMessageArrayToBeRendered(Array.from(this.messageService.messages.keys()))
        }
    }

    class ConfigPanelService extends Component {

        constructor() {
            super();
            this.userConfig = null
            this.styleService = null
            this.timeRendererService = null
            this.messageService = null
            this.javascriptService = null
            this.dependencies = [
                {field: 'userConfig', clazz: UserConfig},
                {field: 'styleService', clazz: StyleService},
                {field: 'timeRendererService', clazz: TimeRendererService},
                {field: 'messageService', clazz: MessageService},
                {field: 'javascriptService', clazz: JavaScriptService},
            ]
        }

        /**
         * 初始化配置面板，强调每个子初始化方法阻塞式的执行，即一个初始化方法执行完毕后再执行下一个初始化方法。
         * @returns {Promise<void>}
         */
        async init() {
            if (IsConfigPage) {
                // 仅在配置页面初始化配置面板，同时可以防止代码高亮插件对非配置页面的代码块进行处理
                this.appID = SystemConfig.ConfigPanel.AppID
                Logger.debug('开始初始化配置面板')
                await this._initExternalResources()
                Logger.debug('初始化脚本完成')
                this._initVariables()
                await this._initStyle()
                Logger.debug('初始化样式完成')
                await this._initPanel()
                Logger.debug('初始化面板完成')
                this._initVue()
                Logger.debug('初始化Vue完成')
                this._initConfigPanelSizeAndPosition()
                this._initConfigPanelEventMonitor()
                Logger.debug('初始化配置面板事件监控完成')
                this.show()
            }
            this._initMenuCommand()
            Logger.debug('初始化菜单命令完成')
        }

        /**
         * 初始化配置面板的 HTML 与 Vue 实例的配置属性。集中管理以便方便修改。
         * @private
         */
        _initVariables() {
            const that = this
            unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.ConfigPanel.ApplicationRegisterKey] = {}
            const TimeTagComponent = {
                props: ['html'],
                render() {
                    return Vue.h('div', {innerHTML: this.html});
                },
            }
            this.panelStyle = `
                    .v-binder-follower-container {
                        position: fixed;
                    }
                    .n-button .n-button__content {
                        white-space: pre-wrap;
                    }
                    
                    #CWD-Configuration-Panel {
                        position: absolute;
                        top: 50px;
                        left: 50px;
                        width: 600px;
                        background-color: #FFFFFF;
                        border: #D7D8D9 1px solid;
                        border-radius: 8px;
                        resize: horizontal;
                        min-width: 200px;
                        overflow: auto;
                        color: black;
                        opacity: 0.95;
                    }
            
                    #CWD-Configuration-Panel .status-bar {
                        cursor: move;
                        background-color: #ECECEA;
                        border-radius: 4px 4px 0 0;
                        display: flex;
                    }
            
                    #CWD-Configuration-Panel .status-bar .title {
                        display: flex;
                        align-items: center;
                        justify-content: left;
                        padding-left: 10px;
                        user-select: none;
                        color: #777;
                        flex: 1;
                        font-weight: bold;
                    }
            
                    #CWD-Configuration-Panel .status-bar .button {
                        cursor: pointer;
                        padding: 10px;
                        transition: color 0.3s;
                    }
            
                    #CWD-Configuration-Panel .status-bar .button:hover {
                        color: #f00;
                    }
            
                    #CWD-Configuration-Panel .container {
                        padding: 20px 20px 0;
                    }
                    
                    #CWD-Configuration-Panel .container .code-block {
                        padding: 10px;
                        border: 1px solid #d9d9d9;
                        border-radius: 4px;
                    }
                    
                    #CWD-Configuration-Panel .operation-group {
                        background-color: #ECECEA;
                        border-radius: 8px;
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        padding: 20px 0;
                    }
                    
                    #CWD-Configuration-Panel .operation-group > button {
                        width: 30%;
                    }`
            this.panelHTML = `
<div id="${that.appID}" style="visibility: hidden">
    <n-config-provider :hljs="hljs" :locale="locale">
        <div class="status-bar">
                <div class="title" id="${that.appID}-DraggableArea">{{title}}</div>
                <div class="button-group">
                    <n-popconfirm @positive-click="onRestore">
                        <template #trigger>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <n-button class="button" text>
                                        <n-icon size="20">
                                            ${SystemConfig.ConfigPanel.Icon.Restore}
                                        </n-icon>
                                    </n-button>
                                </template>
                                <span>{{ map2text('restore-info') }}</span>
                            </n-tooltip>
                        </template>
                        <span>{{ map2text('restore-warn') }}</span>
                    </n-popconfirm>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <n-button class="button" @click="toggleLanguage" text>
                                <n-icon size="20">
                                    ${SystemConfig.ConfigPanel.Icon.Language}
                                </n-icon>
                            </n-button>
                        </template>
                        <span>{{ map2text('toggle-language-info') }}</span>
                    </n-tooltip>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <n-button class="button" @click="openUrl('https://jiang-taibai.github.io/chatgpt-with-date/', '_blank')" text>
                                <n-icon size="20">
                                    ${SystemConfig.ConfigPanel.Icon.Documentation}
                                </n-icon>
                            </n-button>
                        </template>
                        <span>{{ map2text('documentation-info') }}</span>
                    </n-tooltip>
                    <n-button class="button" @click="toggleFolding" text>
                        <n-icon v-if="folding" size="20">
                            ${SystemConfig.ConfigPanel.Icon.Maximize}
                        </n-icon>
                        <n-icon v-else size="20">
                            ${SystemConfig.ConfigPanel.Icon.Minimize}
                        </n-icon>
                    </n-button>
                    <n-button class="button" @click="onClose" text>
                        <n-icon size="20">
                            ${SystemConfig.ConfigPanel.Icon.Close}
                        </n-icon>
                    </n-button>
                </div>
        </div>
        <div v-show="!folding">
            <n-scrollbar style="max-height: 80vh">
                <div class="container">
                    <n-form :label-width="i18n === 'zh' ? 40 : 80" :model="configForm" label-placement="left">
                        <n-form-item v-show="!configForm.advanced.enable" :label="map2text('template')" path="format">
                            <n-select v-model:value="configForm.format"
                                      :disabled="configForm.advanced.enable" :render-label="renderLabel"
                                      :options="formatOptions" @update:value="onConfigUpdate"></n-select>
                        </n-form-item>
                        <n-form-item v-show="!configForm.advanced.enable" :label="map2text('preview')" path="format">
                            <div v-html="reFormatTimeHTML(configForm.format)"></div>
                        </n-form-item>
                        <n-form-item v-show="!configForm.advanced.enable" :label="map2text('code')" path="format">
                            <div class="code-block">
                                <n-scrollbar style="max-height: 4em">
                                    <n-code :code="configForm.format" language="html" word-wrap/>
                                </n-scrollbar>
                            </div>
                        </n-form-item>
                        <n-form-item :label="map2text('advance')" path="advanced.enable">
                            <n-switch v-model:value="configForm.advanced.enable" @update:value="onConfigUpdate" />
                        </n-form-item>
                        <div v-show="configForm.advanced.enable">
                            <n-button strong secondary type="info" round block @click="copyGPTPrompt">{{ map2text('gpt-prompt-info') }}</n-button>
                            <div style="height: 24px;"></div>
                            <n-form-item label="HTML" path="advanced.htmlTextContent">
                                <n-input type="textarea" :placeholder="map2text('input-html')" 
                                            @keydown.tab="insertTab" @update:value="onConfigUpdate"
                                            v-model:value="configForm.advanced.htmlTextContent"/>
                            </n-form-item>
                            <n-form-item label="CSS" path="advanced.styleTextContent">
                                <n-input type="textarea" :placeholder="map2text('input-css')" 
                                            @keydown.tab="insertTab" @update:value="onConfigUpdate"
                                            v-model:value="configForm.advanced.styleTextContent"/>
                            </n-form-item>
                            <n-form-item label="JS" path="advanced.scriptTextContent">
                                <n-input type="textarea" :placeholder="map2text('input-js')" 
                                            @keydown.tab="insertTab" @update:value="onConfigUpdate"
                                            v-model:value="configForm.advanced.scriptTextContent"/>
                            </n-form-item>
                        </div>
                    </n-form>
                </div>
            </n-scrollbar>
        <div class="operation-group">
            <n-button strong secondary type="error" @click="onReset" :disabled="!configDirty">{{map2text('reset')}}</n-button>
            <n-button strong secondary type="primary" @click="onApply">{{map2text('apply')}}</n-button>
            <n-button strong secondary type="primary" @click="onConfirm">{{map2text('save')}}</n-button>
        </div>
    </div>
    </n-config-provider>
</div>`
            this.appConfig = {
                el: `#${that.appID}`,
                data() {
                    return {
                        date: new Date(),
                        hljs: hljs,
                        title: "ChatGPTWithDate",
                        formatOptions: SystemConfig.TimeRender.TimeTagTemplates.map(item => {
                            return {label: item, value: item}
                        }),
                        configForm: {
                            format: that.userConfig.timeRender.format,
                            advanced: {
                                enable: that.userConfig.timeRender.advanced.enable,
                                htmlTextContent: that.userConfig.timeRender.advanced.htmlTextContent,
                                styleTextContent: that.userConfig.timeRender.advanced.styleTextContent,
                                scriptTextContent: that.userConfig.timeRender.advanced.scriptTextContent,
                            },
                        },
                        config: {
                            format: that.userConfig.timeRender.format,
                            mode: that.userConfig.timeRender.mode,
                            advanced: {
                                enable: that.userConfig.timeRender.advanced.enable,
                                htmlTextContent: that.userConfig.timeRender.advanced.htmlTextContent,
                                styleTextContent: that.userConfig.timeRender.advanced.styleTextContent,
                                scriptTextContent: that.userConfig.timeRender.advanced.scriptTextContent,
                            },
                        },
                        locale: null,
                        i18n: that.userConfig.i18n,
                        folding: false,
                        configDirty: false,
                        configPanel: {
                            display: true,
                        },
                    };
                },
                methods: {
                    onApply() {
                        const jsValidResult = Utils.isJavaScriptSyntaxValid(this.configForm.advanced.scriptTextContent)
                        if (!jsValidResult.valid) {
                            that.notification.error({
                                title: this.map2text('js-invalid-info'),
                                content: jsValidResult.error.toString(),
                                duration: 3000,
                                keepAliveOnHover: true,
                            });
                            return false
                        }
                        this.config = JSON.parse(JSON.stringify(this.configForm));
                        that.updateConfig({timeRender: this.config})
                        this.configDirty = false
                        return true
                    },
                    onConfirm() {
                        this.onApply()
                        this.onClose()
                    },
                    onReset() {
                        this.configForm = JSON.parse(JSON.stringify(this.config));
                        this.configDirty = false
                    },
                    onConfigUpdate() {
                        this.configDirty = true
                    },
                    renderLabel(option) {
                        return Vue.h(TimeTagComponent, {
                            html: option.label,
                        })
                    },
                    reFormatTimeHTML(html) {
                        return Utils.formatDateTimeByDate(this.date, html)
                    },
                    insertTab(event) {
                        if (!event.shiftKey) {  // 确保不是 Shift + Tab 组合
                            event.preventDefault();  // 阻止 Tab 键的默认行为
                            // 尝试使用 execCommand 插入四个空格
                            if (document.queryCommandSupported('insertText')) {
                                document.execCommand('insertText', false, '    ');
                            } else { // 如果浏览器不支持 execCommand，回退到原始方法（不支持撤销）
                                const start = event.target.selectionStart;
                                const end = event.target.selectionEnd;
                                const value = event.target.value;
                                event.target.value = value.substring(0, start) + "    " + value.substring(end);
                                // 移动光标位置到插入的空格后
                                event.target.selectionStart = event.target.selectionEnd = start + 4;
                                // 触发 input 事件更新 v-model
                                this.$nextTick(() => {
                                    event.target.dispatchEvent(new Event('input'));
                                });
                            }
                        }
                    },
                    onClose() {
                        that.hide()
                    },
                    toggleFolding() {
                        this.folding = !this.folding
                    },
                    onRestore() {
                        // 清空所有 GM 存储的数据
                        const keys = GM_listValues();
                        keys.forEach(key => {
                            GM_deleteValue(key);
                        });
                        // 重置配置至出厂设置
                        const defaultConfig = that.userConfig.getDefaultConfig()
                        this.config = defaultConfig.timeRender
                        this.i18n = defaultConfig.i18n
                        // 重置 Vue 表单
                        this.onReset()
                        // 重置样式与脚本
                        that.updateConfig(defaultConfig)
                    },
                    toggleLanguage() {
                        let index = SystemConfig.ConfigPanel.I18N.supported.indexOf(this.i18n)
                        if (index === -1) {
                            Logger.error("嗯？当前语言未知？")
                        }
                        index = (index + 1) % SystemConfig.ConfigPanel.I18N.supported.length;
                        this.i18n = SystemConfig.ConfigPanel.I18N.supported[index]
                        that.userConfig.updateOne('i18n', this.i18n)
                        this.setNaiveUILanguage()
                    },
                    setNaiveUILanguage() {
                        this.locale = this.i18n === 'zh' ? naive.zhCN : null;
                    },
                    openUrl(url, target) {
                        window.open(url, target)
                    },
                    copyGPTPrompt() {
                        navigator.clipboard.writeText(Utils.base64Decode(this.map2text('gpt-prompt'))).then(() => {
                            that.notification.success({
                                content: this.map2text('copy-success-info'),
                                duration: 1000,
                            });
                        })
                    },
                },
                computed: {
                    map2text() {
                        return key => {
                            const language = this.i18n;
                            if (!SystemConfig.ConfigPanel.I18N[language]) {
                                Logger.error(`当前语言 ${language} 不受支持！已回退至 ${SystemConfig.ConfigPanel.I18N.default}`);
                                return SystemConfig.ConfigPanel.I18N[SystemConfig.ConfigPanel.I18N.default][key] || 'NULL';
                            }
                            if (!SystemConfig.ConfigPanel.I18N[language][key]) {
                                Logger.debug(`当前语言 ${language} 不存在键为 ${key} 的 i18n 支持，已回退至 ${SystemConfig.ConfigPanel.I18N.default}`);
                                return SystemConfig.ConfigPanel.I18N[SystemConfig.ConfigPanel.I18N.default][key] || 'NULL';
                            }
                            return SystemConfig.ConfigPanel.I18N[language][key];
                        };
                    }
                },
                created() {
                    this.date = new Date()
                    this.formatOptions.forEach(item => {
                        item.label = this.reFormatTimeHTML(item.value)
                    })
                },
                mounted() {
                    this.timestampInterval = setInterval(() => {
                        // 满足打开状态且高级模式开启时才更新时间，避免不必要的性能消耗
                        if (that.isShow()) {
                            this.date = new Date()
                            this.formatOptions.forEach(item => {
                                item.label = this.reFormatTimeHTML(item.value)
                            })
                        }
                    }, 50)
                    this.setNaiveUILanguage()
                },
                beforeUnmount() {
                    clearInterval(this.timestampInterval)
                },
            }
        }

        /**
         * 初始化样式。
         * 同时为了避免样式冲突，在 head 元素中加入一个 <meta name="naive-ui-style" /> 元素，
         * naive-ui 会把所有的样式刚好插入这个元素的前面。
         * 参考 https://www.naiveui.com/zh-CN/os-theme/docs/style-conflict
         *
         * @returns {Promise}
         * @private
         */
        _initStyle() {
            return new Promise(resolve => {
                const meta = document.createElement('meta');
                meta.name = 'naive-ui-style'
                document.head.appendChild(meta);
                this.styleService.updateStyle(SystemConfig.ConfigPanel.StyleKey, this.panelStyle)
                resolve()
            })
        }

        /**
         * 初始化 Vue 与 Naive UI 脚本。无法使用 <script src="https://xxx"> 的方式插入，因为 ChatGPT 有 CSP 限制。
         * 采用 GM_xmlhttpRequest 的方式获取 Vue 与 Naive UI 的脚本内容，然后插入 <script>脚本内容</script> 到页面中。
         *
         * @returns {Promise}
         * @private
         */
        _initExternalResources() {
            return new Promise(resolve => {
                let completeCount = 0;
                const resources = [
                    {type: 'js', url: 'https://unpkg.com/vue@3.4.26/dist/vue.global.js'},
                    {type: 'js', url: 'https://unpkg.com/naive-ui@2.38.1/dist/index.js'},
                    {type: 'css', url: 'https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/default.min.css'},
                    {type: 'js', url: 'https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js'},
                ]
                resources.forEach(resource => {
                    let element = null
                    if (resource.type === 'js') {
                        element = GM_addElement('script', {
                            src: resource.url,
                            type: 'text/javascript'
                        });
                    } else if (resource.type === 'css') {
                        element = GM_addElement('link', {
                            rel: 'stylesheet',
                            type: 'text/css',
                            href: resource.url
                        });
                    }
                    element.onload = () => {
                        completeCount++;
                        if (completeCount === resources.length) {
                            resolve()
                        }
                    }
                })
                // 以下方法有 CSP 限制
                // const naiveScript = document.createElement('script');
                // naiveScript.setAttribute("type", "text/javascript");
                // naiveScript.text = "https://unpkg.com/naive-ui@2.38.1/dist/index.js";
                // document.documentElement.appendChild(naiveScript);
            })
        }

        /**
         * 初始化配置面板，插入配置面板的 HTML 到 body 中。
         *
         * @returns {Promise}
         * @private
         */
        _initPanel() {
            const that = this
            return new Promise(resolve => {
                const panelRoot = document.createElement('div');
                panelRoot.innerHTML = that.panelHTML;
                document.body.appendChild(panelRoot);
                resolve()
            })
        }

        /**
         * 初始化 Vue 实例，挂载到配置面板的 HTML 元素上。
         *
         * @private
         */
        _initVue() {
            const app = Vue.createApp(this.appConfig);
            app.use(naive)
            const {notification} = naive.createDiscreteApi(
                ["notification"], {
                    configProviderProps: {
                        theme: naive.lightTheme
                    }
                },);
            this.notification = notification
            app.mount(`#${this.appID}`);
        }

        /**
         * 初始化配置面板大小与位置
         *
         * @private
         */
        _initConfigPanelSizeAndPosition() {
            const panel = document.getElementById(this.appID)

            // 获取存储的大小
            const size = GM_getValue(SystemConfig.GMStorageKey.ConfigPanel.Size, {})
            if (size && size.width && !isNaN(size.width)) {
                panel.style.width = size.width + 'px';
            }

            // 获取存储的位置
            const position = GM_getValue(SystemConfig.GMStorageKey.ConfigPanel.Position, {})
            if (position && position.left && position.top && !isNaN(position.left) && !isNaN(position.top)) {
                const {left, top} = position
                const {refineLeft, refineTop} = this.refinePosition(left, top, panel.offsetWidth, panel.offsetHeight)
                panel.style.left = refineLeft + 'px';
                panel.style.top = refineTop + 'px';
            }

            // 如果面板任何一边超出屏幕，则重置位置
            // const rect = panel.getBoundingClientRect()
            // const leftTop = {
            //     x: rect.left,
            //     y: rect.top
            // }
            // const rightBottom = {
            //     x: rect.left + rect.width,
            //     y: rect.top + rect.height
            // }
            // const screenWidth = window.innerWidth;
            // const screenHeight = window.innerHeight;
            // if (leftTop.x < 0 || leftTop.y < 0 || rightBottom.x > screenWidth || rightBottom.y > screenHeight) {
            //     panel.style.left = '50px';
            //     panel.style.top = '50px';
            // }

        }

        /**
         * 初始化配置面板事件监控，包括面板拖动、面板大小变化等事件。
         *
         * @private
         */
        _initConfigPanelEventMonitor() {
            const that = this
            const panel = document.getElementById(this.appID)
            const draggableArea = document.getElementById(`${this.appID}-DraggableArea`)

            // 监听面板宽度变化
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.contentRect.width) {
                        GM_setValue(SystemConfig.GMStorageKey.ConfigPanel.Size, {
                            width: entry.contentRect.width,
                        })
                    }
                }
            });
            resizeObserver.observe(panel);

            // 监听面板位置
            draggableArea.addEventListener('mousedown', function (e) {
                const offsetX = e.clientX - draggableArea.getBoundingClientRect().left;
                const offsetY = e.clientY - draggableArea.getBoundingClientRect().top;

                function mouseMoveHandler(e) {
                    const left = e.clientX - offsetX;
                    const top = e.clientY - offsetY;
                    const {
                        refineLeft, refineTop
                    } = that.refinePosition(left, top, panel.offsetWidth, panel.offsetHeight);
                    panel.style.left = refineLeft + 'px';
                    panel.style.top = refineTop + 'px';
                    GM_setValue(SystemConfig.GMStorageKey.ConfigPanel.Position, {
                        left: refineLeft, top: refineTop,
                    })
                }

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', function () {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                });
            });
        }

        /**
         * 限制面板位置，使其任意一部分都不超出屏幕
         *
         * @param left      面板左上角 x 坐标
         * @param top       面板左上角 y 坐标
         * @param width     面板宽度
         * @param height    面板高度
         * @returns {{refineLeft: number, refineTop: number}}   返回修正后的坐标
         */
        refinePosition(left, top, width, height) {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            return {
                refineLeft: Math.min(Math.max(0, left), screenWidth - width),
                refineTop: Math.min(Math.max(0, top), screenHeight - height),
            }
        }

        /**
         * 初始化菜单命令，用于在 Tampermonkey 的菜单中添加一个配置面板的命令。
         *
         * @private
         */
        _initMenuCommand() {
            let that = this
            if (IsConfigPage) {
                GM_registerMenuCommand("打开配置面板 Open the configuration panel", () => {
                    that.show()
                })
            } else {
                GM_registerMenuCommand("配置面板 Configuration Panel", () => {
                    GM_openInTab("https://jiang-taibai.github.io/chatgpt-with-date-config-page/");
                })
            }
            GM_registerMenuCommand("文档 Documentation", () => {
                GM_openInTab("https://jiang-taibai.github.io/chatgpt-with-date/");
            })
            GM_registerMenuCommand("GitHub", () => {
                GM_openInTab("https://github.com/jiang-taibai/chatgpt-with-date/");
            })
        }

        /**
         * 显示配置面板
         */
        show() {
            document.getElementById(this.appID).style.visibility = 'visible';
            unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.ConfigPanel.ApplicationRegisterKey].visibility = true
        }

        /**
         * 隐藏配置面板
         */
        hide() {
            document.getElementById(this.appID).style.visibility = 'hidden';
            unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.ConfigPanel.ApplicationRegisterKey].visibility = false
        }

        isShow() {
            return unsafeWindow[SystemConfig.Main.WindowRegisterKey][SystemConfig.ConfigPanel.ApplicationRegisterKey].visibility
        }

        /**
         * 更新配置，由 Vue 组件调用来更新配置并重新渲染时间
         * @param config
         */
        updateConfig(config) {
            this.userConfig.update(config)
            this.timeRendererService.reRender()
        }
    }

    class Main {
        static ComponentsConfig = [
            UserConfig, StyleService, MessageService,
            MonitorService, TimeRendererService,
            JavaScriptService, HookService,
            ConfigPanelService,
        ]

        constructor() {
            for (let componentClazz of Main.ComponentsConfig) {
                const instance = new componentClazz();
                this[componentClazz.name] = instance
                ComponentLocator.register(componentClazz, instance)
            }
        }

        /**
         * 获取依赖关系图
         * @returns {[]} 依赖关系图，例如 [{node:'ComponentClass0', dependencies:['ComponentClass2', 'ComponentClass3']}, ...]
         * @private
         */
        _getDependencyGraph() {
            const dependencyGraph = []
            for (let componentClazz of Main.ComponentsConfig) {
                const dependencies = this[componentClazz.name].dependencies.map(dependency => dependency.clazz.name)
                dependencyGraph.push({node: componentClazz.name, dependencies})
            }
            Logger.debug('依赖关系图：', JSON.stringify(dependencyGraph))
            return dependencyGraph
        }

        /**
         * 注册全局变量
         * @private
         */
        _registerGlobalVariables() {
            unsafeWindow[SystemConfig.Main.WindowRegisterKey] = {}
        }

        start() {
            this._registerGlobalVariables()
            const dependencyGraph = this._getDependencyGraph()
            const order = Utils.dependencyAnalysis(dependencyGraph)
            Logger.debug('初始化顺序：', order.join(' -> '))
            for (let componentName of order) {
                this[componentName].initDependencies()
            }
            for (let componentName of order) {
                this[componentName].init()
            }
        }
    }

    const main = new Main();
    main.start();

})();
