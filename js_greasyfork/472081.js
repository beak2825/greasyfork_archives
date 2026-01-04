// ==UserScript==
// @name         YouTube Hide Tool
// @name:zh-TW   YouTube 隱藏工具
// @name:zh-CN   YouTube 隐藏工具
// @name:ja      YouTube 非表示ツール
// @name:ko      유튜브 숨기기 도구
// @name:en      Youtube Hide Tool
// @version      2025.10.22
// @author       Canaan HS
// @description         該腳本能夠自動隱藏 YouTube 影片結尾的推薦卡，當滑鼠懸浮於影片上方時，推薦卡會恢復顯示。並額外提供快捷鍵切換功能，可隱藏留言區、影片推薦、功能列表，及切換至極簡模式。設置會自動保存，並在下次開啟影片時自動套用。
// @description:zh-TW   該腳本能夠自動隱藏 YouTube 影片結尾的推薦卡，當滑鼠懸浮於影片上方時，推薦卡會恢復顯示。並額外提供快捷鍵切換功能，可隱藏留言區、影片推薦、功能列表，及切換至極簡模式。設置會自動保存，並在下次開啟影片時自動套用。
// @description:zh-CN   该脚本能够自动隐藏 YouTube 视频结尾的推荐卡，在鼠标悬停于视频上方时，推荐卡会恢复显示。并额外提供快捷键切换功能，可隐藏评论区、视频推荐、功能列表，并切换至极简模式。设置会自动保存，并在下次打开视频时自动应用。
// @description:ja      このスクリプトは、YouTube动画の终わりに表示される推奨カードを自动的に非表示にし、マウスがビデオ上にホバーされると、推奨カードが再表示されます。さらに、ショートカットキーでコメントセクション、动画の推奨、机能リストを非表示に切り替える机能が追加されており、シンプルモードに切り替えることもできます。设定は自动的に保存され、次回ビデオを开くと自动的に适用されます。
// @description:ko      이 스크립트는 YouTube 동영상 끝에 나오는 추천 카드를 자동으로 숨기고, 마우스가 비디오 위에 머무를 때 추천 카드가 다시 나타납니다. 또한, 댓글 섹션, 비디오 추천, 기능 목록을 숨기고 최소 모드로 전환하는 단축키를 제공합니다. 설정은 자동으로 저장되며, 다음 비디오를 열 때 자동으로 적용됩니다.
// @description:en      This script automatically hides the recommended cards at the end of YouTube videos. When the mouse hovers over the video, the recommended cards will reappear. Additionally, it provides shortcut keys to toggle the comment section, video recommendations, feature list, and switch to a minimalist mode. Settings are automatically saved and applied the next time the video is opened.

// @noframes
// @match        *://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/1383/1383260.png

// @license      MPL-2.0
// @namespace    https://greasyfork.org/users/989635
// @supportURL   https://github.com/Canaan-HS/MonkeyScript/issues

// @require      https://update.greasyfork.org/scripts/487608/1677884/SyntaxLite_min.js

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener

// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472081/YouTube%20Hide%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/472081/YouTube%20Hide%20Tool.meta.js
// ==/UserScript==

(function() {
    const Config = {
        Dev: false,
        GlobalChange: true,
        HotKey: {
            Adapt: k => k.key.toLowerCase(),
            Title: k => k.altKey && Config.HotKey.Adapt(k) == "t",
            MinimaList: k => k.ctrlKey && Config.HotKey.Adapt(k) == "z",
            RecomViewing: k => k.altKey && Config.HotKey.Adapt(k) == "1",
            Comment: k => k.altKey && Config.HotKey.Adapt(k) == "2",
            FunctionBar: k => k.altKey && Config.HotKey.Adapt(k) == "3"
        }
    };
    const Match = {
        Live: /^(https?:\/\/)www\.youtube\.com\/live\/.*$/,
        Video: /^(https?:\/\/)www\.youtube\.com\/watch\?v=.+$/
    };
    const Param = {
        Token: false,
        StartTime: void 0
    };
    const Tools = (() => {
        const pageType = url => Match.Video.test(url) ? "Video" : Match.Live.test(url) ? "Live" : "NotSupport";
        const titleFormat = title => title.$text().replace(/^\s+|\s+$/g, "");
        const devPrint = (group, ...content) => {
            Lib.log(...content, {
                dev: Config.Dev,
                group: group,
                collapsed: false
            });
        };
        const devTimePrint = (group, state) => {
            devPrint(group, Lib.runTime(Param.StartTime, {
                log: false
            }), state);
        };
        const hideJudgment = async (element, setKey = null) => {
            if (element.style.display == "none" || Param.Token) {
                element.style.display = "block";
                setKey && Lib.setV(setKey, false);
            } else {
                element.style.display = "none";
                setKey && Lib.setV(setKey, true);
            }
        };
        const styleTransform = async (list, type, style) => {
            list.forEach(element => {
                element.style[type] = style;
            });
            if (Config.Dev) {
                return new Promise(resolve => {
                    resolve(list.every(element => element.style[type] == style));
                });
            }
        };
        const titleOp = {
            childList: true,
            subtree: false
        };
        const titleOb = new MutationObserver(() => {
            Lib.title() != "..." && Lib.title("...");
        });
        return {
            pageType: pageType,
            titleFormat: titleFormat,
            devPrint: devPrint,
            devTimePrint: devTimePrint,
            hideJudgment: hideJudgment,
            styleTransform: styleTransform,
            titleOp: titleOp,
            titleOb: titleOb
        };
    })();
    const dict = {
        Traditional: {
            "快捷提示": `@ 功能失效時 [請重新整理] =>
                    \r(Alt + 1)：隱藏推薦播放
                    \r(Alt + 2)：隱藏留言區
                    \r(Alt + 3)：隱藏功能列表
                    \r(Alt + T)：隱藏標題文字
                    \r(Ctrl + Z)：使用極簡化`
        },
        Simplified: {
            "📜 預設熱鍵": "📜 预设热键",
            "快捷提示": `@ 功能失效时 [请重新整理] =>
                    \r(Alt + 1)：隐藏推荐播放
                    \r(Alt + 2)：隐藏评论区
                    \r(Alt + 3)：隐藏功能列表
                    \r(Alt + T)：隐藏标题文字
                    \r(Ctrl + Z)：使用极简化`,
            "查找框架失敗": "查找框架失败",
            "頁面類型": "页面类型",
            "隱藏元素": "隐藏元素",
            "極簡化": "极简化",
            "隱藏標題": "隐藏标题",
            "隱藏推薦觀看": "隐藏推荐观看",
            "隱藏留言區": "隐藏留言区",
            "隱藏功能選項": "隐藏功能选项",
            "隱藏播放清單資訊": "隐藏播放清单信息"
        },
        Japan: {
            "📜 預設熱鍵": "📜 デフォルトホットキー",
            "快捷提示": `@ 机能が无効になった场合 [ページを更新してください] =>
                    \r(Alt + 1)：おすすめ再生を非表示にする
                    \r(Alt + 2)：コメントエリアを非表示にする
                    \r(Alt + 3)：机能リストを非表示にする
                    \r(Alt + T)：タイトル文字を隠す
                    \r(Ctrl + Z)：シンプル化を使用する`,
            "查找框架失敗": "フレームの検索に失敗しました",
            "頁面類型": "ページタイプ",
            "隱藏元素": "要素を隠す",
            "極簡化": "ミニマリスト",
            "隱藏標題": "タイトルを隠す",
            "隱藏推薦觀看": "おすすめ視聴を隠す",
            "隱藏留言區": "コメントセクションを隠す",
            "隱藏功能選項": "機能オプションを隠す",
            "隱藏播放清單資訊": "再生リスト情報を隠す"
        },
        Korea: {
            "📜 預設熱鍵": "📜 기본 단축키",
            "快捷提示": `@ 기능이 작동하지 않을 때 [새로 고침하세요] =>
                    \r(Alt + 1)：추천 재생 숨기기
                    \r(Alt + 2)：댓글 영역 숨기기
                    \r(Alt + 3)：기능 목록 숨기기
                    \r(Alt + T)：제목 텍스트 숨기기
                    \r(Ctrl + Z)：간소화 사용`,
            "查找框架失敗": "프레임 검색 실패",
            "頁面類型": "페이지 유형",
            "隱藏元素": "요소 숨기기",
            "極簡化": "극단적 단순화",
            "隱藏標題": "제목 숨기기",
            "隱藏推薦觀看": "추천 시청 숨기기",
            "隱藏留言區": "댓글 섹션 숨기기",
            "隱藏功能選項": "기능 옵션 숨기기",
            "隱藏播放清單資訊": "재생 목록 정보 숨기기"
        },
        English: {
            "📜 預設熱鍵": "📜 Default Hotkeys",
            "快捷提示": `@ If functionalities fail [Please refresh] =>
                    \r(Alt + 1)：Hide recommended playback
                    \r(Alt + 2)：Hide comments section
                    \r(Alt + 3)：Hide feature list
                    \r(Alt + 4)：Hide playlist info
                    \r(Alt + T)：Hide Title Text
                    \r(Ctrl + Z)：Use Simplification`,
            "查找框架失敗": "Frame search failed",
            "頁面類型": "Page type",
            "隱藏元素": "Hide elements",
            "極簡化": "Minimalize",
            "隱藏標題": "Hide title",
            "隱藏推薦觀看": "Hide recommended views",
            "隱藏留言區": "Hide comments section",
            "隱藏功能選項": "Hide feature options",
            "隱藏播放清單資訊": "Hide playlist information"
        }
    };
    const {
        Transl
    } = (() => {
        const Matcher = Lib.translMatcher(dict);
        return {
            Transl: Str => Matcher[Str] ?? Str
        };
    })();
    function Main() {
        const hotKey = Config.HotKey;
        const injecRecord = new Set();
        async function core(url) {
            const pageType = Tools.pageType(url);
            Tools.devPrint(Transl("頁面類型"), pageType, url);
            if (pageType === "NotSupport" || injecRecord.has(url)) return;
            Lib.waitEl("#columns, #contents", null, {
                raf: true,
                timeoutResult: true
            }).then(trigger => {
                if (!trigger) {
                    Lib.log(Transl("查找框架失敗")).error;
                    return;
                }
                Config.Dev && (Param.StartTime = Lib.runTime());
                Lib.regMenu({
                    [Transl("📜 預設熱鍵")]: () => {
                        alert(Transl("快捷提示"));
                    }
                });
                Lib.addStyle(`
                .ytp-ce-element {
                    display: none;
                }
                .ytp-endscreen-content {
                    display: none;
                }
                .ytp-fullscreen-grid {
                    display: none;
                }
                #movie_player:not(.ytp-fullscreen):hover .ytp-ce-element,
                #movie_player:not(.ytp-fullscreen):hover .ytp-endscreen-content {
                    display: block;
                }
                #movie_player:not(.ytp-fullscreen):hover .ytp-fullscreen-grid {
                    display: block;
                }
                .ytp-show-tiles .ytp-videowall-still {
                    cursor: pointer;
                }
                body {
                    overflow-x: hidden !important;
                }
            `, "Youtube-Hide-Tool", false);
                Lib.waitEl([ "title", "#title h1", "#end", "#below", "#secondary.style-scope.ytd-watch-flexy", "#secondary-inner", "#related", "#comments", "#actions" ], null, {
                    throttle: 80,
                    characterData: true,
                    timeoutResult: true
                }).then(found => {
                    Tools.devPrint(Transl("隱藏元素"), found);
                    const [ title, h1, end, below, secondary, inner, related, comments, actions ] = found;
                    if (Lib.getV("Minimalist")) {
                        Tools.titleOb.observe(title, Tools.titleOp);
                        Tools.styleTransform([ document.body ], "overflow", "hidden");
                        Tools.styleTransform([ h1, end, below, secondary, related ], "display", "none").then(state => Tools.devTimePrint(Transl("極簡化"), state));
                        Lib.title("...");
                    } else {
                        if (Lib.getV("Title")) {
                            Tools.titleOb.observe(title, Tools.titleOp);
                            Tools.styleTransform([ h1 ], "display", "none").then(state => Tools.devTimePrint(Transl("隱藏標題"), state));
                            Lib.title("...");
                        }
                        if (Lib.getV("RecomViewing")) {
                            Tools.styleTransform([ secondary, related ], "display", "none").then(state => Tools.devTimePrint(Transl("隱藏推薦觀看"), state));
                        }
                        if (Lib.getV("Comment")) {
                            Tools.styleTransform([ comments ], "display", "none").then(state => Tools.devTimePrint(Transl("隱藏留言區"), state));
                        }
                        if (Lib.getV("FunctionBar")) {
                            Tools.styleTransform([ actions ], "display", "none").then(state => Tools.devTimePrint(Transl("隱藏功能選項"), state));
                        }
                    }
                    const modify = {
                        Title: (mode, save = "Title") => {
                            mode = save ? mode : !mode;
                            Lib.title(mode ? (Tools.titleOb.disconnect(), Tools.titleFormat(h1)) : (Tools.titleOb.observe(title, Tools.titleOp), 
                            "..."));
                            Tools.hideJudgment(h1, save);
                        },
                        Minimalist: (mode, save = true) => {
                            mode = save ? mode : !mode;
                            if (mode) {
                                modify.Title(false, false);
                                save && Lib.setV("Minimalist", false);
                                Tools.styleTransform([ document.body ], "overflow", "auto");
                                Tools.styleTransform([ end, below, secondary, related ], "display", "block");
                            } else {
                                modify.Title(true, false);
                                save && Lib.setV("Minimalist", true);
                                Tools.styleTransform([ document.body ], "overflow", "hidden");
                                Tools.styleTransform([ end, below, secondary, related ], "display", "none");
                            }
                        },
                        RecomViewing: (_, save = "RecomViewing") => {
                            if (inner.childElementCount > 1) {
                                Tools.hideJudgment(secondary);
                                Tools.hideJudgment(related, save);
                                Param.Token = false;
                            } else {
                                Tools.hideJudgment(related, save);
                                Param.Token = true;
                            }
                        },
                        Comment: (_, save = "Comment") => {
                            Tools.hideJudgment(comments, save);
                        },
                        FunctionBar: (_, save = "FunctionBar") => {
                            Tools.hideJudgment(actions, save);
                        }
                    };
                    Lib.onEvent(document, "keydown", event => {
                        if (hotKey.MinimaList(event)) {
                            event.preventDefault();
                            modify.Minimalist(Lib.getV("Minimalist"));
                        } else if (hotKey.Title(event)) {
                            event.preventDefault();
                            modify.Title(Lib.title() === "...");
                        } else if (hotKey.RecomViewing(event)) {
                            event.preventDefault();
                            modify.RecomViewing();
                        } else if (hotKey.Comment(event)) {
                            event.preventDefault();
                            modify.Comment();
                        } else if (hotKey.FunctionBar(event)) {
                            event.preventDefault();
                            modify.FunctionBar();
                        }
                    }, {
                        capture: true
                    });
                    if (Config.GlobalChange) {
                        Lib.storageListen([ "Minimalist", "Title", "RecomViewing", "Comment", "FunctionBar" ], call => {
                            if (call.far) modify[call.key](call.nv, false);
                        });
                    }
                    injecRecord.add(url);
                });
            });
        }
        core(Lib.$url);
        Lib.onUrlChange(change => {
            core(change.url);
        });
    }
    Main();
})();