// ==UserScript==
// @name         宿房网后台新闻编辑器功能增强
// @license      GPL-3.0 License
// @namespace    https://github.com/QIUZAIYOU/0557FDC-EditorEnhanced
// @version      0.35
// @description  宿房网后台新闻编辑器功能增强,自动优化标题及描述,扩展排版功能
// @author       QIAN
// @match        https://www.0557fdc.com/admin/*
// @icon         https://www.0557fdc.com/admin/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470182/%E5%AE%BF%E6%88%BF%E7%BD%91%E5%90%8E%E5%8F%B0%E6%96%B0%E9%97%BB%E7%BC%96%E8%BE%91%E5%99%A8%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/470182/%E5%AE%BF%E6%88%BF%E7%BD%91%E5%90%8E%E5%8F%B0%E6%96%B0%E9%97%BB%E7%BC%96%E8%BE%91%E5%99%A8%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict'
    // 选择要观察的节点
    const callback = (mutationsList, observer) => {
        const isAdded = (() => {
            let flag = false
            return () => {
                if (flag) return true
                flag = true
                return false
            }
        })()
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const {
                    addedNodes
                } = mutation
                for (let node of addedNodes) {
                    if (node.classList && node.classList.contains('tox-dialog-wrap') && !isAdded()) {
                        const title = document.querySelector('.tox-dialog__title')
                        if (title.textContent === '源代码') formatNewsContentSetting()
                    }
                    if (node.classList && node.classList.contains('tox-tinymce') && !isAdded()) {
                        const newsSaveButton = getButtonByText('.el-dialog', '.el-button', 'span', '保存')
                        const newsSubmitButton = getButtonByText('.el-dialog', '.el-button', 'span', '提交')
                        if (newsSaveButton) {
                            newsSaveButton.addEventListener('click', () => {
                                formatNewsInformation('#formContainer')
                            }, true)
                        }
                        if (newsSubmitButton) {
                            newsSubmitButton.addEventListener('click', () => {
                                formatNewsInformation('#formContainer')
                            }, true)
                        }
                    }
                }
            }
        }
    }
    const targetNode = document.body
    const observer = new MutationObserver(callback)
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    })
    // 工具类函数

    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea')
        textArea.innerHTML = text
        return textArea.value
    }

    function htmlDecode(input) {
        var doc = new DOMParser().parseFromString(input, "text/html")
        return doc.documentElement.textContent
    }

    function createVirtualElement(dom) {
        const tempElement = document.createElement('div')
        tempElement.innerHTML = dom
        return tempElement
    }

    function setInputValue(element, value) {
        const focus = new Event('focus', { bubbles: false, cancelable: true })
        const input = new Event('input', { bubbles: false, cancelable: true })
        const blur = new Event('blur', { bubbles: false, cancelable: true })
        element.value = value;
        element.dispatchEvent(focus);
        element.dispatchEvent(input);
        element.dispatchEvent(blur);
    }

    function htmlToNode(htmlString) {
        const tempElement = document.createElement('div')
        tempElement.innerHTML = htmlString.trim()
        return tempElement
    }

    function appendHTMLString(parentSelector, htmlString) {
        const parentDom = document.querySelector(parentSelector)
        if (parentDom ?? false) {
            const tempElement = document.createElement('div')
            tempElement.innerHTML = htmlString.trim()
            const node = tempElement.firstChild
            parentDom.appendChild(node)
        }
    }

    function appendNewElement(nodeName, attrsOptions, style, parentSelector) {
        const newElement = document.createElement(nodeName)
        if (attrsOptions.id) newElement.id = attrsOptions.id
        if (attrsOptions.class) newElement.classList.add(attrsOptions.class)
        newElement.style = style
        document.querySelector(parentSelector).appendChild(newElement)
    }

    function getButtonByText(parentSelector, selfSelector, childSelector, text) {
        const parentDom = document.querySelector(parentSelector)
        const allButtons = parentDom.querySelectorAll(selfSelector)
        let targetButton
        allButtons.forEach(button => {
            const childButtons = button.querySelectorAll(childSelector)
            childButtons.forEach(child => {
                const childText = child.textContent.trim()
                if (childText === text) {
                    targetButton = button
                    return
                }
            })
        })
        return targetButton || null
    }

    function createButton(id, label, title, svgContent, viewBox = '0 0 1024 1024', width = 24, height = 24, style = '') {
        return `<button id="${id}" class="tox-tbtn" aria-label="${label}" title="${title}" type="button" tabindex="-1" aria-disabled="false" style="${style}">
      <span class="tox-icon tox-tbtn__icon-wrap">
        <svg class="icon" viewBox="${viewBox}" width="${width}" height="${height}">
          ${svgContent}
        </svg>
      </span>
    </button>`
    }

    function replaceMultiple(str, options) {
        let result = str
        const {
            regexp,
            replacements
        } = options
        for (const i in regexp) {
            result = result.replace(regexp[i], replacements[i])
        }
        return result
    }

    function convertStringToArrayAndRemoveDuplicates(str, addonStr) {
        const replaceRegexp = {
            regexp: [/\s+/g, /\s|，|、/g],
            replacements: [' ', ',']
        }
        const fullStr = `${replaceMultiple(str, replaceRegexp)}${str ? ',' : ''}${addonStr}`
        const arr = fullStr.replace(/,+/g, ',').split(',')
        const uniqueSet = new Set(arr)
        const newStr = Array.from(uniqueSet).join(',')
        return newStr
    }

    function executeFunctionsSequentially(functions, input) {
        if (Array.isArray(functions)) {
            if (functions.length === 0) {
                return input // 返回最后一个函数的结果
            } else {
                const currentFn = functions[0]
                const remainingFns = functions.slice(1)
                const output = currentFn(input)
                return executeFunctionsSequentially(remainingFns, output) // 递归调用下一个函数
            }
        } else {
            return functions(input)
        }
    }

    function addEventListenerToButton(buttonId, handlerFunctionList, newsTextarea) {
        const button = document.getElementById(buttonId)
        button.addEventListener('click', () => {
            const domElement = htmlToNode(newsTextarea.value)
            const result = executeFunctionsSequentially(handlerFunctionList, domElement)
            newsTextarea.value = result.innerHTML
        })
    }

    function appendCustomButton(button, buttonId, handlerFunctionList, newsTextarea, parentSelector = '#customButtonsWrapper') {
        appendHTMLString(parentSelector, button)
        addEventListenerToButton(buttonId, handlerFunctionList, newsTextarea)
    }

    function hasAnyClass(element, classes) {
        return Array.from(element.classList).some(className => classes.includes(className));
    }
    // 执行类函数
    const inlineElement = ['SPAN', 'STRONG', 'EM']

    function formatNewsContentSetting() {
        const editor_iframe = document.querySelector('.tox-edit-area>iframe').contentWindow.document.querySelector('#tinymce')
        const newsTextarea = document.querySelector('.tox-form textarea.tox-textarea')
        let newsHTML = newsTextarea.value
        const virtualElement = createVirtualElement(newsHTML)
        const clearedHtml = removeAllIdAndClassAndDataAttrs(virtualElement)
        newsTextarea.value = clearedHtml.innerHTML
        const uniformParagraphSpacingButton = createButton('uniformParagraphSpacingButton', '统一段间距', '统一段间距(15px)', '<path fill="#222f3e" d="M871.32 559.104c35.674 0 64.594 28.71 64.594 64.138v248.534c0 35.422-28.92 64.138-64.595 64.138H152.681c-35.675 0-64.595-28.716-64.595-64.138V623.242c0-35.427 28.92-64.138 64.595-64.138h718.638zm3.638 60.95H154.58V869.42h720.378V620.054zm-523.66 72.038a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29zm160.702 0a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29zm160.702 0a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29zM871.319 88.086c35.675 0 64.595 28.942 64.595 64.65v258.598c0 35.703-28.92 64.65-64.595 64.65H152.681c-35.675 0-64.595-28.947-64.595-64.65V152.736c0-35.708 28.92-64.65 64.595-64.65h718.638zm3.64 60.956H154.58v260.442h720.378V149.042zm-523.66 77.576a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29zm160.701 0a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29zm160.702 0a52.642 52.642 0 1 1 0 105.29 52.642 52.642 0 0 1 0-105.29z" data-spm-anchor-id="a313x.7781069.0.i13"/>', undefined, 24, 24, 'margin:0')
        const adjustLineHeightButton = createButton('adjustLineHeightButton', '调整行高', '调整行高(1.75)', '<path fill="#222f3e" d="M256 298.667v170.666h-85.333V298.667h-128L213.333 128 384 298.667H256zm213.39-128h426.667V256H469.39v-85.333zm426.667 298.666h-512v85.334h512v-85.334zM384 725.333H256V554.667h-85.333v170.666h-128L213.333 896 384 725.333zM469.39 768h426.667v85.333H469.39V768z" class="selected" data-spm-anchor-id="a313x.7781069.0.i14"/>')
        const removeBackgroundButton = createButton('removeBackgroundButton', '清除背景图片', '清除不显示的微信背景图片', '<path fill="#222f3e" d="M512 1023.998A511.999 511.999 0 0 1 312.61 41.08a511.999 511.999 0 0 1 398.78 942.84A508.993 508.993 0 0 1 512 1023.998zm0-943.842C273.535 80.156 80.157 274.536 80.157 512S273.535 943.842 512 943.842s431.843-193.378 431.843-431.843S749.463 80.156 512 80.156z"/><path fill="#222f3e" d="M320.627 743.45a40.078 40.078 0 0 1-28.055-68.132l381.745-381.745a40.384 40.384 0 0 1 57.111 57.111L349.683 731.427a40.078 40.078 0 0 1-29.056 12.024z"/><path fill="#222f3e" d="M702.371 743.45a40.078 40.078 0 0 1-28.054-12.023L292.572 349.682a40.384 40.384 0 0 1 57.111-57.111l380.743 382.747a40.078 40.078 0 0 1-28.055 68.133z"/>', undefined, 22, 22)
        const handleImageStyleButton = createButton('handleImageStyleButton', '图片处理', '图片处理(自动调整宽度750并居中，仅适用于简单排版)', '<path fill="#222f3e" d="M368 480c-62.4 0-112-49.6-112-112s49.6-112 112-112 112 49.6 112 112-49.6 112-112 112zm0-160c-27.2 0-48 20.8-48 48s20.8 48 48 48 48-20.8 48-48-20.8-48-48-48zm464 608H192c-52.8 0-96-43.2-96-96V192c0-52.8 43.2-96 96-96h640c52.8 0 96 43.2 96 96v640c0 52.8-43.2 96-96 96zM192 160c-17.6 0-32 14.4-32 32v640c0 17.6 14.4 32 32 32h640c17.6 0 32-14.4 32-32V192c0-17.6-14.4-32-32-32H192zm259.2 556.8c-25.6 0-51.2-11.2-70.4-30.4l-38.4-40c-12.8-12.8-33.6-12.8-46.4 0l-49.6 52.8c-12.8 12.8-32 12.8-44.8 1.6s-12.8-32-1.6-44.8l49.6-52.8c17.6-19.2 43.2-30.4 68.8-30.4s51.2 11.2 70.4 30.4l38.4 40c12.8 12.8 33.6 12.8 46.4 0l160-168c17.6-19.2 43.2-30.4 70.4-30.4s51.2 11.2 70.4 30.4L920 628.8c12.8 12.8 11.2 33.6-1.6 44.8-12.8 12.8-33.6 11.2-44.8-1.6L728 518.4c-12.8-12.8-33.6-12.8-46.4 0L521.6 688c-19.2 17.6-44.8 28.8-70.4 28.8z"/>')
        const addImageAlternativeDescriptionButton = createButton('addImageAlternativeDescriptionButton', '图片添加Alt', '图片添加Alt(如需自定义，先在编辑器里添加Alt后再使用此功能)', '<path d="M9 8.81a3.67 3.67 0 0 1-.15.63l-1.4 3.78h3.05L9.13 9.44A3.42 3.42 0 0 1 9 8.81z" fill="none"/><path d="M19.5 3.75h-15a.76.76 0 0 0-.75.75v15a.76.76 0 0 0 .75.75h15a.76.76 0 0 0 .75-.75v-15a.76.76 0 0 0-.75-.75zm-7.71 13l-.93-2.49H7.08l-.87 2.49h-1.3l3.46-9.1h1.26l3.45 9.08zm2.92 0h-1.15V7.13h1.15zm4.38-5.54h-1.62v3.54a1.55 1.55 0 0 0 .22.92.89.89 0 0 0 .72.27 1.14 1.14 0 0 0 .68-.21v.95a2.09 2.09 0 0 1-1 .21c-1.16 0-1.74-.65-1.74-1.93v-3.77h-1.13v-.94h1.11V8.69l1.14-.37v1.93h1.62z" fill="none"/><path d="M19.5 2.25h-15A2.25 2.25 0 0 0 2.25 4.5v15a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25zm.75 17.25a.76.76 0 0 1-.75.75h-15a.76.76 0 0 1-.75-.75v-15a.76.76 0 0 1 .75-.75h15a.76.76 0 0 1 .75.75z" fill="#222f3e"/><path d="M8.37 7.65l-3.46 9.08h1.3l.87-2.49h3.78l.93 2.49h1.29L9.63 7.65zm-.92 5.57l1.36-3.78A3.67 3.67 0 0 0 9 8.81a3.42 3.42 0 0 0 .14.63l1.37 3.78zM13.56 7.13h1.15v9.59h-1.15zM17.47 8.32l-1.14.37v1.56h-1.11v.94h1.11v3.75c0 1.28.58 1.93 1.74 1.93a2.09 2.09 0 0 0 1-.21v-.95a1.14 1.14 0 0 1-.68.21.89.89 0 0 1-.72-.27 1.55 1.55 0 0 1-.22-.92v-3.54h1.62v-.94h-1.6z" fill="#222f3e"/>', '0 0 24 24')
        const handelTableStyleButton = createButton('handelTableStyleButton', '处理表格', '处理表格(宽度自动100%，单元格添加5px内边距)', '<path fill="#222f3e" d="M959.825 384.002V191.94c0-70.692-57.308-128-128-128H191.94c-70.692 0-128 57.308-128 128v639.885c0 70.692 57.308 128 128 128h639.885c70.692 0 128-57.308 128-128V384.002zm-813.16-237.337a63.738 63.738 0 0 1 45.336-18.785H832a63.962 63.962 0 0 1 63.886 64.121v128.061H127.88v-128.06a63.738 63.738 0 0 1 18.785-45.337zm269.127 461.308v-223.97h192.181v223.97H415.792zm192.181 63.94v223.972H415.792V671.914h192.181zm-256.121-63.94H127.88v-223.97h223.972v223.97zM146.665 877.21a63.467 63.467 0 0 1-18.785-45.21V671.914h223.972v223.97h-159.85a63.626 63.626 0 0 1-45.337-18.675zm749.22-45.21a63.763 63.763 0 0 1-63.886 63.886H671.914V671.914h223.97v160.085zm0-224.026H671.914v-223.97h223.97v223.97z"/>', undefined, 22, 22)
        appendNewElement('div', {
            'id': 'customButtonsWrapper'
        }, 'display:flex;align-items:center;margin:0', '.tox-dialog__footer-start')
        appendCustomButton(uniformParagraphSpacingButton, 'uniformParagraphSpacingButton', [removeAllEmptyParagraphs, insertBlankElementBetweenPAndSection], newsTextarea)
        appendCustomButton(adjustLineHeightButton, 'adjustLineHeightButton', adjustLineHeight, newsTextarea)
        appendCustomButton(removeBackgroundButton, 'removeBackgroundButton', removeBackgroundImage, newsTextarea)
        appendCustomButton(handleImageStyleButton, 'handleImageStyleButton', handleImageStyleIssues, newsTextarea)
        appendCustomButton(addImageAlternativeDescriptionButton, 'addImageAlternativeDescriptionButton', addImageAlternativeDescription, newsTextarea)
        appendCustomButton(handelTableStyleButton, 'handelTableStyleButton', [handelTableStyleIssues, removeDuplicateTableWrappers], newsTextarea)
    }

    function formatNewsInformation(parentSelector) {
        const decodeWindowLocationHash = decodeURIComponent(window.location.hash)
        const parent = document.querySelector(parentSelector)
        const keywordsRegexp = /(\s|,|，|、)+(宿房网|宿州市)/g
        const PipeSymbolRegexp = /\s*\|\s*/g
        const moreBlankRegexp = /\s+/g
        const noneNecessarySymbol = /\s|，|、/g
        const titleReplaceRegexp = {
            regexp: [moreBlankRegexp, PipeSymbolRegexp],
            replacements: [' ', '丨']
        }
        const keywordsReplaceRegexp = {
            regexp: [moreBlankRegexp, keywordsRegexp, noneNecessarySymbol],
            replacements: [' ', '', ',']
        }
        const seoKeywordsReplaceRegexp = {
            regexp: [moreBlankRegexp, noneNecessarySymbol],
            replacements: [' ', ',']
        }
        const descriptionReplaceRegexp = {
            regexp: [moreBlankRegexp, PipeSymbolRegexp, keywordsRegexp],
            replacements: [' ', '丨', '']
        }

        function setSeoContent() {
            const year = parent.querySelector('div.el-date-editor.el-input.el-input--small.el-input--prefix.el-input--suffix.el-date-editor--datetime > input').value.trim().slice(0, 4)
            const seoTitle = parent.querySelector('[placeholder="请输入seo标题"]')
            setInputValue(seoTitle, replaceMultiple(seoTitle.value, titleReplaceRegexp))
            const seoKeywords = parent.querySelector('[placeholder="请输入seo关键词"]')
            setInputValue(seoKeywords, convertStringToArrayAndRemoveDuplicates(replaceMultiple(seoKeywords.value, seoKeywordsReplaceRegexp), `宿州市,宿房网,${year}宿州资讯,${year}宿州楼市资讯`))
            const seoDescription = parent.querySelector('[placeholder="请输入seo描述"]')
            setInputValue(seoDescription, replaceMultiple(decodeHTMLEntities(seoDescription.value), descriptionReplaceRegexp))
        }

        if (decodeWindowLocationHash === '#/conventional/news/list') {
            const title = parent.querySelector('[placeholder="请输入标题"]')
            setInputValue(title, replaceMultiple(title.value, titleReplaceRegexp))
            const keywords = parent.querySelector('[placeholder="请输入关键词"]')
            setInputValue(keywords, replaceMultiple(keywords.value, keywordsReplaceRegexp))
            const description = parent.querySelector('[placeholder="请输入摘要"]')
            setInputValue(description, replaceMultiple(decodeHTMLEntities(description.value), descriptionReplaceRegexp))
            setSeoContent()
            const numberInput = parent.querySelector('input.number-input[type="number"]')
            const editor_iframe = parent.querySelector('.tox-edit-area>iframe').contentWindow.document.querySelector('#tinymce')
            const thumb = parent.querySelector('.el-image__inner')

            if (!thumb && editor_iframe.innerHTML.includes('<img')) setInputValue(numberInput, 1)
            const yesButton = getButtonByText('.el-radio-group', '.el-radio', 'span', '是')
            yesButton.click()
        }

        if (decodeWindowLocationHash.includes('楼盘资讯')) {
            const activeTabText = document.querySelector('.list-container .list-tab .tab-item.actived>.tab-title').textContent
            const title = parent.querySelector('[placeholder="资讯标题, 预售许可证号, 工程进度, 交房日期在此处填写"]')
            setInputValue(title, replaceMultiple(title.value, titleReplaceRegexp))
            if (activeTabText === '楼盘动态') setSeoContent()
        }
    }



    function removeAllEmptyParagraphs(dom) {
        const cloneDom = dom.cloneNode(true)
        const elements = cloneDom.querySelectorAll('p,section,span,strong,em,td')
        const blackList = ['TD']
        if (elements.length > 0) {
            for (let currentElement of elements) {
                const currentElementHtml = currentElement.innerHTML
                currentElement.innerHTML = currentElementHtml.replace(/(&nbsp;)+/g, '').trim()
                if (!blackList.includes(currentElement.nodeName) && (currentElementHtml === '&nbsp;' || currentElementHtml === '<br>' || currentElementHtml === '')) {
                    currentElement.remove()
                }
            }
        }
        const blankElements = cloneDom.querySelectorAll('.use-for-blank')
        blankElements.forEach((blankElement) => {
            blankElement.remove()
        })
        return cloneDom
    }

    function removeBackgroundImage(dom) {
        const cloneDom = dom.cloneNode(true)
        const elements = cloneDom.querySelectorAll('*')
        for (let currentElement of elements) {
            if (currentElement.style.background) {
                const clearedBackground = currentElement.style.background.replace(/url\(.+?\)/g, '')
                currentElement.style.background = clearedBackground
            }
            if (currentElement.style.backgroundImage) {
                const clearedBackgroundImage = currentElement.style.backgroundImage.replace(/url\(.+?\)/g, '')
                currentElement.style.backgroundImage = clearedBackgroundImage
            }
        }
        return cloneDom
    }

    function adjustLineHeight(dom) {
        const clonedDom = dom.cloneNode(true)
        const elements = clonedDom.getElementsByTagName('*')
        for (let currentElement of elements) {
            if (!currentElement.className.includes('card_view')) {
                if (currentElement.childNodes.length === 1 && currentElement.childNodes[0].nodeType === Node.TEXT_NODE) {
                    currentElement.style.lineHeight = '1.75em'
                    if (inlineElement.includes(currentElement.nodeName)) currentElement.style.display = 'inherit'
                } else {
                    currentElement.style.lineHeight = ''
                    currentElement.style.textIndent = ''
                }
            }
        }
        return clonedDom
    }

    function insertBlankElementBetweenPAndSection(dom) {
        function isRootElement(element) {
            return element.parentNode === element.ownerDocument.documentElement
        }

        function isLastElement(element, parent) {
            return element === parent.lastElementChild
        }

        function createBlankElement() {
            const div = document.createElement('div')
            div.style.height = '15px'
            div.style.overflow = 'hidden'
            div.className = 'use-for-blank'
            div.innerHTML = ''
            return div
        }

        function removeDuplicateBlankElements(parent) {
            const elements = parent.querySelectorAll('div.use-for-blank')
            for (let div of elements) {
                if (div.previousElementSibling.classList.contains('use-for-blank')) {
                    parent.removeChild(div)
                }
            }
        }
        const cloneDom = dom.cloneNode(true)
        const elements = cloneDom.querySelectorAll('p, section,table')
        for (let currentElement of elements) {
            const parent = currentElement.parentNode
            if (!isRootElement(currentElement) && !isLastElement(currentElement, parent)) {
                const div = createBlankElement()
                parent.insertBefore(div, currentElement.nextSibling)
                // 移除相邻的重复元素
                removeDuplicateBlankElements(parent)
            }
        }
        return cloneDom
    }

    function removeAllIdAndClassAndDataAttrs(dom) {
        const cloneDom = dom.cloneNode(true)
        const elements = cloneDom.querySelectorAll('*')
        for (let currentElement of elements) {
            const clearedStyle = currentElement.style.cssText.replace(/ |!important/g, '')
            currentElement.style = clearedStyle
            if (!(currentElement.className.includes('use-for') || currentElement.className.includes('card_view'))) currentElement.removeAttribute('class')
            currentElement.removeAttribute('id')
            // 清除HTML元素上的所有data属性
            const dataAttrs = currentElement.dataset
            for (let prop in dataAttrs) {
                if (dataAttrs.hasOwnProperty(prop) && !prop.includes('mce')) {
                    // console.log(prop)
                    delete dataAttrs[prop]
                }
            }
        }
        return cloneDom
    }

    // function insertImgToAncestor(dom) {
    //     const clonedDom = dom.cloneNode(true)
    //     const targetDom = clonedDom.querySelectorAll('p,section')
    //     const imgElements = clonedDom.querySelectorAll('img:only-child')
    //     for (let element of imgElements) {
    //         const clonedImg = element.cloneNode(true)
    //         let parent = element.parentNode
    //         while (parent.nodeName !== 'BODY' && parent.children.length === 1) {
    //             element = parent
    //             parent = parent.parentNode
    //         }
    //         element.innerHTML = ''
    //         element.appendChild(clonedImg)
    //     }
    //     return clonedDom
    // }

    function handleImageStyleIssues(dom) {
        const targetWidth = 750
        const cloneDom = dom.cloneNode(true)
        const imgElements = cloneDom.querySelectorAll('img')
        // const getParentElement = (element) => {
        //     let parent = element.parentNode
        //     while (parent?.nodeName !== 'P') {
        //         parent = parent?.parentNode
        //         if (parent?.nodeName === 'P') {
        //             break
        //         }
        //     }
        //     return parent
        // }
        for (let currentImg of imgElements) {
            if (!currentImg.className.includes('card_view')) {
                // const currentImgParent = getParentElement(currentImg).
                const currentImgParent = currentImg.parentNode
                // console.log("🚀 ~ handleImageStyleIssues ~ currentImgParent:", currentImgParent)
                // 获取图片原始宽度
                const naturalWidth = currentImg.naturalWidth
                const styleWidth = currentImg.style.width.replace('px', '')
                // 若原始宽度大于750
                if (naturalWidth >= targetWidth || styleWidth >= targetWidth) {
                    // 如果是，则修改内联CSS的宽度为750px
                    currentImg.style.width = `${targetWidth}px`
                    currentImg.style.height = 'auto'
                } else {
                    // 如果不是，则修改内联CSS的宽度为呈现的宽度
                    currentImg.style.width = `${styleWidth}px`
                    currentImg.style.height = 'auto'
                }
                if (naturalWidth < targetWidth && styleWidth === '100%') {
                    currentImg.style.width = '100%'
                    currentImg.style.height = 'auto'
                }
                currentImg.style.display = ''
                currentImg.style.margin = ''
                currentImg.style.verticalAlign = 'middle'
                currentImgParent.style.textIndent = ''
                if (!inlineElement.includes(currentImgParent.nodeName)) currentImgParent.style.textAlign = 'center'
            }
        }
        return cloneDom
    }

    function addImageAlternativeDescription(dom) {
        const cloneDom = dom.cloneNode(true)
        const imgElements = cloneDom.querySelectorAll('img')
        let index = 0
        for (let currentImg of imgElements) {
            index += 1
            const currentImgParent = currentImg.parentElement
            let imgAlt = currentImg.alt
            const addonAlt = '宿房网出品,宿州楼市动态尽在掌握'
            currentImg.alt = imgAlt ? convertStringToArrayAndRemoveDuplicates(`新闻配图${index},${imgAlt}`, addonAlt) : convertStringToArrayAndRemoveDuplicates(`新闻配图${index}`, addonAlt)
        }
        return cloneDom
    }

    function handelTableStyleIssues(dom) {
        const cloneDom = dom.cloneNode(true)
        const tableElements = cloneDom.querySelectorAll('table')
        const tableReplaceRegexp = {
            regexp: [/(<table\b[^>]*>)/gi, /(<\/table>)/gi],
            replacements: ['<div class="use-for-table-wrapper" style="overflow:auto">$1', '$1</div>']
        }
        for (let currentTable of tableElements) {
            currentTable.style.width = ''
            // currentTable.style.userSelect = 'none';
            const tdElements = currentTable.querySelectorAll('td')
            for (let currentTd of tdElements) {
                currentTd.style.width = ''
                currentTd.width = ''
                currentTd.style.padding = '5px'
                currentTd.style.textAlign = 'center'
            }
            const spanElements = currentTable.querySelectorAll('span')
            for (let currentSpan of spanElements) {
                currentSpan.style.display = 'block'
            }
        }
        const cloneDomHTML = cloneDom.innerHTML
        cloneDom.innerHTML = replaceMultiple(cloneDomHTML, tableReplaceRegexp)
        return cloneDom
    }

    function removeDuplicateTableWrappers(dom) {
        const cloneDom = dom.cloneNode(true)
        const tempElement = document.createElement('div')
        tempElement.id = 'tempElement'
        tempElement.innerHTML = cloneDom.innerHTML
        const elements = tempElement.querySelectorAll('#tempElement>div.use-for-table-wrapper')
        for (const element of elements) {
            const cloneTable = element.querySelector('table').cloneNode(true)
            element.innerHTML = ''
            element.appendChild(cloneTable)
        }
        cloneDom.innerHTML = tempElement.innerHTML
        return cloneDom
    }
})()
