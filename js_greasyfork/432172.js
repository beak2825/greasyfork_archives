// ==UserScript==
// @name        华为商城手机抢购 - vmall.com
// @namespace   Violentmonkey Scripts
// @match       https://www.vmall.com/product/10086368169358.html
// @grant       none
// @version     1.0
// @author      -
// @description 2021/9/2上午8:56:31
// @downloadURL https://update.greasyfork.org/scripts/432172/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%89%8B%E6%9C%BA%E6%8A%A2%E8%B4%AD%20-%20vmallcom.user.js
// @updateURL https://update.greasyfork.org/scripts/432172/%E5%8D%8E%E4%B8%BA%E5%95%86%E5%9F%8E%E6%89%8B%E6%9C%BA%E6%8A%A2%E8%B4%AD%20-%20vmallcom.meta.js
// ==/UserScript==

//开始时间
var startTime = new Date('2021/09/09 10:08:00')
//提交30s刷新页面
var refreshTime = 10
refreshTime = new Date(startTime - refreshTime * 1000)
//刷新结束时间
var refreshEnd = new Date(startTime - 3000)
console.log('刷新页面：', refreshTime, refreshEnd)

new Promise((resolve, reject) => {
    //刷新页面
    setInterval(function () {
        if (new Date() >= refreshTime && new Date() <= refreshEnd) {
            localStorage['refreshFlag'] = true;
            console.log('refresh')
            location.reload()
        } else {
            resolve()
        }
    }, 100)
}).then(() => {
    //点击购买按钮
    var btn = $('#pro-operation .product-button02');
    setInterval(function () {
        if (new Date() < startTime) {
            console.log("时间还未到")
            return
        }

        if (btn.is(":enabled")) {
            btn.click();
            console.log('btn click')
        } else {
            console.log('btn not enabled')
        }
    }, 50)
}).catch(err => console.log(err))