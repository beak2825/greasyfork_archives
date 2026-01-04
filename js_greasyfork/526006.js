// ==UserScript==
// @name         AT&CF Problems Note
// @namespace    https://github.com/yxz2333
// @version      1.1.0
// @description  在 kenkoooo.com 和 cf.kira924age.com 表格网站添加题目笔记
// @author       Lynia
// @match        *://kenkoooo.com/atcoder/*
// @match        *://cf.kira924age.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// @resource     bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526006/ATCF%20Problems%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/526006/ATCF%20Problems%20Note.meta.js
// ==/UserScript==

// 导入 bootstrapCSS
GM_addStyle(GM_getResourceText("bootstrapCSS"))

const BODY = document.querySelector('body')


/**
 * @namespace Lynia
 * @description 主命名空间
 */
const Lynia = {}


/**
 * @namespace state
 * @description 状态信息
 */
Lynia.state = {
    /** @type {boolean} 当前 url 是否为 AtCoder Problem */
    isAtCoder: window.location.href.includes('kenkoooo.com/atcoder'),
    /** @type {boolean} 当前 url 是否为 Codeforces Problem */
    isCodeforces: window.location.href.includes('cf.kira924age.com/#/table/')
}

/**
 * @namespace element
 * @description 要全局用到的元素
 */
Lynia.element = {
    /** @type {HTMLElement} Body */
    body: undefined,

    /** @description 弹出框 */
    dialog: new class {
        /** @type {HTMLDivElement} 弹出框本身 */
        modal = undefined
        /** @type {HTMLDivElement} 装文字的元素 */
        text = undefined
        /** @type {HTMLDivElement} 包裹题目难度圆和题目链接的 div */
        problemCell = undefined
        /** @type {HTMLAnchorElement} 题目链接元素 */
        problemLink = undefined
        /** @type {Boolean} 是否在笔记编辑状态 */
        isEditing = false


        // ------------------------------
        // 一些有的没的子节点
        /** @type {HTMLDivElement} Dialog */
        #modalDialog = undefined
        /** @type {HTMLDivElement} Content */
        #modalContent = undefined
        /** @type {HTMLDivElement} Header */
        #modalHeader = undefined
        /** @type {HTMLDivElement} Body */
        #modalBody = undefined
        /** @type {HTMLDivElement} Footer */
        #modalFooter = undefined

        /** @type {HTMLElement} 位于 Header 的关闭按钮 */
        #close1 = undefined
        /** @type {HTMLElement} 位于 Footer 的关闭按钮 */
        #close2 = undefined
        /** @type {HTMLElement} 位于 Footer 的编辑按钮 */
        #edit = undefined
        /** @type {HTMLElement} 位于 Body 的文字输入框的 div */
        #textareaDiv = undefined
        /** @type {HTMLTextAreaElement} 文字输入框 textareaDiv 内的实际输入框*/
        #textarea = undefined
        /** @type {HTMLLabelElement} 文字输入框 textareaDiv 内的标签 */
        #label = undefined
        // ------------------------------


        /** @method 退出编辑状态 */
        endEditing() {
            this.isEditing = false
            if (this.#modalBody.contains(this.#textareaDiv)) this.#modalBody.removeChild(this.#textareaDiv)
            if (!this.#modalBody.contains(this.text)) this.#modalBody.appendChild(this.text)
            this.#edit.textContent = "编辑"
            this.#close2.textContent = "关闭"
            this.#close2.setAttribute("data-bs-dismiss", "modal")
            this.#close2.removeEventListener("click", this.endEditing)

            // 读取笔记
            const localValue = GM_getValue(`${this.problemLink.href}`, null)
            if (localValue) {
                this.text.innerHTML = localValue
                this.problemCell.style.setProperty("background-color", "rgba(236, 240, 5, 0.7)", "important")
            }
            else {
                this.text.innerHTML = "本题尚无笔记"
                this.problemCell.style.removeProperty("background-color")
            }
        }

        init() {
            // modal 主体结构
            this.modal = document.createElement('div')
            this.#modalDialog = document.createElement("div")
            this.#modalContent = document.createElement('div')
            this.#modalHeader = document.createElement('div')
            this.#modalBody = document.createElement('div')
            this.#modalFooter = document.createElement('div')

            Lynia.element.body.appendChild(this.modal) // 挂载到 body 下
            this.modal.appendChild(this.#modalDialog)
            this.#modalDialog.appendChild(this.#modalContent)
            this.#modalContent.appendChild(this.#modalHeader)
            this.#modalContent.appendChild(this.#modalBody)
            this.#modalContent.appendChild(this.#modalFooter)

            this.modal.id = "dialog"
            this.modal.classList.add("modal", "fade")
            this.#modalDialog.classList.add("modal-dialog", "modal-dialog-centered", "modal-dialog-scrollable", "modal-xl")
            this.#modalContent.classList.add('modal-content')
            this.#modalHeader.classList.add('modal-header')
            this.#modalBody.classList.add('modal-body')
            this.#modalFooter.classList.add('modal-footer')

            // problemLink 题目链接
            this.problemLink = document.createElement('a')
            this.problemLink.id = "problemLink"
            this.problemLink.style.fontSize = "26px"
            this.problemLink.style.fontWeight = "bold"

            // Header 的关闭按钮
            this.#close1 = document.createElement('button')
            this.#close1.type = "button"
            this.#close1.classList.add("btn-close")
            this.#close1.setAttribute("data-bs-dismiss", "modal")
            this.#close1.setAttribute("aria-label", "Close")

            // text 文本
            this.text = document.createElement('div')
            this.text.id = "text"

            // Footer 的关闭按钮
            this.#close2 = document.createElement('button')
            this.#close2.type = "button"
            this.#close2.textContent = "关闭"
            this.#close2.classList.add("btn", "btn-secondary")
            this.#close2.setAttribute("data-bs-dismiss", "modal")

            // Footer 的编辑按钮
            this.#edit = document.createElement('button')
            this.#edit.type = "button"
            this.#edit.textContent = "编辑"
            this.#edit.classList.add("btn", "btn-primary")

            // textarea 文字输入框 内包裹 textarea 和 label
            this.#textareaDiv = document.createElement("div")
            this.#textareaDiv.classList.add("form-floating")

            // textarea
            this.#textarea = document.createElement("textarea")
            this.#textarea.classList.add("form-control")
            this.#textarea.style.height = "500px"
            this.#textarea.id = "textarea"
            this.#textareaDiv.appendChild(this.#textarea)

            // label 标签
            this.#label = document.createElement("label")
            this.#label.setAttribute("for", "textarea")
            this.#label.textContent = "笔记"
            this.#textareaDiv.appendChild(this.#label)

            // 创建的子节点绑定到对应 modal 结构
            this.#modalHeader.appendChild(this.problemLink)
            this.#modalHeader.appendChild(this.#close1)
            this.#modalBody.appendChild(this.text)
            this.#modalFooter.appendChild(this.#close2)
            this.#modalFooter.appendChild(this.#edit)

            // edit 绑定点击事件
            this.#edit.addEventListener("click", () => {
                this.isEditing = !this.isEditing

                if (this.isEditing) {
                    // 进入编辑模式

                    // 读取笔记
                    const localValue = GM_getValue(`${this.problemLink.href}`, null)
                    if (localValue) this.#textarea.value = Lynia.toolMethod.InnerHTMLToString(localValue)
                    else this.#textarea.value = ''

                    this.#modalBody.removeChild(this.text)
                    this.#modalBody.appendChild(this.#textareaDiv)

                    this.#edit.textContent = "保存"
                    this.#close2.textContent = "取消"

                    this.#close2.removeAttribute("data-bs-dismiss")
                    this.#close2.addEventListener("click", this.endEditing.bind(this))

                } else {
                    // 退出编辑模式

                    // 保存当前笔记
                    GM_setValue(`${this.problemLink.href}`, Lynia.toolMethod.StringToInnerHTML(this.#textarea.value))

                    this.endEditing.bind(this)()
                }
            })
        }
    },

    init() {
        this.body = document.querySelector('body')
        this.dialog.init()
    },
}


/**
 * @namespace observer
 * @description 监听器
 */
Lynia.observer = {

    tab: {
        /**
         * @type {MutationObserver}
         * @description 表格种类切换选项监听器，监听当前 table 种类，tab 更新时重新遍历新的表格元素
         */
        observer: undefined,
        init() {
            try {
                let targetElement = null
                if (Lynia.state.isAtCoder) targetElement = document.querySelector(".table-tab")
                else if (Lynia.state.isCodeforces) targetElement = document.querySelector("#radio-buttons")
                else throw new Error("url错误")

                if (targetElement === null) throw new Error("找不到表格选项")

                this.observer = new MutationObserver(() => {
                    handleTableProblems()
                })
                this.observer.observe(targetElement, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    },

    page: {
        /**
         * @type {MutationObserver}
         * @description 表格页码切换监听器，监听当前 table 页码，tab 更新时重新遍历新的表格元素
         */
        observer: undefined,
        init() {
            try {
                let targetElement = null
                if (Lynia.state.isAtCoder) return
                else if (Lynia.state.isCodeforces) targetElement = document.querySelector(".ant-table-pagination")
                else throw new Error("url错误")

                if (targetElement === null) throw new Error("找不到表格选项")

                this.observer = new MutationObserver(() => {
                    handleTableProblems()
                })
                this.observer.observe(targetElement, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                })
            } catch (error) {
                console.log(error.message)
            }
        }
    },

    init() {
        this.tab.init()
        this.page.init()
    }
}

/**
 * @namespace toolMethod
 * @description 工具函数
 */
Lynia.toolMethod = {
    /** @method 正常字符串转InnerHTML @param {String} text */
    StringToInnerHTML(text) { return text.replaceAll("\n", '<br>') },

    /** @method InnerHTML转正常字符串 @param {String} text */
    InnerHTMLToString(text) { return text.replaceAll('<br>', "\n") }
}


/** @method handleTableProblems 处理表格里的问题单元格 */
const handleTableProblems = () => {
    // 找出所有表格元素
    let tableProblemElements
    if (Lynia.state.isAtCoder) tableProblemElements = document.querySelectorAll(".table-problem")
    else if (Lynia.state.isCodeforces) tableProblemElements = document.querySelectorAll(".cell-element")
    else return

    tableProblemElements.forEach(
        (element) => {
            if (!(element instanceof HTMLElement)) return

            // 找到表格里的 难度圆 和 题目链接
            let circle, link
            if (Lynia.state.isAtCoder) circle = element.querySelector('.difficulty-circle')
            else circle = element.querySelector('.common-difficulty-circle')
            link = element.querySelector('a')

            if (circle && link) {
                circle.setAttribute("data-bs-toggle", "modal")
                circle.setAttribute("data-bs-target", "#dialog")
                circle.addEventListener("click", () => {
                    // 更新当前 click 的 cell 
                    Lynia.element.dialog.problemCell = element

                    // 更新当前 click 的 cell 的链接元素
                    for (let attr of link.attributes)
                        Lynia.element.dialog.problemLink.setAttribute(attr.name, attr.value)
                    Lynia.element.dialog.problemLink.textContent = link.textContent

                    // dialog 退出 edit 状态
                    Lynia.element.dialog.endEditing()
                })

                // 如果本题存在笔记，表格染色
                const localValue = GM_getValue(`${link.href}`, null)
                if (localValue) element.style.setProperty("background-color", "rgba(236, 240, 5, 0.7)", "important")
                else element.style.removeProperty("background-color")
            }
        }
    )
}


/** @method main 主函数 */
function main() {
    handleTableProblems()
}

// ------------------------------
// 脚本加载入口
setTimeout(() => {
    Lynia.element.init()
    Lynia.observer.init()
    main()
}, 2000)
// ------------------------------