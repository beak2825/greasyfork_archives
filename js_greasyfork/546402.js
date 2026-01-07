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
// @version      1.5.3
// @match        https://www.pixiv.net/*
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

class JohnThePostcardSalesman {
    constructor() {
        this.eagle = new EagleAPI();
        this.processor = new IllustProcessor(this.eagle);
        this.currentHandler = null;
        this.lastPath = null;
        this.init();
        this.registerPositionMenu();
        this.observePageChange();
    }

    async init() {
        const path = location.pathname;
        this.lastPath = path;

        if (path.match(/\/artworks\/\d+/)) {
            this.currentHandler = new ArtworkPageHandler(this.eagle, this.processor);
            await this.currentHandler.init();
        } else if (!path.match(/\/artworks\/\d+/)) {
            this.currentHandler = new OtherPagesHandler(this.eagle, this.processor);
            await this.currentHandler.init();
        }
    }

    observePageChange() {
        let lastTitle = document.title;
        const titleObserver = new MutationObserver(async () => {
            if (document.title !== lastTitle) {
                lastTitle = document.title;
                const currentPath = location.pathname;

                if (currentPath !== this.lastPath) {
                    this.lastPath = currentPath;
                    console.log("Page changed to:", currentPath);

                    document.querySelectorAll("[id^='save-to-eagle-btn'], [id^='eagle-btn'], #save-all-to-eagle-btn").forEach(btn => {
                        const parent = btn.closest('.cNcUof') || btn.parentElement;
                        if (parent) parent.remove();
                    });

                    await this.init();
                }
            }
        });

        titleObserver.observe(document.querySelector('title'), {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    registerPositionMenu() {
        GM_registerMenuCommand(I18n.t('selectButtonPosition'), () => {
            const select = document.createElement("select");
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

            const currentPosition = GM.getValue("buttonPosition", "↖");

            options.forEach(opt => {
                const option = document.createElement("option");
                option.value = opt.value;
                option.textContent = opt.text;
                if (opt.value === currentPosition) option.selected = true;
                select.appendChild(option);
            });

            const container = document.createElement("div");
            container.style.position = "fixed";
            container.style.top = "50%";
            container.style.left = "50%";
            container.style.transform = "translate(-50%, -50%)";
            container.style.color = "black";
            container.style.backgroundColor = "white";
            container.style.padding = "20px";
            container.style.border = "1px solid #ccc";
            container.style.zIndex = "10000";
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.gap = "10px";
            container.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            container.style.borderRadius = "8px";

            const label = document.createElement("label");
            label.textContent = I18n.t('buttonPosition');
            label.style.marginRight = "10px";

            const confirmButton = document.createElement("button");
            confirmButton.textContent = I18n.t('confirm');
            confirmButton.style.padding = "6px 12px";
            confirmButton.style.backgroundColor = "#28a745";
            confirmButton.style.color = "white";
            confirmButton.style.border = "none";
            confirmButton.style.borderRadius = "4px";
            confirmButton.style.cursor = "pointer";
            confirmButton.style.fontSize = "14px";
            confirmButton.onclick = async () => {
                await GM.setValue("buttonPosition", select.value);
                console.log("Saved position:", await GM.getValue("buttonPosition"));
                container.remove();
            };

            select.onchange = async () => {
                const newPosition = select.value;
                await GM.setValue("buttonPosition", newPosition);
                console.log("Position changed to:", newPosition);

                document.querySelectorAll("[id^='save-to-eagle-btn-']").forEach(btn => {
                    const parent = btn.parentElement;
                    if (parent) parent.remove();
                });

                if (this.currentHandler && this.currentHandler.addImageButtons) {
                    await this.currentHandler.addImageButtons();
                }
            };

            container.appendChild(label);
            container.appendChild(select);
            container.appendChild(confirmButton);
            document.body.appendChild(container);
        });
    }
}

class EagleAPI {
    constructor(baseUrl = "http://localhost:41595") {
        this.baseUrl = baseUrl;
    }

    async save(urlOrBase64, name, folderId = []) {
        return new Promise(resolve => {
            const data = {
                url: urlOrBase64,
                name,
                folderId: Array.isArray(folderId) ? folderId : [folderId],
                tags: [],
                website: location.href,
                headers: { referer: "https://www.pixiv.net/" }
            };

            GM_xmlhttpRequest({
                url: `${this.baseUrl}/api/item/addFromURL`,
                method: "POST",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: r => {
                    if (r.status >= 200 && r.status < 300) {
                        console.log(I18n.t('addedSuccess'), name);
                    } else {
                        console.error("Failed:", r);
                    }
                    resolve();
                },
                onerror: e => {
                    console.error(e);
                    resolve();
                },
                ontimeout: e => {
                    console.error(e);
                    resolve();
                }
            });
        });
    }

    async getFolderList() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: `${this.baseUrl}/api/folder/list`,
                method: "GET",
                onload: res => {
                    try {
                        const folders = JSON.parse(res.responseText).data || [];
                        const list = [];
                        const appendFolder = (f, prefix = "") => {
                            list.push({ id: f.id, name: prefix + f.name });
                            if (f.children && f.children.length) {
                                f.children.forEach(c => appendFolder(c, "└── " + prefix));
                            }
                        };
                        folders.forEach(f => appendFolder(f));
                        resolve(list);
                    } catch (e) {
                        console.error(I18n.t('parseFolderFailed'), e);
                        resolve([]);
                    }
                },
                onerror: err => {
                    console.error(err);
                    resolve([]);
                }
            });
        });
    }
}

class PixivAPI {
    static async fetchIllustInfo(illustId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `/ajax/illust/${illustId}`, false);
            xhr.send();
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).body);
            } else {
                reject(new Error(`Failed to fetch illust ${illustId}`));
            }
        });
    }

    static async fetchUgoiraMeta(illustId) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `/ajax/illust/${illustId}/ugoira_meta`, false);
            xhr.send();
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText).body);
            } else {
                reject(new Error(`Failed to fetch ugoira meta ${illustId}`));
            }
        });
    }

    static getIllustIdFromUrl(url = location.href) {
        return url.match(/artworks\/(\d+)/)?.[1];
    }
}

class IllustProcessor {
    constructor(eagleAPI) {
        this.eagle = eagleAPI;
    }

    async downloadIllust(illustId, folderId) {
        const illust = await PixivAPI.fetchIllustInfo(illustId);
        const baseName = `Pixiv @${illust.userName} ${illust.title}(${illust.illustId})`;

        if (illust.illustType === 2) {
            await this.handleGif(illust, baseName, folderId);
        } else if (illust.pageCount === 1) {
            await this.handleSingle(illust, baseName, folderId);
        } else {
            await this.handleSet(illust, baseName, folderId);
        }
    }

    async downloadSingleImage(illustId, pageIndex, folderId) {
        const illust = await PixivAPI.fetchIllustInfo(illustId);
        const baseName = `Pixiv @${illust.userName} ${illust.title}(${illust.illustId})`;

        if (illust.illustType === 2) {
            // 動圖只能整個下載
            await this.handleGif(illust, baseName, folderId);
        } else {
            const baseUrl = illust.urls.original;
            const url = baseUrl.replace(/_p\d\./, `_p${pageIndex}.`);
            const name = illust.pageCount > 1 ? `${baseName}_p${pageIndex}` : baseName;
            await this.eagle.save(url, name, folderId);
            console.log(I18n.t('saved') + ":", name);
        }
    }

    async handleSingle(illust, baseName, folderId) {
        await this.eagle.save(illust.urls.original, baseName, folderId);
        console.log(I18n.t('saved') + ":", baseName);
    }

    async handleSet(illust, baseName, folderId) {
        const baseUrl = illust.urls.original;
        const urls = Array.from({ length: illust.pageCount }, (_, i) =>
            baseUrl.replace(/_p\d\./, `_p${i}.`)
        );

        for (const [i, url] of urls.entries()) {
            const name = `${baseName}_p${i}`;
            await this.eagle.save(url, name, folderId);
        }
        console.log(I18n.t('savedMultiple', { count: illust.pageCount }));
    }

    async handleGif(illust, baseName, folderId) {
        try {
            const meta = await PixivAPI.fetchUgoiraMeta(illust.illustId);
            const frames = meta.frames;

            const gif = new GIF({ workers: 1, quality: 10, workerScript: GIF_worker_URL });
            const gifFrames = new Array(frames.length);

            await Promise.all(frames.map((frame, idx) => new Promise((resolve, reject) => {
                const url = illust.urls.original.replace("ugoira0.", `ugoira${idx}.`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url,
                    headers: { referer: "https://www.pixiv.net/" },
                    responseType: "arraybuffer",
                    onload: res => {
                        if (res.status >= 200 && res.status < 300) {
                            const suffix = url.split(".").pop();
                            const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" }[suffix];
                            const blob = new Blob([res.response], { type: mime });
                            const img = document.createElement("img");
                            const reader = new FileReader();
                            reader.onload = () => {
                                img.src = reader.result;
                                img.onload = () => {
                                    gifFrames[idx] = { frame: img, option: { delay: frame.delay } };
                                    resolve();
                                };
                                img.onerror = () => reject(new Error("圖片載入失敗:" + url));
                            };
                            reader.readAsDataURL(blob);
                        } else {
                            reject(new Error(`下載失敗 ${res.status}: ${url}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: reject
                });
            })));

            gifFrames.forEach(f => gif.addFrame(f.frame, f.option));
            gif.on("finished", async blob => {
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64 = reader.result;
                    const name = `${baseName}.gif`;
                    await this.eagle.save(base64, name, folderId);
                    console.log(I18n.t('savedGif') + ":", name);
                };
                reader.readAsDataURL(blob);
            });
            gif.render();
        } catch (e) {
            console.error("handleGif error:", e);
        }
    }
}

class ArtworkPageHandler {
    constructor(eagleAPI, processor) {
        this.eagle = eagleAPI;
        this.processor = processor;
        this.buttonContainerSelector = "section section";
        this.imageSelector = "figure div[role='presentation'] div[role='presentation']";
        this.buttonPosition = "↖";
        this.storageKey = "eagle_last_folder";
    }

    async init() {
        this.buttonPosition = await GM.getValue("buttonPosition", "↖");
        await this.addToolbar();
        await this.addImageButtons();
        this.observeDomChange(() => this.addImageButtons());
    }

    async addToolbar() {
        try {
            const btnNav = await this.waitForElement(this.buttonContainerSelector);
            if (document.getElementById("save-all-to-eagle-btn")) return;

            const container = document.createElement("div");
            container.classList.add("cNcUof");

            const btn = document.createElement("button");
            btn.id = "save-all-to-eagle-btn";
            btn.textContent = I18n.t('saveAllToEagle');
            btn.className = "charcoal-button";
            btn.dataset.variant = "Primary";

            const select = await this.createFolderSelect();

            btn.onclick = async () => {
                const folderId = select.value;
                await GM.setValue(this.storageKey, folderId);
                const illustId = PixivAPI.getIllustIdFromUrl();
                if (illustId) {
                    await this.processor.downloadIllust(illustId, folderId);
                }
            };

            container.appendChild(btn);
            container.appendChild(select);
            btnNav.appendChild(container);
        } catch (e) {
            console.error(e);
        }
    }

    async addImageButtons() {
        try {
            await this.waitForElement(this.imageSelector);
            const illustId = PixivAPI.getIllustIdFromUrl();
            if (!illustId) return;

            this.buttonPosition = await GM.getValue("buttonPosition", "↖");

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

            const validPosition = positionStyles[this.buttonPosition] ? this.buttonPosition : "↖";
            const styles = positionStyles[validPosition];

            document.querySelectorAll(this.imageSelector).forEach((img, index) => {
              console.log(index)
                const btnId = `save-to-eagle-btn-${illustId}-${index}`;
                if (document.getElementById(btnId)) return;

                const container = document.createElement("div");
                container.style.cssText = "position: absolute; z-index: 1000;";
                Object.assign(container.style, styles);

                const btn = document.createElement("button");
                btn.id = btnId;
                btn.textContent = I18n.t('save');
                btn.className = "charcoal-button";
                btn.style.cssText = "padding: 6px 12px; font-size: 12px; cursor: pointer;";

                btn.onclick = async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const folderId = await GM.getValue(this.storageKey);
                    await this.processor.downloadSingleImage(illustId, index, folderId);
                };

                container.appendChild(btn);
                img.parentElement.style.position = "relative";
                img.parentElement.appendChild(container);
            });
        } catch (e) {
            console.error(I18n.t('cannotAddButton') + ":", e);
        }
    }

    async createFolderSelect() {
        const select = document.createElement("select");
        select.id = "eagle-folder-select";
        select.style.marginLeft = "8px";

        const lastFolderId = await GM.getValue(this.storageKey);
        const folders = await this.eagle.getFolderList();

        folders.forEach(f => {
            const option = document.createElement("option");
            option.value = f.id;
            option.textContent = f.name;
            if (f.id === lastFolderId) option.selected = true;
            select.appendChild(option);
        });

        select.onchange = async () => {
            await GM.setValue(this.storageKey, select.value);
        };

        return select;
    }

    async waitForElement(selector, interval = 1000) {
        return new Promise((resolve) => {
            let intervalId;
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    if (intervalId) clearInterval(intervalId);
                    resolve(element);
                }
            };
            checkElement();
            intervalId = setInterval(checkElement, interval);
        });
    }

    observeDomChange(callback) {
        const observer = new MutationObserver(() => callback());
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

class OtherPagesHandler {
    constructor(eagleAPI, processor) {
        this.eagle = eagleAPI;
        this.processor = processor;
        this.linkSelector = '[href^="/artworks/"]:has(img)';
        this.storageKey = "eagle_last_folder";
    }

    async init() {
        this.addButtonsToThumbnails();
        this.observeDomChange(() => this.addButtonsToThumbnails());
    }

    addButtonsToThumbnails() {
        const links = document.querySelectorAll(this.linkSelector);
        for (const link of links) {
            const illustId = link.href.match(/artworks\/(\d+)/)?.[1];
            if (!illustId) continue;

            let sibling = link.nextElementSibling;
            let nextDiv = null;
            while (sibling) {
                if (sibling.tagName.toUpperCase() === 'DIV' && sibling.querySelector('button')) {
                    nextDiv = sibling;
                    break;
                }
                sibling = sibling.nextElementSibling;
            }
            if (!nextDiv) continue;

            const btnId = `eagle-btn-${illustId}`;
            if (document.getElementById(btnId)) continue;

            const btn = document.createElement("button");
            btn.id = btnId;
            btn.textContent = "﹀";
            btn.className = "charcoal-button eagle-download-btn";
            btn.style.cssText = "margin-top: 4px; width: 100%; padding: 6px; font-size: 14px; cursor: pointer;";
            btn.title = I18n.t('saveAllToEagle');
            btn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const folderId = await GM.getValue(this.storageKey);
                await this.processor.downloadIllust(illustId, folderId);
            };
            nextDiv.appendChild(btn);
        }
    }

    observeDomChange(callback) {
        const observer = new MutationObserver(() => callback());
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

class I18n {
    static translations = {
        'zh-TW': {
            saveToEagle: '儲存至 Eagle',
            saveAllToEagle: '全部儲存至 Eagle',
            save: '儲存',
            selectButtonPosition: '選擇按鈕位置',
            buttonPosition: '按鈕位置：',
            confirm: '確定',
            saved: '已送到 Eagle',
            savedMultiple: '已送 {count} 張到 Eagle',
            savedGif: '已送動圖到 Eagle',
            addedSuccess: '✅ 已新增',
            parseFolderFailed: '解析資料夾列表失敗',
            cannotAddButton: '無法新增按鈕'
        },
        'en': {
            saveToEagle: 'Save to Eagle',
            saveAllToEagle: 'Save All to Eagle',
            save: 'Save',
            selectButtonPosition: 'Select Button Position',
            buttonPosition: 'Button Position:',
            confirm: 'Confirm',
            saved: 'Saved to Eagle',
            savedMultiple: 'Saved {count} images to Eagle',
            savedGif: 'Saved GIF to Eagle',
            addedSuccess: '✅ Added',
            parseFolderFailed: 'Failed to parse folder list',
            cannotAddButton: 'Cannot add button'
        },
        'ja': {
            saveToEagle: 'Eagleに保存',
            saveAllToEagle: 'すべてEagleに保存',
            save: '保存',
            selectButtonPosition: 'ボタン位置を選択',
            buttonPosition: 'ボタン位置：',
            confirm: '確定',
            saved: 'Eagleに保存しました',
            savedMultiple: '{count}枚をEagleに保存しました',
            savedGif: 'GIFをEagleに保存しました',
            addedSuccess: '✅ 追加しました',
            parseFolderFailed: 'フォルダリストの解析に失敗しました',
            cannotAddButton: 'ボタンを追加できません'
        }
    };

    static detectLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('zh-TW') || lang.startsWith('zh-Hant')) return 'zh-TW';
        if (lang.startsWith('ja')) return 'ja';
        return 'en';
    }

    static currentLang = I18n.detectLanguage();

    static t(key, params = {}) {
        let text = I18n.translations[I18n.currentLang]?.[key] || I18n.translations['en'][key] || key;
        Object.keys(params).forEach(k => {
            text = text.replace(`{${k}}`, params[k]);
        });
        return text;
    }
}

new JohnThePostcardSalesman();
