// ==UserScript==
// @name         全地形独轮车
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在任何平台刷评论，刷弹幕
// @author       Shanmite
// @include      /^https?:\/\/.*/
// @require      https://code.jquery.com/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428135/%E5%85%A8%E5%9C%B0%E5%BD%A2%E7%8B%AC%E8%BD%AE%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/428135/%E5%85%A8%E5%9C%B0%E5%BD%A2%E7%8B%AC%E8%BD%AE%E8%BD%A6.meta.js
// ==/UserScript==

(function () {
    let loop = -1;
    function createCompleteElement(StructInfo) {
        const { tagname, attr, script, text, children } = StructInfo;
        let frg = document.createDocumentFragment();
        let el = typeof tagname === 'string' ?
            document.createElement(tagname) : document.createDocumentFragment();
        if (typeof text === 'string' && text !== '') el.innerHTML = text;
        if (typeof attr === 'object') Object.entries(attr).forEach(
            ([key, value]) => { el.setAttribute(key, value) }
        );
        if (typeof script === 'function') script(el);
        if (children instanceof Array) children.forEach(
            child => { if (child instanceof DocumentFragment) el.appendChild(child) }
        );
        frg.appendChild(el);
        return frg;
    }

    function start(obj) {
        if (Object.entries(obj).every(([_, v]) => v)) {
            const input_box = $(obj.input)[0];

            const enter_box = $(obj.enter)[0];

            if (input_box && enter_box) {
                const evt = new InputEvent('input', {
                    inputType: 'insertText',
                    data: obj.msg,
                    dataTransfer: null,
                    isComposing: false
                });

                loop = setInterval(() => {
                    input_box.value = obj.msg.value;
                    input_box.dispatchEvent(evt);
                    enter_box.click();
                    --obj.times || clearInterval(loop);
                }, Number(obj.wait))
            } else {
                alert('未找到指定元素, 请检查填入的CSS选择器是否正确')
            }
        } else {
            alert('请填入所有选项')
        }
    }

    document.body.appendChild(
        createCompleteElement({
            tagname: 'form',
            attr: {
                style: 'position: fixed; z-index: 99999; bottom: 0px; left: 0px; border: 2px dashed;',
                id: '_dulunche_option_'
            },
            children: [
                createCompleteElement({
                    tagname: 'input',
                    attr: {
                        type: 'text',
                        name: 'input_sele',
                        placeholder: '输入框CSS选择器'
                    }
                }),
                createCompleteElement({
                    tagname: 'input',
                    attr: {
                        type: 'text',
                        name: 'enter_sele',
                        placeholder: '确定按钮CSS选择器'
                    }
                }),
                createCompleteElement({
                    tagname: 'input',
                    attr: {
                        type: 'text',
                        name: 'msg',
                        placeholder: '待发送消息'
                    },
                }),
                createCompleteElement({
                    tagname: 'input',
                    attr: {
                        type: 'text',
                        name: 'wait',
                        placeholder: '停顿时间(毫秒)'
                    }
                }),
                createCompleteElement({
                    tagname: 'input',
                    attr: {
                        type: 'text',
                        name: 'times',
                        placeholder: '发送次数'
                    },
                }),
                createCompleteElement({
                    tagname: 'button',
                    attr: {
                        type: 'button'
                    },
                    text: '开始',
                    script: el => {
                        el.addEventListener('click', () => {
                            const dulunche_option = $('#_dulunche_option_')[0];
                            start({
                                /* 输入框 */
                                input: dulunche_option.input_sele.value,

                                /* 确定按钮 */
                                enter: dulunche_option.enter_sele.value,

                                /* 待发送消息 */
                                msg: dulunche_option.msg,

                                /* 停顿时间 */
                                wait: dulunche_option.wait.value,

                                /* 发送次数 */
                                times: dulunche_option.times.value
                            })
                        })
                    }
                }),
                createCompleteElement({
                    tagname: 'button',
                    attr: {
                        type: 'button'
                    },
                    text: '停止',
                    script: el => {
                        el.addEventListener('click', () => {
                            loop > 0 && clearInterval(loop);
                        })
                    }
                }),
            ]
        })
    )
})()