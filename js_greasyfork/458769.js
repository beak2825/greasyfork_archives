// ==UserScript==
// @name               Yinr-libs
// @namespace          https://yinr.cc/
// @version            0.0.9
// @description        Useful functions for yinr (currently in beta, api may be changed)
// @author             Yinr
// @license            GPL-v3
// ==/UserScript==

/**
 * Useful functions for yinr
 * ### 脚本常用功能库
 * 1. `YinrLibs.launchObserver`: 创建 DOM 监听
 * 2. `YinrLibs.sleep`: 等待延时
 * 3. `YinrLibs.generateTextFile`: 生成文本文件下载链接
 * 4. `YinrLibs.Config`: 对设置保存读取的封装类
 * ### 使用
 * ```
 * // @require https://greasyfork.org/scripts/458769-yinr-libs/code/Yinr-libs.js
 * ```
 * @module YinrLibs
 */
const YinrLibs = (function() {
    'use strict'

    return {
        /** 创建 DOM 监听
         * @param {Object} option
         * @param {(Element | string)} option.parentNode MutationObserver 绑定的 DOM 对象
         * @param {string} option.selector 需要监听变化的 selector
         * @param {voidCallback} [option.failCallback=callback] selector 不存在时执行的回调函数
         * @param {MutationCallback} [option.successCallback=null] selector 对象发生 Mutation 事件时执行的回调函数
         * @param {boolean} [option.stopWhenSuccess=true] 执行一次 `successCallback` 后立即解除监听
         * @param {MutationObserverInit} [option.config={childList: true, subtree: true}] MutationObserver 配置参数
         */
        launchObserver({
            parentNode,
            selector,
            failCallback = null,
            successCallback = null,
            stopWhenSuccess = true,
            config = { childList: true, subtree: true }
        }) {
            if (!parentNode) return
            /** @type {MutationCallback} */
            const observeFunc = mutationList => {
                if (!document.querySelector(selector)) {
                    if (failCallback) failCallback()
                    return
                }
                if (stopWhenSuccess) observer.disconnect()

                mutationList.itemFilter = (fn, type = 'addedNodes') => mutationList.map(i => Array.from(i[type]).filter(fn)).reduce((arr, val) => arr.concat(val), [])

                if (successCallback) successCallback(mutationList)
            }
            const observer = new MutationObserver(observeFunc)
            observer.observe(parentNode, config)
        },

        /** 等待延时函数，默认固定延时 1s
         * @param {number} [timeoutMin=1000] 最少随机等待时间（ms）
         * @param {number} [timeoutMax=timeMin] 最多随机等待时间（ms）
         * @returns {Promise<true>}
         * @example
         * await sleep() // 默认等待 1s
         * await sleep(1000, 3000) // 随机等待 1-3s
         * sleep().then(() => { callbackFn() }) // 等待 1s 后执行 callbackFn()
         */
        sleep(timeoutMin = 1000, timeoutMax = timeoutMin) {
            return new Promise((resolve) => {
                const timeout = timeoutMin === timeoutMax ? timeoutMin : Math.floor(Math.random() * (timeoutMax - timeoutMin) + timeoutMin)
                setTimeout(() => { resolve(true) }, timeout);
            })
        },

        /** 创建文本文件，返回可下载文件链接
         * @param {string} text 文本文件内容文本
         * @param {string} [type='text/plain'] 文件 MIME 类型
         * @returns {string}
         * @example
         * // 生成 json 文件下载链接，并使用 GM_download 函数下载
         * let url = generateTextFile('{ "data": 1 }', 'application/json')
         * GM_download(url, 'data.json')
         */
        generateTextFile(text, type = 'text/plain') {
            const data = new Blob([text], { type })
            return URL.createObjectURL(data)
        },

        /** Wrapper for GM_getValue & GM_setValue
         *
         * Should add grant `GM_getValue` and `GM_setValue` in script.
         * Otherwise the storage backend will fall back to localStorage.
         * ```
         * // @grant GM_setValue
         * // @grant GM_getValue
         * // @grant GM_deleteValue
         * // @grant GM_listValues
         * ```
         * Note: `GM_deleteValue` and `GM_listValues` is optional.
         * @example
         * const cfg = new Config({ data: 'init value' })
         */
        Config: class {
            /**
             * @typedef {Object.<string, ConfigInitItem>} ConfigInit
             */
            /**
             * @typedef ConfigInitItem
             * @type {object}
             * @property {string} key 设置保存的键名
             * @property {*} default 设置的默认值
             */
            /**
             * @param {ConfigInit} [init={}] 设置初始化选项
             * @param {string} [backendType='auto'] 设置存储后端，可选项：`GM`|`localStorage`|`auto`（默认）
             */
            constructor(init = {}, backendType = 'auto') {
                /**
                 * @typedef BackendType
                 * @type {object}
                 * @property {function} getValue (key: string, defalutValue: string | null = null) => string
                 * @property {function} setValue (key: string, value: string) => void
                 * @property {function} deleteValue (key: string) => void
                 * @property {function} listValues () => string[]
                 */
                /** localStorage backend
                 * @param {Storage} [storage=localStorage] 使用的后端存储，例如：localStorage
                 */
                const generateStorage = (storage=localStorage) => ({
                    getValue(key, defaultValue) {
                        if (key in storage) {
                            return JSON.parse(storage.getItem(key))
                        } else {
                            return defaultValue
                        }
                    },
                    setValue(key, value) {
                        return storage.setItem(key, JSON.stringify(value))
                    },
                    deleteValue(key) {
                        return storage.removeItem(key)
                    },
                    listValues() {
                        return Object.keys(storage)
                    },
                })
                /**
                 * @type {BackendType} config storage backend
                 */
                this.backend = generateStorage()
                if (
                    backendType.toLowerCase() === 'localstorage' ||
                    !(GM.info.script.grant.includes('GM_setValue') &&
                        GM.info.script.grant.includes('GM_getValue'))
                ) {
                    // console.log('Use localStorage')
                } else {
                    /** GM backend */
                    const backendGM = {
                        getValue: GM_getValue,
                        setValue: GM_setValue,
                        deleteValue: GM.info.script.grant.includes('GM_deleteValue')
                            ? GM_deleteValue
                            : () => { console.debug('deleteValue is not available. You may need `// @grant GM_deleteValue` in script.') },
                        listValues: GM.info.script.grant.includes('GM_listValues')
                            ? GM_listValues
                            : () => { console.debug('listValues is not available. You may need `// @grant GM_listValues` in script.') },
                    }
                    this.backend = backendGM
                }
                // initialize default config
                for (const [configItemKey, configItem] of Object.entries(init)) {
                    if (!Object.keys(configItem).includes('key')) {
                        console.warn(`Skip invaild config init item of '${configItemKey}'\n`, configItem)
                        continue
                    }
                    const key = configItem.key
                    const value = Object.keys(configItem).includes('default') ? configItem.default : null
                    if (this.getValue(key) === null && value !== null) {
                        this.setValue(key, value)
                    }
                }
            }
            /**
             * @param {string} key 要获取的键名
             * @param {any} [defaultValue=null] 默认值
             */
            getValue(key, defaultValue = null) {
                return this.backend.getValue(key, defaultValue)
            }
            /**
             * @param {string} key 要保存的键名
             * @param {any} value 要保存的数据
             */
            setValue(key, value) {
                if (value === undefined) {
                    console.warn(`set undefined in '${key}' is not supported.`)
                    return
                }
                return this.backend.setValue(key, value)
            }
            /**
             * @param {string} key
             */
            deleteValue(key) {
                return this.backend.deleteValue(key)
            }
            /**
             * @param {function} fn
             */
            listValues() {
                return this.backend.listValues()
            }
        },
    }
})();