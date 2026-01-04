// ==UserScript==
// @name         OM功能扩展
// @version      20240509.0926
// @description  OM系统功能调整优化
// @author       Mr.Q
// @namespace    https://greasyfork.org/users/9065
// @match        *://om40.brightdairy.com*/*
// @match        *://omtest.brightdairy.com*/*
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWAC4W1hAuFtZALhbWaC4W1oAuFtWKLRXWiC4W1nYuFtZYLhbWKi4W1gQtFdYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuFtYALhbWGC4V1nIuFtbELhbW+i4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW6C4W1qAuFtZGLhXVBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuFtYALRXVIi0W1ZwtFtb2LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtXWLhbWYC4W1gYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWCi4W1oQuFtb0LhbW/y4W1v8uFtb/MhzX/1BG3f+Aeeb/oZ/t/7q18f/CwfP/wLvy/7Cs8P+RkOr/a2Hi/zws2f8vGNb/LhbW/y4W1v8uFtb/LhbWzi4W1jwuFtYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALhbWAC4W1jAtFdbQLhbW/y4W1v8uF9b/Sz3c/52a7P/h5fn/////////////////////////////////////////////////+Pn9/8PF8/91buT/NSHX/y4W1v8uFtb/LhbW+i4W1oguFtYIAAAAAAAAAAAAAAAAAAAAAC4W1gItFtZcLhbW8i4W1v8uFtb/STrb/7Cw8P/5+v7//////////////////v7+//j5/f/09f3/8/P8//P0/P/29/3/+/v+//7+/v/////////////////i5Pn/e3Tl/y4W1v8uFtb/LhbW/y4W1r4uFtYYAAAAAAAAAAAtFtYCLhbWeC4W1vwuFtb/Mx3X/4yH6f/z9fz///////7+/v/y8/z/wcPz/4yH6f9lWeH/Sj7c/zkt2P8zJNf/NCbX/z8y2f9VR97/c23k/6Og7f/b3fj/+vv+///////7+/7/QS7a/0Ew2v9MPtz/LhbW/y4W1dguFtYmAAAAAC4W1nAtFtb/LhbW/zgk2P/FxvT//v7///z8/v/T1Pb/fXbm/z0t2f8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y8Z1v9VSt7/oqHt/9PU9v82Idf/tbPw/9jZ9/8uFtb/LhbW/y4W1uAtFtYWLhXV5C4W1v8uFtb/XVHf//7+/v/U1fb/a2Li/zAa1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8/L9n/LhbW/zck2P/j5Pn/4eP5/y4W1v8uFtb/LhbW/y4V1mwuFtb/LhbW/y4W1v81INf/cmvj/zMf1/8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LxnW/9nc+P9PQt3/2dv4//7+/v+bl+v/LhbW/y4W1v8uFtb/LhbWii4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/ZFzh/y8Y1v9fVeD/dG7k/zMe1/8uFtb/LhbW/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y0W1oouFtb/LhbW/2Va4f/Oy/X/zsr1/4yI6f8uFtb/LhbW/y4W1v8uFtb/V0re/8nG9P/Py/X/z8v1/4l+6P8uFtb/LhbW/0Ew2v9PRN3/T0Td/09E3f9ALtn/Ylbg/8nH9f+Iguj/QS/a/8TC9P/Kx/X/nJns/y4W1v8uFtb/LRbWii4W1v8uFtb/m5Lr////////////+fr+/0Au2f8uFtb/LhbW/y4W1v+vqu//////////////////pZvt/y4W1v8uGNb/5uf6/////////////////+Lj+f+cl+z//////+fn+v9kWOH////////////4+f3/OSfY/y4W1v8tFtaKLhbW/y4W1v9GNtv/ioLo/9vb+P//////al7i/y4W1v8uFtb/LhbW/7278v/+/v7/m5Ts/4qC6P9iVOD/LhbW/zIh1//8/P7/+/v+/+rt+//3+P3//////2Nc4f/v7/z/7/H8/zgo2P+EfOf/3d74//z9/v9FM9r/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/hn7n//////+XkOv/LhbW/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/Z1/j/OirY/7a28f//////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v9bTt///v7+/8TC8/8uFtb/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/zom2P/29/3/6+z7/zId1/8uFtb/LhbW/7278v/+/v7/Szfb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n/+vr+/73A8/+7vvL/6+37//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/LhbW/9jZ9//+/v7/TDzc/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f///////////////////////P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v8uFtb/r6vv//////92bOT/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5//f4/f+Zmuv/l5br/+Di+f/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v9vZeP/4N75/+De+f/w8Pz//////+7t+//g3vn/4N75//X1/f/+/v7/5eP6/+De+f+Tier/LhbW/zIh1//8/P7/+fn9/+De+f/09Pz//////1JF3f/j4/n/7/H8/zIe1/8uFtb/wcHz//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/5iQ6////////////////////////////////////////////////////////////6Wb7f8uFtb/MiHX//z8/v//////////////////////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/Py7Z/3hu5f95b+X/eW/l/3lv5f+vrfD//////6+t8P95b+X/eW/l/3lv5f95b+X/WEne/y4W1v8yIdf//Pz+/+Xk+v95b+X/zs71//////9SRd3/4+P5//n6/v+ytfD/sLPw/+jq+v/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/0g22/9aSt//RjTb/4J65///////gnrn/0Y02/9aSt//SDbb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n///////////////////////z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v83JNj/6er7//z9/v/a2/j/g33n//////+Dfef/2dv4//z9/v/p6/v/NyPY/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f/4+f3/o6Xt/6Gh7f/k5vr//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/3ty5f/+/v7//P3+/8jJ9P+Ce+f//////4J85//HyPT//P3+//7+/v97cuX/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uF9b/0ND2//////9+dub/Mx3X/4J65///////gnrn/zMd1/9+dub//////9DQ9v8uFtb/LhbW/zIh1//8/P7/1tT3/4R/5//s7vv//////1JF3f/j4/n/7/H8/zYm2P9CN9r/yMr0//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/1ZI3v/9/f7/5+j6/zUg1/8uFtb/gnrn//////+Ceuf/LhbW/zQg1//n6Pr//f3+/1ZI3v8uFtb/MiHX//z8/v/W1Pf/wr7z///////+/v7/Szzc/+Pj+f/v8fz/oqHt//j5/f/9/f7//P3+/0Uz2v8uFtb/LRbWii4W1v8uFtb/VUve/4OA5/9jWuH/LhbW/y4W1v+Ceuf//////4J65/8uFtb/LhbW/2Na4f+DgOf/VUve/y4W1v8wG9b/gn/n/3Nt5P9VR97/g4Dn/3dx5f8vGNb/4+P5/+/x/P+mpe7////////////r7fv/NCDX/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/zcm2P9EO9v/NybY/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v9BNtr/Qjna/zMg1/9EO9v/RDvb/zor2P8uFtb/LhbW/y4W1YguFtbcLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbWZi4W1l4tFtb4LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1tAuFtYO//x////AA//+AAD/+AAAP/AAAA/gAAAHwAAAA4AAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAE=
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/462234/1322684/Message.js
// @require      https://update.greasyfork.org/scripts/456485/1360571/pops.js
// @require      https://update.greasyfork.org/scripts/455186/1365298/WhiteSevsUtils.js
// @require      https://update.greasyfork.org/scripts/465772/1360574/DOMUtils.js
// @downloadURL https://update.greasyfork.org/scripts/492635/OM%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492635/OM%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow = globalThis || window;
    }
    /* -----------------↓公共配置↓----------------- */
    /**
     * @type {import("../库/pops")}
     */
    const pops = window.pops;
    /**
     * @type {import("../库/Utils")}
     */
    const utils = window.Utils.noConflict();
    /**
     * @type {import("../库/DOMUtils")}
     */
    const DOMUtils = window.DOMUtils.noConflict();
    /**
     * @type {import("../库/Qmsg")}
     */
    const Qmsg = window.Qmsg;

    /* 配置吐司Qmsg */
    Qmsg.config({
        position: "center",
        html: true,
        maxNums: 5,
        autoClose: true,
        showClose: false,
        showReverse: true,
    });

    const log = new utils.Log(GM_info, unsafeWindow.console || console);
    log.config({
        debug: false,
        logMaxCount: 100,
        autoClearConsole: true,
        tag: true,
    });
    const httpx = new utils.Httpx(GM_xmlhttpRequest);
    httpx.config({
        onabort() {
            Qmsg.error("请求被取消");
        },
        ontimeout() {
            Qmsg.error("请求超时");
        },
        onerror(response) {
            Qmsg.error("请求异常");
            log.error(["httpx-onerror", response]);
        },
    });

    /**
     * 自定义api
     */
    const API = {
        /**
         * 获取取消原因列表
         */
        getCancelReason() {
            function formatCancelReasons(data) {
                return data.map((item) => ({
                    value: item.idCra,
                    text: item.vrCraName,
                }));
            }
            return new Promise(async (resolve) => {
                const dc = Math.floor(new Date().getTime() / 1000);
                let CancelReason = await httpx.get({
                    url: `${document.location.origin}/brightdairy2/baseData/getCancelReason?_dc=` + dc,
                    fetch: true,
                    responseType: "json",
                });
                if (!CancelReason.status) {
                    resolve([]);
                    return;
                }
                let CancelReasonJSON = utils.toJSON(CancelReason.data.responseText);
                let result = [];
                try {
                    result = result.concat(formatCancelReasons(CancelReasonJSON.data));
                } catch (error) {
                    console.error("Error fetching cancel reasons:", error);
                    // 根据需求处理错误
                }
                resolve(result);
            });
        },
        /**
         * 获取订单类型
         */
        getOrderType() {
            /**
             * 格式化数据函数
             * 将输入的数据数组转换为以idOty为键、value为值的对象
             * @param {Array} data - 输入的数据数组，每个元素应包含idOty和value属性
             * @returns {Object} organizedData - 返回一个对象，以idOty为键、value为值
             */
            function formatData(data) {
                // 创建一个空对象以存储格式化后的数据
                const organizedData = {};
                // 遍历数据数组，将每个元素的idOty作为键，value作为值存储到organizedData对象中
                data.forEach((item) => {
                    organizedData[item.idOty] = item.value;
                });
                // 返回格式化后的数据对象
                return organizedData;
            }
            return new Promise(async (resolve, reject) => {
                try {
                    const url = `${document.location.origin}/brightdairy2/repr/s/addOrderAction/getTbType`;
                    const response = await httpx.get({
                        url,
                        fetch: true,
                        responseType: "json",
                    });

                    if (!response.status) {
                        resolve([]);
                        return;
                    }

                    const result = formatData(response.data.response);
                    resolve(result);
                } catch (error) {
                    console.error("Error fetching order types:", error);
                    reject(error); // 将错误传递给Promise链的下一个拒绝处理程序
                }
            });
        },

        /**
         * 查找与指定属性集匹配的 Ext 组件。
         *
         * **示例**:
         * // 查找 id 为 'myPanel' 且 title 为 'My Panel' 的组件
         * const myPanelAttrs = { id: 'myPanel', title: 'My Panel' };
         * const matchingPanels = findCmp(myPanelAttrs);
         * console.log(matchingPanels); // 输出：[{id: 'myPanel', title: 'My Panel', ...}] （包含一个匹配的面板）
         * @param {Object} attributes - 匹配条件对象，键值对表示期望的组件属性及其对应值。
         * @returns {Ext.Component[]} - 匹配的 Ext 组件数组。
         */
        findCmp(attributes) {
            var matchedComponents = [];
            //首先检查attributes是否为自有属性
            var keys = [];
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            // 遍历所有组件并筛选出符合条件的组件
            Ext.ComponentMgr.all.each(function (cmp) {
                // 遍历每个属性并进行匹配
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    if (cmp[prop] !== attributes[prop]) {
                        return; // 如果属性不相等，提前退出当前迭代
                    }
                }
                // 所有属性都通过了比较，将组件添加到结果数组中
                matchedComponents.push(cmp);
            });
            return matchedComponents;
        },
    };

    /**
     * css
     */
    const OwnCSS = {
        UIScriptListCSS: `
        .w-script-list-item {
          padding: 10px 0;
          border-bottom: 1px solid #e5e5e5;
          font-size: 16px;
          text-align: left;
        }
        .w-script-version,
        .w-script-fan-score,
        .w-script-create-time,
        .w-script-update-time,
        .w-script-locale,
        .w-script-sync-type{
          font-size: 14px;
          color: #7c7c7c;
        }
        .w-script-fan-score {
          margin-left: unset !important;
          text-align: unset !important;
          max-width: unset !important;
        }
        .w-script-deleted{
          text-decoration: line-through;
          font-style: italic;
          color: red;
        }
        .w-script-deleted .w-script-name::before {
          content: "【删除】";
        }`,
        OwnCSS: `
      .whitesev-hide{
        display: none;
      }
     .whitesev-hide-important{
        display: none !important;
      }
      .whitesev-hide{
        display: none;
      }`,
        /**
         * 初始化
         */
        init() {
            GM_addStyle(this.OwnCSS);
        },
    };

    /**
     * 配置面板
     */
    const PopsPanel = {
        /**
         * 本地存储的总键名
         */
        key: "GM_Panel",
        /**
         * 属性attributes的data-key
         */
        attributeDataKey_Name: "data-key",
        /**
         * 属性attributes的data-default-value
         */
        attributeDataDefaultValue_Name: "data-default-value",
        /**
         * 初始化菜单
         */
        init() {
            this.initLocalDefaultValue();
            if (unsafeWindow.top !== unsafeWindow.self) {
                return;
            }
            OwnMenu.menu.add([
                {
                    key: "show_pops_panel_setting",
                    text: "⚙ 设置",
                    autoReload: false,
                    isStoreValue: false,
                    showText(text) {
                        return text;
                    },
                    callback: () => {
                        this.showPanel();
                    },
                },
            ]);
        },
        /**
         * 初始化本地设置默认的值
         */
        initLocalDefaultValue() {
            let content = this.getContent();
            content.forEach((item) => {
                if (!item["forms"]) {
                    return;
                }
                item.forms.forEach((__item__) => {
                    if (__item__.forms) {
                        __item__.forms.forEach((containerItem) => {
                            if (!containerItem.attributes) {
                                return;
                            }
                            let key = containerItem.attributes[this.attributeDataKey_Name];
                            let defaultValue = containerItem.attributes[this.attributeDataDefaultValue_Name];
                            if (this.getValue(key) == null) {
                                this.setValue(key, defaultValue);
                            }
                        });
                    } else {
                    }
                });
            });
        },
        /**
         * 自动判断菜单是否启用，然后执行回调
         * @param {string} key
         * @param {Function} callback 回调
         */
        execMenu(key, callback) {
            if (typeof key !== "string") {
                throw new TypeError("key 必须是字符串");
            }
            if (PopsPanel.getValue(key)) {
                callback();
            }
        },
        /**
         * 设置值
         * @param {string} key 键
         * @param {any} value 值
         */
        setValue(key, value) {
            let localValue = GM_getValue(this.key, {});
            localValue[key] = value;
            GM_setValue(this.key, localValue);
        },
        /**
         * 获取值
         * @param {string} key 键
         * @param {any} defaultValue 默认值
         * @returns {any}
         */
        getValue(key, defaultValue) {
            let localValue = GM_getValue(this.key, {});
            return localValue[key] ?? defaultValue;
        },
        /**
         * 删除值
         * @param {string} key 键
         */
        deleteValue(key) {
            let localValue = GM_getValue(this.key, {});
            delete localValue[key];
            GM_setValue(this.key, localValue);
        },
        /**
         * 显示设置面板
         */
        showPanel() {
            pops.panel({
                title: {
                    text: `${GM_info?.script?.name || "OM功能扩展"}-设置`,
                    position: "center",
                },
                content: this.getContent(),
                mask: {
                    enable: true,
                    clickEvent: {
                        toClose: true,
                    },
                },
                style: OwnCSS.UIScriptListCSS,
                width: pops.isPhone() ? "92vw" : "800px",
                height: pops.isPhone() ? "80vh" : "600px",
                only: true,
                drag: true,
            });
        },
        /**
         * 获取按钮配置
         * @param {string} text 文字
         * @param {string|undefined} description 描述
         * @param {string} key 键
         * @param {boolean} defaultValue 默认值
         * @param {?(event:Event,value: boolean)=>boolean} _callback_ 点击回调
         */
        getSwtichDetail(text, description, key, defaultValue, _callback_) {
            let result = {
                text: text,
                description: description,
                type: "switch",
                attributes: {},
                getValue() {
                    if (PopsPanel.getValue(key) == null) {
                        PopsPanel.setValue(key, Boolean(defaultValue));
                    }
                    return Boolean(PopsPanel.getValue(key, defaultValue));
                },
                callback(event, value) {
                    log.success(`${value ? "开启" : "关闭"} ${text}`);
                    if (typeof _callback_ === "function") {
                        if (_callback_(event, value)) {
                            return;
                        }
                    }
                    PopsPanel.setValue(key, Boolean(value));
                },
            };
            result.attributes[this.attributeDataKey_Name] = key;
            result.attributes[this.attributeDataDefaultValue_Name] = Boolean(defaultValue);
            return result;
        },
        /**
         * 获取自定义配置的规则的textarea
         * @returns {PopsPanelOwnDetails}
         */
        getOwnextAreaRule(text, key, defaultValue, className) {
            return {
                text: text,
                type: "forms",
                forms: [
                    {
                        type: "own",
                        afterAddToUListCallBack(formConfig, rightContainerOptions) {
                            DOMUtils.on(
                                rightContainerOptions.formHeaderDivElement.querySelector("a"),
                                "click",
                                void 0,
                                () => {
                                    PopsPanel.deleteValue(key);
                                    rightContainerOptions.ulElement.querySelector("textarea").value = defaultValue;
                                    Qmsg.success("已重置");
                                }
                            );
                        },
                        getLiElementCallBack(liElement) {
                            let $textAreaContainer = DOMUtils.createElement("div", {
                                className: `pops-panel-textarea ${className}`,
                                innerHTML: `
                      <style type="text/css">
                      .${className}{
                        width: 100%;
                      }
                      .${className} textarea{
                        font-size: 13px;
                        min-height: 400px;
                        white-space: pre;
                        border-radius: 0 !important;
                      }
                      </style>
                      <textarea></textarea>
                      `,
                            });
                            let $textArea = $textAreaContainer.querySelector("textarea");
                            $textArea.value = PopsPanel.getValue(key, defaultValue);
                            liElement.appendChild($textAreaContainer);
                            DOMUtils.on(
                                $textArea,
                                "input propertychange",
                                void 0,
                                utils.debounce(() => {
                                    PopsPanel.setValue(key, $textArea.value);
                                }, 100)
                            );
                            return liElement;
                        },
                    },
                ],
            };
        },
        /**
         * 获取配置内容
         * @returns {PopsPanelContentConfig[]}
         */
        getContent() {
            return [
                {
                    id: "om-panel-config-optimization",
                    title: "优化",
                    forms: [
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                {
                                    text: "分页大小",
                                    type: "input",
                                    attributes: {
                                        "data-key": "pageSize",
                                        "data-default-value": 20,
                                    },
                                    getValue() {
                                        return PopsPanel.getValue(
                                            this.attributes["data-key"],
                                            this.attributes["data-default-value"]
                                        );
                                    },
                                    callback(event, value) {
                                        // 验证输入值范围
                                        if (value >= 1 && value <= 500) {
                                            PopsPanel.setValue(this.attributes["data-key"], value);
                                        } else {
                                            // 如果超出范围，使用默认值
                                            Qmsg.warning("分页大小范围为1-500", { timeout: 1000 });
                                            PopsPanel.setValue(
                                                this.attributes["data-key"],
                                                this.attributes["data-default-value"]
                                            );
                                        }
                                    },
                                    placeholder: "请输入分页大小",
                                },
                                PopsPanel.getSwtichDetail(
                                    "默认多选",
                                    "点选记录时不会清除已选记录",
                                    "forceCtrlKey",
                                    false
                                ),
                                PopsPanel.getSwtichDetail(
                                    "线路联动",
                                    "选择起始线路会同时选择终点线路",
                                    "linkRotName",
                                    false
                                ),
                                PopsPanel.getSwtichDetail(
                                    "显示订单类型",
                                    "订单列表增加订单类型显示",
                                    "showOrderType",
                                    false
                                ),
                                PopsPanel.getSwtichDetail(
                                    "关键字勾选",
                                    "根据关键字批量勾选或取消勾选订单",
                                    "filterKeyWords",
                                    false
                                ),
                                PopsPanel.getSwtichDetail(
                                    "产品排序",
                                    "订单明细按产品编号正序排序",
                                    "sortpdtCode",
                                    false
                                ),
                                PopsPanel.getSwtichDetail(
                                    "自动推送SAP",
                                    "验单导出SAP界面增加根据定时循环自动推送SAP",
                                    "autoSyncSAP",
                                    false
                                ),
                                {
                                    text: "推送间隔（分钟）",
                                    type: "input",
                                    attributes: {
                                        "data-key": "syncInterval",
                                        "data-default-value": 5,
                                    },
                                    getValue() {
                                        return PopsPanel.getValue(
                                            this.attributes["data-key"],
                                            this.attributes["data-default-value"]
                                        );
                                    },
                                    callback(event, value) {
                                        PopsPanel.setValue(this.attributes["data-key"], value);
                                    },
                                    placeholder: "请输入推送时间间隔",
                                },
                                {
                                    text: "自动填写取消原因",
                                    type: "select",
                                    attributes: {
                                        "data-key": "cancelreason-selector",
                                        "data-default-value": 0,
                                    },
                                    getValue() {
                                        return PopsPanel.getValue(
                                            this.attributes["data-key"],
                                            this.attributes["data-default-value"]
                                        );
                                    },
                                    callback(event, isSelectedValue, isSelectedText) {
                                        PopsPanel.setValue(this.attributes["data-key"], isSelectedValue);
                                    },
                                    data: (function () {
                                        let result = [
                                            {
                                                value: 0,
                                                text: "无",
                                            },
                                        ];
                                        craData.forEach((item) => {
                                            result.push({
                                                value: item.value,
                                                text: item.text,
                                            });
                                        });
                                        return result;
                                    })(),
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "om-panel-config-filiter",
                    title: "过滤",
                    forms: [
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                PopsPanel.getSwtichDetail(
                                    "网点过滤",
                                    "过滤掉查询结果中指定网点的数据。",
                                    "filiterShipTo",
                                    false
                                ),
                            ],
                        },
                        {
                            text: "网点过滤清单",
                            type: "forms",
                            forms: [
                                {
                                    type: "own",
                                    getLiElementCallBack(liElement) {
                                        let textareaDiv = DOMUtils.createElement(
                                            "div",
                                            {
                                                className: "pops-panel-textarea",
                                                innerHTML: `<textarea placeholder="请输入需要过滤掉的网点名称，每行一个" style="height:150px; font-size: 13px;"></textarea>`,
                                            },
                                            {
                                                style: "width: 100%;",
                                            }
                                        );
                                        let textarea = textareaDiv.querySelector("textarea");
                                        const KEY = "om-discussions-filter-shipto";
                                        textarea.value = PopsPanel.getValue(KEY, "");
                                        DOMUtils.on(
                                            textarea,
                                            ["input", "propertychange"],
                                            void 0,
                                            utils.debounce(function (event) {
                                                PopsPanel.setValue(KEY, textarea.value);
                                            }, 200)
                                        );
                                        liElement.appendChild(textareaDiv);
                                        return liElement;
                                    },
                                },
                            ],
                        },
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                PopsPanel.getSwtichDetail("线路优化", "仅显示列表中的线路选项", "filiterRoute", false),
                            ],
                        },
                        {
                            text: "线路列表（修改后刷新页面生效）",
                            type: "forms",
                            forms: [
                                {
                                    type: "own",
                                    getLiElementCallBack(liElement) {
                                        let textareaDiv = DOMUtils.createElement(
                                            "div",
                                            {
                                                className: "pops-panel-textarea",
                                                innerHTML: `<textarea placeholder="请输入线路名称，每行一个\n留空获取默认线路" style="height:150px; font-size: 13px;"></textarea>`,
                                            },
                                            {
                                                style: "width: 100%;",
                                            }
                                        );
                                        let textarea = textareaDiv.querySelector("textarea");
                                        const KEY = "om-discussions-filter-route";
                                        textarea.value = PopsPanel.getValue(KEY, "");
                                        DOMUtils.on(
                                            textarea,
                                            ["input", "propertychange"],
                                            void 0,
                                            utils.debounce(function (event) {
                                                PopsPanel.setValue(KEY, textarea.value);
                                            }, 200)
                                        );
                                        liElement.appendChild(textareaDiv);
                                        return liElement;
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "om-panel-config-layout",
                    title: "布局",
                    forms: [
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                PopsPanel.getSwtichDetail(
                                    "【调整】关闭提货单按钮",
                                    "移动关闭提货单按钮到查询按钮右侧",
                                    "moveCloseBtn",
                                    false
                                ),
                            ],
                        },
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                PopsPanel.getSwtichDetail(
                                    "【调整】新建订单页面",
                                    "调整新建订单页面布局",
                                    "om-normal-order-shield",
                                    false
                                ),
                            ],
                        },
                        this.getOwnextAreaRule(
                            "自定义CSS，<a href='javascript:;'>点击重置</a>",
                            "om-normal-order-css",
                            NormalOrder.getDefaultShieldCSS(),
                            "om-normal-order-css"
                        ),
                        {
                            text: "",
                            type: "forms",
                            forms: [
                                PopsPanel.getSwtichDetail(
                                    "【调整】不影响库存订单页面",
                                    "调整不影响库存订单页面布局。",
                                    "om-unnormal-order-shield",
                                    false
                                ),
                            ],
                        },
                        this.getOwnextAreaRule(
                            "自定义CSS，<a href='javascript:;'>点击重置</a>",
                            "om-unnormal-order-css",
                            UnNormalOrder.getDefaultShieldCSS(),
                            "om-unnormal-order-css"
                        ),
                    ],
                },
            ];
        },
    };

    /**
     * 菜单
     */
    const OwnMenu = {
        /**
         * @class
         */
        menu: new utils.GM_Menu({
            GM_getValue,
            GM_setValue,
            GM_registerMenuCommand,
            GM_unregisterMenuCommand,
        }),
    };

    /* -----------------↑公共配置↑----------------- */

    /* -----------------↓函数区域↓----------------- */

    /**
     * 移除元素（未出现也可以等待出现）
     * @param {string} selectorText 元素选择器
     */
    const waitForElementToRemove = function (selectorText = "") {
        utils.waitNodeList(selectorText).then((nodeList) => {
            nodeList.forEach((item) => {
                item.remove();
            });
        });
    };

    const deliveryCusReturn = {
        /**
         * 线路选择联动，选中开始线路，同步选中结束线路
         */
        async LinkRotName() {
            utils.waitNode('input[name="startRotName"]').then(() => {
                const startRotNamCmp = document.querySelector('input[name="startRotName"]').nextSibling;
                const endRotNameCmp = document.querySelector('input[name="endRotName"]').nextSibling;
                if (startRotNamCmp && endRotNameCmp && !startRotNamCmp.classList.contains("eventListenerAdded")) {
                    startRotNamCmp.addEventListener("focus", function () {
                        endRotNameCmp.value = this.value;
                        var component = Ext.getCmp(endRotNameCmp.id);
                        if (component && component.assertValue) {
                            component.assertValue();
                        }
                    });
                    startRotNamCmp.classList.add("eventListenerAdded");
                    Qmsg.success(`已修改为线路起止同步!`, { timeout: 1500 });
                    log.success("已修改为线路起止同步。");
                }
            });
        },
        /**
         * 修改页面分页大小
         */
        async changePageSize(pageSize = 20) {
            utils.waitNode('input[id="ext-comp-1005"]').then(() => {
                const pageElement = document.querySelector('input[id="ext-comp-1005"]');
                if (pageElement) {
                    pageElement.value = pageSize;
                    Ext.getCmp("ext-comp-1004").pageSize = pageSize;
                    // Ext.getCmp('ext-comp-1004').doRefresh(0);
                    log.success(`分页大小已修改为${pageSize}`);
                }
            });
        },
        /**
         * 添加根据关键字勾选、取消勾选记录
         */
        async FilterKeywords() {
            utils.waitNode('input[id="ext-comp-1005"]').then(() => {
                const toolbarLeft = document.querySelectorAll(".x-toolbar-left")[2];
                let inputKeywords = DOMUtils.createElement(
                    "input",
                    {
                        type: "text",
                        autocomplete: "on",
                        className: "x-form-text x-form-field",
                        id: "inputKeywords",
                    },
                    {
                        size: "20",
                    }
                );
                let btnSelect = DOMUtils.createElement("button", {
                    type: "button",
                    className: " x-btn-text icon-dialog-accept",
                    id: "btnSelect",
                    textContent: "勾选",
                });
                let btnDeSelect = DOMUtils.createElement("button", {
                    type: "button",
                    className: " x-btn-text icon-dialog-cancel",
                    id: "btnDeSelect",
                    textContent: "取消",
                });
                let tdElement = DOMUtils.createElement(
                    "td",
                    {
                        className: "x-toolbar-left",
                        innerHTML: `
                        <table cellspacing="0">
                            <tbody>
                                <tr class="x-toolbar-left-row">
                                    <td class="x-toolbar-cell"><label>关键字:</label></td>
                                    <td class="x-toolbar-cell">${inputKeywords.outerHTML}</td>
                                    <td class="x-toolbar-cell"><span class="xtb-sep"></span></td>
                                    <td class="x-toolbar-cell">
                                        <table cellspacing="0" class="x-btn x-btn-text-icon" id="tabSelect" style="width: auto;">
                                            <tbody class="x-btn-small x-btn-icon-small-left">
                                                <tr>
                                                    <td class="x-btn-tl"><i>&nbsp;</i></td>
                                                    <td class="x-btn-tc"></td>
                                                    <td class="x-btn-tr"><i>&nbsp;</i></td>
                                                </tr>
                                                <tr>
                                                    <td class="x-btn-ml"><i>&nbsp;</i></td>
                                                    <td class="x-btn-mc"><em class="" unselectable="on">${btnSelect.outerHTML}</em></td>
                                                    <td class="x-btn-mr"><i>&nbsp;</i></td>
                                                </tr>
                                                <tr>
                                                    <td class="x-btn-bl"><i>&nbsp;</i></td>
                                                    <td class="x-btn-bc"></td>
                                                    <td class="x-btn-br"><i>&nbsp;</i></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td class="x-toolbar-cell"><span class="xtb-sep"></span></td>
                                    <td class="x-toolbar-cell">
                                        <table cellspacing="0" class="x-btn x-btn-text-icon" id="tabDeSelect" style="width: auto;">
                                            <tbody class="x-btn-small x-btn-icon-small-left">
                                                <tr>
                                                    <td class="x-btn-tl"><i>&nbsp;</i></td>
                                                    <td class="x-btn-tc"></td>
                                                    <td class="x-btn-tr"><i>&nbsp;</i></td>
                                                </tr>
                                                <tr>
                                                    <td class="x-btn-ml"><i>&nbsp;</i></td>
                                                    <td class="x-btn-mc"><em class="" unselectable="on">${btnDeSelect.outerHTML}</em></td>
                                                    <td class="x-btn-mr"><i>&nbsp;</i></td>
                                                </tr>
                                                <tr>
                                                    <td class="x-btn-bl"><i>&nbsp;</i></td>
                                                    <td class="x-btn-bc"></td>
                                                    <td class="x-btn-br"><i>&nbsp;</i></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`,
                    },
                    {
                        align: "left",
                    }
                );
                /* 添加事件 */
                DOMUtils.on(tdElement.querySelector("#btnSelect"), "click", function () {
                    var extComp = Ext.getCmp("ext-comp-1003");
                    var searchText = tdElement.querySelector("#inputKeywords").value;
                    var gridElement = document.querySelector(".x-grid3-body");
                    var childElements = gridElement.querySelectorAll(":scope > div");
                    let hasMatch = false; // 添加变量进行判断
                    childElements.forEach(function (element) {
                        if (element.textContent.includes(searchText)) {
                            hasMatch = true; // 如果找到匹配记录，将变量设置为 true
                            extComp.getSelectionModel().selectRow(element.rowIndex, true);
                        }
                    });
                    if (!hasMatch) {
                        let tooltip = pops.tooltip({
                            target: tdElement.querySelector("#btnSelect"),
                            content: "❌ 未找到匹配记录",
                            position: "top",
                            alwaysShow: true,
                        });
                        setTimeout(() => {
                            tooltip.close();
                        }, 1000);
                    }
                });
                DOMUtils.on(tdElement.querySelector("#btnDeSelect"), "click", function () {
                    var extComp = Ext.getCmp("ext-comp-1003");
                    var searchText = tdElement.querySelector("#inputKeywords").value;
                    var gridElement = document.querySelector(".x-grid3-body");
                    var childElements = gridElement.querySelectorAll(":scope > div");
                    let hasMatch = false; // 添加变量进行判断
                    childElements.forEach(function (element) {
                        if (element.textContent.includes(searchText)) {
                            hasMatch = true; // 如果找到匹配记录，将变量设置为 true
                            // console.log(element.rowIndex)
                            // element.classList.add('x-grid3-row-selected');
                            extComp.getSelectionModel().deselectRow(element.rowIndex);
                        }
                    });
                    if (!hasMatch) {
                        let tooltip = pops.tooltip({
                            target: tdElement.querySelector("#btnDeSelect"),
                            content: "❌ 未找到匹配记录",
                            position: "top",
                            alwaysShow: true,
                        });
                        setTimeout(() => {
                            tooltip.close();
                        }, 1000);
                    }
                });
                DOMUtils.on(tdElement.querySelector("#btnSelect"), "mouseenter mouseleave", function (e) {
                    let el = document.querySelector("#tabSelect");
                    if (e.type === "mouseleave") {
                        el.classList.remove("x-btn-over");
                    } else {
                        el.classList.add("x-btn-over");
                    }
                });
                DOMUtils.on(tdElement.querySelector("#btnDeSelect"), "mouseenter mouseleave", function (e) {
                    let el = document.querySelector("#tabDeSelect");
                    if (e.type === "mouseleave") {
                        el.classList.remove("x-btn-over");
                    } else {
                        el.classList.add("x-btn-over");
                    }
                });

                DOMUtils.before(toolbarLeft, tdElement);
                // Qmsg.success(`已添加关键字过滤!`, { timeout: 1500 });
                log.success("已添加关键字勾选、取消。");
            });
        },

        /**
         * 物流线路优化，仅显示白名单内线路
         */
        FiliterRoute() {
            // var myStore = Ext.getCmp("ext-comp-1039").store;
            // var vrRotNameList = ["C1-宜兴二线", "A-CZ宜兴电子线（经销商）"];
            // myStore.each(function (record) {
            //     if (!vrRotNameList.includes(record.get("vrRotName"))) {
            //         myStore.remove(record);
            //     }
            // });
            /**
             * 初始化线路白名单
             * @param {Object} parsedData - 解析后的数据对象，预期包含一个data数组属性
             * @returns {Array} routeList - 线路名称数组
             */
            function initializeRouteList(parsedData) {
                if (!parsedData || !Array.isArray(parsedData.data)) {
                    return [];
                }

                let routeList = PopsPanel.getValue("om-discussions-filter-route");
                if (!routeList) {
                    routeList = parsedData.data.map((item) => item.vrRotName);
                    PopsPanel.setValue("om-discussions-filter-route", routeList.join("\n"));
                } else {
                    routeList = routeList.split("\n");
                }
                return routeList;
            }
            /**
             * 劫持请求
             */
            const ajaxHooker = utils.ajaxHooker();
            ajaxHooker.hook(function (request) {
                // log.info({ ajaxHookr: request.url });
                if (request.url.startsWith("/brightdairy2/baseData/getRouteByDom")) {
                    /**
                     * 重构响应
                     * @param {XMLHttpRequest} _request_
                     */
                    request.response = function (_request_) {
                        try {
                            let data = utils.toJSON(_request_.responseText);
                            if (typeof data !== "object" || !Array.isArray(data.data)) return; // 验证data的格式

                            // 定义白名单 使用Set提高查找效率
                            const whiteList = new Set(initializeRouteList(data));
                            // 过滤数据
                            const result = data.data.filter((item) => whiteList.has(item.vrRotName));

                            // 根据白名单顺序重新排列数据
                            const resultInOrder = Array.from(whiteList).reduce((acc, whiteItem) => {
                                const resultItem = result.find((item) => item.vrRotName === whiteItem);
                                if (resultItem) {
                                    acc.push(resultItem);
                                }
                                return acc;
                            }, []);

                            data.data = resultInOrder;
                            data.rows = resultInOrder;
                            log.success("已优化线路列表!");
                            Qmsg.success(`已优化线路列表!`, { timeout: 1500 });
                            _request_.responseText = JSON.stringify(data);
                            utils.waitNode('input[name="startRotName"]').then((el) => {
                                el.setAttribute("class", "isModified");
                            });
                        } catch (error) {
                            log.error("处理线路列表时出现错误:", error);
                            Qmsg.error(`线路列表优化失败，请稍后再试!`, {
                                timeout: 1500,
                            });
                        }
                    };
                }
            });
        },

        /**
         * 送货点过滤，根据黑名单过滤掉不需要显示的站点
         */
        async FiliterShipToName() {
            // 初始化名单
            async function initializeRouteList() {
                let shiptoNameList = PopsPanel.getValue("om-discussions-filter-shipto").split("\n");
                return shiptoNameList;
            }

            /**
             * XSS防护 - 转义HTML特殊字符
             * @param {string} html
             * @returns {string}
             */
            function escapeHTML(html) {
                return html
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            /**
             * 劫持请求
             */
            const ajaxHooker = utils.ajaxHooker();
            ajaxHooker.hook(function (request) {
                // log.info({ ajaxHookr: request.url });
                if (request.url.startsWith("/brightdairy2/deliveryNote/getByCusRouteTerr")) {
                    /**
                     * 重构响应
                     * @param {XMLHttpRequest} _request_
                     */
                    request.response = function (_request_) {
                        try {
                            let data = utils.toJSON(_request_.responseText);
                            // 使用异步获取的黑名单
                            initializeRouteList()
                                .then((blackList) => {
                                    const result = data.data.filter((item) => {
                                        // 部分匹配：item.vrSptName.includes(name)
                                        if (!blackList.some((name) => name === item.vrSptName)) {
                                            return item;
                                        }
                                    });

                                    if (result.length < data.data.length) {
                                        const filteredNames = data.data
                                            .filter((item) => blackList.some((name) => name === item.vrSptName))
                                            .map((item) => item.vrSptName);

                                        const uniqueFilteredNames = Array.from(new Set(filteredNames));
                                        // 防止XSS，清理名称
                                        const formattedNames = uniqueFilteredNames
                                            .map((name) => `<div>${escapeHTML(name)}</div>`)
                                            .join("");
                                        Qmsg.info(
                                            `已过滤站点：<div style='text-align: left;'>${formattedNames}</div>`,
                                            { timeout: 2000 }
                                        );
                                        data.data = result;
                                        data.rows = result;
                                        _request_.responseText = JSON.stringify(data);
                                    }
                                })
                                .catch((error) => {
                                    log.error("初始化列表失败:", error);
                                });
                        } catch (error) {
                            log.error("处理请求失败:", error);
                        }
                    };
                }
            });
        },

        /**
         * 调整关闭送货单按钮位置
         */
        async btnCloseLayout() {
            const btnClose = document.querySelector("#ext-comp-1068").parentNode;
            const btnSearch = document.querySelector("#ext-comp-1063").parentNode;
            if (!document.querySelector("#sep")) {
                DOMUtils.after(btnSearch, `<td class="x-toolbar-cell" id="sep"><span class="xtb-sep"></span></td>`);
            }
            DOMUtils.after(btnSearch.nextSibling, btnClose);
            utils.mutationObserver(btnClose, {
                callback: (mutationsList) => {
                    if (mutationsList.length == 0) {
                        return;
                    }
                    if (mutationsList[0].type === "childList") {
                        // 如果按钮不在预期位置，则执行修改位置的代码
                        if (document.querySelector("#ext-comp-1068").closest(".x-toolbar-right-row")) {
                            // 执行修改位置的代码
                            deliveryCusReturn.btnCloseLayout();
                        }
                    }
                },
                config: {
                    /* 子节点的变动（新增、删除或者更改） */
                    childList: true,
                    /* 是否将观察器应用于该节点的所有后代节点 */
                    subtree: true,
                },
            });
        },

        /**
         * 添加单击、双击监听
         */
        addEventListener() {
            /**
             * 按产品编号列进行排序
             * @param {string} idDln - 单据编号
             */
            function sortColumn(idDln) {
                utils.waitNode(`div[id="${idDln}"]  div.x-panel.x-grid-panel.x-border-panel`).then((e) => {
                    // Ext.getCmp(parentElement.id).store.sort('vrPdtCode');
                    Ext.getCmp(e.id).store.singleSort("vrPdtCode", "ASC");
                    e.querySelectorAll("tr.x-grid3-hd-row")[1].setAttribute("hidden", "");
                });
            }
            /**
             * 监听输入框实现自动选择取消原因
             * @param {string} idDln - 单据编号
             */
            function autoSelectCra(idDln) {
                utils.waitNode(`div[id="${idDln}"] div.x-grid3-viewport`).then((e) => {
                    const panelCmp = Ext.getCmp(idDln);
                    // const extCmp = Ext.getCmp(panelCmp.body.query('input.x-form-text.x-form-field.x-form-num-field')[0].id);
                    const extCmp = panelCmp.findByType("editorgrid")[0]; // 单据编辑器组件
                    extCmp.on({
                        dblclick: function (e) {
                            // console.log(e.target.parentNode.cellIndex); // 单元格序列元素
                            utils
                                .waitNode(
                                    `div[id="${idDln}"] div[class$="x-layer x-editor x-small-editor x-grid-editor"]`
                                )
                                .then((e) => {
                                    const editorCmp = Ext.getCmp(e.id); // 修改数字输入框组件
                                    editorCmp.on({
                                        complete: function (e) {
                                            // log.info(panelCmp.deliveryLineGrid.store.getModifiedRecords());
                                            // var lastActiveRow = extCmp.selModel.grid.lastActiveEditor.row;
                                            var lastEditRow = extCmp.lastEdit.row;
                                            var lastEditCol = extCmp.lastEdit.col;
                                            var cancelReasonId = PopsPanel.getValue("cancelreason-selector");
                                            var editItem = extCmp.store.data.items[lastEditRow];
                                            if (cancelReasonId == 0 || (lastEditCol != 7 && lastEditCol != 9)) {
                                                return;
                                            }
                                            var cancelReasonName = craData.find(
                                                (item) => item.value === cancelReasonId
                                            ).text;
                                            // extCmp.store.getAt(3).getChanges()
                                            // console.log("modified:",extCmp.store.getAt(lastEditRow).modified);
                                            // console.log("getChanges:",extCmp.store.getAt(lastEditRow).getChanges());

                                            var elements = extCmp
                                                .getEl()
                                                .dom.querySelectorAll("div.x-grid3-row")
                                                [lastEditRow].querySelectorAll("div.x-grid3-cell-inner");
                                            var extStoreData = editItem.data;

                                            var box = extStoreData.box; // 箱数
                                            var remain = extStoreData.remain; // 盒数
                                            var fPdmBoxtosales = extStoreData.fPdmBoxtosales; // 箱转盒
                                            var iDnlRealshipQty = extStoreData.iDnlRealshipQty; // 实际发货数量
                                            var fDnlRealprice = extStoreData.fDnlRealprice; // 实际发货单价

                                            var RealacceptQty = parseFloat(fPdmBoxtosales * box + remain); //验单数
                                            // var newMoney = parseFloat(elements[11].innerText).toFixed(2);
                                            // var oldMoney = parseFloat(iDnlRealshipQty * fDnlRealprice).toFixed(2);

                                            var craCmp = panelCmp.deliveryLineGrid.store.data.items[lastEditRow].data;
                                            if (RealacceptQty == iDnlRealshipQty) {
                                                elements[15].innerText = " ";
                                                craCmp.iDnlCancelreasonId = 0;
                                                craCmp.vrCraName = "";
                                            } else if (craCmp.iDnlCancelreasonId == 0) {
                                                elements[15].innerText = cancelReasonName;
                                                craCmp.iDnlCancelreasonId = cancelReasonId;
                                            }
                                        },
                                    });
                                    e.classList.add("catched");
                                });
                        },
                    });
                });
            }

            let gridCmp = API.findCmp({ xtype: "grid", refName: "deliveryCusReturnGrid" })[0];
            //Ext.getCmp("ext-comp-1003")
            gridCmp.on({
                mousedown: function (e) {
                    // 默认Ctrl按键逻辑取反
                    if (PopsPanel.getValue("forceCtrlKey")) {
                        e.ctrlKey = !e.ctrlKey;
                    }
                },
                click: function (e) {
                    // console.log(event, e);
                    var me = this;
                    var t = e.getTarget();
                    var control = t.className;
                    if (control == "showDelivery") {
                        let idDln = t.innerText;
                        if (PopsPanel.getValue("sortpdtCode")) {
                            sortColumn(idDln);
                        }
                        if (PopsPanel.getValue("cancelreason-selector") != 0) {
                            autoSelectCra(idDln);
                        }
                    }
                },
                dblclick: function (e) {
                    // console.log(event,e);
                    var me = this;
                    var t = e.getTarget();
                    var control = t.className;
                    // 获取点击的行号
                    var rowIndex = me.view.findRowIndex(t);
                    if (control.includes("x-grid3-cell-inner x-grid3-col")) {
                        // let idDln = e.target.offsetParent.offsetParent.querySelector(
                        //     ".x-grid3-col.x-grid3-cell.x-grid3-td-3.x-selectable"
                        // ).innerText;
                        // let idDln = me.getView().grid.getStore().data.itemAt(rowIndex).get('idDln')
                        let itemSelected = me.store.data.itemAt(rowIndex);
                        let idDln = itemSelected.get("idDln");
                        let selModel = me.getSelectionModel();
                        // selModel.deselectRow(rowIndex);
                        selModel.selectRow(rowIndex, true);
                        let arrSelections = selModel.selections;
                        if (arrSelections.length > 0) {
                            let lastItem = arrSelections.items.pop();
                            let lastKey = arrSelections.keys.pop();
                            arrSelections.items.unshift(lastItem);
                            arrSelections.keys.unshift(lastKey);
                        } else {
                            e.ctrlKey = false;
                        }
                        if (PopsPanel.getValue("sortpdtCode")) {
                            sortColumn(idDln);
                        }
                        if (PopsPanel.getValue("cancelreason-selector") != 0) {
                            autoSelectCra(idDln);
                        }
                    }
                },
            });

            /**
             * 动态向表格中添加一列，如果该列不存在的话。
             * 这个功能依赖于一个名为gridCmp的组件和一个名为showOrderType的配置项。
             * 如果gridCmp存在且showOrderType的值为真，则会尝试向表格添加一个显示“订单类型”的列。
             */
            if (gridCmp && PopsPanel.getValue("showOrderType")) {
                // 定义要添加的新列的配置
                var newColumnConfig = {
                    header: "订单类型",
                    dataIndex: "iDlnProperty",
                    sortable: true,
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        return orderTypes[value];
                    },
                };

                // 获取当前表格的列模型
                var existingColumnModel = gridCmp.getColumnModel();
                if (existingColumnModel) {
                    // 检查当前列模型中是否已存在相同数据索引的列
                    var columnIndex = existingColumnModel.findColumnIndex(newColumnConfig.dataIndex);
                    if (columnIndex === -1) {
                        // 如果不存在，则将新列配置合并到现有的列配置中
                        // 优化：避免不必要的数组拷贝，直接操作现有配置（视具体情形而定）
                        // 注意：这取决于existingColumnModel.config的可操作性
                        // var newConfig = Ext.apply([], existingColumnModel.config);
                        var newConfig = existingColumnModel.config.slice(); // 创建一个浅拷贝来避免直接修改原有配置
                        newConfig.push(newColumnConfig);
                        // 更新列模型的配置
                        existingColumnModel.setConfig(newConfig);

                        // 将新列移动到指定位置（第11列，索引从0开始）
                        // 使用常量代替魔法数字以提高代码的可读性
                        var TARGET_COLUMN_INDEX = 10;
                        existingColumnModel.moveColumn(newConfig.length - 1, TARGET_COLUMN_INDEX);

                        // 刷新表格视图以显示新的列和顺序
                        gridCmp.getView().refresh();
                    }
                }
            }

            /**
             * 监听日期框滚轮事件，实现日期滚动
             * 双击日期框选择今天
             */
            let dataCmp = API.findCmp({ xtype: "datefield", refName: "orderDate" })[0];
            DOMUtils.on(dataCmp.el.dom, "dblclick wheel", function (e) {
                if (e.type == "dblclick") {
                    dataCmp.setValue(new Date().clearTime());
                }
                if (e.type == "wheel") {
                    e.preventDefault();
                    // console.log(e); // 现有的日志输出
                    if (dataCmp.getValue() == "") {
                        return;
                    }
                    // 防抖逻辑
                    if (!dataCmp.hasOwnProperty("wheeling") || !dataCmp.wheeling) {
                        dataCmp.wheeling = true;

                        setTimeout(function () {
                            dataCmp.wheeling = false;
                        }, 100);

                        // 计算滚轮方向
                        var delta = e.deltaY || e.wheelDelta || e.detail;

                        if (delta > 0) {
                            // 滚轮向下滚动
                            dataCmp.setValue(dataCmp.getValue().add("d", -1)); // 减少日期数，可以根据需求调整操作
                        } else if (delta < 0) {
                            // 滚轮向上滚动
                            dataCmp.setValue(dataCmp.getValue().add("d", 1)); // 增加日期数，可以根据需求调整操作
                        }
                    }
                }
            });

            /**
             * 发运号、订单号双击自动清空日期栏
             */
            let idDlnCmp = API.findCmp({ xtype: "textfield", refName: "idDln" })[0];
            DOMUtils.on(idDlnCmp.el.dom, "dblclick", function (e) {
                e.preventDefault();
                // console.log(e); // 现有的日志输出
                dataCmp.setValue("");
            });
            let orderIdCmp = API.findCmp({ xtype: "textfield", refName: "orderId" })[0];
            DOMUtils.on(orderIdCmp.el.dom, "dblclick", function (e) {
                e.preventDefault();
                // console.log(e); // 现有的日志输出
                dataCmp.setValue("");
            });

            /**
             * 为搜索按钮添加滚轮调整日期
             */
            let searchBtnCmp = API.findCmp({ xtype: "button", refName: "btnQuery" })[0];
            DOMUtils.on(searchBtnCmp.el.dom, "wheel", function (e) {
                if (e.type == "wheel") {
                    e.preventDefault();
                    // console.log(e); // 现有的日志输出
                    if (dataCmp.getValue() == "") {
                        return;
                    }
                    // 防抖逻辑
                    if (!dataCmp.hasOwnProperty("wheeling") || !dataCmp.wheeling) {
                        dataCmp.wheeling = true;

                        setTimeout(function () {
                            dataCmp.wheeling = false;
                        }, 100);

                        // 计算滚轮方向
                        var delta = e.deltaY || e.wheelDelta || e.detail;

                        if (delta > 0) {
                            // 滚轮向下滚动
                            dataCmp.setValue(dataCmp.getValue().add("d", -1)); // 减少日期数，可以根据需求调整操作
                        } else if (delta < 0) {
                            // 滚轮向上滚动
                            dataCmp.setValue(dataCmp.getValue().add("d", 1)); // 增加日期数，可以根据需求调整操作
                        }
                    }
                }
            });
        },

        /**
         * 双击全选/取消全选订单
         */
        doubleClickSelectAll() {
            let element = document.querySelector(".x-panel-tbar.x-panel-tbar-noheader.x-panel-tbar-noborder").lastChild
                .lastChild;
            let titleEM = element.querySelector("table > tbody > tr > td.x-toolbar-left");
            titleEM.setAttribute("title", "双击全选/取消全选订单");
            element.addEventListener("dblclick", function (e) {
                // console.log(e.target);
                if (e.target.className == "x-toolbar-left") {
                    let cmp = API.findCmp({ xtype: "grid", refName: "deliveryCusReturnGrid" })[0].selModel;
                    var a = document.querySelector("td.x-grid3-hd.x-grid3-cell.x-grid3-td-checker > div > div");
                    var b = Ext.fly(a.parentNode);
                    var d = b.hasClass("x-grid3-hd-checker-on");
                    if (d) {
                        b.removeClass("x-grid3-hd-checker-on");
                        cmp.clearSelections();
                    } else {
                        b.addClass("x-grid3-hd-checker-on");
                        cmp.selectAll();
                    }
                }
            });
        },
    };

    const SyncSAP = {
        /**
         * 自动推送
         */
        async autoSyncSAP() {
            utils.waitNode('[onclick^="addSyncCheckSAP"]').then(() => {
                let tdElement = DOMUtils.createElement(
                    "table",
                    {
                        innerHTML: `
                        <tbody>
                            <tr>
                                <td class="detail_header" style="width: 10%;"></td>
                                <td class="detail_header" style="width: 10%;">推送次数</td>
                                <td class="detail_header">推送信息</td>
                            </tr>
                            <tr>
                                <td class="detail_content"><input type="button" class="botton" id="autosync" value="自动导出"></td>
                                <td class="detail_content" id="timesnow"></td>
                                <td class="detail_content" id="synclog"></td>
                            </tr>
                        </tbody>`,
                    },
                    {
                        style: "width: 100%;",
                    }
                );
                const btnSync = document.querySelector('[onclick^="addSyncCheckSAP"]');
                const outerDiv = btnSync.closest("div");

                DOMUtils.append(outerDiv, tdElement);

                /**
                 * OM验单数据推送SAP
                 */
                async function PostData(startDate, endDate) {
                    let postResp = await httpx.post(document.location.origin + "/brightdairy2/check/addSyncCheckSAP", {
                        fetch: true,
                        data: JSON.stringify({
                            dtStart: startDate,
                            dtEnd: endDate,
                            orderType: "-1",
                        }),
                    });
                    // log.success(postResp);
                    if (!postResp.status) {
                        Qmsg.error("推送失败！");
                        return;
                    }
                    return postResp.data.responseText;
                }
                const autosync = tdElement.querySelector("#autosync");
                DOMUtils.on(autosync, "click", function () {
                    autosync.disabled = true;
                    let syncInterval = PopsPanel.getValue("syncInterval");
                    if (!syncInterval) {
                        syncInterval = 1;
                        PopsPanel.setValue("syncinterval", syncInterval);
                    }
                    let timer; // 明确声明 timer 变量
                    // 检查计数器的值，若为空则设置为超过最大搜索次数
                    try {
                        const timesNow = tdElement.querySelector("#timesnow");
                        const syncLog = tdElement.querySelector("#synclog");
                        timesNow.innerText = 1;
                        syncLog.innerText = `开始推送，间隔${syncInterval}分钟，连续10次无记录推送会停止执行。`;
                        var number = 1;
                        clearInterval(timer); // 防御性编程，确保清除之前的定时器
                        timer = setInterval(function () {
                            if (number < 10) {
                                var startDate = document.querySelector("#d4311").value;
                                var endDate = document.querySelector("#d4312").value;
                                PostData(startDate, endDate)
                                    .then((result) => {
                                        if (result == 0) {
                                            timesNow.innerText = number;
                                            number += 1;
                                        } else {
                                            number = 1;
                                            timesNow.innerText = number;
                                        }
                                        syncLog.innerText = `[${utils.formatTime(
                                            new Date(),
                                            "yyyy-MM-dd HH:mm:ss"
                                        )}] 日期： ${startDate} 到 ${endDate} 导出记录：${result} 条`;
                                    })
                                    .catch((error) => {
                                        number = 99;
                                        autosync.disabled = true;
                                        // 处理请求过程中可能发生的任何错误
                                        log.error("错误:", error);
                                    });
                            } else {
                                clearInterval(timer);
                                timesNow.innerText = number;
                                syncLog.innerText = `连续${number}次无记录推送，停止执行。`;
                            }
                        }, Math.floor(1000 * 60 * syncInterval) + Math.random() * 10 * 1000);
                    } catch (error) {
                        log.error("An error occurred:", error);
                    }
                });
            });
        },
    };

    const UnNormalOrder = {
        getDefaultShieldCSS() {
            return `/* 不清楚作用时不要随意改动 */
/* 输入框行间距 */
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 1px !important;
}
/* 输入框左间距 */
.el-input__inner {
    padding: 0 10px !important;
}
/* 输入框标签高度 */
.el-form-item--mini .el-form-item__label {
    line-height: 20px !important;
}
/* 输入框高度 */
.el-input--mini .el-input__inner {
    height: 20px !important;
    line-height: 20px !important;
}
div.el-col.el-col-14 > div:nth-child(5) {
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
}
div.el-col.el-col-14 > div:nth-child(6) {
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
}`;
        },
        modifyStyle() {
            let shieldCSS = PopsPanel.getValue("om-unnormal-order-css", this.getDefaultShieldCSS());
            GM_addStyle(shieldCSS);
        },
        hiddenElements() {
            // let emShipTo = document
            //     .querySelector("input[data-id='idBit']")
            //     .closest("div.el-form-item.el-form-item--mini");
            // emShipTo.setAttribute("hidden", "");
            // let emRot = document.querySelector("input[data-id='idRot']").closest("div.el-form-item.el-form-item--mini");
            // emRot.setAttribute("hidden", "");

            waitForElementToRemove("div.el-col.el-col-14 > div:nth-child(6)");
            waitForElementToRemove("div.el-col.el-col-14 > div:nth-child(5)");
        },
    };

    const NormalOrder = {
        getDefaultShieldCSS() {
            return `/* 不清楚作用时不要随意改动 */
/* 输入框行间距 */
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 1px !important;
}
/* 输入框左间距 */
.el-input__inner {
    padding: 0 10px !important;
}
/* 输入框标签高度 */
.el-form-item--mini .el-form-item__label {
    line-height: 20px !important;
}
/* 输入框高度 */
.el-input--mini .el-input__inner {
    height: 20px !important;
    line-height: 20px !important;
}
/* 顶部按钮 */
.el-card__header {
    padding: 1px 2px !important;
}
.el-card__body {
    position: absolute !important;
    inset: 22px 0px 0px !important;
}
.el-radio-button--medium .el-radio-button__inner {
    padding: 3px 20px !important;
    font-size: 14px !important;
    border-radius: 0 !important;
}
/* 新建订单左上角齿轮图标 */
.clearfix > span {
    display: none !important;
}`;
        },
        modifyStyle() {
            let shieldCSS = PopsPanel.getValue("om-normal-order-css", this.getDefaultShieldCSS());
            GM_addStyle(shieldCSS);
        },
        hiddenElements() {
            waitForElementToRemove(
                "#app > div.el-card.box-card.z-card.is-always-shadow > div.el-card__header > div > span"
            );
        },
    };

    /* -----------------↑函数区域↑----------------- */

    /* -----------------↓执行入口↓----------------- */
    let craData = [];
    async function setCraData() {
        craData = await API.getCancelReason();
    }
    setCraData();

    let orderTypes = [];
    async function setOrderTypes() {
        orderTypes = await API.getOrderType();
    }
    setOrderTypes();

    if (PopsPanel.getValue("filiterRoute")) {
        deliveryCusReturn.FiliterRoute();
    }

    OwnCSS.init();
    PopsPanel.init();
    let pageSize = PopsPanel.getValue("pageSize");
    if (!pageSize) {
        pageSize = 20;
        PopsPanel.setValue("pageSize", pageSize);
    }
    // 客户回单
    if (window.location.pathname.startsWith("/modules/sap_deliveryCusReturn")) {
        utils.waitNode("#mainTabPanel").then(() => {
            DOMUtils.ready(function () {
                utils.waitNode('input[name="startRotName"]').then((el) => {
                    setTimeout(function () {
                        if (el.className !== "isModified") {
                            let comboCmp = API.findCmp({ xtype: "combo", refName: "startRotName" })[0];
                            comboCmp.store.load({ params: "start" });
                        }
                    }, 1500);
                });
                if (PopsPanel.getValue("linkRotName")) {
                    deliveryCusReturn.LinkRotName();
                }
                if (PopsPanel.getValue("filterKeyWords")) {
                    deliveryCusReturn.FilterKeywords();
                }
                if (pageSize !== 20) {
                    deliveryCusReturn.changePageSize(pageSize);
                }
                if (PopsPanel.getValue("filiterShipTo")) {
                    deliveryCusReturn.FiliterShipToName();
                }
                if (PopsPanel.getValue("moveCloseBtn")) {
                    //  setTimeout(function () {
                    deliveryCusReturn.btnCloseLayout();
                    //  }, 500);
                }
                deliveryCusReturn.addEventListener();
                deliveryCusReturn.doubleClickSelectAll();
            });
        });
    }
    // 验单导出SAP
    if (window.location.pathname.startsWith("/modules/sap_check")) {
        DOMUtils.ready(function () {
            if (PopsPanel.getValue("autoSyncSAP")) {
                SyncSAP.autoSyncSAP();
            }
        });
    }
    const PATH_PREFIXES = ["/modules/repr_addUnNormalOrder", "/modules/repr_addReturnOrderAction"];

    // 不影响库存订单、退货订单
    if (PATH_PREFIXES.some((prefix) => window.location.pathname.startsWith(prefix))) {
        if (PopsPanel.getValue("om-unnormal-order-shield")) {
            UnNormalOrder.modifyStyle();
            //UnNormalOrder.hiddenElements();
        }
    }
    // 销售订单
    if (window.location.pathname.startsWith("/modules/repr_addOrderAction")) {
        if (PopsPanel.getValue("om-normal-order-shield")) {
            NormalOrder.modifyStyle();
        }
    }
    /* -----------------↑执行入口↑----------------- */
})();
