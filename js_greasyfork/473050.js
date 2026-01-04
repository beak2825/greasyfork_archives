// ==UserScript==
// @name         Temu抢库存
// @namespace    
// @version      0.5
// @description  Temu自动抢库存
// @author       Monty
// @match        https://kuajing.pinduoduo.com/*
// @icon         
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473050/Temu%E6%8A%A2%E5%BA%93%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/473050/Temu%E6%8A%A2%E5%BA%93%E5%AD%98.meta.js
// ==/UserScript==


let orders = ['WB230717756060', 'WB230719235646']

// 备货单
const order_manage_pathname = '/main/order-manage'
// 发货台
const shipping_desk_pathname = '/main/order-manager/shipping-desk'

// function getOrdersDetails(orders) {
//     trs = document.querySelectorAll('tbody tr')

//     trs.array.forEach(element => {
//         console.log(element)
//     });
// }

let taskStatus = false
let tasks = []
let interval
function initPanel() {
    let input = document.querySelectorAll('form .Grid_col_5-72-0 input')[1]
    // if(input.value){
    let btn = document.createElement('button')
    btn.setAttribute('type', 'button')
    btn.innerHTML = '抢单'
    btn.addEventListener('click', function (e) {
        if (input.value) {
            if (taskStatus) {
                clearInterval(interval)
                tasks.forEach(task => {
                    clearTimeout(task)
                })
                tasks = []
                btn.innerHTML = '抢单'
                taskStatus = false;
            } else {
                interval = setInterval(() => {
                    qiang()
                    btn.innerHTML = '取消'
                    taskStatus = true;
                }, 1000)
            }
        } else {
            alert('请先输入要抢的单号，并点击查询')
        }
    }, 500)
    document.querySelectorAll('form .IPT_reunitBlock_5-72-0')[1].appendChild(btn)
    // }
}

function generateRandom(min, max, step) {
    const randomNum = min + Math.random() * (max - min);
    return Math.round(randomNum / step) * step;
}

function qiang() {
    //document.querySelectorAll('tbody tr')[0].querySelectorAll('td')[11].querySelectorAll('a')[2]
    let trs = document.querySelectorAll('tbody tr')

    trs.forEach(element => {
        let len = element.children.length
        if (len == 12) {
            tasks.push(setTimeout(function () {
                let jia = element.querySelectorAll('td')[11].querySelectorAll('a')[1]
                if (jia == null) {
                    console.log('找不到元素...')
                } else {
                    jia.click()
                    console.log('加入发货台...')
                }
            }, generateRandom(1000, 2000, 200)))
        }

        let confirms = document.querySelectorAll('.body-module__popover___3I6fI')
        confirms.forEach(element => {
            tasks.push(setTimeout(function () {
                let btn = element.querySelectorAll('button')[0]
                if (btn == null) {
                    console.log('找不到确认按钮...')
                } else {
                    btn.click()
                    console.log('确认...')
                }
            }, generateRandom(1000, 2000, 300)))
        })
        console.log(len)
    });
}



(function () {
    'use strict';
    console.log('Temu自动抢库存')

    window.onload = function () {
        const pathname = window.location.pathname
        console.log('当前pathname：' + pathname)

        // getOrdersDetails(orders)
    }

    setTimeout(function () {
        initPanel()
    }, 2000)


})();