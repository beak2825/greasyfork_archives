// ==UserScript==
// @name         TheresMore 页游自动点击、加速、军队强化
// @version      0.81
// @description  加速 TheresMore, 自动点击列表功能, 军队强化功能
// @author       Maggot Huangyichun
// @match        https://theresmoregame.g8hh.com/
// @license      MIT
// @run-at       document-start
// @namespace http://www.huangyichun.com
// @downloadURL https://update.greasyfork.org/scripts/462444/TheresMore%20%E9%A1%B5%E6%B8%B8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%81%E5%8A%A0%E9%80%9F%E3%80%81%E5%86%9B%E9%98%9F%E5%BC%BA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/462444/TheresMore%20%E9%A1%B5%E6%B8%B8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E3%80%81%E5%8A%A0%E9%80%9F%E3%80%81%E5%86%9B%E9%98%9F%E5%BC%BA%E5%8C%96.meta.js
// ==/UserScript==






/**  样式定义开始  **/
var speedCss = `
#auto_update_btn{
    bottom: 64px;
    background: #1d1e20;
    border-radius: 50%;
    height: 32px;
    width: 32px;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 2px solid white;
    color: white;
    cursor: pointer;
}

#speed_on_btn{
    bottom: 64px;
    background: #1d1e20;
    border-radius: 50%;
    height: 32px;
    width: 32px;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 2px solid white;
    color: white;
    cursor: pointer;
}

#Huangyichun{
    position: fixed;
    right: 0;
    bottom: 64px;
    background: #1d1e20;
    border-radius: 10%;
    height: 320px;
    width: 32px;
    text-align: center;
    font-size: 11px;
    border: 2px solid white;
    z-index: 100;
    color: white;
    cursor: pointer;
}
`

/* 添加所有样式 */
function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head')
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
}


/* 生成按钮集合 */
let fatherDiv
function createFatherDiv(){
    fatherDiv = document.createElement('div')
    fatherDiv.id = 'Huangyichun'
    document.body.appendChild(fatherDiv)
}

function createBtn(btnId, openString, closeString, toggleBtnFunction) {
    var btn = document.createElement('div')
    btn.title = openString
    var span = document.createElement('span')
    span.innerText = openString
    btn.appendChild(span)
    btn.id = btnId

    // 统一添加到一起
    fatherDiv.appendChild(btn)

    /*初始化事件*/
    btn.addEventListener('click', function () {
        // 各种定时器适配
        toggleBtnFunction(btnId, openString, closeString)
    })
}


/* 按钮文字切换 */
function toggleBtnText(btnId, changeString) {
    const node = document.querySelector('#'+btnId)
    const text = node.innerText
    node.innerText = changeString
}


/* 功能开始 */
/* 代替游戏中的 timer, 替换为我们加速后的 Timer */

// 自定义倍速，可自行修改，默认10倍速，与电脑性能匹配，请在页面开启高性能模式。
// 电脑ok的比如E15，开600都ok，但超过60已经失去游戏乐趣，推荐最高30。
const 超级加速等级 = 10;
let game
// let older_timer = timer
let older_game = game
let older_window_game = window.game
var speedIsOn = false
var firstSpeedChanger = true
function SpeedChanger(btnId, openString, closeString){
    if (firstSpeedChanger) {
        firstSpeedChanger = false
        performance.older_performance_now = performance.now
    }

    if (!speedIsOn){
        performance.now = () => {
            return performance.older_performance_now() * 超级加速等级
        }
        let timer = setInterval(() => {
            if (document.querySelector("#main-tabs")) {
                clearInterval(timer)
                game = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore
                window.game = game
            }
        }, 100)
        speedIsOn = true
        toggleBtnText(btnId, closeString)
    } else{
        // 平滑
        let disTime = performance.now() - performance.older_performance_now()
        performance.now = () => {
            return performance.older_performance_now() + disTime
        }
        window.game = older_window_game
        let timer = setInterval(() => {
            if (document.querySelector("#main-tabs")) {
                clearInterval(timer)
                game = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore
                window.game = game
            }
        }, 100)
        speedIsOn = false
        toggleBtnText(btnId, openString)
    }
}



/* 军队无敌 */
let armyChangerIsOn = false
let 是否开启军队加速 = true
let 是否开启进攻失败不损失部队 = true
//let older_armyStore_waitTime = game.ArmyStore.waitTime
//let older_game_armyStore_destroyArmy = game.ArmyStore.destroyArmy
function armyChanger(btnId, openString, closeString) {

        if (是否开启军队加速) {
            game.ArmyStore.waitTime /= 超级加速等级
        }
        if (是否开启进攻失败不损失部队) {
            game.ArmyStore.realDestroyArmy = game.ArmyStore.destroyArmy
            game.ArmyStore.destroyArmy = function (...args) {
                if (!(args[2] == 'army' && args[3] != !0)) {
                    return this.realDestroyArmy(...args)
                }
            }
        }
        armyChangerIsOn = true
        toggleBtnText(btnId, openString)
//            if (armyChangerIsOn){
//                game.ArmyStore.waitTime = older_armyStore_waitTime
//                game.ArmyStore.destroyArmy = older_game_armyStore_destroyArmy
//            } else{
//    }
}


/* 自动升级 */
let autoUpdate = false
let autoUpdateTimer
var blackList = getListOfOnce()
const 自动升级间隔 = 1000 * 2
// 食物最小值 小于这个值的时候不会建造减少粮食的东西
const 最小食物增长 = 5

const houseList = ['房屋', '市政厅', '宅邸', '住宅区', '发展部', '定居点大厅'] // 会减少食物的建筑
function getListOfOnce() {
    return ['雕像', '神殿']
}
function autoUpdateChanger(btnId, openString, closeString){
    if(autoUpdate){
        console.log('关闭自动升级')
        clearInterval(autoUpdateTimer)
        autoUpdate = false
        toggleBtnText(btnId, openString)
    }else{
        console.log('开启自动升级')
        autoUpdateTimer = setInterval(autoClickBuilding, 自动升级间隔)
        autoUpdate = true
        toggleBtnText(btnId, closeString)
    }
}

function autoClickBuilding() {
    closeDialog()
    const tabListNode = document
      .querySelector('#main-tabs')
      .querySelector(`div[role=tablist]`)
    const tabNode = tabListNode.childNodes[0]
    const flag = tabNode && tabNode.getAttribute('aria-selected') === 'true'
    if (!flag) {
      console.log('需要切换到建筑页面')
      // 自动切换到建造tab页
      tabNode && tabNode.click()
    } else {
      const id = tabNode.getAttribute('aria-controls')
      const containerNode = document.getElementById(id)
      const list = containerNode.querySelectorAll(`button.btn`)
      const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
      let isAllUpdatedInThisTab = false
      // 食物小于${minFood}时不建造房屋
      judgeFood()
      console.log('正在寻找可升级建筑')
      for (const [i, node] of list.entries()) {
        let hasClick = false
        if (
          !node.classList.value.includes('btn-off') &&
          !blackList.some((word) => node.textContent.includes(word))
        ) {
          console.log(`${new Date().toLocaleString()} 升级: `, node.textContent , ' , MaggotScheduler running.')
          node.click()
          hasClick = true
          break
        }
        isAllUpdatedInThisTab = i === list.length - 1 && !hasClick
      }

      console.log(isAllUpdatedInThisTab ? '当前页已经全部升级' : '当前页还有可升级' , ' , MaggotScheduler running.')
      if (isAllUpdatedInThisTab && subTabNodes) {
        // 如果当前页全部升级了，尝试切换到下一个 tab 页， 如果存在的话
        const currentSubTab = subTabNodes.querySelector(
          `button[aria-selected=true]`
        ) // 当前选中的子tab页
        const nextTab = currentSubTab.nextElementSibling
        if (nextTab) {
          console.log(`切换到${nextTab.textContent}`)
          nextTab.click()
        } else {
          const target = subTabNodes.childNodes[0]
          console.log(`切换到${target.textContent}`)
          target.click()
        }
      }
    }
}

function closeDialog() {
    const dialogNode = document.querySelector('#headlessui-portal-root')
    dialogNode && dialogNode.querySelector('.sr-only').parentNode.click()
}

/* 食物判断 */
function judgeFood() {
    var list = document.querySelector('table').querySelectorAll('tr')
    for (var node of list) {
        if (!node.innerText.includes('食物')) continue
        var val = Number(node.childNodes[2].innerText.split('/')[0])
        if (val < 最小食物增长) {
            blackList.push(...houseList)
        } else {
            blackList = getListOfOnce()
        }
    }
}

/* main run */
function maggotSchedulerMain(){
    createFatherDiv()
    createBtn("auto_update_btn", "打开自动升级", "关闭自动升级", autoUpdateChanger)
    createBtn("speed_on_btn", "打开资源加速", "关闭资源加速", SpeedChanger)
    createBtn("army_on_btn", "打开军队强化", "关闭军队强化", armyChanger)
}


maggotSchedulerMain()
