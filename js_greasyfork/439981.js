// ==UserScript==
// @name         CC98 Tools - Image Collections - dev
// @version      1.0.3
// @description  为CC98网页版添加收藏图片功能
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @require      https://unpkg.com/dexie@3.2.0/dist/dexie.min.js
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/439981/CC98%20Tools%20-%20Image%20Collections%20-%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/439981/CC98%20Tools%20-%20Image%20Collections%20-%20dev.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const enableImportExport = false;

    // Store
    const db = Store();

    function Store() {
        const db = new Dexie("cc98-tools-image-collections"); // eslint-disable-line no-undef
        db.version(1).stores({
            images: "url, *tags",
        });
        async function add(image) {
            return await db.images.add(image);
        }
        async function bulkAdd(images) {
            return await db.images.bulkAdd(images);
        }
        async function get(tags) {
            return await db.images
                .where("tags")
                .anyOf(...tags)
                .distinct()
                .toArray();
        }
        async function del(urls) {
            return await db.images
                .where("url")
                .anyOf(...urls)
                .delete();
        }
        return { add, get, del, bulkAdd };
    }

    // import and export
    if(enableImportExport) {
        unsafeWindow.cc98_tools_image_collections = {
            import: async function(images) {
                images = JSON.stringify(JSON.parse(images));
                return await db.bulkAdd(images);
            },
            export: async function() {
                const images = await db.get(["default_tag"]);
                console.log(JSON.stringify(images));
            }
        };
    }

    // Components
    const imagePicker = ImagePicker({
        onSearch: async function (text) {
            const images = await db.get(text.split(" "));
            const result = images.map((image) => ({
                src: image.url,
                text: image.tags
                .filter((tag) => tag !== "default_tag")
                .join(" "),
            }));
            console.log("result", result);
            return result;
        },
        onDelete: async function (urls) {
            console.log("delete", urls);
            await db.del(urls);
        },
        onOK: async function (urls) {
            console.log("ok", urls);
            putText(urls.map((url) => `[img]${url}[/img]\n`).join(""));
        },
    });
    document.body.appendChild(imagePicker);

    const tagsInput = TagsInput({
        onSubmit: async function (text) {
            const tags = ["default_tag", ...text.split(" ").filter(Boolean)];
            console.log("save", tagsInput.imgSrc, "with tags", tags);
            await db.add({ url: tagsInput.imgSrc, tags: tags });
        },
    });
    document.body.appendChild(tagsInput);

    function putText(text) {
        const textarea = document.querySelector(".ubb-editor > textarea");
        if (!textarea) return;
        const setter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
        ).set;
        setter.call(textarea, textarea.value + text);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function Modal() {
        const modal = element(`<div tabindex="0"><div class="ant-modal-mask"></div><div class="ant-modal-wrap"><div class="ant-modal" style="width:60%;"><div class="ant-modal-content">Modal</div></div></div></div>`);
        modal.show = () => { modal.style.display = "block"; modal.focus({ preventScroll: true }); };
        modal.hide = () => { modal.style.display = "none"; };
        on(modal.querySelector(".ant-modal-wrap"), "click", function (e) {
            e.target === this && modal.hide();
        });
        on(document.body, "keyup", function (e) {
            e.keyCode === 27 && modal.hide();
        });
        return modal;
    }

    function Input(i) {
        const input = element(`<span class="ant-input-group ant-input-group-compact" style="display:flex;"><input type="text" class="ant-input"/><button type="button" class="ant-btn ant-btn-primary" style="box-sizing:border-box;"><span>Submit</span></button></span>`);
        const $ = (s) => input.querySelector(s);
        const inputElement = $("input");
        inputElement.placeholder = i.placeholder || "input text";
        on($("button"), "click", async () => await i.onSubmit(inputElement.value));
        on(inputElement, "keyup", async function (e) {
            e.keyCode === 13 && (await i.onSubmit(inputElement.value));
        });
        return input;
    }

    function Item(i) {
        const item = element(`<div class="search-result-item"><img src="${i.src}"/><p>${i.text}</p></div>`);
        item.select = () => item.classList.add("selected");
        on(item, "click", () => item.classList.toggle("selected"));
        return item;
    }

    function ImagePicker(i) {
        const modal = Modal();
        const $ = (s) => modal.querySelector(s);
        const $$ = (s) => [...modal.querySelectorAll(s)];
        $(".ant-modal-content").innerHTML = `<button class="ant-modal-close"><span class="ant-modal-close-x"></span></button><div class="ant-modal-header"><div class="ant-modal-title">Search</div></div><div class="ant-modal-body"><div class="ant-list" tabindex="0" style="height:20rem;margin-top:1em;overflow-y:auto;"></div></div><div class="ant-modal-footer"><div><button type="button" class="ant-btn ant-btn-danger"><span>删 除</span></button><button type="button" class="ant-btn ant-btn-primary"><span>确 定</span></button></div></div>`;
        on($(".ant-modal-close"), "click", () => modal.hide());
        on($(".ant-btn-danger"), "click", async function () {
            await i.onDelete(
                $$(".search-result-item.selected>img").map((img) => img.src)
            );
        });
        on($(".ant-btn-primary"), "click", async function () {
            await i.onOK(
                $$(".search-result-item.selected>img").map((img) => img.src)
            );
            modal.hide();
        });
        const list = $(".ant-list");
        on(list, "keydown", function (e) {
            if (e.ctrlKey && e.code === "KeyA") {
                e.preventDefault();
                $$(".search-result-item").forEach((item) => item.select());
            }
        });
        const search = Input({
            placeholder: "Search by tags (default_tag)",
            onSubmit: async (text) => {
                const result = await i.onSearch(text);
                list.innerHTML = "";
                list.append(...result.map((item) => Item(item)));
            },
        });
        const body = $(".ant-modal-body");
        body.insertBefore(search, body.firstChild);
        modal.hide();
        return modal;
    }

    function TagsInput(i) {
        const modal = Modal();
        const $ = (s) => modal.querySelector(s);
        $(".ant-modal-content").innerHTML = `<div class="ant-modal-body"></div>`;
        const input = Input({
            placeholder: "Enter tags, separated by spaces",
            onSubmit: async (text) => {
                await i.onSubmit(text);
                modal.hide();
            },
        });
        const body = $(".ant-modal-body");
        body.insertBefore(input, body.firstChild);
        modal.hide();
        return modal;
    }

    GM_addStyle(`
      .search-result-item { border-radius:4px; display:inline-block; margin:4px; outline:solid 1px lightgray; padding:2px; }
      .search-result-item.selected { outline:solid 2px deepskyblue; }
      .search-result-item>img { border-radius:4px; max-height:150px; overflow:hidden; }
    `);

    // Observer to add or remove button
    Observe(document.body, callback);

    function Observe(targetNode, callback, config) {
        config = config || {
            attributes: false,
            childList: true,
            subtree: true,
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        return observer;
    }

    function callback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.classList?.contains("ubb-image-toolbox")) {
                        addSaveButton(node);
                    } else if (
                        node.classList?.contains("ubb-editor") ||
                        node.classList?.contains("fa-smile-o") ||
                        node.id === "sendTopicInfo"
                    ) {
                        addImagePickerButton();
                    }
                }
                for (const node of mutation.removedNodes) {
                    if (node.classList?.contains("fa-smile-o")) {
                        removeImagePickerButton();
                    }
                }
            }
        }
    }

    function addSaveButton(toolbox) {
        // console.log('addSaveButton');
        const saveButton = element(
            `<button><i class="fa fa-bookmark"></i></button>`
        );
        on(saveButton, "click", () => {
            tagsInput.imgSrc = toolbox.nextSibling.src;
            tagsInput.show();
        });
        toolbox.insertBefore(saveButton, toolbox.firstChild);
    }

    function addImagePickerButton() {
        const referenceNode = document.querySelector(".fa-smile-o.ubb-button");
        if (!referenceNode) return;
        // console.log('addImagePickerButton');
        const imagePickerButton = element(
            `<button type="button" class="fa fa-bookmark ubb-button" title="收藏"></button>`
        );
        on(imagePickerButton, "click", () => {
            imagePicker.show();
        });
        referenceNode.parentNode.insertBefore(
            imagePickerButton,
            referenceNode.nextSibling
        );
    }

    function removeImagePickerButton() {
        const imagePickerButton = document.querySelector(
            ".fa-bookmark.ubb-button"
        );
        if (!imagePickerButton) return;
        // console.log('removeImagePickerButton');
        imagePickerButton.remove();
    }

    function on(elem, event, func) {
        return elem.addEventListener(event, func, false);
    }

    function element(html) {
        var t = document.createElement("template");
        t.innerHTML = html.trim();
        return t.content.firstChild;
    }
})();
