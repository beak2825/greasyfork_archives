// ==UserScript==
// @name                Twitch Auto Drops Claim
// @name:zh-TW          Twitch 自動領取掉寶
// @name:zh-CN          Twitch 自动领取掉宝
// @name:en             Twitch Auto Drops Claim
// @name:ja             Twitch 自動ドロップ受け取り
// @name:ko             Twitch 자동 드롭 수령
// @name:ru             Twitch Автоматическое получение дропов
// @version             2025.12.24-Beta
// @author              Canaan HS
// @description         Twitch 自動領取 (掉寶/Drops) , 窗口標籤顯示進度 , 直播結束時還沒領完 , 會自動尋找任意掉寶直播 , 並開啟後繼續掛機 , 代碼自訂義設置
// @description:zh-TW   Twitch 自動領取 (掉寶/Drops) , 窗口標籤顯示進度 , 直播結束時還沒領完 , 會自動尋找任意掉寶直播 , 並開啟後繼續掛機 , 代碼自訂義設置
// @description:zh-CN   Twitch 自动领取 (掉宝/Drops) , 窗口标签显示进度 , 直播结束时还没领完 , 会自动寻找任意掉宝直播 , 并开启后继续挂机 , 代码自定义设置
// @description:en      Automatically claim Twitch Drops, display progress in the tab, and if not finished when the stream ends, it will automatically find another Drops-enabled stream and continue farming. Customizable settings in the code.
// @description:ja      Twitch のドロップを自動的に受け取り、タブに進捗狀況を表示し、ストリーム終了時にまだ受け取っていない場合、自動的に別のドロップ有効なストリームを検索し、収穫を続けます。コードでのカスタマイズ可能な設定
// @description:ko      Twitch 드롭을 자동으로 받아오고 탭에 진행 상황을 표시하며, 스트림이 종료되었을 때 아직 완료되지 않았다면 자동으로 다른 드롭 활성 스트림을 찾아 계속 수집합니다. 코드에서 사용자 정의 설정 가능합니다
// @description:ru      Автоматически получает дропы Twitch, отображает прогресс во вкладке, и если дропы не завершены к концу трансляции, автоматически находит другую трансляцию с активированными дропами и продолжает фарминг. Настраиваемые параметры в коде.

// @match        https://www.twitch.tv/*
// @supportURL   https://github.com/Canaan-HS/MonkeyScript/issues
// @icon         https://cdn-icons-png.flaticon.com/512/8214/8214044.png

// @license      MPL-2.0
// @namespace    https://greasyfork.org/users/989635

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        GM_deleteValue
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand

// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/474799/Twitch%20%E8%87%AA%E5%8B%95%E9%A0%98%E5%8F%96%E6%8E%89%E5%AF%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/474799/Twitch%20%E8%87%AA%E5%8B%95%E9%A0%98%E5%8F%96%E6%8E%89%E5%AF%B6.meta.js
// ==/UserScript==

(() => {
    const Backup = GM_getValue("Config", {});
    const Config = {
        Dev: false, // 開發打印

        RestartLive: true, // 使用重啟直播
        EndAutoClose: true, // 全部進度完成後自動關閉
        TryStayActive: true, // 嘗試讓頁面保持活躍
        RestartLiveMute: true, // 重啟的直播靜音
        RestartLowQuality: false, // 重啟直播最低畫質

        UpdateDisplay: true, // 於標題展示更新倒數
        ClearExpiration: true, // 清除過期的掉寶進度
        ProgressDisplay: true, // 於標題展示掉寶進度

        UpdateInterval: 120, // (seconds) 更新進度狀態的間隔
        JudgmentInterval: 6, // (Minute) 經過多長時間進度無增加, 就重啟直播 [設置太短會可能誤檢測]

        FindTag: ["drops", "啟用掉寶", "启用掉宝", "드롭활성화됨"], // 查找直播標籤, 只要有包含該字串即可
        ...Backup
    };
    const supportPage = "https://www.twitch.tv/drops/inventory";
    const supportCheck = (url = location.href) => url === supportPage;
    class Detection {
        constructor() {
            this.progressParse = progress => progress.sort((a, b) => b - a).find(number => number < 100);
            this.getTime = () => {
                const time = this.currentTime;
                const year = time.getFullYear();
                const month = `${time.getMonth() + 1}`.padStart(2, "0");
                const date = `${time.getDate()}`.padStart(2, "0");
                const hour = `${time.getHours()}`.padStart(2, "0");
                const minute = `${time.getMinutes()}`.padStart(2, "0");
                const second = `${time.getSeconds()}`.padStart(2, "0");
                return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
            };
            this.storage = (key, value = null) => value == null ? (value = sessionStorage.getItem(key),
                value != null ? JSON.parse(value) : value) : sessionStorage.setItem(key, JSON.stringify(value));
            this.adapter = {
                _convertPM: time => time.replace(/(\d{1,2}):(\d{2})/, (_, hours, minutes) => `${+hours + 12}:${minutes}`),
                "en-US": (timeStamp, currentYear) => new Date(`${timeStamp} ${currentYear}`),
                "en-GB": (timeStamp, currentYear) => new Date(`${timeStamp} ${currentYear}`),
                "es-ES": (timeStamp, currentYear) => new Date(`${timeStamp} ${currentYear}`),
                "fr-FR": (timeStamp, currentYear) => new Date(`${timeStamp} ${currentYear}`),
                "pt-PT": (timeStamp, currentYear) => {
                    const convert = timeStamp.replace(/(\d{1,2})\/(\d{1,2})/, (_, day, month) => `${month}/${day}`);
                    return new Date(`${convert} ${currentYear}`);
                },
                "pt-BR": (timeStamp, currentYear) => {
                    const ISO = { jan: "Jan", fev: "Feb", mar: "Mar", abr: "Apr", mai: "May", jun: "Jun", jul: "Jul", ago: "Aug", set: "Sep", out: "Oct", nov: "Nov", dez: "Dec", dom: "Sun", seg: "Mon", ter: "Tue", qua: "Wed", qui: "Thu", sex: "Fri", "sáb": "Sat" };
                    const convert = timeStamp.replace(/de/g, "").replace(/(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|dom|seg|ter|qua|qui|sex|sáb)/gi, match => ISO[match.toLowerCase()]);
                    return new Date(`${convert} ${currentYear}`);
                },
                "ru-RU": (timeStamp, currentYear) => {
                    const ISO = { "янв": "Jan", "фев": "Feb", "мар": "Mar", "апр": "Apr", "май": "May", "июн": "Jun", "июл": "Jul", "авг": "Aug", "сен": "Sep", "окт": "Oct", "ноя": "Nov", "дек": "Dec", "пн": "Mon", "вт": "Tue", "ср": "Wed", "чт": "Thu", "пт": "Fri", "сб": "Sat", "вс": "Sun" };
                    const convert = timeStamp.replace(/(янв|фев|мар|апр|май|июн|июл|авг|сен|окт|ноя|дек|пн|вт|ср|чт|пт|сб|вс)/gi, match => ISO[match.toLowerCase()]);
                    return new Date(`${convert} ${currentYear}`);
                },
                "de-DE": (timeStamp, currentYear) => {
                    const ISO = { jan: "Jan", feb: "Feb", "mär": "Mar", apr: "Apr", mai: "May", jun: "Jun", jul: "Jul", aug: "Aug", sep: "Sep", okt: "Oct", nov: "Nov", dez: "Dec", mo: "Mon", di: "Tue", mi: "Wed", do: "Thu", fr: "Fri", sa: "Sat", so: "Sun" };
                    const convert = timeStamp.replace(/(jan|feb|mär|apr|mai|jun|jul|aug|sep|okt|nov|dez|mo|di|mi|do|fr|sa|so)/gi, match => ISO[match.toLowerCase()]);
                    return new Date(`${convert} ${currentYear}`);
                },
                "it-IT": (timeStamp, currentYear) => {
                    const ISO = { gen: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", mag: "May", giu: "Jun", lug: "Jul", ago: "Aug", set: "Sep", ott: "Oct", nov: "Nov", dic: "Dec", dom: "Sun", lun: "Mon", mar: "Tue", mer: "Wed", gio: "Thu", ven: "Fri", sab: "Sat" };
                    const convert = timeStamp.replace(/(gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic|dom|lun|mar|mer|gio|ven|sab)/gi, match => ISO[match.toLowerCase()]);
                    return new Date(`${convert} ${currentYear}`);
                },
                "tr-TR": (timeStamp, currentYear) => {
                    const ISO = { oca: "Jan", "şub": "Feb", mar: "Mar", nis: "Apr", may: "May", haz: "Jun", tem: "Jul", "ağu": "Aug", eyl: "Sep", eki: "Oct", kas: "Nov", ara: "Dec", paz: "Sun", pts: "Mon", sal: "Tue", "çar": "Wed", per: "Thu", cum: "Fri", cmt: "Sat" };
                    const convert = timeStamp.replace(/(oca|şub|mar|nis|may|haz|tem|ağu|eyl|eki|kas|ara|paz|pts|sal|çar|per|cum|cmt)/gi, match => ISO[match.toLowerCase()]);
                    const match = convert.match(/(\d{1,2}) ([a-z]+) ([a-z]+) (\d{1,2}:\d{1,2}) (GMT[+-]\d{1,2})/i);
                    return new Date(`${match[3]} ${match[1]} ${match[2]} ${match[4]} ${match[5]} ${currentYear}`);
                },
                "es-MX": (timeStamp, currentYear) => {
                    const match = timeStamp.match(/^([a-zñáéíóúü]+) (\d{1,2}) de ([a-zñáéíóúü]+), (\d{1,2}:\d{1,2}) (?:[ap]\.m\.) (GMT[+-]\d{1,2})/i);
                    const time = timeStamp.includes("p.m") ? this.adapter._convertPM(match[4]) : match[4];
                    return new Date(`${match[1]}, ${match[2]} ${match[3]}, ${time} ${match[5]} ${currentYear}`);
                },
                "ja-JP": (timeStamp, currentYear) => {
                    const match = timeStamp.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{1,2}:\d{1,2}) (GMT[+-]\d{1,2})/);
                    return new Date(`${currentYear}-${match[1]}-${match[2]} ${match[3]}:00 ${match[4]}`);
                },
                "ko-KR": (timeStamp, currentYear) => {
                    const match = timeStamp.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{1,2}:\d{1,2}) (GMT[+-]\d{1,2})/);
                    const time = timeStamp.includes("오후") ? this.adapter._convertPM(match[3]) : match[3];
                    return new Date(`${currentYear}-${match[1]}-${match[2]} ${time}:00 ${match[4]}`);
                },
                "zh-TW": (timeStamp, currentYear) => {
                    const match = timeStamp.match(/(\d{1,2})\D+(\d{1,2})\D+\D+(\d{1,2}:\d{1,2}) \[(GMT[+-]\d{1,2})\]/);
                    const time = timeStamp.includes("下午") ? this.adapter._convertPM(match[3]) : match[3];
                    return new Date(`${currentYear}-${match[1]}-${match[2]} ${time}:00 ${match[4]}`);
                },
                "zh-CN": (timeStamp, currentYear) => {
                    const match = timeStamp.match(/(\d{1,2})\D+(\d{1,2})\D+\D+(GMT[+-]\d{1,2}) (\d{1,2}:\d{1,2})/);
                    return new Date(`${currentYear}-${match[1]}-${match[2]} ${match[4]}:00 ${match[3]}`);
                }
            };
            this.pageRefresh = async (updateDisplay, interval, finishCall) => {
                let timer;
                const start = Date.now();
                const refresh = setInterval(() => {
                    if (!supportCheck()) {
                        clearInterval(refresh);
                        clearTimeout(timer);
                        this.titleObserver?.disconnect();
                        finishCall?.();
                    } else if (updateDisplay) {
                        const elapsed = Math.floor((Date.now() - start) / 1e3);
                        const remaining = interval - elapsed;
                        if (remaining >= 0) {
                            document.title = `【 ${remaining}s 】 ${this.progressStr}`;
                        }
                    }
                }, 1e3);
                timer = setTimeout(() => {
                    clearInterval(refresh);
                    finishCall?.();
                }, (interval + 1) * 1e3);
            };
            this.showProgress = () => {
                this.titleObserver = new MutationObserver(() => {
                    document.title !== this.progressStr && (document.title = this.progressStr);
                });
                this.titleObserver.observe(document.querySelector("title"), {
                    childList: 1,
                    subtree: 0
                });
                document.title = this.progressStr;
            };
            this.expiredCleanup = (element, adapter, timestamp, callback) => {
                const targetTime = adapter?.(timestamp, this.currentTime.getFullYear()) ?? this.currentTime;
                this.currentTime > targetTime ? this.config.ClearExpiration && element.remove() : callback(element);
            };
            this.progressStr;
            this.titleObserver;
            this.config = {
                ...Config,
                EndLine: "p a[href='/drops/campaigns']",
                Campaigns: "a[href='/drops/campaigns']",
                Inventory: "a[href='/drops/inventory']",
                allProgress: ".inventory-max-width > div:not(:first-child)",
                ProgressBar: "[role='progressbar'] + div span",
                ActivityTime: ".inventory-campaign-info span:last-child"
            };
        }
        get currentTime() {
            return new Date();
        }
        async run() {
            regMenu();
            const config = this.config;
            const updateDisplay = config.UpdateDisplay;
            let campaigns, inventory, adapter;
            let taskCount, currentProgress, inProgressIndex, progressInfo;
            const initData = () => {
                this.progressStr = "Twitch";
                taskCount = 0, currentProgress = 0, inProgressIndex = 0;
                progressInfo = {};
            };
            initData();
            const process = (token = 5) => {
                campaigns ??= devTrace("Campaigns", document.querySelector(config.Campaigns));
                inventory ??= devTrace("Inventory", document.querySelector(config.Inventory));
                const allProgress = devTrace("AllProgress", document.querySelectorAll(config.allProgress));
                if (allProgress?.length > 0) {
                    let activityTime, progressBar;
                    adapter ??= this.adapter[document.documentElement.lang];
                    allProgress.forEach(data => {
                        activityTime = devTrace("ActivityTime", data.querySelector(config.ActivityTime));
                        this.expiredCleanup(data, adapter, activityTime?.textContent, notExpired => {
                            notExpired.querySelectorAll("button").forEach(draw => {
                                draw.click();
                            });
                            progressBar = devTrace("ProgressBar", notExpired.querySelectorAll(config.ProgressBar));
                            progressInfo[taskCount++] = [...progressBar].map(progress => +progress.textContent);
                        });
                    });
                    const oldTask = this.storage("Task") ?? {};
                    const newTask = Object.fromEntries(Object.entries(progressInfo).map(([key, value]) => [key, this.progressParse(value)]));
                    let taskIndex, newProgress;
                    const taskEntries = Object.entries(newTask);
                    for ([taskIndex, newProgress] of taskEntries) {
                        const oldProgress = oldTask[taskIndex] || newProgress;
                        if (newProgress !== oldProgress) {
                            inProgressIndex = taskIndex;
                            currentProgress = newProgress;
                            break;
                        }
                    }
                    if (typeof inProgressIndex === "number" && taskEntries.length > 1) {
                        [taskIndex, newProgress] = taskEntries.reduce((max, cur) => cur[1] > max[1] ? cur : max);
                        inProgressIndex = taskIndex;
                        currentProgress = newProgress;
                    }
                    this.storage("Task", newTask);
                }
                if (currentProgress > 0) {
                    if (config.ProgressDisplay) {
                        this.progressStr = `${currentProgress}%`;
                        !updateDisplay && this.showProgress();
                    }
                } else if (token > 0 && supportCheck()) {
                    setTimeout(() => {
                        process(token - 1);
                    }, 2e3);
                    return;
                }
                const [record, timestamp] = this.storage("Record") ?? [0, this.getTime()];
                const diffInterval = ~~((this.currentTime - new Date(timestamp)) / (1e3 * 60));
                const notHasToken = token === 0;
                const hasProgress = currentProgress > 0;
                if (diffInterval >= config.JudgmentInterval && hasProgress && currentProgress === record) {
                    config.RestartLive && restartLive.run(inProgressIndex);
                    this.storage("Record", [currentProgress, this.getTime()]);
                } else if (hasProgress && currentProgress !== record) {
                    this.storage("Record", [currentProgress, this.getTime()]);
                } else if (config.EndAutoClose && notHasToken && !hasProgress && record !== 0) {
                    window.open("", "NewWindow", "top=0,left=0,width=1,height=1").close();
                    window.close();
                } else if (notHasToken && record !== 0 && supportCheck()) {
                    location.assign(supportPage);
                }
            };
            const waitLoad = (select, interval = 500, timeout = 15e3) => {
                let elapsed = 0;
                return new Promise((resolve, reject) => {
                    const query = () => {
                        if (document.querySelector(select)) resolve(); else {
                            elapsed += interval;
                            elapsed >= timeout ? supportCheck() && location.assign(supportPage) : setTimeout(query, interval);
                        }
                    };
                    setTimeout(query, interval);
                });
            };
            const monitor = () => {
                this.pageRefresh(updateDisplay, config.UpdateInterval, async () => {
                    initData();
                    if (!supportCheck()) {
                        waitSupport();
                        return;
                    }
                    campaigns?.click();
                    await waitLoad(".accordion-header");
                    inventory?.click();
                    await waitLoad(config.EndLine);
                    process();
                    monitor();
                });
            };
            waitEl(document, config.EndLine, () => {
                process();
                monitor();
                config.TryStayActive && stayActive(document);
            }, {
                timeoutResult: true
            });
        }
    }
    class RestartLive {
        constructor() {
            this.liveMute = async _document => {
                waitEl(_document, "video", video => {
                    const silentInterval = setInterval(() => {
                        video.muted = 1;
                    }, 500);
                    setTimeout(() => {
                        clearInterval(silentInterval);
                    }, 15e3);
                });
            };
            this.liveLowQuality = async _document => {
                const dom = _document;
                waitEl(dom, "[data-a-target='player-settings-button']", menu => {
                    menu.click();
                    waitEl(dom, "[data-a-target='player-settings-menu-item-quality']", quality => {
                        quality.click();
                        waitEl(dom, "[data-a-target='player-settings-menu']", settings => {
                            settings.lastElementChild.click();
                            setTimeout(() => menu.click(), 800);
                        });
                    });
                });
            };
            this.waitDocument = async (_window, checkFu) => {
                let _document, animationFrame;
                return new Promise((resolve, reject) => {
                    let observe;
                    _window.onload = () => {
                        cancelAnimationFrame(animationFrame);
                        _document = _window.document;
                        observe = new MutationObserver($throttle(() => {
                            if (checkFu(_document)) {
                                observe.disconnect();
                                resolve(_document);
                            }
                        }, 300));
                        observe.observe(_document, {
                            subtree: 1,
                            childList: 1,
                            characterData: 1
                        });
                    };
                    const query = () => {
                        _document = _window.document;
                        if (_document && checkFu(_document)) {
                            cancelAnimationFrame(animationFrame);
                            observe?.disconnect();
                            resolve(_document);
                        } else {
                            animationFrame = requestAnimationFrame(query);
                        }
                    };
                    animationFrame = requestAnimationFrame(query);
                });
            };
            this.config = {
                ...Config,
                Offline: ".home-carousel-info strong",
                Online: "[data-a-target='animated-channel-viewers-count']",
                Channel: ".preview-card-channel-link",
                Container: "#directory-game-main-content",
                ContainerHandle: ".scrollable-area",
                ActivityLink1: "[data-test-selector='DropsCampaignInProgressDescription-hint-text-parent']",
                ActivityLink2: "[data-test-selector='DropsCampaignInProgressDescription-no-channels-hint-text']"
            };
        }
        async run(maxIndex) {
            window.open("", "NewWindow", "top=0,left=0,width=1,height=1").close();
            const self = this;
            const config = self.config;
            let newWindow;
            let channel = document.querySelectorAll(config.ActivityLink2)[maxIndex];
            if (channel) {
                newWindow = window.open(channel.href, "NewWindow");
                dirSearch(newWindow);
            } else {
                channel = document.querySelectorAll(config.ActivityLink1)[maxIndex];
                const openLink = [...channel.querySelectorAll("a")].reverse();
                findLive(0);
                async function findLive(index) {
                    if (openLink.length - 1 < index) return 0;
                    const href = openLink[index].href;
                    newWindow = !newWindow ? window.open(href, "NewWindow") : (newWindow.location.assign(href),
                        newWindow);
                    if (href.includes("directory")) {
                        dirSearch(newWindow);
                    } else {
                        const _document = await self.waitDocument(newWindow, document => document.querySelector(config.Offline) || document.querySelector(config.Online));
                        if (devTrace("Offline", _document.querySelector(config.Offline))) {
                            findLive(index + 1);
                        } else if (devTrace("Online", _document.querySelector(config.Online))) {
                            config.RestartLiveMute && self.liveMute(_document);
                            config.TryStayActive && stayActive(_document);
                            config.RestartLowQuality && self.liveLowQuality(_document);
                        }
                    }
                }
            }
            const pattern = config.FindTag.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
            const tagRegex = new RegExp(pattern, "i");
            async function dirSearch(newWindow) {
                const _document = await self.waitDocument(newWindow, document => document.querySelector(config.Container));
                let scrollHandle;
                const container = devTrace("Container", _document.querySelector(config.Container));
                const startFind = () => {
                    try {
                        scrollHandle ??= devTrace("ContainerHandle", container.closest(config.ContainerHandle));
                        const channel = devTrace("Channel", container.querySelectorAll(`${config.Channel}:not([Drops-Processed])`));
                        const liveLink = [...channel].find(channel => {
                            channel.setAttribute("Drops-Processed", true);
                            const haveDrops = [...channel.nextElementSibling?.querySelectorAll("span")].some(span => tagRegex.test(span.textContent));
                            return haveDrops ? channel : null;
                        });
                        if (liveLink) {
                            liveLink.click();
                            liveLink.click();
                            config.RestartLiveMute && self.liveMute(_document);
                            config.TryStayActive && stayActive(_document);
                            config.RestartLowQuality && self.liveLowQuality(_document);
                        } else if (scrollHandle) {
                            scrollHandle.scrollTo({
                                top: scrollHandle.scrollHeight
                            });
                            setTimeout(startFind, 1500);
                        }
                    } catch {
                        setTimeout(startFind, 1500);
                    }
                };
                startFind();
            }
        }
    }
    async function stayActive(_document) {
        const id = "Stay-Active";
        const head = _document.head;
        if (head.getElementById(id)) return;
        const script = document.createElement("script");
        script.id = id;
        script.textContent = `
            function WorkerCreation(code) {
                const blob = new Blob([code], {type: "application/javascript"});
                return new Worker(URL.createObjectURL(blob));
            }

            const Active = WorkerCreation(\`
                onmessage = function(e) {
                    setTimeout(() => {
                        const { url } = e.data;
                        fetch(url);
                        postMessage({ url });
                    }, 1e4);
                }
            \`);

            Active.postMessage({ url: location.href });
            Active.onmessage = (e) => {
                const { url } = e.data;
                document.querySelector("video")?.play();
                Active.postMessage({ url });
            };

            let emptyAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEA...");
            emptyAudio.loop = true;
            emptyAudio.muted = true;

            // 後台播放 / 前台暫停
            const visHandler = (isHidden) => {
                if (typeof isHidden !== 'boolean') isHidden = document.hidden;
                if (isHidden) {
                    emptyAudio.play().catch(()=>{});
                } else {
                    emptyAudio.pause();
                }
            };

            if (typeof document.hidden !== "undefined") {
                document.addEventListener("visibilitychange", () => visHandler());
            } else {
                window.addEventListener("focus", () => visHandler(false));
                window.addEventListener("blur", () => visHandler(true));
            }

            visHandler();
        `;
        head.append(script);
    }
    function $throttle(func, delay) {
        let lastTime = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                func(...args);
            }
        };
    }
    let cleaner = null;
    let traceRecord = {};
    function getCompositeKey(elements) {
        return Array.from(elements).map(el => {
            if (!(el instanceof Element)) return "";
            return el.tagName + (el.id || "id") + (el.className || "class");
        }).join("|");
    }
    function devTrace(tag, element) {
        if (!Config.Dev) return element;
        const isNodeList = element instanceof NodeList;
        const recordKey = isNodeList ? getCompositeKey(element) : element;
        if (traceRecord[tag]?.has(recordKey)) return element;
        traceRecord[tag] = new Map().set(recordKey, true);
        clearTimeout(cleaner);
        cleaner = setTimeout(() => {
            traceRecord = {};
        }, 1e4);
        const isEmpty = !element || isNodeList && element.length === 0;
        const baseStyle = "padding: 2px 6px; border-radius: 3px; font-weight: bold; margin: 0 2px;";
        const tagStyle = `${baseStyle} background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);`;
        let statusStyle, statusIcon, statusText;
        if (isEmpty) {
            statusStyle = `${baseStyle} background: linear-gradient(45deg, #e74c3c 0%, #c0392b 100%); color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);`;
            statusIcon = "❌";
            statusText = "NOT FOUND";
        } else {
            statusStyle = `${baseStyle} background: linear-gradient(45deg, #2ecc71 0%, #27ae60 100%); color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);`;
            statusIcon = "✅";
            statusText = "FOUND";
        }
        console.groupCollapsed(`%c🔍 ${tag} %c${statusIcon} ${statusText}`, tagStyle, statusStyle);
        if (isEmpty) {
            console.log(`%c📭 Element: %c${element === null ? "null" : "empty NodeList"}`, "color: #e74c3c; font-weight: bold;", "color: #c0392b; font-style: italic;");
        } else {
            console.log("%c📦 Element:", "color: #27ae60; font-weight: bold;", element);
        }
        console.trace("🎯 Source");
        console.groupEnd();
        return element;
    }
    async function waitEl(document, selector, found, {
        timeout = 1e4,
        throttle = 200,
        timeoutResult = false
    } = {}) {
        let timer, element;
        const observer = new MutationObserver($throttle(() => {
            element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                clearTimeout(timer);
                found(element);
            }
        }, throttle));
        observer.observe(document, {
            subtree: 1,
            childList: 1,
            characterData: 1
        });
        timer = setTimeout(() => {
            observer.disconnect();
            timeoutResult && found(element);
        }, timeout);
    }
    function onUrlChange(callback, timeout = 15) {
        let timer = null;
        let cleaned = false;
        let support_urlchange = false;
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        const eventHandler = {
            urlchange: () => trigger("urlchange"),
            popstate: () => trigger("popstate"),
            hashchange: () => trigger("hashchange")
        };
        function trigger(type) {
            clearTimeout(timer);
            if (!support_urlchange && type === "urlchange") support_urlchange = true;
            timer = setTimeout(() => {
                if (support_urlchange) off(false, true);
                callback({
                    type: type,
                    url: location.href,
                    domain: location.hostname
                });
            }, Math.max(15, timeout));
        }
        function off(all = true, clean = false) {
            if (clean && cleaned) return;
            clearTimeout(timer);
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener("popstate", eventHandler.popstate);
            window.removeEventListener("hashchange", eventHandler.hashchange);
            all && window.removeEventListener("urlchange", eventHandler.urlchange);
            cleaned = true;
        }
        window.addEventListener("urlchange", eventHandler.urlchange);
        window.addEventListener("popstate", eventHandler.popstate);
        window.addEventListener("hashchange", eventHandler.hashchange);
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            trigger("pushState");
        };
        history.replaceState = function () {
            originalReplaceState.apply(this, arguments);
            trigger("replacestate");
        };
        return {
            off: off
        };
    }
    function regMenu() {
        if (Object.keys(Backup).length > 0) {
            GM_registerMenuCommand("🗑️ Clear Config", () => {
                GM_deleteValue("Config");
                location.reload();
            });
        } else {
            const SaveConfig = structuredClone(Config);
            GM_registerMenuCommand("📝 Save Config", () => {
                GM_setValue("Config", SaveConfig);
            });
        }
    }
    function waitSupport() {
        const {
            off
        } = onUrlChange(uri => {
            if (supportCheck(uri.url)) {
                new Detection().run();
                off();
            }
        });
    }
    const restartLive = new RestartLive();
    if (supportCheck()) new Detection().run(); else waitSupport();
})();