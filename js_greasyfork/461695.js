// ==UserScript==
// @name        Theresmore自动点击工具
// @namespace   Theresmore自动点击工具
// @match       https://theresmoregame.g8hh.com/
// @grant       none
// @version     1.1
// @author      zty
// @description 解放你的双手自动自动点击工具
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461695/Theresmore%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/461695/Theresmore%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
; (function () {
    const timeout = 1000 * 10 // 10秒点一次
    const minFood = 2 // 食物最小值

    let blackList = initBlackList() // 部分只能建造一个的建筑需要跳过
    const houseList = ['房屋', '市政厅', '宅邸', '住宅区', '发展部', '定居点大厅'] // 会减少食物的建筑
    function initBlackList() {
        return ['雕像', '心灵神殿', '战争神殿', '月明之夜', '光荣退休']
    }
    var css = `
      #auto_update_btn {
        position: fixed;
        right: 0;
        bottom: 64px;
        background: #1d1e20;
        border-radius: 50%;
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 14px;
        border: 2px solid white;
        z-index: 100;
        color: white;
        cursor: pointer;
      }
    `
    /*添加样式*/
    function addStyle(css) {
        if (!css) return
        var head = document.querySelector('head')
        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = css
        head.appendChild(style)
    }

    /*生成自动升级建筑的按钮*/
    function createBtn() {
        var btn = document.createElement('div')
        btn.title = '开'
        var span = document.createElement('span')
        span.innerText = '开'
        btn.appendChild(span)
        btn.id = 'auto_update_btn'
        document.body.appendChild(btn)

        /*初始化事件*/
        // 点击按钮启动定时器
        btn.addEventListener('click', function () {
            toggleBtnStatus()
            toggleBtnText()
        })
    }

    // 切换文字
    function toggleBtnText() {
        const node = document.querySelector('#auto_update_btn')
        const text = node.innerText
        node.innerText = text === '开' ? '关' : '开'
    }


    // 自动升级建筑
    function autoBuild() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        const tabNode = tabListNode.childNodes[0]
        const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
        if (!flag) {
            console.log('没找到容器，即将切换到“建造”页')
            // 自动切换到建造tab页
            tabNode && tabNode.click()
        } else {
            const id = tabNode.getAttribute('aria-controls')
            const containerNode = document.getElementById(id)
            const list = containerNode.querySelectorAll(`button.btn`)
            const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
            let isAllUpdatedInThisTab = false
            // judgeFood() // 食物小于${minFood}时不建造房屋
            for (const [i, node] of list.entries()) {
                let hasClick = false
                if (
                    !node.classList.value.includes('btn-off') &&
                    !blackList.some((word) => node.textContent.includes(word))
                ) {
                    console.log(`${new Date().toLocaleString()}建造：`, node.textContent)
                    node.click()
                    hasClick = true
                    return true
                }
                isAllUpdatedInThisTab = i === list.length - 1 && !hasClick
            }
            return false
            // console.log('当前页是否全部升级：', isAllUpdatedInThisTab)
            // if (isAllUpdatedInThisTab && subTabNodes) {
            //     // 如果当前页全部升级了，切换到另一个建筑页,按顺序往后切换，如果当前是最后一个tab，则切换回第一个tab
            //     const currentSubTab = subTabNodes.querySelector(
            //         `button[aria-selected=true]`
            //     ) // 当前选中的子tab页
            //     const nextTab = currentSubTab.nextElementSibling
            //     if (nextTab) {
            //         console.log(`切换到${nextTab.textContent}`)
            //         nextTab.click()
            //     } else {
            //         const target = subTabNodes.childNodes[0]
            //         console.log(`切换到${target.textContent}`)
            //         target.click()
            //     }
            // }
        }
    }

    // 自动研究
    function autoResearch() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        const tabNode = tabListNode.childNodes[1]


        const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
        if (!flag) {
            console.log('没找到容器，即将切换到“研究”页')
            tabNode && tabNode.click()
        } else {
            const id = tabNode.getAttribute('aria-controls')
            const containerNode = document.getElementById(id)
            const list = containerNode.querySelectorAll(`button.btn`)
            const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
            let isAllUpdatedInThisTab = false
            for (const [i, node] of list.entries()) {
                let hasClick = false
                if (
                    !node.classList.value.includes('btn-off') &&
                    !blackList.some((word) => node.textContent.includes(word))
                ) {
                    console.log(`${new Date().toLocaleString()}研究：`, node.textContent)
                    node.click()
                    hasClick = true
                    return true
                }
                isAllUpdatedInThisTab = i === list.length - 1 && !hasClick
            }

        }
        return false
    }

    // 自动调整工人
    function autoTuneWorker() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        const tabNode = tabListNode.childNodes[2]

        var list = document.querySelector('table').querySelectorAll('tr')
        var rscRatioMap = new Map();

        for (var node of list) {
            var name = node.childNodes[0].innerText
            var dataStrs = node.childNodes[1].innerText.split('/')
            var cur = Number(dataStrs[0].replace(',', ''))
            var cap = Number(dataStrs[1].replace(',', ''))
            var ratio = cur / cap
            rscRatioMap.set(name, ratio)
            // console.log('资源情况：', name, ratio)
        }
        // avoid humen resource occupied by professor.
        rscRatioMap.set('研究点', 1)

        const id = tabNode.getAttribute('aria-controls')
        const containerNode = document.getElementById(id)
        list = containerNode.querySelectorAll(`div.sub-container div.p-4`)
        var maxIdx = 0
        var maxVal = 0
        var minIdx = 0
        var minVal = 1
        for (const [i, node] of list.entries()) {
            var div1 = node.querySelector('div.flex-1')
            name = div1.querySelector('h5').innerText

            var rscNameTds = div1.querySelectorAll('td.text-left')
            var rscSpeedTds = div1.querySelectorAll('td.text-right')
            var minRatio = 1
            for (let index = 0; index < rscNameTds.length; index++) {
                var rscName = rscNameTds[index].innerText
                var rscSpeed = rscSpeedTds[index].innerText
                if (rscSpeed.includes('-')) {
                    continue
                }
                var ratio = rscRatioMap.get(rscName) || 0
                if (ratio < minRatio) {
                    minRatio = ratio
                }

            }

            dataStrs = node.querySelector('div.relative input').getAttribute('value').split('/')
            cur = Number(dataStrs[0].trim())
            cap = Number(dataStrs[1].trim())

            var maxPermit = name == '农民' ? judgeFood() : true
            // var minPermit = name == '农民' ? !judgeFood() : true

            if (minRatio > maxVal && cur > 0 && maxPermit) {
                maxIdx = i
                maxVal = minRatio
            }
            if (minRatio < minVal && cur < cap) {
                minIdx = i
                minVal = minRatio
            }
        }
        // ensure food wont run out.
        if (rscRatioMap.get('食物') < 0.2) {
            minIdx = 0
        }

        node = list[maxIdx]
        name = node.querySelector('div.flex-1').querySelector('h5').innerText
        var lessBtn = node.querySelector('div.relative').querySelectorAll('button.rounded-none')[0]

        lessBtn.click()
        console.log('减少人力：', name)

        node = list[minIdx]
        name = node.querySelector('div.flex-1').querySelector('h5').innerText
        var moreBtn = node.querySelector('div.relative').querySelectorAll('button.rounded-none')[1]
        setTimeout(() => {
            console.log('增加人力1：', name)
            moreBtn.click()
        }, 500)
        setTimeout(() => {
            console.log('增加人力2：', name)
            moreBtn.click()
        }, 1000)
        return true
    }


    // 自动祈祷
    function autoMagic() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        const tabNode = tabListNode.childNodes[3]


        var flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
        if (!flag) {
            console.log('没找到容器，即将切换到“魔法”页')
            tabNode && tabNode.click()
        } else {
            const id = tabNode.getAttribute('aria-controls')
            const containerNode = document.getElementById(id)
            const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
            const prayNode = subTabNodes.childNodes[1]
            flag = prayNode && prayNode.getAttribute('aria-selected') === 'true'
            if (!flag) {
                prayNode && prayNode.click()
                return
            }

            const list = containerNode.querySelectorAll(`button.btn`)
            let isAllUpdatedInThisTab = false
            for (const [i, node] of list.entries()) {
                let hasClick = false
                if (
                    !node.classList.value.includes('btn-off') &&
                    !blackList.some((word) => node.textContent.includes(word))
                ) {
                    console.log(`${new Date().toLocaleString()}祈祷：`, node.textContent)
                    node.click()
                    hasClick = true
                    return true
                }
                isAllUpdatedInThisTab = i === list.length - 1 && !hasClick
            }

        }
        return false
    }


    let buildingInterval = null
    let mode = 0
    let maxMode = 3
    let checkTime = 0


    function checkTab() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        if (tabListNode.childNodes.length <= mode) {
            mode = 0
            return false
        }
        if (maxMode == 3 && tabListNode.childNodes.length >= 6) {
            // open autoMagic
            maxMode = 4
        }
        const tabNode = tabListNode.childNodes[mode]

        const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
        if (!flag && checkTime < 12) {
            console.log('需要切换到tab：' + mode)
            checkTime += 1
            return true
        }
        checkTime = 0
        return false
    }

    function switchTab() {
        const tabListNode = document
            .querySelector('#main-tabs')
            .querySelector(`div[role=tablist]`)
        if (tabListNode.childNodes.length <= mode) {
            mode = 0
            return false
        }
        const tabNode = tabListNode.childNodes[mode]

        const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
        if (!flag) {
            console.log('切换到tab：' + mode)
            tabNode && tabNode.click()
        }
    }

    let modeMaxSkipTimes = new Map()
    let modeSkipTimes = new Map()

    function autoHelpler() {
        closeDialog()
        if (checkTab()) return
        let rst = false
        switch (mode) {
            case 0:
                rst = autoBuild()
                break;
            case 1:
                rst = autoResearch()
                break;
            case 2:
                rst = autoTuneWorker()
                break;
            case 3:
                rst = autoMagic()
                break;
            default:
                break;
        }

        var maxSkipTime = modeMaxSkipTimes.get(mode) || 0
        if (rst) {
            modeMaxSkipTimes.set(mode, Math.max(0, maxSkipTime - 1))
        } else {
            modeMaxSkipTimes.set(mode, Math.min(10, maxSkipTime + 1))
            console.log('设置模式跳过', mode, modeMaxSkipTimes.get(mode))
        }

        setTimeout(() => {
            if (checkTab()) return
            while (true) {
                mode += 1
                mode %= maxMode
                var maxSkipTime = modeMaxSkipTimes.get(mode) || 0
                var skipTime = modeSkipTimes.get(mode) || 0
                if (skipTime < maxSkipTime) {
                    modeSkipTimes.set(mode, skipTime + 1)
                } else {
                    modeSkipTimes.set(mode, 0)
                    break
                }
            }
            switchTab()
        }, timeout / 2);
    }

    // 开启自动升级建筑定时器
    function handleAutoUpdateStart() {
        buildingInterval = setInterval(autoHelpler, timeout)
    }
    // 清除自动升级建筑定时器
    function handleAutoUpdateClear() {
        buildingInterval = clearInterval(buildingInterval)
    }
    // 切换自动升级建筑定时器状态
    function toggleBtnStatus() {
        if (buildingInterval) {
            console.log('~~~~关闭定时器~~~~')
            handleAutoUpdateClear()
        } else {
            console.log('~~~~开启定时器~~~~')
            handleAutoUpdateStart()
        }
    }
    // 判断食物数量
    // function judgeFood() {
    //   var list = document.querySelector('table').querySelectorAll('tr')
    //     for (var node of list) {
    //         if (!node.innerText.includes('食物')) continue
    //         // 获取食物速度
    //         var val = Number(node.childNodes[2].innerText.split('/')[0])
    //         if (val < minFood) {
    //         blackList.push(...houseList)
    //         } else {
    //         blackList = initBlackList()
    //         }
    //     }
    // }

    function judgeFood() {
        var list = document.querySelector('table').querySelectorAll('tr')
        for (var node of list) {
            if (!node.innerText.includes('食物')) continue
            // 获取食物速度
            var val = Number(node.childNodes[2].innerText.split('/')[0])
            return val > minFood
        }
    }

    // 关闭dialog
    function closeDialog() {
        const dialogNode = document.querySelector('#headlessui-portal-root')
        dialogNode && dialogNode.querySelector('.sr-only').parentNode.click()
    }

    createBtn()
    addStyle(css)
})()
