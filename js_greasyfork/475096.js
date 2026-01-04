// ==UserScript==
// @name        BlitzRhythm Editor Extra Beatmap Import
// @name:en     Extra Beatmap Import
// @name:zh-CN     闪韵灵境谱面导入扩展
// @namespace   cipher-editor-mod-extra-beatmap-import
// @version     1.1.0
// @description     Import BeatSaber beatmap into the BlitzRhythm editor
// @description:en  Import BeatSaber beatmap into the BlitzRhythm editor
// @description:zh-CN 将BeatSaber谱面导入到闪韵灵境编辑器内
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
// @require     https://greasyfork.org/scripts/473358-jszip/code/main.js?version=1237031
// @require     https://greasyfork.org/scripts/473361-xml-http-request-interceptor/code/main.js
// @require     https://greasyfork.org/scripts/473362-web-indexeddb-helper/code/main.js
// @require     https://greasyfork.org/scripts/474680-blitzrhythm-editor-mod-base-lib/code/main.js
// @downloadURL https://update.greasyfork.org/scripts/475096/BlitzRhythm%20Editor%20Extra%20Beatmap%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/475096/BlitzRhythm%20Editor%20Extra%20Beatmap%20Import.meta.js
// ==/UserScript==

const I18N = {
    en: { // English
        parameter: {
            download_timeout: {
                name: "Download Timeout",
                description: "Timeout for download for beatmap",
            }
        },
        methods: {},
        code: {
            tip: {
                info_file_not_found: "Please check whether the zip file contains the info.dat file!",
                input_bs_url: "Please enter the BeatSaver beatmap URL:",
                url_format_error: "URL format error!",
                not_support_map_ver: "Not support this beatmap version! You can try to recreate the beatmap.",
                not_found_diff: "No available difficulty found for this map!",
                input_diff: "Enter the difficulty level (index) you want to import:\r\n",
                input_index_err: "Please enter the correct index!",
                not_support_bs_ver: "This map version ({0}) is not supported yet, please change the URL and try again!",
                import_map_err: "An error occurred while importing map! You can refresh and try again..."
            },
            button: {
                import_from_url: "Import from BeatSaver URL",
                import_from_file: "Import from BeatSaber zip",
            }
        }
    },
    zh: { // Chinese
        parameter: {
            download_timeout: {
                name: "下载超时",
                description: "下载谱面的超时时间",
            }
        },
        methods: {},
        code: {
            tip: {
                info_file_not_found: "请检查压缩包中是否包含info.dat文件",
                input_bs_url: "请输入BeatSaver铺面链接",
                url_format_error: "链接格式错误！",
                not_support_map_ver: "插件不支持该谱面版本！可尝试重新创建谱面",
                not_found_diff: "该谱面找不到可用的难度",
                input_diff: "请问要导入第几个难度（数字）：\r\n",
                input_index_err: "请输入准确的序号！",
                not_support_bs_ver: "暂不支持该谱面的版本（{0}），请换个链接再试！",
                import_map_err: "导入谱面时发生错误！可刷新页面重试..."
            },
            button: {
                import_from_url: "导入谱面 BeatSaver链接",
                import_from_file: "导入谱面 BeatSaber压缩包",
            }
        }
    }
}

const PARAMETER = [
    {
        id: "download_timeout",
        name: $t("parameter.download_timeout.name"),
        description: $t("parameter.download_timeout.description"),
        type: "number",
        default: 60 * 1000,
        min: 1000,
        max: 2 * 60 * 1000
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
        if (!infoFile) throw $t("code.tip.info_file_not_found")
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
            let reader = new FileReader()
            reader.onerror = () => {
                reject(reader.error)
            }
            reader.onload = (e) => {
                let audio = document.createElement('audio')
                audio.addEventListener("loadedmetadata", () => {
                    resolve(audio.duration)
                    $(audio).remove()
                })
                audio.addEventListener('error', () => {
                    reject(audio.error)
                    $(audio).remove()
                })
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
}

// =====================================================================================

/**
 * 在顶部菜单添加导入按钮
 */
function addImportButton() {
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
    btnImportBs.innerHTML = $t("code.button.import_from_url")
    btnImportBs.onclick = importFromBeatSaver
    btnImportBs.style["font-size"] = "13px"
    div.append(btnImportBs)
    // 按钮2
    let btnImportZip = btnTemp.clone()[0]
    btnImportZip.id = "importBeatmap"
    btnImportZip.innerHTML = $t("code.button.import_from_file")
    btnImportZip.onclick = importFromBeatmapZip
    btnImportZip.style["margin-left"] = "5px"
    btnImportZip.style["font-size"] = "13px"
    div.append(btnImportZip)
    // 添加
    btnsBoxList[0].prepend(div)
}

async function importFromBeatSaver() {
    try {
        // 获取当前谱面信息
        let nowBeatmapInfo = CipherUtils.getNowBeatmapInfo()

        // 获取谱面信息
        let url = prompt($t("code.tip.input_bs_url"), "https://beatsaver.com/maps/" + nowBeatmapInfo.beatsaverId)
        if (!url) return
        let result = url.match(/^https:\/\/beatsaver.com\/maps\/(\S*)$/)
        if (!result) {
            alert($t("code.tip.url_format_error"))
            return
        }
        CipherUtils.showLoading()
        let downloadUrl = await BeatSaverUtils.getDownloadUrl(result[1])
        let zipBlob = await Utils.downloadZipFile(downloadUrl)
        await importBeatmap(zipBlob, nowBeatmapInfo)
    } catch (err) {
        console.error(err)
        alert("Import Failed: " + err)
        CipherUtils.hideLoading()
    }
}

/**
 * 通过压缩文件导入
 */
function importFromBeatmapZip() {
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
            importBeatmap(new Blob([file]), nowBeatmapInfo).catch(err => {
                CipherUtils.hideLoading()
                console.error(err)
                alert("Import Failed: " + err)
            })
        })
        // 点击按钮
        document.body.append(fileSelect)
        fileSelect.click()
        fileSelect.remove()
    } catch (err) {
        alert("Import Failed: " + err)
    }
}

/**
 * 从BeatSaber谱面压缩包导入信息
 * @param {Blob} zipBlob
 * @param {{id:string, difficulty:string, beatsaverId:string}} nowBeatmapInfo
 * @param {number} targetDifficulty
 */
async function importBeatmap(zipBlob, nowBeatmapInfo, targetDifficulty) {
    let BLITZ_RHYTHM = await WebDB.open("BLITZ_RHYTHM")
    let BLITZ_RHYTHM_files = await WebDB.open("BLITZ_RHYTHM-files")
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
            throw $t("code.tip.not_support_map_ver")
        let beatmapInfo = await BeatSaverUtils.getBeatmapInfo(zipBlob)
        if (beatmapInfo.difficulties.length == 0)
            throw $t("code.tip.not_found_diff")

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
                difficulty = prompt($t("code.tip.input_diff") + promptTip, defaultDifficulty)
                if (!difficulty) {
                    // Cancel
                    CipherUtils.hideLoading()
                    return
                }
                if (/^\d$/.test(difficulty)) {
                    tarDifficulty = parseInt(difficulty)
                    if (tarDifficulty > 0 && tarDifficulty <= beatmapInfo.difficulties.length) break
                }
                alert($t("code.tip.input_index_err"))
            }
        }
        // 开始导入
        let difficultyInfo = JSON.parse(await beatmapInfo.difficulties[tarDifficulty - 1].file.async("string"))
        let changeInfo = convertBeatMapInfo(difficultyInfo.version || difficultyInfo._version, difficultyInfo, songDuration)
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
function convertBeatMapInfo(version, rawInfo, songDuration) {
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
        throw $t("code.tip.not_support_bs_ver", version)
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

async function ApplyPageParmater() {
    let BLITZ_RHYTHM = await WebDB.open("BLITZ_RHYTHM")
    let BLITZ_RHYTHM_files = await WebDB.open("BLITZ_RHYTHM-files")
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
                        let changeInfo = convertBeatMapInfo(difficultyInfo.version || difficultyInfo._version, difficultyInfo, Math.floor(cipherMapInfo.songDuration * (cipherMapInfo.bpm / 60)))
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
 * 定时任务 1s
 */
function tick() {
    addImportButton()
}

(function () {
    'use strict'

    // Import beatmap via url parameter
    ApplyPageParmater().catch(res => {
        console.error(res)
        alert($t("code.tip.import_map_err"))
    })
})()
