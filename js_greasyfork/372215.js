// ==UserScript==
// @name         Sibbay Github Quick Reply
// @namespace    https://github.com/sibbay-ai/public
// @version      0.13
// @description  小白社区开发者实用工具，快速在issue中插入申请开发/变更deadline等操作
// @author       github.com/Yidadaa
// @include      https://github.com*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/372215/Sibbay%20Github%20Quick%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/372215/Sibbay%20Github%20Quick%20Reply.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 由于github使用pjax加载页面，需要对github全站进行匹配，然后排除掉不需要运行脚本的页面

    let days = GM_getValue('days') || 14
    let size = GM_getValue('size') || 0.1

    // 工具函数
    const $$ = s => Array.from(document.querySelectorAll(s))
    const $ = s => document.querySelector(s)

    function tree2node (root) {
        // 生成dom节点
        const node = document.createElement(root.type)
        // 映射标签属性
        root.attrs && Object.keys(root.attrs).forEach(key => { node.setAttribute(key, root.attrs[key]) })
        // 映射节点属性
        root.props && Object.keys(root.props).forEach(key => { node[key] = root.props[key] })
        // 生成子节点
        root.children && root.children.forEach(child => { node.appendChild(tree2node(child)) })
        return node
    }

    // 检查是否已经标记过ddl
    const checkDDL = () => {
        return $$('.timeline-comment-group .edit-comment-hide').some(node => {
            return /申请开发\ deadline/.test(node.innerText)
        })
    }

    // 生成n天后的时间
    const nDaysLater = (n) => {
        const date = new Date()
        const nDaysLaterTime = new Date(date.getTime() + n * 24 * 3600 * 1000)
        return `${nDaysLaterTime.getFullYear()}-${nDaysLaterTime.getMonth() + 1}-${nDaysLaterTime.getDate()}`
    }

    // 生成模板
    const generateText = () => {
        const hasDDL = checkDDL()
        let text = `申请开发 deadline: ${nDaysLater(days)} size: ${size}`
        if (hasDDL) text = `变更 deadline: ${nDaysLater(days)}`
        return text
    }

    // 更新文字
    const updateText = () => {
        $('#sibbay-text').innerText = generateText()
        $('#sibbay-time').innerText = ` - will finish in ${days} days`
        $('#sibbay-size').innerText = ` - ${size} size`
    }

    // 确认提交文字
    const confirmText = () => {
        $('#new_comment_field').value = generateText()
        GM_setValue('days', days)
        GM_setValue('size', size)
    }

    const buttonWithMenu = {
        type: "span",
        attrs: {
            class: "js-pages-source select-menu js-menu-container js-select-menu js-transitionable",
            style: "float: right;"
        },
        children: [
            {
                type: "button",
                attrs: {
                    class: "btn mr-1 select-menu-button js-menu-target",
                    type: 'button',
                    'aria-haspopup': true,
                    'aria-expanded': false
                },
                children: [{
                    type: 'span',
                    attrs: {
                        class: 'js-select-button js-pages-source-btn-text',
                        style: 'margin-right: 5px;'
                    },
                    props: {
                        innerText: checkDDL() ? 'Change deadline' : 'Wanna develop'
                    }
                }]
            },
            {
                type: 'div',
                attrs: {
                    class: 'select-menu-modal-holder',
                    style: 'margin-top: 35px;'
                },
                children: [{
                    type: 'div',
                    attrs: {
                        class: 'select-menu-modal js-menu-content',
                        'aria-expanded': false
                    },
                    children: [{
                        type: 'div',
                        attrs: {
                            class: 'select-menu-list js-navigation-container',
                            role: 'menu'
                        },
                        children: [{
                            type: 'div',
                            attrs: {
                                class: 'select-menu-header js-navigation-enable'
                            },
                            children: [{
                                type: 'span',
                                props: { innerText: 'Select a time' }
                            }, {
                                type: 'span',
                                attrs: {
                                    id: 'sibbay-time'
                                },
                                props: {
                                    innerText: ` - will finish in ${days} days`
                                }
                            }]
                        }, {
                            type: 'div',
                            attrs: {
                                class: 'width-full',
                                style: 'padding: 10px;'
                            },
                            children: [{
                                type: 'input',
                                attrs: {
                                    class: 'width-full',
                                    type: 'range',
                                    min: '1',
                                    max: '30',
                                    value: days,
                                    style: 'cursor: pointer'
                                },
                                props: {
                                    oninput: e => {
                                        days = e.target.value
                                        updateText()
                                    }
                                }
                            }]
                        }, {
                            type: 'div',
                            attrs: {
                                class: 'select-menu-header js-navigation-enable',
                                style: `display: ${checkDDL() ? 'none' : 'block'}`
                            },
                            children: [{
                                type: 'span',
                                props: { innerText: 'Select a size' }
                            }, {
                                type: 'span',
                                attrs: {
                                    id: 'sibbay-size'
                                },
                                props: {
                                    innerText: ` - ${size} size`
                                }
                            }]
                        }, {
                            type: 'div',
                            attrs: {
                                class: 'width-full',
                                style: `padding: 10px; display: ${checkDDL() ? 'none' : 'block'}`
                            },
                            children: [{
                                type: 'input',
                                attrs: {
                                    class: 'width-full',
                                    type: 'range',
                                    min: '0.1',
                                    max: '3',
                                    step: '0.1',
                                    value: size,
                                    style: 'cursor: pointer'
                                },
                                props: {
                                    oninput: e => {
                                        size = e.target.value
                                        updateText()
                                    }
                                }
                            }]
                        }, {
                            type: 'div',
                            attrs: {
                                style: 'padding: 10px; border-top: 1px solid #eee; display: flex; align-items: center;'
                            },
                            children: [{
                                type: 'div',
                                attrs: {
                                    class: 'width-full',
                                    id: 'sibbay-text',
                                    style: 'font-weight: bold;'
                                },
                                props: {
                                    innerText: generateText()
                                }
                            }, {
                                type: 'div',
                                attrs: {
                                    class: 'btn btn-sm btn-primary js-menu-close'
                                },
                                props: {
                                    innerText: 'OK',
                                    onclick: confirmText
                                }
                            }]
                        }]
                    }]
                }]
            }
        ]
    }


    let applyBtn = tree2node(buttonWithMenu)
    const appendBtn = () => {
        if (!location.href.includes('sibbay-ai')) return
        const buttons = document.getElementById('partial-new-comment-form-actions')
        if (!buttons) {
            return
        }
        buttons.appendChild(applyBtn)
    }

    document.addEventListener('pjax:complete', appendBtn)
    appendBtn()
})();