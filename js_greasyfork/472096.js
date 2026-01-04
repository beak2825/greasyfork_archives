// ==UserScript==
// @name         Kemer Enhance
// @name:zh-TW   Kemer 增強
// @name:zh-CN   Kemer 增强
// @name:ja      Kemer 強化
// @name:ko      Kemer 강화
// @name:ru      Kemer Улучшение
// @name:en      Kemer Enhance
// @version      2025.11.12
// @author       Canaan HS
// @description        美化介面與操作增強，增加額外功能，提供更好的使用體驗
// @description:zh-TW  美化介面與操作增強，增加額外功能，提供更好的使用體驗
// @description:zh-CN  美化界面与操作增强，增加额外功能，提供更好的使用体验
// @description:ja     インターフェースを美化し操作を強化、追加機能により、より良い使用体験を提供します
// @description:ko     인터페이스를 미화하고 조작을 강화하며, 추가 기능을 통해 더 나은 사용 경험을 제공합니다
// @description:ru     Улучшение интерфейса и функций управления, добавление дополнительных возможностей для лучшего опыта использования
// @description:en     Beautify interface and enhance operations, add extra features, and provide a better user experience

// @connect      *
// @match        *://kemono.cr/*
// @match        *://coomer.st/*
// @match        *://nekohouse.su/*

// @license      MPL-2.0
// @namespace    https://greasyfork.org/users/989635
// @supportURL   https://github.com/Canaan-HS/MonkeyScript/issues
// @icon         https://cdn-icons-png.flaticon.com/512/2566/2566449.png

// @resource     pako https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js

// @require      https://update.greasyfork.org/scripts/487608/1677884/SyntaxLite_min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/preact/10.27.1/preact.umd.min.js

// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener

// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/472096/Kemer%20%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/472096/Kemer%20%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(async function () {
    const User_Config = {
        Global: {
            BlockAds: true, // 阻擋廣告
            CacheFetch: true, // 緩存 Fetch 請求 (僅限 JSON)
            DeleteNotice: true, // 刪除上方公告
            SidebarCollapse: true, // 側邊攔摺疊
            KeyScroll: { mode: 1, enable: true }, // 上下鍵觸發自動滾動 [mode: 1 = 動畫偵滾動, mode: 2 = 間隔滾動] (選擇對於自己較順暢的)
            TextToLink: { // 連結的 (文本 -> 超連結)
                enable: true,
                newtab: true, // 新選項卡開啟
                newtab_active: false, // 切換焦點到新選項卡
                newtab_insert: true, // 選項卡插入到當前選項卡的正後方
            },
            BetterPostCard: { // 修復名稱|自訂名稱|外部 TAG 跳轉|快速預覽內容
                enable: true,
                previewAbove: true, // 快速預覽展示於帖子上方
                enableNameTools: true, // 啟用名稱工具 (修復名稱|自訂名稱|外部 TAG 跳轉)
                /* 以下配置僅在啟用名稱工具時生效 */
                newtab: true,
                newtab_active: true,
                newtab_insert: true,
            },
        },
        Preview: {
            CardZoom: { mode: 3, enable: true }, // 縮放預覽卡大小 [mode: 1 = 卡片放大 , 2 = 卡片放大 + 懸浮縮放, 3 = 卡片放大 + 自動縮放]
            CardText: { mode: 2, enable: true }, // 預覽卡文字效果 [mode: 1 = 隱藏文字 , 2 = 淡化文字]
            BetterThumbnail: true, // 替換成內頁縮圖 (nekohouse 不支援)
            QuickPostToggle: true, // 快速切換帖子 (僅支援 nekohouse)
            NewTabOpens: { // 預覽頁面的帖子都以新分頁開啟
                enable: true,
                newtab_active: false,
                newtab_insert: true,
            },
        },
        Content: {
            ExtraButton: true, // 額外的下方按鈕
            LinkBeautify: true, // 下載連結美化, 當出現 (browse »), 滑鼠懸浮會直接顯示內容, 並移除多餘的字串
            CommentFormat: true, // 評論區重新排版
            VideoBeautify: { mode: 1, enable: true }, // 影片美化 [mode: 1 = 複製下載節點 , 2 = 移動下載節點]
            OriginalImage: { // 自動原圖 [mode: 1 = 快速自動 , 2 = 慢速自動 , 3 = 觀察後觸發]
                mode: 1,
                enable: true,
                experiment: false, // 實驗性替換方式
            }
        }
    };
    const Parame = {
        Url: Lib.$url,
        DB: await Lib.openDB("KemerEnhanceDB", 1, GM_getResourceText("pako")),
        OriginalApi: `https://${Lib.$domain}/data`,
        ThumbnailApi: `https://${Lib.$domain}/thumbnail/data`,
        SaveKey: {
            Img: "ImgStyle",
            Lang: "Language",
            Menu: "MenuPoint"
        },
        Artists: new RegExp(".+(?<!favorites)\\/artists.*"),
        Links: /.+\/user\/[^\/]+\/links.*/,
        Recommended: /.+\/user\/[^\/]+\/recommended.*/,
        FavoritesArtists: /.+\/favorites\/artists.*/,
        Posts: new RegExp(".+(?<!favorites)\\/posts.*"),
        User: /.+\/user\/[^\/]+(\?.*)?$/,
        FavorPosts: /.+\/favorites\/posts.*/,
        Dms: /.+\/dms(\?.*)?$/,
        Announcement: /.+\/user\/[^\/]+\/announcements.*/,
        Content: /.+\/user\/.+\/post\/.+$/,
        Registered: new Set(),
        SupportImg: new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "avif", "heic", "svg"]),
        VideoType: new Set(["mp4", "avi", "mkv", "mov", "flv", "wmv", "webm", "mpg", "mpeg", "m4v", "ogv", "3gp", "asf", "ts", "vob", "rm", "rmvb", "m2ts", "f4v", "mts", "mpe", "mpv", "m2v", "m4a", "bdmv", "ifo", "r3d", "braw", "cine", "qt", "f4p", "swf", "mng", "gifv", "yuv", "roq", "nsv", "amv", "svi", "mod", "mxf", "ogg"])
    };
    const Page = {
        isContent: () => Parame.Content.test(Parame.Url),
        isAnnouncement: () => Parame.Announcement.test(Parame.Url) || Parame.Dms.test(Parame.Url),
        isSearch: () => Parame.Artists.test(Parame.Url) || Parame.Links.test(Parame.Url) || Parame.Recommended.test(Parame.Url) || Parame.FavoritesArtists.test(Parame.Url),
        isPreview: () => Parame.Posts.test(Parame.Url) || Parame.User.test(Parame.Url) || Parame.FavorPosts.test(Parame.Url),
        isNeko: Lib.$domain.startsWith("nekohouse")
    };
    const Load = (() => {
        const color = {
            kemono: "#e8a17d !important",
            coomer: "#99ddff !important",
            nekohouse: "#bb91ff !important"
        }[Lib.$domain.split(".")[0]];
        const userSet = {
            menuSet: () => Lib.getV(Parame.SaveKey.Menu, {
                Top: "10vh",
                Left: "10vw"
            }),
            imgSet: () => Lib.getV(Parame.SaveKey.Img, {
                Width: "auto",
                Height: "auto",
                Spacing: "0px",
                MaxWidth: "100%"
            })
        };
        return {
            ...userSet,
            color: color
        };
    })();
    async function SidebarCollapse() {
        if (Lib.platform.mobile) return;
        Lib.addStyle(`
        .global-sidebar {
            opacity: 0;
            height: 100%;
            width: 10rem;
            display: flex;
            position: fixed;
            padding: 0.5em 0;
            transition: 0.8s;
            background: #282a2e;
            flex-direction: column;
            transform: translateX(-9rem);
        }
        .global-sidebar:hover {opacity: 1; transform: translateX(0rem);}
        .content-wrapper.shifted {transition: 0.7s; margin-left: 0rem;}
        .global-sidebar:hover + .content-wrapper.shifted {margin-left: 10rem;}
    `, "Collapse-Effects", false);
    }
    async function DeleteNotice() {
        Lib.waitEl("#announcement-banner", null, {
            throttle: 50,
            timeout: 10
        }).then(announcement => announcement.remove());
    }
    async function KeyScroll({
        mode
    }) {
        if (Lib.platform.mobile || Parame.Registered.has("KeyScroll")) return;
        const scrollConfig = {
            scrollPixel: 2,
            scrollInterval: 800
        };
        const upScrollSpeed = scrollConfig.scrollPixel * -1;
        let scrollFunc, isUpScroll = false, isDownScroll = false;
        const [topDetected, bottomDetected] = [Lib.$throttle(() => {
            isUpScroll = Lib.sY == 0 ? false : true;
        }, 600), Lib.$throttle(() => {
            isDownScroll = Lib.sY + Lib.iH >= Lib.html.scrollHeight ? false : true;
        }, 600)];
        switch (mode) {
            case 2:
                scrollFunc = Move => {
                    const Interval = setInterval(() => {
                        if (!isUpScroll && !isDownScroll) {
                            clearInterval(Interval);
                        }
                        if (isUpScroll && Move < 0) {
                            window.scrollBy(0, Move);
                            topDetected();
                        } else if (isDownScroll && Move > 0) {
                            window.scrollBy(0, Move);
                            bottomDetected();
                        }
                    }, scrollConfig.scrollInterval);
                };

            default:
                scrollFunc = Move => {
                    if (isUpScroll && Move < 0) {
                        window.scrollBy(0, Move);
                        topDetected();
                        requestAnimationFrame(() => scrollFunc(Move));
                    } else if (isDownScroll && Move > 0) {
                        window.scrollBy(0, Move);
                        bottomDetected();
                        requestAnimationFrame(() => scrollFunc(Move));
                    }
                };
        }
        Lib.onEvent(window, "keydown", Lib.$throttle(event => {
            const key = event.key;
            if (key == "ArrowUp") {
                event.stopImmediatePropagation();
                event.preventDefault();
                if (isUpScroll) {
                    isUpScroll = false;
                } else if (!isUpScroll || isDownScroll) {
                    isDownScroll = false;
                    isUpScroll = true;
                    scrollFunc(upScrollSpeed);
                }
            } else if (key == "ArrowDown") {
                event.stopImmediatePropagation();
                event.preventDefault();
                if (isDownScroll) {
                    isDownScroll = false;
                } else if (isUpScroll || !isDownScroll) {
                    isUpScroll = false;
                    isDownScroll = true;
                    scrollFunc(scrollConfig.scrollPixel);
                }
            }
        }, 100), {
            capture: true
        });
        Parame.Registered.add("KeyScroll");
    }
    async function BlockAds() {
        if (Page.isNeko) return;
        const cookieString = Lib.cookie();
        const required = ["ts_popunder", "ts_popunder-cnt"];
        const hasCookies = required.every(name => new RegExp(`(?:^|;\\s*)${name}=`).test(cookieString));
        if (!hasCookies) {
            const now = new Date();
            now.setFullYear(now.getFullYear() + 1);
            const expires = now.toUTCString();
            const cookies = {
                [required[0]]: now,
                [required[1]]: 1
            };
            for (const [key, value] of Object.entries(cookies)) {
                Lib.cookie(`${key}=${value}; domain=.${Lib.$domain}; path=/; expires=${expires};`);
            }
        }
        if (Parame.Registered.has("BlockAds")) return;
        Lib.addStyle(`
        .root--ujvuu, [id^="ts_ad_native_"], [id^="ts_ad_video_"] {display: none !important}
    `, "Ad-blocking-style");
        const domains = new Set(["go.mnaspm.com", "go.reebr.com", "creative.reebr.com", "tsyndicate.com", "tsvideo.sacdnssedge.com"]);
        const originalRequest = unsafeWindow.XMLHttpRequest;
        unsafeWindow.XMLHttpRequest = new Proxy(originalRequest, {
            construct: function (target, args) {
                const xhr = new target(...args);
                return new Proxy(xhr, {
                    get: function (target2, prop, receiver) {
                        if (prop === "open") {
                            return function (method, url) {
                                try {
                                    if (typeof url !== "string" || url.endsWith(".m3u8")) return;
                                    if ((url.startsWith("http") || url.startsWith("//")) && domains.has(new URL(url).host)) return;
                                } catch { }
                                return target2[prop].apply(target2, arguments);
                            };
                        }
                        return Reflect.get(target2, prop, receiver);
                    }
                });
            }
        });
        Parame.Registered.add("BlockAds");
    }
    async function CacheFetch() {
        if (Page.isNeko || Parame.Registered.has("CacheFetch")) return;
        const cacheKey = "fetch_cache_data";
        const cache = await Parame.DB.get(cacheKey, new Map());
        const saveCache = Lib.$debounce(() => {
            Parame.DB.set(cacheKey, cache, {
                expireStr: "5m"
            });
        }, 1e3);
        const originalFetch = {
            Sandbox: window.fetch,
            Window: unsafeWindow.fetch
        };
        window.fetch = (...args) => fetchWrapper(originalFetch.Sandbox, ...args);
        unsafeWindow.fetch = (...args) => fetchWrapper(originalFetch.Window, ...args);
        async function fetchWrapper(windowContext, ...args) {
            const input = args[0];
            const options = args[1] || {};
            if (!input) return windowContext(...args);
            const url = typeof input === "string" ? input : input.url;
            const method = options.method || (typeof input === "object" ? input.method : "GET") || "GET";
            if (method.toUpperCase() !== "GET" || options.headers?.["X-Bypass-CacheFetch"] || url.endsWith("random")) {
                return windowContext(...args);
            }
            if (cache.has(url)) {
                const cached = cache.get(url);
                return new Response(cached.body, {
                    status: cached.status,
                    headers: cached.headers
                });
            }
            try {
                const response = await windowContext(...args);
                if (response.status === 200 && (url.includes("api") || url.includes("default_config"))) {
                    (async () => {
                        try {
                            const responseClone = response.clone();
                            const bodyText = await responseClone.text();
                            if (bodyText) {
                                cache.set(url, {
                                    body: bodyText,
                                    status: responseClone.status,
                                    headers: responseClone.headers
                                });
                                saveCache();
                            }
                        } catch { }
                    })();
                }
                return response;
            } catch (error) {
                throw error;
            }
        }
        Parame.Registered.add("CacheFetch");
    }
    function megaUtils(urlRegex) {
        const megaPDecoder = (() => {
            const encoder = new TextEncoder();
            const ITER = 1e5;
            const urlBase64ToBase64 = s => s.replace(/-/g, "+").replace(/_/g, "/").replace(/,/g, "");
            function base64ToBytes(b64) {
                try {
                    const raw = atob(b64);
                    const n = raw.length;
                    const out = new Uint8Array(n);
                    for (let i = 0; i < n; i++) out[i] = raw.charCodeAt(i);
                    return out;
                } catch (e) {
                    return null;
                }
            }
            function bytesToBase64Url(bytes) {
                let bin = "";
                for (let i = 0, L = bytes.length; i < L; i++) bin += String.fromCharCode(bytes[i]);
                let b64 = btoa(bin);
                return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            function equalBytesConstTime(a, b) {
                if (!a || !b || a.length !== b.length) return false;
                let r = 0;
                for (let i = 0, L = a.length; i < L; i++) r |= a[i] ^ b[i];
                return r === 0;
            }
            function xorInto(a, b) {
                const n = a.length;
                const out = new Uint8Array(n);
                for (let i = 0; i < n; i++) out[i] = a[i] ^ b[i];
                return out;
            }
            async function importPwKey(password) {
                return crypto.subtle.importKey("raw", encoder.encode(password), {
                    name: "PBKDF2"
                }, false, ["deriveBits"]);
            }
            async function deriveDK(pwKey, salt) {
                const bits = await crypto.subtle.deriveBits({
                    name: "PBKDF2",
                    salt: salt,
                    iterations: ITER,
                    hash: "SHA-512"
                }, pwKey, 512);
                return new Uint8Array(bits);
            }
            async function importMacKey(raw) {
                return crypto.subtle.importKey("raw", raw, {
                    name: "HMAC",
                    hash: "SHA-256"
                }, false, ["sign"]);
            }
            return async (pFragmentOrFull, password) => {
                try {
                    if (!pFragmentOrFull || !password) return pFragmentOrFull;
                    let s = String(pFragmentOrFull);
                    const idx = s.indexOf("#P!");
                    if (idx >= 0) s = s.slice(idx + 3);
                    if (s.toUpperCase().startsWith("P!")) s = s.slice(2);
                    let b64 = urlBase64ToBase64(s);
                    const mod = b64.length % 4;
                    if (mod !== 0) b64 += "=".repeat(4 - mod);
                    const data = base64ToBytes(b64);
                    if (!data || data.length < 1 + 1 + 6 + 32 + 32) {
                        return pFragmentOrFull;
                    }
                    const algorithm = data[0];
                    const type = data[1];
                    const publicHandle = data.subarray(2, 8);
                    const salt = data.subarray(8, 40);
                    const macTag = data.subarray(data.length - 32);
                    const encryptedKey = data.subarray(40, data.length - 32);
                    const keyLen = encryptedKey.length;
                    const pwKey = await importPwKey(password);
                    const dk = await deriveDK(pwKey, salt);
                    if (dk.length < 64 || dk.length < 32 + 32) {
                        return pFragmentOrFull;
                    }
                    const xorKey = dk.subarray(0, keyLen);
                    const macKey = dk.subarray(32, 64);
                    const recoveredKey = xorInto(encryptedKey, xorKey);
                    const msgLen = 1 + 1 + publicHandle.length + salt.length + encryptedKey.length;
                    const msg = new Uint8Array(msgLen);
                    let off = 0;
                    msg[off++] = algorithm;
                    msg[off++] = type;
                    msg.set(publicHandle, off);
                    off += publicHandle.length;
                    msg.set(salt, off);
                    off += salt.length;
                    msg.set(encryptedKey, off);
                    const macCryptoKey = await importMacKey(macKey);
                    const macBuffer = await crypto.subtle.sign("HMAC", macCryptoKey, msg);
                    const mac = new Uint8Array(macBuffer);
                    if (!equalBytesConstTime(mac, macTag)) {
                        return pFragmentOrFull;
                    }
                    const handleB64Url = bytesToBase64Url(publicHandle);
                    const keyB64Url = bytesToBase64Url(recoveredKey);
                    const fileType = type === 0 ? "folder" : "file";
                    return `https://mega.nz/${fileType}/${handleB64Url}#${keyB64Url}`;
                } catch (e) {
                    return pFragmentOrFull;
                }
            };
        })();
        const getDecryptedUrl = async (url, password) => await megaPDecoder(url, password);
        const encryptedExtract = /(https?:\/\/mega\.nz\/#P![A-Za-z0-9_!F-]+).*?(?:Password|Pass|Key)\b[\s:]*(?:<[^>]+>)?([\p{L}\p{N}\p{P}_-]+)(?:<[^>]+>)?/gisu;
        function extractPasswords(data) {
            const result = {};
            if (typeof data === "string") {
                let match;
                while ((match = encryptedExtract.exec(data)) !== null) {
                    result[match[1]] = match[2]?.trim() ?? "";
                }
            }
            return result;
        }
        const getCompleteUrl = (url, key) => {
            const {
                state,
                href
            } = parsePassword(url, key);
            return state ? href : url;
        };
        const missingExtract = /((?:https?:\/\/)?mega\.nz\/(?:file|folder)\/)(?![A-Za-z0-9_-]{8}#[A-Za-z0-9_-]{16,43}(?![A-Za-z0-9_-]))([A-Za-z0-9_-]{8}(?![A-Za-z0-9_-])|)(?:(?:(?!#?[A-Za-z0-9_-]{16,43}(?![A-Za-z0-9_-]))[\s\S])*?([A-Za-z0-9_-]{8}#[A-Za-z0-9_-]{16,43}|#?[A-Za-z0-9_-]{16,43})(?![A-Za-z0-9_-]))?/gi;
        function extractMissingKey(data) {
            const result = {};
            if (typeof data === "string") {
                let match;
                while ((match = missingExtract.exec(data)) !== null) {
                    result[match[1] + match[2]] = match[3] || "";
                }
            }
            return result;
        }
        const passwordCleaner = text => text.match(/^(Password|Pass|Key)\s*:?\s*(.*)$/i)?.[2]?.trim() ?? "";
        function parsePassword(href, text) {
            let state = false;
            if (!text) return {
                state: state,
                href: href
            };
            const lowerText = text.toLowerCase();
            if (text.startsWith("#")) {
                state = true;
                href += text;
            } else if (/^[A-Za-z0-9_-]{16,43}$/.test(text)) {
                state = true;
                href += "#" + text;
            } else if (lowerText.startsWith("pass") || lowerText.startsWith("key")) {
                const key = passwordCleaner(text);
                if (key) {
                    state = true;
                    href += "#" + key;
                }
            }
            return {
                state: state,
                href: href.match(urlRegex)?.[0] ?? href
            };
        }
        async function getPassword(node, href) {
            let state;
            const nextNode = node.nextSibling;
            if (nextNode) {
                if (nextNode.nodeType === Node.TEXT_NODE) {
                    ({
                        state,
                        href
                    } = parsePassword(href, nextNode.$text()));
                    if (state) nextNode?.remove();
                } else if (nextNode.nodeType === Node.ELEMENT_NODE) {
                    const nodeText = [...nextNode.childNodes].find(node2 => node2.nodeType === Node.TEXT_NODE)?.$text() ?? "";
                    ({
                        state,
                        href
                    } = parsePassword(href, nodeText));
                }
            }
            return href;
        }
        return {
            getPassword: getPassword,
            getCompleteUrl: getCompleteUrl,
            getDecryptedUrl: getDecryptedUrl,
            extractPasswords: extractPasswords,
            extractMissingKey: extractMissingKey
        };
    }
    const TextToLinkFactory = () => {
        let mega;
        const exclusionRegex = /onfanbokkusuokibalab\.net/;
        const urlRegex = /(?:(?:https?|ftp|mailto|file|data|blob|ws|wss|ed2k|thunder):\/\/|(?:[-\w]+\.)+[a-zA-Z]{2,}(?:\/|$)|\w+@[-\w]+\.[a-zA-Z]{2,})[^\s]*?(?=[{}「」『』【】\[\]（）()<>、"'，。！？；：…—～~]|$|\s)/gi;
        const exclusionTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "CANVAS", "IFRAME", "AUDIO", "VIDEO", "EMBED", "OBJECT", "SOURCE", "TRACK", "CODE", "KBD", "SAMP", "TEMPLATE", "SLOT", "PARAM", "META", "LINK", "IMG", "PICTURE", "FIGURE", "FIGCAPTION", "MATH", "PORTAL", "METER", "PROGRESS", "OUTPUT", "TEXTAREA", "SELECT", "OPTION", "DATALIST", "FIELDSET", "LEGEND", "MAP", "AREA"]);
        const urlMatch = str => {
            urlRegex.lastIndex = 0;
            return urlRegex.test(str);
        };
        const uriFormat1 = /^[a-zA-Z][\w+.-]*:\/\//;
        const uriFormat2 = /^[a-zA-Z][\w+.-]*:/;
        const uriFormat3 = /^([\w-]+\.)+[a-z]{2,}(\/|$)/i;
        const uriFormat4 = /^\/\//;
        const protocolParse = uri => {
            if (uriFormat1.test(uri) || uriFormat2.test(uri)) return uri;
            if (uriFormat3.test(uri)) return "https://" + uri;
            if (uriFormat4.test(uri)) return "https:" + uri;
            return uri;
        };
        const jumpTrigger = async (root, {
            newtab,
            newtab_active,
            newtab_insert
        }) => {
            const [active, insert] = [newtab_active, newtab_insert];
            Lib.onEvent(root, "click", event => {
                const target = event.target.closest("a:not(.fileThumb)");
                if (!target || target.$hAttr("download")) return;
                event.preventDefault();
                !newtab ? location.assign(target.href) : GM_openInTab(target.href, {
                    active: active,
                    insert: insert
                });
            }, {
                capture: true
            });
        };
        const getTextNodeMap = root => {
            const nodes = new Map();
            const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                acceptNode: node2 => {
                    const parentElement = node2.parentElement;
                    if (!parentElement || exclusionTags.has(parentElement.tagName)) return NodeFilter.FILTER_REJECT;
                    const content = node2.$text();
                    if (!content || exclusionRegex.test(content)) return NodeFilter.FILTER_REJECT;
                    return content === "(frame embed)" || urlMatch(content) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            });
            let node, parent, pack;
            while (node = tree.nextNode()) {
                parent = node.parentElement;
                pack = nodes.get(parent);
                if (pack === void 0) {
                    pack = [];
                    nodes.set(parent, pack);
                }
                pack.push(node);
            }
            return nodes;
        };
        async function parseModify(container, father, text, textNode = null, complex = false) {
            let modifyUrl, passwordDict = {}, missingDict = {};
            if (text === "(frame embed)") {
                const a = father.closest("a");
                if (!a) return;
                const href = a.href;
                if (!href) return;
                if (href.includes("mega.nz")) {
                    mega ??= megaUtils(urlRegex);
                    text = container.$oHtml();
                    missingDict = mega.extractMissingKey(text);
                    passwordDict = mega.extractPasswords(text);
                }
                if (missingDict[href]) modifyUrl = mega.getCompleteUrl(href, missingDict[href]);
                if (passwordDict[href]) modifyUrl = await mega.getDecryptedUrl(href, passwordDict[href]);
                if (modifyUrl && modifyUrl !== href) {
                    a.href = modifyUrl;
                    a.$text(modifyUrl);
                } else {
                    a.$text(href);
                }
            } else if (complex) {
                textNode.replaceWith(Lib.createDomFragment(text.replace(urlRegex, url => {
                    const decode = decodeURIComponent(url).trim();
                    return `<a href="${protocolParse(decode)}" rel="noopener noreferrer">${decode}</a>`;
                })));
            } else {
                if (text.match(urlRegex).length === 0) return;
                if (text.includes("mega.nz")) {
                    mega ??= megaUtils(urlRegex);
                    missingDict = mega.extractMissingKey(text);
                    passwordDict = mega.extractPasswords(text);
                }
                let url, index, lastIndex = 0;
                const segments = [];
                for (const match of text.matchAll(urlRegex)) {
                    url = match[0];
                    index = match.index;
                    if (index > lastIndex) segments.push(text.slice(lastIndex, index));
                    modifyUrl = decodeURIComponent(url).trim();
                    if (missingDict[url]) modifyUrl = mega.getCompleteUrl(url, missingDict[url]);
                    if (passwordDict[url]) modifyUrl = await mega.getDecryptedUrl(url, passwordDict[url]);
                    segments.push(`<a href="${protocolParse(modifyUrl)}" rel="noopener noreferrer">${modifyUrl}</a>`);
                    lastIndex = index + url.length;
                }
                if (lastIndex < text.length) {
                    segments.push(text.slice(lastIndex));
                }
                father.tagName === "A" ? father.replaceWith(Lib.createDomFragment(segments.join(""))) : father.$iHtml(segments.join(""));
            }
        }
        return {
            async TextToLink(config) {
                if (!Page.isContent() && !Page.isAnnouncement()) return;
                let parentNode, text, textNode, data, isComplex;
                if (Page.isContent()) {
                    Lib.waitEl(".post__body, .scrape__body", null).then(async body => {
                        let [article, content] = [body.$q("article"), body.$q(".post__content, .scrape__content")];
                        if (article) {
                            jumpTrigger(content, config);
                            let span;
                            for (span of article.$qa("span.choice-text")) {
                                parseModify(article, span, span.$text());
                            }
                        } else if (content) {
                            jumpTrigger(content, config);
                            for ([parentNode, data] of getTextNodeMap(content).entries()) {
                                isComplex = parentNode.childElementCount >= 1 || data.length > 1;
                                for (textNode of data) {
                                    text = textNode.$text();
                                    if (text.startsWith("https://mega.nz")) {
                                        mega ??= megaUtils(urlRegex);
                                        text = await mega.getPassword(parentNode, text);
                                    }
                                    parseModify(content, parentNode, text, textNode, isComplex);
                                }
                            }
                        } else {
                            const attachments = body.$q(".post__attachments, .scrape__attachments");
                            attachments && jumpTrigger(attachments, config);
                        }
                    });
                } else if (Page.isAnnouncement()) {
                    Lib.waitEl(".card-list__items pre", null, {
                        raf: true
                    }).then(() => {
                        const items = Lib.$q(".card-list__items");
                        jumpTrigger(items, config);
                        for ([parentNode, data] of getTextNodeMap(items).entries()) {
                            isComplex = parentNode.childElementCount >= 1 || data.length > 1;
                            for (textNode of data) {
                                text = textNode.$text();
                                parseModify(items, parentNode, text, textNode, isComplex);
                            }
                        }
                    });
                }
            }
        };
    };
    const Fetch = (() => {
        const responseRule = {
            text: res => res.text(),
            json: res => res.json(),
            blob: res => res.blob(),
            arrayBuffer: res => res.arrayBuffer(),
            formData: res => res.formData(),
            document: async res => {
                res = await res.text();
                return Lib.domParse(res);
            }
        };
        const fetchRecord = {};
        const abort = url => {
            fetchRecord[url]?.abort();
            delete fetchRecord[url];
        };
        async function send(url, callback, {
            responseType = "json",
            headers = {
                Accept: "text/css"
            }
        } = {}) {
            fetchRecord[url]?.abort();
            const controller = new AbortController();
            fetchRecord[url] = controller;
            return new Promise((resolve, reject) => {
                fetch(url, {
                    headers: headers,
                    signal: controller.signal
                }).then(async response => {
                    if (!response.ok) {
                        const text = await response.text();
                        throw new Error(`
Fetch failed
url: ${response.url}
status: ${response.status}
statusText: ${text}`);
                    }
                    try {
                        return await responseRule[responseType](response);
                    } catch { }
                }).then(res => {
                    resolve(res);
                    callback?.(res);
                }).catch(error => {
                    if (error.name === "AbortError") return;
                    reject(error);
                    Lib.log(error).error;
                }).finally(() => {
                    delete fetchRecord[url];
                });
            });
        }
        return {
            abort: abort,
            send: send
        };
    })();
    const BetterPostCardFactory = async () => {
        const oldKey = "fix_record_v2";
        const recordKey = "better_post_record";
        const oldRecord = Lib.getLocal(oldKey);
        if (oldRecord instanceof Array) {
            const r = await Parame.DB.set(recordKey, new Map(oldRecord));
            r === recordKey && Lib.delLocal(oldKey);
        }
        let recordCache;
        const fixCache = new Map();
        const init = async () => {
            recordCache = await getRecord();
        };
        const getRecord = async () => await Parame.DB.get(recordKey, new Map());
        const saveRecord = async save => {
            await Parame.DB.set(recordKey, new Map([...await getRecord(), ...save]));
            fixCache.clear();
        };
        const saveWork = Lib.$debounce(() => saveRecord(fixCache), 1e3);
        const fixRequest = async (url, headers = {}) => {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    responseType: "json",
                    onload: response => resolve(response),
                    onerror: () => resolve(),
                    ontimeout: () => resolve()
                });
            });
        };
        const replaceUrlTail = (url, tail) => {
            const uri = new URL(url);
            uri.pathname = tail;
            url = uri.href;
            return url;
        };
        const uriFormat1 = /\/([^\/]+)\/(?:user|server|creator|fanclubs)\/([^\/?]+)/;
        const uriFormat2 = /\/([^\/]+)\/([^\/]+)$/;
        const uriFormat3 = /^https?:\/\/([^.]+)\.([^.]+)\./;
        const specialServer = {
            x: "twitter",
            maker_id: "dlsite"
        };
        const supportServer = /Gumroad|Patreon|Fantia|Pixiv|Fanbox|CandFans|Twitter|Boosty|OnlyFans|Fansly|SubscribeStar|DLsite/i;
        const parseUrlInfo = uri => {
            uri = uri.match(uriFormat1) || uri.match(uriFormat2) || uri.match(uriFormat3);
            if (!uri) return;
            return uri.splice(1).reduce((acc, str) => {
                if (supportServer.test(str)) {
                    const cleanStr = str.replace(/\/?(www\.|\.com|\.to|\.jp|\.net|\.adult|user\?u=)/g, "");
                    acc.server = specialServer[cleanStr] ?? cleanStr;
                } else {
                    acc.user = str;
                }
                return acc;
            }, {});
        };
        const getPixivName = async id => {
            const response = await fixRequest(`https://www.pixiv.net/ajax/user/${id}?full=1&lang=ja`, {
                referer: "https://www.pixiv.net/"
            });
            if (response.status === 200) {
                const user = response.response;
                let user_name = user.body.name;
                user_name = user_name.replace(/(c\d+)?([日月火水木金土]曜日?|[123１２３一二三]日目?)[東南西北]..?\d+\w?/i, "");
                user_name = user_name.replace(/[@＠]?(fanbox|fantia|skeb|ファンボ|リクエスト|お?仕事|新刊|単行本|同人誌)+(.*(更新|募集|公開|開設|開始|発売|販売|委託|休止|停止)+中?[!！]?$|$)/gi, "");
                user_name = user_name.replace(/\(\)|（）|「」|【】|[@＠_＿]+$/g, "").trim();
                return user_name;
            } else return;
        };
        const getCandfansName = async id => {
            const response = await fixRequest(`https://candfans.jp/api/contents/get-timeline?user_id=${id}&record=1`);
            if (response.status === 200) {
                const user = response.response.data[0];
                const user_code = user?.user_code || "";
                const username = user?.username || "";
                return [user_code, username];
            } else return;
        };
        const candfansPageAdapt = (oldId, newId, oldUrl, oldName, newName) => {
            if (Page.isSearch()) {
                oldId = newId || oldId;
            } else {
                oldUrl = newId ? replaceUrlTail(oldUrl, newId) : oldUrl;
            }
            oldName = newName || oldName;
            return [oldId, oldUrl, oldName];
        };
        const supportFixName = new Set(["pixiv", "fanbox", "candfans"]);
        const supportFixTag = {
            ID: /Gumroad|Patreon|Fantia|Pixiv|Fanbox|CandFans/gi,
            NAME: /Twitter|Boosty|OnlyFans|Fansly|SubscribeStar|DLsite/gi,
            Fantia: "https://fantia.jp/fanclubs/{id}/posts",
            FantiaPost: "https://fantia.jp/posts/{id}",
            Patreon: "https://www.patreon.com/user?u={id}",
            PatreonPost: "https://www.patreon.com/posts/{id}",
            DLsite: "https://www.dlsite.com/maniax/circle/profile/=/maker_id/{name}.html",
            DLsitePost: "https://www.dlsite.com/maniax/work/=/product_id/{name}.html",
            CandFans: "https://candfans.jp/{id}",
            CandFansPost: "https://candfans.jp/posts/comment/show/{id}",
            Gumroad: "https://gumroad.com/{id}",
            Pixiv: "https://www.pixiv.net/users/{id}/artworks",
            Fanbox: "https://www.pixiv.net/fanbox/creator/{id}",
            Boosty: "https://boosty.to/{name}",
            SubscribeStar: "https://subscribestar.adult/{name}",
            Twitter: "https://x.com/{name}",
            OnlyFans: "https://onlyfans.com/{name}",
            Fansly: "https://fansly.com/{name}/posts"
        };
        async function fixUpdateUi(mainUrl, otherUrl, user, nameEl, tagEl, showText, appendTag) {
            nameEl.$sAttr("style", "display: none;");
            if (nameEl.previousElementSibling?.tagName !== "FIX_WRAPPER") {
                nameEl.$iAdjacent(`
                <fix_wrapper>
                    <fix_name jump="${mainUrl}">${showText.trim()}</fix_name>
                    <fix_edit id="${user}">Edit</fix_edit>
                </fix_wrapper>
            `, "beforebegin");
            }
            const [tag_text, support_id, support_name] = [tagEl.$text(), supportFixTag.ID, supportFixTag.NAME];
            if (!tag_text) return;
            const [mark, matchId] = support_id.test(tag_text) ? ["{id}", support_id] : support_name.test(tag_text) ? ["{name}", support_name] : ["", null];
            if (!mark) return;
            tagEl.$iHtml(tag_text.replace(matchId, tag => {
                let supported = false;
                const supportFormat = appendTag ? (supported = supportFixTag[`${tag}${appendTag}`],
                    supported ? (user = parseUrlInfo(otherUrl).user, supported) : supportFixTag[tag]) : supportFixTag[tag];
                return `<fix_tag jump="${supportFormat.replace(mark, user)}">${tag}</fix_tag>`;
            }));
        }
        async function fixTrigger(data) {
            let {
                mainUrl,
                otherUrl,
                server,
                user,
                nameEl,
                tagEl,
                appendTag
            } = data;
            let recordName = recordCache?.get(user);
            if (recordName) {
                if (server === "candfans") {
                    [user, mainUrl, recordName] = candfansPageAdapt(user, recordName[0], mainUrl, nameEl.$text(), recordName[1]);
                }
                fixUpdateUi(mainUrl, otherUrl, user, nameEl, tagEl, recordName, appendTag);
            } else {
                if (supportFixName.has(server)) {
                    if (server === "candfans") {
                        const [user_code, username] = await getCandfansName(user) ?? nameEl.$text();
                        if (user_code && username) fixCache.set(user, [user_code, username]);
                        [user, mainUrl, recordName] = candfansPageAdapt(user, user_code, mainUrl, nameEl.$text(), username);
                        fixUpdateUi(mainUrl, otherUrl, user, nameEl, tagEl, username, appendTag);
                    } else {
                        const username = await getPixivName(user) ?? nameEl.$text();
                        fixUpdateUi(mainUrl, otherUrl, user, nameEl, tagEl, username, appendTag);
                        fixCache.set(user, username);
                    }
                    saveWork();
                } else {
                    fixUpdateUi(mainUrl, otherUrl, user, nameEl, tagEl, nameEl.$text(), appendTag);
                }
            }
        }
        async function searchFix(items) {
            items.$sAttr("fix", true);
            const url = items.href;
            const img = items.$q("img");
            const {
                server,
                user
            } = parseUrlInfo(url);
            img.$sAttr("jump", url);
            fixTrigger({
                mainUrl: url,
                otherUrl: "",
                server: server,
                user: user,
                nameEl: items.$q(".user-card__name"),
                tagEl: items.$q(".user-card__service"),
                appendTag: ""
            });
        }
        async function otherFix(artist, tag = "", mainUrl = null, otherUrl = null, reTag = "fix_view") {
            try {
                const parent = artist.parentElement;
                const url = mainUrl ?? parent.href;
                const {
                    server,
                    user
                } = parseUrlInfo(url);
                await fixTrigger({
                    mainUrl: url,
                    otherUrl: otherUrl,
                    server: server,
                    user: user,
                    nameEl: artist,
                    tagEl: tag,
                    appendTag: otherUrl ? "Post" : ""
                });
                parent.replaceWith(Lib.createElement(reTag, {
                    html: parent.$iHtml()
                }));
            } catch { }
        }
        async function dynamicFix(element) {
            Lib.$observer(element, async () => {
                recordCache = await getRecord();
                const checkFix = !Parame.FavoritesArtists.test(Parame.Url);
                for (const items of element.$qa(`a.user-card${checkFix ? ":not([fix])" : ""}`)) {
                    searchFix(items);
                }
            }, {
                mark: "dynamic-fix",
                subtree: false,
                debounce: 50
            });
        }
        await init();
        const color = Load.color;
        const loadStyle = async () => {
            Lib.addStyle(`
            a {
                user-drag: none;
                -webkit-user-drag: none; 
            }
            /* 搜尋頁面的樣式 */
            fix_tag:hover { color: ${color}; }
            .card-list__items a:not(article a) {
                cursor: default;
            }
            .fancy-image__image, fix_name, fix_tag, fix_edit {
                cursor: pointer;
            }
            .user-card__info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }
            fix_name {
                color: #fff;
                font-size: 28px;
                font-weight: 500;
                max-width: 320px;
                overflow: hidden;
                display: block;
                padding: .25rem .1rem;
                border-radius: .25rem;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            fix_edit {
                top: 85px;
                right: 8%;
                color: #fff;
                display: none;
                z-index: 9999;
                font-size: 1.1rem;
                font-weight: 700;
                position: absolute;
                background: #666;
                white-space: nowrap;
                padding: .25rem .5rem;
                border-radius: .25rem;
                transform: translateY(-100%);
            }
            .edit_textarea {
                color: #fff;
                display: block;
                font-size: 30px;
                padding: 6px 1px;
                line-height: 5vh;
                text-align: center;
            }
            .user-card:hover fix_edit {
                display: block;
            }
            .user-card:hover fix_name {
                background-color: ${color};
            }
            .edit_textarea ~ fix_name,
            .edit_textarea ~ fix_edit {
                display: none !important;
            }
            /* 預覽頁面的樣式 */
            fix_view {
                display: flex;
                flex-flow: wrap;
                align-items: center;
            }
            fix_view fix_name {
                font-size: 2rem;
                font-weight: 700;
                padding: .25rem 3rem;
                border-radius: .25rem;
                transition: background-color 0.3s ease;
            }
            fix_view fix_edit {
                top: 65px;
                right: 5%;
                transform: translateY(-80%);
            }
            fix_view:hover fix_name {
                background-color: ${color};
            }
            fix_view:hover fix_edit {
                display: block;
            }
            /* 內容頁面的樣式 */
            fix_cont {
                display: flex;
                height: 5rem;
                width: 15rem;
                align-items: center;
                justify-content: center;
            }
            fix_cont fix_wrapper {
                position: relative;
                display: inline-block;
                margin-top: 1.5rem;
            }
            fix_cont fix_name {
                color: ${color};
                font-size: 1.8rem;
                display: inline-block;
            }
            fix_cont fix_edit {
                top: 2.2rem;
                right: -4.2rem;
                position: absolute;
            }
            fix_cont fix_wrapper::after {
                content: "";
                position: absolute;
                width: 1.2rem;
                height: 100%;
            }
            fix_cont fix_wrapper:hover fix_name {
                background-color: #fff;
            }
            fix_cont fix_wrapper:hover fix_edit {
                display: block;
            }
            .post-show-box {
                z-index: 9999;
                cursor: pointer;
                position: absolute;
                padding: 8px 4px;
                max-width: 120%;
                min-width: 80px;
                overflow-x: auto;
                overflow-y: hidden;
                white-space: nowrap;
                border-radius: 5px;
                background: #1d1f20ff;
                border: 1px solid #fff;
            }
            .post-show-box[preview="above"] {
                bottom: 85%;
            }
            .post-show-box[preview="below"] {
                top: 85%;
            }
            .post-show-box::-webkit-scrollbar {
                display: none;
            }
            .post-show-box img {
                height: 23vh;
                margin: 0 .3rem;
                min-width: 55%;
                border: 1px solid #fff;
            }
            .fancy-image__image {
                z-index: 1;
                position: relative;
            }
            .fancy-image__picture:before {
                content: "";
                z-index: 0;
                bottom: 10%;
                width: 100px;
                height: 115px;
                position: absolute;
            }
        `, "Better-Post-Card-Effects", false);
        };
        return {
            async BetterPostCard({
                newtab,
                newtab_active,
                newtab_insert,
                previewAbove,
                enableNameTools
            }) {
                loadStyle();
                if (Lib.platform.desktop) {
                    let currentBox, currentTarget;
                    Lib.onEvent(Lib.body, "mouseover", Lib.$debounce(event => {
                        let target = event.target;
                        const className = target.className;
                        if (className === "fancy-image__image") {
                            currentTarget = target.parentElement;
                            currentBox = target.previousElementSibling;
                        } else if (className === "fancy-image__picture") {
                            currentTarget = target;
                            currentBox = target.$q(".post-show-box");
                            target = target.$q("img");
                        } else return;
                        if (!currentBox && target) {
                            currentBox = Lib.createElement(target, "div", {
                                text: "Loading...",
                                style: "display: none;",
                                class: "post-show-box",
                                attr: {
                                    preview: previewAbove ? "above" : "below"
                                },
                                on: {
                                    wheel: event2 => {
                                        event2.preventDefault();
                                        event2.currentTarget.scrollLeft += event2.deltaY;
                                    }
                                }
                            }, "beforebegin");
                            const url = target.$gAttr("jump") || target.closest("a.user-card").href;
                            if (url && !url.includes("discord")) {
                                const uri = new URL(url);
                                const api = Page.isNeko ? url : `${uri.origin}/api/v1${uri.pathname}/posts`;
                                Fetch.send(api, null, {
                                    responseType: Page.isNeko ? "document" : "json"
                                }).then(data => {
                                    if (Page.isNeko) data = data.$qa(".post-card__image");
                                    currentBox.$text("");
                                    const srcBox = new Set();
                                    for (const post of data) {
                                        let src = "";
                                        if (Page.isNeko) src = post.src ?? ""; else {
                                            for (const {
                                                path
                                            } of [post.file, ...post?.attachments || []]) {
                                                if (!path) continue;
                                                const isImg = Parame.SupportImg.has(path.split(".")[1]);
                                                if (!isImg) continue;
                                                src = Parame.ThumbnailApi + path;
                                                break;
                                            }
                                        }
                                        if (!src) continue;
                                        srcBox.add(src);
                                    }
                                    if (srcBox.size === 0) currentBox.$text("No Image"); else {
                                        currentBox.$iAdjacent([...srcBox].map((src, index) => `<img src="${src}" loading="lazy" number="${index + 1}">`).join(""));
                                        srcBox.clear();
                                    }
                                });
                            } else currentBox.$text("Not Supported");
                        }
                        currentBox?.$sAttr("style", "display: block;");
                    }, 300), {
                        passive: true,
                        mark: "PostShow"
                    });
                    Lib.onEvent(Lib.body, "mouseout", event => {
                        if (!currentTarget) return;
                        if (currentTarget.contains(event.relatedTarget)) return;
                        currentTarget = null;
                        currentBox?.$sAttr("style", "display: none;");
                    }, {
                        passive: true,
                        mark: "PostHide"
                    });
                }
                if (!enableNameTools) return;
                const [active, insert] = [newtab_active, newtab_insert];
                Lib.onEvent(Lib.body, "click", event => {
                    const target = event.target;
                    const tagName = target.tagName;
                    if (tagName === "TEXTAREA") {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                    } else if (tagName === "FIX_EDIT") {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        Lib.$q(".edit_textarea")?.remove();
                        const display = target.previousElementSibling;
                        const text = Lib.createElement(display, "textarea", {
                            class: "edit_textarea",
                            style: `height: ${display.scrollHeight + 10}px;`
                        }, "beforebegin");
                        const original_name = display.$text();
                        text.value = original_name.trim();
                        text.scrollTop = 0;
                        setTimeout(() => {
                            text.focus();
                            setTimeout(() => {
                                text.on("blur", () => {
                                    const change_name = text.value.trim();
                                    if (!change_name) display.$text(original_name); else if (change_name !== original_name) {
                                        display.$text(change_name);
                                        saveRecord(new Map([[target.id, change_name]]));
                                    }
                                    text.remove();
                                }, {
                                    once: true,
                                    passive: true
                                });
                            }, 50);
                        }, 300);
                    } else if (newtab && Lib.platform.desktop && (tagName === "FIX_NAME" || tagName === "FIX_TAG" || tagName === "PICTURE" || target.matches(".fancy-image__image, .post-show-box, .post-show-box img")) || tagName === "FIX_TAG" || tagName === "FIX_NAME" && (Page.isPreview() || Page.isContent()) || Page.isContent() && target.matches(".fancy-image__image")) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        const url = target.$gAttr("jump");
                        if (url) {
                            newtab || tagName === "FIX_TAG" || tagName === "FIX_NAME" && Page.isPreview() ? GM_openInTab(url, {
                                active: active,
                                insert: insert
                            }) : location.assign(url);
                        } else if (tagName === "IMG" || tagName === "PICTURE") {
                            const href = target.closest("a").href;
                            newtab && !Page.isContent() ? GM_openInTab(href, {
                                active: active,
                                insert: insert
                            }) : location.assign(href);
                        }
                    }
                }, {
                    capture: true,
                    mark: "BetterPostCard"
                });
                if (Page.isSearch()) {
                    Lib.waitEl(".card-list__items", null, {
                        raf: true,
                        timeout: 10
                    }).then(card_items => {
                        if (Parame.Links.test(Parame.Url) || Parame.Recommended.test(Parame.Url)) {
                            const artist = Lib.$q("span[itemprop='name']");
                            artist && otherFix(artist);
                        }
                        dynamicFix(card_items);
                        card_items.$sAttr("fix-trigger", true);
                    });
                } else if (Page.isContent()) {
                    Lib.waitEl(["h1 span:nth-child(2)", ".post__user-name, .scrape__user-name"], null, {
                        raf: true,
                        timeout: 10
                    }).then(([title, artist]) => {
                        otherFix(artist, title, artist.href, Lib.url, "fix_cont");
                    });
                } else {
                    Lib.waitEl("span[itemprop='name']", null, {
                        raf: true,
                        timeout: 3
                    }).then(artist => {
                        otherFix(artist);
                    });
                }
            }
        };
    };
    const globalLoader = {
        SidebarCollapse: SidebarCollapse,
        DeleteNotice: DeleteNotice,
        KeyScroll: KeyScroll,
        BlockAds: BlockAds,
        CacheFetch: CacheFetch,
        async TextToLink(...args) {
            const value = TextToLinkFactory().TextToLink;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        },
        async BetterPostCard(...args) {
            const func = await BetterPostCardFactory();
            const value = func.BetterPostCard;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        }
    };
    async function NewTabOpens({
        newtab_active,
        newtab_insert
    }) {
        const [active, insert] = [newtab_active, newtab_insert];
        Lib.onEvent(Lib.body, "click", event => {
            const target = event.target.closest("article a");
            target && (event.preventDefault(), event.stopImmediatePropagation(),
                GM_openInTab(target.href, {
                    active: active,
                    insert: insert
                }));
        }, {
            capture: true,
            mark: "NewTabOpens"
        });
    }
    async function CardText({
        mode
    }) {
        if (Lib.platform.mobile) return;
        switch (mode) {
            case 2:
                Lib.addStyle(`
                .post-card__header, .post-card__footer {
                    opacity: 0.4 !important;
                    transition: opacity 0.3s;
                }
                a:hover .post-card__header,
                a:hover .post-card__footer {
                    opacity: 1 !important;
                }
            `, "CardText-Effects-2", false);
                break;

            default:
                Lib.addStyle(`
                .post-card__header {
                    opacity: 0;
                    z-index: 1;
                    padding: 5px;
                    pointer-events: none;
                    transform: translateY(-6vh);
                    transition: transform 0.4s, opacity 0.6s;
                }
                .post-card__footer {
                    opacity: 0;
                    z-index: 1;
                    padding: 5px;
                    pointer-events: none;
                    transform: translateY(6vh);
                    transition: transform 0.4s, opacity 0.6s;
                }
                a:hover .post-card__header,
                a:hover .post-card__footer {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateY(0);
                }
            `, "CardText-Effects", false);
        }
    }
    async function CardZoom({
        mode
    }) {
        let paddingBottom, rowGap, height;
        switch (mode) {
            case 2:
                Lib.addStyle(`
                .post-card a:hover {
                    z-index: 9999;
                    overflow: auto;
                    max-height: 90vh;
                    min-height: 100%;
                    height: max-content;
                    background: #000;
                    border: 1px solid #fff6;
                    transform: scale(1.1) translateY(0);
                }
                .post-card a::-webkit-scrollbar {
                    display: none;
                }
                .post-card a:hover .post-card__image-container {
                    position: relative;
                }
            `, "CardZoom-Effects-2", false);
                break;

            case 3:
                [paddingBottom, rowGap, height] = Page.isNeko ? ["0", "0", "57"] : ["7", "5.8", "50"];
                Lib.addStyle(`
                .card-list--legacy { padding-bottom: ${paddingBottom}em }
                .card-list--legacy .card-list__items {
                    row-gap: ${rowGap}em;
                    column-gap: 3em;
                }
                .post-card a {
                    width: 20em;
                    height: ${height}vh;
                }
                .post-card__image-container img { object-fit: contain }
            `, "CardZoom-Effects-3", false);
        }
        Lib.addStyle(`
        .card-list--legacy * {
            font-size: 20px !important;
            font-weight: 600 !important;
            --card-size: 350px !important;
        }
        .post-card a {
            background: #000;
            overflow: hidden;
            border-radius: 8px;
            border: 3px solid #fff6;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
    `, "CardZoom-Effects", false);
    }
    async function QuickPostToggle() {
        if (!Page.isNeko || Parame.Registered.has("QuickPostToggle")) return;
        Lib.waitEl("menu", null, {
            all: true,
            timeout: 5
        }).then(menu => {
            Parame.Registered.add("QuickPostToggle");
            function Rendering({
                href,
                className,
                textContent,
                style
            }) {
                return preact.h("a", {
                    href: href,
                    className: className,
                    style: style
                }, preact.h("b", null, textContent));
            }
            const pageContentCache = new Map();
            const MAX_CACHE_SIZE = 30;
            function cleanupCache() {
                if (pageContentCache.size >= MAX_CACHE_SIZE) {
                    const firstKey = pageContentCache.keys().next().value;
                    pageContentCache.delete(firstKey);
                }
            }
            async function fetchPage(url, abortSignal) {
                if (pageContentCache.has(url)) {
                    const cachedContent = pageContentCache.get(url);
                    pageContentCache.delete(url);
                    pageContentCache.set(url, cachedContent);
                    const clonedContent = cachedContent.cloneNode(true);
                    Lib.$q(".card-list--legacy").replaceChildren(...clonedContent.childNodes);
                    return Promise.resolve();
                }
                return new Promise((resolve, reject) => {
                    const request = GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: response => {
                            if (abortSignal?.aborted) return reject(new Error("Aborted"));
                            if (response.status !== 200) return reject(new Error("Server error"));
                            const newContent = response.responseXML.$q(".card-list--legacy");
                            cleanupCache();
                            const contentToCache = newContent.cloneNode(true);
                            pageContentCache.set(url, contentToCache);
                            Lib.$q(".card-list--legacy").replaceWith(newContent);
                            resolve();
                        },
                        onerror: () => reject(new Error("Network error"))
                    });
                    if (abortSignal) {
                        abortSignal.addEventListener("abort", () => {
                            request.abort?.();
                            reject(new Error("Aborted"));
                        });
                    }
                });
            }
            const totalPages = Math.ceil(+menu[0].previousElementSibling.$text().split("of")[1].trim() / 50);
            const pageLinks = [Parame.Url, ...Array(totalPages - 1).fill().map((_, i) => `${Parame.Url}?o=${(i + 1) * 50}`)];
            const MAX_VISIBLE = 11;
            const hasScrolling = totalPages > 11;
            let buttonCache = null;
            let pageButtonIndexMap = null;
            let visibleRangeCache = {
                page: -1,
                range: null
            };
            function getVisibleRange(currentPage) {
                if (visibleRangeCache.page === currentPage) {
                    return visibleRangeCache.range;
                }
                let range;
                if (!hasScrolling) {
                    range = {
                        start: 1,
                        end: totalPages
                    };
                } else {
                    let start = 1;
                    if (currentPage >= MAX_VISIBLE && totalPages > MAX_VISIBLE) {
                        start = currentPage - MAX_VISIBLE + 2;
                    }
                    range = {
                        start: start,
                        end: Math.min(totalPages, start + MAX_VISIBLE - 1)
                    };
                }
                visibleRangeCache = {
                    page: currentPage,
                    range: range
                };
                return range;
            }
            function createButton(text, page, isDisabled = false, isCurrent = false, isHidden = false) {
                return preact.h(Rendering, {
                    href: isDisabled ? void 0 : pageLinks[page - 1],
                    textContent: text,
                    className: `${isDisabled ? "pagination-button-disabled" : ""} ${isCurrent ? "pagination-button-current" : ""}`.trim(),
                    style: isHidden ? {
                        display: "none"
                    } : void 0
                });
            }
            function createPaginationElements(currentPage = 1) {
                const {
                    start,
                    end
                } = getVisibleRange(currentPage);
                const elements2 = [];
                if (hasScrolling) {
                    elements2.push(createButton("<<", 1, currentPage === 1));
                }
                elements2.push(createButton("<", currentPage - 1, currentPage === 1));
                pageLinks.forEach((link, index) => {
                    const pageNum = index + 1;
                    const isVisible = pageNum >= start && pageNum <= end;
                    const isCurrent = pageNum === currentPage;
                    elements2.push(createButton(pageNum, pageNum, isCurrent, isCurrent, !isVisible));
                });
                elements2.push(createButton(">", currentPage + 1, currentPage === totalPages));
                if (hasScrolling) {
                    elements2.push(createButton(">>", totalPages, currentPage === totalPages));
                }
                return elements2;
            }
            function initializeButtonCache() {
                const menu1Buttons = menu[0].$qa("a");
                const menu2Buttons = menu[1].$qa("a");
                const navOffset = hasScrolling ? 2 : 1;
                buttonCache = {
                    menu1: {
                        all: menu1Buttons,
                        nav: {
                            first: hasScrolling ? menu1Buttons[0] : null,
                            prev: menu1Buttons[hasScrolling ? 1 : 0],
                            next: menu1Buttons[menu1Buttons.length - (hasScrolling ? 2 : 1)],
                            last: hasScrolling ? menu1Buttons[menu1Buttons.length - 1] : null
                        },
                        pages: menu1Buttons.slice(navOffset, menu1Buttons.length - navOffset)
                    },
                    menu2: {
                        all: menu2Buttons,
                        nav: {
                            first: hasScrolling ? menu2Buttons[0] : null,
                            prev: menu2Buttons[hasScrolling ? 1 : 0],
                            next: menu2Buttons[menu2Buttons.length - (hasScrolling ? 2 : 1)],
                            last: hasScrolling ? menu2Buttons[menu2Buttons.length - 1] : null
                        },
                        pages: menu2Buttons.slice(navOffset, menu2Buttons.length - navOffset)
                    }
                };
                pageButtonIndexMap = new Map();
                buttonCache.menu1.pages.forEach((btn, index) => {
                    const pageNum = index + 1;
                    pageButtonIndexMap.set(pageNum, index);
                });
            }
            function updateNavigationButtons(menuData, targetPage) {
                const isFirstPage = targetPage === 1;
                const isLastPage = targetPage === totalPages;
                const {
                    nav
                } = menuData;
                const navUpdates = [];
                if (hasScrolling) {
                    navUpdates.push([nav.first, isFirstPage, pageLinks[0]], [nav.prev, isFirstPage, pageLinks[targetPage - 2]], [nav.next, isLastPage, pageLinks[targetPage]], [nav.last, isLastPage, pageLinks[totalPages - 1]]);
                } else {
                    navUpdates.push([nav.prev, isFirstPage, pageLinks[targetPage - 2]], [nav.next, isLastPage, pageLinks[targetPage]]);
                }
                navUpdates.forEach(([btn, isDisabled, href]) => {
                    btn.$toggleClass("pagination-button-disabled", isDisabled);
                    if (isDisabled) {
                        btn.$dAttr("href");
                    } else {
                        btn.href = href;
                    }
                });
            }
            function updatePageButtons(menuData, targetPage, visibleRange) {
                const {
                    start,
                    end
                } = visibleRange;
                const {
                    pages
                } = menuData;
                const currentActiveBtn = pages.find(btn => btn.classList.contains("pagination-button-current"));
                if (currentActiveBtn) {
                    currentActiveBtn.$delClass("pagination-button-current", "pagination-button-disabled");
                }
                const startIndex = Math.max(0, start - 1);
                const endIndex = Math.min(pages.length - 1, end - 1);
                for (let i = 0; i < startIndex; i++) {
                    pages[i].style.display = "none";
                }
                for (let i = endIndex + 1; i < pages.length; i++) {
                    pages[i].style.display = "none";
                }
                for (let i = startIndex; i <= endIndex; i++) {
                    const btn = pages[i];
                    const pageNum = i + 1;
                    btn.style.display = "";
                    if (pageNum === targetPage) {
                        btn.$addClass("pagination-button-current", "pagination-button-disabled");
                    }
                }
            }
            function updatePagination(targetPage) {
                const visibleRange = getVisibleRange(targetPage);
                updateNavigationButtons(buttonCache.menu1, targetPage);
                updateNavigationButtons(buttonCache.menu2, targetPage);
                updatePageButtons(buttonCache.menu1, targetPage, visibleRange);
                updatePageButtons(buttonCache.menu2, targetPage, visibleRange);
            }
            const navigationActions = {
                "<<": () => 1,
                ">>": () => totalPages,
                "<": current => current > 1 ? current - 1 : null,
                ">": current => current < totalPages ? current + 1 : null
            };
            function parseTargetPage(clickText, currentPage) {
                const clickedNum = parseInt(clickText);
                if (!isNaN(clickedNum)) return clickedNum;
                const action = navigationActions[clickText];
                return action ? action(currentPage) : null;
            }
            const elements = createPaginationElements(1);
            const [fragment1, fragment2] = [Lib.createFragment, Lib.createFragment];
            preact.render([...elements], fragment1);
            preact.render([...elements], fragment2);
            menu[0].replaceChildren(fragment1);
            menu[0].$sAttr("QuickPostToggle", "true");
            requestAnimationFrame(() => {
                menu[1].replaceChildren(fragment2);
                menu[1].$sAttr("QuickPostToggle", "true");
                initializeButtonCache();
            });
            let isLoading = false;
            let abortController = null;
            Lib.onEvent("section", "click", async event => {
                const target = event.target.closest("menu a:not(.pagination-button-disabled)");
                if (!target || isLoading) return;
                event.preventDefault();
                if (abortController) {
                    abortController.abort();
                }
                abortController = new AbortController();
                const currentActiveBtn = target.closest("menu").$q(".pagination-button-current");
                const currentPage = parseInt(currentActiveBtn.$text());
                const targetPage = parseTargetPage(target.$text(), currentPage);
                if (!targetPage || targetPage === currentPage) return;
                isLoading = true;
                try {
                    await Promise.all([fetchPage(pageLinks[targetPage - 1], abortController.signal), new Promise(resolve => {
                        updatePagination(targetPage);
                        resolve();
                    })]);
                    target.closest("#paginator-bottom") && menu[0].scrollIntoView();
                    history.pushState(null, null, pageLinks[targetPage - 1]);
                } catch (error) {
                    if (error.message !== "Aborted") {
                        Lib.log("Page fetch failed:", error).error;
                    }
                } finally {
                    isLoading = false;
                    abortController = null;
                }
            }, {
                capture: true,
                mark: "QuickPostToggle"
            });
        });
    }
    const BetterThumbnailFactory = () => {
        const imgReload = (img, thumbnailSrc, retry) => {
            if (!img.isConnected) return;
            if (!retry) {
                img.src = thumbnailSrc;
                return;
            }
            const src = img.src;
            img.onload = function () {
                img.onload = img.onerror = null;
            };
            img.onerror = function () {
                img.onload = img.onerror = null;
                img.src = thumbnailSrc;
                setTimeout(() => {
                    imgReload(img, thumbnailSrc, retry - 1);
                }, 2e3);
            };
            img.src = src;
        };
        const changeSrc = (img, thumbnailSrc, src) => {
            if (!img.isConnected) return;
            img.loading = "lazy";
            img.onerror = function () {
                img.onerror = null;
                imgReload(this, thumbnailSrc, 10);
            };
            img.src = src;
        };
        return {
            async BetterThumbnail() {
                if (Page.isNeko) return;
                Lib.waitEl("article.post-card", null, {
                    raf: true,
                    all: true,
                    timeout: 5
                }).then(postCard => {
                    const uri = new URL(Parame.Url);
                    if (uri.searchParams.get("q") === "") uri.searchParams.delete("q");
                    if (Parame.User.test(Parame.Url)) {
                        uri.pathname += "/posts";
                    } else if (Parame.FavorPosts.test(Parame.Url)) {
                        uri.pathname = uri.pathname.replace("/posts", "");
                        uri.searchParams.set("type", "post");
                    }
                    const postData = [...postCard].reduce((acc, card) => {
                        const id = card.$gAttr("data-id");
                        if (id) acc[id] = {
                            img: card.$q("img"),
                            footer: card.$q("time").nextElementSibling
                        };
                        return acc;
                    }, {});
                    const api = `${uri.origin}/api/v1${uri.pathname}${uri.search}`;
                    Fetch.send(api, data => {
                        if (Lib.$type(data) === "Object") data = data?.posts || [];
                        for (const post of data) {
                            const {
                                img,
                                footer
                            } = postData[post?.id] || {};
                            if (!img && !footer) continue;
                            let replaced = false;
                            const src = img?.src;
                            const attachments = post.attachments || [];
                            const record = new Set();
                            const count = [post.file, ...attachments].reduce((count2, attach, index) => {
                                const path = attach.path || "";
                                if (record.has(path)) return count2;
                                const ext = path.split(".").at(-1).toLowerCase();
                                if (!ext) return count2;
                                const isImg = Parame.SupportImg.has(ext);
                                if (isImg) count2.image = (count2.image ?? 0) + 1; else if (Parame.VideoType.has(ext)) count2.video = (count2.video ?? 0) + 1; else count2.file = (count2.file ?? 0) + 1;
                                if (src && !replaced && index > 0 && isImg) {
                                    replaced = true;
                                    changeSrc(img, src, Parame.ThumbnailApi + path);
                                }
                                record.add(path);
                                return count2;
                            }, {});
                            if (footer && !Lib.isEmpty(count)) {
                                const {
                                    image,
                                    video,
                                    file
                                } = count;
                                const parts = [];
                                if (image) parts.push(`${image} images`);
                                if (video) parts.push(`${video} videos`);
                                if (file) parts.push(`${file} files`);
                                const showText = parts.join(" | ");
                                if (showText) footer.$text(showText);
                            }
                        }
                    });
                });
            }
        };
    };
    const previewLoader = {
        NewTabOpens: NewTabOpens,
        CardText: CardText,
        CardZoom: CardZoom,
        async BetterThumbnail(...args) {
            const value = BetterThumbnailFactory().BetterThumbnail;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        },
        QuickPostToggle: QuickPostToggle
    };
    const LinkBeautifyFactory = () => {
        const showBrowse = (browse, retry = 3) => {
            if (!retry) return;
            browse.style.position = "relative";
            browse.$q("View")?.remove();
            Fetch.send(browse.href?.replace("posts/archives", "api/v1/file"), json => {
                const password = json.password;
                browse.$iAdjacent(`
                    <view>
                        ${password ? `password: ${password}<br>` : ""}
                        ${json.file_list.map(file => `${file}<br>`).join("")}
                    </view>`);
            }).catch(() => {
                setTimeout(() => showBrowse(browse, retry - 1), 1e3);
            });
        };
        return {
            async LinkBeautify() {
                Lib.addStyle(`
                View {
                    top: -10px;
                    z-index: 1;
                    padding: 10%;
                    display: none;
                    overflow: auto;
                    color: #f2f2f2;
                    font-size: 14px;
                    max-height: 50vh;
                    font-weight: 600;
                    text-align: center;
                    position: absolute;
                    white-space: nowrap;
                    border-radius: .5rem;
                    left: calc(100% + 10px);
                    border: 1px solid #737373;
                    background-color: #3b3e44;
                }
                a:hover View { display: block }
                .post__attachment .fancy-link::after {
                    content: "";
                    position: absolute;
                    height: 100%;
                    padding: .4rem;
                }
                .post__attachment-link:not([beautify]) { display: none !important; }
            `, "Link-Effects", false);
                Lib.waitEl(".post__attachment-link, .scrape__attachment-link", null, {
                    raf: true,
                    all: true,
                    timeout: 5
                }).then(post => {
                    for (const link of post) {
                        if (!Page.isNeko && link.$gAttr("beautify")) {
                            link.remove();
                            continue;
                        }
                        const text = link.$text().replace("Download ", "");
                        if (Page.isNeko) {
                            link.$text(text);
                            link.$sAttr("download", text);
                        } else {
                            link.$iAdjacent(`<a class="${link.$gAttr("class")}" href="${link.href}" download="${text}" beautify="true">${text}</a>`, "beforebegin");
                        }
                        const browse = link.nextElementSibling;
                        if (!browse || browse.$text() !== "browse »") continue;
                        showBrowse(browse);
                    }
                });
            }
        };
    };
    async function VideoBeautify({
        mode
    }) {
        if (Page.isNeko) {
            Lib.waitEl(".scrape__files video", null, {
                raf: true,
                all: true,
                timeout: 5
            }).then(video => {
                video.forEach(media => media.$sAttr("preload", "metadata"));
            });
        } else {
            Lib.waitEl("ul[style*='text-align: center; list-style-type: none;'] li:not([id])", null, {
                raf: true,
                all: true,
                timeout: 5
            }).then(parents => {
                Lib.waitEl(".post__attachment-link, .scrape__attachment-link", null, {
                    raf: true,
                    all: true,
                    timeout: 5
                }).then(post => {
                    Lib.addStyle(`
                    .fluid_video_wrapper {
                        height: 50% !important;
                        width: 65% !important;
                        border-radius: 8px !important;
                    }
                `, "Video-Effects", false);
                    const move = mode === 2;
                    const linkBox = Object.fromEntries([...post].map(a => {
                        const data = [a.download?.trim(), a];
                        return data;
                    }));
                    for (const li of parents) {
                        const waitLoad = new MutationObserver(Lib.$debounce(() => {
                            waitLoad.disconnect();
                            let [video, summary] = [li.$q("video"), li.$q("summary")];
                            if (!video || !summary) return;
                            video.$sAttr("loop", true);
                            video.$sAttr("preload", "metadata");
                            const link = linkBox[summary.$text()];
                            if (!link) return;
                            move && link.parentElement.remove();
                            let element = link.$copy();
                            element.$sAttr("beautify", true);
                            element.$text(element.$text().replace("Download", ""));
                            summary.$text("");
                            summary.appendChild(element);
                        }, 100));
                        waitLoad.observe(li, {
                            attributes: true,
                            characterData: true,
                            childList: true,
                            subtree: true
                        });
                        li.$sAttr("Video-Beautify", true);
                    }
                });
            });
        }
    }
    const OriginalImageFactory = () => {
        const linkQuery = Page.isNeko ? "div" : "a";
        const safeGetSrc = element => element?.src || element?.$gAttr("src");
        const safeGetHref = element => element?.href || element?.$gAttr("href");
        const loadFailedClick = () => {
            Lib.onE(".post__files, .scrape__files", "click", event => {
                const target = event.target;
                const isImg = target.matches("img");
                if (isImg && target.alt === "Loading Failed") {
                    target.onload = null;
                    target.$dAttr("src");
                    target.onload = function () {
                        cleanMark(target);
                    };
                    target.src = target.$gAttr("data-fsrc");
                }
            }, {
                capture: true,
                passive: true
            });
        };
        const cleanMark = img => {
            img.onload = img.onerror = null;
            img.$dAttr("alt");
            img.$dAttr("data-tsrc");
            img.$dAttr("data-fsrc");
            img.$delClass("Image-loading-indicator");
        };
        const imgReload = (img, retry) => {
            if (!img.isConnected) return;
            if (!retry) {
                img.alt = "Loading Failed";
                img.src = img.$gAttr("data-tsrc");
                return;
            }
            img.$dAttr("src");
            img.onload = function () {
                cleanMark(img);
            };
            img.onerror = function () {
                img.onload = img.onerror = null;
                setTimeout(() => {
                    imgReload(img, retry - 1);
                }, 1e4);
            };
            img.alt = "Reload";
            img.src = img.$gAttr("data-fsrc");
        };
        async function imgRequest(container, url, result) {
            const indicator = Lib.createElement(container, "div", {
                class: "progress-indicator"
            });
            let blob = null;
            try {
                if (false); else {
                    for (let i = 0; i < 5; i++) {
                        try {
                            blob = await new Promise((resolve, reject) => {
                                let timeout = null;
                                const request = GM_xmlhttpRequest({
                                    url: url,
                                    method: "GET",
                                    responseType: "blob",
                                    onload: res => {
                                        clearTimeout(timeout);
                                        return res.status === 200 ? resolve(res.response) : reject(res);
                                    },
                                    onerror: reject,
                                    onprogress: progress => {
                                        timer();
                                        if (progress.lengthComputable && indicator.isConnected) {
                                            const percent = (progress.loaded / progress.total * 100).toFixed(1);
                                            indicator.$text(`${percent}%`);
                                        }
                                    }
                                });
                                function timer() {
                                    clearTimeout(timeout);
                                    timeout = setTimeout(() => {
                                        request.abort();
                                        reject();
                                    }, 15e3);
                                }
                            });
                            break;
                        } catch (error) {
                            if (i < 4) await new Promise(res => setTimeout(res, 300));
                        }
                    }
                }
                if (blob && blob.size > 0) {
                    result(URL.createObjectURL(blob));
                } else {
                    result(Parame.Url);
                }
            } catch (error) {
                result(Parame.Url);
            } finally {
                indicator?.remove();
            }
        }
        return {
            async OriginalImage({
                mode,
                experiment
            }) {
                Lib.waitEl(".post__thumbnail, .scrape__thumbnail", null, {
                    raf: true,
                    all: true,
                    timeout: 5
                }).then(thumbnail => {
                    let token = 0, timer = null;
                    function imgRendering({
                        root,
                        index,
                        thumbUrl,
                        newUrl,
                        oldUrl,
                        mode: mode2
                    }) {
                        if (!root.isConnected) return;
                        ++index;
                        ++token;
                        const tagName = oldUrl ? "rc" : "div";
                        const oldSrc = oldUrl ? `src="${oldUrl}"` : "";
                        const container = Lib.createDomFragment(`
                        <${tagName} id="IMG-${index}" ${oldSrc}>
                            <img src="${newUrl}" class="Image-loading-indicator Image-style" data-tsrc="${thumbUrl}" data-fsrc="${newUrl}">
                        </${tagName}>
                    `);
                        const img = container.querySelector("img");
                        timer = setTimeout(() => {
                            --token;
                        }, 1e4);
                        img.onload = function () {
                            clearTimeout(timer);
                            --token;
                            cleanMark(img);
                            mode2 === "slow" && slowAutoLoad(index);
                        };
                        if (mode2 === "fast") {
                            img.onerror = function () {
                                --token;
                                img.onload = img.onerror = null;
                                imgReload(img, 7);
                            };
                        }
                        root.replaceWith(container);
                    }
                    async function imgLoad(root, index, mode2 = "fast") {
                        if (!root.isConnected) return;
                        root.$dAttr("class");
                        const a = root.$q(linkQuery);
                        const safeHref = safeGetHref(a);
                        const img = root.$q("img");
                        const safeSrc = safeGetSrc(img);
                        if (!a && img) {
                            img.$addClass("Image-style");
                            return;
                        }
                        const replaceRoot = Page.isNeko ? root : a;
                        if (experiment) {
                            img.$addClass("Image-loading-indicator-experiment");
                            imgRequest(root, safeHref, href => {
                                imgRendering({
                                    root: replaceRoot,
                                    index: index,
                                    thumbUrl: safeSrc,
                                    newUrl: href,
                                    oldUrl: safeHref,
                                    mode: mode2
                                });
                            });
                        } else {
                            imgRendering({
                                root: replaceRoot,
                                index: index,
                                thumbUrl: safeSrc,
                                newUrl: safeHref,
                                mode: mode2
                            });
                        }
                    }
                    async function fastAutoLoad() {
                        loadFailedClick();
                        for (const [index, root] of [...thumbnail].entries()) {
                            while (token >= 7) {
                                await Lib.sleep(700);
                            }
                            imgLoad(root, index);
                        }
                    }
                    async function slowAutoLoad(index) {
                        if (index === thumbnail.length) return;
                        const root = thumbnail[index];
                        imgLoad(root, index, "slow");
                    }
                    let observer;
                    function observeLoad() {
                        loadFailedClick();
                        return new IntersectionObserver(observed => {
                            observed.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const root = entry.target;
                                    observer.unobserve(root);
                                    imgLoad(root, root.dataset.index);
                                }
                            });
                        }, {
                            threshold: .4
                        });
                    }
                    switch (mode) {
                        case 2:
                            slowAutoLoad(0);
                            break;

                        case 3:
                            observer?.disconnect();
                            observer = observeLoad();
                            thumbnail.forEach((root, index) => {
                                root.dataset.index = index;
                                observer.observe(root);
                            });
                            break;

                        default:
                            fastAutoLoad();
                    }
                });
            }
        };
    };
    const ExtraButtonFactory = () => {
        const loadStyle = () => {
            Lib.addStyle(`
            #main section {
                width: 100%;
            }
        `, "Post-Extra", false);
        };
        const getNextPage = (url, oldMain, retry = 5) => {
            if (!retry) return;
            Fetch.send(url, null, {
                responseType: "document"
            }).then(dom => {
                const main = dom.$q("main");
                if (!main) return;
                oldMain.replaceWith(main);
                Lib.$q("header")?.scrollIntoView();
                history.pushState(null, null, url);
                Lib.title(dom.title);
            }).catch(() => {
                setTimeout(() => getNextPage(url, oldMain), 1e3);
            });
        };
        return {
            async ExtraButton() {
                Lib.waitEl("h2.site-section__subheading", null, {
                    raf: true,
                    timeout: 5
                }).then(comments => {
                    loadStyle();
                    Lib.$q(".post__nav-link.prev, .scrape__nav-link.prev");
                    const nextBtn = Lib.$q(".post__nav-link.next, .scrape__nav-link.next");
                    let toTopBtn, newNextBtn;
                    if (!Lib.$q("#to-top-svg")) {
                        const header = Lib.$q("header");
                        toTopBtn = Lib.createElement(comments, "span", {
                            id: "to-top-svg",
                            html: `
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" style="margin-left: 10px;cursor: pointer;">
                                <style>svg{fill: ${Load.color}}</style>
                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4l107.1-99.9c3.8-3.5 8.7-5.5 13.8-5.5s10.1 2 13.8 5.5l107.1 99.9c4.5 4.2 7.1 10.1 7.1 16.3c0 12.3-10 22.3-22.3 22.3H304v96c0 17.7-14.3 32-32 32H240c-17.7 0-32-14.3-32-32V256H150.3C138 256 128 246 128 233.7c0-6.2 2.6-12.1 7.1-16.3z"></path>
                            </svg>`,
                            on: {
                                click: () => header?.scrollIntoView()
                            }
                        });
                    }
                    if (nextBtn && !Lib.$q("#next-btn")) {
                        const newBtn = nextBtn.$copy(true);
                        newBtn.style = `color: ${Load.color};`;
                        newBtn.$sAttr("jump", nextBtn.href);
                        newBtn.$dAttr("href");
                        newNextBtn = Lib.createElement(comments, "span", {
                            id: "next-btn",
                            style: "float: right; cursor: pointer;",
                            on: {
                                click: {
                                    listen: () => {
                                        if (Page.isNeko) {
                                            newBtn.disabled = true;
                                            getNextPage(newBtn.$gAttr("jump"), Lib.$q("main"));
                                        } else {
                                            toTopBtn?.remove();
                                            newNextBtn.remove();
                                            nextBtn.click();
                                        }
                                    },
                                    add: {
                                        once: true
                                    }
                                }
                            }
                        });
                        newNextBtn.appendChild(newBtn);
                    }
                });
            }
        };
    };
    async function CommentFormat() {
        Lib.addStyle(`
        .post__comments,
        .scrape__comments {
            display: flex;
            flex-wrap: wrap;
        }
        .post__comments > *:last-child,
        .scrape__comments > *:last-child {
            margin-bottom: 0.5rem;
        }
        .comment {
            margin: 0.5rem;
            max-width: 25rem;
            border-radius: 10px;
            flex-basis: calc(35%);
            word-break: break-all;
            border: 0.125em solid var(--colour1-secondary);
        }
    `, "Comment-Effects", false);
    }
    const contentLoader = {
        VideoBeautify: VideoBeautify,
        async LinkBeautify(...args) {
            const value = LinkBeautifyFactory().LinkBeautify;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        },
        async OriginalImage(...args) {
            const value = OriginalImageFactory().OriginalImage;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        },
        async ExtraButton(...args) {
            const value = ExtraButtonFactory().ExtraButton;
            value(...args);
            Object.defineProperty(this, value.name, {
                value: value,
                writable: false
            });
        },
        CommentFormat: CommentFormat
    };
    const dict = {
        Traditional: {},
        Simplified: {
            "📝 設置選單": "📝 设置菜单",
            "設置菜單": "设置菜单",
            "圖像設置": "图像设置",
            "讀取設定": "加载设置",
            "關閉離開": "关闭",
            "保存應用": "保存并应用",
            "語言": "语言",
            "英文": "英语",
            "繁體": "繁体中文",
            "簡體": "简体中文",
            "日文": "日语",
            "韓文": "韩语",
            "俄語": "俄语",
            "圖片高度": "图片高度",
            "圖片寬度": "图片宽度",
            "圖片最大寬度": "图片最大宽度",
            "圖片間隔高度": "图片间距"
        },
        Japan: {
            "📝 設置選單": "📝 設定メニュー",
            "設置菜單": "設定メニュー",
            "圖像設置": "画像設定",
            "讀取設定": "設定を読み込む",
            "關閉離開": "閉じる",
            "保存應用": "保存して適用",
            "語言": "言語",
            "英文": "英語",
            "繁體": "繁体字中国語",
            "簡體": "簡体字中国語",
            "日文": "日本語",
            "韓文": "韓国語",
            "俄語": "ロシア語",
            "圖片高度": "画像の高さ",
            "圖片寬度": "画像の幅",
            "圖片最大寬度": "画像の最大幅",
            "圖片間隔高度": "画像の間隔"
        },
        Korea: {
            "📝 設置選單": "📝 설정 메뉴",
            "設置菜單": "설정 메뉴",
            "圖像設置": "이미지 설정",
            "讀取設定": "설정 불러오기",
            "關閉離開": "닫기",
            "保存應用": "저장 및 적용",
            "語言": "언어",
            "英文": "영어",
            "繁體": "번체 중국어",
            "簡體": "간체 중국어",
            "日文": "일본어",
            "韓文": "한국어",
            "俄語": "러시아어",
            "圖片高度": "이미지 높이",
            "圖片寬度": "이미지 너비",
            "圖片最大寬度": "이미지 최대 너비",
            "圖片間隔高度": "이미지 간격"
        },
        Russia: {
            "📝 設置選單": "📝 Меню настроек",
            "設置菜單": "Меню настроек",
            "圖像設置": "Настройки изображений",
            "讀取設定": "Загрузить настройки",
            "關閉離開": "Закрыть",
            "保存應用": "Сохранить и применить",
            "語言": "Язык",
            "英文": "Английский",
            "繁體": "Традиционный китайский",
            "簡體": "Упрощенный китайский",
            "日文": "Японский",
            "韓文": "Корейский",
            "俄語": "Русский",
            "圖片高度": "Высота изображения",
            "圖片寬度": "Ширина изображения",
            "圖片最大寬度": "Максимальная ширина",
            "圖片間隔高度": "Интервал между изображениями"
        },
        English: {
            "📝 設置選單": "📝 Settings Menu",
            "設置菜單": "Settings Menu",
            "圖像設置": "Image Settings",
            "讀取設定": "Load Settings",
            "關閉離開": "Close & Exit",
            "保存應用": "Save & Apply",
            "語言": "Language",
            "英文": "English",
            "繁體": "Traditional Chinese",
            "簡體": "Simplified Chinese",
            "日文": "Japanese",
            "韓文": "Korean",
            "俄語": "Russian",
            "圖片高度": "Image Height",
            "圖片寬度": "Image Width",
            "圖片最大寬度": "Max Image Width",
            "圖片間隔高度": "Image Spacing"
        }
    };
    function getLanguage() {
        const Log = Lib.getV(Parame.SaveKey.Lang, navigator.language);
        const ML = Lib.translMatcher(dict, Log);
        return {
            Log: Log,
            Transl: str => ML[str] ?? str
        };
    }
    const MenuFactory = (() => {
        let imgRule, menuRule;
        const importantStyle = (element, property, value) => {
            requestAnimationFrame(() => {
                element.style.setProperty(property, value, "important");
            });
        };
        const normalStyle = (element, property, value) => {
            requestAnimationFrame(() => {
                element.style[property] = value;
            });
        };
        const stylePointer = {
            Top: value => normalStyle(menuRule[1], "top", value),
            Left: value => normalStyle(menuRule[1], "left", value),
            Width: value => importantStyle(imgRule[1], "width", value),
            Height: value => importantStyle(imgRule[1], "height", value),
            MaxWidth: value => importantStyle(imgRule[1], "max-width", value),
            Spacing: value => importantStyle(imgRule[1], "margin", `${value} auto`)
        };
        async function postViewInit() {
            if (Parame.Registered.has("PostViewInit")) return;
            const set = Load.imgSet();
            Lib.addStyle(`
            .post__files > div,
            .scrape__files > div {
                position: relative;
            }
            .Image-style, figure img {
                display: block;
                will-change: transform;
                width: ${set.Width} !important;
                height: ${set.Height} !important;
                margin: ${set.Spacing} auto !important;
                max-width: ${set.MaxWidth} !important;
            }
            .Image-loading-indicator {
                min-width: 50vW;
                min-height: 50vh;
                object-fit: contain;
                border: 2px solid #fafafa;
            }
            .Image-loading-indicator-experiment {
                border: 3px solid #00ff7e;
            }
            .Image-loading-indicator[alt] {
                border: 2px solid #e43a3aff;
            }
            .Image-loading-indicator:hover {
                cursor: pointer;
            }
            .progress-indicator {
                top: 5px;
                left: 5px;
                colo: #fff;
                font-size: 14px;
                padding: 3px 6px;
                position: absolute;
                border-radius: 3px;
                background-color: rgba(0, 0, 0, 0.3);
            }
        `, "Image-Custom-Style", false);
            imgRule = Lib.$q("#Image-Custom-Style")?.sheet.cssRules;
            Lib.storageListen(Object.values(Parame.SaveKey), call => {
                if (call.far) {
                    if (typeof call.nv === "string") {
                        menuInit();
                    } else {
                        for (const [key, value] of Object.entries(call.nv)) {
                            stylePointer[key](value);
                        }
                    }
                }
            });
            Parame.Registered.add("PostViewInit");
        }
        async function draggable(element) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;
            const nonDraggableTags = new Set(["SELECT", "BUTTON", "INPUT", "TEXTAREA", "A"]);
            const handleMouseMove = e => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                element.style.left = `${initialLeft + dx}px`;
                element.style.top = `${initialTop + dy}px`;
            };
            const handleMouseUp = () => {
                if (!isDragging) return;
                isDragging = false;
                element.style.cursor = "auto";
                document.body.style.removeProperty("user-select");
                Lib.offEvent(document, "mousemove");
                Lib.offEvent(document, "mouseup");
            };
            const handleMouseDown = e => {
                if (nonDraggableTags.has(e.target.tagName)) return;
                e.preventDefault();
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const style = window.getComputedStyle(element);
                initialLeft = parseFloat(style.left) || 0;
                initialTop = parseFloat(style.top) || 0;
                element.style.cursor = "grabbing";
                document.body.style.userSelect = "none";
                Lib.onEvent(document, "mousemove", handleMouseMove);
                Lib.onEvent(document, "mouseup", handleMouseUp);
            };
            Lib.onEvent(element, "mousedown", handleMouseDown);
        }
        async function menuInit(callback = null) {
            const {
                Log,
                Transl
            } = getLanguage();
            callback?.({
                Log: Log,
                Transl: Transl
            });
            Lib.regMenu({
                [Transl("📝 設置選單")]: () => createMenu(Log, Transl)
            });
        }
        const menuScript = `
        <script id="menu-script">
            function check(value) {
                return value.toString().length > 4 || value > 1000
                    ? 1000 : value < 0 ? "" : value;
            }
        <\/script>
    `;
        const getImgOptions = (title, key) => `
        <div>
            <h2 class="narrative">${title}：</h2>
            <p>
                <input type="number" data-key="${key}" class="Image-input-settings" oninput="value = check(value)">
                <select data-key="${key}" class="Image-input-settings" style="margin-left: 1rem;">
                    <option value="px" selected>px</option>
                    <option value="%">%</option>
                    <option value="rem">rem</option>
                    <option value="vh">vh</option>
                    <option value="vw">vw</option>
                    <option value="auto">auto</option>
                </select>
            </p>
        </div>
    `;
        function createMenu(Log, Transl) {
            const shadowID = "shadow";
            if (Lib.$q(`#${shadowID}`)) return;
            const imgSet = Load.imgSet();
            const imgSetData = [["圖片高度", "Height", imgSet.Height], ["圖片寬度", "Width", imgSet.Width], ["圖片最大寬度", "MaxWidth", imgSet.MaxWidth], ["圖片間隔高度", "Spacing", imgSet.Spacing]];
            let analyze, img_set, img_input, img_select, set_value, save_cache = {};
            const shadow = Lib.createElement(Lib.body, "div", {
                id: shadowID
            });
            const shadowRoot = shadow.attachShadow({
                mode: "open"
            });
            const menuSet = Load.menuSet();
            const menuStyle = `
            <style id="menu-style">
                .modal-background {
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    z-index: 9999;
                    overflow: auto;
                    position: fixed;
                    pointer-events: none;
                }
                /* 模態介面 */
                .modal-interface {
                    top: ${menuSet.Top};
                    left: ${menuSet.Left};
                    margin: 0;
                    display: flex;
                    overflow: auto;
                    position: fixed;
                    border-radius: 5px;
                    pointer-events: auto;
                    background-color: #2C2E3E;
                    border: 3px solid #EE2B47;
                }
                /* 設定介面 */
                #image-settings-show {
                    width: 0;
                    height: 0;
                    opacity: 0;
                    padding: 10px;
                    overflow: hidden;
                    transition: opacity 0.8s, height 0.8s, width 0.8s;
                }
                /* 模態內容盒 */
                .modal-box {
                    padding: 0.5rem;
                    height: 50vh;
                    width: 32vw;
                }
                /* 菜單框架 */
                .menu {
                    width: 5.5vw;
                    overflow: auto;
                    text-align: center;
                    vertical-align: top;
                    border-radius: 2px;
                    border: 2px solid #F6F6F6;
                }
                /* 菜單文字標題 */
                .menu-text {
                    color: #EE2B47;
                    cursor: default;
                    padding: 0.2rem;
                    margin: 0.3rem;
                    margin-bottom: 1.5rem;
                    white-space: nowrap;
                    border-radius: 10px;
                    border: 4px solid #f05d73;
                    background-color: #1f202c;
                }
                /* 菜單選項按鈕 */
                .menu-options {
                    cursor: pointer;
                    font-size: 1.4rem;
                    color: #F6F6F6;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-bottom: 1.2rem;
                    border: 5px inset #EE2B47;
                    background-color: #6e7292;
                    transition: color 0.8s, background-color 0.8s;
                }
                .menu-options:hover {
                    color: #EE2B47;
                    background-color: #F6F6F6;
                }
                .menu-options:disabled {
                    color: #6e7292;
                    cursor: default;
                    background-color: #c5c5c5;
                    border: 5px inset #faa5b2;
                }
                /* 設置內容框架 */
                .content {
                    height: 48vh;
                    width: 28vw;
                    overflow: auto;
                    padding: 0px 1rem;
                    border-radius: 2px;
                    vertical-align: top;
                    border-top: 2px solid #F6F6F6;
                    border-right: 2px solid #F6F6F6;
                }
                .narrative { color: #EE2B47; }
                .Image-input-settings {
                    width: 8rem;
                    color: #F6F6F6;
                    text-align: center;
                    font-size: 1.5rem;
                    border-radius: 15px;
                    border: 3px inset #EE2B47;
                    background-color: #202127;
                }
                .Image-input-settings:disabled {
                    border: 3px inset #faa5b2;
                    background-color: #5a5a5a;
                }
                /* 底部按鈕框架 */
                .button-area {
                    display: flex;
                    padding: 0.3rem;
                    border-left: none;
                    border-radius: 2px;
                    border: 2px solid #F6F6F6;
                    justify-content: space-between;
                }
                .button-area select {
                    color: #F6F6F6;
                    margin-right: 1.5rem;
                    border: 3px inset #EE2B47;
                    background-color: #6e7292;
                }
                /* 底部選項 */
                .button-options {
                    color: #F6F6F6;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: bold;
                    border-radius: 10px;
                    white-space: nowrap;
                    background-color: #6e7292;
                    border: 3px inset #EE2B47;
                    transition: color 0.5s, background-color 0.5s;
                }
                .button-options:hover {
                    color: #EE2B47;
                    background-color: #F6F6F6;
                }
                .button-space { margin: 0 0.6rem; }
                .toggle-menu {
                    width: 0;
                    height: 0;
                    padding: 0;
                    margin: 0;
                }
                /* 整體框線 */
                table, td {
                    margin: 0px;
                    padding: 0px;
                    overflow: auto;
                    border-spacing: 0px;
                }
                .modal-background p {
                    display: flex;
                    flex-wrap: nowrap;
                }
                option { color: #F6F6F6; }
                ul {
                    list-style: none;
                    padding: 0px;
                    margin: 0px;
                }
            </style>
        `;
            shadowRoot.$safeiHtml(`
            ${menuStyle}
            ${menuScript}
            <div class="modal-background">
                <div class="modal-interface">
                    <table class="modal-box">
                        <tr>
                            <td class="menu">
                                <h2 class="menu-text">${Transl("設置菜單")}</h2>
                                <ul>
                                    <li>
                                        <a class="toggle-menu">
                                            <button class="menu-options" id="image-settings">${Transl("圖像設置")}</button>
                                        </a>
                                    <li>
                                    <li>
                                        <a class="toggle-menu">
                                            <button class="menu-options" disabled>null</button>
                                        </a>
                                    <li>
                                </ul>
                            </td>
                            <td>
                                <table>
                                    <tr>
                                        <td class="content" id="set-content">
                                            <div id="image-settings-show"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="button-area">
                                            <select id="language">
                                                <option value="" disabled selected>${Transl("語言")}</option>
                                                <option value="en-US">${Transl("英文")}</option>
                                                <option value="ru">${Transl("俄語")}</option>
                                                <option value="zh-TW">${Transl("繁體")}</option>
                                                <option value="zh-CN">${Transl("簡體")}</option>
                                                <option value="ja">${Transl("日文")}</option>
                                                <option value="ko">${Transl("韓文")}</option>
                                            </select>
                                            <button id="readsettings" class="button-options" disabled>${Transl("讀取設定")}</button>
                                            <span class="button-space"></span>
                                            <button id="closure" class="button-options">${Transl("關閉離開")}</button>
                                            <span class="button-space"></span>
                                            <button id="application" class="button-options">${Transl("保存應用")}</button>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        `);
            const languageEl = shadowRoot.querySelector("#language");
            const readsetEl = shadowRoot.querySelector("#readsettings");
            const interfaceEl = shadowRoot.querySelector(".modal-interface");
            const imageSetEl = shadowRoot.querySelector("#image-settings-show");
            languageEl.value = Log ?? "en-US";
            draggable(interfaceEl);
            menuRule = shadowRoot.querySelector("#menu-style")?.sheet?.cssRules;
            const menuRequ = {
                menuClose() {
                    shadow.remove();
                },
                menuSave() {
                    const styles = getComputedStyle(interfaceEl);
                    Lib.setV(Parame.SaveKey.Menu, {
                        Top: styles.top,
                        Left: styles.left
                    });
                },
                imgSave() {
                    img_set = imageSetEl.querySelectorAll("p");
                    if (img_set.length === 0) return;
                    imgSetData.forEach(([title, key, set], index) => {
                        img_input = img_set[index].querySelector("input");
                        img_select = img_set[index].querySelector("select");
                        const inputVal = img_input.value;
                        const selectVal = img_select.value;
                        set_value = selectVal === "auto" ? "auto" : inputVal === "" ? set : `${inputVal}${selectVal}`;
                        save_cache[img_input.$gAttr("data-key")] = set_value;
                    });
                    Lib.setV(Parame.SaveKey.Img, save_cache);
                },
                async imgSettings() {
                    let running = false;
                    const handle = event => {
                        if (running) return;
                        running = true;
                        const target = event.target;
                        if (!target) {
                            running = false;
                            return;
                        }
                        const key = target.$gAttr("data-key");
                        const value = target?.value;
                        if (isNaN(value)) {
                            const input = target.previousElementSibling;
                            if (value === "auto") {
                                input.disabled = true;
                                stylePointer[key](value);
                            } else {
                                input.disabled = false;
                                stylePointer[key](`${input.value}${value}`);
                            }
                        } else {
                            const select = target.nextElementSibling;
                            stylePointer[key](`${value}${select.value}`);
                        }
                        setTimeout(() => running = false, 100);
                    };
                    Lib.onEvent(imageSetEl, "input", handle);
                    Lib.onEvent(imageSetEl, "change", handle);
                }
            };
            Lib.onE(languageEl, "change", event => {
                event.stopImmediatePropagation();
                const value = event.currentTarget.value;
                Lib.setV(Parame.SaveKey.Lang, value);
                menuRequ.menuSave();
                menuRequ.menuClose();
                menuInit(Updata => {
                    createMenu(Updata.Log, Updata.Transl);
                });
            });
            Lib.onE(interfaceEl, "click", event => {
                const target = event.target;
                const id = target?.id;
                if (!id) return;
                if (id === "image-settings") {
                    const imgsetCss = menuRule[2].style;
                    if (imgsetCss.opacity === "0") {
                        let dom = "";
                        imgSetData.forEach(([title, key]) => {
                            dom += getImgOptions(Transl(title), key) + "\n";
                        });
                        imageSetEl.insertAdjacentHTML("beforeend", dom);
                        Object.assign(imgsetCss, {
                            width: "auto",
                            height: "auto",
                            opacity: "1"
                        });
                        target.disabled = true;
                        readsetEl.disabled = false;
                        menuRequ.imgSettings();
                    }
                } else if (id === "readsettings") {
                    img_set = imageSetEl.querySelectorAll("p");
                    if (img_set.length === 0) return;
                    imgSetData.forEach(([title, key, set], index) => {
                        img_input = img_set[index].querySelector("input");
                        img_select = img_set[index].querySelector("select");
                        if (set === "auto") {
                            img_input.disabled = true;
                            img_select.value = set;
                        } else {
                            analyze = set?.match(/^(\d+)(\D+)$/);
                            if (!analyze) return;
                            img_input.value = analyze[1];
                            img_select.value = analyze[2];
                        }
                    });
                } else if (id === "application") {
                    menuRequ.imgSave();
                    menuRequ.menuSave();
                    menuRequ.menuClose();
                } else if (id === "closure") {
                    menuRequ.menuClose();
                }
            });
            Lib.onE(imageSetEl, "wheel", event => {
                event.stopPropagation();
            });
        }
        return {
            menuInit: menuInit,
            postViewInit: postViewInit
        };
    })();
    function Main() {
        const Enhance = (() => {
            const runningOrder = {
                Global: ["BlockAds", "CacheFetch", "SidebarCollapse", "DeleteNotice", "TextToLink", "BetterPostCard", "KeyScroll"],
                Preview: ["CardText", "CardZoom", "NewTabOpens", "QuickPostToggle", "BetterThumbnail"],
                Content: ["LinkBeautify", "VideoBeautify", "OriginalImage", "ExtraButton", "CommentFormat"]
            };
            const loadFunc = {
                Global: globalLoader,
                Preview: previewLoader,
                Content: contentLoader
            };
            async function call(page, config = User_Config[page]) {
                const func = loadFunc[page];
                for (const ord of runningOrder[page]) {
                    let userConfig = config[ord];
                    if (!userConfig) continue;
                    if (typeof userConfig !== "object") {
                        userConfig = {
                            enable: true
                        };
                    } else if (!userConfig.enable) continue;
                    func[ord]?.(userConfig);
                }
            }
            return {
                async run() {
                    call("Global");
                    if (Page.isPreview()) call("Preview"); else if (Page.isContent()) {
                        MenuFactory.postViewInit();
                        call("Content");
                        MenuFactory.menuInit();
                    }
                }
            };
        })();
        Enhance.run();
        {
            const waitDom = new MutationObserver(() => {
                waitDom.disconnect();
                Enhance.run();
            });
            Lib.onUrlChange(change => {
                Parame.Url = change.url;
                waitDom.observe(document, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                Lib.body.$sAttr("Enhance", true);
            });
        }
    }
    Main();
})();