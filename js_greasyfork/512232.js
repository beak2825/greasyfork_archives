// ==UserScript==
// @name         lzbc（Dev）
// @namespace    http://tampermonkey.net/
// @version      2024.12.19.1
// @description  try it!
// @author       You
// @match        http://39.104.65.87:8778/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=65.87
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512232/lzbc%EF%BC%88Dev%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512232/lzbc%EF%BC%88Dev%EF%BC%89.meta.js
// ==/UserScript==
window.$ = Document.prototype.$ = Element.prototype.$ = $;
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;

(function() {
    'use strict';

    window._ds = {
        job_id: getParamValue('job_id'),
        task_id: getParamValue('task_id'),
        process_id: getParamValue('process_id'),
        taskInfo: {
        },
        logAn: true,
        logKeydown: false,
        resultDir: {
            all: 0,
            all_2D: 0,
            all_3D: 0,
            list_2D: [],
            list_3D: [],
        },
        isSendTime: true,
        isDebug: true,
        baseURL: 'http://39.104.65.87:8778/api'
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
            const modeSwitch = $('.mode-switch')
            const {all, all_2D, all_3D, notManual_2D, accuracy} = _ds.resultDir

            let statisticBar = $('.statistic-bar')
            const newText = `3D：${all_3D}${'&nbsp;'.repeat(4)}2D：${all_2D}${'&nbsp;'.repeat(4)}总：${all} （${accuracy}）`
            const newTitle = notManual_2D.reduce((counter, {track_id, camera_name}, idx) => {
                return counter + `id：${track_id}\t视角：${camera_name}\n`
            }, '')
            if(!statisticBar) {
                statisticBar = createEl('div', {
                    className: 'statistic-bar',
                    innerHTML: newText,
                    title: newTitle,
                    style: {
                        marginLeft: '150px',
                        color: notManual_2D.length ? 'red' : '#ccc',
                        fontSize: '19px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        position: 'absolute',
                        left: '50%',
                    },
                    onclick: function() {
                        const {all, all_2D, all_3D} = _ds.resultDir
                        copyToClipboard(`${all_3D}\t${all_2D}\t${all}`).then(resolve => {
                            showMessage('复制成功', {type: 'success', showTime: 1000})
                        })
                    }
                })
                modeSwitch.insertAdjacentElement('afterend', statisticBar)
            } else {
                statisticBar.innerHTML = newText
                statisticBar.style.color = notManual_2D.length ? 'red' : '#ccc'
                statisticBar.title = newTitle
            }
        }
    }




    hijackWS()

    hijackXHR(function() {
        const xhr = this;
        if(xhr.responseURL == 'http://39.104.65.87:8778/api/job/annotation') statistic()
    })


    let init = {}
    let isSelShape = false
    let selType_scheme = null
    let attrScheme_switch = null
    let attrScheme_checkbox = null
    let roundCount = 1
    Obs(document.body, mrs => {
        const firstAddedNode = mrs[0].addedNodes[0]
        if(firstAddedNode?.matches?.('.ant-checkbox-wrapper') && firstAddedNode.textContent == '不贴合' ) {
            const commentDialog = $$('.ant-modal-content').find(item => item.textContent.startsWith('批注'))
            const checkboxWrap = commentDialog.$('.mb-4.relative')
            const checkboxLabels = commentDialog.$$('.ant-checkbox-group label')
            const textarea = commentDialog.$('textarea')

            commentDialog.onmousedown = function(e) {
                if(e.button !== 2 || e.target.matches?.('.phrase-btn')) return
                commentDialog.$('.ant-modal-close').click()
            }

            const quickPhraseWrap = createEl('div', {
                className: 'quickPhrase-wrap',
            })
            const scheme = {
                '方位': {
                    '←': '左边框',
                    '↑': '上边框',
                    '→': '右边框',
                    '↓': '下边框',
                    '角度': '角度',
                    '顶视': '顶视图',
                    '侧视': '侧视图',
                    '后视': '后视图',
                },
                '贴合': {
                    '收': '往里收',
                    '扩': '往外扩',
                    '上移': '整体上移',
                    '下移': '整体下移',
                    '左移': '整体左移',
                    '右移': '整体右移',
                    '↶': '逆时针旋转（左旋）',
                    '↷': '顺时针旋转（右旋）',
                    '飘空': '3D框飘空',
                    '下陷': '3D框下陷',
                    '稳定边': '贴合稳定边',
                    '地线': '检查地线',
                },
                '尺寸': {
                    '长': '长度',
                    '宽': '宽度',
                    '高': '高度',
                    '脑补': '脑补',
                },
                '类型': {
                    '6v': '6v',
                    '不给6v': '不给6v',
                    '面包': '面包车',
                    '依维柯': '依维柯',
                    '不带厢': '不带厢的货车',
                    '箱货': '厢式货车',
                    '巴士': '巴士',
                    '轿车': '轿车',
                    '皮卡': '皮卡',
                    '骑行': '骑行',
                },
                '可见': {
                    '可见': '可见',
                    '不可见': '不可见',
                },
                '遮挡': {
                    '0-30': '遮挡0-30',
                    '30-50': '遮挡30-50',
                    '>50': '遮挡>50',
                },
                '截断': {
                    '0-30': '截断0-30',
                    '30-80': '截断30-80',
                    '>80': '截断>80',
                },
                '隔离': {
                    '无隔离': '无隔离',
                    '可跨越': '可跨越隔离',
                    '不可跨越': '不可跨越隔离',
                },
                '其他': {
                    '漏标': '漏标',
                    '漏点': '漏点',
                    '没框全': '没框全',
                    '舍弃点云': '适当舍弃点云',
                },
                '补充': {
                    '前后帧检查': '前后帧检查',
                    '伪3D': '参照伪3D',
                }
            }
            const checkboxMap = {
                '不贴合': ['贴合', '方位'],
                '标签&属性错误': ['类型', '可见', '遮挡', '截断', '隔离'],
                '尺寸偏差': ['尺寸'],
                '方向错误': [],
                '多标': [],
                '其它': ['其他'],
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
                                checkboxLabels.forEach(label => {
                                    const checkbox = label.$('input')
                                    if(label.textContent === Object.keys(checkboxMap)[findIdx] && !checkbox.checked) checkbox.click()
                                })
                                if(e.button === 2) {
                                    setTimeout(() => {
                                        checkboxLabels.forEach((label, idx) => {
                                            const checkbox = label.$('input')
                                            if(label.textContent !== Object.keys(checkboxMap)[findIdx] && checkbox.checked) setTimeout(() => checkbox.click(), idx*100)
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
            quickPhraseWrap.insertAdjacentElement('afterend', commentDialog.$('.flex.items-center.justify-between.mt-4'))

        }

        mrs.forEach(mr => {
            [...mr.addedNodes].forEach(an => {
                _ds.logAn && console.log(roundCount, an)

                if(an.matches?.('.cvpc-fusion-image-view')) {
                    Obs(an, mrs => {
                        // console.log(mrs)
                        mrs.forEach(mr => {
                            [...mr.addedNodes].forEach(an => {
                                if(an.matches?.('.fusion-image-view-card')) {
                                    const imgs = $$('.fusion-image-view-card')
                                    if(['front', '后'].some((str, idx) => imgs[idx].$('.fusion-camera-name').textContent !== str)) {
                                        adjustImg()
                                    }
                                }
                            })
                        })
                    }, {childList: true, subtree: true})

                }
                if(an.firstChild?.firstChild?.matches?.('.fusion-image-view-card')) {
                    adjustImg()
                }

                if(an.matches?.('.comment-edit-dialog')) {
                    an.onmousedown = function(e) {
                        if(e.button !== 2 || e.target.matches?.('.phrase-btn')) return
                        an.$('.common-icon-button')?.click()
                    }
                }

                if(an.matches?.('.comment-edit-dialog')) {
                    const operatorBar = an.$('.comment-card__footer')
                    if(operatorBar) {
                        const tip = '前后帧检查'
                        const btn = createEl('div', {
                            className: 'phrase-btn',
                            innerText: tip,
                            style: {
                                padding: '0px 5px',
                                width: '75px',
                                height: '20px',
                                lineHeight: '20px',
                                margin: '10px 0 0 278px',
                                backgroundColor: 'rgb(136, 136, 136, .3)',
                                color: 'rgb(255, 255, 255)',
                                fontSize: '12px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                userSelect: 'none',
                            },
                            onmousedown: function (e) {
                                let textarea = an.$('textarea')
                                if(!textarea) an.$('.mr-1.comment-icon-btn').click()
                                setTimeout(() => {
                                    textarea = an.$('textarea')
                                    const value = textarea.value
                                    if(e.button === 0) {
                                        setTextAreaValue(textarea, `${value}${value ? '；' : ''}${tip}`)
                                    } else if(e.button === 2) {
                                        setTextAreaValue(textarea, `${tip}`)
                                    }
                                })
                            },
                        })
                        operatorBar.insertAdjacentElement('beforebegin', btn)
                    }
                }

                if(an.matches?.('.ant-radio-wrapper') && an.textContent === '矩形') {
                    const commentDialog = new Array(5).fill(1).reduce((res, item) => res?.parentElement, an)
                    if(commentDialog?.matches?.('.ant-modal-content')) {

                        const operatorBar = createEl('div', {
                            className: 'operator-bar',
                            style: {
                                display: 'flex',
                                margin: '-8px 0 15px 0',
                                userSelect: 'none',
                            },
                        });
                        ['可见车身', '车头', '车尾', '车轮', '人头'].forEach(tip => {
                            const btn = createEl('div', {
                                className: 'phrase-btn',
                                innerText: tip,
                                style: {
                                    padding: '0px 5px',
                                    height: '20px',
                                    lineHeight: '20px',
                                    margin: '0 5px 0 0',
                                    backgroundColor: 'rgb(136, 136, 136)',
                                    color: 'rgb(255, 255, 255)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                },
                                onmousedown: function (e) {
                                    const textarea = commentDialog.$('textarea')
                                    const value = textarea.value
                                    if(e.button === 0) {
                                        setTextAreaValue(textarea, `${value}${value ? '；' : ''}${tip}`)
                                    } else if(e.button === 2) {
                                        setTextAreaValue(textarea, `${tip}`)
                                    }
                                },
                            })
                            operatorBar.append(btn)
                        })
                        commentDialog.$('.mb-4.relative').insertAdjacentElement('afterend', operatorBar)

                    }

                }

                if(an?.matches?.('.theme-dark') && an?.textContent.startsWith('高级显示过滤')) {
                    an.onmousedown = function(e) {
                        if(e.button !== 2) return
                        const btn_scaleUp = an.$$('.mini-icon-button').find(btn => {
                            const svg = btn.$('svg')
                            if(!svg) return
                            return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg'
                        })
                        btn_scaleUp.click()
                    }

                    const operatorBar = createEl('div', {
                        className: 'operator-bar',
                        style: {
                            margin: '10px 20px 0',
                            width: '210px',
                            userSelect: 'none',
                        },
                    })
                    const scheme = [{
                        '收起': takeBack,
                        '3D框': shapeSelect_callback,
                        '主框': typeSelect_callback.bind(this, {
                            '障碍物': true,
                            '人': true,
                            '车头车尾车身': false,
                            '车轮': false,
                            '交通标识': true,
                            '静态障碍物': true,
                            '6v标注': true,
                        }),
                        '附属框': typeSelect_callback.bind(this, {
                            '障碍物': false,
                            '人': false,
                            '车头车尾车身': true,
                            '车轮': true,
                            '交通标识': false,
                            '静态障碍物': false,
                            '6v标注': true,
                        }),
                        '6v': typeSelect_callback.bind(this, {
                            '障碍物': false,
                            '人': false,
                            '车头车尾车身': false,
                            '车轮': false,
                            '交通标识': false,
                            '静态障碍物': false,
                            '6v标注': true,
                        }),
                    }, {
                        '可见': attributeSelect_callback.bind(this, '可见度_6v', '可见'),
                        '不可见': attributeSelect_callback.bind(this, '可见度_6v', '不可见'),
                    }, {
                        '遮挡0~30': attributeSelect_callback.bind(this, '遮挡', '0~30%'),
                        '遮挡30~50': attributeSelect_callback.bind(this, '遮挡', ' 30%-50%'),
                        '遮挡>50': attributeSelect_callback.bind(this, '遮挡', '超过 50%'),
                    }, {
                        '无隔离': attributeSelect_callback.bind(this, '隔离', '无隔离'),
                        '可跨越': attributeSelect_callback.bind(this, '隔离', '可跨越隔离'),
                        '不可跨越': attributeSelect_callback.bind(this, '隔离', '不可跨越隔离'),
                    }, {
                        '正常曝光': attributeSelect_callback.bind(this, '车灯曝光', '正常曝光'),
                        '过曝': attributeSelect_callback.bind(this, '车灯曝光', '过爆'),
                    }]

                    scheme.forEach(subScheme => {
                        const operatorWrap = createEl('div', {
                            className: 'operator-wrap',
                            style: {
                                display: 'flex',
                                marginBottom: '12px'
                            }
                        })
                        for(let btnName in subScheme) {
                            const btn = createEl('div', {
                                innerText: btnName,
                                style: {
                                    padding: '0px 5px',
                                    height: '20px',
                                    lineHeight: '20px',
                                    margin: '0 5px 0 0',
                                    backgroundColor: 'rgb(136, 136, 136)',
                                    color: 'rgb(255, 255, 255)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                },
                                onclick: subScheme[btnName],
                            })
                            operatorWrap.append(btn)
                        }
                        operatorBar.append(operatorWrap)
                    })
                    an.$('.handle').insertAdjacentElement('afterend', operatorBar)

                    function shapeSelect_callback() {
                        an.$$('.custom-switch').forEach(item => {
                            if(item.parentElement.parentElement.textContent == '形状筛选') {
                                if(!item.matches('.checked')) {
                                    item.click()
                                    isSelShape = true

                                } else {
                                    const typePanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('立方体'))
                                    if(typePanel) shapeSelect()

                                }
                            } else if(item.matches('.checked')){
                                item.click()
                            }
                        })
                    }

                    function typeSelect_callback(scheme) {
                        an.$$('.custom-switch').forEach(item => {
                            if(item.parentElement.parentElement.textContent == '标签筛选') {
                                if(!item.matches('.checked')) {
                                    item.click()
                                    selType_scheme = scheme

                                } else {
                                    const typePanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('障碍物'))
                                    if(typePanel) typeSelect(scheme)

                                }
                            } else if(item.matches('.checked')){
                                item.click()
                            }
                        })
                    }

                    function attributeSelect_callback(scheme_switch, scheme_checkbox) {
                        const switchNames = ['标签筛选', '属性筛选', '批注筛选', '形状筛选', '通道筛选']
                        an.$$('.custom-switch').forEach(item => {
                            const text = item.parentElement.parentElement.children[0].textContent
                            if( text == '属性筛选') {
                                if(!item.matches('.checked')) {
                                    item.click()
                                    attrScheme_switch = scheme_switch
                                    attrScheme_checkbox = scheme_checkbox

                                } else {
                                    const attrPanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('可见度'))
                                    if(attrPanel) attrSelect(scheme_switch, scheme_checkbox)
                                }
                            } else if(item.matches('.checked') && switchNames.includes(text)){
                                item.click()
                            }
                        })
                    }

                    function takeBack() {
                        an.$$('.custom-switch').forEach(item => {
                            if(item.matches('.checked')) item.click()
                        })
                    }
                }

                if(isSelShape && an?.matches?.('.MuiBox-root.css-by4vme') && an.textContent.startsWith('立方体')) {
                    shapeSelect()
                    isSelShape = false
                }
                if(selType_scheme && an?.matches?.('.MuiBox-root.css-by4vme') && an.textContent.startsWith('障碍物')) {
                    typeSelect(selType_scheme)
                    selType_scheme = null
                }
                if(attrScheme_switch && an?.matches?.('.MuiBox-root.css-by4vme') && an.textContent.startsWith('可见度')) {
                    attrSelect(attrScheme_switch, attrScheme_checkbox)
                    attrScheme_switch = void 0
                    attrScheme_checkbox = void 0
                }
                function shapeSelect() {
                    const typePanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('立方体'))
                    typePanel.$$('label').forEach(item => {
                        const checkbox = item.$('input[type="checkbox"]')
                        const text = item.textContent
                        if(text == '立方体') {
                            if(!checkbox.checked) checkbox.click()
                        } else if(checkbox.checked){
                            checkbox.click()
                        }
                    })
                }
                function typeSelect(scheme) {
                    const typePanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('障碍物'))
                    typePanel.$$('label').forEach(item => {
                        const checkbox = item.$('input[type="checkbox"]')
                        const text = item.textContent
                        const schemeKeys = Object.keys(scheme)
                        if(schemeKeys.includes(text)) {
                            if((scheme[text] && !checkbox.checked) || (!scheme[text] && checkbox.checked)) checkbox.click()
                        } else if(schemeKeys.filter(key => !scheme[key]).includes(item.parentElement.previousElementSibling.textContent) && checkbox.checked){
                            checkbox.click()
                        }

                    })
                }
                function attrSelect(scheme_switch, scheme_checkbox) {
                    const attrPanel = $$('.MuiBox-root.css-by4vme').find(item => item.textContent.startsWith('可见度'))
                    attrPanel.$$('.MuiBox-root.css-feywyu').forEach(header => {
                        const btn_swich = header.$('.custom-switch')
                        if(scheme_switch === header.textContent) {
                            header.scrollIntoView({ behavior: "smooth", block: "center"})
                            if(!btn_swich.matches('.checked')) setTimeout(() => btn_swich.click())
                        } else if(btn_swich.matches('.checked')) {
                            setTimeout(() => btn_swich.click())
                        }
                    })

                    setTimeout(() => {
                        attrPanel.$$('input[type="checkbox"]')
                        .filter(checkbox => !checkbox.disabled)
                        .forEach(checkbox => {
                            if(scheme_checkbox === checkbox.value) {
                                if(!checkbox.checked) checkbox.click()
                            } else if(checkbox.checked){
                                checkbox.click()
                            }
                        })
                    })
                }

                if(an?.matches?.('canvas[data-engine="three.js r139"]')) {
                    [an, document.body].forEach(target => {
                        target.addEventListener('mousedown', (e) => {
                            if(e.button !== 1) return
                            setTimeout(() => {
                                ['keydown', 'keyup'].some((event) => {
                                    document.body.dispatchEvent(new KeyboardEvent(event, {
                                        code: "KeyH",
                                        key: "h",
                                        keyCode: 72,
                                        bubbles: true
                                    }))
                                })
                            })
                        })
                    })
                }

                if(!init.moreTrigger) {
                    const moreTrigger = $('.bb-toolbar-item .more-trigger')
                    if(moreTrigger) {
                        moreTrigger.click()
                        init.moreTrigger = true
                    }
                }

                if(!init.popover_anno && an.textContent?.startsWith('基础工具')) {
                    an.style.opacity = '0'
                    setTimeout(()=> {an.style.opacity = null}, 2000)

                    an.$$('.float-menu-item').find(item => item.textContent.includes('障碍物 / 轿车(轿车)')).click()

                    const moreTrigger = $('.bb-toolbar-item .more-trigger')
                    moreTrigger.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}))
                    moreTrigger.click()

                    init.popover_anno = true
                }

                if(!init.btn_asideview_set) {
                    const btn_asideview_set = $$('.cvpc-fusion-image-view .cvpc-editor-window__header .common-icon-button').find(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return use.getAttribute('xlink:href') == '#gear'
                    })
                    if(btn_asideview_set) {
                        btn_asideview_set.click()
                        init.btn_asideview_set = true
                    }
                }

                if(!init.asideview_setting && an.matches?.('.ant-modal-root') && an.textContent.startsWith('设置缩放')) {
                    an.style.opacity = '0'
                    const setting = {
                        '2D滚轮缩放比例': 1.8,
                        '相机投影视距': 500,
                    }
                    an.$$('.settings-panel__block-content-item').forEach(item => {
                        Object.entries(setting).find(([k, v]) => {
                            if(item.textContent.startsWith(k)) setInputValue(item.$('.settings-panel__block input'), v)
                        })
                    })

                    an.$('button.ant-modal-close').click()
                    init.asideview_setting = true
                }

                if(!init.btn_mainview_set) {
                    const btn_mainview_set = $$('.cvpc-editor-layout__mainview .bb-panel .adv-menu-item').find(item => item.textContent.startsWith('设置'))?.$('.adv-menu-item__icon')
                    if(btn_mainview_set) {
                        btn_mainview_set.click()
                        init.btn_mainview_set = true
                    }
                }
                if(!init.mainview_setting && an.matches?.('.comment-edit-dialog') && an.textContent.startsWith('设置结果显示')) {
                    const mouseConfig = an.$$('.swiper-slide').find(item => item.textContent.startsWith('操作'))
                    const configs = mouseConfig.$$('.MuiStack-root.css-19gmnzb')
                    const dic = {
                        '3D右键拖拽速度': 100,
                        'QE旋转角度': 0.1,
                        'WASD单次移动距离': 0.01,
                    }
                    configs.forEach(item => {
                        const tit = item.$('.MuiTypography-body-sm').textContent
                        if(Object.keys(dic).includes(tit)) {
                            setInputValue(item.$('input'), dic[tit])
                        }
                    })

                    an.$$('.mini-icon-button').find(btn => {
                        const svg = btn.$('svg')
                        if(!svg) return
                        return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg'
                    })?.click()

                    init.mainview_setting = true
                }

                if(an.matches?.('.MuiBox-root')) {
                    const btn_group_break = an.$$('.common-icon-button__icon').find(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return use.getAttribute('xlink:href') == '#group-break'
                    })
                    if(btn_group_break) {
                        btn_group_break.addEventListener('click', () => {
                            requestAnimationFrame(() => {new Array(2).fill(1).forEach(() => $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click())})
                        })
                    }
                }
                if(['.cvpc-float-toolbar', '.fusion-image-view-editor__toolbar2'].some(sel => an.matches?.(sel))) {
                    ['#group-make', '#group-break'].forEach(xlink => {
                        const btn = an.$$('.common-icon-button__icon').find(btn => {
                            const use = btn.$('use')
                            if(!use) return
                            return use.getAttribute('xlink:href') == xlink
                        })
                        if(btn) {
                            btn.addEventListener('click', () => {
                                requestAnimationFrame(() => {new Array(2).fill(1).forEach(() => $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click())})
                            })
                        }
                    })
                }
                if(an.matches?.('.MuiBox-root.css-15oc3w2') && an.textContent.includes('暂停状态')) {
                    an.style.opacity = '0'
                    _ds.isSendTime = false
                    an.addEventListener('mousemove', function() {
                        an.$('button').click()
                        _ds.isSendTime = true

                    })
                }
                if(an.matches?.('.comment-edit-dialog') && an.textContent.startsWith('编辑')) {
                    clickTrigger(an, (e) => {
                        const btn_scaleDown = an.$$('.mini-icon-button').find(btn => {
                            const svg = btn.$('svg')
                            if(!svg) return
                            return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg'
                        })
                        btn_scaleDown.click()
                    }, 3, 0)

                    const operatorWrap = createEl('div', {})
                    const scheme = [
                        [
                            ['障碍物 / 轿车', '轿车'],
                            ['障碍物 / 皮卡&面包车', '面包'],
                            ['障碍物 / 巴士', '巴士'],
                            ['障碍物 / 厢式货车', '箱货'],
                            ['障碍物 / 不带车厢货车', '不带箱'],
                            ['障碍物 / 依维柯', '依'],
                            ['障碍物 / 摩托&电动车', '二轮'],
                            ['障碍物 / 自行车', '自行'],
                            ['障碍物 / 电动三轮车', '三轮'],
                            ['障碍物 / 忽略框', '忽略'],
                        ],
                        [
                            ['人 / 行人', '行人'],
                            ['人 / 人头', '人头'],
                            ['人 / 骑电动&摩托车的人', '二轮骑行'],
                            ['人 / 骑三轮车的人', '三轮骑行'],
                            ['人 / 骑自行车的人', '自行车骑行'],
                        ],
                        [
                            ['6v标注 / 轿车', '轿'],
                            ['6v标注 / 客车', '客'],
                            ['6v标注 / 货车', '货'],
                            ['6v标注 / 人力两轮车（无人骑行））', '人力二轮'],
                            ['6v标注 / 非人力两轮车（无人骑行）', '非人力二轮'],
                            ['6v标注 / 三轮车', '三轮'],
                            ['6v标注 / 行人', '行人'],
                            ['6v标注 / 骑行的人', '骑行'],
                        ],
                        [
                            ['车头车尾车身 / 车头', '车头'],
                            ['车头车尾车身 / 车尾', '车尾'],
                            ['车头车尾车身 / 可见车身', '可见车身'],
                            ['车轮 / 前车轮', '前轮'],
                            ['车轮 / 后车轮', '后轮'],
                            ['车轮 / 中轮', '中轮'],
                        ],
                        [
                            ['交通标识 / 标识牌', '标识牌'],
                            ['交通标识 / 交通灯', '交通灯'],
                            ['交通标识 / 斑马线', '斑马线'],
                            ['交通标识 / 路面箭头', '箭头'],
                            ['交通标识 / 路面限速字符', '限速字符'],
                        ],
                        [
                            ['静态障碍物 / 锥桶', '锥桶'],
                            ['静态障碍物 / 交通柱', '交通柱'],
                            ['静态障碍物 / 防撞桶', '防撞桶'],
                            ['静态障碍物 / 水马/隔离墩', '水马'],
                        ],
                    ]
                    scheme.forEach((group, idx) => {
                        const groupWrap = createEl('div', {
                            style: {
                                display: 'flex',
                            }
                        })

                        group.forEach(([type, text]) => {
                            const btn = createEl('div', {
                                style: {
                                    padding: '0px 5px',
                                    height: '20px',
                                    lineHeight: '20px',
                                    margin: '0 5px 0 0',
                                    backgroundColor: 'rgb(136, 136, 136)',
                                    color: 'rgb(255, 255, 255)',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                },
                                innerText: text,
                                onclick: function() {
                                    an.$$('.ant-select-selector')[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
                                    selectType(type)
                                },
                            })
                            groupWrap.append(btn)
                        })
                        operatorWrap.append(groupWrap)
                    })
                    an.$('.MuiGrid-root.MuiGrid-container').insertAdjacentElement('afterend', operatorWrap)


                    function selectType(type) {
                        const selectorWrap = $('.ant-select-dropdown')
                        if(!selectorWrap) return setTimeout(() => selectType(type));

                        const menu = selectorWrap.getElementsByClassName('ant-cascader-menu')
                        const [e1, tit_l1, tit_l2] = /(.*) \/ (.*)/.exec(type)
                        menu[0]?.$(`li[title="${tit_l1}"]`)?.click() //一级

                        const target = menu[1]?.$(`li[title="${tit_l2}"]`)
                        if(!target) return (setTimeout(() => selectType(type)), true)
                        target.click()
                    }
                }
                if(an.firstChild?.matches?.('.ant-tooltip')) {
                     ['点云3D结果', '2D结果'].some(text => an.textContent.startsWith(text)) && (an.style.display = 'none')
                }
                if(an.matches?.('.MuiStack-root.css-1afers6')) {
                    const checkbox = createEl('input', {
                        type: 'checkbox',
                        checked: localStorage.getItem('select_auto') === 'true',
                        oninput: function () {
                            localStorage.setItem('select_auto', this.checked)
                        },
                        style: {
                            marginLeft: '6px',
                        }
                    })
                    const attrWrap = $$('.MuiStack-root.css-19gmnzb').find(attrWrap => attrWrap.textContent.startsWith('可见度_6v'))
                    attrWrap?.$('.MuiStack-root.css-j33zza').append(checkbox)

                    if(attrWrap?.$$('input[type="radio"]').every(input => !input.checked) && checkbox.checked) {
                        attrWrap.$('input[value="可见"]').click()
                        const row = attrWrap.$('.MuiBox-root.css-0')
                        row.style.background = 'rgba(82, 106, 255, .6)'
                    }
                }
                if(!init.header && $('.cvpc-editor-layout__header')) {
                    statistic()
                    taskInfo().then(res => {
                        let isHoverBtn = false

                        const shareWrap = createEl('div', {
                            className: 'share-wrap',
                            style: {
                                overflow: 'hidden',
                                position: 'absolute',
                                display: 'flex',
                                height: '19px',
                                borderRadius: '9.5px',
                                position: 'absolute',
                                left: '610px',
                                color: '#fff',
                            },
                            onmouseenter: function() {
                                const redirectInput = $('.redirect-input')
                                redirectInput.style.width = '70px'
                                redirectInput.focus()
                            },
                        })

                        const redirect_input = createEl('input', {
                            className: 'redirect-input',
                            style: {
                                width: '0',
                                padding: '0',
                                color: '#333',
                                fontSize: '12px',
                                outline: 'none',
                                border: 'none',
                                textIndent: '8px',
                                transition: '.3s',
                            },
                            onblur: function() {
                                if(!isHoverBtn) {
                                    $('.redirect-input').style.width = 0
                                }
                            },
                            onmouseenter: function() {
                                this.focus()
                            },
                        })
                        const btn_redirect = createEl('div', {
                            className: 'redirect-btn',
                            innerText: '切换',
                            style: {
                                padding: '0 5px',
                                height: '19px',
                                lineHeight: '19px',
                                backgroundColor: '#888',
                                color: '#fff',
                                fontSize: '12px',
                                cursor: 'pointer',
                            },
                            onmouseenter: function() {
                                isHoverBtn = true
                            },
                            onmouseleave: function() {
                                isHoverBtn = false
                                if(!document.activeElement?.matches('.redirect-input')) {
                                    $('.redirect-input').style.width = 0
                                }
                            },
                            onclick: function() {
                                $('.redirect-input').focus()

                                const inputVal = $('.redirect-input').value
                                const inputVal_split = inputVal.split('\t')
                                if(inputVal_split.length !== 2) {
                                    return showMessage('内容不合法', {type: 'warning'})
                                } else {
                                    const [href, userInfo] = inputVal_split
                                    try {
                                        if(JSON.parse(userInfo)) {
                                            localStorage.setItem('cvpc-user-info', userInfo)
                                            location.href = href
                                        }
                                    } catch(e) {
                                        return showMessage('内容不合法', {type: 'warning'})
                                    }
                                }
                            }
                        })
                        shareWrap.append(redirect_input, btn_redirect)
                        $('.cvpc-editor-layout__header .mode-switch').insertAdjacentElement('beforebegin', shareWrap)
                    })
                    init.header = true
                }
                if(!init.viewCard && $('.fusion-image-view-card')) {
                    const allCard = $$('.fusion-image-view-card')
                    allCard.forEach(card => {
                        card.onmousedown = function(e) {
                            if(e.button !== 2) return
                            const btn_scaleUp = card.$$('.mini-icon-button').find(btn => {
                                const use = btn.$('use')
                                if(!use) return
                                return use.getAttribute('xlink:href') == '#scale-up'
                            })
                            btn_scaleUp.click()
                        }
                    })
                    init.viewCard = true
                }
                if(an.matches?.('.bb-flex-modal-anchor')) {
                    clickTrigger(an, (e) => {
                        const btn_scaleDown = an.$$('.mini-icon-button').find(btn => {
                            const use = btn.$('use')
                            if(!use) return
                            return use.getAttribute('xlink:href') == '#scale-down'
                        })
                        btn_scaleDown.click()
                    }, 3, 0)
                }
                const btn_menu = $('.szh-menu-button.w-full')
                if(!init.btn_menu && btn_menu) {
                    console.log(btn_menu)
                    btn_menu.click()
                    init.btn_menu = true
                }
                const szh_menu = $('.szh-menu')
                if(!init.szh_menu && szh_menu) { //分组菜单
                    szh_menu.$$('.ant-radio-wrapper').find(radio => radio.textContent.includes('按组')).click()
                    szh_menu.style.display = 'none'
                    init.szh_menu = true
                }

                function getIconBtn(xlink) {
                    return $$('.mini-icon-button').filter(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return use.getAttribute('xlink:href') == xlink
                    })
                }
            });

            [...mr.removedNodes].forEach(rn => {
                if(rn.matches?.('.MuiBox-root.css-15oc3w2') && rn.textContent.includes('暂停状态') && !_ds.isDebug) _ds.isSendTime = true
            })
        })

        ++roundCount
    })

    function adjustImg() {
        const imgs = document.getElementsByClassName('fusion-image-view-card');
        ['front', '后'].forEach((direction, idx) => {
            [...imgs].some(img => {
                if(img.$('.fusion-camera-name').textContent === direction) {
                    imgs[idx].insertAdjacentElement('beforebegin', img)
                    return true
                }
            });
        })
    }

    document.body.addEventListener('keydown', (e) => {
        const {keyCode} = e
        _ds.logKeydown && console.log(keyCode, e)

        const isInput = ['input', 'textarea'].find(sel => {
            const activeEl = document.activeElement
            if(!activeEl?.matches(sel)) return
            if(sel == 'input' && activeEl.type !== 'text') return false
            return true
        })
        if(isInput) return

        const kcMap_display2D = {
            51: 0,
            52: 1,
        }
        let map = [
            [
                () => keyCode == 67 && ( e.altKey || (e.shiftKey && !e.ctrlKey)),
                () => {
                    ['keydown', 'keyup'].forEach((event) => {
                        document.body.dispatchEvent(new KeyboardEvent(event, {
                            code: "KeyC",
                            key: "c",
                            keyCode: 67,
                            ctrlKey: event == 'keydown',
                            bubbles: true
                        }))
                    });
                    setTimeout(() => {
                        ['keydown', 'keyup'].forEach((event) => {
                            document.body.dispatchEvent(new KeyboardEvent(event, {
                                code: "KeyV",
                                key: "v",
                                keyCode: 86,
                                ctrlKey: event == 'keydown',
                                bubbles: true
                            }))
                        })
                    })
                    showMessage('触发复制粘贴')
                }
            ],
            [
                () => keyCode == 9,
                (e) => {
                    e.preventDefault();

                    const modal2D = $('.bb-flex-modal-anchor .bb-flex-modal-wrapper')
                    const box_fake = modal2D.$$('.mini-icon-button').find(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return use.getAttribute('xlink:href') == '#box'
                    })
                    box_fake?.click()
                },
            ],
            [
                () => keyCode == 71,
                () => {
                    const grouping = $$('.common-icon-button__icon').find(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return use.getAttribute('xlink:href') == '#group-make'
                    })
                    if(!grouping) return
                    grouping.click()
                    showMessage('触发编组')
                    new Array(2).fill(1).forEach(() => $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click())
                }
            ],
            [

                () => keyCode == 49,
                () => {
                    ['keydown', 'keyup'].forEach((event) => {
                        document.body.dispatchEvent(new KeyboardEvent(event, {
                            code: "ArrowLeft",
                            key: "ArrowLeft",
                            keyCode: 37,
                            bubbles: true
                        }))
                    })
                }
            ],
            [
                () => keyCode == 50,
                () => {
                    ['keydown', 'keyup'].forEach((event) => {
                        document.body.dispatchEvent(new KeyboardEvent(event, {
                            code: "ArrowRight",
                            key: "ArrowRight",
                            keyCode: 39,
                            bubbles: true
                        }))
                    })

                }
            ],
            [
                () => Object.keys(kcMap_display2D).some((kc) => keyCode == kc),
                () => {
                    const btn_scale_all = $$('.mini-icon-button').filter(btn => {
                        const use = btn.$('use')
                        if(!use) return
                        return ['#scale-up', '#scale-down'].some(attr => use.getAttribute('xlink:href') == attr)
                    })
                    btn_scale_all[kcMap_display2D[keyCode]].click()
                }
            ]
        ]
        map.forEach((item) => { item[0]() && item[1](e) })
    })


    async function taskInfo() {
        let {job_id, task_id, process_id} = _ds
        return fetch(`http://39.104.65.87:8778/api/job/top_detail?job_id=${job_id}&task_id=${task_id}&process_id=${process_id}`, {
            "headers": {
                "authorization": `${localStorage.getItem('cvpc-editor-token')}`,
            },
            "body": null,
            "mode": "cors",
            "credentials": "include"
        })
        .then(res => res.json())
        .then(res => {
            try {
                const {task_name, task_id, job_index} = res
                const taskInfoBar = createEl('div', {
                    className: 'taskInfo-bar',
                    innerHTML: `${task_name}${'&nbsp;'.repeat(2)}${task_id}-${job_index}`,
                    style: {
                        position: 'absolute',
                        left: '400px',
                        fontSize: '12px',
                        color: '#fff',
                        cursor: 'pointer',
                    },
                    onclick: function() {
                        copyToClipboard(`${location.href}\t${localStorage.getItem('cvpc-user-info')}`)
                        showMessage('复制成功', {type: 'success'})
                    }
                })
                $('.cvpc-editor-layout__header .bb-panel').insertAdjacentElement('afterend', taskInfoBar)
            } catch(e) {
                console.err('request error')
            }
        })
    }

    async function statistic() {
        let {job_id, task_id, process_id} = _ds
        return fetch(`${_ds.baseURL}/ann_statistics/postil_detail?job_id=${job_id}&task_id=${task_id}&process_id=${process_id}`, {
            "headers": {
                "authorization": `${localStorage.getItem('cvpc-editor-token')}`,
            },
            "body": null,
            "mode": "cors",
            "credentials": "include"
        })
        .then(res => res.json())
        .then(res => {
            let resultDir = {
                all: 0,
                all_real: 0,
                all_2D: 0,
                all_2D_real: 0,
                all_3D: 0,
                list_2D: [],
                list_3D: [],
            }
            resultDir.all = resultDir.all_real = res[1][3]

            res.forEach(item => {
                const type = item[1]
                const count = item[3]
                type == '2D' ? (resultDir.all_2D+=count, resultDir.all_2D_real+=count, resultDir.list_2D.push(count)) :
                type == '3D' ? (resultDir.all_3D+=count, resultDir.list_3D.push(count)) : void 0
            })

            _ds.resultDir_draft = resultDir
        })
        .then(res => {
            return fetch(`http://39.104.65.87:8778/api/job/annotation?job_id=${job_id}&task_id=${task_id}&process_id=${process_id}`, {
                "headers": {
                    "authorization": `${localStorage.getItem('cvpc-editor-token')}`,
                },
                "mode": "cors",
                "credentials": "include"
            }).then(res => res.json())
                .then(res => {
                if(!Array.isArray(res)) return

                const data_parse = res
                .filter(item => item.type == '2D')
                .filter(item => {
                    const {width, height} = JSON.parse(item.shape_data)
                    if(width == 0 && height == 0) return
                    return item
                })

                console.log('data_parse', data_parse)

                let o = {
                    front: [],
                    后: [],
                    not_value: []
                }
                data_parse.forEach(item => {
                    let camera_name = item.camera_name
                    if(camera_name) {
                        if(o[camera_name]) {
                            o[camera_name].push(item)
                        } else {
                            o[camera_name] = [item]
                        }
                    } else {
                        o.not_value.push(item)
                    }
                })

                const all_valid_camera = [...o.front, ...o['后']]
                // console.log('all_valid_camera', all_valid_camera)

                const not_6v = all_valid_camera.filter(item => {
                    return item.label2[0].unique_id !== 'WVYXbf4Ilf23GGSv9Lw5J' //6v
                })
                const notManual_2D = not_6v.filter(item => {
                    return !JSON.parse(item.shape_data)._isManual
                })
                console.log('not_6v', not_6v)

                const resultDir = _ds.resultDir_draft
                resultDir.all_2D_not6v = not_6v.length
                resultDir.all_2D = not_6v.length
                resultDir.all = resultDir.all_3D + resultDir.all_2D_not6v
                resultDir.loss_2D = ((resultDir.all_2D_real - not_6v.length) / resultDir.all_2D_real).toFixed(2)
                resultDir.notManual_2D = notManual_2D

                // console.log(_ds.resultDir)
            })
        }).then(res => {
            fetch(`${_ds.baseURL}/postil/lists?job_id=${job_id}&task_id=${task_id}&process_id=${process_id}`, {
                "headers": {
                    "authorization": `${localStorage.getItem('cvpc-editor-token')}`,
                },
            })
            .then(res => res.json())
            .then(res => {
                const mistakeList = res.data

                _ds.resultDir_draft.mistakeList = mistakeList
                _ds.resultDir_draft.accuracy = ((_ds.resultDir_draft.all - mistakeList.length) / _ds.resultDir_draft.all * 100).toFixed(2) + '%'
                _ds.resultDir = _ds.resultDir_draft
            })
        })
    }
})();

function Obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
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
}

function hijackWS() {
    const OriginalWebSocket = WebSocket;
    window.WebSocket = function (url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener('open', function (event) {
            console.log('WebSocket opened:', event);
        });

        const originalOnMessage = ws.onmessage;
        ws.onmessage = function (event) {
            originalOnMessage.call(ws, event);
        };

        const originalSend = ws.send;
        ws.send = function (data) {
            const data_parse = JSON.parse(data)
            if(url === 'ws://39.104.65.87:8778/api/msg/ws' && data_parse.event_type === 'report_working_time' && !window._ds.isSendTime) return

            originalSend.call(ws, JSON.stringify(data_parse));
        };

        ws.addEventListener('close', function (event) {
            console.log('WebSocket closed:', event);
        });

        ws.addEventListener('error', function (event) {
            console.log('WebSocket error:', event);
        });

        return ws;
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

function clickTrigger(el, fn, button, moveThreshold = 0) {
    let movement = 0
    let allowTrigger = false
    let isRightdown = false

    el.addEventListener('mousedown', (e)=>{
        e.preventDefault()
        if(['.svg-line.svg-face-fill', '.fusion-shape-drag-face'].some((sel) => e.target.matches(sel))) return
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
/**
2024/10/11:
- 新增：初始化设置展示方式为【按组展示】
- 新增：统计结果，点击复制结果
- 新增：【1】后退1帧
- 新增：【2】前进1帧
- 新增：【4】显隐 2D窗口-第1帧
- 新增：【5】显隐 2D窗口-第2帧
- 新增：鼠标右键 打开/关闭 2D窗口

2024/10/12:
- 新增：右键关闭属性面板
- 修复：快捷键切帧引起的ctrl切帧问题

2024/10/13：
- 新增：【G】编组
- 新增：点击编组/取消编组，更新个体列表
- 新增：去除暂停。
- 修复：点击复制的框数与当前更新的框数不一致。
- 新增：可见属性为空时，自动勾选【可见】。

2024/10/14：
- 修复：设置项无法修改的问题。
- 新增：自定义配置 自动勾选【可见】
- 修复：输入模式下触发快捷键

2024/10/17：
- 修复：输入模式下触发快捷键

2024/10/22:
- 新增：初始化配置（2D滚轮缩放比、3D拖拽速度、三视图角度旋转、三视图移动距离）

2024/10/25：
- 调整：框数统计方式（除掉前后视角以外的框+前后视角的 6v 2D框）

2024/11/6：
- 新增：初始化配置新增【相机投影视距】的配置

2024/11/8：
- 新增：展示任务信息
- 新增：链接跳转

2024/11/10
- 完善：链接跳转
- 调整：暂停提示隐藏逻辑
- 修复：平台显示暂停时依旧计时的问题

2024/11/12
- 新增：在2D图窗口中鼠标中键 开启/关闭 独显

2024/11/22
- 新增：【Tab】显隐伪3D框
- 新增：【Alt C】或【Shift C】触发复制粘贴

2024/11/25
- 新增：统计识别未调整的2D框
- 修复：鼠标中键点云图不触发独显的问题

2024/11/26
- 新增：筛选按钮组

2024/11/27
- 新增：鼠标右键关闭筛选对话框
- 新增：批注面板加入快捷短语

2024/12/6
- 修复：暂停提示关闭后没有恢复计时
- 新增：批注面板快捷语句
- 新增：鼠标右键关闭批注面板

2024/12/9
- 新增：正确率统计
- 新增：鼠标右键关闭[批注追加编辑面板]
- 新增：[批注追加编辑面板]新增快捷语
- 新增：2D框漏标批注面板新增快捷语

2024/12/18
- 新增：锁定前视图和后视图的位置

2024/12/19
- 新增：个体属性面板新增 标注类型按钮组
*/