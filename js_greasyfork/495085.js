// ==UserScript==
// @name         nhentai.net漫画自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  本脚本主要功能为自动播放该网站内的漫画，用户可以设置自动播放时间、开始播放并随时暂停
// @author       Anaaya
// @match        https://nhentai.net/g/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495085/nhentainet%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/495085/nhentainet%E6%BC%AB%E7%94%BB%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const nextBtn = () => {
        return document.querySelector('.reader-pagination>.next:not(.invisible)')
    }
    const insertP = () => {
        return document.querySelector('.menu.left')
    }
// gen element string
    const waitNum = [0, 5, 10, 15, 20, 25, 30]
    const wsId = 'wait-select'
    const genSelect = () => {
        const ss = `<li class="desktop"><select id="${wsId}">`
        const se = '</select></li>'
        let sres = ss
        waitNum.forEach(n => {
            sres += `<option value="${n}">${n}</option>`
        })
        sres += se
        return sres
    }
    const wsmId = 'wait-submit'
    const genSubmit = () => {
        const ss = `<li class="desktop"><a id="${wsmId}">`
        const se = '</a></li>'
        return ss + 'start' + se
    }
// add elements
    const appendEle = (s) => {
        const insertPE = insertP()
        if (insertPE === null) {
            return
        }
        const insertPEJ = $(insertPE)
        insertPEJ.append(s)
    }
    const appendEleS = () => {
        appendEle(genSelect())
    }
    const appendEleSM = () => {
        appendEle(genSubmit())
    }
// bind event
    const enableH = (e) => {
        e.style.pointerEvents = ''
        e.style.color = ''
    }
    const disableH = (e) => {
        e.style.pointerEvents = 'none'
        e.style.color = '#CCCCCC'
    }
    const waiting = (s) => {
        return new Promise(resolve => {
            setTimeout(resolve, s);
        })
    }
    const setText = (msg) => {
        const sme = document.getElementById(wsmId)
        if (sme === null) {
            return
        }
        sme.textContent = msg
    }
    const handleStart = (e) => {
        return new Promise(async resolve => {
            disableH(e)
            setText('running...')
            // waiting every page
            while (true) {
                if (nextBtn() === null) {
                    console.log('no next, end')
                    break
                }
                const wse = document.getElementById(wsId)
                if (wse === null) {
                    alert('')
                    return
                }
                const s = parseInt(wse.value)
                if (s <= 0) {
                    break
                }
                setText('second:' + s)
                await waiting(s * 1000)
                const n = nextBtn()
                if (n === null) {
                    console.log('no next, end')
                    break
                }
                n.click()
            }
            setText('end.')
            enableH(e)
        })
    }
    const handleSM = (e) => {
        handleStart(e)
    }
    const addClick = () => {
        const sme = document.getElementById(wsmId)
        if (sme === null) {
            return
        }
        sme.addEventListener('click', () => {
            handleSM(sme)
        });
    }
// start
    const checkUrl = () => {
        const h = window.location.href
        const pattern = /^https:\/\/nhentai\.net\/g\/\d+\/\d+\/$/
        return pattern.test(h)
    }
    const delay = 8000
    setTimeout(()=>{
        if (!checkUrl()) {
            return
        }
        appendEleS()
        appendEleSM()
        addClick()
    }, delay)

    // Your code here...
})();