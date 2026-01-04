// ==UserScript==
// @name        [絕]显示最低价
// @author      絕版大叔丶
// @namespace   https://sdator.github.io/
// @match       https://wegamedb.info/products/*
// @grant       none
// @version     1.0
// @description 2020/9/30 下午5:21:46
// @downloadURL https://update.greasyfork.org/scripts/412256/%5B%E7%B5%95%5D%E6%98%BE%E7%A4%BA%E6%9C%80%E4%BD%8E%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/412256/%5B%E7%B5%95%5D%E6%98%BE%E7%A4%BA%E6%9C%80%E4%BD%8E%E4%BB%B7.meta.js
// ==/UserScript==


!function (data) {
    // 排除 0
    const arr = data.filter((v) => {
        return v.value[1]
    })
    // 按大小排列
    arr.sort((a, b) => {
        return a.value[1] - b.value[1]
    })
    // 取最低价
    const min = arr[0].value[1]
    // 替换元素内容
    $('#v-pills-price > table > tbody > tr:nth-child(1) > td:nth-child(4)').text(min + " 元")
}(data)
