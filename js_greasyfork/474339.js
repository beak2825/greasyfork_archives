// ==UserScript==
// @name         多传感融合项目
// @namespace    http://tampermonkey.net/
// @version      2023.12.26.1 Beta
// @description  try to take over the world!
// @author       You
// @match        https://seed.mindflow.com.cn/*
// @icon         https://seed.mindflow.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474339/%E5%A4%9A%E4%BC%A0%E6%84%9F%E8%9E%8D%E5%90%88%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474339/%E5%A4%9A%E4%BC%A0%E6%84%9F%E8%9E%8D%E5%90%88%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';


/**==================================
快捷键：
I          ==>  控制图像映射
Y          ==>  控制图像关联映射
`          ==>  聚焦
U          ==>  控制个体属性
N          ==>  削弱边框线的颜色
shift + D  ==>  调整车头方向 （顺时针）
X          ==>  2D映射图属性自动勾选 （需同时打开映射图窗口和个体属性窗口）
[ 或 ]     ==>  切换三视图 （视图放大时生效）
L          ==>  放大视图最大化
enter      ==>  一键初始化 （打开映射图、关闭对象列表、开启聚焦、开启克隆形状、勾选关联ID时自动勾选克隆大小、设置三视图排列）
;          ==>  开启/关闭检查
B          ==>  开启位移模式
Ctrl+B     ==>  编组/取消编组
数字小键盘 ==>  切换映射图不同视角
O          ==>  开启或关闭微调时边框线淡色
C          ==>  根据对象的是否关键和关联ID的勾选情况，提示ID关联（连按两次关闭）
J          ==>  开启/关闭显示运动轨迹
shift + Z  ==>  切换着色渲染方式（高度/强度）
alt + s    ==>  设置面板
==================================**/

    // Your code here...
    showMessage('工具已启用', {type: 'success'})
    let isFade = false
    let isOpenYinshePanel = false //标记快捷勾选映射属性面板是否开启
    let isOpenYinshe, isOpenGeti
    let nodeAll = 156 //网页初始加载的 dom 数
    let curNodeAll = 0 //当前加载完成的 dom 数
    let isInitialize = false
    let isOpenCheck = false
    let checkObject //记录当前检查的个体
    let checkFrame //记录检查到第几帧
    let radarArr = [] //记录雷达选择
    let attrArr = [] //记录个体属性选择（除雷达、点云截断、点云遮挡）
    let size3DArr = [] //记录3D框的尺寸大小
    let isOpenWeakColorInTune = false //标记是否开启微调淡色功能
    let isWeekColor = false //标记开启淡色调整下的淡色状态
    let isCheckLinkID = true //检查并提示关联ID
    let pressCheckCount = 0 //记录连续按C键的次数，关闭或开启提示关联ID
    let allAbortController = []; //用于存放开启淡色微调时，创建的所有终止控制器对象
    let closeLinkImage_lock = false; //控制关闭关联映射
    let localSettingMap = JSON.parse(localStorage.getItem('settingMap'));


    new MutationObserver((mutations) => {
        //console.log('mutations', mutations)
        mutations.forEach((mutation) => {
            [...mutation.addedNodes].forEach(node => {
                if(typeof node.className == 'string' && node?.className?.includes('mf-pcd-resize-box')) {
                    //console.log(node.className)

                }

            })
        })
    }).observe(document.body, { childList: true, subtree: true })

    //生成设置面板
    createSettingPanel()

    /**
    * 生成设置面板
    */
    function createSettingPanel() {
        let newDom = document.createElement('div')
        document.body.appendChild(newDom);
        newDom.outerHTML = `<div class="setting-box">
    <div class="setting-option-wrap">
      <div class="setting-option"><input name="openFullScreen" type="checkbox" style=""/><span>开启全屏</span></div>
      <div class="setting-option"><input name="openFocus" type="checkbox"  style=""/><span>开启聚焦</span></div>
      <div class="setting-option"><input name="openWeakColorInTune" type="checkbox"  style=""/><span>开启3D框淡色调整</span></div>
      <div class="setting-option" style="border-bottom: #ccc solid 2px; margin-bottom: 15px; padding-bottom: 5px;"><input name="open2DImageDrawer" type="checkbox" id="scales" style=""/><span>打开图像映射抽屉</span></div>
      <div class="setting-option up-down" >
        <div class="setting-tit">视图布局：</div>
        <div class="image2D-wrap" >
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAA20lEQVRIS2NkGCDAOED2MgwOi1+8eDGJkZEhh4GBsIOYmJilREVFn7948eIMIyODMREhd0dMTFyfkZHxG0gtio9fvXp54////+pEGMJAhsUgPeqioqK3MCx++fL5TQYGRrVRi7GFwLAJ6iYGBkZxYuKYlZWtTEhI6CMJqRp34iLGQnQ1VLH4+fPnjiwsLNzEOEBERGQ3IyPjT6pYPJqd8AX5sMlOI6zIHLDsREz+pUkB8vLl84EpMkcLkNECBDkEqFxkvpjFwMCQQvfmLTn5mFw9g6MnQa7rydEHALWc6x+UZX2DAAAAAElFTkSuQmCC" alt="">
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABpUlEQVRoQ+1aO07EMBCd2YSWJnIMnIGGnhIKpN0zcANKaqCjWKQ9AoiCmqXjEFRcATbOpqBG8SABkVaBxXHEJyYvZeJY8+a9eZOMzNSzi3uGlwD4vzMOhnvLcFEUq2X5fEnEeyISh5IIZn5ipjOl9MlnMS+VdJ5np9bKYShA63HG8cpmkiT39ftLARszuxahUaiAB4NopJS68QE8FaEhAAeSATD8TtRXNQxJB6Lm1zAhaUi6pldjZqhh1HCHMwDTgmnBtODSHbaoj6HBtGBaMK3snIh2gyrchWCjiPaTRN82HvGECtQVNwbxrgyF/hwMVwwa429azDRWSo+rPebzbMdauvBURZamemvxHWOyOyLSPvt4m1a7AQAfa62PqsDyPB9aW059AmXmxzTVGzXADyKy7rPPL31pATAYdskSkiYiYzLUsEspMK2f+T2ES8OlXbUHl4ZLuzTy9hwuDZf+liEe2hLaksty0JbQllwaad+WJiJ00Gz7alV3TKvF4VKzRmSviHhbRKJmwP8ecOvjw80AhrcKc+nwOPOLGAz75Su81b1j+AUiiJVbVGjauQAAAABJRU5ErkJggg==" alt="">
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAABs0lEQVRoQ+1avUrDUBQ+N7ldHZpeM4jODuIkrg4iKNg3EJwUn0BwdRB1cHcUfAJ18w0EF6Hv0JuYQRxteqRiNJRWbHJSrubrWMjJ/c73nd9cRTX7qZrhJQD+74yD4doynCTJTJq+XROpLWbWUo7wPH/FGPOY2bPWXhLxvpR9pdSLUnRhTHg8yuZYScexPev3+VDqIJmdqgFn79G6sRQEQWf4/GMBR1H3hpnafxWw5/ltY8zdJIBvmWkbgEt6YFqSBsOfRP0Uw5B0STV/PA5JC9fhXPlDlh44AzGcSSKKukhaSFoFPIAsjSxdQDYjHkFridZySBYoSzKhhV5aeqdVope2V0S0IUTslxmtabPZDJ+yP+LYnjPTjvR7fJ92gyC8//WKR/oArtjDIt4VJqo6Bxj+Hg9rlrTQeAgFFcZDjIcyUsJ4iPEQ4yHWtCLZBGUJZUlESIPNCj6m4WNaXkwYHmRCC1tLh7aWaDxERO1y41Gvq4fPnYeTtLVwJEJrzsi0GJ74cunrwfJsb33vtLe4usatuXn2dEMCfNWAC18flgDnog3spV1kRfJMYFjSmy7aqh3D79vqQlvIVb8LAAAAAElFTkSuQmCC" alt="">
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABr0lEQVRIS+2XsU4CQRCG/z2O2FDe7Z7BwgDvYOIDqBQmJmIoLEg0WPsUtrZaWGqBIdEo6gvY8ApqgRbuHsEOTARuDGcggCLHhROibnfZnf12/p3ZmWOY0GAT4mI6wLZtnxI568DQA5WEsOZbatm2uiWixSHKEWNannO+0V7X47FS0vEAbdmOCm7ZkBCWNghMHu/cDxhCWB1H+z3+c+DnGy9SM6YpzkVmhOBytx0otRdo/xqPUf09mIhm+jauM8YcIgoB0LvmiDH2NjaPlZI9wRUKYc0wrHMp5S5j2O8CBxvV/+DfJ7WU8qw7qnWd9gxjtiilXAWw3TVXtiwrO7aonmQed6rH8DLH3NQbywPSn8eD4JrGiqYpFsYOvri8wmPpCZnMJiKRyCd+YOCDwyOUy2XsZLcgBP85cK32imq1CtM0XGilUkGz6YBz0/0OzOMP2IsLaTTqOD7JgchBOp3CXDQaHFgp5cLaI5lcRlgP4e7+AcmVpUDAbrNXKFwjFo8jHNYBAhKJWM89+5R6cLNn23aOyEkN6zR9gFv1O8+5+Lq99fNy+bWZjj8Jv6f3Y/cOb5Z3LjhLfDoAAAAASUVORK5CYII=" alt="">
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAB50lEQVRIS+2WT0tbQRTFzy3ZKMRAse9OwNi0ixojXRVx5V4hVGloS8GC+B26qPiJNKLSgqJiEKWUVHdJqbZdJKXkTVYq6i69Ms8oKjEvwUnjIgNvc2e4v3vO/HmX0MJBLWTj/sBLJT0rIkkipBxHvTWuaO0eE1GniOSY1fNKrERE3SJSYFbR85j+DcjTW5wUIpp3HH59df6acq3dfwCIiOYch99UQCcAOgFkr8IBPAKQrxNuUgmzelALLmaySXAwq2tibypvw5ux523bLw98+8B5Vmjtfjm/59hwHDVTieUAdACyzxweMTHXLe4Q0UOA/jLzcB0vnJe/5j2/y0/G53m953Ct3a+NqBfBd6XUlBXbtXa957WBkWFWQ1bhxWIRC4uf0BuJIJEYrVWLfXg6vYmtbe/gY/rjBwQCgdsKsA8/PDrC+noavZEeDA6++L/Kq9Gy2Rwy33aRfDWOUKjrYol95SZzuVyGsb8v9gwHB4dYWvqMcFjh9OQUk5MTCAaDZpl9uAGnUgvIF/54RZhv7GUC8XgMyyurGBiI40n0cXPg+z9/YW1tA+8n3uHH3p6nsj/WV203rCr3GkhDERHTy/ld+Ubgfg2kngMkeVGAH7mBPReA5plrtM51wKwu8fXVKu1GspbCzwAG4qwuLA+cNwAAAABJRU5ErkJggg==" alt="">
          <img class="image2D-layout" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAABu0lEQVRYR+2Xv0rDUBTGvxuaQejqvYFmkLZP4ODgC5QKTv7p4KAodO4LuDi6CE4KzgURJ6u+gE4O7upSdDg3NlstQmOvpE1pUmmNJWmLNNsll/zO991z7jlhmODDJsjG9MAtS14opdaATlCMaYuc80cp5T6gDnwufQphzLlry5J3AJaHOaiUUoyxS87Fpn9fQLmU1OqCw8KlpPvf4B5QCWFow+Aq8DKE8j/AIYQRENuvfAZvu99NOCIqahpKvSPR6pzzJXcdu+3DMjl2uFLKzdKELwi3dJpjUU5EJcZw5INXhTAWZvCQl8xodf7/bSeiY39ZOY5zaJrmGxGtMoa93jtmCSGKkSbcKL09sjr36jlMDG6dt/tAZHApKdBYBkXBGB44N+K5Xq8qN6hWX7GzvYVkMvkjhljhJ6dnsKx3FIu7MIQYL7zRaKBe/wDn821wrWaj1foC59zrdjHa7hJs24abAE7TQbl8DgWFQmEdZiqFWG0nkh6wM0nm8znoegJPzy9Yyedig7cHyMr1LTLpNHRdB6CQzWYC5z6i8uEDZP/oHGGpdUfnjYHTa5jbJco90/PHEqWqMN+aqPJvQktdLy8dNHIAAAAASUVORK5CYII=" alt="">
        </div>
      </div>
    </div>
    <div class="setting-bottom"><div class="setting-btn confirm">确定</div></div>
  </div>`;
        document.querySelector('style').textContent+=`
    .setting-box {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      padding: 10px 0;
      border-radius: 5px;"
      font-size: 15px;
      background-color: #303234;
      color: #fff;
      z-index: 9999;
      box-shadow: #555 0 0 5px 1px;
    }
    .setting-box input[type="checkbox"] {
      width: 16px;
      height: 16px;
      cursor: pointer;
      margin-right: 8px;
    }
    .setting-box input[type="checkbox"]:checked::after {
      content: '✓';
      display: block;
      background-color: #745eff;
      width: 16px;
      height: 16px;
      line-height: 16px;
      font-weight: 800;
      text-align: center;
      color: #fff;
    }
    .setting-option-wrap {
      padding: 0 10px;
    }
    .setting-option {
      user-select: none;
      display: flex;
      align-items: center;
      min-height: 30px;
      font-size: 15px;
      transition: .5s all;
    }
    .setting-option span{
      line-height: 40px;
    }
    .setting-bottom {
      display: flex;
      flex-direction: row-reverse;
      margin-top: 15px;
      padding: 0 10px;
    }
    .setting-btn {
      width: 50px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 14px;
      background-color: #745eff;
      border-radius: 5px;
      cursor: pointer;
    }
    .image2D-layout {
      width: 23px;
      height: 23px;
      padding: 3px;
      cursor: pointer;
      border-radius: 5px;
      transition: .3s all;
    }
    .up-down {
      flex-direction: column;
    }
    .up-down div {
      width: 100%;
    }
    .setting-tit {
      margin-bottom: 5px;
      font-size: 13px;
    }`


        let settingBox = document.querySelector('.setting-box')
        let settingMap = localSettingMap ? localSettingMap : {}

        //监视设置盒子的开启，从而重置勾选
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(mutation.attributeName == 'style' && mutation.target.style.display == 'block') {
                    if(localSettingMap) {
                        let allCheckBox = document.querySelector('.setting-option-wrap').querySelectorAll('input[type="checkbox"]')
                        for(let i = 0; i < allCheckBox.length; ++i) {
                            allCheckBox[i].checked = localSettingMap[allCheckBox[i].name];
                        }

                        [...document.querySelectorAll('.image2D-layout')].forEach((curImage2D) => {curImage2D.style.background = null})
                        localSettingMap.image2DSrc ? [...document.querySelectorAll('.image2D-layout')].find((curImage2D) => curImage2D.src === localSettingMap.image2DSrc).style.background = '#745eff' : null
                    }
                }
            })
        }).observe(settingBox, {attributes: true, childList: true})


        let confirmBtn = document.querySelector('.setting-btn.confirm')

        confirmBtn.addEventListener('click', () => {
            let allCheckBox = document.querySelector('.setting-option-wrap').querySelectorAll('input[type="checkbox"]')
            for(let i = 0; i < allCheckBox.length; ++i) {
                settingMap[allCheckBox[i].name] = allCheckBox[i].checked
            }
            settingMap.image2DSrc = [...document.querySelectorAll('.image2D-layout')].find((curImage2D) => curImage2D.style.background).src
            localStorage.setItem('settingMap', JSON.stringify(settingMap));
            settingBox.style.display = 'none';

            showMessage('修改成功，刷新后生效！', {type: 'success'})
        })

        let image2DWrap = document.querySelector('.image2D-wrap')
        image2DWrap.addEventListener('click', (e) => {
            if(!e.target.className.includes('image2D-layout')) return
            [...document.querySelectorAll('.image2D-layout')].forEach((curImage2D) => {curImage2D.style.background = null});
            e.target.style.background = '#745eff'
        })
    }

    addEventListener('keyup',(e)=> {
        if(!/#\/(tool|tread|texamine)\?/.test(location.href)) return

        console.log(e.keyCode,e )

        switch(e.keyCode) {
            // `键 开启/关闭映射图像抽屉
            case 73: document.querySelector('.tool-position.left-bottom').querySelector('.tool-wrap').children[2].querySelector('.mf-icon-wrap.el-tooltip.tooltip').click();break;
            // Y键 控制图像关联映射
            case 89: document.querySelector('.drawer-item.mf-tool-drawer.mf-mapping-drawer-wrap.mf-theme-dark').children[1].children[0].children[1].children[0].click(); break;
            // I键 控制聚焦
            case 192: {
                let focusBtn = document.querySelector('#driver-object-drawer').querySelector('.el-tooltip.tooltip.msicon.msicon-jujiao-diaoke')
                for(let i = 0; i < 2; ++i) {
                    setTimeout(() => document.querySelector('#driver-object-drawer').querySelector('.el-tooltip.tooltip.msicon.msicon-jujiao-diaoke').click())
                }
            };break;
            // U键 控制个体属性
            case 85: document.querySelector('.el-tooltip.tooltip.msicon.msicon-shuxingchouti').click(); break;
            // N键 削弱边框线的颜色
            case 78:
                [...document.querySelectorAll('.vdr-stick')].forEach(item => {!isFade ? item.style.opacity = '.3' : item.style.opacity = '1'});
                [...document.querySelectorAll('.vdr.mf-pcd-resize-box.active ')].forEach(item => {!isFade ? item.style.opacity = '.2' : item.style.opacity = '1'})
                isFade = !isFade;
                break;
            // 开启/关闭显示运动轨迹
            case 74:{
                [...document.querySelector('.mf-editor-setting-list').children].forEach(setItem => {
                    if(setItem.innerText.includes('显示运动轨迹')) setItem.querySelector('input').click()
                });
                break;
            }
                // shift + Z键 切换着色渲染方式（高度/强度）
            case 90:{
                if(!e.shiftKey) break;
                let allRenderTypeLabels = document.querySelector('.render-type').querySelectorAll('label')
                allRenderTypeLabels[allRenderTypeLabels[0].className.includes('is-active') ? 1 : 0].click();
                break;
            }
        }

        if(e.keyCode == 83 && e.altKey) {
            let settingBox = document.querySelector('.setting-box')
            settingBox.style.display = settingBox.style.display == 'block' ? 'none' : 'block'
        }

        //Alt + ` 开启/关闭聚焦模式
        if(e.keyCode == 192 && e.altKey) {
            document.querySelector('#driver-object-drawer').querySelector('.el-tooltip.tooltip.msicon.msicon-jujiao-diaoke').click()
        }

        //B键 切换为移位移模式
        if(e.keyCode == 66 && !e.ctrlKey) {
            let translateBtn = document.querySelector('.mf-action-icon-translate')
            if(!translateBtn.parentElement.className.includes('mf-active')) {
                document.querySelector('.mf-action-icon-translate').click();
            }
        }else if(e.keyCode == 66 && e.ctrlKey) {
            [...document.querySelector('.canvas-editor-widget.mf-group-tool-popover').querySelectorAll('.flex-item')].at(-1).querySelector('.mf-icon-wrap.el-tooltip.tooltip').click()
        }

        //复制提示
        if(e.keyCode == 67) {
            ++pressCheckCount

            let timer = setTimeout(()=> {
                pressCheckCount = 0
            }, 800)

            if(pressCheckCount >= 2) {
                isCheckLinkID = !isCheckLinkID
                showMessage(`${ isCheckLinkID ? '开启' : '关闭'}关联ID提示`)
                clearTimeout(timer)
                pressCheckCount = 0
            }


            if(!isCheckLinkID) return
            //检查当前选中的对象是否为关键障碍物
            [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].forEach((attrItem) => {
                if(attrItem.querySelector('.tit').title == '是否为关键障碍物') {
                    let isLinkID = document.querySelector('.mf-frame-control-setting-panel').childNodes[0].querySelectorAll('label')[0].className.includes('is-checked')
                    let isKey = attrItem.querySelectorAll('label')[0].className.includes('is-checked')
                    console.log(isLinkID,isKey)
                    console.log(attrItem.querySelectorAll('label'))
                    if((isKey && !isLinkID) || (!isKey && isLinkID)) showMessage('提示：请确认是否需要关联ID', {direction: 'top', type: 'warning'})

                }
            })
        }

        /**
        //'键 为主窗口的映射图添加映射属性勾选面板
        if(e.keyCode == 222) {
            if(document.querySelector('.attrSelePanel-mainView')) return

            document.querySelector('.x-mapping-box').children[0].style.position = 'relative'
            let attrSelePanel = createAttrPanel()
            attrSelePanel.className = 'attrSelePanel-mainView'
            attrSelePanel.style.left = 0
            document.querySelector('.x-mapping-box').children[0].appendChild(attrSelePanel);

            //遍历图像映射的指示器，获取当前选中的映射图的序号
            [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach(operator => {
                //检查当前映射图是否同时处于选择状态和关联状态
                if(operator.className.includes('curr-img') && operator.className.includes('mf-active')) {
                    attrSelePanel.style.display = 'flex';
                    update2DMapAttr()
                }
            })
        }**/

        //O键 开启或关闭微调淡色
        if(e.keyCode == 79){
            //if(isInitializeWeakColorInTune) return
            if(allAbortController.length) { //存在终止控制器对象则说明，开启了淡色微调功能
                allAbortController.forEach((controller) => controller.abort())
                allAbortController = []
                return
            }

            openWeakColorInTune()
        }

        /**
        * 用于开启淡色微调（创建必要的鼠标事件，并将控制终止器进行存放，方便后期移除事件）
        **/
        function openWeakColorInTune() {
            let allResizeBox = [...document.querySelectorAll('.vdr.mf-pcd-resize-box')];
            let allPoint = [...document.querySelectorAll('.vdr-stick')];
            let mouseupEventAbortController = new AbortController()
            allAbortController.push(mouseupEventAbortController)

            allPoint.forEach(point => {
                let mousedownEventAbortController = new AbortController() //创建终止控制器对象，用于后期移除dom事件
                allAbortController.push(mousedownEventAbortController)

                point.addEventListener('mousedown', ()=> {
                    isWeekColor = true
                    allPoint.forEach(item => {item.style.opacity = '.1'});
                    allResizeBox.forEach(item => {item.style.opacity = '.3'});
                    [...document.querySelectorAll('.mf-pcd-resize-box__direction__horizontal')].forEach(item => {item.style.opacity = '.05'}); //放大视图后，指向图标会更换，需要重新获取
                    [...document.querySelectorAll('.mf-pcd-resize-box__drag__point')].forEach(item => {item.style.opacity = '.05'})
                }, { signal: mousedownEventAbortController.signal })
                
            });
            allResizeBox.forEach(resizeBox => {
                let mousedownEventAbortController = new AbortController()
                allAbortController.push(mousedownEventAbortController)
                resizeBox.addEventListener('mousedown', ()=> {
                    isWeekColor = true
                    //console.log(1111)
                    allPoint.forEach(item => {item.style.opacity = '.2'});
                    allResizeBox.forEach(item => {item.style.opacity = '.3'});
                    [...document.querySelectorAll('.mf-pcd-resize-box__direction__horizontal')].forEach(item => {item.style.opacity = '.1'});
                    [...document.querySelectorAll('.mf-pcd-resize-box__drag__point')].forEach(item => {item.style.opacity = '0'})

                }, { signal: mousedownEventAbortController.signal })
            });
            document.addEventListener('mouseup', (e)=> {
                if(!isWeekColor) return
                allPoint.forEach(item => {item.style.opacity = '1'});
                allResizeBox.forEach(item => {item.style.opacity = '1'});
                [...document.querySelectorAll('.mf-pcd-resize-box__direction__horizontal')].forEach(item => {item.style.opacity = '1'});
                [...document.querySelectorAll('.mf-pcd-resize-box__drag__point')].forEach(item => {item.style.opacity = '1'})
                isWeekColor = false
            }, { signal: mouseupEventAbortController.signal })
        }


        //shift + D 顺时针调整车头方向
        if(e.shiftKey && e.keyCode == 68) {
            let orderArr = [1, 2, 0, 3]; //顺时针的下标顺序（初始为下标1）
            let wrap = [...document.querySelector('.float-menu-wrap.top').children].find((item) => (item.children.length == 4)); //拿到调整朝向的wrap
            [...wrap.children].forEach((toward, index) => {
                if(/is-active/.test(toward.className)) {
                    orderArr.some((item, orderIndex)=> {
                        if(item == index) return (wrap.children[orderArr.at(orderIndex == 3 ? 0 : ++orderIndex)].click(), true) //顺时针改变朝向
                    })
                }
            })
        }

        let curView, curPopper, curViewWrap, curViewIndex
        // [ 或 ] 切换三视图
        if(e.keyCode == 219 || e.keyCode == 221) {
            let top = document.querySelector('#top')
            let front = document.querySelector('#front')
            let leftSide = document.querySelector('#leftSide')
            //当没有视图被放大的时候 不可用
            if((top.style.height == front.style.height && front.style.height == leftSide.style.height) || (top.style.width == front.style.width && front.style.width == leftSide.style.width)) return

            let curViewportWrap
            //确认当前视图位置，并退出放大
            [...document.querySelector('.mf-tool-wrap.mf-theme-dark').querySelector('#main').parentNode.children].some((viewportWrap, index) => {
                if(/mf-active/.test(viewportWrap.children[1].className)) {
                    viewportWrap.children[0].children[1].children[0].click()
                    curViewportWrap = viewportWrap
                    return true
                }
            });

            //根据获取的下标值触发目标视图放大按钮
            [...document.querySelector('.mf-tool-wrap.mf-theme-dark').querySelector('#main').parentNode.children].forEach((viewportWrap, index) => {
                if(viewportWrap == curViewportWrap) {
                    if(e.keyCode == 219) {
                        document.querySelectorAll('.mf-viewport-box__icon.mf-viewport-box__icon__view_state_fullscreen')[index == 0 ? 2 : --index].click()
                    } else if(e.keyCode == 221) {
                        document.querySelectorAll('.mf-viewport-box__icon.mf-viewport-box__icon__view_state_fullscreen')[index == 2 ? 0 : ++index].click()
                    }
                }
            })
        }


        //L 最大化全屏
        if(e.keyCode == 76) {
            //判断当前处于哪个视图，并 放大/缩小 视图
            let allView = [...document.querySelector('#main').parentElement.children];
            allView.forEach((curDom)=> {
                if(curDom.id !== '2dImage' && curDom.id !== 'main' && /mf-active/.test(curDom.children[1].className)) {
                    curDom.querySelector('.mf-viewport-box__icon.mf-viewport-box__icon__view_state_fullscreen')?.click()
                } else if(curDom.id == 'main' && /mf-active/.test(curDom.children[1].className)){ //当选中点云图时，默认放大顶视图
                    document.querySelector('#top').querySelector('.mf-viewport-box__icon.mf-viewport-box__icon__view_state_fullscreen')?.click()
                }
            })

        }


        // ;键 开启映射属性勾选检查
        if(e.keyCode == 186) {
            showMessage(`${isOpenCheck ? '关闭' : '开启'}映射属性勾选检查`)
            isOpenCheck = !isOpenCheck
        }


        //数字键盘切换不同视角的映射图
        let viewAngleObj = {
            97: 1,
            98: 0,
            99: 2,
            103: 3,
            104: [4, 6],
            105: 5
        }
        if(Object.keys(viewAngleObj).includes(e.keyCode.toString())) {
            if(!Array.isArray(viewAngleObj[e.keyCode])) {
                document.querySelector('.mf-mapping-drawer__anchor').children[viewAngleObj[e.keyCode]].click()
                document.querySelector('.mf-mapping-drawer-wrap__image__list').children[viewAngleObj[e.keyCode]].scrollIntoView({ behavior: "smooth", block: "center", inline: "end" });

            } else {
                //判断当前位于哪个视角
                [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach((viewIndicator, index) => {
                    if(viewIndicator.className.includes('curr-img')) {
                        document.querySelector('.mf-mapping-drawer-wrap__image__list').children[index == 4 ? 6 : 4 ].scrollIntoView({ behavior: "smooth", block: "center", inline: "end" });
                        document.querySelector('.mf-mapping-drawer__anchor').children[index == 4 ? 6 : 4 ].click()
                    }
                })
            }
        }


        //回车 一键初始化
        if(e.keyCode == 13) {
            if(isInitialize) return

            isInitialize = true

            //一键初始化
            new Promise(function(resolve, reject) {
                //全屏模式
                localSettingMap && localSettingMap.openFullScreen && document.documentElement.requestFullscreen()

                //打开映射图
                if(localSettingMap?.open2DImageDrawer && !/is-active/.test(document.querySelector('.tool-position.left-bottom').querySelectorAll('.tool-item')[2].className)) { //已经打开了 则保留
                    document.querySelector('.tool-position.left-bottom').children[0].childNodes[2].children[0].children[0].click()
                }

                /**
                //关闭对象列表
                if(/is-show/.test(document.querySelector('#driver-object-drawer').className)) { //已经关闭了 则不再打开
                    document.querySelector('#driver-object').click()
                }**/

                //开启聚焦
                if(localSettingMap?.openFocus && !/filter-icon-selected/.test(document.querySelector('#driver-object-drawer').querySelector('.el-tooltip.tooltip.msicon.msicon-jujiao-diaoke').className)) {
                    document.querySelector('#driver-object-drawer').querySelector('.el-tooltip.tooltip.msicon.msicon-jujiao-diaoke').click()
                }

                //开启克隆形状
                let cloneDom = document.querySelector('.mf-frame-control-setting-panel').children[2].children[0].children[0]; //克隆形状的dom
                if(!/is-checked/.test(cloneDom.className)) cloneDom.click()

                //打开个体属性
                let individualDom = document.querySelector('.el-tooltip.tooltip.msicon.msicon-shuxingchouti')
                if(!individualDom.className.includes('filter-icon-selected')) individualDom.click()

                //设置视图排列方案
                if(localSettingMap?.image2DSrc) {
                    [...document.querySelectorAll('.mf-action-bar-mark-tool__caret')].map((item) => {
                        if(item.children.length == 3) return [...item.children]
                    }).flat().find((item) => {
                        return item && getComputedStyle(item?.querySelector('.mf-pcd-action-bar__item').children[0]).backgroundImage.match(/url\("(.*)"\)/)[1] === JSON.parse(localStorage.getItem('settingMap')).image2DSrc
                    }).click()
                }

                //勾选关联ID时，自动勾选克隆大小
                document.querySelector('.mf-frame-control-setting-panel').querySelectorAll('.el-radio-group')[0].children[0].addEventListener('click', ()=> {
                    if(!/is-checked/.test(cloneDom.className)) cloneDom.click()
                });

                localSettingMap?.openWeakColorInTune && openWeakColorInTune()

                //设置工具预设方案（中型车和大型车的开门属性为无延申，点云截断属性为无截断）
                //工具方案
                let ToolSchemeMap = {
                    '中型车': {
                        '车辆类型': '小汽车',
                        '开门属性': '无延伸',
                    },
                    '骑行': {
                        '类型': '骑电动自行车的人',
                    },
                    '人': {
                        '类型': '行人',
                    },
                    '大型车': {
                        '开门属性': '无延伸 ',
                    },
                    '非机动车': {
                        '车辆类型': '电动自行车',
                    },
                    '交通障碍物': {
                        '类别': '交通桩',
                    },
                    '其他': {
                        '类别': '忽略',
                    },
                };
                //中型车默认【小汽车】、骑行默认【骑电动自行车的人】、人默认【行人】、非机动车默认【电动自行车】、交通障碍物默认【交通桩】、其他默认【忽略】
                for(let entity in ToolSchemeMap) { //中型车
                    [...document.querySelector('#driver-tag-drawer').querySelectorAll('.tool-item')].slice(1).some(curEntity => {
                        if(curEntity.querySelector('.category-title').innerText.includes(entity)) {
                            for(let category in ToolSchemeMap[entity]) { //车辆类型
                                [...curEntity.querySelectorAll('.el-collapse-item.sub-coll.has-children')].some(curCategory => {
                                    //console.log(1,curCategory)
                                    if(curCategory.querySelector('.sub-tit').innerText.includes(category)) {
                                        [...curCategory.querySelectorAll('.radio-item')].some(curCategorySubItem => {
                                            if(curCategorySubItem.querySelector('.sub-tit').innerText.includes(ToolSchemeMap[entity][category])) {
                                                setTimeout(()=> {curCategorySubItem.querySelector('input').click()})
                                                return true
                                            }
                                        })
                                        return true
                                    }
                                })
                            }
                            return true
                        }
                    })
                }
                setTimeout(()=> {document.querySelector('#driver-tag-drawer').querySelectorAll('.tool-item')[1].click()}) //遍历工具列表会影响到个体框的选择，导致最后框选择为其他，所以需要重新选回中型车


                //创建个体属性勾选面板
                createEntityAttrSelePanel();

                resolve()

                /**
                * 用于生成主窗口的个体属性勾选面板
                */
                function createEntityAttrSelePanel() {
                    let optionWrap = document.createElement('div')
                    optionWrap.className = 'option-wrap'
                    optionWrap.style.fontSize = '12.5px'
                    optionWrap.style.display = 'none'
                    optionWrap.style.userSelect = 'none'

                    let headWrap = document.createElement('div')
                    setStyleSheet(headWrap, {
                        'display': 'flex',
                        'align-items': 'center',
                        'fontWeight': '800'
                    })

                    let typeSelectWrap = document.createElement('div')
                    let typeSelect = document.createElement('select')

                    setStyleSheet(typeSelect, {
                        'background': 'rgba(0,0,0,.65)',
                        'color': '#fff',
                        'cursor': 'pointer',
                    })

                    typeSelect.addEventListener('change', () => {
                        let linkLabel = document.querySelector('#driver-object-Tag-drawer').querySelector('.el-collapse').children[1].querySelectorAll('label')[typeSelect.value];
                        if(!linkLabel.className.includes('is-checked')) linkLabel.click()
                    })

                    //监视个体属性，动态添加类型属性的selectOption
                    new MutationObserver((mutations) => {
                        mutations.some((mutation) => {
                            if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && mutation.addedNodes[0].className == 'el-collapse') { //判断是否切换了个体或当前个体属性内容有更新
                                //清掉所有option
                                typeSelect.innerHTML = '';
                                //遍历类型属性，生成option
                                [...document.querySelector('#driver-object-Tag-drawer').querySelector('.el-collapse').children[1].querySelectorAll('.radio-item')].forEach((curRadioItem, itemIdx) => {
                                    let selectOption = document.createElement('option')
                                    selectOption.innerText = curRadioItem.querySelector('.sub-tit').innerText
                                    selectOption.value = itemIdx
                                    typeSelect.appendChild(selectOption)
                                })
                                return true;
                            }
                        });
                    }).observe(document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0], { childList: true, subtree: true });

                    let radarOption = document.createElement('div')
                    /**
                    let radar_st = document.createElement('span')
                    let radar_hw = document.createElement('span')
                    **/
                    radarOption.innerText = '雷达'
                    radarOption.style.marginLeft = '5px'
                    /**
                    radar_hw.checkedColor = document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[1]?.style.background || '#EE63D8'
                    radar_hw.innerText = '华'
                    radar_st.checkedColor = document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[3]?.style.background || '#5CD430'
                    radar_st.innerText = '腾'
**/
                    let keyBarrierOption = document.createElement('div')
                    keyBarrierOption.innerText = '关键'
                    keyBarrierOption.style.marginLeft = '5px'
                    /**
                    let keyBarrier_true = document.createElement('span')
                    let keyBarrier_false = document.createElement('span')
                    keyBarrier_true.checkedColor = 'red'
                    keyBarrier_true.innerText = '是'
                    keyBarrier_false.checkedColor = '#999'
                    keyBarrier_false.innerText = '否'
**/

                    let obstructOption = document.createElement('div')
                    let obstruct_true = document.createElement('span')
                    let obstruct_false = document.createElement('span')
                    obstructOption.innerText = '点遮：'
                    obstruct_true.checkedColor = 'red'
                    obstruct_true.innerText = '有'
                    obstruct_false.checkedColor = '#999'
                    obstruct_false.innerText = '无'

                    let cutOffOption = document.createElement('div')
                    let cutOff_true = document.createElement('span')
                    let cutOff_false = document.createElement('span')
                    cutOffOption.innerText = '点截：'
                    cutOff_true.checkedColor = 'red'
                    cutOff_true.innerText = '有'
                    cutOff_false.checkedColor = '#999'
                    cutOff_false.innerText = '无'

                    let imageTruncate = document.createElement('div')
                    let imageTruncate_without = document.createElement('span')
                    let imageTruncate_0_50 = document.createElement('span')
                    let imageTruncate_50_100 = document.createElement('span')
                    imageTruncate.innerText = '映截：'
                    imageTruncate_without.checkedColor = '#999'
                    imageTruncate_without.innerText = '无'
                    imageTruncate_0_50.innerText = '≤50'
                    imageTruncate_50_100.innerText = '>50'

                    let imageOccluded = document.createElement('div')
                    let imageOccluded_without = document.createElement('span')
                    let imageOccluded_0_50 = document.createElement('span')
                    let imageOccluded_50_100 = document.createElement('span')
                    let imageOccluded_100 = document.createElement('span')
                    let imageOccluded_misty = document.createElement('span')

                    imageOccluded.innerText = '映遮：'
                    imageOccluded_without.checkedColor = '#999'
                    imageOccluded_without.innerText = '无'
                    imageOccluded_0_50.innerText = '≤50'
                    imageOccluded_50_100.innerText = '>50'
                    imageOccluded_100.innerText = '100'
                    imageOccluded_misty.checkedColor = 'red'
                    imageOccluded_misty.innerText = '糊';

                    [headWrap, obstructOption, cutOffOption, imageTruncate, imageOccluded].forEach((optionDom) => {optionDom.style.marginBottom = '3px'});

                    let paramPanel = document.querySelector('.mf-viewport-box__content--top_left')
                    paramPanel.style.userSelect = 'text';
                    paramPanel.style.display = 'flex';

                    typeSelectWrap.appendChild(typeSelect)
                    headWrap.appendChild(typeSelectWrap)
                    headWrap.appendChild(radarOption)
                    headWrap.appendChild(keyBarrierOption)
                    /**
                    radarOption.appendChild(radar_hw)
                    radarOption.appendChild(radar_st)

                    keyBarrierOption.appendChild(keyBarrier_true)
                    keyBarrierOption.appendChild(keyBarrier_false)
**/
                    obstructOption.appendChild(obstruct_false)
                    obstructOption.appendChild(obstruct_true)

                    cutOffOption.appendChild(cutOff_false)
                    cutOffOption.appendChild(cutOff_true)

                    imageTruncate.appendChild(imageTruncate_without)
                    imageTruncate.appendChild(imageTruncate_0_50)
                    imageTruncate.appendChild(imageTruncate_50_100)


                    imageOccluded.appendChild(imageOccluded_without)
                    imageOccluded.appendChild(imageOccluded_0_50)
                    imageOccluded.appendChild(imageOccluded_50_100)
                    imageOccluded.appendChild(imageOccluded_100)
                    imageOccluded.appendChild(imageOccluded_misty)

                    optionWrap.appendChild(headWrap)
                    optionWrap.appendChild(obstructOption)
                    optionWrap.appendChild(cutOffOption)
                    optionWrap.appendChild(imageTruncate)
                    optionWrap.appendChild(imageOccluded)

                    paramPanel.appendChild(optionWrap);

                    let obj = {
                        '类型属性': typeSelect,
                        '雷达属性': radarOption,
                        '是否为关键障碍物': keyBarrierOption,
                        '点云遮挡属性': obstructOption,
                        '点云截断属性': cutOffOption,
                        '2D映射图截断': imageTruncate,
                        '2D映射图遮挡': imageOccluded,
                    };
                    let linkColor = {
                        '雷达属性': {
                            '华为': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[1]?.style.background || '#EE63D8',
                            '速腾': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[3]?.style.background || '#5CD430'
                        },
                        '是否为关键障碍物': {
                            '关键障碍物': 'red',
                            '非关键障碍物': '#999'
                        }
                    };

                    //为每个按钮绑定点击事件
                    for(let k in obj) {
                        if(k === '雷达属性' || k === '是否为关键障碍物') {
                            obj[k].style.cursor = 'pointer'

                            obj[k].addEventListener('click', ()=> {
                                let attrItem = [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].find((attrItem) => {return attrItem.querySelector('.tit').title == k});
                                new Promise((res) => {
                                    let clickLabel = [...attrItem.querySelectorAll('label')].find((label) => !label.className.includes('is-checked'))
                                    clickLabel.click()
                                    res()
                                }).then(() => {
                                    //检查
                                    let answer = attrItem.querySelector('.answer')?.textContent.trim()
                                    obj[k].style.color = answer ? linkColor[k][answer] : '#fff'
                                })
                            })
                        } else {
                            [...obj[k].children].forEach((btn, btnIndex) => {
                                btn.style.cursor = 'pointer'
                                btn.style.marginRight = '8px'

                                btn.addEventListener('click', () => {
                                    [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].forEach((attrItem) => {

                                        new Promise((res)=> {
                                            if(attrItem.querySelector('.tit').title == k) attrItem.querySelectorAll('label')[btnIndex].click()
                                            res()
                                        }).then(() => {
                                            [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].forEach((attrItem) => {
                                                let attrTitle = attrItem.querySelector('.tit').title
                                                if(attrTitle == k) {
                                                    [...attrItem.querySelectorAll('label')].forEach((label, labelIndex) => {
                                                        let linkBtn = [...obj[k].children][labelIndex]
                                                        if(label.className.includes('is-checked')) {
                                                            linkBtn.style.color = linkBtn.checkedColor ? linkBtn.checkedColor : 'pink';
                                                            linkBtn.style.fontWeight = '800'
                                                        } else {
                                                            linkBtn.style.color = '#fff';
                                                            linkBtn.style.fontWeight = '400'

                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        }
                    }



                    //监视3D框参数面板，控制个体属性勾选面板的显示
                    new MutationObserver((mutations) => {
                        //console.log(mutations)
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && mutation.addedNodes[0].className == 'mf-info-window') { //当新增的dom节点的类不是empty-wrap，说明有新的个体属性内容进来，标志着个体的更换
                                optionWrap.style.display = 'block'
                            } else if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && mutation.addedNodes[0].nodeName == '#comment' && mutation.nextSibling?.className?.includes('option-wrap')){ //当没有信息时，dom会被删除，取而代之的是一个注释
                                optionWrap.style.display = 'none'
                            }
                        });
                    }).observe(document.querySelector('.mf-viewport-box__content--top_left'), { childList: true, subtree: true });


                    //监视个体属性抽屉，更新个体属性勾选面板
                    new MutationObserver((mutations) => {
                        mutations.some((mutation) => {
                            if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && (mutation.addedNodes[0].className == 'el-collapse' || mutation.addedNodes[0].className !== 'empty-wrap')) { //当新增的dom节点的类不是empty-wrap，说明有新的个体属性内容进来，标志着个体的更换
                                console.log(123, mutation);
                                //控制各类属性的展示和隐藏
                                [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].some((attrItem) => {
                                    if(attrItem.querySelector('span[title="2D映射图截断"]') || attrItem.querySelector('span[title="2D映射图遮挡"]') ) {
                                        imageTruncate.style.display = 'block'
                                        imageOccluded.style.display = 'block'
                                        return true
                                    } else {
                                        imageTruncate.style.display = 'none'
                                        imageOccluded.style.display = 'none'

                                    }
                                });

                                document.querySelectorAll('.mf-info-window').length ? updateAttrSelect() : null //如果聚焦了某个个体，则同步个体属性勾选信息
                                return true
                            }
                        });
                    }).observe(document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0], { childList: true, subtree: true });

                    //监视个体属性抽屉，控制关联映射
                    new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && mutation?.addedNodes[0]?.className == 'empty-wrap') { //当新增的dom节点的类是empty-wrap，表示失焦个体，此时尝试关闭关联映射
                                closeLinkImage_lock = false
                                let imageMappingLink = document.querySelector('.el-tooltip.pcd-image-mapping__state.tooltip');
                                setTimeout(() => {!closeLinkImage_lock && imageMappingLink.className.includes('mf-active') && imageMappingLink.click()}, 300)

                            }else if (mutation.type === 'childList' && mutation.removedNodes.length !== 0 && mutation?.removedNodes[0]?.className == 'empty-wrap') { //当新增的dom节点的类是empty-wrap，表示聚焦个体，此时尝试关闭关联映射
                                closeLinkImage_lock = true //如果聚焦了个体，则打开→关闭关联映射的锁（用于切换个体时，个体属性瞬间的add和remove empty-wrap）

                            }
                        });
                    }).observe(document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0], { childList: true, subtree: true });


                    //为帧列表的每一帧绑定监视器
                    [...document.querySelector('.frame-list').children].forEach((item, index)=> {
                        // 需要监听的CSS类名
                        const targetClass = 'mf-active';

                        // 创建一个新的MutationObserver实例
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'attributes' && mutation.target === item && mutation.attributeName === 'class') {
                                    const currentClasses = Array.from(item.classList);

                                    if (currentClasses.includes(targetClass)) {
                                        // 切帧
                                        document.querySelectorAll('.mf-info-window').length ? updateAttrSelect() : null
                                    }
                                }
                            });
                        });

                        // 配置观察选项
                        const config = { attributes: true, subtree: true };

                        // 开始观察目标元素
                        observer.observe(item, config);
                    })

                    function updateAttrSelect() {
                        let linkColor = {
                            '雷达属性': {
                                '华为': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[1]?.style.background || '#EE63D8',
                                '速腾': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[3]?.style.background || '#5CD430'
                            },
                            '是否为关键障碍物': {
                                '关键障碍物': 'red',
                                '非关键障碍物': '#999'
                            }
                        };
                        //同步各类属性的勾选状态
                        [...document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('.el-collapse').children].forEach((attrItem, attrIdx) => {
                            let attrTitle = attrItem.querySelector('.tit').title
                            if(Object.hasOwn(obj, attrTitle) && !Object.hasOwn(linkColor, attrTitle)) {
                                [...attrItem.querySelectorAll('label')].forEach((label, labelIndex) => {
                                    let linkBtn = [...obj[attrTitle].children][labelIndex]
                                    if(label.className.includes('is-checked')) {
                                        linkBtn.style.color = linkBtn.checkedColor ? linkBtn.checkedColor : 'pink'
                                        linkBtn.style.fontWeight = '800'

                                    } else {
                                        linkBtn.style.color = '#fff'
                                        linkBtn.style.fontWeight = '400'

                                    }

                                })
                            } else if(Object.hasOwn(linkColor, attrTitle)) {
                                let answer = attrItem.querySelector('.answer')?.textContent.trim()
                                obj[attrTitle].style.color = answer ? linkColor[attrTitle][answer] : '#fff'
                            }
                            //第二项对象类型属性较为特殊，每种对象的类型属性标题不同，这里单独做判断
                            if(attrIdx === 1) {
                                [...attrItem.querySelectorAll('label')].some((curLabel, curIdx) => {
                                    if(curLabel.className.includes('is-checked')) {
                                        obj['类型属性'].selectedIndex = curIdx;
                                        return true
                                    }
                                })
                            }
                        })
                    }
                }

            }).then(()=> {
                // 双击映射图重置缩放为100%
                [...document.querySelector('.mf-mapping-drawer-wrap__image__list').children].forEach(image => {
                    image.addEventListener('dblclick', (e)=> {
                        image.querySelector('.mf-mapping-drawer-wrap__image__item__bar__right__zoom').click()
                    })
                });
                document.documentElement.querySelector('style').innerHTML+= `@keyframes focusActiveImg{
        0% {
            border-bottom: 2px solid #04F9F1
        }
        50%{
        border-bottom: 2px solid #783EFA
        }
        100% {
            border-bottom: 2px solid #04F9F1
        }
    }
    @keyframes focusDisactiveImg{
        0% {
            border-bottom: 2px solid #04F9F1
        }
        50%{
        border-bottom: 2px solid #242527
        }
        100% {
            border-bottom: 2px solid #04F9F1
        }
    }`;

                //映射图指示器主页绑定监视器
                [...document.querySelector('.drawer-item.mf-tool-drawer.mf-mapping-drawer-wrap.mf-theme-dark').querySelector('.mf-mapping-drawer__anchor').children].forEach((indicator, index)=> {
                    // 创建一个新的MutationObserver实例
                    new MutationObserver((mutations) => {
                        //console.log(mutations)
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') { //判断该指示器的 class 属性是否发生改变
                                const currentClasses = Array.from(indicator.classList);

                                //映射图边框色渐变化
                                let drawerImgList = [...document.querySelector('.mf-mapping-drawer-wrap__image__list').children]
                                let mainImgList;
                                if(document.querySelector('.swiper-wrapper')) mainImgList = [...document.querySelector('.swiper-wrapper').children] //主窗口映射视图不一定开启，所以不一定能拿到.swiper-wrapper的盒子，需要做额外判断

                                if(currentClasses.includes('curr-img')) {//mf-forder 表示关联映射、curr-img 表示选中映射图
                                    drawerImgList.some((curImage) => {
                                        if(curImage.querySelector('.mf-mapping-drawer-wrap__image__item__image')) {
                                            curImage.querySelector('.mf-mapping-drawer-wrap__image__item__image').style.animation = null
                                        }
                                    });
                                    mainImgList?.some((curImage) => { curImage.querySelector('img').style.animation = null })
                                    setTimeout(()=> {
                                        if(drawerImgList[index].querySelector('.mf-mapping-drawer-wrap__image__item__image')) drawerImgList[index].querySelector('.mf-mapping-drawer-wrap__image__item__image').style.animation = `1s linear ${currentClasses.includes("mf-active") ? "focusActiveImg" :"focusDisactiveImg"} infinite`
                                    }, 200)
                                    mainImgList ? mainImgList[index].querySelector('img').style.animation = `1s linear ${currentClasses.includes("mf-active") ? "focusActiveImg" :"focusDisactiveImg"} infinite` : undefined
                                }
                            }
                        });
                    }).observe(indicator, { attributes: true, subtree: true })
                });
                //为帧列表的每一帧绑定监视器
                [...document.querySelector('.frame-list').children].forEach((item, index)=> {
                    // 需要监听的CSS类名
                    const targetClass = 'mf-active';

                    // 创建一个新的MutationObserver实例
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.target === item && mutation.attributeName === 'class') {
                                const currentClasses = Array.from(item.classList);

                                if (currentClasses.includes(targetClass)) {
                                    // 切帧
                                    update2DMapAttr()
                                    //if(isOpenCheck) checkAttrChoose() //检查映射属性的勾选情况

                                }
                            }
                        });
                    });

                    // 配置观察选项
                    const config = { attributes: true, subtree: true };

                    // 开始观察目标元素
                    observer.observe(item, config);
                })

                //操控点颜色更新对照表
                let colorMap = {
                    '华为': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[1]?.style.background || '#EE63D8',
                    '速腾': document.querySelector('.mf-tool-bar__bottom__right__color__slider__background').children[3]?.style.background || '#5CD430',
                    '默认': '#783EFA'
                }
                //监视个体属性抽屉
                const observer = new MutationObserver((mutations) => {
                    let allPoint = [...document.querySelectorAll('.vdr-stick')]
                    mutations.forEach((mutation) => {
                        //判断是否选中了新的个体
                        if (mutation.type === 'childList' && mutation.addedNodes.length !== 0 && mutation.addedNodes[0].className == 'el-collapse') { //当新增的dom节点的类是el-collapse，说明有新的个体属性内容进来，标志着个体的更换
                            //开启关联映射
                            let imageMappingLink = document.querySelector('.el-tooltip.pcd-image-mapping__state.tooltip');
                            !imageMappingLink.className.includes('mf-active') && imageMappingLink.click()


                            //update2DMapAttr(); //切换个体时，更新映射属性面板数据

                            //检查雷达的勾选从而更新调整框操控点的提示颜色
                            let attributesWrap = mutation.addedNodes[0];
                            [...attributesWrap.children].forEach((attrItem) => { //mutation为插入的个体属性勾选列wrap
                                if(attrItem.children[0].querySelector('span.tit').innerText === '雷达属性') {
                                    updatePointColor()

                                    new MutationObserver((mutations) => {
                                        mutations.forEach((mutation) => {

                                            if(mutation.type === 'attributes' && mutation.attributeName === "aria-checked" && mutation.target.className.includes('is-checked')) {
                                                updatePointColor()

                                                //如果选中了速腾，则将点云截断选择为无截断
                                                let selectedRadarDom = attrItem.children[1].querySelectorAll('.is-selected');
                                                if(selectedRadarDom.length && selectedRadarDom[0].querySelector('.sub-tit').innerText === '速腾') {
                                                    let attrMap = {
                                                        '点云截断属性': '无截断',
                                                        '点云遮挡属性': '无遮挡',
                                                    };
                                                    //遍历个体属性勾选列wrap
                                                    [...attributesWrap.children].forEach((attrItem) => {
                                                        let attrName = attrItem.children[0].querySelector('span.tit').innerText
                                                        if(attrMap.hasOwnProperty(attrName)) {
                                                            let selectedDom = attrItem.children[1].querySelectorAll('.is-selected')[0];
                                                            if(!selectedDom || selectedDom.querySelector('.sub-tit').innerText !== attrMap[attrName]) {
                                                                [...attrItem.querySelectorAll('.radio-item')].forEach((radioItem) => {
                                                                    if(radioItem.querySelector('.sub-tit').innerText === attrMap[attrName]) {
                                                                        setTimeout(() => {
                                                                            radioItem.querySelector('label').click() //选择无截断 或 无遮挡
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                        });
                                    }).observe(mutation.addedNodes[0].children[0], { childList: true, subtree: true, attributes: true });

                                    /**
                                    根据雷达的选择，更新操控点和朝向图标的背景颜色
                                    **/
                                    function updatePointColor() {
                                        let selectedRadarDom = attrItem.children[1].querySelectorAll('.is-selected');
                                        allPoint.forEach((item) => {
                                            item.style.backgroundColor = colorMap[selectedRadarDom.length ? selectedRadarDom[0].querySelector('.sub-tit').innerText : '默认']
                                        })
                                    }
                                }
                            })


                            //控制主窗口映射属性勾选面板的显示
                            setTimeout(()=> {
                                let attrSelePanel_mainView = document.querySelector('.attrSelePanel-mainView')
                                if(attrSelePanel_mainView) {
                                    //遍历图像映射的指示器，获取当前选中的映射图的序号
                                    [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach(operator => {
                                        //检查当前映射图是否同时处于选择状态和关联状态
                                        if(operator.className.includes('curr-img') && operator.className.includes('mf-active')) attrSelePanel_mainView.style.display = 'flex'
                                    })
                                }

                            }, 400)

                            // console.log('更换了对象,即将进行检查')
                            if(isOpenCheck) checkAttrChoose()
                        }
                    });
                });
                // 开始观察目标元素
                observer.observe(document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0], { childList: true, subtree: true });

                //粘贴时打开位移
                new MutationObserver((mutationsList, observer)=>{
                    setTimeout(()=> {
                        let translateBtn = document.querySelector('.mf-action-icon-translate')
                        if(!translateBtn.parentElement.className.includes('mf-active')) document.querySelector('.mf-action-icon-translate').click();
                    }, 300) //避免抢先 V 键触发
                }).observe(document.querySelector('#driver-object-drawer').querySelector('[role="group"]'), { attributes: true, childList: true, characterData: true })

                //检查2D映射图的勾选情况
                function checkAttrChoose() {
                    //定位当前选中的个体
                    let objectAll = [...document.querySelector('.mf-new-object-list__wrapper').querySelectorAll('[id^="renderKey"]')]
                    //获取当前聚焦的个体
                    checkObject = objectAll.filter((item) => item.className.includes('mf-object-list__item__select'))[0];
                    //个体名
                    let checkObjName = checkObject?.innerText;
                    let checkObjId = checkObject?.dataset.id;
                    let objInfo = document.querySelector('.mf-info-window__pcd').innerText
                    let x = /X:(.*)，Y/.exec(objInfo)[1]-0
                    let length = /长:([0-9.]*)m+?/.exec(objInfo)[1]-0


                    if(!checkObjName) return console.log('未选择个体，不做检查') //未选择个体时，不做检查


                    let errorInfo = ''
                    new Promise((res, rej) => {
                        if(checkObjName.includes('群组')) {
                            checkObject.children[1].click()
                            // console.log('点开群组', checkObjName)
                            radarArr = []
                            attrArr = []
                            size3DArr = []
                            return res()
                        } else if(checkObject.querySelector('.mf-object-list__item__eye').style.marginRight == '20px') { //判断该个体是否属于群组（群组的眼睛按钮要更远）
                            [...document.querySelector('#driver-object-Tag-drawer').querySelectorAll('.el-collapse-item.has-children')[0].querySelectorAll('label')].some((item, index) => {
                                if(item.className.includes('is-checked')) {
                                    radarArr.push(index)
                                    return true
                                }
                            })
                            size3DArr.push(document.querySelectorAll('.mf-info-window__item')[1].textContent)

                        } else { //既不是群组也不是群组内的个体，说明是单独的个体，此时清空雷达比对记录
                            radarArr = []
                            size3DArr = []
                        }
                        //检查雷达属性是否重复
                        let set = new Set(radarArr) //筛选记录雷达选择的数组
                        if(radarArr.length >= 2 && set.size == 1 ) {
                            errorInfo += `${checkObject.innerText}\n雷达属性重复\n\n`
                        }
                        let sizeSet = new Set(size3DArr) //筛选记录雷达选择的数组

                        if(size3DArr.length >= 2 && sizeSet.size !== 1 ) {
                            errorInfo += `${checkObject.innerText}\n3D框大小不一致\n\n`
                        }
                        let redarIdx
                        [...document.querySelector('#driver-object-Tag-drawer').querySelectorAll('.el-collapse-item.has-children')[0].querySelectorAll('label')].some((item, index) => {
                            if(item.className.includes('is-checked')) {
                                redarIdx = index
                                return true
                            }
                        })
                        console.log('x+length/2', x + length/2)
                        console.log('redarIdx', redarIdx)
                        if((x + length/2 >= 2.74 && redarIdx !== 0) || (x + length/2 < 2.74 && redarIdx !== 1)) {
                            errorInfo += `${checkObject.innerText}\n请确认所选雷达属性\n\n`
                        }
                        res()
                    }).then(()=> {
                        if(errorInfo && !checkObjName.includes('群组')) {
                            alert(errorInfo)
                            radarArr = []
                            return
                        }
                        setTimeout(() => {
                            let objectAll = [...document.querySelector('.mf-new-object-list__wrapper').querySelectorAll('[id^="renderKey"]')]
                            objectAll.some((item, index) => {
                                //objectAll = [...document.querySelector('.mf-new-object-list__wrapper').querySelectorAll('[id^="renderKey"]')]
                                if(checkObjId === item.dataset.id) { //根据 data-id 属性定位到当前个体所在的位置
                                    //debugger
                                    if(index !== objectAll.length -1 ) { //如果当前的个体不是最后一个，则转移到下一个个体
                                            objectAll[index + 1].click()
                                    } else {
                                        //尝试将该对象滚动到列表顶部
                                        item.scrollIntoView({
                                            behavior: "instant",
                                            block: "start",
                                            inline: "end"
                                        })
                                        setTimeout(() => {
                                            let newObjectAll = [...document.querySelector('.mf-new-object-list__wrapper').querySelectorAll('[id^="renderKey"]')];
                                            if(newObjectAll[index] !== item) { //如果个体位于列表的下标变了，说明有新的对象进来，接着检查
                                                newObjectAll.some((item, index) => {
                                                    if(checkObjId === item.dataset.id) {
                                                        newObjectAll[index + 1].click()
                                                    } else if(index == objectAll.length -1) {
                                                        showMessage('本轮检查已结束')
                                                    }
                                                })
                                            }

                                        },500)
                                    }
                                    return true
                                }
                            })
                        })
                    })
                }
            })
        }
    })

    /**
    * 用于生成映射属性勾选面板
    * @param {number} imageIndex 用于提供在勾选属性后，做检查所需的映射图序号
    */
    function createAttrPanel(imageIndex) {
        let newDom = document.createElement('div')
        let jdWrapDom = document.createElement('div')
        let jdDom_0 = document.createElement('span')
        let jdDom_50_less= document.createElement('span')
        let jdDom_50_greater= document.createElement('span')
        let zdWrapDom = document.createElement('div')
        let zdDom_0 = document.createElement('span')
        let zdDom_50_less = document.createElement('span')
        let zdDom_50_greater = document.createElement('span')
        let zdDom_100 = document.createElement('span')
        jdDom_0.innerText = '0'
        jdDom_50_less.innerText = '≤50'
        jdDom_50_greater.innerText = '>50'
        zdDom_0.innerText = '0'
        zdDom_50_less.innerText = '≤50'
        zdDom_50_greater.innerText = '>50'
        zdDom_100.innerText = '100'
        newDom.style.position = 'absolute';
        newDom.style.justifyContent = 'space-between';
        newDom.style.flexDirection = 'column';
        newDom.style.bottom = '0';
        newDom.style.padding = '0 8px';
        newDom.style.fontSize = '13px';
        newDom.style.background = 'rgba(255, 255, 255, .3)';
        newDom.style.display = 'none';
        [jdDom_0, jdDom_50_less, jdDom_50_greater, zdDom_0, zdDom_50_less, zdDom_50_greater, zdDom_100].forEach((dom)=> {
            dom.style.marginRight = '10px'
            dom.style.cursor = 'pointer'
            dom.style.color = '#000'
        });

        //绑定点击事件并加入面板wrap
        [jdDom_0, jdDom_50_less, jdDom_50_greater].forEach((dom, jdDomIndex)=> {
            dom.addEventListener('click', ()=> {
                new Promise((res) => {
                    let curImgNum
                    if(!imageIndex) {
                        //遍历图像映射的指示器，获取当前选中的映射图的序号
                        [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach(operator => {
                            if(operator.className.includes('curr-img')) curImgNum = operator.innerText
                        })
                    }

                    let mappingWrap = [...document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0].children[0].children].at(-1).children[1].children[0].children[0].children[0].children[0].children[0];
                    let jdWrap = mappingWrap.children[(imageIndex || imageIndex == 0) ? imageIndex : curImgNum-1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
                    //imageIndex为0时表示第一张映射图，故要使其有效
                    jdWrap.children[jdDomIndex].children[0].click() //点击目标截断属性
                    res(jdWrap)

                }).then((jdWrap) => {
                    update2DMapAttr()
                    /**
                    //检查是否选中成功
                    if(/is-checked/.test(jdWrap.children[jdDomIndex].children[0].className)) { //更新视图
                        [jdDom_0, jdDom_50_less, jdDom_50_greater].forEach((curDom, jdDomIndex)=> {
                            if(curDom == dom) {
                                dom.style.color = 'pink';
                                dom.style.fontWeight = '800';
                                console.log(dom.style.color, dom)
                            } else {
                                curDom.style.color = '#000';
                                curDom.style.fontWeight = '400';
                            }
                        })
                    } else {
                        console.log('else')
                        dom.style.color = '#000';
                        dom.style.fontWeight = '400';
                    }
                    **/
                })

            })
            jdWrapDom.appendChild(dom)
        });

        [zdDom_0, zdDom_50_less, zdDom_50_greater, zdDom_100].forEach((dom, zdDomIndex)=> {
            dom.addEventListener('click', ()=> {
                new Promise((res) => {
                    let curImgNum
                    if(!imageIndex) {
                        //遍历图像映射的指示器，获取当前选中的映射图的序号
                        [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach(operator => {
                            if(operator.className.includes('curr-img')) curImgNum = operator.innerText
                        })
                    }

                    let mappingWrap = [...document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0].children[0].children].at(-1).children[1].children[0].children[0].children[0].children[0].children[0];
                    let zdWrap = mappingWrap.children[(imageIndex || imageIndex == 0) ? imageIndex : curImgNum-1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
                    zdWrap.children[zdDomIndex].children[0].click() //点击目标截断属性

                    res(zdWrap)
                }).then(zdWrap => {
                    update2DMapAttr()
                    //检查是否选中成功
                    /**
                    if(/is-checked/.test(zdWrap.children[zdDomIndex].children[0].className)) { //更新视图
                        [zdDom_0, zdDom_50_less, zdDom_50_greater, zdDom_100].forEach((curDom, zdDomIndex)=> {
                            if(curDom == dom) {
                                dom.style.color = 'pink';
                                dom.style.fontWeight = '800';
                            } else {
                                curDom.style.color = '#000';
                                curDom.style.fontWeight = '400';
                            }
                        })
                    } else {
                        dom.style.color = '#000';
                        dom.style.fontWeight = '400';
                    }**/
                })


            })
            zdWrapDom.appendChild(dom)
        });

        newDom.appendChild(jdWrapDom)
        newDom.appendChild(zdWrapDom)
        return newDom
    }

    //为映射属性勾选面板同步勾选数据
    function update2DMapAttr() {
        let attrSelePanel_mainView = document.querySelector('.attrSelePanel-mainView');
        let toushiImageWrap = document.querySelector('.mf-mapping-drawer-wrap__image__list');

        //if(!attrSelePanel_mainView) return

        //当选中对象列表的群组时，个体属性为空，不往下走
        let attrSelectTabList = document.querySelector('#driver-object-Tag-drawer').querySelector('#float-tool-content').querySelector('[role="tablist"]')?.children
        if(!attrSelectTabList?.length) return

        //定位到个体属性抽屉的2D映射图属性勾选区域
        let mappingWrap = [...document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0].children[0].children].at(-1).children[1].children[0].children[0].children[0].children[0].children[0];
        //遍历映射图指示器
        [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach((item, index)=> {
            if(!item.className.includes('mf-active') || item.nodeName == 'SPAN') return //跳过非关联的指示器 和 展示分辨率的元素

            let imageNum = item.innerText;
            //同步该序号的图片的属性勾选
            //扫描属性勾选信息
            if(document.querySelector('.drawer-item.mf-tool-drawer.tag-drawer-wrap.mf-drawer-tag.object-drawer-wrap.object-tag-drawer.mf-theme-dark').children[2].children[0].children[0].children[0].children.length == 0) return
            //拿到当前映射图对应的截断属性的 wrap
            let jdWrap = mappingWrap.children[imageNum - 1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
            [...jdWrap.children].some((jdDom, index) => {
                if(/is-checked/.test(jdDom.children[0].className)) {
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[0].children[index].style.color = 'pink';
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[0].children[index].style.fontWeight = '800';

                } else {
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[0].children[index].style.color = '#000';
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[0].children[index].style.fontWeight = '400';
                }
            });

            //拿到当前映射图对应的遮挡属性的 wrap
            let zdWrap = mappingWrap.children[imageNum - 1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
            [...zdWrap.children].some((zdDom, index) => {
                if(/is-checked/.test(zdDom.children[0].className)) {
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[1].children[index].style.color = 'pink';
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[1].children[index].style.fontWeight = '800';
                }else {
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[1].children[index].style.color = '#000';
                    [...toushiImageWrap.children[imageNum - 1].children].at(-1).children[1].children[index].style.fontWeight = '400';
                }
            })

        })

        //更新主窗口映射属性勾选面板数据
        /**setTimeout(()=> {
            let curImgNum = -1
            if(!attrSelePanel_mainView) return
            //遍历图像映射的指示器，获取当前选中的映射图的序号
            [...document.querySelector('.mf-mapping-drawer__anchor').children].forEach(operator => {
                //检查当前映射图是否同时处于选择状态和关联状态
                if(operator.className.includes('curr-img') && operator.className.includes('mf-active')) curImgNum = operator.innerText
            });
            if(curImgNum == -1) return //当前不存在关联映射图时返回
            let jdWrap = mappingWrap.children[curImgNum - 1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
            [...jdWrap.children].some((jdDom, index) => {
                if(/is-checked/.test(jdDom.children[0].className)) {
                    attrSelePanel_mainView.children[0].children[index].style.color = 'pink'
                    attrSelePanel_mainView.children[0].children[index].style.fontWeight = '800'
                } else {
                    attrSelePanel_mainView.children[0].children[index].style.color = '#000'
                    attrSelePanel_mainView.children[0].children[index].style.fontWeight = '400'
                }
            });
            let zdWrap = mappingWrap.children[curImgNum - 1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[1].children[0].children[0].children[0].children[0];
            [...zdWrap.children].some((zdDom, index) => {
                if(/is-checked/.test(zdDom.children[0].className)) {
                    attrSelePanel_mainView.children[1].children[index].style.color = 'pink'
                    attrSelePanel_mainView.children[1].children[index].style.fontWeight = '800'
                } else {
                    attrSelePanel_mainView.children[1].children[index].style.color = '#000'
                    attrSelePanel_mainView.children[1].children[index].style.fontWeight = '400'
                }
            })
        }, 300)**/


    }

    function showMessage(message, config) { //type = 'default', showTime = 3000, direction
        let MessageWrap = document.createElement('div')
        MessageWrap.className = 'messageWrap'
        setStyleSheet(MessageWrap, {
            position: 'absolute',
            zIndex: '9999'
        })

        let MessageBox = document.createElement('div')
        MessageBox.innerText = message

        let closeBtn = document.createElement('div')
        closeBtn.textContent = '×'
        closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

        setStyleSheet(MessageBox, {
            position: 'relative',
            minWidth: '200px',
            marginTop: '5px',
            padding: '6px 50px',
            lineHeight: '25px',
            backgroundColor: 'pink',
            textAlign: 'center',
            fontSize: '16px',
            //animation: 'frame 1s ease-in-out forwards',
            borderRadius: '5px',
            transition: 'all 1s'
        })

        setStyleSheet(closeBtn, {
            position: 'absolute',
            top: '-3px',
            right: '3px',
            width: '15px',
            height: '15px',
            zIndex: '999',
            fontWeight: '800',
            fontSize: '15px',
            borderRadius: '5px',
            cursor: 'pointer',
            userSelect: 'none'
        })
        //控制方向
        switch(config?.direction) {
            case 'top': setStyleSheet(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
            case 'top left': setStyleSheet(MessageWrap, {top: '1%', left: '.5%'}); break;
            case 'left': setStyleSheet(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
            case 'top right': setStyleSheet(MessageWrap, {top: '1%', right: '.5%', }); break;
            case 'right': setStyleSheet(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
            case 'bottom': setStyleSheet(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
            case 'bottom left': setStyleSheet(MessageWrap, {bottom: '1%'}); break;
            case 'bottom right': setStyleSheet(MessageWrap, {bottom: '1%', right: '.5%'}); break;
            default: setStyleSheet(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        }

        switch(config?.type) {
            case 'success': setStyleSheet(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
            case 'warning': setStyleSheet(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
            case 'error': setStyleSheet(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
            default: setStyleSheet(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
        }

        MessageBox.appendChild(closeBtn)
        let oldMessageWrap = document.querySelector('.messageWrap')
        if(oldMessageWrap) {
            oldMessageWrap.appendChild(MessageBox)
        } else {
            MessageWrap.appendChild(MessageBox)
            document.body.appendChild(MessageWrap)
        }

        //控制消失
        let timer = setTimeout(() => {
            document.querySelector('.messageWrap').removeChild(MessageBox)
        }, (config?.showTime || 3000))

        //鼠标悬停时不清除，离开时重新计时
        MessageBox.addEventListener('mouseenter', () => clearTimeout(timer))
        MessageBox.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                document.querySelector('.messageWrap').removeChild(MessageBox)
            }, (config?.showTime || 3000))
        })
    }


    /**
     * 修改元素的css样式
     * @param {ElementObj} element
     * @param {obj} styleSheetObj
     */
    function setStyleSheet(element, styleSheetObj) {
        for( let key in styleSheetObj ) {
            if(element.style[key] !== undefined) {
                element.style[key] = styleSheetObj[key]
            } else {
                //将key转为标准css属性名
                let formatKey = [...key].reduce((counter, curVal) => counter + (curVal !== curVal.toUpperCase() ? curVal : `-${curVal.toLowerCase()}`), '')
                console.warn(`不存在${formatKey}这个CSS属性`)
            }
        }
    }
})();

/**
日志：

2023/8/9：
- 完善一键初始化功能

2023/8/10：
- 三视图切换 兼容带2D映射图的三视图布局

2023/8/11：
- 实现自动一键初始化（集成开启映射属性一览面板）
- 修复了切帧后物体关联映射勾选面板数据不同步问题

2023/8/12
- 修复切换到无映射图的三视图布局时，映射属性同步失效
- 一键初始化新增开启关联映射

2023-8-14
- 完成 ;键 的映射属性勾选检查功能
- 一件初始化新增全屏功能
- 优化映射属性勾选面板的数据同步速度（移除定时器，不再判断关联映射图，而进行全图修改）

2023/08/15：
- 优化了映射属性勾选检查（同帧下，自动遍历个体列表）

2023/08/17
- 快捷勾选面板适配多传感项目界面

2023/8/18
- 修复三视图切换功能
- 个体属性改为 U 键控制
- 新增 B 键开启位移模式

2023/8/20
- 新增个体属性勾选面板（可勾选属性：关键障碍物、点云遮挡、点云截断、左\右\刹车转灯状态）
- 新增 数字小键盘切换映射图不同视角 功能

2023/8/22
- 修改： X 键只排除错误勾选，且仅勾选未勾选的label

2023/8/23
- 修复单帧个体属性勾选检查功能，且新增检查雷达重复选择

2023/8/31
- 新增：对象列表更新时，自动开启位移（方便在粘贴立体框时顺便开启位移）
- 新增：O键开启或关闭微调状态下边框线淡色

2023/9/1
- 新增：一件初始化设置工具预设方案（中型车和大型车的开门属性为无延申，点云截断属性为无截断）
- 新增：当选中点云图时，L键默认放大顶视图
- 修复：开启检查后，切帧下不做自行检查
- 修复：单帧自动检查新增对截断/遮挡方框勾选，而遮挡圆框没勾选的情况的检查

2023/9/7
- 修复：O键触发缺少个体方向淡色
- 优化：映射属性勾选面板同步取消选中的效果

2023/9/11
- 新增：C键检查提示ID关联

2023/9/12
- 修复：第一张映射图的映射属性勾选面板，关联到第二张映射图

2023/9/13
- 新增：一件初始化新增主窗口映射图的映射属性勾选面板
- 完善主窗口映射属性勾选面板的同步功能

2023/9/14
- 修复：图像映射抽屉倒序点击映射图进行切换时，主窗口映射属性勾选面板显隐不正常问题。
·重新设计显隐的逻辑，让被选中指示器控制显隐权，指示器的关联状态控制是否显隐
- 修复：选中群组时，个体属性勾选面板消失
·识别comment标记的位置，只有当位于勾选面板同级时才隐藏

2023/10/18(开始适配5.0规范)
- 新增：第二次O键取消淡色微调功能

2023/10/19
- 新增：三视图调整框的操控点颜色关联提示雷达勾选

2023/10/22
- 新增：选择速腾雷达后，自动勾选无截断

2023/10/23
- 新增：选中新个体时，开启关联映射
- 新增：选择速腾雷达后，自动勾选无遮挡
- 取消：图像映射抽屉和主窗口的映射属性勾选面板
- 新增：一键初始化新增工具抽屉新增方案
 * 中型车默认【小汽车、开门属性默认【无延伸】
 * 骑行默认【骑电动自行车的人】
 * 人默认【行人】
 * 大型车 开门属性默认【无延伸】
 * 非机动车默认【电动自行车】
 * 交通障碍物默认【交通桩】
 * 其他默认【忽略】

2023/10/24
- 调整：B键不能配合 ctrl 触发
- 新增：ctrl+B 编组/取消编组
- 新增：一件初始化新增==>当失焦个体框时，关闭关联映射
- 新增：主窗口个体属性勾选面板新增【映射截断、映射遮挡】

2023/10/25
- 解决：切换个体时，不能正确判断是否应该关闭或开启关联映射
- 调整：快捷键 I 开启/关闭图像映射抽屉
- 调整：快捷键 ` 开启/关闭聚焦模式
- 新增：快捷键 J 开启/关闭显示运动轨迹
- 新增：双击映射图重置缩放为100%（加入一键初始化）
- 新增：主窗口个体属性勾选面板新增雷达选项
- 优化：切换个体时，不必要的重复开启和关闭关联映射导致的映射图wrap跳闪现象

2023/10/26
- 调整：主窗口个体属性勾选面板雷达属性与关键属性的列间隔距离
- 新增：快捷键 Shift + Z 切换着色渲染方案（强度/高度）
- 修复：检查功能适配5.0规范（取消映射图属性的检查）
- 新增：映射图边框色渐变化
- 微调：获取着色预设的点云颜色，一键初始花时动态设置操控点颜色
- 微调：O键淡色加入旋转点淡色

2023/10/27
- 修复：在单帧任务包里，调整车头朝向快捷键失效
- 修复：关闭主窗口映射视图时，映射图像抽屉的映射图底边框动画提示效果失效。

2023/10/29
- 优化：单帧检查无法一轮遍历完对象列表
- 优化：消息提示UI
- 优化：数字键盘切换映射图时，尝试将目标映射图居中

2023/10/31
- 调整：~键聚集改为触发对象列表顶部的聚焦按钮

2023/11/1
- 调整：放行审核模式
- 调整：在开启聚焦模式下，~键聚焦仍生效
- 新增：主窗口个体属性勾选面板新增【类型属性】项

2023/11/2
- 优化：个体属性勾选面板首次勾选属性值的卡顿
- 调整：根据着色方案设置个体属性勾选面板的雷达属性勾选颜色
- 调整：简化个体属性勾选面板的雷达和关键属性勾选操作

2023/11/5
- 新增：设置面板（设置全屏、聚焦、图像映射抽屉的开启/关闭和主窗口视图布局）

2023/11/6
- 调整：一键初始化取消关闭对象列表
- 调整：取消快捷键 X
- 新增：设置面板设置淡色微调
- 新增：检查模式新增检查3D框大小不一致

2023/11/20
- 修复：检查模式检查3D框大小不一致判断出错

2023/12/25
- 修复：3D框淡色调整功能，调整完成后依旧是淡色的问题

2023/12/26
- 新增：检查功能新增对雷达属性选择的检查
*/