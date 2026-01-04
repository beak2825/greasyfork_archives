// ==UserScript==
// @name         Media Volume Booster
// @name:zh-TW   媒體音量增強器
// @name:zh-CN   媒体音量增强器
// @name:en      Media Volume Booster
// @version      2025.12.12-Beta
// @author       Canaan HS
// @description         調整媒體音量與濾波器，增強倍數最高 20 倍，設置可記住並自動應用。部分網站可能無效、無聲音或無法播放，可選擇禁用。
// @description:zh-TW   調整媒體音量與濾波器，增強倍數最高 20 倍，設置可記住並自動應用。部分網站可能無效、無聲音或無法播放，可選擇禁用。
// @description:zh-CN   调整媒体音量与滤波器，增强倍数最高 20 倍，设置可记住并自动应用。部分网站可能无效、无声音或无法播放，可选择禁用。
// @description:en      Adjust media volume and filters with enhancement factor up to 20x. Settings are saved and auto-applied. May not work on some sites (causing no sound or playback issues). Can be disabled if needed.

// @noframes
// @match        *://*/*
// @icon         https://cdn-icons-png.flaticon.com/512/16108/16108408.png

// @license      MPL-2.0
// @namespace    https://greasyfork.org/users/989635
// @supportURL   https://github.com/Canaan-HS/MonkeyScript/issues

// @resource     Icon https://cdn-icons-png.flaticon.com/512/11243/11243783.png
// @require      https://update.greasyfork.org/scripts/487608/1711627/SyntaxLite_min.js

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener

// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/472190/%E5%AA%92%E9%AB%94%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%B7%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/472190/%E5%AA%92%E9%AB%94%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%B7%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    const Default = {
        Gain: 1,
        LowFilterGain: 1.2,
        LowFilterFreq: 200,
        MidFilterQ: 1,
        MidFilterGain: 1.6,
        MidFilterFreq: 2e3,
        HighFilterGain: 1.8,
        HighFilterFreq: 1e4,
        CompressorRatio: 3,
        CompressorKnee: 4,
        CompressorThreshold: -8,
        CompressorAttack: .03,
        CompressorRelease: .2
    };
    const Share = {
        Menu: null,
        Parame: null,
        SetControl: null,
        ProcessLock: false,
        EnhancedNodes: [],
        ProcessedElements: new WeakSet()
    };
    const word = {
        Traditional: {},
        Simplified: {
            "🛠️ 調整菜單": "🛠️ 调整菜单",
            "✂️ 斷開增幅": "✂️ 断开增幅",
            "🔗 恢復增幅": "🔗 恢复增幅",
            "❌ 禁用網域": "❌ 禁用网域",
            "✅ 啟用網域": "✅ 启用网域",
            "增強錯誤": "增强错误",
            "音量增強器": "音量增强器",
            "增強倍數 ": "增强倍数 ",
            " 倍": " 倍",
            "增益": "增益",
            "頻率": "频率",
            "Q值": "Q值",
            "低頻設定": "低频设置",
            "中頻設定": "中频设置",
            "高頻設定": "高频设置",
            "動態壓縮": "动态压缩",
            "壓縮率": "压缩率",
            "過渡反應": "过渡反应",
            "閾值": "阈值",
            "起音速度": "起音速度",
            "釋放速度": "释放速度",
            "關閉": "关闭",
            "保存": "保存",
            "不支援的媒體跳過": "不支持的媒体跳过",
            "不支援音頻增強節點": "不支持音频增强节点",
            "添加增強節點成功": "添加增强节点成功",
            "添加增強節點失敗": "添加增强节点失败",
            "當前沒有被增幅的媒體": "当前没有被增幅的媒体",
            "快捷組合 : (Alt + B)": "快捷组合 : (Alt + B)"
        },
        English: {
            "🛠️ 調整菜單": "🛠️ Settings Menu",
            "✂️ 斷開增幅": "✂️ Disconnect Amplification",
            "🔗 恢復增幅": "🔗 Restore Amplification",
            "❌ 禁用網域": "❌ Disable Domain",
            "✅ 啟用網域": "✅ Enable Domain",
            "增強錯誤": "Enhancement Error",
            "音量增強器": "Volume Booster",
            "增強倍數 ": "Enhancement Multiplier ",
            " 倍": "x",
            "增益": "Gain",
            "頻率": "Frequency",
            "Q值": "Q Factor",
            "低頻設定": "Low Frequency Settings",
            "中頻設定": "Mid Frequency Settings",
            "高頻設定": "High Frequency Settings",
            "動態壓縮": "Dynamic Compressor",
            "壓縮率": "Compression Ratio",
            "過渡反應": "Knee",
            "閾值": "Threshold",
            "起音速度": "Attack",
            "釋放速度": "Release",
            "關閉": "Close",
            "保存": "Save",
            "不支援的媒體跳過": "Unsupported Media Skipped",
            "不支援音頻增強節點": "Audio Enhancement Node Not Supported",
            "添加增強節點成功": "Enhancement Node Added Successfully",
            "添加增強節點失敗": "Failed to Add Enhancement Node",
            "當前沒有被增幅的媒體": "No media is currently being amplified",
            "快捷組合 : (Alt + B)": "Shortcut: (Alt + B)"
        }
    };
    const {
        Transl
    } = (() => {
        const matcher = Lib.translMatcher(word);
        return {
            Transl: str => matcher[str] ?? str
        };
    })();
    const bannedDomains = (() => {
        let banned = new Set(Lib.getV("Banned", []));
        let excludeStatus = banned.has(Lib.$domain);
        return {
            isEnabled: callback => callback(!excludeStatus),
            addBanned: async () => {
                excludeStatus ? banned.delete(Lib.$domain) : banned.add(Lib.$domain);
                Lib.setV("Banned", [ ...banned ]);
                location.reload();
            }
        };
    })();
    const updateParame = () => {
        let Config = Lib.getV(Lib.$domain, {});
        if (typeof Config === "number") {
            Config = {
                Gain: Config
            };
        }
        Share.Parame = Object.assign({}, Default, Config);
    };
    const Booster = (() => {
        let updated = false;
        let initialized = false;
        let mediaAudioContent = null;
        const audioContext = window.AudioContext || window.webkitAudioContext;
        function booster(mediaObj) {
            try {
                if (!audioContext) throw new Error(Transl("不支援音頻增強節點"));
                if (!mediaAudioContent) mediaAudioContent = new audioContext();
                if (mediaAudioContent.state === "suspended") mediaAudioContent.resume();
                const successNode = [];
                for (const media of mediaObj) {
                    Share.ProcessedElements.add(media);
                    if (media.mediaKeys || media.encrypted || window.MediaSource && media.srcObject instanceof MediaSource) {
                        Lib.log(media, {
                            group: Transl("不支援的媒體跳過"),
                            collapsed: false
                        });
                        continue;
                    }
                    try {
                        if (!media.crossOrigin && media.src && !media.src.startsWith("blob:")) {
                            const src = media.src;
                            media.crossOrigin = "anonymous";
                            media.src = "";
                            media.src = src;
                        }
                        const SourceNode = mediaAudioContent.createMediaElementSource(media);
                        const GainNode = mediaAudioContent.createGain();
                        const LowFilterNode = mediaAudioContent.createBiquadFilter();
                        const MidFilterNode = mediaAudioContent.createBiquadFilter();
                        const HighFilterNode = mediaAudioContent.createBiquadFilter();
                        const CompressorNode = mediaAudioContent.createDynamicsCompressor();
                        GainNode.gain.value = Share.Parame.Gain;
                        LowFilterNode.type = "lowshelf";
                        LowFilterNode.gain.value = Share.Parame.LowFilterGain;
                        LowFilterNode.frequency.value = Share.Parame.LowFilterFreq;
                        MidFilterNode.type = "peaking";
                        MidFilterNode.Q.value = Share.Parame.MidFilterQ;
                        MidFilterNode.gain.value = Share.Parame.MidFilterGain;
                        MidFilterNode.frequency.value = Share.Parame.MidFilterFreq;
                        HighFilterNode.type = "highshelf";
                        HighFilterNode.gain.value = Share.Parame.HighFilterGain;
                        HighFilterNode.frequency.value = Share.Parame.HighFilterFreq;
                        CompressorNode.ratio.value = Share.Parame.CompressorRatio;
                        CompressorNode.knee.value = Share.Parame.CompressorKnee;
                        CompressorNode.threshold.value = Share.Parame.CompressorThreshold;
                        CompressorNode.attack.value = Share.Parame.CompressorAttack;
                        CompressorNode.release.value = Share.Parame.CompressorRelease;
                        SourceNode.connect(GainNode).connect(LowFilterNode).connect(MidFilterNode).connect(HighFilterNode).connect(CompressorNode).connect(mediaAudioContent.destination);
                        Share.EnhancedNodes.push({
                            Connected: true,
                            Destination: mediaAudioContent.destination,
                            SourceNode: SourceNode,
                            GainNode: GainNode,
                            LowFilterNode: LowFilterNode,
                            MidFilterNode: MidFilterNode,
                            HighFilterNode: HighFilterNode,
                            CompressorNode: CompressorNode,
                            Gain: GainNode.gain,
                            LowFilterGain: LowFilterNode.gain,
                            LowFilterFreq: LowFilterNode.frequency,
                            MidFilterQ: MidFilterNode.Q,
                            MidFilterGain: MidFilterNode.gain,
                            MidFilterFreq: MidFilterNode.frequency,
                            HighFilterGain: HighFilterNode.gain,
                            HighFilterFreq: HighFilterNode.frequency,
                            CompressorRatio: CompressorNode.ratio,
                            CompressorKnee: CompressorNode.knee,
                            CompressorThreshold: CompressorNode.threshold,
                            CompressorAttack: CompressorNode.attack,
                            CompressorRelease: CompressorNode.release
                        });
                        successNode.push(media);
                    } catch (error) {
                        Lib.log({
                            media: media,
                            error: error
                        }, {
                            group: Transl("添加增強節點失敗"),
                            collapsed: false
                        }).error;
                    }
                }
                if (successNode.length > 0) {
                    Share.ProcessLock = false;
                    Lib.log(successNode, {
                        group: Transl("添加增強節點成功"),
                        collapsed: false
                    });
                    if (!initialized) {
                        initialized = true;
                        let disconnected = false;
                        const regChange = () => {
                            Lib.regMenu({
                                [Transl(disconnected ? "🔗 恢復增幅" : "✂️ 斷開增幅")]: () => {
                                    if (Share.EnhancedNodes.length === 0) {
                                        alert(Transl("當前沒有被增幅的媒體"));
                                        return;
                                    }
                                    Share.EnhancedNodes.forEach(items => {
                                        const {
                                            Connected,
                                            SourceNode,
                                            GainNode,
                                            LowFilterNode,
                                            MidFilterNode,
                                            HighFilterNode,
                                            CompressorNode,
                                            Destination
                                        } = items;
                                        if (disconnected && !Connected) {
                                            SourceNode.connect(GainNode).connect(LowFilterNode).connect(MidFilterNode).connect(HighFilterNode).connect(CompressorNode).connect(Destination);
                                            items.Connected = true;
                                        } else if (!disconnected && Connected) {
                                            SourceNode.disconnect();
                                            GainNode.disconnect();
                                            LowFilterNode.disconnect();
                                            MidFilterNode.disconnect();
                                            HighFilterNode.disconnect();
                                            CompressorNode.disconnect();
                                            SourceNode.connect(Destination);
                                            items.Connected = false;
                                        }
                                    });
                                    disconnected = !disconnected;
                                    regChange();
                                },
                                [Transl("🛠️ 調整菜單")]: {
                                    desc: Transl("快捷組合 : (Alt + B)"),
                                    func: () => {
                                        Share.Menu();
                                    }
                                }
                            }, {
                                index: 2
                            });
                        };
                        regChange();
                        Lib.onEvent(document, "keydown", event => {
                            if (event.altKey && event.key.toUpperCase() == "B") Share.Menu();
                        }, {
                            passive: true,
                            capture: true,
                            mark: "Media-Booster-Hotkey"
                        });
                        Lib.storageListen([ Lib.$domain ], call => {
                            if (call.far && call.key === Lib.$domain) {
                                Object.entries(call.nv).forEach(([ type, value ]) => {
                                    Share.SetControl(type, value);
                                });
                            }
                        });
                    }
                }
            } catch (error) {
                Lib.log(error, {
                    group: Transl("增強錯誤"),
                    collapsed: false
                }).error;
            }
        }
        function trigger(media) {
            try {
                if (!updated) {
                    updated = true;
                    updateParame();
                }
                booster(media);
            } catch (error) {
                Lib.log(error, {
                    group: "Trigger Error : ",
                    collapsed: false
                }).error;
            }
        }
        return {
            trigger: trigger
        };
    })();
    const CreateMenu = () => {
        const icon = GM_getResourceURL("Icon");
        return () => {
            const shadowID = "Booster_Menu";
            if (Lib.$q(`#${shadowID}`)) return;
            const shadow = Lib.createElement(Lib.body, "div", {
                id: shadowID
            });
            const shadowRoot = shadow.attachShadow({
                mode: "open"
            });
            const style = `
            <style>
                :host {
                    --primary-color: #3a7bfd;
                    --secondary-color: #00d4ff;
                    --text-color: #ffffff;
                    --slider-track: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    --background-dark: #1a1f2c;
                    --background-panel: #252b3a;
                    --highlight-color: #00e5ff;
                    --border-radius: 12px;
                    --hover-bg: rgba(0, 229, 255, 0.06);
                    --hover-border: rgba(0, 229, 255, 0.15);
                }
                ${shadowID} {
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    z-index: 999999;
                    overflow: auto;
                    position: fixed;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                    transition: opacity 0.4s ease;
                    background-color: rgba(0, 0, 0, 0.4);
                }
                ${shadowID}.close {
                    animation: fadeOut 0.4s ease forwards;
                }
                .Booster-Modal-Content {
                    min-width: 420px;
                    max-width: 460px;
                    width: 100%;
                    padding: 20px;
                    padding-inline-end: 10px;
                    overflow-y: auto;
                    scrollbar-gutter: stable;
                    text-align: center;
                    border-radius: var(--border-radius);
                    background-color: var(--background-dark);
                    border: 1px solid rgba(78, 164, 255, 0.3);
                    box-shadow:
                        inset -6px 0 10px -8px rgba(0, 0, 0, 0.5),
                        0 10px 30px rgba(0, 0, 0, 0.5),
                        0 0 15px rgba(0, 212, 255, 0.2);
                    color: var(--text-color);
                    max-height: 85vh;
                    transition: all 0.5s ease;
                }
                .Booster-Modal-Content.close {
                    animation: shrinkFadeOut 0.8s ease forwards;
                }
                .Booster-Modal-Content::-webkit-scrollbar {
                    width: 8px;
                }
                .Booster-Modal-Content::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                }
                .Booster-Modal-Content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                .Booster-Title {
                    margin-top: 0;
                    color: var(--secondary-color);
                    font-size: 22px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
                    transform: translateY(-10px);
                }
                .Booster-Multiplier {
                    margin: 1.5rem 0;
                    font-size: 22px;
                    font-weight: 500;
                }
                .Booster-Multiplier img {
                    width: 24px;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                .Booster-Multiplier span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #Booster-CurrentValue {
                    color: var(--highlight-color);
                    font-weight: 700;
                    margin: 0 5px;
                    font-size: 26px;
                }
                .Booster-Slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 90%;
                    height: 6px;
                    cursor: pointer;
                    margin: 2rem 0 2.5vh 0;
                    background: var(--slider-track);
                    border-radius: 3px;
                    outline: none;
                }
                .Booster-Slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--secondary-color);
                    cursor: pointer;
                    box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
                }
                .Booster-Slider::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--secondary-color);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
                }
                .Booster-Slider::-moz-range-progress {
                    background: var(--slider-track);
                    border-radius: 3px;
                    height: 6px;
                }
                .Booster-Buttons {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                    gap: 10px;
                }
                .Booster-Modal-Button {
                    color: var(--text-color);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    padding: 8px 16px;
                    border-radius: 6px;
                    background-color: rgba(58, 123, 253, 0.2);
                    border: 1px solid rgba(78, 164, 255, 0.3);
                    transition: all 0.2s ease;
                    outline: none;
                }
                .Booster-Modal-Button:hover {
                    background-color: rgba(58, 123, 253, 0.4);
                    box-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
                    transform: translateY(-2px);
                }
                #Booster-Sound-Save {
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    border: none;
                    position: relative;
                    overflow: hidden;
                }
                #Booster-Sound-Save:hover {
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
                }
                #Booster-Sound-Save:after {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -60%;
                    width: 20%;
                    height: 200%;
                    transform: rotate(30deg);
                    background: rgba(255, 255, 255, 0.13);
                    background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0.13) 0%,
                        rgba(255, 255, 255, 0.13) 77%,
                        rgba(255, 255, 255, 0.5) 92%,
                        rgba(255, 255, 255, 0.0) 100%
                    );
                }
                #Booster-Sound-Save:hover:after {
                    opacity: 1;
                    left: 130%;
                    transition: left 0.7s ease, opacity 0.5s ease;
                }
                .Booster-Accordion {
                    background-color: var(--background-panel);
                    color: var(--text-color);
                    cursor: pointer;
                    padding: 12px 15px;
                    width: 100%;
                    text-align: left;
                    border: none;
                    outline: none;
                    transition: 0.3s;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transform: translateY(10px);
                }
                .Booster-Accordion:after {
                    content: '+';
                    color: var(--secondary-color);
                    font-weight: bold;
                    float: right;
                    margin-left: 5px;
                }
                .Booster-Accordion.active {
                    border-bottom-left-radius: 0;
                    border-bottom-right-radius: 0;
                    margin-bottom: 0;
                }
                .Booster-Accordion.active:after {
                    content: "-";
                }
                .Booster-Panel {
                    max-height: 0;
                    overflow: hidden;
                    padding: 0 15px;
                    margin-top: 0;
                    margin-bottom: 8px;
                    transition: max-height 0.3s ease-out;
                    background-color: var(--background-panel);
                    border-radius: 0 0 8px 8px;
                }
                .Booster-Panel.active {
                    margin-bottom: 15px;
                    padding: 10px 15px 15px;
                }
                .Booster-Control-Group {
                    margin-bottom: 15px;
                }
                .Booster-Control-Label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                }
                .Booster-Mini-Slider {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 4px;
                    background: var(--slider-track);
                    border-radius: 2px;
                    outline: none;
                }
                .Booster-Mini-Slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--secondary-color);
                    cursor: pointer;
                }
                .Booster-Mini-Slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--secondary-color);
                    cursor: pointer;
                    border: none;
                }
                .Booster-Mini-Slider::-moz-range-progress {
                    background: var(--slider-track);
                    border-radius: 2px;
                    height: 4px;
                }
                .Booster-Label {
                    padding: 0.1rem 0.2rem;
                    font-size: larger;
                    font-weight: bolder;
                    cursor: pointer;
                    border-radius: 6px;
                    min-width: 50px;
                    text-align: center;
                    color: var(--highlight-color);
                    transition: background-color 0.2s;
                }
                .Booster-Label:hover {
                    background-color: var(--hover-bg);
                    border-color: var(--hover-border);
                    box-shadow: 0 0 0.5rem rgba(0, 229, 255, 0.12);
                    transform: translateY(-1px);
                }
                .Booster-Label-Input {
                    width: 60px;
                    padding: 2px 5px;
                    font-size: 18px;
                    font-weight: bolder;
                    color: var(--text-color);
                    background-color: var(--background-panel);
                    border: 1px solid var(--primary-color);
                    border-radius: 4px;
                    text-align: center;
                    outline: none;
                }
                @keyframes fadeOut {
                    from {opacity: 1;}
                    to {opacity: 0; pointer-events: none;}
                }
                @keyframes shrinkFadeOut {
                    from {transform: scale(1); opacity: 1;}
                    to {transform: scale(0.5); opacity: 0;}
                }
            </style>
        `;
            const generateOtherTemplate = (label, groups) => `
            <button class="Booster-Accordion">${Transl(label)}</button>
            <div class="Booster-Panel">
                ${groups.map(group => `
                    <div class="Booster-Control-Group">
                        <div class="Booster-Control-Label">
                            <span>${Transl(group.label)}</span>
                            <span id="${group.id}-Label" class="Booster-Label">${Share.Parame[group.id]}</span>
                        </div>
                        <input type="range" id="${group.id}" class="Booster-Mini-Slider" min="${group.min}" max="${group.max}" value="${Share.Parame[group.id]}" step="${group.step}">
                    </div>
                `).join("")}
            </div>
        `;
            shadowRoot.$safeiHtml(`
            ${style}
            <${shadowID} id="Booster-Modal-Menu">
                <div class="Booster-Modal-Content">
                    <h2 class="Booster-Title">${Transl("音量增強器")}</h2>
                    <div class="Booster-Multiplier">
                        <span>
                            <img src="${icon}">${Transl("增強倍數 ")}
                            <span id="Gain-Label" class="Booster-Label">${Share.Parame.Gain}</span>${Transl(" 倍")}
                        </span>
                        <input type="range" id="Gain" class="Booster-Slider" min="0" max="20.0" value="${Share.Parame.Gain}" step="0.1">
                    </div>
            ${generateOtherTemplate("低頻設定", [ {
                label: "增益",
                id: "LowFilterGain",
                min: "-12",
                max: "12",
                step: "0.1"
            }, {
                label: "頻率",
                id: "LowFilterFreq",
                min: "20",
                max: "1000",
                step: "20"
            } ])}
            ${generateOtherTemplate("中頻設定", [ {
                label: "增益",
                id: "MidFilterGain",
                min: "-12",
                max: "12",
                step: "0.1"
            }, {
                label: "頻率",
                id: "MidFilterFreq",
                min: "200",
                max: "8000",
                step: "100"
            }, {
                label: "Q值",
                id: "MidFilterQ",
                min: "0.5",
                max: "5",
                step: "0.1"
            } ])}
            ${generateOtherTemplate("高頻設定", [ {
                label: "增益",
                id: "HighFilterGain",
                min: "-12",
                max: "12",
                step: "0.1"
            }, {
                label: "頻率",
                id: "HighFilterFreq",
                min: "2000",
                max: "22000",
                step: "500"
            } ])}
            ${generateOtherTemplate("動態壓縮", [ {
                label: "壓縮率",
                id: "CompressorRatio",
                min: "1",
                max: "30",
                step: "0.1"
            }, {
                label: "過渡反應",
                id: "CompressorKnee",
                min: "0",
                max: "40",
                step: "1"
            }, {
                label: "閾值",
                id: "CompressorThreshold",
                min: "-60",
                max: "0",
                step: "1"
            }, {
                label: "起音速度",
                id: "CompressorAttack",
                min: "0.001",
                max: "0.5",
                step: "0.001"
            }, {
                label: "釋放速度",
                id: "CompressorRelease",
                min: "0.01",
                max: "2",
                step: "0.01"
            } ])}
                    <div class="Booster-Buttons">
                        <button class="Booster-Modal-Button" id="Booster-Menu-Close">${Transl("關閉")}</button>
                        <button class="Booster-Modal-Button" id="Booster-Sound-Save">${Transl("保存")}</button>
                    </div>
                </div>
            </${shadowID}>
        `);
            const shadowGate = shadow.shadowRoot;
            const modal = shadowGate.querySelector(shadowID);
            const content = shadowGate.querySelector(".Booster-Modal-Content");
            function deleteMenu() {
                modal.classList.add("close");
                content.classList.add("close");
                setTimeout(() => {
                    shadow.remove();
                }, 800);
            }
            const displayMap = {
                ...Object.fromEntries([ ...shadowGate.querySelectorAll(".Booster-Label") ].map(el => [ el.id, el ]))
            };
            function updateControl(id, value) {
                displayMap[`${id}-Label`].textContent = value;
                shadowGate.querySelector(`#${id}`).value = value;
                Share.SetControl(id, value);
            }
            content.addEventListener("input", event => {
                const target = event.target;
                if (target.type !== "range") return;
                const id = target.id;
                const value = parseFloat(target.value);
                updateControl(id, value);
            });
            content.addEventListener("click", event => {
                const target = event.target;
                if (!target.classList.contains("Booster-Label") || target.isEditing) return;
                target.isEditing = true;
                const originalValue = target.textContent.trim();
                const controlId = target.id.replace("-Label", "");
                const slider = shadowGate.querySelector(`#${controlId}`);
                target.textContent = "";
                const input = Lib.createElement(target, "input", {
                    class: "Booster-Label-Input",
                    value: originalValue,
                    on: {
                        blur: {
                            listen: () => {
                                let newValue = parseFloat(input.value);
                                const min = parseFloat(slider.min);
                                const max = parseFloat(slider.max);
                                if (isNaN(newValue)) {
                                    newValue = parseFloat(originalValue);
                                } else if (newValue < min) {
                                    newValue = min;
                                } else if (newValue > max) {
                                    newValue = max;
                                }
                                target.isEditing = false;
                                updateControl(controlId, newValue);
                                target.textContent = newValue;
                            },
                            add: {
                                once: true
                            }
                        },
                        keydown: e => {
                            if (e.key === "Enter") e.target.blur();
                            if (e.key === "Escape") {
                                e.target.value = originalValue;
                                e.target.blur();
                            }
                        }
                    }
                });
                requestAnimationFrame(() => input.focus());
            });
            modal.addEventListener("click", click => {
                const target = click.target;
                click.stopPropagation();
                if (target.classList.contains("Booster-Accordion")) {
                    target.classList.toggle("active");
                    const panel = target.nextElementSibling;
                    if (panel.style.maxHeight) {
                        panel.style.maxHeight = null;
                        panel.classList.remove("active");
                    } else {
                        panel.style.maxHeight = panel.scrollHeight + "px";
                        panel.classList.add("active");
                    }
                } else if (target.id === "Booster-Sound-Save") {
                    Lib.setV(Lib.$domain, Share.Parame);
                    deleteMenu();
                } else if (target.id === "Booster-Menu-Close" || target.id === "Booster-Modal-Menu") {
                    deleteMenu();
                }
            });
        };
    };
    function Main() {
        bannedDomains.isEnabled(status => {
            const regMenu = async name => {
                Lib.regMenu({
                    [name]: () => bannedDomains.addBanned()
                });
            };
            if (status) {
                Share.Menu = CreateMenu();
                Share.SetControl = (type, value) => {
                    Share.Parame[type] = value;
                    Share.EnhancedNodes.forEach(items => {
                        items[type].value = value;
                    });
                };
                const findMedia = () => {
                    const tree = document.createTreeWalker(Lib.body, NodeFilter.SHOW_ELEMENT, {
                        acceptNode: node => {
                            const tag = node.tagName;
                            if (tag === "VIDEO" || tag === "AUDIO") {
                                if (!Share.ProcessedElements.has(node)) return NodeFilter.FILTER_ACCEPT;
                            }
                            return NodeFilter.FILTER_SKIP;
                        }
                    });
                    const media = [];
                    while (tree.nextNode()) {
                        media.push(tree.currentNode);
                    }
                    if (media.length > 0) {
                        Share.ProcessLock = true;
                        Booster.trigger(media);
                    }
                };
                Lib.observer(Lib.body, mutationsList => {
                    if (Share.ProcessLock) return;
                    if (mutationsList.some(m => m.type === "childList")) findMedia();
                }, {
                    mark: "Media-Booster",
                    attributes: false,
                    throttle: 1300
                }, ({
                    ob
                }) => {
                    regMenu(Transl("❌ 禁用網域"));
                });
            } else regMenu(Transl("✅ 啟用網域"));
        });
    }
    Main();
})();