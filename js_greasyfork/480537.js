// ==UserScript==
// @name         千挂项目-标注工具(Beta)
// @namespace    http://tampermonkey.net/
// @version      23.12.6.1
// @description  测试版
// @author       You
// @match        https://label.gxhunter.cn/label/annotator/3d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxhunter.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480537/%E5%8D%83%E6%8C%82%E9%A1%B9%E7%9B%AE-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480537/%E5%8D%83%E6%8C%82%E9%A1%B9%E7%9B%AE-%E6%A0%87%E6%B3%A8%E5%B7%A5%E5%85%B7%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
/**
* 使用：
* 【0-9】选择二级个体类型
* 【shift + D】调整朝向
* 【Shift+Y】 删除当前帧的所有对象
* 【`】收起个体类型面板
* 【J】聚焦选中个体
**/

    let dataSet = {
        angleBtn: null,
        isDelete: false,
    }

    let globalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let addedNodes = mutation.addedNodes
            console.log(mutation)

            if(addedNodes.length && addedNodes[0].textContent.includes('修改类别') && addedNodes[0]?.className.includes('ant-modal-root')) {
                dataSet.angleBtn = mutation.addedNodes[0].querySelector('.anticon.iconfont')
                globalObserver.disconnect();
            }
        })
    })
    globalObserver.observe(document.body, {childList: true, subtree: true})

    document.addEventListener('keydown', (e)=> {
        console.log(e.keyCode, e)
        //【0-9】数字键选择二级个体类型
        if(e.keyCode >= 49 && e.keyCode <=57) {
            [...document.querySelectorAll('.ant-popover.threeD-type-popover.ant-popover-placement-rightTop')].some((curPopover) => {
                if(!curPopover.className.includes('ant-popover-hidden')) {
                    document.querySelector('.threeD-label-container').dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true }));
                    curPopover.querySelectorAll('.tool-item')[e.keyCode - 49].click()
                    //收起面板
                    setTimeout(() => {
                        [...document.querySelector('.tool-group').querySelectorAll('.tool-item')].some((curTool) => {
                            console.log(curTool)
                            if(curTool.className.includes('ant-popover-open')) {
                                curTool.click()
                                return 1
                            }
                        })
                    })
                    return true
                }
            })
        }
        //【J】聚焦当前选中的对象
        if(e.keyCode == 74) {
            let objList = [...document.querySelector('.label-object-list').querySelector('.content.scroll').children]
            objList.some((item) => {
                if(item.className.includes('active-object')) return(item.click(), true)
            })
        }

        //【Shift+D】 调整朝向
        if(e.keyCode == 68 && e.shiftKey) {
            if(!dataSet.angleBtn && document.querySelector('.selected-box-info')) {
                document.querySelector('.threeD-label-container').dispatchEvent(new Event('dblclick', {
                    bubbles: true,
                    cancelable: true
                }));
                setTimeout(() => {
                    dataSet.angleBtn.click()
                })
                return
            }
            dataSet.angleBtn.click()
        }

        //【Shift+Y】 删除当前帧的所有对象
        if(e.keyCode == 89 && e.shiftKey) {
            if(!confirm('确定删除？') || dataSet.isDelete) return
            dataSet.isDelete = true
            let timer = setInterval(() => {
                if(!document.querySelector('.tool-right').querySelectorAll('.object').length) {
                    clearInterval(timer);
                    dataSet.isDelete = false
                    return
                }
                document.querySelector('.tool-right').querySelectorAll('.object')[0].click()
                document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Delete' }));
            })
        }

        //【`】收起类型面板
        if(e.keyCode == 192) {
            [...document.querySelector('.tool-group').querySelectorAll('.tool-item')].some((curTool) => {
                console.log(curTool)
                if(curTool.className.includes('ant-popover-open')) {
                    curTool.click()
                    return 1
                }
            })
        }

        if(e.keyCode == 66) {
            document.querySelectorAll('.tool-group')[1].querySelectorAll('.tool-item')[1].click()
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
})();

/**
更新日志

2023/11/30:
- 新增：快捷键【0-9】选择二级个体类型
- 新增：快捷键【shift + D】调整朝向
- 新增：快捷键【Shift+Y】 删除当前帧的所有对象
- 新增：快捷键【`】收起个体类型面板

2023/12/6
- 新增：快捷键【J】聚焦选中个体
**/