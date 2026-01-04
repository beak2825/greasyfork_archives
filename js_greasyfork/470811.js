// ==UserScript==
// @name         Translate翻译
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  页面选择自动翻译!
// @author       DQLean
// @license      MIT
// @match        *://*/*
// @connect      fanyi.baidu.com
// @connect      translate.google.com
// @connect      ifanyi.iciba.com
// @connect      www.bing.com
// @connect      fanyi.youdao.com
// @connect      dict.youdao.com
// @connect      m.youdao.com
// @connect      api.interpreter.caiyunai.com
// @connect      papago.naver.com
// @connect      fanyi.qq.com
// @connect      translate.alibaba.com
// @connect      www2.deepl.com
// @connect      transmart.qq.com
// @icon         https://www.rabbithome.top/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/470811/Translate%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470811/Translate%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const translateSourceName = GM_getValue("translateSource", "")

    const transdict = {
        '谷歌翻译': translate_gg,
        '谷歌翻译mobile': translate_ggm,
        '有道翻译mobile': translate_youdao_mobile,
        '必应翻译': translate_biying,
        '阿里翻译': translate_alibaba,
        '爱词霸翻译': translate_icib,
        '腾讯AI翻译': translate_tencentai,
    }

    for (let key in transdict) {
        const name = key
        GM_registerMenuCommand(name == translateSourceName ? "🟢" + name : "⚪" + name, () => changeTranslateSource(name))
    }

    function changeTranslateSource(source) {
        GM_setValue("translateSource", source)
        window.location.reload()
    }

    function getTranslateFunc() {
        if (!transdict[translateSourceName]) {
            return transdict["谷歌翻译"]
        }
        return transdict[translateSourceName]
    }

    function Request(options) {
        return new Promise((reslove, reject) => GM_xmlhttpRequest({ ...options, onload: reslove, onerror: reject }))
    }

    async function promiseRetryWrap(task, options, ...values) {
        const { RetryTimes, ErrProcesser } = options || {};
        let retryTimes = RetryTimes || 5;
        const usedErrProcesser = ErrProcesser || (err => { throw err });
        if (!task) return;
        while (true) {
            try {
                return await task(...values);
            } catch (err) {
                if (!--retryTimes) {
                    console.log(err);
                    return usedErrProcesser(err);
                }
            }
        }
    }

    async function baseTranslate(name, raw, options, processer) {
        const toDo = async () => {
            var tmp;
            try {
                const data = await Request(options);
                tmp = data.responseText;
                const result = await processer(tmp);
                if (result) sessionStorage.setItem(name + '-' + raw, result);
                return result
            } catch (err) {
                throw {
                    responseText: tmp,
                    err: err
                }
            }
        }
        return await promiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => "翻译出错" })
    }

    async function translate_alibaba(raw) {
        const options = {
            method: 'POST',
            url: 'https://translate.alibaba.com/translationopenseviceapp/trans/TranslateTextAddAlignment.do',
            data: `srcLanguage=auto&tgtLanguage=zh&bizType=message&srcText=${encodeURIComponent(raw)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "origin": "https://translate.alibaba.com",
                "referer": "https://translate.alibaba.com/",
                "sec-fetch-site": "same-origin",
            }
        }
        return await baseTranslate('阿里翻译', raw, options, res => JSON.parse(res).listTargetText[0])
    }

    async function translate_tencentai(raw) {
        const data = {
            "header": {
                "fn": "auto_translation"
            },
            "type": "plain",
            "model_category": "normal",
            "text_domain": "general",
            "source": {
                "lang": "auto",
                "text_list": [raw]
            },
            "target": {
                "lang": "auto"
            }
        }
        const options = {
            method: 'POST',
            url: 'https://transmart.qq.com/api/imt',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Host': 'transmart.qq.com',
                'Origin': 'https://transmart.qq.com',
                'Referer': 'https://transmart.qq.com/'
            },
            anonymous: true,
            nocache: true,
        }
        return await baseTranslate('腾讯AI翻译', raw, options, res => JSON.parse(res).auto_translation[0])
    }

    async function translate_icib(raw) {
        const sign = CryptoJS.MD5("6key_web_fanyi" + "ifanyiweb8hc9s98e" + raw.replace(/(^\s*)|(\s*$)/g, "")).toString().substring(0, 16)
        const options = {
            method: "POST",
            url: `https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&auth_user=key_web_fanyi&sign=${sign}`,
            data: 'from=auto&t=auto&q=' + encodeURIComponent(raw),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        return await baseTranslate('爱词霸翻译', raw, options, res => JSON.parse(res).content.out)
    }

    async function translate_biying(raw) {
        const options = {
            method: "POST",
            url: 'https://www.bing.com/ttranslatev3',
            data: 'fromLang=auto-detect&to=auto&text=' + encodeURIComponent(raw),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
        return await baseTranslate('必应翻译', raw, options, res => JSON.parse(res)[0].translations[0].text)
    }

    async function translate_ggm(raw) {
        const options = {
            method: "GET",
            url: "https://translate.google.com/m?tl=auto&q=" + encodeURIComponent(raw),
            headers: {
                "Host": "translate.google.com",
            },
            anonymous: true,
            nocache: true,
        }
        return await baseTranslate('谷歌翻译mobile', raw, options, res => /class="result-container">((?:.|\n)*?)<\/div/.exec(res)[1])
    }

    async function translate_gg(raw) {
        const options = {
            method: "POST",
            url: "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute",
            data: "f.req=" + encodeURIComponent(JSON.stringify([[["MkEWBc", JSON.stringify([[raw, "auto", "zh-CN", true], [null]]), null, "generic"]]])),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Host": "translate.google.com",
            },
            anonymous: true,
            nocache: true,
        }
        return await baseTranslate('谷歌翻译', raw, options, res => JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item => item[0]).join(''))
    }

    async function translate_youdao_mobile(raw) {
        const options = {
            method: "POST",
            url: 'http://m.youdao.com/translate',
            data: "inputtext=" + encodeURIComponent(raw) + "&type=AUTO",
            anonymous: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        return await baseTranslate('有道翻译mobile', raw, options, res => /id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1])
    }

    function debounce(func, delay) {
        let timeoutId;

        return function () {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                func.apply(this, arguments);
            }, delay);
        };
    }

    const msgBoxs = []

    function createMsgBox(text, duration = 1000) {
        const _msgBoxs = msgBoxs.concat([])
        msgBoxs.length = 0
        for (let m of _msgBoxs) {
            try { document.body.removeChild(m) } catch { }
        }

        const msgBox = document.createElement("div")
        msgBox.style.cssText = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 5px;
    padding: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
        `
        msgBox.innerText = text

        document.body.appendChild(msgBox)
        msgBoxs.push(msgBox)

        setTimeout(function () {
            try { document.body.removeChild(msgBox) } catch { }
        }, duration)
    }

    function createTranslatePopup() {
        const el = document.createElement("div")
        el.style.cssText = `
    max-width: 35%;
    max-height: 90%;
    overflow: hidden;
    position: fixed;
    background-color: rgb(250, 240, 230);
    padding: 10px 26px 10px 10px;
    margin-left: 5px;
    border-radius: 6px;
    word-wrap: break-word;
    font-family: sans-serif;
    font-weight: normal;
    top: 5px;
    left: 0;
    transform: translateX(-125%);
    transition: 0.2s;
    user-select: none;
    z-index: 9999;
    color: #000000;
    font-size: 14px;
    `

        const textBox = document.createElement("div")
        textBox.style.cssText = `
    word-wrap: break-word;
    pointer-events: none;
        `
        el.appendChild(textBox)

        const closeBtn = document.createElement("div")
        closeBtn.style.cssText = `
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; 
    height: 0;
    cursor: pointer;
    pointer-events: auto;
    user-select: none;
    border-width: 16px;
    border-style: solid;
    border-color: transparent rgb(255 0 0 / 20%) transparent transparent;
    `
        closeBtn.onmousedown = (e) => {
            hiden()
        }
        el.appendChild(closeBtn)

        let downPoint = {}

        el.onmousedown = (downEvent) => {
            downPoint = { x: downEvent.clientX, y: downEvent.clientY }

            const prey = downEvent.clientY

            const pretop = Number(el.style.top.replace("px", ""))

            const pretransition = el.style.transition

            const height = el.getBoundingClientRect().height

            el.style.transition = "0s"

            const moveHandle = (moveEvent) => {
                const cury = moveEvent.clientY

                el.style.left = "0px"
                el.style.top = (
                    cury - (prey - pretop) < 0 ? 0 : (
                        cury - (prey - pretop) + height > window.innerHeight ? window.innerHeight - height : cury - (prey - pretop)
                    )
                ) + "px"
            }

            document.addEventListener("mousemove", moveHandle)

            const close = () => {
                el.style.transition = pretransition
                document.removeEventListener("mousemove", moveHandle)
                document.removeEventListener("mouseup", close)
            }
            document.addEventListener("mouseup", close)
        }

        el.onmouseup = (upEvent) => {
            if (downPoint.x === upEvent.clientX &&
                downPoint.y === upEvent.clientY) {
                if (!navigator?.clipboard?.writeText) createMsgBox("浏览器不支持自动复制")
                else navigator.clipboard.writeText(textBox.innerText).then(() => {
                    createMsgBox("已复制")
                }).catch((err) => {
                    createMsgBox("已复制失败")
                })
            }
        }

        const show = (text = "") => {
            if (text && typeof text == "string") {
                if (text.length > 400) {
                    text = text.substring(0, 400)
                }
                text = text.replace(/\n\n+/gi, "\n")
                textBox.innerText = text
            }
            el.style.transform = "translateX(0%)"
        }
        const hiden = () => {
            el.style.transform = "translateX(-125%)"
        }

        document.body.appendChild(el)

        return { show, hiden, el }
    }

    /**
     * @param {Document} element
     */
    function createDocumentListener(element = null) {
        let doc = document
        if (element !== null) {
            doc = element
        }

        const { show, hiden, el } = createTranslatePopup()

        let isSelectionChanged = false;

        document.addEventListener('selectionchange', function () {
            isSelectionChanged = true;
        })

        doc.addEventListener("mouseup", () => {
            if (!isSelectionChanged) return
            isSelectionChanged = false

            const selection = window.getSelection()
            const selectedText = selection.toString()

            if (selection.isCollapsed || selectedText.trim() == "") return

            const session = sessionStorage.getItem(translateSourceName + '-' + selectedText)
            if (session) {
                show(session)
            } else {
                getTranslateFunc()(selectedText).then(res => {
                    show(res)
                }).catch(err => {
                    show(selectedText)
                })
            }

            const close = (e) => {
                if (e.target == el) return

                hiden()

                document.body.removeEventListener("mousedown", close)
            }
            document.body.addEventListener("mousedown", close)
        })
    }
    createDocumentListener()

    // Your code here...
})();