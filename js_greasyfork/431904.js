// ==UserScript==
// @name         Niconico Easy Kusa
// @version      1.1.1
// @description  ニコニコ動画のかんたんコメントをカスタマイズします。
// @author       蝙蝠の目
// @match        https://www.nicovideo.jp/watch/*
// @namespace https://greasyfork.org/ja/users/808813
// @downloadURL https://update.greasyfork.org/scripts/431904/Niconico%20Easy%20Kusa.user.js
// @updateURL https://update.greasyfork.org/scripts/431904/Niconico%20Easy%20Kusa.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const SCRIPT_NAME = "NiconicoEasyKusa";

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
.CommentPostContainer-commentInput.${SCRIPT_NAME}-adding {
    background-color: #a8ffa8;
}
.CommentPostContainer-commentInput.${SCRIPT_NAME}-warning {
    background-color: #f4b0b0;
}
.${SCRIPT_NAME}-EasyCommentButton.${SCRIPT_NAME}-deleting {
    background-color: #ffb8b8;
}
.${SCRIPT_NAME}-EasyCommentButton.${SCRIPT_NAME}-deleting:hover {
    background-color: #ff7878;
}
        `);

        addEditPanel();

        for (const comment of storedData.getAllComments()) {
            addCommentButton(comment, false);
        }

        setMode(0);
    }

    function addCSS(cssText) {
        const styleElement = document.createElement("style");
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
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

        const span0 = document.createElement("span");
        span0.id = `${SCRIPT_NAME}-editButtonContainer-0`;
        span0.classList.add(`${SCRIPT_NAME}-editButtonContainer`);

        let lastWarningTime = 0;
        const addButton = createButton("追加", () => {
            const commentInput = document.querySelector(".CommentInput-textarea");
            const text = commentInput.value;
            const succeed = addCommentButton(text);
            if (succeed) {
                commentInput.value = "";
                getReactHandler(commentInput, "onChange")({ target: commentInput });
            } else {
                const currentTime = Date.now();
                if (currentTime - lastWarningTime >= 750) {
                    const element = document.querySelector(".CommentPostContainer-commentInput");
                    const className = `${SCRIPT_NAME}-warning`;
                    element.classList.add(className);
                    window.setTimeout(() => element.classList.remove(className), 150);
                    window.setTimeout(() => element.classList.add(className), 300);
                    window.setTimeout(() => element.classList.remove(className), 450);
                    window.setTimeout(() => element.classList.add(className), 600);
                    window.setTimeout(() => element.classList.remove(className), 750);

                    lastWarningTime = currentTime;
                }
            }
        });
        addButton.addEventListener("mouseover", () => {
            document.querySelector(".CommentPostContainer-commentInput")
                .classList.add(`${SCRIPT_NAME}-adding`);
        });
        addButton.addEventListener("mouseout", () => {
            document.querySelector(".CommentPostContainer-commentInput")
                .classList.remove(`${SCRIPT_NAME}-adding`);
        });
        span0.appendChild(addButton);

        const deleteButton = createButton("削除", () => setMode(2));
        deleteButton.id = `${SCRIPT_NAME}-deleteButton`;
        span0.appendChild(deleteButton);

        captionElement.appendChild(span0);

        const span1 = document.createElement("span");
        span1.id = `${SCRIPT_NAME}-editButtonContainer-not0`;
        span1.classList.add(`${SCRIPT_NAME}-editButtonContainer`);

        span1.appendChild(createButton("削除完了", () => setMode(0)));

        captionElement.appendChild(span1);
    }

    function addCommentButton(text, saving = true) {
        if (saving) {
            if (/^\s*$/.test(text)) {
                return false;
            }

            if (storedData.has(text)) {
                return false;
            }
            storedData.add(text);
        }

        const container = document.querySelector(".EasyCommentContainer-easyComments");
        const button = createCommentButton(text);
        container.appendChild(button);

        setMode(0);
        return true;
    }

    function removeCommentButton(text) {
        const container = document.querySelector(".EasyCommentContainer-easyComments");
        for (const child of container.children) {
            if (child instanceof Element
                && child.classList.contains(`${SCRIPT_NAME}-EasyCommentButton`)
                && child.textContent === text
            ) {
                container.removeChild(child);
                break;
            }
        }

        storedData.delete(text);
        if (storedData.numberOfComments() === 0) {
            setMode(0);
        }
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

        button.addEventListener("click", () => {
            if (button.classList.contains(`${SCRIPT_NAME}-deleting`)) {
                removeCommentButton(text);
            } else {
                postComment(text);
            }
        });

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

    function setMode(mode) {
        document.getElementById(`${SCRIPT_NAME}-editButtonContainer-0`).style.display = mode === 0 ? "" : "none";
        document.getElementById(`${SCRIPT_NAME}-editButtonContainer-not0`).style.display = mode !== 0 ? "" : "none";
        document.getElementById(`${SCRIPT_NAME}-deleteButton`).style.display = storedData.numberOfComments() > 0 ? "" : "none";

        for (const button of document.querySelectorAll(`.${SCRIPT_NAME}-EasyCommentButton`)) {
            if (mode === 2) {
                button.classList.add(`${SCRIPT_NAME}-deleting`);
            } else {
                button.classList.remove(`${SCRIPT_NAME}-deleting`);
            }
        }
    }

    class StoredData {
        constructor(localStorageKey) {
            this.localStorageKey = localStorageKey;
            this.comments = new Set(["草"]);
            this._load();
        }

        _encodeToString() {
            return JSON.stringify({
                version: 1,
                comments: [...this.comments]
            });
        }

        _decodeFromString(str) {
            const data = JSON.parse(str);
            this.comments = new Set(data.comments);
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

    const storedData = new StoredData(`${SCRIPT_NAME}-data`);

    init();

})();
