// ==UserScript==
// @name         疑似かんたんコメント
// @version      1.2.1
// @description  ニコニコ動画のかんたんコメントをカスタマイズします。
// @author       蝙蝠の目
// @license      MIT
// @match        https://www.nicovideo.jp/watch/*
// @namespace    https://greasyfork.org/ja/users/808813
// @downloadURL https://update.greasyfork.org/scripts/447009/%E7%96%91%E4%BC%BC%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/447009/%E7%96%91%E4%BC%BC%E3%81%8B%E3%82%93%E3%81%9F%E3%82%93%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const SCRIPT_NAME = "NiconicoPseudoKantanComment";

    function init() {
        addCSS(`
.EasyCommentButton {
    min-width: 0;
    margin-bottom: 4px;
}
.EasyCommentContainer {
    height: auto;
    min-height: 46px;
}
.EasyCommentContainer-inner {
    height: auto;
}
.EasyCommentContainer-prevButtonBox,
.EasyCommentContainer-nextButtonBox {
    display: none !important;
}
.EasyCommentContainer-easyComments {
    white-space: normal;
    padding: 0 12px;
}
.${SCRIPT_NAME}-pre {
    display: inline;
    font: inherit;
    margin: 0;
    padding: 0;
}
.${SCRIPT_NAME}-editButtonContainer {
    margin-left: 1.5em;
}
.${SCRIPT_NAME}-editButtonContainer *:nth-of-type(n+2) {
    margin-left: 0.8em;
}
#${SCRIPT_NAME}-configPanel {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10000000;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.9);
}
#${SCRIPT_NAME}-configPanel > div {
    position: absolute;
    width: 70%;
    left: 15%;
    top: 50%;
    transform: translateY(-50%);
    color: white;
}
#${SCRIPT_NAME}-configPanel p {
    line-height: 1.5em;
    margin-bottom: 1em;
}
#${SCRIPT_NAME}-configPanel button {
    margin-right: 0.4em;
}
#${SCRIPT_NAME}-commentEditor {
    width: 100%;
    height: 50vh;
}
        `);

        migrateFromNiconicoEasyKusa();
        if (storedData.wideMode) initWideMode();
        if (storedData.hideDefaultComment) hideDefaultComment();
        if (storedData.denseMode) initDenseMode();
        addEditPanel();
        addConfigPanel();
        addCommentButtonsFromStoredData();
    }

    function addCSS(cssText) {
        const styleElement = document.createElement("style");
        styleElement.textContent = cssText;
        styleElement.setAttribute("data-owner-script", SCRIPT_NAME);
        document.head.appendChild(styleElement);
    }

    function migrateFromNiconicoEasyKusa() {
        addCSS(`
.NiconicoEasyKusa-editButtonContainer,
.NiconicoEasyKusa-EasyCommentButton
{
    display: none;
}

.${SCRIPT_NAME}-EasyKusaWarning {
    padding: 4px;
    background-color: #fcc;
    color: #900;
}
.${SCRIPT_NAME}-EasyKusaWarning a {
    color: inherit;
    text-decoration: underline;
}
        `);

        // NiconicoEasyKusaが存在するときに警告を表示する
        window.setTimeout(() => {
            if (document.querySelector(".NiconicoEasyKusa-editButtonContainer")) {
                const warningDiv = document.createElement("div");
                warningDiv.classList.add(`${SCRIPT_NAME}-EasyKusaWarning`);
                document.querySelector(".MainContainer-floatingPanel").insertAdjacentElement(
                    "beforebegin",
                    warningDiv
                );
                warningDiv.innerHTML = `
<a href="https://greasyfork.org/ja/scripts/447009" target="_blank" rel="noopener noreferrer">疑似かんたんコメント</a> と <a href="https://greasyfork.org/ja/scripts/431904" target="_blank" rel="noopener noreferrer">Niconico Easy Kusa</a> の共存は非推奨です。Niconico Easy Kusa をアンインストールしてください（設定は引き継がれます）。
                `;
            }
        }, 100);
    }

    function initWideMode() {
        addCSS(`
.MainContainer-playerPanel {
    border-bottom: 1px solid #ddd;
}
.EasyCommentContainer {
    margin-top: 0;
}
        `);

        const easyCommentPanel = document.createElement("div");
        easyCommentPanel.classList.add(`${SCRIPT_NAME}-EasyCommentPanel`);
        document.querySelector(".MainContainer-floatingPanel").insertAdjacentElement(
            "beforebegin",
            easyCommentPanel
        );

        const easyCommentSection = document.querySelector(".EasyCommentContainer");
        easyCommentPanel.append(easyCommentSection);

        function onResize() {
            document.querySelector(".MainContainer-playerPanel").style.height =
                `${document.querySelector(".MainContainer-player").getClientRects()[0].height}px`;
        }
        onResize();
        window.addEventListener("resize", onResize);
    }

    function hideDefaultComment() {
        addCSS(`
.EasyCommentButton:not(.${SCRIPT_NAME}-EasyCommentButton) {
    display: none;
}
        `);
    }

    function initDenseMode() {
        addCSS(`
.EasyCommentContainer {
    padding-bottom: 4px;
}
.EasyCommentButton {
    margin: 0 !important;
    padding: 0 4px;
}
.EasyCommentContainer-easyComments {
    padding: 0 4px;
}
.${SCRIPT_NAME}-denseModeConfigButton {
    display: inline-block;
    font-size: 11px;
    line-height: 24px;
    margin-left: 14px;
}
        `);

        document.querySelector(".EasyCommentContainer-caption").style.display = "none";

        // [設定]ボタンはaddCommentButtonsFromStoredData()で追加
        // addConfigButtonForDenseMode();
    }

    function addConfigButtonForDenseMode() {
        const configButton = document.createElement("a");
        configButton.classList.add(`${SCRIPT_NAME}-denseModeConfigButton`);
        configButton.href = "javascript:void(0);";
        configButton.textContent = "[設定]";
        configButton.addEventListener("click", openConfigPanel);
        document.querySelector(".EasyCommentContainer-easyComments").appendChild(configButton);
    }

    function addEditPanel() {
        function createButton(text, onClick) {
            const button = document.createElement("a");
            button.href = "javascript:void(0);";
            button.textContent = `[${text}]`;
            if (onClick) {
                button.addEventListener("click", onClick);
            }
            return button;
        }

        const captionElement = document.querySelector(".EasyCommentContainer-caption");

        const editButtonContainer = document.createElement("span");
        captionElement.appendChild(editButtonContainer);
        editButtonContainer.id = `${SCRIPT_NAME}-editButtonContainer-0`;
        editButtonContainer.classList.add(`${SCRIPT_NAME}-editButtonContainer`);

        editButtonContainer.appendChild(createButton("設定", openConfigPanel));
    }

    function addCommentButtonsFromStoredData() {
        // Remove existing buttons
        for (const button of document.querySelectorAll(`.${SCRIPT_NAME}-EasyCommentButton, .${SCRIPT_NAME}-denseModeConfigButton`)) {
            button.remove();
        }

        // Add buttons
        for (const comment of storedData.getAllComments()) {
            addCommentButton(comment, false);
        }

        // Add config button (only in dense mode)
        if (storedData.denseMode) addConfigButtonForDenseMode();
    }

    function addCommentButton(text) {
        const container = document.querySelector(".EasyCommentContainer-easyComments");
        const button = createCommentButton(text);
        container.appendChild(button);

        return true;
    }

    function createCommentButton(text) {
        const button = document.createElement("button");
        button.classList.add("ActionButton");
        button.classList.add("EasyCommentButton");
        button.classList.add(`${SCRIPT_NAME}-EasyCommentButton`);

        const caption = document.createElement("div");
        caption.classList.add("EasyCommentButton-caption");
        caption.appendChild(createTextDisplay(text));
        button.appendChild(caption);

        button.addEventListener("click", () => postComment(text));

        return button;
    }

    function createTextDisplay(text) {
        const element = document.createElement("pre");
        element.classList.add(SCRIPT_NAME + "-pre");
        element.textContent = text;
        return element;
    }

    async function postComment(text) {
        const commandInput = document.querySelector(".CommentCommandInput");
        const commentInput = document.querySelector(".CommentInput-textarea");

        const command0 = commandInput.value;
        const comment0 = commentInput.value;

        commentInput.value = text;
        getReactHandler(commentInput, "onChange")({ target: commentInput });

        if (command0) {
            commandInput.value = "";
            getReactHandler(commandInput, "onChange")({ target: commandInput });
            await wait(15);
        }

        document.querySelector(".CommentPostButton").click();

        await wait(1);

        commandInput.value = command0;
        commentInput.value = comment0;
        getReactHandler(commandInput, "onChange")({ target: commandInput });
        getReactHandler(commentInput, "onChange")({ target: commentInput });
    }

    function getReactHandler(element, handlerName) {
        for (const x in element) {
            if (typeof x === "string" && x.indexOf("reactEventHandlers") >= 0) {
                return element[x][handlerName];
            }
        }
    }

    function animationFramePromise() {
        return new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    async function wait(frames) {
        for (let i = 0; i < frames; ++i) await animationFramePromise();
    }

    function addConfigPanel() {
        const configPanel = document.createElement("div");
        configPanel.id = `${SCRIPT_NAME}-configPanel`;
        document.body.appendChild(configPanel);

        const configContainer = document.createElement("div");
        configPanel.appendChild(configContainer);

        function br() {
            return document.createElement("br");
        }

        function createCheckbox(text, id) {
            const span = document.createElement("span");
            span.style.display = "inline-block";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = id;

            const label = document.createElement("label");
            label.textContent = text;
            label.setAttribute("for", id);

            span.append(checkbox, label);

            return span;
        }

        function createButton(text, onClick) {
            const button = document.createElement("button");
            button.textContent = text;
            button.addEventListener("click", onClick);
            return button;
        }

        const commentEditor = document.createElement("textarea");
        commentEditor.id = `${SCRIPT_NAME}-commentEditor`;
        commentEditor.addEventListener("input", () => {
            commentEditedInConfigPanel = true;
        });

        const p1 = document.createElement("p");
        configContainer.appendChild(p1);
        p1.append(
            "疑似かんたんコメント（改行で区切り）：",
            br(),
            commentEditor,
        );

        const p2 = document.createElement("p");
        configContainer.appendChild(p2);
        p2.append(
            "以下の項目はページ再読み込み後に反映されます。",
            br(),
            createCheckbox("ワイドモード", `${SCRIPT_NAME}-checkWideMode`),
            br(),
            createCheckbox("既定コメント非表示", `${SCRIPT_NAME}-checkHideDefaultComment`),
            br(),
            createCheckbox("密集モード", `${SCRIPT_NAME}-checkDenseMode`),
        );

        const p3 = document.createElement("p");
        configContainer.appendChild(p3);
        p3.append(
            createButton("保存して閉じる", () => closeConfigPanel(true)),
            createButton("変更を破棄して閉じる", () => closeConfigPanel(false)),
        );
    }

    let initialCommentEditorValue = "";

    function openConfigPanel() {
        const configPanel = document.getElementById(`${SCRIPT_NAME}-configPanel`);
        const commentEditor = document.getElementById(`${SCRIPT_NAME}-commentEditor`);
        const checkWideMode = document.getElementById(`${SCRIPT_NAME}-checkWideMode`);
        const checkHideDefaultComment = document.getElementById(`${SCRIPT_NAME}-checkHideDefaultComment`);
        const checkDenseMode = document.getElementById(`${SCRIPT_NAME}-checkDenseMode`);

        commentEditor.value = [...storedData.comments].join("\n");
        initialCommentEditorValue = commentEditor.value;
        checkWideMode.checked = storedData.wideMode;
        checkHideDefaultComment.checked = storedData.hideDefaultComment;
        checkDenseMode.checked = storedData.denseMode;

        configPanel.style.display = "block";
    }

    function closeConfigPanel(save) {
        const configPanel = document.getElementById(`${SCRIPT_NAME}-configPanel`);
        const commentEditor = document.getElementById(`${SCRIPT_NAME}-commentEditor`);
        const checkWideMode = document.getElementById(`${SCRIPT_NAME}-checkWideMode`);
        const checkHideDefaultComment = document.getElementById(`${SCRIPT_NAME}-checkHideDefaultComment`);
        const checkDenseMode = document.getElementById(`${SCRIPT_NAME}-checkDenseMode`);

        const updated = commentEditor.value !== initialCommentEditorValue
            || checkWideMode.checked !== storedData.wideMode
            || checkHideDefaultComment.checked !== storedData.hideDefaultComment
            || checkDenseMode.checked !== storedData.denseMode;

        if (updated) {
            if (save) {
                storedData.comments = new Set(commentEditor.value.replace(/\r/g, "").split("\n").filter(x => !!x));
                storedData.wideMode = checkWideMode.checked;
                storedData.hideDefaultComment = checkHideDefaultComment.checked;
                storedData.denseMode = checkDenseMode.checked;
                storedData._save();
                addCommentButtonsFromStoredData();
            } else {
                if (!window.confirm("[疑似かんたんコメント]\n作業内容は失われます。よろしいですか？")) {
                    return false;
                }
            }
        }

        configPanel.style.display = "none";
        return true;
    }

    class StoredData {
        constructor(localStorageKey) {
            this.localStorageKey = localStorageKey;
            this.comments = new Set(["草"]);
            this.wideMode = true;
            this.hideDefaultComment = false;
            this.denseMode = false;
            this._load();
        }

        _encodeToString() {
            return JSON.stringify({
                version: 1,
                comments: [...this.comments],
                wideMode: this.wideMode,
                hideDefaultComment: this.hideDefaultComment,
                denseMode: this.denseMode,
            });
        }

        _decodeFromString(str) {
            const data = JSON.parse(str);
            this.comments = new Set(data.comments);
            if ("wideMode" in data) this.wideMode = data.wideMode;
            if ("hideDefaultComment" in data) this.hideDefaultComment = data.hideDefaultComment;
            if ("denseMode" in data) this.denseMode = data.denseMode;
        }

        _load() {
            const str = localStorage.getItem(this.localStorageKey);
            if (str === null) {
                this._save();
                return true;
            }
            try {
                this._decodeFromString(str);
                return true;
            } catch {
                return false;
            }
        }

        _save() {
            localStorage.setItem(this.localStorageKey, this._encodeToString());
        }

        getAllComments() {
            return [...this.comments];
        }

        has(text) {
            return this.comments.has(text);
        }

        add(text) {
            this.comments.add(text);
            this._save();
        }

        delete(text) {
            const res = this.comments.delete(text);
            if (res) this._save();
            return res;
        }

        numberOfComments() {
            return this.comments.size;
        }
    }

    // NiconicoEasyKusaとの互換性のために共通のデータを使用する
    const storedData = new StoredData(`NiconicoEasyKusa-data`);

    init();

})();
