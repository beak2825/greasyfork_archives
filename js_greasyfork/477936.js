// ==UserScript==
// @name               pixiv share helper
// @name:zh-TW         pixiv 分享助手
// @namespace          https://github.com/zica87/self-made-userscipts
// @version            2.2.1
// @description        Convert sharing link to text with format: title | creator  link
// @description:zh-TW  將分享連結轉換為文字，格式：標題 | 作者  連結
// @author             zica
// @match              https://www.pixiv.net/*
// @grant              none
// @license            GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/477936/pixiv%20share%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/477936/pixiv%20share%20helper.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const container = generate_container();
    const [result, set_result] = generate_result();
    const input_wrapper = generate_input_wrapper();
    const paste_button = generate_paste_button();
    const box = generate_box();

    const prompt_no_permission = set_result.bind(
        undefined,
        "no clipboard permission",
        "pink"
    );

    paste_button.onclick = () => {
        navigator.clipboard.readText().then(
            (text) => {
                if (text.length === 0) {
                    set_result("not text", "yellow");
                } else {
                    copyText(process(text));
                }
            },
            () => {
                prompt_no_permission();
            }
        );
    };

    box.oninput = (e) => {
        copyText(process(e.target.value));
        box.value = "";
    };

    function copyText(text) {
        navigator.clipboard.writeText(text).then(
            () => {
                set_result("text copied", "lightgreen");
            },
            () => {
                prompt_no_permission();
            }
        );
    }

    container.append(result);
    input_wrapper.append(paste_button);
    input_wrapper.append(box);
    container.append(input_wrapper);
    document.body.prepend(container);

    let copyButton;
    let previousURL;
    const buttonId = "pixiv-share-helper";

    const observer = new MutationObserver(() => {
        const pawoo_a = document.querySelector(
            '[data-gtm-category="gtm-share-by-pawoo-in-detail-click"]'
        );
        if (pawoo_a === null || document.getElementById(buttonId) !== null) {
            return;
        }
        const pawoo_li = pawoo_a.parentElement;
        const rawURL = pawoo_a.href;
        if (!rawURL?.startsWith("https://pawoo.net/share?text=")) {
            return;
        }
        if (copyButton === undefined) {
            copyButton = document.createElement("li");
            copyButton.classList = pawoo_li.classList;
            copyButton.id = buttonId;
            copyButton.style.cursor = "pointer";

            const copyButtonText = document.createElement("span");
            copyButtonText.textContent = "copy text";
            copyButtonText.style.height = "24px";
            for (const currentClass of pawoo_a.classList) {
                // actually I don't know what it is
                if (!currentClass.startsWith("gtm")) {
                    copyButtonText.classList.add(currentClass);
                }
            }
            copyButton.append(copyButtonText);
        }
        if (rawURL !== previousURL) {
            previousURL = rawURL;
            copyButton.onclick = copyText.bind(undefined, process(rawURL));
        }
        pawoo_li.after(copyButton);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    function process(originalUrl) {
        const decoded = decodeURIComponent(originalUrl);
        // https://pawoo.net/share?text=お姉さん | 朱雷@Fantia更新中 #pixiv https://www.pixiv.net/artworks/108688782
        return decoded.substring(decoded.search("=") + 1).replace("#pixiv", "");
        // お姉さん | 朱雷@Fantia更新中  https://www.pixiv.net/artworks/108688782
    }

    function generate_container() {
        const container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            bottom: "5px",
            right: "5px",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
        });
        return container;
    }

    function generate_result() {
        const result_wrapper = document.createElement("div");
        Object.assign(result_wrapper.style, {
            marginBottom: "60px",
            display: "flex",
            justifyContent: "end",
        });

        const result = document.createElement("p");
        Object.assign(result.style, {
            color: "black",
            padding: "1em",
            textAlign: "end",
            width: "max-content",
        });

        let timeout_id;
        function set_result(text, backgroundColor) {
            Object.assign(result.style, {
                backgroundColor,
            });
            result.textContent = text;
            clearTimeout(timeout_id);
            result.style.display = "block";
            timeout_id = setTimeout(() => {
                result.style.display = "none";
            }, 5000);
        }
        result_wrapper.append(result);
        return [result_wrapper, set_result];
    }

    function generate_input_wrapper() {
        const input_wrapper = document.createElement("div");

        function hide() {
            input_wrapper.style.opacity = 0;
        }
        function show() {
            input_wrapper.style.opacity = 1;
        }

        hide();

        input_wrapper.addEventListener("mouseover", show);
        input_wrapper.addEventListener("dragover", show);
        input_wrapper.addEventListener("mouseleave", hide);
        input_wrapper.addEventListener("dragleave", hide);
        return input_wrapper;
    }

    function generate_paste_button() {
        const paste_button = document.createElement("input");
        Object.assign(paste_button, {
            type: "button",
            value: "paste",
        });
        Object.assign(paste_button.style, {
            marginRight: "0.5em",
        });
        return paste_button;
    }

    function generate_box() {
        const box = document.createElement("input");
        box.type = "text";
        Object.assign(box.style, {
            width: "5em",
        });
        return box;
    }
})();
