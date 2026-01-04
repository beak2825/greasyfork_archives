// ==UserScript==
// @name         loudong-任务列表
// @namespace    http://tampermonkey.net/
// @version      2024.6.4.1
// @description  try it!
// @author       You
// @match        https://out-test-data-task.jd.com/*
// @match        https://out-data-task.jd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495774/loudong-%E4%BB%BB%E5%8A%A1%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/495774/loudong-%E4%BB%BB%E5%8A%A1%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

window.$ = Document.prototype.$ = Element.prototype.$ = $
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$
const {TMap} = window
history.pushState = _pushState();

const script = document.createElement('script')
script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&libraries=geometry'
document.body.append(script);

let _ds = {
    data: [],
    map: null,
    preview_idx: -1,
    last_preview_idx: -1,
    next_preview_idx: -1,
    isPageUpdate: true,
}
window._ds = _ds

initMapPreviewPanel()

obs(document, mrs=> {
    // console.log('=======', mrs)
    mrs.forEach(mr => {
        Array.from(mr.addedNodes, an => {
            // console.log('%ccontentsBody', 'color: red;', an)
            if(an.matches?.('.el-table__body-wrapper .el-table__row') && location.hash == '#/taskList') {
                const idTd = an.$('td')
                idTd.style.color = idTd.textContent == _ds.data[_ds.preview_idx]?.id ? '#409eff' : null

                an.onmousedown = (e) => {
                    if(e.button !== 1) return
                    e.preventDefault()

                    const tableHead_id_idx = $$('.el-table__header-wrapper th:not(.gutter)').findIndex(th => th.textContent === '任务ID')
                    const tableHead_state_idx = $$('.el-table__header-wrapper th:not(.gutter)').findIndex(th => th.textContent === '任务状态')
                    const taskId = an.$$('td')[tableHead_id_idx].textContent.trim()
                    const taskState = an.$$('td')[tableHead_state_idx].textContent.trim()

                    const termination = [[
                        ()=> taskState !== '已创建',
                        ()=> showMessage('任务状态不为【已创建】', {type: 'warning'})
                    ], [
                        ()=> !_ds.data.find(item => item.id == taskId).geomwkt,
                        ()=> showMessage(`${taskId} 无坐标信息，已跳过`)
                    ]]
                    const r = termination.some(item => {
                        return item[0]() ? (item[1](), true) : false
                    })
                    if(r) return

                    _ds.preview_idx = _ds.data.findIndex(item => item.id == taskId)
                    const curItem = _ds.data[_ds.preview_idx]
                    _ds.isPageUpdate = false

                    $('.panel-title').textContent = `${curItem.id}（${curItem.taskName}）`

                    $('.map-preview-panel').style.display = 'block'

                    initMap(curItem.geomwkt)
                    idTip()

                    let mask = $('.mask')
                    if(mask) {
                        mask.style.cursor = 'no-drop'
                    } else {
                        const pagination = $('.el-footer .el-pagination')
                        mask = document.createElement('div')
                        mask.className = 'mask'
                        setStyle(new Map([
                            [pagination, {
                                position: 'relative'
                            }],
                            [mask, {
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                cursor: 'no-drop',
                            }],
                        ]))

                        pagination.append(mask)
                    }
                    // console.log(path)

                }
            }
        })
    })
})


document.addEventListener('keyup', (e)=> {
    if(['input', 'textarea'].find(lab => document.activeElement?.matches(lab))) return
    const {keyCode} = e

    const previewMap = {
        87: '.mode-change',
        65: '.btn-lastItem',
        68: '.btn-nextItem',
        83: '.dialog-close-btn'
    }

    if(Object.keys(previewMap).includes(`${keyCode}`) && $('.map-preview-panel').style.display !== 'none') {
        $(previewMap[keyCode])?.click()
    }
})

function idTip() {
    $$('.el-table__body-wrapper .el-table__row').forEach(row => {
        const idTd = row.$('td')
        idTd.style.color = idTd.textContent == _ds.data[_ds.preview_idx].id ? '#409eff' : null

    })

}


function initMap(coordStr) {
    let execCoordStr = /POLYGON \(\(\((.*)\)\)\)/.exec(coordStr)
    if(execCoordStr === null) execCoordStr = /POLYGON \(\((.*)\)\)/.exec(coordStr)
    let coordArr = execCoordStr[1].split(', ')

    const path = []
    coordArr.forEach(coord => {
        const [longitude, latitude] = coord.split(' ')
        path.push(new TMap.LatLng(latitude, longitude))
    }, '')
    // console.log(path)

     _ds.map?.destroy();
    _ds.map = new TMap.Map('tmap-container', {
        center: TMap.geometry.computeCentroid(path), //计算中心
        zoom: 18,
        baseMap: {
            type: 'vector',
            features: ['base', 'building3d', 'label', 'point'],
        }
    });

    let polygon = new TMap.MultiPolygon({
        id: 'polygon-layer',
        map: _ds.map,
        styles: {
            'polygon': new TMap.PolygonStyle({
                'color': 'rgba(255,255,255,0)',
                'showBorder': true,
                'borderColor': 'rgb(255,0,0)',
                'borderWidth': 3
            }),
        },
        geometries: [
            {
                id: 'polygon',
                paths: path,
                styleId: 'polygon',
            }
        ]
    });
}

function initMapPreviewPanel() {
    const countPanel = document.createElement('div')
    const header = document.createElement('div')
    const title = document.createElement('div')
    const closeBtn = document.createElement('div')
    const container = document.createElement('div')
    const footer = document.createElement('div')
    const btn_nextItem = document.createElement('div')
    const btn_previousItem = document.createElement('div')
    const btn_enter = document.createElement('div')
    const btn_modeChange = document.createElement('div')
    const tip = document.createElement('div')

    countPanel.className = 'map-preview-panel'
    btn_previousItem.className = 'btn-lastItem'
    btn_nextItem.className = 'btn-nextItem'
    btn_modeChange.className = 'mode-change'
    closeBtn.className = 'dialog-close-btn'
    container.id = 'tmap-container'
    closeBtn.textContent = '×'
    title.className = 'panel-title'
    title.textContent = 'Tips（提示）'
    btn_previousItem.textContent = '上一项(A)'
    btn_nextItem.textContent = '下一项(D)'
    btn_enter.textContent = '去作业'
    btn_modeChange.textContent = '底图切换(W)'
    tip.textContent = '提示：【S】关闭，【鼠标中键】拖动'

    setStyle(new Map([
        [countPanel, {
            display: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px 15px',
            background: 'rgb(34, 34, 37, .8)',
            textAlign: 'center',
            borderRadius: '5px',
            zIndex: 999,
        }],[header, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '8px',
        }],
        [title, {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '550px',
            fontSize: '22px',
            cursor: 'default',
            color: '#fff',
        }],
        [closeBtn, {
            width: '25px',
            height: '25px',
            lineHeight: '21px',
            borderRadius: '5px',
            // background: 'gray',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '28px',
            color: '#ccc',
        }],
        [container, {
            position: 'relative',
            marginTop: '15px',
            width: '1100px',
            height: '650px',
            //  width: '600px',
            // height: '300px',
            userSelect: 'none',
        }],
        [footer, {
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            width: '100%',
            height: '40px',
            marginTop: '10px',
        }],
        [[btn_modeChange, btn_nextItem, btn_previousItem, btn_enter], {
            width: '70px',
            height: '30px',
            lineHeight: '30px',
            marginLeft: '5px',
            background: '#eee',
            fontSize: '14px',
            borderRadius: '5px',
            textAlign: 'center',
            pointerEvents: 'auto',
            cursor: 'pointer',
            userSelect: 'none',
        }],
        [btn_modeChange,{
            width: '90px'
        }],
        [tip, {
            fontSize: '12px',
            color: '#eee',
            margin: '10px 580px 0 0',
            userSelect: 'none',
        }]
    ]))

    closeBtn.onclick = () => {
        if(_ds.isOpenCountPanel) return
        _ds.isOpenCountPanel = false
        countPanel.style.display = 'none'
        $('.mask').remove()
    }

    btn_previousItem.onclick = ()=> {
        if(_ds.isPageTurning) return showMessage('数据加载中，请稍等...')

        const curItem = _ds.data[_ds.preview_idx]
        if(!_ds.isPageUpdate) {
            const lastItem = _ds.data.slice(0, _ds.preview_idx).reverse().find(item => {
                if(item.taskStatusName !== '已创建') return
                if(!item.geomwkt) return showMessage(`${item.id} 无坐标信息，已跳过`)
                return true
            })
            if(!lastItem) {
                 if($('.el-pager .number.active').textContent === $$('.el-pager .number').at(0).textContent && _ds.preview_idx == 0) return showMessage('已到达首页')
                 if($('.el-pager .number.active').textContent !== $$('.el-pager .number').at(0).textContent) {
                      $('.btn-prev').click()//翻页
                     _ds.isPageTurning = _ds.isTurnLastPreview = true
                     return
                 }
                return
             }
            initMap(lastItem.geomwkt)

            _ds.preview_idx = _ds.data.findIndex(item => item == lastItem);
             $('.panel-title').textContent = `${lastItem.id}（${lastItem.taskName}）`
            idTip()
        }
    }
    btn_nextItem.onclick = ()=> {
        if(_ds.isPageTurning) return showMessage('数据加载中，请稍等...')

         const curItem = _ds.data[_ds.preview_idx]
         if(!_ds.isPageUpdate) {
             const nextItem = _ds.data.slice(_ds.preview_idx+1).find(item => {
                if(item.taskStatusName !== '已创建') return
                if(!item.geomwkt) return showMessage(`${item.id} 无坐标信息，已跳过`)
                 return true
            })
             if(!nextItem) {
                 if($('.el-pager .number.active').textContent === $$('.el-pager .number').at(-1).textContent && _ds.preview_idx == _ds.data.lenth-1) return showMessage('已到达末尾页')
                 if($('.el-pager .number.active').textContent !== $$('.el-pager .number').at(-1).textContent) {
                     $('.btn-next').click()//翻页
                     _ds.isPageTurning = _ds.isTurnNextPreview = true
                     return
                 }
                 return //当前处于末尾页，非末尾列，后面的项为已创建但无坐标信息，此时不渲染
             }

             initMap(nextItem.geomwkt)

             _ds.preview_idx = _ds.data.findIndex(item => item == nextItem);
             $('.panel-title').textContent = `${nextItem.id}（${nextItem.taskName}）`
             idTip()
         }
    }

    btn_enter.onclick = ()=> {
        const tableHead_id_idx = $$('.el-table__header-wrapper th:not(.gutter)').findIndex(th => th.textContent === '任务ID')
        const tableHead_operate_idx = $$('.el-table__header-wrapper th:not(.gutter)').findIndex(th => th.textContent === '操作')

        const curRow = $$('.el-table__body-wrapper .el-table__row').find(item => {
            const id = item.$$('td')[tableHead_id_idx].textContent.trim()
            return Number(id) == _ds.data[_ds.preview_idx].id
        })

        if(confirm('确认领取？')) curRow.$$('button').find(btn => btn.textContent == '去作业').click()
    }

    btn_modeChange.onclick = () => {
        const baseType = _ds.map.getBaseMap().type == 'vector' ? 'satellite' : 'vector'
        _ds.map.setBaseMap({type: baseType})
    }

    let isMousedown = false
    let top = 0
    let left = 0
    countPanel.addEventListener('mousedown', e => {
        if(e.button == 1) (e.preventDefault(), isMousedown = true)
    })
    document.addEventListener('mousemove', (e)=> {
        if(!isMousedown) return

        top += e.movementY
        left += e.movementX
        countPanel.style.top = `calc(50% + ${top}px)`
        countPanel.style.left = `calc(50% + ${left}px)`
    })
    document.addEventListener('mouseup', ()=> {
        isMousedown = false
    })

    header.append(title, closeBtn)
    footer.append(tip, btn_modeChange, btn_previousItem, btn_nextItem, btn_enter)
    countPanel.append(header, container, footer)
    document.body.appendChild(countPanel)
}


hijackXHR(function() {
    const xhr = this
    // console.log(xhr.responseURL)
    const isMatch = ['https://test-data-task.jd.com/inner/project/task/get_list', 'https://data-task-online-n.jd.com/inner/project/task/get_list'].some(url => new RegExp(url).test(xhr.responseURL))
    if(!isMatch) return
    // if((!/^https:\/\/map-work-online.jd.com\/inner\/data\/get_work_list\?taskId=.*/.test(xhr.responseURL)) && (!/^https:\/\/map-work.jd.com\/inner\/data\/get_work_list\?taskId=.*/.test(xhr.responseURL))) return

    try {
        const data = JSON.parse(xhr.responseText)
        if(data.message !== `成功`) return

        console.log(data)
        data.result && (_ds.data = data.result)
        _ds.last_preview_idx = _ds.next_preview_idx = -1
        _ds.isPageUpdate = true
        _ds.isPageTurning = false

        $$('.el-table__body-wrapper .el-table__row').forEach(row => (row.$('td').style.color = null))

        if(_ds.isTurnNextPreview || _ds.isTurnLastPreview){ //翻页查找
            const data = _ds.isTurnNextPreview ? _ds.data : _ds.data.toReversed()
            const idx = data.findIndex(item => {
                if(item.taskStatusName !== '已创建') return
                if(!item.geomwkt) return showMessage(`${item.id} 无坐标信息，已跳过`)
                return true
            })
            if(idx !== -1) {
                initMap(data[idx].geomwkt)
                idTip()

                _ds.preview_idx = _ds.data.findIndex(item => item === data[idx])

                const curItem = _ds.data[_ds.preview_idx]
                $('.panel-title').textContent = `${curItem.id}（${curItem.taskName}）`

                _ds.isTurnNextPreview && (_ds.isTurnNextPreview = false) //用于递归
                _ds.isTurnLastPreview && (_ds.isTurnLastPreview = false)
                _ds.isPageUpdate = false
            } else {
                $('.btn-next').click()
                 _ds.isPageTurning = true
            }

        }
    } catch(e) {
        _ds.data = []
        _ds.isPageTurning = false
    }

})

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

function _pushState() {
    let origin = history.pushState
   return function() {
       origin.apply(this, arguments);
       console.log('pushState')
   };
};

function obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    const ob = new MutationObserver(callBack);
    ob.observe(target, options);
    return ob
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
2024/5/22：
- 新增：实现双击列表项，渲染地图，绘制标注范围。

2024/5/23：
- 调整：对框框新增header与footer。
- 新增：切换不用项。
- 新增：实现去作业。
- 新增：底图切换功能。

2024/5/24:
- 完善：预览功能新增对已创建但无坐标的情况判断。

2024/6/2
- 新增：【A】上一项
- 新增：【D】下一项
- 新增：【W】切换底图
- 新增：【S】关闭对话框
- 调整：去除遮罩色，修改边框色和宽度

2024/6/7
- 调整：正式服适配
*/