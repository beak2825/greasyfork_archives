// ==UserScript==
// @name         xieying3D
// @namespace    http://tampermonkey.net/
// @version      2025.4.13.1
// @description  try it
// @author       You
// @match        https://data-encoder.ruqimobility.com/tool/pc?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruqimobility.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521830/xieying3D.user.js
// @updateURL https://update.greasyfork.org/scripts/521830/xieying3D.meta.js
// ==/UserScript==
if($('#app')?.children.length) location.reload()

window.$ = Document.prototype.$ = Element.prototype.$ = $;
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;

const _window = window
const ls_isNewVersion = localStorage.getItem('isNewVersion')
window._ds = {
    logAn: true,
    logKeydown: false,
    isDebug: true,
    taskId: void 0,
    objSum: 0,
    pointSize: 0.17,
    callback: [],
    viewBtnMap: {},
    history_check: null,
    isRecordCheckHistory: localStorage.getItem('history-record') === 'true' ?? false,
    isNewVersion: ls_isNewVersion ? ls_isNewVersion === 'true' : true,
}

const _ds = new Proxy(window._ds, {
    get(target, prop) {
        return Reflect.get(target, prop)
    },
    set(target, prop, value) {
        if(prop in trigger) {
            trigger[prop](value)
        } else {
            Reflect.set(target, prop, value)
        }
        return true
    }

})

const trigger = {
    resultDir(newVal) {
        window._ds.resultDir = newVal
    },
    taskId(newVal) {
        window._ds.taskId = newVal

        const logTitle = $('.log-title')
        logTitle.style.cursor = 'pointer'
        logTitle.onclick = function() {
            copyToClipboard(newVal).then(res => showMessage('复制：任务id', {type: 'success'}))
        }
        logTitle.innerHTML = logTitle.textContent + '&nbsp;'.repeat(2) + newVal
    },
};



hijackXHR(function() {
    const xhr = this;
    let taskId
    if(taskId = new RegExp(`^https://data-encoder.ruqimobility.com/annotation/dataset/info/(\\d*)`).exec(xhr.responseURL)?.[1]) {
        document.title = taskId
        _ds.taskId = taskId


        let i = 0
        let lsKey
        let history = []
        let maxStorageNum = 15
        while(lsKey = localStorage.key(i++)) {
            if(!lsKey) break
            const execRes = /^history-check_(\d*)$/.exec(lsKey)
            if(execRes) {
                try {
                    const lsItem = JSON.parse(localStorage.getItem(lsKey))
                    history.push([execRes[1], lsItem.timestamp])
                } catch(e) {
                    console.error(e)
                }
            } else {
                continue
            }
        }

        if(history.length > maxStorageNum) {
            history.sort((a, b) => b[1]-a[1])
            history.slice(maxStorageNum).forEach(([taskId]) => {
                localStorage.removeItem(`history-check_${taskId}`)
            })
        }
        window._ds.history_check = JSON.parse(localStorage.getItem(`history-check_${taskId}`) ?? JSON.stringify({timestamp: Date.now()}))
    }
});



_ds.isNewVersion && hijackEventListener()


;(function() {
    document.addEventListener('contextmenu',function(e){
        e.preventDefault();
    })
})();

let frameQueue = ['caret-right', 'caret-left']
document.body.addEventListener('keyup', function(e) {
    if(e.keyCode == 82) {
        _ds.lastControlCallback?.()

        const controlPanel = $('.controlPanel')
        controlPanel.style.display = 'none'
        _ds.isShowControlPanel = false
    }

    if([81, 87, 69, 65, 83, 68].includes(e.keyCode)) {
        document.body.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}))
    }
})
document.body.addEventListener('keydown', function keydownCallback(e) {
    const { keyCode } = e
    _ds.logKeydown && console.log(keyCode, e)

    const isInput = ['input', 'textarea'].find(sel => {
        const activeEl = document.activeElement
        if(!activeEl?.matches(sel)) return
        if(sel == 'input' && activeEl.type !== 'text') return false
        return true
    })
    if(isInput) return;

    [

        [
            () => keyCode == 82,
            (e) => {

                if(!_ds.isShowControlPanel) {
                    const controlPanel = $('.controlPanel')
                    setStyle(controlPanel, {
                        display: 'flex',
                        top: _ds.top_controlPanel + 'px',
                        left: _ds.left_controlPanel + 'px',
                    })
                    _ds.isShowControlPanel = true
                }
            }
        ],
        [
            () => keyCode == 72,
            () => {
                if($('.setting')) {
                    $$('.setting .ant-checkbox-wrapper').find(label => label.textContent.includes('立体框')).click()
                } else {
                    $$('.toolbar-item-label').find(item => item.textContent.includes('显示'))?.click()
                    _ds.isSettingInitial = true

                }
            }
        ],
        [
            () => _ds.isNewVersion && [81, 87, 69, 65, 83, 68].includes(keyCode),
            () => {
                e.preventDefault();

                const triggerBtn = _ds.viewBtnMap[keyCode];
                if(!triggerBtn) return;

                triggerBtn.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}))
                if(e.altKey) document.body.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}))

            }
        ],
        [
            () => keyCode == 89,
            () => {
                setTimeout(() => $$('.item-warp-li').find(item => item.children[0].matches('.item.active'))?.click())
            }
        ],
        [
            () => [9, 32].includes(keyCode), // 【Tab】
            (e) => {
                e.preventDefault()

                if(_ds.isNewVersion) {
                    if($('.main-view').style.display !== 'none') {
                        $(`span[aria-label="${keyCode == 9 ? 'caret-left' : 'caret-right'}"]`).parentElement.click()
                    } else {
                        $$('.page-turn-btn button').find(btn => btn.textContent == ` ${keyCode == 9 ? '上一页' : '下一页'} `).click()
                    }

                } else if(keyCode == 9) {
                    const target = $(`span[aria-label="${!e.shiftKey ? frameQueue[0] : frameQueue[1]}"]`)
                    target.parentElement.click()
                }

            }
        ],
        [
            () => keyCode == 192,
            () => {
                if(_ds.isNewVersion) {
                    const btns = $$('label').filter(item => ['单帧视图', '多帧视图'].some(text => item.textContent == text))
                    btns.find(btn => !btn.className.includes('checked'))?.click()
                    document.body.focus()
                } else {
                    showMessage('反转：Tap切帧方向')
                    frameQueue.reverse()
                }
            }
        ],
    ].forEach((item) => { item[0]() && item[1](e) })
})

document.body.addEventListener('mousemove', function (e) {
    _ds.top_controlPanel = e.clientY
    _ds.left_controlPanel = e.clientX
})

const viewScheme = {
    keyMap: [81, 87, 69, 65, 83, 68], //Q81 W87 E69 A65 S83 D68
    '俯视图': [0,6,1,9,3,10],
    '侧视图': [7,4,2,3,5,6],
    '后视图': [11,4,8,9,5,10]
}

const appear = {
    imgView: false,
    maxView: false,
}
let roundCount = 1
new Promise(res => {
    Obs(document.body, mrs => {
        mrs.forEach(mr => {
            // console.log(mr)
            [...mr.addedNodes].some(an => {
                _ds.logAn && console.log(roundCount, an);

                const isContinue = ['#text', "SPAN"].some((nodeName) => (nodeName === 'SPAN' && an.matches?.('.side-view .tool .item')) ? false : an.nodeName === nodeName )
                if(isContinue) return

                if(an.matches?.('.main-view-label .item')) return

                ;[
                    [
                        () => an?.matches?.('.label-container2 button') && !an.draggable,
                        () => {
                            initTypeButton()
                        },
                    ],
                    [
                        () => an?.matches?.('.label-container2') && an.children.length,
                        () => {
                            initTypeButton()
                        },
                    ],
                    [
                        () => _ds.isNewVersion && !appear.toolItem && an.$?.('.side-view .tool .item'),
                        () => {
                            an.$$('.side-view .tool .item').forEach((el) => (el.style.display = 'none'))
                            appear.toolItem = true
                        }
                    ],
                    [
                        () => _ds.isNewVersion && an.matches?.('.side-view .tool .item'),
                        () => (an.style.display = 'none')
                    ],
                    [
                        () => !appear.endOfLoad && (appear.endOfLoad = !!$$('.ant-modal').find(item => item.textContent.includes('开始作业计时'))),
                        () => {
                            res()
                        }
                    ],
                    [
                        () => _ds.isSettingInitial && $('.setting'),
                        () => {
                            $$('.toolbar-item-label').find(item => item.textContent.includes('显示')).click()
                            $$('.setting .ant-checkbox-wrapper').find(label => label.textContent.includes('立体框')).click()
                            _ds.isSettingInitial = false
                        }
                    ],
                    [
                        () => !appear.attrSection && (appear.attrSection = $('.main-class-edit .item-relevancy+.el-collapse-item')),
                        () => {
                            postionTip()

                            Obs(appear.attrSection, mrs => {
                                // console.log(mrs)
                                postionTip()
                            }, {childList: true, attributes: true, attributeFilter: ['style']})

                            Obs($('.main-class-edit'), mrs => {
                                // console.log(mrs)
                                const itemWrap = $$('.item-warp-li').find(item => item.children[0].matches('.active'))
                                if(itemWrap && itemWrap.textContent.includes('投影')) {
                                    const find3D = select3D(itemWrap.parentElement.parentElement.parentElement)
                                    find3D && find3D.click()
                                }
                            }, {childList: true, attributes: true, attributeFilter: ['style']})

                            function postionTip() {
                                const postion = $$('.main-view-info>:nth-child(2) .item').find(item => item.textContent.startsWith('位置')).childNodes[1].textContent
                                $('.main-class-edit').style.background = (!appear.attrSection.style.display && outOfBoundsJudgment(postion)) ? 'red' : null
                            }
                        }
                    ],
                    [
                        () => !appear.positionText && (appear.positionText = $$('.main-view-info>:nth-child(2) .item').find(item => item.textContent.startsWith('位置'))?.childNodes[1]),
                        ()=> {
                            Object.defineProperty(appear.positionText, 'nodeValue', {
                                get: function() {
                                    return this.textContent;
                                },
                                set: function(newValue) {
                                    const attrPanel = $('.main-class-edit .item-relevancy+.el-collapse-item')
                                    const postion = newValue

                                    $('.main-class-edit').style.background = !attrPanel.style.display && outOfBoundsJudgment(postion) ? 'red' : null

                                    this.textContent = newValue;
                                },
                                enumerable: true,
                                configurable: true
                            })
                        }
                    ],
                    [
                        () => ((appear.messageBoxWrap = $('.el-overlay.is-message-box')) && appear.messageBoxWrap?.textContent.startsWith('提示您已长时间未保存数据')),
                        () => {
                            const messageBoxWrap = appear.messageBoxWrap
                            const messageBox = messageBoxWrap.$('.el-message-box')
                            const close = createEl('div', {
                                innerText: '×',
                                style: {
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '50px',
                                    height: '50px',
                                    fontSize: '30px',
                                    textAlign: 'center',
                                    zIndex: '99999',
                                    cursor: 'pointer',
                                },
                                onclick: function() {
                                    messageBoxWrap.remove()
                                }
                            })
                            messageBox.append(close)
                        }
                    ],
                    [
                        () => {
                            return (an.matches?.('.el-dialog') && ['全局批注', '物体批注'].some(title => an?.textContent.startsWith(title))) ||
                                (an.matches?.('.comment-modal') && ['全局批注', '物体批注'].some(title => an?.parentElement?.previousElementSibling.textContent.startsWith(title)))
                        },
                        () => {
                            const checkboxWrap = an.$('.ant-form-horizontal .ant-row')
                            const checkboxs = an.$$('input[type="checkbox"]')
                            const textarea = an.$('#description')
                            const footer = an.$('form+div')
                            const inputWraps = an.$$('.ant-checkbox-group .ant-col')


                            const title = getCommentType(an)
                            function getCommentType(el) {
                                if(el.matches('.el-overlay-dialog')) return el.getAttribute('aria-label')
                                return getCommentType(el.parentElement)
                            }
                            $(`.el-overlay-dialog[aria-label="${title}"]`).style.opacity = '.95'

                            ;['批注原因', '批注描述'].forEach(tit => (an.$(`label[title="${tit}"]`).parentElement.style.display = 'none'))
                            an.$$('.ant-row').find(item => item.textContent.startsWith('涉及帧数')).style.display = 'none'
                            setStyle(footer, {
                                marginTop: 0,
                                marginBottom: '10px',
                                textAlign: 'center',
                            })
                            inputWraps.forEach(item => (item.style.marginBottom = 0))

                            const quickPhraseWrap = createEl('div', {
                                className: 'quickPhrase-wrap',
                                style: {
                                    marginTop: '15px'
                                }
                            })

                            const scheme_global = {
                                '类型1': {
                                    '小车': '小车',
                                    'SUV': 'SUV',
                                    '大车': '大车',
                                    '两轮车': '两轮车',
                                    '三轮车': '三轮车',
                                    '人': '人',
                                    'BUS': 'BUS',
                                    '挖掘': '挖掘机',
                                    '推土': '推土机',
                                    '吊车': '吊车',
                                    '其他工程': '其他工程车',
                                },
                                '类型2': {
                                    '隔离柱': '隔离柱',
                                    '隔离栏': '隔离栏',
                                    '水马': '水马',
                                    '锥桶': '锥桶',
                                    '防撞桶': '防撞桶',
                                    '防撞球': '防撞球',
                                    '消防栓': '消防栓',
                                    '一般': '一般障碍物',
                                    '区域': '无标注区域',
                                },
                                '漏标': {
                                    '漏显示': '漏显示',
                                },
                                '补充': {
                                    '前后帧检查': '前后帧检查',
                                    '平行路沿': '角度平行路沿',
                                },
                            }
                            const scheme_obj = {
                                '方位': {
                                    '顶视': '顶视图',
                                    '侧视': '侧视图',
                                    '后视': '后视图',
                                    '角度': '角度',
                                    '轨迹角度': 'B键检查轨迹角度',
                                    '←': '左边框',
                                    '↑': '上边框',
                                    '→': '右边框',
                                    '↓': '下边框',
                                    '后视镜': '检查后视镜问题',
                                    '车头': '车头贴合',
                                    '车尾': '车尾贴合',
                                    '车顶': '车顶贴合',
                                    '后视镜': '检查后视镜贴合',
                                },
                                '贴合': {
                                    '收': '往里收',
                                    '扩': '往外扩',
                                    '上移': '整体上移',
                                    '下移': '整体下移',
                                    '左移': '整体左移',
                                    '右移': '整体右移',
                                    '↶': '逆时针旋转',
                                    '↷': '顺时针旋转',
                                    '飘空': '飘空',
                                    '下陷': '下陷',
                                    '稳定边': '贴合稳定边',
                                    '地线': '检查地线',
                                },
                                '尺寸': {
                                    '长': '长度',
                                    '宽': '宽度',
                                    '高': '高度',
                                    '脑补': '脑补',
                                    '统一': '统一尺寸',
                                },
                                '类型': {
                                    '小车': '小车',
                                    'SUV': 'SUV',
                                    '大车': '大车',
                                    '两轮车': '两轮车',
                                    '三轮车': '三轮车',
                                    '人': '人',
                                    'BUS': 'BUS',
                                    '隔离柱': '隔离柱',
                                    '锥桶': '锥桶',
                                    '防撞桶': '防撞桶',
                                    '防撞球': '防撞球',
                                    '一般': '一般障碍物',
                                },
                                '转弯维度': {
                                    '未知': '转弯属性：未知',
                                    '不转': '转弯属性：不转',
                                    '左': '转弯属性：左转',
                                    '右': '转弯属性：右转',
                                    '双闪': '双闪',
                                },
                                '刹车维度': {
                                    '未知': '刹车属性：未知',
                                    '未刹车': '刹车属性：未刹车',
                                    '刹车': '刹车属性：刹车',
                                },
                                '其他': {
                                    '漏标': '漏标',
                                    '前漏': '前续帧漏显示',
                                    '后漏': '后续帧漏显示',
                                    '漏点': '漏点',
                                    '没框全': '没框全',
                                    '舍弃点云': '适当舍弃点云',
                                    '属性漏': '属性漏选',
                                },
                                '补充': {
                                    '前后帧检查': '前后帧检查',
                                    '伪3D': '检查伪3D',
                                }
                            }
                            const scheme = title == '全局批注（物体）' ? scheme_global : scheme_obj

                            const checkboxMap = title !== '全局批注（物体）' ? {
                                '不贴合': ['贴合', '方位'],
                                '标签错误': ['类型'],
                                '方向错误': [],
                                '属性错误': ['转弯维度', '刹车维度'],
                                '尺寸不对': ['尺寸'],
                                '方向错误': [],
                                '多标': [],
                                '其他': ['其他'],
                            } : {
                                '漏标': ['类型1', '类型2'],
                                '其他': ['漏标'],
                            }

                            for(let k1 in scheme) {
                                const btnWrap = createEl('div', {
                                    className: 'btn-wrap',
                                    style: {
                                        display: 'flex',
                                        marginBottom: '12px'
                                    }
                                })
                                const title = createEl('div', {
                                    className: 'btn-title',
                                    innerText: `${k1}：`,
                                    style: {
                                        fontSize: '13px'
                                    }
                                })
                                btnWrap.append(title)

                                for(let k2 in scheme[k1]) {
                                    const phrase = scheme[k1][k2]
                                    const btn_style = {
                                        padding: '0px 5px',
                                        height: '20px',
                                        lineHeight: '20px',
                                        margin: '0 5px 0 0',
                                        backgroundColor: 'rgb(136, 136, 136)',
                                        color: 'rgb(255, 255, 255)',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                    }
                                    const btn = createEl('div', {
                                        className: 'phrase-btn',
                                        innerText: k2,
                                        style: btn_style,
                                        onmousedown: function (e) {
                                            const findIdx = Object.values(checkboxMap).findIndex(arr => arr.includes(k1))
                                            if(findIdx !== -1) {
                                                checkboxs.forEach(checkbox => {
                                                    if(checkbox.value === Object.keys(checkboxMap)[findIdx] && !checkbox.checked) checkbox.click()
                                                })
                                                if(e.button === 2) {
                                                    setTimeout(() => {
                                                        checkboxs.forEach((checkbox, idx) => {
                                                            if(checkbox.value !== Object.keys(checkboxMap)[findIdx] && checkbox.checked) setTimeout(() => checkbox.click(), idx*100)
                                                        })
                                                    })
                                                }

                                            }

                                            const value = textarea.value
                                            if(e.button === 0) {
                                                setTextAreaValue(textarea, `${value}${value ? '；' : ''}${phrase}`)
                                            } else if(e.button === 2) {
                                                setTextAreaValue(textarea, `${phrase}`)
                                            }
                                        },
                                    })
                                    btnWrap.append(btn)
                                }
                                quickPhraseWrap.append(btnWrap)
                            }
                            checkboxWrap.insertAdjacentElement('afterend', quickPhraseWrap)
                            quickPhraseWrap.insertAdjacentElement('afterend', footer)

                        }
                    ],
                    [
                        () => {
                            return (an.matches?.('.el-dialog') && an?.textContent.startsWith('全局批注')) ||
                                (an.matches?.('.comment-modal') && an?.parentElement?.previousElementSibling.textContent.startsWith('全局批注'))
                        },
                        () => {
                            const checkboxs = an.$$('#reason input[type="checkbox"]')
                            if(checkboxs.every(item => !item.checked)) checkboxs.find(item => item.value == '漏标').click()
                        }
                    ],
                    [
                        () => !appear.annoType && $('.key-frame-annotate-type .ant-dropdown-trigger'),
                        () => {
                            $('.key-frame-annotate-type .ant-dropdown-trigger').click()
                            appear.annoType = true
                        }
                    ],
                    [
                        () => !appear.annoTypeDropdown && $('.ant-dropdown')?.textContent.startsWith('关闭关键帧继承'),
                        () => {
                            $('.ant-dropdown').style.display = 'none'

                            $('.key-frame-annotate-type .ant-dropdown-trigger').click()
                            setTimeout(() => ($('.ant-dropdown').style.display = null))
                            appear.annoTypeDropdown = true
                        }
                    ],
                    [
                        () => !appear.close && $('.ant-dropdown li[data-menu-id="close"]:not(.ant-dropdown-menu-item-disabled)'),
                        () => {
                            $('.ant-dropdown li[data-menu-id="close"]').click()
                            appear.close = true
                        }
                    ],
                    [
                        () => !appear.mulView && $('.main-view.mul-view'),
                        () => {
                            const mulView = $('.main-view.mul-view')
                            mulView.$$('.el-row.mul-row').forEach(treeView => {
                                bindView(treeView)
                            })

                            $$('.mul-title').forEach(el => {
                                el.onclick = function() {
                                    // setInputValue($('.pageIndex input'), )
                                    $('.timeline-scale').children[Number(el.textContent) - 1].click()
                                }
                            })

                            appear.mulView = true
                        }
                    ],
                    [
                        () => !appear.sideviewWrap && $('.sideview-container'),
                        () => {
                            const sideviewWrap = $('.sideview-container')
                            bindView(sideviewWrap)
                            appear.sideviewWrap = true
                        }
                    ],
                    [
                        () => !appear.sideviewWrap && $('.sideview-container'),
                        () => {

                            appear.sideviewWrap = true
                        }
                    ],
                    [
                        () => !appear.commentPanel && $('.comment-container'),
                        () => {
                            const commentPanel = $('.comment-container');

                            commentPanel.style.opacity = 0.9

                            let isMoving = false;
                            let top = -15;
                            let right = -225

                            const obsTarget = commentPanel.$('.comment-panel').children[0]
                            Obs(obsTarget, (mrs)=> {
                                if(obsTarget.style.display == '') {
                                    commentPanel.style.top = top + 'px'
                                    commentPanel.style.right = right + 'px'
                                } else {
                                    commentPanel.style.top = '0px'
                                    commentPanel.style.right = '3px'
                                }
                            }, {childList: true, attributes: true, attributeOldValue: true})

                            commentPanel.addEventListener('mousedown', (e) => {
                                if(e.button == 1) {
                                    isMoving = true
                                    e.preventDefault()
                                }
                            })
                            document.body.addEventListener('mousemove', (e) => {
                                if(!isMoving) return
                                commentPanel.style.top = ((top += e.movementY) + 'px')
                                commentPanel.style.right = ((right -= e.movementX) + 'px')
                            })
                            commentPanel.addEventListener('mouseup', (e) => {
                                if(e.button == 1) isMoving = false
                            })
                            appear.commentPanel = true
                        }
                    ],
                    [
                        () => an.matches?.('.ant-btn.select-label'),
                        () => (_ds.isDrawing = true)
                    ],
                    [
                        () => !appear.waterMask && $('#waterMask'),
                        () => {
                            $('#waterMask').remove()
                            appear.waterMask = true
                        }
                    ],
                    [
                        () => !appear.handleLineSide && $('.sideview-container .handle-line-side'),
                        () => {
                            const el = $('.sideview-container .handle-line-side')
                            const obs = Obs(el, mrs => {
                                mrs.forEach(mr => {
                                    if(mr.attributeName === 'style' && el.style.diplay !== 'none') {
                                        el.dispatchEvent(new MouseEvent('mousedown', {
                                            screenY: 800
                                        }))
                                        document.body.dispatchEvent(new MouseEvent('mousemove', {
                                            screenY: 620,
                                            bubbles: true
                                        }))
                                        document.body.dispatchEvent(new MouseEvent('mouseup', {
                                            bubbles: true
                                        }))
                                    }
                                })
                            }, {childList: true, attributes: true})

                            appear.handleLineSide = true
                        }
                    ],
                    [
                        () => !appear.objListTitle && $('#pane-objectLabel .header-title'),
                        () => {
                            const objListTitle = $('#pane-objectLabel .header-title')
                            Obs(objListTitle, mrs => {
                                mrs.forEach(mr => {
                                    [...mr.addedNodes].forEach(an => {
                                        const curSum = /物体标签\((\d*)\)/.exec(an.textContent)[1]
                                        if(_ds.isDrawing && +curSum === +_ds.objSum+1 ) {
                                            _ds.isDrawing = false
                                            _ds.isFocusObj = true
                                        }
                                        _ds.objSum = curSum

                                    })
                                })
                            })

                            const checkbox = createEl('input', {
                                type: 'checkbox',
                                checked: _ds.isRecordCheckHistory,
                                title: '是否记录并显示查看历史？',
                                onclick: function() {
                                    _ds.isRecordCheckHistory = checkbox.checked
                                    localStorage.setItem('history-record', checkbox.checked)

                                    $$('.instance-track-item').forEach(item => {
                                        if(checkbox.checked) {
                                            const [text, type, sn] = /(.*)-(\d*)/.exec(item.textContent)
                                            if(_ds.history_check[type]?.includes(sn)) {
                                                item.style.boxShadow = 'gray 0 0 10px 5px inset'
                                            } else if(item.parentElement.parentElement.nextElementSibling?.$('.item.active')) {
                                                updateHistory(item, 'add')
                                            }

                                            item.onmousedown = function(e) {
                                                if(e.button !== 1) return
                                                e.preventDefault()

                                                if(_ds.isRecordCheckHistory) updateHistory(item)
                                            }
                                        } else {
                                            item.style.boxShadow = null
                                        }
                                    })
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                }
                            })
                            $('.header-control .operate-icon-btn').insertAdjacentElement('afterbegin', checkbox)

                            appear.objListTitle = true
                        }
                    ],
                    [
                        () => _ds.isRecordCheckHistory && an.matches?.('.el-tree-node.is-focusable'),
                        () => {
                            const objItem = an.$('.item-warp-li')
                            const objItemParentTreeNode = an.$('.instance-track-item')

                            if(objItem && !objItem.textContent.includes('投影')) {
                                const target = objItem.children[0]
                                if(!target.matches('.item.active')) {
                                    Obs(target, mrs => {
                                        mrs.forEach(mr => {
                                            if(!target.matches('.item.active')) return

                                            updateHistory(an.previousElementSibling.$('.instance-track-item'), 'add')
                                        })
                                    }, {childList: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']})
                                    return
                                }
                                updateHistory(an.previousElementSibling.$('.instance-track-item'), 'add')

                            } else if(objItemParentTreeNode) {
                                const [text, type, sn] = /(.*)-(\d*)/.exec(objItemParentTreeNode.textContent)
                                if(_ds.history_check[type]?.includes(sn)) objItemParentTreeNode.style.boxShadow = 'gray 0 0 10px 5px inset'

                                objItemParentTreeNode.onmousedown = function(e) {
                                    if(e.button !== 1) return
                                    e.preventDefault()

                                    if(_ds.isRecordCheckHistory) updateHistory(objItemParentTreeNode)
                                }
                            }
                        }
                    ],
                    [
                        () => an.matches?.('.el-tree-node.is-expanded.is-focusable') && an.$('.item-warp-li'),
                        () => {
                            const objItem = an.$('.item-warp-li')
                            if(_ds.isFocusObj && objItem.children[0].matches('.item.active')) {
                                ['keydown', 'keyup'].forEach((event) => {
                                    document.body.dispatchEvent(new KeyboardEvent(event, {
                                        code: "Escape",
                                        key: "Escape",
                                        keyCode: 27,
                                        bubbles: true
                                    }))
                                });

                                objItem.click()

                                _ds.isFocusObj = false
                            }

                            if(objItem.textContent.includes('投影')) {
                                const find3D = select3D(an)
                                find3D && find3D.click()
                            }

                        }
                    ],
                    [
                        () => an.matches?.('.pc-editor'),
                        () => {
                            setStyle($('.annotate-mode'), {
                                fontSize: '20px',
                                fontWeight: '800',
                                background: 'black',
                            })


                        }
                    ],
                    [
                        () => !appear.imgView && $('.img-view'),
                        () => {
                            const views = $$('.img-view')
                            views.forEach(view => {
                                let isScroll = false

                                set2DImgPositionInfo(view.$('.camera-number'))

                                clickTrigger(view, (e) => {
                                    view.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
                                }, 3, 2)

                                view.addEventListener('mouseenter', (e)=> {
                                    if(e.clientX < 20) return
                                    view.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                    isScroll = false
                                })
                                view.addEventListener('mousemove', (e)=> {
                                    // console.log(e)
                                    if(!isScroll && e.clientX < 20) {
                                        view.dispatchEvent(new MouseEvent('mouseleave'))
                                        isScroll = true
                                    } else if(isScroll && e.clientX >= 20) {
                                        view.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                        isScroll = false
                                    }
                                })
                            })
                            appear.imgView = true
                        },
                    ],
                    [
                        () => !appear.maxView && (appear.maxView = $('.img-view-max')),
                        () => {
                            const positionInfoEl = [...appear.maxView.$('.info').children].at(-1)
                            set2DImgPositionInfo(positionInfoEl)

                            Obs(positionInfoEl, mrs => {
                                mrs.forEach(mr => {
                                    [...mr.addedNodes].forEach(an => {
                                        if(an.nodeName == '#text') set2DImgPositionInfo(an)
                                    })
                                })
                            }, {childList: true})

                            clickTrigger(appear.maxView, (e) => {
                                appear.maxView.$('span[title="关闭"]').click()
                            }, 3, 2)
                        }
                    ],
                    [
                        () => an.$?.('.rect-ground-line line'),
                        () => an.$$('.rect-ground-line line').forEach(line => (line.style.stroke = 'rgba(255, 0, 0, .2'))
                    ],
                    [
                        () => !appear.attrPanel && $('.main-class-edit'),
                        () => {
                            $('.main-class-edit .view-class-wrap').style.minHeight = 'auto' //高度自适应

                            setStyle($('.main-class-edit'), {
                                bottom: 'auto',
                                top: '260px',
                                left: '1350px',
                                opacity: '0.9',
                            })

                            $('.main-class-edit').addEventListener('mousedown', (e) => {
                                if(e.which == 3) $('.main-class-edit i.el-icon.close').click()
                            })

                            appear.attrPanel = true
                        }
                    ],
                    [
                        () => !appear.taskWrap && $('.item-wrap.title-task'),
                        () => {
                            const taskWrap = $('.item-wrap.title-task')
                            setStyle(taskWrap, {
                                position: 'relative',
                            })
                            taskWrap.$$('.title-text').forEach(item => {
                                item.style.cursor = 'pointer'

                                item.addEventListener('click', (e) => {
                                    let cookieVal
                                    document.cookie.split('; ').some(kv => {
                                        const [k, v] = kv.split('=')
                                        if(k === 'ruqimobility.com-prod token') {
                                            cookieVal = v
                                            return true
                                        }
                                    })
                                    let URLParam = /https:\/\/data-encoder\.ruqimobility\.com\/tool\/pc\?(.*)/.exec(location.href)?.[1]
                                    if(!cookieVal || !URLParam) return showMessage('复制失败', {type: 'error'})

                                    const textToCopy = cookieVal + '   ' + URLParam
                                    copyToClipboard(textToCopy).then(res => showMessage('已复制到剪切板'))
                                })
                            })

                            const btn_change = createEl('div', {
                                title: '切换跳转',
                                style: {
                                    position: 'absolute',
                                    right: '0px',
                                    bottom: '0px',
                                    width: '15px',
                                    height: '15px',
                                    background: 'gray',
                                    cursor: 'pointer'
                                },
                                onclick: function() {
                                    navigator.clipboard.readText().then((clipText) => {
                                        const [cookieVal, URLParam] = clipText.split('   ')
                                        if(cookieVal && URLParam) {
                                            document.cookie = `ruqimobility.com-prod token=${cookieVal};domain=.ruqimobility.com;path=/`
                                            location.href = `https://data-encoder.ruqimobility.com/tool/pc?${URLParam}`
                                        } else {
                                            showMessage('凭证不合法', {type: 'error'})
                                        }
                                    });
                                }
                            })
                            taskWrap.append(btn_change)
                            appear.taskWrap = true
                        },
                    ],
                    [
                        () => {},
                        () => {},
                    ]
                ].forEach((item) => { item[0]() && item[1]() })

                if(an.matches?.('.object-item') && an.textContent?.startsWith('点云对象')) { //切帧
                    const btnStyle = {
                        position: 'absolute',
                        left: '10px',
                        borderRadius: '5px',
                        transform: 'scale(.9)',
                        padding: '0px 5px',
                        height: '20px',
                        lineHeight: '20px',
                        margin: '0 5px 0 0',
                        backgroundColor: 'rgb(136, 136, 136, .5)',
                        color: 'rgb(255, 255, 255)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }

                    const btn_display = createEl('div', {
                        className: 'displayAttr',
                        innerText: '显隐',
                        style: btnStyle,
                        onclick: display.bind(this, void 0)
                    })
                    const attrPanel = matchesWrapper(an, '.main-class-edit');
                    !$('.displayAttr') && attrPanel.$('.edit-class-common').insertAdjacentElement('afterbegin', btn_display)

                    display(false)

                    return true

                    function display(isShow) {
                        const items = [...attrPanel.$('.el-collapse').children]
                        const display_items_0 = items[0].style.display
                        items.forEach(el => {
                            if(el.textContent.startsWith('Attributes')) return
                            if(isShow !== void 0) {
                                el.style.display = isShow ? null : 'none'
                            } else {
                                el.style.display = display_items_0 === '' ? 'none' : null
                            }
                        })
                    }
                }
            })

        })
        function initTypeButton() {
            const ls_typebuttons_sort = JSON.parse(localStorage.getItem('typebuttons_sort') )
            if(Array.isArray(ls_typebuttons_sort)) {
                const wrap = $('.label-container2')
                ls_typebuttons_sort.toReversed().forEach(text => {
                    const target = $$('.label-container2 button').find(btn => btn.textContent === text)
                    wrap.insertAdjacentElement('afterbegin', target)
                })
            }


            let source = null
            $$('.label-container2 button').forEach(btn => {
                btn.draggable = true

                btn.addEventListener('dragstart', (e) => {
                    console.log('dragstart')
                    setTimeout(() => {
                        e.target.style.opacity = 0
                    }, 0)
                    source = e.target
                })

                btn.addEventListener('dragenter', (e) => {
                    if(!(e.target !== source && e.target.matches?.('.label-container2 button'))) return
                    e.target.insertAdjacentElement('beforebegin', source)
                    console.log('dragenter', e.target)
                })

                btn.addEventListener('dragend', (e) => {
                    e.target.style.opacity = 1
                    localStorage.setItem('typebuttons_sort', JSON.stringify($$('.label-container2 button').map(btn => btn.textContent)))
                    source = null
                })

            })
            appear.labelButtons = true

        }

        function outOfBoundsJudgment(postion) {
            let [text, x, y] = /(.*),(.*),(.*)/.exec(postion)
            x = Number(x)
            y = Number(y)
            return (x > 100 || x < -100) || (y > 50 || y < -50)
        }

        function select3D(el) {
            const targetEl = el.previousElementSibling
            if(!targetEl) return

            const item = targetEl.$('.item-warp-li')
            if(!item) return

            if(!item.textContent.includes('投影')) {
                return item
            } else {
                return select3D(targetEl)
            }
        }

        function bindView(viewWrap) { //键盘调整三视图
            const btnItems = viewWrap.$$('.item')

            viewWrap.$$('.side-view').forEach(item => {
                item.addEventListener('mouseenter', (e) => {
                    const angle_view = item.$('.title1').textContent
                    const scheme = viewScheme[angle_view]

                    const viewBtnMap = {}
                    scheme.forEach((btnIdx, idx) => {
                        viewBtnMap[viewScheme.keyMap[idx]] = btnItems[btnIdx]
                    })
                    _ds.viewBtnMap = viewBtnMap
                })

                item.addEventListener('mouseleave', (e) => {
                    _ds.viewBtnMap = {}
                })
            })
        }

        function set2DImgPositionInfo(cameraNumEl) {
            const imgPosition = ['后', '前远', '前广', '左后', '左前', '右后', '右前']
            cameraNumEl.textContent = imgPosition[ /camera-(\d)/.exec(cameraNumEl.textContent)[1]-1 ]
        }

        function updateHistory(target, mode) { // mode = add | del
            const [text, type, sn] = /(.*)-(\d*)/.exec(target.textContent)
            let history = _ds.history_check[type] ?? []
            let isUpdateView = false

            if(history.includes(sn)) {
                if(mode == 'add') return
                history.splice(history.findIndex(item => item == sn), 1)
                setTimeout(() => {
                    if(!isUpdateView) return
                    target.style.boxShadow = null

                    if(!target.parentElement.parentElement?.nextElementSibling.$('.item.active')) return
                    ['keydown', 'keyup'].forEach((event) => {
                        document.body.dispatchEvent(new KeyboardEvent(event, {
                            code: "Escape",
                            key: "Escape",
                            keyCode: 27,
                            bubbles: true
                        }))
                    });
                })
            } else {
                if(mode == 'del') return
                history.push(sn)
                setTimeout(() => isUpdateView && (target.style.boxShadow = 'gray 0 0 10px 5px inset'))
            }

            _ds.history_check[type] = history
            localStorage.setItem(`history-check_${_ds.taskId}`, JSON.stringify(_ds.history_check))
            isUpdateView = true

        }

        ++roundCount
    }, { childList: true, subtree: true })
}).then(res => {
    document.body.tabIndex = 1
    const operationWrap = $('.operation-wrap')
    setStyle(new Map([[
        operationWrap.$('.label-item'), {
            display: 'flex',
        }
    ], [
        operationWrap.$('.show-select'), {
            display: 'flex',
            flexDirection: 'column'
        }
    ], [
        operationWrap.$('.select-list'), {
            position: 'absolute',
            left: '85px',
            top: '-53px',
            height: '115px',
        }
    ], [
        operationWrap.$('.label-container2-one-line'), {
            height: '115px',
        }
    ], [
        operationWrap.$('.label-container2'), {
            overflow: 'visible',
        }
    ]]))
    let isShowlabelContainer = false
    operationWrap.$('.select-list').addEventListener('mouseenter', () => {
        if(isShowlabelContainer) return

        setStyle(new Map([[
            operationWrap.$('.select-list'), {
                top: '-153px',
            }
        ], [
            operationWrap.$('.label-container2-one-line'), {
                height: '315px',
            }
        ]]))
    })
    operationWrap.$('.select-list').addEventListener('mouseleave', () => {
        setStyle(new Map([[
            operationWrap.$('.select-list'), {
                top: '-53px',
            }
        ], [
            operationWrap.$('.label-container2-one-line'), {
                height: '115px',
            }
        ]]))
    })
    Obs(operationWrap.$('.label-container'), (mrs) => {
        mrs.forEach(mr => {
            if(mr.attributeName !== 'style') return

            if(mr.target.style.display == 'none') {
                styleRestore()
                isShowlabelContainer = false
            } else {
                operationWrap.$('.select-list').style.top = '-53px'
                operationWrap.$('.label-container2-one-line').style.height = '115px'
                isShowlabelContainer = true
            }
        })
    }, {attributes: true})

    function styleRestore() {
        operationWrap.$('.label-container2').style.overflow = 'visible'
    }


    const checkbox_setOperationScheme = createEl('input', {
        type: 'checkbox',
        checked: _ds.isNewVersion,
        title: '是否使用新版操作逻辑（三视图调整、切帧）？',
        onclick: function(e) {
            e.stopPropagation()
            localStorage.setItem('isNewVersion', checkbox_setOperationScheme.checked)
            showMessage('你已更改操作方案，刷新页面后生效')
        },
        style: {
            position: 'absolute',
            top: '13px',
            right: '10px',
            width: '11px',
            cursor: 'pointer',
        }
    })
    $('.log-title').append(checkbox_setOperationScheme)

    resetPointCloud()


    clickTrigger($('.main-render'), () => {
        ['keydown', 'keyup'].forEach((event) => {
            document.body.dispatchEvent(new KeyboardEvent(event, {
                code: "KeyY",
                key: "y",
                keyCode: 89,
                bubbles: true
            }))
        });
    }, 3, 2, false);

    const controlPanel = createEl('div', {
        className: 'controlPanel',
        style: {
            display: 'none',
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            width: '70px',
            height: '25px',
            background: '#000',
            zIndex: 999,
        },
        onmouseleave: function() {
            _ds.lastControlCallback = null
        }
    })
    const btn_players = $$('.player-icon')
    const geneScheme = [
        [0.3, () => {
            btn_players[0].click()
        }],
        [0.6, () => {
            $$('.frame-item-load-num').filter(item => getComputedStyle(item).backgroundColor == 'rgb(36, 137, 253)').at(0)?.click()
        }],
        [1, () => {
            ['keydown', 'keyup'].forEach((event) => {
                const mode_dropdown = $$('.ant-dropdown').find(item => item.textContent.startsWith('关闭关键帧继承'))
                setMode($('.key-frame-annotate-type').textContent == '叠帧模式 ' ? '关键帧插值' : '叠帧模式')
                function setMode(mode) {
                    const target = mode_dropdown.$$('li').find(li => li.textContent == mode)
                    target && target.click()
                    showMessage(`切换模式：${mode}`)
                }
            });
        }],
        [0.6, () => {
            $$('.frame-item-load-num').filter(item => getComputedStyle(item).backgroundColor == 'rgb(36, 137, 253)').at(-1)?.click()
        }],
        [0.3, () => {
            btn_players.at(-1).click()
        }],
    ]
    geneScheme.forEach(([opacity, callback], index) => {
        const funcItem = createEl('div', {
            // innerText: content,
            style: {
                flex: index !== 2 ? 1 : 0.2,
                height: '100%',
                background: 'gray',
                border: '1px solid lightgray',
                opacity,
            },
            onmouseenter: function() {
                _ds.lastControlCallback = callback
            }
        })
        controlPanel.append(funcItem)
    })
    document.body.append(controlPanel)


    ;[$('.main-render'), $('.img-view-max')].forEach(el => {
        clickTrigger(el, () => {
            ['keydown', 'keyup'].forEach((event) => {
                document.body.dispatchEvent(new KeyboardEvent(event, {
                    code: "KeyT",
                    key: "t",
                    keyCode: 84,
                    bubbles: true
                }))
            });
        }, 2, 2, false)
    })

//     const checkboxs = $$('.el-popper').find(item => item.textContent.startsWith(' 全选')).getElementsByClassName('el-checkbox')
//     Obs(appear.labelFilter, mrs => {
//         mrs.some(mr => {
//             for(const an of [...mr.addedNodes]) {
//                 // console.log(an)
//                 if(an.nodeName !== '#text') {
//                     return
//                 } else {
//                     [...checkboxs].forEach(checkbox => {
//                         if(!checkbox.matches('.is-checked')) setTimeout(() => checkbox.click())
//                     })
//                     return true
//                 }
//             }
//             // if(mr.attributeName == "class" && !appear.labelFilter.$$('.el-checkbox').every(checkbox => checkbox.matches('.el-checkbox'))) lockChecked(mr.target)
//         })
//     }, {childList: true, subtree: true})

//     function lockChecked(checkbox) {
//         if(!appear.labelFilter.$$('.el-checkbox').every(checkbox => checkbox.matches('.el-checkbox'))) {
//             checkbox.click()
//             setTimeout(() => lockChecked(checkbox))
//         } else {
//             return
//         }
//     }

    function resetPointCloud() {
        const ls_checkbox_reset = localStorage.getItem('checkbox_reset')
        const checkbox_reset = createEl('input', {
            type: 'checkbox',
            title: '切帧重置点云高度',
            checked: ls_checkbox_reset ? ls_checkbox_reset == 'true' ? true : false : false,
            onclick: function() {
                localStorage.setItem('checkbox_reset', this.checked)
            },
            style: {
                opacity: '.65',
                cursor: 'pointer',
            }
        })
        $$('.main-view-setting>.item').find(item => item.textContent.startsWith('标注高度')).append(checkbox_reset)

        let timer = null
        Obs($('.timeline-scale'), mrs => {
            // console.log('mrs===', mrs)
            if(!checkbox_reset.checked) return

            timer && clearTimeout(timer)
            timer = setTimeout(() => {
                $('button[title="重置"]').click()
                clearTimeout(timer)
                timer = null
            }, 800)
        }, {childList: true, subtree: true})
    }
})

function hijackEventListener() {
    const realAEL = EventTarget.prototype.addEventListener;
    const realREL = EventTarget.prototype.removeEventListener;

    const realAbortController = window.AbortController
    const eventAbortControllerMap = new WeakMap()

    window.AbortController = function() {
        const controller = new realAbortController(...arguments);
        controller.signal.parentController = controller;
        return controller;
    }
    const realAbort = realAbortController.prototype.abort
    realAbortController.prototype.abort = function () {
        let listenerWrapperMap = eventAbortControllerMap.get(this)
        if(listenerWrapperMap) {
            listenerWrapperMap.forEach((wrapperList, element) => {
                const eventListenerList = element.eventListenerList
                for (let type in eventListenerList) {
                    const index = eventListenerList[type].findIndex(item => wrapperList.includes(item.listenerWrapper))
                    if(index !== -1) eventListenerList[type].splice(index, 1)
                    if(!eventListenerList[type].length) delete eventListenerList[type]
                }
                if(Object.keys(element.eventListenerList)) delete element.eventListenerList
            })
            eventAbortControllerMap.delete(this)
        }
        realAbort.apply(this, arguments)
    }

    let bindSN = 1
    const bindSNDom = createEl('div', {
        className: 'bind-sn',
        textContent: bindSN,
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            fontSize: '16px',
            background: 'pink',
            zIndex: 999,
        }
    })
    // document.body.append(bindSNDom)
    EventTarget.prototype.addEventListener = function(type, listener) {
        this.eventListenerList ||= {};
        this.eventListenerList[type] ||= [];

        const arg_3 = arguments[2]
        const funcName = `${type}_${bindSN}`
        const virtualOptions = {
            listener,
            listenerWrapper:  (type == 'keydown' ?
                {[funcName](e) {
                    if(!e.ctrlKey && [81, 87, 69, 65, 83, 68].includes(e.keyCode)) { // Q81 W87 E69 A65 S83 D68
                        if(listener.name !== 'keydownCallback') return
                    }

                    if(e.keyCode == 32 && listener.name !== 'keydownCallback') return

                    if(e.keyCode >= 49 && e.keyCode <= 53) {
                        if(e.currentTarget == document.body && e.target == document.body) {
                            $$('.label-container2 .select-label').find(label => label.textContent === ['小车', 'SUV', '两轮车', '人', '隔离柱'][e.keyCode-49]).click()
                        }
                        return
                    }

                    listener.apply(this, arguments);
                }} :
                {[funcName](e) {
                    listener.apply(this, arguments);
                }}
            )[funcName],
            useCapture: arg_3 === void 0 ? false :
            typeof arg_3 === 'boolean' ? arg_3 :
            isPlainObject(arg_3) ? Boolean(arg_3.capture) :
            (() => { throw new Error('Parameter invalid') })(),
        }

        const listenerWrapper = virtualOptions.listenerWrapper
        listenerWrapper.listener = listener

        if(findEventListIndex(this, type, virtualOptions) !== -1) return

        if(arg_3?.signal && Object.prototype.toString.call(arg_3.signal?.parentController).includes('AbortController')) {
            virtualOptions.signal = arg_3.signal
            const listenerWrapperMap = eventAbortControllerMap.get(arg_3.signal.parentController)
            if(listenerWrapperMap) {
                const wrapperList = listenerWrapperMap.get(this)
                wrapperList ? wrapperList.push(listenerWrapper) : listenerWrapperMap.set(this, [listenerWrapper])
            } else {
                eventAbortControllerMap.set(arg_3.signal.parentController, new Map([[this, [listenerWrapper]]]))
            }
        }

        realAEL.call(this, type, listenerWrapper, arg_3);
        this.eventListenerList[type].push(virtualOptions);

        bindSNDom.textContent = bindSN
        bindSN++
    };

    EventTarget.prototype.removeEventListener = function(type, listener) {
        const arg_3 = arguments[2]
        const virtualOptions = {
            listener,
            useCapture: arg_3 === void 0 ? false :
            typeof arg_3 === 'boolean' ? arg_3 :
            isPlainObject(arg_3) ? Boolean(arg_3.capture) :
            (() => { throw new Error('Parameter invalid') })()
        }

        ;(function remove(element) {
            const index = findEventListIndex(element, type, virtualOptions)
            if(index == -1) return

            const listenerList = element.eventListenerList
            const {listenerWrapper, signal} = listenerList[type][index] // virtualOptions

            realREL.call(element, type, listenerWrapper, arg_3)
            listenerList[type].splice(index, 1);

            if(signal) {
                const listenerWrapperList = eventAbortControllerMap.get(signal.parentController).get(element)
                const findIndex = listenerWrapperList.findIndex(listenerWrapper => listenerWrapper == listenerWrapper)
                if(findIndex !== -1) listenerWrapperList.splice(findIndex, 1)

                if(!listenerWrapperList.length) eventAbortControllerMap.get(signal.parentController).delete(element)
                if(!eventAbortControllerMap.get(signal.parentController).size) eventAbortControllerMap.delete(signal.parentController)
            }

            if(!listenerList[type].length) delete listenerList[type]
            if(!Object.keys(listenerList).length) delete element.eventListenerList
        })(this)
    };

    function findEventListIndex(element, type, virtualOptions) {
        const eventListenerList = element.eventListenerList

        if(!eventListenerList) {
            element.eventListenerList = {};
            element.eventListenerList[type] = [];
            return -1
        }

        if(Object.keys(eventListenerList).includes(type)) {
            return eventListenerList[type].findIndex(item => {
                return ['listener', 'useCapture'].every(key => item[key] === virtualOptions[key])
            })
        } else {
            return -1
        }
    }

    function isPlainObject(value) {
        if (value === null || Array.isArray(value)) return false;

        return typeof value === "object" &&
            Object.prototype.toString.call(value) === "[object Object]" &&
            (value.constructor === Object || Object.getPrototypeOf(value) === null);
    }
}


function setInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeInputValueSetter.call(input, value);
    ['input', 'change'].forEach((event) => input.dispatchEvent(new Event(event, { bubbles: true })))
};

function setTextAreaValue(textarea, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    nativeInputValueSetter.call(textarea, value);
    ['input', 'change'].forEach((event) => textarea.dispatchEvent(new Event(event, { bubbles: true })))
};

function hijackXHR(change, send) {
    const realXMLHttpRequest = window.XMLHttpRequest;

    window.XMLHttpRequest = function() {
        const xhr = new realXMLHttpRequest();

        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState !== 4) return
            change.call(this)
        });

        send && (xhr.send = send.bind(xhr))
        return xhr;
    }

    const realOpen = realXMLHttpRequest.prototype.open;
    realXMLHttpRequest.prototype.open = function () {
        const xhr = this
        let curURL = arguments[1]
        const getter = Object.getOwnPropertyDescriptor(realXMLHttpRequest.prototype, "responseText").get
            Object.defineProperty(xhr, "responseText", {
                get() {
                    let result = getter.call(xhr);
                    if(new RegExp("/annotation/dataset/info/\\d+").test(curURL)) {
                        let result_parse = JSON.parse(getter.call(xhr));
                        const classAttributes = result_parse.data.classAttributes
                        if(classAttributes) {
                            classAttributes.pointSize = _ds.pointSize
                            classAttributes.pointColorMode.pointColors = ["rgb(255, 255, 255)", "rgb(255, 132, 0)"];
                        } else {
                            result_parse.data.classAttributes = {
                                "contrast": 100,
                                "saturate": 100,
                                "lightness": 100,
                                "pointSize": 0.17,
                                "measureOpen": true,
                                "measureConfig": [
                                    {
                                        "id": 0,
                                        "type": "circle",
                                        "radius": 50
                                    },
                                    {
                                        "id": 1,
                                        "type": "rect",
                                        "xPlus": 220,
                                        "yPlus": 100,
                                        "rotate": 0,
                                        "xMinus": 220,
                                        "yMinus": 100
                                    },
                                    {
                                        "id": 2,
                                        "type": "rect",
                                        "xPlus": 100,
                                        "yPlus": 50,
                                        "rotate": 0,
                                        "xMinus": 100,
                                        "yMinus": 50
                                    }
                                ],
                                "pointColorMode": {
                                    "mode": "height",
                                    "pointHSL": "hsl(220, 100%, 50%)",
                                    "pointColors": ["rgb(255, 255, 255)", "rgb(255, 132, 0)"],
                                    "pointHeight": [
                                        -0.2,
                                        3.5
                                    ],
                                    "pointIntensity": [
                                        0,
                                        255
                                    ]
                                },
                                "backgroundColor": "#000",
                                "in2DImageRender": {
                                    "renderBox": true,
                                    "renderRect": false,
                                    "renderImgPolygon": true,
                                    "renderProjectBox": true,
                                    "renderImgKeyPoint": true,
                                    "renderImgPolyLine": true
                                }
                            }
                        }
                        // console.log(result)
                        console.log(result_parse)
                        result = JSON.stringify(result_parse)
                    }
                    if(new RegExp("/annotation/projectLabelMatter/findAll/\\d+").test(curURL)) {
                        let result_parse = JSON.parse(getter.call(xhr));
                        const data = result_parse.data
                        const scheme = {
                            '小车': {
                                length: 4.6,
                                height: 1.45,
                            },
                            'SUV': {
                                length: 4.6,
                                width: 2.1,
                                height: 1.65,
                            },
                            'BUS': {
                                length: 10,
                            },
                            '两轮车': {
                                length: 1.6,
                                width: 0.7,
                                height: 1.5,
                            },
                            '三轮车': {
                                length: 2.45,
                                width: 1.10,
                                height: 1.55,
                            },
                            '人': {
                                height: 1.65,
                            },
                            '隔离柱': {
                                length: [0.1, 1, 0.12],
                                width: [0.1, 1, 0.12],
                                height: [0.1, 1, 0.5],
                            },
                            '防撞桶': {
                                length: [0.1, 999, 0.85],
                                width: [0.1, 999, 0.85],
                                height: [0.1, 999, 0.9],
                            },
                            '水马': {
                                length: 1.55,
                                width: 0.55,
                                height: 0.75,
                            },
                            '防撞球': {
                                length: [0.1, 999, 0.4],
                                width: [0.1, 999, 0.4],
                                height: [0.1, 999, 0.45],
                            },
                            '地锁开': {
                                length: [0.1, 1, 0.45],
                                width: [0.1, 1, 0.2],
                                height: [0.1, 1, 0.25],
                            },
                            '隔离栏': {
                                length: 1.65,
                                width: 0.45,
                                height: 1.15,
                            },
                        }
                        if(Array.isArray(data)) {
                            for(let type in scheme) {
                                const target = data.find(item => item.name == type)
                                if(!target) continue

                                for(const whd in scheme[type]) { //长宽高
                                    const size = scheme[type][whd]
                                    if(!Array.isArray(size)) {
                                        target.toolTypeOptions[whd][2] = size
                                    } else {
                                        target.toolTypeOptions[whd] = size
                                        target.toolTypeOptions.isConstraints = true
                                        target.toolTypeOptions.isStandard = true
                                    }
                                }
                            }
                        }
                        console.log(result_parse)
                        result = JSON.stringify(result_parse)
                    }
                    return result
                },
                configurable: true,
            });
        return realOpen.apply(xhr, arguments);
    };
}


function copyToClipboard(textToCopy) {
    // navigator clipboard 需要https等安全上下文
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(textToCopy);
    } else {
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

function matchesWrapper(el, sel) {
    const parentEl = el.parentElement
    if(!parentEl) return null

    if(parentEl.matches(sel)) {
        return parentEl
    } else {
        return matchesWrapper(parentEl, sel)
    }
}

function clickTrigger(el, fn, button, moveThreshold = 0, isPreventDefault = true) {
    let movement = 0
    let allowTrigger = false
    let isRightdown = false

    el.addEventListener('mousedown', (e)=>{
        if(isPreventDefault) e.preventDefault()

        if(e.which !== button) return
        movement = 0
        isRightdown = true
        allowTrigger = true
    })
    el.addEventListener('mousemove', (e)=>{
        if(!isRightdown || (isRightdown && (movement+=(Math.sqrt(e.movementX**2 + e.movementY**2))) <= moveThreshold)) return

        allowTrigger && (allowTrigger = false)
    })
    el.addEventListener('mouseup', (e)=>{
        if(e.which !== button) return
        if(allowTrigger) fn(e)
        isRightdown = false
    })
}

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['class']}) {
    if(!target) return console.error('目标不存在')

    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
}


function setStyle() {
    [[Map, ()=> {
        const styleMap = arguments[0]
        for (const [el, styleObj] of styleMap) {
            !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
        }
    }], [Element, () => {
        const [el, styleObj] = arguments
        setStyleObj(el, styleObj)
    }], [Array, () => {
        const [els, styleObj] = arguments
        els.forEach((el) => setStyleObj(el, styleObj))
    }]].some(([O, fn]) => O.prototype.isPrototypeOf(arguments[0]) ? (fn(), true) : false)

    function setStyleObj(el, styleObj) {
        for (const attr in styleObj) {
            if (el.style[attr] !== undefined) {
                el.style[attr] = styleObj[attr]
            } else {
                //将key转为标准css属性名
                const formatAttr = attr.replace(/[A-Z]/, match => `-${match.toLowerCase()}`)
                console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
            }
        }
    }
}

function createEl(elName, options) {
    const el = document.createElement(elName)
    for(let opt in options) {
        if(opt !== 'style') {
            el[opt] = options[opt]
        } else {
            let styles = options[opt]
            setStyle(el, styles)
        }
    }
    return el
}


function $(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    const sel = String(selector).trim();

    const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
    return (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
}

function $$(selector) {
    const _this = Element.prototype.isPrototypeOf(this) ? this : document
    return Array.from(_this.querySelectorAll(selector))
}

function getParamValue(param) {
    let r
    location.href.split('?')[1].split('&').some(item => {
        const param_value = item.split('=')
        if(param_value[0] == param) {
            r = param_value[1]
            return true
        }
    })
    return r
}

function showMessage(message, config) { //type = 'default', showTime = 3000, direction
    let oldMessageWrap = document.querySelector(`.messageWrap-${config?.direction ? config.direction : 'top'}`)

    let MessageWrap
    if(!oldMessageWrap) {
        MessageWrap = document.createElement('div')
        MessageWrap.className = 'messageWrap'
        setStyle(MessageWrap, {
            position: 'absolute',
            zIndex: '9999'
        })
    } else {
        MessageWrap = oldMessageWrap
    }

    let MessageBox = document.createElement('div')
    MessageBox.innerText = message

    let closeBtn = document.createElement('div')
    closeBtn.textContent = '×'
    closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)) //关闭消息提示

    setStyle(MessageBox, {
        position: 'relative',
        minWidth: '200px',
        marginTop: '5px',
        padding: '6px 50px',
        lineHeight: '25px',
        backgroundColor: 'pink',
        textAlign: 'center',
        fontSize: '16px',
        borderRadius: '5px',
        transition: 'all 1s'
    })

    setStyle(closeBtn, {
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
        case 'top': setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'top left': setStyle(MessageWrap, {top: '1%', left: '.5%'}); break;
        case 'left': setStyle(MessageWrap, {top: '50%', left: '1%', transform: 'translateY(-50%)'}); break;
        case 'top right': setStyle(MessageWrap, {top: '1%', right: '.5%', }); break;
        case 'right': setStyle(MessageWrap, {top: '50%', right: '.5%', transform: 'translateY(-50%)'}); break;
        case 'center': setStyle(MessageWrap, {top: '20%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
        case 'bottom': setStyle(MessageWrap, {bottom: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
        case 'bottom8': setStyle(MessageWrap, {bottom: '8%', left: '50%', transform: 'translate(-50%, -50%)'}); break;
        case 'bottom left': setStyle(MessageWrap, {bottom: '1%'}); break;
        case 'bottom right': setStyle(MessageWrap, {bottom: '1%', right: '.5%'}); break;
        default: setStyle(MessageWrap, {top: '1%', left: '50%', transform: 'translateX(-50%)'}); break;
    }

    switch(config?.type) {
        case 'success': setStyle(MessageBox, {border: '1.5px solid rgb(225, 243, 216)', backgroundColor: 'rgb(240, 249, 235)', color: 'rgb(103, 194, 58)'}); break;
        case 'warning': setStyle(MessageBox, {border: '1.5px solid rgb(250, 236, 216)', backgroundColor: 'rgb(253, 246, 236)', color: 'rgb(230, 162, 60)'}); break;
        case 'error': setStyle(MessageBox, {border: '1.5px solid rgb(253, 226, 226)', backgroundColor: 'rgb(254, 240, 240)', color: 'rgb(245, 108, 108)'}); break;
        default: setStyle(MessageBox, {border: '1.5px solid rgba(202, 228, 255) ', backgroundColor: 'rgba(236, 245, 255)', color: 'rgb(64, 158, 255)'}); break;
    }

    MessageBox.appendChild(closeBtn)
    if(oldMessageWrap) {
        oldMessageWrap.appendChild(MessageBox)
    } else {
        MessageWrap.appendChild(MessageBox)
        document.body.appendChild(MessageWrap)
    }
    let ani = MessageBox.animate([{
        transform: "translate(0, -100%)" ,
        opacity: 0.3,
    },{
        transform: "translate(0, 18px)",
        opacity: 0.7,
        offset: 0.9,
    },{
        transform: "translate(0, 15px)",
        opacity: 1,
        offset: 1,
    }], {
        duration: 300,
        fill: 'forwards',
        easing: 'ease-out',
    })

    //控制消失
    let timer = setTimeout(() => {
        ani.onfinish = () => {
            MessageBox.remove()
        }
        ani.reverse()
    }, (config?.showTime || 3000))

    //鼠标悬停时不清除，离开时重新计时
    MessageBox.addEventListener('mouseenter', () => clearTimeout(timer))
    MessageBox.addEventListener('mouseleave', () => {
        timer = setTimeout(() => {
            ani.reverse()
            ani.onfinish = () => {
                MessageBox.remove()
            }
        }, (config?.showTime || 3000))
    })
}


/**
2024/12/25：
- 新增：简化属性面板

2024/12/26：
- 新增：【Tab】前进一帧，【Tab+Shift】回退一帧
- 新增：右键缩放映射图，鼠标进入映射图后滚动调整缩放比，贴边滚动切换映射图。
- 调整：总框数的显示效果
- 优化：淡化吸附地线高度提示颜色
- 优化：隐藏右键菜单
- 新增：鼠标右键关闭属性面板

2024/12/27
- 新增：切包跳转

2025/1/5
- 优化：建框完成后退出绘制状态
- 优化：【Y】键聚焦视距

2025/1/6
- 调整：数据包跳转编码

2025/1/12
- 新增：title 展示提包ID

2025/1/15
- 新增：调整三视图高度

2025/2/9
- 调整：批注列表位置
- 调整：去除账号水印
- 新增：鼠标中键拖动批注列表
- 新增：作业记录title显示任务id

2025/2/10
- 新增：重写三视图调整快捷键
- 修复：无法进入未配置 classAttributes 的数据包

2025/2/11
- 【`】切换单帧/多帧视图
- 多帧视图下翻页
- 【空格】下一帧
- 【Tab】上一帧
- 【1】小车
- 【2】SUV
- 【3】二轮
- 【4】行人
- 【5】隔离柱
- 多帧视图点击序号切帧

2025/2/12
- 新增：调整现有默认尺寸，对无默认尺寸的类型进行补充
- 修复：空格的副作用（触发任意点击过的按钮）
- 新增：关键帧标注方案默认勾选[关键帧插值]
- 新增：全局批注默认勾选[漏标]

2025/2/13
- 新增：调整映射图视角名称
- 新增：快捷批注短语

2025/2/15
- 新增：记录查看历史

2025/2/16
- 新增：全局批注的快捷短语

2025/2/17
- 修复：映射图缩放后，列表总数发生变化

2025/2/18
- 新增：实时监视3D框坐标，超出有效范围时做出提示。

2025/2/19
- 新增：当选中投影框时，自动重选为其所属的3D框。

2025/2/20
- 新增：【H】显隐3D框
- 优化：优化性能

2025/2/27
- 修复：打开对象查看历史时，选中伪3D框无法自动改选成3D框。

2025/3/5
- 新增：【R】标记脑补标签

2025/3/6
- 新增：切帧后重置标注高度
- 调整：默认标注模式【关闭】

2025/3/9
- 优化：完善事件监听拦截

2025/3/18
- 新增：切帧重置高度的开关

2025/3/25
- 新增：扩充批注短语

2025/4/2
- 新增：扩充批注短语

2025/4/7
- 新增：鼠标中键聚焦选中目标（点击点云图）
- 新增：鼠标中键显隐属性面板（点击点云图或放大的映射图）
- 优化：单帧视图和多帧视图之间的切换，导致的部分键位失效问题
- 修复：数据包初始化完成时，个体列表为空

2025/4/8
- 新增：切换新旧版本操作逻辑的开关
- 新增：隐藏三视图调整按钮（新版本操作逻辑生效）
- 新增：【R】工具栏
  - 切换标注模式切换（叠帧模式 ⇋ 关键帧插值）
  - 首尾帧切换
  - 首尾显示帧切换

2025/4/10
- 优化：类型选择的UI及交互

2025/4/13
- 新增：类型选择按钮调整为可拖拽
*/