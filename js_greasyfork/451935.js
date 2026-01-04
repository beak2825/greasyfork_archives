// ==UserScript==
// @name         新版补货单
// @namespace    http://tampermonkey.net/
// @version      1.5.98
// @description  快麦erp
// @author       许大包
// @match        https://erp.superboss.cc/index.htm*
// @match        https://erpa.superboss.cc/index.htm*
// @match        https://erpb.superboss.cc/index.htm*
// @match        https://erp4.superboss.cc/index.htm*
// @match        https://erp5.superboss.cc/index.htm*
// @icon         https://www.google.com/s2/favicons?domain=superboss.cc
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/448530-canvas2image-js/code/Canvas2Imagejs.js?version=1074688
// @downloadURL https://update.greasyfork.org/scripts/451935/%E6%96%B0%E7%89%88%E8%A1%A5%E8%B4%A7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451935/%E6%96%B0%E7%89%88%E8%A1%A5%E8%B4%A7%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let flag = true
        let imgName = ''
        let globalIndex
        let stop,nanzhuang,error
        let old = null
        let mouseold = null
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
                        fn.apply
                    }, time)
                }
            }
        }
        /**
         * @param {Function} fn 目标函数
         * @param {Number} time 延迟执行毫秒数
         * @param {Boolean} type
         * @description 节流函数
         */
        function throttle(fn, time, type) {
            let previous = 0
            let timeout
            type = type || false
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
        function toast(text,time,id) {
            let $html1 = document.querySelector('html')
            let $toast = document.createElement('div')
            let timer = time || 2000
            let toastid = id || "ccc"
            $toast.style.position = 'fixed'
            $toast.style.right = '10px'
            $toast.style.top = '20%'
            if(toastid != "ccc") $toast.style.top = '40%'
            $toast.innerText = text
            $toast.style.padding = '6px 10px'
            $toast.style.borderRadius = '8px'
            $toast.style.opacity = 0
            $toast.style.color = '#fff'
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
        // 复制文字的方法
        function copyToClip(content) {
            var aux = document.createElement("input")
            aux.setAttribute("value", content)
            document.body.appendChild(aux)
            aux.select()
            document.execCommand("copy")
            document.body.removeChild(aux)
        }
        function copyKuanhao(){
            let inputDom = $('.input-save-wrap .el-input__inner')
            let str = ''
            let arr = []
            console.log(inputDom)
            if(inputDom.length == 0) {
                if(document.querySelectorAll('.a-code .doc-copy-text').length !=0) {
                    for(let i = 0;i < document.querySelectorAll('.a-code .doc-copy-text').length;i++) {
                        if(i == 0) {
                            arr.push(document.querySelectorAll('.a-code .doc-copy-text')[0].innerText)
                        }
                        else if(!arr.includes(document.querySelectorAll('.a-code .doc-copy-text')[i].innerText)) {
                            console.log(document.querySelectorAll('.a-code .doc-copy-text')[i].innerText)
                            arr.push(document.querySelectorAll('.a-code .doc-copy-text')[i].innerText)
                        }
                    }
                    copyToClip(arr.join(','))
                    toast("复制成功")
                }else {
                    toast("当前页面错误")
                }
            }
            for(let i = 0;i < inputDom.length;i++) {
                if(inputDom[i].value.trim() == '') {
                    continue
                }else {
                    str += inputDom[i].value.trim() + ','
                }
            }
            copyToClip(str.slice(0,str.length-1))
            toast("复制成功")
        }
        // 打印便签选择尺码
        function chooseguige() {
            let guige = document.querySelector('#numinput').value.trim().toUpperCase()
            let domClassName = document.querySelectorAll('.tooltips-cell[data-v-639403ba]')[2].parentElement.parentElement.className
            let dom = document.querySelector('.el-table[data-v-639403ba]').getElementsByClassName('el-checkbox__original')
            for(let i = 1;i < dom.length; i++){
                if(document.getElementsByClassName(domClassName)[i].getElementsByClassName('tooltips-cell')[0].innerText.split(';')[0] == guige || document.getElementsByClassName(domClassName)[i].getElementsByClassName('tooltips-cell')[0].innerText.split(';')[1].replace(/[\(（].*[\)）]/,'') == guige) {
                    console.log(guige.replace(/[\(（].*[\)）]/,''))
                    dom[i].click()
                }
            }
            document.querySelector('#numinput').value = ''
        }
        document.onmouseup = function(e){
            if(e.button == 2){
                let mousenow = new Date()
                if(mouseold != null) {
                    if(mousenow.getTime() - mouseold.getTime() <= 300) {
                        document.getElementsByClassName('confirmReturn-container')[0].getElementsByClassName('el-button el-button--text')[0].click()
                        setTimeout(() => {
                            document.getElementsByClassName('el-input__inner')[2].focus()
                        },500)
                    }
                }
                mouseold = new Date()
            }
        }
        window.addEventListener('keyup',function(e) {
            if(e.keyCode == 32) {
                console.log(111111111)
                let now = new Date()
                if(old != null) {
                    if(now.getTime() - old.getTime() <= 300) {
                        document.getElementsByClassName('print-container')[0].getElementsByClassName('el-button el-button--link')[0].click()
                    }
                }
                old = new Date()
            }else if(e.keyCode == 96) {
                let now = new Date()
                if(old != null) {
                    if(now.getTime() - old.getTime() <= 300) {
                        document.getElementsByClassName('confirmReturn-container')[0].getElementsByClassName('el-button el-button--text')[0].click()
                        setTimeout(() => {
                            document.getElementsByClassName('el-input__inner')[2].focus()
                        },500)
                    }
                }
                old = new Date()
            }
        })
        window.addEventListener('keydown',function(e) {
            if(e.keyCode == 27) {
                if(window.location.href.indexOf('stock/new_rule') != -1) {
                    document.querySelector('.el-input__inner[placeholder="主商家编码"]').focus()
                }else {
                    document.querySelector('#zuhe').style.display = 'none'
                    stop = true
                    $('#temp_list').find('img').remove()
                    $('.borderdiv').remove()
                    $('#temp_list').css('minHeight',0)
                    $('#temp_bd').empty()
                }
            }else if(e.altKey && e.keyCode == 81){
                // alt + q
                // 判断在哪个页面
                if(window.location.href.indexOf('prod_correspondence') !== -1) {
                    document.querySelectorAll('.el-button--primary[data-v-5098f2d8')[0].click()
                    setTimeout(() => {
                        document.querySelectorAll('.El-select-shop[data-v-5098f2d8]')[0].querySelector('.el-select__input').click()
                        document.querySelectorAll('.el-scrollbar__view.el-select-dropdown__list')[document.querySelectorAll('.el-scrollbar__view.el-select-dropdown__list').length-1].querySelector('.el-select-dropdown__item').click()
                        document.querySelectorAll('.el-radio[data-v-5098f2d8]')[2].click()
                        document.querySelectorAll('.el-checkbox[data-v-5098f2d8]')[0].click()
                        setTimeout(() => {
                            document.querySelectorAll('.El-select-shop[data-v-5098f2d8]')[0].querySelector('.el-select__input').click()
                            document.querySelectorAll('.El-select-shop[data-v-5098f2d8]')[0].querySelector('.el-select__input').click()
                            document.querySelectorAll('.el-radio[data-v-5098f2d8]')[2].click()
                            setTimeout(() => {
                                document.querySelectorAll('.el-checkbox[data-v-5098f2d8]')[0].click()
                                document.querySelectorAll('.el-textarea[data-v-5098f2d8]')[0].children[0].focus()
                                document.querySelectorAll('.el-textarea[data-v-5098f2d8]')[0].children[0].addEventListener('keydown',function(e) {
                                    if(e.keyCode == 13) {
                                        // 禁止换行
                                        e.cancelBubble=true;
                                        e.preventDefault();
                                        e.stopPropagation();
                                        document.querySelectorAll('.el-button.el-button--primary[data-v-5098f2d8]')[2].click()
                                    }
                                })
                            },200)
                        },200)
                    },200)
                }else {
                    //创建套件商品填充商家编码
                    for(let i = 0;i < $('.ui-datalist-item-base-c').length;i++) {
                        // 获取第一个子商品的主商家编码
                        let zhubianma = $('.ui-datalist-item-base-c').eq(i).find('.a-code')[1].innerText.split('-')[0]
                        let guige = ''
                        let mingcheng = ''
                        for(let j = 1;j <= $('.ui-datalist-item-base-c').eq(i).find('.a-code').length-1;j++) {
                            if($('.ui-datalist-item-base-c').eq(i).find('.a-code').length-1 == 1) {
                                guige = $('.ui-datalist-item-base-c').eq(i).find('.a-code')[j].innerText.split('-')[1] + '+' + $('.ui-datalist-item-base-c').eq(i).find('.a-code')[j].innerText.split('-')[1]
                                mingcheng = $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[0].replace(/[\(（].*[\)）]/,'') + '+' + $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[0].replace(/[\(（].*[\)）]/,'') + ';' + $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[1].replace(/[\(（].*[\)）]/,'')
                            }else {
                                // 进行最后一个子商品的拼接
                                if(j == $('.ui-datalist-item-base-c').eq(i).find('.a-code').length-1) {
                                    guige += $('.ui-datalist-item-base-c').eq(i).find('.a-code')[j].innerText.split('-')[1]
                                    mingcheng += $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[1] ? $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[0].replace(/[\(（].*[\)）]/,'') + ';' + $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[1].replace(/[\(（].*[\)）]/,'') : $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[0].replace(/[\(（].*[\)）]/,'')
                                }else {
                                    guige += $('.ui-datalist-item-base-c').eq(i).find('.a-code')[j].innerText.split('-')[1] + '+'
                                    mingcheng += $('.ui-datalist-item-base-c').eq(i).find('.a-title')[j].innerText.split(';')[0].replace(/[\(（].*[\)）]/,'') + '+'
                                }
                            }
                        }
                        if($('.ui-datalist-item-base-c').eq(i).find('.a-code')[1].innerText.split('-')[2]) {
                            guige += '-'+$('.ui-datalist-item-base-c').eq(i).find('.a-code')[1].innerText.split('-')[2]
                        }
                        $('.ui-datalist-item-base-c').eq(i).find('.a-code input')[0].value = zhubianma + '-' + guige
                        $('.ui-datalist-item-base-c').eq(i).find('.a-title input')[0].value = mingcheng
                    }
                }
            }else if(e.altKey && e.keyCode == 87){
                // alt + w
                if(window.location.href.indexOf('prod_correspondence') !== -1) {
                    document.querySelectorAll('.el-button--primary[data-v-516217be')[0].click()
                    setTimeout(() => {
                        document.querySelectorAll('.el-button.el-button--primary[data-v-516217be]')[1].click()
                    },200)
                }else {
                    // 删除多个尺码的套件商品
                    let i = 0
                    function shanchu(i) {
                        if(i > $('.ui-datalist-item-base-c').length) return
                        for(let j = 1;j <= $('.ui-datalist-item-base-c').eq(i).find('.a-code').length-1;j++) {
                            if($('.ui-datalist-item-base-c').eq(i).find('.a-code')[1].innerText.split('-')[2]) {
                                if(j != $('.ui-datalist-item-base-c').eq(i).find('.a-code').length-1) {
                                    if($('.ui-datalist-item-base-c').eq(i).find('.a-code')[j].innerText.split('-')[2] != $('.ui-datalist-item-base-c').eq(i).find('.a-code')[j+1].innerText.split('-')[2]) {
                                        document.getElementsByClassName('p-icon p-icon-del J-suite-delete')[i].click()
                                        setTimeout(() => {
                                            shanchu(i)
                                        },100)
                                        break
                                    }else {
                                        i++
                                        shanchu(i)
                                        break
                                    }
                                }
                            }
                        }
                    }
                    shanchu(i)
                }
            }else if(e.altKey && e.keyCode == 90) {
                // 批量修改组合比例
                let $zuhe = document.querySelector('#zuhe')
                $zuhe.value = ''
                $zuhe.style.display = 'block'
                $zuhe.focus()
            }else if(e.altKey && e.keyCode == 83){
                // 修改现货分类
                let mouseover = new Event('mouseover', { bubbles: true })
                document.querySelector('.el-dropdown[data-v-7633a34e]').dispatchEvent(mouseover)
                document.querySelectorAll('.el-dropdown-menu.el-popper[data-v-7633a34e]')[0].querySelectorAll('.el-dropdown-menu__item')[4].click()
                setTimeout(() => {
                    let checkInputDom = document.querySelectorAll('.el-dialog[aria-label="批量修改分类"]')[0].querySelectorAll('.el-checkbox__original')
                    for(let i = 0;i < checkInputDom.length-1;i++) {
                        if(i == 1){
                            checkInputDom[i].checked ? "" : checkInputDom[i].click()
                        }else if(checkInputDom[i].checked) {
                            checkInputDom[i].click()
                        }
                    }
                    setTimeout(() => {
                        document.querySelectorAll('.el-dialog[aria-label="批量修改分类"]')[0].querySelectorAll('.el-button.el-button--primary')[0].click()
                    },500)
                },500)
            }else if(e.altKey && e.keyCode === 192) {
                if(window.location.href.indexOf('purchase/sold/') != -1) {
                    let isok = confirm('确定下载补货单？')
                    globalIndex = 0
                    // 补货单
                    if(isok) {
                        error = false
                        nanzhuang = false
                        stop = false
                        buhuodan(globalIndex)
                    }
                }else if(window.location.href.indexOf('stock/allot') != -1) {
                    let isok = confirm('确定下载调拨单？')
                    globalIndex = 0
                    if(isok) {
                        error = false
                        stop = false
                        diaobodan(globalIndex)
                    }
                }
            }else if(e.altKey && e.keyCode === 49) {
                let isok = confirm('确定下载补货单？（忽略错误）')
                globalIndex = 0
                // 补货单
                if(isok) {
                    error = true
                    nanzhuang = true
                    stop = false
                    buhuodan(globalIndex)
                }
            }else if(e.altKey && e.keyCode == 13) {
                // 手动上传库存
                if(window.location.href.indexOf('stock/new_rule') !== -1) {
                    setTimeout(() => {
                        document.querySelector('.is-leaf .el-checkbox__input').click()
                        setTimeout(() => {
                            document.querySelector('.el-button.btn-excel.el-button--text').click()
                            setTimeout(() => {
                                document.querySelector('.rc-btn-ok.ui_state_highlight').click()
                            },300)
                        },300)
                    },500)
                }else {
                    $('#temp_list').find('img').remove()
                    $('.borderdiv').remove()
                    $('#temp_list').css('minHeight',0)
                    $('#temp_bd').empty()
                    console.log(globalIndex)
                    buhuodan(globalIndex)
                }
            }else if(e.altKey && e.keyCode == 67) {
                if(flag) {
                    // 显示打印标签页面选择尺码的按钮
                    document.querySelector('#numinput').style.display = 'block'
                    document.querySelector('#numinput').focus()
                    flag = false
                }else {
                    // 隐藏打印标签页面选择尺码的按钮
                    document.querySelector('#numinput').style.display = 'none'
                    flag = true
                }
                copyKuanhao()
            }
        })
        // 添加规格方框和下载图片的方法
        function buhuo(index) {
            if($('#temp_bd').children().length > 0) {
                $('#temp_list').css({
                    minHeight:$('.ui-datalist-item-base').height()*3
                })
                let $img = $('#temp_bd').find('img:first').clone()
                $img.css({
                    position:'absolute',
                    left: $('#temp_list').find('.a-itemcategorynames:first').offset().left,
                    top: 0,
                    width: $('#temp_list').height(),
                    height: $('#temp_list').height()
                })
                $('#temp_list').append($img)
                //调整宽度
                $('#temp_list').css({
                    overflow: 'hidden',
                    width: $('#temp_list').find('img:last').offset().left + $('#temp_list').find('img:last').width()
                })
                $('#temp_bd').css('overflow','hidden')
                if($('#temp_bd .ui-datalist-item-base').length > 1) {
                    //添加同规格方框
                    let guigeArr = []
                    let guigeArr2 = []
                    let guigeDom = $('#temp_bd .a-propertiesname.a-propertiesname')
                    for(let i = 0;i < guigeDom.length; i++) {
                        guigeArr.push(guigeDom[i].innerText.split(';')[0])
                    }
                    let aa = new Set(guigeArr)
                    aa.forEach(item => {
                        guigeArr2.push(item)
                    })
                    for(let i = 0;i < guigeArr2.length; i++) {
                        let aleft = $('#temp_bd').find('.a-propertiesname').eq(guigeArr.indexOf(guigeArr2[i])).position().left-10
                        let atop = $('#temp_bd').find('.a-propertiesname').eq(guigeArr.indexOf(guigeArr2[i])).position().top
                        let div = $('<div></div>')
                        div.attr('class','borderdiv')
                        div.css({
                            position: 'absolute',
                            left: aleft,
                            top: atop,
                            border: '3px solid red',
                            borderRadius: '4px',
                            width: "100px",
                            height: guigeDom.eq(guigeArr.indexOf(guigeArr2[i+1])).offset().top - guigeDom.eq(guigeArr.indexOf(guigeArr2[i])).offset().top-20
                        })
                        if(i == guigeArr2.length-1) div.height(guigeDom.last().offset().top+guigeDom.last().outerHeight(true) - guigeDom.eq(guigeArr.indexOf(guigeArr2[i])).offset().top-10)
                        $('#temp_list').append(div)
                    }
                }
                // 截图
                domtoimage.toPng($('#temp_list')[0],{}).then((dataUrl) => {
                    var link = document.createElement('a')
                    link.download = imgName+new Date().getTime()
                    link.href = dataUrl;
                    link.click()
                    setTimeout(() => {
                        $('#temp_list').find('img').remove()
                        $('.borderdiv').remove()
                        $('#temp_bd').empty()
                        if(index != $('.ui-datalist-item-base').length-1) {
                            // 图片名字
                            imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                            buhuodan(globalIndex)
                        }else {
                            buhuodan(globalIndex)
                        }
                    },2000)
                }).catch(e => {
                    if(error) {
                        $('#temp_list').find('img').remove()
                        $('.borderdiv').remove()
                        $('#temp_list').css('minHeight',0)
                        $('#temp_bd').empty()
                        buhuodan(globalIndex)
                        return false
                    }
                    copyToClip(imgName+new Date().getTime())
                    alert('出错咯，手动截图！')
                    // 将图片名字复制到剪切板
                    if(index != $('.ui-datalist-item-base').length-1) {
                        // 图片名字
                        imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                    }
                })
            }else {
                globalIndex++
                buhuodan(globalIndex)
            }
        }

        // 将图片克隆到另一个div的方法
        function buhuodan(index) {
            console.log(index)
            if(stop) {
                return false
            }
            else if(index < $('.ui-datalist-item-base').length-1) {
                if(index == 0) {
                    if($('.ui-datalist-item-base').eq(index).find('.item-tag').last().text() != '卖超') {
                        if($('.ui-datalist-item-base').eq(index).find('.item-tag').last().text() != '疫情') {
                            $('#temp_bd').append($('.ui-datalist-item-base').eq(0).clone(true))
                            imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                        }
                    }
                    globalIndex++
                    buhuodan(globalIndex)
                }else if($('.ui-datalist-item-base').eq(index).find('.item-tag').last().text() == '卖超' || $('.ui-datalist-item-base').eq(index).find('.item-tag').last().text() == '疫情') {
                    globalIndex++
                    buhuodan(globalIndex)
                }else if(nanzhuang && $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 && $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText == '男装') {
                    if(index == $('.ui-datalist-item-base').length-2) {
                        stop = true
                        $('#temp_list').find('img').remove()
                        $('.borderdiv').remove()
                        $('#temp_list').css('minHeight',0)
                        $('#temp_bd').empty()
                        alert('下载完成！')
                    }else {
                        globalIndex++
                        buhuodan(globalIndex)
                    }
                }
                // 判断是否是同一个款号
                else if($('.ui-datalist-item-base').eq(index).find('.a-itemouterid').text() == $('.ui-datalist-item-base').eq(index-1).find('.a-itemouterid').text()) {
                    if($('#temp_bd').children().length > 0) {
                        if($('.ui-datalist-item-base').eq(index).find('.a-itemouterid').text() == $('#temp_bd .ui-datalist-item-base').last().find('.a-itemouterid').text()) {
                            // 图片名字
                            imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                            // 添加到克隆的DOM中
                            $('#temp_bd').append($('.ui-datalist-item-base').eq(index).clone(true))
                            globalIndex++
                            buhuodan(globalIndex)
                        }else {
                            buhuo(globalIndex)
                        }
                    }else {
                        // 图片名字
                        imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                        // 添加到克隆的DOM中
                        $('#temp_bd').append($('.ui-datalist-item-base').eq(index).clone(true))
                        globalIndex++
                        buhuodan(globalIndex)
                    }
                }else {
                    if($('#temp_bd').children().length > 0) {
                        buhuo(index)
                    }else {
                        // 图片名字
                        imgName = $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change').length > 0 ? $('.ui-datalist-item-base').eq(index).find('.a-suppliername').find('.j-change')[0].children[0].innerText : ''
                        // 添加到克隆的DOM中
                        $('#temp_bd').append($('.ui-datalist-item-base').eq(index).clone(true))
                        globalIndex++
                        buhuodan(globalIndex)
                    }
                }
            }else {
                if($('#temp_bd').children().length > 0) {
                    buhuo(globalIndex)
                }
                stop = true
                $('#temp_list').find('img').remove()
                $('.borderdiv').remove()
                $('#temp_list').css('minHeight',0)
                $('#temp_bd').empty()
                alert('下载完成！')
            }
        }

        function diaobodan(index) {
            console.log(index)
            if(stop) {
                return false
            }
            else if(index < $('.ui-datalist-item-detail .ui-datalist-item').length) {
                // 添加到克隆的DOM中
                $('#temp_bd').append($('.ui-datalist-item-detail .ui-datalist-item').eq(index).clone(true))
                globalIndex++
                diaobo(globalIndex)
            }else {
                stop = true
                $('#temp_list').find('img').remove()
                $('.borderdiv').remove()
                $('#temp_list').css('minHeight',0)
                $('#temp_bd').empty()
                alert('下载完成！')
            }
        }
        // 添加规格方框和下载图片的方法
        function diaobo(index) {
            if($('#temp_bd').children().length > 0) {
                $('#temp_list').css({
                    minHeight:$('.ui-datalist-item-skus').height()*3
                })
                $('#temp_list .a-title').width('200px')
                $('#temp_list .ui-datalist-item-skus').css('margin','5px 0')
                $('#temp_list .a-itemouterid').css({fontSize: '16px',fontWeight: 700})

                $('#temp_list .a-shorttitle').remove()
                $('#temp_list .a-outerid').remove()
                $('#temp_list .a-qualitytype').remove()
                $('#temp_list .a-outgoodsectioncode').remove()
                $('#temp_list .a-outnum').css({color: 'red',fontSize: '18px',borderBottom: '1px solid #ccc'})
                $('#temp_bd .a-propertiesname').css({borderBottom: '1px solid #ccc'})
                let $img = $('#temp_bd').find('img:first').clone()
                $('#temp_list .a-picpath').remove()
                $img.css({
                    position:'absolute',
                    left: $('#temp_list').find('.a-price:first').offset().left-50,
                    top: 0,
                    width: $('#temp_list').height(),
                    height: $('#temp_list').height()
                })
                $('#temp_list').append($img)
                //调整宽度
                $('#temp_list').css({
                    overflow: 'hidden',
                    width: $('#temp_list').find('img:last').offset().left + $('#temp_list').find('img:last').width()
                })
                $('#temp_bd').css('overflow','hidden')
                if($('#temp_bd .ui-datalist-item-base').length > 1) {
                    //添加同规格方框
                    let guigeArr = []
                    let guigeArr2 = []
                    let guigeDom = $('#temp_bd .a-propertiesname')
                    for(let i = 0;i < guigeDom.length; i++) {
                        guigeArr.push(guigeDom[i].innerText.split(';')[0])
                    }
                    let aa = new Set(guigeArr)
                    aa.forEach(item => {
                        guigeArr2.push(item)
                    })
                    for(let i = 0;i < guigeArr2.length; i++) {
                        let aleft = $('#temp_bd').find('.a-propertiesname').eq(guigeArr.indexOf(guigeArr2[i])).position().left-10
                        let atop = $('#temp_bd').find('.a-propertiesname').eq(guigeArr.indexOf(guigeArr2[i])).position().top
                        let div = $('<div></div>')
                        div.attr('class','borderdiv')
                        div.css({
                            position: 'absolute',
                            left: aleft,
                            top: atop,
                            border: '3px solid red',
                            borderRadius: '4px',
                            width: "100px",
                            height: guigeDom.eq(guigeArr.indexOf(guigeArr2[i+1])).offset().top - guigeDom.eq(guigeArr.indexOf(guigeArr2[i])).offset().top-20
                        })
                        if(i == guigeArr2.length-1) div.height(guigeDom.last().offset().top+guigeDom.last().outerHeight(true) - guigeDom.eq(guigeArr.indexOf(guigeArr2[i])).offset().top-10)
                        $('#temp_list').append(div)
                    }
                }
                // 截图
                domtoimage.toPng($('#temp_list')[0],{}).then((dataUrl) => {
                    var link = document.createElement('a')
                    link.download = new Date().getTime()
                    link.href = dataUrl;
                    link.click()
                    setTimeout(() => {
                        $('#temp_list').find('img').remove()
                        $('.borderdiv').remove()
                        $('#temp_bd').empty()
                        diaobodan(globalIndex)
                    },2000)
                })
            }else {
                globalIndex++
                diaobodan(globalIndex)
            }
        }
        let styleDom = `
        <style>
            #numinput {
                display: block;
                position: fixed;
                right: 10px;
                top: 49.5%;
                width: 80px;
                height: 25px;
                transform: translate(0.-25px);
                outline: none;
                border-radius: 4px;
                border: 1px solid rgba(100,86,247,.6);
                text-align: center;
                font-size: 12px;
                color: #888;
                z-index: 999999999999;
            }
            #copy {
                display: none;
                position: fixed;
                right: 10px;
                top: 7%;
                width: 80px;
                height: 25px;
                border: none;
                border-radius: 4px;
                color: #fff;
                background: rgba(38,149,250,.9);
                z-index: 999999999999;
            }
            #zuhe {
                display: none;
                position: fixed;
                left: 50%;
                top: 50%;
                width: 300px;
                height: 40px;
                transform: translate(-50%,-50%);
                outline: none;
                border-radius: 4px;
                border: 3px solid rgba(100, 86, 247,.6);
                text-align: center;
                font-size: 18px;
                color: #888;
                z-index: 9999999999999999999;
            }
        </style>
            <input id="zuhe" placeholder="组合比例" autocomplete="off">
            <input id="numinput" placeholder="选择规格" autocomplete="off">
            <button id="copy">复制</button>
            <div id="temp_table" class="ui-data-table tx-left">
                <div id="temp_list" class="ui-datalist">
                    <div id="temp_bd" class="ui-datalist-bd">
                    </div>
                </div>
            <div>
        `
        document.body.insertAdjacentHTML("beforeend", styleDom)
        document.getElementById('numinput').addEventListener('keydown',function(e) {
            if(e.keyCode == 13) {
                chooseguige()
            }
        })
        document.querySelector('#zuhe').addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                document.querySelector('#zuhe').style.display = 'none'
                $('.for-proportion.rc-number-control').val(document.querySelector('#zuhe').value)
            }
        })
        document.querySelector('#copy').addEventListener('click',copyKuanhao)
        let dom1 = document.createElement('script')
        dom1.setAttribute('type','text/javascript')
        dom1.setAttribute('src','https://greasyfork.org/scripts/448541-dom-to-image-js/code/dom-to-imagejs.js?version=1074759')
        document.querySelector('html').appendChild(dom1)
    },4000)
    // Your code here...
})();