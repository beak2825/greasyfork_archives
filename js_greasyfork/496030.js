// ==UserScript==
// @name         bilibili
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  过滤掉一些搜索结果!
// @author       You
// @match        https://search.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496030/bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/496030/bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function c1(dom) {
        dom.style.opacity = 0.3
        dom.style.display = 'initial'
    }

    function c2(dom) {
        dom.style.display = 'none'
    }

    function restore(dom) {
        dom.style.opacity = 3
        dom.style.display = 'initial'
    }

    let doClear = c2

    const filter = new Proxy(
        {
            isWork: false,
            limitHour: 7,
            limitYear: 2020,
        },
        {
            set: function (target, propKey, value, receiver) {
                const result = Reflect.set(target, propKey, value, receiver)
                clear()
                return result
            },
        }
    )

    let html
    function clear() {
        const list = document.querySelectorAll('.video-list>div')
        list.forEach((dom) => {
            let hit
            test: if (filter.isWork) {
                let test

                // 时长
                test = dom.querySelector('.bili-video-card__stats__duration')
                if (test) {
                    const time = test.innerHTML
                    const hour = Number(/(?:(\d{2}):)?(\d{2}):(\d{2})/.exec(time)?.[1] || 0)
                    if (hour < (filter.limitHour || 0)) {
                        hit = dom
                        break test
                    }
                }


                // 日期
                test = dom.querySelector('.bili-video-card__info--date')
                if (test) {
                    test = test.innerHTML
                    test = /(?:(\d{4})-)?(\d{1,2})-(\d{1,2})/.exec(test)
                    test = test[1]
                    if (test && Number(test) < (filter.limitYear || 2020)) {
                        hit = dom
                        break test
                    }
                }
            }

            if (hit) {
                doClear(hit)
            } else {
                restore(dom)
            }
        })
    }
    setInterval(() => {
        const newHtml = document.querySelector('.video-list').innerText
        if (html != newHtml) {
            html = newHtml
            setTimeout(clear, 50)
        }
    }, 50)

    // 操作栏
    const bar = document.createElement('div')
    bar.style.position = 'fixed'
    bar.style.right = '10px'
    bar.style.bottom = '220px'
    bar.style.zIndex = 1000
    document.body.appendChild(bar)

    // 年份输入
    const inputYear = document.createElement('input')
    inputYear.style.width = '60px'
    inputYear.setAttribute('type', 'number')
    inputYear.setAttribute('value', filter.limitYear)
    inputYear.addEventListener('input', (e) => {
        filter.limitYear = e.target.valueAsNumber
    })
    bar.appendChild(inputYear)
    bar.appendChild(document.createElement('br'))

    // 时长输入
    const inputHour = document.createElement('input')
    inputHour.style.width = '60px'
    inputHour.setAttribute('type', 'number')
    inputHour.setAttribute('value', filter.limitHour)
    inputHour.addEventListener('input', (e) => {
        filter.limitHour = e.target.valueAsNumber
    })
    bar.appendChild(inputHour)
    bar.appendChild(document.createElement('br'))

    // 切换按钮
    const btn = document.createElement('button')
    btn.innerText = '切换'
    btn.style.backgroundColor = '#fff'
    btn.style.border = '1px solid rgb(118, 118, 118)'
    btn.addEventListener('click', () => {
        if (doClear == c1) {
            doClear = c2
        } else {
            doClear = c1
        }
        clear()
    })
    bar.appendChild(btn)

    // 开关按钮
    const stopSwitch = document.createElement('button')
    stopSwitch.innerText = '开关'
    stopSwitch.style.color = 'red'
    stopSwitch.style.backgroundColor = '#fff'
    stopSwitch.style.border = '1px solid rgb(118, 118, 118)'
    stopSwitch.addEventListener('click', () => {
        if (filter.isWork) {
            filter.isWork = false
            stopSwitch.style.color = 'red'
        } else {
            filter.isWork = true
            stopSwitch.style.color = 'green'
        }
    })
    bar.appendChild(stopSwitch)

})();