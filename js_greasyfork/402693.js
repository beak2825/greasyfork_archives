// ==UserScript==
// @name         哔哩哔哩图片打包下载（支持相簿和专栏
// @version      1.3.11
// @description  下载B站UP主Bilibili动态相册相簿图片，以及视频封面，专栏图片和UP主头像以及主页壁纸，直播间封面和直播间壁纸，然后提交给aria2或打包成zip
// @author       Sonic853
// @namespace    https://blog.853lab.com
// @include      https://space.bilibili.com/*
// @include      https://www.bilibili.com/h5/mall/suit/detail*
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://greasyfork.org/scripts/402652-aria2-rpc-edit/code/Aria2%20RPC%20Edit.js?version=971052
// @resource     BiliUI-style  https://cdn.jsdelivr.net/gh/Sonic853/Static_library/BiliUI-style.min.css?t=20200506001
// @run-at       document-end
// @license      MIT License
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/402693/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%AF%E6%8C%81%E7%9B%B8%E7%B0%BF%E5%92%8C%E4%B8%93%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/402693/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%94%AF%E6%8C%81%E7%9B%B8%E7%B0%BF%E5%92%8C%E4%B8%93%E6%A0%8F.meta.js
// ==/UserScript==
// 
// 律师函收到之日，即是我死期到来之时。
// 学写代码学到现在也不过是一枚棋子，随用随弃。
// ：）
// 
// https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id=70335534
// https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid=339679&page_num=0&page_size=541&biz=all
// https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid=339679
(function () {
    'use strict'

    const DEV_Log = Boolean(localStorage.getItem("Dev-853"))
    const localItem = "Lab8A"
    const NAME = "相册下载"
    const Console_log = function (text) {
        let d = new Date().toLocaleTimeString()
        console.log("[" + NAME + "][" + d + "]: " + text)
    }
    const Console_Devlog = function (text) {
        let d = new Date().toLocaleTimeString()
        DEV_Log && (console.log("[" + NAME + "][" + d + "]: " + text))
    }
    const Console_error = function (text) {
        let d = new Date().toLocaleTimeString()
        console.error("[" + NAME + "][" + d + "]: " + text)
    }

    const RList = new class {
        time = 500
        #list = -1
        snooze = ms => new Promise(resolve => setTimeout(resolve, ms))
        async Push() {
            this.#list++
            await this.snooze(this.#list * this.time)
            Promise.resolve().finally(() => {
                setTimeout(() => { this.#list-- }, (this.#list + 1) * this.time)
            })
        }
    }
    if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined' && typeof GM_addStyle === 'undefined') {
        Console_error("GM is no Ready.")
    } else {
        Console_log("GM is Ready.")
    }

    let BLab8A = class {
        constructor() {
            this.data = this.load()
        }
        load() {
            Console_log("正在加载数据")
            if (typeof GM_getValue !== 'undefined') {
                let gdata = JSON.parse(GM_getValue(localItem, "{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}"))
                return gdata
            } else {
                let ldata = JSON.parse(localStorage.getItem(localItem) === null ? "{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}" : localStorage.getItem(localItem))
                return ldata
            }
        }
        save(d) {
            Console_log("正在保存数据")
            d === undefined ? (d = this.data) : (this.data = d)
            typeof GM_getValue != 'undefined' ? GM_setValue(localItem, JSON.stringify(d)) : localStorage.setItem(localItem, JSON.stringify(d))
            return this
        }
        set_aria2Client(d) {
            d === undefined ? (d = this.data) : (this.data = d)
            aria2Client = new Aria2({ host: d.IP, port: d.Port })
        }
    }
    let bLab8A = new BLab8A()
    let aria2Client = new Aria2({ host: bLab8A.data.IP, port: bLab8A.data.Port })
    let addToAria = function (url, filename, referer, cookie, headers, callback, errorcallback) {
        // Console_Devlog(bLab8A.data.dir+(!bLab8A.data.dir.endsWith("\\")?"\\":"")+uFA.uid)
        let ariaParam = {
            dir: bLab8A.data.dir + (!bLab8A.data.dir.endsWith("\\") ? "\\" : "") + uFA.uid,
            out: filename,
            referer: referer || location.href,
            'user-agent': navigator.userAgent,
            header: headers || []
        }

        if (cookie === true) cookie = document.cookie
        cookie && ariaParam.header.push('Cookie: ' + cookie)

        aria2Client.addUri(url, ariaParam, () => {
            Console_Devlog("发送到Aria2成功。")
            callback && callback()
        }, () => {
            lists.Set("发送到Aria2失败。")
            lists.BG("error")
            errorcallback && errorcallback()
        })
    }

    !DEV_Log && GM_addStyle(GM_getResourceText("BiliUI-style"))
    let HTTPsend = function (url, method, Type, successHandler, errorHandler) {
        Console_Devlog(url)
        if (typeof GM_xmlhttpRequest != 'undefined') {
            return new Promise((rl, rj) => {
                try {
                    GM_xmlhttpRequest({
                        method: method,
                        url: url,
                        responseType: Type,
                        onerror: function (response) {
                            Console_Devlog(response.status)
                            errorHandler && errorHandler(response.status)
                            rj(response.status)
                        },
                        onload: function (response) {
                            let status
                            if (response.readyState == 4) { // `DONE`
                                status = response.status
                                if (status == 200) {
                                    Console_Devlog(response.response)
                                    successHandler && successHandler(response.response)
                                    rl(response.response)
                                } else {
                                    Console_Devlog(status)
                                    errorHandler && errorHandler(status)
                                    rj(status)
                                }
                            }
                        },
                    })
                } catch (error) {
                    rj(error)
                }
            })
        } else {
            return new Promise((rl, rj) => {
                try {
                    let xhr = new XMLHttpRequest()
                    xhr.open(method, url, true)
                    xhr.withCredentials = true
                    xhr.responseType = Type
                    xhr.onreadystatechange = function () {
                        let status
                        if (xhr.readyState == 4) { // `DONE`
                            status = xhr.status
                            if (status == 200) {
                                Console_log(xhr.response)
                                successHandler && successHandler(xhr.response)
                                rl(xhr.response)
                            } else {
                                Console_log(status)
                                errorHandler && errorHandler(status)
                                rj(status)
                            }
                        }
                    }
                    xhr.send()
                } catch (error) {
                    rj(error)
                }
            })
        }
    }
    let loadToBlob = function (url, callback) {
        HTTPsend(url, "GET", "blob").then(e => {
            callback && callback(e)
        }).catch(e => {
            callback && callback(false)
        })
        // HTTPsend(url, "GET", "blob", (result) => {
        //     callback && callback(result)
        // }, () => {
        //     callback && callback(false)
        // })
    }
    let removejp14 = function (text, r) {
        text = text.substring(r.length, text.lastIndexOf(')'))
        return text
    }
    let JSON_parse = function (data) {
        let rdata
        try {
            rdata = JSON.parse(data)
        } catch (error) {
            Console_Devlog("JSON已解析，直接跳过")
            rdata = result
        }
        return rdata
    }
    let getType = function (file) {
        let filename = file
        let index1 = filename.lastIndexOf(".")
        let index2 = filename.length
        let type = filename.substring(index1, index2)
        return type
    }
    let getFileName = function (file) {
        let str = file
        str = str.substring(str.lastIndexOf("/") + 1)
        return str
    }
    let MBBtn = function (disabled) {
        document.getElementById("Bili8-UI").getElementsByClassName("MBSendToAria")[0].disabled = !disabled
        document.getElementById("Bili8-UI").getElementsByClassName("MBBlobDown")[0].disabled = !disabled
    }
    let CreactUI = function () {
        if (document.getElementById("Bili8-UI")) {
            lists.Set("加载中。。。")
            lists.BG("normal")
            document.getElementById("Bili8-UI").style.display = "block"
        } else {
            let Panel_ui = document.createElement("div")
            Panel_ui.classList.add("Bili8-UI", "Panel")
            Panel_ui.id = "Bili8-UI"

            let PanelClose_ui = document.createElement("button")
            PanelClose_ui.classList.add("Close")
            PanelClose_ui.innerText = "关闭"

            let MainList_ui = document.createElement("div")
            MainList_ui.classList.add("MainList")

            let List_ui = document.createElement("textarea")
            List_ui.classList.add("List")
            List_ui.readOnly = true
            List_ui.innerText = "加载中。。。"

            let MainBottom_ui = document.createElement("div")
            MainBottom_ui.classList.add("MainBottom")

            let IPInput_ui = document.createElement("input")
            IPInput_ui.title = "[Aria2]设置ip或域名（不带http和https）"
            IPInput_ui.placeholder = "设置ip或域名（不带http和https）"
            IPInput_ui.type = "text"
            IPInput_ui.value = bLab8A.data.IP
            IPInput_ui.classList.add("MBtn", "MBIP")

            let PortInput_ui = document.createElement("input")
            PortInput_ui.title = "[Aria2]设置端口"
            PortInput_ui.placeholder = "设置端口"
            PortInput_ui.type = "number"
            PortInput_ui.min = "1"
            PortInput_ui.max = "65536"
            PortInput_ui.value = bLab8A.data.Port
            PortInput_ui.classList.add("MBtn", "MBPort")

            let DirInput_ui = document.createElement("input")
            DirInput_ui.title = "[Aria2]设置路径"
            DirInput_ui.placeholder = "设置路径"
            DirInput_ui.type = "text"
            DirInput_ui.value = bLab8A.data.dir
            DirInput_ui.classList.add("MBtn", "MBDir")

            let SendToAria_ui = document.createElement("button")
            SendToAria_ui.classList.add("MBtn", "MBSendToAria")
            SendToAria_ui.innerText = "发送到Aria2"
            SendToAria_ui.disabled = true

            let BlobDown_ui = document.createElement("button")
            BlobDown_ui.classList.add("MBtn", "MBBlobDown")
            BlobDown_ui.innerText = "浏览器打包下载"
            BlobDown_ui.title = "将会消耗大量的内存！"
            BlobDown_ui.disabled = true

            Panel_ui.appendChild(PanelClose_ui)
            MainList_ui.appendChild(List_ui)
            Panel_ui.appendChild(MainList_ui)
            MainBottom_ui.appendChild(IPInput_ui)
            MainBottom_ui.appendChild(PortInput_ui)
            MainBottom_ui.appendChild(DirInput_ui)
            MainBottom_ui.appendChild(SendToAria_ui)
            MainBottom_ui.appendChild(BlobDown_ui)
            Panel_ui.appendChild(MainBottom_ui)
            document.body.appendChild(Panel_ui)

            SendToAria_ui.addEventListener("click", () => {
                if (!uFA.DownSend) {
                    bLab8A.data.IP = IPInput_ui.value
                    bLab8A.data.Port = Number(PortInput_ui.value)
                    bLab8A.data.dir = DirInput_ui.value
                    bLab8A.save().set_aria2Client()
                    uFA.indexA = 0
                    uFA.HaveDownFail = false
                    MBBtn(false)
                    lists.BG("running")
                    uFA.send_aria2()
                } else {
                    lists.Set("请求已经发送过去了，请勿重复点击！")
                }
            })
            BlobDown_ui.addEventListener("click", () => {
                if (!uFA.DownSend) {
                    zip = new JSZip()
                    uFA.indexA = 0
                    uFA.HaveDownFail = false
                    MBBtn(false)
                    lists.BG("running")
                    uFA.send_blob()
                } else {
                    lists.Set("请求已经发送过去了，请勿重复点击！")
                }
            })
            PanelClose_ui.addEventListener("click", () => {
                document.getElementById("Bili8-UI").style.display = "none"
            })
        }
    }
    let CreactMenu = function () {
        let Creact_G = function (Mode) {
            uFA.GetOK = false
            uFA.Mode = Mode
            uFA.index = 0
            uFA.all_count = 0
            CreactUI()
            uFA.load_all_count()
            let writeimglist = () => {
                let obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
                lists.Clear(obj)
                lists.Hide(obj)
                let zz = async () => {
                    if (uFA.imglist.length <= 1000) for (let i = 0; i < uFA.imglist.length; i++) {
                        const element = uFA.imglist[i]
                        lists.Add(element.url, obj)
                    }
                    else {
                        lists.Add("图片数量过长，在控制台显示", obj)
                        console.log(uFA.imglist)
                    }
                    MBBtn(true)
                    lists.Show(obj)
                    return
                }
                zz()
                clearInterval(t2)
            }
            let t2 = setInterval(() => {
                let index = uFA.index
                if ((uFA.GetOK || index++ >= uFA.all_count && uFA.all_count != 0) && uFA.Mode != 4) {
                    writeimglist()
                } else if (uFA.GetOK && uFA.Mode == 4 && uFA.index == 999) {
                    writeimglist()
                }
            }, 100)
        }
        if (window.location.href.startsWith("https://www.bilibili.com/h5/mall/suit/detail")) GM_registerMenuCommand("下载主题图片", () => { Creact_G(5) })
        else {
            GM_registerMenuCommand("下载相册", () => { Creact_G(0) })
            GM_registerMenuCommand("下载视频封面", () => { Creact_G(1) })
            GM_registerMenuCommand("下载头像、头图、直播封面、直播壁纸", () => { Creact_G(2) })
            GM_registerMenuCommand("下载专栏图片", () => { Creact_G(4) })
            DEV_Log && GM_registerMenuCommand("下载头衔（开发者用）", () => { Creact_G(3) })
        }
    }
    let BG_Default = [
        "1780c98271ead667b2807127ef807ceb4809c599.png",
        "e7f98439ab7d081c9ab067d248e1780bd8a72ffc.jpg",
        "f49642b3683a08e3190f29d5a095386451f8952c.jpg",
        "cd52d4ac1d336c940cc4958120170f7928d9e606.png",
        "70ce28bcbcb4b7d0b4f644b6f082d63a702653c1.png",
        "3ab888c1d149e864ab44802dea8c1443e940fa0d.png",
        "6e799ff2de2de55d27796707a283068d66cdf3f4.png",
        "24d0815514951bb108fbb360b04a969441079315.png",
        "0ad193946df21899c6cc69fc36484a7f96e22f75.png",
        "265ecddc52d74e624dc38cf0cff13317085aedf7.png",
        "6a1198e25f8764bd30d53411dac9fdf840bc3265.png",
        "9ccc0447aebf0656809b339b41aa5b3705f27c47.png",
        "8cd85a382756ab938df23a856017abccd187188e.png",
        "e22f5b8e06ea3ee4de9e4da702ce8ef9a2958f5a.png",
        "c919a9818172a8297f8b0597722f96504a1e1d88.png",
        "87277d30cd19edcec9db466a9a3e556aeb0bc0ed.png",
        "44873d3568bdcb3d850d234e02a19602972450f1.png",
        "cb1c3ef50e22b6096fde67febe863494caefebad.png"
    ]
    let LiveBG_Default = [
        "f3c1e1e22dfb1942bd88c33f1aa174efe7a38dfd.jpg",
        "2bac063036fbcf316e021fbfb8109ff3028360a6.jpg",
        "2836bb7b84c792e2c6aadfd4d1cce13484775fa3.jpg",
        "636d66a97d5f55099a9d8d6813558d6d4c95fd61.jpg",
        "2388faed3728f3396052273ad4c3c9af21c411fc.jpg",
        "785922a49980e1aa3239249c8360909488940d7d.jpg"
    ]
    let CV_Default = [
        "4adb9255ada5b97061e610b682b8636764fe50ed.png"
    ]
    let List = class {
        Get(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            obj.innerHTML
        }
        Set(text, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            Console_log(text)
            obj.innerHTML = text
        }
        Add(text, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            if (obj.innerHTML == "") {
                obj.innerHTML = text
            } else {
                obj.innerHTML += "\n" + text
            }
        }
        Clear(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            obj.innerHTML = ""
        }
        BG(status, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            let color = "#FFFFFF"
            switch (status) {
                case "normal":
                    color = "#FFFFFF"
                    break
                case "running":
                    color = "#FFCC80"
                    break
                case "success":
                    color = "#91FFC2"
                    break
                case "error":
                    color = "#F45A8D"
                    break
                default:
                    color = "#FFFFFF"
                    break
            }
            obj.style.backgroundColor = color
        }
        Hide(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            obj.style.display = "none"
        }
        Show(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0]
            }
            obj.style.display = "block"
        }
    }
    let UFA = class {
        constructor(uid, all_count) {
            this.uid = uid
            this.name = ""
            this.all_count = all_count
            this.imglist = []
            this.index = 0
            this.indexA = 0
            this.GetOK = true
            this.DownSend = false
            this.HaveDownFail = false
            this.Mode = 0;// 0：相册 1：视频 2：头像、头图、直播封面及壁纸 3：头衔（开发者用） 4：专栏
            if (uid === undefined) {
                this.uid = this.load_uid()
            }
        }
        load_uid() {
            return window.location.pathname.split("/")[1]
        }
        load_all_count(uid, Mode) {
            if (uid === undefined) {
                uid = this.uid
            }
            if (Mode === undefined) {
                Mode = this.Mode
            }
            switch (Mode) {
                case 0:
                    {
                        HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid=" + uid, "GET", "").then(result => {
                            let rdata = JSON_parse(result)
                            if (rdata.code == 0) {
                                if (rdata.data.all_count != 0) {
                                    this.set_all_count(rdata.data.all_count, Mode)
                                } else {
                                    lists.Set("空的")
                                }
                            } else {
                                Console_error(result)
                            }
                        })
                    }
                    break
                case 1:
                    {
                        HTTPsend("https://api.bilibili.com/x/space/arc/search?mid=" + uid + "&ps=30&tid=0&pn=1&keyword=&order=pubdate", "GET", "").then(result => {
                            let rdata = JSON_parse(result)
                            if (rdata.code == 0) {
                                if (rdata.data.video != 0) {
                                    this.set_all_count(rdata.data.page.count, Mode)
                                } else {
                                    lists.Set("空的")
                                }
                            } else {
                                Console_error(result)
                            }
                        })
                    }
                    break
                case 2:
                    {
                        this.index = 0
                        this.imglist = []
                        let sendroom2 = (roomid) => {
                            HTTPsend("https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=" + roomid, "GET", "").then(result => {
                                let rdata3 = JSON_parse(result)
                                if (rdata3.code == 0) {
                                    let cover = rdata3.data.room_info.cover
                                    let background = rdata3.data.room_info.background
                                    if (cover != "") {
                                        this.all_count++
                                        this.add_img_FBLB(cover, "livecover_" + getFileName(cover))
                                    }
                                    if (background != "" && !(background.startsWith("http://static.hdslb.com/live-static/images/bg/") || background.startsWith("https://static.hdslb.com/live-static/images/bg/") || LiveBG_Default.indexOf(getFileName(background)) != -1)) {
                                        this.all_count++
                                        this.add_img_FBLB(background, "livebg_" + getFileName(background))
                                    }
                                    this.index = this.all_count
                                } else {
                                    Console_error(result)
                                }
                            })
                        }
                        let sendroom = () => {
                            HTTPsend("https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid=" + this.uid, "GET", "").then(result => {
                                let rdata = JSON_parse(result)
                                if (rdata.code == 0) {
                                    if (rdata.data.roomid != 0) {
                                        sendroom2(rdata.data.roomid)
                                    } else {
                                        this.index = this.all_count
                                    }
                                } else {
                                    this.index = this.all_count
                                    Console_error(result)
                                }
                            }).catch(() => {
                                this.index = this.all_count
                            })
                        }
                        HTTPsend("https://api.bilibili.com/x/space/acc/info?mid=" + this.uid, "GET", "").then(result => {
                            let rdata = JSON_parse(result)
                            if (rdata.code == 0) {
                                this.name = rdata.data.name
                                let face = rdata.data.face
                                let bg = rdata.data.top_photo
                                // let time = Math.round(new Date().getTime()/1000).toString()
                                this.all_count = 1
                                this.add_img_FBLB(face, "face_" + getFileName(face))
                                if (BG_Default.indexOf(getFileName(bg)) == -1) {
                                    this.all_count++
                                    this.add_img_FBLB(bg, "bg_" + getFileName(bg))
                                }
                                sendroom()
                            } else {
                                sendroom()
                                Console_error(result)
                            }
                        }).catch(() => {
                            sendroom()
                        })
                    }
                    break
                case 3:
                    {
                        HTTPsend("https://api.live.bilibili.com/rc/v1/Title/webTitles", "GET", "").then(result => {
                            let rdata = JSON_parse(result)
                            if (rdata.code == 0) {
                                if (rdata.data.length != 0) {
                                    this.set_all_count(rdata.data, Mode)
                                } else {
                                    lists.Set("空的")
                                    this.GetOK = true
                                }
                            } else {
                                Console_error(result)
                            }
                        })
                    }
                    break
                case 4:
                    {
                        HTTPsend("https://api.bilibili.com/x/space/article?mid=" + this.uid + "&pn=1&ps=12&sort=publish_time", "GET", "").then(result => {
                            // result = removejp14(result,"__jp14(")
                            let rdata = JSON_parse(result)
                            // console.log(rdata)
                            if (rdata.code == 0) {
                                if (rdata.data.count != 0) {
                                    this.set_all_count(rdata.data.count, Mode)
                                } else {
                                    lists.Set("空的")
                                    this.GetOK = true
                                }
                            } else {
                                Console_error(result)
                            }
                        })
                    }
                    break
                case 5:
                    {
                        let id = (new URL(window.location.href)).searchParams.get("id")
                        this.uid = "suit_" + id
                        HTTPsend("https://api.bilibili.com/x/garb/mall/item/suit/v2?part=suit&item_id=" + id, "GET", "").then(result => {
                            // result = removejp14(result,"__jp14(")
                            let rdata = JSON_parse(result)
                            // console.log(rdata)
                            if (rdata.code == 0) {
                                this.set_all_count(rdata.data, Mode)
                            } else {
                                Console_error(result)
                            }
                        })
                    }
                    break

                default:
                    break
            }
        }
        set_all_count(all_count, Mode) {
            if (all_count != undefined) {
                this.all_count = all_count
            }
            if (Mode === undefined) {
                Mode = this.Mode
            }
            this.load_img_list(this.uid, this.all_count, Mode)
        }
        load_img_list(uid, all_count, Mode) {
            if (uid === undefined) {
                uid = this.uid
            }
            if (all_count === undefined) {
                all_count = this.all_count
            }
            if (Mode === undefined) {
                Mode = this.Mode
            }
            switch (Mode) {
                case 0:
                    setTimeout(() => {
                        let z = 1
                        let size = 30
                        if (all_count > size) {
                            z = Math.ceil(all_count / size)
                        }
                        this.imglist = []
                        this.index = 0
                        let down = async (uid, z, size) => {
                            for (let num = 0; num < z; num++) {
                                lists.Set("正在分析第" + (1 + num).toString() + "页")
                                await RList.Push()
                                let rdata = JSON_parse(await HTTPsend(`https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid=${uid}&page_num=${num}&page_size=${size}&biz=all`, "GET", ""))
                                Console_Devlog(rdata)
                                if (rdata.code == 0) {
                                    for (let i = 0; i < rdata.data.items.length; i++) {
                                        const element = rdata.data.items[i]
                                        if (element.count == 1) {
                                            this.add_img(element.pictures[0].img_src, element.doc_id, 0)
                                            this.index++
                                        } else if (element.count == element.pictures.length) {
                                            let cou = 0
                                            for (let k = 0; k < element.pictures.length; k++) {
                                                const element2 = element.pictures[k]
                                                this.add_img(element2.img_src, element.doc_id, cou)
                                                cou++
                                            }
                                            this.index++
                                        } else {
                                            this.load_img_detail(element.doc_id)
                                        }
                                    }
                                } else {
                                    Console_error(result)
                                }
                            }
                            Console_log("加载完成，有" + this.imglist.length + "个图片。")
                            this.GetOK = true
                            return
                        }
                        down(uid, z, size)
                    })
                    break;
                case 1:
                    setTimeout(() => {
                        let z = 1
                        if (all_count > 30) {
                            z = Math.ceil(all_count / 30)
                        }
                        this.imglist = []
                        this.index = 0
                        let time = 1
                        for (let i = 1; i <= z; i++) {
                            setTimeout(() => {
                                HTTPsend("https://api.bilibili.com/x/space/arc/search?mid=" + uid + "&ps=30&tid=0&pn=" + i + "&keyword=&order=pubdate", "GET", "", (result) => {
                                    lists.Set("正在分析第" + i.toString() + "页")
                                    let rdata = JSON_parse(result)
                                    if (rdata.code == 0) {
                                        rdata.data.list.vlist.forEach(element => {
                                            if (element.pic.startsWith("//")) {
                                                this.add_img_video("https:" + element.pic, element.aid)
                                            } else if (element.pic.startsWith("http:") || element.pic.startsWith("https:")) {
                                                this.add_img_video(element.pic, element.aid)
                                            } else {
                                                this.add_img_video(element.pic, element.aid)
                                            }
                                            this.index++
                                        })
                                    } else {
                                        Console_error(result)
                                    }
                                    i == z && setTimeout(() => { Console_log("加载完成，有" + all_count + "个图片。"); this.GetOK = true; })
                                })
                            }, time)
                            time += 450
                        }
                    })
                    break;
                case 3:
                    {
                        this.imglist = []
                        this.index = 0
                        this.all_count = all_count.length
                        all_count.forEach(e => {
                            this.add_img_FBLB(e.web_pic_url, e.identification + ".png")
                            this.index++
                        })
                        this.GetOK = true
                    }
                    break;
                case 4:
                    setTimeout(() => {
                        let z = 1
                        if (all_count > 12) {
                            z = Math.ceil(all_count / 12)
                        }
                        this.imglist = []
                        this.index = 0
                        let time = 1
                        let cvlist = []
                        let loadcvlist = () => {
                            let cvtime = 1
                            console.log(cvlist)
                            let head = '<img data-src="'.length
                            for (let i = 0; i < cvlist.length; i++) {
                                setTimeout(() => {
                                    const e = cvlist[i]
                                    HTTPsend(e.url, "GET", "", (result) => {
                                        let p = i
                                        p++
                                        lists.Set("正在分析第" + p.toString() + "个专栏里的图片")
                                        let cou = 0
                                        if (e.banner != "") {
                                            this.add_img(e.banner, e.id, cou)
                                            cou++
                                        }
                                        // let rs = result.match(/<div class=[\"|']article-holder[\"|']>(.*?)<\/div>/g)
                                        // console.log(rs)
                                        let rs = result.match(/data-src=[\"|'](.*?)[\"|']/g)
                                        Console_Devlog(rs)
                                        if(rs!==null) rs.forEach(ce => {
                                            // if (ce.startsWith("//")) {
                                            if( CV_Default.indexOf(getFileName(ce).replace('"','')) == -1 ){
                                                this.add_img("https://" + ce.split("//")[1].slice(0, -1), e.id, cou)
                                                cou++
                                            }
                                            // } else if (ce.startsWith("http:") || ce.startsWith("https:")) {
                                            //     this.add_img(ce, e.id, cou)
                                            // } else {
                                            //     this.add_img(ce, e.id, cou)
                                            // }
                                            cou++
                                        })
                                        // <img data-src="//i0.hdslb.com/bfs/article/ba284705be500ebb08b2f42a5f7cc0477780a67c.jpg" width="870" height="1200" data-size="388284"/>
                                        p == cvlist.length && setTimeout(() => { this.index = 999; this.all_count = this.imglist.length; Console_log("加载完成，有" + this.all_count + "个图片。"); this.GetOK = true; })
                                    })
                                }, cvtime)
                                cvtime += 950
                            }
                        }
                        for (let i = 1; i <= z; i++) {
                            setTimeout(() => {
                                HTTPsend("https://api.bilibili.com/x/space/article?mid=" + this.uid + "&pn=" + i + "&ps=12&sort=publish_time", "GET", "", (result) => {
                                    lists.Set("正在分析第" + i.toString() + "页")
                                    let rdata = JSON_parse(result)
                                    if (rdata.code == 0) {
                                        rdata.data.articles.forEach(element => {
                                            cvlist.push({ url: "https://www.bilibili.com/read/cv" + element.id.toString(), id: element.id, banner: element.banner_url })
                                            // this.index++
                                        })
                                    } else {
                                        Console_error(result)
                                    }
                                    i == z && setTimeout(() => { Console_log("加载完成，有" + cvlist.length.toString() + "个专栏。"); loadcvlist(); })
                                })
                            }, time)
                            time += 450
                        }
                    })
                    break;
                case 5:
                    {
                        this.imglist = []
                        this.index = 0
                        this.all_count = all_count
                        // all_count === jjjj.data
                        this.add_img_FBLB(all_count.item.properties.fan_share_image, "fan_share_image.png")
                        this.index++
                        this.add_img_FBLB(all_count.item.properties.image_cover, "image_cover.png")
                        this.index++
                        this.add_img_FBLB(all_count.item.properties.image_cover_long, "image_cover_long.png")
                        this.index++
                        this.add_img_FBLB(all_count.item.properties.image_desc, "image_desc.png")
                        this.index++

                        for (let i = 0; i < all_count.suit_items.card.length; i++) {
                            const e = all_count.suit_items.card[i]
                            this.add_img_FBLB(e.properties.image, `card_image_${i.toString()}.png`)
                            this.index++
                            if (e.properties.image_cover) {
                                this.add_img_FBLB(e.properties.image_cover, `card_image_cover_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image_enhance) {
                                this.add_img_FBLB(e.properties.image_enhance, `card_image_enhance_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image_enhance_frame) {
                                this.add_img_FBLB(e.properties.image_enhance_frame, `card_image_enhance_frame_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image_preview_big) {
                                this.add_img_FBLB(e.properties.image_preview_big, `card_image_preview_big_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image_preview_small) {
                                this.add_img_FBLB(e.properties.image_preview_small, `card_image_preview_small_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.card_bg.length; i++) {
                            const e = all_count.suit_items.card_bg[i]
                            this.add_img_FBLB(e.properties.image, `card_bg_image_${i.toString()}.png`)
                            this.index++
                            if (e.properties.image_preview_big) {
                                this.add_img_FBLB(e.properties.image_preview_big, `card_bg_image_preview_big_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image_preview_small) {
                                this.add_img_FBLB(e.properties.image_preview_small, `card_bg_image_preview_small_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.emoji_package.length; i++) {
                            const e = all_count.suit_items.emoji_package[i]
                            this.add_img_FBLB(e.properties.image, `emoji_package_image_${i.toString()}.png`)
                            this.index++
                            for (let x = 0; x < e.items.length; x++) {
                                const el = e.items[x]
                                this.add_img_FBLB(el.properties.image, `emoji_item_image_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.loading.length; i++) {
                            const e = all_count.suit_items.loading[i]
                            if (e.properties.image_preview_small) {
                                this.add_img_FBLB(e.properties.image_preview_small, `loading_image_preview_small_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.loading_frame_url) {
                                this.add_img_FBLB(e.properties.loading_frame_url, `loading_loading_frame_url_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.loading_url) {
                                this.add_img_FBLB(e.properties.loading_url, `loading_loading_url_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.pendant.length; i++) {
                            const e = all_count.suit_items.pendant[i]
                            if (e.properties.image) {
                                this.add_img_FBLB(e.properties.image, `pendant_image_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.play_icon.length; i++) {
                            const e = all_count.suit_items.play_icon[i]
                            if (e.properties.drag_icon) {
                                this.add_img_FBLB(e.properties.drag_icon, `drag_${e.properties.drag_icon_hash}_${i.toString()}.json`)
                                this.index++
                            }
                            if (e.properties.icon) {
                                this.add_img_FBLB(e.properties.icon, `drag_icon_${e.properties.icon_hash}_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.squared_image) {
                                this.add_img_FBLB(e.properties.squared_image, `play_icon_squared_image_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.static_icon_image) {
                                this.add_img_FBLB(e.properties.static_icon_image, `play_icon_static_icon_image_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.skin.length; i++) {
                            const e = all_count.suit_items.skin[i]
                            if (e.properties.head_bg) {
                                this.add_img_FBLB(e.properties.head_bg, `skin_head_bg_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.head_myself_bg) {
                                this.add_img_FBLB(e.properties.head_myself_bg, `skin_head_myself_bg_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.head_myself_squared_bg) {
                                this.add_img_FBLB(e.properties.head_myself_squared_bg, `skin_head_myself_squared_bg_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.head_tab_bg) {
                                this.add_img_FBLB(e.properties.head_tab_bg, `skin_head_tab_bg_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image_cover) {
                                this.add_img_FBLB(e.properties.image_cover, `skin_image_cover_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image_preview) {
                                this.add_img_FBLB(e.properties.image_preview, `skin_image_preview_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.package_url) {
                                this.add_img_FBLB(e.properties.package_url, `skin_package_url_${i.toString()}.zip`)
                                this.index++
                            }
                            if (e.properties.side_bg) {
                                this.add_img_FBLB(e.properties.side_bg, `skin_side_bg_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.side_bg_bottom) {
                                this.add_img_FBLB(e.properties.side_bg_bottom, `skin_side_bg_bottom_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.tail_bg) {
                                this.add_img_FBLB(e.properties.tail_bg, `skin_tail_bg_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_channel) {
                                this.add_img_FBLB(e.properties.tail_icon_channel, `skin_tail_icon_channel_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_dynamic) {
                                this.add_img_FBLB(e.properties.tail_icon_dynamic, `skin_tail_icon_dynamic_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_main) {
                                this.add_img_FBLB(e.properties.tail_icon_main, `skin_tail_icon_main_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_myself) {
                                this.add_img_FBLB(e.properties.tail_icon_myself, `skin_tail_icon_myself_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_selected_channel) {
                                this.add_img_FBLB(e.properties.tail_icon_selected_channel, `skin_tail_icon_selected_channel_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_selected_dynamic) {
                                this.add_img_FBLB(e.properties.tail_icon_selected_dynamic, `skin_tail_icon_selected_dynamic_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_selected_main) {
                                this.add_img_FBLB(e.properties.tail_icon_selected_main, `skin_tail_icon_selected_main_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_selected_myself) {
                                this.add_img_FBLB(e.properties.tail_icon_selected_myself, `skin_tail_icon_selected_myself_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_selected_shop) {
                                this.add_img_FBLB(e.properties.tail_icon_selected_shop, `skin_tail_icon_selected_shop_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.tail_icon_shop) {
                                this.add_img_FBLB(e.properties.tail_icon_shop, `skin_tail_icon_shop_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.space_bg.length; i++) {
                            const e = all_count.suit_items.space_bg[i]
                            if (e.properties.fan_no_image) {
                                this.add_img_FBLB(e.properties.fan_no_image, `spacebg_fan_no_image_${i.toString()}.png`)
                                this.index++
                            }
                            if (e.properties.image1_landscape) {
                                this.add_img_FBLB(e.properties.image1_landscape, `spacebg_image1_landscape_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image1_portrait) {
                                this.add_img_FBLB(e.properties.image1_portrait, `spacebg_image1_portrait_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image2_landscape) {
                                this.add_img_FBLB(e.properties.image2_landscape, `spacebg_image2_landscape_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image2_portrait) {
                                this.add_img_FBLB(e.properties.image2_portrait, `spacebg_image2_portrait_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image3_landscape) {
                                this.add_img_FBLB(e.properties.image3_landscape, `spacebg_image3_landscape_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image3_portrait) {
                                this.add_img_FBLB(e.properties.image3_portrait, `spacebg_image3_portrait_${i.toString()}.jpg`)
                                this.index++
                            }
                        }
                        for (let i = 0; i < all_count.suit_items.thumbup.length; i++) {
                            const e = all_count.suit_items.thumbup[i]
                            if (e.properties.image_ani) {
                                this.add_img_FBLB(e.properties.image_ani, `thumbup_image_ani_${i.toString()}.bin`)
                                this.index++
                            }
                            if (e.properties.image_ani_cut) {
                                this.add_img_FBLB(e.properties.image_ani_cut, `thumbup_image_ani_cut_${i.toString()}.bin`)
                                this.index++
                            }
                            if (e.properties.image_bright) {
                                this.add_img_FBLB(e.properties.image_bright, `thumbup_image_bright_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image_dim) {
                                this.add_img_FBLB(e.properties.image_dim, `thumbup_image_dim_${i.toString()}.jpg`)
                                this.index++
                            }
                            if (e.properties.image_preview) {
                                this.add_img_FBLB(e.properties.image_preview, `thumbup_image_preview_${i.toString()}.png`)
                                this.index++
                            }
                        }
                        if (all_count.fan_user.avatar) {
                            this.add_img_FBLB(all_count.fan_user.avatar, `fan_user_${all_count.fan_user.mid.toString()}.png`)
                            this.index++
                        }
                        this.all_count = this.index
                    }
                    break;
                default:
                    break;
            }
            // if (Mode == 0) {
            // } else if (Mode == 1) {
            // } else if (Mode == 3) {
            // } else if (Mode == 4) {
            // }
        }
        load_img_detail(doc_id) {
            HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id=" + doc_id, "GET", "", (result) => {
                let rdata = JSON_parse(result)
                if (rdata.code == 0) {
                    let cou = 0
                    rdata.data.item.pictures.forEach(element => {
                        this.add_img(element.img_src, doc_id, cou)
                        cou++
                    })
                    this.index++
                } else {
                    Console_error(result)
                }
            })

        }
        add_img(url, doc_id, cou) {
            this.imglist.push({ url: url, doc_id: doc_id, cou: cou })
        }
        add_img_video(url, aid) {
            this.imglist.push({ url: url, aid: aid })
        }
        add_img_FBLB(url, name) {
            this.imglist.push({ url: url, name: name })
        }
        send_aria2() {
            this.DownSend = true
            let indexA = this.indexA
            indexA++
            Console_Devlog(indexA + "，" + this.imglist.length)
            if (indexA <= this.imglist.length) {
                lists.Set("正在发送第" + indexA + "张图片。")
                switch (this.Mode) {
                    case 0:
                        {
                            let url = this.imglist[this.indexA].url
                            let doc_id = this.imglist[this.indexA].doc_id.toString()
                            let cou = this.imglist[this.indexA].cou.toString()
                            setTimeout(() => {
                                addToAria([url], doc_id + "_" + cou + getType(url), "https://h.bilibili.com/" + doc_id, true, [], () => {
                                    // bug: 此处没法执行callback
                                }, () => {
                                    lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。")
                                })
                                uFA.indexA++
                                uFA.send_aria2()
                            }, 5)
                        }
                        break;
                    case 1:
                        {
                            let url = this.imglist[this.indexA].url
                            let aid = this.imglist[this.indexA].aid.toString()
                            setTimeout(() => {
                                addToAria([url], "av" + aid + "_" + getFileName(url), "https://space.bilibili.com/" + this.uid + "/video", true, [], () => {
                                    // bug: 此处没法执行callback
                                }, () => {
                                    lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。")
                                })
                                uFA.indexA++
                                uFA.send_aria2()
                            }, 5)
                        }
                        break;
                    case 2:
                        {
                            let url = this.imglist[this.indexA].url
                            let name = this.imglist[this.indexA].name
                            setTimeout(() => {
                                addToAria([url], name, "https://space.bilibili.com/" + this.uid + "/video", true, [], () => {
                                    // bug: 此处没法执行callback
                                }, () => {
                                    lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。")
                                })
                                uFA.indexA++
                                uFA.send_aria2()
                            }, 5)
                        }
                        break;
                    case 4:
                        {
                            let url = this.imglist[this.indexA].url
                            let doc_id = this.imglist[this.indexA].doc_id.toString()
                            let cou = this.imglist[this.indexA].cou.toString()
                            setTimeout(() => {
                                addToAria([url], "cv" + doc_id + "_" + cou + "_" + getFileName(url), "https://www.bilibili.com/read/cv" + doc_id, true, [], () => {
                                    // bug: 此处没法执行callback
                                }, () => {
                                    lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。")
                                })
                                uFA.indexA++
                                uFA.send_aria2()
                            }, 5)
                        }
                        break;
                    case 5:
                        {
                            let url = this.imglist[this.indexA].url
                            let name = this.imglist[this.indexA].name
                            setTimeout(() => {
                                addToAria([url], name, "https://www.bilibili.com/h5/mall/suit/detail?navhide=1&id=" + this.uid.replace("suit_", "") + "&from=official", true, [], () => {
                                    // bug: 此处没法执行callback
                                }, () => {
                                    lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。")
                                })
                                uFA.indexA++
                                uFA.send_aria2()
                            }, 5)
                        }
                        break;
                    default:
                        break;
                }
            } else {
                this.DownSend = false
                MBBtn(true)
                lists.Set("发送完成。")
                lists.BG("success")
            }
        }
        async send_blob() {
            this.DownSend = true
            let indexA = this.indexA
            indexA++
            if (indexA <= this.imglist.length) {
                lists.Set("正在获取第" + indexA + "张图片。")
                await RList.Push()
                switch (this.Mode) {
                    case 0:
                        {
                            let url = this.imglist[this.indexA].url
                            let doc_id = this.imglist[this.indexA].doc_id.toString()
                            let cou = this.imglist[this.indexA].cou.toString()
                            setTimeout(() => {
                                loadToBlob(url, (blobFile) => {
                                    if (blobFile) {
                                        zip.file(doc_id + "_" + cou + getType(url), blobFile, { binary: true })
                                        this.indexA++
                                        uFA.send_blob()
                                    } else {
                                        this.HaveDownFail = true
                                        Console_error("相簿 https://h.bilibili.com/" + doc_id + " 下的第 " + cou + " 张图片下载失败了。。。")
                                        this.indexA++
                                        uFA.send_blob()
                                    }
                                })
                            }, 100)
                        }
                        break;
                    case 1:
                        {
                            let url = this.imglist[this.indexA].url
                            let aid = this.imglist[this.indexA].aid.toString()
                            setTimeout(() => {
                                loadToBlob(url, (blobFile) => {
                                    if (blobFile) {
                                        zip.file("av" + aid + "_" + getFileName(url), blobFile, { binary: true })
                                        this.indexA++
                                        uFA.send_blob()
                                    } else {
                                        this.HaveDownFail = true
                                        Console_error("视频 https://www.bilibili.com/video/av" + aid + " 的封面下载失败了。。。")
                                        this.indexA++
                                        uFA.send_blob()
                                    }
                                })
                            }, 100)
                        }
                        break;
                    case 2:
                    case 3:
                    case 5:
                        {
                            let url = this.imglist[this.indexA].url
                            let name = this.imglist[this.indexA].name
                            setTimeout(() => {
                                loadToBlob(url, (blobFile) => {
                                    if (blobFile) {
                                        zip.file(name, blobFile, { binary: true })
                                        this.indexA++
                                        uFA.send_blob()
                                    } else {
                                        this.HaveDownFail = true
                                        Console_error("图片 " + url + " 下载失败了。。。")
                                        this.indexA++
                                        uFA.send_blob()
                                    }
                                })
                            }, 100)
                        }
                        break;
                    case 4:
                        {
                            let url = this.imglist[this.indexA].url
                            let doc_id = this.imglist[this.indexA].doc_id.toString()
                            let cou = this.imglist[this.indexA].cou.toString()
                            setTimeout(() => {
                                loadToBlob(url, (blobFile) => {
                                    if (blobFile) {
                                        zip.file("cv" + doc_id + "_" + cou + "_" + getFileName(url), blobFile, { binary: true })
                                        this.indexA++
                                        uFA.send_blob()
                                    } else {
                                        this.HaveDownFail = true
                                        Console_error("专栏 https://www.bilibili.com/read/cv" + doc_id + " 下的第 " + cou + " 张图片下载失败了。。。")
                                        this.indexA++
                                        uFA.send_blob()
                                    }
                                })
                            }, 100)
                        }
                        break;
                    // case 5:

                    //     break;
                    default:
                        break;
                }
            } else {
                let result = ""
                let rdata = {}
                let name = ""
                if (uFA.Mode != 5 || uFA.Mode != 3) {
                    result = await HTTPsend("https://api.bilibili.com/x/space/acc/info?mid=" + uFA.uid, "GET")
                    rdata = JSON_parse(result)
                    if (rdata.code == 0) {
                        this.name = rdata.data.name
                        name = this.name
                    }
                }
                zip.generateAsync({ type: "blob" }).then((content) => {
                    // see FileSaver.js
                    let zipname = name + "_" + this.uid
                    switch (this.Mode) {
                        case 0:
                            {
                                zipname += "_相册"
                            }
                            break;
                        case 1:
                            {
                                zipname += "_视频封面"
                            }
                            break;
                        case 2:
                            {
                                zipname += "_头图及壁纸"
                            }
                            break;
                        case 3:
                            {
                                zipname += "_头衔"
                            }
                            break;
                        case 4:
                            {
                                zipname += "_专栏"
                            }
                            break;
                        case 5:
                            {
                                zipname += "_主题"
                            }
                            break;

                        default:
                            break;
                    }
                    lists.Set("正在打包成 " + zipname + ".zip 中")
                    saveAs(content, zipname + ".zip")
                    // let a = document.createElement('a')
                    // a.innerHTML = zipname
                    // a.download = zipname
                    // a.href = URL.createObjectURL(content)
                    // a.addEventListener("click", function () { document.body.removeChild(a) })
                    // document.body.appendChild(a)
                    // a.click()
                    this.DownSend = false
                    MBBtn(true)
                    if (!this.HaveDownFail) {
                        lists.Set("打包 " + zipname + ".zip 完成。")
                        lists.BG("success")
                    } else {
                        lists.Set("打包 " + zipname + ".zip 完成，但有些文件下载失败了，详细请查看控制台orz")
                        lists.BG("error")
                    }
                })
            }
        }
    }
    let zip = new JSZip()
    let uFA = new UFA()
    CreactMenu()
    // CreactUI()
    // document.getElementById("Bili8-UI").style.display = "none"
    // ↑我觉得没必要加载完就加载这玩意。。。
    let lists = new List()
})()
