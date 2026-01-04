// ==UserScript==
// @name         批量商家编码
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  许大包
// @author       You
// @match        https://fxg.jinritemai.com/ffa/g/create*
// @icon         https://www.google.com/s2/favicons?domain=jinritemai.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.close
// @grant        window.focus
// @require      https://update.greasyfork.org/scripts/500012/1407355/jquery20.js
// @downloadURL https://update.greasyfork.org/scripts/451898/%E6%89%B9%E9%87%8F%E5%95%86%E5%AE%B6%E7%BC%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/451898/%E6%89%B9%E9%87%8F%E5%95%86%E5%AE%B6%E7%BC%96%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        // 标准建议尺码（不需要退5斤）
        let flag = true
        let who = 688
        let mouseover = new Event('mouseover', { bubbles: true })
        let mouseout = new Event('mouseout', { bubbles: true })
        var chimaItem,taojianArr
        let chimaType = true
        let chimayingwen = ['S','M','L','XL','2XL','3XL','4XL','5XL','6XL']
        let chimashuzi = [25,26,27,28,29,30,31,32,33]
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
        // 一键生成建议尺码的方法
        function autochima(num) {
            let chima = document.getElementsByClassName('index_skuValueBox__2V-eL')[1] ? document.getElementsByClassName('index_skuValueBox__2V-eL')[1].children : document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
            let min = 90
            let max = 100
            let chimaname = chima[0].querySelectorAll('.ecom-g-input')[1] ? chima[0].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)') : chima[0].querySelector('.ecom-g-input')
            chimaname.focus()
            let ischimaid = chima[0].querySelectorAll('.ecom-g-input')[1] ? chima[0].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)') : chimaname.value.match(/[\(（].*[\)）]/,'')
            console.log(ischimaid)
            // 初始化尺码建议是否存在
            // 如果不存在，赋值初始化的尺码建议
            if(!ischimaid || ischimaid.value == "") {
                for(let i = 0;i < chima.length-1;i++){
                    let chimaname = chima[i].querySelectorAll('.ecom-g-input')[1] ? chima[i].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)') : chima[i].querySelector('.ecom-g-input')
                    let chimaid = chimaname.value.replace(/[\(（].*[\)）]/,'')
                    let newText = chima[0].querySelectorAll('.ecom-g-input')[1] ? `${min}-${max}斤` : `${chimaid}（${min}-${max}斤）`
                    changeReactInputValue(chimaname,newText)
                    if(chima[i].querySelectorAll('.ecom-g-input')[1]) chima[i].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)').style.width = '100px'
                    min = flag ? max : max - 5
                    max += num
                }
            }
            else {
                // 如果存在，以第一个建议尺码为基准追加
                let chimaarr = chima[0].querySelectorAll('.ecom-g-input')[1] ? chimaname.value.substring().split('-') : chimaname.value.substring(chimaname.value.indexOf('（')+1,chimaname.value.indexOf('）')-1).split('-')
                console.log(chimaarr)
                min = parseInt(chimaarr[0])
                max = chima[0].querySelectorAll('.ecom-g-input')[1] ? parseInt(chimaarr[1].substring(0,chimaarr[1].lastIndexOf('斤'))) : parseInt(chimaarr[1])
                for(let i = 0;i < chima.length-1;i++){
                    let chimaname = chima[i].querySelectorAll('.ecom-g-input')[1] ? chima[i].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)') : chima[i].querySelector('.ecom-g-input')
                    let chimaid = chimaname.value.replace(/[\(（].*[\)）]/,'')
                    let newText = chima[0].querySelectorAll('.ecom-g-input')[1] ? `${min}-${max}斤` : `${chimaid}（${min}-${max}斤）`
                    changeReactInputValue(chimaname,newText)
                    if(chima[i].querySelectorAll('.ecom-g-input')[1]) chima[i].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)').style.width = '100px'
                    min = flag ? max : max - 5
                    max += num
                }
            }
        }
        // 删除商品图片的方法
        function delectPicFn() {
            let picDom = document.getElementsByClassName('upload_batch-image-upload__2gCtI')[GM_getValue('picIndex')].getElementsByClassName('upload_img__3OrrW')
            console.log(picDom)
            // 删除主图的图片
            if(picDom.length > 0) {
                picDom[0].dispatchEvent(mouseover)
                setTimeout(() => {
                    picDom[0].dispatchEvent(mouseover)
                    document.getElementsByClassName('upload_actionAfter__1OZuM')[document.getElementsByClassName('upload_actionAfter__1OZuM').length-1].click()
                    //delectPicFn()
                },300)
            }
            /*
            else if(document.getElementsByClassName('index_iconDelete__1uawm').length > 0){
                // 删除详情图
                document.getElementsByClassName('index_iconDelete__1uawm')[0].click()
                delectPicFn()
            }
            else if(GM_getValue('picIndex') <= 4) {
                GM_setValue('picIndex',GM_getValue('picIndex')+1)
                delectPicFn()
            }
*/
        }
        // 排列组合的方法
        /*
          @param {*} source 源数组
          @param {*} count 要取出多少项
          @param {*} isPermutation 是否使用排列的方式
          @return {any[]} 所有排列组合,格式为 [ [1,2], [1,3]] ...
        */
        function getNumbers(source, count, isPermutation = true) {
            //如果只取一位，返回数组中的所有项，例如 [ [1], [2], [3] ]
            let currentList = source.map((item) => [item]);
            if (count === 1) {
                return currentList;
            }
            let result = [];
            //取出第一项后，再取出后面count - 1 项的排列组合，并把第一项的所有可能（currentList）和 后面count-1项所有可能交叉组合
            for (let i = 0; i < currentList.length; i++) {
                let current = currentList[i];
                //如果是排列的方式，在取count-1时，源数组中排除当前项
                let children = [];
                if (isPermutation) {
                    children = getNumbers(source.filter(item => item !== current[0]), count - 1, isPermutation);
                }
                //如果是组合的方法，在取count-1时，源数组只使用当前项之后的
                else {
                    children = getNumbers(source.slice(i + 1), count - 1, isPermutation);
                }
                for (let child of children) {
                    result.push([...current, ...child]);
                }
            }
            return result;
        }


        window.addEventListener('keydown', function (e) {
            if(e.keyCode == 27) {
                document.getElementById('main').style.display = 'none'
                document.getElementsByClassName('taojian')[0].style.display = 'none'
            }else if(e.altKey && e.keyCode === 87) {
                let goodsname = document.querySelector('.ecom-g-input').value.trim()
                let rep = /\w+$/
                let goodsid = goodsname.match(rep)[0]
                let yanse = document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
                let chima = document.getElementsByClassName('index_skuValueBox__2V-eL')[1] ? document.getElementsByClassName('index_skuValueBox__2V-eL')[1].children : document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
                document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0] ? changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0]) : changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[1].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0])
                let mubaninputDom = document.querySelectorAll('.ecom-g-table-tbody')[0].querySelectorAll('.ecom-g-table-row')
                for(let i = 0;i < yanse.length-1;i++) {
                    let yanseid,chimaname
                    if(document.getElementsByClassName('index_skuValueBox__2V-eL')[1]) {
                        let inputDom = null
                        for(let j = 0;j < chima.length-1;j++){
                            // 判断是否是新版
                            if(!document.querySelector('.index_required__2RBNl')) {
                                inputDom = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input')[mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input').length-1]
                                console.log(inputDom)
                                yanseid = yanse[i].querySelector('.ecom-g-cascader-picker-label').innerText
                                chimaname = chima[j].querySelector('.ecom-g-cascader-picker-label').innerText
                            }else{
                                inputDom = mubaninputDom[i*(chima.length-1)+j].children[8] ? mubaninputDom[i*(chima.length-1)+j].children[8].querySelector('.ecom-g-input') : mubaninputDom[i*(chima.length-1)+j].children[7].querySelector('.ecom-g-input')
                                console.log(inputDom)
                                yanseid = yanse[i].querySelector('.ecom-g-input').value.trim()
                                chimaname = chima[j].querySelector('.ecom-g-input').value.trim()
                            }
                            let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                            let newText = `${goodsid}-${yanseid}-${chimaid}`
                            changeReactInputValue(inputDom,newText)
                            inputDom.focus()
                        }
                    }else {
                        let inputDom = mubaninputDom[i*(chima.length-1)+1].querySelectorAll('.ecom-g-input:last')
                        if(!document.querySelector('.index_required__2RBNl')) {
                            chimaname = chima[i].querySelector('.ecom-g-cascader-picker-label').innerText
                        }else {
                            chimaname = chima[i].querySelector('.ecom-g-input').value.trim()
                        }
                        let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                        let newText = `${goodsid}-${chimaid}`
                        changeReactInputValue(inputDom,newText)
                        inputDom.focus()
                    }
                }
            }else if(e.altKey && e.keyCode === 81) {
                let goodsname = document.querySelector('.ecom-g-input').value.trim()
                let rep = /\w+$/
                let goodsid = goodsname.match(rep)[0]
                let yanse = document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
                let chima = document.getElementsByClassName('index_skuValueBox__2V-eL')[1] ? document.getElementsByClassName('index_skuValueBox__2V-eL')[1].children : document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
                let inputAll = document.querySelector('.ecom-g-table-tbody').querySelectorAll('.ecom-g-input-number-input')
                document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0] ? changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0]) : changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[1].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0])
                let mubaninputDom = document.querySelectorAll('.ecom-g-table-tbody')[0].querySelectorAll('.ecom-g-table-row')
                for(let i = 0;i < inputAll.length;i++) {
                    changeReactInputValue(inputAll[i],0)
                }
                for(let i = 0;i < yanse.length-1;i++) {
                    if(document.getElementsByClassName('index_skuValueBox__2V-eL')[1]) {
                        for(let j = 0;j < chima.length-1;j++){
                            console.log(i,j)
                            let inputDom = null
                            let price = null
                            // 判断是否是预售模式
                            if(document.getElementsByClassName('ecom-g-radio-group ecom-g-radio-group-outline')[0].getElementsByClassName('ecom-g-radio-input')[1].checked) {
                                inputDom = document.querySelector('.ecom-g-table-tbody').querySelectorAll('.ecom-g-input')[i]
                                price = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input-number-input')[0]
                            }else {
                                inputDom = document.querySelector('.ecom-g-table-tbody').querySelectorAll('.ecom-g-input')[i]
                                price = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input-number-input')[0]
                            }
                            let yanseid = yanse[i].querySelector('.ecom-g-cascader-picker-label').innerText
                            let chimaname = chima[j].querySelector('.ecom-g-cascader-picker-label').innerText
                            let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                            let newText = `${goodsid}-${yanseid}-${chimaid}`
                            changeReactInputValue(inputDom,newText)
                            changeReactInputValue(price,who)
                        }
                    }else {
                        let inputDom = null
                        let price = null
                        if(document.getElementsByClassName('ecom-g-radio-group ecom-g-radio-group-outline')[0].getElementsByClassName('ecom-g-radio-input')[1].checked) {
                            inputDom = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input')[mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input').length-1]
                            price = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input-number-input')[0]
                        }else {
                            inputDom = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input')[mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input').length-1]
                            price = mubaninputDom[i*(chima.length-1)+j].querySelectorAll('.ecom-g-input-number-input')[0]
                        }
                        let chimaname = chima[i].querySelector('.ecom-g-cascader-picker-label').innerText
                        let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                        let newText = `${goodsid}-${chimaid}`
                        changeReactInputValue(inputDom,newText)
                        changeReactInputValue(price,who)
                    }
                }
            }else if(e.altKey && e.keyCode === 192) {
                // 添加尺码信息
                if(document.querySelector('.style_switchOpen__PY9VW .ecom-g-switch.ecom-g-switch-small').getAttribute('aria-checked') != 'true') {
                    document.querySelector('.style_switchOpen__PY9VW .ecom-g-switch.ecom-g-switch-small').click()
                }
                setTimeout(() => {
                    $('#goodsEditScrollContainer-尺码信息 .ecom-g-checkbox-wrapper-checked .ecom-g-checkbox-input').click()
                    changeReactInputValue(document.querySelectorAll('#goodsEditScrollContainer-尺码信息 .ecom-g-zform-item-control-input-content .ecom-g-input')[0],'1米6以下卡码往大拍')
                    changeReactInputValue(document.querySelectorAll('#goodsEditScrollContainer-尺码信息 .ecom-g-zform-item-control-input-content .ecom-g-input')[1],'手工测量有2~3cm误差，每个码长2cm')
                    setTimeout(() => {
                        $('#goodsEditScrollContainer-尺码信息 .ecom-g-checkbox-wrapper-checked .ecom-g-checkbox-input').click()
                        let yichang = $('#goodsEditScrollContainer-尺码信息 .ecom-g-checkbox-wrapper-disabled').eq(2)
                        yichang.find('.ecom-g-input')[0].focus()
                        changeReactInputValue(yichang.find('.ecom-g-input')[0],'衣长')
                        setTimeout(() => {
                            yichang.click()
                            setTimeout(() => {
                                let k = 0
                                for(let i = 0;i < $('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input:not(.ecom-g-cascader-input)').length;i++) {
                                    changeReactInputValue($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input:not(.ecom-g-cascader-input)')[i],'-')
                                    if((i+1) % 3 == 0) {
                                        changeReactInputValue($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input:not(.ecom-g-cascader-input)')[i],'-')
                                        k++
                                    }else if((i % 3) == 0){
                                        changeReactInputValue($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input:not(.ecom-g-cascader-input)')[i],160+k)
                                    }else {
                                        changeReactInputValue($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input:not(.ecom-g-cascader-input)')[i],110+k)
                                    }
                                }
                                console.log($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input'))
                                console.log($('#goodsEditScrollContainer-尺码信息 .ecom-g-table .ecom-g-input').not('.ecom-g-cascader-input'))
                            },300)
                        },300)
                    },500)
                },500)
            }else if(e.altKey && e.keyCode === 88) {
                // Alt + x  删除图片
                GM_setValue('picIndex',0)
                delectPicFn()
            }else if(e.altKey && e.keyCode === 67) {
                // Alt + c  快速添加颜色尺码
                if(chimaType) {
                    chimayingwen.forEach((val,index) => {
                        document.getElementById("main").getElementsByTagName("li")[index].innerText = val
                    })
                    chimaType = !chimaType
                }else {
                    chimashuzi.forEach((val,index) => {
                        document.getElementById("main").getElementsByTagName("li")[index].innerText = val
                    })
                    chimaType = !chimaType
                }
                document.getElementById('main').style.display = 'flex'
                document.getElementsByClassName('taojian')[0].style.display = 'block'
            }else if(e.altKey && e.keyCode === 83) {
                // 加10斤
                autochima(10)
            }else if(e.altKey && e.keyCode === 90) {
                // 加15斤
                autochima(15)
            }else if(e.altKey && e.keyCode === 49) {
                // 最后一个码加5斤
                let chima = document.getElementsByClassName('index_skuValueBox__2V-eL')[1] ? document.getElementsByClassName('index_skuValueBox__2V-eL')[1].children : document.getElementsByClassName('index_skuValueBox__2V-eL')[0].children
                let newText = chima[chima.length-2].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)').value.split('-')[0] + "-" + (parseInt(chima[chima.length-2].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)').value.split('-')[1])+5)+"" + "斤"
                changeReactInputValue(chima[chima.length-2].querySelector('.ecom-g-input:not(.ecom-g-cascader-input)'),newText)
            }else if(e.altKey && e.keyCode === 107 || e.altKey && e.keyCode === 187){
                // 监听键盘按下+键盘
                flag = true
            }else if(e.altKey && e.keyCode === 109 || e.altKey && e.keyCode === 189){
                // 监听键盘按下-键盘
                flag = false
            }else if(e.altKey && e.keyCode === 13) {
                // 发布商品
                document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1].click()
                if(document.querySelector('.ecom-g-modal-footer .ecom-g-btn')) document.querySelector('.ecom-g-modal-footer .ecom-g-btn').click()
            }
        })
        let styleDom = `
        <style>
        .left {
            position: absolute;
            left: 1%;
            top: 50%;
            transform: translate(0,-50%);
            z-index: 9999999999
        }
        #main {
            display: none;
            position: absolute;
            flex-direction: column;
            right: 1%;
            top: 50%;
            transform: translate(0,-50%);
            z-index: 9999999999
        }

        #main li{
            width: 55px;
            list-style: none;
            text-align: center;
            cursor: pointer;
            color: #1f6aff;
            border: 1px solid #548dfe;
            border-radius: 5px;
            margin-bottom: 3px;
            font-size: 20px;
            padding: 0 10px;
            user-select: none;
            background-color: #fff;
        }
        .select {
            background-color: rgba(31, 105, 255, 0.8);
            color: #fff;
        }
        .taojian,.btn {
            font-size: 18px;
            margin-top: 5px;
            background-color: rgba(31, 105, 255);
            border: none;
            outline: none;
            border-radius: 3px;
            color: #fff;
        }
        .taojian {
            display: none;
            font-size:  16px;
            padding: 2px 8px;
        }
    </style>
        <div class="left">
            <button class='taojian'>套件组合</button>
        </div>
        <div class="right">
            <ul id="main">
                <li data-index="0">""</li>
                <li data-index="1">""</li>
                <li data-index="2">""</li>
                <li data-index="3">""</li>
                <li data-index="4">""</li>
                <li data-index="5">""</li>
                <li data-index="6">""</li>
                <li data-index="7">""</li>
                <li data-index="8">""</li>
                <button class='btn'>提交</button>
            </ul>
        </div>
        `
        document.body.insertAdjacentHTML("beforeend", styleDom);
        let selectedIds = []; //存放被选中的数据
        let preIdx = 0;   //被选中的数组的第一个值，用以比较范围
        let ul = document.getElementById("main");
        let lis = document.getElementById("main").getElementsByTagName("li");
        ul.addEventListener("click", function (event) {
            selectedIds = [];
            let target = event.target;
            let idx = target.dataset.index;
            if (event.shiftKey) {
                let max = Math.max(preIdx, idx);
                let min = Math.min(preIdx, idx);
                for (let j = min; j <= max; j++) {
                    selectedIds.push(j);
                }
                for (let i = 0; i < lis.length; i++) {
                    let itemIdx = selectedIds.findIndex(c => c == i);
                    if (itemIdx > -1) {
                        lis[i].classList.add('select')
                    } else {
                        lis[i].classList.remove('select')
                    }
                }
            } else {
                for (let i = 0; i < lis.length; i++) {
                    if (i == idx) {
                        lis[i].classList.add('select')
                    } else {
                        lis[i].classList.remove('select')
                    }
                }
                selectedIds.push(idx);
                preIdx = idx;
            }
        });
        function fillFn(i) {
            // 获取尺码的文本框
            let chimaInput = document.getElementsByClassName('Item_contentBox__2ic-w')[1].children[2].getElementsByClassName('ecom-g-input')
            if(chimaItem == 0 ) {
                return false
            }if(chimaInput.length > chimaItem.length && chimaInput.length != 1 && i !=chimaItem.length) {
                for(let i = 0;i < chimaInput.length-chimaItem.length;i++) {
                    document.getElementsByClassName('Item_contentBox__2ic-w')[1].getElementsByClassName('ecom-g-sp-icon sp-icon-parcel index_delete__3oE3E')[document.getElementsByClassName('Item_contentBox__2ic-w')[1].getElementsByClassName('ecom-g-sp-icon sp-icon-parcel index_delete__3oE3E').length-1].click()
                }
                fillFn(i)
            }else if(i < chimaItem.length) {
                console.log(i)
                if(i < chimaInput.length-1) {
                    chimaInput[i].focus()
                    changeReactInputValue(chimaInput[i],chimaItem[i].innerText)
                    i++
                    fillFn(i)
                }else {
                    chimaInput[i].focus()
                    changeReactInputValue(chimaInput[i],chimaItem[i].innerText)
                    chimaInput[i].blur()
                    i++
                    fillFn(i)
                }
            }
        }
        // 生成尺码按钮
        document.getElementsByClassName('btn')[0].addEventListener('click',function() {
            let i = 0
            // 获取选中的尺码
            chimaItem = document.getElementsByClassName('select')
            fillFn(i)
        })
        // 生成套件按钮
        document.getElementsByClassName('taojian')[0].addEventListener('click',function() {
            let i = 0
            let arr1 = []
            for(let i = 0;i < document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children.length-1;i++) {
                arr1.push(document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children[i].querySelector('.ecom-g-input').value)
            }
            let arr2 = getNumbers(arr1,2,false)
            let arr3 = []
            arr1.forEach(val => {arr3.push(val+'+'+val)})
            arr2.forEach(val => {arr3.push(val[0]+'+'+val[1])})
            console.log(arr3)
            taojianArr = arr3
            taojianFn(i)
        })
        function taojianFn(i) {
            // 获取最后一个规格文本框
            let guigeInput = document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children[document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children.length-1].querySelector('.ecom-g-input')
            if(i < taojianArr.length) {
                guigeInput.focus()
                changeReactInputValue(guigeInput,taojianArr[i])
                guigeInput.blur()
                i++
                taojianFn(i)
            }
        }
        function ceshi() {
            setTimeout(() => {
                let goodsname = document.querySelector('.ecom-g-input').value.trim()
                let rep = /\w+$/
                let goodsid = goodsname.match(rep)[0]
                let yanse = document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children
                let chima = document.getElementsByClassName('Item_contentBox__2ic-w')[1].children[2] ? document.getElementsByClassName('Item_contentBox__2ic-w')[1].children[2].children : document.getElementsByClassName('Item_contentBox__2ic-w')[0].children[2].children
                document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0] ? changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[0].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0]) : changeReactInputValue(document.getElementsByClassName('index_rowNew__9XDAi')[1].getElementsByClassName('ecom-g-input')[0],goodsname.match(rep)[0])
                let mubaninputDom = document.querySelector('.ecom-g-table-tbody')
                for(let i = 0;i < yanse.length-1;i++) {
                    if(document.getElementsByClassName('Item_contentBox__2ic-w')[1].children[2]) {
                        let inputDom = null
                        for(let j = 0;j < chima.length-1;j++){
                            if(document.getElementsByClassName('ecom-g-radio-group ecom-g-radio-group-outline')[1].getElementsByClassName('ecom-g-radio-input')[1].checked) {
                                inputDom = mubaninputDom.children[i*(chima.length-1)+j].children[8] ? mubaninputDom.children[i*(chima.length-1)+j].children[8].querySelector('.ecom-g-input') : mubaninputDom.children[i*(chima.length-1)+j].children[7].querySelector('.ecom-g-input')
                            }else{
                                inputDom = mubaninputDom.children[i*(chima.length-1)+j].children[6].querySelector('.ecom-g-input') ? mubaninputDom.children[i*(chima.length-1)+j].children[6].querySelector('.ecom-g-input') : mubaninputDom.children[i*(chima.length-1)+j].children[7].querySelector('.ecom-g-input')
                            }
                            console.log(inputDom)
                            let yanseid = yanse[i].querySelector('.ecom-g-input').value.trim()
                            let chimaname = chima[j].querySelector('.ecom-g-input').value.trim()
                            let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                            let newText = `${goodsid}-${yanseid}-${chimaid}`
                            changeReactInputValue(inputDom,newText)
                            inputDom.focus()
                        }
                    }else {
                        let inputDom = mubaninputDom.children[i+1].children[6].querySelector('.ecom-g-input')
                        if(document.getElementsByClassName('ecom-g-radio-group ecom-g-radio-group-outline')[0].getElementsByClassName('ecom-g-radio-input')[1] && document.getElementsByClassName('ecom-g-radio-group ecom-g-radio-group-outline')[0].getElementsByClassName('ecom-g-radio-input')[1].checked) {
                            inputDom = mubaninputDom.children[i+1].children[7].querySelector('.ecom-g-input')
                        }
                        let chimaname = chima[i].querySelector('.ecom-g-input').value.trim()
                        let chimaid = chimaname.replace(/[\(（].*[\)）]/,'')
                        let newText = `${goodsid}-${chimaid}`
                        changeReactInputValue(inputDom,newText)
                        inputDom.focus()
                    }
                }
                setTimeout(() => {
                    delectPicFn()
                    let timer = setInterval(() => {
                        if(document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1]) {
                            document.getElementsByClassName('ecom-g-btn ecom-g-btn-primary')[1].click()
                            if(document.querySelector('.ecom-g-modal-footer .ecom-g-btn')) {
                                document.querySelector('.ecom-g-modal-footer .ecom-g-btn').click()
                            }
                        }else if(document.getElementsByClassName('index_title__3Vqik')[0]) {
                            clearInterval(timer)
                            window.close()
                        }
                    },1000)
                    },2000)
            },1000)
        }
        setTimeout(() => {
            //ceshi()
        },3000)
    }

    // Your code here...
})();