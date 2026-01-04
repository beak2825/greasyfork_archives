// ==UserScript==
// @name         showDoc增强
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  对showDoc的增强
// @author       李向
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @match        https://www.showdoc.com.cn/*
// @icon         https://www.google.com/s2/favicons?domain=showdoc.com.cn
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/mode/javascript/javascript.min.js
// @resource css https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/codemirror.min.css
// @resource theme https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.61.1/theme/dracula.min.css
// @downloadURL https://update.greasyfork.org/scripts/428382/showDoc%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/428382/showDoc%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(async function (open) {
    // 格式化beautify配置
    const opts = {
        indent_size: 4
    }
    let codeMirrorInstance = null
    // 初始化数据
    let info = {
        descriptionRaw: '',
        urlRaw: '',
        methodRaw: '',
        paramsListRaw: []
    }
    // 配置生成的url模版
    function createUrlCode(description, funcName, method, url) {
        return `// ${description}
        export const ${funcName} = params => http.${method}('${url}',params)`
    }
    function splitLast(str) {
        const lastIndex = str.lastIndexOf("/");
        return str.slice(lastIndex + 1);
    }
    function createFunName(str) {
        let funcName = ''
        const last = splitLast(str)
        const hasUnderline = last.includes('_')
        const isCamel = /[A-Z]/.test(last)
        if (!hasUnderline && !isCamel) {
            console.log('需要取两位');
            const lastSecond = splitLastSecond(str)

            funcName = lastSecond + '_' + last
        } else {
            funcName = last
        }
        return funcName
    }
    function highlight() {
        for (const codeblock of document.getElementsByTagName('code')) {
            hljs.highlightBlock(codeblock)
        }
    }
    function createCodeMirror() {
        if (!codeMirrorInstance) {
            codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById("code"), {
                value: "剪贴板预览与编辑",
                mode: "javascript",
                theme: "dracula"
            });
        } else {
            codeMirrorInstance.setValue('剪贴板预览与编辑')
        }

    }
    function firstUpperCase(str) {
        return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
    }
    function splitLastSecond(str) {
        const arr = str.split("/");
        return arr[arr.length - 2];
    }
    function toHump(str) {
        if (!str) {
            return;
        }
        let newStr = "";
        let big = false;
        for (const i in str) {
            let s = str[i];
            if (big) {
                s = s.toLocaleUpperCase();
                big = false;
            }
            if (s === "_") {
                big = true;
            } else newStr += s;
        }
        return newStr;
    }
    function addSheet(params) {
        GM_addStyle(GM_getResourceText("css"));
        GM_addStyle(GM_getResourceText("theme"));
        GM_addStyle(
            `
    ::-webkit-scrollbar {
        width: 3px;
        height: 6px;
    }
    ::-webkit-scrollbar-track {
        border-radius: 3px;
        background: #c678dd57;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(0,0,0,0.12);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    }
            .CodeMirror  {
                width: 98%;
                margin: 1rem 0;
                padding: 1em 1em;
                border-radius: 0.2rem;
                border:none !important;
                max-height:200px;
                overflow: auto;
            }
            .CodeMirror:hover {
              box-shadow:2px 2px 9px 0px #1e3b50;
            }
            select {
              border: 1px solid #ccc;
              padding: 7px 0px;
              border-radius: 3px;
              padding-left: 5px;
              -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
              box-shadow: inset 0 1px 1px rgba(80, 69, 69, 0.075);
              -webkit-transition: border-color ease-in-out 0.15s,
                -webkit-box-shadow ease-in-out 0.15s;
              -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
              transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
            }
            button {
              display: inline-block;
              position: relative;
              cursor: pointer;
              padding: 7px 7px;
              color: white;
              font-size: 0.7em;
              text-align: center;
              text-decoration: none;
              vertical-align: middle;
              white-space: nowrap;
              outline: none;
              border: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              border-radius: 5px;
              background-color:#409eff;
            }
            button + button {
              margin-left: 5px;
            }
            button:hover {
              background-color:#66a9ef;
              text-decoration: none;
              box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.225);
            }
        `)
    }
    function dealRes(original) {
        function chunk(list, size = 2) {
            const result = [];
            for (let i = 0, len = list.length; i < len; i += size) {
                result.push(list.slice(i, i + size));
            }
            return result;
        }
        let str = original
            .replace(/[\n`-]/g, "")
            .split(" ")
            .join("");
        const list = [
            "**简要描述：**",
            "**请求URL：**",
            "**请求方式：**",
            "**参数：**",
            "**返回示例**",
            "**返回参数说明**",
            "**备注**",
        ];
        let res = [];

        list.forEach((item, index) => {
            const splitList = str.split(item);
            splitList[0] && res.push(splitList[0]);
            str = splitList[1];
        });

        const descriptionRaw = res[0];
        const urlRaw = res[1];
        const methodRaw = res[2].toLowerCase();
        const paramsOriginal = res[3]
            .replace(/[\n-:]/g, "")
            .split("|")
            .filter((item) => item);
        const paramsListRaw = chunk(paramsOriginal, 4);
        paramsListRaw.shift()
        return {
            descriptionRaw,
            urlRaw,
            methodRaw,
            paramsListRaw
        }

    }
    function readyAndWatch(func) {
        XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
            this.addEventListener('readystatechange', () => {
            }, false)

            if (url.includes('/api/page/info')) {
                func(url)

            }
            open.call(this, method, url, async, user, pass)
        }
    }
    function getJsonAsync(url) {
        return new Promise((resolve, reject) => {
            const formData = new FormData()

            let page_id = window.location.search.split('=')[1]
            if (!page_id) {
                const urlList = window.location.href.split('/')
                page_id = urlList[urlList.length - 1]
            }
            formData.append('page_id', page_id)
            formData.append('_item_pwd', null)
            const res = fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(res => {
                    return res.json()
                })
                .catch(e => {
                    reject(e)
                })
            res.then(res => {
                const totalRes = res
                resolve(totalRes)
            })
        })
    }
    function createCopyUrl() {
        if (!document.querySelector('.copy_url')) {
            const titleDom = document.querySelector('#doc-title')
            const button = document.createElement('button')
            button.innerHTML = '复制Url'
            button.classList.add('copy_url')
            titleDom.prepend(button)
        }
    }
    function createCopyFunc() {
        if (!document.querySelector('.copy_func')) {
            const titleDom = document.querySelector('#doc-title')
            const button = document.createElement('button')
            button.innerHTML = '复制请求函数'
            button.classList.add('copy_func')
            titleDom.prepend(button)
        }
    }

    function createCliDisplay() {
        if (!document.querySelector('#code')) {
            document.querySelector('#p-content').insertAdjacentHTML('afterbegin',
                `<textarea id='code' class='card'>剪贴板预览与编辑</textarea>`
            )
        }

    }
    function setClipboardDisplay(e) {
        const text = e.text
        codeMirrorInstance.setValue(js_beautify(text, opts))
    }
    function clipboard() {
        const clipboardUrl = new ClipboardJS('.copy_url', {
            text: function (trigger) {
                const url = info.urlRaw.replace(/(http:\/\/xx\.com\/)?/, "")
                const methodRaw = info.methodRaw
                const funcName = createFunName(url)
                const descriptionRaw = info.descriptionRaw
                const urlFinal = createUrlCode(descriptionRaw, funcName, methodRaw, url)
                return urlFinal
            }
        })
        const clipboardFunc = new ClipboardJS('.copy_func', {
            text: function (trigger) {
                const url = info.urlRaw.replace(/(http:\/\/xx\.com\/)?/, "")
                const funcName = createFunName(url)
                let asyncName = toHump(funcName)
                let funcCode = ''
                if (info.paramsListRaw.length > 0) {
                    let comment = info.paramsListRaw.reduce((acc, cur, index, list) => {
                        if (index === list.length - 1) {
                            acc = `${acc}${cur[0]}:''//${cur[2]} ${cur[3]}`
                        } else {
                            acc = `${acc}${cur[0]}:'',//${cur[2]} ${cur[3]}
                        `
                        }
                        return acc
                    }, '')
                    funcCode = `async ${asyncName}Async() {
                        let params = {
                            ${comment}
                        }
                        let res = await api.${funcName}(params)
                      },
                    `
                } else {
                    funcCode = `async ${asyncName}Async() {
                        let res = await api.${funcName}()
                      },
                    `
                }

                return js_beautify(funcCode, opts)
            }
        })
        clipboardUrl.on('success', (e) => {
            setClipboardDisplay(e)
        })
        clipboardFunc.on('success', (e) => {
            setClipboardDisplay(e)
        })
    }
    addSheet()
    async function init(url) {
        const res = await getJsonAsync(url)
        info = dealRes(res.data.page_content)
        createCliDisplay()
        createCopyUrl()
        createCopyFunc()
        // createCopyTs()
        clipboard()
        highlight()
        createCodeMirror()
    }
    readyAndWatch(init)
})(XMLHttpRequest.prototype.open);
