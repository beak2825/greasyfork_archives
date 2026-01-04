// ==UserScript==
// @name Taobao - show tracking numbers
// @match https://buyertrade.taobao.com/*
// @require https://unpkg.com/mithril/mithril.js
// @require https://unpkg.com/mithril/stream/stream.js
// @run-at document-end
// @namespace shalva97
// @license Unlicense
// @description show tracking numbers on Taobao.com for easy CTRL+F
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/443689/Taobao%20-%20show%20tracking%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/443689/Taobao%20-%20show%20tracking%20numbers.meta.js
// ==/UserScript==

// styles
function normalButton() {
    return {
        'padding': '1px 10px',
        'cursor': 'pointer',
        'border': '1px solid #ababab',
        'border-radius': '3px',
        'font-family': 'Arial'
    }
}

function getApp(orderId) {
    var appstate = m.stream()

    m.request('https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=' + orderId).then(data => {
        appstate('Tracking num: ' + data.expressId)
    })

    function loadingText() {
        return m('p', 'loading...')
    }

    return {
        view: function () {
            if (appstate() === undefined) {
                return loadingText()
            } else {
                return appstate()
            }
        }
    }
}

function trackingNumRow() {
    var row = document.createElement("div");
    row.style.padding = "10px"
    return row
}

function showButtonForTrackingNumberRefresh() {
    var button = document.createElement("button")
    button.innerHTML = "refresh numbers"
    button.onclick = function() {
        showTrackingNumbers()
    }
    document.getElementsByClassName("row-mod__row___1aPep js-actions-row-top")[0].append(button)
}


function showTrackingNumbers() {
    var listOfOrders = document.getElementsByClassName('index-mod__order-container___1ur4-')
    for (var order of listOfOrders) {
        var row = trackingNumRow()
        var orderId = order.getElementsByClassName('bought-wrapper-mod__head___2vnqo')[0]
            .getElementsByTagName('td')[0]
            .getElementsByTagName('span')[5].innerText
    
        order.getElementsByClassName('bought-table-mod__table___AnaXt')[0].prepend(row)
        m.mount(row, getApp(orderId));
    }
}

showButtonForTrackingNumberRefresh()
showTrackingNumbers()

// -=-=-=-=-=
if (m == undefined) {
    console.log('FAIL - mithril not loaded')
}

if (m.stream == undefined) {
    console.log('FAIL - Streams not loaded')
}