// ==UserScript==
// @name         RDC晨会用户故事看板提效
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  用于晨会看板提效，不定期更新新功能，诶嘿~
// @author       袁龙辉
// @match        https://rdcloud.zte.com.cn/*
// @match        https://studio.zte.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAbCAYAAACJISRoAAAABHNCSVQICAgIfAhkiAAAAQtJREFUSInt1c1Kw0AUhuFTF8kFTJnAFFwKYrHQUjE0Fq2iOxG8Bn/vQ8SbEMX+oLhQ9+raXom9g0lI8roQBDdmFi0q5FsOfOdZDIdTAZAZZ27WQImUyC8ju3v7Ug1q0tva+fZ+dn4h1aAmYacreZ7/PISCPL+8orRBacPbeAyAtZaFxTpKG27v7otGUIgAbGxuo7Th4OgEgMFwhNKGVjskTdPpIA+PTyhtCMw875MJ671PtD8YudTdkCzLWFmNUNpweHyK0oZGs02SJNNDAG76w6+/UdpweXXtWnVH4jim3mihtGFpuYm11hlx3hPP86S7FomISNQJxfd91+ofWcZ/g1SgPL8lUiIF+QCIeCJE+P0wYgAAAABJRU5ErkJggg==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492624/RDC%E6%99%A8%E4%BC%9A%E7%94%A8%E6%88%B7%E6%95%85%E4%BA%8B%E7%9C%8B%E6%9D%BF%E6%8F%90%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/492624/RDC%E6%99%A8%E4%BC%9A%E7%94%A8%E6%88%B7%E6%95%85%E4%BA%8B%E7%9C%8B%E6%9D%BF%E6%8F%90%E6%95%88.meta.js
// ==/UserScript==

; (function () {
    // !!! 支持预设姓名，设置之后面板内肯定会有这些姓名。不设置就按照滚动加载获取到的来展示
    var nameList = []
    var selectedNums = []
    GM_addStyle(
        `.xPanel-btn {
            border-width: 0;
            margin: 5px;
            padding: 6px;
            background-color: #eee;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
            border-radius: 5px;
            max-width: 180px
        }
        .xPanel-btn:hover {
            background-color: #8de8cb;
        }
        .xPanel-item {
            display: block;
            position: absolute;
            top: 4px;
            z-index: 2000;
            padding: 2px;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0.7;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            transition: box-shadow 0.3s ease-in-out;
            border-radius: 5px;
        }
        #operationPanel .xPanel-btn {
            padding: 2px 6px;
        }
        #operationPanel {
            display: flex;
            align-items: center;
        }
        .xPanel-item:hover {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        }`
    );

    window.onpopstate = function () {
        main()
    };

    // 入口函数
    function main() {
        var regex = /wim\/board/;
        if (regex.test(location.href)) {
            addObserver()
            let debounceTimer;
            // 添加键盘监听，如果是键盘右键则触发随机一位，需要做一下防抖处理
            document.addEventListener('keydown', function (event) {
                console.log('===>', event.key)
                if (event.key === 'ArrowRight') {
                    event.preventDefault()
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(randomSelect, 300);
                }
            })
            return
        }
        var xPanels = Array.from(document.getElementsByClassName('xPanel-item'))
        xPanels.forEach(item => {
            item.parentNode.removeChild(item)
        })
        selectedNums = [];
    }
    main()

    // 创建监视器
    function addObserver() {
        var observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'DIV' && node.className === 'board-container') {
                            loadData()
                        }
                    }
                });
            });
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    // 加载数据
    var tempNameList = [...nameList]
    function loadData() {
        var boardContainer = document.querySelector('.board-container')
        boardContainer.scrollTop = 0
        // 记录滚动的次数
        var i = 1
        function scroll() {
            if (Math.ceil(boardContainer.scrollTop + boardContainer.clientHeight) + 5 >= boardContainer.scrollHeight) {
                clearInterval(interval)
                // 回到顶部
                boardContainer.scrollTop -= 200 * i
                // 获取姓名并初始化面板
                var cards = document.querySelectorAll('div.card.myCard .over-hidden')
                var uniqueNames = new Set(nameList.concat(Array.from(cards).map(item => item.textContent)))
                tempNameList = Array.from(uniqueNames)
                initPanel(tempNameList)
            } else {
                i++
                boardContainer.scrollTop += 200
            }
        }
        var interval = setInterval(scroll, 0)
    }

    // 初始化面板
    function initPanel(nameData) {
        if (document.querySelector('#operationPanel')) {
            var xPanels = Array.from(document.getElementsByClassName('xPanel-item'))
            xPanels.forEach(item => {
                item.parentNode.removeChild(item)
            })
        }
        var names = nameData.map(name => (
            {
                text: name,
                onclick: () => selectPerson(name)
            }
        ))
        var operations = [
            {
                text: '随机一位',
                size: 'large',
                onclick: () => randomSelect()
            },
            {
                text: '清除选择',
                onclick: () => clear()
            },
            {
                text: '加载数据',
                onclick: () => loadData()
            },
            {
                text: '收起姓名',
                id: 'hideNameBtn',
                onclick: () => setNamePanelVisible()
            }
        ]
        var operationPanel = document.createElement('span')
        var namePanel = document.createElement('div')

        operationPanel.className = 'xPanel-item'
        operationPanel.id = 'operationPanel'
        namePanel.className = 'xPanel-item'
        namePanel.id = 'namePanel'

        namePanel.style.top = '52px'
        namePanel.style.width = '1150px'
        document.body.appendChild(operationPanel)
        document.body.appendChild(namePanel)
        operations.forEach(item => {
            createBtn(item, operationPanel)
        })
        names.forEach(item => {
            createBtn(item, namePanel)
        })
    }

    // 随机一位
    function randomSelect() {
        if (tempNameList.length <= 0) return
        if (selectedNums.length == tempNameList.length) {
            selectedNums = []
        }
        let num = 0
        do {
            num = Math.floor(Math.random() * tempNameList.length)
        } while (selectedNums.includes(num))
        selectedNums.push(num)
        setRandomBtnText(tempNameList[num])
        selectPerson(tempNameList[num])
    }

    // 清空选择
    function clear() {
        setRandomBtnText('')
        var cards = document.querySelectorAll('div.card.myCard')
        cards.forEach(item => {
            item.style.display = 'block'
        })
    }

    // 控制姓名面板显示隐藏
    function setNamePanelVisible() {
        const namePanel = document.getElementById('namePanel')
        const hideNameBtn = document.getElementById('hideNameBtn')
        if (namePanel.style.display === 'block' || namePanel.style.display === '') {
            namePanel.style.display = 'none'
            hideNameBtn.innerHTML = '展示姓名'
        } else {
            namePanel.style.display = 'block'
            hideNameBtn.innerHTML = '收起姓名'
        }
    }

    // 设置随机按钮的内容
    function setRandomBtnText(name) {
        var operationPanel = document.getElementById('operationPanel');
        var buttons = operationPanel.getElementsByTagName('button');
        buttons[0].innerText = name ? `随机-当前:${name.replace(/\d/g, '')}` : '随机一位';
    }

    // 选人
    function selectPerson(name) {
        setRandomBtnText(name)
        var cards = document.querySelectorAll('div.card.myCard')
        cards.forEach(item => {
            item.style.display = item.textContent.includes(name) ? 'block' : 'none'
        })
        var boardContainer = document.querySelector('.board-container')
        boardContainer.scrollTop = 0
    }

    // 生成按钮
    function createBtn(button, parent) {
        var btn = document.createElement('button')
        if (button.size === 'large') {
            btn.style.fontSize = '20px'
        }
        if (button.id) {
            btn.id = button.id
        }
        btn.className = 'xPanel-btn'
        btn.innerText = button.text
        btn.onclick = button.onclick
        parent.appendChild(btn)
        btn.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.9)'
            this.style.backgroundColor = '#007BFF'
        })
        btn.addEventListener('mouseup', function () {
            this.style.transform = ''
            this.style.backgroundColor = ''
        })
    }
})()