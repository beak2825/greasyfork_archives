// ==UserScript==
// @name         《闪韵灵境谱面编辑器》功能扩展
// @namespace    cipher-editor-extension
// @version      1.3.1
// @description  为《闪韵灵境谱面编辑器》扩展各种实用的功能
// @author       如梦Nya
// @license      MIT
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      beatsaver.com
// @connect      beatsage.com
// @match        https://cipher-editor-cn.picovr.com/*
// @match        https://beatsaver.com/*
// @match        https://pc.woozooo.com/*
// @icon         https://cipher-editor-cn.picovr.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/464460/%E3%80%8A%E9%97%AA%E9%9F%B5%E7%81%B5%E5%A2%83%E8%B0%B1%E9%9D%A2%E7%BC%96%E8%BE%91%E5%99%A8%E3%80%8B%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/464460/%E3%80%8A%E9%97%AA%E9%9F%B5%E7%81%B5%E5%A2%83%E8%B0%B1%E9%9D%A2%E7%BC%96%E8%BE%91%E5%99%A8%E3%80%8B%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

const $ = window.jQuery
let JSZip = undefined

// ================================================================================ 工具类 ================================================================================

/**
 * 数据库操作类
 */
class WebDB {
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
            const indexDB = unsafeWindow.indexedDB || unsafeWindow.webkitIndexedDB || unsafeWindow.mozIndexedDB
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

/**
 * 闪韵灵境工具类
 */
class CipherUtils {
    /**
     * 获取当前谱面的信息
     */
    static getNowBeatmapInfo() {
        let url = location.href
        // ID
        let matchId = url.match(/id=(\w*)/)
        let id = matchId ? matchId[1] : ""
        // BeatSaverID
        let beatsaverId = ""
        let nameBoxList = $(".css-tpsa02")
        if (nameBoxList.length > 0) {
            let name = nameBoxList[0].innerHTML
            let matchBeatsaverId = name.match(/\[(\w*)\]/)
            if (matchBeatsaverId) beatsaverId = matchBeatsaverId[1]
        }
        // 难度
        let matchDifficulty = url.match(/difficulty=(\w*)/)
        let difficulty = matchDifficulty ? matchDifficulty[1] : ""
        return { id, difficulty, beatsaverId }
    }

    /**
     * 获取谱面全部信息
     * @param {string} id 谱面ID
     * @returns {object}
     */
    static async getCipherMapFullInfo(id) {
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        let rawSongs = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
        BLITZ_RHYTHM.close()
        let songsInfo = JSON.parse(rawSongs)
        let songsById = JSON.parse(songsInfo.byId)
        return songsById[id]
    }

    /**
     * 获取指定谱面的歌曲OGG资源
     * @param {string} id 谱面ID
     * @returns {Promise<Blob, any>}
     */
    static async getSongBlob(id) {
        let info = await CipherUtils.getCipherMapFullInfo(id)
        let songFileName = info.songFilename + ""
        let blob
        if (info.officialId) {
            // 官谱
            let BLITZ_RHYTHM_official = await new WebDB().open("BLITZ_RHYTHM-official")
            blob = await BLITZ_RHYTHM_official.get("keyvaluepairs", songFileName)
            BLITZ_RHYTHM_official.close()
        } else {
            // 自定义谱
            let BLITZ_RHYTHM_files = await new WebDB().open("BLITZ_RHYTHM-files")
            blob = await BLITZ_RHYTHM_files.get("keyvaluepairs", songFileName)
            BLITZ_RHYTHM_files.close()
        }
        return blob
    }

    /**
     * 添加歌曲校验数据头
     * @param {ArrayBuffer} rawBuffer 
     * @returns {Blob}
     */
    static addSongVerificationCode(rawBuffer) {
        // 前面追加数据，以通过校验
        let rawData = new Uint8Array(rawBuffer)
        let BYTE_VERIFY_ARRAY = [235, 186, 174, 235, 186, 174, 235, 186, 174, 85, 85]

        let buffer = new ArrayBuffer(rawData.length + BYTE_VERIFY_ARRAY.length)
        let dataView = new DataView(buffer)
        for (let i = 0; i < BYTE_VERIFY_ARRAY.length; i++) {
            dataView.setUint8(i, BYTE_VERIFY_ARRAY[i])
        }
        for (let i = 0; i < rawData.length; i++) {
            dataView.setUint8(BYTE_VERIFY_ARRAY.length + i, rawData[i])
        }
        return new Blob([buffer], { type: "application/octet-stream" })
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

    /**
     * 获取页面参数
     * @returns 
     */
    static getPageParmater() {
        let url = window.location.href
        let matchs = url.match(/\?import=(\w{1,})@(\w{1,})@(\w{1,})/)
        if (!matchs) return
        return {
            event: "import",
            source: matchs[1],
            id: matchs[2],
            mode: matchs[3],
        }
    }

    /**
     * 关闭编辑器顶部菜单
     */
    static closeEditorTopMenu() {
        $(".css-1k12r02").click()
    }

    /**
     * 显示Loading
     */
    static showLoading() {
        let maskBox = $('<div style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:9999;" id="loading"></div>')
        maskBox.append('<span style="display: block;position: absolute;width:40px;height:40px;left: calc(50vw - 20px);top: calc(50vh - 20px);"><svg viewBox="22 22 44 44"><circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6" class="css-14891ef"></circle></svg></span>')
        $("#root").append(maskBox)
    }

    /**
     * 隐藏Loading
     */
    static hideLoading() {
        $("#loading").remove()
    }

    /**
     * 网页弹窗
     */
    static showIframe(src){
        this.hideIframe()
        let maskBox = $('<div style="position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:9999;" id="iframe_box"></div>')
        maskBox.click(this.hideIframe)
        maskBox.append('<iframe src="' + src + '" style="width:calc(100vw - 400px);height:calc(100vh - 200px);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:12px;"></iframe>')
        $("#root").append(maskBox)
    }

    /**
     * 隐藏Loading
     */
    static hideIframe() {
        $("#iframe_box").remove()
    }

    /**
     * 等待Loading结束
     * @returns 
     */
    static waitLoading() {
        return new Promise((resolve, reject) => {
            let handle = setInterval((() => {
                let loadingList = $(".css-c81162")
                if (loadingList && loadingList.length > 0) return
                clearInterval(handle)
                resolve()
            }), 500)
        })
    }
}

/**
 * 沙盒工具类
 */
class SandBox {
    /** @type {HTMLIFrameElement | undefined} */
    static _sandBoxIframe = undefined

    /**
     * 创建一个Iframe沙盒
     * @returns {HTMLIFrameElement}
     */
    static getDocument() {
        if (!SandBox._sandBoxIframe) {
            let id = GM_info.script.namespace + "_iframe"

            // 找ID
            let iframes = $('#' + id)
            if (iframes.length > 0) SandBox._sandBoxIframe = iframes[0]

            // 不存在，创建一个
            if (!SandBox._sandBoxIframe) {
                let ifr = document.createElement("iframe");
                ifr.id = id
                ifr.style.display = "none"
                document.body.appendChild(ifr);
                SandBox._sandBoxIframe = ifr;
            }
        }
        return SandBox._sandBoxIframe
    }

    /**
     * 动态添加Script
     * @param {string} url 脚本链接
     * @returns {Promise<Element>}
     */
    static dynamicLoadJs(url) {
        return new Promise(function (resolve, reject) {
            let ifrdoc = SandBox.getDocument().contentDocument;
            let script = ifrdoc.createElement('script')
            script.type = 'text/javascript'
            script.src = url
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    resolve(script)
                    script.onload = script.onreadystatechange = null
                }
            }
            ifrdoc.body.appendChild(script)
        });
    }
}

/**
 * BeatSaver工具类
 */
class BeatSaverUtils {
    /**
     * 搜索歌曲列表
     * @param {string} searchKey 搜索关键字
     * @param {number} pageCount 搜索页数
     * @returns 
     */
    static searchSongList(searchKey, pageCount = 1) {
        return new Promise(function (resolve, reject) {
            let songList = []
            let songInfoMap = {}
            let count = 0
            let cbFlag = false
            let func = data => {
                // 填充数据
                data.docs.forEach(rawInfo => {
                    let artist = rawInfo.metadata.songAuthorName
                    let bpm = rawInfo.metadata.bpm
                    let cover = rawInfo.versions[0].coverURL
                    let song_name = "[" + rawInfo.id + "]" + rawInfo.metadata.songName
                    let id = 80000000000 + parseInt(rawInfo.id, 36)
                    songList.push({ artist, bpm, cover, song_name, id })

                    let downloadURL = rawInfo.versions[0].downloadURL
                    let previewURL = rawInfo.versions[0].previewURL
                    songInfoMap[id] = { downloadURL, previewURL }
                })
                if (++count == pageCount) {
                    cbFlag = true
                    resolve({ songList, songInfoMap })
                }
            }
            for (let i = 0; i < pageCount; i++) {
                Utils.ajax({
                    url: "https://api.beatsaver.com/search/text/" + i + "?sortOrder=Relevance&q=" + searchKey,
                    method: "GET",
                    responseType: "json"
                }).then(func)
            }
        })
    }


    /**
     * 从BeatSaver下载ogg文件
     * @param {number} zipUrl 歌曲压缩包链接
     * @param {function} onprogress 进度回调
     * @returns {Promise<blob, any>}
     */
    static async downloadSongFile(zipUrl, onprogress) {
        let blob = await Utils.downloadZipFile(zipUrl, onprogress)
        // 解压出ogg文件
        return await BeatSaverUtils.getOggFromZip(blob)
    }

    /**
     * 从压缩包中提取出ogg文件
     * @param {blob} zipBlob 
     * @param {boolean | undefined} verification 
     * @returns 
     */
    static async getOggFromZip(zipBlob, verification = true) {
        let zip = await JSZip.loadAsync(zipBlob)
        let eggFile = undefined
        for (let fileName in zip.files) {
            if (!fileName.endsWith(".egg")) continue
            eggFile = zip.file(fileName)
            break
        }
        if (verification) {
            let rawBuffer = await eggFile.async("arraybuffer")
            return CipherUtils.addSongVerificationCode(rawBuffer)
        } else {
            return await eggFile.async("blob")
        }
    }

    /**
     * 获取压缩包下载链接
     * @param {string} id 歌曲ID
     * @return {Promise}
     */
    static getDownloadUrl(id) {
        return new Promise(function (resolve, reject) {
            Utils.ajax({
                url: "https://api.beatsaver.com/maps/id/" + id,
                method: "GET",
                responseType: "json",
            }).then(data => {
                resolve(data.versions[0].downloadURL)
            }).catch(err => {
                reject(err)
            })
        })
    }

    /**
     * 从压缩包中提取曲谱难度文件
     * @param {Blob} zipBlob
     * @returns 
     */
    static async getBeatmapInfo(zipBlob) {
        let zip = await JSZip.loadAsync(zipBlob)
        // 谱面信息
        let infoFile
        for (let fileName in zip.files) {
            if (fileName.toLowerCase() !== "info.dat") continue
            infoFile = zip.files[fileName]
            break
        }
        if (!infoFile) throw "请检查压缩包中是否包含info.dat文件"
        let rawBeatmapInfo = JSON.parse(await infoFile.async("string"))
        // 难度列表
        let difficultyBeatmaps
        let diffBeatmapSets = rawBeatmapInfo._difficultyBeatmapSets
        for (let a in diffBeatmapSets) {
            let info = diffBeatmapSets[a]
            if (info["_beatmapCharacteristicName"] !== "Standard") continue
            difficultyBeatmaps = info._difficultyBeatmaps
            break
        }
        // 难度对应文件名
        let beatmapInfo = {
            raw: rawBeatmapInfo,
            version: rawBeatmapInfo._version,
            levelAuthorName: rawBeatmapInfo._levelAuthorName,
            difficulties: []
        }
        for (let index in difficultyBeatmaps) {
            let difficultyInfo = difficultyBeatmaps[index]
            let difficulty = difficultyInfo._difficulty
            let difficultyLabel = ""
            if (difficultyInfo._customData && difficultyInfo._customData._difficultyLabel)
                difficultyLabel = difficultyInfo._customData._difficultyLabel
            beatmapInfo.difficulties.push({
                difficulty,
                difficultyLabel,
                file: zip.files[difficultyInfo._beatmapFilename]
            })
        }
        return beatmapInfo
    }
}

/**
 * XMLHttpRequest请求拦截器
 */
class XHRIntercept {
    /** @type {XHRIntercept} */
    static _self

    /**
     * 初始化
     * @returns {XHRIntercept}
     */
    constructor() {
        if (XHRIntercept._self) return XHRIntercept._self
        XHRIntercept._self = this

        // 修改EventListener方法
        let rawXhrAddEventListener = XMLHttpRequest.prototype.addEventListener
        XMLHttpRequest.prototype.addEventListener = function (key, func) {
            if (key === "progress") {
                this.onprogress = func
            } else {
                rawXhrAddEventListener.apply(this, arguments)
            }
        }
        let rawXhrRemoveEventListener = XMLHttpRequest.prototype.removeEventListener
        XMLHttpRequest.prototype.removeEventListener = function (key, func) {
            if (key === "progress") {
                this.onprogress = undefined
            } else {
                rawXhrRemoveEventListener.apply(this, arguments)
            }
        }

        // 修改send方法
        /** @type {function[]} */
        this.sendIntercepts = []
        this.rawXhrSend = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function () { XHRIntercept._self._xhrSend(this, arguments) }
    }

    /**
     * 添加Send拦截器
     * @param {function} func 
     */
    onXhrSend(func) {
        if (this.sendIntercepts.indexOf(func) >= 0) return
        this.sendIntercepts.push(func)
    }

    /**
     * 删除Send拦截器
     * @param {function | undefined} func 
     */
    offXhrSend(func) {
        if (typeof func === "function") {
            let index = this.sendIntercepts.indexOf(func)
            if (index < 0) return
            this.sendIntercepts.splice(index, 1)
        } else {
            this.sendIntercepts = []
        }
    }


    /**
     * 发送拦截器
     * @param {XMLHttpRequest} self 
     * @param {IArguments} args
     */
    _xhrSend(self, args) {
        let complete = () => { this.rawXhrSend.apply(self, args) }
        for (let i = 0; i < this.sendIntercepts.length; i++) {
            let flag = this.sendIntercepts[i](self, args, complete)
            if (flag) return
        }
        complete()
    }
}

/**
 * 通用工具类
 */
class Utils {
    /**
     * 下载压缩包文件
     * @param {number} zipUrl 歌曲压缩包链接
     * @param {function | undefined} onprogress 进度回调
     * @returns {Promise}
     */
    static downloadZipFile(zipUrl, onprogress) {
        return new Promise(function (resolve, reject) {
            Utils.ajax({
                url: zipUrl,
                method: "GET",
                responseType: "blob",
                onprogress,
            }).then(data => {
                resolve(new Blob([data], { type: "application/zip" }))
            }).catch(reject)
        })
    }

    /**
     * 获取音乐文件时长
     * @param {Blob} blob 
     */
    static getOggDuration(blob) {
        return new Promise((resolve, reject) => {
            let ifDoc = SandBox.getDocument().contentDocument

            let audio = ifDoc.createElement('audio')
            audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration)
                // $(audio).remove()
            })
            audio.addEventListener('error', () => {
                reject(audio.error)
            })

            let reader = new FileReader()
            reader.onerror = () => {
                reject(reader.error)
            }
            reader.onload = (e) => {
                audio.src = e.target.result
            }
            reader.readAsDataURL(new File([blob], "song.ogg", { type: "audio/ogg" }))
        })
    }

    /**
     * 异步发起网络请求
     * @param {object} config 
     * @returns 
     */
    static ajax(config) {
        return new Promise((resolve, reject) => {
            config.onload = res => {
                if (res.status >= 200 && res.status < 300) {
                    try {
                        resolve(JSON.parse(res.response))
                    } catch {
                        resolve(res.response)
                    }
                }
                else {
                    reject("HTTP Code: " + res.status)
                }
            }
            config.onerror = err => {
                reject(err)
            }
            GM_xmlhttpRequest(config)
        })
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
     * 将Base64格式转换为File
     * @param {string} base64 
     * @param {string} filename 
     * @returns 
     */
    static base64toFile(base64, filename = 'file') {
        let arr = base64.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
            type: mime,
        })
    }
}
// ================================================================================ 编辑器拓展 ================================================================================

class SearchSongExtension {
    constructor() {
        this.searchFromBeatSaver = false
        this.songInfoMap = {}
        this.lastPageType = "other"
    }

    // 加载XHR拦截器
    initXHRIntercept() {
        let _this = this
        let xhrIntercept = new XHRIntercept()
        /**
         * @param {XMLHttpRequest} self
         * @param {IArguments} args
         * @param {function} complete
         * @returns {boolean} 是否匹配
         */
        let onSend = function (self, args, complete) {
            let url = self._url
            if (!url || !_this.searchFromBeatSaver) return

            if (url.startsWith("/song/staticList")) {
                // 获取歌曲列表
                let result = decodeURI(url).match(/songName=(\S*)&/)
                let key = ""
                if (result) key = result[1].replace("+", " ")
                BeatSaverUtils.searchSongList(key, 2).then(res => {
                    self.extraSongList = res.songList
                    _this.songInfoMap = res.songInfoMap
                    complete()
                }).catch(err => {
                    alert("搜索歌曲失败！")
                    console.error(err)
                    self.extraSongList = []
                    complete()
                })

                self.addEventListener("readystatechange", function () {
                    if (this.readyState !== this.DONE) return
                    const res = JSON.parse(this.responseText)
                    if (this.extraSongList) {
                        res.data.data = this.extraSongList
                        res.data.total = res.data.data.length
                        this.extraSongList = []
                    }
                    Object.defineProperty(this, 'responseText', {
                        writable: true
                    });
                    this.responseText = JSON.stringify(res)
                    setTimeout(() => {
                        _this.fixSongListStyle()
                        _this.addPreviewFunc()
                    }, 200)
                });
                return true
            } else if (url.startsWith("/beatsaver/")) {
                let _onprogress = self.onprogress
                self.onprogress = undefined

                // 从BeatSaver下载歌曲
                let result = decodeURI(url).match(/\d{1,}/)
                let id = parseInt(result[0])
                BeatSaverUtils.downloadSongFile(_this.songInfoMap[id].downloadURL, _onprogress).then(oggBlob => {
                    _this.songInfoMap[id].ogg = oggBlob
                    complete()
                }).catch(err => {
                    console.error(err)
                    self.onerror(err)
                })

                self.addEventListener("readystatechange", function () {
                    if (this.readyState !== this.DONE) return
                    let result = decodeURI(url).match(/\d{1,}/)
                    let id = parseInt(result[0])
                    Object.defineProperty(this, 'response', {
                        writable: true
                    });
                    this.response = _this.songInfoMap[id].ogg
                });
                return true
            } else if (url.startsWith("/song/ogg")) {
                // 获取ogg文件下载链接
                let result = decodeURI(url).match(/id=(\d*)/)
                let id = parseInt(result[1])
                if (id < 80000000000) return
                self.addEventListener("readystatechange", function () {
                    if (this.readyState !== this.DONE) return
                    const res = JSON.parse(this.responseText)
                    res.code = 0
                    res.data = { link: "/beatsaver/" + id }
                    res.msg = "success"
                    Object.defineProperty(this, 'responseText', {
                        writable: true
                    });
                    this.responseText = JSON.stringify(res)
                });
                complete()
                return true
            }
        }
        xhrIntercept.onXhrSend(onSend)
    }
    /**
     * 更新数据库
     * @param {Boolean} isForce 强制转换
     * @returns 
     */
    async updateDatabase(isForce) {
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        let BLITZ_RHYTHM_files = await new WebDB().open("BLITZ_RHYTHM-files")
        let BLITZ_RHYTHM_official = await new WebDB().open("BLITZ_RHYTHM-official")
        let songInfos = []
        let hasChanged = false
        let songsInfo
        // 更新歌曲信息
        {
            let rawSongs = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            songsInfo = JSON.parse(rawSongs)
            let songsById = JSON.parse(songsInfo.byId)
            for (let key in songsById) {
                let officialId = songsById[key].officialId
                if (typeof officialId != "number" || (!isForce && officialId < 80000000000)) continue
                let songInfo = songsById[key]
                songInfos.push(JSON.parse(JSON.stringify(songInfo)))
                songInfo.coverArtFilename = songInfo.coverArtFilename.replace("" + songInfo.officialId, songInfo.id)
                songInfo.songFilename = songInfo.songFilename.replace("" + songInfo.officialId, songInfo.id)
                songInfo.officialId = ""
                songsById[key] = songInfo
                hasChanged = true
            }
            songsInfo.byId = JSON.stringify(songsById)
        }
        // 处理文件
        for (let index in songInfos) {
            let songInfo = songInfos[index]
            // 复制封面和音乐文件
            let cover = await BLITZ_RHYTHM_official.get("keyvaluepairs", songInfo.coverArtFilename)
            let song = await BLITZ_RHYTHM_official.get("keyvaluepairs", songInfo.songFilename)
            await BLITZ_RHYTHM_files.put("keyvaluepairs", songInfo.coverArtFilename.replace("" + songInfo.officialId, songInfo.id), cover)
            await BLITZ_RHYTHM_files.put("keyvaluepairs", songInfo.songFilename.replace("" + songInfo.officialId, songInfo.id), song)
            // 添加info记录
            await BLITZ_RHYTHM_files.put("keyvaluepairs", songInfo.id + "_Info.dat", JSON.stringify({ _songFilename: "song.ogg" }))
        }
        // 保存数据
        if (hasChanged) await BLITZ_RHYTHM.put("keyvaluepairs", "persist:songs", JSON.stringify(songsInfo))
        BLITZ_RHYTHM.close()
        BLITZ_RHYTHM_files.close()
        BLITZ_RHYTHM_official.close()
        return hasChanged
    }
    /**
     * 修复歌单布局
     */
    fixSongListStyle() {
        let songListBox = $(".css-10szcx0")[0]
        songListBox.style["grid-template-columns"] = "repeat(3, minmax(0px, 1fr))"
        let songBox = songListBox.parentNode
        if ($(".css-1wfsuwr").length > 0) {
            songBox.style["overflow-y"] = "hidden"
            songBox.parentNode.style["margin-bottom"] = ""
        } else {
            songBox.style["overflow-y"] = "auto"
            songBox.parentNode.style["margin-bottom"] = "44px"
        }
        let itemBox = $(".css-bil4eh")
        for (let index = 0; index < itemBox.length; index++)
            itemBox[index].style.width = "230px"
    }
    /**
     * 在歌曲Card中添加双击预览功能
     */
    addPreviewFunc() {
        let searchBox = $(".css-1d92frk")
        $("#preview_tip").remove()
        searchBox.after("<div style='text-align: center;color:gray;padding-bottom:10px;' id='preview_tip'>双击歌曲可预览曲谱</div>")
        let infoViewList = $(".css-bil4eh")
        for (let index = 0; index < infoViewList.length; index++) {
            infoViewList[index].ondblclick = () => {
                let name = $(infoViewList[index]).find(".css-1y1rcqj")[0].innerHTML
                let result = name.match(/^\[(\w*)\]/)
                if (!result) return
                let previewUrl = "https://skystudioapps.com/bs-viewer/?id=" + result[1]
                CipherUtils.showIframe(previewUrl)
                // window.open(previewUrl)
            }
        }
    }
    /**
     * 添加通过BeatSaver搜索歌曲的按钮
     */
    applySearchButton() {
        let boxList = $(".css-1u8wof2") // 弹窗
        try {
            if (boxList.length == 0) throw "Box not found"
            let searchBoxList = boxList.find(".css-70qvj9")
            if (searchBoxList.length == 0) throw "item too few" // 搜索栏元素数量
            if (searchBoxList[0].childNodes.length >= 3) return // 搜索栏元素数量
        } catch {
            if (this.searchFromBeatSaver) this.searchFromBeatSaver = false
            return
        }

        let rawSearchBtn = $(boxList[0]).find("button")[0] // 搜索按钮

        // 添加一个按钮
        let searchBtn = document.createElement("button")
        searchBtn.className = rawSearchBtn.className
        searchBtn.innerHTML = "BeatSaver"
        $(rawSearchBtn.parentNode).append(searchBtn);

        // 绑定事件
        rawSearchBtn.onmousedown = () => {
            this.searchFromBeatSaver = false
            $("#preview_tip").remove()
        }
        searchBtn.onmousedown = () => {
            this.searchFromBeatSaver = true
            $(rawSearchBtn).click()
        }
    }
    /**
     * 添加转换官方谱面的按钮
     * @returns 
     */
    async applyConvertCiphermapButton() {
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        try {
            let rawSongs = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            let songsInfo = JSON.parse(rawSongs)
            let songsById = JSON.parse(songsInfo.byId)
            let songId = CipherUtils.getNowBeatmapInfo().id
            let officialId = songsById[songId].officialId
            if (!officialId) return
        } catch (error) {
            console.error(error)
            return
        } finally {
            BLITZ_RHYTHM.close()
        }

        let divList = $(".css-1tiz3p0")
        if (divList.length > 0) {
            if ($("#div-custom").length > 0) return
            let divBox = $(divList[0]).clone()
            divBox[0].id = "div-custom"
            divBox.find(".css-ujbghi")[0].innerHTML = "转换为自定义谱面"
            divBox.find(".css-1exyu3y")[0].innerHTML = "将官方谱面转换为自定义谱面, 以导出带有音乐文件的完整谱面压缩包。"
            divBox.find(".css-1y7rp4x")[0].innerText = "开始转换谱面"
            divBox[0].onclick = e => {
                // 更新歌曲信息
                this.updateDatabase(true).then((hasChanged) => {
                    if (hasChanged) setTimeout(() => { window.location.reload() }, 1000)
                }).catch(err => {
                    console.log("转换谱面失败：", err)
                    alert("转换谱面失败，请刷新再试！")
                })
            }
            $(divList[0].parentNode).append(divBox)
        }
    }

    /**
     * 隐藏按钮
     */
    hideConvertCiphermapButton() {
        $("#div-custom").remove()
    }
    /**
     * 定时任务 1s
     */
    handleTimer() {
        let pageType = CipherUtils.getPageType()
        if (pageType !== "home") {
            if (pageType != this.lastPageType) {
                // 隐藏按钮
                if (pageType !== "download")
                    this.hideConvertCiphermapButton()
                // 更新歌曲信息
                this.updateDatabase().then((hasChanged) => {
                    if (hasChanged) setTimeout(() => { window.location.reload() }, 1000)
                }).catch(err => {
                    console.log("更新数据失败：", err)
                    alert("更新歌曲信息失败，请刷新再试！")
                })
            } else if (pageType === "download") {
                this.applyConvertCiphermapButton()
            }
        } else {
            this.applySearchButton()
        }
        this.lastPageType = pageType
    }
    async init() {
        // 初始化XHR拦截器
        this.initXHRIntercept()

        // 启动定时任务
        let timerFunc = () => {
            CipherUtils.waitLoading().then(() => {
                setTimeout(timerFunc, 1000)
                this.handleTimer()
            }).catch(err => {
                setTimeout(timerFunc, 1000)
                console.error(err)
            })
        }
        timerFunc()
    }
}

class ImportBeatmapExtension {
    constructor() {

    }

    /**
     * 在顶部菜单添加导入按钮
     */
    addImportButton() {
        if ($("#importBeatmap").length > 0) return
        let btnsBoxList = $(".css-4e93fo")
        if (btnsBoxList.length == 0) return
        // 按键组
        let div = document.createElement("div")
        div.style["display"] = "flex"
        // 按钮模板
        let btnTemp = $(btnsBoxList[0].childNodes[0])
        // 按钮1
        let btnImportBs = btnTemp.clone()[0]
        btnImportBs.id = "importBeatmap"
        btnImportBs.innerHTML = "导入谱面 BeatSaver链接"
        btnImportBs.onclick = () => { this.importFromBeatSaver() }
        btnImportBs.style["font-size"] = "13px"
        div.append(btnImportBs)
        // 按钮2
        let btnImportZip = btnTemp.clone()[0]
        btnImportZip.id = "importBeatmap"
        btnImportZip.innerHTML = "导入谱面 BeatSaber压缩包"
        btnImportZip.onclick = () => { this.importFromBeatmap() }
        btnImportZip.style["margin-left"] = "5px"
        btnImportZip.style["font-size"] = "13px"
        div.append(btnImportZip)
        // 添加
        btnsBoxList[0].prepend(div)
    }

    async importFromBeatSaver() {
        try {
            // 获取当前谱面信息
            let nowBeatmapInfo = CipherUtils.getNowBeatmapInfo()

            // 获取谱面信息
            let url = prompt('请输入BeatSaver铺面链接', "https://beatsaver.com/maps/" + nowBeatmapInfo.beatsaverId)
            if (!url) return
            let result = url.match(/^https:\/\/beatsaver.com\/maps\/(\S*)$/)
            if (!result) {
                alert("链接格式错误！")
                return
            }
            CipherUtils.showLoading()
            let downloadUrl = await BeatSaverUtils.getDownloadUrl(result[1])
            let zipBlob = await Utils.downloadZipFile(downloadUrl)
            await this.importBeatmap(zipBlob, nowBeatmapInfo)
        } catch (err) {
            console.error(err)
            alert("出错啦：" + err)
            CipherUtils.hideLoading()
        }
    }

    /**
     * 通过压缩文件导入
     */
    importFromBeatmap() {
        try {
            // 创建上传按钮
            let fileSelect = document.createElement('input')
            fileSelect.type = 'file'
            fileSelect.style.display = "none"

            fileSelect.accept = ".zip,.rar"
            fileSelect.addEventListener("change", (e) => {
                let files = e.target.files
                if (files == 0) return
                CipherUtils.showLoading()
                let file = files[0]
                // 获取当前谱面信息
                let nowBeatmapInfo = CipherUtils.getNowBeatmapInfo()
                this.importBeatmap(new Blob([file]), nowBeatmapInfo).catch(err => {
                    CipherUtils.hideLoading()
                    console.error(err)
                    alert("出错啦：" + err)
                })
            })
            // 点击按钮
            document.body.append(fileSelect)
            fileSelect.click()
            fileSelect.remove()
        } catch (err) {
            alert("出错啦：" + err)
        }
    }

    /**
     * 从BeatSaber谱面压缩包导入信息
     * @param {Blob} zipBlob
     * @param {{id:string, difficulty:string, beatsaverId:string}} nowBeatmapInfo
     * @param {number} targetDifficulty
     */
    async importBeatmap(zipBlob, nowBeatmapInfo, targetDifficulty) {
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        let BLITZ_RHYTHM_files = await new WebDB().open("BLITZ_RHYTHM-files")
        try {
            // 获取当前谱面基本信息
            let rawSongs = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            let songsInfo = JSON.parse(rawSongs)
            let songsById = JSON.parse(songsInfo.byId)
            let songInfo = songsById[nowBeatmapInfo.id]

            let userName = ""
            let songDuration = -1
            {
                let rawUser = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:user")
                userName = JSON.parse(JSON.parse(rawUser).userInfo).name

                songDuration = Math.floor(songInfo.songDuration * (songInfo.bpm / 60))
            }
            // 获取当前谱面难度信息
            let datKey = nowBeatmapInfo.id + "_" + nowBeatmapInfo.difficulty + "_Ring.dat"
            let datInfo = JSON.parse(await BLITZ_RHYTHM_files.get("keyvaluepairs", datKey))
            if (datInfo._version !== "2.3.0")
                throw "插件不支持该谱面版本！可尝试重新创建谱面"
            let beatmapInfo = await BeatSaverUtils.getBeatmapInfo(zipBlob)
            if (beatmapInfo.difficulties.length == 0)
                throw "该谱面找不到可用的难度"

            // 选择导入难度
            let tarDifficulty = 1
            if (targetDifficulty >= 1 && targetDifficulty <= beatmapInfo.difficulties.length) {
                tarDifficulty = targetDifficulty
            } else {
                let defaultDifficulty = "1"
                let promptTip = ""
                console.log(beatmapInfo.difficulties)
                for (let index in beatmapInfo.difficulties) {
                    if (index > 0) promptTip += "\r\n"
                    promptTip += (parseInt(index) + 1) + "." + beatmapInfo.difficulties[index].difficulty
                }
                let difficulty = ""
                while (true) {
                    difficulty = prompt("请问要导入第几个难度（数字）：\r\n" + promptTip, defaultDifficulty)
                    if (!difficulty) {
                        // Cancel
                        CipherUtils.hideLoading()
                        return
                    }
                    if (/^\d$/.test(difficulty)) {
                        tarDifficulty = parseInt(difficulty)
                        if (tarDifficulty > 0 && tarDifficulty <= beatmapInfo.difficulties.length) break
                        alert("请输入准确的序号！")
                    } else {
                        alert("请输入准确的序号！")
                    }
                }
            }
            // 开始导入
            let difficultyInfo = JSON.parse(await beatmapInfo.difficulties[tarDifficulty - 1].file.async("string"))
            let changeInfo = this.convertBeatMapInfo(difficultyInfo.version || difficultyInfo._version, difficultyInfo, songDuration)
            datInfo._notes = changeInfo._notes
            datInfo._obstacles = changeInfo._obstacles
            await BLITZ_RHYTHM_files.put("keyvaluepairs", datKey, JSON.stringify(datInfo))
            // 设置谱师署名
            songInfo.mapAuthorName = userName + " & " + beatmapInfo.levelAuthorName
            songsInfo.byId = JSON.stringify(songsById)
            await BLITZ_RHYTHM.put("keyvaluepairs", "persist:songs", JSON.stringify(songsInfo))

            // 导入完成
            setTimeout(() => {
                CipherUtils.closeEditorTopMenu()
                window.location.reload()
            }, 1000)
        } catch (error) {
            throw error
        } finally {
            BLITZ_RHYTHM.close()
            BLITZ_RHYTHM_files.close()
        }
    }

    /**
     * 转换BeatSaber谱面信息
     * @param {string} version
     * @param {JSON} info 
     * @param {number} songDuration
     */
    convertBeatMapInfo(version, rawInfo, songDuration) {
        let info = {
            _notes: [], // 音符
            _obstacles: [], // 墙
        }
        if (version.startsWith("3.")) {
            // 音符
            for (let index in rawInfo.colorNotes) {
                let rawNote = rawInfo.colorNotes[index]
                if (songDuration > 0 && rawNote.b > songDuration) continue // 去除歌曲结束后的音符
                info._notes.push({
                    _time: rawNote.b,
                    _lineIndex: rawNote.x,
                    _lineLayer: rawNote.y,
                    _type: rawNote.c,
                    _cutDirection: 8,
                })
            }
        } else if (version.startsWith("2.")) {
            // 音符
            for (let index in rawInfo._notes) {
                let rawNote = rawInfo._notes[index]
                if (songDuration > 0 && rawNote._time > songDuration) continue // 去除歌曲结束后的音符
                if (rawNote._customData && rawNote._customData._track === "choarrowspazz") continue // 去除某个mod的前级音符
                info._notes.push({
                    _time: rawNote._time,
                    _lineIndex: rawNote._lineIndex,
                    _lineLayer: rawNote._lineLayer,
                    _type: rawNote._type,
                    _cutDirection: 8,
                })
            }
            // 墙
            for (let index in rawInfo._obstacles) {
                let rawNote = rawInfo._obstacles[index]
                if (songDuration > 0 && rawNote._time > songDuration) continue // 去除歌曲结束后的墙
                info._obstacles.push({
                    _time: rawNote._time,
                    _duration: rawNote._duration,
                    _type: rawNote._type,
                    _lineIndex: rawNote._lineIndex,
                    _width: rawNote._width,
                })
            }
        } else {
            throw ("暂不支持该谱面的版本（" + version + "），请换个链接再试！")
        }
        // 因Cipher不支持长墙，所以转为多面墙
        let newObstacles = []
        for (let index in info._obstacles) {
            let baseInfo = info._obstacles[index]
            let startTime = baseInfo._time
            let endTime = baseInfo._time + baseInfo._duration
            let duration = baseInfo._duration
            baseInfo._duration = 0.04
            // 头
            baseInfo._time = startTime
            if (songDuration < 0 || (baseInfo._time + baseInfo._duration) < songDuration)
                newObstacles.push(JSON.parse(JSON.stringify(baseInfo)))
            // 中间
            let count = Math.floor(duration / 1) - 2  // 至少间隔1秒
            let dtime = ((endTime - 0.04) - (startTime + 0.04)) / count
            for (let i = 0; i < count; i++) {
                baseInfo._time += dtime
                if (songDuration < 0 || (baseInfo._time + baseInfo._duration) < songDuration)
                    newObstacles.push(JSON.parse(JSON.stringify(baseInfo)))
            }
            // 尾
            baseInfo._time = endTime - 0.04
            if (songDuration < 0 || (baseInfo._time + baseInfo._duration) < songDuration)
                newObstacles.push(JSON.parse(JSON.stringify(baseInfo)))
        }
        info._obstacles = newObstacles
        return info
    }

    async ApplyPageParmater() {
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        let BLITZ_RHYTHM_files = await new WebDB().open("BLITZ_RHYTHM-files")
        try {
            let pagePar = CipherUtils.getPageParmater()
            if (!pagePar) return

            if (pagePar.event === "import") {
                if (pagePar.source === "beatsaver") {
                    CipherUtils.showLoading()
                    if (pagePar.mode !== "song" && pagePar.mode !== "all") return
                    let zipUrl = await BeatSaverUtils.getDownloadUrl(pagePar.id)
                    let zipBlob = await Utils.downloadZipFile(zipUrl)
                    let beatsaverInfo = await BeatSaverUtils.getBeatmapInfo(zipBlob)
                    // console.log(beatsaverInfo)
                    let oggBlob = await BeatSaverUtils.getOggFromZip(zipBlob, false)

                    let zip = await JSZip.loadAsync(zipBlob)
                    let coverBlob = await zip.file(beatsaverInfo.raw._coverImageFilename).async("blob")
                    let coverType = beatsaverInfo.raw._coverImageFilename.match(/.(\w{1,})$/)[1]

                    let rawUserStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:user")
                    let userName = JSON.parse(JSON.parse(rawUserStr).userInfo).name

                    // Date to ID
                    let date = new Date()
                    let dateArray = [date.getFullYear().toString().padStart(4, "0"), (date.getMonth() + 1).toString().padStart(2, "0"), date.getDate().toString().padStart(2, "0"),
                    date.getHours().toString().padStart(2, "0"), date.getMinutes().toString().padStart(2, "0"),
                    date.getSeconds().toString().padStart(2, "0") + date.getMilliseconds().toString().padStart(3, "0") + (Math.floor(Math.random() * Math.pow(10, 11))).toString().padStart(11, "0")]
                    let id = dateArray.join("_")

                    let selectedDifficulty = "Easy"

                    // Apply Info
                    let cipherMapInfo = {
                        id,
                        officialId: "",
                        name: "[" + pagePar.id + "]" + beatsaverInfo.raw._songName,
                        // subName: beatsaverInfo.raw._songSubName,
                        artistName: beatsaverInfo.raw._songAuthorName,
                        mapAuthorName: userName + ((pagePar.mode === "all") ? (" & " + beatsaverInfo.raw._levelAuthorName) : ""),
                        bpm: beatsaverInfo.raw._beatsPerMinute,
                        offset: beatsaverInfo.raw._songTimeOffset,
                        // swingAmount: 0,
                        // swingPeriod: 0.5,
                        previewStartTime: beatsaverInfo.raw._previewStartTime,
                        previewDuration: beatsaverInfo.raw._previewDuration,
                        songFilename: id + "_song.ogg",
                        songDuration: await Utils.getOggDuration(oggBlob),
                        coverArtFilename: id + "_cover." + coverType,
                        environment: "DefaultEnvironment",
                        selectedDifficulty,
                        difficultiesRingById: {
                            Easy: {
                                id: "Easy",
                                noteJumpSpeed: 10,
                                calories: 3000,
                                startBeatOffset: 0,
                                customLabel: "",
                                ringNoteJumpSpeed: 10,
                                ringNoteStartBeatOffset: 0
                            },
                            Normal: {
                                id: "Normal",
                                noteJumpSpeed: 10,
                                calories: 4000,
                                startBeatOffset: 0,
                                customLabel: "",
                                ringNoteJumpSpeed: 10,
                                ringNoteStartBeatOffset: 0
                            },
                            Hard: {
                                id: "Hard",
                                noteJumpSpeed: 12,
                                calories: 4500,
                                startBeatOffset: 0,
                                customLabel: "",
                                ringNoteJumpSpeed: 12,
                                ringNoteStartBeatOffset: 0
                            },
                            Expert: {
                                id: "Expert",
                                noteJumpSpeed: 15,
                                calories: 5000,
                                startBeatOffset: 0,
                                customLabel: "",
                                ringNoteJumpSpeed: 15,
                                ringNoteStartBeatOffset: 0
                            }
                        },
                        createdAt: Date.now(),
                        lastOpenedAt: Date.now(),
                        // demo: false,
                        modSettings: {
                            customColors: {
                                isEnabled: false,
                                colorLeft: "#f21212",
                                colorLeftOverdrive: 0,
                                colorRight: "#006cff",
                                colorRightOverdrive: 0,
                                envColorLeft: "#FFDD55",
                                envColorLeftOverdrive: 0,
                                envColorRight: "#00FFCC",
                                envColorRightOverdrive: 0,
                                obstacleColor: "#f21212",
                                obstacleColorOverdrive: 0,
                                obstacle2Color: "#d500f9",
                                obstacleColorOverdrive2: 0
                            },
                            mappingExtensions: {
                                isEnabled: false,
                                numRows: 3,
                                numCols: 4,
                                colWidth: 1,
                                rowHeight: 1
                            }
                        },
                        // enabledFastWalls: false,
                        // enabledLightshow: false,
                    }

                    // Apply Difficulty Info
                    if (pagePar.mode === "song") {
                        delete cipherMapInfo.difficultiesRingById.Normal
                        delete cipherMapInfo.difficultiesRingById.Hard
                        delete cipherMapInfo.difficultiesRingById.Expert
                    } else if (pagePar.mode === "all") {
                        let tarDiffList = ["Easy", "Normal", "Hard", "Expert", "ExpertPlus"]
                        let diffMap = {}
                        for (let i = beatsaverInfo.difficulties.length - 1; i >= 0; i--) {
                            let difficultyInfo = beatsaverInfo.difficulties[i]
                            let difficulty = difficultyInfo.difficulty
                            if (difficulty === "ExpertPlus") difficulty = "Expert"
                            cipherMapInfo.selectedDifficulty = selectedDifficulty = difficulty
                            if (!diffMap.hasOwnProperty(difficulty)) {
                                diffMap[difficulty] = beatsaverInfo.difficulties[i].file
                            } else {
                                let index = tarDiffList.indexOf(difficulty) - 1
                                if (index < 0) continue
                                diffMap[tarDiffList[index]] = beatsaverInfo.difficulties[i].file
                            }
                        }
                        let rawDiffList = ["Easy", "Normal", "Hard", "Expert"]
                        for (let i = 0; i < rawDiffList.length; i++) {
                            let difficulty = rawDiffList[i]
                            if (!diffMap.hasOwnProperty(difficulty))
                                delete cipherMapInfo.difficultiesRingById[difficulty]
                        }
                        for (let difficulty in diffMap) {
                            let datKey = id + "_" + difficulty + "_Ring.dat"
                            let diffDatInfo = JSON.parse("{\"_version\":\"2.3.0\",\"_events\":[],\"_notes\":[],\"_ringNotes\":[],\"_obstacles\":[],\"_customData\":{\"_bookmarks\":[]}}")
                            let difficultyInfo = JSON.parse(await diffMap[difficulty].async("string"))
                            let changeInfo = this.convertBeatMapInfo(difficultyInfo.version || difficultyInfo._version, difficultyInfo, Math.floor(cipherMapInfo.songDuration * (cipherMapInfo.bpm / 60)))
                            diffDatInfo._notes = changeInfo._notes
                            diffDatInfo._obstacles = changeInfo._obstacles
                            await BLITZ_RHYTHM_files.put("keyvaluepairs", datKey, JSON.stringify(diffDatInfo))
                        }
                    }

                    // Create Asset File
                    await BLITZ_RHYTHM_files.put("keyvaluepairs", id + "_song.ogg", oggBlob)
                    await BLITZ_RHYTHM_files.put("keyvaluepairs", id + "_cover." + coverType, coverBlob)

                    // Create Cipher Map
                    let songsStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
                    let songsJson = JSON.parse(songsStr)
                    let songPairs = JSON.parse(songsJson.byId)
                    songPairs[id] = cipherMapInfo
                    songsJson.byId = JSON.stringify(songPairs)
                    await BLITZ_RHYTHM.put("keyvaluepairs", "persist:songs", JSON.stringify(songsJson))

                    // console.log(cipherMapInfo)

                    setTimeout(() => {
                        location.href = "https://cipher-editor-cn.picovr.com/edit/notes?id=" + id + "&difficulty=" + selectedDifficulty + "&mode=Ring"
                    }, 200)
                    return // Dont hide loading
                }
            }
            CipherUtils.hideLoading()
        } catch (e) {
            CipherUtils.hideLoading()
            throw e
        } finally {
            BLITZ_RHYTHM.close()
            BLITZ_RHYTHM_files.close()
        }
    }

    /**
     * 初始化
     */
    async init() {
        await CipherUtils.waitLoading()
        try {
            await this.ApplyPageParmater()
        } catch (error) {
            console.error(error)
            alert("导入谱面时发生错误！可刷新页面重试...")
        }

        let timerFunc = () => {
            CipherUtils.waitLoading().then(() => {
                this.addImportButton()
                setTimeout(timerFunc, 1000)
            })
        }
        timerFunc()
    }
}

class UploadCiphermapExtension {
    constructor() {

    }

    /** @type {Window | undefined} */
    _lzyWindow = undefined
    _ready = false
    _uploadUserInfo = false

    /** @type {{id:number, name:string, timer:number} | undefined} */
    _uploadInfo = undefined

    getLZYWindow() {
        let self = this
        return new Promise(function (resolve, reject) {
            let win = self._lzyWindow
            if (!win || win.closed) {
                win = window.open("https://pc.woozooo.com/mydisk.php", null, "height=720,width=1280,resizable=0,status=0,toolbar=0,menubar=0,location=0,status=0")
                self._lzyWindow = win
                self._ready = false
            }
            if (self._ready) {
                resolve(win)
            } else {
                let handle
                // let timeoutHandle = setTimeout(() => {
                //     clearInterval(handle)
                //     reject("time out")
                //     // win.close()
                // }, 10 * 1000)
                handle = setInterval(() => {
                    if (self._ready) {
                        // clearTimeout(timeoutHandle)
                        clearInterval(handle)
                        resolve(win)
                    } else if (!win || win.closed) {
                        // clearTimeout(timeoutHandle)
                        clearInterval(handle)
                        reject("window close")
                    }
                }, 100)
            }
        })
    }

    /**
     * 关闭蓝奏云窗口
     * @returns 
     */
    closeWindow() {
        if (!this._lzyWindow || this._lzyWindow.closed) return
        this._lzyWindow.close()
    }

    /**
     * 上传当前谱面
     */
    async uploadCiphermap() {
        if (this._uploadInfo) {
            alert("还有未完成的上传任务，请勿频繁操作")
            return
        }
        let mapId = CipherUtils.getNowBeatmapInfo().id
        // 获取谱面信息
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        try {
            let songsStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:songs")
            let songPairs = JSON.parse(JSON.parse(songsStr).byId)
            let mapInfo = songPairs[mapId]
            // console.log(mapInfo)
            // 提交任务
            this._uploadInfo = {
                id: mapId,
                name: mapInfo.name,
                timer: 0
            }
            this._uploadInfo.timer = setTimeout(() => {
                console.warn("获取谱面压缩包失败: 编辑器超时未响应")
                this._uploadInfo = undefined
                alert("获取谱面压缩包失败!")
            }, 5000)
            unsafeWindow.postMessage({ event: "query_ciphermap_zip", id: mapId })
        } catch (err) {
            alert("上传时发生错误: " + err)
            console.error(err)
        } finally {
            BLITZ_RHYTHM.close()
        }
    }

    /**
     * 上传用户信息
     * @returns 
     */
    async uploadUserInfo() {
        // 获取谱面信息
        let BLITZ_RHYTHM = await new WebDB().open("BLITZ_RHYTHM")
        try {
            let userStr = await BLITZ_RHYTHM.get("keyvaluepairs", "persist:user")
            let userInfo = JSON.parse(JSON.parse(userStr).userInfo)
            // 提交任务
            let info = {
                event: "upload_user_info",
                id: userInfo.user_id_str,
                name: userInfo.name,
                avatar: userInfo.avatar_url
            }
            this.getLZYWindow().then(win => {
                win.focus()
                win.postMessage(info, "*")
            }).catch(err => {
                // alert("打开网页超时")
                console.error(err)
            })
        } catch (err) {
            // alert("上传时发生错误: " + err)
            console.error("上传谱师信息时发生错误: ", err)
        } finally {
            BLITZ_RHYTHM.close()
        }
    }

    /**
     * 在歌曲下载页面添加上传按钮
     */
    addUploadButton() {
        let divList = $(".css-1tiz3p0")
        if (divList.length > 0) {
            if ($("#div-upload").length > 0) return
            let divBox = $(divList[0]).clone()
            divBox[0].id = "div-upload"
            divBox.find(".css-ujbghi")[0].innerHTML = "上传至网盘"
            divBox.find(".css-1exyu3y")[0].innerHTML = "将当前谱面信息上传至蓝奏云网盘。"
            divBox.find(".css-1y7rp4x")[0].innerText = "开始上传"
            divBox[0].onclick = e => {
                // this.uploadUserInfo()
                this.uploadCiphermap()
            }
            $(divList[0].parentNode).append(divBox)
        }
    }
    /**
     * 隐藏按钮
     */
    hideUploadButton() {
        $("#div-upload").remove()
    }
    /**
     * 初始化
     */
    async init() {
        // 定时任务
        let timerFunc = () => {
            CipherUtils.waitLoading().then(() => {
                let pageType = CipherUtils.getPageType()
                if (pageType === "download") {
                    this.addUploadButton()
                } else {
                    this.hideUploadButton()
                }
                setTimeout(timerFunc, 1000)
            }).catch(err => {
                console.error(err)
                setTimeout(timerFunc, 1000)
            })
        }
        timerFunc()

        // 监听信息
        window.addEventListener("message", event => {
            /** @type {{event:string}} */
            let data = event.data
            if (!data || !data.event) return

            if (data.event === "result_ciphermap_zip") {
                if (data.code !== 0 || !this._uploadInfo || data.data.id !== this._uploadInfo.id) return
                clearTimeout(this._uploadInfo.timer)
                Utils.blobToBase64(data.data.blob).then(base64 => {
                    this.getLZYWindow().then(win => {
                        win.focus()
                        win.postMessage({
                            event: "upload_ciphermap",
                            mapId: this._uploadInfo.id,
                            name: this._uploadInfo.name,
                            base64
                        }, "*")
                        this._uploadInfo = undefined
                    }).catch(err => {
                        // alert("打开网页超时")
                        console.error(err)
                        this._uploadInfo = undefined
                    })
                }).catch(err => {
                    console.error("转换文件格式时出错:", err)
                    alert("转换文件格式时出错!")
                })
            }
        })
    }
}

class BeatSageExtension {
    constructor() {

    }

    async importFromBeatSage() {
        let flag = confirm("1.本功能由BeatSage网站免费提供, BeatSage拥有该功能的所有权。\r\n2.因服务器在境外, 速度与网络环境相关, 一般编谱需要2分钟时间。\r\n3.AI做谱需要大量服务器算力, 喜欢该功能的欢迎前往BeatSage.com官网进行打赏支持。\r\n4.点击“确认”键继续。")
        if (!flag) return
        let cipherMapInfo = CipherUtils.getNowBeatmapInfo()
        let oggBlob = await CipherUtils.getSongBlob(cipherMapInfo.id)
        let formData = new FormData()
        let rawDiffList = ["Easy", "Normal", "Hard", "Expert"]
        let tarDiffList = ["Normal", "Hard", "Expert", "ExpertPlus"]
        let tarDifficulty = tarDiffList[rawDiffList.indexOf(cipherMapInfo.difficulty)]
        formData.append("audio_file", oggBlob)
        formData.append("audio_metadata_title", "song")
        formData.append("audio_metadata_artist", "auther")
        formData.append("difficulties", tarDifficulty)
        formData.append("modes", "Standard")
        formData.append("events", "DotBlocks")
        formData.append("environment", "DefaultEnvironment")
        formData.append("system_tag", "v2")
        // 发起AI编谱任务
        console.log("正在发起AI编谱任务...")
        let result = await Utils.ajax({
            url: "https://beatsage.com/beatsaber_custom_level_create",
            method: "POST",
            responseType: "json",
            data: formData,
            contentType: false,
            processData: false,
        })
        console.log("歌曲上传成功, 任务ID为: " + result.id)
        let reqUrl = "https://beatsage.com/beatsaber_custom_level_heartbeat/" + result.id
        let downloadUrl = "https://beatsage.com/beatsaber_custom_level_download/" + result.id
        // 定时查询是否完成
        let taskDone = false
        console.log("正在确认任务进度...")
        while (!taskDone) {
            await new Promise((resolve, _) => {
                setTimeout(resolve, 5 * 1000)
            })
            let result = await Utils.ajax({
                url: reqUrl,
                method: "GET",
                responseType: "json"
            })
            if (result.status !== "PENDING") {
                if (result.status === "DONE") {
                    console.log("谱面生成完成, 开始下载文件...")
                    let beatmapZip = await Utils.downloadZipFile(downloadUrl, () => { })
                    // 导入谱面
                    await new ImportBeatmapExtension().importBeatmap(beatmapZip, cipherMapInfo, 1)
                } else {
                    console.log("发生未知错误: " + result.status)
                    throw "Task Failed: " + result.status
                }
                taskDone = true
            } else {
                console.log("谱面正在生成...")
            }
        }
    }

    /**
     * 在顶部菜单添加导入按钮
     */
    addImportButton() {
        if ($("#btnBeatSage").length > 0) return
        let btnsBoxList = $(".css-4e93fo")
        if (btnsBoxList.length == 0) return
        // 按钮模板
        let btnTemp = $(btnsBoxList[0].childNodes[1])
        // 按钮1
        let btnBeatSage = btnTemp.clone()[0]
        btnBeatSage.id = "btnBeatSage"
        btnBeatSage.innerHTML = "AI编谱 (BeatSage)"
        btnBeatSage.onclick = () => {
            CipherUtils.showLoading()
            this.importFromBeatSage().catch(err => {
                console.error(err)
                alert("AI编谱时发生错误! 详情请查看Console")
            }).finally(() => {
                CipherUtils.hideLoading()
            })
        }
        btnBeatSage.style["font-size"] = "13px"
        // 添加
        btnsBoxList[0].prepend(btnBeatSage)
    }

    /**
     * 初始化
     */
    async init() {
        let timerFunc = () => {
            CipherUtils.waitLoading().then(() => {
                this.addImportButton()
                setTimeout(timerFunc, 1000)
            }).catch(err => {
                console.error(err)
                setTimeout(timerFunc, 1000)
            })
        }
        timerFunc()
    }
}

// ============================================================================== 其他网站 ==============================================================================

class WooZoooHelper {

    /** @type {number} 谱面存放目录ID */
    mapFolderId = -1
    FILE_ID = 0

    constructor() {

    }

    /**
     * 获取文件夹列表
     * @param {number} folderId 目录ID
     * @returns
     */
    async get_folder_list(folderId = -1) {
        let formData = new FormData()
        formData.append("task", 47)
        formData.append("folder_id", folderId)
        let result = await Utils.ajax({
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            url: "/doupload.php",
            data: formData
        })
        return result.text || []
    }

    /**
     * 创建文件夹
     * @param {string} name 文件夹名称
     * @param {string} description 文件夹描述
     * @param {number | undefined} parentId 文件夹ID
     * @returns 
     */
    async create_folder(name, description = "", parentId = 0) {
        let formData = new FormData()
        formData.append("task", 2)
        formData.append("parent_id", parentId)
        formData.append("folder_name", name)
        formData.append("folder_description", description)

        let result = await Utils.ajax({
            url: "/doupload.php",
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            data: formData
        })
        return { folderId: result.text }
    }

    /**
     * 获取/创建谱面存放目录
     */
    async getCiphermapFolderId() {
        // 查找现有文件夹
        let folderList = await this.get_folder_list(-1)
        for (let i in folderList) {
            let info = folderList[i]
            if (info.name === "Ciphermaps")
                return info.fol_id
        }
        // 如果没找到，就新建一个
        let folderInfo = await this.create_folder("Ciphermaps", "闪韵灵境 谱面")
        return folderInfo.folderId
    }

    /**
     * 上传文件
     * @param {File} file 文件
     * @param {number | undefined} folderId 文件夹ID
     * @returns 
     */
    async upload_file(file, folderId = -1) {
        let formData = new FormData()
        formData.append("task", 1)
        formData.append("vie", 2)
        formData.append("ve", 2)
        formData.append("id", "WU_FILE_" + this.FILE_ID++)
        formData.append("name", file.name)
        formData.append("type", file.type)
        formData.append("lastModifiedDate", new Date(file.lastModified).toString())
        formData.append("size", file.size)
        formData.append("folder_id_bb_n", folderId)
        formData.append("upload_file", file)

        let result = await Utils.ajax({
            url: "/html5up.php",
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            data: formData
        })
        let info = result.text[0]
        return ({
            id: info.id,
            f_id: info.f_id
        })
    }

    /**
     * 获取文件描述
     * @param {number} fileId 文件ID
     * @returns
     */
    async get_file_description(fileId) {
        let formData = new FormData()
        formData.append("task", 12)
        formData.append("file_id", fileId)

        let result = await Utils.ajax({
            url: "/doupload.php",
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            data: formData
        })
        return result.info
    }

    /**
     * 设置文件描述
     * @param {number} fileId 文件ID
     * @param {string} description 文件描述
     * @returns
     */
    async set_file_description(fileId, description) {
        let formData = new FormData()
        formData.append("task", 11)
        formData.append("file_id", fileId)
        formData.append("desc", description)

        let result = await Utils.ajax({
            url: "/doupload.php",
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            data: formData
        })
        return result.info
    }

    /**
     * 删除指定文件
     * @param {number} fileId 文件ID
     * @returns
     */
    async delete_file(fileId) {
        let formData = new FormData()
        formData.append("task", 6)
        formData.append("file_id", fileId)

        let result = await Utils.ajax({
            url: "/doupload.php",
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            data: formData
        })
    }

    /**
     * 获取API校验码
     * @returns 
     */
    get_vei() {
        return $("#mainframe")[0].contentDocument.body.innerHTML.match(/'vei':'(\S{1,})\'/)[1]
    }

    /**
     * 获取用户ID
     */
    get_uid() {
        return $("#mainframe")[0].contentDocument.body.innerHTML.match(/uid=(\d{1,})/)[1]
    }

    /**
     * 获取文件列表
     * @param {number} folderId 目录ID
     * @returns
     */
    async get_file_list(folderId = -1) {
        let formData = new FormData()
        formData.append("pg", 1)
        formData.append("vei", this.get_vei())
        formData.append("task", 5)
        formData.append("folder_id", folderId)
        let result = await Utils.ajax({
            method: "POST",
            responseType: "json",
            contentType: false,
            processData: false,
            url: "/doupload.php?uid=" + this.get_uid(),
            data: formData
        })
        return result.text || []
    }

    /**
     * 移除相同ID的文件
     */
    async removeSameFile() {
        let fileList = await this.get_file_list(this.mapFolderId)
        let ids = []
        let names = []
        for (let i = 0; i < fileList.length; i++) {
            let fileInfo = fileList[i]
            let fileName = fileInfo.name_all
            let fileId = fileInfo.id
            // 删除同名旧文件
            if (names.indexOf(fileName) >= 0) {
                console.log("delete file:", fileName, fileId)
                await this.delete_file(fileId)
                return
            }
            // 删除同备注旧文件
            let mapId = await this.get_file_description(fileId)
            if (ids.indexOf(mapId) >= 0) {
                console.log("delete file:", fileName, fileId)
                await this.delete_file(fileId)
                return
            }
            // 如果是新文件
            ids.push(mapId)
            names.push(fileName)
        }
    }

    /**
     * 上传谱面
     * @param {{base64:string, name:string, mapId:string}} info
     */
    async updateCiphermap(info) {
        let file = Utils.base64toFile(info.base64, info.name)
        // file.type = "application/x-zip-compressed"
        let { id, f_id } = await this.upload_file(file, this.mapFolderId)
        await this.set_file_description(id, info.mapId)
        await this.removeSameFile()
    }

    /**
     * 上传用户信息
     * @param {{id:string, name:string, avatar:string}} info 
     */
    async uploadUserInfo(info) {
        let file = new File([JSON.stringify(info)], "user.txt", {
            type: "text/plain;charset=utf-8"
        })
        let { id, f_id } = await this.upload_file(file, this.mapFolderId)
        await this.set_file_description(id, "User Info")
        await this.removeSameFile()
    }

    /**
     * 初始化
     */
    async init() {
        this.mapFolderId = await this.getCiphermapFolderId()
        // 监听信息
        window.addEventListener("message", event => {
            /** @type {{event:string}} */
            let data = event.data
            if (!data || !data.event) return
            if (data.event === "upload_ciphermap") {
                this.updateCiphermap(data).then(() => {
                    alert("上传成功")
                }).catch(err => {
                    console.error(err)
                    alert("上传失败：" + err)
                })
            } else if (data.event === "upload_user_info") {
                delete data.event
                this.uploadUserInfo(data).then(() => {
                    console.log("上传用户信息成功", data)
                }).catch(err => {
                    console.error("上传用户信息失败：", err)
                })
            }
        })
        // 完成
        window.opener.postMessage({ event: "alive" }, "*")
    }
}

class BeatsaverHelper {

    constructor() {

    }

    /**
     * 添加导入按钮
     */
    addImportButton() {
        // 首页
        let mapInfoList = $(".beatmap")
        let logoStr = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARZSURBVHgBzVVbbFRVFF373nm0My3TB0X6UGsEtUKjYEqJgBFjiB8+Eg1GUakfxA/jI/qjxhiqiVjQgNiQ2Nhq4kclhQCtEcWGYMSkApaQ1Ja+EttSWlv6yNB5dGbuPdt9h5lJZxin+GPYycrknFlnr7sf52zgfzDCfzT7Pl5revAUSlEEOxzqKgKYxoCT8WNoBw3GebZjDDA2Fc6Y+TcsYmvmR8wSPsCluAfL5JjT2hRoAkMwLhhAB2bxNcqwktz8nHbIKHAcDdVkdHz1+balYNZwxNyLM4rRIxgVzDJjXmAIlIBTcEU4bweHUBZYlzFdvDNQxnlzP/VPjJ28t7qyRhVqHuTJHx5BjhxzWbmLRbLQy5ikaXfwPNrCz2Aof8ja0tMKtLCOIns7LXffvxS51ZOBme5zLlcJXDFvTNcEUkV6TeATfyM6vTXovmU87i9tJHyY6+DAO/F1eGAu8HiB6m+PZK9CJNQLpUwUOSqw0elEiRb1QhcMpvrgp6op910Q8UJ/2nUCdeyRQy9BySIGR3mu6/suz2/4I/IAXs29DxfDa3DaV4kT/uNSH9DJCBp+jrBJM8OpAmkj4Xp+BcVoSPpnEn04hgfpBM0k9mpZcs3OUjJ+PZxjq6q6jQh/+sfwobuMsEgk0pYboxGYMYQFPnyZJGB9jFs61013DS+z51fdKgKW2zJXMbZPP5nq8nqRECoTAhasO3Ap4k0S+Jgt8S0oQJt03MoE10WkCjxrM4q0bG3ReZ4Lk0Qs0ynpQjV3Nudj1jwqH1CexBVtLcdWmVGkZ1UPIyJUIxaBETt8u+0h3m7WxXnburd5YeqfY0QhiWtBl/gyidTW1ioKy8MQkcVChKWSA3ghQSyWqvWhVo5fiNZsIVcDZxSxzBxVXVLouHO5wdLFTaqXOrRNcQ79Iq23RhiEI2lEJhYVIQ+dNYclR35ZjABTrWb7XJ9vg7TlUJzD0r5yWQlZWBF1HIohGE11x6IiGmmNBhlXWKgHpE0r9+pm3jdLDHwXy8IXjBcd8juHOyX/jyYEQrHIFX5fPJI3EdS9zt1vSHJefx+YqMJjVI5WYa5AhyKJIOugC5tDo0adGlUlSSIK5/ERzqb6tCWtpthKU4ljP7ZwDqItGZ0b1XgYl2VaTMmAWs1Ok6BvDen9B7vCfidsbt2jW11lSi13UZpnJfEK2wIyGiKokAb8QZ7x9VGBOF3FxLLl3dUlJqlDvweFpo/61l3yLdOzdQjqaRftQxqLpkubj3rbgHyclnRUJDUhpyB+KgvYc4fKyx5x78fd+ApevId/M1dDCFqQX6MpFcIZQ+GU4LJMtpBMOFMQEQT42jS09i8KTpmMPcYkng3uYGJNhmHGMU4i8kGQsZP/No7DZ7bCoUVQpD2N5fYnUKwRCjUrqSTV4OgNH2QTo2jCuP8zHPIM4gaM7C9710ds+l9ozEm+RG95C6CyNkvXrNaIchXTLObRCRU8h2+XTONms38AWqb3YtH4f5MAAAAASUVORK5CYII=" width="15px" height="15px">'
        if (mapInfoList && mapInfoList.length > 0) {
            for (let a = 0; a < mapInfoList.length; a++) {
                let mapInfoNode = mapInfoList[a]
                let linkBoxs = $(mapInfoNode).find(".links")
                if (!linkBoxs || linkBoxs.length != 1) continue
                let link2 = linkBoxs.clone()[0]
                $(link2).insertAfter(linkBoxs[0])
                let btnList = $(link2).find("a")

                let btnImport = $(btnList[2]).clone()[0]
                let url = "https://cipher-editor-cn.picovr.com/?import=beatsaver@" + btnImport.href.match(/^beatsaver:\/\/(\w{1,})$/)[1]
                btnImport.ariaLabel = btnImport.title = "导入到闪韵灵境谱面编辑器（仅歌曲）"
                btnImport.href = url + "@song"
                btnImport.target = "_blank"
                $(btnImport).empty()
                $(btnImport).append(logoStr)

                let btnImportAll = $(btnImport).clone()[0]
                btnImportAll.href = url + "@all"
                btnImportAll.target = "_blank"
                btnImportAll.ariaLabel = btnImportAll.title = "导入到闪韵灵境谱面编辑器（含音符）"
                $(btnImportAll).empty()
                $(btnImportAll).append(logoStr)

                btnList.remove()
                link2.append(btnImport)
                link2.append(btnImportAll)
            }
        }
        // 歌曲详情页
        let btnBoxList = $(".ms-auto")
        let btnList = btnBoxList.find("a")
        if (btnList && btnList.length < 5) {
            let url = "https://cipher-editor-cn.picovr.com/?import=beatsaver@" + location.href.match(/^https:\/\/beatsaver\.com\/maps\/(\w{1,})/)[1]
            let btn1 = $('<a href="' + url + '@song" rel="noopener" target="_blank" title="导入到闪韵灵境谱面编辑器（仅歌曲）" aria-label="导入到闪韵灵境谱面编辑器（仅歌曲）"></a>')
            btn1.append(logoStr)
            btnBoxList.append(btn1)
            let btn2 = $('<a href="' + url + '@all" rel="noopener" target="_blank" title="导入到闪韵灵境谱面编辑器（含音符）" aria-label="导入到闪韵灵境谱面编辑器（含音符）"></a>')
            btn2.append(logoStr)
            btnBoxList.append(btn2)
        }
    }

    /**
     * 初始化
     */
    async init() {
        setInterval(this.addImportButton, 500)
    }
}

// ================================================================================ 入口 ================================================================================

/**
 * 谱面编辑器
 */
function initEditor() {
    // 加载拓展
    new SearchSongExtension().init()
    new BeatSageExtension().init()
    new ImportBeatmapExtension().init()

    let uploadEx = new UploadCiphermapExtension()
    uploadEx.init()

    // 监听信息
    window.addEventListener("message", event => {
        /** @type {{event:string}} */
        let data = event.data
        if (!data || !data.event) return
        if (data.event === "alive" && event.origin.indexOf("pc.woozooo.com") > 0) {
            uploadEx._ready = true
            // console.log(event)
        }
    })
    window.addEventListener("beforeunload", () => {
        uploadEx.closeWindow()
    })
}

/**
 * 蓝奏云
 */
function initLZY() {
    if (!window.opener) return
    new WooZoooHelper().init()
}

/**
 * BeatSaver
 */
function initBeatsaver() {
    new BeatsaverHelper().init()
}

/**
 * 主入口
 */
(async function () {
    'use strict';

    if (location.href.indexOf("cipher-editor-cn.picovr.com") > 0) {
        // 依赖库
        const sandBox = SandBox.getDocument()
        await SandBox.dynamicLoadJs("https://cmoyuer.gitee.io/my-resources/js/jszip.min.js")
        JSZip = sandBox.contentWindow.JSZip

        initEditor()
    } else if (location.href.indexOf("pc.woozooo.com/mydisk.php") > 0) {
        initLZY()
    } else if (location.href.indexOf("beatsaver.com") > 0) {
        initBeatsaver()
    }
})()
