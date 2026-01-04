// ==UserScript==
// @name         loudong（Dev）
// @namespace    http://tampermonkey.net/
// @version      2024.8.22.1
// @description  try it
// @author       You
// @match        https://beta-out-jdl-mapdata.jd.com/editor/*
// @match        https://jdl-mapdata.jd.com/editor/*
// @icon         https://out-data-task.jd.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496631/loudong%EF%BC%88Dev%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/496631/loudong%EF%BC%88Dev%EF%BC%89.meta.js
// ==/UserScript==
class Dialog {
    static list = []

    constructor(options) {
        const {
            name,
            show,
            header,
            container,
            footer,
            title,
            titleMaxWidth, //title最大宽度
            width,
            height,
            containerWidth,
            containerHeight,
            zIndex,
            isShowMask,
            isCloseOther, //关闭其他对话框
        } = options

        if(name) {
            if(Dialog.list.find(dialog => {dialog.name == name})) throw Error('name 重复')

            this.name = name
        } else {
            let sn = 1
            while(1) {
                const name = `dialog${sn}`
                if(!Dialog.list.find(dialog => dialog.name == name)) {
                    this.name = name
                    break;
                } else {
                    sn++
                }
            }
        }

        if(isCloseOther) {
            Dialog.list.forEach(dialog => dialog.display(false))
        }

        let dialog_wrapper = document.createElement('div')
        document.body.append(dialog_wrapper)

        dialog_wrapper.outerHTML = `
          <div class="m-dialog_wrapper" name="${this.name}">
            <style>
              .close-btn {
                  color: #eee;
              }
            </style>
            <div class="m-dialog m-dialog_${this.name}">
              <div class="drag-bar"></div>
              <div class="m-dialog_header_wrapper">
                <div class="m-dialog_header">
                  <div class="m-dialog-title">
                    ${title ?? 'Title'}
                  </div>
                  <div class="close-btn">×</div>
                </div>
              </div>
              <div class="m-dialog-container_wrapper"></div>
              <div class="m-dialog-footer_wrapper"></div>
            </div>
            <div class="m-dialog-mask"></div>
          </div>
        `

        const dialogWrapperClassSel = `.m-dialog_wrapper[name="${this.name}"]`
        const dialogClassSel = `.m-dialog_${this.name}`

        let elMap = {
            dragBar: `${dialogClassSel} .drag-bar`,
            headerWrap: `${dialogClassSel} .m-dialog_header_wrapper`,
            headerTitle: `${dialogClassSel} .m-dialog-title`,
            closeIcon: `${dialogClassSel} .close-btn`,
            containerWrap: `${dialogClassSel} .m-dialog-container_wrapper`,
            footerWrap: `${dialogClassSel} .m-dialog-footer_wrapper`,
        }

        for(const attr in elMap) elMap[attr] = document.querySelector(elMap[attr])

        const {dragBar, headerWrap, headerTitle, closeIcon,containerWrap, footerWrap} = elMap
        this.containerWrap = containerWrap

        dialog_wrapper = document.querySelector(dialogWrapperClassSel)
        const dialog = document.querySelector(dialogClassSel)
        const style = document.querySelector(`${dialogWrapperClassSel} style`)

        header && headerWrap.append(header)
        container && containerWrap.append(container)
        footer && footerWrap.append(footer)

        this.show = show ?? true;

        style.textContent = `
          .m-dialog_wrapper[name="${this.name}"] {
            display: ${this.show ? 'block' : 'none'}
          }
          ${dialogClassSel} {
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${width ?? 'auto'};
            height: ${height ?? 'auto'};
            padding: 0 17px 12px;
            transform: translate(-50%, -50%);
            background: rgb(34, 34, 37, .8);
            border-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 12px;
            box-sizing: border-box;
            z-index: ${zIndex ?? 9999};
            color: #eee;
          }
          ${dialogClassSel} .m-dialog-mask {
            display: ${isShowMask ? 'block' : 'none'};
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,.3);
          }

          ${dialogClassSel} .drag-bar {
            width: 100%;
            height: 10px;
            margin-bottom: 3px;
            cursor: move;
          }

          ${dialogClassSel} .m-dialog_header {
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          ${dialogClassSel} .m-dialog-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: ${titleMaxWidth ?? '60%'};
            font-size: 20px;
            cursor: default;
            color: #fff;
          }

          ${dialogClassSel} .close-btn {
            height: 25px;
            line-height: 21px;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            font-size: 28px;
            color: #ccc;
            transition: .3s color;
            user-select: none;
          }

          ${dialogClassSel} .close-btn:hover {
            color: #eee;
          }

          ${dialogClassSel} .m-dialog-container_wrapper {
            position: relative;
            padding: 15px 0;
            width: ${container ? (containerWidth ? containerWidth : 'auto') : '600px'};
            height: ${container ? (containerHeight ? containerHeight : 'auto') : '300px'};
          }

          ${dialogClassSel} .m-dialog-footer_wrapper {
            display: flex;
            justify-content: end;
            align-items: center;
            width: 100%;
            margin-top: ${footer ? '10px' : 0};
          }

        `
        closeIcon.onclick = () => dialog_wrapper.display(false)

        drag()

        Object.keys(this).forEach(k => {
            dialog_wrapper[k] = this[k]
        })

        Object.setPrototypeOf(this.__proto__, dialog_wrapper.__proto__) //实例对象原型接元素原型链
        Object.setPrototypeOf(dialog_wrapper, this.__proto__) //元素接实例对象原型，使其携带共享方法

        Dialog.list.push(dialog_wrapper)
        return dialog_wrapper

        function drag() {
            let isMousedown = false
            let top = 0
            let left = 0
            dragBar.addEventListener('mousedown', e => {
                if (e.button == 0) (e.preventDefault(), isMousedown = true)
            })
            document.addEventListener('mousemove', (e) => {
                if (!isMousedown) return
                dialog.style.top = `calc(50% + ${top += e.movementY}px)`
                dialog.style.left = `calc(50% + ${left += e.movementX}px)`
            })
            document.addEventListener('mouseup', () => (isMousedown = false))
        }
    }

    display(isShow, options = {}) {
        const {isCloseOther} = options
        if(isCloseOther && !this.show) Dialog.list.forEach(dialog => dialog.display(false))

        if(isShow === void 0) {
            this.style.display = this.show ? 'none' : 'block'
            this.show = !this.show
        } else {
            this.style.display = isShow ? 'block' : 'none'
            this.show = isShow
        }
    }

    setContainer(container, options = {}) {
        const curContainer = this.containerWrap.children[0]
        curContainer && curContainer.remove()

        const {containerWidth, containerHeight} = options

        this.$('.m-dialog-container_wrapper').style.width = containerWidth ? containerWidth : 'auto'
        this.$('.m-dialog-container_wrapper').style.height = containerHeight ? containerHeight : 'auto'

        this.containerWrap.append(container)
    }

    //销毁
    destory() {
        this.remove()
    }
}

const _ds = {
    taskId: getParamValue('taskId'),
    mode: getParamValue('mode'),
    relationCount: 0,
    stateMap: {
        0: '已创建',
        10: '已领取',
        11: '已挂起',
        12: '待审核',
        13: '待修复',
        20: '已完成',
    },
    buildingName: '',
    operateTimer: null,
    baseData: {},
    annotation: {
        workList: [],
        valid_relations: [],
        modifiedBuilding_relations: [],
    },
    checkDialog: null,
    isHide: false,
    waitWorkListP: Promise.withResolvers(),
    addressDefaultVal: '',
    isWorkInspectP: Promise.withResolvers(),
    isHasWorkInspect: false,
    isOpenAutoShow_Panel: localStorage.getItem('isOpenAutoShow_Panel') === 'true',
    textareaDefaultVal: `2492：安徽省，\n2497：江苏省，\n2509：黑龙江省，\n2643、2644：山西省，\n2558：河北省`,
    showCheckDialog_once: false,
};
window._ds = _ds;

;(async function() {

    window.$ = Document.prototype.$ = Element.prototype.$ = $
    window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$


    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.append(iframe)

    _ds.fetch = iframe.contentWindow.fetch.bind(iframe.contentWindow)


    //待优化
    const domain = '//map-work.jd.com'
    const domain_testing = '//map-work-online.jd.com'

    hijackXHR(function() {
        const xhr = this;
        // console.log(xhr.responseURL);
        [
            function() {
                if(findURL(xhr.responseURL, ['^https://map-work-online.jd.com/inner/data/get_work_list', '^https://map-work.jd.com/inner/data/get_work_list\\?taskId=.*'])) {
                    const data = JSON.parse(xhr.responseText)
                    if([`获取作业数据成功`, '无作业记录'].every(msg => data.message !== msg)) return
                    let workList = _ds.annotation.workList = data.result ?? [] //作业列表
                    _ds.waitWorkListP.resolve()

                }
            },
            function() {
                if(!findURL(xhr.responseURL, ['^https://map-work-online.jd.com/inner/task_record/get_task_details\\?taskId=.*', '^https://map-work.jd.com/inner/task_record/get_task_details\\?taskId=.*'])) return

                const data = JSON.parse(xhr.responseText)
                console.log('task_details', data)
                if(data.message !== '成功') return

                const taskDetail = data.result
                const {taskId, projectId, wktGeom, workerUser} = taskDetail

                _ds.fetch("https://data-task-online-n.jd.com/inner/project/task/get_list", {
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        pageSize: 1,
                        pageStart: 1,
                        taskName: null,
                        taskHandleUser: null,
                        taskType: [],
                        taskStatus: [],
                        projectId: null,
                        taskId,
                        taskIds: null,
                        cityCode: null
                    }),
                    method: "POST",
                    mode: "cors",
                    credentials: "include"
                })
                .then(res => res.json())
                .then(res => {
                    if(!res.success || !res.result) return
                    const {workUser, taskStatus, handleUsers} = res.result[0]
                    const taskStatus_str = _ds.stateMap[taskStatus]

                    const taskIdTip = createEl('div', {
                        className: 'task-detail hidable-el',
                        style: {
                            display: 'flex',
                            background: 'rgb(255, 255, 255)',
                            borderRadius: '3px',
                            color: '#555',
                            height: '23px',
                            lineHeight: '23px',
                            fontSize: '13px',
                            margin: '1px 0 0 36px',
                            paddingRight: '10px',
                        }
                    })

                    const detailItems = [
                        ['任务id', taskId],
                        ['任务状态', taskStatus_str],
                    ]

                    if(taskStatus_str == '已挂起') detailItems.push(['挂起理由', handleUsers])
                    if(workUser) detailItems.push(['作业账号', workerUser])

                    detailItems.forEach(([key, value], idx) => {
                        const detailItem = createEl('div', {
                            innerHTML: `<span style="font-weight: 700">${key}</span>：${value}`,
                            style: {
                                marginLeft: '10px',
                                borderLeft: idx == 0 ? null : '1px solid #ccc',
                                paddingLeft: idx == 0 ? null : '8px',
                            }
                        })

                        taskIdTip.append(detailItem)
                    })

                    $('.container.top').append(taskIdTip)
                })


                setAddressDefaultVal(projectId)

                let url
                const coordStr = /MULTIPOLYGON \(\(\((.*)\)\)\)/.exec(wktGeom)?.[1] ?? /POLYGON \(\((.*)\)\)/.exec(wktGeom)?.[1]
                _ds.workArea = coordStr.split(', ').map(item => item.split(' '))

                if(location.host == 'jdl-mapdata.jd.com') {
                    // url = `https://map-work-online.jd.com/inner/data/get_base_data?bbox=${wktGeom}&layers=0,1,2,3,5,11,55&taskId=${taskId}`
                    url = `https://map-work-online.jd.com/inner/data/get_base_data`
                } else {
                    url = `https://map-work.jd.com/inner/data/get_base_data?bbox=POLYGON((${coordStr}))&layers=0,1,2,3,5,11,55&taskId=${taskId}`
                }
                _ds.fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        bbox: wktGeom,
                        layers: '0,1,2,3,5,11,55',
                        taskId: taskId,
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(async (res) => {
                    console.log('get_base_data', res)

                    if(!res.success) return

                    ;['poi', 'building_aoi', 'block_aoi', 'relation'].forEach((item) => { //数据为空时，置为空数组
                        if(!Array.isArray(res.result[item])) res.result[item] = []
                    })

                    let {
                        block_aoi, //包含范围内及周围附件的无留白
                        poi,
                        building_aoi,
                        relation
                    } = res.result

                    _ds.baseData.whole = {block_aoi, poi, building_aoi, relation}

                    await createTMap()

                    block_aoi.forEach((aoi) => {
                        const {relation, block_aoi, building_aoi, poi} = _ds.baseData.whole
                        const blockAOI_LatLng = aoi.geometry.coordinates[0].map(([lng, lat]) => new _ds.TMap.LatLng(lat, lng))

                        const POIs_inBlockAOI_valid = poi.filter(poi => {
                            const [lng, lat] = poi.geometry.coordinates //经纬
                            const point_LatLng = new _ds.TMap.LatLng(lat, lng)

                            return _ds.TMap.geometry.isPointInPolygon(point_LatLng, blockAOI_LatLng)
                        }).filter(poi => {
                            const findRelation = relation.find(relation => poi.id === relation.properties.sourceId)
                            if(!findRelation) return

                            const findBuildingAOI_link = [...block_aoi, ...building_aoi].find(aoi => aoi.id == findRelation.properties.targetId)
                            if(!findBuildingAOI_link) return //该情况属于poi点在范围内，而关联的面在范围外，所以可能不存在该楼栋面信息

                            return !findBuildingAOI_link.properties.marks?.includes?.("building_name_correct")
                        })

                        _ds.baseData[aoi.id] = {poi: POIs_inBlockAOI_valid}

                    })


                    let baselineUrl
                    if(location.host == 'jdl-mapdata.jd.com') {
                        // baselineUrl = `https://map-work-online.jd.com/inner/data/get_baseline?bbox=${wktGeom}&layers=2,55`
                        baselineUrl = `https://map-work-online.jd.com/inner/data/get_baseline`
                    } else {
                        const coordStr = /MULTIPOLYGON \(\(\((.*)\)\)\)/.exec(wktGeom)?.[1] ?? /POLYGON \(\((.*)\)\)/.exec(wktGeom)?.[1]
                        baselineUrl = `https://map-work.jd.com/inner/data/get_baseline?bbox=POLYGON((${coordStr}))&layers=2,55`
                    }

                    await _ds.fetch(baselineUrl, {
                        method: 'POST',
                        body: JSON.stringify({
                            bbox: wktGeom,
                            layers: '0,1,2,3,5,11,55',
                            taskId: taskId,
                        }),
                        headers: {
                            'content-type': 'application/json',
                        },
                        mode: "cors",
                        credentials: "include"
                    })
                    .then(resolve => resolve.json())
                    .then(async (resolve) => {
                        if(resolve.message !== "查询作业前数据成功") return

                        _ds.realbuilding_aois = resolve.result.building_aoi ?? []
                        _ds.real_pois = resolve.result.poi ?? []
                        console.log('realBaseData', resolve.result)
                    })
                    await _ds.waitWorkListP.promise


                    ;(function createSelPanel() {
                        const localSM = localStorage.getItem('statisticalMap')
                        let localSM_parse
                        if(localSM) {
                            try {
                                const checkboxs = $$('.block-aoi-sel-panel input[type="checkbox"]:not(#checkAll)')
                                localSM_parse = JSON.parse(localSM)
                                localSM_parse[_ds.taskId]?.forEach((id) => {
                                    const target = checkboxs.find(checkbox => checkbox.aoiId == id)
                                    target && (target.checked = true)
                                })
                            } catch {
                                console.warn('统计方案解析失败')
                                localStorage.setItem('statisticalMap', JSON.stringify({}))
                            }
                        }

                        let poi_sum = 0
                        let aoi_sum = 0
                        for( let k in _ds.baseData) {
                            if(k == 'whole') continue
                            poi_sum += _ds.baseData[k].poi.length
                            aoi_sum++
                        }

                        const blockAOI_selPanel = createEl('div', {
                            className: 'block-aoi-sel-panel hidable-el',
                        })
                        const header = createEl('div', {
                        })
                        const allSelect = createEl('span', {
                            innerHTML: `全选（aoi*${aoi_sum} &nbsp;poi*${poi_sum}）`,
                            style: {
                                marginLeft: '3px',
                                height: '22px',
                                lineHeight: '22px',
                            }
                        })
                        const checkAllBox = createEl('input', {
                            type: 'checkbox',
                            checked: !localSM_parse?.[_ds.taskId],
                            id: 'checkAll',
                            onchange: function() {
                                const curChecked = checkAllBox.checked
                                const checkboxs = $$('.block-aoi-sel-panel input[type="checkbox"]:not(#checkAll)')
                                checkboxs.forEach((item) => { item.checked = curChecked })

                                dataAnalysis()
                                createStatisticDialog(_ds.annotation.valid_relations)


                                const localSM = localStorage.getItem('statisticalMap')
                                if(localSM) {
                                    try {
                                        const map = JSON.parse(localSM)
                                        if(curChecked) {
                                            delete map[_ds.taskId]
                                        } else {
                                            map[_ds.taskId] = []
                                        }
                                        localStorage.setItem('statisticalMap', JSON.stringify(map))

                                    } catch {
                                        console.warn('统计方案解析失败')
                                        localStorage.setItem('statisticalMap', JSON.stringify({}))
                                    }
                                }
                            },
                        })

                        setStyle(new Map([
                            [blockAOI_selPanel, {
                                position: 'absolute',
                                right: '5px',
                                bottom: '35px',
                                background: 'rgb(255, 255, 255, .85)',
                                zIndex: 99999,
                                padding: '8px 3px 5px 3px',
                                boxShadow: '0px 0px 12px rgba(0, 0, 0, .12)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#333',

                            }],
                            [header, {
                                display: 'flex',
                                alignItems: 'center',
                                height: '28px',
                                padding: '0px 5px',
                                marginBottom: '5px',
                                borderBottom: '1px solid #bbb',
                                alignItems: 'center',
                            }],
                            [checkAllBox, {
                                cursor: 'pointer',
                                width: '14px',
                                height: '14px',
                            }]
                        ]))

                        header.append(checkAllBox, allSelect)
                        blockAOI_selPanel.append(header)

                        Object.entries(_ds.baseData)
                        .filter(([key]) => key !== 'whole')
                        .sort((a, b) => {
                            return b[1].poi.length - a[1].poi.length
                        })
                        .forEach(([aoiId]) => {
                            const count_poi = _ds.baseData[aoiId].poi.length

                            const column = createEl('div', {
                                className: 'column',
                                aoiId,
                                style: {
                                    display: 'flex',
                                    height: '24px',
                                    padding: '0 5px',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    color: count_poi == 0 ? '#777': null,
                                    transition: '.3s all',
                                    background: $('.sidebar .id-text')?.textContent == aoiId ? '#ccc' : null,
                                    borderRadius: '3px',
                                }
                            })

                            const checkbox = createEl('input', {
                                type: 'checkbox',
                                checked: !localSM_parse?.[_ds.taskId] || localSM_parse[_ds.taskId].find(scheme => scheme.includes(aoiId)),
                                aoiId,
                                onchange: function () {
                                    const checkboxs = $$('.block-aoi-sel-panel input[type="checkbox"]:not(#checkAll)')
                                    const checkedboxs = checkboxs.filter(checkbox => checkbox.checked)

                                    $('#checkAll').checked = checkboxs.length == checkedboxs.length

                                    const localSM = localStorage.getItem('statisticalMap')
                                    if(localSM) {
                                        try {
                                            const map = JSON.parse(localSM)
                                            if(checkboxs.length !== checkedboxs.length) {
                                                map[taskId] = checkedboxs.map(checkbox => checkbox.aoiId)
                                            } else {
                                                delete map[taskId]
                                            }
                                            localStorage.setItem('statisticalMap', JSON.stringify(map))

                                        } catch {
                                            console.warn('统计方案解析失败')
                                            localStorage.setItem('statisticalMap', JSON.stringify({[_ds.taskId]: checkedboxs.map(checkbox => checkbox.aoiId)}))
                                        }
                                    } else {
                                        localStorage.setItem('statisticalMap', JSON.stringify({}))
                                    }

                                    dataAnalysis()
                                    createStatisticDialog(_ds.annotation.valid_relations)

                                },
                                style: {
                                    cursor: 'pointer',
                                    width: '14px',
                                    height: '14px',
                                },
                            })

                            const aoiName = _ds.baseData.whole.block_aoi.find(aoi => aoi.id == aoiId).properties.name
                            const aoiNameDiv = createEl('div', {
                                innerText: aoiName !== '' ? aoiName : aoiId,
                                onclick: function() {
                                    searchSite(aoiId)
                                },
                                style: {
                                    marginLeft: '5px',
                                    width: '120px',
                                    height: '22px',
                                    lineHeight: '22px',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    wordBreak: 'break-all',
                                    whiteSpace: 'nowrap',
                                    fontWeight: count_poi == 0 ? null : 600,
                                }
                            })
                            const counter = createEl('div', {
                                innerText: `${count_poi}项`,
                            })

                            column.append(checkbox, aoiNameDiv, counter)
                            blockAOI_selPanel.append(column)
                        })
                        document.body.append(blockAOI_selPanel)
                    })()

                    dataAnalysis()

                    createStatisticDialog(_ds.annotation.valid_relations)

                    function dataAnalysis() {
                        const {relation, block_aoi, building_aoi} = _ds.baseData.whole

                        let poi = $$('.block-aoi-sel-panel input[type="checkbox"]:not(#checkAll)')
                        .filter(checkbox => checkbox.checked)
                        .reduce((counter, checkbox) => {
                            return (counter = [...counter, ..._ds.baseData[checkbox.aoiId].poi])
                        }, [])

                        let relationId_recordArr = []
                        //筛选 poi-aoi 关联对，去重，取范围内关联对，去除灰面
                        _ds.annotation.valid_relations = relation
                        .filter(({properties}) => properties.sourceLayer == '2')
                        .filter(relation => {
                            if(relationId_recordArr.includes(relation.id)) return false

                            relationId_recordArr.push(relation.id)
                            return relation
                        })
                        .filter(({properties}) => poi.find(poi => poi.id == properties.sourceId))
                        .filter((relation) => [...building_aoi, ...block_aoi].find(aoi => aoi.id == relation.properties.targetId && !aoi.properties.marks?.includes?.("building_name_correct")))


                        _ds.annotation.valid_relations.forEach(relation => {
                            relation.poi = poi.find(poi => relation.properties.sourceId === poi.id)
                            relation.poi_id = relation.poi.id

                            relation.isBuilding = relation.poi.isBuilding = relation.properties.targetLayer == '55'

                            const relationAOI = [...building_aoi, ...block_aoi].find(baoi => baoi.id == relation.properties.targetId);
                            relation.aoi = relationAOI
                            relation.aoi_id = relationAOI.id
                            if(relation.isBuilding) relation.curBuildingAOI_coord = relationAOI.geometry.coordinates[0]

                            //备注：自带的 AOI 的 mid 和 id 可能不一致，统一使用 id 值（自建的楼栋面没有mid）

                            const realPOI = _ds.real_pois.find(poi => poi.id == relation.poi_id)
                            relation.poi.realName = realPOI ? realPOI.properties.name : void 0

                            relation.poi.modified = !!_ds.annotation.workList.filter(item => item.operateType == 'create' || item.operateType == 'modify').find(item => item.dataId == relation.poi.id)

                        })

                        _ds.annotation.valid_relations.forEach(relation => {
                            if(!relation.isBuilding) return

                            const realBuildingAOI_coord = _ds.realbuilding_aois.find(buildingAOI => buildingAOI.id == relation.aoi_id)?.geometry?.coordinates?.[0]
                            if(!realBuildingAOI_coord) return

                            relation.realBuildingAOI_coord = realBuildingAOI_coord
                            relation.aoiCoordIsChange = judgeIsChange(realBuildingAOI_coord, relation.curBuildingAOI_coord)
                        })

                        _ds.annotation.modifiedBuilding_relations = _ds.annotation.valid_relations.filter(relation => (relation.isBuilding && (relation.aoiCoordIsChange !== false))) // 无 aoiCoordIsChange 表示该楼栋AOI为新建的

                        checkWorkScope()


                        const relationCount = $('#relation-count')
                        if(relationCount) {
                            _ds.relationCount = _ds.annotation.valid_relations.length
                            relationCount.innerText = `关联对数：${_ds.relationCount}`
                        } else {
                            initFooter_custom()
                        }
                    }
                })
                .catch(async (e) => {
                    showMessage('作业范围过大，数据获取失败，请点击【关联对数】自行检查', {type: 'error'}) //7653228
                    _ds.showCheckDialog_once = true

                    await _ds.waitWorkListP.promise

                    initFooter_custom(false)

                    const relation_workList = _ds.annotation.workList.filter(item => (item.layer == "relation" && item.operateType == "create")) ?? []

                    _ds.relationCount = relation_workList.length
                    $('#relation-count').innerText = `关联对数：${_ds.relationCount}`

                    createStatisticDialog(relation_workList)
                })

                function setAddressDefaultVal(projectId) {
                    let localStore_scheme = localStorage.getItem('addressPresetScheme') ?? _ds.textareaDefaultVal

                    let parseArr = []
                    let trimStr = localStore_scheme.replace(/(\s*)/g, (str) => '')

                    trimStr.split('，').filter(item => !!item).forEach(kv => {
                        const [key, value] = kv.split('：')
                        const keyArr = key.split('、').filter(item => !!item)
                        parseArr.push([keyArr, value])
                    })

                    _ds.addressPresetScheme = parseArr

                    new Map(parseArr).forEach((val, key) => {
                        if(key.includes(`${projectId}`)) _ds.addressDefaultVal = val
                    })
                }

                function createTMap() {
                    const script = document.createElement('script')
                    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&libraries=geometry,service'
                    iframe.contentWindow.document.body.append(script)

                     return new Promise((res) => {
                         script.onload = function () {
                             _ds.TMap = iframe.contentWindow.TMap
                             res()
                         }
                     })
                }

                function createStatisticDialog(relation) {
                    const container = createEl('div', {
                        style: {
                            width: '430px',
                            height: '300px',
                        }
                    })

                    if(_ds.relationCount > 0) {
                        const table = createEl('table', {
                            style: {
                                width: '100%',
                            }
                        })
                        const tr_head = createEl('tr')
                        const th_sn = createEl('th')
                        const th_AOI = createEl('th')
                        const th_POI = createEl('th');
                        [[th_sn, '序号'], [th_AOI, 'AOI'], [th_POI, 'POI']].forEach(item => (item[0].innerText = item[1]))
                        tr_head.append(th_sn, th_AOI, th_POI)
                        table.append(tr_head)

                        relation.forEach((item, idx) => {
                            const tr = createEl('tr')
                            const td_sn = createEl('td', {
                                innerText: idx+1,
                                style: {
                                    textAlign: 'center',
                                }
                            })
                            const td_layer = createEl('td', {
                                innerText: item.properties.targetId //面
                            })
                            const td_point = createEl('td', {
                                innerText: item.properties.sourceId //点
                            });
                            setStyle([td_layer, td_point], {
                                transition: '.5s all'
                            });

                            [td_layer, td_point].forEach(td => (td.style.cursor = 'pointer'));

                            [td_layer, td_point].forEach(td => {
                                td.onclick = function() {
                                    searchSite(td.textContent)

                                    table.$$('td').forEach(td => {
                                        td.style.textShadow = td == this ? '0px 0px 8px' : null
                                    })

                                }
                            })
                            tr.append(td_sn, td_layer, td_point)
                            table.append(tr)
                        })
                        container.append(table)
                    } else {
                        container.innerText = '统计结果为空...'
                    }

                    if(!_ds.statisticDialog) {
                        const statisticDialog = new Dialog({name: 'statistic', title: '统计' , container, show: false, isCloseOther: true})
                        _ds.statisticDialog = statisticDialog
                    } else {
                        _ds.statisticDialog.setContainer(container)
                    }
                }
            },
            function() {
                if(!_ds.isOpenAutoShow_Panel || !findURL(xhr.responseURL, ['^https://map-work-online.jd.com/inner/work_inspect/get_check_details\\?taskId=.*', '^https://map-work.jd.com/inner/work_inspect/get_check_details\\?taskId=.*'])) return
                const data = JSON.parse(xhr.responseText)
                if(!data.success) {
                    _ds.isWorkInspectP.resolve(false)
                    return console.warn('审核列表数据获取失败')
                }

                if(data.result !== null) {
                    const hasUnsolved = data.result.find(r => r.inspectStatus !== '20') // 查找未解决状态的记录
                    _ds.isWorkInspectP.resolve(hasUnsolved)
                } else {
                    _ds.isWorkInspectP.resolve(false)
                }
            }
        ].forEach(item => item())

        function findURL(responseURL, URLs) {
            return URLs.some(url => new RegExp(url).test(responseURL))
        }
    })

    function checkWorkScope() {
        const container = createEl('div')
        const style = document.createElement('style')
        const classification = document.createElement('div')

        container.className = 'container'
        classification.className = 'classification'
        style.textContent = `
            .element-id {
                cursor: pointer
            }
            li {
                margin-top: 5px
            }
        `

        setStyle(container, {
            overflow: 'auto',
            width: '600px',
            height: '360px',
        })

        container.append(style, classification)

        const validRelations = _ds.annotation.valid_relations
        const communityAOIs_new = _ds.annotation.workList.filter(workItem => { //切割后新增/修改过的无留白面
            if(workItem.layer !== '1') return
            return workItem.operateType == 'create' || ( workItem.operateType == 'modify' && validRelations.find(({aoi_id}) => aoi_id === workItem.dataId) )
        })
        console.log('communityAOIs_new', communityAOIs_new)
        const community_relations = validRelations.filter(relation => !relation.isBuilding)

        const statisticFlow = [
            //小区POI名称列表
            function() {
                const communityPoiNameWrap = document.createElement('div')
                const communityPoiNameType_header = document.createElement('div')

                communityPoiNameWrap.className = 'community-poi-name-classification'
                communityPoiNameType_header.innerText = '小区 POI 名称：'

                setStyle(new Map([
                    [communityPoiNameType_header, {
                        fontSize: '17px',
                        color: '#fff'
                    }],
                    [communityPoiNameWrap, {
                        marginBottom: '25px'
                    }]
                ]))

                communityPoiNameWrap.append(communityPoiNameType_header)
                community_relations.forEach(relation => {
                    const {name: poi_name, labels: poi_labels} = relation.poi.properties
                    const poiLabels = poi_labels ?? []

                    const li = createEl('li', {
                        style: {
                            margin: '5px 0 0 10px'
                        }
                    })
                    const name = createEl('span', {
                        innerHTML: `${poi_name} ${poiLabels.includes('confirm_not_district') ? '<span style="color: #ccc; font-size: 12px; font-weight: 700;">（非小区）</span>' : ''}`,
                        onclick: function() {
                            searchSite(relation.poi_id)
                            $$('.shine').forEach(item => (item.style.textShadow = null))
                        },
                        style: {
                            marginLeft: '-10px',
                            cursor: 'pointer'
                        }
                    })


                    li.append(name)
                    communityPoiNameWrap.append(li)
                })

                if(community_relations.length) classification.append(communityPoiNameWrap)
            },
            //楼栋POI名称归纳
            function() {
                const poiNameCheckBox_header = document.createElement('div')
                const buildingPoiNameCount = document.createElement('div')

                poiNameCheckBox_header.innerText = '楼栋 POI 名称：'
                buildingPoiNameCount.className = 'building-poi-name-classification'

                setStyle(new Map([
                    [poiNameCheckBox_header, {
                        fontSize: '17px',
                        color: '#fff'
                    }],
                    [buildingPoiNameCount, {
                        marginBottom: '25px'
                    }]
                ]))
                buildingPoiNameCount.append(poiNameCheckBox_header)

                const formatMap = {}
                validRelations.filter(link => link.isBuilding).forEach(link => {
                    const formatName = link.poi.properties.name.replace(/(\b\d+\b)(?!号院|弄|期)|([A-Z]+)(?=栋|座|幢)/g, (match, p1, p2)=> {
                        link.poi.matchedVal = match
                        // console.log(p1, p2)
                        return p1 ? '___' : p2 ? '(&nbsp;&nbsp;&nbsp;)' : match
                    })
                    if(formatMap[formatName]) {
                        formatMap[formatName].push(link.poi)
                    } else {
                        formatMap[formatName] = [link.poi]
                    }
                })



                for(const formatName in formatMap) {
                    const format_pois = formatMap[formatName] //同一格式名的楼栋poi

                    const checkItem = document.createElement('div')
                    const header = document.createElement('div')
                    const fold = document.createElement('div')
                    const tamplateInfo = document.createElement('div')
                    const idWrap = document.createElement('div')
                    const idItem = document.createElement('div')
                    idWrap.className = 'id-wrap'
                    setStyle(new Map([
                        [checkItem, {
                            width: '100%',

                        }],
                        [header,{
                            display: 'flex',
                            alignItems: 'center',
                            height: '30px',
                        }],
                        [fold, {
                            width: '15px',
                            height: '15px',
                            marginRight: '3px',
                            lineHeight: '15px',
                            fontSize: '12px',
                            textAlign: 'center',
                            transition: '.2s all',
                            transform: 'rotate(90deg)',
                            cursor: 'pointer',
                        }],
                        [tamplateInfo, {
                            cursor: 'pointer',
                        }],
                        [idWrap, {
                            overflow: 'hidden',
                            height: 0,
                            padding: '0 20px',
                            transition: '.2s all',
                        }]
                    ]))
                    tamplateInfo.innerHTML = `${formatName}（${format_pois.length}项）`
                    fold.innerText = '▲'
                    header.onclick = function() {
                        const transform = fold.style.transform
                        fold.style.transform = transform == 'rotate(90deg)' ? 'rotate(180deg)' : 'rotate(90deg)'
                        idWrap.style.height = transform == 'rotate(90deg)' ? idWrap.scrollHeight+'px' : '0'
                    }

                    const ListItems = format_pois.sort((a, b) => {
                        if([a, b].every(item => !isNaN(Number(a.matchedVal)))) {
                            return a.matchedVal - b.matchedVal
                        } else {
                            return a.matchedVal.codePointAt() - b.matchedVal.codePointAt()
                        }
                    }).map(poi => {
                        const poiItem = createEl('li', {
                            className: 'shine',
                            innerText: poi.properties.name,
                            style: {
                                marginTop: '5px',
                                cursor: 'pointer',
                                transition: '.5s all',
                            },
                            onclick: function() {
                                searchSite(poi.id)
                                $$('.shine').forEach(item => {
                                    item.style.textShadow = item == this ? '0px 0px 8px' : null
                                })
                            }
                        })
                        idWrap.append(poiItem)
                        return poiItem
                    })


                    header.append(fold, tamplateInfo)
                    checkItem.append(header, idWrap)
                    buildingPoiNameCount.append(checkItem)
                }

                if(Object.entries(formatMap).length) classification.append(buildingPoiNameCount)
            },
            //POI地址归类
            function() {
                const addressMap = {}
                _ds.annotation.valid_relations.forEach(relation => {
                    const {address: poi_address} = relation.poi.properties

                    let addressVal = addressMap[poi_address]
                    if(addressVal) {
                        addressVal.push(relation.poi)
                    } else {
                        addressMap[poi_address] = [relation.poi]
                    }
                })

                const classifiedAddressWrap = document.createElement('div')
                const header = document.createElement('div')

                classifiedAddressWrap.className = 'poi-address-classification'

                classifiedAddressWrap.style.marginBottom = '25px'
                header.innerText = 'POI 地址：'

                setStyle(header, {
                    fontSize: '17px',
                    color: '#fff',
                })

                classifiedAddressWrap.append(header)

                for(const address in addressMap) {
                    const pois = addressMap[address]

                    const checkItem = document.createElement('div')
                    const header = document.createElement('div')
                    const fold = document.createElement('div')
                    const tamplateInfo = document.createElement('div')
                    const idWrap = document.createElement('div')
                    const idItem = document.createElement('div')
                    idWrap.className = 'id-wrap'
                    setStyle(new Map([
                        [checkItem, {
                            width: '100%',
                        }],
                        [header, {
                            display: 'flex',
                            alignItems: 'center',
                        }],
                        [fold, {
                            width: '15px',
                            height: '15px',
                            marginRight: '3px',
                            lineHeight: '15px',
                            fontSize: '12px',
                            textAlign: 'center',
                            transition: '.2s all',
                            transform: 'rotate(90deg)',
                            cursor: 'pointer',
                        }],
                        [tamplateInfo, {
                            cursor: 'pointer',
                        }],
                        [idWrap, {
                            overflow: 'hidden',
                            height: 0,
                            padding: '0 20px',
                            transition: '.2s all',
                        }]
                    ]))
                    tamplateInfo.innerText = `${address}（${pois.length}项）`
                    fold.innerText = '▲'
                    header.onclick = function() {
                        const transform = fold.style.transform
                        fold.style.transform = transform == 'rotate(90deg)' ? 'rotate(180deg)' : 'rotate(90deg)'
                        idWrap.style.height = transform == 'rotate(90deg)' ? idWrap.scrollHeight+'px' : '0'
                    }

                    pois.forEach(poi => {
                        const poiItem = document.createElement('li')
                        // console.log('poi', poi)
                        poiItem.innerHTML = `${ poi.properties.name}${poi.isBuilding ? '': '<span style="color: #aaa; font-size: 12px; font-weight: 700;">（小区POI）</span>'}`
                        poiItem.style.marginBottom = '5px'
                        poiItem.style.cursor = 'pointer'

                        poiItem.onclick = function() {
                            searchSite(poi.id)
                            $$('.shine').forEach(item => (item.style.textShadow = null))
                        }
                        idWrap.append(poiItem)
                    })


                    header.append(fold, tamplateInfo)
                    checkItem.append(header, idWrap)
                    classifiedAddressWrap.append(checkItem)
                }

                if(Object.entries(addressMap).length) classification.append(classifiedAddressWrap)
            },
            //楼栋面变更
            function() {
                const buildingAOIChangeWrap = document.createElement('div')
                const itemWrap = document.createElement('div')
                const header = document.createElement('div')
                const title = document.createElement('div')

                buildingAOIChangeWrap.className = 'buiding-aoi-change-wrap'

                buildingAOIChangeWrap.style.marginBottom = '25px'
                title.innerText = `楼栋面变更：`

                setStyle(new Map([
                    [header,{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        height: '30px',
                        fontSize: '17px',
                        color: '#fff',
                    }],
                    [title, {
                        cursor: 'pointer',
                    }],
                    [itemWrap, {
                        transition: '.2s all',
                    }]
                ]))

                header.append(title)
                buildingAOIChangeWrap.append(header, itemWrap)

                const ListItems = _ds.annotation.modifiedBuilding_relations.map(relation => {
                    const li = createEl('li')
                    const aoi_name = createEl('span', {
                        className: 'aoi-name shine',
                        innerText: `${relation.aoi.properties.name}`,
                        onclick: function () {
                            $$('.shine').forEach(item => {
                                item.style.textShadow = item == this ? '0px 0px 8px' : null
                            })
                            searchSite(relation.aoi_id)
                        },
                        style: {
                            transition: '.5s all'
                        },
                    })
                    const poi_name = createEl('span', {
                        className: 'poi-name shine',
                        innerText: `${relation.poi.properties.name}`,
                        onclick: function() {
                            $$('.shine').forEach(item => {
                                item.style.textShadow = item == this ? '0px 0px 8px' : null
                            })
                            searchSite(relation.poi_id)
                        },
                        style: {
                            transition: '.5s all'
                        },
                    })
                    setStyle(new Map([
                        [li, {
                            margin: '2px 0 0 10px',
                            transition: '.5s all',
                        }],
                        [poi_name, {
                            marginLeft: '-8px',
                        }],
                        [aoi_name, {
                            marginLeft: '10px',
                            textAlign: 'center',
                            background: 'rgba(100 ,100, 100, .6)',
                            borderRadius: '5px',
                            padding: '1px 5px',
                            fontSize: '14px',
                        }],
                        [[aoi_name, poi_name], {
                            cursor: 'pointer',
                        }]
                    ]))

                    li.append(poi_name, aoi_name)
                    itemWrap.append(li)

                    return li
                })

                if(_ds.annotation.modifiedBuilding_relations.length) classification.append(buildingAOIChangeWrap)
            },
            //POI名称变更
            function() {
                const POIChangeWrap = document.createElement('div')
                const itemWrap = document.createElement('div')
                const header = document.createElement('div')
                const title = document.createElement('div')

                POIChangeWrap.className = 'poi-change-wrap'

                POIChangeWrap.style.marginBottom = '25px'
                title.innerText = `POI 名称变更：`

                setStyle(new Map([
                    [header,{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        height: '30px',
                        fontSize: '17px',
                        color: '#fff',
                    }],
                    [title, {
                        cursor: 'pointer',
                    }],
                    [itemWrap, {
                        transition: '.2s all',
                    }]
                ]))

                header.append(title)
                POIChangeWrap.append(header, itemWrap)

                const poiNameChange = _ds.annotation.valid_relations.filter(({poi}) => poi.realName !== poi.properties.name)

                poiNameChange.forEach(({poi}) => {
                    const li = createEl('li')
                    const name = createEl('span', {
                        innerText: `${poi.realName ? `${poi.realName} 👉 ${poi.properties.name}` : `${poi.properties.name}`}`,
                        onclick: function() {
                            searchSite(poi.id)
                            $$('.shine').forEach(item => (item.style.textShadow = null))
                        }
                    })
                    const community_label = createEl('span', {
                        innerText: `（小区POI）`,
                    })
                    setStyle(new Map([
                        [li, {
                            margin: '2px 0 0 10px',
                        }],
                        [name, {
                            marginLeft: '-8px',
                            cursor: 'pointer',
                        }],
                        [community_label, {
                            fontSize: '12px',
                            color: '#aaa',
                            cursor: 'default',
                            fontWeight: 700,
                        }]
                    ]))

                    li.append(name)
                    !poi.isBuilding && li.append(community_label)
                    itemWrap.append(li)
                })

                if(poiNameChange.length) classification.append(POIChangeWrap)
            },
        ]
        statisticFlow.forEach(statisticFn => statisticFn())


        const exceptionWrap = document.createElement('div')
        const exceptionHeader = document.createElement('div')
        const exceptionContainer = createEl('div', {
            onclick: function(e) {
                if(!e.target.matches('.element-id')) return

                $$('.shine').forEach(item => (item.style.textShadow = null))
                searchSite(e.target.textContent)
            }
        })

        exceptionHeader.innerText = '异常结果：'
        setStyle(new Map([
            [exceptionWrap, {
                marginTop: '30px'
            }],
            [exceptionHeader, {
                fontSize: '17px',
                color: '#fff'
            }]
        ]))


        const exceptionCheckFlow = [
            //检查POI重复关联
            function() {
                const countMap = {}
                validRelations.forEach(link => {
                    const { poi_id, aoi_id } = link

                    if(countMap[aoi_id]) {
                        ++countMap[aoi_id].count
                        countMap[aoi_id].linkPOIs.push(poi_id)
                    } else {
                        countMap[aoi_id] = { count: 1, linkPOIs: [poi_id]}
                    }
                })
                const repeatedIds = []
                for(let aoi_id in countMap) {
                    if(countMap[aoi_id].count > 1) {
                        const {count, linkPOIs} = countMap[aoi_id]
                        repeatedIds.push({ aoi_id, count, linkPOIs })
                    }
                }
                repeatedIds.forEach(({aoi_id, count, linkPOIs}) => {
                    const li = document.createElement('li')
                    const pointsStr = linkPOIs.reduce((counter, point, idx) => {
                        return counter+ `<span class="element-id">${point}</span>${idx !== linkPOIs.length-1 ? '，' : ''}`
                    }, '')
                    li.innerHTML = `id 为 <span class="element-id">${aoi_id}</span> 的 AOI 同时被 ${count} 个POI关联：${pointsStr}`
                    exceptionContainer.append(li)
                })

            },
            //漏关联检查
            function() {
                //无留白调整/切割后漏关联（面板选中的无留白）
                const communityAOIs_notLink = communityAOIs_new.filter(aoi => {
                    const relation = validRelations.find(link => link.aoi_id == aoi.dataId)
                    const isSel_AOI = $$('.block-aoi-sel-panel input[type="checkbox"]:not(#checkAll)').filter(check => check.checked).find(check => check.aoiId == aoi.dataId)
                    return !relation && isSel_AOI
                })

                communityAOIs_notLink.forEach(({dataId: aoiId}) => appendExceptionItem(`id 为 <span class="element-id">${aoiId}</span> 的 AOI 未被关联，请核对确认`))

                if(!validRelations.find(relation => !relation.isBuilding)) appendExceptionItem(`缺少小区 AOI 关联对`)
            },
            //楼栋面类型检查
            function() {
                _ds.annotation.modifiedBuilding_relations.forEach(({aoi}) => {
                    if(aoi.properties.types?.[0] !== '190403') appendExceptionItem(`id为 <span class="element-id">${aoi.id}</span> 的楼栋AOI，类型不为【楼栋号】`)
                })

            },
            //小区 AOI 属性检查
            function() {
                const aoi_unusual = [] //优化多对一关联，引起的重复结果。
                const blockRelation_new = _ds.annotation.valid_relations
                .filter(relation => !relation.isBuilding) //筛选小区面
                .filter((relation) => communityAOIs_new.find(aoi => aoi.dataId == relation.aoi_id )) //取新建/调整过的无留白被关联AOI

                blockRelation_new
                .filter(({aoi, poi}) => !(aoi.properties.types[0] == '120302' || poi.properties.labels?.includes('confirm_not_district')))
                .forEach(({aoi_id}) => {
                    if(aoi_unusual.includes(aoi_id)) return

                    appendExceptionItem(`id为 <span class="element-id">${aoi_id}</span> 的小区AOI，类型不为【住宅小区】`)
                    aoi_unusual.push(aoi_id)
                })

                blockRelation_new
                .filter(({aoi, poi}) => aoi.properties.name !== poi.properties.name)
                .forEach(({poi_id}) => appendExceptionItem(`id为 <span class="element-id">${poi_id}</span> 的 POI，与其关联的 AOI 名称不一致。`))
            },
            //POI类型检查
            function() {
                validRelations.forEach(link => {
                    const {labels, types} = link.poi.properties
                    if(link.isBuilding) {
                        if(types[0] !== '190403') appendExceptionItem(`id为 <span class="element-id">${link.poi_id}</span> 的 楼栋POI，类型不为 【楼栋号】`)
                    } else {
                        if( types[0] == '120302' || labels?.includes('confirm_not_district')) return //120302 非小区

                        appendExceptionItem(`id为 <span class="element-id">${link.poi_id}</span> 的 小区POI，类型不为【住宅小区】`)
                    }
                })
            },
            //POI作业记录检查
            function() {
                validRelations.forEach(relation => {
                    if(!relation.poi.modified) appendExceptionItem(`id为 <span class="element-id">${relation.poi_id}</span> 的 POI 未查询到作业记录，请手动关联一次`)
                })
            },
            //POI位置检查
            function() {
                validRelations.filter(({aoi, poi}) => {
                    const blockAOI_LatLng = aoi.geometry.coordinates[0].map(([lng, lat]) => new _ds.TMap.LatLng(lat, lng))
                    const [lng, lat] = poi.geometry.coordinates
                    const point_LatLng = new _ds.TMap.LatLng(lat, lng)

                    return !_ds.TMap.geometry.isPointInPolygon(point_LatLng, blockAOI_LatLng)
                }).forEach(({poi_id}) => {
                    appendExceptionItem(`id为 <span class="element-id">${poi_id}</span> 的 POI 超出了关联面的范围`)
                })
            }
        ]

        function appendExceptionItem(container) {
            const li = document.createElement('li')
            li.innerHTML = container
            exceptionContainer.append(li)
        }

        exceptionCheckFlow.forEach(checkFn => checkFn())

        if(exceptionContainer.children.length) {
            exceptionWrap.append(exceptionHeader, exceptionContainer)
            container.append(exceptionWrap)
        }

        if(_ds.checkDialog) {
            _ds.checkDialog.setContainer(container)
        } else {
            _ds.checkDialog = new Dialog({name: 'check', title: '检查', container, show: false})
        }
    }


    if(await init()) showMessage('脚本运行中...', {type: 'success', showTime: 2000})

    const googleImageWrap = $$('.el-card__body .el-radio-group>*').find(item => item.textContent.includes('谷歌影像'))
    const checkbox_switchMap = createEl('input', {
        className: 'switch-map hidable-el',
        type: 'checkbox',
        title: '加入切换',
        checked: localStorage.getItem('isSelGoogleMap') === 'true' ? true : false,
        onchange: function() {
            localStorage.setItem('isSelGoogleMap', checkbox_switchMap.checked)
        },
        style: {
            marginTop: '2px',
            cursor: 'pointer',
        },
    })
    googleImageWrap.style.display = 'flex'
    googleImageWrap.style.alignItems = 'center'
    googleImageWrap.append(checkbox_switchMap)


    const checkDialog = $$('.vdr-container').find(dialog => dialog.$('.resizeable-modal-header')?.textContent == '审核列表')

    const checkbox_autoShow = createEl('input', {
        className: 'work-inspect-auto-show hidable-el',
        type: 'checkbox',
        title: '有批注时自动弹出',
        checked: _ds.isOpenAutoShow_Panel,
        onchange: function() {
            localStorage.setItem('isOpenAutoShow_Panel', checkbox_autoShow.checked)
        },
        style: {
            margin: '1px 0 0 5px',
            cursor: 'pointer',
        }
    })

    const checkTit = checkDialog.$('.resizeable-modal-header :nth-child(1)')
    checkTit.style.display = 'flex'
    checkTit.style.alignItems = 'center'
    checkTit.append(checkbox_autoShow)

    let isCurFirstRoundAddRow = true
    obs(checkDialog, mrs => {
        // console.log('%c------', 'color: darkseagreen', mrs);
        [...mrs].forEach(mr => {
            Array.from(mr.addedNodes).forEach(an => {
                // console.log('an', an, mr)
                if(an.nodeType == 1 && an.matches('.el-table__row')) {
                    const textarea = an.$('textarea')
                   textarea.addEventListener('input', function(e) {
                        this.style.height = this.scrollHeight+'px'
                    })

                    if(_ds.isHasWorkInspect && _ds.isOpenAutoShow_Panel && checkDialog.style.display == '') {
                        if(!isCurFirstRoundAddRow) textarea.focus()
                    } else {
                        textarea.focus()
                    }
                }
            })

            if(mr.type == 'attributes' && mr.target.matches('.vdr-container') && mr.target.style.display !== 'none') {
                mr.target.$$('textarea').forEach(textarea => {
                    setTimeout(() => {
                        textarea.style.transition = '.1s all'
                        textarea.style.height = textarea.scrollHeight+'px';
                    }, 200)
                    // console.log('resize')
                })
            }
        });

        if(isCurFirstRoundAddRow) {
            let r_findRow = [...mrs].find(mr => {
                const ans = [...mr.addedNodes]
                for(let i = 0; i < ans.length; i++) {
                    if(ans[i].nodeType == 1 && ans[i].matches('.el-table__row')) return ans
                }
            })
            if(r_findRow) isCurFirstRoundAddRow = false
        }


    }, { childList: true, subtree: true ,attributes: true, attributeOldValue: true, attributeFilter: ['style']})


    // initCountPanel()

    const configCard = $$('.el-card').find(card => card.textContent.startsWith('底图'))
    if(configCard.style.display === 'none') {
        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "KeyW",
            key: "w",
            keyCode: 87
        }))
    };

    [['腾讯地图', 'https://map.qq.com'], ['高德地图', 'https://ditu.amap.com'], ['百度地图', 'https://map.baidu.com']].forEach(([mapName, href]) => {
        [...configCard.$$('label')].find(label => label.textContent == mapName).addEventListener('mousedown', e => {
            if(e.button == 1) {
                window.open(href, '_blank')
            }
        })
    })

    $$('.el-card .el-checkbox__label').forEach(el => (el.title = el.textContent))

    const hangObs = obs($('div[aria-label="任务挂起"]'), mrs => {
        [...mrs].forEach(mr => {
            Array.from(mr.addedNodes).forEach(an => {
                // console.log('挂起', an)
                if(an.matches('.el-dialog')) {
                    const btnsWrap = document.createElement('div');
                    setStyle(btnsWrap, {
                        display: 'flex',
                        margin: '-20px 0 0 25px',
                    });

                    ['楼栋大规模无识别', '楼栋大规模无楼号', '合并后需要二次作业'].forEach(item => {
                        const div = document.createElement('div')
                        setStyle(div, {
                            marginLeft: '5px',
                            padding: '0 5px',
                            height: '25px',
                            lineHeight: '25px',
                            background: '#79bbff',
                            borderRadius: '5px',
                            fontSize: '12px',
                            color: '#fff',
                            cursor: 'pointer',
                        })
                        div.textContent = item
                        div.onclick = function() {
                            const input = $('div[aria-label="任务挂起"] input')
                            input.value = item;
                            ['input', 'change'].forEach((event) => input.dispatchEvent(new Event(event)))
                            setTimeout(an.click.bind(an), 400)
                        }

                        btnsWrap.append(div)
                    })
                    $('div[aria-label="任务挂起"] .el-dialog__body').insertAdjacentElement('afterend', btnsWrap)

                    hangObs.disconnect()
                }
            })
        })
    }, {childList: true, subtree: true})

    obs($('.sidebar'), mrs => {
        // console.log('%c------', 'color: darkseagreen', mrs);
        [...mrs].forEach(mr => {
            Array.from(mr.addedNodes).forEach(an => {
                // console.log('an', an, mr)
                if(!_ds.idTextBeingObs && an?.classList?.contains('el-form-item') && an.$('.id-text')) {
                    _ds.idTextBeingObs = true
                    obs($('.id-text'), (mrs)=> {
                        mrs.forEach(mr => {
                            Array.from(mr.addedNodes).forEach(an => {
                                if(an.nodeName !== '#text') return
                                if( _ds.mode == 'edit') analysisName(getFormItem('名称').$('input').value)

                                checkAddress()

                                //保持位置
                                $('.address-wrap') && getFormItem('地址')?.insertAdjacentElement('afterend', $('.address-wrap'))
                                $('.type-wrap') && getFormItem('类型')?.insertAdjacentElement('afterend', $('.type-wrap'))

                                setColumnStyle()

                            })
                        })
                    }, { childList: true, subtree: true })

                    if(_ds.mode == 'edit') {
                        initResizeBar()
                        initNameItem()
                        initTypeBtns()
                    }
                    initAddressItem()
                    checkAddress()

                    setColumnStyle()

                    function setColumnStyle() {
                        const curId = $('.id-text').textContent
                        $$('.block-aoi-sel-panel .column')?.forEach((column => {
                            column.style.background = column.aoiId == $('.id-text').textContent ? '#ccc' : null
                        }))
                    }
                }

                if((an?.matches?.('.el-autocomplete') || an?.matches?.('.el-input')) && an?.parentElement?.parentElement.textContent.startsWith('名称')) {
                    an.$('input').addEventListener('input', function(e) {
                        if(getFormItem('小区标识')) analysisName(this.value)
                    })
                }

            })
        })
    }, { childList: true, subtree: true })

    const switchElShow = $$('.el-switch').find(switchBtn => switchBtn?.parentElement?.textContent == ' 要素列表 ')
    const checkbox_area = $$('.el-checkbox').find(item => item.textContent.startsWith('作业范围'))?.$('input')
    const checkbox_mark = $$('.el-checkbox').find(item => item.textContent.startsWith('质检图层'))?.$('input')
    let isOpen_area_real
    let isOpen_mark_real
    obs(switchElShow, mrs => {
        const curOpen_area_real = checkbox_area.parentElement.matches('.is-checked')
        const curOpen_mark_real = checkbox_mark.parentElement.matches('.is-checked')
        if(!switchElShow.matches('.is-checked')) {
            isOpen_area_real = curOpen_area_real
            isOpen_mark_real = curOpen_mark_real
            curOpen_area_real && checkbox_area.click()
            curOpen_mark_real && checkbox_mark.click()
            document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 27, key: "Escape" }))
        } else {
            isOpen_area_real && !curOpen_area_real && checkbox_area.click()
            isOpen_mark_real && !curOpen_mark_real && checkbox_mark.click()
        }
    }, {attributes: true, attributeFilter: ['class']})

    document.addEventListener('keydown', async (e) => {
        // console.log(e, e.keyCode)
        if(['input[type="text"]', 'input[type=""]', 'textarea'].find(lab => document.activeElement?.matches(lab))) return

        if(e.key.toUpperCase() == 'X' && !e.ctrlKey) {
            const LinkAOI_id = $$('.member-container input')?.[1].value
            LinkAOI_id && searchSite(LinkAOI_id)
        }

        if(e.keyCode == 9) {
            e.preventDefault()

            const baseMaps = ['腾讯地图', '高德地图', '百度地图', '谷歌地图']
            const imageMaps = ['腾讯影像', '高德影像', '谷歌影像']

            const card = [...$$('.el-card')].find(card => card.textContent.startsWith('底图'));
            const curSel = card.$('.el-radio-group .el-radio.is-checked').textContent
            const maps = isBelongToBaseMap() ? baseMaps : imageMaps

            selectMap(selectMap( isBelongToBaseMap() ? localStorage.getItem('isSelGoogleMap') === 'true' ? '谷歌影像' : '腾讯影像' : '腾讯地图'))

            function selectMap(name) { card.$$('.el-radio-group .el-radio').find(elRadio => elRadio.textContent == name)?.$('input[type="radio"]').click() }

            function isBelongToBaseMap() { return baseMaps.includes(curSel)}
        }

        if(e.keyCode == 32) {
            e.preventDefault()

            const baseMaps = ['腾讯地图', '高德地图', '百度地图', '谷歌地图']
            const imageMaps = ['谷歌影像', '腾讯影像', '高德影像']

            const card = [...$$('.el-card')].find(card => card.textContent.startsWith('底图'));
            const curSel = card.$('.el-radio-group .el-radio.is-checked').textContent

            const maps = isBelongToBaseMap() ? baseMaps : imageMaps
            const idx = maps.indexOf(curSel)

            if(localStorage.getItem('isSelGoogleMap') !== 'true') {
                if(maps == baseMaps) {
                    selectMap( idx < maps.length-2 ? maps[idx+1] : maps[0] )
                } else {
                    selectMap( idx !== maps.length-1 ? maps[idx+1] : maps[1] )
                }
            } else {
                selectMap( idx !== maps.length-1 ? maps[idx+1] : maps[0] )
            }


            function selectMap(name) {
                card.$$('.el-radio-group .el-radio').find(elRadio => elRadio.textContent == name).$('input[type="radio"]').click()
            }

            function isBelongToBaseMap() { return baseMaps.includes(curSel)}
        }

        //【G】
        if(e.keyCode == 71) {
            _ds.checkDialog?.display(void 0, {isCloseOther : true})
            _ds.showCheckDialog_once = true
        }

        //【Y】
        if(e.keyCode == 89) {
            const btn_deleLink = $$('.member-panel button').find(btn => btn.$('use')?.getAttribute?.('xlink:href') === '#icon-shanchu')
            if(btn_deleLink) {
                btn_deleLink.click()
                showMessage('取消关联')
            } else {
                showMessage('当前未关联')
            }
        }

        //【H】
        if(e.keyCode == 72) {
            $$('.hidable-el').forEach(el => {
                el && (el.style.visibility = _ds.isHide ? 'visible' : 'hidden')
            })
            _ds.isHide = !_ds.isHide
        }

        if(e.key.toUpperCase() == 'C' && !e.ctrlKey) {
            const nameFormItem = getFormItem('名称')
            if(!nameFormItem) return showMessage('未查询到名称', {type: 'error'})
            navigator.clipboard.writeText(nameFormItem.$('input').value).then(resolve => {
                showMessage('复制成功', {type: 'success'})
            })
        }

        if(e.key.toLowerCase() == 's' && e.ctrlKey) {
            e.preventDefault()
            $$('.container.top button').find(btn => btn.$('use')?.getAttribute('xlink:href') === '#icon-baocun').click()
        }

        const keyMap = {
            49: 'poi',
            50: '楼栋',
            51: '无留白aoi',
        }
        if(Object.keys(keyMap).find(item => +item == e.keyCode)) {
            const label = $$('.el-card .el-tree[role="tree"] label').find(label => label.nextElementSibling.textContent === keyMap[e.keyCode])

            if(label.matches('.is-checked')) document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 27, key: "Escape" }))
            label.$('input')?.click()
        }

        if(e.code == 'Digit4') {
            $$('.el-card .el-tree[role="tree"] svg.set-label').find(svg => svg.parentElement.previousElementSibling.textContent == 'poi').dispatchEvent(new MouseEvent('click'))
            _ds.isConfigLabel_POI = true
        }
    })

    function selTypeLabel(target) {
        const seq = target === '住宅小区' ? ['商务住宅', '住宅区', '住宅小区'] : ['地名地址信息', '门牌信息', '楼栋号'];
        const typePopper = $$('.el-popper').find(item => item?.textContent?.startsWith('商务住宅'));
        seq.forEach((item, idx) => {
            setTimeout(() => {
                const checkBox = typePopper.$$('li').find(li => li.textContent.includes(item))?.$('.el-checkbox__original')
                if(checkBox && !checkBox.checked) checkBox.click()
            })
        })
    }

    function initFooter_custom(ischeck = true) {
        _ds.relationCount = _ds.annotation.valid_relations.length

        const countWrapper = createEl('div',{
            className: 'count-wrap hidable-el'
        })

        const linkCount = createEl('div', {
            id: 'relation-count',
            innerText: `关联对数：${_ds.relationCount}`,
            onclick: function() {
                if(_ds.relationCount !== 0) {
                    _ds.statisticDialog?.display(void 0, {isCloseOther : true})
                } else {
                    showMessage('统计结果为空')
                }
            }
        })

        const checkBtn = createEl('div', {
            className: 'check-btn',
            innerText: '检查 (G)',
            onclick: function() {
                _ds.checkDialog.display(true, {isCloseOther : true})
                _ds.showCheckDialog_once = true
            }
        })

        const tip = createEl('span', {
            innerText: '（保存后更新）'
        })

        setStyle(new Map([
            [countWrapper,{
                display: 'flex',
                alignItems: 'end',
            }],[linkCount, {
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
            }], [ tip, {
                color: 'gainsboro',
                fontSize: '12px',
                userSelect: 'none',
            }], [checkBtn, {
                width: '60px',
                height: '20px',
                lineHeight: '20px',
                textAlign: 'center',
                background: '#999',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '20px',
                color: '#fff',
                fontSize: '13px',
                marginBottom: '2.5px',
            }]
        ]))

        countWrapper.append(linkCount, tip)
        if(ischeck) countWrapper.append(checkBtn)
        $('.container.footer .list-wrap').insertAdjacentElement('afterend', countWrapper)
    }

    function initResizeBar() {
        const sidebar = $('.sidebar')
        setStyle(sidebar, {
            transition: '.3s ease-out all',
            top: 'initial',
            bottom: '0',
        })

        const bar = createEl('div', {
            className: 'hidable-el',
            style: {
                width: '100%',
                height: '6px',
                background: '#eee',
                borderRadius: '5px',
                marginBottom: '5px',
                cursor: 'row-resize',
            }
        })


        const attrPanel = $('#pane-attribute .attr-panel')
        let isMousedown = false
        const storedSubHeight = localStorage.getItem('attrPanel_subHeight')

        let marginTop = storedSubHeight ? +storedSubHeight : 0
        bar.addEventListener('mousedown', e => {
            if (e.button !== 0) return
            e.preventDefault()
            const sidebarTrans = sidebar.style.transition
            if(sidebarTrans) sidebar.style.transition = null
            isMousedown = true
        })
        document.addEventListener('mousemove', (e) => {
            if (!isMousedown) return

            marginTop += e.movementY
            if(marginTop >=0 && marginTop <= 500) {
                sidebar.style.height = `calc(100% - ${marginTop}px)`
                localStorage.setItem('attrPanel_subHeight', marginTop)
            } else if(marginTop < 0) {
                marginTop = 0
            } else if(marginTop > 500) {
                marginTop = 500
            }
        })
        document.addEventListener('mouseup', () => (isMousedown = false))

        attrPanel.insertAdjacentElement('afterbegin', bar)

        if(!storedSubHeight) return
        if(storedSubHeight >= 0 && storedSubHeight <= 600) {
            sidebar.style.height = `calc(100% - ${storedSubHeight}px)`
        } else {
            localStorage.setItem('attrPanel_subHeight', 0)
        }
    }

    function initNameItem() {
        const nameItem = getFormItem('名称')

        const name_wrap = document.createElement('div')
        const modify_wrap = document.createElement('div')
        const replace_wrap = document.createElement('div')
        const nameInput_custom = createEl('input', {
            oninput: function () {
                analysisName(nameItem.$('input').value)
            }
        })
        const louInput_custom = document.createElement('input')
        const replaced_custom = document.createElement('input')
        const replace_custom = document.createElement('input')
        const btn_fold = document.createElement('div')
        const btn = createEl('button', {
            style: {
                cursor: 'pointer'
            },
        })
        const btn_replace = createEl('button', {
            style: {
                cursor: 'pointer'
            },
        })
        const associate_btnWrap = createEl('div', {
            className: 'associate-btn_wrap hidable-el'
        })



        const idItem = $$('.sidebar .el-form-item').find(item => item.querySelector('.el-form-item__label')?.innerText === '要素id')
        idItem.style.marginBottom = '10px'
        nameItem.style.marginBottom = '0'
        nameItem.$('input').addEventListener('input', function(e) {
            analysisName(this.value)
        })

        btn.id = 'modify-name'
        btn_replace.id = 'replace-name'
        name_wrap.className = 'name-wrap hidable-el'
        nameInput_custom.className = 'name-input'
        louInput_custom.className = 'lou-input';

        [nameInput_custom, louInput_custom, replaced_custom, replace_custom].forEach(input => input.setAttribute('type', 'text'))

        setStyle(new Map([
            [name_wrap, {
                overflow: 'hidden',
                height: '24px',
                marginTop: '5px',
                marginBottom: '15px',
                transition: '.2s all',
            }],
            [[modify_wrap, replace_wrap], {
                display: 'flex',
                justifyContent: 'end',
            }],[modify_wrap, {
                marginBottom: '5px'
            }],[btn_fold, {
                userSelect: 'none',
                textAlign: 'center',
                width: '16px',
                height: '16px',
                paddingLeft: '0px',
                marginRight: '2px',
                lineHeight: '14px',
                fontSize: '12px',
                color: '#fff',
                borderRadius: '4px',
                background: 'rgb(187, 187, 187)',
                transition: '.2s all',
                cursor: 'pointer',
            }], [[nameInput_custom, louInput_custom, replaced_custom, replace_custom], {
                outline: 'none',
            }],
            [associate_btnWrap, {
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'end',
                width: '100%',
                height: '25px',
                marginBottom: '6px',
            }],
            [[nameInput_custom, louInput_custom, btn, replace_custom, replaced_custom, btn_replace], {
                border: '1px solid #999',

            }]
        ]))
        nameInput_custom.style.width = replaced_custom.style.width = '115px'
        louInput_custom.style.width = replace_custom.style.width = '85px'
        btn.textContent = '修改'
        btn_replace.textContent = '替换'
        btn_fold.textContent = '>'
        btn.style.cursor = btn_replace.style.cursor = 'pointer'

        //数据还原与后期更新
        ;[
            ['name', nameInput_custom],
            ['louhao', louInput_custom],
            ['replacedValue', replaced_custom],
            ['replaceValue', replace_custom]
         ].forEach(([storedKey, input]) => {
            const storedValue = localStorage.getItem(storedKey)
            if(_ds.taskId === localStorage.getItem('lastTaskId')) {
                input.value = storedValue !== null ? storedValue : ''
            } else {
                localStorage.setItem(storedKey, '')
            }

            input.addEventListener('input', ()=> {
                localStorage.setItem(storedKey, input.value)
                localStorage.setItem('lastTaskId', getParamValue('taskId'));
            })
        })


        btn.addEventListener('contextmenu', e => {
            e.preventDefault()
            //楼栋AOI不能改
            if(!getFormItem('小区标识')) return showMessage('该功能仅对POI有效', {type: 'warning'})

            const nameItem = getFormItem('名称')
            const nameInput = nameItem.$('input')
            nameInput.value = nameInput_custom.value+louInput_custom.value.replace(/ +/g, '');

            ['input', 'change'].forEach((item) => { nameInput.dispatchEvent(new Event(item)) })
        })

        btn.addEventListener('click', e => {
            e.preventDefault()
            //楼栋AOI不能改
            if(!getFormItem('小区标识')) return showMessage('该功能仅对POI有效', {type: 'warning'})

            //收集名称input的所有数字
            const nameItem = getFormItem('名称')
            const nameInput = nameItem.$('input')
            const originCommunityNameVal = nameInput.value


            const trimNameInpVal = nameInput_custom.value.replace(/ +/g, '') //去空格

            const findNumReg = new RegExp('(\\d+)', 'g')
            const findIdx = originCommunityNameVal.indexOf(trimNameInpVal)
            findNumReg.lastIndex = findIdx !== -1 ? findIdx+trimNameInpVal.length : 0

            let digitArr = []
            let execRes
            while(execRes = findNumReg.exec(nameInput.value)) {
                digitArr.push(execRes[1])
            }

            let suffix = ''
            if(digitArr.length > 1) {
                suffix = digitArr[0] + louInput_custom.value.trimStart()
                digitArr.shift()
                suffix = suffix.replace(/ +/g, ()=> {
                    const digit = digitArr[0]
                    if( digit !== void 0 ) {
                        digitArr.shift()
                        return digit
                    } else {
                        return ''
                    }
                })
            } else {
                if(digitArr.length == 1) suffix = digitArr[0] + louInput_custom.value.trimStart()
                suffix = suffix.replace(/ +/g, '')
            }

            setInputValue(nameInput, trimNameInpVal + suffix)
        })

        btn_replace.addEventListener('click', e => {
            e.preventDefault()

            const nameInput = getFormItem('名称').$('input')
            const str = nameInput.value
            const reg = new RegExp(replaced_custom.value ? `(${replaced_custom.value})` : `([^\\d]*)(?=\\d+)`)
            setInputValue(nameInput, str.replace(reg, ()=> replace_custom.value))
        })

        btn_fold.onclick = function(e) {
            const curTramsform = e.currentTarget.style.transform

            e.target.style.transform = curTramsform ? null : 'rotate(90deg)'
            name_wrap.style.height = curTramsform ? '24px' : name_wrap.scrollHeight+'px'
            localStorage.setItem('isFold', curTramsform ? 'fold' : 'unfold')
        }

        modify_wrap.append(btn_fold, nameInput_custom, louInput_custom, btn)
        replace_wrap.append(replaced_custom, replace_custom, btn_replace)
        name_wrap.append(modify_wrap, replace_wrap)
        nameItem.insertAdjacentElement('afterend', name_wrap)
        nameItem.insertAdjacentElement('beforebegin', associate_btnWrap)

        const storedIsFold = localStorage.getItem('isFold')
        setTimeout(() => { //此时FormItem已渲染，但panel还没解除隐藏
            if(storedIsFold !== null) {
                btn_fold.style.transform = storedIsFold == 'fold' ? null : 'rotate(90deg)'
                name_wrap.style.height = storedIsFold == 'fold' ? '24px' : name_wrap.scrollHeight+'px'
            }
        })

        analysisName(nameItem?.$('input').value)

    }

    function initTypeBtns() {
        const typeItem = getFormItem('类型')
        typeItem.style.marginBottom = '0'

        const typeWrap = document.createElement('div');
        typeWrap.className = 'type-wrap hidable-el'
        setStyle(typeWrap, {
            display: 'flex',
            justifyContent: 'end',
            margin: '3px 0 10px',
        });

         [['住宅小区', 'zhuzhaixiaoqv'], ['楼栋号', 'loudonghao']].forEach(([target, id]) => {
             const typeBtn = document.createElement('div');
             typeBtn.id = id
             typeBtn.innerText = target
             setStyle(typeBtn, {
                 boxSizing: 'content-box',
                 marginLeft: '3px',
                 padding: '3px 5px',
                 fontSize: '12px',
                 height: '18px',
                 lineHeight: '18px',
                 background: 'rgb(64, 158, 255, .95)',
                 color: '#fff',
                 borderRadius: '8px',
                 cursor: 'pointer'

             });
             typeBtn.addEventListener('click', () => {
                 selTypeLabel(target)
                 showMessage('类型已修改', {type: 'success', showTime: 1000})
             })
             typeWrap.append(typeBtn)
         })
        typeItem.insertAdjacentElement('afterend', typeWrap)
    }

    function initAddressItem() {
        const addressItem = getFormItem('地址')
        const addressInput = addressItem.$('input')
        addressItem.style.marginBottom = '0'
        addressInput.addEventListener('input', ()=> checkAddress(addressInput_custom))


        const address_wrap = createEl('div', {
            className: 'address-wrap hidable-el',
        })
        const primaryWrap = createEl('div')
        const flodWrap = createEl('div')
        const addressInput_custom = createEl('input', {
            className: 'addressInput-custom',
            type: 'text',
            oninput: function() {
                localStorage.setItem('address', addressInput_custom.value)
                localStorage.setItem('lastTaskId', getParamValue('taskId'));

                addressInput_custom.title = addressInput_custom.value
                checkAddress(addressInput_custom)
            }
        })
        const btn = createEl('button', {
            id: 'modify-address',
            textContent: '修改',
            style: {
                border: '1px solid #999'
            },
            onclick: function(e) { //地址可继用
                e.preventDefault()
                addressInput.value = addressInput_custom.value?.replace(/ +/g, '');
                ['input', 'change'].forEach((item) => { addressInput.dispatchEvent(new Event(item)) })
            }
        })
        const textarea = createEl('textarea', {
            value: localStorage.getItem('addressPresetScheme') ?? _ds.textareaDefaultVal,
            wrap: 'off',
            placeholder: '预设方案',
            oninput: function() {
                localStorage.setItem('addressPresetScheme', this.value)
                this.style.color = /[:|,]/.test(this.value) ? 'red' : null
            }
        })
        const btn_fold = createEl('div', {
            textContent: '>',
            onclick: function(e) {
                const curTramsform = e.currentTarget.style.transform

                e.target.style.transform = curTramsform ? null : 'rotate(90deg)'
                address_wrap.style.height = curTramsform ? '32px' : address_wrap.scrollHeight+'px'
            }
        })
        const btn_resetDefaultVal = createEl('button', {
            innerText: '重置',
            onclick: function(e) {
                e.preventDefault()
                textarea.value = _ds.textareaDefaultVal
                textarea.dispatchEvent(new Event('input'))
            }
        })

        setStyle(new Map([
            [address_wrap, {
                overflow: 'hidden',
                height: '32px',
                transition: '.2s all',
                marginBottom: '15px'
            }],
            [primaryWrap, {
                display: 'flex',
                justifyContent: 'end',
                marginTop: '5px',
                marginBottom: '6px',
            }],
            [flodWrap, {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'end',
                alignItems: 'end',
            }],
            [addressInput_custom, {
                width: '165px',
                outline: 'none',
                border: '1px solid #999',
            }],
            [textarea, {
                height: '150px',
                width: '206px',
                overflow: 'auto',
                resize: 'none',
                outline: 'none',
                padding: '3px 5px',
                transition: '.3s all',
                border: '1px solid #999',
            }],
            [btn_fold, {
                userSelect: 'none',
                textAlign: 'center',
                width: '16px',
                height: '16px',
                paddingLeft: '0px',
                marginRight: '2px',
                lineHeight: '14px',
                fontSize: '12px',
                color: '#fff',
                borderRadius: '4px',
                background: 'rgb(187, 187, 187)',
                transition: '.2s all',
                cursor: 'pointer',
            }],
            [btn_resetDefaultVal, {
                marginTop: '3px'
            }],
            [[btn, btn_resetDefaultVal], {
                border: '1px solid #999',
                cursor: 'pointer',
            }]
        ]))

        const storedValue = localStorage.getItem('address')

        if(_ds.taskId === localStorage.getItem('lastTaskId') && storedValue !== null && storedValue !== '') {
            addressInput_custom.value = storedValue
        } else {
            localStorage.setItem('address', _ds.addressDefaultVal)
            addressInput_custom.value = _ds.addressDefaultVal
        }

        primaryWrap.append(btn_fold, addressInput_custom, btn)
        flodWrap.append(textarea, btn_resetDefaultVal)
        address_wrap.append(primaryWrap, flodWrap)
        addressItem.insertAdjacentElement('afterend', address_wrap)
    }

    function checkAddress() {
        const input = $('.addressInput-custom')
        const addressItem = getFormItem('地址')
        if(!addressItem) return
        // if(!getFormItem('楼层数')) return (addressItem.$('label').style.color = null)
        addressItem.$('label').style.color = addressItem.$('input').value !== input?.value ? 'coral' : null
    }

})();

function analysisName(value) {
    if(!getFormItem('小区标识')) return
    const associate_btnWrap = $('.associate-btn_wrap')
    const nameInput_custom = $('.name-input')
    const arr = []

    if(value) arr.push(value)
    if(nameInput_custom.value) {
        const r = new RegExp(`^${nameInput_custom.value}(.*)`).exec(value)?.[1]
        r && arr.push(r)
    }

    if(value) associate_btnWrap.innerHTML = ''
    arr.forEach(item => {
        const btn = createEl('div', {
            innerText: item,
            style: {
                cursor: 'pointer',
                padding: '0 5px',
                marginLeft: '5px',
                borderRadius: '8px',
                height: '22px',
                lineHeight: '22px',
                textAlign: 'center',
                background: '#f0f0f0',
                color: '#555',
                fontSize: '11px',
            },
            onclick: function() {
                setInputValue(getFormItem('名称').$('input'), item)
            }
        })
        associate_btnWrap.append(btn)
    })
}

async function init() {
    let hasCheckBtn = false
    let submitBtnAppear = false
    let submitBtn

    return new Promise(res => {
        obs(document, mrs => {
            // console.log('%c====', 'color: red', mrs)
            Array.from(mrs).forEach(mr => {
                Array.from(mr.addedNodes).forEach(an => {
                    // an.nodeName !== '#text' && !an.nodeValue?.includes('经纬度') && console.log('an', an, mr)

                    if(!submitBtn && (submitBtn = $$('button').find(btn => btn.$('use')?.getAttribute('xlink:href') === '#icon-submit'))) {
                        submitBtn.addEventListener('mouseenter', ()=> {
                            if(!_ds.showCheckDialog_once) alert('提示：本次初始化，未打开过检查')
                        })
                        submitBtnAppear = true
                    }

                    if(an?.matches?.('.container') && an?.parentElement.id === 'app') res(true)

                    if(an?.matches?.('.el-message.el-message--error') && an.textContent.includes('领取失败,任务id有误或类型不符合作业要求或没有找到待审核的任务包')) {
                        setTimeout(() => {
                            if(confirm('是否跳转至查看模式？')) window.open(`https://jdl-mapdata.jd.com/editor/?mode=readonly&taskId=${_ds.taskId}`, '_blank')
                        },1500)
                    }

                    if(_ds.isOpenAutoShow_Panel && !hasCheckBtn && an.nodeType == Node.ELEMENT_NODE && $$('button').find(btn => btn.textContent.includes('审核列表'))) {
                        // alert('点击')

                        _ds.isWorkInspectP.promise.then((resolve)=> {
                            _ds.isHasWorkInspect = resolve
                            if(resolve) $$('button').find(btn => btn.textContent.includes('审核列表')).click()
                        })

                        hasCheckBtn = true
                    }

                    if(an?.parentElement?.matches('.image-list-gap')) {
                        switchRaodNet()
                        function switchRaodNet() {
                            const txImageWrap = $$('.el-card__body .el-radio-group>*').find(item => item.textContent.includes('腾讯影像'))
                            const checkboxWrap = txImageWrap.$('.el-checkbox')
                            checkboxWrap.classList.remove('is-disabled')
                            checkboxWrap.$('input').disabled = false
                            checkboxWrap.click()
                        }
                    }

                    if(an?.matches?.('.el-overlay') && an.innerText.startsWith('选择关联')) {
                        an.$('.el-message-box__container .el-radio__original')?.click()

                        _ds.isSelLink && an.$$('button').find(btn => btn.innerText.includes('确定'))?.click()

                        _ds.isSelLink = false
                        _ds.operateTimer = null
                    }

                    if(an?.matches?.('.v3-menus') && an.innerText.startsWith('关联AOI')) {
                        const linkAOIWrap = an.$$('.menu-item').find(item => item.innerText == '关联AOI').parentElement
                        const autoLinkDom = linkAOIWrap.cloneNode(true)
                        const configDom = linkAOIWrap.cloneNode(true)
                        configDom.$('.menu-label').innerText = '一键配置';
                        autoLinkDom.$('.menu-label').innerText = '一键关联';
                        configDom.onclick = ()=> {
                            disassociate()
                            clickLink();

                            ['#modify-name', '#modify-address', '#loudonghao'].forEach(id => $(id).click())
                        }
                        autoLinkDom.onclick = ()=> {
                            disassociate()
                            clickLink()
                        }

                        //待优化
                        linkAOIWrap.insertAdjacentElement('beforebegin', autoLinkDom)
                        linkAOIWrap.insertAdjacentElement('beforebegin', configDom)

                        function disassociate() {
                            const btn_deleLink = $$('.member-panel button').find(btn => btn.$('use')?.getAttribute?.('xlink:href') === '#icon-shanchu')
                            btn_deleLink?.click()
                        }

                        function clickLink() {
                            linkAOIWrap.click()
                            _ds.isSelLink = true
                            _ds.operateTimer = setTimeout(() => {_ds.isSelLink = false}, 3000);
                        }
                    }

                    if(an?.matches?.('.el-popper') && (an.innerText === getFormItem('地址')?.$('input').value || an.innerText === getFormItem('名称')?.$('input').value)) an.style.visibility = 'hidden'

                    if(an.matches?.('.el-message') && an.innerText.includes('修改数据较多，请及时保存')) {
                        if($('.el-message')?.innerText.includes('修改数据较多，请及时保存')) an.style.display = 'none'
                    }

                    if(!_ds.isInitLabelConfigDialog && an?.matches?.('.el-dialog') && an.textContent.startsWith('label 配置')) {
                        const dialogWrap = an.parentElement.parentElement
                        obs(dialogWrap, (mrs)=> {
                            if(_ds.isConfigLabel_POI && dialogWrap.style.display == '') configName()
                            _ds.isConfigLabel_POI = false
                        }, {childList: true, attributes: true, attributeFilter: ['style']})

                        if(_ds.isConfigLabel_POI) configName()
                        _ds.isInitLabelConfigDialog = true

                        function configName() {
                            setTimeout(() => an.$$('.el-checkbox').find(checkbox => checkbox.textContent == '名称').click())
                            setTimeout(() => an.$$('button').find(btn => btn.textContent.trim() == '确定').click())
                        }
                    }
                })
            })
        })
    })
}

function judgeIsChange(real, cur) {
    const cur_processed = Array.from(new Set(cur.flat(Infinity)))
    const real_processed = Array.from(new Set(real.flat(Infinity)))

    return !(cur_processed.length == real_processed.length && new Set([...cur_processed, ...real_processed]).size == cur_processed.length)
}

function getFormItem(label) {
    return $$('.sidebar .el-form-item').find(item => item.querySelector('label')?.innerText === label)
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

function searchSite(value) {
    setInputValue($('.loc-search input'), value);
    $('.loc-search .search-container').click()
    setTimeout(setInputValue.bind(this, $('.loc-search input'), ''));
}

function setInputValue(input, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    nativeInputValueSetter.call(input, value);
    ['input', 'change'].forEach((event) => input.dispatchEvent(new Event(event, { bubbles: true })))
};


function obs(target, callBack, options = { childList: true, subtree: true, attributes: true, attributeOldValue: true}) {
    if(!target) return console.error('目标不存在')

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

/**
日志：
2024/5/15：
- 新增：关联楼栋AOI时，自动选中首个关联项。
- 新增：POI名称修改按钮。
- 新增：楼栋AOI类型为空时，自动修改为楼栋号；楼栋POI则只要选中就会修改。
- 新增：地址修改按钮。

2024/5/16：
- 新增：楼栋POI右键菜单新增快捷关联，当只有一个关联项时自动关联。
- 新增：类型修改的按钮组。
- 优化：进入新项目时，清空名称和地址输入框的值。
- 新增：POI名称修改，新增楼栋号输入框。

2024/5/17：
- 新增：挂起按钮组。
- 新增：进入任务包后自动调出配置面板。
- 新增：快捷关联集成POI的名称、类别、地址修改。
- 新增：名称校验。
- 新增：地图链接跳转。
- 新增：【Ctrl+S】保存。

2024/5/19：
- 调整：楼栋AOI类型为空或不为楼栋号时，自动修改为楼栋号；楼栋POI需要手动修改。

2024/5/20：
- 新增：当保存提示框数量大于1时隐藏。
- 新增：关联对统计

2024/5/21：
- 调整：取消点击AOI同步楼栋号
- 调整：【POI一键配置】取消名称的修改
- 新增：一键关联

2024/5/27：
- 新增：审核列表对话框的textarea高度适配

2024/5/28
- 新增：新增对名称特定字段替换功能。

2024/5/29
- 优化：保存替换名称模块的展开/收起状态
- 优化：新增关联对统计的id选中记录
- 新增：属性面板竖向拖动功能
- 新增：【1】打开/关闭 楼栋AOI
- 新增：【2】打开/关闭 POI
- 新增：【3】打开/关闭 无留白

2024/6/1
- 新增：检查模块

2024/6/2
- 新增：右键名称修改按钮，保留数字
- 调整：左键名称修改按钮，去除空格
- 修复：聚焦radio和checkbox后，快捷键失效
- 完善：检查模块

2024/6/5
- 新增：【F】隐藏注入要素

2024/6/6
- 调整：一键关联在关联之前取消关联
- 新增：【F】隐藏.type-wrap
- 新增：地址输入框新增[河北省]

2024/6/7
- 新增：地址输入栏空格过滤
- 新增：【Y】取消关联
- 调整：obs加入有效目标判断
- 适配：适配审核界面

2024/6/25
- 调整：地址输入框前缀【河北省】改为【山西省】

2024/7/16
- 新增：【Tab】切换底图和影像
- 调整：对话框面板解除文字不可选中
- 调整：【1】显隐poi  【2】显隐楼栋面
- 修复：检查面板的中的数据与底图不一致

2024/7/19
- 调整：地址预设值调整为【黑龙江省】

2024/7/21
- 修复：作业范围内无AOI或POI时，面板加载不出的问题
- 新增：根据项目id动态变更预设值
- 新增：空格切换 底图/影像
- 新增：新增勾选框控制谷歌地图的tab切换和空格切换
- 新增：初始化时，关闭腾讯影像路网

2024/7/22
- 新增：审核新增批注时，自动选中文本域
- 新增：数据包有审核批注时，自动打开批注面板
- 新增：新增自动打开批注的开关

2024/7/25
- 补充：地址预设值加入【江苏省】

2024/7/26
- 调整：隐藏脚本注入要素【F】改为【H】
- 适配：测试服的检查
- 调整：检查模块，POI名称和地址的归纳项
- 适配：测试服审核模式与查看模式

2024/7/29
- 新增：【4】显隐 poi 的label名称
- 修复：修复自定义地址值为空时，未重置为默认值的问题
- 新增：【C】复制名称

2024/7/30
- 新增：地址预设值：安徽省

2024/7/31
- 新增：楼栋面变更的检查
- 调整：不检查非小区的 小区aoi、小区poi 的类型
- 调整：不检查未关联的无留白AOI的类型

2024/8/3
- 优化：优化接口数据整理，调整检查代码逻辑

2024/8/4
- 新增：自定义地址预设值
- 调整：对话框组件

2024/8/5
- 修复：测试服楼栋面变更检查失效
- 修复：原始无留白面的类型检测
- 调整：名称修改按钮左键与右键功能互换

2024/8/6
- 新增：名称联想词。
- 优化：数字快捷键隐藏要素时，失焦选中要素。

2024/8/7
- 修复：名称联想功能，在POI与AOI之间切换后，无法对名称输入值实时分析。
- 调整：名称联想功能在名称输入值为空时不给出名称全称词

2024/8/8
- 调整：名称联想功能在名称输入值为空时保留最近一次有名称值POI的解析结果。

2024/8/11
- 新增：【X】选中当前聚焦的 POI 所关联的 AOI
- 调整：禁用关联 id 的 输入框选择功能，避免新增保存项
- 新增：自定义统计范围

2024/8/12
- 新增：检查poi名称变更
- 新增：检查poi是否存在作业记录

2024/8/13
- 调整：自定义无留白面板调整宽度
- 新增：释放按钮

2024/8/15
- 调整：撤销释放按钮
- 新增：检查项-小区关联对的名称不统一
- 新增：检查项-poi点位置超出关联面

2024/8/17
- 优化：优化 POI 名称归纳方式
- 新增：审核模式打开数据包失败时，尝试跳转只读模式
- 新增：调整任务详情展示，新增任务状态、挂起理由
- 优化：检查对话框-楼栋POI归纳项进行排序

2024/8/18
- 调整：不检查取消勾选的无留白面关联
- 优化：对无留白面选择面板的勾选项降序排列
- 修复：针对范围过大导致的数据获取失败，转用统计手动关联的方式计数。

2024/8/21
- 修复：底图数据获取失败
- 新增：提交前的检查提示

2024/8/22
- 修复：新建的poi修改名称，联想词不同步
- 新增：要素列表开关联动作业范围与质检图层的开关
- 调整：一键关联不再根据选项数暂停操作
*/