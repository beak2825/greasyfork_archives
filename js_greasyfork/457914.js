// ==UserScript==
// @name         新版抖店
// @namespace    http://tampermonkey.net/
// @version      1.4.17
// @description  抖店
// @author       许大包
// @match        https://fxg.jinritemai.com/ffa/g/list*
// @match        https://dd.chengji-inc.com/product/batch/index?batchType=stock*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        window.close
// @grant        window.focus
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/500012/1407355/jquery20.js
// @require      https://update.greasyfork.org/scripts/500013/1407356/xlsxfull-0185.js

// @downloadURL https://update.greasyfork.org/scripts/457914/%E6%96%B0%E7%89%88%E6%8A%96%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/457914/%E6%96%B0%E7%89%88%E6%8A%96%E5%BA%97.meta.js
// ==/UserScript==
(function () {
    window.onload = function() {
        setTimeout(() => {
            GM_setValue('ii',1)
            let setting, timer
            let quick = false
            let wucha = false
            let mouseover = new Event('mouseover', { bubbles: true })
            let mouseout = new Event('mouseout', { bubbles: true })
            let Doms = {
                "searchInput": document.getElementsByClassName('ecom-g-input ecom-g-input-sm ecom-g-input-borderless')[0], //搜索商品文本框
                "query": document.getElementsByClassName('ecom-g-btn ecom-g-btn-dashed ecom-g-btn-sm')[0], // 查询按钮
            }
            const chromeVersion = /Chrome\/([0-9.]+)/.exec(window?.navigator?.userAgent)?.[1]?.split('.')[0];
            if (chromeVersion && parseInt(chromeVersion, 10) >= 88) {
                console.log(chromeVersion);
                const videoDom = document.createElement('video');
                const hiddenCanvas = document.createElement('canvas');
                videoDom.setAttribute('style', 'display:none');
                videoDom.setAttribute('muted', '');
                videoDom.muted = true;
                videoDom.setAttribute('autoplay', '');
                videoDom.autoplay = true;
                videoDom.setAttribute('playsinline', '');
                hiddenCanvas.setAttribute('style', 'display:none');
                hiddenCanvas.setAttribute('width', '1');
                hiddenCanvas.setAttribute('height', '1');
                hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
                videoDom.srcObject = hiddenCanvas?.captureStream();
            }
            function changeReactInputValue(inputDom,newText){
                let lastValue = inputDom.value;
                inputDom.value = newText;
                let event = new Event('input', { bubbles: true });
                event.simulated = true;
                let tracker = inputDom._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                inputDom.dispatchEvent(event);
            }
            // 生成随机数的方法
            function getRndInteger(min, max) {
                return Math.floor(Math.random() * (max - min + 1) ) + min;
            }
            // 数组求和的方法
            function sumFn(arr) {
                return eval(arr.join("+"));
            };
            function toast(text,time,id) {
                let $html1 = document.querySelector('html')
                let $toast = document.createElement('div')
                let timer = time || 3000
                let toastid = id || "ccc"
                // 移除上一个toast
                if(document.querySelector('#'+toastid)) $html1.removeChild(document.querySelector('#'+toastid))
                $toast.style.position = 'fixed'
                $toast.style.right = '10px'
                $toast.style.top = '20%'
                if(toastid != "ccc") $toast.style.top = '40%'
                $toast.innerText = text
                $toast.style.padding = '6px 15px'
                $toast.style.borderRadius = '8px'
                $toast.style.opacity = 0
                $toast.style.color = '#fff'
                $toast.style.fontSize = '18px'
                $toast.style.lineHeight = '30px'
                //$toast.style.background = 'rgba(100, 86, 247,.6)'
                $toast.style.background = 'rgb(38, 149, 250)'
                $toast.style.zIndex = 9999999999999999999
                $toast.setAttribute("id", toastid)
                $html1.appendChild($toast)
                let i = 0
                let aaaa = setInterval(() => {
                    if(!document.querySelector('#'+toastid)) clearInterval(aaaa)
                    i = i+0.05
                    if(document.querySelector('#'+toastid)) document.querySelector('#'+toastid).style.opacity = i
                    if(i>=1) {
                        clearInterval(aaaa)
                        setTimeout(() => {
                            if(document.querySelector('#'+toastid)) $html1.removeChild(document.querySelector('#'+toastid))
                        }, timer);
                    }
                }, 15)
                }
            // 复制到粘贴板的方法
            function copyToClip(content) {
                const input = document.createElement('textarea')
                input.value = content
                document.body.appendChild(input)
                input.select()
                document.execCommand('Copy')
                document.body.removeChild(input)
            }
            // 自动展开编辑小弹框的"批量设置"
            let fnstart = function() {
                setTimeout(() => {
                    $('.ecom-g-modal.modal-with-default-footer').last().width(1200)
                },200)
                if(quick) {
                    document.getElementById('price').style.display = 'block'
                    document.getElementById('price').focus()
                    let timer1 = setInterval(() => {
                        document.getElementById('price').focus()
                    },30)
                    setTimeout(() => {
                        clearInterval(timer1)
                    },2500)
                    let timer = setInterval(() => {
                        // 批量设置按钮
                        setting = document.querySelector('.index_title__26QNA .ecom-g-select-selection-search-input')
                        if (document.getElementsByClassName('index_description__2vVnZ')[0]) {
                            clearInterval(GM_getValue('timer',timer))
                            if (!document.querySelector('.index_content__HNY0j .ecom-g-btn.ecom-g-btn-dashed')) {
                                // 模拟按下回车
                                let event = document.createEvent("KeyboardEvent");
                                event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
                                setting.dispatchEvent(event);
                                setting.keyCode = 13
                            }
                        }
                    }, 200)
                    GM_setValue('timer',timer)
                }else {
                    setting = null
                    clearInterval(GM_getValue('timer',0))
                    let timer = setInterval(() => {
                        if (document.getElementsByClassName('index_inputBox__KGOsd')[0]) {
                            clearInterval(GM_getValue('timer',timer))
                            setTimeout(() => {
                                let inputdom = document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0] ? document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0] : document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input-number-input')[0]
                                inputdom.focus()
                                // 焦点跳转到编辑价格/库存文本框
                                inputdom.addEventListener('keydown', function (e) {
                                    if (e.keyCode == 13) {
                                        document.querySelector('.index_content__HNY0j .ecom-g-btn.ecom-g-btn-dashed').click()
                                        document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary').length-1].click()
                                        setTimeout(() => {
                                            Doms.searchInput.focus()
                                            Doms.searchInput.select()
                                        },2000)
                                    }
                                })
                                if(inputdom.placeholder.indexOf('库存') != -1 && !document.querySelector('#shouzhi')) {
                                    setTimeout(() => {
                                        // 计算规格库存
                                        let guigenum = document.querySelector('.ecom-g-table-cell-fix-left[rowspan]') ? parseInt(document.querySelector('.ecom-g-table-cell-fix-left[rowspan]').getAttribute('rowspan')) : ""
                                        let allStockDom = document.getElementsByClassName('ecom-g-table-content')[1].querySelectorAll('.ecom-g-input:not(.ecom-g-input-disabled)')
                                        let sum = 0
                                        let arr = []
                                        for(let i = 0;i < allStockDom.length;i++) {
                                            if(!document.querySelector('.ecom-g-table-cell-fix-left[rowspan]')) {
                                                arr.push(parseInt(allStockDom[i].value))
                                            }else if(i % guigenum != 0 || i == 0) {
                                                sum += parseInt(allStockDom[i].value)
                                                if(i == allStockDom.length-1) {
                                                    // 最后一个
                                                    arr.push(sum)
                                                    let styledom = `<span style="color:red">（${sum}）</span>`
                                                    document.querySelectorAll('.ecom-g-table-cell-fix-left[rowspan]')[parseInt(i/guigenum)].insertAdjacentHTML("beforeend", styledom)
                                                }
                                            }else{
                                                arr.push(sum)
                                                let styledom = `<span style="color:red">（${sum}）</span>`
                                                document.querySelectorAll('.ecom-g-table-cell-fix-left[rowspan]')[parseInt(i/guigenum)-1].insertAdjacentHTML("beforeend", styledom)
                                                sum = parseInt(allStockDom[i].value)
                                            }
                                        }
                                        console.log(arr)
                                        let [...oldarr] = arr
                                        let max = arr.sort((a,b) => b - a)[0]
                                        let styledom = `<span id="shouzhi" style="color:red;font-size: 20px">👆</span>`
                                        if(document.querySelectorAll('.ecom-g-table-cell-fix-left[rowspan]').length > 0) {
                                            document.querySelectorAll('.ecom-g-table-cell-fix-left[rowspan] span')[oldarr.indexOf(max)].insertAdjacentHTML("beforebegin", styledom)
                                            toast(document.querySelectorAll('.ecom-g-table-cell-fix-left[rowspan] span')[oldarr.indexOf(max)].parentElement.children[0].innerText,5000)
                                        }else {
                                            $('.ecom-g-table-row').find('.ecom-g-table-cell-fix-left:first')[oldarr.indexOf(max)+1].insertAdjacentHTML("beforeend", styledom)
                                        }
                                    },500)
                                }
                            },100)
                        }
                    }, 200)
                    GM_setValue('timer',timer)
                }
            }
            if(window.location.href.indexOf('https://dd.chengji-inc.com/product/batch/index?batchType=stock') != -1) {
                window.addEventListener('keydown',e => {
                    if(e.altKey && e.keyCode == 67) {
                        let kuanhao = ''
                        let num = 0
                        let stockDom = $('.J_itemProduct .red.left-item')
                        for(let i = 0;i < stockDom.length;i++) {
                            if(stockDom.eq(i).text().trim().split('：')[1] == '0') {
                                $('.J_itemProduct').eq(i).css('background','skyblue')
                                kuanhao += $('.J_itemProduct .force-middle a').eq(i).text().match(/\w+$/)[0]+","
                                num++
                            }
                        }
                        copyToClip(kuanhao.slice(0,kuanhao.length-1))
                        toast(`共${num}件`,60000)
                    }
                })
                return false
            }
            window.addEventListener('keydown', function (e) {
                if(e.altKey && e.keyCode === 81) {
                    document.getElementsByClassName('ecom-g-sp-icon sp-icon-parcel style_editIcon__cahfa')[0].click()
                    fnstart()
                }else if(e.altKey && e.keyCode === 87) {
                    document.getElementsByClassName('ecom-g-sp-icon sp-icon-parcel style_editIcon__cahfa')[1].click()
                    quick = false
                    fnstart()
                }
                else if(e.keyCode === 27) {
                    clearInterval(GM_getValue('timer',timer))
                    if(window.location.href.indexOf('https://fxg.jinritemai.com/ffa/morder/order/list') != '-1') {
                        document.querySelectorAll('.auxo-input')[1].focus()
                        document.querySelectorAll('.auxo-input')[1].select()
                    }else {
                        Doms = {
                            "searchInput": document.getElementsByClassName('ecom-g-input ecom-g-input-sm ecom-g-input-borderless')[0], //搜索商品文本框
                            "query": document.getElementsByClassName('ecom-g-btn ecom-g-btn-dashed ecom-g-btn-sm')[0], // 查询按钮
                        }
                        document.getElementById('price').value = ''
                        document.getElementById('price').style.display = 'none'
                        document.querySelector('#textarea').style.display = 'none'
                        Doms.searchInput.focus()
                        Doms.searchInput.value = ''
                        document.querySelectorAll('.sp-tag-content')[0].parentElement.dispatchEvent(mouseout)
                        if($('.ecom-g-modal-close-x').length > 0) {
                            $('.ecom-g-modal-close-x').click()
                        }
                        for(let i = 0;i < document.getElementsByClassName('ecom-g-btn').length; i++) {
                            if(document.getElementsByClassName('ecom-g-btn')[i].children[0].innerText == '返回确认') {
                                document.getElementsByClassName('ecom-g-btn')[i].click()
                            }
                        }
                    }
                }
                else if(e.keyCode === 13) {
                    for(let i = 0;i < document.getElementsByClassName('ecom-g-btn').length; i++) {
                        if(document.getElementsByClassName('ecom-g-btn')[i].children[0].innerText == '继续发布商品') {
                            document.getElementsByClassName('ecom-g-btn')[i].click()
                        }
                    }
                }
                // 编辑商品 alt+S
                else if(e.altKey && e.keyCode == 83) {
                    document.getElementsByClassName('ecom-g-table-cell style_operating__2MQoH ecom-g-table-cell-fix-right ecom-g-table-cell-fix-right-first')[1].querySelectorAll('a')[0].click()
                }else if(e.altKey && e.keyCode == 67) {
                    //alt + c
                    /*
                    let goodsid = document.querySelector('.style_productId__NXyEF').innerText.split(':')[1]
                    let url = `https://haohuo.jinritemai.com/ecommerce/trade/detail/index.html?id=${goodsid}&origin_type=604`
                    copyToClip(url)
                    toast('复制成功')
                    */
                    document.querySelector('.style_previewCopy__g4bx7 .ecom-g-btn').click()
                }else if(e.altKey && e.keyCode === 107 || e.altKey && e.keyCode === 187) {
                    // alt + +
                    quick = true
                }else if(e.altKey && e.keyCode === 109 || e.altKey && e.keyCode === 189) {
                    // alt + -
                    quick = false
                }else if(e.altKey && e.keyCode === 88) {
                    // alt + x
                    document.getElementsByClassName('ecom-g-sp-icon sp-icon-parcel style_copyProduct__LXbwM')[0].click()
                }else if(e.altKey && e.keyCode === 38) {
                    // alt + ↑
                    document.getElementsByClassName('ecom-g-modal-body')[0].scrollTop -= 200
                }else if(e.altKey && e.keyCode === 40) {
                    // alt + ↓
                    document.getElementsByClassName('ecom-g-modal-body')[0].scrollTop += 200
                }else if(e.altKey && e.keyCode == 192) {
                    // Alt + ~
                    // 获取库存文本框Dom
                    let allStockDom = document.querySelectorAll('.ecom-g-table-row .ecom-g-input:not(.ecom-g-input-disabled)')
                    // 有库存的Dom索引
                    let stockDomIndex = []
                    let flag
                    for(let i = 0;i < allStockDom.length;i++) {
                        if(allStockDom[i].value !== '0') {
                            stockDomIndex.push(i)
                        }
                    }
                    // 暂定每个规格库存
                    let averageStock = Math.floor(GM_getValue('maxStock',20)/stockDomIndex.length) != 0 ? Math.floor(GM_getValue('maxStock',20)/stockDomIndex.length) : 1
                    console.log(averageStock)
                    stockDomIndex.forEach((val,idx) => {
                        if(!wucha) {
                            let domValue = 0
                            let alldomValue = 0
                            stockDomIndex.forEach(val1 => {
                                alldomValue += parseInt(allStockDom[val1].value)
                                if(val1 < val) {
                                    domValue += parseInt(allStockDom[val1].value)
                                }
                            })
                            console.log(domValue)
                            if(alldomValue <= GM_getValue('maxStock',20)) return false
                            if(idx == 0) {
                                if(alldomValue >= GM_getValue('maxStock',20)) {
                                    if(stockDomIndex.length * averageStock >= GM_getValue('maxStock',20)) {
                                        if(allStockDom[val].value >= averageStock) {
                                            changeReactInputValue(allStockDom[val],averageStock)
                                        }
                                    }else if(parseInt(allStockDom[stockDomIndex[0]].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                        if(alldomValue-parseInt(allStockDom[stockDomIndex[0]].value) >= GM_getValue('maxStock',20)) {
                                            changeReactInputValue(allStockDom[val],averageStock)
                                        }else {
                                            changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                        }
                                    }
                                }
                            }else if(domValue < GM_getValue('maxStock',20)) {
                                if(stockDomIndex.length * averageStock >= GM_getValue('maxStock',20) && parseInt(allStockDom[val].value)+domValue <= GM_getValue('maxStock',20) && allStockDom[val].value >= averageStock) {
                                    changeReactInputValue(allStockDom[val],averageStock)
                                }else if(parseInt(allStockDom[val].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                    if(parseInt(allStockDom[val].value) >= GM_getValue('maxStock',20)-domValue && val != stockDomIndex[stockDomIndex.length-1] && allStockDom[val].value >= averageStock) {
                                        changeReactInputValue(allStockDom[val],averageStock)
                                    }else {
                                        if(allStockDom[val].value >= averageStock) {
                                            changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                        }
                                    }
                                }
                            }else{
                                if(domValue - GM_getValue('maxStock',20) >= 0) {
                                    changeReactInputValue(allStockDom[val],0)
                                }else {
                                    if(parseInt(allStockDom[val].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                        changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                    }else {
                                        changeReactInputValue(allStockDom[val],averageStock)
                                    }
                                }
                            }
                        }else if(parseInt(allStockDom[val].value) >= averageStock) {
                            if(flag) {
                                flag = false
                                if(averageStock+GM_getValue('cha',0) < parseInt(allStockDom[val].value)) changeReactInputValue(allStockDom[val],averageStock+GM_getValue('cha',0))
                            }else {
                                changeReactInputValue(allStockDom[val],averageStock)
                            }
                        }else {
                            flag = true
                            GM_setValue('cha',averageStock-parseInt(allStockDom[val].value))
                            changeReactInputValue(allStockDom[val],parseInt(allStockDom[val].value))
                        }
                    })
                    getRndInteger()
                }else if(e.altKey && e.keyCode === 190) {
                    // 是否精准更改库存
                    wucha = !wucha
                    if(wucha) {
                        toast('误差更改库存')
                    }else {
                        toast('精准更改库存')
                    }
                }else if(e.altKey && e.keyCode === 191) {
                    // Alt + ?
                    // 上传excel文件
                    document.querySelector('#file').click()
                    GM_setValue('ii',1)
                }else if(e.altKey && e.keyCode === 96) {
                    // 显示计划商品文本框
                    if(document.querySelector('#textarea').style.display == 'block') {
                        document.querySelector('#textarea').style.display = 'none'
                    }else {
                        document.querySelector('#textarea').style.display = 'block'
                    }
                    document.querySelector('#textarea').focus()
                    document.querySelector('#textarea').value = ''
                }else if(e.altKey && e.keyCode === 110) {
                    // alt + .
                    ceshi(GM_getValue('index',0))
                }else if(e.altKey && e.keyCode === 49) {
                    // Alt + 1
                    if(document.getElementsByClassName('right')[0].style.display == 'block') {
                        document.getElementsByClassName('right')[0].style.display = 'none'
                    }else {
                        document.getElementsByClassName('right')[0].style.display = 'block'
                    }
                    document.getElementById('stockMax').focus()
                    document.getElementById('stockMax').value = ''
                }else if(e.altKey && e.keyCode === 50) {
                    // Alt + 2
                    let i = GM_getValue('ii',1)
                    function updata() {
                        // 获取库存文本框Dom
                        let allStockDom = document.querySelectorAll('.ecom-g-table-row .ecom-g-input:not(.ecom-g-input-disabled)')
                        // 有库存的Dom索引
                        let stockDomIndex = []
                        let flag
                        for(let i = 0;i < allStockDom.length;i++) {
                            if(allStockDom[i].value !== '0') {
                                stockDomIndex.push(i)
                            }
                        }
                        // 暂定每个规格库存
                        let averageStock = Math.floor(GM_getValue('maxStock',20)/stockDomIndex.length) != 0 ? Math.floor(GM_getValue('maxStock',20)/stockDomIndex.length) : 1
                        console.log(averageStock)
                        stockDomIndex.forEach((val,idx) => {
                            let domValue = 0
                            let alldomValue = 0
                            stockDomIndex.forEach(val1 => {
                                alldomValue += parseInt(allStockDom[val1].value)
                                if(val1 < val) {
                                    domValue += parseInt(allStockDom[val1].value)
                                }
                            })
                            console.log(domValue)
                            if(alldomValue <= GM_getValue('maxStock',20)) return false
                            if(idx == 0) {
                                if(alldomValue >= GM_getValue('maxStock',20)) {
                                    if(stockDomIndex.length * averageStock >= GM_getValue('maxStock',20)) {
                                        if(allStockDom[val].value >= averageStock) {
                                            changeReactInputValue(allStockDom[val],averageStock)
                                        }
                                    }else if(parseInt(allStockDom[stockDomIndex[0]].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                        if(alldomValue-parseInt(allStockDom[stockDomIndex[0]].value) >= GM_getValue('maxStock',20)) {
                                            changeReactInputValue(allStockDom[val],averageStock)
                                        }else {
                                            changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                        }
                                    }
                                }
                            }else if(domValue < GM_getValue('maxStock',20)) {
                                if(stockDomIndex.length * averageStock >= GM_getValue('maxStock',20) && parseInt(allStockDom[val].value)+domValue <= GM_getValue('maxStock',20) && allStockDom[val].value >= averageStock) {
                                    changeReactInputValue(allStockDom[val],averageStock)
                                }else if(parseInt(allStockDom[val].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                    if(parseInt(allStockDom[val].value) >= GM_getValue('maxStock',20)-domValue && val != stockDomIndex[stockDomIndex.length-1] && allStockDom[val].value >= averageStock) {
                                        changeReactInputValue(allStockDom[val],averageStock)
                                    }else {
                                        if(allStockDom[val].value >= averageStock) {
                                            changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                        }
                                    }
                                }
                            }else{
                                if(domValue - GM_getValue('maxStock',20) >= 0) {
                                    changeReactInputValue(allStockDom[val],0)
                                }else {
                                    if(parseInt(allStockDom[val].value) >= Math.abs(domValue - GM_getValue('maxStock',20))) {
                                        changeReactInputValue(allStockDom[val], Math.abs(domValue - GM_getValue('maxStock',20)))
                                    }else {
                                        changeReactInputValue(allStockDom[val],averageStock)
                                    }
                                }
                            }

                        })
                    }
                    function autoStock(){
                        GM_setValue('ii',i)
                        if(parseInt(document.getElementsByClassName('ecom-g-sp-icon sp-icon-parcel style_editIcon__cahfa')[i].parentElement.parentElement.innerText) <= GM_getValue('maxStock',20)) {
                            i += 2
                            setTimeout(() => {autoStock()},2000)
                            return false
                        }else if(i > 40) {
                            return false
                        }
                        document.getElementsByClassName('ecom-g-sp-icon sp-icon-parcel style_editIcon__cahfa')[i].click()
                        fnstart()
                        let timer2 = setInterval(() => {
                            console.log(22222)
                            // 判断批量设置价格的文本框是否出现
                            setting = document.querySelector('.index_title__26QNA .ecom-g-select-selection-search-input')
                            if(document.getElementsByClassName('index_content__HNY0j')[0] && document.querySelector('.index_title__26QNA .ecom-g-select-selection-search-input')) {
                                clearInterval(timer2)
                                document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input-number-input')[0].focus()
                                // 修改库存
                                updata()
                                let autoprice = setInterval(() => {
                                    console.log(autoprice)
                                    // 判断批量设置价格的文本框是否还存在
                                    if(document.getElementsByClassName('index_content__HNY0j')[0] && document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input-number-input')[0]) {
                                        console.log(999999)
                                        if(document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2] || document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1]) {
                                            document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2] ? document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2].click() : document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1].click()
                                        }
                                    }else {
                                        clearInterval(autoprice)
                                        i += 2
                                        autoStock()
                                    }
                                },300)
                                }
                        },200)
                        setTimeout(() => {
                            clearInterval(timer2)
                        },15000)
                    }
                    autoStock()
                }else if(e.altKey && e.keyCode == 80) {
                    document.querySelectorAll('.auxo-checkbox-input')[0].click()
                    setTimeout(() => {
                        document.querySelectorAll('.auxo-btn')[4].click()
                        setTimeout(() => {
                            document.querySelectorAll('.auxo-modal-content .auxo-select-selection-search-input')[0].focus()
                            let event = document.createEvent("KeyboardEvent");
                            event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
                            document.querySelectorAll('.auxo-modal-content .auxo-select-selection-search-input')[0].dispatchEvent(event);
                            document.querySelectorAll('.auxo-modal-content .auxo-select-selection-search-input')[0].keyCode = 13
                            setTimeout(() => {
                                $('.auxo-select-item').last().click()
                                setTimeout(() => {
                                    document.querySelector('.auxo-modal-content .auxo-btn-primary').click()
                                },200)
                            },300)
                        },1000)
                    },500)
                }
            })
            Doms.searchInput.addEventListener('keydown', function (e) {
                if (e.keyCode == 13) {
                    Doms.searchInput.select()
                    document.execCommand('Copy')
                }
            })
            Doms.query.addEventListener('click',function() {
                setTimeout(() => {
                    Doms.searchInput.focus()
                    Doms.searchInput.addEventListener('keydown', function (e) {
                        if (e.keyCode == 13) {
                            Doms.searchInput.select()
                            document.execCommand('Copy')
                        }
                    })
                },1000)
            })
            let $html = document.querySelector('html')
            let $elem = document.createElement('input')
            $elem.style.position = 'fixed'
            $elem.style.left = '50%'
            $elem.style.top = '50%'
            $elem.style.width = '300px'
            $elem.style.height = '40px'
            $elem.style.transform = 'translate(-50%,-50%)'
            $elem.style.outline = 'none'
            $elem.style.borderRadius = '4px'
            $elem.style.border = '3px solid rgba(100, 86, 247,.6)'
            $elem.style.textAlign = 'center'
            $elem.style.fontSize = '18px'
            $elem.style.color = '#888'
            $elem.setAttribute("id", "price")
            $elem.setAttribute("placeholder","请输入价格")
            $elem.style.zIndex = 9999999999999999999
            $elem.setAttribute('autocomplete','off')
            $elem.style.display = 'none'
            $html.appendChild($elem)
            Doms.searchInput.focus()
            let styleDom = `
        <style>
        .right {
            display: none;
            position: fixed;
            right: 1%;
            top: 50%;
            transform: translate(0,-50%);
            z-index: 9999999999
        }
        #stockMax {
            width: 70px;
            text-align: center;
            outline: none;
            color: #1f6aff;
            border: 2px solid #1f6aff;
            border-radius: 3px;
            padding: 5px;
            background-color: #fff;
            font-size: 18px;
        }
        #stockMax::placeholder {
            font-size: 14px;
        }
        .taojian {
            display: none;
            font-size: 16px;
            padding: 2px 8px;
        }
         #file {
            position: absolute;
            display: none;
        }
         #textarea {
            display: none;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            outline: none;
            color: #1f6aff;
            border: 2px solid #1f6aff;
            border-radius: 3px;
            padding: 5px;
            z-index: 9999999999;
         }
         #textarea::-webkit-scrollbar {
            width: 0;
            height: 0;
         }
    </style>
    <input id="file" type="file" />
        <div id="main">
            <textarea id="textarea" rows="10" cols="33"></textarea>
            <div class="right">
                <input type='text' autocomplete="off" id='stockMax' placeholder="最大库存" value="${GM_getValue('maxStock',20)}">
            </div>
        </div>
        `
            document.body.insertAdjacentHTML("beforeend", styleDom);
            document.getElementById('stockMax').addEventListener('keydown',function(e) {
                if(e.keyCode == 13) {
                    GM_setValue('maxStock',document.getElementById('stockMax').value)
                    document.getElementsByClassName('right')[0].style.display = 'none'
                }
            })
            // 快速改价文本框的事件
            document.getElementById('price').addEventListener('keydown', function (e) {
                if (e.keyCode == 13) {
                    document.getElementById('price').style.display = 'none'
                    let timer2 = setInterval(() => {
                        console.log(22222)
                        // 判断批量设置价格的文本框是否出现
                        if(document.getElementsByClassName('index_content__HNY0j')[0] && document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0]) {
                            clearInterval(timer2)
                            document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0].focus()
                            // 修改价格
                            changeReactInputValue(document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0],document.getElementById('price').value)
                            let autoprice = setInterval(() => {
                                console.log(autoprice)
                                // 判断批量设置价格的文本框是否还存在
                                if(document.getElementsByClassName('index_content__HNY0j')[0] && document.getElementsByClassName('index_content__HNY0j')[0].getElementsByClassName('ecom-g-input')[0]) {
                                    // 继续发布商品按钮
                                    if(document.getElementsByClassName('ecom-g-modal-confirm-btns')[0] && document.getElementsByClassName('ecom-g-modal-confirm-btns')[0].children[0]) {
                                        document.getElementsByClassName('ecom-g-modal-confirm-btns')[0].children[0].click()
                                        clearInterval(autoprice)
                                        document.getElementById('price').value = ''
                                    }else {
                                        console.log(999999)
                                        if(document.querySelector('.index_content__HNY0j .ecom-g-btn.ecom-g-btn-dashed')) document.querySelector('.index_content__HNY0j .ecom-g-btn.ecom-g-btn-dashed').click()
                                        if(document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2] || document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1]) {
                                            document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2] ? document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[2].click() : document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1].click()
                                        }
                                    }
                                }else {
                                    console.log(autoprice)
                                    clearInterval(autoprice)
                                    document.getElementById('price').value = ''
                                }
                            },200)
                            // 15秒后自动停止
                            setTimeout(() => {
                                clearInterval(autoprice)
                            },15000)
                        }
                    },100)
                    }
            })
            // 读取本地excel文件
            document.querySelector('#file').addEventListener('change',function() {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {type: 'binary'});
                    // 处理excel文件
                    handle(workbook);
                };
                reader.readAsBinaryString(document.querySelector('#file').files[0]);
            })

            // 处理excel文件
            function handle(workbook) {
                // workbook.SheetNames[0] excel第一个sheet
                var datas = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                console.log(datas)
                if(datas.length > 0){
                    // 获取列名是汇总列名，避免某行某个字段没有值，会缺少字段
                    // 标题
                    /*
                var title = [];
                // 获取每行数据
                first:
                for(var index in datas){ // datas数组，index为索引
                    second:
                    for(var key in datas[index]){ // datas[index]对象,key为键
                        if (-1 === title.indexOf(key)) {
                            title.push(key);
                        }
                    }
                }
                // 列名
                console.log(title);
                */
                    // 数据
                    GM_setValue('jxdata',datas)
                    // 判断精选联盟和抖店商品在哪里分隔
                    for(let i = datas.length-1;i >= 0;i--) {
                        if(datas[i]["商品款号"] && datas[i]["商品款号"].indexOf('H') != -1 && datas[i]["商品款号"].length > 4) {
                            GM_setValue('fenge',i+1)
                            console.log(datas[i]["商品款号"])
                            console.log(i)
                            break;
                        }
                    }
                }
            }
            document.querySelector('#textarea').addEventListener('keydown',function(e) {
                if(e.keyCode == 13) {
                    let arr = document.querySelector('#textarea').value.split('\n')
                    console.log(arr)
                    e.preventDefault()
                    let result = '',error = '',errorindex = 0
                    let jxdata = GM_getValue('jxdata',null)
                    console.log(jxdata)
                    for(let i = 0,len = arr.length;i < len;i++) {
                        // 判断是否是精选联盟商品
                        if(arr[i].indexOf('H') != -1 || arr[i].indexOf('H') != -1 && arr[i].length > 4) {
                            jxdata.some(val => {
                                //console.log(arr[i])
                                if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == arr[i].trim().toUpperCase()) {
                                    result += val["产品链接"]+"\n"
                                    return true
                                }
                            })
                            // 判断是否有错误款号
                            console.log(result.split('\n').length-2)
                            console.log("i="+i)
                            if(i != 0 && result.split('\n').length-2+errorindex != i) {
                                error += arr[i]+"\n"
                                errorindex++
                            }
                        }else{
                            for(let j = GM_getValue('fenge',2000),len1 = jxdata.length;j < len1-1;j++) {
                                //console.log(jxdata[j]["商品款号"])
                                if(jxdata[j]["商品款号"] && jxdata[j]["商品款号"] != "" && jxdata[j]["商品款号"] == arr[i].trim().toUpperCase()) {
                                    result += jxdata[j]["产品链接"]+"\n"
                                    break;
                                }
                            }
                            // 判断是否有错误款号
                            console.log(result.split('\n').length-2)
                            console.log("i="+i)
                            if(i != 0 && result.split('\n').length-2+errorindex != i) {
                                error += arr[i]+"\n"
                                errorindex++
                            }
                        }
                    }
                    console.log(error.trim())
                    if(error.trim() != "") {
                        console.log(error)
                        toast('错误款号：\n'+error.trim())
                    }else {
                        copyToClip(result)
                        toast('复制成功')
                    }
                    document.querySelector('#textarea').value = ''
                    document.querySelector('#textarea').focus()
                }
            })
            GM_addValueChangeListener("goodsname", function(key, oldValue, newValue, remote) {
                console.log(key, oldValue, newValue, remote)
                console.log('修改了款号');
            });
            GM_setValue("goodsname",'1000')

        },1000)
    }
})();