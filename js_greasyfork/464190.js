// ==UserScript==
// @name         用户审核待审量显示数字【前端】0.8
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  用户审核待审量显示数字【前端】 & 复审待审量显示 V0.2 从张栋服务器取数据 V0.3 适配非蓝色浏览器 V0.4 总量显示
// @description  V0.8  直播圈审核量显示
// @author       丁振兴
// @match        https://live-media-monitor.wemomo.com/*
// @icon         https://img.ixintu.com/download/jpg/20201226/aecbb64b922feb0af1b29e7e980c5437_512_512.jpg!con
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464190/%E7%94%A8%E6%88%B7%E5%AE%A1%E6%A0%B8%E5%BE%85%E5%AE%A1%E9%87%8F%E6%98%BE%E7%A4%BA%E6%95%B0%E5%AD%97%E3%80%90%E5%89%8D%E7%AB%AF%E3%80%9108.user.js
// @updateURL https://update.greasyfork.org/scripts/464190/%E7%94%A8%E6%88%B7%E5%AE%A1%E6%A0%B8%E5%BE%85%E5%AE%A1%E9%87%8F%E6%98%BE%E7%A4%BA%E6%95%B0%E5%AD%97%E3%80%90%E5%89%8D%E7%AB%AF%E3%80%9108.meta.js
// ==/UserScript==

// (function() {
//     'use strict';

function sum(arr) {
    if (arr.length == 1) {
        return arr[0]
    } else {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }
}

function sumAll() {
    var _sum = 0;
    var role_routers = JSON.parse(localStorage.getItem('routers'))
    if (role_routers == null) {
        document.querySelectorAll('.q-btn.q-btn-item')[1].click()
        var routers = []
        for (let i = 0; i < yhu.length; i++) {
            routers.push(yhu[i].href.split('/')[yhu[i].href.split('/').length - 1])
        }
        localStorage.setItem('routers', JSON.stringify(routers))
    }
    if (role_routers == null) {
        return ''
    }
        var res = GM_getValue('liveUserAudit_dic')
//     var res = {
//         "abnormalNewAnchorFirst": [587],
//         "anchorAppealToDo": [0],
//         "busPubFirst": [1],
//         "inferiorAudit": [0],
//         "perfectMoment": [3523],
//         "platformReview": [2, 1, 3],
//         "releaseBeforReview": [0],
//         'hangUpRecord': [5]
//     }
    for (let i = 0; i < role_routers.length; i++) {
        if (role_routers[i]in res) {
            _sum += sum(res[role_routers[i]])
        }
    }
    return _sum;
}
    function get_data() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://172.20.12.108:9000/push/count",
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    var liveCircelAudit=json.liveCircelAudit
                    delete json.liveCircelAudit
                    GM_setValue('liveUserAudit_dic', json)
                    localStorage.setItem('liveCircelAudit', liveCircelAudit[0])

                }
            }
        })
    }

function xhd() {

            var res = GM_getValue('liveUserAudit_dic')

//     var res = {
//         "abnormalNewAnchorFirst": [587],
//         "anchorAppealToDo": [0],
//         "busPubFirst": [1],
//         "inferiorAudit": [0],
//         "perfectMoment": [3523],
//         "platformReview": [2, 1, 3],
//         "releaseBeforReview": [0],
//         'hangUpRecord': [5]
//     }
    if (res == undefined)
        return
    // if (document.querySelectorAll('.q-btn.q-btn-item')[1].textContent.indexOf('审核') == -1)
    //{ return}
    if (document.querySelectorAll('.q-btn.q-btn-item').length == 0)
        return

    if (document.querySelectorAll('.q-btn.q-btn-item')[1].getAttribute('aria-expanded') == 'true') {
        var yhu = document.querySelectorAll('a.q-item.q-item-type.row')
        if (JSON.parse(localStorage.getItem('routers')) == null) {
            document.querySelectorAll('.q-btn.q-btn-item')[1].click()
            var routers = []
            for (let i = 0; i < yhu.length; i++) {
                routers.push(yhu[i].href.split('/')[yhu[i].href.split('/').length - 1])
            }
            localStorage.setItem('routers', JSON.stringify(routers))
        }
        yhu.forEach(function update_data(item, index) {
            var router = item.href.split('/')[item.href.split('/').length - 1]
            //   console.log(res)
            //   console.log(router)
            if (!(router in res)) //(skip_router.includes(router))
            {
                return
            }

            if (item.lastChild.tagName == 'SPAN') {
                item.lastChild.textContent = sum(res[router])
                //                     if (router == 'platformReview') {
                //                         let arr = JSON.parse(localStorage.getItem('platformReview'))
                //                         item.lastChild.textContent = arr[0] + arr[1] + arr[2]
                //                     } else {
                //                         item.lastChild.textContent = localStorage.getItem(router)
                //                     }
            } else {
                var sp = document.createElement('span')
                //                     if (router == 'platformReview') {
                //                         let arr = JSON.parse(localStorage.getItem('platformReview'))
                //                         sp.textContent = arr[0] + arr[1] + arr[2]
                //                     } else {
                //                         sp.textContent = localStorage.getItem(router)
                //                     }
                sp.textContent = sum(res[router])
                sp.id = 'xhd' + index
                sp.setAttribute('class', 'text-white main')
                sp.style.height = '20px'
                sp.style.backgroundColor = 'red'
                sp.style.textAlign = 'center'
                sp.style.borderRadius = '6px'
                sp.style.marginLeft = '5px'
                sp.style.marginTop = '7px'
                sp.style.paddingRight = '5px'
                sp.style.paddingLeft = '5px'
                item.appendChild(sp)
            }
        })

    }
}

function zbq() {

          //  var res = GM_getValue('liveCircelAudit')
//     var res = {
//         "abnormalNewAnchorFirst": [587],
//         "anchorAppealToDo": [0],
//         "busPubFirst": [1],
//         "inferiorAudit": [0],
//         "perfectMoment": [3523],
//         "platformReview": [2, 1, 3],
//         "releaseBeforReview": [0],
//         'hangUpRecord': [5]
//     }

    var index = -1
    for (let i = 0; i < document.querySelectorAll('.q-btn.q-btn-item').length; i++) {
        if (document.querySelectorAll('.q-btn.q-btn-item')[i].textContent.indexOf('直播圈') > -1) {
            index = i
        }
    }
    if(index==-1 || localStorage.getItem('liveCircelAudit')==null) return

    if (document.querySelectorAll('.q-btn.q-btn-item')[index].getAttribute('aria-expanded') == 'true') {
        var yhu = document.querySelectorAll('a.q-item.q-item-type.row')
        var item=yhu[0]


            if (item.lastChild.tagName == 'SPAN') {
                item.lastChild.textContent = localStorage.getItem('liveCircelAudit')
            } else {
                var sp = document.createElement('span')
                //                     if (router == 'platformReview') {
                //                         let arr = JSON.parse(localStorage.getItem('platformReview'))
                //                         sp.textContent = arr[0] + arr[1] + arr[2]
                //                     } else {
                //                         sp.textContent = localStorage.getItem(router)
                //                     }
                sp.textContent = localStorage.getItem('liveCircelAudit')
                sp.id = 'zbq' + 0
                sp.setAttribute('class', 'text-white main')
                sp.style.height = '20px'
                sp.style.backgroundColor = 'red'
                sp.style.textAlign = 'center'
                sp.style.borderRadius = '6px'
                sp.style.marginLeft = '5px'
                sp.style.marginTop = '7px'
                sp.style.paddingRight = '5px'
                sp.style.paddingLeft = '5px'
                item.appendChild(sp)
            }
    }

   if (document.querySelector('#zbq_num')) {
        document.querySelector('#zbq_num').textContent =localStorage.getItem('liveCircelAudit')

    } else {

            var spzbq = document.createElement('span')
            spzbq.textContent = localStorage.getItem('liveCircelAudit')
            spzbq.id = 'zbq_num'
            spzbq.setAttribute('class', 'text-white main')
            spzbq.style.height = '20px'
            spzbq.style.backgroundColor = 'red'
            spzbq.style.textAlign = 'center'
            spzbq.style.borderRadius = '6px'
            spzbq.style.marginLeft = '5px'
            spzbq.style.marginTop = '7px'
            spzbq.style.paddingRight = '5px'
            spzbq.style.paddingLeft = '5px'

         document.querySelectorAll('.q-btn.q-btn-item')[index].querySelector('.block').append(spzbq)

    }

}

function xhd_onclick() {
    if (document.querySelectorAll('#q-app div header div div div div button').length > 2) {
        if (document.querySelectorAll('#q-app div header div div div div button')[1].textContent.indexOf('审核') == -1) {
            return
        }
        if (document.querySelectorAll('#q-app div header div div div div button')[1].onclick == null) {
            document.querySelectorAll('#q-app div header div div div div button')[1].onclick = xhd

        }
    }
}
function zbq_onclick() {
    var index = -1
    for (let i = 0; i < document.querySelectorAll('.q-btn.q-btn-item').length; i++) {
        if (document.querySelectorAll('.q-btn.q-btn-item')[i].textContent.indexOf('直播圈') > -1) {
            index = i
        }
    }
    if(index==-1 || localStorage.getItem('liveCircelAudit')==null) return

        if (document.querySelectorAll('#q-app div header div div div div button')[index].onclick == null) {
            document.querySelectorAll('#q-app div header div div div div button')[index].onclick = zbq

        }

}

function fushen() {

    if (window.location.href.indexOf('https://live-media-monitor.wemomo.com/#/liveUserAudit/platformReview') > -1) {
        var res = GM_getValue('liveUserAudit_dic')

        var arr = res["platformReview"]
        //JSON.parse(localStorage.getItem("platformReview"))
        arr.push(res["releaseBeforReview"])
        document.querySelectorAll('.q-tab').forEach(function addsp(item, index) {
            if (item.lastChild.tagName == 'SPAN') {
                item.lastChild.textContent = arr[index]
                //parseInt(Math.random() * 10)
            } else {
                var sp = document.createElement('span')
                sp.id = 'fushen' + index
                sp.textContent = arr[index]
                //parseInt(Math.random() * 10)
                sp.setAttribute('class', 'text-white main')
                sp.style.width = '20px'
                sp.style.height = '20px'
                sp.style.backgroundColor = 'red'
                sp.style.textAlign = 'center'
                sp.style.borderRadius = '5px'
                sp.style.marginLeft = '3px'
                sp.style.marginTop = '0px'
                item.appendChild(sp)
            }
        })
    }
}

function show_total_num() {

    if (document.querySelector('#total_num')) {
        document.querySelector('#total_num').textContent = sumAll()

    } else {
        if (document.querySelector('#q-app div header div div div div button:nth-child(2) span.block:nth-child(1)')) {
            var sp = document.createElement('span')
            sp.textContent = sumAll()
            sp.id = 'total_num'
            sp.setAttribute('class', 'text-white main')
            sp.style.height = '20px'
            sp.style.backgroundColor = 'red'
            sp.style.textAlign = 'center'
            sp.style.borderRadius = '6px'
            sp.style.marginLeft = '5px'
            sp.style.marginTop = '7px'
            sp.style.paddingRight = '5px'
            sp.style.paddingLeft = '5px'

            document.querySelector('#q-app div header div div div div button:nth-child(2) span.block:nth-child(1)').append(sp)
        }
    }

}

// Your code here...
//  window.onload = function uu() {
setInterval(get_data, 1000)
setInterval(xhd, 1000)
setInterval(xhd_onclick, 1000)
setInterval(fushen, 1000)
setInterval(show_total_num, 1000)

setInterval(zbq, 1000)
setInterval(zbq_onclick, 1000)
//   }

// }
// )();
