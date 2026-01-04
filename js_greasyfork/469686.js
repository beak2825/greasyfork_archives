// ==UserScript==
// @name         RAP2 Simple Ts
// @namespace    *://rap2.taobao.org/*
// @version      0.2
// @description  rap2 接口文档一键复制属性列表为 ts 类型标注
// @author       Cleves
// @match        *://rap2.taobao.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469686/RAP2%20Simple%20Ts.user.js
// @updateURL https://update.greasyfork.org/scripts/469686/RAP2%20Simple%20Ts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urls = new URL(location.href);
    const itf = urls.searchParams.get('itf');

    let requestTSTemplate = '';
    let responseTSTemplate = '';


    /** copy text */
    const copyTextToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    const addCopyClickEvent = () => {
        const handleCopyRequestTSTemplate = () => {
            copyTextToClipboard(requestTSTemplate);
            alert('复制成功')
        }
        const handleCopyResponseTSTemplate = () => {
            copyTextToClipboard(responseTSTemplate);
            alert('复制成功')
        }

        document.querySelector('.copy-requestTSTemplate').addEventListener('click', handleCopyRequestTSTemplate)
        document.querySelector('.copy-responseTSTemplate').addEventListener('click', handleCopyResponseTSTemplate)
    }

    const appendCopyBtn = () => {
        const copyBtn = (className) => {
            return `<span class="copy-link edit ${className}"><svg class="MuiSvgIcon-root-237 MuiSvgIcon-fontSizeSmall-244" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 7H8v14h11v-9h-5z" opacity=".3"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zm4 16H8V7h6v5h5v9z"></path></svg></span>`
        }

        document.querySelectorAll('.PropertyList .header.clearfix .title').forEach((elm, idx) => {
            elm.innerHTML += copyBtn(idx === 0 ? 'copy-requestTSTemplate' : 'copy-responseTSTemplate');
        })

        addCopyClickEvent()
    }

    const watchTitleElm = () => {
        const copyBtnWrap = document.querySelectorAll('.PropertyList .header.clearfix .title');
        if (!copyBtnWrap.length) {
            setTimeout(watchTitleElm, 1000)
        } else {
            // show copy btn
            appendCopyBtn()
        }
    }

    watchTitleElm()


    const fetchData = async () => {
        return fetch(`http://rap2api.taobao.org/interface/get?id=${itf}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "proxy-connection": "keep-alive"
            },
            "referrer": "http://rap2.taobao.org/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('请求失败');
        });
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }



    /** data to ts-template */
    const templateFactory = (propsData, name = 'Data') => {
        if (propsData?.length) {
            let t = `export interface ${capitalizeFirstLetter(name)} {\n`;
            const childT = []
            const complex = ['Object', 'Array']

            propsData.forEach((item) => {
                const type = complex.includes(item.type) ? capitalizeFirstLetter(item.name) : item.type.toLowerCase()

                t += item.description ? `\t/** ${item.description} */\n` : ''
                t += `\t${item.name}${item.required ? '?' : ''}: ${type}\n`

                if (complex.includes(item.type)) {
                    childT.push(templateFactory(item.children, item.name))
                }
            })
            t += '}\n'

            return `${t}\n${childT.join('\n\n')}`
            // return (t += childT.join('\n\n'))
        }

        return ''
    }



    fetchData().then((res) => {
        const data = res.data;

        requestTSTemplate = templateFactory(data.requestProperties, 'Request');
        responseTSTemplate = templateFactory(data.responseProperties, 'Respones');
    })


})();