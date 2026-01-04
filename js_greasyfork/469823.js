// ==UserScript==
// @name         심야식당 도우미
// @description  심야식당을 좀 더 편하고 내 입맛에 맞게 이용
// @version      0.3.2
// @author       Yoonu
// @match        https://arca.live/b/*
// @match        https://kioskloud.io/e/*
// @match        https://kiosk.ac/c/*
// @match        https://mega.nz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @namespace https://greasyfork.org/users/64556
// @downloadURL https://update.greasyfork.org/scripts/469823/%EC%8B%AC%EC%95%BC%EC%8B%9D%EB%8B%B9%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/469823/%EC%8B%AC%EC%95%BC%EC%8B%9D%EB%8B%B9%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const RULE_PASSWORD = atob("c21wZW9wbGU=");

    const arcalive = async () => {
        const settings = {
            switch: {
                passwordDecoder: await GM.getValue("passwordDecoder", true),
                base64Decoder: await GM.getValue("base64Decoder", true),
                imageOriginalizer: await GM.getValue("imageOriginalizer", true),
            },
            passwordDecoder: {
                id: "arca_eh_password",
                origin: "국룰",
                rulePassword: await GM.getValue("rulePassword"),
            },
            pageMaxWidth: await GM.getValue("pageMaxWidth", "1800px"),
        };

        const styles = {
            password: "color: rgb(61, 142, 185); cursor: pointer; font-weight: bold;",
            copiedPassword: "color: rgb(61, 142, 185); cursor: pointer;",
        };

        // Change content area width
        const wrapper = document.querySelector("div.content-wrapper");
        if(settings.pageMaxWidth) wrapper.style.maxWidth = settings.pageMaxWidth;

        // Get article
        const article = wrapper.querySelector("div.article-body > div.article-content");
        if(!article) return;

        let articleHtml = article.innerHTML;

        // Decode base64
        if(settings.switch.base64Decoder) {
            articleHtml = articleHtml.replace(/(YUhSMGN|aHR0c)[0-9A-Za-z+]{8,}[=]{0,2}/g, (matcher) => {
                let decoded;
                try {
                    decoded = atob(matcher.startsWith("Y") ? atob(matcher) : matcher);
                    return `<a href="${decoded}" target="_blank">${decoded}</a>`;
                } catch(e) {
                    return matcher + `<span style="font-size: 9pt; color: red;" title="${e}">코드 복호화 실패</span>`;
                }
            });
        }

        // Find password
        if(settings.switch.passwordDecoder) {
            if(settings.passwordDecoder.rulePassword !== RULE_PASSWORD) {
                const inputText = prompt("국룰 확인");

                if(inputText?.toLowerCase() === RULE_PASSWORD) {
                    GM.setValue("rulePassword", RULE_PASSWORD);
                    settings.passwordDecoder.rulePassword = RULE_PASSWORD;
                } else {
                    GM.setValue("passwordDecoder", false);
                    alert("국룰 비밀번호가 일치하지 않습니다. 국룰 해석 기능을 비활성화합니다.");
                }
            }

            if(settings.passwordDecoder.rulePassword === RULE_PASSWORD) {
                articleHtml = articleHtml.replace(/&nbsp;/g, " ").replace(new RegExp("[^\\s>]*" + settings.passwordDecoder.origin + "[^\\s\n<]*"), (matcher) => {
                    let preText = "", postText = "";

                    matcher = matcher.replace(/(비밀번호|암호|비번|패스워드)?(\s*[-:=]*\s*)([은|는])?국룰(과|은|을|이|이며|이고|임|입니다|임다|이다)?([\.,\(\[])?$/g, (matcher2, ...args) => {
                        preText = (args[0] || "") + (args[1] || "") + (args[2] || "");
                        postText = (args[3] || "") + (args[4] || "");
                        return settings.passwordDecoder.origin;
                    });

                    const id = settings.passwordDecoder.id;
                    const decodedPassword = matcher.replace(settings.passwordDecoder.origin, settings.passwordDecoder.rulePassword);

                    let result = preText + matcher + ` <a href="#" id="${id}" style="${styles.password}" data-password="${RULE_PASSWORD}" title="클릭 시 비밀번호가 복사됩니다.">🔑${RULE_PASSWORD}</a>`;
                    if(RULE_PASSWORD !== decodedPassword) result += ` / <a href="#" id="${id}_decoded" style="${styles.password}" data-password="${decodedPassword}" title="클릭 시 비밀번호가 복사됩니다.">🔑${decodedPassword}</a>`
                    result += postText;

                    return result
                });
            }
        }

        // Change original image
        if(settings.switch.imageOriginalizer) {
            articleHtml = articleHtml.replace(/<img[^>]+src="([^"]+)[^>]+loading="lazy"[^>]*>/g, (matcher, src) => `<img src="${src}&type=orig&dummy" loading="lazy">`);
        }

        // Apply article changed
        if(Object.values(settings.switch).some(Boolean))
            article.innerHTML = articleHtml;

        // Password copy event
        const copyPassword = async (e) => {
            // Prevent page move
            e.preventDefault();

            await navigator.clipboard.writeText(e.target.dataset.password);
            e.target.style = styles.copiedPassword;
        };

        // Set event password clicked
        document.getElementById(settings.passwordDecoder.id)?.addEventListener("click", copyPassword);
        document.getElementById(settings.passwordDecoder.id + "_decoded")?.addEventListener("click", copyPassword);
    }

    // Set password at inputbox
    const setMutationObserver = (hostObject) => {
        const copyPassword = async (callback) => {
            // Get password
            const clipboard = await navigator.clipboard.readText();
            const password = clipboard?.toLowerCase().indexOf(RULE_PASSWORD) > -1 ? clipboard : RULE_PASSWORD;

            hostObject.postAction(hostObject, password);
            window.removeEventListener("focus", copyPassword);
        }

        // Mutation observer
        const observer = new MutationObserver((mutationList, observer) => {
            // Returns if preAction is empty or the result of the action is true
            const preResult = !(hostObject.preAction && hostObject.preAction(hostObject));
            if(preResult === false)
                return false;

            // Copy password when focused
            if(document.hasFocus())
                copyPassword();
            else
                window.addEventListener("focus", copyPassword);

            // Mutation observer disconnect
            observer.disconnect();
        });

        // Observing start
        observer.observe(hostObject.container, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    // Per-Host behavior
    const kiosk = {
        container: document.querySelector("body > div"),
        preAction: (hostObject) => {
            // Get password inputbox
            hostObject.inputBox = document.querySelector("#password-dialog input[type='password']");
            return !hostObject.inputBox;
        },
        postAction: (hostObject, password) => {
            // Input password
            hostObject.inputBox.value = password;
        },
    };
    const hosts = {
        "mega.nz": {
            container: document.getElementById("bodyel"),
            preAction: (hostObject) => {
                // Get password inputbox
                hostObject.inputBox = hostObject.container.querySelector("input#password-decrypt-input");
                return !hostObject.inputBox || !hostObject.inputBox.previousElementSibling;
            },
            postAction: (hostObject, password) => {
                // Disable password invisible protection
                hostObject.inputBox.previousElementSibling.remove();
                hostObject.inputBox.type = "text";

                // Input password
                hostObject.inputBox.value = password;
            },
        },
        "kiosk.ac": kiosk,
        "kioskloud.io": kiosk
    }

    // Execute function by host
    const currentHost = document.URL.split("/")[2];
    if(currentHost === "arca.live")
        arcalive();
    else
        setMutationObserver(hosts[currentHost]);
})();