// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://ehallapp.nju.edu.cn/qljfwapp/sys/lwAppointmentBathroom/*default/index.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410961/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/410961/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var unit = 20 * 60 * 1000
    var startText = '开始时间: '
    var endText = '结束时间: '

    var format = (number) => {
        if (number < 10) return '0' + number
        return number
    }

    var refresh = () => {

        var now = new Date()
        var index = now.getTime() / unit
        var date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} `
        var start = new Date(Math.floor(index) * unit)
        var end = new Date(Math.ceil(index) * unit)
        var startTime = `${format(start.getHours())}:${format(start.getMinutes())}:${format(start.getSeconds())}`
        var endTime = `${format(end.getHours())}:${format(end.getMinutes())}:${format(end.getSeconds())}`
        var labels = document.querySelectorAll('label')
        var length = labels.length
        for (var i = 0; i < length; i++) {
            var label = labels[i]
            var text = label.innerText
            if (text.startsWith(startText)) label.innerText = startText + startTime
            if (text.startsWith(endText)) label.innerText = endText + endTime
        }

        var items = document.querySelectorAll('.lib-listdet-items')[0]
        if (items) {
            items.children[4].children[2].innerText = date + startTime
            items.children[5].children[2].innerText = date + endTime
        }

    }

    setInterval(refresh, 1000)
})();