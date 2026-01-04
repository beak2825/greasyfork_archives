// ==UserScript==
// @name         Danbooru Tag Autocompletion For Fooocus
// @namespace    http://tampermonkey.net/
// @version      2025-06-05
// @description  Tag autocompletion for fooocus
// @author       CTRN43062
// @match        https://*.gradio.live
// @match        http://127.0.0.1:7865
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519023/Danbooru%20Tag%20Autocompletion%20For%20Fooocus.user.js
// @updateURL https://update.greasyfork.org/scripts/519023/Danbooru%20Tag%20Autocompletion%20For%20Fooocus.meta.js
// ==/UserScript==

GM_addStyle(`
  .autocomplete-list {
    position: absolute;
    display: flex;
    background: #eeeeed;
    border-radius: 5px;
    z-index: 1123;
    max-height: 12rem;
    overflow: auto;
    bottom: 105%;
    left: 5px;
    width: 300px !important;
    min-width: fit-content;
  }

  .autocomplete-list div {
    line-height: 1.5rem;
    padding: 4px 10px;
    display: flex;
    justify-content: space-between;
  }

  .autocomplete-list div:nth-child(2n) {
    background: #ffffff;
  }

  .autocomplete-list div.active {
    background: #e5e7eb;
  }
 `);

/**
 * 从网络或者本地加载 tags 数据并返回
 *
 */

const CONFIG = {
    // [[textarea, parent]]
    selectors: [["#positive_prompt > label > textarea", "#component-11"]],
    first_n: 5,
};

class Tags {
    static TAG_FILES = {
        danbooru: {
            url: "https://raw.githubusercontent.com/DominikDoom/a1111-sd-webui-tagcomplete/refs/heads/main/tags/danbooru.csv",
            key: "danbooru",
        },
    };

    constructor() {
        this.save = true;

        Object.keys(Tags.TAG_FILES).forEach((key) => {
            this[`load${key.toUpperCase()}Tags`] = async () =>
            await this.loadTagsFromLocal(Tags.TAG_FILES[key].key);
        });
    }

    _csvTextToTagsItem(text) {
        const keys = ["name", "type", "count", "alias"];
        const result = [];

        for (const line of text.split("\n")) {
            const item = line.split(",");
            if (item.length < 3) {
                console.warn("Unknown csv format:", line);
                continue;
            }

            const obj = {};

            item.forEach((val, idx) => {
                obj[keys[idx]] = val;
            });

            result.push(obj);
        }

        return result;
    }

    saveTagsToLocal(key, tags) {
        localStorage.setItem(key, tags);
    }

    async loadTagsFromInternet(key) {
        const resp = await fetch(Tags.TAG_FILES[key].url);
        const text = await resp.text();
        return text;
    }

    async loadTagsFromLocal(key, update = false) {
        // 1girl,0,5882641,"1girls,sole_female"
        // name,type,count,alias
        let rawTags = localStorage.getItem(key);
        console.info("loading tags");
        if (!rawTags || update) {
            console.info("loading tags from web");
            rawTags = await this.loadTagsFromInternet(key);
            if (this.save) {
                this.saveTagsToLocal(key, rawTags);
            }
        }

        return this._csvTextToTagsItem(rawTags);
    }
}

class AutoCompleteList {
    constructor(doneCallback) {
        this.isShow = false;
        this.mounted = false;
        this.items = [];
        this.itemsEl = [];
        this.doneCallback = doneCallback;

        this.activeIndex = 0;
    }

    switchActive(idx) {
        this.itemsEl.forEach((item) => item.classList.remove("active"));
        this.itemsEl[idx].classList.add("active");
        // console.log(this.items[idx].name);
    }

    reset() {
        this.items = [];
        this.itemsEl = [];
        this.activeIndex = 0;
    }

    autocompleteDone() {
        if (typeof this.doneCallback !== "function") {
            throw Error("done callback must be a function");
        }

        this.doneCallback(this.items[this.activeIndex]);
        this.hide();
    }

    _initEvent() {
        const handlers = {
            ArrowDown: () => {
                if (this.activeIndex < this.items.length - 1) {
                    this.activeIndex++;
                    this.switchActive(this.activeIndex);
                }
            },
            ArrowUp: () => {
                if (this.activeIndex > 0) {
                    this.activeIndex--;
                    this.switchActive(this.activeIndex);
                }
            },
            Enter: () => {
                this.autocompleteDone();
            },
            Tab: () => {
                this.autocompleteDone();
            },
        };

        addEventListener("keydown", (e) => {
            const { key } = e;

            if (!this.isShow || !handlers[key]) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            handlers[key]();
        });
    }

    mount(el) {
        // const parent = this.textarea.parentElement;
        // if (!parent) {
        //   throw Error("无法挂载提示词列表");
        // }
        const div = document.createElement("div");
        el.appendChild(div);
        div.classList.add("autocomplete-list");

        this.el = div;
        this.mounted = true;

        this.el.addEventListener("click", (evt) => {
            // 子元素点击
            if (evt.target != el && el.contains(evt.target)) {
                const idx = this.itemsEl.findIndex((item) => item.contains(evt.target));
                if (idx > 0) {
                    this.activeIndex = idx;
                    this.autocompleteDone();
                }
            }
        });

        this._initEvent();

        return div;
    }

    _createItem(item) {
        const { name, type, count, alias } = item;
        const div = document.createElement("div");
        const typeColor = {
            0: "#337ab7",
            1: "#A00",
            // 2: "darkorchid",
            3: "#A0A",
            4: "#0A0",
            5: "#F80",
        };

        div.style.color = `${typeColor[type] || "black"}`;
        div.innerHTML = `<span>${name}</span><span>${count}</span>`;

        return div;
    }

    appendItems(items) {
        this.el.innerHTML = ``;
        this.reset();
        this.items = items;

        const frg = document.createDocumentFragment();

        for (const item of items) {
            const itemEl = this._createItem(item);
            this.itemsEl.push(itemEl);
            frg.appendChild(itemEl);
        }

        this.el.appendChild(frg);
        this.switchActive(0);
    }

    hide() {
        if (this.isShow) {
            this.isShow = false;
            this.el.style.display = "none";
            this.reset();
        }
    }

    show() {
        if (!this.isShow) {
            this.isShow = true;
            this.el.style.display = "flex";
            this.el.style.flexFlow = "column";
        }
    }
}

class AutoComplete {
    constructor(textarea, parentEl, first_n) {
        this.textarea = textarea;
        this.FIRST_N = first_n;

        this.prevPrompt = this.textarea.value;
        this.userInputLength = -1;

        this.whiteList = ["-", "_", "(", ")", ".", "$"];

        this.autocompleteList = new AutoCompleteList((item) =>
                                                     this.handleCompleteDone(item)
                                                    );

        this.autocompleteList.mount(parentEl);
        this._initEvent();
    }

    _diffPrompt(prev, cur) {
        prev = prev
            .split(/[,\n]/)
            .map((p) => p.trim())
            .filter((p) => p);
        cur = cur
            .split(/[,\n]/)
            .map((p) => p.trim())
            .filter((p) => p);
        const count = {};

        for (const t of prev) {
            count[t] = count[t] == undefined ? 1 : count[t] + 1;
        }

        const result = [];
        for (const t of cur) {
            count[t] = count[t] == undefined ? -1 : count[t] - 1;
            if (count[t] < 0) {
                result.push(t.trim());
            }
        }

        return result;
    }

    handleCompleteDone(item) {
        item = { ...item };
        item.name = item.name.replace(/([\(\)\[\]])/g, "\\$1").replace(/_/g, " ");

        const { value, selectionStart, selectionEnd } = this.textarea;
        const start = selectionStart - this.userInputLength;
        const before = value.substring(0, start),
              after = value.substring(selectionEnd);
        const p = start + item.name.length + 2;
        this.textarea.value = before + item.name + ", " + after;
        this.textarea.setSelectionRange(p, p);

        setTimeout(() => {
            this.textarea.dispatchEvent(new Event('input'))
            this.textarea.dispatchEvent(new Event('change'))
            this.textarea.dispatchEvent(new Event('blur'))
        }, 0)

        this.hideAutoComplete();
    }

    hideAutoComplete() {
        this.resetInputState();
        this.autocompleteList.hide();
    }

    resetInputState() {
        this.userInputLength = -1;
        this.prevPrompt = this.textarea.value;
    }

    getPopListPosition() {
        return { left: 20 };
        const tmp_div = document.createElement("div");
        const text = this.textarea.value;
        tmp_div.textContent = text.substring(0, this.textarea.selectionStart);
        const tmp_span = document.createElement("span");
        tmp_span.textContent = ".";
        let { top, left } = this.textarea.getBoundingClientRect();

        Object.assign(tmp_div.style, {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            visibility: "hidden",
            "word-break": "break-all",
            "white-space": "pre",
        });

        tmp_div.appendChild(tmp_span);
        this.textarea.parentElement.style.position = "relative";
        this.textarea.parentElement.appendChild(tmp_div);
        left = tmp_span.offsetLeft;
        tmp_div.remove();
        // tmp_div.classList.add("tmp1");

        return { left };
    }

    async _initEvent() {
        this.textarea.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hideAutoComplete();
        });

        // this.textarea.addEventListener("blur", () => {
        //   this.hideAutoComplete();
        // });

        // 排除 metadata tag
        this.allTags = (await new Tags().loadDANBOORUTags()).filter(tag => tag.type != 5);

        this.textarea.addEventListener("input", (e) => {
            const diff = this._diffPrompt(this.prevPrompt, this.textarea.value);

            if (diff.length != 1) {
                return this.hideAutoComplete();
            }

            const text = diff[0].toLowerCase();

            this.autocompleteList.show();
            const results = this.allTags.filter((item) => item.name.includes(text));

            this.userInputLength = diff[0].length;

            if (!results.length) {
                return this.hideAutoComplete();
            }

            // 简单的前缀匹配优先排序
            if (results.length <= 500) {
                results.sort((a, b) => {
                    if (a.name.startsWith(text)) {
                        return a.count;
                    } else if (b.name.startsWith(text)) {
                        return b.count;
                    }

                    return 0;
                });
            }

            const { left } = this.getPopListPosition();

            if (left) {
                this.autocompleteList.el.style.left = `${left}px`;
            }
            const slicedResult = results.slice(0, this.FIRST_N)

            // 匹配到了完整的输入，隐藏
            if(slicedResult.length === 1 && slicedResult.find(item => item.name === diff[0])) {
                 return this.hideAutoComplete()
            }

            this.autocompleteList.appendItems(slicedResult);
        });

        // this.textarea.addEventListener("keyup", (e) => {
        //   const key = e.key;

        //   if (key.length > 1) {
        //     return;
        //   }

        //   // 非 数字、字母，- _ 的跳过
        //   // if (!/\w/.test(key) && !this.whiteList.includes(key)) {
        //   //   this.hideAutoComplete();
        //   // }
        // });
    }
}

async function waitingForEl(selector) {
    function delay(ms) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }

    let MAX_WATING_MS = 5000 * 5;

    while (MAX_WATING_MS >= 0) {
        if (document.querySelector(selector)) {
            break;
        }
        await delay(50);
        MAX_WATING_MS -= 50;
    }
}

(function () {
    // console.log(document.title)
    // if(!document.title.startsWith('Fooocus')) {
    //    return
    // }

    "use strict";
    for (const [textarea, parent] of CONFIG.selectors) {
        console.log(textarea, parent);
        waitingForEl(textarea).then(() => {
            new AutoComplete(
                document.querySelector(textarea),
                document.querySelector(parent),
                CONFIG.first_n
            );
        });
    }
})();
