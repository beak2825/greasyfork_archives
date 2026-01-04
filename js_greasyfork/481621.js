// ==UserScript==
// @name         道路标注-二三阶段
// @namespace    http://tampermonkey.net/
// @version      2024.1.8.1 Beta
// @description  Try it
// @author       You
// @match        https://annotation-test.bettersmart.net/taskCenter/specialRoadTask
// @match        https://annotation.bettersmart.net/taskCenter/specialRoadTask
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bettersmart.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481621/%E9%81%93%E8%B7%AF%E6%A0%87%E6%B3%A8-%E4%BA%8C%E4%B8%89%E9%98%B6%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/481621/%E9%81%93%E8%B7%AF%E6%A0%87%E6%B3%A8-%E4%BA%8C%E4%B8%89%E9%98%B6%E6%AE%B5.meta.js
// ==/UserScript==

(function() {
/**
使用：
【Q、W、E】     ==> 分别新增 普通车道、公交车道、非机动车道（点击不同序号的单元格（包括车道序号单元格）可在其右侧新增一列，点击标记点详情一列可重置为最右侧新增一列）
R （red缩写）   ==> 显示/隐藏红点
Y （yellow缩写）==> 显示/隐藏黄点
B （black缩写） ==> 显示/隐藏黑点
T               ==> 开启/关闭测距
S               ==> 删除当前选中标注点的最后车道信息
Shift+S         ==> 删除当前选中标注点的所有车道信息


主动触发：保存后自动刷新
**/
    
    let isReload = false
    let focusIdx = -1
    new MutationObserver((mutations) => {
        // console.log(mutations)
        mutations.some((mutation) => {
            //mutation.addedNodes.length && console.log(mutation.addedNodes[0]) && console.log(mutation)
            if(mutation.addedNodes.length && mutation.addedNodes[0]?.className?.includes('app-wrapper')) {
                //页面初始化
                let shrinkBtn = document.querySelector('#hamburger-container')
                if(document.querySelector('.app-wrapper').className.includes('openSidebar')) shrinkBtn.click()

                // document.querySelector('.navbar-container').style.display = 'none'
                // document.querySelector('.app-main-container').style.height = '100vh'


                document.querySelector('.img-container').style.padding = '0'
                document.querySelector('.img-container').style.right = '0'
                let imgWrap = document.querySelector('.img-container').children[0]
                imgWrap.style.width = '800px'
                imgWrap.style.height = null

                document.querySelector('.detail-container').style.top = '500px' //调整标记点详情面板位置
                document.querySelector('.detail-container').style.opacity = '0.9'
                document.querySelector('.sort-container').style.opacity = '0.9'

                console.log(123, )
                let parentElement = [...mutation.addedNodes[0].querySelector('.detail-container.bar').querySelectorAll('.clearfix')].at(-1);
                let inputWrap = document.createElement('div')
                let timeInput = document.createElement('input')
                let timeSelector = document.createElement('select')
                let inputTip = document.createElement('span')
                timeInput.className = 'time-input';
                timeInput.style.height = '25px'
                timeSelector.className = 'time-selector';

                let selVals = ['工作日', '非工作日', '早高峰', '晚高峰', '--']
                selVals.forEach((curVal, idx) => {
                    let selectOption = document.createElement('option')
                    selectOption.innerText = curVal
                    selectOption.value = idx
                    if(idx == selVals.length-1) selectOption.setAttribute('selected', idx)
                    timeSelector.appendChild(selectOption)
                })

                let storeTime = localStorage.getItem('inputTime');
                storeTime && (timeInput.value = storeTime)
                inputTip.style.fontSize = '12px'
                inputTip.style.marginLeft = '5px'

                timeInput.addEventListener('input', ()=> {
                    if(vertifyTime(timeInput.value)) {
                        inputTip.textContent = ''
                        localStorage.setItem('inputTime', timeInput.value)
                    } else {
                        inputTip.textContent = '格式有误 或 时间不合理'
                    }
                })

                inputWrap.append(timeSelector, timeInput, inputTip)
                parentElement.insertBefore(inputWrap, parentElement.firstChild)

                document.querySelector('.detail-container.bar').children[0].querySelector('.clearfix').addEventListener('click', ()=> {focusIdx = -1})
                document.querySelector('.table-box').querySelector('.w3').addEventListener('click', ()=> {focusIdx = 0})

                new MutationObserver((mutations) => {
                    mutations.some((mutation) => {
                        if(mutation.addedNodes.length && mutation.target?.className?.includes('df') && mutation.target.innerText.includes('车道序号')) {
                            //console.log(mutation.target, mutation)
                            mutation.addedNodes[0].addEventListener('click', (e) => {
                                focusIdx = mutation.addedNodes[0].textContent
                            })
                        }
                    })
                }).observe(document.querySelector('.table-box'), {childList: true, subtree: true})
                return true
            }

            if(mutation.addedNodes.length && mutation.addedNodes[0]?.className?.includes('el-message-box__wrapper') && mutation.addedNodes[0].innerText.includes('是否结束当前连接轨迹操作')) {
                [...mutation.addedNodes[0].querySelectorAll('button')].find((btn) => btn.textContent.includes('确定')).addEventListener('click', () => {isReload = true})

            }
            if(isReload && mutation.addedNodes.length && mutation.addedNodes[0]?.className?.includes('el-message el-message--success') && mutation.addedNodes[0].innerText.includes('操作成功')) {
                location.reload();
            }
        })
    }).observe(document.body, {childList: true, subtree: true})


    document.addEventListener('keydown', (e) => {
        console.log(e.keyCode, e);

        //【T键】开启/关闭测距
        if(e.keyCode == 84) {
            let toolWrap = document.querySelector('.leaflet-bar.leaflet-control')
            toolWrap.children[0].click()
            if(toolWrap.children[0].title === '开启测距') toolWrap.children[1].click()
        }
        
        //【Shift+S键】删除选中标记点的所有车道信息 【S键】删除选中标记点的最后一个车道信息a
        if(e.keyCode == 83 && (!e.shiftKey || confirm('确认删除？'))) removeAnnotation(e.shiftKey ? 'multiple' : 'single', false)


        //【R键】显示/隐藏红点
        let keyCodesMap = {
            82: '红',
            89: '黄',
            66: '黑',
        }
        if(Object.keys(keyCodesMap).includes(e.keyCode+'')) {
            getToolBtn(keyCodesMap[e.keyCode]).click()
        }

        //【Q、W、E】 控制新增不同车道
        let insertMap = [81, 69, 87]
        if(insertMap.includes(e.keyCode) && document.querySelector('.detail-container.bar').querySelector('.clearfix.box').style.display !== 'none') {
            new Promise((res) => {
                if(!document.querySelector('.menu')) {
                    [...document.querySelector('.table-box').querySelector('.clearfix.df').querySelectorAll('.table-head')].at(focusIdx).dispatchEvent(new Event('contextmenu'))
                }
                res()
            }).then(() => {
                document.querySelector('.menu').querySelectorAll('.menu-line')[0].click() //新增一列
            }).then(()=> {
                //选择车道
                [...document.querySelector('.table-box').querySelectorAll('.df')[1].querySelectorAll('.table-cell')].at(focusIdx).querySelectorAll('li')[insertMap.indexOf(e.keyCode)].click()
                //选择方向
                if(e.keyCode !== 69) [...document.querySelector('.table-box').querySelectorAll('.df')[2].querySelectorAll('.table-cell')].at(focusIdx).querySelectorAll('li')[0].click()


                let timeIdx = 0
                let times = document.querySelector('.time-input').value.split(',')
                let isTimeLegal = vertifyTime(document.querySelector('.time-input').value)

                if(e.keyCode == 87 && isTimeLegal) {
                    modifyTime(times, timeIdx)
                }else if(e.keyCode == 87 && !isTimeLegal){
                    return alert('时间不合法')
                } else {
                    focusIdx = -1
                }
                
            })
        }
    })

    function vertifyTime(timeStr) {
        let times = timeStr.split(',')
        return !times.some((curTime)=> {
            let groups = /^(?<hour1>\d{2}):(?<min1>\d{2})-(?<hour2>\d{2}):(?<min2>\d{2})$/.exec(curTime)?.groups
            if(!groups || groups.hour1-0 > 23 || groups.hour2-0 > 23 || groups.min1-0 > 59 || groups.min2-0 > 59 || groups.hour1-0 > groups.hour2-0 || (groups.hour1-0 == groups.hour2-0 && groups.min1-0 >= groups.min2-0)) return true
        });
    }

    function modifyTime(times, timeIdx) {
        new Promise((res) => {
            //调出公交车道 时间面板
            console.log(focusIdx, [...document.querySelector('.table-box').querySelectorAll('.df')[3].querySelectorAll('.table-cell')].at(focusIdx).querySelector('button'));
            [...document.querySelector('.table-box').querySelectorAll('.df')[3].querySelectorAll('.table-cell')].at(focusIdx).querySelector('button').click()
            res()
        }).then(() => {
            let groups = /^(?<time1>\d{2}:\d{2})-(?<time2>\d{2}:\d{2})$/.exec(times[timeIdx]).groups
            if(groups) {
                let timeSelector = document.querySelector('.time-selector')
                if(timeSelector.value != timeSelector.querySelectorAll('option').length-1) document.querySelector('.menuPop').querySelectorAll('li')[timeSelector.value].click()
                document.querySelector('.menuPop').querySelector('.el-date-editor').click()
                setTimeout(() => {
                    let inputs = document.querySelector('.menuPop').querySelectorAll('input')
                    inputs[1].value = groups.time1
                    inputs[1].dispatchEvent(new Event('input'));
                    inputs[1].dispatchEvent(new Event('change'));

                    inputs[2].value = groups.time2
                    inputs[2].dispatchEvent(new Event('input'));
                    inputs[2].dispatchEvent(new Event('change'));
                    [...document.querySelector('.menuPop').querySelectorAll('.el-button')].find((btn) => btn.textContent.includes('确定')).click()
                    if(timeIdx < times.length-1) {
                        modifyTime(times, ++timeIdx)
                    } else {
                        focusIdx = -1
                    }
                })
            }
        })
    }
    /**
    删除标注项目
    param mode{string} 删除的方式：单个（single）或多个（multiple），默认单个删除
    param isRecursive{string} 该参数不用传，递归标记，当标记不为0时，表示经过了递归调用，用来区分标注项为空时是删除造成还是一开始就为空
    **/
    function removeAnnotation(mode = 'single', isRecursive = false) {
        if(mode !== 'single' && mode !== 'multiple') mode = 'single'

        let w4 = document.querySelector('.table-box').children[0].querySelectorAll('.w4');
        if(!w4[0] && isRecursive == true) return [...document.querySelector('.detail-container.bar').querySelectorAll('.el-button')].at(-1).click(); //如果标注项不是被删完的，就不选择确定
        [].at.call(w4, -1).dispatchEvent(new MouseEvent('contextmenu'));

        setTimeout(() => {
            document.querySelector('.menu').querySelectorAll('.menu-line')[1].click()

            if( mode == 'multiple') removeAnnotation(mode, true)
        })
    }

    function getToolBtn(textContent) {
        return [...document.querySelector('.app-main').querySelector('.tool-container.bar').children].find((btnWrap) => btnWrap.innerText.includes(textContent)).querySelector('input')
    }

    function qsAll(str) {
        return [...document.querySelectorAll(str)]
    }
/**
 日志：
 2023/12/7：
 - 新增：快捷键【Y】一键删除当前轨迹下选中的标注点

 2023/12/8：
 - 适配：正式服

 2023/12/15
 - 新增：【R】 显示/隐藏红点
 - 新增：【Y】 显示/隐藏黄点
 - 新增：【B】 显示/隐藏黑点
 - 调整：删除当前选中标注点的所有车道信息 改为 【Ctrl+D 】

  2023/12/15
  - 新增：【Q、W、E】分别新增 普通车道、公交车道、非机动车道（点击不同序号的单元格（包括车道序号单元格）可在其右侧新增一列，点击标记点详情一列可重置为最右侧新增一列）
  - 新增：【T】开启/关闭测距
  - 调整：删除当前选中标注点的所有车道信息 改为 【Shift+D 】
  
  2023/12/21
  - 修复：W键时间设置移位问题
  - 修复：删除快捷键失效
  - 调整：删除改为 Shift S（原快捷键与平台冲突）

  2023/12/24
  - 新增：【S】删除选中标注点的最后车道信息

  2023/12/25
  - 修复：在指定列右侧新增非公交的标注项，插入列不重置

  2023/12/28
  - 修复：时间输入框失效问题

  2024/1/8
  - 新增：初始化页面UI（收起左侧导航栏，调整图片大小，调整部分面板透明度）
**/
})();