// ==UserScript==
// @name        Web IndexedDB Helper
// @namespace   web-indexed-database-helper
// @version     1.0.0
// @description 浏览器数据库工具类
// @author      如梦Nya
// @license     MIT
// @match       *://*/*
// ==/UserScript==

class _WebIndexedDBHelper {
    constructor() {
        /** @type {IDBDatabase} */
        this.db = undefined
    }

    /**
     * 打开数据库
     * @param {string} dbName 数据库名
     * @param {number | undefined} dbVersion 数据库版本
     * @returns {Promise<WebDB, any>}
     */
    open(dbName, dbVersion) {
        let self = this
        return new Promise(function (resolve, reject) {
            /** @type {IDBFactory} */
            const indexDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB
            let req = indexDB.open(dbName, dbVersion)
            req.onerror = reject
            req.onsuccess = function () {
                self.db = this.result
                resolve(self)
            }
        })
    }

    /**
     * 查出一条数据
     * @param {string} tableName 表名
     * @param {string} key 键名
     * @returns {Promise<any, any>}
     */
    get(tableName, key) {
        let self = this
        return new Promise(function (resolve, reject) {
            let req = self.db.transaction([tableName]).objectStore(tableName).get(key)
            req.onerror = reject
            req.onsuccess = function () {
                resolve(this.result)
            }
        })
    }

    /**
     * 插入、更新一条数据
     * @param {string} tableName 表名
     * @param {string} key 键名
     * @param {any} value 数据
     * @returns {Promise<IDBValidKey, any>}
     */
    put(tableName, key, value) {
        let self = this
        return new Promise(function (resolve, reject) {
            let req = self.db.transaction([tableName], 'readwrite').objectStore(tableName).put(value, key)
            req.onerror = reject
            req.onsuccess = function () {
                resolve(this.result)
            }
        })
    }

    /**
     * 关闭数据库
     */
    close() {
        this.db.close()
        delete this.db
    }
}

const WebDB = {
    /**
     * 打开数据库
     * @param {string} dbName 数据库名
     * @param {number | undefined} dbVersion 数据库版本
     * @returns {Promise<WebDB, any>}
     */
    open: function (dbName, dbVersion) {
        return new _WebIndexedDBHelper().open(dbName, dbVersion)
    }
}
