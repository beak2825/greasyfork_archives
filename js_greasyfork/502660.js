// ==UserScript==
// @name         loudong（Temp）
// @namespace    http://tampermonkey.net/
// @version      2024.8.8.2
// @description  try it
// @author       You
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=edit&taskId=*
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=check&taskId=*
// @match        https://beta-out-jdl-mapdata.jd.com/editor/?mode=readonly&taskId=*
// @match        https://jdl-mapdata.jd.com/editor/?mode=edit&taskId=*
// @match        https://jdl-mapdata.jd.com/editor/?mode=check&taskId=*
// @match        https://jdl-mapdata.jd.com/editor/?mode=readonly&taskId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502660/loudong%EF%BC%88Temp%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502660/loudong%EF%BC%88Temp%EF%BC%89.meta.js
// ==/UserScript==
class Dialog {
    constructor({title, container, footer}) {
        this.show = false

        const dialog = document.createElement('div')
        const dragBar = document.createElement('div')
        const header = document.createElement('div')
        const tit = document.createElement('div')
        const closeIcon = document.createElement('div')
        const containerWrap = document.createElement('div')
        const footerWrap = document.createElement('div')

        dialog.className = 'dialog'
        containerWrap.className = 'dialog-container'
        closeIcon.textContent = '×'
        tit.className = 'dialog-title'
        tit.textContent = title ?? 'Title'

        setStyle(new Map([
            [dialog, {
                display: this.show ? 'block' : 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgb(34, 34, 37, .8)',
                borderRadius: '5px',
                zIndex: 999,
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 12px',
                color: '#eee',
            }], [dragBar, {
                width: '100%',
                height: '12px',
                cursor: 'move',
            }],[header, {
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 15px',
                width: '100%',
                marginBottom: '8px',
            }],
            [tit, {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '550px',
                fontSize: '21px',
                cursor: 'default',
                color: '#fff',
            }],
            [closeIcon, {
                width: '25px',
                height: '25px',
                lineHeight: '21px',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '28px',
                color: '#ccc',
            }],
            [containerWrap, {
                position: 'relative',
                marginTop: '15px',
                padding: '0px 13px 0px 20px',
                width: '600px',
                height: '300px',
                // userSelect: 'none',
            }],
            [footerWrap, {
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                width: '100%',
                height: '40px',
                marginTop: '10px',
            }],
        ]))

        closeIcon.onclick = () => {
            dialog.display(false)
        }

        drag()

        header.append(tit, closeIcon)
        container && containerWrap.append(container)
        footer && footerWrap.append(footer)
        dialog.append(dragBar, header, containerWrap, footerWrap)
        document.body.appendChild(dialog)

        Object.setPrototypeOf(this.__proto__, dialog.__proto__)
        Object.setPrototypeOf(dialog, this.__proto__)
        return dialog

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

    display(isShow) {
        if(isShow === void 0) {
            this.style.display = this.show ? 'none' : 'block'
            this.show = !this.show
        } else {
            this.style.display = isShow ? 'block' : 'none'
            this.show = isShow
        }
    }
}


(async function() {

    window.$ = Document.prototype.$ = Element.prototype.$ = $
    window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$


    let l = true
    const _ds = {
        iframe: null,
        buildingName: '',
        taskId: getParamValue('taskId'),
        operateTimer: null,
        annotation: {
            workList: [],
            data: [],
            links: [],
            linkPOIs: [],
            linkAOIs: [],
        },
        checkDialog: null,
        isHide: false,
        waitWorkListP: Promise.withResolvers(),
        addressDefaultVal: '',
        isWorkInspectP: Promise.withResolvers(),
        isHasWorkInspect: false,
        isOpenAutoShow_Panel: localStorage.getItem('isOpenAutoShow_Panel') === 'true',
        textareaDefaultVal: `2492：安徽省，\n2497：江苏省，\n2509：黑龙江省，\n2643、2644：山西省，\n2558：河北省`,

    }
    window._ds = _ds

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.append(iframe)
    _ds.iframe = iframe

    hijackXHR(function() {
        const xhr = this;
        // console.log(xhr.responseURL);
        [
            function() {
                if(findURL(xhr.responseURL, ['^https://map-work-online.jd.com/inner/data/get_work_list\\?taskId=.*', '^https://map-work.jd.com/inner/data/get_work_list\\?taskId=.*'])) {
                    const data = JSON.parse(xhr.responseText)
                    if(data.message !== `获取作业数据成功`) return
                    let workList = _ds.annotation.workList = data.result ?? [] //作业列表

                    _ds.annotation.links = data.result?.filter(item => (item.layer == "relation" && item.operateType == "create")) ?? []
                    _ds.waitWorkListP.resolve(true)

                    data.result?.forEach(item => {
                        const {layer, operateType} = item

                        let linkCount = $('#link-count')
                        if(!linkCount) {
                            const countWrapper = document.createElement('div')
                            linkCount = document.createElement('div')
                            const checkBtn = document.createElement('div')
                            const tip = document.createElement('span')
                            countWrapper.className = 'count-wrap'
                            checkBtn.className = 'check-btn'
                            linkCount.id = 'link-count'
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
                                    width: '44px',
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
                            tip.innerText = '（保存后更新）'
                            checkBtn.innerText = '检查'

                            linkCount.onclick = () => {
                                $('.count-panel').style.display = 'block'

                                const countContainer = $('.count-container')
                                countContainer.innerHTML = ''

                                const table = document.createElement('table')
                                const tr_head = document.createElement('tr')
                                const th_sn = document.createElement('th')
                                const th_AOI = document.createElement('th')
                                const th_POI = document.createElement('th');
                                [[th_sn, '序号'], [th_AOI, 'AOI'], [th_POI, 'POI']].forEach(item => (item[0].innerText = item[1]))
                                tr_head.append(th_sn, th_AOI, th_POI)
                                table.append(tr_head)

                                _ds.annotation.links.forEach((item, idx) => {
                                    const tr = document.createElement('tr')
                                    const td_sn = document.createElement('td')
                                    const td_layer = document.createElement('td')
                                    const td_point = document.createElement('td');
                                    [td_layer, td_point].forEach(td => (td.style.cursor = 'pointer'))
                                    td_sn.innerText = idx+1 //面
                                    td_layer.innerText = item.properties.targetId //面
                                    td_point.innerText = item.properties.sourceId; //点

                                    [td_layer, td_point].forEach(td => {
                                        td.onclick = function() {
                                            searchSite(td.textContent)

                                            table.$$('td').forEach(td => {
                                                td.style.background = td == this ? '#222' : null
                                            })

                                        }
                                    })
                                    tr.append(td_sn, td_layer, td_point)
                                    table.append(tr)
                                })
                                countContainer.append(table)
                            }

                            checkBtn.onclick = () => {
                                _ds.checkDialog.display(true)
                            }

                            countWrapper.append(linkCount, tip, checkBtn)
                            $('.container.footer .list-wrap').insertAdjacentElement('afterend', countWrapper)
                        }
                        //55 楼栋面  2 点  1 小区面
                    })
                    $('#link-count').innerText = `关联对数：${_ds.annotation.links.length}`

                }
            },
            function() {
                if(!findURL(xhr.responseURL, ['^https://map-work-online.jd.com/inner/task_record/get_task_details\\?taskId=.*', '^https://map-work.jd.com/inner/task_record/get_task_details\\?taskId=.*'])) return

                const data = JSON.parse(xhr.responseText)
                console.log('task_details', data)
                if(data.message !== '成功') return

                const taskDetail = data.result
                const {taskId, projectId, wktGeom} = taskDetail

                setAddressDefaultVal(projectId)

                let url
                if(location.host == 'jdl-mapdata.jd.com') {
                    url = `https://map-work-online.jd.com/inner/data/get_base_data?bbox=${wktGeom}&layers=0,1,2,3,5,11,55&taskId=${taskId}`
                } else {
                    const coordStr = /MULTIPOLYGON \(\(\((.*)\)\)\)/.exec(wktGeom)?.[1] ?? /POLYGON \(\((.*)\)\)/.exec(wktGeom)?.[1]
                    url = `https://map-work.jd.com/inner/data/get_base_data?bbox=POLYGON((${coordStr}))&layers=0,1,2,3,5,11,55&taskId=${taskId}`
                }
                _ds.iframe.contentWindow.fetch(url, {
                    "mode": "cors",
                    "credentials": "include"
                })
                .then(res => res.json())
                .then(async (res) => {
                    console.log(res)
                    if(!res.success) return

                    const {
                        poi,
                        building_aoi,
                        block_aoi //包括小区及其周围一圈的AOI
                    } = res.result

                    await _ds.waitWorkListP.promise

                    _ds.annotation.linkPOIs = poi.filter(modifyItem => {
                        const link = _ds.annotation.links.find(link => link.properties.sourceId == modifyItem.id)
                        return link ? ((modifyItem.isBuilding = link.properties.targetLayer == '55'), true) : false
                    })

                    const aoi_block_and_building = [block_aoi, building_aoi].reduce((r, item) => Array.isArray(item) ? [...r, ...item] : r, [])

                    _ds.annotation.linkAOIs = aoi_block_and_building.filter(modifyItem => {
                        //去掉未关联的 分割创建的AOI修改记录。（分割起始点和结束点所在的AOI）
                        const link = _ds.annotation.links.find(link => link.properties.targetId == modifyItem.id)
                        return link ? ((modifyItem.isBuilding = link.properties.targetLayer == '55'), true) : false
                    })

                    checkWorkList()
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

    function checkWorkList() {
        const container = document.createElement('div')
        const classification = document.createElement('div')
        const exception = document.createElement('div')
        const exceptionHeader = document.createElement('div')
        const style = document.createElement('style')

        container.className = 'container'
        classification.className = 'classification'
        exception.className = 'exception'

        exceptionHeader.innerText = '异常结果：'
        style.textContent = `
        .element-id {
            cursor: pointer
        }
        li {
            margin-top: 5px
        }`

        setStyle(new Map([
            [container, {
                overflow: 'auto',
                height: '100%',
            }],
            [exception, {
                marginTop: '30px'
            }],
            [exceptionHeader, {
                fontSize: '17px',
                color: '#fff'
            }]
        ]))

        exception.onclick = (e) => {
            if(!e.target.matches('.element-id')) return
            searchSite(e.target.textContent)

        }

        exception.append(exceptionHeader)
        container.append(style, classification, exception)

        const links = _ds.annotation.links
        const communityAOIs = _ds.annotation.workList.filter(workItem => (workItem.layer == 1 && workItem.operateType == 'create')) //切割后小区 AOI

        const checkFlow = [
            //POI名称归类
            function() {
                //收集所有小区名，以小区名为基准，判断是否存在 楼栋POI小区名不存在于小区POI小区名
                const tamplateMap = {}
                const community = _ds.annotation.linkPOIs.filter(poi => !poi.isBuilding)

                links.filter(link => link.properties.targetLayer === '55').forEach(link => {
                    const poiId = link.properties.sourceId
                    const poiInfo = _ds.annotation.linkPOIs.find(poi => poi.id == poiId)
                    const tamplate = poiInfo.properties.name.replace(/(\d+)/g, (match)=> '___')
                    const tamplateValue = tamplateMap[tamplate]
                    if(tamplateValue) {
                        tamplateValue.push(poiInfo)
                    } else {
                        tamplateMap[tamplate] = [poiInfo]
                    }
                })
                const buildingPoiNameCount = document.createElement('div')
                const communityPoiNameWrap = document.createElement('div')
                const communityPoiNameType_header = document.createElement('div')

                buildingPoiNameCount.className = 'building-poi-name-classification'
                communityPoiNameWrap.className = 'community-poi-name-classification'
                const poiNameCheckBox_header = document.createElement('div')
                poiNameCheckBox_header.innerText = '楼栋 POI 名称：'
                communityPoiNameType_header.innerText = '小区 POI 名称：'

                setStyle(new Map([
                    [[communityPoiNameType_header, poiNameCheckBox_header], {
                        fontSize: '17px',
                        color: '#fff'
                    }],
                    [[buildingPoiNameCount, communityPoiNameWrap], {
                        marginBottom: '25px'
                    }]
                ]))

                buildingPoiNameCount.append(poiNameCheckBox_header)

                for(const tamplate in tamplateMap) {
                    const pois = tamplateMap[tamplate]

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
                    tamplateInfo.innerText = `${tamplate}（${pois.length}项）`
                    fold.innerText = '▲'
                    header.onclick = function() {
                        const transform = fold.style.transform
                        fold.style.transform = transform == 'rotate(90deg)' ? 'rotate(180deg)' : 'rotate(90deg)'
                        idWrap.style.height = transform == 'rotate(90deg)' ? idWrap.scrollHeight+'px' : '0'
                    }

                    pois.forEach(poi => {
                        const poiItem = document.createElement('li')
                        poiItem.innerText = poi.properties.name
                        poiItem.style.marginTop = '5px'
                        poiItem.style.cursor = 'pointer'
                        // console.log(poiItem)

                        poiItem.onclick = searchSite.bind(this, poi.id)
                        idWrap.append(poiItem)
                    })


                    header.append(fold, tamplateInfo)
                    checkItem.append(header, idWrap)
                    buildingPoiNameCount.append(checkItem)
                }


                communityPoiNameWrap.append(communityPoiNameType_header)
                community.forEach(poi => {
                    const li = document.createElement('li')
                    const name = document.createElement('span')
                    name.innerText = `${poi.properties.name}`
                    li.style.margin = '5px 0 0 10px'
                    name.style.marginLeft = '-10px'
                    name.style.cursor = 'pointer'

                    name.onclick = searchSite.bind(this, poi.id)
                    li.append(name)
                    communityPoiNameWrap.append(li)
                })
                classification.append(communityPoiNameWrap, buildingPoiNameCount)

                // console.log('tamplateMap', tamplateMap)
                // console.log('community', community)
            },
            //POI地址归类
            function() {
                const addressMap = {}
                _ds.annotation.linkPOIs.forEach(poi => {
                    let addressVal = addressMap[poi.properties.address]
                    if(addressVal) {
                        addressVal.push(poi)
                    } else {
                        addressMap[poi.properties.address] = [poi]
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

                for(const k in addressMap) {
                    const pois = addressMap[k]

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
                    tamplateInfo.innerText = `${k}（${pois.length}项）`
                    fold.innerText = '▲'
                    header.onclick = function() {
                        const transform = fold.style.transform
                        fold.style.transform = transform == 'rotate(90deg)' ? 'rotate(180deg)' : 'rotate(90deg)'
                        idWrap.style.height = transform == 'rotate(90deg)' ? idWrap.scrollHeight+'px' : '0'
                    }

                    pois.forEach(poi => {
                        const poiItem = document.createElement('li')
                        // console.log('poi', poi)
                        poiItem.innerHTML = `${ poi.properties.name}${poi.isBuilding ? '': '<span style="color: #aaa; font-size: 12px; font-weight: 700;">（小区）</span>'}`
                        poiItem.style.marginBottom = '5px'
                        poiItem.style.cursor = 'pointer'

                        poiItem.onclick = searchSite.bind(this, poi.id)
                        idWrap.append(poiItem)
                    })


                    header.append(fold, tamplateInfo)
                    checkItem.append(header, idWrap)
                    classifiedAddressWrap.append(checkItem)
                }
                classification.append(classifiedAddressWrap)
                // console.log('address', addressMap)
            },
            //检查POI重复关联
            function() {
                const countMap = {}
                links.forEach(link => {
                    const areaId = link.properties.targetId
                    const pointId = link.properties.sourceId
                    if(countMap[areaId]) {
                        ++countMap[areaId].count
                        countMap[areaId].points.push(pointId)
                    } else {
                        countMap[areaId] = { count: 1, points: [pointId]}
                    }
                })
                const repeatedIds = []
                for(let aoiId in countMap) {
                    const curItem = countMap[aoiId]
                    if(countMap[aoiId].count > 1) {
                        repeatedIds.push({ aoiId, count: curItem.count, points: curItem.points})
                    }
                }
                repeatedIds.forEach(({aoiId, count, points}) => {
                    const li = document.createElement('li')
                    const pointsStr = points.reduce((counter, point, idx) => {
                        return counter+ `<span class="element-id">${point}</span>${idx !== points.length-1 ? '，' : ''}`
                    }, '')
                    li.innerHTML = `id 为 <span class="element-id">${aoiId}</span> 的 AOI 同时被 ${count} 个POI关联：${pointsStr}`
                    exception.append(li)
                })

            },
            //检查漏关联的情况
            function() {
                //小区 AOI 切割后漏关联
                const communityAOIs_notLink = communityAOIs.filter(workItem => {
                    return !links.find(link => {
                        return link.properties.targetId == workItem.dataId
                    })
                })
                communityAOIs_notLink.forEach(({dataId: aoiId}) => {
                    const li = document.createElement('li')
                    li.innerHTML = `id 为 <span class="element-id">${aoiId}</span> 的 AOI 没有被关联`
                    exception.append(li)
                })
                //id 为 xxxx 的小区AOI切割/合并后未关联

                //缺少小区AOI关联对
                if(!communityAOIs.length && !_ds.annotation.links.find(link => link.properties.targetLayer === '1')) {
                    const li = document.createElement('li')
                    li.innerText = `小区AOI未被关联`
                    exception.append(li)
                }
            },
            //小区AOI（切割/合并后）类型检查
            function() {
                const communityAOIs_unusual = communityAOIs.filter(aoi => aoi.properties.types[0] !== '120302')
                communityAOIs_unusual.forEach(aoi => {
                    const li = document.createElement('li')
                    li.innerHTML = `id为 <span class="element-id">${aoi.dataId}</span> 的小区AOI，类型不为【小区住宅】，请重新确认`
                    exception.append(li)
                })
            },
            //POI类型检查
            function() {
                links.forEach(link => {
                    //通过poi id 查找 modify 或 create 记录，拿到属性值
                    const poiId = link.properties.sourceId
                    const isBuilding = link.properties.targetLayer === '55'
                    const poiInfo = _ds.annotation.linkPOIs.find(poi => poi.id == poiId)
                    if(isBuilding) {
                        if(poiInfo.properties.types[0] !== '190403') {
                            const li = document.createElement('li')
                            li.innerHTML = `id为 <span class="element-id">${poiId}</span> 的 楼栋POI，类型不为 【楼栋号】`
                            exception.append(li)
                        }
                    } else {
                        if(poiInfo.properties.types[0] !== '120302') {
                            const li = document.createElement('li')
                            li.innerHTML = `id为 <span class="element-id">${poiId}</span> 的 小区POI，类型不为 【住宅小区】`
                            exception.append(li)
                        }
                    }
                })
            },
        ]

        checkFlow.forEach(checkFn => checkFn())

        const workDialog = new Dialog({title: '检查', container})
        _ds.checkDialog = workDialog

        if(!$$('.building-poi-name-classification li').length) $('.building-poi-name-classification').style.display = 'none'
        if(!$$('.community-poi-name-classification li').length) $('.community-poi-name-classification').style.display = 'none'
        if(!$$('.poi-address-classification li').length) $('.poi-address-classification').style.display = 'none'
        if(!$$('.exception li').length) $('.exception').style.display = 'none'
    }


    if(await init()) showMessage('脚本运行中...', {type: 'success', showTime: 2000})

    const googleImageWrap = $$('.el-card__body .el-radio-group>*').find(item => item.textContent.includes('谷歌影像'))
    const checkbox_switchMap = document.createElement('input')
    checkbox_switchMap.className = 'switch-map'
    checkbox_switchMap.type = 'checkbox'
    checkbox_switchMap.title = '加入切换'
    checkbox_switchMap.style.marginTop = '1.5px'
    const isSelGoogleMap = localStorage.getItem('isSelGoogleMap')
    checkbox_switchMap.checked = isSelGoogleMap === 'true' ? true : false
    checkbox_switchMap.addEventListener('change', () => {
        localStorage.setItem('isSelGoogleMap', checkbox_switchMap.checked)
    })
    googleImageWrap.style.display = 'flex'
    googleImageWrap.style.alignItems = 'center'
    googleImageWrap.append(checkbox_switchMap)


    const checkDialog = $$('.vdr-container').find(dialog => dialog.$('.resizeable-modal-header')?.textContent == '审核列表')

    const checkbox_autoShow = document.createElement('input')
    checkbox_autoShow.className = 'work-inspect-auto-show'
    checkbox_autoShow.type = 'checkbox'
    checkbox_autoShow.title = '有批注时，自动打开'
    checkbox_autoShow.style.margin = '1px 0 0 5px'
    checkbox_autoShow.checked = _ds.isOpenAutoShow_Panel
    checkbox_autoShow.addEventListener('change', () => {
        localStorage.setItem('isOpenAutoShow_Panel', checkbox_autoShow.checked)
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


    initCountPanel()

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
                                if(getParamValue('mode') == 'edit') analysisName(getFormItem('名称').$('input').value)

                                checkAddress()

                                //保持位置
                                $('.address-wrap') && getFormItem('地址')?.insertAdjacentElement('afterend', $('.address-wrap'))
                                $('.type-wrap') && getFormItem('类型')?.insertAdjacentElement('afterend', $('.type-wrap'))
                            })
                        })
                    }, { childList: true, subtree: true })

                    if(getParamValue('mode') == 'edit') {
                        initResizeBar()
                        initNameItem()
                        initTypeBtns()
                    }
                    initAddressItem()
                    checkAddress()
                }

                if((an?.matches?.('.el-autocomplete') || an?.matches?.('.el-input')) && an?.parentElement?.parentElement.textContent == '名称') {
                    an.$('input').addEventListener('input', function(e) {
                        if(getFormItem('小区标识')) analysisName(this.value)
                    })
                }

                if(an?.matches?.('.el-form-item') && an.$('.member-container')) {
                    an.$$('.member-container input')[1].disabled = true
                }
            })
        })
    }, { childList: true, subtree: true })

    document.addEventListener('keydown', e => {
        console.log(e, e.keyCode)
        if(['input[type="text"]', 'input[type=""]', 'textarea'].find(lab => document.activeElement?.matches(lab))) return

        if(e.keyCode == 9) {
            e.preventDefault()

            const baseMaps = ['腾讯地图', '高德地图', '百度地图', '谷歌地图']
            const imageMaps = ['腾讯影像', '高德影像', '谷歌影像']

            const card = [...$$('.el-card')].find(card => card.textContent.startsWith('底图'));
            const curSel = card.$('.el-radio-group .el-radio.is-checked').textContent
            const maps = isBelongToBaseMap() ? baseMaps : imageMaps

            selectMap(selectMap( isBelongToBaseMap() ? localStorage.getItem('isSelGoogleMap') === 'true' ? '谷歌影像' : '腾讯影像' : '腾讯地图'))

            function selectMap(name) { card.$$('.el-radio-group .el-radio').find(elRadio => elRadio.textContent == name).$('input[type="radio"]').click() }

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
        if(e.keyCode == 71) _ds.checkDialog?.display()

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
            ['.name-wrap', '.type-wrap', '.address-wrap', '.count-wrap', '.switch-map', '.work-inspect-auto-show'].forEach(sel => {
                const el = $(sel);
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

        if(e.key.toUpperCase() == 'X' && !e.ctrlKey) {
            const LinkAOI_id = $$('.member-container input')?.[1].value
            LinkAOI_id && searchSite(LinkAOI_id)
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

        return new Promise(res => {
            obs(document, mrs => {
                // console.log('%c====', 'color: red')
                // console.log('%c====', 'color: red', mrs)
                Array.from(mrs).forEach(mr => {
                    Array.from(mr.addedNodes).forEach(an => {
                        // an.nodeName !== '#text' && !an.nodeValue?.includes('经纬度') && console.log('an', an, mr)
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

                        if(an?.matches?.('.container') && an?.parentElement.id === 'app') {
                            res(true)
                        }
                        if(an?.matches?.('.el-overlay') && an.innerText.startsWith('选择关联')) {
                            an.$('.el-message-box__container .el-radio__original')?.click()

                            if(_ds.isSelLink && an.$$('.el-message-box__container .el-radio__original').length < 2) an.$$('button').find(btn => btn.innerText.includes('确定'))?.click()

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
                            console.log(an)
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

    function initResizeBar() {
        const sidebar = $('.sidebar')
        setStyle(sidebar, {
            transition: '.3s ease-out all',
            top: 'initial',
            bottom: '0',
        })

        const bar = document.createElement('div')
        setStyle(bar, {
            width: '100%',
            height: '6px',
            background: '#eee',
            borderRadius: '5px',
            marginBottom: '5px',
            cursor: 'row-resize',
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
            className: 'associate-btn_wrap'
        })



        const idItem = $$('.sidebar .el-form-item').find(item => item.querySelector('.el-form-item__label')?.innerText === '要素id')
        idItem.style.marginBottom = '10px'
        nameItem.style.marginBottom = '0'
        nameItem.$('input').addEventListener('input', function(e) {
            analysisName(this.value)
        })

        btn.id = 'modify-name'
        btn_replace.id = 'replace-name'
        name_wrap.className = 'name-wrap'
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
        typeWrap.className = 'type-wrap'
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
                 background: '#409eff',
                 color: '#fff',
                 borderRadius: '6px',
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
            className: 'address-wrap',
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

    function getFormItem(label) {
        return $$('.sidebar .el-form-item').find(item => item.querySelector('label')?.innerText === label)
    }

    function initCountPanel() {
        const countPanel = document.createElement('div')
        const openBtn = document.createElement('div')
        const closeBtn = document.createElement('div')
        const container = document.createElement('div')

        countPanel.className = 'count-panel'
        container.className = 'count-container'
        openBtn.textContent = '框数统计'
        closeBtn.textContent = '×'

        setStyle(new Map([
            [countPanel, {
                display: 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '500px',
                height: '350px',
                padding: '35px 15px 15px',
                background: 'rgb(34, 34, 37, .8)',
                textAlign: 'center',
                borderRadius: '5px',
                zIndex: 999,
            }],[closeBtn, {
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '25px',
                height: '25px',
                lineHeight: '21px',
                borderRadius: '5px',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '28px',
                color: '#ccc',
            }],
            [container, {
                overflow: 'auto',
                marginTop: '15px',
                width: '100%',
                height: '300px',
                color: '#fff',
            }]
        ]))

        closeBtn.onclick = () => {
            if(_ds.isOpenCountPanel) return
            _ds.isOpenCountPanel = false
            countPanel.style.display = 'none'

        }

        let isMousedown = false
        let top = 0
        let left = 0
        countPanel.addEventListener('mousedown', e => {
            if(e.button == 1) isMousedown = true
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

        countPanel.append(container, closeBtn)
        document.body.appendChild(countPanel)
    }
})();

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

2024/7/30
- 新增：地址预设值：安徽省
*/