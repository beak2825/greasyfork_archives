// ==UserScript==
// @name         咕咕镇伪助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @compatible   Chrome
// @compatible   Firefox
// @description  咕咕镇一键复制装备，海滩时间显示优化
// @author       ludoux
// @match        *://www.lv999max.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/406274/%E5%92%95%E5%92%95%E9%95%87%E4%BC%AA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406274/%E5%92%95%E5%92%95%E9%95%87%E4%BC%AA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.pathname == '/fyg_beach.php') {
        let ele = $('.pull-right')[1]
        if (ele.innerText.endsWith('分钟')) {
            let reg = new RegExp('(?<=还有 )\\d+(?= 分钟)')
            let minutes = reg.exec(ele.innerText)
            if (minutes >= 60) {
                let ho = Math.floor(minutes / 60)
                let mi = (minutes % 60)
                ele.innerText = ele.innerText.replace(minutes + ' 分钟', ho + ' 时 ' + mi + ' 分')
            }
        }
    }
    else if (window.location.pathname == '/fyg_equip.php') {
        let ele = $('.col-md-4')
        let btn = $('<button type="button" class="btn copy" style="width:170px;height:40px;margin-bottom:5px;color:#f1a325;">复制全部装备信息</button>')
        btn.click(function () {
            let out = ''
            $('#backpacks').children(':button').each(function (index) {
                out += equip($(this).text()) + ' '
                out += /Lv.(\d+)/.exec($(this).text())[1] + ' '
                let r
                let re = />(\d+)%/g
                while (r = re.exec($(this).attr('data-content'))) {
                    out += r[1] + ' '
                }
                out += '0\n'
            })
            $('div#myequip').find('div.content').each(function (index) {
                out += `${equip($(this).find('h3').eq(0).text())} ${$(this).find('h3').eq(1).text().slice(3)} `
                out += $(this).find("span[class^='label label-']").eq(0).text().slice(0, -1) + ' '
                out += $(this).find("span[class^='label label-']").eq(1).text().slice(0, -1) + ' '
                out += $(this).find("span[class^='label label-']").eq(2).text().slice(0, -1) + ' '
                out += $(this).find("span[class^='label label-']").eq(3).text().slice(0, -1) + ' 0\n'
            })
            GM_setClipboard(out)
        })
        ele.append(btn)
    }
    else if (window.location.pathname == '/fyg_card.php') {
        let ele = $('.btn-group')
        let btn = $('<button class="btn dianshucopy" type="button">复制点数</button>')
        ele.after(btn)
    }
    function equip(fullname) {
        let arr = { 剑: 'SWORD', 短弓: 'BOW', 短杖: 'STAFF', 荣誉之刃: 'BLADE', 手套: 'GLOVES', 手环: 'BRACELET', 铁甲: 'PLATE', 皮甲: 'LEATHER', 布甲: 'CLOTH', 灵光袍: 'CLOAK', 荆棘重甲: 'THORN', 头巾: 'SCARF' }
        if (arr.hasOwnProperty(fullname.substr(-1))) {
            return arr[fullname.substr(-1)]
        }
        else if (arr.hasOwnProperty(fullname.substr(-2))) {
            return arr[fullname.substr(-2)]
        }
        else if (arr.hasOwnProperty(fullname.substr(-3))) {
            return arr[fullname.substr(-3)]
        }
        else if (arr.hasOwnProperty(fullname.substr(-4))) {
            return arr[fullname.substr(-4)]
        }
        else {
            alert('出错！无法配对装备名，返回BOW(input:' + fullname)
            return 'BOW'
        }
    }
})();