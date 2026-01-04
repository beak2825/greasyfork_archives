// ==UserScript==
// @name         Taobao Sales Filter
// @namespace    zzway.space
// @version      0.4
// @description  根据销量过滤淘宝搜索页面的商品
// @author       Zzway
// @match        https://s.taobao.com/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/391727/Taobao%20Sales%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/391727/Taobao%20Sales%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict'

    var flag = true

    start()

    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.info(mutation.target)
            if (!mutation.target.classList.contains('nprogress-busy')) {//翻页后再次start()
                start()
            }else{
                flag = true
                console.log('set flag true')
            }
        })
    })


    var myInterval

    function start() {
        console.info('start' + flag)
        if(flag){
            myInterval = setInterval(detect, 500)
            function detect() {
                console.info('detect')
                // console.info(myInterval)
                if (document.querySelector('.tb-side > ul')) {
                    clearInterval(myInterval)
                    main()
                    mutationObserver.observe(document.documentElement, {
                        attributes: true
                    })
                }
            }
            flag = false
        }
    }


    function main() {
        console.info('main')

        let li = document.createElement('li')
        // li.id='SalesFilter'
        li.title = '鼠标点击空白处或按回车 即可生效'
        let input = document.createElement('input')
        input.type = 'number'
        input.min = 0
        input.style.width = '100%'
        input.value = GM_getValue('limit', 1)
        let span = document.createElement('span')
        span.innerText = '销量过滤'
        span.style.backgroundColor = '#f40'
        span.style.color = 'white'
        span.style['font-size'] = 'x-large'

        li.appendChild(input)
        li.appendChild(span)
        let root = document.querySelector('.tb-side > ul')
        root.appendChild(li)

        let itemList = document.querySelectorAll('.items > div.item')
        let cntList = document.querySelectorAll('div.deal-cnt')

        input.addEventListener('focusout', filter)
        input.addEventListener('keydown', e => {
            if (e.code == 'Enter') { filter() }
        })

        filter()

        function filter() {
            cntList.forEach((element, key) => {
                let number = Number(element.innerText.replace('人付款', '').replace('人收货', ''))
                // console.info(number)
                // console.info(number < input.value)
                if (number < input.value) {
                    itemList[key].hidden = true
                    if (itemList[key].className.search('item-ad') > -1) {
                        itemList[key].style.setProperty('display', 'none', 'important')
                    }
                } else {
                    itemList[key].hidden = false
                    if (itemList[key].className.search('item-ad') > -1) {
                        itemList[key].style.setProperty('display', 'initial')
                    }
                }
            })
            GM_setValue('limit', input.value)
        }
    }

})()