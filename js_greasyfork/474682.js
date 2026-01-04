// ==UserScript==
// @name        BlitzRhythm Editor Extra Song Search
// @name:en     Extra Song Search
// @name:zh-CN     闪韵灵境歌曲搜索扩展
// @namespace   cipher-editor-mod-extra-song-search
// @version     1.1.1
// @description     Search for more songs from other websites
// @description:en  Search for more songs from other websites
// @description:zh-CN  通过其他网站搜索更多的歌曲
// @author      Moyuer
// @author:zh-CN   如梦Nya
// @source      https://github.com/CMoyuer/BlitzRhythm-Editor-Mod-Loader
// @license     MIT
// @run-at      document-body
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @connect     beatsaver.com
// @match       https://cipher-editor-cn.picovr.com/*
// @match       https://cipher-editor-va.picovr.com/*
// @icon        https://cipher-editor-va.picovr.com/favicon.ico
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://greasyfork.org/scripts/473358-jszip/code/main.js
// @require     https://greasyfork.org/scripts/473361-xml-http-request-interceptor/code/main.js
// @require     https://greasyfork.org/scripts/473362-web-indexeddb-helper/code/main.js
// @require     https://greasyfork.org/scripts/474680-blitzrhythm-editor-mod-base-lib/code/main.js
// @downloadURL https://update.greasyfork.org/scripts/474682/BlitzRhythm%20Editor%20Extra%20Song%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/474682/BlitzRhythm%20Editor%20Extra%20Song%20Search.meta.js
// ==/UserScript==

const I18N = {
    en: { // English
        parameter: {
            search_page_sum: {
                name: "Search Page Count",
                description: "Number of pages searched from BeatSaver at one time",
            },
            search_timeout: {
                name: "Search Timeout",
                description: "Timeout for searching for songs",
            }
        },
        methods: {
            // test: {
            //     name: "Test",
            //     description: "Just a test button",
            // },
        },
        code: {
            search: {
                fail: "Search song failed!",
                tip_timeout: "It seems that the search has timed out. Do you need to modify the timeout parameter?"
            },
            convert: {
                title: "Convert To Custom Beatmap",
                description: "Convert official beatmaps to custom beatmaps to export beatmap with ogg file.",
                btn_name: "Start Convert",
                tip_failed: "Conversion failed, please refresh and try again!"
            }
        }
    },
    zh: { // Chinese
        parameter: {
            search_page_sum: {
                name: "搜索页面数量",
                description: "每次从BeatSaver搜索歌曲的页数，页数越多速度越慢",
            },
            search_timeout: {
                name: "搜索超时",
                description: "搜索歌曲的超时时间",
            }
        },
        methods: {
            // test: {
            //     name: "测试",
            //     description: "只是一个测试按钮",
            // },
        },
        code: {
            search: {
                fail: "搜索歌曲失败！",
                tip_timeout: "看来搜索超时了, 是否需要修改超时时间?"
            },
            convert: {
                title: "转换为自定义谱面",
                description: "将官方谱面转换为自定义谱面, 以导出带有Ogg文件的完整谱面压缩包。",
                btn_name: "开始转换谱面",
                tip_failed: "转换谱面失败，请刷新再试！"
            }
        }
    }
}

const PARAMETER = [
    {
        id: "search_page_sum",
        name: $t("parameter.search_page_sum.name"),
        description: $t("parameter.search_page_sum.description"),
        type: "number",
        default: 1,
        min: 1,
        max: 10
    },
    {
        id: "search_timeout",
        name: $t("parameter.search_timeout.name"),
        description: $t("parameter.search_timeout.description"),
        type: "number",
        default: 10 * 1000,
        min: 1000,
        max: 20 * 1000
    }
]

const METHODS = [
    // {
    //     name: $t("methods.test.name"),
    //     description: $t("methods.test.description"),
    //     func: () => {
    //         log($t("methods.test.name"))
    //     }
    // }, 
]

let pluginEnabled = false
let timerHandle = 0

function onEnabled() {
    pluginEnabled = true
    let timerFunc = () => {
        if (!pluginEnabled) return
        CipherUtils.waitLoading().then(() => {
            tick()
        }).catch(err => {
            console.error(err)
        }).finally(() => {
            timerHandle = setTimeout(timerFunc, 250)
        })
    }
    timerFunc()
}

function onDisabled() {
    if (timerHandle > 0) {
        clearTimeout(timerHandle)
        timerHandle = 0
    }
    pluginEnabled = false
    searchFromBeatSaver = false
}

function onParameterValueChanged(id, val) {
    log("onParameterValueChanged", id, val)
    // log("debug", $p(id))
}

// =====================================================================================

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
    static showIframe(src) {
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
            let timeoutCount = 0

            let beatsaverMappingStr = localStorage.getItem("BeatSaverMapping")
            let beatSaverMapping = beatsaverMappingStr ? JSON.parse(beatsaverMappingStr) : {
                mapping: {}
            }

            let funDone = () => {
                if (++count != pageCount) return
                cbFlag = true
                resolve({ songList, songInfoMap })
                if (timeoutCount > 0) {
                    let flag = confirm($t("code.search.tip_timeout"))
                    if (flag) showSetupPage()
                }
            }
            let funSuccess = data => {
                // 填充数据
                data.docs.forEach(rawInfo => {
                    let artist = rawInfo.metadata.songAuthorName
                    let bpm = rawInfo.metadata.bpm
                    let cover = rawInfo.versions[0].coverURL
                    let song_name = "[" + rawInfo.id + "]" + rawInfo.metadata.songName
                    let id = beatSaverMapping.mapping[rawInfo.id]
                    if (typeof id !== "number")
                        id = 80000000000 + parseInt(rawInfo.id, 36)
                    songList.push({ artist, bpm, cover, song_name, id })
                    let downloadURL = rawInfo.versions[0].downloadURL
                    let previewURL = rawInfo.versions[0].previewURL
                    songInfoMap[id] = { rawInfo, downloadURL, previewURL }
                })
                funDone()
            }
            let funFail = res => {
                if (res[0] === "timeout") timeoutCount++
                funDone()
            }
            for (let i = 0; i < pageCount; i++) {
                Utils.ajax({
                    url: "https://api.beatsaver.com/search/text/" + i + "?sortOrder=Relevance&q=" + searchKey,
                    method: "GET",
                    responseType: "json",
                    timeout: $p("search_timeout")
                }).then(funSuccess).catch(funFail)
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
            config.onerror = (...data) => {
                reject(["error", ...data])
            }
            config.ontimeout = (...data) => {
                reject(["timeout", ...data])
            }
            GM_xmlhttpRequest(config)
        })
    }
}

// =====================================================================================

let searchFromBeatSaver = false
let songInfoMap = {}
let lastPageType = "other"

// 加载XHR拦截器
function initXHRIntercept() {
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
        if (!url || !searchFromBeatSaver) return
        if (url.startsWith("/song/staticList")) {
            // 获取歌曲列表
            let result = decodeURI(url).match(/songName=(\S*)&/)
            let key = ""
            if (result) key = result[1].replace("+", " ")
            CipherUtils.showLoading()
            BeatSaverUtils.searchSongList(key, $p("search_page_sum")).then(res => {
                self.extraSongList = res.songList
                songInfoMap = res.songInfoMap
                complete()
            }).catch(err => {
                alert($t("code.search.fail"))
                console.error(err)
                self.extraSongList = []
                complete()
            }).finally(() => {
                CipherUtils.hideLoading()
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
                    fixSongListStyle()
                    addPreviewFunc()
                }, 200)
            });
            return true
        } else if (url.startsWith("/beatsaver/")) {
            let _onprogress = self.onprogress
            self.onprogress = undefined

            // 从BeatSaver下载歌曲
            let result = decodeURI(url).match(/\d{1,}/)
            let id = parseInt(result[0])
            BeatSaverUtils.downloadSongFile(songInfoMap[id].downloadURL, _onprogress).then(oggBlob => {
                songInfoMap[id].ogg = oggBlob
                saveBeatSaverMapping(id, songInfoMap[id].rawInfo)
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
                this.response = songInfoMap[id].ogg
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
    xhrIntercept.onSend(onSend)
}

// Save BeatSaver Info
function saveBeatSaverMapping(id, rawInfo) {
    let beatsaverMappingStr = localStorage.getItem("BeatSaverMapping")
    let beatSaverMapping = beatsaverMappingStr ? JSON.parse(beatsaverMappingStr) : {}
    if (!beatSaverMapping.mapping) beatSaverMapping.mapping = {}
    beatSaverMapping.mapping[rawInfo.id] = id
    localStorage.setItem("BeatSaverMapping", JSON.stringify(beatSaverMapping))
}

/**
 * 更新数据库
 * @param {Boolean} isForce 强制转换
 * @returns 
 */
async function updateDatabase(isForce) {
    let BLITZ_RHYTHM = await WebDB.open("BLITZ_RHYTHM")
    let BLITZ_RHYTHM_files = await WebDB.open("BLITZ_RHYTHM-files")
    let BLITZ_RHYTHM_official = await WebDB.open("BLITZ_RHYTHM-official")
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

            // Add Source Info
            if (!songInfo.modSettings) songInfo.modSettings = {}
            if (!songInfo.modSettings.source) songInfo.modSettings.source = {}
            try {
                let beatsaverMapping = JSON.parse(localStorage.getItem("BeatSaverMapping") || "{}")
                let mapping = beatsaverMapping.mapping || {}
                for (let bsId in mapping) {
                    if (mapping[bsId] !== officialId) continue
                    songInfo.modSettings.source.beatsaverId = bsId
                    break
                }
            } catch (error) {
                console.error("Add source info failed:", error)
            }
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
function fixSongListStyle() {
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
function addPreviewFunc() {
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
function applySearchButton() {
    let boxList = $(".css-1u8wof2") // 弹窗
    try {
        if (boxList.length == 0) throw "Box not found"
        let searchBoxList = boxList.find(".css-70qvj9")
        if (searchBoxList.length == 0) throw "item too few" // 搜索栏元素数量
        if (searchBoxList[0].childNodes.length >= 3) return // 搜索栏元素数量
    } catch {
        if (searchFromBeatSaver) searchFromBeatSaver = false
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
        searchFromBeatSaver = false
        $("#preview_tip").remove()
    }
    searchBtn.onmousedown = () => {
        searchFromBeatSaver = true
        $(rawSearchBtn).click()
    }
}
/**
 * 添加转换官方谱面的按钮
 * @returns 
 */
async function applyConvertCiphermapButton() {
    let BLITZ_RHYTHM = await WebDB.open("BLITZ_RHYTHM")
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
        divBox.find(".css-ujbghi")[0].innerHTML = $t("code.convert.title")
        divBox.find(".css-1exyu3y")[0].innerHTML = $t("code.convert.description")
        divBox.find(".css-1y7rp4x")[0].innerText = $t("code.convert.btn_name")
        divBox[0].onclick = e => {
            // 更新歌曲信息
            this.updateDatabase(true).then((hasChanged) => {
                if (hasChanged) setTimeout(() => { window.location.reload() }, 1000)
            }).catch(err => {
                console.log("Convert map failed:", err)
                alert($t("code.convert.btn_name"))
            })
        }
        $(divList[0].parentNode).append(divBox)
    }
}

/**
 * 隐藏按钮
 */
function hideConvertCiphermapButton() {
    $("#div-custom").remove()
}
/**
 * 定时任务 1s
 */
function tick() {
    let pageType = CipherUtils.getPageType()
    if (pageType !== "home") {
        if (pageType != lastPageType) {
            // 隐藏按钮
            if (pageType !== "download")
                hideConvertCiphermapButton()
            // 更新歌曲信息
            updateDatabase().then((hasChanged) => {
                if (hasChanged) setTimeout(() => { window.location.reload() }, 1000)
            }).catch(err => {
                console.log("Update map info failed:", err)
                alert($t("tip_failed"))
            })
        } else if (pageType === "download") {
            applyConvertCiphermapButton()
        }
    } else {
        applySearchButton()
    }
    lastPageType = pageType
}

(function () {
    'use strict'

    // 初始化XHR拦截器
    initXHRIntercept()
})()
