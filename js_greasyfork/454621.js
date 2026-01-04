// ==UserScript==
// @name         继续解锁（Theres More）自定义倍速及暴露存储变量
// @version      1.1-Demo
// @description  通过劫持performance.now方法进行加速（动画会不流畅暂无改进方案）以及暴露存储变量到window.game【测试版，不保证无BUG】
// @author       DreamNya
// @match        https://theresmoregame.g8hh.com/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEcklEQVRYhb1XTYwURRT++lX17MzSM729NS7LQVmC0YQEEgT1oAfdmGiIYSPrwcSj6M1oAiYGD3oCE36ixsQTR2/8RLkYg2gIngRN5IAShYgQQbq2t5uJuztd9crLbDL09LDD7uq71ffe+76vKz2v33gYMIIgaAohpnyiZyHEFji3QRAFAGCZW/C8q7D255z5W2vtF61WKx6E11uqIAzDrVLKdz1glyCSg5BaZuOAE8aYD9M0/WlZBqIoConokAe8JoiWNNrHiHPAUWbemyRJOrCBMAy3+lIeF0QbliNcYuRqbsx02W30GAjDcNKX8qQgaqyGeJeJLDfmpTRNz/Q1EIbhNl/KM6stXjAxmabphUWMusQjX8pj3eKW+ZJlPmGZs+WIdXovLWKCqOFLeSwMw6jHgC/lYUE00U3igP2x1tOx1mPz7fZuy3yrQ96yzl00xpw1xpy1zl20zK1O7tZ8u7071nos1nraAfu7OQXRhC/l4cWzBwCNRmN7bWjoh+JTzLfb29I0/XHxHEVRmOf5ulardRkAF8opCIJHfN//q/uND8PwsWqlcqFQi7mFhcezLDsvAaDi+/vKrtE5J7rPHeLSnxMAbrVavyzFsRgdzV0EYBzAzrIiKeWmPmIDxz04dgIYJ9VoTAmiHpeO+box5tRKDRhjThnmP4u4IBKq0Zgi+P5kWeOCMe9nWTazUgNZls0YYz4oTfr+JHnA5iJumS0RHV+p+GIQ0XHLbIu4B2wmABM9HZ53o9/sXk4kSZLC826UpCZIENV6YOfaqyXexZkXIUFUo7JaOLf2PzAwVgaTtfZOERRC1AGUNiwzxjqcd4W19g7BuStlHaOjoy+slnpfLueukCPqGZMAQM7tATDQBrREyA5Xrz7RBfLy/HRZUki5RSl1cKXqSqmDQsotZTkvz097AOpNpW4KouGyIst8LNb6TQA371N7XVOpTwTRy314/4m1HhcA2tVa7UFBtB0AcmsPGmvfg3MbiWg9ed6mWq32VjA8vLlWrY7ISoUWFhZuAXAFThnV60+uqVZfXBME+4aHhz8TRD1DrsvA0bm5uRMeAERR9JAg+lUQVS2zc8zv6CT5tKnUWUH0RKHxZKz1dIkBrxlFJ4WUU0tdjWWet8yPJklyjQAgSZJr7NwBABBEnpTyUL1e35ob80rxQ2KZj5SIA4Azzh1ZShwA2LkDSZJcA+7eCaVS6jtJ9FRH6OtY6+fDMBwBMC2EWGuMOZ9l2TcAeuY6AARB8MCaWu3ve4kb5u+11s8AMEUDADDeVOqcINoIALm1b8/MzHw8yFMBQBiGI9VKJemXt8y/x1o/ja4XumctHxkZWS+FOC2IHgYA69w5Z+2Xhvm2lHJca/0RgPn7NWCZfzPWPjc7O/tHN176x6TRaIz6vv+5JOqZYPPtdpSm6ez9GDDMX+V5/mrZflH6McqybEZrvcMa87plvl1WM0hY5tga84bWesdKlptARdEepdTlplIxgKF71A41lYqVUpdVFO0FECxX9H+LfwHGrBkj33hKQAAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/454621/%E7%BB%A7%E7%BB%AD%E8%A7%A3%E9%94%81%EF%BC%88Theres%20More%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%8F%8A%E6%9A%B4%E9%9C%B2%E5%AD%98%E5%82%A8%E5%8F%98%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/454621/%E7%BB%A7%E7%BB%AD%E8%A7%A3%E9%94%81%EF%BC%88Theres%20More%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%8F%8A%E6%9A%B4%E9%9C%B2%E5%AD%98%E5%82%A8%E5%8F%98%E9%87%8F.meta.js
// ==/UserScript==
const customSpeed = 10; //自定义倍速，可自行修改，默认10倍速，修改后刷新游戏生效（不可动态修改 否则会出错）

//额外功能 需要手动修改为true后开启【测试版，不保证无BUG】
const 军队加速 = false;
const 进攻失败不损失部队 = false;

let game
performance.realNow = performance.now;
performance.now = () => {
    return performance.realNow() * customSpeed
}

let timer = setInterval(() => { //setInterval摆烂
    if (document.querySelector("#main-tabs")) {
        clearInterval(timer)
        game = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore
        window.game = game//暴露存储变量
        customFunction()
    }
}, 100)

function customFunction() { //额外功能
    if (军队加速) {
        game.ArmyStore.waitTime /= customSpeed
    }
    if (进攻失败不损失部队) {
        game.ArmyStore.realDestroyArmy = game.ArmyStore.destroyArmy
        game.ArmyStore.destroyArmy = function (...args) {
            if (!(args[2] == 'army' && args[3] != !0)) {
                return this.realDestroyArmy(...args)
            }
        }
    }
}
