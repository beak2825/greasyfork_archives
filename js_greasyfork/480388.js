// ==UserScript==
// @name         车道标注项目-辅助工具
// @namespace    http://tampermonkey.net/
// @version      23.11.22.01(Beta)
// @description  Try it
// @author       You
// @match        https://annotation.bettersmart.net/marking-panel/panel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bettersmart.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480388/%E8%BD%A6%E9%81%93%E6%A0%87%E6%B3%A8%E9%A1%B9%E7%9B%AE-%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/480388/%E8%BD%A6%E9%81%93%E6%A0%87%E6%B3%A8%E9%A1%B9%E7%9B%AE-%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';


/**==================================

快捷键：
Q          ==>  选中普通车道标注
W          ==>  选中公交车道标注
E          ==>  选中非机动车道标注
B          ==>  选中可拖拽
Y          ==>  删除当前帧全部标注结果
Ctrl+Y     ==>  删除当前帧的最后一个标注项
Ctrl+S     ==>  保存当前帧数据
P          ==>  快捷键失效/生效

==================================**/

    let drawPointImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAAXNSR0IArs4c6QAAAF1QTFRFAAAA////////////////////////////////////////////////////////////////////////////AFj+C1/+DGD+DWH+QYP+fKn+fqv+ss3/s83/tM7/////8xfV/gAAABR0Uk5TABQVFlNUgoOGw8TO0NHS0/Dx8v45tTjGAAAAkklEQVQ4y+2T2w6CMBBEt1KRKqLlUhaL8/+fSQKSNGC2fdSE87g5SbuTWaIvGENpAIf4z6IqKqDMVczTT8xYHfEajOwcj2hE82TxamcG2EwQc7zbDx6FIJbgVWRU2z4jpF/FPhgaSXTB8Co/fReX8WnLZBZDUjxL4F3HPhI40ble/l/reCkewO2ijpv5QdHs+0cT7GsXY68JiuEAAAAASUVORK5CYII='
    let dragImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAAXNSR0IArs4c6QAAAYlQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VkzjgAAAAIJ0Uk5TAAECAwQFBwkKDQ4PEBETFBUXGBobHB0eHyAhIiQmKCksMDEyNTg7PUFER0tNUFFSU1dYX2FkZmdoa25wc3V5fH+Cg4WIiYuMjo+RlJeanqCjpqeqrK2xtLe5u73AwsXGx8jJyszO0tbZ293e3+Dh4+Xm5+rs7u/x9PX3+Pn6+/z9/mziSBkAAAF0SURBVDjLjdLpW0FBFAbwoRKJ9qTSIq3atS8qUbRqU1HaFyntK8L7l3dx5V6ua+bTzPv8nmfOzDmEkD2LnlCtBcBnNUjyw1bEV8DRKc0nfTA7Aox9WesuFIU2rBCJwXbH2LcNoyw3NOAxUaHecsPYD2dfcQ4oCaCd3TbPXTH2a2dIISjtWEofGmbPYsCPy6TKhh3w886a6eMoED4cK8uA0me0ZUSVE+5fIOKZrOLFq1jMvkc9sh8Eot4mTtaFW8HiS52AlRsUvKJFCPaH+I6QdcxTOdKDaypHit6ho3GEbMJM5UgvLvmBMQS70Ptkn6jnBdp7eEuE5BZm+IH2QVgO4oRQSfl3rJpO7mIq9TCdqBzGUepfnkSlIhitYP8P4tKF8aRb9ohLE9xsP+TiUhUOqweSfcsjD7Cd6i9HKs/hr+XDUaTn+V8qT+GvyyiyPMKZF1YKOUI83LlKyLjTZDenkd9URl4Iuqz2e0Dl4pLOMbLmf/sHbW13/+CqzOwAAAAASUVORK5CYII='
    let isPause = false //使快捷键暂时失效

    new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if(mutation.addedNodes && mutation.addedNodes[0]?.className && mutation.addedNodes[0].querySelector('.listScroll')) {
                //监视标注结果列表
                new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if(mutation.addedNodes && mutation.addedNodes[0]?.textContent?.includes('公交')) {
                            document.querySelector('.panelMain').querySelector('.wrapper.item').children[1].querySelector('.uploadBox').children[5].children[0].click()

                            setTimeout(() => {
                                [...document.querySelector('.optBox.opt').querySelectorAll('img')].find((curImg) => {
                                    if(curImg.src == drawPointImgSrc) return curImg
                                }).click()
                            }, 150)
                        }
                    })
                }).observe(document.querySelector('.listScroll'), {childList: true, subtree: true})
            }
        })
    }).observe(document.body, {childList: true, subtree: true})


    document.body.addEventListener('keydown', (e) => {
        console.log(e.keyCode, e)

        //【Q、W、E】分别选中【普通车道、公交车道、非机动车道】
        let selectLaneArr = [81, 87, 69]
        if(!isPause && selectLaneArr.includes(e.keyCode)) {
            new Promise((res) => {
                document.querySelector('.panelMain').querySelector('.wrapper.item').children[1].querySelector('.uploadBox').children[selectLaneArr.indexOf(e.keyCode)].children[0].click()
                res()
            }).then((res)=> {
                let attrWrap = [...document.querySelector('.panelMain').querySelector('.wrapper.item').querySelector('.wrapper').children][1]; //拿到方向，时间限制等属性项的wrap
                if(e.keyCode !== 69) { //选中非机动车道时，不选行驶方向
                    [...attrWrap.children[0].querySelectorAll('input')].forEach((input, index) => {
                        if(input.checked) { //如果没选中直行，则点击直行，如果选中了非直行的input，则点击取消
                            setTimeout(input.click.bind(input))
                        }
                    })
                    setTimeout(() => attrWrap.children[0].querySelectorAll('input')[1].click())

                }
                setTimeout(()=> {
                    if(e.keyCode == 87) {
                        attrWrap.children[1].querySelector('input').value = ''
                        attrWrap.children[1].querySelector('input').dispatchEvent(new Event('input', { bubbles: true })); //避免重复点击W，需要触发一次input，从而借助空值来更新值，避免出现拒绝开启绘制点

                        setTimeout(() => {
                            attrWrap.children[1].querySelector('input').value = '无' //默认值
                            attrWrap.children[1].querySelector('input').dispatchEvent(new Event('input', { bubbles: true }));// 触发输入事件后，会检测输入框里的值，从而判断是否允许进行绘制点
                        })
                    }

                    setTimeout(() => {
                        [...document.querySelector('.optBox.opt').querySelectorAll('img')].find((curImg) => {
                            if(curImg.src == drawPointImgSrc) return curImg
                        }).click()
                    }, 150)
                })

            })
        }

        //Y键 一键删除当前帧标注结果
        //ctrl y 删除当前帧最后一个标注结果
        if(!isPause && e.keyCode == 89 && e.ctrlKey) {
            if(!document.querySelector('.listScroll').querySelectorAll('.list').length) return showMessage('没有要删除的项', {type: 'warning'});
            [...document.querySelector('.listScroll').querySelectorAll('.list')].at(-1).querySelector('.box').click()
            document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 8 })); //注意：点击后紧接着退格才能删，分开操作删不了
        } else if(!isPause && e.keyCode == 89) {
            let timer = setInterval(() => {
                if(!document.querySelector('.listScroll').querySelectorAll('.list').length) return clearInterval(timer);
                document.querySelector('.listScroll').querySelectorAll('.list')[0].querySelector('.box').click()
                document.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 8 })); //注意：点击后紧接着退格才能删，分开操作删不了
            })
        }

        //P键 快捷键暂时失效
        if(e.keyCode == 80) {
            isPause = !isPause
        }

        //B键 切换为可拖拽
        if(!isPause && e.keyCode == 66) {
            setTimeout(() => {
                [...document.querySelector('.optBox.opt').querySelectorAll('img')].find((curImg) => curImg.src == dragImgSrc).click()
            }, 150)
        }

        //ctrl+s 保存
        if(!isPause && e.keyCode == 83 && e.ctrlKey) {
            [...document.querySelector('.contain').querySelectorAll('button')].find(item => item?.textContent?.includes('保存')).click()
        }
    })

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

/**
日志：
2023/11/20
- 新增：快捷键【Q、W、E】分别选中【普通车道、公交车道、非机动车道】的标注（并附加默认信息）
- 新增：当标注了公交车道后，自动选中车道占位符的标注

2023/11/21
- 适配：正式服
- 修复：选中点击相同类型的车提示无法标注
- 新增：一键删除当前帧标注结果

2023/11/22
- 新增：【ctrl+y】删除当前帧下的最后一项标注
- 新增：【P键】快捷键失效/生效
- 新增：【B键】选中可拖拽
- 新增：【ctrl+s】保存当前帧数据
*/
})();