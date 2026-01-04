// ==UserScript==
// @name         新版直播中控台
// @namespace    http://tampermonkey.net/
// @version      1.5.41
// @description  巨量百应直播中控台
// @author       许大包
// @match        https://buyin.jinritemai.com/dashboard/live*
// @match        https://compass.jinritemai.com/talent/product-analysis*
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        window.focus
// @run-at       document-end


// @downloadURL https://update.greasyfork.org/scripts/527898/%E6%96%B0%E7%89%88%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/527898/%E6%96%B0%E7%89%88%E7%9B%B4%E6%92%AD%E4%B8%AD%E6%8E%A7%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
    // @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
    let timer,jiangjie,bodygoods,yishangjiaDom,shangjiaDom,goodsitemDom,goodsnameDom,scrollDom,alwaysjiangjietimer,alwaysjiangjietimer1
    let kuanhao = '',fixedNum = '',fixedGoodsname= '',oldkeydowntime = null
    let closelen = document.getElementsByClassName('index__delete___2D1j3').length
    let speed = false,speed1 = true,zhuanshuStockModel = false,alwaysjiangjie = true
    let ii = 0
    let first = 1
    let mouseout = new Event('mouseout', { bubbles: true })
    let mouseover = new Event('mouseover', { bubbles: true })
    let Doms = {
        addgoodsBtn: '.auxo-btn.auxo-btn-primary', //添加商品按钮
        refresh: '.actionItem-Mrn7Di', // 刷新商品列表
        searchinputDom: '.search-a3bWUY .auxo-input', // 查找商品文本框中的input
        goodsurlBtn: '.auxo-tabs-tab-btn', // 商品链接按钮
        pastegoodsdivDom: '#shop-window-url-edit', // 粘贴商品链接的DIV
        querenaddgoodsBtn: '.auxo-btn.auxo-btn-primary.submit-ZCHhcj', // 确认添加商品按钮
        closeBtn: 'close-sZosI4', // 右上角关闭按钮
        liveBtn: '.auxo-modal-content .auxo-btn-primary', // 确认离开文本框
        shibieBtn: '.auxo-btn.auxo-btn-primary.linkBtn-WC77Hu', // 识别链接按钮
        fudaicloseBtn: '.buyin-drawer-close', // 福袋窗口关闭按钮
        stockcloseBtn: '.auxo-drawer-close', // 管理库存关闭按钮
        goodslistDom: '#live-control-goods-list-container', // 商品列表
        goodsitemDom: '.goodsItem-KBGOY5', // 单个商品Dom（1号链接、2号链接）
        goodsitemfnBtn: '.lvc2-grey-btn', // 单个商品Dom中的功能按钮例如讲解
        itemradioBtn: '.auxo-radio-input', //商品单选按钮
        batchfillBtn: '.exclusive-goods-details__batch-operation .auxo-btn', // 专属库存中批量填充按钮
        stockbatchfillBtn: '.fieldSubHeader-q2KCJt .auxo-btn', // 库存管理中批量填充按钮
        zhuanshuskuDom: '.exclusive-goods-details .auxo-input', // 专属库存SKU文本框
        stockskuDom: '.auxo-table .auxo-input', // 库存管理SKU文本框
        querenaddBtn: '.auxo-drawer-footer .auxo-btn-primary', // 专属库存中确认添加按钮
        iframemlDom: '.auxo-col.auxo-col-16', // "直播商品"DOM
        iframegoodstitle: '.title-tJbnZl', // 直播计划商品的标题
        iframegoodslist: '.productList-cttutv', // 直播计划商品列表
        iframegoodsitem: '.productCardContainer-UsBAE1', // 直播计划商品链接（1号、2号）
        iframegoodswent: '.auxo-btn:contains("已上架"):last()', // 直播计划商品已上架按钮
        firamegoodsgo: '.auxo-btn:contains("上架")', // 直播计划商品上架按钮
        iframeupdateplan: '.auxo-btn.auxo-btn-dashed' // 更换商品按钮
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

    if(true) {
        /**
        * @param {Function} fn 目标函数
        * @param {Number} time 延迟执行毫秒数
        * @param {Boolean} immediate true - 立即执行 false - 延迟执行
        * @description 防抖函数
        */
        function debounce(fn, time, immediate) {
            let timer
            immediate = immediate || false
            return function() {
                const that = this
                const args = arguments
                if (timer) clearTimeout(timer)
                if (immediate) {
                    const callNow = !timer
                    timer = setTimeout(() => {
                        timer = null
                    }, time)
                    if (callNow) {
                        fn.apply(that, args)
                    }
                } else {
                    timer = setTimeout(() => {
                        fn.apply(that, args)
                    }, time)
                }
            }
        }
        /**
        * @param {Function} fn 目标函数
        * @param {Number} time 延迟执行毫秒数
        * @param {Boolean} type 1-立即执行，2-不立即执行
        * @description 节流函数
        */
        function throttle(fn, time, type = false) {
            let previous = 0
            let timeout
            return function() {
                let that = this
                let args = arguments
                if (type) {
                    let now = Date.now()
                    if (now - previous > time) {
                        fn.apply(that, args)
                        previous = now
                    }
                } else {
                    if (!timeout) {
                        timeout = setTimeout(() => {
                            timeout = null
                            fn.apply(that, args)
                        }, time)
                    }
                }
            }
        }
        function waitForElement(selector, callback) {
            if (document.querySelector(selector)) {
                callback();
            } else {
                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        callback();
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
        // 复制到粘贴板的方法
        function copyToClip(content, message) {
            var aux = document.createElement("input")
            aux.setAttribute("value", content)
            document.body.appendChild(aux)
            aux.select()
            document.execCommand("copy")
            document.body.removeChild(aux)
            if (message == null) {
                toast("复制成功");
            }else if (message == '') {
                return
            }else{
                toast(message+'复制成功');
            }
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
            inputDom.dispatchEvent(event)
        }
        // 生成随机数的方法
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
        function toast(text,time,id) {
            $('#ccc').remove()
            clearInterval(GM_getValue('aaaa',""))
            clearTimeout(GM_getValue('bbbb',""))
            let $html1 = document.querySelector('html')
            let $toast = document.createElement('div')
            let timer = time || 2000
            let toastid = id || "ccc"
            $toast.style.position = 'fixed'
            $toast.style.left = '10px'
            $toast.style.top = '20%'
            if(toastid != "ccc") $toast.style.top = '40%'
            $toast.innerText = text
            $toast.style.padding = '6px 10px'
            $toast.style.borderRadius = '8px'
            $toast.style.opacity = 0
            $toast.style.color = '#fff'
            $toast.style.lineHeight = '30px'
            //$toast.style.background = 'rgba(100, 86, 247,.6)'
            $toast.style.background = 'rgb(169, 187, 267)'
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
                    let bbbb = setTimeout(() => {
                        if(document.querySelector('#'+toastid)) $html1.removeChild(document.querySelector('#'+toastid))
                    }, timer);
                    GM_setValue('bbbb',bbbb)
                }
            }, 15)
            GM_setValue('aaaa',aaaa)
        }
        function outurlFn() {
            //console.log('开始开始')
            clearInterval(GM_getValue('timer',timer))
            timer = setInterval(() => {
                console.log('666666')
                if(document.querySelectorAll(Doms.shibieBtn)[0] && !document.querySelectorAll(Doms.shibieBtn)[0].disabled) {
                    clearInterval(GM_getValue('timer',timer))
                    //  识别链接
                    document.querySelectorAll(Doms.shibieBtn)[0].click()
                    if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/pending-goods/create') != -1) {
                        setTimeout(urlshangjiaFn,1500)
                    }else {
                        setTimeout(urlshangjiaFn,500)
                    }
                }
            },200)
            clearInterval(GM_getValue('timer',timer))
            GM_setValue('timer',timer)
            setTimeout(() => {
                clearInterval(GM_getValue('timer',timer))
            },10000)
        }
        // 搜索我的店铺的商品
        function storeurlFn() {
            let old = null
            let searchInput = $(".auxo-input-affix-wrapper").find('.auxo-input')
            // 在输入之后如果800ms内没有再输入则点击搜索
            searchInput.on("input propertychange",debounce(fn,800))
            function fn() {
                if(GM_getValue('timer',timer)) clearInterval(GM_getValue('timer',timer))
                // 点击搜索
                document.querySelectorAll('.auxo-btn.auxo-btn-icon-only.auxo-input-search-button')[0].click()
                timer = setInterval(() => {
                    console.log('777777')
                    if(document.querySelectorAll('.auxo-checkbox-group')[0] && document.getElementsByClassName('index-module__goodItemWrapper___1NTyE').length==1 || document.getElementsByClassName('index-module__goodItemWrapper___1NTyE').length==2 || document.getElementsByClassName('index-module__goodName___1XhiJ')[0].innerText.match(/\w+$/) && document.getElementsByClassName('index-module__goodName___1XhiJ')[0].innerText.match(/\w+$/)[0] == kuanhao) {
                        clearInterval(GM_getValue('timer',timer))
                        clearInterval(timer)
                        if(document.querySelectorAll('.auxo-checkbox-group')[0] && !document.querySelectorAll('.auxo-checkbox-group')[0].querySelectorAll('.auxo-checkbox-input')[0].checked) {
                            document.querySelectorAll('.auxo-checkbox-group')[0].querySelectorAll('.auxo-checkbox-input')[0].click()
                        }
                        setTimeout(() => {
                            document.querySelectorAll('.auxo-btn.auxo-btn-primary.index-module__submit___3zp35')[0].click()
                            kuanhao = ''
                            document.querySelector('#kuanhao').value = ''
                            if(GM_getValue('speed',false)) {
                                let jiangjie = setTimeout(() => {
                                    let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                                    for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                        if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                            b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                        }
                                    }
                                },3000)
                                GM_setValue('jiangjie',jiangjie)
                            }
                        },400)
                    }
                },200)
                clearInterval(GM_getValue('timer',timer))
                GM_setValue('timer',timer)
                setTimeout(() => {
                    clearInterval(timer)
                    clearInterval(GM_getValue('timer',timer))
                },20000)
            }
        }
        // 识别链接上架弹讲解
        function urlshangjiaFn() {
            if(document.getElementsByClassName('index__fail___18Zzx').length <= 0) {
                timer = setInterval(() => {
                    console.log('77777777')
                    if(document.querySelectorAll(Doms.querenaddgoodsBtn)[0] && !document.querySelectorAll(Doms.querenaddgoodsBtn)[0].disabled) {
                        clearInterval(GM_getValue('timer',timer))
                        if(!speed1) return false
                        // 判断是否会跳转到下一步渠道品库存
                        if(document.querySelectorAll(Doms.querenaddgoodsBtn)[0].innerText == '下一步') {
                            setTimeout(() => {
                                document.querySelectorAll(Doms.querenaddgoodsBtn)[0].click()
                            },800)
                        }
                        document.querySelectorAll(Doms.querenaddgoodsBtn)[0].click()
                        if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/pending-goods/create') != -1) {return false}
                        if(GM_getValue('speed',false)) {
                            let jiangjie = setTimeout(() => {
                                let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                    }
                                }
                            },3000)
                            GM_setValue('jiangjie',jiangjie)
                        }
                    }
                },500)
                clearInterval(GM_getValue('timer',timer))
                GM_setValue('timer',timer)
            }else {
                let goodsname = ''
                for(let i = 0;i < document.getElementsByClassName('index__fail___18Zzx').length;i++) {
                    if(goodsname != '') {
                        goodsname = goodsname+'\n'+document.getElementsByClassName('index__fail___18Zzx')[i].parentElement.parentElement.children[0].innerText
                    }else {
                        goodsname = document.getElementsByClassName('index__fail___18Zzx')[i].parentElement.parentElement.children[0].innerText
                    }
                }
                toast(goodsname,9999999)
            }
        }
        // 删除商品计划的方法
        function removegoodsFn() {
            if(document.getElementsByClassName('auxo-table-row').length == 0) return
            $('.auxo-checkbox-wrapper').eq(0).click()
            document.getElementsByClassName('auxo-select-selection-search-input')[1].focus()
            let event = document.createEvent("KeyboardEvent");
            event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
            document.getElementsByClassName('auxo-select-selection-search-input')[1].dispatchEvent(event);
            document.getElementsByClassName('auxo-select-selection-search-input')[1].keyCode = 13
            setTimeout(() => {
                document.getElementsByClassName('auxo-select-item auxo-select-item-option')[2].click()
                setTimeout(() => {
                    document.getElementsByClassName('auxo-btn auxo-btn-primary index__btn___1F2K1')[0].click()
                    setTimeout(() => {
                        removegoodsFn()
                    },500)
                },1000)
            },500)

        }
        //删除小黄车链接的方法
        let closefn = function() {
            if(GM_getValue('closefn',false)) {
                // 判断滚动条是否到底
                let scrollDom = document.querySelector(Doms.goodslistDom).children[0]
                if(Math.ceil(scrollDom.clientHeight + scrollDom.scrollTop) < scrollDom.scrollHeight || first != $(Doms.itemradioBtn).length) {
                    console.log(GM_getValue('passName','').trim())
                    console.log($(Doms.itemradioBtn).eq(first).parents('.auxo-radio-checked').length == 0)
                    if(parseInt($(Doms.itemradioBtn).eq(first).parents(Doms.goodsitemDom).find('.auxo-input').val()) > GM_getValue('stockMax',10) &&
                       $(Doms.itemradioBtn).eq(first).parents(Doms.goodsitemDom).find('.goodsImgStatus-rnAkir').length == 0 && // 是否有库存
                       $(Doms.itemradioBtn).eq(first).parents('.auxo-radio-checked').length == 0 && // 是否已经被选中
                       $(Doms.itemradioBtn).eq(first).parents(Doms.goodsitemDom).find('.warning-AFDhMH').length == 0 && // 是否预热中
                       GM_getValue('passName','').trim().split(',').every(val => $(Doms.itemradioBtn).eq(first).parents(Doms.goodsitemDom).find('.title-h8R0c6').text() != val)) {
                        $(Doms.itemradioBtn)[first].click()
                        console.log('点击按钮')
                    }
                    setTimeout(() => {
                        if(first == $(Doms.itemradioBtn).length) {
                            $('#live-control-goods-list-container').children().scrollTop($('#live-control-goods-list-container').children().scrollTop()+1200)
                            first = 0
                        }
                        first++
                        closefn()
                    },50)
                }else {
                    setTimeout(() => {
                        setTimeout(() => {
                            for(let i = 0;i < document.getElementsByClassName('auxo-btn').length; i++){
                                if(document.getElementsByClassName('auxo-btn')[i].children[0].innerText == '删除') {
                                    document.getElementsByClassName('auxo-btn')[i].click()
                                    waitForElement('.auxo-modal-confirm-btns',() => {
                                        for(let j = 0;j < document.getElementsByClassName('auxo-btn auxo-btn-primary').length; j++){
                                            if(document.getElementsByClassName('auxo-btn auxo-btn-primary')[j].children[0].innerText == '确认') {
                                                document.getElementsByClassName('auxo-btn auxo-btn-primary')[j].click()
                                                $('#live-control-goods-list-container').children().scrollTop(0)
                                            }
                                        }
                                    })
                                    break;
                                }
                            }
                        },300)
                    },500)
                }
            }else {
                document.querySelectorAll('.panelBody-lHvLP2 .auxo-checkbox-input')[0].click()
                let raido = document.getElementsByClassName('auxo-radio-input')
                $('#live-control-goods-list-container').children().scrollTop(0)
                for (let i = 0; i < raido.length; i++) {
                    raido[i].click()
                }
                setTimeout(() => {
                    setTimeout(() => {
                        for(let i = 0;i < document.getElementsByClassName('auxo-btn').length; i++){
                            if(document.getElementsByClassName('auxo-btn')[i].children[0].innerText == '删除') {
                                document.getElementsByClassName('auxo-btn')[i].click()
                                waitForElement('.auxo-modal-confirm-btns',() => {
                                    for(let j = 0;j < document.getElementsByClassName('auxo-btn auxo-btn-primary').length; j++){
                                        if(document.getElementsByClassName('auxo-btn auxo-btn-primary')[j].children[0].innerText == '确认') {
                                            document.getElementsByClassName('auxo-btn auxo-btn-primary')[j].click()
                                        }
                                    }
                                })
                                break;
                            }
                        }

                    },300)
                },1000)
            }
        }
        // 固定链接序号的方法
        function fixedGoodsitemFn(k) {
            if(GM_getValue('fixedGoodsname','') != '' && k < GM_getValue('fixedGoodsname','').length) {
                for(let i = 0;i < document.querySelectorAll(Doms.goodsitemDom).length;i++) {
                    if($(Doms.itemradioBtn).eq(i).parents(Doms.goodsitemDom).find('.title-h8R0c6').text() == GM_getValue('fixedGoodsname','')[k]) {
                        console.log(GM_getValue('fixedGoodsname',''))
                        $(Doms.itemradioBtn).eq(i).parents(Doms.goodsitemDom).find('.auxo-input')[0].focus()
                        changeReactInputValue($(Doms.itemradioBtn).eq(i).parents(Doms.goodsitemDom).find('.auxo-input')[0],GM_getValue('fixedNum','')[k])
                        if(k == GM_getValue('fixedGoodsname','').length-1) {
                            setTimeout(() => {
                                $(Doms.itemradioBtn).eq(i).parents(Doms.goodsitemDom).find('.auxo-input')[0].blur()
                            },800)
                        }else if(GM_getValue('fixedGoodsname','').length == 1) {
                            setTimeout(() => {
                                $(Doms.itemradioBtn).eq(i).parents(Doms.goodsitemDom).find('.auxo-input')[0].blur()
                            },300)
                        }
                        k++
                        setTimeout(() => {
                            fixedGoodsitemFn(k)
                        },1500)
                        break;
                    }
                }
            }
        }
        // 一键上架的方法
        function autoshangjiaFn() {
            if(kuanhao.trim() != '') {
                let goodsurl
                if(GM_getValue('jxdata',null) != null) {
                    GM_getValue('jxdata',null).some(val => {
                        console.log(val["商品款号"])
                        //console.log(val["产品链接"])
                        if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == kuanhao.trim().toUpperCase() || val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0].split('H')[1] == kuanhao.trim().toUpperCase() || val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0].split('J')[1] == kuanhao.trim().toUpperCase()) {
                            copyToClip(val["产品链接"],'')
                            goodsurl = val["产品链接"]
                            // 匹配最多保留两位小数的数字
                            try{
                                if(val["商品名称-价格"].match(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")) {
                                    toast("价格："+val["商品名称-价格"].match(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")[0]+"\n"+val["商品名称-价格"].replace(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")+"\n"+val["佣金比例"],20000)
                                    console.log(val["商品名称-价格"])
                                }else {
                                    toast(val["商品名称-价格"].replace(/^([1-9][0-9]*)+(\.[0-9]{1,2})?/ig,"")+"\n"+val["佣金比例"],20000)
                                    console.log(val["商品名称-价格"])
                                }
                            }catch{}
                            return true
                        }
                    })
                }
                document.querySelector(Doms.addgoodsBtn).click()
                waitForElement(Doms.goodsurlBtn,() => {
                    console.log('1212121')
                    if(document.querySelectorAll(Doms.goodsurlBtn)[1]) {
                        document.querySelectorAll(Doms.goodsurlBtn)[1].click()
                        clearInterval(GM_getValue('timer',timer))
                        // 点击商品链接
                        waitForElement(Doms.pastegoodsdivDom,() => {
                            let target = document.querySelector(Doms.pastegoodsdivDom)
                            target.setAttribute('contentEditable','true')
                            target.focus()
                            kuanhao = ''
                            // 添加外部链接的方法
                            target.onpaste = throttle(outurlFn,1000,true)
                            // 模拟粘贴事件
                            const pasteEvent = new Event('paste', {
                                bubbles: true,    // 允许事件冒泡
                                cancelable: true  // 允许阻止默认行为
                            });
                            // 添加模拟的剪贴板数据
                            pasteEvent.clipboardData = {
                                getData: (type = 'text/plain') => goodsurl
                            };
                            // 触发事件
                            target.dispatchEvent(pasteEvent);
                        })
                    }
                })
            }
            /*
            else if(kuanhao.trim() !=''){
                document.querySelector(Doms.addgoodsBtn).click()
                timer = setInterval(() => {
                    console.log('77777777')
                    if(document.getElementsByClassName('auxo-tabs-tab')[4]) {
                        clearInterval(GM_getValue('timer',timer))
                        setTimeout(() => {
                            let btn = document.getElementsByClassName('auxo-tabs-tab')[8].children[0].children[0].innerText == '专属计划商品' ? document.getElementsByClassName('auxo-tabs-tab')[8] : document.getElementsByClassName('auxo-tabs-tab')[7]
                            btn.click()
                            document.getElementsByClassName('auxo-input')[document.getElementsByClassName('auxo-input').length-1].placeholder == '搜索商品名称或ID' ? document.getElementsByClassName('auxo-input')[document.getElementsByClassName('auxo-input').length-1].focus() : document.getElementsByClassName('auxo-input')[document.getElementsByClassName('auxo-input').length-2].focus()
                            storeurlFn()
                            setTimeout(() => {
                                changeReactInputValue($(".auxo-input-affix-wrapper .auxo-input").last()[0],kuanhao)
                            },500)
                        },100)
                    }
                },400)
                clearInterval(GM_getValue('timer',''))
                GM_setValue('timer',timer)
            }
            */
        }
        // 点击超级福袋的方法
        function fudai() {
            let dom = document.querySelectorAll('.title-hvSEFi')
            for(let i = 0;i < dom.length;i++) {
                if(dom[i].innerText == '超级福袋') {
                    dom[i].click()
                    setTimeout(() => {
                        document.querySelectorAll('.buyin-select-selection-search-input')[0].focus()
                        let event = document.createEvent("KeyboardEvent");
                        event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
                        document.querySelectorAll('.buyin-select-selection-search-input')[0].dispatchEvent(event);
                        document.querySelectorAll('.buyin-select-selection-search-input')[0].keyCode = 13
                        setTimeout(() => {
                            document.querySelectorAll('.buyin-select-item-option')[1].click()
                            document.querySelectorAll('.buyin-select-selection-search-input')[0].blur()
                            setTimeout(() => {
                                document.getElementsByClassName('buyin-btn buyin-btn-dashed')[0].click()
                                //document.getElementsByClassName('buyin-btn buyin-btn-primary')[0].click()
                            },100)
                        },100)
                    },500)
                    break;
                }
            }
        }

        window.addEventListener('keydown', function (e) {
            // Alt + Q
            if(e.altKey && e.keyCode == 81) {
                clearInterval(GM_getValue('timer',''))
                if(document.querySelector('.auxo-drawer-content .auxo-checkbox-input')) {
                    if(!document.querySelector('.auxo-drawer-content .auxo-checkbox-wrapper-checked')) {
                        // 判断是否选中
                        document.querySelector('.auxo-drawer-content .auxo-checkbox-input').click()
                    }
                }
            }
            // Alt + W
            else if(e.altKey && e.keyCode == 87) {
                clearInterval(GM_getValue('timer',''))
                if(document.querySelector('.back-A__dp0')) document.querySelector('.back-A__dp0').click()
                if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/pending-goods/list') != -1) {
                    let number = $('.index-module__title___1YyWm:first').length > 0 ? parseInt($('.index-module__title___1YyWm:first').text()) : 0
                    $('.auxo-btn.auxo-btn-primary.index-module__create___35FOv').click()
                    setTimeout(() => {
                        changeReactInputValue($('.auxo-input:first')[0],number+1+'号架')
                    },1000)
                }
                if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/pending-goods/create') != -1) {
                    document.querySelectorAll('.auxo-btn.auxo-btn-dashed')[0].click()
                }else {
                    document.querySelector(Doms.addgoodsBtn).click()
                    if(document.querySelector('.auxo-drawer-content .auxo-checkbox-wrapper-checked')) {
                        // 判断是否选中
                        document.querySelector('.auxo-drawer-content .auxo-checkbox-input').click()
                    }
                }
                waitForElement(Doms.goodsurlBtn,() => {
                    console.log('03030303')
                    if(document.querySelectorAll(Doms.goodsurlBtn)[1]) {
                        clearInterval(GM_getValue('timer',timer))
                        // 点击商品链接
                        console.log(33333)
                        document.querySelectorAll(Doms.goodsurlBtn)[1].click()
                        document.querySelectorAll(Doms.pastegoodsdivDom)[0].setAttribute('contentEditable','true')
                        document.querySelectorAll(Doms.pastegoodsdivDom)[0].focus()
                        // 添加外部链接的方法
                        document.querySelector(Doms.pastegoodsdivDom).onpaste = throttle(outurlFn,1000,true)
                    }
                })
            }else if(e.altKey && e.keyCode == 88) {
                // 连续按两次ALT + X
                let nowkeydowntime = new Date().getTime()
                if(oldkeydowntime != null) {
                    if(nowkeydowntime - oldkeydowntime <= 400 && nowkeydowntime - oldkeydowntime >=100 ) {
                        // 固定商品链接序号
                        let k = 0
                        setTimeout(() => {
                            throttle(fixedGoodsitemFn(k),1000,true)
                        },200)
                    }
                }
                oldkeydowntime = new Date().getTime()
                // Alt + X
                // 刷新商品列表
                if(document.querySelector('#xuhao').style.display == 'block') {
                    document.querySelector(Doms.goodslistDom).children[0].scrollTop = 9999999
                    document.querySelector('html').scrollTop = 999999
                }else {
                    document.querySelector(Doms.goodslistDom) ? document.querySelector(Doms.goodslistDom).children[0].scrollTop = 0 : ''
                    let srarchDon = document.querySelector(Doms.refresh) ? document.querySelector(Doms.refresh) : window.parent.document.querySelector(Doms.refresh)
                    srarchDon.click()
                    document.querySelector(Doms.searchinputDom).focus()
                    document.querySelector(Doms.searchinputDom).select()
                    document.querySelector(Doms.searchinputDom).onkeydown = function(e) {
                        if(e.keyCode == 13) {
                            changeReactInputValue(document.querySelector(Doms.searchinputDom),document.querySelector(Doms.searchinputDom).value.toUpperCase())
                            if(document.querySelector(Doms.searchinputDom).value.indexOf('H') != -1 || document.querySelector(Doms.searchinputDom).value.indexOf('J') != -1) {
                                GM_getValue('jxdata',null).some(val => {
                                    console.log(val["商品款号"])
                                    if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == document.querySelector(Doms.searchinputDom).value) {
                                        changeReactInputValue(document.querySelector(Doms.searchinputDom),val["产品链接"].split('id=')[1].split('&')[0])
                                        return true
                                    }
                                })
                            }
                            setTimeout(() => {
                                let activeDom = document.getElementsByClassName('goodsItem-KBGOY5 highlight-zCf6ZV')[0] ? document.getElementsByClassName('goodsItem-KBGOY5 highlight-zCf6ZV')[0].getElementsByClassName('auxo-input')[0] : document.querySelector('#myiframe').contentWindow.document.getElementsByClassName('goodsItem-KBGOY5 highlight-zCf6ZV')[0].getElementsByClassName('auxo-input')[0]
                                activeDom.focus()
                                changeReactInputValue(activeDom,1)
                                setTimeout(() => {
                                    let scrollDom = document.querySelector(Doms.goodslistDom).children[0]
                                    scrollDom.scrollTop = 0
                                    document.querySelector(Doms.searchinputDom).focus()
                                    document.querySelector(Doms.searchinputDom).select()
                                },400)
                            },800)
                        }
                    }
                }
            }else if(e.altKey && e.keyCode === 13) {
                if(window.location.href.indexOf('https://compass.jinritemai.com/talent/product-analysis') == -1) {
                    // 发送第一个超级福袋
                    // document.querySelectorAll('.buyin-btn.buyin-btn-dashed')[0].click()
                    document.getElementsByClassName('buyin-btn buyin-btn-dashed')[1].click()
                }
            }else if(e.altKey && e.keyCode === 111) {
                // alt + /
                // 删除第一个商品链接
                let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '下架') {
                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                    }
                }
            }else if(e.altKey && e.keyCode === 38) {
                // alt + ↑
                goosplan(-1)
            }else if(e.altKey && e.keyCode === 40) {
                // alt + ↓
                goosplan()
            }else if(e.keyCode == 13) {
                if(window.location.href.indexOf('https://compass.jinritemai.com/talent/product-analysis') == -1){
                    if(kuanhao != '') {
                        console.log(kuanhao)
                    }else {
                        if(document.querySelectorAll(Doms.querenaddgoodsBtn)[0]) {
                            document.querySelectorAll(Doms.querenaddgoodsBtn)[0].click()
                        }
                    }
                }
            } else if(e.altKey && e.keyCode === 49) {
                // Alt + 1
                if(document.getElementsByClassName('flagDom')[0].style.display == 'block') {
                    document.getElementsByClassName('flagDom')[0].style.display = 'none'
                }else {
                    document.getElementsByClassName('flagDom')[0].style.display = 'block'
                }
                document.getElementById('zhuanshuStock').focus()
            }else if(e.altKey && e.keyCode == 83) {
                //alt + S
                clearInterval(GM_getValue('timer',''))
                if(document.querySelector('#iframe') && document.querySelector('#iframe').style.display == 'block') {
                    goosplan()
                    // 判断是否是旧版达人专属营销页面
                }else if($(Doms.batchfillBtn).parents('.auxo-drawer-content-wrapper').css('transform') == 'none') {
                    if(zhuanshuStockModel) {
                        changeReactInputValue(document.querySelector('.auxo-input-number-input'),1)
                        document.querySelector(Doms.batchfillBtn).click()
                        document.querySelector(Doms.querenaddBtn).click()
                    }else {
                        let skuDoms = document.querySelectorAll(Doms.zhuanshuskuDom)
                        let i = 0
                        function changeFn() {
                            console.log(i)
                            if(i < GM_getValue('zhuanshuStock',2)) {
                                // &判断剩余专属库存是否大于0
                                if(i < skuDoms.length && parseInt($(Doms.zhuanshuskuDom).eq(i).parents('.exclusive-product-stock-table__row').children().find('p')[2].innerText.replace(',','')) > 0) {
                                    changeReactInputValue(skuDoms[i],1)
                                    // 判断剩余专属库存是否大于修改数
                                }else if(parseInt($(Doms.zhuanshuskuDom).eq(i%skuDoms.length).parents('.exclusive-product-stock-table__row').children().find('p')[2].innerText.replace(',','')) >= parseInt(skuDoms[i%skuDoms.length].value)+1){
                                    console.log($(Doms.zhuanshuskuDom).eq(i%skuDoms.length).parents('.exclusive-product-stock-table__row').children().find('p')[2])
                                    changeReactInputValue(skuDoms[i%skuDoms.length],parseInt(skuDoms[i%skuDoms.length].value)+1)
                                }
                                i++
                                changeFn()
                            }else if(i < skuDoms.length){
                                changeReactInputValue(skuDoms[i],0)
                                i++
                                changeFn()
                            }else {
                                $(Doms.querenaddBtn+':contains("确认")').click()
                            }
                        }
                        changeFn()
                    }
                    // 判断是否是新版库存管理页面
                }else if(document.querySelector(Doms.stockbatchfillBtn)) {
                    let i = 0
                    let skuDoms
                    // 如果页面没有打开，点击第一个库存管理
                    if($(Doms.stockbatchfillBtn).parents('.auxo-drawer-content-wrapper').css('transform') != 'none') {
                        $('.lvc2-grey-btn:contains(库存管理)')[0].click()
                        setTimeout(() => {
                            skuDoms = document.querySelectorAll(Doms.stockskuDom)
                            changeFn()
                        },800)
                    }else {
                        skuDoms = document.querySelectorAll(Doms.stockskuDom)
                        changeFn()
                    }
                    function changeFn() {
                        console.log(i)
                        if(i < GM_getValue('zhuanshuStock',2)) {
                            // &判断剩余专属库存是否大于0
                            if(i < skuDoms.length && parseInt($(Doms.stockskuDom).eq(i).parents('.auxo-table-row').find('.auxo-table-cell')[2].innerText.replace(',','')) > 0) {
                                changeReactInputValue(skuDoms[i],1)
                                // 判断剩余专属库存是否大于修改数
                            }else if(parseInt($(Doms.stockskuDom).eq(i%skuDoms.length).parents('.auxo-table-row').find('.auxo-table-cell')[2].innerText.replace(',','')) >= parseInt(skuDoms[i%skuDoms.length].value)+1){
                                console.log(parseInt(skuDoms[i%skuDoms.length].value)+1)
                                changeReactInputValue(skuDoms[i%skuDoms.length],parseInt(skuDoms[i%skuDoms.length].value)+1)
                            }
                            i++
                            changeFn()
                        }else if(i < skuDoms.length){
                            changeReactInputValue(skuDoms[i],0)
                            i++
                            changeFn()
                        }else {
                            $(Doms.querenaddBtn+':contains("确定")').click()
                        }
                    }
                }
            }else if(e.altKey && e.keyCode === 86) {
                // alt + V
                if(document.querySelector('.live-dashboard-exclusive-goods-list__stocks .auxo-select-selection-search-input')) {
                    document.getElementsByClassName('auxo-select-selection-search-input')[0].focus()
                    let event = document.createEvent("KeyboardEvent");
                    event.initKeyboardEvent("keydown", true, true, document.defaultView, "a", 0, "Shift", 0);
                    document.getElementsByClassName('auxo-select-selection-search-input')[0].dispatchEvent(event);
                    document.getElementsByClassName('auxo-select-selection-search-input')[0].keyCode = 13
                    // 点击专属价
                    document.getElementsByClassName('auxo-select-item-option-content')[1].click()
                }else {
                    if($(Doms.goodsitemDom).eq(0).find('.lvc2-grey-btn:contains("专属价设置")')[0]) {
                        $(Doms.goodsitemDom).eq(0).find('.lvc2-grey-btn:contains("专属价设置")').click()
                        // 点击显示预热
                        $('.auxo-dropdown-menu-item:contains("立即开售")')[0].click()
                    }
                }
                if(zhuanshuStockModel) {
                    toast('专属库存固定值')
                    zhuanshuStockModel = false
                }else {
                    toast('专属库存批量SKU')
                    zhuanshuStockModel = true
                }
            }else if(e.altKey && e.keyCode == 90) {
                // ALT + Z 手动弹讲解
                let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                    }
                }
            }else if(e.altKey && e.keyCode == 97) {
                // 取消讲解
                if(document.getElementsByClassName('lvc2-grey-btn active')[0]) {
                    document.getElementsByClassName('lvc2-grey-btn active')[0].click()
                }else if(document.querySelector('#myiframe').contentWindow.document.getElementsByClassName('lvc2-grey-btn active')[0]) {
                    document.querySelector('#myiframe').contentWindow.document.getElementsByClassName('lvc2-grey-btn active')[0].click()
                }
            }else if(e.altKey && e.keyCode == 74) {
                if(GM_getValue('speed','') == true) {
                    GM_setValue('speed',false)
                    toast('不讲解')
                }else if(GM_getValue('speed','') == false) {
                    GM_setValue('speed',true)
                    toast('自动讲解')
                }
            }else if(e.altKey && e.keyCode == 112) {
                // alt + F1
                if($('.lvc2-grey-btn:contains(专属价设置)')[0]) {
                    $('.lvc2-grey-btn:contains(专属价设置)')[0].click()
                    $('.auxo-dropdown-menu-title-content:contains(修改库存)')[0].click()
                }
            }else if(e.altKey && e.keyCode == 113) {
                // alt + F2
                if($('.lvc2-grey-btn:contains(专属价设置)')[1]) {
                    $('.lvc2-grey-btn:contains(专属价设置)')[1].click()
                    $('.auxo-dropdown-menu-title-content:contains(修改库存)')[0].click()
                }
            }else if(e.altKey && e.keyCode == 114) {
                // alt + F3
                if($('.lvc2-grey-btn:contains(专属价设置)')[2]) {
                    $('.lvc2-grey-btn:contains(专属价设置)')[2].click()
                    $('.auxo-dropdown-menu-title-content:contains(修改库存)')[0].click()
                }
            }else if(e.altKey && e.keyCode == 8) {
                // Alt + back
                if(document.querySelector('#xuhao').style.display == 'block') {
                    document.querySelector('#xuhao').style.display = 'none'
                }else {
                    document.querySelector('#xuhao').style.display = 'block'
                }
            }else if(e.altKey && e.keyCode == 96) {
                // alt + 0
                ii = 0
                if(!document.querySelector('#iframe') && !window.top.document.querySelector('#iframe')) {
                    GM_setValue('marginleft',document.querySelectorAll(Doms.iframemlDom)[0].getBoundingClientRect().left)
                    GM_setValue('margintop',document.querySelectorAll(Doms.iframemlDom)[0].getBoundingClientRect().top)
                    GM_setValue('iframewidth',document.querySelector('.auxo-row').getBoundingClientRect().left)
                    GM_setValue('iframeheight',document.documentElement.clientHeight - document.documentElement.clientHeight*0.34 + 20)
                    let styledom = `
                    <style>
                        #iframe {
                            display: block;
                            position: fixed;
                            top: 34%;
                            left: 0;
                            width: ${GM_getValue('iframewidth',600)}px;
                            height: ${GM_getValue('iframeheight',600)}px;
                            overflow-x: auto;
                            overflow-y: hidden;
                            z-index: 99999999999999999999999;
                            box-shadow: 2px 2px 8px #9f97f9;
                        }
                        .mask:after {
                            content: "";
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background: rgba(0, 0, 0, 0.6);
                            height: 100%;
                        }
                        #iframe div {
                            margin-left: -${GM_getValue('marginleft',0)+35}px;
                            margin-top: -${GM_getValue('margintop',0)+20}px;
                        }
                        ${Doms.iframegoodstitle} {
                            max-width: ${GM_getValue('iframewidth',600)*0.52}px !important;
                            display: -webkit-box !important;
  	                        -webkit-line-clamp: 2 !important;
  	                        -webkit-box-orient: vertical !important;
                            white-space: normal !important;
                        }
                    </style>
                    <div id="iframe" class="mask"><div><iframe id="myiframe" src="https://buyin.jinritemai.com/dashboard/live/control" width="${window.outerWidth}" height="${window.outerHeight}" frameborder="0" scrolling="no"></iframe></div></div>
                    `
                    document.body.insertAdjacentHTML("beforeend", styledom)
                    setTimeout(() => {
                        // 给"待上架商品"按钮添加监听
                        document.querySelector('#myiframe').contentWindow.document.querySelectorAll('.switchItem-QL6yPR')[1].addEventListener('click',function() {
                            let siv = setInterval(() => {
                                console.log(555555)
                                // 导入货盘
                                if(document.querySelector('#myiframe').contentWindow.document.querySelector('.actions-t1orLv .auxo-btn')){
                                    clearInterval(siv)
                                    document.querySelector('#myiframe').contentWindow.document.querySelector('.actions-t1orLv .auxo-btn').addEventListener('click',addEventFn)
                                }
                            },100)
                            setTimeout(() => {
                                clearInterval(siv)
                            },5000)
                        })
                        document.querySelector('#iframe').classList.remove('mask')
                    },4000)
                }else if(document.querySelector('#iframe').style.display == 'none'){
                    document.querySelector('#iframe').style.display = 'block'
                    document.querySelector('#iframe div').style.marginLeft = `-${GM_getValue('marginleft',0)+35}px`
                    document.querySelector('#myiframe').contentWindow.document.querySelector(Doms.iframegoodslist).style.width = GM_getValue('iframewidth',600)+45+"px"
                    $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodslist).height(GM_getValue('iframeheight',600)-120)
                    let domstyle = `<style> ${Doms.iframegoodstitle} {
                            max-width: ${GM_getValue('iframewidth',600)*0.52}px !important;
                            display: -webkit-box !important;
  	                        -webkit-line-clamp: 2 !important;
  	                        -webkit-box-orient: vertical !important;
                            white-space: normal !important;
                        }</style>`
                    document.querySelector('#myiframe').contentWindow.document.body.insertAdjacentHTML("beforebegin", domstyle)
                }else {
                    document.querySelector('#iframe').style.display = 'none'
                }
            }else if(e.keyCode == 27) {
                if(window.location.href.indexOf('https://compass.jinritemai.com/talent/product-analysis') != -1) {
                    document.querySelectorAll('.ecom-input')[1].focus()
                    document.querySelectorAll('.ecom-input')[1].select()
                    return false
                }
                console.log(3333)
                alwaysjiangjie = false
                clearInterval(timer)
                clearInterval(GM_getValue('timer',timer))
                clearTimeout(GM_getValue('jiangjie',jiangjie))
                clearInterval(alwaysjiangjietimer)
                clearInterval(alwaysjiangjietimer1)
                if(document.querySelector('#ccc')) document.querySelector('html').removeChild(document.querySelector('#ccc'))
                if(document.querySelector('#ddd')) document.querySelector('html').removeChild(document.querySelector('#ddd'))
                // 点击确定删除
                if(document.querySelectorAll(Doms.liveBtn)[0]) {
                    // 未保存文本框
                    if(document.getElementsByClassName('auxo-modal-content')[0]) {
                        if($('.auxo-btn.auxo-btn-primary').last().text().trim() == '确定') $('.auxo-btn.auxo-btn-primary').last().click()
                    }
                    for(let i = document.querySelectorAll(Doms.liveBtn).length-1;i >= 0; i--) {
                        if(document.querySelectorAll(Doms.liveBtn)[i].children[0].innerText == '确认') {
                            document.querySelectorAll(Doms.liveBtn)[i].click()
                        }else if(document.querySelectorAll(Doms.liveBtn)[i].children[0].innerText == '删除') {
                            document.querySelectorAll(Doms.liveBtn)[i].click()
                        }else {
                            if(document.getElementsByClassName(Doms.closeBtn)[0]) {
                                document.getElementsByClassName(Doms.closeBtn)[0].click()
                            }else {
                                if(document.querySelectorAll(Doms.fudaicloseBtn)[0]) document.querySelectorAll(Doms.fudaicloseBtn)[0].click()
                            }
                        }
                    }
                }else {
                    if(document.getElementsByClassName(Doms.closeBtn)[0]) {
                        if(document.querySelector('.back-A__dp0')) document.querySelector('.back-A__dp0').click()
                        document.getElementsByClassName(Doms.closeBtn)[0].click()
                    }else if(document.querySelectorAll(Doms.fudaicloseBtn)[0]){
                        if(document.querySelectorAll(Doms.fudaicloseBtn)[0]) document.querySelectorAll(Doms.fudaicloseBtn)[0].click()
                    }else if(document.querySelectorAll(Doms.stockcloseBtn)[0]) {
                        if(document.querySelectorAll(Doms.stockcloseBtn)[0]) document.querySelectorAll(Doms.stockcloseBtn)[0].click()
                    }
                }
                $('.index-module__close___1HV5m').click()
                if(document.querySelector('.back-A__dp0')) document.querySelector('.back-A__dp0').click()
                kuanhao = ''
                document.querySelector('#kuanhao').value = ''
                if(document.querySelector('#xuhao').style.display == 'block') {
                    document.querySelector('#xuhao').focus()
                }else {
                    document.querySelector('#kuanhao').focus()
                }
                document.getElementsByClassName('drawer-header__close')[0] ? document.getElementsByClassName('drawer-header__close')[0].click() : ''
                // 清除派发的事件
                let shangjiadom = $('.index-module__infoCard___2aGVT').length > 0 ? $('.index-module__infoCard___2aGVT') : $('.index-module__infoCard___tO_-K')
                for(let i = 0;i < shangjiadom.length; i++) {
                    shangjiadom[i].dispatchEvent(mouseout)
                }
            }else if(e.altKey && e.keyCode == 80) {
                // 删除商品
                clearInterval(GM_getValue('timer',''))
                if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/pending-goods/list') != -1) {
                    $('.index-module__delete___3-ius').click()
                    $('.auxo-btn.auxo-btn-primary.index-module__publishButton___2knDq').click()
                    setTimeout(() => {
                        $('.auxo-btn.auxo-btn-primary').not(':first').click()
                    },700)
                }else if(window.location.href.indexOf('https://buyin.jinritemai.com/dashboard/shopwindow/goods-list') != -1) {
                    removegoodsFn()
                }
                if(document.getElementsByClassName('auxo-radio-input')[0]) {
                    $('.index__goodsList___3XeWQ').children().scrollTop(500)
                    first = 1
                    closefn()
                }
            } else if(e.altKey && e.keyCode == 67) {
                // Alt + C
                clearInterval(GM_getValue('timer',''))
                if(document.querySelector('#iframe') && document.querySelector('#iframe').style.display == 'block'){
                    // 判断是否有已上架的商品
                    yishangjiaDom = $(Doms.iframegoodsitem).find(Doms.iframegoodswent).length > 0 ? $(Doms.iframegoodsitem).find(Doms.iframegoodswent) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.iframegoodswent)
                    goodsitemDom = $(Doms.iframegoodsitem).length > 0 ? $(Doms.iframegoodsitem) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem)
                    scrollDom = $(Doms.iframegoodslist).length > 0 ? $(Doms.iframegoodslist).children() : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodslist).children()
                    if(yishangjiaDom.length == 0) {
                        scrollDom.scrollTop(0)
                        let goodsnameDom = $(Doms.iframegoodsitem).find(Doms.iframegoodstitle).length > 0 ? $(Doms.iframegoodsitem).find(Doms.iframegoodstitle).children() : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.iframegoodstitle).children()
                        copyToClip(goodsnameDom.eq(0).text().match(/\w+$/)[0],'第一个款号：'+goodsnameDom.eq(0).text().match(/\w+$/)[0])
                    }
                    let nowgoodsoffset = parseInt(yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().prev().css('top'))
                    scrollDom.scrollTop(nowgoodsoffset)
                    /*
                    try{
                        let nextgoodsid = yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().next().find(Doms.iframegoodstitle).text().match(/\w+$/)[0]
                        copyToClip(nextgoodsid,'下一个款号：'+nextgoodsid)
                    }catch{
                        toast('款号错误')
                    }.
                    */
                }else {
                    // 判断是否是旧版达人专属库存
                    if($(Doms.batchfillBtn).parents('.auxo-drawer-content-wrapper').css('transform') == 'none') {
                        document.querySelectorAll('.exclusive-goods-details__batch-operation .auxo-btn')[1].click()
                        $(Doms.querenaddBtn+':contains("确认")').click()
                    }
                    // 判断是否是新版管理库存
                    else if($(Doms.stockbatchfillBtn).parents('.auxo-drawer-content-wrapper').css('transform') != 'none'){
                        // 如果页面没有打开，点击第一个库存管理
                        $('.lvc2-grey-btn:contains(库存管理)')[0].click()
                        setTimeout(() => {
                            // 给每个文本框添加最大库存
                            let skuDoms = document.querySelectorAll(Doms.stockskuDom)
                            for(let i = 0;i < skuDoms.length;i++) {
                                changeReactInputValue(skuDoms[i],parseInt($(Doms.stockskuDom).eq(i).parents('.auxo-table-row').find('.auxo-table-cell')[2].innerText.replace(',','')))
                            }
                            document.querySelector(Doms.querenaddBtn).click()
                        },500)
                    }else {
                        // 给每个文本框添加最大库存
                        let skuDoms = document.querySelectorAll(Doms.stockskuDom)
                        for(let i = 0;i < skuDoms.length;i++) {
                            let changeval = parseInt($(Doms.stockskuDom).eq(i).parents('.auxo-table-row').find('.auxo-table-cell')[2].innerText.replace(',',''))
                            changeReactInputValue(skuDoms[i],changeval)
                        }
                        $(Doms.querenaddBtn+':contains("确定")').click()
                    }
                }
            }else if(e.altKey && e.keyCode === 107 || e.altKey && e.keyCode === 187) {
                // alt + +
                // 连续上架
                speed1 = true
                let lastnextBtn = null
                yishangjiaDom = $(Doms.iframegoodsitem).find(Doms.iframegoodswent).length > 0 ? $(Doms.iframegoodsitem).find(Doms.iframegoodswent) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.iframegoodswent)
                lastnextBtn = yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().next().find(Doms.firamegoodsgo).not(':disabled')
                ii = lastnextBtn.index()
            }else if(e.altKey && e.keyCode === 109 || e.altKey && e.keyCode === 189) {
                // alt + -
                speed1 = false
            }else if(e.altKey && e.keyCode === 50) {
                // 第2个商品讲解
                let b0 = document.querySelectorAll(Doms.goodsitemDom)[1] ? document.querySelectorAll(Doms.goodsitemDom)[1] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[1]
                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                    }
                }
            }else if(e.altKey && e.keyCode === 51) {
                // 第3个商品讲解
                let b0 = document.querySelectorAll(Doms.goodsitemDom)[2] ? document.querySelectorAll(Doms.goodsitemDom)[2] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[2]
                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                    }
                }
            }else if(e.altKey && e.keyCode === 191) {
                // alt + ?
                // 获取精选联盟数据
                document.querySelector('#file').click()
            }else if(e.altKey && e.keyCode === 110) {
                // alt + .
                // 更换商品计划
                ii = 0
                document.querySelector(Doms.iframeupdateplan) ? document.querySelector(Doms.iframeupdateplan).click() : document.querySelector('#myiframe').contentWindow.document.querySelector(Doms.iframeupdateplan).click()
                document.querySelector('#iframe div') ? document.querySelector('#iframe div').style.marginTop = '0px' : window.top.document.querySelector('#iframe div').style.marginTop = '0px'
                document.querySelector('#iframe div') ? document.querySelector('#iframe div').style.marginLeft = `-${GM_getValue('marginleft',0)+235}px` : window.top.document.querySelector('#iframe div').style.marginLeft = `-${GM_getValue('marginleft',0)+235}px`
                let scrollDom = $(Doms.iframegoodslist).length > 0 ? $(Doms.iframegoodslist).children() : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodslist).children()
                scrollDom.scrollTop(0)
                setTimeout(() => {
                    addEventFn()
                },500)
            }else if(e.altKey && e.keyCode === 192) {
                // 超级福袋
                fudai()
                if(window.location.href.indexOf('https://compass.jinritemai.com/talent/live-statement') != -1) {

                }
            }else if(e.altKey && e.keyCode === 219) {
                GM_setValue('closefn',!GM_getValue('closefn',false))
                if(GM_getValue('closefn',false)) {
                    toast('不删除库存为0的链接')
                }else {
                    toast('删除链接')
                }
            }else if(e.altKey && e.keyCode === 221) {
                // alt + ]
                // 持续弹讲解
                alwaysjiangjie = true
                let i = 0
                clearInterval(alwaysjiangjietimer)
                clearInterval(alwaysjiangjietimer1)
                function alwaysjiangjieFn() {
                    console.log('持续讲解')
                    if(alwaysjiangjie) {
                        if(document.getElementsByClassName('lvc2-grey-btn active')[0]) document.getElementsByClassName('lvc2-grey-btn active')[0].click()
                        setTimeout(() => {
                            let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                            for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                    b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                }
                            }
                        },1000)
                    }else {
                        clearInterval(alwaysjiangjietimer)
                    }
                    return alwaysjiangjieFn
                }
                toast('持续讲解中',999999999)
                alwaysjiangjietimer = setInterval(alwaysjiangjieFn(),14000)
                alwaysjiangjietimer1 = setInterval(() => {
                    console.log('省略号')
                    if(i < 3) {
                        $('#ccc').text($('#ccc').text()+'。')
                        i++
                    }else {
                        i = 0
                        $('#ccc').text('持续讲解中')
                    }
                },1000)
            }
        })
        // 商品计划自动上架
        function goosplan(k=0) {
            // 判断是否有已上架的商品
            yishangjiaDom = $(Doms.iframegoodsitem).find(Doms.iframegoodswent).length > 0 ? $(Doms.iframegoodsitem).find(Doms.iframegoodswent) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.iframegoodswent)
            shangjiaDom = $(Doms.iframegoodsitem).find(Doms.firamegoodsgo).length > 0 ? $(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled') : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled')
            goodsitemDom = $(Doms.iframegoodsitem).length > 0 ? $(Doms.iframegoodsitem) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem)
            goodsnameDom = $(Doms.iframegoodsitem).find(Doms.iframegoodstitle).length > 0 ? $(Doms.iframegoodsitem).find(Doms.iframegoodstitle) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.iframegoodstitle)
            scrollDom = $(Doms.iframegoodslist).length > 0 ? $(Doms.iframegoodslist).children() : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodslist).children()
            if(!speed1) {
                if(yishangjiaDom.length == 0) {
                    shangjiaDom[0+k].click()
                    if(GM_getValue('speed',false)) {
                        let jiangjie = setTimeout(() => {
                            document.querySelectorAll(Doms.addgoodsBtn)[1].click()
                            let jiangjie = setTimeout(() => {
                                let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                    }
                                }
                            },2000)
                            GM_setValue('jiangjie',jiangjie)
                        },1000)
                        GM_setValue('jiangjie',jiangjie)
                    }
                    //滚动到当前商品位置
                    scrollDom.scrollTop(0)
                    // 复制下一个商品的款号
                    /*
                    try {
                        let nextgoodsid = shangjiaDom.eq(1).parents(Doms.iframegoodsitem).find(Doms.iframegoodstitle).text() ? shangjiaDom.eq(1).parents(Doms.iframegoodsitem).find(Doms.iframegoodstitle).text().match(/\w+$/)[0] : "错误"
                        copyToClip(nextgoodsid,'下一个款号：'+nextgoodsid)
                    }catch {
                        toast('款号错误')
                    }
                    */
                }else {
                    // 查找已上架的下一个商品
                    let lastnextBtn = null
                    //if(yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().index() == goodsitemDom.length-1 && scrollDom.scrollTop() >= scrollDom.height()) return toast('最后一个了')
                    lastnextBtn = yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().next().find(Doms.firamegoodsgo).not(':disabled')
                    if(k == 1) lastnextBtn = yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().next().next().find(Doms.firamegoodsgo)
                    if(k == -1) lastnextBtn = yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().prev().find(Doms.firamegoodsgo)
                    console.log(lastnextBtn)
                    lastnextBtn[0].click()
                    // 自动弹讲解
                    if(GM_getValue('speed',false)) {
                        let jiangjie = setTimeout(() => {
                            window.parent.document.querySelectorAll(Doms.addgoodsBtn)[1].click()
                            let jiangjie = setTimeout(() => {
                                let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                                for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                    if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                        b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                    }
                                }
                            },2000)
                            GM_setValue('jiangjie',jiangjie)
                        },1000)
                        GM_setValue('jiangjie',jiangjie)
                    }
                    //滚动到当前商品位置
                    let nowgoodsoffset = parseInt(yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().css('top'))
                    console.log(nowgoodsoffset)
                    scrollDom.scrollTop(nowgoodsoffset)
                    // 复制下一个商品的款号
                    console.log(lastnextBtn)
                    /*
                    try {
                        if(lastnextBtn.parents(Doms.iframegoodsitem).parent().index() == goodsitemDom.length-1) return toast('最后一个了')
                        let nextgoodsid = lastnextBtn.parents(Doms.iframegoodsitem).parent().next().find(Doms.iframegoodstitle)[0] ? lastnextBtn.parents(Doms.iframegoodsitem).parent().next().find(Doms.iframegoodstitle)[0].innerText.match(/\w+$/)[0] :  "错误"
                        copyToClip(nextgoodsid,'下一个款号：'+nextgoodsid)
                    }catch {
                        toast('款号错误')
                    }
                    */

                }
            }else {
                let shangjiaDom = $(Doms.iframegoodsitem).find(Doms.firamegoodsgo).length > 0 ? $(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled') : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled')
                // 连续上架
                shangjiaDom[ii].click()
                ii++
                let jiangjie = setTimeout(() => {
                    /*
                    let jiangjie = setTimeout(() => {
                        let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.goodsitemDom)[0]
                        for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                            if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                            }
                        }
                    },1500)
                    */
                    GM_setValue('jiangjie',jiangjie)
                },1000)
                GM_setValue('jiangjie',jiangjie)
                //滚动到当前商品位置
                let nowgoodsoffset = parseInt(yishangjiaDom.last().parents(Doms.iframegoodsitem).parent().css('top'))
                scrollDom.scrollTop(nowgoodsoffset)
                /*
                try {
                    let nextgoodsid = shangjiaDom.eq(ii).parents(Doms.iframegoodsitem).find(Doms.iframegoodstitle)[0] ? shangjiaDom.eq(ii).parents(Doms.iframegoodsitem).find(Doms.iframegoodstitle)[0].innerText.match(/\w+$/)[0] :  "错误"
                    copyToClip(nextgoodsid,'下一个款号：'+nextgoodsid)
                } catch (error) {
                    toast('款号错误')
                }
                */
            }
        }
        let styleDom = `
        <style>
            #bodyyifu,#bodykuzi {
                position: fixed;
                top: 10%;
                left: 10px;
                height: 25px;
                color: rgb(100, 86, 247);
                z-index: 9999999999;
                cursor: pointer;
                padding: 0 10px 0 5px;
                background: #fff;
                border-radius: 4px;
            }
            #bodykuzi{
                transform: translate(0, 25px);
            }
            .left {
                position: fixed;
                top: 25%;
                left: 10px;
                transform: translate(0, -50%);
            }
            .left div {
                margin: 5px 0;
            }
            .left input,.right input,#passName{
                width: 80px;
                height: 25px;
                outline: none;
                border-radius: 4px;
                border: 1px solid rgba(100, 86, 247,.6);
                text-align: center;
                font-size: 12px;
                color: #888;
            }
            .right {
                position: fixed;
                top: 75%;
                right: 10px;
                z-index: 99999999;
            }
            #lastkuanhao {
                position: fixed;
                top: 10%;
                right: 20px;
                text-align: center;
                color: rgb(100, 86, 247);
                font-size: 24px;
                z-index: 99999999;
            }
            .stockMax,#fixedNum {
                position: fixed;
                top: 15%;
                right: 10px;
            }
            #fixedNum {
                top: 30%;
            }
            #kuanhao {
                width: 80px;
                height: 25px;
            }
            #shangjia {
                width: 80px;
                height: 25px;
                background: rgba(100,86,247,.6);
                border: none;
                border-radius: 4px;
                color: #fff;
                transform: translate(0, 5px);
            }
            #file {
                position: absolute;
                display: none;
            }
            #xuhao {
                position:fixed;
                top:700%;
                width:250px;
                height:10%;
                line-height: 100px;
                font-size:48px;
                color:rgba(100,86,247,.6)
                font-weight: 700;
                border: 3px solid rgba(100, 86, 247,.6);
            }
            #xuhao::placeholder {
                font-size: 34px;
                font-weight: 300;
                color:rgba(100,86,247,.6);
            }
            .araUR {
                max-width: 600px!important;
            }
            #passName {
                resize:none;
                position: fixed;
                top: 19%;
                right: 10px;
                width: 140px;
                height: 100px;
            }
            #zhuanshuStock {
                position: fixed;
                top: 71%;
            }
            .flagDom {
                display: none;
            }
        </style>
        <input id="file" type="file" />
        <div id="bodyyifu">衣服款号：${GM_getValue("yifu","")}</div>
        <div id="bodykuzi">裤子款号：${GM_getValue("kuzi","")}</div>
        <div id="lastkuanhao"></div>
        <div class="left">
            <div>
                <input id="yifu" class="yifu" placeholder="身上衣服" value="" autocomplete="off">
            </div>
            <div>
                <input id="kuzi" class="kuzi" placeholder="身上裤子" value="" autocomplete="off">
            </div>
             <div>
                <input id="xuhao" class="xuhao" placeholder="链接序号" value="" autocomplete="off" style="position:fixed;top:700%;width:250px;height:100px;font-size:36px;color:rgba(100,86,247,.6);display: none">
            </div>
        </div>
        <div class="right">
            <div class="flagDom">
            <div class="stockMax" >
                <input id="stockMax" placeholder="剩余链接" value="" autocomplete="off">
            </div>
                <textarea id="passName" autocomplete="off" placeholder="跳过商品名称"></textarea>
                <input id="fixedNum" placeholder="固定链接序号" value="" autocomplete="off">
                <input id="zhuanshuStock" placeholder="专属剩余库存" value="" autocomplete="off">
            </div>
            <div>
                <input id="kuanhao" placeholder="商品款号" value="" autocomplete="off">
            </div>

        </div>
        `
        document.body.insertAdjacentHTML("beforeend", styleDom)
        document.querySelector('#bodyyifu').addEventListener('click',function() {
            kuanhao = GM_getValue("yifu","")
            autoshangjiaFn()
        })
        document.querySelector('#bodykuzi').addEventListener('click',function() {
            kuanhao = GM_getValue("kuzi","")
            autoshangjiaFn()
        })
        document.querySelector('#yifu').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                let yifu = document.querySelector('#yifu').value.toUpperCase().trim()
                GM_setValue('yifu',yifu)
                toast('衣服款号：'+yifu)
                bodygoods = yifu
                document.querySelector('#bodyyifu').innerText = '衣服款号：'+ GM_getValue('yifu','')
                document.querySelector('#yifu').value = ''
            }
        })
        document.querySelector('#kuzi').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                let kuzi = document.querySelector('#kuzi').value.toUpperCase().trim()
                GM_setValue('kuzi',kuzi)
                toast('裤子款号：'+kuzi)
                document.querySelector('#bodykuzi').innerText = '裤子款号：'+ GM_getValue('kuzi','')
                document.querySelector('#kuzi').value = ''
            }
        })
        document.querySelector('#stockMax').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                GM_setValue('stockMax',document.querySelector('#stockMax').value.trim())
                document.querySelector('#stockMax').value = ''
                document.querySelector('.flagDom').style.display = 'none'
            }
        })
        document.querySelector('#passName').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                if(document.querySelector('#passName').value.trim()[0] == '+') {
                    GM_setValue('passName',GM_getValue('passName','')+','+document.querySelector('#passName').value.trim().substr(1))
                }else if(document.querySelector('#passName').value.trim()[0] == '-') {
                    let arr = GM_getValue('passName','').split(',')
                    for(let i = 0;i < arr.length;i++) {
                        for(let j = 0;j < document.querySelector('#passName').value.trim().substr(1).split(',').length;j++) {
                            if(arr[i] == document.querySelector('#passName').value.trim().substr(1).split(',')[j]) {
                                arr.splice(i, 1)
                                console.log(arr)
                            }
                        }
                    }
                    GM_setValue('passName',arr.join(','))
                }else {
                    GM_setValue('passName',document.querySelector('#passName').value.trim())
                }
                document.querySelector('#passName').value = ''
                document.querySelector('.flagDom').style.display = 'none'
                console.log(GM_getValue('passName',''))
            }
        })
        document.querySelector('#passName').addEventListener('onpaste',function(e) {
            let temp = document.querySelector('#passName').value.trim()
            })
        document.querySelector('#fixedNum').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                if(document.querySelector('#fixedNum').value.trim()[0] == '+') {
                    let arr = GM_getValue('fixedNum','')
                    arr.push(document.querySelector('#fixedNum').value.trim().substr(1)+'')
                    GM_setValue('fixedNum',arr)
                }else if(document.querySelector('#fixedNum').value.trim()[0] == '-') {
                    let arr = GM_getValue('fixedNum','')
                    for(let i = 0;i < arr.length;i++) {
                        for(let j = 0;j < document.querySelector('#fixedNum').value.trim().substr(1).split(',').length;j++) {
                            if(arr[i] == document.querySelector('#fixedNum').value.trim().substr(1).split(',')[j]) {
                                arr.splice(i, 1)
                                console.log(arr)
                            }
                        }
                    }
                    GM_setValue('fixedNum',arr)
                }else {
                    GM_setValue('fixedNum',document.querySelector('#fixedNum').value.trim().split(','))
                }
                // 获取固定序号链接的标题
                if(GM_getValue('fixedNum','') != '') {
                    let arr = []
                    for(let i = 0;i < GM_getValue('fixedNum','').length;i++) {
                        arr.push($(Doms.itemradioBtn).parents(Doms.goodsitemDom).find(`.auxo-input[value=${GM_getValue('fixedNum','')[i]}]`).parents(Doms.goodsitemDom).find('.title-h8R0c6').text())
                    }
                    GM_setValue('fixedGoodsname',arr)
                }else {
                    GM_setValue('fixedGoodsname','')
                }
                document.querySelector('#fixedNum').value = ''
                document.querySelector('.flagDom').style.display = 'none'
                console.log(GM_getValue('fixedNum',1))
                console.log(GM_getValue('fixedGoodsname',2))
            }
        })
        document.querySelector('#zhuanshuStock').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                GM_setValue('zhuanshuStock',document.querySelector('#zhuanshuStock').value.trim())
                document.querySelector('#zhuanshuStock').value = ''
                document.querySelector('.flagDom').style.display = 'none'
            }
        })
        document.querySelector('#xuhao').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                let xuhaonum = document.querySelector('#xuhao').value
                if(xuhaonum == GM_getValue('xuhaonum',null)) {
                    document.querySelector('#live-control-goods-list-container div').scrollTop = (parseInt(xuhaonum)-1) *139
                    // 取消讲解
                    document.getElementsByClassName('lvc2-grey-btn active')[0].click()
                }
                setTimeout(() => {
                    document.querySelector('#xuhao').value = ''
                    document.querySelector('#live-control-goods-list-container div').scrollTop = (parseInt(xuhaonum)-1) *139
                    setTimeout(() => {
                        let lianjieDom = document.querySelectorAll(Doms.goodsitemDom)
                        for(let i = 0;i < lianjieDom.length;i++) {
                            if(document.querySelectorAll('.index__indexWrapper___24n7Q .auxo-input')[i].value == xuhaonum) {
                                for(let j = 0;j < lianjieDom[i].getElementsByClassName('lvc2-grey-btn').length;j++) {
                                    if(lianjieDom[i].getElementsByClassName('lvc2-grey-btn')[j].innerText == '讲解') {
                                        lianjieDom[i].getElementsByClassName('lvc2-grey-btn')[j].click()
                                        GM_setValue('xuhaonum',xuhaonum)
                                        document.querySelector('#xuhao').foucs()
                                    }
                                }
                                break;
                            }
                        }
                    },500)
                },500)
            }
        })
        // 一键上架
        function shangjiaBtnFn(){
            document.querySelector('#lastkuanhao').innerText = kuanhao.toUpperCase()
            autoshangjiaFn()
        }
        document.querySelector('#kuanhao').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                kuanhao = document.querySelector('#kuanhao').value
                document.querySelector('#kuanhao').value = ''
                shangjiaBtnFn()
            }
        })
        // 获取精选联盟数据
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
            }
        }
        //  搜索精选联盟链接文本框添加链接
        setTimeout(() => {
            if(window.location.href.indexOf('https://compass.jinritemai.com/talent/product-analysis') != -1) {
                document.querySelectorAll('.ecom-input')[1].addEventListener('keydown',function(e) {
                    if(e.altKey && e.keyCode == 13) {
                        let inputval = document.querySelectorAll('.ecom-input')[1].value.trim().toUpperCase()
                        GM_getValue('jxdata',null).some(val => {
                            console.log(val["商品款号"])
                            if(val["商品款号"] && val["商品款号"] != "" && val["商品款号"].match(/[^\u4e00-\u9fa5]+/) && val["商品款号"].match(/[^\u4e00-\u9fa5]+/)[0] == inputval) {
                                changeReactInputValue(document.querySelectorAll('.ecom-input')[1],val["产品链接"].split('id=')[1].split('&')[0])
                                document.querySelectorAll('.ecom-input')[1].select()
                                return true
                            }
                        })
                    }
                })
            }
        },3000)

        function addEventFn() {
            // 显示了商品计划
            if(window.top.document.querySelector('#iframe')) {
                window.top.document.querySelector('#iframe').style.overflowY = 'auto'
                window.top.document.querySelector('#iframe div').style.marginTop = '0'
                window.top.document.querySelector('#iframe div').style.marginLeft = `-${GM_getValue('marginleft',0)+235}px`
            }
            setTimeout(() => {
                let dom = document.querySelector('#myiframe') ? document.querySelector('#myiframe').contentWindow.document.querySelectorAll(Doms.itemradioBtn) : document.querySelectorAll(Doms.itemradioBtn)
                for(let i = 0;i < dom.length;i++) {
                    dom[i].addEventListener('click',function () {
                        setTimeout(() => {
                            if(document.querySelector('.index__actions___8Ub4J .auxo-btn')) {
                                setTimeout(() => {
                                    if(document.querySelector(Doms.iframeupdateplan)) {
                                        document.querySelector(Doms.iframeupdateplan).addEventListener('click',addEventFn)
                                    }
                                },1000)
                            }
                            document.querySelector('#myiframe') ? document.querySelector('#myiframe').contentWindow.document.querySelector('.auxo-drawer-footer-buttons .auxo-btn').click() : document.querySelector('.auxo-drawer-footer-buttons .auxo-btn').click()
                            setTimeout(() => {
                                if(window.top.document.querySelector('#iframe div')) {
                                    window.top.document.querySelector('#iframe div').style.marginTop = `-${GM_getValue('margintop',0)+20}px`
                                    window.top.document.querySelector('#iframe div').style.marginLeft = `-${GM_getValue('marginleft',0)+35}px`
                                }
                                window.top.document.querySelector('#iframe').scrollTop = 0
                                window.top.document.querySelector('#iframe').style.overflowY = 'hidden'
                                document.querySelector('#myiframe') ? document.querySelector('#myiframe').contentWindow.document.querySelector(Doms.iframegoodslist).style.width = GM_getValue('iframewidth',600)+45+"px" : document.querySelector(Doms.iframegoodslist).style.width = GM_getValue('iframewidth',600)+45+"px"
                                let domstyle = `<style> ${Doms.iframegoodstitle} {
                                                                   max-width: ${GM_getValue('iframewidth',600)*0.52}px !important;
                                                                   display: -webkit-box !important;
  	                                                               -webkit-line-clamp: 2 !important;
  	                                                               -webkit-box-orient: vertical !important;
                                                               white-space: normal !important;
                                                               }</style>`
                                document.body.insertAdjacentHTML("beforebegin", domstyle)
                                document.querySelector('#myiframe') ? document.querySelector('#myiframe').contentWindow.document.body.insertAdjacentHTML("beforebegin", domstyle) : ''
                                // 修改商品列表的高度，修复最后两个商品隐藏的问题
                                $(Doms.iframegoodslist).height(GM_getValue('iframeheight',600)-120)
                                // 设置每个商品DIV的固定高度
                                goodsitemDom = $(Doms.iframegoodsitem).length > 0 ? $(Doms.iframegoodsitem) : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem)
                                GM_setValue('goodsitemHeight',goodsitemDom.eq(0).outerHeight())
                            },1500)
                        },500)
                    })
                }
                // 给所有“上架”按钮添加监听
                setTimeout(() => {
                    let shangjiaDom = $('.index__productList___1zv7-').find(Doms.firamegoodsgo).not(':disabled').length > 0 ? $(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled') : $(document.querySelector('#myiframe').contentWindow.document).find(Doms.iframegoodsitem).find(Doms.firamegoodsgo).not(':disabled')
                    console.log(shangjiaDom)
                    for(let i = 0;i < shangjiaDom.length-1;i++) {
                        shangjiaDom[i].addEventListener('click',function() {
                            // 自动弹讲解
                            if(GM_getValue('speed',false)) {
                                let jiangjie = setTimeout(() => {
                                    window.parent.document.querySelectorAll(Doms.addgoodsBtn)[1].click()
                                    let jiangjie = setTimeout(() => {
                                        window.parent.document.querySelectorAll(Doms.addgoodsBtn)[1].click()
                                        let b0 = document.querySelectorAll(Doms.goodsitemDom)[0] ? document.querySelectorAll(Doms.goodsitemDom)[0] : window.parent.document.querySelectorAll(Doms.goodsitemDom)[0]
                                        for(let i = 0;i < b0.querySelectorAll(Doms.goodsitemfnBtn).length;i++) {
                                            if(b0.querySelectorAll(Doms.goodsitemfnBtn)[i].innerText == '讲解') {
                                                b0.querySelectorAll(Doms.goodsitemfnBtn)[i].click()
                                            }
                                        }
                                    },2000)
                                    GM_setValue('jiangjie',jiangjie)
                                },1000)
                                GM_setValue('jiangjie',jiangjie)
                            }
                        })
                    }
                },2000)
            },500)
        }
    }
    // Your code here...
})();
