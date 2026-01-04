// ==UserScript==
// @name         web_highlight
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  选中高亮！
// @author       You
// @license      MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488080/web_highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/488080/web_highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // 在网页中注入自定义的 CSS 样式
    GM_addStyle(`
        .menu_dialog {
          width: 30px;
          height: 30px;
          border-radius: 5px;
          position: absolute;
          background-color: red;
          cursor: pointer;
          color: white;
        }
        .pale_card {
          position: absolute;
          background-color: white;
          border: 1px solid gray;
          padding: 5px;
        }
        .pale_highlight_color {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          cursor: pointer;
          margin-left: 3px;
          transition: width 0.3s, height 0.3s;
        }
        .pale_highlight_color:first-child {
          margin-left: 0;
        }
        .pale_highlight_color:hover {
          border: 2px solid;
        }
   `);

    const sites = {}
    const href = window.location.href;
    sites[href] = []
    let target = null // 选中的关键词的目标元素
    let currentKeyWord = '' // 当前选中的关键词
    let menuDom = null // 菜单图标元素

    const disabledTagNameList = ['INPUT', 'TEXTAREA', 'IMG'] // 禁用的标签
    const isBreakRow = true // 高亮单词是否与所在行断开，如果为否，选中单词会高亮整个元素(行)

    function findClosestChildWithKeyword(startingElement, keyword) {
        // 找到包含keyword的元素
        const queue = [startingElement];
        while (queue.length > 0) {
            const currentElement = queue.shift();
            if (currentElement.textContent.includes(keyword)) {
                return currentElement;
            }
            if (currentElement.children) {
                queue.push(...currentElement.children);
            }
        }
        return null; // 如果找不到含有关键词的子元素，则返回 null
    }

    function keyHighlight(key, color, keyTarget) {
        if (keyTarget) {
            // 根据元素查关键词
            if (!sites[href].includes(key)) {
                sites[href].push(key)
            }
        } else {
            // 根据关键词找到元素
            keyTarget = findClosestChildWithKeyword(key)
        }
        // 设置背景
        if (isBreakRow) {
            // 将自定义高亮元素替换调关键词
            const keyBackgroundSpan = document.createElement('span')
            keyBackgroundSpan.style.background = color
            keyBackgroundSpan.innerText = key
            const htmlString = keyBackgroundSpan.outerHTML
          console.log(htmlString, '====htmlString=======>')
            keyTarget.innerHTML = keyTarget.innerHTML.replace(key, htmlString)
        } else {
            key = keyTarget.innerText
            const keyBackgroundSpan = document.createElement('span')
            keyBackgroundSpan.style.background = color
            keyBackgroundSpan.innerText = key
            keyTarget.innerHTML = ''
            keyTarget.appendChild(keyBackgroundSpan)
        }
    }

    class ColorPale {
        // 参数
        colorList = ['#faa8a8', 'blue', 'green', 'yellow', 'orange']
        cardWidth = 20
        iconWidth = 30
        palePadding = 5
        colorMargin = 3

        // 以下参数仅供程序使用
        paleWidth = 0
        paleHeight = 0
        paleLeft = 0
        paleTop = 0
        pale = null
        isOnCard = false // 鼠标是否进入色卡

        initColorPale(menuDom) {
            this.paleWidth = this.colorList.length * this.cardWidth + this.palePadding * 2 + (this.colorList.length - 1) * this.colorMargin
            this.paleHeight = this.cardWidth + this.palePadding * 2
            this.paleLeft = parseInt(menuDom.style.left) - ((this.paleWidth - this.iconWidth) / 2)
            this.paleTop = parseInt(menuDom.style.top) + this.iconWidth

            this.pale = document.createElement('div')
            this.pale.className = 'pale_card'
            this.pale.style.width = this.paleWidth + 'px'
            this.pale.style.height = this.paleHeight + 'px'
            this.pale.style.left = this.paleLeft + 'px'
            this.pale.style.top = this.paleTop + 'px'
            this.pale.style.zIndex = '9999';
            this.pale.style.display = 'none' // 隐藏

            this.colorList.forEach(color => {
                const colorCard = document.createElement('div')
                colorCard.className = 'pale_highlight_color'
                colorCard.style.width = this.cardWidth + 'px'
                colorCard.style.height = this.cardWidth + 'px'
                colorCard.style.backgroundColor = color
                colorCard.style.zIndex = '9998';
                colorCard.addEventListener('click', (e) => {
                    keyHighlight(currentKeyWord, color, target)
                    e.stopPropagation();
                })
                colorCard.addEventListener('mouseup', (e) => {
                    // 阻止在设置色卡时触发清除函数
                    e.stopPropagation();
                })
                this.pale.appendChild(colorCard)
            })

            this.pale.addEventListener('mouseenter', (e) => {
                this.isOnCard = true
            })
            this.pale.addEventListener('mouseleave', (e) => {
                this.isOnCard = false
                this.closePale()
            })

            document.body.appendChild(this.pale)
            return Promise.resolve(this)
        }

        showPale(menuDom) {
            if (this.pale) {
                if (menuDom) {
                    this.paleLeft = parseInt(menuDom.style.left) - ((this.paleWidth - this.iconWidth) / 2)
                    this.paleTop = parseInt(menuDom.style.top) + this.iconWidth
                }
                this.pale.style.left = this.paleLeft + 'px'
                this.pale.style.top = this.paleTop + 'px'
                this.pale.style.display = 'flex'
                return Promise.resolve(this)
            } else if (menuDom) {
                return this.initColorPale(menuDom).then(Pale => {
                  Pale.pale.style.display = 'flex'
                  return Pale
                })
            }
        }

        closePale() {
            // 鼠标在色卡上不能关闭
            if (!this.isOnCard) {
                this.pale.style.display = 'none'
            }
        }
    }

    // 初始化
    const colorPale = new ColorPale

    // 滚动后重新加载高亮关键词
    window.addEventListener('scroll', highlight);

    let selectionTimeout;

    document.addEventListener('selectionchange', function() {
        // 移除之前添加的mouseup监听器
        document.removeEventListener('mouseup', handleMouseUp);

        // 添加新的mouseup监听器
        document.addEventListener('mouseup', handleMouseUp);
    });

    /**document.addEventListener('click', () => {
        // 监听选中消失的事件
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // 没有选中
            clearData()
        }
    })*/

    function handleMouseUp(event) {
        // 删除之前的数据
        clearData()
        const selection = window.getSelection();
        currentKeyWord = selection.toString()
        if (currentKeyWord.length > 0 && !disabledTagNameList.includes(event.target.tagName)) {
            // 用户选中了文本，可以在这里处理相应的逻辑
            target = event.target;
            console.dir(target, 'target');
            // 不处理特殊标签 input/textarea
            menuDom = document.createElement('div');
            menuDom.className = 'menu_dialog';
            menuDom.style.top = (event.clientY + 10) + 'px'
            menuDom.style.left = (event.clientX + 10) + 'px'
            menuDom.style.zIndex = '9999';
            menuDom.innerHTML = '色卡';

            menuDom.addEventListener('mouseup', (e) => {
                // 阻止在设置色卡时触发清除函数
                e.stopPropagation();
            })

            // colorPale.showPale(menuDom).then(pale => {
            menuDom.addEventListener('mouseenter', (e) => {
                console.log(e, '数据')
                colorPale.showPale(menuDom).then(pale => {
                    // 鼠标移出时删除菜单
                    const handleMouseLeave = () => {
                        setTimeout(() => {
                            pale.closePale();
                            menuDom.removeEventListener('mouseleave', handleMouseLeave);
                        }, 300)
                    };
                    menuDom.addEventListener('mouseleave', handleMouseLeave)
                })
            })
            document.body.appendChild(menuDom);
            // })
        }
    }

    function clearData() {
        target = null
        if (menuDom) {
            document.body.removeChild(menuDom)
            menuDom = null
        }
    }

    function highlight() {
      sites[href].forEach(keyword => {
        const { word, color } = keyword

      })
    }

    function getSelectionElement() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const startContainer = range.startContainer;
            const endContainer = range.endContainer;

            // 找到最接近的包含选中文本的父元素
            const closestParentElement = (startContainer.nodeType === 3) ? startContainer.parentNode : startContainer;
            // closestParentElement 就是包含选中文本的最接近的父元素
            return closestParentElement;
        }
    }
})();