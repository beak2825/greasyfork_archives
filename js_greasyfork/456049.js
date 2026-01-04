// ==UserScript==
// @name               ChatGPT LaTeX Auto Render (OpenAI, new bing, you, etc.)
// @version            0.6.13
// @author             Scruel Tao
// @homepage           https://github.com/scruel/tampermonkey-scripts
// @description        Auto typeset LaTeX math formulas on ChatGPT pages (OpenAI, new bing, you, etc.).
// @description:zh-CN  自动渲染 ChatGPT 页面 (OpenAI, new bing, you 等) 上的 LaTeX 数学公式。
// @match              https://chatgpt.com/*
// @match              https://platform.openai.com/playground/*
// @match              https://www.bing.com/search?*
// @match              https://you.com/search?*&tbm=youchat*
// @match              https://www.you.com/search?*&tbm=youchat*
// @namespace          http://tampermonkey.net/
// @icon               https://chatgpt.com/favicon.ico
// @grant              none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/456049/ChatGPT%20LaTeX%20Auto%20Render%20%28OpenAI%2C%20new%20bing%2C%20you%2C%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456049/ChatGPT%20LaTeX%20Auto%20Render%20%28OpenAI%2C%20new%20bing%2C%20you%2C%20etc%29.meta.js
// ==/UserScript==

"use strict";

const PARSED_MARK = "_sc_parsed";
const MARKDOWN_RERENDER_MARK = "sc_mktag";

const MARKDOWN_SYMBOL_UNDERLINE = "XXXSCUEDLXXX";
const MARKDOWN_SYMBOL_ASTERISK = "XXXSCAESKXXX";

function queryAddNoParsed(query) {
    return query + ":not([" + PARSED_MARK + "])";
}

function showTipsElement() {
    const tipsElement = window._sc_ChatLatex.tipsElement;
    tipsElement.style.position = "fixed";
    tipsElement.style.right = "10px";
    tipsElement.style.top = "10px";
    tipsElement.style.background = "#333";
    tipsElement.style.color = "#fff";
    tipsElement.style.zIndex = "999999";
    var tipContainer = document.body.querySelector("header");
    if (!tipContainer) {
        tipContainer = document.body;
    }
    tipContainer.appendChild(tipsElement);
}

function setTipsElementText(text, errorRaise = false) {
    window._sc_ChatLatex.tipsElement.innerHTML = text;
    if (errorRaise) {
        throw text;
    }
    console.log(text);
}

async function addScript(url) {
    const scriptElement = document.createElement("script");
    const headElement =
          document.getElementsByTagName("head")[0] || document.documentElement;
    if (!headElement.appendChild(scriptElement)) {
        // Prevent appendChild overwritten problem.
        headElement.append(scriptElement);
    }
    scriptElement.src = url;
}

function traverseDOM(element, callback, onlySingle = true) {
    if (!onlySingle || !element.hasChildNodes()) {
        callback(element);
    }
    element = element.firstChild;
    while (element) {
        traverseDOM(element, callback, onlySingle);
        element = element.nextSibling;
    }
}

function getExtraInfoAddedMKContent(content) {
    // Ensure that the whitespace before and after the same
    content = content.replaceAll(/( *\*+ *)/g, MARKDOWN_SYMBOL_ASTERISK + "$1");
    content = content.replaceAll(/( *_+ *)/g, MARKDOWN_SYMBOL_UNDERLINE + "$1");
    // Ensure render for single line
    content = content.replaceAll(
        new RegExp(`^${MARKDOWN_SYMBOL_ASTERISK}(\\*+)`, "gm"),
        `${MARKDOWN_SYMBOL_ASTERISK} $1`
    );
    content = content.replaceAll(
        new RegExp(`^${MARKDOWN_SYMBOL_UNDERLINE}(_+)`, "gm"),
        `${MARKDOWN_SYMBOL_UNDERLINE} $1`
    );
    return content;
}

function removeEleMKExtraInfo(ele) {
    traverseDOM(ele, function (e) {
        if (e.textContent) {
            e.textContent = removeMKExtraInfo(e.textContent);
        }
    });
}

function removeMKExtraInfo(content) {
    content = content.replaceAll(MARKDOWN_SYMBOL_UNDERLINE, "");
    content = content.replaceAll(MARKDOWN_SYMBOL_ASTERISK, "");
    return content;
}

function getLastMKSymbol(ele, defaultSymbol) {
    if (!ele) {
        return defaultSymbol;
    }
    const content = ele.textContent.trim();
    if (content.endsWith(MARKDOWN_SYMBOL_UNDERLINE)) {
        return "_";
    }
    if (content.endsWith(MARKDOWN_SYMBOL_ASTERISK)) {
        return "*";
    }
    return defaultSymbol;
}

function restoreMarkdown(msgEle, tagName, defaultSymbol) {
    const eles = msgEle.querySelectorAll(tagName);
    eles.forEach((e) => {
        const restoredNodes = document
        .createRange()
        .createContextualFragment(e.innerHTML);
        const fn = restoredNodes.childNodes[0];
        const ln = restoredNodes.childNodes[restoredNodes.childNodes.length - 1];
        const wrapperSymbol = getLastMKSymbol(e.previousSibling, defaultSymbol);
        fn.textContent = wrapperSymbol + fn.textContent;
        ln.textContent = ln.textContent + wrapperSymbol;
        restoredNodes.prepend(
            document.createComment(
                MARKDOWN_RERENDER_MARK + "|0|" + tagName + "|" + wrapperSymbol.length
            )
        );
        restoredNodes.append(
            document.createComment(MARKDOWN_RERENDER_MARK + "|1|" + tagName)
        );
        e.parentElement.insertBefore(restoredNodes, e);
        e.parentNode.removeChild(e);
    });
    removeEleMKExtraInfo(msgEle);
}

function restoreAllMarkdown(msgEle) {
    restoreMarkdown(msgEle, "em", "_");
}

function rerenderAllMarkdown(msgEle) {
    // restore HTML from restored markdown comment info
    const startComments = [];
    traverseDOM(msgEle, function (n) {
        if (n.nodeType !== 8) {
            return;
        }
        const text = n.textContent.trim();
        if (!text.startsWith(MARKDOWN_RERENDER_MARK)) {
            return;
        }
        const tokens = text.split("|");
        if (tokens[1] === "0") {
            startComments.push(n);
        }
    });
    // Reverse to prevent nested elements
    startComments.reverse().forEach((n) => {
        const tokens = n.textContent.trim().split("|");
        const tagName = tokens[2];
        const tagRepLen = tokens[3];
        const tagEle = document.createElement(tagName);
        n.parentElement.insertBefore(tagEle, n);
        n.parentNode.removeChild(n);
        let subEle = tagEle.nextSibling;
        while (subEle) {
            if (subEle.nodeType == 8) {
                const text = subEle.textContent.trim();
                if (
                    text.startsWith(MARKDOWN_RERENDER_MARK) &&
                    text.split("|")[1] === "1"
                ) {
                    subEle.parentNode.removeChild(subEle);
                    break;
                }
            }
            tagEle.appendChild(subEle);
            subEle = tagEle.nextSibling;
        }
        // Remove previously added markdown symbols.
        tagEle.firstChild.textContent =
            tagEle.firstChild.textContent.substring(tagRepLen);
        tagEle.lastChild.textContent = tagEle.lastChild.textContent.substring(
            0,
            tagEle.lastChild.textContent.length - tagRepLen
        );
    });
}

async function prepareScript() {
    window._sc_beforeTypesetMsgEle = (msgEle) => {};
    window._sc_afterTypesetMsgEle = (msgEle) => {};
    window._sc_typeset = () => {
        try {
            console.log('[LaTeX] Typesetting...')
            const msgEles = window._sc_getMsgEles();
            msgEles.forEach((msgEle) => {
                restoreAllMarkdown(msgEle);
                msgEle.setAttribute(PARSED_MARK, "");

                window._sc_beforeTypesetMsgEle(msgEle);
                MathJax.typesetPromise([msgEle]);
                window._sc_afterTypesetMsgEle(msgEle);

                rerenderAllMarkdown(msgEle);
            });
        } catch (e) {
            console.warn(e);
        }
    };
    window._sc_mutationHandler = (mutation) => {
        if (mutation.oldValue === "") {
            window._sc_typeset();
        }
    };
    window._sc_chatLoaded = () => {
        return true;
    };
    window._sc_getObserveElement = () => {
        return null;
    };
    var observerOptions = {
        attributeOldValue: true,
        attributeFilter: ["cancelable", "disabled"],
    };
    var afterMainOvservationStart = () => {
        window._sc_typeset();
    };

    // Handle special cases per site.
    if (window.location.host === "www.bing.com") {
        window._sc_getObserveElement = () => {
            const ele = document.querySelector("#b_sydConvCont > cib-serp");
            if (!ele) {
                return null;
            }
            return ele.shadowRoot.querySelector("#cib-action-bar-main");
        };

        const getContMsgEles = (cont, isInChat = true) => {
            if (!cont) {
                return [];
            }
            const allChatTurn = cont.shadowRoot
            .querySelector("#cib-conversation-main")
            .shadowRoot.querySelectorAll("cib-chat-turn");
            var lastChatTurnSR = allChatTurn[allChatTurn.length - 1];
            if (isInChat) {
                lastChatTurnSR = lastChatTurnSR.shadowRoot;
            }
            const allCibMsgGroup =
                  lastChatTurnSR.querySelectorAll("cib-message-group");
            const allCibMsg = Array.from(allCibMsgGroup)
            .map((e) => Array.from(e.shadowRoot.querySelectorAll("cib-message")))
            .flatMap((e) => e);
            return Array.from(allCibMsg)
                .map((cibMsg) => cibMsg.shadowRoot.querySelector("cib-shared"))
                .filter((e) => e);
        };
        window._sc_getMsgEles = () => {
            try {
                const convCont = document.querySelector("#b_sydConvCont > cib-serp");
                const tigerCont = document.querySelector("#b_sydTigerCont > cib-serp");
                return getContMsgEles(convCont).concat(
                    getContMsgEles(tigerCont, false)
                );
            } catch (ignore) {
                return [];
            }
        };
    } else if (window.location.host === "chat.openai.com") {
        window._sc_getObserveElement = () => {
            return document.querySelector("main > div > div > div");
        };
        window._sc_chatLoaded = () => {
            return (
                document.querySelector("main div.text-sm>svg.animate-spin") === null
            );
        };

        observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
        };

        window._sc_mutationHandler = (mutation) => {
            if (mutation.removedNodes.length) {
                return;
            }
            const target = mutation.target;
            if (!target || target.tagName !== "DIV") {
                return;
            }
            const buttons = target.querySelectorAll("button");
            if (buttons.length !== 3 || !target.classList.contains("visible")) {
                return;
            }
            if (
                mutation.type === "attributes" ||
                (mutation.addedNodes.length && mutation.addedNodes[0] == buttons[1])
            ) {
                window._sc_typeset();
            }
        };

        afterMainOvservationStart = () => {
            window._sc_typeset();
            // Handle conversation switch
            new MutationObserver(async (mutationList) => {
                for (var mutation of mutationList) {
                    if (!mutation.addedNodes.length) {
                        continue;
                    }
                    const addedNode = mutation.addedNodes[0];
                    // Check if first added node is normal node
                    if (addedNode.nodeType !== 1) {
                        return;
                    }
                    // console.log(mutation);
                    const mainNode = addedNode.parentElement;
                    if (mainNode && mainNode.tagName !== 'MAIN') {
                        continue;
                    }
                    startMainOvservation(
                        await getMainObserveElement(true),
                        observerOptions
                    );
                    window._sc_typeset();
                    break;
                };
            }).observe(document.querySelector("#__next"), { childList: true, subtree: true});
        };

        window._sc_getMsgEles = () => {
            return document.querySelectorAll(
                queryAddNoParsed("div.w-full div.text-base div.items-start")
            );
        };

        window._sc_beforeTypesetMsgEle = (msgEle) => {
            // Prevent latex typeset conflict
            const displayEles = msgEle.querySelectorAll(".math-display");
            displayEles.forEach((e) => {
                const texEle = e.querySelector(".katex-mathml annotation");
                e.removeAttribute("class");
                e.textContent = "$$" + texEle.textContent + "$$";
            });
            const inlineEles = msgEle.querySelectorAll(".math-inline");
            inlineEles.forEach((e) => {
                const texEle = e.querySelector(".katex-mathml annotation");
                e.removeAttribute("class");
                // e.textContent = "$" + texEle.textContent + "$";
                // Mathjax will typeset this with display mode.
                e.textContent = "$$" + texEle.textContent + "$$";
            });
        };
        window._sc_afterTypesetMsgEle = (msgEle) => {
            // https://github.com/mathjax/MathJax/issues/3008
            msgEle.style.display = "unset";
        };
    } else if (
        window.location.host === "you.com" ||
        window.location.host === "www.you.com"
    ) {
        window._sc_getObserveElement = () => {
            return document.querySelector("#chatHistory");
        };
        window._sc_chatLoaded = () => {
            return !!document.querySelector(
                "#chatHistory div[data-pinnedconversationturnid]"
            );
        };
        observerOptions = { childList: true };

        window._sc_mutationHandler = (mutation) => {
            mutation.addedNodes.forEach((e) => {
                const attr = e.getAttribute("data-testid");
                if (attr && attr.startsWith("youchat-convTurn")) {
                    startTurnAttrObservationForTypesetting(
                        e,
                        "data-pinnedconversationturnid"
                    );
                }
            });
        };

        window._sc_getMsgEles = () => {
            return document.querySelectorAll(
                queryAddNoParsed('#chatHistory div[data-testid="youchat-answer"]')
            );
        };
    }
    console.log("Waiting for chat loading...");
    const mainElement = await getMainObserveElement();
    console.log("Chat loaded.");
    startMainOvservation(mainElement, observerOptions);
    afterMainOvservationStart();
}

function enbaleResultPatcher() {
    // TODO: refractor all code.
    if (window.location.host !== "chat.openai.com") {
        return;
    }
    const oldJSONParse = JSON.parse;
    JSON.parse = function _parse() {
        const res = oldJSONParse.apply(this, arguments);
        if (res.hasOwnProperty("message")) {
            const message = res.message;
            if (message.hasOwnProperty("end_turn") && message.end_turn) {
                message.content.parts[0] = getExtraInfoAddedMKContent(
                    message.content.parts[0]
                );
            }
        }
        return res;
    };

    const responseHandler = (response, result) => {
        if (
            result.hasOwnProperty("mapping") &&
            result.hasOwnProperty("current_node")
        ) {
            Object.keys(result.mapping).forEach((key) => {
                const mapObj = result.mapping[key];
                if (mapObj.hasOwnProperty("message")) {
                    if (mapObj.message.author.role === "user") {
                        return;
                    }
                    const contentObj = mapObj.message.content;
                    contentObj.parts[0] = getExtraInfoAddedMKContent(contentObj.parts[0]);
                }
            });
        }
    };
    let oldfetch = fetch;
    window.fetch = function patchedFetch() {
        return new Promise((resolve, reject) => {
            oldfetch
                .apply(this, arguments)
                .then((response) => {
                const oldJson = response.json;
                response.json = function () {
                    return new Promise((resolve, reject) => {
                        oldJson
                            .apply(this, arguments)
                            .then((result) => {
                            try {
                                responseHandler(response, result);
                            } catch (e) {
                                console.warn(e);
                            }
                            resolve(result);
                        })
                            .catch((e) => reject(e));
                    });
                };
                resolve(response);
            })
                .catch((e) => reject(e));
        });
    };

    // Resote
    const oldClipBoardWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = function patchedWriteText() {
        return new Promise((resolve, reject) => {
            arguments[0] = removeMKExtraInfo(arguments[0]);
            oldClipBoardWriteText
                .apply(this, arguments)
                .then((response) => {
                resolve(response);
            })
                .catch((e) => reject(e));
        });
    };
}

// After output completed, the attribute of turn element will be changed,
// only with observer won't be enough, so we have this function for sure.
function startTurnAttrObservationForTypesetting(element, doneWithAttr) {
    const tmpObserver = new MutationObserver((mutationList, observer) => {
        mutationList.forEach((mutation) => {
            if (mutation.oldValue === null) {
                window._sc_typeset();
                observer.disconnect;
            }
        });
    });
    tmpObserver.observe(element, {
        attributeOldValue: true,
        attributeFilter: [doneWithAttr],
    });
    if (element.hasAttribute(doneWithAttr)) {
        window._sc_typeset();
        tmpObserver.disconnect;
    }
}

function getMainObserveElement(chatLoaded = false) {
    return new Promise(async (resolve, reject) => {
        const resolver = () => {
            const ele = window._sc_getObserveElement();
            if (ele && (chatLoaded || window._sc_chatLoaded())) {
                return resolve(ele);
            }
            window.setTimeout(resolver, 500);
        };
        resolver();
    });
}

function startMainOvservation(mainElement, observerOptions) {
    const callback = (mutationList, observer) => {
        mutationList.forEach((mutation) => {
            window._sc_mutationHandler(mutation);
        });
    };
    if (window._sc_mainObserver) {
        window._sc_mainObserver.disconnect();
    }
    window._sc_mainObserver = new MutationObserver(callback);
    window._sc_mainObserver.observe(mainElement, observerOptions);
}

async function waitMathJaxLoaded() {
    while (!MathJax.hasOwnProperty("typeset")) {
        if (window._sc_ChatLatex.loadCount > 20000 / 200) {
            setTipsElementText("Failed to load MathJax, try refresh.", true);
        }
        await new Promise((x) => setTimeout(x, 500));
        window._sc_ChatLatex.loadCount += 1;
    }
}

function hideTipsElement(timeout = 3) {
    window.setTimeout(() => {
        window._sc_ChatLatex.tipsElement.hidden = true;
    }, 3000);
}

async function loadMathJax() {
    showTipsElement();
    setTipsElementText("Loading MathJax...");
    addScript("https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js");
    await waitMathJaxLoaded();
    setTipsElementText("MathJax Loaded.");
    hideTipsElement();
}

(async function () {
    window._sc_ChatLatex = {
        tipsElement: document.createElement("div"),
        loadCount: 0,
    };
    window.MathJax = {
        tex: {
            inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"],
            ],
            displayMath: [["$$", "$$", ["\\[", "\\]"]]],
        },
        startup: {
            typeset: false,
        },
    };

    enbaleResultPatcher();
    await loadMathJax();
    await prepareScript();
})();
