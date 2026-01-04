// ==UserScript==
// @name         《闪韵灵境谱面编辑器》同步助手
// @namespace    cipher-editor-beatmap-sync
// @version      2.1.3
// @description  将谱面快速同步到VR一体机上
// @author       如梦Nya
// @license      MIT
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_info
// @match        https://cipher-editor-cn.picovr.com/*
// @icon         https://cipher-editor-cn.picovr.com/assets/logo-eabc5412.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/462205/%E3%80%8A%E9%97%AA%E9%9F%B5%E7%81%B5%E5%A2%83%E8%B0%B1%E9%9D%A2%E7%BC%96%E8%BE%91%E5%99%A8%E3%80%8B%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462205/%E3%80%8A%E9%97%AA%E9%9F%B5%E7%81%B5%E5%A2%83%E8%B0%B1%E9%9D%A2%E7%BC%96%E8%BE%91%E5%99%A8%E3%80%8B%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const $ = window.jQuery;
const syncWebUrl = "http://cmoyuer.gitee.io/ciphermap-sync-helper-sync-web/"
let JSZip = "";

// ================================= 工具类 =================================

/**
 * 数据库操作类
 */
class WebDB {
    constructor() {
        this.db = undefined
    }

    /**
     * 打开数据库
     * @param {string} dbName 数据库名
     * @param {number | undefined} dbVersion 数据库版本
     * @returns 
     */
    open(dbName, dbVersion) {
        let self = this
        return new Promise(function (resolve, reject) {
            const indexDB = unsafeWindow.indexedDB || unsafeWindow.webkitIndexedDB || unsafeWindow.mozIndexedDB
            let req = indexDB.open(dbName, dbVersion)
            req.onerror = reject
            req.onsuccess = function (e) {
                self.db = e.target.result
                resolve(self)
            }
        });
    }

    /**
     * 查出一条数据
     * @param {string} tableName 表名
     * @param {string} key 键名
     * @returns 
     */
    get(tableName, key) {
        let self = this
        return new Promise(function (resolve, reject) {
            let req = self.db.transaction([tableName]).objectStore(tableName).get(key)
            req.onerror = reject
            req.onsuccess = function (e) {
                resolve(e.target.result)
            }
        });
    }

    /**
     * 插入、更新一条数据
     * @param {string} tableName 表名
     * @param {string} key 键名
     * @param {any} value 数据
     * @returns 
     */
    put(tableName, key, value) {
        let self = this
        return new Promise(function (resolve, reject) {
            let req = self.db.transaction([tableName], 'readwrite').objectStore(tableName).put(value, key)
            req.onerror = reject
            req.onsuccess = function (e) {
                resolve(e.target.result)
            }
        });
    }

    /**
     * 关闭数据库
     */
    close() {
        this.db.close()
        delete this.db
    }
}

/**
 * 通用工具类
 */
class Utils {
    /** @type {HTMLIFrameElement | undefined} */
    static _sandBoxIframe = undefined

    /**
     * 创建一个Iframe沙盒
     * @returns {Document}
     */
    static getSandbox() {
        if (!Utils._sandBoxIframe) {
            let id = GM_info.script.namespace + "_iframe"

            // 找ID
            let iframes = $('#' + id)
            if (iframes.length > 0) Utils._sandBoxIframe = iframes[0]

            // 不存在，创建一个
            if (!Utils._sandBoxIframe) {
                let ifr = document.createElement("iframe");
                ifr.id = id
                ifr.style.display = "none"
                document.body.appendChild(ifr);
                Utils._sandBoxIframe = ifr;
            }
        }
        return Utils._sandBoxIframe
    }

    /**
     * 动态添加Script
     * @param {string} url 脚本链接
     * @returns 
     */
    static dynamicLoadJs(url) {
        return new Promise(function (resolve, reject) {
            let ifrdoc = Utils.getSandbox().contentDocument;
            let script = ifrdoc.createElement('script')
            script.type = 'text/javascript'
            script.src = url
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    resolve()
                    script.onload = script.onreadystatechange = null
                }
            }
            ifrdoc.body.appendChild(script)
        });
    }

    /**
     * 将Blob转换为Base64
     * @param {Blob} blob
     * @returns {Promise}
     */
    static blobToBase64(blob) {
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                resolve(e.target.result)
            }
            fileReader.readAsDataURL(blob)
        })
    }

    /**
     * 数字数组排序
     * @param {[number]} array 
     * @return {[number]}
     */
    static arraySort(array) {
        const rec = (arr) => {
            // 预防数组是空的或者只有一个元素, 当所有元素都大于等于基准值就会产生空的数组
            if (arr.length === 1 || arr.length === 0) { return arr; }
            const left = [];
            const right = [];
            //以第一个元素作为基准值   
            const mid = arr[0];
            //小于基准值的放左边，大于基准值的放右边
            for (let i = 1; i < arr.length; ++i) {
                if (arr[i] < mid) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            //递归调用，最后放回数组    
            return [...rec(left), mid, ...rec(right)];
        };
        const res = rec(array);
        res.forEach((n, i) => { array[i] = n; })
        return array
    }
}

/**
 * 同步页接口
 */
class WebSync {
    /** @type {Window | undefined} */
    static _syncWindow = undefined
    static _ready = false

    /**
     * 获取同步页
     * @returns {Promise<Window>}
     */
    static getWindow() {
        return new Promise(function (resolve, reject) {
            let win = WebSync._syncWindow
            if (!win || win.closed) {
                win = window.open(syncWebUrl, null, "height=600,width=400,resizable=0,status=0,toolbar=0,menubar=0,location=0,status=0")
                WebSync._syncWindow = win
                WebSync._ready = false
            }
            if (WebSync._ready) {
                resolve(win)
            } else {
                let timeoutHandle, handle
                timeoutHandle = setTimeout(() => {
                    clearInterval(handle)
                    reject("time out")
                    win.close()
                }, 5000)
                handle = setInterval(() => {
                    if (!WebSync._ready) return
                    clearTimeout(timeoutHandle)
                    resolve(win)
                }, 100)
            }
        })
    }

    /**
     * 关闭同步页
     */
    static closeWindow() {
        if (!WebSync._syncWindow || WebSync._syncWindow.closed) return
        WebSync._syncWindow.close()
    }

    /**
     * 添加任务到同步页
     * @param {{id:string, name:string, base64:string, image:string}} taskInfo 
     */
    static async addTask(taskInfo) {
        let win = await WebSync.getWindow()
        taskInfo.event = "add_ciphermap"
        win.focus()
        win.postMessage(taskInfo, "*")
    }
}

/**
 * 闪韵工具类
 */
class CipherUtils {
    /**
     * 从首页按钮点击事件中获取歌曲信息
     * @param {PointerEvent} e 
     * @return {Promise<Object>}
     */
    static async getSongInfoFromHomeButton(e) {
        // 关闭弹窗
        let mask = e.target.parentNode
        while (true) {
            if (mask.className && mask.id === "basic-menu") {
                mask = $(mask).find(".css-esi9ax")[0]
                mask.click()
                break
            }
            mask = mask.parentNode
            if (!mask) break
        }
        // index
        let index = -1
        {
            let maskList = $(".css-esi9ax")
            for (let i = 0; i < maskList.length; i++) {
                if (mask === maskList[i]) {
                    index = i
                    break
                }
            }
        }
        // 获取谱面信息
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        try {
            let songsStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            let songPairs = JSON.parse(JSON.parse(songsStr).byId)
            // 按最后打开时间排序
            let idMap = {}
            let timeList = []
            for (let id in songPairs) {
                let time = songPairs[id].lastOpenedAt
                idMap[time] = id
                timeList.push(time)
            }
            timeList = Utils.arraySort(timeList)
            // 谱面信息
            let songId = idMap[timeList[timeList.length - index - 1]]
            if (!songId) throw "can not find song id"
            return songPairs[songId]
        } catch (err) {
            throw err
        } finally {
            BLITZ_RHYTHM.close()
        }
    }
    /**
     * 从编辑器内获取歌曲信息
     * @return {Promise<Object>}
     */
    static async getSongInfoFromEditPage() {
        let result = window.location.href.match(/id=(\w*)/)
        if (!result) throw "can not find song id"
        let songId = result[1]
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        try {
            let songsStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            let songPairs = JSON.parse(JSON.parse(songsStr).byId)
            let songInfo = songPairs[songId]
            if (!songInfo) throw "can not find song id"
            return songInfo
        } catch (err) {
            throw err
        } finally {
            BLITZ_RHYTHM.close()
        }
    }

    /**
     * 获取当前页面类型
     * @returns 
     */
    static getPageType() {
        let url = window.location.href
        let matchs = url.match(/edit\/(\w{1,})/)
        if (!matchs) {
            return "home"
        } else {
            return matchs[1]
        }
    }
}

// ================================= 方法 =================================

/** @type {{id:string, name:string, image:string, base64:string, timer:number}} */
let query_ciphermap_info

/**
 * 初始化
 */
async function initScript() {
    const sandBox = Utils.getSandbox()

    await Utils.dynamicLoadJs("https://cmoyuer.gitee.io/my-resources/js/jszip.min.js")
    JSZip = sandBox.contentWindow.JSZip

    setInterval(
        addSyncButton,
        1000
    )

    window.addEventListener("message", event => {
        /** @type {{event:string}} */
        let data = event.data
        if (!data || !data.event) return
        if (data.event === "syncweb-alive") {
            WebSync._ready = true
        } else if (data.event === "result_ciphermap_zip") {
            if (data.code !== 0 || !query_ciphermap_info || data.data.id !== query_ciphermap_info.id) return
            clearTimeout(query_ciphermap_info.timer)
            Utils.blobToBase64(data.data.blob).then(base64 => {
                query_ciphermap_info.base64 = base64
                WebSync.addTask(query_ciphermap_info)
                query_ciphermap_info = undefined
            }).catch(err => {
                console.error("转换文件格式时出错:", err)
                alert("转换文件格式时出错!")
            })
        }
    })

    window.addEventListener("beforeunload", () => {
        WebSync.closeWindow()
    })
}

/**
 * 添加同步按钮
 */
function addSyncButton() {
    // TODO 修复从edit返回到home时谱面顺序延时排列的问题
    let pageType = CipherUtils.getPageType()

    if (pageType === "home") {
        // 首页按钮
        {
            let btnList = $(".css-onrhul")
            if (btnList.length > 0) {
                let btn = btnList[0]
                let parentNode = $(btn.parentNode)
                if (parentNode.find("#sync-web").length == 0) {
                    let webBtn = $(btn).clone()[0]
                    webBtn.id = "sync-web"
                    webBtn.innerHTML = "同步助手"
                    webBtn.style["margin-left"] = "0"
                    webBtn.style["color"] = "rgb(0, 230, 118)"
                    webBtn.style["border"] = "1px solid rgba(0, 230, 118, 0.5)"
                    webBtn.onclick = () => { WebSync.getWindow().then(win => win.focus()) }
                    parentNode.append(webBtn)
                }
            }
        }

        // 首页谱面更多按钮
        {
            let btnList = $(".css-u4seia")
            for (let i = 0; i < btnList.length; i++) {
                let btn = btnList[i]
                if (btn.attributes.tabindex.value !== "-1") continue
                let parentNode = $(btn.parentNode)
                if (parentNode.find("#btn-sync").length > 0) continue
                // 复制一个按钮
                let btnSync = $(parentNode[0].childNodes[0]).clone()
                btnSync[0].id = "btn-sync"
                // 修改icon
                let svg = btnSync.find("svg")[0]
                svg.attributes.viewBox.value = "0 0 1024 1024"
                let path = btnSync.find("path")[0]
                path.attributes.d.value = "M779.07437 412.216889a18.962963 18.962963 0 0 1 26.737778 2.161778l111.634963 131.356444a18.962963 18.962963 0 0 1-14.449778 31.250963h-50.251852c-13.274074 70.769778-47.407407 136.343704-99.555555 188.491852-139.58637 139.567407-364.980148 141.027556-506.349037 4.361481l-4.437333-4.361481a62.862222 62.862222 0 0 1 86.091851-91.515259l2.787556 2.616889c91.97037 91.97037 241.057185 91.97037 332.98963 0a234.268444 234.268444 0 0 0 59.354074-99.593482h-43.918223a18.962963 18.962963 0 0 1-14.449777-31.250963l111.634963-131.356444a18.962963 18.962963 0 0 1 2.18074-2.161778z m-35.858963-179.749926l4.437334 4.361481a62.862222 62.862222 0 0 1-86.110815 91.51526l-2.787556-2.616889c-91.97037-91.97037-241.038222-91.97037-332.989629 0a234.458074 234.458074 0 0 0-56.149334 89.6l40.732445 0.018963a18.962963 18.962963 0 0 1 14.449778 31.250963l-111.653926 131.337481a18.962963 18.962963 0 0 1-28.899556 0l-111.653926-131.337481a18.962963 18.962963 0 0 1 14.449778-31.250963h52.261926a359.784296 359.784296 0 0 1 97.564444-178.517334c139.567407-139.567407 364.980148-141.027556 506.349037-4.361481z"
                // 修改文字
                btnSync[0].innerHTML = btnSync[0].innerHTML.replace(/>*\W{1,}$/, ">同步")
                // 绑定点击事件
                btnSync[0].onclick = e => {
                    CipherUtils.getSongInfoFromHomeButton(e).then(songInfo => {
                        sendTaskToSyncWeb(songInfo).catch(err => {
                            console.error(err)
                            alert("同步失败!")
                        })
                    }).catch(err => {
                        console.error(err)
                        alert("同步失败!")
                    })
                }
                parentNode.append(btnSync[0])
            }
        }
    } else {
        $("#sync-web").remove()
        $("#btn-sync").remove()
    }

    if (pageType === "download") {
        // 导出页面
        let divList = $(".css-1tiz3p0")
        if (divList.length > 0) {
            if ($("#div-sync").length > 0) return
            let divBox = $(divList[0]).clone()
            divBox[0].id = "div-sync"
            divBox.find(".css-ujbghi")[0].innerHTML = "同步到VR设备"
            divBox.find(".css-1exyu3y")[0].innerHTML = "点击打开同步页面, 在APP打开后, 它会帮你把谱面传输到VR设备上。"
            divBox.find(".css-1y7rp4x")[0].innerText = "同步到VR设备"
            divBox[0].onclick = e => {
                CipherUtils.getSongInfoFromEditPage().then(songInfo => {
                    sendTaskToSyncWeb(songInfo).catch(err => {
                        console.error(err)
                        alert("同步失败!")
                    })
                }).catch(err => {
                    console.error(err)
                    alert("同步失败!")
                })
            }
            $(divList[0].parentNode).append(divBox)
        }
    } else {
        $("#div-sync").remove()
    }
}

/**
 * 添加任务到同步页
 * @param {Object} songRawInfo
 */
async function sendTaskToSyncWeb(songRawInfo) {
    // 拿到谱子的ID
    let songInfo = {
        id: songRawInfo.id,
        name: songRawInfo.name,
        image: "",
        base64: "",
        timer: 0
    }
    // 封面图片
    let imageName = songRawInfo.coverArtFilename
    let BLITZ_RHYTHM_FILES = await new WebDB().open(songRawInfo.officialId ? "BLITZ_RHYTHM-official" : "BLITZ_RHYTHM-files")
    try {
        let imageBlob = await BLITZ_RHYTHM_FILES.get("keyvaluepairs", imageName)
        songInfo.image = await Utils.blobToBase64(imageBlob)
    } catch (err) {
        console.warn("获取封面图失败", err)
        songInfo.image = ""
    } finally {
        BLITZ_RHYTHM_FILES.close()
    }
    // 谱面压缩包
    songInfo.timer = setTimeout(() => {
        console.warn("获取谱面压缩包失败: 编辑器超时未响应")
        query_ciphermap_info = undefined
        alert("获取谱面压缩包失败!")
    }, 5000)
    query_ciphermap_info = songInfo
    unsafeWindow.postMessage({ event: "query_ciphermap_zip", id: songInfo.id })
}

// ================================= 入口 =================================

// 主入口
(function () {
    'use strict'

    initScript()
})()