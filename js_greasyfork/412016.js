// ==UserScript==
// @name         Youtube live, Simple Chat Stylizer
// @name:ja      Youtube live, シンプルチャットスタイル
// @description  Display chat window on stream screen and apply custom stylesheet
// @description:ja チャットウィンドウを配信画面上に配置し、カスタムスタイルを適応する
// @namespace    http://tampermonkey.net/
// @version      1.7.15
// @author       You
// @match        https://www.youtube.com/*
// @exclude      https;//studio.youtube.com/*
// @exclude      https://accounts.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM.addStyle
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/412016/Youtube%20live%2C%20Simple%20Chat%20Stylizer.user.js
// @updateURL https://update.greasyfork.org/scripts/412016/Youtube%20live%2C%20Simple%20Chat%20Stylizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const configAreaID = "ytscs-config";
    const configKey = "simple-chat-stylizer";
    const SINGLE_WINDOW_PARAMS = "toolber=no,menubar=no,scrollbar=no,titlebar=no,location=no,directories=no,status=no,resizable=yes";
    const CHAT_CONNECTION_TIMEOUT = 60 * 1000; // 1 min
    const TAG_HIDDEN = "hidden";

    // config object
    var c = {
        backgroundColor: "#fff0",
        chatFontSize: "13px",
        isEnableChatOutline: true,
        chatOutlineColor: "#036",
        isHideAuthorName: false,
        isAuthorNameRightSide: true,
        authorNameMaxWidth: "100px",
        isHideThumbnail: false,
        isHideBadge: false,
        simpleMemberChat: true,
        isHideHeader: true,
        isHideFooter: false,
        isHideCommonEmotes: true,
        isMemberOnly: false,
        isCountHeavyUser: false,
        isReloadWhenChatClogged: false,
        isHideEmotes: false,
        isFeverEmotes: false,
        disableChatFlickers: false,
        superChatViewType: "history-header-message",
        isHideMembershipGift: true,
        isFixModerator: true,
        moderatorChatTimeout: "20",
        windowWidth: "430px",
        windowHeight: "720px",
        chatWindowPosition: "right-top",
        windowOpacity: "0.9",
        enableFilter: false,
        chatFilter: "",
        fullscreenMode: false,
        chatCountLimit: -1,
    };
    var enableFilter = false;
    var myPolicy;

    window.addEventListener("load", onLoaded);
    return;

    function onLoaded() {
        if (!window.DOMPurify || !window.trustedTypes || !window.trustedTypes.createPolicy) {
            setTimeout(onLoaded, 100);
            return;
        }

        myPolicy = window.trustedTypes.createPolicy('ytscs', {
            createHTML: (to_escape) => window.DOMPurify.sanitize(to_escape, {
                RETURN_TRUSTED_TYPE: false,
                CUSTOM_ELEMENT_HANDLING: {
                    tagNameCheck: (tagName) => true,
                    attributeNameCheck: (attr) => true,
                    allowCustomizedBuiltInElements: true,
                },
                ADD_ATTR: [ "on_", "config-key", "inverse" ],
            }),
        });

        if (location.host == "www.youtube.com") {
            // チャットウィンドウ
            if (location.pathname.indexOf("/live_chat") == 0) {
                if (window == window.parent || window.parent.location.host != "www.youtube.com") return;

                loadConfig();
                addLiveChatStyle();

                setTimeout(updateChatWindowVariables, 100);
                setTimeout(setupChatObservation, 100);

                window.addEventListener("mouseover", fixPlayerConflict);
            }
            // iframe
            else if (location.pathname.indexOf("/embed") == 0) {
                return;
            } else {
                loadConfig();
                addConfigArea();
                addFloatWindowStyle();

                document.body.style.setProperty("--ytd-masthead-height", "56px"); /* default value */

                setTimeout(updateDynamicLayout, 20);
                setTimeout(updateDynamicLayout, 3000);
                // masthead の切替をさせるためにイベントを発火する
                window.addEventListener("yt-set-theater-mode-enabled", ev => setTimeout(() => window.dispatchEvent(new Event("fullscreenchange"))), 100);
                window.addEventListener("fullscreenchange", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("yt-fullscreen-change-action", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("play", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("resize", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("yt-update-title", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("yt-window-resized", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("yt-navigate-finish", () => setTimeout(updateDynamicLayout, 100));
                window.addEventListener("scroll", ev => {
                    var html = document.querySelector("html");
                    var scrollTop = html.scrollTop || html.scrollY || window.scrollY || window.scrollTop || document.body.scrollY || document.body.scrollTop;
                    document.body.style.setProperty("--html-scroll-top", `${scrollTop}px`);
                    var app = document.querySelector("ytd-app");
                    document.body.style.setProperty("--app-scroll-top", `${app ? app.scrollTop : 0}px`);
                    updateChatWindowVariables();
                }, true);
            }
        }
    }

    /** *****************
     * Config
     * ******************/
    function addConfigArea() {
        // console.log("addConfigArea()");
        if (document.querySelector(`#${configAreaID}`)) return;

        var localize = {
            ja: {
                groupLayout: "レイアウト・表示非表示",
                groupDecoration: "テキスト装飾",
                groupAdditional: "追加機能",
                groupEmotes: "絵文字",
                groupFiltering: "チャットNG",
                configHeader: "Youbute live, シンプルチャットスタイル 設定",
                fullscreenMode: "シアターモードでフルブラウザ表示",
                backgroundColor: "背景色",
                fontSize: "文字サイズ",
                chatOutline: "文字枠を有効化する",
                chatOutlineColor: "文字枠の色",
                hideAuthorName: "チャット投稿者名を非表示にする",
                authorNameIsRight: "投稿者名を右側に表示する",
                autnorNameMaxWidth: "投稿者名の最大横幅（長すぎる場合は省略します）",
                hideThumbnail: "ユーザーアイコンを非表示にする",
                hideBadge: "メンバーバッヂを非表示にする",
                simpleMemberChat: "メンバーチャットを簡易表示にする",
                hideHeader: "ヘッダーを非表示にする",
                hideFooter: "フッターを非表示にする (チャットができなくなります)",
                hideCommonEmotes: "ピッカーにチャンネル専用絵文字のみを表示する",
                isHideEmotes: "絵文字のみのチャットを非表示にする",
                isFeverEmotes: "絵文字のみのチャットを背景に流す",
                memberOnly: "メンバーチャットのみ表示する",
                isCountHeavyUser: "チャット頻度を可視化する",
                reloadWhenChatClogged : "チャットが詰まったら更新する",
                chatCountLimit: "チャットの表示上限数",
                disableChatFlickers: "チャットのちらつきを低減する",
                superChatViewType: "スーパーチャットの表示方法",
                superChat: {
                    all: "全て表示",
                    historyMessage: "履歴 + メッセージ",
                    history: "履歴のみ",
                    headerMessage: "カードのみ",
                    message: "メッセージのみ",
                    none: "全て表示しない",
                },
                isHideMembershipGift: "メンバーシップギフトチャットを非表示にする",
                highlightModerator: "モデレーターを強調表示する（オーナーは常時）",
                highlightTimeout: "強調表示する時間 (秒)",
                windowWidth: "チャットウィンドウの横幅",
                windowHeight: "チャットウィンドウの高さ",
                chatWindowPosition: "チャットウィンドウの位置",
                position: {
                    rightTop: "右上",
                    rightBottom: "右下",
                    leftTop: "左上",
                    leftBottom: "左下",
                },
                windowOpacity: "チャットウィンドウの透明度 (0～1で指定/0は透明）",
                chatFilter: "チャットフィルタ (正規表現が使えます/一行に一項目)",
                save: "保存",
                close: "閉じる",
            },
            en: {
                groupLayout: "Layout / Visibility",
                groupDecoration: "Text Decoration",
                groupEmotes: "Emotes",
                groupAdditional: "Additional",
                groupFiltering: "Chat Filtering",
                fullscreenMode: "Full browser display in theater mode",
                configHeader: "Simple chat stylizer Config",
                backgroundColor: "Background color",
                fontSize: "Font size",
                chatOutline: "Enabled chat outline",
                chatOutlineColor: "Chat outline color",
                hideAuthorName: "Hide author name",
                authorNameIsRight: "Author name is display to right side",
                autnorNameMaxWidth: "Max width of author name（If too wide, omit the part）",
                hideThumbnail: "Hide user icon",
                hideBadge: "Hide member badge icon",
                simpleMemberChat: "Display simplify member chat",
                hideHeader: "Hide header panel",
                hideFooter: "Hide footer panel (you can't chat)",
                hideCommonEmotes: "Display channel emote only in picker",
                isHideEmotes: "Hidden if chat is emotes only",
                isFeverEmotes: "Animate on background if chat is emotes only",
                memberOnly: "Display member chat only",
                isCountHeavyUser: "Display chat frequency",
                reloadWhenChatClogged : "Reload Chat window when connection clagged",
                disableChatFlickers: "Decrement chat flickers",
                chatCountLimit: "Maximum number of chat displays",
                superChatViewType: "View type of super chat",
                superChat: {
                    all: "All",
                    historyMessage: "History + Message",
                    history: "History only",
                    headerMessage: "Card only",
                    message: "Message only",
                    none: "Not display all",
                },
                isHideMembershipGift: "Hide mebership gift announcement chat",
                highlightModerator: "Highlight moderator chat (Owner chat is always)",
                highlightTimeout: "Time period that highlight (sec)",
                windowWidth: "Width of Chat window",
                windowHeight: "Height of Chat window",
                chatWindowPosition: "Position of Chat window",
                position: {
                    rightTop: "Right Top",
                    rightBottom: "Right Bottom",
                    leftTop: "Left Top",
                    leftBottom: "Left Bottom",
                },
                windowOpacity: "Opacity of Chat window (Set value of 0 to 1 / 0 is transport)",
                chatFilter: "Chat filter (Can use regix / Input a filter each one line)",
                save: "Save",
                close: "Close",
            },
        }

        var t = localize[window.navigator.language] || localize.en;
        const config = document.querySelector(`#${configAreaID}`) || document.createElement("form");
        config.id = configAreaID;
        config.innerHTML = myPolicy.createHTML(`
<div class="group">
    <header>${t.groupLayout}</header>
    <input type="checkbox" name="isHideAuthorName" id="scs-isHideAuthorName">
    <label for="scs-isHideAuthorName">${t.hideAuthorName}</label><br />
    <input type="checkbox" name="isAuthorNameRightSide" id="scs-isAuthorNameRightSide">
    <label for="scs-isAuthorNameRightSide">${t.authorNameIsRight}</label><br />
    <input type="text" name="authorNameMaxWidth" id="scs-authorNameMaxWidth">
    <label for="scs-authorNameMaxWidht">${t.autnorNameMaxWidth}</label><br />
    <input type="checkbox" name="isHideThumbnail" id="scs-isHideThumbnail">
    <label for="scs-isHideThumbnail">${t.hideThumbnail}</label><br />
    <input type="checkbox" name="isHideBadge" id="scs-isHideBadge">
    <label for="scs-isHideBadge">${t.hideBadge}</label><br />
    <input type="checkbox" name="isHideHeader" id="scs-isHideHeader">
    <label for="scs-isHideHeader">${t.hideHeader}</label><br />
    <input type="checkbox" name="isHideFooter" id="scs-isHideFooter">
    <label for="scs-isHideFooter">${t.hideFooter}</label><br />
    <input type="checkbox" name="simpleMemberChat" id="scs-simpleMemberChat">
    <label for="scs-simpleMemberChat">${t.simpleMemberChat}</label><br />
    <label class="dummy"></label>
    <label for="scs-superChatViewType" for="scs-superChatViewType" class="for-select">${t.superChatViewType}</label>
    <select type="dropdown" name="superChatViewType" id="scs-superChatViewType" value="history-header-message">
        <option value="history-header-message">${t.superChat.all}</option>
        <option value="history-message">${t.superChat.historyMessage}</option>
        <option value="history">${t.superChat.history}</option>
        <option value="header-message">${t.superChat.headerMessage}</option>
        <option value="message">${t.superChat.message}</option>
    <option value="none">${t.superChat.none}</option>
    </select><br />
    <input type="checkbox" name="isHideMembershipGift" id="scs-isHideMembershipGift">
    <label for="scs-isHideMembershipGift">${t.isHideMembershipGift}</label><br />
    <input type="text" name="windowWidth" id="scs-windowWidth">
    <label for="scs-widowWidth">${t.windowWidth}</label><br />
    <input type="text" name="windowHeight" id="scs-windowHeight">
    <label for="scs-windowHeight">${t.windowHeight}</label><br />
    <label class="dummy"></label>
    <label for="scs-chatWindowPosition" for="scs-chatWindowPosition" class="for-select">${t.chatWindowPosition}</label>
    <select type="dropdown" name="chatWindowPosition" id="scs-chatWindowPosition" value="right-top">
    <option value="right-top">${t.position.rightTop}</option>
    <option value="right-bottom">${t.position.rightBottom}</option>
    <option value="left-top">${t.position.leftTop}</option>
    <option value="left-bottom">${t.position.leftBottom}</option>
    </select><br />
    <input type="checkbox" name="fullscreenMode" id="scs-fullscreenMode">
    <label for="scs-fullscreenMode">${t.fullscreenMode}</label><br />
</div>
<div class="group">
<header>${t.groupDecoration}</header>
    <input type="text" name="backgroundColor" id="scs-backgroundColor">
    <label for="scs-backgroundColor">${t.backgroundColor} <a href="https://developer.mozilla.org/ja/docs/Web/CSS/color" target="blank">*</a></label><br />
    <input type="text" name="chatFontSize" id="scs-chatFontSize">
    <label for="scs-chatFontSize">${t.fontSize}</label><br />
    <input type="checkbox" name="isEnableChatOutline" id="scs-isEnableChatOutline">
    <label for="scs-isEnableChatOutline">${t.chatOutline}</label><br />
    <input type="text" name="chatOutlineColor" id="scs-chatOutlineColor">
    <label for="scs-chatOutlineColor">${t.chatOutlineColor} <a href="https://developer.mozilla.org/ja/docs/Web/CSS/color" target="blank">*</a></label><br />
    <input type="text" name="windowOpacity" id="scs-windowOpacity">
    <label for="scs-windowOpacity">${t.windowOpacity}</label><br />
</div>
<div class="group">
    <header>${t.groupEmotes}</header>
    <input type="checkbox" name="isHideEmotes" id="scs-isHideEmotes">
    <label for="scs-isHideEmotes">${t.isHideEmotes}</label><br />
    <input type="checkbox" name="isFeverEmotes" id="scs-isFeverEmotes">
    <label for="scs-isFeverEmotes">${t.isFeverEmotes}</label><br />
    <input type="checkbox" name="isHideCommonEmotes" id="scs-isHideCommonEmotes">
    <label for="scs-isHideCommonEmotes">${t.hideCommonEmotes}</label><br />
</div>
<div class="group">
    <header>${t.groupAdditional}</header>
    <input type="checkbox" name="isFixModerator" id="scs-isFixModerator">
    <label for="scs-isFixModerator">${t.highlightModerator}</label><br />
    <input type="text" name="moderatorChatTimeout" id="scs-moderatorChatTimeout">
    <label for="scs-moderatorChatTimeout">${t.highlightTimeout}</label><br />
    <input type="checkbox" name="isCountHeavyUser" id="scs-isCountHeavyUser">
    <label for="scs-isCountHeavyUser">${t.isCountHeavyUser}</label><br />
    <input type="checkbox" name="isReloadWhenChatClogged" id="scs-isReloadWhenChatClogged">
    <label for="scs-isReloadWhenChatClogged">${t.reloadWhenChatClogged}</label><br />
    <input type="text" name="chatCountLimit" id="scs-chatCountLimit">
    <label for="scs-chatCountLimit">${t.chatCountLimit}</label><br />
</div>
<div class="group">
    <header>${t.groupFiltering}</header>
    <input type="checkbox" name="isMemberOnly" id="scs-isMemberOnly">
    <label for="scs-isMemberOnly">${t.memberOnly}</label><br />
    <input type="checkbox" name="disableChatFlickers" id="scs-disableChatFlickers">
    <label for="scs-disableChatFlickers">${t.disableChatFlickers}</label><br />
    <input type="checkbox" name="enableFilter" id="scs-enableFilter">
    <label for="scs-enableFilter">${t.chatFilter}</label><br />
    <textarea name="chatFilter" value="" id="scs-chatFilter"></textarea>
</div>

<button id="${configAreaID}-save">${t.save}</button>
<button id="${configAreaID}-close">${t.close}</button>
        `);

        // フォームの値を設定から復元する
        var $params = config.querySelectorAll(`#${configAreaID} input, #${configAreaID} select, #${configAreaID} textarea`);
        for (var i = 0; i < $params.length; i++) {
            var $p = $params[i];
            var value = c[$p.name];

            if (typeof value != "undefined") {
                if ($p.type == "checkbox") {
                    $p.checked = !!value;
                } else {
                    $p.value = value;
                }
            }
        }
        document.body.appendChild(config);

        config.querySelector("textarea").addEventListener("input", textareaOnInput);
        config.querySelector("textarea").addEventListener("focus", textareaOnInput);
        config.querySelector(`#${configAreaID}-save`).addEventListener("click", saveButtonOnClick);
        config.querySelector(`#${configAreaID}-close`).addEventListener("click", closeButtonOnClick);

        localize = t = null;
    }

    // 設定を読み込む
    function loadConfig() {
        Object.assign(c, JSON.parse(localStorage[configKey] || "{}"));

        document.body.setAttribute("scs_superChatViewType_history", c.superChatViewType.indexOf("history") >= 0);
        document.body.setAttribute("scs_superChatViewType_header", c.superChatViewType.indexOf("header") >= 0);
        document.body.setAttribute("scs_superChatViewType_message", c.superChatViewType.indexOf("message") >= 0);

        document.body.setAttribute("scs_leftside", c.chatWindowPosition.indexOf("left") >= 0);
        document.body.setAttribute("scs_bottomside", c.chatWindowPosition.indexOf("bottom") >= 0);
        document.body.setAttribute("scs_opneConfig", false);

        enableFilter = c.enableFilter;
        c.chatCountLimitEnabled = parseInt(c.chatCountLimit) != NaN && c.chatCountLimit > 3;

        for (var key in c) {
            var value = c[key];

            // 正規表現とか長文入ってるからいらない
            if (key == "chatFilter") continue;

            // pxないと効かないのでなかったらつける
            if (key.indexOf("Width") >= 0 || key.indexOf("Height") >= 0) {
                value = appendUnit(String(value || ""));
            }

            // Booleanとそれ以外で属性の付加先を変える
            if (value === true || value === false) {
                document.body.setAttribute("scs_" + key, value);
            } else {
                document.body.style.setProperty("--scs-" + key, c[key]);
            }
        }

        // console.log("loaded config", c);
    }

    // フォームの設定を保存する
    function updateConfigFromForm() {
        var $params = document.querySelectorAll(`#${configAreaID} input, #${configAreaID} select, #${configAreaID} textarea`);
        for (var i = 0; i < $params.length; i++) {
            var $p = $params[i];
            var value = c[$p.name];

            if ($p.type == "checkbox") {
                c[$p.name] = $p.checked;
            } else {
                c[$p.name] = $p.value;
            }
        }

        localStorage[configKey] = JSON.stringify(c);

        // console.log("updated config", c);
    }

    function saveButtonOnClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        updateConfigFromForm();
        loadConfig();

        document.querySelector("#chatframe").contentWindow.location.reload();

        return false;
    }

    function closeButtonOnClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        instantToggleConfig("scs_openConfig");
    }

    function textareaOnInput() {
        this.style.height = "1px";
        this.style.height = (this.scrollHeight) + "px";
    }

    /** *****************
     * Chat Filtering
     * ******************/
    // コメント監視を開始
    function setupChatObservation() {
        var lastPostedTime = new Date().getTime();
        const filterRegex = new RegExp(c.chatFilter.split(/[\r\n]+/)
                                       .map(x => (x || "").trim("\n").trim("\r").trim())
                                       .filter(x => x != "")
                                       .map(x => "(" + x + ")").join("|"), "i"),
              users = {};

        var emoteCount = 0;
        const emoteCountLimit = 200;
        const undefined = void 0;

        const scroller = document.querySelector("#item-scroller.yt-live-chat-item-list-renderer");
        const observer = new MutationObserver((mutations) => {
            var chatWindowHeight;
            if (c.isFeverEmotes) {
                chatWindowHeight = scroller.offsetHeight;
            }

            mutations.forEach((mutation) => {
                if (mutation && !mutation.addedNodes) return;

                mutation.addedNodes.forEach(($chat) => {
                    // console.log(chat);
                    if ($chat.nodeName != "YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER") return;

                    const $message = $chat.querySelector("#message");
                    if ($message == undefined) return;

                    // コメント回数を集計する
                    if (c.isCountHeavyUser) {
                        var authorName = $chat.querySelector("#author-name").__shady_native_textContent;
                        var data = users[authorName];
                        if (!data) {
                            data = users[authorName] = { count: 0 };
                        }

                        if (c.isCountHeavyUser) {
                            data.count++;
                            $chat.style.setProperty("--heavy-user", data.count + "%");
                        }
                    }

                    // Highlisth Chat for owner and moderator
                    const author = $chat.getAttribute("author-type");
                    if (author == "owner" || (c.isFixModerator && author == "moderator")) {
                        highlightChat($chat);
                    }

                    // console.log(msg.innerText);
                    // チャットフィルタ
                    var message = $message.innerText.trim();
                    if (message.length == 0) {
                        if (c.isHideEmotes) {
                            $chat.toggleAttribute(TAG_HIDDEN, true);
                            $message.innerText = "";
                        } else if (c.isFeverEmotes && author != "owner" && author != "moderator") {
                            $chat.toggleAttribute(TAG_HIDDEN, true);

                            if (emoteCount < emoteCountLimit) {
                                var $emotes = $message.querySelectorAll(".emoji");
                                $emotes.forEach(e => {
                                    var startY = Math.random() * chatWindowHeight * 0.25;
                                    e.style.setProperty("--fever-height", `-${chatWindowHeight - startY}px`);
                                    e.style.setProperty("--fever-width", `${40 + Math.random() * 30}px`);
                                    e.setAttribute("fever", "");
                                    e.setAttribute(`fever${Math.floor(Math.random() * 5) + 1}`, "");
                                    e.style.left = (5 + Math.random() * 90) + "%";
                                    e.style.bottom = startY + "px";

                                    scroller.appendChild(e);
                                });
                                emoteCount += $emotes.length;

                                setTimeout(() => {
                                    $emotes.forEach(e => e.remove());
                                    emoteCount -= $emotes.length;
                                }, 4000);
                            }
                        }
                    } else if (enableFilter && message.match(filterRegex)) {
                        $chat.toggleAttribute(TAG_HIDDEN, true);
                        $message.innerText = "";
                    } else {
                        // チャット要素は使いまわされてる
                        $chat.toggleAttribute(TAG_HIDDEN, false);
                    }
                });
                lastPostedTime = new Date().getTime();
            });
        });

        // 一定時間チャットがなければ、更新する
        setInterval(() => {
            if (!c.isReloadWhenChatClogged) return;
            var player = document.querySelector("#ytd-player");
            if ((player && player.player_ && player.player_.getPlayerState()) == 2) return;
            if (new Date().getTime() - lastPostedTime < CHAT_CONNECTION_TIMEOUT) return;

            reloadChat();
        }, 30 * 1000);

        observer.observe(document.querySelector("#items.yt-live-chat-item-list-renderer"), { childList: true });
    }

    /** *****************
     * Chat
     * ******************/
    function addLiveChatStyle() {
        // console.log("addLiveChatStyle() : ", location.href);

        const localize = {
            ja: {
                toggleLeft: "左側表示を切り替え",
                toggleBottom: "下側表示を切り替え",
                toggleFiltering: "チャットフィルタを有効",
                toggleHeader: "ヘッダーの表示を切り替え",
                toggleChat: "チャットの表示を切り替え",
                toggleFooter: "フッターを表示を切り替え",
                popup: "ポップアップ",
                reload: "更新",
                config: "設定",
                close: "閉じる",
            },
            en: {
                toggleLeft: "Toggle left position",
                toggleBottom: "Toggle bottom position",
                toggleFiltering: "Toggle chat filtering",
                toggleHeader: "Toggle header",
                toggleChat: "Toggle chat",
                toggleFooter: "Toggle footer",
                popup: "Popup Single bordered window",
                reload: "Reload",
                config: "Configration",
                close: "Close",
            }
        };

        // toggle buttons
        const t = localize[window.navigator.language] || localize.en,
              buttons = document.querySelector("#scs-chat-buttons-container") || document.createElement("div");
        buttons.id = "scs-chat-buttons-container";
        buttons.innerHTML = myPolicy.createHTML(`
<div id="chat-left-button" class="chat-toggle-button" title="${t.toggleLeft}" config-key="scs_leftside">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
<g>
	<path d="M154.52,265.848l90.964,69.014c2.329,1.766,4.674,2.702,6.78,2.702c2.148,0,4.022-0.974,5.276-2.741
		c1.199-1.688,1.807-3.99,1.807-6.844v-26.424c0-6.952,5.656-12.608,12.607-12.608h75.036c8.705,0,15.788-7.085,15.788-15.788
		v-34.313c0-8.703-7.083-15.788-15.788-15.788h-75.036c-6.951,0-12.607-5.656-12.607-12.608v-26.425
		c0-7.065-3.659-9.584-7.082-9.584c-2.106,0-4.451,0.936-6.78,2.702l-90.964,69.014c-3.416,2.59-5.297,6.087-5.297,9.849
		C149.223,259.762,151.103,263.259,154.52,265.848z"></path>
	<path d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256
		S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256
		S151.667,66.785,256,66.785z"></path>
</g>
</svg>
</div>
<div id="chat-bottom-button" class="chat-toggle-button" title="${t.toggleBottom}" config-key="scs_bottomside">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
<g>
	<path d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256
		S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256
		S151.667,66.785,256,66.785z"></path>
	<path d="M246.151,357.482c2.591,3.416,6.087,5.299,9.849,5.299c3.762,0,7.257-1.883,9.848-5.295l69.014-90.97
		c2.665-3.513,3.393-6.945,2.046-9.655c-1.347-2.713-4.518-4.208-8.93-4.208h-26.424c-6.953,0-12.609-5.652-12.609-12.604v-75.035
		c0-8.707-7.082-15.792-15.788-15.792h-34.312c-8.706,0-15.788,7.084-15.788,15.792v75.035c0,6.952-5.656,12.604-12.609,12.604
		h-26.422c-4.412,0-7.586,1.495-8.93,4.208c-1.347,2.71-0.621,6.142,2.046,9.658L246.151,357.482z"></path>
</g>
</svg>
</div>
<div id="chat-filter-button" class="chat-toggle-button" title="${t.toggleFiltering}" config-key="scs_enableFilter">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
<g>
	<polygon points="4.263,0 4.263,85.338 202.063,238.938 202.063,512 309.937,443.726 309.937,238.938 507.737,85.338
		507.737,0"></polygon>
</g>
</svg>
</div>
<div id="chat-header-button" class="chat-toggle-button" title="${t.toggleHeader}" config-key="scs_isHideHeader" inverse>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
<g>
	<circle cx="256" cy="55.091" r="55.091"></circle>
	<circle cx="256" cy="256" r="55.091"></circle>
	<circle cx="256" cy="456.909" r="55.091"></circle>
</g>
</svg>
</div>
<div id="chat-chat-button" class="chat-toggle-button" title="${t.toggleChat}" config-key="scs_isHideChat" inverse>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
<g>
	<path d="M352.705,62.572h-193.41C71.321,62.572,0,133.893,0,221.855c0,87.986,71.321,159.307,159.295,159.307h152.17
		c22.76,0,29.872,10.569,29.872,19.22c0,12.791-6.649,24.796-22.748,36.268c-9.969,7.101-2.128,12.779,5.69,12.779
		c101.678,0,187.72-110.942,187.72-227.574C512,133.893,440.691,62.572,352.705,62.572z M135.054,252.109
		c-16.722,0-30.254-13.543-30.254-30.254s13.531-30.242,30.254-30.242c16.7,0,30.232,13.531,30.232,30.242
		S151.755,252.109,135.054,252.109z M256,252.109c-16.699,0-30.254-13.543-30.254-30.254s13.555-30.242,30.254-30.242
		c16.7,0,30.254,13.531,30.254,30.242S272.7,252.109,256,252.109z M376.946,252.109c-16.699,0-30.23-13.543-30.23-30.254
		s13.531-30.242,30.23-30.242c16.723,0,30.254,13.531,30.254,30.242S393.668,252.109,376.946,252.109z"></path>
</g>
</svg>
</div>
<div id="chat-footer-button" class="chat-toggle-button" title="${t.toggleFooter}" config-key="scs_isHideFooter" inverse>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
    <g>
    <path d="M498.781,74.344c-3.531-9.313-8.906-18.234-16.125-26.297c-14.797-16.5-31.359-28.594-48.813-36.484
C416.391,3.656,398.109,0,380.031,0c-27.688,0-54.797,8.5-78.719,23.156s-44.75,35.484-59.938,60.609l-0.047,0.078L13.219,472.609
l-0.031,0.016c-3.219,5.594-5.141,11.313-5.172,17.344c0,2.719,0.422,5.5,1.391,8.172c1.438,4.016,4.219,7.766,7.906,10.234
c3.656,2.5,8,3.641,12.109,3.625c2.938,0,5.766-0.563,8.453-1.469c4.031-1.438,7.719-3.688,11.109-6.656s6.484-6.625,9.281-10.969
c0.344-0.516,0.844-1.313,1.563-2.453c5.297-8.422,21.766-34.922,36.953-59.359c14.094-22.656,27.031-43.5,28.828-46.406
c0.156-0.156,0.516-0.516,0.813-0.672l0.406-0.172c0.125-0.031,0.25-0.063,0.516-0.063c0.25,0,0.688,0.031,1.406,0.25
s1.75,0.625,3.125,1.438l0.156,0.125l0.188,0.078c9.813,5.484,19,9.438,27.672,12.016c8.656,2.594,16.797,3.828,24.375,3.828
c9.594,0.016,18.297-2,25.703-5.484c5.547-2.625,10.375-6.031,14.391-9.844c6.047-5.781,10.359-12.453,13.203-19.141
c2.828-6.719,4.281-13.422,4.313-19.906c-0.031-4.453-0.656-8.828-2.703-13.281c-1.031-2.203-2.5-4.453-4.594-6.484
c-1.844-1.781-4.266-3.281-6.938-4.188c0.219-0.641,0.703-1.219,0.938-1.391l0.094-0.063c0.047,0,0.141,0.016,0.328,0.063
c5.109,1.453,14.141,3.922,25.281,6.031c11.156,2.109,24.422,3.859,38.281,3.875c10-0.016,20.328-0.922,30.422-3.484
c10.063-2.531,19.953-6.781,28.641-13.531c7.906-6.156,14.219-13.281,18.641-21.125c4.422-7.828,6.906-16.469,6.891-25.219
c0.016-5.719-1.047-11.438-3.141-16.844c-3.156-8.156-8.609-15.563-15.875-21.734c-7.266-6.203-16.328-11.266-27.078-15.109
c-2.688-0.938-4.734-2.531-5.906-3.969c-0.594-0.719-0.953-1.406-1.141-1.859c0-0.016,0-0.016,0-0.031
c0.438-0.219,1.172-0.484,2.281-0.734c1.328-0.297,3.156-0.516,5.516-0.5c3-0.016,6.844,0.344,11.516,1.266v-0.016
c11.609,2.625,22.953,3.844,33.859,3.844c36.313,0,67.875-13.5,90.406-33.844c11.25-10.172,20.297-22.063,26.594-34.953
c6.281-12.875,9.797-26.781,9.797-40.859C503.984,93.375,502.313,83.656,498.781,74.344z"></path>
</g>
</svg>
</div>
<div id="chat-popup-button" class="chat-toggle-button" on_ title="${t.popup}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
        <g>
        <path d="M280.781,144.391l42.047,59.125c-57.813,65.688-217.281,145.766-217.281,145.766
c161.422,12.406,285.594-40.672,285.594-40.672l42.047,68.313L512,144.391H280.781z"></path>
<polygon points="296.453,393.547 296.453,418.984 68.297,418.984 68.297,93.031 364.75,93.031 364.75,24.734 0,24.734
0,487.266 364.75,487.266 364.75,418.563 349.375,393.547"></polygon>
        </g>
    </svg>
</div>
<div id="chat-reload-button" class="chat-toggle-button" on_ title="${t.reload}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
        <g>
        <path d="M446.025,92.206c-40.762-42.394-97.487-69.642-160.383-72.182c-15.791-0.638-29.114,11.648-29.752,27.433
c-0.638,15.791,11.648,29.114,27.426,29.76c47.715,1.943,90.45,22.481,121.479,54.681c30.987,32.235,49.956,75.765,49.971,124.011
c-0.015,49.481-19.977,94.011-52.383,126.474c-32.462,32.413-76.999,52.368-126.472,52.382
c-49.474-0.015-94.025-19.97-126.474-52.382c-32.405-32.463-52.368-76.992-52.382-126.474c0-3.483,0.106-6.938,0.302-10.364
l34.091,16.827c3.702,1.824,8.002,1.852,11.35,0.086c3.362-1.788,5.349-5.137,5.264-8.896l-3.362-149.834
c-0.114-4.285-2.88-8.357-7.094-10.464c-4.242-2.071-9.166-1.809-12.613,0.738L4.008,182.45c-3.05,2.221-4.498,5.831-3.86,9.577
c0.61,3.759,3.249,7.143,6.966,8.974l35.722,17.629c-1.937,12.166-3.018,24.602-3.018,37.279
c-0.014,65.102,26.475,124.31,69.153,166.944C151.607,465.525,210.8,492.013,275.91,492
c65.095,0.014,124.302-26.475,166.937-69.146c42.678-42.635,69.167-101.842,69.154-166.944
C512.014,192.446,486.844,134.565,446.025,92.206z"></path>
        </g>
    </svg>
</div>
<div id="chat-config-button" class="chat-toggle-button" on_ title="${t.config}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
        <g>
        <path d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252
c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366
c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586
c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363
c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005
c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675
c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366
c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552
l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805
c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303
c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799
c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364
c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005
c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007
c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366
c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799
c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698
c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088
C339.815,267.771,320.972,313.262,281.292,329.698z"></path>
        </g>
    </svg>
</div>
<div id="chat-toggle-button" class="chat-toggle-button" on_ title="${t.close}">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
        <g>
        <polygon points="512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465
52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005"></polygon>
        </g>
    </svg>
</div>
`);
        document.querySelector("yt-live-chat-app > #contents").appendChild(buttons);

        document.querySelector("#chat-left-button").addEventListener("click", instantToggleConfigOnClick);
        document.querySelector("#chat-bottom-button").addEventListener("click", instantToggleConfigOnClick);
        document.querySelector("#chat-header-button").addEventListener("click", instantToggleConfigOnClick);
        document.querySelector("#chat-chat-button").addEventListener("click", instantToggleConfigOnClick);
        document.querySelector("#chat-footer-button").addEventListener("click", instantToggleConfigOnClick);
        // buttons.querySelectorAll("instant-toggle").forEach(e => e.addEventListener("click", instantToggleConfigOnClick));

        document.querySelector("#chat-filter-button").addEventListener("click", filterButtonOnClick);
        document.querySelector("#chat-popup-button").addEventListener("click", popupButtonOnClick);
        document.querySelector("#chat-reload-button").addEventListener("click", () => location.reload());
        document.querySelector("#chat-config-button").addEventListener("click", () => window.parent.document.body.setAttribute("scs_openConfig", true));
        document.querySelector("#chat-toggle-button").addEventListener("click", toggleChatWindow);

        var dock = document.createElement("div");
        dock.id = "scs-docked-chats";
        document.querySelector("#item-scroller").appendChild(dock);

        var stylesheet = `
/* ========== area switch ============ */
/* hide header */
[scs_isHideHeader=true] yt-live-chat-header-renderer {
    display: none;
}
/* hide chat */
#contents { position: relative; }
[scs_isHideHeader=true] #contents #separator,
[scs_isHideChat=true] #contents #ticker,
[scs_isHideChat=true] #contents #separator,
[scs_isHideChat=true] #contents #chat.yt-live-chat-renderer {
    display: none !important; height: 0; min-height: 0;
}
/* hide footer */
[scs_isHideFooter=true] #panel-pages.yt-live-chat-renderer {
    display: none;
}
/* ========= common ========== */
#item-scroller.yt-live-chat-item-list-renderer { scrollbar-width: none; }
/* disable chat animation */
#item-scroller.yt-live-chat-item-list-renderer::-webkit-scrollbar { display: none !important; }
[scs_enableFilter=true] #item-scroller.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer
[scs_isFeverEmotes=true] #item-scroller.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer,
[scs_enableFilter=true] #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer,
[scs_isFeverEmotes=true] #item-scroller.animated.yt-live-chat-item-list-renderer #items.yt-live-chat-item-list-renderer {
    transform: translateY(0) !important;
}
/* skip button */
ytp-ad-skip-button-container {
    z-index: 9999999;
}
/* hide chat input border */
#panel-pages.yt-live-chat-renderer {
    border: 0;
}
/* hide reaction */
yt-reaction-control-panel-overlay-view-model,
#reaction-control-panel-overlay.yt-live-chat-renderer {
    display: none;
}
/* hide engagement */
yt-live-chat-viewer-engagement-message-renderer {
    display: none;
}
/* =========== chat style ============= */
/* hide scroll bar */
yt-live-chat-renderer.yt-live-chat-app { --scrollbar-width: 0 !important; }
/* chat style */
#chat #message.yt-live-chat-text-message-renderer,
#chat #message.yt-live-chat-paid-message-renderer,
#chat #message.yt-live-chat-membership-item-renderer {
    font-weight: bold;
    font-size: var(--scs-chatFontSize);
    position: relative;
}
/* background */
yt-live-chat-header-renderer,
yt-live-chat-renderer,
yt-live-chat-message-input-renderer,
yt-live-chat-ticker-renderer {
    background: var(--scs-backgroundColor);
}
@keyframes lateDisplayChat {
    0% { display: none; }
    99% { display: none; }
    100% { display: block; }
}
/* chat outline */
[scs_isEnableChatOutline=true] #message.yt-live-chat-text-message-renderer,
[scs_isEnableChatOutline=true] #message.yt-live-chat-paid-message-renderer,
[scs_isEnableChatOutline=true] #message.yt-live-chat-membership-item-renderer,
[scs_isEnableChatOutline=true] #body.yt-live-chat-restricted-participation-renderer {
    color: #ffffff; letter-spacing: 1px; line-height: 1.1;
    text-shadow:
        1px 1px 1px var(--scs-chatOutlineColor), -1px 1px 1px var(--scs-chatOutlineColor),
        1px -1px 1px var(--scs-chatOutlineColor), -1px -1px 1px var(--scs-chatOutlineColor),
        1px 0px 1px var(--scs-chatOutlineColor), 0px  1px 1px var(--scs-chatOutlineColor),
        -1px  0px 1px var(--scs-chatOutlineColor), 0px -1px 1px var(--scs-chatOutlineColor);
}
/* hide username */
[scs_isHideAuthorName=true] yt-live-chat-text-message-renderer #author-name.yt-live-chat-author-chip {
    display: none;
}
/* username are align to right */
[scs_isAuthorNameRightSide=true] yt-live-chat-text-message-renderer #author-name.yt-live-chat-author-chip {
    position: absolute;
    right: 10px; top: 0px;
    opacity: 0.7; transform: scale(0.8);
}
[scs_isAuthorNameRightSide=false] yt-live-chat-text-message-renderer #author-name.yt-live-chat-author-chip {
    max-width: var(--scs-authorNameMaxWidth, 100px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
/* hide icon */
[scs_isHideThumbnail=true] #chat yt-live-chat-text-message-renderer #author-photo {
    display: none;
}
/* hide badge */
[scs_isHideBadge=true] #chat yt-live-chat-text-message-renderer #chat-badges,
[scs_isHideBadge=true] #chat yt-live-chat-text-message-renderer > #content > #before-content-buttons {
    display: none;
}
/* min member chat */
[scs_simpleMemberChat=true] #chat yt-live-chat-membership-item-renderer #card #header {
    display: none !important;
    margin: 0 !important;
    padding: 0 !important;
}
[scs_simpleMemberChat=true] #ticker yt-live-chat-ticker-sponsor-item-renderer {
    display: none;
}
/* hide member gift */
[scs_isHideMembershipGift=true] ytd-sponsorships-live-chat-gift-redemption-announcement-renderer,
[scs_isHideMembershipGift=true] ytd-sponsorships-live-chat-gift-purchase-announcement-renderer {
    display: none !important;
}
#items.yt-live-chat-ticker-renderer {
    height: max-content;
    max-height: 32px;
}
yt-live-chat-reply-button-view-model {
    display: none;
}
/* member only */
[scs_isMemberOnly=true] #chat yt-live-chat-text-message-renderer[author-type=''] {
    display: none;
}
/* hide common emote */
[scs_ishidecommonemotes=true] #pickers #category-buttons.yt-emoji-picker-renderer,
[scs_ishidecommonemotes=true] #pickers #search-panel.yt-emoji-picker-renderer,
[scs_ishidecommonemotes=true] #pickers #categories yt-emoji-picker-category-renderer.yt-emoji-picker-renderer {
    display: none !important;
}
[scs_ishidecommonemotes=true] #pickers #categories yt-emoji-picker-category-renderer.yt-emoji-picker-renderer:first-child {
    display: block !important;
}
/*  */
[scs_isCountHeavyUser=true] #content.yt-live-chat-text-message-renderer {
    position: relative; width: 100%;
}
[scs_isCountHeavyUser=true]::after {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    opacity: 0.3;
    background: #dc143c;
    content: "";
    width: var(--heavy-user, 0%);
    max-width: 100%;
    z-index: -1;
}
/* limit */
[scs_chatCountLimitEnabled=true] #items.yt-live-chat-item-list-renderer > .yt-live-chat-item-list-renderer {
    display: none;
}
[scs_chatCountLimitEnabled=true] #items.yt-live-chat-item-list-renderer > .yt-live-chat-item-list-renderer:nth-last-child(-n + ${c.chatCountLimit} of :not([hidden])) {
    display: block;
}
/* fricker */
[scs_disableChatFlickers=true] #items.yt-live-chat-item-list-renderer > .yt-live-chat-item-list-renderer:nth-last-child(-n + 5) {
    display: none;
}
[scs_disableChatFlickers=true] #items { transform: none !important; }
/* ========= super chat style ========= */
/* history */
[scs_superChatViewType_history=false] #ticker.yt-live-chat-renderer {
    display: none;
}
/* chat header */
[scs_superChatViewType_header=false] #items.yt-live-chat-item-list-renderer #header {
    min-height: 8px;
    height: 8px;
    visibility: collapse;
    margin: 0;
    padding: 0;
}
/* chat message */
[scs_superChatViewType_header=false] #items.yt-live-chat-item-list-renderer yt-live-chat-paid-message-renderer[show-only-header],
[scs_superChatViewType_header=false] #items.yt-live-chat-item-list-renderer yt-live-chat-membership-item-renderer[show-only-header],
[scs_superChatViewType_message=false] #items.yt-live-chat-item-list-renderer yt-live-chat-paid-message-renderer,
[scs_superChatViewType_message=false] #items.yt-live-chat-item-list-renderer yt-live-chat-membership-item-renderer,
[scs_superChatViewType_message=false] #items.yt-live-chat-item-list-renderer yt-live-chat-paid-sticker-renderer
{
    display: none;
    padding: 0;
    margin: 0;
}
#like-button.yt-live-chat-paid-message-renderer {
    display: none;
}
#lower-bumper.yt-live-chat-paid-message-renderer {
    display: none;
}
/* ========= emoji fever ========= */
.emoji.yt-live-chat-text-message-renderer[fever] {
    position: absolute;
    display: inline-block;
    bottom: 0;
    width: 32px; height: 32px;
    z-index: -1;
    opacity: 0;
    animation:
        scs-emotesFeverHorizontal 1s alternate infinite ease-in-out,
        scs-emotesFeverVertical 4s alternate 1 ease-in;
}
.emoji.yt-live-chat-text-message-renderer[fever1] {
    animation-delay: 0s, 0s;
}
.emoji.yt-live-chat-text-message-renderer[fever2] {
    animation-delay: -0.4s, 0s;
}
.emoji.yt-live-chat-text-message-renderer[fever3] {
    animation-delay: -0.8s, 0s;
}
.emoji.yt-live-chat-text-message-renderer[fever4] {
    animation-delay: -1.2s, 0s;
}
.emoji.yt-live-chat-text-message-renderer[fever5] {
    animation-delay: -1.6s, 0s;
}
@keyframes scs-emotesFeverHorizontal {
    100% { transform: translateX(var(--fever-width)) rotateZ(4deg); }
}
@keyframes scs-emotesFeverVertical {
    0% { opacity: 0; }
   10% { opacity: 0.9; }
   80% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(var(--fever-height)); }
}

/* =========== scs =========== */
body {
    pointer-events: all;
    --toggle-button-background: #1E90FF;
    --toggle-button-off-background: #8f8f8f;
}
#panel-pages.yt-live-chat-renderer {
    padding-bottom: 12px;
}
yt-live-chat-app #scs-chat-buttons-container {
    position: absolute; right: 0; bottom: 0;
    opacity: 0;
    transition: opacity .2s linear;
}
yt-live-chat-app:hover #scs-chat-buttons-container {
    opacity: 1;
}
yt-live-chat-app .chat-toggle-button {
    display: inline-block;
    color: #fff;
    background: var(--toggle-button-off-background);
    padding: 2px;
    cursor: pointer;
    margin-left: 3px;
    z-index: 2021;
}
yt-live-chat-app .chat-toggle-button[inverse],
yt-live-chat-app .chat-toggle-button[on_] {
    background: var(--toggle-button-background);
}
yt-live-chat-app .chat-toggle-button svg {
    vertical-align: middle;
    fill: #fff;
    pointer-events: none;
}
#scs-docked-chats {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
}
[dark] #scs-docked-chats {
    background: #000;
}
`;

        document.querySelectorAll("[config-key]").forEach(element => {
            var key = element.getAttribute("config-key");
            stylesheet += `
[${key}=true] yt-live-chat-app .chat-toggle-button[config-key=${key}] { background: var(--toggle-button-background); }
[${key}=true] yt-live-chat-app .chat-toggle-button[config-key=${key}][inverse] { background: var(--toggle-button-off-background); }
`;
        });

        GM.addStyle(stylesheet);
    }

    function instantToggleConfig(key, isParent) {
        var value = !(document.body.getAttribute(key) == "true");
        document.body.setAttribute(key, value);
        if (isParent && window != window.parent) {
            window.parent.document.body.setAttribute(key, value);
        }

        return value;
    }

    function instantToggleConfigOnClick(ev) {
        instantToggleConfig(ev.target.getAttribute("config-key"), true);
    }

    function filterButtonOnClick(ev) {
        enableFilter = instantToggleConfig("scs_enableFilter");
    }

    function popupButtonOnClick() {
        popupSingleBorderWindow(window.parent.location.href);
        if (window.parent != window) {
            parent.close();
        }
    }

    // チャットウィンドウの開閉をする
    // サブカラムの切り替えボタンをクリックする
    function toggleChatWindow() {
        var doc = document;
        if (window.parent != window) {
            doc = window.parent.document;
        }
        var toggleButton = doc.querySelector("#show-hide-button button");
        toggleButton && toggleButton.click();
    }

    // チャットのリロードをする
    // チャットウィンドウのトップチャットを選択する
    function reloadChat() {
        var doc = document;
        if (window.parent == window) {
            var chat = document.querySelector("#chatframe");
            if (chat && chat.contentDocument) {
                doc = chat.contentDocument;
            }
        }
        var menu = doc.querySelector("#view-selector yt-dropdown-menu #menu > a");
        menu && menu.click();
    }

    // チャットウィンドウのみから使用する
    // 設定ポップアップとチャットウィンドウとの干渉を解決する
    var fixPlayerConflictTimer;
    function fixPlayerConflict() {
        var chat = window.parent.document.querySelector("#chatframe");
        if (!chat) return;

        var button = window.parent.document.querySelector(".ytp-settings-button");
        if (button && button.getAttribute("aria-expanded") == "true") {
            chat.style.pointerEvents = "none";
            chat.style.opacity = 0;

            // setInterval を多重起動しない
            clearTimeout(fixPlayerConflictTimer);
            fixPlayerConflictTimer = setInterval(fixPlayerConflict, 500);
        } else {
            chat.style.pointerEvents = "all";
            chat.style.opacity = c.windowOpacity;
            clearTimeout(fixPlayerConflictTimer);
        }
    }

    // 動的にレイアウトを調整する
    // ウィンドウのリサイズなどに合わせて呼び出す
    function updateDynamicLayout() {
        var flexy = document.querySelector("ytd-watch-flexy");
        document.body.setAttribute("flexy_fullscreen", flexy && !!flexy.fullscreen);
        document.body.setAttribute("flexy_isTheater_", flexy && flexy.isTheater_());
        document.body.setAttribute("scs_outsideControls_ytlc", !!document.querySelector("#ytlctn-style-for-native-control"));

        updateChatWindowVariables();
    }

    // チャットウィンドウの高さを調整する
    function updateChatWindowVariables() {
        if (window != window.parent) {
            return;
        }

        var height = 0;
        const player = document.querySelector("#player-wide-container,#full-bleed-container");
        if (player) {
            height += player.clientHeight;
            document.body.style.setProperty("--player-actual-height", player.clientHeight + "px");
        }

        var controls = document.querySelector(".ytp-chrome-bottom");
        if (controls) {
            height -= controls.clientHeight;
            document.body.style.setProperty("--player-controls-actual-height", controls.clientHeight + "px");
        }

        var chatframe = document.querySelector("#chatframe");
        if (chatframe) {
            if (height == 0) {
                delete chatframe.style.maxHeight;
            } else {
                chatframe.style.maxHeight = `${height}px`;
            }
            document.body.style.setProperty("--chatframe-actual-height", chatframe.clientHeight + "px");
        }

        var chat = document.querySelector("#chat");
        if (chat) {
            if (height == 0) {
                delete chat.style.maxHeight;
            } else {
                chat.style.maxHeight = `${height}px`;
            }
            document.body.style.setProperty("--chat-actual-height", chat.clientHeight + "px");
        }
    }

    var $highlisthDock;
    // チャットを強調表示する
    function highlightChat(chat) {
        if (!$highlisthDock) {
            $highlisthDock = document.querySelector("#scs-docked-chats");
        }

        var cloneHTML = chat.outerHTML;
        var src = chat.querySelector("#img").src;
        var message = chat.querySelector("#message").innerHTML;
        var author = chat.querySelector("#author-name").innerText;
        var authorType = chat.getAttribute("author-type");

        var holder = document.createElement("div");
        holder.innerHTML = myPolicy.createHTML(cloneHTML);

        $highlisthDock.appendChild(holder);

        // 要素追加したときにコンテンツを空にされるので対策 => 要素追加後に更新する
        setTimeout(() => {
            holder.querySelector("#img").src = src;
            holder.querySelector("#message").innerHTML = myPolicy.createHTML(message);
            var $name = holder.querySelector("#author-name");
            $name.innerText = author;
            if (authorType && authorType != "") {
                $name.classList.add(authorType);
            }

            setTimeout(() => holder.remove(), c.moderatorChatTimeout * 1000);
        }, 40);
    }

    /** *****************
     * Float Window
     * ******************/
    function addFloatWindowStyle() {
        // console.log("addFloatWindowStyle()", location.href);

        var stylesheet = `
/** full browser on theater mode **/
.ytp-offline-slate-background { background-size: contain; }
[scs_fullscreenMode=true] ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
    height: 100vh !important;
    max-height: 100vh;
}
[scs_fullscreenMode=true][flexy_isTheater_=true] #masthead-container {
    z-index: -2;
}
[scs_fullscreenMode=true][flexy_isTheater_=true] ytd-app {
    --ytd-masthead-height: 0px !important;
}
body[scs_fullscreenMode=true][flexy_isTheater_=true] {
    scrollbar-width: 0px;
}
body[scs_fullscreenMode=true][flexy_isTheater_=true]::-webkit-scrollbar {
    display: none !important;
}

/** chat **/
ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy:not([collapsed]),
ytd-watch-flexy[theater] #chat.ytd-watch-flexy:not([collapsed]) {
    position: fixed;
    border: 0;
    right: 8px;
    width: var(--scs-windowWidth);
    height: 100%;
    min-height: 0px;
    top: 0;
    z-index: 2021; /* calc(var(--ytd-z-index-masthead) - 1);*/ /* #masthead is 2020 */
    box-sizing: border-box;
    margin: 0;
    pointer-events: none;
    border-radius: 8px;
    background: #0000;
}
[scs_leftside=true] ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy:not([collapsed]),
[scs_leftside=true] ytd-watch-flexy[theater] #chat.ytd-watch-flexy:not([collapsed]) {
    left: 8px;
    right: unset;
}
ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame,
ytd-watch-flexy[theater] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame {
    position: absolute;
    top: calc(var(--ytd-masthead-height, 0px) - var(--html-scroll-top, 0px) - var(--app-scroll-top, 0px));
    height: var(--scs-windowHeight);
    width: var(--scs-windowWidth);
    padding: 8px;
    box-sizing: border-box;
    pointer-events: all;
    opacity: var(--scs-windowOpacity);
    border-radius: 12px;
}
[scs_bottomside=true] ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame,
[scs_bottomside=true] ytd-watch-flexy[theater] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame {
    margin-top: calc(var(--player-actual-height, 0px) - var(--chatframe-actual-height, 0px) - var(--player-controls-actual-height, 0px));
}

/* **************************************************************************/
/* YoutubeLiveClockのコントロールをプレイヤー外に表示する機能との干渉を対応 */
ytd-watch-flexy[theater]:not([fullscreen]) #columns #secondary #secondary-inner > #chat.ytd-watch-flexy {
    transform: translateY(0);
}
[scs_bottomside=true][scs_outsideControls_ytlc=true] ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame,
[scs_bottomside=true][scs_outsideControls_ytlc=true] ytd-watch-flexy[theater] #chat.ytd-watch-flexy:not([collapsed]) #chatframe.ytd-live-chat-frame {
    margin-top: calc(var(--player-actual-height, 0px) - var(--chatframe-actual-height, 0px) - var(--player-controls-actual-height, 0px) + 51px);
}
/* **************************************************************************/

ytd-watch-flexy[fullscreen] #chat.ytd-watch-flexy[collapsed] #chatframe.ytd-live-chat-frame,
ytd-watch-flexy[theater] #chat.ytd-watch-flexy[collapsed] #chatframe.ytd-live-chat-frame {
    height: 0;
}
#chat.ytd-watch-flexy:not([collapsed]) #show-hide-button { display: none; }
#show-hide-button > ytd-toggle-button-renderer {
    background: var(--scs-backgroundColor); transition: background .2s ease;
}
#show-hide-button > ytd-toggle-button-renderer:hover { background: #fffc; }

/* 右側黒帯できる対策 / フルスクリーン時チャット非表示対策 */
ytd-watch-flexy[squeezeback][panel-expanded] #panels-full-bleed-container.ytd-watch-flexy {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    pointer-events: none;
}

/** config **/
#${configAreaID} {
    display: none;
    position: fixed;
    right: 16px;
    top: 16px;
    font-size: 13px;
    color: var(--yt-spec-text-primary);
    line-height: 1.75rem;
    border-radius: 8px;
    padding: 24px;
    background: var(--yt-spec-base-background);
    z-index: 10000;
    transition: height .25s ease-in-out;
    max-height: 90%;
    overflow-y: auto;
    opacity: 0.95;
}
#${configAreaID}::after {
    position: absolute;
    font-size: 10px;
    color: #acacac;
    top: 3px;
    right: 8px;
    content: "Youtube live, Simple Chat Stylizer";
}
#${configAreaID} header {
    font-size: 16px;
    margin: 8px 0 4px 4px;
}
#${configAreaID} input {
    display: inline-block;
    width: 60px; min-height: 20px;
    text-align: center; vertical-align: middle;
    box-sizing: border-box;
    margin: 1px 8px 1px 0;
}
#${configAreaID} .dummy {
    display: inline-block;
    width: 60px; min-height: 20px;
    box-sizing: border-box;
    margin: 1px 8px 1px 0;
}
#${configAreaID} label {
    display: inline-block;
    min-height: 20px;
    vertical-align: middle;
    box-sizing: border-box;
}
#${configAreaID} label.for-select { margin-right: 8px; }
#${configAreaID} label a {
    color: #fff;
}
#${configAreaID} textarea {
    min-height: 2rem;
    max-width: 1000px;
    min-width: 100px;
    width: 100%;
    display: block;
}
#${configAreaID} button {
    display: inline-block;
    width: 200px;
    height: 32px;
    margin: 3px 0;
}
[scs_openConfig=true] #${configAreaID} { display: block; }
${configAreaID}-toggle { padding: 0 4px; }
${configAreaID}-toggle::after {
    display: block;
    content: "SCS";
    cursor: pointer;
    padding: 0 4px;
    line-height: var(--yt-button-icon-size, 40px);
}
`;

        GM.addStyle(stylesheet);
    }

    function appendUnit(value) {
        if (value.match(/(%|cm|mm|Q|in|pt|px|em|ex|rem|ch|lh|vm|vh|vmin|vmax)/)) {
            return value;
        } else {
            return value + "px";
        }
    }

    /** *****************
     * Single Bordered Window
     * ******************/
    function popupSingleBorderWindow(url) {
        url = url || location.href;
        window.open(url, url, SINGLE_WINDOW_PARAMS);
    }
})();