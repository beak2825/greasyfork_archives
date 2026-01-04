// ==UserScript==
// @name         Pixiv Save to Eagle
// @name:zh-TW   Pixiv 圖片儲存至 Eagle
// @name:ja      Pixivの畫像を直接Eagleに儲存
// @name:en      Pixiv Save to Eagle
// @name:de      Pixiv-Bilder direkt in Eagle speichern
// @name:es      Guardar imágenes de Pixiv directamente en Eagle
// @description  將 Pixiv 作品圖片與動圖直接存入 Eagle
// @description:zh-TW 直接將 Pixiv 上的圖片與動圖儲存到 Eagle
// @description:ja Pixivの作品畫像とアニメーションを直接Eagleに儲存します
// @description:en  Save Pixiv images & animations directly into Eagle
// @description:de  Speichert Pixiv-Bilder und Animationen direkt in Eagle
// @description:es  Guarda imágenes y animaciones de Pixiv directamente en Eagle
//
// @version      1.3.5
// @match        https://www.pixiv.net/artworks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://greasyfork.org/scripts/2963-gif-js/code/gifjs.js?version=8596
// @run-at       document-end
//
// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/546402/Pixiv%20Save%20to%20Eagle.user.js
// @updateURL https://update.greasyfork.org/scripts/546402/Pixiv%20Save%20to%20Eagle.meta.js
// ==/UserScript==

class EagleClient {
    async save(urlOrBase64, name, folderId = []) {
        return new Promise(resolve => {
            const data = {
                url: urlOrBase64,
                name,
                folderId: Array.isArray(folderId) ? folderId : [folderId],
                tags: [],
                website: location.href,
                headers: { referer: "https://www.pixiv.net/" }
            }

            GM_xmlhttpRequest({
                url: "http://localhost:41595/api/item/addFromURL",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: r => {
                    if (r.status >= 200 && r.status < 300) {
                        console.log("✅ Added:", name)
                    } else {
                        console.error("Failed:", r)
                    }
                    resolve()
                },
                onerror: e => {
                    console.error(e)
                    resolve()
                },
                ontimeout: e => {
                    console.error(e)
                    resolve()
                }
            })
        })
    }

    async getFolderList() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: "http://localhost:41595/api/folder/list",
                method: "GET",
                onload: res => {
                    try {
                        const folders = JSON.parse(res.responseText).data || []
                        const list = []
                        const appendFolder = (f, prefix = "") => {
                            list.push({ id: f.id, name: prefix + f.name })
                            if (f.children && f.children.length) {
                                f.children.forEach(c => appendFolder(c, "└── " + prefix))
                            }
                        }
                        folders.forEach(f => appendFolder(f))
                        resolve(list)
                    } catch (e) {
                        console.error("解析資料夾列表失敗", e)
                        resolve([])
                    }
                },
                onerror: err => {
                    console.error(err)
                    resolve([])
                }
            })
        })
    }
}

class PixivIllust {
    constructor(eagleClient) {
        this.eagle = eagleClient
        this.illust = this.fetchIllustInfo()
    }

    fetchIllustInfo() {
        const illustId = location.href.match(/artworks\/(\d+)/)?.[1]
        if (!illustId) return null
        if (!this.illust || this.illust.illustId != illustId) {
            const xhr = new XMLHttpRequest()
            xhr.open("GET", `/ajax/illust/${illustId}`, false)
            xhr.send()
            if (xhr.status === 200) {
                this.illust = JSON.parse(xhr.responseText).body
            }
        }
        return this.illust
    }

    fetchIllusts() {
        this.fetchIllustInfo()
        if (!this.illust) return []
        const baseName = `Pixiv @${this.illust.userName} ${this.illust.title}(${this.illust.illustId})`
        if (this.isGif()) {
            return [{ url: this.illust.urls.original, name: baseName + '.gif', type: 'gif' }]
        } else {
            const baseUrl = this.illust.urls.original
            console.log(this.illust.pageCount)
            return Array.from({ length: this.illust.pageCount }, (_, i) => ({
                url: baseUrl.replace('_p0.', `_p${i}.`),
                name: this.illust.pageCount > 1 ? baseName + `_p${i}` : baseName
            }))
        }
    }

    async handleIllust(image, folderId) {
        const { url, name, type } = image
        if (type === 'gif') {
            await this.handleGif(folderId, name)
        } else {
            await this.eagle.save(url, name, folderId)
            console.log("已送到 Eagle:", name)
        }
    }

    isSingle() {
        return (this.illust.illustType === 0 || this.illust.illustType === 1) && this.illust.pageCount === 1
    }

    isSet() {
        return this.illust.pageCount > 1
    }

    isGif() {
        return this.illust.illustType === 2
    }

    async handleSingle(folderId) {
        const illust = this.illust
        const url = illust.urls.original
        const name = `Pixiv @${illust.userName} ${illust.title}(${illust.illustId})`
        await this.eagle.save(url, name, folderId)
        console.log("已送到 Eagle:", name)
    }

    async handleSet(folderId) {
        const illust = this.illust
        const url = illust.urls.original
        const urls = Array.from({ length: illust.pageCount }, (_, i) => url.replace(/_p\d\./, `_p${i}.`))
        for (const [i, u] of urls.entries()) {
            const name = `Pixiv @${illust.userName} ${illust.title}(${illust.illustId})_p${i}`
        await this.eagle.save(u, name, folderId)
        }
        console.log(`已送 ${illust.pageCount} 張到 Eagle`)
    }

    async handleGif(folderId) {
        try {
            const illust = this.illust
            const xhr = new XMLHttpRequest()
            xhr.open("GET", `/ajax/illust/${illust.illustId}/ugoira_meta`, false)
            xhr.send()
            const frames = JSON.parse(xhr.responseText).body.frames

            const gif = new GIF({ workers: 1, quality: 10, workerScript: GIF_worker_URL })
            const gifFrames = new Array(frames.length)

            await Promise.all(frames.map((frame, idx) => new Promise((resolve, reject) => {
                const url = illust.urls.original.replace("ugoira0.", `ugoira${idx}.`)
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: { referer: "https://www.pixiv.net/" },
                    responseType: "arraybuffer",
                    onload: res => {
                        if (res.status >= 200 && res.status < 300) {
                            const suffix = url.split(".").pop()
                            const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" }[suffix]
                            const blob = new Blob([res.response], { type: mime })
                            const img = document.createElement("img")
                            const reader = new FileReader()
                            reader.onload = () => {
                                img.src = reader.result
                                img.onload = () => {
                                    gifFrames[idx] = { frame: img, option: { delay: frame.delay } }
                                    resolve()
                                }
                                img.onerror = () => reject(new Error("圖片載入失敗:" + url))
                            }
                            reader.readAsDataURL(blob)
                        } else {
                            reject(new Error(`下載失敗 ${res.status}: ${url}`))
                        }
                    },
                    onerror: reject,
                    ontimeout: reject
                })
            })))

            gifFrames.forEach(f => gif.addFrame(f.frame, f.option))
            gif.on("finished", async blob => {
                const reader = new FileReader()
                reader.onload = async () => {
                    const base64 = reader.result
                    const name = `Pixiv @${illust.userName} ${illust.title}(${illust.illustId}).gif`
            await this.eagle.save(base64, name, folderId)
                    console.log("已送動圖到 Eagle:", name)
                }
                reader.readAsDataURL(blob)
            })
            gif.render()
        } catch (e) {
            console.error("handleGif error:", e)
        }
    }
}

class PixivEagleUI {
    constructor() {
        this.eagle = new EagleClient()
        this.pixiv = new PixivIllust(this.eagle)
        this.buttonContainerSelector = "section section"
        this.imageSelector = "div[role='presentation'].sc-440d5b2c-0"
        this.buttonPosition = "↖"
        this.init()
    }

    async init() {
        this.buttonPosition = await GM.getValue("buttonPosition", "↖")
        console.log("buttonPosition (updated)", this.buttonPosition)
        this.registerPositionMenu()
        this.addFolderSelect()
        this.addButtons(this.buttonPosition)
        this.observeDomChange(() => {
            this.addButtons(this.buttonPosition)
        })
        //await this.observeWorkExpand()
    }

    async waitForElement(selector, interval = 1000) {
        return new Promise((resolve, reject) => {
            let intervalId;
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            };
            checkElement();
            intervalId = setInterval(checkElement, interval);
        });
    }

    async addFolderSelect() {
        try {
            const btnNav = await this.waitForElement(this.buttonContainerSelector)
            if (document.getElementById("save-all-to-eagle-btn")) return

            const container = document.createElement("div")
            container.classList.add("cNcUof")

            const btn = document.createElement("button")
            btn.id = "save-all-to-eagle-btn"
            btn.textContent = "Save to Eagle"
            btn.className = "charcoal-button"
            btn.dataset.variant = "Primary"

            const select = document.createElement("select")
            select.id = "eagle-folder-select"
            select.style.marginLeft = "8px"

            const lastFolderId = await GM.getValue("eagle_last_folder")

            const folders = await this.eagle.getFolderList()
            folders.forEach(f => {
                const option = document.createElement("option")
                option.value = f.id
                option.textContent = f.name
                if (f.id === lastFolderId) option.selected = true
                select.appendChild(option)
            })

            select.onclick = async () => {
                const folderId = select.value
                await GM.setValue("eagle_last_folder", folderId)
            }
            btn.onclick = async () => {
                const folderId = select.value
                await GM.setValue("eagle_last_folder", folderId)
                //this.pixiv.fetchIllusts();
                if (this.pixiv.isSingle()) {
                    await this.pixiv.handleSingle(folderId)
                } else if (this.pixiv.isSet()) {
                    await this.pixiv.handleSet(folderId)
                } else if (this.pixiv.isGif()) {
                    await this.pixiv.handleGif(folderId)
                } else {
                    console.log("不支援此作品類型")
                }
            }

            container.appendChild(btn)
            container.appendChild(select)
            btnNav.appendChild(container)
        } catch (e) {
            console.error(e)
        }
    }

    async addButtons(position) {
        try {
            this.pixiv.fetchIllustInfo()
            if (!this.pixiv.illust) return

            await this.waitForElement(this.imageSelector)

            const positionStyles = {
                "↖": { top: "10px", left: "10px" },
                "↗": { top: "10px", right: "10px" },
                "↙": { bottom: "10px", left: "10px" },
                "↘": { bottom: "10px", right: "10px" },
                "↑": { top: "10px", left: "50%", transform: "translateX(-50%)" },
                "↓": { bottom: "10px", left: "50%", transform: "translateX(-50%)" },
                "←": { top: "50%", left: "10px", transform: "translateY(-50%)" },
                "→": { top: "50%", right: "10px", transform: "translateY(-50%)" }
            };

            const validPosition = positionStyles[position] ? position : "↖"
            const styles = positionStyles[validPosition]

            document.querySelectorAll(this.imageSelector).forEach((img, index) => {
                console.log(index)
                if (img.parentElement.querySelector(`#save-to-eagle-btn-${index}`)) return

                const container = document.createElement("div")
                container.style.position = "absolute"
                container.style.zIndex = "1000"
                Object.assign(container.style, styles)
                console.log("index",index)
                const btn = document.createElement("button")
                btn.id = `save-to-eagle-btn-${index}`
                btn.textContent = "save to Eagle"
                btn.classList.add("charcoal-button")

                btn.onclick = async () => {
                    let folderId = await GM.getValue("eagle_last_folder");
                    const images = this.pixiv.fetchIllusts()
                    console.log("images[index]",images)
                    await this.pixiv.handleIllust(images[index], folderId)
                }

                container.appendChild(btn)
                img.parentElement.style.position = "relative"
                img.parentElement.appendChild(container)
            })
        } catch (e) {
            console.error("無法新增按鈕:", e)
        }
    }

    registerPositionMenu() {
        GM_registerMenuCommand("選擇按鈕位置", () => {
            const select = document.createElement("select")
            const options = [
                { value: "↖", text: "↖" },
                { value: "↗", text: "↗" },
                { value: "↙", text: "↙" },
                { value: "↘", text: "↘" },
                { value: "↑", text: "↑" },
                { value: "↓", text: "↓" },
                { value: "←", text: "←" },
                { value: "→", text: "→" }
            ];

            options.forEach(opt => {
                const option = document.createElement("option")
                option.value = opt.value
                option.textContent = opt.text
                if (opt.value === this.buttonPosition) option.selected = true
                select.appendChild(option)
            })

            const container = document.createElement("div")
            container.style.position = "fixed"
            container.style.top = "50%"
            container.style.left = "50%"
            container.style.transform = "translate(-50%, -50%)"
            container.style.color = "black"
            container.style.backgroundColor = "white"
            container.style.padding = "20px"
            container.style.border = "1px solid #ccc"
            container.style.zIndex = "10000"
            container.style.display = "flex"
            container.style.alignItems = "center"
            container.style.gap = "10px"

            const label = document.createElement("label")
            label.textContent = "選擇按鈕位置："
            label.style.marginRight = "10px"

            const confirmButton = document.createElement("button")
            confirmButton.textContent = "⭘"
            confirmButton.style.padding = "2px 8px"
            confirmButton.style.backgroundColor = "#28a745"
            confirmButton.style.color = "white"
            confirmButton.style.border = "none"
            confirmButton.style.borderRadius = "4px"
            confirmButton.style.cursor = "pointer"
            confirmButton.style.fontSize = "14px"
            confirmButton.title = "確定選擇"
            confirmButton.setAttribute("aria-label", "確定按鈕位置")
            confirmButton.onclick = async () => {
                await GM.setValue("buttonPosition", this.buttonPosition);
                console.log("儲存位置：", await GM.getValue("buttonPosition"));
                container.remove();
            };

            select.onchange = async () => {
                this.buttonPosition = select.value;
                console.log(select.value);
                document.querySelectorAll("[id^=save-to-eagle-btn]").forEach(btn => btn.parentElement.remove());
                this.addButtons(this.buttonPosition);
            };


            container.appendChild(label)
            container.appendChild(select)
            container.appendChild(confirmButton)
            document.body.appendChild(container)
        })
    }

    observeDomChange(callback) {
        const observer = new MutationObserver(() => {
            callback()
        })
        observer.observe(document.body, { childList: true, subtree: true })
    }
}

new PixivEagleUI()
